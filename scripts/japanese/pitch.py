"""Does the synthesized audio actually carry the dictionary accent?

TTS engines are good at Tokyo accent but not perfect, and a learner who hears
「はし」 with the wrong pitch while reading 「橋②」 is being taught the error by
the page itself. So every word whose accent we print is measured:

 1. Locate the morae in time — CTC forced alignment of the expected phone
    sequence against wav2vec2-xlsr-53-espeak-cv-ft posteriors (Viterbi, no
    external aligner). Long vowels share one token and are split in half.
 2. Track F0 with Praat (parselmouth), convert to semitones.
 3. Take a robust pitch per mora (median of the later 2/3 of the mora).
 4. Compare the shape with the accent type: the accent nucleus is the mora after
    which pitch falls; 平板 has no fall even onto the following が.

The bare word cannot separate 平板 from 尾高 (they differ only on the particle),
so the decisive measurement is on the framed clip 「〜があります」.
"""
import math

import numpy as np
import parselmouth

import phoneme_asr as P
from kana import morae, hl_pattern

V = P._vocab
# kana mora -> phone tokens (model vocab). Long-vowel second halves are handled
# in tokens_for(), っ has no token (it is a closure: silent or frication).
CONS = {
    "": [], "k": ["k"], "g": ["ɡ"], "s": ["s"], "sh": ["ɕ"], "z": ["z"], "j": ["dʑ"],
    "t": ["t"], "ch": ["tɕ"], "ts": ["ts"], "d": ["d"], "n": ["n"], "ny": ["ɲ"],
    "h": ["h"], "hy": ["ç"], "f": ["ɸ"], "b": ["b"], "p": ["p"], "m": ["m"],
    "y": ["j"], "r": ["ɾ"], "w": ["w"], "ky": ["kʲ"], "gy": ["ɡʲ"], "my": ["mʲ"],
    "ry": ["ɾ", "j"], "by": ["b", "j"], "py": ["p", "j"], "v": ["b"],
    "dy": ["d", "j"], "ty": ["t", "j"], "fy": ["ɸ", "j"],
}
VOW = {"a": "a", "i": "i", "u": "ɯ", "e": "e", "o": "o"}
LONG = {"a": "aː", "i": "iː", "u": "uː", "e": "eː", "o": "oː"}

_BASE = {}
for row, cons in [("あいうえお", ""), ("かきくけこ", "k"), ("がぎぐげご", "g"), ("さしすせそ", "s"),
                  ("ざじずぜぞ", "z"), ("たちつてと", "t"), ("だぢづでど", "d"), ("なにぬねの", "n"),
                  ("はひふへほ", "h"), ("ばびぶべぼ", "b"), ("ぱぴぷぺぽ", "p"), ("まみむめも", "m"),
                  ("らりるれろ", "r")]:
    for ch, v in zip(row, "aiueo"):
        _BASE[ch] = (cons, v)
_BASE.update({"し": ("sh", "i"), "じ": ("j", "i"), "ち": ("ch", "i"), "つ": ("ts", "u"), "ぢ": ("j", "i"),
              "づ": ("z", "u"), "に": ("ny", "i"), "ひ": ("hy", "i"), "ふ": ("f", "u"),
              "や": ("y", "a"), "ゆ": ("y", "u"), "よ": ("y", "o"), "わ": ("w", "a"), "を": ("", "o"),
              "き": ("ky", "i"), "ぎ": ("gy", "i"), "み": ("my", "i"), "ゔ": ("v", "u")})
_YOON = {"き": "ky", "ぎ": "gy", "し": "sh", "じ": "j", "ち": "ch", "に": "ny", "ひ": "hy",
         "み": "my", "り": "ry", "び": "by", "ぴ": "py", "で": "dy", "て": "ty", "ふ": "fy"}
_SMALLV = {"ゃ": "a", "ゅ": "u", "ょ": "o"}


def mora_parts(m):
    """(consonant-class, vowel) for one mora, or a special: 'Q', 'N', 'R' (long)."""
    if m == "っ":
        return ("Q", None)
    if m == "ん":
        return ("N", None)
    if m == "ー":
        return ("R", None)
    if len(m) == 2 and m[1] in _SMALLV:
        return (_YOON[m[0]], _SMALLV[m[1]])
    if len(m) == 2 and m[1] in "ぁぃぅぇぉ":  # ふぁ, てぃ, うぃ … (loanwords)
        c, _ = _BASE.get(m[0], ("", "a"))
        if m[0] == "う":
            c = "w"
        return (c, "aiueo"["ぁぃぅぇぉ".index(m[1])])
    return _BASE[m]


