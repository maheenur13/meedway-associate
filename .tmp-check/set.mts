import "dotenv/config";
import { prisma } from "../src/lib/prisma";
const [key, en, bn] = process.argv.slice(2);
await prisma.siteContent.upsert({
  where: { key },
  update: { valueEn: en ?? "", valueBn: bn ?? "" },
  create: { key, valueEn: en ?? "", valueBn: bn ?? "" },
});
await prisma.$disconnect();
