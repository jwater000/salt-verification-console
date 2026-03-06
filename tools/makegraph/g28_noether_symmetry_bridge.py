import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(11, 5.6))
ax.axis("off")

left_items = [("공간 병진 대칭", 0.70), ("시간 병진 대칭", 0.34)]
right_items = [("운동량 보존", 0.70), ("에너지 보존", 0.34)]

for txt, y in left_items:
    ax.add_patch(FancyBboxPatch((0.08, y - 0.09), 0.28, 0.16, boxstyle="round,pad=0.02", fc="#1f77b4", ec="black"))
    ax.text(0.22, y, txt, ha="center", va="center", color="white", weight="bold")

for txt, y in right_items:
    ax.add_patch(FancyBboxPatch((0.64, y - 0.09), 0.28, 0.16, boxstyle="round,pad=0.02", fc="#2ca02c", ec="black"))
    ax.text(0.78, y, txt, ha="center", va="center", color="white", weight="bold")

ax.annotate("", xy=(0.64, 0.70), xytext=(0.36, 0.70), arrowprops=dict(arrowstyle="->", lw=2.4))
ax.annotate("", xy=(0.64, 0.34), xytext=(0.36, 0.34), arrowprops=dict(arrowstyle="->", lw=2.4))
ax.text(0.50, 0.18, "SALT 해석: 균질 격자와 균일 시간 인덱스가 대칭의 배경", ha="center", fontsize=10)
ax.set_title("g28: 뇌터 대칭-보존 다리", fontsize=14, weight="bold")

save_fig(fig, "g28_noether_symmetry_bridge.jpg")
