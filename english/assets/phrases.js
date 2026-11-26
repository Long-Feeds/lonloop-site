/* 表达：中→英 主动回忆 + FSRS 间隔重复（ts-fsrs 6.0.0，与日语板块同一份）。
   Card state lives in localStorage "en.srs"; nothing leaves the browser. */
import { fsrs, generatorParameters, createEmptyCard, Rating } from '/english/vendor/fsrs-6.0.0.min.mjs?v=71c16fc6';
import { $, esc, load, save, data, play, sayBtn, ymd, progress, logActivity } from './en.js?v=3bf6cc3c';

const D = await data();
const f = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: true }));
const NEW_PER_DAY = 10;

function loadCards() {
  const out = {};
  for (const [k, c] of Object.entries(load('srs', {}))) out[k] = { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined };
  return out;
}
let cards = loadCards();
let S = null;

// default decks: everything up to the learner's current phase in the plan
function curPhase() {
  const p = progress();
  const day = D.plan.find((d) => !d.tasks.every((t, i) => t.opt || (p.done[d.n] || {})[i]));
  return day ? day.p : 3;
}

function decksUI() {
  const saved = load('srs.decks', null) || D.chunks.filter((c) => c.phase <= curPhase()).map((c) => c.id);
  $('#decks').innerHTML = D.chunks.map((c) => {
    const learned = c.items.filter((i) => cards[i.id]).length;
    return `<label><input type="checkbox" value="${esc(c.id)}"${saved.includes(c.id) ? ' checked' : ''}><span>${esc(c.title)}<small>阶段 ${c.phase} · ${c.items.length} 个 · 已学 ${learned}</small></span></label>`;
  }).join('');
}
function overview() {
  const now = new Date();
  const vals = Object.values(cards);
  const nd = load('srs.new', {});
  $('#overview').innerHTML = `已学 <b>${vals.length}</b> · 现在到期 <b>${vals.filter((c) => c.due <= now).length}</b> · 今天新卡 <b>${nd[ymd()] || 0}</b> / ${NEW_PER_DAY}`;
}

function build(ids) {
  const now = new Date();
  const due = [], fresh = [];
  for (const c of D.chunks) if (ids.includes(c.id)) for (const it of c.items) (cards[it.id] ? (cards[it.id].due <= now && due.push(it)) : fresh.push(it));
  due.sort((a, b) => cards[a.id].due - cards[b.id].due);
  const left = Math.max(0, NEW_PER_DAY - (load('srs.new', {})[ymd()] || 0));
  return { queue: due.concat(fresh.slice(0, left)), done: 0, good: 0, cur: null };
}

