"""Build /english/: course data, verified audio, pages.

  content.yaml + resources.yaml + reports/verify.json
      → english/data/course.json   (only clips that passed verify.py)
      → english/audio/*.mp3        (copied from the cache; name carries a content hash)
      → english/**/index.html      (pages/*.html wrapped in one layout)
Asset URLs get ?v=<hash> so a returning visitor never mixes a new page with a
cached old script (the site's HTML/CSS/JS are browser-cached for hours).
"""
import hashlib, json, os, re, shutil

import yaml

from gen_audio import key, paths
from items import HERE, WORD_VOICES, all_items, load_content, word_id

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "english")
PAGES_SRC = os.path.join(HERE, "pages")

ACCENT = {"en-US": "美式", "en-GB": "英式", "en-AU": "澳式", "en-IN": "印度", "en-SG": "新加坡"}
KIND_ZH = {"monologue": "独白", "retell": "复述", "explain": "讲解", "roleplay": "角色扮演", "interview": "面试"}
WEEKS = 12
# real-audio intensive listening, easiest first: BBC 6 Minute English is slower
# and scripted; The Pragmatic Engineer is unscripted C1 tech talk
EXT_BY_PHASE = {1: ["bbc-6min", "bbc-6min", "ted-transcript"],
                2: ["npr-indicator", "ted-transcript", "bbc-6min"],
                3: ["pragmatic-engineer-transcript", "npr-indicator", "ted-transcript"]}

BENCH_PROMPT = dict(
    id="bench", phase=0, kind="monologue", title="每周基准录音：介绍你自己和手头的工作",
    prompt="Tell me about yourself and what you're working on right now.",
    hints=["who you are and your role", "one project you're working on and why it matters", "what's next for you"],
)


def h(s):
    return hashlib.sha1(s if isinstance(s, bytes) else s.encode()).hexdigest()[:8]


# --------------------------------------------------------------- audio ---
def publish_audio(items, report):
    adir = os.path.join(OUT, "audio")
    os.makedirs(adir, exist_ok=True)
    keep, files = set(), {}
    for it in items:
        rec = report.get(it["id"])
        if not rec or not rec.get("ok") or rec.get("key") != key(it):
            continue
        _, mp3, _ = paths(it)
        name = f"{it['id']}-{key(it)[:6]}.mp3"
        dst = os.path.join(adir, name)
        if not os.path.exists(dst):
            shutil.copyfile(mp3, dst)
        keep.add(name)
        files[it["id"]] = name
    for f in os.listdir(adir):  # a clip that changed or stopped passing leaves the site
        if f not in keep:
            os.remove(os.path.join(adir, f))
    return files


# ---------------------------------------------------------------- data ---
def course(content, resources, files, report):
    acc = lambda v: ACCENT.get(v[:5], v[:5])
    dictation = []
    for s in content["dictation"]:
        its = [dict(id=i["id"], text=i["text"], focus=i.get("focus", []), note=i.get("note", ""), a=files[i["id"]])
               for i in s["items"] if i["id"] in files]
        if len(its) >= 6:  # a set that lost most of its sentences is not worth a day
            dictation.append(dict(id=s["id"], phase=s["phase"], title=s["title"], accent=acc(s["voice"]),
                                  voice=s["voice"].split("-")[2].replace("Neural", "").replace("Multilingual", ""),
                                  rate=s.get("rate", "+0%"), items=its))
    chunks = []
    for g in content["chunks"]:
        its = [dict(id=i["id"], en=i["en"], zh=i["zh"], note=i.get("note", ""), a=files.get(i["id"]))
               for i in g["items"] if i["id"] in files]
        chunks.append(dict(id=g["id"], phase=g["phase"], title=g["title"], items=its))
    pron = []
    for g in content["pronunciation"]:
        pairs = []
        for p in g["pairs"]:
            for suf, _ in WORD_VOICES:
                if all(word_id(w) + suf in files for w in p):
                    pairs.append([dict(w=w, a=files[word_id(w) + suf]) for w in p])
                    break
        sents = [dict(text=t, a=files[f"{g['id']}-s{j + 1}"]) for j, t in enumerate(g.get("sentences", []))
                 if f"{g['id']}-s{j + 1}" in files]
        pron.append(dict(id=g["id"], title=g["title"], explain=g["explain"], pairs=pairs, sentences=sents))
    connected = []
    for g in content["connected"]:
        exs = [dict(text=e["text"], hear=e.get("hear", ""), note=e.get("note", ""), a=files[f"{g['id']}-{j + 1}"])
               for j, e in enumerate(g["examples"]) if f"{g['id']}-{j + 1}" in files]
        connected.append(dict(id=g["id"], title=g["title"], explain=g["explain"], examples=exs))
    speaking = [BENCH_PROMPT] + [dict(s, kind_zh=KIND_ZH.get(s["kind"], s["kind"])) for s in content["speaking"]]
    total = len(report)
    passed = sum(1 for r in report.values() if r.get("ok"))
    second = sum(1 for r in report.values() if r.get("ok") and not r.get("match_turbo") and r.get("match_large"))
    manual = sum(1 for r in report.values() if r.get("ok") and r.get("manual"))
    failed = [dict(id=k, text=r.get("text"), heard=r.get("large") or r.get("turbo"))
              for k, r in sorted(report.items()) if not r.get("ok")]
    stats = dict(clips=total, passed=passed, second_opinion=second, manual=manual, failed=failed)
    data = dict(dictation=dictation, chunks=chunks, pron=pron, connected=connected, speaking=speaking,
                resources=resources, stats=stats)
    data["plan"] = plan(data)
    return data


