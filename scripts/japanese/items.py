"""Flatten content.yaml + kana.py into the list of audio items the site needs.

An item is one thing a learner can press play on. Its id is stable (derived from
what is said, not from list position), so re-running the pipeline never shuffles
audio files under a page.
"""
import hashlib, json, os, yaml

from kana import SOUNDS, EXTENDED, all_basic_kana, to_hiragana, to_katakana

HERE = os.path.dirname(os.path.abspath(__file__))
VOICES = {"n": "ja-JP-NanamiNeural", "k": "ja-JP-KeitaNeural"}


def load_content():
    with open(os.path.join(HERE, "content.yaml"), encoding="utf-8") as f:
        return yaml.safe_load(f)


def slug(w, r):
    h = hashlib.md5(f"{w}|{r}".encode()).hexdigest()[:6]
    return f"w-{h}"


def kana_id(k):
    rom = SOUNDS[k][0]
    # ぢ/づ/を share a sound with じ/ず/お but are separate cells, so separate files
    special = {"ぢ": "dji", "づ": "dzu", "を": "wo"}
    return "kana-" + special.get(k, rom)


def all_items():
    c = load_content()
    items = {}

    def add(iid, **kw):
        if iid not in items:
            items[iid] = {"id": iid, **kw}
        return items[iid]

    seion, dakuon, youon = all_basic_kana()
    for k in seion + dakuon + youon:
        # "。" after the kana: the male voice returns silence for a bare vowel
        # (measured: あ, を, ん), the full stop makes both voices render a syllable.
        add(kana_id(k), kind="kana", kana=k, r=k, tts=k + "。", rate="-10%")
        # katakana spelling of the same sound: a lone hiragana is sometimes read
        # as the particle it also is (measured: 「へ。」 came back as え)
        add(kana_id(k) + "-kv", kind="kanavar", kana=k, r=k, base=kana_id(k),
            tts=to_katakana(k) + "。", rate="-10%")
    for kk, rom, *_ in EXTENDED:
        add("kana-x-" + rom, kind="kana", kana=kk, r=kk, tts=kk + "。", rate="-10%")

    def word(x, kind="word", carrier=False):
        iid = slug(x["w"], x["r"])
        add(iid, kind=kind, w=x["w"], r=x["r"], zh=x.get("zh"), tts=x["w"], rate="-5%")
        if kind == "word" and x["w"] != x["r"]:
            # A lone kanji is often read with its on-yomi (measured: 雲→うん,
            # 月→がつ, 骨→こつ, 心→しん). The same word typed in kana is the
            # fallback build.py uses when the kanji clip fails the reading check.
            add(iid + "-kv", kind="wordvar", w=x["w"], r=x["r"], zh=x.get("zh"), base=iid,
                tts=x["r"], rate="-5%")
        if carrier and not x.get("nocarrier"):
            # 平板 and 尾高 only differ on the following particle, so the word is also
            # said inside a frame. Not a bare 「〜が」: utterance-final が gets the
            # sentence-final pitch fall in both voices (measured: 橋が and 端が came
            # out within 1 semitone of each other), which hides the very contrast the
            # frame is for. In 「〜があります」 the particle sits mid-phrase.
            add(iid + "-ga", kind="carrier", w=x["w"] + "があります", r=x["r"] + "があります", base=iid,
                tts=x["w"] + "があります", rate="-5%")
        return iid

    for cands in c["kana_examples"].values():
        for x in cands:
            word(x, carrier=True)
    for cands in c["dakuon_examples"].values():
        for x in cands:
            word(x, carrier=True)
    for x in c["youon_examples"]:
        word(x, carrier=True)
    for grp in c["pairs"].values():
        for p in grp:
            for x in p["items"]:
                word(x, carrier=True)
    for grp in c["accent_types"].values():
        for x in grp:
            word(x, carrier=True)
    for x in c.get("hatsuon_examples", []):
        word(x, carrier=True)
    for x in c["katakana_words"]:
        word(x, kind="loanword")
    for kk, rom, typ, ipa, tbl, ex, exzh in EXTENDED:
        word({"w": ex, "r": to_hiragana(ex), "zh": exzh}, kind="loanword")
    for x in c["greetings"]:
        add("g-" + x["id"], kind="phrase", w=x["w"], r=x["r"], zh=x["zh"], tts=x["w"], rate="-5%")
    for x in c["numbers"]:
        add("num-" + x["id"][1:], kind="number", w=x["w"], r=x["r"], num=x["num"], tts=x["w"], rate="-5%")
        if x.get("alt"):
            add("num-" + x["id"][1:] + "-alt", kind="number", w=x["alt"], r=x["alt"], num=x["num"], tts=x["alt"], rate="-5%")
    for x in c["sentences"]:
        add(x["id"], kind="sentence", w=x["w"], r=x["r"], zh=x["zh"], tts=x["w"], rate="-5%")
    for it in n5_items():
        add(it.pop("id"), **it)
    return list(items.values())


