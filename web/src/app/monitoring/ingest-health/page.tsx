import { loadLiveSnapshot } from "@/lib/data";

export default async function MonitoringIngestHealthPage() {
  const snapshot = await loadLiveSnapshot();
  const liveSourceIds = Array.from(new Set(snapshot.recent_observations.map((x) => x.source_id))).sort();
  const streamStatuses = snapshot.streams.map((s) => `${s.stream_id}:${s.status}`).join(", ");
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Monitoring / Ingest Health</p>
        <h1 className="mt-2 text-2xl font-semibold">수집 상태 점검</h1>
      </header>

      <article className="panel p-5 text-sm text-slate-300">
        <p>snapshot_generated_at: {snapshot.generated_at_utc || "missing"}</p>
        <p className="mt-2">live_observation_sources: {liveSourceIds.join(", ") || "-"}</p>
        <p className="mt-1">recent_observations: {snapshot.recent_observations.length}</p>
        <p className="mt-1">recent_events: {snapshot.recent_events.length}</p>
        <p className="mt-1">metric_windows: {snapshot.metric_windows.length}</p>
        <p className="mt-2">reference_channel_status: {streamStatuses || "-"}</p>
      </article>

      <article className="panel p-5 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">분리 정책</p>
        <ul className="mt-2 list-disc pl-5">
          <li>평가(Evaluation): frozen dataset만 사용</li>
          <li>모니터링(Monitoring): 실시간 피드 후속 점검 전용</li>
          <li>Audit: 버전/재현성 추적</li>
        </ul>
      </article>
    </section>
  );
}
