"""Kana master data for /japanese/.

Everything a lesson page says about a kana — romaji, what to type on an IME, IPA,
the kanji it came from, its strokes — is defined or derived here, once, and every
page is rendered from it. Hand-copying a 104-cell table into ten pages is how a
site ends up teaching two different romanizations for じ.

Sources (each claim is re-checked by verify_kana.py, results in reports/kana.json):
  * romaji      modified Hepburn (修正ヘボン式); cross-checked against pykakasi
  * typing      what a Japanese IME accepts (訓令式 spellings work too)
  * ipa         broad transcription after Okada (1999, Handbook of the IPA) and
                Vance (2008); allophony notes live in the lesson prose
  * origin      字源: three sources must agree — en.wiktionary, ja.wiktionary and
                the Wikimedia Commons origin charts used by both Wikipedias
                (Hiragana_origin_new.svg / Katakana_origin_new.svg); katakana
                ア–ト are also checked against Sanseido 大辞林's 片仮名漢字対応
                table. Disagreements are published as 诸说, not resolved silently.
                (与/與, 曽/曾, 祢/禰 are one character in two glyph forms.)
  * strokes     KanjiVG (CC BY-SA 3.0); stroke counts cross-checked against the
                independent animCJK data set (all 151 glyphs agree).
"""

# --- 清音 (46). Rows are the 五十音図 order; None = empty cell in the grid.
SEION_ROWS = [
    ("あ行", ["あ", "い", "う", "え", "お"]),
    ("か行", ["か", "き", "く", "け", "こ"]),
    ("さ行", ["さ", "し", "す", "せ", "そ"]),
    ("た行", ["た", "ち", "つ", "て", "と"]),
    ("な行", ["な", "に", "ぬ", "ね", "の"]),
    ("は行", ["は", "ひ", "ふ", "へ", "ほ"]),
    ("ま行", ["ま", "み", "む", "め", "も"]),
    ("や行", ["や", None, "ゆ", None, "よ"]),
    ("ら行", ["ら", "り", "る", "れ", "ろ"]),
    ("わ行", ["わ", None, None, None, "を"]),
    ("ん", ["ん", None, None, None, None]),
]
DAKUON_ROWS = [
    ("が行", ["が", "ぎ", "ぐ", "げ", "ご"]),
    ("ざ行", ["ざ", "じ", "ず", "ぜ", "ぞ"]),
    ("だ行", ["だ", "ぢ", "づ", "で", "ど"]),
    ("ば行", ["ば", "び", "ぶ", "べ", "ぼ"]),
    ("ぱ行", ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]),
]
YOUON_ROWS = [
    ("き", ["きゃ", "きゅ", "きょ"]),
    ("し", ["しゃ", "しゅ", "しょ"]),
    ("ち", ["ちゃ", "ちゅ", "ちょ"]),
    ("に", ["にゃ", "にゅ", "にょ"]),
    ("ひ", ["ひゃ", "ひゅ", "ひょ"]),
    ("み", ["みゃ", "みゅ", "みょ"]),
    ("り", ["りゃ", "りゅ", "りょ"]),
    ("ぎ", ["ぎゃ", "ぎゅ", "ぎょ"]),
    ("じ", ["じゃ", "じゅ", "じょ"]),
    ("び", ["びゃ", "びゅ", "びょ"]),
    ("ぴ", ["ぴゃ", "ぴゅ", "ぴょ"]),
]

