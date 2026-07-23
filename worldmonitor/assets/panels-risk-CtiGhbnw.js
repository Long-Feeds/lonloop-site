var Te=Object.defineProperty;var Ee=(d,p,e)=>p in d?Te(d,p,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[p]=e;var u=(d,p,e)=>Ee(d,typeof p!="symbol"?p+"":p,e);import{P as S}from"./Panel-D0RXcFBq.js";import{t as i,p as Z,i as k,f as _,r as Ae,u as G,R,v as J,w as j,x as B,z as P,A as Le,B as z,q as K,a as Q,C as Oe,D as _e}from"./panel-storage-Duaw_bEH.js";import{u as w,s as L,t as O,e as r,a as M,f as D,j as ve,b as I,h}from"./dom-utils-CDIB5TLV.js";import{A as fe,a5 as Ne,a6 as ye,a7 as be,a8 as De,a9 as U,aa as Ie,ab as ee,ac as te,ad as Me,ae as Fe,af as Re,ag as Pe,ah as ze,ai as Ue,aj as W,ak as se}from"./main-CPzCGdxy.js";import{r as $e}from"./followed-only-chip-tusPsU_q.js";import{g as He,c as je,R as Be,a as Ke,r as We}from"./embed-url-q0YUYtcM.js";import{b as Ge}from"./news-context-CqnvrXzz.js";import{M as N,P as H,S as Ve,f as qe}from"./ollama-models-Bkp8DQxM.js";import"./layout-batch-B9PC4ceT.js";import{g as Ye,f as Ze}from"./insights-loader-D9r_odfr.js";import{n as Xe,b as ae,a as Je,c as Qe,d as et,T as Ce,e as ie,f as ne}from"./threat-timeline-utils-R3BZuEM8.js";import{m as we}from"./max-DBeXZoyG.js";import{l as q}from"./linear-B9BZxnEW.js";import{s as tt}from"./stack-DSObyWpB.js";import{C as oe,f as re,g as le}from"./humanity-counters-gXAEgOcX.js";import{e as st}from"./extent-Ccx1MofX.js";import{s as at}from"./string-B04_ldoR.js";import{a as it,m as ce}from"./monotone-804fPAVO.js";import{l as nt}from"./line-DEDRnOn1.js";class ot extends S{constructor(){super({id:"satellite-fires",title:i("panels.satelliteFires"),showCount:!0,trackActivity:!0,infoTooltip:i("components.satelliteFires.infoTooltip")});u(this,"stats",[]);u(this,"totalCount",0);u(this,"lastUpdated",null);this.showLoading(i("common.scanningThermalData"))}update(e,t){const s=this.totalCount;this.stats=e,this.totalCount=t,this.lastUpdated=new Date,this.setCount(t),s>0&&t>s&&this.setNewBadge(t-s),this.render()}render(){if(this.stats.length===0){this.setSafeContent(w(`<div class="panel-empty">${i("common.noDataAvailable")}</div>`,"legacy Panel.setContent() migration"));return}const e=this.stats.map(o=>{const c=o.totalFrp>=1e3?`${(o.totalFrp/1e3).toFixed(1)}k`:Math.round(o.totalFrp).toLocaleString(),m=o.highIntensityCount>0?" fires-high":"",v=o.possibleExplosionCount>0?`<span class="fires-explosion-badge" title="${i("components.satelliteFires.explosionTooltip")}">${o.possibleExplosionCount}</span>`:"";return`<tr class="fire-row${m}">
        <td class="fire-region">${rt(o.region)}${v}</td>
        <td class="fire-count">${o.fireCount}</td>
        <td class="fire-hi">${o.highIntensityCount}</td>
        <td class="fire-frp">${c}</td>
      </tr>`}).join(""),t=this.stats.reduce((o,c)=>o+c.totalFrp,0),s=this.stats.reduce((o,c)=>o+c.highIntensityCount,0),a=this.stats.reduce((o,c)=>o+c.possibleExplosionCount,0),n=this.lastUpdated?lt(this.lastUpdated):i("components.satelliteFires.never");this.setSafeContent(w(`
      <div class="fires-panel-content">
        <table class="fires-table">
          <thead>
            <tr>
              <th>${i("components.satelliteFires.region")}</th>
              <th>${i("components.satelliteFires.fires")}</th>
              <th>${i("components.satelliteFires.high")}</th>
              <th>FRP</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
          <tfoot>
            <tr class="fire-totals">
              <td>${i("components.satelliteFires.total")}</td>
              <td>${this.totalCount}</td>
              <td>${s}</td>
              <td>${t>=1e3?`${(t/1e3).toFixed(1)}k`:Math.round(t).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        ${a>0?`<div class="fires-explosion-alert">${i("components.satelliteFires.possibleExplosions",{count:String(a)})}</div>`:""}
        <div class="fires-footer">
          <span class="fires-source">NASA FIRMS (VIIRS SNPP)</span>
          <span class="fires-updated">${n}</span>
        </div>
      </div>
    `,"legacy Panel.setContent() migration"))}}function rt(d){return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function lt(d){const p=Math.floor((Date.now()-d.getTime())/1e3);if(p<60)return i("components.satelliteFires.time.justNow");const e=Math.floor(p/60);if(e<60)return i("components.satelliteFires.time.minutesAgo",{count:String(e)});const t=Math.floor(e/60);return i("components.satelliteFires.time.hoursAgo",{count:String(t)})}const ys=Object.freeze(Object.defineProperty({__proto__:null,SatelliteFiresPanel:ot},Symbol.toStringTag,{value:"Module"}));function ct(d){return d==="alert"?"#e74c3c":d==="warning"?"#e67e22":"#f1c40f"}function dt(d){return d==="alert"?i("components.diseaseOutbreaks.levels.alert"):d==="warning"?i("components.diseaseOutbreaks.levels.warning"):i("components.diseaseOutbreaks.levels.watch")}function ht(d){if(!d)return"";const p=Date.now()-d,e=Math.floor(p/36e5);if(e<1)return i("components.diseaseOutbreaks.time.justNow");if(e<24)return i("components.diseaseOutbreaks.time.hoursAgo",{count:e});const t=Math.floor(e/24);return i("components.diseaseOutbreaks.time.daysAgo",{count:t})}class ut extends S{constructor(){super({id:"disease-outbreaks",title:i("components.diseaseOutbreaks.title"),showCount:!1,infoTooltip:`${i("components.diseaseOutbreaks.infoTooltip")}<br><br><em>${i("components.diseaseOutbreaks.methodologyNote")}</em>`});u(this,"_outbreaks",[]);u(this,"_hasData",!1);u(this,"_filter","");u(this,"_followedOnlyChip",null);u(this,"_followedOnlyHost",null);u(this,"_followedOnlyTeardown",null);u(this,"_followedUnsub",null);this.content.addEventListener("click",e=>{const t=e.target.closest("[data-filter]");t&&(this._filter=t.dataset.filter===this._filter?"":t.dataset.filter??"",this._render())}),this.content.addEventListener("input",e=>{const t=e.target;t.dataset.role==="search"&&(this._filter=t.value.trim().toLowerCase(),this._render())}),this._mountFollowedOnlyChip()}_mountFollowedOnlyChip(){const e=document.createElement("span");if(e.className="panel-header-followed-only-host",this._followedOnlyHost=e,this._followedOnlyChip=$e({panelId:"disease-outbreaks",onChange:()=>{this._hasData&&this._render()}}),this._followedOnlyChip.html==="")return;L(e,O(this._followedOnlyChip.html,"legacy direct innerHTML migration"));const t=this.header.querySelector(".panel-close-btn");t?this.header.insertBefore(e,t):this.header.appendChild(e),this._followedOnlyTeardown=this._followedOnlyChip.attach(e),this._followedUnsub=fe(()=>{this._hasData&&this._render()})}async fetchData(){var e;this.showLoading();try{const t=await Ne();return(e=t.outbreaks)!=null&&e.length?(this._outbreaks=[...t.outbreaks].sort((s,a)=>{const n={alert:0,warning:1,watch:2},o=n[s.alertLevel]??3,c=n[a.alertLevel]??3;return o!==c?o-c:(a.publishedAt??0)-(s.publishedAt??0)}),this._hasData=!0,this._render(),!0):(this._hasData||this.showError(i("components.diseaseOutbreaks.errors.noData"),()=>void this.fetchData()),!1)}catch(t){return this._hasData||this.showError(t instanceof Error?t.message:i("components.diseaseOutbreaks.errors.failedToLoad"),()=>void this.fetchData()),!1}}updateData(e){this._outbreaks=[...e].sort((t,s)=>{const a={alert:0,warning:1,watch:2},n=a[t.alertLevel]??3,o=a[s.alertLevel]??3;return n!==o?n-o:(s.publishedAt??0)-(t.publishedAt??0)}),this._hasData=this._outbreaks.length>0,this._hasData&&this._render()}_render(){var v;const e={alert:0,warning:0,watch:0};for(const l of this._outbreaks){const g=l.alertLevel;g in e&&e[g]++}const t=new Set(["alert","warning","watch"]);let s=this._filter?t.has(this._filter)?this._outbreaks.filter(l=>l.alertLevel===this._filter):this._outbreaks.filter(l=>{var g;return l.disease.toLowerCase().includes(this._filter)||l.location.toLowerCase().includes(this._filter)||((g=l.countryCode)==null?void 0:g.toLowerCase().includes(this._filter))}):this._outbreaks;const a=((v=this._followedOnlyChip)==null?void 0:v.isActive())===!0;a&&(s=s.filter(l=>{const g=ye(l.countryCode??"");return g?be(g):!1}));const n=`<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;align-items:center">
      ${e.alert>0?`<button data-filter="alert" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(231,76,60,0.4);background:${this._filter==="alert"?"rgba(231,76,60,0.2)":"transparent"};color:#e74c3c;cursor:pointer">${r(i("components.diseaseOutbreaks.filters.alert",{count:e.alert}))}</button>`:""}
      ${e.warning>0?`<button data-filter="warning" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(230,126,34,0.4);background:${this._filter==="warning"?"rgba(230,126,34,0.2)":"transparent"};color:#e67e22;cursor:pointer">${r(i("components.diseaseOutbreaks.filters.warning",{count:e.warning}))}</button>`:""}
      ${e.watch>0?`<button data-filter="watch" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1px solid rgba(241,196,15,0.4);background:${this._filter==="watch"?"rgba(241,196,15,0.2)":"transparent"};color:#f1c40f;cursor:pointer">${r(i("components.diseaseOutbreaks.filters.watch",{count:e.watch}))}</button>`:""}
    </div>`,o=s.map(l=>{const g=ct(l.alertLevel),$=dt(l.alertLevel),f=ht(l.publishedAt),y=l.sourceUrl?`<a href="${r(M(l.sourceUrl))}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:none;font-size:9px">${r(l.sourceName||i("components.diseaseOutbreaks.sourceFallback"))}</a>`:l.sourceName?`<span style="font-size:9px;color:var(--text-dim)">${r(l.sourceName)}</span>`:"";return`<div style="border-bottom:1px solid var(--border);padding:8px 0">
        <div style="display:flex;align-items:flex-start;gap:6px">
          <span style="flex-shrink:0;font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;background:${g}22;color:${g};margin-top:1px">${$}</span>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text);line-height:1.3">${r(l.disease)}</div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${r(l.location)}</div>
            ${l.summary?`<div style="font-size:10px;color:var(--text-dim);margin-top:3px;line-height:1.4">${r(l.summary.slice(0,120))}${l.summary.length>120?"…":""}</div>`:""}
            <div style="display:flex;gap:8px;margin-top:4px;align-items:center">
              ${y}
              ${f?`<span style="font-size:9px;color:var(--text-dim)">${r(f)}</span>`:""}
            </div>
          </div>
        </div>
      </div>`}).join(""),c=a?"No items in your followed countries. Add countries by tapping the star, or turn off this filter.":i("components.diseaseOutbreaks.empty"),m=s.length===0?`<div style="padding:16px;text-align:center;color:var(--text-dim);font-size:12px">${r(c)}</div>`:"";this.setSafeContent(w(`
      ${n}
      <div style="overflow-y:auto;max-height:420px">
        ${o||m}
      </div>
      <div style="margin-top:6px;font-size:9px;color:var(--text-dim)">${r(i("components.diseaseOutbreaks.attribution"))}</div>
    `,"legacy Panel.setContent() migration"))}destroy(){if(this._followedOnlyTeardown){try{this._followedOnlyTeardown()}catch{}this._followedOnlyTeardown=null}if(this._followedUnsub){try{this._followedUnsub()}catch{}this._followedUnsub=null}this._followedOnlyHost&&this._followedOnlyHost.parentElement&&this._followedOnlyHost.parentElement.removeChild(this._followedOnlyHost),this._followedOnlyHost=null,this._followedOnlyChip=null,super.destroy()}}const bs=Object.freeze(Object.defineProperty({__proto__:null,DiseaseOutbreaksPanel:ut},Symbol.toStringTag,{value:"Module"}));function pt(d){if(!d)return"";const p=Date.now()-d,e=Math.floor(p/36e5);return e<1?"just now":e<24?`${e}h ago`:`${Math.floor(e/24)}d ago`}function mt(d){return d>=80?"#e74c3c":d>=50?"#e67e22":d>=25?"#f1c40f":"#27ae60"}function de(d){return d>=1e3?`${(d/1e3).toFixed(1)}k`:String(d)}class gt extends S{constructor(){super({id:"social-velocity",title:"Social Velocity",showCount:!1,infoTooltip:i("components.socialVelocity.infoTooltip")});u(this,"_posts",[]);u(this,"_hasData",!1)}async fetchData(){var e;this.showLoading();try{const t=await De();return(e=t.posts)!=null&&e.length?(this._posts=[...t.posts].sort((s,a)=>a.velocityScore-s.velocityScore),this._hasData=!0,this._render(),!0):(this._hasData||this.showError("No signal data available",()=>void this.fetchData()),!1)}catch(t){return this._hasData||this.showError(t instanceof Error?t.message:"Failed to load",()=>void this.fetchData()),!1}}updateData(e){this._posts=[...e].sort((t,s)=>s.velocityScore-t.velocityScore),this._hasData=this._posts.length>0,this._hasData&&this._render()}_render(){const e=this._posts.slice(0,20).map((t,s)=>{const a=pt(t.createdAt),n=mt(t.velocityScore),o=Math.round(t.upvoteRatio*100),c=Math.max(4,Math.round(t.velocityScore));return`<div style="border-bottom:1px solid var(--border);padding:8px 0">
        <div style="display:flex;gap:8px;align-items:flex-start">
          <span style="flex-shrink:0;font-size:10px;font-weight:700;color:var(--text-dim);min-width:18px;text-align:right;margin-top:2px">${s+1}</span>
          <div style="flex:1;min-width:0">
            <a href="${r(M(t.url))}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-weight:500;color:var(--text);text-decoration:none;line-height:1.35;display:block">${r(t.title)}</a>
            <div style="display:flex;gap:8px;margin-top:4px;align-items:center;flex-wrap:wrap">
              <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(255,255,255,0.06);color:var(--text-dim)">r/${r(t.subreddit)}</span>
              <span style="font-size:9px;color:var(--text-dim)">&#9650; ${r(de(t.score))}</span>
              <span style="font-size:9px;color:var(--text-dim)">&#128172; ${r(de(t.numComments))}</span>
              <span style="font-size:9px;color:var(--text-dim)">${o}% up</span>
              ${a?`<span style="font-size:9px;color:var(--text-dim)">${r(a)}</span>`:""}
            </div>
          </div>
          <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:2px">
            <span style="font-size:11px;font-weight:700;color:${n}">${Math.round(t.velocityScore)}</span>
            <div style="width:32px;height:3px;border-radius:2px;background:rgba(255,255,255,0.08)">
              <div style="height:100%;width:${c}%;max-width:100%;border-radius:2px;background:${n}"></div>
            </div>
          </div>
        </div>
      </div>`}).join("");this.setSafeContent(w(`
      <div style="overflow-y:auto;max-height:440px">
        ${e||'<div style="padding:16px;text-align:center;color:var(--text-dim);font-size:12px">No signals</div>'}
      </div>
      <div style="margin-top:6px;font-size:9px;color:var(--text-dim)">Reddit · velocity = recency × score × ratio</div>
    `,"legacy Panel.setContent() migration"))}}const $s=Object.freeze(Object.defineProperty({__proto__:null,SocialVelocityPanel:gt},Symbol.toStringTag,{value:"Module"}));class vt extends S{constructor(){super({id:"displacement",title:i("panels.displacement"),showCount:!0,trackActivity:!0,infoTooltip:i("components.displacement.infoTooltip"),defaultRowSpan:2});u(this,"data",null);u(this,"activeTab","origins");u(this,"onCountryClick");u(this,"followedOnlyChip",null);u(this,"followedOnlyHost",null);u(this,"followedOnlyTeardown",null);u(this,"followedUnsub",null);this.showLoading(i("common.loadingDisplacement")),this.content.addEventListener("click",e=>{var a;const t=e.target.closest(".panel-tab");if(t!=null&&t.dataset.tab){this.activeTab=t.dataset.tab,this.renderContent();return}const s=e.target.closest(".disp-row");if(s){const n=Number(s.dataset.lat),o=Number(s.dataset.lon);Number.isFinite(n)&&Number.isFinite(o)&&((a=this.onCountryClick)==null||a.call(this,n,o))}}),this.mountFollowedOnlyChip()}mountFollowedOnlyChip(){const e=document.createElement("span");if(e.className="panel-header-followed-only-host",this.followedOnlyHost=e,this.followedOnlyChip=$e({panelId:"displacement",onChange:()=>{this.data&&this.renderContent()}}),this.followedOnlyChip.html==="")return;L(e,O(this.followedOnlyChip.html,"legacy direct innerHTML migration"));const t=this.header.querySelector(".panel-close-btn");t?this.header.insertBefore(e,t):this.header.appendChild(e),this.followedOnlyTeardown=this.followedOnlyChip.attach(e),this.followedUnsub=fe(()=>{this.data&&this.renderContent()})}setCountryClickHandler(e){this.onCountryClick=e}setData(e){var t;this.data=e,this.setCount(((t=e.countries)==null?void 0:t.length)??0),this.renderContent()}hasData(){return this.data!==null}renderContent(){var v;if(!this.data)return;const e=this.data.globalTotals,s=[{label:i("components.displacement.refugees"),value:U(e.refugees),cls:"disp-stat-refugees"},{label:i("components.displacement.asylumSeekers"),value:U(e.asylumSeekers),cls:"disp-stat-asylum"},{label:i("components.displacement.idps"),value:U(e.idps),cls:"disp-stat-idps"},{label:i("components.displacement.total"),value:U(e.total),cls:"disp-stat-total"}].map(l=>`<div class="disp-stat-box ${l.cls}">
        <span class="disp-stat-value">${l.value}</span>
        <span class="disp-stat-label">${l.label}</span>
      </div>`).join(""),a=`
      <div class="panel-tabs" role="tablist" aria-label="Displacement data view">
        <button class="panel-tab ${this.activeTab==="origins"?"active":""}" data-tab="origins" role="tab" aria-selected="${this.activeTab==="origins"}" id="disp-tab-origins" aria-controls="disp-tab-panel">${i("components.displacement.origins")}</button>
        <button class="panel-tab ${this.activeTab==="hosts"?"active":""}" data-tab="hosts" role="tab" aria-selected="${this.activeTab==="hosts"}" id="disp-tab-hosts" aria-controls="disp-tab-panel">${i("components.displacement.hosts")}</button>
      </div>
    `;let n;this.activeTab==="origins"?n=[...this.data.countries].filter(l=>l.refugees+l.asylumSeekers>0).sort((l,g)=>g.refugees+g.asylumSeekers-(l.refugees+l.asylumSeekers)):n=[...this.data.countries].filter(l=>(l.hostTotal||0)>0).sort((l,g)=>(g.hostTotal||0)-(l.hostTotal||0));const o=((v=this.followedOnlyChip)==null?void 0:v.isActive())===!0;o&&(n=n.filter(l=>{const g=ye(l.code??"");return g?be(g):!1}));const c=n.slice(0,30);let m;if(c.length===0){const l=o?"No items in your followed countries. Add countries by tapping the star, or turn off this filter.":i("common.noDataShort");m=`<div class="panel-empty">${r(l)}</div>`}else{const l=c.map(g=>{const $=g.hostTotal||0,f=this.activeTab==="origins"?g.refugees+g.asylumSeekers:$,y=this.activeTab==="origins"?g.totalDisplaced:$,C=y>=1e6?"disp-crisis":y>=5e5?"disp-high":y>=1e5?"disp-elevated":"",x=y>=1e6?i("components.displacement.badges.crisis"):y>=5e5?i("components.displacement.badges.high"):y>=1e5?i("components.displacement.badges.elevated"):"",b=x?`<span class="disp-badge ${C}">${x}</span>`:"";return`<tr class="disp-row" data-lat="${g.lat||""}" data-lon="${g.lon||""}">
          <td class="disp-name">${r(g.name)}</td>
          <td class="disp-status">${b}</td>
          <td class="disp-count">${U(f)}</td>
        </tr>`}).join("");m=`
        <table class="disp-table">
          <thead>
            <tr>
              <th>${i("components.displacement.country")}</th>
              <th>${i("components.displacement.status")}</th>
              <th>${i("components.displacement.count")}</th>
            </tr>
          </thead>
          <tbody>${l}</tbody>
        </table>`}this.setSafeContent(w(`
      <div class="disp-panel-content">
        <div class="disp-stats-grid">${s}</div>
        ${a}
        <div id="disp-tab-panel" role="tabpanel" aria-labelledby="disp-tab-${this.activeTab}">
          ${m}
        </div>
      </div>
    `,"legacy Panel.setContent() migration"))}destroy(){if(this.followedOnlyTeardown){try{this.followedOnlyTeardown()}catch{}this.followedOnlyTeardown=null}if(this.followedUnsub){try{this.followedUnsub()}catch{}this.followedUnsub=null}this.followedOnlyHost&&this.followedOnlyHost.parentElement&&this.followedOnlyHost.parentElement.removeChild(this.followedOnlyHost),this.followedOnlyHost=null,this.followedOnlyChip=null,super.destroy()}}const Cs=Object.freeze(Object.defineProperty({__proto__:null,DisplacementPanel:vt},Symbol.toStringTag,{value:"Module"}));class ft extends S{constructor(){super({id:"climate",title:i("panels.climate"),showCount:!0,trackActivity:!0,infoTooltip:i("components.climate.infoTooltip")});u(this,"anomalies",[]);u(this,"hasLoadedAnomalies",!1);u(this,"onZoneClick");this.showLoading(i("common.loadingClimateData"))}setZoneClickHandler(e){this.onZoneClick=e}setAnomalies(e){this.anomalies=e,this.hasLoadedAnomalies=!0,this.setCount(e.length),this.renderContent()}hasData(){return this.hasLoadedAnomalies}renderContent(){if(this.anomalies.length===0){this.setSafeContent(D`<div class="panel-empty">${i("components.climate.noAnomalies")}</div>`);return}const e=[...this.anomalies].sort((s,a)=>{const n={extreme:0,moderate:1,normal:2};return(n[s.severity]||2)-(n[a.severity]||2)}),t=ve(e.map(s=>{const a=Ie(s),n=s.tempDelta>0?"climate-warm":"climate-cold",o=s.precipDelta>0?"climate-wet":"climate-dry",c=`severity-${s.severity}`,m=s.severity==="extreme"?" climate-extreme-row":"";return D`<tr class="climate-row${m}" data-lat="${s.lat}" data-lon="${s.lon}">
        <td class="climate-zone"><span class="climate-icon">${a}</span>${s.zone}</td>
        <td class="climate-num ${n}">${ee(s.tempDelta,"°C")}</td>
        <td class="climate-num ${o}">${ee(s.precipDelta,"mm")}</td>
        <td><span class="climate-badge ${c}">${i(`components.climate.severity.${s.severity}`)}</span></td>
      </tr>`}));this.setSafeContent(D`
      <div class="climate-panel-content">
        <table class="climate-table">
          <thead>
            <tr>
              <th>${i("components.climate.zone")}</th>
              <th>${i("components.climate.temp")}</th>
              <th>${i("components.climate.precip")}</th>
              <th>${i("components.climate.severityLabel")}</th>
            </tr>
          </thead>
          <tbody>${t}</tbody>
        </table>
      </div>
    `),this.content.querySelectorAll(".climate-row").forEach(s=>{s.addEventListener("click",()=>{var o;const a=Number(s.dataset.lat),n=Number(s.dataset.lon);Number.isFinite(a)&&Number.isFinite(n)&&((o=this.onZoneClick)==null||o.call(this,a,n))})})}}const ws=Object.freeze(Object.defineProperty({__proto__:null,ClimateAnomalyPanel:ft},Symbol.toStringTag,{value:"Module"}));class yt extends S{constructor(){super({id:"population-exposure",title:i("panels.populationExposure"),showCount:!0,trackActivity:!0,infoTooltip:i("components.populationExposure.infoTooltip")});u(this,"exposures",[]);this.showLoading(i("common.calculatingExposure"))}setExposures(e){this.exposures=e,this.setCount(e.length),this.renderContent()}renderContent(){if(this.exposures.length===0){this.setSafeContent(D`<div class="panel-empty">${i("common.noDataAvailable")}</div>`);return}const e=this.exposures.reduce((s,a)=>s+a.exposedPopulation,0),t=ve(this.exposures.slice(0,30).map(s=>{const a=this.getTypeIcon(s.eventType),n=s.exposedPopulation>=1e6?" popexp-pop-large":"";return D`<div class="popexp-card">
        <div class="popexp-card-name">${a} ${s.eventName}</div>
        <div class="popexp-card-meta">
          <span class="popexp-card-pop${n}">${i("components.populationExposure.affectedCount",{count:te(s.exposedPopulation)})}</span>
          <span class="popexp-card-radius">${i("components.populationExposure.radiusKm",{km:String(s.exposureRadiusKm)})}</span>
        </div>
      </div>`}));this.setSafeContent(D`
      <div class="popexp-panel-content">
        <div class="popexp-summary">
          <span class="popexp-label">${i("components.populationExposure.totalAffected")}</span>
          <span class="popexp-total">${te(e)}</span>
        </div>
        <div class="popexp-list">${t}</div>
      </div>
    `)}getTypeIcon(e){switch(e){case"state-based":case"non-state":case"one-sided":case"conflict":case"battle":return"⚔️";case"earthquake":return"🌍";case"flood":return"🌊";case"fire":case"wildfire":return"🔥";default:return"📍"}}}const Ss=Object.freeze(Object.defineProperty({__proto__:null,PopulationExposurePanel:yt},Symbol.toStringTag,{value:"Module"}));class bt extends S{constructor(){super({id:"security-advisories",title:i("panels.securityAdvisories"),showCount:!0,trackActivity:!0,infoTooltip:i("components.securityAdvisories.infoTooltip"),defaultRowSpan:2});u(this,"advisories",[]);u(this,"activeFilter","all");u(this,"refreshInterval",null);u(this,"onRefreshRequest");this.showLoading(i("components.securityAdvisories.loading")),this.content.addEventListener("click",e=>{var a;const t=e.target,s=t.closest(".sa-filter");if(s){this.activeFilter=s.dataset.filter||"all",this.render();return}t.closest(".sa-refresh-btn")&&(this.showLoading(i("components.securityAdvisories.loading")),(a=this.onRefreshRequest)==null||a.call(this))})}setData(e){const t=this.advisories.length;this.advisories=e,this.setCount(e.length),t>0&&e.length>t&&this.setNewBadge(e.length-t),this.render()}getFiltered(){switch(this.activeFilter){case"critical":return this.advisories.filter(e=>e.level==="do-not-travel"||e.level==="reconsider");case"health":return this.advisories.filter(e=>e.sourceCountry==="EU"||e.sourceCountry==="INT");case"US":case"AU":case"UK":return this.advisories.filter(e=>e.sourceCountry===this.activeFilter);default:return this.advisories}}getLevelClass(e){switch(e){case"do-not-travel":return"sa-level-dnt";case"reconsider":return"sa-level-reconsider";case"caution":return"sa-level-caution";case"normal":return"sa-level-normal";default:return"sa-level-info"}}getLevelLabel(e){switch(e){case"do-not-travel":return i("components.securityAdvisories.levels.doNotTravel");case"reconsider":return i("components.securityAdvisories.levels.reconsider");case"caution":return i("components.securityAdvisories.levels.caution");case"normal":return i("components.securityAdvisories.levels.normal");default:return i("components.securityAdvisories.levels.info")}}getSourceFlag(e){switch(e){case"US":return"🇺🇸";case"AU":return"🇦🇺";case"UK":return"🇬🇧";case"EU":return"🇪🇺";case"INT":return"🏥";default:return"🌐"}}formatTime(e){const s=new Date().getTime()-e.getTime(),a=Math.floor(s/6e4),n=Math.floor(a/60),o=Math.floor(n/24);return a<1?i("components.securityAdvisories.time.justNow"):a<60?i("components.securityAdvisories.time.minutesAgo",{count:String(a)}):n<24?i("components.securityAdvisories.time.hoursAgo",{count:String(n)}):o<7?i("components.securityAdvisories.time.daysAgo",{count:String(o)}):e.toLocaleDateString()}render(){if(this.advisories.length===0){this.setSafeContent(w(`<div class="panel-empty">${i("common.noDataAvailable")}</div>`,"legacy Panel.setContent() migration"));return}const e=this.getFiltered(),t=this.advisories.filter(l=>l.level==="do-not-travel").length,s=this.advisories.filter(l=>l.level==="reconsider").length,a=this.advisories.filter(l=>l.level==="caution").length,n=`
      <div class="sa-summary">
        <div class="sa-summary-item sa-level-dnt">
          <span class="sa-summary-count">${t}</span>
          <span class="sa-summary-label">${i("components.securityAdvisories.levels.doNotTravel")}</span>
        </div>
        <div class="sa-summary-item sa-level-reconsider">
          <span class="sa-summary-count">${s}</span>
          <span class="sa-summary-label">${i("components.securityAdvisories.levels.reconsider")}</span>
        </div>
        <div class="sa-summary-item sa-level-caution">
          <span class="sa-summary-count">${a}</span>
          <span class="sa-summary-label">${i("components.securityAdvisories.levels.caution")}</span>
        </div>
      </div>
    `,o=`
      <div class="sa-filters">
        <button class="sa-filter ${this.activeFilter==="all"?"sa-filter-active":""}" data-filter="all">${i("common.all")}</button>
        <button class="sa-filter ${this.activeFilter==="critical"?"sa-filter-active":""}" data-filter="critical">${i("components.securityAdvisories.critical")}</button>
        <button class="sa-filter ${this.activeFilter==="US"?"sa-filter-active":""}" data-filter="US">🇺🇸 US</button>
        <button class="sa-filter ${this.activeFilter==="AU"?"sa-filter-active":""}" data-filter="AU">🇦🇺 AU</button>
        <button class="sa-filter ${this.activeFilter==="UK"?"sa-filter-active":""}" data-filter="UK">🇬🇧 UK</button>
        <button class="sa-filter ${this.activeFilter==="health"?"sa-filter-active":""}" data-filter="health">🏥 ${i("components.securityAdvisories.health")}</button>
      </div>
    `,c=e.slice(0,30);let m;c.length===0?m=`<div class="panel-empty">${i("components.securityAdvisories.noMatching")}</div>`:m=c.map(l=>{const g=this.getLevelClass(l.level),$=this.getLevelLabel(l.level),f=this.getSourceFlag(l.sourceCountry);return`<div class="sa-item ${g}">
          <div class="sa-item-header">
            <span class="sa-badge ${g}">${$}</span>
            <span class="sa-source">${f} ${r(l.source)}</span>
          </div>
          <div class="sa-body">
            <a href="${r(l.link)}" target="_blank" rel="noopener" class="sa-title">${r(l.title)}</a>
            <span class="sa-time">${this.formatTime(l.pubDate)}</span>
          </div>
        </div>`}).join("");const v=`
      <div class="sa-footer">
        <span class="sa-footer-source">${i("components.securityAdvisories.sources")}</span>
        <button class="sa-refresh-btn">${i("components.securityAdvisories.refresh")}</button>
      </div>
    `;this.setSafeContent(w(`
      <div class="sa-panel-content">
        ${n}
        ${o}
        <div class="sa-list">${m}</div>
        ${v}
      </div>
    `,"legacy Panel.setContent() migration"))}setRefreshHandler(e){this.onRefreshRequest=e}destroy(){this.refreshInterval&&clearInterval(this.refreshInterval),super.destroy()}}const xs=Object.freeze(Object.defineProperty({__proto__:null,SecurityAdvisoriesPanel:bt},Symbol.toStringTag,{value:"Module"}));class $t extends S{constructor(){super({id:"radiation-watch",title:i("components.radiationWatch.title"),showCount:!0,trackActivity:!0,infoTooltip:i("components.radiationWatch.infoTooltip")});u(this,"observations",[]);u(this,"fetchedAt",null);u(this,"summary",{anomalyCount:0,elevatedCount:0,spikeCount:0,corroboratedCount:0,lowConfidenceCount:0,conflictingCount:0,convertedFromCpmCount:0});u(this,"onLocationClick");this.showLoading(i("components.radiationWatch.loading")),this.content.addEventListener("click",e=>{var n;const t=e.target.closest(".radiation-row");if(!t)return;const s=Number(t.dataset.lat),a=Number(t.dataset.lon);Number.isFinite(s)&&Number.isFinite(a)&&((n=this.onLocationClick)==null||n.call(this,s,a))})}setLocationClickHandler(e){this.onLocationClick=e}setData(e){this.observations=e.observations,this.fetchedAt=e.fetchedAt,this.summary=e.summary,this.setCount(e.observations.length),this.render()}render(){if(this.observations.length===0){this.setSafeContent(w(`<div class="panel-empty">${r(i("components.radiationWatch.empty"))}</div>`,"legacy Panel.setContent() migration"));return}const e=this.observations.map(a=>{const n=wt(a.observedAt),o=he(a.value,a.unit),c=he(a.baselineValue,a.unit),m=Ct(a.delta,a.unit,a.zScore),v=St(a),l=xt(a.confidence),g=[`<span class="radiation-badge radiation-confidence radiation-confidence-${a.confidence}">${r(l)}</span>`,a.corroborated?`<span class="radiation-badge radiation-flag-confirmed">${r(i("components.radiationWatch.flags.confirmed"))}</span>`:"",a.conflictingSources?`<span class="radiation-badge radiation-flag-conflict">${r(i("components.radiationWatch.flags.conflict"))}</span>`:"",a.convertedFromCpm?`<span class="radiation-badge radiation-flag-converted">${r(i("components.radiationWatch.flags.cpmDerived"))}</span>`:"",`<span class="radiation-badge radiation-freshness radiation-freshness-${a.freshness}">${r(a.freshness)}</span>`].filter(Boolean).join("");return`
        <tr class="radiation-row" data-lat="${a.lat}" data-lon="${a.lon}">
          <td class="radiation-location">
            <div class="radiation-location-name">${r(a.location)}</div>
            <div class="radiation-location-meta">${r(v)} · ${r(i("components.radiationWatch.baseline",{value:c}))}</div>
            <div class="radiation-location-flags">${g}</div>
          </td>
          <td class="radiation-reading">${r(o)}</td>
          <td class="radiation-delta">${r(m)}</td>
          <td><span class="radiation-severity radiation-severity-${a.severity}">${r(a.severity)}</span></td>
          <td class="radiation-observed">${r(n)}</td>
        </tr>
      `}).join(""),t=`
      <div class="radiation-summary">
        <div class="radiation-summary-card">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.anomalies"))}</span>
          <span class="radiation-summary-value">${this.summary.anomalyCount}</span>
        </div>
        <div class="radiation-summary-card">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.elevated"))}</span>
          <span class="radiation-summary-value">${this.summary.elevatedCount}</span>
        </div>
        <div class="radiation-summary-card radiation-summary-card-confirmed">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.confirmed"))}</span>
          <span class="radiation-summary-value">${this.summary.corroboratedCount}</span>
        </div>
        <div class="radiation-summary-card radiation-summary-card-low-confidence">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.lowConfidence"))}</span>
          <span class="radiation-summary-value">${this.summary.lowConfidenceCount}</span>
        </div>
        <div class="radiation-summary-card radiation-summary-card-conflict">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.conflicts"))}</span>
          <span class="radiation-summary-value">${this.summary.conflictingCount}</span>
        </div>
        <div class="radiation-summary-card radiation-summary-card-spike">
          <span class="radiation-summary-label">${r(i("components.radiationWatch.summary.spikes"))}</span>
          <span class="radiation-summary-value">${this.summary.spikeCount}</span>
        </div>
      </div>
    `,s=this.fetchedAt?i("components.radiationWatch.footer.updated",{time:this.fetchedAt.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}):"";this.setSafeContent(w(`
      <div class="radiation-panel-content">
        ${t}
        <table class="radiation-table">
          <thead>
            <tr>
              <th>${r(i("components.radiationWatch.headers.station"))}</th>
              <th>${r(i("components.radiationWatch.headers.reading"))}</th>
              <th>${r(i("components.radiationWatch.headers.delta"))}</th>
              <th>${r(i("components.radiationWatch.headers.status"))}</th>
              <th>${r(i("components.radiationWatch.headers.observed"))}</th>
            </tr>
          </thead>
          <tbody>${e}</tbody>
        </table>
        <div class="radiation-footer">${r(s)}</div>
      </div>
    `,"legacy Panel.setContent() migration"))}}function he(d,p){const e=p==="nSv/h"?1:0;return`${d.toFixed(e)} ${p}`}function Ct(d,p,e){return`${d>0?"+":""}${d.toFixed(1)} ${p} · z${e.toFixed(1)}`}function wt(d){const p=Date.now()-d.getTime();if(p<1440*60*1e3){const t=Math.max(1,Math.floor(p/36e5));return i("components.radiationWatch.observed.hoursAgo",{count:t})}const e=Math.floor(p/(1440*60*1e3));return e<30?i("components.radiationWatch.observed.daysAgo",{count:e}):d.toISOString().slice(0,10)}function St(d){const p=[...new Set(d.contributingSources)];return p.length<=1?d.source:p.join(" + ")}function xt(d){switch(d){case"high":return i("components.radiationWatch.confidence.high");case"medium":return i("components.radiationWatch.confidence.medium");default:return i("components.radiationWatch.confidence.low")}}const ks=Object.freeze(Object.defineProperty({__proto__:null,RadiationWatchPanel:$t},Symbol.toStringTag,{value:"Module"})),Y=[{id:"new-york",city:"New York",label:"NYSE",timezone:"America/New_York",marketOpen:9,marketClose:16},{id:"chicago",city:"Chicago",label:"CME",timezone:"America/Chicago",marketOpen:8,marketClose:15},{id:"sao-paulo",city:"São Paulo",label:"B3",timezone:"America/Sao_Paulo",marketOpen:10,marketClose:17},{id:"london",city:"London",label:"LSE",timezone:"Europe/London",marketOpen:8,marketClose:16},{id:"paris",city:"Paris",label:"Euronext",timezone:"Europe/Paris",marketOpen:9,marketClose:17},{id:"frankfurt",city:"Frankfurt",label:"XETRA",timezone:"Europe/Berlin",marketOpen:9,marketClose:17},{id:"zurich",city:"Zurich",label:"SIX",timezone:"Europe/Zurich",marketOpen:9,marketClose:17},{id:"moscow",city:"Moscow",label:"MOEX",timezone:"Europe/Moscow",marketOpen:10,marketClose:18},{id:"istanbul",city:"Istanbul",label:"BIST",timezone:"Europe/Istanbul",marketOpen:10,marketClose:18},{id:"riyadh",city:"Riyadh",label:"Tadawul",timezone:"Asia/Riyadh",marketOpen:10,marketClose:15},{id:"dubai",city:"Dubai",label:"DFM",timezone:"Asia/Dubai",marketOpen:10,marketClose:14},{id:"mumbai",city:"Mumbai",label:"NSE",timezone:"Asia/Kolkata",marketOpen:9,marketClose:15},{id:"bangkok",city:"Bangkok",label:"SET",timezone:"Asia/Bangkok",marketOpen:10,marketClose:16},{id:"singapore",city:"Singapore",label:"SGX",timezone:"Asia/Singapore",marketOpen:9,marketClose:17},{id:"hong-kong",city:"Hong Kong",label:"HKEX",timezone:"Asia/Hong_Kong",marketOpen:9,marketClose:16},{id:"shanghai",city:"Shanghai",label:"SSE",timezone:"Asia/Shanghai",marketOpen:9,marketClose:15},{id:"seoul",city:"Seoul",label:"KRX",timezone:"Asia/Seoul",marketOpen:9,marketClose:15},{id:"tokyo",city:"Tokyo",label:"TSE",timezone:"Asia/Tokyo",marketOpen:9,marketClose:15},{id:"sydney",city:"Sydney",label:"ASX",timezone:"Australia/Sydney",marketOpen:10,marketClose:16},{id:"auckland",city:"Auckland",label:"NZX",timezone:"Pacific/Auckland",marketOpen:10,marketClose:16},{id:"toronto",city:"Toronto",label:"TSX",timezone:"America/Toronto",marketOpen:9,marketClose:16},{id:"mexico-city",city:"Mexico City",label:"BMV",timezone:"America/Mexico_City",marketOpen:8,marketClose:15},{id:"buenos-aires",city:"Buenos Aires",label:"BYMA",timezone:"America/Argentina/Buenos_Aires",marketOpen:11,marketClose:17},{id:"johannesburg",city:"Johannesburg",label:"JSE",timezone:"Africa/Johannesburg",marketOpen:9,marketClose:17},{id:"cairo",city:"Cairo",label:"EGX",timezone:"Africa/Cairo",marketOpen:10,marketClose:14},{id:"lagos",city:"Lagos",label:"NGX",timezone:"Africa/Lagos",marketOpen:10,marketClose:14},{id:"los-angeles",city:"Los Angeles",label:"Pacific",timezone:"America/Los_Angeles"},{id:"jakarta",city:"Jakarta",label:"IDX",timezone:"Asia/Jakarta",marketOpen:9,marketClose:16},{id:"taipei",city:"Taipei",label:"TWSE",timezone:"Asia/Taipei",marketOpen:9,marketClose:13},{id:"kuala-lumpur",city:"Kuala Lumpur",label:"Bursa",timezone:"Asia/Kuala_Lumpur",marketOpen:9,marketClose:17}],kt=[{name:"Americas",ids:["new-york","chicago","toronto","los-angeles","mexico-city","sao-paulo","buenos-aires"]},{name:"Europe",ids:["london","paris","frankfurt","zurich","moscow","istanbul"]},{name:"Middle East & Africa",ids:["riyadh","dubai","cairo","lagos","johannesburg"]},{name:"Asia-Pacific",ids:["mumbai","bangkok","jakarta","kuala-lumpur","singapore","hong-kong","shanghai","taipei","seoul","tokyo","sydney","auckland"]}],E={};for(const d of Y)E[d.timezone]=d.id;E["America/Detroit"]="new-york";E["US/Eastern"]="new-york";E["US/Central"]="chicago";E["US/Pacific"]="los-angeles";E["US/Mountain"]="new-york";E["Asia/Calcutta"]="mumbai";E["Asia/Saigon"]="bangkok";E["Pacific/Sydney"]="sydney";const Se="worldmonitor-world-clock-cities",Tt=["new-york","london","dubai","bangkok","tokyo","sydney"];function xe(){try{const d=Intl.DateTimeFormat().resolvedOptions().timeZone;return E[d]??null}catch{return null}}function Et(){try{const e=localStorage.getItem(Se);if(e){const t=JSON.parse(e);if(Array.isArray(t)&&t.length>0)return t}}catch{}const d=xe(),p=[...Tt];return d&&!p.includes(d)&&p.unshift(d),p}function ue(d){localStorage.setItem(Se,JSON.stringify(d))}function At(d){try{const p=new Date,e=new Intl.DateTimeFormat(Z(),{timeZone:d,hour:"numeric",minute:"numeric",second:"numeric",hour12:!1,weekday:"short",numberingSystem:"latn"}).formatToParts(p);let t=0,s=0,a=0,n="";for(const o of e)o.type==="hour"&&(t=parseInt(o.value,10)),o.type==="minute"&&(s=parseInt(o.value,10)),o.type==="second"&&(a=parseInt(o.value,10)),o.type==="weekday"&&(n=o.value);return t===24&&(t=0),{h:t,m:s,s:a,dayOfWeek:n}}catch{return{h:0,m:0,s:0,dayOfWeek:""}}}function Lt(d){try{const t=new Intl.DateTimeFormat(Z(),{timeZone:d,timeZoneName:"short"}).formatToParts(new Date).find(s=>s.type==="timeZoneName");return(t==null?void 0:t.value)??""}catch{return""}}function V(d){return d<10?`0${d}`:`${d}`}class Ot extends S{constructor(){super({id:"world-clock",title:"World Clock",trackActivity:!1,infoTooltip:i("components.worldClock.infoTooltip")});u(this,"tickInterval",null);u(this,"selectedCities",[]);u(this,"homeCityId",null);u(this,"showingSettings",!1);u(this,"settingsBtn");u(this,"dragging",!1);u(this,"dragCityId",null);u(this,"dragStartY",0);this.homeCityId=xe(),this.selectedCities=Et(),this.settingsBtn=document.createElement("button"),this.settingsBtn.className="wc-settings-btn",this.settingsBtn.textContent="⚙",this.settingsBtn.title="Select cities",this.settingsBtn.addEventListener("click",e=>{e.stopPropagation(),this.toggleSettings()}),this.header.appendChild(this.settingsBtn),this.content.addEventListener("change",e=>{const t=e.target;if(t.type==="checkbox"&&t.dataset.cityId){const s=t.dataset.cityId;t.checked?this.selectedCities.includes(s)||this.selectedCities.push(s):this.selectedCities=this.selectedCities.filter(a=>a!==s),ue(this.selectedCities)}}),this.setupDragHandlers(),this.renderClocks(),this.tickInterval=setInterval(()=>{!this.showingSettings&&!this.dragging&&this.renderClocks()},1e3)}toggleSettings(){this.showingSettings=!this.showingSettings,this.showingSettings?(this.settingsBtn.textContent="✓",this.settingsBtn.title="Done",this.settingsBtn.classList.add("wc-active"),this.renderSettings()):(this.settingsBtn.textContent="⚙",this.settingsBtn.title="Select cities",this.settingsBtn.classList.remove("wc-active"),this.renderClocks())}renderSettings(){let e='<div class="wc-settings-view">';for(const t of kt){e+=`<div class="wc-region-header">${t.name}</div><div class="wc-region-grid">`;for(const s of t.ids){const a=Y.find(o=>o.id===s);if(!a)continue;const n=this.selectedCities.includes(a.id)?"checked":"";e+=`<label class="wc-city-option"><input type="checkbox" data-city-id="${a.id}" ${n}><span class="wc-opt-name">${a.city}</span><span class="wc-opt-label">${a.label}</span></label>`}e+="</div>"}e+="</div>",this.setSafeContent(w(e,"legacy Panel.setContent() migration"))}setupDragHandlers(){const e=this.content;e.addEventListener("mousedown",t=>{const s=t.target.closest(".wc-drag-handle");if(!s)return;const a=s.closest(".wc-row");a&&(t.preventDefault(),t.stopPropagation(),this.dragCityId=a.dataset.cityId??null,this.dragStartY=t.clientY,this.dragging=!1,a.classList.add("wc-dragging"),e.classList.add("wc-content-dragging"))}),document.addEventListener("mousemove",t=>{if(!this.dragCityId||!this.dragging&&Math.abs(t.clientY-this.dragStartY)<8)return;this.dragging=!0,t.preventDefault();const s=e.querySelectorAll(".wc-row[data-city-id]");s.forEach(a=>a.classList.remove("wc-drag-over-above","wc-drag-over-below"));for(const a of s){if(a.dataset.cityId===this.dragCityId)continue;const n=a.getBoundingClientRect();t.clientY>=n.top&&t.clientY<=n.bottom&&a.classList.add(t.clientY<n.top+n.height/2?"wc-drag-over-above":"wc-drag-over-below")}}),document.addEventListener("mouseup",t=>{if(!this.dragCityId)return;const s=this.dragCityId;this.dragCityId=null;const a=e.querySelectorAll(".wc-row[data-city-id]");if(a.forEach(n=>n.classList.remove("wc-dragging","wc-drag-over-above","wc-drag-over-below")),e.classList.remove("wc-content-dragging"),this.dragging){let n=null,o=!0;for(const c of a){const m=c;if(m.dataset.cityId===s)continue;const v=m.getBoundingClientRect();if(t.clientY>=v.top&&t.clientY<=v.bottom){n=m.dataset.cityId??null,o=t.clientY<v.top+v.height/2;break}}if(n&&n!==s){const c=this.selectedCities.indexOf(s);if(c!==-1){this.selectedCities.splice(c,1);let m=this.selectedCities.indexOf(n);o||m++,this.selectedCities.splice(m,0,s),ue(this.selectedCities)}}}this.dragging=!1,this.renderClocks()})}renderClocks(){const e=this.selectedCities.map(s=>Y.find(a=>a.id===s)).filter(s=>!!s);if(e.length===0){this.setSafeContent(w('<div class="wc-empty">No cities selected. Click ⚙ to add cities.</div>',"legacy Panel.setContent() migration"));return}let t='<div class="wc-container" translate="no">';for(const s of e){const{h:a,m:n,s:o,dayOfWeek:c}=At(s.timezone),m=a>=6&&a<20,v=(a*3600+n*60+o)/86400*100,l=Lt(s.timezone),g=s.id===this.homeCityId,$=c!=="Sat"&&c!=="Sun";let f="";s.marketOpen!==void 0&&s.marketClose!==void 0&&(f=$&&a>=s.marketOpen&&a<s.marketClose?'<span class="wc-status open"><span class="wc-dot open"></span>OPEN</span>':'<span class="wc-status closed"><span class="wc-dot closed"></span>CLSD</span>');const y=["wc-row"];g&&y.push("wc-home"),m||y.push("wc-night"),t+=`<div class="${y.join(" ")}" data-city-id="${s.id}"><div class="wc-drag-handle" title="Drag to reorder">⋮</div><div class="wc-info"><div class="wc-name">${s.city}${g?'<span class="wc-home-tag">⌂</span>':""}</div><div class="wc-detail"><span class="wc-exchange">${s.label}</span>${f}</div></div><div class="wc-clock"><div class="wc-time">${V(a)}:${V(n)}:${V(o)}</div><div class="wc-tz"><div class="wc-bar-wrap"><div class="wc-bar ${m?"day":"night"}" style="width:${v.toFixed(1)}%"></div></div><span>${c} ${l}</span></div></div></div>`}t+="</div>",this.setSafeContent(w(t,"legacy Panel.setContent() migration"))}destroy(){this.tickInterval&&(clearInterval(this.tickInterval),this.tickInterval=null),super.destroy()}}const Ts=Object.freeze(Object.defineProperty({__proto__:null,WorldClockPanel:Ot},Symbol.toStringTag,{value:"Module"})),_t=je(()=>new Be(Ke(),{fetch:We}));class Nt extends S{constructor(e,t){super({id:e,title:i("panels.events"),showCount:!0,infoTooltip:i("components.techEvents.infoTooltip")});u(this,"viewMode","upcoming");u(this,"events",[]);u(this,"loading",!0);u(this,"error",null);this.getLatestNews=t,this.element.classList.add("panel-tall"),this.fetchEvents()}async fetchEvents(){var t,s,a;this.loading=!0,this.error=null,this.render();const e=He("techEvents");if((t=e==null?void 0:e.events)!=null&&t.length){this.events=e.events,this.setCount(e.conferenceCount||e.events.filter(n=>n.type==="conference").length),this.loading=!1,this.render();return}try{const n=await _t().listTechEvents({type:"",mappable:!1,days:180,limit:100});if(!((s=this.element)!=null&&s.isConnected))return;if(!n.success)throw new Error(n.error||"Unknown error");this.events=n.events,this.setCount(n.conferenceCount),this.error=null}catch(n){if(this.isAbortError(n)||!((a=this.element)!=null&&a.isConnected))return;this.error=i("common.failedToLoad"),console.error("[TechEvents] Fetch error:",n)}this.loading=!1,this.render()}render(){if(this.loading){I(this.content,h("div",{className:"tech-events-loading"},h("div",{className:"loading-spinner"}),h("span",null,i("components.techEvents.loading"))));return}if(this.error){this.showError(this.error,()=>this.refresh());return}this.setErrorState(!1);const e=this.getFilteredEvents(),t=this.events.filter(n=>n.type==="conference"&&new Date(n.startDate)>=new Date),s=t.filter(n=>n.coords&&!n.coords.virtual).length,a=[["upcoming",i("components.techEvents.upcoming")],["conferences",i("components.techEvents.conferences")],["earnings",i("components.techEvents.earnings")],["all",i("components.techEvents.all")]];I(this.content,h("div",{className:"tech-events-panel"},h("div",{className:"panel-tabs"},...a.map(([n,o])=>h("button",{className:`panel-tab ${this.viewMode===n?"active":""}`,dataset:{view:n},onClick:()=>{this.viewMode=n,this.render()}},o))),h("div",{className:"tech-events-stats"},h("span",{className:"stat"},`📅 ${i("components.techEvents.conferencesCount",{count:String(t.length)})}`),h("span",{className:"stat"},`📍 ${i("components.techEvents.onMap",{count:String(s)})}`),h("a",{href:"https://www.techmeme.com/events",target:"_blank",rel:"noopener",className:"source-link"},i("components.techEvents.techmemeEvents"))),h("div",{className:"tech-events-list"},...e.length>0?e.map(n=>this.buildEvent(n)):[h("div",{className:"empty-state"},i("components.techEvents.noEvents"))])))}getFilteredEvents(){const e=new Date,t=new Date(e.getTime()+720*60*60*1e3);switch(this.viewMode){case"upcoming":return this.events.filter(s=>{const a=new Date(s.startDate);return a>=e&&a<=t}).slice(0,20);case"conferences":return this.events.filter(s=>s.type==="conference"&&new Date(s.startDate)>=e).slice(0,30);case"earnings":return this.events.filter(s=>s.type==="earnings"&&new Date(s.startDate)>=e).slice(0,30);case"all":return this.events.filter(s=>new Date(s.startDate)>=e).slice(0,50);default:return[]}}buildEvent(e){const t=new Date(e.startDate),s=new Date(e.endDate),a=new Date,n=t.toDateString()===a.toDateString(),o=!n&&t<=new Date(a.getTime()+2880*60*1e3),c=t<=new Date(a.getTime()+10080*60*1e3),m=t.toLocaleDateString("en-US",{month:"short",day:"numeric"}),v=s>t&&s.toDateString()!==t.toDateString()?` - ${s.toLocaleDateString("en-US",{month:"short",day:"numeric"})}`:"",l={conference:"🎤",earnings:"📊",ipo:"🔔",other:"📌"},$=["tech-event",{conference:"type-conference",earnings:"type-earnings",ipo:"type-ipo",other:"type-other"}[e.type],n?"is-today":"",o?"is-soon":"",c?"is-this-week":""].filter(Boolean).join(" "),f=M(e.url||"");return h("div",{className:$},h("div",{className:"event-date"},h("span",{className:"event-month"},t.toLocaleDateString("en-US",{month:"short"}).toUpperCase()),h("span",{className:"event-day"},String(t.getDate())),n?h("span",{className:"today-badge"},i("components.techEvents.today")):!1,o?h("span",{className:"soon-badge"},i("components.techEvents.soon")):!1),h("div",{className:"event-content"},h("div",{className:"event-header"},h("span",{className:"event-icon"},l[e.type]??"📌"),h("span",{className:"event-title"},e.title),f?h("a",{href:f,target:"_blank",rel:"noopener",className:"event-url",title:i("components.techEvents.moreInfo")},"↗"):!1),h("div",{className:"event-meta"},h("span",{className:"event-dates"},`${m}${v}`),e.location?h("span",{className:"event-location"},e.location):!1,k()?h("button",{className:"event-deduce-link",title:"Deduce Situation with AI",style:"background: none; border: none; cursor: pointer; opacity: 0.7; font-size: 1.1em; transition: opacity 0.2s; margin-left: auto; padding-right: 4px;",onClick:y=>{y.preventDefault(),y.stopPropagation();let C=`Event details: ${e.title} (${e.type}) taking place from ${m}${v}. Location: ${e.location||"Unknown/Virtual"}.`;if(this.getLatestNews){const b=Ge(this.getLatestNews);b&&(C+=`

${b}`)}const x={query:`What is the expected impact of the tech event: ${e.title}?`,geoContext:C,autoSubmit:!0};document.dispatchEvent(new CustomEvent("wm:deduct-context",{detail:x}))}},"🧠"):!1,e.coords&&!e.coords.virtual?h("button",{className:"event-map-link",title:i("components.techEvents.showOnMap"),onClick:y=>{y.preventDefault(),this.panToLocation(e.coords.lat,e.coords.lng)}},"📍"):!1)))}panToLocation(e,t){window.dispatchEvent(new CustomEvent("tech-event-location",{detail:{lat:e,lng:t,zoom:10}}))}refresh(){this.fetchEvents()}getConferencesForMap(){return this.events.filter(e=>e.type==="conference"&&e.coords&&!e.coords.virtual&&new Date(e.startDate)>=new Date)}}const Es=Object.freeze(Object.defineProperty({__proto__:null,TechEventsPanel:Nt},Symbol.toStringTag,{value:"Module"}));class Dt extends S{constructor(){super({id:"internet-disruptions",title:i("panels.internetDisruptions"),showCount:!0,trackActivity:!0,defaultRowSpan:2,infoTooltip:i("components.internetDisruptions.infoTooltip")});u(this,"tab","outages");u(this,"outages",[]);u(this,"ddos",null);u(this,"anomalies",[]);this.content.addEventListener("click",e=>{const t=e.target.closest("[data-tab]");t!=null&&t.dataset.tab&&(this.tab=t.dataset.tab,this.render())}),this.showLoading()}setOutages(e){this.outages=e,this.updateCount(),this.render()}setDdos(e){this.ddos=e,this.render()}setAnomalies(e){this.anomalies=e,this.updateCount(),this.render()}updateCount(){this.setCount(this.outages.length+this.anomalies.length)}render(){const e=this.buildTabs(),t=this.tab==="outages"?this.buildOutages():this.tab==="ddos"?this.buildDdos():this.buildAnomalies();I(this.content,e,t)}buildTabs(){const e={outages:this.outages.length,ddos:this.ddos?this.ddos.protocol.length+this.ddos.vector.length:0,anomalies:this.anomalies.length},t={outages:i("panels.internetDisruptionsTabs.outages"),ddos:i("panels.internetDisruptionsTabs.ddos"),anomalies:i("panels.internetDisruptionsTabs.anomalies")};return h("div",{className:"id-tabs"},...["outages","ddos","anomalies"].map(s=>h("button",{className:`id-tab-btn${this.tab===s?" active":""}`,dataset:{tab:s}},t[s],e[s]>0?h("span",{className:"id-tab-count"},String(e[s])):!1)))}buildOutages(){if(!this.outages.length)return h("div",{className:"id-empty"},i("components.internetDisruptions.noOutages"));const e=[...this.outages].sort((t,s)=>{const a={total:0,major:1,partial:2};return(a[t.severity]??3)-(a[s.severity]??3)});return h("div",{className:"id-list"},...e.map(t=>this.buildOutageRow(t)))}buildOutageRow(e){const t=e.severity==="total"?"#ff2020":e.severity==="major"?"#ff8800":"#ffcc00",s=e.severity==="total"?"NATIONWIDE":e.severity==="major"?"REGIONAL":"PARTIAL",a=!e.endDate;return h("div",{className:"id-row"},h("div",{className:"id-row-header"},h("span",{className:"id-severity-dot",style:{color:t}},"●"),h("span",{className:"id-row-title"},e.country),h("span",{className:`id-badge severity-${e.severity}`},s),a?h("span",{className:"id-badge ongoing"},"⚡ LIVE"):!1),h("div",{className:"id-row-sub"},e.title),e.cause?h("div",{className:"id-row-meta"},e.cause.replace(/_/g," ")):!1)}buildDdos(){if(!this.ddos||!this.ddos.protocol.length&&!this.ddos.vector.length)return h("div",{className:"id-empty"},i("components.internetDisruptions.noDdos"));const e=this.ddos,t=e.dateRangeStart?`${this.formatDate(e.dateRangeStart)} – ${this.formatDate(e.dateRangeEnd)}`:"";return h("div",{className:"id-ddos"},t?h("div",{className:"id-date-range"},t):!1,e.protocol.length>0?h("div",{className:"id-section"},h("div",{className:"id-section-title"},i("components.internetDisruptions.byProtocol")),...e.protocol.slice(0,6).map(s=>this.buildBar(s.label,s.percentage,"#b400ff"))):!1,e.vector.length>0?h("div",{className:"id-section"},h("div",{className:"id-section-title"},i("components.internetDisruptions.byVector")),...e.vector.slice(0,6).map(s=>this.buildBar(s.label,s.percentage,"#ff4400"))):!1,e.topTargetLocations.length>0?h("div",{className:"id-section"},h("div",{className:"id-section-title"},i("components.internetDisruptions.topTargets")),...e.topTargetLocations.slice(0,8).map(s=>this.buildBar(s.countryName||s.countryCode,s.percentage,"#cc0044"))):!1)}buildBar(e,t,s){return h("div",{className:"id-bar-row"},h("span",{className:"id-bar-label"},e),h("div",{className:"id-bar-track"},h("div",{className:"id-bar-fill",style:{width:`${Math.min(t,100)}%`,background:s}})),h("span",{className:"id-bar-pct"},`${t.toFixed(1)}%`))}buildAnomalies(){if(!this.anomalies.length)return h("div",{className:"id-empty"},i("components.internetDisruptions.noAnomalies"));const e=[...this.anomalies].sort((t,s)=>t.status==="ONGOING"&&s.status!=="ONGOING"?-1:s.status==="ONGOING"&&t.status!=="ONGOING"?1:(s.startDate??0)-(t.startDate??0));return h("div",{className:"id-list"},...e.map(t=>this.buildAnomalyRow(t)))}buildAnomalyRow(e){const t=e.status==="ONGOING",s=e.type.replace(/^ANOMALY_/,""),a=e.locationName||e.locationCode||"",n=e.asnName?`AS${e.asn} ${e.asnName}`:"";return h("div",{className:"id-row"},h("div",{className:"id-row-header"},h("span",{className:"id-anomaly-type"},s),a?h("span",{className:"id-row-title"},a):!1,t?h("span",{className:"id-badge ongoing"},"⚡ ONGOING"):h("span",{className:"id-badge historical"},"HISTORICAL")),n?h("div",{className:"id-row-meta"},n):!1,e.startDate?h("div",{className:"id-row-meta"},this.formatEpoch(e.startDate)):!1)}formatDate(e){try{return new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return e}}formatEpoch(e){try{return new Date(e).toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}}const As=Object.freeze(Object.defineProperty({__proto__:null,InternetDisruptionsPanel:Dt},Symbol.toStringTag,{value:"Module"}));function It(d){return{all:i("components.serviceStatus.categories.all"),cloud:i("components.serviceStatus.categories.cloud"),dev:i("components.serviceStatus.categories.dev"),comm:i("components.serviceStatus.categories.comm"),ai:i("components.serviceStatus.categories.ai"),saas:i("components.serviceStatus.categories.saas")}[d]}class Mt extends S{constructor(){super({id:"service-status",title:i("panels.serviceStatus"),showCount:!1,infoTooltip:i("components.serviceStatus.infoTooltip")});u(this,"services",[]);u(this,"loading",!0);u(this,"error",null);u(this,"filter","all");u(this,"lastServicesJson","")}async fetchStatus(){var e,t,s;try{const a=await Me();if(!((e=this.element)!=null&&e.isConnected))return!1;if(!a.success)throw new Error("Failed to load status");const n=a.services.map(c=>`${c.name}:${c.status}`).join(","),o=n!==this.lastServicesJson;return this.lastServicesJson=n,this.services=a.services,this.error=null,o}catch(a){return this.isAbortError(a)||!((t=this.element)!=null&&t.isConnected)?!1:(this.error=i("common.failedToLoad"),console.error("[ServiceStatus] Fetch error:",a),!0)}finally{this.loading=!1,(s=this.element)!=null&&s.isConnected&&this.render()}}setFilter(e){this.filter=e,this.render()}getFilteredServices(){return this.filter==="all"?this.services:this.services.filter(e=>e.category===this.filter)}render(){if(this.loading){I(this.content,h("div",{className:"service-status-loading"},h("div",{className:"loading-spinner"}),h("span",null,i("components.serviceStatus.checkingServices"))));return}if(this.error){this.showError(this.error,()=>{this.loading=!0,this.render(),this.fetchStatus()});return}this.setErrorState(!1);const e=this.getFilteredServices(),t=e.filter(s=>s.status!=="operational");I(this.content,this.buildSummary(e),this.buildFilters(),h("div",{className:"service-status-list"},...this.buildServiceItems(e)),t.length===0?h("div",{className:"all-operational"},i("components.serviceStatus.allOperational")):!1)}buildSummary(e){const t=e.filter(n=>n.status==="operational").length,s=e.filter(n=>n.status==="degraded").length,a=e.filter(n=>n.status==="outage").length;return h("div",{className:"service-status-summary"},h("div",{className:"summary-item operational"},h("span",{className:"summary-count"},String(t)),h("span",{className:"summary-label"},i("components.serviceStatus.ok"))),h("div",{className:"summary-item degraded"},h("span",{className:"summary-count"},String(s)),h("span",{className:"summary-label"},i("components.serviceStatus.degraded"))),h("div",{className:"summary-item outage"},h("span",{className:"summary-count"},String(a)),h("span",{className:"summary-label"},i("components.serviceStatus.outage"))))}buildFilters(){return h("div",{className:"service-status-filters"},...["all","cloud","dev","comm","ai","saas"].map(t=>h("button",{className:`status-filter-btn ${this.filter===t?"active":""}`,dataset:{filter:t},onClick:()=>this.setFilter(t)},It(t))))}buildServiceItems(e){return e.map(t=>h("div",{className:`service-status-item ${t.status}`},h("span",{className:"status-icon"},this.getStatusIcon(t.status)),h("span",{className:"status-name"},t.name),h("span",{className:`status-badge ${t.status}`},t.status.toUpperCase())))}getStatusIcon(e){switch(e){case"operational":return"●";case"degraded":return"◐";case"outage":return"○";default:return"?"}}}const Ls=Object.freeze(Object.defineProperty({__proto__:null,ServiceStatusPanel:Mt},Symbol.toStringTag,{value:"Module"})),Ft={USA:"🇺🇸",CHN:"🇨🇳",JPN:"🇯🇵",DEU:"🇩🇪",KOR:"🇰🇷",GBR:"🇬🇧",IND:"🇮🇳",ISR:"🇮🇱",SGP:"🇸🇬",TWN:"🇹🇼",FRA:"🇫🇷",CAN:"🇨🇦",SWE:"🇸🇪",NLD:"🇳🇱",CHE:"🇨🇭",FIN:"🇫🇮",IRL:"🇮🇪",AUS:"🇦🇺",BRA:"🇧🇷",IDN:"🇮🇩",ESP:"🇪🇸",ITA:"🇮🇹",MEX:"🇲🇽",RUS:"🇷🇺",TUR:"🇹🇷",SAU:"🇸🇦",ARE:"🇦🇪",POL:"🇵🇱",THA:"🇹🇭",MYS:"🇲🇾",VNM:"🇻🇳",PHL:"🇵🇭",NZL:"🇳🇿",AUT:"🇦🇹",BEL:"🇧🇪",DNK:"🇩🇰",NOR:"🇳🇴",PRT:"🇵🇹",CZE:"🇨🇿",ZAF:"🇿🇦",NGA:"🇳🇬",KEN:"🇰🇪",EGY:"🇪🇬",ARG:"🇦🇷",CHL:"🇨🇱",COL:"🇨🇴",PAK:"🇵🇰",BGD:"🇧🇩",UKR:"🇺🇦",ROU:"🇷🇴",EST:"🇪🇪",LVA:"🇱🇻",LTU:"🇱🇹",HUN:"🇭🇺",GRC:"🇬🇷",QAT:"🇶🇦",BHR:"🇧🇭",KWT:"🇰🇼",OMN:"🇴🇲",JOR:"🇯🇴"};class Rt extends S{constructor(){super({id:"tech-readiness",title:i("panels.techReadiness"),showCount:!0,infoTooltip:i("components.techReadiness.infoTooltip")});u(this,"rankings",[]);u(this,"loading",!1);u(this,"lastFetch",0);u(this,"REFRESH_INTERVAL",360*60*1e3);u(this,"retryTimer",null);u(this,"localRetryAttempt",0);u(this,"MAX_RETRY_ATTEMPTS",5);u(this,"RETRY_DELAYS_MS",[3e4,6e4,12e4,24e4,3e5]);this.hideCountBadge()}async refresh(e=!1){var t,s;if(!this.loading&&!(Date.now()-this.lastFetch<this.REFRESH_INTERVAL&&this.rankings.length>0)){if(!this.element.isConnected){this.runWhenConnected(()=>{this.refresh(e)});return}e||(this.localRetryAttempt=0),this.loading=!0,this.clearRetryTimer(),this.showFetchingState();try{const a=await Fe();if(!((t=this.element)!=null&&t.isConnected))return;if(this.rankings=a,a.length===0){this.showSoftRefreshing(),this.scheduleRetry();return}this.lastFetch=Date.now(),this.localRetryAttempt=0,this.render()}catch(a){if(!((s=this.element)!=null&&s.isConnected))return;console.error("[TechReadinessPanel] Error fetching data:",a);const n=this.nextRetryDelayMs();if(n===null){this.renderTerminalError();return}this.showError(i("common.failedTechReadiness"),()=>void this.refresh(!0),Math.round(n/1e3))}finally{this.loading=!1}}}destroy(){this.clearRetryTimer(),super.destroy()}clearRetryTimer(){this.retryTimer&&(clearTimeout(this.retryTimer),this.retryTimer=null)}hideCountBadge(){this.countEl&&(this.countEl.style.display="none")}showCountBadge(e){this.setCount(e),this.countEl&&(this.countEl.style.display="")}nextRetryDelayMs(){if(this.localRetryAttempt>=this.MAX_RETRY_ATTEMPTS)return null;const e=this.RETRY_DELAYS_MS[this.localRetryAttempt]??3e5;return this.localRetryAttempt+=1,e}scheduleRetry(){const e=this.nextRetryDelayMs();e!==null&&(this.retryTimer=setTimeout(()=>{this.retryTimer=null,this.refresh(!0)},e))}renderTerminalError(){this.hideCountBadge(),this.setSafeContent(w(`
      <div class="panel-error-state" style="padding:24px 16px;text-align:center">
        <div class="panel-error-msg" style="color:var(--danger,#e0654b);font-size:13px">
          ${r(i("common.failedTechReadiness"))}
        </div>
      </div>
    `,"legacy Panel.setContent() migration")),this.setErrorState(!0)}showSoftRefreshing(){this.hideCountBadge(),this.setSafeContent(w(`
      <div class="panel-soft-empty" style="padding:24px 16px;color:var(--text-dim);font-size:12px;text-align:center;line-height:1.5">
        <div style="font-size:20px;margin-bottom:8px">⌛</div>
        <div>${r(i("components.techReadiness.dataPreparing"))}</div>
      </div>
    `,"legacy Panel.setContent() migration"))}showFetchingState(){this.setSafeContent(w(`
      <div class="tech-fetch-progress">
        <div class="tech-fetch-icon">
          <div class="tech-globe-ring"></div>
          <span class="tech-globe">🌐</span>
        </div>
        <div class="tech-fetch-title">${i("components.techReadiness.fetchingData")}</div>
        <div class="tech-fetch-indicators">
          <div class="tech-indicator-item" style="animation-delay: 0s">
            <span class="tech-indicator-icon">🌐</span>
            <span class="tech-indicator-name">${i("components.techReadiness.internetUsersIndicator")}</span>
            <span class="tech-indicator-status"></span>
          </div>
          <div class="tech-indicator-item" style="animation-delay: 0.2s">
            <span class="tech-indicator-icon">📱</span>
            <span class="tech-indicator-name">${i("components.techReadiness.mobileSubscriptionsIndicator")}</span>
            <span class="tech-indicator-status"></span>
          </div>
          <div class="tech-indicator-item" style="animation-delay: 0.4s">
            <span class="tech-indicator-icon">📡</span>
            <span class="tech-indicator-name">${i("components.techReadiness.broadbandAccess")}</span>
            <span class="tech-indicator-status"></span>
          </div>
          <div class="tech-indicator-item" style="animation-delay: 0.6s">
            <span class="tech-indicator-icon">🔬</span>
            <span class="tech-indicator-name">${i("components.techReadiness.rdExpenditure")}</span>
            <span class="tech-indicator-status"></span>
          </div>
        </div>
        <div class="tech-fetch-note">${i("components.techReadiness.analyzingCountries")}</div>
      </div>
    `,"legacy Panel.setContent() migration"))}getFlag(e){return Ft[e]||"🌐"}getScoreClass(e){return e>=70?"high":e>=40?"medium":"low"}formatComponent(e){return e===null?"—":Math.round(e).toString()}render(){const e=this.rankings.slice(0,25);this.showCountBadge(this.rankings.length);const t=`
      <div class="tech-readiness-list">
        ${e.map(s=>{const a=this.getScoreClass(s.score);return`
            <div class="readiness-item ${a}" data-country="${r(s.country)}">
              <div class="readiness-rank">#${s.rank}</div>
              <div class="readiness-flag">${this.getFlag(s.country)}</div>
              <div class="readiness-info">
                <div class="readiness-name">${r(s.countryName)}</div>
                <div class="readiness-components">
                  <span title="${i("components.techReadiness.internetUsers")}">🌐${this.formatComponent(s.components.internet)}</span>
                  <span title="${i("components.techReadiness.mobileSubscriptions")}">📱${this.formatComponent(s.components.mobile)}</span>
                  <span title="${i("components.techReadiness.rdSpending")}">🔬${this.formatComponent(s.components.rdSpend)}</span>
                </div>
              </div>
              <div class="readiness-score ${a}">${s.score}</div>
            </div>
          `}).join("")}
      </div>
      <div class="readiness-footer">
        <span class="readiness-source">${i("components.techReadiness.source")}</span>
        <span class="readiness-updated">${i("components.techReadiness.updated",{date:new Date(this.lastFetch).toLocaleDateString()})}</span>
      </div>
    `;this.setSafeContent(w(t,"legacy Panel.setContent() migration"))}}const Os=Object.freeze(Object.defineProperty({__proto__:null,TechReadinessPanel:Rt},Symbol.toStringTag,{value:"Module"})),Pt={USA:"🇺🇸",Russia:"🇷🇺",China:"🇨🇳",UK:"🇬🇧",Belgium:"🇧🇪",Israel:"🇮🇱",Iran:"🇮🇷",Ukraine:"🇺🇦",Taiwan:"🇹🇼",Japan:"🇯🇵","South Korea":"🇰🇷","North Korea":"🇰🇵",India:"🇮🇳","Saudi Arabia":"🇸🇦",Turkey:"🇹🇷",France:"🇫🇷",Germany:"🇩🇪",Egypt:"🇪🇬",Pakistan:"🇵🇰",Palestine:"🇵🇸",Yemen:"🇾🇪",Syria:"🇸🇾",Lebanon:"🇱🇧",Sudan:"🇸🇩",Ethiopia:"🇪🇹",Myanmar:"🇲🇲",Austria:"🇦🇹",International:"🌐"},zt={capital:"🏛️",conflict:"⚔️",strategic:"⚓",organization:"🏢"},Ut={capital:"Capital",conflict:"Conflict Zone",strategic:"Strategic",organization:"Organization"};class Ht extends S{constructor(){super({id:"geo-hubs",title:i("panels.geoHubs"),showCount:!0,infoTooltip:i("components.geoHubs.infoTooltip",{highColor:_("--semantic-critical"),elevatedColor:_("--semantic-high"),lowColor:_("--text-dim")})});u(this,"activities",[]);u(this,"onHubClick");this.setupDelegatedListeners()}setOnHubClick(e){this.onHubClick=e}setActivities(e){this.activities=e.slice(0,10),this.setCount(this.activities.length),this.render()}getFlag(e){return Pt[e]||"🌐"}getTypeIcon(e){return zt[e]||"📍"}getTypeLabel(e){return Ut[e]||e}render(){if(this.activities.length===0){this.showError(i("common.noActiveGeoHubs"));return}const e=this.activities.map((t,s)=>{const a=t.trend==="rising"?"↑":t.trend==="falling"?"↓":"",n=t.hasBreaking?'<span class="hub-breaking geo">ALERT</span>':"",o=t.topStories[0];return`
        <div class="geo-hub-item ${t.activityLevel}" data-hub-id="${r(t.hubId)}" data-index="${s}">
          <div class="hub-rank">${s+1}</div>
          <span class="geo-hub-indicator ${t.activityLevel}"></span>
          <div class="hub-info">
            <div class="hub-header">
              <span class="hub-name">${r(t.name)}</span>
              <span class="hub-flag">${this.getFlag(t.country)}</span>
              ${n}
            </div>
            <div class="hub-meta">
              <span class="hub-news-count">${t.newsCount} ${t.newsCount===1?i("components.geoHubs.story"):i("components.geoHubs.stories")}</span>
              ${a?`<span class="hub-trend ${t.trend}">${a}</span>`:""}
              <span class="geo-hub-type">${this.getTypeIcon(t.type)} ${this.getTypeLabel(t.type)}</span>
            </div>
          </div>
          <div class="hub-score geo">${Math.round(t.score)}</div>
        </div>
        ${o?`
          <a class="hub-top-story geo" href="${M(o.link)}" target="_blank" rel="noopener" data-hub-id="${r(t.hubId)}">
            ${r(o.title.length>80?o.title.slice(0,77)+"...":o.title)}
          </a>
        `:""}
      `}).join("");this.setSafeContent(w(e,"legacy Panel.setContent() migration"))}setupDelegatedListeners(){this.content.addEventListener("click",e=>{const s=e.target.closest(".geo-hub-item");if(!s)return;const a=s.dataset.hubId,n=this.activities.find(o=>o.hubId===a);n&&this.onHubClick&&this.onHubClick(n)})}}const _s=Object.freeze(Object.defineProperty({__proto__:null,GeoHubsPanel:Ht},Symbol.toStringTag,{value:"Module"})),jt={USA:"🇺🇸","United States":"🇺🇸",UK:"🇬🇧","United Kingdom":"🇬🇧",China:"🇨🇳",India:"🇮🇳",Israel:"🇮🇱",Germany:"🇩🇪",France:"🇫🇷",Canada:"🇨🇦",Japan:"🇯🇵","South Korea":"🇰🇷",Singapore:"🇸🇬",Australia:"🇦🇺",Netherlands:"🇳🇱",Sweden:"🇸🇪",Switzerland:"🇨🇭",Brazil:"🇧🇷",Indonesia:"🇮🇩",UAE:"🇦🇪",Estonia:"🇪🇪",Ireland:"🇮🇪",Finland:"🇫🇮",Spain:"🇪🇸",Italy:"🇮🇹",Poland:"🇵🇱",Mexico:"🇲🇽",Argentina:"🇦🇷",Chile:"🇨🇱",Colombia:"🇨🇴",Nigeria:"🇳🇬",Kenya:"🇰🇪","South Africa":"🇿🇦",Egypt:"🇪🇬",Taiwan:"🇹🇼",Vietnam:"🇻🇳",Thailand:"🇹🇭",Malaysia:"🇲🇾",Philippines:"🇵🇭","New Zealand":"🇳🇿",Austria:"🇦🇹",Belgium:"🇧🇪",Denmark:"🇩🇰",Norway:"🇳🇴",Portugal:"🇵🇹","Czech Republic":"🇨🇿",Romania:"🇷🇴",Ukraine:"🇺🇦",Russia:"🇷🇺",Turkey:"🇹🇷","Saudi Arabia":"🇸🇦",Qatar:"🇶🇦",Pakistan:"🇵🇰",Bangladesh:"🇧🇩"};class Bt extends S{constructor(){super({id:"tech-hubs",title:i("panels.techHubs"),showCount:!0,infoTooltip:i("components.techHubs.infoTooltip",{highColor:_("--semantic-normal"),elevatedColor:_("--semantic-elevated"),lowColor:_("--text-dim")})});u(this,"activities",[]);u(this,"onHubClick")}setOnHubClick(e){this.onHubClick=e}setActivities(e){this.activities=e.slice(0,10),this.setCount(this.activities.length),this.render()}getFlag(e){return jt[e]||"🌐"}render(){if(this.activities.length===0){this.showError(i("common.noActiveTechHubs"));return}const e=this.activities.map((t,s)=>{const a=t.trend==="rising"?"↑":t.trend==="falling"?"↓":"",n=t.hasBreaking?'<span class="hub-breaking">ALERT</span>':"",o=t.topStories[0];return`
        <div class="tech-hub-item ${t.activityLevel}" data-hub-id="${r(t.hubId)}" data-index="${s}">
          <div class="hub-rank">${s+1}</div>
          <span class="hub-indicator ${t.activityLevel}"></span>
          <div class="hub-info">
            <div class="hub-header">
              <span class="hub-name">${r(t.city)}</span>
              <span class="hub-flag">${this.getFlag(t.country)}</span>
              ${n}
            </div>
            <div class="hub-meta">
              <span class="hub-news-count">${t.newsCount} ${t.newsCount===1?"story":"stories"}</span>
              ${a?`<span class="hub-trend ${t.trend}">${a}</span>`:""}
              <span class="hub-tier">${t.tier}</span>
            </div>
          </div>
          <div class="hub-score">${Math.round(t.score)}</div>
        </div>
        ${o?`
          <a class="hub-top-story" href="${M(o.link)}" target="_blank" rel="noopener" data-hub-id="${r(t.hubId)}">
            ${r(o.title.length>80?o.title.slice(0,77)+"...":o.title)}
          </a>
        `:""}
      `}).join("");this.setSafeContent(w(e,"legacy Panel.setContent() migration")),this.bindEvents()}bindEvents(){this.content.querySelectorAll(".tech-hub-item").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.hubId,a=this.activities.find(n=>n.hubId===s);a&&this.onHubClick&&this.onHubClick(a)})})}}const Ns=Object.freeze(Object.defineProperty({__proto__:null,TechHubsPanel:Bt},Symbol.toStringTag,{value:"Module"}));class Kt extends S{constructor(e={}){super({id:"runtime-config",title:i("modals.runtimeConfig.title"),showCount:!1});u(this,"unsubscribe",null);u(this,"mode");u(this,"buffered");u(this,"featureFilter");u(this,"hiddenByUser",!1);u(this,"pendingSecrets",new Map);u(this,"validatedKeys",new Map);u(this,"validationMessages",new Map);this.mode=e.mode??(k()?"alert":"full"),this.buffered=e.buffered??!1,this.featureFilter=e.featureFilter,this.unsubscribe=Ae(()=>this.render()),this.render()}async commitPendingSecrets(){for(const[e,t]of this.pendingSecrets)await G(e,t);this.pendingSecrets.clear(),this.validatedKeys.clear(),this.validationMessages.clear()}async commitVerifiedSecrets(){for(const[e,t]of this.pendingSecrets)this.validatedKeys.get(e)!==!1&&(await G(e,t),this.pendingSecrets.delete(e),this.validatedKeys.delete(e),this.validationMessages.delete(e))}hasPendingChanges(){return this.pendingSecrets.size>0}getFilteredFeatures(){return this.featureFilter?R.filter(e=>this.featureFilter.includes(e.id)):R}getMissingRequiredSecrets(){const e=[];for(const t of this.getFilteredFeatures()){if(!J(t.id))continue;const s=j(t);if(s.some(n=>this.pendingSecrets.has(n)))for(const n of s)!B(n).valid&&!this.pendingSecrets.has(n)&&e.push(n)}return e}getValidationErrors(){const e=[];for(const[t,s]of this.pendingSecrets){const a=P(t,s);a.valid||e.push(`${t}: ${a.hint||"Invalid format"}`)}return e}async verifyPendingSecrets(){this.captureUnsavedInputs();const e=[],t=Object.fromEntries(this.pendingSecrets.entries()),s=[];for(const[a,n]of this.pendingSecrets){const o=P(a,n);o.valid?s.push([a,n]):(this.validatedKeys.set(a,!1),this.validationMessages.set(a,o.hint||"Invalid format"),e.push(`${a}: ${o.hint||"Invalid format"}`))}if(s.length>0){const a=await Promise.race([Promise.all(s.map(async([n,o])=>{const c=await Le(n,o,t);return{key:n,result:c}})),new Promise(n=>setTimeout(()=>n(s.map(([o])=>({key:o,result:{valid:!0,message:"Saved (verification timed out)"}}))),15e3))]);for(const{key:n,result:o}of a)this.validatedKeys.set(n,o.valid),o.valid?this.validationMessages.delete(n):(this.validationMessages.set(n,o.message||"Verification failed"),e.push(`${n}: ${o.message||"Verification failed"}`))}return this.pendingSecrets.size>0&&this.render(),e}destroy(){var e;(e=this.unsubscribe)==null||e.call(this),this.unsubscribe=null}setEffectiveVisibility(e){e?super.show():super.hide()}show(){this.hiddenByUser=!1,this.mode==="alert"?this.render():this.setEffectiveVisibility(!0)}hide(){this.hiddenByUser=!0,this.setEffectiveVisibility(!1)}captureUnsavedInputs(){if(!this.buffered)return;this.content.querySelectorAll("input[data-secret]").forEach(a=>{var m;const n=a.dataset.secret;if(!n)return;const o=a.value.trim();if(!o||o===N)return;if(H.has(n)&&!this.pendingSecrets.has(n)){const v=((m=z().secrets[n])==null?void 0:m.value)||"";if(o===v)return}this.pendingSecrets.set(n,o);const c=P(n,o);c.valid||(this.validatedKeys.set(n,!1),this.validationMessages.set(n,c.hint||"Invalid format"))});const e=this.content.querySelector("select[data-model-select]"),t=this.content.querySelector("input[data-model-manual]"),s=(t&&!t.classList.contains("hidden-input")?t.value.trim():e==null?void 0:e.value)||"";s&&!this.pendingSecrets.has("OLLAMA_MODEL")&&(this.pendingSecrets.set("OLLAMA_MODEL",s),this.validatedKeys.set("OLLAMA_MODEL",!0))}render(){this.captureUnsavedInputs();const e=z(),t=k(),s=this.getFilteredFeatures();if(t&&this.mode==="alert"){if(this.hiddenByUser){this.setEffectiveVisibility(!1);return}const a=R.length,n=R.filter(g=>K(g.id)).length,o=Math.max(0,a-n),c=Object.keys(e.secrets).length,m=c>0?o>0?"some":"configured":"needsKeys";if(o===0&&c>=a){this.setEffectiveVisibility(!1);return}const v=i(`modals.runtimeConfig.alertTitle.${m}`),l=o>0?"warn":"ok";this.setEffectiveVisibility(!0),L(this.content,O(`
        <section class="runtime-alert runtime-alert-${l}" data-alert-state="${m}">
          <h3>${v}</h3>
          <p>
            ${n}/${a} ${i("modals.runtimeConfig.summary.available")}${c>0?` · ${c} ${i("modals.runtimeConfig.summary.secrets")}`:""}.
          </p>
          <p class="runtime-alert-skip">${i("modals.runtimeConfig.skipSetup")}</p>
          <button type="button" class="runtime-early-access-btn" data-early-access>
            ${i("modals.runtimeConfig.reserveEarlyAccess")}
          </button>
        </section>
      `,"legacy direct innerHTML migration")),this.attachListeners();return}L(this.content,O(`
      <div class="runtime-config-summary">
        ${t?i("modals.runtimeConfig.summary.desktop"):i("modals.runtimeConfig.summary.web")} · ${s.filter(a=>K(a.id)).length}/${s.length} ${i("modals.runtimeConfig.summary.available")}
      </div>
      <div class="runtime-config-list">
        ${s.map(a=>this.renderFeature(a)).join("")}
      </div>
    `,"legacy direct innerHTML migration")),this.attachListeners()}renderFeature(e){const t=J(e.id),s=K(e.id),a=j(e),n=!s&&a.every(g=>B(g).valid||this.pendingSecrets.has(g)&&this.validatedKeys.get(g)!==!1),o=s?"ok":n?"staged":"warn",c=s?i("modals.runtimeConfig.status.ready"):n?i("modals.runtimeConfig.status.staged"):i("modals.runtimeConfig.status.needsKeys"),m=a.map(g=>this.renderSecretRow(g)).join(""),v=k(),l=s||n?"":`<p class="runtime-feature-fallback fallback">${r(e.fallback)}</p>`;return`
      <section class="runtime-feature ${s?"available":n?"staged":"degraded"}">
        <header class="runtime-feature-header">
          <label>
            <input type="checkbox" data-toggle="${e.id}" ${t?"checked":""} ${v?"":"disabled"}>
            <span>${r(e.name)}</span>
          </label>
          <span class="runtime-pill ${o}">${c}</span>
        </header>
        <div class="runtime-secrets">${m}</div>
        ${l}
      </section>
    `}renderSecretRow(e){var b,F;const t=B(e),s=this.pendingSecrets.has(e),a=s?this.validatedKeys.get(e):void 0,n=s?a===!1?i("modals.runtimeConfig.status.invalid"):i("modals.runtimeConfig.status.staged"):t.present?t.valid?i("modals.runtimeConfig.status.valid"):i("modals.runtimeConfig.status.looksInvalid"):i("modals.runtimeConfig.status.missing"),o=s?a===!1?"warn":"staged":t.valid?"ok":"warn",c=Ve[e],m=`modals.runtimeConfig.help.${e}`,v=i(m),l=v!==m?v:"",g=c&&!t.present&&!s,$=this.validatedKeys.get(e),f=s?$===!1?"invalid":"valid-staged":"",y=$===!0?"visible":"",C=s&&$===!1?this.validationMessages.get(e)||P(e,this.pendingSecrets.get(e)||"").hint||"Invalid value":null;if(e==="OLLAMA_MODEL"){const A=s?this.pendingSecrets.get(e)||"":((b=z().secrets[e])==null?void 0:b.value)||"";return`
        <div class="runtime-secret-row">
          <div class="runtime-secret-key"><code>${r(e)}</code></div>
          <span class="runtime-secret-status ${o}">${r(n)}</span>
          <span class="runtime-secret-check ${y}">&#x2713;</span>
          ${l?`<div class="runtime-secret-meta">${r(l)}</div>`:""}
          <select data-model-select class="${f}" ${k()?"":"disabled"}>
            ${A?`<option value="${r(A)}" selected>${r(A)}</option>`:'<option value="" selected disabled>Loading models...</option>'}
          </select>
          <input type="text" data-model-manual class="${f} hidden-input" placeholder="Or type model name" autocomplete="off" ${k()?"":"disabled"} ${A?`value="${r(A)}"`:""}>
          ${C?`<span class="runtime-secret-hint">${r(C)}</span>`:""}
        </div>
      `}const x=g?`<a href="#" data-signup-url="${c}" class="runtime-secret-link">Get key</a>`:"";return`
      <div class="runtime-secret-row">
        <div class="runtime-secret-key"><code>${r(e)}</code></div>
        <span class="runtime-secret-status ${o}">${r(n)}</span>
        <span class="runtime-secret-check ${y}">&#x2713;</span>
        ${l?`<div class="runtime-secret-meta">${r(l)}</div>`:""}
        <div class="runtime-input-wrapper${g?" has-suffix":""}">
          <input type="${H.has(e)?"text":"password"}" data-secret="${e}" placeholder="${s?i("modals.runtimeConfig.placeholder.staged"):i("modals.runtimeConfig.placeholder.setSecret")}" autocomplete="off" ${k()?"":"disabled"} class="${f}" ${s?`value="${H.has(e)?r(this.pendingSecrets.get(e)||""):N}"`:H.has(e)&&t.present?`value="${r(((F=z().secrets[e])==null?void 0:F.value)||"")}"`:""}>
          ${x}
        </div>
        ${C?`<span class="runtime-secret-hint">${r(C)}</span>`:""}
      </div>
    `}attachListeners(){var t;if(this.content.querySelectorAll("a[data-signup-url]").forEach(s=>{s.addEventListener("click",a=>{a.preventDefault();const n=s.dataset.signupUrl;n&&(k()?Q("open_url",{url:n}).catch(()=>window.open(n,"_blank","noopener,noreferrer")):window.open(n,"_blank","noopener,noreferrer"))})}),!k())return;if(this.mode==="alert"){(t=this.content.querySelector("[data-early-access]"))==null||t.addEventListener("click",()=>{const s="https://www.worldmonitor.app/pro";k()?Q("open_url",{url:s}).catch(()=>window.open(s,"_blank","noopener,noreferrer")):window.open(s,"_blank","noopener,noreferrer")});return}const e=this.content.querySelector("select[data-model-select]");e&&(e.addEventListener("change",()=>{const s=e.value;s&&this.buffered&&(this.pendingSecrets.set("OLLAMA_MODEL",s),this.validatedKeys.set("OLLAMA_MODEL",!0),e.classList.remove("invalid"),e.classList.add("valid-staged"),this.updateFeatureCardStatus("OLLAMA_MODEL"))}),this.fetchOllamaModels(e)),this.content.querySelectorAll("input[data-toggle]").forEach(s=>{s.addEventListener("change",()=>{const a=s.dataset.toggle;a&&(Oe(a,s.checked),_e(a,s.checked))})}),this.content.querySelectorAll("input[data-secret]").forEach(s=>{s.addEventListener("input",()=>{var c,m;const a=s.dataset.secret;if(!a)return;this.buffered&&this.pendingSecrets.has(a)&&s.value.startsWith(N)&&(s.value=s.value.slice(N.length)),this.validatedKeys.delete(a),this.validationMessages.delete(a);const n=(c=s.closest(".runtime-secret-row"))==null?void 0:c.querySelector(".runtime-secret-check");n==null||n.classList.remove("visible"),s.classList.remove("valid-staged","invalid");const o=(m=s.closest(".runtime-secret-row"))==null?void 0:m.querySelector(".runtime-secret-hint");o&&o.remove()}),s.addEventListener("blur",()=>{var o;const a=s.dataset.secret;if(!a)return;const n=s.value.trim();if(!n){this.buffered&&this.pendingSecrets.has(a)&&(this.pendingSecrets.delete(a),this.validatedKeys.delete(a),this.validationMessages.delete(a),this.render());return}if(n!==N)if(this.buffered){this.pendingSecrets.set(a,n);const c=P(a,n);c.valid?(this.validatedKeys.delete(a),this.validationMessages.delete(a)):(this.validatedKeys.set(a,!1),this.validationMessages.set(a,c.hint||"Invalid format")),H.has(a)?s.value=n:(s.type="password",s.value=N),s.placeholder=i("modals.runtimeConfig.placeholder.staged");const m=s.closest(".runtime-secret-row"),v=m==null?void 0:m.querySelector(".runtime-secret-check");if(s.classList.remove("valid-staged","invalid"),c.valid)v==null||v.classList.remove("visible"),s.classList.add("valid-staged");else{v==null||v.classList.remove("visible"),s.classList.add("invalid");const g=m==null?void 0:m.querySelector(".runtime-secret-hint");if(g&&g.remove(),c.hint){const $=document.createElement("span");$.className="runtime-secret-hint",$.textContent=c.hint,m==null||m.appendChild($)}}this.updateFeatureCardStatus(a);const l=(o=s.closest(".runtime-secret-row"))==null?void 0:o.querySelector(".runtime-secret-status");if(l&&(l.textContent=c.valid?i("modals.runtimeConfig.status.staged"):i("modals.runtimeConfig.status.invalid"),l.className=`runtime-secret-status ${c.valid?"staged":"warn"}`),a==="OLLAMA_API_URL"&&c.valid){const g=this.content.querySelector("select[data-model-select]");g&&this.fetchOllamaModels(g)}}else G(a,n),s.value=""})})}updateFeatureCardStatus(e){const t=R.find(v=>j(v).includes(e));if(!t)return;const s=Array.from(this.content.querySelectorAll(".runtime-feature")).find(v=>!!v.querySelector(`input[data-toggle="${t.id}"]`));if(!s)return;const a=K(t.id),n=j(t),o=!a&&n.every(v=>B(v).valid||this.pendingSecrets.has(v)&&this.validatedKeys.get(v)!==!1);s.className=`runtime-feature ${a?"available":o?"staged":"degraded"}`;const c=s.querySelector(".runtime-pill");c&&(c.className=`runtime-pill ${a?"ok":o?"staged":"warn"}`,c.textContent=a?i("modals.runtimeConfig.status.ready"):o?i("modals.runtimeConfig.status.staged"):i("modals.runtimeConfig.status.needsKeys"));const m=s.querySelector(".runtime-feature-fallback");(a||o)&&(m==null||m.remove())}showManualModelInput(e){var s;const t=(s=e.parentElement)==null?void 0:s.querySelector("input[data-model-manual]");t&&(e.style.display="none",t.classList.remove("hidden-input"),t.addEventListener("blur",()=>{const a=t.value.trim();a&&this.buffered&&(this.pendingSecrets.set("OLLAMA_MODEL",a),this.validatedKeys.set("OLLAMA_MODEL",!0),t.classList.remove("invalid"),t.classList.add("valid-staged"),this.updateFeatureCardStatus("OLLAMA_MODEL"))}))}async fetchOllamaModels(e){var n,o;const t=z(),s=this.pendingSecrets.get("OLLAMA_API_URL")||((n=t.secrets.OLLAMA_API_URL)==null?void 0:n.value)||"";if(!s){L(e,O('<option value="" disabled selected>Set Ollama URL first</option>',"legacy direct innerHTML migration"));return}const a=this.pendingSecrets.get("OLLAMA_MODEL")||((o=t.secrets.OLLAMA_MODEL)==null?void 0:o.value)||"";try{const c=await qe(s);if(!e.isConnected)return;if(c.length===0){this.showManualModelInput(e);return}if(L(e,O(c.map(m=>`<option value="${r(m)}" ${m===a?"selected":""}>${r(m)}</option>`).join(""),"legacy direct innerHTML migration")),!a&&c.length>0){const m=c[0];e.value=m,this.buffered&&(this.pendingSecrets.set("OLLAMA_MODEL",m),this.validatedKeys.set("OLLAMA_MODEL",!0),e.classList.add("valid-staged"),this.updateFeatureCardStatus("OLLAMA_MODEL"))}}catch{this.showManualModelInput(e)}}}const Ds=Object.freeze(Object.defineProperty({__proto__:null,RuntimeConfigPanel:Kt},Symbol.toStringTag,{value:"Module"})),Wt=[...Ce].reverse();class Gt extends S{constructor(){super({id:"threat-timeline",title:"Threat Timeline",showCount:!1,infoTooltip:"Seven-day threat-level distribution from intelligence insights.",defaultRowSpan:2});u(this,"lastClusters",[]);this.renderEmpty("Waiting for intelligence insight data.")}async refresh(e){e&&(this.lastClusters=e);try{const t=Ye()??await Ze();if(t){this.updateFromServerInsights(t);return}}catch(t){console.warn("[ThreatTimeline] insight refresh failed, falling back to clusters:",t)}this.updateFromClusters(this.lastClusters,"degraded","Server insight snapshot unavailable")}updateFromServerInsights(e){const t=Xe(e),s=ae(t,{status:e.status,statusMessage:e.status==="degraded"?"Server insight snapshot degraded":""});this.renderState(s,"Insights snapshot")}updateFromClusters(e,t="ok",s=""){this.lastClusters=e;const a=Je(e),n=ae(a,{status:t,statusMessage:s});this.renderState(n,t==="ok"?"Live clusters":"Cluster fallback")}renderState(e,t){if(this.setCount(e.items.length),!e.hasData){const l=e.status==="degraded"?"No recent threat metadata available from the intelligence snapshot.":"No recent threat metadata in the last 7 days.";this.renderEmpty(l,e.degradedReasons);return}const s=e.totals.critical+e.totals.high,a=Qe(e),n=et(e.days),o=e.items.length,c=this.renderChart(e.days),m=this.renderGroups(e.groups),v=e.degradedReasons.length>0?`<div class="threat-timeline-note">${r(e.degradedReasons.join(" | "))}</div>`:"";this.setDataBadge(e.status==="ok"?"live":"cached",e.status==="ok"?t:"degraded"),this.setSafeContent(w(`
      <div class="threat-timeline-panel">
        <div class="threat-timeline-summary">
          <div class="threat-timeline-stat">
            <span class="threat-timeline-stat-value">${s}</span>
            <span class="threat-timeline-stat-label">Critical/high</span>
          </div>
          <div class="threat-timeline-stat">
            <span class="threat-timeline-stat-value">${a}</span>
            <span class="threat-timeline-stat-label">Active days</span>
          </div>
          <div class="threat-timeline-trend ${n.className}">
            <span class="threat-timeline-trend-label">${r(n.label)}</span>
            <span class="threat-timeline-trend-copy">${r(n.copy)}</span>
          </div>
        </div>
        ${c}
        <div class="threat-timeline-legend">${Ce.map(l=>`
          <span class="threat-timeline-legend-item">
            <span class="threat-timeline-swatch" style="background:${ie[l]}"></span>
            ${ne[l]} <strong>${e.totals[l]}</strong>
          </span>
        `).join("")}</div>
        <div class="threat-timeline-groups" aria-label="Current threat alerts grouped by level">
          ${m}
        </div>
        <div class="threat-timeline-footer">${o} insight item${o===1?"":"s"} from ${r(t)}</div>
        ${v}
      </div>
      ${this.renderStyles()}
    `,"legacy Panel.setContent() migration"))}renderEmpty(e,t=[]){this.setCount(0),this.setDataBadge("unavailable");const s=t.length>0?`<div class="threat-timeline-note">${r(t.join(" | "))}</div>`:"";this.setSafeContent(w(`
      <div class="threat-timeline-panel">
        <div class="threat-timeline-empty">
          <div class="threat-timeline-empty-title">${r(e)}</div>
          <div class="threat-timeline-empty-copy">The panel will populate when intelligence insights include timestamped threat levels.</div>
        </div>
        ${s}
      </div>
      ${this.renderStyles()}
    `,"legacy Panel.setContent() migration"))}renderChart(e){const a={top:12,right:10,bottom:28,left:24},n=e.map(f=>({key:f.key,label:f.label,critical:f.counts.critical,high:f.counts.high,medium:f.counts.medium,low:f.counts.low,info:f.counts.info})),o=Math.max(1,we(e,f=>f.total)??1),c=Re().domain(e.map(f=>f.key)).range([a.left,360-a.right]).padding(.24),m=q().domain([0,o]).nice().range([150-a.bottom,a.top]),v=tt().keys(Wt)(n),l=m(o),g=v.map(f=>{const y=f.key;return f.map((C,x)=>{const b=e[x];if(!b)return"";const F=c(b.key);if(F===void 0)return"";const A=m(C[1]),ke=m(C[0]),X=Math.max(0,ke-A);return X<=0?"":`<rect x="${F.toFixed(1)}" y="${A.toFixed(1)}" width="${c.bandwidth().toFixed(1)}" height="${X.toFixed(1)}" rx="2" fill="${ie[y]}">
          <title>${r(b.label)} ${ne[y]}: ${b.counts[y]}</title>
        </rect>`}).join("")}).join(""),$=e.map(f=>{const y=c(f.key);if(y===void 0)return"";const C=(y+c.bandwidth()/2).toFixed(1),[x="",b=""]=f.label.split(" ");return`<text x="${C}" y="134" text-anchor="middle">
        <tspan x="${C}" dy="0">${r(x)}</tspan>
        <tspan x="${C}" dy="10">${r(b)}</tspan>
      </text>`}).join("");return`
      <div class="threat-timeline-chart-wrap">
        <svg class="threat-timeline-chart" viewBox="0 0 360 150" role="img" aria-label="Seven-day threat level distribution">
          <line x1="${a.left}" x2="${360-a.right}" y1="${l.toFixed(1)}" y2="${l.toFixed(1)}" class="threat-timeline-grid" />
          <line x1="${a.left}" x2="${360-a.right}" y1="${(150-a.bottom).toFixed(1)}" y2="${(150-a.bottom).toFixed(1)}" class="threat-timeline-axis" />
          ${g}
          <g class="threat-timeline-labels">${$}</g>
        </svg>
      </div>
    `}renderGroups(e){return e.length===0?'<div class="threat-timeline-empty-inline">No grouped alerts in the current window.</div>':e.map(t=>`
      <section class="threat-timeline-group threat-${t.level}">
        <div class="threat-timeline-group-header">
          <span class="threat-timeline-group-name">${r(t.label)}</span>
          <span class="threat-timeline-group-count">${t.count}</span>
        </div>
        ${t.items.map(s=>this.renderItem(s)).join("")}
      </section>
    `).join("")}renderItem(e){const t=Array.from(e.title),s=r(t.length>94?`${t.slice(0,91).join("")}...`:e.title),a=M(e.sourceUrl),n=a?`<a href="${a}" target="_blank" rel="noopener" class="threat-timeline-item-title">${s}</a>`:`<span class="threat-timeline-item-title">${s}</span>`,o=r(e.provenance||e.source||"News Digest"),c=this.formatAge(e.timestampMs),m=e.sourceCount>1?`<span class="threat-timeline-source-count">${e.sourceCount} sources</span>`:"";return`
      <article class="threat-timeline-item">
        ${n}
        <div class="threat-timeline-item-meta">
          <span class="threat-timeline-source">${o}</span>
          ${m}
          <span>${r(c)}</span>
        </div>
      </article>
    `}formatAge(e){const t=Math.max(0,Date.now()-e),s=Math.floor(t/(3600*1e3));return s<1?"just now":s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}renderStyles(){return`
      <style>
        .threat-timeline-panel { display: grid; gap: 10px; }
        .threat-timeline-summary { display: grid; grid-template-columns: 76px 76px 1fr; gap: 8px; align-items: stretch; }
        .threat-timeline-stat, .threat-timeline-trend { border: 1px solid var(--border-color); background: var(--bg-secondary); border-radius: 8px; padding: 8px; min-width: 0; }
        .threat-timeline-stat-value { display: block; font-size: 20px; line-height: 1; font-weight: 700; color: var(--text-primary); }
        .threat-timeline-stat-label, .threat-timeline-trend-copy, .threat-timeline-footer, .threat-timeline-note { display: block; font-size: 11px; color: var(--text-secondary); margin-top: 4px; }
        .threat-timeline-trend { border-left: 3px solid var(--accent-color); }
        .threat-timeline-trend.worsening { border-left-color: #ef4444; }
        .threat-timeline-trend.easing { border-left-color: #38bdf8; }
        .threat-timeline-trend-label { display: block; color: var(--text-primary); font-size: 13px; font-weight: 700; }
        .threat-timeline-chart-wrap { border: 1px solid var(--border-color); border-radius: 8px; background: rgba(15, 23, 42, 0.18); padding: 6px; }
        .threat-timeline-chart { width: 100%; height: 150px; display: block; overflow: visible; }
        .threat-timeline-grid { stroke: var(--border-color); stroke-dasharray: 3 3; opacity: 0.7; }
        .threat-timeline-axis { stroke: var(--border-color); }
        .threat-timeline-labels text { fill: var(--text-secondary); font-size: 9px; }
        .threat-timeline-legend { display: flex; flex-wrap: wrap; gap: 6px; }
        .threat-timeline-legend-item { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); }
        .threat-timeline-swatch { width: 8px; height: 8px; border-radius: 999px; }
        .threat-timeline-groups { display: grid; gap: 8px; }
        .threat-timeline-group { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: var(--bg-secondary); }
        .threat-timeline-group-header { display: flex; align-items: center; justify-content: space-between; padding: 7px 9px; border-bottom: 1px solid var(--border-color); }
        .threat-timeline-group-name { font-size: 12px; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0; }
        .threat-timeline-group-count { font-size: 11px; color: var(--text-secondary); }
        .threat-timeline-item { padding: 8px 9px; display: grid; gap: 4px; }
        .threat-timeline-item + .threat-timeline-item { border-top: 1px solid var(--border-color); }
        .threat-timeline-item-title { color: var(--text-primary); font-size: 12px; line-height: 1.35; text-decoration: none; }
        a.threat-timeline-item-title:hover { color: var(--accent-color); }
        .threat-timeline-item-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; color: var(--text-secondary); font-size: 10px; }
        .threat-timeline-source, .threat-timeline-source-count { border: 1px solid var(--border-color); border-radius: 999px; padding: 1px 6px; color: var(--text-secondary); }
        .threat-critical .threat-timeline-group-header { border-left: 3px solid #ef4444; }
        .threat-high .threat-timeline-group-header { border-left: 3px solid #f97316; }
        .threat-medium .threat-timeline-group-header { border-left: 3px solid #eab308; }
        .threat-low .threat-timeline-group-header { border-left: 3px solid #38bdf8; }
        .threat-info .threat-timeline-group-header { border-left: 3px solid #94a3b8; }
        .threat-timeline-empty, .threat-timeline-empty-inline { border: 1px dashed var(--border-color); border-radius: 8px; padding: 14px; color: var(--text-secondary); background: var(--bg-secondary); }
        .threat-timeline-empty-title { color: var(--text-primary); font-size: 13px; font-weight: 700; }
        .threat-timeline-empty-copy { margin-top: 5px; font-size: 12px; line-height: 1.4; color: var(--text-secondary); }
        @media (max-width: 520px) {
          .threat-timeline-summary { grid-template-columns: 1fr 1fr; }
          .threat-timeline-trend { grid-column: 1 / -1; }
        }
      </style>
    `}}const Is=Object.freeze(Object.defineProperty({__proto__:null,ThreatTimelinePanel:Gt},Symbol.toStringTag,{value:"Module"}));class Vt extends S{constructor(){super({id:"giving",title:i("panels.giving"),showCount:!0,trackActivity:!0,infoTooltip:i("components.giving.infoTooltip")});u(this,"data",null);u(this,"activeTab","platforms");this.showLoading(i("common.loadingGiving"))}setData(e){var t;this.data=e,this.setCount(((t=e.platforms)==null?void 0:t.length)??0),this.renderContent()}hasData(){return this.data!==null}renderContent(){if(!this.data)return;const e=this.data,t=Pe(e.trend),s=ze(e.trend),n=`
      <div class="giving-stat-box giving-stat-index">
        <span class="giving-stat-value" style="color: ${Ue(e.activityIndex)}">${e.activityIndex}</span>
        <span class="giving-stat-label">${i("components.giving.activityIndex")}</span>
      </div>
      <div class="giving-stat-box giving-stat-trend">
        <span class="giving-stat-value" style="color: ${s}">${t} ${r(e.trend)}</span>
        <span class="giving-stat-label">${i("components.giving.trend")}</span>
      </div>
      <div class="giving-stat-box giving-stat-daily">
        <span class="giving-stat-value">${W(e.estimatedDailyFlowUsd)}</span>
        <span class="giving-stat-label">${i("components.giving.estDailyFlow")}</span>
      </div>
      <div class="giving-stat-box giving-stat-crypto">
        <span class="giving-stat-value">${W(e.crypto.dailyInflowUsd)}</span>
        <span class="giving-stat-label">${i("components.giving.cryptoDaily")}</span>
      </div>
    `,o=["platforms","categories","crypto","institutional"],c={platforms:i("components.giving.tabs.platforms"),categories:i("components.giving.tabs.categories"),crypto:i("components.giving.tabs.crypto"),institutional:i("components.giving.tabs.institutional")},m=`
      <div class="panel-tabs">
        ${o.map(l=>`<button class="panel-tab ${this.activeTab===l?"active":""}" data-tab="${l}">${c[l]}</button>`).join("")}
      </div>
    `;let v;switch(this.activeTab){case"platforms":v=this.renderPlatforms(e.platforms);break;case"categories":v=this.renderCategories(e.categories);break;case"crypto":v=this.renderCrypto();break;case"institutional":v=this.renderInstitutional();break}L(this.content,O(`
      <div class="giving-panel-content">
        <div class="giving-stats-grid">${n}</div>
        ${m}
        ${v}
      </div>
    `,"legacy direct innerHTML migration")),this.content.querySelectorAll(".panel-tab").forEach(l=>{l.addEventListener("click",()=>{this.activeTab=l.dataset.tab,this.renderContent()})})}renderPlatforms(e){if(e.length===0)return`<div class="panel-empty">${i("common.noDataShort")}</div>`;const t=e.map(s=>{const a=s.dataFreshness==="live"?"giving-fresh-live":s.dataFreshness==="daily"?"giving-fresh-daily":s.dataFreshness==="weekly"?"giving-fresh-weekly":"giving-fresh-annual";return`<tr class="giving-row">
        <td class="giving-platform-name">${r(s.platform)}</td>
        <td class="giving-platform-vol">${W(s.dailyVolumeUsd)}</td>
        <td class="giving-platform-vel">${s.donationVelocity>0?`${s.donationVelocity.toFixed(0)}/hr`:"—"}</td>
        <td class="giving-platform-fresh"><span class="giving-fresh-badge ${a}">${r(s.dataFreshness)}</span></td>
      </tr>`}).join("");return`
      <table class="giving-table">
        <thead>
          <tr>
            <th>${i("components.giving.platform")}</th>
            <th>${i("components.giving.dailyVol")}</th>
            <th>${i("components.giving.velocity")}</th>
            <th>${i("components.giving.freshness")}</th>
          </tr>
        </thead>
        <tbody>${t}</tbody>
      </table>`}renderCategories(e){if(e.length===0)return`<div class="panel-empty">${i("common.noDataShort")}</div>`;const t=e.map(s=>{const a=Math.round(s.share*100),n=s.trending?`<span class="giving-trending-badge">${i("components.giving.trending")}</span>`:"";return`<tr class="giving-row">
        <td class="giving-cat-name">${r(s.category)} ${n}</td>
        <td class="giving-cat-share">
          <div class="giving-share-bar">
            <div class="giving-share-fill" style="width: ${a}%"></div>
          </div>
          <span class="giving-share-label">${se(s.share)}</span>
        </td>
      </tr>`}).join("");return`
      <table class="giving-table giving-cat-table">
        <thead>
          <tr>
            <th>${i("components.giving.category")}</th>
            <th>${i("components.giving.share")}</th>
          </tr>
        </thead>
        <tbody>${t}</tbody>
      </table>`}renderCrypto(){var t;if(!((t=this.data)!=null&&t.crypto))return`<div class="panel-empty">${i("common.noDataShort")}</div>`;const e=this.data.crypto;return`
      <div class="giving-crypto-content">
        <div class="giving-crypto-stats">
          <div class="giving-stat-box">
            <span class="giving-stat-value">${W(e.dailyInflowUsd)}</span>
            <span class="giving-stat-label">${i("components.giving.dailyInflow")}</span>
          </div>
          <div class="giving-stat-box">
            <span class="giving-stat-value">${e.trackedWallets}</span>
            <span class="giving-stat-label">${i("components.giving.wallets")}</span>
          </div>
          <div class="giving-stat-box">
            <span class="giving-stat-value">${se(e.pctOfTotal/100)}</span>
            <span class="giving-stat-label">${i("components.giving.ofTotal")}</span>
          </div>
        </div>
        <div class="giving-crypto-receivers">
          <div class="giving-section-title">${i("components.giving.topReceivers")}</div>
          <ul class="giving-receiver-list">
            ${e.topReceivers.map(s=>`<li>${r(s)}</li>`).join("")}
          </ul>
        </div>
      </div>`}renderInstitutional(){var t;if(!((t=this.data)!=null&&t.institutional))return`<div class="panel-empty">${i("common.noDataShort")}</div>`;const e=this.data.institutional;return`
      <div class="giving-inst-content">
        <div class="giving-inst-grid">
          <div class="giving-stat-box">
            <span class="giving-stat-value">$${e.oecdOdaAnnualUsdBn.toFixed(1)}B</span>
            <span class="giving-stat-label">${i("components.giving.oecdOda")} (${e.oecdDataYear})</span>
          </div>
          <div class="giving-stat-box">
            <span class="giving-stat-value">${e.cafWorldGivingIndex}%</span>
            <span class="giving-stat-label">${i("components.giving.cafIndex")} (${e.cafDataYear})</span>
          </div>
          <div class="giving-stat-box">
            <span class="giving-stat-value">${e.candidGrantsTracked>=1e6?`${(e.candidGrantsTracked/1e6).toFixed(0)}M`:e.candidGrantsTracked.toLocaleString()}</span>
            <span class="giving-stat-label">${i("components.giving.candidGrants")}</span>
          </div>
          <div class="giving-stat-box">
            <span class="giving-stat-value">${r(e.dataLag)}</span>
            <span class="giving-stat-label">${i("components.giving.dataLag")}</span>
          </div>
        </div>
      </div>`}}const Ms=Object.freeze(Object.defineProperty({__proto__:null,GivingPanel:Vt},Symbol.toStringTag,{value:"Module"}));class qt extends S{constructor(){super({id:"counters",title:"Live Counters",trackActivity:!1,infoTooltip:i("components.counters.infoTooltip")});u(this,"animFrameId",null);u(this,"valueElements",new Map);u(this,"desktopMode",k());u(this,"visibilityHandler",null);u(this,"lastDesktopUpdateAt",0);u(this,"desktopUpdateIntervalMs",250);u(this,"tick",()=>{if(this.desktopMode){const e=performance.now();if(e-this.lastDesktopUpdateAt<this.desktopUpdateIntervalMs){this.animFrameId=requestAnimationFrame(this.tick);return}this.lastDesktopUpdateAt=e}for(const e of oe){const t=this.valueElements.get(e.id);if(t){const s=le(e);t.textContent=re(s,e.formatPrecision)}}this.animFrameId=requestAnimationFrame(this.tick)});this.createCounterGrid(),this.desktopMode&&(this.visibilityHandler=()=>{if(document.hidden){this.stopTicking();return}this.lastDesktopUpdateAt=0,this.startTicking()},document.addEventListener("visibilitychange",this.visibilityHandler)),this.startTicking()}createCounterGrid(){const e=document.createElement("div");e.className="counters-grid";for(const t of oe){const s=this.createCounterCard(t);e.appendChild(s)}this.content.innerHTML="",this.content.appendChild(e)}createCounterCard(e){const t=document.createElement("div");t.className="counter-card";const s=document.createElement("div");s.className="counter-icon",s.textContent=e.icon;const a=document.createElement("div");a.className="counter-value",a.dataset.counter=e.id,a.textContent=re(le(e),e.formatPrecision);const n=document.createElement("div");n.className="counter-label",n.textContent=e.label;const o=document.createElement("div");return o.className="counter-source",o.textContent=e.source,t.appendChild(s),t.appendChild(a),t.appendChild(n),t.appendChild(o),this.valueElements.set(e.id,a),t}startTicking(){this.animFrameId===null&&(this.desktopMode&&document.hidden||(this.animFrameId=requestAnimationFrame(this.tick)))}stopTicking(){this.animFrameId!==null&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=null)}destroy(){this.stopTicking(),this.visibilityHandler&&(document.removeEventListener("visibilitychange",this.visibilityHandler),this.visibilityHandler=null),this.valueElements.clear(),super.destroy()}}const Fs=Object.freeze(Object.defineProperty({__proto__:null,CountersPanel:qt},Symbol.toStringTag,{value:"Module"})),T={top:4,right:8,bottom:16,left:8},Yt=50;let pe="",me=new Intl.NumberFormat("en-US");function ge(){const d=Z();return d!==pe&&(pe=d,me=new Intl.NumberFormat(d)),me}const Zt="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="%236B8F5E"><rect width="400" height="300" fill="%23f0f4ed"/><text x="200" y="160" text-anchor="middle" font-size="64">&#x1F33F;</text></svg>');class Xt extends S{constructor(){super({id:"species",title:"Conservation Wins",trackActivity:!1,infoTooltip:i("components.conservationWins.infoTooltip")})}setData(p){if(I(this.content),p.length===0){const t=document.createElement("div");t.className="species-empty",t.textContent="No conservation data available",this.content.appendChild(t);return}const e=document.createElement("div");e.className="species-grid";for(const t of p){const s=this.createCard(t);e.appendChild(s)}this.content.appendChild(e)}createCard(p){const e=document.createElement("div");e.className="species-card",e.appendChild(this.createPhotoSection(p)),e.appendChild(this.createInfoSection(p));const t=document.createElement("div");return t.className="species-sparkline",e.appendChild(t),queueMicrotask(()=>{const s=_("--green")||"#6B8F5E";this.renderSparkline(t,p.populationData,s)}),e.appendChild(this.createSummarySection(p)),e}createPhotoSection(p){const e=document.createElement("div");e.className="species-photo";const t=document.createElement("img");return t.src=p.photoUrl,t.alt=p.commonName,t.loading="lazy",t.onerror=()=>{t.onerror=null,t.src=Zt},e.appendChild(t),e}createInfoSection(p){const e=document.createElement("div");e.className="species-info";const t=document.createElement("h4");t.className="species-name",t.textContent=p.commonName,e.appendChild(t);const s=document.createElement("span");s.className="species-scientific",s.style.fontStyle="italic",s.textContent=p.scientificName,e.appendChild(s);const a=document.createElement("div");a.className="species-badges";const n=document.createElement("span");n.className=`species-badge badge-${p.recoveryStatus}`,n.textContent=p.recoveryStatus.charAt(0).toUpperCase()+p.recoveryStatus.slice(1),a.appendChild(n);const o=document.createElement("span");o.className="species-badge badge-iucn",o.textContent=p.iucnCategory,a.appendChild(o),e.appendChild(a);const c=document.createElement("span");return c.className="species-region",c.textContent=p.region,e.appendChild(c),e}createSummarySection(p){const e=document.createElement("div");e.className="species-summary";const t=document.createElement("p");t.textContent=p.summaryText,e.appendChild(t);const s=document.createElement("cite");return s.className="species-source",s.textContent=p.source,e.appendChild(s),e}renderSparkline(p,e,t){if(e.length<2)return;const s=280,a=s-T.left-T.right,n=Yt,c=at(p).append("svg").attr("width","100%").attr("height",n+T.top+T.bottom).attr("viewBox",`0 0 ${s} ${n+T.top+T.bottom}`).attr("preserveAspectRatio","xMidYMid meet").style("display","block").append("g").attr("transform",`translate(${T.left},${T.top})`),m=st(e,b=>b.year),v=we(e,b=>b.value),l=v*.1,g=q().domain(m).range([0,a]),$=q().domain([0,v+l]).range([n,0]),f=it().x(b=>g(b.year)).y0(n).y1(b=>$(b.value)).curve(ce),y=nt().x(b=>g(b.year)).y(b=>$(b.value)).curve(ce);c.append("path").datum(e).attr("d",f).attr("fill",t).attr("opacity",.2),c.append("path").datum(e).attr("d",y).attr("fill","none").attr("stroke",t).attr("stroke-width",1.5);const C=e[0];c.append("text").attr("x",g(C.year)).attr("y",n+T.bottom-2).attr("text-anchor","start").attr("font-size","9px").attr("fill","var(--text-dim, #999)").text(`${C.year}: ${ge().format(C.value)}`);const x=e[e.length-1];c.append("text").attr("x",g(x.year)).attr("y",n+T.bottom-2).attr("text-anchor","end").attr("font-size","9px").attr("fill","var(--text-dim, #999)").text(`${x.year}: ${ge().format(x.value)}`)}destroy(){super.destroy()}}const Rs=Object.freeze(Object.defineProperty({__proto__:null,SpeciesComebackPanel:Xt},Symbol.toStringTag,{value:"Module"}));export{ws as C,bs as D,_s as G,As as I,Ss as P,ks as R,ys as S,Es as T,Ts as W,$s as a,Cs as b,xs as c,Ls as d,Os as e,Ns as f,Ds as g,Is as h,Ms as i,Fs as j,Rs as k};
