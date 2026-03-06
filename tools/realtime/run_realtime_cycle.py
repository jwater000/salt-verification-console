#!/usr/bin/env python3
"""
Run one full realtime pipeline cycle.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = [
    ROOT / "tools" / "realtime" / "collect_public_events.py",
    ROOT / "tools" / "realtime" / "build_realtime_db.py",
    ROOT / "tools" / "realtime" / "refresh_live_snapshot.py",
]


def main() -> None:
    for script in SCRIPTS:
        print(f"[run] {script.relative_to(ROOT)}")
        proc = subprocess.run([sys.executable, str(script)], cwd=str(ROOT), check=False)
        if proc.returncode != 0:
            raise SystemExit(proc.returncode)
    print("[done] realtime cycle completed")


if __name__ == "__main__":
    main()
