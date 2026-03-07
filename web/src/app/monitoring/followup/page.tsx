import { loadLiveSnapshot } from "@/lib/data";

export default async function MonitoringFollowupPage() {
  const snapshot = await loadLiveSnapshot();
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Monitoring / Follow-up</p>
        <h1 className="mt-2 text-2xl font-semibold">후속 검증 대기열</h1>
        <p className="mt-2 text-sm text-slate-300">
          실시간 피드에서 수집된 이벤트는 대기열로 관리하고, 평가용 고정 데이터셋 반영 시점에 별도 심사합니다.
        </p>
      </header>

      <div className="panel overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2">prediction_id</th>
              <th className="py-2">source_id</th>
              <th className="py-2">event_id</th>
              <th className="py-2">event_time_utc</th>
              <th className="py-2">flag</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.recent_events.map((e) => (
              <tr key={`${e.source_id}-${e.prediction_id}-${e.event_id}`} className="border-t border-slate-800">
                <td className="py-2">{e.prediction_id}</td>
                <td className="py-2">{e.source_id}</td>
                <td className="py-2">{e.event_id}</td>
                <td className="py-2">{e.event_time_utc ?? "-"}</td>
                <td className="py-2">{e.flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
