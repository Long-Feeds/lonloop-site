"""Verify every synthesized clip before it can reach a page.

Checks, per clip (item × voice):
  1. signal   — the clip is not silent / clipped to nothing (voiced ≥ 60 ms).
                (Measured: the male voice returns pure silence for a bare 「あ」.)
  2. reading  — Whisper large-v3-turbo transcribes it; the transcript is turned
                back into kana (UniDic) and must equal the reading we teach.
                Mismatches get a second opinion from Whisper large-v3.
                (Measured: a bare 「端」 is read たん, not はし.)
  3. phones   — single-kana clips only: wav2vec2 IPA phone recognition must
                find the right consonant class and vowel (Whisper cannot tell
                「は」 said as ha from wa — both are written は).
  4. pitch    — words whose accent we print: see pitch.py.
                (Measured: the female voice renders 雨 and 飴 byte-identically.)

Output: reports/verify.json (every clip, every measurement) — published as-is on
/japanese/verification/.
"""
import json, os, re, sys, time

import numpy as np

from items import VOICES, all_items, load_content
from kana import morae, to_hiragana
import dictcheck

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.environ.get("JA_CACHE", os.path.expanduser("~/.agents/workspace/japanese/audio-cache"))
REPORT = os.path.join(HERE, "reports", "verify.json")

# ---------------------------------------------------------------- reading ---
import fugashi, jaconv

_tagger = fugashi.Tagger()
PUNCT = re.compile(r"[\s。、，,．.！!？?「」『』（）()・…~〜ー－-]+$")


def _num_readings(s):
    """Readings of an integer 0..99999 written in digits, with the sound changes
    (さんびゃく, ろっぴゃく, はっぴゃく, さんぜん, はっせん)."""
    n = int(s)
    D = {0: ["ぜろ", "れい"], 1: ["いち"], 2: ["に"], 3: ["さん"], 4: ["よん", "し"], 5: ["ご"], 6: ["ろく"],
         7: ["なな", "しち"], 8: ["はち"], 9: ["きゅう", "く"]}
    if n < 10:
        return set(D[n])
    out = [""]

    def cat(opts):
        nonlocal out
        out = [a + b for a in out for b in opts]

    man, rest = divmod(n, 10000)
    if man:
        cat([r + "まん" for r in _num_readings(str(man))])
    sen, rest = divmod(rest, 1000)
    if sen:
        cat({1: ["せん"], 3: ["さんぜん"], 8: ["はっせん"]}.get(sen, [r + "せん" for r in D[sen][:1]]))
    hyaku, rest = divmod(rest, 100)
    if hyaku:
        cat({1: ["ひゃく"], 3: ["さんびゃく"], 6: ["ろっぴゃく"], 8: ["はっぴゃく"]}.get(hyaku, [D[hyaku][0] + "ひゃく"]))
    juu, one = divmod(rest, 10)
    if juu:
        cat(["じゅう"] if juu == 1 else [r + "じゅう" for r in D[juu]])
    if one:
        cat(D[one])
    return set(out)


def asr_readings(text):
    """Possible kana readings of an ASR transcript (kana field and pron field)."""
    text = text.strip()
    text = re.sub(r"[\s。、，,．！!？?「」『』（）()・…~〜]", "", text)
    parts = re.split(r"(\d+)", text)
    variants = [("", "")]
    for p in parts:
        if not p:
            continue
        if p.isdigit():
            rs = _num_readings(p)
            variants = [(a + r, b + r) for a, b in variants for r in rs]
            continue
        k, pr = "", ""
        for t in _tagger(p):
            f = t.feature
            kana = f.kana if getattr(f, "kana", None) not in (None, "*") else t.surface
            pron = f.pron if getattr(f, "pron", None) not in (None, "*") else kana
            k += kana
            pr += pron
        variants = [(a + to_hiragana(k), b + to_hiragana(pr)) for a, b in variants]
    out = set()
    for a, b in variants:
        out.add(a)
        out.add(b)
    return out


VOWEL_OF = {}
for row, v in [("あかさたなはまやらわがざだばぱぁゃ", "a"), ("いきしちにひみりぎじぢびぴぃ", "i"),
               ("うくすつぬふむゆるぐずづぶぷぅゅゔ", "u"), ("えけせてねへめれげぜでべぺぇ", "e"),
               ("おこそとのほもよろをごぞどぼぽぉょ", "o")]:
    for ch in row:
        VOWEL_OF[ch] = v
VOWEL_KANA = {"a": "あ", "i": "い", "u": "う", "e": "え", "o": "お"}


