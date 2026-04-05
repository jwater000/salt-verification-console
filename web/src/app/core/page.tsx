import Link from "next/link";
import { CORE_CHAPTERS, LOGIC_MAP_STAGES } from "@/lib/site-content";
import NextSteps from "@/components/next-steps";

export default function CorePage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-[#020e1f] to-slate-950 px-8 py-10">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-500/8 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Core Ideas</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT의 핵심 아이디어가
          <br />
          왜 하나의 이야기처럼 이어지는가
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          여기서는 장 번호보다 먼저 전환점을 본다. 왜 기존 설명에서는 공간, 질량, 상호작용이 서로
          따로 놀아 보이는지, SALT가 그것들을 어떤 상태변수 언어로 다시 묶는지, 그리고 그 해석이 왜
          결국 검증으로 내려가야 하는지를 한 줄의 흐름으로 따라간다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            Problem → Clue → Concept → Solution
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            장 요약보다 흐름 우선
          </span>
        </div>
      </div>

      {/* Logic flow */}
      <div className="panel px-6 py-6">
          <h2 className="mb-5 text-sm font-bold text-white">한 줄로 이어 보는 논리 흐름</h2>
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

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <h2 className="text-sm font-semibold text-white">핵심 장면 세 가지</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-slate-100">문제의식</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
              지금의 물리 설명이 어디에서 끊겨 보이는지, 왜 하나의 구조 문제로 다시 읽어야 하는지 본다.
              </p>
            </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-slate-100">상태변수 언어</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
              ρ, θ, L이 단순 기호가 아니라 공간의 상태와 관측 흔적을 잇는 문법이라는 점을 본다.
              </p>
            </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold text-slate-100">검증으로의 연결</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
              좋은 설명이 결국 어떤 시험대로 내려가야 하는지, 이론과 판정의 경계가 어디인지 확인한다.
              </p>
            </div>
          </div>
      </div>

      {/* Chapter cards */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">장별 핵심 요약</h2>
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
        <h2 className="mb-4 text-sm font-bold text-white">읽으면서 붙잡으면 좋은 구분</h2>
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

      <NextSteps
        steps={[
          {
            href: "/core/logic-map",
            title: "Logic Map",
            body: "문제에서 검증으로 넘어가는 논리 중간층을 한 번에 본다.",
          },
          {
            href: "/core/chapters",
            title: "Chapter Index",
            body: "17·18·19장 요약을 장 단위로 이어서 읽는다.",
          },
          {
            href: "/verification",
            title: "Verification",
            body: "이론 설명 다음에 실제 판정 구조와 채널 비교로 넘어간다.",
          },
        ]}
      />
    </section>
  );
}