def is_long(prev_v, m):
    """Is mora m the second half of a long vowel after a mora ending in prev_v?"""
    if m == "ー":
        return True
    if prev_v is None:
        return False
    return (prev_v, m) in {("a", "あ"), ("i", "い"), ("u", "う"), ("e", "い"), ("e", "え"), ("o", "う"), ("o", "お")}


def tokens_for(reading):
    """Expected token sequence + for each token the list of morae it covers."""
    ms = morae(reading)
    toks, owners = [], []
    prev_v = None
    for i, m in enumerate(ms):
        c, v = mora_parts(m)
        if c != "R" and not is_long(prev_v, m):
            if c == "Q":
                prev_v = None
                continue  # closure: no token, owner = gap before next consonant
            if c == "N":
                toks.append("n"); owners.append([i]); prev_v = None
                continue
            for t in CONS[c]:
                toks.append(t); owners.append([i])
            toks.append(VOW[v]); owners.append([i]); prev_v = v
        else:
            # long vowel: replace the previous vowel token by its long form, owned by both morae
            j = len(toks) - 1
            toks[j] = LONG[prev_v]
            owners[j] = owners[j] + [i]
    return ms, toks, owners


def ctc_align(logp, targets):
    """Viterbi CTC forced alignment. logp: T×V log-probs; targets: list of ids.
    Returns, per target, (first_frame, last_frame)."""
    T = logp.shape[0]
    blank = P._blank
    ext = [blank]
    for t in targets:
        ext += [t, blank]
    S = len(ext)
    NEG = -1e30
    dp = np.full((T, S), NEG)
    bp = np.zeros((T, S), dtype=np.int32)
    dp[0, 0] = logp[0, ext[0]]
    if S > 1:
        dp[0, 1] = logp[0, ext[1]]
    for t in range(1, T):
        for s in range(S):
            best, arg = dp[t - 1, s], s
            if s >= 1 and dp[t - 1, s - 1] > best:
                best, arg = dp[t - 1, s - 1], s - 1
            if s >= 2 and ext[s] != blank and ext[s] != ext[s - 2] and dp[t - 1, s - 2] > best:
                best, arg = dp[t - 1, s - 2], s - 2
            dp[t, s] = best + logp[t, ext[s]]
            bp[t, s] = arg
    s = S - 1 if dp[T - 1, S - 1] >= dp[T - 1, S - 2] else S - 2
    path = [0] * T
    for t in range(T - 1, -1, -1):
        path[t] = s
        s = bp[t, s]
    spans = [[None, None] for _ in targets]
    for t, s in enumerate(path):
        if s % 2 == 1:
            k = s // 2
            if spans[k][0] is None:
                spans[k][0] = t
            spans[k][1] = t
    return spans


def logprobs(path):
    import torch, librosa
    y, sr = librosa.load(path, sr=16000)
    y = (y - y.mean()) / (y.std() + 1e-7)
    with torch.no_grad():
        lg = P._model(torch.tensor(y)[None]).logits[0]
    return torch.log_softmax(lg, dim=-1).numpy(), len(y) / 16000.0


FRAME = 0.02  # wav2vec2 frame hop


def mora_spans(path, reading):
    """[(mora, t_start, t_end)] in seconds."""
    ms, toks, owners = tokens_for(reading)
    lp, dur = logprobs(path)
    ids = [V[t] for t in toks]
    spans = ctc_align(lp, ids)
    # token spans -> mora spans: a mora starts at its first token's first frame
    starts = {}
    for (f0, f1), own in zip(spans, owners):
        if f0 is None:
            continue
        if len(own) == 1:
            starts.setdefault(own[0], f0 * FRAME)
        else:  # long vowel token covering two morae: split it in half
            mid = (f0 + f1 + 1) / 2 * FRAME
            starts.setdefault(own[0], f0 * FRAME)
            starts.setdefault(own[1], mid)
    # morae without a token (っ) start where the previous mora's tokens end
    tok_end = {}
    for (f0, f1), own in zip(spans, owners):
        if f1 is not None:
            for o in own:
                tok_end[o] = max(tok_end.get(o, 0), (f1 + 1) * FRAME)
    for i in range(len(ms)):
        if i not in starts:
            starts[i] = tok_end.get(i - 1, starts.get(i - 1, 0) + 0.05)
    last_end = max(tok_end.values()) if tok_end else dur
    out = []
    for i, m in enumerate(ms):
        s = starts[i]
        e = starts[i + 1] if i + 1 < len(ms) else last_end + 0.04
        out.append((m, s, max(e, s + 0.02)))
    return out


def f0_track(path, voice):
    snd = parselmouth.Sound(path)
    lo, hi = (75, 300) if voice == "k" else (120, 500)
    pitch = snd.to_pitch_ac(time_step=0.01, pitch_floor=lo, pitch_ceiling=hi)
    t = pitch.xs()
    f = pitch.selected_array["frequency"]
    st = np.where(f > 0, 12 * np.log2(np.maximum(f, 1e-6) / 100.0), np.nan)
    return t, st


