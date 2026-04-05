import Link from "next/link";
import NextSteps from "@/components/next-steps";

const HIGHLIGHTS = [
  {
    href: "/reference/book-map",
    src: "/book-graphs/g26_unified_phase_portrait.jpg",
    title: "개념이 책에서 어디로 뻗는지 한눈에 보기",
    body: "Book Map은 SALT의 주요 생각이 책의 어느 장에서 시작해 웹의 어느 페이지로 이어지는지 보여 준다.",
  },
  {
    href: "/reference/visual-atlas",
    src: "/book-graphs/g11_time_dilation_heatmap.jpg",
    title: "그림으로 먼저 이해하기",
    body: "시간 지연, 중력파, 민감도 지도 같은 시각 자료를 먼저 보면 SALT의 논리가 훨씬 빨리 붙는다.",
  },
  {
    href: "/reference/faq",
    src: "/book-graphs/g25_faq_claim_matrix.jpg",
    title: "헷갈리는 질문을 바로 풀기",
    body: "자주 나오는 오해와 표현의 함정을 먼저 정리하면, 뒤에서 같은 지점에 다시 걸리지 않는다.",
  },
] as const;

const BOOK_MAP_PREVIEW = [
  {
    chapter: "00·21장",
    web: "Home / Core",
    role: "처음 온 방문자가 전체 문제의식과 핵심 개념 축을 잡는 영역",
  },
  {
    chapter: "17장",
    web: "Core / Logic Map",
    role: "상태변수와 이론 구조를 압축해 보여주는 중심 축",
  },
  {
    chapter: "18장",
    web: "Verification",
    role: "고정 채널, 비교식, 판정 규칙과 결과를 보는 축",
  },
  {
    chapter: "24~27장",
    web: "Audit",
    role: "재현, provenance, source, frozen 기준을 점검하는 축",
  },
] as const;

export default function ReferencePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-violet-500/20 bg-[linear-gradient(135deg,#120b22_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Reference</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT를 읽다가 손에서 미끄러지는 순간마다
          <br />
          다시 붙잡게 해 주는 자료들
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          어떤 독자는 문장보다 그림에서 더 빨리 이해하고, 어떤 독자는 용어 정의가 있어야 안심하고
          앞으로 나아간다. 이곳은 그런 순간을 위해 준비된 영역이다. 개념의 위치를 확인하고, 용어를
          붙잡고, 자주 생기는 오해를 걷어내며 SALT의 흐름을 더 또렷하게 만든다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Book Map</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Glossary</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">FAQ</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">Visual Atlas</span>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-slate-950/45 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Book Map 미리보기</h2>
          <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
            구조 대응
          </span>
        </div>
        <div className="space-y-3">
          {BOOK_MAP_PREVIEW.map((item) => (
            <div
              key={item.chapter}
              className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4 md:grid-cols-[0.7fr,0.9fr,1.4fr]"
            >
              <p className="text-sm font-semibold text-slate-100">{item.chapter}</p>
              <p className="text-sm text-violet-200">{item.web}</p>
              <p className="text-sm leading-relaxed text-slate-400">{item.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            먼저 집어 들기 좋은 자료
          </h2>
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            소개 페이지 →
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

      <NextSteps
        title="더 펼쳐 보기"
        steps={[
          {
            href: "/reference/book-map",
            title: "Book Map",
            body: "책의 장 구조와 웹 허브의 대응 관계를 전체 표로 확인한다.",
          },
          {
            href: "/reference/glossary",
            title: "Glossary",
            body: "ρ, θ, L, LIV 같은 핵심 용어를 표준 이론과의 관계 속에서 읽는다.",
          },
          {
            href: "/reference/visual-atlas",
            title: "Visual Atlas",
            body: "도해와 그래프를 중심으로 각 검증 축의 그림 흐름을 먼저 본다.",
          },
        ]}
      />
    </section>
  );
}
