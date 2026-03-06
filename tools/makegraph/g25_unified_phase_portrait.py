import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

x = np.linspace(-3, 3, 160)
y = np.linspace(-3, 3, 160)
X, Y = np.meshgrid(x, y)

# coupled system portrait
U = Y - 0.4*X*(X**2 + Y**2 - 1.8)
V = -X - 0.4*Y*(X**2 + Y**2 - 1.8)

fig, ax = plt.subplots(figsize=(8, 7))
strm = ax.streamplot(X, Y, U, V, color=np.hypot(U, V), cmap="viridis", density=1.4)
ax.scatter([0], [0], s=65, color="black")
ax.scatter([1.34, -1.34], [0, 0], s=50, color="#de2d26")
ax.set_title("g25: 프레임워크 최종 상태-흐름 초상")
ax.set_xlabel("상태 축 A")
ax.set_ylabel("상태 축 B")
fig.colorbar(strm.lines, ax=ax, label="흐름 속도")
save_fig(fig, "g25_unified_phase_portrait.jpg")
