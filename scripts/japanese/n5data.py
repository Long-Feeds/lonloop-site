"""Stage 1 (初级上, about JLPT N5): load content_n5.yaml, generate what can be
generated, and machine-check everything before a page may use it.

    python n5data.py fetch     # download the raw sources into JA_RAW (once)
    python n5data.py check     # run every check -> reports/n5_checks.json

What is checked (each check's result is kept, published on /japanese/verification/):

  conj      Verb and adjective forms are generated from rules here, then parsed
            back with fugashi + UniDic: the head token must have the same lemma as
            the dictionary form, the expected conjugation form (e.g. 書い =
            連用形-イ音便, 行っ = 連用形-促音便), the expected auxiliaries after it,
            and the kana must equal the generated reading. The declared verb group
            must equal UniDic's cType; い/な adjective class must equal UniDic's POS.
  sentence  The kana written in content_n5.yaml must equal UniDic's reading of the
            sentence (a short list of words with two accepted readings is
            tolerated: 私 わたし/わたくし …). The pronunciation the audio is checked
            against (particles は→わ, へ→え, を→お) is UniDic's `pron`, not typed.
            The particles a sentence is said to illustrate must be tagged 助詞.
  vocab     Every content word of a sentence / example must be on Jonathan
            Waller's JLPT N5 vocabulary list (CC BY), or be taught in stage 0, or
            be a name / counter suffix. Exceptions are listed, not hidden.
  kanji     Readings: KANJIDIC2 (EDRDG) × the official 常用漢字表 (2010 内閣告示,
            parsed from the 文化庁 PDF) — the PDF parse itself is checked against
            ja.wikipedia's 常用漢字一覧 for all 2,136 kanji. Example words: UniDic
            reading; per-kanji split from JmdictFurigana, each part mapped to an
            official reading (allowing 連濁/促音化), whole-word readings must be in
            the 常用漢字表 付表. Strokes: KanjiVG count × animCJK × KANJIDIC2, and
            stroke ORDER KanjiVG × animCJK (start and end point of every stroke).
            简体: OpenCC (jp2t → t2s) × Unihan (kJapaneseOldVariant →
            kSimplifiedVariant).
"""
import json, os, re, sys, unicodedata
from functools import lru_cache

import fugashi
import jaconv
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get("JA_RAW", os.path.expanduser("~/.agents/workspace/japanese/raw"))
REPORT = os.path.join(HERE, "reports", "n5_checks.json")
UA = "lon-japanese-study (+https://github.com/Long-Feeds)"

_tagger = fugashi.Tagger()


def hira(s):
    return jaconv.kata2hira(s or "")


def _tok(surface, f):
    def k(x):
        return hira(x) if x not in (None, "*") else hira(surface)
    return {"s": surface, "pos1": f.pos1, "pos2": f.pos2, "pos3": f.pos3, "cType": f.cType,
            "cForm": f.cForm, "lemma": f.lemma, "kana": k(f.kana), "pron": k(f.pron), "lForm": k(f.lForm),
            "orthBase": f.orthBase, "kanaBase": hira(f.kanaBase) if f.kanaBase not in (None, "*") else ""}


def tokens(text):
    return [_tok(t.surface, t.feature) for t in _tagger(text)]


def analyses(text, n=10):
    """UniDic's n best analyses (distinct), best first. Written Japanese is
    often ambiguous (降ります = ふります or おります; 日曜日's 日 = ひ or び); a form
    is accepted when one of the top analyses is the intended one, and the rank
    is reported so ambiguous spellings are visible."""
    out, seen = [], set()
    for nodes in _tagger.nbestToNodeList(text, n):
        toks = [_tok(nd.surface, nd.feature) for nd in nodes]
        key = tuple((t["s"], t["lemma"], t["kana"], t["cForm"], t["pos1"]) for t in toks)
        if key not in seen:
            seen.add(key)
            out.append(toks)
    return out


@lru_cache(None)
def content():
    with open(os.path.join(HERE, "content_n5.yaml"), encoding="utf-8") as f:
        return yaml.safe_load(f)


# ------------------------------------------------------------------ fetch ---
SOURCES = {
    "kanjidic2/kanjidic2.xml.gz": "http://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
    "joyo/joyokanjihyo_20101130.pdf": "https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/pdf/joyokanjihyo_20101130.pdf",
    "joyo/jawiki-joyo.json": "https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97%E4%B8%80%E8%A6%A7&prop=wikitext|revid&format=json&formatversion=2",
    "furigana/JmdictFurigana.txt": "https://github.com/Doublevil/JmdictFurigana/releases/download/2.3.1%2B2026-10-25/JmdictFurigana.txt",
    "unihan/Unihan.zip": "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip",
    # tanos.co.uk no longer resolves (2026-11); Waller's lists via the Wayback Machine
    "n5/jlpt5_kanji.html": "https://web.archive.org/web/20200806005029id_/http://www.tanos.co.uk:80/jlpt/jlpt5/kanji/",
    "n5/jlpt5_vocab.html": "https://web.archive.org/web/20200728231522id_/http://www.tanos.co.uk:80/jlpt/jlpt5/vocab/",
    "n5/jlpt4_kanji.html": "https://web.archive.org/web/20200716184232id_/http://www.tanos.co.uk:80/jlpt/jlpt4/kanji/",
}


def fetch():
    import gzip, subprocess, time, urllib.request, zipfile
    for rel, url in SOURCES.items():
        fn = os.path.join(RAW, rel)
        if os.path.exists(fn):
            continue
        os.makedirs(os.path.dirname(fn), exist_ok=True)
        print("fetch", url)
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=180) as r:
            data = r.read()
        if rel.endswith(".html") and data[:2] == b"\x1f\x8b":
            data = gzip.decompress(data)
        open(fn, "wb").write(data)
        time.sleep(3)
    kd = os.path.join(RAW, "kanjidic2", "kanjidic2.xml")
    if not os.path.exists(kd):
        open(kd, "wb").write(gzip.open(kd + ".gz").read())
    uh = os.path.join(RAW, "unihan")
    if not os.path.exists(os.path.join(uh, "Unihan_Variants.txt")):
        zipfile.ZipFile(os.path.join(uh, "Unihan.zip")).extractall(uh)
    bbox = os.path.join(RAW, "joyo", "joyo_bbox.html")
    if not os.path.exists(bbox):
        subprocess.run(["pdftotext", "-bbox", os.path.join(RAW, "joyo", "joyokanjihyo_20101130.pdf"), bbox], check=True)
    txt = os.path.join(RAW, "joyo", "joyo.txt")
    if not os.path.exists(txt):
        subprocess.run(["pdftotext", "-layout", os.path.join(RAW, "joyo", "joyokanjihyo_20101130.pdf"), txt], check=True)


# ------------------------------------------------------------ raw sources ---
def _is_cjk(ch):
    return ch and ("一" <= ch <= "鿿" or "\U00020000" <= ch <= "\U0002ffff" or ch == "々")


