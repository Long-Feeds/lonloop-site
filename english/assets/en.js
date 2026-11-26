/* lonloop.com — 英语板块公共模块：数据、存储、播放、录音、听写比对。
   Everything the learner does stays in this browser (localStorage keys "en.*");
   recordings are never uploaded — they live in memory until the page closes. */

const PFX = 'en.';
export function load(k, def) {
  try { const v = localStorage.getItem(PFX + k); return v == null ? def : JSON.parse(v); } catch { return def; }
}
export function save(k, v) { try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch { /* private mode / full */ } }

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function ymd(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

let _data;
export function data() {
  if (!_data) {
    const url = document.querySelector('meta[name="en-data"]').content;
    _data = fetch(url).then((r) => { if (!r.ok) throw new Error('course.json ' + r.status); return r.json(); });
  }
  return _data;
}

/* ---------- audio ---------- */
const AUDIO_BASE = '/english/audio/';
const player = new Audio();
player.preload = 'auto';
let take = null;          // the learner's own recording, when one is playing
let cur = null;           // { id, btn, resolve } of the clip in flight
let seq = 0;
export function rate() { return load('rate', 1); }
export function setRate(r) { save('rate', r); }
function settle(ok) {
  if (!cur) return;
  const c = cur; cur = null;
  if (c.btn) c.btn.classList.remove('playing');
  player.onended = player.onerror = null;
  c.resolve(ok);
}
/* Resolves true once the clip has played to the end, false if it could not
   start (autoplay blocked, load error) or was cut off by another play()/stop().
   Every promise resolves exactly once, so `await play(); await playUrl()`
   chains never hang. */
export function play(file, opts = {}) {
  stop();
  const id = ++seq;
  return new Promise((resolve) => {
    cur = { id, btn: opts.btn || null, resolve };
    if (cur.btn) cur.btn.classList.add('playing');
    player.src = AUDIO_BASE + file;
    player.playbackRate = opts.rate || rate();
    player.preservesPitch = true;
    player.onended = () => { if (cur && cur.id === id) settle(true); };
    player.onerror = () => { if (cur && cur.id === id) settle(false); };
    const p = player.play();
    if (opts.onStart) p.then(() => { if (cur && cur.id === id) opts.onStart(); }, () => {});
    p.catch(() => { if (cur && cur.id === id) settle(false); });
  });
}
export function stop() {
  if (take) { take.pause(); const t = take; take = null; t.onended && t.onended(); }
  if (cur) { player.pause(); settle(false); }
}
export function playUrl(url) {
  stop();
  return new Promise((res) => {
    const a = new Audio(url);
    take = a;
    const fin = () => { if (take === a) take = null; a.onended = a.onerror = null; res(); };
    a.onended = fin; a.onerror = fin;
    a.play().catch(fin);
  });
}
export function duration(file) {
  // iOS often never loads metadata for an element it was not told to play;
  // fall back to 3 s rather than wait forever
  return new Promise((res) => {
    const a = new Audio(AUDIO_BASE + file);
    a.preload = 'metadata';
    const t = setTimeout(() => res(3), 1500);
    a.onloadedmetadata = () => { clearTimeout(t); res(a.duration || 3); };
    a.onerror = () => { clearTimeout(t); res(3); };
    a.load();
  });
}
const ICON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.5v9l8.5-4.5z"/></svg>';
export function sayBtn(file, label = '播放') {
  return `<button type="button" class="say" data-a="${esc(file)}" aria-label="${esc(label)}">${ICON}</button>`;
}
// one delegated listener for every play button on the page
document.addEventListener('click', (e) => {
  const b = e.target.closest('.say[data-a]');
  if (b) play(b.dataset.a, { btn: b });
});

/* speed toolbar: <span class="seg" data-rate> with buttons data-val */
export function bindRate(root = document) {
  const seg = root.querySelector('[data-rate]');
  if (!seg) return;
  const sync = () => seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.val === rate())));
  seg.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { setRate(+b.dataset.val); sync(); } });
  sync();
}

/* ---------- recording ----------
   One recording at a time per Recorder. start() resolves false (and records
   nothing) if a start is already pending or running — a double click or a click
   behind the permission prompt can't open a second mic stream. stop() and
   cancel() work on the recording that was running when they were called. */
