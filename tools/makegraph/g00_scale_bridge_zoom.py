import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(12, 6))
levels = [
    ("우주 거미줄", 1e26, "#0b3c5d"),
    ("은하", 1e21, "#1d70a2"),
    ("태양계", 1e13, "#2f9ed1"),
    ("인간 규모", 1e0, "#8dd3c7"),
    ("세포", 1e-5, "#fdb462"),
    ("원자", 1e-10, "#fb8072"),
    ("원자핵", 1e-15, "#d95f02"),
    ("보셀", 1e-20, "#7f0000"),
]

x = np.arange(len(levels))
y = np.log10([v for _, v, _ in levels])
ax.plot(x, y, color="#333333", lw=2)
for i, (name, _, c) in enumerate(levels):
    ax.scatter(i, y[i], s=220, color=c, edgecolor="black", zorder=3)
    # Move labels to upper-right diagonal so they do not overlap markers/line.
    ax.text(i + 0.18, y[i] + 0.35, name, ha="left", va="bottom", fontsize=9, zorder=4)

for i in range(len(levels)-1):
    ax.annotate("", (i+1, y[i+1]), (i, y[i]), arrowprops=dict(arrowstyle="->", lw=1.2))

ax.set_xticks([])
ax.set_xlim(-0.4, len(levels) - 0.35)
ax.set_ylabel("길이 로그 스케일 (m)")
ax.set_title("g00: 우주에서 보셀까지의 스케일 다리")
ax.text(
    0.98,
    0.95,
    "거시 직관에서 미시 메커니즘으로 이어지는 연속 지도",
    transform=ax.transAxes,
    ha="right",
    va="top",
    fontsize=10,
    bbox=dict(facecolor="white", alpha=0.85, edgecolor="none", boxstyle="round,pad=0.25"),
)
save_fig(fig, "g00_scale_bridge_zoom.jpg")
