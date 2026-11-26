"""Verify every synthesized clip before it can reach a page.

Per clip:
  1. signal  — not silent: at least 150 ms above -35 dB.
  2. reading — Whisper large-v3-turbo transcribes the clip; after normalizing
               (case, punctuation, contractions, numbers, US/UK spelling) the
               words must equal the text we teach, word for word. A mismatch gets
               a second opinion from Whisper large-v3; it passes only if that one
               matches exactly.
A learner doing dictation is graded against our text, so a clip that says
anything else would mark them wrong for hearing correctly. Failures are left
out of the site (build.py), never patched by hand — except entries recorded in
reports/manual_accept.json, each with the reason it was judged acceptable: the
transcript differs only by a homophone no ASR can resolve from sound alone
(write/right, cache/cash) or by how a number is written (one forty / 140).

Output: reports/verify.json — every clip, every transcript, pass/fail.
"""
import json, os, re, subprocess, sys

import mlx_whisper
from num2words import num2words

from gen_audio import CACHE, key, paths
from items import HERE, all_items

REPORT = os.path.join(HERE, "reports", "verify.json")
MANUAL = os.path.join(HERE, "reports", "manual_accept.json")
TURBO = "mlx-community/whisper-large-v3-turbo"
LARGE = "mlx-community/whisper-large-v3-mlx"

CONTRACTIONS = {
    "won't": "will not", "can't": "can not", "cannot": "can not", "shan't": "shall not", "ain't": "is not",
    "let's": "let us", "y'all": "you all",
}
SUFFIX = [("n't", " not"), ("'re", " are"), ("'ve", " have"), ("'ll", " will"), ("'m", " am"), ("'d", " d")]
SPELL = {"ok": "okay", "alright": "all right", "email": "e mail", "emails": "e mails", "per cent": "percent"}
UK_US = [(r"isation", "ization"), (r"ise\b", "ize"), (r"ised\b", "ized"), (r"ising\b", "izing"),
         (r"our\b", "or"), (r"ours\b", "ors"), (r"tre\b", "ter"), (r"lled\b", "led"), (r"lling\b", "ling")]


def _num(tok):
    # clock times: whisper writes "two thirty" as 2:30 or 2.30
    if re.fullmatch(r"\d{1,2}[:.][0-5]\d", tok):
        h, m = re.split(r"[:.]", tok)
        return num2words(int(h)) + ("" if m == "00" else " " + (("oh " + num2words(int(m))) if m.startswith("0") else num2words(int(m))))
    if re.fullmatch(r"\d+(st|nd|rd|th)", tok):
        return num2words(int(re.sub(r"\D", "", tok)), to="ordinal")
    if re.fullmatch(r"\d+(\.\d+)?%?", tok):
        pct = tok.endswith("%")
        t = tok.rstrip("%")
        w = num2words(float(t)) if "." in t else num2words(int(t))
        return w + (" percent" if pct else "")
    return tok


def norm(s):
    s = s.lower().replace("’", "'").replace("‘", "'").replace("—", " ").replace("–", " ")
    s = re.sub(r"\$(\d[\d,]*)", lambda m: m.group(1).replace(",", "") + " dollars", s)
    s = re.sub(r"(\d),(\d{3})", r"\1\2", s)
    toks = []
    for t in re.split(r"[\s/]+", s):
        t = t.strip(".,!?;:\"()[]…")
        if not t:
            continue
        t = _num(t)
        toks.append(t)
    s = " ".join(toks)
    for k, v in CONTRACTIONS.items():
        s = re.sub(rf"\b{re.escape(k)}\b", v, s)
    for suf, rep in SUFFIX:
        s = re.sub(rf"(\w){re.escape(suf)}\b", rf"\1{rep}", s)
    s = re.sub(r"'s\b", " s", s)  # it's / John's: both sides get the same token
    s = s.replace("-", " ").replace("'", "")
    for k, v in SPELL.items():
        s = re.sub(rf"\b{k}\b", v, s)
    words = []
    for w in re.sub(r"[^a-z0-9 ]", " ", s).split():
        for a, b in UK_US:
            w = re.sub(a, b, w)
        words.append(w)
    # whisper may write "number two" as "No. 2"; leave those to manual review
    return words


def same(heard, text):
    """Word-for-word equal after norm(). Word *boundaries* alone may differ
    (shout-out / shoutout, hot spots / hotspots, upfront / up front): the
    letters and their order must still match exactly, so no sound can differ."""
    a, b = norm(heard), norm(text)
    return a == b or "".join(a) == "".join(b)


def signal_ok(path):
    out = subprocess.run(["ffmpeg", "-i", path, "-af", "silencedetect=noise=-35dB:d=0.05", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = next((float(m.group(1)) for m in [re.search(r"Duration: \d+:\d+:([\d.]+)", out)] if m), 0.0)
    silent = sum(float(x) for x in re.findall(r"silence_duration: ([\d.]+)", out))
    return dur - silent >= 0.15, round(dur, 2)


def transcribe(path, model):
    r = mlx_whisper.transcribe(path, path_or_hf_repo=model, language="en", temperature=0.0,
                               condition_on_previous_text=False, verbose=None)
    return r["text"].strip()


def main():
    items = all_items()
    old = json.load(open(REPORT)) if os.path.exists(REPORT) else {}
    manual = json.load(open(MANUAL)) if os.path.exists(MANUAL) else {}
    out = {}
    for n, it in enumerate(items):
        _, mp3, _ = paths(it)
        k = key(it)
        prev = old.get(it["id"])
        if prev and prev.get("key") == k and "turbo" in prev:
            rec = prev
        else:
            if not os.path.exists(mp3):
                out[it["id"]] = dict(key=k, text=it["text"], ok=False, reason="missing")
                continue
            sig, dur = signal_ok(mp3)
            rec = dict(key=k, kind=it["kind"], voice=it["voice"], rate=it["rate"], text=it["text"], dur=dur, signal=sig)
            rec["turbo"] = transcribe(mp3, TURBO) if sig else ""
            if sig and norm(rec["turbo"]) != norm(it["text"]):
                rec["large"] = transcribe(mp3, LARGE)
        rec["match_turbo"] = same(rec.get("turbo", ""), it["text"])
        rec["match_large"] = "large" in rec and same(rec["large"], it["text"])
        m = manual.get(it["id"])
        rec["manual"] = m["reason"] if m and m.get("key") == k else None
        rec["ok"] = bool(rec.get("signal")) and (rec["match_turbo"] or rec["match_large"] or bool(rec["manual"]))
        out[it["id"]] = rec
        if not rec["ok"]:
            print(f"FAIL {it['id']}: want {it['text']!r} | turbo {rec.get('turbo')!r} | large {rec.get('large')!r}")
        if n % 50 == 0:
            print(n, "/", len(items), file=sys.stderr)
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    with open(REPORT, "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1, sort_keys=True)
    ok = sum(r["ok"] for r in out.values())
    print(f"passed {ok} / {len(out)}")


if __name__ == "__main__":
    main()
