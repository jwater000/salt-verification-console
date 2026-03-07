#!/usr/bin/env python3
"""
Run one full micro validation pipeline cycle.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = [
    ROOT / "tools" / "micro" / "build_micro_db.py",
    ROOT / "tools" / "micro" / "ingest_hepdata.py",
    ROOT / "tools" / "micro" / "ingest_pdg.py",
    ROOT / "tools" / "micro" / "ingest_nufit.py",
    ROOT / "tools" / "micro" / "run_micro_stats.py",
]


def main() -> None:
    for script in SCRIPTS:
        print(f"[run] {script.relative_to(ROOT)}")
        proc = subprocess.run([sys.executable, str(script)], cwd=str(ROOT), check=False)
        if proc.returncode != 0:
            raise SystemExit(proc.returncode)
    print("[done] micro cycle completed")


if __name__ == "__main__":
    main()
