import Link from "next/link";
import { loadMicroSnapshot, loadAllResults, loadFrozenManifest } from "@/lib/data";
import { CANDIDATE_HYPOTHESES, VERIFICATION_CHANNELS } from "@/lib/site-content";
import CommentsPanel from "@/components/comments-panel";

const STATE_VARIABLE_MAP = [
  {
    variable: "ρ",
    name: "밀도",
    desc: "공간의 국소 에너지 밀도",
    traces: ["시간 지연 잔차", "적색편이 패턴", "LIV 파라미터"],
    color: "cyan",
  },
  {
    variable: "θ",
    name: "장력각",
    desc: "밀도 경계의 방향성",
    traces: ["중력렌즈 잔차", "편광 방향 오프셋"],
    color: "sky",
  },
  {
    variable: "L",
    name: "특성 길이",
    desc: "구조 전환의 공간 스케일",
    traces: ["HF-GW 꼬리 주파수", "고에너지 잔차 구조"],
    color: "violet",
  },
];

const VERIFICATION_LANES = [
  {
    href: "/verification/results",
    title: "Results Board",
    desc: "현재 frozen 데이터 기준 집계와 항목별 판정 결과를 확인할 수 있다.",
    tag: "지금 확인 가능",
    accent: "cyan",
  },
  {
    href: "/verification/pending",
    title: "Pending Queue",
    desc: "가설은 있으나 아직 운영형 관측량과 score가 잠기지 않은 항목을 확인할 수 있다.",
    tag: "아직 미완성",
    accent: "amber",
  },
  {
    href: "/audit/reproduce",
    title: "Audit Trail",
    desc: "snapshot, run, hash를 바탕으로 산출 경로를 확인할 수 있다.",
    tag: "재현 점검",
    accent: "emerald",
  },
] as const;

