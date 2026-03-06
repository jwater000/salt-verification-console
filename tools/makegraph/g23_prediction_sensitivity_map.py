import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

experiments = ["LIGO-HF", "CMB-S4", "뮤온 g-2", "중성미자", "21cm", "충돌기"]
signals = ["스냅백", "위상 표류", "타이밍 오프셋", "분산", "비등방성", "잔차"]

rng = np.random.default_rng(17)
M = rng.uniform(0.1, 1.0, (len(signals), len(experiments)))
M[0, 0] = 0.98
M[1, 1] = 0.95
M[3, 3] = 0.92

fig, ax = plt.subplots(figsize=(10, 6))
im = ax.imshow(M, cmap="YlOrRd", vmin=0, vmax=1)
ax.set_xticks(np.arange(len(experiments)), experiments, rotation=20)
ax.set_yticks(np.arange(len(signals)), signals)
for i in range(M.shape[0]):
    for j in range(M.shape[1]):
        ax.text(j, i, f"{M[i,j]:.2f}", ha="center", va="center", fontsize=8)
ax.set_title("g23: 예측과 실험 감도 지도")
fig.colorbar(im, ax=ax, label="검출 가능성")
save_fig(fig, "g23_prediction_sensitivity_map.jpg")
