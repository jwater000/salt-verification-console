import type { DefaultSession, NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/db";

type AppRole = "member" | "moderator" | "admin";
type AppStatus = "active" | "restricted" | "suspended" | "deleted";

type SyncedUser = {
  id: string;
  displayName: string;
  role: AppRole;
  status: AppStatus;
};

function resolveRole(
  roles: Array<{ role: AppRole }>,
): AppRole {
  if (roles.some((entry) => entry.role === "admin")) return "admin";
  if (roles.some((entry) => entry.role === "moderator")) return "moderator";
  return "member";
}

function buildProviders() {
  const providers: NonNullable<NextAuthOptions["providers"]> = [];

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    );
  }

  return providers;
}

async function syncOAuthUser(params: {
  token: JWT;
  account?: { provider?: string | null; providerAccountId?: string | null } | null;
  user?: DefaultSession["user"] | null;
}): Promise<SyncedUser | null> {
  const provider = params.account?.provider ?? null;
  const providerAccountId = params.account?.providerAccountId ?? null;
  if (!provider || !providerAccountId) return null;

  const authSubject = `${provider}:${providerAccountId}`;
  const displayName =
    params.user?.name?.trim() ||
    params.token.name?.trim() ||
    "Member";
  const avatarUrl = params.user?.image ?? params.token.picture ?? null;

  const user = await prisma.user.upsert({
    where: { authSubject },
    update: {
      displayName,
      avatarUrl,
      primaryProvider: provider,
      lastSeenAt: new Date(),
    },
    create: {
      authSubject,
      displayName,
      avatarUrl,
      primaryProvider: provider,
      lastSeenAt: new Date(),
    },
    include: { roles: true },
  });

  await prisma.userRole.upsert({
    where: {
      userId_role: {
        userId: user.id,
        role: "member",
      },
    },
    update: {},
    create: {
      userId: user.id,
      role: "member",
      grantedReason: "OAuth first sign-in",
    },
  });

  const refreshed = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: true },
  });
  if (!refreshed) return null;

  return {
    id: refreshed.id,
    displayName: refreshed.displayName,
    role: resolveRole(refreshed.roles),
    status: refreshed.status,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider && account.providerAccountId) {
        const synced = await syncOAuthUser({
          token,
          account: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          user,
        });

        if (synced) {
          token.userId = synced.id;
          token.role = synced.role;
          token.status = synced.status;
          token.name = synced.displayName;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.role = (token.role as AppRole | undefined) ?? "member";
        session.user.status = (token.status as AppStatus | undefined) ?? "active";
      }
      return session;
    },
  },
};