export default async function VerificationPage() {
  const [micro, allResults, frozen] = await Promise.all([
    loadMicroSnapshot(),
    loadAllResults(),
    loadFrozenManifest(),
  ]);

  const microDecisive = micro.fit_runs.filter((r) =>
    (r.verdict || "").toLowerCase().includes("better")
  ).length;
  const cosmicSaltWins = allResults.filter((r) => {
    if (typeof r.actual_value !== "number") return false;
    return Math.abs(r.actual_value - r.salt_fit) < Math.abs(r.actual_value - r.standard_fit);
  }).length;

  return (
    <section className="space-y-10">
      {/* Chapter Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#031825] to-slate-950 px-8 py-10">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-500/8 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          18장 · Verification
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          검증 자료는 어떻게 구성되어 있는가
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 섹션은 직접 관측이 아니라 <strong className="text-slate-100">관측 흔적의 정량 비교</strong>를
          기준으로 정리되어 있다. 현재는 3개의 고정 채널과 검증 대기 항목을 구분해 볼 수 있다.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-500">고정 채널</p>
            <p className="mt-0.5 text-2xl font-bold text-cyan-300">3</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">거시 SALT 우세</p>
            <p className="mt-0.5 text-2xl font-bold text-sky-300">{cosmicSaltWins}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">미시 decisive</p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-300">{microDecisive}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">기준 데이터</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-slate-300">
              {frozen.dataset_version || "—"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Verification에서 바로 갈 수 있는 세 갈래
          </h2>
          <span className="text-xs text-slate-500">개요 / 결과 / 대기 / 감사</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {VERIFICATION_LANES.map((lane) => {
            const borderMap: Record<string, string> = {
              cyan: "border-cyan-500/20 hover:border-cyan-400/40",
              amber: "border-amber-500/20 hover:border-amber-400/40",
              emerald: "border-emerald-500/20 hover:border-emerald-400/40",
            };
            const tagMap: Record<string, string> = {
              cyan: "bg-cyan-500/10 text-cyan-300",
              amber: "bg-amber-500/10 text-amber-300",
              emerald: "bg-emerald-500/10 text-emerald-300",
            };
            return (
              <Link
                key={lane.href}
                href={lane.href}
                className={`group rounded-2xl border bg-slate-950/45 p-5 transition ${borderMap[lane.accent]}`}
              >
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tagMap[lane.accent]}`}>
                  {lane.tag}
                </span>
                <h2 className="mt-4 text-xl font-bold text-white">{lane.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{lane.desc}</p>
                <p className="mt-5 text-sm font-semibold text-slate-200 group-hover:text-white">열기 →</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* State variable → trace map */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          상태변수 → 관측 흔적 매핑
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STATE_VARIABLE_MAP.map((sv) => {
            const borderMap: Record<string, string> = {
              cyan: "border-cyan-500/25",
              sky: "border-sky-500/25",
              violet: "border-violet-500/25",
            };
            const codeMap: Record<string, string> = {
              cyan: "bg-cyan-950/50 text-cyan-200",
              sky: "bg-sky-950/50 text-sky-200",
              violet: "bg-violet-950/50 text-violet-200",
            };
            const dotMap: Record<string, string> = {
              cyan: "bg-cyan-400",
              sky: "bg-sky-400",
              violet: "bg-violet-400",
            };
            return (
              <div key={sv.variable} className={`rounded-xl border bg-slate-950/50 p-5 ${borderMap[sv.color]}`}>
                <div className="flex items-center gap-3">
                  <code className={`rounded px-2.5 py-1 text-lg font-bold ${codeMap[sv.color]}`}>
                    {sv.variable}
                  </code>
                  <div>
                    <p className="text-sm font-bold text-white">{sv.name}</p>
                    <p className="text-xs text-slate-500">{sv.desc}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs text-slate-500">→ 관측 흔적</p>
                  <div className="space-y-1.5">
                    {sv.traces.map((t) => (
                      <div key={t} className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotMap[sv.color]}`} />
                        <span className="text-xs text-slate-300">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed verification channels — 3 cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            고정 검증 채널 3종
          </h2>
          <span className="badge-verified">판정 규칙 고정</span>
        </div>
        <div className="space-y-4">
          {VERIFICATION_CHANNELS.map((ch) => (
            <div
              key={ch.slug}
              className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6 transition hover:border-cyan-500/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300">
                      {ch.tag}
                    </span>
                    <span className="badge-verified">LOCKED</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">{ch.title}</h3>
                  <p className="text-sm text-slate-500">{ch.fullTitle}</p>
                </div>
                <Link
                  href={ch.href}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
                >
                  상세 보기 →
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">핵심 질문</p>
                  <p className="mt-1 text-sm text-slate-200">{ch.what}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">기준 모델</p>
                  <p className="mt-1 text-sm text-slate-300">{ch.baseline}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">SALT 예측</p>
                  <p className="mt-1 text-sm text-slate-300">{ch.saltPrediction}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    자유 파라미터
                  </p>
                  <code className="mt-1 block text-xs text-cyan-200">{ch.parameter}</code>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    기각 조건
                  </p>
                  <p className="mt-1 text-xs text-rose-300/90">{ch.falsification}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {ch.datasets.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-0.5 text-xs text-slate-400"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">읽는 순서</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              step: "01",
              title: "채널 개요",
              body: "무엇을 시험하는지와 기각 조건을 먼저 본다.",
            },
            {
              step: "02",
              title: "결과판",
              body: "현재 계산 가능한 항목에서 SALT와 기준선의 승패를 확인한다.",
            },
            {
              step: "03",
              title: "대기판",
              body: "아직 판정할 수 없는 가설과 필요한 식/데이터를 확인한다.",
            },
            {
              step: "04",
              title: "감사 경로",
              body: "snapshot, run, reproduce 경로를 따라가며 산출 과정을 확인한다.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-2xl font-bold text-slate-600">{item.step}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate hypotheses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            후보 가설 묶음
          </h2>
          <span className="badge-pending">검증 대기</span>
        </div>
        <div className="rounded-xl border border-amber-500/15 bg-amber-950/10 p-5">
          <p className="mb-4 text-xs text-amber-200/60">
            아래 항목은 고정 채널과 달리 아직 판정 규칙이 잠기지 않았다. 형식화 완료 또는 데이터
            집계 중인 검증 예정 가설이다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CANDIDATE_HYPOTHESES.map((h) => (
              <div
                key={h.title}
                className="rounded-lg border border-amber-500/15 bg-slate-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-amber-100">{h.title}</p>
                  <span className="badge-pending shrink-0">대기</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{h.body}</p>
                <p className="mt-3 text-[11px] text-slate-500">다음 단계: {h.nextStep}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Link href="/verification/candidate-hypotheses" className="text-sm text-amber-300 hover:text-amber-200">
            후보 가설 전체 보기 →
          </Link>
        </div>
      </div>

      {/* Verification flow timeline */}
      <div className="panel px-6 py-6">
        <h2 className="mb-5 text-sm font-bold text-white">검증 경로 — 4단계 절차</h2>
        <div className="flex flex-col gap-0 md:flex-row">
          {[
            { step: "01", label: "관측량 고정", desc: "무엇을 측정할지 데이터 기준 잠금" },
            { step: "02", label: "비교식 고정", desc: "SALT 예측식 vs 표준 기준식" },
            { step: "03", label: "판정 규칙 고정", desc: "기각 조건 사전 명시" },
            { step: "04", label: "감사 항목 기록", desc: "hash · provenance · 재현 명령" },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex flex-1 items-stretch">
              <div className="flex flex-1 flex-col items-center rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-center">
                <span className="text-2xl font-bold text-slate-600">{item.step}</span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="flex shrink-0 items-center px-1 text-slate-600">
                  <span className="hidden text-xs md:block">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          26장 프로토콜과 연결 →{" "}
          <Link href="/audit/reproduce" className="text-cyan-400 hover:underline">
            /audit/reproduce
          </Link>
        </p>
      </div>

      {/* Nav to sub-pages */}
      <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5">
        <Link
          href="/verification/channels"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          채널 인덱스 →
        </Link>
        <Link
          href="/verification/results"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
        >
          판정 결과 상세 →
        </Link>
        <Link
          href="/verification/pending"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-300 transition hover:border-amber-400/40 hover:bg-amber-500/15"
        >
          검증 대기 항목 →
        </Link>
        <Link
          href="/audit/reproduce"
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:border-emerald-400/40 hover:bg-emerald-500/15"
        >
          재현 방법 →
        </Link>
      </div>

      <CommentsPanel
        pagePath="/verification"
        description="검증 구조, 채널 분류, 읽는 순서에서 모호한 점이나 보강이 필요한 지점을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
