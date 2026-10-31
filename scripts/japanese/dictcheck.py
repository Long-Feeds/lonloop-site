"""Pitch-accent lookup in two independent dictionaries (+ a third as tie-breaker).

  * UniDic (unidic-lite 2.1.2, NINJAL) — `aType` of the token, BSD/LGPL/GPL
  * Kanjium accents.txt (CC BY-SA 4.0, Uros O.) — (word, reading) -> accents
  * en.wiktionary {{ja-pron|acc=..}} — fetched only when the first two disagree

A word's accent is "verified" only when UniDic and Kanjium share a first-listed
value. If either lists more than one accepted accent the word is flagged
`multi` and is kept out of the pitch drills (a drill whose "wrong" answer is
also correct teaches nothing).
"""
import json, os, re, time, urllib.parse, urllib.request

import fugashi
import jaconv

RAW = os.environ.get("JA_RAW", os.path.expanduser("~/.agents/workspace/japanese/raw"))
UA = "lonloop-japanese-study/0.1 (+https://github.com/Long-Feeds)"

_tagger = fugashi.Tagger()
_kanjium = None


def _load_kanjium():
    global _kanjium
    if _kanjium is None:
        _kanjium = {}
        with open(os.path.join(RAW, "kanjium-accents.txt"), encoding="utf-8") as f:
            for line in f:
                parts = line.rstrip("\n").split("\t")
                if len(parts) < 3:
                    continue
                word, reading, acc = parts[0], parts[1], parts[2]
                vals = [int(x) for x in re.findall(r"\d+", acc)]
                _kanjium.setdefault((word, reading), vals)
                if reading and (reading, reading) not in _kanjium:
                    pass
    return _kanjium


def kanjium(w, r):
    k = _load_kanjium()
    for key in ((w, r), (r, r), (jaconv.hira2kata(w), r)):
        if key in k:
            return k[key]
    return None


def unidic(w, r):
    toks = list(_tagger(w))
    if len(toks) != 1:
        return None, [t.surface for t in toks]
    t = toks[0]
    kana = jaconv.kata2hira(t.feature.kana or "")
    if kana != r:
        return None, [f"reading:{kana}"]
    a = getattr(t.feature, "aType", None)
    if not a or a == "*":
        return None, ["no-aType"]
    return [int(x) for x in re.findall(r"\d+", a)], []


_wikt_cache_dir = os.path.join(RAW, "wikt-acc")


def wiktionary(w, r):
    os.makedirs(_wikt_cache_dir, exist_ok=True)
    fn = os.path.join(_wikt_cache_dir, f"{w}.json")
    if not os.path.exists(fn):
        q = urllib.parse.urlencode({"action": "parse", "page": w, "prop": "wikitext", "format": "json", "formatversion": "2"})
        req = urllib.request.Request(f"https://en.wiktionary.org/w/api.php?{q}", headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                d = json.load(resp)
        except Exception as e:  # network trouble = no third vote, not a crash
            return None
        json.dump(d, open(fn, "w"), ensure_ascii=False)
        time.sleep(0.2)
    d = json.load(open(fn))
    text = d.get("parse", {}).get("wikitext", "")
    out = []
    for m in re.finditer(r"\{\{ja-pron\|([^}]*)\}\}", text):
        args = m.group(1).split("|")
        pos = [a for a in args if "=" not in a]
        if pos and jaconv.kata2hira(pos[0]).replace(".", "").replace("ー", "") .replace(" ", "") != r.replace("ー", ""):
            # reading mismatch: different word sharing the spelling
            if jaconv.kata2hira(pos[0]).replace(".", "").replace(" ", "") != r:
                continue
        for a in args:
            mm = re.match(r"acc\d*=(\d+)$", a.strip())
            if mm:
                out.append(int(mm.group(1)))
    return out or None


def lookup(w, r):
    u, why = unidic(w, r)
    k = kanjium(w, r)
    res = {"w": w, "r": r, "unidic": u, "unidic_note": why, "kanjium": k}
    if u and k and u[0] == k[0]:
        res["accent"] = u[0]
        res["status"] = "agree"
        res["multi"] = len(set(u + k)) > 1
        return res
    wk = wiktionary(w, r)
    res["wiktionary"] = wk
    votes = [v[0] for v in (u, k, wk) if v]
    if len(votes) >= 2 and votes.count(max(set(votes), key=votes.count)) >= 2:
        best = max(set(votes), key=votes.count)
        res["accent"] = best
        res["status"] = "majority"
        res["multi"] = len(set((u or []) + (k or []) + (wk or []))) > 1
        return res
    res["accent"] = None
    res["status"] = "unresolved"
    res["multi"] = True
    return res


if __name__ == "__main__":
    import sys
    for arg in sys.argv[1:]:
        w, r = arg.split(":")
        print(json.dumps(lookup(w, r), ensure_ascii=False))
