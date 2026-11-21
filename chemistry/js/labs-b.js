/* TrainTanmay Chemistry labs, part B: electrochemical cells, ion tests, 3D shapes, interactive spectra. */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmtS=([c,s],m=1)=>(c*m===1?'':c*m)+s;

/* ======================= ELECTROCHEMICAL CELLS ======================= */
const HALF=[
 {id:'mg',n:'Mg²⁺/Mg',E:-2.37,e:2,ox:[1,'Mg²⁺'],red:[1,'Mg'],metal:'rgb(190,195,200)',sol:'rgba(200,210,230,.35)'},
 {id:'zn',n:'Zn²⁺/Zn',E:-0.76,e:2,ox:[1,'Zn²⁺'],red:[1,'Zn'],metal:'rgb(170,180,190)',sol:'rgba(200,210,230,.35)'},
 {id:'fe',n:'Fe²⁺/Fe',E:-0.44,e:2,ox:[1,'Fe²⁺'],red:[1,'Fe'],metal:'rgb(120,120,125)',sol:'rgba(170,210,160,.45)'},
 {id:'ni',n:'Ni²⁺/Ni',E:-0.25,e:2,ox:[1,'Ni²⁺'],red:[1,'Ni'],metal:'rgb(160,160,150)',sol:'rgba(120,200,120,.45)'},
 {id:'pb',n:'Pb²⁺/Pb',E:-0.13,e:2,ox:[1,'Pb²⁺'],red:[1,'Pb'],metal:'rgb(110,115,130)',sol:'rgba(200,210,230,.35)'},
 {id:'h',n:'2H⁺/H₂ (standard hydrogen electrode, Pt)',E:0.00,e:2,ox:[2,'H⁺'],red:[1,'H₂'],pt:true,gas:true,sol:'rgba(200,210,230,.3)'},
 {id:'cu',n:'Cu²⁺/Cu',E:0.34,e:2,ox:[1,'Cu²⁺'],red:[1,'Cu'],metal:'rgb(200,120,70)',sol:'rgba(90,150,230,.5)'},
 {id:'i',n:'I₂/I⁻ (Pt)',E:0.54,e:2,ox:[1,'I₂'],red:[2,'I⁻'],pt:true,halide:true,sol:'rgba(150,90,40,.45)'},
 {id:'fe3',n:'Fe³⁺/Fe²⁺ (Pt)',E:0.77,e:1,ox:[1,'Fe³⁺'],red:[1,'Fe²⁺'],pt:true,sol:'rgba(220,180,80,.45)'},
 {id:'ag',n:'Ag⁺/Ag',E:0.80,e:1,ox:[1,'Ag⁺'],red:[1,'Ag'],metal:'rgb(215,215,220)',sol:'rgba(200,210,230,.35)'},
 {id:'br',n:'Br₂/Br⁻ (Pt)',E:1.09,e:2,ox:[1,'Br₂'],red:[2,'Br⁻'],pt:true,halide:true,sol:'rgba(200,110,40,.45)'},
 {id:'cl',n:'Cl₂/Cl⁻ (Pt)',E:1.36,e:2,ox:[1,'Cl₂'],red:[2,'Cl⁻'],pt:true,gas:true,halide:true,sol:'rgba(200,230,150,.4)'}];
