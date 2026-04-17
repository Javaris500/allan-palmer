// Run: npx tsx scripts/verify-leah-migration.ts
// Probes the DB to confirm the 2026-04-17 Leah hardening migration
// landed cleanly. Exits non-zero if any check fails.

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];

  // 1. leah_conversations FK
  const lcFk = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `SELECT COUNT(*)::bigint AS count FROM information_schema.table_constraints
     WHERE table_name = 'leah_conversations'
       AND constraint_type = 'FOREIGN KEY'
       AND constraint_name = 'leah_conversations_userId_fkey'`,
  );
  checks.push({
    name: "leah_conversations FK to users (CASCADE)",
    ok: Number(lcFk[0]?.count ?? 0) === 1,
  });

  // 2. availability.dayOfWeek nullable
  const doWCol = await prisma.$queryRawUnsafe<Array<{ is_nullable: string }>>(
    `SELECT is_nullable FROM information_schema.columns
     WHERE table_name = 'availability' AND column_name = 'dayOfWeek'`,
  );
  checks.push({
    name: "availability.dayOfWeek is nullable",
    ok: doWCol[0]?.is_nullable === "YES",
    detail: doWCol[0]?.is_nullable,
  });

  // 3. availability.date column
  const dateCol = await prisma.$queryRawUnsafe<Array<{ data_type: string }>>(
    `SELECT data_type FROM information_schema.columns
     WHERE table_name = 'availability' AND column_name = 'date'`,
  );
  checks.push({
    name: "availability.date column (DATE)",
    ok: dateCol[0]?.data_type === "date",
    detail: dateCol[0]?.data_type,
  });

  // 4. bookings.userId column
  const userIdCol = await prisma.$queryRawUnsafe<Array<{ data_type: string }>>(
    `SELECT data_type FROM information_schema.columns
     WHERE table_name = 'bookings' AND column_name = 'userId'`,
  );
  checks.push({
    name: "bookings.userId column (TEXT)",
    ok: userIdCol[0]?.data_type === "text",
    detail: userIdCol[0]?.data_type,
  });

  // 5. bookings.userId FK
  const bkFk = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `SELECT COUNT(*)::bigint AS count FROM information_schema.table_constraints
     WHERE table_name = 'bookings'
       AND constraint_type = 'FOREIGN KEY'
       AND constraint_name = 'bookings_userId_fkey'`,
  );
  checks.push({
    name: "bookings.userId FK to users (SET NULL)",
    ok: Number(bkFk[0]?.count ?? 0) === 1,
  });

  // Summary
  let allOk = true;
  for (const c of checks) {
    const icon = c.ok ? "✓" : "✗";
    const detail = c.detail ? ` (${c.detail})` : "";
    console.log(`${icon} ${c.name}${detail}`);
    if (!c.ok) allOk = false;
  }

  if (!allOk) {
    console.error("\nOne or more checks failed.");
    process.exit(1);
  }
  console.log("\nAll Leah hardening migration checks passed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
