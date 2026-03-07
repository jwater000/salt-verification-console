import Link from "next/link";

type Domain = "cosmic" | "micro";

const LABELS: Record<Domain, string> = {
  cosmic: "Cosmic (LambdaCDM)",
  micro: "Micro (SM)",
};

export default function DomainSubnav({ domain }: { domain: Domain }) {
  const base = `/${domain}`;
  return (
    <section className="mb-6 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{LABELS[domain]}</p>
      <nav className="flex flex-wrap gap-2 text-sm">
        <Link className="badge" href={`${base}/overview`}>
          Overview
        </Link>
        <Link className="badge" href={`${base}/evidence`}>
          Evidence
        </Link>
        <Link className="badge" href={`${base}/events`}>
          Events
        </Link>
        <Link className="badge" href={`${base}/method`}>
          Method
        </Link>
        <Link className="badge" href={`${base}/limits`}>
          Limits
        </Link>
        <Link className="badge" href={`${base}/channels`}>
          Channels
        </Link>
      </nav>
    </section>
  );
}
