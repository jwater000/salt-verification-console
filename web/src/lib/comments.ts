import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/db";
import { runtimePaths } from "@/lib/runtime-paths";

export type CommentRecord = {
  id: string;
  pagePath: string;
  body: string;
  authorId: string;
  authorLabel: string;
  status: "published" | "hidden" | "deleted";
  createdAt: string;
  updatedAt: string;
};

export type PublicComment = {
  id: string;
  pagePath: string;
  body: string;
  authorLabel: string;
  createdAt: string;
};

export type ModerationOverview = {
  comments: Array<{
    id: string;
    pagePath: string;
    body: string;
    authorLabel: string;
    status: "published" | "hidden" | "deleted";
    createdAt: string;
  }>;
  reports: Array<{
    id: string;
    commentId: string;
    reporterLabel: string;
    reason: string;
    createdAt: string;
  }>;
  actions: Array<{
    id: string;
    commentId: string;
    actorLabel: string;
    action: string;
    reason: string | null;
    createdAt: string;
  }>;
};

type CommentRateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
  reason: string | null;
};

type ReportRecord = {
  id: string;
  commentId: string;
  reporterId: string;
  reporterLabel?: string;
  reason: string;
  createdAt: string;
};

type ModerationRecord = {
  id: string;
  commentId: string;
  actorUserId: string;
  actorLabel?: string;
  action: "hide" | "delete";
  reason: string | null;
  createdAt: string;
};

const commentsFile = path.join(runtimePaths.dataRoot, "comments.json");
const reportsFile = path.join(runtimePaths.dataRoot, "comment-reports.json");
const moderationFile = path.join(runtimePaths.dataRoot, "comment-moderation.json");

function canUseDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

async function ensureCommentsStore(): Promise<void> {
  const dir = path.dirname(commentsFile);
  await fs.mkdir(dir, { recursive: true });
  for (const file of [commentsFile, reportsFile, moderationFile]) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, "[]\n", "utf8");
    }
  }
}

