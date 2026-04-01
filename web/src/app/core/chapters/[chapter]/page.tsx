import Link from "next/link";
import { notFound } from "next/navigation";

type Section = { heading: string; body: string };
type KeyConcept = { symbol?: string; term: string; body: string };

type ChapterDef = {
  num: string;
  title: string;
  oneLiner: string;
  heroGradient: string;
  accentColor: string;
  status: string;
  statusBadge: string;
  keyQuestions: string[];
  keyConcepts: KeyConcept[];
  sections: Section[];
  takeaways: string[];
  relatedImages: Array<{ src: string; caption: string }>;
  nextLinks: Array<{ href: string; label: string; desc: string }>;
};

const CHAPTERS: Record<string, ChapterDef> = {
  "17": {
    num: "17",
    title: "이론의 토대",
    oneLiner: "ρ, θ, L로 기술되는 공간 구조 — 표준 이론과 어디서 갈라지는가",
    heroGradient: "from-[#0a0520] to-slate-950",
    accentColor: "violet",
    status: "이론 핵심",
    statusBadge: "badge-interpret",
    keyQuestions: [
      "공간이 왜 비어 있지 않은가",
      "상태변수 세 개(ρ, θ, L)는 어떻게 정의되는가",
      "저에너지 극한에서 GR과 어떻게 정합되는가",
      "표준 모형과 어디서 예측이 갈라지기 시작하는가",
    ],
    keyConcepts: [
      {
        symbol: "ρ",
        term: "공간 밀도",
        body: "공간의 국소 에너지 밀도. ρ > 0인 곳에서는 신호가 단순 c로 전파되지 않는다. SALT의 모든 예측 차이는 ρ가 실재한다는 가정에서 시작된다.",
      },
      {
        symbol: "θ",
        term: "장력각",
        body: "밀도 경계의 방향성. 중력렌즈 잔차와 편광 방향 오프셋이 θ의 관측 흔적이다.",
      },
      {
        symbol: "L",
        term: "특성 길이",
        body: "구조 전환의 공간 스케일. HF-GW 꼬리 주파수와 고에너지 잔차 구조의 스케일을 결정한다.",
      },
      {
        symbol: "c_eff",
        term: "유효 광속",
        body: "ρ 구조 안에서의 유효 빛 전파 속도. c_eff(ρ) = c / n(ρ). 저밀도(ρ→0)에서 c_eff → c 로 복귀하여 GR 정합을 보장한다.",
      },
    ],
    sections: [
      {
        heading: "빈 공간 가정의 문제",
        body: "표준 이론은 진공을 기본 상태(ρ=0)로 정의한다. 그러나 Casimir 효과, 암흑 에너지, 양자 진공 요동은 빈 공간이 실제로 에너지를 가짐을 시사한다. SALT는 이 에너지를 구조화된 밀도 장 ρ로 기술한다.",
      },
      {
        heading: "저에너지 GR 정합",
        body: "ρ → 0 극한에서 SALT의 모든 식은 GR 및 표준 모형의 결과로 수렴한다. 즉 SALT는 GR을 부정하는 것이 아니라, GR이 적합한 근사이기 위한 조건(ρ≈0)을 명시한다.",
      },
      {
        heading: "표준 모형과의 갈라짐",
        body: "예측 차이가 나타나는 구간은 ρ가 유의하게 크거나 L 스케일에서 구조 전환이 일어나는 곳이다. 강중력장 근방, 병합 이벤트 직후, 초고에너지 채널이 이에 해당한다.",
      },
      {
        heading: "미완성 영역",
        body: "17장은 비상대론 코어를 제시한다. 스핀 1/2 구조, 카이랄리티, 디랙 방정식의 완전 유도는 18장이 설계한 확장 조건에서 후속 과제로 남아 있다.",
      },
    ],
    takeaways: [
      "공간은 에너지 구조(ρ)를 가진다",
      "저에너지에서 GR로 복귀한다 — GR을 대체하는 게 아니라 포함한다",
      "예측 차이는 ρ가 큰 구간에서만 유의하게 나타난다",
      "완전 유도는 미완성 — 이것이 18장 검증의 동기다",
    ],
    relatedImages: [
      { src: "/book-graphs/g17_mass_energy_flow.jpg", caption: "질량-에너지 흐름" },
      { src: "/book-graphs/g00_force_to_mass_hierarchy.jpg", caption: "힘 → 질량 계층" },
      { src: "/book-graphs/g16_dual_integral_axes.jpg", caption: "이중 적분 축" },
    ],
    nextLinks: [
      { href: "/core/chapters/18", label: "18장 →", desc: "이론을 어떻게 시험하는가" },
      { href: "/verification", label: "Verification →", desc: "실제 검증 채널 판정" },
    ],
  },
  "18": {
    num: "18",
    title: "검증 채널과 판정",
    oneLiner: "3개 고정 채널 — 무엇으로 SALT를 시험하고 어떤 기준으로 기각하는가",
    heroGradient: "from-[#021825] to-slate-950",
    accentColor: "cyan",
    status: "검증 대상",
    statusBadge: "badge-verified",
    keyQuestions: [
      "SALT를 시험하는 고정된 채널은 몇 개인가",
      "직접 관측과 간접 흔적 비교는 어떻게 다른가",
      "판정 규칙은 어떻게 데이터 보기 전에 잠기는가",
      "후보 가설과 고정 채널의 차이는 무엇인가",
    ],
    keyConcepts: [
      {
        term: "고정 검증 채널",
        body: "데이터를 보기 전에 관측량, 비교식, 기각 조건이 모두 잠긴 채널. 현재 3개 — LIV, 강중력장 추가 지연, HF-GW 꼬리.",
      },
      {
        symbol: "ξ",
        term: "LIV 파라미터",
        body: "에너지 의존 광속 차이의 크기. ξ ≤ 0 이면 LIV 항 기각.",
      },
      {
        symbol: "Δτ_SALT",
        term: "추가 지연 잔차",
        body: "GR Shapiro 지연을 넘는 잔차 지연. ≤ 0 이면 추가 지연 기각.",
      },
      {
        symbol: "f_tail",
        term: "HF-GW 꼬리 강도",
        body: "ringdown 이후 고주파 잔차 세기. 노이즈 수준과 구분되지 않으면 매질 복원 항 기각.",
      },
    ],
    sections: [
      {
        heading: "직접 관측이 아닌 간접 흔적 비교",
        body: "SALT는 공간 밀도 구조 내부를 직접 촬영하는 실험을 요구하지 않는다. 대신 밀도 구조를 지난 신호가 경계에서 남기는 시간 지연, 적색편이, 고주파 잔차를 정량 비교한다.",
      },
      {
        heading: "판정 규칙의 사전 잠금 원칙",
        body: "이 채널은 데이터를 먼저 보고 채점 기준을 바꾸지 않는다는 원칙 아래 정리된다. 관측량 정의 → 비교식 고정 → 기각 조건 명시 → frozen 데이터 적용 순서를 기준으로 삼는다.",
      },
      {
        heading: "후보 가설 묶음",
        body: "중성미자 질량, 암흑 물질, 허블 긴장, 중력-강력 연결, 세대 문제. 이 항목들은 형식화는 됐으나 판정 규칙이 아직 잠기지 않았다. 고정 채널과 혼동해서는 안 된다.",
      },
      {
        heading: "26장 프로토콜과의 연결",
        body: "18장이 설계한 채널은 26장의 ADM 감사 프로토콜에 의해 독립 자유도와 ghost 제거가 검증된다. 채널 설계와 수학적 타당성 확인이 분리된 이유다.",
      },
    ],
    takeaways: [
      "고정 채널 3개 — LIV · 강중력장 지연 · HF-GW 꼬리",
      "간접 흔적 정량 비교 — 내부를 직접 보는 게 아니다",
      "판정 규칙은 데이터 보기 전에 잠긴다",
      "후보 가설 5개는 검증 대기 상태 — 고정 채널과 다르다",
    ],
    relatedImages: [
      { src: "/book-graphs/g18_relativistic_series_ladder.jpg", caption: "상대론 급수 사다리" },
      { src: "/book-graphs/g11_time_dilation_heatmap.jpg", caption: "시간 지연 히트맵" },
      { src: "/book-graphs/g08_gravity_wave_chirp.jpg", caption: "중력파 Chirp 패턴" },
    ],
    nextLinks: [
      { href: "/verification", label: "Verification →", desc: "실제 채널 판정 및 데이터" },
      { href: "/core/chapters/19", label: "19장 →", desc: "검증 결과가 기술에 어떻게 연결되는가" },
    ],
  },
  "19": {
    num: "19",
    title: "공학적 함의",
    oneLiner: "기존 기술에 대한 SALT 해석과 장기 공학 가설을 구분해 정리한다",
    heroGradient: "from-[#031a0f] to-slate-950",
    accentColor: "emerald",
    status: "공학 가설",
    statusBadge: "badge-speculative",
    keyQuestions: [
      "SALT가 기존 기술을 어떻게 다르게 읽는가",
      "어느 분야가 해석 재정렬이고 어느 분야가 장기 가설인가",
      "19장은 검증된 결과를 담고 있는가",
      "공학 가설과 18장 검증 채널은 어떻게 다른가",
    ],
    keyConcepts: [
      {
        term: "해석 재정렬",
        body: "기존 기술의 공식이나 실험 결과는 그대로 두고, 그 물리적 의미를 SALT 언어로 다시 읽는 단계. GPS 보정의 Shapiro 지연을 ρ 경로 의존 지연으로 재해석하는 것이 예시다.",
      },
      {
        term: "설계 가설",
        body: "해석 재정렬에서 나온 직관이 새로운 설계 방향을 제안하는 단계. 절연막 설계, 큐비트 제어 전략 등. 아직 검증 경로가 명시되지 않은 영역이다.",
      },
      {
        term: "장기 예측",
        body: "SALT 해석이 맞다면 열릴 수 있는 기술 방향. 현재 실현 가능 여부와 무관하게 정합적으로 도출되는 추론이다. 검증 경로 미확정.",
      },
    ],
    sections: [
      {
        heading: "19장은 결과 보고가 아니다",
        body: "18장의 검증 채널과 달리, 19장은 SALT 해석이 참일 경우 기술이 어떻게 다르게 보이는가를 탐색한다. 공학 응용 전체가 이미 검증된 것으로 읽으면 안 된다.",
      },
      {
        heading: "5대 분야 재해석",
        body: "중력(GPS·렌즈·궤도), 전자기·반도체(밴드갭·터널링·메모리), 강력·핵반응(매질 스냅백 가설), 약력·중성미자(세대 구조 재해석), 양자·홀로그래피(디코히런스·위상 제어).",
      },
      {
        heading: "현재 기술과 SALT의 교차점",
        body: "GPS 보정, 플래시 메모리, 원자로, 양자 컴퓨터 — 이것들은 이미 작동 중인 기술이다. SALT는 이 기술들이 '왜 작동하는가'를 다른 언어로 설명하려 한다. 기술 자체를 대체하지 않는다.",
      },
      {
        heading: "18장 검증과의 관계",
        body: "19장의 공학 가설이 장기적으로 유효하려면 18장의 검증 채널이 먼저 통과해야 한다. 즉 19장은 18장 위에 쌓이는 구조다.",
      },
    ],
    takeaways: [
      "19장은 검증 완료 결과가 아니라 해석 재정렬 + 설계 가설이다",
      "5대 분야 — 중력 / 전자기·반도체 / 강력 / 약력 / 양자·홀로그래피",
      "성숙도: 해석 재정렬 > 설계 가설 > 장기 예측 순으로 구분된다",
      "19장의 유효성은 18장 검증 채널 통과에 의존한다",
    ],
    relatedImages: [
      { src: "/book-graphs/g26_unified_phase_portrait.jpg", caption: "통합 위상 초상" },
      { src: "/book-graphs/g25_faq_claim_matrix.jpg", caption: "FAQ 주장 매트릭스" },
      { src: "/book-graphs/g15_running_couplings.jpg", caption: "달리는 결합 상수" },
    ],
    nextLinks: [
      { href: "/engineering", label: "Engineering →", desc: "분야별 재해석 상세" },
      { href: "/verification", label: "Verification →", desc: "18장 검증 채널 — 19장의 토대" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CHAPTERS).map((c) => ({ chapter: c }));
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const def = CHAPTERS[chapter];
  if (!def) notFound();

  const accentDot: Record<string, string> = {
    violet: "bg-violet-400",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
  };
  const accentText: Record<string, string> = {
    violet: "text-violet-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
  };
  const accentBorder: Record<string, string> = {
    violet: "border-violet-500/20",
    cyan: "border-cyan-500/20",
    emerald: "border-emerald-500/20",
  };

  return (
    <section className="space-y-8">
      {/* Chapter hero */}
      <div className={`relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br ${def.heroGradient} px-8 py-10`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${accentText[def.accentColor]}`}>
            {def.num}장 · Core Ideas
          </span>
          <span className={def.statusBadge}>{def.status}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          {def.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">{def.oneLiner}</p>
      </div>

      {/* Key questions */}
      <div className={`rounded-xl border bg-slate-950/50 p-6 ${accentBorder[def.accentColor]}`}>
        <h2 className="mb-4 text-sm font-bold text-white">이 장이 묻는 핵심 질문</h2>
        <ul className="space-y-2">
          {def.keyQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${accentDot[def.accentColor]}`} />
              <p className="text-sm text-slate-300">{q}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Key concepts */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          핵심 개념
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {def.keyConcepts.map((c) => (
            <div key={c.term} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-white">{c.term}</p>
                {c.symbol && (
                  <code className={`shrink-0 rounded px-2 py-0.5 text-base font-bold ${
                    def.accentColor === "violet"
                      ? "bg-violet-950/50 text-violet-200"
                      : def.accentColor === "cyan"
                      ? "bg-cyan-950/50 text-cyan-200"
                      : "bg-emerald-950/50 text-emerald-200"
                  }`}>
                    {c.symbol}
                  </code>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {def.sections.map((s) => (
          <div key={s.heading} className="rounded-xl border border-slate-800 bg-slate-900/30 px-6 py-5">
            <h3 className="mb-2 text-sm font-bold text-slate-100">{s.heading}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Takeaways */}
      <div className="panel px-6 py-6">
        <h2 className="mb-4 text-sm font-bold text-white">이 장에서 가져가야 할 것</h2>
        <ul className="space-y-2">
          {def.takeaways.map((t, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 font-mono text-xs text-slate-500">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm text-slate-200">{t}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Related images */}
      {def.relatedImages.length > 0 && (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            관련 도해
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {def.relatedImages.map((img) => (
              <Link
                key={img.src}
                href="/reference/visual-atlas"
                className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-950 transition hover:border-slate-600"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.caption}
                  className="aspect-video w-full object-cover opacity-80 transition group-hover:opacity-100"
                />
                <p className="px-3 py-2 text-xs font-medium text-slate-300">{img.caption}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Chapter navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
        <Link href="/core" className="text-sm text-slate-400 hover:text-white">
          ← Core Ideas 전체
        </Link>
        <div className="flex flex-wrap gap-3">
          {def.nextLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group rounded-lg border px-4 py-2 transition ${accentBorder[def.accentColor]} hover:bg-slate-900/60`}
            >
              <p className={`text-xs font-semibold ${accentText[def.accentColor]}`}>{l.label}</p>
              <p className="text-xs text-slate-500">{l.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
