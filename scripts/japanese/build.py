"""Render /japanese/ from verified data.

    JA_RAW=… python build.py            # after gen_audio.py + verify.py

Only what verify.py passed reaches a page: a clip that failed in one voice is
published in the other voice only; a word that failed in both is replaced by the
next candidate from content.yaml, or dropped. The selection is written to
reports/selection.json so the verification page can show what was rejected.
"""
import hashlib, html, json, os, re, shutil, sys

import jinja2

import dictcheck
import kana as KM
import voicevox as VV
from items import all_items, load_content, slug, kana_id
import build_n5 as B5

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(SITE, "japanese")
CACHE = os.environ.get("JA_CACHE", os.path.expanduser("~/.agents/workspace/japanese/audio-cache"))
RAW = os.environ.get("JA_RAW", os.path.expanduser("~/.agents/workspace/japanese/raw"))
_REP = json.load(open(os.path.join(HERE, "reports", "verify.json")))
REPORT = _REP["clips"]
REPORT_TIME = _REP.get("generated", "")

CIRCLED = "⓪①②③④⑤⑥⑦⑧⑨"

# ------------------------------------------------------------ verification ---
def clip_ok(v, iid):
    r = REPORT.get(f"{v}/{iid}")
    return bool(r and r.get("ok"))


ITEMS = {i["id"]: i for i in all_items()}
C = load_content()
MANUAL = json.load(open(os.path.join(HERE, "reports", "manual_pitch.json")))
HUMAN_DIR = os.environ.get("HUMAN_DIR", os.path.expanduser("~/.agents/workspace/japanese/human"))
_HJ = os.path.join(HERE, "reports", "human.json")
HUMAN_ALL = json.load(open(_HJ))["clips"] if os.path.exists(_HJ) else []
HUMAN = {c["id"]: c for c in HUMAN_ALL if c.get("ok")}
# VOICEVOX ("v" female, "w" male): verified clips for kana no other voice could
# say (voicevox.py → reports/voicevox.json). They fill gaps, never replace.
_VJ = os.path.join(HERE, "reports", "voicevox.json")
VV_REP = json.load(open(_VJ)) if os.path.exists(_VJ) else {"voices": {}, "clips": {}}
VV_PUB = VV.published()
VOICE_ORDER = "hnk" + "".join(VV.VOICES)

# Words of the homophone sets in lesson 7: a kana-typed fallback would lose the
# very distinction the set is about, so these never use the "-kv" variant.
HOMOPHONE_IDS = {slug(x["w"], x["r"]) for p in C["pairs"]["accent"] for x in p["items"]}
SET_OF = {slug(x["w"], x["r"]): p["id"] for p in C["pairs"]["accent"] for x in p["items"]}


def _md5(path):
    return hashlib.md5(open(path, "rb").read()).hexdigest() if os.path.exists(path) else None


def _duplicates():
    """(voice, id) pairs whose audio is byte-identical to a *different* word's.
    Measured case: the female voice rendered 雨 (①) and 飴 (⓪) as the same file,
    so at least one of them carries the wrong accent — neither is published."""
    seen, bad = {}, set()
    for iid, it in ITEMS.items():
        if it["kind"] not in ("word", "n5word"):
            continue
        for v in "nk":
            h = _md5(os.path.join(CACHE, v, iid + ".mp3"))
            if not h:
                continue
            key = (v, h)
            if key in seen and ITEMS[seen[key]]["w"] != it["w"]:
                other = ITEMS[seen[key]]
                if "n5word" in (it["kind"], other["kind"]):
                    # stage 1: two different words may legitimately sound the same
                    # (居る/要る both いる⓪); only a pair whose dictionary accents
                    # differ or are unknown cannot share one recording
                    a1 = dictcheck.lookup(it["w"], it["r"]).get("accent")
                    a2 = dictcheck.lookup(other["w"], other["r"]).get("accent")
                    if a1 is not None and a1 == a2 and it["r"] == other["r"]:
                        seen.setdefault(key, iid)
                        continue
                bad.add((v, iid)); bad.add((v, seen[key]))
            seen.setdefault(key, iid)
    return bad


DUPES = _duplicates()


