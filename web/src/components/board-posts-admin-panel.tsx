"use client";

import { useState } from "react";
import type { PublicBoardPost } from "@/lib/community";

type BoardPostsAdminPanelProps = {
  posts: PublicBoardPost[];
};

export default function BoardPostsAdminPanel({ posts }: BoardPostsAdminPanelProps) {
  const [items, setItems] = useState(posts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleModeration(postId: string, action: "hide" | "delete") {
    const reason = window.prompt(
      action === "hide" ? "숨김 사유를 입력해 주세요." : "삭제 사유를 입력해 주세요.",
    );

    setBusyId(postId);
    setError(null);
    try {
      const res = await fetch(`/api/board-posts/${postId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "게시글 운영 작업을 완료하지 못했습니다.");
      }

      setItems((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, status: action === "hide" ? "hidden" : "deleted" }
            : post,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 운영 작업을 완료하지 못했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">최근 게시판 글</h2>
        <span className="text-xs text-slate-500">{items.length}</span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
            아직 게시판 글이 없습니다.
          </div>
        )}
        {items.map((post) => (
          <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a href={`/discussion/${post.slug}`} className="text-sm font-semibold text-white hover:text-emerald-300">
                {post.title}
              </a>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  post.status === "published"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : post.status === "hidden"
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-rose-500/10 text-rose-300"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {post.authorLabel} · {post.boardKey} · 댓글 {post.commentCount} ·{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {post.body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === post.id || post.status !== "published"}
                onClick={() => void handleModeration(post.id, "hide")}
                className="rounded-lg border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300 transition hover:border-amber-400/40 disabled:text-slate-500"
              >
                숨김
              </button>
              <button
                type="button"
                disabled={busyId === post.id || post.status === "deleted"}
                onClick={() => void handleModeration(post.id, "delete")}
                className="rounded-lg border border-rose-500/20 px-3 py-1.5 text-xs text-rose-300 transition hover:border-rose-400/40 disabled:text-slate-500"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
