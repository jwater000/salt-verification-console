import Link from "next/link";
import { loadLiveSnapshot } from "@/lib/data";

const SECTIONS = [
  { href: "/monitoring/live", label: "Live Feed", desc: "GraceDB 실시간 관측 목록" },
  { href: "/monitoring/followup", label: "Follow-up Queue", desc: "후속 검증 대기 이벤트" },
  { href: "/monitoring/ingest-health", label: "Ingest Health", desc: "수집 상태/지연 점검" },
];

export default async function MonitoringPage() {
  const snapshot = await loadLiveSnapshot();
  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Monitoring</p>
        <h1 className="mt-2 text-2xl font-semibold">실시간 모니터링(후속검증 전용)</h1>
        <p className="mt-2 text-sm text-slate-300">
          Monitoring은 실시간 소스 상태와 이벤트 흐름을 보여주며, 최종 비교 판정은 Evaluation에서 수행합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Recent Observations</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.recent_observations.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Recent Events</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.recent_events.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Snapshot Generated</p>
          <p className="mt-2 text-xs">{snapshot.generated_at_utc || "missing"}</p>
        </article>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="panel p-4 text-sm hover:border-cyan-700">
            <p className="font-semibold text-slate-100">{section.label}</p>
            <p className="mt-1 text-slate-400">{section.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
