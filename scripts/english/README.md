# /english/ 生成管线

`english/` 下的页面、`data/course.json` 和 `audio/` 都由这里的脚本生成。**不要手改生成结果**：改 `content.yaml`、`resources.yaml`、`pages/` 或 `english/assets/*.js|css` 后重新跑 `build.py`。（`english/assets/` 里的 JS/CSS 是源文件，build.py 只会改写其中 import 的 `?v=` 版本号。）

```bash
# 依赖：Python 3.12 venv（edge-tts mlx-whisper pyyaml num2words）+ ffmpeg
#   uv venv ~/.agents/workspace/english/venv && uv pip install --python ~/.agents/workspace/english/venv/bin/python edge-tts mlx-whisper pyyaml num2words
PY=~/.agents/workspace/english/venv/bin/python
$PY gen_audio.py      # 合成全部条目（缓存在 EN_CACHE，默认 ~/.agents/workspace/english/audio-cache，仓库外）
$PY verify.py         # 信号检查 + Whisper 反向听写 → reports/verify.json（没变的条目不重跑）
$PY build.py          # 只发布通过校验的音频；生成 course.json、12 周计划和全部页面
```

| 文件 | 作用 |
|---|---|
| `content.yaml` | 听写句子（24 组）、表达（12 组）、最小对立词（10 组）、连读微课（8 节）、口语话题（36 个） |
| `resources.yaml` | 外部资源：每条都实际打开核实过，带核实日期 |
| `items.py` | 从 content.yaml 展开出每一条要合成的音频（文本 × 声音 × 语速） |
| `gen_audio.py` | edge-tts 合成，裁静音、峰值归一化 |
| `verify.py` | 校验：非静音；Whisper large-v3-turbo 转写，归一化后须与原文逐词一致，不一致再用 large-v3 复核 |
| `reports/verify.json` | 每条音频的转写与结论（方法页的统计由它生成） |
| `reports/manual_accept.json` | 人工判定放行的条目：只限同音词（write/right）和数字写法（one forty/140），每条写理由，绑定音频 key，音频一变就失效 |
| `build.py` | 计划生成（12 周 × 7 天）、页面布局、资源版本号 |
| `pages/` | 各页面的正文（布局、导航、页脚在 build.py 的 LAYOUT 里） |

为什么听写必须逐词一致：听写按答案逐词打分，音频说的和答案差一个词，学习者听对了也会被判错。
