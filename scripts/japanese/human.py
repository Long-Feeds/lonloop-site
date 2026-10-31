"""Real human recordings from Wikimedia Commons → reports/human.json.

Selection rules (the point is that a human recording must be at least as
trustworthy as the synthetic one it replaces):
  * The Commons description must say who speaks and how: we take the
    "male native Japanese voice actor with Tokyo accent" recordings that
    Tofugu/WaniKani released (CC BY-SA 4.0), and single kana that are
    described as "Pronounced by a native speaker of Japanese" (public domain).
    The female half of the Tofugu/WaniKani set is described as "a native
    Japanese woman with a Kansai accent" — Kansai pitch accent is a different
    system from the Tokyo accent this course teaches, so none of it is used.
    Lingua Libre volunteers are not used: their native language and region
    could not be established.
  * Each clip passes the same reading check as the synthetic audio (Whisper
    transcript → kana must equal the reading; single kana may also pass the
    domain-prompted check).
  * Words were reviewed on their F0 contour against the dictionary accent
    (bare words: 頭高 must fall after mora 1, 中高 inside the word, 平板/尾高
    must rise without an internal fall; one-mora words cannot be judged bare).

Inputs live outside the repo (HUMAN_DIR, default ~/.agents/workspace/japanese/human):
info_wk_sy_nu.json (Commons metadata), human_asr.json (checks), mp3/ (trimmed,
peak-normalized 64 kbps MP3 made from the Commons originals).
"""
import json, os, re

from items import slug

HERE = os.path.dirname(os.path.abspath(__file__))
HUMAN_DIR = os.environ.get("HUMAN_DIR", os.path.expanduser("~/.agents/workspace/japanese/human"))

# Manual F0 review of the bare-word recordings (review_h*.png), 2026-10-31.
REJECT_PITCH = {
    "的": "接尾词（-てき），不适合作为单词示范",
    "全然": "实测从第 1 拍就高、之后一路下降，像头高型；词典为⓪（平板），不采用",
    "濡れる": "末拍下降过大，无法判断是句末回落还是中高型，不采用",
}
REJECT_READING = {
    "人": "识别为「と」（ひ清化后识别不出），音素识别也无法确认",
    "子": "识别为「語」，与音素识别结果矛盾",
    "手": "识别为「で」，与音素识别结果矛盾",
}
# single kana: description says "native speaker"; must pass a reading check
SYLLABLE_MAP = {"Ja-Fu": "ふ", "Ja-Hi": "ひ", "Ja-Ri": "り", "Ja-Ru": "る", "Ja-Shi": "し", "Ja-Tsu": "つ", "Ja-U": "う"}
# Chinese glosses for recordings of words that are not in content.yaml
# (used on the accent lesson's 真人示范 list)
ZH = {"学校": "学校", "仕事": "工作", "茶色": "茶色；棕色", "自信": "自信", "皿": "盘子", "死ぬ": "死",
      "的": "……的（接尾）", "来月": "下个月", "飯": "饭（男性用语，较随便）", "馬": "马", "残念": "遗憾",
      "家": "家；房子", "音": "声音（物体发出的）", "顔": "脸", "物": "东西", "寺": "寺庙", "上": "上面",
      "毛": "毛", "目": "眼睛", "根": "根", "二": "二", "字": "字", "図": "图", "田": "田", "輪": "圈；环",
      "矢": "箭", "世": "世；世间", "歯": "牙齿", "火": "火", "絵": "画", "濡らす": "弄湿", "濡れる": "湿",
      "女": "女人"}


def main():
    inf = json.load(open(os.path.join(HUMAN_DIR, "info_wk_sy_nu.json")))
    checks = {x["file"]: x for x in json.load(open(os.path.join(HUMAN_DIR, "human_asr.json")))}
    clips = []

    def strip(h):
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", h or "")).strip()

    from kana import to_hiragana
    from items import kana_id
    for title, x in checks.items():
        meta = inf[title]
        base = re.sub(r"\.\w+$", "", title[5:])
        rec = {"title": title, "page": "https://commons.wikimedia.org/wiki/" + title.replace(" ", "_"),
               "license": meta["license"],
               "author": (strip(meta["artist"]) if "No machine-readable author" not in strip(meta["artist"]) else "")
                         or (meta.get("user") or "").replace("~commonswiki", "") + "（上传者）",
               "desc": strip(meta["desc"])[:200], "mp3": base + ".mp3", "asr": x.get("asr"),
               "asr2": x.get("asr2"), "asr_prompted": x.get("asr_prompted")}
        if x["kind"] == "word":
            w, r = x["w"], x["r"]
            rec.update(kind="word", w=w, r=r, id=slug(w, r), zh=ZH.get(w), r_note=x.get("r_note"))
            if w in REJECT_READING:
                rec.update(ok=False, why=REJECT_READING[w])
            elif not x.get("ok"):
                rec.update(ok=False, why="读音校验未通过")
            elif w in REJECT_PITCH:
                rec.update(ok=False, why=REJECT_PITCH[w])
            else:
                rec.update(ok=True)
        else:
            k = SYLLABLE_MAP.get(base)
            if not k:
                why = ("录音说明没有写明录音者是否为日语母语者，不采用" if re.match(r"Ja-\d", base) else
                       "不是单个假名（是词、重复朗读或示范段落）" if base in ("Ja-Ie", "Ja-Ka", "Ja-So", "Ja-pronunciation-moraic n") else
                       "可能读成了长音「りゅう」，无法确认是短音「りゅ」" if base == "Ja-Ryu" else
                       "识别结果无法确认是「ウィ」「ウェ」" if base in ("Ja-Wi", "Ja-We") else
                       "识别结果与标注的假名不符")
                rec.update(kind="other", ok=False, why=why)
            else:
                from verify import reading_ok
                good = reading_ok(x.get("asr") or "", k) or reading_ok(x.get("asr_prompted") or "", k)
                rec.update(kind="kana", kana=k, id=kana_id(k), ok=good,
                           why=None if good else "识别结果与假名不符")
        clips.append(rec)
    out = os.path.join(HERE, "reports", "human.json")
    json.dump({"source": "Wikimedia Commons", "clips": clips}, open(out, "w"), ensure_ascii=False, indent=1)
    print(sum(c["ok"] for c in clips), "of", len(clips), "approved →", out)


if __name__ == "__main__":
    main()
