import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

beta = np.linspace(0, 0.98, 220)
gamma = 1.0 / np.sqrt(1 - beta**2)

t0 = np.ones_like(beta)                # mc^2
t2 = 0.5 * beta**2                     # 1/2 mv^2 / mc^2
t4 = 3.0 / 8.0 * beta**4               # 3/8 mv^4/c^2 / mc^2
t6 = 5.0 / 16.0 * beta**6
approx = t0 + t2 + t4 + t6

fig, ax = plt.subplots(figsize=(10.5, 6))
ax.plot(beta, gamma, color="black", lw=2.2, label="정확식 γ")
ax.plot(beta, approx, color="#d62728", lw=2, ls="--", label="테일러 6차 근사")
ax.plot(beta, t0, color="#1f77b4", lw=1.6, label="1")
ax.plot(beta, t2, color="#2ca02c", lw=1.6, label="1/2 β^2")
ax.plot(beta, t4, color="#ff7f0e", lw=1.6, label="3/8 β^4")
ax.plot(beta, t6, color="#9467bd", lw=1.6, label="5/16 β^6")
ax.set_ylim(0, min(6.5, np.max(gamma)))
ax.set_xlabel("β = v/c")
ax.set_ylabel("E/(mc^2)")
ax.set_title("g16: 상대론 전개 계수 사다리")
ax.legend(loc="upper left", fontsize=9)
ax.text(0.58, 0.12, "1, 1/2, 3/8, 5/16 ...", transform=ax.transAxes, fontsize=10)

save_fig(fig, "g16_relativistic_series_ladder.jpg")
