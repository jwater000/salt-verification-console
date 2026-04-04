import { NextRequest, NextResponse } from "next/server";
import { getModeratorSession } from "@/lib/auth/session";
import { moderateComment } from "@/lib/comments";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getModeratorSession();
  if (!session) {
    return NextResponse.json({ error: "Moderator or admin session required." }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const ok = await moderateComment({
    commentId: id,
    actorUserId: session.userId,
    actorLabel: session.displayName,
    action: "hide",
    reason: typeof body.reason === "string" ? body.reason.trim() : null,
  });

  if (!ok) {
    return NextResponse.json({ error: "comment not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
