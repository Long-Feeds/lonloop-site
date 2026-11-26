/* 口语：4/3/2 限时复述 + 录音、AI 陪练提示词、每周基准录音（IndexedDB）。 */
import { $, $$, esc, load, save, data, sayBtn, Recorder, logActivity, linkIs, copy, toast, ymd } from './en.js?v=3bf6cc3c';

const D = await data();
const P = D.speaking;
const CH = Object.fromEntries(D.chunks.map((c) => [c.id, c]));
const q = new URLSearchParams(location.search);
let prompt = P.find((p) => p.id === q.get('p')) || P.find((p) => p.id === load('speak.last', 's01')) || P[1];
let mode = ['432', 'ai', 'bench'].includes(q.get('mode')) ? q.get('mode') : prompt.id === 'bench' ? 'bench' : '432';
if (mode === 'bench') prompt = P.find((p) => p.id === 'bench');
const rec = new Recorder();
let timer = null;
let gen = 0;
const benchUrls = []; // bumps on every render; async work from an old screen checks it and bails

/* ---- IndexedDB for benchmark recordings (Blobs too big for localStorage) ---- */
const idb = () => new Promise((res, rej) => {
  const r = indexedDB.open('en-speak', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('bench', { keyPath: 'at' });
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
async function benchAll() {
  try {
    const db = await idb();
    return await new Promise((res) => { const out = []; const c = db.transaction('bench').objectStore('bench').openCursor();
      c.onsuccess = () => { const cur = c.result; if (cur) { out.push(cur.value); cur.continue(); } else res(out); }; c.onerror = () => res(out); });
  } catch { return []; }
}
async function benchPut(v) { const db = await idb(); await new Promise((res, rej) => { const t = db.transaction('bench', 'readwrite'); t.objectStore('bench').put(v); t.oncomplete = res; t.onerror = () => rej(t.error); }); }
async function benchDel(at) { const db = await idb(); await new Promise((res) => { const t = db.transaction('bench', 'readwrite'); t.objectStore('bench').delete(at); t.oncomplete = res; }); }

function syncModes() { $$('#modes button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode))); }
$('#modes').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  mode = b.dataset.mode;
  if (mode === 'bench') prompt = P.find((p) => p.id === 'bench');
  else if (prompt.id === 'bench') prompt = P.find((p) => p.id === load('speak.last', 's01')) || P[1];
  render();
});

function head() {
  const chunks = (prompt.chunks || []).map((id) => CH[id]).filter(Boolean);
  const ch = chunks.length ? `<details style="margin-top:10px"><summary class="dim" style="cursor:pointer;font-size:14px">可以用上的表达（${chunks.map((c) => esc(c.title)).join('、')}）</summary>
    <div style="margin-top:8px">${chunks.flatMap((c) => c.items.slice(0, 6)).map((i) => `<div class="row" style="margin:4px 0;flex-wrap:nowrap">${i.a ? sayBtn(i.a) : ''}<span class="en-t">${esc(i.en)}</span></div>`).join('')}</div></details>` : '';
  // roleplay / interview prompts are written as a scenario for the AI partner;
  // show the learner the question they'll actually face, and the scenario small
  const scen = isScenario();
  const asked = scen && (prompt.prompt.match(/:\s*'(.+?[?.!])'/) || [])[1];
  const main = scen ? (asked || prompt.title) : prompt.prompt;
  const note = scen && mode === '432' && prompt.kind === 'roleplay'
    ? '<div class="callout" style="margin:8px 0">这是对话题。4/3/2 这一遍，先把<b>你这一方</b>要说的话独白讲完整（立场、理由、你能接受的方案）。下一次再交给 AI 扮演对方，和你真的对上几轮。</div>' : '';
  return `<div class="dim" style="font-size:13px">${prompt.phase ? `阶段 ${prompt.phase} · ${esc(prompt.kind_zh || '')}` : '每周基准'} · ${esc(prompt.title)}</div>
    <div class="prompt-box">${esc(main)}</div>
    ${scen ? `<details style="margin-bottom:8px"><summary class="dim" style="cursor:pointer;font-size:14px">完整场景（英文）</summary><p class="sub" style="margin-top:6px">${esc(prompt.prompt)}</p></details>` : ''}${note}
    <ul class="hints">${(prompt.hints || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${ch}`;
}

function render() {
  gen++;
  clearInterval(timer);
  rec.cancel();
  syncModes();
  history.replaceState(null, '', `?p=${prompt.id}&mode=${mode}`);
  if (prompt.id !== 'bench') save('speak.last', prompt.id);
  if (mode === '432') r432(); else if (mode === 'ai') rAI(); else rBench();
  list();
}

/* ---- 4/3/2 ---- */
function r432() {
  const R = [240, 180, 120];
  const st = { r: 0, left: R[0], run: false, takes: [] };
  $('#work').innerHTML = `<div class="card">${head()}
    <div class="rounds" id="rounds" style="margin-top:14px">${R.map((s, i) => `<span data-r="${i}">第 ${i + 1} 遍 · ${s / 60} 分钟</span>`).join('')}</div>
    <div class="timer" id="clock" aria-live="off">4:00</div>
    <div class="row" style="justify-content:center"><button class="btn pri" id="go" type="button">▶ 开始第 1 遍</button>
      <label class="dim" style="font-size:14px;display:flex;gap:6px;align-items:center"><input type="checkbox" id="dorec" ${Recorder.supported() ? 'checked' : 'disabled'}> 同时录音</label></div>
    <div class="takes" id="takes"></div>
    <div id="after" hidden>
      <h3 style="margin-top:18px">回听第三遍，勾出做到的</h3>
      <div class="rubric">
        <label><input type="checkbox"> 没有超过 3 秒的停顿</label>
        <label><input type="checkbox"> 第三遍讲到了第一遍的所有要点</label>
        <label><input type="checkbox"> 用上了至少两个学过的表达</label>
        <label><input type="checkbox"> 有清楚的结构（先结论 / 分点 / 收尾）</label>
        <label><input type="checkbox"> "um / uh / 然后 so so" 比第一遍少</label>
      </div>
      <textarea id="fix" rows="2" style="width:100%;margin-top:8px;background:var(--bg2);border:1px solid var(--line);border-radius:10px;color:var(--txt);font:inherit;padding:9px 12px" placeholder="下次讲这个话题，最想改的一件事："></textarea>
      <div class="row" style="margin-top:10px"><button class="btn pri" id="fin" type="button">完成</button></div>
    </div></div>`;
  const fixes = load('speak.fix', {});
  $('#fix').value = fixes[prompt.id] || '';
  if (fixes[prompt.id]) $('#takes').innerHTML = `<div class="callout warn" style="margin:0"><span class="ct">上次给自己的提醒</span>${esc(fixes[prompt.id])}</div>`;
  const paint = () => {
    const m = Math.floor(st.left / 60), s = st.left % 60;
    const c = $('#clock'); c.textContent = `${m}:${String(s).padStart(2, '0')}`; c.classList.toggle('warn', st.left <= 15);
    $$('#rounds span').forEach((x) => { const i = +x.dataset.r; x.className = i < st.r ? 'done' : i === st.r && st.r < 3 ? 'cur' : ''; });
  };
  const endRound = async () => {
    if (!st.run) return;
    clearInterval(timer); st.run = false;
    if (rec.on) { const url = await rec.stop(); if (url) st.takes.push({ r: st.r, url }); }
    $('#takes').innerHTML = st.takes.map((t) => `<div class="tk">第 ${t.r + 1} 遍 <audio controls src="${t.url}"></audio></div>`).join('');
    st.r++;
    if (st.r >= 3) { $('#go').hidden = true; $('#after').hidden = false; paint(); return; }
    st.left = R[st.r]; paint();
    $('#go').textContent = `▶ 开始第 ${st.r + 1} 遍`;
  };
  const g = gen;
  $('#go').addEventListener('click', async () => {
    if (st.run) return endRound();
    if (st.starting) return; // double click / click behind the permission prompt
    st.starting = true;
    if ($('#dorec').checked) {
      try { await rec.start(); } catch { toast('没拿到麦克风权限，只计时不录音'); $('#dorec').checked = false; }
    }
    st.starting = false;
    if (g !== gen) { rec.cancel(); return; }
    st.run = true; $('#go').textContent = '■ 提前结束这一遍';
    clearInterval(timer);
    timer = setInterval(() => { st.left--; paint(); if (st.left <= 0) endRound(); }, 1000);
  });
  $('#fin').addEventListener('click', async () => {
    const f = load('speak.fix', {}); f[prompt.id] = $('#fix').value.trim(); save('speak.fix', f);
    const t = await logActivity('speak', prompt.id, { mode: '432' }, linkIs(`/english/speak/?p=${prompt.id}&mode=432`));
    toast(t ? `已记入第 ${t.day} 天` : '完成');
  });
  paint();
}

/* ---- AI partner ---- */
function isScenario() { return prompt.kind === 'roleplay' || prompt.kind === 'interview'; }
function aiText() {
  const role = isScenario()
    ? `Let's practice a spoken ${prompt.kind === 'interview' ? 'mock interview' : 'role-play'}. "The AI" below is you; the candidate / engineer / other person is me.\n\n${prompt.prompt}\n\nStay in character and react realistically, including pushing back. Start now with your first line.`
    : `You are a friendly colleague. Ask me: "${prompt.prompt}" Then keep the conversation going like a real coworker would.`;
  const fix = load('speak.fix', {})[prompt.id];
  return `${role}

Rules:
- I'm a Chinese software engineer working in Singapore, around IELTS 6.5. I'm practicing spoken English for work and interviews.
- Speak at natural native speed, like a real colleague, not a teacher. Keep each of your turns short (1-3 sentences) so I do most of the talking.
- Ask me about 5 follow-up questions, one at a time. Dig into details, ask "why" and "for example?", and push back once.
- Do not correct me during the conversation.
- When I say "feedback", stop and give me: (1) the 3 most important grammar or word-choice mistakes I made, each with my sentence and a more natural version; (2) 3 phrases a native speaker would have used in my place; (3) one thing I did well.${fix ? `\n- I'm specifically working on: ${fix}` : ''}`;
}
function rAI() {
  $('#work').innerHTML = `<div class="card">${head()}
    <h3 style="margin-top:16px">1 · 复制提示词</h3>
    <pre class="aiprompt" id="aip">${esc(aiText())}</pre>
    <div class="row" style="margin-top:8px"><button class="btn pri" id="cp" type="button">复制提示词</button></div>
    <h3 style="margin-top:18px">2 · 打开 AI 的语音模式</h3>
    <p class="sub">把提示词作为第一条消息发出去，然后切到语音对话。ChatGPT（App 里的语音）、Claude（App 里的语音模式）、Gemini Live 都可以，用你已经有的那个就行。说完了说 "feedback"，让它总结问题。</p>
    <h3 style="margin-top:18px">3 · 把反馈里最有用的一句记下来</h3>
    <textarea id="note" rows="3" style="width:100%;background:var(--bg2);border:1px solid var(--line);border-radius:10px;color:var(--txt);font:inherit;padding:9px 12px" placeholder="例：I said &quot;discuss about&quot; → discuss（不加 about）"></textarea>
    <div class="row" style="margin-top:10px"><button class="btn pri" id="fin" type="button">完成</button></div></div>`;
  const notes = load('speak.notes', {});
  $('#note').value = notes[prompt.id] || '';
  $('#cp').addEventListener('click', () => copy(aiText()));
  $('#fin').addEventListener('click', async () => {
    const n = load('speak.notes', {}); n[prompt.id] = $('#note').value.trim(); save('speak.notes', n);
    if (n[prompt.id]) { const f = load('speak.fix', {}); if (!f[prompt.id]) { f[prompt.id] = n[prompt.id]; save('speak.fix', f); } }
    const t = await logActivity('speak', prompt.id, { mode: 'ai' }, linkIs(`/english/speak/?p=${prompt.id}&mode=ai`));
    toast(t ? `已记入第 ${t.day} 天` : '完成');
  });
}

/* ---- weekly benchmark ---- */
async function rBench() {
  const g = gen;
  const all = (await benchAll()).sort((a, b) => a.at - b.at);
  if (g !== gen || mode !== 'bench') return;
  $('#work').innerHTML = `<div class="card">${head()}
    <p class="sub" style="margin-top:8px">讲 2 分钟左右，不用准备，像面试开场那样自然说。录完会保存在这个浏览器（IndexedDB）里。</p>
    <div class="timer" id="clock">0:00</div>
    <div class="row" style="justify-content:center"><button class="btn rec" id="go" type="button"${Recorder.supported() ? '' : ' disabled'}>● 开始录音</button></div>
    <div class="wave"><i id="lvl"></i></div>
    <h3 style="margin-top:18px">历次录音</h3>
    <div class="takes" id="takes">${all.length ? '' : '<div class="dim" style="font-size:14px">还没有录音。</div>'}</div></div>`;
  benchUrls.splice(0).forEach((u) => URL.revokeObjectURL(u));
  const tk = $('#takes');
  all.forEach((v, i) => {
    const d = document.createElement('div'); d.className = 'tk';
    d.innerHTML = `<b style="color:var(--txt)">${i === 0 ? '第一次 · ' : ''}${esc(v.day)}</b> ${Math.round(v.secs)} 秒 <audio controls></audio><button class="btn sm" type="button">删除</button>`;
    const u = URL.createObjectURL(v.blob); benchUrls.push(u);
    d.querySelector('audio').src = u;
    d.querySelector('button').addEventListener('click', async () => { if (confirmDel(d)) { await benchDel(v.at); rBench(); } });
    tk.appendChild(d);
  });
  let t0 = 0;
  $('#go').addEventListener('click', async () => {
    const b = $('#go');
    if (rec.on) {
      clearInterval(timer);
      const secs = (Date.now() - t0) / 1000;
      const url = await rec.stop();
      b.classList.remove('on'); b.textContent = '● 再录一次';
      if (!url) return;
      const blob = await fetch(url).then((r) => r.blob());
      try {
        await benchPut({ at: Date.now(), day: ymd(), secs, blob });
      } catch {
        // private mode / no IndexedDB: keep the take playable and downloadable on this page
        const d = document.createElement('div'); d.className = 'tk';
        d.innerHTML = `<b style="color:var(--bad)">没能保存到浏览器</b>（无痕模式或存储已满）<audio controls src="${url}"></audio><a class="btn sm" download="bench-${ymd()}.webm" href="${url}">下载这段录音</a>`;
        $('#takes').prepend(d);
        return;
      }
      URL.revokeObjectURL(url);
      const t = await logActivity('speak', 'bench', { mode: 'bench' }, linkIs('/english/speak/?p=bench&mode=bench'));
      toast(t ? `已保存，记入第 ${t.day} 天` : '已保存');
      return rBench();
    }
    if (rec.busy) return;
    let ok;
    try { ok = await rec.start((v) => { const l = $('#lvl'); if (l) l.style.width = Math.round(v * 100) + '%'; }); } catch { toast('没拿到麦克风权限'); return; }
    if (!ok) return;
    if (g !== gen) { rec.cancel(); return; }
    t0 = Date.now(); b.classList.add('on'); b.textContent = '■ 停止并保存';
    clearInterval(timer);
    timer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); const c = $('#clock'); c.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; c.classList.toggle('warn', s >= 120); }, 500);
  });
}
// two-step delete instead of a blocking confirm() dialog
function confirmDel(row) {
  if (row.dataset.arm) return true;
  row.dataset.arm = '1';
  const b = row.querySelector('button'); b.textContent = '再点一次确认删除'; b.style.borderColor = 'var(--bad)';
  setTimeout(() => { delete row.dataset.arm; b.textContent = '删除'; b.style.borderColor = ''; }, 3000);
  return false;
}

function list() {
  const done = new Set(load('activity', []).filter((a) => a.kind === 'speak').map((a) => a.ref));
  let html = '';
  for (const ph of [1, 2, 3]) {
    html += `<h3>阶段 ${ph}</h3><div class="setlist">` + P.filter((p) => p.phase === ph).map((p) =>
      `<button type="button" data-p="${esc(p.id)}" aria-pressed="${p.id === prompt.id}">${done.has(p.id) ? '<span class="sc">✓</span>' : ''}${esc(p.title)}<small>${esc(p.kind_zh)}</small></button>`).join('') + '</div>';
  }
  $('#list').innerHTML = html;
}
$('#list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-p]'); if (!b) return;
  prompt = P.find((p) => p.id === b.dataset.p);
  if (mode === 'bench') mode = '432';
  render(); window.scrollTo({ top: 0, behavior: 'smooth' });
});
render();
