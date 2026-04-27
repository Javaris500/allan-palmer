import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma";
import {
  defaultSongs,
  RECENTLY_ADDED_WINDOW_DAYS,
} from "../lib/songs/defaults";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAvailability() {
  const days = [1, 2, 3, 4, 5, 6]; // Mon-Sat
  for (const dayOfWeek of days) {
    const existing = await prisma.availability.findFirst({
      where: { dayOfWeek },
    });
    if (!existing) {
      await prisma.availability.create({
        data: {
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      });
    }
  }
  console.log("✓ Default availability seeded (Mon-Sat, 9am-5pm)");
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Allan Palmer";

  if (!email) throw new Error("ADMIN_EMAIL is required in .env.local");
  if (!password) throw new Error("ADMIN_PASSWORD is required in .env.local");
  if (password === "changeme-please") {
    console.warn(
      "⚠️  ADMIN_PASSWORD is still the default. Change it in .env.local and re-run `npm run db:seed`.",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const allan = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: "ADMIN", name },
    create: {
      email,
      name,
      hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log(`✓ Admin user seeded: ${allan.email}`);
}

async function seedSongs() {
  // Only seed when the table is empty; re-running won't duplicate rows.
  const existing = await prisma.song.count({ where: { deletedAt: null } });
  if (existing > 0) {
    console.log(`✓ Songs already seeded (${existing} active rows)`);
    return;
  }

  // Backdate non-recent songs so the public page's "Recently Added" filter
  // (driven by createdAt within the last RECENTLY_ADDED_WINDOW_DAYS) doesn't
  // light up the New badge on every legacy entry.
  const now = new Date();
  const backdated = new Date(now);
  backdated.setDate(backdated.getDate() - (RECENTLY_ADDED_WINDOW_DAYS + 30));

  await prisma.song.createMany({
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

  console.log(`✓ Seeded ${defaultSongs.length} songs`);
}

async function main() {
  await seedAvailability();
  await seedAdmin();
  await seedSongs();
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
