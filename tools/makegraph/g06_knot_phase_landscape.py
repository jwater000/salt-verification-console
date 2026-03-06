import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig = plt.figure(figsize=(11, 6))
ax1 = fig.add_subplot(121, projection="3d")
ax2 = fig.add_subplot(122)

u = np.linspace(0, 2*np.pi, 200)
v = np.linspace(0, 2*np.pi, 120)
U, V = np.meshgrid(u, v)
R = 2 + 0.4*np.cos(3*V)
X = R*np.cos(U)
Y = R*np.sin(U)
Z = 0.8*np.sin(2*V)
ax1.plot_surface(X, Y, Z, cmap="viridis", linewidth=0, alpha=0.95)
ax1.set_title("비틀린 적층 매듭 다양체")

k = np.linspace(0, 2, 160)
t = np.linspace(0, 2, 160)
K, T = np.meshgrid(k, t)
E = (K-1.2)**2 + 0.8*(T-0.6)**2 + 0.25*np.sin(6*K)*np.cos(4*T)
im = ax2.contourf(K, T, E, levels=24, cmap="magma")
ax2.contour(K, T, E, levels=8, colors="white", linewidths=0.6)
ax2.set_xlabel("매듭 밀도")
ax2.set_ylabel("비틀림 속도")
ax2.set_title("위상-에너지 지형도")
fig.colorbar(im, ax=ax2, label="유효 에너지")

fig.suptitle("g06: 매듭 안정화로 본 물질 형성")
save_fig(fig, "g06_knot_phase_landscape.jpg")
