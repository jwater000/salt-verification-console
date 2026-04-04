import Link from "next/link";
import { getModeratorSession } from "@/lib/auth/session";
import { listModerationOverview } from "@/lib/comments";

export default async function AuditCommentsPage() {
  const moderator = await getModeratorSession();

  if (!moderator) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Audit · Moderation</p>
          <h1 className="mt-3 text-3xl font-bold text-white">운영자 권한이 필요한 페이지</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            이 페이지는 댓글 신고, 숨김, 삭제 이력을 관리하는 운영자 전용 화면입니다.
          </p>
        </div>
        <div className="border-t border-slate-800 pt-4">
          <Link href="/audit" className="text-sm text-slate-400 hover:text-white">
            ← Audit 허브
          </Link>
        </div>
      </section>
    );
  }

  const overview = await listModerationOverview();

  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-amber-500/20 bg-[linear-gradient(135deg,#221609_0%,#020617_60%,#111827_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Audit · Moderation</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          댓글 운영 관리
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          신고 접수, 최근 댓글, 숨김/삭제 이력을 함께 확인하는 운영자용 관리 화면입니다.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          current moderator: <span className="text-slate-300">{moderator.displayName}</span> · {moderator.role}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">최근 댓글</p>
          <p className="mt-2 text-3xl font-bold text-white">{overview.comments.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">신고</p>
          <p className="mt-2 text-3xl font-bold text-amber-300">{overview.reports.length}</p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">운영 액션</p>
          <p className="mt-2 text-3xl font-bold text-rose-300">{overview.actions.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-6 xl:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">신고 접수</h2>
            <span className="text-xs text-slate-500">{overview.reports.length}</span>
          </div>
          <div className="mt-4 space-y-3">
            {overview.reports.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                아직 신고가 없습니다.
              </div>
            )}
            {overview.reports.map((report) => (
              <div key={report.id} className="rounded-xl border border-amber-500/15 bg-slate-950/50 p-4">
                <p className="text-sm font-semibold text-white">comment #{report.commentId.slice(0, 8)}</p>
                <p className="mt-1 text-xs text-slate-500">{report.reporterLabel}</p>
                <p className="mt-3 text-sm text-slate-300">{report.reason}</p>
                <p className="mt-3 text-xs text-slate-500">{new Date(report.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">최근 댓글</h2>
            <span className="text-xs text-slate-500">{overview.comments.length}</span>
          </div>
          <div className="mt-4 space-y-3">
            {overview.comments.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                아직 댓글이 없습니다.
              </div>
            )}
            {overview.comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{comment.authorLabel}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      comment.status === "published"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : comment.status === "hidden"
                        ? "bg-amber-500/10 text-amber-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{comment.pagePath}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{comment.body}</p>
                <p className="mt-3 text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">운영 이력</h2>
          <span className="text-xs text-slate-500">{overview.actions.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {overview.actions.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
              아직 운영 액션 이력이 없습니다.
            </div>
          )}
          {overview.actions.map((action) => (
            <div key={action.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  {action.actorLabel} · {action.action}
                </p>
                <p className="text-xs text-slate-500">{new Date(action.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">comment #{action.commentId.slice(0, 8)}</p>
              {action.reason && <p className="mt-3 text-sm text-slate-300">{action.reason}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
