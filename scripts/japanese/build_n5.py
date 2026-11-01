"""Stage 1 (初级上, about JLPT N5) page data for build.py.

Everything here is read from reports/n5_checks.json (content checks, written by
`python n5data.py check`) and reports/verify.json (audio checks). Nothing that
failed a check reaches a page: a verb or adjective whose forms do not all parse
back is left out, a sentence whose reading does not match UniDic is left out, a
kanji reading that is not in both KANJIDIC2 and the 常用漢字表 is not listed, an
example word whose reading cannot be tied to an official reading is dropped.
"""
import json, os, re

import n5data
from items import slug, form_id

HERE = os.path.dirname(os.path.abspath(__file__))
REP = json.load(open(os.path.join(HERE, "reports", "n5_checks.json"), encoding="utf-8"))
C = n5data.content()

LESSONS = [
    ("n5/verbs", "动词：三类动词与基本活用"),
    ("n5/adjectives", "形容词：い形容词与な形容词"),
    ("n5/particles", "助词：N5 的 15 个核心助词"),
    ("n5/kanji", "常用汉字：N5 阶段的 103 个字"),
]

VERB_FORMS = n5data.VERB_FORMS
VERB_FORM_ZH = n5data.VERB_FORM_ZH
GROUP_ZH = {"godan": "五段动词（第Ⅰ类）", "ichidan": "一段动词（第Ⅱ类）", "irregular": "不规则动词（第Ⅲ类）"}
KIND_ZH = {"on": "音读", "kun": "训读"}


def verbs():
    return [v for v in REP["verbs"] if v["ok"]]


def adjectives(cls):
    return [a for a in REP["adjectives"] if a["ok"] and a["cls"] == cls]


def form_ids(entry):
    """{form: {w, r, id}} — the dictionary form uses the word id (accent shown)."""
    out = {}
    for k, f in entry["forms"].items():
        iid = slug(f["w"], f["r"]) if k == "dict" else form_id(f["w"], f["r"])
        out[k] = {"w": f["w"], "r": f["r"], "id": iid, "ambiguous": bool(f.get("ambiguous"))}
    return out


_S = {s["id"]: s for s in REP["sentences"]}


def sentence(sid):
    s = _S.get(sid)
    if not s or not s["ok"]:
        return None
    return {"id": "n5-" + sid, "w": s["w"], "zh": s["zh"], "display": s["display"], "wdisp": s["wdisp"], "src": sid}


def phrases():
    return [{"id": "n5p-" + slug(p["w"], p["r"])[2:], "w": p["w"], "r": p["r"], "zh": p["zh"]} for p in REP["phrases"] if p["ok"]]


# ----------------------------------------------------------------- kanji ---
def _disp_reading(o):
    """音读 in katakana, 训读 in hiragana with the okurigana after a dot
    (the convention of most kanji dictionaries: か.く = 書く)."""
    if o["kind"] == "on":
        return n5data.jaconv.hira2kata(o["r"])
    return o["stem"] + ("." + o["okuri"] if o["okuri"] else "")


def ruby(w, spec, target):
    """[(text, rt or None, is_target)] from a JmdictFurigana spec, so each
    reading sits over its own kanji (毎日 = 毎 まい + 日 にち)."""
    if not spec:
        return [(w, None, False)]
    segs = n5data.parse_furigana(w, spec)
    out, pos = [], 0
    for a, b, kn in segs:
        if a > pos:
            out.append((w[pos:a], None, False))
        out.append((w[a:b], kn, target in w[a:b]))
        pos = b
    if pos < len(w):
        out.append((w[pos:], None, False))
    return out


