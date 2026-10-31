"""Debug/review plot: F0 contour + aligned mora boundaries for one clip."""
import os, sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
import numpy as np
import pitch

for fp in ["/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", "/System/Library/Fonts/Hiragino Sans GB.ttc"]:
    if os.path.exists(fp):
        font_manager.fontManager.addfont(fp)
        plt.rcParams["font.family"] = font_manager.FontProperties(fname=fp).get_name()
        break

def plot(ax, path, reading, voice, title):
    spans = pitch.mora_spans(path, reading)
    t, st = pitch.f0_track(path, voice)
    ax.plot(t, st, ".", ms=3)
    vals = pitch.mora_pitch(t, st, spans)
    for (m, s, e), v in zip(spans, vals):
        ax.axvline(s, color="gray", lw=0.5)
        ax.text((s + e) / 2, np.nanmax(st) + 1 if np.any(~np.isnan(st)) else 0, m, ha="center")
        if v is not None:
            ax.plot([s + (e - s) / 3, e], [v, v], "r-", lw=2)
    ax.set_title(title)

if __name__ == "__main__":
    out = sys.argv[1]
    specs = [a.split(":") for a in sys.argv[2:]]  # path:reading:voice:title
    fig, axes = plt.subplots(len(specs), 1, figsize=(7, 2.2 * len(specs)))
    if len(specs) == 1: axes = [axes]
    for ax, (p, r, v, t) in zip(axes, specs):
        plot(ax, p, r, v, t)
    fig.tight_layout(); fig.savefig(out, dpi=80)
