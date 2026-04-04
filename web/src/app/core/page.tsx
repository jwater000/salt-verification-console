import Link from "next/link";
import { CORE_CHAPTERS, LOGIC_MAP_STAGES } from "@/lib/site-content";

export default function CorePage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#020e1f] to-slate-950 px-8 py-10">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-500/8 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Core Ideas</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          책의 핵심 논리 구조
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          SALT는 세 개의 상태변수로 공간 구조를 기술하고, 그 구조가 신호에 남기는 흔적으로
          이론을 시험한다. 17 · 18 · 19장이 이 논리의 뼈대다. Core는 이론 구조를 설명하는
          허브이며, 실제 판정 결과표는 Verification에서 따로 본다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            Problem → Clue → Concept → Solution
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            결과 원표는 제외
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/core/logic-map"
            className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-500/15"
          >
            Logic Map →
          </Link>
          <Link
            href="/core/chapters"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            장별 요약 →
          </Link>
        </div>
      </div>

      {/* Logic flow */}
      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">논리 흐름</h2>
        <div className="relative space-y-0">
          {LOGIC_MAP_STAGES.map((step, i) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                  {step.id}
                </div>
                {i < LOGIC_MAP_STAGES.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-slate-800" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-bold text-slate-200">{step.title}</p>
                <p className="mt-0.5 text-sm text-slate-400">{step.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter cards */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          장별 핵심 요약
        </h2>
        <div className="space-y-4">
          {CORE_CHAPTERS.map((ch) => {
            const statusStyles = {
              "theory-core": {
                badge: "badge-interpret",
                border: "border-violet-500/20 hover:border-violet-500/40",
                tag: "bg-violet-500/10 text-violet-300",
              },
              "testable": {
                badge: "badge-verified",
                border: "border-cyan-500/20 hover:border-cyan-500/40",
                tag: "bg-cyan-500/10 text-cyan-300",
              },
              "engineering": {
                badge: "badge-speculative",
                border: "border-emerald-500/20 hover:border-emerald-500/40",
                tag: "bg-emerald-500/10 text-emerald-300",
              },
            };
            const s = statusStyles[ch.status];
            return (
              <Link
                key={ch.num}
                href={ch.href}
                className={`group block rounded-xl border bg-slate-950/50 p-6 transition-all duration-200 hover:bg-slate-900/50 ${s.border}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${s.tag}`}>
                      {ch.num}장
                    </span>
                    <span className={s.badge}>{ch.statusLabel}</span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-300">
                    자세히 →
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-white">{ch.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{ch.oneLiner}</p>
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    핵심 질문
                  </p>
                  <ul className="space-y-1">
                    {ch.keyQuestions.map((q) => (
                      <li key={q} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1 text-xs text-slate-600">—</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Status legend */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-6 py-5">
        <h2 className="mb-4 text-sm font-bold text-white">콘텐츠 구분 범례</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <span className="badge-verified mt-0.5">검증 완료</span>
            <p className="text-xs text-slate-500">frozen 판정 규칙 고정</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge-pending mt-0.5">검증 대기</span>
            <p className="text-xs text-slate-500">형식화 완료, 데이터 집계 중</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge-interpret mt-0.5">기술 재해석</span>
            <p className="text-xs text-slate-500">기존 기술을 SALT 언어로 재독해</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge-speculative mt-0.5">장기 가설</span>
            <p className="text-xs text-slate-500">검증 경로 미확정 영역</p>
          </div>
        </div>
      </div>
    </section>
  );
}