@lru_cache(None)
def kanjidic():
    import xml.etree.ElementTree as ET
    root = ET.parse(os.path.join(RAW, "kanjidic2", "kanjidic2.xml")).getroot()
    out = {}
    for c in root.iter("character"):
        lit = c.findtext("literal")
        misc = c.find("misc")
        e = {"grade": misc.findtext("grade"), "strokes": [int(s.text) for s in misc.findall("stroke_count")],
             "jlpt": misc.findtext("jlpt"), "freq": misc.findtext("freq"), "on": [], "kun": [], "en": []}
        rm = c.find("reading_meaning")
        if rm is not None:
            g = rm.find("rmgroup")
            if g is not None:
                e["on"] = [r.text for r in g.findall("reading") if r.get("r_type") == "ja_on"]
                e["kun"] = [r.text for r in g.findall("reading") if r.get("r_type") == "ja_kun"]
                e["en"] = [m.text for m in g.findall("meaning") if m.get("m_lang") is None]
        out[lit] = e
    return out


def kanjidic_version():
    with open(os.path.join(RAW, "kanjidic2", "kanjidic2.xml"), encoding="utf-8") as f:
        head = f.read(20000)
    m = re.search(r"<date_of_creation>([^<]+)", head)
    return m.group(1) if m else ""


@lru_cache(None)
def joyo_pdf():
    """{kanji: [(reading, indented)]} from the official table. In the PDF, a
    reading set one character lower (一字下げ) is 'special or of very limited use';
    the parse uses the x coordinate of each word (pdftotext -bbox)."""
    t = open(os.path.join(RAW, "joyo", "joyo_bbox.html"), encoding="utf-8").read()
    pages = re.split(r"<page ", t)[1:]
    kana = re.compile(r"^[ぁ-ゖァ-ヺー]+$")
    entries, cur = {}, None
    for pg in pages:
        ws = [(float(m.group(1)), float(m.group(2)), m.group(5)) for m in
              re.finditer(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', pg)]
        ws.sort(key=lambda w: (w[1], w[0]))
        rx = [x for x, y, s in ws if 160 < x < 200 and kana.match(s)]
        if not rx:
            continue
        base = min(rx)
        for x, y, s in ws:
            if 100 < x < 110 and len(s) == 1 and _is_cjk(s):
                cur = s
                entries[cur] = []
            elif cur and base - 1 < x < base + 20 and kana.match(s):
                entries[cur].append((s, x > base + 5))
    return entries


@lru_cache(None)
def joyo_fuhyo():
    """付表 (special whole-word readings, e.g. 今日 きょう) from the PDF text:
    the last pages list 'reading  word' pairs in several columns."""
    txt = open(os.path.join(RAW, "joyo", "joyo.txt"), encoding="utf-8").read()
    i = txt.rfind("付　表")
    if i < 0:
        i = txt.rfind("付表")
    seg = txt[i:]
    pairs = set()
    for line in seg.splitlines():
        parts = line.split()
        for a, b in zip(parts, parts[1:]):
            if re.fullmatch(r"[ぁ-ゖ]+", a) and any(_is_cjk(c) for c in b) and len(b) <= 6:
                pairs.add((b, a))
    return pairs


@lru_cache(None)
def joyo_wiki():
    d = json.load(open(os.path.join(RAW, "joyo", "jawiki-joyo.json")))
    w = d["parse"]["wikitext"]
    start = w.find('{| class="sortable wikitable"')
    end = w.find("\n|}", start)
    out = {}
    for row in w[start:end].split("\n|-")[1:]:
        row = re.sub(r"<ref[^>]*>.*?</ref>", "", row, flags=re.S)
        row = re.sub(r"<ref[^>]*/>", "", row)
        row = re.sub(r"<!--.*?-->", "", row, flags=re.S)
        m = re.search(r"\[\[wikt:([^|\]]+)\|", row)
        if not m:
            continue
        cells = row.strip().split("||")
        deleted = cells[-2].strip() if len(cells) > 2 else ""
        rs = [x.strip() for x in cells[-1].strip().split("、") if x.strip()]
        out[m.group(1)] = {"readings": [(x.strip("（）"), x.startswith("（")) for x in rs], "deleted": bool(deleted)}
    return out, d["parse"].get("revid")


@lru_cache(None)
def furigana():
    out = {}
    with open(os.path.join(RAW, "furigana", "JmdictFurigana.txt"), encoding="utf-8-sig") as f:
        for line in f:
            p = line.rstrip("\n").split("|")
            if len(p) == 3:
                out.setdefault((p[0], p[1]), p[2])
    return out


def parse_furigana(word, spec):
    """'0:がっ;1:こう' -> [(0, 1, 'がっ'), (1, 2, 'こう')] (end exclusive)."""
    out = []
    for part in spec.split(";"):
        if not part:
            continue
        rng, kana = part.split(":")
        a, _, b = rng.partition("-")
        out.append((int(a), int(b or a) + 1, kana))
    return out


@lru_cache(None)
def waller():
    def rows(fn):
        import html as H
        t = open(os.path.join(RAW, "n5", fn), encoding="utf-8", errors="replace").read()
        out = []
        for r in re.findall(r"<tr>(.*?)</tr>", t, re.S):
            cells = [H.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)]
            out.append(cells)
        return out
    kanji = [c[0] for c in rows("jlpt5_kanji.html") if len(c) >= 4 and len(c[0]) == 1]
    vocab = [c[:3] for c in rows("jlpt5_vocab.html") if len(c) >= 3 and "VocabList" not in c[0]]
    return kanji, vocab


@lru_cache(None)
def waller_n4_kanji():
    import html as H
    fn = os.path.join(RAW, "n5", "jlpt4_kanji.html")
    if not os.path.exists(fn):
        return []
    t = open(fn, encoding="utf-8", errors="replace").read()
    out = []
    for r in re.findall(r"<tr>(.*?)</tr>", t, re.S):
        cells = [H.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)]
        if len(cells) >= 4 and len(cells[0]) == 1:
            out.append(cells[0])
    return out


@lru_cache(None)
def n5_vocab_keys():
    _, vocab = waller()
    keys = set()
    for w, r, en in vocab:
        for part in re.split(r"[/、・,\s]+", w + "/" + r):
            part = part.strip().strip("～〜")
            if not part:
                continue
            keys.add(part)
            keys.add(hira(part))
            if part.endswith("する") and len(part) > 2:
                keys.add(part[:-2])
    return keys


@lru_cache(None)
def stage0_keys():
    """Words the site already teaches in stage 0 (content.yaml)."""
    sys.path.insert(0, HERE)
    from items import load_content
    c = load_content()
    keys = set()

    def add(x):
        keys.add(x["w"]); keys.add(x["r"])
    for cands in list(c["kana_examples"].values()) + list(c["dakuon_examples"].values()):
        for x in cands:
            add(x)
    for x in c["youon_examples"] + c["katakana_words"] + c.get("hatsuon_examples", []):
        add(x)
    for grp in c["pairs"].values():
        for p in grp:
            for x in p["items"]:
                add(x)
    for grp in c["accent_types"].values():
        for x in grp:
            add(x)
    for x in c["numbers"]:
        keys.add(x["w"]); keys.add(x["r"])
    return keys


# Words written with kanji that have two standard readings; UniDic picks one,
# the sentence may legitimately use the other. Published on the verification page.
READING_VARIANTS = {
    "私": ["わたし", "わたくし"],
    "何": ["なに", "なん"],
    "日本": ["にほん", "にっぽん"],
    "日本語": ["にほんご", "にっぽんご"],
    "今日": ["きょう", "こんにち"],
    "明日": ["あした", "あす", "みょうにち"],
    "昨日": ["きのう", "さくじつ"],
}
# content words that are not on the list for a grammatical reason
VOCAB_OK = {"田中": "人名", "日本": "国名", "中国": "国名"}
# whole-word readings of proper nouns: the 常用漢字表 does not cover proper
# nouns (前書き 3), so these are checked against UniDic and JMdict instead
PROPER_READINGS = {"日本": {"r": ["にほん", "にっぽん"], "why": "国名；常用漢字表原则上不收固有名词，读法据 UniDic 与 JMdict"}}


