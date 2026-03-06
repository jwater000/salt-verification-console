import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig = plt.figure(figsize=(13.5, 6.2))
gs = fig.add_gridspec(1, 2, width_ratios=[1.05, 1.95], wspace=0.16)

# Panel A: intuition first
ax = fig.add_subplot(gs[0, 0])
ax.axis("off")
ax.set_title("1) 직관 핵심", fontsize=12)

lines_a = [
    "시간축 성분: mc² (소성 고착 질량 m의 에너지)",
    "공간축 성분: pc (운동 성분)",
    "",
    "두 성분은 서로 직교 축이다.",
    "둘을 벡터로 결합한 길이가",
    "전체 에너지 E다.",
]
y = 0.92
for t in lines_a:
    ax.text(0.04, y, t, fontsize=12 if "E" in t else 11, va="top")
    y -= 0.12

ax.text(
    0.04,
    0.05,
    r"$E^2=(pc)^2+(mc^2)^2$",
    fontsize=17,
    bbox=dict(facecolor="#f7f7f7", edgecolor="#cccccc"),
)

# Panel B: geometric composition
ax = fig.add_subplot(gs[0, 1])
ax.set_title("2) 에너지 성분 결합(벡터 합성)", fontsize=12)
ax.set_xlabel("공간축 에너지 성분  pc")
ax.set_ylabel("시간축 에너지 성분  mc²")
ax.set_aspect("equal", adjustable="box")
ax.grid(True, alpha=0.28)

pc = 4.3
mc2 = 3.1

ax.plot([0, pc], [0, 0], color="#1f77b4", lw=2.6)
ax.plot([pc, pc], [0, mc2], color="#2ca02c", lw=2.6)
ax.plot([0, pc], [0, mc2], color="#d62728", lw=2.8)

# Vector arrows (pc, mc^2, E) for direct geometric intuition
ax.annotate("", (pc, 0), (0, 0), arrowprops=dict(arrowstyle="->", lw=2.4, color="#1f77b4"))
ax.annotate("", (pc, mc2), (pc, 0), arrowprops=dict(arrowstyle="->", lw=2.4, color="#2ca02c"))
ax.annotate("", (pc, mc2), (0, 0), arrowprops=dict(arrowstyle="->", lw=2.6, color="#d62728"))

s = 0.32
ax.plot([pc - s, pc - s, pc], [0, s, s], color="black", lw=1)

ax.text(pc / 2, -0.38, "공간 성분  pc (운동)", ha="center", color="#1f77b4", fontsize=12)
ax.text(pc + 0.16, mc2 / 2, "시간 성분  mc² (소성 고착 m)", va="center", color="#2ca02c", fontsize=12)
ax.text(pc / 2 + 0.15, mc2 / 2 + 0.22, "전체 에너지  E", color="#d62728", fontsize=12)
ax.text(0.02, 0.97, r"$E^2=(pc)^2+(mc^2)^2$", transform=ax.transAxes, fontsize=14, va="top")
ax.text(
    0.02,
    0.90,
    "직관: 두 축 성분의 결합 크기가 E",
    transform=ax.transAxes,
    fontsize=11,
    color="#444444",
)
ax.set_xlim(-0.35, pc + 1.55)
ax.set_ylim(-0.65, mc2 + 1.0)

fig.suptitle("g31: 시간축 성분 + 공간축 성분의 결합이 전체 에너지 E", fontsize=15)
save_fig(fig, "g31_pythagorean_energy_momentum.jpg")
