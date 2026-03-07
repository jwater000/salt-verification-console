import Link from "next/link";

const SECTIONS = [
  { href: "/audit/sources", label: "Sources" },
  { href: "/audit/datasets", label: "Datasets" },
  { href: "/audit/formulas", label: "Formulas" },
  { href: "/audit/runs", label: "Runs" },
  { href: "/audit/reproduce", label: "Reproduce" },
];

export default function AuditPage() {
  return (
    <section className="space-y-4">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Audit</p>
        <h1 className="mt-2 text-2xl font-semibold">출처/버전/재현성 추적</h1>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="panel p-4 text-sm hover:border-cyan-700">
            {section.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
