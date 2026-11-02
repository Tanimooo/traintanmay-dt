/* Safety, industry, sustainability, design history and maths labs */
(function(){
'use strict';
const LK=window.LK; const esc=LK.esc;

/* ------------- risk assessment ------------- */
const LEVELS=['Elimination','Substitution','Engineering control','Administrative control','PPE'];
const RISK={
 'Pillar drill':[['Hair, loose clothing or jewellery caught in the rotating chuck (entanglement)',4,4,[['Fixed chuck guard interlocked with the motor',2,1,0],['Tie back long hair, remove ties and jewellery, roll up sleeves',3,2,0],['Training and teacher sign-off before first use',3,1,0],['Emergency stop button within reach',2,0,1]]],['Work piece spinning if not clamped',3,3,[['Clamp work in a machine vice bolted to the table',2,2,1],['Use the correct drill speed and feed gently',3,1,0],['Wear a leather apron and gloves',4,0,0]]],['Swarf and chips flying into eyes',3,3,[['Chuck guard',2,1,1],['Wear safety glasses or goggles',4,1,1],['Clear swarf with a brush, never with hands',3,1,0]]]],
 'Laser cutter':[['Fire from the material igniting',2,4,[['Air assist and correct power/speed settings',2,1,0],['Never leave the machine running unattended',3,1,0],['CO₂ extinguisher next to the machine',2,0,1]]],['Toxic fumes from cutting PVC or unknown polymers',3,4,[['Only cut approved materials (no PVC – it releases chlorine)',0,2,1],['Fume extraction and filtration',2,1,1],['Material list displayed by the machine',3,1,0]]],['Eye damage from the laser beam',1,5,[['Interlocked lid stops the laser when opened',2,0,1],['Only trained users',3,0,0]]]],
 'Vacuum former':[['Burns from the heater and hot polymer sheet',3,3,[['Heat-resistant guard around the heater',2,1,1],['Wear heat-resistant gloves when removing the moulding',4,1,1],['Allow the moulding to cool before trimming',3,1,0]]],['Fumes from overheating the sheet',2,3,[['Use a timer and watch the sheet',3,1,0],['Local exhaust ventilation',2,1,0],['Use HIPS instead of PVC',1,1,1]]]],
 'Soldering':[['Burns from the hot iron tip',3,2,[['Use a soldering iron stand',2,1,0],['Temperature-controlled iron',2,0,1],['Hold components with helping hands or pliers',3,1,0]]],['Breathing in flux fumes',4,2,[['Fume extractor next to the work',2,2,0],['Lead-free solder',1,0,1],['Work in a ventilated room',3,1,0]]]],
 'Disc sander':[['Hand contact with the moving abrasive disc',3,3,[['Guard and adjustable table set close to the disc',2,1,1],['Use push sticks for small pieces',3,1,0],['Only use the downward-moving side of the disc',3,1,0]]],['Breathing in fine dust (especially MDF)',4,3,[['Dust extraction connected and switched on',2,2,1],['Wear a dust mask (FFP2)',4,1,1],['Use a different process (e.g. file by hand)',1,2,1]]]],
 'Pewter casting':[['Molten metal splashing onto skin',2,5,[['Pre-heat and dry the mould – moisture turns to steam and makes metal spit',3,1,1],['Leather apron, gauntlets and a face shield',4,0,2],['Pour into a mould placed in a sand tray',2,1,1]]],['Burns from the hot ladle and casting',3,3,[['Leave castings to cool and use tongs',3,1,1],['Heat-resistant gloves',4,0,1]]]],
 'Solvent cement (Tensol)':[['Breathing in solvent vapour',3,3,[['Use a less hazardous adhesive (e.g. a solvent-free acrylic glue)',1,2,1],['Use in a ventilated area / under extraction',2,1,1],['Keep the lid on when not in use',3,1,0]]],['Skin and eye irritation',2,2,[['Wear nitrile gloves and safety glasses',4,1,1],['Read the COSHH data sheet',3,1,0]]]]};
const rating=s=>s>=15?['Very high',LK.P().bad]:s>=10?['High',LK.P().bad]:s>=5?['Medium',LK.P().warn]:['Low',LK.P().good];
LK.reg('risk',{title:'Risk assessment builder',cat:'Safety',topics:['7.1'],blurb:'Pick a workshop process, rate likelihood and severity on a risk matrix, add control measures from the hierarchy of control and see the residual risk.',
 icon:LK.ico('<path d="M50 10l42 76H8z"/><path d="M50 38v22"/><circle cx="50" cy="72" r="3"/>'),
 mount(el){
  const st={p:'Pillar drill',hz:0,L:0,S:0,on:new Set()};
  const ctrl=LK.ctrl(el); LK.select(ctrl,{label:'Process',options:Object.keys(RISK).map(k=>[k,k]),value:st.p,on:v=>{st.p=v; st.hz=0; resetHz(); hzSel();}});
  const hzWrap=document.createElement('label'); ctrl.appendChild(hzWrap);
  const grid=LK.el('<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:start"></div>'); el.appendChild(grid);
  const mq=matchMedia('(max-width: 700px)'); const lay=()=>grid.style.gridTemplateColumns=mq.matches?'1fr':'minmax(0,1fr) minmax(0,1.2fr)'; lay(); try{ mq.addEventListener('change',lay); }catch(e){}
  const mat=document.createElement('div'); grid.appendChild(mat); const ctl=document.createElement('div'); grid.appendChild(ctl);
  const ro=LK.readout(el,[['i','Initial risk (L × S)'],['r','Residual risk'],['c','Controls chosen']]);
  LK.note(el,'<b>Risk = likelihood × severity</b> (each scored 1–5). Apply the <b>hierarchy of control</b> from the top: eliminate the hazard, substitute something less hazardous, use engineering controls (guards, extraction, interlocks), administrative controls (training, signs, safe systems of work), and finally PPE – the last line of defence because it only protects the wearer and relies on them using it properly. Re-score to find the residual risk.');
  function hz(){ return RISK[st.p][st.hz]; }
  function resetHz(){ const h=hz(); st.L=h[1]; st.S=h[2]; st.on=new Set(); }
  function hzSel(){ hzWrap.innerHTML=`<span>Hazard</span><select>${RISK[st.p].map((h,i)=>`<option value="${i}">${esc(h[0])}</option>`).join('')}</select>`; const s=hzWrap.querySelector('select'); s.value=st.hz; s.onchange=()=>{ st.hz=+s.value; resetHz(); render(); }; render(); }
  function residual(){ let L=st.L,S=st.S; hz()[3].forEach((c,i)=>{ if(st.on.has(i)){ L-=c[2]; S-=c[3]; } }); return [Math.max(1,L),Math.max(1,S)]; }
  function render(){ const [rL,rS]=residual(); const p=LK.P();
    let t='<table class="data" style="table-layout:fixed;text-align:center"><caption style="caption-side:top;text-align:left;font-size:.82rem;color:var(--muted);padding-bottom:6px">Tap a square to set likelihood and severity. ● initial, ◆ residual</caption><tr><th style="width:62px">L \\ S</th>'+[1,2,3,4,5].map(s=>`<th>${s}</th>`).join('')+'</tr>';
    for(let L=5;L>=1;L--){ t+=`<tr><th>${L}</th>`; for(let S=1;S<=5;S++){ const sc=L*S; const bg=sc>=15?'var(--bad)':sc>=10?'var(--bad-soft)':sc>=5?'var(--warn-soft)':'var(--good-soft)'; const fg=sc>=15?'#fff':'var(--ink)'; t+=`<td data-l="${L}" data-s="${S}" style="background:${bg};color:${fg};cursor:pointer;height:38px;font-weight:600">${L===st.L&&S===st.S?'●':''}${L===rL&&S===rS&&(rL!==st.L||rS!==st.S)?'◆':''}<div style="font-size:.7rem;opacity:.7">${sc}</div></td>`; } t+='</tr>'; }
    t+='</table><div class="muted" style="font-size:.8rem;margin-top:6px">L = likelihood (1 rare → 5 almost certain) · S = severity (1 minor → 5 fatal)</div>'; mat.innerHTML=t;
    mat.querySelectorAll('td[data-l]').forEach(td=>td.onclick=()=>{ st.L=+td.dataset.l; st.S=+td.dataset.s; render(); });
    const cs=hz()[3].map((c,i)=>[c,i]).sort((a,b)=>a[0][1]-b[0][1]);
    ctl.innerHTML=`<h3 style="margin:0 0 8px">Control measures</h3><div class="stack" style="gap:8px">${cs.map(([c,i])=>`<label class="card" style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;cursor:pointer"><input type="checkbox" data-i="${i}" ${st.on.has(i)?'checked':''} style="margin-top:3px"><span><span class="chip" style="margin-bottom:4px">${LEVELS[c[1]]}</span><br>${esc(c[0])}</span></label>`).join('')}</div>`;
    ctl.querySelectorAll('input').forEach(x=>x.onchange=()=>{ const i=+x.dataset.i; if(x.checked) st.on.add(i); else st.on.delete(i); render(); });
    const ri=rating(st.L*st.S), rr=rating(rL*rS); ro({i:`${st.L} × ${st.S} = ${st.L*st.S} (${ri[0]})`,r:`${rL} × ${rS} = ${rL*rS} (${rr[0]})`,c:String(st.on.size)}); }
  resetHz(); hzSel();
 }});

/* ------------- safety signs ------------- */
const G={ // glyphs in a 40x40 box centred on 0,0, drawn with currentColor
 flame:'<path d="M0-15C9-5 11 2 7 10 4 15-4 15-7 10-11 3-5-2-2-8 0-4 2 0 2 3 6 0 4-8 0-15z" fill="currentColor"/>',
 hand:'<path d="M-8 14V-2l-3-6c-1-3 2-4 3-2l2 4V-12c0-2 3-2 3 0v8-11c0-2 3-2 3 0v11-9c0-2 3-2 3 0v9-6c0-2 3-2 3 0V8c0 4-3 6-7 6z" fill="currentColor"/>',
 goggles:'<g fill="currentColor"><rect x="-15" y="-6" width="13" height="11" rx="5"/><rect x="2" y="-6" width="13" height="11" rx="5"/><rect x="-3" y="-3" width="6" height="3"/><path d="M-15-3h-3v3h3zM15-3h3v3h-3z"/></g><path d="M-17-12q17-10 34 0" stroke="currentColor" stroke-width="2.5" fill="none"/>',
 ears:'<path d="M-12 4V-4a12 12 0 0 1 24 0V4" stroke="currentColor" stroke-width="3" fill="none"/><g fill="currentColor"><rect x="-17" y="0" width="9" height="14" rx="3"/><rect x="8" y="0" width="9" height="14" rx="3"/></g>',
 mask:'<path d="M-14-4q14-10 28 0v8q-14 12-28 0z" fill="currentColor"/><path d="M-14-2l-5-5M14-2l5-5M-14 4l-5 4M14 4l5 4" stroke="currentColor" stroke-width="2"/>',
 boot:'<path d="M-9-15h9v14l11 5c4 2 5 5 5 8v2h-25z" fill="currentColor"/>',
 bolt:'<path d="M4-16-8 2h7l-4 14L9-4H2z" fill="currentColor"/>',
 hot:'<path d="M-16 12h32" stroke="currentColor" stroke-width="3"/><path d="M-9 7c-4-4 4-7 0-11s4-7 0-11M0 7c-4-4 4-7 0-11s4-7 0-11M9 7c-4-4 4-7 0-11s4-7 0-11" stroke="currentColor" stroke-width="2.5" fill="none"/>',
 laser:'<circle r="4" fill="currentColor"/><path d="M0-14v6M0 8v6M-14 0h6M8 0h6M-10-10l4 4M6 6l4 4M-10 10l4-4M6-6l4-4" stroke="currentColor" stroke-width="2.5"/><path d="M4 0h14" stroke="currentColor" stroke-width="3"/>',
 excl:'<rect x="-3" y="-14" width="6" height="18" rx="2" fill="currentColor"/><circle cy="10" r="3.5" fill="currentColor"/>',
 gear:'<circle r="9" fill="none" stroke="currentColor" stroke-width="5"/><path d="M0-16v6M0 10v6M-16 0h6M10 0h6M-11-11l4 4M7 7l4 4M-11 11l4-4M7-7l4-4" stroke="currentColor" stroke-width="5"/>',
 cross:'<path d="M-5-15h10v10h10v10H5v10H-5V5h-10V-5h10z" fill="currentColor"/>',
 exit:'<rect x="4" y="-15" width="12" height="30" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M-17 0h15M-8-7l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none"/>',
 eyewash:'<path d="M-15 4q15-14 30 0-15 14-30 0z" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cy="4" r="4" fill="currentColor"/><path d="M-6-14v4M0-15v4M6-14v4" stroke="currentColor" stroke-width="2.5"/>',
 ext:'<rect x="-6" y="-8" width="12" height="23" rx="4" fill="currentColor"/><path d="M0-8v-5h7l5 4M-2-13h4" stroke="currentColor" stroke-width="2.5" fill="none"/>',
 alarm:'<rect x="-13" y="-13" width="26" height="26" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><circle r="6" fill="currentColor"/>',
 skull:'<path d="M-10 2a10 11 0 1 1 20 0v5h-4v4H-6V7h-4z" fill="currentColor"/><circle cx="-4.5" cy="-1" r="3" fill="#fff"/><circle cx="4.5" cy="-1" r="3" fill="#fff"/><path d="M-15 10l30 6M15 10l-30 6" stroke="currentColor" stroke-width="2.5"/>',
 corrosive:'<path d="M-14-14l8 8M2-14l8 8" stroke="currentColor" stroke-width="4"/><path d="M-6-4v4M8-4v4" stroke="currentColor" stroke-width="2"/><path d="M-17 12h12v4h-12zM2 10q5-4 10 0v6H2z" fill="currentColor"/>',
 env:'<path d="M-10 12V-2M-10-2l-6 6M-10 2l5-6M-10-8l-4 4" stroke="currentColor" stroke-width="2.5"/><path d="M0 8q8-8 14 0-6 7-14 0zM14 8l4-4v8z" fill="currentColor"/>',
 oxid:'<circle cy="9" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M0-16C6-9 7-5 4 1 2 4-2 4-4 1-7-5-3-8 0-16z" fill="currentColor"/>',
 explode:'<path d="M0-16l3 9 9-5-4 9 9 3-9 3 4 9-9-5-3 9-3-9-9 5 4-9-9-3 9-3-4-9 9 5z" fill="currentColor"/>',
 gas:'<rect x="-15" y="-6" width="28" height="12" rx="6" fill="currentColor"/><path d="M13-2h4v4h-4z" fill="currentColor"/>',
 health:'<circle cy="-9" r="5" fill="currentColor"/><path d="M-11 16V4q0-7 11-7t11 7v12z" fill="currentColor"/><path d="M0 1l1.8 4 4.2.3-3.2 2.7 1 4.2L0 10l-3.8 2.2 1-4.2-3.2-2.7 4.2-.3z" fill="#fff"/>',
 person:'<circle cy="-11" r="4" fill="currentColor"/><path d="M-2-6h4l2 10-2 12h-3l1-10-3 10h-3l3-12z" fill="currentColor"/>',
 phone:'<rect x="-7" y="-14" width="14" height="28" rx="3" fill="currentColor"/>',
};
const SIGNS=[
 ['prohib','No naked flames','flame'],['prohib','Do not touch','hand'],['prohib','No pedestrians','person'],['prohib','No mobile phones','phone'],
 ['mand','Wear eye protection','goggles'],['mand','Wear ear protection','ears'],['mand','Wear a dust mask','mask'],['mand','Wear safety footwear','boot'],
 ['warn','Danger: electricity','bolt'],['warn','Hot surface','hot'],['warn','Laser beam','laser'],['warn','General warning','excl'],['warn','Rotating parts – risk of entanglement','gear'],
 ['safe','First aid','cross'],['safe','Emergency exit','exit'],['safe','Eye wash station','eyewash'],
 ['fire','Fire extinguisher','ext'],['fire','Fire alarm call point','alarm'],
 ['clp','Flammable','flame'],['clp','Acute toxicity (toxic)','skull'],['clp','Corrosive','corrosive'],['clp','Harmful / irritant','excl'],['clp','Hazardous to the environment','env'],['clp','Oxidising','oxid'],['clp','Explosive','explode'],['clp','Gas under pressure','gas'],['clp','Serious health hazard','health']];
const CATN={prohib:'Prohibition – you must not',mand:'Mandatory – you must',warn:'Warning – hazard ahead',safe:'Safe condition – emergency escape or first aid',fire:'Fire equipment',clp:'CLP hazard pictogram (chemicals)'};
function signSVG(s,size=86){ const [c,_,g]=s; const glyph=G[g];
  if(c==='prohib') return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><circle r="22" fill="#fff" stroke="#d7261e" stroke-width="5"/><g style="color:#111">${glyph}</g><path d="M-15-15l30 30" stroke="#d7261e" stroke-width="5"/></svg>`;
  if(c==='mand') return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><circle r="23" fill="#1d5fb4"/><g style="color:#fff">${glyph}</g></svg>`;
  if(c==='warn') return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><path d="M0-23 24 20H-24z" fill="#f6c400" stroke="#111" stroke-width="3" stroke-linejoin="round"/><g style="color:#111" transform="translate(0 5) scale(.7)">${glyph}</g></svg>`;
  if(c==='safe') return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><rect x="-23" y="-23" width="46" height="46" rx="3" fill="#1e8a4c"/><g style="color:#fff">${glyph}</g></svg>`;
  if(c==='fire') return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><rect x="-23" y="-23" width="46" height="46" rx="3" fill="#d7261e"/><g style="color:#fff">${glyph}</g></svg>`;
  return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" role="img"><path d="M0-23 23 0 0 23-23 0z" fill="#fff" stroke="#d7261e" stroke-width="3.5" stroke-linejoin="round"/><g style="color:#111" transform="scale(.75)">${glyph}</g></svg>`; }
LK.reg('signs',{title:'Safety signs and symbols trainer',cat:'Safety',topics:['10.2','11.4','7.1'],blurb:'Learn the shapes and colours of prohibition, mandatory, warning and safe condition signs and the CLP hazard pictograms – then test yourself.',
 icon:LK.ico('<circle cx="30" cy="34" r="18"/><path d="M17 21l26 26"/><path d="M70 14l20 36H50z"/><path d="M48 62h34v26H48z"/>'),
 mount(el){
  const body=document.createElement('div'); let sc=0,n=0;
  LK.subtabs(el,[['learn','Learn'],['test','Test yourself']],k=>{ k==='learn'?learn():test(); });
  el.appendChild(body);
  function learn(){ body.innerHTML=Object.entries(CATN).map(([c,l])=>`<h3 style="margin:14px 0 8px">${esc(l)}</h3><div class="row" style="gap:14px;align-items:flex-start">${SIGNS.filter(s=>s[0]===c).map(s=>`<figure style="margin:0;width:110px;text-align:center">${signSVG(s)}<figcaption style="font-size:.82rem;margin-top:4px">${esc(s[1])}</figcaption></figure>`).join('')}</div>`).join('')+
    `<div class="lab-note"><b>Shapes and colours (BS EN ISO 7010):</b> red circle with a bar = prohibition; blue circle = mandatory action; yellow triangle with a black border = warning; green rectangle = safe condition; red square = fire equipment. <b>CLP pictograms</b> (red-bordered diamonds) appear on chemical containers such as adhesives, solvents and resins and link to the COSHH data sheet. Simplified drawings for revision.</div>`; }
  function test(){ const s=SIGNS[Math.floor(Math.random()*SIGNS.length)]; const kind=Math.random()<.5?'cat':'mean'; let opts;
    if(kind==='cat'){ opts=Object.keys(CATN).map(k=>[k,CATN[k]]).sort(()=>Math.random()-.5).slice(0,4); if(!opts.some(o=>o[0]===s[0])) opts[0]=[s[0],CATN[s[0]]]; opts.sort(()=>Math.random()-.5); }
    else { const pool=SIGNS.filter(x=>x!==s&&x[0]===s[0]); const others=SIGNS.filter(x=>x!==s&&x[0]!==s[0]); const pick=pool.sort(()=>Math.random()-.5).slice(0,3); while(pick.length<3) pick.push(others.splice(Math.floor(Math.random()*others.length),1)[0]); opts=[[s[1],s[1]]].concat(pick.map(x=>[x[1],x[1]])).sort(()=>Math.random()-.5); }
    const ans=kind==='cat'?s[0]:s[1];
    body.innerHTML=`<div class="qz"><div class="row" style="justify-content:space-between"><span class="eyebrow">${kind==='cat'?'What type of sign is this?':'What does this sign mean?'}</span><span class="mono muted">${sc}/${n}</span></div><div style="text-align:center;margin:14px 0">${signSVG(s,130)}</div><div class="qz-opts">${opts.map(([v,l],i)=>`<button type="button" data-v="${esc(v)}"><span class="l">${'ABCD'[i]}</span><span>${esc(l)}</span></button>`).join('')}</div><div class="qa"></div></div>`;
    body.querySelectorAll('.qz-opts button').forEach(b=>b.onclick=()=>{ const ok=b.dataset.v===ans; n++; if(ok) sc++; body.querySelectorAll('.qz-opts button').forEach(x=>{ x.disabled=true; if(x.dataset.v===ans) x.classList.add('right'); }); if(!ok) b.classList.add('wrong'); body.querySelector('.qa').innerHTML=`<div class="qz-exp"><b>${ok?'Correct.':'Not quite.'}</b> This is <b>${esc(s[1])}</b> – a ${esc(CATN[s[0]].toLowerCase())} sign.</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" type="button">Next →</button></div>`; body.querySelector('.qa .btn').onclick=test; }); }
 }});

/* ------------- production scale ------------- */
LK.reg('production',{title:'Production scale calculator',cat:'Industry',topics:['8.1','11.2'],blurb:'Compare one-off, batch and mass production: see how tooling costs spread over larger quantities and where each method becomes cheapest.',
 icon:LK.ico('<path d="M10 88V12M10 88h80"/><path d="M14 20q10 50 74 60"/><path d="M14 60q30 10 74 12"/>'),
 mount(el){
  const M=[{n:'3D printing (one-off / prototype)',F:150,V:18,c:'#7b4bc4'},{n:'Vacuum forming (batch)',F:1200,V:2.5,c:'#d9822b'},{n:'Injection moulding (mass)',F:25000,V:.35,c:'#1f5fbf'}];
  const st={q:500};
  const tbl=LK.el(`<table class="data" style="margin-bottom:12px"><thead><tr><th>Method</th><th>Fixed / tooling cost (£)</th><th>Variable cost per unit (£)</th></tr></thead><tbody>${M.map((m,i)=>`<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${m.c};margin-right:6px"></span>${m.n}</td><td><input type="number" min="0" step="10" data-i="${i}" data-k="F" value="${m.F}"></td><td><input type="number" min="0" step="0.05" data-i="${i}" data-k="V" value="${m.V}"></td></tr>`).join('')}</tbody></table>`);
  el.appendChild(LK.el('<div class="tbl" style="overflow-x:auto"></div>')).appendChild(tbl);
  tbl.querySelectorAll('input').forEach(x=>x.addEventListener('input',()=>{ const v=parseFloat(x.value); if(!isNaN(v)&&v>=0){ M[+x.dataset.i][x.dataset.k]=v; draw(); } }));
  const ctrl=LK.ctrl(el); const qs=LK.slider(ctrl,{label:'Quantity',min:0,max:600,value:Math.log10(500)*100,fmt:v=>Math.round(Math.pow(10,v/100)).toLocaleString(),on:v=>{ st.q=Math.round(Math.pow(10,v/100)); draw(); }});
  const cv=LK.canvas(el,w=>Math.min(360,Math.max(260,w*.48)),()=>draw());
  const ro=LK.readout(el,[['a','3D printing per unit'],['b','Vacuum forming per unit'],['c','Injection moulding per unit'],['best','Cheapest at this quantity'],['x1','Batch beats one-off from'],['x2','Mass beats batch from']]);
  LK.note(el,'<b>Unit cost = fixed cost ÷ quantity + variable cost.</b> Expensive tooling (a steel injection mould can cost tens of thousands of pounds) is only worthwhile when it is spread across a large quantity – this is <b>economy of scale</b>. One-off and prototype methods have low set-up costs but high cost per item. Costs here are illustrative; edit them in the table.');
  const uc=(m,q)=>m.F/q+m.V; const cross=(a,b)=>(b.F-a.F)/(a.V-b.V);
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const L=56,R=14,T=14,B=40;
    const X=q=>L+Math.log10(q)/6*(w-L-R); const ymin=.1, ymax=Math.max(...M.map(m=>uc(m,1)))*1.5; const Y=v=>T+(1-(Math.log10(Math.max(ymin,v))-Math.log10(ymin))/(Math.log10(ymax)-Math.log10(ymin)))*(h-T-B);
    ctx.strokeStyle=p.line; ctx.lineWidth=1; for(let e=0;e<=6;e++){ const x=X(Math.pow(10,e)); ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,h-B); ctx.stroke(); LK.text(ctx,Math.pow(10,e).toLocaleString(),x,h-B+12,{align:'center',size:10,color:p.muted,mono:1}); }
    for(let e=-1;e<=Math.ceil(Math.log10(ymax));e++){ const v=Math.pow(10,e); if(v>ymax) break; const y=Y(v); ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(w-R,y); ctx.stroke(); LK.text(ctx,'£'+(v<1?v:v.toLocaleString()),L-6,y,{align:'right',size:10,color:p.muted,mono:1}); }
    LK.text(ctx,'Quantity made (log scale)',(L+w)/2,h-10,{align:'center',size:11,color:p.ink2}); LK.text(ctx,'Cost per unit',L,T-2,{size:11,color:p.ink2,base:'top'});
    M.forEach(m=>{ ctx.beginPath(); for(let i=0;i<=200;i++){ const q=Math.pow(10,i/200*6); const y=Y(uc(m,q)); i?ctx.lineTo(X(q),y):ctx.moveTo(X(q),y); } ctx.strokeStyle=m.c; ctx.lineWidth=2.5; ctx.stroke(); });
    const x=X(Math.max(1,st.q)); ctx.setLineDash([4,4]); ctx.strokeStyle=p.ink2; ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,h-B); ctx.stroke(); ctx.setLineDash([]); M.forEach(m=>{ ctx.beginPath(); ctx.arc(x,Y(uc(m,Math.max(1,st.q))),5,0,7); ctx.fillStyle=m.c; ctx.fill(); });
    const q=Math.max(1,st.q); const costs=M.map(m=>uc(m,q)); const bi=costs.indexOf(Math.min(...costs)); const f=v=>'£'+(v>=100?LK.fmt(v,0):v.toFixed(2));
    const c1=cross(M[0],M[1]), c2=cross(M[1],M[2]);
    ro({a:f(costs[0]),b:f(costs[1]),c:f(costs[2]),best:M[bi].n.split(' (')[0],x1:c1>0&&isFinite(c1)?Math.ceil(c1).toLocaleString()+' units':'–',x2:c2>0&&isFinite(c2)?Math.ceil(c2).toLocaleString()+' units':'–'}); }
  draw();
  return ()=>cv.ro.disconnect();
 }});

