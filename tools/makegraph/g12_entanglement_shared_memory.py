import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(11.5, 5.8))
ax.set_xlim(0, 10)
ax.set_ylim(0, 6)
ax.axis("off")

# physical distance layer
ax.text(5, 5.6, "관측 좌표 계층 (3차원)", ha="center", fontsize=12, weight="bold")
left = Circle((1.5, 4.1), 0.45, fc="#1f77b4", ec="black")
right = Circle((8.5, 4.1), 0.45, fc="#d62728", ec="black")
ax.add_patch(left)
ax.add_patch(right)
ax.text(1.5, 4.1, "A", ha="center", va="center", color="white", weight="bold")
ax.text(8.5, 4.1, "B", ha="center", va="center", color="white", weight="bold")
ax.plot([2.0, 8.0], [4.1, 4.1], color="#777777", lw=1.5, ls="--")
ax.text(5, 4.35, "매우 멀리 떨어진 관측 위치", ha="center", fontsize=9, color="#444444")

# structural connection layer
ax.text(5, 2.75, "구조적 연결 계층 (비국소 상관)", ha="center", fontsize=12, weight="bold")
mem = Rectangle((3.4, 1.3), 3.2, 1.3, fc="#ffdd57", ec="black")
ax.add_patch(mem)
ax.text(5.0, 1.95, "공통 상태면", ha="center", va="center", fontsize=11, weight="bold")
ax.annotate("", xy=(4.0, 2.6), xytext=(1.5, 3.65), arrowprops=dict(arrowstyle="->", lw=2))
ax.annotate("", xy=(6.0, 2.6), xytext=(8.5, 3.65), arrowprops=dict(arrowstyle="->", lw=2))
ax.text(5, 0.7, "핵심: 신호 전달이 아니라 공통 상태의 동시 갱신", ha="center", fontsize=10)

ax.set_title("g12: 양자 얽힘의 구조적 연결 해석", fontsize=14)
save_fig(fig, "g12_entanglement_shared_memory.jpg")
