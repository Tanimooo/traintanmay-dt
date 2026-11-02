/* TrainTanmay Physics – PMT question bank and mock tests.
   window.BANK (data/bank.js) holds the metadata; question and mark-scheme images plus full text
   are packed per source pack in qbank/pNNN.json and fetched on demand. */
(function(){
'use strict';
window.BANKUI=function(C){
const {S,esc,h,$,$$,toast,byId,T,MODS}=C;
const B=window.BANK||{packs:[],q:[]};
const Q=B.q.slice(), QI={};
/* TrainTanmay exam-style questions join the bank as their own source */
const WQ=(C.ALLQ||[]).map(w=>({id:'w_'+w.id.replace(/\./g,'_'),wr:w,t:[w.topic],m:w.marks,mw:1,s:(w.stem+' '+w.parts.map(p=>p.q).join(' ')).replace(/\s+/g,' ')}));
Q.push(...WQ); Q.forEach(q=>QI[q.id]=q);
/* Multi-part questions: some packs split one exam question into several numbered items that repeat the same
   stem (listed in BANK.groups). They always appear together and in order (2a, 2b, …). */
(B.groups||[]).forEach(ids=>{ const g=ids.map(i=>QI[i]).filter(Boolean); if(g.length<2) return; g.forEach((q,i)=>{ q.grp=g; q.pi=i; }); });
const unitOf=q=>q.grp||[q];
const unitMarks=u=>u.reduce((a,q)=>a+(q.m||0),0);
/* "f" = marks for the whole original question when only its first part(s) are included here */
const partialNote=q=>{ const u=unitOf(q); const full=Math.max(...u.map(x=>x.f||0)); const have=unitMarks(u); if(!full||full<=have) return '';
  return `<div class="psw" style="margin:0"><p><b>Only part of this exam question is here</b> (${have} of its ${full} marks). The official mark scheme on the right also covers later parts that are not shown, so mark just the part${have===1?'':'s'} above out of ${q.m}.</p></div>`; };
const partNote=(q,lab)=>{ if(!q.grp) return ''; const first=q.pi===0; return `<div class="psw" style="margin:0;border-color:var(--accent)"><p><b>Part ${L_(q.pi)} of a ${q.grp.length}-part question.</b> ${first?'The later parts follow straight after this one.':'It uses the same set-up as part a, which comes just before it'+(lab?' ('+lab+')':'')+'.'}</p></div>`; };
/* labels like 1, 2a, 2b, 3 for a list of questions */
const labelsFor=qs=>{ const out=[]; let n=0, prev=null, k=0; qs.forEach(q=>{ if(q.grp&&q.grp===prev){ k++; } else { n++; k=0; prev=q.grp||null; } out.push(q.grp?n+L_(k):String(n)); }); return {lab:out,count:n}; };
S.bank=S.bank||{}; S.mocks=S.mocks||[]; S.exam=S.exam||{};
WQ.forEach(q=>{ const e=S.exam[q.wr.id]; if(e&&e.got!=null&&!(S.bank[q.id]&&S.bank[q.id].got!=null)) S.bank[q.id]={got:e.got,ts:e.ts||Date.now(),rev:1}; });
const saveNow=()=>{ save(); try{ localStorage.setItem('tt-phys-progress-v1',JSON.stringify(S)); }catch(e){} }; // write straight away as well as via the app's short debounce
const save=()=>{ WQ.forEach(q=>{ const r=S.bank[q.id]; if(r&&r.got!=null) S.exam[q.wr.id]=Object.assign(S.exam[q.wr.id]||{},{got:r.got,ts:r.ts,rev:1}); }); C.save(); };
const SRC={N:'cur',O:'cur',M:'old',A:'ext',B:'ext',C:'ext',D:'ext'};
const SRCL={cur:'OCR A current spec (Sets N and O)',old:'OCR A earlier papers (Set M)',ext:'Extra practice (Sets A to D)',tt:'TrainTanmay exam-style questions'};
const srcOf=q=>q.wr?'tt':(SRC[B.packs[q.p].set]||'ext');
const pk=q=>q.wr?{title:'Exam-style question'}:B.packs[q.p];
const qLabel=q=>q.wr?`Exam-style ${q.wr.id} · ${q.wr.style}`:`${pk(q).title} · Q${q.n}`;
const pmtQ=q=>pk(q).qp_url+(q.qp?'#page='+q.qp:'');
const pmtM=q=>pk(q).ms_url+(q.mp?'#page='+q.mp:'');
const minsFor=m=>Math.max(1,Math.round(m*1.2));

/* ---------- image packs ---------- */
const PK={};
const loadPack=c=>PK[c]||(PK[c]=fetch('qbank/c'+c+'.json').then(r=>r.ok?r.json():{}).catch(()=>{ delete PK[c]; return {}; }));
const L_=i=>String.fromCharCode(97+i);
const img=(q,kind)=>{ if(q.wr){ const w=q.wr; return kind==='m'?`<div class="ms" style="border:0"><table>${w.parts.map((p,i)=>`<tr><td class="qn">(${L_(i)})</td><td><ul>${p.ms.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${p.ans?`<div class="ans">Answer: ${esc(p.ans)}</div>`:''}</td><td class="mk">${p.m}</td></tr>`).join('')}</table></div>`:`<div class="paper wq"><p class="stemtxt">${esc(w.stem)}</p>${w.parts.map((p,i)=>`<p class="qtxt"><span>(${L_(i)}) ${esc(p.q)}</span><span class="mk">[${p.m}]</span></p>`).join('')}</div>`; }
  const k=`p${String(q.p).padStart(3,'0')}_${q.n}${kind}`; const w=kind==='m'?q.mw:q.w, ht=kind==='m'?q.mh:q.h;
  return `<div class="qpaper"><img data-bk="${k}" data-p="${q.c}" alt="${kind==='m'?'Mark scheme':'Question'} ${esc(qLabel(q))}" width="${w||600}" height="${ht||300}" style="aspect-ratio:${w||600}/${ht||300}"></div>`; };
const fill=root=>{ $$('.qpaper',root).forEach(d=>{ if(d.dataset.z) return; d.dataset.z=1; d.title='Tap to zoom'; d.onclick=()=>d.classList.toggle('zoom'); }); $$('img[data-bk]',root).forEach(im=>{ if(im.dataset.done) return; im.dataset.done=1; loadPack(+im.dataset.p).then(m=>{ const s=m[im.dataset.bk]; if(s){ im.src=s; im.removeAttribute('style'); } else im.alt='Image unavailable: open it on PMT'; }); }); };
const textOf=(q,kind)=>loadPack(q.c).then(m=>(m._t||{})[q.id+kind]||'');

/* ---------- helpers ---------- */
const topicChips=q=>q.t.filter(t=>byId[t]).map((t,i)=>`<a class="chip ${i?'':'brand'}" href="#t-${t}">${t} ${esc(byId[t].title)}</a>`).join('');
const status=q=>{ const r=S.bank[q.id]; if(!r||r.got==null) return ''; const f=r.got/(q.m||1); return `<span class="chip ${f>=0.7?'good':f>=0.4?'warn':'bad'}">${r.got}/${q.m}</span>`; };
const mcqKey=(q,ch)=>{ const right=ch===q.mcq; S.bank[q.id]={got:right?q.m||1:0,ts:Date.now(),rev:1,ch}; save(); return right; };
const topicOpts=sel=>T.map(t=>`<option value="${t.id}" ${sel===t.id?'selected':''}>${t.id} ${esc(t.title)}</option>`).join('');
const shuffle=a=>{ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fmtT=s=>{ s=Math.max(0,Math.round(s)); const m=Math.floor(s/60), x=s%60; return m+':'+String(x).padStart(2,'0'); };
const para=s=>esc(s).split(/\n+/).map(l=>`<p>${l}</p>`).join('');

function aiPrompt(q,qt,mt,ans,mode){
  const base=`OCR A Level Physics A (H556) question (${q.m||'?'} marks).\n\nQUESTION TEXT (extracted from the paper, diagrams not included):\n${qt.slice(0,3500)}\n\nOFFICIAL MARK SCHEME (extracted):\n${mt.slice(0,3500)}\n`;
  if(mode==='model') return `You are an expert OCR A Level Physics teacher. Write a full-mark model answer a top student would write for the question below, following the official mark scheme exactly. Rules: answer each part in order with its label (a)(i) etc; for calculations write the equation, substitute with units, and give the final answer to sensible significant figures with a unit; for explanations use the key words the mark scheme rewards; where a diagram or graph is required, describe precisely what to draw (axes, labels, shape, key points) in one or two lines. Plain text, no markdown headings.\n\n${base}`;
  return `You are an experienced OCR A Level Physics A (H556) examiner. Mark the student's answer strictly against the official mark scheme, using OCR conventions (B, M, C, A marks, error carried forward). Reply in plain text: first line "Mark: X/${q.m||'?'}", then one short line per part saying which marking points were earned and what was missing, then one sentence on how to reach full marks.\n\n${base}\nSTUDENT ANSWER:\n${ans||'[no answer]'}`;
}
async function runAI(q,ansText,mode,out,onMark){
  const cap=C.sample(); if(!cap){ out.innerHTML='<div class="aimark muted">AI help is not available in this view.</div>'; return; }
  out.innerHTML='<div class="aimark muted">'+(mode==='model'?'Writing a model answer…':'Marking…')+'</div>';
  const [qt,mt]=await Promise.all([textOf(q,'q'),textOf(q,'m')]);
  try{ let last=''; const res=await cap(aiPrompt(q,qt,mt,ansText,mode),{modelTier:'default',onText:({text})=>{ last=text; out.innerHTML=`<div class="aimark">${para(text)}</div>`; }});
    const fin=(res&&res.text)||last; out.innerHTML=`<div class="aimark"><span class="chip ai" style="margin-bottom:6px">${mode==='model'?'AI model answer · based on the official mark scheme':'AI marking · check it against the mark scheme'}</span>${para(fin)}</div>`;
    const m=fin.match(/Mark:\s*(\d+)\s*\/\s*(\d+)/i); if(m&&onMark) onMark(+m[1]); }
  catch(e){ out.innerHTML=`<div class="aimark muted">${e&&e.code==='not_granted'?'AI help was not allowed in this view.':e&&e.code==='rate_limited'?'Too many requests: try again in a minute.':'AI help is unavailable right now.'}</div>`; }
}

/* ---------- bank list ---------- */
function filterQs(f){
  return Q.filter(q=>(!f.t||q.t.includes(f.t))&&(!f.m||q.t.some(t=>byId[t]&&byId[t].mod===+f.m))&&(!f.src||srcOf(q)===f.src)&&(!f.type||(f.type==='mcq'?!!q.mcq:!q.mcq))
    &&(!f.st||(f.st==='todo'?!(S.bank[q.id]&&S.bank[q.id].got!=null):f.st==='wrong'?(S.bank[q.id]&&S.bank[q.id].got!=null&&S.bank[q.id].got<(q.m||1)*0.6):(S.bank[q.id]&&S.bank[q.id].got!=null)))
    &&(!f.q||(q.s+' '+pk(q).title).toLowerCase().includes(f.q)));
}
function viewBank(v){
  const pre=JSON.parse(sessionStorage.getItem('tt-bankf')||'{}');
  v.innerHTML=`<span class="eyebrow">Past paper and exam-style questions</span><h1>Practice questions</h1>
  <p class="muted" style="max-width:78ch">${Q.length.toLocaleString()} questions with mark schemes: ${B.q.length.toLocaleString()} real exam questions from ${B.packs.length} PMT topic packs, plus ${WQ.length} exam-style questions written for H556. Questions that cover several spec points appear under every topic they test. Answer, reveal the mark scheme and self-mark, or build a <a href="#mock">practice test</a>.</p>
  <div class="filters"><label class="field">Module<select id="bm"><option value="">All</option>${MODS.map(m=>`<option value="${m.n}">Module ${m.n}</option>`).join('')}</select></label>
  <label class="field">Topic<select id="bt"><option value="">All topics</option>${topicOpts(pre.t)}</select></label>
  <label class="field">Source<select id="bs"><option value="">All sources</option>${Object.entries(SRCL).map(([k,l])=>`<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
  <label class="field">Type<select id="by"><option value="">All</option><option value="mcq">Multiple choice</option><option value="str">Structured</option></select></label>
  <label class="field">Status<select id="bst"><option value="">Any</option><option value="todo">Not attempted</option><option value="wrong">Under 60%</option><option value="done">Marked</option></select></label>
  <label class="field" style="flex:1;min-width:180px">Search<input type="search" id="bq" placeholder="e.g. terminal velocity"></label></div>
  <div class="row" style="justify-content:space-between;margin:10px 0"><span class="muted" id="bcount"></span><a class="btn btn-sm primary" href="#mock" id="tomock">Build a practice test from these filters</a></div>
  <div class="bk-list" id="blist"></div><div style="text-align:center;margin:16px 0"><button class="btn" id="bmore" hidden>Show more</button></div>`;
  if(pre.t) $('#bt').value=pre.t; if(pre.m) $('#bm').value=pre.m; if(pre.src) $('#bs').value=pre.src; if(pre.type) $('#by').value=pre.type; if(pre.st) $('#bst').value=pre.st; if(pre.q) $('#bq').value=pre.q;
  let list=[], shown=0;
  const item=q=>`<a class="bk-item" href="#pq-${q.id}"><div class="bk-main"><span class="eyebrow">${esc(qLabel(q))} · ${q.mcq?'Multiple choice':'Structured'}</span><span class="bk-snip">${esc(q.s.slice(0,170))}${q.s.length>170?'…':''}</span><span class="bk-tags">${q.t.filter(t=>byId[t]).map(t=>`<span class="chip">${t}</span>`).join('')}</span></div><div class="bk-side"><b>${q.m||'?'}</b><small>marks</small>${status(q)}</div></a>`;
  const more=()=>{ const next=list.slice(shown,shown+40); $('#blist').insertAdjacentHTML('beforeend',next.map(item).join('')); shown+=next.length; $('#bmore').hidden=shown>=list.length; };
  const draw=()=>{ const f={m:$('#bm').value,t:$('#bt').value,src:$('#bs').value,type:$('#by').value,st:$('#bst').value,q:$('#bq').value.trim().toLowerCase()};
    sessionStorage.setItem('tt-bankf',JSON.stringify(f)); list=filterQs(f); sessionStorage.setItem('tt-banklist',JSON.stringify(list.map(q=>q.id)));
    $('#bcount').textContent=`${list.length.toLocaleString()} question${list.length===1?'':'s'} · ${list.reduce((a,q)=>a+(q.m||0),0).toLocaleString()} marks`;
    $('#blist').innerHTML=list.length?'':'<div class="empty">No questions match these filters.</div>'; shown=0; more(); };
  ['bm','bt','bs','by','bst'].forEach(id=>$('#'+id).onchange=draw); let tq; $('#bq').oninput=()=>{ clearTimeout(tq); tq=setTimeout(draw,200); };
  $('#bmore').onclick=more; $('#tomock').onclick=()=>{ const f=JSON.parse(sessionStorage.getItem('tt-bankf')||'{}'); sessionStorage.setItem('tt-mockpre',JSON.stringify({topics:f.t?[f.t]:f.m?T.filter(t=>t.mod===+f.m).map(t=>t.id):[],src:f.src?[f.src]:null,type:f.type||''})); };
  draw();
}

/* ---------- single question ---------- */
function viewBankQ(v,id){
  const q=QI[id]; if(!q){ v.innerHTML='<div class="empty">Question not found. <a href="#bank">Practice questions</a></div>'; return; }
  const list=JSON.parse(sessionStorage.getItem('tt-banklist')||'[]'); const ix=list.indexOf(id); const prev=ix>0?list[ix-1]:null, next=ix>=0&&ix<list.length-1?list[ix+1]:null;
  const r=S.bank[q.id]||{}; const ak='b:'+q.id;
  v.innerHTML=`<div class="row" style="justify-content:space-between;margin-bottom:12px"><span class="eyebrow"><a href="#bank">Practice questions</a> / ${esc(qLabel(q))}</span><div class="row">${prev?`<a class="btn btn-sm" href="#pq-${prev}">← Previous</a>`:''}${next?`<a class="btn btn-sm" href="#pq-${next}">Next →</a>`:''}</div></div>
  <div class="bk-q"><section class="stack">
   <div class="row" style="justify-content:space-between;gap:8px"><div class="row" style="gap:6px">${topicChips(q)}</div><span class="chip">${q.m||'?'} marks · about ${minsFor(q.m||1)} min</span></div>
   ${q.grp?`<div class="psw" style="margin:0;border-color:var(--accent)"><p><b>Part ${L_(q.pi)} of a ${q.grp.length}-part question.</b> ${q.grp.map((x,k)=>x===q?`<b>Part ${L_(k)}</b>`:`<a href="#pq-${x.id}">Part ${L_(k)}</a>`).join(' · ')}${q.pi>0?' · do part a first: it sets up the question.':''}</p></div>`:''}${partialNote(q)}
   ${img(q,'q')}
   ${q.mcq?`<div class="mcq-row" id="mcq">${'ABCD'.split('').map(c=>`<button class="btn mcq ${r.ch===c?(c===q.mcq?'right':'wrong'):''}" data-c="${c}">${c}</button>`).join('')}<span class="muted" id="mcqmsg">${r.ch?(r.ch===q.mcq?'Correct!':'The answer is '+q.mcq):'Pick an answer'}</span></div>`
     :`<label class="muted" for="ans" style="font-size:.8rem">Your answer and working (saved on this device)</label><textarea id="ans" placeholder="Write your answer, part by part…">${esc((S.answers||{})[ak]||'')}</textarea>`}
   ${q.wr?'':`<div class="row pmt-links"><a class="btn btn-sm ghost" href="${esc(pmtQ(q))}" target="_blank" rel="noopener">Question paper on PMT${q.qp?' (p. '+q.qp+')':''} ↗</a><a class="btn btn-sm ghost" href="${esc(pmtM(q))}" target="_blank" rel="noopener">Mark scheme on PMT${q.mp?' (p. '+q.mp+')':''} ↗</a></div>`}
  </section>
  <section class="stack">
   <div class="veil ${r.rev?'':'hidden'}" id="veil"><div class="vin"><div class="ms"><div class="ms-head"><h4>Mark scheme</h4><span class="chip">${q.m||'?'} marks</span></div>
    ${q.mw?img(q,'m'):`<p class="muted">This question's mark scheme could not be cut out automatically. Open it on PMT with the button on the left.</p>`}
    ${q.mcq?'':`<div class="selfmark"><b>Self-mark:</b><input type="number" id="got" min="0" max="${q.m||20}" value="${r.got??''}" aria-label="Marks scored" inputmode="numeric"><span>/ ${q.m||'?'}</span><span class="muted" id="gotMsg" aria-live="polite">${r.got!=null?'Saved ✓':''}</span></div>`}
    
   </div></div><div class="vbtn"><button class="btn primary" id="reveal">Reveal mark scheme</button></div></div>
   <div class="card"><span class="eyebrow">How to use this</span><ul style="margin:6px 0 0;padding-left:18px;font-size:.92rem"><li>Answer on paper or in the box first, then reveal the mark scheme.</li><li>Mark yourself honestly: each tick in the scheme is one mark. "ecf" means you can still score after an earlier slip.</li><li>Your scores feed "Got wrong before" and "Weak topics" when you build a practice test.</li></ul></div>
  </section></div>`;
  fill(v);
  const ta=$('#ans'); if(ta) ta.addEventListener('input',()=>{ S.answers=S.answers||{}; S.answers[ak]=ta.value; save(); });
  $('#reveal').onclick=()=>{ $('#veil').classList.remove('hidden'); S.bank[q.id]=Object.assign(S.bank[q.id]||{},{rev:1}); save(); fill(v); };
  if(q.mcq) $$('#mcq [data-c]').forEach(b=>b.onclick=()=>{ const ok=mcqKey(q,b.dataset.c); $$('#mcq [data-c]').forEach(x=>x.classList.remove('right','wrong')); b.classList.add(ok?'right':'wrong'); if(!ok) $(`#mcq [data-c="${q.mcq}"]`).classList.add('right'); $('#mcqmsg').textContent=ok?'Correct!':'The answer is '+q.mcq; $('#veil').classList.remove('hidden'); fill(v); });
  const gi=$('#got'); if(gi) gi.oninput=()=>{ const raw=parseInt(gi.value,10); if(isNaN(raw)){ $('#gotMsg').textContent=''; return; } const g=Math.max(0,Math.min(q.m||99,raw)); if(g!==raw) gi.value=g; S.bank[q.id]=Object.assign(S.bank[q.id]||{},{got:g,ts:Date.now(),rev:1}); saveNow(); $('#gotMsg').textContent='Saved ✓'; };
}

/* ---------- mock tests ---------- */
const DEF={topics:[],src:['cur','old','ext','tt'],types:['mcq','str'],mode:'random',marks:40,timed:true,reveal:'end',order:'paper'};
function pickQs(cfg){
  let pool=Q.filter(q=>(!cfg.topics.length||q.t.some(t=>cfg.topics.includes(t)))&&cfg.src.includes(srcOf(q))&&cfg.types.includes(q.mcq?'mcq':'str')&&(q.m||0)>0);
  const att=q=>S.bank[q.id]&&S.bank[q.id].got!=null, wrong=q=>att(q)&&S.bank[q.id].got<(q.m||1)*0.6;
  if(cfg.mode==='weak'){ const tp={}; Q.forEach(q=>{ const r=S.bank[q.id]; if(!r||r.got==null) return; q.t.forEach(t=>{ const x=tp[t]||(tp[t]={g:0,m:0}); x.g+=r.got; x.m+=q.m||1; }); });
    const weak=Object.entries(tp).filter(([t,x])=>x.m>=3).sort((a,b)=>a[1].g/a[1].m-b[1].g/b[1].m).slice(0,4).map(e=>e[0]);
    if(weak.length) pool=pool.filter(q=>q.t.some(t=>weak.includes(t))); }
  // every question is taken as a whole unit: all of its parts, in order
  const seen=new Set(); let units=[];
  pool.forEach(q=>{ const u=unitOf(q); if(seen.has(u[0].id)) return; seen.add(u[0].id); units.push(u); });
  units=units.filter(u=>unitMarks(u)<=40);
  if(cfg.mode==='unseen') units=units.filter(u=>u.every(q=>!att(q)));
  if(cfg.mode==='wrong') units=units.filter(u=>u.some(wrong));
  shuffle(units); const out=[]; let sum=0; const seenText=new Set();
  for(const u of units){ if(sum>=cfg.marks) break; const key=u[0].s.slice(0,80); if(seenText.has(key)) continue; const um=unitMarks(u); if(sum+um>cfg.marks+Math.max(3,cfg.marks*0.1)) continue; out.push(u); sum+=um; seenText.add(key); }
  if(cfg.order==='paper') out.sort((a,b)=>(b[0].mcq?1:0)-(a[0].mcq?1:0)||unitMarks(a)-unitMarks(b));
  return out.flat();
}
function viewMock(v){
  let cfg=Object.assign({},DEF,JSON.parse(localStorage.getItem('tt-mockcfg')||'{}'));
  try{ const pre=JSON.parse(sessionStorage.getItem('tt-mockpre')||'null'); if(pre){ sessionStorage.removeItem('tt-mockpre'); cfg.topics=pre.topics||[]; if(pre.src) cfg.src=pre.src; if(pre.type) cfg.types=[pre.type==='mcq'?'mcq':'str']; } }catch(e){}
  const hist=S.mocks.slice().reverse();
  v.innerHTML=`<span class="eyebrow">Exam practice from the question bank</span><h1>Practice tests</h1><p class="muted" style="max-width:76ch">Build a timed paper from real PMT questions on any mix of topics. Sit it, then review every question against the official mark scheme, mark yourself (multiple choice is marked for you) and see a breakdown by topic.</p>
  <div class="grid g2" style="align-items:start;margin-top:14px"><div class="stack">
   <div class="card"><div class="row" style="justify-content:space-between"><label class="field">Topics</label><div class="row" style="gap:6px"><button class="chip" data-qt="as">AS (Modules 1 to 4)</button><button class="chip" data-qt="all">Whole course</button><button class="chip" data-qt="none">Clear</button></div></div>
    ${MODS.map(m=>`<div class="mk-mod"><button class="mk-modbtn" data-mod="${m.n}">Module ${m.n}</button><div class="chips">${T.filter(t=>t.mod===m.n).map(t=>`<button class="chip" data-t="${t.id}" aria-pressed="${cfg.topics.includes(t.id)}">${t.id} ${esc(t.title)}</button>`).join('')}</div></div>`).join('')}
    <p class="muted" style="font-size:.8rem;margin:8px 0 0">No topics selected means the whole course.</p></div>
   <div class="card"><label class="field">Sources</label><div class="chips" id="msrc">${Object.entries(SRCL).map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${cfg.src.includes(k)}">${esc(l)}</button>`).join('')}</div>
    <label class="field" style="margin-top:14px">Question types</label><div class="chips" id="mtyp"><button class="chip" data-v="mcq" aria-pressed="${cfg.types.includes('mcq')}">Multiple choice</button><button class="chip" data-v="str" aria-pressed="${cfg.types.includes('str')}">Structured and extended</button></div></div>
  </div><div class="stack">
   <div class="card"><label class="field">Question selection</label><div class="chips" id="mmode">${[['random','Randomised'],['unseen','Not yet attempted'],['wrong','Got wrong before'],['weak','My weakest topics']].map(([k,l])=>`<button class="chip" data-v="${k}" aria-pressed="${cfg.mode===k}">${l}</button>`).join('')}</div>
    <label class="field" for="mmarks" style="margin-top:14px">Length: <span class="mono" id="mmv">${cfg.marks}</span> marks</label><input type="range" id="mmarks" min="10" max="120" step="5" value="${cfg.marks}">
    <div class="chips" style="margin-top:8px">${[[20,'Quick 20'],[40,'40 marks'],[70,'AS paper (70)'],[100,'A level paper (100)']].map(([m,l])=>`<button class="chip" data-mk="${m}">${l}</button>`).join('')}</div>
    <p class="muted" style="font-size:.85rem;margin:10px 0 0" id="mavail"></p></div>
   <div class="card"><label class="toggle" for="mtimed"><input type="checkbox" id="mtimed" ${cfg.timed?'checked':''}> Timed (1.2 minutes per mark, like the real papers)</label>
    <label class="field" style="margin-top:14px">Show mark schemes</label><div class="chips" id="mrev"><button class="chip" data-v="end" aria-pressed="${cfg.reveal==='end'}">At the end</button><button class="chip" data-v="instant" aria-pressed="${cfg.reveal==='instant'}">After each question</button></div>
    <label class="field" style="margin-top:14px">Order</label><div class="chips" id="mord"><button class="chip" data-v="paper" aria-pressed="${cfg.order==='paper'}">Like a paper (multiple choice first)</button><button class="chip" data-v="mix" aria-pressed="${cfg.order==='mix'}">Shuffled</button></div>
    <button class="btn primary" id="mstart" style="margin-top:18px;width:100%;justify-content:center">Start practice test</button></div>
  </div></div>
  <h2 style="margin:28px 0 10px">Your practice tests</h2>${hist.length?`<div class="bk-list">${hist.map(mockRow).join('')}</div>`:'<div class="empty">No practice tests yet. Build one above.</div>'}`;
  const store=()=>{ try{ localStorage.setItem('tt-mockcfg',JSON.stringify(cfg)); }catch(e){} };
  const avail=()=>{ const all=pickQs(Object.assign({},cfg,{marks:1e9})); const m=all.reduce((a,q)=>a+q.m,0); $('#mavail').textContent=`${all.length.toLocaleString()} questions (${m.toLocaleString()} marks) match.${cfg.timed?' Time allowed: '+minsFor(cfg.marks)+' minutes.':''}`; $('#mstart').disabled=!all.length; };
  const syncT=()=>{ $$('[data-t]',v).forEach(b=>b.setAttribute('aria-pressed',cfg.topics.includes(b.dataset.t))); store(); avail(); };
  $$('[data-t]',v).forEach(b=>b.onclick=()=>{ const t=b.dataset.t; cfg.topics=cfg.topics.includes(t)?cfg.topics.filter(x=>x!==t):cfg.topics.concat(t); syncT(); });
  $$('[data-mod]',v).forEach(b=>b.onclick=()=>{ const ids=T.filter(t=>t.mod===+b.dataset.mod).map(t=>t.id); const all=ids.every(i=>cfg.topics.includes(i)); cfg.topics=all?cfg.topics.filter(x=>!ids.includes(x)):Array.from(new Set(cfg.topics.concat(ids))); syncT(); });
  $$('[data-qt]',v).forEach(b=>b.onclick=()=>{ cfg.topics=b.dataset.qt==='as'?T.filter(t=>t.mod<=4).map(t=>t.id):b.dataset.qt==='all'?T.map(t=>t.id):[]; syncT(); });
  const multi=(id,key)=>$$('#'+id+' [data-v]').forEach(b=>b.onclick=()=>{ const val=b.dataset.v; let a=cfg[key]; a=a.includes(val)?a.filter(x=>x!==val):a.concat(val); if(!a.length) return; cfg[key]=a; $$('#'+id+' [data-v]').forEach(x=>x.setAttribute('aria-pressed',a.includes(x.dataset.v))); store(); avail(); });
  multi('msrc','src'); multi('mtyp','types');
  const single=(id,key)=>$$('#'+id+' [data-v]').forEach(b=>b.onclick=()=>{ cfg[key]=b.dataset.v; $$('#'+id+' [data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b)); store(); avail(); });
  single('mmode','mode'); single('mrev','reveal'); single('mord','order');
  const setMarks=m=>{ cfg.marks=m; $('#mmarks').value=m; $('#mmv').textContent=m; store(); avail(); };
  $('#mmarks').oninput=e=>setMarks(+e.target.value); $$('[data-mk]',v).forEach(b=>b.onclick=()=>setMarks(+b.dataset.mk));
  $('#mtimed').onchange=e=>{ cfg.timed=e.target.checked; store(); avail(); };
  $('#mstart').onclick=()=>{ const qs=pickQs(cfg); if(!qs.length){ toast('No questions match: widen the filters'); return; }
    const total=qs.reduce((a,q)=>a+q.m,0); const id='m'+Date.now().toString(36);
    const title=cfg.topics.length===0||cfg.topics.length===T.length?'Whole course':cfg.topics.length<=3?cfg.topics.map(t=>t+' '+byId[t].title).join(', '):cfg.topics.length+' topics';
    S.mocks.push({id,ts:Date.now(),title,cfg:Object.assign({},cfg),qs:qs.map(q=>q.id),total,limit:cfg.timed?minsFor(total)*60:0,used:0,cur:0,a:{},done:false}); if(S.mocks.length>40) S.mocks=S.mocks.slice(-40); save(); location.hash='mockrun-'+id; };
  $$('[data-del]',v).forEach(b=>b.onclick=e=>{ e.preventDefault(); S.mocks=S.mocks.filter(m=>m.id!==b.dataset.del); save(); viewMock(v); });
  avail();
}
const mockScore=m=>{ let g=0,marked=0; m.qs.forEach(id=>{ const a=m.a[id]; if(a&&a.got!=null){ g+=a.got; marked+=(QI[id]||{}).m||0; } }); return {g,marked}; };
function mockRow(m){ const s=mockScore(m); const d=new Date(m.ts); const pct=m.total?Math.round(s.g/m.total*100):0;
  return `<a class="bk-item" href="#${m.done?'mockres':'mockrun'}-${m.id}"><div class="bk-main"><span class="eyebrow">${d.toLocaleDateString()} · ${m.qs.length} questions · ${m.total} marks${m.limit?' · '+Math.round(m.limit/60)+' min':''}</span><b>${esc(m.title)}</b><span class="muted" style="font-size:.85rem">${m.done?(s.marked<m.total?`Marked ${s.marked} of ${m.total} marks so far`:'Fully marked'):'In progress: tap to carry on'}</span></div><div class="bk-side">${m.done?`<b>${pct}%</b><small>${s.g}/${m.total}</small>`:'<span class="chip warn">Resume</span>'}<button class="iconbtn" data-del="${m.id}" aria-label="Delete this practice test" title="Delete">✕</button></div></a>`; }

function openSheet(){ if(document.getElementById('dspanel')) return; const w=document.createElement('div'); w.id='dspanel'; w.className='dspanel'; w.setAttribute('role','dialog'); w.setAttribute('aria-label','Data sheet');
  w.innerHTML='<div class="dsbox"><div class="dshead"><b>Data sheet</b><span class="muted" style="font-size:.85rem">Your timer keeps running</span><button class="btn btn-sm" id="dsclose">Close</button></div><div class="dsbody"></div></div>';
  document.body.appendChild(w); if(window.TT_SHEET) window.TT_SHEET(w.querySelector('.dsbody'));
  w.querySelectorAll('.dsbody a[href^="#"]').forEach(a=>{ a.removeAttribute('href'); a.style.textDecoration='none'; a.style.color='inherit'; });
  const close=()=>{ w.remove(); document.removeEventListener('keydown',esc_); }; const esc_=e=>{ if(e.key==='Escape') close(); };
  document.addEventListener('keydown',esc_); w.onclick=e=>{ if(e.target===w) close(); }; w.querySelector('#dsclose').onclick=close; w.querySelector('#dsclose').focus(); }
function activeMock(){ return S.mocks.filter(m=>!m.done).sort((a,b)=>b.ts-a.ts)[0]||null; }
function resumeBar(v){ const m=activeMock(); if(!m) return; const qs=m.qs.map(i=>QI[i]).filter(Boolean); const ans=qs.filter(x=>{ const aa=m.a[x.id]||{}; return aa.ch||aa.txt; }).length;
  const bar=document.createElement('div'); bar.className='resbar'; bar.setAttribute('role','status');
  bar.innerHTML=`<div><b>Practice test in progress</b><span class="muted"> · ${esc(m.title)} · ${ans} of ${qs.length} answered · ${m.limit?fmtT(m.limit-m.used)+' left (timer paused)':fmtT(m.used)+' so far (timer paused)'}</span></div><div class="row" style="gap:6px"><a class="btn btn-sm primary" href="#mockrun-${m.id}">Continue test</a><button class="btn btn-sm ghost" id="resdel">Discard</button></div>`;
  v.prepend(bar);
  bar.querySelector('#resdel').onclick=e=>{ const btn=e.currentTarget; if(!btn.dataset.sure){ btn.dataset.sure=1; btn.textContent='Tap again to discard'; return; } S.mocks=S.mocks.filter(x=>x.id!==m.id); save(); bar.remove(); toast('Practice test discarded'); }; }
let timer=null;
function viewMockRun(v,id,cleanupSet){
  const m=S.mocks.find(x=>x.id===id); if(!m){ v.innerHTML='<div class="empty">Practice test not found. <a href="#mock">Practice tests</a></div>'; return; }
  if(m.done){ location.hash='mockres-'+id; return; }
  const qs=m.qs.map(i=>QI[i]).filter(Boolean); const LB=labelsFor(qs);
  let t0=Date.now(), base=m.used;
  const left=()=>m.limit?m.limit-(base+(Date.now()-t0)/1000):null;
  const finish=()=>{ m.used=base+(Date.now()-t0)/1000; m.done=true; m.end=Date.now(); qs.forEach(q=>{ const a=m.a[q.id]; if(q.mcq&&a&&a.ch) a.got=a.ch===q.mcq?q.m:0; }); save(); clearInterval(timer); location.hash='mockres-'+id; };
  const draw=()=>{ const i=m.cur, q=qs[i], a=m.a[q.id]||(m.a[q.id]={});
    v.innerHTML=`<div class="mk-top"><div><span class="eyebrow">Practice test · ${esc(m.title)}</span><h2 style="margin:2px 0 0">Question ${LB.lab[i]} <span class="muted" style="font-size:1rem">of ${LB.count} · ${q.m} mark${q.m===1?'':'s'}</span></h2></div><div class="row"><button class="btn btn-sm" id="dsheet" aria-haspopup="dialog">Data sheet</button><div class="mk-clock ${m.limit?'':'up'}" id="clock" role="timer">--:--</div></div></div>
     <div class="mk-nav" aria-label="Questions">${qs.map((x,j)=>{ const aa=m.a[x.id]||{}; return `<button class="${j===i?'cur':''} ${aa.ch||aa.txt?'ans':''} ${aa.flag?'flag':''}" data-j="${j}" aria-label="Question ${LB.lab[j]}" style="${LB.lab[j].length>2?'width:auto;padding:0 6px':''}">${LB.lab[j]}</button>`; }).join('')}</div>
     <div class="bk-q"><section class="stack"><div class="row" style="gap:6px">${q.t.filter(t=>byId[t]).map(t=>`<span class="chip">${t} ${esc(byId[t].title)}</span>`).join('')}</div>${partNote(q,i>0&&q.pi>0?'Question '+LB.lab[i-1]:'')}${partialNote(q)}${img(q,'q')}
      ${q.mcq?`<div class="mcq-row">${'ABCD'.split('').map(c=>`<button class="btn mcq ${a.ch===c?'sel':''}" data-c="${c}">${c}</button>`).join('')}</div>`:`<label class="muted" for="mans" style="font-size:.8rem">Your answer (or answer on paper and use this for notes)</label><textarea id="mans" placeholder="Write your answer…">${esc(a.txt||'')}</textarea>`}
      <div class="row" style="justify-content:space-between"><button class="btn btn-sm ghost" id="flag">${a.flag?'Unflag':'Flag for review'}</button><div class="row">${i>0?'<button class="btn btn-sm" id="prev">← Previous</button>':''}${i<qs.length-1?'<button class="btn btn-sm primary" id="next">Next →</button>':''}<button class="btn btn-sm ${i===qs.length-1?'primary':''}" id="fin">Finish and mark</button></div></div></section>
      <section class="stack">${m.cfg.reveal==='instant'?`<div class="veil ${a.rev?'':'hidden'}" id="veil"><div class="vin"><div class="ms"><div class="ms-head"><h4>Mark scheme</h4><span class="chip">${q.m} mark${q.m===1?'':'s'}</span></div>${q.mw?img(q,'m'):'<p class="muted">Open this mark scheme on PMT.</p>'}${q.mcq?'':`<div class="selfmark"><b>Self-mark:</b><input type="number" id="mgot" min="0" max="${q.m}" value="${a.got??''}" inputmode="numeric"><span>/ ${q.m}</span><span class="muted" id="mgotMsg" aria-live="polite">${a.got!=null?'Saved ✓':''}</span></div>`}</div></div><div class="vbtn"><button class="btn primary" id="mrev">Check this question</button></div></div>`:`<div class="card"><span class="eyebrow">Exam conditions</span><p style="margin:6px 0 0;font-size:.92rem">Mark schemes appear when you finish. Aim for about ${minsFor(q.m)} minute${minsFor(q.m)===1?'':'s'} on this question. Flag anything you want to come back to.</p></div>`}
      <div class="card"><span class="eyebrow">Progress</span><p style="margin:6px 0 0;font-size:.92rem">${qs.filter(x=>{ const aa=m.a[x.id]||{}; return aa.ch||aa.txt; }).length} of ${qs.length} answered · ${qs.filter(x=>(m.a[x.id]||{}).flag).length} flagged</p></div></section></div>`;
    fill(v);
    $$('.mk-nav [data-j]',v).forEach(b=>b.onclick=()=>{ m.cur=+b.dataset.j; save(); draw(); });
    $$('[data-c]',v).forEach(b=>b.onclick=()=>{ a.ch=b.dataset.c; save(); $$('[data-c]',v).forEach(x=>x.classList.toggle('sel',x===b)); $$('.mk-nav button')[i].classList.add('ans'); });
    const ta=$('#mans'); if(ta) ta.oninput=()=>{ a.txt=ta.value; save(); $$('.mk-nav button')[i].classList.toggle('ans',!!ta.value); };
    $('#flag').onclick=()=>{ a.flag=!a.flag; save(); draw(); };
    $('#dsheet').onclick=openSheet;
    const p=$('#prev'); if(p) p.onclick=()=>{ m.cur--; save(); draw(); }; const n=$('#next'); if(n) n.onclick=()=>{ m.cur++; save(); draw(); };
    $('#fin').onclick=e=>{ const un=qs.filter(x=>{ const aa=m.a[x.id]||{}; return !(aa.ch||aa.txt); }).length; const btn=e.currentTarget; if(un&&!btn.dataset.sure){ btn.dataset.sure=1; btn.textContent=`${un} unanswered: tap again to finish`; btn.classList.add('primary'); return; } finish(); };
    const mr=$('#mrev'); if(mr) mr.onclick=()=>{ a.rev=1; if(q.mcq&&a.ch) a.got=a.ch===q.mcq?q.m:0; save(); $('#veil').classList.remove('hidden'); fill(v); };
    const mg=$('#mgot'); if(mg) mg.oninput=()=>{ const g=parseInt(mg.value,10); a.got=isNaN(g)?null:Math.max(0,Math.min(q.m,g)); if(a.got!=null&&a.got!==g) mg.value=a.got;
      if(a.got!=null) S.bank[q.id]=Object.assign(S.bank[q.id]||{},{got:a.got,ts:Date.now(),rev:1}); saveNow(); const msg=$('#mgotMsg'); if(msg) msg.textContent=a.got!=null?'Saved ✓':''; };
    tick();
  };
  const tick=()=>{ const c=$('#clock'); if(!c) return; if(m.limit){ const l=left(); c.textContent=fmtT(l); c.classList.toggle('low',l<300); if(l<=0){ toast('Time is up'); finish(); } } else c.textContent=fmtT(base+(Date.now()-t0)/1000); };
  clearInterval(timer); timer=setInterval(()=>{ tick(); m.used=base+(Date.now()-t0)/1000; },1000);
  const stop=()=>{ clearInterval(timer); m.used=base+(Date.now()-t0)/1000; save(); };
  draw(); return stop;
}
const GR=[[80,'A*'],[70,'A'],[60,'B'],[50,'C'],[40,'D'],[30,'E'],[0,'U']];
function viewMockRes(v,id){
  const m=S.mocks.find(x=>x.id===id); if(!m){ v.innerHTML='<div class="empty">Practice test not found. <a href="#mock">Practice tests</a></div>'; return; }
  const qs=m.qs.map(i=>QI[i]).filter(Boolean); const LB=labelsFor(qs);
  const draw=()=>{ const s=mockScore(m); const pct=m.total?Math.round(s.g/m.total*100):0; const g=(GR.find(x=>pct>=x[0])||[0,'U'])[1];
    const tp={}; qs.forEach(q=>{ const a=m.a[q.id]||{}; if(a.got==null) return; const t=q.t[0]; const x=tp[t]||(tp[t]={g:0,m:0}); x.g+=a.got; x.m+=q.m; });
    v.innerHTML=`<span class="eyebrow"><a href="#mock">Practice tests</a> / ${esc(m.title)}</span><h1>Results</h1>
    <div class="grid g3" style="margin:12px 0 18px"><div class="card stat"><b>${s.g}<small>/${m.total}</small></b><span>marks${s.marked<m.total?` (${m.total-s.marked} still to mark)`:''}</span></div><div class="card stat"><b>${pct}%</b><span>rough grade ${g} · grade boundaries change every year</span></div><div class="card stat"><b>${fmtT(m.used)}</b><span>time used${m.limit?' of '+fmtT(m.limit):''}</span></div></div>
    ${Object.keys(tp).length?`<div class="card"><span class="eyebrow">By topic</span>${Object.entries(tp).sort((a,b)=>a[0].localeCompare(b[0])).map(([t,x])=>`<div class="tbar"><span>${t} ${esc((byId[t]||{}).title||'')}</span><div class="bar"><i style="width:${x.g/x.m*100}%"></i></div><b>${x.g}/${x.m}</b></div>`).join('')}</div>`:''}
    <div class="row" style="margin:18px 0 8px;justify-content:space-between"><h2 style="margin:0">Review and mark</h2><div class="row"><button class="btn btn-sm" id="openall">Show all mark schemes</button><a class="btn btn-sm primary" href="#mock">New practice test</a></div></div>
    <p class="muted" style="margin:0 0 12px">Multiple choice is marked for you. For each structured question, compare your answer with the official mark scheme and enter your mark.</p>
    <div class="stack" id="rv">${qs.map((q,i)=>{ const a=m.a[q.id]||{}; return `<details class="card rv" data-q="${q.id}" ${i===0?'open':''}><summary><b>Q${LB.lab[i]}</b> <span class="muted">${esc(qLabel(q))}</span><span class="rv-s">${a.got!=null?`<span class="chip ${a.got/q.m>=0.7?'good':a.got/q.m>=0.4?'warn':'bad'}">${a.got}/${q.m}</span>`:`<span class="chip warn">Mark me · ${q.m}</span>`}</span></summary>
      <div class="bk-q" style="margin-top:12px"><section class="stack">${partialNote(q)}${img(q,'q')}${q.mcq?`<p>Your answer: <b>${a.ch||'none'}</b> · correct answer: <b>${q.mcq}</b></p>`:`<div class="yours"><span class="eyebrow">Your answer</span><p>${a.txt?esc(a.txt).replace(/\n/g,'<br>'):'<span class="muted">No typed answer (you may have answered on paper).</span>'}</p></div>`}${q.wr?'':`<div class="row pmt-links"><a class="btn btn-sm ghost" href="${esc(pmtQ(q))}" target="_blank" rel="noopener">Question on PMT ↗</a><a class="btn btn-sm ghost" href="${esc(pmtM(q))}" target="_blank" rel="noopener">Mark scheme on PMT ↗</a></div>`}</section>
      <section class="stack"><div class="ms"><div class="ms-head"><h4>Mark scheme</h4><span class="chip">${q.m} mark${q.m===1?'':'s'}</span></div>${q.mw?img(q,'m'):'<p class="muted">Open this mark scheme on PMT.</p>'}
       ${q.mcq?'':`<div class="selfmark"><b>Your mark:</b><input type="number" class="rvgot" min="0" max="${q.m}" value="${a.got??''}" aria-label="Marks for question ${LB.lab[i]}" inputmode="numeric"><span>/ ${q.m}</span><span class="muted rvsaved" aria-live="polite">${a.got!=null?'Saved ✓':''}</span></div>`}
       </div></section></div></details>`; }).join('')}</div>`;
    const lazy=d=>{ if(d.open) fill(d); };
    $$('details.rv',v).forEach(d=>{ d.addEventListener('toggle',()=>lazy(d)); lazy(d);
      const q=QI[d.dataset.q]; const a=m.a[q.id]||(m.a[q.id]={});
      const inp=$('.rvgot',d); if(inp){ inp.oninput=()=>{ const g=parseInt(inp.value,10); a.got=isNaN(g)?null:Math.max(0,Math.min(q.m,g)); if(a.got!=null&&a.got!==g) inp.value=a.got; S.bank[q.id]=Object.assign(S.bank[q.id]||{},{got:a.got,ts:Date.now(),rev:1}); saveNow(); const sm=$('.rvsaved',d); if(sm) sm.textContent=a.got!=null?'Saved ✓':''; };
        inp.onchange=()=>{ const y=window.scrollY; const open=$$('details.rv',v).filter(x=>x.open).map(x=>x.dataset.q); draw(); $$('details.rv',v).forEach(x=>{ if(open.includes(x.dataset.q)){ x.open=true; fill(x); } }); window.scrollTo(0,y); }; }
    });
    $('#openall').onclick=()=>$$('details.rv',v).forEach(d=>{ d.open=true; fill(d); });
  };
  // record MCQ results into the bank history once
  if(!m.logged){ qs.forEach(q=>{ const a=m.a[q.id]; if(a&&a.got!=null) S.bank[q.id]=Object.assign(S.bank[q.id]||{},{got:a.got,ts:Date.now(),rev:1}); }); m.logged=true; save(); }
  draw();
}
const topicCount=id=>Q.filter(q=>q.t.includes(id)).length;
const score=id=>{ let got=0,max=0,n=0; Q.forEach(q=>{ const r=S.bank[q.id]; if(!r||r.got==null) return; if(id&&!q.t.includes(id)) return; got+=r.got; max+=q.m||1; n++; }); return {got,max,n}; };
return {viewBank,viewBankQ,viewMock,viewMockRun,viewMockRes,topicCount,score,resumeBar,count:Q.length};
};
})();