export class Recorder {
  constructor() { this.rec = null; this.stream = null; this.pending = false; this.gen = 0; }
  static supported() { return !!(navigator.mediaDevices && window.MediaRecorder); }
  async start(onLevel) {
    if (this.pending || this.on) return false;
    this.pending = true;
    const gen = ++this.gen;
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    finally { this.pending = false; }
    if (gen !== this.gen) { stream.getTracks().forEach((t) => t.stop()); return false; } // cancelled while asking
    const chunks = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec._chunks = chunks;
    this.rec = rec; this.stream = stream;
    rec.start();
    if (onLevel) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume && ctx.resume();
        const an = ctx.createAnalyser();
        an.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(an);
        const buf = new Uint8Array(an.fftSize);
        const tick = () => {
          if (rec.state !== 'recording') { ctx.close(); onLevel(0); return; }
          an.getByteTimeDomainData(buf);
          let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128));
          onLevel(Math.min(1, m / 64));
          requestAnimationFrame(tick);
        };
        tick();
      } catch { /* level meter is decoration */ }
    }
    return true;
  }
  stop() {
    const rec = this.rec, stream = this.stream;
    this.rec = null; this.stream = null;
    return new Promise((res) => {
      if (!rec) return res(null);
      const fin = () => {
        stream.getTracks().forEach((t) => t.stop()); // mic indicator off between takes
        res(rec._chunks.length ? URL.createObjectURL(new Blob(rec._chunks, { type: rec.mimeType || 'audio/webm' })) : null);
      };
      if (rec.state === 'inactive') return fin();
      rec.onstop = fin;
      rec.stop();
    });
  }
  // stop and discard, also cancelling a start still waiting on the permission prompt
  cancel() { this.gen++; if (this.rec) this.stop(); }
  get busy() { return this.pending || this.on; }
  get on() { return !!this.rec && this.rec.state === 'recording'; }
}

