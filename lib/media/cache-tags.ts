import type { PhotoPlacement, VideoPlacement } from "@/generated/prisma";

export const MEDIA_TAGS = {
  photos: "photos",
  videos: "videos",
  photoPlacement: (p: PhotoPlacement) => `photos:${p}`,
  videoPlacement: (p: VideoPlacement) => `videos:${p}`,
} as const;

export const PUBLIC_PHOTO_PAGES = ["/", "/about", "/gallery"] as const;
export const PUBLIC_VIDEO_PAGES = ["/", "/gallery"] as const;