def pnorm(s):
    """Phonetic normalization so spelling conventions do not count as errors:
    ぢ=じ, づ=ず, を=お, ー = repeat the previous vowel, えい→ええ, おう→おお."""
    s = to_hiragana(s)
    s = s.replace("ぢ", "じ").replace("づ", "ず").replace("を", "お")
    # ヴ is normally pronounced as バ行 (Vance 2008 via WP; 外来語の表記 allows バ)
    for a, b in (("ゔぁ", "ば"), ("ゔぃ", "び"), ("ゔぇ", "べ"), ("ゔぉ", "ぼ"), ("ゔ", "ぶ")):
        s = s.replace(a, b)
    out = []
    for ch in s:
        if ch == "ー" and out:
            out.append(VOWEL_KANA.get(VOWEL_OF.get(out[-1], ""), ""))
        else:
            out.append(ch)
    s = "".join(out)
    s = re.sub(r"(?<=[えけせてねへめれげぜでべぺ])い", "え", s)
    s = re.sub(r"(?<=[おこそとのほもよろごぞどぼぽょ])う", "お", s)
    return re.sub(r"[^ぁ-ゖ]", "", s)


def _nbest_readings(text, n=5):
    """All readings UniDic's 5-best analyses give a short transcript: a lone
    syllable often comes back as one kanji (しゅ → 主), and the 1-best reading of
    that kanji may be a different word (主 → ぬし)."""
    text = re.sub(r"[\s。、，,．！!？?「」『』（）()・…~〜]", "", text)
    out = set()
    if not text or len(text) > 3:
        return out
    try:
        for block in _tagger.nbest(text, n).split("EOS"):
            k = ""
            for line in block.strip().splitlines():
                parts = line.split("\t")
                if len(parts) > 2:
                    k += parts[2]
            if k:
                out.add(to_hiragana(k))
    except Exception:
        pass
    return out


def reading_ok(text, expected):
    exp = pnorm(expected)
    cands = {pnorm(r) for r in asr_readings(text)}
    if len(exp) <= 2:
        cands |= {pnorm(r) for r in _nbest_readings(text)}
    if len(exp) <= 2:
        # a lone syllable is often transcribed with a trailing っ or a lengthened
        # vowel (ぶ → ぶっ, ふ → ふー); that is not a different syllable
        cands |= {re.sub(r"(っ|[あいうえお])$", "", c) if len(c) > len(exp) else c for c in cands}
    return exp in cands


def _norm_written(s):
    return re.sub(r"[\s。、，,．.！!？?「」『』（）()・…~〜]", "", s)


def phone_similarity(path, reading):
    """1 - normalized edit distance between the expected phone classes of
    `reading` and what the IPA recognizer hears. Used when Whisper echoes the
    input kanji verbatim (私 could be わたし or わたくし; the transcript alone
    cannot say which reading was spoken)."""
    import phoneme_asr, pitch
    _, toks, _ = pitch.tokens_for(reading)

    def cls(p):
        for v, ps in VCLS.items():
            if p in ps or p.rstrip("ː") in ps:
                return v
        for c, ps in CLS.items():
            if c and p in ps:
                return c
        return p
    exp = [cls(t) for t in toks]
    got = [cls(p) for p in phoneme_asr.recognize(path) if p != "ʔ"]
    # long vowels are one token on both sides; compare as sequences
    n, m = len(exp), len(got)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (exp[i - 1] != got[j - 1]))
    return 1 - dp[n][m] / max(n, m, 1), " ".join(got)


