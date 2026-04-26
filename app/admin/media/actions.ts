"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { del, head } from "@vercel/blob";
import sharp from "sharp";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MEDIA_TAGS, PUBLIC_PHOTO_PAGES } from "@/lib/media/cache-tags";
import {
  PhotoCategory,
  PhotoPlacement,
} from "@/generated/prisma";

// Only Vercel Blob URLs are accepted as photo sources. Without this an
// admin could pass an arbitrary URL and trick the server into fetching
// it for sharp metadata — a small SSRF surface even though access is
// already gated to a single trusted account.
function isVercelBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

const PHOTO_CATEGORIES = Object.values(PhotoCategory) as [
  PhotoCategory,
  ...PhotoCategory[],
];
const PHOTO_PLACEMENTS = Object.values(PhotoPlacement) as [
  PhotoPlacement,
  ...PhotoPlacement[],
];

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function revalidatePhotoSurfaces() {
  revalidateTag(MEDIA_TAGS.photos);
  for (const path of PUBLIC_PHOTO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");
}

const registerSchema = z.object({
  blobUrl: z.string().url(),
  blobPathname: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  title: z.string().min(1).max(120),
  altText: z.string().min(1).max(240),
  description: z.string().max(800).optional(),
  category: z.enum(PHOTO_CATEGORIES).optional(),
  placement: z.enum(PHOTO_PLACEMENTS).optional(),
  featured: z.boolean().optional(),
});

export type RegisterPhotoInput = z.infer<typeof registerSchema>;

/**
 * Called by the browser after `upload()` resolves. The blob is already in
 * Vercel Blob storage (uploaded via short-lived token). This server action
 * inspects the blob with sharp to populate dimensions, then creates the DB
 * row. If sharp can't parse it, the blob is deleted to avoid storing junk.
 */
export async function registerPhoto(input: RegisterPhotoInput) {
  const session = await requireAdmin();
  const parsed = registerSchema.parse(input);

  if (!isVercelBlobUrl(parsed.blobUrl)) {
    throw new Error("Only Vercel Blob URLs are accepted.");
  }

  // Pull authoritative size + content type from Blob — the client-supplied
  // values are advisory.
  let trustedSize = parsed.sizeBytes;
  let trustedContentType = parsed.contentType;
  try {
    const meta = await head(parsed.blobUrl);
    trustedSize = meta.size;
    trustedContentType = meta.contentType ?? parsed.contentType;
  } catch (err) {
    console.error("[photo.register] head() failed", err);
  }

  let width: number | null = null;
  let height: number | null = null;
  try {
    const res = await fetch(parsed.blobUrl);
    if (!res.ok) throw new Error("Failed to fetch uploaded blob");
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch (err) {
    console.error("[photo.register] sharp validation failed", err);
    await del(parsed.blobUrl).catch((e) =>
      console.error("[photo.register] orphan cleanup failed", e),
    );
    throw new Error(
      "Uploaded file could not be read as an image. Please try a different file.",
    );
  }

  const photo = await prisma.photo.create({
    data: {
      title: parsed.title,
      altText: parsed.altText,
      description: parsed.description?.trim() || null,
      blobUrl: parsed.blobUrl,
      blobPathname: parsed.blobPathname,
      contentType: trustedContentType,
      sizeBytes: trustedSize,
      width,
      height,
      category: parsed.category ?? "OTHER",
      placement: parsed.placement ?? "GALLERY_CAROUSEL",
      featured: parsed.featured ?? false,
      uploadedById: session.user.id,
    },
    select: { id: true },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.upload",
      targetId: photo.id,
      metadata: {
        sizeBytes: trustedSize,
        contentType: trustedContentType,
        placement: parsed.placement ?? "GALLERY_CAROUSEL",
      },
    },
  });

  revalidatePhotoSurfaces();
  return { id: photo.id };
}

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(120).optional(),
  altText: z.string().min(1).max(240).optional(),
  description: z.string().max(800).optional(),
  category: z.enum(PHOTO_CATEGORIES).optional(),
  placement: z.enum(PHOTO_PLACEMENTS).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
});

export async function updatePhoto(input: z.infer<typeof updateSchema>) {
  const session = await requireAdmin();
  const parsed = updateSchema.parse(input);
  const { id, ...rest } = parsed;

  // Singleton placements (e.g. ABOUT_PORTRAIT) should only have one active
  // photo. If we're moving a photo into a singleton slot, soft-delete any
  // other photo in that slot first.
  if (
    rest.placement === "ABOUT_PORTRAIT" ||
    rest.placement === "HOMEPAGE_HERO"
  ) {
    await prisma.photo.updateMany({
      where: {
        placement: rest.placement,
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

  await prisma.photo.update({
    where: { id },
    data: { ...rest, description },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.update",
      targetId: id,
      metadata: rest,
    },
  });

  revalidatePhotoSurfaces();
}

export async function deletePhoto(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // Soft-delete in DB (recoverable metadata) and hard-delete from Blob
  // (no storage charge for invisible files). If the Blob delete fails we
  // still soft-delete in DB; orphans are caught by the daily cleanup cron.
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { blobUrl: true, deletedAt: true },
  });
  if (!photo || photo.deletedAt) return;

  await del(photo.blobUrl).catch((e) =>
    console.error("[photo.delete] blob delete failed", id, e),
  );

  await prisma.photo.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.delete",
      targetId: id,
    },
  });

  revalidatePhotoSurfaces();
}

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export async function reorderPhotos(input: z.infer<typeof reorderSchema>) {
  await requireAdmin();
  const parsed = reorderSchema.parse(input);

  await prisma.$transaction(
    parsed.ids.map((id, index) =>
      prisma.photo.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );

  revalidatePhotoSurfaces();
}
