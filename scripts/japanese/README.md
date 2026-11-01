# /japanese/ 生成管线

`japanese/` 下的页面、音频和数据都由这里的脚本生成，**不要手改生成结果**——改 `content.yaml`、`kana.py` 或 `templates/` 后重新生成。

```bash
# 依赖：Python 3.12 venv（edge-tts mlx-whisper fugashi[unidic-lite] praat-parselmouth
#       transformers torch librosa jinja2 pyyaml jaconv pykakasi matplotlib opencc scipy）
#       以及 poppler 的 pdftotext（解析《常用漢字表》PDF）
# 原始数据（KanjiVG、animCJK、Kanjium、维基词典缓存，以及阶段 1 的 KANJIDIC2、常用漢字表、
# JmdictFurigana、Unihan、Waller 清单）放在 JA_RAW（默认 ~/.agents/workspace/japanese/raw）
python n5data.py fetch       # 阶段 1 原始数据（只需一次；已存在的文件不重复下载）
python n5data.py check       # 阶段 1 内容检查 → reports/n5_checks.json（活用形、例句、汉字）
python gen_audio.py          # 两种声音合成全部条目（缓存在 JA_CACHE，仓库外）
python verify.py 0/3 & python verify.py 1/3 & python verify.py 2/3; wait
python verify.py merge 3     # 合并校验结果 → reports/verify.json
python gen_audio.py          # 第二轮：只为没通过的阶段 1 音频合成假名输入版（-kv）
python verify.py 0/3 & python verify.py 1/3 & python verify.py 2/3; wait
python verify.py merge 3
python verify.py reevaluate  # 判定规则变了而测量没变时，只重算通过与否
# 只为上面两种声音都没通过、也没有真人录音的单假名补缺（VOICEVOX，本地引擎）：
#   <引擎目录>/run --host 127.0.0.1 --port 50021 &      # VOICEVOX Engine 0.26.0
python voicevox.py synth     # 目标假名 × 两个声音 × 三种输入（缓存在 VV_DIR，仓库外）
python voicevox.py verify    # 引擎音拍 + 信号 + 音素 + Whisper 全部通过才算 → reports/voicevox.json
python build.py              # 选出通过校验的条目，生成页面 + 复制音频
```

| 文件 | 作用 |
|---|---|
| `content.yaml` | 全部例词、同音词组、寒暄、数字、例句（每个位置可列多个候选，第一个通过校验的上线） |
| `kana.py` | 假名表、罗马字、输入法拼法、IPA、字源（三方核对，诸说如实标注） |
| `dictcheck.py` | 声调：UniDic × Kanjium 交叉核对，英文维基词典做第三票 |
| `verify.py` | 信号检查 / Whisper 反向听写 / 音素识别 / 音高测量（只记录，不作门槛） |
| `pitch.py` `review_plots.py` | 音高提取与 CTC 强制对齐；第 7 课人工核验用的叠加曲线图 |
| `reports/verify.json` | 每条音频的全部测量结果（校验报告页由它生成） |
| `voicevox.py` | VOICEVOX 补缺：选声音（`speakers` / `screen`）、合成、更严格的校验；声音、署名与条款写在文件开头 |
| `reports/voicevox.json` | VOICEVOX 每条合成的全部测量结果与选声音的筛选数据（build.py 只发布通过的） |
| `reports/manual_pitch.json` | 第 7 课示范音频的人工声调核验记录 |
| `build.py` `templates/` | 页面生成 |
| `content_n5.yaml` | 阶段 1（初级上·N5）的动词、形容词、例句、汉字释义与例词（手写；全部经 `n5data.py` 检查） |
| `n5data.py` | 阶段 1 的生成与检查：活用形按规则生成后用 UniDic 反向分析；例句读音对 UniDic；词汇对 Waller N5 词表；汉字读音 KANJIDIC2 × 常用漢字表（PDF，另与日文维基百科逐字比对）；例词经 JmdictFurigana 分到单字；笔画数三源、笔顺两源；简体对照 OpenCC × Unihan |
| `build_n5.py` | 阶段 1 页面数据（只取通过检查的条目）、练习页 N5 卡组、校验报告的阶段 1 数据 |
| `reports/n5_checks.json` | 阶段 1 每条内容检查的结果（校验报告页由它生成） |
| `reports/codex_n5.json` | 阶段 1 文字的独立模型（Codex）审校意见与处理记录 |

阶段 1 的音频（`n5word` `n5form` `n5sent` `n5phrase`）在 verify.py 里多两步：例句按 UniDic 的**发音**比对（助词は按わ）；
转写允许多种读法时（如「降りません」= おりません／ふりません，「3日」= みっか／さんにち），用 wav2vec2 做 CTC 强制对齐，
比较音频对预期读法和每个有词典依据的候选读法（JMdict 收录的词形/读音组合）的对数似然，预期读法须领先 ≥ 1（`CTC_MARGIN`）；
含助词は／へ的句子同样比较 wa／e 与 ha／he。每个音素按其可接受实现集合打分（与单假名音素检查共用 `CLS`/`VCLS`）。
规则见 `verify.py` 的 stage 1 一节，`n5_decide()` 决定通过与否（`reevaluate` 可在不重跑模型的情况下按新阈值重算）。

为什么音高测量不作门槛：和两部词典对比，自动判定的吻合率只有约 66%（合成语音的音高峰值常延后到下一拍），
不足以决定发布与否。第 7 课的示范音频改为人工逐组核验，见 `reports/manual_pitch.json` 与 /japanese/verification/。
