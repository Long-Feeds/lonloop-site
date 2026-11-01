"""VOICEVOX voices for the kana no other voice could say → reports/voicevox.json.

Four sounds — ぎゃ, ぴょ, シェ, ウォ — failed verification in both Microsoft voices
(Whisper heard じゃ/や, きょ/ピュー, せ/し, を; the phone recognizer did not hear the
right sound either) and Wikimedia Commons has no native-speaker recording of them.
VOICEVOX (open-source Japanese TTS, run locally) takes a mora sequence as input,
so the engine can be told to say exactly one mora — consonant gy + vowel a — and
what it was told can be read back before checking what it actually said.

The voices were chosen before any target sound was synthesized (`screen`): plain
"ノーマル" styles whose terms allow use on a free website without extra conditions,
screened on unrelated phrases and non-target single kana for intelligibility and
pitch register. Picking voices by how well they pass the target test would make
that test meaningless.

A clip is published only if ALL of these hold. That is stricter than the rule for
the Microsoft single-kana clips (one recognizer agreeing is enough there), because
these four are exactly the sounds the recognizers found hard:
  0. engine   the engine's analysis of the input is exactly one mora with the
              expected consonant and vowel (gy+a, py+o, sh+e, w+o), no pause
  1. signal   as verify.py: raw peak > -35 dB, voiced >= 60 ms
  2. phones   wav2vec2 IPA recognition hears the right consonant class and
              vowel (verify.phones_ok)
  3. reading  Whisper large-v3-turbo, or Whisper large-v3 with the domain prompt
              「日本語の仮名を一つずつ発音します。」, writes this kana (reading_ok_strict:
              verify.reading_ok without its "drop any trailing vowel" for single kana —
              only っ or a lengthening of the same vowel may follow: シェイ, シェー,
              シェッ count as シェ, シェア does not)
so two independent model families (CTC phone recognizer, Whisper) must agree.

Because that spelling tolerance could hide a real second mora (シェイ = she+i), every
published clip also gets its vowel's formants recorded next to the same voice
saying the bare vowel and the kana plus イ/ウ (two morae): see formant_record().

    python voicevox.py speakers   # dump voices + each character's terms into VV_DIR
    python voicevox.py screen     # candidate voices on unrelated test material
    python voicevox.py synth      # target kana × chosen voices × input variants (+ references)
    python voicevox.py verify     # measure everything → reports/voicevox.json
speakers / screen / synth need a running engine at VV_URL (default
http://127.0.0.1:50021); verify only reads the files in VV_DIR (outside the repo).
"""
import hashlib, json, os, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
VV_URL = os.environ.get("VV_URL", "http://127.0.0.1:50021")
VV_DIR = os.environ.get("VV_DIR", os.path.expanduser("~/.agents/workspace/japanese/voicevox"))
REPORT = os.path.join(HERE, "reports", "voicevox.json")
PROMPT = "日本語の仮名を一つずつ発音します。"  # the domain prompt verify.py's kana re-check used
SPEED = 0.9  # the Microsoft single-kana clips are synthesized at rate -10%