def source(iid, v):
    """The cache file to publish for (iid, voice), or None if nothing passed."""
    if v == "h":
        c = HUMAN.get(iid)
        return os.path.join(HUMAN_DIR, "mp3", c["mp3"]) if c else None
    if v in VV.VOICES:
        return VV_PUB.get((v, iid))
    it = ITEMS.get(iid)
    if not it or (v, iid) in DUPES:
        return None
    if it["kind"] in ("n5word", "n5form", "n5sent", "n5phrase"):
        if clip_ok(v, iid):
            return os.path.join(CACHE, v, iid + ".mp3")
        var = iid + "-kv"
        if var in ITEMS and clip_ok(v, var):
            return os.path.join(CACHE, v, var + ".mp3")
        return None
    if it["kind"] == "carrier":
        base = it["base"]
        sid = SET_OF.get(base)
        if not sid or MANUAL["sets"].get(sid, {}).get("carrier", {}).get(v) != "approve":
            return None  # framed clips ship only where the manual review approved them
        return os.path.join(CACHE, v, iid + ".mp3") if clip_ok(v, iid) else None
    t = MANUAL["types"].get(it.get("w"))
    if it["kind"] == "word" and t and t.get(v) != "approve":
        return None
    if clip_ok(v, iid):
        return os.path.join(CACHE, v, iid + ".mp3")
    var = iid + "-kv"
    if var in ITEMS and iid not in HOMOPHONE_IDS and clip_ok(v, var):
        return os.path.join(CACHE, v, var + ".mp3")
    return None


def voices_ok(iid):
    # "h" first: a verified human recording is played before the synthetic voices.
    # VOICEVOX only where neither a human recording nor a Microsoft voice passed.
    vs = "".join(v for v in "hnk" if source(iid, v))
    return vs or "".join(v for v in VV.VOICES if source(iid, v))


def vv_only(iid, manifest=None):
    """True if every published clip of iid is a VOICEVOX clip."""
    vs = (manifest or {}).get(iid) if manifest is not None else voices_ok(iid)
    return bool(vs) and all(v in VV.VOICES for v in vs)
_acc = {}


def accent(w, r):
    if (w, r) not in _acc:
        _acc[(w, r)] = dictcheck.lookup(w, r)
    return _acc[(w, r)]


def dict_acc(w, r):
    """Accent shown on the page: two dictionaries agree (or a 2-of-3 majority)."""
    a = accent(w, r)
    if a.get("status") in ("agree", "majority") and a.get("accent") is not None:
        return a["accent"]
    return None


def accepted_accents(w, r):
    a = accent(w, r)
    if a.get("accent") is None:
        return []
    if not a.get("multi"):
        return [a["accent"]]
    vals = []
    for src in ("unidic", "kanjium", "wiktionary"):
        for x in a.get(src) or []:
            if x not in vals:
                vals.append(x)
    vals.sort(key=lambda x: (x != a["accent"], x))
    return vals


def heard_accent(iid):
    """Kept for templates written against the earlier design: now the dictionary
    accent as a one-element set (audio pitch no longer decides anything here)."""
    it = ITEMS.get(iid, {})
    a = dict_acc(it.get("w", ""), it.get("r", ""))
    return {a} if a is not None else set()


def word_quality(w, r, need_accent=True):
    """(score, voices) — higher is better; 0 = unusable."""
    iid = slug(w, r)
    vs = voices_ok(iid)
    if not vs:
        return 0, ""
    a = accent(w, r)
    if need_accent and a.get("accent") is None:
        return 0, ""
    s = len(vs) * 2 + (0 if a.get("multi") else 1)
    return s, vs


SELECTION = {"kana_examples": {}, "dakuon_examples": {}, "rejected": []}


def pick(cands, need_accent=True):
    best, best_s = None, 0
    for x in cands:
        s, vs = word_quality(x["w"], x["r"], need_accent)
        if s == 0:
            SELECTION["rejected"].append({"w": x["w"], "r": x["r"], "why": reject_reason(x["w"], x["r"])})
        if s > best_s:
            best, best_s = x, s
        if s >= 5:  # both voices, single accepted accent: as good as it gets
            break
    return best


