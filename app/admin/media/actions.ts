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

  // Anything that throws past this point gets recorded in admin_actions
  // before re-throwing, so the next failed attempt leaves a DB trail.
  // Without this, errors vanish into the browser console — and prod
  // strips console output, so we never see them at all.
  async function logFailure(stage: string, err: unknown, extra?: Record<string, unknown>) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[photo.register] ${stage} failed`, err);
    try {
      await prisma.adminAction.create({
        data: {
          userId: session.user.id,
          action: `photo.upload_failed.${stage}`,
          metadata: {
            message,
            blobUrl: input.blobUrl,
            blobPathname: input.blobPathname,
            contentType: input.contentType,
            sizeBytes: input.sizeBytes,
            placement: input.placement,
            ...extra,
          },
        },
      });
    } catch (logErr) {
      console.error("[photo.register] failure log itself failed", logErr);
    }
  }

  let parsed: ReturnType<typeof registerSchema.parse>;
  try {
    parsed = registerSchema.parse(input);
  } catch (err) {
    await logFailure("validation", err, {
      zodIssues:
        err instanceof z.ZodError ? err.issues : undefined,
    });
    throw err;
  }

  if (!isVercelBlobUrl(parsed.blobUrl)) {
    const err = new Error("Only Vercel Blob URLs are accepted.");
    await logFailure("blob_url_check", err);
    throw err;
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
    // Non-fatal — fall back to the client-supplied values. We log it but
    // don't throw, since head() can occasionally lag behind put() and a
    // retry isn't worth blocking the upload.
    console.error("[photo.register] head() failed", err);
  }

  let width: number | null = null;
  let height: number | null = null;
  try {
    const res = await fetch(parsed.blobUrl);
    if (!res.ok) throw new Error(`Failed to fetch uploaded blob (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch (err) {
    await logFailure("sharp_validation", err);
    await del(parsed.blobUrl).catch((e) =>
      console.error("[photo.register] orphan cleanup failed", e),
    );
    throw new Error(
      "Uploaded file could not be read as an image. Please try a different file.",
    );
  }

  let photo;
  try {
    photo = await prisma.photo.create({
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
  } catch (err) {
    await logFailure("db_create", err);
    throw err;
  }

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

const replaceBlobSchema = z.object({
  id: z.string().min(1),
  blobUrl: z.string().url(),
  blobPathname: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

export type ReplacePhotoBlobInput = z.infer<typeof replaceBlobSchema>;

/**
 * Swap the underlying blob on an existing photo without losing metadata
 * (title, altText, description, placement, displayOrder, featured all
 * stay). Validates the new blob with sharp, deletes the old blob from
 * Vercel Blob storage on success, and patches the DB row in place.
 *
 * Use case: Allan wants to re-take a gallery photo without disturbing
 * order or having to re-type alt text.
 */
export async function replacePhotoBlob(input: ReplacePhotoBlobInput) {
  const session = await requireAdmin();

  async function logFailure(stage: string, err: unknown, extra?: Record<string, unknown>) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[photo.replace] ${stage} failed`, err);
    try {
      await prisma.adminAction.create({
        data: {
          userId: session.user.id,
          action: `photo.replace_failed.${stage}`,
          targetId: input.id,
          metadata: {
            message,
            blobUrl: input.blobUrl,
            blobPathname: input.blobPathname,
            ...extra,
          },
        },
      });
    } catch (logErr) {
      console.error("[photo.replace] failure log itself failed", logErr);
    }
  }

  let parsed: ReturnType<typeof replaceBlobSchema.parse>;
  try {
    parsed = replaceBlobSchema.parse(input);
  } catch (err) {
    await logFailure("validation", err, {
      zodIssues: err instanceof z.ZodError ? err.issues : undefined,
    });
    throw err;
  }

  if (!isVercelBlobUrl(parsed.blobUrl)) {
    const err = new Error("Only Vercel Blob URLs are accepted.");
    await logFailure("blob_url_check", err);
    throw err;
  }

  const existing = await prisma.photo.findUnique({
    where: { id: parsed.id },
    select: { blobUrl: true, blobPathname: true, deletedAt: true },
  });
  if (!existing || existing.deletedAt) {
    const err = new Error("Photo not found or has been deleted.");
    await logFailure("not_found", err);
    throw err;
  }

  // Pull authoritative size + content type from Blob.
  let trustedSize = parsed.sizeBytes;
  let trustedContentType = parsed.contentType;
  try {
    const meta = await head(parsed.blobUrl);
    trustedSize = meta.size;
    trustedContentType = meta.contentType ?? parsed.contentType;
  } catch (err) {
    console.error("[photo.replace] head() failed", err);
  }

  // Sharp-validate the new file. If unreadable, delete the just-uploaded
  // orphan blob and fail loudly — leave the existing photo's blob alone.
  let width: number | null = null;
  let height: number | null = null;
  try {
    const res = await fetch(parsed.blobUrl);
    if (!res.ok) throw new Error(`Failed to fetch new blob (${res.status})`);
    const buf = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(buf).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch (err) {
    await logFailure("sharp_validation", err);
    await del(parsed.blobUrl).catch((e) =>
      console.error("[photo.replace] orphan cleanup failed", e),
    );
    throw new Error(
      "Replacement file could not be read as an image. Please try a different file.",
    );
  }

  // Patch the row, then delete the OLD blob. Order matters — if blob
  // delete fails, the DB row is already pointing at the new blob, and
  // the orphan old blob is just a small storage cost (caught by the
  // daily cleanup cron).
  try {
    await prisma.photo.update({
      where: { id: parsed.id },
      data: {
        blobUrl: parsed.blobUrl,
        blobPathname: parsed.blobPathname,
        contentType: trustedContentType,
        sizeBytes: trustedSize,
        width,
        height,
      },
    });
  } catch (err) {
    await logFailure("db_update", err);
    // New blob is now orphaned — clean it up so we don't pay for it.
    await del(parsed.blobUrl).catch((e) =>
      console.error("[photo.replace] new blob cleanup failed", e),
    );
    throw err;
  }

  await del(existing.blobUrl).catch((e) =>
    console.error("[photo.replace] old blob delete failed", parsed.id, e),
  );

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.replace",
      targetId: parsed.id,
      metadata: {
        oldBlobPathname: existing.blobPathname,
        newBlobPathname: parsed.blobPathname,
        sizeBytes: trustedSize,
        contentType: trustedContentType,
      },
    },
  });

  revalidatePhotoSurfaces();
  return { id: parsed.id };
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
