var Ke=Object.defineProperty;var Qe=(a,i,e)=>i in a?Ke(a,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[i]=e;var $=(a,i,e)=>Qe(a,typeof i!="symbol"?i+"":i,e);import{P as D}from"./Panel-D0RXcFBq.js";import{X as Je,Y as et,Z as tt,_ as it}from"./main-CPzCGdxy.js";import{t as x,k as st,f as O}from"./panel-storage-Duaw_bEH.js";import{e as n,u as E,j as nt,f as ne,a as Z,b as at}from"./dom-utils-CDIB5TLV.js";import{p as rt,b as ot,q as lt}from"./widget-store-q5uKLox1.js";import{m as ae}from"./sparkline-EyuwviXB.js";import{g as be,E as He,a as j,c as V,S as X,r as N}from"./embed-url-q0YUYtcM.js";import{k as ke}from"./gdelt-intel-RxncKK9g.js";import{a as K,A as Q}from"./attribution-footer-DHMyVkTI.js";import{f as xe,a as $e,s as ct}from"./disruption-timeline-rn1TsGcA.js";import{p as dt,a as pt,d as ut}from"./pipeline-evidence-CqE_XO-h.js";import{getCachedPipelineRegistries as ht,setCachedPipelineRegistries as Ee}from"./pipeline-registry-store-Box4BOAI.js";import{d as ft}from"./storage-evidence-DthMONVc.js";import{getCachedStorageFacilityRegistry as gt,setCachedStorageFacilityRegistry as Te}from"./storage-facility-registry-store-DzknsQLV.js";import{d as re,c as mt}from"./shortage-evidence-CwhDyV8K.js";import{getCachedFuelShortageRegistry as yt,setCachedFuelShortageRegistry as Ae}from"./fuel-shortage-registry-store-ClLJJsBG.js";import{f as We}from"./hormuz-tracker-BJy6u8Ii.js";import{fetchCommodityQuotes as vt}from"./index-CdD8sbFY.js";import{b as bt}from"./_energy-risk-overview-state-0LaVUMqp.js";import{c as xt}from"./layout-batch-B9PC4ceT.js";import{e as Pe}from"./extent-Ccx1MofX.js";import{l as oe}from"./linear-B9BZxnEW.js";import{m as he}from"./max-DBeXZoyG.js";import{s as fe}from"./string-B04_ldoR.js";import{a as $t}from"./arc-CGlAFq2g.js";import{i as wt}from"./continuous-Ds-kXw0U.js";import{a as ge,m as Y}from"./monotone-804fPAVO.js";import{l as De}from"./line-DEDRnOn1.js";import{s as Ct,n as St,a as kt}from"./stack-DSObyWpB.js";function Et(a){return!!(a!=null&&a.wtiPrice||a!=null&&a.brentPrice||a!=null&&a.usProduction||a!=null&&a.usInventory)}class Tt extends D{constructor(){super({id:"energy-complex",title:x("panels.energyComplex"),defaultRowSpan:2,infoTooltip:x("components.energyComplex.infoTooltip")});$(this,"analytics",null);$(this,"tape",[]);$(this,"crudeWeeks",[]);$(this,"natGasWeeks",[]);$(this,"euGas",null);$(this,"oilStocksAnalysis",null);$(this,"lngVulnerability",null)}updateAnalytics(e){this.analytics=e,this.render()}updateTape(e){this.tape=e.filter(t=>t.price!==null),this.render()}updateCrudeInventories(e){this.crudeWeeks=e,this.render()}updateNatGas(e){this.natGasWeeks=e,this.render()}updateEuGasStorage(e){this.euGas=e.unavailable?null:e,this.render()}setOilStocksAnalysis(e){this.oilStocksAnalysis=e.unavailable?null:e,this.render()}updateLngVulnerability(e){var t;this.lngVulnerability=(t=e==null?void 0:e.top20LngDependent)!=null&&t.length?e:null,this.render()}renderOilStocksSection(){var d,l,h,u;const e=this.oilStocksAnalysis;if(!e||e.ieaMembers.length===0)return"";const t=e.ieaMembers.map(p=>{const f=p.netExporter?'<span class="energy-net-exporter-badge">Net Exporter</span>':p.daysOfCover!=null?n(String(p.daysOfCover))+" d":"—",y=p.belowObligation?'<span class="energy-below-obligation-badge">Below 90d</span>':"";return`
        <tr class="oil-stocks-row">
          <td class="oil-stocks-rank">${n(String(p.rank))}</td>
          <td class="oil-stocks-iso">${n(p.iso2)}</td>
          <td class="oil-stocks-days">${f}${y}</td>
          <td class="oil-stocks-vs">${p.vsObligation!=null?(p.vsObligation>0?"+":"")+n(String(p.vsObligation)):"—"}</td>
        </tr>`}).join(""),s=e.regionalSummary,r=((d=s==null?void 0:s.europe)==null?void 0:d.avgDays)!=null?`<div class="oil-stocks-region-row"><span class="oil-stocks-region-name">Europe</span><span>avg ${n(String(s.europe.avgDays))}d / min ${n(String(((l=s.europe)==null?void 0:l.minDays)??"—"))}d</span>${(s.europe.countBelowObligation??0)>0?`<span class="energy-below-obligation-badge">${n(String(s.europe.countBelowObligation))} below 90d</span>`:""}</div>`:"",c=((h=s==null?void 0:s.asiaPacific)==null?void 0:h.avgDays)!=null?`<div class="oil-stocks-region-row"><span class="oil-stocks-region-name">Asia-Pacific</span><span>avg ${n(String(s.asiaPacific.avgDays))}d / min ${n(String(((u=s.asiaPacific)==null?void 0:u.minDays)??"—"))}d</span>${(s.asiaPacific.countBelowObligation??0)>0?`<span class="energy-below-obligation-badge">${n(String(s.asiaPacific.countBelowObligation))} below 90d</span>`:""}</div>`:"",o=s!=null&&s.northAmerica?`<div class="oil-stocks-region-row"><span class="oil-stocks-region-name">North America</span><span>${n(String(s.northAmerica.netExporters??0))} net exporter(s)${s.northAmerica.avgDays!=null?`, avg ${n(String(s.northAmerica.avgDays))}d`:""}</span></div>`:"";return`
      <div class="energy-tape-section" style="margin-top:8px">
        <div class="energy-section-title">IEA Oil Stocks — Days of Cover</div>
        <table class="oil-stocks-table">
          <thead><tr><th>#</th><th>Ctry</th><th>Days</th><th>vs 90d</th></tr></thead>
          <tbody>${t}</tbody>
        </table>
        <div class="oil-stocks-regional" style="margin-top:6px">
          ${r}${c}${o}
        </div>
        <div class="indicator-date" style="margin-top:4px">Data: ${n(e.dataMonth)} (IEA)</div>
      </div>`}renderLngVulnerabilitySection(){const e=this.lngVulnerability;return!e||e.top20LngDependent.length===0?"":`
      <div class="energy-tape-section" style="margin-top:8px">
        <div class="energy-section-title">LNG Vulnerability</div>
        <table class="oil-stocks-table">
          <thead><tr><th>Country</th><th>LNG Share</th><th>LNG Imports</th></tr></thead>
          <tbody>${e.top20LngDependent.slice(0,5).map(r=>`
      <tr class="oil-stocks-row">
        <td class="oil-stocks-iso">${n(r.iso2)}</td>
        <td class="oil-stocks-days">${n((r.lngShareOfImports*100).toFixed(1))}%</td>
        <td class="oil-stocks-vs">${n(String(Math.round(r.lngImportsTj)))} TJ</td>
      </tr>`).join("")}</tbody>
        </table>
        <div class="indicator-date" style="margin-top:4px">Data: ${n(e.dataMonth)} (JODI Gas)</div>
      </div>`}render(){var _,J,F,U,H,B,ee,te,ie;const e=new Set(this.tape.filter(C=>C.price!==null).map(C=>C.symbol)),t=e.has("CL=F"),s=e.has("BZ=F"),r=[t?null:(_=this.analytics)==null?void 0:_.wtiPrice,s?null:(J=this.analytics)==null?void 0:J.brentPrice,(F=this.analytics)==null?void 0:F.usProduction,(U=this.analytics)==null?void 0:U.usInventory].filter(Boolean);if(r.length===0&&this.tape.length===0&&this.crudeWeeks.length===0&&this.natGasWeeks.length===0&&!this.euGas&&!this.oilStocksAnalysis&&!this.lngVulnerability){this.setSafeContent(E(`<div class="economic-empty">${x("components.energyComplex.noData")}</div>`,"legacy Panel.setContent() migration"));return}const c=[];Et(this.analytics)&&c.push("EIA"),this.tape.length>0&&c.push(x("components.energyComplex.liveTapeSource")),this.euGas&&c.push("GIE AGSI+"),this.oilStocksAnalysis&&c.push("IEA"),this.lngVulnerability&&c.push("JODI Gas");const o=this.crudeWeeks[0]??null,d=(o==null?void 0:o.weeklyChangeMb)??null,l=d!==null&&d>0?"+":"",h=d===null?"":d>0?"change-negative":"change-positive",u=this.crudeWeeks.slice().reverse().map(C=>C.stocksMb),p=this.natGasWeeks[0]??null,f=(p==null?void 0:p.weeklyChangeBcf)??null,y=f!==null&&f>0?"+":"",b=f===null?"":f>0?"change-negative":"change-positive",g=this.natGasWeeks.slice().reverse().map(C=>C.storBcf),m=((H=this.euGas)==null?void 0:H.fillPct)??null,w=((B=this.euGas)==null?void 0:B.fillPctChange1d)??null,S=w!==null&&w>0?"+":"",k=w===null?"":w>0?"change-positive":"change-negative",z=((ee=this.euGas)==null?void 0:ee.trend)??"",I=(((te=this.euGas)==null?void 0:te.history)??[]).slice().reverse().map(C=>C.fillPct);this.setSafeContent(E(`
      <div class="energy-complex-content">
        ${r.length>0?`
          <div class="energy-summary-grid">
            ${r.map(C=>{if(!C)return"";const W=Je(C.trend,C.name.includes("Production")),se=`${C.changePct>0?"+":""}${C.changePct.toFixed(1)}%`;return`
                <div class="energy-summary-card">
                  <div class="energy-summary-head">
                    <span class="energy-summary-name">${n(C.name)}</span>
                    <span class="energy-summary-trend" style="color:${n(W)}">${n(et(C.trend))}</span>
                  </div>
                  <div class="energy-summary-value">${n(tt(C.current,C.unit))} <span class="energy-unit">${n(C.unit)}</span></div>
                  <div class="energy-summary-change" style="color:${n(W)}">${n(se)}</div>
                  <div class="indicator-date">${n(C.lastUpdated.slice(0,10))}</div>
                </div>
              `}).join("")}
          </div>
        `:""}
        ${this.crudeWeeks.length>0?`
          <div class="energy-tape-section" style="margin-top:8px">
            <div class="energy-section-title">US Crude Inventories (Mb)</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
              ${ae(u,d,80,22)}
              <div>
                <span class="commodity-price">${n(o?o.stocksMb.toFixed(1):"—")} Mb</span>
                ${d!==null?`<span class="commodity-change ${n(h)}" style="margin-left:6px">${n(l+d.toFixed(1))} WoW</span>`:""}
              </div>
            </div>
            <div class="indicator-date" style="margin-top:2px">${n((o==null?void 0:o.period)??"")}</div>
          </div>
        `:""}
        ${this.natGasWeeks.length>0?`
          <div class="energy-tape-section" style="margin-top:8px">
            <div class="energy-section-title">US Nat Gas Storage (Bcf)</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
              ${ae(g,f,80,22)}
              <div>
                <span class="commodity-price">${n(p?p.storBcf.toFixed(0):"—")} Bcf</span>
                ${f!==null?`<span class="commodity-change ${n(b)}" style="margin-left:6px">${n(y+f.toFixed(0))} WoW</span>`:""}
              </div>
            </div>
            <div class="indicator-date" style="margin-top:2px">${n((p==null?void 0:p.period)??"")}</div>
          </div>
        `:""}
        ${m!==null?`
          <div class="energy-tape-section" style="margin-top:8px">
            <div class="energy-section-title">EU Gas Storage (Fill %)</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
              ${ae(I,w,80,22)}
              <div>
                <span class="commodity-price">${n(m.toFixed(1))}%</span>
                ${w!==null?`<span class="commodity-change ${n(k)}" style="margin-left:6px">${n(S+w.toFixed(2))}% 1d</span>`:""}
                ${z?`<span style="margin-left:6px;font-size:10px;color:var(--text-dim)">${n(z)}</span>`:""}
              </div>
            </div>
            <div class="indicator-date" style="margin-top:2px">${n(((ie=this.euGas)==null?void 0:ie.updatedAt)??"")}</div>
          </div>
        `:""}
        ${this.tape.length>0?`
          <div class="energy-tape-section">
            <div class="energy-section-title">${x("components.energyComplex.liveTape")}</div>
            <div class="commodities-grid energy-tape-grid">
              ${this.tape.map(C=>`
                <div class="commodity-item energy-tape-card">
                  <div class="commodity-name">${n(C.display)}</div>
                  ${ae(C.sparkline,C.change,60,18)}
                  <div class="commodity-price">${rt(C.price)}</div>
                  <div class="commodity-change ${ot(C.change??0)}">${lt(C.change??0)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}
        ${this.renderOilStocksSection()}
        ${this.renderLngVulnerabilitySection()}
      </div>
      <div class="economic-footer">
        <span class="economic-source">${n(c.join(" • "))}</span>
      </div>
    `,"legacy Panel.setContent() migration"))}}const ns=Object.freeze(Object.defineProperty({__proto__:null,EnergyComplexPanel:Tt},Symbol.toStringTag,{value:"Module"})),R=400,de=150,At=280,A=42,we=10,L=10,Ye=22,Ce=R-A-we,G=de-L-Ye;function Pt(a,i){const e=new Map(a.map(r=>[r.period,r.stocksMb])),t=new Map(i.map(r=>[r.period,r.stocksMb]));return[...new Set([...e.keys(),...t.keys()])].sort().map(r=>({period:r,crudeMb:e.get(r)??null,sprMb:t.get(r)??null}))}function Dt(a){return a.slice(5)}function M(a,i=1){return a.toFixed(i)}function Ot(a,i,e,t=4){const s=i-a||1;return Array.from({length:t+1},(r,c)=>{const o=a+c/t*s,d=L+G-c/t*G;return`<line x1="${A}" y1="${d.toFixed(1)}" x2="${R-we}" y2="${d.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${A-4}" y="${d.toFixed(1)}" text-anchor="end" fill="rgba(255,255,255,0.35)" font-size="7" dominant-baseline="middle">${n(M(o,0))}${n(e)}</text>`}).join("")}function qe(a,i){const e=Math.max(1,Math.floor(i/5));return a.map((t,s)=>s%e!==0&&s!==i-1?"":`<text x="${(A+s/Math.max(1,i-1)*Ce).toFixed(1)}" y="${de-2}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="7">${n(t)}</text>`).join("")}function Ze(a){if(a.length<2)return"";const i=a[0],e=a[a.length-1],t=a.map(s=>`${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" L");return`M${i.x.toFixed(1)},${i.y.toFixed(1)} L${t} L${e.x.toFixed(1)},${L+G} L${i.x.toFixed(1)},${L+G} Z`}function Mt(a){const i=a.filter(g=>g.crudeMb!=null&&g.sprMb!=null);if(i.length<2){const g=a.filter(m=>m.crudeMb!=null);return g.length<2?'<div style="text-align:center;color:var(--text-dim);padding:16px;font-size:11px">Insufficient data for chart</div>':zt(g)}const e=i.map(g=>g.crudeMb+g.sprMb),t=Math.max(...e)*1.05,s=Math.min(...i.map(g=>g.sprMb))*.95,r=t-s||1,c=g=>L+G-(g-s)/r*G,o=g=>A+g/Math.max(1,i.length-1)*Ce,d=i.map((g,m)=>({x:o(m),y:c(g.sprMb)})),l=`<path d="${Ze(d)}" fill="#f59e0b" opacity="0.25"/>`,h=`<polyline points="${d.map(g=>`${g.x.toFixed(1)},${g.y.toFixed(1)}`).join(" ")}" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.8"/>`,u=i.map((g,m)=>({x:o(m),y:c(g.crudeMb+g.sprMb)})),p=`<path d="M${u.map(g=>`${g.x.toFixed(1)},${g.y.toFixed(1)}`).join(" L")} L${d.map(g=>`${g.x.toFixed(1)},${g.y.toFixed(1)}`).reverse().join(" L")} Z" fill="#3b82f6" opacity="0.2"/>`,f=`<polyline points="${u.map(g=>`${g.x.toFixed(1)},${g.y.toFixed(1)}`).join(" ")}" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.9"/>`,y=Ot(s,t,""),b=qe(i.map(g=>Dt(g.period)),i.length);return`<svg viewBox="0 0 ${R} ${de}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">${y}${b}${l}${h}${p}${f}</svg>`}function zt(a){const i=a.map(e=>({x:e.period,y:e.crudeMb}));return ve(i,"#3b82f6","")}function ve(a,i,e,t=de){if(a.length<2)return'<div style="text-align:center;color:var(--text-dim);padding:12px;font-size:11px">Insufficient data</div>';const s=t-L-Ye,r=a.map(y=>y.y),c=Math.max(...r)*1.02,o=Math.min(...r)*.98,d=c-o||1,l=a.map((y,b)=>({x:A+b/Math.max(1,a.length-1)*Ce,y:L+s-(y.y-o)/d*s})),h=l.map(y=>`${y.x.toFixed(1)},${y.y.toFixed(1)}`).join(" "),u=Ze(l),p=Array.from({length:4},(y,b)=>{const g=o+b/3*d,m=L+s-b/3*s;return`<line x1="${A}" y1="${m.toFixed(1)}" x2="${R-we}" y2="${m.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${A-4}" y="${m.toFixed(1)}" text-anchor="end" fill="rgba(255,255,255,0.35)" font-size="7" dominant-baseline="middle">${n(M(g,0))}${n(e)}</text>`}).join(""),f=qe(a.map(y=>y.x.slice(5)),a.length);return`<svg viewBox="0 0 ${R} ${t}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">${p}${f}<path d="${u}" fill="${i}" opacity="0.12"/><polyline points="${h}" fill="none" stroke="${i}" stroke-width="1.5" opacity="0.9"/></svg>`}function _t(a){const i=[...a].filter(l=>l.daysOfCover!=null||l.netExporter).sort((l,h)=>l.netExporter&&!h.netExporter?1:!l.netExporter&&h.netExporter?-1:(l.daysOfCover??999)-(h.daysOfCover??999)).slice(0,20);if(!i.length)return'<div style="text-align:center;color:var(--text-dim);padding:12px;font-size:11px">No IEA data</div>';const e=Math.max(200,...i.filter(l=>l.daysOfCover!=null).map(l=>l.daysOfCover)),t=Math.min(14,(At-20)/i.length),s=R-A-10,r=15+i.length*t+5,c=i.map((l,h)=>{const u=l.daysOfCover??0,p=Math.max(0,u/e*s),f=15+h*t,y=l.netExporter?"#6b7280":l.belowObligation?"#ef4444":"#22c55e",b=l.netExporter?"Exp":u>0?`${u.toFixed(0)}d`:"N/A";return`<rect x="${A}" y="${f.toFixed(1)}" width="${p.toFixed(1)}" height="${(t-2).toFixed(1)}" fill="${y}" opacity="0.6" rx="1"/>
      <text x="${A-3}" y="${(f+t/2).toFixed(1)}" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="7" dominant-baseline="middle">${n(l.iso2)}</text>
      <text x="${(A+p+3).toFixed(1)}" y="${(f+t/2).toFixed(1)}" fill="rgba(255,255,255,0.6)" font-size="7" dominant-baseline="middle">${n(b)}</text>`}).join(""),o=A+90/e*s,d=`<line x1="${o.toFixed(1)}" y1="10" x2="${o.toFixed(1)}" y2="${r-5}" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4 3"/>
    <text x="${o.toFixed(1)}" y="9" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="7">90d</text>`;return`<svg viewBox="0 0 ${R} ${r}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">${c}${d}</svg>`}function q(a,i,e=""){return`<div class="energy-tape-section" style="margin-top:8px">
    <div class="energy-section-title">${n(a)}</div>
    <div style="border-radius:6px;background:rgba(255,255,255,0.02);padding:4px 0">${i}</div>
    ${e?`<div style="margin-top:3px;font-size:10px;color:var(--text-dim)">${e}</div>`:""}
  </div>`}function me(a,i){if(a==null)return"";const e=a>=0?"+":"";return`<span class="commodity-change ${a>=0?"change-positive":"change-negative"}">${n(e+M(a))} ${n(i)}</span>`}class Ft extends D{constructor(){super({id:"oil-inventories",title:x("panels.oilInventories"),showCount:!1,infoTooltip:x("components.oilInventories.infoTooltip"),defaultRowSpan:2})}async fetchData(){var i,e;try{const t=await fetch(st("/api/economic/v1/get-oil-inventories"));if(!t.ok){this.showError("Oil inventory data unavailable",()=>void this.fetchData(),300);return}const s=await t.json();if(!((i=this.element)!=null&&i.isConnected))return;this.render(s)}catch{if(!((e=this.element)!=null&&e.isConnected))return;this.showError("Oil inventory data unavailable",()=>void this.fetchData(),300)}}render(i){var s,r,c,o,d,l,h,u,p,f,y;const e=[];if((s=i.crudeWeeks)!=null&&s.length||(c=(r=i.spr)==null?void 0:r.weeks)!=null&&c.length){const b=Pt([...i.crudeWeeks??[]].reverse(),[...((o=i.spr)==null?void 0:o.weeks)??[]].reverse()),g=Mt(b),m=[...b].reverse().find(z=>z.crudeMb!=null&&z.sprMb!=null),w=(d=i.crudeWeeks)==null?void 0:d[0],S=i.spr,k=[];m&&k.push(`Total: ${n(M(m.crudeMb+m.sprMb))} Mb (${n(m.period)})`),w&&k.push(`Commercial: ${n(M(w.stocksMb))} ${me(w.weeklyChangeMb,"WoW")}`),S&&k.push(`SPR: ${n(M(S.latestStocksMb))} ${me(S.changeWow,"WoW")}`),e.push(q("US Total Oil Stocks",g,k.join(" | ")))}if((l=i.natGasWeeks)!=null&&l.length){const g=[...i.natGasWeeks].reverse().map(k=>({x:k.period,y:k.storBcf})),m=ve(g,"#22c55e","",120),w=i.natGasWeeks[0],S=w?`Storage: ${n(M(w.storBcf,0))} Bcf ${me(w.weeklyChangeBcf,"WoW")}`:"";e.push(q("US Nat Gas Working Storage",m,S))}if(i.euGas&&((h=i.euGas.history)!=null&&h.length)){const g=[...i.euGas.history].reverse().map(k=>({x:k.date,y:k.fillPct})),m=ve(g,"#14b8a6","%",100),w=i.euGas.fillPctChange1d>=0?"+":"",S=`Fill: ${n(M(i.euGas.fillPct))}% | Trend: ${n(i.euGas.trend)} | ${n(w+M(i.euGas.fillPctChange1d,2))}%/d`;e.push(q("EU Gas Storage Fill",m,S))}if((p=(u=i.ieaStocks)==null?void 0:u.members)!=null&&p.length){const b=_t(i.ieaStocks.members),g=[((f=i.ieaStocks.europe)==null?void 0:f.avgDays)!=null?`Europe avg ${i.ieaStocks.europe.avgDays.toFixed(0)}d`:"",((y=i.ieaStocks.asiaPacific)==null?void 0:y.avgDays)!=null?`AsiaPac avg ${i.ieaStocks.asiaPacific.avgDays.toFixed(0)}d`:""].filter(Boolean).join(" | "),m=i.ieaStocks.members.filter(S=>S.belowObligation).length,w=`${g}${m>0?` | <span style="color:#ef4444">${m} below 90d</span>`:""} | Data: ${n(i.ieaStocks.dataMonth)}`;e.push(q("IEA OECD Oil Stocks (Days of Cover)",b,w))}if(i.refinery){const b=`US Refinery Crude Inputs: <span class="commodity-price">${n(M(i.refinery.inputsMbpd))} Mb/d</span> (${n(i.refinery.period)})`;e.push(q("Refinery Throughput",`<div style="padding:4px 8px;font-size:12px">${b}</div>`,""))}if(e.length===0){this.showError("Oil inventory data unavailable",()=>void this.fetchData(),300);return}this.setSafeContent(E(`<div class="energy-complex-content">${e[0]}<div style="display:flex;gap:12px;font-size:9px;color:var(--text-dim);margin-top:2px">
      <span><svg width="14" height="4" style="vertical-align:middle"><line x1="0" y1="2" x2="14" y2="2" stroke="#3b82f6" stroke-width="2"/></svg> Commercial</span>
      <span><svg width="14" height="4" style="vertical-align:middle"><line x1="0" y1="2" x2="14" y2="2" stroke="#f59e0b" stroke-width="2"/></svg> SPR</span>
    </div>${e.slice(1).join("")}
      <div class="indicator-date" style="margin-top:6px">Source: EIA, IEA, GIE AGSI+</div>
    </div>`,"legacy Panel.setContent() migration"))}}const as=Object.freeze(Object.defineProperty({__proto__:null,OilInventoriesPanel:Ft},Symbol.toStringTag,{value:"Module"})),Lt={conservation:"Energy Conservation",consumer_support:"Consumer Support"},Rt={transport:"Transport",buildings:"Buildings",industry:"Industry",electricity:"Electricity",agriculture:"Agriculture",general:"General"},jt={active:"ecp-status-active",planned:"ecp-status-planned",ended:"ecp-status-ended"};class It extends D{constructor(){super({id:"energy-crisis",title:"Energy Crisis Tracker",showCount:!0,trackActivity:!0,defaultRowSpan:2,infoTooltip:"IEA 2026 Energy Crisis Policy Response Tracker. Tracks government measures to conserve energy and support consumers in response to Middle East conflict and Strait of Hormuz supply disruptions."});$(this,"data",null);$(this,"loading",!0);$(this,"error",null);$(this,"activeFilter","all");this.showLoading("Loading energy crisis policies...")}async fetchData(){var t;const e=be("energyCrisisPolicies");if((t=e==null?void 0:e.policies)!=null&&t.length){this.data=e,this.error=null,this.loading=!1,this.setCount(e.policies.length),this.render(),this.refreshFromRpc();return}await this.refreshFromRpc()}async refreshFromRpc(){var e,t,s;try{const c=await new He(j(),{fetch:(...o)=>globalThis.fetch(...o)}).getEnergyCrisisPolicies({countryCode:"",category:""});if(!((e=this.element)!=null&&e.isConnected))return;((t=c.policies)!=null&&t.length||!this.data)&&(this.data=c,this.error=null,this.loading=!1,this.setCount(c.policies.length),this.render())}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.data||(console.warn("[EnergyCrisis] Fetch error:",r),this.error="Energy crisis data unavailable",this.loading=!1,this.render())}}getFilteredPolicies(){var e;return(e=this.data)!=null&&e.policies?this.activeFilter==="all"?this.data.policies:this.data.policies.filter(t=>t.category===this.activeFilter):[]}buildSummary(){var c;const e=((c=this.data)==null?void 0:c.policies)??[],t=e.filter(o=>o.category==="conservation").length,s=e.filter(o=>o.category==="consumer_support").length,r=new Set(e.map(o=>o.countryCode)).size;return{conservationCount:t,supportCount:s,countryCount:r}}render(){var l,h;if(this.loading){this.showLoading("Loading energy crisis policies...");return}if(this.error||!this.data){this.showError(this.error||"No data available",()=>void this.fetchData());return}if(!((l=this.data.policies)!=null&&l.length)){this.setSafeContent(E('<div class="panel-empty">No energy crisis policies tracked.</div>',"legacy Panel.setContent() migration"));return}const e=this.buildSummary(),t=this.getFilteredPolicies(),s=`
      <div class="ecp-summary">
        <div class="ecp-summary-card">
          <span class="ecp-summary-value">${e.countryCount}</span>
          <span class="ecp-summary-label">Countries</span>
        </div>
        <div class="ecp-summary-card ecp-summary-conservation">
          <span class="ecp-summary-value">${e.conservationCount}</span>
          <span class="ecp-summary-label">Conservation</span>
        </div>
        <div class="ecp-summary-card ecp-summary-support">
          <span class="ecp-summary-value">${e.supportCount}</span>
          <span class="ecp-summary-label">Consumer Support</span>
        </div>
      </div>
    `,r=`
      <div class="ecp-filters">
        <button class="ecp-filter-btn ${this.activeFilter==="all"?"ecp-filter-active":""}" data-filter="all">All</button>
        <button class="ecp-filter-btn ${this.activeFilter==="conservation"?"ecp-filter-active":""}" data-filter="conservation">Conservation</button>
        <button class="ecp-filter-btn ${this.activeFilter==="consumer_support"?"ecp-filter-active":""}" data-filter="consumer_support">Consumer Support</button>
      </div>
    `,c=t.map(u=>{const p=Lt[u.category]||u.category,f=Rt[u.sector]||u.sector,y=jt[u.status]||"",b=u.category==="conservation"?"ecp-cat-conservation":"ecp-cat-support";return`
        <div class="ecp-policy-row">
          <div class="ecp-policy-header">
            <span class="ecp-country">${n(u.country)}</span>
            <span class="ecp-pill ${b}">${n(p)}</span>
            <span class="ecp-pill ecp-pill-sector">${n(f)}</span>
            <span class="ecp-pill ${y}">${n(u.status)}</span>
          </div>
          <div class="ecp-measure">${n(u.measure)}</div>
          <div class="ecp-date">${n(u.dateAnnounced)}</div>
        </div>
      `}).join(""),o=this.data.sourceUrl||"https://www.iea.org/data-and-statistics/data-tools/2026-energy-crisis-policy-response-tracker",d=[this.data.updatedAt?`Updated ${new Date(this.data.updatedAt).toLocaleDateString()}`:"","Source: IEA"].filter(Boolean).join(" · ");this.setSafeContent(E(`
      <div class="ecp-container">
        ${s}
        ${r}
        <div class="ecp-policy-list">${c}</div>
        <div class="ecp-footer">
          <span>${n(d)}</span>
          <a href="${n(o)}" target="_blank" rel="noopener noreferrer" class="ecp-source-link">IEA Tracker ↗</a>
        </div>
      </div>
    `,"legacy Panel.setContent() migration")),(h=this.content)==null||h.querySelectorAll(".ecp-filter-btn").forEach(u=>{u.addEventListener("click",p=>{const f=p.currentTarget.dataset.filter||"all";this.activeFilter=f,this.render()})})}}const rs=Object.freeze(Object.defineProperty({__proto__:null,EnergyCrisisPanel:It},Symbol.toStringTag,{value:"Module"})),Bt=["hormuz_strait","malacca_strait","suez","bab_el_mandeb","bosphorus","dover_strait","panama"];function Gt(a){switch(a){case"hormuz_strait":return x("components.chokepointStrip.shortName.hormuzStrait");case"malacca_strait":return x("components.chokepointStrip.shortName.malaccaStrait");case"suez":return x("components.chokepointStrip.shortName.suez");case"bab_el_mandeb":return x("components.chokepointStrip.shortName.babElMandeb");case"bosphorus":return x("components.chokepointStrip.shortName.bosphorus");case"dover_strait":return x("components.chokepointStrip.shortName.danishStraits");case"panama":return x("components.chokepointStrip.shortName.panama");default:return""}}function Vt(a){const i=(a||"").toLowerCase();return i.includes("closed")||i.includes("critical")?"#e74c3c":i.includes("disrupted")||i.includes("high")?"#e67e22":i.includes("restricted")||i.includes("elevated")||i.includes("medium")?"#f39c12":"#2ecc71"}function Nt(a){const i=a.flowEstimate;if(!i||typeof i.currentMbd!="number"||typeof i.baselineMbd!="number")return"—";const e=i.baselineMbd>0?Math.round(i.currentMbd/i.baselineMbd*100):null;return e==null?x("components.chokepointStrip.flow.mbd",{value:i.currentMbd.toFixed(1)}):x("components.chokepointStrip.flow.pctOfBaseline",{pct:e})}class Ut extends D{constructor(){super({id:"chokepoint-strip",title:x("components.chokepointStrip.title"),infoTooltip:x("components.chokepointStrip.infoTooltip")});$(this,"data",null)}async fetchData(){var e,t,s;try{const r=be("chokepoints");if((e=r==null?void 0:r.chokepoints)!=null&&e.length){this.data=r,this.render(),ke().then(o=>{var d,l;!((d=this.element)!=null&&d.isConnected)||!((l=o==null?void 0:o.chokepoints)!=null&&l.length)||(this.data=o,this.render())}).catch(()=>{});return}const c=await ke();if(!((t=this.element)!=null&&t.isConnected))return;this.data=c,this.render()}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.showError(x("components.chokepointStrip.errors.unavailable"),()=>void this.fetchData())}}render(){var o,d;if(!((d=(o=this.data)==null?void 0:o.chokepoints)!=null&&d.length)){this.showError(x("components.chokepointStrip.errors.noData"),()=>void this.fetchData());return}const e=new Map(this.data.chokepoints.map(l=>[l.id,l])),t=Bt.map(l=>e.get(l)).filter(l=>!!l),s=nt(t.map(l=>{const h=Vt(l.status),u=Gt(l.id)||l.name,p=Nt(l),f=l.activeWarnings>0?ne`<span class="cp-chip-warn">${l.activeWarnings}</span>`:ne``;return ne`
        <div class="cp-chip" data-cp="${l.id}" title="${l.name} - ${l.status||x("components.chokepointStrip.unknown")}">
          <div class="cp-chip-dot" style="background:${h}"></div>
          <div class="cp-chip-body">
            <div class="cp-chip-name">${u}${f}</div>
            <div class="cp-chip-flow">${p}</div>
          </div>
        </div>`})),r=t.reduce((l,h)=>l+(h.aisDisruptions??0),0),c=E(K({sourceType:"ais",method:x("components.chokepointStrip.attribution.method"),sampleSize:r||void 0,sampleLabel:x("components.chokepointStrip.attribution.sampleLabel"),updatedAt:this.data.fetchedAt,creditName:x("components.chokepointStrip.attribution.creditName")}),"attributionFooterHtml escapes fields and returns shared footer markup");this.setSafeContent(ne`
      <div class="cp-strip-wrap">
        <div class="cp-strip">${s}</div>
        ${c}
      </div>
      ${E(Q,"static attribution footer CSS constant")}
      <style>
        .cp-strip-wrap { padding: 4px 0; }
        .cp-strip { display: flex; flex-wrap: wrap; gap: 8px; }
        .cp-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          min-width: 120px;
          font-size: 11px;
          cursor: default;
        }
        .cp-chip-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 8px; }
        .cp-chip-body { display: flex; flex-direction: column; line-height: 1.2; }
        .cp-chip-name { font-weight: 600; color: var(--text, #eee); display: flex; align-items: center; gap: 4px; }
        .cp-chip-warn { background:#e74c3c;color:#fff;border-radius:9px;padding:0 5px;font-size:9px;font-weight:700; }
        .cp-chip-flow { color: var(--text-dim, #888); font-size: 10px; }
      </style>
    `)}}const os=Object.freeze(Object.defineProperty({__proto__:null,ChokepointStripPanel:Ut},Symbol.toStringTag,{value:"Module"})),le=V(()=>new X(j(),{fetch:N})),Oe={flowing:"#2ecc71",reduced:"#f39c12",offline:"#e74c3c",disputed:"#9b59b6"};function Ht(a){return a.charAt(0).toUpperCase()+a.slice(1)}function Me(a){return a.commodityType==="gas"&&typeof a.capacityBcmYr=="number"&&a.capacityBcmYr>0?`${a.capacityBcmYr.toFixed(1)} bcm/yr`:a.commodityType==="oil"&&typeof a.capacityMbd=="number"&&a.capacityMbd>0?`${a.capacityMbd.toFixed(2)} mb/d`:"—"}function ze(a){const i=a&&Oe[a]?a:"disputed";return`<span class="pp-badge" style="background:${Oe[i]??"#7f8c8d"}">${n(Ht(i))}</span>`}function Wt(a){if(!a||typeof a!="object")return null;const i=a,e=typeof i.id=="string"?i.id:"";if(!e)return null;const t=(u,p="")=>typeof u=="string"?u:p,s=(u,p=0)=>typeof u=="number"&&Number.isFinite(u)?u:p,r=u=>{if(u&&typeof u=="object"&&!Array.isArray(u)){const p=u;return{lat:s(p.lat),lon:s(p.lon)}}return{lat:0,lon:0}},c=i.evidence,o=c&&typeof c.operatorStatement=="object"&&c.operatorStatement?{text:t(c.operatorStatement.text),url:t(c.operatorStatement.url),date:t(c.operatorStatement.date)}:void 0,d=Array.isArray(c==null?void 0:c.sanctionRefs)?c.sanctionRefs.map(u=>{const p=u??{};return{authority:t(p.authority),listId:t(p.listId),date:t(p.date),url:t(p.url)}}):[],l=c?{physicalState:t(c.physicalState,"unknown"),physicalStateSource:t(c.physicalStateSource,"operator"),operatorStatement:o,commercialState:t(c.commercialState,"unknown"),sanctionRefs:d,lastEvidenceUpdate:t(c.lastEvidenceUpdate),classifierVersion:t(c.classifierVersion,"v1"),classifierConfidence:s(c.classifierConfidence,0)}:void 0,h=ut(l);return{id:e,name:t(i.name),operator:t(i.operator),commodityType:t(i.commodityType),fromCountry:t(i.fromCountry),toCountry:t(i.toCountry),transitCountries:Array.isArray(i.transitCountries)?i.transitCountries.map(u=>t(u)):[],capacityBcmYr:s(i.capacityBcmYr),capacityMbd:s(i.capacityMbd),lengthKm:s(i.lengthKm),inService:s(i.inService),startPoint:r(i.startPoint),endPoint:r(i.endPoint),waypoints:Array.isArray(i.waypoints)?i.waypoints.map(r):[],evidence:l,publicBadge:h}}function Yt(a,i){const e=[];for(const t of[a,i])if(t!=null&&t.pipelines)for(const s of Object.values(t.pipelines)){const r=Wt(s);r&&e.push(r)}return e.length===0?null:{pipelines:e,fetchedAt:pt(a==null?void 0:a.updatedAt,i==null?void 0:i.updatedAt),classifierVersion:dt(a==null?void 0:a.classifierVersion,i==null?void 0:i.classifierVersion),upstreamUnavailable:!1}}class qt extends D{constructor(){super({id:"pipeline-status",title:"Oil & Gas Pipeline Status",defaultRowSpan:2,infoTooltip:"Curated registry of critical oil and gas pipelines. Public badge is derived from evidence (operator statements, sanction refs, commercial state, physical signals) — see /docs/methodology/pipelines for the classifier spec."});$(this,"data",null);$(this,"selectedId",null);$(this,"detail",null);$(this,"detailLoading",!1);$(this,"detailEvents");$(this,"openDetailHandler",e=>{var s,r;const t=(s=e.detail)==null?void 0:s.pipelineId;!t||!((r=this.element)!=null&&r.isConnected)||this.loadDetail(t)});typeof window<"u"&&window.addEventListener("energy:open-pipeline-detail",this.openDetailHandler)}destroy(){var e;typeof window<"u"&&window.removeEventListener("energy:open-pipeline-detail",this.openDetailHandler),(e=super.destroy)==null||e.call(this)}async fetchData(){var e,t,s;try{const{gas:r,oil:c}=ht(),o=Yt(r,c);if(o){this.data=o,this.render(),le().listPipelines({commodityType:""}).then(h=>{var p,f;if(!((p=this.element)!=null&&p.isConnected)||!((f=h==null?void 0:h.pipelines)!=null&&f.length))return;this.data=h,this.render();const u=y=>Object.fromEntries(h.pipelines.filter(b=>b.commodityType===y).map(b=>[b.id,b]));Ee({gas:{pipelines:u("gas"),classifierVersion:h.classifierVersion,updatedAt:h.fetchedAt},oil:{pipelines:u("oil"),classifierVersion:h.classifierVersion,updatedAt:h.fetchedAt}})}).catch(()=>{});return}const d=await le().listPipelines({commodityType:""});if(!((e=this.element)!=null&&e.isConnected))return;if(d.upstreamUnavailable||!((t=d.pipelines)!=null&&t.length)){this.showError("Pipeline registry unavailable",()=>void this.fetchData());return}this.data=d,this.render();const l=h=>Object.fromEntries(d.pipelines.filter(u=>u.commodityType===h).map(u=>[u.id,u]));Ee({gas:{pipelines:l("gas"),classifierVersion:d.classifierVersion,updatedAt:d.fetchedAt},oil:{pipelines:l("oil"),classifierVersion:d.classifierVersion,updatedAt:d.fetchedAt}})}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.showError("Pipeline registry error",()=>void this.fetchData())}}async loadDetail(e){var t,s;this.selectedId=e,this.detailLoading=!0,this.detailEvents=void 0,this.render();try{const[r,c]=await Promise.all([le().getPipelineDetail({pipelineId:e}),le().listEnergyDisruptions({assetId:e,assetType:"pipeline",ongoingOnly:!1})]);if(!((t=this.element)!=null&&t.isConnected)||this.selectedId!==e)return;this.detail=r,this.detailEvents=(c==null?void 0:c.events)??[],this.detailLoading=!1,this.render()}catch{if(!((s=this.element)!=null&&s.isConnected)||this.selectedId!==e)return;this.detailLoading=!1,this.detail=null,this.render()}}closeDetail(){this.selectedId=null,this.detail=null,this.detailEvents=void 0,this.render()}renderDisruptionTimeline(){if(this.detailEvents===void 0)return"";if(this.detailEvents.length===0)return`<div class="pp-evidence">
        <div class="pp-sub" style="margin-bottom:6px">Disruption timeline</div>
        <div class="pp-ev-item pp-sub">No disruption events on file for this asset.</div>
      </div>`;const e=this.detailEvents.map(t=>{const s=n(xe(t.startAt,t.endAt)),r=$e(t.capacityOfflineBcmYr,t.capacityOfflineMbd),c=r?` · ${n(r)} offline`:"",o=t.causeChain&&t.causeChain.length>0?` · ${n(t.causeChain.join(" → "))}`:"";return`<div class="pp-ev-item">
        <strong>${n(t.eventType||"event")}</strong> · ${s}${c}${o}
        <div class="pp-sub" style="margin-top:2px">${n(t.shortDescription||"")}</div>
      </div>`}).join("");return`<div class="pp-evidence">
      <div class="pp-sub" style="margin-bottom:6px">Disruption timeline (${this.detailEvents.length})</div>
      ${e}
    </div>`}render(){var o,d;if(!this.data)return;const e=[...this.data.pipelines].sort((l,h)=>{const u=l.publicBadge==="flowing"?1:0,p=h.publicBadge==="flowing"?1:0;return u!==p?u-p:l.commodityType!==h.commodityType?l.commodityType.localeCompare(h.commodityType):l.name.localeCompare(h.name)}).map(l=>this.renderRow(l)).join(""),t=K({sourceType:"classifier",method:"evidence → badge (deterministic)",sampleSize:this.data.pipelines.length,sampleLabel:"pipelines",updatedAt:this.data.fetchedAt,classifierVersion:this.data.classifierVersion,creditName:"Global Energy Monitor (CC-BY 4.0)",creditUrl:"https://globalenergymonitor.org/"}),s=this.selectedId?this.renderDrawer():"";this.setSafeContent(E(`
      <div class="pp-wrap">
        <table class="pp-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>From → To</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
        </table>
        ${t}
        ${s}
      </div>
      ${Q}
      <style>
        .pp-wrap { position: relative; font-size: 11px; }
        .pp-table { width: 100%; border-collapse: collapse; }
        .pp-table th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim, #888); padding: 4px 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .pp-table td { padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .pp-table tr.pp-row { cursor: pointer; }
        .pp-table tr.pp-row:hover td { background: rgba(255,255,255,0.03); }
        .pp-name { font-weight: 600; color: var(--text, #eee); }
        .pp-sub  { font-size: 9px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; }
        .pp-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
        .pp-drawer { position: absolute; inset: 0; background: var(--panel-bg, #0f1218); padding: 12px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; }
        .pp-drawer-close { position: absolute; top: 8px; right: 10px; background: transparent; border: 0; color: var(--text-dim, #888); cursor: pointer; font-size: 14px; }
        .pp-drawer h3 { margin: 0 0 6px 0; font-size: 13px; color: var(--text, #eee); }
        .pp-drawer .pp-kv { display: grid; grid-template-columns: 120px 1fr; gap: 4px 10px; font-size: 10px; margin-bottom: 10px; }
        .pp-drawer .pp-kv-key { color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; font-size: 9px; padding-top: 2px; }
        .pp-evidence { margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
        .pp-ev-item { font-size: 10px; color: var(--text, #eee); margin-bottom: 6px; }
        .pp-ev-item a { color: #4ade80; text-decoration: none; }
        .pp-ev-item a:hover { text-decoration: underline; }
      </style>
    `,"legacy Panel.setContent() migration"));const r=(o=this.element)==null?void 0:o.querySelector(".pp-table");r==null||r.querySelectorAll("tr.pp-row").forEach(l=>{const h=l.dataset.pipelineId;h&&l.addEventListener("click",()=>void this.loadDetail(h))});const c=(d=this.element)==null?void 0:d.querySelector(".pp-drawer-close");c==null||c.addEventListener("click",()=>this.closeDetail())}renderRow(e){const t=e.commodityType==="gas"?"⛽":"🛢️",s=`${n(e.fromCountry)} → ${n(e.toCountry)}`;return`
      <tr class="pp-row" data-pipeline-id="${n(e.id)}">
        <td>
          <div class="pp-name">${t} ${n(e.name)}</div>
          <div class="pp-sub">${n(e.operator||"")}</div>
        </td>
        <td>${s}</td>
        <td>${n(Me(e))}</td>
        <td>${ze(e.publicBadge)}</td>
      </tr>`}renderDrawer(){var o,d;if(this.detailLoading)return'<div class="pp-drawer"><button class="pp-drawer-close" aria-label="Close">✕</button>Loading…</div>';const e=(o=this.detail)==null?void 0:o.pipeline;if(!e)return'<div class="pp-drawer"><button class="pp-drawer-close" aria-label="Close">✕</button>Pipeline detail unavailable.</div>';const t=e.evidence,s=((t==null?void 0:t.sanctionRefs)??[]).map(l=>{const h=Z(l.url||""),u=n(l.date||"source"),p=h?`<a href="${h}" target="_blank" rel="noopener">${u}</a>`:u;return`
      <div class="pp-ev-item">
        <strong>${n(l.authority)}</strong> ${n(l.listId||"")} ·
        ${p}
      </div>`}).join(""),r=(d=t==null?void 0:t.operatorStatement)!=null&&d.text?(()=>{var u,p;const l=Z(((u=t.operatorStatement)==null?void 0:u.url)||""),h=l?`· <a href="${l}" target="_blank" rel="noopener">${n(((p=t.operatorStatement)==null?void 0:p.date)||"source")}</a>`:"";return`<div class="pp-ev-item"><strong>Operator:</strong> ${n(t.operatorStatement.text)}
           ${h}
         </div>`})():"",c=e.transitCountries.length>0?` via ${e.transitCountries.map(l=>n(l)).join(", ")}`:"";return`
      <div class="pp-drawer">
        <button class="pp-drawer-close" aria-label="Close">✕</button>
        <h3>${n(e.name)} ${ze(e.publicBadge)}</h3>
        <div class="pp-kv">
          <div class="pp-kv-key">Operator</div>   <div>${n(e.operator)}</div>
          <div class="pp-kv-key">Commodity</div>  <div>${n(e.commodityType)}</div>
          <div class="pp-kv-key">Route</div>      <div>${n(e.fromCountry)} → ${n(e.toCountry)}${c}</div>
          <div class="pp-kv-key">Capacity</div>   <div>${n(Me(e))}</div>
          <div class="pp-kv-key">Length</div>     <div>${e.lengthKm>0?`${e.lengthKm.toLocaleString()} km`:"—"}</div>
          <div class="pp-kv-key">In service</div> <div>${e.inService>0?n(String(e.inService)):"—"}</div>
        </div>
        <div class="pp-evidence">
          <div class="pp-sub" style="margin-bottom:6px">Evidence</div>
          <div class="pp-ev-item">
            <strong>Physical state:</strong> ${n((t==null?void 0:t.physicalState)||"unknown")}
            (source: ${n((t==null?void 0:t.physicalStateSource)||"unknown")})
          </div>
          <div class="pp-ev-item"><strong>Commercial:</strong> ${n((t==null?void 0:t.commercialState)||"unknown")}</div>
          ${r}
          ${s}
          ${t!=null&&t.classifierVersion?`<div class="pp-ev-item pp-sub">Classifier ${n(t.classifierVersion)} · confidence ${Math.round((t.classifierConfidence??0)*100)}%</div>`:""}
        </div>
        ${this.renderDisruptionTimeline()}
      </div>`}}const ls=Object.freeze(Object.defineProperty({__proto__:null,PipelineStatusPanel:qt},Symbol.toStringTag,{value:"Module"})),ce=V(()=>new X(j(),{fetch:N})),_e={operational:"#2ecc71",reduced:"#f39c12",offline:"#e74c3c",disputed:"#9b59b6"},Zt={ugs:"🟢",spr:"🛢️",lng_export:"🚢",lng_import:"⚓",crude_tank_farm:"🟡"},Fe={ugs:"UGS",spr:"SPR",lng_export:"LNG export",lng_import:"LNG import",crude_tank_farm:"Crude hub"};function Xt(a){return a.charAt(0).toUpperCase()+a.slice(1)}function Le(a){const i=a&&_e[a]?a:"disputed";return`<span class="sf-badge" style="background:${_e[i]??"#7f8c8d"}">${n(Xt(i))}</span>`}function Re(a){return a.facilityType==="ugs"&&typeof a.capacityTwh=="number"&&a.capacityTwh>0?`${a.capacityTwh.toFixed(1)} TWh`:(a.facilityType==="lng_export"||a.facilityType==="lng_import")&&typeof a.capacityMtpa=="number"&&a.capacityMtpa>0?`${a.capacityMtpa.toFixed(1)} Mtpa`:(a.facilityType==="spr"||a.facilityType==="crude_tank_farm")&&typeof a.capacityMb=="number"&&a.capacityMb>0?`${a.capacityMb.toLocaleString()} Mb`:"—"}function Kt(a){if(!a||typeof a!="object")return null;const i=a,e=typeof i.id=="string"?i.id:"";if(!e)return null;const t=(p,f="")=>typeof p=="string"?p:f,s=(p,f=0)=>typeof p=="number"&&Number.isFinite(p)?p:f,r=(p,f=!1)=>typeof p=="boolean"?p:f,c=p=>{if(p&&typeof p=="object"&&!Array.isArray(p)){const f=p;return{lat:s(f.lat),lon:s(f.lon)}}return{lat:0,lon:0}},o=i.evidence,d=o&&typeof o.operatorStatement=="object"&&o.operatorStatement?{text:t(o.operatorStatement.text),url:t(o.operatorStatement.url),date:t(o.operatorStatement.date)}:void 0,l=Array.isArray(o==null?void 0:o.sanctionRefs)?o.sanctionRefs.map(p=>{const f=p??{};return{authority:t(f.authority),listId:t(f.listId),date:t(f.date),url:t(f.url)}}):[],h=o?{physicalState:t(o.physicalState,"unknown"),physicalStateSource:t(o.physicalStateSource,"operator"),operatorStatement:d,commercialState:t(o.commercialState,"unknown"),sanctionRefs:l,fillDisclosed:r(o.fillDisclosed),fillSource:t(o.fillSource),lastEvidenceUpdate:t(o.lastEvidenceUpdate),classifierVersion:t(o.classifierVersion,"v1"),classifierConfidence:s(o.classifierConfidence,0)}:void 0,u=ft(h);return{id:e,name:t(i.name),operator:t(i.operator),facilityType:t(i.facilityType),country:t(i.country),location:c(i.location),capacityTwh:s(i.capacityTwh),capacityMb:s(i.capacityMb),capacityMtpa:s(i.capacityMtpa),workingCapacityUnit:t(i.workingCapacityUnit),inService:s(i.inService),evidence:h,publicBadge:u}}function Qt(a){if(!(a!=null&&a.facilities))return null;const i=[];for(const e of Object.values(a.facilities)){const t=Kt(e);t&&i.push(t)}return i.length===0?null:{facilities:i,fetchedAt:a.updatedAt??"",classifierVersion:a.classifierVersion??"v1",upstreamUnavailable:!1}}class Jt extends D{constructor(){super({id:"storage-facility-map",title:"Strategic Storage Atlas",defaultRowSpan:2,infoTooltip:"Curated registry of strategic storage assets — underground gas storage, strategic petroleum reserves, LNG terminals, crude tank farms. Public badge is derived from evidence (operator statements, sanction refs, commercial state, physical signals) — see /docs/methodology/storage for the classifier spec."});$(this,"data",null);$(this,"selectedId",null);$(this,"detail",null);$(this,"detailLoading",!1);$(this,"detailEvents");$(this,"openDetailHandler",e=>{var s,r;const t=(s=e.detail)==null?void 0:s.facilityId;!t||!((r=this.element)!=null&&r.isConnected)||this.loadDetail(t)});typeof window<"u"&&window.addEventListener("energy:open-storage-facility-detail",this.openDetailHandler)}destroy(){var e;typeof window<"u"&&window.removeEventListener("energy:open-storage-facility-detail",this.openDetailHandler),(e=super.destroy)==null||e.call(this)}async fetchData(){var e,t,s;try{const{registry:r}=gt(),c=Qt(r);if(c){this.data=c,this.render(),ce().listStorageFacilities({facilityType:""}).then(l=>{var u,p;if(!((u=this.element)!=null&&u.isConnected)||!((p=l==null?void 0:l.facilities)!=null&&p.length))return;this.data=l,this.render();const h=Object.fromEntries(l.facilities.map(f=>[f.id,f]));Te({facilities:h,classifierVersion:l.classifierVersion,updatedAt:l.fetchedAt})}).catch(()=>{});return}const o=await ce().listStorageFacilities({facilityType:""});if(!((e=this.element)!=null&&e.isConnected))return;if(o.upstreamUnavailable||!((t=o.facilities)!=null&&t.length)){this.showError("Storage registry unavailable",()=>void this.fetchData());return}this.data=o,this.render();const d=Object.fromEntries(o.facilities.map(l=>[l.id,l]));Te({facilities:d,classifierVersion:o.classifierVersion,updatedAt:o.fetchedAt})}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.showError("Storage registry error",()=>void this.fetchData())}}async loadDetail(e){var t,s;this.selectedId=e,this.detailLoading=!0,this.detailEvents=void 0,this.render();try{const[r,c]=await Promise.all([ce().getStorageFacilityDetail({facilityId:e}),ce().listEnergyDisruptions({assetId:e,assetType:"storage",ongoingOnly:!1})]);if(!((t=this.element)!=null&&t.isConnected)||this.selectedId!==e)return;this.detail=r,this.detailEvents=(c==null?void 0:c.events)??[],this.detailLoading=!1,this.render()}catch{if(!((s=this.element)!=null&&s.isConnected)||this.selectedId!==e)return;this.detailLoading=!1,this.detail=null,this.render()}}closeDetail(){this.selectedId=null,this.detail=null,this.detailEvents=void 0,this.render()}renderDisruptionTimeline(){if(this.detailEvents===void 0)return"";if(this.detailEvents.length===0)return`<div class="sf-evidence">
        <div class="sf-sub" style="margin-bottom:6px">Disruption timeline</div>
        <div class="sf-ev-item sf-sub">No disruption events on file for this asset.</div>
      </div>`;const e=this.detailEvents.map(t=>{const s=n(xe(t.startAt,t.endAt)),r=$e(t.capacityOfflineBcmYr,t.capacityOfflineMbd),c=r?` · ${n(r)} offline`:"",o=t.causeChain&&t.causeChain.length>0?` · ${n(t.causeChain.join(" → "))}`:"";return`<div class="sf-ev-item">
        <strong>${n(t.eventType||"event")}</strong> · ${s}${c}${o}
        <div class="sf-sub" style="margin-top:2px">${n(t.shortDescription||"")}</div>
      </div>`}).join("");return`<div class="sf-evidence">
      <div class="sf-sub" style="margin-bottom:6px">Disruption timeline (${this.detailEvents.length})</div>
      ${e}
    </div>`}render(){var o,d;if(!this.data)return;const e=[...this.data.facilities].sort((l,h)=>{const u=l.publicBadge==="operational"?1:0,p=h.publicBadge==="operational"?1:0;return u!==p?u-p:l.facilityType!==h.facilityType?l.facilityType.localeCompare(h.facilityType):l.name.localeCompare(h.name)}).map(l=>this.renderRow(l)).join(""),t=K({sourceType:"classifier",method:"evidence → badge (deterministic)",sampleSize:this.data.facilities.length,sampleLabel:"facilities",updatedAt:this.data.fetchedAt,classifierVersion:this.data.classifierVersion,creditName:"Global Energy Monitor (CC-BY 4.0) / GIE AGSI+ / EIA",creditUrl:"https://globalenergymonitor.org/"}),s=this.selectedId?this.renderDrawer():"";this.setSafeContent(E(`
      <div class="sf-wrap">
        <table class="sf-table">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Country · Type</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
        </table>
        ${t}
        ${s}
      </div>
      ${Q}
      <style>
        .sf-wrap { position: relative; font-size: 11px; }
        .sf-table { width: 100%; border-collapse: collapse; }
        .sf-table th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim, #888); padding: 4px 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sf-table td { padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sf-table tr.sf-row { cursor: pointer; }
        .sf-table tr.sf-row:hover td { background: rgba(255,255,255,0.03); }
        .sf-name { font-weight: 600; color: var(--text, #eee); }
        .sf-sub  { font-size: 9px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; }
        .sf-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
        .sf-drawer { position: absolute; inset: 0; background: var(--panel-bg, #0f1218); padding: 12px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; }
        .sf-drawer-close { position: absolute; top: 8px; right: 10px; background: transparent; border: 0; color: var(--text-dim, #888); cursor: pointer; font-size: 14px; }
        .sf-drawer h3 { margin: 0 0 6px 0; font-size: 13px; color: var(--text, #eee); }
        .sf-drawer .sf-kv { display: grid; grid-template-columns: 120px 1fr; gap: 4px 10px; font-size: 10px; margin-bottom: 10px; }
        .sf-drawer .sf-kv-key { color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; font-size: 9px; padding-top: 2px; }
        .sf-evidence { margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
        .sf-ev-item { font-size: 10px; color: var(--text, #eee); margin-bottom: 6px; }
        .sf-ev-item a { color: #4ade80; text-decoration: none; }
        .sf-ev-item a:hover { text-decoration: underline; }
      </style>
    `,"legacy Panel.setContent() migration"));const r=(o=this.element)==null?void 0:o.querySelector(".sf-table");r==null||r.querySelectorAll("tr.sf-row").forEach(l=>{const h=l.dataset.facilityId;h&&l.addEventListener("click",()=>void this.loadDetail(h))});const c=(d=this.element)==null?void 0:d.querySelector(".sf-drawer-close");c==null||c.addEventListener("click",()=>this.closeDetail())}renderRow(e){const t=Zt[e.facilityType]??"🔹",s=Fe[e.facilityType]??e.facilityType;return`
      <tr class="sf-row" data-facility-id="${n(e.id)}">
        <td>
          <div class="sf-name">${t} ${n(e.name)}</div>
          <div class="sf-sub">${n(e.operator||"")}</div>
        </td>
        <td>${n(e.country)} · ${n(s)}</td>
        <td>${n(Re(e))}</td>
        <td>${Le(e.publicBadge)}</td>
      </tr>`}renderDrawer(){var d,l,h,u;if(this.detailLoading)return'<div class="sf-drawer"><button class="sf-drawer-close" aria-label="Close">✕</button>Loading…</div>';const e=(d=this.detail)==null?void 0:d.facility;if(!e)return'<div class="sf-drawer"><button class="sf-drawer-close" aria-label="Close">✕</button>Facility detail unavailable.</div>';const t=e.evidence,s=((t==null?void 0:t.sanctionRefs)??[]).map(p=>{const f=Z(p.url||""),y=n(p.date||"source"),b=f?`<a href="${f}" target="_blank" rel="noopener">${y}</a>`:y;return`
      <div class="sf-ev-item">
        <strong>${n(p.authority)}</strong> ${n(p.listId||"")} ·
        ${b}
      </div>`}).join(""),r=(l=t==null?void 0:t.operatorStatement)!=null&&l.text?(()=>{var y,b;const p=Z(((y=t.operatorStatement)==null?void 0:y.url)||""),f=p?`· <a href="${p}" target="_blank" rel="noopener">${n(((b=t.operatorStatement)==null?void 0:b.date)||"source")}</a>`:"";return`<div class="sf-ev-item"><strong>Operator:</strong> ${n(t.operatorStatement.text)}
           ${f}
         </div>`})():"",c=t!=null&&t.fillDisclosed?`<div class="sf-ev-item"><strong>Fill levels:</strong> disclosed via ${n(t.fillSource||"—")}</div>`:'<div class="sf-ev-item"><strong>Fill levels:</strong> not publicly disclosed</div>',o=Fe[e.facilityType]??e.facilityType;return`
      <div class="sf-drawer">
        <button class="sf-drawer-close" aria-label="Close">✕</button>
        <h3>${n(e.name)} ${Le(e.publicBadge)}</h3>
        <div class="sf-kv">
          <div class="sf-kv-key">Operator</div>   <div>${n(e.operator)}</div>
          <div class="sf-kv-key">Type</div>       <div>${n(o)}</div>
          <div class="sf-kv-key">Country</div>    <div>${n(e.country)}</div>
          <div class="sf-kv-key">Capacity</div>   <div>${n(Re(e))}</div>
          <div class="sf-kv-key">Location</div>   <div>${(((h=e.location)==null?void 0:h.lat)??0).toFixed(3)}°, ${(((u=e.location)==null?void 0:u.lon)??0).toFixed(3)}°</div>
          <div class="sf-kv-key">In service</div> <div>${e.inService>0?n(String(e.inService)):"—"}</div>
        </div>
        <div class="sf-evidence">
          <div class="sf-sub" style="margin-bottom:6px">Evidence</div>
          <div class="sf-ev-item">
            <strong>Physical state:</strong> ${n((t==null?void 0:t.physicalState)||"unknown")}
            (source: ${n((t==null?void 0:t.physicalStateSource)||"unknown")})
          </div>
          <div class="sf-ev-item"><strong>Commercial:</strong> ${n((t==null?void 0:t.commercialState)||"unknown")}</div>
          ${c}
          ${r}
          ${s}
          ${t!=null&&t.classifierVersion?`<div class="sf-ev-item sf-sub">Classifier ${n(t.classifierVersion)} · confidence ${Math.round((t.classifierConfidence??0)*100)}%</div>`:""}
        </div>
        ${this.renderDisruptionTimeline()}
      </div>`}}const cs=Object.freeze(Object.defineProperty({__proto__:null,StorageFacilityMapPanel:Jt},Symbol.toStringTag,{value:"Module"})),ye=V(()=>new X(j(),{fetch:N})),ei={confirmed:"#e74c3c",watch:"#f39c12"},ti={petrol:"⛽",diesel:"🛢️",jet:"✈️",heating_oil:"🔥"},ii={strong:"●●●",moderate:"●●○",thin:"●○○"};function je(a){const i=ei[a]??"#7f8c8d",e=a.charAt(0).toUpperCase()+a.slice(1);return`<span class="fs-badge" style="background:${i}">${n(e)}</span>`}function si(a){if(!a||typeof a!="object")return null;const i=a,e=typeof i.id=="string"?i.id:"";if(!e)return null;const t=(d,l="")=>typeof d=="string"?d:l,s=(d,l=0)=>typeof d=="number"&&Number.isFinite(d)?d:l,r=i.evidence??null,c=Array.isArray(r==null?void 0:r.evidenceSources)?r.evidenceSources.map(d=>{const l=d??{};return{authority:t(l.authority),title:t(l.title),url:t(l.url),date:t(l.date),sourceType:t(l.sourceType)}}):[],o=r?{evidenceSources:c,firstRegulatorConfirmation:t(r.firstRegulatorConfirmation),classifierVersion:t(r.classifierVersion,"v1"),classifierConfidence:s(r.classifierConfidence,0),lastEvidenceUpdate:t(r.lastEvidenceUpdate)}:void 0;return{id:e,country:t(i.country),product:t(i.product),severity:t(i.severity,"watch"),firstSeen:t(i.firstSeen),lastConfirmed:t(i.lastConfirmed),resolvedAt:typeof i.resolvedAt=="string"?i.resolvedAt:"",impactTypes:Array.isArray(i.impactTypes)?i.impactTypes.map(d=>t(d)).filter(d=>d.length>0):[],causeChain:Array.isArray(i.causeChain)?i.causeChain.map(d=>t(d)).filter(d=>d.length>0):[],shortDescription:t(i.shortDescription),evidence:o}}function ni(a){if(!(a!=null&&a.shortages))return null;const i=[];for(const e of Object.values(a.shortages)){const t=si(e);t&&i.push(t)}return i.length===0?null:{shortages:i,fetchedAt:a.updatedAt??"",classifierVersion:a.classifierVersion??"v1",upstreamUnavailable:!1}}class ai extends D{constructor(){super({id:"fuel-shortages",title:"Global Fuel Shortage Registry",defaultRowSpan:2,infoTooltip:"Global fuel-shortage alert registry (petrol, diesel, jet, heating oil). Severity (confirmed / watch) is a classifier output, not a client derivation. Every row carries the full evidence source list — see /docs/methodology/shortages for the threshold spec + classifier version."});$(this,"data",null);$(this,"selectedId",null);$(this,"detail",null);$(this,"detailLoading",!1);$(this,"openDetailHandler",e=>{var s,r;const t=(s=e.detail)==null?void 0:s.shortageId;!t||!((r=this.element)!=null&&r.isConnected)||this.loadDetail(t)});typeof window<"u"&&window.addEventListener("energy:open-fuel-shortage-detail",this.openDetailHandler)}destroy(){var e;typeof window<"u"&&window.removeEventListener("energy:open-fuel-shortage-detail",this.openDetailHandler),(e=super.destroy)==null||e.call(this)}async fetchData(){var e,t,s;try{const{registry:r}=yt(),c=ni(r);if(c){this.data=c,this.render(),ye().listFuelShortages({country:"",product:"",severity:""}).then(l=>{var u,p;if(!((u=this.element)!=null&&u.isConnected)||!((p=l==null?void 0:l.shortages)!=null&&p.length))return;this.data=l,this.render();const h=Object.fromEntries(l.shortages.map(f=>[f.id,f]));Ae({shortages:h,classifierVersion:l.classifierVersion,updatedAt:l.fetchedAt})}).catch(()=>{});return}const o=await ye().listFuelShortages({country:"",product:"",severity:""});if(!((e=this.element)!=null&&e.isConnected))return;if(o.upstreamUnavailable||!((t=o.shortages)!=null&&t.length)){this.showError("Fuel shortage registry unavailable",()=>void this.fetchData());return}this.data=o,this.render();const d=Object.fromEntries(o.shortages.map(l=>[l.id,l]));Ae({shortages:d,classifierVersion:o.classifierVersion,updatedAt:o.fetchedAt})}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.showError("Fuel shortage registry error",()=>void this.fetchData())}}async loadDetail(e){var t,s;this.selectedId=e,this.detailLoading=!0,this.render();try{const r=await ye().getFuelShortageDetail({shortageId:e});if(!((t=this.element)!=null&&t.isConnected)||this.selectedId!==e)return;this.detail=r,this.detailLoading=!1,this.render()}catch{if(!((s=this.element)!=null&&s.isConnected)||this.selectedId!==e)return;this.detailLoading=!1,this.detail=null,this.render()}}closeDetail(){this.selectedId=null,this.detail=null,this.render()}render(){var h,u;if(!this.data)return;const e=[...this.data.shortages].sort((p,f)=>{const y=p.severity==="confirmed"?0:1,b=f.severity==="confirmed"?0:1;if(y!==b)return y-b;const g=re(p.evidence),m=re(f.evidence),w={strong:0,moderate:1,thin:2};return w[g]!==w[m]?w[g]-w[m]:f.lastConfirmed.localeCompare(p.lastConfirmed)}).map(p=>this.renderRow(p)).join(""),t=this.data.shortages.filter(p=>p.severity==="confirmed").length,s=this.data.shortages.filter(p=>p.severity==="watch").length,r=`${t} confirmed · ${s} watch`,c=K({sourceType:"classifier",method:"evidence-threshold + LLM double-check",sampleSize:this.data.shortages.length,sampleLabel:"active shortages",updatedAt:this.data.fetchedAt,classifierVersion:this.data.classifierVersion,creditName:"Regulator advisories + IEA + major wire",creditUrl:"/docs/methodology/shortages"}),o=this.selectedId?this.renderDrawer():"";this.setSafeContent(E(`
      <div class="fs-wrap">
        <div class="fs-summary">${n(r)}</div>
        <table class="fs-table">
          <thead>
            <tr>
              <th>Country · Product</th>
              <th>Since</th>
              <th>Evidence</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
        </table>
        ${c}
        ${o}
      </div>
      ${Q}
      <style>
        .fs-wrap { position: relative; font-size: 11px; }
        .fs-summary { font-size: 10px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; margin: 4px 0 6px 0; }
        .fs-table { width: 100%; border-collapse: collapse; }
        .fs-table th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim, #888); padding: 4px 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .fs-table td { padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .fs-table tr.fs-row { cursor: pointer; }
        .fs-table tr.fs-row:hover td { background: rgba(255,255,255,0.03); }
        .fs-name { font-weight: 600; color: var(--text, #eee); }
        .fs-sub  { font-size: 9px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; }
        .fs-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
        .fs-quality { font-family: monospace; font-size: 10px; color: var(--text-dim, #888); }
        .fs-drawer { position: absolute; inset: 0; background: var(--panel-bg, #0f1218); padding: 12px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; }
        .fs-drawer-close { position: absolute; top: 8px; right: 10px; background: transparent; border: 0; color: var(--text-dim, #888); cursor: pointer; font-size: 14px; }
        .fs-drawer h3 { margin: 0 0 6px 0; font-size: 13px; color: var(--text, #eee); }
        .fs-drawer .fs-kv { display: grid; grid-template-columns: 120px 1fr; gap: 4px 10px; font-size: 10px; margin-bottom: 10px; }
        .fs-drawer .fs-kv-key { color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; font-size: 9px; padding-top: 2px; }
        .fs-source-list { margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
        .fs-src-item { font-size: 10px; color: var(--text, #eee); margin-bottom: 6px; }
        .fs-src-item a { color: #4ade80; text-decoration: none; }
        .fs-src-item a:hover { text-decoration: underline; }
        .fs-src-type { display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; background: rgba(255,255,255,0.08); color: var(--text-dim, #aaa); margin-right: 4px; }
        .fs-src-type-regulator { background: #2980b9; color: #fff; }
        .fs-src-type-operator { background: #27ae60; color: #fff; }
        .fs-src-type-press { background: #555; color: #ccc; }
      </style>
    `,"legacy Panel.setContent() migration"));const d=(h=this.element)==null?void 0:h.querySelector(".fs-table");d==null||d.querySelectorAll("tr.fs-row").forEach(p=>{const f=p.dataset.shortageId;f&&p.addEventListener("click",()=>void this.loadDetail(f))});const l=(u=this.element)==null?void 0:u.querySelector(".fs-drawer-close");l==null||l.addEventListener("click",()=>this.closeDetail())}renderRow(e){const t=ti[e.product]??"•",s=re(e.evidence);return`
      <tr class="fs-row" data-shortage-id="${n(e.id)}">
        <td>
          <div class="fs-name">${t} ${n(e.country)} · ${n(e.product)}</div>
          <div class="fs-sub">${n(e.causeChain.join(" · ")||"—")}</div>
        </td>
        <td>${n(e.firstSeen.slice(0,10))}</td>
        <td><span class="fs-quality" title="Evidence quality: ${n(s)}">${ii[s]}</span></td>
        <td>${je(e.severity)}</td>
      </tr>`}renderDrawer(){var o;if(this.detailLoading)return'<div class="fs-drawer"><button class="fs-drawer-close" aria-label="Close">✕</button>Loading…</div>';const e=(o=this.detail)==null?void 0:o.shortage;if(!e)return'<div class="fs-drawer"><button class="fs-drawer-close" aria-label="Close">✕</button>Shortage detail unavailable.</div>';const t=e.evidence,s=mt(t==null?void 0:t.evidenceSources),r=re(t),c=((t==null?void 0:t.evidenceSources)??[]).map(d=>{const l=Z(d.url||""),h=n(d.title||d.authority||"source"),u=l?`<a href="${l}" target="_blank" rel="noopener">${h}</a>`:h;return`
      <div class="fs-src-item">
        <span class="fs-src-type ${`fs-src-type-${n(d.sourceType||"other")}`}">${n(d.sourceType||"other")}</span>
        <strong>${n(d.authority||"")}</strong> · ${u} · ${n(d.date.slice(0,10))}
      </div>`}).join("");return`
      <div class="fs-drawer">
        <button class="fs-drawer-close" aria-label="Close">✕</button>
        <h3>${n(e.country)} · ${n(e.product)} ${je(e.severity)}</h3>
        <div class="fs-kv">
          <div class="fs-kv-key">Description</div>  <div>${n(e.shortDescription)}</div>
          <div class="fs-kv-key">First seen</div>   <div>${n(e.firstSeen.slice(0,10))}</div>
          <div class="fs-kv-key">Last confirmed</div><div>${n(e.lastConfirmed.slice(0,10))}</div>
          <div class="fs-kv-key">Resolved</div>     <div>${e.resolvedAt?n(e.resolvedAt.slice(0,10)):"Active"}</div>
          <div class="fs-kv-key">Impact</div>       <div>${n(e.impactTypes.join(", ")||"—")}</div>
          <div class="fs-kv-key">Cause chain</div>  <div>${n(e.causeChain.join(" → ")||"—")}</div>
          <div class="fs-kv-key">Evidence</div>     <div>${s.authoritative} regulator/operator · ${s.press} press · quality: ${n(r)}</div>
          ${t!=null&&t.classifierVersion?`<div class="fs-kv-key">Classifier</div><div>${n(t.classifierVersion)} · confidence ${Math.round((t.classifierConfidence??0)*100)}%</div>`:""}
        </div>
        <div class="fs-source-list">
          <div class="fs-sub" style="margin-bottom:6px">Evidence sources (${((t==null?void 0:t.evidenceSources)??[]).length})</div>
          ${c||'<div class="fs-src-item">No sources on file.</div>'}
        </div>
      </div>`}}const ds=Object.freeze(Object.defineProperty({__proto__:null,FuelShortagePanel:ai},Symbol.toStringTag,{value:"Module"})),ri=V(()=>new X(j(),{fetch:N})),oi={sabotage:"💥",sanction:"🚫",maintenance:"🔧",mechanical:"⚙️",weather:"🌀",commercial:"💼",war:"⚔️",other:"•"},Ie={ongoing:"#e74c3c",resolved:"#7f8c8d",unknown:"#95a5a6"},li=[{key:"",label:"All events"},{key:"sabotage",label:"Sabotage"},{key:"sanction",label:"Sanction"},{key:"mechanical",label:"Mechanical"},{key:"maintenance",label:"Maintenance"},{key:"war",label:"War"},{key:"weather",label:"Weather"},{key:"commercial",label:"Commercial"},{key:"other",label:"Other"}];function ci(a){const i=Ie[a]??Ie.unknown,e=a.charAt(0).toUpperCase()+a.slice(1);return`<span class="ed-badge" style="background:${i}">${n(e)}</span>`}class di extends D{constructor(){super({id:"energy-disruptions",title:"Energy Disruptions Log",defaultRowSpan:2,infoTooltip:"Curated log of disruption events affecting oil & gas pipelines and storage facilities — sabotage, sanctions, maintenance, mechanical, weather, war, commercial. Each event ties back to a seeded asset; click a row to jump to the pipeline / storage panel with that event highlighted. See /docs/methodology/disruptions for the schema."});$(this,"data",null);$(this,"activeTypeFilter","");$(this,"ongoingOnly",!1);$(this,"handleContentClick",e=>{const t=e.target;if(!t)return;const s=t.closest("[data-filter-type]");if(s){this.setTypeFilter(s.dataset.filterType??"");return}if(t.closest("[data-toggle-ongoing]")){this.toggleOngoingOnly();return}const c=t.closest("tr.ed-row");if(c){const o=c.dataset.eventId,d=c.dataset.assetId,l=c.dataset.assetType;o&&d&&l&&this.dispatchOpenAsset(o,d,l)}});this.content.addEventListener("click",this.handleContentClick)}async fetchData(){var e,t;try{const s=await ri().listEnergyDisruptions({assetId:"",assetType:"",ongoingOnly:!1});if(!((e=this.element)!=null&&e.isConnected))return;if(s.upstreamUnavailable){this.showError("Energy disruptions log unavailable",()=>void this.fetchData());return}this.data=s,this.render()}catch(s){if(this.isAbortError(s)||!((t=this.element)!=null&&t.isConnected))return;this.showError("Energy disruptions log error",()=>void this.fetchData())}}setTypeFilter(e){this.activeTypeFilter=e,this.render()}toggleOngoingOnly(){this.ongoingOnly=!this.ongoingOnly,this.render()}filterEvents(){if(!this.data)return[];let e=this.data.events;return this.activeTypeFilter&&(e=e.filter(t=>t.eventType===this.activeTypeFilter)),this.ongoingOnly&&(e=e.filter(t=>!t.endAt)),[...e].sort((t,s)=>s.startAt.localeCompare(t.startAt))}render(){if(!this.data)return;const e=this.filterEvents(),t=e.map(u=>this.renderRow(u)).join(""),s=this.data.events.length,r=this.data.events.filter(u=>!u.endAt).length,c=e.length,o=this.activeTypeFilter||this.ongoingOnly?`${c} shown · ${s} total · ${r} ongoing`:`${s} events · ${r} ongoing`,d=li.map(u=>`<button class="ed-chip${u.key===this.activeTypeFilter?" ed-chip-active":""}" data-filter-type="${n(u.key)}">${n(u.label)}</button>`).join(""),l=`<button class="ed-chip${this.ongoingOnly?" ed-chip-active":""}" data-toggle-ongoing>Ongoing only</button>`,h=K({sourceType:"classifier",method:"curated event log",sampleSize:s,sampleLabel:"disruption events",updatedAt:this.data.fetchedAt,classifierVersion:this.data.classifierVersion,creditName:"Operator press + regulator filings + OFAC/EU sanctions + major wire",creditUrl:"/docs/methodology/disruptions"});this.setSafeContent(E(`
      <div class="ed-wrap">
        <div class="ed-summary">${n(o)}</div>
        <div class="ed-filters">${d}${l}</div>
        <table class="ed-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Asset</th>
              <th>Window</th>
              <th>Offline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${t||'<tr><td colspan="5" class="ed-empty">No events match the current filter.</td></tr>'}</tbody>
        </table>
        ${h}
      </div>
      ${Q}
      <style>
        .ed-wrap { font-size: 11px; }
        .ed-summary { font-size: 10px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; margin: 4px 0 6px 0; }
        .ed-filters { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .ed-chip { background: rgba(255,255,255,0.04); color: var(--text-dim, #aaa); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 2px 8px; font-size: 10px; cursor: pointer; }
        .ed-chip:hover { background: rgba(255,255,255,0.08); color: var(--text, #eee); }
        .ed-chip-active { background: #2980b9; border-color: #2980b9; color: #fff; }
        .ed-chip-active:hover { background: #2471a3; }
        .ed-table { width: 100%; border-collapse: collapse; }
        .ed-table th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-dim, #888); padding: 4px 6px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ed-table td { padding: 6px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
        .ed-row { cursor: pointer; }
        .ed-row:hover td { background: rgba(255,255,255,0.03); }
        .ed-event { font-weight: 600; color: var(--text, #eee); }
        .ed-sub { font-size: 9px; color: var(--text-dim, #888); text-transform: uppercase; letter-spacing: 0.04em; }
        .ed-asset-type { display: inline-block; padding: 1px 6px; border-radius: 8px; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; background: rgba(255,255,255,0.08); color: var(--text-dim, #aaa); margin-right: 4px; }
        .ed-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
        .ed-empty { text-align: center; color: var(--text-dim, #888); padding: 20px; font-style: italic; }
        .ed-offline { font-family: monospace; font-size: 10px; color: var(--text, #eee); }
      </style>
    `,"legacy Panel.setContent() migration"))}dispatchOpenAsset(e,t,s){const r=s==="storage"?{facilityId:t}:{pipelineId:t},c=s==="storage"?"energy:open-storage-facility-detail":"energy:open-pipeline-detail";window.dispatchEvent(new CustomEvent(c,{detail:r}))}renderRow(e){const t=oi[e.eventType]??"•",s=ct({startAt:e.startAt,endAt:e.endAt||void 0}),r=xe(e.startAt,e.endAt||void 0),c=$e(e.capacityOfflineBcmYr,e.capacityOfflineMbd),o=e.causeChain.join(" → ")||"—";return`
      <tr class="ed-row"
          data-event-id="${n(e.id)}"
          data-asset-id="${n(e.assetId)}"
          data-asset-type="${n(e.assetType)}">
        <td>
          <div class="ed-event">${t} ${n(e.eventType)}</div>
          <div class="ed-sub">${n(e.shortDescription)}</div>
          <div class="ed-sub">${n(o)}</div>
        </td>
        <td>
          <span class="ed-asset-type">${n(e.assetType)}</span>
          <span class="ed-asset-id">${n(e.assetId)}</span>
        </td>
        <td>${n(r)}</td>
        <td><span class="ed-offline">${n(c||"—")}</span></td>
        <td>${ci(s)}</td>
      </tr>`}}const ps=Object.freeze(Object.defineProperty({__proto__:null,EnergyDisruptionsPanel:di},Symbol.toStringTag,{value:"Module"})),pi=V(()=>new X(j(),{fetch:N})),ui="BZ=F",hi=[{symbol:ui,name:"Brent Crude",display:"BRENT"}],Be="2026-02-23",fi=(()=>{try{return Be}catch{return Be}})(),Ge=Date.parse(`${fi}T00:00:00Z`),gi={closed:"#e74c3c",disrupted:"#e74c3c",restricted:"#f39c12",open:"#27ae60"},mi={closed:"Closed",disrupted:"Disrupted",restricted:"Restricted",open:"Open"},yi={hormuz:{status:"pending"},euGas:{status:"pending"},brent:{status:"pending"},activeDisruptions:{status:"pending"}};class vi extends D{constructor(){super({id:"energy-risk-overview",title:"Global Energy Risk Overview",defaultRowSpan:1,infoTooltip:"Consolidated executive view: Strait of Hormuz vessel status, EU gas storage fill, Brent crude price + 1-day change, active disruption count, data freshness, and a configurable crisis-day counter. Each tile renders independently; one source failing does not block the others."});$(this,"state",yi);$(this,"freshnessTickHandle",null)}destroy(){var e;this.freshnessTickHandle!==null&&(clearInterval(this.freshnessTickHandle),this.freshnessTickHandle=null),(e=super.destroy)==null||e.call(this)}async fetchData(){var c;const[e,t,s,r]=await Promise.allSettled([We(),it(),vt(hi),pi().listEnergyDisruptions({assetId:"",assetType:"",ongoingOnly:!0})]);this.state=bt(e,t,s,r,Date.now()),(c=this.element)!=null&&c.isConnected&&(this.render(),this.freshnessTickHandle===null&&(this.freshnessTickHandle=setInterval(()=>{var o;(o=this.element)!=null&&o.isConnected&&this.render()},6e4)))}render(){bi();const e=`
      <div class="ero-grid">
        ${this.renderHormuzTile()}
        ${this.renderEuGasTile()}
        ${this.renderBrentTile()}
        ${this.renderActiveDisruptionsTile()}
        ${this.renderFreshnessTile()}
        ${this.renderCrisisDayTile()}
      </div>
    `;this.setSafeContent(E(e,"legacy Panel.setContent() migration"))}renderHormuzTile(){const e=this.state.hormuz;if(e.status!=="fulfilled"||!e.value)return T("Hormuz","—","#7f8c8d",'data-degraded="true"');const t=e.value.status,s=gi[t]??"#7f8c8d",r=mi[t]??e.value.status;return T("Hormuz",r,s)}renderEuGasTile(){const e=this.state.euGas;if(e.status!=="fulfilled"||!e.value)return T("EU Gas","—","#7f8c8d",'data-degraded="true"');const t=e.value.fillPct.toFixed(0),s=e.value.fillPct<30?"#e74c3c":e.value.fillPct<50?"#f39c12":"#27ae60";return T("EU Gas",`${t}%`,s)}renderBrentTile(){const e=this.state.brent;if(e.status!=="fulfilled"||!e.value)return T("Brent","—","#7f8c8d",'data-degraded="true"');const t=`$${e.value.price.toFixed(2)}`,s=e.value.change,c=`${s>=0?"+":""}${s.toFixed(2)}%`,o=s>=0?"#e74c3c":"#27ae60";return T("Brent",t,o,"",c)}renderActiveDisruptionsTile(){const e=this.state.activeDisruptions;if(e.status!=="fulfilled"||!e.value)return T("Active disruptions","—","#7f8c8d",'data-degraded="true"');const t=e.value.count,s=t===0?"#27ae60":t<5?"#f39c12":"#e74c3c";return T("Active disruptions",String(t),s)}renderFreshnessTile(){const t=[this.state.hormuz,this.state.euGas,this.state.brent,this.state.activeDisruptions].map(o=>o.fetchedAt).filter(o=>typeof o=="number");if(t.length===0)return T("Updated","—","#7f8c8d",'data-degraded="true"');const s=Math.max(...t),r=Math.floor((Date.now()-s)/6e4),c=r<=0?"just now":r===1?"1 min ago":`${r} min ago`;return T("Updated",c,"#7f8c8d")}renderCrisisDayTile(){if(!Number.isFinite(Ge))return T("Hormuz crisis","—","#7f8c8d",'data-degraded="true"');const e=Math.floor((Date.now()-Ge)/864e5);return e<0?T("Hormuz crisis","pending","#7f8c8d"):T("Hormuz crisis",`Day ${e}`,"#7f8c8d")}}function T(a,i,e,t="",s=""){const r=s?`<div class="ero-tile__sub" style="color:${e}">${n(s)}</div>`:"";return`
    <div class="ero-tile" ${t}>
      <div class="ero-tile__label">${n(a)}</div>
      <div class="ero-tile__value" style="color:${e}">${n(i)}</div>
      ${r}
    </div>
  `}let Ve=!1;function bi(){if(Ve||typeof document>"u")return;const a=document.createElement("style");a.setAttribute("data-ero-styles",""),a.textContent=xi,document.head.appendChild(a),Ve=!0}const xi=`
  .ero-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 8px;
    padding: 8px;
  }
  .ero-tile {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 10px 12px;
    min-height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ero-tile__label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 4px;
  }
  .ero-tile__value {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.1;
  }
  .ero-tile__sub {
    font-size: 12px;
    margin-top: 2px;
  }
`,us=Object.freeze(Object.defineProperty({__proto__:null,EnergyRiskOverviewPanel:vi},Symbol.toStringTag,{value:"Module"})),Ne=V(()=>new He(j(),{fetch:N}));class $i extends D{constructor(){super({id:"fuel-prices",title:x("panels.fuelPrices"),infoTooltip:x("components.fuelPrices.infoTooltip")})}async fetchData(){var i,e,t,s;try{const r=be("fuelPrices");if((i=r==null?void 0:r.countries)!=null&&i.length){if(!((e=this.element)!=null&&e.isConnected))return;this.renderIndex(r),Ne().listFuelPrices({}).then(o=>{var d,l;!((d=this.element)!=null&&d.isConnected)||!((l=o.countries)!=null&&l.length)||this.renderIndex(o)}).catch(()=>{});return}const c=await Ne().listFuelPrices({});if(!((t=this.element)!=null&&t.isConnected))return;this.renderIndex(c)}catch(r){if(this.isAbortError(r)||!((s=this.element)!=null&&s.isConnected))return;this.showError(x("common.failedMarketData"),()=>void this.fetchData())}}renderIndex(i){var p;if(!((p=i.countries)!=null&&p.length)){this.showError(x("common.failedMarketData"),()=>void this.fetchData());return}const e=[...i.countries].sort((f,y)=>{var m,w;const b=((m=f.gasoline)==null?void 0:m.usdPrice)??0;return(((w=y.gasoline)==null?void 0:w.usdPrice)??0)-b}),t=i.cheapestGasoline??"",s=i.mostExpensiveGasoline??"",r=i.cheapestDiesel??"",c=i.mostExpensiveDiesel??"",o=i.wowAvailable,d=e.map(f=>{const y=f.gasoline,b=f.diesel;function g(m,w,S,k){if(!(m!=null&&m.usdPrice))return'<td class="gb-cell gb-na">N/A</td>';const z=k===w?"gb-cheapest":k===S?"gb-priciest":"";let I="";if(o&&m.wowPct!=null&&m.wowPct!==0){const _=m.wowPct>=0?"▲":"▼";I=` <span class="${m.wowPct>=0?"bm-wow-up":"bm-wow-down"}">${_}${Math.abs(m.wowPct).toFixed(1)}%</span>`}return`<td class="gb-cell ${z}">$${m.usdPrice.toFixed(3)}${I}</td>`}return`<tr>
        <td class="gb-item-name">${n(f.flag)} ${n(f.name)}</td>
        ${g(y,t,s,f.code)}
        ${g(b,r,c,f.code)}
      </tr>`}).join(""),l=i.fetchedAt?new Date(i.fetchedAt).toLocaleDateString():"",h=i.countryCount?` (${i.countryCount} ${x("components.fuelPrices.countries")})`:"",u=`
      <div class="gb-wrapper">
        <div class="gb-scroll">
          <table class="gb-table">
            <thead><tr>
              <th class="gb-item-col">${x("panels.fuelPricesCountry")}</th>
              <th class="gb-cell">${x("panels.fuelPricesGasoline")}</th>
              <th class="gb-cell">${x("panels.fuelPricesDiesel")}</th>
            </tr></thead>
            <tbody>${d}</tbody>
          </table>
        </div>
        ${l?`<div class="gb-updated">${x("components.status.updatedAt",{time:l})}${h}</div>`:""}
      </div>
    `;this.setSafeContent(E(u,"legacy Panel.setContent() migration"))}}const hs=Object.freeze(Object.defineProperty({__proto__:null,FuelPricesPanel:$i},Symbol.toStringTag,{value:"Module"})),Ue=["#e67e22","#1abc9c","#9b59b6","#27ae60"],wi="rgba(231,76,60,0.5)";function Ci(a){switch(a){case"closed":return"#e74c3c";case"disrupted":return"#e67e22";case"restricted":return"#f39c12";default:return"#2ecc71"}}function Si(a,i,e,t=280,s=52){if(!a.length)return`<div style="height:${s}px;display:flex;align-items:center;color:var(--text-dim);font-size:10px">${n(x("components.hormuzTracker.noData"))}</div>`;const r=Math.max(...a.map(h=>h.value),1),c=Math.max(2,Math.floor((t-a.length)/a.length));let o=0;const d=a.map(h=>{const u=Math.max(h.value>0?2:1,Math.round(h.value/r*(s-2))),p=h.value===0?wi:i,f=`<rect x="${o}" y="${s-u}" width="${c}" height="${u}" fill="${p}" rx="1"/>`;return o+=c+1,f});o=0;const l=a.map(h=>{const u=`<rect class="hbar" x="${o}" y="0" width="${c}" height="${s}" fill="transparent" data-date="${n(h.date)}" data-val="${h.value}" data-unit="${n(e)}" style="cursor:crosshair"/>`;return o+=c+1,u});return`<svg class="hz-svg" width="${t}" height="${s}" style="display:block;overflow:visible">${d.join("")}${l.join("")}</svg>`}function ki(a,i){const e=Ue[i%Ue.length]??"#3498db",t=a.series[a.series.length-1],s=t?Number(t.value).toFixed(0):x("components.hormuzTracker.notAvailable"),r=t?t.date.slice(5):"",c=a.label.includes("crude_oil")?x("components.hormuzTracker.units.ktPerDay"):x("components.hormuzTracker.units.generic");return`
    <div class="hz-chart" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <span style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.04em">${n(a.title)}</span>
        <span style="font-size:11px;font-weight:600;color:${e}">${n(s)} <span style="font-size:9px;color:var(--text-dim)">${c} · ${n(r)}</span></span>
      </div>
      <div style="position:relative">${Si(a.series,e,c)}</div>
    </div>`}class Ei extends D{constructor(){super({id:"hormuz-tracker",title:x("components.hormuzTracker.title"),showCount:!1,infoTooltip:x("components.hormuzTracker.infoTooltip")});$(this,"data",null);$(this,"tooltipBound",!1)}async fetchData(){this.showLoading();try{const e=await We();return e?(this.data=e,this.renderPanel(),this.bindTooltip(),!0):(this.showError(x("components.hormuzTracker.errors.unavailable"),()=>void this.fetchData()),!1)}catch(e){return this.showError(e instanceof Error?e.message:x("components.hormuzTracker.errors.failedToLoad"),()=>void this.fetchData()),!1}}bindTooltip(){this.tooltipBound||!this.element||(this.tooltipBound=!0,this.element.addEventListener("mousemove",e=>{var l,h;const t=e.target;if(!((l=t.classList)!=null&&l.contains("hbar")))return;const s=(t.getAttribute("data-date")??"").slice(5),r=t.getAttribute("data-val")??"",c=t.getAttribute("data-unit")??"",o=(h=this.element)==null?void 0:h.querySelector(".hz-tip");if(!o)return;const d=t.getBoundingClientRect();o.style.left=`${d.left+d.width/2}px`,o.style.top=`${Math.max(8,d.top-28)}px`,o.style.transform="translateX(-50%)",o.style.opacity="1",o.textContent=`${s}  ${r} ${c}`}),this.element.addEventListener("mouseleave",()=>{var t;const e=(t=this.element)==null?void 0:t.querySelector(".hz-tip");e&&(e.style.opacity="0")}))}renderPanel(){if(!this.data)return;const e=this.data,t=Ci(e.status),s=e.charts.length?e.charts.map((o,d)=>ki(o,d)).join(""):`<div style="color:var(--text-dim);font-size:11px;padding:8px 0">${n(x("components.hormuzTracker.chartUnavailable"))}</div>`,r=e.updatedDate?`<span style="font-size:10px;color:var(--text-dim)">${n(e.updatedDate)}</span>`:"",c=`
      <div style="padding:12px 14px;position:relative">
        <div class="hz-tip" style="position:fixed;pointer-events:none;background:rgba(15,17,26,0.95);border:1px solid rgba(255,255,255,0.15);border-radius:4px;padding:3px 8px;font-size:10px;color:#fff;white-space:nowrap;z-index:9999;opacity:0;transition:opacity 0.08s;letter-spacing:0.02em"></div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="background:${t};color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:0.08em">${e.status.toUpperCase()}</span>
          ${r}
        </div>
        <div>${s}</div>
        <div style="margin-top:4px;font-size:9px;color:var(--text-dim)">
          ${n(x("components.hormuzTracker.sourcePrefix"))} <a href="${n(e.attribution.url)}" target="_blank" rel="noopener" style="color:var(--text-dim);text-decoration:underline">${n(e.attribution.source)}</a>
        </div>
      </div>`;this.setSafeContent(E(c,"legacy Panel.setContent() migration"))}}const fs=Object.freeze(Object.defineProperty({__proto__:null,HormuzPanel:Ei},Symbol.toStringTag,{value:"Module"}));class Ti extends D{constructor(){super({id:"renewable",title:"Renewable Energy",trackActivity:!1,infoTooltip:x("components.renewable.infoTooltip")})}setData(i){var s,r,c;if(at(this.content),i.globalPercentage===0&&!((s=i.regions)!=null&&s.length)){const o=document.createElement("div");o.className="renewable-empty",Object.assign(o.style,{padding:"24px 16px",color:"var(--text-dim)",textAlign:"center",fontSize:"13px"}),o.textContent="No renewable energy data available",this.content.appendChild(o);return}const e=document.createElement("div");e.className="renewable-container",Object.assign(e.style,{padding:"8px"});const t=document.createElement("div");if(t.className="renewable-gauge-section",Object.assign(t.style,{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"12px"}),this.renderGauge(t,i.globalPercentage,i.globalYear),e.appendChild(t),(((r=i.historicalData)==null?void 0:r.length)??0)>2){const o=document.createElement("div");o.className="renewable-sparkline-section",Object.assign(o.style,{marginBottom:"12px"}),this.renderSparkline(o,i.historicalData),e.appendChild(o)}if(((c=i.regions)==null?void 0:c.length)>0){const o=document.createElement("div");o.className="renewable-regions",this.renderRegions(o,i.regions),e.appendChild(o)}this.content.appendChild(e)}renderGauge(i,e,t){const l=fe(i).append("svg").attr("viewBox","0 0 140 140").attr("width",140).attr("height",140).style("display","block").append("g").attr("transform","translate(70,70)"),h=$t().innerRadius(49).outerRadius(70).cornerRadius(4).startAngle(0);l.append("path").datum({endAngle:Math.PI*2}).attr("d",h).attr("fill",O("--border"));const u=e/100*Math.PI*2,p=l.append("path").datum({endAngle:0}).attr("d",h).attr("fill",O("--green")),f=wt(0,u);p.transition().duration(1500).ease(xt).attrTween("d",()=>b=>h({endAngle:f(b)})),l.append("text").attr("class","gauge-value").attr("text-anchor","middle").attr("dominant-baseline","central").attr("dy","-0.15em").attr("fill",O("--text")).attr("font-size","22px").attr("font-weight","700").text(`${e.toFixed(1)}%`),l.append("text").attr("class","gauge-label").attr("text-anchor","middle").attr("dominant-baseline","central").attr("dy","1.4em").attr("fill",O("--text-dim")).attr("font-size","10px").text("Renewable");const y=document.createElement("div");y.className="gauge-year",Object.assign(y.style,{textAlign:"center",fontSize:"10px",color:"var(--text-dim)",marginTop:"4px"}),y.textContent=`Data from ${t}`,i.appendChild(y)}renderSparkline(i,e){const t=this.content.clientWidth-16||200,s=40,r={top:4,right:8,bottom:4,left:8},c=t-r.left-r.right;if(c<=0)return;const d=fe(i).append("svg").attr("width",t).attr("height",s+r.top+r.bottom).style("display","block").append("g").attr("transform",`translate(${r.left},${r.top})`),l=Pe(e,m=>m.year),h=Pe(e,m=>m.value),u=(h[1]-h[0])*.1,p=oe().domain(l).range([0,c]),f=oe().domain([h[0]-u,h[1]+u]).range([s,0]),y=O("--green"),b=ge().x(m=>p(m.year)).y0(s).y1(m=>f(m.value)).curve(Y);d.append("path").datum(e).attr("d",b).attr("fill",y).attr("opacity",.15);const g=De().x(m=>p(m.year)).y(m=>f(m.value)).curve(Y);d.append("path").datum(e).attr("d",g).attr("fill","none").attr("stroke",y).attr("stroke-width",1.5)}renderRegions(i,e){const t=Math.max(...e.map(s=>s.percentage),1);for(let s=0;s<e.length;s++){const r=e[s],c=document.createElement("div");c.className="region-row",Object.assign(c.style,{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"});const o=document.createElement("span");o.className="region-name",Object.assign(o.style,{fontSize:"11px",color:"var(--text-dim)",minWidth:"120px",flexShrink:"0"}),o.textContent=r.name;const d=document.createElement("div");d.className="region-bar-container",Object.assign(d.style,{flex:"1",height:"8px",background:"var(--bg-secondary)",borderRadius:"4px",overflow:"hidden"});const l=document.createElement("div");l.className="region-bar";const h=e.length>1?1-s/(e.length-1)*.5:1;Object.assign(l.style,{width:`${r.percentage/t*100}%`,height:"100%",background:O("--green"),opacity:String(h),borderRadius:"4px",transition:"width 0.6s ease-out"}),d.appendChild(l);const u=document.createElement("span");u.className="region-value",Object.assign(u.style,{fontSize:"11px",fontWeight:"600",color:"var(--text)",minWidth:"42px",textAlign:"right",flexShrink:"0"}),u.textContent=`${r.percentage.toFixed(1)}%`,c.appendChild(o),c.appendChild(d),c.appendChild(u),i.appendChild(c)}}setCapacityData(i){var s;if((s=this.content.querySelector(".capacity-section"))==null||s.remove(),!i||i.length===0)return;const e=document.createElement("div");e.className="capacity-section";const t=document.createElement("div");t.className="capacity-header",t.textContent="US Installed Capacity (EIA)",e.appendChild(t),this.renderCapacityChart(e,i),this.content.appendChild(e)}renderCapacityChart(i,e){const t=e.find(v=>v.source==="SUN"),s=e.find(v=>v.source==="WND"),r=e.find(v=>v.source==="COL"),c=new Set;for(const v of e)for(const P of v.data)c.add(P.year);if(c.size===0)return;const o=[...c].sort((v,P)=>v-P),d=new Map((t==null?void 0:t.data.map(v=>[v.year,v.capacityMw]))??[]),l=new Map((s==null?void 0:s.data.map(v=>[v.year,v.capacityMw]))??[]),h=new Map((r==null?void 0:r.data.map(v=>[v.year,v.capacityMw]))??[]),u=o.map(v=>({year:v,solar:d.get(v)??0,wind:l.get(v)??0,coal:h.get(v)??0})),p=this.content.clientWidth-16||200,f=100,y={top:4,right:8,bottom:16,left:8},b=p-y.left-y.right,g=f-y.top-y.bottom;if(b<=0)return;const w=Ct().keys(["solar","wind"]).order(St).offset(kt)(u),S=oe().domain([o[0],o[o.length-1]]).range([0,b]),k=he(w,v=>he(v,P=>P[1]))??0,z=he(u,v=>v.coal)??0,I=Math.max(k,z)*1.1,_=oe().domain([0,I]).range([g,0]),F=fe(i).append("svg").attr("width",p).attr("height",f).attr("viewBox",`0 0 ${p} ${f}`).style("display","block").append("g").attr("transform",`translate(${y.left},${y.top})`),U=O("--yellow"),H=O("--semantic-info"),B=O("--red"),ee=ge().x(v=>S(v.data.year)).y0(v=>_(v[0])).y1(v=>_(v[1])).curve(Y),te=[U,H];w.forEach((v,P)=>{F.append("path").datum(v).attr("d",ee).attr("fill",te[P]).attr("opacity",.6)});const ie=ge().x(v=>S(v.year)).y0(g).y1(v=>_(v.coal)).curve(Y);F.append("path").datum(u).attr("d",ie).attr("fill",B).attr("opacity",.2);const C=De().x(v=>S(v.year)).y(v=>_(v.coal)).curve(Y);F.append("path").datum(u).attr("d",C).attr("fill","none").attr("stroke",B).attr("stroke-width",1.5).attr("opacity",.8);const W=o[0],se=o[o.length-1];F.append("text").attr("x",S(W)).attr("y",g+12).attr("text-anchor","start").attr("fill",O("--text-dim")).attr("font-size","9px").text(String(W)),F.append("text").attr("x",S(se)).attr("y",g+12).attr("text-anchor","end").attr("fill",O("--text-dim")).attr("font-size","9px").text(String(se));const pe=document.createElement("div");pe.className="capacity-legend";const Xe=[{color:U,label:"Solar"},{color:H,label:"Wind"},{color:B,label:"Coal"}];for(const v of Xe){const P=document.createElement("div");P.className="capacity-legend-item";const ue=document.createElement("span");ue.className="capacity-legend-dot",ue.style.backgroundColor=v.color;const Se=document.createElement("span");Se.textContent=v.label,P.appendChild(ue),P.appendChild(Se),pe.appendChild(P)}i.appendChild(pe)}destroy(){super.destroy()}}const gs=Object.freeze(Object.defineProperty({__proto__:null,RenewableEnergyPanel:Ti},Symbol.toStringTag,{value:"Module"}));export{os as C,ns as E,ds as F,fs as H,as as O,ls as P,gs as R,cs as S,rs as a,ps as b,us as c,hs as d};