def _vocab_hit(cands):
    if cands & n5_vocab_keys():
        return "waller"
    if cands & stage0_keys():
        return "stage0"
    return None


def vocab_report(toks):
    """[(surface, None|reason)] per content word. Multi-token words are joined
    first (UniDic splits 図書館 into 図書+館, 日曜日 into 日曜+日); a counter after a
    numeral (八+時) is grammar, not vocabulary."""
    out = []
    i = 0
    skip = ("助詞", "助動詞", "補助記号", "記号", "空白", "接尾辞", "接頭辞")
    while i < len(toks):
        t = toks[i]
        joined = None
        for j in range(min(len(toks), i + 4), i + 1, -1):
            s = "".join(x["s"] for x in toks[i:j])
            if _vocab_hit({s}):
                joined = (s, j)
                break
        if joined:
            out.append((joined[0], None))
            i = joined[1]
            continue
        i += 1
        if t["pos1"] in skip or t["pos2"] in ("固有名詞", "数詞"):
            continue
        if t["pos3"] == "助数詞可能" and i >= 2 and toks[i - 2]["pos2"] == "数詞":
            continue
        lem = re.sub(r"-.*$", "", t["lemma"] or "")
        cands = {t["s"], t["orthBase"], lem, t["kanaBase"], t["kana"], t.get("lForm", "")}
        if _vocab_hit(cands) or t["s"] in VOCAB_OK:
            out.append((t["s"], None))
        else:
            out.append((t["s"], "不在 Waller N5 词表，也不是入门课已教的词"))
    return out


# --------------------------------------------------------- conjugation ---
A_ROW = dict(zip("うくぐすつぬぶむる", "わかがさたなばまら"))
I_ROW = dict(zip("うくぐすつぬぶむる", "いきぎしちにびみり"))
TE = {"う": ("って", "った"), "つ": ("って", "った"), "る": ("って", "った"),
      "む": ("んで", "んだ"), "ぶ": ("んで", "んだ"), "ぬ": ("んで", "んだ"),
      "く": ("いて", "いた"), "ぐ": ("いで", "いだ"), "す": ("して", "した")}
# UniDic's name for the stem form in て/た (the 音便 the rule predicts)
ONBIN = {"う": "連用形-促音便", "つ": "連用形-促音便", "る": "連用形-促音便", "む": "連用形-撥音便",
         "ぶ": "連用形-撥音便", "ぬ": "連用形-撥音便", "く": "連用形-イ音便", "ぐ": "連用形-イ音便", "す": "連用形-一般"}
VERB_FORMS = ["dict", "masu", "masen", "mashita", "masendeshita", "nai", "te", "ta"]
VERB_FORM_ZH = {"dict": "辞书形", "masu": "ます形", "masen": "ません", "mashita": "ました",
                "masendeshita": "ませんでした", "nai": "ない形", "te": "て形", "ta": "た形"}


def conj_verb(w, r, g):
    """{form: (written, reading)} by the textbook rules. g: godan/ichidan/irregular."""
    out = {"dict": (w, r)}

    def polite(ws, rs):
        for f, suf in (("masu", "ます"), ("masen", "ません"), ("mashita", "ました"), ("masendeshita", "ませんでした")):
            out[f] = (ws + suf, rs + suf)
    if g == "irregular":
        if r.endswith("する"):
            pw, pr = w[:-2], r[:-2]
            polite(pw + "し", pr + "し")
            out["nai"] = (pw + "しない", pr + "しない")
            out["te"] = (pw + "して", pr + "して")
            out["ta"] = (pw + "した", pr + "した")
        elif w == "来る":
            polite("来", "き")
            out["nai"] = ("来ない", "こない")
            out["te"] = ("来て", "きて")
            out["ta"] = ("来た", "きた")
        else:
            raise ValueError(w)
        return out
    if g == "ichidan":
        sw, sr = w[:-1], r[:-1]
        polite(sw, sr)
        out["nai"] = (sw + "ない", sr + "ない")
        out["te"] = (sw + "て", sr + "て")
        out["ta"] = (sw + "た", sr + "た")
        return out
    e = r[-1]
    assert w[-1] == e, (w, r)
    sw, sr = w[:-1], r[:-1]
    polite(sw + I_ROW[e], sr + I_ROW[e])
    if w == "ある":
        out["nai"] = ("ない", "ない")  # ある has no あらない: its plain negative is ない
    else:
        out["nai"] = (sw + A_ROW[e] + "ない", sr + A_ROW[e] + "ない")
    te, ta = TE[e]
    if w == "行く":
        te, ta = "って", "った"  # the one く-verb with 促音便
    out["te"] = (sw + te, sr + te)
    out["ta"] = (sw + ta, sr + ta)
    return out


def expected_verb_parse(w, r, g, form):
    """(head cForm, auxiliary lemmas after the head)."""
    suf = {"dict": [], "masu": ["ます"], "masen": ["ます", "ず"], "mashita": ["ます", "た"],
           "masendeshita": ["ます", "ず", "です", "た"], "nai": ["ない"], "te": ["て"], "ta": ["た"]}[form]
    if form == "dict":
        return "終止形-一般", suf
    if form == "nai":
        return "未然形-一般", suf
    if form in ("te", "ta"):
        if g == "godan":
            return ("連用形-促音便" if w == "行く" else ONBIN[r[-1]]), suf
        return "連用形-一般", suf
    return "連用形-一般", suf


I_FORMS = ["dict", "nai", "katta", "nakatta", "te", "desu", "naidesu", "arimasen", "kattadesu", "nakattadesu", "arimasendeshita"]
NA_FORMS = ["dict", "na", "janai", "datta", "janakatta", "de", "desu", "jaarimasen", "dewaarimasen", "deshita", "jaarimasendeshita"]
ADJ_FORM_ZH = {
    "dict": "基本形", "nai": "否定", "katta": "过去", "nakatta": "过去否定", "te": "て形",
    "desu": "敬体·现在", "naidesu": "敬体·否定", "arimasen": "敬体·否定", "kattadesu": "敬体·过去",
    "nakattadesu": "敬体·过去否定", "arimasendeshita": "敬体·过去否定",
    "na": "连体（＋名词）", "janai": "否定", "datta": "过去", "janakatta": "过去否定", "de": "て形（で）",
    "jaarimasen": "敬体·否定", "dewaarimasen": "敬体·否定（正式）", "deshita": "敬体·过去",
    "jaarimasendeshita": "敬体·过去否定",
}