def reject_reason(w, r):
    iid = slug(w, r)
    out = []
    for v in "nk":
        rep = REPORT.get(f"{v}/{iid}")
        if not rep:
            out.append(f"{v}: 未校验")
            continue
        if rep.get("ok"):
            continue
        ch = rep["checks"]
        if not ch.get("signal", {}).get("ok", True):
            out.append(f"{'女声' if v == 'n' else '男声'}：无声")
        elif not ch.get("reading", {}).get("ok", True):
            out.append(f"{'女声' if v == 'n' else '男声'}：读音不符（识别为「{ch['reading'].get('asr2') or ch['reading'].get('asr')}」）")
        elif not ch.get("pitch", {}).get("ok", True):
            d = ch["pitch"]["detail"]
            out.append(f"{'女声' if v == 'n' else '男声'}：声调不符（词典 {ch['pitch']['expected']} 型，实测下降位置 {d.get('carrier', {}).get('nucleus')}）")
    a = accent(w, r)
    if a.get("accent") is None:
        out.append("两部词典声调不一致")
    return "；".join(out) or "—"


# --------------------------------------------------------------- pitch svg ---
def pitch_svg(r, acc, label=True):
    ms = KM.morae(r)
    n = len(ms)
    word, part = KM.hl_pattern(n, acc)
    step, H, L = 18, 6, 18
    pts = [(9 + i * step, H if lv == "H" else L) for i, lv in enumerate(word)]
    pp = (9 + n * step, H if part == "H" else L)
    w = 9 + n * step + 10
    out = [f'<svg class="pp" width="{w}" height="{40 if label else 24}" viewBox="0 0 {w} {40 if label else 24}" aria-hidden="true">']
    path = " ".join(f"{x},{y}" for x, y in pts + [pp])
    out.append(f'<polyline class="ln" points="{path}"/>')
    for x, y in pts:
        out.append(f'<circle class="dt" cx="{x}" cy="{y}" r="3"/>')
    out.append(f'<circle class="dt pt" cx="{pp[0]}" cy="{pp[1]}" r="3"/>')
    if label:
        for (x, _), m in zip(pts, ms):
            out.append(f'<text class="mk" x="{x}" y="36" text-anchor="middle">{html.escape(m)}</text>')
        out.append(f'<text class="mk pt" x="{pp[0]}" y="36" text-anchor="middle">が</text>')
    out.append("</svg>")
    return "".join(out)


# ------------------------------------------------------------- f0 contour ---
def f0_svg(w, r, voice):
    import pitch
    iid = slug(w, r)
    path = source(iid + "-ga", voice)
    if not path:
        return None
    n = len(KM.morae(r))
    spans = pitch.mora_spans(path, r + "があります")[: n + 1]
    pts = pitch.contour(path, voice, spans, points=80)
    vals = [p[1] for p in pts if p[1] is not None]
    if len(vals) < 5:
        return None
    lo, hi = min(vals) - 1, max(vals) + 1
    W_, H_ = 320, 90
    t1 = pts[-1][0] or 1

    def X(t): return 8 + (W_ - 16) * t / t1
    def Y(v): return 8 + (H_ - 30) * (1 - (v - lo) / (hi - lo))
    segs, cur = [], []
    for t, v in pts:
        if v is None:
            if len(cur) > 1: segs.append(cur)
            cur = []
        else:
            cur.append(f"{X(t):.1f},{Y(v):.1f}")
    if len(cur) > 1: segs.append(cur)
    t0 = spans[0][1]
    out = [f'<svg viewBox="0 0 {W_} {H_}" role="img" aria-label="「{html.escape(w)}があります」前 {n + 1} 拍的实测音高曲线">']
    for m, s, e in spans:
        x = X(s - t0)
        out.append(f'<line class="bd" x1="{x:.1f}" y1="6" x2="{x:.1f}" y2="{H_ - 20}"/>')
        out.append(f'<text class="lab" x="{X((s + e) / 2 - t0):.1f}" y="{H_ - 6}" text-anchor="middle">{html.escape(m)}</text>')
    for sg in segs:
        out.append(f'<polyline class="cv" points="{" ".join(sg)}"/>')
    out.append("</svg>")
    return {"svg": "".join(out), "text": w + "が…"}


# ------------------------------------------------------------- kana data ---
def strokes_of(ch):
    fn = os.path.join(RAW, "kanjivg", "kanji", f"{ord(ch):05x}.svg")
    t = open(fn, encoding="utf-8").read()
    paths = []
    for m in re.finditer(r'<path[^>]*id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"', t):
        paths.append((int(m.group(1)), m.group(2)))
    paths.sort()
    nums = [[float(a), float(b)] for a, b in re.findall(r'<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">\d+</text>', t)]
    return {"paths": [d for _, d in paths], "nums": nums}