# kana -> (hepburn, typing, ipa). typing lists what to type, first = shortest.
SOUNDS = {
    "あ": ("a", "a", "a"), "い": ("i", "i", "i"), "う": ("u", "u", "ɯ"), "え": ("e", "e", "e"), "お": ("o", "o", "o"),
    "か": ("ka", "ka", "ka"), "き": ("ki", "ki", "kʲi"), "く": ("ku", "ku", "kɯ"), "け": ("ke", "ke", "ke"), "こ": ("ko", "ko", "ko"),
    "さ": ("sa", "sa", "sa"), "し": ("shi", "si / shi", "ɕi"), "す": ("su", "su", "sɯ"), "せ": ("se", "se", "se"), "そ": ("so", "so", "so"),
    "た": ("ta", "ta", "ta"), "ち": ("chi", "ti / chi", "tɕi"), "つ": ("tsu", "tu / tsu", "tsɯ"), "て": ("te", "te", "te"), "と": ("to", "to", "to"),
    "な": ("na", "na", "na"), "に": ("ni", "ni", "ɲi"), "ぬ": ("nu", "nu", "nɯ"), "ね": ("ne", "ne", "ne"), "の": ("no", "no", "no"),
    "は": ("ha", "ha", "ha"), "ひ": ("hi", "hi", "çi"), "ふ": ("fu", "hu / fu", "ɸɯ"), "へ": ("he", "he", "he"), "ほ": ("ho", "ho", "ho"),
    "ま": ("ma", "ma", "ma"), "み": ("mi", "mi", "mʲi"), "む": ("mu", "mu", "mɯ"), "め": ("me", "me", "me"), "も": ("mo", "mo", "mo"),
    "や": ("ya", "ya", "ja"), "ゆ": ("yu", "yu", "jɯ"), "よ": ("yo", "yo", "jo"),
    "ら": ("ra", "ra", "ɾa"), "り": ("ri", "ri", "ɾʲi"), "る": ("ru", "ru", "ɾɯ"), "れ": ("re", "re", "ɾe"), "ろ": ("ro", "ro", "ɾo"),
    "わ": ("wa", "wa", "ɰa"), "を": ("o", "wo", "o"), "ん": ("n", "nn", "ɴ"),
    "が": ("ga", "ga", "ɡa"), "ぎ": ("gi", "gi", "ɡʲi"), "ぐ": ("gu", "gu", "ɡɯ"), "げ": ("ge", "ge", "ɡe"), "ご": ("go", "go", "ɡo"),
    "ざ": ("za", "za", "dza ~ za"), "じ": ("ji", "zi / ji", "dʑi ~ ʑi"), "ず": ("zu", "zu", "dzɯ ~ zɯ"), "ぜ": ("ze", "ze", "dze ~ ze"), "ぞ": ("zo", "zo", "dzo ~ zo"),
    "だ": ("da", "da", "da"), "ぢ": ("ji", "di", "dʑi ~ ʑi"), "づ": ("zu", "du", "dzɯ ~ zɯ"), "で": ("de", "de", "de"), "ど": ("do", "do", "do"),
    "ば": ("ba", "ba", "ba"), "び": ("bi", "bi", "bʲi"), "ぶ": ("bu", "bu", "bɯ"), "べ": ("be", "be", "be"), "ぼ": ("bo", "bo", "bo"),
    "ぱ": ("pa", "pa", "pa"), "ぴ": ("pi", "pi", "pʲi"), "ぷ": ("pu", "pu", "pɯ"), "ぺ": ("pe", "pe", "pe"), "ぽ": ("po", "po", "po"),
    "きゃ": ("kya", "kya", "kʲa"), "きゅ": ("kyu", "kyu", "kʲɯ"), "きょ": ("kyo", "kyo", "kʲo"),
    "しゃ": ("sha", "sya / sha", "ɕa"), "しゅ": ("shu", "syu / shu", "ɕɯ"), "しょ": ("sho", "syo / sho", "ɕo"),
    "ちゃ": ("cha", "tya / cha", "tɕa"), "ちゅ": ("chu", "tyu / chu", "tɕɯ"), "ちょ": ("cho", "tyo / cho", "tɕo"),
    "にゃ": ("nya", "nya", "ɲa"), "にゅ": ("nyu", "nyu", "ɲɯ"), "にょ": ("nyo", "nyo", "ɲo"),
    "ひゃ": ("hya", "hya", "ça"), "ひゅ": ("hyu", "hyu", "çɯ"), "ひょ": ("hyo", "hyo", "ço"),
    "みゃ": ("mya", "mya", "mʲa"), "みゅ": ("myu", "myu", "mʲɯ"), "みょ": ("myo", "myo", "mʲo"),
    "りゃ": ("rya", "rya", "ɾʲa"), "りゅ": ("ryu", "ryu", "ɾʲɯ"), "りょ": ("ryo", "ryo", "ɾʲo"),
    "ぎゃ": ("gya", "gya", "ɡʲa"), "ぎゅ": ("gyu", "gyu", "ɡʲɯ"), "ぎょ": ("gyo", "gyo", "ɡʲo"),
    "じゃ": ("ja", "zya / ja", "dʑa ~ ʑa"), "じゅ": ("ju", "zyu / ju", "dʑɯ ~ ʑɯ"), "じょ": ("jo", "zyo / jo", "dʑo ~ ʑo"),
    "びゃ": ("bya", "bya", "bʲa"), "びゅ": ("byu", "byu", "bʲɯ"), "びょ": ("byo", "byo", "bʲo"),
    "ぴゃ": ("pya", "pya", "pʲa"), "ぴゅ": ("pyu", "pyu", "pʲɯ"), "ぴょ": ("pyo", "pyo", "pʲo"),
}

