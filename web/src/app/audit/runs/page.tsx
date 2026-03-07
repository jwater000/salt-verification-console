import { loadLiveSnapshot } from "@/lib/data";
import { loadMicroSnapshot } from "@/lib/data";

export default async function AuditRunsPage() {
  const snapshot = await loadLiveSnapshot();
  const micro = await loadMicroSnapshot();
  return (
    <section className="space-y-6">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Runs</h1>
      </header>
      <article className="panel p-5 text-sm text-slate-300">
        <p>generated_at_utc: {snapshot.generated_at_utc || "missing"}</p>
        <p className="mt-2">
          최근 observations: {snapshot.recent_observations.length}, metric windows: {snapshot.metric_windows.length}
        </p>
      </article>
      <div className="panel overflow-x-auto p-4">
        <p className="mb-3 text-sm text-slate-300">Micro Fit Runs</p>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">channel</th>
              <th className="py-2">n_obs</th>
              <th className="py-2">fdr_q</th>
              <th className="py-2">verdict</th>
              <th className="py-2">reason</th>
              <th className="py-2">computed_at_utc</th>
            </tr>
          </thead>
          <tbody>
            {micro.fit_runs.map((run) => (
              <tr key={run.run_id} className="border-t border-slate-800">
                <td className="py-2">{run.channel}</td>
                <td className="py-2">{run.n_obs}</td>
                <td className="py-2">{run.fdr_q?.toFixed(4) ?? "-"}</td>
                <td className="py-2">{run.verdict}</td>
                <td className="py-2">{run.verdict_reason ?? "-"}</td>
                <td className="py-2">{run.computed_at_utc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
