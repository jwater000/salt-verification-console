import { promises as fs } from "node:fs";
import path from "node:path";

export type Prediction = {
  id: string;
  title: string;
  summary: string;
  status: string;
  datasets: string[];
  falsification: string;
};

export type Dataset = {
  id: string;
  title: string;
  source: string;
  updated_at: string;
  events: number;
};

export type ResultRow = {
  prediction_id: string;
  event_id: string;
  actual_value?: number | null;
  standard_fit: number;
  salt_fit: number;
  standard_error?: number | null;
  salt_error?: number | null;
  residual_score: number;
  flag: string;
  event_time_utc?: string;
};

export type LiveStream = {
  stream_id: string;
  label: string;
  provider: string;
  live_embed_url?: string;
  embed_url: string;
  recent_video_title?: string;
  source_url: string;
  status: string;
  last_checked_utc?: string | null;
};

export type LiveMetricWindow = {
  source_id: string;
  prediction_id: string;
  window_label: string;
  window_end_utc: string;
  mae: number | null;
  rmse: number | null;
  avg_delta_fit: number | null;
  sample_count: number;
};

export type LiveSnapshot = {
  generated_at_utc: string;
  streams: LiveStream[];
  recent_events: Array<
    ResultRow & {
      source_id: string;
      computed_at_utc: string;
    }
  >;
  recent_observations: Array<{
    source_id: string;
    event_id: string;
    event_time_utc: string | null;
    quality_flag: string;
  }>;
  metric_windows: LiveMetricWindow[];
};

export type MicroSource = {
  source_id: string;
  provider: string;
  dataset_ref: string;
  url: string;
  license?: string | null;
  version_tag: string;
  fetched_at_utc: string;
};

export type MicroObservation = {
  channel: string;
  observable_id: string;
  dataset_id: string;
  x_value?: number | null;
  measured_value: number;
  stat_err?: number | null;
  sys_err?: number | null;
  unit?: string | null;
  quality_flag: string;
  observed_at_utc?: string | null;
  source_url?: string | null;
};

export type MicroScore = {
  channel: string;
  observable_id: string;
  dataset_id: string;
  x_value?: number | null;
  total_err: number;
  res_sm: number;
  res_salt: number;
  pull_sm: number;
  pull_salt: number;
  winner: string;
  winner_tie: number;
  p_improve?: number | null;
  q_improve?: number | null;
  decision_rule_version: string;
  computed_at_utc: string;
};

export type MicroFitRun = {
  run_id: number;
  channel: string;
  fit_scope: string;
  params_json: string;
  n_obs: number;
  chi2_sm?: number | null;
  chi2_salt?: number | null;
  rmse_sm?: number | null;
  rmse_salt?: number | null;
  aic_sm?: number | null;
  aic_salt?: number | null;
  bic_sm?: number | null;
  bic_salt?: number | null;
  fdr_q?: number | null;
  verdict: string;
  computed_at_utc: string;
};

export type MicroSnapshot = {
  generated_at_utc: string;
  decision_rule_version: string;
  sources: MicroSource[];
  observations: MicroObservation[];
  scores: MicroScore[];
  fit_runs: MicroFitRun[];
};

export type AuditManifest = {
  generated_at_utc: string;
  formula_version: string[];
  dataset_version: string[];
  decision_rule_version: string;
  rerun_commands: string[];
};

const root = path.resolve(process.cwd(), "..");

async function readJson<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    const full = path.join(root, relativePath);
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadPredictions(): Promise<Prediction[]> {
  return readJson<Prediction[]>("data/processed/predictions.json", []);
}

export function loadDatasets(): Promise<Dataset[]> {
  return readJson<Dataset[]>("data/processed/datasets.json", []);
}

export function loadP1Results(): Promise<ResultRow[]> {
  return readJson<ResultRow[]>(
    "data/processed/results_p1-time-delay-redshift.json",
    [],
  );
}

export function loadLiveStreams(): Promise<LiveStream[]> {
  return readJson<LiveStream[]>("data/processed/live_streams.json", []);
}

export function loadLiveSnapshot(): Promise<LiveSnapshot> {
  return readJson<LiveSnapshot>("data/processed/live_snapshot.json", {
    generated_at_utc: "",
    streams: [],
    recent_events: [],
    recent_observations: [],
    metric_windows: [],
  });
}

export function loadMicroSnapshot(): Promise<MicroSnapshot> {
  return readJson<MicroSnapshot>("data/processed/micro_snapshot.json", {
    generated_at_utc: "",
    decision_rule_version: "",
    sources: [],
    observations: [],
    scores: [],
    fit_runs: [],
  });
}

export function loadAuditManifest(): Promise<AuditManifest> {
  return readJson<AuditManifest>("data/processed/audit_manifest.json", {
    generated_at_utc: "",
    formula_version: [],
    dataset_version: [],
    decision_rule_version: "",
    rerun_commands: [],
  });
}

export async function loadAllResults(): Promise<ResultRow[]> {
  const dir = path.join(root, "data/processed");
  try {
    const files = await fs.readdir(dir);
    const targets = files
      .filter((f) => f.startsWith("results_") && f.endsWith(".json"))
      .sort();
    const chunks = await Promise.all(
      targets.map((f) => readJson<ResultRow[]>(path.join("data/processed", f), [])),
    );
    return chunks.flat();
  } catch {
    return [];
  }
}

export async function loadBookIndexPath(): Promise<string> {
  const target = path.join(root, "docs/book/INDEX.md");
  try {
    await fs.access(target);
    return target;
  } catch {
    return "docs/book/INDEX.md (not found)";
  }
}
