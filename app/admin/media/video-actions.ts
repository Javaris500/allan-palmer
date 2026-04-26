"use server";

import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mux } from "@/lib/mux";
import { MEDIA_TAGS, PUBLIC_VIDEO_PAGES } from "@/lib/media/cache-tags";
import { rateLimitMediaUpload } from "@/lib/rate-limit";
import { VideoCategory, VideoPlacement } from "@/generated/prisma";

const ALLOWED_CORS_ORIGINS = [
  "http://localhost:3000",
  "https://www.allanpalmerviolinist.com",
  "https://allanpalmerviolinist.com",
  "https://allan-palmer.vercel.app",
] as const;
const DEFAULT_CORS_ORIGIN: string = "https://www.allanpalmerviolinist.com";

const VIDEO_CATEGORIES = Object.values(VideoCategory) as [
  VideoCategory,
  ...VideoCategory[],
];
const VIDEO_PLACEMENTS = Object.values(VideoPlacement) as [
  VideoPlacement,
  ...VideoPlacement[],
];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidateVideoSurfaces() {
  revalidateTag(MEDIA_TAGS.videos);
  for (const path of PUBLIC_VIDEO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");
}

const createUploadSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(800).optional(),
  placement: z.enum(VIDEO_PLACEMENTS).optional(),
  category: z.enum(VIDEO_CATEGORIES).optional(),
});

export type CreateUploadInput = z.infer<typeof createUploadSchema>;

/**
 * Step 1 of the Mux upload flow.
 *
 * Creates a Mux direct-upload session and a placeholder Video row so the
 * admin UI can show "uploading…" before Mux finishes processing. Returns
 * the signed Mux URL the browser PUTs the file to. Once Mux finishes
 * processing it fires `video.asset.ready` to /api/webhooks/mux which
 * patches the row with playback IDs + duration.
 */
export async function createVideoUpload(input: CreateUploadInput) {
  const session = await requireAdmin();

  const limit = await rateLimitMediaUpload(session.user.id);
  if (!limit.success) {
    throw new Error("Too many uploads. Try again in a few minutes.");
  }

  const parsed = createUploadSchema.parse(input);

  // Pin the Mux upload's CORS allowlist to the actual origin doing the
  // upload — narrower than a wildcard. Falls back to NEXT_PUBLIC_SITE_URL
  // for non-browser callers (none today, but defensive).
  const headerList = await headers();
  const requestOrigin = headerList.get("origin");
  const corsOrigin: string =
    requestOrigin &&
    (ALLOWED_CORS_ORIGINS as readonly string[]).includes(requestOrigin)
      ? requestOrigin
      : process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_CORS_ORIGIN;

  const upload = await mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policies: ["public"],
      video_quality: "basic",
    },
  });

  const row = await prisma.video.create({
    data: {
      title: parsed.title,
      description: parsed.description?.trim() || null,
      placement: parsed.placement ?? "GALLERY_GRID",
      category: parsed.category ?? "WEDDING",
      muxUploadId: upload.id,
      muxStatus: "preparing",
      uploadedById: session.user.id,
    },
    select: { id: true },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.upload_started",
      targetId: row.id,
      metadata: {
        placement: parsed.placement ?? "GALLERY_GRID",
        muxUploadId: upload.id,
      },
    },
  });

  revalidateVideoSurfaces();

  return {
    videoId: row.id,
    muxUploadUrl: upload.url,
    muxUploadId: upload.id,
  };
}

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(800).optional(),
  category: z.enum(VIDEO_CATEGORIES).optional(),
  placement: z.enum(VIDEO_PLACEMENTS).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
  thumbnailTime: z.number().int().min(0).max(3600).optional(),
});

export async function updateVideo(input: z.infer<typeof updateSchema>) {
  const session = await requireAdmin();
  const parsed = updateSchema.parse(input);
  const { id, ...rest } = parsed;

  if (rest.placement === "HOMEPAGE_HERO") {
    await prisma.video.updateMany({
      where: {
        placement: "HOMEPAGE_HERO",
        deletedAt: null,
        NOT: { id },
      },
      data: { placement: "UNUSED" },
    });
  }

  const description =
    rest.description === undefined
      ? undefined
      : rest.description.trim() || null;

  await prisma.video.update({
    where: { id },
    data: { ...rest, description },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.update",
      targetId: id,
      metadata: rest,
    },
  });

  revalidateVideoSurfaces();
}

export async function deleteVideo(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const video = await prisma.video.findUnique({
    where: { id },
    select: { muxAssetId: true, deletedAt: true },
  });
  if (!video || video.deletedAt) return;

  if (video.muxAssetId) {
    await mux.video.assets
      .delete(video.muxAssetId)
      .catch((e) =>
        console.error("[video.delete] mux asset delete failed", id, e),
      );
  }

  await prisma.video.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "video.delete",
      targetId: id,
    },
  });

  revalidateVideoSurfaces();
}

/**
 * Manual refresh — useful in local dev where webhooks can't reach you.
 * Polls Mux for the upload's resulting asset and patches our row.
 */
export async function refreshVideoStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const video = await prisma.video.findUnique({
    where: { id },
    select: { muxUploadId: true, muxAssetId: true, muxStatus: true },
  });
  if (!video) return;

  let assetId = video.muxAssetId;

  if (!assetId && video.muxUploadId) {
    const upload = await mux.video.uploads.retrieve(video.muxUploadId);
    if (upload.asset_id) assetId = upload.asset_id;
  }

  if (!assetId) {
    revalidateVideoSurfaces();
    return;
  }

  const asset = await mux.video.assets.retrieve(assetId);
  const playbackId = asset.playback_ids?.[0]?.id ?? null;
  const status = asset.status === "ready" ? "ready" : asset.status ?? "preparing";

  await prisma.video.update({
    where: { id },
    data: {
      muxAssetId: assetId,
      muxPlaybackId: playbackId,
      muxStatus: status,
      durationSec: asset.duration ? Math.round(asset.duration) : undefined,
    },
  });

  revalidateVideoSurfaces();
}
