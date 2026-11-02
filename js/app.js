/* TrainTanmay – Design Technology revision app */
(function(){
'use strict';
const D = window.DATA;
const LABS = window.LABS || {};
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtInline = s => esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
const h = (html) => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const topicById = Object.fromEntries(D.topics.map(t=>[t.id,t]));
const ALLQ = D.pp.concat(D.ai);
const qkey = id => id.replace(/[()]/g,'');
const qByKey = Object.fromEntries(ALLQ.map(q=>[qkey(q.id),q]));

/* ---------- storage ---------- */
const KEY='tt-dt-progress-v1';
let S = {revised:{},conf:{},flash:{},quiz:{},exam:{},answers:{},days:[],last:null,settings:{theme:'system',ai:true,dys:false}};
try{ const raw=localStorage.getItem(KEY); if(raw){ const p=JSON.parse(raw); S=Object.assign(S,p); S.settings=Object.assign({theme:'system',ai:true},p.settings||{}); } }catch(e){}
let saveT=null;
function save(){ clearTimeout(saveT); saveT=setTimeout(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} },150); }
function touchDay(){ const d=new Date().toISOString().slice(0,10); if(!S.days.includes(d)){ S.days.push(d); if(S.days.length>400) S.days=S.days.slice(-400); save(); } }
function streak(){ const set=new Set(S.days); let n=0; const d=new Date(); for(;;){ const k=d.toISOString().slice(0,10); if(set.has(k)){n++; d.setDate(d.getDate()-1);} else { if(n===0){ d.setDate(d.getDate()-1); const k2=d.toISOString().slice(0,10); if(set.has(k2)){ continue; } } break; } } return n; }

