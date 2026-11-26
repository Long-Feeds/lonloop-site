"""Synthesize every item with Microsoft neural TTS (edge-tts).

Raw synthesis goes to a cache outside the repo (EN_CACHE); build.py copies a
clip into the site only after verify.py has passed it. Each clip is trimmed
(edge-tts pads every utterance) and peak-normalized so the learner never has to
ride the volume between a single word and a long sentence.
"""
import asyncio, hashlib, os, subprocess, sys

import edge_tts

from items import all_items

CACHE = os.environ.get("EN_CACHE", os.path.expanduser("~/.agents/workspace/english/audio-cache"))


def key(item):
    return hashlib.sha1(f"{item['voice']}|{item['rate']}|{item['text']}".encode()).hexdigest()[:16]


def paths(item):
    return (os.path.join(CACHE, f"{item['id']}.raw.mp3"), os.path.join(CACHE, f"{item['id']}.mp3"),
            os.path.join(CACHE, f"{item['id']}.key"))


def postprocess(raw, out):
    # keep 80 ms before the onset and 200 ms after the offset: final stops and
    # fricatives (desk, bags) are quiet, and shaving them would teach the very
    # final-consonant dropping the pronunciation lesson warns about
    trim = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,"
            "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.2,areverse")
    tmp = out + ".tmp.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", trim, "-ar", "24000", "-ac", "1", tmp], check=True)
    vd = subprocess.run(["ffmpeg", "-i", tmp, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    peak = next((float(l.split("max_volume:")[1].split("dB")[0]) for l in vd.splitlines() if "max_volume:" in l), None)
    gain = 0.0 if peak is None else (-1.5 - peak)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={gain:.2f}dB",
                    "-codec:a", "libmp3lame", "-b:a", "64k", out], check=True)
    os.remove(tmp)


async def synth(item, sem):
    raw, out, kf = paths(item)
    k = key(item)
    if os.path.exists(out) and os.path.exists(kf) and open(kf).read() == k:
        return "cached"
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(item["text"], item["voice"], rate=item["rate"]).save(raw)
                break
            except Exception as e:  # network hiccups are common; back off and retry
                if attempt == 3:
                    print("FAIL", item["id"], e, file=sys.stderr)
                    return "fail"
                await asyncio.sleep(2 * (attempt + 1))
    await asyncio.to_thread(postprocess, raw, out)
    os.remove(raw)
    with open(kf, "w") as f:
        f.write(k)
    return "new"


async def main():
    os.makedirs(CACHE, exist_ok=True)
    items = all_items()
    only = set(sys.argv[1:])
    if only:
        items = [i for i in items if i["id"] in only]
    sem = asyncio.Semaphore(6)
    res = await asyncio.gather(*(synth(i, sem) for i in items))
    print({r: res.count(r) for r in set(res)}, "of", len(items))


if __name__ == "__main__":
    asyncio.run(main())