/* ------------- break even ------------- */
LK.reg('breakeven',{title:'Break-even modeller',cat:'Industry',topics:['11.2'],blurb:'Set fixed costs, variable cost and selling price and see the break-even point, profit and margin of safety on a break-even chart.',
 icon:LK.ico('<path d="M10 88V12M10 88h80"/><path d="M10 60l80-30M10 88l80-64"/><circle cx="48" cy="46" r="4"/>'),
 mount(el){
  const st={F:12000,V:6,P:15,q:2000};
  const ctrl=LK.ctrl(el);
  LK.slider(ctrl,{label:'Fixed costs',min:0,max:50000,step:500,value:st.F,fmt:v=>'£'+v.toLocaleString(),on:v=>{st.F=v; draw();}});
  LK.slider(ctrl,{label:'Variable cost per unit',min:0,max:50,step:.5,value:st.V,fmt:v=>'£'+v.toFixed(2),on:v=>{st.V=v; draw();}});
  LK.slider(ctrl,{label:'Selling price per unit',min:1,max:60,step:.5,value:st.P,fmt:v=>'£'+v.toFixed(2),on:v=>{st.P=v; draw();}});
  LK.slider(ctrl,{label:'Units sold',min:0,max:6000,step:50,value:st.q,fmt:v=>v.toLocaleString(),on:v=>{st.q=v; draw();}});
  const cv=LK.canvas(el,w=>Math.min(380,Math.max(260,w*.5)),()=>draw());
  const ro=LK.readout(el,[['be','Break-even quantity'],['ber','Break-even revenue'],['cont','Contribution per unit'],['pr','Profit / loss at units sold'],['ms','Margin of safety']]);
  LK.note(el,'<b>Break-even point = fixed costs ÷ (selling price − variable cost per unit).</b> The bracket is the <b>contribution</b> each unit makes towards paying off the fixed costs. Below the break-even point the business makes a loss; above it, a profit. <b>Margin of safety</b> = units sold − break-even quantity. Fixed costs (rent, tooling, salaries) do not change with output; variable costs (materials, packaging) rise with every unit.');
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const L=64,R=14,T=14,B=40; const qmax=6000; const ymax=Math.max(st.P*qmax,st.F+st.V*qmax)*1.05;
    const X=q=>L+q/qmax*(w-L-R), Y=v=>h-B-v/ymax*(h-T-B); const c=st.P-st.V; const be=c>0?st.F/c:Infinity;
    ctx.strokeStyle=p.line; ctx.lineWidth=1; for(let i=0;i<=6;i++){ const x=X(i*1000); ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,h-B); ctx.stroke(); LK.text(ctx,(i*1000).toLocaleString(),x,h-B+12,{align:'center',size:10,color:p.muted,mono:1}); }
    for(let i=0;i<=4;i++){ const v=ymax*i/4; ctx.beginPath(); ctx.moveTo(L,Y(v)); ctx.lineTo(w-R,Y(v)); ctx.stroke(); LK.text(ctx,'£'+LK.fmt(v/1000,0)+'k',L-6,Y(v),{align:'right',size:10,color:p.muted,mono:1}); }
    if(isFinite(be)&&be<qmax){ ctx.beginPath(); ctx.moveTo(X(be),Y(st.P*be)); ctx.lineTo(X(qmax),Y(st.P*qmax)); ctx.lineTo(X(qmax),Y(st.F+st.V*qmax)); ctx.closePath(); ctx.fillStyle=p.goodSoft; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(X(0),Y(0)); ctx.lineTo(X(Math.min(be,qmax)),Y(st.P*Math.min(be,qmax))); ctx.lineTo(X(Math.min(be,qmax)),Y(st.F+st.V*Math.min(be,qmax))); ctx.lineTo(X(0),Y(st.F)); ctx.closePath(); ctx.fillStyle=p.badSoft; ctx.fill();
    const line=(f,col,lab,dash)=>{ ctx.beginPath(); ctx.moveTo(X(0),Y(f(0))); ctx.lineTo(X(qmax),Y(f(qmax))); ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.setLineDash(dash||[]); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,lab,X(qmax)-4,Y(f(qmax))-10,{align:'right',size:11,weight:700,color:col}); };
    line(()=>st.F,p.muted,'Fixed costs',[6,4]); line(q=>st.F+st.V*q,p.bad,'Total costs'); line(q=>st.P*q,p.good,'Revenue');
    if(isFinite(be)&&be<=qmax){ ctx.beginPath(); ctx.arc(X(be),Y(st.P*be),6,0,7); ctx.fillStyle=p.ink; ctx.fill(); LK.text(ctx,'Break-even',X(be)+8,Y(st.P*be)+14,{size:11,weight:700}); }
    const xq=X(st.q); ctx.setLineDash([3,3]); ctx.strokeStyle=p.brand; ctx.beginPath(); ctx.moveTo(xq,T); ctx.lineTo(xq,h-B); ctx.stroke(); ctx.setLineDash([]);
    LK.text(ctx,'Units',w-R,h-10,{align:'right',size:11,color:p.ink2});
    const pr=st.P*st.q-(st.F+st.V*st.q);
    ro({be:isFinite(be)?Math.ceil(be).toLocaleString()+' units':'Never (price ≤ cost)',ber:isFinite(be)?'£'+LK.fmt(Math.ceil(be)*st.P,0):'–',cont:'£'+c.toFixed(2),pr:(pr<0?'−£':'£')+LK.fmt(Math.abs(pr),0),ms:isFinite(be)?(st.q-Math.ceil(be)).toLocaleString()+' units':'–'}); }
  draw();
  return ()=>cv.ro.disconnect();
 }});