def conj_adj(w, r, cls):
    if cls == "i":
        if w == "いい":
            sw, sr = "よ", "よ"  # いい conjugates from よい: よくない, よかった
        else:
            sw, sr = w[:-1], r[:-1]
        f = {"dict": ("", "い"), "nai": ("くない", None), "katta": ("かった", None), "nakatta": ("くなかった", None),
             "te": ("くて", None), "desu": ("", "いです"), "naidesu": ("くないです", None), "arimasen": ("くありません", None),
             "kattadesu": ("かったです", None), "nakattadesu": ("くなかったです", None),
             "arimasendeshita": ("くありませんでした", None)}
        out = {}
        for k, (suf, base) in f.items():
            if base is not None:
                out[k] = (w + base[1:], r + base[1:])  # dictionary form (+ です)
            else:
                out[k] = (sw + suf, sr + suf)
        return out
    suf = {"dict": "", "na": "な", "janai": "じゃない", "datta": "だった", "janakatta": "じゃなかった", "de": "で",
           "desu": "です", "jaarimasen": "じゃありません", "dewaarimasen": "ではありません", "deshita": "でした",
           "jaarimasendeshita": "じゃありませんでした"}
    return {k: (w + s, r + s) for k, s in suf.items()}


def expected_adj_parse(cls, form):
    """(head cForm or None for 形状詞, auxiliary lemmas)."""
    if cls == "i":
        return {"dict": ("終止形-一般", []), "nai": ("連用形-一般", ["無い"]), "katta": ("連用形-促音便", ["た"]),
                "nakatta": ("連用形-一般", ["無い", "た"]), "te": ("連用形-一般", ["て"]),
                "desu": ("終止形-一般", ["です"]), "naidesu": ("連用形-一般", ["無い", "です"]),
                "arimasen": ("連用形-一般", ["有る", "ます", "ず"]), "kattadesu": ("連用形-促音便", ["た", "です"]),
                "nakattadesu": ("連用形-一般", ["無い", "た", "です"]),
                "arimasendeshita": ("連用形-一般", ["有る", "ます", "ず", "です", "た"])}[form]
    return {"dict": (None, []), "na": (None, ["だ"]), "janai": (None, ["だ", "無い"]), "datta": (None, ["だ", "た"]),
            "janakatta": (None, ["だ", "無い", "た"]), "de": (None, ["だ"]), "desu": (None, ["です"]),
            "jaarimasen": (None, ["だ", "有る", "ます", "ず"]), "dewaarimasen": (None, ["だ", "は", "有る", "ます", "ず"]),
            "deshita": (None, ["です", "た"]), "jaarimasendeshita": (None, ["だ", "有る", "ます", "ず", "です", "た"])}[form]


def _lemma(t):
    return re.sub(r"-.*$", "", t["lemma"] or "")


def _parse_str(ft):
    return " + ".join(f"{t['s']}({t['pos1']},{t['cForm']},{_lemma(t)})" for t in ft)


def _first_match(text, test):
    """Run test(tokens) -> None (ok) | reason over UniDic's n-best analyses.
    Returns (ok, rank, why_of_best, parse_used)."""
    an = analyses(text)
    why0 = None
    for i, ft in enumerate(an):
        why = test(ft)
        if why is None:
            return True, i + 1, "", _parse_str(ft)
        if why0 is None:
            why0 = why
    return False, None, why0 or "无分析结果", _parse_str(an[0]) if an else ""


def _kana_of(ft, form_is_dict=False):
    k = "".join(t["kana"] for t in ft)
    if form_is_dict and len(ft) >= 1:
        # 言う: UniDic's 語形 is ユウ (the pronunciation), its 語彙素読み is イウ —
        # the spelling 現代仮名遣い prescribes. Accept the latter for the base form.
        alt = "".join(t["kana"] for t in ft[:-1]) + ft[-1]["lForm"]
        return {k, alt}
    return {k}


def check_verb(v, g):
    w, r = v["w"], v["r"]
    res = {"w": w, "r": r, "g": g, "zh": v["zh"], "tag": v.get("tag"), "forms": {}, "problems": [], "notes": []}
    state = {}

    def dict_test(ft):
        head = ft[-1]
        ct = head["cType"] or ""
        ug = "godan" if ct.startswith("五段") else "ichidan" if ("一段" in ct) else "irregular" if ct in ("カ行変格", "サ行変格") else None
        if head["pos1"] != "動詞":
            return f"未分析为动词（{head['pos1']}）"
        if ug != g:
            return f"类别不符：声明为 {g}，UniDic 为 {ct}"
        if r not in _kana_of(ft, True):
            return f"读音不符：UniDic 为 {''.join(t['kana'] for t in ft)}"
        state.update(lemma=_lemma(head), prefix=[t["s"] for t in ft[:-1]], ctype=ct, lemma_full=head["lemma"],
                     kana=head["kana"], lform=head["lForm"])
        return None
    ok, rank, why, parse = _first_match(w, dict_test)
    if not ok:
        res["problems"].append(why)
        res["ok"] = False
        return res
    res["unidic_group"] = state["ctype"]
    res["lemma"] = state["lemma_full"]
    if state["kana"] != state["lform"]:
        res["notes"].append(f"UniDic：语形{state['kana']}，读法{state['lform']}")
    if rank > 1:
        res["notes"].append(f"辞书形：UniDic 第 {rank} 候选与预期一致")
    lemma, prefix = state["lemma"], state["prefix"]
    for form, (fw, fr) in conj_verb(w, r, g).items():
        fp = {"w": fw, "r": fr}
        if w == "ある" and form == "nai":
            def t_aru(ft):
                if len(ft) == 1 and ft[0]["pos1"] == "形容詞" and _lemma(ft[0]) == "無い" and ft[0]["kana"] == fr:
                    return None
                return "ない 未被分析为形容词「無い」"
            ok, rank, why, parse = _first_match(fw, t_aru)
            fp["note"] = "ある 的否定是「ない」（形容词），没有「あらない」"
        else:
            cf, sufs = expected_verb_parse(w, r, g, form)

            def t_form(ft, cf=cf, sufs=sufs, fr=fr, form=form):
                np = len(prefix)
                if len(ft) <= np or [t["s"] for t in ft[:np]] != prefix:
                    return "前半部分切分不同"
                hp = ft[np]
                if hp["pos1"] != "動詞" or _lemma(hp) != lemma:
                    return f"词元不符：{hp['lemma']}"
                if hp["cForm"] != cf:
                    return f"活用形不符：预期 {cf}，UniDic 为 {hp['cForm']}"
                got = [_lemma(t) for t in ft[np + 1:]]
                if got != sufs:
                    return f"后接成分不符：预期 {sufs}，UniDic 为 {got}"
                if fr not in _kana_of(ft, form == "dict"):
                    return f"读音不符：UniDic 为 {''.join(t['kana'] for t in ft)}"
                return None
            ok, rank, why, parse = _first_match(fw, t_form)
        fp.update(ok=ok, rank=rank, why=why, parse=parse)
        if ok and rank > 1:
            fp["ambiguous"] = True  # written form has another, more frequent reading
        res["forms"][form] = fp
    res["ok"] = not res["problems"] and all(f["ok"] for f in res["forms"].values())
    return res


