import { promises as fs } from "node:fs";
import path from "node:path";
import { isAuthConfigured } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { runtimePaths } from "@/lib/runtime-paths";

export type CommunityRuntimeStatus = {
  authConfigured: boolean;
  databaseConfigured: boolean;
  storageMode: "database" | "file_fallback";
};

export type PublicBoardPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorLabel: string;
  boardKey: string;
  status: "published" | "hidden" | "deleted";
  createdAt: string;
  commentCount: number;
};

type BoardPostRecord = {
  id: string;
  slug: string;
  title: string;
  body: string;
  authorId: string;
  authorLabel: string;
  boardKey: string;
  status: "published" | "hidden" | "deleted";
  visibility: "public" | "members_only";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const boardPostsFile = path.join(runtimePaths.dataRoot, "board-posts.json");

async function ensureBoardPostStore(): Promise<void> {
  await fs.mkdir(path.dirname(boardPostsFile), { recursive: true });
  try {
    await fs.access(boardPostsFile);
  } catch {
    await fs.writeFile(boardPostsFile, "[]\n", "utf8");
  }
}

async function readBoardPosts(): Promise<BoardPostRecord[]> {
  await ensureBoardPostStore();
  try {
    const raw = await fs.readFile(boardPostsFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BoardPostRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeBoardPosts(posts: BoardPostRecord[]): Promise<void> {
  await ensureBoardPostStore();
  await fs.writeFile(boardPostsFile, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
}

function toPublicBoardPost(post: BoardPostRecord): PublicBoardPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    body: post.body,
    authorLabel: post.authorLabel,
    boardKey: post.boardKey,
    status: post.status,
    createdAt: post.createdAt,
    commentCount: 0,
  };
}

function buildSlug(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48)
    .replace(/^-|-$/g, "");

  const fallback = base || "discussion";
  return `${fallback}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getCommunityRuntimeStatus(): CommunityRuntimeStatus {
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  return {
    authConfigured: isAuthConfigured(),
    databaseConfigured,
    storageMode: databaseConfigured ? "database" : "file_fallback",
  };
}

export async function listPublicBoardPosts(): Promise<PublicBoardPost[]> {
  if (process.env.DATABASE_URL) {
    try {
      const posts = await prisma.boardPost.findMany({
        where: {
          status: "published",
          visibility: "public",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        include: {
          author: true,
          _count: {
            select: {
              comments: {
                where: {
                  status: "published",
                },
              },
            },
          },
        },
      });

      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        authorLabel: post.author.displayName,
        boardKey: post.boardKey,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        commentCount: post._count.comments,
      }));
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const posts = await readBoardPosts();
  return posts
    .filter((post) => post.status === "published" && post.visibility === "public")
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 20)
    .map(toPublicBoardPost);
}

export async function listRecentBoardPostsForModeration(): Promise<PublicBoardPost[]> {
  if (process.env.DATABASE_URL) {
    try {
      const posts = await prisma.boardPost.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        include: {
          author: true,
          _count: {
            select: {
              comments: {
                where: {
                  status: "published",
                },
              },
            },
          },
        },
      });

      return posts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        authorLabel: post.author.displayName,
        boardKey: post.boardKey,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        commentCount: post._count.comments,
      }));
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const posts = await readBoardPosts();
  return posts
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 20)
    .map(toPublicBoardPost);
}

export async function getPublicBoardPostBySlug(slug: string): Promise<PublicBoardPost | null> {
  if (process.env.DATABASE_URL) {
    try {
      const post = await prisma.boardPost.findFirst({
        where: {
          slug,
          status: "published",
          visibility: "public",
        },
        include: {
          author: true,
          _count: {
            select: {
              comments: {
                where: {
                  status: "published",
                },
              },
            },
          },
        },
      });

      if (!post) return null;

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        authorLabel: post.author.displayName,
        boardKey: post.boardKey,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        commentCount: post._count.comments,
      };
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const posts = await readBoardPosts();
  const post = posts.find((entry) => entry.slug === slug && entry.status === "published" && entry.visibility === "public");
  return post ? toPublicBoardPost(post) : null;
}

export async function createBoardPost(input: {
  title: string;
  body: string;
  authorId: string;
  authorLabel: string;
}): Promise<PublicBoardPost> {
  const slug = buildSlug(input.title);

  if (process.env.DATABASE_URL) {
    try {
      const post = await prisma.boardPost.create({
        data: {
          slug,
          title: input.title,
          body: input.body,
          authorId: input.authorId,
          boardKey: "general",
          status: "published",
          visibility: "public",
        },
        include: {
          author: true,
          _count: {
            select: {
              comments: {
                where: {
                  status: "published",
                },
              },
            },
          },
        },
      });

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        body: post.body,
        authorLabel: post.author.displayName,
        boardKey: post.boardKey,
        status: post.status,
        createdAt: post.createdAt.toISOString(),
        commentCount: post._count.comments,
      };
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const now = new Date().toISOString();
  const next: BoardPostRecord = {
    id: crypto.randomUUID(),
    slug,
    title: input.title,
    body: input.body,
    authorId: input.authorId,
    authorLabel: input.authorLabel,
    boardKey: "general",
    status: "published",
    visibility: "public",
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  const posts = await readBoardPosts();
  posts.push(next);
  await writeBoardPosts(posts);
  return toPublicBoardPost(next);
}

export async function moderateBoardPost(input: {
  postId: string;
  actorUserId: string;
  action: "hide" | "delete";
  reason?: string | null;
}): Promise<boolean> {
  const nextStatus = input.action === "hide" ? "hidden" : "deleted";

  if (process.env.DATABASE_URL) {
    try {
      const updated = await prisma.boardPost.updateMany({
        where: {
          id: input.postId,
        },
        data: {
          status: nextStatus,
          deletedAt: nextStatus === "deleted" ? new Date() : null,
        },
      });

      if (updated.count > 0) {
        await prisma.moderationAction.create({
          data: {
            actorUserId: input.actorUserId,
            targetType: "board_post",
            targetId: input.postId,
            actionType: input.action === "hide" ? "hide" : "soft_delete",
            reason: input.reason || null,
          },
        });
        return true;
      }

      return false;
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const posts = await readBoardPosts();
  const index = posts.findIndex((post) => post.id === input.postId);
  if (index < 0) {
    return false;
  }

  const current = posts[index];
  posts[index] = {
    ...current,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    deletedAt: nextStatus === "deleted" ? new Date().toISOString() : null,
  };
  await writeBoardPosts(posts);
  return true;
}
