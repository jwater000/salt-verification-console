import Link from "next/link";
import { loadMicroSnapshot, loadAllResults, loadFrozenManifest } from "@/lib/frozen-data";
import { CANDIDATE_HYPOTHESES, VERIFICATION_CHANNELS } from "@/lib/site-content";
import CommentsPanel from "@/components/comments-panel";
import NextSteps from "@/components/next-steps";

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
          SALT가 얼마나 설득력 있는지
          <br />
          숫자로 확인하는 자리
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          이곳에서는 선언보다 숫자가 앞선다. 관측 흔적을 기준으로 표준 기준선과 SALT를 같은 판정 규칙 위에
          올려놓고, 실제값에 누가 더 가까운지 비교한다. 중요한 것은 &quot;얼마나 멋진 설명인가&quot;가 아니라
          &quot;어디에서 더 잘 맞고, 어디에서 아직 비어 있는가&quot;다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">고정 채널 비교</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">실제 오차 중심</span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">승패보다 패턴 읽기</span>
        </div>
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">무엇이 맞는가</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            현재 잠긴 채널에서 SALT와 기준선이 실제값에 얼마나 가까운지 본다.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">무엇이 아직 비어 있는가</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            아이디어는 있지만 아직 판정 규칙과 데이터 잠금이 끝나지 않은 가설을 본다.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/45 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">근거는 어디까지 따라갈 수 있는가</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            필요하면 reproduce, run, hash 자료까지 내려가며 계산 경로를 끝까지 따라갈 수 있다.
          </p>
        </div>
      </div>

      {/* State variable → trace map */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          상태변수에서 관측 흔적으로
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
            지금 열려 있는 검증 채널
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
        <h2 className="mb-5 text-sm font-bold text-white">결과를 읽는 순서</h2>
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
            아직 시험대에 오르는 중인 가설
          </h2>
          <span className="badge-pending">검증 대기</span>
        </div>
        <div className="rounded-xl border border-amber-500/15 bg-amber-950/10 p-5">
          <p className="mb-4 text-xs text-amber-200/60">
            아래 항목은 아직 채점표를 완성하는 중이다. 생각은 선명하지만, 판정 규칙과 데이터 묶음이
            완전히 잠기기 전까지는 결과가 아니라 준비 중인 질문으로 읽는 편이 맞다.
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
        <h2 className="mb-5 text-sm font-bold text-white">검증이 만들어지는 절차</h2>
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

      <NextSteps
        title="다음으로 볼 곳"
        steps={[
          {
            href: "/verification/channels",
            title: "Channels",
            body: "고정 채널 3종을 같은 형식으로 훑고 개별 채널 상세로 들어간다.",
          },
          {
            href: "/verification/candidate-hypotheses",
            title: "Candidate Hypotheses",
            body: "아직 잠기지 않은 가설과 다음 형식화 과제를 확인한다.",
          },
          {
            href: "/audit/reproduce",
            title: "Audit Reproduce",
            body: "판정 근거를 재현 단계까지 따라가야 할 때만 감사 자료로 이동한다.",
          },
        ]}
      />

      <CommentsPanel
        pagePath="/verification"
        description="검증 구조, 채널 분류, 읽는 순서에서 모호한 점이나 보강이 필요한 지점을 남길 수 있도록 준비 중입니다."
      />
    </section>
  );
}
