import Link from "next/link";
import CommentsPanel from "@/components/comments-panel";

type MaturityLevel = "interpretive" | "speculative" | "long-term";

const DOMAINS = [
  {
    slug: "gravity",
    title: "중력 기술",
    icon: "G",
    color: "cyan",
    conventional: "Shapiro 지연 + GR 수치 상대론으로 GPS · 중력렌즈 · 궤도 계산",
    salt: "ρ 밀도 구조가 만드는 경로 의존 지연 — GR 기준선 외 잔차의 물리적 기원",
    implications: [
      "GPS 보정의 SALT 재독해 — 측정 정밀도 한계 설명",
      "중력렌즈 시간 지연 잔차 구조 예측",
      "자유낙하 / 궤도 계산 보완 해석",
    ],
    maturity: "interpretive" as MaturityLevel,
  },
  {
    slug: "electromagnetism",
    title: "전자기 · 반도체",
    icon: "E",
    color: "sky",
    conventional: "밴드 구조, 터널링, 플래시/DRAM/HBM 설계 — 표준 고체물리",
    salt: "전자 이동 = 보셀 매질 위의 매듭 형성-해제-재등록. 밴드갭 = 공명 조건",
    implications: [
      "누설 억제 재료 · 절연막 설계 직관",
      "HBM 적층 구조의 내부 상태 중첩 해석",
      "리프레시 주기를 동적 상태 유지 비용으로 재독해",
    ],
    maturity: "interpretive" as MaturityLevel,
  },
  {
    slug: "strong-force",
    title: "강력 · 핵반응",
    icon: "S",
    color: "emerald",
    conventional: "핵분열/핵융합 = 질량 결손 에너지 방출, QCD 결합 상수",
    salt: "핵반응 순간의 밀도 급변 → 매질 복원 탄성 스냅백 → 초고주파 신호 가능성",
    implications: [
      "원자력 시설 인근 MHz~GHz 공명 센서 시나리오",
      "가속기 충돌 순간의 고속 타이밍 잔차",
      "핵밀도 구간 강력 결합 상수 보정 가설",
    ],
    maturity: "speculative" as MaturityLevel,
  },
  {
    slug: "weak-force",
    title: "약력 · 중성미자",
    icon: "W",
    color: "violet",
    conventional: "세대별 중성미자 진동, 질량 계층, 표준 약력 결합",
    salt: "세대 구조 = SALT 상태 전환 에너지 계층과 대응 가설",
    implications: [
      "중성미자 질량 격차의 SALT 재해석",
      "세대 문제(왜 3세대인가)의 상태 고착 계층 모형",
    ],
    maturity: "speculative" as MaturityLevel,
  },
  {
    slug: "quantum-holography",
    title: "양자 · 홀로그래피",
    icon: "Q",
    color: "amber",
    conventional: "큐비트 = 중첩 + 얽힘. 홀로그래피 = 경계 정보로 내부 복원",
    salt: "큐비트 = 확정 전 진동 상태. 홀로그래피 = 상태장에서 입체 구조 복원",
    implications: [
      "디코히런스 = 원치 않는 외부 상태 확정 → 격리 설계 직관",
      "게이트 제어 = 위상 편향 조작 → 펄스 설계 정교화",
      "차세대 공간 디스플레이의 상태장 복원 유비",
    ],
    maturity: "long-term" as MaturityLevel,
  },
] as const;

const MATURITY_CONFIG: Record<MaturityLevel, { label: string; badgeClass: string; desc: string }> = {
  interpretive: {
    label: "기술 재해석",
    badgeClass: "badge-interpret",
    desc: "기존 기술을 SALT 언어로 다시 읽는 단계",
  },
  speculative: {
    label: "설계 가설",
    badgeClass: "badge-pending",
    desc: "형식화는 됐으나 검증 경로가 아직 명시되지 않은 단계",
  },
  "long-term": {
    label: "장기 예측",
    badgeClass: "badge-speculative",
    desc: "검증 경로 미확정 — 장기적 공학 상상",
  },
};

const COLOR_MAP: Record<string, { border: string; iconBg: string; iconText: string }> = {
  cyan:   { border: "border-cyan-500/20",   iconBg: "bg-cyan-500/15",   iconText: "text-cyan-300" },
  sky:    { border: "border-sky-500/20",    iconBg: "bg-sky-500/15",    iconText: "text-sky-300" },
  emerald:{ border: "border-emerald-500/20",iconBg: "bg-emerald-500/15",iconText: "text-emerald-300" },
  violet: { border: "border-violet-500/20", iconBg: "bg-violet-500/15", iconText: "text-violet-300" },
  amber:  { border: "border-amber-500/20",  iconBg: "bg-amber-500/15",  iconText: "text-amber-300" },
};

const CUSTOMER_USE_CASES = [
  {
    title: "기술 브리핑",
    body: "기존 기술을 SALT 언어로 읽을 때 어떤 해석 차이가 생기는지 정리한다.",
    href: "/reference/faq",
    cta: "FAQ로 연결",
  },
  {
    title: "검증 근거 연결",
    body: "공학적 해석을 검증 자료와 함께 볼 수 있도록 18장 관련 페이지로 연결한다.",
    href: "/verification",
    cta: "Verification 보기",
  },
  {
    title: "감사 자료 확인",
    body: "관련 산출물의 provenance와 재현 경로를 함께 확인할 수 있게 연결한다.",
    href: "/audit",
    cta: "Audit 보기",
  },
] as const;