function show() {
  const fc = $('#fc');
  if (!S.queue.length) return finish();
  S.cur = S.queue.shift();
  const it = S.cur;
  fc.innerHTML = `<div class="stats" style="justify-content:center;margin:0 0 10px">本轮剩余 <b>${S.queue.length + 1}</b> · 已复习 <b>${S.done}</b>${cards[it.id] ? '' : ' · <span class="badge">新卡</span>'}</div>
    <div class="face">${esc(it.zh)}</div>
    <div class="dim" style="font-size:14px">先大声说出英文，再翻开</div>
    <div class="grades"><button class="btn pri" id="flip" type="button">翻开 <span class="kbd">空格</span></button></div>`;
  $('#flip').focus();
  $('#flip').addEventListener('click', flip);
  S.flipped = false;
}
function flip() {
  if (S.flipped) return;
  S.flipped = true;
  const it = S.cur;
  const fc = $('#fc');
  const now = new Date();
  S.preview = { now, out: f.repeat(cards[it.id] || createEmptyCard(now), now) };
  const label = (r) => {
    const n = S.preview.out[r].card.due - now;
    return n < 3600e3 ? Math.max(1, Math.round(n / 60e3)) + ' 分钟' : n < 86400e3 ? Math.round(n / 3600e3) + ' 小时' : Math.round(n / 86400e3) + ' 天';
  };
  fc.innerHTML = `<div class="face" style="font-size:16px;color:var(--muted);margin-bottom:6px">${esc(it.zh)}</div>
    <div class="back">${esc(it.en)}</div>
    ${it.note ? `<div class="nt">${esc(it.note)}</div>` : ''}
    <div class="row" style="justify-content:center;margin-top:8px">${it.a ? sayBtn(it.a, '再听') : ''}</div>
    <div class="dim" style="font-size:13.5px;margin-top:10px">跟着原声说一遍，然后选：</div>
    <div class="grades">
      <button class="btn" data-r="${Rating.Again}" type="button">没说出来 <small class="dim">${label(Rating.Again)}</small> <span class="kbd">1</span></button>
      <button class="btn" data-r="${Rating.Hard}" type="button">说得磕绊 <small class="dim">${label(Rating.Hard)}</small> <span class="kbd">2</span></button>
      <button class="btn pri" data-r="${Rating.Good}" type="button">基本说对 <small class="dim">${label(Rating.Good)}</small> <span class="kbd">3</span></button>
      <button class="btn" data-r="${Rating.Easy}" type="button">脱口而出 <small class="dim">${label(Rating.Easy)}</small> <span class="kbd">4</span></button>
    </div>`;
  if (it.a) play(it.a);
  fc.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => grade(+b.dataset.r)));
  fc.querySelector('[data-r="3"]').focus();
}
function grade(r) {
  if (!S.flipped || !S.preview) return;
  const it = S.cur;
  const now = S.preview ? S.preview.now : new Date();
  const isNew = !cards[it.id];
  const res = S.preview ? S.preview.out[r] : f.next(cards[it.id] || createEmptyCard(now), now, r);
  S.preview = null;
  cards[it.id] = res.card;
  save('srs', cards);
  if (isNew) { const nd = load('srs.new', {}); nd[ymd()] = (nd[ymd()] || 0) + 1; save('srs.new', nd); }
  S.done++; if (r >= Rating.Good) S.good++;
  if (res.card.due - now < 15 * 60e3) S.queue.splice(Math.min(S.queue.length, 3 + Math.floor(Math.random() * 3)), 0, it);
  show();
}
async function finish() {
  $('#fc').hidden = true;
  const sm = $('#summary'); sm.hidden = false;
  let tick = null;
  if (S.done) tick = await logActivity('phrases', null, { n: S.done }, (t) => t.k === 'phrases');
  sm.innerHTML = S.done
    ? `<h3>这一轮完成</h3><p class="sub">复习 ${S.done} 次，说对 ${S.good} 次。到期的都复习完了，明天再来。${tick ? `已记入第 ${tick.day} 天。` : ''}</p><div class="row" style="margin-top:10px"><a class="btn pri" href="/english/">回今日</a></div>`
    : '<h3>现在没有要复习的</h3><p class="sub">到期的卡片复习完了，今天的新卡额度也用完了。想多学，可以勾选更多卡组，或者明天再来。</p>';
  overview(); decksUI();
}

document.addEventListener('keydown', (e) => {
  if (!S || $('#fc').hidden || e.target.closest('input,textarea')) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return; // ⌘1 switches tabs, it must not grade
  if (e.key === ' ') {
    e.preventDefault(); // Space must never also press the focused grade button
    if (!e.repeat && $('#flip')) flip();
  } else if (/^[1-4]$/.test(e.key) && !e.repeat && $('#fc [data-r]')) grade(+e.key);
});
$('#start-btn').addEventListener('click', () => {
  const ids = [...document.querySelectorAll('#decks input:checked')].map((x) => x.value);
  save('srs.decks', ids);
  S = build(ids);
  $('#summary').hidden = true; $('#fc').hidden = false;
  show();
  $('#fc').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

$('#browse').innerHTML = D.chunks.map((c) => `<h3 id="${esc(c.id)}">${esc(c.title)} <span class="dim" style="font-size:13px;font-weight:400">阶段 ${c.phase}</span></h3>` +
  c.items.map((i) => `<div class="ex"><div class="l">${i.a ? sayBtn(i.a) : ''}<div><div class="t">${esc(i.en)}</div><div class="n">${esc(i.zh)}${i.note ? ' · ' + esc(i.note) : ''}</div></div></div></div>`).join('')).join('');
decksUI(); overview();
