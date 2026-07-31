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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