def build_kana():
    seion, dakuon, youon = KM.all_basic_kana()
    K = {}
    ex_slots = {}
    for k, cands in C["kana_examples"].items():
        x = pick(cands)
        if x:
            ex_slots[k] = x
            SELECTION["kana_examples"][k] = x["w"]
    for k, cands in C["dakuon_examples"].items():
        x = pick(cands)
        if x:
            ex_slots[k] = x
            SELECTION["dakuon_examples"][k] = x["w"]
    for h in seion + dakuon + youon:
        rom, typ, ipa = KM.SOUNDS[h]
        kk = KM.to_katakana(h)
        iid = kana_id(h)
        for ch, is_k in ((h, False), (kk, True)):
            org = KM.ORIGINS.get(ch) if len(ch) == 1 else None
            disp = KM.ORIGIN_DISPUTES.get(ch)
            e = {"rom": rom, "typ": typ, "ipa": ipa, "id": iid, "isKata": is_k,
                 "pair": kk if not is_k else h}
            if len(ch) == 1:
                e["n"] = len(strokes_of(ch)["paths"])
            if org or disp:
                how = KM.ORIGIN_HOW["k" if is_k else "h"]
                e["org"] = (disp[0] if disp else org) + ("（" + how + "）" if org else "")
                if disp:
                    e["orgNote"] = disp[1]
            elif len(ch) == 1:
                # 浊音・半浊音: the source is the plain kana plus the mark
                hch = KM.to_hiragana(ch)
                for mark, pairs in (("浊点「゛」", "がかぎきぐくげけごこざさじしずすぜせぞそだたぢちづつでてどとばはびひぶふべへぼほ"),
                                    ("半浊点「゜」", "ぱはぴひぷふぺへぽほ")):
                    i = pairs.find(hch)
                    if i >= 0 and i % 2 == 0:
                        b = pairs[i + 1] if not is_k else KM.to_katakana(pairs[i + 1])
                        e["org"] = f"「{b}」加{mark}"
                        break
            else:
                e["org"] = f"「{ch[0]}」加小写的「{ch[1]}」，合成一拍"
            if not is_k and h in ex_slots:
                x = ex_slots[h]
                a = dict_acc(x["w"], x["r"])
                e["ex"] = {"w": x["w"], "r": x["r"], "zh": x["zh"], "id": slug(x["w"], x["r"]),
                           "acc": CIRCLED[a] if a is not None else None}
            K[ch] = e
    for kk, rom, typ, ipa, tbl, ex, exzh in KM.EXTENDED:
        K[kk] = {"rom": rom, "typ": typ, "ipa": ipa, "id": "kana-x-" + rom, "isKata": True,
                 "tbl": tbl, "ex": {"w": ex, "r": KM.to_hiragana(ex), "zh": exzh, "id": slug(ex, KM.to_hiragana(ex)), "acc": None}}
    strokes = {}
    for ch in set(c for k in K for c in k):
        try:
            strokes[ch] = strokes_of(ch)
        except FileNotFoundError:
            pass
    return K, ex_slots, strokes


# --------------------------------------------------------------- render ---
LESSONS = [
    ("intro", "日语全景：开始之前要知道的事"),
    ("hiragana", "平假名·清音"),
    ("dakuon", "浊音·半浊音"),
    ("youon", "拗音"),
    ("special-morae", "促音·拨音·长音"),
    ("katakana", "片假名与外来语"),
    ("pronunciation", "中文母语者发音要点"),
    ("accent", "声调（アクセント）入门"),
    ("greetings", "寒暄语与课堂用语"),
    ("numbers", "数字"),
    ("first-sentences", "第一句日语：自我介绍"),
]


