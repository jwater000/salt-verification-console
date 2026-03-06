import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

theta = np.linspace(0, np.pi, 400)
classical = 1 - 2*theta/np.pi
quantum = np.cos(theta)

# CHSH-style sample settings
A = [0, np.pi/2]
B = [np.pi/4, -np.pi/4]
E = lambda a, b: np.cos(a-b)
S_quantum = abs(E(A[0], B[0]) + E(A[0], B[1]) + E(A[1], B[0]) - E(A[1], B[1]))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(theta, classical, lw=2, color="#6a51a3", label="국소 실재론 한계 추세")
axes[0].plot(theta, quantum, lw=2, color="#e34a33", label="양자 상관")
axes[0].set_title("측정 각도에 따른 상관")
axes[0].set_xlabel("각도 차이")
axes[0].legend()

axes[1].bar(["고전 한계", "양자 예측"], [2.0, S_quantum], color=["#9ecae1", "#fb6a4a"])
axes[1].axhline(2.0, color="black", ls="--", lw=1)
axes[1].set_ylim(0, 3.1)
axes[1].set_title("CHSH 대비")
axes[1].text(1, S_quantum+0.05, f"S={S_quantum:.3f}", ha="center")

fig.suptitle("g13: 아인슈타인과 보어의 예측 분기점")
save_fig(fig, "g13_bell_chsh_comparison.jpg")