L.cells={title:'Electrochemical cell builder',cat:'Electrochemistry',topic:'5.2.3',
desc:'Connect any two half-cells and read the cell potential. See which electrode is positive, which way the electrons flow, what happens in the salt bridge, and how changing a concentration changes E.',
icon:'<path d="M14 54h30v50H14zM76 54h30v50H76z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M29 54V24h62v30" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="60" cy="24" r="12" fill="var(--surface)" stroke="currentColor" stroke-width="4"/><path d="M38 70c0-14 44-14 44 0" fill="none" stroke="currentColor" stroke-width="6" opacity=".5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let a='zn', b='cu', ca=1, cb=1, bridge=true;
 const opt=HALF.map(h=>[h.id,`${h.n}   E° = ${h.E>=0?'+':''}${h.E.toFixed(2)} V`]);
 const sa=LK.select(ct,{label:'Left half-cell',options:opt,value:a,on:v=>{a=v;}});
 const sb=LK.select(ct,{label:'Right half-cell',options:opt,value:b,on:v=>{b=v;}});
 const ka=LK.slider(ct,{label:'Left ion concentration',min:0.01,max:2,step:0.01,value:1,fmt:v=>v.toFixed(2)+' mol dm⁻³',on:v=>{ca=v;}});
 const kb=LK.slider(ct,{label:'Right ion concentration',min:0.01,max:2,step:0.01,value:1,fmt:v=>v.toFixed(2)+' mol dm⁻³',on:v=>{cb=v;}});
 LK.check(ct,'Salt bridge in place',true,v=>{bridge=v;});
 const st=LK.stage(el,S,{ratio:0.55,maxH:400});
 const ro=LK.readout(el,[['E0','E°cell (standard)'],['E','E at these concentrations'],['pos','positive electrode (reduced)'],['neg','negative electrode (oxidised)']]);
 const eq=LK.el('<div class="rxn" style="margin-top:8px"></div>'); el.appendChild(eq);
 LK.note(el,'E°<sub>cell</sub> = E°(positive electrode) − E°(negative electrode). The half-cell with the <b>more positive</b> E° is the positive electrode: its equilibrium shifts right, so it is <b>reduced</b>. The more negative one is oxidised and releases electrons, which flow through the <b>wire</b> to the positive electrode. The <b>salt bridge</b> (filter paper soaked in KNO₃) lets ions move to keep both solutions neutral; without it no current flows and the voltmeter reads 0. Standard conditions are 1 mol dm⁻³, 298 K, 100 kPa. Making a metal-ion solution <b>more concentrated</b> shifts its equilibrium to the right, so its potential becomes <b>more positive</b> (a limitation of E° predictions under non-standard conditions).');
 const H=id=>HALF.find(h=>h.id===id);
 const Ehalf=(h,c)=>{ /* simple concentration effect (Nernst-style): ion on the left raises E, halide on the right lowers it */ const k=0.0257/h.e; if(h.id==='h') return h.E+k*Math.log(c*c); return h.halide?h.E-k*Math.log(c*c):h.E+k*Math.log(c); };
 const ph=[];
 for(let i=0;i<14;i++) ph.push(i/14);
 let tt=0;
 S.loop(dt=>{ tt+=dt; const P=LK.P(), x=st.ctx, W=st.w, Hh=st.h; st.clear(); LK.grid(x,W,Hh,24);
  const A=H(a), B=H(b), EA=Ehalf(A,ca), EB=Ehalf(B,cb), same=a===b;
  const posLeft=EA>EB; const E0=Math.abs(A.E-B.E), E=bridge?Math.abs(EA-EB):0;
  const bw=W*0.28, bh=Hh*0.42, by=Hh*0.5, lx=W*0.08, rx=W*0.64;
  [[lx,A,posLeft],[rx,B,!posLeft]].forEach(([bx,h,pos])=>{
   x.fillStyle=h.sol; x.fillRect(bx,by+bh*0.18,bw,bh*0.82); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(bx,by); x.lineTo(bx,by+bh); x.lineTo(bx+bw,by+bh); x.lineTo(bx+bw,by); x.stroke();
   const ex=bx+bw*0.35; x.fillStyle=h.pt?'rgb(200,200,205)':h.metal; x.fillRect(ex-9,by-Hh*0.28,18,bh*0.95+Hh*0.28-bh*0.15); x.strokeStyle=P.ink; x.strokeRect(ex-9,by-Hh*0.28,18,bh*0.95+Hh*0.28-bh*0.15);
   if(h.gas){ for(let k=0;k<5;k++){ const yy=by+bh*0.9-((tt*40+k*30)%(bh*0.7)); x.beginPath(); x.arc(ex+16,yy,3,0,7); x.strokeStyle=P.ink2; x.lineWidth=1; x.stroke(); } }
   LK.text(x,h.n.split(' (')[0],bx+4,by+bh+18,P.ink,{size:12,weight:700});
   if(!same) LK.text(x,pos?'positive (+): reduction':'negative (−): oxidation',bx+4,by+bh+34,pos?P.good:P.bad,{size:11,mono:false,weight:600});
  });
  /* wire and voltmeter */
  const xl=lx+bw*0.35, xr=rx+bw*0.35, wy=Hh*0.1; x.strokeStyle=P.ink; x.lineWidth=2.5; x.beginPath(); x.moveTo(xl,by-Hh*0.28); x.lineTo(xl,wy); x.lineTo(xr,wy); x.lineTo(xr,by-Hh*0.28); x.stroke();
  const vx=W/2; x.fillStyle=P.surface; x.beginPath(); x.arc(vx,wy,26,0,7); x.fill(); x.stroke(); LK.text(x,E.toFixed(2)+' V',vx,wy+5,P.brand,{size:14,weight:800,align:'center'});
  /* electrons from negative to positive */
  if(bridge&&!same){ const from=posLeft?xr:xl, to=posLeft?xl:xr, L1=by-Hh*0.28-wy, tot=2*L1+Math.abs(to-from);
   for(let k=0;k<10;k++){ const s=((tt*60+k*tot/10)%tot); let px,py; if(s<L1){ px=from; py=by-Hh*0.28-s; } else if(s<L1+Math.abs(to-from)){ px=from+Math.sign(to-from)*(s-L1); py=wy; } else { px=to; py=wy+(s-L1-Math.abs(to-from)); }
     x.beginPath(); x.arc(px,py,4,0,7); x.fillStyle=P.accent; x.fill(); LK.text(x,'e⁻',px+5,py-5,P.accent,{size:10}); }
   LK.arrow(x,posLeft?W/2+70:W/2-70,wy-38,posLeft?W/2-70:W/2+70,wy-38,P.accent,2,8); LK.text(x,'electron flow (− to +)',W/2,wy-46,P.accent,{size:11,align:'center',mono:false}); }
  /* salt bridge */
  if(bridge){ x.strokeStyle='rgba(230,200,120,.85)'; x.lineWidth=14; x.beginPath(); x.moveTo(lx+bw*0.8,by+bh*0.45); x.lineTo(lx+bw*0.8,by-Hh*0.06); x.lineTo(rx+bw*0.2,by-Hh*0.06); x.lineTo(rx+bw*0.2,by+bh*0.45); x.stroke();
   LK.text(x,'salt bridge (KNO₃)',W/2,by-Hh*0.06-12,P.muted,{size:11,align:'center',mono:false});
   if(!same){ const span=rx+bw*0.2-(lx+bw*0.8); for(let k=0;k<4;k++){ const f=((tt*0.25+k/4)%1); const kx=posLeft?(rx+bw*0.2-f*span):(lx+bw*0.8+f*span); x.fillStyle=P.teal; x.beginPath(); x.arc(kx,by-Hh*0.06-3,3,0,7); x.fill(); const nx=posLeft?(lx+bw*0.8+f*span):(rx+bw*0.2-f*span); x.fillStyle=P.warn; x.beginPath(); x.arc(nx,by-Hh*0.06+4,3,0,7); x.fill(); }
    LK.text(x,'● K⁺ → positive side   ● NO₃⁻ → negative side',W/2,by-Hh*0.06+22,P.ink2,{size:10,align:'center',mono:false}); } }
  else LK.text(x,'No salt bridge: circuit incomplete, no current',W/2,by-Hh*0.06,P.bad,{size:12,align:'center',mono:false,weight:600});
  ro.set('E0',(same?0:E0).toFixed(2)+' V'); ro.set('E',(same?0:E).toFixed(2)+' V'); ro.set('pos',same?'–':(posLeft?A:B).n.split(' (')[0]); ro.set('neg',same?'–':(posLeft?B:A).n.split(' (')[0]);
  if(!same){ const red=posLeft?A:B, oxd=posLeft?B:A; const l=red.e*oxd.e/(function g(p,q){return q?g(q,p%q):p;})(red.e,oxd.e); const mr=l/red.e, mo=l/oxd.e;
   const txt=`Reduction (+): ${fmtS(red.ox)} + ${red.e===1?'':red.e}e⁻ → ${fmtS(red.red)}<br>Oxidation (−): ${fmtS(oxd.red)} → ${fmtS(oxd.ox)} + ${oxd.e===1?'':oxd.e}e⁻<br><b>Overall: ${fmtS(red.ox,mr)} + ${fmtS(oxd.red,mo)} → ${fmtS(red.red,mr)} + ${fmtS(oxd.ox,mo)}</b>`;
   if(eq.innerHTML!==txt) eq.innerHTML=txt; } else eq.textContent='Choose two different half-cells.';
 });
 el.lkPreset=o=>{ if(o.a){ sa.value=o.a; a=o.a; } if(o.b){ sb.value=o.b; b=o.b; } };
 return ()=>S.dispose(); }};

/* ======================= ION TESTS BENCH ======================= */
const CMPS=[
 {f:'CuSO₄',cat:'Cu',an:'SO4',sol:'rgb(120,175,235)'},{f:'CuCl₂',cat:'Cu',an:'Cl',sol:'rgb(110,190,200)'},
 {f:'FeSO₄',cat:'Fe2',an:'SO4',sol:'rgb(205,225,180)'},{f:'FeCl₃',cat:'Fe3',an:'Cl',sol:'rgb(232,190,95)'},
 {f:'MnCl₂',cat:'Mn',an:'Cl',sol:'rgb(246,228,234)'},{f:'CrCl₃',cat:'Cr',an:'Cl',sol:'rgb(105,150,110)'},
 {f:'NH₄Cl',cat:'NH4',an:'Cl'},{f:'(NH₄)₂SO₄',cat:'NH4',an:'SO4'},{f:'Na₂CO₃',cat:'Na',an:'CO3'},
 {f:'KBr',cat:'K',an:'Br'},{f:'NaI',cat:'Na',an:'I'},{f:'NaCl',cat:'Na',an:'Cl'},{f:'(NH₄)₂CO₃',cat:'NH4',an:'CO3'},{f:'FeBr₂',cat:'Fe2',an:'Br'}];