/* ------------- six sigma ------------- */
const ncdf=(x)=>{ const t=1/(1+.2316419*Math.abs(x)); const d=.3989423*Math.exp(-x*x/2); const pr=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return x>0?1-pr:pr; };
LK.reg('sixsigma',{title:'Six Sigma lab',cat:'Industry',topics:['8.2','12.2'],blurb:'A machined part has tolerance limits. Narrow the process variation or centre the mean and watch the sigma level rise and defects per million fall.',
 icon:LK.ico('<path d="M8 84c16 0 24-66 42-66s26 66 42 66"/><path d="M22 90V20M78 90V20"/>'),
 mount(el){
  const st={mu:25,sd:.1}; const T=25, tol=.3, LSL=T-tol, USL=T+tol;
  const ctrl=LK.ctrl(el);
  LK.slider(ctrl,{label:'Process standard deviation (σ)',min:.02,max:.3,step:.005,value:st.sd,fmt:v=>v.toFixed(3)+' mm',on:v=>{st.sd=v; draw();}});
  LK.slider(ctrl,{label:'Process mean',min:24.8,max:25.2,step:.005,value:st.mu,fmt:v=>v.toFixed(3)+' mm',on:v=>{st.mu=v; draw();}});
  const cv=LK.canvas(el,w=>Math.min(340,Math.max(240,w*.44)),()=>draw());
  const ro=LK.readout(el,[['sig','Sigma level (σ to nearest limit)'],['cpk','Cpk'],['ppm','Defects per million'],['yield','Parts within tolerance']]);
  LK.note(el,'A shaft must be <b>25.00 ± 0.30 mm</b>. Every process varies; the bell curve shows the spread of sizes. <b>Six Sigma</b> aims for the nearest tolerance limit to be six standard deviations from the mean. Allowing for the conventional 1.5σ drift of a process over time, this means only <b>3.4 defects per million</b> opportunities. Six Sigma projects use <b>DMAIC</b>: Define, Measure, Analyse, Improve, Control. The figures here assume no drift.');
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const lo=24.4, hi=25.6; const X=v=>20+(v-lo)/(hi-lo)*(w-40); const pdf=x=>Math.exp(-((x-st.mu)**2)/(2*st.sd*st.sd)); const Y=v=>h-34-v*(h-60);
    const fill=(a,b,col)=>{ ctx.beginPath(); ctx.moveTo(X(a),Y(0)); for(let x=a;x<=b;x+=(hi-lo)/400) ctx.lineTo(X(x),Y(pdf(x))); ctx.lineTo(X(b),Y(0)); ctx.closePath(); ctx.fillStyle=col; ctx.fill(); };
    fill(lo,LSL,p.bad); fill(USL,hi,p.bad); fill(LSL,USL,p.goodSoft);
    ctx.beginPath(); for(let x=lo;x<=hi;x+=(hi-lo)/400){ const y=Y(pdf(x)); x===lo?ctx.moveTo(X(x),y):ctx.lineTo(X(x),y); } ctx.strokeStyle=p.brand; ctx.lineWidth=2.5; ctx.stroke();
    [[LSL,'LSL 24.70'],[USL,'USL 25.30'],[T,'Target 25.00']].forEach(([v,l],i)=>{ ctx.strokeStyle=i<2?p.bad:p.ink2; ctx.lineWidth=i<2?2:1; ctx.setLineDash(i<2?[]:[4,4]); ctx.beginPath(); ctx.moveTo(X(v),14); ctx.lineTo(X(v),h-34); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,l,X(v),8+(i===2?0:0),{align:'center',size:11,weight:700,color:i<2?p.bad:p.ink2,base:'top',bg:p.bg}); });
    for(let k=-3;k<=3;k++){ const x=st.mu+k*st.sd; if(x<lo||x>hi) continue; ctx.strokeStyle=p.line2; ctx.beginPath(); ctx.moveTo(X(x),h-34); ctx.lineTo(X(x),h-28); ctx.stroke(); LK.text(ctx,(k>0?'+':'')+k+'σ',X(x),h-18,{align:'center',size:10,color:p.muted,mono:1}); }
    const out=ncdf((LSL-st.mu)/st.sd)+(1-ncdf((USL-st.mu)/st.sd)); const z=Math.min(USL-st.mu,st.mu-LSL)/st.sd; const ppm=out*1e6;
    ro({sig:LK.fmt(z,2)+' σ',cpk:LK.fmt(z/3,2),ppm:ppm<0.01?'< 0.01':ppm<10?ppm.toFixed(2):Math.round(ppm).toLocaleString(),yield:(100-out*100).toFixed(out<1e-4?5:2)+'%'}); }
  draw();
  return ()=>cv.ro.disconnect();
 }});

