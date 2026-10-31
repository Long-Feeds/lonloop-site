"""Flatten content.yaml + kana.py into the list of audio items the site needs.

An item is one thing a learner can press play on. Its id is stable (derived from
what is said, not from list position), so re-running the pipeline never shuffles
audio files under a page.
"""
import hashlib, os, yaml

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
    return list(items.values())


if __name__ == "__main__":
    its = all_items()
    from collections import Counter
    print(len(its), Counter(i["kind"] for i in its))
