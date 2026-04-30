import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  defaultAboutPortrait,
  defaultFeaturedTeaserTiles,
  defaultHomepageHeroPoster,
  type StaticPhotoAsset,
} from "@/lib/media/default-placements";
import { MEDIA_TAGS, PUBLIC_PHOTO_PAGES } from "@/lib/media/cache-tags";
import type { PhotoCategory, PhotoPlacement } from "@/generated/prisma";

// Admin-triggered server-side seed for the three placements that historically
// rendered hardcoded /public/images files instead of Photo rows:
// ABOUT_PORTRAIT, HOMEPAGE_HERO, FEATURED_TEASER. Uploads each asset to
// Vercel Blob, creates the Photo row, and tags so the public site picks
// it up immediately.
//
// Idempotent per placement: if any row already exists with a
// blobPathname under `seeded-placements/{placement}/`, that placement is
// skipped — re-running won't duplicate.

export const maxDuration = 300;

type SeedJob = {
  placement: PhotoPlacement;
  category: PhotoCategory;
  pathnamePrefix: string; // under blob, used to identify already-seeded rows
  isSingleton: boolean;   // singleton placements skip if ANY row exists
  assets: readonly StaticPhotoAsset[];
};

const JOBS: SeedJob[] = [
  {
    placement: "ABOUT_PORTRAIT",
    category: "PORTRAIT",
    pathnamePrefix: "seeded-placements/about-portrait/",
    isSingleton: true,
    assets: [defaultAboutPortrait],
  },
  {
    placement: "HOMEPAGE_HERO",
    category: "OTHER",
    pathnamePrefix: "seeded-placements/homepage-hero/",
    isSingleton: true,
    assets: [defaultHomepageHeroPoster],
  },
  {
    placement: "FEATURED_TEASER",
    category: "OTHER",
    pathnamePrefix: "seeded-placements/featured-teaser/",
    isSingleton: false,
    assets: defaultFeaturedTeaserTiles,
  },
];

function contentTypeFor(src: string): string {
  const ext = src.split(".").pop()?.toLowerCase() ?? "jpg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
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

  const results: Array<{
    placement: PhotoPlacement;
    skipped?: { reason: string; existing: number };
    seededCount?: number;
    skippedCount?: number;
    seeded?: { title: string; id: string; displayOrder: number }[];
    skippedAssets?: { title: string; reason: string }[];
  }> = [];

  for (const job of JOBS) {
    // Singletons: skip if ANY row exists for this placement (seeding alongside
    // an existing portrait/hero would break the singleton invariant). Multi
    // placements: only skip if our seeded prefix is already present, so we
    // can co-exist with Allan's own uploads.
    const idempotencyWhere = job.isSingleton
      ? { placement: job.placement, deletedAt: null }
      : {
          placement: job.placement,
          blobPathname: { startsWith: job.pathnamePrefix },
          deletedAt: null,
        };
    const existing = await prisma.photo.count({ where: idempotencyWhere });
    if (existing > 0) {
      results.push({
        placement: job.placement,
        skipped: {
          reason: job.isSingleton
            ? `Skipped singleton — ${existing} active ${job.placement} row(s) already exist; preserve Allan's upload.`
            : `Already seeded — ${existing} ${job.placement} row(s) under ${job.pathnamePrefix} exist.`,
          existing,
        },
      });
      continue;
    }

    // Push seeded photos to the end of displayOrder so any existing
    // Allan uploads for this placement keep their position.
    const maxOrder = await prisma.photo.findFirst({
      where: { placement: job.placement, deletedAt: null },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    let order = (maxOrder?.displayOrder ?? -1) + 1;

    const seeded: { title: string; id: string; displayOrder: number }[] = [];
    const skippedAssets: { title: string; reason: string }[] = [];

    for (const asset of job.assets) {
      const localPath = join(process.cwd(), "public", asset.src);
      let bytes: Buffer;
      try {
        bytes = await readFile(localPath);
      } catch (err) {
        skippedAssets.push({
          title: asset.title,
          reason: `read failed: ${(err as Error).message}`,
        });
        continue;
      }

      const contentType = contentTypeFor(asset.src);
      const filename = asset.src.split("/").pop() ?? `photo.${contentType.split("/")[1]}`;

      let blob;
      try {
        blob = await put(`${job.pathnamePrefix}${filename}`, bytes, {
          access: "public",
          contentType,
          addRandomSuffix: true,
        });
      } catch (err) {
        skippedAssets.push({
          title: asset.title,
          reason: `blob put failed: ${(err as Error).message}`,
        });
        continue;
      }

      try {
        const row = await prisma.photo.create({
          data: {
            title: asset.title,
            altText: asset.alt,
            description: null,
            blobUrl: blob.url,
            blobPathname: blob.pathname,
            contentType,
            sizeBytes: bytes.byteLength,
            category: job.category,
            placement: job.placement,
            featured: false,
            displayOrder: order,
            uploadedById: session.user.id,
          },
          select: { id: true },
        });
        seeded.push({ title: asset.title, id: row.id, displayOrder: order });
        order++;
      } catch (err) {
        skippedAssets.push({
          title: asset.title,
          reason: `db create failed: ${(err as Error).message}`,
        });
      }
    }

    results.push({
      placement: job.placement,
      seededCount: seeded.length,
      skippedCount: skippedAssets.length,
      seeded,
      skippedAssets,
    });
  }

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "photo.seed_placements",
      metadata: { results },
    },
  });

  revalidateTag(MEDIA_TAGS.photos);
  for (const path of PUBLIC_PHOTO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");

  return NextResponse.json({ results });
}
