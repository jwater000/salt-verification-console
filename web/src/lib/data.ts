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
