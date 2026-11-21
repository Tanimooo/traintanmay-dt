/* TrainTanmay Chemistry: the pages that aren't in the Physics app.
   #drills / #drill-<id>  calculation drills (data in js/drills.js)
   #rxmap                 organic reaction map with a reagents quiz
   #spec                  spectroscopy practice: identify the compound from IR, MS and NMR data
   Progress: localStorage tt-chem-extras-v1. */
(function(){
'use strict';
const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='tt-chem-extras-v1';
let S={drills:{},rx:{seen:0,right:0},spec:{}};
try{ const r=localStorage.getItem(KEY); if(r) S=Object.assign(S,JSON.parse(r)); }catch(e){}
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} };
const MODN={'1':'Practical skills','2':'Foundations','3':'Periodic table and energy','4':'Core organic','5':'Physical and transition','6':'Organic and analysis'};

/* ================= CALCULATION DRILLS ================= */
function drills(v){
  const DR=window.CHEMDRILLS, mods=[...new Set(DR.list.map(d=>d.topic[0]))].sort();
  const stat=id=>S.drills[id]||{n:0,ok:0,streak:0};
  v.innerHTML=`<span class="eyebrow">Practise</span><h1>Calculation drills</h1><p class="muted" style="max-width:76ch">${DR.list.length} types of calculation from across the course. Every question has new numbers, is marked straight away, and shows a full worked solution, so you can keep going until the method is automatic. Give answers to 3 significant figures (pH to 2 decimal places). You can type standard form as 1.2e-3 or 1.2x10^-3.</p>
  <div class="row" style="margin:10px 0 18px"><a class="btn primary" href="#drill-mixed">Mixed practice</a></div>
  <div class="stack" style="gap:24px">${mods.map(m=>`<section class="mod"><div class="mod-head"><span class="mnum">${m}</span><h2>${esc(MODN[m])}</h2></div><div class="grid g3">${DR.list.filter(d=>d.topic[0]===m).map(d=>{ const s=stat(d.id); return `<a class="tcard" href="#drill-${d.id}"><span class="id">${d.topic}</span><h4>${esc(d.title)}</h4><p>${esc(d.desc)}</p><div class="meta"><span>${s.n?`${s.ok}/${s.n} correct`:'Not tried yet'}</span><span>${s.streak>=3?'🔥 '+s.streak:''}</span></div></a>`; }).join('')}</div></section>`).join('')}</div>`;
}
function drill(v,id){
  const DR=window.CHEMDRILLS, mixed=id==='mixed', d0=DR.byId[id];
  if(!mixed&&!d0){ v.innerHTML='<div class="empty">Drill not found. <a href="#drills">All drills</a></div>'; return; }
  let d, Q, done=false, sess={n:0,ok:0};
  v.innerHTML=`<div class="tp-head"><div><span class="eyebrow"><a href="#drills">Calculation drills</a>${mixed?'':' / '+d0.topic}</span><h1>${mixed?'Mixed practice':esc(d0.title)}</h1><p class="muted" style="margin:6px 0 0">${mixed?'A random calculation from anywhere in the course each time.':esc(d0.desc)}</p></div><div class="row"><span class="chip" id="dsess">This session: 0/0</span>${mixed?'':`<a class="btn btn-sm" href="#t-${d0.topic}">Topic notes</a>`}</div></div>
  <div class="card" id="dcard" style="max-width:860px"><div id="dq" style="font-size:1.05rem;line-height:1.6"></div>
  <form id="dform" class="row" style="margin-top:14px;align-items:flex-end;gap:10px" autocomplete="off"><label class="field" style="flex:1;min-width:200px">Your answer<input id="dans" inputmode="decimal" spellcheck="false" aria-describedby="dunit"></label><span id="dunit" class="muted" style="padding-bottom:10px"></span><button class="btn primary" id="dgo" type="submit">Check</button><button class="btn" type="button" id="dskip">Show solution</button></form>
  <div id="dfb" aria-live="polite"></div></div>`;
  const next=()=>{ d=mixed?DR.list[Math.floor(Math.random()*DR.list.length)]:d0; Q=d.gen(); done=false;
    $('#dq',v).innerHTML=(mixed?`<span class="eyebrow">${d.topic} · ${esc(d.title)}</span><br>`:'')+Q.q; $('#dunit',v).textContent=Q.unit||''; $('#dans',v).value=''; $('#dans',v).inputMode=d.text?'text':'decimal'; $('#dfb',v).innerHTML=''; $('#dgo',v).textContent='Check'; $('#dskip',v).hidden=false; $('#dans',v).focus(); };
  const reveal=(ok)=>{ done=true; const st=S.drills[d.id]=S.drills[d.id]||{n:0,ok:0,streak:0}; st.n++; sess.n++; if(ok){ st.ok++; sess.ok++; st.streak++; } else st.streak=0; save();
    $('#dsess',v).textContent=`This session: ${sess.ok}/${sess.n}`;
    $('#dfb',v).innerHTML=`<div class="${ok?'chip good':'chip bad'}" style="margin:14px 0 6px;display:inline-block">${ok?'Correct':'Not quite'}: the answer is ${esc(DR.showAns(d,Q))}${Q.unit&&Q.unit!=='(no units)'?' '+esc(Q.unit):''}</div><div class="wex"><p><strong>Worked solution</strong></p>${Q.steps.map(s=>`<p>${s}</p>`).join('')}</div>`;
    $('#dgo',v).textContent='Next question'; $('#dskip',v).hidden=true; $('#dgo',v).focus(); };
  $('#dform',v).onsubmit=e=>{ e.preventDefault(); if(done){ next(); return; } const raw=$('#dans',v).value; if(!raw.trim()){ $('#dans',v).focus(); return; }
    const r=DR.check(d,Q,raw); if(r===null){ $('#dfb',v).innerHTML=`<p class="muted" style="margin:10px 0 0">${d.text?'Type a formula like C2H6O.':'Type a number, e.g. 0.0125, 1.25e-2 or −57.1.'}</p>`; return; } reveal(r); };
  $('#dskip',v).onclick=()=>reveal(false);
  next();
}

