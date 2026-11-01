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



# ---------------------------------------------------------------- stage 1 ---
# Stage 1 (N5) items are checked with the same signal / reverse-dictation steps,
# plus two things the transcript alone cannot settle:
#   * When the written transcript allows more than one reading (Whisper writes
#     降りません whether it heard おりません or ふりません; 四日 よっか / よんにち), the
#     candidate readings come from UniDic's n-best analyses and the IPA phone
#     recognizer makes a forced choice: the expected reading must be strictly
#     closer to what was heard than every competitor.
#   * Sentences are compared on pronunciation (UniDic `pron`), so a particle は
#     counts as わ. Whisper writes は either way, so for sentences with a particle
#     は/へ the phones also choose between the correct reading (わ/え) and the
#     spelling pronunciation (は/へ read as written).
N5_KINDS = {"n5word", "n5wordvar", "n5form", "n5formvar", "n5sent", "n5phrase"}
SCHEMA_N5 = 5


# counters after a numeral: the reading a Japanese reader gives 3つ / 8日 / 2人,
# plus the naive 数字+音读 reading a TTS engine could produce instead (さんにち)
_NATIVE_TSU = {1: "ひとつ", 2: "ふたつ", 3: "みっつ", 4: "よっつ", 5: "いつつ", 6: "むっつ", 7: "ななつ", 8: "やっつ", 9: "ここのつ", 10: "とお"}
_DAYS = {1: ["ついたち", "いちにち"], 2: ["ふつか"], 3: ["みっか"], 4: ["よっか"], 5: ["いつか"], 6: ["むいか"], 7: ["なのか", "なぬか"],
         8: ["ようか"], 9: ["ここのか"], 10: ["とおか"], 14: ["じゅうよっか"], 20: ["はつか"], 24: ["にじゅうよっか"]}
_PEOPLE = {1: ["ひとり"], 2: ["ふたり"], 4: ["よにん"], 7: ["しちにん", "ななにん"], 9: ["きゅうにん", "くにん"]}


def _counter_readings(n, counter):
    """{reading: attested} for numeral n followed by counter つ/日/人."""
    sino = _num_readings(str(n))
    out = {}
    if counter == "つ":
        if n in _NATIVE_TSU:
            out[_NATIVE_TSU[n]] = True
        for r in sino:
            out.setdefault(r + "つ", True)
    elif counter == "日":
        for r in _DAYS.get(n, []):
            out[r] = True
        for r in sino:
            out.setdefault(r + "にち", True)
    elif counter == "人":
        for r in _PEOPLE.get(n, []):
            out[r] = True
        for r in sino:
            out.setdefault(r + "にん", True)
    return out


_JM = None


def _attested(tok_surface, tok_kana, base, base_kana, pos1):
    """Is this token's reading one a dictionary gives? Particles, auxiliaries,
    kana-only words: yes. Inflected words: their dictionary form must be a JMdict
    (word, reading) pair (降る ふる, 下りる/降りる おりる …). Others: (surface,
    reading) must be a JMdict pair — so 日曜日 split as 日曜+日(ぴ) is not a real
    competitor, while 日(ひ) is."""
    global _JM
    if _JM is None:
        import n5data
        _JM = set(n5data.furigana().keys())
    if pos1 in ("助詞", "助動詞", "補助記号", "記号", "空白") or re.fullmatch(r"[ぁ-ゖァ-ヺー]+", tok_surface):
        return True
    if pos1 in ("動詞", "形容詞") and base and base_kana:
        return (base, base_kana) in _JM
    return (tok_surface, tok_kana) in _JM


def _readings_of(text, n, pron_only):
    """{reading (pnorm): attested} over UniDic's n best analyses of a
    transcript; numerals followed by a counter get counter readings."""
    text = re.sub(r"[\s。、，,．！!？?「」『』（）()・…~〜]", "", text.strip())
    parts = re.split(r"(\d+)", text)
    variants = {"": True}
    i = 0
    while i < len(parts):
        p = parts[i]
        i += 1
        if not p:
            continue
        if p.isdigit():
            nxt = parts[i] if i < len(parts) else ""
            if nxt[:1] in ("つ", "日", "人"):
                rs = _counter_readings(int(p), nxt[0])
                parts[i] = nxt[1:]
            else:
                rs = {r: True for r in _num_readings(p)}
        else:
            rs = {}
            for nodes in _tagger.nbestToNodeList(p, n):
                k, pr, att = "", "", True
                for nd in nodes:
                    f = nd.feature
                    kana = f.kana if getattr(f, "kana", None) not in (None, "*") else nd.surface
                    pron = f.pron if getattr(f, "pron", None) not in (None, "*") else kana
                    kb = f.kanaBase if getattr(f, "kanaBase", None) not in (None, "*") else ""
                    att = att and _attested(nd.surface, to_hiragana(kana), getattr(f, "orthBase", ""), to_hiragana(kb), f.pos1)
                    k += kana
                    pr += pron
                for r in ([to_hiragana(pr)] + ([] if pron_only else [to_hiragana(k)])):
                    rs[r] = rs.get(r, False) or att
        variants = {a + r: (va and vr) for a, va in variants.items() for r, vr in rs.items()}
        if len(variants) > 400:
            variants = dict(list(variants.items())[:400])
    out = {}
    for v, att in variants.items():
        key = pnorm(v)
        out[key] = out.get(key, False) or att
    return out


