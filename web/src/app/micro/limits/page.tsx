import { loadMicroSnapshot } from "@/lib/data";

export default async function MicroLimitsPage() {
  const snapshot = await loadMicroSnapshot();
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Limits</p>
        <h1 className="mt-2 text-2xl font-semibold">채널별 기각/보류 규칙</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>기각 규칙: 단일 파라미터 세트로 독립 3개 이상 데이터셋 동시 적합 실패 시 채널 기각</p>
        <p className="mt-2">현재는 운영잠금 기준으로 통계 재현을 우선 평가합니다.</p>
      </article>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">channel</th>
              <th className="py-2">n_obs</th>
              <th className="py-2">rmse_sm</th>
              <th className="py-2">rmse_salt</th>
              <th className="py-2">fdr_q</th>
              <th className="py-2">verdict</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.fit_runs.map((r) => (
              <tr key={r.run_id} className="border-t border-slate-800">
                <td className="py-2">{r.channel}</td>
                <td className="py-2">{r.n_obs}</td>
                <td className="py-2">{r.rmse_sm?.toFixed(6) ?? "-"}</td>
                <td className="py-2">{r.rmse_salt?.toFixed(6) ?? "-"}</td>
                <td className="py-2">{r.fdr_q?.toFixed(4) ?? "-"}</td>
                <td className="py-2">{r.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
