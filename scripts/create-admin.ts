import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

// Creates (or resets the password of) an admin user.
//   pnpm db:create-admin <email> <password> [name]
// Credentials are passed as args on purpose so they never live in a committed file.

async function main() {
  const [emailArg, password, ...nameParts] = process.argv.slice(2);
  const email = emailArg?.trim().toLowerCase();
  const name = nameParts.join(" ") || "Administrator";

  if (!email || !password) {
    throw new Error(
      'Usage: pnpm db:create-admin <email> <password> [name]',
    );
  }
  if (!email.includes("@")) {
    throw new Error(`Not a valid email: ${email}`);
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash, name, role: "admin" },
    create: { email, name, password: hash, role: "admin" },
  });

  console.log(
    existing
      ? `Password reset for existing admin: ${email}`
      : `Admin created: ${email}`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e instanceof Error ? e.message : e);
    await prisma.$disconnect();
    process.exit(1);
  });
