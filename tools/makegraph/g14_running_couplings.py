import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

mu = np.logspace(0, 16, 400)
logm = np.log10(mu)

alpha_em = 0.0073 * (1 + 0.06*(logm/16))
alpha_weak = 0.03 + 0.0045*logm
alpha_strong = 0.42 / (1 + 0.23*logm)
alpha_grav_eff = 1e-38 * (mu**2)  # effective dimensionless growth with scale

fig, ax = plt.subplots(figsize=(10, 6))
ax.loglog(mu, alpha_em, lw=2.2, label="전자기력")
ax.loglog(mu, alpha_weak, lw=2.2, label="약력")
ax.loglog(mu, alpha_strong, lw=2.2, label="강력")
ax.loglog(mu, alpha_grav_eff, lw=2.2, label="중력 (유효)")
ax.set_xlabel("에너지 스케일")
ax.set_ylabel("유효 결합상수")
ax.set_title("g14: 일상 스케일에서 중력이 약해 보이는 이유")
ax.legend()
ax.grid(True, which="both", alpha=0.25)
save_fig(fig, "g14_running_couplings.jpg")