const HYDROX={Cu:['blue precipitate','rgb(60,120,220)'],Fe2:['green precipitate','rgb(80,115,70)'],Fe3:['orange-brown precipitate','rgb(170,90,30)'],Mn:['light brown precipitate','rgb(195,165,125)'],Cr:['grey-green precipitate','rgb(110,130,105)']};
const CATN={Cu:'Cu²⁺',Fe2:'Fe²⁺',Fe3:'Fe³⁺',Mn:'Mn²⁺',Cr:'Cr³⁺',NH4:'NH₄⁺',Na:'Na⁺',K:'K⁺'}, ANN={SO4:'SO₄²⁻',Cl:'Cl⁻',Br:'Br⁻',I:'I⁻',CO3:'CO₃²⁻'};
L.iontests={title:'Ion tests bench',cat:'Analysis',topic:'5.3.2',anim:false,
desc:'Identify unknown solutions with test-tube tests: sodium hydroxide, ammonia, nitric acid, barium nitrate, silver nitrate and the ammonium test. Results depend on the order you do them in, just like the real thing.',
icon:'<path d="M46 6v84a14 14 0 0 0 28 0V6" fill="none" stroke="currentColor" stroke-width="5"/><path d="M47 60h26v30a13 13 0 0 1-26 0z" fill="currentColor" opacity=".35"/><path d="M47 84h26v6a13 13 0 0 1-26 0z" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let idx=Math.floor(Math.random()*CMPS.length), show=false, st0={};
 const letters='ABCDEFGHIJKLMN'.split('');
 const order=CMPS.map((_,i)=>i).sort(()=>Math.random()-0.5);
 const sel=LK.select(ct,{label:'Solution',options:order.map((i,k)=>[String(i),'Unknown '+letters[k]]),value:String(order[0]),on:v=>{idx=+v;fresh();}});
 idx=order[0];
 LK.check(ct,'Show the names (practice mode)',false,v=>{ show=v; Array.from(sel.options).forEach((o,k)=>o.textContent=v?CMPS[order[k]].f:'Unknown '+letters[k]); });
 const rg=LK.ctrl(el); const box=LK.el('<div style="display:flex;flex-wrap:wrap;gap:8px"></div>'); rg.appendChild(box);
 const RG=[['naoh','NaOH(aq): a few drops'],['naohx','NaOH(aq): in excess'],['nh3','NH₃(aq): a few drops'],['nh3x','NH₃(aq): in excess'],['warm','Warm with NaOH, hold damp red litmus'],['hno3','Dilute HNO₃'],['lime','Bubble any gas through limewater'],['ba','Ba(NO₃)₂(aq)'],['ag','AgNO₃(aq)'],['nh3d','Dilute NH₃ (to a silver halide)'],['nh3c','Conc. NH₃ (to a silver halide)'],['fresh','Fresh sample']];
 RG.forEach(([k,l])=>LK.button(box,l,()=>k==='fresh'?fresh():apply(k),k==='fresh'?'ghost':''));
 const stg=LK.stage(el,S,{ratio:0.5,maxH:320});
 const log=LK.el('<ol class="muted" style="margin:8px 0 0;padding-left:20px;font-size:.92rem"></ol>'); el.appendChild(log);
 const idc=LK.el(`<div class="card" style="margin-top:12px"><b>Identify it</b><div class="row" style="margin-top:8px;gap:10px;flex-wrap:wrap"><label class="field">Cation<select data-c>${Object.entries(CATN).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label class="field">Anion<select data-a>${Object.entries(ANN).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><button class="btn btn-sm primary" data-chk>Check</button></div><p data-fb style="margin:8px 0 0"></p></div>`); el.appendChild(idc);
 idc.querySelector('[data-chk]').onclick=()=>{ const C=CMPS[idx], c=idc.querySelector('[data-c]').value, a=idc.querySelector('[data-a]').value; const ok=(c===C.cat||(['Na','K'].includes(c)&&['Na','K'].includes(C.cat)))&&a===C.an; idc.querySelector('[data-fb]').innerHTML=ok?`<b style="color:var(--good)">Correct.</b> It's ${C.f}.`:`<b style="color:var(--bad)">Not quite.</b> ${c===C.cat||(['Na','K'].includes(c)&&['Na','K'].includes(C.cat))?'The cation is right; check the anion tests again.':a===C.an?'The anion is right; check the cation tests again.':'Look again at both sets of tests.'}${(['Na','K'].includes(C.cat))?' (Na⁺ and K⁺ give no precipitates: they are identified by elimination, or by a flame test.)':''}`; };
 LK.note(el,'<b>Cations:</b> NaOH(aq) or NH₃(aq) give hydroxide precipitates: Cu²⁺ blue (dissolves in excess NH₃ to a dark blue solution), Fe²⁺ green (turns orange-brown at the surface in air), Fe³⁺ orange-brown, Mn²⁺ light brown (darkens in air), Cr³⁺ grey-green (dissolves in excess NaOH to a dark green solution and in excess NH₃ to a purple solution). NH₄⁺: warm with NaOH; ammonia turns damp red litmus blue. <b>Anions</b>, in this order: CO₃²⁻ (dilute HNO₃: effervescence, CO₂ turns limewater milky), SO₄²⁻ (Ba²⁺: white precipitate), halides (HNO₃ then AgNO₃: white AgCl, cream AgBr, yellow AgI; AgCl dissolves in dilute NH₃, AgBr only in concentrated, AgI in neither). Carbonate also gives precipitates with Ba²⁺ and Ag⁺, so add HNO₃ first.');
 let tube={col:null,ppt:null,pcol:null,fizz:0,litmus:null,lime:null,acid:false,co3:false,agx:null,age:0};
 function fresh(){ const C=CMPS[idx]; tube={col:C.sol||'rgb(235,240,248)',ppt:null,pcol:null,fizz:0,litmus:null,lime:null,acid:false,co3:C.an==='CO3',agx:null,age:0,gas:false,oh:false}; log.innerHTML=''; say('Fresh sample of the solution: '+(C.sol?'coloured solution':'colourless solution')+'.'); draw(); }
 function say(t){ log.appendChild(LK.el(`<li>${t}</li>`)); }
 function apply(k){ const C=CMPS[idx], T=tube, hyd=HYDROX[C.cat];
  if(k==='naoh'||k==='nh3'){ T.oh=true; if(hyd){ if(!T.ppt||T.ppt==='hyd'){ T.ppt='hyd'; T.pcol=hyd[1]; T.age=0; say(`${k==='naoh'?'NaOH':'NH₃'}: ${hyd[0]}.`); } } else say(`${k==='naoh'?'NaOH':'NH₃'}: no visible change.`); }
  else if(k==='naohx'){ T.oh=true; if(C.cat==='Cr'){ T.ppt=null; T.col='rgb(35,105,55)'; say('Excess NaOH: the grey-green precipitate dissolves to give a dark green solution.'); } else if(hyd){ T.ppt='hyd'; T.pcol=T.pcol||hyd[1]; say(`Excess NaOH: ${hyd[0]}, no further change.`); } else say('Excess NaOH: no visible change.'); }
  else if(k==='nh3x'){ T.oh=true; if(C.cat==='Cu'){ T.ppt=null; T.col='rgb(30,45,165)'; say('Excess NH₃: the blue precipitate dissolves to give a dark blue solution.'); } else if(C.cat==='Cr'){ T.ppt=null; T.col='rgb(115,60,150)'; say('Excess NH₃: the grey-green precipitate dissolves to give a purple solution.'); } else if(hyd){ T.ppt='hyd'; T.pcol=T.pcol||hyd[1]; say(`Excess NH₃: ${hyd[0]}, no further change.`); } else say('Excess NH₃: no visible change.'); }
  else if(k==='warm'){ T.oh=true; if(C.cat==='NH4'){ T.litmus='blue'; T.gas=true; say('Warmed with NaOH: a gas is given off that turns damp red litmus paper blue (ammonia).'); } else { T.litmus='red'; if(hyd&&!T.ppt){ T.ppt='hyd'; T.pcol=hyd[1]; } say('Warmed with NaOH: damp red litmus stays red.'+(hyd?' ('+hyd[0]+' forms.)':'')); } }
  else if(k==='hno3'){ T.acid=true; if(T.co3){ T.fizz=3; T.co3=false; T.gas=true; T.co2=true; say('Dilute HNO₃: effervescence (fizzing).'); } else say('Dilute HNO₃: no visible change.'); if(T.ppt==='hyd'){ T.ppt=null; say('(The hydroxide precipitate dissolves in the acid.)'); } }
  else if(k==='lime'){ if(T.co2){ T.lime='milky'; say('The gas turns limewater milky: carbon dioxide.'); } else { T.lime='clear'; say(T.gas?'The gas does not turn limewater milky.':'No gas to test.'); } }
  else if(k==='ba'){ if(C.an==='SO4'){ T.ppt='ba'; T.pcol='rgb(248,248,248)'; say('Ba(NO₃)₂: white precipitate.'); } else if(T.co3){ T.ppt='ba'; T.pcol='rgb(248,248,248)'; say('Ba(NO₃)₂: white precipitate.'); } else say('Ba(NO₃)₂: no visible change.'); }
  else if(k==='ag'){ const X={Cl:['white precipitate','rgb(250,250,250)'],Br:['cream precipitate','rgb(240,228,190)'],I:['yellow precipitate','rgb(240,220,90)']}[C.an];
   if(X){ T.ppt='ag'; T.agx=C.an; T.pcol=X[1]; say('AgNO₃: '+X[0]+'.'+(T.acid?'':' (No acid was added first.)')); } else if(T.co3){ T.ppt='ag'; T.agx='CO3'; T.pcol='rgb(245,240,220)'; say('AgNO₃: pale precipitate. (No acid was added first.)'); } else if(T.oh&&!T.acid){ T.ppt='ag'; T.agx='OH'; T.pcol='rgb(120,90,60)'; say('AgNO₃: brown precipitate (silver oxide, from the hydroxide you added).'); } else say('AgNO₃: no visible change.'); }
  else if(k==='nh3d'||k==='nh3c'){ if(T.ppt!=='ag'){ say('There is no silver halide precipitate to test.'); } else { const d=T.agx==='Cl'||(k==='nh3c'&&T.agx==='Br')||T.agx==='CO3'; if(d){ T.ppt=null; say(`${k==='nh3d'?'Dilute':'Concentrated'} NH₃: the precipitate dissolves.`); } else say(`${k==='nh3d'?'Dilute':'Concentrated'} NH₃: the precipitate does not dissolve.`); } }

  draw(); }
 function draw(){ const P=LK.P(), x=stg.ctx, W=stg.w, H=stg.h; stg.clear(); LK.grid(x,W,H,24);
  const T=tube, tx=W*0.3, ty=H*0.08, tw=46, th=H*0.8;
  x.save(); x.beginPath(); x.moveTo(tx-tw/2,ty); x.lineTo(tx-tw/2,ty+th-tw/2); x.arc(tx,ty+th-tw/2,tw/2,Math.PI,0,true); x.lineTo(tx+tw/2,ty); x.clip();
  x.fillStyle=T.col||'rgb(235,240,248)'; x.globalAlpha=0.8; x.fillRect(tx-tw/2,ty+th*0.35,tw,th); x.globalAlpha=1;
  if(T.ppt){ let col=T.pcol; if(T.ppt==='hyd'&&(CMPS[idx].cat==='Fe2'||CMPS[idx].cat==='Mn')){ const f=Math.min(1,T.age/12); col=(CMPS[idx].cat==='Fe2')?mixc('rgb(80,115,70)','rgb(165,95,35)',f*0.7):mixc('rgb(195,165,125)','rgb(95,65,40)',f*0.6); }
   x.fillStyle=col; x.fillRect(tx-tw/2,ty+th*0.78,tw,th); for(let k=0;k<40;k++){ x.globalAlpha=0.5; x.fillRect(tx-tw/2+((k*37)%tw),ty+th*0.4+((k*53)%(th*0.38)),3,3); } x.globalAlpha=1; }
  if(T.fizz>0){ for(let k=0;k<14;k++){ const yy=ty+th*0.95-((performance.now()/12+k*23)%(th*0.6)); x.beginPath(); x.arc(tx-tw/3+((k*13)%(tw*0.66)),yy,2.5,0,7); x.strokeStyle=P.ink2; x.lineWidth=1; x.stroke(); } }
  x.restore();
  x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(tx-tw/2,ty); x.lineTo(tx-tw/2,ty+th-tw/2); x.arc(tx,ty+th-tw/2,tw/2,Math.PI,0,true); x.lineTo(tx+tw/2,ty); x.stroke();
  if(T.litmus){ x.fillStyle=T.litmus==='blue'?'rgb(60,90,200)':'rgb(210,60,70)'; x.fillRect(tx-6,ty-44,12,40); LK.text(x,'damp litmus',tx+12,ty-26,P.ink2,{size:11,mono:false}); }
  if(T.lime){ const lx=W*0.62, ly=H*0.35; x.fillStyle=T.lime==='milky'?'rgb(235,235,235)':'rgba(200,220,240,.5)'; x.fillRect(lx,ly,50,H*0.45); x.strokeStyle=P.ink2; x.strokeRect(lx,ly,50,H*0.45); LK.text(x,'limewater: '+T.lime,lx-6,ly-8,P.ink2,{size:11,mono:false}); }
  LK.text(x,show?CMPS[idx].f:'Unknown '+letters[order.indexOf(idx)],tx-30,H-4,P.ink,{size:13,weight:700});
 }
 const mixc=(a,b,f)=>{ const p=s=>s.match(/\d+/g).map(Number); const A=p(a),B=p(b); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')})`; };
 S.loop(dt=>{ let ch=false; if(tube.fizz>0){ tube.fizz-=dt; ch=true; } if(tube.ppt==='hyd'&&(CMPS[idx].cat==='Fe2'||CMPS[idx].cat==='Mn')&&tube.age<12){ tube.age+=dt; ch=true; } if(ch) draw(); });
 el.lkPreset=o=>{}; fresh(); return ()=>S.dispose(); }};

