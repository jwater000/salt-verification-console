import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(12, 6))
ax.set_xlim(0, 12)
ax.set_ylim(0, 6)
ax.axis("off")

boxes = [
    (1, 3.2, "주장"),
    (3.3, 3.2, "수학 모델"),
    (5.6, 3.2, "시뮬레이션"),
    (7.9, 3.2, "관측량"),
    (10.2, 3.2, "실험"),
    (5.6, 1.2, "감사 로그"),
]
for x, y, label in boxes:
    rect = plt.Rectangle((x-0.9, y-0.45), 1.8, 0.9, facecolor="#deebf7", edgecolor="black")
    ax.add_patch(rect)
    ax.text(x, y, label, ha="center", va="center")

arrows = [
    ((1.9, 3.2), (2.4, 3.2)),
    ((4.2, 3.2), (4.7, 3.2)),
    ((6.5, 3.2), (7.0, 3.2)),
    ((8.8, 3.2), (9.3, 3.2)),
    ((10.2, 2.75), (6.0, 1.65)),
    ((5.2, 1.65), (1.8, 2.75)),
]
for (x1, y1), (x2, y2) in arrows:
    ax.annotate("", (x2, y2), (x1, y1), arrowprops=dict(arrowstyle="->", lw=1.6))

ax.set_title("g32: 부록 감사 루프 (주장 -> 검증 -> 피드백)")
save_fig(fig, "g32_audit_flowchart.jpg")
