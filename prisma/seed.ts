import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { jobs } from "../src/lib/jobs-data";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set — add your Neon connection string to .env",
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- admin user ---
  const email = "admin@meedassociates.com";
  const password = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", password, role: "admin" },
  });
  console.log(`Admin user ready: ${email} / admin1234`);

  // --- seed jobs (only if empty) ---
  const count = await prisma.job.count();
  if (count === 0) {
    for (const j of jobs) {
      await prisma.job.create({
        data: {
          title: j.title,
          category: j.category,
          country: j.country,
          vacancies: j.vacancies,
          salary: j.salary,
          workingHours: j.workingHours,
          contract: j.contract,
          experience: j.experience,
          accommodation: j.accommodation,
          deadline: new Date(j.deadline),
          documents: JSON.stringify(j.documents),
          published: true,
        },
      });
    }
    console.log(`Seeded ${jobs.length} jobs.`);
  } else {
    console.log(`Jobs already present (${count}); skipping seed.`);
  }

  // --- seed trade categories (only if empty) ---
  // Mirrors the list the site shipped with, so the admin panel opens on the
  // real grid instead of an empty table. Bengali names come from messages/bn.json.
  const tradeCount = await prisma.tradeCategory.count();
  if (tradeCount === 0) {
    const trades = [
      { nameEn: "Construction", nameBn: "নির্মাণ", icon: "HardHat" },
      { nameEn: "Factory", nameBn: "কারখানা", icon: "Factory" },
      { nameEn: "Drivers", nameBn: "ড্রাইভার", icon: "Car" },
      { nameEn: "Cleaners", nameBn: "ক্লিনার", icon: "SprayCan" },
      { nameEn: "Hotel & restaurant", nameBn: "হোটেল ও রেস্টুরেন্ট", icon: "UtensilsCrossed" },
      { nameEn: "Electricians", nameBn: "ইলেকট্রিশিয়ান", icon: "Zap" },
      { nameEn: "Plumbers", nameBn: "প্লাম্বার", icon: "Wrench" },
      { nameEn: "Welders", nameBn: "ওয়েল্ডার", icon: "Flame" },
      { nameEn: "Caregivers", nameBn: "কেয়ারগিভার", icon: "HeartHandshake" },
      { nameEn: "General workers", nameBn: "সাধারণ কর্মী", icon: "Users" },
    ];
    for (const [i, t] of trades.entries()) {
      // Gaps of 10 so items can be reordered without renumbering the rest.
      await prisma.tradeCategory.create({ data: { ...t, sortOrder: (i + 1) * 10 } });
    }
    console.log(`Seeded ${trades.length} trade categories.`);
  } else {
    console.log(`Trade categories already present (${tradeCount}); skipping seed.`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