def check_adj(a, cls):
    w, r = a["w"], a["r"]
    res = {"w": w, "r": r, "cls": cls, "zh": a["zh"], "tag": a.get("tag"), "forms": {}, "problems": [], "notes": []}
    state = {}
    # the class is read off the attributive form: Xい+noun is 形容詞 終止/連体,
    # Xな is 形状詞 (or a noun UniDic marks 形状詞可能) + だ(連体形)
    probe = w if cls == "i" else w + "な"

    def class_test(ft):
        h = ft[0]
        if cls == "i":
            if len(ft) != 1 or h["pos1"] != "形容詞":
                return f"类别不符：UniDic 为 {h['pos1']}-{h['pos2']}"
        else:
            is_na = h["pos1"] == "形状詞" or (h["pos1"] == "名詞" and "形状詞可能" in (h["pos3"] or ""))
            if len(ft) != 2 or not is_na or _lemma(ft[1]) != "だ":
                return f"类别不符：UniDic 为 {h['pos1']}-{h['pos2']}-{h['pos3']}"
        if h["kana"] != r and h["lForm"] != r:
            return f"读音不符：UniDic 为 {h['kana']}"
        state.update(lemma=_lemma(h), pos=f"{h['pos1']}-{h['pos2']}-{h['pos3']}", lemma_full=h["lemma"])
        return None
    ok, rank, why, parse = _first_match(probe, class_test)
    if not ok:
        res["problems"].append(why)
        res["ok"] = False
        return res
    res["unidic_pos"], res["lemma"] = state["pos"], state["lemma_full"]
    if rank > 1:
        res["notes"].append(f"类别：UniDic 第 {rank} 候选与预期一致")
    lemma = state["lemma"]
    for form, (fw, fr) in conj_adj(w, r, cls).items():
        cf, sufs = expected_adj_parse(cls, form)

        def t_form(ft, cf=cf, sufs=sufs, fr=fr):
            hp = ft[0]
            if _lemma(hp) != lemma:
                return f"词元不符：{hp['lemma']}"
            if cls == "i" and hp["pos1"] != "形容詞":
                return f"词性不符：{hp['pos1']}"
            if cf and hp["cForm"] != cf:
                return f"活用形不符：预期 {cf}，UniDic 为 {hp['cForm']}"
            got = [_lemma(t) for t in ft[1:]]
            if got != sufs:
                return f"后接成分不符：预期 {sufs}，UniDic 为 {got}"
            if "".join(t["kana"] for t in ft) != fr:
                return f"读音不符：UniDic 为 {''.join(t['kana'] for t in ft)}"
            return None
        ok, rank, why, parse = _first_match(fw, t_form)
        fp = {"w": fw, "r": fr, "ok": ok, "rank": rank, "why": why, "parse": parse}
        if ok and rank > 1:
            fp["ambiguous"] = True
        res["forms"][form] = fp
    res["ok"] = not res["problems"] and all(f["ok"] for f in res["forms"].values())
    return res


# ------------------------------------------------------------ sentences ---
PUNCT = "。、！？「」 　"
SPECIAL_PRON = {"は": "わ", "へ": "え", "を": "お"}


def resolve_reading(w, r):
    """Align the hand-written kana `r` with one of UniDic's n-best analyses of
    `w`. Returns (tokens with chosen kana/pron, rank, problem or None)."""
    target = hira(re.sub(f"[{PUNCT}]", "", r))
    first = None
    for rank, toks in enumerate(analyses(w), 1):
        toks = [t for t in toks if t["pos1"] not in ("補助記号", "空白")]
        if first is None:
            first = toks
        choices = []
        for t in toks:
            opts = [t["kana"]]
            for v in READING_VARIANTS.get(t["s"], []):
                if v not in opts:
                    opts.append(v)
            choices.append(opts)

        def dfs(i, pos, acc):
            if i == len(toks):
                return acc if pos == len(target) else None
            for o in choices[i]:
                if target.startswith(o, pos):
                    got = dfs(i + 1, pos + len(o), acc + [o])
                    if got is not None:
                        return got
            return None
        chosen = dfs(0, 0, [])
        if chosen is None:
            continue
        for t, c in zip(toks, chosen):
            t["chosen"] = c
            # pronunciation: UniDic's pron where its kana was chosen (this is what
            # turns particle は/へ/を into わ/え/お); else the chosen variant itself
            t["pr"] = t["pron"] if c == t["kana"] else c
        return toks, rank, None
    return first, None, "读音与 UniDic 不一致：UniDic 读作「" + "".join(t["kana"] for t in first) + "」"


def check_sentence(s):
    res = {"id": s["id"], "w": s["w"], "r": s["r"], "zh": s["zh"], "problems": [], "notes": [], "vocab": []}
    toks, rank, prob = resolve_reading(s["w"], s["r"])
    if prob:
        res["problems"].append(prob)
    else:
        res["rank"] = rank
        if rank > 1:
            res["notes"].append(f"UniDic 第 {rank} 候选与预期读音一致")
        res["pron"] = "".join(t["pr"] for t in toks)
        res["kana"] = "".join(t["chosen"] for t in toks)
        res["variants_used"] = [f"{t['s']}={t['chosen']}" for t in toks if t["chosen"] != t["kana"]]
        res["particles"] = [t["s"] for t in toks if t["pos1"] == "助詞" and t["s"] in SPECIAL_PRON]
        # the same sentence with particle は/へ read as spelled (ha/he): the audio
        # check makes the phone recognizer choose between this and `pron`
        res["spell"] = "".join(t["chosen"] if (t["pos1"] == "助詞" and t["s"] in ("は", "へ")) else t["pr"] for t in toks)
        res["tokens"] = [{"s": t["s"], "k": t["chosen"], "p": t["pos1"]} for t in toks]
        res["display"] = display_reading(s["r"], res["tokens"])
        res["wdisp"] = written_display(s["w"], toks, s.get("focus", []))
    for f in s.get("focus", []):
        if not any(t["s"] == f and t["pos1"] == "助詞" for t in toks):
            res["problems"].append(f"「{f}」未被 UniDic 分析为助词")
    res["vocab"] = [f"{x}（{why}）" for x, why in vocab_report(toks) if why]
    res["ok"] = not res["problems"]
    return res


def written_display(w, toks, focus):
    """[(text, mark)] for the sentence itself: mark 2 = a particle the sentence
    illustrates, 1 = another particle, 0 = rest."""
    out, pos = [], 0
    for t in toks:
        i = w.find(t["s"], pos)
        if i < 0:
            return [(w, 0)]
        if i > pos:
            out.append((w[pos:i], 0))
        mark = 2 if (t["pos1"] == "助詞" and t["s"] in focus) else (1 if t["pos1"] == "助詞" else 0)
        out.append((t["s"], mark))
        pos = i + len(t["s"])
    if pos < len(w):
        out.append((w[pos:], 0))
    merged = []
    for text, mk in out:
        if merged and mk == 0 and merged[-1][1] == 0:
            merged[-1] = (merged[-1][0] + text, 0)
        else:
            merged.append((text, mk))
    return merged


def display_reading(r, toks):
    """[(text, special_pron or None)] for the reading line: the written kana with
    its original spaces and script, particles は/へ/を marked for annotation."""
    out = []
    pos = 0
    for t in toks:
        while pos < len(r) and r[pos] in PUNCT:
            out.append((r[pos], None))
            pos += 1
        n = len(t["k"])
        piece = r[pos:pos + n]
        assert hira(piece) == t["k"], (r, t, pos)
        sp = SPECIAL_PRON.get(piece) if t["p"] == "助詞" else None
        out.append((piece, sp))
        pos += n
    out.append((r[pos:], None))
    merged = []
    for text, sp in out:
        if not text:
            continue
        if merged and sp is None and merged[-1][1] is None:
            merged[-1] = (merged[-1][0] + text, None)
        else:
            merged.append((text, sp))
    return merged


# ---------------------------------------------------------------- kanji ---
def kun_full(x):
    return x.replace(".", "").replace("-", "")


VOICE = dict(zip("かきくけこさしすせそたちつてとはひふへほ", "がぎぐげござじずぜぞだぢづでどばびぶべぼ"))
HALF = dict(zip("はひふへほ", "ぱぴぷぺぽ"))