N5_REPORT = os.path.join(HERE, "reports", "n5_checks.json")


def form_id(w, r):
    return "f-" + hashlib.md5(f"{w}|{r}".encode()).hexdigest()[:6]


def n5_items():
    """Stage 1 audio items, taken from reports/n5_checks.json (written by
    `python n5data.py check`): only entries that passed every content check.

    kinds: n5word (dictionary forms, kanji example words), n5form (conjugated
    forms), n5sent / n5phrase (checked against UniDic's pronunciation, so a
    particle は must be heard as わ). A word already in stage 0 keeps its stage-0
    item (same id), and its existing verification."""
    if not os.path.exists(N5_REPORT):
        return []
    rep = json.load(open(N5_REPORT, encoding="utf-8"))
    out = []

    def word(w, r, zh):
        iid = slug(w, r)
        out.append({"id": iid, "kind": "n5word", "w": w, "r": r, "zh": zh, "tts": w, "rate": "-5%"})
        if w != r:
            out.append({"id": iid + "-kv", "kind": "n5wordvar", "w": w, "r": r, "zh": zh, "base": iid, "tts": r, "rate": "-5%"})

    def form(f, zh):
        iid = form_id(f["w"], f["r"])
        # a written form UniDic reads another way first (降ります: ふります) is
        # synthesized from kana, so the engine cannot pick the other word
        amb = bool(f.get("ambiguous"))
        out.append({"id": iid, "kind": "n5form", "w": f["w"], "r": f["r"], "zh": zh, "tts": f["r"] if amb else f["w"],
                    "rate": "-5%", "nbest": amb})
        if f["w"] != f["r"] and not amb:
            out.append({"id": iid + "-kv", "kind": "n5formvar", "w": f["w"], "r": f["r"], "zh": zh, "base": iid,
                        "tts": f["r"], "rate": "-5%"})
    for v in rep["verbs"] + rep["adjectives"]:
        if not v["ok"]:
            continue
        word(v["w"], v["r"], v["zh"])
        for k, f in v["forms"].items():
            if k != "dict" and f["ok"]:
                form(f, v["zh"])
    for k in rep["kanji"]:
        for x in k["examples"]:
            if not x["problems"]:
                word(x["w"], x["r"], x["zh"])
    for s in rep["sentences"]:
        if s["ok"]:
            out.append({"id": "n5-" + s["id"], "kind": "n5sent", "w": s["w"], "r": s["pron"], "kana": s["kana"],
                        "zh": s["zh"], "tts": s["w"], "rate": "-5%", "pron_only": True,
                        "particles": s.get("particles", []), "spell": s.get("spell")})
    for p in rep["phrases"]:
        if p["ok"]:
            out.append({"id": "n5p-" + slug(p["w"], p["r"])[2:], "kind": "n5phrase", "w": p["w"], "r": p["pron"],
                        "kana": p["r"], "zh": p["zh"], "tts": p["w"], "rate": "-5%", "pron_only": True, "particles": []})
    return out


if __name__ == "__main__":
    its = all_items()
    from collections import Counter
    print(len(its), Counter(i["kind"] for i in its))
