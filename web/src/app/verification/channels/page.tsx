import Link from "next/link";
import { VERIFICATION_CHANNELS } from "@/lib/site-content";

export default function VerificationChannelsPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-cyan-500/20 bg-[linear-gradient(135deg,#071828_0%,#020617_60%,#0f172a_100%)] px-8 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Verification Channels</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          고정 검증 채널 인덱스
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
          이 페이지는 현재 운영 중인 세 고정 채널을 한 번에 보는 허브다. 각 채널은 관측량,
          기준 모델, SALT 예측, 기각 조건이 데이터 보기 전에 잠긴 항목만 포함한다.
        </p>
      </div>

      <div className="space-y-4">
        {VERIFICATION_CHANNELS.map((channel) => (
          <Link
            key={channel.slug}
            href={channel.href}
            className="group block rounded-2xl border border-cyan-500/15 bg-slate-950/45 p-6 transition hover:border-cyan-400/35"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    {channel.tag}
                  </span>
                  <span className="badge-verified">LOCKED</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">{channel.title}</h2>
                <p className="text-sm text-slate-500">{channel.fullTitle}</p>
              </div>
              <span className="text-sm text-slate-500 group-hover:text-slate-300">상세 보기 →</span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">핵심 질문</p>
                <p className="mt-1 text-sm text-slate-200">{channel.what}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">기준 모델</p>
                <p className="mt-1 text-sm text-slate-300">{channel.baseline}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">SALT 예측</p>
                <p className="mt-1 text-sm text-slate-300">{channel.saltPrediction}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">기각 조건</p>
                <p className="mt-1 text-sm text-rose-300/90">{channel.falsification}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {channel.datasets.map((dataset) => (
                <span
                  key={dataset}
                  className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                >
                  {dataset}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