def reading_ok_n5(text, expected, pron_only):
    exp = pnorm(expected)
    if pron_only:
        return exp in _readings_of(text, 1, True)
    return reading_ok(text, expected)


_CLS_IDS = {}


def _token_ids(tok):
    """Model labels accepted as a realization of an expected phone token: the
    recognizer's inventory is multilingual (it labels Japanese わ [ɰa] as 'v'),
    so each token is scored by the best label in its accepted set — the same
    curated sets the single-kana check uses (CLS / VCLS)."""
    import pitch
    if tok in _CLS_IDS:
        return _CLS_IDS[tok]
    voc = pitch.V
    if tok in ("a", "i", "ɯ", "e", "o", "aː", "iː", "uː", "eː", "oː"):
        v = {"a": "a", "i": "i", "ɯ": "u", "u": "u", "e": "e", "o": "o"}[tok[0]]
        members = VCLS[v]
    else:
        c = _TOK_CLS.get(tok)
        members = CLS[c] if c else {tok}
    ids = sorted({voc[m] for m in members | {tok} if m in voc})
    _CLS_IDS[tok] = ids
    return ids


def ctc_scores(path, readings):
    """{reading: log-likelihood of the best CTC path} — the same wav2vec2 model
    scores the audio against each candidate phone sequence (forced alignment,
    each phone emitted by the best label of its accepted set). Candidates are
    compared on the same audio, so the difference is a log-likelihood ratio:
    which reading does the audio support?"""
    import pitch
    lp, _ = pitch.logprobs(path)
    blank = pitch.P._blank
    out = {}
    for rd in readings:
        toks = pitch.tokens_for(rd)[1]
        # emission matrix for the extended sequence: blank, t1, blank, t2, …
        cols = [lp[:, blank]]
        keys = ["<b>"]
        for t in toks:
            cols.append(lp[:, _token_ids(t)].max(axis=1))
            keys.append(t)
            cols.append(lp[:, blank])
            keys.append("<b>")
        em = np.stack(cols, axis=1)
        S, T = em.shape[1], em.shape[0]
        NEG = -1e30
        dp = np.full(S, NEG)
        dp[0] = em[0, 0]
        if S > 1:
            dp[1] = em[0, 1]
        skip = np.array([s >= 2 and keys[s] != "<b>" and keys[s] != keys[s - 2] for s in range(S)])
        for t in range(1, T):
            b1 = np.concatenate(([NEG], dp[:-1]))
            b2 = np.where(skip, np.concatenate(([NEG, NEG], dp[:-2])), NEG)
            dp = np.maximum(np.maximum(dp, b1), b2) + em[t]
        out[rd] = float(max(dp[-1], dp[-2] if S > 1 else NEG))
    return out


CTC_MARGIN = 1.0   # nats: the expected reading must be ≥ e^1 ≈ 2.7× as likely
ECHO_SIM = 0.7     # no attested competitor: the Stage-0 rule (phone similarity)


def _phone_cls(p):
    for v, ps in VCLS.items():
        if p in ps or p.rstrip("ː") in ps:
            return v
    for c, ps in CLS.items():
        if c and p in ps:
            return c
    return p


# expected phone token (pitch.tokens_for) -> consonant class whose CLS set lists
# the realizations the recognizer may output for it (same sets phones_ok uses)
_TOK_CLS = {"k": "k", "kʲ": "ky", "ɡ": "g", "ɡʲ": "gy", "s": "s", "ɕ": "sh", "z": "z", "dʑ": "j", "t": "t", "tɕ": "ch",
            "ts": "ts", "d": "d", "n": "n", "ɲ": "ny", "h": "h", "ç": "hy", "ɸ": "f", "b": "b", "p": "p", "m": "m",
            "mʲ": "my", "j": "y", "ɾ": "r", "w": "w"}


def _tok_match(exp, got):
    """Does recognized phone `got` count as a realization of expected token
    `exp`? Vowels by vowel class, consonants by membership in the class's
    accepted set — so the recognizer's 'v' for Japanese わ [ɰa] counts as w (it is
    in the w set) and not as h, while 'f' counts as は/ふ."""
    g = _norm_phone(got)
    if exp in ("aː", "iː", "uː", "eː", "oː") or exp in ("a", "i", "ɯ", "e", "o"):
        v = {"a": "a", "i": "i", "ɯ": "u", "e": "e", "o": "o"}[exp[0] if exp[0] != "ɯ" else "ɯ"]
        return g in VCLS[v] or g.rstrip("ː") in VCLS[v]
    c = _TOK_CLS.get(exp)
    if c is None:
        return g == exp
    if c == "n" and g in CLS["N"]:
        return True
    return g in CLS[c]


