#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
SCRIPT_PATH="$ROOT_DIR/tools/realtime/run_realtime_cycle.py"
LOG_DIR="$ROOT_DIR/results/reports"
LOG_PATH="$LOG_DIR/realtime_cycle.log"

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "error: python not found at $PYTHON_BIN" >&2
  exit 1
fi

mkdir -p "$LOG_DIR"

# Every 10 minutes.
CRON_LINE="*/10 * * * * cd $ROOT_DIR && $PYTHON_BIN $SCRIPT_PATH >> $LOG_PATH 2>&1"

TMP_FILE="$(mktemp)"
crontab -l 2>/dev/null | grep -v "run_realtime_cycle.py" > "$TMP_FILE" || true
{
  cat "$TMP_FILE"
  echo "$CRON_LINE"
} | crontab -
rm -f "$TMP_FILE"

echo "installed cron:"
echo "$CRON_LINE"