# 外来語の表記 (平成3年内閣告示第2号). Table 1 = 一般的に用いる仮名; table 2 = used
# "when one wants to write closer to the original sound". Only the combinations a
# beginner meets often are taught; the full tables are linked from the lesson.
EXTENDED = [
    # (katakana, hepburn, typing, ipa, table, example, example meaning)
    ("シェ", "she", "she / sye", "ɕe", 1, "シェフ", "厨师（chef）"),
    ("ジェ", "je", "je / zye", "dʑe", 1, "ジェット", "喷气式（jet）"),
    ("チェ", "che", "che / tye", "tɕe", 1, "チェック", "检查（check）"),
    ("ティ", "ti", "thi", "ti", 1, "パーティー", "派对（party）"),
    ("ディ", "di", "dhi", "di", 1, "ディズニー", "迪士尼（Disney）"),
    ("デュ", "dyu", "dhu", "dʲɯ", 1, "デュエット", "二重唱（duet）"),
    ("ファ", "fa", "fa", "ɸa", 1, "ファイル", "文件（file）"),
    ("フィ", "fi", "fi", "ɸʲi", 1, "フィルム", "胶片（film）"),
    ("フェ", "fe", "fe", "ɸe", 1, "カフェ", "咖啡馆（café）"),
    ("フォ", "fo", "fo", "ɸo", 1, "フォーク", "叉子（fork）"),
    ("ツァ", "tsa", "tsa", "tsa", 1, "モーツァルト", "莫扎特（Mozart）"),
    ("ウィ", "wi", "whi / wi", "ɰi", 2, "ウィキペディア", "维基百科（Wikipedia）"),
    ("ウェ", "we", "whe / we", "ɰe", 2, "ウェブ", "网络（web）"),
    ("ウォ", "wo", "who", "ɰo", 2, "ウォッチ", "手表（watch）"),
    ("トゥ", "tu", "twu", "tɯ", 2, "タトゥー", "文身（tattoo）"),
    ("ヴ", "vu", "vu", "bɯ", 2, "ヴァイオリン", "小提琴（violin；也写作バイオリン）"),
]