# Voice codes continue the site's one-letter scheme (h = human, n/k = Microsoft).
# speaker_uuid pins the character; the style id is looked up by name at run time.
# credit = the exact notation each character's terms ask for (speaker_info.policy
# in the engine + the terms page linked from it, read 2026-11-01).
VOICES = {
    "v": {"character": "WhiteCUL", "style": "ノーマル", "gender": "女声",
          "speaker_uuid": "67d5d8da-acd7-4207-bb10-b5542d3a663b",
          "credit": "VOICEVOX:WhiteCUL", "terms": "https://www.whitecul.com/guideline",
          "terms_note": "株式会社ZAN-SHIN 制定。商用・非商用均可；须在第三者看得到的地方署名（例：VOICEVOX:WhiteCUL），"
                        "未经许可不得省略；禁止冒充出处、未经许可不注明由 VOICEVOX 合成、用输出训练语音模型等"},
    "w": {"character": "雀松朱司", "style": "ノーマル", "gender": "男声",
          "speaker_uuid": "0acebdee-a4a5-4e12-a695-e19609728e30",
          "credit": "VOICEVOX:雀松朱司",
          "terms": "https://www.virvoxproject.com/voicevox%E3%81%AE%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84",
          "terms_note": "VirVox Project 制定。商用・非商用均可；须署名（VOICEVOX:雀松朱司）并注明由 VOICEVOX 合成，"
                        "未经 VirVox Project 许可不得省略；禁止冒充出处、用输出训练语音模型等"},
}
# Chosen by `screen` (2026-11-01), after excluding No.7 and 青山龍星 on their terms:
# most of the 8 phrases + 4 non-target kana passed; tie → more kana passed, then
# the more adult, less extreme register. WhiteCUL 7+2 (262.7 Hz) over 琴詠ニア 7+2
# (294.4 Hz); 雀松朱司 7+3 over 玄野武宏 7+2.
# What the terms say about the screened characters, where it is not simply
# "commercial and non-commercial use with the credit".
TERMS_NOTE = {
    "No.7": "个人署名后可用于非商用（同人活动、直播收入也可以）；其他商用须事先向 No.7 製作委員会确认",
    "青山龍星": "企业、个体经营者及与企业等签约的个人使用时，不论有无收益，都须事先向「ななはぴ」申请并取得许可",
}


# ------------------------------------------------------------------ engine ---
TALK = ("talk", "streaming_talk")  # 0.26 marks talk styles that can also stream as streaming_talk


def api(method, path, params=None, body=None, raw=False, timeout=180):
    url = VV_URL + path + ("?" + urllib.parse.urlencode(params) if params else "")
    data = json.dumps(body).encode() if body is not None else (b"" if method == "POST" else None)
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Content-Type": "application/json"} if body is not None else {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        b = r.read()
    return b if raw else (json.loads(b) if b else None)  # 204 (initialize_speaker) has no body


def style_id(uuid, style):
    for sp in api("GET", "/speakers"):
        if sp["speaker_uuid"] == uuid:
            for st in sp["styles"]:
                if st["name"] == style and st.get("type", "talk") in TALK:
                    return st["id"]
    raise SystemExit(f"style {style!r} of speaker {uuid} not found in this engine")


def make_query(variant, text, sid, speed=SPEED):
    """AudioQuery for one input variant. "kana…" = AquesTalk-style notation
    (ギャ' = this one mora, accent on it), parsed by the engine without any
    dictionary lookup; "kata"/"hira" = plain text through OpenJTalk."""
    if variant.startswith("kana"):
        q = api("POST", "/audio_query", {"text": text.rstrip("'"), "speaker": sid})
        q["accent_phrases"] = api("POST", "/accent_phrases", {"text": text, "speaker": sid, "is_kana": "true"})
    else:
        q = api("POST", "/audio_query", {"text": text, "speaker": sid})
    q["speedScale"] = speed
    return q


def synthesize(q, sid, wav_path):
    wav = api("POST", "/synthesis", {"speaker": sid}, body=q, raw=True)
    os.makedirs(os.path.dirname(wav_path), exist_ok=True)
    open(wav_path, "wb").write(wav)


# ----------------------------------------------------------------- targets ---
def targets():
    """Kana items with no verified clip in any other voice (mirrors build.source():
    a human recording, or a Microsoft clip of the item or of its katakana-input
    variant). Only these get a VOICEVOX clip: verified audio is never replaced."""
    from items import all_items
    rep = json.load(open(os.path.join(HERE, "reports", "verify.json")))["clips"]
    hj = os.path.join(HERE, "reports", "human.json")
    human = {c["id"] for c in json.load(open(hj))["clips"] if c.get("ok")} if os.path.exists(hj) else set()
    items = all_items()
    ids = {i["id"] for i in items}

    def ok(v, iid):
        return bool(rep.get(f"{v}/{iid}", {}).get("ok"))
    out = []
    for it in items:
        if it["kind"] != "kana" or it["id"] in human:
            continue
        if any(ok(v, it["id"]) or (it["id"] + "-kv" in ids and ok(v, it["id"] + "-kv")) for v in "nk"):
            continue
        out.append(it)
    return out


