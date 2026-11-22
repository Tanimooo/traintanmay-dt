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
{
const D2R=Math.PI/180;
/* atom colours (CPK-style) and ball radii in model units */
const ELC={H:'#f1f1f1',C:'#5d636e',N:'#4573e6',O:'#e9473d',F:'#8fdc6a',Cl:'#2fb35b',B:'#f3a69e',Be:'#d4cb8a',P:'#ff8a1c',S:'#f0d13a',Xe:'#3ea7b9'};
const ELR={H:0.25,C:0.35,N:0.35,O:0.35,F:0.32,Cl:0.42,B:0.35,Be:0.35,P:0.42,S:0.42,Xe:0.47};
const ELN={H:'hydrogen',C:'carbon',N:'nitrogen',O:'oxygen',F:'fluorine',Cl:'chlorine',B:'boron',Be:'beryllium',P:'phosphorus',S:'sulfur',Xe:'xenon'};
const V={add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul:(a,k)=>[a[0]*k,a[1]*k,a[2]*k],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len:a=>Math.hypot(a[0],a[1],a[2]),unit:a=>{ const l=Math.hypot(a[0],a[1],a[2])||1; return [a[0]/l,a[1]/l,a[2]/l]; }};
/* colour helpers */
const rgbOf=c=>{ c=String(c).trim(); if(c[0]==='#'){ if(c.length===4) c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3]; const n=parseInt(c.slice(1,7),16); return [n>>16&255,n>>8&255,n&255]; } const m=c.match(/[\d.]+/g); return m?m.slice(0,3).map(Number):[128,128,128]; };
const mix=(a,b,t)=>{ const A=rgbOf(a),B=rgbOf(b); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`; };
const rgba=(c,al)=>{ const A=rgbOf(c); return `rgba(${A[0]},${A[1]},${A[2]},${al})`; };
const lum=c=>{ const [r,g,b]=rgbOf(c); return (0.2126*r+0.7152*g+0.0722*b)/255; };
const TONE=new Map(); const tone=c=>{ let t=TONE.get(c); if(!t){ t={hi:mix(c,'#ffffff',0.55),base:c,lo:mix(c,'#000000',0.38),edge:mix(c,'#000000',0.62),txt:lum(c)>0.55?'#1c1c1c':'#ffffff'}; TONE.set(c,t); } return t; };
/* formulae: Unicode sub/superscripts drawn as real sub/superscripts */
const SUBS='₀₁₂₃₄₅₆₇₈₉', SUPS='⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻';
const fH=s=>LK.esc(s).replace(/[₀-₉]+/g,m=>'<sub>'+[...m].map(c=>SUBS.indexOf(c)).join('')+'</sub>').replace(/[⁺⁻]/g,c=>'<sup>'+(c==='⁺'?'+':'−')+'</sup>');
const runs=s=>{ const R=[]; for(const ch of s){ let k='n', c=ch; const i=SUBS.indexOf(ch), j=SUPS.indexOf(ch); if(i>=0){ k='b'; c=String(i); } else if(j>=0){ k='p'; c='0123456789+−'[j]; } const l=R[R.length-1]; if(l&&l.k===k) l.t+=c; else R.push({k,t:c}); } return R; };
const fText=(x,s,px,py,o)=>{ const size=o.size||14, R=runs(s); let tot=0; R.forEach(r=>{ r.f=`${o.weight||600} ${r.k==='n'?size:Math.round(size*0.7)}px ${o.font}`; x.font=r.f; r.w=x.measureText(r.t).width; tot+=r.w; }); if(o.measure) return tot;
 let cx=o.align==='center'?px-tot/2:o.align==='right'?px-tot:px; x.fillStyle=o.col; x.textAlign='left'; x.textBaseline=o.base||'alphabetic'; R.forEach(r=>{ x.font=r.f; x.fillText(r.t,cx,py+(r.k==='b'?size*0.24:r.k==='p'?-size*0.36:0)); cx+=r.w; }); return tot; };
/* geometry in "textbook" orientation: x right, y up, z towards you */
const TETX=[[0,1,0],[-0.9428,-0.3333,0],[0.4714,-0.3333,0.8165],[0.4714,-0.3333,-0.8165]];
const PYR=deg=>{ const c2=(Math.cos(deg*D2R)+0.5)/1.5, ca=Math.sqrt(c2), sa=Math.sqrt(1-c2); return [180,60,300].map(a=>[sa*Math.cos(a*D2R),-ca,sa*Math.sin(a*D2R)]); };
const Q=Math.SQRT1_2, SQ=[[Q,0,Q],[-Q,0,Q],[-Q,0,-Q],[Q,0,-Q]];
const s52=Math.sin(52.25*D2R), c52=Math.cos(52.25*D2R);
const vsepr=o=>{ const atoms=[{e:o.c,p:[0,0,0]}], bonds=[]; o.dirs.forEach((d,i)=>{ atoms.push({e:o.l,p:V.mul(V.unit(d),o.L)}); bonds.push([0,i+1,o.order||1]); });
 return Object.assign({kind:'vsepr',exam:[0,0],title:o.f},o,{atoms,bonds,lps:(o.lpd||[]).map(d=>[0,V.unit(d)]),angles:(o.arcs||[]).map(([i,j,t,w])=>[0,i+1,j+1,t,w]),cap:o.shape+' · '+o.ang}); };
const but=z=>{ const c0=[-0.67,0,0], c1=[0.67,0,0], up=[0.5,0.866,0], dn=[0.5,-0.866,0], L1=1.5, L2=1.08, fl=v=>[-v[0],v[1],0];
 return {atoms:[{e:'C',p:c0},{e:'C',p:c1},{e:'C',g:'CH₃',r:0.43,p:V.add(c0,V.mul(fl(up),L1))},{e:'H',p:V.add(c0,V.mul(fl(dn),L2))},{e:'C',g:'CH₃',r:0.43,p:V.add(c1,V.mul(z?up:dn,L1))},{e:'H',p:V.add(c1,V.mul(z?dn:up,L2))}],
  bonds:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],lps:[],angles:[[0,1,2,'120°']],axis:[[-2.5,0,0],[2.5,0,0]]}; };
const MOLS={
 co2:vsepr({f:'CO₂',name:'carbon dioxide',c:'C',l:'O',dirs:[[-1,0,0],[1,0,0]],L:1.25,order:2,shape:'Linear',ang:'180°',arcs:[[0,1,'180°',[0,1,0]]],
  why:'Carbon makes two C=O double bonds and has no lone pairs. A double bond counts as <b>one region</b> of electron density, so there are 2 regions. They repel as far apart as possible, giving a straight line: 180°.'}),
 becl2:vsepr({f:'BeCl₂',name:'beryllium chloride',c:'Be',l:'Cl',dirs:[[-1,0,0],[1,0,0]],L:1.45,shape:'Linear',ang:'180°',arcs:[[0,1,'180°',[0,1,0]]],
  why:'Be has only 2 outer electrons, so it makes 2 bonds and has no lone pairs (just 4 electrons around Be: it doesn’t reach an octet). Two bonding pairs repel to opposite sides: linear, 180°.'}),
 bf3:vsepr({f:'BF₃',name:'boron trifluoride',c:'B',l:'F',dirs:[[0,1,0],[0.866,-0.5,0],[-0.866,-0.5,0]],L:1.35,shape:'Trigonal planar',ang:'120°',arcs:[[0,2,'120°']],
  why:'B has 3 outer electrons, so it makes 3 bonds and has no lone pairs (only 6 electrons around B). Three bonding pairs spread out in one flat plane: trigonal planar, 120°.'}),
 ch4:vsepr({f:'CH₄',name:'methane',c:'C',l:'H',dirs:TETX,L:1.15,shape:'Tetrahedral',ang:'109.5°',arcs:[[0,1,'109.5°']],exam:[0,0.36],
  why:'4 bonding pairs and no lone pairs. Four regions repel equally and point to the corners of a tetrahedron: 109.5°.'}),
 nh4:vsepr({f:'NH₄⁺',name:'ammonium ion',c:'N',l:'H',dirs:TETX,L:1.15,shape:'Tetrahedral',ang:'109.5°',arcs:[[0,1,'109.5°']],exam:[0,0.36],charge:'+',
  why:'In NH₃, N uses its lone pair to form a <b>dative</b> bond to H⁺. That leaves 4 bonding pairs and no lone pairs, so NH₄⁺ is tetrahedral, 109.5°, just like CH₄. Once it has formed, the dative bond is identical to the other three.'}),
 nh3:vsepr({f:'NH₃',name:'ammonia',c:'N',l:'H',dirs:PYR(107),lpd:[[0,1,0]],L:1.15,shape:'Pyramidal',ang:'107°',arcs:[[0,1,'107°']],exam:[0,0.36],
  why:'3 bonding pairs and 1 lone pair make 4 regions, arranged roughly tetrahedrally. The lone pair is held closer to N and repels <b>more</b> than a bonding pair, pushing the N–H bonds together: 109.5° − 2.5° ≈ 107°. The shape names the atoms only, so it is pyramidal.'}),
 h2o:vsepr({f:'H₂O',name:'water',c:'O',l:'H',dirs:[[-s52,-c52,0],[s52,-c52,0]],lpd:[[0,0.54,0.84],[0,0.54,-0.84]],L:1.1,shape:'Non-linear (bent)',ang:'104.5°',arcs:[[0,1,'104.5°']],exam:[0.42,0.1],
  why:'2 bonding pairs and 2 lone pairs make 4 regions. Two lone pairs squeeze the bonds even more: 109.5° − 2 × 2.5° ≈ 104.5°. Looking at the atoms only, the shape is non-linear (bent).'}),
 pcl5:vsepr({f:'PCl₅',name:'phosphorus(V) chloride',c:'P',l:'Cl',dirs:[[0,1,0],[0,-1,0],[-1,0,0],[0.5,0,0.866],[0.5,0,-0.866]],L:1.45,shape:'Trigonal bipyramidal',ang:'90° and 120°',arcs:[[0,2,'90°'],[3,4,'120°']],exam:[0,0.3],
  why:'5 bonding pairs, no lone pairs. Three bonds sit in a triangle around P, 120° apart, and two point straight up and down, at 90° to the triangle. P has expanded its octet: 10 electrons in its outer shell.'}),
 sf6:vsepr({f:'SF₆',name:'sulfur hexafluoride',c:'S',l:'F',dirs:[[0,1,0],[0,-1,0],...SQ],L:1.4,shape:'Octahedral',ang:'90°',arcs:[[0,2,'90°']],exam:[0,0.26],
  why:'6 bonding pairs, no lone pairs: the bonds point to the corners of an octahedron, all at 90°. S has expanded its octet: 12 electrons in its outer shell.'}),
 xef4:vsepr({f:'XeF₄',name:'xenon tetrafluoride',c:'Xe',l:'F',dirs:SQ,lpd:[[0,1,0],[0,-1,0]],L:1.45,shape:'Square planar',ang:'90°',arcs:[[0,3,'90°']],exam:[0,0.26],
  why:'Xe has 8 outer electrons: 4 bond to F atoms, leaving 2 lone pairs. That makes 6 regions, arranged octahedrally. The lone pairs repel most, so they sit opposite each other, 180° apart, leaving the four F atoms in a flat square: square planar, 90°.'}),
 zbut:Object.assign(but(true),{kind:'iso',title:'Z-but-2-ene',chip:'Z-but-2-ene',name:'cis-but-2-ene',cap:'Z isomer · CH₃ groups on the same side',exam:[0,0],
  facts:[['iso','E/Z','stereoisomerism'],['g','CH₃ on each C','higher priority'],['ang','same side','priority groups'],['sh','restricted','rotation about C=C']],
  why:'There is restricted rotation about the C=C double bond, and each carbon carries two different groups (CH₃ and H). The higher-priority groups (CH₃) are on the <b>same side</b> of the double bond (the dashed line), so this is the <b>Z</b> isomer (here also <i>cis</i>).'}),
 ebut:Object.assign(but(false),{kind:'iso',title:'E-but-2-ene',chip:'E-but-2-ene',name:'trans-but-2-ene',cap:'E isomer · CH₃ groups on opposite sides',exam:[0,0],
  facts:[['iso','E/Z','stereoisomerism'],['g','CH₃ on each C','higher priority'],['ang','opposite sides','priority groups'],['sh','restricted','rotation about C=C']],
  why:'The CH₃ groups are on <b>opposite sides</b> of the double bond (the dashed line): the <b>E</b> isomer (<i>trans</i>). E and Z can’t turn into each other, because the π bond stops rotation about C=C.'}),
 ala:{kind:'iso',title:'Alanine',chip:'Alanine',name:'2-aminopropanoic acid',cap:'Chiral centre C* · optical isomers',exam:[0,0.36],
  atoms:[{e:'C',p:[0,0,0],star:true},{e:'O',g:'COOH',r:0.5,p:V.mul(TETX[0],1.55)},{e:'C',g:'CH₃',r:0.43,p:V.mul(TETX[1],1.5)},{e:'N',g:'NH₂',r:0.43,p:V.mul(TETX[2],1.5)},{e:'H',p:V.mul(TETX[3],1.1)}],
  bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lps:[],angles:[],
  facts:[['iso','optical','isomerism'],['g','C*','chiral centre'],['ang','4 different','groups on C*'],['sh','non-superimposable','mirror images']],
  why:'The central carbon (C*) is bonded to <b>four different groups</b>: H, CH₃, NH₂ and COOH, so it is a chiral centre. Turn on <b>Mirror image</b>: the two molecules are non-superimposable mirror images (optical isomers). Drag the mirror image to try to line it up with the original: you can’t.'}};
Object.values(MOLS).forEach(M=>{ const n=M.atoms.length; M.ctr=M.kind==='vsepr'?[0,0,0]:M.atoms.reduce((s,a)=>V.add(s,V.mul(a.p,1/n)),[0,0,0]);
 let R=0; M.atoms.forEach(a=>{ R=Math.max(R,V.len(V.sub(a.p,M.ctr))+(a.r||ELR[a.e])); }); M.lps.forEach(([i,d])=>{ R=Math.max(R,V.len(V.sub(V.add(M.atoms[i].p,V.mul(d,1.05)),M.ctr))); }); M.R=R; });
const GROUPS=[['2 regions',['co2','becl2']],['3 regions',['bf3']],['4 regions',['ch4','nh4','nh3','h2o']],['5 regions',['pcl5']],['6 regions',['sf6','xef4']],['Isomers',['zbut','ebut','ala']]];
/* rotate (yaw about y, then pitch about x) and project with mild perspective */
const rotDir=(d,rot,mir)=>{ let [px,py,pz]=d; if(mir) px=-px; const cy=Math.cos(rot.yaw), sy=Math.sin(rot.yaw), cp=Math.cos(rot.pitch), sp=Math.sin(rot.pitch); const x1=px*cy+pz*sy, z1=-px*sy+pz*cy; return [x1,py*cp-z1*sp,py*sp+z1*cp]; };
const projector=(M,rot,cx,cy,sc,persp,mir)=>p=>{ const r=rotDir(V.sub(p,M.ctr),rot,mir); const f=1/(1-r[2]*persp); return {x:cx+r[0]*sc*f,y:cy-r[1]*sc*f,z:r[2],f}; };
const radOf=a=>a.r||ELR[a.e];
/* small picture of each molecule for the picker */
const icon=M=>{ const pr=projector(M,{yaw:M.exam[0],pitch:M.exam[1]},0,0,1,0,false), k=12.5/M.R, A=M.atoms.map(a=>Object.assign(pr(a.p),{a})); const f=v=>v.toFixed(1);
 let s='<svg viewBox="-15 -15 30 30" aria-hidden="true">';
 M.bonds.forEach(([i,j])=>{ s+=`<line x1="${f(A[i].x*k)}" y1="${f(A[i].y*k)}" x2="${f(A[j].x*k)}" y2="${f(A[j].y*k)}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" opacity=".5"/>`; });
 M.lps.forEach(([i,d])=>{ const q=pr(V.add(M.atoms[i].p,V.mul(d,0.62))); s+=`<circle cx="${f(q.x*k)}" cy="${f(q.y*k)}" r="${f(0.34*k)}" fill="var(--accent)" opacity=".45"/>`; });
 A.slice().sort((p,q)=>p.z-q.z).forEach(q=>{ s+=`<circle cx="${f(q.x*k)}" cy="${f(q.y*k)}" r="${f(Math.max(1.9,radOf(q.a)*k*0.95))}" fill="${ELC[q.a.e]}" stroke="rgba(0,0,0,.35)" stroke-width=".6"/>`; });
 return s+'</svg>'; };

/* painters shared by the lab and the hero preview */
function stick(x,p1,p2,w,col){ const dx=p2.x-p1.x, dy=p2.y-p1.y, L=Math.hypot(dx,dy); if(L<0.5||w<0.5) return; const c=tone(col); let nx=-dy/L, ny=dx/L; if(nx+ny>0){ nx=-nx; ny=-ny; }
  const g=x.createLinearGradient(p1.x+nx*w/2,p1.y+ny*w/2,p1.x-nx*w/2,p1.y-ny*w/2); g.addColorStop(0,c.lo); g.addColorStop(0.24,c.hi); g.addColorStop(0.55,c.base); g.addColorStop(1,c.edge);
  x.strokeStyle=g; x.lineWidth=w; x.lineCap='round'; x.beginPath(); x.moveTo(p1.x,p1.y); x.lineTo(p2.x,p2.y); x.stroke(); }
function ball(x,q,col,pal){ const r=q.r, c=tone(col);
  const g=x.createRadialGradient(q.x-r*0.38,q.y-r*0.42,r*0.06,q.x-r*0.12,q.y-r*0.12,r*1.1); g.addColorStop(0,c.hi); g.addColorStop(0.3,c.base); g.addColorStop(0.8,c.lo); g.addColorStop(1,c.edge);
  x.fillStyle=g; x.beginPath(); x.arc(q.x,q.y,r,0,7); x.fill();
  const s=x.createRadialGradient(q.x-r*0.36,q.y-r*0.44,0,q.x-r*0.36,q.y-r*0.44,r*0.45); s.addColorStop(0,'rgba(255,255,255,.8)'); s.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle=s; x.fill();
  x.lineWidth=1; x.strokeStyle=pal.rim; x.stroke(); }
function lobe(x,q,rd,s,pal,flat){ const a=0.5*s, b=0.31*s, sx=Math.hypot(rd[0],rd[1]), A=Math.max(b,Math.sqrt(a*a*sx*sx+b*b*rd[2]*rd[2])), ang=Math.atan2(-rd[1],rd[0]);
  x.save(); x.translate(q.x,q.y); x.rotate(ang);
  if(flat){ x.beginPath(); x.ellipse(0,0,A,b,0,0,7); x.fillStyle=pal.lpC; x.fill(); x.lineWidth=1.6; x.strokeStyle=pal.lpLine; x.stroke(); }
  else { x.save(); x.scale(A/b,1); const g=x.createRadialGradient(b*0.15,-b*0.3,b*0.05,0,0,b); g.addColorStop(0,pal.lpA); g.addColorStop(0.6,pal.lpB); g.addColorStop(1,pal.lpC); x.shadowColor=pal.lpGlow; x.shadowBlur=16; x.fillStyle=g; x.beginPath(); x.arc(0,0,b,0,7); x.fill(); x.restore();
   x.beginPath(); x.ellipse(0,0,A,b,0,0,7); x.lineWidth=1.1; x.strokeStyle=pal.lpLine; x.stroke(); }
  const off=(A-b)*0.45, dr=Math.max(2.3,s*0.04); [-1,1].forEach(k=>{ x.beginPath(); x.arc(off,k*b*0.34,dr,0,7); x.fillStyle=pal.accent; x.fill(); if(!flat){ x.beginPath(); x.arc(off-dr*0.3,k*b*0.34-dr*0.3,dr*0.4,0,7); x.fillStyle='rgba(255,255,255,.7)'; x.fill(); } });
  x.restore(); }
L.shapes={title:'3D shapes of molecules',cat:'Atoms & bonding',topic:'2.2.2',anim:false,
desc:'Spin molecules in 3D to see how bonding pairs and lone pairs arrange themselves, with every bond angle marked. Flip to an exam-style wedge-and-dash drawing, and explore E/Z isomers of but-2-ene and the optical isomers of alanine.',
icon:'<circle cx="60" cy="62" r="14" fill="currentColor"/><g stroke="currentColor" stroke-width="5"><path d="M60 62L60 16M60 62L22 86M60 62L98 86M60 62l18 10"/></g><circle cx="60" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="20" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="100" cy="88" r="9" fill="none" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let m='nh3', spin=!LK.reduced(), spinWas=spin, showLP=true, showAng=true, labels=true, mirror=false, exam=false;
 let ex=0, tin=0, hint=1, dragged=false, linked=true, target=null, drag=null;
 const rotL={yaw:0,pitch:0,vy:0,vp:0}, rotR={yaw:0,pitch:0,vy:0,vp:0};
 const cSpin=LK.check(ct,'Spin',spin,v=>{ spin=v; spinWas=v; });
 LK.check(ct,'Show lone pairs',true,v=>{ showLP=v; });
 LK.check(ct,'Show bond angles',true,v=>{ showAng=v; });
 LK.check(ct,'Atom labels',true,v=>{ labels=v; });
 const cMir=LK.check(ct,'Mirror image',false,v=>{ mirror=v; linked=true; syncR(); tin=Math.min(tin,0.55); });
 /* molecule tray, grouped by regions of electron density */
 const tray=LK.el('<div class="shp-tray" role="group" aria-label="Choose a molecule"></div>'); el.appendChild(tray);
 GROUPS.forEach(([lab,ids])=>{ const g=LK.el(`<div class="shp-grp"><span>${lab}</span><div></div></div>`); ids.forEach(id=>{ const M=MOLS[id]; g.lastElementChild.appendChild(LK.el(`<button type="button" class="shp-chip" data-m="${id}" aria-pressed="false" title="${LK.esc(M.name)}">${icon(M)}<span>${fH(M.chip||M.f)}</span></button>`)); }); tray.appendChild(g); });
 tray.addEventListener('click',e=>{ const b=e.target.closest('[data-m]'); if(b) pick(b.dataset.m); });
 /* stage */
 const wrap=LK.el('<div class="shp-stage"></div>'); el.appendChild(wrap);
 const st=LK.stage(wrap,S,{ratio:0.68,maxH:560,minH:360}); const cv=st.cv; cv.tabIndex=0; cv.setAttribute('role','img');
 const tools=LK.el('<div class="shp-tools"><div class="shp-seg" role="group" aria-label="View"><button type="button" data-v="3d" aria-pressed="true">3D model</button><button type="button" data-v="exam" aria-pressed="false">Exam drawing</button></div><button type="button" class="shp-ib" data-reset title="Reset the view" aria-label="Reset the view"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4v5h5"/></svg></button></div>'); wrap.insertBefore(tools,wrap.firstChild);
 tools.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.v) setView(b.dataset.v); if(b.hasAttribute('data-reset')) resetRot(true); });
 const info=LK.el('<div class="shp-info" aria-live="polite"></div>'); el.appendChild(info);
 LK.note(el,'Electron pairs around the central atom repel each other and get as far apart as possible. Count the <b>bonding pairs</b> and <b>lone pairs</b> on the central atom; a double bond counts as one region. Lone pairs repel more than bonding pairs, so each lone pair closes the bond angle by about 2.5°.<table class="shp-tab"><thead><tr><th>Bonding</th><th>Lone</th><th>Shape</th><th>Angle</th></tr></thead><tbody><tr><td>2</td><td>0</td><td>linear</td><td>180°</td></tr><tr><td>3</td><td>0</td><td>trigonal planar</td><td>120°</td></tr><tr><td>4</td><td>0</td><td>tetrahedral</td><td>109.5°</td></tr><tr><td>3</td><td>1</td><td>pyramidal</td><td>107°</td></tr><tr><td>2</td><td>2</td><td>non-linear</td><td>104.5°</td></tr><tr><td>5</td><td>0</td><td>trigonal bipyramidal</td><td>90°, 120°</td></tr><tr><td>6</td><td>0</td><td>octahedral</td><td>90°</td></tr><tr><td>4</td><td>2</td><td>square planar</td><td>90°</td></tr></tbody></table>In an exam drawing, a plain line is in the plane of the paper, a solid wedge comes <b>towards</b> you and a hashed wedge goes <b>away</b> from you.');
 const Mo=()=>MOLS[m];
 function syncR(){ if(linked){ rotR.yaw=-rotL.yaw; rotR.pitch=rotL.pitch; rotR.vy=-rotL.vy; rotR.vp=rotL.vp; } }
 function examTarget(){ const M=Mo(), T=2*Math.PI; return {yaw:M.exam[0]+T*Math.round((rotL.yaw-M.exam[0])/T),pitch:M.exam[1]}; }
 function resetRot(smooth){ const M=Mo(); linked=true; rotL.vy=rotL.vp=0; const t=exam?{yaw:M.exam[0],pitch:M.exam[1]}:{yaw:M.exam[0]+0.55,pitch:0.32};
  if(smooth){ const T=2*Math.PI; t.yaw+=T*Math.round((rotL.yaw-t.yaw)/T); target=t; } else { target=null; rotL.yaw=t.yaw; rotL.pitch=t.pitch; } syncR(); }
 function pick(id){ if(!MOLS[id]) return; m=id; tin=0; resetRot(false); renderInfo();
  tray.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===id)));
  const b=tray.querySelector(`[data-m="${id}"]`); if(b&&tray.scrollWidth>tray.clientWidth+4) tray.scrollTo({left:b.offsetLeft-tray.clientWidth/2+b.offsetWidth/2,behavior:'smooth'}); }
 function setView(v){ const want=v==='exam'; tools.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.v==='exam')===want))); if(want===exam) return; exam=want;
  if(exam){ spinWas=spin; spin=false; cSpin.checked=false; linked=true; rotL.vy=rotL.vp=0; target=examTarget(); }
  else { target=null; if(spinWas){ spin=true; cSpin.checked=true; } } }
 function renderInfo(){ const M=Mo(), nl=M.lps.length;
  const F=M.kind==='vsepr'?[['bp',M.bonds.length,M.order===2?'bonding regions':'bonding pairs'],['lp',nl,nl===1?'lone pair':'lone pairs'],['ang',M.ang,/and/.test(M.ang)?'bond angles':'bond angle'],['sh',M.shape,'shape']]:M.facts;
  info.innerHTML=`<div class="shp-facts">${F.map(([c,v,l])=>`<div class="shp-fact ${c}"><b>${fH(String(v))}</b><span>${l}</span></div>`).join('')}</div><p class="shp-why">${M.why}</p>`;
  cv.setAttribute('aria-label',`${M.title} (${M.name}): ${M.cap}. Drag or use the arrow keys to rotate.`); }
 /* pointer: drag to turn (with a little momentum); in mirror view each half turns its own molecule */
 S.on(cv,'pointerdown',e=>{ const p=st.pos(e), right=mirror&&p.x>st.w/2; if(right) linked=false; const r=right?rotR:rotL; r.vy=r.vp=0; target=null; drag={r,x:e.clientX,y:e.clientY,t:performance.now()}; dragged=true; try{ cv.setPointerCapture(e.pointerId); }catch(err){} });
 S.on(cv,'pointermove',e=>{ if(!drag) return; const now=performance.now(), dx=e.clientX-drag.x, dy=e.clientY-drag.y, dt=Math.max(8,now-drag.t)/1000, k=0.0095, r=drag.r;
  r.yaw+=dx*k; r.pitch=clamp(r.pitch+dy*k,-1.45,1.45); r.vy=clamp(dx*k/dt,-9,9)*0.85; r.vp=clamp(dy*k/dt,-9,9)*0.85; drag.x=e.clientX; drag.y=e.clientY; drag.t=now; if(r===rotL) syncR(); });
 const up=()=>{ if(!drag) return; if(performance.now()-drag.t>90){ drag.r.vy=drag.r.vp=0; } drag=null; };
 S.on(cv,'pointerup',up); S.on(cv,'pointercancel',up); S.on(cv,'lostpointercapture',up);
 S.on(cv,'dblclick',()=>resetRot(true));
 S.on(cv,'keydown',e=>{ const k={ArrowLeft:[-0.15,0],ArrowRight:[0.15,0],ArrowUp:[0,-0.15],ArrowDown:[0,0.15]}[e.key]; if(!k) return; e.preventDefault(); target=null; rotL.yaw+=k[0]; rotL.pitch=clamp(rotL.pitch+k[1],-1.45,1.45); syncR(); dragged=true; });

 /* ---------- drawing ---------- */
 let PK=null, PC=null;
 const pals=P=>{ if(PK===P) return PC; PK=P; const l1=lum(P.surface), l2=lum(P.bg), dark=l2<0.35, hiC=l1>l2?P.surface:P.bg, loC=l1>l2?P.bg:P.surface;
  const cs=getComputedStyle(document.documentElement);
  PC={dark,bgIn:dark?mix(hiC,P.brand,0.05):hiC,bgOut:dark?mix(loC,'#000000',0.35):mix(loC,P.line,0.55),fog:dark?mix(loC,'#000000',0.3):hiC,
   shadow:dark?'rgba(0,0,0,.42)':'rgba(90,45,15,.16)',rim:dark?'rgba(0,0,0,.5)':'rgba(50,25,8,.32)',ink:P.ink,ink2:P.ink2,muted:P.muted,brand:P.brand,accent:P.accent,
   lpA:rgba(P.accent,dark?0.62:0.5),lpB:rgba(P.accent,dark?0.3:0.24),lpC:rgba(P.accent,0.06),lpLine:rgba(P.accent,0.75),lpGlow:rgba(P.accent,dark?0.55:0.35),
   arcFill:rgba(P.brand,0.16),pill:rgba(P.surface,0.94),grid:P.grid,mirror:rgba(P.accent,dark?0.16:0.1),
   display:cs.getPropertyValue('--f-display').trim()||'sans-serif',body:P.body}; return PC; };
 function fogOver(x,amt,pal,fn){ if(amt<0.02) return; x.save(); x.globalAlpha*=amt; fn(pal.fog); x.restore(); }
 function draw3D(x,M,pr,rot,mir,sc,pal,floorY){
  const A=M.atoms.map(a=>{ const q=pr(a.p); q.r=radOf(a)*sc*q.f; q.a=a; return q; }), fogK=z=>clamp(-z/M.R,0,1)*0.32;
  /* soft shadows on an imaginary floor */
  A.forEach(q=>{ const sy=floorY+q.z*sc*0.1, rx=q.r*1.7, ry=rx*0.2; x.save(); x.translate(q.x,sy); x.scale(1,ry/rx); const g=x.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,pal.shadow); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(-rx,-rx,2*rx,2*rx); x.restore(); });
  if(M.axis){ const a=pr(M.axis[0]), b=pr(M.axis[1]); x.save(); x.setLineDash([7,7]); x.lineWidth=1.6; x.strokeStyle=pal.muted; x.globalAlpha*=0.7; x.beginPath(); x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); x.stroke(); x.restore(); }
  const items=[];
  M.bonds.forEach(([i,j,o])=>{ const ai=M.atoms[i], aj=M.atoms[j], u=V.unit(V.sub(aj.p,ai.p));
   const s=pr(V.add(ai.p,V.mul(u,radOf(ai)*0.9))), mid=pr(V.mul(V.add(ai.p,aj.p),0.5)), e=pr(V.sub(aj.p,V.mul(u,radOf(aj)*0.9)));
   const w=sc*(o===2?0.085:0.125); let ox=0, oy=0; if(o===2){ const dx=e.x-s.x, dy=e.y-s.y, l=Math.hypot(dx,dy)||1; ox=-dy/l*w*0.72; oy=dx/l*w*0.72; }
   [[s,mid,ELC[ai.e]],[mid,e,ELC[aj.e]]].forEach(([p1,p2,col])=>{ const z=(p1.z+p2.z)/2, ww=w*(p1.f+p2.f)/2;
    const segs=o===2?[[1],[-1]].map(([k])=>[{x:p1.x+k*ox,y:p1.y+k*oy},{x:p2.x+k*ox,y:p2.y+k*oy}]):[[p1,p2]];
    items.push({z,d:()=>{ segs.forEach(([a,b])=>stick(x,a,b,ww,col)); fogOver(x,fogK(z),pal,f=>{ x.strokeStyle=f; x.lineWidth=ww; x.lineCap='round'; x.beginPath(); segs.forEach(([a,b])=>{ x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); }); x.stroke(); }); }}); }); });
  if(showLP) M.lps.forEach(([i,d])=>{ const q=pr(V.add(M.atoms[i].p,V.mul(d,0.55))), rd=rotDir(d,rot,mir); items.push({z:q.z,d:()=>lobe(x,q,rd,sc*q.f,pal,false)}); });
  A.forEach(q=>items.push({z:q.z,d:()=>{ const col=ELC[q.a.e]; ball(x,q,col,pal); const fz=fogK(q.z); if(fz>0.02){ x.save(); x.globalAlpha*=fz; x.fillStyle=pal.fog; x.beginPath(); x.arc(q.x,q.y,q.r,0,7); x.fill(); x.restore(); }
   if(labels&&q.r>7){ const t=(q.a.g||q.a.e), size=q.a.g?clamp(q.r*0.48,9,17):clamp(q.r*0.62,9,21); fText(x,t,q.x,q.y+size*0.05,{size,weight:700,font:pal.body,col:tone(col).txt,align:'center',base:'middle'}); }
   if(q.a.star){ fText(x,'*',q.x+q.r*0.78,q.y-q.r*0.55,{size:clamp(q.r*0.9,14,26),weight:800,font:pal.body,col:pal.brand,align:'center',base:'middle'}); } }}));
  items.sort((p,q)=>p.z-q.z).forEach(it=>it.d()); }
 function drawExam(x,M,pr,rot,mir,sc,pal){
  const A=M.atoms.map(a=>pr(a.p));
  if(M.axis){ const a=pr(M.axis[0]), b=pr(M.axis[1]); x.save(); x.setLineDash([7,7]); x.lineWidth=1.4; x.strokeStyle=pal.muted; x.globalAlpha*=0.6; x.beginPath(); x.moveTo(a.x,a.y); x.lineTo(b.x,b.y); x.stroke(); x.restore(); }
  const lab=M.atoms.map((a,i)=>{ const t=(a.g||a.e)+(a.star?'*':''), size=(i===0&&M.kind==='vsepr')?22:18; return {t,size,w:fText(x,t,0,0,{size,weight:600,font:pal.body,measure:true})}; });
  const trim=(L,dx,dy)=>Math.min((L.w/2+3)/Math.max(Math.abs(dx),1e-3),(L.size*0.5+2)/Math.max(Math.abs(dy),1e-3))+3;
  x.strokeStyle=pal.ink; x.fillStyle=pal.ink; x.lineCap='round'; x.lineJoin='round';
  M.bonds.forEach(([i,j,o])=>{ const a=A[i], b=A[j]; let dx=b.x-a.x, dy=b.y-a.y; const L=Math.hypot(dx,dy); if(L<2) return; dx/=L; dy/=L;
   const ti=trim(lab[i],dx,dy), tj=trim(lab[j],dx,dy); if(ti+tj>L-4) return; const p1={x:a.x+dx*ti,y:a.y+dy*ti}, p2={x:b.x-dx*tj,y:b.y-dy*tj}, nx=-dy, ny=dx;
   const dz=(b.z-a.z)/(V.len(V.sub(M.atoms[j].p,M.atoms[i].p))||1);
   if(o===2){ x.lineWidth=2.3; [1,-1].forEach(k=>{ x.beginPath(); x.moveTo(p1.x+nx*3.4*k,p1.y+ny*3.4*k); x.lineTo(p2.x+nx*3.4*k,p2.y+ny*3.4*k); x.stroke(); }); }
   else if(dz>0.4){ x.beginPath(); x.moveTo(p1.x,p1.y); x.lineTo(p2.x+nx*6,p2.y+ny*6); x.lineTo(p2.x-nx*6,p2.y-ny*6); x.closePath(); x.fill(); }
   else if(dz<-0.4){ const len=Math.hypot(p2.x-p1.x,p2.y-p1.y), n=Math.max(3,Math.round(len/5.5)); x.lineWidth=1.7; x.beginPath(); for(let k=1;k<=n;k++){ const t=k/n, cx=p1.x+(p2.x-p1.x)*t, cy=p1.y+(p2.y-p1.y)*t, h=0.8+5.2*t; x.moveTo(cx+nx*h,cy+ny*h); x.lineTo(cx-nx*h,cy-ny*h); } x.stroke(); }
   else { x.lineWidth=2.4; x.beginPath(); x.moveTo(p1.x,p1.y); x.lineTo(p2.x,p2.y); x.stroke(); } });
  if(showLP) M.lps.forEach(([i,d])=>{ const q=pr(V.add(M.atoms[i].p,V.mul(d,0.56))); lobe(x,q,rotDir(d,rot,mir),sc*0.88,pal,true); });
  A.forEach((q,i)=>{ const Lb=lab[i]; fText(x,Lb.t,q.x,q.y+1,{size:Lb.size,weight:i===0&&M.kind==='vsepr'?700:600,font:pal.body,col:pal.ink,align:'center',base:'middle'}); });
  if(M.charge){ let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; A.forEach((q,i)=>{ x0=Math.min(x0,q.x-lab[i].w/2); x1=Math.max(x1,q.x+lab[i].w/2); y0=Math.min(y0,q.y-12); y1=Math.max(y1,q.y+12); }); x0-=14; x1+=14; y0-=10; y1+=10;
   x.lineWidth=2; x.beginPath(); x.moveTo(x0+8,y0); x.lineTo(x0,y0); x.lineTo(x0,y1); x.lineTo(x0+8,y1); x.moveTo(x1-8,y0); x.lineTo(x1,y0); x.lineTo(x1,y1); x.lineTo(x1-8,y1); x.stroke(); fText(x,M.charge,x1+5,y0+4,{size:20,weight:700,font:pal.body,col:pal.ink}); } }
 function arcs(x,M,pr,pal){ M.angles.forEach(([c,i,j,t,w])=>{ const pc=M.atoms[c].p, u=V.unit(V.sub(M.atoms[i].p,pc)), v=V.unit(V.sub(M.atoms[j].p,pc)), d=V.dot(u,v), rc=radOf(M.atoms[c])*(1-ex*0.15);
   const th=Math.acos(clamp(d,-1,1)), sn=Math.sin(th), ww=V.unit(w||[0,1,0]);
   const at=(t,r)=>{ const dir=d<-0.999?V.add(V.mul(u,Math.cos(t*Math.PI)),V.mul(ww,Math.sin(t*Math.PI))):V.add(V.mul(u,Math.sin((1-t)*th)/sn),V.mul(v,Math.sin(t*th)/sn)); return pr(V.add(pc,V.mul(dir,r))); };
   const r1=rc+0.1, r2=rc+0.36, N=30, out=[], inn=[]; for(let k=0;k<=N;k++){ out.push(at(k/N,r2)); inn.push(at(k/N,r1)); }
   x.beginPath(); out.forEach((p,k)=>k?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y)); for(let k=N;k>=0;k--) x.lineTo(inn[k].x,inn[k].y); x.closePath(); x.save(); x.globalAlpha*=1-ex; x.fillStyle=pal.arcFill; x.fill(); x.restore();
   x.beginPath(); out.forEach((p,k)=>k?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y)); x.lineWidth=2.2; x.strokeStyle=pal.brand; x.lineCap='round'; x.stroke();
   const q=at(0.5,r2+0.34-ex*0.06); x.font=`700 12.5px ${pal.body}`; const tw=x.measureText(t).width+14; LK.rr(x,q.x-tw/2,q.y-11,tw,22,11); x.fillStyle=pal.pill; x.fill(); x.lineWidth=1.3; x.strokeStyle=pal.brand; x.stroke();
   x.fillStyle=pal.brand; x.textAlign='center'; x.textBaseline='middle'; x.fillText(t,q.x,q.y+0.5); }); }
 function legend(x,M,W,H,pal){ x.save(); x.font=`500 12px ${pal.body}`; x.textBaseline='middle'; const y=H-17; let cx=W-14; const put=(w,fn,t)=>{ const tw=x.measureText(t).width; cx-=tw; x.fillStyle=pal.muted; x.textAlign='left'; x.fillText(t,cx,y); cx-=w+6; fn(cx,y); cx-=16; };
  if(ex>0.5){ put(18,(a,b)=>{ x.strokeStyle=pal.ink2; x.lineWidth=1.5; x.beginPath(); for(let k=1;k<=4;k++){ const h=0.8+4*k/4, xx=a+k*4.2; x.moveTo(xx,b-h); x.lineTo(xx,b+h); } x.stroke(); },'away');
   put(18,(a,b)=>{ x.fillStyle=pal.ink2; x.beginPath(); x.moveTo(a,b); x.lineTo(a+18,b-5); x.lineTo(a+18,b+5); x.closePath(); x.fill(); },'towards you');
   put(18,(a,b)=>{ x.strokeStyle=pal.ink2; x.lineWidth=2.2; x.beginPath(); x.moveTo(a,b); x.lineTo(a+18,b); x.stroke(); },'in the page'); }
  else { if(showLP&&M.lps.length) put(14,(a,b)=>{ x.fillStyle=pal.lpA; x.beginPath(); x.ellipse(a+7,b,8,5,0,0,7); x.fill(); x.fillStyle=pal.accent; x.beginPath(); x.arc(a+8,b-1.8,1.5,0,7); x.arc(a+8,b+1.8,1.5,0,7); x.fill(); },'lone pair');
   [...new Set(M.atoms.filter(a=>!a.g).map(a=>a.e))].reverse().forEach(e=>put(10,(a,b)=>{ const c=tone(ELC[e]); const g=x.createRadialGradient(a+3,b-2,0.5,a+5,b,6); g.addColorStop(0,c.hi); g.addColorStop(0.5,c.base); g.addColorStop(1,c.lo); x.fillStyle=g; x.beginPath(); x.arc(a+5,b,5,0,7); x.fill(); },ELN[e])); }
  x.restore(); }
 function render(){ const P=LK.P(), pal=pals(P), x=st.ctx, W=st.w, H=st.h, M=Mo();
  const bg=x.createRadialGradient(W/2,H*0.42,10,W/2,H*0.5,Math.max(W,H)*0.75); bg.addColorStop(0,pal.bgIn); bg.addColorStop(1,pal.bgOut); x.fillStyle=bg; x.fillRect(0,0,W,H);
  if(ex>0){ x.save(); x.globalAlpha=ex*0.85; LK.grid(x,W,H,22); x.restore(); }
  const n=mirror?2:1, top=60, bot=36, Rv=(H-top-bot)/2, Rh=n===2?W/4-12:W/2-24, pix=Math.max(36,Math.min(Rv*1.08,Rh));
  const e3=1-Math.pow(1-tin,3), sc=pix/M.R*(0.86+0.14*e3), cy=top+Rv, persp=0.085*(1-ex);
  if(n===2){ x.save(); const g=x.createLinearGradient(W/2-26,0,W/2+26,0); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.5,pal.mirror); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(W/2-26,top-6,52,H-top-bot+12);
   x.setLineDash([5,6]); x.strokeStyle=pal.accent; x.globalAlpha=0.55; x.lineWidth=1.5; x.beginPath(); x.moveTo(W/2,top-6); x.lineTo(W/2,H-bot+6); x.stroke(); x.restore();
   if(W>=560){ x.save(); x.font=`700 10px ${pal.body}`; x.fillStyle=pal.accent; x.textAlign='center'; x.fillText('MIRROR',W/2,top-12); x.restore(); } }
  for(let k=0;k<n;k++){ const cx=n===2?(k?W*0.75:W*0.25):W/2, rot=k?rotR:rotL, pr=projector(M,rot,cx,cy,sc,persp,k===1);
   if(ex<0.999){ x.save(); x.globalAlpha=e3*(1-ex); draw3D(x,M,pr,rot,k===1,sc,pal,cy+pix*1.0); x.restore(); }
   if(ex>0.001){ x.save(); x.globalAlpha=e3*ex; drawExam(x,M,pr,rot,k===1,sc,pal); x.restore(); }
   if(showAng){ x.save(); x.globalAlpha=e3; arcs(x,M,pr,pal); x.restore(); }
   if(n===2){ x.save(); x.font=`600 12.5px ${pal.body}`; x.fillStyle=pal.ink2; x.textAlign='center'; x.fillText(k?(linked?'mirror image':'mirror image (turned)'):'molecule',cx,H-bot+4); x.restore(); } }
  /* title */
  const ts=W<420?24:28, tw=fText(x,M.title,18,40,{size:ts,weight:700,font:pal.display,col:pal.ink});
  if(M.kind==='vsepr'&&W>=360) fText(x,M.name,18+tw+10,40,{size:13,weight:500,font:pal.body,col:pal.muted});
  fText(x,M.cap,18,62,{size:13.5,weight:600,font:pal.body,col:pal.brand});
  /* legend and hint */
  if(!(hint>0.02&&W<560)) legend(x,M,W,H,pal);
  if(hint>0.02){ x.save(); x.globalAlpha=hint; x.font=`500 12px ${pal.body}`; x.fillStyle=pal.muted; x.textAlign='left'; x.textBaseline='middle'; x.fillText(mirror?'Drag either molecule to turn it · double-click to reset':'Drag to rotate · double-click to reset',16,H-17); x.restore(); } }
 S.loop(dt=>{ tin=Math.min(1,tin+dt/0.5); const want=exam?1:0; ex+=(want-ex)*Math.min(1,dt*7); if(Math.abs(ex-want)<0.003) ex=want; if(dragged) hint=Math.max(0,hint-dt*1.2);
  if(!drag){ if(target){ const k=Math.min(1,dt*6.5); rotL.yaw+=(target.yaw-rotL.yaw)*k; rotL.pitch+=(target.pitch-rotL.pitch)*k; if(Math.abs(target.yaw-rotL.yaw)+Math.abs(target.pitch-rotL.pitch)<1e-3){ rotL.yaw=target.yaw; rotL.pitch=target.pitch; target=null; } }
   const sp=spin?0.42:0, dmp=Math.exp(-dt*3.2);
   [rotL,rotR].forEach((r,k)=>{ if(k===1&&linked) return; r.yaw+=r.vy*dt; r.pitch=clamp(r.pitch+r.vp*dt,-1.45,1.45); r.vy*=dmp; r.vp*=dmp; });
   rotL.yaw+=sp*dt; if(!linked) rotR.yaw-=sp*dt; syncR(); }
  render(); });
 el.lkPreset=o=>{ o=o||{}; if(o.mirror!=null&&!!o.mirror!==mirror){ mirror=!!o.mirror; cMir.checked=mirror; } if(o.mol) pick(o.mol); if(o.view) setView(o.view); if(o.spin!=null&&!exam){ spin=!!o.spin; spinWas=spin; cSpin.checked=spin; } };
 pick(m);
 return ()=>S.dispose(); }};
/* live preview. Home-page hero: a bubbling flask brews each molecule in turn; it rises out of the neck, spins, then pops.
   {bare:true} (labs page banner): just the spinning molecule. Stops itself when its canvas leaves the page. */
const FLASK=typeof Path2D==='function'?{glass:new Path2D('M172 40h56v8h-6v62l58 104q6 14-10 14H130q-16 0-10-14l58-104V48h-6z'),liq:new Path2D('M152 168h96l32 46q6 14-10 14H130q-16 0-10-14z')}:null;
L.shapes.preview=(cv,opt)=>{ opt=opt||{}; const bare=!!opt.bare||!FLASK, ids=opt.ids||['nh3','sf6','h2o','pcl5','ch4','xef4','bf3','co2'], x=cv.getContext('2d'), red=LK.reduced();
 const P=LK.P(), body=P.body, mono=P.mono, disp=getComputedStyle(document.documentElement).getPropertyValue('--f-display').trim()||'sans-serif', ac='#ac90ff', INK='#140a04', CREAM='#fff4ea';
 const pal={rim:'rgba(0,0,0,.5)',accent:ac,lpA:rgba(ac,0.62),lpB:rgba(ac,0.3),lpC:rgba(ac,0.06),lpLine:rgba(ac,0.75),lpGlow:rgba(ac,0.55)};
 const HOLD=5.2, RISE=0.9, POP=0.32; let W=0, H=0, k=0, t=red?RISE:0, yaw=0.5, last=performance.now(), drip=0;
 const bub=[], ease=u=>1-Math.pow(1-clamp(u,0,1),3), back=u=>{ u=clamp(u,0,1)-1; return 1+2.6*u*u*u+1.6*u*u; };
 const fit=()=>{ const r=cv.getBoundingClientRect(), d=Math.min(2,window.devicePixelRatio||1); W=r.width; H=r.height; cv.width=Math.max(1,Math.round(W*d)); cv.height=Math.max(1,Math.round(H*d)); x.setTransform(d,0,0,d,0,0); };
 let ro=null; try{ ro=new ResizeObserver(()=>{ fit(); if(red) draw(); }); ro.observe(cv); }catch(e){} fit();
 /* where things go: words on the left (wide cards only), the flask, then the molecule hovering beside its neck */
 const lay=()=>{ const wide=W>=420, tw=wide?Math.min(210,W*0.4):0, rest=W-tw, fs=Math.min(H*0.56/188,rest*0.34/172), fx=tw+rest*(wide?0.22:0.26), fy=H-14;
  return {wide,fs,fx,fy,mouth:{x:fx,y:fy-188*fs},liquid:fy-60*fs,pix:Math.min(H*0.3,rest*0.2),mx:tw+rest*0.7,my:H*0.43}; };
 const spawn=(L,n,burst)=>{ for(let i=0;i<n;i++) bub.push(burst?{x:L.mouth.x+(Math.random()-0.5)*8,y:L.mouth.y+4,vx:20+Math.random()*40,vy:-30-Math.random()*50,r:1.8+Math.random()*2.4,life:0,max:1.1+Math.random()*0.6,out:true}:{x:L.fx+(Math.random()-0.5)*26*L.fs,y:L.liquid+4,vx:0,vy:-34-Math.random()*26,r:(3+Math.random()*3)*L.fs,life:0,max:9,out:false}); };
 const popAt=(px,py)=>{ for(let i=0;i<9;i++){ const a=i/9*Math.PI*2+Math.random()*0.4, s=40+Math.random()*50; bub.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s-10,r:1.4+Math.random()*2,life:0,max:0.45+Math.random()*0.3,out:true,pop:true}); } };
 const step=(dt,L,M)=>{ drip-=dt; if(drip<=0){ drip=0.28+Math.random()*0.25; spawn(L,1,false); }
  for(let i=bub.length-1;i>=0;i--){ const b=bub[i]; b.life+=dt;
   if(!b.out){ b.vy-=dt*10; b.x+=(L.fx-b.x)*Math.min(1,dt*3)+Math.sin((b.life+i)*7)*0.15; b.y+=b.vy*dt; if(b.y<L.mouth.y){ b.out=true; b.vx=12+Math.random()*24; b.life=0; b.max=0.9+Math.random()*0.7; } }
   else { if(!b.pop){ b.vx+=((L.mx-b.x)*0.6-b.vx*0.4)*dt; b.vy+=(-8-b.vy*0.3)*dt; } else { b.vx*=Math.exp(-dt*3); b.vy*=Math.exp(-dt*3); } b.x+=b.vx*dt; b.y+=b.vy*dt; }
   if((b.out&&b.life>b.max)||b.y<-10) bub.splice(i,1); } };
 const drawBubbles=(inside)=>{ bub.forEach(b=>{ if(b.out===inside) return; const al=b.out?clamp(1-b.life/b.max,0,1):1; if(al<=0.01) return; x.save(); x.globalAlpha*=al; x.beginPath(); x.arc(b.x,b.y,b.r,0,7); x.fillStyle=b.pop?'#ffd3b5':CREAM; x.fill(); x.lineWidth=b.out?1:1.6; x.strokeStyle=b.out?'rgba(255,200,160,.55)':INK; x.stroke(); x.restore(); }); };
 const drawFlask=L=>{ /* a soft glow and a shadow so it sits on the bench */
  x.save(); const gl=x.createRadialGradient(L.fx,L.fy-70*L.fs,4,L.fx,L.fy-70*L.fs,130*L.fs); gl.addColorStop(0,'rgba(255,122,47,.28)'); gl.addColorStop(1,'rgba(255,122,47,0)'); x.fillStyle=gl; x.fillRect(L.fx-140*L.fs,L.fy-210*L.fs,280*L.fs,220*L.fs);
  x.translate(L.fx,L.fy+3); x.scale(1,0.16); const sh=x.createRadialGradient(0,0,0,0,0,100*L.fs); sh.addColorStop(0,'rgba(0,0,0,.55)'); sh.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=sh; x.fillRect(-100*L.fs,-100*L.fs,200*L.fs,200*L.fs); x.restore();
  x.save(); x.translate(L.fx,L.fy); x.scale(L.fs,L.fs); x.translate(-200,-228); x.lineJoin='round'; x.lineWidth=4; x.strokeStyle=INK;
  x.fillStyle=CREAM; x.fill(FLASK.glass); x.stroke(FLASK.glass); x.fillStyle='#ff7a2f'; x.fill(FLASK.liq); x.stroke(FLASK.liq);
  x.lineWidth=3; [[176,204,7],[222,196,5],[204,214,4]].forEach(([bx,by,br])=>{ x.beginPath(); x.arc(bx,by,br,0,7); x.fillStyle=CREAM; x.fill(); x.stroke(); });
  x.restore(); };
 const drawMol=(M,cx,cy,sc,al,floor)=>{ const rot={yaw,pitch:0.3}, pr=projector(M,rot,cx,cy,sc,0.085,false); x.save(); x.globalAlpha*=al;
  const A=M.atoms.map(at=>{ const q=pr(at.p); q.r=radOf(at)*sc*q.f; q.a=at; return q; }), items=[];
  if(floor!=null) A.forEach(q=>{ const sy=floor+q.z*sc*0.1, rx=q.r*1.7; x.save(); x.translate(q.x,sy); x.scale(1,0.2); const g=x.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,'rgba(0,0,0,.42)'); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(-rx,-rx,2*rx,2*rx); x.restore(); });
  M.bonds.forEach(([i,j,o])=>{ const ai=M.atoms[i], aj=M.atoms[j], u=V.unit(V.sub(aj.p,ai.p)), s=pr(V.add(ai.p,V.mul(u,radOf(ai)*0.9))), mid=pr(V.mul(V.add(ai.p,aj.p),0.5)), en=pr(V.sub(aj.p,V.mul(u,radOf(aj)*0.9)));
   const w=sc*(o===2?0.085:0.125); let ox=0, oy=0; if(o===2){ const dx=en.x-s.x, dy=en.y-s.y, l=Math.hypot(dx,dy)||1; ox=-dy/l*w*0.72; oy=dx/l*w*0.72; }
   [[s,mid,ELC[ai.e]],[mid,en,ELC[aj.e]]].forEach(([p1,p2,col])=>{ const ww=w*(p1.f+p2.f)/2; items.push({z:(p1.z+p2.z)/2,d:()=>{ if(o===2) [1,-1].forEach(m=>stick(x,{x:p1.x+m*ox,y:p1.y+m*oy},{x:p2.x+m*ox,y:p2.y+m*oy},ww,col)); else stick(x,p1,p2,ww,col); }}); }); });
  M.lps.forEach(([i,d])=>{ const q=pr(V.add(M.atoms[i].p,V.mul(d,0.55))); items.push({z:q.z,d:()=>lobe(x,q,rotDir(d,rot,false),sc*q.f,pal,false)}); });
  A.forEach(q=>items.push({z:q.z,d:()=>{ ball(x,q,ELC[q.a.e],pal); const fz=clamp(-q.z/M.R,0,1)*0.3; if(fz>0.02){ x.save(); x.globalAlpha*=fz; x.fillStyle='#12060c'; x.beginPath(); x.arc(q.x,q.y,q.r,0,7); x.fill(); x.restore(); }
   if(q.r>8) fText(x,q.a.e,q.x,q.y+0.5,{size:clamp(q.r*0.62,9,16),weight:700,font:body,col:tone(ELC[q.a.e]).txt,align:'center',base:'middle'}); }}));
  items.sort((p,q)=>p.z-q.z).forEach(it=>it.d()); x.restore(); };
 const draw=()=>{ if(W<10||H<10) return; const M=MOLS[ids[k]];
  if(bare){ const a=clamp(Math.min(t/0.45,(HOLD-t)/0.45),0,1), e=ease(a), pix=Math.min(H*0.37,W*0.4); x.clearRect(0,0,W,H); drawMol(M,W/2,H*0.47,pix/M.R*(0.86+0.14*e),a,H*0.47+pix*1.02); return; }
  const L=lay();
  const bg=x.createRadialGradient(L.mx,H*0.42,6,W*0.6,H*0.5,Math.max(W,H)*0.85); bg.addColorStop(0,'#3d1e0b'); bg.addColorStop(1,'#12060c'); x.fillStyle=bg; x.fillRect(0,0,W,H);
  x.save(); x.strokeStyle='rgba(255,178,122,.07)'; x.lineWidth=1; x.beginPath(); for(let g=8;g<W;g+=26){ x.moveTo(g+0.5,0); x.lineTo(g+0.5,H); } for(let g=10;g<H;g+=26){ x.moveTo(0,g+0.5); x.lineTo(W,g+0.5); } x.stroke(); x.restore();
  /* the molecule's life: rises out of the neck, hovers and spins, then pops */
  const up=red?1:t/RISE, popping=!red&&t>HOLD-POP, pv=popping?(t-(HOLD-POP))/POP:0, ue=ease(up), sb=back(up);
  const qx=(1-ue)*(1-ue)*L.mouth.x+2*(1-ue)*ue*L.mouth.x+ue*ue*L.mx, qy=(1-ue)*(1-ue)*L.mouth.y+2*(1-ue)*ue*(L.my-L.pix*0.6)+ue*ue*L.my;
  const al=clamp(up*3,0,1)*(1-pv), scl=(0.12+0.88*sb)*(1+0.3*pv);
  /* words */
  const lx=Math.max(16,W*0.045), textA=clamp(up*2,0,1)*(1-pv);
  if(L.wide){ const ty=H*0.24;
   x.save(); x.font=`600 10.5px ${mono}`; x.fillStyle='#ffb07f'; x.textBaseline='alphabetic'; x.fillText('FEATURED LAB',lx,ty); x.restore();
   fText(x,'3D shapes',lx,ty+29,{size:27,weight:700,font:disp,col:'#ffffff'}); fText(x,'of molecules',lx,ty+56,{size:27,weight:700,font:disp,col:'#ffffff'});
   x.save(); x.globalAlpha=textA; const fw=fText(x,M.title,lx,ty+86,{size:17,weight:700,font:body,col:'#ffd3b5'}); fText(x,'· '+M.ang,lx+fw+7,ty+86,{size:13,weight:600,font:body,col:'#ff9a5c'});
   fText(x,M.shape.toLowerCase(),lx,ty+104,{size:12.5,weight:500,font:body,col:'#c9a184'}); x.restore(); }
  else { x.save(); x.font=`600 10px ${mono}`; x.fillStyle='#ffb07f'; x.textBaseline='alphabetic'; x.fillText('FEATURED LAB · 3D SHAPES',lx,22); x.restore();
   x.save(); x.globalAlpha=textA; fText(x,M.title,lx,43,{size:17,weight:700,font:body,col:'#ffd3b5'}); fText(x,M.shape.toLowerCase(),lx,59,{size:11.5,weight:500,font:body,col:'#c9a184'}); x.restore(); }
  drawFlask(L);
  drawBubbles(false);
  drawBubbles(true);
  if(al>0.01) drawMol(M,qx,qy,L.pix/M.R*scl,al,null); };
 const frame=now=>{ if(!cv.isConnected){ if(ro) ro.disconnect(); return; } const dt=Math.min(0.05,Math.max(0,(now-last)/1000)); last=now;
  if(!red){ yaw+=dt*0.6; t+=dt;
   if(!bare&&W>10){ const L=lay(); if(t>=HOLD-POP&&t-dt<HOLD-POP) popAt(L.mx,L.my); if(t>=HOLD){ t=0; k=(k+1)%ids.length; spawn(L,7,true); } step(dt,L); }
   else if(t>=HOLD){ t=0; k=(k+1)%ids.length; } }
  if(!document.hidden) draw(); if(!red) requestAnimationFrame(frame); };
 requestAnimationFrame(frame); };
}

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
