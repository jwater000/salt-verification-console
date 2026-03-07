import { loadAuditManifest } from "@/lib/data";

export default async function AuditDatasetsPage() {
  const manifest = await loadAuditManifest();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Datasets</h1>
      </header>
      <article className="panel p-5 text-sm text-slate-300">
        <p>generated_at_utc: {manifest.generated_at_utc || "missing"}</p>
        <p className="mt-2">dataset_version:</p>
        <ul className="mt-1 list-disc pl-5">
          {manifest.dataset_version.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