def variants(kana):
    """(name, input, speed), in order of preference. The three spellings at SPEED
    go through different front ends (AquesTalk-style notation vs OpenJTalk text
    analysis); when they come out identical they are one clip, measured once.
    The two other speeds are genuinely different audio: natural speed, and
    longer segments for the recognizers to hear."""
    from kana import to_hiragana, to_katakana
    kk = to_katakana(kana)
    return [("kana", kk + "'", SPEED), ("kata", kk, SPEED), ("hira", to_hiragana(kana), SPEED),
            ("kana-s100", kk + "'", 1.0), ("kana-s080", kk + "'", 0.8)]


def expected_mora(kana):
    """(consonant, vowel) in VOICEVOX/OpenJTalk phoneme names. pitch.mora_parts
    uses the same names for these sounds (gy, py, sh, w); anything it cannot map
    makes the engine check fail, which keeps the clip off the site."""
    import pitch
    from kana import to_hiragana
    c, v = pitch.mora_parts(to_hiragana(kana))
    return c or None, v


def engine_check(q, kana):
    from kana import to_katakana
    c, v = expected_mora(kana)
    aps = q["accent_phrases"]
    moras = [m for ap in aps for m in ap["moras"]]
    got = [{"text": m["text"], "consonant": m.get("consonant"), "vowel": m["vowel"]} for m in moras]
    ok = (len(aps) == 1 and len(moras) == 1 and not aps[0].get("pause_mora")
          and got[0] == {"text": to_katakana(kana), "consonant": c, "vowel": v})
    return {"ok": ok, "moras": got, "expected": {"consonant": c, "vowel": v},
            "accent": aps[0]["accent"] if aps else None}


VOWEL_KANA = {"a": "ア", "i": "イ", "u": "ウ", "e": "エ", "o": "オ"}
# how Whisper may spell a lengthened single kana (えい, おう …) — the second mora
# such a spelling would stand for, if it were really there
OFFGLIDE = {"a": "ア", "i": "イ", "u": "ウ", "e": "イ", "o": "ウ"}


def references(kana):
    """Reference clips for the formant record, said by the same voice at SPEED:
    the bare vowel (what the target's vowel should look like) and the target plus
    the offglide its tolerated spelling could hide (シェイ for シェ: two morae)."""
    from kana import to_katakana
    _, v = expected_mora(kana)
    if v not in VOWEL_KANA:
        return []
    kk = to_katakana(kana)
    return [("ref-vowel", VOWEL_KANA[v] + "'"), ("ref-two", kk + OFFGLIDE[v] + "'")]


def paths(voice, iid, variant):
    d = os.path.join(VV_DIR, voice)
    stem = os.path.join(d, f"{iid}.{variant}")
    return {"wav": stem + ".wav", "mp3": stem + ".mp3", "query": stem + ".query.json", "key": stem + ".key"}


def clip_key(engine_version, voice, sid, variant, text, speed):
    v = VOICES[voice]
    return hashlib.sha1(f"{engine_version}|{v['speaker_uuid']}|{sid}|{speed}|{variant}|{text}".encode()).hexdigest()[:16]