# ----------------------------------------------------------------- phones ---
CLS = {
    "": set(), "k": {"k", "kʰ", "kh", "c", "q", "kʲ", "x"}, "ky": {"k", "kʲ", "c", "kʰ"},
    "g": {"ɡ", "ŋ", "ɣ", "ɡʲ"}, "gy": {"ɡ", "ɡʲ", "ŋ", "dʒ", "dʑ"},
    "s": {"s", "s.", "sʲ"}, "sh": {"ɕ", "ʃ", "s", "ç", "ʂ", "sʲ", "ɕʲ"},
    "z": {"z", "dz", "dzː", "ʒ", "dʒ", "dʑ", "ʑ"}, "j": {"dʑ", "ʑ", "dʒ", "ʒ", "z", "dz", "dʑʲ"},
    "t": {"t", "tʰ", "th", "t̪", "tː", "tʲ"}, "ch": {"tɕ", "tʃ", "tɕh", "tʃʰ", "c", "tɕʲ", "cʰ"},
    "ts": {"ts", "ts.", "tsh", "tsʲ", "s"}, "d": {"d", "d̪", "ɾ", "ð", "dʲ"},
    "n": {"n", "nʲ", "ɲ", "ŋ", "n̩"}, "ny": {"ɲ", "n", "nʲ"},
    "h": {"h", "ç", "x", "f", "ɸ", "ɦ", "χ"}, "hy": {"ç", "h", "x", "ʃ", "ɕ", "çʲ"},
    "f": {"ɸ", "f", "h", "β", "v", "fʲ", "x"}, "b": {"b", "β", "v", "bʲ"}, "p": {"p", "pʰ", "ph", "pʲ"},
    "m": {"m", "mʲ"}, "my": {"m", "mʲ"}, "y": {"j", "ʝ", "i"},
    "r": {"ɾ", "r", "l", "ɹ", "d", "ɽ", "ɺ", "ɭ", "rʲ", "ɫ", "ʎ", "ɾʲ"},
    "ry": {"ɾ", "r", "l", "ɹ", "d", "rʲ", "ʎ", "ɾʲ"}, "by": {"b", "bʲ", "β", "v"}, "py": {"p", "pʲ", "pʰ"},
    "w": {"w", "ɰ", "β", "u", "ʊ", "ɯ", "v", "ʋ"}, "v": {"b", "v", "β", "ʋ"},
    "dy": {"d", "dʲ", "dʑ", "dʒ", "j"}, "ty": {"t", "tʲ", "tɕ", "tʃ"}, "fy": {"ɸ", "f", "h", "ç"},
    "N": {"n", "m", "ŋ", "ɴ", "N", "ɯ", "u", "n̩"},
}
VCLS = {
    "a": {"a", "ɑ", "æ", "ʌ", "ɐ", "ä", "aː", "ɑː", "ɐ̃", "ã", "a5"},
    "i": {"i", "ɪ", "iː", "ɨ", "i5", "i.", "ɪː", "ĩ"},
    "u": {"ɯ", "u", "ʊ", "ɨ", "ʉ", "uː", "ɯᵝ", "ɯɯ", "ɪ", "ɵ", "y", "ə", "ũ"},
    "e": {"e", "ɛ", "eː", "e̞", "ɛː", "ə", "ẽ", "e̞e̞", "e:"},
    "o": {"o", "ɔ", "oː", "o̞", "ɔː", "o̞o̞", "ʊ", "õ", "ɒ", "o:"},
}
ALLV = set().union(*VCLS.values())


def _norm_phone(p):
    """The recognizer's inventory is multilingual: Mandarin-trained tokens carry
    tone digits and aspiration spellings (i.5, onɡ5, th). Fold them to plain IPA."""
    p = re.sub(r"[0-9.:]", "", p)
    p = {"th": "t", "kh": "k", "ph": "p", "tsh": "ts", "tɕh": "tɕ", "ʈʰ": "t"}.get(p, p)
    if p and p not in ALLV and p not in set().union(*CLS.values()):
        for ch in p:  # a diphthong / nasal-coda token like "onɡ" counts as its vowel
            if ch in "aiueoɯɪʊɛɔɑəɐæɨʉ":
                return ch
    return p


def phones_ok(kana, phones):
    import pitch
    m = to_hiragana(kana)
    c, v = pitch.mora_parts(m)
    ph = [_norm_phone(p) for p in phones if p not in ("ʔ",)]
    ph = [p for p in ph if p]
    if c == "N":
        return any(p in CLS["N"] for p in ph), "ん"
    if not ph:
        return False, "no phones"
    vi = [i for i, p in enumerate(ph) if p in ALLV]
    if not vi:
        return False, "no vowel"
    last_v = ph[vi[-1]]
    central_ok = v == "u" and c in {"sh", "ch", "j", "ny", "hy", "my", "ry", "ky", "gy", "by", "py", "dy", "ty", "fy", "s", "ts", "z", "t"} \
        and last_v in {"i", "ɪ", "ɨ", "ə", "iː"}
    if last_v not in VCLS[v] and not central_ok:
        return False, f"vowel {last_v} ∉ {v}"
    cons = [p for p in ph[: vi[0]] if p != "j"]
    if c == "":
        bad = [p for p in cons if p not in ("h", "ɦ", "w") or (p == "w" and m != "を")]
        return (not bad), ("ok" if not bad else f"unexpected onset {bad}")
    if c in ("y",):
        return True, "ok"  # や/ゆ/よ: the glide is often folded into the vowel
    if not cons:
        return False, "no onset"
    return any(p in CLS[c] for p in cons), ("ok" if any(p in CLS[c] for p in cons) else f"onset {cons} ∉ {c}")


