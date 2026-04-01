"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    path: "/guide",
    label: "Guide",
    desc: "읽기 순서 안내",
  },
  {
    path: "/core",
    label: "Core Ideas",
    desc: "주요 개념 정리",
  },
  {
    path: "/verification",
    label: "Verification",
    desc: "검증 자료와 판정",
  },
  {
    path: "/engineering",
    label: "Engineering",
    desc: "기술적 해석 정리",
  },
  {
    path: "/reference",
    label: "Reference",
    desc: "도해 · 용어 · FAQ",
  },
  {
    path: "/audit",
    label: "Audit",
    desc: "재현 경로와 데이터",
  },
];

export default function SiteStructureMap() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Top bar */}
        <div className="flex h-12 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-100 hover:text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300">
              S
            </span>
            <span>물리학에 시공간은 없다</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.path || pathname.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-md px-3 py-1.5 text-sm transition-all duration-150 ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Breadcrumb path */}
          <span className="hidden text-xs text-slate-500 lg:block">{pathname}</span>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto pb-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.path || pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-all duration-150 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
