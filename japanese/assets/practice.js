/* lonloop.com — 日语练习：假名间隔重复（FSRS）。
   Scheduling is ts-fsrs 6.0.0 — the reference implementation of FSRS, the
   algorithm Anki ships — vendored as /japanese/vendor/fsrs-6.0.0.min.mjs.
   Nothing leaves the browser: card state lives in localStorage ("jp.srs"). */
import { fsrs, generatorParameters, createEmptyCard, Rating, State } from '/japanese/vendor/fsrs-6.0.0.min.mjs';

const JP = window.JP;
const DECKS = JP.data('jp-decks');
const f = fsrs(generatorParameters({ request_retention: 0.9, enable_fuzz: true }));
const NEW_PER_DAY = 15;

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function loadCards() {
  const raw = JP.load('jp.srs', {});
  const out = {};
  for (const [k, c] of Object.entries(raw)) {
    out[k] = { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined };
  }
  return out;
}
function saveCards(cards) { JP.save('jp.srs', cards); }
function today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

let cards = loadCards();
let session = null;

const ui = {
  pick: $('#deck-pick'), start: $('#start'), mode: () => document.querySelector('input[name="mode"]:checked').value,
  box: $('#fc'), face: $('#fc .face'), ans: $('#fc .ans'), reveal: $('#fc .reveal'), stats: $('#fc-stats'),
  summary: $('#summary'), overview: $('#overview'),
};

function itemsOf(deckIds) {
  const out = [];
  for (const d of DECKS) if (deckIds.includes(d.id)) for (const it of d.items) out.push({ ...it, deck: d.id });
  return out;
}

function overview() {
  const now = new Date();
  let due = 0, learned = 0;
  for (const c of Object.values(cards)) { learned++; if (c.due <= now) due++; }
  const nd = JP.load('jp.srs.new', {});
  const newToday = nd[today()] || 0;
  ui.overview.innerHTML = `已学卡片 <b>${learned}</b> · 现在到期 <b>${due}</b> · 今天已学新卡 <b>${newToday}</b> / ${NEW_PER_DAY}`;
}

function build(deckIds, mode) {
  const now = new Date();
  const items = itemsOf(deckIds);
  const due = [], fresh = [];
  for (const it of items) {
    const id = mode + ':' + it.k;
    const c = cards[id];
    if (c) { if (c.due <= now) due.push({ it, id }); }
    else fresh.push({ it, id });
  }
  due.sort((a, b) => cards[a.id].due - cards[b.id].due);
  const nd = JP.load('jp.srs.new', {});
  const left = Math.max(0, NEW_PER_DAY - (nd[today()] || 0));
  const queue = due.concat(fresh.slice(0, left));
  return { queue, items, mode, done: 0, right: 0, newSeen: 0, cur: null, t0: 0 };
}

