"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGE_INDEX, SITE_PAGES, type SitePage } from "@/lib/page-map";

function edgeLabel(from: SitePage["path"], to: SitePage["path"]) {
  if (to === "/method") return "규칙 고정";
  if (to === "/events") return "원자료 조회";
  if (to === "/evidence") return "정량 비교";
  if (to === "/limits") return "반증/한계";
  return `${from} -> ${to}`;
}

const FLOW_ORDER: SitePage["path"][] = ["/", "/method", "/events", "/evidence", "/limits"];

export default function SiteStructureMap() {
  const pathname = usePathname();
  const current = (pathname in PAGE_INDEX ? pathname : "/") as SitePage["path"];

  return (
    <section className="border-b border-slate-800 bg-slate-950/85 px-6 py-3">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Site Structure / Chapter Mapping
          </p>
          <p className="text-xs text-cyan-300">
            현재 페이지: {PAGE_INDEX[current].title} · {PAGE_INDEX[current].chapters.join(", ")}
          </p>
        </div>
        <p className="mb-2 text-[11px] text-slate-400">
          표준이론 범위: 미시(입자물리) Standard Model(SM), 거시(우주론) standard cosmology(ΛCDM). 현재
          웹 페이지의 Standard는 모두 ΛCDM을 의미합니다.
        </p>

        <div className="hidden items-center gap-2 md:flex">
          {FLOW_ORDER.map((path, i) => {
            const page = PAGE_INDEX[path];
            const active = page.path === current;
            return (
              <div key={page.path} className="flex min-w-0 flex-1 items-center gap-2">
                <Link
                  href={page.path}
                  className={`block flex-1 rounded-lg border p-3 text-xs transition ${
                    active
                      ? "border-cyan-500 bg-cyan-950/40"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <p className="font-semibold text-slate-100">{page.title}</p>
                  <p className="mt-1 text-slate-400">{page.subtitle}</p>
                  <p className="mt-2 text-[11px] text-cyan-200">책 매핑: {page.chapters.join(", ")}</p>
                </Link>
                {i < FLOW_ORDER.length - 1 ? (
                  <div className="shrink-0 text-slate-500" aria-hidden="true">
                    <svg viewBox="0 0 60 20" className="h-5 w-12">
                      <line x1="2" y1="10" x2="52" y2="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M52 10 L46 6 M52 10 L46 14" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="grid gap-2 md:hidden">
          {FLOW_ORDER.map((path, i) => {
            const page = PAGE_INDEX[path];
            const active = page.path === current;
            return (
              <div key={page.path}>
                <Link
                  href={page.path}
                  className={`block rounded-lg border p-3 text-xs transition ${
                    active
                      ? "border-cyan-500 bg-cyan-950/40"
                      : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
                  }`}
                >
                  <p className="font-semibold text-slate-100">{page.title}</p>
                  <p className="mt-1 text-slate-400">{page.subtitle}</p>
                  <p className="mt-2 text-[11px] text-cyan-200">책 매핑: {page.chapters.join(", ")}</p>
                </Link>
                {i < FLOW_ORDER.length - 1 ? (
                  <p className="py-1 text-center text-xs text-slate-500" aria-hidden="true">
                    ↓
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-2 grid gap-1 text-[11px] text-slate-400 md:grid-cols-2">
          {SITE_PAGES.flatMap((to) =>
            to.dependsOn.map((from) => (
              <p key={`${from}-${to.path}`}>
                {PAGE_INDEX[from].title} → {to.title}: {edgeLabel(from, to.path)}
              </p>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
