import {
  loadAllResults,
  loadFrozenManifest,
  loadMicroSnapshot,
  loadModelEvalManifest,
  loadPredictions,
} from "@/lib/data";
import { loadPageMarkdown, markdownToHtml } from "@/lib/markdown";

type WinCounts = {
  salt: number;
  standard: number;
  tie: number;
  total: number;
};

function winnerCounts(rows: Array<{ actual_value?: number | null; standard_fit: number; salt_fit: number }>): WinCounts {
  let salt = 0;
  let standard = 0;
  let tie = 0;
  for (const row of rows) {
    if (typeof row.actual_value !== "number") continue;
    const smErr = Math.abs(row.actual_value - row.standard_fit);
    const saltErr = Math.abs(row.actual_value - row.salt_fit);
    if (Math.abs(smErr - saltErr) <= 1e-12) tie += 1;
    else if (saltErr < smErr) salt += 1;
    else standard += 1;
  }
  return { salt, standard, tie, total: salt + standard + tie };
}

function channelLabel(channel: string): string {
  switch (channel) {
    case "muon_g_minus_2":
      return "뮤온 g-2";
    case "neutrino_accelerator_long_baseline":
      return "장거리 가속기 중성미자";
    case "neutrino_atmospheric":
      return "대기 중성미자";
    case "neutrino_reactor":
      return "원자로 중성미자";
    default:
      return channel;
  }
}

