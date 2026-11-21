/* TrainTanmay Chemistry labs, part A: titration, calorimetry, rates (Boltzmann + collisions), equilibrium. */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const Kw=1e-14;
const mix=(a,b,f)=>{ const p=s=>s.match(/\d+/g).map(Number); const A=p(a),B=p(b); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*f)).join(',')})`; };
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ======================= TITRATION ======================= */
/* pH of acid HA (strong or weak) partly neutralised by base B (strong or weak): solve the charge balance */
function titrPH(acid,base,Ca,Va,Cb,Vb){
  const V=Va+Vb, A=Ca*Va/V, B=Cb*Vb/V;
  const f=lh=>{ const h=Math.pow(10,lh);
    const an=acid.Ka?A*acid.Ka/(acid.Ka+h):A;                  /* A⁻ or Cl⁻ */
    const cat=base.Kb?B*h/(h+Kw/base.Kb):B;                     /* BH⁺ or Na⁺ */
    return h+cat-Kw/h-an; };
  let lo=-14.9, hi=1.5; for(let i=0;i<70;i++){ const m=(lo+hi)/2; if(f(m)>0) hi=m; else lo=m; }
  return -(lo+hi)/2;
}
const ACIDS={hcl:{n:'hydrochloric acid (strong)',f:'HCl'},eth:{n:'ethanoic acid (weak, Ka 1.74 × 10⁻⁵)',f:'CH₃COOH',Ka:1.74e-5}};
const BASES={naoh:{n:'sodium hydroxide (strong)',f:'NaOH'},nh3:{n:'ammonia (weak, Kb 1.8 × 10⁻⁵)',f:'NH₃',Kb:1.8e-5}};
const INDS={
 mo:{n:'methyl orange',pk:3.7,lo:3.1,hi:4.4,a:'rgb(222,52,40)',b:'rgb(244,196,48)',an:'red',bn:'yellow'},
 pp:{n:'phenolphthalein',pk:9.2,lo:8.3,hi:10.0,a:'rgb(236,240,246)',b:'rgb(222,60,160)',an:'colourless',bn:'pink'},
 bb:{n:'bromothymol blue',pk:7.0,lo:6.0,hi:7.6,a:'rgb(236,206,40)',b:'rgb(40,92,200)',an:'yellow',bn:'blue'},
 un:{n:'universal indicator',uni:true}};
const uniCol=pH=>{ const stops=[[1,'rgb(200,30,40)'],[3,'rgb(238,110,40)'],[5,'rgb(240,200,40)'],[7,'rgb(70,170,70)'],[9,'rgb(40,120,190)'],[11,'rgb(70,60,170)'],[13,'rgb(110,40,140)']]; if(pH<=1) return stops[0][1]; for(let i=1;i<stops.length;i++){ if(pH<=stops[i][0]) return mix(stops[i-1][1],stops[i][1],(pH-stops[i-1][0])/(stops[i][0]-stops[i-1][0])); } return stops[stops.length-1][1]; };
const indCol=(ind,pH)=>ind.uni?uniCol(pH):mix(ind.a,ind.b,1/(1+Math.pow(10,ind.pk-pH)));

L.titration={title:'Titration lab',cat:'Acids & bases',topic:'5.1.3',anim:false,
desc:'Run a burette into an acid, watch the indicator change and plot the pH curve as you go. Choose strong or weak acids and bases, pick an indicator, or find the concentration of an unknown acid.',
icon:'<path d="M54 6h12v62l-6 8-6-8z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 84h40l14 26H26z" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="80" r="3" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let acid='hcl', base='naoh', ind='pp', Ca=0.100, Cb=0.100, Va=25.0, Vb=0, open=false, rate=0.5, unknown=false, pts=[];
 const sA=LK.select(ct,{label:'Acid in the flask (25.0 cm³)',options:Object.entries(ACIDS).map(([k,v])=>[k,v.n]),value:acid,on:v=>{acid=v;reset();}});
 const sB=LK.select(ct,{label:'Alkali in the burette',options:Object.entries(BASES).map(([k,v])=>[k,v.n]),value:base,on:v=>{base=v;reset();}});
 const sI=LK.select(ct,{label:'Indicator',options:Object.entries(INDS).map(([k,v])=>[k,v.n]),value:ind,on:v=>{ind=v;}});
 const cA=LK.slider(ct,{label:'Acid concentration',min:0.05,max:0.20,step:0.01,value:0.10,fmt:v=>unknown?'? (unknown)':v.toFixed(2)+' mol dm⁻³',on:v=>{Ca=v;reset();}});
 const cB=LK.slider(ct,{label:'Alkali concentration',min:0.05,max:0.20,step:0.01,value:0.10,fmt:v=>v.toFixed(2)+' mol dm⁻³',on:v=>{Cb=v;reset();}});
 const fr=LK.slider(ct,{label:'Tap flow',min:0.05,max:2,step:0.05,value:0.5,fmt:v=>v.toFixed(2)+' cm³ s⁻¹',on:v=>{rate=v;}});
 const ct2=LK.ctrl(el);
 const bTap=LK.button(ct2,'Open tap',()=>{ open=!open; bTap.textContent=open?'Close tap':'Open tap'; bTap.classList.toggle('primary',open); },'primary');
 LK.button(ct2,'Add 1 drop (0.05 cm³)',()=>add(0.05));
 LK.button(ct2,'Add 1.00 cm³',()=>add(1));
 LK.button(ct2,'Refill and reset',()=>reset());
 const uk=LK.check(ct2,'Unknown acid concentration',false,v=>{ unknown=v; if(v){ Ca=+(0.06+Math.random()*0.12).toFixed(3); } else { Ca=cA.v; } cA.refresh(); reset(); });
 LK.button(ct2,'Reveal concentration',()=>{ note.innerHTML=unknown?`The acid concentration was <b>${Ca.toFixed(3)} mol dm⁻³</b>. Check: c(acid) = c(alkali) × titre ÷ 25.0 (for a 1 : 1 reaction).`:'Tick <b>Unknown acid concentration</b> first.'; });
 const curve=LK.check(ct2,'Show the full pH curve',false,()=>draw());
 const st=LK.stage(el,S,{ratio:0.62,maxH:430});
 const ro=LK.readout(el,[['r','burette reading / cm³'],['ph','pH in the flask'],['c','indicator colour'],['eq','equivalence point']]);
 const plot=LK.plot(el,S,{xlab:'volume of alkali added / cm³',ylab:'pH',ratio:0.42});
 const note=LK.el('<p class="muted" style="margin:6px 0 0;font-size:.9rem" aria-live="polite"></p>'); el.appendChild(note);
 LK.note(el,'The <b>equivalence point</b> is where the moles of alkali added exactly equal the moles of acid; it is in the middle of the steep part of the curve. The <b>end point</b> is where the indicator changes colour. A good indicator changes colour completely <b>within the steep part</b>. Strong acid + strong base: the steep part runs from about pH 3 to 11, so methyl orange or phenolphthalein both work. Weak acid + strong base: the steep part is about 7 to 11, so use phenolphthalein. Strong acid + weak base: about 3 to 7, so use methyl orange. Weak acid + weak base: no steep part, so no indicator works. Half-way to the equivalence point of a weak acid, pH = pK<sub>a</sub>.');
 const eqV=()=>Ca*Va/Cb;
 const pH=()=>titrPH(ACIDS[acid],BASES[base],Ca,Va,Cb,Vb);
 function reset(){ Vb=0; open=false; bTap.textContent='Open tap'; pts=[[0,pH()]]; note.textContent=''; draw(); }
 function add(v){ Vb=clamp(+(Vb+v).toFixed(2),0,50); const p=pH(); pts.push([Vb,p]); draw(); }
 function draw(){ const P=LK.P(), x=st.ctx, W=st.w, H=st.h; st.clear(); LK.grid(x,W,H,24);
  const p=pH(), I=INDS[ind], col=indCol(I,p);
  /* burette */
  const bx=W*0.30, by=16, bh=H*0.62, bw=22;
  x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(bx-bw/2,by,bw,bh);
  const fill=(50-Vb)/50; x.fillStyle='rgba(120,170,230,.35)'; x.fillRect(bx-bw/2+2,by+bh*(1-fill)*0.96+2,bw-4,bh*fill*0.96);
  for(let v=0;v<=50;v+=1){ const y=by+4+(bh-8)*v/50; x.beginPath(); x.moveTo(bx+bw/2-(v%5?5:10),y); x.lineTo(bx+bw/2,y); x.stroke(); if(v%10===0) LK.text(x,String(v),bx+bw/2+4,y+4,P.muted,{size:10}); }
  const my=by+4+(bh-8)*Vb/50; x.strokeStyle=P.brand; x.lineWidth=2; x.beginPath(); x.moveTo(bx-bw/2-6,my); x.lineTo(bx+bw/2+6,my); x.stroke();
  /* tap and stream */
  x.fillStyle=P.ink2; x.fillRect(bx-3,by+bh,6,14); x.fillStyle=open?P.good:P.bad; x.fillRect(bx-9,by+bh+4,18,5);
  if(open&&Vb<50){ x.strokeStyle='rgba(120,170,230,.8)'; x.lineWidth=2; x.beginPath(); x.moveTo(bx,by+bh+14); x.lineTo(bx,H*0.80); x.stroke(); }
  /* conical flask */
  const fx=bx, fy=H*0.80, fw=W*0.18;
  x.beginPath(); x.moveTo(fx-10,fy-34); x.lineTo(fx-10,fy-18); x.lineTo(fx-fw/2,fy+H*0.15); x.lineTo(fx+fw/2,fy+H*0.15); x.lineTo(fx+10,fy-18); x.lineTo(fx+10,fy-34);
  x.fillStyle=P.surface; x.fill(); x.strokeStyle=P.ink2; x.lineWidth=2; x.stroke();
  const lv=fy+H*0.15-(H*0.08+Vb*0.6);
  x.save(); x.beginPath(); x.moveTo(fx-10,fy-34); x.lineTo(fx-10,fy-18); x.lineTo(fx-fw/2,fy+H*0.15); x.lineTo(fx+fw/2,fy+H*0.15); x.lineTo(fx+10,fy-18); x.lineTo(fx+10,fy-34); x.clip();
  x.fillStyle=col; x.globalAlpha=.85; x.fillRect(fx-fw,lv,fw*2,H); x.restore();
  /* close-up of the meniscus */
  const zx=W*0.58, zy=26, zw=W*0.36, zh=H*0.5; x.fillStyle=P.surface; x.strokeStyle=P.line2; x.lineWidth=1; LK.rr(x,zx,zy,zw,zh,10); x.fill(); x.stroke();
  LK.text(x,'Close-up: read the bottom',zx+8,zy+16,P.muted,{size:10,mono:false}); LK.text(x,'of the meniscus',zx+8,zy+28,P.muted,{size:10,mono:false});
  const sc=zh*0.7/2, cx=zx+zw*0.45, top=zy+Math.max(zh*0.22,38), r0=Math.floor(Vb*10)/10-0.5;
  /* the graduated tube ends at the 50 mark; below it the burette narrows to the tap */
  const bot=top+zh*0.75, y50=top+(50-r0)*sc, empty=Vb>=49.999, tubeEnd=Math.min(bot,y50);
  const outline=()=>{ x.beginPath(); x.moveTo(cx-30,top); x.lineTo(cx-30,tubeEnd); if(y50<bot){ x.lineTo(cx-8,Math.min(bot,y50+28)); x.lineTo(cx-8,bot); x.lineTo(cx+8,bot); x.lineTo(cx+8,Math.min(bot,y50+28)); } x.lineTo(cx+30,tubeEnd); x.lineTo(cx+30,top); };
  if(!empty){ x.save(); outline(); x.closePath(); x.clip();
   x.fillStyle='rgba(120,170,230,.35)'; const mY=top+(Vb-r0)*sc; x.fillRect(cx-30,mY,60,zh);
   x.strokeStyle='rgba(60,110,190,.9)'; x.lineWidth=2; x.beginPath(); x.moveTo(cx-30,mY-4); x.quadraticCurveTo(cx,mY+8,cx+30,mY-4); x.stroke(); x.restore(); }
  x.strokeStyle=P.ink2; x.lineWidth=1.5; outline(); x.stroke();
  for(let k=0;k<=20;k++){ const v=r0+k*0.1; if(v>50.001) break; const y=top+(v-r0)*sc; if(y>bot) break; const major=Math.abs(v*10-Math.round(v)*10)<0.01; x.beginPath(); x.moveTo(cx+30,y); x.lineTo(cx+30+(major?16:8),y); x.stroke(); if(major) LK.text(x,v.toFixed(0),cx+50,y+4,P.ink,{size:12}); }
  if(empty) LK.text(x,'empty: refill it',zx+8,zy+zh+36,P.bad,{size:12,mono:false,weight:700});
  LK.text(x,'reading: '+(Math.round(Vb*20)/20).toFixed(2)+' cm³',zx+8,zy+zh+18,P.brand,{size:13,weight:700});
  ro.set('r',(Math.round(Vb*20)/20).toFixed(2)); ro.set('ph',p.toFixed(2)); ro.set('c',I.uni?'universal':(1/(1+Math.pow(10,I.pk-p))>0.9?I.bn:1/(1+Math.pow(10,I.pk-p))<0.1?I.an:'changing')); ro.set('eq',unknown?'?':eqV().toFixed(2)+' cm³');
  const ser=[{pts:pts.slice().sort((a,b)=>a[0]-b[0]),points:true,r:3,color:P.brand}];
  if(curve.checked){ const full=[]; for(let v=0;v<=50;v+=0.25) full.push([v,titrPH(ACIDS[acid],BASES[base],Ca,Va,Cb,v)]); ser.unshift({pts:full,color:P.accent,w:1.6}); }
  if(!I.uni){ ser.push({pts:[[0,I.lo],[50,I.lo]],color:P.muted,dash:[4,4],w:1},{pts:[[0,I.hi],[50,I.hi]],color:P.muted,dash:[4,4],w:1}); }
  plot.set(ser,{xmin:0,xmax:50,ymin:0,ymax:14});
 }
 S.loop(dt=>{ if(open&&dt>0){ const before=Vb; Vb=clamp(Vb+rate*dt,0,50); if(Vb>=50){ open=false; bTap.textContent='Open tap'; } if(Math.floor(before*4)!==Math.floor(Vb*4)) pts.push([Vb,pH()]); draw(); } });
 el.lkPreset=(o)=>{ if(o.acid){ sA.value=o.acid; acid=o.acid; } if(o.base){ sB.value=o.base; base=o.base; } if(o.ind){ sI.value=o.ind; ind=o.ind; } reset(); if(o.curve){ curve.checked=true; draw(); } };
 reset(); return ()=>S.dispose(); }};

/* ======================= CALORIMETRY ======================= */
const RXNS={
 neut:{n:'HCl(aq) + NaOH(aq) (neutralisation)',dH:-57.1,lit:'−57.1 kJ mol⁻¹ (per mole of water)',per:'water formed',two:true},
 zn:{n:'Zn(s) + CuSO₄(aq) (displacement, excess zinc)',dH:-217,lit:'−217 kJ mol⁻¹ (per mole of CuSO₄)',per:'CuSO₄'},
 nh4:{n:'NH₄NO₃(s) dissolving in water (endothermic)',dH:25.7,lit:'+25.7 kJ mol⁻¹ (per mole of NH₄NO₃)',per:'NH₄NO₃',solid:80.0}};
L.calorimetry={title:'Calorimetry lab',cat:'Energetics',topic:'3.2.1',
desc:'Measure an enthalpy change in a polystyrene cup. Record the temperature every 30 s, mix at 3 minutes, then extrapolate the cooling line back to find the true temperature change and ΔH.',
icon:'<path d="M34 30h52l-8 76H42z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M60 8v64" stroke="currentColor" stroke-width="4"/><circle cx="60" cy="78" r="8" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let rx='neut', V=50, c=1.0, lid=true, t=0, running=false, data=[], T0=20+Math.random()*2, nextRec=0;
 LK.select(ct,{label:'Reaction',options:Object.entries(RXNS).map(([k,v])=>[k,v.n]),value:rx,on:v=>{rx=v;reset();}});
 const sv=LK.slider(ct,{label:'Volume of each solution',min:25,max:100,step:5,value:50,fmt:v=>v+' cm³',on:v=>{V=v;reset();}});
 const sc=LK.slider(ct,{label:'Concentration',min:0.5,max:2,step:0.1,value:1.0,fmt:v=>v.toFixed(1)+' mol dm⁻³',on:v=>{c=v;reset();}});
 LK.check(ct,'Lid on and cup insulated',true,v=>{lid=v;});
 const ct2=LK.ctrl(el);
 const bGo=LK.button(ct2,'Start the stopclock',()=>{ if(!running&&t>0) return; running=true; bGo.disabled=true; },'primary');
 LK.button(ct2,'Reset',()=>reset());
 const st=LK.stage(el,S,{ratio:0.38,maxH:260});
 const plot=LK.plot(el,S,{xlab:'time / min',ylab:'temperature / °C',ratio:0.45});
 const ro=LK.readout(el,[['T','temperature / °C'],['t','time / min'],['dT','ΔT (extrapolated)'],['q','q = mcΔT / J'],['n','moles'],['H','ΔH / kJ mol⁻¹']]);
 const lit=LK.el('<p class="muted" style="margin:6px 0 0;font-size:.9rem"></p>'); el.appendChild(lit);
 LK.note(el,'Readings are taken every 30 s. The reactants are mixed at <b>3.0 min</b>, so the reading at 3.0 min is missed. Heat is lost (or gained) all the time, so the highest reading is too small. Draw a line of best fit through the readings after mixing and <b>extrapolate it back to 3.0 min</b> to estimate ΔT if mixing had been instant. Then q = mcΔT, where m is the mass of the <b>solution</b> (1 cm³ ≈ 1 g) and c = 4.18 J g⁻¹ K⁻¹, and ΔH = −q ÷ n, in kJ mol⁻¹. A lid and insulation reduce heat loss, so the results are closer to the data-book value.');
 const R=()=>RXNS[rx];
 const mass=()=>R().two?2*V:V, nmol=()=>c*V/1000;
 const dTtrue=()=>-R().dH*1000*nmol()/(mass()*4.18);
 function reset(){ t=0; running=false; data=[]; nextRec=0; T0=20+Math.random()*2; bGo.disabled=false; lit.innerHTML=`Data-book value: ${R().lit}.`+(R().solid?` (Here ${(c*V/1000).toFixed(3)} mol of solid is dissolved in ${V} cm³ of water.)`:''); draw(); }
 const temp=tt=>{ const k=lid?0.018:0.07; if(tt<3) return T0; const d=tt-3; return T0+dTtrue()*(1-Math.exp(-d/0.35))*Math.exp(-k*d); };
 function analyse(){ const post=data.filter(p=>p[0]>=4.5); if(post.length<3) return null; const f=LK.fit(post); if(!f) return null; const Te=f.m*3+f.c; const dT=Te-T0; return {f,dT}; }
 function draw(){ const P=LK.P(), x=st.ctx, W=st.w, H=st.h; st.clear();
  const T=data.length?temp(t):T0;
  /* cup */
  const cx=W*0.25, cy=H*0.2, cw=W*0.18, ch=H*0.68;
  x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(cx-cw/2,cy); x.lineTo(cx+cw/2,cy); x.lineTo(cx+cw*0.38,cy+ch); x.lineTo(cx-cw*0.38,cy+ch); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=t>=3?'rgba(120,170,230,.55)':'rgba(120,170,230,.3)'; x.beginPath(); x.moveTo(cx-cw*0.46,cy+ch*0.3); x.lineTo(cx+cw*0.46,cy+ch*0.3); x.lineTo(cx+cw*0.38,cy+ch-2); x.lineTo(cx-cw*0.38,cy+ch-2); x.closePath(); x.fill();
  if(lid){ x.fillStyle=P.ink2; x.fillRect(cx-cw/2-4,cy-8,cw+8,8); }
  /* thermometer */
  x.strokeStyle=P.ink; x.lineWidth=6; x.beginPath(); x.moveTo(cx+4,cy-30); x.lineTo(cx+4,cy+ch*0.85); x.stroke(); x.fillStyle=P.bad; x.beginPath(); x.arc(cx+4,cy+ch*0.85,6,0,7); x.fill();
  /* big digital readout */
  const dx=W*0.48; LK.text(x,T.toFixed(1)+' °C',dx,H*0.42,P.brand,{size:34,weight:800});
  LK.text(x,'t = '+t.toFixed(2)+' min',dx,H*0.42+28,P.ink2,{size:14});
  LK.text(x,t<3?'Mixing at 3.0 min':running?'Recording every 30 s':'Finished',dx,H*0.42+52,P.muted,{size:12,mono:false});
  ro.set('T',T.toFixed(1)); ro.set('t',t.toFixed(1));
  const ser=[{pts:data,points:true,r:3,color:P.brand}];
  const A=analyse();
  if(A){ ser.push({pts:[[3,A.f.m*3+A.f.c],[Math.max(...data.map(p=>p[0])),A.f.m*Math.max(...data.map(p=>p[0]))+A.f.c]],color:P.accent,dash:[6,4],w:1.6},{pts:[[0,T0],[3,T0]],color:P.teal,w:1.6},{pts:[[3,T0],[3,A.f.m*3+A.f.c]],color:P.teal,w:2});
   const q=mass()*4.18*Math.abs(A.dT), n=nmol(), dH=(A.dT>0?-1:1)*q/1000/n;
   ro.set('dT',(A.dT>0?'+':'')+A.dT.toFixed(1)+' °C'); ro.set('q',Math.round(q)); ro.set('n',n.toFixed(4)); ro.set('H',(dH>0?'+':'')+dH.toFixed(1)); }
  else { ['dT','q','n','H'].forEach(k=>ro.set(k,'–')); }
  plot.set(ser,{xmin:0,xmax:10,ymin:Math.min(T0-2,T0+Math.min(0,dTtrue())-2),ymax:Math.max(T0+2,T0+Math.max(0,dTtrue())+2)});
 }
 S.loop(dt=>{ if(!running||dt<=0) return; t+=dt*0.25; while(nextRec<=t+1e-9&&nextRec<=10){ if(Math.abs(nextRec-3)>1e-6) data.push([nextRec,+(temp(nextRec)+LK.gauss()*0.05).toFixed(1)]); nextRec=+(nextRec+0.5).toFixed(2); } if(t>=10){ t=10; running=false; } draw(); });
 reset(); return ()=>S.dispose(); }};

/* ======================= RATES: BOLTZMANN + COLLISIONS ======================= */
/* energies in kJ mol⁻¹; Maxwell–Boltzmann energy distribution f(E) ∝ √E e^(−E/RT) */
const RkJ=8.314e-3;
/* schematic energy scale (as in textbook diagrams): kT is 20 units at 300 K, so the tail above Ea is visible */ const kTs=T=>20*T/300; const fracAbove=(Ea,T)=>{ const kT=kTs(T); let s=0,tot=0; const dE=kT/40; for(let E=dE/2;E<kT*40;E+=dE){ const f=Math.sqrt(E)*Math.exp(-E/kT); tot+=f; if(E>=Ea) s+=f; } return s/tot; };
L.boltzmann={title:'Rates: Boltzmann distribution and collisions',cat:'Rates & equilibrium',topic:'3.2.2',
desc:'Particles of A and B collide in a box and only react if the collision has at least the activation energy. Change temperature, concentration and add a catalyst, and see the Boltzmann distribution and the rate change together.',
icon:'<path d="M8 104C30 104 30 24 52 24S80 92 112 102" fill="none" stroke="currentColor" stroke-width="5"/><path d="M80 104V60" stroke="currentColor" stroke-width="4" stroke-dasharray="6 5"/><path d="M80 104C86 86 96 96 112 102V104Z" fill="currentColor" opacity=".45"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let T=300, Ea=60, cat=false, N=40;
 const sT=LK.slider(ct,{label:'Temperature',min:250,max:500,step:5,value:300,fmt:v=>v+' K',on:v=>{T=v;rescale();}});
 const sE=LK.slider(ct,{label:'Activation energy Ea',min:20,max:100,step:1,value:60,fmt:v=>v+' units'});
 const sN=LK.slider(ct,{label:'Concentration (particles of each)',min:10,max:60,step:2,value:40,fmt:v=>String(v),on:v=>{N=v;restart();}});
 const cC=LK.check(ct,'Add a catalyst (Ea lowered by 40%)',false,v=>{cat=v;});
 LK.button(LK.ctrl(el),'Restart the reaction',()=>restart(),'primary');
 const box=LK.stage(el,S,{ratio:0.42,maxH:280});
 const dist=LK.plot(el,S,{xlab:'energy (schematic units)',ylab:'number of molecules',ratio:0.4});
 const prog=LK.plot(el,S,{xlab:'time / s',ylab:'product formed',ratio:0.32});
 const ro=LK.readout(el,[['f','fraction with E ≥ Ea'],['rel','rate compared with 300 K, no catalyst'],['ea','Ea in use / kJ mol⁻¹'],['p','product particles']]);
 LK.note(el,'For a reaction to happen, particles must <b>collide</b> with the right orientation and with at least the <b>activation energy</b>, E<sub>a</sub>. Raising the temperature moves the Boltzmann curve to the right and flattens it (the area, the total number of molecules, stays the same), so a much bigger proportion of molecules have E ≥ E<sub>a</sub>. For a typical real reaction a 10 K rise near room temperature roughly doubles the rate. (The energy axis here is simplified so the tail of the curve is visible.) A catalyst does not change the curve: it gives a route with a lower E<sub>a</sub>, moving the E<sub>a</sub> line to the left. Higher concentration means more frequent collisions, but the same fraction succeed.');
 let parts=[], prod=0, tt=0, hist=[], flashes=[];
 const Eon=()=>cat?Ea*0.6:Ea;
 function restart(){ parts=[]; prod=0; tt=0; hist=[[0,0]]; const s=Math.sqrt(T/300); for(let i=0;i<2*N;i++){ const a=Math.random()*6.283; const sp=(40+Math.random()*50)*s; parts.push({x:Math.random(),y:Math.random(),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,k:i%2?'B':'A'}); } }
 function rescale(){ /* keep particles but adjust speeds to the new temperature */ const avg=parts.reduce((a,p)=>a+p.vx*p.vx+p.vy*p.vy,0)/(parts.length||1); const want=Math.pow(65*Math.sqrt(T/300),2); const f=avg?Math.sqrt(want/avg):1; parts.forEach(p=>{p.vx*=f;p.vy*=f;}); }
 S.loop(dt=>{ Ea=sE.v; const P=LK.P(), x=box.ctx, W=box.w, H=box.h; box.clear(); LK.grid(x,W,H,24);
  const R=8, sc=Math.min(W,H);
  if(dt>0){ tt+=dt;
   parts.forEach(p=>{ p.x+=p.vx*dt/W; p.y+=p.vy*dt/H; if(p.x<0){p.x=0;p.vx=Math.abs(p.vx);} if(p.x>1){p.x=1;p.vx=-Math.abs(p.vx);} if(p.y<0){p.y=0;p.vy=Math.abs(p.vy);} if(p.y>1){p.y=1;p.vy=-Math.abs(p.vy);} });
   for(let i=0;i<parts.length;i++){ const a=parts[i]; if(a.k==='P') continue; for(let j=i+1;j<parts.length;j++){ const b=parts[j]; if(b.k==='P') continue; const dx=(a.x-b.x)*W, dy=(a.y-b.y)*H, d=Math.hypot(dx,dy); if(d<2*R&&d>0){
      const nx=dx/d, ny=dy/d, rv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny; if(rv>=0) continue;
      if(a.k!==b.k){ /* a collision between A and B: does it have enough energy? energy ∝ (relative speed)², scaled so the success fraction matches the Boltzmann curve */
        if(Math.random()<Math.min(1,0.06*fracAbove(Eon(),T)/fracAbove(60,300))){ a.k='P'; b.k='X'; prod++; flashes.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,t:0.5}); continue; } }
      a.vx-=rv*nx; a.vy-=rv*ny; b.vx+=rv*nx; b.vy+=rv*ny; const ov=(2*R-d)/2; a.x+=nx*ov/W; a.y+=ny*ov/H; b.x-=nx*ov/W; b.y-=ny*ov/H; } } }
   parts=parts.filter(p=>p.k!=='X');
   if(!hist.length||tt-hist[hist.length-1][0]>0.25) hist.push([+tt.toFixed(2),prod]);
  }
  parts.forEach(p=>{ x.beginPath(); x.arc(p.x*W,p.y*H,p.k==='P'?R*1.25:R,0,7); x.fillStyle=p.k==='A'?P.brand:p.k==='B'?P.teal:P.accent; x.fill(); x.strokeStyle=P.ink; x.lineWidth=1; x.stroke(); });
  flashes.forEach(f=>{ f.t-=dt; x.beginPath(); x.arc(f.x*W,f.y*H,(0.6-f.t)*40,0,7); x.strokeStyle=P.warn; x.lineWidth=2; x.globalAlpha=Math.max(0,f.t*2); x.stroke(); x.globalAlpha=1; }); flashes=flashes.filter(f=>f.t>0);
  LK.text(x,'● A   ● B   ● product (successful collision)',10,H-10,P.ink2,{size:11,mono:false});
  /* distribution */
  const curve=TT=>{ const kT=kTs(TT), out=[]; for(let E=0;E<=140;E+=1){ out.push([E,Math.sqrt(E)*Math.exp(-E/kT)/Math.pow(kT,1.5)*400]); } return out; };
  const cur=curve(T), ref=curve(300), e=Eon(), shade=cur.filter(p=>p[0]>=e);
  const ser=[{pts:ref,color:P.muted,dash:[5,4],w:1.4,name:'300 K'},{pts:cur,color:P.brand,w:2.4,name:T+' K'}];
  shade.forEach(p=>ser.push({pts:[[p[0],0],[p[0],p[1]]],color:P.brand,w:1}));
  const ymax=Math.max(...cur.map(p=>p[1]),...ref.map(p=>p[1]))*1.1;
  ser.push({pts:[[e,0],[e,ymax]],color:P.accent,w:2,dash:[6,4],name:'Ea'+(cat?' (catalysed)':'')}); if(cat) ser.push({pts:[[Ea,0],[Ea,ymax]],color:P.muted,w:1.4,dash:[3,4]});
  dist.set(ser,{xmin:0,xmax:140,ymin:0,ymax,legend:true});
  prog.set([{pts:hist,color:P.accent}],{xmin:0,ymin:0,ymax:Math.max(4,N)});
  const fr=fracAbove(e,T), f0=fracAbove(Ea,300);
  ro.set('f',LK.sig(fr,3)); ro.set('rel','× '+LK.sig(fr/f0,3)); ro.set('ea',e.toFixed(0)); ro.set('p',prod+' / '+N);
 });
 el.lkPreset=o=>{}; restart(); return ()=>S.dispose(); }};

/* ======================= EQUILIBRIUM ======================= */
const SYSTEMS={
 no2:{n:'N₂O₄(g) ⇌ 2NO₂(g) (ΔH = +58 kJ mol⁻¹)',sp:['N₂O₄','NO₂'],nu:[-1,2],K298:4.6e-3,dH:58,gas:true,col:(c)=>`rgba(150,70,20,${clamp(c[1]*14,0,0.9)})`,start:[0.10,0.0],
   note:'Brown NO₂ and colourless N₂O₄. Forward reaction is endothermic, so heating shifts the equilibrium right (browner) and K<sub>c</sub> increases. Squashing the gas into a smaller volume increases the pressure: the equilibrium shifts left, to fewer moles of gas, although the colour first darkens because everything is more concentrated.'},
 co:{n:'[Co(H₂O)₆]²⁺(pink) + 4Cl⁻ ⇌ [CoCl₄]²⁻(blue) + 6H₂O (ΔH > 0)',sp:['[Co(H₂O)₆]²⁺','Cl⁻','[CoCl₄]²⁻'],nu:[-1,-4,1],K298:0.06,dH:50,col:(c)=>{ const f=c[2]/(c[0]+c[2]+1e-9); return mix('rgb(232,120,170)','rgb(40,70,200)',f); },start:[0.10,1.0,0],
   note:'Pink [Co(H₂O)₆]²⁺ and blue [CoCl₄]²⁻. Adding concentrated HCl adds Cl⁻, so the equilibrium shifts right (bluer). Adding water dilutes everything; with four Cl⁻ on the left, dilution shifts it back left (pinker). The forward reaction is endothermic, so heating turns it blue. (K values here are illustrative.)'},
 ester:{n:'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (ΔH ≈ 0)',sp:['CH₃COOH','C₂H₅OH','ester','H₂O'],nu:[-1,-1,1,1],K298:4.0,dH:-2,col:()=> 'rgba(200,200,210,.35)',start:[1.0,1.0,0,0],
   note:'K<sub>c</sub> ≈ 4 and barely changes with temperature (ΔH is almost zero). Adding more ethanol shifts the equilibrium right and increases the yield of ester; removing water would too. A catalyst (H₂SO₄) only makes equilibrium arrive sooner.'}};
L.equilibrium={title:'Equilibrium and Le Chatelier',cat:'Rates & equilibrium',topic:'3.2.3',
desc:'Disturb an equilibrium by changing concentration, pressure or temperature, then watch the concentrations, the colour and the reaction quotient settle back to K.',
icon:'<path d="M14 46h80l-14-12M106 74H26l14 12" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 let sys='no2', conc=[], T=298, V=1, catal=false, hist=[], tt=0, msg='';
 LK.select(ct,{label:'Equilibrium',options:Object.entries(SYSTEMS).map(([k,v])=>[k,v.n]),value:sys,on:v=>{sys=v;reset();}});
 const sT=LK.slider(ct,{label:'Temperature',min:273,max:373,step:1,value:298,fmt:v=>v+' K',on:v=>{T=v; msg='Temperature changed: K itself changes.';}});
 const sV=LK.slider(ct,{label:'Volume (gas systems)',min:0.5,max:2,step:0.1,value:1,fmt:v=>v.toFixed(1)+' dm³',on:v=>{ if(!Y().gas){ return; } const f=V/v; conc=conc.map(c=>c*f); V=v; msg=f>1?'Volume decreased: pressure up, everything more concentrated.':'Volume increased: pressure down.'; }});
 LK.check(ct,'Catalyst (faster, same position)',false,v=>{catal=v;});
 const ct2=LK.ctrl(el); const bb=LK.el('<div style="display:flex;flex-wrap:wrap;gap:8px"></div>'); ct2.appendChild(bb);
 const st=LK.stage(el,S,{ratio:0.4,maxH:260});
 const plot=LK.plot(el,S,{xlab:'time / s',ylab:'concentration / mol dm⁻³',ratio:0.42});
 const ro=LK.readout(el,[['K','Kc at this temperature'],['Q','Qc right now'],['dir','what happens next']]);
 const nt=LK.note(el,'');
 const Y=()=>SYSTEMS[sys];
 const K=()=>Y().K298*Math.exp(-Y().dH*1000/8.314*(1/T-1/298));
 const Q=c=>{ let num=1,den=1; Y().nu.forEach((n,i)=>{ if(Y().sp[i]==='H₂O'&&!Y().sp.includes('ester')) return; const v=Math.max(c[i],1e-12); if(n>0) num*=Math.pow(v,n); else den*=Math.pow(v,-n); }); return num/den; };
 function eqExtent(c){ /* extent ξ (mol dm⁻³) that makes Q = K */ const nu=Y().nu; let lo=-Infinity, hi=Infinity; nu.forEach((n,i)=>{ if(Y().sp[i]==='H₂O'&&!Y().sp.includes('ester')) return; const lim=-c[i]/n; if(n<0) hi=Math.min(hi,lim); else lo=Math.max(lo,lim); }); lo+=1e-12; hi-=1e-12; const k=K();
   for(let i=0;i<80;i++){ const m=(lo+hi)/2; const cc=c.map((v,j)=>v+nu[j]*m); if(Math.log(Q(cc))>Math.log(k)) hi=m; else lo=m; } return (lo+hi)/2; }
 function buttons(){ bb.innerHTML=''; Y().sp.forEach((s,i)=>{ if(s==='H₂O'&&sys==='co') return; LK.button(bb,'Add '+s,()=>{ conc[i]+=sys==='co'&&s==='Cl⁻'?2:Y().start[0]*0.5+0.05; msg='Added '+s+'.'; }); });
   if(sys==='co') LK.button(bb,'Add water (dilute)',()=>{ conc=conc.map(c=>c/2); msg='Diluted to half the concentration.'; });
   if(sys==='ester') LK.button(bb,'Remove water',()=>{ conc[3]=conc[3]*0.2; msg='Water removed.'; }); }
 function reset(){ conc=Y().start.slice(); T=298; sT.set(298); V=1; sV.set(1); hist=[]; tt=0; msg=''; buttons(); nt.innerHTML=Y().note; }
 S.loop(dt=>{ const P=LK.P(), x=st.ctx, W=st.w, H=st.h; st.clear(); LK.grid(x,W,H,24);
  if(dt>0){ tt+=dt; const xi=eqExtent(conc); const rate=(catal?3:0.8)*Math.exp(-(40000/8.314)*(1/T-1/298)); const f=1-Math.exp(-rate*dt); conc=conc.map((v,j)=>Math.max(0,v+Y().nu[j]*xi*f));
   if(!hist.length||tt-hist[hist.length-1][0]>0.1){ hist.push([+tt.toFixed(1),...conc]); if(hist.length>600) hist.shift(); } }
  /* vessel */
  const vx=W*0.06, vy=H*0.12, vw=W*0.38*(Y().gas?V/1.4+0.3:1), vh=H*0.76;
  x.fillStyle=Y().col(conc); x.fillRect(vx,vy,vw,vh); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(vx,vy,vw,vh);
  if(Y().gas){ x.fillStyle=P.ink2; x.fillRect(vx+vw,vy-6,8,vh+12); LK.text(x,'piston',vx+vw+12,vy+12,P.muted,{size:11,mono:false}); }
  LK.text(x,Y().n,W*0.5,24,P.ink,{size:12,mono:false,weight:600});
  Y().sp.forEach((s,i)=>{ if(s==='H₂O'&&sys==='co') return; const y=60+i*26; LK.text(x,s,W*0.52,y,P.ink2,{size:12}); const bw=Math.min(W*0.3,conc[i]*W*(sys==='no2'?1.6:sys==='co'?0.05:0.12)); x.fillStyle=[P.brand,P.teal,P.accent,P.warn][i]; x.fillRect(W*0.52+110,y-11,bw,12); LK.text(x,conc[i].toFixed(3),W*0.52+116+bw,y,P.muted,{size:11}); });
  if(msg) LK.text(x,msg,W*0.52,H-16,P.brand,{size:12,mono:false,weight:600});
  const k=K(), q=Q(conc); ro.set('K',LK.sig(k,3)); ro.set('Q',LK.sig(q,3)); ro.set('dir',Math.abs(Math.log(q/k))<0.03?'at equilibrium':q<k?'shifts right →':'← shifts left');
  const cols=[P.brand,P.teal,P.accent,P.warn]; plot.set(Y().sp.map((s,i)=>({pts:hist.map(r=>[r[0],r[i+1]]),color:cols[i],name:s})).filter(s=>!(s.name==='H₂O'&&sys==='co')),{xmin:Math.max(0,tt-40),ymin:0,legend:true});
 });
 el.lkPreset=o=>{}; reset(); return ()=>S.dispose(); }};
})();
