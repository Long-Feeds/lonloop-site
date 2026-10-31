# /japanese/ 生成管线

`japanese/` 下的页面、音频和数据都由这里的脚本生成，**不要手改生成结果**——改 `content.yaml`、`kana.py` 或 `templates/` 后重新生成。

```bash
# 依赖：Python 3.12 venv（edge-tts mlx-whisper fugashi[unidic-lite] praat-parselmouth
#       transformers torch librosa jinja2 pyyaml jaconv pykakasi matplotlib）
# 原始数据（KanjiVG、Kanjium、维基词典缓存）放在 JA_RAW（默认 ~/.agents/workspace/japanese/raw）
python gen_audio.py          # 两种声音合成全部条目（缓存在 JA_CACHE，仓库外）
python verify.py 0/3 & python verify.py 1/3 & python verify.py 2/3; wait
python verify.py merge 3     # 合并校验结果 → reports/verify.json
python verify.py reevaluate  # 判定规则变了而测量没变时，只重算通过与否
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
| `reports/manual_pitch.json` | 第 7 课示范音频的人工声调核验记录 |
| `build.py` `templates/` | 页面生成 |

为什么音高测量不作门槛：和两部词典对比，自动判定的吻合率只有约 66%（合成语音的音高峰值常延后到下一拍），
不足以决定发布与否。第 7 课的示范音频改为人工逐组核验，见 `reports/manual_pitch.json` 与 /japanese/verification/。
