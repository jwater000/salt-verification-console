import Link from "next/link";

type ThemeGroup = {
  id: string;
  title: string;
  desc: string;
  color: string;
  images: Array<{ id: string; src: string; caption: string; chapterRef: string }>;
};

const THEME_GROUPS: ThemeGroup[] = [
  {
    id: "problem",
    title: "문제 제기",
    desc: "힘·스케일·경로 감각 — 기존 물리의 위기 진단",
    color: "rose",
    images: [
      { id: "g00", src: "/book-graphs/g00_force_to_mass_hierarchy.jpg", caption: "힘 → 질량 계층 구조", chapterRef: "Ch.00" },
      { id: "g01", src: "/book-graphs/g01_finite_vs_infinite_lattice.jpg", caption: "유한 vs 무한 격자", chapterRef: "Ch.01" },
      { id: "g02", src: "/book-graphs/g02_scale_bridge_zoom.jpg", caption: "스케일 연결 줌", chapterRef: "Ch.02" },
      { id: "g03", src: "/book-graphs/g03_force_vs_geodesic.jpg", caption: "힘 vs 측지선", chapterRef: "Ch.03" },
      { id: "g04", src: "/book-graphs/g04_graph_light_trajectory.jpg", caption: "빛 경로 그래프", chapterRef: "Ch.04" },
      { id: "g05", src: "/book-graphs/g05_mass_budget_stack.jpg", caption: "질량 예산 스택", chapterRef: "Ch.05" },
    ],
  },
  {
    id: "concept",
    title: "개념 전환",
    desc: "관측 실마리 → 공리로의 전환 — 시간·밀도·양자 해석",
    color: "sky",
    images: [
      { id: "g06", src: "/book-graphs/g06_internal_state_panels.jpg", caption: "내부 상태 패널", chapterRef: "Ch.06" },
      { id: "g07", src: "/book-graphs/g07_knot_phase_landscape.jpg", caption: "매듭 위상 경관", chapterRef: "Ch.07" },
      { id: "g08", src: "/book-graphs/g08_gravity_wave_chirp.jpg", caption: "중력파 Chirp 패턴", chapterRef: "Ch.08" },
      { id: "g09", src: "/book-graphs/g09_local_bigbang_region.jpg", caption: "국소 빅뱅 영역", chapterRef: "Ch.09" },
      { id: "g10", src: "/book-graphs/g10_inflation_to_cmb.jpg", caption: "인플레이션 → CMB", chapterRef: "Ch.10" },
      { id: "g11", src: "/book-graphs/g11_time_dilation_heatmap.jpg", caption: "시간 지연 히트맵", chapterRef: "Ch.11" },
    ],
  },
  {
    id: "unified",
    title: "통합 구조",
    desc: "통합 지도 + 모드별 흐름 + 이론 고리",
    color: "violet",
    images: [
      { id: "g12", src: "/book-graphs/g12_wavepacket_measurement.jpg", caption: "파동묶음 측정", chapterRef: "Ch.12" },
      { id: "g13", src: "/book-graphs/g13_bell_chsh_comparison.jpg", caption: "Bell-CHSH 비교", chapterRef: "Ch.13" },
      { id: "g14", src: "/book-graphs/g14_entanglement_shared_memory.jpg", caption: "얽힘 공유 메모리", chapterRef: "Ch.14" },
      { id: "g15", src: "/book-graphs/g15_running_couplings.jpg", caption: "달리는 결합 상수", chapterRef: "Ch.15" },
      { id: "g16", src: "/book-graphs/g16_dual_integral_axes.jpg", caption: "이중 적분 축", chapterRef: "Ch.16" },
      { id: "g17", src: "/book-graphs/g17_mass_energy_flow.jpg", caption: "질량-에너지 흐름", chapterRef: "Ch.17" },
    ],
  },
  {
    id: "verification",
    title: "검증 채널",
    desc: "예측 · LIV · 중력 지연 · HF-GW 꼬리 — 18장 관련",
    color: "cyan",
    images: [
      { id: "g18", src: "/book-graphs/g18_relativistic_series_ladder.jpg", caption: "상대론 급수 사다리", chapterRef: "Ch.18" },
      { id: "g19", src: "/book-graphs/g19_graph_combined_complex_views.jpg", caption: "복합 관측 조합", chapterRef: "Ch.18" },
      { id: "g20", src: "/book-graphs/g20_gravity_flow_field.jpg", caption: "중력 흐름 장", chapterRef: "Ch.18" },
      { id: "g21", src: "/book-graphs/g21_graph_xyz_axis_magnifier_light.jpg", caption: "3축 확대 광로", chapterRef: "Ch.18" },
      { id: "g22", src: "/book-graphs/g22_quark_confinement_potential.jpg", caption: "쿼크 가둠 포텐셜", chapterRef: "Ch.18" },
      { id: "g23", src: "/book-graphs/g23_decay_branching_tree.jpg", caption: "붕괴 분기 트리", chapterRef: "Ch.18" },
      { id: "g24", src: "/book-graphs/g24_prediction_sensitivity_map.jpg", caption: "예측 민감도 지도", chapterRef: "Ch.18" },
    ],
  },
  {
    id: "engineering",
    title: "공학 함의 · FAQ",
    desc: "19장 기술 재해석, 통합 초상, FAQ 매트릭스",
    color: "emerald",
    images: [
      { id: "g25", src: "/book-graphs/g25_faq_claim_matrix.jpg", caption: "FAQ 질문 매트릭스", chapterRef: "Ch.19" },
      { id: "g26", src: "/book-graphs/g26_unified_phase_portrait.jpg", caption: "통합 위상 초상", chapterRef: "Ch.19" },
      { id: "g27", src: "/book-graphs/g27_glossary_relation_map.jpg", caption: "용어 관계 지도", chapterRef: "Ch.21" },
      { id: "g28", src: "/book-graphs/g28_noether_symmetry_bridge.jpg", caption: "뇌터 대칭 다리", chapterRef: "Ch.22" },
    ],
  },
  {
    id: "audit",
    title: "감사 · 프로토콜",
    desc: "보존, 운동량, Lorentz 불변, 이론 비교, 감사 흐름",
    color: "amber",
    images: [
      { id: "g29", src: "/book-graphs/g29_local_conservation_flux.jpg", caption: "국소 보존 플럭스", chapterRef: "Ch.26" },
      { id: "g30", src: "/book-graphs/g30_pythagorean_energy_momentum.jpg", caption: "에너지-운동량 피타고라스", chapterRef: "Ch.26" },
      { id: "g31", src: "/book-graphs/g31_lorentz_symmetry_invariant.jpg", caption: "Lorentz 대칭 불변", chapterRef: "Ch.26" },
      { id: "g32", src: "/book-graphs/g32_theory_comparison_radar.jpg", caption: "이론 비교 레이더", chapterRef: "Ch.27" },
      { id: "g33", src: "/book-graphs/g33_audit_flowchart.jpg", caption: "감사 흐름도", chapterRef: "Ch.28" },
    ],
  },
];