def kanji():
    groups = {g["id"]: {"id": g["id"], "title": g["title"], "items": []} for g in C["kanji"]["groups"]}
    for k in REP["kanji"]:
        if not k["ok"]:
            continue
        taught = {tuple(t) for t in k["taught"]}
        rd = []
        for o in k["readings"]:
            if not o["kanjidic"]:
                continue  # one source only: not listed (see verification page)
            rd.append({"t": _disp_reading(o), "kind": o["kind"], "now": (o["r"], o["kind"]) in taught,
                       "special": o["special"]})
        exs = []
        for x in k["examples"]:
            if x["problems"]:
                continue
            e = {"w": x["w"], "r": x["r"], "zh": x["zh"], "id": slug(x["w"], x["r"]), "ruby": ruby(x["w"], x.get("furigana"), k["k"])}
            if x.get("proper"):
                e["proper"] = x["proper"]
            if x.get("special"):
                e["special"] = x["special"]
            elif x.get("reading"):
                e["uses"] = x["reading"].get("full") or x["reading"]["as"]
                e["how"] = x["reading"]["how"]
                e["base"] = x["reading"]["r"] if x["reading"]["kind"] == "kun" else n5data.jaconv.hira2kata(x["reading"]["r"])
            exs.append(e)
        if not exs:
            continue
        simp = k["simp"]
        groups[k["g"]]["items"].append({
            "k": k["k"], "zh": k["zh"], "core": k["core"], "readings": rd, "examples": exs,
            "strokes": k["strokes"]["kanjivg"], "simp": simp["simp"] if simp["differs"] else None,
            "trad": simp["trad"] if simp["trad_differs"] else None, "note": k.get("note"),
        })
    return [g for g in groups.values() if g["items"]]


def kanji_strokes(strokes_of):
    out = {}
    for g in kanji():
        for it in g["items"]:
            out[it["k"]] = strokes_of(it["k"])
    return out


def kanji_dialog_data():
    out = {}
    for g in kanji():
        for it in g["items"]:
            out[it["k"]] = {"zh": it["zh"], "n": it["strokes"], "simp": it["simp"], "trad": it["trad"],
                            "on": [r["t"] for r in it["readings"] if r["kind"] == "on"],
                            "kun": [r["t"] for r in it["readings"] if r["kind"] == "kun"],
                            "now": [r["t"] for r in it["readings"] if r["now"]]}
    return out


# ------------------------------------------------------------- practice ---
ROMA = {}


def decks(manifest):
    """Extra FSRS decks for /japanese/practice/: N5 verbs, adjectives, kanji
    example words. Answers are checked in kana (the page converts romaji typed
    the IME way into kana first), so ji/zi, shi/si, n/nn all work."""
    out = []

    def item(w, r, iid, row):
        if not manifest.get(iid):
            return None
        return {"k": w, "rom": r, "kana": r, "ans": [r], "id": iid, "row": row}
    vs = [item(v["w"], v["r"], slug(v["w"], v["r"]), v["g"]) for v in verbs()]
    vs = [x for x in vs if x]
    if vs:
        out.append({"id": "n5-verbs", "name": "N5 动词", "desc": f"第 1 课，{len(vs)} 个（辞书形）", "items": vs})
    ad = [item(a["w"], a["r"], slug(a["w"], a["r"]), a["cls"]) for a in adjectives("i") + adjectives("na")]
    ad = [x for x in ad if x]
    if ad:
        out.append({"id": "n5-adj", "name": "N5 形容词", "desc": f"第 2 课，{len(ad)} 个", "items": ad})
    seen, kw = set(), []
    for g in kanji():
        for it in g["items"]:
            for e in it["examples"]:
                if e["w"] in seen:
                    continue
                x = item(e["w"], e["r"], e["id"], g["id"])
                if x:
                    seen.add(e["w"])
                    kw.append(x)
    if kw:
        out.append({"id": "n5-kanji", "name": "N5 汉字例词", "desc": f"第 4 课，{len(kw)} 个", "items": kw})
    return out


