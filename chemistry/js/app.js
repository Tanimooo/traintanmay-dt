/* TrainTanmay Chemistry – OCR A (H432 / H032) revision app (scaffolded from the Physics app) */
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
const CARDS=T.flatMap(t=>[...(t.terms||[]).map(([a,b],i)=>({id:t.id+'-t'+i,topic:t.id,front:a,back:b,kind:'Definition'})),...(t.eqs||[]).map(([e,m],i)=>({id:t.id+'-e'+i,topic:t.id,front:m,back:e,kind:'Equation',html:true})),...(t.qa||[]).map(([q,a],i)=>({id:t.id+'-q'+i,topic:t.id,front:q,back:a,kind:'Recall'}))]);

/* ---------- storage ---------- */
const KEY='tt-chem-progress-v1';
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
const PSWSET=new Set([]);
const PSW=lab=>`<div class="psw" role="note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20L12 3zm0 6v6m0 3v.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><p><b>Photosensitivity warning.</b> This ${lab?'simulation':'practical'} contains moving patterns and animation that may affect people with photosensitive epilepsy. ${lab?'Use ❚❚ to pause or ×0.25 to slow it down.':'You can read the Method tab without running the animation.'}</p></div>`;
const NAV=[['home','Home'],['topics','Topics'],['labs','Labs'],['pags','Practicals'],['bank','Practice questions'],['mock','Practice tests'],['flash','Flashcards'],['quiz','Quiz'],['videos','Videos'],['papers','Past papers'],['sheet','Data sheet'],['progress','Progress']];
const NAVG=[
 {k:'home',l:'Home'},
 {l:'Learn',items:[['topics','Topics','Notes, equations, key terms and spec checklist'],['labs','Labs','Interactive simulations: titration, cells, equilibrium and more'],['rxmap','Reaction map','Every organic reaction, with reagents and conditions'],['pags','Practicals','The PAG required practicals: method, safety and evaluation'],['videos','Videos','Over 300 videos sorted by topic']]},
 {l:'Practise',items:[['drills','Calculation drills','Fresh numbers every time, marked with a worked solution'],['spec','Spectroscopy practice','Identify compounds from IR, MS and NMR data'],['bank','Practice questions','Browse exam questions by topic and mark them'],['mock','Practice tests','A timed mixed test with a score at the end'],['quiz','Quiz','Quick multiple-choice checks'],['flash','Flashcards','Learn definitions and equations with spaced repetition']]},
 {k:'papers',l:'Past papers'},{k:'sheet',l:'Data sheet'},{k:'progress',l:'Progress'}];
/* hide sections that have no content yet (no videos; no question bank until one is built) */
NAVG.forEach(g=>{ if(g.items) g.items=g.items.filter(([k])=>!(k==='videos'&&!(window.MEDIA&&MEDIA.videos&&MEDIA.videos.length))&&!((k==='bank'||k==='mock')&&!(BK&&BK.count))); });
const THEMES='<option value="system">Auto</option><option value="light">Light</option><option value="dark">Dark</option><option value="blush">Peach</option>';
const CHEV='<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const navHTML=()=>NAVG.map((g,gi)=>g.items?`<div class="navg" data-g="${gi}"><button type="button" class="navgb" aria-expanded="false" aria-haspopup="true" data-keys="${g.items.map(x=>x[0]).join(' ')}">${esc(g.l)}${CHEV}</button><div class="navmenu" role="menu">${g.items.map(([k,l,d])=>`<a role="menuitem" href="#${k}" data-k="${k}"><span class="nmi">${navIcon(k)}</span><span><b>${esc(l)}</b><small>${esc(d)}</small></span></a>`).join('')}</div></div>`:`<a href="#${g.k}" data-k="${g.k}">${navIcon(g.k)}<span>${esc(g.l)}</span></a>`).join('');

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
 progress:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 drills:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/>',
 rxmap:'<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6.5 8.2l4.2 7.6M17.5 8.2l-4.2 7.6"/>',
 spec:'<path d="M3 20h18"/><path d="M4 20V9l2 11 2-15 2 15 2-8 2 8 2-12 2 12 2-6v6"/>'};
