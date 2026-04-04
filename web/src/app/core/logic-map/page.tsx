import Link from "next/link";
import { LOGIC_MAP_STAGES } from "@/lib/site-content";

export default function LogicMapPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-sky-500/20 bg-[linear-gradient(135deg,#071224_0%,#020617_65%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Core Logic Map</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          Problem에서 Verification까지
          <br />
          SALT의 논리 압축 지도
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          이 페이지는 책과 웹 전체를 관통하는 중간층이다. 무엇이 문제로 제기되고, 어떤 단서와
          개념을 거쳐, 어떤 해석으로 정리되며, 최종적으로 어떤 검증 채널로 넘어가는지를 한 번에
          보여준다.
        </p>
      </div>

      <div className="space-y-4">
        {LOGIC_MAP_STAGES.map((stage, index) => (
          <div key={stage.id} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/45 p-6 lg:grid-cols-[120px_minmax(0,1fr)]">
            <div className="flex items-start gap-3 lg:block">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sm font-bold text-sky-300">
                {stage.id}
              </div>
              <div className="lg:mt-4">
                <p className="text-lg font-bold text-white">{stage.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Stage {index + 1}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">{stage.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{stage.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stage.chapters.map((chapter) => (
                  <span
                    key={chapter}
                    className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                  >
                    Ch.{chapter}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {stage.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400/40 hover:text-white"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/core/chapters"
          className="rounded-2xl border border-violet-500/20 bg-slate-950/40 p-5 transition hover:border-violet-400/40"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Chapter Flow</p>
          <h2 className="mt-3 text-xl font-bold text-white">17 · 18 · 19장 연결 보기</h2>
          <p className="mt-2 text-sm text-slate-400">핵심 장 세 개만 따라가며 논리와 검증, 공학 브리지를 읽는다.</p>
        </Link>
        <Link
          href="/verification/channels"
          className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5 transition hover:border-cyan-400/40"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Verification</p>
          <h2 className="mt-3 text-xl font-bold text-white">고정 채널 인덱스</h2>
          <p className="mt-2 text-sm text-slate-400">세 고정 채널이 무엇을 시험하고 어떤 기준으로 기각되는지 바로 이동한다.</p>
        </Link>
        <Link
          href="/audit/reproduce"
          className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-5 transition hover:border-emerald-400/40"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Audit</p>
          <h2 className="mt-3 text-xl font-bold text-white">재현 경로 확인</h2>
          <p className="mt-2 text-sm text-slate-400">검증 흐름이 실제 실행과 provenance에 어떻게 연결되는지 본다.</p>
        </Link>
      </div>
    </section>
  );
}
