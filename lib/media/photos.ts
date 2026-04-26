import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { PhotoPlacement } from "@/generated/prisma";
import { MEDIA_TAGS } from "./cache-tags";

export type PublicPhoto = {
  id: string;
  title: string;
  altText: string;
  description: string | null;
  blobUrl: string;
  width: number | null;
  height: number | null;
  category: string;
  featured: boolean;
  displayOrder: number;
};

export const getPhotosByPlacement = unstable_cache(
  async (placement: PhotoPlacement): Promise<PublicPhoto[]> => {
    const rows = await prisma.photo.findMany({
      where: { placement, deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        altText: true,
        description: true,
        blobUrl: true,
        width: true,
        height: true,
        category: true,
        featured: true,
        displayOrder: true,
      },
    });
    return rows;
  },
  ["photos-by-placement"],
  { tags: [MEDIA_TAGS.photos], revalidate: 3600 },
);

export const getSingletonPhoto = unstable_cache(
  async (placement: PhotoPlacement): Promise<PublicPhoto | null> => {
    return prisma.photo.findFirst({
      where: { placement, deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        altText: true,
        description: true,
        blobUrl: true,
        width: true,
        height: true,
        category: true,
        featured: true,
        displayOrder: true,
      },
    });
  },
  ["photo-singleton"],
  { tags: [MEDIA_TAGS.photos], revalidate: 3600 },
);