# ----------------------------------------------------------------- signal ---
def voiced_seconds(path):
    import librosa
    try:
        y, sr = librosa.load(path, sr=16000)
    except Exception:
        return 0.0  # an all-silence clip trims down to an unreadable stub
    if not len(y):
        return 0.0
    rms = librosa.feature.rms(y=y, frame_length=320, hop_length=160)[0]
    db = 20 * np.log10(np.maximum(rms, 1e-8) / max(rms.max(), 1e-8))
    return float((db > -35).sum() * 0.01) if rms.max() > 1e-4 else 0.0


# ------------------------------------------------------------------ main ----
def main(shard=0, nshards=1):
    import mlx_whisper
    items = all_items()
    old = {"clips": {}}
    for fn in [REPORT] + [REPORT.replace(".json", f".shard{i}.json") for i in range(8)]:
        if os.path.exists(fn):
            old["clips"].update(json.load(open(fn)).get("clips", {}))
    out_path = REPORT if nshards == 1 else REPORT.replace(".json", f".shard{shard}.json")
    rep = {"generated": time.strftime("%Y-%m-%d %H:%M"), "clips": {}}
    acc_cache = {}

    def accent_of(w, r):
        if (w, r) not in acc_cache:
            acc_cache[(w, r)] = dictcheck.lookup(w, r)
        return acc_cache[(w, r)]

    import phoneme_asr, pitch
    total = len(items) * len(VOICES)
    done = 0
    for ii, it in enumerate(items):
        if ii % nshards != shard:
            continue
        for v in VOICES:
            done += 1
            path = os.path.join(CACHE, v, it["id"] + ".mp3")
            key = open(path.replace(".mp3", ".key")).read() if os.path.exists(path.replace(".mp3", ".key")) else ""
            cid = f"{v}/{it['id']}"
            prev = old.get("clips", {}).get(cid)
            if prev and prev.get("key") == key and prev.get("schema") == 3 and prev.get("key") == key:
                rep["clips"][cid] = prev
                continue
            r = {"id": it["id"], "voice": v, "kind": it["kind"], "text": it.get("w") or it.get("kana"),
                 "expected": it["r"], "key": key, "schema": 3, "checks": {}}
            # 1 signal
            vs = voiced_seconds(path)
            from gen_audio import peak_db
            raw_peak = peak_db(path.replace(".mp3", ".raw.mp3"))
            # raw peak, before normalization: a near-silent synthesis would
            # otherwise be amplified into a clip that "has signal"
            r["checks"]["signal"] = {"ok": vs >= 0.06 and raw_peak > -35, "voiced_s": round(vs, 3), "raw_peak_db": raw_peak}
            if raw_peak <= -35:
                vs = 0.0
            if vs < 0.06:
                r["checks"]["reading"] = {"ok": False, "asr": "", "model": "skipped: silent clip"}
                r["ok"] = False
                rep["clips"][cid] = r
                continue
            # 2 reading
            t1 = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
                                        language="ja", temperature=0.0, condition_on_previous_text=False)["text"]
            ok1 = reading_ok(t1, it["r"])
            rd = {"asr": t1, "ok": ok1, "model": "large-v3-turbo"}
            if not ok1 and it["kind"] not in ("kana", "kanavar"):
                t2 = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-mlx",
                                            language="ja", temperature=0.0, condition_on_previous_text=False)["text"]
                rd["asr2"] = t2
                rd["ok"] = reading_ok(t2, it["r"])
                if rd["ok"]:
                    rd["model"] = "large-v3"
            if not rd["ok"] and it.get("w") and any(_norm_written(t) == _norm_written(it["w"]) for t in [t1, rd.get("asr2", "")]):
                # Whisper wrote exactly our input; UniDic's reading of it differs
                # (私 → わたくし). Let the phone recognizer decide which was said.
                sim, heard = phone_similarity(path, it["r"])
                rd["phone_sim"] = round(sim, 2)
                rd["phones"] = heard
                rd["ok"] = sim >= 0.7
                rd["model"] = "written-form + phones"
            r["checks"]["reading"] = rd
            # 3 phones (single kana)
            if it["kind"] in ("kana", "kanavar"):
                ph = phoneme_asr.recognize(path)
                ok3, why = phones_ok(it["kana"], ph)
                r["checks"]["phones"] = {"ok": ok3, "phones": " ".join(ph), "why": why}
            # 4 pitch
            if it["kind"] == "word":
                a = accent_of(it["w"], it["r"])
                r["dict"] = {k: a.get(k) for k in ("accent", "status", "multi", "unidic", "kanjium", "wiktionary")}
                accepted = sorted(set((a.get("unidic") or []) + (a.get("kanjium") or []) + (a.get("wiktionary") or []))) if a.get("multi") else ([a["accent"]] if a.get("accent") is not None else [])
                carrier = os.path.join(CACHE, v, it["id"] + "-ga.mp3")
                if a.get("accent") is not None:
                    tries = []
                    for acc in [a["accent"]] + [x for x in accepted if x != a["accent"]]:
                        pr = pitch.check(path, carrier if os.path.exists(carrier) else None, it["r"], acc, v)
                        tries.append(pr)
                        if pr["ok"]:
                            break
                    best = next((p for p in tries if p["ok"]), tries[0])
                    r["checks"]["pitch"] = {"ok": best["ok"], "heard": best["accent"] if best["ok"] else None,
                                            "expected": a["accent"], "accepted": accepted, "detail": best}
            # kana: phones decide when Whisper cannot read a lone syllable
            ch = r["checks"]
            if it["kind"] in ("kana", "kanavar"):
                ok = ch["signal"]["ok"] and (ch["phones"]["ok"] or ch["reading"]["ok"])
                if ch["phones"]["ok"] is False and ch["reading"]["ok"]:
                    r["note"] = "phones disagree, reading agrees"
            else:
                # Pitch is recorded but does not gate: measured against the two
                # dictionaries, the automatic nucleus estimate agreed only ~66% of
                # the time (F0 peak delay in the synthetic voices), which is not
                # good enough to decide what ships. See verification page.
                ok = ch["signal"]["ok"] and ch["reading"]["ok"]
            r["ok"] = bool(ok)
            rep["clips"][cid] = r
            if done % 25 == 0:
                print(f"{done}/{total}", file=sys.stderr, flush=True)
                json.dump(rep, open(out_path, "w"), ensure_ascii=False, indent=0)
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    json.dump(rep, open(out_path, "w"), ensure_ascii=False, indent=0)
    from collections import Counter
    c = Counter((x["kind"], x["ok"]) for x in rep["clips"].values())
    print(sorted(c.items()))


