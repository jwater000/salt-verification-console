import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

x = np.linspace(-5, 5, 400)
y = np.linspace(-5, 5, 400)
X, Y = np.meshgrid(x, y)
R = np.hypot(X, Y)
theta = np.arctan2(Y, X)

amp = np.exp(-0.18 * R**2) * (1 + 0.45 * np.cos(5 * theta))

fig, ax = plt.subplots(figsize=(7.2, 6.2))
im = ax.imshow(amp, extent=[-5, 5, -5, 5], origin="lower", cmap="magma")
for rr in [1.2, 2.1, 3.0, 4.0]:
    circle = plt.Circle((0, 0), rr, fill=False, ec="white", lw=0.9, alpha=0.7)
    ax.add_patch(circle)

ax.scatter([0], [0], s=60, color="#00e5ff", edgecolor="black", zorder=3)
ax.text(0.2, 0.3, "국소 활성화 핵", color="white", fontsize=9)
ax.set_title("g08: 무한 격자 위 국소 빅뱅 영역")
ax.set_xlabel("국소 격자 좌표 x (윈도우)")
ax.set_ylabel("국소 격자 좌표 y (윈도우)")

# indicate infinite continuation outside the shown window
ax.text(4.75, -4.7, "...", color="white", fontsize=14, ha="right")
ax.text(-4.75, -4.7, "...", color="white", fontsize=14, ha="left")
ax.text(-4.8, 4.65, "...", color="white", fontsize=14, va="top")
ax.annotate("", xy=(5.0, -5.0), xytext=(4.45, -5.0), arrowprops=dict(arrowstyle="->", color="white", lw=1.6))
ax.annotate("", xy=(-5.0, -5.0), xytext=(-4.45, -5.0), arrowprops=dict(arrowstyle="->", color="white", lw=1.6))
ax.annotate("", xy=(-5.0, 5.0), xytext=(-5.0, 4.45), arrowprops=dict(arrowstyle="->", color="white", lw=1.6))

fig.colorbar(im, ax=ax, label="장력 진폭")

save_fig(fig, "g08_local_bigbang_region.jpg")