# ---------------------------------------------------------------- plan ---
def plan(d):
    """12 weeks × 7 days. Days 1–6 of a week are study days, day 7 is the weekly
    check. Each phase (4 weeks = 24 study days) walks its 8 dictation sets three
    days each (dictate → shadow → faster re-listen) and its 12 speaking prompts
    twice each (4/3/2 first, AI follow-up the second time: task repetition)."""
    by_phase = lambda xs, p: [x for x in xs if x["phase"] == p]
    res = {c["category"]: c["items"] for c in d["resources"]}
    intensive, extensive = res.get("intensive", []), res.get("extensive", [])
    lessons = [("cs", g) for g in d["connected"]] + [("p", g) for g in d["pron"]]
    days, study_n = [], 0
    for w in range(1, WEEKS + 1):
        p = (w - 1) // 4 + 1
        sets = by_phase(d["dictation"], p)
        prompts = [s for s in d["speaking"] if s["phase"] == p]
        decks = [c["id"] for c in d["chunks"] if c["phase"] <= p]
        for dow in range(1, 8):
            n = (w - 1) * 7 + dow
            if dow == 7:
                wk_sets = sets[((w - 1) % 4) * 2:((w - 1) % 4) * 2 + 2]
                tasks = [
                    dict(k="bench-dict", m=10, t="周测 · 听写",
                         d="把本周练过的两组句子用「测验」模式各做一遍：不看提示，只听两遍。分数会记下来，用来看每周的变化。",
                         links=[dict(href=f"/english/listen/?set={s['id']}&mode=test", label=f"测验：{s['title']}") for s in wk_sets]),
                    dict(k="bench-speak", m=5, t="周测 · 基准录音",
                         d="同一个问题每周录一次 2 分钟（Tell me about yourself and what you're working on right now），录音只存在你的浏览器里。和第 1 周的录音对比着听，最能看出口语进步。",
                         links=[dict(href="/english/speak/?p=bench&mode=bench", label="去录音")]),
                    dict(k="reflect", m=5, t="周记：这周卡在哪",
                         d="写三行：这周最常听不出的是哪类音（看听写里红色的词）；说的时候最常卡在哪；下周想多练什么。",
                         links=[dict(href="/english/#journal", label="写在本页下方的周记里")]),
                ]
                days.append(dict(n=n, w=w, p=p, review=True, tasks=tasks))
                continue
            k = study_n % 24  # position inside the phase
            tasks = []
            if p == 1 and study_n < len(lessons):
                kind, g = lessons[study_n]
                tasks.append(dict(k="lesson", m=8, t=f"微课 · {g['title']}",
                                  d="读一遍讲解，每个例子先听再跟读三遍；发音课最后做一轮听辨。",
                                  links=[dict(href=f"/english/sounds/#{g['id']}", label="打开微课")]))
            if sets:
                s = sets[(k // 3) % len(sets)]
                mode = ["dictate", "shadow", "speed"][k % 3]
                desc = {
                    "dictate": "逐句听写：每句最多听三遍再提交，对照答案看红色的词——那就是你的耳朵还没「解码」的地方，读一下每句的提示。",
                    "shadow": "同一组句子跟读：先听，再录下你跟读的版本，两个连着播放对比。注意重音、连读和语调，而不是逐个单词。",
                    "speed": "同一组句子 1.25 倍速再听写一遍。前两天的努力在这一天兑现：能在更快的速度下听出来，才是真的会了。",
                }[mode]
                label = {"dictate": "听写", "shadow": "跟读", "speed": "提速听写"}[mode]
                tasks.append(dict(k="dict", m=12, t=f"精听 · {label}：{s['title']}（{s['accent']}）", d=desc,
                                  links=[dict(href=f"/english/listen/?set={s['id']}&mode={mode}", label=f"开始{label}")]))
            pool = [r for i in EXT_BY_PHASE[p] for r in intensive if r["id"] == i] or intensive
            if pool:
                r = pool[k % len(pool)]
                tasks.append(dict(k="ext", m=10, t=f"真实材料精听 · {r['name']}",
                                  d="选一段 2–3 分钟：① 不看文稿听一遍，说出大意；② 看文稿，标出没听出来的地方；③ 再听两遍；④ 跟着音频读其中一分钟。",
                                  links=[dict(href=r["url"], label="打开", ext=True)]))
            if prompts:
                s = prompts[(k // 2) % len(prompts)]
                first = k % 2 == 0
                mode = "432" if first else "ai"
                desc = ("4/3/2：同一个话题连讲三遍，限时 4 分钟、3 分钟、2 分钟。每遍讲同样多的内容，逼自己越讲越顺；第三遍录音回听。"
                        if first else
                        "同一个话题第二次：把页面上的提示词复制给 AI 语音（ChatGPT / Claude / Gemini 的语音模式），让它扮演对方追问 5 轮，最后请它指出你说错和说得不地道的地方。")
                tasks.append(dict(k="speak", m=12, t=f"口语 · {s['title']}", d=desc,
                                  links=[dict(href=f"/english/speak/?p={s['id']}&mode={mode}", label="开始")]))
            tasks.append(dict(k="phrases", m=5, t="表达复习",
                              d="间隔重复：看中文，先大声说出英文，再翻开对照。算法会把快忘的排在前面。",
                              links=[dict(href="/english/phrases/", label="开始复习")]))
            if extensive:
                r = extensive[study_n % len(extensive)]
                tasks.append(dict(k="commute", m=0, opt=True, t=f"选做 · 通勤泛听：{r['name']}",
                                  d="不求全懂，只要跟得上大意。听不懂就放过，量比精度重要。", links=[dict(href=r["url"], label="打开", ext=True)]))
            days.append(dict(n=n, w=w, p=p, review=False, tasks=tasks))
            study_n += 1
    return days


# --------------------------------------------------------------- pages ---
SUBNAV = [("/english/", "今日"), ("/english/listen/", "精听"), ("/english/speak/", "口语"), ("/english/phrases/", "表达"),
          ("/english/sounds/", "发音"), ("/english/resources/", "资源"), ("/english/method/", "方法")]
PAGES = [
    # path, title, description, page source, script
    ("", "英语：听力与口语 12 周", "为在新加坡工作的中文母语工程师设计的 12 周英语听说课程：每天 40 分钟的精听听写、跟读、口语输出和表达复习，配上经过校验的多口音音频。", "index.html", "today.js"),
    ("listen", "精听：听写与跟读", "逐句听写和跟读：美、英、澳、印、新加坡口音的工作场景句子，自动比对，标出没听出的词。", "listen.html", "listen.js"),
    ("speak", "口语：4/3/2 与 AI 陪练", "口语输出练习：4/3/2 限时复述、录音回听、AI 语音陪练提示词、每周基准录音。", "speak.html", "speak.js"),
    ("phrases", "表达：间隔重复", "工作和面试中最常用的英语表达，用 FSRS 间隔重复记住，看中文、说英文。", "phrases.html", "phrases.js"),
    ("sounds", "发音与连读", "中文母语者最容易听错、说错的音：连读、弱读、吞音、闪音，以及十组最小对立词。", "sounds.html", "sounds.js"),
    ("resources", "外部资源", "经过核实的成熟英语学习工具：精听材料、泛听播客、AI 口语陪练、发音工具、真人老师和免费测试。", "resources.html", "resources.js"),
    ("method", "学习方法与依据", "这套课程为什么这样安排：听力是解码问题、口语靠自动化和语块；每天怎么练、12 周怎么推进、音频怎么校验。", "method.html", "method.js"),
]

LAYOUT = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} · 英语 · lonX</title>
<meta name="description" content="{desc}" />
<meta name="color-scheme" content="dark" />
<meta name="theme-color" content="#0b0d12" />
<link rel="canonical" href="https://lonloop.com/english/{path}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="lonX" />
<meta property="og:title" content="{title} · 英语 · lonX" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="https://lonloop.com/english/{path}" />
<meta property="og:image" content="https://lonloop.com/og.png" />
<meta property="og:locale" content="zh_CN" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="en-data" content="/english/data/course.json?v={dv}" />
<link rel="stylesheet" href="/english/assets/en.css?v={cv}" />
</head>
<body>
  <nav class="topnav">
    <a class="brand" href="/">lonX<span class="dot">.</span></a>
    <div class="tabs">
      <a href="/" class="tab">主页</a>
      <a href="/collection/" class="tab">收藏夹</a>
      <a href="/radar/" class="tab">雷达</a>
      <a href="/travel/" class="tab">旅行</a>
      <a href="/japanese/" class="tab">日语</a>
      <a href="/english/" class="tab" aria-current="{cur}">英语</a>
    </div>
  </nav>
  <nav class="subnav" aria-label="英语板块">
{subnav}
  </nav>
  <main class="en">
{body}
  </main>
  <footer class="site-foot">
    <span>© <span id="y"></span> lonX · Built with Claude Code</span>
    <span><a href="/english/method/">方法与校验</a> · <a href="/english/resources/">外部资源</a></span>
    <span class="lic">音频由 Microsoft 神经网络语音合成（edge-tts），每条都经过 Whisper 反向听写校验后才发布；练习记录和录音只保存在你自己的浏览器里，不会上传。</span>
  </footer>
  <noscript><p class="en">这一板块的练习需要 JavaScript。</p></noscript>
  <script type="module" src="/english/assets/{script}?v={sv}"></script>
  <script>document.getElementById('y').textContent = new Date().getFullYear();</script>
</body>
</html>
"""


def write_assets(data):
    """Version every asset by content; rewrite module imports so a page never
    pairs a new script with a stale cached dependency."""
    adir = os.path.join(OUT, "assets")
    ver = {}
    vendor = os.path.join(OUT, "vendor", "fsrs-6.0.0.min.mjs")
    ver["fsrs"] = h(open(vendor, "rb").read())
    en_js = open(os.path.join(adir, "en.js"), encoding="utf-8").read()
    ver["en.js"] = h(en_js)
    for f in os.listdir(adir):
        if not f.endswith(".js") or f == "en.js":
            continue
        p = os.path.join(adir, f)
        s = open(p, encoding="utf-8").read()
        s = re.sub(r"(from '\./en\.js)(\?v=[0-9a-f]+)?'", rf"\1?v={ver['en.js']}'", s)
        s = re.sub(r"(from '/english/vendor/fsrs-6\.0\.0\.min\.mjs)(\?v=[0-9a-f]+)?'", rf"\1?v={ver['fsrs']}'", s)
        open(p, "w", encoding="utf-8").write(s)
        ver[f] = h(s)
    ver["css"] = h(open(os.path.join(adir, "en.css"), "rb").read())
    ddir = os.path.join(OUT, "data")
    os.makedirs(ddir, exist_ok=True)
    blob = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    open(os.path.join(ddir, "course.json"), "w", encoding="utf-8").write(blob)
    ver["data"] = h(blob)
    return ver


def write_pages(ver):
    for path, title, desc, src, script in PAGES:
        body = open(os.path.join(PAGES_SRC, src), encoding="utf-8").read().rstrip()
        url = "/english/" + (path + "/" if path else "")
        sub = "\n".join(f'    <a href="{u}"{" aria-current=\"page\"" if u == url else ""}>{t}</a>' for u, t in SUBNAV)
        html = LAYOUT.format(title=title, desc=desc, path=(path + "/" if path else ""), dv=ver["data"], cv=ver["css"],
                             cur="page" if not path else "true", subnav=sub, body=body, script=script, sv=ver[script])
        d = os.path.join(OUT, path)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html)


def main():
    content = load_content()
    resources = yaml.safe_load(open(os.path.join(HERE, "resources.yaml"), encoding="utf-8"))
    report = json.load(open(os.path.join(HERE, "reports", "verify.json")))
    items = all_items(content)
    files = publish_audio(items, report)
    data = course(content, resources, files, report)
    # a word that passed in the voice its pair did not use is never played
    used = set(re.findall(r'"a": ?"([^"]+\.mp3)"', json.dumps(data)))
    adir = os.path.join(OUT, "audio")
    for f in os.listdir(adir):
        if f not in used:
            os.remove(os.path.join(adir, f))
    files = {k: v for k, v in files.items() if v in used}
    ver = write_assets(data)
    write_pages(ver)
    print(f"audio {len(files)} · dictation sets {len(data['dictation'])} · chunks {sum(len(c['items']) for c in data['chunks'])}"
          f" · plan days {len(data['plan'])} · failed {len(data['stats']['failed'])}")


if __name__ == "__main__":
    main()
