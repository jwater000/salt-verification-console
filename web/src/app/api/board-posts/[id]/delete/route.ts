import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getModeratorSession } from "@/lib/auth/session";
import { moderateBoardPost } from "@/lib/community";

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
  const ok = await moderateBoardPost({
    postId: id,
    actorUserId: session.userId,
    action: "delete",
    reason: typeof body.reason === "string" ? body.reason.trim() : null,
  });

  if (!ok) {
    return NextResponse.json({ error: "board post not found." }, { status: 404 });
  }

  revalidatePath("/discussion");

  return NextResponse.json({ ok: true });
}