/* ---------- theme ---------- */
function applyDys(){ document.documentElement.classList.toggle('dys',!!S.settings.dys); }
applyDys();
function applyTheme(){ const t=S.settings.theme; if(t==='system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t); }
applyTheme();
window.TT = {css:(v)=>getComputedStyle(document.documentElement).getPropertyValue(v).trim(), esc, h, toast, topicById};

/* ---------- capabilities ---------- */
let dlCap=null, sampleCap=null;
const use = (n)=> (window.claude && window.claude.use) ? window.claude.use(n).catch(()=>null) : Promise.resolve(null);
use('downloads').then(x=>{dlCap=x; document.body.classList.toggle('can-dl',!!x);});

function toast(msg){ const el=h(`<div class="toast" role="status">${esc(msg)}</div>`); document.body.appendChild(el); setTimeout(()=>el.remove(),2600); }

/* ---------- icons ---------- */
const I = {
 menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 dl:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>',
 eye:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 ext:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
};
const LOGO = `<svg viewBox="0 0 48 48" role="img" aria-label="TrainTanmay logo"><rect x="1" y="1" width="46" height="46" rx="11" fill="var(--navy)"/><path d="M8 10h22v6h-7.6v24h-6.8V16H8z" fill="var(--surface)"/><path d="M33.2 19.5h5.2v4.6h4.2v4.3h-4.2v6.4c0 1.4.6 1.9 1.9 1.9.8 0 1.6-.1 2.3-.3v4.3c-1 .3-2.3.5-3.6.5-3.9 0-5.8-1.9-5.8-5.6v-7.2H30.6v-4.3h2.6z" fill="var(--brand)"/></svg>`;

/* ---------- shell ---------- */
const NAV=[['home','Home'],['topics','Topics'],['labs','Labs'],['flashcards','Flashcards'],['quiz','Quizzes'],['exam','Exam Qs'],['videos','Videos'],['papers','Papers'],['downloads','Downloads'],['progress','Progress']];
const app=$('#app');
app.innerHTML = `
<header class="topbar"><div class="wrap">
  <a class="brand" href="#home" aria-label="TrainTanmay home">${LOGO}<span><b>TrainTanmay</b><small>D&amp;T · Edexcel 9DT0</small></span></a>
  <nav class="nav" aria-label="Main">${NAV.map(([k,l])=>`<a href="#${k}" data-nav="${k}">${l}</a>`).join('')}</nav>
  <div class="tb-right">
    <button class="iconbtn" id="btnSearch" aria-label="Search">${I.search}</button>
    <button class="iconbtn dysbtn" id="btnDys" aria-pressed="false" title="Dyslexia-friendly font" aria-label="Dyslexia-friendly font">Aa</button>
    <select class="theme-select" id="theme" aria-label="Colour theme">
      <option value="system">Auto</option><option value="light">Light</option><option value="dark">Dark</option><option value="salmon">Salmon</option>
    </select>
    <button class="iconbtn menubtn" id="btnMenu" aria-label="Open menu">${I.menu}</button>
  </div>
</div></header>
<main><div class="wrap" id="view"></div></main>
<footer class="footer"><div class="wrap row" style="justify-content:space-between">
 <span>TrainTanmay · Made by Tanmay Vashishtha · Edexcel A level Design &amp; Technology (Product Design) 9DT0 · Paper 1 revision</span>
 <span class="mono">Progress is saved in this browser · <a href="#progress">backup</a></span>
</div></footer>`;
$('#theme').value=S.settings.theme;
const bD=$('#btnDys'); bD.setAttribute('aria-pressed',!!S.settings.dys); bD.addEventListener('click',()=>{ S.settings.dys=!S.settings.dys; save(); applyDys(); bD.setAttribute('aria-pressed',S.settings.dys); toast(S.settings.dys?'Dyslexia-friendly font on':'Dyslexia-friendly font off'); window.dispatchEvent(new Event('themechange')); });
$('#theme').addEventListener('change',e=>{S.settings.theme=e.target.value; save(); applyTheme(); window.dispatchEvent(new Event('themechange'));});
$('#btnSearch').addEventListener('click',()=>go('search'));
$('#btnMenu').addEventListener('click',()=>{
  const dr=$('#drawer'); dr.innerHTML=`<div class="drawer-panel" role="dialog" aria-label="Menu"><div class="row" style="justify-content:space-between;margin-bottom:8px"><a class="brand" href="#home">${LOGO}<span><b>TrainTanmay</b></span></a><button class="iconbtn" id="dclose" aria-label="Close menu">${I.close}</button></div>${NAV.concat([['search','Search']]).map(([k,l])=>`<a href="#${k}" data-nav="${k}">${l}</a>`).join('')}</div>`;
  dr.hidden=false; markNav();
  dr.addEventListener('click',e=>{ if(e.target===dr||e.target.closest('#dclose')||e.target.closest('a')) dr.hidden=true; },{once:false});
});
function markNav(){ const cur=(location.hash.slice(1)||'home'); const base=cur.startsWith('t-')?'topics':cur.startsWith('lab-')?'labs':cur.startsWith('q-')?'exam':cur.split('-')[0]; $$('[data-nav]').forEach(a=>a.toggleAttribute('aria-current',false)); $$(`[data-nav="${base}"]`).forEach(a=>a.setAttribute('aria-current','page')); }

/* ---------- router ---------- */
let cleanup=[];
function go(tok){ if(location.hash.slice(1)===tok) route(); else location.hash=tok; }
window.addEventListener('hashchange',route);
function route(){
  cleanup.forEach(f=>{try{f()}catch(e){}}); cleanup=[];
  const tok=decodeURIComponent(location.hash.slice(1))||'home';
  const v=$('#view'); v.innerHTML=''; v.style.animation='none'; void v.offsetHeight; v.style.animation='';
  touchDay(); markNav();
  window.scrollTo(0,0);
  try{
    if(tok==='home') return viewHome(v);
    if(tok==='topics') return viewTopics(v);
    if(tok.startsWith('t-')) return viewTopic(v, tok.slice(2));
    if(tok==='labs') return viewLabs(v);
    if(tok.startsWith('lab-')) return viewLab(v, tok.slice(4));
    if(tok.startsWith('flashcards')) return viewFlash(v, tok.split('_')[1]);
    if(tok.startsWith('quiz')) return viewQuiz(v, tok.split('_')[1]);
    if(tok==='exam'||tok.startsWith('exam_')) return viewExamList(v, tok.split('_')[1]);
    if(tok.startsWith('q-')) return viewQuestion(v, tok.slice(2));
    if(tok==='videos'||tok.startsWith('videos_')) return viewVideos(v, tok.split('_')[1]);
    if(tok==='papers') return viewPapers(v);
    if(tok.startsWith('paper-')) return viewPaperRun(v, tok.slice(6));
    if(tok==='downloads') return viewDownloads(v);
    if(tok==='progress') return viewProgress(v);
    if(tok==='search') return viewSearch(v);
    viewHome(v);
  }catch(err){ console.error(err); v.innerHTML=`<div class="empty">Something went wrong showing this page. <a href="#home">Go home</a></div>`; }
}

/* ---------- helpers ---------- */
function topicProgress(t){
  let pts=0,max=4;
  if(S.revised[t.id]) pts++;
  const c=S.conf[t.id]; if(c==='g') pts++; else if(c==='a') pts+=.5;
  const qz=S.quiz[t.id]; if(qz&&qz.length){ const b=Math.max(...qz.map(x=>x.s/x.n)); pts+=b; }
  const cards=t.flash.map((_,i)=>S.flash[t.id+'#'+i]).filter(Boolean); if(t.flash.length) pts+= cards.filter(c=>c.box>=3).length/t.flash.length;
  return Math.round(pts/max*100);
}
function overall(){ const ts=D.topics.filter(t=>t.group!=='X'); return Math.round(ts.reduce((a,t)=>a+topicProgress(t),0)/ts.length); }
function examStats(qs){ let got=0,max=0,n=0; qs.forEach(q=>{ const r=S.exam[q.id]; if(r&&r.got!=null){ got+=r.got; max+=q.marks; n++; } }); return {got,max,n}; }
function topicChip(id){ const t=topicById[id]; return t?`<a class="chip brand" href="#t-${t.id}" style="text-decoration:none">${esc(t.id)} ${esc(t.title)}</a>`:''; }
function groupLabel(g){ return g==='X' ? 'Extras' : `Topic ${g}`; }
function dueCards(ids){ const now=Date.now(); const out=[]; D.topics.forEach(t=>{ if(ids&&!ids.includes(t.id)) return; t.flash.forEach((f,i)=>{ const k=t.id+'#'+i; const st=S.flash[k]; if(!st||st.due<=now) out.push({k,t,f,st}); }); }); return out; }
const INTERVAL=[0,0,1,3,7,16,35]; // days by box
function fmtSize(b){ return b>1e6? (b/1e6).toFixed(1)+' MB' : Math.round(b/1e3)+' KB'; }
function paragraphs(s){ let out='',list=null; const close=()=>{ if(list){ out+=`</${list}>`; list=null; } };
  String(s).split('\n').forEach(l=>{ const t=l.trim(); if(!t) return; let m;
    if((m=t.match(/^[-•]\s+(.*)/))){ if(list!=='ul'){ close(); out+='<ul>'; list='ul'; } out+=`<li>${fmtInline(m[1])}</li>`; }
    else if((m=t.match(/^\d+[.)]\s+(.*)/))){ if(list!=='ol'){ close(); out+='<ol>'; list='ol'; } out+=`<li>${fmtInline(m[1])}</li>`; }
    else { close(); out+=`<p>${fmtInline(t)}</p>`; } });
  close(); return out; }

/* ---------- PDF viewer & downloads ---------- */
async function openPdf(path, title, page){
  const m=$('#modal');
  if(!/\.pdf$/i.test(path)){ m.hidden=true; return downloadFile(path,title); }
  m.innerHTML=`<div class="modal-panel" role="dialog" aria-label="${esc(title)}"><div class="modal-head"><b>${esc(title)}</b>
   <span class="mono muted" id="pdfinfo">Loading…</span>
   <button class="btn btn-sm" id="pdfdl">${I.dl} Download</button>
   <a class="btn btn-sm" href="${esc(path)}" target="_blank" rel="noopener">${I.ext} New tab</a>
   <button class="iconbtn" id="pdfclose" aria-label="Close">${I.close}</button></div><div class="pdfpages" id="pdfpages"></div></div>`;
  m.hidden=false;
  const close=()=>{m.hidden=true; m.innerHTML=''; document.removeEventListener('keydown',kd);};
  const kd=e=>{ if(e.key==='Escape') close(); };
  document.addEventListener('keydown',kd);
  $('#pdfclose').onclick=close; m.onclick=e=>{ if(e.target===m) close(); };
  $('#pdfdl').onclick=()=>downloadFile(path,title);
  const box=$('#pdfpages');
  if(!window.pdfjsLib){ box.innerHTML=`<div class="empty">The PDF viewer couldn't load here. Use “New tab” or “Download”.</div>`; return; }
  try{
    const doc=await pdfjsLib.getDocument({url:path, disableWorker:false}).promise;
    $('#pdfinfo').textContent=`${doc.numPages} pages`;
    const w=Math.min(box.clientWidth-28, 900);
    let target=null;
    for(let p=1;p<=doc.numPages;p++){
      const c=document.createElement('canvas'); c.dataset.p=p; box.appendChild(c);
      if(p===(page||1)) target=c;
    }
    const io=new IntersectionObserver(async (ents)=>{ for(const en of ents){ if(en.isIntersecting && !en.target.dataset.done){ en.target.dataset.done=1; const pg=await doc.getPage(+en.target.dataset.p); const vp0=pg.getViewport({scale:1}); const sc=(w/vp0.width)*(window.devicePixelRatio>1?1.6:1.2); const vp=pg.getViewport({scale:sc}); en.target.width=vp.width; en.target.height=vp.height; en.target.style.width=w+'px'; await pg.render({canvasContext:en.target.getContext('2d'),viewport:vp}).promise; } } },{root:box,rootMargin:'600px'});
    $$('canvas',box).forEach(c=>{ c.style.width=w+'px'; c.style.height=(w*1.414)+'px'; io.observe(c); });
    if(target) setTimeout(()=>target.scrollIntoView({block:'start'}),60);
  }catch(e){ console.error(e); box.innerHTML=`<div class="empty">Couldn't open this PDF in the viewer. Use “New tab” or “Download”.</div>`; }
}
async function downloadFile(path,title){
  if(!dlCap){ window.open(path,'_blank','noopener'); toast('Opened in a new tab – save it from there'); return; }
  try{ const r=await fetch(path); const b=await r.blob(); const fn=path.split('/').pop(); await dlCap.save({filename:fn,data:b}); toast('Saved'); }
  catch(e){ if(e&&e.code==='declined') return; window.open(path,'_blank','noopener'); }
}
document.addEventListener('click',e=>{
  const o=e.target.closest('[data-pdf]'); if(o){ e.preventDefault(); openPdf(o.dataset.pdf,o.dataset.title||'Document',+o.dataset.page||1); return; }
  const d=e.target.closest('[data-dl]'); if(d){ e.preventDefault(); downloadFile(d.dataset.dl,d.dataset.title||''); return; }
  const s=e.target.closest('[data-open-sim]'); if(s){ e.preventDefault(); go('lab-'+s.dataset.openSim); return; }
});
function resItem(r){
  const isPdf=r.ext==='pdf';
  return `<div class="lib-item"><div class="ic ${r.ext}">${r.ext.toUpperCase()}</div><div><div class="tt">${esc(r.title)}</div><div class="mt">${r.cat==='cheatsheets'?'Cheat sheet':r.cat==='slides'?'Teacher slides':r.cat==='worksheets'?'Worksheet':r.cat==='papers'?'Past paper':'Resource'} · ${r.pages?r.pages+' pages · ':''}${fmtSize(r.size)}</div></div>
  <div class="row acts">${isPdf?`<button class="btn btn-sm" data-pdf="${esc(r.path)}" data-title="${esc(r.title)}">${I.eye} Open</button>`:''}<button class="btn btn-sm" data-dl="${esc(r.path)}" data-title="${esc(r.title)}">${I.dl} Download</button></div></div>`;
}

/* ---------- HOME ---------- */
function viewHome(v){
  const ov=overall(); const due=dueCards().length; const es=examStats(ALLQ);
  const last=S.last && topicById[S.last];
  v.innerHTML=`
  <section class="hero">
    <div class="hero-text">
      <span class="eyebrow">Edexcel A level · Product Design · Paper 1</span>
      <h1 id="pun" class="pun" aria-live="polite"></h1>
      <p>Notes for all 12 topics, ${D.topics.reduce((a,t)=>a+t.flash.length,0)} flashcards, ${D.topics.reduce((a,t)=>a+t.quiz.length,0)} quiz questions, ${D.pp.length} past-paper questions from 2019–2025 with mark schemes and model answers, and ${Object.keys(LABS).length} interactive labs.</p>
      <div class="row">${last?`<a class="btn primary" href="#t-${last.id}">Continue: ${esc(last.id)} ${esc(last.title)}</a>`:`<a class="btn primary" href="#topics">Start revising</a>`}<a class="btn" href="#exam">Exam questions</a><a class="btn ghost" href="#labs">Explore the labs →</a></div>
    </div>
    <div class="hero-3d" id="hero3d"><div class="titleblock"><span>DRAWN</span><span>TrainTanmay</span><span>SPEC</span><span>9DT0/01</span></div></div>
  </section>
  <div class="sep" style="margin:22px 0 18px;background:transparent"></div>
  <section class="statrow">
    <div class="stat"><b>${ov}%</b><span>Spec coverage progress</span><div class="bar" style="margin-top:8px"><i style="width:${ov}%"></i></div></div>
    <div class="stat"><b>${due}</b><span>Flashcards due now</span></div>
    <div class="stat"><b>${es.max?Math.round(es.got/es.max*100)+'%':'–'}</b><span>Exam marks scored (${es.n} attempted)</span></div>
    <div class="stat"><b>${streak()}</b><span>Day revision streak</span></div>
  </section>
  <div class="sep" style="background:transparent;margin:10px 0"></div>
  <section class="grid g3">
    <a class="card" href="#flashcards" style="text-decoration:none;color:inherit"><span class="eyebrow">Spaced repetition</span><h3 style="margin:6px 0">Review ${due} due cards</h3><p class="muted" style="margin:0">Cards you know move up a box and come back less often.</p></a>
    <a class="card" href="#paper-2025" style="text-decoration:none;color:inherit"><span class="eyebrow">Timed practice</span><h3 style="margin:6px 0">Sit the 2025 paper</h3><p class="muted" style="margin:0">Work through every question in order with a 2 h 30 min timer, then self-mark against the mark scheme.</p></a>
    <a class="card" href="#lab-gears" style="text-decoration:none;color:inherit"><span class="eyebrow">Interactive</span><h3 style="margin:6px 0">Mechanisms lab</h3><p class="muted" style="margin:0">Gears, cams, linkages, levers and pulleys you can drive yourself.</p></a>
  </section>
  <div class="sep"></div>
  <div class="row" style="justify-content:space-between;margin-bottom:12px"><h2>The specification</h2><a href="#topics">All topics →</a></div>
  <div class="grid g4">${Object.entries(D.groups).map(([g,name])=>{ const ts=D.topics.filter(t=>t.group===g); const p=Math.round(ts.reduce((a,t)=>a+topicProgress(t),0)/ts.length); return `<a class="tcard" href="#topics" data-g="${g}"><span class="id">${groupLabel(g)} · ${ts.length} page${ts.length>1?'s':''}</span><h4>${esc(name)}</h4><div class="bar"><i style="width:${p}%"></i></div><div class="meta"><span>${p}% progress</span></div></a>`; }).join('')}</div>`;
  $$('.tcard[data-g]',v).forEach(a=>a.addEventListener('click',()=>{ sessionStorage && (()=>{try{sessionStorage.setItem('tt-scrollg',a.dataset.g)}catch(e){}})(); }));
  hero3d($('#hero3d'));
  const P=PUNS.slice().sort(()=>Math.random()-.5); let pi=0; const h1=$('#pun'); h1.title='Click for another pun';
  const red=window.matchMedia('(prefers-reduced-motion: reduce)').matches; let tm=null, alive=true;
  const later=(f,ms)=>{ tm=setTimeout(()=>{ if(alive) f(); },ms); };
  function typeIt(str,i=0){ h1.classList.add('typing'); h1.textContent=str.slice(0,i); if(i<str.length) later(()=>typeIt(str,i+1),38+Math.random()*55); else later(()=>eraseIt(str,str.length),4200); }
  function eraseIt(str,i){ h1.textContent=str.slice(0,i); if(i>0) later(()=>eraseIt(str,i-1),18); else { pi=(pi+1)%P.length; later(()=>typeIt(P[pi]),300); } }
  if(red){ h1.textContent=P[0]; const iv=setInterval(()=>{ pi=(pi+1)%P.length; h1.textContent=P[pi]; },6000); cleanup.push(()=>clearInterval(iv)); h1.onclick=()=>{ pi=(pi+1)%P.length; h1.textContent=P[pi]; }; }
  else { typeIt(P[0]); h1.onclick=()=>{ clearTimeout(tm); eraseIt(h1.textContent,h1.textContent.length); }; }
  h1.setAttribute('aria-label','Pun'); cleanup.push(()=>{ alive=false; clearTimeout(tm); });
}
const PUNS=['I wood revise, but I’m board.','Polymer? I hardly know her.','Don’t take it for granite – revise your materials.','This revision is riveting.','I’ve got a lathe to learn, so let’s get turning.','Steel my heart, Edexcel.','Ply your trade: revise every topic.','You’re the yin to my yield point.','I tried to glue myself to my notes. Now I’m stuck on revision.','Don’t be so tense-ile – you’ve got this.'];

function hero3d(el){
  if(!window.THREE||!el) return;
  const W=()=>el.clientWidth, H=()=>el.clientHeight;
  let renderer; try{ renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); }catch(e){ return; }
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)); renderer.setSize(W(),H());
  el.prepend(renderer.domElement);
  const scene=new THREE.Scene(); const cam=new THREE.PerspectiveCamera(35,W()/H(),.1,100); cam.position.set(0,0,14);
  scene.add(new THREE.AmbientLight(0xffffff,.55)); const dl=new THREE.DirectionalLight(0xffffff,.9); dl.position.set(4,6,8); scene.add(dl);
  const col=()=>new THREE.Color(TT.css('--brand')||'#1f5fbf'), col2=()=>new THREE.Color(TT.css('--navy')||'#0b2545'), col3=()=>new THREE.Color(TT.css('--accent')||'#d9822b');
  const mats=[new THREE.MeshStandardMaterial({color:col(),metalness:.35,roughness:.4}),new THREE.MeshStandardMaterial({color:col2(),metalness:.3,roughness:.5}),new THREE.MeshStandardMaterial({color:col3(),metalness:.2,roughness:.45})];
  const edgeMat=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.25});
  function gearShape(n,r,rt){ const s=new THREE.Shape(); for(let i=0;i<n*2;i++){ const a0=i/(n*2)*Math.PI*2, a1=(i+1)/(n*2)*Math.PI*2; const R=i%2?r:rt; const p0=[Math.cos(a0+0.08)*R,Math.sin(a0+0.08)*R]; if(i===0) s.moveTo(p0[0],p0[1]); else s.lineTo(p0[0],p0[1]); s.lineTo(Math.cos(a1-0.08)*R,Math.sin(a1-0.08)*R);} const hole=new THREE.Path(); hole.absarc(0,0,r*.28,0,Math.PI*2,true); s.holes.push(hole); return s; }
  const objs=[];
  function add(geo,mat,pos,spin){ const m=new THREE.Mesh(geo,mat); m.position.set(...pos); const e=new THREE.LineSegments(new THREE.EdgesGeometry(geo,30),edgeMat); m.add(e); scene.add(m); objs.push({m,spin,base:pos.slice(),ph:Math.random()*6}); return m; }
  const g1=add(new THREE.ExtrudeGeometry(gearShape(14,1.55,1.95),{depth:.5,bevelEnabled:false}),mats[0],[1.2,1.1,0],[0,0,.006]);
  const g2=add(new THREE.ExtrudeGeometry(gearShape(9,1.0,1.38),{depth:.5,bevelEnabled:false}),mats[2],[3.85,1.95,0],[0,0,-.0093]);
  // I-beam
  const ib=new THREE.Shape(); [[-1,-1.2],[1,-1.2],[1,-.95],[.15,-.95],[.15,.95],[1,.95],[1,1.2],[-1,1.2],[-1,.95],[-.15,.95],[-.15,-.95],[-1,-.95]].forEach((p,i)=>i?ib.lineTo(...p):ib.moveTo(...p));
  add(new THREE.ExtrudeGeometry(ib,{depth:3.2,bevelEnabled:false}),mats[1],[-2.6,-1.6,-1],[.004,.007,0]);
  // bottle (lathe)
  const pts=[[0,-1.6],[.75,-1.6],[.8,-1.4],[.8,.4],[.55,.9],[.32,1.2],[.32,1.6],[0,1.6]].map(p=>new THREE.Vector2(p[0],p[1]));
  add(new THREE.LatheGeometry(pts,28),mats[0],[3.4,-1.6,.5],[.003,.01,.002]);
  // pear cam
  const cs=new THREE.Shape(); for(let i=0;i<=64;i++){ const a=i/64*Math.PI*2; const r=0.75+0.55*Math.max(0,Math.cos(a))**3; const x=Math.cos(a)*r, y=Math.sin(a)*r; i?cs.lineTo(x,y):cs.moveTo(x,y);} const ch=new THREE.Path(); ch.absarc(0,0,.18,0,Math.PI*2,true); cs.holes.push(ch);
  add(new THREE.ExtrudeGeometry(cs,{depth:.35,bevelEnabled:false}),mats[2],[-3.6,1.8,.3],[.002,.004,.012]);
  objs.forEach(o=>{o.m.rotation.set(Math.random(),Math.random(),Math.random()*.4); if(o.m===g1||o.m===g2) o.m.rotation.set(-.35,.35,0);});
  let mx=0,my=0; const mm=e=>{ const r=el.getBoundingClientRect(); mx=((e.clientX-r.left)/r.width-.5); my=((e.clientY-r.top)/r.height-.5); };
  el.addEventListener('pointermove',mm);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf, t=0, alive=true;
  function frame(){ if(!alive) return; t+=1; objs.forEach(o=>{ if(o.m===g1||o.m===g2){ o.m.rotation.z+=o.spin[2]*(reduce?0:1); } else { o.m.rotation.x+=o.spin[0]*(reduce?0:1); o.m.rotation.y+=o.spin[1]*(reduce?0:1); o.m.rotation.z+=o.spin[2]*(reduce?0:1);} o.m.position.y=o.base[1]+(reduce?0:Math.sin(t*.012+o.ph)*.12); });
    scene.rotation.y += ((mx*.35)-scene.rotation.y)*.05; scene.rotation.x += ((my*.25)-scene.rotation.x)*.05;
    renderer.render(scene,cam); raf=requestAnimationFrame(frame); }
  frame();
  const rs=()=>{ renderer.setSize(W(),H()); cam.aspect=W()/H(); cam.updateProjectionMatrix(); }; window.addEventListener('resize',rs);
  const th=()=>{ mats[0].color=col(); mats[1].color=col2(); mats[2].color=col3(); }; window.addEventListener('themechange',th);
  cleanup.push(()=>{ alive=false; cancelAnimationFrame(raf); window.removeEventListener('resize',rs); window.removeEventListener('themechange',th); renderer.dispose(); });
}

