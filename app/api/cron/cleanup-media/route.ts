import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";

export const runtime = "nodejs";

/**
 * Daily media cleanup.
 *
 * Vercel Cron triggers this once a day (configured in vercel.json). The
 * incoming request is signed with `Authorization: Bearer <CRON_SECRET>`
 * by Vercel — we refuse anything else so the route can't be hammered.
 *
 * Cleanup tasks:
 *
 * 1. Stuck Mux uploads — delete Video rows still in `preparing` state
 *    after 24h. These are aborted uploads (browser closed, network
 *    failure, etc.) that will never resolve. We also try to cancel the
 *    Mux upload session so it doesn't hang in their dashboard.
 *
 * 2. Soft-deleted Photo rows — in case the inline blob delete failed,
 *    pick up any rows where `deletedAt` is set and the blob URL still
 *    appears reachable, and remove the blob. (This is best-effort; we
 *    don't surface errors to the user.)
 */
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    console.error("[cron.cleanup] CRON_SECRET not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const authz = request.headers.get("authorization");
  if (authz !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 1. Cancel + delete stuck Mux uploads
  const stuck = await prisma.video.findMany({
    where: {
      muxStatus: "preparing",
      deletedAt: null,
      createdAt: { lt: cutoff },
    },
    select: { id: true, muxUploadId: true, muxAssetId: true },
  });

  for (const v of stuck) {
    if (v.muxUploadId) {
      await mux.video.uploads
        .cancel(v.muxUploadId)
        .catch((e) =>
          console.error("[cron.cleanup] mux upload cancel failed", v.id, e),
        );
    }
    if (v.muxAssetId) {
      await mux.video.assets
        .delete(v.muxAssetId)
        .catch((e) =>
          console.error("[cron.cleanup] mux asset delete failed", v.id, e),
        );
    }
  }

  const stuckIds = stuck.map((v) => v.id);
  if (stuckIds.length > 0) {
    await prisma.video.updateMany({
      where: { id: { in: stuckIds } },
      data: { deletedAt: new Date(), muxStatus: "errored" },
    });
  }

  // 2. Sweep orphan blobs for soft-deleted photos
  const softDeleted = await prisma.photo.findMany({
    where: { deletedAt: { lt: cutoff } },
    select: { id: true, blobUrl: true },
    take: 200,
  });

  let blobDeleted = 0;
  for (const p of softDeleted) {
    try {
      await del(p.blobUrl);
      blobDeleted++;
    } catch {
      // Already gone or never existed — fine.
    }
  }

  return NextResponse.json({
    ok: true,
    stuckVideosCleaned: stuckIds.length,
    orphanBlobsDeleted: blobDeleted,
    timestamp: new Date().toISOString(),
  });
}
