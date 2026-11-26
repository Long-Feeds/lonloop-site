/* 方法页：填入音频校验的统计（来自 reports/verify.json，构建进 course.json）。 */
import { $, esc, data } from './en.js?v=3bf6cc3c';

const { stats: s } = await data();
$('#vstats').innerHTML = `<div><b>${s.clips}</b><span>合成的音频</span></div>
  <div><b>${s.passed}</b><span>通过校验、已上线</span></div>
  <div><b>${s.second_opinion}</b><span>其中靠第二个模型通过</span></div>
  <div><b>${s.failed.length}</b><span>没通过、未上线</span></div>`;
if (s.manual) $('#vstats').insertAdjacentHTML('beforeend', `<div><b>${s.manual}</b><span>同音词或数字写法不同，人工判定放行</span></div>`);
if (s.failed.length) {
  $('#vfail').innerHTML = `<details style="margin:10px 0 0"><summary style="cursor:pointer;color:var(--muted)">没通过的 ${s.failed.length} 条（原文 → 模型听到的）</summary>
    <div class="tablewrap"><table><tbody>${s.failed.map((f) => `<tr><td class="dim">${esc(f.id)}</td><td>${esc(f.text)}</td><td class="dim">${esc(f.heard || '（无）')}</td></tr>`).join('')}</tbody></table></div></details>`;
}