export default async function EvaluationPage() {
  const [allResults, micro, frozenManifest, evalManifest, predictions] = await Promise.all([
    loadAllResults(),
    loadMicroSnapshot(),
    loadFrozenManifest(),
    loadModelEvalManifest(),
    loadPredictions(),
  ]);

  const cosmic = winnerCounts(allResults);
  const microCounts = micro.scores.reduce(
    (acc, row) => {
      const winner = (row.winner || "").toUpperCase();
      if (winner === "SALT") acc.salt += 1;
      else if (winner === "SM") acc.standard += 1;
      else if (winner === "TIE") acc.tie += 1;
      return acc;
    },
    { salt: 0, standard: 0, tie: 0 },
  );
  const microTotal = microCounts.salt + microCounts.standard + microCounts.tie;
  const total = {
    salt: cosmic.salt + microCounts.salt,
    standard: cosmic.standard + microCounts.standard,
    tie: cosmic.tie + microCounts.tie,
  };
  const totalCount = total.salt + total.standard + total.tie;
  const saltRate = totalCount > 0 ? ((total.salt / totalCount) * 100).toFixed(1) : "-";
  const statusCounts = micro.fit_runs.reduce(
    (acc, row) => {
      const verdict = (row.verdict || "").toLowerCase();
      if (verdict.includes("better")) acc.decisive += 1;
      else if (verdict === "tie") acc.inconclusive += 1;
      else acc.insufficient += 1;
      return acc;
    },
    { insufficient: 0, inconclusive: 0, decisive: 0 },
  );

  const md = await loadPageMarkdown("00_결론_보고.md");
  const html = markdownToHtml(md);
  const cosmicSaltPct = cosmic.total > 0 ? (cosmic.salt / cosmic.total) * 100 : 0;
  const microSaltPct = microTotal > 0 ? (microCounts.salt / microTotal) * 100 : 0;
  const totalSaltPct = totalCount > 0 ? (total.salt / totalCount) * 100 : 0;
  const predictionMap = new Map(predictions.map((prediction) => [prediction.id, prediction]));
  const cosmicByPrediction = Array.from(
    allResults.reduce(
      (acc, row) => {
        const rows = acc.get(row.prediction_id) ?? [];
        rows.push(row);
        acc.set(row.prediction_id, rows);
        return acc;
      },
      new Map<string, typeof allResults>(),
    ),
  ).map(([predictionId, rows]) => {
    const counts = winnerCounts(rows);
    const candidateRows = rows.filter((row) => row.flag === "candidate").length;
    const prediction = predictionMap.get(predictionId);
    return {
      predictionId,
      title: prediction?.title ?? predictionId,
      summary: prediction?.summary ?? "",
      falsification: prediction?.falsification ?? "",
      counts,
      candidateRows,
    };
  });
  const microByChannel = Array.from(
    micro.scores.reduce(
      (acc, row) => {
        const current = acc.get(row.channel) ?? { salt: 0, standard: 0, tie: 0, total: 0 };
        const winner = (row.winner || "").toUpperCase();
        if (winner === "SALT") current.salt += 1;
        else if (winner === "SM") current.standard += 1;
        else current.tie += 1;
        current.total += 1;
        acc.set(row.channel, current);
        return acc;
      },
      new Map<string, { salt: number; standard: number; tie: number; total: number }>(),
    ),
  ).sort((a, b) => b[1].total - a[1].total);

  return (
    <section className="space-y-5">
      <article className="panel p-6 text-slate-200">
        <h1 className="text-2xl font-bold text-white">검증 결과 보고</h1>
        <p className="mt-2 text-slate-300">같은 데이터, 같은 규칙으로 SALT와 기준 이론의 오차를 직접 비교합니다.</p>
        <p className="mt-2 text-sm text-slate-400">
          절차, 해시, 모델식은 재현 방법에서 확인할 수 있습니다.
          <a className="ml-2 text-cyan-300 underline underline-offset-4" href="/audit/reproduce">
            /audit/reproduce
          </a>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          아직 채점되지 않은 가설은
          <a className="ml-2 text-cyan-300 underline underline-offset-4" href="/predictions">
            /predictions
          </a>
          에 분리해 두었습니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/30 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]">
            <p className="text-xs text-slate-400">결론</p>
            <p className="mt-1 text-xl font-bold text-cyan-200">현재 집계 기준 SALT 우세</p>
            <p className="text-sm text-cyan-100">{total.salt} / {totalCount} 승</p>
          </div>
          <div className="rounded-lg border border-emerald-500/35 bg-emerald-950/25 p-4">
            <p className="text-xs text-slate-400">기준 데이터</p>
            <p className="mt-1 text-sm font-semibold text-emerald-100">
              {frozenManifest.dataset_version || "-"}
            </p>
            <p className="text-xs text-emerald-200/80">{frozenManifest.created_at_utc || "-"}</p>
          </div>
          <div className="rounded-lg border border-sky-500/35 bg-sky-950/25 p-4">
            <p className="text-xs text-slate-400">다음</p>
            <p className="mt-1 text-sm font-medium text-sky-100">결과 읽기 {"->"} 근거 확인 {"->"} 재현</p>
          </div>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">Provenance 바로가기</h2>
        <p className="mt-2 text-sm text-slate-300">
          지금 보고 있는 결과가 어떤 snapshot과 어떤 실행 기준으로 만들어졌는지 바로 추적할 수 있습니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <a href="/snapshots" className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4 transition hover:border-cyan-400">
            <p className="text-xs text-cyan-200/80">Snapshot 기준</p>
            <p className="mt-1 text-sm font-semibold text-cyan-100">{frozenManifest.dataset_version || "-"}</p>
            <p className="mt-2 text-xs text-slate-400">dataset_version, manifest hash, linked runs 확인</p>
          </a>
          <a href="/runs" className="rounded-lg border border-sky-500/30 bg-sky-950/25 p-4 transition hover:border-sky-400">
            <p className="text-xs text-sky-200/80">Run provenance</p>
            <p className="mt-1 text-sm font-semibold text-sky-100">{evalManifest.pipeline || "run_model_eval"}</p>
            <p className="mt-2 text-xs text-slate-400">실행 명령, verdict, artifact hash 확인</p>
          </a>
        </div>
      </article>

      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">실제 검증 집계 (frozen 기준 자동 산출)</h2>
        <p className="mt-2 text-sm text-slate-300">
          dataset_version: <code>{frozenManifest.dataset_version || "-"}</code> / created_at:{" "}
          <code>{frozenManifest.created_at_utc || "-"}</code> / micro_snapshot:{" "}
          <code>{micro.generated_at_utc || "-"}</code>
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>
            거시: 총 <code>{cosmic.total}</code>, SALT <code>{cosmic.salt}</code>, 표준 <code>{cosmic.standard}</code>, 동률{" "}
            <code>{cosmic.tie}</code>
          </li>
          <li>
            미시: 총 <code>{microTotal}</code>, SALT <code>{microCounts.salt}</code>, 표준 <code>{microCounts.standard}</code>, 동률{" "}
            <code>{microCounts.tie}</code>
          </li>
          <li>
            통합: 총 <code>{totalCount}</code>, SALT <code>{total.salt}</code>, 표준 <code>{total.standard}</code>, 동률{" "}
            <code>{total.tie}</code>, SALT 승률 <code>{saltRate}%</code>
          </li>
          <li>
            상태(미시 fit_runs): <code>insufficient_data={statusCounts.insufficient}</code>,{" "}
            <code>inconclusive={statusCounts.inconclusive}</code>, <code>decisive={statusCounts.decisive}</code>
          </li>
          <li>
            frozen_manifest_sha256: <code>{evalManifest.frozen.manifest_sha256 || "-"}</code>
          </li>
        </ul>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-cyan-500/30 bg-cyan-950/25 p-3">
            <p className="text-xs text-cyan-200/80">거시 승/패/무</p>
            <p className="mt-1 font-mono text-sm text-cyan-100">
              {cosmic.salt} / {cosmic.standard} / {cosmic.tie}
            </p>
          </div>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-950/25 p-3">
            <p className="text-xs text-emerald-200/80">미시 승/패/무</p>
            <p className="mt-1 font-mono text-sm text-emerald-100">
              {microCounts.salt} / {microCounts.standard} / {microCounts.tie}
            </p>
          </div>
          <div className="rounded-md border border-sky-500/30 bg-sky-950/25 p-3">
            <p className="text-xs text-sky-200/80">통합 승률</p>
            <p className="mt-1 font-mono text-sm text-sky-100">{saltRate}%</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>거시 SALT 비율</span>
              <span>{cosmicSaltPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-slate-800">
              <div className="h-2 rounded bg-cyan-400" style={{ width: `${cosmicSaltPct}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>미시 SALT 비율</span>
              <span>{microSaltPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-slate-800">
              <div className="h-2 rounded bg-emerald-400" style={{ width: `${microSaltPct}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>통합 SALT 비율</span>
              <span>{totalSaltPct.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded bg-slate-800">
              <div className="h-2 rounded bg-sky-400" style={{ width: `${totalSaltPct}%` }} />
            </div>
          </div>
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">무엇을 실제로 시험했는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          여기서 검증한 것은 내부를 직접 본다는 선언이 아닙니다. 고밀도 구간을 지난 신호가 경계에서
          측정 가능한 시간 지연, 적색편이, 고에너지 잔차, 미시 관측량에 체계적 흔적을 남기는지 같은
          질문을 frozen 데이터로 실제 비교한 결과입니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          즉 &quot;홀로그램 원리와 유사한 정보 투영&quot;은 해석 프레임이고, 이 콘솔이 직접 판정하는 대상은
          경계 관측량에서 SALT 예측이 표준 기준선보다 더 잘 맞는지 여부입니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {cosmicByPrediction.map((entry) => (
            <div key={entry.predictionId} className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{entry.predictionId}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{entry.title}</h3>
                </div>
                <div className="rounded-md border border-cyan-500/30 bg-cyan-950/25 px-2 py-1 text-xs text-cyan-100">
                  SALT {entry.counts.salt}승
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{entry.summary}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {entry.predictionId === "p1-time-delay-redshift"
                  ? "시험 대상은 시간 지연과 적색편이입니다. 경로 의존 지연 정보가 실재한다면 외부 관측값인 지연과 적색편이에 공통 패턴이 남아야 하므로, 이 항목이 요청하신 문장과 가장 직접적으로 연결됩니다."
                  : "시험 대상은 고주파 또는 고에너지 구간의 잔차입니다. 내부 상태가 경계 신호에 투영된다면 극단 구간에서 표준 기준선과 다른 꼬리 패턴이 남는지 확인할 수 있습니다."}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-300">
                <li>
                  frozen rows: <code>{entry.counts.total}</code>
                </li>
                <li>
                  승패: <code>SALT {entry.counts.salt}</code> / <code>표준 {entry.counts.standard}</code> /{" "}
                  <code>동률 {entry.counts.tie}</code>
                </li>
                <li>
                  후보 플래그 rows: <code>{entry.candidateRows}</code>
                </li>
              </ul>
              <p className="mt-3 text-xs leading-5 text-slate-500">반증 기준: {entry.falsification}</p>
            </div>
          ))}
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">micro cross-check</p>
                <h3 className="mt-1 text-base font-semibold text-white">독립 미시 채널 교차검증</h3>
              </div>
              <div className="rounded-md border border-emerald-500/30 bg-emerald-950/25 px-2 py-1 text-xs text-emerald-100">
                {microTotal} comparisons
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              거시 광로 시험만으로는 해석이 과도해질 수 있어서, 같은 frozen 프로토콜을 뮤온 g-2와 중성미자
              채널에도 적용했습니다. 이는 &quot;정보 투영&quot; 문구를 직접 증명하는 용도가 아니라, SALT가 독립 계통에서도
              일관된 방향성을 보이는지 확인하는 견제 장치입니다.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-300">
              <li>
                총 score 판정: <code>SALT {microCounts.salt}</code> / <code>표준 {microCounts.standard}</code> /{" "}
                <code>동률 {microCounts.tie}</code>
              </li>
              <li>
                fit run 상태: <code>decisive {statusCounts.decisive}</code> / <code>inconclusive {statusCounts.inconclusive}</code> /{" "}
                <code>insufficient {statusCounts.insufficient}</code>
              </li>
              <li>
                관측치 수: <code>{micro.observations.length}</code>, 소스 수: <code>{micro.sources.length}</code>
              </li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              {microByChannel.map(([channel, counts]) => (
                <span key={channel} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
                  {channelLabel(channel)}: {counts.salt}/{counts.standard}/{counts.tie}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
          현재 결과 해석: 이 페이지는 &quot;홀로그램 원리 자체가 입증됐다&quot;가 아니라, 경계에서 측정한 지연/적색편이/잔차
          패턴을 대상으로 실제 시험을 돌렸고, 그 승패와 미결정 상태를 공개한다는 뜻입니다. 일부 항목은 SALT 우세,
          일부는 아직 표본 부족 또는 미결정으로 남아 있습니다.
        </div>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">현재 기술이 이미 기대는 검증 사실</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          20장의 공학 응용 시나리오 전체가 이미 검증된 것은 아닙니다. 다만 그 바탕이 되는 아래 사실들은 현재 기술과
          실험에서 반복 확인된 축입니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">중력 기술 기반</p>
            <h3 className="mt-1 text-base font-semibold text-white">지연, 렌즈, 궤도 정합</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              GPS 보정, 중력렌즈, 자유낙하와 궤도 계산 같은 기술 축은 중력의 보편성과 지연 관측을 높은 정밀도로
              사용하고 있습니다.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">질량-에너지 기반</p>
            <h3 className="mt-1 text-base font-semibold text-white">핵반응과 입자물리</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              질량-에너지 등가는 핵분열, 핵융합, 입자 생성과 붕괴 채널에서 반복 검증되었고, 원자로와 가속기 기술의
              기반으로 이미 쓰이고 있습니다.
            </p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-950/25 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">양자 공학 기반</p>
            <h3 className="mt-1 text-base font-semibold text-white">밴드, 터널링, 큐비트 제어</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              반도체의 밴드 구조, 터널링, 큐비트 제어와 디코히런스 문제 자체는 모두 실험적으로 확인된 공학 현실입니다.
              SALT는 이 층을 다른 언어로 재해석하려는 쪽입니다.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          미래 기술 활용 시나리오는{" "}
          <a className="text-cyan-300 underline underline-offset-4" href="/engineering">
            /engineering
          </a>
          에서 따로 정리합니다. 이 페이지에는 그 바탕이 되는 검증 사실만 남깁니다.
        </p>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">중력파 관측은 어떻게 읽는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          아래 표는 중력파 관측 자체가 이미 검증된 사실과, 그 사실을 SALT가 어떻게 읽는지 분리해서 보여줍니다.
          즉 사건 검출과 파형 정합은 관측 축이고, &quot;공간 매질의 장력 요동&quot; 같은 표현은 그 관측을 설명하는
          SALT 해석입니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-3 py-2 font-semibold text-white">구분</th>
                <th className="px-3 py-2 font-semibold text-white">관측 사실 (검증)</th>
                <th className="px-3 py-2 font-semibold text-white">SALT 해석 (가설)</th>
              </tr>
            </thead>
            <tbody className="align-top text-slate-300">
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3 font-medium text-slate-200">사건</td>
                <td className="px-3 py-3">GW150914 신호 검출, 블랙홀 병합 파형 일치</td>
                <td className="px-3 py-3">공간 매질의 국소 장력 요동이 직접 기록된 사례</td>
              </tr>
              <tr className="border-b border-slate-800/80">
                <td className="px-3 py-3 font-medium text-slate-200">에너지</td>
                <td className="px-3 py-3">질량 결손(약 태양 3개분) -&gt; 파동 에너지 방출</td>
                <td className="px-3 py-3">결손 에너지가 보셀 격자 변형(밀도 파동)으로 전환</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-medium text-slate-200">검증축</td>
                <td className="px-3 py-3">파형, 주파수, 도달시간의 다중 검출 정합</td>
                <td className="px-3 py-3">동일 채널에서 잔차 구조가 나오면 해석력 강화</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          이 표는 GW150914 자체를 SALT가 독자 검출했다는 뜻이 아니라, 이미 확립된 중력파 관측을 SALT가 어떤
          언어로 읽는지와 그때 추가로 요구되는 검증축이 무엇인지 분리해 보여주는 용도입니다.
        </p>
      </article>
      <article className="panel p-6 text-slate-200">
        <h2 className="text-xl font-semibold text-white">질량화 가설은 어떻게 검증 항목으로 바꾸는가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          3장의 &quot;전달 모드에서 구조 고착 모드로 전환되며 질량이 생긴다&quot;는 설명은 현재 frozen 파이프라인에서
          직접 채점된 결과는 아닙니다. 그래서 이 페이지에는 이 문장을 그대로 결과처럼 올리지 않고, 아래처럼
          실제 평가 가능한 명제로 쪼개서 다룹니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">claim a</p>
            <h3 className="mt-1 text-base font-semibold text-white">전달 모드 vs 구조 모드 분리</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              빛은 끝까지 전달 모드로 남고, 질량 상태는 임계 잠금이 일어난 구조 모드여야 한다는 주장입니다.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              현재 상태: 직접 판정 변수 없음. <code>sigma</code>, <code>W</code>, <code>tau_relax</code>를
              관측량으로 매핑하는 단계가 필요합니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">claim b</p>
            <h3 className="mt-1 text-base font-semibold text-white">밀도 구조가 만든 지연</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              고밀도 구간에서 신호가 더 큰 유효 광행정과 전달 조건 변화를 겪는다면, 시간 지연과 적색편이에 공통 잔차가
              나타나야 한다는 주장입니다.
            </p>
            <p className="mt-3 text-xs leading-5 text-emerald-200">
              현재 연결 채널: <code>p1-time-delay-redshift</code>로 부분 검증 중
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">claim c</p>
            <h3 className="mt-1 text-base font-semibold text-white">고에너지/정밀 채널 잔차 구조</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              구조 모드 가설이 맞다면 극단 구간에서 표준 기준선과 다른 꼬리 패턴 또는 미시 잔차 개선이 나타나야 한다는 주장입니다.
            </p>
            <p className="mt-3 text-xs leading-5 text-sky-200">
              현재 연결 채널: <code>p2-hf-tail</code>, <code>micro cross-check</code>
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/30 p-4 text-sm leading-6 text-slate-300">
          요약하면, 3장의 질량화 설명은 지금 단계에서 &quot;완료된 실험 결과&quot;가 아니라 &quot;검증 가능 명제 묶음&quot;으로
          취급하는 것이 맞습니다. `/evaluation`은 그중 이미 frozen 데이터로 채점된 부분만 결과로 올리고,
          직접 측정 변수가 아직 없는 항목은 <a className="text-cyan-300 underline underline-offset-4" href="/predictions">/predictions</a>
          에서 가설 단계로 따로 공개합니다.
        </div>
      </article>
      <article className="panel p-6 text-slate-300">
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </section>
  );
}
