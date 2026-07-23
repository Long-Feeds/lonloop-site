const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/embed-url-q0YUYtcM.js","assets/panel-storage-Duaw_bEH.js","assets/clerk-BdxVomyy.js","assets/i18n-qlunRAMb.js","assets/persistent-cache-Dcj6DDXq.js","assets/widget-store-q5uKLox1.js","assets/debugbear-rum-CX_ciax7.js","assets/embed-url-Dhh-X9ch.css"])))=>i.map(i=>d[i]);
var ce=Object.defineProperty;var le=(a,d,t)=>d in a?ce(a,d,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[d]=t;var b=(a,d,t)=>le(a,typeof d!="symbol"?d+"":d,t);import{P as L}from"./Panel-D0RXcFBq.js";import{$ as kt,a0 as de,a1 as Rt,a2 as pe,a3 as ue,a4 as he}from"./main-CPzCGdxy.js";import{t as i,i as q,q as Z,f as dt,s as me,l as At,h as Mt}from"./panel-storage-Duaw_bEH.js";import{u as D,e as r,a as ve,s as F,t as _}from"./dom-utils-CDIB5TLV.js";import{s as at,m as fe}from"./sparkline-EyuwviXB.js";import{D as Jt,f as ge,a as be,b as ye,c as $e,d as we,e as Se,M as Ce,S as xe,g as Te}from"./index-C4aABlz1.js";import{j as Lt,l as De}from"./gdelt-intel-RxncKK9g.js";import{S as It,r as Pe,g as Ee}from"./index-CZ-M_3kL.js";import{T as ke}from"./transit-chart-DZK6BX1m.js";import{h as pt}from"./panel-gating-R6RQA3k4.js";import{G as X}from"./gulf-fdi-Brj4tDHY.js";import{t as Ft,p as Re,b as Ae,q as Me}from"./widget-store-q5uKLox1.js";import{g as N,c as nt,M as Le,a as rt,r as ot,E as Dt}from"./embed-url-q0YUYtcM.js";import{_ as j}from"./clerk-BdxVomyy.js";import{C as Ie}from"./ciss-staleness-BF7WkacN.js";function Xt(a){return a<20?"#27ae60":a<40?"#f1c40f":a<60?"#e67e22":a<80?"#e74c3c":"#8e44ad"}function Fe(a,d){return a==="ICSA"?d>=1e3?(d/1e3).toFixed(0)+"K":d.toFixed(0):a==="VIXCLS"?d.toFixed(2):a==="STLFSI4"||a==="GSCPI"?d.toFixed(3):d.toFixed(2)}const _t="wm:economic-stress:last-notified-level";function _e(a){if(typeof Notification>"u"||Notification.permission!=="granted")return;const d=a>=85?2:a>=70?1:0;if(d!==0)try{const t=parseInt(sessionStorage.getItem(_t)??"0",10);if(d<=t)return;sessionStorage.setItem(_t,String(d)),new Notification("Economic Stress Alert",{body:`Composite stress index reached ${a.toFixed(1)} (${a>=85?"Critical":"Severe"})`,icon:"/favico/favicon-32x32.png",tag:"economic-stress"})}catch{}}function Be(a){if(a.missing)return`<div style="background:rgba(255,255,255,0.02);border-radius:6px;padding:8px 10px;border:1px solid rgba(255,255,255,0.05)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em">${r(a.label)}</span>
        <span style="font-size:10px;color:#888">N/A</span>
      </div>
      <div style="font-size:9px;color:#666;font-style:italic">Data unavailable</div>
    </div>`;const d=Xt(a.score),t=Math.min(100,Math.max(0,a.score)).toFixed(1),e=Fe(a.id,a.rawValue);return`<div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:8px 10px;border:1px solid rgba(255,255,255,0.07)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <span style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.05em">${r(a.label)}</span>
      <span style="font-size:10px;color:var(--text-dim)">${r(e)}</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <div style="flex:1;background:rgba(255,255,255,0.07);border-radius:3px;height:5px;overflow:hidden">
        <div style="height:100%;width:${t}%;background:${d};border-radius:3px;transition:width 0.3s"></div>
      </div>
      <span style="font-size:10px;font-weight:600;color:${d};min-width:28px;text-align:right">${a.score.toFixed(0)}</span>
    </div>
  </div>`}function ut(a){return a.value===null?"N/A":a.unit==="$B"?`$${a.value.toLocaleString()}B`:`${a.value.toLocaleString()}${a.unit}`}function ht(a){if(a.change===null)return"No change";const d=a.change>0?"+":"";return a.unit==="$B"?`${a.change<0?"-$":`${d}$`}${Math.abs(a.change).toLocaleString()}B`:`${d}${a.change.toLocaleString()}${a.unit}`}function mt(a){return a===null||a===0?"neutral":a>0?"positive":"negative"}function Ne(a){var o,c,u,h;const d=new Map(a.map(f=>[f.id,f])),t=((o=d.get("VIXCLS"))==null?void 0:o.value)??null,e=((c=d.get("T10Y2Y"))==null?void 0:c.value)??null,s=((u=d.get("UNRATE"))==null?void 0:u.value)??null,n=((h=d.get("FEDFUNDS"))==null?void 0:h.value)??null;let l=0;return t!==null&&(l+=t>=25?2:t>=18?1:0),e!==null&&(l+=e<=0?2:e<.5?1:0),s!==null&&(l+=s>=4.5?1:0),n!==null&&(l+=n>=5?1:n<=2?-1:0),l>=4?{label:i("components.economic.pressure.stress"),detail:i("components.economic.pressure.stressDetail"),className:"macro-pressure-stress"}:l>=2?{label:i("components.economic.pressure.watch"),detail:i("components.economic.pressure.watchDetail"),className:"macro-pressure-watch"}:{label:i("components.economic.pressure.steady"),detail:i("components.economic.pressure.steadyDetail"),className:"macro-pressure-steady"}}class Oe extends L{constructor(){super({id:"economic",title:i("panels.economic"),defaultRowSpan:2,infoTooltip:i("components.economic.infoTooltip")});b(this,"fredData",[]);b(this,"blsData",[]);b(this,"spendingData",null);b(this,"bisData",null);b(this,"stressData",null);b(this,"lastUpdate",null);b(this,"activeTab","indicators");b(this,"fredState","loading");b(this,"fredErrorMsg","");this.content.addEventListener("click",t=>{const e=t.target.closest(".panel-tab");e!=null&&e.dataset.tab&&(this.activeTab=e.dataset.tab,this.render())})}update(t){this.fredData=t,this.fredState="ok",this.fredErrorMsg="",this.lastUpdate=new Date,this.render()}setFredError(t){this.fredState="error",this.fredErrorMsg=t,this.render()}setFredRetrying(t){this.fredState="retrying",this.fredErrorMsg=t!==void 0?`${i("common.retrying")} (${t}s)`:i("common.retrying"),this.render()}updateSpending(t){this.spendingData=t,this.render()}updateBis(t){this.bisData=t,this.render()}updateBls(t){this.blsData=t,this.render()}updateStress(t){this.stressData=t,Number.isFinite(t.compositeScore)&&_e(t.compositeScore),this.render()}setLoading(t){t&&(this.fredState="loading",this.fredErrorMsg="")}render(){var c,u;const t=this.spendingData&&((c=this.spendingData.awards)==null?void 0:c.length)>0,e=this.bisData&&((u=this.bisData.policyRates)==null?void 0:u.length)>0,s=this.blsData.length>0,n=`
      <div class="panel-tabs">
        <button class="panel-tab ${this.activeTab==="indicators"?"active":""}" data-tab="indicators">
          ${i("components.economic.indicators")}
        </button>
        ${t?`
          <button class="panel-tab ${this.activeTab==="spending"?"active":""}" data-tab="spending">
            Recent awards
          </button>
        `:""}
        ${e?`
          <button class="panel-tab ${this.activeTab==="centralBanks"?"active":""}" data-tab="centralBanks">
            ${i("components.economic.centralBanks")}
          </button>
        `:""}
        ${s?`
          <button class="panel-tab ${this.activeTab==="labor"?"active":""}" data-tab="labor">
            ${i("components.economic.laborMarket")}
          </button>
        `:""}
        <button class="panel-tab ${this.activeTab==="stress"?"active":""}" data-tab="stress">
          Stress Index
        </button>
      </div>
    `;let l="";switch(this.activeTab){case"indicators":l=this.renderIndicators();break;case"spending":l=this.renderSpending();break;case"centralBanks":l=this.renderCentralBanks();break;case"labor":l=this.renderLabor();break;case"stress":l=this.renderStress();break}const o=this.lastUpdate?this.lastUpdate.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";this.setSafeContent(D(`
      ${n}
      <div class="economic-content">
        ${l}
      </div>
      <div class="economic-footer">
        <span class="economic-source">${this.getSourceLabel()} • ${o}</span>
      </div>
    `,"legacy Panel.setContent() migration"))}getSourceLabel(){switch(this.activeTab){case"indicators":return"FRED";case"spending":return"USASpending.gov";case"centralBanks":return"BIS";case"labor":return"BLS";case"stress":return"FRED"}}renderIndicators(){if(this.fredData.length===0){if(q()&&!Z("economicFred"))return`<div class="economic-empty">${i("components.economic.fredKeyMissing")}</div>`;if(this.fredState==="error"||this.fredState==="retrying"){const o=this.fredState==="retrying",c=o?i("common.upstreamUnavailable"):this.fredErrorMsg,u=c.includes("—")?c.slice(0,c.indexOf("—")).trimEnd():c,h=o?`<div class="panel-error-countdown">${r(this.fredErrorMsg)}</div>`:"";return`
          <div class="panel-error-state">
            <div class="panel-loading-radar panel-error-radar">
              <div class="panel-radar-sweep"></div>
              <div class="panel-radar-dot error"></div>
            </div>
            <div class="panel-error-msg">${r(u)}</div>
            ${h}
          </div>
        `}return`<div class="economic-empty">${i("components.economic.noIndicatorData")}</div>`}const t=Ne(this.fredData),e=["VIXCLS","T10Y2Y","FEDFUNDS","UNRATE"],s=this.fredData.filter(o=>e.includes(o.id)),n=this.fredData.filter(o=>!e.includes(o.id)),l=[...s,...n];return`
      <div class="economic-content-macro">
        <div class="macro-pressure-card ${t.className}">
          <div class="macro-pressure-label">${i("components.economic.pressure.label")}</div>
          <div class="macro-pressure-value">${r(t.label)}</div>
          <div class="macro-pressure-detail">${r(t.detail)}</div>
        </div>
        <div class="macro-summary-grid">
          ${s.map(o=>`
            <div class="macro-summary-card">
              <div class="macro-summary-head">
                <span class="indicator-name">${r(o.name)}</span>
                <span class="indicator-id">${r(o.id)}</span>
              </div>
              <div class="macro-summary-value">${r(ut(o))}</div>
              <div class="macro-summary-change ${mt(o.change)}">${r(ht(o))}</div>
            </div>
          `).join("")}
        </div>
        <div class="economic-indicators">
          ${l.map(o=>{var c;return`
            <div class="economic-indicator" data-series="${r(o.id)}">
              <div class="indicator-header">
                <span class="indicator-name">${r(o.name)}</span>
                <span class="indicator-id">${r(o.id)}</span>
              </div>
              <div class="indicator-value">
                <span class="value">${r(ut(o))}</span>
                <span class="change ${mt(o.change)}">${r(ht(o))}</span>
              </div>
              <div class="indicator-date">${r(o.date)}</div>
              ${at(((c=o.observations)==null?void 0:c.map(u=>u.value))??[],o.change!==null&&o.change>=0?"#4caf50":"#f44336",120,28,"display:block;margin:2px 0")}
            </div>
          `}).join("")}
        </div>
      </div>
    `}renderSpending(){var l;if(!this.spendingData||!((l=this.spendingData.awards)!=null&&l.length))return`<div class="economic-empty">${i("components.economic.noSpending")}</div>`;const{awards:t,totalAmount:e,periodStart:s,periodEnd:n}=this.spendingData;return`
      <div class="spending-summary">
        <div class="spending-total">
          ${r(kt(e))} ${i("components.economic.in")} ${r(String(t.length))} ${i("components.economic.awards")}
          <span class="spending-period">${r(s)} / ${r(n)}</span>
        </div>
      </div>
      <div class="spending-list">
        ${t.slice(0,8).map(o=>`
          <div class="spending-award">
            <div class="award-header">
              <span class="award-icon">${r(de(o.awardType))}</span>
              <span class="award-amount">${r(kt(o.amount))}</span>
            </div>
            <div class="award-recipient">${r(o.recipientName)}</div>
            <div class="award-agency">${r(o.agency)}</div>
            ${o.description?`<div class="award-desc">${r(o.description.slice(0,100))}${o.description.length>100?"...":""}</div>`:""}
          </div>
        `).join("")}
      </div>
    `}renderCentralBanks(){var u,h,f;if(!this.bisData||!((u=this.bisData.policyRates)!=null&&u.length))return`<div class="economic-empty">${i("components.economic.noBisData")}</div>`;const t=dt("--semantic-normal"),e=dt("--semantic-critical"),s=dt("--text-dim"),n=[...this.bisData.policyRates].sort((v,p)=>p.rate-v.rate),l=`
      <div class="bis-section">
        <div class="bis-section-title">${i("components.economic.policyRate")}</div>
        <div class="economic-indicators">
          ${n.map(v=>{const p=v.rate-v.previousRate,m=p<0?t:p>0?e:s,g=p<0?i("components.economic.cut"):p>0?i("components.economic.hike"):i("components.economic.hold"),$=p<0?"▼":p>0?"▲":"–";return`
              <div class="economic-indicator">
                <div class="indicator-header">
                  <span class="indicator-name">${r(v.centralBank)}</span>
                  <span class="indicator-id">${r(v.countryCode)}</span>
                </div>
                <div class="indicator-value">
                  <span class="value">${r(String(v.rate))}%</span>
                  <span class="change" style="color: ${r(m)}">${r($)} ${r(g)}</span>
                </div>
                <div class="indicator-date">${r(v.date)}</div>
              </div>`}).join("")}
        </div>
      </div>
    `;let o="";((h=this.bisData.exchangeRates)==null?void 0:h.length)>0&&(o=`
        <div class="bis-section">
          <div class="bis-section-title">${i("components.economic.realEer")}</div>
          <div class="economic-indicators">
            ${this.bisData.exchangeRates.map(v=>{const p=v.realChange>0?e:v.realChange<0?t:s,m=v.realChange>0?"▲":v.realChange<0?"▼":"–";return`
                <div class="economic-indicator">
                  <div class="indicator-header">
                    <span class="indicator-name">${r(v.countryName)}</span>
                    <span class="indicator-id">${r(v.countryCode)}</span>
                  </div>
                  <div class="indicator-value">
                    <span class="value">${r(String(v.realEer))}</span>
                    <span class="change" style="color: ${r(p)}">${r(m)} ${r(v.realChange>0?"+":"")}${r(String(v.realChange))}%</span>
                  </div>
                  <div class="indicator-date">${r(v.date)}</div>
                </div>`}).join("")}
          </div>
        </div>
      `);let c="";if(((f=this.bisData.creditToGdp)==null?void 0:f.length)>0){const v=[...this.bisData.creditToGdp].sort((p,m)=>m.creditGdpRatio-p.creditGdpRatio);c=`
        <div class="bis-section">
          <div class="bis-section-title">${i("components.economic.creditToGdp")}</div>
          <div class="economic-indicators">
            ${v.map(p=>{const m=p.creditGdpRatio-p.previousRatio,g=m>0?e:m<0?t:s,$=m>0?"▲":m<0?"▼":"–",w=m!==0?`${m>0?"+":""}${Math.round(m*10)/10}pp`:"–";return`
                <div class="economic-indicator">
                  <div class="indicator-header">
                    <span class="indicator-name">${r(p.countryName)}</span>
                    <span class="indicator-id">${r(p.countryCode)}</span>
                  </div>
                  <div class="indicator-value">
                    <span class="value">${r(String(p.creditGdpRatio))}%</span>
                    <span class="change" style="color: ${r(g)}">${r($)} ${r(w)}</span>
                  </div>
                  <div class="indicator-date">${r(p.date)}</div>
                </div>`}).join("")}
          </div>
        </div>
      `}return l+o+c}renderLabor(){if(this.blsData.length===0)return`<div class="economic-empty">${i("components.economic.noIndicatorData")}</div>`;const t=this.blsData.filter(n=>!Rt.has(n.id)),e=this.blsData.filter(n=>Rt.has(n.id)),s=n=>{var l;return`
      <div class="economic-indicator" data-series="${r(n.id)}">
        <div class="indicator-header">
          <span class="indicator-name">${r(n.name)}</span>
          <span class="indicator-id">${r(n.id)}</span>
        </div>
        <div class="indicator-value">
          <span class="value">${r(ut(n))}</span>
          <span class="change ${mt(n.change)}">${r(ht(n))}</span>
        </div>
        <div class="indicator-date">${r(n.date)}</div>
        ${at(((l=n.observations)==null?void 0:l.map(o=>o.value))??[],n.change!==null&&n.change>=0?"#4caf50":"#f44336",120,28,"display:block;margin:2px 0")}
      </div>`};return`
      <div class="economic-content-macro">
        <div class="economic-indicators">
          ${t.map(s).join("")}
        </div>
        ${e.length>0?`
          <div class="bis-section">
            <div class="bis-section-title">${i("components.economic.metroUnemployment")}</div>
            <div class="economic-indicators">
              ${e.map(s).join("")}
            </div>
          </div>
        `:""}
      </div>
    `}renderStress(){const t=this.stressData;if(!t||t.unavailable||!Number.isFinite(t.compositeScore))return'<div class="economic-empty">Stress index data unavailable</div>';const e=Xt(t.compositeScore),s=Math.min(100,Math.max(0,t.compositeScore)).toFixed(1),n=t.components.map(o=>Be(o)).join(""),l=t.seededAt?`<div style="font-size:9px;color:var(--text-dim);text-align:right;margin-top:8px">Updated ${new Date(t.seededAt).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</div>`:"";return`<div style="padding:12px 14px">
      <div style="text-align:center;margin-bottom:12px">
        <div style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Composite Score</div>
        <div style="font-size:38px;font-weight:700;color:${e};line-height:1">${t.compositeScore.toFixed(1)}</div>
        <div style="display:inline-block;margin-top:6px;padding:3px 10px;border-radius:12px;background:${e}22;border:1px solid ${e}66;font-size:12px;font-weight:600;color:${e}">${r(t.label)}</div>
      </div>
      <div style="margin-bottom:16px">
        <div style="position:relative;height:12px;border-radius:6px;overflow:visible;background:linear-gradient(to right,#27ae60 0%,#f1c40f 20%,#e67e22 40%,#e74c3c 60%,#8e44ad 80%,#8e44ad 100%);margin-bottom:4px">
          <div style="position:absolute;top:-4px;left:calc(${s}% - 2px);width:4px;height:20px;background:#fff;border-radius:2px;box-shadow:0 0 4px rgba(0,0,0,0.6)"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-dim)">
          <span>Low</span><span>Moderate</span><span>Elevated</span><span>Severe</span><span>Critical</span>
        </div>
      </div>
      ${n?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">${n}</div>`:""}
      ${l}
    </div>`}}const Qs=Object.freeze(Object.defineProperty({__proto__:null,EconomicPanel:Oe},Symbol.toStringTag,{value:"Module"})),vt={query:"",buyer:"",country:"",source:"",sort:"closing_soon",pageSize:25,cursor:"",minAutomationScore:0},Ue=30,Ge=[["","All sources"],["sam","SAM.gov"],["ted","TED"],["contracts-finder","Contracts Finder"],["canada-buys","CanadaBuys"],["gets","GETS"],["world-bank","World Bank"]],je=[["closing_soon","Closing soon"],["newest","Newest"],["estimated_value","Estimated value"],["relevance","Technology relevance"]];function Bt(a,d){return a===d?" selected":""}function He(a){if(!a)return null;const d=new Date(a);return Number.isFinite(d.getTime())?d:null}class ze extends L{constructor(){super({id:"global-procurement",title:"Global Procurement",defaultRowSpan:2,showCount:!0,premium:"locked",infoTooltip:"Search active official procurement opportunities. Results are seed-backed and source health is reported explicitly."});b(this,"data",null);b(this,"filters",{...vt});b(this,"requestHandler",null);b(this,"loading",!1);this.showLoading("Loading procurement opportunities…"),this.content.addEventListener("submit",t=>{const e=t.target.closest("[data-procurement-filters]");e&&(t.preventDefault(),this.filters=this.readFilters(e),this.request({...this.filters,cursor:""},!1))}),this.content.addEventListener("click",t=>{var s;const e=t.target;if(e.closest("[data-procurement-load-more]")){const n=(s=this.data)==null?void 0:s.nextCursor;n&&this.request({...this.filters,cursor:n},!0);return}e.closest("[data-procurement-reset]")&&(this.filters={...vt},this.request({...this.filters},!1))})}setRequestHandler(t){this.requestHandler=t}setLoading(t,e=!1){if(this.loading=t,t&&!e&&!this.data){this.showLoading("Loading procurement opportunities…");return}this.render()}update(t,e=!1){if(this.loading=!1,e&&this.data){const s=new Map(this.data.tenders.map(n=>[n.id,n]));t.tenders.forEach(n=>s.set(n.id,n)),this.data={...t,tenders:[...s.values()]}}else this.data=t;this.setCount(this.data.total),this.render()}showUnavailable(){this.loading=!1,this.data=null,this.setCount(0),this.showError("Procurement opportunities are currently unavailable.",()=>this.request({...this.filters},!1),60)}clear(){this.data=null,this.filters={...vt},this.loading=!1,this.setCount(0),this.clearSensitiveContent()}request(t,e){!this.requestHandler||this.loading||(this.filters={...t,cursor:""},this.setLoading(!0,e),this.requestHandler(t,e))}readFilters(t){const e=new FormData(t);return{query:String(e.get("query")||"").trim(),buyer:String(e.get("buyer")||"").trim(),country:String(e.get("country")||"").trim().toUpperCase().slice(0,2),source:String(e.get("source")||""),sort:String(e.get("sort")||"closing_soon"),pageSize:25,cursor:"",minAutomationScore:e.get("techRelevant")?Ue:0}}render(){const t=this.data,e=this.renderControls();if(!t){this.setSafeContent(D(`${e}<div class="economic-empty">No procurement snapshot is available yet.</div>`,"global procurement controls"));return}const s=t.sourceStatuses.map(u=>{const h=u.lastSuccessfulAt?` · last success ${new Date(u.lastSuccessfulAt).toLocaleString()}`:"";return`${u.source}: ${u.state} (${u.recordCount})${h}`}).join(" · "),n=t.availability==="partial"?'<div class="economic-warning">Partial coverage — healthy sources remain visible while one or more sources are unavailable.</div>':t.availability==="stale"?'<div class="economic-warning">Showing stale last-good opportunities while all source refreshes are failing.</div>':t.availability==="empty"?'<div class="economic-empty">Official sources returned no matching open opportunities.</div>':t.dataAvailable?"":'<div class="economic-warning">The canonical procurement snapshot is unavailable.</div>',l=t.tenders.map(u=>this.renderTenderCard(u)).join(""),o=t.tenders.length,c=t.nextCursor?`<button type="button" class="debt-load-more" data-procurement-load-more${this.loading?" disabled":""}>${this.loading?"Loading…":"Load more"} <span class="debt-load-more-count">(${Math.max(0,t.total-o)} remaining)</span></button>`:"";this.setSafeContent(D(`
      ${e}
      ${n}
      <div class="global-procurement-summary">Showing ${o.toLocaleString()} of ${t.total.toLocaleString()} matching opportunities</div>
      ${l?`<div class="spending-list global-procurement-list">${l}</div>`:""}
      ${c}
      <div class="economic-footer"><span class="economic-source">${r(s)}${t.fetchedAt?` · snapshot ${r(new Date(t.fetchedAt).toLocaleString())}`:""}</span></div>
    `,"global procurement results"))}renderControls(){return`<form class="global-procurement-controls" data-procurement-filters>
      <input class="global-procurement-input" name="query" data-procurement-query type="search" value="${r(String(this.filters.query||""))}" placeholder="Search title or description" aria-label="Search procurement opportunities">
      <input class="global-procurement-input" name="buyer" type="search" value="${r(String(this.filters.buyer||""))}" placeholder="Buyer" aria-label="Filter by buyer">
      <input class="global-procurement-input global-procurement-country" name="country" data-procurement-country type="text" maxlength="2" value="${r(String(this.filters.country||""))}" placeholder="Country" aria-label="Filter by ISO country code">
      <select class="global-procurement-select" name="source" data-procurement-source aria-label="Filter by source">
        ${Ge.map(([t,e])=>`<option value="${t}"${Bt(this.filters.source,t)}>${e}</option>`).join("")}
      </select>
      <select class="global-procurement-select" name="sort" data-procurement-sort aria-label="Sort opportunities">
        ${je.map(([t,e])=>`<option value="${t}"${Bt(this.filters.sort,t)}>${e}</option>`).join("")}
      </select>
      <label class="global-procurement-toggle" title="Shows only opportunities whose title, description, or categories matched technology keywords. Keyword relevance evidence only — not an indication of bidding eligibility.">
        <input type="checkbox" name="techRelevant" data-procurement-tech-relevant${(this.filters.minAutomationScore||0)>0?" checked":""}${this.loading?" disabled":""}>
        Technology relevant only
      </label>
      <button type="submit" class="global-procurement-apply"${this.loading?" disabled":""}>Apply</button>
      <button type="button" class="global-procurement-reset" data-procurement-reset${this.loading?" disabled":""}>Reset</button>
    </form>`}renderTenderCard(t){var h,f,v;const e=ve(t.officialUrl),s=He(t.deadline),n=s?Math.ceil((s.getTime()-Date.now())/864e5):null,l=n!==null&&n>=0&&n<=3,o=(h=t.money)!=null&&h.amount&&t.money.amount>0?`${t.money.currency||""} ${t.money.amount.toLocaleString()}`.trim():"",c=[t.source,t.buyer,t.countryCode,o,s?`Closes ${s.toLocaleDateString()}`:"",l?"CLOSING SOON":""].filter(p=>!!p).map(p=>r(p)).join(" · "),u=(v=(f=t.automationFit)==null?void 0:f.matchReasons)!=null&&v.length?`<div class="award-agency">Technology relevance (keyword evidence, not bidding eligibility): ${r(t.automationFit.matchReasons.join(", "))}</div>`:"";return`<article class="spending-award global-procurement-card">
      <div class="award-header"><span class="award-amount">${r(t.status.toUpperCase())}</span><span class="award-icon">${l?"⏰":"📄"}</span></div>
      <div class="award-recipient">${r(t.title)}</div>
      <div class="award-agency">${c}</div>
      ${t.description?`<div class="award-desc">${r(t.description.slice(0,240))}${t.description.length>240?"…":""}</div>`:""}
      ${u}
      ${e?`<a href="${e}" target="_blank" rel="noopener noreferrer nofollow" class="award-agency">Official notice ↗</a>`:""}
    </article>`}}const Js=Object.freeze(Object.defineProperty({__proto__:null,GlobalProcurementPanel:ze},Symbol.toStringTag,{value:"Module"})),te="wm-consumer-prices-v1",Ve="wm-consumer-prices-settings-changed",Nt="wm-consumer-prices-open-tab",Ke=["overview","categories","movers","spread","health","world"],Ot={market:Te,basket:Jt,range:"30d",tab:"overview",categoryFilter:null};function We(){try{const a=localStorage.getItem(te);if(a)return{...Ot,...JSON.parse(a)}}catch{}return{...Ot}}function G(a){try{localStorage.setItem(te,JSON.stringify(a)),window.dispatchEvent(new CustomEvent(Ve,{detail:a}))}catch{}}function O(a,d=!1){if(a==null||a===0)return'<span class="cp-badge cp-badge--neutral">—</span>';const t=d?a>0?"cp-badge--red":"cp-badge--green":a>0?"cp-badge--green":"cp-badge--red",e=a>0?"+":"";return`<span class="cp-badge ${t}">${e}${a.toFixed(1)}%</span>`}function Ye(a){return Math.abs(a)<.5?'<span class="cp-pressure cp-pressure--steady">Stable</span>':a>=2?'<span class="cp-pressure cp-pressure--stress">Rising</span>':a>.5?'<span class="cp-pressure cp-pressure--watch">Mild Rise</span>':'<span class="cp-pressure cp-pressure--green">Easing</span>'}function V(a){return a==null||a===0?"Unknown":a<60?`${a}m ago`:a<1440?`${Math.round(a/60)}h ago`:`${Math.round(a/1440)}d ago`}function K(a){return a==null?"cp-fresh--unknown":a<=60?"cp-fresh--ok":a<=240?"cp-fresh--warn":"cp-fresh--stale"}function qe(a){return a==null?"cp-infl--unknown":a>=10?"cp-infl--high":a>=5?"cp-infl--warn":a<0?"cp-infl--deflation":"cp-infl--ok"}function Ut(a){return a==null?"—":`${a>=0?"+":""}${a.toFixed(1)}%`}class Ze extends L{constructor(){super({id:"consumer-prices",title:i("panels.consumerPrices"),defaultRowSpan:2,infoTooltip:i("components.consumerPrices.infoTooltip")});b(this,"overview",null);b(this,"categories",null);b(this,"movers",null);b(this,"spread",null);b(this,"freshness",null);b(this,"allMarkets",[]);b(this,"globalInflation",null);b(this,"inflationLoading",!1);b(this,"inflationFilter","");b(this,"settings",We());b(this,"loading",!1);b(this,"openTabHandler",t=>{var s;const e=(s=t.detail)==null?void 0:s.tab;!e||!Ke.includes(e)||(this.settings.tab=e,G(this.settings),this.render(),e==="world"&&this.globalInflation===null&&this.loadGlobalInflation())});this.content.addEventListener("click",t=>this.handleClick(t)),this.content.addEventListener("input",t=>this.handleInput(t)),typeof window<"u"&&window.addEventListener(Nt,this.openTabHandler)}destroy(){var t;typeof window<"u"&&window.removeEventListener(Nt,this.openTabHandler),(t=super.destroy)==null||t.call(this)}handleClick(t){const e=t.target,s=e.closest("[data-market]");if(s!=null&&s.dataset.market){const u=s.dataset.market;this.settings.market=u,this.settings.basket=u==="all"?Jt:`essentials-${u}`,this.settings.tab="overview",G(this.settings),this.fetchData();return}const n=e.closest(".panel-tab");if(n!=null&&n.dataset.tab){this.settings.tab=n.dataset.tab,G(this.settings),this.render();return}const l=e.closest("[data-category]");if(l!=null&&l.dataset.category){this.settings.categoryFilter=l.dataset.category,this.settings.tab="movers",G(this.settings),this.render();return}const o=e.closest("[data-range]");if(o!=null&&o.dataset.range){this.settings.range=o.dataset.range,G(this.settings),this.fetchData();return}e.closest("[data-clear-filter]")&&(this.settings.categoryFilter=null,G(this.settings),this.render())}handleInput(t){const e=t.target;if(!(e instanceof HTMLInputElement)||e.dataset.inflationFilter===void 0||(this.inflationFilter=e.value,this.globalInflation===null||this.globalInflation.length===0))return;const s=this.visibleInflationRows(),n=this.content.querySelector(".cp-world-table tbody");n&&F(n,_(this.inflationTbodyHtml(s),"escaped IMF inflation rows"));const l=this.content.querySelector(".cp-world-count");l&&(l.textContent=this.inflationCountText(s))}async loadGlobalInflation(){var t;if(!this.inflationLoading){this.inflationLoading=!0;try{const e=await pe();if(!((t=this.element)!=null&&t.isConnected))return;this.globalInflation=e,this.settings.tab==="world"&&this.render()}finally{this.inflationLoading=!1}}}async fetchData(){var h,f;if(this.loading)return;this.loading=!0,this.showLoading();const{market:t,basket:e,range:s}=this.settings;if(t==="all"){const v=await ge();if(!((h=this.element)!=null&&h.isConnected)){this.loading=!1;return}this.allMarkets=v,this.loading=!1,this.render();return}const[n,l,o,c,u]=await Promise.all([be(t,e),ye(t,e,s),$e(t,s),we(t,e),Se(t)]);if(!((f=this.element)!=null&&f.isConnected)){this.loading=!1;return}this.overview=n,this.categories=l,this.movers=o,this.spread=c,this.freshness=u,this.loading=!1,this.render()}render(){var m;const t=[{id:"overview",label:i("components.consumerPrices.tabs.overview")},{id:"categories",label:i("components.consumerPrices.tabs.categories")},{id:"movers",label:i("components.consumerPrices.tabs.movers")},{id:"spread",label:i("components.consumerPrices.tabs.spread")},{id:"health",label:i("components.consumerPrices.tabs.health")},{id:"world",label:i("components.consumerPrices.tabs.world")}],s=this.settings.market==="all"||this.settings.tab==="world"?t.filter(g=>g.id==="overview"||g.id==="world"):t;s.some(g=>g.id===this.settings.tab)||(this.settings.tab="overview");const{tab:n,range:l,categoryFilter:o,market:c}=this.settings,u=`
      <div class="panel-tabs">
        ${s.map(g=>`
          <button class="panel-tab${n===g.id?" active":""}" data-tab="${g.id}">
            ${r(g.label)}
          </button>
        `).join("")}
      </div>
    `,h=`
      <div class="cp-market-bar">
        ${Ce.map(g=>`
          <button class="cp-market-btn${c===g.code?" active":""}" data-market="${g.code}">${g.label}</button>
        `).join("")}
      </div>
    `,f=`
      <div class="cp-range-bar">
        ${["7d","30d","90d"].map(g=>`
          <button class="cp-range-btn${l===g?" active":""}" data-range="${g}">${g}</button>
        `).join("")}
      </div>
    `;if(n==="world"){this.setSafeContent(D(`
        <div class="consumer-prices-panel">
          ${u}
          <div class="cp-body">${this.renderWorldInflation()}</div>
        </div>
      `,"legacy Panel.setContent() migration"));return}if(c==="all"){this.setSafeContent(D(`
        <div class="consumer-prices-panel">
          ${h}
          ${u}
          <div class="cp-body">${this.renderGlobalOverview()}</div>
        </div>
      `,"legacy Panel.setContent() migration"));return}if((m=this.overview)==null?void 0:m.upstreamUnavailable){this.setSafeContent(D(`
        <div class="consumer-prices-panel">
          ${h}
          ${u}
          <div class="cp-body cp-seeding-state">
            <div class="cp-seeding-icon">📊</div>
            <div class="cp-seeding-title">Data collection in progress</div>
            <div class="cp-seeding-sub">Retail prices are being aggregated — check back in a few hours.</div>
          </div>
        </div>
      `,"legacy Panel.setContent() migration"));return}let p="";switch(n){case"overview":p=this.renderOverview();break;case"categories":p=f+this.renderCategories();break;case"movers":p=f+(o?`<div class="cp-filter-bar">Filtered: <strong>${r(o)}</strong> <button data-clear-filter>✕</button></div>`:"")+this.renderMovers();break;case"spread":p=this.renderSpread();break;case"health":p=this.renderHealth();break}this.setSafeContent(D(`
      <div class="consumer-prices-panel">
        ${h}
        ${u}
        <div class="cp-body">${p}</div>
      </div>
    `,"legacy Panel.setContent() migration"))}renderGlobalOverview(){return this.allMarkets.length===0?'<div class="cp-empty-state">Loading global data…</div>':`
      <table class="cp-global-table">
        <thead>
          <tr>
            <th>Market</th><th>Index</th><th>WoW</th><th>Spread</th><th>Updated</th>
          </tr>
        </thead>
        <tbody>${xe.map(e=>{const s=this.allMarkets.find(c=>c.marketCode===e.code);if(!(s&&s.asOf&&s.asOf!=="0"&&!s.upstreamUnavailable))return`
          <tr class="cp-global-row" data-market="${e.code}">
            <td class="cp-global-flag">${e.label}</td>
            <td colspan="4" class="cp-global-pending">Pending data</td>
          </tr>`;const l=O(s.wowPct,!0),o=K(s.freshnessLagMin>0?s.freshnessLagMin:null);return`
        <tr class="cp-global-row" data-market="${e.code}">
          <td class="cp-global-flag">${e.label}</td>
          <td class="cp-global-index">${s.essentialsIndex>0?s.essentialsIndex.toFixed(1):"—"}</td>
          <td class="cp-global-wow">${l}</td>
          <td class="cp-global-spread">${s.retailerSpreadPct>0?`${s.retailerSpreadPct.toFixed(1)}%`:"—"}</td>
          <td class="cp-global-fresh ${o}">${s.freshnessLagMin>0?V(s.freshnessLagMin):"—"}</td>
        </tr>`}).join("")}</tbody>
      </table>
      <div class="cp-global-hint">Tap a market row to drill in</div>
    `}visibleInflationRows(){const t=this.globalInflation??[],e=this.inflationFilter.trim().toLowerCase();return e?t.filter(s=>s.name.toLowerCase().includes(e)||s.iso2.toLowerCase().includes(e)):t}inflationCountText(t){const e=t.length===1?i("components.consumerPrices.world.countSingular"):i("components.consumerPrices.world.countPlural");return`${t.length} ${e}`}inflationTbodyHtml(t){return t.length===0?`<tr><td colspan="4" class="cp-global-pending">${r(i("components.consumerPrices.world.noMatches"))}</td></tr>`:t.map(e=>{const s=qe(e.inflationPct);return`
        <tr class="cp-global-row">
          <td class="cp-global-flag">${r(e.name)}</td>
          <td class="cp-infl-yoy ${s}">${Ut(e.inflationPct)}</td>
          <td class="cp-infl-eop">${Ut(e.cpiEopPct)}</td>
          <td class="cp-infl-year">${e.year??"—"}</td>
        </tr>`}).join("")}renderWorldInflation(){if(this.globalInflation===null)return this.inflationLoading||this.loadGlobalInflation(),`<div class="cp-empty-state">${r(i("components.consumerPrices.world.loading"))}</div>`;if(this.globalInflation.length===0)return this.renderEmptyState(i("components.consumerPrices.world.empty"));const t=this.visibleInflationRows();return`
      <div class="cp-world-controls">
        <input type="search" class="cp-world-filter" data-inflation-filter
          placeholder="${r(i("components.consumerPrices.world.filterPlaceholder"))}"
          value="${r(this.inflationFilter)}" />
        <span class="cp-world-count">${r(this.inflationCountText(t))}</span>
      </div>
      <table class="cp-global-table cp-world-table">
        <thead>
          <tr>
            <th>${r(i("components.consumerPrices.world.country"))}</th>
            <th>${r(i("components.consumerPrices.world.inflationYoY"))}</th>
            <th>${r(i("components.consumerPrices.world.endOfPeriod"))}</th>
            <th>${r(i("components.consumerPrices.world.year"))}</th>
          </tr>
        </thead>
        <tbody>${this.inflationTbodyHtml(t)}</tbody>
      </table>
      <div class="cp-global-hint">${r(i("components.consumerPrices.world.source"))}</div>
    `}renderOverview(){var e;const t=this.overview;return!t||!t.asOf||t.asOf==="0"?this.renderEmptyState("No price data available yet"):`
      <div class="cp-overview-grid">
        <div class="cp-stat-card">
          <div class="cp-stat-label">Essentials Basket</div>
          <div class="cp-stat-value">${t.essentialsIndex>0?t.essentialsIndex.toFixed(1):"—"}</div>
          <div class="cp-stat-sub">Index (base 100)</div>
        </div>
        <div class="cp-stat-card">
          <div class="cp-stat-label">Value Basket</div>
          <div class="cp-stat-value">${t.valueBasketIndex>0?t.valueBasketIndex.toFixed(1):"—"}</div>
          <div class="cp-stat-sub">Index (base 100)</div>
        </div>
        <div class="cp-stat-card">
          <div class="cp-stat-label">Week-over-Week</div>
          <div class="cp-stat-value">${O(t.wowPct,!0)}</div>
          <div class="cp-stat-sub">${Ye(t.wowPct)}</div>
        </div>
        <div class="cp-stat-card">
          <div class="cp-stat-label">Month-over-Month</div>
          <div class="cp-stat-value">${O(t.momPct,!0)}</div>
        </div>
        <div class="cp-stat-card">
          <div class="cp-stat-label">Retailer Spread</div>
          <div class="cp-stat-value">${t.retailerSpreadPct>0?`${t.retailerSpreadPct.toFixed(1)}%`:"—"}</div>
          <div class="cp-stat-sub">Cheapest vs most exp.</div>
        </div>
        <div class="cp-stat-card">
          <div class="cp-stat-label">Coverage</div>
          <div class="cp-stat-value">${t.coveragePct>0?`${t.coveragePct.toFixed(0)}%`:"—"}</div>
          <div class="cp-stat-sub ${K(t.freshnessLagMin)}">
            ${V(t.freshnessLagMin)}
          </div>
        </div>
      </div>
      ${(e=t.topCategories)!=null&&e.length?`
        <div class="cp-section-label">Top Category Movers</div>
        <div class="cp-category-mini">
          ${t.topCategories.slice(0,5).map(s=>this.renderCategoryMini(s)).join("")}
        </div>
      `:""}
    `}renderCategoryMini(t){var s;const e=(s=t.sparkline)!=null&&s.length?at(t.sparkline,"var(--accent)",40,16):"";return`
      <div class="cp-cat-mini-row" data-category="${r(t.slug)}">
        <span class="cp-cat-name">${r(t.name)}</span>
        <span class="cp-cat-spark">${e}</span>
        ${O(t.momPct,!0)}
      </div>
    `}renderCategories(){var e;const t=(e=this.categories)==null?void 0:e.categories;return t!=null&&t.length?`
      <table class="cp-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>WoW</th>
            <th>MoM</th>
            <th>Trend</th>
            <th>Coverage</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(s=>{var n;return`
            <tr class="cp-cat-row" data-category="${r(s.slug)}">
              <td><strong>${r(s.name)}</strong></td>
              <td>${O(s.wowPct,!0)}</td>
              <td>${O(s.momPct,!0)}</td>
              <td>${(n=s.sparkline)!=null&&n.length?at(s.sparkline,"var(--accent)",48,18):"—"}</td>
              <td>${s.coveragePct>0?`${s.coveragePct.toFixed(0)}%`:"—"}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
    `:this.renderEmptyState("No category data yet")}renderMovers(){const t=this.movers;if(!t)return this.renderEmptyState("No price movement data yet");const{categoryFilter:e}=this.settings,s=o=>!e||o.category===e,n=(t.risers??[]).filter(s).slice(0,8),l=(t.fallers??[]).filter(s).slice(0,8);return!n.length&&!l.length?this.renderEmptyState("No movers for this selection"):`
      <div class="cp-movers-grid">
        <div class="cp-movers-col">
          <div class="cp-col-header cp-col-header--up">Rising</div>
          ${n.map(o=>this.renderMoverRow(o,"up")).join("")||'<div class="cp-empty-col">None</div>'}
        </div>
        <div class="cp-movers-col">
          <div class="cp-col-header cp-col-header--down">Falling</div>
          ${l.map(o=>this.renderMoverRow(o,"down")).join("")||'<div class="cp-empty-col">None</div>'}
        </div>
      </div>
    `}renderMoverRow(t,e){const s=t.changePct>0?"+":"";return`
      <div class="cp-mover-row cp-mover-row--${e}">
        <div class="cp-mover-title">${r(t.title)}</div>
        <div class="cp-mover-meta">
          <span class="cp-mover-cat">${r(t.category)}</span>
          <span class="cp-mover-retailer">${r(t.retailerSlug)}</span>
        </div>
        <div class="cp-mover-pct">${s}${t.changePct.toFixed(1)}%</div>
      </div>
    `}renderSpread(){var e;const t=this.spread;return(e=t==null?void 0:t.retailers)!=null&&e.length?`
      <div class="cp-spread-header">
        <span>Spread: <strong>${t.spreadPct.toFixed(1)}%</strong></span>
        <span class="cp-spread-basket">${r(t.basketSlug)} · ${r(t.currencyCode)}</span>
      </div>
      <div class="cp-spread-list">
        ${t.retailers.map((s,n)=>this.renderSpreadRow(s,n,t.currencyCode)).join("")}
      </div>
    `:this.renderEmptyState("Retailer comparison starts once data is collected")}renderSpreadRow(t,e,s){const n=e===0;return`
      <div class="cp-spread-row ${n?"cp-spread-row--cheapest":""}">
        <div class="cp-spread-rank">#${e+1}</div>
        <div class="cp-spread-name">${r(t.name)}</div>
        <div class="cp-spread-total">${s} ${t.basketTotal.toFixed(2)}</div>
        <div class="cp-spread-delta">${n?'<span class="cp-badge cp-badge--green">Cheapest</span>':O(t.deltaVsCheapestPct,!0)}</div>
        <div class="cp-spread-items">${t.itemCount} items</div>
        <div class="cp-spread-fresh ${K(t.freshnessMin)}">${V(t.freshnessMin)}</div>
      </div>
    `}renderHealth(){var e;const t=this.freshness;return(e=t==null?void 0:t.retailers)!=null&&e.length?`
      <div class="cp-health-summary">
        <span>Overall freshness: <strong class="${K(t.overallFreshnessMin)}">${V(t.overallFreshnessMin)}</strong></span>
        ${t.stalledCount>0?`<span class="cp-stalled-badge">${t.stalledCount} stalled</span>`:""}
      </div>
      <div class="cp-health-list">
        ${t.retailers.map(s=>`
          <div class="cp-health-row">
            <span class="cp-health-name">${r(s.name)}</span>
            <span class="cp-health-status cp-health-status--${s.status}">${s.status}</span>
            <span class="cp-health-rate">${s.parseSuccessRate>0?`${s.parseSuccessRate.toFixed(0)}% parse`:"—"}</span>
            <span class="cp-health-fresh ${K(s.freshnessMin)}">${V(s.freshnessMin)}</span>
          </div>
        `).join("")}
      </div>
    `:this.renderEmptyState("Health data not yet available")}renderEmptyState(t){return`<div class="cp-empty-state">${r(t)}</div>`}}const Xs=Object.freeze(Object.defineProperty({__proto__:null,ConsumerPricesPanel:Ze},Symbol.toStringTag,{value:"Module"}));class Qe extends L{constructor(){super({id:"trade-policy",title:i("panels.tradePolicy"),defaultRowSpan:2,infoTooltip:i("components.tradePolicy.infoTooltip")});b(this,"restrictionsData",null);b(this,"tariffsData",null);b(this,"flowsData",null);b(this,"barriersData",null);b(this,"revenueData",null);b(this,"comtradeData",null);b(this,"activeTab","restrictions");this.content.addEventListener("click",t=>{const e=t.target.closest(".panel-tab");if(!e)return;const s=e.dataset.tab;s&&s!==this.activeTab&&(this.activeTab=s,this.render())})}updateRestrictions(t){this.restrictionsData=t,this.render()}updateTariffs(t){this.tariffsData=t,this.render()}updateFlows(t){this.flowsData=t,this.render()}updateBarriers(t){this.barriersData=t,this.render()}updateComtradeFlows(t){this.comtradeData=t,this.render()}updateRevenue(t){this.revenueData=t,q()&&!Z("wtoTrade")&&this.activeTab!=="revenue"&&(this.activeTab="revenue"),this.render()}render(){var m,g,$,w,P,C,T,R,y,S,x,E,I,A,M,ct,J,H,k;const t=!q()||Z("wtoTrade"),e=t&&this.tariffsData&&((m=this.tariffsData.datapoints)==null?void 0:m.length)>0,s=t&&this.flowsData&&((g=this.flowsData.flows)==null?void 0:g.length)>0,n=t&&this.barriersData&&(($=this.barriersData.barriers)==null?void 0:$.length)>0,l=this.revenueData&&((w=this.revenueData.months)==null?void 0:w.length)>0,o=this.comtradeData&&((P=this.comtradeData.flows)==null?void 0:P.length)>0;if(!t&&!l&&!o){this.setSafeContent(D(`<div class="economic-empty">${i("components.tradePolicy.apiKeyMissing")}</div>`,"legacy Panel.setContent() migration"));return}!t&&this.activeTab!=="revenue"&&this.activeTab!=="comtrade"&&(this.activeTab="revenue");const c=`
      <div class="panel-tabs">
        ${t?`<button class="panel-tab ${this.activeTab==="restrictions"?"active":""}" data-tab="restrictions">
          ${i("components.tradePolicy.overview")}
        </button>`:""}
        ${e?`<button class="panel-tab ${this.activeTab==="tariffs"?"active":""}" data-tab="tariffs">
          ${i("components.tradePolicy.tariffs")}
        </button>`:""}
        ${s?`<button class="panel-tab ${this.activeTab==="flows"?"active":""}" data-tab="flows">
          ${i("components.tradePolicy.flows")}
        </button>`:""}
        ${n?`<button class="panel-tab ${this.activeTab==="barriers"?"active":""}" data-tab="barriers">
          ${i("components.tradePolicy.barriers")}
        </button>`:""}
        ${l?`<button class="panel-tab ${this.activeTab==="revenue"?"active":""}" data-tab="revenue">
          ${i("components.tradePolicy.revenue")}
        </button>`:""}
        ${o?`<button class="panel-tab ${this.activeTab==="comtrade"?"active":""}" data-tab="comtrade">
          ${i("components.tradePolicy.strategicFlows")}
        </button>`:""}
      </div>
    `,u=this.activeTab==="restrictions"?(((T=(C=this.restrictionsData)==null?void 0:C.restrictions)==null?void 0:T.length)??0)>0:this.activeTab==="tariffs"?(((y=(R=this.tariffsData)==null?void 0:R.datapoints)==null?void 0:y.length)??0)>0:this.activeTab==="flows"?(((x=(S=this.flowsData)==null?void 0:S.flows)==null?void 0:x.length)??0)>0:this.activeTab==="barriers"?(((I=(E=this.barriersData)==null?void 0:E.barriers)==null?void 0:I.length)??0)>0:this.activeTab==="comtrade"?(((M=(A=this.comtradeData)==null?void 0:A.flows)==null?void 0:M.length)??0)>0:(((J=(ct=this.revenueData)==null?void 0:ct.months)==null?void 0:J.length)??0)>0,h=this.activeTab==="restrictions"?this.restrictionsData:this.activeTab==="tariffs"?this.tariffsData:this.activeTab==="flows"?this.flowsData:this.activeTab==="barriers"?this.barriersData:this.activeTab==="comtrade"?this.comtradeData:this.revenueData,f=!u&&(h!=null&&h.upstreamUnavailable)?`<div class="economic-warning">${this.activeTab==="revenue"?i("components.tradePolicy.treasuryUnavailable"):this.activeTab==="comtrade"?i("components.tradePolicy.comtradeUnavailable"):i("components.tradePolicy.upstreamUnavailable")}</div>`:"";let v="";switch(this.activeTab){case"restrictions":v=this.renderRestrictions();break;case"tariffs":v=this.renderTariffs();break;case"flows":v=this.renderFlows();break;case"barriers":v=this.renderBarriers();break;case"revenue":v=this.renderRevenue();break;case"comtrade":v=this.renderComtradeFlows();break}const p=this.activeTab==="comtrade"?i("components.tradePolicy.sourceComtrade"):this.activeTab==="revenue"?i("components.tradePolicy.sourceTreasury"):(this.activeTab==="tariffs"||this.activeTab==="restrictions")&&((k=(H=this.tariffsData)==null?void 0:H.effectiveTariffRate)!=null&&k.sourceName)?`${i("components.tradePolicy.sourceWto")} / ${this.tariffsData.effectiveTariffRate.sourceName}`:i("components.tradePolicy.sourceWto");this.setSafeContent(D(`
      ${c}
      ${f}
      <div class="economic-content">${v}</div>
      <div class="economic-footer">
        <span class="economic-source">${r(p)}</span>
      </div>
    `,"legacy Panel.setContent() migration"))}renderRestrictions(){var t;return!this.restrictionsData||!((t=this.restrictionsData.restrictions)!=null&&t.length)?`<div class="economic-empty">${i("components.tradePolicy.noOverviewData")}</div>`:`${this.renderRestrictionsContext()}
    <div class="trade-restrictions-list">
      ${this.restrictionsData.restrictions.map(e=>{const s=e.status==="high"?"status-active":e.status==="moderate"?"status-notified":"status-terminated",n=e.status==="high"?i("components.tradePolicy.highTariff"):e.status==="moderate"?i("components.tradePolicy.moderateTariff"):i("components.tradePolicy.lowTariff"),l=this.renderSourceUrl(e.sourceUrl);return`<div class="trade-restriction-card">
          <div class="trade-restriction-header">
            <span class="trade-country">${r(e.reportingCountry)}</span>
            <span class="trade-badge">${r(e.measureType)}</span>
            <span class="trade-status ${s}">${n}</span>
          </div>
          <div class="trade-restriction-body">
            <div class="trade-sector">${r(e.productSector)}</div>
            ${e.description?`<div class="trade-description">${r(e.description)}</div>`:""}
            ${this.renderRestrictionEffectiveContext(e.reportingCountry)}
            ${e.affectedCountry?`<div class="trade-affected">Affects: ${r(e.affectedCountry)}</div>`:""}
          </div>
          <div class="trade-restriction-footer">
            ${e.notifiedAt?`<span class="trade-date">${r(e.notifiedAt)}</span>`:""}
            ${l}
          </div>
        </div>`}).join("")}
    </div>`}renderRestrictionsContext(){const t=this.getEffectiveTariffGapSummary();if(!t)return`<div class="trade-policy-note">${i("components.tradePolicy.overviewNoteNoEffective")}</div>`;const e=t.gap>0?"+":"",s=this.renderSourceUrl(t.effectiveRate.sourceUrl);return`<div class="trade-policy-note">
      ${i("components.tradePolicy.usBaselineLabel")}: <strong>${t.baseline.tariffRate.toFixed(1)}%</strong>.
      ${i("components.tradePolicy.effectiveTariffRateLabel")}: <strong>${t.effectiveRate.tariffRate.toFixed(1)}%</strong>.
      ${i("components.tradePolicy.gapLabel")}: <strong>${e}${t.gap.toFixed(1)}pp</strong>.
      ${i("components.tradePolicy.overviewNoteTail")}
      ${s}
    </div>`}renderTariffs(){var o;if(!this.tariffsData||!((o=this.tariffsData.datapoints)!=null&&o.length))return`<div class="economic-empty">${i("components.tradePolicy.noTariffData")}</div>`;const t=[...this.tariffsData.datapoints].sort((c,u)=>u.year-c.year),e=t[0]??null,s=this.tariffsData.effectiveTariffRate??null,n=this.renderTariffSummary(e,s),l=t.map(c=>`<tr>
        <td>${c.year}</td>
        <td>${c.tariffRate.toFixed(1)}%</td>
        <td>${r(c.productSector||"—")}</td>
      </tr>`).join("");return`${n}
    <div class="trade-tariffs-table">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>${i("components.tradePolicy.mfnAppliedRate")}</th>
            <th>Sector</th>
          </tr>
        </thead>
        <tbody>${l}</tbody>
      </table>
    </div>`}renderTariffSummary(t,e){if(!t)return"";const s=i("components.tradePolicy.wtoBaselineMeta",{year:String(t.year)}),n=`
      <div class="trade-tariff-card">
        <div class="trade-tariff-label">${i("components.tradePolicy.baselineMfnTariff")}</div>
        <div class="trade-tariff-value">${t.tariffRate.toFixed(1)}%</div>
        <div class="trade-tariff-meta">${r(s)}</div>
      </div>
    `;if(!e)return`<div class="trade-tariff-summary">
        ${n}
        <div class="trade-tariff-card trade-tariff-card-muted">
          <div class="trade-tariff-label">${i("components.tradePolicy.effectiveTariffRateLabel")}</div>
          <div class="trade-tariff-value">—</div>
          <div class="trade-tariff-meta">${i("components.tradePolicy.noEffectiveCoverageForCountry")}</div>
        </div>
      </div>`;const l=e.tariffRate-t.tariffRate,o=l>0?"+":"",c=l>=0?"trade-tariff-gap-positive":"trade-tariff-gap-negative",u=[e.sourceName,e.observationPeriod,e.updatedAt?`Updated ${e.updatedAt}`:""].filter(Boolean),h=this.renderSourceUrl(e.sourceUrl);return`<div class="trade-tariff-summary">
      ${n}
      <div class="trade-tariff-card">
        <div class="trade-tariff-label">${i("components.tradePolicy.effectiveTariffRateLabel")}</div>
        <div class="trade-tariff-value">${e.tariffRate.toFixed(1)}%</div>
        <div class="trade-tariff-meta">
          ${r(u.join(" | "))}
          ${h?`<span class="trade-tariff-source">${h}</span>`:""}
        </div>
      </div>
      <div class="trade-tariff-card">
        <div class="trade-tariff-label">${i("components.tradePolicy.gapLabel")}</div>
        <div class="trade-tariff-value ${c}">${o}${l.toFixed(1)}pp</div>
        <div class="trade-tariff-meta">${i("components.tradePolicy.effectiveMinusBaseline")}</div>
      </div>
    </div>`}getLatestBaselineTariffPoint(){var t,e;return(e=(t=this.tariffsData)==null?void 0:t.datapoints)!=null&&e.length?[...this.tariffsData.datapoints].sort((s,n)=>n.year-s.year)[0]??null:null}getEffectiveTariffGapSummary(){var s;const t=this.getLatestBaselineTariffPoint(),e=((s=this.tariffsData)==null?void 0:s.effectiveTariffRate)??null;return!t||!e?null:{baseline:t,effectiveRate:e,gap:e.tariffRate-t.tariffRate}}renderRestrictionEffectiveContext(t){if(t!=="United States")return"";const e=this.getEffectiveTariffGapSummary();if(!e)return"";const s=e.gap>0?"+":"";return`<div class="trade-policy-inline-note">
      ${i("components.tradePolicy.effectiveTariffRateLabel")}: ${e.effectiveRate.tariffRate.toFixed(1)}%
      <span class="trade-policy-inline-sep">|</span>
      ${i("components.tradePolicy.gapVsMfnLabel")}: ${s}${e.gap.toFixed(1)}pp
    </div>`}renderFlows(){var t;return!this.flowsData||!((t=this.flowsData.flows)!=null&&t.length)?`<div class="economic-empty">${i("components.tradePolicy.noFlowData")}</div>`:`<div class="trade-flows-list">
      ${this.flowsData.flows.map(e=>{const s=e.yoyExportChange>=0?"▲":"▼",n=e.yoyImportChange>=0?"▲":"▼",l=e.yoyExportChange>=0?"change-positive":"change-negative",o=e.yoyImportChange>=0?"change-positive":"change-negative";return`<div class="trade-flow-card">
          <div class="trade-flow-year">${e.year}</div>
          <div class="trade-flow-metrics">
            <div class="trade-flow-metric">
              <span class="trade-flow-label">${i("components.tradePolicy.exports")}</span>
              <span class="trade-flow-value">$${e.exportValueUsd.toFixed(0)}M</span>
              <span class="trade-flow-change ${l}">${s} ${Math.abs(e.yoyExportChange).toFixed(1)}%</span>
            </div>
            <div class="trade-flow-metric">
              <span class="trade-flow-label">${i("components.tradePolicy.imports")}</span>
              <span class="trade-flow-value">$${e.importValueUsd.toFixed(0)}M</span>
              <span class="trade-flow-change ${o}">${n} ${Math.abs(e.yoyImportChange).toFixed(1)}%</span>
            </div>
          </div>
        </div>`}).join("")}
    </div>`}renderBarriers(){var t;return!this.barriersData||!((t=this.barriersData.barriers)!=null&&t.length)?`<div class="economic-empty">${i("components.tradePolicy.noBarriers")}</div>`:`<div class="trade-barriers-list">
      ${this.barriersData.barriers.map(e=>{const s=this.renderSourceUrl(e.sourceUrl);return`<div class="trade-barrier-card">
          <div class="trade-barrier-header">
            <span class="trade-country">${r(e.notifyingCountry)}</span>
            <span class="trade-badge">${r(e.measureType)}</span>
          </div>
          <div class="trade-barrier-body">
            <div class="trade-barrier-title">${r(e.title)}</div>
            ${e.productDescription?`<div class="trade-sector">${r(e.productDescription)}</div>`:""}
            ${e.objective?`<div class="trade-description">${r(e.objective)}</div>`:""}
          </div>
          <div class="trade-barrier-footer">
            ${e.dateDistributed?`<span class="trade-date">${r(e.dateDistributed)}</span>`:""}
            ${s}
          </div>
        </div>`}).join("")}
    </div>`}renderRevenue(){var R;if(!this.revenueData||!((R=this.revenueData.months)!=null&&R.length))return`<div class="economic-empty">${i("components.tradePolicy.noRevenueData")}</div>`;const t=this.revenueData.months,s=t[t.length-1].fiscalYear,n=t.filter(y=>y.fiscalYear===s),l=n.length,c=t.filter(y=>y.fiscalYear===s-1).slice(0,l),u=n.reduce((y,S)=>y+S.monthlyAmountBillions,0),h=c.reduce((y,S)=>y+S.monthlyAmountBillions,0),f=h>0?(u-h)/h*100:0,v=f>=0?"change-negative":"change-positive",p=f>=0?"▲":"▼",m=`
      <div class="trade-revenue-summary">
        <div class="trade-revenue-headline">
          <span class="trade-revenue-label">${i("components.tradePolicy.fytdLabel",{year:String(s)})}</span>
          <span class="trade-revenue-value">$${u.toFixed(1)}B</span>
        </div>
        <div class="trade-revenue-compare">
          ${i("components.tradePolicy.vsPriorFy",{year:String(s-1)})}: $${h.toFixed(1)}B
          <span class="${v}">${p} ${Math.abs(f).toFixed(0)}%</span>
        </div>
      </div>
    `,g=c.length>0?h/c.length:0,$=[...t].slice(-12),w=Math.max(...$.map(y=>y.monthlyAmountBillions),1),C=`<div class="trade-revenue-chart">${$.map(y=>{const S=Math.round(y.monthlyAmountBillions/w*100),x=y.recordDate.slice(0,7),E=y.monthlyAmountBillions>g*1.5;return`<div class="trade-chart-col" title="${x}: $${y.monthlyAmountBillions.toFixed(1)}B">
        <div class="trade-chart-bar${E?" trade-chart-spike":""}" style="height:${S}%"></div>
        <div class="trade-chart-label">${y.recordDate.slice(5,7)}</div>
      </div>`}).join("")}</div>`,T=[...t].reverse().slice(0,24).map(y=>`<tr${y.monthlyAmountBillions>g*2?' class="trade-revenue-spike"':""}>
        <td>${y.recordDate}</td>
        <td>$${y.monthlyAmountBillions.toFixed(1)}B</td>
        <td>$${y.fytdAmountBillions.toFixed(1)}B</td>
      </tr>`).join("");return`${m}
    ${C}
    <div class="trade-tariffs-table">
      <table>
        <thead>
          <tr>
            <th>${i("components.tradePolicy.colDate")}</th>
            <th>${i("components.tradePolicy.colMonthly")}</th>
            <th>${i("components.tradePolicy.colFytd")}</th>
          </tr>
        </thead>
        <tbody>${T}</tbody>
      </table>
    </div>`}renderComtradeFlows(){var u;const t=(u=this.comtradeData)==null?void 0:u.flows;if(!(t!=null&&t.length))return`<div class="economic-empty">${i("components.tradePolicy.noComtradeData")}</div>`;const e=t.filter(h=>h.partnerCode==="0"||h.partnerCode==="000"),s=e.length>0?e:t,n=new Map;for(const h of s){const f=`${h.reporterCode}:${h.cmdCode}:${h.year}`,v=n.get(f);(!v||h.tradeValueUsd>v.tradeValueUsd)&&n.set(f,h)}const l=new Map;for(const h of n.values()){const f=`${h.reporterCode}:${h.cmdCode}`,v=l.get(f);(!v||h.year>v.year)&&l.set(f,h)}const c=[...l.values()].sort((h,f)=>h.isAnomaly!==f.isAnomaly?h.isAnomaly?-1:1:Math.abs(f.yoyChange)-Math.abs(h.yoyChange)).map(h=>{const f=h.yoyChange>=0?"▲":"▼",v=h.yoyChange>=0?"change-positive":"change-negative",p=`${f} ${Math.abs(h.yoyChange*100).toFixed(0)}%`,m=h.tradeValueUsd>=1e9?`$${(h.tradeValueUsd/1e9).toFixed(1)}B`:`$${(h.tradeValueUsd/1e6).toFixed(0)}M`,g=h.isAnomaly?`<span style="margin-left:6px;font-size:9px;font-weight:600;letter-spacing:0.05em;padding:1px 5px;border-radius:3px;background:rgba(255,68,68,0.15);color:var(--red);vertical-align:middle;text-transform:uppercase">${i("components.tradePolicy.anomalyBadge")}</span>`:"";return`<tr class="${h.isAnomaly?"trade-anomaly-row":""}">
        <td>${r(h.reporterName)}${g}</td>
        <td>${r(h.cmdDesc)}</td>
        <td>${m} <span class="trade-flow-year">${h.year}</span></td>
        <td class="${v}">${p}</td>
      </tr>`}).join("");return`<div class="trade-tariffs-table">
      <table>
        <thead><tr>
          <th>${i("components.tradePolicy.colReporter")}</th>
          <th>${i("components.tradePolicy.colCommodity")}</th>
          <th>${i("components.tradePolicy.colTradeValue")}</th>
          <th>${i("components.tradePolicy.yoyChange")}</th>
        </tr></thead>
        <tbody>${c}</tbody>
      </table>
    </div>`}renderSourceUrl(t){if(!t)return"";try{const e=new URL(t);if(e.protocol==="http:"||e.protocol==="https:")return`<a href="${r(t)}" target="_blank" rel="noopener" class="trade-source-link">Source</a>`}catch{}return""}}const ta=Object.freeze(Object.defineProperty({__proto__:null,TradePolicyPanel:Qe},Symbol.toStringTag,{value:"Module"}));class Je extends L{constructor(){super({id:"sanctions-pressure",title:i("components.sanctionsPressure.title"),showCount:!0,trackActivity:!0,defaultRowSpan:2,infoTooltip:i("components.sanctionsPressure.infoTooltip")});b(this,"data",null);this.showLoading(i("components.sanctionsPressure.loading"))}setData(t){this.data=t,this.setCount(t.totalCount),this.render()}render(){if(!this.data||this.data.totalCount===0){this.setSafeContent(D(`<div class="economic-empty">${r(i("components.sanctionsPressure.unavailable"))}</div>`,"legacy Panel.setContent() migration"));return}const t=this.data,e=`
      <div class="sanctions-summary">
        ${this.renderSummaryCard(i("components.sanctionsPressure.summary.new"),t.newEntryCount,t.newEntryCount>0?"highlight":"")}
        ${this.renderSummaryCard(i("components.sanctionsPressure.summary.vessels"),t.vesselCount)}
        ${this.renderSummaryCard(i("components.sanctionsPressure.summary.aircraft"),t.aircraftCount)}
      </div>
    `,s=t.countries.length>0?t.countries.slice(0,8).map(c=>this.renderCountryRow(c)).join(""):`<div class="economic-empty">${r(i("components.sanctionsPressure.empty.countries"))}</div>`,n=t.entries.length>0?t.entries.slice(0,10).map(c=>this.renderEntryRow(c)).join(""):`<div class="economic-empty">${r(i("components.sanctionsPressure.empty.entries"))}</div>`,l=t.programs.length>0?t.programs.slice(0,6).map(c=>this.renderProgramRow(c)).join(""):`<div class="economic-empty">${r(i("components.sanctionsPressure.empty.programs"))}</div>`,o=[i("components.sanctionsPressure.footer.updated",{time:t.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),t.datasetDate?i("components.sanctionsPressure.footer.dataset",{date:t.datasetDate.toISOString().slice(0,10)}):"",i("components.sanctionsPressure.footer.source")].filter(Boolean).join(" · ");this.setSafeContent(D(`
      <div class="sanctions-panel-content">
        ${e}
        <div class="sanctions-sections">
          <div class="sanctions-section">
            <div class="sanctions-section-title">${r(i("components.sanctionsPressure.sections.countries"))}</div>
            <div class="sanctions-list">${s}</div>
          </div>
          <div class="sanctions-section">
            <div class="sanctions-section-title">${r(i("components.sanctionsPressure.sections.entries"))}</div>
            <div class="sanctions-list">${n}</div>
          </div>
          <div class="sanctions-section">
            <div class="sanctions-section-title">${r(i("components.sanctionsPressure.sections.programs"))}</div>
            <div class="sanctions-list">${l}</div>
          </div>
        </div>
        <div class="economic-footer">${r(o)}</div>
      </div>
    `,"legacy Panel.setContent() migration"))}renderSummaryCard(t,e,s=""){return`
      <div class="sanctions-summary-card ${s?`sanctions-summary-card-${s}`:""}">
        <span class="sanctions-summary-label">${r(t)}</span>
        <span class="sanctions-summary-value">${r(String(e))}</span>
      </div>
    `}renderCountryRow(t){const e=[];return t.newEntryCount>0&&e.push(`<span class="sanctions-pill sanctions-pill-new">${r(i("components.sanctionsPressure.pills.newCount",{count:t.newEntryCount}))}</span>`),t.vesselCount>0&&e.push(`<span class="sanctions-pill">🚢 ${t.vesselCount}</span>`),t.aircraftCount>0&&e.push(`<span class="sanctions-pill">✈ ${t.aircraftCount}</span>`),`
      <div class="sanctions-row">
        <div class="sanctions-row-main">
          <div class="sanctions-row-title">${r(t.countryName)}</div>
          <div class="sanctions-row-meta">${r(t.countryCode)} · ${r(i("components.sanctionsPressure.designations",{count:t.entryCount}))}</div>
        </div>
        <div class="sanctions-row-flags">${e.join("")}</div>
      </div>
    `}renderProgramRow(t){return`
      <div class="sanctions-row">
        <div class="sanctions-row-main">
          <div class="sanctions-row-title">${r(t.program)}</div>
          <div class="sanctions-row-meta">${r(i("components.sanctionsPressure.designations",{count:t.entryCount}))}</div>
        </div>
        <div class="sanctions-row-flags">
          ${t.newEntryCount>0?`<span class="sanctions-pill sanctions-pill-new">${r(i("components.sanctionsPressure.pills.newCount",{count:t.newEntryCount}))}</span>`:""}
        </div>
      </div>
    `}renderEntryRow(t){const e=t.countryNames[0]||t.countryCodes[0]||i("components.sanctionsPressure.fallbacks.unattributed"),s=t.programs[0]||i("components.sanctionsPressure.fallbacks.program"),n=t.note?`<div class="sanctions-entry-note">${r(t.note)}</div>`:"",l=t.effectiveAt?t.effectiveAt.toISOString().slice(0,10):i("components.sanctionsPressure.fallbacks.undated");return`
      <div class="sanctions-entry">
        <div class="sanctions-entry-top">
          <span class="sanctions-entry-name">${r(t.name)}</span>
          <span class="sanctions-pill sanctions-pill-type">${r(t.entityType)}</span>
          ${t.isNew?`<span class="sanctions-pill sanctions-pill-new">${r(i("components.sanctionsPressure.pills.new"))}</span>`:""}
        </div>
        <div class="sanctions-entry-meta">${r(e)} · ${r(s)} · ${r(l)}</div>
        ${n}
      </div>
    `}}const ea=Object.freeze(Object.defineProperty({__proto__:null,SanctionsPressurePanel:Je},Symbol.toStringTag,{value:"Module"})),Xe=new Set(["hormuz_strait","malacca_strait","suez","bab_el_mandeb"]);class ts extends L{constructor(){super({id:"supply-chain",title:i("panels.supplyChain"),defaultRowSpan:2,infoTooltip:i("components.supplyChain.infoTooltip")});b(this,"shippingData",null);b(this,"chokepointData",null);b(this,"mineralsData",null);b(this,"stressData",null);b(this,"activeTab","chokepoints");b(this,"expandedChokepoint",null);b(this,"transitChart",new ke);b(this,"chartObserver",null);b(this,"chartMountTimer",null);b(this,"historyCache",new Map);b(this,"historyInflight",new Set);b(this,"bypassUnsubscribe",null);b(this,"bypassGateTracked",!1);b(this,"onDismissScenario",null);b(this,"onScenarioActivate",null);b(this,"activeScenarioState",null);b(this,"scenarioPollController",null);this.content.addEventListener("click",t=>{const e=t.target.closest(".panel-tab");if(e){const l=e.dataset.tab;l&&l!==this.activeTab&&(this.clearTransitChart(),this.activeTab=l,this.render());return}const s=t.target.closest(".sc-scenario-trigger");if(s){t.stopPropagation();const l=s.querySelector(".sc-scenario-btn");l&&!l.disabled&&this.runScenario(s,l);return}const n=t.target.closest(".trade-restriction-card");if(n!=null&&n.dataset.cpId){const l=this.expandedChokepoint===n.dataset.cpId?null:n.dataset.cpId;l||this.clearTransitChart(),this.expandedChokepoint=l,this.render()}})}clearTransitChart(){this.chartMountTimer&&(clearTimeout(this.chartMountTimer),this.chartMountTimer=null),this.chartObserver&&(this.chartObserver.disconnect(),this.chartObserver=null),this.transitChart.destroy(),this.bypassUnsubscribe&&(this.bypassUnsubscribe(),this.bypassUnsubscribe=null),this.bypassGateTracked=!1}updateShippingRates(t){this.shippingData=t,this.render()}updateChokepointStatus(t){this.chokepointData=t,this.render()}updateCriticalMinerals(t){this.mineralsData=t,this.render()}updateShippingStress(t){this.stressData=t,this.render()}render(){var o,c,u,h,f,v,p,m,g,$,w,P;this.clearTransitChart();const t=`
      <div class="panel-tabs">
        <button class="panel-tab ${this.activeTab==="chokepoints"?"active":""}" data-tab="chokepoints">
          ${i("components.supplyChain.chokepoints")}
        </button>
        <button class="panel-tab ${this.activeTab==="shipping"?"active":""}" data-tab="shipping">
          ${i("components.supplyChain.shipping")}
        </button>
        <button class="panel-tab ${this.activeTab==="indicators"?"active":""}" data-tab="indicators">
          ${i("components.supplyChain.economicIndicators")}
        </button>
        <button class="panel-tab ${this.activeTab==="minerals"?"active":""}" data-tab="minerals">
          ${i("components.supplyChain.minerals")}
        </button>
        <button class="panel-tab ${this.activeTab==="stress"?"active":""}" data-tab="stress">
          Stress
        </button>
      </div>
    `,e=this.activeTab==="chokepoints"?(((c=(o=this.chokepointData)==null?void 0:o.chokepoints)==null?void 0:c.length)??0)>0:this.activeTab==="shipping"?(((h=(u=this.shippingData)==null?void 0:u.indices)==null?void 0:h.length)??0)>0||this.chokepointData!==null:this.activeTab==="indicators"?(((v=(f=this.shippingData)==null?void 0:f.indices)==null?void 0:v.length)??0)>0:this.activeTab==="stress"?(((m=(p=this.stressData)==null?void 0:p.carriers)==null?void 0:m.length)??0)>0:((($=(g=this.mineralsData)==null?void 0:g.minerals)==null?void 0:$.length)??0)>0,s=this.activeTab==="chokepoints"?this.chokepointData:this.activeTab==="shipping"||this.activeTab==="indicators"?this.shippingData:this.activeTab==="stress"?this.stressData:this.mineralsData,n=!e&&(s!=null&&s.upstreamUnavailable)?`<div class="economic-warning">${i("components.supplyChain.upstreamUnavailable")}</div>`:"";let l="";switch(this.activeTab){case"chokepoints":l=this.renderChokepoints();break;case"shipping":l=this.renderShipping();break;case"indicators":l=this.renderIndicators();break;case"minerals":l=this.renderMinerals();break;case"stress":l=this.renderStress();break}if(this.setSafeContent(D(`
      ${t}
      ${n}
      <div class="economic-content">${l}</div>
    `,"legacy Panel.setContent() migration")),this.activeTab==="chokepoints"&&this.expandedChokepoint){const C=this.expandedChokepoint,T=(P=(w=this.chokepointData)==null?void 0:w.chokepoints)==null?void 0:P.find(x=>x.name===C),R=()=>{const x=this.content.querySelector(`[data-chart-cp="${C}"]`);if(!x)return!1;const E=(T==null?void 0:T.id)??"";if(!E)return x.textContent=i("components.supplyChain.historyUnavailable")||"History unavailable",!0;const I=this.historyCache.get(E);return I&&I.length?(x.removeAttribute("style"),x.style.marginTop="8px",x.style.minHeight="200px",x.textContent="",this.transitChart.mount(x,I),!0):(this.historyInflight.has(E)||(this.historyInflight.add(E),De(E).then(A=>{this.historyInflight.delete(E);const M=this.content.querySelector(`[data-chart-cp-id="${E}"]`);M&&(A.history.length?(this.historyCache.set(E,A.history),M.removeAttribute("style"),M.style.marginTop="8px",M.style.minHeight="200px",M.textContent="",this.transitChart.mount(M,A.history)):M.textContent=i("components.supplyChain.historyUnavailable")||"History unavailable")}).catch(()=>{this.historyInflight.delete(E);const A=this.content.querySelector(`[data-chart-cp-id="${E}"]`);A&&(A.textContent=i("components.supplyChain.historyUnavailable")||"History unavailable")})),!0)},y=()=>{const x=this.content.querySelector(`[data-bypass-cp="${(T==null?void 0:T.id)??""}"]`);return x?(this.renderBypassSection(x,(T==null?void 0:T.id)??""),!0):!1},S=()=>y()?(R(),!0):!1;this.chartObserver=new MutationObserver(()=>{var x;S()&&(this.chartMountTimer&&(clearTimeout(this.chartMountTimer),this.chartMountTimer=null),(x=this.chartObserver)==null||x.disconnect(),this.chartObserver=null)}),this.chartObserver.observe(this.content,{childList:!0,subtree:!0}),this.chartMountTimer=setTimeout(()=>{S()&&(this.chartObserver&&(this.chartObserver.disconnect(),this.chartObserver=null),this.chartMountTimer=null)},220)}this.activeScenarioState&&this.renderScenarioBanner()}renderBypassSection(t,e){if(!e)return;const s=()=>'<div class="sc-bypass-gate"><span class="sc-bypass-lock">🔒</span><span class="sc-bypass-gate-text">Bypass corridors available with PRO</span></div>',n=c=>{const u=c.slice(0,3);return u.length?`<table class="sc-bypass-table">
        <thead><tr><th>Corridor</th><th>+Days</th><th>+Cost</th><th>Risk</th></tr></thead>
        <tbody>${u.map(f=>{const v=f.addedTransitDays>0?`+${f.addedTransitDays}d`:"-",p=f.addedCostMultiplier>1?`+${((f.addedCostMultiplier-1)*100).toFixed(0)}%`:"-",g={WAR_RISK_TIER_UNSPECIFIED:"Normal",WAR_RISK_TIER_WAR_ZONE:"War Zone",WAR_RISK_TIER_CRITICAL:"Critical",WAR_RISK_TIER_HIGH:"High",WAR_RISK_TIER_ELEVATED:"Elevated",WAR_RISK_TIER_NORMAL:"Normal"}[f.bypassWarRiskTier]??f.bypassWarRiskTier;return`<tr><td>${r(f.name)}</td><td>${v}</td><td>${p}</td><td>${r(g)}</td></tr>`}).join("")}</tbody>
      </table>`:'<div class="sc-bypass-error">No bypass options available</div>'},l=(c,u)=>{if(!c){F(t,_(s(),"legacy direct innerHTML migration")),this.bypassGateTracked||(At("bypass-corridors"),this.bypassGateTracked=!0);return}u!==void 0&&F(t,_(n(u),"legacy direct innerHTML migration"))};if(!pt(Mt())){l(!1),this.bypassUnsubscribe&&this.bypassUnsubscribe(),this.bypassUnsubscribe=me(c=>{if(pt(c)){if(this.bypassUnsubscribe&&(this.bypassUnsubscribe(),this.bypassUnsubscribe=null),!this.content.contains(t))return;F(t,_('<div class="sc-bypass-loading">Loading bypass options…</div>',"legacy direct innerHTML migration")),Lt(e,"container",100).then(u=>{this.content.contains(t)&&F(t,_(n(u.options),"legacy direct innerHTML migration"))}).catch(()=>{this.content.contains(t)&&F(t,_('<div class="sc-bypass-error">Bypass data unavailable</div>',"legacy direct innerHTML migration"))})}});return}Lt(e,"container",100).then(c=>{this.content.contains(t)&&l(!0,c.options)}).catch(()=>{this.content.contains(t)&&F(t,_('<div class="sc-bypass-error">Bypass data unavailable</div>',"legacy direct innerHTML migration"))})}renderChokepoints(){var n,l,o;if(!this.chokepointData||!((n=this.chokepointData.chokepoints)!=null&&n.length))return`<div class="economic-empty">${i("components.supplyChain.noChokepoints")}</div>`;const t=(l=this.activeScenarioState)==null?void 0:l.result,e=new Set((t==null?void 0:t.affectedChokepointIds)??[]),s=((o=t==null?void 0:t.template)==null?void 0:o.disruptionPct)??null;return`<div class="trade-restrictions-list">
      ${[...this.chokepointData.chokepoints].sort((c,u)=>u.disruptionScore-c.disruptionScore).map(c=>{var H;const u=e.has(c.id),h=c.status==="red"?"status-active":c.status==="yellow"?"status-notified":"status-terminated",f=c.status==="red"?"sc-dot-red":c.status==="yellow"?"sc-dot-yellow":"sc-dot-green",v=c.aisDisruptions??(c.congestionLevel==="normal"?0:1),p=c.transitSummary,m=(p==null?void 0:p.wowChangePct)??0,g=p&&m!==0,$=g?`<span class="${m>=0?"change-positive":"change-negative"}">${m>=0?"▲":"▼"}${Math.abs(m).toFixed(1)}%</span>`:"",w=(p==null?void 0:p.disruptionPct)??0,P=w>10?"sc-disrupt-red":w>3?"sc-disrupt-yellow":"sc-disrupt-green",C=(p==null?void 0:p.riskLevel)==="critical"||(p==null?void 0:p.riskLevel)==="high"?"sc-disrupt-red":(p==null?void 0:p.riskLevel)==="elevated"||(p==null?void 0:p.riskLevel)==="moderate"?"sc-disrupt-yellow":"sc-disrupt-green",T=this.expandedChokepoint===c.name,R=T&&(p!=null&&p.riskReportAction)?`<div class="sc-routing-advisory">${r(p.riskReportAction)}</div>`:"",y=T&&(p==null?void 0:p.dataAvailable)!==!1?`<div data-chart-cp="${r(c.name)}" data-chart-cp-id="${r(c.id)}" style="margin-top:8px;min-height:200px;display:flex;align-items:center;justify-content:center;color:var(--text-dim,#888);font-size:12px">${i("components.supplyChain.loadingHistory")||"Loading transit history…"}</div>`:"",S=c.warRiskTier??"WAR_RISK_TIER_NORMAL",x={WAR_RISK_TIER_WAR_ZONE:"War Zone",WAR_RISK_TIER_CRITICAL:"Critical",WAR_RISK_TIER_HIGH:"High",WAR_RISK_TIER_ELEVATED:"Elevated",WAR_RISK_TIER_NORMAL:"Normal"},I=`<span class="sc-war-risk-badge sc-war-risk-badge--${{WAR_RISK_TIER_WAR_ZONE:"war",WAR_RISK_TIER_CRITICAL:"critical",WAR_RISK_TIER_HIGH:"high",WAR_RISK_TIER_ELEVATED:"elevated",WAR_RISK_TIER_NORMAL:"normal"}[S]??"normal"}">${x[S]??"Normal"}</span>`,A=T?`<div class="sc-bypass-section" data-bypass-cp="${r(c.id)}"><div class="sc-bypass-heading">Bypass Options</div><div class="sc-bypass-loading">Loading bypass options…</div></div>`:"",M=T?(()=>{var Pt;const k=It.find(Et=>Et.affectedChokepointIds.includes(c.id)&&Et.type!=="tariff_shock");if(!k)return"";const U=pt(Mt()),z=((Pt=this.activeScenarioState)==null?void 0:Pt.scenarioId)===k.id,lt=["sc-scenario-btn",U?"":"sc-scenario-btn--gated",z?"sc-scenario-btn--active":""].filter(Boolean).join(" "),re=z?"Active":"Simulate Closure",oe=[U?"":'data-gated="1"',z?"disabled":""].filter(Boolean).join(" ");return`<div class="sc-scenario-trigger" data-scenario-id="${r(k.id)}" data-chokepoint-id="${r(c.id)}">
            <button class="${lt}" ${oe} aria-label="Simulate ${r(k.name)}">
              ${re}
            </button>
          </div>`})():"",J=u&&s!=null&&s>c.disruptionScore?`<span class="trade-badge">${c.disruptionScore}/100</span> <span class="trade-badge trade-badge--projected" style="background:#7f1d1d;color:#fff;margin-left:4px">→ ${s}/100</span>`:`<span class="trade-badge">${c.disruptionScore}/100</span>`;return`<div class="trade-restriction-card${T?" expanded":""}${u?" scenario-affected":""}" data-cp-id="${r(c.name)}" style="cursor:pointer${u?";border-left:3px solid #dc2626":""}">
          <div class="trade-restriction-header">
            <span class="trade-country">${r(c.name)}</span>
            <span class="sc-status-dot ${f}"></span>
            ${J}
            <span class="trade-status ${h}">${r(c.status)}</span>
          </div>
          <div class="trade-restriction-body">
            ${u&&(t!=null&&t.template)?`<div class="sc-metric-row" style="background:#7f1d1d22;padding:4px 6px;border-radius:3px;margin-bottom:4px;font-size:11px">
              <span style="color:#fca5a5;font-weight:600">⚠ Projected under scenario: ${t.template.disruptionPct}% closure for ${t.template.durationDays} days${t.template.costShockMultiplier>1?` (+${Math.round((t.template.costShockMultiplier-1)*100)}% cost)`:""}</span>
            </div>`:""}
            <div class="sc-metric-row">
              <span>${c.activeWarnings} ${i("components.supplyChain.warnings")} · ${v} ${i("components.supplyChain.aisDisruptions")}</span>
              ${(H=c.directions)!=null&&H.length?`<span>${c.directions.map(k=>r(k)).join("/")}</span>`:""}
            </div>
            ${p&&p.dataAvailable===!1?`<div class="sc-metric-row" style="opacity:0.5;font-size:11px"><span>${i("components.supplyChain.transitDataUnavailable")||"Transit data unavailable (upstream partial)"}</span></div>`:""}
            ${p&&p.dataAvailable!==!1&&(p.todayTotal>0||g||w>0)?`<div class="sc-metric-row">
              ${p.todayTotal>0?`<span>${p.todayTotal} ${i("components.supplyChain.vessels")}</span>`:""}
              ${g?`<span>${i("components.supplyChain.wowChange")}: ${$}</span>`:""}
              ${w>0?`<span>${i("components.supplyChain.disruption")}: <span class="${P}">${w.toFixed(1)}%</span></span>`:""}
            </div>`:""}
            ${p!=null&&p.riskLevel?`<div class="sc-metric-row">
              <span>${i("components.supplyChain.riskLevel")}: <span class="${C}">${r(p.riskLevel)}</span></span>
              <span>${p.incidentCount7d} ${i("components.supplyChain.incidents7d")}</span>
            </div>`:""}
            <div class="sc-metric-row">${I}</div>
            ${c.flowEstimate?(()=>{const k=c.flowEstimate,U=Math.round(k.flowRatio*100),z=k.disrupted||U<85?"#ef4444":U<95?"#f59e0b":"var(--text-dim,#888)",lt=k.hazardAlertLevel&&k.hazardAlertName?` <span style="background:#ea580c;color:#fff;font-size:9px;padding:1px 5px;border-radius:3px;margin-left:4px">&#9888; ${r(k.hazardAlertName.toUpperCase())}</span>`:"";return`<div class="sc-metric-row" style="color:${z}">
                <span>~${k.currentMbd} mb/d <span style="opacity:0.7">(${U}% of ${k.baselineMbd} baseline)</span>${lt}</span>
              </div>`})():Xe.has(c.id)?`<div class="sc-metric-row" style="color:var(--text-dim,#888);font-size:11px;opacity:0.7">
                <span>${i("components.supplyChain.flowUnavailable")}</span>
              </div>`:""}
            ${c.description?`<div class="trade-description">${r(c.description)}</div>`:""}
            <div class="trade-affected">${c.affectedRoutes.slice(0,3).map(k=>r(k)).join(", ")}</div>
            ${R}
            ${y}
            ${A}
            ${M}
          </div>
        </div>`}).join("")}
    </div>`}renderShipping(){var s,n;const t=(n=(s=this.shippingData)==null?void 0:s.indices)==null?void 0:n.length,e=this.renderDisruptionSnapshot();return!t&&!e?`<div class="economic-empty">${i("components.supplyChain.noShipping")}</div>`:`<div class="trade-restrictions-list">
      ${e}
      ${t?this.renderFredIndices():""}
    </div>`}renderDisruptionSnapshot(){if(this.chokepointData===null)return`<div class="trade-sector" style="padding:8px;opacity:0.6">${i("components.supplyChain.loadingCorridors")}</div>`;const t=this.chokepointData.chokepoints;if(!(t!=null&&t.length))return"";const e=[...t].sort((o,c)=>c.disruptionScore-o.disruptionScore),s=e.filter(o=>o.disruptionScore>0),l=(s.length>0?s:e.slice(0,5)).map(o=>{const c=o.transitSummary,u=o.status==="red"?"sc-dot-red":o.status==="yellow"?"sc-dot-yellow":"sc-dot-green",h=(c==null?void 0:c.wowChangePct)??0,f=h!==0?`<span class="${h>=0?"change-positive":"change-negative"}">${h>=0?"▲":"▼"}${Math.abs(h).toFixed(1)}%</span>`:"-",v=(c==null?void 0:c.disruptionPct)??0,p=v>10?"sc-disrupt-red":v>3?"sc-disrupt-yellow":"sc-disrupt-green",m=(c==null?void 0:c.riskLevel)||"-",g=m==="critical"||m==="high"?"sc-disrupt-red":m==="elevated"||m==="moderate"?"sc-disrupt-yellow":"";return`<tr>
        <td><span class="sc-status-dot ${u}"></span> ${r(o.name)}</td>
        <td>${(c==null?void 0:c.todayTotal)??0}</td>
        <td>${f}</td>
        <td><span class="${p}">${v>0?v.toFixed(1)+"%":"-"}</span></td>
        <td>${g?`<span class="${g}">${r(m)}</span>`:r(m)}</td>
      </tr>`}).join("");return`<div style="margin-bottom:8px">
      <div class="trade-sector" style="font-weight:600;margin-bottom:4px">${i("components.supplyChain.corridorDisruption")}</div>
      <table class="sc-disruption-table">
        <thead><tr>
          <th>${i("components.supplyChain.corridor")}</th>
          <th>${i("components.supplyChain.vessels")}</th>
          <th>${i("components.supplyChain.wowChange")}</th>
          <th>${i("components.supplyChain.disruption")}</th>
          <th>${i("components.supplyChain.risk")}</th>
        </tr></thead>
        <tbody>${l}</tbody>
      </table>
    </div>`}renderFredIndices(){var o,c;if(q()&&!Z("supplyChain")||!((c=(o=this.shippingData)==null?void 0:o.indices)!=null&&c.length))return"";const t=new Set(["SCFI","CCFI"]),e=new Set(["BDI","BCI","BPI","BSI","BHSI"]),s=this.shippingData.indices.filter(u=>t.has(u.indexId)),n=this.shippingData.indices.filter(u=>e.has(u.indexId)),l=(u,h)=>{if(!h.length)return"";const f=h.map(v=>{const p=v.changePct>=0?"change-positive":"change-negative",m=v.changePct>=0?"▲":"▼",g=this.renderSparkline(v.history.map(w=>w.value),v.history.map(w=>w.date));return`<div class="trade-restriction-card">
          ${v.spikeAlert?`<div class="economic-warning">${i("components.supplyChain.spikeAlert")}</div>`:""}
          <div class="trade-restriction-header">
            <span class="trade-country">${r(v.name)}</span>
            <span class="trade-badge">${v.currentValue.toFixed(0)} ${r(v.unit)}</span>
            <span class="trade-flow-change ${p}">${m} ${Math.abs(v.changePct).toFixed(1)}%</span>
          </div>
          <div class="trade-restriction-body">
            ${g}
          </div>
        </div>`}).join("");return`<div class="trade-sector" style="font-weight:600;margin:8px 0 4px">${r(u)}</div>${f}`};return[l(i("components.supplyChain.containerRates"),s),l(i("components.supplyChain.bulkShipping"),n)].join("")}renderIndicators(){var l,o;if(q()&&!Z("supplyChain"))return"";if(!((o=(l=this.shippingData)==null?void 0:l.indices)!=null&&o.length))return`<div class="economic-empty">${i("components.supplyChain.noShipping")}</div>`;const t=new Set(["SCFI","CCFI"]),e=new Set(["BDI","BCI","BPI","BSI","BHSI"]),s=this.shippingData.indices.filter(c=>!t.has(c.indexId)&&!e.has(c.indexId));return s.length?`<div class="trade-restrictions-list">${s.map(c=>{const u=c.changePct>=0?"change-positive":"change-negative",h=c.changePct>=0?"▲":"▼",f=this.renderSparkline(c.history.map(p=>p.value),c.history.map(p=>p.date));return`<div class="trade-restriction-card">
          ${c.spikeAlert?`<div class="economic-warning">${i("components.supplyChain.spikeAlert")}</div>`:""}
          <div class="trade-restriction-header">
            <span class="trade-country">${r(c.name)}</span>
            <span class="trade-badge">${c.currentValue.toFixed(0)} ${r(c.unit)}</span>
            <span class="trade-flow-change ${u}">${h} ${Math.abs(c.changePct).toFixed(1)}%</span>
          </div>
          <div class="trade-restriction-body">
            ${f}
          </div>
        </div>`}).join("")}</div>`:`<div class="economic-empty">${i("components.supplyChain.noShipping")}</div>`}renderStress(){var h;if(!this.stressData||!((h=this.stressData.carriers)!=null&&h.length))return'<div class="economic-empty">Shipping stress data unavailable</div>';const{stressScore:t,stressLevel:e,carriers:s}=this.stressData,n=e==="critical"?"#e74c3c":e==="elevated"?"#e67e22":e==="moderate"?"#f1c40f":"#27ae60",l=Math.round(Math.min(100,Math.max(0,t))),c=`<div style="margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.06em">Composite Stress Score</span>
        <span style="font-size:11px;font-weight:700;padding:2px 7px;border-radius:3px;background:${e==="critical"?"rgba(231,76,60,0.15)":e==="elevated"?"rgba(230,126,34,0.15)":e==="moderate"?"rgba(241,196,15,0.15)":"rgba(39,174,96,0.15)"};color:${n}">${r(e.toUpperCase())}</span>
      </div>
      <div style="position:relative;height:6px;border-radius:3px;background:rgba(255,255,255,0.08)">
        <div style="position:absolute;left:0;top:0;height:100%;width:${l}%;border-radius:3px;background:${n};transition:width 0.4s"></div>
      </div>
      <div style="text-align:right;font-size:10px;color:var(--text-dim);margin-top:2px">${t.toFixed(1)}/100</div>
    </div>`,u=s.map(f=>{var $;const v=f.changePct>=0?"change-positive":"change-negative",p=f.changePct>=0?"▲":"▼",m=f.carrierType==="etf"?"ETF":f.carrierType==="index"?"IDX":"CARR",g=(($=f.sparkline)==null?void 0:$.length)>=2?this.renderSparkline(f.sparkline):"";return`<div class="trade-restriction-card">
        <div class="trade-restriction-header">
          <span class="trade-country" style="font-size:11px">${r(f.symbol)}</span>
          <span style="font-size:9px;padding:1px 5px;border-radius:2px;background:rgba(255,255,255,0.06);color:var(--text-dim)">${m}</span>
          <span class="trade-badge">${f.price.toFixed(2)}</span>
          <span class="trade-flow-change ${v}">${p} ${Math.abs(f.changePct).toFixed(2)}%</span>
        </div>
        <div class="trade-restriction-body" style="font-size:10px;color:var(--text-dim)">${r(f.name)}${g}</div>
      </div>`}).join("");return`<div class="trade-restrictions-list">${c}${u}</div>`}renderSparkline(t,e){if(t.length<2)return"";const s=Math.min(...t),l=Math.max(...t)-s||1,o=200,c=40,u=e!=null&&e.length?c+14:c,h=t.map((v,p)=>{const m=p/(t.length-1)*o,g=c-(v-s)/l*(c-4)-2;return`${m.toFixed(1)},${g.toFixed(1)}`}).join(" "),f=e!=null&&e.length?`
      <text x="0" y="${u-1}" fill="var(--text-dim,#888)" font-size="9" text-anchor="start">${r(e[0].slice(0,7))}</text>
      <text x="${o}" y="${u-1}" fill="var(--text-dim,#888)" font-size="9" text-anchor="end">${r(e[e.length-1].slice(0,7))}</text>
    `:"";return`<svg width="${o}" height="${u}" viewBox="0 0 ${o} ${u}" style="display:block;margin:4px 0">
      <polyline points="${h}" fill="none" stroke="var(--accent-primary, #4fc3f7)" stroke-width="1.5" />
      ${f}
    </svg>`}renderMinerals(){var e;if(!this.mineralsData||!((e=this.mineralsData.minerals)!=null&&e.length))return`<div class="economic-empty">${i("components.supplyChain.noMinerals")}</div>`;const t=this.mineralsData.minerals.map(s=>{const n=s.riskRating==="critical"?"sc-risk-critical":s.riskRating==="high"?"sc-risk-high":s.riskRating==="moderate"?"sc-risk-moderate":"sc-risk-low",l=s.topProducers.slice(0,3).map(o=>`${r(o.country)} ${o.sharePct.toFixed(0)}%`).join(", ");return`<tr>
        <td>${r(s.mineral)}</td>
        <td>${l}</td>
        <td>${s.hhi.toFixed(0)}</td>
        <td><span class="${n}">${r(s.riskRating)}</span></td>
      </tr>`}).join("");return`<div class="trade-tariffs-table">
      <table>
        <thead>
          <tr>
            <th>${i("components.supplyChain.mineral")}</th>
            <th>${i("components.supplyChain.topProducers")}</th>
            <th>HHI</th>
            <th>${i("components.supplyChain.risk")}</th>
          </tr>
        </thead>
        <tbody>${t}</tbody>
      </table>
    </div>`}showScenarioSummary(t,e){this.activeScenarioState={scenarioId:t,result:e},this.render()}renderScenarioBanner(){var w,P;const t=this.activeScenarioState;if(!t)return;const{scenarioId:e,result:s}=t;(w=this.content.querySelector(".sc-scenario-banner"))==null||w.remove();const l=s.topImpactCountries.slice(0,5).map(C=>`<span class="sc-scenario-country">${r(C.iso2)} <em>${C.impactPct.toFixed(0)}%</em></span>`).join(" · "),o=document.createElement("div");o.className="sc-scenario-banner";const c=((P=It.find(C=>C.id===e))==null?void 0:P.name)??e.replace(/-/g," "),u=s.template,h=u?`${u.durationDays}d`:null,f=u?`${u.disruptionPct}% closure`:null,v=u?Math.round((u.costShockMultiplier-1)*100):null,p=v!=null&&v>0?`+${v}% cost`:null,m=[h,p].filter(Boolean).map(C=>`<span class="sc-scenario-param">${r(C)}</span>`).join(" · "),g=[h,f,p].filter(Boolean).join(" / "),$=g?`<div class="sc-scenario-tagline">Simulating ${r(g)} on ${s.affectedChokepointIds.length} chokepoint${s.affectedChokepointIds.length===1?"":"s"}. Chokepoint card below shows projected score; map highlights disrupted routes.</div>`:"";F(o,_(['<div class="sc-scenario-top">','<span class="sc-scenario-icon">⚠</span>',`<span class="sc-scenario-name">${r(c)}</span>`,m?`<span class="sc-scenario-params">${m}</span>`:"",`<span class="sc-scenario-countries">${l}</span>`,'<button class="sc-scenario-dismiss" aria-label="Dismiss scenario">×</button>',"</div>",$].join(""),"legacy direct innerHTML migration")),o.querySelector(".sc-scenario-dismiss").addEventListener("click",()=>{var C;return(C=this.onDismissScenario)==null?void 0:C.call(this)}),this.content.prepend(o)}hideScenarioSummary(){this.activeScenarioState=null,this.render()}setOnDismissScenario(t){this.onDismissScenario=t}setOnScenarioActivate(t){this.onScenarioActivate=t}async runScenario(t,e){var o,c;if(e.dataset.gated==="1"){At("scenario-engine");return}(o=this.scenarioPollController)==null||o.abort(),this.scenarioPollController=new AbortController;const{signal:s}=this.scenarioPollController,n=t.dataset.scenarioId;e.disabled=!0,e.textContent="Computing…";const l=u=>{e.isConnected&&(e.textContent=u,e.disabled=!1)};try{const u=AbortSignal.any([s,AbortSignal.timeout(2e4)]),f=(await Pe({scenarioId:n,iso2:""},{signal:u})).jobId;let v=null;for(let p=0;p<60;p++){if(s.aborted){l("Simulate Closure");return}if(!this.content.isConnected)return;p>0&&await new Promise(g=>setTimeout(g,1e3));const m=await Ee(f,{signal:s});if(m.status==="done"){const g=m.result;if(!g||!Array.isArray(g.topImpactCountries))throw new Error("done without valid result");v=g;break}if(m.status==="failed")throw new Error("Scenario failed")}if(!v)throw new Error("Timeout — scenario worker may be down");if(s.aborted){l("Simulate Closure");return}if(!this.content.isConnected)return;(c=this.onScenarioActivate)==null||c.call(this,n,v)}catch(u){if(u instanceof Error&&u.name==="AbortError"){l("Simulate Closure");return}console.error("[scenario] run failed:",u),l("Error — retry")}}}const sa=Object.freeze(Object.defineProperty({__proto__:null,SupplyChainPanel:ts},Symbol.toStringTag,{value:"Module"}));function Gt(a){return{ports:i("components.investments.sectors.ports"),pipelines:i("components.investments.sectors.pipelines"),energy:i("components.investments.sectors.energy"),datacenters:i("components.investments.sectors.datacenters"),airports:i("components.investments.sectors.airports"),railways:i("components.investments.sectors.railways"),telecoms:i("components.investments.sectors.telecoms"),water:i("components.investments.sectors.water"),logistics:i("components.investments.sectors.logistics"),mining:i("components.investments.sectors.mining"),"real-estate":i("components.investments.sectors.realEstate"),manufacturing:i("components.investments.sectors.manufacturing")}[a]||a}const es={operational:"#22c55e","under-construction":"#f59e0b",announced:"#60a5fa",rumoured:"#a78bfa",cancelled:"#ef4444",divested:"#6b7280"},ss={SA:"🇸🇦",UAE:"🇦🇪"};function as(a){return a===void 0?i("components.investments.undisclosed"):a>=1e5?`$${(a/1e3).toFixed(0)}B`:a>=1e3?`$${(a/1e3).toFixed(1)}B`:`$${a.toLocaleString()}M`}class is extends L{constructor(t){super({id:"gcc-investments",title:i("panels.gccInvestments"),showCount:!0,infoTooltip:i("components.investments.infoTooltip")});b(this,"filters",{investingCountry:"ALL",sector:"ALL",entity:"ALL",status:"ALL",search:""});b(this,"sortKey","assetName");b(this,"sortAsc",!0);b(this,"filtersExpanded",!1);b(this,"onInvestmentClick");this.onInvestmentClick=t,this.setupEventDelegation(),this.render()}getFiltered(){const{investingCountry:t,sector:e,entity:s,status:n,search:l}=this.filters,o=l.toLowerCase();return X.filter(c=>!(t!=="ALL"&&c.investingCountry!==t||e!=="ALL"&&c.sector!==e||s!=="ALL"&&c.investingEntity!==s||n!=="ALL"&&c.status!==n||o&&!c.assetName.toLowerCase().includes(o)&&!c.targetCountry.toLowerCase().includes(o)&&!c.description.toLowerCase().includes(o)&&!c.investingEntity.toLowerCase().includes(o))).sort((c,u)=>{const h=this.sortKey,f=c[h]??"",v=u[h]??"",p=f<v?-1:f>v?1:0;return this.sortAsc?p:-p})}render(){const t=this.getFiltered(),e=Ft(X.map(p=>p.investingEntity)),s=Ft(X.map(p=>p.sector)),n=p=>this.sortKey===p?"fdi-sort fdi-sort-active":"fdi-sort",l=(p,m)=>this.sortKey===p?`${m} ${this.sortAsc?"↑":"↓"}`:m,o=this.filters.investingCountry!=="ALL"||this.filters.sector!=="ALL"||this.filters.entity!=="ALL"||this.filters.status!=="ALL",c=t.map(p=>{const m=es[p.status]||"#6b7280",g=ss[p.investingCountry]||"",$=Gt(p.sector),w=p.yearAnnounced??p.yearOperational??"—";return`
        <div class="fdi-row" data-id="${r(p.id)}">
          <div class="fdi-row-line1">
            <span class="fdi-flag">${g}</span>
            <span class="fdi-asset-name">${r(p.assetName)}</span>
            <span class="fdi-entity-sub">${r(p.investingEntity)}</span>
            <span class="fdi-usd">${r(as(p.investmentUSD))}</span>
          </div>
          <div class="fdi-row-line2">
            <span class="fdi-country">${r(p.targetCountry)}</span>
            <span class="fdi-sector-badge">${r($)}</span>
            <span class="fdi-status-label"><span class="fdi-status-dot" style="background:${m}"></span>${r(p.status)}</span>
            <span class="fdi-year">${w}</span>
          </div>
        </div>`}).join(""),u=this.filtersExpanded||o?"fdi-filter-toggle fdi-filters-active":"fdi-filter-toggle",h=this.filtersExpanded?"fdi-filters fdi-filters-open":"fdi-filters",f=p=>this.filters.status===p?" selected":"",v=`
      <div class="fdi-search-row">
        <input class="fdi-search" type="text"
          placeholder="${i("components.investments.searchPlaceholder")}"
          value="${r(this.filters.search)}"/>
        <button class="${u}" data-action="toggle-filters" title="Filters" aria-label="Toggle filters" aria-pressed="${this.filtersExpanded}">⚙</button>
      </div>
      <div class="${h}">
        <select class="fdi-filter" data-filter="investingCountry">
          <option value="ALL">🌐 ${i("components.investments.allCountries")}</option>
          <option value="SA"${this.filters.investingCountry==="SA"?" selected":""}>🇸🇦 ${i("components.investments.saudiArabia")}</option>
          <option value="UAE"${this.filters.investingCountry==="UAE"?" selected":""}>🇦🇪 ${i("components.investments.uae")}</option>
        </select>
        <select class="fdi-filter" data-filter="sector">
          <option value="ALL">${i("components.investments.allSectors")}</option>
          ${s.map(p=>`<option value="${p}"${this.filters.sector===p?" selected":""}>${r(Gt(p))}</option>`).join("")}
        </select>
        <select class="fdi-filter" data-filter="entity">
          <option value="ALL">${i("components.investments.allEntities")}</option>
          ${e.map(p=>`<option value="${r(p)}"${this.filters.entity===p?" selected":""}>${r(p)}</option>`).join("")}
        </select>
        <select class="fdi-filter" data-filter="status">
          <option value="ALL">${i("components.investments.allStatuses")}</option>
          <option value="operational"${f("operational")}>${i("components.investments.operational")}</option>
          <option value="under-construction"${f("under-construction")}>${i("components.investments.underConstruction")}</option>
          <option value="announced"${f("announced")}>${i("components.investments.announced")}</option>
          <option value="rumoured"${f("rumoured")}>${i("components.investments.rumoured")}</option>
          <option value="divested"${f("divested")}>${i("components.investments.divested")}</option>
        </select>
        <div class="fdi-sort-pills">
          <button class="${n("assetName")}" data-sort="assetName">${l("assetName",i("components.investments.asset"))}</button>
          <button class="${n("investmentUSD")}" data-sort="investmentUSD">${l("investmentUSD",i("components.investments.investment"))}</button>
          <button class="${n("targetCountry")}" data-sort="targetCountry">${l("targetCountry",i("components.investments.country"))}</button>
          <button class="${n("yearAnnounced")}" data-sort="yearAnnounced">${l("yearAnnounced",i("components.investments.year"))}</button>
        </div>
      </div>
      <div class="fdi-list">
        ${c||`<div class="fdi-empty">${i("components.investments.noMatch")}</div>`}
      </div>`;this.setSafeContent(D(v,"legacy Panel.setContent() migration")),this.countEl&&(this.countEl.textContent=String(t.length))}setupEventDelegation(){this.content.addEventListener("input",t=>{const e=t.target;e.classList.contains("fdi-search")&&(this.filters.search=e.value,this.render())}),this.content.addEventListener("change",t=>{const e=t.target.closest(".fdi-filter");if(e){const s=e.dataset.filter;this.filters[s]=e.value,this.render()}}),this.content.addEventListener("click",t=>{const e=t.target;if(e.closest('[data-action="toggle-filters"]')){this.filtersExpanded=!this.filtersExpanded,this.render();return}const n=e.closest(".fdi-sort");if(n){const o=n.dataset.sort;this.sortKey===o?this.sortAsc=!this.sortAsc:(this.sortKey=o,this.sortAsc=!0),this.render();return}const l=e.closest(".fdi-row");if(l){const o=X.find(c=>c.id===l.dataset.id);o&&this.onInvestmentClick&&this.onInvestmentClick(o)}})}}const aa=Object.freeze(Object.defineProperty({__proto__:null,InvestmentsPanel:is},Symbol.toStringTag,{value:"Module"})),jt=nt(()=>new Le(rt(),{fetch:ot}));function ft(a,d){if(d.length===0)return"";const t=d.map(e=>`
    <div class="market-item">
      <div class="market-info">
        <span class="market-name">${e.flag} ${r(e.name)}</span>
        <span class="market-symbol">${r(e.country||e.symbol)}</span>
      </div>
      <div class="market-data">
        ${fe(e.sparkline,e.change)}
        <span class="market-price">${Re(e.price)}</span>
        <span class="market-change ${Ae(e.change)}">${Me(e.change)}</span>
      </div>
    </div>
  `).join("");return`<div class="gulf-section"><div class="gulf-section-title">${r(a)}</div>${t}</div>`}class ns extends L{constructor(){super({id:"gulf-economies",title:i("panels.gulfEconomies"),infoTooltip:i("components.gulfEconomies.infoTooltip")})}async fetchData(){var d,t,e,s;try{const n=N("gulfQuotes");if((d=n==null?void 0:n.quotes)!=null&&d.length){if(!((t=this.element)!=null&&t.isConnected))return;this.renderGulf(n),jt().listGulfQuotes({}).then(o=>{var c,u;!((c=this.element)!=null&&c.isConnected)||!((u=o.quotes)!=null&&u.length)||this.renderGulf(o)}).catch(()=>{});return}const l=await jt().listGulfQuotes({});if(!((e=this.element)!=null&&e.isConnected))return;this.renderGulf(l)}catch(n){if(this.isAbortError(n)||!((s=this.element)!=null&&s.isConnected))return;this.showError(i("common.failedMarketData"),()=>void this.fetchData())}}renderGulf(d){var l;if(!((l=d.quotes)!=null&&l.length)){const o=d.rateLimited?i("common.rateLimitedMarket"):i("common.failedMarketData");this.showError(o,()=>void this.fetchData());return}const t=d.quotes.filter(o=>o.type==="index"),e=d.quotes.filter(o=>o.type==="currency"),s=d.quotes.filter(o=>o.type==="oil"),n=ft(i("panels.gulfIndices"),t)+ft(i("panels.gulfCurrencies"),e)+ft(i("panels.gulfOil"),s);this.setSafeContent(D(n,"legacy Panel.setContent() migration"))}}const ia=Object.freeze(Object.defineProperty({__proto__:null,GulfEconomiesPanel:ns},Symbol.toStringTag,{value:"Module"})),Ht=nt(()=>new Dt(rt(),{fetch:ot}));class rs extends L{constructor(){super({id:"grocery-basket",title:i("panels.groceryBasket"),infoTooltip:i("components.groceryBasket.infoTooltip")})}async fetchData(){var d,t,e,s;try{const n=N("groceryBasket");if((d=n==null?void 0:n.countries)!=null&&d.length){if(!((t=this.element)!=null&&t.isConnected))return;this.renderBasket(n),Ht().listGroceryBasketPrices({}).then(o=>{var c,u;!((c=this.element)!=null&&c.isConnected)||!((u=o.countries)!=null&&u.length)||this.renderBasket(o)}).catch(()=>{});return}const l=await Ht().listGroceryBasketPrices({});if(!((e=this.element)!=null&&e.isConnected))return;this.renderBasket(l)}catch(n){if(this.isAbortError(n)||!((s=this.element)!=null&&s.isConnected))return;this.showError(i("common.failedMarketData"),()=>void this.fetchData())}}renderBasket(d){var h,f,v;if(!((h=d.countries)!=null&&h.length)){this.showError(i("common.failedMarketData"),()=>void this.fetchData());return}const t=d.countries,e=((v=(f=t[0])==null?void 0:f.items)==null?void 0:v.map(p=>p.itemId))??[],s=t.map(p=>`<th class="gb-country-header" title="${r(p.name)}">${r(p.flag)}<br><span class="gb-country-name">${r(p.name)}</span></th>`).join(""),n=e.map(p=>{var T,R;const m=(R=(T=t[0])==null?void 0:T.items)==null?void 0:R.find(y=>y.itemId===p),g=t.map(y=>{var S,x;return(x=(S=y.items)==null?void 0:S.find(E=>E.itemId===p))==null?void 0:x.usdPrice}).filter(y=>y!=null&&y>0),$=g.length>1?Math.min(...g):null,w=g.length>1?Math.max(...g):null,P=.001,C=t.map(y=>{var A;const S=(A=y.items)==null?void 0:A.find(M=>M.itemId===p);if(!(S!=null&&S.available)||!S.usdPrice||!S.localPrice)return'<td class="gb-cell gb-na">—</td>';const x=w!==null&&Math.abs(S.usdPrice-w)<P;return`<td class="gb-cell ${$!==null&&Math.abs(S.usdPrice-$)<P?"gb-cheapest":x?"gb-priciest":""}">$${S.usdPrice.toFixed(2)}<span class="gb-local">${S.localPrice.toFixed(2)} ${r(y.currency)}</span></td>`}).join("");return`<tr><td class="gb-item-name">${r((m==null?void 0:m.itemName)??p)}<span class="gb-unit">${r((m==null?void 0:m.unit)??"")}</span></td>${C}</tr>`}).join(""),l=`<tr class="gb-total-row"><td class="gb-item-name"><strong>Total</strong></td>${t.map(p=>{const m=p.code===d.cheapestCountry,g=p.code===d.mostExpensiveCountry,$=m?"gb-cheapest":g?"gb-priciest":"";let w="";if(p.wowPct!=null){const P=p.wowPct>=0?"▲":"▼";w=`<span class="gb-wow ${p.wowPct>=0?"bm-wow-up":"bm-wow-down"}">${P}${Math.abs(p.wowPct).toFixed(1)}%</span>`}return`<td class="gb-cell gb-total ${$}"><strong>$${p.totalUsd.toFixed(2)}</strong>${w}</td>`}).join("")}</tr>`;let o="";if(d.wowAvailable&&d.wowAvgPct!==void 0){const p=d.wowAvgPct,m=p>=0?"▲":"▼";o=`<div class="bm-wow-summary">Basket avg: <span class="${p>=0?"bm-wow-up":"bm-wow-down"}">${m}${Math.abs(p).toFixed(1)}% WoW</span></div>`}const c=d.fetchedAt?new Date(d.fetchedAt).toLocaleDateString():"",u=`
      <div class="gb-wrapper">
        ${o}
        <div class="gb-scroll">
          <table class="gb-table">
            <thead><tr><th class="gb-item-col">${i("panels.groceryItem")}</th>${s}</tr></thead>
            <tbody>${n}${l}</tbody>
          </table>
        </div>
        ${c?`<div class="gb-updated">${i("components.status.updatedAt",{time:c})}</div>`:""}
      </div>
    `;this.setSafeContent(D(u,"legacy Panel.setContent() migration"))}}const na=Object.freeze(Object.defineProperty({__proto__:null,GroceryBasketPanel:rs},Symbol.toStringTag,{value:"Module"})),zt=nt(()=>new Dt(rt(),{fetch:ot}));class os extends L{constructor(){super({id:"bigmac",title:i("panels.bigmac"),infoTooltip:i("components.bigmac.infoTooltip")})}async fetchData(){var d,t,e,s;try{const n=N("bigmac");if((d=n==null?void 0:n.countries)!=null&&d.length){if(!((t=this.element)!=null&&t.isConnected))return;this.renderIndex(n),zt().listBigMacPrices({}).then(o=>{var c,u;!((c=this.element)!=null&&c.isConnected)||!((u=o.countries)!=null&&u.length)||this.renderIndex(o)}).catch(()=>{});return}const l=await zt().listBigMacPrices({});if(!((e=this.element)!=null&&e.isConnected))return;this.renderIndex(l)}catch(n){if(this.isAbortError(n)||!((s=this.element)!=null&&s.isConnected))return;this.showError(i("common.failedMarketData"),()=>void this.fetchData())}}renderIndex(d){var f,v,p;if(!((f=d.countries)!=null&&f.length)){this.showError(i("common.failedMarketData"),()=>void this.fetchData());return}const t=[...d.countries].filter(m=>m.usdPrice!=null&&m.usdPrice>0).sort((m,g)=>g.usdPrice-m.usdPrice),e=(v=t[0])==null?void 0:v.code,s=(p=t[t.length-1])==null?void 0:p.code,n=d.wowAvailable&&d.wowAvgPct!==void 0,l=n?`<th class="gb-cell">${i("panels.bigmacWow")}</th>`:"",o=t.map(m=>{const g=m.code===s?"gb-cheapest":m.code===e?"gb-priciest":"";let $="";if(n){const w=m.wowPct??null;if(w==null)$='<td class="gb-cell gb-na">—</td>';else{const P=w>=0?"▲":"▼";$=`<td class="gb-cell ${w>=0?"bm-wow-up":"bm-wow-down"}">${P}${Math.abs(w).toFixed(1)}%</td>`}}return`<tr>
        <td class="gb-item-name">${r(m.flag)} ${r(m.name)}</td>
        <td class="gb-cell ${g}">$${m.usdPrice.toFixed(2)}</td>
        ${$}
      </tr>`}).join("");let c="";if(n){const m=d.wowAvgPct,g=m>=0?"▲":"▼";c=`<div class="bm-wow-summary">Global avg: <span class="${m>=0?"bm-wow-up":"bm-wow-down"}">${g}${Math.abs(m).toFixed(1)}% ${i("panels.bigmacWow")}</span></div>`}const u=d.fetchedAt?new Date(d.fetchedAt).toLocaleDateString():"",h=`
      <div class="gb-wrapper">
        ${c}
        <div class="gb-scroll">
          <table class="gb-table">
            <thead><tr>
              <th class="gb-item-col">${i("panels.bigmacCountry")}</th>
              <th class="gb-cell">USD</th>
              ${l}
            </tr></thead>
            <tbody>${o}</tbody>
          </table>
        </div>
        ${u?`<div class="gb-updated">${i("components.status.updatedAt",{time:u})}</div>`:""}
      </div>
    `;this.setSafeContent(D(h,"legacy Panel.setContent() migration"))}}const ra=Object.freeze(Object.defineProperty({__proto__:null,BigMacPanel:os},Symbol.toStringTag,{value:"Module"})),Vt=nt(()=>new Dt(rt(),{fetch:ot})),St=480,Ct=140,Q=36,ee=12,se=8,ae=20,Kt=St-Q-ee,Wt=Ct-se-ae,xt=[{key:"ffpi",color:"#f5a623",label:"Food"},{key:"cereals",color:"#7ed321",label:"Cereals"},{key:"meat",color:"#e86c6c",label:"Meat"},{key:"dairy",color:"#74c8e8",label:"Dairy"},{key:"oils",color:"#b57ce8",label:"Oils"},{key:"sugar",color:"#f0c36a",label:"Sugar"}];function ie(a,d){return d<=1?Q+Kt/2:Q+a/(d-1)*Kt}function ne(a,d,t){const e=t-d||1;return se+Wt-(a-d)/e*Wt}function cs(a,d,t,e){return a.map((n,l)=>{const o=n[d];return!Number.isFinite(o)||o<=0?null:`${ie(l,a.length).toFixed(1)},${ne(o,t,e).toFixed(1)}`}).filter(Boolean).join(" ")}function ls(a){if(!a.length)return"";const d=[];for(const o of a)for(const c of xt){const u=o[c.key];Number.isFinite(u)&&u>0&&d.push(u)}const t=Math.floor(Math.min(...d)*.96),e=Math.ceil(Math.max(...d)*1.02),s=[0,1,2,3].map(o=>{const c=t+(e-t)/3*o,u=ne(c,t,e);return`
      <line x1="${Q}" y1="${u.toFixed(1)}" x2="${St-ee}" y2="${u.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${(Q-3).toFixed(0)}" y="${u.toFixed(1)}" text-anchor="end" fill="rgba(255,255,255,0.35)" font-size="8" dominant-baseline="middle">${c.toFixed(0)}</text>`}).join(""),n=a.map((o,c)=>{if(c%3!==0&&c!==a.length-1)return"";const u=ie(c,a.length),h=o.date;return`<text x="${u.toFixed(1)}" y="${Ct-ae+12}" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="7">${r(h)}</text>`}).join(""),l=xt.map(o=>{const c=cs(a,o.key,t,e);return c?`<polyline points="${c}" fill="none" stroke="${o.color}" stroke-width="${o.key==="ffpi"?2:1.2}" opacity="${o.key==="ffpi"?1:.7}"/>`:""}).join("");return`<svg viewBox="0 0 ${St} ${Ct}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">${s}${n}${l}</svg>`}function ds(){return xt.map(a=>`<span class="fao-legend-item"><span class="fao-legend-dot" style="background:${a.color}"></span>${r(i(`components.faoFoodPriceIndex.${a.key}`))}</span>`).join("")}class ps extends L{constructor(){super({id:"fao-food-price-index",title:i("panels.faoFoodPriceIndex"),infoTooltip:i("components.faoFoodPriceIndex.infoTooltip")})}async fetchData(){var d,t,e,s;try{const n=N("faoFoodPriceIndex");if((d=n==null?void 0:n.points)!=null&&d.length){if(!((t=this.element)!=null&&t.isConnected))return;this.renderChart(n),Vt().getFaoFoodPriceIndex({}).then(o=>{var c,u;!((c=this.element)!=null&&c.isConnected)||!((u=o.points)!=null&&u.length)||this.renderChart(o)}).catch(()=>{});return}const l=await Vt().getFaoFoodPriceIndex({});if(!((e=this.element)!=null&&e.isConnected))return;this.renderChart(l)}catch(n){if(this.isAbortError(n)||!((s=this.element)!=null&&s.isConnected))return;this.showError(i("common.failedMarketData"),()=>void this.fetchData())}}renderChart(d){var f;if(!((f=d.points)!=null&&f.length)){this.showError(i("common.failedMarketData"),()=>void this.fetchData());return}const t=d.momPct>=0?"+":"",e=d.yoyPct>=0?"+":"",s=d.momPct>=0?"fao-up":"fao-down",n=d.yoyPct>=0?"fao-up":"fao-down",l=d.points[d.points.length-1],o=`
      <div class="fao-headline">
        <div class="fao-headline-primary">
          <span class="fao-index-value">${d.currentFfpi.toFixed(1)}</span>
          <span class="fao-index-label">${r(i("components.faoFoodPriceIndex.indexLabel"))}</span>
        </div>
        <div class="fao-headline-changes">
          <span class="fao-change ${s}">${t}${d.momPct.toFixed(1)}% ${r(i("components.faoFoodPriceIndex.mom"))}</span>
          <span class="fao-change ${n}">${e}${d.yoyPct.toFixed(1)}% ${r(i("components.faoFoodPriceIndex.yoy"))}</span>
        </div>
        <div class="fao-as-of">${r(i("components.faoFoodPriceIndex.asOf"))} ${r((l==null?void 0:l.date)??"")}</div>
      </div>`,c=ls(d.points),u=`<div class="fao-legend">${ds()}</div>`,h=`<div class="fao-base-note">${r(i("components.faoFoodPriceIndex.baseNote"))}</div>`;this.setSafeContent(D(`<div class="fao-food-price-index-panel">${o}${c}${u}${h}</div>`,"legacy Panel.setContent() migration"))}}const oa=Object.freeze(Object.defineProperty({__proto__:null,FaoFoodPriceIndexPanel:ps},Symbol.toStringTag,{value:"Module"})),us={AFG:"🇦🇫",ALB:"🇦🇱",DZA:"🇩🇿",AGO:"🇦🇴",ARG:"🇦🇷",ARM:"🇦🇲",AUS:"🇦🇺",AUT:"🇦🇹",AZE:"🇦🇿",BHS:"🇧🇸",BHR:"🇧🇭",BGD:"🇧🇩",BLR:"🇧🇾",BEL:"🇧🇪",BLZ:"🇧🇿",BEN:"🇧🇯",BTN:"🇧🇹",BOL:"🇧🇴",BIH:"🇧🇦",BWA:"🇧🇼",BRA:"🇧🇷",BRN:"🇧🇳",BGR:"🇧🇬",BFA:"🇧🇫",BDI:"🇧🇮",CPV:"🇨🇻",KHM:"🇰🇭",CMR:"🇨🇲",CAN:"🇨🇦",CAF:"🇨🇫",TCD:"🇹🇩",CHL:"🇨🇱",CHN:"🇨🇳",COL:"🇨🇴",COM:"🇰🇲",COD:"🇨🇩",COG:"🇨🇬",CRI:"🇨🇷",CIV:"🇨🇮",HRV:"🇭🇷",CYP:"🇨🇾",CZE:"🇨🇿",DNK:"🇩🇰",DJI:"🇩🇯",DOM:"🇩🇴",ECU:"🇪🇨",EGY:"🇪🇬",SLV:"🇸🇻",GNQ:"🇬🇶",ERI:"🇪🇷",EST:"🇪🇪",SWZ:"🇸🇿",ETH:"🇪🇹",FJI:"🇫🇯",FIN:"🇫🇮",FRA:"🇫🇷",GAB:"🇬🇦",GMB:"🇬🇲",GEO:"🇬🇪",DEU:"🇩🇪",GHA:"🇬🇭",GRC:"🇬🇷",GTM:"🇬🇹",GIN:"🇬🇳",GNB:"🇬🇼",GUY:"🇬🇾",HTI:"🇭🇹",HND:"🇭🇳",HKG:"🇭🇰",HUN:"🇭🇺",ISL:"🇮🇸",IND:"🇮🇳",IDN:"🇮🇩",IRN:"🇮🇷",IRQ:"🇮🇶",IRL:"🇮🇪",ISR:"🇮🇱",ITA:"🇮🇹",JAM:"🇯🇲",JPN:"🇯🇵",JOR:"🇯🇴",KAZ:"🇰🇿",KEN:"🇰🇪",KOR:"🇰🇷",KWT:"🇰🇼",KGZ:"🇰🇬",LAO:"🇱🇦",LVA:"🇱🇻",LBN:"🇱🇧",LSO:"🇱🇸",LBR:"🇱🇷",LBY:"🇱🇾",LTU:"🇱🇹",LUX:"🇱🇺",MAC:"🇲🇴",MDG:"🇲🇬",MWI:"🇲🇼",MYS:"🇲🇾",MDV:"🇲🇻",MLI:"🇲🇱",MLT:"🇲🇹",MRT:"🇲🇷",MUS:"🇲🇺",MEX:"🇲🇽",MDA:"🇲🇩",MNG:"🇲🇳",MNE:"🇲🇪",MAR:"🇲🇦",MOZ:"🇲🇿",MMR:"🇲🇲",NAM:"🇳🇦",NPL:"🇳🇵",NLD:"🇳🇱",NZL:"🇳🇿",NIC:"🇳🇮",NER:"🇳🇪",NGA:"🇳🇬",MKD:"🇲🇰",NOR:"🇳🇴",OMN:"🇴🇲",PAK:"🇵🇰",PAN:"🇵🇦",PNG:"🇵🇬",PRY:"🇵🇾",PER:"🇵🇪",PHL:"🇵🇭",POL:"🇵🇱",PRT:"🇵🇹",QAT:"🇶🇦",ROU:"🇷🇴",RUS:"🇷🇺",RWA:"🇷🇼",SAU:"🇸🇦",SEN:"🇸🇳",SRB:"🇷🇸",SLE:"🇸🇱",SGP:"🇸🇬",SVK:"🇸🇰",SVN:"🇸🇮",SOM:"🇸🇴",ZAF:"🇿🇦",SSD:"🇸🇸",ESP:"🇪🇸",LKA:"🇱🇰",SDN:"🇸🇩",SUR:"🇸🇷",SWE:"🇸🇪",CHE:"🇨🇭",TWN:"🇹🇼",TJK:"🇹🇯",TZA:"🇹🇿",THA:"🇹🇭",TLS:"🇹🇱",TGO:"🇹🇬",TTO:"🇹🇹",TUN:"🇹🇳",TUR:"🇹🇷",TKM:"🇹🇲",UGA:"🇺🇬",UKR:"🇺🇦",ARE:"🇦🇪",GBR:"🇬🇧",USA:"🇺🇸",URY:"🇺🇾",UZB:"🇺🇿",VEN:"🇻🇪",VNM:"🇻🇳",YEM:"🇾🇪",ZMB:"🇿🇲",ZWE:"🇿🇼"},hs={AFG:"Afghanistan",ALB:"Albania",DZA:"Algeria",AGO:"Angola",ARG:"Argentina",ARM:"Armenia",AUS:"Australia",AUT:"Austria",AZE:"Azerbaijan",BHS:"Bahamas",BHR:"Bahrain",BGD:"Bangladesh",BLR:"Belarus",BEL:"Belgium",BLZ:"Belize",BEN:"Benin",BTN:"Bhutan",BOL:"Bolivia",BIH:"Bosnia & Herzegovina",BWA:"Botswana",BRA:"Brazil",BRN:"Brunei",BGR:"Bulgaria",BFA:"Burkina Faso",BDI:"Burundi",CPV:"Cabo Verde",KHM:"Cambodia",CMR:"Cameroon",CAN:"Canada",CAF:"Central African Rep.",TCD:"Chad",CHL:"Chile",CHN:"China",COL:"Colombia",COM:"Comoros",COD:"Dem. Rep. Congo",COG:"Congo",CRI:"Costa Rica",CIV:"Cote d'Ivoire",HRV:"Croatia",CYP:"Cyprus",CZE:"Czech Republic",DNK:"Denmark",DJI:"Djibouti",DOM:"Dominican Rep.",ECU:"Ecuador",EGY:"Egypt",SLV:"El Salvador",GNQ:"Equatorial Guinea",ERI:"Eritrea",EST:"Estonia",SWZ:"Eswatini",ETH:"Ethiopia",FJI:"Fiji",FIN:"Finland",FRA:"France",GAB:"Gabon",GMB:"Gambia",GEO:"Georgia",DEU:"Germany",GHA:"Ghana",GRC:"Greece",GTM:"Guatemala",GIN:"Guinea",GNB:"Guinea-Bissau",GUY:"Guyana",HTI:"Haiti",HND:"Honduras",HKG:"Hong Kong SAR",HUN:"Hungary",ISL:"Iceland",IND:"India",IDN:"Indonesia",IRN:"Iran",IRQ:"Iraq",IRL:"Ireland",ISR:"Israel",ITA:"Italy",JAM:"Jamaica",JPN:"Japan",JOR:"Jordan",KAZ:"Kazakhstan",KEN:"Kenya",KOR:"Korea (South)",KWT:"Kuwait",KGZ:"Kyrgyzstan",LAO:"Laos",LVA:"Latvia",LBN:"Lebanon",LSO:"Lesotho",LBR:"Liberia",LBY:"Libya",LTU:"Lithuania",LUX:"Luxembourg",MAC:"Macao SAR",MDG:"Madagascar",MWI:"Malawi",MYS:"Malaysia",MDV:"Maldives",MLI:"Mali",MLT:"Malta",MRT:"Mauritania",MUS:"Mauritius",MEX:"Mexico",MDA:"Moldova",MNG:"Mongolia",MNE:"Montenegro",MAR:"Morocco",MOZ:"Mozambique",MMR:"Myanmar",NAM:"Namibia",NPL:"Nepal",NLD:"Netherlands",NZL:"New Zealand",NIC:"Nicaragua",NER:"Niger",NGA:"Nigeria",MKD:"North Macedonia",NOR:"Norway",OMN:"Oman",PAK:"Pakistan",PAN:"Panama",PNG:"Papua New Guinea",PRY:"Paraguay",PER:"Peru",PHL:"Philippines",POL:"Poland",PRT:"Portugal",QAT:"Qatar",ROU:"Romania",RUS:"Russia",RWA:"Rwanda",SAU:"Saudi Arabia",SEN:"Senegal",SRB:"Serbia",SLE:"Sierra Leone",SGP:"Singapore",SVK:"Slovakia",SVN:"Slovenia",SOM:"Somalia",ZAF:"South Africa",SSD:"South Sudan",ESP:"Spain",LKA:"Sri Lanka",SDN:"Sudan",SUR:"Suriname",SWE:"Sweden",CHE:"Switzerland",TWN:"Taiwan",TJK:"Tajikistan",TZA:"Tanzania",THA:"Thailand",TLS:"Timor-Leste",TGO:"Togo",TTO:"Trinidad & Tobago",TUN:"Tunisia",TUR:"Turkey",TKM:"Turkmenistan",UGA:"Uganda",UKR:"Ukraine",ARE:"United Arab Emirates",GBR:"United Kingdom",USA:"United States",URY:"Uruguay",UZB:"Uzbekistan",VEN:"Venezuela",VNM:"Vietnam",YEM:"Yemen",ZMB:"Zambia",ZWE:"Zimbabwe"};function ms(a){return us[a]??"🌐"}function Yt(a){return hs[a]??a}function tt(a){return!Number.isFinite(a)||a<=0?"$0":a>=1e12?`$${(a/1e12).toFixed(1)}T`:a>=1e9?`$${(a/1e9).toFixed(1)}B`:a>=1e6?`$${(a/1e6).toFixed(1)}M`:`$${Math.round(a).toLocaleString()}`}function Y(a){if(!a.perSecondRate||!a.baselineTs)return a.debtUsd??0;const d=(Date.now()-Number(a.baselineTs))/1e3;return(a.debtUsd??0)+a.perSecondRate*d}function vs(a,d){const t=[...a];return d==="total"?t.sort((e,s)=>Y(s)-Y(e)):d==="gdp-ratio"?t.sort((e,s)=>(s.debtToGdp??0)-(e.debtToGdp??0)):d==="growth"&&t.sort((e,s)=>(s.annualGrowth??0)-(e.annualGrowth??0)),t}const W=20,it=class it extends L{constructor(){super({id:"national-debt",title:"National Debt Clock",showCount:!0,infoTooltip:"Live national debt estimates for 150+ countries. Data anchored at 2024-01-01 and accruing using IMF deficit projections."});b(this,"entries",[]);b(this,"filteredEntries",[]);b(this,"sortMode","total");b(this,"searchQuery","");b(this,"loading",!1);b(this,"lastFetch",0);b(this,"visibleCount",W);b(this,"tickerInterval",null);b(this,"tickerElements",new Map);b(this,"lastTickerValues",new Map);b(this,"connectRefreshQueued",!1);b(this,"connectionObserver",null);b(this,"connectRetryFrames",0);b(this,"REFRESH_INTERVAL",360*60*1e3);this.content.addEventListener("click",t=>{const e=t.target,s=e.closest("[data-sort]");if(s!=null&&s.dataset.sort){this.sortMode=s.dataset.sort,this.visibleCount=W,this.applyFilters(),this.render(),this.restartTicker();return}e.closest(".debt-load-more")&&(this.visibleCount+=W,this.render(),this.restartTicker())}),this.content.addEventListener("input",t=>{const e=t.target;e.classList.contains("debt-search")&&(this.searchQuery=e.value,this.visibleCount=W,this.applyFilters(),this.render(),this.restartTicker())})}async refresh(){var t,e,s;if(!this.loading&&!(Date.now()-this.lastFetch<this.REFRESH_INTERVAL&&this.entries.length>0)){if(!((t=this.element)!=null&&t.isConnected)){this.queueRefreshWhenConnected();return}this.loading=!0,this.showLoadingState();try{const n=await ue();if(!((e=this.element)!=null&&e.isConnected)){this.queueRefreshWhenConnected();return}this.entries=n.entries??[],this.lastFetch=Date.now(),this.applyFilters(),this.setCount(this.filteredEntries.length),this.render(),this.startTicker()}catch(n){if(!((s=this.element)!=null&&s.isConnected))return;console.error("[NationalDebtPanel] Error fetching data:",n),this.showError("Failed to load national debt data")}finally{this.loading=!1}}}queueRefreshWhenConnected(){if(this.connectRefreshQueued)return;this.connectRefreshQueued=!0;const t=()=>{var s,n;return(s=this.element)!=null&&s.isConnected?(this.connectRefreshQueued=!1,this.connectRetryFrames=0,(n=this.connectionObserver)==null||n.disconnect(),this.connectionObserver=null,this.refresh(),!0):!1};if(t())return;if(typeof MutationObserver<"u"){const s=document.body??document.documentElement;if(s){const n=new MutationObserver(()=>{t()});n.observe(s,{childList:!0,subtree:!0}),this.connectionObserver=n;return}}(typeof requestAnimationFrame=="function"?requestAnimationFrame:s=>(globalThis.setTimeout(()=>s(Date.now()),0),0))(()=>{var s;if(this.connectRefreshQueued=!1,(s=this.element)!=null&&s.isConnected){this.connectRetryFrames=0,this.refresh();return}if(this.connectRetryFrames>=it.MAX_CONNECT_RETRY_FRAMES){this.connectRetryFrames=0;return}this.connectRetryFrames+=1,this.queueRefreshWhenConnected()})}showLoadingState(){this.setSafeContent(D(`
      <div style="display:flex;align-items:center;justify-content:center;height:80px;color:var(--text-dim);font-size:13px;">
        Loading debt data from IMF...
      </div>
    `,"legacy Panel.setContent() migration"))}applyFilters(){const t=this.searchQuery.toLowerCase().trim(),e=t?this.entries.filter(s=>s.iso3.toLowerCase().includes(t)||Yt(s.iso3).toLowerCase().includes(t)):this.entries;this.filteredEntries=vs(e,this.sortMode)}get deficitCount(){return this.entries.filter(t=>t.perSecondRate>0).length}get surplusCount(){return this.entries.filter(t=>t.perSecondRate===0).length}getGlobalDebt(){return this.entries.reduce((t,e)=>t+Y(e),0)}getSourceLabel(){var e;let t="";for(const s of this.entries){const n=(e=s.source)==null?void 0:e.trim();n&&n.length>t.length&&(t=n)}return t||"IMF WEO"}render(){if(this.entries.length===0){this.showError("No data available");return}const t=`
      <div class="debt-panel-container">
        <div class="debt-summary">
          <div class="debt-summary-card debt-summary-card-deficit debt-summary-card-world">
            <span class="debt-summary-label">World Debt</span>
            <span class="debt-summary-value debt-global-ticker">${r(tt(this.getGlobalDebt()))}</span>
          </div>
          <div class="debt-summary-card debt-summary-card-warning">
            <span class="debt-summary-label">In Deficit</span>
            <span class="debt-summary-value">${this.deficitCount}</span>
          </div>
          <div class="debt-summary-card debt-summary-card-surplus">
            <span class="debt-summary-label">Running Surplus</span>
            <span class="debt-summary-value">${this.surplusCount}</span>
          </div>
        </div>
        <div class="debt-controls">
          <div class="debt-sort-tabs">
            <button class="debt-tab${this.sortMode==="total"?" active":""}" data-sort="total">Total Debt</button>
            <button class="debt-tab${this.sortMode==="gdp-ratio"?" active":""}" data-sort="gdp-ratio">Debt/GDP</button>
            <button class="debt-tab${this.sortMode==="growth"?" active":""}" data-sort="growth">1Y Growth</button>
          </div>
          <input class="debt-search" type="text" placeholder="Search country..." value="${r(this.searchQuery)}">
        </div>
        <div class="debt-list">
          ${this.filteredEntries.slice(0,this.visibleCount).map((e,s)=>this.renderRow(e,s+1)).join("")}
        </div>
        ${this.visibleCount<this.filteredEntries.length?`
        <button class="debt-load-more">
          Load ${Math.min(W,this.filteredEntries.length-this.visibleCount)} more
          <span class="debt-load-more-count">(${this.filteredEntries.length-this.visibleCount} remaining)</span>
        </button>`:""}
        <div class="debt-footer">
          <span class="debt-source">Source: ${r(this.getSourceLabel())}</span>
          <span class="debt-updated">Updated: ${new Date(this.lastFetch).toLocaleDateString()}</span>
        </div>
      </div>
    `;this.setSafeContent(D(t,"legacy Panel.setContent() migration"))}renderRow(t,e){const s=Y(t),n=r(Yt(t.iso3)),l=ms(t.iso3),o=tt(s),c=Number.isFinite(t.debtToGdp)&&t.debtToGdp>0?`${t.debtToGdp.toFixed(1)}%`:"—",u=Number.isFinite(t.annualGrowth)&&t.annualGrowth!==0?`${t.annualGrowth>0?"+":""}${t.annualGrowth.toFixed(1)}%`:"—",h=t.annualGrowth>5?"debt-growth-high":t.annualGrowth>0?"debt-growth-mid":"";return`
      <div class="debt-row" data-iso3="${r(t.iso3)}">
        <div class="debt-rank">${e}</div>
        <div class="debt-flag">${l}</div>
        <div class="debt-info">
          <div class="debt-name">${n}</div>
          <div class="debt-meta">
            <span class="debt-ratio">${c} of GDP</span>
            <span class="debt-growth ${h}">${u} YoY</span>
          </div>
        </div>
        <div class="debt-ticker" data-iso3="${r(t.iso3)}">${r(o)}</div>
      </div>
    `}startTicker(){if(this.stopTicker(),this.filteredEntries.length===0)return;this.tickerElements.clear(),this.lastTickerValues.clear();const t=this.content.querySelector(".debt-global-ticker");t&&this.tickerElements.set("__global__",t);const e=this.content.querySelector(".debt-list");if(e)for(const s of this.filteredEntries.slice(0,this.visibleCount)){const n=e.querySelector(`.debt-ticker[data-iso3="${s.iso3}"]`);n&&this.tickerElements.set(s.iso3,n)}this.tickerInterval=setInterval(()=>{const s=this.tickerElements.get("__global__");if(s){const n=tt(this.getGlobalDebt());this.lastTickerValues.get("__global__")!==n&&(s.textContent=n,this.lastTickerValues.set("__global__",n))}for(const n of this.filteredEntries.slice(0,this.visibleCount)){const l=this.tickerElements.get(n.iso3);if(!l)continue;const o=tt(Y(n));this.lastTickerValues.get(n.iso3)!==o&&(l.textContent=o,this.lastTickerValues.set(n.iso3,o))}},1e3)}stopTicker(){this.tickerInterval!==null&&(clearInterval(this.tickerInterval),this.tickerInterval=null),this.tickerElements.clear(),this.lastTickerValues.clear()}restartTicker(){this.stopTicker(),this.startTicker()}destroy(){var t;(t=this.connectionObserver)==null||t.disconnect(),this.connectionObserver=null,this.connectRefreshQueued=!1,this.connectRetryFrames=0,this.stopTicker(),super.destroy()}};b(it,"MAX_CONNECT_RETRY_FRAMES",8);let Tt=it;const ca=Object.freeze(Object.defineProperty({__proto__:null,NationalDebtPanel:Tt},Symbol.toStringTag,{value:"Module"}));let gt=null;async function fs(){if(!gt){const{EconomicServiceClient:a}=await j(async()=>{const{EconomicServiceClient:t}=await import("./rpc-client-economic-v1-D42HSL7G.js");return{EconomicServiceClient:t}},[]),{getRpcBaseUrl:d}=await j(async()=>{const{getRpcBaseUrl:t}=await import("./embed-url-q0YUYtcM.js").then(e=>e.a2);return{getRpcBaseUrl:t}},__vite__mapDeps([0,1,2,3,4,5,6,7]));gt=new a(d(),{fetch:(...t)=>globalThis.fetch(...t)})}return gt}function B(a){return`${a.toFixed(1)}%`}function gs(a){return`$${a.toLocaleString(void 0,{maximumFractionDigits:0})}B`}function bs(a){if(a.length<13)return{value:null,prior:null,date:""};const d=a[a.length-1],t=a[a.length-13],e=a[a.length-2],s=a[a.length-14]??a[a.length-13];if(!d||!t)return{value:null,prior:null,date:""};const n=t.value>0?(d.value-t.value)/t.value*100:null,l=s&&e&&s.value>0?(e.value-s.value)/s.value*100:null;return{value:n,prior:l,date:d.date}}function et(a){const d=a[a.length-1];if(!a.length||!d)return{value:null,prior:null,date:""};const t=a[a.length-2];return{value:d.value,prior:(t==null?void 0:t.value)??null,date:d.date}}function ys(a,d,t){return t||a===0?"var(--text-dim)":(d?a<0:a>0)?"#27ae60":"#e74c3c"}function qt(a){const d=a.value!==null?r(a.format(a.value)):"N/A",t=a.value!==null&&a.prior!==null?a.value-a.prior:null,e=a.deltaFormat??a.format,s=t!==null?`${t>=0?"+":""}${e(t)} vs prior`:"",n=t!==null?ys(t,a.lowerIsBetter,a.neutral??!1):"var(--text-dim)";return`<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:6px;padding:14px 12px;display:flex;flex-direction:column;gap:4px">
    <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.07em">${r(a.label)}</div>
    <div style="font-size:28px;font-weight:700;color:var(--text);line-height:1.1;font-variant-numeric:tabular-nums">${d}</div>
    ${s?`<div style="font-size:11px;color:${n}">${r(s)}</div>`:""}
    <div style="font-size:10px;color:var(--text-dim)">${r(a.date)}</div>
  </div>`}function Zt(a,d){return a.unit==="%"?B(d):a.unit==="index"?d.toFixed(2):a.unit.includes("per")?d.toFixed(4):`${d.toLocaleString(void 0,{maximumFractionDigits:2})}${a.unit?` ${a.unit}`:""}`}function $s(a){const d=a.hasValue&&Number.isFinite(a.value),t=d?r(Zt(a,a.value)):"N/A",e=d&&a.hasPriorValue&&Number.isFinite(a.priorValue)?a.value-a.priorValue:null,s=e===null?"":`${e>=0?"+":""}${Zt(a,e)} vs prior`,n=a.stale?"STALE":a.unavailableReason||(d?"LIVE":"UNAVAILABLE"),l=a.stale?"#f39c12":a.unavailableReason||!d?"#e74c3c":"#27ae60",o=a.observationDate||"No observation date",c=a.source||"Source unavailable";return`<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:6px;padding:14px 12px;display:flex;flex-direction:column;gap:4px;min-width:0">
    <div style="display:flex;justify-content:space-between;gap:6px;align-items:flex-start">
      <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.07em">${r(a.label)}</div>
      <span style="font-size:9px;color:${l};font-weight:600">${r(n.replace(/_/g," "))}</span>
    </div>
    <div style="font-size:28px;font-weight:700;color:var(--text);line-height:1.1;font-variant-numeric:tabular-nums">${t}</div>
    ${s?`<div style="font-size:11px;color:var(--text-dim)">${r(s)}</div>`:""}
    <div style="font-size:10px;color:var(--text-dim)">Observed ${r(o)}</div>
    <div style="font-size:9px;color:var(--text-dim);overflow-wrap:anywhere">Source: ${r(c)}</div>
  </div>`}function ws(a){const d=a&&typeof a=="object"&&!Array.isArray(a)?a:{};return{id:String(d.id??""),event:String(d.event??""),countryCode:String(d.countryCode??""),releaseDate:String(d.releaseDate??""),releaseTime:String(d.releaseTime??""),timezone:String(d.timezone??""),kind:String(d.kind??""),status:String(d.status??""),source:String(d.source??""),sourceUrl:String(d.sourceUrl??"")}}function Ss(a,d){if(!a||typeof a!="object"||!d||typeof d!="object")return null;const t=a,e=Array.isArray(t.indicators)?t.indicators.map(l=>{const o=l,c=typeof o.value=="number"?o.value:0,u=typeof o.priorValue=="number"?o.priorValue:0;return{id:String(o.id??""),label:String(o.label??""),category:String(o.category??""),value:c,hasValue:typeof o.value=="number"&&Number.isFinite(o.value),priorValue:u,hasPriorValue:typeof o.priorValue=="number"&&Number.isFinite(o.priorValue),unit:String(o.unit??""),observationDate:String(o.observationDate??""),source:String(o.source??""),sourceUrl:String(o.sourceUrl??""),stale:o.stale===!0,unavailableReason:String(o.unavailableReason??""),contextOnly:o.contextOnly===!0}}):[],s=d,n=Array.isArray(s.events)?s.events.map(ws):[];return n.length===0?null:{countryCode:String(t.countryCode??"CN"),generatedAt:String(t.generatedAt??""),status:String(t.status??"unavailable"),launchReady:t.launchReady===!0,contentObservationDate:String(t.contentObservationDate??""),latestObservationDate:String(t.latestObservationDate??""),indicators:e,sourceDecisions:Array.isArray(t.sourceDecisions)?t.sourceDecisions:[],releaseEvents:n,unavailable:!1}}const Cs=["price","activity","policy","fx"];function bt(a){return(a==null?void 0:a.launchReady)!==!0||a.unavailable?!1:Cs.every(d=>a.indicators.some(t=>t.category===d&&t.hasValue&&Number.isFinite(t.value)&&!t.stale&&!t.unavailableReason))}const xs=["DE","FR","IT","ES"];function Ts(a){if(!a)return"";const d=/^(\d{4})-(\d{2})$/.exec(a);if(d){const e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(d[2]??"0",10)-1];return e?`${e} ${d[1]??a}`:a}return a}function yt(a,d){var o;const t=[],e=[];let s="";for(const c of xs){const u=(o=a.countries[c])==null?void 0:o[d];u&&typeof u.value=="number"&&Number.isFinite(u.value)&&(t.push(u.value),(!s||u.date>s)&&(s=u.date)),u!=null&&u.hasPrior&&Number.isFinite(u.priorValue)&&e.push(u.priorValue)}if(t.length===0)return{value:null,prior:null,date:""};const n=Math.round(t.reduce((c,u)=>c+u,0)/t.length*100)/100,l=e.length===t.length?Math.round(e.reduce((c,u)=>c+u,0)/e.length*100)/100:null;return{value:n,prior:l,date:Ts(s)}}class Ds extends L{constructor(){super({id:"macro-tiles",title:"Macro Indicators",showCount:!1,infoTooltip:i("components.macroTiles.infoTooltip")});b(this,"_hasData",!1);b(this,"_tab","us");b(this,"_usTiles",[]);b(this,"_eurostat",null);b(this,"_estrObs",[]);b(this,"_china",null);this.content.addEventListener("click",t=>{const e=t.target.closest("[data-tab]");((e==null?void 0:e.dataset.tab)==="us"||(e==null?void 0:e.dataset.tab)==="eu"||(e==null?void 0:e.dataset.tab)==="cn")&&(this._tab=e.dataset.tab,this._render())}),this.content.addEventListener("keydown",t=>{if(!(t instanceof KeyboardEvent))return;const e=t.target.closest('[role="tab"][data-tab]');if(!e||!["ArrowRight","ArrowLeft","Home","End"].includes(t.key))return;const s=this._availableTabs(),n=s.indexOf(e.dataset.tab);if(n<0)return;t.preventDefault();const l=t.key==="Home"?s[0]:t.key==="End"?s[s.length-1]:s[(n+(t.key==="ArrowRight"?1:-1)+s.length)%s.length];l&&(this._tab=l,this._render(()=>{var o;(o=this.content.querySelector(`[data-tab="${l}"]`))==null||o.focus()}))})}async fetchData(){var t,e,s,n,l;this.showLoading();try{const o=await fs(),c=N("chinaMacro"),u=N("chinaReleaseCalendar"),h=Ss(c,u),[f,v,p]=await Promise.allSettled([o.getFredSeriesBatch({seriesIds:["CPIAUCSL","UNRATE","GDP","FEDFUNDS","ESTR"],limit:14}),he(),h??o.getChinaMacroSnapshot({})]),m=f.status==="fulfilled"?f.value.results??{}:{};this._estrObs=((t=m.ESTR)==null?void 0:t.observations)??[],v.status==="fulfilled"&&!v.value.unavailable&&(this._eurostat=v.value),this._china=p.status==="fulfilled"?p.value:null;const g=bs(((e=m.CPIAUCSL)==null?void 0:e.observations)??[]),$=et(((s=m.UNRATE)==null?void 0:s.observations)??[]),w=et(((n=m.GDP)==null?void 0:n.observations)??[]),P=et(((l=m.FEDFUNDS)==null?void 0:l.observations)??[]);this._usTiles=[{id:"cpi",label:"CPI (YoY)",...g,lowerIsBetter:!0,format:B,deltaFormat:y=>y.toFixed(2)},{id:"unrate",label:"Unemployment",...$,lowerIsBetter:!0,format:B},{id:"gdp",label:"GDP (Billions)",...w,lowerIsBetter:!1,format:gs,deltaFormat:y=>`${y.toLocaleString(void 0,{maximumFractionDigits:0})}B`},{id:"fed",label:"Fed Funds Rate",...P,lowerIsBetter:!1,neutral:!0,format:B}];const C=this._usTiles.some(y=>y.value!==null),T=this._eurostat!==null,R=bt(this._china);return!C&&!T&&!R?(this._hasData||this.showError("Macro data unavailable",()=>void this.fetchData()),!1):(!C&&this._tab==="us"&&(this._tab=R?"cn":"eu"),!R&&this._tab==="cn"&&(this._tab=C?"us":"eu"),this._hasData=!0,this._render(),!0)}catch(o){return this._hasData||this.showError(o instanceof Error?o.message:"Failed to load",()=>void this.fetchData()),!1}}_render(t){const e=this._availableTabs(),s={us:"US",eu:"Euro Area",cn:"China"},n=`<div role="tablist" aria-label="Macro economy" style="display:flex;gap:4px;margin-bottom:10px;overflow-x:auto">
      ${e.map(c=>`<button id="macro-tiles-tab-${c}" role="tab" aria-selected="${this._tab===c}" aria-controls="macro-tiles-tabpanel" tabindex="${this._tab===c?"0":"-1"}" class="panel-tab${this._tab===c?" active":""}" data-tab="${c}" style="font-size:11px;padding:6px 10px;min-height:44px">${s[c]}</button>`).join("")}
    </div>`;let l;this._tab==="us"?l=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px">${this._usTiles.map(qt).join("")}</div>`:this._tab==="eu"?l=this._buildEuBody():l=this._buildChinaBody();const o=`macro-tiles-tab-${this._tab}`;this.setSafeContent(D(`${n}<div id="macro-tiles-tabpanel" role="tabpanel" aria-labelledby="${o}">${l}</div>`,"legacy Panel.setContent() migration"),t)}_availableTabs(){return bt(this._china)?["us","eu","cn"]:["us","eu"]}_buildChinaBody(){if(!bt(this._china)||!this._china)return'<div style="padding:8px;color:var(--text-dim);font-size:12px">China macro data unavailable</div>';const t=this._china.indicators.map($s).join(""),e=new Date().toISOString().slice(0,10),s=this._china.releaseEvents.filter(l=>l.countryCode==="CN"&&l.releaseDate>=e).sort((l,o)=>l.releaseDate.localeCompare(o.releaseDate)).slice(0,3),n=s.length>0?`<div style="margin-top:10px;border-top:1px solid var(--border);padding-top:8px">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px">China release calendar</div>
          ${s.map(l=>`<div style="display:flex;justify-content:space-between;gap:8px;font-size:10px;color:var(--text-dim);margin-top:3px"><span>${r(l.event)}</span><span>${r(l.releaseDate)} · ${r(l.status)}</span></div>`).join("")}
        </div>`:'<div style="margin-top:8px;font-size:10px;color:var(--text-dim)">China release calendar unavailable</div>';return`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px">${t}</div>${n}`}_buildEuBody(){if(!this._eurostat)return'<div style="padding:8px;color:var(--text-dim);font-size:12px">Euro Area data unavailable</div>';const t=yt(this._eurostat,"cpi"),e=yt(this._eurostat,"unemployment"),s=yt(this._eurostat,"gdpGrowth"),n=et(this._estrObs),l=[{id:"eu-cpi",label:"HICP (YoY)",value:t.value,prior:t.prior,date:t.date,lowerIsBetter:!0,format:B},{id:"eu-un",label:"Unemployment",value:e.value,prior:e.prior,date:e.date,lowerIsBetter:!0,format:B},{id:"eu-gdp",label:"GDP Growth (QoQ)",value:s.value,prior:s.prior,date:s.date,lowerIsBetter:!1,format:B},{id:"eu-estr",label:"€STR (ECB Rate)",...n,lowerIsBetter:!1,neutral:!0,format:B}];return l.some(o=>o.value!==null)?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px">${l.map(qt).join("")}</div>
      <div style="margin-top:8px;font-size:9px;color:var(--text-dim)">Eurostat · ECB · avg DE, FR, IT, ES</div>`:'<div style="padding:8px;color:var(--text-dim);font-size:12px">Euro Area data unavailable</div>'}}const la=Object.freeze(Object.defineProperty({__proto__:null,MacroTilesPanel:Ds},Symbol.toStringTag,{value:"Module"}));let $t=null;async function Ps(){if(!$t){const{MarketServiceClient:a}=await j(async()=>{const{MarketServiceClient:t}=await import("./rpc-client-market-v1-Bo995CQG.js");return{MarketServiceClient:t}},[]),{getRpcBaseUrl:d}=await j(async()=>{const{getRpcBaseUrl:t}=await import("./embed-url-q0YUYtcM.js").then(e=>e.a2);return{getRpcBaseUrl:t}},__vite__mapDeps([0,1,2,3,4,5,6,7]));$t=new a(d(),{fetch:(...t)=>globalThis.fetch(...t)})}return $t}let wt=null;async function Es(){if(!wt){const{EconomicServiceClient:a}=await j(async()=>{const{EconomicServiceClient:t}=await import("./rpc-client-economic-v1-D42HSL7G.js");return{EconomicServiceClient:t}},[]),{getRpcBaseUrl:d}=await j(async()=>{const{getRpcBaseUrl:t}=await import("./embed-url-q0YUYtcM.js").then(e=>e.a2);return{getRpcBaseUrl:t}},__vite__mapDeps([0,1,2,3,4,5,6,7]));wt=new a(d(),{fetch:(...t)=>globalThis.fetch(...t)})}return wt}function ks(a){return a==="Low Stress"?"#27ae60":a==="Moderate Stress"?"#f39c12":a==="Elevated Stress"?"#e67e22":"#c0392b"}function Rs(a){return a==="Low Stress"?i("components.fsi.interpretation.low"):a==="Moderate Stress"?i("components.fsi.interpretation.moderate"):a==="Elevated Stress"?i("components.fsi.interpretation.elevated"):i("components.fsi.interpretation.severe")}function As(a){return a==="Low Stress"?i("components.fsi.labels.lowStress"):a==="Moderate Stress"?i("components.fsi.labels.moderateStress"):a==="Elevated Stress"?i("components.fsi.labels.elevatedStress"):a==="Severe Stress"?i("components.fsi.labels.severeStress"):a}function Ms(a){return a==="Low"?i("components.fsi.cissLabels.low"):a==="Moderate"?i("components.fsi.cissLabels.moderate"):a==="Elevated"?i("components.fsi.cissLabels.elevated"):a==="High"?i("components.fsi.cissLabels.high"):a}function Qt(a){return a==="Low"?"#27ae60":a==="Moderate"?"#f39c12":a==="Elevated"?"#e67e22":"#c0392b"}function Ls(a){const d=Date.parse(a);return Number.isFinite(d)?Date.now()-d>Ie:!1}function st(a,d){return`<div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:8px 10px;border:1px solid rgba(255,255,255,0.07)">
    <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">${r(a)}</div>
    <div style="font-size:16px;font-weight:600;color:var(--text)">${r(d)}</div>
  </div>`}class Is extends L{constructor(){super({id:"fsi",title:i("components.fsi.title"),showCount:!1,infoTooltip:i("components.fsi.infoTooltip")});b(this,"_hasData",!1)}async fetchData(){var t,e,s,n;this.showLoading();try{const l=N("fearGreedIndex");let o=0,c="",u=0,h=0,f=0,v=0;if(l&&!l.unavailable){const m=l.headerMetrics??{};o=Number(((t=m==null?void 0:m.fsi)==null?void 0:t.value)??0),c=String(((e=m==null?void 0:m.fsi)==null?void 0:e.label)??""),f=Number(((s=m==null?void 0:m.vix)==null?void 0:s.value)??0),v=Number(((n=m==null?void 0:m.hySpread)==null?void 0:n.value)??0)}if(o<=0){const g=await(await Ps()).getFearGreedIndex({});!g.unavailable&&g.fsiValue>0&&(o=g.fsiValue,c=g.fsiLabel,u=g.hygPrice,h=g.tltPrice,f=g.vix,v=g.hySpread)}if(o<=0)return this._hasData||this.showError(i("components.fsi.errors.unavailable"),()=>void this.fetchData()),!1;let p=null;try{const m=N("euFsi");if(m&&!m.unavailable&&Number.isFinite(m.latestValue))p=m;else{const $=await(await Es()).getEuFsi({});!$.unavailable&&Number.isFinite($.latestValue)&&(p=$)}}catch{}return this._hasData=!0,this.render({fsiValue:o,fsiLabel:c,hygPrice:u,tltPrice:h,vix:f,hySpread:v},p),!0}catch(l){return this._hasData||this.showError(l instanceof Error?l.message:i("components.fsi.errors.failedToLoad"),()=>void this.fetchData()),!1}}render(t,e){const{fsiValue:s,fsiLabel:n,hygPrice:l,tltPrice:o,vix:c,hySpread:u}=t,h=ks(n),f=Math.min(Math.max(s/2.5*100,0),100),v=Rs(n),p=e?e.stale||Ls(e.latestDate):!1,m=e?`<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.07)">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">${r(i("components.fsi.cissTitle"))}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <div style="font-size:28px;font-weight:700;color:${Qt(e.label)};line-height:1">${e.latestValue.toFixed(4)}</div>
            <div>
              <div style="font-size:12px;font-weight:600;color:${Qt(e.label)}">${r(Ms(e.label))}</div>
              <div style="font-size:10px;color:${p?"#e67e22":"var(--text-dim)"}">${r(e.latestDate?new Date(e.latestDate).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"}):"")}</div>
            </div>
          </div>
          ${p?`<div style="font-size:9px;color:#e67e22;background:rgba(230,126,34,0.1);border-radius:4px;padding:4px 6px;margin-bottom:8px">⚠ ${r(i("components.fsi.cissStale"))}</div>`:""}
          <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:6px;overflow:hidden">
            <div style="height:100%;width:${(e.latestValue*100).toFixed(1)}%;background:linear-gradient(90deg,#27ae60,#f39c12,#c0392b);border-radius:4px"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-dim);margin-top:3px">
            <span>${r(i("components.fsi.scale.noStress"))}</span><span>${r(i("components.fsi.scale.extremeStress"))}</span>
          </div>
        </div>`:"",g=`<div style="padding:12px 14px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:4px">${r(i("components.fsi.usFsiValue"))}</div>
        <div style="font-size:36px;font-weight:700;color:${h};line-height:1">${s.toFixed(4)}</div>
        <div style="font-size:13px;font-weight:600;color:${h};margin-top:4px">${r(As(n))}</div>
      </div>
      <div style="margin:0 0 12px">
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text-dim);margin-bottom:3px">
          <span>${r(i("components.fsi.scale.highStress"))}</span><span>${r(i("components.fsi.scale.lowStress"))}</span>
        </div>
        <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden">
          <div style="height:100%;width:${f.toFixed(1)}%;background:linear-gradient(90deg,#c0392b,#f39c12,#27ae60);border-radius:4px"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">
        ${st(i("components.fsi.metrics.vix"),c>0?c.toFixed(2):i("components.fsi.notAvailable"))}
        ${st(i("components.fsi.metrics.hySpread"),u>0?u.toFixed(2)+"%":i("components.fsi.notAvailable"))}
        ${st(i("components.fsi.metrics.hygPrice"),l>0?"$"+l.toFixed(2):i("components.fsi.notAvailable"))}
        ${st(i("components.fsi.metrics.tltPrice"),o>0?"$"+o.toFixed(2):i("components.fsi.notAvailable"))}
      </div>
      <div style="font-size:11px;color:var(--text-dim);background:rgba(255,255,255,0.03);border-radius:6px;padding:8px 10px;border-left:3px solid ${h}">
        ${r(v)}
      </div>
      ${m}
    </div>`;this.setSafeContent(D(g,"legacy Panel.setContent() migration"))}}const da=Object.freeze(Object.defineProperty({__proto__:null,FSIPanel:Is},Symbol.toStringTag,{value:"Module"}));export{ra as B,Xs as C,Qs as E,oa as F,Js as G,aa as I,la as M,ca as N,ea as S,ta as T,sa as a,ia as b,na as c,da as d};
