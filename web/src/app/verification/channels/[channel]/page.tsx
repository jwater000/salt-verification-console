import Link from "next/link";
import { notFound } from "next/navigation";
import { loadMicroSnapshot, loadAllResults } from "@/lib/data";

type ChannelDef = {
  slug: string;
  title: string;
  fullTitle: string;
  heroColor: string;
  tagColor: string;
  what: string;
  why: string;
  baseline: string;
  saltMechanism: string;
  parameter: string;
  parameterDesc: string;
  falsification: string;
  datasets: Array<{ name: string; desc: string }>;
  statusNote: string;
  relatedImages: Array<{ src: string; caption: string }>;
  links: Array<{ href: string; label: string }>;
};

const CHANNEL_DATA: Record<string, ChannelDef> = {
  liv: {
    slug: "liv",
    title: "LIV",
    fullTitle: "Lorentz Invariance Violation",
    heroColor: "from-[#021825] to-slate-950",
    tagColor: "text-cyan-400",
    what: "빛의 속도가 에너지에 따라 달라지는가 — Lorentz 불변성 위반 검증",
    why: "SALT 공간 밀도 구조 ρ가 실재한다면, 고에너지 광자는 저에너지 광자와 다른 유효 경로 조건을 경험해야 한다. 결과적으로 먼 거리를 이동한 고에너지/저에너지 광자 쌍의 도달 시간 차이에서 에너지 의존 지연이 관측될 수 있다.",
    baseline: "Lorentz 불변 — 빛의 속도 c는 에너지 무관, 진공에서 모든 광자가 동일 경로를 이동",
    saltMechanism: "고밀도 경로를 지난 고에너지 광자가 저에너지 광자보다 더 큰 유효 매질 저항을 받아 미세하게 늦게 도달한다. ξ는 그 차이의 크기를 결정하는 자유 파라미터다.",
    parameter: "ξ",
    parameterDesc: "LIV 파라미터. ξ > 0 이면 SALT 예측 방향의 에너지 의존 지연. ξ ≤ 0 이면 해당 항 기각.",
    falsification: "ξ ≤ 0 (에너지 무관 도달, 또는 고에너지 광자가 오히려 빠른 경우) → SALT LIV 항 기각",
    datasets: [
      { name: "GRB 광자 시간 구조", desc: "수십억 광년 거리 감마선 폭발 이벤트에서 고/저에너지 광자의 도달 시간 차이" },
      { name: "IceCube 고에너지 중성미자", desc: "TeV~PeV 중성미자의 도달 타이밍 데이터" },
      { name: "Fermi-LAT GRB 데이터", desc: "현재 가장 강한 LIV 제한치를 제공하는 공개 데이터셋" },
    ],
    statusNote: "판정 규칙과 기각 조건이 사전에 고정됐다. 데이터 집계 및 비교 진행 중.",
    relatedImages: [
      { src: "/book-graphs/g31_lorentz_symmetry_invariant.jpg", caption: "Lorentz 대칭 불변 다이어그램" },
      { src: "/book-graphs/g04_graph_light_trajectory.jpg", caption: "빛 경로 그래프" },
    ],
    links: [
      { href: "/verification", label: "← 검증 채널 전체" },
      { href: "/audit/reproduce", label: "재현 방법 →" },
    ],
  },
  "gravity-delay": {
    slug: "gravity-delay",
    title: "강중력장 추가 지연",
    fullTitle: "Gravitational Path Delay Residual",
    heroColor: "from-[#020e20] to-slate-950",
    tagColor: "text-sky-400",
    what: "강중력장을 통과한 신호에 GR 기준선 이상의 시간 지연 잔차가 존재하는가",
    why: "SALT에서 ρ가 실재하면 강중력장(블랙홀 근방, 강한 렌즈 경로)은 밀도가 극대화된 구간이다. 이 구간을 지난 신호에는 GR의 Shapiro 지연 예측값 외에 추가 잔차 Δτ_SALT가 남아야 한다.",
    baseline: "Shapiro 지연 — 일반 상대론이 예측하는 중력 시간 지연. LIGO/Virgo 파형 정합에서 검증된 수준.",
    saltMechanism: "강중력장을 통과하는 신호가 GR 예측 위에 추가적인 경로 지연을 받는다. 지연량은 통과한 경로의 ρ 적분에 비례한다.",
    parameter: "Δτ_SALT",
    parameterDesc: "GR Shapiro 지연을 뺀 잔차 지연값. Δτ_SALT > 0 이면 추가 지연 확인. ≤ 0 이면 해당 항 기각.",
    falsification: "SALT 오차 ≥ GR 기준 오차 (잔차가 없거나 오히려 나빠지는 경우) → 추가 지연 기각",
    datasets: [
      { name: "LIGO/Virgo GW 이벤트", desc: "강중력장 통과 경로가 포함된 병합 이벤트들의 도달 시간 데이터" },
      { name: "중력렌즈 시간 지연 관측", desc: "쿼사/초신성 렌즈 이미지 간 도달 시간 차이 데이터" },
      { name: "Cassini 추적 데이터", desc: "태양 근방 Shapiro 지연의 정밀 측정 — 기준선 보정에 사용" },
    ],
    statusNote: "판정 규칙 고정. frozen 데이터셋 기준 비교 진행 중.",
    relatedImages: [
      { src: "/book-graphs/g20_gravity_flow_field.jpg", caption: "중력 흐름 장" },
      { src: "/book-graphs/g11_time_dilation_heatmap.jpg", caption: "시간 지연 히트맵" },
      { src: "/book-graphs/g08_gravity_wave_chirp.jpg", caption: "중력파 Chirp 패턴" },
    ],
    links: [
      { href: "/verification", label: "← 검증 채널 전체" },
      { href: "/audit/reproduce", label: "재현 방법 →" },
    ],
  },
  "hf-gw": {
    slug: "hf-gw",
    title: "초고주파 GW 꼬리",
    fullTitle: "High-Frequency Gravitational Wave Tail",
    heroColor: "from-[#0f0820] to-slate-950",
    tagColor: "text-violet-400",
    what: "블랙홀 병합 이후 ringdown 구간에 GR 수치 상대론 예측 외 고주파 잔차 구조가 존재하는가",
    why: "SALT에서 병합 사건은 극대 밀도 구간의 급격한 변화다. 이 변화 후 공간 매질의 복원 과정이 GR 예측의 ringdown 외에 짧고 높은 주파수의 꼬리 신호를 남길 수 있다.",
    baseline: "GR 수치 상대론 — 블랙홀 병합 후 quasi-normal mode ringdown. LIGO/Virgo 파형 템플릿으로 검증된 수준.",
    saltMechanism: "병합 후 공간 매질 복원 과정(SALT 매질의 탄성 스냅백)이 ringdown 이후 추가적인 고주파 꼬리를 만든다. 꼬리의 주파수 범위는 L(특성 길이)로 스케일된다.",
    parameter: "f_tail",
    parameterDesc: "초고주파 잔차 강도 지표. GR 템플릿 차감 후 고주파 구간에 남는 체계적 잔차의 세기.",
    falsification: "고주파 꼬리 구조 부재(f_tail ≈ 0) 또는 잔차가 노이즈 수준과 구분되지 않는 경우 → SALT 매질 복원 항 기각",
    datasets: [
      { name: "LIGO O1/O2/O3 병합 이벤트", desc: "GW150914 등 검출 이벤트의 ringdown 구간 고주파 분석" },
      { name: "GWTC 카탈로그", desc: "공개 GW 트랜지언트 카탈로그 — frozen 버전 사용" },
      { name: "noise PSD 기준선", desc: "detector noise power spectral density — 고주파 잔차 구분의 기준선" },
    ],
    statusNote: "판정 규칙 고정. 고주파 잔차 정량화 분석 진행 중.",
    relatedImages: [
      { src: "/book-graphs/g08_gravity_wave_chirp.jpg", caption: "중력파 Chirp 패턴" },
      { src: "/book-graphs/g19_graph_combined_complex_views.jpg", caption: "복합 관측 조합" },
    ],
    links: [
      { href: "/verification", label: "← 검증 채널 전체" },
      { href: "/audit/reproduce", label: "재현 방법 →" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CHANNEL_DATA).map((slug) => ({ channel: slug }));
}

export default async function ChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const def = CHANNEL_DATA[channel];
  if (!def) notFound();

  const [micro, allResults] = await Promise.all([
    loadMicroSnapshot(),
    loadAllResults(),
  ]);

  // Pull any relevant micro fit runs for context
  const relevantRuns = micro.fit_runs.slice(0, 3);

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br ${def.heroColor} px-8 py-10`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${def.tagColor}`}>
          고정 검증 채널 · Verification
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {def.title}
          </h1>
          <span className="badge-verified">판정 규칙 고정</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{def.fullTitle}</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{def.what}</p>
      </div>

      {/* Why this channel */}
      <div className="panel px-6 py-6">
        <h2 className="mb-3 text-sm font-bold text-white">왜 이 채널이 SALT를 시험하는가</h2>
        <p className="text-sm leading-relaxed text-slate-300">{def.why}</p>
      </div>

      {/* 4-field spec */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">기준 모델</p>
          <p className="text-sm leading-relaxed text-slate-200">{def.baseline}</p>
        </div>
        <div className="rounded-xl border border-cyan-500/15 bg-slate-950/40 p-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">SALT 메커니즘</p>
          <p className="text-sm leading-relaxed text-slate-200">{def.saltMechanism}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">자유 파라미터</p>
          <code className="text-base font-bold text-cyan-300">{def.parameter}</code>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{def.parameterDesc}</p>
        </div>
        <div className="rounded-xl border border-rose-500/15 bg-rose-950/10 p-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">기각 조건</p>
          <p className="text-sm leading-relaxed text-rose-200/90">{def.falsification}</p>
        </div>
      </div>

      {/* Datasets */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          핵심 데이터셋
        </h2>
        <div className="space-y-2">
          {def.datasets.map((ds) => (
            <div
              key={ds.name}
              className="flex gap-4 rounded-lg border border-slate-800 bg-slate-950/40 px-5 py-3"
            >
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
              <div>
                <p className="text-sm font-semibold text-slate-200">{ds.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">{ds.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="rounded-lg border border-amber-500/15 bg-amber-950/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="badge-pending">현재 상태</span>
          <p className="text-sm text-amber-100/80">{def.statusNote}</p>
        </div>
      </div>

      {/* Related visuals */}
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

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        {def.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