/* ------------- critical path ------------- */
const CPA_PRE=[['A','Research and brief',3,''],['B','Design concepts',4,'A'],['C','Develop CAD model',3,'B'],['D','Order materials',2,'B'],['E','Make prototype',4,'C,D'],['F','User testing',2,'E'],['G','Marketing plan',3,'B'],['H','Launch',1,'F,G']];
LK.reg('cpa',{title:'Critical path planner',cat:'Project management',topics:['12.2'],blurb:'Edit task durations and dependencies – the planner calculates earliest and latest times and float, and highlights the critical path.',
 icon:LK.ico('<rect x="6" y="40" width="18" height="18"/><rect x="40" y="16" width="18" height="18"/><rect x="40" y="64" width="18" height="18"/><rect x="76" y="40" width="18" height="18"/><path d="M24 46l16-18M24 52l16 18M58 26l18 18M58 72l18-18"/>'),
 mount(el){
  let tasks=CPA_PRE.map(t=>t.slice());
  const tw=LK.el('<div style="overflow-x:auto"></div>'); el.appendChild(tw);
  const ctrl=LK.ctrl(el); LK.btn(ctrl,'+ Add task',()=>{ const id=String.fromCharCode(65+tasks.length); tasks.push([id,'New task',1,tasks.length?tasks[tasks.length-1][0]:'']); table(); calc(); }); LK.btn(ctrl,'Reset example',()=>{ tasks=CPA_PRE.map(t=>t.slice()); table(); calc(); });
  const dg=LK.el('<div style="overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--surface-2)"></div>'); el.appendChild(dg);
  const ro=LK.readout(el,[['d','Project duration'],['cp','Critical path'],['f','Tasks with float']]);
  LK.note(el,'Each box shows <b>earliest start | duration | earliest finish</b> on top and <b>latest start | float | latest finish</b> below. The <b>forward pass</b> finds earliest times (take the largest earliest finish of the tasks before). The <b>backward pass</b> finds latest times (take the smallest latest start of the tasks after). <b>Float</b> = latest start − earliest start. Tasks with zero float are on the <b>critical path</b> – any delay to them delays the whole project. Durations are in weeks.');
  function table(){ tw.innerHTML=`<table class="data"><thead><tr><th>ID</th><th>Task</th><th>Duration (weeks)</th><th>Must follow</th><th></th></tr></thead><tbody>${tasks.map((t,i)=>`<tr><td class="mono">${esc(t[0])}</td><td><input data-i="${i}" data-k="1" value="${esc(t[1])}" style="width:100%;min-width:140px"></td><td><input type="number" min="0" data-i="${i}" data-k="2" value="${t[2]}"></td><td><input data-i="${i}" data-k="3" value="${esc(t[3])}" placeholder="e.g. A,B"></td><td><button class="btn btn-sm ghost" data-del="${i}" aria-label="Delete task ${esc(t[0])}">✕</button></td></tr>`).join('')}</tbody></table>`;
    tw.querySelectorAll('input').forEach(x=>x.addEventListener('input',()=>{ const i=+x.dataset.i,k=+x.dataset.k; tasks[i][k]=k===2?Math.max(0,parseFloat(x.value)||0):x.value; calc(); }));
    tw.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{ tasks.splice(+b.dataset.del,1); table(); calc(); }); }
  function calc(){ const p=LK.P(); const T={}; tasks.forEach(t=>T[t[0]]={id:t[0],n:t[1],d:+t[2]||0,pre:String(t[3]).toUpperCase().split(/[\s,]+/).filter(x=>x&&x!==t[0])}); Object.values(T).forEach(t=>t.pre=t.pre.filter(x=>T[x]));
    // topological order
    const order=[], seen={}, stack={}; let cyc=false; const visit=id=>{ if(seen[id]) return; if(stack[id]){ cyc=true; return; } stack[id]=1; T[id].pre.forEach(visit); stack[id]=0; seen[id]=1; order.push(id); }; Object.keys(T).forEach(visit);
    if(cyc){ dg.innerHTML='<div class="empty">The dependencies make a loop – a task cannot (indirectly) follow itself.</div>'; ro({d:'–',cp:'–',f:'–'}); return; }
    order.forEach(id=>{ const t=T[id]; t.es=t.pre.length?Math.max(...t.pre.map(x=>T[x].ef)):0; t.ef=t.es+t.d; t.rank=t.pre.length?Math.max(...t.pre.map(x=>T[x].rank))+1:0; });
    const dur=Math.max(0,...order.map(id=>T[id].ef)); const succ={}; order.forEach(id=>T[id].pre.forEach(x=>(succ[x]=succ[x]||[]).push(id)));
    order.slice().reverse().forEach(id=>{ const t=T[id]; const s=succ[id]||[]; t.lf=s.length?Math.min(...s.map(x=>T[x].ls)):dur; t.ls=t.lf-t.d; t.fl=t.ls-t.es; });
    const crit=order.filter(id=>Math.abs(T[id].fl)<1e-9);
    // layout
    const cols={}; order.forEach(id=>{ (cols[T[id].rank]=cols[T[id].rank]||[]).push(id); }); const nc=Object.keys(cols).length; const maxr=Math.max(...Object.values(cols).map(c=>c.length));
    const BW=132,BH=74,GX=54,GY=22; const W=nc*(BW+GX)+20, H=maxr*(BH+GY)+20;
    Object.entries(cols).forEach(([r,ids])=>ids.forEach((id,i)=>{ T[id].x=10+(+r)*(BW+GX); T[id].y=10+i*(BH+GY)+(maxr-ids.length)*(BH+GY)/2; }));
    let svg=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;font-family:var(--f-body)"><defs><marker id="cpaA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10z" fill="${p.ink2}"/></marker><marker id="cpaC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10z" fill="${p.bad}"/></marker></defs>`;
    order.forEach(id=>T[id].pre.forEach(x=>{ const a=T[x], b=T[id]; const c=crit.includes(x)&&crit.includes(id)&&Math.abs(a.ef-b.es)<1e-9; svg+=`<path d="M${a.x+BW} ${a.y+BH/2} C${a.x+BW+GX/2} ${a.y+BH/2} ${b.x-GX/2} ${b.y+BH/2} ${b.x-2} ${b.y+BH/2}" fill="none" stroke="${c?p.bad:p.ink2}" stroke-width="${c?3:1.5}" marker-end="url(#${c?'cpaC':'cpaA'})"/>`; }));
    order.forEach(id=>{ const t=T[id]; const c=crit.includes(id); const f=v=>+v.toFixed(2); svg+=`<g transform="translate(${t.x} ${t.y})"><rect width="${BW}" height="${BH}" rx="6" fill="${p.surface}" stroke="${c?p.bad:p.line2}" stroke-width="${c?2.5:1.2}"/><path d="M0 22H${BW}M0 ${BH-22}H${BW}M${BW/3} 0V22M${BW*2/3} 0V22M${BW/3} ${BH-22}V${BH}M${BW*2/3} ${BH-22}V${BH}" stroke="${p.line2}"/>
      ${[[f(t.es),0],[f(t.d),1],[f(t.ef),2]].map(([v,i])=>`<text x="${BW/6+i*BW/3}" y="15" text-anchor="middle" font-size="12" font-family="var(--f-mono)" fill="${p.ink}">${v}</text>`).join('')}
      ${[[f(t.ls),0],[f(t.fl),1],[f(t.lf),2]].map(([v,i])=>`<text x="${BW/6+i*BW/3}" y="${BH-7}" text-anchor="middle" font-size="12" font-family="var(--f-mono)" fill="${i===1&&c?p.bad:p.ink}" font-weight="${i===1?700:400}">${v}</text>`).join('')}
      <text x="${BW/2}" y="${BH/2+4}" text-anchor="middle" font-size="12" font-weight="600" fill="${p.ink}">${esc(t.id+': '+(t.n.length>16?t.n.slice(0,15)+'…':t.n))}</text></g>`; });
    dg.innerHTML=svg+'</svg>';
    ro({d:LK.fmt(dur,2)+' weeks',cp:crit.join(' → '),f:order.filter(id=>!crit.includes(id)).map(id=>`${id} (${LK.fmt(T[id].fl,2)})`).join(', ')||'None'}); }
  table(); calc();
 }});

