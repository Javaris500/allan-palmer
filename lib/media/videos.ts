import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { VideoPlacement } from "@/generated/prisma";
import { MEDIA_TAGS } from "./cache-tags";

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

export const getVideosByPlacement = unstable_cache(
  async (placement: VideoPlacement): Promise<PublicVideo[]> => {
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
  },
  ["videos-by-placement"],
  { tags: [MEDIA_TAGS.videos], revalidate: 3600 },
);
