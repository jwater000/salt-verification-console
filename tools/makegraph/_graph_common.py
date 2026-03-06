from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager, rcParams


def setup_style():
    plt.style.use("seaborn-v0_8-whitegrid")
    font_path = "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
    if Path(font_path).exists():
        font_manager.fontManager.addfont(font_path)
        rcParams["font.family"] = font_manager.FontProperties(fname=font_path).get_name()
    else:
        candidates = ["Noto Sans CJK KR", "NanumGothic", "Malgun Gothic", "AppleGothic", "DejaVu Sans"]
        available = {f.name for f in font_manager.fontManager.ttflist}
        for name in candidates:
            if name in available:
                rcParams["font.family"] = name
                break
    rcParams["axes.unicode_minus"] = False


def graph_dir() -> Path:
    project_root = Path(__file__).resolve().parent.parent.parent
    out = project_root / "docs" / "book" / "graph"
    out.mkdir(parents=True, exist_ok=True)
    return out


def save_fig(fig, out_name: str):
    path = graph_dir() / out_name
    fig.savefig(path, dpi=220, bbox_inches="tight")
    plt.close(fig)
    print(path)
