import Link from "next/link";
import NextSteps from "@/components/next-steps";

const HIGHLIGHTS = [
  {
    href: "/reference/book-map",
    src: "/book-graphs/g26_unified_phase_portrait.jpg",
    title: "책과 웹의 대응 관계를 먼저 확인",
    body: "처음 온 방문자나 구매 후 독자는 Book Map에서 각 장이 웹의 어느 허브와 연결되는지 먼저 잡는 편이 빠르다.",
  },
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
] as const;

const BOOK_MAP_PREVIEW = [
  {
    chapter: "00·21장",
    web: "Home / Guide / Core",
    role: "처음 온 방문자가 전체 문제의식과 읽는 순서를 잡는 축",
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
          책과 웹의 대응 관계를 중심으로 보는
          <br />
          참고 허브
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 섹션에는 본문과 함께 참고할 수 있는 도해, 용어, FAQ, 구조도가 정리되어 있다.
          특히 Book Map을 중심으로 책 장 구조와 웹 허브의 대응 관계를 먼저 잡을 수 있다.
          Reference는 책과 웹 사이를 왕복하기 위한 구조 대응 허브이며, 검증 판정표나 감사 로그의
          공식 허브를 대신하지 않는다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            Book Map 중심
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            책-웹 대응 허브
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            결과 허브 아님
          </span>
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

      <NextSteps
        title="참고 자료 더 보기"
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
