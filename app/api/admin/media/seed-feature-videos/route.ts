import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";
import { MEDIA_TAGS, PUBLIC_VIDEO_PAGES } from "@/lib/media/cache-tags";
import type { VideoPlacement } from "@/generated/prisma";

// Admin-triggered: apply the VideoPlacement enum migration (adds
// HOMEPAGE_ON_STAGE + ABOUT_FEATURE) and seed the 3 featured Mux
// playback IDs into their placements.
//
// Idempotent. Safe to re-run.

export const maxDuration = 300;

type SeedJob = {
  placement: VideoPlacement;
  isSingleton: boolean;
  playbackIds: { id: string; title: string }[];
};

const JOBS: SeedJob[] = [
  {
    placement: "HOMEPAGE_ON_STAGE",
    isSingleton: false,
    playbackIds: [
      { id: "IbkO01rMhCQeGAlIuUsravD6jyqBa012lpyu46mtZg1As", title: "On Stage 1" },
      { id: "nQ1pnPAn01veA18yCqq67wJkEXuyo8phQhuOF6RqVgMM", title: "On Stage 2" },
    ],
  },
  {
    placement: "ABOUT_FEATURE",
    isSingleton: true,
    playbackIds: [
      { id: "8pkl01QhmUoyNEl01Kt4UUnCYYpA7DTyrITTQIDl4RGf4", title: "About Feature" },
    ],
  },
];

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Apply enum migration. ALTER TYPE ADD VALUE IF NOT EXISTS is a
  //    no-op on rerun. Must be standalone (not in a transaction).
  await prisma.$executeRawUnsafe(
    `ALTER TYPE "VideoPlacement" ADD VALUE IF NOT EXISTS 'HOMEPAGE_ON_STAGE'`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TYPE "VideoPlacement" ADD VALUE IF NOT EXISTS 'ABOUT_FEATURE'`,
  );

  const muxConfigured = Boolean(
    process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET,
  );

  const results: Array<{
    placement: VideoPlacement;
    skipped?: { reason: string; existing: number };
    seededCount?: number;
    seeded?: { title: string; id: string; playbackId: string; resolved: boolean }[];
    skippedAssets?: { playbackId: string; reason: string }[];
  }> = [];

  for (const job of JOBS) {
    // Singletons: skip if ANY row exists for this placement so we don't
    // collide with an Allan-uploaded replacement. Multi: skip only the
    // playback IDs that already exist.
    if (job.isSingleton) {
      const existing = await prisma.video.count({
        where: { placement: job.placement, deletedAt: null },
      });
      if (existing > 0) {
        results.push({
          placement: job.placement,
          skipped: {
            reason: `Skipped singleton — ${existing} active ${job.placement} row(s) already exist; preserving Allan's upload.`,
            existing,
          },
        });
        continue;
      }
    }

    const existingRows = await prisma.video.findMany({
      where: {
        muxPlaybackId: { in: job.playbackIds.map((p) => p.id) },
        deletedAt: null,
      },
      select: { muxPlaybackId: true },
    });
    const alreadyDone = new Set(
      existingRows.map((r) => r.muxPlaybackId).filter(Boolean) as string[],
    );

    const toSeed = job.playbackIds.filter((p) => !alreadyDone.has(p.id));

    if (toSeed.length === 0) {
      results.push({
        placement: job.placement,
        skipped: {
          reason: `Already seeded — all ${job.playbackIds.length} playback ID(s) exist.`,
          existing: alreadyDone.size,
        },
      });
      continue;
    }

    const maxOrder = await prisma.video.findFirst({
      where: { placement: job.placement, deletedAt: null },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    let order = (maxOrder?.displayOrder ?? -1) + 1;

    const seeded: {
      title: string;
      id: string;
      playbackId: string;
      resolved: boolean;
    }[] = [];
    const skippedAssets: { playbackId: string; reason: string }[] = [];

    for (const item of toSeed) {
      let muxAssetId: string | null = null;
      let durationSec: number | null = null;

      if (muxConfigured) {
        try {
          const playback = await mux.video.playbackIds.retrieve(item.id);
          const assetId = playback.object?.id;
          if (assetId) {
            const asset = await mux.video.assets.retrieve(assetId);
            muxAssetId = asset.id ?? assetId;
            durationSec = asset.duration ? Math.round(asset.duration) : null;
          }
        } catch {
          // Asset not on this Mux account — still create the row so the
          // public site sees it.
        }
      }

      try {
        const row = await prisma.video.create({
          data: {
            title: item.title,
            description: null,
            muxAssetId,
            muxPlaybackId: item.id,
            muxStatus: "ready",
            durationSec,
            thumbnailTime: 8,
            category: "OTHER",
            placement: job.placement,
            featured: false,
            displayOrder: order,
            uploadedById: session.user.id,
          },
          select: { id: true },
        });
        seeded.push({
          title: item.title,
          id: row.id,
          playbackId: item.id,
          resolved: muxAssetId !== null,
        });
        order++;
      } catch (err) {
        skippedAssets.push({
          playbackId: item.id,
          reason: `db create failed: ${(err as Error).message}`,
        });
      }
    }

    results.push({
      placement: job.placement,
      seededCount: seeded.length,
      seeded,
      skippedAssets,
    });
  }

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.seed_feature_videos",
      metadata: { results },
    },
  });

  revalidateTag(MEDIA_TAGS.videos);
  for (const path of PUBLIC_VIDEO_PAGES) revalidatePath(path);
  revalidatePath("/about");
  revalidatePath("/admin/media");

  return NextResponse.json({
    migrationApplied: true,
    muxConfigured,
    results,
  });
}