# 字源. "h" = hiragana source, "k" = katakana source; "alt" lists competing
# theories that a reputable source records, and "note" says who records them.
ORIGINS = {
    "あ": "安", "い": "以", "う": "宇", "え": "衣", "お": "於",
    "か": "加", "き": "幾", "く": "久", "け": "計", "こ": "己",
    "さ": "左", "し": "之", "す": "寸", "せ": "世", "そ": "曽",
    "た": "太", "ち": "知", "つ": "川", "て": "天", "と": "止",
    "な": "奈", "に": "仁", "ぬ": "奴", "ね": "祢", "の": "乃",
    "は": "波", "ひ": "比", "ふ": "不", "へ": "部", "ほ": "保",
    "ま": "末", "み": "美", "む": "武", "め": "女", "も": "毛",
    "や": "也", "ゆ": "由", "よ": "与",
    "ら": "良", "り": "利", "る": "留", "れ": "礼", "ろ": "呂",
    "わ": "和", "を": "遠", "ん": "无",
    "ア": "阿", "イ": "伊", "ウ": "宇", "エ": "江", "オ": "於",
    "カ": "加", "キ": "幾", "ク": "久", "ケ": "介", "コ": "己",
    "サ": "散", "シ": "之", "ス": "須", "セ": "世", "ソ": "曽",
    "タ": "多", "チ": "千", "ツ": "州", "テ": "天", "ト": "止",
    "ナ": "奈", "ニ": "二", "ヌ": "奴", "ネ": "祢", "ノ": "乃",
    "ハ": "八", "ヒ": "比", "フ": "不", "ヘ": "部", "ホ": "保",
    "マ": "末", "ミ": "三", "ム": "牟", "メ": "女", "モ": "毛",
    "ヤ": "也", "ユ": "由", "ヨ": "与",
    "ラ": "良", "リ": "利", "ル": "流", "レ": "礼", "ロ": "呂",
    "ワ": "和", "ヲ": "乎", "ン": "尓",
}
# How the kana was formed from the source character.
ORIGIN_HOW = {"h": "整字草书化", "k": "取字的一部分"}
# Competing theories, published as 诸说. Keys must exist in ORIGINS.
ORIGIN_DISPUTES = {
    "つ": ("川 / 州", "字源有争议：维基百科字源图与日文维基词典作「川」（后者并列「州」），日文维基百科正文另列「鬥」等说。"),
    "ツ": ("州 / 川", "字源有争议：三省堂《大辞林》对照表作「州」，日文维基词典作「川」，另有「津」「門」等说。"),
    "ニ": ("二 / 仁", "维基百科字源图与日文维基词典作「二」，英文维基词典作「仁」，两说并存。"),
    "ノ": ("乃 / 及", "维基百科字源图与英文维基词典作「乃」，日文维基词典作「及」的一部分，两说并存。"),
    "マ": ("末 / 万", "通常说作「末」的前两画，也有「万」之说。"),
    "ン": ("尓？", "字源不明：维基百科字源图作「尓」，维基词典并列「尓」的上部、表示拨音的符号等说。"),
    "キ": ("幾", "一说是平假名「き」的变形。"),
    "ケ": ("介", "另有「个」（「箇」的异体字）之说。"),
}

SMALL = set("ゃゅょぁぃぅぇぉャュョァィゥェォ")


def to_katakana(s):
    return "".join(chr(ord(c) + 0x60) if "ぁ" <= c <= "ゖ" else c for c in s)


def to_hiragana(s):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)


def morae(reading):
    """Split a kana string into morae: small ゃゅょ/ぁぃぅぇぉ join the previous
    kana; っ, ん and ー are morae of their own (that is what makes them 特殊拍)."""
    out = []
    for c in reading:
        if c in SMALL and out:
            out[-1] += c
        elif c in " 　":
            continue
        else:
            out.append(c)
    return out


def hl_pattern(n, accent):
    """Tokyo-dialect H/L pattern for an n-mora word with accent type `accent`
    (0 = 平板, 1 = 頭高, n = 尾高, otherwise 中高), plus the following particle.
    Returns (word_levels, particle_level) with 'H'/'L'."""
    if accent == 0:
        word = ["L"] + ["H"] * (n - 1) if n > 1 else ["L"]
        return word, "H"
    if accent == 1:
        return ["H"] + ["L"] * (n - 1), "L"
    word = ["L"] + ["H"] * (accent - 1) + ["L"] * (n - accent)
    return word, "L"


def accent_type_name(n, accent):
    if accent == 0:
        return "平板型"
    if accent == 1:
        return "头高型"
    if accent == n:
        return "尾高型"
    return "中高型"


def all_basic_kana():
    seion = [k for _, row in SEION_ROWS for k in row if k]
    dakuon = [k for _, row in DAKUON_ROWS for k in row if k]
    youon = [k for _, row in YOUON_ROWS for k in row]
    return seion, dakuon, youon