/* ======================= 3D SHAPES ======================= */
const COL={C:'#3a3d44',H:'#f2f2f2',O:'#e0403a',N:'#3c64d8',Cl:'#3fb34f',F:'#9be08a',B:'#f0a0a0',Be:'#c8c890',P:'#f08a28',S:'#e8d040',X:'#888'};
const RAD={H:0.28,C:0.42,N:0.42,O:0.42,Cl:0.52,F:0.38,B:0.42,Be:0.42,P:0.5,S:0.5,X:0.55};
const nrm=v=>{ const l=Math.hypot(...v); return v.map(c=>c/l); };
const pyr=(deg)=>{ const c2=(Math.cos(deg*Math.PI/180)+0.5)/1.5, ca=Math.sqrt(c2), sa=Math.sqrt(1-c2); return [0,120,240].map(p=>[sa*Math.cos(p*Math.PI/180),sa*Math.sin(p*Math.PI/180),-ca]); };
const TET=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(nrm);
const mk=(centre,dirs,lig,lps,bl=1.4,order=1)=>{ const at=[[centre,0,0,0]], bo=[]; dirs.forEach((d,i)=>{ at.push([lig[i]||lig[0],d[0]*bl,d[1]*bl,d[2]*bl]); bo.push([0,i+1,order]); }); return {at,bo,lp:(lps||[]).map(d=>[0,...d])}; };
const MOLS={
 co2:{n:'CO₂: linear, 180°',info:'2 bonding regions (two double bonds), no lone pairs on C. The regions repel equally and get as far apart as possible: 180°.',...mk('C',[[1,0,0],[-1,0,0]],['O'],[],1.3,2)},
 becl2:{n:'BeCl₂: linear, 180°',info:'2 bonding pairs, no lone pairs: linear, 180°.',...mk('Be',[[1,0,0],[-1,0,0]],['Cl'])},
 bf3:{n:'BF₃: trigonal planar, 120°',info:'3 bonding pairs, no lone pairs: trigonal planar, 120°, all in one plane.',...mk('B',[[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],['F'])},
 ch4:{n:'CH₄: tetrahedral, 109.5°',info:'4 bonding pairs, no lone pairs: tetrahedral, 109.5°.',...mk('C',TET,['H'],[],1.2)},
 nh4:{n:'NH₄⁺: tetrahedral, 109.5°',info:'4 bonding pairs (one is dative), no lone pairs: tetrahedral, 109.5°. All four N–H bonds are identical.',...mk('N',TET,['H'],[],1.2)},
 nh3:{n:'NH₃: pyramidal, 107°',info:'3 bonding pairs + 1 lone pair. The lone pair repels more strongly than bonding pairs, squeezing the H–N–H angle from 109.5° to about 107°.',...mk('N',pyr(107),['H'],[[0,0,1]],1.2)},
 h2o:{n:'H₂O: non-linear (bent), 104.5°',info:'2 bonding pairs + 2 lone pairs. Two lone pairs squeeze the angle further, to about 104.5°.',...mk('O',[[Math.sin(52.25*Math.PI/180),0,-Math.cos(52.25*Math.PI/180)],[-Math.sin(52.25*Math.PI/180),0,-Math.cos(52.25*Math.PI/180)]],['H'],[[0,0.83,0.56],[0,-0.83,0.56]],1.2)},
 pcl5:{n:'PCl₅: trigonal bipyramidal, 90° and 120°',info:'5 bonding pairs: three in a triangle (120°) and two above and below (90° to the triangle).',...mk('P',[[0,0,1],[0,0,-1],[1,0,0],[-0.5,0.866,0],[-0.5,-0.866,0]],['Cl'],[],1.5)},
 sf6:{n:'SF₆: octahedral, 90°',info:'6 bonding pairs: octahedral, all angles 90°. Sulfur has expanded its octet (12 electrons around S).',...mk('S',[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],['F'],[],1.4)},
 zbut:{n:'Z-but-2-ene (cis)',info:'Restricted rotation about the C=C. Each carbon has two different groups (CH₃ and H). The higher-priority groups (CH₃) are on the same side: Z.',at:[['C',-0.67,0,0],['C',0.67,0,0],['C',-1.45,1.2,0],['H',-1.25,-0.95,0],['C',1.45,1.2,0],['H',1.25,-0.95,0]],bo:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],lp:[],lab:{2:'CH₃',4:'CH₃'}},
 ebut:{n:'E-but-2-ene (trans)',info:'The CH₃ groups are on opposite sides of the C=C: E. The two isomers can’t interconvert because the π bond stops rotation.',at:[['C',-0.67,0,0],['C',0.67,0,0],['C',-1.45,1.2,0],['H',-1.25,-0.95,0],['C',1.45,-1.2,0],['H',1.25,0.95,0]],bo:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],lp:[],lab:{2:'CH₃',4:'CH₃'}},
 ala:{n:'Alanine: a chiral centre',info:'The central carbon has four different groups (H, CH₃, NH₂, COOH), so it is a chiral centre. Tick "mirror image" to see the other optical isomer: you can’t rotate one to look exactly like the other.',at:[['C',0,0,0],['H',...TET[0].map(v=>v*1.1)],['C',...TET[1].map(v=>v*1.5)],['N',...TET[2].map(v=>v*1.5)],['C',...TET[3].map(v=>v*1.5)]],bo:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lp:[],lab:{2:'CH₃',3:'NH₂',4:'COOH'}}};