const navIcon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NI[k]||''}</svg>`;

/* ---------- shell ---------- */
const app=$('#app');
app.innerHTML=`<header class="topbar"><div class="wrap"><a class="brand" href="#home">${I.logo}<span><b>TrainTanmay</b><small>OCR A Chemistry · H432</small></span></a>
<nav class="nav" aria-label="Main">${navHTML()}</nav>
<div class="tb-right"><a class="iconbtn" href="#search" aria-label="Search" title="Search">${I.search}</a><select class="theme-select" id="theme" aria-label="Theme">${THEMES}</select><button class="iconbtn dysbtn" id="dys" aria-pressed="${!!S.settings.dys}" title="Dyslexia-friendly font">Aa</button>
<button class="iconbtn menubtn" id="menu" aria-label="Menu" aria-expanded="false">${I.menu}</button></div></div></header>
<main class="wrap"><div id="view"></div></main>
<footer class="footer"><div class="wrap row" style="justify-content:space-between"><span>TrainTanmay Chemistry · Made by Tanmay Vashishtha · <i id="fpun"></i> · OCR A Level Chemistry A (H432) and AS (H032). Progress is saved in this browser.</span><span>Past papers and topic questions link to <a href="https://www.physicsandmathstutor.com/chemistry-revision/a-level-ocr-a/" target="_blank" rel="noopener">Physics &amp; Maths Tutor</a>.</span></div></footer>`;
$('#theme').value=S.settings.theme; $('#theme').onchange=e=>{ S.settings.theme=e.target.value; save(); applyTheme(); };
$('#dys').onclick=e=>{ S.settings.dys=!S.settings.dys; $$('.dysbtn').forEach(b=>b.setAttribute('aria-pressed',S.settings.dys)); applyDys(); save(); window.dispatchEvent(new Event('themechange')); };
const drawer=$('#drawer');
$('#menu').onclick=()=>{ drawer.innerHTML=`<div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu"><div class="dhead"><b>Menu</b><button type="button" class="iconbtn" id="dclose" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  ${NAVG.map(g=>g.items?`<div class="dgroup">${esc(g.l)}</div>${g.items.map(([k,l])=>`<a href="#${k}" data-k="${k}">${navIcon(k)}<span>${esc(l)}</span></a>`).join('')}`:`<a href="#${g.k}" data-k="${g.k}">${navIcon(g.k)}<span>${esc(g.l)}</span></a>`).join('')}
  <a href="#search">${I.search}<span>Search</span></a>
  <div class="dgroup">Display</div><div class="dopts"><label class="field" for="theme2">Theme<select id="theme2">${THEMES}</select></label><button type="button" class="btn dysbtn" id="dys2" aria-pressed="${!!S.settings.dys}">Aa Dyslexia-friendly font</button></div></div>`;
  drawer.hidden=false; $('#menu').setAttribute('aria-expanded','true'); const t2=$('#theme2'); t2.value=S.settings.theme; t2.onchange=e=>{ S.settings.theme=e.target.value; $('#theme').value=e.target.value; save(); applyTheme(); };
  $('#dys2').onclick=()=>$('#dys').click(); $('#dclose').onclick=closeDrawer; markNav(); $('#dclose').focus(); };
function closeDrawer(){ drawer.hidden=true; $('#menu').setAttribute('aria-expanded','false'); }
/* desktop group menus */
const closeMenus=except=>$$('.navg').forEach(g=>{ if(g!==except){ g.classList.remove('open'); g.querySelector('.navgb').setAttribute('aria-expanded','false'); } });
$$('.navgb').forEach(b=>{ b.onclick=e=>{ e.stopPropagation(); const g=b.parentElement, on=!g.classList.contains('open'); closeMenus(g); g.classList.toggle('open',on); b.setAttribute('aria-expanded',on); if(on) g.querySelector('.navmenu a').focus({preventScroll:true}); }; });
document.addEventListener('click',e=>{ if(!e.target.closest('.navg')) closeMenus(); });
$$('.navmenu a').forEach(x=>x.addEventListener('click',()=>closeMenus()));
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ const open=document.querySelector('.navg.open'); closeMenus(); if(open) open.querySelector('.navgb').focus(); } });
drawer.addEventListener('click',e=>{ if(e.target===drawer||e.target.closest('a')) closeDrawer(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!drawer.hidden) closeDrawer(); });
function markNav(){ const r=(location.hash||'#home').slice(1); const k=r.startsWith('pq-')?'bank':r.startsWith('mockr')?'mock':r.startsWith('t-')?'topics':r.startsWith('lab-')?'labs':r.startsWith('pag-')?'pags':r.startsWith('drill-')?'drills':r.startsWith('q-')?'bank':r; $$('[data-k]').forEach(a=>{ if(a.dataset.k===k) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); }); $$('.navgb').forEach(b=>b.classList.toggle('cur',b.dataset.keys.split(' ').includes(k))); }

let cleanup=null;
const FPUN=['Powered by caffeine (C₈H₁₀N₄O₂).','No electrons were lost in the making of this site. Some were gained.','Built at standard conditions.','Catalysed, not consumed.','100% yield, 100% atom economy.'];
function route(){ if(cleanup){ try{cleanup();}catch(e){} cleanup=null; } const dsp=document.getElementById('dspanel'); if(dsp) dsp.remove();
  const r=(location.hash||'#home').slice(1)||'home'; const v=$('#view'); v.innerHTML=''; v.style.animation='none'; void v.offsetWidth; v.style.animation='';
  touchDay(); markNav();
  if(r==='home') viewHome(v); else if(r==='topics') viewTopics(v); else if(r.startsWith('t-')) viewTopic(v,r.slice(2)); else if(r==='labs') viewLabs(v); else if(r.startsWith('lab-')) viewLab(v,r.slice(4));
  else if(r==='pags') viewPags(v); else if(r.startsWith('pag-')) viewPag(v,r.slice(4)); else if(r==='flash') viewFlash(v); else if(r==='quiz') viewQuiz(v); else if(r==='exam'){ sessionStorage.setItem('tt-bankf',JSON.stringify({src:'tt'})); location.replace('#bank'); return; } else if(r.startsWith('q-')){ location.replace('#pq-w_'+r.slice(2)); return; }
  else if(r==='bank'&&BK) BK.viewBank(v); else if(r.startsWith('pq-')&&BK) BK.viewBankQ(v,r.slice(3)); else if(r==='mock'&&BK) BK.viewMock(v); else if(r.startsWith('mockrun-')&&BK) cleanup=BK.viewMockRun(v,r.slice(8)); else if(r.startsWith('mockres-')&&BK) BK.viewMockRes(v,r.slice(8)); else if(r==='videos'||r.startsWith('videos_')) viewVideos(v,r.split('_')[1]); else if(r==='papers') viewPapers(v); else if(r==='sheet') viewSheet(v); else if(r==='progress') viewProgress(v); else if(r==='search') viewSearch(v); else if(r==='drills'&&window.CHEMX) CHEMX.drills(v); else if(r.startsWith('drill-')&&window.CHEMX) CHEMX.drill(v,r.slice(6)); else if(r==='rxmap'&&window.CHEMX) CHEMX.rxmap(v); else if(r==='spec'&&window.CHEMX) CHEMX.spec(v); else viewHome(v);
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
const TPUN={'1.1':'Accurate, precise and reproducible. Just like your revision.','2.1.1':'Isotopes: same element, different weight class.','2.1.2':'Balance your equations, balance your life.','2.1.3':'Mole-y moley, you’re on a roll.','2.1.4':'Neutralise the stress.','2.1.5':'OIL RIG: the only rig worth working on.','2.2.1':'Electrons, get in formation (1s² 2s² 2p⁶).','2.2.2':'You and this topic? A strong covalent bond.','3.1.1':'History repeats itself. So do trends across a period.','3.1.2':'Group 2: alkaline earth, extremely down to earth.','3.1.3':'Displacing halides, not motivation.','3.1.4':'Test, observe, conclude. Precipitate success.','3.2.1':'Exothermic revision: it gives off good vibes.','3.2.2':'Raise the temperature, raise the rate.','3.2.3':'Le Chatelier says: oppose the change, not the revision.','4.1.1':'Name it, draw it, nail it.','4.1.2':'Alkanes: saturated with knowledge.','4.1.3':'Alkenes: they really open up to electrophiles.','4.2.1':'Alcohols: primary, secondary, tertiary. Revise in that order.','4.2.2':'Haloalkanes: a nucleophile’s favourite target.','4.2.3':'Reflux, distil, repeat.','4.2.4':'IR you ready for spectroscopy?','5.1.1':'Rate this topic: first order in effort.','5.1.2':'Kc you later, equilibrium.','5.1.3':'Buffers: resisting change since forever.','5.2.1':'Born–Haber cycles: going round in circles, on purpose.','5.2.2':'ΔG < 0: revision is feasible.','5.2.3':'Stay positive, like a standard electrode potential.','5.3.1':'Transition metals: colourful characters.','5.3.2':'Precipitate your knowledge.','6.1.1':'Benzene: delocalised, but very grounded.','6.1.2':'Carbonyls: always a good reaction.','6.1.3':'Esters smell nice. So does a good grade.','6.2.1':'Amines: basically brilliant.','6.2.2':'Chirality: you’ll never look at your hands the same way.','6.2.3':'Condensation polymers: they lose a little water and gain a lot of strength.','6.2.4':'C–C bonds: building something bigger.','6.2.5':'Plan the synthesis, synthesise the plan.','6.3.1':'Chromatography: separating the facts from the fiction.','6.3.2':'NMR: every peak tells a story.'};
const PUN_EMPTY=['Nothing here: as unreactive as a noble gas.','Zero results. Inert, like argon.','Nothing reacted. Try widening the filters.'];
const PUN_HI=['Element-ary!','You’re on fire (blue flame, complete combustion).','100% yield!','Noble work: completely stable.'];
const PUN_MID=['Good progress: equilibrium is shifting your way.','Halfway there: past the activation energy.','Solid progress. Keep the reaction going.'];
const PUN_LO=['Every great chemist started with a spill.','No reaction yet: add a catalyst and try again.','Errors are just uncertainties waiting to shrink.'];
const punFor=p=>pick(p>=80?PUN_HI:p>=50?PUN_MID:PUN_LO);
window.TTPUN={pick,punFor,PUN_EMPTY};
const PUNS=['Revision with all the right elements.','I’d tell a chemistry joke, but all the good ones argon.','Stay positive, like a cation.','Don’t trust atoms: they make up everything.','Keep calm and titrate.','Every equation, fully balanced.','Lower your activation energy: just start.','If you’re not part of the solution, you’re part of the precipitate.','Your grades are about to be oxidised. Upwards.','Moles: not just garden pests.','Bonding with your revision, covalently.','Ionic bonds: all about give and take.','Le Chatelier would want you to oppose procrastination.','Enthalpy of revision: very exothermic.','We’ve got the best puns. Periodically.','Reflux and chill.','You’ve got great chemistry with this subject.','Revision catalysed, not consumed.'];
function viewHome(v){
  const fcDue=dueCards(CARDS).length, quizBest=S.quiz.length?Math.max(...S.quiz.map(q=>Math.round(q.s/q.n*100))):null, examDone=Object.values(S.exam).filter(x=>x.got!=null).length;
  const nextT=T.find(t=>!S.revised[t.id])||T[0];
  v.innerHTML=`<section class="hero"><div class="hero-text"><span class="eyebrow">OCR A Level Chemistry A · H432 and AS H032</span><h1>TrainTanmay Chemistry</h1><p class="pun" id="pun" aria-live="off"></p>
  <p>Every topic across the six modules with notes, key definitions and equations, the ${PG.list.length} PAG practicals, ${BK&&BK.count?BK.count.toLocaleString()+' exam questions with mark schemes and a practice test builder, ':''}PMT topic questions for every topic, and links to every OCR past paper on Physics &amp; Maths Tutor.</p>
  <div class="row"><a class="btn primary" href="#t-${nextT.id}">Continue with ${nextT.id} ${esc(nextT.title)}</a><a class="btn" href="#papers">Past papers</a></div></div>
  <div class="hero-scopewrap"><a class="hero-scope" href="#sheet" title="Open the data sheet"><svg class="hs-art" viewBox="0 0 520 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A conical flask of bubbling orange liquid between periodic table tiles: open the data sheet"><defs><linearGradient id="hsfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c0c03" stop-opacity="0"/><stop offset="1" stop-color="#1c0c03" stop-opacity=".95"/></linearGradient></defs><rect width="520" height="200" fill="#2a1406"/>
   <g fill="none" stroke="#ffb27a" stroke-opacity=".16" stroke-width="1">${Array.from({length:15},(_,i)=>`<path d="M${i*36+8} 0V200"/>`).join('')}${Array.from({length:6},(_,i)=>`<path d="M0 ${i*36+10}H520"/>`).join('')}</g>
   ${[['C',6,'12.0',40,22],['O',8,'16.0',106,84],['Cl',17,'35.5',356,84],['Na',11,'23.0',422,22]].map(([s,z,m,x,y],k)=>`<g class="hs-tile" style="--d:${k*.12}s" transform="translate(${x} ${y})"><rect width="58" height="64" rx="8" fill="#ff7a2f" fill-opacity=".12" stroke="#ffb27a" stroke-opacity=".7" stroke-width="1.5"/><text x="7" y="14" font-family="IBM Plex Mono, monospace" font-size="10" fill="#ffb27a">${z}</text><text x="29" y="43" text-anchor="middle" font-family="Barlow Semi Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="27" fill="${k%2?'#ffb27a':'#ff7a2f'}">${s}</text><text x="29" y="58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="#ffb27a" fill-opacity=".85">${m}</text></g>`).join('')}
   <g transform="translate(260 12) scale(.75) translate(-200 -40)"><g stroke="#140a04" stroke-width="4" stroke-linejoin="round"><path d="M172 40h56v8h-6v62l58 104q6 14-10 14H130q-16 0-10-14l58-104V48h-6z" fill="#fff4ea"/><path class="hs-liq" d="M152 168h96l32 46q6 14-10 14H130q-16 0-10-14z" fill="#ff7a2f"/></g>
   <g fill="#fff4ea" stroke="#140a04" stroke-width="3"><circle cx="176" cy="204" r="7"/><circle cx="222" cy="196" r="5"/><circle cx="204" cy="214" r="4"/><circle class="hs-b" style="--d:0s" cx="196" cy="182" r="5"/><circle class="hs-b" style="--d:1.1s" cx="210" cy="186" r="4"/><circle class="hs-b" style="--d:2.2s" cx="188" cy="190" r="3.5"/></g></g>
   <rect y="150" width="520" height="50" fill="url(#hsfade)"/>
  </svg><span class="sh-cta">Data sheet: constants, equations and the periodic table →</span></a>
  </div></section>
  <div class="statrow" style="margin-top:16px"><div class="stat"><b>${overall()}%</b><span>course progress</span></div><div class="stat"><b>${fcDue}</b><span>flashcards due</span></div><div class="stat"><b>${quizBest==null?'–':quizBest+'%'}</b><span>best quiz score</span></div><div class="stat"><b>${streak()}</b><span>day streak</span></div></div>
  <h2 style="margin:30px 0 12px">Modules</h2><div class="grid g3">${MODS.map(m=>{ const ts=T.filter(t=>t.mod===m.n); const p=Math.round(ts.reduce((a,t)=>a+topicPct(t),0)/ts.length); return `<a class="tcard" href="#topics" data-mod="${m.n}"><span class="id">Module ${m.n} · ${esc(m.papers)}</span><h4>${esc(m.title)}</h4><div class="bar"><i style="width:${p}%"></i></div><div class="meta"><span>${ts.length} topic${ts.length===1?'':'s'}${m.as?' · in AS':''}</span><span>${p}%</span></div></a>`; }).join('')}</div>
  ${Object.keys(LABS).length?`<h2 style="margin:30px 0 12px">Jump into a lab</h2><div class="grid fit4">${Object.keys(LABS).slice(0,4).map(labCard).join('')}</div>`:''}
  <h2 style="margin:30px 0 12px">Practise and explore</h2><div class="grid fit3"><a class="tcard" href="#drills"><span class="id">Physical chemistry</span><h4>Calculation drills</h4><p>${window.CHEMDRILLS?CHEMDRILLS.list.length:0} kinds of calculation, from moles to Born–Haber cycles, with new numbers every time and a worked solution.</p></a><a class="tcard" href="#rxmap"><span class="id">Organic chemistry</span><h4>Reaction map</h4><p>Every organic reaction on one map with reagents, conditions and a quiz mode.</p></a><a class="tcard" href="#spec"><span class="id">Analysis</span><h4>Spectroscopy practice</h4><p>Identify compounds from IR, mass spectra and NMR data.</p></a></div>
  <h2 style="margin:30px 0 12px">Exam papers at a glance</h2><div class="grid fit3">${SP.papers.slice(0,3).map(p=>`<div class="card"><span class="eyebrow">${esc(p.code)} · ${esc(p.time)} · ${p.marks} marks · ${esc(p.weight)}</span><h3 style="margin:4px 0 6px">${esc(p.name)}</h3><p class="muted" style="margin:0 0 8px;font-size:.9rem">${esc(p.mods)}. ${esc(p.fmt)}</p><a class="btn btn-sm" href="#papers">See papers</a></div>`).join('')}</div>`;
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
  v.innerHTML=`<span class="eyebrow">Specification content</span><h1>Topics</h1><p class="muted" style="max-width:74ch">All six modules of OCR A Level Chemistry A. AS (H032) covers modules 1–4. Coloured dots show your confidence rating for each topic. The notes are full lessons with worked examples, written with AI, so check anything that looks wrong against your textbook.</p>
  <div class="stack" style="gap:28px;margin-top:18px">${MODS.map(m=>`<section class="mod" id="mod${m.n}"><div class="mod-head"><span class="mnum">${m.n}</span><h2>${esc(m.title)}</h2><span class="chip">${esc(m.papers)}</span>${m.as?'<span class="chip teal">AS and A level</span>':'<span class="chip ai">A level only</span>'}</div>
  <div class="grid g3">${T.filter(t=>t.mod===m.n).map(t=>`<a class="tcard" href="#t-${t.id}"><span class="id">${t.id}</span><h4>${esc(t.title)}</h4><p>${esc(t.short)}</p><div class="meta"><span><span class="rag ${topicConf(t.id)}"></span> ${topicPct(t)}%</span><span>${t.labs.length?t.labs.length+' lab'+(t.labs.length>1?'s':''):''}${t.pags.length?' · '+t.pags.length+' PAG':''}</span></div></a>`).join('')}</div></section>`).join('')}</div>`;
  if(want){ const el=$('#mod'+want); el&&el.scrollIntoView(); }
}

/* ---------- labs woven into the notes ---------- */
const STOPW=new Set('the and for with from into that this then than are was were has have its their your you can use using used how what when where which while about over under between through each all any not but per of to in on at by as an a or be is it'.split(' '));
const words=s=>String(s).toLowerCase().replace(/<[^>]+>/g,' ').match(/[a-zα-ω]{3,}/g)||[];
function weaveVids(art){ if(!art) return; const V=(window.MEDIA&&MEDIA.videos)||[]; art.querySelectorAll('.vidrec[data-vid]').forEach(el=>{ const x=V.find(v=>v.id===el.dataset.vid); if(!x){ el.remove(); return; } el.innerHTML=`<button type="button" class="vr-thumb" aria-label="Watch: ${esc(x.title)}"><img alt="" src="https://i.ytimg.com/vi/${x.id}/hqdefault.jpg" onerror="this.remove()"><span class="vplay"><span>${PLAY}</span></span></button><div><span class="eyebrow">Recommended video</span><b>${esc(x.title)}</b><p>${esc(x.rec||'')}</p><button type="button" class="btn btn-sm primary">Watch it</button></div>`; el.querySelectorAll('button').forEach(b=>b.onclick=()=>openVideo(x)); }); }
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
  const tabs=[['notes','Notes'],['eqs','Equations',t.eqs.length],['terms','Key terms',t.terms.length],['fc','Flashcards'],['mcq','Quick quiz',t.mcq.length],['packs','Past paper packs',t.packs.length],['labs','Labs & practicals',t.labs.length+t.pags.length]].concat(BK&&BK.topicCount(t.id)?[['qb','Practice questions',BK.topicCount(t.id)]]:[]).concat(topicVids(t.id).length||topicCases(t.id).length?[['vids','Videos',topicVids(t.id).length]]:[]).filter(x=>x[2]!==0);
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#topics">Module ${t.mod}: ${esc(m.title)}</a> / ${t.id}</span><h1>${esc(t.title)}</h1><p class="muted" style="margin:6px 0 0">${esc(t.short)}</p>${TPUN[t.id]?`<p class="tpun">${esc(TPUN[t.id])}</p>`:''}</div><div class="row">${prev?`<a class="btn btn-sm" href="#t-${prev.id}">← ${prev.id}</a>`:''}${next?`<a class="btn btn-sm" href="#t-${next.id}">${next.id} →</a>`:''}</div></div>
  <div class="tabs" role="tablist">${tabs.map(([k,l,n],i)=>`<button role="tab" data-tab="${k}" aria-selected="${i===0}">${l}${n!=null?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>
  <div class="tp-layout"><div id="tabbody" style="min-width:0"></div><aside class="side">
   <div class="card specbox"><span class="eyebrow">Specification checklist</span><ol>${t.spec.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>
   <div class="card"><span class="eyebrow">How confident are you?</span><div class="conf">${[['r','Not yet'],['a','Getting there'],['g','Confident']].map(([k,l])=>`<button class="${k}" data-c="${k}" aria-pressed="${S.conf[t.id]===k}">${l}</button>`).join('')}</div>
   <label class="toggle" style="margin-top:12px" for="rev"><input type="checkbox" id="rev" ${S.revised[t.id]?'checked':''}> Notes revised</label></div>
   ${t.labs.length?`<div class="card"><span class="eyebrow">Try it in the lab</span><div class="stack" style="gap:6px;margin-top:6px">${t.labs.map(l=>`<a href="#lab-${l}">${esc(LABS[l].title)}</a>`).join('')}${t.pags.map(p=>{ const q=PG.list.find(x=>x.id===p); return `<a href="#pag-${p}">PAG ${q.pag}: ${esc(q.title)}</a>`; }).join('')}</div></div>`:''}
  </aside></div>
  <nav class="nexttopic" aria-label="Topic navigation">${prev?`<a class="prevt" href="#t-${prev.id}">← ${prev.id} ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a class="big" href="#t-${next.id}"><small>Next topic</small>${next.id} ${esc(next.title)} →</a>`:`<a class="big" href="#topics"><small>That’s the whole course!</small>All topics →</a>`}</nav>`;
  $$('.conf button',v).forEach(b=>b.onclick=()=>{ S.conf[t.id]=b.dataset.c; save(); $$('.conf button',v).forEach(x=>x.setAttribute('aria-pressed',x===b)); });
  $('#rev').onchange=e=>{ S.revised[t.id]=e.target.checked; save(); };
  const body=$('#tabbody'); let sub=null;
  const show=k=>{ if(sub){ try{sub();}catch(e){} sub=null; } $$('[data-tab]',v).forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===k)); body.innerHTML=''; const lay=$('.tp-layout',v); lay.classList.toggle('solo',k!=='notes');
    if(k==='notes'){ body.innerHTML=`<article class="notes">${t.notes}</article>`; sub=weaveLabs($('article.notes',body),t); }
    if(k==='eqs') body.innerHTML=`<p class="muted">Equations for this topic. The OCR Data Sheet only gives constants and the periodic table, so you need to learn these equations and when to use them.</p><div class="eqlist">${t.eqs.map(([e,m])=>`<div class="eq"><b>${e}</b><span>${esc(m)}</span></div>`).join('')}</div>`;
    if(k==='terms') body.innerHTML=`<p class="muted">Definitions examiners expect word for word. Learn the key phrases.</p><div class="terms">${t.terms.map(([a,b])=>`<div class="term"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>`;
    if(k==='fc') sub=flashDeck(body,CARDS.filter(c=>c.topic===t.id));
    if(k==='mcq') sub=runQuiz(body,t.mcq.slice(),t.id);
    if(k==='exam') body.innerHTML=`<p class="muted">Exam-style questions written in the style of OCR H432/H032 papers, with full mark schemes. For the real thing, open the past paper packs tab.</p><div class="ql">${t.exam.map(qItem).join('')}</div>`;
    if(k==='packs') body.innerHTML=packsBlock(t);
    if(k==='qb'){ const n=BK.topicCount(t.id); body.innerHTML=`<div class="card"><h3 style="margin:0 0 6px">${n} practice questions on ${esc(t.title)}</h3><p class="muted" style="margin:0 0 12px">Real past-paper questions from the PMT topic packs plus exam-style questions written for this topic, all with mark schemes. Only questions that stay entirely within this topic are included, so nothing from other topics comes up.</p><div class="row"><a class="btn primary" href="#bank" id="qbgo">Practise questions</a><a class="btn" href="#mock" id="qbmock">Practice test on this topic</a></div></div>`; $('#qbgo').onclick=()=>sessionStorage.setItem('tt-bankf',JSON.stringify({t:t.id})); $('#qbmock').onclick=()=>sessionStorage.setItem('tt-mockpre',JSON.stringify({topics:[t.id]})); }
    if(k==='vids'){ const tv=topicVids(t.id), tc=topicCases(t.id); body.innerHTML=`${vSections(tv)}${tc.length?`<h3 style="margin:20px 0 10px">Real-world examples</h3><div class="casegrid">${tc.map(caseCard).join('')}</div>`:''}<p class="muted" style="margin-top:14px"><a href="#videos_${t.mod}">All Module ${t.mod} videos →</a></p>`; bindVids(body); }
    if(k==='labs') body.innerHTML=`${t.labs.length?`<h3 style="margin-bottom:10px">Interactive labs</h3><div class="grid g3">${t.labs.map(labCard).join('')}</div>`:''}${t.pags.length?`<h3 style="margin:22px 0 10px">Required practicals (PAGs)</h3><div class="grid g3">${t.pags.map(p=>pagCard(PG.list.find(x=>x.id===p))).join('')}</div>`:''}${!t.labs.length&&!t.pags.length?'<div class="empty">No lab for this topic yet.</div>':''}`;
  };
  $$('[data-tab]',v).forEach(b=>b.onclick=()=>show(b.dataset.tab)); show('notes');
  cleanup=()=>{ if(sub) sub(); };
}
function packsBlock(t){ const sets={}; t.packs.forEach(p=>{ (sets[p.set]=sets[p.set]||[]).push(p); });
  const desc={'Set J 2022–24':'OCR A questions from the 2022–2024 papers.','Set G 2016–21':'OCR A questions from the 2016–2021 papers, plus a multiple-choice pack.'};
  return `<p class="muted" style="max-width:72ch">Real exam questions sorted by topic, compiled by Physics &amp; Maths Tutor. QP = question paper, MS = mark scheme.</p>${Object.entries(sets).map(([s,arr])=>`<h3 style="margin:18px 0 8px">${esc(s)}</h3>${desc[s]?`<p class="muted" style="margin:0 0 8px;font-size:.9rem">${desc[s]}</p>`:''}<div class="packgrid">${arr.map(p=>`<a class="pack" href="${esc(p.url)}" target="_blank" rel="noopener"><span>${esc(p.label)}</span><small>${/MS$/.test(p.label)?'MS':/MCQ$/.test(p.label)?'MCQ':'QP'} ${I.ext.replace('<svg','<svg width="12" height="12"')}</small></a>`).join('')}</div>`).join('')}`; }
const qItem=q=>{ const r=S.exam[q.id]||{}; return `<a class="qitem" href="#q-${qKey(q.id)}"><span class="qid">${esc(q.id)}</span><span class="qt"><b>${esc(q.style)}</b> · ${esc(q.stem)}</span><span class="qm">${r.got!=null?`<span class="chip good">${r.got}/${q.marks}</span>`:q.marks+' marks'}</span></a>`; };

/* ---------- FLASHCARDS ---------- */
const BOXDAYS=[0,1,2,4,8,16];
function flashDeck(el,cards){
  let queue=dueCards(cards); if(!queue.length) queue=cards.slice();
  queue=queue.sort(()=>Math.random()-0.5); let i=0, flipped=false;
  const render=()=>{ if(!cards.length){ el.innerHTML='<div class="empty">No cards.</div>'; return; }
    const c=queue[i%queue.length]; const box=(S.flash[c.id]||{}).box||0; const counts=BOXDAYS.map((_,b)=>cards.filter(x=>((S.flash[x.id]||{}).box||0)===b).length);
    el.innerHTML=`<div class="boxes">${counts.map((n,b)=>`<span>Box ${b}: ${n}</span>`).join('')}</div><div class="fc-stage"><div class="fc ${flipped?'flip':''}" id="fc" tabindex="0" role="button" aria-label="Flip card"><div class="fc-face"><span class="eyebrow">${c.kind} · ${c.topic} ${esc(byId[c.topic].title)}</span><div class="q">${c.kind==='Equation'?'Write the equation for: '+esc(c.front):c.kind==='Recall'?esc(c.front):'Define: '+esc(c.front)}</div><span class="muted" style="font-size:.85rem">Tap or press space to flip</span></div><div class="fc-face back"><span class="eyebrow">Answer · box ${box}</span><div class="a" style="${c.kind==='Equation'?'font-family:var(--f-mono);font-size:1.4rem;font-weight:600':''}">${c.html?c.back:esc(c.back)}</div></div></div>
    <div class="fc-controls"><button class="btn" id="again">Didn’t know it</button><button class="btn primary" id="good">Knew it</button><button class="btn ghost" id="skip">Skip</button></div><p class="muted" style="text-align:center;font-size:.85rem">${queue.length} card${queue.length>1?'s':''} in this session · card ${i%queue.length+1}</p></div>`;
    const fc=$('#fc',el); fc.onclick=()=>{ flipped=!flipped; fc.classList.toggle('flip',flipped); }; fc.onkeydown=e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); fc.click(); } };
    const grade=ok=>{ const f=S.flash[c.id]||{box:0}; f.box=ok?Math.min(5,f.box+1):0; f.due=Date.now()+BOXDAYS[f.box]*864e5; S.flash[c.id]=f; save(); i++; flipped=false; render(); };
    $('#again',el).onclick=()=>grade(false); $('#good',el).onclick=()=>grade(true); $('#skip',el).onclick=()=>{ i++; flipped=false; render(); }; };
  render(); return ()=>{};
}
function viewFlash(v){
  v.innerHTML=`<span class="eyebrow">Spaced repetition</span><h1>Flashcards</h1><p class="muted" style="max-width:72ch">${CARDS.length} cards across all ${T.length} topics: every definition and equation, plus recall cards on reagents, conditions, observations and tests. Cards you know move up a box and come back less often (Leitner system).</p>
  <div class="filters"><label class="field" for="fmod">Module<select id="fmod"><option value="">All modules</option>${MODS.map(m=>`<option value="${m.n}">Module ${m.n}: ${esc(m.short)}</option>`).join('')}</select></label><label class="field" for="fkind">Cards<select id="fkind"><option value="">All cards</option><option value="Definition">Definitions only</option><option value="Equation">Equations only</option><option value="Recall">Recall: reagents, tests and facts</option></select></label><span class="muted" id="fdue"></span></div><div id="deck"></div>`;
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
  v.innerHTML=`<span class="eyebrow">Structured and extended response</span><h1>Exam questions</h1><p class="muted" style="max-width:76ch">${ALLQ.length} exam-style questions written to match OCR H432 and H032 papers, each with a full mark scheme. Write your answer, then reveal the mark scheme and self-mark. For real past paper questions use <a href="#papers">Past papers</a> or the topic packs on each topic page.</p>
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
    const prompt=`You are an experienced OCR A Level Chemistry A (H432) examiner. Mark the student's answer strictly against the mark scheme, awarding compensated marks for correct working (error carried forward) as OCR does. Reply in plain text: first line "Mark: X/${q.marks}", then one short line per part saying which marking points were earned and what was missing, then one sentence on how to gain full marks. Use correct units and significant figures in comments.\n\nQUESTION: ${q.stem}\n${q.parts.map((p,i)=>`(${String.fromCharCode(97+i)}) [${p.m}] ${p.q}`).join('\n')}\n\nMARK SCHEME:\n${q.parts.map((p,i)=>`(${String.fromCharCode(97+i)}) [${p.m}] ${p.ms.join('; ')}${p.ans?' | answer: '+p.ans:''}`).join('\n')}\n\nSTUDENT ANSWER:\n${txt}`;
    const para=s=>esc(s).split(/\n+/).map(l=>`<p>${l}</p>`).join('');
    try{ let last=''; const res=await sampleCap(prompt,{modelTier:'default',onText:({text})=>{ last=text; out.innerHTML=`<div class="aimark">${para(text)}</div>`; }}); const final=res&&res.text||last; out.innerHTML=`<div class="aimark"><span class="chip ai" style="margin-bottom:6px">AI marking · check it against the mark scheme</span>${para(final)}</div>`; const m=final.match(/Mark:\s*(\d+)\s*\/\s*(\d+)/i); if(m&&!$('#got').value) $('#got').value=m[1]; }
    catch(e){ out.innerHTML=`<div class="aimark muted">${e&&e.code==='not_granted'?'AI marking was not allowed in this view.':e&&e.code==='rate_limited'?'Too many requests: try again in a minute.':'AI marking is unavailable right now.'}</div>`; }
    aiBtn.disabled=false; };
}