/* ================= ORGANIC REACTION MAP ================= */
const NODES={
 alkane:['Alkane',90,60],halo:['Haloalkane',300,60],nitrile:['Nitrile',510,60],amine:['Amine',720,60],amide:['Amide',930,60],
 dihalo:['Dihaloalkane',90,170],alkene:['Alkene',300,170],alc1:['1° alcohol',510,170],ald:['Aldehyde',720,170],hn:['Hydroxynitrile',930,170],
 poly:['Poly(alkene)',90,280],alc2:['2° alcohol',300,280],ketone:['Ketone',510,280],acid:['Carboxylic acid',720,280],acyl:['Acyl chloride',930,280],
 salt:['Carboxylate salt',510,390],ester:['Ester',720,390],amsalt:['Ammonium salt',930,390],
 halobz:['Halobenzene',90,500],benzene:['Benzene',300,500],nitro:['Nitrobenzene',510,500],phenam:['Phenylamine',720,500],
 alkbz:['Alkylbenzene',90,610],phket:['Aromatic ketone',300,610],phenol:['Phenol',510,610],tbp:['2,4,6-tribromophenol',720,610],phester:['Phenyl ester',930,610]};
const EDGES=[
 ['alkane','halo','X₂ (Cl₂ or Br₂)','UV light','radical substitution','4.1.2'],
 ['alkene','alkane','H₂','nickel catalyst, 150 °C','addition (hydrogenation)','4.1.3'],
 ['alkene','dihalo','X₂ (e.g. Br₂)','room temperature','electrophilic addition','4.1.3'],
 ['alkene','halo','HX (e.g. HBr)','room temperature','electrophilic addition','4.1.3'],
 ['alkene','alc1','H₂O(g) (steam)','H₃PO₄ catalyst, ~300 °C, 6–7 MPa (ethene gives ethanol)','addition (hydration)','4.1.3'],
 ['alkene','alc2','H₂O(g) (steam)','H₃PO₄ catalyst; propene gives mainly propan-2-ol (Markownikoff)','addition (hydration)','4.1.3'],
 ['alkene','poly','—','high pressure and/or a catalyst','addition polymerisation','4.1.3'],
 ['alc1','alkene','conc. H₃PO₄ or conc. H₂SO₄','heat','elimination (dehydration)','4.2.1'],
 ['alc2','alkene','conc. H₃PO₄ or conc. H₂SO₄','heat','elimination (dehydration)','4.2.1'],
 ['alc1','halo','NaBr + conc. H₂SO₄ (makes HBr)','heat','substitution','4.2.1'],
 ['halo','alc1','NaOH(aq)','heat under reflux','nucleophilic substitution (hydrolysis)','4.2.2'],
 ['halo','amine','excess NH₃ in ethanol','heat','nucleophilic substitution','6.2.1'],
 ['halo','nitrile','NaCN or KCN in ethanol','heat under reflux','nucleophilic substitution (adds one carbon)','6.2.4'],
 ['alc1','ald','K₂Cr₂O₇ / H₂SO₄','heat, distil the aldehyde off as it forms','oxidation','4.2.1'],
 ['alc1','acid','excess K₂Cr₂O₇ / H₂SO₄','heat under reflux','oxidation','4.2.1'],
 ['alc2','ketone','K₂Cr₂O₇ / H₂SO₄','heat under reflux','oxidation','4.2.1'],
 ['ald','acid','K₂Cr₂O₇ / H₂SO₄','heat under reflux','oxidation','6.1.2'],
 ['ald','alc1','NaBH₄(aq)','room temperature (warm)','reduction (nucleophilic addition)','6.1.2'],
 ['ketone','alc2','NaBH₄(aq)','room temperature (warm)','reduction (nucleophilic addition)','6.1.2'],
 ['ald','hn','NaCN + H₂SO₄ (HCN)','room temperature','nucleophilic addition (adds one carbon)','6.1.2'],
 ['ketone','hn','NaCN + H₂SO₄ (HCN)','room temperature','nucleophilic addition (adds one carbon)','6.1.2'],
 ['nitrile','amine','H₂','nickel catalyst','reduction','6.2.4'],
 ['nitrile','acid','dilute HCl(aq)','heat under reflux','hydrolysis','6.2.4'],
 ['acid','ester','alcohol + conc. H₂SO₄ catalyst','warm (reversible)','esterification','6.1.3'],
 ['acid','acyl','SOCl₂ (thionyl chloride)','room temperature','substitution','6.1.3'],
 ['acid','salt','NaOH, Na₂CO₃, metal or metal oxide','room temperature','neutralisation (or redox with a metal)','6.1.3'],
 ['acyl','acid','water','room temperature','hydrolysis (vigorous, misty HCl fumes)','6.1.3'],
 ['acyl','ester','alcohol','room temperature','esterification (not reversible)','6.1.3'],
 ['acyl','amide','NH₃ (→ primary amide) or a primary amine (→ secondary amide)','room temperature','substitution','6.1.3'],
 ['amine','amide','acyl chloride','room temperature','substitution','6.2.2'],
 ['amine','amsalt','acid, e.g. HCl','room temperature','neutralisation (amine acts as a base)','6.2.1'],
 ['ester','acid','dilute H₂SO₄ or HCl','heat under reflux (reversible; alcohol also formed)','acid hydrolysis','6.1.3'],
 ['ester','salt','NaOH(aq)','heat under reflux (alcohol also formed)','alkaline hydrolysis','6.1.3'],
 ['benzene','nitro','conc. HNO₃ + conc. H₂SO₄','50 °C','electrophilic substitution (nitration)','6.1.1'],
 ['nitro','phenam','Sn + conc. HCl, then NaOH(aq)','heat under reflux','reduction','6.2.1'],
 ['benzene','halobz','X₂ + halogen carrier (FeBr₃, AlCl₃ or Fe)','room temperature','electrophilic substitution (halogenation)','6.1.1'],
 ['benzene','alkbz','haloalkane + AlCl₃','room temperature','Friedel–Crafts alkylation','6.2.4'],
 ['benzene','phket','acyl chloride + AlCl₃','room temperature','Friedel–Crafts acylation','6.2.4'],
 ['phenol','tbp','bromine water','room temperature, no catalyst','electrophilic substitution (white precipitate)','6.1.1'],
 ['phenol','phester','acyl chloride (or acid anhydride)','room temperature','esterification','6.1.3']];
