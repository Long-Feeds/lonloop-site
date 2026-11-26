/* 精听：逐句听写（自动比对）与跟读（录音对比）。 */
import { $, $$, esc, load, save, data, play, stop, rate, bindRate, duration, compare, renderCompare,
  Recorder, playUrl, logActivity, linkIs, toast } from './en.js?v=3bf6cc3c';

const D = await data();
const SETS = D.dictation;
const FOCUS = { 'weak-form': '弱读', linking: '连读', elision: '吞音', 'flap-t': '闪音 t', contraction: '缩约', gonna: 'gonna 类缩读',
  'can-cant': 'can / can\'t', numbers: '数字', 'phrasal-verb': '短语动词', idiom: '习语', stress: '重音', 'h-dropping': 'h 脱落',
  yod: 'did you 类融合', 'glottal-t': '喉塞 t' };
const MODE_ZH = { dictate: '听写', shadow: '跟读', speed: '提速听写', test: '测验' };
const PHASE_ZH = ['', '阶段 1 · 清晰常速', '阶段 2 · 提速与多口音', '阶段 3 · 会议与面试'];

const q = new URLSearchParams(location.search);
let mode = MODE_ZH[q.get('mode')] ? q.get('mode') : load('listen.mode', 'dictate');
let S = null; // session
let auto = 0; // pending autoplay timeout

bindRate();
syncModes();
renderSets();
if (q.get('set')) { const s = SETS.find((x) => x.id === q.get('set')); if (s) begin(s); }

function syncModes() { $$('#modes button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode))); }
$('#modes').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  mode = b.dataset.mode; save('listen.mode', mode); syncModes();
  if (S) begin(S.set);
});

function renderSets() {
  const sc = load('listen.scores', {});
  let html = '';
  for (const p of [1, 2, 3]) {
    const xs = SETS.filter((s) => s.phase === p);
    if (!xs.length) continue;
    html += `<h3 style="font-size:15px;color:var(--muted);margin:14px 0 6px">${PHASE_ZH[p]}</h3><div class="setlist">` + xs.map((s) => {
      const r = sc[s.id];
      return `<button type="button" data-set="${esc(s.id)}">${r && r.last != null ? `<span class="sc">${Math.round(r.last * 100)}%</span>` : ''}${esc(s.title)}<small>${esc(s.accent)} · ${esc(s.voice)} · ${s.items.length} 句${s.rate !== '+0%' ? ' · 语速 ' + esc(s.rate) : ''}</small></button>`;
    }).join('') + '</div>';
  }
  $('#sets').innerHTML = html;
}
$('#sets').addEventListener('click', (e) => { const b = e.target.closest('[data-set]'); if (b) begin(SETS.find((s) => s.id === b.dataset.set)); });
$('#back').addEventListener('click', () => {
  teardown(); S = null;
  $('#work').hidden = true; $('#summary').hidden = true; $('#pick').hidden = false; renderSets();
  history.replaceState(null, '', location.pathname);
});

/* everything that can outlive a screen: audio, autoplay, the mic, its auto-stop */
function teardown() {
  clearTimeout(auto); stop();
  if (S) { clearTimeout(S.autoStop); S.rec.cancel(); for (const u of Object.values(S.takes)) URL.revokeObjectURL(u); }
}

function begin(set) {
  teardown();
  S = { set, i: 0, res: [], plays: 0, rec: new Recorder(), takes: {}, takeSeq: 0, autoStop: 0 };
  history.replaceState(null, '', `?set=${set.id}&mode=${mode}`);
  $('#pick').hidden = true; $('#summary').hidden = true; $('#work').hidden = false;
  $('#set-title').textContent = set.title;
  $('#set-meta').textContent = `${set.accent} · ${MODE_ZH[mode]}`;
  show();
}
const clipRate = () => (mode === 'speed' ? 1.25 : rate());
const cur = () => S.set.items[S.i];

function hpos() { return `<div class="hd"><span>第 ${S.i + 1} / ${S.set.items.length} 句</span><span id="plays"></span></div>`; }
function tags(it) { return it.focus.map((f) => `<span class="tag">${esc(FOCUS[f] || f)}</span>`).join(''); }

/* a listen only counts once audio actually starts: a blocked autoplay must not
   use up one of the test mode's two listens */
function playCur(btn) {
  if (!S) return;
  if (mode === 'test' && S.plays >= 2) { toast('测验模式每句只能听两遍'); return; }
  const s = S;
  return play(cur().a, { rate: clipRate(), btn, onStart: () => {
    if (S !== s) return;
    s.plays++;
    const pl = $('#plays'); if (pl) pl.textContent = `已听 ${s.plays} 遍` + (mode === 'test' ? ' / 2' : '');
  } });
}
// autoplay only once this page has had a user gesture; otherwise browsers block it
function autoplay() {
  clearTimeout(auto);
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  auto = setTimeout(() => playCur($('#pl')), 150);
}

