import { loadLiveSnapshot } from "@/lib/data";

export default async function MonitoringLivePage() {
  const snapshot = await loadLiveSnapshot();
  const gracedb = snapshot.recent_observations.filter((row) => row.source_id === "gracedb");
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Monitoring / Live Feed</p>
        <h1 className="mt-2 text-2xl font-semibold">GraceDB 실시간 관측 목록</h1>
        <p className="mt-2 text-sm text-slate-300">
          이 페이지는 실시간 관측 모니터링용이며, 모델 우열 판정은 Evaluation 경로에서 수행합니다.
        </p>
      </header>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">source_id</th>
              <th className="py-2">event_id</th>
              <th className="py-2">event_time_utc</th>
              <th className="py-2">quality</th>
            </tr>
          </thead>
          <tbody>
            {gracedb.map((r) => (
              <tr key={`${r.source_id}-${r.event_id}`} className="border-t border-slate-800">
                <td className="py-2">{r.source_id}</td>
                <td className="py-2">{r.event_id}</td>
                <td className="py-2">{r.event_time_utc ?? "-"}</td>
                <td className="py-2">{r.quality_flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
