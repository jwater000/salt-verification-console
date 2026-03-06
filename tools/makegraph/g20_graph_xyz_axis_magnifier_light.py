import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

rho = 1.0
k = 2*np.pi/2.0
s = np.linspace(0, 8, 1000)
sv = np.arange(0, 8.0+1e-9, 0.05)

fig = plt.figure(figsize=(14, 8))
ax0 = fig.add_axes([0.05, 0.10, 0.43, 0.78], projection="3d")
ax1 = fig.add_axes([0.48, 0.08, 0.24, 0.34], projection="3d")
ax2 = fig.add_axes([0.74, 0.08, 0.24, 0.34], projection="3d")
ax3 = fig.add_axes([0.57, 0.50, 0.36, 0.40], projection="3d")

th = k*s
thv = k*sv
ax0.plot(s, rho*np.cos(th), rho*np.sin(th), lw=2, color="#3182bd", label="x축 상태")
ax0.plot(rho*np.cos(th), s, rho*np.sin(th), lw=2, color="#31a354", label="y축 상태")
ax0.plot(rho*np.cos(th), rho*np.sin(th), s, lw=2, color="#de2d26", label="z축 상태")
ax0.set_title("3D 개요")
ax0.legend(loc="upper left", fontsize=8)

ax1.plot(s, rho*np.cos(th), rho*np.sin(th), color="#3182bd")
ax1.scatter(sv, rho*np.cos(thv), rho*np.sin(thv), s=5, color="#f16913")
ax1.set_title("X축 확대")

ax2.plot(rho*np.cos(th), s, rho*np.sin(th), color="#31a354")
ax2.scatter(rho*np.cos(thv), sv, rho*np.sin(thv), s=5, color="#f16913")
ax2.set_title("Y축 확대")

ax3.plot(rho*np.cos(th), rho*np.sin(th), s, color="#de2d26")
ax3.scatter(rho*np.cos(thv), rho*np.sin(thv), sv, s=5, color="#f16913")
ax3.set_title("Z축 확대")

fig.suptitle("g20: 축별 복소장 확대 보기")
save_fig(fig, "g20_graph_xyz_axis_magnifier_light.jpg")
