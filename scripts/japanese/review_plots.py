"""Plots for the manual pitch review of the accent lesson (see reports/manual_pitch.json).

Homophone sets are overlaid per voice on the same frame 「〜があります」, so the
reviewer compares the members against each other (where does each one fall?),
which does not depend on finding mora boundaries exactly."""
import os, sys, json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
import pitch
from items import load_content, slug
from kana import morae
import dictcheck

fp = "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
font_manager.fontManager.addfont(fp)
plt.rcParams["font.family"] = font_manager.FontProperties(fname=fp).get_name()
C = os.path.expanduser("~/.agents/workspace/japanese/audio-cache")
OUT = os.path.expanduser("~/.agents/workspace/japanese/verify/review")
os.makedirs(OUT, exist_ok=True)
c = load_content()

def contour(path, voice, reading, n_keep):
    spans = pitch.mora_spans(path, reading)
    t, st = pitch.f0_track(path, voice)
    t0 = spans[0][1]
    t1 = spans[min(n_keep, len(spans)) - 1][2]
    sel = (t >= t0 - 0.02) & (t <= t1 + 0.25)
    return t[sel] - t0, st[sel], [(m, s - t0, e - t0) for m, s, e in spans[:n_keep]]

# (a) homophone sets, carriers overlaid
sets = c["pairs"]["accent"]
fig, axes = plt.subplots(len(sets), 2, figsize=(12, 2.6 * len(sets)))
for i, p in enumerate(sets):
    for j, v in enumerate("nk"):
        ax = axes[i][j]
        for x in p["items"]:
            a = dictcheck.lookup(x["w"], x["r"])["accent"]
            path = os.path.join(C, v, slug(x["w"], x["r"]) + "-ga.mp3")
            n = len(morae(x["r"]))
            t, st, spans = contour(path, v, x["r"] + "があります", n + 2)
            ax.plot(t, st, ".-", ms=2, lw=1, label=f"{x['w']}（{a}）")
        for m, s, e in spans:
            ax.axvline(s, color="#ccc", lw=0.6); ax.text((s + e) / 2, ax.get_ylim()[1], m, ha="center", va="top", fontsize=9)
        ax.set_title(f"{p['items'][0]['r']}があります · {'女声' if v == 'n' else '男声'}", fontsize=10)
        ax.legend(fontsize=8, loc="lower left")
fig.tight_layout(); fig.savefig(os.path.join(OUT, "a_sets.png"), dpi=70)

# (b) accent-type examples, bare words
words = [(k, x) for k in ["heiban", "atamadaka", "nakadaka", "odaka"] for x in c["accent_types"][k]]
fig, axes = plt.subplots(len(words), 2, figsize=(10, 1.9 * len(words)))
for i, (k, x) in enumerate(words):
    a = dictcheck.lookup(x["w"], x["r"])
    for j, v in enumerate("nk"):
        ax = axes[i][j]
        path = os.path.join(C, v, slug(x["w"], x["r"]) + ".mp3")
        n = len(morae(x["r"]))
        t, st, spans = contour(path, v, x["r"], n)
        ax.plot(t, st, ".-", ms=2, lw=1)
        for m, s, e in spans:
            ax.axvline(s, color="#ccc", lw=0.6); ax.text((s + e) / 2, np.nanmax(st) if np.any(~np.isnan(st)) else 0, m, ha="center", va="bottom", fontsize=9)
        ax.set_title(f"{x['w']} {x['r']} · 词典 {a['accent']}{'（多读法）' if a.get('multi') else ''} · {k} · {'女' if v == 'n' else '男'}", fontsize=9)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "b_types.png"), dpi=60)
print("ok")
