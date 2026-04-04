import Link from "next/link";

const SECTIONS = [
  {
    href: "/reference/visual-atlas",
    title: "Visual Atlas",
    desc: "g00~g33 도해를 의미 단위로 묶어 맥락을 따라가며 볼 수 있게 정리한다.",
    tag: "시각화",
  },
  {
    href: "/reference/glossary",
    title: "Glossary",
    desc: "ρ, θ, L, LIV 같은 주요 용어를 표준 이론과의 관계 속에서 정리한다.",
    tag: "개념 사전",
  },
  {
    href: "/reference/faq",
    title: "FAQ",
    desc: "자주 확인하는 질문과 쟁점을 짧은 문답 형식으로 정리한다.",
    tag: "대화 준비",
  },
  {
    href: "/reference/book-map",
    title: "Book Map",
    desc: "00~28장이 현재 웹 구조의 어느 페이지와 연결되는지 정리해 둔다.",
    tag: "구조도",
  },
] as const;

const HIGHLIGHTS = [
  {
    href: "/reference/visual-atlas",
    src: "/book-graphs/g11_time_dilation_heatmap.jpg",
    title: "검증 채널을 그림으로 이해",
    body: "시간 지연, 중력파, 민감도 지도를 먼저 보고 들어가면 텍스트 부담이 크게 줄어든다.",
  },
  {
    href: "/reference/faq",
    src: "/book-graphs/g25_faq_claim_matrix.jpg",
    title: "오해를 먼저 정리",
    body: "자주 나오는 오해와 구분이 필요한 표현을 함께 정리해 둔다.",
  },
  {
    href: "/reference/book-map",
    src: "/book-graphs/g26_unified_phase_portrait.jpg",
    title: "책과 웹의 대응 관계 확인",
    body: "각 장이 어떤 웹 페이지와 대응하는지, 기능상 어떤 역할로 배치되어 있는지 정리한다.",
  },
] as const;

export default function ReferencePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-violet-500/20 bg-[linear-gradient(135deg,#120b22_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Reference</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          도해와 용어를 함께 볼 수 있는
          <br />
          참고 자료 모음
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 섹션에는 본문과 함께 참고할 수 있는 도해, 용어, FAQ, 구조도가 정리되어 있다.
          Reference는 책과 웹 사이를 왕복하기 위한 참고 허브이며, 검증 판정표나 감사 로그의
          공식 허브를 대신하지 않는다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-violet-500/20 bg-slate-950/45 p-6 transition hover:border-violet-400/40 hover:bg-slate-900/55"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                {section.tag}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{section.desc}</p>
            <p className="mt-5 text-sm font-semibold text-violet-300 group-hover:text-violet-200">
              열기 →
            </p>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            추천 시작점
          </h2>
          <Link href="/guide" className="text-xs text-cyan-400 hover:underline">
            입문 가이드 →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50 transition hover:border-slate-600"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.title}
                className="aspect-[16/9] w-full object-cover opacity-85 transition group-hover:opacity-100"
              />
              <div className="p-5">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