def reevaluate():
    """Recompute pass/fail from the stored measurements (no models re-run), for
    when a decision rule changes but the measurements do not."""
    rep = json.load(open(REPORT))
    for cid, c in rep["clips"].items():
        ch = c["checks"]
        sg = ch.get("signal", {})
        if "raw_peak_db" in sg:
            sg["ok"] = sg.get("voiced_s", 0) >= 0.06 and sg["raw_peak_db"] > -35
        if not sg.get("ok", False):
            c["ok"] = False
            continue
        rd = ch.get("reading", {})
        if c["kind"] in ("kana", "kanavar"):
            if rd.get("asr") is not None:
                rd["ok"] = reading_ok(rd["asr"], c["expected"])
            if "phones" in ch:
                okp, why = phones_ok(c["text"], ch["phones"]["phones"].split())
                ch["phones"].update(ok=okp, why=why)
            c["ok"] = bool(rd.get("ok") or ch.get("phones", {}).get("ok") or ch.get("reading_prompted", {}).get("ok"))
        else:
            if rd.get("asr") is not None and rd.get("model") != "written-form + phones":
                rd["ok"] = reading_ok(rd["asr"], c["expected"]) or (bool(rd.get("asr2")) and reading_ok(rd["asr2"], c["expected"]))
            c["ok"] = bool(rd.get("ok"))
    json.dump(rep, open(REPORT, "w"), ensure_ascii=False, indent=0)
    from collections import Counter
    print(sorted(Counter((x["kind"], x["ok"]) for x in rep["clips"].values()).items()))


def merge(nshards):
    rep = {"generated": time.strftime("%Y-%m-%d %H:%M"), "clips": {}}
    for i in range(nshards):
        fn = REPORT.replace(".json", f".shard{i}.json")
        rep["clips"].update(json.load(open(fn))["clips"])
    json.dump(rep, open(REPORT, "w"), ensure_ascii=False, indent=0)
    from collections import Counter
    print(sorted(Counter((x["kind"], x["ok"]) for x in rep["clips"].values()).items()))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "reevaluate":
        reevaluate()
    elif len(sys.argv) > 1 and sys.argv[1] == "merge":
        merge(int(sys.argv[2]))
    elif len(sys.argv) > 1:
        a, b = sys.argv[1].split("/")
        main(int(a), int(b))
    else:
        main()
