/**
 * One-time script — imports the existing hardcoded video configs from
 * `lib/video-thumbnails.ts` into the Video table so Allan can manage
 * them through /admin/media. These videos are already on Mux (only their
 * playback IDs and titles live in code), so we only need to:
 *
 *   1. Create a Video row per playback ID
 *   2. Try to look up the corresponding Mux asset via the playback ID to
 *      populate muxAssetId + durationSec. If the asset isn't on the
 *      current Mux account (different MUX_TOKEN_ID), the row is still
 *      created with the playback ID and status="ready" — public site
 *      keeps working, but delete-from-Mux won't be possible until the
 *      asset is resolved.
 *
 * Idempotent: skips any playbackId that already has a non-deleted Video
 * row.
 *
 * Run:    npm run db:seed-videos
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import Mux from "@mux/mux-node";
import { PrismaClient, type VideoCategory } from "../generated/prisma";
import { getAllVideoConfigs } from "../lib/video-thumbnails";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  throw new Error("MUX_TOKEN_ID + MUX_TOKEN_SECRET must be set in env.");
}
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

function inferCategory(
  title: string,
  description: string,
  category: string | undefined,
): VideoCategory {
  if (category) {
    const upper = category.toUpperCase();
    if (
      ["WEDDING", "CONCERT", "CORPORATE", "PRIVATE", "LESSONS", "OTHER"]
        .includes(upper)
    ) {
      return upper as VideoCategory;
    }
  }
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("wedding") || text.includes("ceremony"))
    return "WEDDING";
  if (text.includes("concert") || text.includes("stage")) return "CONCERT";
  if (text.includes("corporate")) return "CORPORATE";
  if (text.includes("lesson")) return "LESSONS";
  return "OTHER";
}

async function main() {
  const configs = getAllVideoConfigs();

  // De-dupe in case the source has the same playbackId twice
  const seen = new Set<string>();
  const unique = configs.filter((c) => {
    if (seen.has(c.playbackId)) return false;
    seen.add(c.playbackId);
    return true;
  });

  // Skip any already-seeded
  const existing = await prisma.video.findMany({
    where: {
      muxPlaybackId: { in: unique.map((c) => c.playbackId) },
      deletedAt: null,
    },
    select: { muxPlaybackId: true },
  });
  const alreadyDone = new Set(
    existing.map((e) => e.muxPlaybackId).filter(Boolean) as string[],
  );

  const toSeed = unique.filter((c) => !alreadyDone.has(c.playbackId));

  if (toSeed.length === 0) {
    console.log(
      `Already seeded: ${alreadyDone.size} videos. Nothing to do.`,
    );
    return;
  }

  console.log(`Seeding ${toSeed.length} videos…`);

  let order = 0;
  let resolvedAssets = 0;
  let unresolvedAssets = 0;

  for (const config of toSeed) {
    let muxAssetId: string | null = null;
    let durationSec: number | null = null;

    try {
      const playback = await mux.video.playbackIds.retrieve(
        config.playbackId,
      );
      const assetId = playback.object?.id;
      if (assetId) {
        const asset = await mux.video.assets.retrieve(assetId);
        muxAssetId = asset.id ?? assetId;
        durationSec = asset.duration ? Math.round(asset.duration) : null;
        resolvedAssets++;
      }
    } catch {
      // Asset not on this Mux account — still create the row so the
      // public site sees it. Allan can re-upload through admin if he
      // wants delete-from-Mux capability.
      unresolvedAssets++;
    }

    await prisma.video.create({
      data: {
        title: config.title,
        description: config.description || null,
        muxAssetId,
        muxPlaybackId: config.playbackId,
        muxStatus: "ready",
        durationSec,
        thumbnailTime: config.thumbnailTime ?? 8,
        category: inferCategory(
          config.title,
          config.description,
          config.category,
        ),
        placement: "GALLERY_GRID",
        featured: false,
        displayOrder: order++,
      },
    });

    console.log(
      `  ✓ ${config.title}${
        muxAssetId ? "" : " (Mux asset not in current account)"
      }`,
    );
  }

  console.log(
    `Done. ${order} videos seeded. ${resolvedAssets} resolved on Mux, ${unresolvedAssets} unresolved.`,
  );
  if (unresolvedAssets > 0) {
    console.log(
      "Unresolved videos still play (Mux serves them publicly), but delete-from-Mux from admin won't work until they're re-uploaded.",
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
