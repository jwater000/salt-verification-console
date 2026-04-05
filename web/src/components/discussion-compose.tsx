"use client";

import { useState } from "react";
import type { CommunityRuntimeStatus } from "@/lib/community";

type DiscussionComposeProps = {
  runtime: CommunityRuntimeStatus;
};

export default function DiscussionCompose({ runtime }: DiscussionComposeProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "submitting">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setMessage(null);
    setError(null);

    if (!runtime.authConfigured) {
      setError("OAuth 설정이 없어 게시글 작성을 열 수 없습니다.");
      return;
    }

    setState("submitting");
    try {
      const res = await fetch("/api/board-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = (await res.json()) as { error?: string; post?: { slug: string } };
      if (!res.ok || !data.post) {
        throw new Error(data.error || "게시글을 저장하지 못했습니다.");
      }

      setTitle("");
      setBody("");
      setMessage("게시글이 저장되었습니다. 상세 페이지로 이동합니다.");
      window.location.assign(`/discussion/${data.post.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글을 저장하지 못했습니다.");
    } finally {
      setState("idle");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <h2 className="text-sm font-semibold text-white">새 글 남기기</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        긴 질문, 독서 메모, 해석 정리는 여기에서 게시글로 남깁니다. 운영 환경에서는 Neon/Postgres에
        저장되고, 로컬 개발 환경에서는 fallback 저장소로도 목록 확인이 가능하게 맞춰 두었습니다.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            제목
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={!runtime.authConfigured || state === "submitting"}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 outline-none disabled:opacity-70"
            placeholder="예: 17장과 18장 연결에서 가장 헷갈렸던 점"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            본문
          </label>
          <textarea
            rows={6}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={!runtime.authConfigured || state === "submitting"}
            className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 outline-none disabled:opacity-70"
            placeholder="질문, 반론, 독서 메모를 자유롭게 남겨 주세요."
          />
        </div>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          disabled={!runtime.authConfigured || state === "submitting"}
          onClick={() => void handleSubmit()}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white disabled:text-slate-500"
        >
          {state === "submitting" ? "저장 중..." : "게시글 작성"}
        </button>
      </div>
    </div>
  );
}