const COLOR_MAP: Record<string, { border: string; tag: string; dot: string }> = {
  rose:    { border: "border-rose-500/20",    tag: "bg-rose-500/10 text-rose-300",    dot: "bg-rose-400" },
  sky:     { border: "border-sky-500/20",     tag: "bg-sky-500/10 text-sky-300",      dot: "bg-sky-400" },
  violet:  { border: "border-violet-500/20",  tag: "bg-violet-500/10 text-violet-300",dot: "bg-violet-400" },
  cyan:    { border: "border-cyan-500/20",    tag: "bg-cyan-500/10 text-cyan-300",    dot: "bg-cyan-400" },
  emerald: { border: "border-emerald-500/20", tag: "bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-400" },
  amber:   { border: "border-amber-500/20",   tag: "bg-amber-500/10 text-amber-300",  dot: "bg-amber-400" },
};

export default function VisualAtlasPage() {
  return (
    <section className="space-y-12">
      {/* Hero */}
      <div className="panel px-8 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
              Reference · Visual Atlas
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
              도해 아틀라스
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-300">
              g00~g33 전체 34점을 번호 순서가 아닌 <strong className="text-slate-100">의미 묶음</strong>으로
              재구성했다. 각 이미지는 어떤 장의 무엇을 설명하는지 캡션으로 명시된다.
            </p>
          </div>
          <Link
            href="/reference/book-map"
            className="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200"
          >
            책 전체 구조도 →
          </Link>
        </div>

        {/* Theme index */}
        <div className="mt-6 flex flex-wrap gap-2">
          {THEME_GROUPS.map((g) => {
            const c = COLOR_MAP[g.color];
            return (
              <a
                key={g.id}
                href={`#${g.id}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition hover:opacity-80 ${c.border} ${c.tag}`}
              >
                {g.title} ({g.images.length})
              </a>
            );
          })}
        </div>
      </div>

      {/* Theme groups */}
      {THEME_GROUPS.map((group) => {
        const c = COLOR_MAP[group.color];
        return (
          <div key={group.id} id={group.id}>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                  <h2 className="text-xl font-bold text-white">{group.title}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.tag}`}>
                    {group.images.length}점
                  </span>
                </div>
                <p className="mt-1 pl-5 text-sm text-slate-400">{group.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {group.images.map((img) => (
                <div
                  key={img.id}
                  className={`group overflow-hidden rounded-xl border bg-slate-950 transition hover:border-slate-500 ${c.border}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="aspect-video w-full object-cover opacity-80 transition group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="px-3 py-2.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-200">{img.caption}</p>
                      <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                        {img.id}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{img.chapterRef}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
