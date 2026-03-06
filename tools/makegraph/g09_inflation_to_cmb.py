import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

rng = np.random.default_rng(7)
base = rng.normal(0, 1, (200, 200))

# low-pass smooth in Fourier domain for inflation-like correlated field
F = np.fft.rfftn(base)
ky = np.fft.fftfreq(base.shape[0])[:, None]
kx = np.fft.rfftfreq(base.shape[1])[None, :]
k2 = kx**2 + ky**2
filt = np.exp(-k2 / (2*0.02**2))
smoothed = np.fft.irfftn(F * filt, s=base.shape, axes=(0, 1))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].imshow(base, cmap="coolwarm")
axes[0].set_title("원시 양자 요동")
axes[0].axis("off")
im = axes[1].imshow(smoothed, cmap="coolwarm")
axes[1].set_title("인플레이션으로 늘어난 흔적 (CMB 유사)")
axes[1].axis("off")
fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.8, label="밀도 요동")

fig.suptitle("g09: 미세 요동에서 우주 흔적으로")
save_fig(fig, "g09_inflation_to_cmb.jpg")
