import { prisma } from "@/lib/prisma";
import type { VideoPlacement } from "@/generated/prisma";

export type PublicVideo = {
  id: string;
  title: string;
  description: string | null;
  muxPlaybackId: string;
  durationSec: number | null;
  thumbnailTime: number;
  category: string;
  featured: boolean;
  displayOrder: number;
};

// Direct Prisma read per request. See note in photos.ts — the consuming
// pages are all dynamic, and unstable_cache's revalidateTag wasn't
// reliably busting on Vercel for these placements.
export async function getVideosByPlacement(
  placement: VideoPlacement,
): Promise<PublicVideo[]> {
  const rows = await prisma.video.findMany({
    where: {
      placement,
      deletedAt: null,
      muxStatus: "ready",
      NOT: { muxPlaybackId: null },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      muxPlaybackId: true,
      durationSec: true,
      thumbnailTime: true,
      category: true,
      featured: true,
      displayOrder: true,
    },
  });
  return rows
    .filter((r): r is typeof r & { muxPlaybackId: string } =>
      Boolean(r.muxPlaybackId),
    )
    .map((r) => ({ ...r, muxPlaybackId: r.muxPlaybackId }));
}