function show() {
  const it = cur();
  S.plays = 0;
  if (mode === 'shadow') return showShadow(it);
  $('#dict').innerHTML = hpos() + `
    <div class="row" style="margin-bottom:10px">
      <button class="btn pri" id="pl" type="button">▶ 播放</button>
      ${mode !== 'test' ? '<button class="btn sm" id="slow" type="button">0.75× 慢放</button>' : ''}
    </div>
    <textarea id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="听到什么就写什么，回车提交" aria-label="听写"></textarea>
    <div class="row" style="margin-top:10px"><button class="btn pri" id="sub" type="button">提交</button><button class="btn sm" id="skip" type="button">听不出，看答案</button></div>
    <div class="res" id="res" aria-live="polite"></div>`;
  const ta = $('#typed');
  $('#pl').addEventListener('click', (e) => playCur(e.currentTarget));
  $('#slow')?.addEventListener('click', (e) => play(it.a, { rate: 0.75, btn: e.currentTarget }));
  $('#sub').addEventListener('click', () => submit(ta.value));
  $('#skip').addEventListener('click', () => submit(''));
  ta.addEventListener('keydown', (e) => {
    // Enter that commits a Chinese-IME composition is not a submit
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(ta.value); }
    if (e.key === 'Escape') { e.preventDefault(); playCur($('#pl')); }
  });
  ta.focus();
  autoplay();
}

function submit(typed) {
  if (!S || S.submitted === S.i) return;
  S.submitted = S.i;
  clearTimeout(auto);
  const it = cur();
  const c = compare(it.text, typed);
  S.res.push({ id: it.id, score: c.score, perfect: c.perfect, typed, focus: it.focus, miss: c.words.filter((_, k) => !c.wordOk[k]) });
  const pct = Math.round(c.score * 100);
  const showNotes = mode !== 'test';
  $('#res').innerHTML = `<div>${renderCompare(c)}</div>
    <div class="note">${c.perfect ? '<b style="color:var(--ok)">✓ 全对</b>' : `正确率 <b>${pct}%</b>`}${showNotes ? ' · ' + tags(it) : ''}</div>
    ${showNotes && it.note ? `<div class="note">💡 ${esc(it.note)}</div>` : ''}
    <div class="row" style="margin-top:10px"><button class="btn sm" id="again" type="button">↻ 对着答案再听</button><button class="btn pri" id="nx" type="button">${S.i + 1 < S.set.items.length ? '下一句 →' : '看总结'}</button></div>`;
  $('#typed').disabled = true; $('#sub').disabled = true; $('#skip').disabled = true;
  $('#again').addEventListener('click', (e) => play(it.a, { rate: clipRate(), btn: e.currentTarget }));
  const nx = $('#nx');
  nx.addEventListener('click', next);
  nx.addEventListener('keydown', (e) => { if (e.key === 'Escape') play(it.a, { rate: clipRate() }); });
  nx.focus();
}

function next() {
  if (!S) return;
  clearTimeout(auto); clearTimeout(S.autoStop); stop();
  if (S.rec.busy) S.rec.cancel();
  S.i++;
  if (S.i < S.set.items.length) show(); else finish();
}

/* ---- shadowing ---- */
function showShadow(it) {
  const hide = load('listen.hideText', false);
  $('#dict').innerHTML = hpos() + `
    <div class="prompt-box" id="txt" style="${hide ? 'filter:blur(7px)' : ''}">${esc(it.text)}</div>
    <div class="note" style="margin-bottom:10px">${tags(it)} ${it.note ? esc(it.note) : ''}</div>
    <div class="row">
      <button class="btn pri" id="pl" type="button">▶ 原声</button>
      <button class="btn rec" id="rec" type="button"${Recorder.supported() ? '' : ' disabled'}>● 录我的</button>
      <button class="btn" id="cmp" type="button"${S.takes[it.id] ? '' : ' disabled'}>⇄ 原声 + 我的</button>
      <button class="btn sm" id="blur" type="button">${hide ? '显示文字' : '先盲跟（隐藏文字）'}</button>
    </div>
    <div class="wave"><i id="lvl"></i></div>
    <div class="note dim" id="rmsg">${Recorder.supported() ? '建议：先听两遍，再一边播一边小声跟（影子跟读），最后录一遍完整的。' : '这个浏览器不支持录音，可以只做跟读。'}</div>
    <div class="row" style="margin-top:12px"><button class="btn pri" id="nx" type="button">${S.i + 1 < S.set.items.length ? '下一句 →' : '完成这一组'}</button></div>`;
  $('#pl').addEventListener('click', (e) => { if (!S.rec.busy) playCur(e.currentTarget); });
  // toggle in place: re-rendering would re-arm autoplay into a running recording
  $('#blur').addEventListener('click', (e) => {
    const h = !load('listen.hideText', false); save('listen.hideText', h);
    $('#txt').style.filter = h ? 'blur(7px)' : ''; e.currentTarget.textContent = h ? '显示文字' : '先盲跟（隐藏文字）';
  });
  $('#rec').addEventListener('click', () => record(it));
  $('#cmp').addEventListener('click', async () => {
    if (S.rec.busy) return;
    const s = S;
    await play(it.a, { rate: clipRate() });
    if (S !== s || cur() !== it) return;
    await new Promise((r) => setTimeout(r, 250));
    if (S === s && cur() === it && S.takes[it.id]) await playUrl(S.takes[it.id]);
  });
  $('#nx').addEventListener('click', next);
  autoplay();
}

