/* TrainTanmay Physics – OCR A (H556 / H156) revision app */
(function(){
'use strict';
const SP=window.SPEC, LABS=window.LABS||{}, PG=window.PAGS, LK=window.LK;
const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const h=html=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const strip=s=>String(s||'').replace(/<svg[\s\S]*?<\/svg>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const T=SP.topics, byId=Object.fromEntries(T.map(t=>[t.id,t])), MODS=SP.modules;
T.forEach(t=>{ t.labs=(t.labs||[]).filter(id=>LABS[id]); t.pags=(t.pags||[]).filter(id=>PG.list.some(p=>p.id===id)); });
const ALLQ=T.flatMap(t=>(t.exam||[]).map(q=>Object.assign(q,{topic:t.id})));
const qById=Object.fromEntries(ALLQ.map(q=>[q.id.replace(/\./g,'_'),q])); const qKey=id=>id.replace(/\./g,'_');
const ALLMCQ=T.flatMap(t=>(t.mcq||[]).map((q,i)=>Object.assign(q,{topic:t.id,id:t.id+'-m'+i})));
const CARDS=T.flatMap(t=>[...(t.terms||[]).map(([a,b],i)=>({id:t.id+'-t'+i,topic:t.id,front:a,back:b,kind:'Definition'})),...(t.eqs||[]).map(([e,m],i)=>({id:t.id+'-e'+i,topic:t.id,front:m,back:e,kind:'Equation',html:true}))]);

/* ---------- storage ---------- */
const KEY='tt-phys-progress-v1';
let S={revised:{},conf:{},flash:{},quiz:[],exam:{},answers:{},days:[],settings:{theme:'system',dys:false}};
try{ const raw=localStorage.getItem(KEY); if(raw){ const p=JSON.parse(raw); S=Object.assign(S,p); S.settings=Object.assign({theme:'system',dys:false},p.settings||{}); } }catch(e){}
let st=null; const save=()=>{ clearTimeout(st); st=setTimeout(()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} },150); };
const touchDay=()=>{ const d=new Date().toISOString().slice(0,10); if(!S.days.includes(d)){ S.days.push(d); if(S.days.length>400) S.days=S.days.slice(-400); save(); } };
const streak=()=>{ const set=new Set(S.days); let n=0; const d=new Date(); if(!set.has(d.toISOString().slice(0,10))) d.setDate(d.getDate()-1); while(set.has(d.toISOString().slice(0,10))){ n++; d.setDate(d.getDate()-1); } return n; };
const applyTheme=()=>{ const t=S.settings.theme; if(t==='system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t); window.dispatchEvent(new Event('themechange')); };
const applyDys=()=>document.documentElement.classList.toggle('dys',!!S.settings.dys);
applyTheme(); applyDys();
const toast=msg=>{ const el=h(`<div class="toast" role="status">${esc(msg)}</div>`); document.body.appendChild(el); setTimeout(()=>el.remove(),2600); };

/* ---------- capabilities ---------- */
let sampleCap=null;


/* ---------- question bank ---------- */
const BK=window.BANKUI?window.BANKUI({S,save,esc,h,$,$$,toast,byId,T,MODS,ALLQ,sample:()=>sampleCap}):null;

/* ---------- icons ---------- */
const I={
 menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 logo:'<svg viewBox="0 0 48 48" role="img" aria-label="TrainTanmay logo"><rect x="1" y="1" width="46" height="46" rx="11" fill="var(--brand)"/><path d="M8 10h22v6h-7.6v24h-6.8V16H8z" fill="var(--brand-ink)"/><path d="M33.2 19.5h5.2v4.6h4.2v4.3h-4.2v6.4c0 1.4.6 1.9 1.9 1.9.8 0 1.6-.1 2.3-.3v4.3c-1 .3-2.3.5-3.6.5-3.9 0-5.8-1.9-5.8-5.6v-7.2H30.6v-4.3h2.6z" fill="var(--logo-t,#ffc6dd)"/></svg>'
};
const PSWSET=new Set(['ripple','wave','string','superpose','stationary','resonance','absorb','p5-2','p10-2']);
const PSW=lab=>`<div class="psw" role="note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20L12 3zm0 6v6m0 3v.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><p><b>Photosensitivity warning.</b> This ${lab?'simulation':'practical'} contains moving patterns and animation that may affect people with photosensitive epilepsy. ${lab?'Use ❚❚ to pause or ×0.25 to slow it down.':'You can read the Method tab without running the animation.'}</p></div>`;
const NAV=[['home','Home'],['topics','Topics'],['labs','Labs'],['pags','Practicals'],['bank','Practice questions'],['mock','Practice tests'],['flash','Flashcards'],['quiz','Quiz'],['videos','Videos'],['papers','Past papers'],['sheet','Data sheet'],['progress','Progress']];
const NI={
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
 topics:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h7"/>',
 labs:'<path d="M9 3h6"/><path d="M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
 pags:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2"/><path d="M8.5 11l2 2 4-4"/><path d="M8.5 17h7"/>',
 bank:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9"/><path d="M10 13h4"/>',
 mock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M10 2h4"/>',
 flash:'<rect x="3" y="7" width="14" height="12" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
 quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
 exam:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
 videos:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>',
 papers:'<path d="M7 3h10v4H7z"/><path d="M5 7h14v14H5z"/><path d="M9 12h6M9 16h6"/>',
 sheet:'<path d="M18 4H6l6 8-6 8h12"/>',
 progress:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'};
const navIcon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NI[k]||''}</svg>`;

/* ---------- shell ---------- */
const app=$('#app');
app.innerHTML=`<header class="topbar"><div class="wrap"><a class="brand" href="#home">${I.logo}<span><b>TrainTanmay</b><small>OCR A Physics · H556</small></span></a>
<nav class="nav" aria-label="Main">${NAV.map(([k,l])=>`<a href="#${k}" data-k="${k}" aria-label="${l}" title="${l}">${navIcon(k)}<span class="nl">${l}</span></a>`).join('')}</nav>
<div class="tb-right"><a class="iconbtn" href="#search" aria-label="Search">${I.search}</a><button class="iconbtn dysbtn" id="dys" aria-pressed="${!!S.settings.dys}" title="Dyslexia-friendly font">Aa</button>
<select class="theme-select" id="theme" aria-label="Theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option><option value="blush">Blush</option></select>
<button class="iconbtn menubtn" id="menu" aria-label="Menu">${I.menu}</button></div></div></header>
<main class="wrap"><div id="view"></div></main>
<footer class="footer"><div class="wrap row" style="justify-content:space-between"><span>TrainTanmay Physics · Made by Tanmay Vashishtha · <i id="fpun"></i> · OCR A Level Physics A (H556) and AS (H156). Progress is saved in this browser.</span><span>Past papers and topic questions link to <a href="https://www.physicsandmathstutor.com/physics-revision/a-level-ocr-a/" target="_blank" rel="noopener">Physics &amp; Maths Tutor</a>.</span></div></footer>`;
$('#theme').value=S.settings.theme; $('#theme').onchange=e=>{ S.settings.theme=e.target.value; save(); applyTheme(); };
$('#dys').onclick=e=>{ S.settings.dys=!S.settings.dys; e.currentTarget.setAttribute('aria-pressed',S.settings.dys); applyDys(); save(); window.dispatchEvent(new Event('themechange')); };
const drawer=$('#drawer');
$('#menu').onclick=()=>{ drawer.innerHTML=`<div class="drawer-panel" role="dialog" aria-label="Menu">${NAV.map(([k,l])=>`<a href="#${k}" data-k="${k}">${l}</a>`).join('')}<a href="#search">Search</a><label class="field" style="margin-top:10px" for="theme2">Theme<select id="theme2" class="theme-select"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option><option value="blush">Blush</option></select></label></div>`; drawer.hidden=false; const t2=$('#theme2'); t2.value=S.settings.theme; t2.onchange=e=>{ S.settings.theme=e.target.value; $('#theme').value=e.target.value; save(); applyTheme(); }; markNav(); };
drawer.addEventListener('click',e=>{ if(e.target===drawer||e.target.closest('a')) drawer.hidden=true; });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') drawer.hidden=true; });
function markNav(){ const r=(location.hash||'#home').slice(1); const k=r.startsWith('pq-')?'bank':r.startsWith('mockr')?'mock':r.startsWith('t-')?'topics':r.startsWith('lab-')?'labs':r.startsWith('pag-')?'pags':r.startsWith('q-')?'bank':r; $$('[data-k]').forEach(a=>{ if(a.dataset.k===k) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); }

let cleanup=null;
const FPUN=['Powered by caffeine and conservation of energy.','No electrons were harmed in the making of this site.','Built with constant acceleration.','Running at the speed of light (in a vacuum).','100% renewable revision.'];
function route(){ if(cleanup){ try{cleanup();}catch(e){} cleanup=null; } const dsp=document.getElementById('dspanel'); if(dsp) dsp.remove();
  const r=(location.hash||'#home').slice(1)||'home'; const v=$('#view'); v.innerHTML=''; v.style.animation='none'; void v.offsetWidth; v.style.animation='';
  touchDay(); markNav();
  if(r==='home') viewHome(v); else if(r==='topics') viewTopics(v); else if(r.startsWith('t-')) viewTopic(v,r.slice(2)); else if(r==='labs') viewLabs(v); else if(r.startsWith('lab-')) viewLab(v,r.slice(4));
  else if(r==='pags') viewPags(v); else if(r.startsWith('pag-')) viewPag(v,r.slice(4)); else if(r==='flash') viewFlash(v); else if(r==='quiz') viewQuiz(v); else if(r==='exam'){ sessionStorage.setItem('tt-bankf',JSON.stringify({src:'tt'})); location.replace('#bank'); return; } else if(r.startsWith('q-')){ location.replace('#pq-w_'+r.slice(2)); return; }
  else if(r==='bank'&&BK) BK.viewBank(v); else if(r.startsWith('pq-')&&BK) BK.viewBankQ(v,r.slice(3)); else if(r==='mock'&&BK) BK.viewMock(v); else if(r.startsWith('mockrun-')&&BK) cleanup=BK.viewMockRun(v,r.slice(8)); else if(r.startsWith('mockres-')&&BK) BK.viewMockRes(v,r.slice(8)); else if(r==='videos'||r.startsWith('videos_')) viewVideos(v,r.split('_')[1]); else if(r==='papers') viewPapers(v); else if(r==='sheet') viewSheet(v); else if(r==='progress') viewProgress(v); else if(r==='search') viewSearch(v); else viewHome(v);
  if(BK&&!r.startsWith('mockrun-')) BK.resumeBar(v); const fp=document.getElementById('fpun'); if(fp) fp.textContent=pick(FPUN);
  window.scrollTo(0,0); }
window.addEventListener('hashchange',route);

/* ---------- helpers ---------- */
const topicLink=id=>`<a class="chip brand" href="#t-${id}">${id} ${esc(byId[id].title)}</a>`;
const topicConf=id=>S.conf[id]||'';
const practiceOf=id=>(BK&&BK.score)?BK.score(id):{got:0,max:0,n:0};
const topicPct=t=>{ let n=0,d=0; d++; if(S.revised[t.id]) n++; const fc=CARDS.filter(c=>c.topic===t.id); d++; n+=fc.length?fc.filter(c=>(S.flash[c.id]||{}).box>=3).length/fc.length:0; const ps=practiceOf(t.id); d++; n+=ps.max?(ps.got/ps.max)*Math.min(1,ps.n/8):0; d++; n+=S.conf[t.id]==='g'?1:S.conf[t.id]==='a'?0.5:0; return Math.round(n/d*100); };
const overall=()=>Math.round(T.reduce((a,t)=>a+topicPct(t),0)/T.length);
const labCard=id=>{ const L=LABS[id]; return `<a class="labcard" href="#lab-${id}"><div class="thumb"><svg viewBox="0 0 120 120" aria-hidden="true">${L.icon||''}</svg></div><div class="txt"><span class="eyebrow">${esc(L.cat)} · ${esc(L.topic)}</span><h4>${esc(L.title)}</h4><p>${esc(L.desc)}</p></div></a>`; };
const pagCard=p=>`<a class="tcard" href="#pag-${p.id}"><span class="id">PAG ${p.pag} · ${p.id.replace('p','').replace('-','.')}</span><h4>${esc(p.title)}</h4><p>${esc(p.aim)}</p><div class="meta"><span>Topic ${p.topic}</span></div></a>`;
const dueCards=list=>list.filter(c=>{ const f=S.flash[c.id]; return !f||f.due<=Date.now(); });

/* ---------- HOME ---------- */

/* puns everywhere */
const pick=l=>l[Math.floor(Math.random()*l.length)];
const TPUN={'1.1':'Precisely the right place. Accurately, too.','2.1':'SI-ing is believing.','2.2':'Plot twist: it’s a straight line through the origin.','2.3':'Vectors: you’ve got to have direction in life.','3.1':'Accelerate your revision. Uniformly.','3.2':'May the (resultant) force be with you.','3.3':'Work done = energy transferred. Revision done = grades transferred.','3.4':'Under stress? That’s a strain. Take a break before you hit the yield point.','3.5':'Gaining momentum, and conserving it.','4.1':'Current events, explained.','4.2':'Resistance is not futile. It’s ρL/A.','4.3':'Kirchhoff’s first law: what goes in must come out. Like revision.','4.4':'Catch the wave, superpose your knowledge.','4.5':'Quantum physics: you either get it or you don’t. No in-between levels.','5.1':'Things are heating up. Specifically, by mcΔθ.','5.2':'Going round in circles? That’s the point here.','5.3':'Good vibrations, simple harmonic ones.','5.4':'Fall for gravity. Everything else does.','5.5':'Out of this world, by Hubble’s law.','6.1':'Fully charged and ready to discharge some knowledge.','6.2':'Feeling the field? That’s potential.','6.3':'Simply magnetic. Fleming would be proud.','6.4':'This topic is quark-y, but it has its charm.','6.5':'X-ray vision unlocked. Results may be attenuated.'};
const PUN_EMPTY=['Nothing here: a perfect vacuum.','Zero results. Absolute zero, in fact.','Empty as interstellar space. Try widening the filters.'];
const PUN_HI=['Electrifying!','Absolutely radiant.','Top marks: you’re on a higher energy level.','You’re in resonance with the spec.'];
const PUN_MID=['Good momentum. Keep it conserved.','Solid progress, no stress (or strain).','Halfway up the potential well: keep climbing.'];
const PUN_LO=['Every great physicist started at rest.','Don’t lose your potential: have another go.','Errors are just uncertainties waiting to shrink.'];
const punFor=p=>pick(p>=80?PUN_HI:p>=50?PUN_MID:PUN_LO);
window.TTPUN={pick,punFor,PUN_EMPTY};
const PUNS=['Revision with real momentum.','Resistance is not futile: it is V/I.','Stay positive, like a proton.','No stationary waves here: just progress.','Every topic, fully charged.','Find your natural frequency and resonate.','Keep calm and conserve energy.','Small steps, constant acceleration.','Physics puns? I’ve got loads, and they’re all under tension.','Don’t trust atoms: they make up everything.','Revise now, thank yourself in the potential well later.','A body at rest stays at rest, so get moving.','Watt are you waiting for?','Ohm sweet ohm.','Feeling negative? Take an electron off.','Your grades are about to experience a large upthrust.','Every question has a reaction: equal and opposite.','Light travels fast. Your revision can too.','Gravity: it’s not just a good idea, it’s the law.','Neutrons revise for free: no charge.','We’ve got the best puns. Period.','Don’t be a resistor: let the knowledge flow.','Stay grounded. Earth wire optional.','Results so good they’ll be off the scale.','Turning potential into kinetic since 2026.','Cooler than absolute zero. Well, almost.','Mass-ive progress incoming.','Hertz so good.'];
function viewHome(v){
  const fcDue=dueCards(CARDS).length, quizBest=S.quiz.length?Math.max(...S.quiz.map(q=>Math.round(q.s/q.n*100))):null, examDone=Object.values(S.exam).filter(x=>x.got!=null).length;
  const nextT=T.find(t=>!S.revised[t.id])||T[0];
  v.innerHTML=`<section class="hero"><div class="hero-text"><span class="eyebrow">OCR A Level Physics A · H556 and AS H156</span><h1>TrainTanmay Physics</h1><p class="pun" id="pun" aria-live="off"></p>
  <p>Every learning outcome across the six modules with diagrams, equations and definitions, ${Object.keys(LABS).length} interactive labs, ${PG.list.length} simulated PAG practicals, ${BK?BK.count.toLocaleString()+' real exam questions with mark schemes and a practice test builder, ':''}and links to every OCR past paper on Physics &amp; Maths Tutor.</p>
  <div class="row"><a class="btn primary" href="#t-${nextT.id}">Continue with ${nextT.id} ${esc(nextT.title)}</a><a class="btn" href="#labs">Open the labs</a></div></div>
  <div class="hero-scopewrap"><a class="hero-scope hero-shuttle" href="#lab-missions" title="Explore the Famous space missions lab"><svg class="shuttle-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Pink space shuttle: explore the famous space missions lab"><defs><radialGradient id="sky" cx=".7" cy=".25" r="1"><stop offset="0" stop-color="#1c3a7a"/><stop offset=".6" stop-color="#0d2050"/><stop offset="1" stop-color="#071234"/></radialGradient><radialGradient id="flm" cx="1" cy=".5" r="1"><stop offset="0" stop-color="#fff0f6"/><stop offset=".35" stop-color="#ff7ab0"/><stop offset="1" stop-color="#d81b60" stop-opacity="0"/></radialGradient><linearGradient id="bod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6f1"/><stop offset="1" stop-color="#f7bfd8"/></linearGradient></defs>
<rect width="400" height="260" fill="url(#sky)"/><g class="sh-stars"><circle cx="169" cy="246" r="1" fill="#fff" opacity="0.9"/><circle cx="337" cy="16" r="0.8" fill="#fff" opacity="0.35"/><circle cx="191" cy="153" r="0.8" fill="#fff" opacity="0.5"/><circle cx="23" cy="26" r="1.6" fill="#fff" opacity="0.9"/><circle cx="39" cy="65" r="0.8" fill="#fff" opacity="0.9"/><circle cx="34" cy="215" r="0.8" fill="#fff" opacity="0.5"/><circle cx="326" cy="164" r="0.8" fill="#fff" opacity="0.9"/><circle cx="29" cy="253" r="1" fill="#fff" opacity="0.35"/><circle cx="289" cy="223" r="1" fill="#fff" opacity="0.7"/><circle cx="218" cy="40" r="0.8" fill="#fff" opacity="0.7"/><circle cx="290" cy="212" r="1" fill="#fff" opacity="0.35"/><circle cx="301" cy="150" r="1" fill="#fff" opacity="0.7"/><circle cx="53" cy="144" r="0.8" fill="#fff" opacity="0.35"/><circle cx="320" cy="56" r="1.6" fill="#fff" opacity="0.9"/><circle cx="164" cy="123" r="1.6" fill="#fff" opacity="0.7"/><circle cx="157" cy="67" r="1" fill="#fff" opacity="0.5"/><circle cx="45" cy="151" r="1.2" fill="#fff" opacity="0.9"/><circle cx="179" cy="190" r="1.6" fill="#fff" opacity="0.7"/><circle cx="315" cy="254" r="0.8" fill="#fff" opacity="0.35"/><circle cx="266" cy="111" r="1" fill="#fff" opacity="0.7"/><circle cx="81" cy="242" r="1.6" fill="#fff" opacity="0.9"/><circle cx="24" cy="250" r="0.8" fill="#fff" opacity="0.7"/><circle cx="178" cy="181" r="1.2" fill="#fff" opacity="0.9"/><circle cx="300" cy="208" r="1.6" fill="#fff" opacity="0.35"/><circle cx="51" cy="245" r="1.2" fill="#fff" opacity="0.9"/><circle cx="360" cy="174" r="0.8" fill="#fff" opacity="0.35"/><circle cx="378" cy="183" r="1.2" fill="#fff" opacity="0.9"/><circle cx="149" cy="187" r="1.6" fill="#fff" opacity="0.7"/><circle cx="15" cy="244" r="1.6" fill="#fff" opacity="0.7"/><circle cx="90" cy="160" r="0.8" fill="#fff" opacity="0.9"/><circle cx="34" cy="59" r="1.2" fill="#fff" opacity="0.5"/><circle cx="382" cy="67" r="1.6" fill="#fff" opacity="0.9"/><circle cx="258" cy="24" r="1" fill="#fff" opacity="0.9"/><circle cx="209" cy="144" r="1.2" fill="#fff" opacity="0.5"/><circle cx="224" cy="225" r="1.2" fill="#fff" opacity="0.9"/><circle cx="187" cy="178" r="1.6" fill="#fff" opacity="0.5"/><circle cx="81" cy="25" r="1" fill="#fff" opacity="0.5"/><circle cx="122" cy="172" r="1" fill="#fff" opacity="0.35"/><circle cx="252" cy="216" r="1" fill="#fff" opacity="0.7"/><circle cx="148" cy="5" r="1" fill="#fff" opacity="0.9"/><circle cx="277" cy="98" r="1.2" fill="#fff" opacity="0.5"/><circle cx="357" cy="223" r="0.8" fill="#fff" opacity="0.9"/><circle cx="352" cy="208" r="1.6" fill="#fff" opacity="0.9"/><circle cx="208" cy="104" r="0.8" fill="#fff" opacity="0.9"/><circle cx="328" cy="106" r="0.8" fill="#fff" opacity="0.5"/><circle cx="38" cy="256" r="1" fill="#fff" opacity="0.9"/><circle cx="87" cy="32" r="1.2" fill="#fff" opacity="0.35"/><circle cx="56" cy="4" r="1" fill="#fff" opacity="0.35"/><circle cx="190" cy="161" r="0.8" fill="#fff" opacity="0.35"/><circle cx="110" cy="161" r="1.6" fill="#fff" opacity="0.5"/><circle cx="328" cy="68" r="1.2" fill="#fff" opacity="0.7"/><circle cx="246" cy="35" r="0.8" fill="#fff" opacity="0.9"/><circle cx="242" cy="126" r="1.6" fill="#fff" opacity="0.7"/><circle cx="47" cy="40" r="0.8" fill="#fff" opacity="0.7"/><circle cx="383" cy="71" r="1.6" fill="#fff" opacity="0.5"/><circle cx="268" cy="9" r="1" fill="#fff" opacity="0.7"/><circle cx="79" cy="180" r="0.8" fill="#fff" opacity="0.7"/><circle cx="333" cy="225" r="0.8" fill="#fff" opacity="0.7"/><circle cx="269" cy="97" r="1" fill="#fff" opacity="0.7"/><circle cx="118" cy="140" r="1.2" fill="#fff" opacity="0.5"/><circle cx="317" cy="211" r="1" fill="#fff" opacity="0.5"/><circle cx="209" cy="193" r="1" fill="#fff" opacity="0.5"/><circle cx="269" cy="130" r="1.2" fill="#fff" opacity="0.35"/><circle cx="18" cy="206" r="1.2" fill="#fff" opacity="0.9"/><circle cx="136" cy="53" r="1.2" fill="#fff" opacity="0.9"/><circle cx="374" cy="256" r="1.2" fill="#fff" opacity="0.7"/><circle cx="45" cy="60" r="0.8" fill="#fff" opacity="0.5"/><circle cx="244" cy="54" r="1.2" fill="#fff" opacity="0.5"/><circle cx="251" cy="163" r="0.8" fill="#fff" opacity="0.9"/><circle cx="338" cy="92" r="0.8" fill="#fff" opacity="0.35"/></g>
<circle cx="352" cy="44" r="22" fill="#f7bfd8" opacity=".9"/><circle cx="344" cy="38" r="4" fill="#e3a3c0"/><circle cx="360" cy="52" r="3" fill="#e3a3c0"/>
<g class="sh-craft" transform="rotate(-12 200 130)">
 <g class="sh-flame"><ellipse cx="38" cy="122" rx="34" ry="9" fill="url(#flm)"/><ellipse cx="40" cy="138" rx="30" ry="8" fill="url(#flm)"/></g>
 <path d="M70,58 L94,58 L104,108 L70,108 Z" fill="url(#bod)" stroke="#140a10" stroke-width="2.5" stroke-linejoin="round"/><path d="M76,66 L92,66 L96,84 L76,84 Z" fill="#e0306f"/>
 <path d="M118,150 L236,150 L256,157 L118,196 L96,188 Z" fill="url(#bod)" stroke="#140a10" stroke-width="2.5" stroke-linejoin="round"/><path d="M236,150 L256,157 L118,196" fill="none" stroke="#140a10" stroke-width="6" stroke-linecap="round"/>
 <path d="M70,106 L282,106 Q322,108 340,126 Q344,131 340,137 Q322,154 282,156 L70,156 Z" fill="url(#bod)" stroke="#140a10" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M86,148 L284,148 Q312,146 330,140 Q320,154 282,156 L86,156 Z" fill="#140a10"/>
 <path d="M318,111 Q333,117 340,126 Q344,131 340,137 Q333,145 318,151 Q324,131 318,111 Z" fill="#140a10"/>
 <path d="M288,112 L302,114 L300,121 L287,120 Z M304,115 L314,118 L311,124 L302,122 Z" fill="#140a10"/>
 <rect x="96" y="129" width="190" height="7" fill="#e0306f"/>
 <text x="190" y="125" text-anchor="middle" font-family="Barlow Semi Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="19" letter-spacing="2" fill="#140a10">EXPLORE LAB</text>
 <text x="190" y="146" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-weight="600" font-size="8" letter-spacing="1.5" fill="#b0124f">FAMOUS SPACE MISSIONS</text>
 <rect x="56" y="112" width="15" height="11" rx="2" fill="#140a10"/><rect x="56" y="127" width="15" height="11" rx="2" fill="#140a10"/><rect x="60" y="141" width="11" height="8" rx="2" fill="#140a10"/>
</g></svg><span class="sh-cta">Explore lab: Apollo 11, Artemis II, Voyager 2 and more →</span></a>
  </div></section>
  <div class="statrow" style="margin-top:16px"><div class="stat"><b>${overall()}%</b><span>course progress</span></div><div class="stat"><b>${fcDue}</b><span>flashcards due</span></div><div class="stat"><b>${quizBest==null?'–':quizBest+'%'}</b><span>best quiz score</span></div><div class="stat"><b>${streak()}</b><span>day streak</span></div></div>
  <h2 style="margin:30px 0 12px">Modules</h2><div class="grid g3">${MODS.map(m=>{ const ts=T.filter(t=>t.mod===m.n); const p=Math.round(ts.reduce((a,t)=>a+topicPct(t),0)/ts.length); return `<a class="tcard" href="#topics" data-mod="${m.n}"><span class="id">Module ${m.n} · ${esc(m.papers)}</span><h4>${esc(m.title)}</h4><div class="bar"><i style="width:${p}%"></i></div><div class="meta"><span>${ts.length} topics${m.as?' · in AS':''}</span><span>${p}%</span></div></a>`; }).join('')}</div>
  <h2 style="margin:30px 0 12px">Jump into a lab</h2><div class="grid g4">${['missions','circuit','collide2d','photoelectric'].filter(id=>LABS[id]).map(labCard).join('')}</div>
  <h2 style="margin:30px 0 12px">Exam papers at a glance</h2><div class="grid g3">${SP.papers.slice(0,3).map(p=>`<div class="card"><span class="eyebrow">${esc(p.code)} · ${esc(p.time)} · ${p.marks} marks · ${esc(p.weight)}</span><h3 style="margin:4px 0 6px">${esc(p.name)}</h3><p class="muted" style="margin:0 0 8px;font-size:.9rem">${esc(p.mods)}. ${esc(p.fmt)}</p><a class="btn btn-sm" href="#papers">See papers</a></div>`).join('')}</div>`;
  $$('[data-mod]',v).forEach(a=>a.addEventListener('click',()=>{ sessionStorage.setItem('tt-mod',a.dataset.mod); }));
  const PP=PUNS.slice().sort(()=>Math.random()-.5); let pi=0; const pun=$('#pun'); pun.title='Click for another pun';
  const red=window.matchMedia('(prefers-reduced-motion: reduce)').matches; let tmr=null, alive=true;
  const later=(f,ms)=>{ tmr=setTimeout(()=>{ if(alive) f(); },ms); };
  function typeIt(str,i=0){ pun.classList.add('typing'); pun.textContent=str.slice(0,i); if(i<str.length) later(()=>typeIt(str,i+1),38+Math.random()*55); else later(()=>eraseIt(str,str.length),4200); }
  function eraseIt(str,i){ pun.textContent=str.slice(0,i); if(i>0) later(()=>eraseIt(str,i-1),18); else { pi=(pi+1)%PP.length; later(()=>typeIt(PP[pi]),300); } }
  let iv=null;
  if(red){ pun.textContent=PP[0]; iv=setInterval(()=>{ pi=(pi+1)%PP.length; pun.textContent=PP[pi]; },6000); pun.onclick=()=>{ pi=(pi+1)%PP.length; pun.textContent=PP[pi]; }; }
  else { typeIt(PP[0]); pun.onclick=()=>{ clearTimeout(tmr); eraseIt(pun.textContent,pun.textContent.length); }; }
  cleanup=()=>{ alive=false; clearTimeout(tmr); if(iv) clearInterval(iv); };
}
function scope(cv){ const ctx=cv.getContext('2d'); let run=true, t=0; const red=window.LK?window.LK.reduced():false;
  const tick=()=>{ if(!run) return; const r=cv.getBoundingClientRect(); const d=Math.min(2,devicePixelRatio||1); if(cv.width!==Math.round(r.width*d)){ cv.width=Math.round(r.width*d); cv.height=Math.round(r.height*d); } ctx.setTransform(d,0,0,d,0,0); const W=r.width,H=r.height;
    ctx.fillStyle='#12060c'; ctx.fillRect(0,0,W,H); ctx.strokeStyle='rgba(255,120,180,.32)'; ctx.lineWidth=1; for(let i=1;i<10;i++){ ctx.beginPath(); ctx.moveTo(i*W/10,0); ctx.lineTo(i*W/10,H); ctx.stroke(); } for(let i=1;i<8;i++){ ctx.beginPath(); ctx.moveTo(0,i*H/8); ctx.lineTo(W,i*H/8); ctx.stroke(); }
    const trace=(f,col,w)=>{ ctx.strokeStyle=col; ctx.lineWidth=w; ctx.shadowColor=col; ctx.shadowBlur=10; ctx.beginPath(); for(let x=0;x<=W;x+=2){ const y=f(x/W); x?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.stroke(); ctx.shadowBlur=0; };
    // 10 x 8 divisions. CH1: amplitude 1.5 div, period 4 div. CH2: amplitude 1 div, period 5 div.
    const dv=H/8; trace(u=>2.5*dv-Math.sin(2*Math.PI*(u*10/4)-t*0.6)*1.5*dv,'#ff5c9e',2.4);
    trace(u=>6*dv-Math.sin(2*Math.PI*(u*10/5)-t*0.5)*1*dv,'#7ff0e2',1.8);

    if(!red) t+=0.03; requestAnimationFrame(tick); };
  tick(); return ()=>{run=false;}; }

/* ---------- TOPICS ---------- */
function viewTopics(v){
  const want=sessionStorage.getItem('tt-mod'); sessionStorage.removeItem('tt-mod');
  v.innerHTML=`<span class="eyebrow">Specification content</span><h1>Topics</h1><p class="muted" style="max-width:74ch">All six modules of OCR A Level Physics A. AS (H156) covers modules 1–4. Coloured dots show your confidence rating for each topic.</p>
  <div class="stack" style="gap:28px;margin-top:18px">${MODS.map(m=>`<section class="mod" id="mod${m.n}"><div class="mod-head"><span class="mnum">${m.n}</span><h2>${esc(m.title)}</h2><span class="chip">${esc(m.papers)}</span>${m.as?'<span class="chip teal">AS and A level</span>':'<span class="chip ai">A level only</span>'}</div>
  <div class="grid g3">${T.filter(t=>t.mod===m.n).map(t=>`<a class="tcard" href="#t-${t.id}"><span class="id">${t.id}</span><h4>${esc(t.title)}</h4><p>${esc(t.short)}</p><div class="meta"><span><span class="rag ${topicConf(t.id)}"></span> ${topicPct(t)}%</span><span>${t.labs.length?t.labs.length+' lab'+(t.labs.length>1?'s':''):''}${t.pags.length?' · '+t.pags.length+' PAG':''}</span></div></a>`).join('')}</div></section>`).join('')}</div>`;
  if(want){ const el=$('#mod'+want); el&&el.scrollIntoView(); }
}

/* ---------- labs woven into the notes ---------- */
const STOPW=new Set('the and for with from into that this then than are was were has have its their your you can use using used how what when where which while about over under between through each all any not but per of to in on at by as an a or be is it'.split(' '));
const words=s=>String(s).toLowerCase().replace(/<[^>]+>/g,' ').match(/[a-zα-ω]{3,}/g)||[];
function weaveVids(art){ if(!art) return; const V=(window.MEDIA&&MEDIA.videos)||[]; art.querySelectorAll('.vidrec[data-vid]').forEach(el=>{ const x=V.find(v=>v.id===el.dataset.vid); if(!x){ el.remove(); return; } el.innerHTML=`<button type="button" class="vr-thumb" aria-label="Watch: ${esc(x.title)}"><img alt="" src="thumbs/${x.id}.jpg" onerror="this.remove()"><span class="vplay"><span>${PLAY}</span></span></button><div><span class="eyebrow">Recommended video</span><b>${esc(x.title)}</b><p>${esc(x.rec||'')}</p><button type="button" class="btn btn-sm primary">Watch it</button></div>`; el.querySelectorAll('button').forEach(b=>b.onclick=()=>openVideo(x)); }); }
function weaveLabs(art,t){ if(!art) return null; weaveVids(art);
  const items=t.labs.map(id=>({kind:'lab',id,title:LABS[id].title,desc:LABS[id].desc})).concat(t.pags.map(id=>{ const p=PG.list.find(x=>x.id===id); return p&&{kind:'pag',id,title:'PAG '+p.pag+': '+p.title,desc:p.aim}; }).filter(Boolean));
  if(!items.length) return null;
  const hs=Array.from(art.querySelectorAll(':scope > h2'));
  const secs=hs.map((h,i)=>{ const els=[h]; let n=h.nextElementSibling; while(n&&n.tagName!=='H2'){ els.push(n); n=n.nextElementSibling; } const head=new Set(words(h.textContent).filter(w=>!STOPW.has(w))); const body=new Set(els.flatMap(e=>words(e.textContent)).filter(w=>!STOPW.has(w))); return {h,last:els[els.length-1],head,body,n:0}; });
  const place={};
  items.forEach(it=>{ const ws=words(it.title+' '+it.desc).filter(w=>!STOPW.has(w)); let best=-1,bs=0; secs.forEach((s,i)=>{ let sc=0; ws.forEach(w=>{ const stem=w.slice(0,5); if([...s.head].some(x=>x.startsWith(stem))) sc+=3; else if([...s.body].some(x=>x.startsWith(stem))) sc+=1; }); sc-=s.n*0.5; if(sc>bs){ bs=sc; best=i; } }); if(bs<2) best=-1; if(best>=0) secs[best].n++; (place[best]=place[best]||[]).push(it); });
  const card=it=>`<aside class="labweave" data-kind="${it.kind}" data-id="${esc(it.id)}"><div class="lw-head"><span class="lw-ic" aria-hidden="true">${it.kind==='lab'?navIcon('labs'):navIcon('pags')}</span><div><span class="eyebrow">${it.kind==='lab'?'Try it in the lab':'Required practical'}</span><b>${esc(it.title)}</b><p>${esc(it.desc)}</p></div></div><div class="row lw-btns">${it.kind==='lab'?`<button type="button" class="btn btn-sm primary" data-run>Run it here</button>`:''}<a class="btn btn-sm" href="#${it.kind==='lab'?'lab':'pag'}-${esc(it.id)}">Open ${it.kind==='lab'?'full lab':'practical'} →</a></div><div class="lw-slot"></div></aside>`;
  Object.entries(place).forEach(([i,list])=>{ const html=list.map(card).join(''); if(+i>=0) secs[+i].last.insertAdjacentHTML('afterend',html); else art.insertAdjacentHTML('beforeend',`<h2>Labs and practicals for this topic</h2>${html}`); });
  let stop=null, open=null;
  const close=()=>{ if(stop){ try{ stop(); }catch(e){} stop=null; } if(open){ open.querySelector('.lw-slot').innerHTML=''; const b=open.querySelector('[data-run]'); if(b) b.textContent='Run it here'; open.classList.remove('on'); open=null; } };
  art.querySelectorAll('[data-run]').forEach(b=>b.onclick=()=>{ const box=b.closest('.labweave'); if(open===box){ close(); return; } close(); const id=box.dataset.id, L=LABS[id]; const slot=box.querySelector('.lw-slot'); slot.innerHTML=`${PSWSET.has(id)?PSW(1):''}<div class="lab inline"></div>`; L.id=id; stop=LK.frame(slot.querySelector('.lab'),L,(window.LABGUIDES||{})[id]); open=box; box.classList.add('on'); b.textContent='Close lab'; });
  return close; }
function viewTopic(v,id){
  const t=byId[id]; if(!t){ v.innerHTML='<div class="empty">Topic not found. <a href="#topics">All topics</a></div>'; return; }
  const ix=T.indexOf(t), prev=T[ix-1], next=T[ix+1]; const m=MODS.find(x=>x.n===t.mod);
  const tabs=[['notes','Notes'],['eqs','Equations',t.eqs.length],['terms','Key terms',t.terms.length],['fc','Flashcards'],['mcq','Quick quiz',t.mcq.length],['packs','Past paper packs',t.packs.length],['labs','Labs & practicals',t.labs.length+t.pags.length]].concat(BK&&BK.topicCount(t.id)?[['qb','Practice questions',BK.topicCount(t.id)]]:[]).concat(topicVids(t.id).length||topicCases(t.id).length?[['vids','Videos',topicVids(t.id).length]]:[]);
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#topics">Module ${t.mod}: ${esc(m.title)}</a> / ${t.id}</span><h1>${esc(t.title)}</h1><p class="muted" style="margin:6px 0 0">${esc(t.short)}</p>${TPUN[t.id]?`<p class="tpun">${esc(TPUN[t.id])}</p>`:''}</div><div class="row">${prev?`<a class="btn btn-sm" href="#t-${prev.id}">← ${prev.id}</a>`:''}${next?`<a class="btn btn-sm" href="#t-${next.id}">${next.id} →</a>`:''}</div></div>
  <div class="tabs" role="tablist">${tabs.map(([k,l,n],i)=>`<button role="tab" data-tab="${k}" aria-selected="${i===0}">${l}${n!=null?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>
  <div class="tp-layout"><div id="tabbody" style="min-width:0"></div><aside class="side">
   <div class="card specbox"><span class="eyebrow">Specification checklist</span><ol>${t.spec.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>
   <div class="card"><span class="eyebrow">How confident are you?</span><div class="conf">${[['r','Not yet'],['a','Getting there'],['g','Confident']].map(([k,l])=>`<button class="${k}" data-c="${k}" aria-pressed="${S.conf[t.id]===k}">${l}</button>`).join('')}</div>
   <label class="toggle" style="margin-top:12px" for="rev"><input type="checkbox" id="rev" ${S.revised[t.id]?'checked':''}> Notes revised</label></div>
   ${t.labs.length?`<div class="card"><span class="eyebrow">Try it in the lab</span><div class="stack" style="gap:6px;margin-top:6px">${t.labs.map(l=>`<a href="#lab-${l}">${esc(LABS[l].title)}</a>`).join('')}${t.pags.map(p=>{ const q=PG.list.find(x=>x.id===p); return `<a href="#pag-${p}">PAG ${q.pag}: ${esc(q.title)}</a>`; }).join('')}</div></div>`:''}
  </aside></div>`;
  $$('.conf button',v).forEach(b=>b.onclick=()=>{ S.conf[t.id]=b.dataset.c; save(); $$('.conf button',v).forEach(x=>x.setAttribute('aria-pressed',x===b)); });
  $('#rev').onchange=e=>{ S.revised[t.id]=e.target.checked; save(); };
  const body=$('#tabbody'); let sub=null;
  const show=k=>{ if(sub){ try{sub();}catch(e){} sub=null; } $$('[data-tab]',v).forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===k)); body.innerHTML=''; const lay=$('.tp-layout',v); lay.classList.toggle('solo',k!=='notes');
    if(k==='notes'){ body.innerHTML=`<article class="notes">${t.notes}</article>`; sub=weaveLabs($('article.notes',body),t); }
    if(k==='eqs') body.innerHTML=`<p class="muted">Equations for this topic. Most are in the OCR Data, Formulae and Relationships booklet, but you must know how and when to use them.</p><div class="eqlist">${t.eqs.map(([e,m])=>`<div class="eq"><b>${e}</b><span>${esc(m)}</span></div>`).join('')}</div>`;
    if(k==='terms') body.innerHTML=`<p class="muted">Definitions examiners expect word for word. Learn the key phrases.</p><div class="terms">${t.terms.map(([a,b])=>`<div class="term"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>`;
    if(k==='fc') sub=flashDeck(body,CARDS.filter(c=>c.topic===t.id));
    if(k==='mcq') sub=runQuiz(body,t.mcq.slice(),t.id);
    if(k==='exam') body.innerHTML=`<p class="muted">Exam-style questions written in the style of OCR H556/H156 papers, with full mark schemes. For the real thing, open the past paper packs tab.</p><div class="ql">${t.exam.map(qItem).join('')}</div>`;
    if(k==='packs') body.innerHTML=packsBlock(t);
    if(k==='qb'){ const n=BK.topicCount(t.id); body.innerHTML=`<div class="card"><h3 style="margin:0 0 6px">${n} practice questions on ${esc(t.title)}</h3><p class="muted" style="margin:0 0 12px">Real past-paper questions from the PMT topic packs plus exam-style questions written for this topic, all with mark schemes. Only questions that stay entirely within this topic are included, so nothing from other topics comes up.</p><div class="row"><a class="btn primary" href="#bank" id="qbgo">Practise questions</a><a class="btn" href="#mock" id="qbmock">Practice test on this topic</a></div></div>`; $('#qbgo').onclick=()=>sessionStorage.setItem('tt-bankf',JSON.stringify({t:t.id})); $('#qbmock').onclick=()=>sessionStorage.setItem('tt-mockpre',JSON.stringify({topics:[t.id]})); }
    if(k==='vids'){ const tv=topicVids(t.id), tc=topicCases(t.id); body.innerHTML=`${vSections(tv)}${tc.length?`<h3 style="margin:20px 0 10px">Real-world examples</h3><div class="casegrid">${tc.map(caseCard).join('')}</div>`:''}<p class="muted" style="margin-top:14px"><a href="#videos_${t.mod}">All Module ${t.mod} videos →</a></p>`; bindVids(body); }
    if(k==='labs') body.innerHTML=`${t.labs.length?`<h3 style="margin-bottom:10px">Interactive labs</h3><div class="grid g3">${t.labs.map(labCard).join('')}</div>`:''}${t.pags.length?`<h3 style="margin:22px 0 10px">Required practicals (PAGs)</h3><div class="grid g3">${t.pags.map(p=>pagCard(PG.list.find(x=>x.id===p))).join('')}</div>`:''}${!t.labs.length&&!t.pags.length?'<div class="empty">No lab for this topic yet.</div>':''}`;
  };
  $$('[data-tab]',v).forEach(b=>b.onclick=()=>show(b.dataset.tab)); show('notes');
  cleanup=()=>{ if(sub) sub(); };
}
function packsBlock(t){ const sets={}; t.packs.forEach(p=>{ (sets[p.set]=sets[p.set]||[]).push(p); });
  const desc={'Set O 2022–24':'OCR A questions from the 2022–2024 papers.','Set N 2016–21':'OCR A questions from the 2016–2021 papers.'};
  return `<p class="muted" style="max-width:72ch">Real exam questions sorted by topic, compiled by Physics &amp; Maths Tutor. QP = question paper, MS = mark scheme. Legacy sets come from the old OCR specification (G481–G485) and only include questions that match this topic.</p>${Object.entries(sets).map(([s,arr])=>`<h3 style="margin:18px 0 8px">${esc(s)}</h3>${desc[s]?`<p class="muted" style="margin:0 0 8px;font-size:.9rem">${desc[s]}</p>`:''}<div class="packgrid">${arr.map(p=>`<a class="pack" href="${esc(p.url)}" target="_blank" rel="noopener"><span>${esc(p.label)}</span><small>${/MS$/.test(p.label)?'MS':'QP'} ${I.ext.replace('<svg','<svg width="12" height="12"')}</small></a>`).join('')}</div>`).join('')}`; }
const qItem=q=>{ const r=S.exam[q.id]||{}; return `<a class="qitem" href="#q-${qKey(q.id)}"><span class="qid">${esc(q.id)}</span><span class="qt"><b>${esc(q.style)}</b> · ${esc(q.stem)}</span><span class="qm">${r.got!=null?`<span class="chip good">${r.got}/${q.marks}</span>`:q.marks+' marks'}</span></a>`; };

/* ---------- FLASHCARDS ---------- */
const BOXDAYS=[0,1,2,4,8,16];
function flashDeck(el,cards){
  let queue=dueCards(cards); if(!queue.length) queue=cards.slice();
  queue=queue.sort(()=>Math.random()-0.5); let i=0, flipped=false;
  const render=()=>{ if(!cards.length){ el.innerHTML='<div class="empty">No cards.</div>'; return; }
    const c=queue[i%queue.length]; const box=(S.flash[c.id]||{}).box||0; const counts=BOXDAYS.map((_,b)=>cards.filter(x=>((S.flash[x.id]||{}).box||0)===b).length);
    el.innerHTML=`<div class="boxes">${counts.map((n,b)=>`<span>Box ${b}: ${n}</span>`).join('')}</div><div class="fc-stage"><div class="fc ${flipped?'flip':''}" id="fc" tabindex="0" role="button" aria-label="Flip card"><div class="fc-face"><span class="eyebrow">${c.kind} · ${c.topic} ${esc(byId[c.topic].title)}</span><div class="q">${c.kind==='Equation'?'Write the equation for: '+esc(c.front):'Define: '+esc(c.front)}</div><span class="muted" style="font-size:.85rem">Tap or press space to flip</span></div><div class="fc-face back"><span class="eyebrow">Answer · box ${box}</span><div class="a" style="${c.kind==='Equation'?'font-family:var(--f-mono);font-size:1.4rem;font-weight:600':''}">${c.html?c.back:esc(c.back)}</div></div></div>
    <div class="fc-controls"><button class="btn" id="again">Didn’t know it</button><button class="btn primary" id="good">Knew it</button><button class="btn ghost" id="skip">Skip</button></div><p class="muted" style="text-align:center;font-size:.85rem">${queue.length} card${queue.length>1?'s':''} in this session · card ${i%queue.length+1}</p></div>`;
    const fc=$('#fc',el); fc.onclick=()=>{ flipped=!flipped; fc.classList.toggle('flip',flipped); }; fc.onkeydown=e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); fc.click(); } };
    const grade=ok=>{ const f=S.flash[c.id]||{box:0}; f.box=ok?Math.min(5,f.box+1):0; f.due=Date.now()+BOXDAYS[f.box]*864e5; S.flash[c.id]=f; save(); i++; flipped=false; render(); };
    $('#again',el).onclick=()=>grade(false); $('#good',el).onclick=()=>grade(true); $('#skip',el).onclick=()=>{ i++; flipped=false; render(); }; };
  render(); return ()=>{};
}
function viewFlash(v){
  v.innerHTML=`<span class="eyebrow">Spaced repetition</span><h1>Flashcards</h1><p class="muted" style="max-width:72ch">${CARDS.length} cards: every definition and equation in the course. Cards you know move up a box and come back less often (Leitner system).</p>
  <div class="filters"><label class="field" for="fmod">Module<select id="fmod"><option value="">All modules</option>${MODS.map(m=>`<option value="${m.n}">Module ${m.n}: ${esc(m.short)}</option>`).join('')}</select></label><label class="field" for="fkind">Cards<select id="fkind"><option value="">Definitions and equations</option><option value="Definition">Definitions only</option><option value="Equation">Equations only</option></select></label><span class="muted" id="fdue"></span></div><div id="deck"></div>`;
  let sub=null; const go=()=>{ if(sub) sub(); const m=$('#fmod').value, k=$('#fkind').value; const list=CARDS.filter(c=>(!m||byId[c.topic].mod===+m)&&(!k||c.kind===k)); $('#fdue').textContent=dueCards(list).length+' due now'; sub=flashDeck($('#deck'),list); };
  $('#fmod').onchange=go; $('#fkind').onchange=go; go(); cleanup=()=>sub&&sub();
}

/* ---------- QUIZ ---------- */
function runQuiz(el,qs,label){
  qs=qs.sort(()=>Math.random()-0.5); let i=0, score=0, answered=false;
  const render=()=>{ if(i>=qs.length){ const pct=Math.round(score/qs.length*100); S.quiz.push({s:score,n:qs.length,t:Date.now(),l:label}); if(S.quiz.length>200) S.quiz.shift(); save();
      el.innerHTML=`<div class="qz card" style="text-align:center"><span class="eyebrow">Quiz complete</span><h2 style="margin:8px 0">${score} / ${qs.length} (${pct}%)</h2><p class="muted"><b class="tpun" style="display:block">${esc(punFor(pct))}</b>${pct>=80?'Excellent: these ideas are secure.':pct>=50?'Good progress. Re-read the notes for the ones you missed.':'Worth another look at the notes and flashcards.'}</p><button class="btn primary" id="again">Try again</button></div>`; $('#again',el).onclick=()=>{ qs.sort(()=>Math.random()-0.5); i=0; score=0; render(); }; return; }
    const q=qs[i]; const order=q.o.map((o,k)=>k).sort(()=>Math.random()-0.5); answered=false;
    el.innerHTML=`<div class="qz"><div class="row" style="justify-content:space-between"><span class="eyebrow">Question ${i+1} of ${qs.length} · ${q.topic} ${esc(byId[q.topic].title)}</span><span class="chip">Score ${score}</span></div><div class="bar" style="margin-top:6px"><i style="width:${i/qs.length*100}%"></i></div>
    <p class="qz-q">${esc(q.q)}</p><div class="qz-opts">${order.map((k,j)=>`<button data-k="${k}"><span class="l">${'ABCD'[j]}</span><span>${esc(q.o[k])}</span></button>`).join('')}</div><div id="exp"></div></div>`;
    $$('.qz-opts button',el).forEach(b=>b.onclick=()=>{ if(answered) return; answered=true; const k=+b.dataset.k; const ok=k===q.a; if(ok) score++; $$('.qz-opts button',el).forEach(x=>{ x.disabled=true; if(+x.dataset.k===q.a) x.classList.add('right'); else if(x===b) x.classList.add('wrong'); });
      $('#exp',el).innerHTML=`<div class="qz-exp"><b>${ok?'Correct.':'Not quite.'}</b> ${esc(q.e)}</div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" id="nx">${i+1<qs.length?'Next question':'See score'}</button></div>`; $('#nx',el).onclick=()=>{ i++; render(); }; $('#nx',el).focus(); }); };
  render(); return ()=>{};
}
function viewQuiz(v){
  v.innerHTML=`<span class="eyebrow">Multiple choice practice</span><h1>Quiz</h1><p class="muted" style="max-width:72ch">Section A style multiple-choice questions with worked explanations. ${ALLMCQ.length} questions across the course.</p>
  <div class="filters"><label class="field" for="qmod">Module<select id="qmod"><option value="">Whole course</option><option value="as">AS only (modules 1–4)</option>${MODS.map(m=>`<option value="${m.n}">Module ${m.n}: ${esc(m.short)}</option>`).join('')}</select></label><label class="field" for="qn">Questions<select id="qn"><option>10</option><option>15</option><option value="20">20 (AS paper 1 length)</option></select></label><button class="btn primary" id="qgo">Start quiz</button></div><div id="qbody"></div>
  ${S.quiz.length?`<h3 style="margin:24px 0 8px">Recent scores</h3><div class="row">${S.quiz.slice(-12).reverse().map(q=>`<span class="chip ${q.s/q.n>=0.8?'good':q.s/q.n>=0.5?'warn':'bad'}">${q.s}/${q.n} · ${esc(String(q.l))}</span>`).join('')}</div>`:''}`;
  const go=()=>{ const m=$('#qmod').value, n=+$('#qn').value; let pool=ALLMCQ.filter(q=>!m||(m==='as'?byId[q.topic].mod<=4:byId[q.topic].mod===+m)); pool=pool.sort(()=>Math.random()-0.5).slice(0,n); runQuiz($('#qbody'),pool,m?(m==='as'?'AS':'Module '+m):'Course'); };
  $('#qgo').onclick=go; go();
}

/* ---------- EXAM QUESTIONS ---------- */
function viewExam(v){
  v.innerHTML=`<span class="eyebrow">Structured and extended response</span><h1>Exam questions</h1><p class="muted" style="max-width:76ch">${ALLQ.length} exam-style questions written to match OCR H556 and H156 papers, each with a full mark scheme. Write your answer, then reveal the mark scheme and self-mark. For real past paper questions use <a href="#papers">Past papers</a> or the topic packs on each topic page.</p>
  <div class="filters"><label class="field" for="emod">Module<select id="emod"><option value="">All</option>${MODS.map(m=>`<option value="${m.n}">Module ${m.n}</option>`).join('')}</select></label><label class="field" for="etop">Topic<select id="etop"><option value="">All topics</option>${T.map(t=>`<option value="${t.id}">${t.id} ${esc(t.title)}</option>`).join('')}</select></label><label class="field" for="est">Status<select id="est"><option value="">Any</option><option value="todo">Not attempted</option><option value="done">Marked</option></select></label></div><div class="ql" id="elist"></div>`;
  const draw=()=>{ const m=$('#emod').value, t=$('#etop').value, s=$('#est').value; const list=ALLQ.filter(q=>(!m||byId[q.topic].mod===+m)&&(!t||q.topic===t)&&(!s||(s==='done')===(S.exam[q.id]&&S.exam[q.id].got!=null))); $('#elist').innerHTML=list.length?list.map(qItem).join(''):'<div class="empty">No questions match.</div>'; };
  ['emod','etop','est'].forEach(id=>$('#'+id).onchange=draw); draw();
}
function viewQuestion(v,key){
  const q=qById[key]; if(!q){ v.innerHTML='<div class="empty">Question not found. <a href="#exam">All questions</a></div>'; return; }
  const ix=ALLQ.indexOf(q), prev=ALLQ[ix-1], next=ALLQ[ix+1]; const r=S.exam[q.id]||{}; const t=byId[q.topic]; const ans=S.answers[q.id]||{};
  v.innerHTML=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="eyebrow"><a href="#exam">Exam questions</a> / ${esc(q.id)}</span><div class="row">${prev?`<a class="btn btn-sm" href="#q-${qKey(prev.id)}">← Previous</a>`:''}${next?`<a class="btn btn-sm" href="#q-${qKey(next.id)}">Next →</a>`:''}</div></div>
  <div class="exam"><section class="paper"><div class="row" style="justify-content:space-between"><span class="chip ai">${esc(q.style)}</span>${topicLink(q.topic)}</div>
   <p class="stemtxt">${esc(q.stem)}</p>
   ${q.parts.map((p,i)=>`<div class="part"><p class="qtxt"><span>(${String.fromCharCode(97+i)}) ${esc(p.q)}</span><span class="mk">[${p.m}]</span></p><label class="muted" for="a${i}" style="font-size:.8rem">Your answer</label><textarea id="a${i}" data-i="${i}" placeholder="Show your working…">${esc(ans[i]||'')}</textarea></div>`).join('')}
   <div class="row" style="justify-content:space-between;margin-top:12px"><span class="muted" style="font-size:.85rem">Total ${q.marks} marks · aim for about ${Math.round(q.marks*1.2)} minutes.</span></div>
   <div class="card" style="margin-top:14px;padding:12px 14px"><span class="eyebrow">Practise the real thing</span><p style="margin:6px 0 8px;font-size:.92rem">Find questions like this in the ${esc(t.id)} ${esc(t.title)} topic packs.</p><a class="btn btn-sm" href="#t-${t.id}" id="topack">Open topic packs</a></div></section>
  <section class="stack"><div class="veil ${r.rev?'':'hidden'}" id="veil"><div class="vin"><div class="ms"><div class="ms-head"><h4>Mark scheme</h4><span class="chip">${q.marks} marks</span></div><table>${q.parts.map((p,i)=>`<tr><td class="qn">(${String.fromCharCode(97+i)})</td><td><ul>${p.ms.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${p.ans?`<div class="ans">Answer: ${esc(p.ans)}</div>`:''}</td><td class="mk">${p.m}</td></tr>`).join('')}</table>
   <div class="selfmark"><b>Self-mark:</b><input type="number" id="got" min="0" max="${q.marks}" value="${r.got??''}" aria-label="Marks scored"><span>/ ${q.marks}</span><button class="btn btn-sm primary" id="saveGot">Save score</button><span class="muted" id="gotMsg">${r.got!=null?'Saved':''}</span></div></div></div><div class="vbtn"><button class="btn primary" id="reveal">Reveal mark scheme</button></div></div>
   <div class="card"><span class="eyebrow">Examiner tips</span><ul style="margin:6px 0 0;padding-left:18px;font-size:.92rem"><li>Write the equation you use, substitute, then give the answer with a unit.</li><li>Keep 3 significant figures unless told otherwise; do not round mid-calculation.</li><li>"Explain" needs a reason linked with because/so; "describe" needs what happens.</li><li>For 6-mark (Level of Response) questions, plan: method, measurements, analysis, then evaluation.</li></ul></div></section></div>`;
  $$('textarea[data-i]',v).forEach(ta=>ta.addEventListener('input',()=>{ const a=S.answers[q.id]||{}; a[ta.dataset.i]=ta.value; S.answers[q.id]=a; save(); }));
  $('#topack').onclick=()=>{ sessionStorage.setItem('tt-tab','packs'); };
  $('#reveal').onclick=()=>{ $('#veil').classList.remove('hidden'); S.exam[q.id]=Object.assign(S.exam[q.id]||{},{rev:1}); save(); };
  $('#saveGot').onclick=()=>{ const g=Math.max(0,Math.min(q.marks,parseInt($('#got').value,10))); if(isNaN(g)) return; S.exam[q.id]=Object.assign(S.exam[q.id]||{},{got:g,ts:Date.now(),rev:1}); save(); $('#gotMsg').textContent='Saved'; toast(`Saved ${g}/${q.marks}`); };
  const aiBtn=$('#aiMark'); if(aiBtn) aiBtn.onclick=async()=>{ if(!sampleCap) return; const a=S.answers[q.id]||{}; const txt=q.parts.map((p,i)=>`(${String.fromCharCode(97+i)}) ${a[i]||'[no answer]'}`).join('\n'); if(txt.replace(/\[no answer\]/g,'').replace(/\([a-z]\)/g,'').trim().length<4){ toast('Write an answer first'); return; }
    const out=$('#aiOut'); out.innerHTML='<div class="aimark muted">Marking…</div>'; aiBtn.disabled=true;
    const prompt=`You are an experienced OCR A Level Physics A (H556) examiner. Mark the student's answer strictly against the mark scheme, awarding compensated marks for correct working (error carried forward) as OCR does. Reply in plain text: first line "Mark: X/${q.marks}", then one short line per part saying which marking points were earned and what was missing, then one sentence on how to gain full marks. Use correct units and significant figures in comments.\n\nQUESTION: ${q.stem}\n${q.parts.map((p,i)=>`(${String.fromCharCode(97+i)}) [${p.m}] ${p.q}`).join('\n')}\n\nMARK SCHEME:\n${q.parts.map((p,i)=>`(${String.fromCharCode(97+i)}) [${p.m}] ${p.ms.join('; ')}${p.ans?' | answer: '+p.ans:''}`).join('\n')}\n\nSTUDENT ANSWER:\n${txt}`;
    const para=s=>esc(s).split(/\n+/).map(l=>`<p>${l}</p>`).join('');
    try{ let last=''; const res=await sampleCap(prompt,{modelTier:'default',onText:({text})=>{ last=text; out.innerHTML=`<div class="aimark">${para(text)}</div>`; }}); const final=res&&res.text||last; out.innerHTML=`<div class="aimark"><span class="chip ai" style="margin-bottom:6px">AI marking · check it against the mark scheme</span>${para(final)}</div>`; const m=final.match(/Mark:\s*(\d+)\s*\/\s*(\d+)/i); if(m&&!$('#got').value) $('#got').value=m[1]; }
    catch(e){ out.innerHTML=`<div class="aimark muted">${e&&e.code==='not_granted'?'AI marking was not allowed in this view.':e&&e.code==='rate_limited'?'Too many requests: try again in a minute.':'AI marking is unavailable right now.'}</div>`; }
    aiBtn.disabled=false; };
}

/* ---------- LABS ---------- */
const LABCATS=['Practical skills','Mechanics','Electricity','Waves','Quantum','Thermal','Newtonian world','Astrophysics','Fields & particles','Nuclear','Medical'];
function viewLabs(v){ const ids=Object.keys(LABS); const cats=LABCATS.filter(c=>ids.some(id=>LABS[id].cat===c));
  v.innerHTML=`<span class="eyebrow">Interactive simulations</span><h1>Labs</h1><p class="muted" style="max-width:76ch">${ids.length} labs to experiment freely: build circuits, collide gliders in 1D and pucks in 2D, launch satellites, fire particles through fields and more. For the assessed practicals with method, results table and graph analysis, see <a href="#pags">Practicals</a>.</p>
  ${LABS.missions?`<a class="featlab" href="#lab-missions"><span class="eyebrow">Featured lab</span><h2>${esc(LABS.missions.title)}</h2><p>${esc(LABS.missions.desc)}</p><span class="btn primary btn-sm">Explore lab →</span></a>`:''}<div class="subtabs" role="group" aria-label="Filter labs"><button aria-pressed="true" data-c="">All</button>${cats.map(c=>`<button aria-pressed="false" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="grid g3" id="lg"></div>`;
  const draw=c=>{ $('#lg').innerHTML=ids.filter(id=>!c||LABS[id].cat===c).map(labCard).join(''); $$('.subtabs button',v).forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c)); };
  $$('.subtabs button',v).forEach(b=>b.onclick=()=>draw(b.dataset.c)); draw(''); }
function viewLab(v,id){ const L=LABS[id]; if(!L){ v.innerHTML='<div class="empty">Lab not found. <a href="#labs">All labs</a></div>'; return; }
  const t=byId[L.topic]; const rel=Object.keys(LABS).filter(k=>k!==id&&LABS[k].topic===L.topic);
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#labs">Labs</a> / ${esc(L.cat)}</span><h1>${esc(L.title)}</h1><p class="muted" style="margin:6px 0 0;max-width:72ch">${esc(L.desc)}</p></div><div class="row">${t?topicLink(L.topic):''}</div></div>${PSWSET.has(id)?PSW(1):''}<div class="lab" id="labroot"></div>${rel.length?`<h3 style="margin:24px 0 10px">More labs for ${esc(L.topic)}</h3><div class="grid g3">${rel.map(labCard).join('')}</div>`:''}`;
  L.id=id; cleanup=LK.frame($('#labroot'),L,(window.LABGUIDES||{})[id]); }

/* ---------- PRACTICALS ---------- */
const PAGNAMES={1:'Investigating motion',2:'Investigating properties of materials',3:'Investigating electrical properties',4:'Investigating electrical circuits',5:'Investigating waves',6:'Investigating quantum effects',7:'Investigating ionising radiation',8:'Investigating gases',9:'Investigating capacitors',10:'Investigating simple harmonic motion',11:'Individual investigation',12:'Research skills'};
function viewPags(v){ const nums=[...new Set(PG.list.map(p=>p.pag))];
  v.innerHTML=`<span class="eyebrow">Practical Endorsement · CPAC</span><h1>Practicals</h1><p class="muted" style="max-width:78ch">Simulated versions of the OCR Practical Activity Groups. Each one has the method, safety, variables and evaluation points, plus a virtual experiment: take readings with realistic random error, spot anomalies, plot a linearised graph, draw best and worst lines and compare your answer with the accepted value. Paper 3 and about 15% of all marks test these skills.</p>
  <div class="stack" style="gap:26px;margin-top:16px">${nums.map(n=>`<section class="mod"><div class="mod-head"><span class="mnum">${n}</span><h2>${esc(PAGNAMES[n])}</h2></div><div class="grid g3">${PG.list.filter(p=>p.pag===n).map(pagCard).join('')}</div></section>`).join('')}
  <section class="mod"><div class="mod-head"><span class="mnum">12</span><h2>${PAGNAMES[12]}</h2></div><div class="card"><p style="margin:0 0 8px">PAG 12 is a research task: use books, journals and websites to research a practical technique or application (for example GPS, or radioactive tracers in medical imaging), cite sources properly and present your findings.</p><a class="btn btn-sm" href="https://www.physicsandmathstutor.com/physics-revision/a-level-ocr-a/module-1/" target="_blank" rel="noopener">${I.ext} PMT module 1 PAG notes</a></div></section></div>`; }
function viewPag(v,id){ const p=PG.list.find(x=>x.id===id); if(!p){ v.innerHTML='<div class="empty">Practical not found. <a href="#pags">All practicals</a></div>'; return; }
  
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#pags">Practicals</a> / PAG ${p.pag}: ${esc(PAGNAMES[p.pag])}</span><h1>${esc(p.title)}</h1><p class="muted" style="margin:6px 0 0;max-width:72ch"><b>Aim:</b> ${esc(p.aim)}</p></div><div class="row">${topicLink(p.topic)}</div></div>
  ${PSWSET.has(id)?PSW(0):''}<div class="tabs" role="tablist"><button role="tab" data-tab="run" aria-selected="true">Run the experiment</button><button role="tab" data-tab="method" aria-selected="false">Method and safety</button><button role="tab" data-tab="eval" aria-selected="false">Errors and evaluation</button></div><div id="pbody"></div>`;
  let sub=null; const body=$('#pbody');
  const show=k=>{ if(sub){ sub(); sub=null; } $$('[data-tab]',v).forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===k)); body.innerHTML='';
    if(k==='run'){ const box=h('<div class="lab"></div>'); body.appendChild(box); sub=PG.mount(box,id); }
    if(k==='method') body.innerHTML=`<div class="grid g2"><div class="card"><h3 style="margin-bottom:8px">Apparatus</h3><ul style="margin:0;padding-left:20px">${p.apparatus.map(a=>`<li>${esc(a)}</li>`).join('')}</ul><h3 style="margin:16px 0 8px">Variables</h3><p style="margin:0"><b>Independent:</b> ${esc(p.vars.iv)}<br><b>Dependent:</b> ${esc(p.vars.dv)}<br><b>Control:</b> ${esc(p.vars.cv)}</p></div><div class="card"><h3 style="margin-bottom:8px">Safety</h3><ul style="margin:0;padding-left:20px">${p.safety.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div></div><div class="card" style="margin-top:16px"><h3 style="margin-bottom:12px">Method</h3><ol class="methodlist">${p.method.map(s=>`<li><span>${esc(s)}</span></li>`).join('')}</ol></div>`;
    if(k==='eval') body.innerHTML=`<div class="grid g2"><div class="card"><h3 style="margin-bottom:8px">Sources of error</h3><ul style="margin:0;padding-left:20px">${p.errors.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div><div class="card"><h3 style="margin-bottom:8px">Improvements</h3><ul style="margin:0;padding-left:20px">${p.improve.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></div></div><blockquote class="tip"><p><b>Evaluation checklist:</b> compare your result with the accepted value as a percentage difference; compare that with your percentage uncertainty; if the accepted value lies outside your uncertainty there is probably a systematic error. Suggest specific, practical improvements, not just "repeat the experiment".</p></blockquote>`; };
  $$('[data-tab]',v).forEach(b=>b.onclick=()=>show(b.dataset.tab)); show('run'); cleanup=()=>{ if(sub) sub(); }; }

/* ---------- PAPERS ---------- */

/* ---------- VIDEOS ---------- */
const MED=window.MEDIA||{videos:[],cases:[]};
MED.videos.forEach((x,i)=>x.i=i);
const topicVids=id=>MED.videos.filter(x=>x.t.includes(id));
const topicCases=id=>MED.cases.filter(x=>x.t.includes(id));
const PLAY='<svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg>';
const VG={'0':'Whole course','1':'Module 1: Practical skills','2':'Module 2: Foundations','3':'Module 3: Forces and motion','4':'Module 4: Electrons, waves and photons','5':'Module 5: Newtonian world and astrophysics','6':'Module 6: Particles and medical physics','9':'GCSE bridging'};
const VCOL=['#c81e66','#8f1d4e','#d64a8a','#0f7d78','#7a3c9e','#b5487c','#1d6f8f','#a83a5e','#5c4a9e','#2f7d5b'];
const ytUrl=x=>'https://www.youtube.com/watch?v='+x.id+(x.start?'&t='+x.start+'s':'');
function vTile(x){ const c=VCOL[(+x.g||0)%VCOL.length]; return `<button type="button" class="vtile" data-v="${x.i}"><div class="vthumb" style="background:linear-gradient(135deg,${c},#2a0718)"><img loading="lazy" alt="" src="thumbs/${x.id}.jpg" onerror="this.remove()"><div class="vplay"><span>${PLAY}</span></div>${x.kind==='Science Shorts'?'<span class="vbadge">Science Shorts</span>':''}</div><div class="vmeta"><small>${esc(x.t.filter(id=>byId[id]).join(', ')||VG[x.g]||'')} · ${esc(x.sec||'')}</small><b>${esc(x.title)}</b></div></button>`; }
function vSections(list){ if(!list.length) return '<div class="empty">No videos match.</div>'; const secs=[]; list.forEach(x=>{ let g=secs.find(q=>q.sec===x.sec); if(!g){ g={sec:x.sec,t:x.t,kinds:{}}; secs.push(g); } (g.kinds[x.kind]=g.kinds[x.kind]||[]).push(x); });
  const kl=k=>k==='Videos'?'Explainers and demos':k; const tt=g=>{ const ids=g.t.filter(id=>byId[id]); return ids.length?(ids.length>1?ids[0]+'–'+ids[ids.length-1]:ids[0])+' '+g.sec:g.sec; };
  return secs.map(g=>`<div class="vsec"><h3>${esc(tt(g))}</h3>${Object.entries(g.kinds).map(([k,xs])=>`<div class="vkind">${esc(kl(k))} · ${xs.length}</div><div class="vgrid">${xs.map(vTile).join('')}</div>`).join('')}</div>`).join(''); }
function bindVids(root){ $$('.vtile',root).forEach(b=>b.onclick=()=>openVideo(MED.videos[+b.dataset.v],b)); }
function openVideo(x,from){
  const m=h(`<div class="vmodal" role="dialog" aria-modal="true" aria-label="${esc(x.title)}"><div class="vbox"><a class="vframe" href="${ytUrl(x)}" target="_blank" rel="noopener"><img alt="" src="thumbs/${x.id}.jpg" onerror="this.remove()"><span class="vplay"><span style="width:76px;height:76px">${PLAY}</span></span></a><div class="vbar"><b>${esc(x.title)}</b><a class="btn btn-sm primary" href="${ytUrl(x)}" target="_blank" rel="noopener">Watch on YouTube ${I.ext}</a><button class="iconbtn" aria-label="Close">${I.close}</button></div><div class="muted" style="font-size:.8rem;padding:0 14px 12px">${esc(x.t.filter(id=>byId[id]).map(id=>id+' '+byId[id].title).join(' · ')||VG[x.g]||'')}. Videos open on YouTube in a new tab: tap the picture or the button.</div></div></div>`);
  document.body.appendChild(m); const box=m.querySelector('.vbox');
  if(from){ const r=from.getBoundingClientRect(); box.style.transformOrigin=`${r.left+r.width/2-innerWidth/2+box.offsetWidth/2}px ${r.top+r.height/2-innerHeight/2+box.offsetHeight/2}px`; }
  requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('open')));
  const close=()=>{ m.classList.remove('open'); document.removeEventListener('keydown',kd); setTimeout(()=>m.remove(),420); from&&from.focus(); };
  const kd=e=>{ if(e.key==='Escape') close(); }; document.addEventListener('keydown',kd);
  m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.iconbtn')) close(); }); m.querySelector('.iconbtn').focus(); }
function caseCard(c){ const tp=c.t.filter(id=>byId[id]); return `<div class="casecard"><span class="eyebrow">${esc(tp.length?tp.join(', ')+' · '+(c.sec||''):VG[c.g]||'')}</span><h4>${esc(c.name)}</h4><p>${esc(c.desc||'')}</p>${(c.links||[]).map(([t,u])=>`<a class="caselink" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ${I.ext}</a>`).join('')}</div>`; }
function viewVideos(v,g){
  v.innerHTML=`<span class="eyebrow">Video and real-world examples library</span><h1>Videos</h1><p class="muted" style="max-width:74ch">${MED.videos.length} hand-picked videos from A level physics teachers (including every Science Shorts video for each topic), science channels and institutions like the IOP, NASA and ESA, plus ${MED.cases.length} real-world examples of the physics in action, to quote in “physics in use” questions. Tap a thumbnail to watch.</p>
  <div class="filters"><label class="field">Module<select id="vg"><option value="">All modules</option>${Object.entries(VG).map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select></label><label class="field">Source<select id="vk"><option value="">All videos</option><option value="Videos">Explainers and demos</option><option value="Science Shorts">Science Shorts</option><option value="GCSE bridging">GCSE bridging</option></select></label><label class="field" style="flex:1;min-width:200px">Search<input type="search" id="vq" placeholder="e.g. capacitor, resonance, MRI"></label></div>
  <div id="vout"></div>`;
  if(g&&VG[g]) $('#vg').value=g;
  const render=()=>{ const G=$('#vg').value, K=$('#vk').value, q=$('#vq').value.trim().toLowerCase();
    const vs=MED.videos.filter(x=>(!G||x.g===G)&&(!K||x.kind===K)&&(!q||(x.title+' '+x.sec).toLowerCase().includes(q)));
    const cs=K&&K!=='Videos'?[]:MED.cases.filter(c=>(!G||c.g===G)&&(!q||(c.name+' '+c.sec+' '+(c.desc||'')).toLowerCase().includes(q)));
    $('#vout').innerHTML=`${vSections(vs)}<div class="sep"></div><h2 style="margin-bottom:12px">Real-world examples <span class="mono muted" style="font-size:.9rem">${cs.length}</span></h2><div class="casegrid">${cs.map(caseCard).join('')||'<div class="empty">No examples match.</div>'}</div>`;
    bindVids(v); };
  $('#vg').onchange=render; $('#vk').onchange=render; $('#vq').oninput=render; render(); }

function viewPapers(v){
  const sessRow=x=>`<div class="sess"><b>${esc(x.s)}</b><a class="btn btn-sm" href="${esc(x.qp)}" target="_blank" rel="noopener">Question paper ${I.ext}</a><a class="btn btn-sm ghost" href="${esc(x.ms)}" target="_blank" rel="noopener">Mark scheme ${I.ext}</a></div>`;
  v.innerHTML=`<span class="eyebrow">Physics &amp; Maths Tutor library</span><h1>Past papers</h1><p class="muted" style="max-width:78ch">Every OCR A paper hosted on Physics &amp; Maths Tutor, opening in a new tab. Start with full papers under timed conditions; use the topic packs on each topic page for targeted practice. Legacy papers come from the previous OCR A specification and are listed with how well they match this one.</p>
  <div class="row" style="margin:6px 0 18px"><a class="btn btn-sm" href="${esc(SP.booklet)}" target="_blank" rel="noopener">${I.ext} Data, Formulae and Relationships booklet</a>${SP.pmtNotes.map(n=>`<a class="btn btn-sm ghost" href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.label)}</a>`).join('')}</div>
  <h2 style="margin-bottom:10px">A level (H556)</h2><div class="stack">${SP.papers.filter(p=>p.level==='A level').map(paperBlock).join('')}</div>
  <h2 style="margin:26px 0 10px">AS level (H156)</h2><div class="stack">${SP.papers.filter(p=>p.level==='AS').map(paperBlock).join('')}</div>
  <h2 style="margin:26px 0 10px">Legacy OCR A papers (2009–2016)</h2><p class="muted" style="max-width:74ch;margin-top:0">These pre-2015 papers share most content with the current spec. The match notes say which modules they cover.</p><div class="stack">${SP.legacy.map(paperBlock).join('')}</div>
  <h2 style="margin:26px 0 10px">Topic question packs</h2><div class="grid g3">${T.map(t=>`<a class="tcard" href="#t-${t.id}" data-pk="1"><span class="id">${t.id}</span><h4>${esc(t.title)}</h4><div class="meta"><span>${t.packs.length} PDFs</span></div></a>`).join('')}</div>`;
  function paperBlock(p){ return `<details class="fold"><summary><span>${esc(p.code)} · ${esc(p.name)}${p.time?` <span class="muted" style="font-weight:400">· ${esc(p.time)}, ${p.marks} marks</span>`:''}</span></summary><div>${p.mods?`<p class="muted" style="margin:0 0 10px;font-size:.9rem">${esc(p.mods)}. ${esc(p.fmt||'')}</p>`:''}${p.match?`<p class="muted" style="margin:0 0 10px;font-size:.9rem">${esc(p.match)}</p>`:''}<div class="paperset">${p.items.map(sessRow).join('')}</div><p style="margin:10px 0 0"><a href="${esc(p.page)}" target="_blank" rel="noopener">See this page on PMT ${I.ext.replace('<svg','<svg width="12" height="12"')}</a></p></div></details>`; }
  $$('[data-pk]',v).forEach(a=>a.addEventListener('click',()=>sessionStorage.setItem('tt-tab','packs')));
}

/* ---------- DATA SHEET ---------- */
window.TT_SHEET=v=>viewSheet(v);
function viewSheet(v){
  v.innerHTML=`<span class="eyebrow">Data, formulae and relationships</span><h1>Data sheet</h1><p class="muted" style="max-width:72ch">Constants, prefixes and every equation in the course, grouped by topic. The official booklet is linked on the <a href="#papers">Past papers</a> page.</p>
  <div class="grid g2 sheetg" style="margin-top:12px"><div class="card"><h3 style="margin-bottom:8px">Physical constants</h3><div class="tbl fit" style="margin:0"><table><tr><th>Quantity</th><th>Symbol</th><th>Value</th></tr>${SP.constants.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td style="font-family:var(--f-mono)">${c[2]}</td></tr>`).join('')}</table></div></div>
  <div class="stack"><div class="card"><h3 style="margin-bottom:8px">Prefixes</h3><div class="tbl fit" style="margin:0"><table><tr><th>Prefix</th><th>Symbol</th><th>Multiple</th></tr>${SP.prefixes.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td></tr>`).join('')}</table></div></div>
  <div class="card"><h3 style="margin-bottom:8px">Useful maths</h3><ul style="margin:0;padding-left:20px;font-size:.93rem"><li>arc length = rθ; small angles: sin θ ≈ tan θ ≈ θ, cos θ ≈ 1</li><li>circumference 2πr; area πr²; sphere area 4πr², volume 4/3 πr³</li><li>ln(e<sup>x</sup>) = x; ln(ab) = ln a + ln b; ln(a<sup>n</sup>) = n ln a</li><li>y = mx + c: gradient m, intercept c</li></ul></div></div></div>
  <h2 style="margin:26px 0 10px">Equations by topic</h2><div class="stack">${MODS.map(m=>`<details class="fold" ${m.n===3?'open':''}><summary>Module ${m.n}: ${esc(m.title)}</summary><div>${T.filter(t=>t.mod===m.n&&t.eqs.length).map(t=>`<h4 style="margin:12px 0 6px"><a href="#t-${t.id}">${t.id} ${esc(t.title)}</a></h4><div class="eqlist">${t.eqs.map(([e,d])=>`<div class="eq"><b>${e}</b><span>${esc(d)}</span></div>`).join('')}</div>`).join('')}</div></details>`).join('')}</div>`;
}

/* ---------- PROGRESS ---------- */
function viewProgress(v){
  const pall=practiceOf(null); const tot=pall.got, max=pall.max;
  v.innerHTML=`<span class="eyebrow">Your record (this browser)</span><h1>Progress</h1>
  <div class="statrow" style="margin:14px 0;grid-template-columns:repeat(3,1fr)"><div class="stat"><b>${overall()}%</b><span>overall</span></div><div class="stat"><b>${Object.values(S.revised).filter(Boolean).length}/${T.length}</b><span>topics revised</span></div><div class="stat"><b>${max?Math.round(tot/max*100)+'%':'–'}</b><span>practice marks (${pall.n} question${pall.n===1?'':'s'} marked)</span></div></div>
  <div class="tbl"><table><tr><th>Topic</th><th>Confidence</th><th>Revised</th><th>Flashcards secure</th><th>Practice marks</th><th>Progress</th></tr>${T.map(t=>{ const fc=CARDS.filter(c=>c.topic===t.id); const sec=fc.filter(c=>(S.flash[c.id]||{}).box>=3).length; const pt=practiceOf(t.id), g=pt.got, m=pt.max;
    return `<tr><td><a href="#t-${t.id}">${t.id} ${esc(t.title)}</a></td><td><span class="rag ${topicConf(t.id)}"></span> ${({r:'Not yet',a:'Getting there',g:'Confident'})[topicConf(t.id)]||'–'}</td><td>${S.revised[t.id]?'✓':'–'}</td><td>${sec}/${fc.length}</td><td>${m?g+'/'+m:'–'}</td><td><div class="bar" style="min-width:80px"><i style="width:${topicPct(t)}%"></i></div></td></tr>`; }).join('')}</table></div>
  <div class="card" style="margin-top:18px"><span class="eyebrow">Back up or move your progress</span>
   <p class="muted" style="margin:6px 0 12px;font-size:.92rem">Progress is stored in this browser only. Save a backup file to keep it safe or move it to another device, or export a report for your teacher.</p>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary" id="expJson">Save backup file (.json)</button><button class="btn" id="expCsv">Export report (.csv)</button><button class="btn" id="expCopy">Copy backup to clipboard</button><label class="btn" for="impFile" style="cursor:pointer">Restore from backup…</label><input type="file" id="impFile" accept=".json,application/json" hidden></div>
   <p class="muted" id="expMsg" style="margin:10px 0 0;font-size:.85rem" aria-live="polite"></p></div>
  <div class="row" style="margin-top:16px"><button class="btn ghost" id="reset">Reset all progress</button><span id="rmsg" class="muted"></span></div>`;
  const replaceS=n=>{ Object.keys(S).forEach(k=>delete S[k]); Object.assign(S,n); };
  let armed=false; $('#reset').onclick=()=>{ if(!armed){ armed=true; $('#rmsg').textContent='Press again to confirm. This cannot be undone.'; $('#reset').textContent='Confirm reset'; return; } const keep=S.settings; replaceS({revised:{},conf:{},flash:{},quiz:[],exam:{},answers:{},days:[],bank:{},mocks:[],settings:keep}); save(); route(); toast('Progress reset'); };
  const msg=t=>{ $('#expMsg').textContent=t; };
  const stamp=new Date().toISOString().slice(0,10);
  const backup=()=>JSON.stringify({app:'TrainTanmay Physics',version:1,exported:new Date().toISOString(),progress:S},null,1);
  const csvCell=x=>{ const t=String(x??''); return /[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t; };
  const report=()=>{ const rows=[['Section','Item','Confidence','Revised','Flashcards secure','Practice marks','Practice questions marked','Progress %']];
    T.forEach(t=>{ const fc=CARDS.filter(c=>c.topic===t.id); const sec=fc.filter(c=>(S.flash[c.id]||{}).box>=3).length; const pt=practiceOf(t.id);
      rows.push(['Topic',t.id+' '+t.title,({r:'Not yet',a:'Getting there',g:'Confident'})[topicConf(t.id)]||'',S.revised[t.id]?'yes':'',sec+'/'+fc.length,pt.max?pt.got+'/'+pt.max:'',pt.n||'',topicPct(t)]); });
    (S.mocks||[]).forEach(mk=>{ let g=0; mk.qs.forEach(id=>{ const a=mk.a[id]; if(a&&a.got!=null) g+=a.got; }); rows.push(['Practice test',new Date(mk.ts).toLocaleDateString()+' '+mk.title,'','','','',g+'/'+mk.total,mk.total?Math.round(g/mk.total*100):'']); });
    (S.quiz||[]).forEach(q=>rows.push(['Quiz',String(q.l),'','','','',q.s+'/'+q.n,q.n?Math.round(q.s/q.n*100):'']));
    return rows.map(r=>r.map(csvCell).join(',')).join('\n'); };
  const saveFile=async(name,text,mime)=>{ let dl=null; try{ dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null; }catch(e){}
    if(dl){ try{ await dl.save({filename:name,data:new Blob([text],{type:mime})}); msg('Saved '+name+'.'); return; }catch(e){ if(e&&e.code==='declined'){ msg('Save cancelled.'); return; } } }
    try{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:mime})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1500); msg('Downloading '+name+'. If nothing appears, use "Copy backup to clipboard" instead.'); }
    catch(e){ msg('Saving files is not available here: use "Copy backup to clipboard" instead.'); } };
  $('#expJson').onclick=()=>saveFile('traintanmay-physics-progress-'+stamp+'.json',backup(),'application/json');
  $('#expCsv').onclick=()=>saveFile('traintanmay-physics-report-'+stamp+'.csv',report(),'text/csv');
  $('#expCopy').onclick=async()=>{ try{ await navigator.clipboard.writeText(backup()); msg('Backup copied. Paste it into a note or email to keep it.'); }catch(e){ msg('Copying is blocked here: use "Save backup file" instead.'); } };
  $('#impFile').onchange=async e=>{ const f=e.target.files[0]; if(!f) return; try{ const d=JSON.parse(await f.text()); const p=d&&d.progress; if(!p||typeof p!=='object'||!p.settings) throw 0;
      const base={revised:{},conf:{},flash:{},quiz:[],exam:{},answers:{},days:[],bank:{},mocks:[]}; replaceS(Object.assign(base,p)); S.settings=Object.assign({theme:'system',dys:false},p.settings); save(); applyTheme(); applyDys(); route(); toast('Progress restored from '+f.name); }
    catch(err){ msg('That file is not a TrainTanmay Physics backup.'); } e.target.value=''; };
}

/* ---------- SEARCH ---------- */
const IDX=[]; T.forEach(t=>{ IDX.push({k:'Topic',t:t.id+' '+t.title,s:t.short+' '+strip(t.notes),h:'#t-'+t.id}); t.terms.forEach(([a,b])=>IDX.push({k:'Definition',t:a,s:b,h:'#t-'+t.id})); t.eqs.forEach(([e,d])=>IDX.push({k:'Equation',t:strip(e),s:d+' ('+t.id+')',h:'#t-'+t.id})); t.exam.forEach(q=>IDX.push({k:'Exam question',t:q.id+' '+q.style,s:q.stem+' '+q.parts.map(p=>p.q).join(' '),h:'#q-'+qKey(q.id)})); });
Object.entries(LABS).forEach(([id,L])=>IDX.push({k:'Lab',t:L.title,s:L.desc,h:'#lab-'+id})); if(window.BANK) window.BANK.q.forEach(q=>IDX.push({k:'Exam question',t:window.BANK.packs[q.p].title+' · Q'+q.n,s:q.s,h:'#pq-'+q.id})); (window.MEDIA||{videos:[]}).videos.forEach(x=>IDX.push({k:'Video',t:x.title,s:(x.sec||'')+' '+(x.kind||''),h:'#videos_'+x.g})); PG.list.forEach(p=>IDX.push({k:'Practical',t:'PAG '+p.pag+': '+p.title,s:p.aim+' '+p.method.join(' '),h:'#pag-'+p.id}));
function viewSearch(v){
  v.innerHTML=`<span class="eyebrow">Search everything</span><h1>Search</h1><div class="searchbox" style="margin:12px 0 16px">${I.search}<input type="search" id="sq" placeholder="Try ‘terminal velocity’, ‘work function’ or ‘Kirchhoff’" aria-label="Search"></div><div id="sr"></div>`;
  const inp=$('#sq'); inp.focus();
  const go=()=>{ const q=inp.value.trim().toLowerCase(); if(q.length<2){ $('#sr').innerHTML='<p class="muted">Type at least two letters.</p>'; return; } const words=q.split(/\s+/);
    const hits=IDX.map(x=>{ const a=(x.t+' '+x.s).toLowerCase(); if(!words.every(w=>a.includes(w))) return null; const score=(x.t.toLowerCase().includes(q)?10:0)+(x.k==='Definition'?3:0)+(x.k==='Topic'?2:0); return {x,score}; }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,40);
    const mk=s=>{ let r=esc(s); words.forEach(w=>{ if(w.length>1) r=r.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'); }); return r; };
    const snip=(s)=>{ const i=s.toLowerCase().indexOf(words[0]); const a=Math.max(0,i-60); return (a?'… ':'')+s.slice(a,a+180)+(s.length>a+180?' …':''); };
    $('#sr').innerHTML=hits.length?hits.map(({x})=>`<a class="res" href="${x.h}"><small>${x.k}</small><b>${mk(x.t)}</b><span class="muted" style="font-size:.9rem">${mk(snip(x.s))}</span></a>`).join(''):'<p class="muted">No matches.</p>'; };
  inp.addEventListener('input',go); go();
}

/* topic tab handoff (e.g. jump straight to packs) */
const _vt=viewTopic; viewTopic=function(v,id){ _vt(v,id); const tab=sessionStorage.getItem('tt-tab'); if(tab){ sessionStorage.removeItem('tt-tab'); const b=$(`[data-tab="${tab}"]`,v); b&&b.click(); } };

route();
})();
