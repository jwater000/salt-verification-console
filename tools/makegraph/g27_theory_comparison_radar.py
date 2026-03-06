import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

labels = ["직관", "수학적 폐쇄성", "실험 연계", "통합성", "계산 가능성", "교육 전달력"]
N = len(labels)
angles = np.linspace(0, 2*np.pi, N, endpoint=False)
angles = np.r_[angles, angles[0]]

salt = np.array([4.4, 3.8, 3.5, 4.6, 3.9, 4.5])
standard = np.array([3.3, 4.8, 4.7, 3.2, 4.1, 2.8])
salt = np.r_[salt, salt[0]]
standard = np.r_[standard, standard[0]]

fig = plt.figure(figsize=(8, 8))
ax = fig.add_subplot(111, polar=True)
ax.plot(angles, salt, lw=2.2, color="#e34a33", label="SALT 관점")
ax.fill(angles, salt, color="#e34a33", alpha=0.20)
ax.plot(angles, standard, lw=2.2, color="#3182bd", label="표준 관점")
ax.fill(angles, standard, color="#3182bd", alpha=0.18)
ax.set_xticks(angles[:-1], labels)
ax.set_ylim(0, 5)
ax.set_title("g27: 이론 비교 프로파일", pad=20)
ax.legend(loc="upper right", bbox_to_anchor=(1.3, 1.1))
save_fig(fig, "g27_theory_comparison_radar.jpg")
