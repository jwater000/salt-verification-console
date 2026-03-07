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

export default async function CosmicLimitsPage() {
  const rows = await loadAllResults();
  const standardBetter = rows.filter((r) => winner(r) === "STANDARD");
  const saltBetter = rows.filter((r) => winner(r) === "SALT");
  const ties = rows.filter((r) => winner(r) === "TIE");

  return (
    <section className="space-y-5">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Cosmic Limits</p>
        <h1 className="mt-2 text-2xl font-semibold">표준 우세/동률/실패 공개</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">LambdaCDM Wins</p>
          <p className="mt-2 text-2xl font-semibold text-rose-300">{standardBetter.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">SALT Wins</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-300">{saltBetter.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Ties</p>
          <p className="mt-2 text-2xl font-semibold">{ties.length}</p>
        </article>
      </section>
    </section>
  );
}
