import numpy as np
import matplotlib.pyplot as plt
from _graph_common import setup_style, save_fig

setup_style()

fs = 400
t = np.linspace(0, 4, 4*fs)
f0, f1 = 20, 180
phase = 2*np.pi*(f0*t + (f1-f0)/(2*4)*t**2)
amp = 0.15 + 0.85*(t/4)**2
signal = amp * np.sin(phase)

# simple STFT
win = 128
hop = 24
spec = []
for i in range(0, len(signal)-win, hop):
    seg = signal[i:i+win] * np.hanning(win)
    fft = np.abs(np.fft.rfft(seg))
    spec.append(fft)
spec = np.array(spec).T
freqs = np.fft.rfftfreq(win, 1/fs)
times = np.arange(spec.shape[1])*hop/fs

fig, axes = plt.subplots(2, 1, figsize=(11, 7), sharex=False)
axes[0].plot(t, signal, color="#08519c")
axes[0].set_title("치프 파형 (시간 영역)", pad=10)
axes[0].set_xlabel("시간 [초]")
axes[0].set_ylabel("변형률 (정규화)")

im = axes[1].pcolormesh(times, freqs, spec, shading="auto", cmap="inferno")
axes[1].set_ylim(0, 220)
axes[1].set_title("시간-주파수 상승: 우주 병합의 소리를 보다", pad=10)
axes[1].set_xlabel("시간 [초]")
axes[1].set_ylabel("주파수 [Hz]")
fig.colorbar(im, ax=axes[1], label="크기")

fig.suptitle("g07: 중력파 치프 신호", y=0.98)
fig.subplots_adjust(hspace=0.42, top=0.90)
save_fig(fig, "g07_gravity_wave_chirp.jpg")