# ------------------------------------------------------------------- synth ---
def synth():
    from gen_audio import postprocess
    ver = api("GET", "/version")
    todo = targets()
    print("engine", ver, "targets:", " ".join(t["kana"] for t in todo))
    meta = {"engine_version": ver, "voices": {}}
    for voice, v in VOICES.items():
        sid = style_id(v["speaker_uuid"], v["style"])
        meta["voices"][voice] = {**v, "style_id": sid}
        api("POST", "/initialize_speaker", {"speaker": sid, "skip_reinit": "true"})
        for it in todo:
            for variant, text, speed in variants(it["kana"]):
                p = paths(voice, it["id"], variant)
                k = clip_key(ver, voice, sid, variant, text, speed)
                if os.path.exists(p["mp3"]) and os.path.exists(p["key"]) and open(p["key"]).read() == k:
                    continue
                q = make_query(variant, text, sid, speed)
                synthesize(q, sid, p["wav"])
                json.dump({"input": text, "variant": variant, "speed": speed, "query": q}, open(p["query"], "w"), ensure_ascii=False, indent=1)
                postprocess(p["wav"], p["mp3"])  # same trim + peak normalization as the Microsoft clips
                open(p["key"], "w").write(k)
                print(voice, it["kana"], variant, text, "→", os.path.basename(p["mp3"]))
            for variant, text in references(it["kana"]):
                p = paths(voice, it["id"], variant)
                k = clip_key(ver, voice, sid, variant, text, SPEED)
                if os.path.exists(p["mp3"]) and os.path.exists(p["key"]) and open(p["key"]).read() == k:
                    continue
                q = make_query("kana", text, sid, SPEED)
                synthesize(q, sid, p["wav"])
                json.dump({"input": text, "variant": variant, "speed": SPEED, "query": q}, open(p["query"], "w"), ensure_ascii=False, indent=1)
                postprocess(p["wav"], p["mp3"])
                open(p["key"], "w").write(k)
    json.dump(meta, open(os.path.join(VV_DIR, "meta.json"), "w"), ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ checks ---
_models = {}


def whisper(path, prompted=False):
    import mlx_whisper
    if prompted:
        return mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-mlx", language="ja",
                                      temperature=0.0, condition_on_previous_text=False,
                                      initial_prompt=PROMPT)["text"]
    return mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="ja",
                                  temperature=0.0, condition_on_previous_text=False)["text"]


VOWEL_HIRA = {"a": "あ", "i": "い", "u": "う", "e": "え", "o": "お"}


def reading_ok_strict(text, kana):
    """Does the transcript say this kana? Same readings and normalization as
    verify.reading_ok (UniDic kana/pron + 5-best, ー → vowel, おう → おお …), but
    a longer transcript only counts if what follows the kana is っ or a
    lengthening of its own vowel (ー, the vowel, or い after e / う after o).
    verify.reading_ok drops ANY trailing vowel for a single kana, which would
    accept 「シェア」 as シェ."""
    from verify import _nbest_readings, asr_readings, pnorm
    exp = pnorm(kana)
    _, v = expected_mora(kana)
    tail = {"っ", VOWEL_HIRA.get(v, "")} | ({"い"} if v == "e" else set()) | ({"う"} if v == "o" else set())
    cands = {pnorm(r) for r in asr_readings(text)} | {pnorm(r) for r in _nbest_readings(text)}
    return any(c == exp or (len(c) == len(exp) + 1 and c.startswith(exp) and c[-1] in tail) for c in cands)


def measure_kana(mp3, wav, kana):
    """signal + phones + both Whisper readings for one single-kana clip."""
    import phoneme_asr
    from gen_audio import peak_db
    from verify import phones_ok, voiced_seconds
    ch = {}
    vs, peak = voiced_seconds(mp3), peak_db(wav)
    ch["signal"] = {"ok": vs >= 0.06 and peak > -35, "voiced_s": round(vs, 3), "raw_peak_db": peak}
    ph = phoneme_asr.recognize(mp3)
    okp, why = phones_ok(kana, ph)
    ch["phones"] = {"ok": okp, "phones": " ".join(ph), "why": why}
    t1 = whisper(mp3)
    ch["reading"] = {"ok": reading_ok_strict(t1, kana), "asr": t1, "model": "large-v3-turbo"}
    t2 = whisper(mp3, prompted=True)
    ch["reading_prompted"] = {"ok": reading_ok_strict(t2, kana), "asr": t2,
                              "model": f"large-v3 + 领域提示「{PROMPT}」"}
    return ch