/* ---------- LABS ---------- */
const LABCATS=['Practical skills','Atoms & bonding','Energetics','Organic','Rates & equilibrium','Acids & bases','Electrochemistry','Transition elements','Analysis'];
function viewLabs(v){ const ids=Object.keys(LABS); const cats=LABCATS.filter(c=>ids.some(id=>LABS[id].cat===c));
  v.innerHTML=`<span class="eyebrow">Interactive simulations</span><h1>Labs</h1><p class="muted" style="max-width:76ch">${ids.length} interactive labs: run a titration and plot the pH curve, measure ΔH, watch collisions and the Boltzmann distribution, disturb equilibria, build cells, test for ions, spin molecules in 3D and explore spectra. The PAG pages under <a href="#pags">Practicals</a> use the same labs.</p>
  ${LABS.missions?`<a class="featlab" href="#lab-missions"><span class="eyebrow">Featured lab</span><h2>${esc(LABS.missions.title)}</h2><p>${esc(LABS.missions.desc)}</p><span class="btn primary btn-sm">Explore lab →</span></a>`:''}<div class="subtabs" role="group" aria-label="Filter labs"><button aria-pressed="true" data-c="">All</button>${cats.map(c=>`<button aria-pressed="false" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="grid g3" id="lg"></div>`;
  const draw=c=>{ $('#lg').innerHTML=ids.filter(id=>!c||LABS[id].cat===c).map(labCard).join(''); $$('.subtabs button',v).forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c)); };
  $$('.subtabs button',v).forEach(b=>b.onclick=()=>draw(b.dataset.c)); draw(''); }
function viewLab(v,id){ const L=LABS[id]; if(!L){ v.innerHTML='<div class="empty">Lab not found. <a href="#labs">All labs</a></div>'; return; }
  const t=byId[L.topic]; const rel=Object.keys(LABS).filter(k=>k!==id&&LABS[k].topic===L.topic);
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#labs">Labs</a> / ${esc(L.cat)}</span><h1>${esc(L.title)}</h1><p class="muted" style="margin:6px 0 0;max-width:72ch">${esc(L.desc)}</p></div><div class="row">${t?topicLink(L.topic):''}</div></div>${PSWSET.has(id)?PSW(1):''}<div class="lab" id="labroot"></div>${rel.length?`<h3 style="margin:24px 0 10px">More labs for ${esc(L.topic)}</h3><div class="grid g3">${rel.map(labCard).join('')}</div>`:''}`;
  L.id=id; cleanup=LK.frame($('#labroot'),L,(window.LABGUIDES||{})[id]); }