/* ------------- product life cycle ------------- */
const PLC_ST=[[0,1.6,'Introduction','Sales are low and grow slowly. Costs are high (development, tooling, launch promotion) so the product usually makes a loss. Few competitors.','Advertising to raise awareness, early adopters, often a high (skimming) price or a low introductory (penetration) price.'],[1.6,4.4,'Growth','Sales rise quickly as more people buy it. Profits appear as unit costs fall with economies of scale. Competitors start to copy.','Build brand loyalty, widen distribution, add features, keep advertising.'],[4.4,6.8,'Maturity','Sales are high but levelling off. Profits peak. The market is crowded with competitors so prices fall.','Defend market share: price cuts, promotions, new models, extension strategies.'],[6.8,10,'Decline','Sales and profits fall as tastes change or newer technology replaces the product.','Cut costs, stop advertising, sell off stock, or withdraw the product. Some products become “classics” with a niche market.']];
LK.reg('plc',{title:'Product life cycle explorer',cat:'Industry',topics:['12.3'],blurb:'Drag along the life cycle curve to see how sales, costs, profit and marketing change – and add an extension strategy.',
 icon:LK.ico('<path d="M8 88V12M8 88h84"/><path d="M10 84c20 0 22-58 44-60s22 30 36 52"/>'),
 mount(el){
  const st={t:3,ext:false};
  const ctrl=LK.ctrl(el); LK.check(ctrl,'Add an extension strategy in maturity',false,v=>{st.ext=v; draw();});
  const cv=LK.canvas(el,w=>Math.min(360,Math.max(250,w*.46)),()=>draw());
  const card=LK.el('<div class="card" style="margin-top:12px"></div>'); el.appendChild(card);
  LK.note(el,'<b>Extension strategies</b> restart growth before decline: a new model or colour, limited editions, new features, repackaging, new markets (e.g. a different age group or country), price changes or a new advertising campaign. Planned obsolescence and fashion trends shorten life cycles; classic, timeless designs extend them.');
  const S=t=>{ let s=100/(1+Math.exp(-1.7*(t-3.1))); if(st.ext&&t>6) s+= 45/(1+Math.exp(-2.4*(t-6.6))); const dstart=st.ext?8.2:6.8; if(t>dstart) s*=Math.exp(-.45*Math.pow(t-dstart,1.25)); return s; };
  const Pf=t=>.55*S(t)-(32*Math.exp(-.7*t)+8);
  LK.pointer(cv.cv,{down:pt=>set(pt),move:pt=>set(pt)}); const set=pt=>{ st.t=Math.max(0,Math.min(10,(pt.x-46)/(cv.w-66)*10)); draw(); };
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const L=46,R=20,T=24,B=34; const X=t=>L+t/10*(w-L-R); const ymin=-40, ymax=160; const Y=v=>T+(1-(v-ymin)/(ymax-ymin))*(h-T-B);
    const stages=PLC_ST.map(s=>s.slice()); if(st.ext){ stages[2][1]=8.2; stages[3][0]=8.2; }
    stages.forEach((s,i)=>{ ctx.fillStyle=i%2?p.bg:p.surface; ctx.fillRect(X(s[0]),T,X(s[1])-X(s[0]),h-T-B); LK.text(ctx,s[2],(X(s[0])+X(s[1]))/2,T-10,{align:'center',size:11,weight:700,color:p.ink2}); });
    ctx.strokeStyle=p.line2; ctx.beginPath(); ctx.moveTo(L,Y(0)); ctx.lineTo(w-R,Y(0)); ctx.stroke(); LK.text(ctx,'£0',L-6,Y(0),{align:'right',size:10,color:p.muted,mono:1});
    const curve=(f,col,lw)=>{ ctx.beginPath(); for(let i=0;i<=300;i++){ const t=i/30; const y=Y(f(t)); i?ctx.lineTo(X(t),y):ctx.moveTo(X(t),y); } ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.stroke(); };
    curve(S,p.brand,3); curve(Pf,p.accent,2); LK.text(ctx,'Sales',X(4.2),Y(S(4.2))-12,{size:12,weight:700,color:p.brand}); LK.text(ctx,'Profit',X(1.1),Y(Pf(1.1))+14,{size:12,weight:700,color:p.accent});
    const x=X(st.t); ctx.setLineDash([4,4]); ctx.strokeStyle=p.ink2; ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,h-B); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(x,Y(S(st.t)),7,0,7); ctx.fillStyle=p.brand; ctx.fill(); ctx.strokeStyle=p.surface; ctx.lineWidth=2; ctx.stroke(); ctx.beginPath(); ctx.arc(x,Y(Pf(st.t)),5,0,7); ctx.fillStyle=p.accent; ctx.fill();
    LK.text(ctx,'Time →',w-R,h-12,{align:'right',size:11,color:p.ink2}); LK.text(ctx,'Drag along the graph',L+6,h-12,{size:11,color:p.muted});
    if(st.ext){ LK.text(ctx,'extension strategy',X(6.6),Y(S(6.6))-26,{align:'center',size:11,color:p.good,weight:700}); LK.arrow(ctx,X(6.6),Y(S(6.6))-18,X(6.6),Y(S(6.6))-4,p.good,2,7); }
    const sg=stages.find(s=>st.t>=s[0]&&st.t<=s[1])||stages[0]; const pr=Pf(st.t);
    card.innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${sg[2]}</h3><span class="mono">Sales ${Math.round(S(st.t))}k · Profit ${pr<0?'−':''}£${Math.abs(Math.round(pr))}k</span></div><p style="margin:8px 0">${sg[3]}</p><p style="margin:0"><b>Marketing:</b> ${sg[4]}</p>`; }
  draw();
  return ()=>cv.ro.disconnect();
 }});

/* ------------- life cycle assessment ------------- */
const LCA_MAT={'Virgin aluminium':[11,'metal',8],'Recycled aluminium':[1.5,'metal',8],'Stainless steel':[6,'metal',6],'Mild steel (powder coated)':[2.4,'metal',6],'Virgin polypropylene':[2,'poly',3],'Recycled polypropylene':[.9,'poly',3],'PLA bioplastic':[1.6,'bio',3],'Glass':[1.2,'glass',4],'FSC hardwood':[.6,'wood',1.5],'Bamboo':[.9,'wood',1.5]};
const LCA_PROD={'Reusable water bottle':[.25,['Virgin aluminium','Recycled aluminium','Stainless steel','Virgin polypropylene','Recycled polypropylene','Glass','PLA bioplastic']],'Phone case':[.035,['Virgin polypropylene','Recycled polypropylene','PLA bioplastic','Virgin aluminium','Bamboo']],'Garden chair':[6,['FSC hardwood','Bamboo','Virgin aluminium','Recycled aluminium','Mild steel (powder coated)','Virgin polypropylene','Recycled polypropylene']]};
LK.reg('lca',{title:'Life cycle impact calculator',cat:'Sustainability',topics:['9.1','9.2'],blurb:'Change material, factory energy, transport and end-of-life route and see a product’s carbon footprint at each stage.',
 icon:LK.ico('<path d="M50 12a38 38 0 1 1-30 15"/><path d="M14 14l6 13 13-4"/><path d="M50 36c10 8 10 22 0 28-10-6-10-20 0-28z"/>'),
 mount(el){
  const st={prod:'Reusable water bottle',mat:'Virgin aluminium',grid:.2,km:8000,mode:.015,eol:'recycle',years:5};
  const ctrl=LK.ctrl(el); const matWrap=document.createElement('label');
  LK.select(ctrl,{label:'Product',options:Object.keys(LCA_PROD).map(k=>[k,k]),value:st.prod,on:v=>{st.prod=v; st.mat=LCA_PROD[v][1][0]; mats(); draw();}}); ctrl.appendChild(matWrap);
  LK.select(ctrl,{label:'Factory electricity',options:[['0.2','UK grid average'],['0.7','Coal-heavy grid'],['0.03','Renewable (wind/solar)']],value:'0.2',on:v=>{st.grid=+v; draw();}});
  const c2=LK.ctrl(el);
  LK.slider(c2,{label:'Transport distance',min:0,max:20000,step:100,value:st.km,fmt:v=>v.toLocaleString()+' km',on:v=>{st.km=v; draw();}});
  LK.select(c2,{label:'Transport mode',options:[['0.015','Container ship'],['0.1','Lorry'],['0.03','Rail'],['0.6','Air freight']],value:'0.015',on:v=>{st.mode=+v; draw();}});
  LK.select(c2,{label:'End of life',options:[['recycle','Recycled'],['landfill','Landfill'],['incin','Incinerated (energy recovery)'],['compost','Composted / biodegraded']],value:st.eol,on:v=>{st.eol=v; draw();}});
  LK.slider(c2,{label:'Product lifespan',min:1,max:20,value:st.years,fmt:v=>v+' year'+(v>1?'s':''),on:v=>{st.years=v; draw();}});
  const cv=LK.canvas(el,w=>Math.min(300,Math.max(220,w*.36)),()=>draw());
  const ro=LK.readout(el,[['t','Total footprint'],['y','Per year of use'],['big','Biggest stage']]);
  const note=LK.note(el,'');
  function mats(){ matWrap.innerHTML=`<span>Material</span><select>${LCA_PROD[st.prod][1].map(m=>`<option>${esc(m)}</option>`).join('')}</select>`; const s=matWrap.querySelector('select'); s.value=st.mat; s.onchange=()=>{ st.mat=s.value; draw(); }; }
  mats();
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const m=LCA_PROD[st.prod][0]; const M=LCA_MAT[st.mat];
    const mat=m*M[0], man=m*M[2]*st.grid, tr=m/1000*st.km*st.mode;
    let eol=0, eolNote=''; if(st.eol==='recycle'){ eol= M[1]==='metal'?-m*M[0]*.4:M[1]==='poly'?-m*.5:M[1]==='glass'?-m*.3:m*.05; eolNote=M[1]==='wood'||M[1]==='bio'?'Timber and PLA are rarely recycled in practice.':'Recycling earns a credit because it saves making new material.'; }
    else if(st.eol==='landfill'){ eol=M[1]==='wood'||M[1]==='bio'?m*.8:m*.05; eolNote=M[1]==='wood'||M[1]==='bio'?'Biodegradable materials in landfill release methane, a powerful greenhouse gas.':'Landfill wastes the material and takes up land; polymers can take hundreds of years to break down.'; }
    else if(st.eol==='incin'){ eol=M[1]==='poly'?m*2.6:M[1]==='bio'?m*1.6:M[1]==='wood'?m*.1:m*.05; eolNote='Burning polymers releases the carbon locked up in them, though the energy can be recovered.'; }
    else { eol= M[1]==='wood'||M[1]==='bio'?m*.1:NaN; eolNote= M[1]==='wood'||M[1]==='bio'?'Industrial composting returns biological materials to the soil (PLA needs industrial composting).':'This material cannot be composted – choose another route.'; }
    const parts=[['Material',mat,p.brand],['Manufacture',man,p.navy],['Transport',tr,p.accent],['End of life',isNaN(eol)?0:eol,eol<0?p.good:p.bad]]; const tot=parts.reduce((a,x)=>a+x[1],0);
    const all=parts.map(x=>x[1]).concat([tot]); const neg=Math.min(0,...all), pos=Math.max(.001,...all); const L=110,R=70; const k=(w-L-R)/(pos-neg); const X0=L+(-neg)*k; const bh=Math.min(34,(h-30)/6);
    parts.concat([['Total',tot,p.ink]]).forEach(([n,v,c],i)=>{ const y=14+i*(bh+10); LK.text(ctx,n,L-10,y+bh/2,{align:'right',size:12,weight:i===4?800:600}); ctx.fillStyle=c; const x=v<0?X0+v*k:X0; ctx.fillRect(x,y,Math.abs(v)*k,bh); LK.text(ctx,(v<0?'−':'')+LK.fmt(Math.abs(v),2)+' kg',v<0?X0+6:X0+v*k+6,y+bh/2,{align:'left',size:11,mono:1,color:p.ink2}); });
    ctx.strokeStyle=p.ink2; ctx.beginPath(); ctx.moveTo(X0,8); ctx.lineTo(X0,14+5*(bh+10)-6); ctx.stroke();
    const big=parts.slice().sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]))[0][0];
    ro({t:LK.fmt(tot,2)+' kg CO₂e',y:LK.fmt(tot/st.years,3)+' kg CO₂e',big});
    note.innerHTML=`${esc(eolNote)} A <b>life cycle assessment</b> totals the environmental impact of every stage: raw material extraction and processing, manufacture, distribution, use and end of life. Designers reduce impact by choosing recycled or renewable materials, using less material, using renewable energy, sourcing locally and designing for disassembly and long life. <span class="muted">Carbon factors are rough, indicative values for comparing options – not real product data.</span>`; }
  draw();
  return ()=>cv.ro.disconnect();
 }});

/* ------------- circular economy ------------- */
const CE=[
 ['bio','Cascades','Biological materials are used again in lower-value products before returning to nature – e.g. cotton clothing → insulation → stuffing; timber → chipboard.','Choose untreated natural materials that can cascade.'],
 ['bio','Extraction of biochemical feedstock','Chemicals and materials are extracted from biological waste, e.g. oils, bioplastics made from food waste.','Design with materials that can be processed into feedstock.'],
 ['bio','Anaerobic digestion','Microbes break down food and garden waste without oxygen, producing biogas for energy and digestate fertiliser.','Avoid mixing biological and technical materials so waste can be digested.'],
 ['bio','Composting and regeneration','Biodegradable materials become compost and return nutrients to the soil to grow new crops and trees.','Use compostable packaging, natural fibres and non-toxic finishes.'],
 ['tech','Share','Increase how often a product is used – rental bikes, tool libraries, car clubs. Keeps the most value.','Design robust products for many users; product-service systems.'],
 ['tech','Maintain / prolong','Keep products working longer through care, servicing and repair.','Design for repair: standard fasteners, available spare parts, modular components, repair guides.'],
 ['tech','Reuse / redistribute','Products are sold or given to new users – second-hand sales, refill schemes.','Timeless design and durable materials so products keep their value.'],
 ['tech','Refurbish / remanufacture','Products or components are restored to “as new” condition, e.g. remanufactured engines, refurbished phones and printer cartridges.','Design for disassembly; make high-value parts easy to remove and replace.'],
 ['tech','Recycle','The product is broken down into materials to make new products. Keeps the least value because energy is used and quality may drop.','Use mono-materials, label polymers with identification codes, avoid composites and coatings that cannot be separated.']];
LK.reg('circular',{title:'Circular economy “butterfly”',cat:'Sustainability',topics:['12.1','9.1'],blurb:'Click each loop of the biological and technical cycles to see how materials are kept in use and how designers can enable them.',
 icon:LK.ico('<path d="M50 50C30 20 6 26 10 46s30 20 40 4zM50 50c20-30 44-24 40-4s-30 20-40 4z"/><path d="M50 30v50"/>'),
 mount(el){
  const p=LK.P(); const box=LK.el('<div style="overflow-x:auto"></div>'); el.appendChild(box);
  const card=LK.el('<div class="card" style="margin-top:12px"><span class="muted">Click a loop. Inner loops (closest to the user) keep the most value and use the least energy.</span></div>'); el.appendChild(card);
  LK.note(el,'A <b>circular economy</b> designs out waste and pollution, keeps products and materials in use at their highest value, and regenerates natural systems – instead of the linear “take, make, dispose” model. The <b>biological cycle</b> (left) is for materials that can safely return to nature; the <b>technical cycle</b> (right) is for metals, polymers and other materials that should be kept circulating.');
  const W=680,H=420,cx=340; const nodes=[[cx,40,'Raw materials'],[cx,110,'Parts manufacturer'],[cx,170,'Product manufacturer'],[cx,230,'Retailer / service provider'],[cx,300,'User'],[cx,380,'Leakage – minimise']];
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:560px;display:block;font-family:var(--f-body)">`;
  const bioCol='#2c9a5a', techCol=p.brand;
  // loops right (tech): from user (300) up to nodes
  const tech=[[4,280,26],[5,230,58],[6,170,92],[7,110,128],[8,70,166]]; // index, top y, radius
  tech.forEach(([i,ty,r],k)=>{ const ox=cx+16; s+=`<path data-i="${i}" d="M${ox} 300 C${ox+r*1.6} 300 ${ox+r*1.6} ${ty} ${ox} ${ty}" fill="none" stroke="${techCol}" stroke-width="12" stroke-linecap="round" opacity="${.45+k*.1}" style="cursor:pointer"/><g style="pointer-events:none"><circle cx="${ox+r*1.2}" cy="${(300+ty)/2}" r="11" fill="${p.surface}" stroke="${techCol}" stroke-width="2"/><text x="${ox+r*1.2}" y="${(300+ty)/2+4}" text-anchor="middle" font-size="12" font-weight="800" fill="${p.ink}">${i+1}</text></g>`; });
  const bio=[[0,230,40],[1,170,80],[2,110,120],[3,40,166]];
  bio.forEach(([i,ty,r],k)=>{ const ox=cx-16; s+=`<path data-i="${i}" d="M${ox} 300 C${ox-r*1.6} 300 ${ox-r*1.6} ${ty} ${ox} ${ty}" fill="none" stroke="${bioCol}" stroke-width="12" stroke-linecap="round" opacity="${.45+k*.12}" style="cursor:pointer"/><g style="pointer-events:none"><circle cx="${ox-r*1.2}" cy="${(300+ty)/2}" r="11" fill="${p.surface}" stroke="${bioCol}" stroke-width="2"/><text x="${ox-r*1.2}" y="${(300+ty)/2+4}" text-anchor="middle" font-size="12" font-weight="800" fill="${p.ink}">${i+1}</text></g>`; });
  s+=`<path d="M${cx} 50V372" stroke="${p.line2}" stroke-width="4"/>`;
  nodes.forEach(([x,y,t],i)=>{ s+=`<g><rect x="${x-80}" y="${y-14}" width="160" height="28" rx="14" fill="${i===5?p.badSoft:p.surface}" stroke="${i===5?p.bad:p.line2}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="12" font-weight="700" fill="${p.ink}">${t}</text></g>`; });
  s+=`<text x="20" y="24" font-size="13" font-weight="800" fill="${bioCol}">BIOLOGICAL CYCLE</text><text x="${W-20}" y="24" text-anchor="end" font-size="13" font-weight="800" fill="${techCol}">TECHNICAL CYCLE</text></svg>`;
  box.innerHTML=s;
  const leg=LK.el('<div class="row" style="gap:6px;margin-top:10px"></div>'); box.after(leg); CE.forEach((c,i)=>{ const b=LK.el(`<button type="button" class="chip" style="cursor:pointer;border-color:${c[0]==='bio'?bioCol:techCol}"><b>${i+1}</b> ${esc(c[1])}</button>`); b.onclick=()=>box.querySelector(`path[data-i="${i}"]`).dispatchEvent(new Event('click')); leg.appendChild(b); });
  box.querySelectorAll('path[data-i]').forEach(pa=>{ pa.setAttribute('tabindex','0'); pa.setAttribute('role','button'); const go=()=>{ box.querySelectorAll('path[data-i]').forEach(x=>x.setAttribute('stroke-width',12)); pa.setAttribute('stroke-width',18); const c=CE[+pa.dataset.i]; card.innerHTML=`<span class="chip" style="border-color:${c[0]==='bio'?bioCol:techCol}">${c[0]==='bio'?'Biological cycle':'Technical cycle'}</span><h3 style="margin:8px 0 4px">${c[1]}</h3><p style="margin:0 0 6px">${c[2]}</p><p style="margin:0"><b>Design for it:</b> ${c[3]}</p>`; }; pa.addEventListener('click',go); pa.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } }); });
 }});