/* ---------- TOPICS ---------- */
function viewTopics(v){
  v.innerHTML=`<div class="row" style="justify-content:space-between;align-items:end;margin-bottom:6px"><div><span class="eyebrow">Specification map</span><h1>Topics</h1></div>
  <div class="row"><span class="chip"><span class="rag g"></span>Confident</span><span class="chip"><span class="rag a"></span>Getting there</span><span class="chip"><span class="rag r"></span>Needs work</span></div></div>
  <p class="muted" style="max-width:70ch">Every point of the Edexcel 9DT0 Component 1 content, split into revision pages. Each page has notes, key terms, flashcards, a quiz, exam questions, labs and downloads.</p>
  <div class="stack" style="gap:28px;margin-top:20px">${Object.entries(D.groups).map(([g,name])=>`<section class="tgroup" id="grp-${g}"><div class="tgroup-head"><span class="tnum">${g==='X'?'+':g}</span><h2>${esc(name)}</h2></div><div class="grid g3">${D.topics.filter(t=>t.group===g).map(t=>{ const p=topicProgress(t); const c=S.conf[t.id]; const nq=ALLQ.filter(q=>q.topics.includes(t.id)).length; return `<a class="tcard" href="#t-${t.id}"><span class="id">${esc(t.id)}</span><h4>${esc(t.title)}</h4><div class="bar"><i style="width:${p}%"></i></div><div class="meta"><span>${p}% · ${nq} exam Qs${t.sims.length?' · '+t.sims.length+' lab'+(t.sims.length>1?'s':''):''}</span><span class="rag ${c||''}" title="Confidence"></span></div></a>`; }).join('')}</div></section>`).join('')}</div>`;
  try{ const g=sessionStorage.getItem('tt-scrollg'); if(g){ sessionStorage.removeItem('tt-scrollg'); const el=$('#grp-'+CSS.escape(g)); el && setTimeout(()=>el.scrollIntoView({behavior:'smooth'}),50); } }catch(e){}
}

