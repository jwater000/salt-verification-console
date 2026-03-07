import Link from "next/link";
import { loadAllResults } from "@/lib/data";

function winner(row: {
  residual_score: number;
  standard_error?: number | null;
  salt_error?: number | null;
}): "SALT" | "STANDARD" | "TIE" {
  if (row.standard_error != null && row.salt_error != null) {
    const s = Math.abs(row.standard_error);
    const t = Math.abs(row.salt_error);
    if (t < s) return "SALT";
    if (s < t) return "STANDARD";
    return "TIE";
  }
  if (row.residual_score > 0) return "SALT";
  if (row.residual_score < 0) return "STANDARD";
  return "TIE";
}

export default async function Home() {
  const rows = await loadAllResults();
  const total = rows.length;
  const saltWins = rows.filter((r) => winner(r) === "SALT").length;
  const standardWins = rows.filter((r) => winner(r) === "STANDARD").length;
  const ties = total - saltWins - standardWins;
  const saltWinRate = total ? (saltWins / total) * 100 : 0;

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Evidence-first Verification</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          평가(Evaluation)와 운영 모니터링(Monitoring)을 분리해 SALT 검증을 운영합니다.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          평가 페이지는 고정 데이터셋(frozen dataset)으로 재현 가능한 비교 결과를 제공하고, 모니터링 페이지는
          GraceDB 실시간 피드를 후속검증용으로 분리 제공합니다.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/evaluation" className="badge">
            Evaluation
          </Link>
          <Link href="/monitoring" className="badge">
            Monitoring
          </Link>
          <Link href="/audit" className="badge">
            Audit 보기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Total Events</h2>
          <p className="mt-2 text-3xl font-semibold">{total}</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">SALT Win Rate</h2>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">{saltWinRate.toFixed(1)}%</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400">Outcome Split</h2>
          <p className="mt-2 text-sm text-slate-300">
            SALT 우세 {saltWins} / 표준우주론(ΛCDM) 우세 {standardWins} / 동률 {ties}
          </p>
        </article>
      </section>

      <section className="panel p-5 text-sm text-slate-300">
        <p>핵심 해석: 이 조건에서 SALT 우세 비율은 {saltWinRate.toFixed(1)}%입니다.</p>
        <p className="mt-2 text-slate-400">
          주의: 위 집계는 평가용 결과 파일 기준입니다. 실시간 모니터링 피드는 별도 경로에서 조회됩니다.
        </p>
      </section>
    </div>
  );
}