/* ------------- smart factory ------------- */
const FAC={asrs:['ASRS – automated storage and retrieval system','Computer-controlled racking where a crane stores and picks pallets automatically. It knows exactly where every item is, uses tall narrow aisles to save floor space, reduces labour and errors, and links to the stock control system.'],agv:['AGV – automated guided vehicle','A driverless vehicle that moves materials around the factory, following wires, magnetic tape, lasers or vision systems. It can work 24/7 and is safer and more predictable than forklifts, but has high set-up cost and needs clear routes.'],robot:['Industrial robot','A multi-axis robot arm loads parts into the CNC machine. Robots are used for repetitive, dangerous or precise jobs (welding, painting, assembly, pick-and-place). They are fast, accurate and consistent, but expensive and need programming and maintenance.'],cnc:['CNC machine and flexible manufacturing cell','Computer-controlled machines grouped in a cell with a robot can switch quickly between different products – a flexible manufacturing system (FMS). This suits batch production and mass customisation.'],qc:['Automated inspection','A vision system or probe checks each part against the CAD data. Faults are found immediately (quality control), feeding data back to adjust the process (quality assurance, Six Sigma).'],kanban:['Kanban and just-in-time (JIT)','When a bin of finished parts is used, a Kanban card (or electronic signal) is sent back to tell the previous stage to make or deliver more. Parts are only made when needed – lean manufacturing with minimal stock, less waste and less storage space.'],cim:['CIM – computer-integrated manufacturing','All stages – design (CAD), planning, stock control, machining (CAM), handling and despatch – are linked by computers sharing data in real time, for example through ERP software and the Internet of Things (Industry 4.0).']};
LK.reg('factory',{title:'Smart factory lab',cat:'Industry',topics:['8.3a','8.3b','8.3c'],blurb:'An animated factory: an AGV collects parts from an ASRS, a robot loads a CNC cell, parts are inspected and a Kanban signal pulls the next part. Click anything to learn about it.',
 icon:LK.ico('<path d="M8 88V44l20-12v12l20-12v12l20-12v56z"/><path d="M76 88V20h10v68"/><rect x="18" y="60" width="10" height="10"/><rect x="40" y="60" width="10" height="10"/>'),
 mount(el){
  const st={t:0,sel:'cim',kan:0,done:0};
  const cv=LK.canvas(el,w=>Math.min(380,Math.max(260,w*.52)));
  const card=LK.el('<div class="card" style="margin-top:12px"></div>'); el.appendChild(card);
  const show=k=>{ st.sel=k; card.innerHTML=`<h3 style="margin:0 0 6px">${FAC[k][0]}</h3><p style="margin:0">${FAC[k][1]}</p>`; }; show('cim');
  const btns=LK.el('<div class="row" style="margin-top:10px;gap:6px"></div>'); el.insertBefore(btns,card); Object.entries(FAC).forEach(([k,v])=>{ const b=LK.el(`<button class="btn btn-sm" type="button">${esc(v[0].split(' – ')[0].split(' and ')[0])}</button>`); b.onclick=()=>show(k); btns.appendChild(b); });
  let hits=[]; LK.pointer(cv.cv,{down:pt=>{ const s=Math.min(cv.w/640,cv.h/320); const ox=(cv.w-640*s)/2, oy=(cv.h-320*s)/2; const x=(pt.x-ox)/s, y=(pt.y-oy)/s; const hit=hits.find(h=>x>=h[0]&&x<=h[0]+h[2]&&y>=h[1]&&y<=h[1]+h[3]); if(hit) show(hit[4]); }});
  const stop=LK.loop(dt=>{ if(!LK.reduce()) st.t+=dt; draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const s=Math.min(w/640,h/320); ctx.save(); ctx.translate((w-640*s)/2,(h-320*s)/2); ctx.scale(s,s); hits=[];
    const cyc=12, t=st.t%cyc; const hl=k=>st.sel===k?p.accent:p.line2;
    const box=(x,y,ww,hh,k,label)=>{ ctx.fillStyle=p.surface; ctx.fillRect(x,y,ww,hh); ctx.strokeStyle=hl(k); ctx.lineWidth=st.sel===k?3:1.5; ctx.strokeRect(x,y,ww,hh); LK.text(ctx,label,x+ww/2,y+hh+12,{align:'center',size:12,weight:700,color:p.ink2}); hits.push([x,y,ww,hh+18,k]); };
    // ASRS
    box(20,40,110,190,'asrs','ASRS'); for(let r=0;r<6;r++) for(let c=0;c<3;c++){ ctx.fillStyle=(r*3+c)%4===0?p.surface:'#c9a46a'; ctx.fillRect(28+c*34,48+r*30,28,22); } const cy=48+((Math.sin(st.t*.7)+1)/2)*150; ctx.fillStyle=p.brand; ctx.fillRect(24,cy,102,6);
    // AGV path
    ctx.strokeStyle=p.line2; ctx.setLineDash([8,6]); ctx.lineWidth=2; ctx.strokeRect(150,250,330,40); ctx.setLineDash([]); hits.push([150,240,330,60,'agv']);
    let ax; if(t<3) ax=150+t/3*250; else if(t<6) ax=400; else if(t<9) ax=400-(t-6)/3*250; else ax=150; ctx.fillStyle=st.sel==='agv'?p.accent:p.navy; ctx.fillRect(ax-26,256,52,26); ctx.fillStyle='#c9a46a'; if(t<6) ctx.fillRect(ax-12,246,24,12); ctx.fillStyle=p.ink; [ax-18,ax+18].forEach(x=>{ ctx.beginPath(); ctx.arc(x,284,5,0,7); ctx.fill(); }); LK.text(ctx,'AGV',ax,269,{align:'center',size:10,weight:700,color:'#fff'});
    // robot + cnc
    box(300,60,110,120,'robot','Robot'); const ang=-1.2+Math.sin(st.t*1.3)*.9; const bx=355, by=170; const j1={x:bx+Math.cos(ang)*55,y:by+Math.sin(ang)*55}; const j2={x:j1.x+Math.cos(ang+1.2)*40,y:j1.y+Math.sin(ang+1.2)*40}; ctx.strokeStyle=p.brand; ctx.lineWidth=9; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(j1.x,j1.y); ctx.lineTo(j2.x,j2.y); ctx.stroke(); ctx.lineCap='butt'; ctx.fillStyle=p.ink; ctx.beginPath(); ctx.arc(bx,by,8,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(j1.x,j1.y,5,0,7); ctx.fill();
    box(430,60,90,120,'cnc','CNC cell'); ctx.fillStyle=p.bg; ctx.fillRect(442,80,66,60); ctx.fillStyle=p.muted; ctx.fillRect(470,80,8,30+Math.sin(st.t*5)*8); ctx.fillStyle='#c9a46a'; ctx.fillRect(460,124,30,12);
    // inspection
    box(540,60,80,60,'qc','Inspection'); ctx.fillStyle=p.ink2; ctx.fillRect(570,66,20,14); ctx.fillStyle=`rgba(46,160,90,${.3+.3*Math.sin(st.t*4)})`; ctx.beginPath(); ctx.moveTo(574,80); ctx.lineTo(560,112); ctx.lineTo(600,112); ctx.lineTo(586,80); ctx.closePath(); ctx.fill();
    // conveyor + kanban
    ctx.fillStyle=p.line; ctx.fillRect(520,190,110,14); for(let i=0;i<6;i++){ const x=520+((st.t*30+i*20)%110); ctx.fillStyle='#c9a46a'; ctx.fillRect(x,180,12,10); }
    box(540,230,80,50,'kanban','Kanban bin'); const full=Math.floor((st.t%6)/1.5); for(let i=0;i<4;i++){ ctx.fillStyle=i<4-full?'#c9a46a':p.bg; ctx.fillRect(548+i*18,248,14,22); } if(full>=3){ ctx.fillStyle=p.warn; ctx.fillRect(560,236,40,10); LK.text(ctx,'card',580,241,{align:'center',size:8,weight:700,color:'#000'}); }
    // CIM network
    ctx.strokeStyle=st.sel==='cim'?p.accent:p.brand; ctx.setLineDash([2,5]); ctx.lineWidth=1.5; [[75,40],[355,60],[475,60],[580,60],[580,230]].forEach(([x,y])=>{ ctx.beginPath(); ctx.moveTo(320,18); ctx.lineTo(x,y); ctx.stroke(); }); ctx.setLineDash([]); ctx.fillStyle=st.sel==='cim'?p.accent:p.brand; ctx.fillRect(280,4,80,24); LK.text(ctx,'CIM / ERP',320,16,{align:'center',size:11,weight:700,color:'#fff'}); hits.push([280,4,80,24,'cim']);
    ctx.restore(); }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ------------- design movements timeline ------------- */
const MOV=[
 ['Arts and Crafts',1860,1910,'#7a8b4a','William Morris','Truth to materials, honest visible construction, handcraft over machines, beauty and usefulness together – a reaction against poor-quality, mass-produced Victorian goods.','Stylised natural forms (flowers, leaves, birds), repeating patterns, natural local materials such as oak, wool and linen, simple solid furniture.','Strawberry Thief textile (1883), Red House (1859), Morris chair'],
 ['Art Nouveau',1890,1910,'#b0558c','Charles Rennie Mackintosh','A “new art” for the modern age – a total work of art where building, interior and objects are designed together; high craftsmanship applied to everyday objects.','Organic whiplash curves, plant stems, insects and peacock feathers; Mackintosh added strong verticals, grids, high-backed chairs and the stylised Glasgow rose.','Glasgow School of Art, Hill House chair, Argyle chair'],
 ['Bauhaus (Modernism)',1919,1933,'#d7261e','Marianne Brandt','Form follows function; no unnecessary ornament; design for industrial mass production so good design is affordable; unite art, craft and industry.','Simple geometric forms (circle, square, triangle), primary colours, clean lines, tubular steel, glass and chrome.','MT49 tea infuser (1924), Kandem bedside lamp (1928)'],
 ['Art Deco',1920,1939,'#c9a24a','Eileen Gray','Celebrate the modern machine age and luxury together; glamour and optimism after World War I.','Zig-zags, chevrons, sunbursts, stepped ziggurat shapes, symmetry; luxurious materials (lacquer, ivory, gold) with chrome and Bakelite; Egyptian motifs.','Bibendum chair (1926), E-1027 adjustable table (1927), Dragon chair'],
 ['Streamlining',1930,1955,'#3c7fb0','Raymond Loewy','Good appearance sells – “ugliness does not sell”; MAYA (Most Advanced Yet Acceptable); styling inspired by aerodynamics to boost sales in the Depression.','Teardrop shapes, rounded fronts and tapering backs, horizontal speed lines, chrome, smooth pressed steel – often form over function.','Pencil sharpener (1933), Coldspot refrigerator (1934), Greyhound Scenicruiser, Studebaker Avanti'],
 ['Post Modernism',1970,2000,'#7b4bc4','Philippe Starck','“Less is a bore” – design can have humour, emotion and story; democratic design that is affordable through mass-produced polymers.','Playful, sculptural, ironic forms; historical references in modern materials; bright polymers and cast metals.','Juicy Salif lemon squeezer (1990), Louis Ghost chair (2002), Hot Bertaa kettle'],
 ['Memphis',1981,1987,'#e0632a','Ettore Sottsass','Challenge “good taste” and functionalism; design for fun and emotion.','Bright clashing colours, plastic laminates, terrazzo, squiggles and dots, pattern on pattern, asymmetric totem-like forms.','Carlton bookcase (1981), Casablanca sideboard, Valentine typewriter (1969)']];
LK.reg('timeline',{title:'Design movements timeline',cat:'Design history',topics:['5.4'],blurb:'An interactive timeline of the seven design movements on the spec, with each movement’s philosophy, style and key products, and a “spot the movement” quiz.',
 icon:LK.ico('<path d="M6 50h88"/><circle cx="18" cy="50" r="5"/><circle cx="42" cy="50" r="5"/><circle cx="64" cy="50" r="5"/><circle cx="86" cy="50" r="5"/><path d="M18 50V30M42 50v20M64 50V30M86 50v20"/>'),
 mount(el){
  const body=document.createElement('div'); let sc=0,n=0;
  LK.subtabs(el,[['tl','Timeline'],['quiz','Spot the movement']],k=>{ k==='tl'?tl():quiz(); });
  el.appendChild(body);
  function tl(){ const y0=1850,y1=2005; const X=y=>((y-y0)/(y1-y0)*100);
    body.innerHTML=`<div style="position:relative;height:${MOV.length*34+40}px;border:1px solid var(--line);border-radius:10px;background:var(--surface-2);overflow:hidden" role="list">
      ${[1850,1875,1900,1925,1950,1975,2000].map(y=>`<div style="position:absolute;left:${X(y)}%;top:0;bottom:0;border-left:1px dashed var(--line-strong)"><span class="mono" style="position:absolute;bottom:4px;left:3px;font-size:.72rem;color:var(--muted)">${y}</span></div>`).join('')}
      ${MOV.map((m,i)=>`<button type="button" role="listitem" data-i="${i}" style="position:absolute;left:${X(m[1])}%;width:max(${X(m[2])-X(m[1])}%, ${m[0].length*7.4+18}px);top:${8+i*34}px;height:26px;border-radius:6px;border:0;background:${m[3]};color:#fff;font-weight:700;font-size:.78rem;white-space:nowrap;overflow:visible;text-align:left;padding:0 8px;cursor:pointer">${esc(m[0])}</button>`).join('')}</div><div class="card mv" style="margin-top:12px"><span class="muted">Click a movement to see its details.</span></div>`;
    const card=body.querySelector('.mv'); body.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ const m=MOV[+b.dataset.i]; card.innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(m[0])}</h3><span class="chip">${m[1]}–${m[2]===2000?'present':m[2]} · ${esc(m[4])}</span></div><p style="margin:8px 0 4px"><b>Philosophy:</b> ${esc(m[5])}</p><p style="margin:0 0 4px"><b>Style:</b> ${esc(m[6])}</p><p style="margin:0"><b>Key works:</b> ${esc(m[7])}</p>`; }); }
  function quiz(){ const i=Math.floor(Math.random()*MOV.length); const m=MOV[i]; const kind=['style','phil','works','designer'][Math.floor(Math.random()*4)]; const clue=kind==='style'?m[6]:kind==='phil'?m[5]:kind==='works'?m[7]:m[4]+' is the designer on the spec for this movement.';
    const opts=MOV.map((x,j)=>j).sort(()=>Math.random()-.5).filter(j=>j!==i).slice(0,3).concat([i]).sort(()=>Math.random()-.5);
    body.innerHTML=`<div class="qz"><div class="row" style="justify-content:space-between"><span class="eyebrow">Which movement is this? (${kind==='style'?'visual style':kind==='phil'?'philosophy':kind==='works'?'key works':'designer'})</span><span class="mono muted">${sc}/${n}</span></div><div class="qz-q">${esc(clue)}</div><div class="qz-opts">${opts.map((j,k)=>`<button type="button" data-j="${j}"><span class="l">${'ABCD'[k]}</span><span>${esc(MOV[j][0])}</span></button>`).join('')}</div><div class="qa"></div></div>`;
    body.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{ const ok=+b.dataset.j===i; n++; if(ok) sc++; body.querySelectorAll('[data-j]').forEach(x=>{ x.disabled=true; if(+x.dataset.j===i) x.classList.add('right'); }); if(!ok) b.classList.add('wrong'); body.querySelector('.qa').innerHTML=`<div class="qz-exp"><b>${ok?'Correct.':'Not quite.'}</b> ${esc(m[0])} (${m[1]}–${m[2]===2000?'present':m[2]}), ${esc(m[4])}. Key works: ${esc(m[7])}.</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" type="button">Next →</button></div>`; body.querySelector('.qa .btn').onclick=quiz; }); }
 }});

/* ------------- exam maths trainer ------------- */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)); const pick=a=>a[Math.floor(Math.random()*a.length)]; const r2=v=>Math.round(v*100)/100;
const MQ={
 waste:()=>{ const W=pick([600,800,1000,1200]), H=pick([400,500,600]); const a=pick([80,100,120,150]), b=pick([50,60,75,90,100]); const n=Math.floor(W/a)*Math.floor(H/b); const used=n*a*b, tot=W*H; const ans=r2((tot-used)/tot*100);
   return {q:`A sheet of acrylic measures ${W} mm × ${H} mm. Rectangular parts ${a} mm × ${b} mm are cut from it, all the same way round. What percentage of the sheet is wasted? (Ignore the saw kerf.)`,ans,u:'%',tol:.05,s:[`Parts across: ${W} ÷ ${a} = ${Math.floor(W/a)} (whole parts only). Parts down: ${H} ÷ ${b} = ${Math.floor(H/b)}.`,`Number of parts = ${Math.floor(W/a)} × ${Math.floor(H/b)} = ${n}.`,`Area used = ${n} × ${a} × ${b} = ${used.toLocaleString()} mm². Sheet area = ${tot.toLocaleString()} mm².`,`Waste = (${tot.toLocaleString()} − ${used.toLocaleString()}) ÷ ${tot.toLocaleString()} × 100 = ${ans}%.`]}; },
 area:()=>{ const L=ri(8,20)*10, W=ri(5,12)*10, d=ri(2,4)*10; const A=L*W-Math.PI*(d/2)**2; const ans=Math.round(A);
   return {q:`A rectangular aluminium plate is ${L} mm × ${W} mm with a ${d} mm diameter hole in the centre. Calculate the area of the plate to the nearest mm². (Use π = 3.142)`,ans,u:'mm²',tol:Math.max(2,ans*.002),s:[`Area of rectangle = ${L} × ${W} = ${(L*W).toLocaleString()} mm².`,`Radius of hole = ${d} ÷ 2 = ${d/2} mm. Area of hole = π × ${d/2}² = ${r2(Math.PI*(d/2)**2)} mm².`,`Plate area = ${(L*W).toLocaleString()} − ${r2(Math.PI*(d/2)**2)} = ${ans.toLocaleString()} mm².`]}; },
 mass:()=>{ const m=pick([['pine',500],['oak',700],['aluminium',2700],['mild steel',7850],['ABS',1050]]); const l=ri(5,20)*10, w=ri(3,10)*10, t=pick([5,10,15,20,25]); const v=l*w*t; const kg=v/1e9*m[1]; const ans=r2(kg*1000);
   return {q:`A block of ${m[0]} measures ${l} mm × ${w} mm × ${t} mm. The density of ${m[0]} is ${m[1].toLocaleString()} kg/m³. Calculate its mass in grams.`,ans,u:'g',tol:Math.max(.05,ans*.01),s:[`Volume = ${l} × ${w} × ${t} = ${v.toLocaleString()} mm³.`,`Convert to m³: 1 m³ = 1,000,000,000 mm³, so volume = ${v.toLocaleString()} ÷ 1,000,000,000 = ${(v/1e9).toExponential(3)} m³.`,`Mass = density × volume = ${m[1]} × ${(v/1e9).toExponential(3)} = ${r2(kg).toString()} kg = ${ans} g.`]}; },
 cost:()=>{ const price=pick([18,24,32,45,60]); const a=ri(10,40)*10, b=ri(10,30)*10, n=pick([20,50,100,250]); const per=price*a*b/1e6; const ans=r2(per*n);
   return {q:`Birch plywood costs £${price} per m². A product needs one ${a} mm × ${b} mm panel. How much will the plywood cost for a batch of ${n} products?`,ans,u:'£',tol:.02,s:[`Panel area = ${a} × ${b} = ${(a*b).toLocaleString()} mm² = ${(a*b/1e6)} m² (divide by 1,000,000).`,`Cost per panel = ${a*b/1e6} × £${price} = £${r2(per).toFixed(2)}.`,`Batch cost = £${r2(per).toFixed(2)} × ${n} = £${ans.toFixed(2)}. (Work with the unrounded value: £${r2(price*a*b/1e6*n).toFixed(2)}.)`]}; },
 pyth:()=>{ const a=ri(3,12)*50, b=ri(3,12)*50; const c=Math.hypot(a,b); const ans=Math.round(c*10)/10;
   return {q:`A rectangular frame is ${a} mm wide and ${b} mm high. A diagonal brace is fixed from one corner to the opposite corner. Calculate the length of the brace to 1 decimal place.`,ans,u:'mm',tol:.06,s:[`Use Pythagoras: c² = a² + b².`,`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a+b*b}.`,`c = √${a*a+b*b} = ${ans} mm.`]}; },
 mean:()=>{ const n=ri(6,9); const xs=Array.from({length:n},()=>r2(24.8+Math.random()*.4)); const s=xs.reduce((a,b)=>a+b,0); const ans=Math.round(s/n*1000)/1000;
   return {q:`A quality inspector measures the diameter of ${n} turned parts (mm): ${xs.map(x=>x.toFixed(2)).join(', ')}. Calculate the mean diameter to 3 decimal places.`,ans,u:'mm',tol:.0015,s:[`Add all the values: ${xs.map(x=>x.toFixed(2)).join(' + ')} = ${r2(s).toFixed(2)}.`,`Divide by the number of values: ${r2(s).toFixed(2)} ÷ ${n} = ${ans.toFixed(3)} mm.`]}; },
 range:()=>{ const n=ri(6,9); const xs=Array.from({length:n},()=>ri(40,90)); const s=xs.slice().sort((a,b)=>a-b); const med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
   return {q:`Users rated a product prototype out of 100: ${xs.join(', ')}. What is the median score?`,ans:med,u:'',tol:.01,s:[`Put the values in order: ${s.join(', ')}.`,n%2?`There are ${n} values, so the median is the middle (${(n+1)/2}th) value = ${med}.`:`There are ${n} values, so the median is halfway between the ${n/2}th and ${n/2+1}th values: (${s[n/2-1]} + ${s[n/2]}) ÷ 2 = ${med}.`]}; },
 pie:()=>{ const tot=pick([120,150,200,240,360,400,600]); const part=ri(1,Math.floor(tot*.6/10))*10; const ans=r2(part/tot*360);
   return {q:`In a survey of ${tot} people, ${part} preferred a matt finish. What angle would this sector be on a pie chart? (to 2 decimal places)`,ans,u:'°',tol:.01,s:[`Fraction = ${part} ÷ ${tot} = ${r2(part/tot)}.`,`Angle = ${part} ÷ ${tot} × 360° = ${ans}°.`]}; },
 pct:()=>{ const old=ri(8,60)*1, inc=pick([5,8,10,12,15,20,25]); const up=Math.random()<.6; const ans=r2(old*(1+(up?inc:-inc)/100));
   return {q:`The manufacturing cost of a product is £${old.toFixed(2)}. Material prices ${up?'rise':'fall'} so the cost ${up?'increases':'decreases'} by ${inc}%. What is the new cost?`,ans,u:'£',tol:.01,s:[`${inc}% of £${old.toFixed(2)} = ${inc} ÷ 100 × ${old.toFixed(2)} = £${r2(old*inc/100).toFixed(2)}.`,`New cost = £${old.toFixed(2)} ${up?'+':'−'} £${r2(old*inc/100).toFixed(2)} = £${ans.toFixed(2)}. (Or multiply by ${up?1+inc/100:1-inc/100}.)`]}; },
 scale:()=>{ const sc=pick([2,5,10,20]); const meas=ri(15,90); const ans=meas*sc;
   return {q:`A working drawing is drawn to a scale of 1:${sc}. A length on the drawing measures ${meas} mm. What is the actual length of the product?`,ans,u:'mm',tol:.01,s:[`1:${sc} means the real object is ${sc} times larger than the drawing.`,`Actual length = ${meas} × ${sc} = ${ans} mm.`]}; },
 ratio:()=>{ const a=pick([2,3,4]), b=1; const tot=pick([150,200,240,300,360]); const resin=r2(tot*a/(a+b));
   return {q:`Epoxy resin and hardener are mixed in the ratio ${a}:${b} by volume. How much resin is needed to make ${tot} ml of mixture?`,ans:resin,u:'ml',tol:.05,s:[`Total parts = ${a} + ${b} = ${a+b}.`,`One part = ${tot} ÷ ${a+b} = ${r2(tot/(a+b))} ml.`,`Resin = ${a} × ${r2(tot/(a+b))} = ${resin} ml.`]}; },
 circ:()=>{ const d=ri(8,40)*10; const ans=Math.round(Math.PI*d);
   return {q:`Edge banding is applied around a circular table top of diameter ${d} mm. What length of banding is needed, to the nearest mm?`,ans,u:'mm',tol:1.01,s:[`Circumference = π × diameter.`,`= 3.142 × ${d} = ${ans} mm (to the nearest mm).`]}; },
 profit:()=>{ const mat=r2(ri(150,900)/100), lab=r2(ri(200,1200)/100), oh=pick([10,15,20,25]); const markup=pick([20,25,30,40,50]); const cost=(mat+lab)*(1+oh/100); const ans=r2(cost*(1+markup/100));
   return {q:`A product costs £${mat.toFixed(2)} in materials and £${lab.toFixed(2)} in labour. Overheads add ${oh}% to this total. The manufacturer adds a ${markup}% profit mark-up. What is the selling price (to the nearest penny)?`,ans,u:'£',tol:.011,s:[`Direct costs = £${mat.toFixed(2)} + £${lab.toFixed(2)} = £${r2(mat+lab).toFixed(2)}.`,`With overheads = £${r2(mat+lab).toFixed(2)} × ${1+oh/100} = £${r2(cost).toFixed(2)}.`,`Selling price = £${r2(cost).toFixed(2)} × ${1+markup/100} = £${ans.toFixed(2)}.`]}; },
 volcyl:()=>{ const d=ri(2,8)*10, hh=ri(3,15)*10; const v=Math.PI*(d/2)**2*hh; const ans=Math.round(v/1000*10)/10;
   return {q:`A cylindrical container has an internal diameter of ${d} mm and a height of ${hh} mm. Calculate its volume in cm³ to 1 decimal place.`,ans,u:'cm³',tol:.11,s:[`Volume = π r² h, r = ${d/2} mm.`,`= 3.142 × ${d/2}² × ${hh} = ${Math.round(v).toLocaleString()} mm³.`,`1 cm³ = 1000 mm³, so volume = ${ans} cm³.`]}; },
};
const MQN={waste:'Material waste %',area:'Area',mass:'Volume, density and mass',cost:'Material costing',pyth:'Pythagoras',mean:'Mean',range:'Median',pie:'Pie chart angles',pct:'Percentage change',scale:'Scale drawings',ratio:'Ratio',circ:'Circumference',profit:'Selling price and mark-up',volcyl:'Volume of a cylinder'};
LK.reg('maths',{title:'Exam maths trainer',cat:'Maths',topics:['X.1','11.2'],blurb:'Unlimited exam-style maths questions – costing, waste, area, volume, mass, Pythagoras, statistics, ratios and more – with worked solutions.',
 icon:LK.ico('<rect x="16" y="10" width="68" height="80" rx="6"/><rect x="26" y="20" width="48" height="16"/><path d="M30 50h8M46 50h8M62 50h8M30 64h8M46 64h8M62 64h8M30 78h8M46 78h24"/>'),
 mount(el){
  const st={type:'mix',q:null,sc:0,n:0};
  const ctrl=LK.ctrl(el); LK.select(ctrl,{label:'Topic',options:[['mix','Mixed']].concat(Object.entries(MQN)),value:'mix',on:v=>{st.type=v; next();}});
  const sc=LK.el('<span class="mono muted"></span>'); ctrl.appendChild(sc);
  const body=document.createElement('div'); el.appendChild(body);
  LK.note(el,'In the exam, show every step of working – most maths marks are for the method. Keep values unrounded until the final answer, include units, and check your answer is sensible. A calculator is allowed.');
  function next(){ const k=st.type==='mix'?pick(Object.keys(MQ)):st.type; st.q=MQ[k](); st.k=k;
    body.innerHTML=`<div class="qz"><span class="eyebrow">${esc(MQN[k])}</span><div class="qz-q">${esc(st.q.q)}</div><div class="row"><label class="field" style="flex-direction:row;align-items:center;gap:8px">Answer <input type="number" step="any" inputmode="decimal" style="width:150px" aria-label="Your answer"> ${esc(st.q.u)}</label><button class="btn primary" type="button" data-a="check">Check</button><button class="btn" type="button" data-a="show">Show working</button><button class="btn ghost" type="button" data-a="next">New question</button></div><div class="qa" aria-live="polite" style="margin-top:12px"></div></div>`;
    const inp=body.querySelector('input'); const qa=body.querySelector('.qa');
    const work=()=>`<ol style="margin:8px 0 0;padding-left:20px">${st.q.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
    body.querySelector('[data-a=check]').onclick=()=>{ const v=parseFloat(inp.value); if(isNaN(v)){ qa.innerHTML='<div class="qz-exp">Type a number first.</div>'; return; } st.n++; const ok=Math.abs(v-st.q.ans)<=st.q.tol; if(ok) st.sc++; sc.textContent=`${st.sc}/${st.n} correct`; qa.innerHTML=`<div class="qz-exp"><b style="color:var(--${ok?'good':'bad'})">${ok?'Correct!':'Not quite.'}</b> ${ok?'':'Answer: '+st.q.ans+' '+esc(st.q.u)}${work()}</div>`; };
    body.querySelector('[data-a=show]').onclick=()=>{ qa.innerHTML=`<div class="qz-exp"><b>Answer: ${st.q.ans} ${esc(st.q.u)}</b>${work()}</div>`; };
    body.querySelector('[data-a=next]').onclick=next; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') body.querySelector('[data-a=check]').click(); }); }
  next();
 }});
})();
