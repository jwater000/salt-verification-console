import matplotlib.pyplot as plt
from matplotlib.sankey import Sankey
from _graph_common import setup_style, save_fig

setup_style()

fig, ax = plt.subplots(figsize=(11, 6))
ax.set_title("g17: 기하 재배치로 보는 질량-에너지 전환")

sankey = Sankey(ax=ax, unit=None, scale=1.0, gap=0.45)
sankey.add(
    flows=[1.0, -0.55, -0.30, -0.15],
    labels=["묶인 질량 상태", "복사 채널", "운동 에너지 방출", "중성미자 유사 채널"],
    orientations=[0, 1, -1, 0],
    facecolor="#9ecae1",
)
sankey.finish()

ax.text(0.02, 0.02, "해석: 질량은 저장된 기하학적 에너지의 한 표현이다", transform=ax.transAxes)
save_fig(fig, "g17_mass_energy_flow.jpg")