function rxmap(v){
  let sel=null;
  const NW=136, NH=40;
  v.innerHTML=`<span class="eyebrow">Organic synthesis</span><h1>Reaction map</h1><p class="muted" style="max-width:78ch">Every reaction in OCR A organic chemistry on one map. Tap a compound type to see what it can be turned into (orange) and how it can be made (purple), with reagents, conditions and the type of reaction. Then test yourself with the quiz.</p>
  <div class="subtabs" role="group" aria-label="Mode"><button aria-pressed="true" data-m="map">Map</button><button aria-pressed="false" data-m="quiz">Quiz: reagents and conditions</button></div>
  <div id="rxbody"></div>`;
  const body=$('#rxbody',v);
  const mapView=()=>{
    body.innerHTML=`<div class="card" style="padding:8px;overflow-x:auto"><svg class="rxsvg" viewBox="0 0 1020 650" style="width:100%;min-width:760px;height:auto;display:block" role="group" aria-label="Organic reaction map">
    <defs><marker id="rxa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
    <g id="rxe"></g><g id="rxn"></g></svg></div><div id="rxinfo" class="card" style="margin-top:14px"><p class="muted" style="margin:0">Tap a compound on the map.</p></div>`;
    const eG=$('#rxe',body), nG=$('#rxn',body);
    const pt=(a,b)=>{ const [,x1,y1]=NODES[a],[,x2,y2]=NODES[b]; const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1; const ux=dx/L, uy=dy/L;
      const cut=(ux,uy)=>Math.min(Math.abs((NW/2+4)/(ux||1e-9)),Math.abs((NH/2+4)/(uy||1e-9)));
      const c=cut(ux,uy); return [x1+ux*c,y1+uy*c,x2-ux*c,y2-uy*c]; };
    const draw=()=>{ eG.innerHTML=EDGES.map((e,i)=>{ const [x1,y1,x2,y2]=pt(e[0],e[1]); const out=sel&&e[0]===sel, inn=sel&&e[1]===sel; const col=out?'var(--brand)':inn?'var(--accent)':'var(--line-strong)';
        const off=EDGES.some(f=>f[0]===e[1]&&f[1]===e[0])?6:0; const nx=-(y2-y1), ny=(x2-x1), nl=Math.hypot(nx,ny)||1; const ox=nx/nl*off, oy=ny/nl*off;
        return `<line x1="${x1+ox}" y1="${y1+oy}" x2="${x2+ox}" y2="${y2+oy}" style="color:${col};stroke:${col};stroke-width:${out||inn?2.6:1.3};opacity:${sel&&!out&&!inn?.25:1}" marker-end="url(#rxa)"/>`; }).join('');
      nG.innerHTML=Object.entries(NODES).map(([k,[l,x,y]])=>{ const on=k===sel, rel=sel&&EDGES.some(e=>(e[0]===sel&&e[1]===k)||(e[1]===sel&&e[0]===k));
        return `<g class="rxnode" data-k="${k}" tabindex="0" role="button" aria-label="${esc(l)}" style="cursor:pointer;opacity:${sel&&!on&&!rel?.45:1}"><rect x="${x-NW/2}" y="${y-NH/2}" width="${NW}" height="${NH}" rx="10" style="fill:${on?'var(--brand)':'var(--surface)'};stroke:${on?'var(--brand)':'var(--line-strong)'};stroke-width:1.5"/><text x="${x}" y="${y+5}" text-anchor="middle" style="font:600 13px var(--f-body);fill:${on?'var(--brand-ink)':'var(--ink)'}">${esc(l)}</text></g>`; }).join('');
      $$('.rxnode',nG).forEach(g=>{ g.onclick=()=>pick(g.dataset.k); g.onkeydown=e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(g.dataset.k); } }; }); };
    const row=e=>`<tr><td><b>${esc(NODES[e[0]][0])} → ${esc(NODES[e[1]][0])}</b></td><td>${esc(e[2])}</td><td>${esc(e[3])}</td><td>${esc(e[4])}</td><td><a href="#t-${e[5]}">${e[5]}</a></td></tr>`;
    const pick=k=>{ sel=sel===k?null:k; draw(); const info=$('#rxinfo',body); if(!sel){ info.innerHTML='<p class="muted" style="margin:0">Tap a compound on the map.</p>'; return; }
      const out=EDGES.filter(e=>e[0]===sel), inn=EDGES.filter(e=>e[1]===sel), hd='<tr><th>Reaction</th><th>Reagents</th><th>Conditions</th><th>Type</th><th>Topic</th></tr>';
      info.innerHTML=`<h3 style="margin:0 0 6px">${esc(NODES[sel][0])}</h3>${out.length?`<h4 style="margin:12px 0 4px;color:var(--brand)">Turns into</h4><div class="tbl"><table>${hd}${out.map(row).join('')}</table></div>`:''}${inn.length?`<h4 style="margin:12px 0 4px;color:var(--accent)">Made from</h4><div class="tbl"><table>${hd}${inn.map(row).join('')}</table></div>`:''}`; };
    draw();
  };
  const quizView=()=>{
    let e=null, shown=false;
    const ask=()=>{ e=EDGES[Math.floor(Math.random()*EDGES.length)]; shown=false;
      body.innerHTML=`<div class="card" style="max-width:760px"><span class="eyebrow">Score ${S.rx.right}/${S.rx.seen}</span><h2 style="margin:6px 0 10px">${esc(NODES[e[0]][0])} → ${esc(NODES[e[1]][0])}</h2><p>What are the <b>reagents</b> and <b>conditions</b>, and what <b>type of reaction</b> is it? Say or write your answer, then check.</p>
      <textarea class="field" style="width:100%;min-height:70px;font:inherit;padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink)" placeholder="Your answer (optional)"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn primary" id="rxshow">Show answer</button></div><div id="rxans"></div></div>`;
      $('#rxshow',body).onclick=()=>{ if(shown) return; shown=true; $('#rxshow',body).remove();
        $('#rxans',body).innerHTML=`<div class="wex"><p><b>Reagents:</b> ${esc(e[2])}</p><p><b>Conditions:</b> ${esc(e[3])}</p><p><b>Type:</b> ${esc(e[4])} <span class="muted">(topic <a href="#t-${e[5]}">${e[5]}</a>)</span></p></div><div class="row"><button class="btn" data-r="1">I got it</button><button class="btn ghost" data-r="0">Not yet</button></div>`;
        $$('[data-r]',body).forEach(b=>b.onclick=()=>{ S.rx.seen++; if(b.dataset.r==='1') S.rx.right++; save(); ask(); }); }; };
    ask();
  };
  $$('.subtabs button',v).forEach(b=>b.onclick=()=>{ $$('.subtabs button',v).forEach(x=>x.setAttribute('aria-pressed',x===b)); b.dataset.m==='map'?mapView():quizView(); });
  mapView();
}