/* ---------- PRACTICALS ---------- */
const PAGNAMES={1:'Moles determination',2:'Acid–base titration',3:'Enthalpy determination',4:'Qualitative analysis of ions',5:'Synthesis of an organic liquid',6:'Synthesis of an organic solid',7:'Qualitative analysis of organic functional groups',8:'Electrochemical cells',9:'Rates of reaction: continuous monitoring method',10:'Rates of reaction: initial rates method',11:'pH measurement',12:'Research skills'};
function viewPags(v){ const nums=[...new Set(PG.list.map(p=>p.pag))];
  v.innerHTML=`<span class="eyebrow">Practical Endorsement · CPAC</span><h1>Practicals</h1><p class="muted" style="max-width:78ch">The OCR Practical Activity Groups (PAGs) for the Practical Endorsement. Each one has the method, safety, variables and evaluation points. PAGs 2, 3, 4, 8 and 11 run as interactive labs in the Run the experiment tab. Practical skills are tested across all three papers, not just in the endorsement.</p>
  <div class="stack" style="gap:26px;margin-top:16px">${nums.map(n=>`<section class="mod"><div class="mod-head"><span class="mnum">${n}</span><h2>${esc(PAGNAMES[n])}</h2></div><div class="grid g3">${PG.list.filter(p=>p.pag===n).map(pagCard).join('')}</div></section>`).join('')}
  <section class="mod"><div class="mod-head"><span class="mnum">12</span><h2>${PAGNAMES[12]}</h2></div><div class="card"><p style="margin:0 0 8px">PAG 12 is a research task: use books, journals and websites to research a practical technique or application (for example how a catalytic converter works, or how chromatography is used in forensics), cite sources properly and present your findings.</p><a class="btn btn-sm" href="https://www.physicsandmathstutor.com/chemistry-revision/a-level-ocr-a/module-1/" target="_blank" rel="noopener">${I.ext} PMT module 1 PAG notes</a></div></section></div>`; }
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
const VG={'0':'Whole course','1':'Module 1: Practical skills','2':'Module 2: Foundations in chemistry','3':'Module 3: Periodic table and energy','4':'Module 4: Core organic chemistry','5':'Module 5: Physical chemistry and transition elements','6':'Module 6: Organic chemistry and analysis','9':'GCSE bridging'};
const VCOL=['#d9480f','#a8360b','#e8702a','#0f7d78','#7a3c9e','#c25a1c','#1d6f8f','#b8481e','#5c4a9e','#2f7d5b'];
const ytUrl=x=>'https://www.youtube.com/watch?v='+x.id+(x.start?'&t='+x.start+'s':'');
function vTile(x){ const c=VCOL[(+x.g||0)%VCOL.length]; return `<button type="button" class="vtile" data-v="${x.i}"><div class="vthumb" style="background:linear-gradient(135deg,${c},#2a1005)"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${x.id}/mqdefault.jpg" onerror="this.remove()"><div class="vplay"><span>${PLAY}</span></div>${x.kind!=='Videos'?`<span class="vbadge">${esc(x.kind)}</span>`:''}</div><div class="vmeta"><small>${esc(x.t.filter(id=>byId[id]).join(', ')||VG[x.g]||'')} · ${esc(x.sec||'')}</small><b>${esc(x.title)}</b>${x.by?`<small>${esc(x.by)}</small>`:''}</div></button>`; }
function vSections(list){ if(!list.length) return '<div class="empty">No videos match.</div>'; const secs=[]; list.forEach(x=>{ let g=secs.find(q=>q.sec===x.sec); if(!g){ g={sec:x.sec,t:x.t,kinds:{}}; secs.push(g); } (g.kinds[x.kind]=g.kinds[x.kind]||[]).push(x); });
  const kl=k=>k==='Videos'?'Explainers and worked examples':k; const tt=g=>{ const ids=g.t.filter(id=>byId[id]); return ids.length?(ids.length>1?ids[0]+'–'+ids[ids.length-1]:ids[0])+' '+g.sec:g.sec; };
  return secs.map(g=>`<div class="vsec"><h3>${esc(tt(g))}</h3>${Object.entries(g.kinds).map(([k,xs])=>`<div class="vkind">${esc(kl(k))} · ${xs.length}</div><div class="vgrid">${xs.map(vTile).join('')}</div>`).join('')}</div>`).join(''); }
