import { loadAuditManifest } from "@/lib/data";

export default async function AuditFormulasPage() {
  const manifest = await loadAuditManifest();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Formulas</h1>
      </header>
      <article className="panel p-5 text-sm text-slate-300">
        <p>decision_rule_version: {manifest.decision_rule_version || "-"}</p>
        <p className="mt-2">formula_version:</p>
        <ul className="mt-1 list-disc pl-5">
          {manifest.formula_version.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