# --------------------------------------------------------- verification ---
def verification(report_clips, manifest):
    """Numbers and tables for the stage-1 section of /japanese/verification/."""
    from collections import Counter
    vb, ad = REP["verbs"], REP["adjectives"]
    out = {
        "verbs": len(vb), "verbs_ok": sum(v["ok"] for v in vb),
        "verb_forms": sum(len(v["forms"]) for v in vb), "verb_forms_ok": sum(f["ok"] for v in vb for f in v["forms"].values()),
        "adjs": len(ad), "adjs_ok": sum(a["ok"] for a in ad),
        "adj_forms": sum(len(a["forms"]) for a in ad), "adj_forms_ok": sum(f["ok"] for a in ad for f in a["forms"].values()),
        "ambiguous": [(v["w"], f["w"], f["r"], f["rank"]) for v in vb + ad for f in v["forms"].values() if f.get("ambiguous")],
        "sentences": len(REP["sentences"]), "sentences_ok": sum(s["ok"] for s in REP["sentences"]),
        "variants": sorted({x for s in REP["sentences"] for x in s.get("variants_used", [])}),
        "vocab_exceptions": [(s["w"], s["vocab"]) for s in REP["sentences"] if s["vocab"]],
        "joyo": REP["joyo_parse"], "kanji_sets": REP["kanji_sets"], "sources": REP["sources"],
        "kanji": len(REP["kanji"]), "kanji_ok": sum(k["ok"] for k in REP["kanji"]),
        "kanji_flags": [(k["k"], f) for k in REP["kanji"] for f in k["flags"]],
        "kanji_problems": [(k["k"], p) for k in REP["kanji"] for p in k["problems"]],
        "strokes_agree": sum(1 for k in REP["kanji"] if len(set(k["strokes"].values())) == 1),
        "order_agree": sum(1 for k in REP["kanji"] if k["order"]["ok"]),
        "simp_differs": sum(1 for k in REP["kanji"] if k["simp"]["differs"]),
        "simp_via": [(k["k"], k["simp"]["unihan"]) for k in REP["kanji"] if k["simp"].get("via")],
        "examples": sum(len(k["examples"]) for k in REP["kanji"]),
        "examples_ok": sum(1 for k in REP["kanji"] for x in k["examples"] if not x["problems"]),
        "example_rank": [(x["w"], x["r"], x["unidic_rank"]) for k in REP["kanji"] for x in k["examples"]
                         if (x.get("unidic_rank") or 1) > 1],
        "example_special": sorted({(x["w"], x["r"], x["special"]["fuhyo"]) for k in REP["kanji"] for x in k["examples"]
                                   if x.get("special") and x["special"].get("fuhyo")}),
        "example_off_list": sorted({x["w"] for k in REP["kanji"] for x in k["examples"] if not x.get("n5")}),
        "rejected": [],
    }
    for v in vb + ad:
        if not v["ok"]:
            out["rejected"].append((v["w"], "；".join(v["problems"] + [f"{f['w']}：{f['why']}" for f in v["forms"].values() if not f["ok"]])))
    for s in REP["sentences"]:
        if not s["ok"]:
            out["rejected"].append((s["w"], "；".join(s["problems"])))
    for k in REP["kanji"]:
        for x in k["examples"]:
            if x["problems"]:
                out["rejected"].append((f"{k['k']}：{x['w']}", "；".join(x["problems"])))
        if not k["ok"]:
            out["rejected"].append((k["k"], "；".join(k["problems"])))
    n5 = [c for c in report_clips.values() if c["kind"] in ("n5word", "n5form", "n5sent", "n5phrase", "n5wordvar", "n5formvar")]
    out["clips"] = len(n5)
    out["clips_ok"] = sum(bool(c["ok"]) for c in n5)
    out["clips_by_kind"] = Counter(c["kind"] for c in n5)
    out["clips_ok_by_kind"] = Counter(c["kind"] for c in n5 if c["ok"])
    pp = [c["checks"]["particle"] for c in n5 if c["checks"].get("particle")]
    out["particle_checks"] = Counter(p.get("verdict", "—") for p in pp)
    out["particle_min"] = min((p["margin"] for p in pp), default=None)
    fc = [c for c in n5 if c["checks"].get("reading", {}).get("model") == "n-best + ctc"]
    out["forced_choice"] = len(fc)
    out["forced_choice_ok"] = sum(1 for c in fc if c["checks"]["reading"].get("ok"))
    out["forced_choice_min_ok"] = min((c["checks"]["reading"]["margin"] for c in fc if c["checks"]["reading"].get("ok")), default=None)
    ec = [c for c in n5 if c["checks"].get("reading", {}).get("model") == "echo + phones"]
    out["echo"], out["echo_ok"] = len(ec), sum(1 for c in ec if c["checks"]["reading"].get("ok"))
    out["fails_n5"] = sorted(((c.get("text") or ""), {"n": "女声", "k": "男声"}[c["voice"]], c["kind"]) for c in n5 if not c["ok"])
    cj = os.path.join(HERE, "reports", "codex_n5.json")
    out["codex"] = json.load(open(cj, encoding="utf-8")) if os.path.exists(cj) else None
    return out
