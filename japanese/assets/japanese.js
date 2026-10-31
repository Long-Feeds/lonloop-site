/* lonloop.com — 日语 (Japanese) section: audio, kana details, drills, progress.
   No dependencies, no build step. Every page ships its own data as JSON in
   <script type="application/json"> blocks; this file only behaves. */
(function () {
  'use strict';
  var LS = window.localStorage;
  function load(k, d) { try { var v = JSON.parse(LS.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { LS.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function data(id) { var el = document.getElementById(id); return el ? JSON.parse(el.textContent) : null; }

  /* ---------- settings ---------- */
  var S = load('jp.settings', { voice: 'n', rate: 1, romaji: true, detail: true, human: true });
  if (S.human === undefined) S.human = true;
  function applySettings() {
    document.documentElement.classList.toggle('no-romaji', !S.romaji);
    document.documentElement.classList.toggle('no-human', S.human === false);
    document.querySelectorAll('[data-set]').forEach(function (b) {
      var k = b.getAttribute('data-set'), v = b.getAttribute('data-val');
      var cur = String(S[k]);
      b.setAttribute('aria-pressed', String(cur === v));
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set]');
    if (!b) return;
    var k = b.getAttribute('data-set'), v = b.getAttribute('data-val');
    S[k] = (v === 'true') ? true : (v === 'false') ? false : (isNaN(+v) ? v : +v);
    save('jp.settings', S);
    applySettings();
  });

  /* ---------- audio ---------- */
  // manifest: id -> voices whose clip passed verification: "h" = real human
  // recording (Wikimedia Commons), "n"/"k" = female/male synthetic voice
  var AUD = data('jp-audio') || {};
  var VER = (document.querySelector('meta[name="jp-audio-version"]') || {}).content || '';
  var cur = null, curBtn = null, flip = false;
  function pickVoice(id, want) {
    var have = AUD[id] || '';
    if (!have) return null;
    if (want) return have.indexOf(want) >= 0 ? want : have.charAt(0);
    if (S.human !== false && have.indexOf('h') >= 0) return 'h';
    var syn = have.replace('h', '');
    if (!syn) return 'h';  // only a human recording exists: better than silence
    var v = S.voice;
    if (v === 'alt') { flip = !flip; v = flip ? 'n' : 'k'; }
    if (syn.indexOf(v) < 0) v = syn.charAt(0);
    return v;
  }
  function play(id, btn, want) {
    var v = pickVoice(id, want);
    if (!v) return null;
    if (cur) { cur.pause(); if (curBtn) curBtn.classList.remove('playing'); }
    var a = new Audio('/japanese/audio/' + v + '/' + id + '.mp3' + (VER ? '?v=' + VER : ''));
    a.playbackRate = S.rate || 1;
    if ('preservesPitch' in a) a.preservesPitch = true;
    cur = a; curBtn = btn || null;
    if (btn) btn.classList.add('playing');
    a.addEventListener('ended', function () { if (btn) btn.classList.remove('playing'); });
    a.addEventListener('error', function () { if (btn) btn.classList.remove('playing'); });
    var p = a.play();
    if (p && p.catch) p.catch(function () { if (btn) btn.classList.remove('playing'); });
    return v;
  }
  window.JP = { play: play, data: data, load: load, save: save, settings: S };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-say]');
    if (!b || b.closest('.drill')) return;
    play(b.getAttribute('data-say'), b, b.getAttribute('data-voice') || null);
  });

  /* ---------- kana grid + detail dialog ---------- */
  var KANA = data('jp-kana') || {};
  var strokes = null, strokesP = null;
  function getStrokes() {
    if (strokes) return Promise.resolve(strokes);
    if (!strokesP) strokesP = fetch('/japanese/assets/strokes.json' + (VER ? '?v=' + VER : '')).then(function (r) { return r.json(); }).then(function (j) { strokes = j; return j; });
    return strokesP;
  }
  var dlg = document.getElementById('kd');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function drawStrokes(box, ch, animate) {
    getStrokes().then(function (all) {
      // 拗音 / 外来语组合 are two glyphs (き + ゃ): draw them side by side,
      // numbering the strokes continuously in writing order
      var chars = Array.from(ch).filter(function (c) { return all[c]; });
      if (!chars.length) { box.innerHTML = ''; return; }
      var w = 109 * chars.length;
      var svg = '<svg viewBox="0 0 ' + w + ' 109" role="img" aria-label="' + esc(ch) + ' 的笔顺">';
      chars.forEach(function (c, k) { svg += '<path class="grid" d="M' + (k * 109 + 54.5) + ' 0V109M' + (k * 109) + ' 54.5H' + (k * 109 + 109) + '"/>'; });
      var no = 0;
      chars.forEach(function (c, k) {
        var st = all[c];
        svg += '<g transform="translate(' + (k * 109) + ' 0)">';
        st.paths.forEach(function (d) { svg += '<path class="ghost" d="' + d + '"/>'; });
        st.paths.forEach(function (d) { svg += '<path class="s" d="' + d + '"/>'; });
        st.nums.forEach(function (n) { no++; svg += '<text x="' + n[0] + '" y="' + n[1] + '">' + no + '</text>'; });
        svg += '</g>';
      });
      box.innerHTML = svg + '</svg>';
      var ps = box.querySelectorAll('path.s');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!animate || reduce) return;
      var t = 0;
      ps.forEach(function (p) {
        var L = p.getTotalLength();
        p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
        p.style.transition = 'none';
        var dur = Math.max(.35, L / 90);
        setTimeout(function () { p.style.transition = 'stroke-dashoffset ' + dur + 's ease-in-out'; p.style.strokeDashoffset = 0; }, 60 + t * 1000);
        t += dur + .15;
      });
    });
  }
  function openKana(ch) {
    var k = KANA[ch];
    if (!k || !dlg) return;
    var ex = k.ex;
    var html = '<button class="kd-close" aria-label="关闭" data-close>×</button><div class="kd-in"><div class="kd-top">' +
      '<div class="kd-stroke" id="kd-st"></div><div class="kd-info"><div class="big" lang="ja">' + esc(ch) + '</div><dl>' +
      '<dt>罗马字</dt><dd class="rom">' + esc(k.rom) + '</dd>' +
      '<dt>输入法</dt><dd class="rom">' + esc(k.typ) + '</dd>' +
      '<dt>IPA</dt><dd class="ipa">[' + esc(k.ipa) + ']</dd>' +
      (k.n ? '<dt>笔画</dt><dd>' + k.n + ' 画</dd>' : '') +
      (k.pair ? '<dt>' + (k.isKata ? '平假名' : '片假名') + '</dt><dd lang="ja">' + esc(k.pair) + '</dd>' : '') +
      '</dl>' + (k.org ? '<div class="kd-origin">字源：<span lang="ja">' + esc(k.org) + '</span>' + (k.orgNote ? '<br>' + esc(k.orgNote) : '') + '</div>' : '') +
      '</div></div><div class="kd-row">' +
      (AUD[k.id] ? (AUD[k.id].indexOf('h') >= 0 ? '<button class="kd-btn" data-kplay="h">▶ 真人</button>' : '') +
        (AUD[k.id].indexOf('n') >= 0 ? '<button class="kd-btn" data-kplay="n">▶ 女声</button>' : '') +
        (AUD[k.id].indexOf('k') >= 0 ? '<button class="kd-btn" data-kplay="k">▶ 男声</button>' : '')
        : '<span class="kd-origin">这个音的合成音频没有通过校验，暂不提供（见校验报告）。</span>') +
      '<button class="kd-btn" data-kreplay>↻ 重看笔顺</button></div>' +
      (k.tip ? '<div class="kd-ex">' + k.tip + '</div>' : '') +
      (ex ? '<div class="kd-ex">例词：<span class="w" lang="ja">' + esc(ex.w) + '</span> <span lang="ja">' + esc(ex.r) + '</span>' +
        (ex.acc != null ? ' <span class="accn">' + ex.acc + '</span>' : '') + ' — ' + esc(ex.zh) +
        ' <button class="say" data-say="' + ex.id + '" aria-label="播放例词"><svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg></button></div>' : '') +
      '</div>';
    dlg.innerHTML = html;
    dlg.dataset.ch = ch;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    var box = document.getElementById('kd-st');
    if (Array.from(ch).length > 1) box.classList.add('wide');
    drawStrokes(box, k.stroke || ch, true);
  }
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close ? dlg.close() : dlg.removeAttribute('open'); return; }
      var p = e.target.closest('[data-kplay]');
      if (p) { var k = KANA[dlg.dataset.ch]; if (k) play(k.id, p, p.getAttribute('data-kplay')); }
      if (e.target.closest('[data-kreplay]')) { var k2 = KANA[dlg.dataset.ch]; drawStrokes(document.getElementById('kd-st'), (k2 && k2.stroke) || dlg.dataset.ch, true); }
    });
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.kcell');
    if (!c) return;
    var ch = c.getAttribute('data-k');
    play(c.getAttribute('data-id'), c);
    if (S.detail) openKana(ch);
  });

  /* ---------- listening drills (minimal pairs, kana by ear) ---------- */
  // Each trial plays one option in a random voice: hearing the same contrast
  // from more than one speaker is the "high variability" in HVPT.
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  document.querySelectorAll('.drill[data-src]').forEach(function (box) {
    var sets = data(box.getAttribute('data-src'));
    if (!sets || !sets.length) return;
    var key = 'jp.drill.' + box.getAttribute('data-src');
    var stat = load(key, { n: 0, ok: 0 });
    var q = box.querySelector('.q'), opts = box.querySelector('.opts'), fb = box.querySelector('.fb'), sc = box.querySelector('.score');
    var answer = null, voice = 'n', answered = false, lastSet = -1;
    function score() { sc.textContent = stat.n ? ('累计 ' + stat.n + ' 题，正确率 ' + Math.round(stat.ok / stat.n * 100) + '%') : ''; }
    function next() {
      var si; do { si = Math.floor(Math.random() * sets.length); } while (sets.length > 1 && si === lastSet);
      lastSet = si;
      var set = sets[si];
      answer = set[Math.floor(Math.random() * set.length)];
      var av = AUD[answer.id] || 'n';
      voice = av.charAt(Math.floor(Math.random() * av.length));  // every verified voice, human included
      answered = false; fb.textContent = ''; fb.className = 'fb';
      opts.innerHTML = '';
      shuffle(set.slice()).forEach(function (o) {
        var b = document.createElement('button');
        b.className = 'opt'; b.type = 'button';
        b.innerHTML = '<span class="jw" lang="ja">' + esc(o.label || o.w) + '</span>' + (o.sub ? '<span class="zh">' + esc(o.sub) + '</span>' : '');
        b.addEventListener('click', function () {
          if (answered) { play(o.id, b, voice); return; }
          answered = true; stat.n++;
          var right = o.id === answer.id;
          if (right) stat.ok++;
          save(key, stat);
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) opts.querySelectorAll('.opt').forEach(function (x, i) { if (x.__id === answer.id) x.classList.add('right'); });
          fb.textContent = right ? '✓ 对了。点任一选项可以再听它的读音对比。' : '✗ 听到的是「' + (answer.label || answer.w) + '」。点两个选项对比着听。';
          fb.className = 'fb ' + (right ? 'ok' : 'no');
          score();
        });
        b.__id = o.id;
        opts.appendChild(b);
      });
      setTimeout(function () { play(answer.id, q.querySelector('.big-say'), voice); }, 150);
    }
    q.querySelector('.big-say').addEventListener('click', function (e) { e.stopPropagation(); if (answer) play(answer.id, e.currentTarget, voice); });
    box.querySelector('.next').addEventListener('click', next);
    var started = false;
    box.querySelector('.start').addEventListener('click', function (e) {
      e.currentTarget.hidden = true; box.querySelector('.run').hidden = false; started = true; next();
    });
    score();
  });

  /* ---------- lesson done toggle + index progress ---------- */
  var done = load('jp.done', {});
  document.querySelectorAll('.done-toggle').forEach(function (b) {
    var id = b.getAttribute('data-lesson');
    function paint() { var d = !!done[id]; b.setAttribute('aria-pressed', String(d)); b.querySelector('span').textContent = d ? '已学完本课 ✓' : '标记为已学完'; }
    b.addEventListener('click', function () { done[id] = !done[id]; save('jp.done', done); paint(); });
    paint();
  });
  var lis = document.querySelectorAll('.lessons li[data-lesson]');
  if (lis.length) {
    var n = 0;
    lis.forEach(function (li) { if (done[li.getAttribute('data-lesson')]) { li.classList.add('done'); li.querySelector('.st').textContent = '已学完'; n++; } });
    var bar = document.querySelector('.progress i'), lab = document.getElementById('prog-lab');
    if (bar) bar.style.width = (n / lis.length * 100) + '%';
    if (lab) lab.textContent = n + ' / ' + lis.length + ' 课';
  }

  applySettings();
})();
