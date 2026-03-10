import type { Metadata } from "next";
import "./globals.css";
import "./markdown.css";
import { loadFrozenManifest } from "@/lib/data";
import SiteStructureMap from "@/components/site-structure-map";

export const metadata: Metadata = {
  title: "SALT 검증 리포트",
  description: "SALT vs standard-theory prediction validation with public data, formulas, and reproducible runs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const frozen = await loadFrozenManifest();

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-1 text-xs text-slate-400">
          <div className="mx-auto w-full max-w-6xl">
            frozen dataset: {frozen.dataset_version || "missing"} / generated_at: {frozen.created_at_utc || "missing"}
          </div>
        </div>
        <SiteStructureMap />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