/* ---------- dictation compare ---------- */
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function numWords(n) {
  if (n < 20) return NUM[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + NUM[n % 10] : '');
  if (n < 1000) return NUM[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
  return String(n);
}
const IRREG = { "won't": 'will not', "can't": 'can not', cannot: 'can not', "shan't": 'shall not', "let's": 'let us', ok: 'okay', alright: 'all right',
  // typed without the apostrophe, as everyone does when typing fast. Only the
  // unambiguous ones: ill / well / were / its / id / hell are real words.
  im: 'i am', dont: 'do not', doesnt: 'does not', didnt: 'did not', cant: 'can not', wont: 'will not', isnt: 'is not',
  arent: 'are not', wasnt: 'was not', werent: 'were not', hasnt: 'has not', havent: 'have not', hadnt: 'had not',
  couldnt: 'could not', shouldnt: 'should not', wouldnt: 'would not', lets: 'let us', youre: 'you are', theyre: 'they are',
  ive: 'i have', youve: 'you have', weve: 'we have', theyve: 'they have', youll: 'you will', theyll: 'they will',
  gonna: 'going to', wanna: 'want to', gotta: 'got to', kinda: 'kind of', sorta: 'sort of', lemme: 'let me', dunno: 'do not know',
  thats: 'that s', whats: 'what s', theres: 'there s', hes: 'he s', shes: 'she s', youd: 'you d', theyd: 'they d' };
/* one written word → the tokens it is compared as. "I'm" and "I am" both become
   [i, am]; "can't" and "cannot" both [can, not]; a typed "2" counts as "two". */
export function tokensOf(word) {
  let w = word.toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');
  if (!w) return [];
  if (/^\d+$/.test(w)) return numWords(+w).split(' ');
  if (IRREG[w]) return IRREG[w].split(' ');
  const m = w.match(/^(.+?)(n't|'re|'ve|'ll|'m|'d|'s)$/);
  if (m) {
    const rest = { "n't": 'not', "'re": 'are', "'ve": 'have', "'ll": 'will', "'m": 'am', "'d": 'd', "'s": 's' }[m[2]];
    return [m[1].replace(/'/g, ''), rest];
  }
  return w.replace(/'/g, '').split('-').filter(Boolean);
}
// "they'd" may be "they would/had" when typed in full — accept either expansion
const EQUIV = { d: ['would', 'had'], s: ['is', 'has'] };
const same = (a, t) => a === t || (EQUIV[a] || []).includes(t);

/* LCS alignment of the answer against what was typed. Returns per-answer-word
   ok flags (a word is right only if all its tokens were matched), the extra
   typed words, and the score = matched answer tokens / all answer tokens. */
export function compare(answer, typed) {
  const aw = answer.split(/\s+/).filter(Boolean);
  const A = []; aw.forEach((w, i) => tokensOf(w).forEach((t) => A.push({ t, i })));
  const tw = typed.split(/\s+/).filter(Boolean);
  let T = []; tw.forEach((w, i) => tokensOf(w).forEach((t) => T.push({ t, i })));
  // word boundaries are not what dictation tests: "shoutout" / "shout out" for
  // "shout-out", "hotspots" for "hot spots" all count. Re-cut typed tokens to
  // the answer's boundaries wherever the letters agree.
  const aset = new Set(A.map((x) => x.t));
  const pairs = new Map(); for (let i = 0; i + 1 < A.length; i++) pairs.set(A[i].t + A[i + 1].t, [A[i].t, A[i + 1].t]);
  const T2 = [];
  for (let j = 0; j < T.length; j++) {
    const x = T[j], y = T[j + 1];
    if (!aset.has(x.t) && pairs.has(x.t)) { const [p, q] = pairs.get(x.t); T2.push({ t: p, i: x.i }, { t: q, i: x.i }); continue; }
    if (y && aset.has(x.t + y.t) && !(aset.has(x.t) && aset.has(y.t))) { T2.push({ t: x.t + y.t, i: x.i }); j++; continue; }
    T2.push(x);
  }
  T = T2;
  const n = A.length, m = T.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    L[i][j] = same(A[i].t, T[j].t) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const hitA = new Array(n).fill(false), hitT = new Array(m).fill(false);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (same(A[i].t, T[j].t)) { hitA[i] = hitT[j] = true; i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  const wordOk = aw.map(() => true);
  A.forEach((x, k) => { if (!hitA[k]) wordOk[x.i] = false; });
  const extraIdx = new Set(); T.forEach((x, k) => { if (!hitT[k]) extraIdx.add(x.i); });
  const matched = hitA.filter(Boolean).length;
  return { words: aw, wordOk, extra: [...extraIdx].map((i) => tw[i]), score: n ? matched / n : 0, perfect: matched === n && extraIdx.size === 0 };
}
export function renderCompare(c) {
  const parts = c.words.map((w, i) => `<span class="${c.wordOk[i] ? 'w-ok' : 'w-miss'}">${esc(w)}</span>`).join(' ');
  const extra = c.extra.length ? `<div class="dim" style="font-size:14px">多写的：${c.extra.map((w) => `<span class="w-extra">${esc(w)}</span>`).join(' ')}</div>` : '';
  return parts + extra;
}

/* ---------- misc ---------- */
export function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
  document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
}
export async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('已复制'); } catch { toast('复制失败，请手动选中复制'); }
}

/* course progress: which plan day/tasks are done, and which calendar days had practice */
export function progress() { return load('progress', { done: {}, log: {} }); }
export function markTask(day, idx, on) {
  const p = progress();
  const d = (p.done[day] = p.done[day] || {});
  if (on) { d[idx] = ymd(); p.log[ymd()] = (p.log[ymd()] || 0) + 1; } else delete d[idx];
  save('progress', p);
  return p;
}
export function dayComplete(day, p = progress()) {
  const d = p.done[day.n] || {};
  return day.tasks.every((t, i) => t.opt || d[i]);
}
/* other pages report finished work (a dictation set, a speaking task) and the
   earliest not-yet-ticked plan task that asks for exactly that gets ticked, so
   following the plan never needs double bookkeeping */
export async function logActivity(kind, ref, extra = {}, pred) {
  const a = load('activity', []);
  a.push({ kind, ref, at: Date.now(), ...extra });
  save('activity', a.slice(-2000));
  const p = progress(); p.log[ymd()] = (p.log[ymd()] || 0) + 1; save('progress', p);
  if (!pred || !load('start', null)) return null;
  const { plan } = await data();
  // never reach past the learner's current day: re-recording the benchmark in
  // week 1 must not tick week 2's benchmark
  const curDay = (plan.find((d) => !dayComplete(d, p)) || plan[plan.length - 1]).n;
  for (const day of plan) {
    if (day.n > curDay) break;
    const d = p.done[day.n] || {};
    const i = day.tasks.findIndex((t, j) => !d[j] && pred(t));
    if (i < 0) continue;
    const t = day.tasks[i];
    const links = (t.links || []).filter((l) => !l.ext).map((l) => l.href);
    if (links.length > 1 && extra.href) {
      // a task made of several parts (周测: two dictation sets) is done when all are
      const parts = p.parts = p.parts || {};
      const key = day.n + ':' + i;
      parts[key] = [...new Set([...(parts[key] || []), extra.href])];
      if (!links.every((h) => parts[key].includes(h))) { save('progress', p); return { day: day.n, task: t.t, partial: true }; }
    }
    d[i] = ymd(); p.done[day.n] = d; save('progress', p);
    return { day: day.n, task: t.t };
  }
  return null;
}
export const linkIs = (href) => (t) => (t.links || []).some((l) => l.href === href);