function bindVids(root){ $$('.vtile',root).forEach(b=>b.onclick=()=>openVideo(MED.videos[+b.dataset.v],b)); }
function openVideo(x,from){
  const m=h(`<div class="vmodal" role="dialog" aria-modal="true" aria-label="${esc(x.title)}"><div class="vbox"><a class="vframe" href="${ytUrl(x)}" target="_blank" rel="noopener"><img alt="" src="https://i.ytimg.com/vi/${x.id}/hqdefault.jpg" onerror="this.remove()"><span class="vplay"><span style="width:76px;height:76px">${PLAY}</span></span></a><div class="vbar"><b>${esc(x.title)}${x.by?' · '+esc(x.by):''}</b><a class="btn btn-sm primary" href="${ytUrl(x)}" target="_blank" rel="noopener">Watch on YouTube ${I.ext}</a><button class="iconbtn" aria-label="Close">${I.close}</button></div><div class="muted" style="font-size:.8rem;padding:0 14px 12px">${esc(x.t.filter(id=>byId[id]).map(id=>id+' '+byId[id].title).join(' · ')||VG[x.g]||'')}. Videos open on YouTube in a new tab: tap the picture or the button.</div></div></div>`);
  document.body.appendChild(m); const box=m.querySelector('.vbox');
  if(from){ const r=from.getBoundingClientRect(); box.style.transformOrigin=`${r.left+r.width/2-innerWidth/2+box.offsetWidth/2}px ${r.top+r.height/2-innerHeight/2+box.offsetHeight/2}px`; }
  requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('open')));
  const close=()=>{ m.classList.remove('open'); document.removeEventListener('keydown',kd); setTimeout(()=>m.remove(),420); from&&from.focus(); };
  const kd=e=>{ if(e.key==='Escape') close(); }; document.addEventListener('keydown',kd);
  m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.iconbtn')) close(); }); m.querySelector('.iconbtn').focus(); }
