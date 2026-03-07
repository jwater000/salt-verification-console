import Link from "next/link";
import { loadMicroSnapshot } from "@/lib/data";

export default async function MicroOverviewPage() {
  const snapshot = await loadMicroSnapshot();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Micro Overview</p>
        <h1 className="mt-2 text-2xl font-semibold">미시(입자물리) 검증 트랙</h1>
        <p className="mt-2 text-sm text-slate-300">
          현재 상태: <span className="badge">검증대기</span> (예측식 잠금 전)
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Sources</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.sources.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Observations</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.observations.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Scores</p>
          <p className="mt-2 text-2xl font-semibold">{snapshot.scores.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Generated</p>
          <p className="mt-2 text-xs">{snapshot.generated_at_utc || "missing"}</p>
        </article>
      </section>

      <section className="panel p-4 text-sm text-slate-300">
        <p>채널: muon_g_minus_2 / neutrino_oscillation / collider_high_pt_tail</p>
        <p className="mt-2">기준 이론: SM</p>
        <p className="mt-1">Decision Rule: {snapshot.decision_rule_version || "-"}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/micro/channels/muon-g2" className="badge">
            muon-g2
          </Link>
          <Link href="/micro/channels/neutrino-oscillation" className="badge">
            neutrino
          </Link>
          <Link href="/micro/channels/collider-high-pt-tail" className="badge">
            collider
          </Link>
        </div>
      </section>
    </section>
  );
}
