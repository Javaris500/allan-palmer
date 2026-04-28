import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Admin-only diagnostic. Returns redacted DB target + table counts so
// you can quickly verify which DB the running deployment is connected to
// without ever exposing the connection password.
//
// Use it to settle the "is local pointing at prod?" question — call this
// route from prod and from a local dev server signed in as admin and
// compare the dbHost / photoCount / userCount fields.

export const dynamic = "force-dynamic";

function redactDatabaseUrl(raw: string | undefined) {
  if (!raw) return { configured: false };
  try {
    const url = new URL(raw);
    return {
      configured: true,
      protocol: url.protocol.replace(":", ""),
      host: url.hostname,
      port: url.port || null,
      database: url.pathname.replace(/^\//, "") || null,
      user: url.username ? `${url.username.slice(0, 3)}***` : null,
      hasPassword: Boolean(url.password),
      sslmode: url.searchParams.get("sslmode"),
    };
  } catch {
    return { configured: true, parseable: false };
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [photoCount, photoSeededCount, videoCount, userCount, mostRecentPhoto] =
    await Promise.all([
      prisma.photo.count({ where: { deletedAt: null } }),
      prisma.photo.count({
        where: {
          placement: "GALLERY_CAROUSEL",
          deletedAt: null,
          blobPathname: { startsWith: "seeded-gallery/" },
        },
      }),
      prisma.video.count({ where: { deletedAt: null } }),
      prisma.user.count(),
      prisma.photo.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true, blobPathname: true },
      }),
    ]);

  return NextResponse.json({
    runtime: {
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
      region: process.env.VERCEL_REGION ?? null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
    database: redactDatabaseUrl(process.env.DATABASE_URL),
    integrations: {
      blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      muxConfigured: Boolean(
        process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET,
      ),
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    },
    counts: {
      activePhotos: photoCount,
      seededGalleryPhotos: photoSeededCount,
      activeVideos: videoCount,
      users: userCount,
    },
    mostRecentPhoto,
  });
}
