import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

labels = ["핵자", "중간자", "전자"]
components = {
    "고유 성분": [0.1, 0.2, 0.95],
    "결합 / 장력": [0.55, 0.35, 0.02],
    "동적 장 성분": [0.35, 0.45, 0.03],
}
colors = ["#9ecae1", "#fc9272", "#74c476"]

bottom = [0, 0, 0]
for (k, v), c in zip(components.items(), colors):
    axes[0].bar(labels, v, bottom=bottom, label=k, color=c)
    bottom = [a + b for a, b in zip(bottom, v)]
axes[0].set_ylim(0, 1.15)
axes[0].set_title("질량의 층상 예산")
axes[0].legend(fontsize=8)

axes[1].axis("off")
axes[1].set_title("해석")
text = (
    "이 도식에서 관측 질량은\n"
    "단일 성분이 아니며\n\n"
    "다음의 합으로 나타난다:\n"
    "1) 고유 성분\n"
    "2) 기하학적 결합/장력\n"
    "3) 동적 장 에너지"
)
axes[1].text(0.02, 0.75, text, fontsize=12, va="top")

fig.suptitle("g05: 질량은 어디서 나타나는가")
save_fig(fig, "g05_mass_budget_stack.jpg")
