import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { loadLiveSnapshot } from "@/lib/data";
import SiteStructureMap from "@/components/site-structure-map";

export const metadata: Metadata = {
  title: "SALT Verification Console",
  description: "Evidence-first comparison of standard cosmology (LambdaCDM) vs SALT on public data.",
};

function snapshotStatus(generatedAtUtc: string): { stale: boolean; label: string } {
  if (!generatedAtUtc) {
    return { stale: true, label: "snapshot missing" };
  }
  const ts = Date.parse(generatedAtUtc);
  if (Number.isNaN(ts)) {
    return { stale: true, label: `invalid snapshot timestamp (${generatedAtUtc})` };
  }
  const ageMs = Date.now() - ts;
  const ageMin = Math.floor(ageMs / 60000);
  if (ageMin > 120) {
    return { stale: true, label: `snapshot stale (${ageMin}m old, generated ${generatedAtUtc})` };
  }
  return { stale: false, label: `snapshot updated ${generatedAtUtc}` };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snapshot = await loadLiveSnapshot();
  const status = snapshotStatus(snapshot.generated_at_utc);

  return (
    <html lang="en">
      <body className="antialiased">
        <header className="border-b border-slate-800 bg-slate-950/95">
          <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4 text-sm text-slate-200">
            <Link href="/" className="font-semibold tracking-wide text-cyan-300">
              SALT Verification Console
            </Link>
            <Link href="/cosmic/overview">Cosmic (LambdaCDM)</Link>
            <Link href="/micro/overview">Micro (SM)</Link>
            <Link href="/audit">Audit</Link>
          </nav>
        </header>
        {status.stale ? (
          <div className="border-b border-amber-800 bg-amber-950/70 px-6 py-2 text-xs text-amber-200">
            <div className="mx-auto w-full max-w-6xl">
              Data update warning: {status.label}. Automated collection may be delayed.
            </div>
          </div>
        ) : (
          <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-1 text-xs text-slate-400">
            <div className="mx-auto w-full max-w-6xl">{status.label}</div>
          </div>
        )}
        <SiteStructureMap />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
