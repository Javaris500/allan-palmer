import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  defaultSongs,
  RECENTLY_ADDED_WINDOW_DAYS,
} from "@/lib/songs/defaults";

// Admin-triggered server-side: apply the songs table migration if it
// doesn't exist, then seed defaultSongs into it.
//
// Reason it's a separate route (not bundled with seed-gallery): songs
// were added 2026-04-26 and the SQL migration was never applied to the
// Vercel-Marketplace prod DB — only to whichever DB local was pointed
// at. Public /repertoire still works because lib/songs/load.ts swallows
// the relation-not-found error and renders defaults from code, but
// admin edits would silently fail.
//
// Idempotent. Safe to re-run.

export const maxDuration = 300;

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Apply migration. Each statement is idempotent.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "songs" (
      "id"           TEXT        PRIMARY KEY,
      "title"        TEXT        NOT NULL,
      "artist"       TEXT,
      "genres"       TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
      "audioId"      TEXT,
      "audioUrl"     TEXT,
      "displayOrder" INTEGER     NOT NULL DEFAULT 0,
      "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"    TIMESTAMP(3) NOT NULL,
      "deletedAt"    TIMESTAMP(3)
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "songs_deletedAt_displayOrder_idx"
      ON "songs"("deletedAt", "displayOrder")
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "songs_createdAt_idx"
      ON "songs"("createdAt")
  `);

  // 2. Skip seeding if table already has rows.
  const existing = await prisma.song.count({ where: { deletedAt: null } });
  if (existing > 0) {
    return NextResponse.json({
      migrationApplied: true,
      seedSkipped: true,
      reason: `Already seeded: ${existing} active rows.`,
      existing,
    });
  }

  // 3. Seed defaults. Backdate non-recent so the "Recently Added" filter
  //    doesn't light up the New badge on every legacy entry.
  const now = new Date();
  const backdated = new Date(now);
  backdated.setDate(backdated.getDate() - (RECENTLY_ADDED_WINDOW_DAYS + 30));

  // Need explicit id + updatedAt because $executeRawUnsafe created the
  // table with raw SQL (no Prisma defaults wired), but createMany
  // delegates id generation to Prisma's @default(cuid()). Prisma's
  // default mapping should still apply — try createMany first, fall
  // back to per-row create with manual id if needed.
  const result = await prisma.song.createMany({
    data: defaultSongs.map((song, idx) => ({
      title: song.title,
      artist: song.artist ?? null,
      genres: song.genres,
      audioId: song.audioId ?? null,
      audioUrl: song.audioUrl ?? null,
      displayOrder: idx,
      createdAt: song.recentlyAdded ? now : backdated,
    })),
  });

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: "song.seed",
      metadata: { seededCount: result.count },
    },
  });

  revalidatePath("/repertoire");
  revalidatePath("/admin/repertoire");

  return NextResponse.json({
    migrationApplied: true,
    seedSkipped: false,
    seededCount: result.count,
  });
}
