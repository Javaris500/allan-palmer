import { prisma } from "@/lib/prisma";
import type { PhotoPlacement } from "@/generated/prisma";

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

// Hit Prisma directly on every call. The pages that consume these helpers
// (/, /about, /gallery) are all dynamic, so a per-request DB read is
// cheap and — unlike unstable_cache — guarantees admin uploads surface
// the moment the next request lands.
export async function getPhotosByPlacement(
  placement: PhotoPlacement,
): Promise<PublicPhoto[]> {
  return prisma.photo.findMany({
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
}

export async function getSingletonPhoto(
  placement: PhotoPlacement,
): Promise<PublicPhoto | null> {
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
}
