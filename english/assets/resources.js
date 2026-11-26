/* 外部资源：从 resources.yaml（构建进 course.json）渲染。 */
import { $, esc, data } from './en.js?v=3bf6cc3c';

const D = await data();
const CAT = {
  intensive: ['精听与跟读材料', '有免费文稿，每天「真实材料精听」从这里轮换'],
  extensive: ['泛听：通勤和碎片时间', '真实语速，听大意，不查词'],
  'speaking-ai': ['AI 口语陪练', '「口语」页第二遍练习时用'],
  pronunciation: ['发音工具', '给你的发音打分，或者听一个词在真实语境里怎么说'],
  tutors: ['真人老师与语伴', '预算允许时最值得花钱的一项：每周一次真人对话'],
  test: ['免费测试：衡量进步', '第 1 周和第 12 周各做一次'],
};
let n = 0;
$('#res').innerHTML = D.resources.map((c) => {
  const [t, sub] = CAT[c.category] || [c.category, ''];
  n += c.items.length;
  return `<h2 id="${esc(c.category)}">${esc(t)}</h2><p class="dim" style="font-size:14px;margin-bottom:6px">${esc(sub)}</p><div class="res-list">` +
    c.items.filter((r) => /^https:\/\//.test(r.url)).map((r) => `<div class="res"><div class="t"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)} ↗</a></div>
      <div class="m">${[r.cost, r.level, r.accent].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      <div class="why">${esc(r.why)}</div>${r.caveat ? `<div class="cv">注意：${esc(r.caveat)}</div>` : ''}</div>`).join('') + '</div>';
}).join('');
const dates = D.resources.flatMap((c) => c.items.map((r) => r.verified)).filter(Boolean).sort();
$('#meta').innerHTML = `<span>${n} 个资源</span>${dates.length ? `<span>链接核实于 ${esc(dates[dates.length - 1])}</span>` : ''}<span>收费以官网为准</span>`;
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