def formants(path):
    """The stretch from the first to the last frame with a detected F0 (not the
    whole clip), and median (F1, F2) of 12 evenly spaced points over its 30-70 %
    (steady part) and 75-95 % (ending), where an offglide such as the [i] of シェイ
    would show (F1 falls, F2 rises). Medians: Burg tracking drops out on single
    frames. An aid, not proof."""
    import numpy as np
    import parselmouth
    snd = parselmouth.Sound(path)
    pitch = snd.to_pitch(time_step=0.005, pitch_floor=60, pitch_ceiling=400)
    t = [x for x, f in zip(pitch.xs(), pitch.selected_array["frequency"]) if f > 0]
    if len(t) < 8:
        return None
    a, b = t[0], t[-1]
    fm = snd.to_formant_burg(time_step=0.005, max_number_of_formants=5, maximum_formant=5000)

    def med(lo, hi):
        ts = np.linspace(a + lo * (b - a), a + hi * (b - a), 12)
        return [round(float(np.nanmedian([fm.get_value_at_time(k, x) for x in ts]))) for k in (1, 2)]
    return {"voiced_s": round(b - a, 3), "steady": med(0.3, 0.7), "ending": med(0.75, 0.95)}


def formant_record(voice, iid, kana, clip_mp3):
    """Recorded (not a gate): the published clip's vowel next to the same voice's
    bare vowel and two-mora reference, so a hidden second mora would show."""
    rec = {"clip": formants(clip_mp3)}
    for variant, text in references(kana):
        p = paths(voice, iid, variant)
        if os.path.exists(p["mp3"]):
            rec[variant] = {"input": text, **(formants(p["mp3"]) or {})}
    return rec


def rejudge(ch, q, kana):
    """Recompute every pass/fail from stored measurements, so a cached clip is
    judged by the current rules (no models re-run)."""
    from verify import phones_ok
    ch["engine"] = engine_check(q, kana)
    sg = ch["signal"]
    sg["ok"] = sg["voiced_s"] >= 0.06 and sg["raw_peak_db"] > -35
    okp, why = phones_ok(kana, ch["phones"]["phones"].split())
    ch["phones"].update(ok=okp, why=why)
    for k in ("reading", "reading_prompted"):
        ch[k]["ok"] = reading_ok_strict(ch[k]["asr"], kana)
    return ch


def decide(ch):
    return bool(ch["engine"]["ok"] and ch["signal"]["ok"] and ch["phones"]["ok"]
                and (ch["reading"]["ok"] or ch["reading_prompted"]["ok"]))


def first_failure(ch):
    """The first check (in the order they are listed in the module docstring)
    that failed, for the verification page."""
    for name in ("engine", "signal", "phones"):
        if not ch[name]["ok"]:
            return name
    if not (ch["reading"]["ok"] or ch["reading_prompted"]["ok"]):
        return "reading"
    return None


