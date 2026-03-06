import numpy as np
import matplotlib.pyplot as plt
from collections import Counter
from _graph_common import setup_style, save_fig

setup_style()

rho = 1.0
s = np.linspace(0, 8, 800)
sv = np.arange(0.0, 8.0 + 1e-9, 0.05)

fig = plt.figure(figsize=(14, 9))
ax1 = fig.add_axes([0.05, 0.58, 0.26, 0.32])
ax2 = fig.add_axes([0.37, 0.58, 0.26, 0.32])
ax3 = fig.add_axes([0.69, 0.58, 0.26, 0.32])
ax4 = fig.add_axes([0.06, 0.11, 0.41, 0.34])
ax5 = fig.add_axes([0.57, 0.11, 0.37, 0.34])

for ax, phase_shift, title, cmap in [
    (ax1, 0.0, "X 단면 복소평면", "Blues"),
    (ax2, 0.8, "Y 단면 복소평면", "Greens"),
    (ax3, 1.5, "Z 단면 복소평면", "Reds"),
]:
    z = rho * np.exp(1j * (2*np.pi*s/2 + phase_shift))
    zv = rho * np.exp(1j * (2*np.pi*sv/2 + phase_shift))
    ax.plot(z.real, z.imag, color="black", lw=1.5, alpha=0.6)
    sc = ax.scatter(z.real, z.imag, c=s, cmap=cmap, s=4)
    ax.scatter(zv.real, zv.imag, s=10, color="#f16913", alpha=0.8)
    ax.set_aspect("equal")
    ax.set_xlim(-1.25, 1.25)
    ax.set_ylim(-1.25, 1.25)
    ax.set_title(title, fontsize=10)
    fig.colorbar(sc, ax=ax, fraction=0.046)

nx = 26
x = np.linspace(0, 2*np.pi, nx)
X, Y, Z = np.meshgrid(x, x, x, indexing="ij")
psi = (1 + 0.25*np.sin(X)*np.cos(Y)) * np.exp(1j*(1.2*X + 0.8*Y + 1.5*Z))
re = psi.real.ravel()
im = psi.imag.ravel()
depth = (X+Y+Z).ravel()/(6*np.pi)

q = 0.02
keys = np.stack([np.round(re/q).astype(int), np.round(im/q).astype(int)], axis=1)
counter = Counter(map(tuple, keys))
점유수 = np.array([counter[(a, b)] for a, b in keys])
vals = np.array(list(counter.values()))

sc2 = ax4.scatter(re, im, c=depth, cmap="viridis", s=5, alpha=0.6)
ax4.scatter(re[점유수 >= np.percentile(점유수, 99.5)], im[점유수 >= np.percentile(점유수, 99.5)],
            s=14, facecolors="none", edgecolors="crimson", linewidths=0.6)
ax4.set_aspect("equal")
ax4.set_title("손실성 3D->2D 투영")
fig.colorbar(sc2, ax=ax4, fraction=0.05, label="깊이 대리값")

ax5.hist(vals, bins=np.arange(1, vals.max()+2)-0.5, color="#fdae6b", edgecolor="black")
ax5.set_title("복소 빈 중첩 개수")
ax5.set_xlabel("점유수")
ax5.set_ylabel("빈 개수")

fig.suptitle("g18: 축 보존 단면과 정보 손실 투영 비교")
save_fig(fig, "g18_graph_combined_complex_views.jpg")