function caseCard(c){ const tp=c.t.filter(id=>byId[id]); return `<div class="casecard"><span class="eyebrow">${esc(tp.length?tp.join(', ')+' · '+(c.sec||''):VG[c.g]||'')}</span><h4>${esc(c.name)}</h4><p>${esc(c.desc||'')}</p>${(c.links||[]).map(([t,u])=>`<a class="caselink" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ${I.ext}</a>`).join('')}</div>`; }
function viewVideos(v,g){
  v.innerHTML=`<span class="eyebrow">Video library</span><h1>Videos</h1><p class="muted" style="max-width:74ch">${MED.videos.length} hand-picked videos for every OCR A topic, from teachers and channels like Allery Chemistry, MaChemGuy, Freesciencelessons, Science Shorts and The Organic Chemistry Tutor. Start with the full topic revision video, then use the shorter ones for the parts you find hard. Tap a thumbnail to watch on YouTube.</p>
  <div class="filters"><label class="field">Module<select id="vg"><option value="">All modules</option>${Object.entries(VG).filter(([k])=>MED.videos.some(x=>x.g===k)).map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select></label><label class="field">Type<select id="vk"><option value="">All videos</option><option value="Full topic revision">Full topic revision</option><option value="Quick revision">Quick revision</option><option value="Videos">Explainers and worked examples</option><option value="GCSE refresher">GCSE refreshers</option><option value="Fun">Fun and wider viewing</option></select></label><label class="field" style="flex:1;min-width:200px">Search<input type="search" id="vq" placeholder="e.g. buffers, NMR, Born–Haber"></label></div>
  <div id="vout"></div>`;
  if(g&&VG[g]) $('#vg').value=g;
  const render=()=>{ const G=$('#vg').value, K=$('#vk').value, q=$('#vq').value.trim().toLowerCase();
    const vs=MED.videos.filter(x=>(!G||x.g===G)&&(!K||x.kind===K)&&(!q||(x.title+' '+x.sec+' '+(x.by||'')).toLowerCase().includes(q)));
    const cs=K&&K!=='Videos'?[]:MED.cases.filter(c=>(!G||c.g===G)&&(!q||(c.name+' '+c.sec+' '+(c.desc||'')).toLowerCase().includes(q)));
    $('#vout').innerHTML=`${vSections(vs)}${MED.cases.length?`<div class="sep"></div><h2 style="margin-bottom:12px">Real-world examples <span class="mono muted" style="font-size:.9rem">${cs.length}</span></h2><div class="casegrid">${cs.map(caseCard).join('')||'<div class="empty">No examples match.</div>'}</div>`:''}`;
    bindVids(v); };
  $('#vg').onchange=render; $('#vk').onchange=render; $('#vq').oninput=render; render(); }