# ------------------------------------------------------------------ verify ---
def verify():
    meta = json.load(open(os.path.join(VV_DIR, "meta.json")))
    old = json.load(open(REPORT)) if os.path.exists(REPORT) else {"clips": {}}
    rep = {"generated": time.strftime("%Y-%m-%d %H:%M"), "engine": {"name": "VOICEVOX Engine",
           "version": meta["engine_version"], "url": "https://github.com/VOICEVOX/voicevox_engine"},
           "speed_scale": SPEED, "prompt": PROMPT, "voices": meta["voices"], "clips": {}}
    for voice in VOICES:
        for it in targets():
            cid = f"{voice}/{it['id']}"
            prev = {x["md5"]: x for x in old.get("clips", {}).get(cid, {}).get("variants", []) if "md5" in x}
            # Inputs that the engine turns into the same audio are one clip, not
            # several attempts: group by the synthesized WAV and measure it once.
            groups = {}
            for variant, text, speed in variants(it["kana"]):
                p = paths(voice, it["id"], variant)
                if os.path.exists(p["mp3"]):
                    h = hashlib.md5(open(p["wav"], "rb").read()).hexdigest()
                    groups.setdefault(h, []).append((variant, text, p, speed))
            vs = []
            for h, members in groups.items():
                variant, text, p, speed = members[0]
                q = json.load(open(p["query"]))["query"]
                if h in prev:  # same audio, already measured: re-judge by the current rules
                    ch = rejudge(prev[h]["checks"], q, it["kana"])
                else:
                    ch = {"engine": engine_check(q, it["kana"])}
                    ch.update(measure_kana(p["mp3"], p["wav"], it["kana"]))
                vs.append({"variant": variant, "variants": [m[0] for m in members], "input": " / ".join(m[1] for m in members),
                           "speed": speed, "md5": h, "checks": ch, "ok": decide(ch), "failed": first_failure(ch),
                           "file": os.path.basename(p["mp3"])})
                print(cid, "+".join(vs[-1]["variants"]), "OK" if vs[-1]["ok"] else "fail:" + vs[-1]["failed"],
                      "|", ch["phones"]["phones"], "|", ch["reading"]["asr"], "|", ch["reading_prompted"]["asr"], flush=True)
            chosen = next((x for x in vs if x["ok"]), None)
            if chosen:
                chosen["formants"] = formant_record(voice, it["id"], it["kana"],
                                                    os.path.join(VV_DIR, voice, chosen["file"]))
            rep["clips"][cid] = {"id": it["id"], "voice": voice, "kana": it["kana"], "expected": it["r"],
                                 "ok": chosen is not None, "chosen": chosen["variant"] if chosen else None,
                                 "file": chosen["file"] if chosen else None, "variants": vs}
    scr = os.path.join(VV_DIR, "screen.json")
    if os.path.exists(scr):
        rep["screening"] = {**json.load(open(scr)), "terms": TERMS_NOTE}
    json.dump(rep, open(REPORT, "w"), ensure_ascii=False, indent=1)
    for cid, c in rep["clips"].items():
        print(cid, c["kana"], "PUBLISH " + c["chosen"] if c["ok"] else "no clip passed")


def published():
    """{(voice, item id): absolute path of the clip to publish} — read by build.py."""
    if not os.path.exists(REPORT):
        return {}
    rep = json.load(open(REPORT))
    return {(c["voice"], c["id"]): os.path.join(VV_DIR, c["voice"], c["file"])
            for c in rep["clips"].values() if c["ok"]}


