import Link from "next/link";
import {
  loadAllResults,
  loadFrozenManifest,
  loadMicroSnapshot,
  loadModelEvalManifest,
  loadPredictions,
} from "@/lib/data";

function winnerCounts(rows: Array<{ actual_value?: number | null; standard_fit: number; salt_fit: number }>) {
  let salt = 0, standard = 0, tie = 0;
  for (const row of rows) {
    if (typeof row.actual_value !== "number") continue;
    const smErr = Math.abs(row.actual_value - row.standard_fit);
    const saltErr = Math.abs(row.actual_value - row.salt_fit);
    if (Math.abs(smErr - saltErr) <= 1e-12) tie++;
    else if (saltErr < smErr) salt++;
    else standard++;
  }
  return { salt, standard, tie, total: salt + standard + tie };
}

function channelLabel(channel: string) {
  switch (channel) {
    case "muon_g_minus_2": return "뮤온 g-2";
    case "neutrino_accelerator_long_baseline": return "장거리 가속기 중성미자";
    case "neutrino_atmospheric": return "대기 중성미자";
    case "neutrino_reactor": return "원자로 중성미자";
    default: return channel;
  }
}

export default async function VerificationResultsPage() {
  const [allResults, micro, frozen, evalManifest, predictions] = await Promise.all([
    loadAllResults(),
    loadMicroSnapshot(),
    loadFrozenManifest(),
    loadModelEvalManifest(),
    loadPredictions(),
  ]);

  const cosmic = winnerCounts(allResults);
  const microCounts = micro.scores.reduce(
    (acc, row) => {
      const w = (row.winner || "").toUpperCase();
      if (w === "SALT") acc.salt++;
      else if (w === "SM") acc.standard++;
      else acc.tie++;
      return acc;
    },
    { salt: 0, standard: 0, tie: 0 },
  );
  const microTotal = microCounts.salt + microCounts.standard + microCounts.tie;
  const totalCount = cosmic.total + microTotal;
  const totalSalt = cosmic.salt + microCounts.salt;
  const saltRate = totalCount > 0 ? ((totalSalt / totalCount) * 100).toFixed(1) : "—";

  const statusCounts = micro.fit_runs.reduce(
    (acc, row) => {
      const v = (row.verdict || "").toLowerCase();
      if (v.includes("better")) acc.decisive++;
      else if (v === "tie") acc.inconclusive++;
      else acc.insufficient++;
      return acc;
    },
    { decisive: 0, inconclusive: 0, insufficient: 0 },
  );

  const predictionMap = new Map(predictions.map((p) => [p.id, p]));
  const cosmicByPrediction = Array.from(
    allResults.reduce((acc, row) => {
      const rows = acc.get(row.prediction_id) ?? [];
      rows.push(row);
      acc.set(row.prediction_id, rows);
      return acc;
    }, new Map<string, typeof allResults>()),
  ).map(([predictionId, rows]) => {
    const counts = winnerCounts(rows);
    const candidateRows = rows.filter((r) => r.flag === "candidate").length;
    const prediction = predictionMap.get(predictionId);
    return { predictionId, title: prediction?.title ?? predictionId, summary: prediction?.summary ?? "", falsification: prediction?.falsification ?? "", counts, candidateRows };
  });

  const microByChannel = Array.from(
    micro.scores.reduce((acc, row) => {
      const cur = acc.get(row.channel) ?? { salt: 0, standard: 0, tie: 0, total: 0 };
      const w = (row.winner || "").toUpperCase();
      if (w === "SALT") cur.salt++;
      else if (w === "SM") cur.standard++;
      else cur.tie++;
      cur.total++;
      acc.set(row.channel, cur);
      return acc;
    }, new Map<string, { salt: number; standard: number; tie: number; total: number }>()),
  ).sort((a, b) => b[1].total - a[1].total);

  const decisiveRatio = micro.fit_runs.length > 0
    ? ((statusCounts.decisive / micro.fit_runs.length) * 100).toFixed(1)
    : "0.0";

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#021825] to-slate-950 px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Verification · Live Results
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white">
          실제 판정 결과
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
          같은 데이터와 같은 규칙으로 계산한 집계 결과다. frozen 데이터 기준으로 SALT와 기준선의 오차를 비교해 정리했다.
        </p>

        {/* Summary row */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-3">
            <p className="text-xs text-slate-500">통합 SALT 승률</p>
            <p className="mt-1 text-2xl font-bold text-cyan-200">{saltRate}%</p>
            <p className="text-xs text-slate-400">{totalSalt} / {totalCount}</p>
          </div>
          <div className="rounded-lg border border-sky-500/25 bg-sky-950/20 p-3">
            <p className="text-xs text-slate-500">거시 (우주론)</p>
            <p className="mt-1 font-mono text-sm text-sky-200">
              {cosmic.salt} / {cosmic.standard} / {cosmic.tie}
            </p>
            <p className="text-xs text-slate-400">SALT / 표준 / 동률</p>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-950/20 p-3">
            <p className="text-xs text-slate-500">미시 (입자물리)</p>
            <p className="mt-1 font-mono text-sm text-emerald-200">
              {microCounts.salt} / {microCounts.standard} / {microCounts.tie}
            </p>
            <p className="text-xs text-slate-400">SALT / 표준 / 동률</p>
          </div>
          <div className="rounded-lg border border-violet-500/25 bg-violet-950/20 p-3">
            <p className="text-xs text-slate-500">미시 decisive</p>
            <p className="mt-1 text-2xl font-bold text-violet-200">{statusCounts.decisive}</p>
            <p className="text-xs text-slate-400">inconclusive {statusCounts.inconclusive}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href="/verification"
          className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 transition hover:border-slate-600"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Overview</p>
          <h2 className="mt-2 text-lg font-bold text-white">왜 이 결과가 나왔는가</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            채널 정의, 기각 조건, 상태변수와 관측 흔적의 관계를 다시 확인할 수 있다.
          </p>
        </Link>
        <Link
          href="/verification/pending"
          className="rounded-2xl border border-amber-500/20 bg-slate-950/40 p-5 transition hover:border-amber-400/40"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Pending Queue</p>
          <h2 className="mt-2 text-lg font-bold text-white">무엇이 아직 계산되지 않았는가</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            결과판에 포함되지 않은 항목과 필요한 데이터, 식의 공백을 확인할 수 있다.
          </p>
        </Link>
        <Link
          href="/audit/reproduce"
          className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-5 transition hover:border-emerald-400/40"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Audit Trail</p>
          <h2 className="mt-2 text-lg font-bold text-white">같은 결과를 다시 얻는 법</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            frozen dataset, manifest, run provenance를 따라가며 같은 산출 경로를 확인할 수 있다.
          </p>
        </Link>
      </div>

      {/* Provenance */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">기준 데이터셋</p>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-200">{frozen.dataset_version || "—"}</p>
          <p className="mt-0.5 text-xs text-slate-500">{frozen.created_at_utc || "—"}</p>
        </div>
        <Link href="/snapshots" className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 transition hover:border-cyan-500/30">
          <p className="text-xs text-cyan-300">Snapshot</p>
          <p className="mt-1 text-sm font-semibold text-slate-200">{frozen.dataset_version || "—"}</p>
          <p className="mt-0.5 text-xs text-slate-400">manifest hash · linked runs</p>
        </Link>
        <Link href="/runs" className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 transition hover:border-sky-500/30">
          <p className="text-xs text-sky-300">Run provenance</p>
          <p className="mt-1 text-sm font-semibold text-slate-200">{evalManifest.pipeline || "run_model_eval"}</p>
          <p className="mt-0.5 text-xs text-slate-400">verdict · artifact hash</p>
        </Link>
      </div>

      <div className="panel px-6 py-5">
        <h2 className="mb-4 text-sm font-semibold text-white">결과를 읽는 기준</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">What this page proves</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              frozen 조건에서 SALT 오차가 기준선보다 작은 채널이 어디인지 정리한다.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">What it does not prove</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              이 집계만으로 이론 전체의 완결성이나 공학적 해석의 타당성까지 판단할 수는 없다.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Micro decisive ratio</p>
            <p className="mt-2 text-2xl font-bold text-violet-300">{decisiveRatio}%</p>
            <p className="mt-1 text-xs text-slate-500">fit runs 중 decisive 판정 비율</p>
          </div>
        </div>
      </div>

      {/* Frozen hashes */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Frozen 잠금 해시</p>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            { label: "manifest sha256", value: evalManifest.frozen.manifest_sha256 },
            { label: "pipeline", value: evalManifest.pipeline },
            { label: "formula: cosmic SM", value: evalManifest.formula_versions.cosmic_sm },
            { label: "formula: cosmic SALT", value: evalManifest.formula_versions.cosmic_salt },
            { label: "formula: micro SM", value: evalManifest.formula_versions.micro_sm },
            { label: "formula: micro SALT", value: evalManifest.formula_versions.micro_salt },
          ].map((item) => (
            <div key={item.label} className="flex items-baseline gap-2">
              <span className="w-40 shrink-0 text-xs text-slate-500">{item.label}</span>
              <code className="truncate text-xs text-slate-300">{item.value || "—"}</code>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          재현 명령 →{" "}
          <Link href="/audit/reproduce" className="text-cyan-400 hover:underline">/audit/reproduce</Link>
        </p>
      </div>

      {/* Per-prediction cards */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          예측별 판정 결과
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {cosmicByPrediction.map((entry) => {
            const saltPct = entry.counts.total > 0
              ? (entry.counts.salt / entry.counts.total) * 100
              : 0;
            return (
              <div key={entry.predictionId} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                      {entry.predictionId}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-white">{entry.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-lg border border-cyan-500/25 bg-cyan-950/30 px-2.5 py-1 text-xs text-cyan-200">
                    SALT {entry.counts.salt}승
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{entry.summary}</p>
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>frozen rows</span>
                    <code>{entry.counts.total}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>SALT / 표준 / 동률</span>
                    <code>{entry.counts.salt} / {entry.counts.standard} / {entry.counts.tie}</code>
                  </div>
                  {entry.candidateRows > 0 && (
                    <div className="flex justify-between">
                      <span>후보 플래그 rows</span>
                      <code>{entry.candidateRows}</code>
                    </div>
                  )}
                </div>
                {/* mini progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-cyan-500"
                      style={{ width: `${saltPct.toFixed(1)}%` }}
                    />
                  </div>
                </div>
                {entry.falsification && (
                  <p className="mt-3 text-xs text-slate-500">기각 기준: {entry.falsification}</p>
                )}
              </div>
            );
          })}

          {/* Micro cross-check card */}
          <div className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  micro cross-check
                </p>
                <h3 className="mt-1 text-base font-bold text-white">독립 미시 채널 교차검증</h3>
              </div>
              <span className="shrink-0 rounded-lg border border-emerald-500/25 bg-emerald-950/30 px-2.5 py-1 text-xs text-emerald-200">
                {microTotal} comparisons
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              거시 채널과 독립적으로 뮤온 g-2와 중성미자 채널에 동일 frozen 프로토콜을 적용한 교차검증.
              SALT가 독립 계통에서도 일관된 방향성을 보이는지 확인하는 견제 장치다.
            </p>
            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>score 판정 (SALT / 표준 / 동률)</span>
                <code>{microCounts.salt} / {microCounts.standard} / {microCounts.tie}</code>
              </div>
              <div className="flex justify-between">
                <span>fit run (decisive / inconclusive / insufficient)</span>
                <code>{statusCounts.decisive} / {statusCounts.inconclusive} / {statusCounts.insufficient}</code>
              </div>
              <div className="flex justify-between">
                <span>관측치 / 소스</span>
                <code>{micro.observations.length} / {micro.sources.length}</code>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {microByChannel.map(([channel, counts]) => (
                <span key={channel} className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-xs text-slate-400">
                  {channelLabel(channel)}: {counts.salt}/{counts.standard}/{counts.tie}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GW observation table */}
      <div className="panel px-6 py-6">
        <h2 className="mb-2 text-sm font-bold text-white">중력파 관측 — 사실 vs SALT 해석</h2>
        <p className="mb-4 text-xs text-slate-400">
          관측 사실과 SALT 해석을 분리해서 읽는 표. 관측 축과 해석 축을 혼동하지 않도록 한다.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-3 py-2 text-xs font-semibold text-slate-400">구분</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-200">관측 사실 (검증됨)</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-200">SALT 해석 (가설)</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              {[
                { div: "사건", fact: "GW150914 신호 검출, 블랙홀 병합 파형 일치", salt: "공간 매질의 국소 장력 요동이 직접 기록된 사례" },
                { div: "에너지", fact: "질량 결손(태양 ~3개분) → 파동 에너지 방출", salt: "결손 에너지가 보셀 격자 변형(밀도 파동)으로 전환" },
                { div: "검증 축", fact: "파형 · 주파수 · 도달시간의 다중 검출 정합", salt: "동일 채널에서 잔차 구조가 나오면 해석력 강화" },
              ].map((row) => (
                <tr key={row.div} className="border-b border-slate-800/60">
                  <td className="px-3 py-3 font-medium text-slate-200">{row.div}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{row.fact}</td>
                  <td className="px-3 py-3 text-sm text-slate-400">{row.salt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          GW150914 자체를 SALT가 독자 검출했다는 뜻이 아니다. 기확립된 관측을 SALT가 어떤 언어로 읽는지,
          그때 추가로 요구되는 검증 축이 무엇인지 분리해 보여주는 표다.
        </p>
      </div>

      {/* Claim A/B/C — mass hypothesis breakdown */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          질량화 가설 — 검증 항목 분해
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          "전달 모드에서 구조 고착 모드로 전환되며 질량이 생긴다"는 설명은 현재 frozen 파이프라인에서
          직접 채점된 결과가 아니다. 아래처럼 평가 가능한 명제로 분해해 다룬다.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              id: "A",
              tone: "text-cyan-300",
              title: "전달 모드 vs 구조 모드",
              body: "빛은 끝까지 전달 모드로 남고, 질량 상태는 임계 잠금이 일어난 구조 모드여야 한다.",
              status: "직접 판정 변수 없음",
              statusColor: "text-slate-400",
              note: "σ, W, τ_relax를 관측량으로 매핑하는 단계가 필요하다.",
            },
            {
              id: "B",
              tone: "text-emerald-300",
              title: "밀도 구조가 만든 지연",
              body: "고밀도 구간에서 공통 잔차(시간 지연 + 적색편이)가 나타나야 한다.",
              status: "부분 검증 진행 중",
              statusColor: "text-emerald-300",
              note: "p1-time-delay-redshift 채널로 연결됨.",
            },
            {
              id: "C",
              tone: "text-sky-300",
              title: "고에너지/정밀 채널 잔차 구조",
              body: "극단 구간에서 표준 기준선과 다른 꼬리 패턴 또는 미시 잔차 개선이 나타나야 한다.",
              status: "부분 검증 진행 중",
              statusColor: "text-sky-300",
              note: "p2-hf-tail, micro cross-check 연결됨.",
            },
          ].map((claim) => (
            <div key={claim.id} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-5">
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${claim.tone}`}>
                claim {claim.id}
              </p>
              <h3 className="mt-1 text-base font-bold text-white">{claim.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{claim.body}</p>
              <p className={`mt-3 text-xs font-semibold ${claim.statusColor}`}>{claim.status}</p>
              <p className="mt-1 text-xs text-slate-500">{claim.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-950/15 px-5 py-4 text-sm text-amber-100/80">
        이 페이지는 "홀로그램 원리 자체의 타당성이 확정됐다"가 아니라, 경계에서 측정한 지연/적색편이/잔차 패턴을
        대상으로 실제 시험을 돌렸고 그 승패와 미결정 상태를 공개한다는 뜻이다.
      </div>

      {/* Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
        <Link href="/verification" className="text-sm text-slate-400 hover:text-white">← Verification 개요</Link>
        <div className="flex gap-3">
          <Link href="/verification/pending" className="text-sm text-cyan-400 hover:underline">검증 대기 항목 →</Link>
          <Link href="/audit/reproduce" className="text-sm text-slate-400 hover:text-white">재현 방법 →</Link>
        </div>
      </div>
    </section>
  );
}
