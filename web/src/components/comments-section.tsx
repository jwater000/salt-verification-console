"use client";

import { useEffect, useState } from "react";
import type { PublicComment } from "@/lib/comments";
import type { AppViewerSession } from "@/lib/auth/session";
import type { CommunityRuntimeStatus } from "@/lib/community";

type CommentsSectionProps = {
  pagePath: string;
  heading?: string;
  description?: string;
  viewer?: AppViewerSession | null;
  runtime: CommunityRuntimeStatus;
};

type LoadState = "idle" | "loading" | "ready" | "error";

export default function CommentsSection({
  pagePath,
  heading = "댓글",
  description = "이 페이지의 설명에서 모호한 점이나 검증 질문을 남길 수 있도록 준비 중입니다.",
  viewer = null,
  runtime,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [viewerState, setViewerState] = useState<AppViewerSession | null>(viewer);
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

  useEffect(() => {
    if (viewer) {
      setViewerState(viewer);
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function loadViewer() {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          user?: {
            id?: string;
            name?: string | null;
            role?: "member" | "moderator" | "admin";
            status?: "active" | "restricted" | "suspended" | "deleted";
          };
        };
        if (!active || !data.user?.id) return;
        if (data.user.status && data.user.status !== "active") return;
        setViewerState({
          userId: data.user.id,
          displayName: data.user.name || "Member",
          role: data.user.role || "member",
          status: data.user.status || "active",
        });
      } catch {
        // Ignore session fetch failure and keep viewer null.
      }
    }

    void loadViewer();
    return () => {
      active = false;
      controller.abort();
    };
  }, [viewer]);

  async function handleSubmit() {
    if (!viewerState) return;
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
    if (!viewerState) return;
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
    if (!viewerState || (viewerState.role !== "moderator" && viewerState.role !== "admin")) return;
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

      {!runtime.authConfigured ? (
        <div className="mt-5 rounded-xl border border-amber-500/15 bg-amber-950/10 p-4">
          <p className="text-sm text-amber-100/90">
            현재 배포에는 OAuth 로그인 설정이 연결되지 않아 방문자 댓글 작성이 열리지 않습니다.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-amber-200/70">
            공개 댓글 읽기는 유지되지만, 쓰기 기능을 열려면 `AUTH_SECRET`과 Google 또는 GitHub
            provider 환경변수가 함께 설정되어야 합니다.
          </p>
        </div>
      ) : !viewerState ? (
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
            {viewerState.displayName} 계정으로 댓글을 작성할 수 있습니다.
          </p>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">커뮤니티 런타임 상태</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">인증</p>
            <p className="mt-1 text-sm text-slate-200">
              {runtime.authConfigured ? "OAuth 로그인 설정됨" : "OAuth 로그인 미설정"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">저장소</p>
            <p className="mt-1 text-sm text-slate-200">
              {runtime.storageMode === "database"
                ? "Neon/Postgres 우선"
                : "로컬 파일 fallback"}
            </p>
          </div>
        </div>
        {!runtime.databaseConfigured && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            `DATABASE_URL`이 없어 현재 댓글은 Neon DB가 아니라 로컬 파일 저장소를 기준으로 동작합니다.
            배포 환경에서 같은 내용이 안 보이면 DB 동기화 문제가 아니라 애초에 DB가 연결되지 않은 상태일
            가능성이 큽니다.
          </p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          댓글 작성
        </label>
        <textarea
          rows={4}
          disabled={!runtime.authConfigured || !viewerState || submitState === "submitting"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            !runtime.authConfigured
              ? "운영 환경에 OAuth 설정이 필요합니다."
              : viewerState
              ? "이 페이지의 설명에서 모호한 점이나 검증 질문을 남겨 주세요."
              : "로그인 후 댓글 작성이 열립니다."
          }
          className="mt-3 w-full resize-none rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 outline-none disabled:opacity-70"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-rose-300/90">{submitError}</div>
          <button
            type="button"
            disabled={!runtime.authConfigured || !viewerState || submitState === "submitting"}
            onClick={() => void handleSubmit()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white disabled:text-slate-500"
          >
            {submitState === "submitting"
              ? "저장 중..."
              : !runtime.authConfigured
              ? "OAuth 설정 필요"
              : viewerState
              ? "댓글 작성"
              : "로그인 후 댓글 작성"}
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
                  {viewerState && (
                    <button
                      type="button"
                      disabled={busyCommentId === comment.id}
                      onClick={() => void handleReport(comment.id)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white disabled:text-slate-500"
                    >
                      신고
                    </button>
                  )}
                  {viewerState && (viewerState.role === "moderator" || viewerState.role === "admin") && (
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
