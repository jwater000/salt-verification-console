import Link from "next/link";
import BookstoreLinks from "@/components/bookstore-links";

const ROUTES = [
  {
    id: "A",
    audience: "처음 보는 방문자",
    title: "주요 개념부터 차례로 살펴보기",
    desc: "도서 전체를 순서대로 읽기 전에 주요 개념과 검증 구조를 먼저 확인할 수 있다.",
    steps: [
      { href: "/core", label: "Core", note: "상태변수와 논리 지도" },
      { href: "/reference/visual-atlas", label: "Visual Atlas", note: "도해와 개념 흐름 참고" },
      { href: "/verification", label: "Verification", note: "어떤 검증 자료가 정리되어 있는지 확인" },
    ],
    accent: "cyan",
  },
  {
    id: "B",
    audience: "검토자 / 투자자 / 평가자",
    title: "결과와 재현 경로 먼저 확인",
    desc: "판정 결과, 검증 대기 항목, 감사 자료를 우선해서 볼 때 적합한 경로다.",
    steps: [
      { href: "/verification/results", label: "Results", note: "현재 자동 산출된 판정 결과" },
      { href: "/verification/pending", label: "Pending", note: "아직 채점 전인 가설과 공백" },
      { href: "/audit", label: "Audit", note: "snapshot, run, hash, reproduce" },
    ],
    accent: "emerald",
  },
  {
    id: "C",
    audience: "기술 관심 방문자",
    title: "기술적 해석과 한계 함께 보기",
    desc: "기술적 함의가 어떤 층위에서 정리되어 있는지, 검증 결과와 어떻게 구분되는지 살펴볼 수 있다.",
    steps: [
      { href: "/engineering", label: "Engineering", note: "분야별 재해석과 성숙도" },
      { href: "/verification", label: "Verification", note: "근거가 되는 고정 채널" },
      { href: "/reference/faq", label: "FAQ", note: "자주 나오는 질문과 구분점 정리" },
    ],
    accent: "violet",
  },
] as const;

const SITE_ROLES = [
  {
    href: "/core",
    title: "Core",
    body: "도서의 주요 개념과 이론적 뼈대를 요약하고 Logic Map과 장별 압축으로 연결한다.",
  },
  {
    href: "/verification",
    title: "Verification",
    body: "검증 채널과 현재 집계 결과를 항목별로 정리한다.",
  },
  {
    href: "/reference",
    title: "Reference",
    body: "도해, 용어, FAQ, 구조도를 함께 참고할 수 있게 정리하고 책-웹 대응표를 제공한다.",
  },
  {
    href: "/engineering",
    title: "Engineering",
    body: "기술적 해석과 가설을 검증 결과와 구분해 정리한다.",
  },
  {
    href: "/audit",
    title: "Audit",
    body: "재현 경로와 provenance 자료를 확인할 수 있게 정리하며 일반 입문 설명은 맡지 않는다.",
  },
] as const;

const DO_NOT_CONFUSE = [
  {
    wrong: "결과판에 많이 나오면 이론 전체의 타당성이 확정된 것",
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
          읽기 순서를 먼저 정하는
          <br />
          안내 페이지
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 페이지는 도서의 주요 내용과 검증 자료를 어떤 순서로 살펴보면 좋은지 안내한다.
          Guide는 길 안내만 담당하고 결과 원표나 감사 로그를 직접 담지 않는다. 관심사에 따라
          개념, 결과, 참고 자료, 감사 자료로 나누어 접근할 수 있다.
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
          <h2 className="text-sm font-semibold text-white">먼저 확인할 3가지</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">1. 책 전체를 그대로 옮기지 않는다</p>
              <p className="mt-1 text-sm text-slate-400">
                웹에서는 본문 전체 대신 비교표, 카드, 도해, 판정 보드 중심으로 정보를 정리한다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">2. 결과와 가설을 구분해 본다</p>
              <p className="mt-1 text-sm text-slate-400">
                이미 집계된 결과와 아직 검증 대기 중인 항목을 같은 층위에서 다루지 않는다.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">3. 자료 성격을 먼저 확인한다</p>
              <p className="mt-1 text-sm text-slate-400">
                결과, snapshot, run, reproduce 자료를 나누어 확인할 수 있다.
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
      <BookstoreLinks
        title="도서 구매처 안내"
        description="읽기 순서를 확인한 뒤 바로 도서를 찾으려는 경우 아래 서점 페이지를 참고할 수 있다."
        compact
      />
      </div>
    </section>
  );
}
