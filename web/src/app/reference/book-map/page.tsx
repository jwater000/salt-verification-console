import Link from "next/link";

type Part = {
  id: string;
  label: string;
  color: string;
  chapters: Chapter[];
};

type Chapter = {
  num: string;
  title: string;
  purpose: string;
  webLink?: { href: string; label: string };
  status: "core" | "verification" | "engineering" | "appendix" | "intro";
};

const BOOK_PARTS: Part[] = [
  {
    id: "intro",
    label: "Intro",
    color: "slate",
    chapters: [
      {
        num: "00",
        title: "문제 의식과 자리매김",
        purpose: "책 전체가 묻는 핵심 질문과 논리 흐름의 시작점",
        webLink: { href: "/core", label: "Core Ideas" },
        status: "intro",
      },
    ],
  },
  {
    id: "part1",
    label: "Part 1 · 문제 제기",
    color: "rose",
    chapters: [
      { num: "01", title: "보이지 않는 힘의 위기", purpose: "GR과 양자역학의 비정합 — 왜 두 이론이 충돌하는가", status: "intro" },
      { num: "02", title: "스케일 문제", purpose: "플랑크 스케일부터 우주 스케일까지 이어지는 구조 요구", status: "intro" },
      { num: "03", title: "힘의 통일 시도들", purpose: "초끈, 루프 양자중력 등 기존 시도의 난점", status: "intro" },
      { num: "04", title: "빛의 경로 감각", purpose: "빛이 공간을 '느끼는' 방식의 재해석 동기", status: "intro" },
      { num: "05", title: "질량의 기원", purpose: "Higgs 메커니즘 외부에서의 질량 생성 가설 동기", status: "intro" },
    ],
  },
  {
    id: "part2",
    label: "Part 2 · 개념 전환",
    color: "sky",
    chapters: [
      { num: "06", title: "공간 밀도의 실재", purpose: "ρ가 0이 아닐 때 무엇이 달라지는가", status: "core" },
      { num: "07", title: "매듭과 위상", purpose: "공간 구조의 위상적 안정성 — 질량 고착 가설의 기반", status: "core" },
      { num: "08", title: "중력파와 매질", purpose: "GW를 공간 매질 요동으로 읽는 재해석", status: "core" },
      { num: "09", title: "국소 빅뱅과 밀도", purpose: "우주 초기 고밀도 구간과 현재 잔재의 연결", status: "core" },
      { num: "10", title: "인플레이션 재해석", purpose: "인플레이션을 ρ 구조 형성으로 읽는 시도", status: "core" },
      { num: "11", title: "시간 지연의 구조", purpose: "Shapiro 지연 외 추가 지연의 물리적 근거", status: "core" },
    ],
  },
  {
    id: "part3",
    label: "Part 3 · 통합 구조",
    color: "violet",
    chapters: [
      { num: "12", title: "통합 지도", purpose: "ρ, θ, L을 연결하는 전체 논리 지도", status: "core" },
      { num: "13", title: "양자 얽힘 재해석", purpose: "Bell-CHSH를 SALT 언어로 읽는 시도", status: "core" },
      { num: "14", title: "얽힘과 공유 메모리", purpose: "얽힘을 생성 이력 공유 상태로 해석", status: "core" },
      { num: "15", title: "결합 상수의 흐름", purpose: "달리는 결합 상수를 ρ 의존 공명 조건으로 재해석", status: "core" },
      { num: "16", title: "이중 적분 구조", purpose: "SALT 적분 축의 수학적 골격", status: "core" },
    ],
  },
  {
    id: "theory-core",
    label: "Theory Core",
    color: "violet",
    chapters: [
      {
        num: "17",
        title: "이론의 토대",
        purpose: "상태변수 ρ, θ, L의 정의와 저에너지 GR 정합. 비상대론 코어.",
        webLink: { href: "/core/chapters/17", label: "17장 페이지" },
        status: "core",
      },
    ],
  },
  {
    id: "predictions",
    label: "검증 · 예측 · 결론",
    color: "cyan",
    chapters: [
      {
        num: "18",
        title: "검증 채널과 판정",
        purpose: "고정 채널 3개(LIV·중력 지연·HF-GW) 설계. 판정 규칙 잠금 원칙.",
        webLink: { href: "/verification", label: "Verification" },
        status: "verification",
      },
      {
        num: "19",
        title: "공학적 함의",
        purpose: "5대 분야 기술 재해석. 해석 재정렬 / 설계 가설 / 장기 예측 구분.",
        webLink: { href: "/engineering", label: "Engineering" },
        status: "engineering",
      },
      {
        num: "20",
        title: "예측 목록과 검증 대기",
        purpose: "후보 가설 묶음. 판정 규칙이 아직 잠기지 않은 항목 공개.",
        webLink: { href: "/verification/pending", label: "Pending" },
        status: "verification",
      },
    ],
  },
  {
    id: "appendix",
    label: "부록 · 방어 명세",
    color: "amber",
    chapters: [
      { num: "21", title: "용어 관계 지도", purpose: "핵심 개념 간 관계와 정의 체계", webLink: { href: "/reference/glossary", label: "Glossary" }, status: "appendix" },
      { num: "22", title: "뇌터 대칭 연결", purpose: "보존 법칙과 SALT 대칭 구조의 수학적 연결", status: "appendix" },
      { num: "23", title: "붕괴 분기와 세대", purpose: "입자 붕괴 패턴과 세대 구조의 SALT 재해석", status: "appendix" },
      { num: "24", title: "예측 민감도", purpose: "어떤 채널이 SALT를 가장 잘 시험하는가", status: "appendix" },
      { num: "25", title: "수학 골격", purpose: "핵심 변수 및 약장 식의 기술적 배경 (ADM 전단계)", status: "appendix" },
      { num: "26", title: "ADM 감사", purpose: "독립 자유도 확인, Brans-Dicke ghost 제거 감사.", webLink: { href: "/audit", label: "Audit" }, status: "appendix" },
      { num: "27", title: "운영 프로토콜", purpose: "차별 예측 3채널의 최종 잠금 기준 명세", webLink: { href: "/audit/reproduce", label: "재현 방법" }, status: "appendix" },
      { num: "28", title: "감사 흐름도", purpose: "검증 절차 전체의 감사 흐름 최종 요약", webLink: { href: "/audit/reproduce", label: "재현 방법" }, status: "appendix" },
    ],
  },
];

