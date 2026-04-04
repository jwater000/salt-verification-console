import Link from "next/link";
import { CANDIDATE_HYPOTHESES } from "@/lib/site-content";

export default function CandidateHypothesesPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-amber-500/20 bg-[linear-gradient(135deg,#241606_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Candidate Hypotheses</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          검증 대기 가설 인덱스
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 항목들은 SALT 해석과 연결 가능성이 있지만, 아직 고정 채널처럼 관측량과 판정 규칙이
          잠기지 않았다. 따라서 결과판과 분리해 운영한다.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {CANDIDATE_HYPOTHESES.map((item) => (
          <div key={item.title} className="rounded-2xl border border-amber-500/15 bg-slate-950/45 p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-white">{item.title}</h2>
              <span className="badge-pending">대기</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">다음 단계</p>
              <p className="mt-1 text-sm text-amber-100/90">{item.nextStep}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.chapterRefs.map((ref) => (
                <span
                  key={ref}
                  className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                >
                  Ch.{ref}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5">
        <Link
          href="/verification"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          검증 개요 →
        </Link>
        <Link
          href="/verification/pending"
          className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-500/15"
        >
          pending 보드 →
        </Link>
      </div>
    </section>
  );
}
