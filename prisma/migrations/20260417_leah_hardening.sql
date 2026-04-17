-- =============================================================
-- Leah hardening — 2026-04-17
--
-- Apply with any ONE of:
--   • Neon web console (SQL editor) — paste & run
--   • psql "$DATABASE_URL" -f prisma/migrations/20260417_leah_hardening.sql
--   • npx prisma db push    (diffs schema → DB; will apply everything in schema.prisma)
--
-- Wrapped in a transaction so a failure rolls back cleanly.
-- =============================================================

BEGIN;

-- -------------------------------------------------------------
-- 1. leah_conversations.userId → users.id  (ON DELETE CASCADE)
--    Previously a bare TEXT column with no FK constraint.
-- -------------------------------------------------------------
ALTER TABLE "leah_conversations"
  ADD CONSTRAINT "leah_conversations_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- -------------------------------------------------------------
-- 2. availability: support one-off date blocks
--    - dayOfWeek becomes nullable (was NOT NULL)
--    - date (DATE) added for one-off blocks
--    - reason (TEXT) added for human-readable notes
--    - indices for weekday + date lookups
-- -------------------------------------------------------------
ALTER TABLE "availability"
  ALTER COLUMN "dayOfWeek" DROP NOT NULL;

ALTER TABLE "availability"
  ADD COLUMN "date" DATE,
  ADD COLUMN "reason" TEXT;

CREATE INDEX "availability_dayOfWeek_idx" ON "availability"("dayOfWeek");
CREATE INDEX "availability_date_idx"       ON "availability"("date");

-- -------------------------------------------------------------
-- 3. bookings.userId — optional link to the signed-in submitter
--    ON DELETE SET NULL so deleting a user preserves the booking
--    (Allan still wants the record) but unlinks it.
-- -------------------------------------------------------------
ALTER TABLE "bookings"
  ADD COLUMN "userId" TEXT;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

COMMIT;

-- =============================================================
-- Optional: clean up any existing orphaned leah_conversations
-- (rows whose userId doesn't correspond to a real user). Safe
-- to run after the FK is in place — the FK alone will block
-- NEW orphans; this deletes any that predate the constraint.
-- =============================================================

-- DELETE FROM "leah_conversations" lc
--  WHERE NOT EXISTS (
--    SELECT 1 FROM "users" u WHERE u."id" = lc."userId"
--  );
