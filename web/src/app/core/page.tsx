import Link from "next/link";

const CHAPTERS = [
  {
    num: "17",
    href: "/core/chapters/17",
    title: "이론의 토대",
    oneLiner: "공간 밀도 구조 ρ, θ, L의 정의와 표준 이론과의 접점",
    keyQuestions: [
      "공간이 왜 비어 있지 않은가",
      "상태변수 세 개가 어떻게 관측량으로 연결되는가",
      "표준 모형과 어디서 갈라지는가",
    ],
    status: "theory-core" as const,
    statusLabel: "이론 핵심",
  },
  {
    num: "18",
    href: "/verification",
    title: "검증 채널과 판정",
    oneLiner: "LIV · 강중력장 지연 · HF-GW 꼬리 — 3개 고정 채널의 판정 구조",
    keyQuestions: [
      "SALT는 무엇으로 시험되는가",
      "판정 규칙은 어떻게 사전에 잠기는가",
      "후보 가설과 고정 채널의 차이는 무엇인가",
    ],
    status: "testable" as const,
    statusLabel: "검증 대상",
  },
  {
    num: "19",
    href: "/engineering",
    title: "공학적 함의",
    oneLiner: "중력 · 전자기 · 강력 · 약력 · 양자 — 기술 분야별 SALT 재해석",
    keyQuestions: [
      "기존 기술이 SALT 언어로 어떻게 다르게 읽히는가",
      "어느 분야가 해석 재정렬이고, 어느 분야가 장기 가설인가",
      "검증 장(18장)과 어떻게 구분되는가",
    ],
    status: "engineering" as const,
    statusLabel: "공학 가설",
  },
];

const LOGIC_FLOW = [
  { id: "A", label: "공간 구조 가정", body: "ρ, θ, L로 기술되는 비어 있지 않은 공간" },
  { id: "B", label: "신호 전파 예측", body: "밀도 구조를 지난 신호가 흔적을 남긴다" },
  { id: "C", label: "관측량 연결", body: "LIV 파라미터, 시간 지연, 적색편이, 고주파 잔차" },
  { id: "D", label: "기각 조건 명시", body: "표준 기준선과 동등하거나 낮으면 항 기각" },
  { id: "E", label: "데이터 비교", body: "frozen 데이터로 SALT vs 표준의 오차를 자동 집계" },
];

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
          이론을 시험한다. 17 · 18 · 19장이 이 논리의 뼈대다.
        </p>
      </div>

      {/* Logic flow */}
      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">논리 흐름</h2>
        <div className="relative space-y-0">
          {LOGIC_FLOW.map((step, i) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                  {step.id}
                </div>
                {i < LOGIC_FLOW.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-slate-800" />
                )}
              </div>
              <div className={`pb-4 ${i === LOGIC_FLOW.length - 1 ? "" : ""}`}>
                <p className="text-sm font-bold text-slate-200">{step.label}</p>
                <p className="mt-0.5 text-sm text-slate-400">{step.body}</p>
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
          {CHAPTERS.map((ch) => {
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
