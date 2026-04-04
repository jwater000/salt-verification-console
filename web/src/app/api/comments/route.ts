import { NextRequest, NextResponse } from "next/server";
import { checkCommentRateLimit, createComment, listPublicComments } from "@/lib/comments";
import { getCommentWriterSession } from "@/lib/auth/session";

function normalizePagePath(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.length > 160) return null;
  return trimmed;
}

export async function GET(request: NextRequest) {
  const pagePath = normalizePagePath(request.nextUrl.searchParams.get("page_path"));
  if (!pagePath) {
    return NextResponse.json({ error: "page_path query is required." }, { status: 400 });
  }
  const comments = await listPublicComments(pagePath);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const session = await getCommentWriterSession();
  if (!session) {
    return NextResponse.json(
      { error: "Authenticated active member session required.", authRequired: true },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { page_path?: string; body?: string };
  const pagePath = normalizePagePath(body.page_path ?? null);
  const commentBody = typeof body.body === "string" ? body.body.trim() : "";

  if (!pagePath) {
    return NextResponse.json({ error: "page_path is required." }, { status: 400 });
  }
  if (commentBody.length < 2) {
    return NextResponse.json({ error: "body must be at least 2 characters." }, { status: 400 });
  }
  if (commentBody.length > 2000) {
    return NextResponse.json({ error: "body must be 2000 characters or fewer." }, { status: 400 });
  }

  const rateLimit = await checkCommentRateLimit(session.userId);
  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        error: "Too many comments in a short period.",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
        reason: rateLimit.reason,
      },
      { status: 429 },
    );
  }

  const comment = await createComment({
    pagePath,
    body: commentBody,
    authorId: session.userId,
    authorLabel: session.displayName,
  });

  return NextResponse.json({ comment }, { status: 201 });
}
