-- =============================================================
-- Song repertoire — 2026-04-26
--
-- Apply with any ONE of:
--   - Neon web console (SQL editor) — paste & run
--   - psql "$DATABASE_URL" -f prisma/migrations/20260426_song_repertoire.sql
--   - npx prisma db push    (diffs schema -> DB; will apply everything in schema.prisma)
--
-- After applying, run `npm run db:seed` to backfill the existing
-- ~200 songs from lib/songs/defaults.ts into the new table.
-- =============================================================

BEGIN;

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
);

CREATE INDEX IF NOT EXISTS "songs_deletedAt_displayOrder_idx"
  ON "songs"("deletedAt", "displayOrder");
CREATE INDEX IF NOT EXISTS "songs_createdAt_idx"
  ON "songs"("createdAt");

COMMIT;
