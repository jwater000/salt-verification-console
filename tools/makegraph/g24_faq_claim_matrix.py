import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

questions = [f"Q{i:02d}" for i in range(1, 32)]
chapters = [f"{i:02d}" for i in range(27)]

# 18장 31개 질문을 본문/부록(00~26)과 연결한 수동 매핑
q_to_chapters = {
    1: [0, 1, 2, 13, 18, 19],
    2: [1, 2, 13, 21, 24],
    3: [2, 13, 20, 24],
    4: [10, 12, 20, 24],
    5: [10, 11, 12, 13, 24],
    6: [5, 8, 13, 20, 21, 24],
    7: [2, 5, 6, 20],
    8: [7, 24],
    9: [7, 8],
    10: [7, 20, 24],
    11: [4, 11, 24],
    12: [4, 6, 24],
    13: [6, 7, 24],
    14: [4, 9, 14, 16, 24],
    15: [3, 10, 11, 12],
    16: [10, 13, 15],
    17: [8, 14, 15, 16],
    18: [10, 11, 15],
    19: [12, 14, 15, 16, 24],
    20: [8, 9],
    21: [12, 14, 19, 21],
    22: [15, 16, 21, 24],
    23: [12, 21, 23],
    24: [12, 20, 21, 24, 25, 26],
    25: [6, 17, 21, 24],
    26: [17, 20, 22, 24, 25, 26],
    27: [12, 19, 21],
    28: [7, 17, 24],
    29: [17, 19],
    30: [0, 19],
    31: [3, 21, 23],
}

mat = np.zeros((len(questions), len(chapters)), dtype=int)
for q_idx, ch_list in q_to_chapters.items():
    for ch in ch_list:
        mat[q_idx - 1, ch] = 1

fig, ax = plt.subplots(figsize=(30, 18))
im = ax.imshow(mat, cmap="Blues", vmin=0, vmax=1, aspect="auto")
ax.set_xticks(np.arange(len(chapters)), chapters)
ax.set_yticks(np.arange(len(questions)), questions)
ax.tick_params(axis="x", labelrotation=0, labelsize=14)
ax.tick_params(axis="y", labelsize=13)

for i in range(mat.shape[0]):
    for j in range(mat.shape[1]):
        if mat[i, j] == 1:
            ax.text(j, i, "■", ha="center", va="center", fontsize=12, color="#0b1f3a")

ax.set_xlabel("Chapter (00~26)", fontsize=16)
ax.set_ylabel("FAQ Question (Q01~Q31)", fontsize=16)
ax.set_title("g24: FAQ-챕터 연계 매트릭스 (Q01~Q31 x 00~26)", fontsize=20, pad=16)
cbar = fig.colorbar(im, ax=ax, label="연계 여부 (1=연계, 0=비연계)")
cbar.ax.tick_params(labelsize=13)
cbar.set_label("연계 여부 (1=연계, 0=비연계)", fontsize=14)
fig.tight_layout()
save_fig(fig, "g24_faq_claim_matrix.jpg")