async function record(it) {
  const s = S;
  const btn = $('#rec');
  if (s.rec.on) { clearTimeout(s.autoStop); return gotTake(it, await s.rec.stop(), s); }
  if (s.rec.busy) return; // permission prompt still open
  clearTimeout(auto); stop();
  const id = ++s.takeSeq;
  let ok;
  try {
    ok = await s.rec.start((v) => { const l = $('#lvl'); if (l) l.style.width = Math.round(v * 100) + '%'; });
  } catch { const m = $('#rmsg'); if (m) m.textContent = '没拿到麦克风权限：在地址栏左侧允许麦克风后再试。'; return; }
  if (!ok) return;
  if (S !== s || cur() !== it || s.takeSeq !== id) { s.rec.cancel(); return; } // moved on while asking
  btn.classList.add('on'); btn.textContent = '■ 停止';
  const secs = (await duration(it.a)) / clipRate();
  if (S !== s || s.takeSeq !== id || !s.rec.on) return;
  const wait = secs * 1.6 + 1;
  const m = $('#rmsg'); if (m) m.textContent = `录音中…… ${Math.ceil(wait)} 秒后自动停止，也可以点停止。`;
  clearTimeout(s.autoStop);
  s.autoStop = setTimeout(async () => {
    if (S === s && s.takeSeq === id && s.rec.on && cur() === it) gotTake(it, await s.rec.stop(), s);
  }, wait * 1000);
}
function gotTake(it, url, s) {
  if (!url) return;
  if (s.takes[it.id]) URL.revokeObjectURL(s.takes[it.id]);
  s.takes[it.id] = url;
  if (S !== s || cur() !== it) return;
  const b = $('#rec'); if (b) { b.classList.remove('on'); b.textContent = '● 重录'; }
  const c = $('#cmp'); if (c) c.disabled = false;
  const m = $('#rmsg'); if (m) m.textContent = '录好了，点「原声 + 我的」连着听：重音落在同一个词上吗？句尾是升还是降？哪里多了一个停顿？';
}

/* ---- end of set ---- */
async function finish() {
  const set = S.set;
  const s = S;
  let html;
  if (mode === 'shadow') {
    html = `<h3>跟读完成：${esc(set.title)}</h3><p class="sub">明天用「提速听写」再做一遍这一组。</p>`;
  } else {
    const avg = s.res.reduce((a, r) => a + r.score, 0) / s.res.length;
    const perfect = s.res.filter((r) => r.perfect).length;
    const sc = load('listen.scores', {});
    const prev = sc[set.id];
    const hist = (prev?.history || []).concat([{ mode, score: avg, at: Date.now() }]).slice(-30);
    sc[set.id] = { last: avg, best: Math.max(avg, prev?.best || 0), history: hist };
    save('listen.scores', sc);
    const ft = {};
    s.res.filter((r) => !r.perfect).forEach((r) => r.focus.forEach((f) => (ft[f] = (ft[f] || 0) + 1)));
    const fm = load('listen.focusMiss', {});
    Object.entries(ft).forEach(([k, v]) => (fm[k] = (fm[k] || 0) + v)); save('listen.focusMiss', fm);
    const top = Object.entries(ft).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${FOCUS[k] || k}（${v} 句）`).join('、');
    const misses = s.res.flatMap((r) => r.miss).filter((w, i, a) => a.indexOf(w) === i).slice(0, 30);
    html = `<h3>${MODE_ZH[mode]}完成：${esc(set.title)}</h3>
      <div class="kpis"><div><b>${Math.round(avg * 100)}%</b><span>平均正确率${prev?.last != null ? `（上次 ${Math.round(prev.last * 100)}%）` : ''}</span></div><div><b>${perfect} / ${s.res.length}</b><span>全对的句子</span></div></div>
      ${top ? `<p class="sub" style="margin-top:8px">这一组最常漏在：<b style="color:var(--txt)">${esc(top)}</b>。在「<a href="/english/sounds/" style="color:var(--accent)">发音与连读</a>」里有对应的微课。</p>` : ''}
      ${misses.length ? `<p class="sub" style="margin-top:6px">没听出的词：${misses.map((w) => `<span class="w-miss">${esc(w)}</span>`).join(' ')}</p>` : ''}`;
  }
  const href = `/english/listen/?set=${set.id}&mode=${mode}`;
  const ticked = await logActivity('dict', set.id, { mode, href }, linkIs(href));
  const msg = !ticked ? '回今日' : ticked.partial ? `✓ 已记下 · 第 ${ticked.day} 天周测还差另一组` : `✓ 已记入第 ${ticked.day} 天 · 回今日`;
  html += `<div class="row" style="margin-top:14px"><a class="btn pri" href="/english/">${msg}</a><button class="btn" type="button" id="redo">再做一遍</button></div>`;
  $('#work').hidden = true;
  const sm = $('#summary'); sm.hidden = false; sm.innerHTML = html;
  $('#redo').addEventListener('click', () => begin(set));
}