def sound_variants(c):
    """Readings a morpheme can take inside a word: 連濁, 半濁音化, 促音化."""
    out = {c: "本来"}
    heads = {c: None}
    if c and c[0] in VOICE:
        heads[VOICE[c[0]] + c[1:]] = "连浊"
    if c and c[0] in HALF:
        heads[HALF[c[0]] + c[1:]] = "半浊音化"
    for h, how in heads.items():
        if how:
            out.setdefault(h, how)
        if len(h) >= 2 and h[-1] in "つくちき":
            out.setdefault(h[:-1] + "っ", (how + "+" if how else "") + "促音化")
        if h.endswith("じゅう"):
            out.setdefault(h[:-3] + "じゅっ", "促音化")
            out.setdefault(h[:-3] + "じっ", "促音化")
    return out


def official_readings(k):
    """Readings of the official table (PDF parse), with the okurigana split from
    ja.wikipedia (- marks) and whether KANJIDIC2 also lists the reading."""
    pdf = joyo_pdf().get(k, [])
    wiki = joyo_wiki()[0].get(k, {}).get("readings", [])
    split = {re.sub("-", "", x): x for x, _ in wiki}
    kd = kanjidic().get(k, {})
    kd_on = {hira(x) for x in kd.get("on", [])}
    kd_kun = {hira(kun_full(x)) for x in kd.get("kun", [])}
    kd_split = {}
    for x in kd.get("kun", []):
        kd_split.setdefault(hira(kun_full(x)), set()).add(hira(x.replace("-", "")))
    out = []
    for rd, special in pdf:
        is_on = bool(re.fullmatch(r"[ァ-ヺー]+", rd))
        h = hira(rd)
        sp = split.get(rd, rd)
        stem, _, okuri = hira(sp).partition("-")
        in_kd = h in (kd_on if is_on else kd_kun)
        # okurigana split: ja.wikipedia (-) vs KANJIDIC2 (.)
        kds = kd_split.get(h, set())
        split_ok = is_on or not kds or any(x.replace(".", "-") == hira(sp) for x in kds)
        out.append({"r": h, "kind": "on" if is_on else "kun", "stem": stem, "okuri": okuri, "special": special,
                    "kanjidic": in_kd, "split_ok": split_ok})
    return out


def check_kanji(e, core, kvg_count, anim):
    k = e["k"]
    kd = kanjidic().get(k, {})
    res = {"k": k, "zh": e["zh"], "g": e["g"], "core": k in core, "problems": [], "flags": [], "notes": []}
    pdf = joyo_pdf().get(k)
    if pdf is None:
        res["problems"].append("常用漢字表中找不到")
    wk = joyo_wiki()[0].get(k, {}).get("readings") or []
    if [tuple(x) for x in (pdf or [])] != [(re.sub("-", "", a), b) for a, b in wk]:
        res["problems"].append("常用漢字表 PDF 解析与维基百科常用漢字一覧不一致")
    readings = official_readings(k)
    for o in readings:
        if not o["kanjidic"]:
            res["flags"].append(f"读音「{o['r']}」在常用漢字表中（{'特殊读法' if o['special'] else '一般读法'}），KANJIDIC2 没有：不在本站列出")
        if not o["split_ok"]:
            res["flags"].append(f"读音「{o['r']}」的送假名位置两源不同")
    res["readings"] = readings
    kd_n = (kd.get("strokes") or [None])[0]
    an = anim.get(k)
    res["strokes"] = {"kanjivg": kvg_count, "animcjk": len(an["strokes"]) if an else None, "kanjidic": kd_n}
    if len({kvg_count, res["strokes"]["animcjk"], kd_n}) != 1:
        res["problems"].append(f"笔画数不一致：KanjiVG {kvg_count} / animCJK {res['strokes']['animcjk']} / KANJIDIC2 {kd_n}")
    res["simp"] = simplified(k)
    if res["simp"].get("disagree"):
        res["problems"].append("简体字形：OpenCC 与 Unihan 不一致 " + res["simp"]["disagree"])
    res["en"] = kd.get("en", [])[:4]
    return res


@lru_cache(None)
def _opencc():
    import opencc
    return opencc.OpenCC("jp2t"), opencc.OpenCC("t2s")