async function readComments(): Promise<CommentRecord[]> {
  await ensureCommentsStore();
  try {
    const raw = await fs.readFile(commentsFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CommentRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeComments(comments: CommentRecord[]): Promise<void> {
  await ensureCommentsStore();
  await fs.writeFile(commentsFile, `${JSON.stringify(comments, null, 2)}\n`, "utf8");
}

async function readJsonArray<T>(file: string): Promise<T[]> {
  await ensureCommentsStore();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeJsonArray<T>(file: string, rows: T[]): Promise<void> {
  await ensureCommentsStore();
  await fs.writeFile(file, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

function secondsBetween(nowIso: string, previousIso: string): number {
  return Math.max(0, Math.floor((Date.parse(nowIso) - Date.parse(previousIso)) / 1000));
}

export async function checkCommentRateLimit(authorId: string): Promise<CommentRateLimitResult> {
  const now = new Date().toISOString();
  const burstWindowSeconds = 60;
  const burstMax = 3;
  const cooldownSeconds = 20;

  if (canUseDatabase()) {
    try {
      const recent = await prisma.postComment.findMany({
        where: {
          authorId,
          createdAt: {
            gte: new Date(Date.now() - burstWindowSeconds * 1000),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      });

      if (recent[0]) {
        const elapsed = secondsBetween(now, recent[0].createdAt.toISOString());
        if (elapsed < cooldownSeconds) {
          return {
            ok: false,
            retryAfterSeconds: cooldownSeconds - elapsed,
            reason: "cooldown",
          };
        }
      }

      if (recent.length >= burstMax) {
        const oldest = recent[recent.length - 1];
        const elapsed = secondsBetween(now, oldest.createdAt.toISOString());
        return {
          ok: false,
          retryAfterSeconds: Math.max(1, burstWindowSeconds - elapsed),
          reason: "burst_limit",
        };
      }
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const comments = await readComments();
  const recent = comments
    .filter(
      (comment) =>
        comment.authorId === authorId &&
        comment.status !== "deleted" &&
        secondsBetween(now, comment.createdAt) <= burstWindowSeconds,
    )
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  if (recent[0]) {
    const elapsed = secondsBetween(now, recent[0].createdAt);
    if (elapsed < cooldownSeconds) {
      return {
        ok: false,
        retryAfterSeconds: cooldownSeconds - elapsed,
        reason: "cooldown",
      };
    }
  }

  if (recent.length >= burstMax) {
    const oldest = recent[recent.length - 1];
    const elapsed = secondsBetween(now, oldest.createdAt);
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, burstWindowSeconds - elapsed),
      reason: "burst_limit",
    };
  }

  return {
    ok: true,
    retryAfterSeconds: 0,
    reason: null,
  };
}

export async function listPublicComments(pagePath: string): Promise<PublicComment[]> {
  if (canUseDatabase()) {
    try {
      const comments = await prisma.postComment.findMany({
        where: { pagePath, status: "published" },
        orderBy: { createdAt: "asc" },
        include: { author: true },
      });

      return comments.map((comment) => ({
        id: comment.id,
        pagePath: comment.pagePath || pagePath,
        body: comment.body,
        authorLabel: comment.author.displayName,
        createdAt: comment.createdAt.toISOString(),
      }));
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const comments = await readComments();
  return comments
    .filter((comment) => comment.pagePath === pagePath && comment.status === "published")
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .map((comment) => ({
      id: comment.id,
      pagePath: comment.pagePath,
      body: comment.body,
      authorLabel: comment.authorLabel,
      createdAt: comment.createdAt,
    }));
}

export async function createComment(input: {
  pagePath: string;
  body: string;
  authorId: string;
  authorLabel: string;
}): Promise<PublicComment> {
  if (canUseDatabase()) {
    try {
      const comment = await prisma.postComment.create({
        data: {
          pagePath: input.pagePath,
          body: input.body,
          authorId: input.authorId,
          status: "published",
        },
        include: { author: true },
      });

      return {
        id: comment.id,
        pagePath: comment.pagePath || input.pagePath,
        body: comment.body,
        authorLabel: comment.author.displayName,
        createdAt: comment.createdAt.toISOString(),
      };
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const now = new Date().toISOString();
  const next: CommentRecord = {
    id: crypto.randomUUID(),
    pagePath: input.pagePath,
    body: input.body,
    authorId: input.authorId,
    authorLabel: input.authorLabel,
    status: "published",
    createdAt: now,
    updatedAt: now,
  };
  const comments = await readComments();
  comments.push(next);
  await writeComments(comments);
  return {
    id: next.id,
    pagePath: next.pagePath,
    body: next.body,
    authorLabel: next.authorLabel,
    createdAt: next.createdAt,
  };
}

export async function reportComment(input: {
  commentId: string;
  reporterId: string;
  reporterLabel: string;
  reason: string;
}): Promise<void> {
  const createdAt = new Date().toISOString();

  if (canUseDatabase()) {
    try {
      await prisma.contentReport.create({
        data: {
          reporterId: input.reporterId,
          targetType: "post_comment",
          targetId: input.commentId,
          reasonCode: "other",
          reasonDetail: input.reason,
        },
      });
      return;
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const reports = await readJsonArray<ReportRecord>(reportsFile);
  reports.push({
    id: crypto.randomUUID(),
    commentId: input.commentId,
    reporterId: input.reporterId,
    reporterLabel: input.reporterLabel,
    reason: input.reason,
    createdAt,
  });
  await writeJsonArray(reportsFile, reports);
}

export async function moderateComment(input: {
  commentId: string;
  actorUserId: string;
  actorLabel: string;
  action: "hide" | "delete";
  reason?: string | null;
}): Promise<boolean> {
  const nextStatus = input.action === "hide" ? "hidden" : "deleted";
  const createdAt = new Date().toISOString();

  if (canUseDatabase()) {
    try {
      const updated = await prisma.postComment.updateMany({
        where: {
          id: input.commentId,
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
            targetType: "post_comment",
            targetId: input.commentId,
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

  const comments = await readComments();
  const target = comments.find((comment) => comment.id === input.commentId);
  if (!target) {
    return false;
  }

  target.status = nextStatus;
  target.updatedAt = createdAt;
  await writeComments(comments);

  const moderation = await readJsonArray<ModerationRecord>(moderationFile);
  moderation.push({
    id: crypto.randomUUID(),
    commentId: input.commentId,
    actorUserId: input.actorUserId,
    actorLabel: input.actorLabel,
    action: input.action,
    reason: input.reason || null,
    createdAt,
  });
  await writeJsonArray(moderationFile, moderation);
  return true;
}

export async function listModerationOverview(): Promise<ModerationOverview> {
  if (canUseDatabase()) {
    try {
      const [comments, reports, actions] = await Promise.all([
        prisma.postComment.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { author: true },
        }),
        prisma.contentReport.findMany({
          where: { targetType: "post_comment" },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { reporter: true },
        }),
        prisma.moderationAction.findMany({
          where: { targetType: "post_comment" },
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { actor: true },
        }),
      ]);

      return {
        comments: comments.map((comment) => ({
          id: comment.id,
          pagePath: comment.pagePath || "—",
          body: comment.body,
          authorLabel: comment.author.displayName,
          status: comment.status,
          createdAt: comment.createdAt.toISOString(),
        })),
        reports: reports.map((report) => ({
          id: report.id,
          commentId: report.targetId,
          reporterLabel: report.reporter.displayName,
          reason: report.reasonDetail || report.reasonCode,
          createdAt: report.createdAt.toISOString(),
        })),
        actions: actions.map((action) => ({
          id: action.id,
          commentId: action.targetId,
          actorLabel: action.actor.displayName,
          action: action.actionType,
          reason: action.reason || null,
          createdAt: action.createdAt.toISOString(),
        })),
      };
    } catch {
      // Fall through to file storage if DB access is unavailable.
    }
  }

  const [comments, reports, actions] = await Promise.all([
    readComments(),
    readJsonArray<ReportRecord>(reportsFile),
    readJsonArray<ModerationRecord>(moderationFile),
  ]);

  return {
    comments: comments
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 50)
      .map((comment) => ({
        id: comment.id,
        pagePath: comment.pagePath,
        body: comment.body,
        authorLabel: comment.authorLabel,
        status: comment.status,
        createdAt: comment.createdAt,
      })),
    reports: reports
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 50)
      .map((report) => ({
        id: report.id,
        commentId: report.commentId,
        reporterLabel: report.reporterLabel || report.reporterId,
        reason: report.reason,
        createdAt: report.createdAt,
      })),
    actions: actions
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 50)
      .map((action) => ({
        id: action.id,
        commentId: action.commentId,
        actorLabel: action.actorLabel || action.actorUserId,
        action: action.action,
        reason: action.reason,
        createdAt: action.createdAt,
      })),
  };
}
