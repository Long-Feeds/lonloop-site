/* 发音与连读：微课 + 最小对立词听辨。 */
import { $, esc, data, play, sayBtn, bindRate, logActivity } from './en.js?v=3bf6cc3c';

const D = await data();
bindRate();

$('#cs').innerHTML = D.connected.map((g, n) => `<section id="${esc(g.id)}" style="scroll-margin-top:70px">
  <h3>${n + 1} · ${esc(g.title)}</h3><p>${esc(g.explain)}</p>
  ${g.examples.map((e) => `<div class="ex"><div class="l">${sayBtn(e.a)}<div><div class="t">${esc(e.text)}</div>
    ${e.hear ? `<div class="h ipa">/${esc(e.hear)}/</div>` : ''}${e.note ? `<div class="n">${esc(e.note)}</div>` : ''}</div></div></div>`).join('')}
  <div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-done="${esc(g.id)}">✓ 这节学完了</button></div>
</section>`).join('');

$('#pr').innerHTML = D.pron.map((g, n) => `<section id="${esc(g.id)}" style="scroll-margin-top:70px">
  <h3>${n + 1} · ${esc(g.title)}</h3><p>${esc(g.explain)}</p>
  <div class="pairs">${g.pairs.map((p) => `<div class="pair">${sayBtn(p[0].a)}<span class="w">${esc(p[0].w)}</span><span class="vs">/</span>${sayBtn(p[1].a)}<span class="w">${esc(p[1].w)}</span></div>`).join('')}</div>
  ${g.sentences.map((s) => `<div class="ex"><div class="l">${sayBtn(s.a)}<div class="t">${esc(s.text)}</div></div></div>`).join('')}
  ${g.pairs.length ? `<div class="drill" data-g="${esc(g.id)}"><b>听辨练习</b> <span class="dim" style="font-size:13.5px">· 10 题</span><div class="q"></div></div>` : ''}
  <div class="row" style="margin:6px 0 10px"><button class="btn sm" type="button" data-done="${esc(g.id)}">✓ 这节学完了</button></div>
</section>`).join('');

document.querySelectorAll('.drill').forEach((el) => drill(el, D.pron.find((g) => g.id === el.dataset.g)));

function drill(el, g) {
  const st = { n: 0, right: 0 };
  const box = el.querySelector('.q');
  const ask = () => {
    if (st.n >= 10) {
      box.innerHTML = `<div class="fb">10 题对了 <b style="color:var(--txt)">${st.right}</b> 题。${st.right >= 9 ? '耳朵已经分得清了，接下来练嘴：对着单词表逐对读，录下来听。' : '再来一轮，错的那几对多点几次对比着听。'}</div><button class="btn sm" type="button">再来一轮</button>`;
      box.querySelector('button').addEventListener('click', () => { st.n = 0; st.right = 0; ask(); });
      return;
    }
    const pair = g.pairs[Math.floor(Math.random() * g.pairs.length)];
    const k = Math.random() < 0.5 ? 0 : 1;
    const opts = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
    box.innerHTML = `<div class="opts"><button class="btn sm" type="button" data-play>▶ 再听</button>${opts.map((o) => `<button class="opt" type="button" data-w="${esc(o.w)}">${esc(o.w)}</button>`).join('')}</div><div class="fb">第 ${st.n + 1} / 10 题：听到的是哪个？</div>`;
    const target = pair[k];
    box.querySelector('[data-play]').addEventListener('click', () => play(target.a, { rate: 1 }));
    box.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      const ok = b.dataset.w === target.w;
      st.n++; if (ok) st.right++;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) box.querySelector(`.opt[data-w="${CSS.escape(target.w)}"]`).classList.add('right');
      box.querySelectorAll('.opt').forEach((x) => (x.disabled = true));
      box.querySelector('.fb').textContent = ok ? '✓ 对' : `✗ 是 ${target.w}`;
      setTimeout(ask, ok ? 700 : 1600);
    }));
    play(target.a, { rate: 1 });
  };
  box.innerHTML = '<button class="btn sm pri" type="button">开始听辨</button>';
  box.querySelector('button').addEventListener('click', ask); // first play needs a user gesture
}

document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-done]');
  if (!b) return;
  const id = b.dataset.done;
  const t = await logActivity('lesson', id, {}, (task) => (task.links || []).some((l) => l.href === `/english/sounds/#${id}`));
  b.textContent = t ? `✓ 已记入第 ${t.day} 天` : '✓ 已记录';
  b.disabled = true;
});

if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
