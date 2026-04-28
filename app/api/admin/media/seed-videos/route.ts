import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";
import { getAllVideoConfigs } from "@/lib/video-thumbnails";
import { MEDIA_TAGS, PUBLIC_VIDEO_PAGES } from "@/lib/media/cache-tags";
import type { VideoCategory } from "@/generated/prisma";

// Admin-triggered server-side seed for videos. Creates Video rows for the
// hardcoded Mux playback IDs in lib/video-thumbnails.ts, with each row's
// muxAssetId + durationSec resolved via Mux when the asset belongs to the
// configured Mux account.
//
// Idempotent: skips any playbackId already present (deletedAt IS NULL).

export const maxDuration = 300;

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
  if (text.includes("wedding") || text.includes("ceremony")) return "WEDDING";
  if (text.includes("concert") || text.includes("stage")) return "CONCERT";
  if (text.includes("corporate")) return "CORPORATE";
  if (text.includes("lesson")) return "LESSONS";
  return "OTHER";
}

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return NextResponse.json(
      { error: "MUX_TOKEN_ID / MUX_TOKEN_SECRET not configured." },
      { status: 500 },
    );
  }

  const configs = getAllVideoConfigs();

  // De-dupe in case the source has the same playbackId twice
  const seen = new Set<string>();
  const unique = configs.filter((c) => {
    if (seen.has(c.playbackId)) return false;
    seen.add(c.playbackId);
    return true;
  });

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
    return NextResponse.json({
      skipped: true,
      reason: `Already seeded: ${alreadyDone.size} videos exist with these playback IDs.`,
      existing: alreadyDone.size,
    });
  }

  const maxOrder = await prisma.video.findFirst({
    where: { placement: "GALLERY_GRID", deletedAt: null },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });
  let order = (maxOrder?.displayOrder ?? -1) + 1;

  const seeded: { title: string; id: string; resolved: boolean }[] = [];
  const skipped: { title: string; reason: string }[] = [];

  for (const config of toSeed) {
    let muxAssetId: string | null = null;
    let durationSec: number | null = null;

    try {
      const playback = await mux.video.playbackIds.retrieve(config.playbackId);
      const assetId = playback.object?.id;
      if (assetId) {
        const asset = await mux.video.assets.retrieve(assetId);
        muxAssetId = asset.id ?? assetId;
        durationSec = asset.duration ? Math.round(asset.duration) : null;
      }
    } catch {
      // Asset not on this Mux account — still create the row so the
      // public site sees it. Allan can re-upload through admin if he
      // wants delete-from-Mux capability.
    }

    try {
      const row = await prisma.video.create({
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
          displayOrder: order,
          uploadedById: session.user.id,
        },
        select: { id: true },
      });
      seeded.push({ title: config.title, id: row.id, resolved: muxAssetId !== null });
      order++;
    } catch (err) {
      skipped.push({
        title: config.title,
        reason: `db create failed: ${(err as Error).message}`,
      });
    }
  }

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.seed_gallery",
      metadata: {
        seededCount: seeded.length,
        skippedCount: skipped.length,
        resolvedCount: seeded.filter((s) => s.resolved).length,
        skipped,
      },
    },
  });

  revalidateTag(MEDIA_TAGS.videos);
  for (const path of PUBLIC_VIDEO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");

  return NextResponse.json({
    seededCount: seeded.length,
    skippedCount: skipped.length,
    resolvedCount: seeded.filter((s) => s.resolved).length,
    seeded,
    skipped,
  });
}
