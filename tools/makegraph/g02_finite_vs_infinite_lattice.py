import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# finite grid
ax = axes[0]
n = 12
for i in range(n + 1):
    ax.plot([0, n], [i, i], color="#bbbbbb", lw=0.8)
    ax.plot([i, i], [0, n], color="#bbbbbb", lw=0.8)
ax.add_patch(plt.Rectangle((0, 0), n, n, fill=False, ec="#d62728", lw=2))
ax.arrow(2, 6, 8, 0, width=0.08, color="#1f77b4", length_includes_head=True)
ax.text(10.2, 6.2, "경계 반사/소멸", fontsize=9, color="#d62728")
ax.set_title("유한 격자")
ax.set_aspect("equal")
ax.set_xlim(-0.5, n + 0.5)
ax.set_ylim(-0.5, n + 0.5)
ax.axis("off")

# infinite-like tiling
ax = axes[1]
for i in range(-3, 16):
    ax.plot([-3, 15], [i, i], color="#bbbbbb", lw=0.8)
    ax.plot([i, i], [-3, 15], color="#bbbbbb", lw=0.8)
ax.arrow(0, 6, 10, 0, width=0.08, color="#1f77b4", length_includes_head=True)
ax.arrow(10, 6, 3, 0, width=0.05, color="#1f77b4", alpha=0.45, length_includes_head=True)
ax.text(8.8, 6.4, "병진 대칭 유지", fontsize=9, color="#2ca02c")
ax.set_title("무한 격자 (Z^3 가정)")
ax.set_aspect("equal")
ax.set_xlim(-0.5, n + 0.5)
ax.set_ylim(-0.5, n + 0.5)
ax.axis("off")

fig.suptitle("g02: 유한 경계와 무한 격자 비교", fontsize=14, weight="bold")
save_fig(fig, "g02_finite_vs_infinite_lattice.jpg")
