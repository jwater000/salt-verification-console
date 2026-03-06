import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

x = np.linspace(-4, 4, 80)
y = np.linspace(-4, 4, 80)
X, Y = np.meshgrid(x, y)
R2 = X**2 + Y**2 + 0.2
U = -X / (R2**1.5)
V = -Y / (R2**1.5)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
strm = axes[0].streamplot(X, Y, U, V, color=1/np.sqrt(R2), cmap="plasma", density=1.4)
axes[0].scatter([0], [0], s=80, color="black")
axes[0].set_title("흐름 해석")
axes[0].set_aspect("equal")
fig.colorbar(strm.lines, ax=axes[0], label="흐름 세기")

r = np.linspace(0.2, 10, 400)
axes[1].plot(r, 1/r**2, lw=2.2, color="#2b8cbe")
axes[1].set_title("구면 희석: 1/r^2")
axes[1].set_xlabel("거리 r")
axes[1].set_ylabel("세기")
axes[1].set_xlim(0, 10)

fig.suptitle("g19: 연결 매질 위 방향성 흐름으로서의 중력")
save_fig(fig, "g19_gravity_flow_field.jpg")
