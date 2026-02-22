import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
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