function viewPapers(v){
  /* papers open here in the site; "Sit it" is exam conditions (full screen, timed). Times are kept per paper. */
  const minsOf=p=>{ const m=/(\d+)\s*h(?:\w*)?\s*(?:(\d+)\s*min)?/.exec(p.time||''), n=/(\d+)\s*min/.exec(p.time||''); return m?(+m[1]*60+(+m[2]||0)):n?+n[1]:90; };
  const exKey=(p,x)=>'chem:'+(p.code||p.name)+':'+x.s;
  const fmtMins=s=>Math.floor(s/3600)?Math.floor(s/3600)+' h '+Math.floor(s%3600/60)+' min':Math.round(s/60)+' min';
  const sessRow=(x,p)=>{ const t=window.ttExam&&ttExam.lastTime(exKey(p,x)); return `<div class="sess"><b>${esc(x.s)}</b>${window.ttExam?`<button class="btn btn-sm primary" data-ex="${esc(JSON.stringify({key:exKey(p,x),url:x.qp,title:(p.code?p.code+' · ':'')+p.name+' · '+x.s,mins:minsOf(p)}))}">Sit it (timed)</button>`:''}<a class="btn btn-sm" href="${esc(x.qp)}" target="_blank" rel="noopener" data-view="${esc((p.code?p.code+' · ':'')+x.s+' question paper')}">Question paper</a><a class="btn btn-sm ghost" href="${esc(x.ms)}" target="_blank" rel="noopener" data-view="${esc((p.code?p.code+' · ':'')+x.s+' mark scheme')}">Mark scheme</a>${t?`<span class="chip good" title="Kept in this browser">Last sat: ${fmtMins(t.secs)}</span>`:''}</div>`; };
  v.innerHTML=`<span class="eyebrow">Physics &amp; Maths Tutor library</span><h1>Past papers</h1><p class="muted" style="max-width:78ch">Every OCR A paper hosted on Physics &amp; Maths Tutor, opening in a new tab. Start with full papers under timed conditions; use the topic packs on each topic page for targeted practice. Legacy papers come from the previous OCR A specification and are listed with how well they match this one.</p>
  <div class="row" style="margin:6px 0 18px"><a class="btn btn-sm" href="${esc(SP.booklet)}" target="_blank" rel="noopener">${I.ext} OCR Data Sheet</a>${SP.pmtNotes.map(n=>`<a class="btn btn-sm ghost" href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.label)}</a>`).join('')}</div>
  <h2 style="margin-bottom:10px">A level (H432)</h2><div class="stack">${SP.papers.filter(p=>p.level==='A level').map(paperBlock).join('')}</div>
  <h2 style="margin:26px 0 10px">AS level (H032)</h2><div class="stack">${SP.papers.filter(p=>p.level==='AS').map(paperBlock).join('')}</div>
  ${SP.legacy.length?`<h2 style="margin:26px 0 10px">Legacy OCR A papers (2009–2016)</h2><p class="muted" style="max-width:74ch;margin-top:0">These pre-2015 papers share most content with the current spec. The match notes say which modules they cover.</p><div class="stack">${SP.legacy.map(paperBlock).join('')}</div>`:''}
  <h2 style="margin:26px 0 10px">Topic question packs</h2><div class="grid g3">${T.map(t=>`<a class="tcard" href="#t-${t.id}" data-pk="1"><span class="id">${t.id}</span><h4>${esc(t.title)}</h4><div class="meta"><span>${t.packs.length} PDFs</span></div></a>`).join('')}</div>`;
  function paperBlock(p){ return `<details class="fold"><summary><span>${esc(p.code)} · ${esc(p.name)}${p.time?` <span class="muted" style="font-weight:400">· ${esc(p.time)}, ${p.marks} marks</span>`:''}</span></summary><div>${p.mods?`<p class="muted" style="margin:0 0 10px;font-size:.9rem">${esc(p.mods)}. ${esc(p.fmt||'')}</p>`:''}${p.match?`<p class="muted" style="margin:0 0 10px;font-size:.9rem">${esc(p.match)}</p>`:''}<div class="paperset">${p.items.map(x=>sessRow(x,p)).join('')}</div><p style="margin:10px 0 0"><a href="${esc(p.page)}" target="_blank" rel="noopener">See this page on PMT ${I.ext.replace('<svg','<svg width="12" height="12"')}</a></p></div></details>`; }
  $$('[data-pk]',v).forEach(a=>a.addEventListener('click',()=>sessionStorage.setItem('tt-tab','packs')));
  $$('[data-view]',v).forEach(a=>a.addEventListener('click',e=>{ if(!window.ttExam||e.ctrlKey||e.metaKey||e.shiftKey) return; e.preventDefault(); ttExam.view({url:a.href,title:a.dataset.view,source:'Physics & Maths Tutor'}); }));
  $$('[data-ex]',v).forEach(b=>b.onclick=()=>{ const o=JSON.parse(b.dataset.ex); ttExam.exam(Object.assign(o,{source:'Physics & Maths Tutor',onEnd:()=>{ if(location.hash==='#papers') viewPapers(v); }})); });
}

