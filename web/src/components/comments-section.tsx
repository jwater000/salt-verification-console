"use client";

import { useEffect, useState } from "react";
import type { PublicComment } from "@/lib/comments";
import type { AppViewerSession } from "@/lib/auth/session";

type CommentsSectionProps = {
  pagePath: string;
  heading?: string;
  description?: string;
  viewer?: AppViewerSession | null;
};

type LoadState = "idle" | "loading" | "ready" | "error";

export default function CommentsSection({
  pagePath,
  heading = "댓글",
  description = "이 페이지의 설명에서 모호한 점이나 검증 질문을 남길 수 있도록 준비 중입니다.",
  viewer = null,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyCommentId, setBusyCommentId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function load() {
      setState("loading");
      setError(null);
      try {
        const res = await fetch(`/api/comments?page_path=${encodeURIComponent(pagePath)}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("댓글을 불러오지 못했습니다.");
        const data = (await res.json()) as { comments?: PublicComment[] };
        if (!active) return;
        setComments(Array.isArray(data.comments) ? data.comments : []);
        setState("ready");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "댓글을 불러오지 못했습니다.");
        setState("error");
      }
    }

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [pagePath]);

  async function handleSubmit() {
    if (!viewer) return;
    const trimmed = draft.trim();
    if (trimmed.length < 2) {
      setSubmitError("댓글은 두 글자 이상이어야 합니다.");
      return;
    }

    setSubmitState("submitting");
    setSubmitError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_path: pagePath,
          body: trimmed,
        }),
      });
      const data = (await res.json()) as { comment?: PublicComment; error?: string };
      if (!res.ok || !data.comment) {
        throw new Error(data.error || "댓글을 저장하지 못했습니다.");
      }
      setComments((current) => [...current, data.comment as PublicComment]);
      setDraft("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "댓글을 저장하지 못했습니다.");
    } finally {
      setSubmitState("idle");
    }
  }

  async function handleReport(commentId: string) {
    if (!viewer) return;
    const reason = window.prompt("신고 사유를 짧게 입력해 주세요.");
    if (!reason) return;

    setBusyCommentId(commentId);
    setActionError(null);
    try {
      const res = await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "신고를 저장하지 못했습니다.");
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "신고를 저장하지 못했습니다.");
    } finally {
      setBusyCommentId(null);
    }
  }

  async function handleModeration(commentId: string, action: "hide" | "delete") {
    if (!viewer || (viewer.role !== "moderator" && viewer.role !== "admin")) return;
    const reason = window.prompt(
      action === "hide" ? "숨김 사유를 입력해 주세요." : "삭제 사유를 입력해 주세요.",
    );

    setBusyCommentId(commentId);
    setActionError(null);
    try {
      const res = await fetch(`/api/comments/${commentId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "작업을 완료하지 못했습니다.");
      }
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "작업을 완료하지 못했습니다.");
    } finally {
      setBusyCommentId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">{heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
          page: {pagePath}
        </span>
      </div>

      {!viewer ? (
        <div className="mt-5 rounded-xl border border-amber-500/15 bg-amber-950/10 p-4">
          <p className="text-sm text-amber-100/90">댓글 작성은 로그인한 활성 사용자에게만 열립니다.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(pagePath)}`}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Google로 로그인
            </a>
            <a
              href={`/api/auth/signin/github?callbackUrl=${encodeURIComponent(pagePath)}`}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              GitHub로 로그인
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4">
          <p className="text-sm text-emerald-100/90">
            {viewer.displayName} 계정으로 댓글을 작성할 수 있습니다.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          댓글 작성
        </label>
        <textarea
          rows={4}
          disabled={!viewer || submitState === "submitting"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            viewer
              ? "이 페이지의 설명에서 모호한 점이나 검증 질문을 남겨 주세요."
              : "로그인 후 댓글 작성이 열립니다."
          }
          className="mt-3 w-full resize-none rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 outline-none disabled:opacity-70"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-rose-300/90">{submitError}</div>
          <button
            type="button"
            disabled={!viewer || submitState === "submitting"}
            onClick={() => void handleSubmit()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white disabled:text-slate-500"
          >
            {submitState === "submitting" ? "저장 중..." : viewer ? "댓글 작성" : "로그인 후 댓글 작성"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">공개 댓글</h3>
          <span className="text-xs text-slate-500">{comments.length} items</span>
        </div>

        {actionError && (
          <div className="mb-3 rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-sm text-rose-200/90">
            {actionError}
          </div>
        )}

        {state === "loading" && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
            댓글을 불러오는 중입니다.
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-sm text-rose-200/90">
            {error}
          </div>
        )}

        {state === "ready" && comments.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
            아직 공개 댓글이 없습니다.
          </div>
        )}

        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{comment.authorLabel}</p>
                  <time className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {comment.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {viewer && (
                    <button
                      type="button"
                      disabled={busyCommentId === comment.id}
                      onClick={() => void handleReport(comment.id)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white disabled:text-slate-500"
                    >
                      신고
                    </button>
                  )}
                  {viewer && (viewer.role === "moderator" || viewer.role === "admin") && (
                    <>
                      <button
                        type="button"
                        disabled={busyCommentId === comment.id}
                        onClick={() => void handleModeration(comment.id, "hide")}
                        className="rounded-lg border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300 transition hover:border-amber-400/40 disabled:text-slate-500"
                      >
                        숨김
                      </button>
                      <button
                        type="button"
                        disabled={busyCommentId === comment.id}
                        onClick={() => void handleModeration(comment.id, "delete")}
                        className="rounded-lg border border-rose-500/20 px-3 py-1.5 text-xs text-rose-300 transition hover:border-rose-400/40 disabled:text-slate-500"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