def main():
    K, ex_slots, strokes = build_kana()
    used_audio = {}
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.join(HERE, "templates")),
                             autoescape=jinja2.select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)

    def file_hash(p):
        return hashlib.sha1(open(p, "rb").read()).hexdigest()[:8]

    css_v = file_hash(os.path.join(OUT, "assets", "japanese.css"))
    js_v = file_hash(os.path.join(OUT, "assets", "japanese.js"))
    pr_v = file_hash(os.path.join(OUT, "assets", "practice.js"))
    manifest = {}
    for iid, it in ITEMS.items():
        if it["kind"] in ("wordvar", "kanavar", "n5wordvar", "n5formvar"):
            continue
        vs = voices_ok(iid)
        if vs:
            manifest[iid] = vs
    for iid in HUMAN:  # recordings of words that only the accent lesson's 真人示范 uses
        if iid not in manifest:
            manifest[iid] = voices_ok(iid)
    audio_version = hashlib.sha1(json.dumps(manifest, sort_keys=True).encode()).hexdigest()[:8]

    pages = [dict(slug="index", url="/japanese/", tpl="index.html", title="日语", lesson=None, stage=None)]
    for i, (s, t) in enumerate(LESSONS):
        pages.append(dict(slug=s, url=f"/japanese/{s}/", tpl=f"{s}.html", title=t, lesson=i, stage=0))
    n5_home = dict(slug="n5", url="/japanese/n5/", tpl="n5.html", title="初级上（约 JLPT N5）", lesson=None, stage=1)
    pages.append(n5_home)
    for i, (s, t) in enumerate(B5.LESSONS):
        pages.append(dict(slug=s, url=f"/japanese/{s}/", tpl=f"{s}.html", title=t, lesson=i + 1, stage=1))
    for s, t in [("method", "学习方法"), ("practice", "练习"), ("verification", "校验报告"), ("sources", "参考资料与版权")]:
        pages.append(dict(slug=s, url=f"/japanese/{s}/", tpl=f"{s}.html", title=t, lesson=None, stage=None))
    lesson_pages = [p for p in pages if p["lesson"] is not None and p["stage"] == 0]
    for i, p in enumerate(lesson_pages):
        p["prev"] = lesson_pages[i - 1] if i > 0 else None
        p["next"] = lesson_pages[i + 1] if i + 1 < len(lesson_pages) else n5_home
    n5_pages = [p for p in pages if p["lesson"] is not None and p["stage"] == 1]
    for i, p in enumerate(n5_pages):
        p["prev"] = n5_pages[i - 1] if i > 0 else n5_home
        p["next"] = n5_pages[i + 1] if i + 1 < len(n5_pages) else None

    stats = verification_stats(manifest)
    VT = verification_tables(manifest)
    VV_ROWS = voicevox_rows()
    # VOICEVOX voices that actually reach a page (footer credit, labels)
    vv_published = {v: VV_REP["voices"][v] for v in VV.VOICES
                    if v in VV_REP.get("voices", {}) and any(v in vs for vs in manifest.values())}
    # kana that reach a page in a VOICEVOX voice, and kana VOICEVOX was tried for
    # without any clip passing (the detail dialog says so)
    vv_kana = sorted({c["kana"] for c in VV_REP.get("clips", {}).values() if vv_only(c["id"], manifest)},
                     key=lambda k: [c["kana"] for c in VV_REP["clips"].values()].index(k))
    vv_failed = sorted({c["id"] for c in VV_REP.get("clips", {}).values() if not manifest.get(c["id"])})
    vv_data = {"voices": {v: {"credit": x["credit"], "gender": x["gender"]} for v, x in vv_published.items()},
               "failed": vv_failed}
    # screening phrase every candidate "failed": which transcripts were textually right
    vv_scr_note = {}
    scr = VV_REP.get("screening") or {}
    if scr:
        def _n(x):
            return re.sub(r"[\s。、，,．.！!？?]", "", x or "")
        for i, ph in enumerate(scr["phrases"]):
            rows = [(r["character"], r["phrases"][i]) for r in scr["results"]]
            if rows and not any(x["ok"] for _, x in rows):
                vv_scr_note[ph] = {"right": [c for c, x in rows if _n(x["asr"]) == _n(ph)],
                                   "wrong": [(c, x["asr"]) for c, x in rows if _n(x["asr"]) != _n(ph)]}
    # what the recognizers heard, per kana (for the verification page's summary)
    vv_heard = {}
    for c in VV_REP.get("clips", {}).values():
        h = vv_heard.setdefault(c["kana"], {"n": 0, "asr": [], "phones": []})
        for x in c["variants"]:
            h["n"] += 1
            for t in (x["checks"]["reading"]["asr"], x["checks"]["reading_prompted"]["asr"]):
                if t.strip() and t.strip() not in h["asr"]:
                    h["asr"].append(t.strip())
            if x["checks"]["phones"]["phones"] not in h["phones"]:
                h["phones"].append(x["checks"]["phones"]["phones"] or "（无）")
    N5_DECKS = B5.decks(manifest)
    V5 = B5.verification(REPORT, manifest)
    for p in pages:
        page_audio, page_kana, page_drills = {}, {}, {}

        def has_audio(iid):
            if iid in manifest:
                page_audio[iid] = manifest[iid]
                return True
            return False

        def kconv(k, script):
            kk = KM.to_katakana(k) if script == "k" else k
            if kk in K:
                page_kana[kk] = K[kk]
                if K[kk].get("ex"):
                    has_audio(K[kk]["ex"]["id"])
                has_audio(K[kk]["id"])
            return kk

        def W(w, r):
            iid = slug(w, r)
            has_audio(iid)
            it = ITEMS.get(iid) or {"zh": (HUMAN.get(iid) or {}).get("zh")}
            acc = dict_acc(w, r)
            alts = [x for x in accepted_accents(w, r) if x != acc]
            n = len(KM.morae(r))
            return {"id": iid, "w": w, "r": r, "zh": it.get("zh") or "", "acc": acc,
                    "acc_label": (CIRCLED[acc] + ("／" + "／".join(CIRCLED[x] for x in alts) if alts else "")) if acc is not None else "",
                    "acc_name": KM.accent_type_name(n, acc) + ("（也读" + "、".join(KM.accent_type_name(n, x) for x in alts) + "）" if alts else "") if acc is not None else "",
                    "pp": pitch_svg(r, acc) if acc is not None else "", "voices": manifest.get(iid, "")}

        def ok_word(w, r):
            return bool(manifest.get(slug(w, r)))

        def drill_sets(name, sets):
            """sets: list of option lists [{w, r, label?, sub?}]; keeps only fully
            published options; drops a set that loses a member. Also drops a set
            with a VOICEVOX-only option next to options in other voices: the
            learner could answer by timbre instead of by sound (ぴょ exists only
            as VOICEVOX, びょ only in the Microsoft voices)."""
            out = []
            for s in sets:
                opts = []
                for o in s:
                    iid = o.get("id") or slug(o["w"], o["r"])
                    if not has_audio(iid):
                        break
                    opts.append({"id": iid, "w": o["w"], "label": o.get("label"), "sub": o.get("sub")})
                else:
                    mixed = len({vv_only(o["id"], manifest) for o in opts}) > 1
                    if len(opts) >= 2 and not mixed:
                        out.append(opts)
            if out:
                page_drills[name] = out
            return bool(out)

        def WL(lst, need_accent=False):
            """(w, r) pairs from a content list, keeping only published words."""
            return [(x["w"], x["r"]) for x in lst if ok_word(x["w"], x["r"])]

        def F0(w, r, voice="n"):
            return f0_svg(w, r, voice)

        def say_id(iid):
            return has_audio(iid)

        def n5_say(iid):
            return has_audio(iid)

        ctx = dict(page=p, K=K, C=C, KM=KM, W=W, WL=WL, VT=VT, B5=B5, C5=B5.C, n5_lessons=n5_pages, n5_home=n5_home,
                   N5_DECKS=N5_DECKS, V5=V5, n5_say=n5_say, REPORT_TIME=REPORT_TIME, dict_acc=dict_acc, MANUAL=MANUAL, DUPES=DUPES, HUMAN=HUMAN, HUMAN_ALL=HUMAN_ALL, kconv=kconv, has_audio=has_audio, ok_word=ok_word,
                   drill_sets=drill_sets, F0=F0, say_id=say_id, slug=slug, kana_id=kana_id,
                   ex_slots=ex_slots, lessons=lesson_pages, stats=stats, manifest=manifest,
                   REPORT=REPORT, SELECTION=SELECTION, accent=accent, heard_accent=heard_accent,
                   CIRCLED=CIRCLED, css_version=css_v, js_version=js_v, practice_version=pr_v,
                   audio_version=audio_version, page_audio=page_audio, page_kana=page_kana,
                   page_drills=page_drills, voices_ok=voices_ok, ITEMS=ITEMS,
                   VV_REP=VV_REP, VV_VOICES="".join(VV.VOICES), VV_ROWS=VV_ROWS, VV_PUBLISHED=vv_published,
                   VV_DATA=vv_data, VV_KANA=vv_kana, VV_HEARD=vv_heard, VV_SCR_NOTE=vv_scr_note,
                   vv_only=lambda iid: vv_only(iid, manifest))
        tpl = env.get_template("pages/" + p["tpl"])
        html_out = tpl.render(**ctx)
        dest = os.path.join(OUT, "index.html") if p["slug"] == "index" else os.path.join(OUT, p["slug"], "index.html")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8").write(html_out)
        used_audio.update(page_audio)
        print("wrote", dest.replace(SITE, ""), len(page_audio), "clips")

    # audio: copy exactly the clips some page uses, drop stale ones
    for v in VOICE_ORDER:
        d = os.path.join(OUT, "audio", v)
        want = {iid for iid, vs in used_audio.items() if v in vs}
        if not want and not os.path.isdir(d):
            continue  # a voice no page uses (e.g. a VOICEVOX voice with no passing clip)
        os.makedirs(d, exist_ok=True)
        for f in os.listdir(d):
            if f.endswith(".mp3") and f[:-4] not in want:
                os.remove(os.path.join(d, f))
        for iid in want:
            src = source(iid, v)
            dst = os.path.join(d, iid + ".mp3")
            if not os.path.exists(dst) or open(src, "rb").read() != open(dst, "rb").read():
                shutil.copyfile(src, dst)
    json.dump(dict(sorted(strokes.items())), open(os.path.join(OUT, "assets", "strokes.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    json.dump(dict(sorted(B5.kanji_strokes(strokes_of).items())), open(os.path.join(OUT, "assets", "kanji-strokes.json"), "w"),
              ensure_ascii=False, separators=(",", ":"))
    json.dump(SELECTION, open(os.path.join(HERE, "reports", "selection.json"), "w"), ensure_ascii=False, indent=1)
    print("audio clips published:", sum(len(v) for v in used_audio.values()))


def verification_stats(manifest):
    from collections import Counter
    clips = list(REPORT.values())
    by_kind = Counter()
    ok_kind = Counter()
    for c in clips:
        by_kind[c["kind"]] += 1
        ok_kind[c["kind"]] += bool(c["ok"])
    fails = Counter()
    for c in clips:
        if c["ok"]:
            continue
        ch = c["checks"]
        if not ch.get("signal", {}).get("ok", True):
            fails["signal"] += 1
        elif not ch.get("reading", {}).get("ok", True):
            fails["reading"] += 1
        elif not ch.get("pitch", {}).get("ok", True):
            fails["pitch"] += 1
        elif not ch.get("phones", {}).get("ok", True):
            fails["phones"] += 1
    vv = [x for c in VV_REP.get("clips", {}).values() for x in c["variants"]]
    vv_ok = sum(bool(x["ok"]) for x in vv)
    return {"total": len(clips) + len(vv), "ok": sum(bool(c["ok"]) for c in clips) + vv_ok, "by_kind": dict(by_kind),
            "ok_kind": dict(ok_kind), "fails": dict(fails), "published_items": len(manifest),
            "ms_total": len(clips), "vv_total": len(vv), "vv_ok": vv_ok}


def verification_tables(manifest):
    """Rows for /japanese/verification/: every failed clip with its reason, and
    the accent cross-check for every word that shows an accent."""
    VN = {"n": "女声", "k": "男声"}
    fails = []
    for cid, c in sorted(REPORT.items(), key=lambda kv: (kv[1]["kind"], kv[0])):
        if c["ok"]:
            continue
        ch = c["checks"]
        if not ch.get("signal", {}).get("ok", True):
            why = "无声（合成结果为静音）"
        elif not ch.get("reading", {}).get("ok", True):
            rd = ch["reading"]
            heard = rd.get("asr2") or rd.get("asr") or ""
            why = f"自动转写为「{heard.strip()}」，与预期读音不一致" + (f"（音素：{rd['phones']}）" if rd.get("phones") else "")
        elif not ch.get("pitch", {}).get("ok", True):
            pc = ch["pitch"]
            d = pc["detail"]
            nuc = d.get("carrier", {}).get("nucleus", d.get("word", {}).get("nucleus"))
            why = f"声调不符：词典 {pc['expected']} 型，音频实测下降位置 {nuc if nuc is not None else '—'}"
        elif not ch.get("phones", {}).get("ok", True):
            why = f"音素识别结果不符：{ch['phones'].get('phones')}（{ch['phones'].get('why')}）"
        else:
            why = "—"
        # a katakana-/kana-input variant stands for its base item
        it = ITEMS.get(c["id"], {})
        pub = manifest.get(it["base"] if it.get("kind") in ("kanavar", "wordvar") else c["id"], "")
        if not pub:
            fb = "两种声音都未通过：不上线"
        elif all(v in VV.VOICES for v in pub):
            fb = "改用 VOICEVOX 合成并通过更严的校验（见下文）"
        elif c["voice"] in pub:
            fb = "同一声音换一种输入写法后通过，页面用那一条"
        elif pub == "h":
            fb = "已有通过的真人录音，页面用它"
        else:
            fb = "另一声音已通过，页面只用它"
        fails.append({"kind": c["kind"], "text": c.get("text") or "", "voice": VN[c["voice"]], "why": why,
                      "fallback": fb})
    acc = []
    seen = set()
    for iid, it in ITEMS.items():
        if it["kind"] != "word" or iid not in manifest:
            continue
        a = accent(it["w"], it["r"])
        if a.get("accent") is None or (it["w"], it["r"]) in seen:
            continue
        seen.add((it["w"], it["r"]))
        sid = SET_OF.get(iid)
        if sid:
            rev = "同音词组：" + "／".join(VN[v] + ("通过" if MANUAL["sets"][sid]["carrier"].get(v) == "approve" else "未通过") for v in "nk")
        elif it["w"] in MANUAL["types"]:
            t = MANUAL["types"][it["w"]]
            rev = "类型例词：" + "／".join(VN[v] + ("通过" if t.get(v) == "approve" else "未通过") for v in "nk")
        else:
            rev = ""
        acc.append({"w": it["w"], "r": it["r"], "unidic": a.get("unidic"), "kanjium": a.get("kanjium"),
                    "wikt": a.get("wiktionary"), "status": a["status"], "multi": a.get("multi"),
                    "review": rev})
    acc.sort(key=lambda x: x["r"])
    return {"fails": fails, "accent": acc}


def voicevox_rows():
    """Every VOICEVOX clip that was synthesized for the verification page — the
    published ones and the rejected ones, with each measurement."""
    rows = []
    for cid, c in VV_REP.get("clips", {}).items():
        v = VV_REP["voices"].get(c["voice"], {})
        for x in c["variants"]:
            ch = x["checks"]
            m = ch["engine"]["moras"]
            rows.append({
                "kana": c["kana"], "voice": f"{v.get('gender', '')}（{v.get('credit', c['voice'])}）",
                "input": x["input"],
                "variant": "、".join({"kana": "假名记法（指定音拍）", "kata": "片假名文本", "hira": "平假名文本",
                                     "kana-s100": "假名记法", "kana-s080": "假名记法"}.get(y, y)
                                    for y in x.get("variants", [x["variant"]]))
                           + f"，语速 {x.get('speed', VV_REP.get('speed_scale'))}"
                           + ("：三种写法合成结果完全相同，算一条" if len(x.get("variants", [])) > 1 else ""),
                "engine": " + ".join(f"{(y['consonant'] or '')}{y['vowel']}" for y in m) or "—", "engine_ok": ch["engine"]["ok"],
                "signal_ok": ch["signal"]["ok"], "peak": ch["signal"]["raw_peak_db"], "voiced": ch["signal"]["voiced_s"],
                "phones": ch["phones"]["phones"] or "—", "phones_ok": ch["phones"]["ok"],
                "asr": ch["reading"]["asr"].strip() or "—", "asr_ok": ch["reading"]["ok"],
                "asr_p": ch["reading_prompted"]["asr"].strip() or "—", "asr_p_ok": ch["reading_prompted"]["ok"],
                "ok": x["ok"], "published": c["ok"] and c["chosen"] == x["variant"],
                # every check that failed, not just the first
                "why": "；".join(w for w, ok in (("引擎分析出的音拍不对", ch["engine"]["ok"]), ("无声或过弱", ch["signal"]["ok"]),
                                                 ("音素识别不符", ch["phones"]["ok"]),
                                                 ("两次 Whisper 转写都不符", ch["reading"]["ok"] or ch["reading_prompted"]["ok"]))
                                if not ok)})
    return rows


if __name__ == "__main__":
    main()
