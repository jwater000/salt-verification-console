import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, axs = plt.subplots(1, 2, figsize=(12, 5))

# Left: Minkowski hyperbola invariant mass shell
ax = axs[0]
ax.set_title("질량 껍질 불변식")
ax.set_xlabel("pc")
ax.set_ylabel("E")
ax.axhline(0, color="black", lw=1)
ax.axvline(0, color="black", lw=1)

m = 1.0
c = 1.0
p = np.linspace(-3.0, 3.0, 600)
E = np.sqrt((m * c * c) ** 2 + (p * c) ** 2)
ax.plot(p * c, E, color="#1f77b4", lw=2, label=r"$E^2-(pc)^2=(mc^2)^2$")
ax.plot(p * c, -E, color="#1f77b4", lw=2)

# Two example states on the same invariant shell
idx1, idx2 = 180, 460
ax.scatter([p[idx1] * c, p[idx2] * c], [E[idx1], E[idx2]], color="#d62728", s=30, zorder=3)
ax.text(p[idx1] * c - 0.3, E[idx1] + 0.2, "관성계 A", fontsize=9)
ax.text(p[idx2] * c + 0.05, E[idx2] + 0.2, "관성계 B", fontsize=9)
ax.legend(loc="upper left", fontsize=9)
ax.set_xlim(-3.2, 3.2)
ax.set_ylim(-3.4, 3.4)

# Right: conceptual mapping to Noether invariants
ax = axs[1]
ax.set_title("뇌터 연결: 연속 대칭 ↔ 보존량")
ax.axis("off")

boxes = [
    (0.15, 0.75, "연속 시공간 대칭"),
    (0.50, 0.75, "로렌츠 변환"),
    (0.85, 0.75, "물리 법칙 형식 불변"),
    (0.33, 0.35, "에너지-운동량 보존"),
    (0.67, 0.35, "각운동량/부스트 보존"),
]
for x, y, txt in boxes:
    rect = plt.Rectangle((x - 0.16, y - 0.08), 0.32, 0.16, facecolor="#e8f1fb", edgecolor="black")
    ax.add_patch(rect)
    ax.text(x, y, txt, ha="center", va="center", fontsize=10)

arrows = [
    ((0.31, 0.75), (0.39, 0.75)),
    ((0.66, 0.75), (0.74, 0.75)),
    ((0.50, 0.67), (0.33, 0.43)),
    ((0.50, 0.67), (0.67, 0.43)),
]
for (x1, y1), (x2, y2) in arrows:
    ax.annotate("", (x2, y2), (x1, y1), arrowprops=dict(arrowstyle="->", lw=1.6))

ax.text(0.50, 0.08, "SALT 해석: 미시 이산성 + 거시 대칭 복원(IR 고정점)", ha="center", fontsize=10)

fig.suptitle("g30: 로렌츠 대칭과 불변량(4-운동량 껍질)", fontsize=13)
save_fig(fig, "g30_lorentz_symmetry_invariant.jpg")