L.shapes={title:'3D shapes of molecules',cat:'Atoms & bonding',topic:'2.2.2',
desc:'Spin molecules in 3D to see how bonding pairs and lone pairs arrange themselves. Includes every shape you need, plus E/Z isomers of but-2-ene and the optical isomers of alanine.',
icon:'<circle cx="60" cy="62" r="14" fill="currentColor"/><g stroke="currentColor" stroke-width="5"><path d="M60 62L60 16M60 62L22 86M60 62L98 86M60 62l18 10"/></g><circle cx="60" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="20" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="100" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let m='nh3', yaw=0.6, pitch=-0.35, spin=true, mirror=false, showLP=true, drag=null;
 LK.select(ct,{label:'Molecule',options:Object.entries(MOLS).map(([k,v])=>[k,v.n]),value:m,on:v=>{m=v;info.innerHTML=MOLS[m].info;}});
 LK.check(ct,'Spin',true,v=>{spin=v;}); LK.check(ct,'Show lone pairs',true,v=>{showLP=v;}); LK.check(ct,'Mirror image',false,v=>{mirror=v;});
 const st=LK.stage(el,S,{ratio:0.62,maxH:440});
 const info=LK.el('<p style="margin:8px 0 0"></p>'); el.appendChild(info); info.innerHTML=MOLS[m].info;
 LK.note(el,'Electron pairs around the central atom repel and get as far apart as possible. Lone pairs repel more than bonding pairs, so each lone pair reduces the bond angle by about 2.5°. Count bonding pairs and lone pairs on the central atom; a double bond counts as one region of electron density. <b>Drag</b> the molecule to turn it.');
 const cv=st.cv; cv.style.cursor='grab'; cv.style.touchAction='none';
 S.on(cv,'pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,yaw,pitch}; cv.setPointerCapture(e.pointerId); cv.style.cursor='grabbing'; });
 S.on(cv,'pointermove',e=>{ if(!drag) return; yaw=drag.yaw+(e.clientX-drag.x)*0.01; pitch=clamp(drag.pitch+(e.clientY-drag.y)*0.01,-1.5,1.5); });
 S.on(cv,'pointerup',()=>{ drag=null; cv.style.cursor='grab'; });
 S.loop(dt=>{ if(spin&&!drag) yaw+=dt*0.5; const P=LK.P(), x=st.ctx, W=st.w, H=st.h; st.clear();
  const M=MOLS[m], sc=Math.min(W,H)*0.2, cx=W/2, cy=H/2;
  const tr=([px,py,pz])=>{ if(mirror) px=-px; const cyw=Math.cos(yaw), syw=Math.sin(yaw); let X=px*cyw+pz*syw, Z=-px*syw+pz*cyw; const cp=Math.cos(pitch), sp=Math.sin(pitch); let Y=py*cp-Z*sp; Z=py*sp+Z*cp; const f=4/(4+Z*0.35); return {x:cx+X*sc*f,y:cy-Y*sc*f,z:Z,f}; };
  const A=M.at.map(a=>({el:a[0],...tr([a[1],a[2],a[3]])}));
  const items=[];
  M.bo.forEach(([i,j,o])=>items.push({z:(A[i].z+A[j].z)/2-0.01,draw:()=>{ const a=A[i],b=A[j]; x.strokeStyle=P.ink2; x.lineCap='round'; if(o===2){ const dx=b.x-a.x, dy=b.y-a.y, l=Math.hypot(dx,dy)||1, ox=-dy/l*4, oy=dx/l*4; x.lineWidth=4; x.beginPath(); x.moveTo(a.x+ox,a.y+oy); x.lineTo(b.x+ox,b.y+oy); x.moveTo(a.x-ox,a.y-oy); x.lineTo(b.x-ox,b.y-oy); x.stroke(); } else { x.lineWidth=7; x.beginPath(); x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); x.stroke(); } }}));
  if(showLP) M.lp.forEach(([i,dx,dy,dz])=>{ const c=A[i], tip=tr([dx*1.15+M.at[i][1],dy*1.15+M.at[i][2],dz*1.15+M.at[i][3]]); items.push({z:tip.z,draw:()=>{ x.save(); x.globalAlpha=0.45; x.fillStyle=P.accent; x.beginPath(); x.ellipse((c.x+tip.x)/2+(tip.x-c.x)*0.25,(c.y+tip.y)/2+(tip.y-c.y)*0.25,sc*0.28*tip.f,sc*0.18*tip.f,Math.atan2(tip.y-c.y,tip.x-c.x),0,7); x.fill(); x.restore(); x.fillStyle=P.accent; [-1,1].forEach(s=>{ x.beginPath(); x.arc(tip.x+s*4,tip.y,2.6,0,7); x.fill(); }); }}); });
  A.forEach((a,i)=>items.push({z:a.z,draw:()=>{ const r=RAD[a.el]*sc*a.f*0.95; const g=x.createRadialGradient(a.x-r*0.35,a.y-r*0.35,r*0.1,a.x,a.y,r); g.addColorStop(0,'#ffffff'); g.addColorStop(0.25,COL[a.el]); g.addColorStop(1,shade(COL[a.el])); x.fillStyle=g; x.beginPath(); x.arc(a.x,a.y,r,0,7); x.fill(); x.strokeStyle='rgba(0,0,0,.35)'; x.lineWidth=1; x.stroke();
    const lab=(M.lab&&M.lab[i])||(a.el!=='C'||i===0&&!M.lab?a.el:''); if(lab) LK.text(x,lab,a.x,a.y+4,a.el==='H'||a.el==='S'||a.el==='F'||a.el==='Be'?'#222':'#fff',{size:Math.max(10,Math.round(r*0.62)),weight:700,align:'center'}); }}));
  items.sort((p,q)=>p.z-q.z).forEach(it=>it.draw());
  LK.text(x,M.n,12,22,P.ink,{size:14,weight:700,mono:false});
  if(mirror) LK.text(x,'mirror image',12,42,P.accent,{size:12,mono:false});
 });
 function shade(h){ const n=parseInt(h.slice(1),16); const r=(n>>16)*0.55, g=((n>>8)&255)*0.55, b=(n&255)*0.55; return `rgb(${r|0},${g|0},${b|0})`; }
 el.lkPreset=o=>{}; return ()=>S.dispose(); }};

