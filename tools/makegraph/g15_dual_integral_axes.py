import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

t = np.linspace(0, 8, 300)
F_t = 1.4 + 0.4 * np.sin(1.4 * t)
axes[0].plot(t, F_t, color="#1f77b4", lw=2)
axes[0].fill_between(t, 0, F_t, alpha=0.2, color="#1f77b4")
axes[0].set_title("시간 축 적분: ∫F dt = Δp")
axes[0].set_xlabel("시간 t")
axes[0].set_ylabel("힘 F")
axes[0].text(0.05, 0.92, "선형 누적 -> 운동량", transform=axes[0].transAxes, fontsize=10)

x = np.linspace(0, 8, 300)
F_x = 0.5 + 0.16 * x + 0.15 * np.sin(1.1 * x)
axes[1].plot(x, F_x, color="#ff7f0e", lw=2)
axes[1].fill_between(x, 0, F_x, alpha=0.2, color="#ff7f0e")
axes[1].set_title("공간 축 적분: ∫F dx = ΔE")
axes[1].set_xlabel("변위 x")
axes[1].set_ylabel("힘 F")
axes[1].text(0.05, 0.92, "거리 누적 -> 에너지", transform=axes[1].transAxes, fontsize=10)

fig.suptitle("g15: 힘의 이중 적분 축 비교", fontsize=14, weight="bold")
save_fig(fig, "g15_dual_integral_axes.jpg")