const PAGE_BOUNDARIES = [
  "이 페이지는 제품 제안서가 아니라 기술적 해석과 가설의 범위를 정리한 참고 페이지다",
  "여기서 다루는 함의는 Verification의 집계 결과와 구분해 읽어야 한다",
  "성숙도 라벨은 현재 검증 수준을 가리키며 실현 가능성의 확정을 뜻하지 않는다",
];

export default function EngineeringPage() {
  return (
    <section className="space-y-10">
      {/* Chapter hero */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#031a0f] to-slate-950 px-8 py-10">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          19장 · Engineering
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT를 기술의 언어로 다시 읽으면
          <br />
          어떤 상상이 열리는가
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          어떤 이론은 설명에서 멈추고, 어떤 이론은 기술적 상상력을 자극한다. SALT는 후자에 가깝다.
          중력, 반도체, 핵반응, 중성미자, 양자 제어를 다시 바라보게 만들며
          &quot;이미 있는 기술을 다르게 이해하는 길&quot;과 &quot;아직 먼 가설&quot;을 동시에 펼쳐 보인다.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-2 text-xs text-amber-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          이곳의 핵심은 구현 주장보다 해석의 방향과 가설의 성숙도 구분이다
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">1. 익숙한 기술을 낯설게 보기</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            이미 존재하는 기술과 실험을 SALT 언어로 다시 읽을 때 어떤 의미 변화가 생기는지 본다.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">2. 어디까지가 해석이고 어디부터가 가설인가</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            기술 재해석과 설계 가설, 장기 예측을 한데 섞지 않도록 성숙도 라벨을 함께 본다.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">3. 무엇이 이미 근거를 가지고 있는가</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            이 해석이 기대는 비교 근거는 내용 검증에서 다시 확인하고, 여기서는 아이디어의 방향과 범위를 본다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {CUSTOMER_USE_CASES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-emerald-500/20 bg-slate-950/45 p-5 transition hover:border-emerald-400/40"
          >
          <h2 className="text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
            <p className="mt-5 text-sm font-semibold text-emerald-300">{item.cta} →</p>
          </Link>
        ))}
      </div>

      <div className="panel px-6 py-5">
        <h2 className="mb-4 text-sm font-semibold text-white">읽으면서 기억하면 좋은 기준</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PAGE_BOUNDARIES.map((item) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-sm leading-relaxed text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain grid */}
      <div className="space-y-4">
        {DOMAINS.map((domain) => {
          const m = MATURITY_CONFIG[domain.maturity];
          const c = COLOR_MAP[domain.color];
          return (
            <div key={domain.slug} className={`rounded-xl border bg-slate-950/50 p-6 ${c.border}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold ${c.iconBg} ${c.iconText}`}>
                    {domain.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{domain.title}</h3>
                  </div>
                </div>
                <span className={m.badgeClass}>{m.label}</span>
              </div>

              {/* Comparison table */}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    기존 해석
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300">{domain.conventional}</p>
                </div>
                <div className={`rounded-lg border p-4 ${c.border} bg-slate-950/60`}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    SALT 해석
                  </p>
                  <p className="text-sm leading-relaxed text-slate-200">{domain.salt}</p>
                </div>
              </div>

              {/* Implications */}
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  공학적 함의
                </p>
                <ul className="space-y-1.5">
                  {domain.implications.map((imp) => (
                    <li key={imp} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${c.iconBg.replace("bg-", "bg-").replace("/15", "")}`} />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/35 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  참고 메모
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {domain.maturity === "interpretive"
                    ? "현재 기술과 실험을 다른 물리 언어로 읽어 보는 참고 해석에 가깝다."
                    : domain.maturity === "speculative"
                      ? "추가 검증 채널이 마련되면 설계 가설로 이어질 수 있으나, 현재는 탐색 단계다."
                      : "장기적 연구 주제로는 참고할 수 있으나, 직접적인 구현 주장으로 읽기에는 이르다."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maturity legend */}
      <div className="panel px-6 py-5">
        <h2 className="mb-4 text-sm font-bold text-white">공학 함의의 성숙도 구분</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.entries(MATURITY_CONFIG) as [MaturityLevel, typeof MATURITY_CONFIG[MaturityLevel]][]).map(
            ([key, val]) => (
              <div key={key} className="flex items-start gap-3">
                <span className={val.badgeClass}>{val.label}</span>
                <p className="text-xs text-slate-500">{val.desc}</p>
              </div>
            )
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          검증 근거는{" "}
          <Link href="/verification" className="text-cyan-400 hover:underline">
            Verification →
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5">
        <Link
          href="/verification"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/40"
        >
          18장 검증 채널 보기 →
        </Link>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:border-amber-400/40"
        >
          Audit 허브 →
        </Link>
      </div>

      <CommentsPanel
        pagePath="/engineering"
        description="기술적 해석과 장기 가설을 읽는 과정에서 설명 보강이 필요한 부분을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