def phone_sims(path, readings):
    """{reading: similarity} against one run of the IPA recognizer:
    1 - edit distance / length, where a substitution is free when the heard
    phone is an accepted realization of the expected one."""
    import phoneme_asr, pitch
    got = [p for p in phoneme_asr.recognize(path) if p != "ʔ"]
    out = {}
    for rd in readings:
        exp = pitch.tokens_for(rd)[1]
        n, m = len(exp), len(got)
        dp = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(n + 1):
            dp[i][0] = i
        for j in range(m + 1):
            dp[0][j] = j
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (0 if _tok_match(exp[i - 1], got[j - 1]) else 1))
        out[rd] = round(1 - dp[n][m] / max(n, m, 1), 3)
    return out, " ".join(got)


def n5_decide(c):
    """Pass/fail for a stage-1 clip from its stored measurements (also used by
    reevaluate, so a rule change does not need the models again)."""
    ch = c["checks"]
    pp = ch.get("particle")
    if pp is not None:
        pp["verdict"] = "ok" if pp["margin"] >= CTC_MARGIN else ("wrong" if pp["margin"] <= -CTC_MARGIN else "unclear")
    if not ch.get("signal", {}).get("ok"):
        return False
    rd = ch.get("reading", {})
    if rd.get("model") == "n-best + ctc":
        rd["ok"] = rd.get("margin") is not None and rd["margin"] >= CTC_MARGIN
    elif rd.get("model") == "echo + phones":
        rd["ok"] = (rd.get("sim") or 0) >= ECHO_SIM
    if not rd.get("ok"):
        return False
    if pp is not None and pp["verdict"] != "ok":
        return False
    return True


def verify_n5(it, path, r):
    import mlx_whisper
    exp = it["r"]
    pron_only = bool(it.get("pron_only"))
    t1 = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
                                language="ja", temperature=0.0, condition_on_previous_text=False)["text"]
    rd = {"asr": t1, "ok": reading_ok_n5(t1, exp, pron_only), "model": "large-v3-turbo", "pron_only": pron_only}
    texts = [t1]
    if not rd["ok"]:
        t2 = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-mlx",
                                    language="ja", temperature=0.0, condition_on_previous_text=False)["text"]
        rd["asr2"] = t2
        texts.append(t2)
        if reading_ok_n5(t2, exp, pron_only):
            rd["ok"], rd["model"] = True, "large-v3"
    if not rd["ok"]:
        # The transcript allows the expected reading only under another analysis
        # (降りません: ふりません first), as a counter reading (3日), or Whisper wrote
        # our input back. Then the audio itself must choose: CTC forced alignment
        # against the expected reading and every attested competitor.
        e = pnorm(exp)
        cands = {}
        for t in texts:
            for k_, att in _readings_of(t, 10, pron_only).items():
                cands[k_] = cands.get(k_, False) or att
        echoed = any(_norm_written(t) == _norm_written(it.get("w", "")) for t in texts)
        if e in cands or echoed:
            comp = sorted(x for x, att in cands.items() if att and x != e)
            if comp:
                sc = ctc_scores(path, [e] + comp)
                best = max(comp, key=lambda x: sc[x])
                rd.update(model="n-best + ctc", competitors=comp[:12], competitor=best, margin=round(sc[e] - sc[best], 2))
            else:
                sims, heard = phone_sims(path, [e])
                rd.update(model="echo + phones", sim=sims[e], phones=heard)
    r["checks"]["reading"] = rd
    if it.get("spell") and pnorm(it["spell"]) != pnorm(exp):
        sc = ctc_scores(path, [pnorm(exp), pnorm(it["spell"])])
        r["checks"]["particle"] = {"margin": round(sc[pnorm(exp)] - sc[pnorm(it["spell"])], 2)}
    r["ok"] = n5_decide(r)
    return r


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
            want_schema = SCHEMA_N5 if it["kind"] in N5_KINDS else 3
            if prev and prev.get("key") == key and prev.get("schema") == want_schema:
                rep["clips"][cid] = prev
                continue
            if it["kind"] in ("n5wordvar", "n5formvar"):
                # a kana-typed variant is only needed where the base clip failed
                base = old.get("clips", {}).get(f"{v}/{it['base']}")
                if not base or base.get("ok") or not os.path.exists(path):
                    continue
            r = {"id": it["id"], "voice": v, "kind": it["kind"], "text": it.get("w") or it.get("kana"),
                 "expected": it["r"], "key": key, "schema": want_schema, "checks": {}}
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
            if it["kind"] in N5_KINDS:
                rep["clips"][cid] = verify_n5(it, path, r)
                if done % 25 == 0:
                    print(f"{done}/{total}", file=sys.stderr, flush=True)
                    json.dump(rep, open(out_path, "w"), ensure_ascii=False, indent=0)
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
        if c["kind"] in N5_KINDS:
            c["ok"] = n5_decide(c)
            continue
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
