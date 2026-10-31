"""Synthesize every item in both voices with Microsoft neural TTS (edge-tts).

Raw synthesis goes to a cache outside the repo (JA_CACHE); a clip is only copied
into the site by build.py after verify.py has passed it. Each clip is trimmed
(edge-tts pads every utterance to >=1.87 s) and peak-normalized so a learner
does not have to ride the volume between a whispered kana and a loud sentence.
"""
import asyncio, hashlib, json, os, subprocess, sys

import edge_tts

from items import VOICES, all_items

CACHE = os.environ.get("JA_CACHE", os.path.expanduser("~/.agents/workspace/japanese/audio-cache"))


def key(item, voice):
    return hashlib.sha1(f"{VOICES[voice]}|{item['rate']}|{item['tts']}".encode()).hexdigest()[:16]


def paths(item, voice):
    d = os.path.join(CACHE, voice)
    return os.path.join(d, f"{item['id']}.raw.mp3"), os.path.join(d, f"{item['id']}.mp3"), os.path.join(d, f"{item['id']}.key")


def postprocess(raw, out):
    # trim: leave 60 ms before the onset and 180 ms after the offset so a devoiced
    # final vowel (です → [desɯ̥]) is not shaved off as "silence"
    trim = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,"
            "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.18,areverse")
    tmp = out + ".tmp.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", trim, "-ar", "24000", "-ac", "1", tmp], check=True)
    vd = subprocess.run(["ffmpeg", "-i", tmp, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    peak = None
    for line in vd.splitlines():
        if "max_volume:" in line:
            peak = float(line.split("max_volume:")[1].split("dB")[0])
    gain = 0.0 if peak is None else (-1.5 - peak)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={gain:.2f}dB",
                    "-codec:a", "libmp3lame", "-b:a", "64k", out], check=True)
    os.remove(tmp)


def peak_db(path):
    vd = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    for line in vd.splitlines():
        if "max_volume:" in line:
            return float(line.split("max_volume:")[1].split("dB")[0])
    return -99.0


def alternatives(item):
    """Texts to try, in order. A lone kana sometimes comes back as silence
    (measured: Nanami on 「こ。」, Keita on 「ん。」 and bare 「あ」), so single
    kana get spelling fallbacks that say the same sound."""
    if item["kind"] not in ("kana", "kanavar"):
        return [item["tts"]]
    k = item["kana"]
    from kana import to_katakana
    alts = [item["tts"], to_katakana(k), k + "。", k]
    return list(dict.fromkeys(alts))


async def synth(item, voice, sem):
    raw, out, kf = paths(item, voice)
    k = key(item, voice)
    if os.path.exists(out) and os.path.exists(kf) and open(kf).read().split("|")[0] == k:
        return "cached"
    os.makedirs(os.path.dirname(raw), exist_ok=True)
    for text in alternatives(item):
        async with sem:
            for attempt in range(4):
                try:
                    await edge_tts.Communicate(text, VOICES[voice], rate=item["rate"]).save(raw)
                    break
                except Exception as e:
                    if attempt == 3:
                        print("FAIL", voice, item["id"], e, file=sys.stderr)
                        return "fail"
                    await asyncio.sleep(2 * (attempt + 1))
        if await asyncio.to_thread(peak_db, raw) > -40:
            break
    else:
        # every spelling came back silent: keep the silent file so verify.py
        # records the failure, and the page falls back to the other voice
        text = "SILENT"
    await asyncio.to_thread(postprocess, raw, out)
    open(kf, "w").write(k + ("" if text == item["tts"] else "|alt=" + text))
    return "new" if text == item["tts"] else ("alt" if text != "SILENT" else "silent")


async def main(only=None):
    items = all_items()
    if only:
        items = [i for i in items if i["kind"] in only]
    sem = asyncio.Semaphore(6)
    tasks = [synth(i, v, sem) for i in items for v in VOICES]
    res = await asyncio.gather(*tasks)
    from collections import Counter
    print(Counter(res))


if __name__ == "__main__":
    asyncio.run(main(set(sys.argv[1:]) or None))
