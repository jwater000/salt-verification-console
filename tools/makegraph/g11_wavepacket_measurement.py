#!/usr/bin/env python3
"""Render g11 wavepacket measurement figure."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
import numpy as np


ROOT = Path(__file__).resolve().parents[2]
OUT1 = ROOT / "assets" / "images" / "graph" / "g11_wavepacket_measurement.jpg"
OUT2 = ROOT / "web" / "public" / "book-graphs" / "g11_wavepacket_measurement.jpg"


def gauss(x: np.ndarray, mu: float, sigma: float) -> np.ndarray:
    return np.exp(-0.5 * ((x - mu) / sigma) ** 2)


def main() -> None:
    x = np.linspace(-7, 9, 1200)
    x0 = 2.5

    plt.style.use("seaborn-v0_8-whitegrid")
    font_path = Path("/usr/share/fonts/truetype/nanum/NanumGothic.ttf")
    if font_path.exists():
        fm.fontManager.addfont(str(font_path))
        plt.rcParams["font.family"] = fm.FontProperties(fname=str(font_path)).get_name()
    plt.rcParams["axes.unicode_minus"] = False
    fig, axs = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    fig.subplots_adjust(left=0.06, right=0.96, bottom=0.1, top=0.88, wspace=0.24, hspace=0.24)
    fig.suptitle("g11: 측정 전 분포 -> 측정 후 국소 확정", fontsize=22)

    # Pre-measurement: broad state centered near the reference line (balanced left/right).
    env_pre = gauss(x, x0, 2.35)
    wave_pre = 0.95 * np.cos(2.6 * (x - x0) + 0.25) * env_pre
    prob_pre = (0.62 + 0.38 * np.cos(2.25 * (x - x0))) ** 2 * gauss(x, x0, 2.05)
    prob_pre = prob_pre / prob_pre.max()

    # Post-measurement: localized state.
    env_post = gauss(x, x0, 0.55)
    wave_post = -0.95 * np.cos(3.5 * (x - x0)) * env_post
    prob_post = gauss(x, x0, 0.36)
    prob_post = prob_post / prob_post.max()

    # Top-left.
    ax = axs[0, 0]
    ax.plot(x, wave_pre, color="#2b83ba", lw=2.5, label="파동 진폭")
    ax.plot(x, env_pre, color="#92c5de", lw=2.5, ls=(0, (4, 3)), label="외피")
    ax.axvline(x0, color="#d95f0e", ls="--", lw=2.2, alpha=0.85, label="선택 좌표")
    ax.scatter([x0], [0], color="#d95f0e", s=60, zorder=5)
    ax.set_title("측정 전: 퍼진 상태", fontsize=15)
    ax.legend(loc="upper right", frameon=False, fontsize=11)
    ax.set_ylim(-0.9, 1.1)

    # Top-right.
    ax = axs[0, 1]
    ax.plot(x, wave_post, color="#d95f0e", lw=2.5, label="국소 파동 상태")
    ax.plot(x, env_post, color="#fdbb84", lw=2.5, ls=(0, (4, 3)), label="국소 외피")
    ax.axvline(x0, color="#d95f0e", ls="--", lw=2.2, alpha=0.85)
    ax.set_title("측정 후: 국소 결과로 확정", fontsize=15)
    ax.legend(loc="upper right", frameon=False, fontsize=11)
    ax.set_ylim(-0.95, 1.1)

    # Bottom-left.
    ax = axs[1, 0]
    ax.plot(x, prob_pre, color="#31a354", lw=2.6, label="확률 밀도")
    ax.axvline(x0, color="#d95f0e", ls="--", lw=2.2, alpha=0.85)
    ax.set_xlabel("위치 x (측정 전)", fontsize=13)
    ax.legend(loc="upper right", frameon=False, fontsize=11)
    ax.set_ylim(0, 1.05)

    # Bottom-right.
    ax = axs[1, 1]
    ax.fill_between(x, prob_post, color="#f4a582", alpha=0.6, label="확정된 국소 확률 분포")
    ax.axvline(x0, color="#d95f0e", ls="--", lw=2.2, alpha=0.85)
    ax.set_xlabel("위치 x (측정 후)", fontsize=13)
    ax.legend(loc="upper right", frameon=False, fontsize=11)
    ax.set_ylim(0, 1.05)

    for ax in axs.ravel():
        ax.set_xlim(-7, 9)
        ax.tick_params(labelsize=10)
        ax.grid(alpha=0.25)

    fig.text(0.50, 0.73, "측정 입력", ha="center", va="center", fontsize=16, color="#444444")
    fig.text(0.50, 0.30, "국소 결과 선택", ha="center", va="center", fontsize=16, color="#444444")
    axs[0, 0].annotate(
        "",
        xy=(0.58, 0.73),
        xytext=(0.42, 0.73),
        xycoords=fig.transFigure,
        textcoords=fig.transFigure,
        arrowprops=dict(arrowstyle="-|>", lw=2.4, color="#444444"),
    )
    axs[1, 0].annotate(
        "",
        xy=(0.58, 0.30),
        xytext=(0.42, 0.30),
        xycoords=fig.transFigure,
        textcoords=fig.transFigure,
        arrowprops=dict(arrowstyle="-|>", lw=2.4, color="#444444"),
    )

    for out in (OUT1, OUT2):
        out.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(out, dpi=160, bbox_inches="tight")
        print(f"saved: {out}")

    plt.close(fig)


if __name__ == "__main__":
    main()
