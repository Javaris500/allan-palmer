import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { defaultGalleryPhotos } from "@/lib/media/default-gallery-photos";
import { MEDIA_TAGS, PUBLIC_PHOTO_PAGES } from "@/lib/media/cache-tags";

// Admin-triggered server-side seed. Imports defaultGalleryPhotos from
// /public/images into Vercel Blob + the Photo table.
//
// Why not just run scripts/seed-gallery-photos.ts locally? Because local
// .env.local DATABASE_URL may point at a different DB than prod. This
// route runs INSIDE the Vercel function with prod env injected, so the
// seed unambiguously targets the prod DB.
//
// Idempotent: if any GALLERY_CAROUSEL row already starts with
// blobPathname=seeded-gallery/, returns early without doing anything.

export const maxDuration = 300;

function inferCategory(
  title: string,
  alt: string,
): "WEDDING" | "CONCERT" | "PORTRAIT" | "OTHER" {
  const text = `${title} ${alt}`.toLowerCase();
  if (text.includes("wedding") || text.includes("ceremony") || text.includes("bride"))
    return "WEDDING";
  if (text.includes("concert") || text.includes("stage") || text.includes("cathedral"))
    return "CONCERT";
  if (text.includes("portrait")) return "PORTRAIT";
  return "OTHER";
}

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN not configured on this environment." },
      { status: 500 },
    );
  }

  const existing = await prisma.photo.count({
    where: {
      placement: "GALLERY_CAROUSEL",
      blobPathname: { startsWith: "seeded-gallery/" },
      deletedAt: null,
    },
  });
  if (existing > 0) {
    return NextResponse.json({
      skipped: true,
      reason: `Already seeded: ${existing} GALLERY_CAROUSEL rows with seeded-gallery/* pathnames exist.`,
      existing,
    });
  }

  // Don't collide with existing Allan uploads — push seeded photos to the
  // end of the displayOrder so his uploads stay first.
  const maxOrder = await prisma.photo.findFirst({
    where: { placement: "GALLERY_CAROUSEL", deletedAt: null },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });
  let order = (maxOrder?.displayOrder ?? -1) + 1;

  const seeded: { title: string; id: string; displayOrder: number }[] = [];
  const skipped: { title: string; reason: string }[] = [];

  for (const photo of defaultGalleryPhotos) {
    const localPath = join(process.cwd(), "public", photo.src);
    let bytes: Buffer;
    try {
      bytes = await readFile(localPath);
    } catch (err) {
      skipped.push({
        title: photo.title,
        reason: `read failed: ${(err as Error).message}`,
      });
      continue;
    }

    const ext = photo.src.split(".").pop()?.toLowerCase() ?? "jpg";
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "avif"
            ? "image/avif"
            : "image/jpeg";

    const filename = photo.src.split("/").pop() ?? `photo-${photo.id}.${ext}`;

    let blob;
    try {
      blob = await put(`seeded-gallery/${filename}`, bytes, {
        access: "public",
        contentType,
        addRandomSuffix: true,
      });
    } catch (err) {
      skipped.push({
        title: photo.title,
        reason: `blob put failed: ${(err as Error).message}`,
      });
      continue;
    }

    try {
      const row = await prisma.photo.create({
        data: {
          title: photo.title,
          altText: photo.alt,
          description: photo.description || null,
          blobUrl: blob.url,
          blobPathname: blob.pathname,
          contentType,
          sizeBytes: bytes.byteLength,
          category: inferCategory(photo.title, photo.alt),
          placement: "GALLERY_CAROUSEL",
          featured: false,
          displayOrder: order,
          uploadedById: session.user.id,
        },
        select: { id: true },
      });
      seeded.push({ title: photo.title, id: row.id, displayOrder: order });
      order++;
    } catch (err) {
      skipped.push({
        title: photo.title,
        reason: `db create failed: ${(err as Error).message}`,
      });
    }
  }

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.seed_gallery",
      metadata: {
        seededCount: seeded.length,
        skippedCount: skipped.length,
        skipped,
      },
    },
  });

  revalidateTag(MEDIA_TAGS.photos);
  for (const path of PUBLIC_PHOTO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");

  return NextResponse.json({
    seededCount: seeded.length,
    skippedCount: skipped.length,
    seeded,
    skipped,
  });
}
