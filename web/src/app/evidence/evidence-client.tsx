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
  if (row.actual_value != null) {
    const s = Math.abs(row.actual_value - row.standard_fit);
    const t = Math.abs(row.actual_value - row.salt_fit);
    if (t < s) return "SALT";
    if (s < t) return "STANDARD";
    return "TIE";
  }
  if (row.residual_score > 0) return "SALT";
  if (row.residual_score < 0) return "STANDARD";
  return "TIE";
}

function toPoints(values: number[], width: number, height: number, min: number, max: number): string {
  if (!values.length) return "";
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
  const allForScale = [...actualSeries, ...standardSeries, ...saltSeries];
  const yMin = allForScale.length ? Math.min(...allForScale) : 0;
  const yMax = allForScale.length ? Math.max(...allForScale) : 1;
  const actualPts = toPoints(actualSeries, lineWidth, lineHeight, yMin, yMax);
  const standardPts = toPoints(standardSeries, lineWidth, lineHeight, yMin, yMax);
  const saltPts = toPoints(saltSeries, lineWidth, lineHeight, yMin, yMax);

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
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">근거 분석</p>
        <h2 className="mt-2 text-2xl font-semibold">실측 vs 표준우주론(ΛCDM) 예측 vs SALT 예측</h2>
        <p className="mt-2 text-sm text-slate-300">
          같은 이벤트에 대해 세 값을 동시에 표시하고, 절대오차 기준으로 승패를 판정합니다.
        </p>
      </header>

      <section className="panel grid gap-3 p-4 md:grid-cols-2">
        <label className="text-sm">
          예측 항목
          <select
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 p-2"
            value={predictionId}
            onChange={(e) => setPredictionId(e.target.value)}
          >
            <option value="all">전체</option>
            {predictionIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          판정 필터
          <select
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 p-2"
            value={winnerFilter}
            onChange={(e) => setWinnerFilter(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="SALT">SALT</option>
            <option value="STANDARD">ΛCDM</option>
            <option value="TIE">동률</option>
          </select>
        </label>
      </section>

      <section className="panel p-4 text-sm">
        <h3 className="mb-2 text-base font-semibold text-slate-100">요약 지표</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs text-slate-400">
                <th className="py-2 pr-3 font-medium">이벤트 수</th>
                <th className="py-2 pr-3 font-medium">SALT 승</th>
                <th className="py-2 pr-3 font-medium">ΛCDM 승</th>
                <th className="py-2 pr-3 font-medium">실측 포함 비율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm text-slate-200">
                <td className="py-2 pr-3">{summary.total}</td>
                <td className="py-2 pr-3 text-cyan-300">{summary.saltWins}</td>
                <td className="py-2 pr-3 text-rose-300">{summary.standardWins}</td>
                <td className="py-2 pr-3">{withActual.length}/{filtered.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-semibold">삼중 선 비교</h2>
        <p className="mb-2 text-xs text-slate-400">
          동일 y축 스케일로 표시합니다 (시리즈별 개별 정규화 미사용).
        </p>
        <div className="overflow-x-auto">
          <svg width={lineWidth} height={lineHeight} viewBox={`0 0 ${lineWidth} ${lineHeight}`}>
            <rect x="0" y="0" width={lineWidth} height={lineHeight} fill="#0b1324" />
            <polyline fill="none" stroke="#f8fafc" strokeWidth="2" points={actualPts} />
            <polyline fill="none" stroke="#fb7185" strokeWidth="2" points={standardPts} />
            <polyline fill="none" stroke="#22d3ee" strokeWidth="2" points={saltPts} />
          </svg>
        </div>
        <div className="mt-2 flex gap-3 text-xs text-slate-300">
          <span>실측값: 흰색</span>
          <span>ΛCDM: 분홍</span>
          <span>SALT: 청록</span>
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="mb-3 text-lg font-semibold">이벤트별 절대 오차</h2>
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
                  <span>{winner(r) === "STANDARD" ? "ΛCDM" : winner(r)}</span>
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
