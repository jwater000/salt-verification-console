import { NextRequest, NextResponse } from "next/server";
import { getCommentWriterSession } from "@/lib/auth/session";
import { reportComment } from "@/lib/comments";

function normalizeReason(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getCommentWriterSession();
  if (!session) {
    return NextResponse.json(
      { error: "Authenticated active member session required.", authRequired: true },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = (await request.json()) as { reason?: string };
  const reason = normalizeReason(body.reason);

  if (!id) {
    return NextResponse.json({ error: "comment id is required." }, { status: 400 });
  }
  if (reason.length < 2) {
    return NextResponse.json({ error: "reason must be at least 2 characters." }, { status: 400 });
  }
  if (reason.length > 500) {
    return NextResponse.json({ error: "reason must be 500 characters or fewer." }, { status: 400 });
  }

  await reportComment({
    commentId: id,
    reporterId: session.userId,
    reporterLabel: session.displayName,
    reason,
  });

  return NextResponse.json({ ok: true });
}
