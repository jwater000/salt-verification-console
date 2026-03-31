import Link from "next/link";

const ROUTES = [
  {
    id: "A",
    audience: "처음 보는 방문자",
    title: "핵심 주장만 빠르게 파악",
    desc: "책의 전체 서사를 따라가지 않고도 SALT가 무엇을 주장하는지 먼저 이해한다.",
    steps: [
      { href: "/core", label: "Core", note: "상태변수와 논리 지도" },
      { href: "/reference/visual-atlas", label: "Visual Atlas", note: "도해로 빠르게 압축 이해" },
      { href: "/verification", label: "Verification", note: "그 주장이 어떻게 시험되는지 확인" },
    ],
    accent: "cyan",
  },
  {
    id: "B",
    audience: "검토자 / 투자자 / 평가자",
    title: "결과와 신뢰 구조부터 확인",
    desc: "주장의 매력보다 판정 결과와 재현성부터 보려는 경우에 적합하다.",
    steps: [
      { href: "/verification/results", label: "Results", note: "현재 자동 산출된 판정 결과" },
      { href: "/verification/pending", label: "Pending", note: "아직 채점 전인 가설과 공백" },
      { href: "/audit", label: "Audit", note: "snapshot, run, hash, reproduce" },
    ],
    accent: "emerald",
  },
  {
    id: "C",
    audience: "기술 파트너 / 고객",
    title: "활용 가능성과 한계를 함께 검토",
    desc: "기술적 재해석이 어디까지인지, 현재 제품/기술 대화에 어떤 가치가 있는지 본다.",
    steps: [
      { href: "/engineering", label: "Engineering", note: "분야별 재해석과 성숙도" },
      { href: "/verification", label: "Verification", note: "근거가 되는 고정 채널" },
      { href: "/reference/faq", label: "FAQ", note: "자주 생기는 오해 빠르게 정리" },
    ],
    accent: "violet",
  },
] as const;

const SITE_ROLES = [
  {
    href: "/core",
    title: "Core",
    body: "책의 핵심 논리만 남겨 이론적 뼈대를 설명한다.",
  },
  {
    href: "/verification",
    title: "Verification",
    body: "SALT가 실제로 무엇으로 시험되는지와 현재 결과를 보여준다.",
  },
  {
    href: "/reference",
    title: "Reference",
    body: "도해, 용어, FAQ, 구조도로 텍스트 이해 비용을 낮춘다.",
  },
  {
    href: "/engineering",
    title: "Engineering",
    body: "기술적 함의를 검증 결과와 분리해 고객 대화용으로 정리한다.",
  },
  {
    href: "/audit",
    title: "Audit",
    body: "재현성과 provenance를 공개해 신뢰 구조를 확인하게 한다.",
  },
] as const;

const DO_NOT_CONFUSE = [
  {
    wrong: "결과판에 많이 나오면 이론 전체가 입증된 것",
    right: "지금은 고정 채널에서 SALT 오차가 기준선보다 작은지 보는 단계",
  },
  {
    wrong: "공학 페이지의 내용이 현재 구현 기술",
    right: "기존 기술을 SALT 언어로 재해석한 것과 장기 가설을 구분해 제시",
  },
  {
    wrong: "검증 대기 항목도 이미 결과가 있는 것",
    right: "가설은 있으나 운영형 관측량과 판정식이 아직 잠기지 않은 항목",
  },
];

export default function GuidePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-cyan-500/20 bg-[linear-gradient(135deg,#071827_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Guide</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          책 전체를 읽기 전에
          <br />
          어떤 경로로 들어올지 먼저 정한다
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 사이트는 장별 해설 모음이 아니라 핵심 주장, 검증 결과, 신뢰 구조, 기술적 함의를
          웹에 맞게 다시 분해한 콘솔이다. 목적에 맞는 경로로 들어오면 훨씬 빠르게 파악할 수 있다.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          목적별 추천 경로
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {ROUTES.map((route) => {
            const accents: Record<string, string> = {
              cyan: "border-cyan-500/20",
              emerald: "border-emerald-500/20",
              violet: "border-violet-500/20",
            };
            const labels: Record<string, string> = {
              cyan: "bg-cyan-500/10 text-cyan-300",
              emerald: "bg-emerald-500/10 text-emerald-300",
              violet: "bg-violet-500/10 text-violet-300",
            };
            return (
              <div key={route.id} className={`rounded-2xl border bg-slate-950/45 p-6 ${accents[route.accent]}`}>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${labels[route.accent]}`}>
                  {route.audience}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">{route.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{route.desc}</p>
                <ol className="mt-5 space-y-3">
                  {route.steps.map((step, index) => (
                    <li key={step.href} className="grid grid-cols-[auto,1fr] gap-3">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-slate-200">
                        {index + 1}
                      </span>
                      <div>
                        <Link href={step.href} className="text-sm font-semibold text-slate-100 hover:text-white">
                          {step.label}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">{step.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">이 사이트의 역할 분담</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SITE_ROLES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
              >
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white">빠르게 기억할 3가지</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">1. 책 전체를 그대로 옮기지 않는다</p>
              <p className="mt-1 text-sm text-slate-400">
                본문은 요약되고, 웹에서는 비교표, 카드, 도해, 판정 보드로 다시 조직된다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">2. 결과와 가설을 분리한다</p>
              <p className="mt-1 text-sm text-slate-400">
                이미 계산된 것과 아직 검증 대기 중인 것을 같은 언어로 섞지 않는다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">3. 설득보다 검증 구조를 먼저 보여준다</p>
              <p className="mt-1 text-sm text-slate-400">
                결과, snapshot, run, reproduce를 한 체계 안에서 따라가게 만든다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-6 py-6">
        <h2 className="mb-5 text-sm font-semibold text-white">자주 생기는 오해 정리</h2>
        <div className="space-y-3">
          {DO_NOT_CONFUSE.map((item) => (
            <div key={item.wrong} className="grid gap-2 md:grid-cols-2">
              <div className="rounded-xl border border-rose-500/15 bg-rose-950/20 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">Do not read it as</p>
                <p className="mt-1 text-sm text-rose-100/85">{item.wrong}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Read it as</p>
                <p className="mt-1 text-sm text-emerald-100/90">{item.right}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
