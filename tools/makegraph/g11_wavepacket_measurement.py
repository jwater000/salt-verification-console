import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

base_x = np.linspace(-12, 12, 1200)
x = base_x + 5
k = 1.5
sigma = 2.0
carrier = np.cos(k*x)
env = np.exp(-(x+3.5)**2/(2*sigma**2))
psi = env * carrier
prob = psi**2

selected_x = 2.5
collapsed_env = np.exp(-(base_x-selected_x)**2/(2*0.55**2))
collapsed_env /= collapsed_env.max()
collapsed_wave = collapsed_env * np.cos(k * base_x)
collapsed_prob = collapsed_env**2
collapsed_prob /= collapsed_prob.max()

fig, axes = plt.subplots(2, 2, figsize=(12.8, 7), sharex="col")
(ax_tl, ax_tr), (ax_bl, ax_br) = axes

# left: before measurement
ax_tl.plot(x, psi, color="#3182bd", lw=1.5, label="파동 진폭")
ax_tl.plot(x, env, color="#9ecae1", lw=2, ls="--", label="외피")
ax_tl.axvline(selected_x, color="#e6550d", ls="--", alpha=0.9, label="선택 좌표")
ax_tl.scatter([selected_x], [np.interp(selected_x, x, env)], color="#e6550d", s=42, zorder=4)
ax_tl.set_title("측정 전: 퍼진 상태")
ax_tl.legend(loc="upper right", fontsize=9)

ax_bl.plot(x, prob/prob.max(), color="#31a354", lw=2, label="확률 밀도")
ax_bl.fill_between(x, 0, collapsed_prob, color="#e6550d", alpha=0.25, label="선택될 수 있는 국소 결과")
ax_bl.axvline(selected_x, color="#e6550d", ls="--")
ax_bl.set_xlabel("위치 x (측정 전)")
ax_bl.legend(loc="upper right", fontsize=9)

# right: after measurement (localized outcome)
ax_tr.plot(base_x, collapsed_wave, color="#e6550d", lw=1.7, label="국소 파동 상태")
ax_tr.plot(base_x, collapsed_env, color="#fdae6b", lw=2, ls="--", label="국소 외피")
ax_tr.axvline(selected_x, color="#e6550d", ls="--")
ax_tr.set_title("측정 후: 국소 결과로 확정")
ax_tr.legend(loc="upper right", fontsize=9)

ax_br.fill_between(base_x, 0, collapsed_prob, color="#e6550d", alpha=0.35, label="확정된 국소 확률 분포")
ax_br.axvline(selected_x, color="#e6550d", ls="--")
ax_br.set_xlabel("위치 x (측정 후)")
ax_br.legend(loc="upper right", fontsize=9)

# make left/right panels visually separated (not one continuous x-axis)
for ax in (ax_tl, ax_bl, ax_tr, ax_br):
    ax.set_xlim(-7, 9)
    ax.grid(alpha=0.2)
for ax in (ax_tr, ax_br):
    ax.spines["left"].set_visible(False)
for ax in (ax_tl, ax_bl):
    ax.spines["right"].set_visible(False)

# arrows: left -> right on top and bottom rows
ax_tl.annotate(
    "",
    xy=(0.56, 0.72),
    xytext=(0.44, 0.72),
    xycoords=fig.transFigure,
    textcoords=fig.transFigure,
    arrowprops=dict(arrowstyle="->", lw=2.2, color="#444444"),
)
ax_bl.annotate(
    "",
    xy=(0.56, 0.29),
    xytext=(0.44, 0.29),
    xycoords=fig.transFigure,
    textcoords=fig.transFigure,
    arrowprops=dict(arrowstyle="->", lw=2.2, color="#444444"),
)

fig.text(0.5, 0.745, "측정 입력", ha="center", va="bottom", fontsize=10, color="#444444")
fig.text(0.5, 0.315, "국소 결과 선택", ha="center", va="bottom", fontsize=10, color="#444444")
fig.suptitle("g11: 측정 전 분포 -> 측정 후 국소 확정", fontsize=15)
fig.subplots_adjust(wspace=0.22, hspace=0.24, top=0.90)
save_fig(fig, "g11_wavepacket_measurement.jpg")