/* ---------- DATA SHEET ---------- */
window.TT_SHEET=v=>viewSheet(v);
/* live data sheet (../datasheet.js): button bottom-right on question pages. The official OCR Data Sheet for
   Chemistry A (PMT's copy, drawn live): pages 2–3 are the data, IR and NMR tables, page 4 the periodic table */
window.TT_DS_CFG={
  match:h=>/^(bank|pq-|mock|quiz|papers$|t-|drill|spec)/.test(h),
  sheets:()=>[{label:'OCR Data Sheet',url:SP.booklet,pages:[2,3,4],turn:{4:90}},{label:'Periodic table',url:SP.booklet,pages:[4],turn:{4:90}},
    {label:'Quick reference',render:el=>{ viewSheet(el); el.querySelectorAll('a[href^="#"]').forEach(a=>{ a.removeAttribute('href'); a.style.textDecoration='none'; a.style.color='inherit'; }); }}]
};
function viewSheet(v){
  v.innerHTML=`<span class="eyebrow">Data, formulae and relationships</span><h1>Data sheet</h1><p class="muted" style="max-width:72ch">Constants, prefixes and every equation in the course, grouped by topic. The official OCR Data Sheet (with the periodic table, IR and NMR data) is linked on the <a href="#papers">Past papers</a> page.</p>
  <div class="grid g2 sheetg" style="margin-top:12px"><div class="card"><h3 style="margin-bottom:8px">Physical constants</h3><div class="tbl fit" style="margin:0"><table><tr><th>Quantity</th><th>Symbol</th><th>Value</th></tr>${SP.constants.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td style="font-family:var(--f-mono)">${c[2]}</td></tr>`).join('')}</table></div></div>
  <div class="stack"><div class="card"><h3 style="margin-bottom:8px">Prefixes</h3><div class="tbl fit" style="margin:0"><table><tr><th>Prefix</th><th>Symbol</th><th>Multiple</th></tr>${SP.prefixes.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td></tr>`).join('')}</table></div></div>
  <div class="card"><h3 style="margin-bottom:8px">Unit conversions</h3><ul style="margin:0;padding-left:20px;font-size:.93rem"><li>cm<sup>3</sup> → dm<sup>3</sup>: ÷ 1000; dm<sup>3</sup> → m<sup>3</sup>: ÷ 1000</li><li>°C → K: + 273</li><li>kPa → Pa: × 1000; kJ → J: × 1000</li><li>RTP: 293 K and 101 kPa. Standard conditions: 298 K and 100 kPa, solutions 1 mol dm<sup>−3</sup></li><li>log and ln: pH = −log[H<sup>+</sup>]; ln k = −E<sub>a</sub>/RT + ln A</li></ul></div></div></div>
  <h2 style="margin:26px 0 10px">Equations by topic</h2><div class="stack">${MODS.map(m=>`<details class="fold" ${m.n===5?'open':''}><summary>Module ${m.n}: ${esc(m.title)}</summary><div>${T.filter(t=>t.mod===m.n&&t.eqs.length).map(t=>`<h4 style="margin:12px 0 6px"><a href="#t-${t.id}">${t.id} ${esc(t.title)}</a></h4><div class="eqlist">${t.eqs.map(([e,d])=>`<div class="eq"><b>${e}</b><span>${esc(d)}</span></div>`).join('')}</div>`).join('')}</div></details>`).join('')}</div>`;
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
   <p class="tt-allsave" style="margin:0 0 12px;padding:10px 12px;border-radius:10px;border:1px dashed currentColor;opacity:.9">Moving to another device? <button type="button" class="btn btn-sm" data-tt-save style="margin-left:6px">Save every app at once</button></p><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary" id="expJson">Save backup file (.json)</button><button class="btn" id="expCsv">Export report (.csv)</button><button class="btn" id="expCopy">Copy backup to clipboard</button><label class="btn" for="impFile" style="cursor:pointer">Restore from backup…</label><input type="file" id="impFile" accept=".json,application/json" hidden></div>
   <p class="muted" id="expMsg" style="margin:10px 0 0;font-size:.85rem" aria-live="polite"></p></div>
  <div class="row" style="margin-top:16px"><button class="btn ghost" id="reset">Reset all progress</button><span id="rmsg" class="muted"></span></div>`;
  const replaceS=n=>{ Object.keys(S).forEach(k=>delete S[k]); Object.assign(S,n); };
  let armed=false; $('#reset').onclick=()=>{ if(!armed){ armed=true; $('#rmsg').textContent='Press again to confirm. This cannot be undone.'; $('#reset').textContent='Confirm reset'; return; } const keep=S.settings; replaceS({revised:{},conf:{},flash:{},quiz:[],exam:{},answers:{},days:[],bank:{},mocks:[],settings:keep}); save(); route(); toast('Progress reset'); };
  const msg=t=>{ $('#expMsg').textContent=t; };
  const stamp=new Date().toISOString().slice(0,10);
  const backup=()=>JSON.stringify({app:'TrainTanmay Chemistry',version:1,exported:new Date().toISOString(),progress:S},null,1);
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
  $('#expJson').onclick=()=>saveFile('traintanmay-chemistry-progress-'+stamp+'.json',backup(),'application/json');
  $('#expCsv').onclick=()=>saveFile('traintanmay-chemistry-report-'+stamp+'.csv',report(),'text/csv');
  $('#expCopy').onclick=async()=>{ try{ await navigator.clipboard.writeText(backup()); msg('Backup copied. Paste it into a note or email to keep it.'); }catch(e){ msg('Copying is blocked here: use "Save backup file" instead.'); } };
  $('#impFile').onchange=async e=>{ const f=e.target.files[0]; if(!f) return; try{ const d=JSON.parse(await f.text()); const p=d&&d.progress; if(!p||typeof p!=='object'||!p.settings) throw 0;
      const base={revised:{},conf:{},flash:{},quiz:[],exam:{},answers:{},days:[],bank:{},mocks:[]}; replaceS(Object.assign(base,p)); S.settings=Object.assign({theme:'system',dys:false},p.settings); save(); applyTheme(); applyDys(); route(); toast('Progress restored from '+f.name); }
    catch(err){ msg('That file is not a TrainTanmay Chemistry backup.'); } e.target.value=''; };
}

/* ---------- SEARCH ---------- */
const IDX=[]; T.forEach(t=>{ IDX.push({k:'Topic',t:t.id+' '+t.title,s:t.short+' '+strip(t.notes),h:'#t-'+t.id}); t.terms.forEach(([a,b])=>IDX.push({k:'Definition',t:a,s:b,h:'#t-'+t.id})); t.eqs.forEach(([e,d])=>IDX.push({k:'Equation',t:strip(e),s:d+' ('+t.id+')',h:'#t-'+t.id})); t.exam.forEach(q=>IDX.push({k:'Exam question',t:q.id+' '+q.style,s:q.stem+' '+q.parts.map(p=>p.q).join(' '),h:'#q-'+qKey(q.id)})); });
Object.entries(LABS).forEach(([id,L])=>IDX.push({k:'Lab',t:L.title,s:L.desc,h:'#lab-'+id})); if(window.BANK) window.BANK.q.forEach(q=>IDX.push({k:'Exam question',t:window.BANK.packs[q.p].title+' · Q'+q.n,s:q.t.join(' '),h:'#pq-'+q.id})); (window.MEDIA||{videos:[]}).videos.forEach(x=>IDX.push({k:'Video',t:x.title,s:(x.sec||'')+' '+(x.kind||''),h:'#videos_'+x.g})); PG.list.forEach(p=>IDX.push({k:'Practical',t:'PAG '+p.pag+': '+p.title,s:p.aim+' '+p.method.join(' '),h:'#pag-'+p.id}));
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
