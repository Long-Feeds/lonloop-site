"""Every clip the English section can play, derived from content.yaml.

One item = one piece of text said by one voice at one rate. The id doubles as
the published file name (english/audio/<id>.mp3) and as the key the pages use.
"""
import os

import yaml

HERE = os.path.dirname(os.path.abspath(__file__))

# voices for content that does not name its own
CHUNK_VOICES = ["en-US-AvaNeural", "en-US-AndrewNeural"]
PRON_VOICE = "en-US-AvaNeural"
# single words are tried in both voices; a minimal pair is published in the first
# voice in which *both* words pass, never mixed (the timbre would give it away)
WORD_VOICES = [("", "en-US-AvaNeural"), ("-m", "en-US-AndrewNeural")]
CONNECTED_VOICE = "en-US-AndrewNeural"


def load_content():
    with open(os.path.join(HERE, "content.yaml"), encoding="utf-8") as f:
        return yaml.safe_load(f)


def word_id(word):
    return "pw-" + "".join(c if c.isalnum() else "_" for c in word.lower())


def all_items(content=None):
    c = content or load_content()
    out = []
    for s in c["dictation"]:
        for it in s["items"]:
            out.append(dict(id=it["id"], kind="dictation", text=it["text"], voice=s["voice"], rate=s.get("rate", "+0%")))
    for g in c["chunks"]:
        for i, it in enumerate(g["items"]):
            out.append(dict(id=it["id"], kind="chunk", text=it["en"], voice=CHUNK_VOICES[i % 2], rate="+0%"))
    seen = set()
    for g in c["pronunciation"]:
        for pair in g["pairs"]:
            for w in pair:
                wid = word_id(w)
                if wid in seen:
                    continue
                seen.add(wid)
                # a lone word said at full speed is clipped and hard to judge; slow it slightly
                for suf, v in WORD_VOICES:
                    out.append(dict(id=wid + suf, kind="word", text=w, voice=v, rate="-10%"))
        for j, sent in enumerate(g.get("sentences", [])):
            out.append(dict(id=f"{g['id']}-s{j + 1}", kind="pron-sentence", text=sent, voice=PRON_VOICE, rate="+0%"))
    for g in c["connected"]:
        for j, ex in enumerate(g["examples"]):
            out.append(dict(id=f"{g['id']}-{j + 1}", kind="connected", text=ex["text"], voice=CONNECTED_VOICE, rate="+0%"))
    ids = [x["id"] for x in out]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        raise SystemExit(f"duplicate item ids: {sorted(dup)}")
    return out