# ---------------------------------------------------------------- speakers ---
def speakers():
    """Every talk voice in the engine, with each character's terms as shipped in
    the engine (speaker_info.policy), saved under VV_DIR/policies/."""
    os.makedirs(os.path.join(VV_DIR, "policies"), exist_ok=True)
    out = []
    for sp in api("GET", "/speakers"):
        info = api("GET", "/speaker_info", {"speaker_uuid": sp["speaker_uuid"], "resource_format": "url"})
        fn = os.path.join(VV_DIR, "policies", sp["name"].replace("/", "_") + ".md")
        open(fn, "w").write(info.get("policy", ""))
        out.append({"name": sp["name"], "speaker_uuid": sp["speaker_uuid"],
                    "styles": [(s["name"], s["id"]) for s in sp["styles"] if s.get("type", "talk") in TALK]})
        print(sp["name"], sp["speaker_uuid"], out[-1]["styles"])
    json.dump(out, open(os.path.join(VV_DIR, "speakers.json"), "w"), ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ screen ---
# Unrelated material: none of it contains ぎゃ, ぴょ, シェ or ウォ.
SCREEN_PHRASES = [("おはようございます", "おはようございます"), ("はじめまして", "はじめまして"),
                  ("ありがとうございます", "ありがとうございます"), ("すみません", "すみません"),
                  ("私は学生です", "わたしはがくせいです"), ("これは何ですか", "これはなんですか"),
                  ("病院", "びょういん"), ("切手", "きって")]
SCREEN_KANA = ["か", "し", "きゃ", "ふ"]
# plain styles of the characters with a mature-sounding default voice; No.7 and
# 青山龍星 are listed for comparison although their terms add conditions
SCREEN_CANDIDATES = [("WhiteCUL", "ノーマル"), ("九州そら", "ノーマル"), ("冥鳴ひまり", "ノーマル"),
                     ("No.7", "ノーマル"), ("琴詠ニア", "ノーマル"), ("四国めたん", "ノーマル"),
                     ("玄野武宏", "ノーマル"), ("青山龍星", "ノーマル"), ("剣崎雌雄", "ノーマル"),
                     ("雀松朱司", "ノーマル"), ("麒ヶ島宗麟", "ノーマル")]


def f0_stats(path):
    import numpy as np
    import parselmouth
    snd = parselmouth.Sound(path)
    f0 = snd.to_pitch(time_step=0.01, pitch_floor=60, pitch_ceiling=600).selected_array["frequency"]
    f0 = f0[f0 > 0]
    if len(f0) < 5:
        return None, None
    return float(np.median(f0)), float(12 * np.log2(np.percentile(f0, 95) / np.percentile(f0, 5)))


def screen():
    import statistics
    from gen_audio import postprocess
    from verify import reading_ok
    sps = {sp["name"]: sp for sp in api("GET", "/speakers")}
    d = os.path.join(VV_DIR, "screen")
    os.makedirs(d, exist_ok=True)
    res = []
    for name, style in SCREEN_CANDIDATES:
        sp = sps.get(name)
        st = next((s for s in (sp or {}).get("styles", []) if s["name"] == style), None)
        if not st:
            print("missing", name, style)
            continue
        sid = st["id"]
        api("POST", "/initialize_speaker", {"speaker": sid, "skip_reinit": "true"})
        row = {"character": name, "style": style, "style_id": sid, "speaker_uuid": sp["speaker_uuid"],
               "phrases": [], "kana": []}
        f0s, ranges = [], []
        for i, (w, r) in enumerate(SCREEN_PHRASES):
            wav, mp3 = os.path.join(d, f"{sid}-p{i}.wav"), os.path.join(d, f"{sid}-p{i}.mp3")
            q = api("POST", "/audio_query", {"text": w, "speaker": sid})
            synthesize(q, sid, wav)
            postprocess(wav, mp3)
            t = whisper(mp3)
            med, rng = f0_stats(wav)
            if med:
                f0s.append(med); ranges.append(rng)
            row["phrases"].append({"text": w, "asr": t, "ok": reading_ok(t, r)})
        for k in SCREEN_KANA:
            iid = "k-" + k
            wav, mp3 = os.path.join(d, f"{sid}-{iid}.wav"), os.path.join(d, f"{sid}-{iid}.mp3")
            from kana import to_katakana
            q = make_query("kana", to_katakana(k) + "'", sid)
            synthesize(q, sid, wav)
            postprocess(wav, mp3)
            ch = {"engine": engine_check(q, k)}
            ch.update(measure_kana(mp3, wav, k))
            row["kana"].append({"kana": k, "ok": decide(ch), "phones": ch["phones"]["phones"],
                                "asr": ch["reading"]["asr"], "asr_prompted": ch["reading_prompted"]["asr"]})
        row["phrase_ok"] = sum(x["ok"] for x in row["phrases"])
        row["kana_ok"] = sum(x["ok"] for x in row["kana"])
        row["f0_median_hz"] = round(statistics.median(f0s), 1) if f0s else None
        row["f0_range_st"] = round(statistics.median(ranges), 1) if ranges else None
        res.append(row)
        print(f"{name:8s} {style}  phrases {row['phrase_ok']}/{len(SCREEN_PHRASES)}  kana {row['kana_ok']}/{len(SCREEN_KANA)}"
              f"  F0 median {row['f0_median_hz']} Hz  range {row['f0_range_st']} st", flush=True)
        for x in row["phrases"] + row["kana"]:
            if not x["ok"]:
                print("    ✗", x.get("text") or x.get("kana"), "|", x.get("asr"), "|", x.get("phones", ""), "|", x.get("asr_prompted", ""))
    json.dump({"phrases": [w for w, _ in SCREEN_PHRASES], "kana": SCREEN_KANA, "speed_scale_kana": SPEED,
               "results": res}, open(os.path.join(VV_DIR, "screen.json"), "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    {"speakers": speakers, "screen": screen, "synth": synth, "verify": verify}.get(
        cmd, lambda: sys.exit(__doc__))()
