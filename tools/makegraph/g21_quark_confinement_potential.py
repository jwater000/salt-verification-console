import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

r = np.linspace(0.05, 4.0, 500)
alpha = 0.35
sigma = 0.9
V = -alpha/r + sigma*r

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(r, V, lw=2.4, color="#756bb1")
axes[0].axvspan(0, 0.5, color="#9ecae1", alpha=0.3, label="점근적 자유 영역")
axes[0].axvspan(1.5, 4.0, color="#fc9272", alpha=0.25, label="선형 구속 영역")
axes[0].set_title("QCD 영감 구속 퍼텐셜")
axes[0].set_xlabel("쿼크 분리 거리")
axes[0].set_ylabel("V(r)")
axes[0].legend(fontsize=8)

x = np.linspace(-2, 2, 200)
y = np.exp(-3*x**2)
axes[1].fill_between(x, -0.18, 0.18, color="#fdd0a2", alpha=0.9)
axes[1].plot(x, y*0.9, color="#cb181d", lw=2)
axes[1].plot(x, -y*0.9, color="#cb181d", lw=2)
axes[1].scatter([-1.2, 1.2], [0, 0], s=110, color="#252525")
axes[1].text(-1.32, 0.12, "q")
axes[1].text(1.16, 0.12, "q")
axes[1].set_title("플럭스 튜브 직관")
axes[1].set_xlim(-2, 2)
axes[1].set_ylim(-1.2, 1.2)
axes[1].axis("off")

fig.suptitle("g21: 쿼크가 단독으로 나타나지 않는 이유")
save_fig(fig, "g21_quark_confinement_potential.jpg")
