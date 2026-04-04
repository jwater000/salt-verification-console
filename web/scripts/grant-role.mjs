import { PrismaClient } from "@prisma/client";

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function usage() {
  console.log(
    [
      "Usage:",
      '  node scripts/grant-role.mjs --auth-subject "google:1234567890" --role admin',
      '  node scripts/grant-role.mjs --user-id "uuid" --role moderator',
      "",
      "Required:",
      "  --role member|moderator|admin",
      "  and one of --auth-subject or --user-id",
    ].join("\n"),
  );
}

const role = readArg("--role");
const authSubject = readArg("--auth-subject");
const userIdArg = readArg("--user-id");

if (!role || !["member", "moderator", "admin"].includes(role)) {
  usage();
  process.exit(1);
}

if (!authSubject && !userIdArg) {
  usage();
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = authSubject
    ? await prisma.user.findUnique({ where: { authSubject } })
    : await prisma.user.findUnique({ where: { id: userIdArg } });

  if (!user) {
    console.error("User not found.");
    process.exit(1);
  }

  await prisma.userRole.upsert({
    where: {
      userId_role: {
        userId: user.id,
        role,
      },
    },
    update: {},
    create: {
      userId: user.id,
      role,
      grantedReason: "manual grant via scripts/grant-role.mjs",
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        userId: user.id,
        authSubject: user.authSubject,
        role,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
