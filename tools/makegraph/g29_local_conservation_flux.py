import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

x = np.linspace(-2.4, 2.4, 28)
y = np.linspace(-2.4, 2.4, 28)
X, Y = np.meshgrid(x, y)

U = -X * np.exp(-(X**2 + Y**2) / 3.0)
V = -Y * np.exp(-(X**2 + Y**2) / 3.0)
div = np.gradient(U, x, axis=1) + np.gradient(V, y, axis=0)

fig, ax = plt.subplots(figsize=(7.2, 6.2))
bg = ax.contourf(X, Y, div, levels=18, cmap="coolwarm", alpha=0.7)
ax.quiver(X, Y, U, V, color="black", alpha=0.72, scale=13)
ax.set_title("g29: 국소 연속 보존 플럭스")
ax.set_xlabel("격자 x")
ax.set_ylabel("격자 y")
ax.text(-2.28, -2.75, "연속방정식: ∂t n + ∇·J = 0", fontsize=10)
fig.colorbar(bg, ax=ax, label="∇·J")

save_fig(fig, "g29_local_conservation_flux.jpg")