/* ================= SPECTROSCOPY PRACTICE ================= */
const SPQ=[
 {f:'C₃H₆O',ms:'M⁺ 58; fragment at 43',ir:'1715 (strong); no broad absorption above 3000',c:'2 peaks: 206, 30',h:[['2.2','6H','singlet']],o:['propanal','propanone','propan-1-ol','prop-2-en-1-ol'],a:1,x:'C=O at 1715 and no O–H: aldehyde or ketone. Only one ¹H environment (6H singlet) means two identical CH₃ groups with no neighbouring H: CH₃COCH₃. An aldehyde would show a peak near 9.8 ppm. m/z 43 is CH₃CO⁺.'},
 {f:'C₃H₆O',ms:'M⁺ 58; fragments at 29, 57',ir:'1730 (strong); 2720 (weak, aldehyde C–H)',c:'3 peaks: 203, 37, 6',h:[['9.8','1H','triplet'],['2.5','2H','multiplet'],['1.1','3H','triplet']],o:['propanal','propanone','propan-1-ol','prop-2-en-1-ol'],a:0,x:'C=O and a peak at 9.8 ppm (–CHO): an aldehyde. The 3H triplet and the CH₂ next to the CHO fit CH₃CH₂CHO. m/z 29 is CHO⁺ or C₂H₅⁺.'},
 {f:'C₂H₆O',ms:'M⁺ 46; fragments at 31, 45',ir:'3350 (broad); 1050',c:'2 peaks: 58, 18',h:[['1.2','3H','triplet'],['3.7','2H','quartet'],['2.6','1H','singlet, disappears with D₂O']],o:['ethanol','methoxymethane','ethanal','ethane-1,2-diol'],a:0,x:'Broad O–H at 3350: an alcohol. Triplet (3H) + quartet (2H) is an ethyl group; the CH₂ at 3.7 ppm is bonded to O. The singlet that disappears with D₂O is the O–H. CH₃CH₂OH.'},
 {f:'C₂H₆O',ms:'M⁺ 46; fragment at 45, 29',ir:'no broad absorption; 1100 (C–O)',c:'1 peak: 60',h:[['3.3','6H','singlet']],o:['ethanol','methoxymethane','ethanal','ethane-1,2-diol'],a:1,x:'No O–H and no C=O but C–O present: an ether. One carbon and one proton environment: two identical CH₃ groups on O. CH₃OCH₃.'},
 {f:'C₄H₈O₂',ms:'M⁺ 88; fragment at 43',ir:'1740 (strong); 1240; no broad O–H',c:'4 peaks: 171, 60, 21, 14',h:[['2.0','3H','singlet'],['4.1','2H','quartet'],['1.2','3H','triplet']],o:['ethyl ethanoate','methyl propanoate','butanoic acid','propyl methanoate'],a:0,x:'C=O and C–O, no O–H: an ester. The quartet at 4.1 ppm means a CH₂ on the oxygen side, next to a CH₃ (triplet). The CH₃ singlet at 2.0 ppm is next to C=O. CH₃COOCH₂CH₃.'},
 {f:'C₄H₈O₂',ms:'M⁺ 88; fragments at 57, 59',ir:'1740 (strong); 1200; no broad O–H',c:'4 peaks: 175, 52, 27, 9',h:[['3.7','3H','singlet'],['2.3','2H','quartet'],['1.1','3H','triplet']],o:['ethyl ethanoate','methyl propanoate','butanoic acid','propyl methanoate'],a:1,x:'An ester again, but now the singlet (3H) is at 3.7 ppm: a CH₃ on oxygen (–OCH₃). The quartet at 2.3 ppm is a CH₂ next to C=O and next to a CH₃. CH₃CH₂COOCH₃.'},
 {f:'C₄H₈O₂',ms:'M⁺ 88; fragments at 45, 60',ir:'2500–3300 (very broad); 1710 (strong)',c:'4 peaks: 180, 36, 18, 14',h:[['11.5','1H','singlet'],['2.3','2H','triplet'],['1.7','2H','sextet'],['1.0','3H','triplet']],o:['ethyl ethanoate','methyl propanoate','butanoic acid','propyl methanoate'],a:2,x:'Very broad O–H plus C=O: a carboxylic acid; the 11.5 ppm singlet is the COOH. CH₂ (triplet) next to C=O, CH₂ (sextet, 5 neighbours), CH₃ (triplet): a propyl chain. CH₃CH₂CH₂COOH.'},
 {f:'C₃H₈O',ms:'M⁺ 60; fragment at 45',ir:'3350 (broad)',c:'2 peaks: 64, 25',h:[['1.2','6H','doublet'],['4.0','1H','septet'],['2.2','1H','singlet, disappears with D₂O']],o:['propan-1-ol','propan-2-ol','methoxyethane','propanone'],a:1,x:'Broad O–H: an alcohol. Only 2 carbon environments, and a 6H doublet with a 1H septet: two equivalent CH₃ groups on a CH. CH₃CH(OH)CH₃. The fragment at 45 is CH₃CHOH⁺.'},
 {f:'C₃H₈O',ms:'M⁺ 60; fragment at 31',ir:'3330 (broad)',c:'3 peaks: 64, 26, 10',h:[['0.9','3H','triplet'],['1.6','2H','sextet'],['3.6','2H','triplet'],['2.3','1H','singlet, disappears with D₂O']],o:['propan-1-ol','propan-2-ol','methoxyethane','propanone'],a:0,x:'An alcohol with three carbon environments. The CH₂ at 3.6 ppm is bonded to O and is a triplet (next to a CH₂). The fragment at 31 is CH₂OH⁺, typical of a primary alcohol. CH₃CH₂CH₂OH.'},
 {f:'C₃H₈O',ms:'M⁺ 60; fragments at 45, 29',ir:'no broad O–H; 1120 (C–O)',c:'3 peaks: 68, 58, 15',h:[['3.3','3H','singlet'],['3.4','2H','quartet'],['1.2','3H','triplet']],o:['propan-1-ol','propan-2-ol','methoxyethane','propanone'],a:2,x:'No O–H, no C=O: an ether. A CH₃ singlet on O (3.3 ppm) and an ethyl group whose CH₂ is on O (quartet at 3.4). CH₃OCH₂CH₃.'},
 {f:'C₈H₈O',ms:'M⁺ 120; fragments at 105, 77',ir:'1690 (strong)',c:'6 peaks: 198, 137, 133, 128.6, 128.3, 27',h:[['7.4–8.0','5H','multiplet'],['2.6','3H','singlet']],o:['phenylethanone','phenylethanal','4-methylbenzaldehyde','methyl benzoate'],a:0,x:'C=O and five aromatic H (a C₆H₅ group). The CH₃ singlet at 2.6 ppm is next to C=O. No aldehyde peak near 10 ppm. m/z 105 is C₆H₅CO⁺ and 77 is C₆H₅⁺. C₆H₅COCH₃.'},
 {f:'C₂H₄O₂',ms:'M⁺ 60; fragments at 45, 43',ir:'2500–3300 (very broad); 1710',c:'2 peaks: 178, 21',h:[['11.5','1H','singlet'],['2.1','3H','singlet']],o:['ethanoic acid','methyl methanoate','hydroxyethanal','ethane-1,2-diol'],a:0,x:'Very broad O–H with C=O: a carboxylic acid (COOH at 11.5 ppm). A CH₃ singlet next to C=O. CH₃COOH.'},
 {f:'C₂H₄O₂',ms:'M⁺ 60; fragments at 31, 29',ir:'1725; 1200; no broad O–H',c:'2 peaks: 161, 51',h:[['8.1','1H','singlet'],['3.7','3H','singlet']],o:['ethanoic acid','methyl methanoate','hydroxyethanal','ethane-1,2-diol'],a:1,x:'C=O and C–O without O–H: an ester. The H at 8.1 ppm is H–C(=O)–O (a methanoate); the 3H singlet at 3.7 is –OCH₃. HCOOCH₃.'},
 {f:'C₄H₁₀O',ms:'M⁺ 74; fragment at 59',ir:'3370 (broad)',c:'2 peaks: 69, 31',h:[['1.3','9H','singlet'],['1.6','1H','singlet, disappears with D₂O']],o:['butan-1-ol','butan-2-ol','2-methylpropan-2-ol','ethoxyethane'],a:2,x:'An alcohol with only two carbon environments and three equivalent CH₃ groups (9H singlet, no neighbouring H). (CH₃)₃COH, a tertiary alcohol: it would not be oxidised by acidified dichromate.'},
 {f:'C₄H₁₀O',ms:'M⁺ 74; fragments at 59, 29',ir:'no broad O–H; 1120 (C–O)',c:'2 peaks: 66, 15',h:[['3.5','4H','quartet'],['1.2','6H','triplet']],o:['butan-1-ol','butan-2-ol','2-methylpropan-2-ol','ethoxyethane'],a:3,x:'An ether with two identical ethyl groups: one quartet (CH₂ on O) and one triplet, in a 4 : 6 ratio. CH₃CH₂OCH₂CH₃.'},
 {f:'C₃H₇Br',ms:'M⁺ 122 and 124 (equal heights); fragment at 43',ir:'no O–H, no C=O',c:'2 peaks: 45, 29',h:[['4.3','1H','septet'],['1.7','6H','doublet']],o:['1-bromopropane','2-bromopropane','bromocyclopropane','3-bromoprop-1-ene'],a:1,x:'Two M⁺ peaks of equal height, 2 apart: one Br atom (⁷⁹Br and ⁸¹Br are about 50 : 50). Two equivalent CH₃ on a CH (doublet 6H, septet 1H), and the CH is on Br (4.3 ppm). CH₃CHBrCH₃.'}];
