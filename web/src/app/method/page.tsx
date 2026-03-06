export default function MethodPage() {
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Method</p>
        <h1 className="mt-2 text-2xl font-semibold">검증 규칙과 판정 기준</h1>
        <p className="mt-2 text-sm text-slate-300">
          이 사이트는 설명보다 판정 가능성을 우선합니다. 동일 이벤트에 대해 표준모형과 SALT를 동시에 계산하고,
          동일 지표로 비교합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel p-5 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-slate-100">Pipeline</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>공개 이벤트/API 수집 (`GWOSC`, `GraceDB`, `GCN`, `ZTF(IRSA)`, `HEASARC`)</li>
            <li>시간축/단위 정규화</li>
            <li>표준 예측값(`standard_fit`) 계산</li>
            <li>SALT 예측값(`salt_fit`) 계산</li>
            <li>실측값(`actual_value`) 기준 오차 비교 및 winner 판정</li>
          </ol>
        </article>

        <article className="panel p-5 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-slate-100">Metrics</h2>
          <p className="mt-2">- `standard_error = actual_value - standard_fit`</p>
          <p>- `salt_error = actual_value - salt_fit`</p>
          <p>- `winner = argmin(|standard_error|, |salt_error|)`</p>
          <p className="mt-2">집계 지표: `MAE`, `RMSE`, `avg_delta_fit`</p>
          <p className="mt-2">통계 기준: `alpha=0.05`, `FDR(BH) q=0.10`, 효과크기 기준 병행</p>
        </article>
      </section>

      <article className="panel p-5 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-100">Reproducibility</h2>
        <p className="mt-2">재현 명령:</p>
        <p className="mt-1">
          <code>.venv/bin/python tools/realtime/run_realtime_cycle.py</code>
        </p>
        <p className="mt-2">
          참조 문서: <code>docs/protocols/blind_protocol.md</code>,{" "}
          <code>docs/protocols/stats_protocol.md</code>, <code>docs/method/data_contract.md</code>
        </p>
      </article>
    </section>
  );
}