@lru_cache(None)
def unihan_variants():
    out = {}
    with open(os.path.join(RAW, "unihan", "Unihan_Variants.txt"), encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue
            cp, field, val = line.rstrip("\n").split("\t")
            ch = chr(int(cp[2:], 16))
            vals = [chr(int(v.split("<")[0][2:], 16)) for v in val.split()]
            out.setdefault(ch, {})[field] = vals
    return out


def _nfc(s):
    # CJK compatibility ideographs (社 U+FA4C …) fold to the unified character
    return unicodedata.normalize("NFC", s)


def simplified(k):
    jp2t, t2s = _opencc()
    t1 = _nfc(jp2t.convert(k))
    s1 = _nfc(t2s.convert(t1))
    uv = unihan_variants()
    t2 = _nfc((uv.get(k, {}).get("kJapaneseOldVariant") or [k])[0])
    s2 = _nfc((uv.get(t2, {}).get("kSimplifiedVariant") or [t2])[0])
    res = {"trad": t1, "simp": s1, "unihan": f"{t2}→{s2}"}
    if (t1, s1) != (t2, s2):
        rel = lambda a, b: b in sum((uv.get(a, {}).get(f) or [] for f in
                                     ("kSimplifiedVariant", "kTraditionalVariant", "kSemanticVariant", "kZVariant",
                                      "kSpecializedSemanticVariant", "kJapaneseOldVariant", "kJapaneseNewVariant")), [])
        if s1 == s2 or rel(k, s1) or rel(s1, k) or rel(t1, k) or rel(k, t1):
            res["via"] = "Unihan 异体字关联"
        else:
            res["disagree"] = f"OpenCC {t1}→{s1}，Unihan {t2}→{s2}"
    res["differs"] = s1 != k
    res["trad_differs"] = t1 != k
    return res


@lru_cache(None)
def animcjk():
    out = {}
    with open(os.path.join(RAW, "animCJK", "graphicsJa.txt"), encoding="utf-8") as f:
        for line in f:
            d = json.loads(line)
            out[d["character"]] = d
    return out


def kanjivg_paths(ch):
    fn = os.path.join(RAW, "kanjivg", "kanji", f"{ord(ch):05x}.svg")
    t = open(fn, encoding="utf-8").read()
    paths = []
    for m in re.finditer(r'<path[^>]*id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"', t):
        paths.append((int(m.group(1)), m.group(2)))
    paths.sort()
    return [d for _, d in paths]


def path_endpoints(d):
    """Start and end point of an SVG path (M/m, C/c, S/s, L/l, H/h, V/v, Z)."""
    toks = re.findall(r"[MmCcSsLlHhVvZzQqTtAa]|-?\d*\.?\d+(?:e-?\d+)?", d)
    i, x, y, cmd = 0, 0.0, 0.0, None
    start = None
    nargs = {"M": 2, "L": 2, "C": 6, "S": 4, "Q": 4, "T": 2, "H": 1, "V": 1, "A": 7}
    while i < len(toks):
        if re.match(r"[A-Za-z]", toks[i]):
            cmd = toks[i]; i += 1
            if cmd in "Zz":
                continue
        n = nargs[cmd.upper()]
        vals = [float(v) for v in toks[i:i + n]]
        i += n
        rel = cmd.islower()
        U = cmd.upper()
        if U == "H":
            x = x + vals[0] if rel else vals[0]
        elif U == "V":
            y = y + vals[0] if rel else vals[0]
        else:
            nx, ny = vals[-2], vals[-1]
            x, y = (x + nx, y + ny) if rel else (nx, ny)
        if start is None:
            start = (x, y)
        if U == "M":
            cmd = "l" if rel else "L"  # implicit lineto after moveto
    return start, (x, y)


def stroke_order_check(k):
    """Stroke ORDER, KanjiVG vs animCJK. Both are mapped onto a unit square
    (KanjiVG 109-unit, y down; animCJK 1024-unit, y up from 900); the cost of
    pairing two strokes is the distance of their start points plus that of their
    end points. The order agrees when the cheapest one-to-one pairing (Hungarian
    algorithm) pairs stroke i with stroke i for every i: drawing styles differ a
    little, a swapped or reversed stroke changes the optimum."""
    kv = kanjivg_paths(k)
    an = animcjk().get(k)
    if not an:
        return {"ok": False, "why": "animCJK 无此字"}
    md = an["medians"]
    if len(kv) != len(md):
        return {"ok": False, "why": f"笔画数不同 {len(kv)}/{len(md)}"}
    A = []
    for d in kv:
        (sx, sy), (ex, ey) = path_endpoints(d)
        A.append(((sx / 109, sy / 109), (ex / 109, ey / 109)))
    B = [(((m[0][0]) / 1024, (900 - m[0][1]) / 1024), ((m[-1][0]) / 1024, (900 - m[-1][1]) / 1024)) for m in md]

    def dist(a, b):
        return ((a[0][0] - b[0][0]) ** 2 + (a[0][1] - b[0][1]) ** 2) ** .5 + ((a[1][0] - b[1][0]) ** 2 + (a[1][1] - b[1][1]) ** 2) ** .5
    from scipy.optimize import linear_sum_assignment
    cost = [[dist(a, b) for b in B] for a in A]
    rows, cols = linear_sum_assignment(cost)
    bad = [int(i) + 1 for i, j in zip(rows, cols) if i != j]
    diag = [cost[i][i] for i in range(len(A))]
    return {"ok": not bad, "max_dist": round(max(diag), 3), "bad": bad}


def _fuhyo_hit(w, r, a, b):
    """Is the special reading of w[a:b] covered by a 付表 entry? The entry may be
    the word itself or a part of it (お父さん contains 父さん)."""
    fh = joyo_fuhyo()
    if (w, r) in fh:
        return f"{w}（{r}）"
    for (fw, fr) in fh:
        if fw in w and w.find(fw) <= a and w.find(fw) + len(fw) >= b and fr in r:
            return f"{fw}（{fr}）"
    return None


def example_check(k, x):
    """One example word of kanji k: reading (UniDic n-best, confirmed by JMdict),
    N5 membership, which official reading of k it uses."""
    w, r = x["w"], x["r"]
    res = {"w": w, "r": r, "zh": x["zh"], "problems": [], "notes": []}
    spec = furigana().get((w, r))
    an = analyses(w)
    rank = None
    for i, ft in enumerate(an):
        ks = {"".join(t["kana"] for t in ft)}
        if len(ft) == 1:
            ks.add(ft[0]["lForm"])
        if r in ks:
            rank = i + 1
            break
    if rank is None and r in READING_VARIANTS.get(w, []):
        rank = 0
    if rank is None:
        res["problems"].append(f"读音不符：UniDic 读作 {''.join(t['kana'] for t in an[0])}")
    elif rank > 1 and not spec:
        res["problems"].append(f"读音只在 UniDic 第 {rank} 候选中出现，且 JMdict 无此词条：不采用")
    elif rank > 1:
        res["notes"].append(f"UniDic 第 {rank} 候选与预期读音一致，JMdict 有此词条")
    res["unidic_rank"] = rank
    res["jmdict"] = bool(spec)
    keys = n5_vocab_keys()
    res["n5"] = "waller" if (w in keys) else ("stage0" if w in stage0_keys() else None)
    if not spec:
        res["problems"].append("JmdictFurigana 无此词条（无法核对单字读音）")
        return res
    segs = parse_furigana(w, spec)
    res["furigana"] = spec
    off = [o for o in official_readings(k) if o["kanjidic"]]  # readings both sources agree on
    target = [i for i, ch in enumerate(w) if ch == k]
    # every whole-word reading in the word (not only the one covering k) must be
    # a 付表 entry, or an explicitly listed proper noun
    for (a, b, kn) in segs:
        if b - a > 1 and not any(a <= i < b for i in target):
            if not _fuhyo_hit(w, r, a, b):
                pn = PROPER_READINGS.get(w[a:b])
                if pn and kn in pn["r"]:
                    res.setdefault("proper", []).append({"part": w[a:b], "kana": kn, "why": pn["why"]})
                else:
                    res["problems"].append(f"「{w[a:b]}」整体读「{kn}」，但常用漢字表付表中没有")
    for (a, b, kn) in segs:
        if not any(a <= i < b for i in target):
            continue
        if b - a > 1:
            hit = _fuhyo_hit(w, r, a, b)
            res["special"] = {"part": w[a:b], "kana": kn, "fuhyo": hit}
            if not hit:
                res["problems"].append(f"「{w[a:b]}」整体读「{kn}」，但常用漢字表付表中没有")
            continue
        after = w[b:]  # kana written after the kanji (送り仮名), e.g. 分[かる]
        best = None
        for order, o in enumerate(off):
            cands = []  # (kana, score, how)
            if o["kind"] == "on":
                cands.append((o["r"], 3, "本来"))
            elif o["okuri"]:
                ok_ = o["okuri"]
                if after.startswith(ok_):
                    # the most specific match: the written 送り仮名 is exactly this
                    # reading's (大きい = おお.きい rather than the prefix おお)
                    cands.append((o["stem"], 3.25, "本来"))         # 分かる = 分(わ)+かる
                elif ok_[-1] in I_ROW and after.startswith(ok_[:-1] + I_ROW[ok_[-1]]):
                    cands.append((o["stem"], 2, "连用形"))          # 買い物 = 買(か)+い
                elif ok_.endswith("る") and len(ok_) >= 2 and after.startswith(ok_[:-1]):
                    cands.append((o["stem"], 2, "连用形"))          # 食べ物 = 食(た)+べ
                elif not after or not re.match(r"[ぁ-ゖ]", after):
                    # 送り仮名 left out inside a compound: 入口 = 入(いり)口
                    if ok_[-1] in I_ROW:
                        cands.append((o["stem"] + ok_[:-1] + I_ROW[ok_[-1]], 1, "连用形"))
                    if ok_.endswith("る"):
                        cands.append((o["stem"] + ok_[:-1], 1, "连用形"))  # 出口 = 出(で)口
                    cands.append((o["stem"], 1, "本来"))             # 三日 = 三(みっ)日
                    cands.append((o["stem"] + ok_, 0, "本来"))
            else:
                cands.append((o["r"], 3, "本来"))                   # 話(はなし), 人(ひと)
            for c, score, how in cands:
                v = sound_variants(c)
                if kn in v:
                    sc = score - (0 if v[kn] == "本来" else 0.5)
                    hw = how if v[kn] == "本来" else v[kn]
                    if best is None or sc > best[0]:
                        best = (sc, o, hw)
        if not best:
            hit = _fuhyo_hit(w, r, a, b)
            if hit:
                res["special"] = {"part": w[a:b], "kana": kn, "fuhyo": hit}
            else:
                res["problems"].append(f"「{k}」在此词中读「{kn}」，不对应两源都收录的常用漢字表读音")
        else:
            _, o, how = best
            res["reading"] = {"r": o["r"], "kind": o["kind"], "stem": o["stem"], "okuri": o["okuri"], "as": kn,
                              "how": how, "special": o["special"]}
    return res


# -------------------------------------------------------------------- run ---
def check_all():
    c = content()
    rep = {"sources": {}, "verbs": [], "adjectives": [], "phrases": [], "sentences": [], "kanji": [], "joyo_parse": {}}
    # --- verbs / adjectives
    for g in ("godan", "ichidan", "irregular"):
        for v in c["verbs"][g]:
            rep["verbs"].append(check_verb(v, g))
    for cls in ("i", "na"):
        for a in c["adjectives"][cls]:
            rep["adjectives"].append(check_adj(a, cls))
    for p in c["adjectives"]["phrases"]:
        toks, rank, prob = resolve_reading(p["w"], p["r"])
        voc = [f"{x}（{why}）" for x, why in vocab_report(toks) if why]
        rep["phrases"].append({**p, "ok": not prob, "problems": [prob] if prob else [], "vocab": voc, "rank": rank,
                               "pron": "".join(t.get("pr", "") for t in toks) if not prob else None})
    # --- sentences
    for s in c["sentences"]:
        rep["sentences"].append(check_sentence(s))
    # --- joyo parse vs wiki (all kanji)
    pdf = joyo_pdf()
    wk, revid = joyo_wiki()
    cur = {k: v for k, v in wk.items() if not v["deleted"]}
    diffs = []
    for k, v in cur.items():
        a = [tuple(x) for x in pdf.get(k, [])]
        b = [(re.sub("-", "", x), sp) for x, sp in v["readings"]]
        if a != b:
            diffs.append(k)
    extra = [k for k in pdf if k not in cur]
    rep["joyo_parse"] = {"pdf_kanji": len(pdf), "wiki_kanji": len(cur), "diffs": diffs, "pdf_only": extra,
                         "wiki_revid": revid, "fuhyo_pairs": len(joyo_fuhyo())}
    # --- kanji
    core = set(waller()[0])
    kd = kanjidic()
    official4 = [k for k, v in kd.items() if v["jlpt"] == "4"]
    listed = [e["k"] for e in c["kanji"]["list"]]
    rep["kanji_sets"] = {"old4": len(official4), "waller_n5": len(core), "waller_subset_of_old4": core <= set(official4),
                         "listed": len(listed), "missing_from_content": [k for k in official4 if k not in listed],
                         "not_in_old4": [k for k in listed if k not in official4], "duplicates": sorted({k for k in listed if listed.count(k) > 1})}
    n4 = set(waller_n4_kanji())
    extra = [k for k in official4 if k not in core]
    rep["kanji_sets"].update(waller_n4=len(n4), extra=len(extra), extra_in_waller_n4=sum(k in n4 for k in extra),
                             extra_not_in_waller_n4=[k for k in extra if k not in n4])
    anim = animcjk()
    for e in c["kanji"]["list"]:
        r = check_kanji(e, core, len(kanjivg_paths(e["k"])), anim)
        r["order"] = stroke_order_check(e["k"])
        if not r["order"]["ok"]:
            r["problems"].append("笔顺：KanjiVG 与 animCJK 不一致 " + json.dumps(r["order"], ensure_ascii=False))
        r["examples"] = [example_check(e["k"], x) for x in e.get("ex", [])]
        r["note"] = c["kanji"].get("notes", {}).get(e["k"])
        taught = []
        for x in r["examples"]:
            if x.get("reading") and not x["problems"]:
                key = (x["reading"]["r"], x["reading"]["kind"])
                if key not in taught:
                    taught.append(key)
        r["taught"] = [list(t) for t in taught]
        r["ok"] = not r["problems"] and any(not x["problems"] for x in r["examples"])
        rep["kanji"].append(r)
    rep["sources"] = {"kanjidic2": kanjidic_version(), "jawiki_revid": revid,
                      "jmdict_furigana": "2.3.1+2026-10-25", "waller": "tanos.co.uk (Wayback 2020-08)"}
    return rep


def summarize(rep):
    lines = []
    vb = rep["verbs"]
    nf = sum(len(v["forms"]) for v in vb)
    lines.append(f"verbs {sum(v['ok'] for v in vb)}/{len(vb)} ok; forms {sum(f['ok'] for v in vb for f in v['forms'].values())}/{nf}")
    for v in vb:
        if not v["ok"]:
            lines.append(f"  VERB {v['w']}: {v['problems']} " + "; ".join(f"{k}:{f['w']} {f['why']} [{f['parse']}]" for k, f in v["forms"].items() if not f["ok"]))
    ad = rep["adjectives"]
    na = sum(len(a["forms"]) for a in ad)
    lines.append(f"adjectives {sum(a['ok'] for a in ad)}/{len(ad)} ok; forms {sum(f['ok'] for a in ad for f in a['forms'].values())}/{na}")
    for a in ad:
        if not a["ok"]:
            lines.append(f"  ADJ {a['w']}: {a['problems']} " + "; ".join(f"{k}:{f['w']} {f['why']} [{f['parse']}]" for k, f in a["forms"].items() if not f["ok"]))
    for p in rep["phrases"]:
        if not p["ok"] or p["vocab"]:
            lines.append(f"  PHRASE {p['w']}: {p['problems']} {p['vocab']}")
    ss = rep["sentences"]
    lines.append(f"sentences {sum(s['ok'] for s in ss)}/{len(ss)} ok")
    for s in ss:
        if not s["ok"] or s["vocab"]:
            lines.append(f"  SENT {s['id']} {s['w']}: {s['problems']} vocab={s['vocab']} variants={s.get('variants_used')}")
    jp = rep["joyo_parse"]
    lines.append(f"joyo pdf {jp['pdf_kanji']} vs wiki {jp['wiki_kanji']}: diffs {jp['diffs']} pdf-only {jp['pdf_only']}; 付表 pairs {jp['fuhyo_pairs']}")
    lines.append(f"kanji sets {rep['kanji_sets']}")
    kk = rep["kanji"]
    lines.append(f"kanji {sum(k['ok'] for k in kk)}/{len(kk)} ok")
    for k in kk:
        exprob = [(x["w"], x["problems"]) for x in k["examples"] if x["problems"]]
        if k["problems"] or exprob:
            lines.append(f"  KANJI {k['k']}: {k['problems']} {exprob}")
        nn = [x["w"] for x in k["examples"] if not x.get("n5")]
        if nn:
            lines.append(f"  KANJI {k['k']} examples not on N5 list: {nn}")
        if k["flags"]:
            lines.append(f"  KANJI {k['k']} flags: {k['flags']}")
    return "\n".join(lines)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "fetch":
        fetch()
    elif cmd == "check":
        rep = check_all()
        os.makedirs(os.path.dirname(REPORT), exist_ok=True)
        json.dump(rep, open(REPORT, "w"), ensure_ascii=False, indent=1)
        print(summarize(rep))