/* ======================= INTERACTIVE SPECTRA ======================= */
const SPX={
 ethanol:{n:'ethanol',p:['CH₃','–','CH₂','–','OH'],
  ir:[[3350,260,0.8,'O–H (alcohol), broad because of hydrogen bonding: 3200–3600 cm⁻¹',[4]],[2970,70,0.55,'C–H stretch: 2850–3100 cm⁻¹ (almost every organic compound)',[0,2]],[1050,50,0.75,'C–O stretch: 1000–1300 cm⁻¹',[2,4]]],
  h:[[1.2,3,3,'CH₃: next to a CH₂ (2 H), so 2 + 1 = 3 peaks (triplet)',[0]],[3.7,2,4,'CH₂: bonded to O so higher δ (3.0–4.3); next to CH₃ (3 H), so a quartet',[2]],[2.6,1,1,'O–H: a singlet (no splitting); disappears if D₂O is added',[4]]],
  c:[[58,'C bonded to O (50–70 ppm)',[2]],[18,'CH₃ carbon (5–55 ppm)',[0]]],
  ms:[[46,28,'M⁺: [CH₃CH₂OH]⁺, so Mᵣ = 46'],[45,40,'[M − H]⁺'],[31,100,'CH₂OH⁺ (typical of a primary alcohol)'],[29,22,'C₂H₅⁺'],[27,20,'C₂H₃⁺'],[15,8,'CH₃⁺']]},
 prop1:{n:'propan-1-ol',p:['CH₃','–','CH₂','–','CH₂','–','OH'],
  ir:[[3330,260,0.8,'O–H (alcohol), broad',[6]],[2960,80,0.6,'C–H stretch',[0,2,4]],[1060,50,0.75,'C–O stretch',[4,6]]],
  h:[[0.9,3,3,'CH₃: next to CH₂ (2 H): triplet',[0]],[1.6,2,6,'middle CH₂: 3 + 2 = 5 neighbouring H, so 6 peaks (sextet)',[2]],[3.6,2,3,'CH₂ bonded to O (high δ), next to CH₂: triplet',[4]],[2.3,1,1,'O–H: singlet, disappears with D₂O',[6]]],
  c:[[64,'C bonded to O',[4]],[26,'middle CH₂',[2]],[10,'CH₃',[0]]],
  ms:[[60,8,'M⁺, Mᵣ = 60'],[59,6,'[M − H]⁺'],[31,100,'CH₂OH⁺ (primary alcohol)'],[29,18,'C₂H₅⁺'],[27,15,'C₂H₃⁺']]},
 prop2:{n:'propan-2-ol',p:['CH₃','–','CH','(OH)','–','CH₃'],
  ir:[[3350,260,0.8,'O–H (alcohol), broad',[3]],[2970,80,0.6,'C–H stretch',[0,2,5]],[1130,50,0.7,'C–O stretch',[2,3]]],
  h:[[1.2,6,2,'two equivalent CH₃ groups: next to one H, so a doublet',[0,5]],[4.0,1,7,'CH bonded to O: 6 neighbouring H, so 7 peaks (septet)',[2]],[2.2,1,1,'O–H: singlet, disappears with D₂O',[3]]],
  c:[[64,'C bonded to O',[2]],[25,'two equivalent CH₃ carbons (one peak)',[0,5]]],
  ms:[[60,5,'M⁺, Mᵣ = 60'],[45,100,'CH₃CHOH⁺ (no peak at 31: not a primary alcohol)'],[43,15,'C₃H₇⁺'],[27,12,'C₂H₃⁺']]},
 ethanal:{n:'ethanal',p:['CH₃','–','CHO'],
  ir:[[1730,40,0.85,'C=O (aldehyde): strong, sharp, 1630–1820 cm⁻¹',[2]],[2720,40,0.35,'aldehyde C–H stretch (a weak extra band near 2720)',[2]],[2950,60,0.45,'C–H stretch',[0]]],
  h:[[9.8,1,4,'CHO hydrogen: very high δ (9.5–10.0); next to CH₃, so a quartet',[2]],[2.2,3,2,'CH₃ next to C=O (2.0–3.0); next to one H, so a doublet',[0]]],
  c:[[200,'C=O carbon (160–220 ppm)',[2]],[31,'CH₃',[0]]],
  ms:[[44,80,'M⁺, Mᵣ = 44'],[43,30,'CH₃CO⁺'],[29,100,'CHO⁺'],[15,30,'CH₃⁺']]},
 propanone:{n:'propanone',p:['CH₃','–','CO','–','CH₃'],
  ir:[[1715,40,0.9,'C=O (ketone): strong and sharp',[2]],[2970,60,0.4,'C–H stretch',[0,4]],[1220,40,0.5,'C–C(=O)–C stretch',[2]]],
  h:[[2.2,6,1,'both CH₃ groups are equivalent and have no H on the next carbon: one singlet',[0,4]]],
  c:[[206,'C=O carbon',[2]],[30,'two equivalent CH₃ carbons',[0,4]]],
  ms:[[58,60,'M⁺, Mᵣ = 58'],[43,100,'CH₃CO⁺'],[15,25,'CH₃⁺']]},
 acid:{n:'ethanoic acid',p:['CH₃','–','COOH'],
  ir:[[2950,420,0.65,'O–H (carboxylic acid): very broad, 2500–3300 cm⁻¹',[2]],[1710,40,0.9,'C=O: strong, sharp',[2]],[1250,50,0.6,'C–O stretch',[2]]],
  h:[[11.5,1,1,'COOH hydrogen: very high δ (10–12), singlet; disappears with D₂O',[2]],[2.1,3,1,'CH₃ next to C=O; no H on the next carbon: singlet',[0]]],
  c:[[178,'C=O carbon of COOH',[2]],[21,'CH₃',[0]]],
  ms:[[60,70,'M⁺, Mᵣ = 60'],[45,90,'COOH⁺'],[43,100,'CH₃CO⁺'],[15,20,'CH₃⁺']]},
 ester:{n:'ethyl ethanoate',p:['CH₃','–','CO','–','O','–','CH₂','–','CH₃'],
  ir:[[1740,40,0.9,'C=O (ester): strong and sharp',[2]],[1240,50,0.8,'C–O stretch',[4]],[2980,60,0.4,'C–H stretch',[0,6,8]]],
  h:[[2.0,3,1,'CH₃ next to C=O, no neighbouring H: singlet',[0]],[4.1,2,4,'CH₂ bonded to O (high δ); next to CH₃: quartet',[6]],[1.2,3,3,'CH₃ next to CH₂: triplet',[8]]],
  c:[[171,'C=O carbon',[2]],[60,'CH₂ bonded to O',[6]],[21,'CH₃ next to C=O',[0]],[14,'CH₃ of the ethyl group',[8]]],
  ms:[[88,10,'M⁺, Mᵣ = 88'],[61,12,'CH₃COOH₂⁺'],[45,20,'OC₂H₅⁺'],[43,100,'CH₃CO⁺'],[29,30,'C₂H₅⁺']]},
 butanone:{n:'butanone',p:['CH₃','–','CO','–','CH₂','–','CH₃'],
  ir:[[1715,40,0.9,'C=O (ketone)',[2]],[2975,60,0.45,'C–H stretch',[0,4,6]]],
  h:[[2.1,3,1,'CH₃ next to C=O, no neighbouring H: singlet',[0]],[2.4,2,4,'CH₂ next to C=O; next to CH₃: quartet',[4]],[1.0,3,3,'CH₃ next to CH₂: triplet',[6]]],
  c:[[209,'C=O carbon',[2]],[37,'CH₂',[4]],[29,'CH₃ next to C=O',[0]],[8,'CH₃ of the ethyl group',[6]]],
  ms:[[72,25,'M⁺, Mᵣ = 72'],[57,15,'C₂H₅CO⁺'],[43,100,'CH₃CO⁺'],[29,30,'C₂H₅⁺']]}};
