import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(10, 7))
ax.set_xlim(0, 10)
ax.set_ylim(0, 8)
ax.axis("off")

nodes = {
    "밀도": (2, 6),
    "장력": (4, 7),
    "비틀림": (6, 6),
    "매듭": (5, 4),
    "질량": (3, 3),
    "파동": (7, 3),
    "상호작용": (5, 1.4),
}
edges = [
    ("밀도", "장력"), ("장력", "비틀림"), ("비틀림", "매듭"),
    ("매듭", "질량"), ("매듭", "파동"), ("질량", "상호작용"),
    ("파동", "상호작용"), ("밀도", "매듭"), ("장력", "질량")
]

for name, (x, y) in nodes.items():
    ax.scatter([x], [y], s=1300, color="#c6dbef", edgecolor="black", zorder=3)
    ax.text(x, y, name, ha="center", va="center", fontsize=10)

for a, b in edges:
    x1, y1 = nodes[a]
    x2, y2 = nodes[b]
    ax.annotate("", (x2, y2), (x1, y1), arrowprops=dict(arrowstyle="->", lw=1.4, alpha=0.85))

ax.set_title("g26: 용어 관계 지도")
save_fig(fig, "g26_glossary_relation_map.jpg")
