import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getCommentWriterSession } from "@/lib/auth/session";
import { createBoardPost } from "@/lib/community";

export async function POST(request: NextRequest) {
  const session = await getCommentWriterSession();
  if (!session) {
    return NextResponse.json(
      { error: "Authenticated active member session required.", authRequired: true },
      { status: 401 },
    );
  }

  const body = (await request.json()) as { title?: string; body?: string };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.body === "string" ? body.body.trim() : "";

  if (title.length < 4) {
    return NextResponse.json({ error: "title must be at least 4 characters." }, { status: 400 });
  }
  if (title.length > 120) {
    return NextResponse.json({ error: "title must be 120 characters or fewer." }, { status: 400 });
  }
  if (content.length < 8) {
    return NextResponse.json({ error: "body must be at least 8 characters." }, { status: 400 });
  }
  if (content.length > 5000) {
    return NextResponse.json({ error: "body must be 5000 characters or fewer." }, { status: 400 });
  }

  try {
    const post = await createBoardPost({
      title,
      body: content,
      authorId: session.userId,
      authorLabel: session.displayName,
    });

    revalidatePath("/discussion");
    revalidatePath(`/discussion/${post.slug}`);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create board post." },
      { status: 500 },
    );
  }
}
