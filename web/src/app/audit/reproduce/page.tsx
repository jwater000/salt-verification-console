import { loadAuditManifest } from "@/lib/data";

export default async function AuditReproducePage() {
  const manifest = await loadAuditManifest();
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <h1 className="text-2xl font-semibold">Audit / Reproduce</h1>
      </header>
      <article className="panel p-5 text-sm text-slate-300">
        <p>rerun commands:</p>
        <ul className="mt-2 list-disc pl-5">
          {manifest.rerun_commands.map((cmd) => (
            <li key={cmd}>
              <code>{cmd}</code>
            </li>
          ))}
        </ul>
        <p className="mt-2">artifact hash, 실행 환경, lock file hash를 이 페이지에 연결합니다.</p>
      </article>
    </section>
  );
}
