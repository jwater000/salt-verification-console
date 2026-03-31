import Link from "next/link";

const SECTIONS = [
  {
    href: "/reference/visual-atlas",
    title: "Visual Atlas",
    desc: "g00~g33 도해를 의미 단위로 큐레이션해 빠르게 맥락을 잡게 한다.",
    tag: "시각화",
  },
  {
    href: "/reference/glossary",
    title: "Glossary",
    desc: "ρ, θ, L, LIV 같은 핵심 용어를 표준 이론과의 관계 속에서 읽게 한다.",
    tag: "개념 사전",
  },
  {
    href: "/reference/faq",
    title: "FAQ",
    desc: "외부 검토자와 고객이 가장 먼저 묻는 질문을 짧고 방어적으로 정리한다.",
    tag: "대화 준비",
  },
  {
    href: "/reference/book-map",
    title: "Book Map",
    desc: "00~28장이 현재 웹 구조 어디에 압축 반영됐는지 연결 관계를 보여준다.",
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
    body: "SALT가 무엇을 주장하지 않는지까지 포함해 설명 비용을 줄인다.",
  },
  {
    href: "/reference/book-map",
    src: "/book-graphs/g26_unified_phase_portrait.jpg",
    title: "책과 웹의 대응 관계 확인",
    body: "각 장을 그대로 노출하지 않고 어떤 웹 페이지에서 기능적으로 재구성했는지 보여준다.",
  },
] as const;

export default function ReferencePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-violet-500/20 bg-[linear-gradient(135deg,#120b22_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Reference</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          책을 읽지 않고도
          <br />
          빠르게 이해하도록 돕는 시각 허브
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          레퍼런스 섹션은 본문 저장소가 아니다. 도해, 용어, FAQ, 구조도를 통해 이해 속도를 높이고
          외부와의 대화 비용을 줄이는 보조 허브다.
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
