-- Realtime validation schema for SALT Verification Console (SQLite compatible)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stream_sources (
  stream_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  provider TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unknown',
  last_checked_utc TEXT,
  created_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS stream_status_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stream_id TEXT NOT NULL,
  status TEXT NOT NULL,
  checked_at_utc TEXT NOT NULL,
  note TEXT,
  FOREIGN KEY (stream_id) REFERENCES stream_sources(stream_id)
);

CREATE TABLE IF NOT EXISTS events_raw (
  raw_id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL,
  external_event_id TEXT NOT NULL,
  observed_at_utc TEXT,
  ingested_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  payload_json TEXT NOT NULL,
  UNIQUE(source_id, external_event_id)
);

CREATE TABLE IF NOT EXISTS events_normalized (
  event_pk INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_time_utc TEXT,
  feature_vector_json TEXT,
  quality_flag TEXT NOT NULL DEFAULT 'unknown',
  UNIQUE(source_id, event_id)
);

CREATE TABLE IF NOT EXISTS model_scores (
  score_id INTEGER PRIMARY KEY AUTOINCREMENT,
  prediction_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_time_utc TEXT,
  actual_value REAL,
  standard_fit REAL NOT NULL,
  salt_fit REAL NOT NULL,
  standard_error REAL,
  salt_error REAL,
  residual_score REAL NOT NULL,
  flag TEXT NOT NULL,
  computed_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE(prediction_id, source_id, event_id)
);

CREATE TABLE IF NOT EXISTS metric_windows (
  metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL,
  prediction_id TEXT NOT NULL,
  window_label TEXT NOT NULL, -- 5m, 1h, 1d
  window_end_utc TEXT NOT NULL,
  mae REAL,
  rmse REAL,
  avg_delta_fit REAL,
  sample_count INTEGER NOT NULL DEFAULT 0,
  created_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_model_scores_time
  ON model_scores(event_time_utc);

CREATE INDEX IF NOT EXISTS idx_model_scores_prediction
  ON model_scores(prediction_id);

CREATE INDEX IF NOT EXISTS idx_metric_windows_key
  ON metric_windows(source_id, prediction_id, window_label, window_end_utc);
