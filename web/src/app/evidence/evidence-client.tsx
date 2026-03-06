"use client";

import { useMemo, useState } from "react";
import type { ResultRow } from "@/lib/data";

type Props = {
  rows: ResultRow[];
};

type Winner = "SALT" | "STANDARD" | "TIE";

function winner(row: ResultRow): Winner {
  if (row.standard_error != null && row.salt_error != null) {
    const s = Math.abs(row.standard_error);
    const t = Math.abs(row.salt_error);
    if (t < s) return "SALT";
    if (s < t) return "STANDARD";
    return "TIE";
  }
  if (row.residual_score > 0) return "SALT";
  if (row.residual_score < 0) return "STANDARD";
  return "TIE";
}

function toPoints(values: number[], width: number, height: number): string {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1e-9);
  return values
    .map((v, i) => {
      const x = values.length === 1 ? width / 2 : (i / (values.length - 1)) * width;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function EvidenceClient({ rows }: Props) {
  const [predictionId, setPredictionId] = useState<string>("all");
  const [winnerFilter, setWinnerFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return rows
      .filter((r) => (predictionId === "all" ? true : r.prediction_id === predictionId))
      .filter((r) => (winnerFilter === "all" ? true : winner(r) === winnerFilter))
      .sort((a, b) => {
        const ta = a.event_time_utc ?? "";
        const tb = b.event_time_utc ?? "";
        return ta < tb ? -1 : 1;
      });
  }, [rows, predictionId, winnerFilter]);

  const predictionIds = useMemo(
    () => Array.from(new Set(rows.map((r) => r.prediction_id))).sort(),
    [rows],
  );

  const withActual = filtered.filter((r) => r.actual_value != null);
  const series = withActual.length ? withActual : filtered;
  const actualSeries = series.map((r) => r.actual_value ?? r.salt_fit);
  const standardSeries = series.map((r) => r.standard_fit);
  const saltSeries = series.map((r) => r.salt_fit);
  const lineWidth = 700;
  const lineHeight = 230;
  const actualPts = toPoints(actualSeries, lineWidth, lineHeight);
  const standardPts = toPoints(standardSeries, lineWidth, lineHeight);
  const saltPts = toPoints(saltSeries, lineWidth, lineHeight);

  const summary = useMemo(() => {
    const total = filtered.length;
    const saltWins = filtered.filter((r) => winner(r) === "SALT").length;
    const standardWins = filtered.filter((r) => winner(r) === "STANDARD").length;
    const ties = total - saltWins - standardWins;
    return { total, saltWins, standardWins, ties };
  }, [filtered]);

  return (
    <section className="space-y-6">
      <header className="panel p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Evidence</p>
        <h1 className="mt-2 text-2xl font-semibold">실측 vs 표준예측 vs SALT예측</h1>
        <p className="mt-2 text-sm text-slate-300">
          같은 이벤트에 대해 세 값을 동시에 표시하고, 절대오차 기준으로 승패를 판정합니다.
        </p>
      </header>

      <section className="panel grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">
          Prediction
          <select
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 p-2"
            value={predictionId}
            onChange={(e) => setPredictionId(e.target.value)}
          >
            <option value="all">All</option>
            {predictionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Winner
          <select
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 p-2"
            value={winnerFilter}
            onChange={(e) => setWinnerFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="SALT">SALT</option>
            <option value="STANDARD">STANDARD</option>
            <option value="TIE">TIE</option>
          </select>
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Events</p>
          <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">SALT Wins</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-300">{summary.saltWins}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Standard Wins</p>
          <p className="mt-2 text-2xl font-semibold text-rose-300">{summary.standardWins}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-slate-400">Actual Coverage</p>
          <p className="mt-2 text-2xl font-semibold">{withActual.length}/{filtered.length}</p>
        </article>
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-semibold">Triple-Line Comparison</h2>
        <div className="overflow-x-auto">
          <svg width={lineWidth} height={lineHeight} viewBox={`0 0 ${lineWidth} ${lineHeight}`}>
            <rect x="0" y="0" width={lineWidth} height={lineHeight} fill="#0b1324" />
            <polyline fill="none" stroke="#f8fafc" strokeWidth="2" points={actualPts} />
            <polyline fill="none" stroke="#fb7185" strokeWidth="2" points={standardPts} />
            <polyline fill="none" stroke="#22d3ee" strokeWidth="2" points={saltPts} />
          </svg>
        </div>
        <div className="mt-2 flex gap-3 text-xs text-slate-300">
          <span>Actual: white</span>
          <span>Standard: rose</span>
          <span>SALT: cyan</span>
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-semibold">Absolute Error by Event</h2>
        <div className="space-y-3">
          {filtered.map((r) => {
            const stdErr = Math.abs(
              r.standard_error ?? ((r.actual_value ?? r.salt_fit) - r.standard_fit),
            );
            const saltErr = Math.abs(
              r.salt_error ?? ((r.actual_value ?? r.salt_fit) - r.salt_fit),
            );
            const maxErr = Math.max(stdErr, saltErr, 1e-9);
            return (
              <div key={`${r.prediction_id}-${r.event_id}`}>
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>
                    {r.event_time_utc ?? "-"} / {r.event_id}
                  </span>
                  <span>{winner(r)}</span>
                </div>
                <div className="grid gap-1">
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-2 rounded bg-rose-400"
                      style={{ width: `${(stdErr / maxErr) * 100}%` }}
                    />
                  </div>
                  <div className="h-2 rounded bg-slate-800">
                    <div
                      className="h-2 rounded bg-cyan-400"
                      style={{ width: `${(saltErr / maxErr) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
