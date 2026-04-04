import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export type AppViewerSession = {
  userId: string;
  displayName: string;
  role: "member" | "moderator" | "admin";
  status: "active" | "restricted" | "suspended" | "deleted";
};

export type CommentWriterSession = {
  userId: string;
  displayName: string;
  role: "member" | "moderator" | "admin";
};

export type ModeratorSession = {
  userId: string;
  displayName: string;
  role: "moderator" | "admin";
};

export async function getAppViewerSession(): Promise<AppViewerSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  return {
    userId: session.user.id,
    displayName: session.user.name || "Member",
    role: session.user.role || "member",
    status: session.user.status || "active",
  };
}

export async function getCommentWriterSession(): Promise<CommentWriterSession | null> {
  const viewer = await getAppViewerSession();
  if (!viewer || viewer.status !== "active") {
    return null;
  }

  return {
    userId: viewer.userId,
    displayName: viewer.displayName,
    role: viewer.role,
  };
}

export async function getModeratorSession(): Promise<ModeratorSession | null> {
  const viewer = await getAppViewerSession();
  if (!viewer || viewer.status !== "active") {
    return null;
  }
  if (viewer.role !== "moderator" && viewer.role !== "admin") {
    return null;
  }

  return {
    userId: viewer.userId,
    displayName: viewer.displayName,
    role: viewer.role,
  };
}

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      ((process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) ||
        (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)),
  );
}
