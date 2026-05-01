-- =============================================================
-- VideoPlacement enum — add HOMEPAGE_ON_STAGE + ABOUT_FEATURE
-- 2026-05-01
--
-- Apply with any ONE of:
--   - Neon web console (SQL editor) — paste & run
--   - psql "$DATABASE_URL" -f prisma/migrations/20260501_video_placements.sql
--   - POST /api/admin/media/seed-feature-videos (admin-only; applies + seeds)
--   - npx prisma db push   (diffs schema.prisma -> DB)
--
-- Idempotent: ALTER TYPE ADD VALUE IF NOT EXISTS is a no-op on rerun.
-- =============================================================

ALTER TYPE "VideoPlacement" ADD VALUE IF NOT EXISTS 'HOMEPAGE_ON_STAGE';
ALTER TYPE "VideoPlacement" ADD VALUE IF NOT EXISTS 'ABOUT_FEATURE';
