import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma";

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

async function main() {
  await seedAvailability();
  await seedAdmin();
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
