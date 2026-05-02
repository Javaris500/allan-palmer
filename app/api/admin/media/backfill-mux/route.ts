import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";
import { MEDIA_TAGS, PUBLIC_VIDEO_PAGES } from "@/lib/media/cache-tags";

// Repairs Video rows whose Mux status never flipped because the dashboard
// webhook URL was misconfigured. Polls Mux directly for each non-ready row
// (by assetId, or by uploadId if assetId is missing) and writes the
// playbackId + duration + status back to the DB.
//
// Idempotent: rows that are already ready, errored, or that Mux can't
// resolve are skipped. Safe to call repeatedly while sorting out the
// webhook itself.

export const maxDuration = 300;

type Outcome =
  | { id: string; title: string; result: "ready"; playbackId: string }
  | { id: string; title: string; result: "still-processing"; muxStatus: string }
  | { id: string; title: string; result: "errored"; muxStatus: string }
  | { id: string; title: string; result: "skipped"; reason: string };

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

  const stuck = await prisma.video.findMany({
    where: {
      deletedAt: null,
      OR: [
        { muxStatus: { not: "ready" } },
        { muxPlaybackId: null },
      ],
    },
    select: {
      id: true,
      title: true,
      muxAssetId: true,
      muxUploadId: true,
      muxStatus: true,
      muxPlaybackId: true,
    },
  });

  const outcomes: Outcome[] = [];

  for (const row of stuck) {
    let assetId = row.muxAssetId;

    if (!assetId && row.muxUploadId) {
      try {
        const upload = await mux.video.uploads.retrieve(row.muxUploadId);
        assetId = upload.asset_id ?? null;
        if (assetId && assetId !== row.muxAssetId) {
          await prisma.video.update({
            where: { id: row.id },
            data: { muxAssetId: assetId },
          });
        }
      } catch (err) {
        outcomes.push({
          id: row.id,
          title: row.title,
          result: "skipped",
          reason: `upload lookup failed: ${(err as Error).message}`,
        });
        continue;
      }
    }

    if (!assetId) {
      outcomes.push({
        id: row.id,
        title: row.title,
        result: "skipped",
        reason: "no muxAssetId or muxUploadId on row",
      });
      continue;
    }

    let asset;
    try {
      asset = await mux.video.assets.retrieve(assetId);
    } catch (err) {
      outcomes.push({
        id: row.id,
        title: row.title,
        result: "skipped",
        reason: `asset retrieve failed: ${(err as Error).message}`,
      });
      continue;
    }

    if (asset.status === "ready") {
      const publicId =
        asset.playback_ids?.find((p) => p.policy === "public")?.id ??
        asset.playback_ids?.[0]?.id ??
        null;
      if (!publicId) {
        outcomes.push({
          id: row.id,
          title: row.title,
          result: "skipped",
          reason: "asset is ready but has no playback_ids",
        });
        continue;
      }
      await prisma.video.update({
        where: { id: row.id },
        data: {
          muxPlaybackId: publicId,
          muxStatus: "ready",
          durationSec: asset.duration ? Math.round(asset.duration) : undefined,
        },
      });
      outcomes.push({
        id: row.id,
        title: row.title,
        result: "ready",
        playbackId: publicId,
      });
    } else if (asset.status === "errored") {
      await prisma.video.update({
        where: { id: row.id },
        data: { muxStatus: "errored" },
      });
      outcomes.push({
        id: row.id,
        title: row.title,
        result: "errored",
        muxStatus: "errored",
      });
    } else {
      outcomes.push({
        id: row.id,
        title: row.title,
        result: "still-processing",
        muxStatus: asset.status ?? "unknown",
      });
    }
  }

  const readied = outcomes.filter((o) => o.result === "ready").length;

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.backfill_mux",
      metadata: {
        scanned: stuck.length,
        readied,
        outcomes,
      },
    },
  });

  if (readied > 0) {
    revalidateTag(MEDIA_TAGS.videos);
    for (const path of PUBLIC_VIDEO_PAGES) revalidatePath(path);
    revalidatePath("/admin/media");
  }

  return NextResponse.json({
    scanned: stuck.length,
    readied,
    outcomes,
  });
}
