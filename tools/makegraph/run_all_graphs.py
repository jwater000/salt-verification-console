from pathlib import Path
import subprocess
import sys

BASE = Path(__file__).resolve().parent
scripts = sorted(
    p for p in BASE.glob("g*.py")
    if p.name != "run_all_graphs.py"
)

for script in scripts:
    print(f"[RUN] {script.name}")
    result = subprocess.run([sys.executable, str(script)], cwd=str(BASE.parent))
    if result.returncode != 0:
        raise SystemExit(f"failed: {script.name}")

print(f"[DONE] {len(scripts)} scripts executed")
