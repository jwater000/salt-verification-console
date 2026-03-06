import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(12.5, 6.0))
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis("off")


def draw_box(x, y, w, h, text, color):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02", fc=color, ec="black", alpha=0.93)
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", color="white", fontsize=11.5, weight="bold")


# nodes
draw_box(0.07, 0.42, 0.14, 0.18, "힘 F", "#1f77b4")
draw_box(0.33, 0.67, 0.19, 0.18, "운동량 p", "#2ca02c")
draw_box(0.33, 0.20, 0.19, 0.18, "에너지 E", "#ff7f0e")
draw_box(0.74, 0.20, 0.19, 0.18, "질량 m\n(에너지 내부 고착)", "#d62728")

# arrows: F -> p, F -> E (parallel)
ax.annotate("", xy=(0.33, 0.76), xytext=(0.21, 0.54), arrowprops=dict(arrowstyle="->", lw=2.4, color="#333333"))
ax.annotate("", xy=(0.33, 0.29), xytext=(0.21, 0.48), arrowprops=dict(arrowstyle="->", lw=2.4, color="#333333"))
ax.text(0.23, 0.70, "시간 적분\n∫F dt = Δp", ha="left", va="center", fontsize=10)
ax.text(0.23, 0.31, "공간 적분\n∫F dx = ΔE", ha="left", va="center", fontsize=10)

# arrow: p -> E via velocity integral
ax.annotate("", xy=(0.43, 0.38), xytext=(0.43, 0.67), arrowprops=dict(arrowstyle="->", lw=2.2, color="#6a3d9a"))
ax.text(0.46, 0.52, "∫p dv = 1/2 mv²", ha="left", va="center", fontsize=10, color="#6a3d9a")

# arrow: E -> m
ax.annotate("", xy=(0.74, 0.29), xytext=(0.52, 0.29), arrowprops=dict(arrowstyle="->", lw=2.6, color="#333333"))
ax.text(0.63, 0.33, "고착/응축", ha="center", va="bottom", fontsize=10)

ax.text(0.5, 0.93, "g01: 힘의 적분 경로와 질량 형성 계층", ha="center", fontsize=15, weight="bold")
ax.text(0.5, 0.07, "병렬 핵심: 힘은 시간축·공간축 적분으로 각각 운동량/에너지를 만들고, 에너지 고착이 질량으로 나타난다", ha="center", fontsize=10.5)

save_fig(fig, "g01_force_to_mass_hierarchy.jpg")