function spec(v){
  let order=SPQ.map((_,i)=>i).sort(()=>Math.random()-.5), pos=0;
  v.innerHTML=`<span class="eyebrow">Analysis · 4.2.4 and 6.3.2</span><h1>Spectroscopy practice</h1><p class="muted" style="max-width:78ch">${SPQ.length} compounds to identify from their molecular formula, mass spectrum, IR spectrum and NMR data, the way Paper 2 asks. Work out the structure first, then choose. Chemical shifts are in ppm, IR in cm⁻¹. Check shifts against the Data Sheet (linked on <a href="#papers">Past papers</a>).</p><div id="spq"></div>`;
  const show=()=>{ const q=SPQ[order[pos%order.length]], st=S.spec;
    $('#spq',v).innerHTML=`<div class="card" style="max-width:860px"><span class="eyebrow">Problem ${pos%order.length+1} of ${order.length} · score ${st.right||0}/${st.seen||0}</span><h2 style="margin:6px 0 12px">Molecular formula ${q.f}</h2>
    <div class="tbl"><table><tr><th style="width:150px">Mass spectrum</th><td>${q.ms}</td></tr><tr><th>Infrared / cm⁻¹</th><td>${q.ir}</td></tr><tr><th>¹³C NMR / ppm</th><td>${q.c}</td></tr><tr><th>¹H NMR</th><td><table style="min-width:0;width:auto"><tr><th>δ / ppm</th><th>Area</th><th>Splitting</th></tr>${q.h.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></td></tr></table></div>
    <p style="margin:12px 0 8px"><b>Which compound is it?</b></p><div class="stack" style="gap:8px">${q.o.map((o,i)=>`<button class="btn" style="justify-content:flex-start" data-o="${i}">${esc(o)}</button>`).join('')}</div><div id="spfb"></div></div>`;
    $$('[data-o]',v).forEach(b=>b.onclick=()=>{ if($('#spfb',v).innerHTML) return; const ok=+b.dataset.o===q.a; st.seen=(st.seen||0)+1; if(ok) st.right=(st.right||0)+1; save();
      $$('[data-o]',v).forEach(x=>{ x.disabled=true; if(+x.dataset.o===q.a){ x.classList.add('primary'); } });
      $('#spfb',v).innerHTML=`<div class="chip ${ok?'good':'bad'}" style="margin:14px 0 6px;display:inline-block">${ok?'Correct':'Not quite'}: it's ${esc(q.o[q.a])}</div><div class="wex"><p>${q.x}</p></div><button class="btn primary" id="spnext">Next compound</button>`;
      $('#spnext',v).onclick=()=>{ pos++; show(); window.scrollTo(0,v.offsetTop-80); }; }); };
  show();
}

window.CHEMX={drills,drill,rxmap,spec,EDGES,NODES};
})();
