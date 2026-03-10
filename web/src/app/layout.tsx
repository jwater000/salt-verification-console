import type { Metadata } from "next";
import Link from "next/link";
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
        <div className="border-b border-amber-500/30 bg-amber-950/50 px-6 py-2 text-sm text-amber-100">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <p>
              공지: 2026-03-10 기준으로 사이트 구조와 검증/예측/재현 경로를 정리했습니다.
            </p>
            <Link href="/notice" className="font-semibold text-amber-200 underline underline-offset-4">
              공지 전문 보기
            </Link>
          </div>
        </div>
        <SiteStructureMap />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