const openQ={};
function viewTopic(v,id){
  const t=topicById[id]; if(!t){ v.innerHTML='<div class="empty">Topic not found.</div>'; return; }
  S.last=t.id; save();
  const qs=ALLQ.filter(q=>q.topics.includes(t.id) && (S.settings.ai||q.src==='pp'));
  const idx=D.topics.indexOf(t); const prev=D.topics[idx-1], next=D.topics[idx+1];
  const tabs=[['notes','Notes'],['terms','Key terms',t.terms.length],['flash','Flashcards',t.flash.length],['quiz','Quiz',t.quiz.length],['exam','Exam questions',qs.length]].concat(t.sims.length?[['labs','Labs',t.sims.length]]:[]).concat(t.resources.length?[['files','Downloads',t.resources.length]]:[]).concat(M.videos.some(x=>x.t===t.id)||M.cases.some(x=>x.t===t.id)?[['vids','Videos',M.videos.filter(x=>x.t===t.id).length+M.cases.filter(x=>x.t===t.id).length]]:[]);
  v.innerHTML=`
  <div class="tp-head"><div><span class="eyebrow"><a href="#topics">Topics</a> / ${groupLabel(t.group)} · ${esc(D.groups[t.group])}</span><h1 style="margin-top:6px"><span class="mono" style="color:var(--brand);font-weight:600;font-size:.6em;vertical-align:middle;margin-right:10px">${esc(t.id)}</span>${esc(t.title)}</h1></div>
  <div class="row">${(()=>{ const c=(window.CHEATS||[]).find(c=>c.g===t.group); return c?`<button class="btn" data-pdf="${c.path}" data-title="${esc(c.title)}">${I.eye} Cheat sheet</button><button class="btn" data-dl="${c.path}" data-title="${esc(c.title)}">${I.dl}</button>`:''; })()}<button class="btn ${S.revised[t.id]?'':'primary'}" id="markRev">${S.revised[t.id]?'✓ Revised':'Mark as revised'}</button></div></div>
  <div class="tabs" role="tablist">${tabs.map(([k,l,n],i)=>`<button role="tab" data-tab="${k}" aria-selected="${i===0}">${l}${n!=null?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>
  <div class="tp-layout"><div id="tpBody" style="min-width:0"></div>
  <aside class="side">
    <div class="card specbox"><span class="eyebrow">What the spec says</span><ol>${t.spec.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    <div class="sep" style="margin:12px 0"></div><span class="eyebrow">How confident are you?</span><div class="conf" id="conf">${[['r','Not yet'],['a','Partly'],['g','Confident']].map(([k,l])=>`<button class="${k}" data-c="${k}" aria-pressed="${S.conf[t.id]===k}">${l}</button>`).join('')}</div></div>
    <div class="card"><span class="eyebrow">Your progress here</span><div class="row" style="margin-top:8px"><div class="ring" style="--p:${topicProgress(t)}"><b>${topicProgress(t)}%</b></div><div class="muted" style="font-size:.86rem">Based on revising the notes, your confidence, quiz score and flashcards in box 3+.</div></div></div>
    <div class="row" style="justify-content:space-between">${prev?`<a class="btn btn-sm" href="#t-${prev.id}">← ${esc(prev.id)}</a>`:'<span></span>'}${next?`<a class="btn btn-sm" href="#t-${next.id}">${esc(next.id)} →</a>`:''}</div>
  </aside></div>`;
  $('#markRev').onclick=e=>{ S.revised[t.id]=S.revised[t.id]?0:Date.now(); if(!S.revised[t.id]) delete S.revised[t.id]; save(); e.target.textContent=S.revised[t.id]?'✓ Revised':'Mark as revised'; e.target.classList.toggle('primary',!S.revised[t.id]); };
  $$('#conf button').forEach(b=>b.onclick=()=>{ S.conf[t.id]=b.dataset.c; save(); $$('#conf button').forEach(x=>x.setAttribute('aria-pressed',x===b)); });
  const body=$('#tpBody');
  const show=k=>{ $$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===k)); renderTab(k); };
  $$('.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));
  function renderTab(k){
    cleanup.forEach(f=>{try{f()}catch(e){}}); cleanup=[];
    body.innerHTML='';
    if(k==='notes'){ body.innerHTML=`<article class="notes">${t.html}</article>`; abbrify(body); }
    if(k==='terms'){ body.innerHTML=`<div class="terms">${t.terms.map(([a,b])=>`<div class="term"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>`; abbrify(body); }
    if(k==='flash'){ flashDeck(body,[t.id]); }
    if(k==='quiz'){ runQuiz(body,[t.id]); }
    if(k==='exam'){ body.appendChild(h(`<div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="muted">${qs.filter(q=>q.src==='pp').length} past-paper and ${qs.filter(q=>q.src==='ai').length} AI-generated questions on this page.</span><label class="toggle"><input type="checkbox" id="aiT" ${S.settings.ai?'checked':''}> Include AI-generated</label></div>`)); const wrap=h('<div class="ql"></div>'); body.appendChild(wrap); const bar=wrap.previousElementSibling; const tlist=()=>ALLQ.filter(q=>q.topics.includes(t.id)&&(S.settings.ai||q.src==='pp'));
      const open=q=>{ openQ[t.id]=q?q.id:null; render(); const tb=$('.tabs'); if(tb){ const y=tb.getBoundingClientRect().top+window.scrollY-72; if(window.scrollY>y) window.scrollTo({top:y,behavior:'smooth'}); } };
      const render=()=>{ const list=tlist(); const cur=openQ[t.id]&&list.find(q=>q.id===openQ[t.id]);
        if(cur){ bar.hidden=true; wrap.className='qinline'; renderQuestion(wrap,cur,list,open); return; }
        bar.hidden=false; wrap.className='ql'; wrap.innerHTML=list.length?list.map(qItem).join(''):'<div class="empty">No questions yet – switch on AI-generated questions.</div>';
        $$('a.qitem',wrap).forEach(el=>el.onclick=e=>{ e.preventDefault(); const q=qByKey[el.getAttribute('href').slice(3)]; if(q) open(q); }); };
      render(); $('#aiT').onchange=e=>{S.settings.ai=e.target.checked; save(); render();}; }
    if(k==='labs'){ body.innerHTML=`<div class="stack">${t.sims.map(s=>LABS[s]?`<div class="lab" data-labmount="${s}"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>${esc(LABS[s].title)}</h3><a class="btn btn-sm" href="#lab-${s}">Open full screen</a></div><div class="labinner"></div></div>`:'').join('')}</div>`; $$('[data-labmount]',body).forEach(el=>mountLab(el.dataset.labmount,$('.labinner',el))); }
    if(k==='vids'){ const tv=M.videos.map((x,i)=>[x,i]).filter(([x])=>x.t===t.id), tc=M.cases.filter(c=>c.t===t.id); body.innerHTML=`${tv.length?`<div class="vgrid">${tv.map(([x,i])=>vTile(x,i)).join('')}</div>`:''}${tc.length?`<h3 style="margin:18px 0 10px">Case studies</h3><div class="casegrid">${tc.map(caseCard).join('')}</div>`:''}<p class="muted" style="margin-top:14px"><a href="#videos_${t.group}">More videos for ${esc(groupLabel(t.group))} →</a></p>`; $$('.vtile',body).forEach(b=>b.onclick=()=>openVideo(M.videos[+b.dataset.v],b)); }
    if(k==='files'){ body.innerHTML=`<div class="stack">${t.resources.map(r=>resItem(D.resources[r])).join('')}</div>`; }
  }
  show('notes');
}
function qItem(q){
  const r=S.exam[q.id]; const done=r&&r.got!=null;
  const lbl=q.src==='pp'?`${q.year} Q${q.q}`:'AI practice';
  return `<a class="qitem" href="#q-${qkey(q.id)}" style="text-decoration:none;color:inherit"><span class="qid">${esc(lbl)}</span><span class="qt">${esc((q.stem&&q.text.length<120?q.stem+' ':'')+q.text)}</span><span class="qm">${done?`<span class="chip ${r.got>=q.marks*.7?'good':r.got>=q.marks*.4?'warn':'bad'}">${r.got}/${q.marks}</span>`:`${q.marks} mark${q.marks>1?'s':''}`}${q.src==='ai'?' <span class="chip ai">AI</span>':''}</span></a>`;
}

/* ---------- LABS ---------- */
function mountLab(id, el){ const L=LABS[id]; if(!L){ el.innerHTML='<div class="empty">Lab not available.</div>'; return; } try{ const c=L.mount(el,{toast,css:TT.css,esc}); if(typeof c==='function') cleanup.push(c); }catch(e){ console.error(e); el.innerHTML='<div class="empty">This lab failed to start.</div>'; } }
const LAB_ORDER=['gears','cams','linkages','levers','pulleys','stressstrain','materials','heat','corrosion','smart','moulding','printing','measure','ortho','isogrid','cnc','risk','signs','anthro','production','breakeven','sixsigma','cpa','plc','lca','circular','factory','timeline','maths'];
function viewLabs(v){
  const ids=LAB_ORDER.filter(k=>LABS[k]).concat(Object.keys(LABS).filter(k=>!LAB_ORDER.includes(k)));
  const cats={}; ids.forEach(k=>{ const c=LABS[k].cat||'Other'; (cats[c]=cats[c]||[]).push(k); });
  v.innerHTML=`<span class="eyebrow">Interactive</span><h1>Labs</h1><p class="muted" style="max-width:72ch">Simulations and practice tools. Drag, slide and click – each lab links back to the spec topic it supports.</p>
  <div class="stack" style="gap:26px;margin-top:18px">${Object.entries(cats).map(([c,ks])=>`<section><h2 style="margin-bottom:12px">${esc(c)}</h2><div class="grid g3">${ks.map(k=>`<a class="labcard" href="#lab-${k}"><div class="thumb">${LABS[k].icon||''}</div><div class="txt"><span class="eyebrow">${(LABS[k].topics||[]).map(esc).join(' · ')}</span><h3 style="margin-top:4px">${esc(LABS[k].title)}</h3><p>${esc(LABS[k].blurb||'')}</p></div></a>`).join('')}</div></section>`).join('')}</div>`;
}
function viewLab(v,id){
  const L=LABS[id]; if(!L){ v.innerHTML='<div class="empty">Lab not found. <a href="#labs">All labs</a></div>'; return; }
  v.innerHTML=`<span class="eyebrow"><a href="#labs">Labs</a> / ${(L.topics||[]).map(x=>topicById[x]?`<a href="#t-${x}">${esc(x)} ${esc(topicById[x].title)}</a>`:esc(x)).join(' · ')}</span><h1 style="margin:6px 0 4px">${esc(L.title)}</h1><p class="muted" style="max-width:75ch;margin-top:0">${esc(L.blurb||'')}</p><div class="lab" id="labroot"></div>`;
  mountLab(id,$('#labroot'));
}

/* ---------- FLASHCARDS ---------- */
function viewFlash(v,tid){
  const total=D.topics.reduce((a,t)=>a+t.flash.length,0);
  const known=Object.values(S.flash).filter(c=>c.box>=3).length;
  v.innerHTML=`<span class="eyebrow">Spaced repetition · Leitner boxes</span><h1>Flashcards</h1>
  <div class="filters"><label class="field">Deck<select id="fcDeck"><option value="due">All topics – due cards</option><option value="all">All topics – every card</option>${Object.entries(D.groups).map(([g,n])=>`<optgroup label="${esc(groupLabel(g)+' '+n)}">${D.topics.filter(t=>t.group===g&&t.flash.length).map(t=>`<option value="${t.id}">${esc(t.id+' '+t.title)} (${t.flash.length})</option>`).join('')}</optgroup>`).join('')}</select></label>
  <label class="toggle"><input type="checkbox" id="fcShuf" checked> Shuffle</label><span class="muted" style="margin-left:auto">${known} of ${total} cards in box 3 or higher</span></div><div id="fcBody"></div>`;
  const deck=$('#fcDeck'); if(tid&&topicById[tid]) deck.value=tid;
  const run=()=>{ const val=deck.value; flashDeck($('#fcBody'), val==='due'||val==='all'?null:[val], val==='all', $('#fcShuf').checked); };
  deck.onchange=run; $('#fcShuf').onchange=run; run();
}
function flashDeck(el,ids,all,shuffle=true){
  let cards=[]; D.topics.forEach(t=>{ if(ids&&!ids.includes(t.id)) return; t.flash.forEach((f,i)=>{ const k=t.id+'#'+i; const st=S.flash[k]; if(all||ids||!st||st.due<=Date.now()) cards.push({k,t,f}); }); });
  if(ids){ cards.sort((a,b)=>((S.flash[a.k]||{box:0}).box)-((S.flash[b.k]||{box:0}).box)); }
  if(shuffle) cards=cards.map(c=>[Math.random()+((S.flash[c.k]||{box:0}).box)*.25,c]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  let i=0, right=0, seen=0;
  const boxes=()=>{ const cnt=[0,0,0,0,0,0]; D.topics.forEach(t=>{ if(ids&&!ids.includes(t.id)) return; t.flash.forEach((_,j)=>{ const st=S.flash[t.id+'#'+j]; cnt[st?Math.min(5,st.box):0]++; }); }); return `<div class="boxes">${cnt.map((n,b)=>`<span>${b===0?'New':'Box '+b}: ${n}</span>`).join('')}</div>`; };
  function render(){
    if(!cards.length){ el.innerHTML=`${boxes()}<div class="empty">No cards are due. Pick a topic deck or "every card" to keep going.</div>`; return; }
    if(i>=cards.length){ el.innerHTML=`${boxes()}<div class="card" style="text-align:center;max-width:560px;margin:0 auto"><h3>Deck complete</h3><p class="muted">You knew ${right} of ${seen} cards this round.</p><button class="btn primary" id="again">Go again</button></div>`; $('#again',el).onclick=()=>{i=0;right=0;seen=0;render();}; return; }
    const c=cards[i];
    el.innerHTML=`${boxes()}<div class="fc-stage"><div class="fc" id="fc" tabindex="0" role="button" aria-label="Flip card"><div class="fc-face"><span class="eyebrow">${esc(c.t.id)} · ${esc(c.t.title)} · ${i+1}/${cards.length}</span><div class="q">${esc(c.f[0])}</div><div class="muted" style="font-size:.85rem">Tap or press space to reveal</div></div><div class="fc-face back"><span class="eyebrow">Answer</span><div class="a">${fmtInline(c.f[1])}</div></div></div>
    <div class="fc-controls"><button class="btn" id="fNo" disabled>✗ Didn't know</button><button class="btn" id="fFlip">Flip</button><button class="btn primary" id="fYes" disabled>✓ Knew it</button></div></div>`;
    const fc=$('#fc',el); const flip=()=>{ fc.classList.toggle('flip'); $('#fNo',el).disabled=$('#fYes',el).disabled=!fc.classList.contains('flip'); };
    fc.onclick=flip; $('#fFlip',el).onclick=flip; fc.onkeydown=e=>{ if(e.key===' '||e.key==='Enter'){e.preventDefault();flip();} };
    const grade=ok=>{ const st=S.flash[c.k]||{box:0,due:0}; st.box=ok?Math.min(6,st.box+1):1; st.due=Date.now()+INTERVAL[st.box]*864e5 - (ok?0:0); S.flash[c.k]=st; save(); seen++; if(ok) right++; i++; render(); };
    $('#fNo',el).onclick=()=>grade(false); $('#fYes',el).onclick=()=>grade(true);
  }
  render();
}

/* ---------- QUIZ ---------- */
function viewQuiz(v,tid){
  v.innerHTML=`<span class="eyebrow">Multiple choice</span><h1>Quizzes</h1>
  <div class="filters"><label class="field">Topic<select id="qzT"><option value="mix">Mixed – whole spec</option>${Object.entries(D.groups).map(([g,n])=>`<option value="g${g}">${esc(groupLabel(g)+': '+n)} (all)</option>`).join('')}${D.topics.filter(t=>t.quiz.length).map(t=>`<option value="${t.id}">${esc(t.id+' '+t.title)}</option>`).join('')}</select></label>
  <label class="field">Questions<select id="qzN"><option>10</option><option>20</option><option>40</option></select></label><button class="btn primary" id="qzGo">Start quiz</button></div><div id="qzBody"></div>`;
  if(tid&&topicById[tid]) $('#qzT').value=tid;
  const start=()=>{ const val=$('#qzT').value; const ids=val==='mix'?null:val.startsWith('g')?D.topics.filter(t=>t.group===val.slice(1)).map(t=>t.id):[val]; runQuiz($('#qzBody'),ids,+$('#qzN').value); };
  $('#qzGo').onclick=start; start();
}
function runQuiz(el,ids,n=10){
  let pool=[]; D.topics.forEach(t=>{ if(ids&&!ids.includes(t.id)) return; t.quiz.forEach(q=>pool.push({t,q})); });
  pool=pool.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).slice(0,ids&&ids.length===1?pool.length:n);
  let i=0,score=0; const per={};
  function render(){
    if(!pool.length){ el.innerHTML='<div class="empty">No quiz questions here.</div>'; return; }
    if(i>=pool.length){
      Object.entries(per).forEach(([tid,r])=>{ (S.quiz[tid]=S.quiz[tid]||[]).push({s:r.s,n:r.n,ts:Date.now()}); if(S.quiz[tid].length>20) S.quiz[tid].shift(); }); save();
      el.innerHTML=`<div class="qz card" style="text-align:center"><span class="eyebrow">Result</span><h2 style="margin:8px 0">${score} / ${pool.length}</h2><div class="bar" style="max-width:320px;margin:0 auto 14px"><i style="width:${score/pool.length*100}%"></i></div><p class="muted">${score/pool.length>=.8?'Excellent – try the exam questions next.':score/pool.length>=.5?'Good progress. Re-read the notes for the ones you missed.':'Go back over the notes and flashcards, then retry.'}</p><button class="btn primary" id="qzAgain">New quiz</button></div>`;
      $('#qzAgain',el).onclick=()=>runQuiz(el,ids,n); return; }
    const {t,q}=pool[i]; const order=q.o.map((o,k)=>[Math.random(),o,k]).sort((a,b)=>a[0]-b[0]);
    el.innerHTML=`<div class="qz"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(t.id)} · ${esc(t.title)}</span><span class="mono muted">${i+1} / ${pool.length} · score ${score}</span></div><div class="bar" style="margin-top:6px"><i style="width:${i/pool.length*100}%"></i></div><div class="qz-q">${esc(q.q)}</div><div class="qz-opts">${order.map(([_,o,k],j)=>`<button data-k="${k}"><span class="l">${'ABCD'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div><div id="qzE"></div></div>`;
    $$('.qz-opts button',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.k===q.a; per[t.id]=per[t.id]||{s:0,n:0}; per[t.id].n++; if(ok){score++; per[t.id].s++;} $$('.qz-opts button',el).forEach(x=>{ x.disabled=true; if(+x.dataset.k===q.a) x.classList.add('right'); }); if(!ok) b.classList.add('wrong');
      $('#qzE',el).innerHTML=`<div class="qz-exp"><b>${ok?'Correct.':'Not quite.'}</b> ${esc(q.e||'')} <a href="#t-${t.id}">Revise ${esc(t.id)}</a></div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" id="qzN2">${i+1<pool.length?'Next question →':'See result'}</button></div>`; $('#qzN2',el).onclick=()=>{i++;render();}; $('#qzN2',el).focus(); });
  }
  render();
}

/* ---------- EXAM QUESTIONS ---------- */
function viewExamList(v,pre){
  v.innerHTML=`<span class="eyebrow">Paper 1 practice</span><h1>Exam questions</h1><p class="muted" style="max-width:76ch">Every question from the 2019–2025 Edexcel 9DT0/01 papers, tagged by spec topic, plus AI-generated practice questions written in the same style. Open one to answer it, then reveal the official-style mark scheme and a model answer.</p>
  <div class="filters">
   <label class="field">Topic<select id="fT"><option value="">All topics</option>${D.topics.map(t=>`<option value="${t.id}">${esc(t.id+' '+t.title)}</option>`).join('')}</select></label>
   <label class="field">Year<select id="fY"><option value="">All years</option>${[2019,2020,2021,2022,2023,2024,2025].map(y=>`<option>${y}</option>`).join('')}</select></label>
   <label class="field">Marks<select id="fM"><option value="">Any</option><option value="1-2">1–2</option><option value="3-5">3–5</option><option value="6-8">6–8</option><option value="9-12">9–12</option></select></label>
   <label class="field">Status<select id="fS"><option value="">All</option><option value="todo">Not attempted</option><option value="done">Attempted</option><option value="low">Scored under 50%</option></select></label>
   <label class="field" style="flex:1;min-width:180px">Search<input type="search" id="fQ" placeholder="e.g. vacuum forming"></label>
   <label class="toggle"><input type="checkbox" id="fAI" ${S.settings.ai?'checked':''}> AI-generated questions</label>
  </div><div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="muted" id="fCount"></span><button class="btn btn-sm" id="fRand">Random question</button></div><div class="ql" id="qList"></div>`;
  if(pre&&topicById[pre]) $('#fT').value=pre;
  let cur=[];
  const render=()=>{ const T=$('#fT').value,Y=$('#fY').value,M=$('#fM').value,St=$('#fS').value,Q=$('#fQ').value.trim().toLowerCase(); S.settings.ai=$('#fAI').checked; save();
    cur=ALLQ.filter(q=>(S.settings.ai||q.src==='pp')&&(!T||q.topics.includes(T))&&(!Y||q.year===Y)&&(!M||(q.marks>=+M.split('-')[0]&&q.marks<=+M.split('-')[1]))&&(!Q||(q.stem+' '+q.text).toLowerCase().includes(Q))&&(!St||(St==='todo'?!(S.exam[q.id]&&S.exam[q.id].got!=null):St==='done'?(S.exam[q.id]&&S.exam[q.id].got!=null):(S.exam[q.id]&&S.exam[q.id].got!=null&&S.exam[q.id].got<q.marks/2))));
    if(Y) cur=cur.filter(q=>q.src==='pp');
    $('#fCount').textContent=`${cur.length} question${cur.length===1?'':'s'} · ${cur.reduce((a,q)=>a+q.marks,0)} marks`;
    $('#qList').innerHTML=cur.length?cur.map(qItem).join(''):'<div class="empty">No questions match these filters.</div>'; };
  $$('.filters select, .filters input',v).forEach(x=>x.addEventListener(x.type==='search'?'input':'change',render));
  $('#fRand').onclick=()=>{ if(cur.length){ const q=cur[Math.floor(Math.random()*cur.length)]; go('q-'+qkey(q.id)); } };
  render();
}
function msBlock(q){
  const items=q.ms.filter(it=>!/^\(?CONTINUED/i.test(it.trim())).map(it=>{ if(/^(Points of|Design philosophy|Style$|Expansion|Issues to resolve|Strategies deployed|Benefits:|Drawbacks:|Method \d|Alternative)/.test(it)) return `<p class="hd">${esc(it)}</p>`; if(/^(\d+\.|•|Stage)/.test(it)) return `<p class="pt">${esc(it)}</p>`; return `<p>${esc(it)}</p>`; }).join('');
  const lv=q.levels&&D.levels[q.levels];
  const qn=q.src==='pp'?q.q:'AI';
  return `<div class="ms"><div class="ms-head"><h4>Mark scheme</h4><span class="row">${q.src==='pp'?`<span class="chip">Pearson Edexcel ${esc(q.year)}</span>${q.mspage?`<button class="btn btn-sm" data-pdf="files/papers/9DT0-01-${q.year}-mark-scheme.pdf" data-title="${q.year} mark scheme" data-page="${q.mspage}">${I.eye} Original p.${q.mspage}</button>`:''}`:'<span class="chip ai">AI-generated in mark scheme style</span>'}</span></div>
   <div style="overflow-x:auto"><table><thead><tr><th>Question number</th><th>Answer</th><th>Mark</th></tr></thead><tbody><tr><td class="qn">${esc(qn)}</td><td class="msl">${items||'<p class="muted">See the original mark scheme.</p>'}</td><td class="mk">(${q.marks})</td></tr></tbody></table></div>
   ${lv?`<div class="levels" style="overflow-x:auto"><table><thead><tr><th>Level</th><th>Descriptor</th></tr></thead><tbody>${lv.map(([a,b])=>`<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${q.levels==='draw'&&q.src==='pp'&&q.mspage?`<div style="padding:10px 14px;border-top:1px solid var(--line)"><button class="btn btn-sm" data-pdf="files/papers/9DT0-01-${q.year}-mark-scheme.pdf" data-title="${q.year} mark scheme" data-page="${q.mspage}">${I.eye} See the exemplar drawing in the mark scheme</button></div>`:''}
  </div>`;
}
function viewQuestion(v,key){
  const q=qByKey[key]; if(!q){ v.innerHTML='<div class="empty">Question not found. <a href="#exam">All questions</a></div>'; return; }
  renderQuestion(v,q,ALLQ.filter(x=>S.settings.ai||x.src==='pp'));
}
/* inline=onNav(q|null): used inside a topic's Exam tab so the student never leaves the topic page */
function renderQuestion(v,q,list,onNav){
  const ix=list.indexOf(q); const prev=list[ix-1], next=list[ix+1];
  const r=S.exam[q.id]||{}; const revealed=!!r.rev;
  const lbl=q.src==='pp'?`${q.year} · Question ${q.q}`:'AI-generated practice question';
  const navBtn=(x,txt)=>onNav?`<button class="btn btn-sm" data-qnav="${qkey(x.id)}">${txt}</button>`:`<a class="btn btn-sm" href="#q-${qkey(x.id)}">${txt}</a>`;
  v.innerHTML=`<div class="row" style="justify-content:space-between;margin-bottom:12px">${onNav?`<button class="btn btn-sm" data-qback>← Back to this topic's questions</button><span class="eyebrow">${esc(lbl)} · ${ix+1} of ${list.length}</span>`:`<span class="eyebrow"><a href="#exam">Exam questions</a> / ${esc(lbl)}</span>`}<div class="row">${prev?navBtn(prev,'← Previous'):''}${next?navBtn(next,'Next →'):''}</div></div>
  <div class="exam">
   <section class="paper">
    <div class="row" style="justify-content:space-between"><span class="qnum">${q.src==='pp'?esc(q.q):'Practice'}</span><span class="row">${q.src==='ai'?'<span class="chip ai">AI-generated</span>':`<span class="chip">Edexcel ${esc(q.year)}</span>`}${q.topics.map(topicChip).join('')}</span></div>
    ${q.stem?`<p class="stemtxt">${esc(q.stem)}</p>`:''}
    <p class="qtxt">${esc(q.text)}</p><div class="marks">(${q.marks})</div>
    ${q.pages&&q.pages.length?`<div class="figs"><details ${q.pages.length&&/Figure|figure|table|drawing|shown|shows/.test(q.stem+q.text)?'open':''}><summary>Original exam paper page${q.pages.length>1?'s':''} (figures and data)</summary>${q.pages.map(p=>`<img loading="lazy" src="pp/q${q.year}-${String(p).padStart(2,'0')}.jpg" alt="${q.year} question paper page ${p}">`).join('')}</details></div>`:''}
    <label class="field" for="ans" style="margin-top:10px">Your answer (saved in this browser)</label>
    <textarea id="ans" placeholder="Write your answer here, as you would in the exam…">${esc(S.answers[q.id]||'')}</textarea>
    <div class="row" style="margin-top:10px;justify-content:space-between"><span class="muted" style="font-size:.82rem">Aim for about ${Math.max(1,Math.round(q.marks*1.25))} minutes.</span></div>
    <div id="aiOut"></div>
    ${q.src==='pp'?`<div class="card" style="margin-top:12px;padding:12px 14px"><span class="eyebrow">Source: Pearson Edexcel 9DT0/01, ${esc(q.year)}${q.year==='2020'?' (October)':' (June)'}, Question ${esc(q.q)}</span><div class="row" style="margin-top:8px;gap:8px"><button class="btn btn-sm" data-pdf="files/papers/9DT0-01-${q.year}-question-paper.pdf" data-title="${q.year} question paper" data-page="${(q.pages&&q.pages[0])||1}">${I.eye} Open the paper${q.pages&&q.pages[0]?' at p.'+q.pages[0]:''}</button><a class="btn btn-sm" href="https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html" target="_blank" rel="noopener">${I.ext} Pearson past papers</a><a class="btn btn-sm" href="https://www.savemyexams.com/a-level/design-and-technology/edexcel/product-design/past-papers/" target="_blank" rel="noopener">${I.ext} Save My Exams</a><a class="btn btn-sm" href="https://simplestudy.com/gb/a-level/edexcel/design-and-technology-product-design/past-papers" target="_blank" rel="noopener">${I.ext} SimpleStudy</a></div></div>`:''}
    ${q.tip?`<div class="examtip" style="margin-top:12px"><b>Examiner's report:</b> ${esc(q.tip)}</div>`:''}
   </section>
   <section class="rightcol">
    <div class="veil ${revealed?'':'hidden'}" id="veil"><div class="vin">${msBlock(q)}</div><div class="vbtn"><button class="btn primary" id="reveal">Reveal mark scheme and model answer</button></div></div>
    <div class="veil ${revealed?'':'hidden'}" id="veil2"><div class="vin"><div class="model"><div class="ms-head"><h4>Model answer</h4><span class="chip ai">AI-generated · aims for full marks</span></div><div class="body">${paragraphs(q.answer)}</div>
     <div class="selfmark"><b>Self-mark:</b><input type="number" id="got" min="0" max="${q.marks}" value="${r.got??''}" aria-label="Marks scored"><span>/ ${q.marks}</span><button class="btn btn-sm primary" id="saveGot">Save score</button><span class="muted" id="gotMsg">${r.got!=null?'Saved':''}</span></div></div></div></div>
   </section>
  </div>`;
  if(onNav){ $$('[data-qnav]',v).forEach(b=>b.onclick=()=>onNav(qByKey[b.dataset.qnav])); const bk=$('[data-qback]',v); if(bk) bk.onclick=()=>onNav(null); }
  const ans=$('#ans'); ans.addEventListener('input',()=>{ S.answers[q.id]=ans.value; save(); });
  const reveal=()=>{ $('#veil').classList.remove('hidden'); $('#veil2').classList.remove('hidden'); S.exam[q.id]=Object.assign(S.exam[q.id]||{},{rev:1}); save(); };
  $('#reveal').onclick=reveal;
  $('#saveGot').onclick=()=>{ const g=Math.max(0,Math.min(q.marks,parseInt($('#got').value,10))); if(isNaN(g)) return; S.exam[q.id]=Object.assign(S.exam[q.id]||{},{got:g,ts:Date.now(),rev:1}); save(); $('#gotMsg').textContent='Saved'; toast(`Saved ${g}/${q.marks}`); };
  const aiBtn=$('#aiMark');
  aiBtn && (aiBtn.onclick=async()=>{
    if(!sampleCap) return; const a=ans.value.trim(); if(a.length<5){ toast('Write an answer first'); return; }
    const out=$('#aiOut'); out.innerHTML='<div class="aimark muted" style="margin-top:10px">Marking…</div>'; aiBtn.disabled=true;
    const prompt=`You are an experienced Pearson Edexcel A level Design and Technology (Product Design) 9DT0/01 examiner. Mark the student's answer strictly using the mark scheme. Reply in plain text with: a first line "Mark: X/${q.marks}", then 2–4 short bullet points on what earned marks and what was missing, then one sentence on how to reach full marks. Do not rewrite the whole answer.\n\nQUESTION (${q.marks} marks): ${q.stem?q.stem+' ':''}${q.text}\n\nMARK SCHEME:\n${q.ms.join('\n')}${q.levels?'\nLevels-based marking: '+D.levels[q.levels].map(x=>x.join(': ')).join(' | '):''}\n\nSTUDENT ANSWER:\n${a}`;
    try{ let txt=''; const res=await sampleCap(prompt,{modelTier:'default',onText:({text})=>{ txt=text; out.innerHTML=`<div class="aimark" style="margin-top:10px">${paragraphs(text)}</div>`; }}); txt=res.text||txt; out.innerHTML=`<div class="aimark" style="margin-top:10px"><span class="chip ai" style="margin-bottom:6px">AI marking – check against the mark scheme</span>${paragraphs(txt)}</div>`; const m=txt.match(/Mark:\s*(\d+)\s*\/\s*(\d+)/i); if(m&&$('#got')&&!$('#got').value) $('#got').value=m[1]; }
    catch(e){ out.innerHTML=`<div class="aimark muted" style="margin-top:10px">${e&&e.code==='not_granted'?'AI marking was not allowed in this view.':e&&e.code==='rate_limited'?'Too many requests – try again in a minute.':'AI marking is unavailable right now.'}</div>`; }
    aiBtn.disabled=false;
  });
}


/* ---------- VIDEOS ---------- */

/* ---- Abbreviations: dotted underline, hover for full form, click for description ---- */
const ABBR=window.ABBR||{};
const ABBR_RE=(()=>{ const ks=Object.keys(ABBR).sort((x,y)=>y.length-x.length); return ks.length?new RegExp('\\b('+ks.join('|')+')(s?)\\b','g'):null; })();
function abbrify(root){
  if(!ABBR_RE) return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{ if(!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT; for(let p=n.parentNode;p&&p!==root;p=p.parentNode){ const tg=p.nodeName.toLowerCase(); if(tg==='svg'||tg==='h1'||tg==='h2'||tg==='h3'||tg==='a'||tg==='abbr'||tg==='button'||tg==='script'||tg==='style'||tg==='code'||p.namespaceURI==='http://www.w3.org/2000/svg') return NodeFilter.FILTER_REJECT; } return NodeFilter.FILTER_ACCEPT; }});
  const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n=>{ const s=n.nodeValue; ABBR_RE.lastIndex=0; if(!ABBR_RE.test(s)) return; ABBR_RE.lastIndex=0;
    const f=document.createDocumentFragment(); let last=0, m;
    while((m=ABBR_RE.exec(s))){ if(m.index>last) f.appendChild(document.createTextNode(s.slice(last,m.index)));
      const el=document.createElement('abbr'); el.className='ab'; el.tabIndex=0; el.dataset.ab=m[1]; el.title=ABBR[m[1]][0]; el.textContent=m[0]; f.appendChild(el); last=m.index+m[0].length; }
    if(last<s.length) f.appendChild(document.createTextNode(s.slice(last))); n.parentNode.replaceChild(f,n); });
}
let abPop=null;
function closeAb(){ if(abPop){ abPop.remove(); abPop=null; } }
function openAb(el){
  closeAb(); const [full,desc]=ABBR[el.dataset.ab]||[]; if(!full) return;
  abPop=document.createElement('div'); abPop.className='abpop'; abPop.setAttribute('role','tooltip');
  abPop.innerHTML=`<b>${esc(el.dataset.ab)}</b> – ${esc(full)}${desc?`<p>${esc(desc)}</p>`:''}`;
  document.body.appendChild(abPop);
  const r=el.getBoundingClientRect(), pw=abPop.offsetWidth, ph=abPop.offsetHeight;
  let x=Math.min(Math.max(8,r.left+r.width/2-pw/2),window.innerWidth-pw-8), y=r.bottom+8;
  if(y+ph>window.innerHeight-8) y=Math.max(8,r.top-ph-8);
  abPop.style.left=(x+window.scrollX)+'px'; abPop.style.top=(y+window.scrollY)+'px';
}
document.addEventListener('click',e=>{ const el=e.target.closest&&e.target.closest('abbr.ab'); if(el){ e.preventDefault(); if(abPop&&abPop.dataset.for===el.dataset.ab+el.textContent) return closeAb(); openAb(el); if(abPop) abPop.dataset.for=el.dataset.ab+el.textContent; } else if(!(e.target.closest&&e.target.closest('.abpop'))) closeAb(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAb(); else if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.matches&&document.activeElement.matches('abbr.ab')){ e.preventDefault(); openAb(document.activeElement); } });
window.addEventListener('hashchange',closeAb); window.addEventListener('resize',closeAb);
const M=window.MEDIA||{videos:[],cases:[]};
const PLAY='<svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg>';
const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
const VCOL=['#1f5fbf','#0b6e6e','#7b4bc4','#c25a1d','#2f7d5b','#b0558c','#3c66b0','#8a5a2b','#5a6b7d','#1d7fa3','#a8382f','#4a5d9a'];
function vTile(x,i){ const c=VCOL[((+x.g||1)-1)%12]; return `<button type="button" class="vtile" data-v="${i}" style="animation-delay:${Math.min(i%24,12)*.04}s"><div class="vthumb" style="background:linear-gradient(135deg,${c},#0b1322)"><img loading="lazy" alt="" src="thumbs/${x.id}.jpg" onerror="this.remove()"><div class="vplay"><span>${PLAY}</span></div></div><div class="vmeta"><small>${esc(x.t)} ${esc((topicById[x.t]||{}).title||'')} · ${esc(x.theme)}</small><b>${esc(x.title)}</b></div></button>`; }
function openVideo(x,from){
  const m=h(`<div class="vmodal" role="dialog" aria-modal="true" aria-label="${esc(x.title)}"><div class="vbox"><a class="vframe" href="https://www.youtube.com/watch?v=${x.id}${x.start?'&t='+x.start+'s':''}" target="_blank" rel="noopener" style="display:block;position:relative;background:linear-gradient(135deg,var(--navy),var(--brand))"><img alt="" src="thumbs/${x.id}.jpg" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover;display:block"><span class="vplay"><span style="width:76px;height:76px">${PLAY}</span></span></a><div class="vbar"><b>${esc(x.title)}</b><a class="btn btn-sm" href="https://www.youtube.com/watch?v=${x.id}${x.start?'&t='+x.start+'s':''}" target="_blank" rel="noopener">${I.ext} Watch on YouTube</a><button class="iconbtn" aria-label="Close">${I.close}</button></div><div class="muted" style="font-size:.78rem;padding:0 14px 10px">Videos open on YouTube in a new tab – tap the picture or the button.</div></div></div>`);
  document.body.appendChild(m); const box=m.querySelector('.vbox');
  if(from){ const r=from.getBoundingClientRect(); box.style.transformOrigin=`${r.left+r.width/2-innerWidth/2+box.offsetWidth/2}px ${r.top+r.height/2-innerHeight/2+box.offsetHeight/2}px`; }
  requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('open')));
  const close=()=>{ m.classList.remove('open'); document.removeEventListener('keydown',kd); setTimeout(()=>m.remove(),420); from&&from.focus(); };
  const kd=e=>{ if(e.key==='Escape') close(); }; document.addEventListener('keydown',kd);
  m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.iconbtn')) close(); }); m.querySelector('.iconbtn').focus();
}
function caseCard(c){ return `<div class="casecard"><span class="eyebrow">${esc(c.t)} · ${esc((topicById[c.t]||{}).title||'')}</span><h4>${esc(cap(c.name))}</h4>${c.links.map(([t,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ${I.ext}</a>`).join('')}</div>`; }
function viewVideos(v,g){
  const groups=Object.keys(D.groups).filter(k=>k!=='X');
  v.innerHTML=`<span class="eyebrow">Video and case study library</span><h1>Videos</h1><p class="muted" style="max-width:74ch">${M.videos.length} hand-picked videos from DT teachers, engineering channels and factory documentaries, plus ${M.cases.length} real-world case studies you can quote in the exam. Tap a thumbnail to play it.</p>
  <div class="filters"><label class="field">Topic<select id="vg"><option value="">All topics</option>${groups.map(k=>`<option value="${k}">${esc(groupLabel(k)+': '+D.groups[k])}</option>`).join('')}</select></label><label class="field" style="flex:1;min-width:200px">Search<input type="search" id="vq" placeholder="e.g. injection moulding"></label></div>
  <div id="vout"></div>`;
  if(g) $('#vg').value=g;
  const render=()=>{ const G=$('#vg').value, q=$('#vq').value.trim().toLowerCase();
    const vs=M.videos.map((x,i)=>[x,i]).filter(([x])=>(!G||x.g===G)&&(!q||(x.title+' '+x.theme).toLowerCase().includes(q)));
    const cs=M.cases.filter(c=>(!G||c.g===G)&&(!q||(c.name+' '+c.links.map(l=>l[0]).join(' ')).toLowerCase().includes(q)));
    $('#vout').innerHTML=`<div class="vgrid">${vs.map(([x,i])=>vTile(x,i)).join('')||'<div class="empty">No videos match.</div>'}</div>
     <div class="sep"></div><h2 style="margin-bottom:12px">Case studies <span class="mono muted" style="font-size:.9rem">${cs.length}</span></h2>
     <div class="casegrid">${cs.map(caseCard).join('')||'<div class="empty">No case studies match.</div>'}</div>`;
    $$('.vtile',v).forEach(b=>b.onclick=()=>openVideo(M.videos[+b.dataset.v],b)); };
  $('#vg').onchange=render; $('#vq').oninput=render; render();
}

/* ---------- PAST PAPERS ---------- */
function viewPapers(v){
  const years=['2025','2024','2023','2022','2021','2020','2019'];
  const spec=D.papers.find(p=>p.kind==='spec');
  v.innerHTML=`<span class="eyebrow">Edexcel 9DT0/01 · Principles of Design and Technology</span><h1>Past papers</h1><p class="muted" style="max-width:76ch">Every Paper 1 series since the first exam in 2019 (the 2020 paper was sat in autumn 2020). Open the paper or mark scheme, download it, or sit it question by question with a timer and self-marking.</p>
  <div class="grid g3" style="margin-top:16px">${years.map(y=>{ const qp=D.papers.find(p=>p.year===y&&p.kind==='qp'), ms=D.papers.find(p=>p.year===y&&p.kind==='ms'); const qs=D.pp.filter(q=>q.year===y); const st=examStats(qs); return `<div class="card yearcard"><div class="row" style="justify-content:space-between"><span class="yr">${y}</span><span class="chip">${qs.length} parts · 120 marks</span></div>
   <div class="bar"><i style="width:${st.max?st.got/120*100:0}%"></i></div><span class="muted" style="font-size:.84rem">${st.n?`${st.got} marks from ${st.n} parts attempted`:'Not attempted yet'}</span>
   <div class="row"><a class="btn btn-sm primary" href="#paper-${y}">Sit this paper</a><button class="btn btn-sm" data-pdf="${qp.path}" data-title="${esc(qp.title)}">${I.eye} Paper</button><button class="btn btn-sm" data-pdf="${ms.path}" data-title="${esc(ms.title)}">${I.eye} Mark scheme</button></div>
   <div class="row"><button class="btn btn-sm ghost" data-dl="${qp.path}">${I.dl} Paper PDF</button><button class="btn btn-sm ghost" data-dl="${ms.path}">${I.dl} Mark scheme PDF</button></div></div>`; }).join('')}</div>
  <div class="sep"></div><h2 style="margin-bottom:10px">Specification and official links</h2><div class="stack">${resItem(Object.assign({cat:'papers'},spec))}
  <div class="card"><p style="margin:0 0 8px">Pearson also publishes Sample Assessment Materials (SAMs) and examiner reports for each series. Examiner report advice is built into the questions here (look for <span class="chip warn">Examiner's report</span> notes on 2024 and 2025 questions).</p><a href="https://qualifications.pearson.com/en/qualifications/edexcel-a-levels/design-and-technology-product-design-2017.coursematerials.html" target="_blank" rel="noopener">Pearson Edexcel course materials ${I.ext}</a></div></div>`;
}
function viewPaperRun(v,y){
  const qs=D.pp.filter(q=>q.year===y); if(!qs.length){ v.innerHTML='<div class="empty">Paper not found.</div>'; return; }
  const tk='tt-timer-'+y; let start=null; try{ start=+sessionStorage.getItem(tk)||null; }catch(e){}
  v.innerHTML=`<div class="row" style="justify-content:space-between;align-items:end"><div><span class="eyebrow"><a href="#papers">Past papers</a> / ${y}</span><h1>Sit the ${y} paper</h1></div><div class="row"><span class="timer" id="tmr">2:30:00</span><button class="btn btn-sm" id="tgo">${start?'Reset timer':'Start timer'}</button></div></div>
  <p class="muted">Work through each part in order. Open a question to write your answer and self-mark. Your scores add up below.</p>
  <div class="row" style="margin:10px 0 16px"><div class="ring" style="--p:${examStats(qs).got/120*100}"><b>${examStats(qs).got}</b></div><span class="muted">marks out of 120 so far</span></div><div class="ql">${qs.map(qItem).join('')}</div>`;
  let iv=null; const tick=()=>{ if(!start){ $('#tmr').textContent='2:30:00'; return; } let left=150*60-Math.floor((Date.now()-start)/1000); if(left<0) left=0; const hh=Math.floor(left/3600), mm=Math.floor(left%3600/60), ss=left%60; const el=$('#tmr'); if(el) el.textContent=`${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; };
  $('#tgo').onclick=()=>{ if(start){ start=null; try{sessionStorage.removeItem(tk)}catch(e){} $('#tgo').textContent='Start timer'; } else { start=Date.now(); try{sessionStorage.setItem(tk,start)}catch(e){} $('#tgo').textContent='Reset timer'; } tick(); };
  tick(); iv=setInterval(tick,1000); cleanup.push(()=>clearInterval(iv));
}

/* ---------- DOWNLOADS ---------- */
function viewDownloads(v){
  const cats=[['cheatsheets','Cheat sheets (summaries + key terms)'],['worksheets','Worksheets'],['slides','Teacher slides and revision guides'],['resources','Resources and class research'],['papers','Past papers and specification']];
  v.innerHTML=`<span class="eyebrow">Library</span><h1>Downloads</h1><p class="muted" style="max-width:76ch">Your teachers' slides, worksheets and resources, tidied up and linked to spec topics. Open any PDF in the viewer, or download it. Names of individual students have been removed from file names and documents.</p>
  <div class="filters"><label class="field" style="flex:1;min-width:200px">Search<input type="search" id="lq" placeholder="e.g. adhesives"></label><label class="field">Type<select id="lc"><option value="">All types</option>${cats.map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label><label class="field">Topic<select id="lt"><option value="">All topics</option>${D.topics.map(t=>`<option value="${t.id}">${esc(t.id+' '+t.title)}</option>`).join('')}</select></label></div><div id="lib"></div>`;
  const all=(window.CHEATS||[]).map(c=>Object.assign({},c,{topics:D.topics.filter(t=>t.group===c.g).map(t=>t.id)})).concat(D.library).concat(D.papers.map(p=>Object.assign({cat:'papers',topics:[]},p)));
  const render=()=>{ const q=$('#lq').value.toLowerCase(), c=$('#lc').value, t=$('#lt').value;
    const items=all.filter(r=>(!c||r.cat===c)&&(!t||(r.topics||[]).includes(t))&&(!q||r.title.toLowerCase().includes(q)));
    $('#lib').innerHTML=cats.filter(([k])=>!c||k===c).map(([k,l])=>{ const its=items.filter(r=>r.cat===k).sort((a,b)=>a.title.localeCompare(b.title,undefined,{numeric:true})); return its.length?`<section style="margin-bottom:22px"><h2 style="margin-bottom:10px">${l} <span class="mono muted" style="font-size:.9rem">${its.length}</span></h2><div class="stack" style="gap:8px">${its.map(resItem).join('')}</div></section>`:''; }).join('')||'<div class="empty">Nothing matches.</div>'; };
  $$('.filters input,.filters select',v).forEach(x=>x.addEventListener(x.type==='search'?'input':'change',render)); render();
}

/* ---------- PROGRESS ---------- */
function viewProgress(v){
  const ts=D.topics; const es=examStats(ALLQ);
  const weak=ts.filter(t=>t.group!=='X').map(t=>[t,topicProgress(t)]).sort((a,b)=>a[1]-b[1]).slice(0,6);
  const qzAll=Object.values(S.quiz).flat(); const qzAvg=qzAll.length?Math.round(qzAll.reduce((a,x)=>a+x.s/x.n,0)/qzAll.length*100):null;
  v.innerHTML=`<span class="eyebrow">Saved in this browser</span><h1>Your progress</h1>
  <section class="statrow" style="margin-top:14px"><div class="stat"><b>${overall()}%</b><span>Overall spec progress</span></div><div class="stat"><b>${Object.keys(S.revised).length}/${ts.length}</b><span>Pages marked revised</span></div><div class="stat"><b>${qzAvg==null?'–':qzAvg+'%'}</b><span>Average quiz score</span></div><div class="stat"><b>${es.max?Math.round(es.got/es.max*100)+'%':'–'}</b><span>Exam marks (${es.got}/${es.max})</span></div></section>
  <div class="grid g2" style="margin-top:18px"><div class="card"><h3>Focus next</h3><p class="muted" style="margin-top:4px">Your lowest-progress pages.</p><div class="stack" style="gap:8px">${weak.map(([t,p])=>`<a href="#t-${t.id}" class="row" style="justify-content:space-between;text-decoration:none;color:inherit"><span><span class="mono muted">${esc(t.id)}</span> ${esc(t.title)}</span><span class="mono">${p}%</span></a>`).join('')}</div></div>
  <div class="card"><h3>Back up or move your progress</h3><p class="muted" style="margin-top:4px">Progress lives in this browser only. Save a backup file to restore it on another device or browser.</p><div class="row"><button class="btn primary" id="exp">${I.dl} Save backup</button><label class="btn" for="imp">Restore from file</label><input type="file" id="imp" accept=".json,application/json" hidden></div>
  <div class="sep"></div><button class="btn" id="rst">Reset all progress</button><div id="rstc"></div></div></div>
  <div class="sep"></div><h2 style="margin-bottom:12px">By topic</h2>
  <div class="tbl"><table><thead><tr><th>Page</th><th>Progress</th><th>Confidence</th><th>Best quiz</th><th>Exam marks</th></tr></thead><tbody>${ts.map(t=>{ const p=topicProgress(t); const qz=S.quiz[t.id]; const best=qz&&qz.length?Math.round(Math.max(...qz.map(x=>x.s/x.n))*100)+'%':'–'; const st=examStats(ALLQ.filter(q=>q.topics.includes(t.id))); return `<tr><td><a href="#t-${t.id}">${esc(t.id)} ${esc(t.title)}</a></td><td style="min-width:140px"><div class="bar"><i style="width:${p}%"></i></div></td><td><span class="rag ${S.conf[t.id]||''}"></span></td><td class="mono">${best}</td><td class="mono">${st.max?st.got+'/'+st.max:'–'}</td></tr>`; }).join('')}</tbody></table></div>`;
  $('#exp').onclick=async()=>{ const data=JSON.stringify(S,null,1); const fn=`traintanmay-progress-${new Date().toISOString().slice(0,10)}.json`; if(dlCap){ try{ await dlCap.save({filename:fn,data}); toast('Backup saved'); }catch(e){ if(e&&e.code!=='declined') toast('Could not save the backup here'); } } else { const ta=h(`<textarea readonly style="margin-top:10px">${esc(data)}</textarea>`); $('#exp').parentElement.after(ta); ta.select(); toast('Copy this text and keep it safe'); } };
  $('#imp').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ try{ const p=JSON.parse(rd.result); if(!p||typeof p!=='object'||!('flash' in p)) throw 0; S=Object.assign(S,p); save(); toast('Progress restored'); route(); }catch(err){ toast('That file is not a TrainTanmay backup'); } }; rd.readAsText(f); };
  $('#rst').onclick=()=>{ $('#rstc').innerHTML=`<div class="row" style="margin-top:10px"><span>Delete all progress in this browser?</span><button class="btn btn-sm" id="rstY" style="border-color:var(--bad);color:var(--bad)">Yes, reset</button><button class="btn btn-sm ghost" id="rstN">Cancel</button></div>`; $('#rstN').onclick=()=>$('#rstc').innerHTML=''; $('#rstY').onclick=()=>{ const th=S.settings; S={revised:{},conf:{},flash:{},quiz:{},exam:{},answers:{},days:[],last:null,settings:th}; save(); toast('Progress reset'); route(); }; };
}

/* ---------- SEARCH ---------- */
function viewSearch(v){
  v.innerHTML=`<span class="eyebrow">Notes, key terms and questions</span><h1>Search</h1><div class="searchbox" style="margin:14px 0">${I.search}<input type="search" id="sq" placeholder="Search e.g. galvanising, Six Sigma, Loewy…" autofocus></div><div id="sr"></div>`;
  const idx=[]; D.topics.forEach(t=>{ idx.push({k:'topic',t,title:`${t.id} ${t.title}`,text:t.html.replace(/<[^>]+>/g,' '),href:`#t-${t.id}`}); t.terms.forEach(([a,b])=>idx.push({k:'term',t,title:a,text:b,href:`#t-${t.id}`})); });
  ALLQ.forEach(q=>idx.push({k:'q',q,title:q.src==='pp'?`${q.year} Q${q.q}`:'AI practice question',text:q.stem+' '+q.text,href:`#q-${qkey(q.id)}`}));
  const sq=$('#sq');
  const render=()=>{ const s=sq.value.trim().toLowerCase(); if(s.length<2){ $('#sr').innerHTML='<p class="muted">Type at least two letters.</p>'; return; }
    const words=s.split(/\s+/); const res=idx.map(r=>{ const T=(r.title).toLowerCase(), X=r.text.toLowerCase(); let sc=0; for(const w of words){ if(T.includes(w)) sc+=5; else if(X.includes(w)) sc+=1; else return null; } if(r.k==='term') sc+=2; return [sc,r]; }).filter(Boolean).sort((a,b)=>b[0]-a[0]).slice(0,60);
    const snip=(x)=>{ const i=x.toLowerCase().indexOf(words[0]); const a=Math.max(0,i-60); return esc((a?'…':'')+x.slice(a,a+170)+'…').replace(new RegExp(words.map(w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi'),m=>`<mark>${m}</mark>`); };
    $('#sr').innerHTML=res.length?res.map(([_,r])=>`<a class="res" href="${r.href}"><b>${esc(r.title)}</b><small>${r.k==='topic'?'Notes':r.k==='term'?'Key term · '+esc(r.t.id):'Exam question'}</small><span style="font-size:.9rem">${snip(r.text)}</span></a>`).join(''):'<div class="empty">No results.</div>'; };
  sq.addEventListener('input',render); render(); setTimeout(()=>sq.focus(),50);
}

route();
})();
