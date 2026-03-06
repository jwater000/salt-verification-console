import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(10, 6))
x = np.linspace(0, 10, 600)

# reference straight
ax.plot(x, np.zeros_like(x), lw=2, color="#2171b5", label="기준 직선 경로")

# prism-like piecewise
x1 = np.linspace(0, 3.5, 120)
y1 = np.zeros_like(x1)
x2 = np.linspace(3.5, 5.5, 100)
y2 = np.tan(np.deg2rad(18)) * (x2 - 3.5)
x3 = np.linspace(5.5, 10, 160)
y3 = y2[-1] + np.tan(np.deg2rad(30)) * (x3 - 5.5)
ax.plot(np.r_[x1, x2, x3], np.r_[y1, y2, y3], lw=2.3, color="#f16913", label="프리즘형 굴절")

# gravity-lens-like smooth
y_grav = 0.85 - 0.7 / (1 + ((x - 5.2) / 1.1) ** 2)
ax.plot(x, y_grav, lw=2.3, color="#cb181d", label="중력렌즈형 굽힘")

ax.axvline(3.5, ls="--", lw=1, color="gray")
ax.axvline(5.5, ls="--", lw=1, color="gray")
ax.scatter([5.2], [0], color="black", s=55, zorder=4)
ax.text(5.25, -0.14, "렌즈 질량", fontsize=9)

ax.set_title("g04: 빛 경로 비교")
ax.set_xlabel("진행 방향")
ax.set_ylabel("횡방향 변위")
ax.legend()
ax.set_ylim(-1.1, 2.5)
save_fig(fig, "g04_graph_light_trajectory.jpg")
