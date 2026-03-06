import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, axes = plt.subplots(1, 2, figsize=(12, 5), sharex=True, sharey=True)

# Panel A: force-vector intuition
x = np.linspace(0, 10, 300)
y_force = 2.5 - 0.03 * (x - 2) ** 2
axes[0].plot(x, y_force, color="#2b8cbe", lw=2.5, label="궤적")
for t in [2, 4, 6, 8]:
    y = 2.5 - 0.03 * (t - 2) ** 2
    axes[0].arrow(t, y + 0.6, 0, -0.5, width=0.02, color="#de2d26")
axes[0].set_title("힘 관점: 화살표에 끌리는 운동")
axes[0].legend(loc="lower left")

# Panel B: 측지선 on density slope
well = 0.25 * np.exp(-0.25 * (x - 5) ** 2)
y_geo = 2.6 - 1.3 * well
axes[1].plot(x, y_geo, color="#238b45", lw=2.5, label="측지선")
axes[1].fill_between(x, 0, y_geo - 1.5, color="#9ecae1", alpha=0.35, label="밀도장")
axes[1].set_title("기하 관점: 휘어진 매질 위 경로")
axes[1].legend(loc="lower left")

for ax in axes:
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 3.5)
    ax.set_xlabel("공간 좌표")
axes[0].set_ylabel("높이 / 퍼텐셜")
fig.suptitle("g03: 같은 운동, 두 가지 설명")
save_fig(fig, "g03_force_vs_geodesic.jpg")
