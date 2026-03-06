import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

x = np.linspace(-3, 3, 300)
y = np.linspace(-3, 3, 300)
X, Y = np.meshgrid(x, y)
R = np.sqrt(X**2 + Y**2) + 0.2
clock_rate = np.sqrt(1 - np.clip(1.4/R, 0, 0.95))

fig, ax = plt.subplots(figsize=(8, 7))
im = ax.imshow(clock_rate, extent=[-3, 3, -3, 3], origin="lower", cmap="viridis")
cs = ax.contour(X, Y, clock_rate, levels=8, colors="white", linewidths=0.8, alpha=0.7)
ax.clabel(cs, inline=True, fontsize=8)

for r in [0.8, 1.5, 2.4]:
    ax.add_patch(plt.Circle((0, 0), r, fill=False, ls="--", lw=1.1, color="black", alpha=0.5))

ax.set_title("g10: 밀도 기울기에서의 시계 속도 지도")
ax.set_xlabel("공간 x")
ax.set_ylabel("공간 y")
fig.colorbar(im, ax=ax, label="국소 시계 속도 / 원거리 시계")
save_fig(fig, "g10_time_dilation_heatmap.jpg")
