-- Micro validation schema for SALT Verification Console (SQLite compatible)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS micro_sources (
  source_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  dataset_ref TEXT NOT NULL,
  url TEXT NOT NULL,
  license TEXT,
  version_tag TEXT NOT NULL,
  fetched_at_utc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS micro_observations (
  obs_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  observable_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  x_value REAL,
  measured_value REAL NOT NULL,
  stat_err REAL,
  sys_err REAL,
  cov_group TEXT,
  unit TEXT,
  observed_at_utc TEXT,
  ingested_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  quality_flag TEXT NOT NULL DEFAULT 'unknown',
  source_url TEXT,
  UNIQUE(observable_id, dataset_id, x_value)
);

CREATE TABLE IF NOT EXISTS micro_sm_predictions (
  pred_id INTEGER PRIMARY KEY AUTOINCREMENT,
  observable_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  x_value REAL,
  sm_pred REAL NOT NULL,
  sm_pred_err REAL,
  sm_model_ref TEXT,
  UNIQUE(observable_id, dataset_id, x_value)
);

CREATE TABLE IF NOT EXISTS micro_salt_predictions (
  salt_pred_id INTEGER PRIMARY KEY AUTOINCREMENT,
  observable_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  x_value REAL,
  salt_pred REAL NOT NULL,
  alpha_micro REAL,
  beta_micro REAL,
  gamma_micro REAL,
  formula_version TEXT NOT NULL,
  UNIQUE(observable_id, dataset_id, x_value)
);

CREATE TABLE IF NOT EXISTS micro_scores (
  score_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  observable_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  x_value REAL,
  total_err REAL,
  res_sm REAL,
  res_salt REAL,
  pull_sm REAL,
  pull_salt REAL,
  winner TEXT NOT NULL,
  winner_tie INTEGER NOT NULL DEFAULT 0,
  p_improve REAL,
  q_improve REAL,
  decision_rule_version TEXT NOT NULL,
  computed_at_utc TEXT NOT NULL,
  UNIQUE(observable_id, dataset_id, x_value)
);

CREATE TABLE IF NOT EXISTS micro_fit_runs (
  run_id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  fit_scope TEXT NOT NULL,
  params_json TEXT NOT NULL,
  n_obs INTEGER NOT NULL DEFAULT 0,
  chi2_sm REAL,
  chi2_salt REAL,
  rmse_sm REAL,
  rmse_salt REAL,
  aic_sm REAL,
  aic_salt REAL,
  bic_sm REAL,
  bic_salt REAL,
  fdr_q REAL,
  verdict TEXT NOT NULL,
  verdict_reason TEXT,
  computed_at_utc TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS micro_artifacts (
  artifact_id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id INTEGER NOT NULL,
  plot_type TEXT NOT NULL,
  path TEXT NOT NULL,
  sha256 TEXT,
  created_at_utc TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES micro_fit_runs(run_id)
);

CREATE INDEX IF NOT EXISTS idx_micro_obs_channel
  ON micro_observations(channel, observable_id, dataset_id);

CREATE INDEX IF NOT EXISTS idx_micro_scores_channel
  ON micro_scores(channel, observable_id, dataset_id);

CREATE INDEX IF NOT EXISTS idx_micro_fit_runs_channel
  ON micro_fit_runs(channel, computed_at_utc);
