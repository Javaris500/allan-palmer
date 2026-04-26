/**
 * One-time script — imports the existing /public/images/gallery/* photos
 * into the Photo table so Allan can manage them through /admin/media.
 *
 * Idempotent: if any Photo row exists with placement=GALLERY_CAROUSEL and
 * blobPathname starting with `seeded-gallery/`, the script exits without
 * doing anything. To re-seed, delete those rows in /admin/media first.
 *
 * Run:    npm run db:seed-gallery
 *
 * Reads env from .env.local via prisma.config.ts (already loaded by tsx).
 */

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { defaultGalleryPhotos } from "../lib/media/default-gallery-photos";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN not set. Pull env first: vercel env pull .env.local",
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
    console.log(
      `Already seeded: ${existing} gallery photos exist. Exiting.`,
    );
    return;
  }

  console.log(
    `Seeding ${defaultGalleryPhotos.length} gallery photos to Vercel Blob…`,
  );

  let order = 0;
  for (const photo of defaultGalleryPhotos) {
    // src looks like "/images/gallery/foo.jpeg" — read from public/
    const localPath = join(process.cwd(), "public", photo.src);
    let bytes: Buffer;
    try {
      bytes = await readFile(localPath);
    } catch (err) {
      console.error(
        `[skip] could not read ${localPath}:`,
        (err as Error).message,
      );
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

    const blob = await put(`seeded-gallery/${filename}`, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    await prisma.photo.create({
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
        displayOrder: order++,
      },
    });

    console.log(`  ✓ ${photo.title}`);
  }

  console.log(`Done. ${order} photos seeded.`);
}

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

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