const PASCAL=n=>{ let r=[1]; for(let i=1;i<n;i++){ const nr=[1]; for(let j=1;j<r.length;j++) nr.push(r[j-1]+r[j]); nr.push(1); r=nr; } return r; };
const MULT=['','singlet','doublet','triplet','quartet','quintet','sextet','septet'];
L.spectra={title:'Interactive spectra: IR, NMR and mass spec',cat:'Analysis',topic:'6.3.2',anim:false,
desc:'Real-looking IR, ¹H NMR, ¹³C NMR and mass spectra for common compounds. Point at any peak to see which part of the molecule causes it and why it looks the way it does.',
icon:'<path d="M6 100h108" stroke="currentColor" stroke-width="4"/><path d="M14 100V70M30 100V30M34 100V40M38 100V30M62 100V54M66 100V48M70 100V54M96 100V20" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let cmp='ethanol', mode='h', hover=null;
 LK.select(ct,{label:'Compound',options:Object.entries(SPX).map(([k,v])=>[k,v.n]),value:cmp,on:v=>{cmp=v;hover=null;draw();}});
 LK.select(ct,{label:'Spectrum',options:[['h','¹H NMR'],['c','¹³C NMR'],['ir','Infrared'],['ms','Mass spectrum']],value:mode,on:v=>{mode=v;hover=null;draw();}});
 const struct=LK.el('<div style="font:600 1.5rem var(--f-mono);margin:6px 0 10px;letter-spacing:.02em"></div>'); el.appendChild(struct);
 const st=LK.stage(el,S,{ratio:0.5,maxH:360});
 const card=LK.el('<div class="card" style="margin-top:10px;min-height:3.2em" aria-live="polite"><span class="muted">Point at (or tap) a peak.</span></div>'); el.appendChild(card);
 LK.note(el,'<b>¹H NMR:</b> number of peaks = number of H environments; chemical shift δ shows the environment; relative peak area = number of H; splitting (n + 1 rule) shows the number of H on the <b>next</b> carbon. TMS gives the reference peak at δ = 0. <b>¹³C NMR:</b> one peak per carbon environment, no splitting. <b>IR:</b> look for O–H (broad 3200–3600 alcohol, very broad 2500–3300 acid) and C=O (strong, about 1700). <b>Mass spectrum:</b> the molecular ion peak M⁺ (highest m/z) gives Mᵣ; fragments show parts of the molecule.');
 let feats=[];
 function draw(){ const P=LK.P(), x=st.ctx, W=st.w, H=st.h; st.clear(); const D=SPX[cmp];
  const hl=hover&&hover.parts||[];
  struct.innerHTML=D.p.map((s,i)=>`<span style="padding:0 2px;border-radius:5px;${hl.includes(i)?'background:var(--brand);color:var(--brand-ink)':''}">${s}</span>`).join('');
  const m={l:46,r:16,t:20,b:40}, pw=W-m.l-m.r, ph=H-m.t-m.b; feats=[];
  const axis=(lo,hi,rev,lab,step)=>{ const X=v=>rev?m.l+(hi-v)/(hi-lo)*pw:m.l+(v-lo)/(hi-lo)*pw; x.strokeStyle=P.ink2; x.lineWidth=1.4; x.beginPath(); x.moveTo(m.l,m.t+ph); x.lineTo(m.l+pw,m.t+ph); x.stroke(); for(let v=Math.ceil(lo/step)*step;v<=hi+1e-9;v+=step){ const xx=X(v); x.beginPath(); x.moveTo(xx,m.t+ph); x.lineTo(xx,m.t+ph+5); x.stroke(); LK.text(x,String(+v.toFixed(1)),xx,m.t+ph+18,P.muted,{size:11,align:'center'}); } LK.text(x,lab,m.l+pw/2,H-6,P.ink2,{size:12,align:'center',mono:false,weight:600}); return X; };
  if(mode==='h'){ const X=axis(0,12,true,'chemical shift δ / ppm',1); const tot=D.h.reduce((a,p)=>a+p[1],0);
   const Y=v=>m.t+ph-v*ph*0.85;
   x.strokeStyle=P.ink2; x.lineWidth=1.6; x.beginPath(); x.moveTo(X(0),Y(0)); x.lineTo(X(0),Y(0.3)); x.stroke(); LK.text(x,'TMS',X(0),Y(0.3)-6,P.muted,{size:10,align:'center'});
   D.h.forEach((p,k)=>{ const [d,n,mlt,txt,parts]=p, pc=PASCAL(mlt), s=pc.reduce((a,b)=>a+b,0), on=hover&&hover.k==='h'+k; x.strokeStyle=on?P.brand:P.ink; x.lineWidth=on?2.4:1.8;
    const gap=mlt>5?5:7; pc.forEach((c,j)=>{ const px=X(d)+(j-(mlt-1)/2)*gap; const hh=(n/Math.max(...D.h.map(q=>q[1])))*c/Math.max(...pc); x.beginPath(); x.moveTo(px,Y(0)); x.lineTo(px,Y(hh)); x.stroke(); });
    LK.text(x,n+'H',X(d),Y(n/Math.max(...D.h.map(q=>q[1])))-8,on?P.brand:P.ink2,{size:11,align:'center',weight:700});
    feats.push({k:'h'+k,x:X(d),r:24,parts,html:`<b>δ ${d} ppm · ${n}H · ${MULT[mlt]||'multiplet'}</b><br>${txt}`}); }); }
  if(mode==='c'){ const X=axis(0,220,true,'chemical shift δ / ppm',20); const Y=v=>m.t+ph-v*ph*0.85;
   D.c.forEach((p,k)=>{ const on=hover&&hover.k==='c'+k; x.strokeStyle=on?P.brand:P.ink; x.lineWidth=on?3:2; x.beginPath(); x.moveTo(X(p[0]),Y(0)); x.lineTo(X(p[0]),Y(0.55+0.3*((k*37)%10)/10)); x.stroke(); LK.text(x,String(p[0]),X(p[0]),Y(0.9)-4,on?P.brand:P.ink2,{size:11,align:'center'}); feats.push({k:'c'+k,x:X(p[0]),r:16,parts:p[2],html:`<b>δ ${p[0]} ppm</b><br>${p[1]}`}); }); }
  if(mode==='ir'){ const X=axis(500,4000,true,'wavenumber / cm⁻¹',500); const Y=v=>m.t+ph*(1-v);
   LK.text(x,'transmittance',m.l-40,m.t+10,P.muted,{size:10,mono:false});
   x.strokeStyle=P.brand; x.lineWidth=1.8; x.beginPath(); for(let w=4000;w>=500;w-=4){ let t=0.95-0.03*Math.sin(w/61)-0.02*Math.sin(w/23); D.ir.forEach(([c,wd,dp])=>{ t-=dp*Math.exp(-Math.pow((w-c)/(wd/2),2)); }); if(w<1500) t-=0.12*Math.abs(Math.sin(w/37))*Math.abs(Math.sin(w/11)); t=clamp(t,0.03,0.98); const xx=X(w), yy=Y(t); w===4000?x.moveTo(xx,yy):x.lineTo(xx,yy); } x.stroke();
   LK.text(x,'fingerprint region',X(1000),m.t+ph-6,P.muted,{size:10,align:'center',mono:false});
   D.ir.forEach((p,k)=>{ const on=hover&&hover.k==='ir'+k; if(on){ x.fillStyle=P.soft; x.globalAlpha=0.6; x.fillRect(X(p[0]+p[1]/2),m.t,X(p[0]-p[1]/2)-X(p[0]+p[1]/2),ph); x.globalAlpha=1; } LK.text(x,String(p[0]),X(p[0]),Y(0.95-p[2])+14,on?P.brand:P.ink2,{size:10,align:'center'}); feats.push({k:'ir'+k,x:X(p[0]),r:Math.max(14,(X(p[0]-p[1]/2)-X(p[0]+p[1]/2))/2),parts:p[4],html:`<b>${p[0]} cm⁻¹</b><br>${p[3]}`}); }); }
  if(mode==='ms'){ const mx=Math.max(...D.ms.map(p=>p[0]))+10; const X=axis(0,mx,false,'m/z',10); const Y=v=>m.t+ph-v/100*ph*0.95;
   LK.text(x,'relative abundance',m.l-40,m.t+10,P.muted,{size:10,mono:false});
   D.ms.forEach((p,k)=>{ const on=hover&&hover.k==='ms'+k; x.strokeStyle=on?P.brand:P.ink; x.lineWidth=on?6:4; x.beginPath(); x.moveTo(X(p[0]),Y(0)); x.lineTo(X(p[0]),Y(p[1])); x.stroke(); LK.text(x,String(p[0]),X(p[0]),Y(p[1])-6,on?P.brand:P.ink2,{size:11,align:'center'}); feats.push({k:'ms'+k,x:X(p[0]),r:12,parts:[],html:`<b>m/z ${p[0]}</b><br>${p[2]}`}); }); }
  if(hover){ const f=feats.find(q=>q.k===hover.k); if(f) card.innerHTML=f.html; } else card.innerHTML='<span class="muted">Point at (or tap) a peak.</span>';
 }
 const pick=e=>{ const p=st.pos(e); let best=null, bd=1e9; feats.forEach(f=>{ const d=Math.abs(f.x-p.x); if(d<f.r&&d<bd){ bd=d; best=f; } }); const nk=best?best.k:null; if(nk!==(hover&&hover.k)){ hover=best?{k:best.k,parts:best.parts}:null; draw(); } };
 S.on(st.cv,'pointermove',pick); S.on(st.cv,'pointerdown',pick);
 st.onResize=draw; el.lkPreset=o=>{}; draw(); return ()=>S.dispose(); }};
})();