const STATUS_BADGE: Record<Chapter["status"], { cls: string; label: string }> = {
  intro:        { cls: "bg-slate-700/60 text-slate-400",         label: "도입" },
  core:         { cls: "bg-violet-500/10 text-violet-300",        label: "이론 코어" },
  verification: { cls: "bg-cyan-500/10 text-cyan-300",            label: "검증" },
  engineering:  { cls: "bg-emerald-500/10 text-emerald-300",      label: "공학" },
  appendix:     { cls: "bg-amber-500/10 text-amber-300",          label: "부록" },
};

const PART_COLOR: Record<string, { dot: string; border: string; tag: string }> = {
  slate:  { dot: "bg-slate-500",   border: "border-slate-700/50",    tag: "bg-slate-800 text-slate-400" },
  rose:   { dot: "bg-rose-400",    border: "border-rose-500/20",     tag: "bg-rose-500/10 text-rose-300" },
  sky:    { dot: "bg-sky-400",     border: "border-sky-500/20",      tag: "bg-sky-500/10 text-sky-300" },
  violet: { dot: "bg-violet-400",  border: "border-violet-500/20",   tag: "bg-violet-500/10 text-violet-300" },
  cyan:   { dot: "bg-cyan-400",    border: "border-cyan-500/20",     tag: "bg-cyan-500/10 text-cyan-300" },
  amber:  { dot: "bg-amber-400",   border: "border-amber-500/20",    tag: "bg-amber-500/10 text-amber-300" },
};

export default function BookMapPage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="panel px-8 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Reference · Book Map
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
          책의 흐름이 웹에서
          <br />
          어디로 이어지는지 보는 지도
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
          책을 읽다 보면 어떤 장은 개념의 중심이고, 어떤 장은 검증의 문턱이며, 어떤 장은 부록처럼 보이지만
          사실 전체 구조를 떠받친다. 이 지도는 각 장이 웹에서 어디로 이어지고 어떤 역할을 하는지 한눈에
          보여 준다.
        </p>

        {/* Part index */}
        <div className="mt-5 flex flex-wrap gap-2">
          {BOOK_PARTS.map((part) => {
            const c = PART_COLOR[part.color];
            return (
              <a
                key={part.id}
                href={`#${part.id}`}
                className={`rounded-full border px-3 py-0.5 text-xs font-medium transition hover:opacity-80 ${c.border} ${c.tag}`}
              >
                {part.label} ({part.chapters.length})
              </a>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-violet-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">처음 읽는 독자</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            `00`, `17`, `18`, `21`을 먼저 잡으면 책의 문제의식, 핵심 개념, 검증 축, 용어 체계가 빠르게 선다.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">웹이 이어받는 역할</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            웹은 책 전체를 복제하기보다, 각 장의 핵심 질문과 전환점을 독자가 바로 붙잡게 하는 쪽에 집중한다.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">막힐 때 건너가는 다리</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            책을 읽다 막히면 참고자료로 오고, 개념이 잡히면 다시 핵심 아이디어나 내용 검증으로 돌아가면 된다.
          </p>
        </div>
      </div>

      {/* Parts */}
      {BOOK_PARTS.map((part) => {
        const c = PART_COLOR[part.color];
        return (
          <div key={part.id} id={part.id}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
              <h2 className="text-lg font-bold text-white">{part.label}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.tag}`}>
                {part.chapters.length}장
              </span>
            </div>

            <div className="space-y-2">
              {part.chapters.map((ch) => {
                const badge = STATUS_BADGE[ch.status];
                return (
                  <div
                    key={ch.num}
                    className={`flex flex-wrap items-start gap-4 rounded-xl border bg-slate-950/40 px-5 py-4 ${c.border}`}
                  >
                    {/* Chapter number */}
                    <div className="flex w-10 shrink-0 flex-col items-center">
                      <span className="font-mono text-sm font-bold text-slate-500">{ch.num}</span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-white">{ch.title}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">{ch.purpose}</p>
                    </div>

                    {/* Web link */}
                    {ch.webLink && (
                      <Link
                        href={ch.webLink.href}
                        className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                      >
                        {ch.webLink.label} →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-6 py-5">
        <h2 className="mb-4 text-sm font-bold text-white">장 성격 한눈에 보기</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_BADGE).map(([key, val]) => (
            <span key={key} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${val.cls}`}>
              {val.label}
            </span>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className="border-t border-slate-800 pt-4">
        <Link href="/reference" className="text-sm text-slate-400 hover:text-white">
          ← Reference 허브
        </Link>
      </div>
    </section>
  );
}
