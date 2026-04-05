import Link from "next/link";
import { LOGIC_MAP_STAGES } from "@/lib/site-content";

export default function LogicMapPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-sky-500/20 bg-[linear-gradient(135deg,#071224_0%,#020617_65%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Core Logic Map</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          SALT가 어떤 장면 전환을 거쳐
          <br />
          하나의 설명으로 모여 가는가
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300">
          SALT는 처음부터 완성된 답으로 등장하지 않는다. 설명이 끊겨 보이는 순간에서 출발해, 단서를
          모으고, 개념을 세우고, 하나의 해석으로 모인 뒤, 결국 시험 가능한 주장으로 내려온다. 이 페이지는
          그 전환의 흐름을 한눈에 보여 준다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            문제 장면
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            개념 전환
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
            검증으로의 브리지
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <h2 className="text-sm font-semibold text-white">이 지도를 읽는 감각</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-slate-100">1. 무엇이 끊겨 보이는가</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              기존 물리가 왜 여러 조각으로 흩어져 보이는지 먼저 본다.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-slate-100">2. 무엇으로 다시 묶는가</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              SALT가 어떤 언어로 그 조각들을 다시 엮는지 본다.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-slate-100">3. 왜 검증으로 넘어가는가</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              설명이 어디에서 예측으로 바뀌는지 경계를 느끼며 읽는다.
            </p>
          </div>
        </div>
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
          <p className="mt-2 text-sm text-slate-400">핵심 장 세 개만 따라가며 개념, 검증, 기술적 상상이 어떻게 이어지는지 본다.</p>
        </Link>
        <Link
          href="/verification/channels"
          className="rounded-2xl border border-cyan-500/20 bg-slate-950/40 p-5 transition hover:border-cyan-400/40"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Verification</p>
          <h2 className="mt-3 text-xl font-bold text-white">고정 채널 인덱스</h2>
          <p className="mt-2 text-sm text-slate-400">세 고정 채널이 무엇을 시험하고 왜 중요한지 바로 이어서 볼 수 있다.</p>
        </Link>
        <Link
          href="/audit/reproduce"
          className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-5 transition hover:border-emerald-400/40"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Audit</p>
          <h2 className="mt-3 text-xl font-bold text-white">재현 경로 확인</h2>
          <p className="mt-2 text-sm text-slate-400">이 설명이 실제 데이터와 실행 기록으로 어떻게 이어지는지 추적한다.</p>
        </Link>
      </div>
    </section>
  );
}
