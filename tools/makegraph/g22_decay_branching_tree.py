import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(11, 6))
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis("off")

nodes = {
    "초기\n매듭": (1.2, 5.0),
    "상태 A": (3.6, 7.4),
    "상태 B": (3.6, 2.6),
    "렙톤\n채널": (6.4, 8.3),
    "하드론\n채널": (6.4, 6.2),
    "광자\n채널": (6.4, 3.7),
    "중성미자\n채널": (6.4, 1.7),
    "안정\n산출물": (9.0, 5.0),
}

edges = [
    ("초기\n매듭", "상태 A", 0.58),
    ("초기\n매듭", "상태 B", 0.42),
    ("상태 A", "렙톤\n채널", 0.36),
    ("상태 A", "하드론\n채널", 0.22),
    ("상태 B", "광자\n채널", 0.24),
    ("상태 B", "중성미자\n채널", 0.18),
    ("렙톤\n채널", "안정\n산출물", 0.36),
    ("하드론\n채널", "안정\n산출물", 0.22),
    ("광자\n채널", "안정\n산출물", 0.24),
    ("중성미자\n채널", "안정\n산출물", 0.18),
]

for name, (x, y) in nodes.items():
    ax.scatter([x], [y], s=1200, color="#9ecae1", edgecolor="black", zorder=3)
    ax.text(x, y, name, ha="center", va="center", fontsize=9)

for a, b, p in edges:
    x1, y1 = nodes[a]
    x2, y2 = nodes[b]
    ax.annotate("", (x2-0.45, y2), (x1+0.45, y1), arrowprops=dict(arrowstyle="->", lw=1.6))
    ax.text((x1+x2)/2, (y1+y2)/2 + 0.2, f"{p:.2f}", fontsize=8)

ax.set_title("g22: 분기 기하로 보는 입자 변환")
save_fig(fig, "g22_decay_branching_tree.jpg")
