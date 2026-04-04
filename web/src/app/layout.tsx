import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./markdown.css";
import { loadFrozenManifest } from "@/lib/data";
import { isAuthConfigured } from "@/lib/auth/config";
import SiteStructureMap from "@/components/site-structure-map";

export const metadata: Metadata = {
  title: "물리학에 시공간은 없다 · 안내 사이트",
  description:
    "도서 '물리학에 시공간은 없다'의 주요 내용, 검증 자료, 참고 도해, 재현 경로를 차분하게 정리한 안내 사이트.",
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
        {/* Frozen dataset micro-bar */}
        <div className="border-b border-slate-800/60 bg-slate-950/80 px-6 py-1 text-[11px] text-slate-500">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <span>
              frozen dataset: <span className="font-mono text-slate-400">{frozen.dataset_version || "—"}</span>
              {" / "}
              <span className="font-mono text-slate-400">{frozen.created_at_utc || "—"}</span>
            </span>
            <Link href="/notice" className="text-amber-400/80 hover:text-amber-300">
              공지 보기
            </Link>
          </div>
        </div>
        <SiteStructureMap authConfigured={isAuthConfigured()} />
        <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