def mora_pitch(t, st, spans):
    vals = []
    for m, s, e in spans:
        a = s + (e - s) / 3.0
        sel = (t >= a) & (t < e) & ~np.isnan(st)
        if sel.sum() < 2:
            sel = (t >= s) & (t < e) & ~np.isnan(st)
        vals.append(float(np.median(st[sel])) if sel.sum() >= 2 else None)
    return vals


def classify(vals, n_word, has_particle):
    """Infer the accent nucleus from per-mora pitch.

    Returns (nucleus, drop_semitones, details). nucleus = k means the pitch falls
    right after mora k (1-based); 0 = no fall (平板, or 尾高 when no particle
    follows). The FIRST clear fall is the nucleus, not the largest one: after a
    頭高 word the low morae keep sinking (雨があります measured 21.4 → 17.3 →
    12.5 st), and "largest drop" would put the nucleus one mora late."""
    idx = [i for i, v in enumerate(vals) if v is not None]
    if len(idx) < 2:
        return None, 0.0, "no-voiced-morae"
    for a, b in zip(idx, idx[1:]):
        d = vals[a] - vals[b]
        if d >= 1.5:
            return a + 1, d, f"fall {d:.1f}st between mora {a+1} and {b+1}" + (" (gap)" if b - a > 1 else "")
    d = max(vals[a] - vals[b] for a, b in zip(idx, idx[1:]))
    return 0, d, "no-fall"


def check(word_path, carrier_path, reading, accent, voice):
    """Verify one word in one voice. Returns dict with status and measurements."""
    n = len(morae(reading))
    res = {"n": n, "accent": accent}
    out_ok = True
    # carrier: word + が
    if carrier_path:
        spans = mora_spans(carrier_path, reading + "があります")[: n + 1]
        t, st = f0_track(carrier_path, voice)
        vals = mora_pitch(t, st, spans)
        nuc, d, why = classify(vals, n, True)
        res["carrier"] = {"vals": vals, "nucleus": nuc, "drop": round(d, 2), "why": why,
                          "spans": [(m, round(s, 3), round(e, 3)) for m, s, e in spans]}
        # devoiced morae (None) between a fall make the nucleus ambiguous: accept
        # if the expected nucleus lies inside the gap
        ok = nuc == accent
        if not ok and nuc not in (None, 0) and accent != 0:
            idx = [i for i, v in enumerate(vals) if v is not None]
            a = nuc - 1
            nxt = [i for i in idx if i > a]
            if nxt and a + 1 <= accent <= nxt[0]:
                # e.g. fall measured from mora 1 to mora 3 with mora 2 devoiced
                ok = all(vals[i] is None for i in range(a + 1, accent))
        res["carrier"]["ok"] = ok
        out_ok &= ok
    # bare word: 平板 and 尾高 must show no internal fall; 頭高/中高 fall after mora k
    spans = mora_spans(word_path, reading)
    t, st = f0_track(word_path, voice)
    vals = mora_pitch(t, st, spans)
    nuc, d, why = classify(vals, n, False)
    expect = 0 if accent in (0, n) else accent
    ok = nuc == expect
    if n == 1:
        ok = True  # one mora: nothing to compare inside the word; the frame decides
    if not ok and expect == 0 and nuc == n - 1 and d < 3.0:
        # a mild fall into the last mora of a bare word is utterance-final
        # lowering, not an accent; the framed clip has already ruled on 0 vs n-1
        ok = True
    if not ok and nuc not in (None, 0) and expect != 0:
        idx = [i for i, v in enumerate(vals) if v is not None]
        a = nuc - 1
        nxt = [i for i in idx if i > a]
        if nxt and a + 1 <= expect <= nxt[0]:
            ok = all(vals[i] is None for i in range(a + 1, expect))
    res["word"] = {"vals": vals, "nucleus": nuc, "drop": round(d, 2), "why": why, "ok": ok,
                   "spans": [(m, round(s, 3), round(e, 3)) for m, s, e in spans]}
    out_ok &= ok
    res["ok"] = bool(out_ok)
    return res


def contour(path, voice, spans, points=60):
    """Downsampled F0 contour for the page's pitch graph: [(t, semitone|None)]."""
    t, st = f0_track(path, voice)
    if not len(t):
        return []
    t0 = spans[0][1] if spans else t[0]
    t1 = spans[-1][2] if spans else t[-1]
    grid = np.linspace(t0, t1, points)
    out = []
    for g in grid:
        j = int(np.argmin(np.abs(t - g)))
        v = st[j]
        out.append((round(float(g - t0), 3), None if (np.isnan(v) or abs(t[j] - g) > 0.02) else round(float(v), 2)))
    return out
