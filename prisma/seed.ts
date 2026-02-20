import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Require env vars — no hardcoded credentials
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.warn(
      "ADMIN_EMAIL and ADMIN_PASSWORD not set. Skipping admin seed.\n" +
      "Set these environment variables to create an admin account."
    )
  } else {
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existing) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "ADMIN" },
      })
      console.log(`Updated ${adminEmail} to ADMIN role`)
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 12)
      await prisma.user.create({
        data: {
          name: "Allan Palmer",
          email: adminEmail,
          passwordHash,
          role: "ADMIN",
        },
      })
      console.log(`Created admin account: ${adminEmail}`)
    }
  }

  // Seed default availability (Mon-Sat, 9am-5pm)
  const days = [1, 2, 3, 4, 5, 6] // Mon-Sat
  for (const dayOfWeek of days) {
    const existing = await prisma.availability.findFirst({
      where: { dayOfWeek },
    })
    if (!existing) {
      await prisma.availability.create({
        data: {
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      })
    }
  }
  console.log("Seeded default availability (Mon-Sat, 9am-5pm)")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
