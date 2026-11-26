/* 今日：12 周计划里「当前这一天」的任务清单、进度、周记、备份。 */
import { $, esc, load, save, data, progress, markTask, dayComplete, ymd, toast } from './en.js?v=3bf6cc3c';

const { plan } = await data();
let view = null;

function current(p = progress()) {
  const d = plan.find((day) => !dayComplete(day, p));
  return d ? d.n : plan.length;
}

function streak(log) {
  let n = 0;
  const d = new Date();
  if (!log[ymd(d)]) d.setDate(d.getDate() - 1); // today not done yet doesn't break the streak
  while (log[ymd(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function render() {
  const p = progress();
  const cur = current(p);
  if (view == null) view = cur;
  const day = plan[view - 1];
  const doneMap = p.done[day.n] || {};
  const phaseName = ['', '解码与发音', '真实语速', '会议与面试'][day.p];
  $('#day-title').textContent = `第 ${day.n} 天` + (day.review ? ' · 周测' : '') + (day.n === cur ? '' : day.n < cur ? '（已完成）' : '（还没到）');
  const mins = day.tasks.filter((t) => !t.opt).reduce((s, t) => s + t.m, 0);
  $('#day-sub').textContent = `第 ${day.w} 周 · 阶段 ${day.p}：${phaseName} · 约 ${mins} 分钟`;
  $('#tasks').innerHTML = day.tasks.map((t, i) => {
    const on = !!doneMap[i];
    const links = (t.links || []).map((l) =>
      `<a class="btn sm${l.ext ? '' : ' pri'}" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}${l.ext ? ' ↗' : ''}</a>`).join('');
    return `<li class="task${on ? ' done' : ''}">
      <button class="ck" type="button" data-i="${i}" aria-pressed="${on}" aria-label="${on ? '标为未完成' : '标为完成'}：${esc(t.t)}">✓</button>
      <div class="tt"><b>${esc(t.t)}</b><div class="d">${esc(t.d)}</div>${links ? `<div class="row go">${links}</div>` : ''}</div>
      <span class="mins">${t.m ? t.m + ' 分钟' : '选做'}</span></li>`;
  }).join('');
  $('#prev').disabled = view <= 1;
  $('#next').disabled = view >= plan.length;
  $('#cur').hidden = view === cur;

  const daysDone = plan.filter((d) => dayComplete(d, p)).length;
  const scores = Object.values(load('listen.scores', {})).map((s) => s.last).filter((x) => x != null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 100) + '%' : '—';
  const cards = Object.keys(load('srs', {})).length;
  $('#kpis').innerHTML = `<div><b>${streak(p.log)}</b><span>连续练习天数</span></div>
    <div><b>${daysDone} / ${plan.length}</b><span>完成的课程天数</span></div>
    <div><b>${avg}</b><span>听写正确率（各组最近一次）</span></div>
    <div><b>${cards}</b><span>已学表达卡片</span></div>`;

  $('#cal').innerHTML = plan.map((d) => {
    const dm = p.done[d.n] || {};
    const k = Object.keys(dm).length;
    const cls = [dayComplete(d, p) ? 'full' : k ? 'part' : '', d.n === view ? 'cur' : '', d.review ? 'rv' : ''].join(' ');
    return `<i class="${cls}" data-n="${d.n}" role="button" tabindex="0" aria-label="第 ${d.n} 天">${d.n}</i>`;
  }).join('');
  journal(day.w);
}

function journal(curWeek) {
  const j = load('journal', {});
  const upto = Math.max(curWeek, ...Object.keys(j).map(Number), 1);
  let html = '';
  for (let w = upto; w >= 1; w--) {
    html += `<label style="display:block;margin:10px 0 4px;color:var(--muted);font-size:14px">第 ${w} 周</label>
      <textarea data-w="${w}" rows="3" style="width:100%;background:var(--bg2);border:1px solid var(--line);border-radius:10px;color:var(--txt);font:inherit;font-size:15px;padding:9px 12px" placeholder="听不出：…  说的时候卡在：…  下周多练：…">${esc(j[w] || '')}</textarea>`;
  }
  const box = $('#journal-box');
  if (box.dataset.w === String(upto)) return; // don't clobber what is being typed
  box.dataset.w = String(upto);
  box.innerHTML = html;
}

$('#journal-box').addEventListener('input', (e) => {
  const t = e.target.closest('textarea[data-w]');
  if (!t) return;
  const j = load('journal', {}); j[t.dataset.w] = t.value; save('journal', j);
});
$('#tasks').addEventListener('click', (e) => {
  const b = e.target.closest('.ck');
  if (!b) return;
  const on = b.getAttribute('aria-pressed') !== 'true';
  const before = current();
  markTask(view, +b.dataset.i, on);
  const after = current();
  if (on && after > before && view === before) toast(`第 ${before} 天完成 🎉`);
  render();
});
$('#prev').addEventListener('click', () => { view--; render(); });
$('#next').addEventListener('click', () => { view++; render(); });
$('#cur').addEventListener('click', () => { view = current(); render(); });
const jump = (e) => { if (!load('start', null)) return; const c = e.target.closest('[data-n]'); if (c) { view = +c.dataset.n; render(); $('#today').scrollIntoView({ behavior: 'smooth' }); } };
$('#cal').addEventListener('click', jump);
$('#cal').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jump(e); } });

$('#export').addEventListener('click', () => {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('en.')) out[k] = localStorage.getItem(k); }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'lonloop-english', at: new Date().toISOString(), data: out })], { type: 'application/json' }));
  a.download = `english-backup-${ymd()}.json`;
  a.click();
});
$('#import').addEventListener('change', async (e) => {
  const f = e.target.files[0];
  e.target.value = ''; // choosing the same file again must fire change again
  if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (j.app !== 'lonloop-english') throw new Error('not ours');
    for (const [k, v] of Object.entries(j.data)) if (k.startsWith('en.')) localStorage.setItem(k, v);
    toast('已导入'); view = null; $('#journal-box').dataset.w = ''; init();
  } catch { toast('文件不对：请选择从这里导出的备份'); }
});

function init() {
  const started = load('start', null);
  $('#setup').hidden = !!started;
  $('#today').hidden = !started;
  if (started) render();
  else $('#cal').innerHTML = plan.map((d) => `<i class="${d.review ? 'rv' : ''}" data-n="${d.n}">${d.n}</i>`).join('');
}
$('#start-btn').addEventListener('click', () => { save('start', ymd()); init(); });
init();
