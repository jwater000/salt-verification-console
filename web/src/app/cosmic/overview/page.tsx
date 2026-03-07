import Link from "next/link";
import { loadAllResults, loadAuditManifest } from "@/lib/data";

export default async function CosmicOverviewPage() {
  const rows = await loadAllResults();
  const audit = await loadAuditManifest();
  const withActual = rows.filter((r) => r.actual_value != null).length;

  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Cosmic Overview</p>
        <h1 className="mt-2 text-2xl font-semibold">거시(우주론) 검증 대시보드</h1>
        <p className="mt-2 text-sm text-slate-300">
          표준 기준은 LambdaCDM이며, 이벤트 비교는 `actual_value / standard_fit / salt_fit` 구조를 사용합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Result Rows</p>
          <p className="mt-2 text-2xl font-semibold">{rows.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Actual Coverage</p>
          <p className="mt-2 text-2xl font-semibold">
            {withActual}/{rows.length}
          </p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Evaluation Manifest</p>
          <p className="mt-2 text-sm">{audit.generated_at_utc || "missing"}</p>
        </article>
      </section>

      <section className="panel p-4 text-sm text-slate-300">
        <p>바로가기</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/cosmic/evidence" className="badge">
            Evidence
          </Link>
          <Link href="/cosmic/events" className="badge">
            Events
          </Link>
          <Link href="/cosmic/method" className="badge">
            Method
          </Link>
          <Link href="/cosmic/limits" className="badge">
            Limits
          </Link>
        </div>
      </section>
    </section>
  );
}