function normRomaji(s) { return s.trim().toLowerCase().replace(/[\s'’-]/g, ''); }

function showCard() {
  const s = session;
  if (!s.queue.length) return finish();
  s.cur = s.queue.shift();
  const { it } = s.cur;
  s.t0 = Date.now();
  ui.reveal.innerHTML = '';
  ui.stats.innerHTML = `本轮剩余 <b>${s.queue.length + 1}</b> · 已答 <b>${s.done}</b> · 正确 <b>${s.right}</b>`;
  if (s.mode === 'read') {
    ui.face.className = 'face'; ui.face.textContent = it.k; ui.face.lang = 'ja';
    ui.ans.innerHTML = `<input class="typed" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入罗马字，回车" aria-label="输入罗马字读音"><button class="btn pri" id="go">确定</button>`;
    const inp = $('#typed');
    inp.focus();
    const go = () => answer(it.ans.includes(normRomaji(inp.value)));
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    $('#go').addEventListener('click', go);
  } else {
    ui.face.className = 'face small'; ui.face.textContent = '🔊'; ui.face.lang = '';
    const pool = s.items.filter((x) => x.k !== it.k);
    // distractors: prefer the same row / similar sound so the choice is not trivial
    const near = pool.filter((x) => x.row === it.row || x.ans[0].slice(-1) === it.ans[0].slice(-1));
    const pick = [];
    for (const src of [near, pool]) {
      const arr = src.slice().sort(() => Math.random() - 0.5);
      for (const x of arr) { if (pick.length >= 3) break; if (!pick.some((p) => p.k === x.k)) pick.push(x); }
    }
    const opts = pick.concat([it]).sort(() => Math.random() - 0.5);
    ui.ans.innerHTML = `<button class="btn" id="again">↻ 再听</button>` + opts.map((o) => `<button class="btn opt-k" data-k="${esc(o.k)}" lang="ja" style="font-size:24px;min-width:64px">${esc(o.k)}</button>`).join('');
    $('#again').addEventListener('click', () => JP.play(it.id));
    ui.ans.querySelectorAll('.opt-k').forEach((b) => b.addEventListener('click', () => answer(b.dataset.k === it.k)));
    setTimeout(() => JP.play(it.id), 120);
  }
}

function answer(right) {
  const s = session;
  const { it, id } = s.cur;
  const secs = (Date.now() - s.t0) / 1000;
  // Auto-grade: wrong = Again; right but slow (> 6 s) = Hard; right = Good.
  const rating = !right ? Rating.Again : secs > 6 ? Rating.Hard : Rating.Good;
  const now = new Date();
  const isNew = !cards[id];
  const res = f.next(cards[id] || createEmptyCard(now), now, rating);
  cards[id] = res.card;
  saveCards(cards);
  if (isNew) {
    const nd = JP.load('jp.srs.new', {});
    nd[today()] = (nd[today()] || 0) + 1;
    JP.save('jp.srs.new', nd);
  }
  s.done++; if (right) s.right++;
  // a card due again within this sitting (learning steps) comes back this session
  if (res.card.due - now < 15 * 60 * 1000) s.queue.splice(Math.min(s.queue.length, 3 + Math.floor(Math.random() * 3)), 0, s.cur);
  const next = res.card.due - now;
  const when = next < 3600e3 ? Math.max(1, Math.round(next / 60e3)) + ' 分钟后' : next < 86400e3 ? Math.round(next / 3600e3) + ' 小时后' : Math.round(next / 86400e3) + ' 天后';
  ui.reveal.innerHTML = `${right ? '<span style="color:var(--ok)">✓ 正确</span>' : '<span style="color:var(--bad)">✗ 正确答案</span>'}：<span class="jw" lang="ja">${esc(it.k)}</span> = <span class="rom">${esc(it.rom)}</span> · 下次复习：${when}` +
    `<div style="margin-top:10px"><button class="btn pri" id="nextc">下一张 →</button></div>`;
  ui.ans.querySelectorAll('button,input').forEach((x) => (x.disabled = true));
  if (s.mode === 'read') JP.play(it.id);
  const nb = $('#nextc');
  nb.focus();
  nb.addEventListener('click', showCard);
}

function finish() {
  const s = session;
  ui.box.hidden = true;
  ui.summary.hidden = false;
  ui.summary.innerHTML = s.done
    ? `本轮完成：${s.done} 次作答，正确 ${s.right} 次（${Math.round(s.right / s.done * 100)}%）。到期的卡片都复习完了——明天再来，算法会把快忘的卡片排在前面。`
    : '现在没有到期的卡片，今天的新卡额度也用完了。明天再来；想多练，可以在课程页用听辨练习。';
  overview();
}

ui.start.addEventListener('click', () => {
  const ids = [...ui.pick.querySelectorAll('input:checked')].map((x) => x.value);
  if (!ids.length) { ui.summary.hidden = false; ui.summary.textContent = '先选至少一组假名。'; return; }
  JP.save('jp.srs.decks', ids);
  session = build(ids, ui.mode());
  ui.summary.hidden = true;
  ui.box.hidden = false;
  showCard();
});

(function init() {
  const saved = JP.load('jp.srs.decks', ['h-seion']);
  ui.pick.querySelectorAll('input').forEach((x) => (x.checked = saved.includes(x.value)));
  overview();
})();
