/* Thermal, nuclear, medical and astrophysics labs + data grapher */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const kB=1.38e-23, h=6.63e-34, c=3e8, sig=5.67e-8;

/* ---------- Gas box ---------- */
L.gas={title:'Ideal gas in a box',cat:'Thermal',topic:'5.1',desc:'Kinetic theory live: heat the gas, squash the piston, add molecules. Check pV = NkT and watch the speed distribution.',
icon:'<rect x="15" y="25" width="90" height="80" fill="none" stroke="currentColor" stroke-width="5"/><path d="M15 45 H105" stroke="currentColor" stroke-width="7"/><circle cx="40" cy="70" r="5" fill="currentColor"/><circle cx="70" cy="85" r="5" fill="currentColor"/><circle cx="85" cy="62" r="5" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const T=LK.slider(ct,{label:'Temperature',min:50,max:900,step:10,value:300,fmt:v=>v+' K'}), Vs=LK.slider(ct,{label:'Volume',min:0.3,max:1,step:0.01,value:1,fmt:v=>(v*10).toFixed(1)+' L'}), N=LK.slider(ct,{label:'Molecules shown',min:20,max:200,step:10,value:100,on:()=>init()});
 const st=LK.stage(el,S,{ratio:0.45});
 const ro=LK.readout(el,[['p','pressure (from collisions)'],['pv','pV/NkT'],['crms','c_rms = √(3kT/m)'],['ke','mean KE = 3/2 kT']]);
 const pl=LK.plot(el,S,{xlab:'speed / m s⁻¹',ylab:'number of molecules',ratio:0.3});
 LK.note(el,'Each wall collision changes a molecule’s momentum by 2mu; pressure is the total rate of change of momentum per unit area. Halve the volume at constant T and collisions with the walls are twice as frequent, so pressure doubles (Boyle). Raise T and molecules move faster: more frequent and harder collisions. Molecules are nitrogen (m = 4.65 × 10⁻²⁶ kg); 1 shown molecule represents 10²⁰.');
 const m=4.65e-26; const scaleN=1e20; let mol=[], imp=0, tAcc=0, pMeas=0;
 const init=()=>{ mol=Array.from({length:N.v},()=>{ const s=Math.sqrt(kB*T.v/m); return {x:Math.random(),y:Math.random(),vx:LK.gauss()*s,vy:LK.gauss()*s,vz:LK.gauss()*s}; }); }; init();
 let lastT=T.v;
 S.loop(dt=>{ if(T.v!==lastT){ const f=Math.sqrt(T.v/lastT); mol.forEach(p=>{p.vx*=f;p.vy*=f;p.vz*=f;}); lastT=T.v; }
   const P=LK.P(),x=st.ctx; st.clear(); const W=st.w*0.62, H=st.h-20, ox=10, oy=10; const boxW=W*Vs.v; const sim=2.5e-4; // seconds of sim time per real s
   const Lx=0.1*Vs.v, Ly=0.1, Lz=0.1; // box dims (m)
   mol.forEach(p=>{ p.x+=p.vx*dt*sim/Lx; p.y+=p.vy*dt*sim/Ly; if(p.x>1){ p.x=2-p.x; p.vx=-Math.abs(p.vx); imp+=2*m*Math.abs(p.vx)*scaleN; } if(p.x<0){p.x=-p.x;p.vx=Math.abs(p.vx);} if(p.y>1){p.y=2-p.y;p.vy=-p.vy;} if(p.y<0){p.y=-p.y;p.vy=-p.vy;} });
   tAcc+=dt*sim; if(tAcc>2.5e-4){ { const pw=imp/tAcc/(Ly*Lz); pMeas=pMeas?pMeas*0.6+0.4*pw:pw; } imp=0; tAcc=0; }
   x.strokeStyle=P.ink2; x.lineWidth=3; x.strokeRect(ox,oy,W,H); x.fillStyle=P.ink2; x.fillRect(ox+boxW-4,oy,10,H); x.fillRect(ox+boxW+6,oy+H/2-5,W-boxW,10);
   const vmax=Math.sqrt(3*kB*900/m)*1.6; mol.forEach(p=>{ const sp=Math.hypot(p.vx,p.vy,p.vz); const t=Math.min(1,sp/vmax); x.fillStyle=t>0.45?P.brand:t>0.25?P.accent:P.teal; x.beginPath(); x.arc(ox+p.x*(boxW-6)+3,oy+p.y*(H-6)+3,3.5,0,7); x.fill(); });
   const V=Lx*Ly*Lz, Ntot=N.v*scaleN, pTheory=Ntot*kB*T.v/V;
   LK.text(x,'p (theory) = '+LK.sig(pTheory,3)+' Pa',st.w*0.66,30,P.ink2,{size:12}); LK.text(x,'V = '+LK.sig(V,3)+' m³',st.w*0.66,50,P.ink2,{size:12}); LK.text(x,'N = '+LK.sig(Ntot,3),st.w*0.66,70,P.ink2,{size:12});
   ro.set('p',LK.sig(pMeas,3)+' Pa'); ro.set('pv',LK.fx(pMeas*V/(Ntot*kB*T.v),2)); ro.set('crms',LK.sig(Math.sqrt(3*kB*T.v/m),3)+' m/s'); ro.set('ke',LK.sig(1.5*kB*T.v,3)+' J');
   if(Math.floor(performance.now()/300)%2===0){ const bins=new Array(20).fill(0), bw=2000/20; mol.forEach(p=>{ const sp=Math.hypot(p.vx,p.vy,p.vz); const i=Math.min(19,Math.floor(sp/bw)); bins[i]++; }); const mb=v=>N.v*bw*4*Math.PI*Math.pow(m/(2*Math.PI*kB*T.v),1.5)*v*v*Math.exp(-m*v*v/(2*kB*T.v));
     pl.set([{pts:bins.map((n,i)=>[(i+0.5)*bw,n]),points:true,color:P.brand},{pts:Array.from({length:100},(_,i)=>[i*20,mb(i*20)]),color:P.ink2,dash:[4,4]}],{xmin:0,xmax:2000,ymin:0}); }
 });
 return ()=>S.dispose(); }};

/* ---------- Heating curve ---------- */
L.heating={title:'Heating curve and latent heat',cat:'Thermal',topic:'5.1',desc:'Heat ice from −20 °C to steam at constant power. Read specific heat capacities and latent heats from the graph.',
icon:'<path d="M10 100 L35 75 H60 L80 40 H105" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const m=LK.slider(ct,{label:'Mass of ice',min:0.1,max:1,step:0.05,value:0.2,fmt:v=>v.toFixed(2)+' kg',on:()=>reset()}), Pw=LK.slider(ct,{label:'Heater power',min:500,max:3000,step:100,value:2000,fmt:v=>v+' W'});
 const run=LK.button(ct,'Start / pause',()=>{on=!on;},'primary'); LK.button(ct,'Reset',()=>reset());
 const st=LK.stage(el,S,{ratio:0.24,minH:120});
 const ro=LK.readout(el,[['T','temperature'],['E','energy supplied'],['st','state'],['stage','what the energy does']]);
 const pl=LK.plot(el,S,{xlab:'energy supplied / kJ',ylab:'temperature / °C',ratio:0.42});
 LK.note(el,'Sloping sections: E = mcΔθ (c_ice = 2100, c_water = 4200, c_steam = 2000 J kg⁻¹ K⁻¹), kinetic energy of molecules rising. Flat sections: E = mL (L_f = 3.34 × 10⁵, L_v = 2.26 × 10⁶ J kg⁻¹), potential energy rising as bonds break while temperature is constant. Boiling takes far longer than melting.');
 let E,data,on; const reset=()=>{ E=0; data=[[0,-20]]; on=false; }; reset();
 const TofE=(E,mm)=>{ const a=mm*2100*20, b=a+mm*3.34e5, cc=b+mm*4200*100, d=cc+mm*2.26e6; if(E<a) return [-20+E/(mm*2100),'ice','heating the solid']; if(E<b) return [0,'ice + water','melting (latent heat of fusion)']; if(E<cc) return [(E-b)/(mm*4200),'water','heating the liquid']; if(E<d) return [100,'water + steam','boiling (latent heat of vaporisation)']; return [Math.min(160,100+(E-d)/(mm*2000)),'steam','heating the gas']; };
 S.loop(dt=>{ if(on){ E+=Pw.v*dt*20; const T=TofE(E,m.v)[0]; data.push([E/1000,T]); if(T>=160) on=false; }
   const [T,state,what]=TofE(E,m.v); const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(W*0.3,10,W*0.3,H-20);
   const frac=state==='ice'?1:state==='ice + water'?1-(E-m.v*2100*20)/(m.v*3.34e5):0; x.fillStyle=P.tealSoft; x.fillRect(W*0.3+2,H*0.35,W*0.3-4,H*0.65-12); x.fillStyle=P.surface; for(let i=0;i<Math.round(frac*8);i++){ x.fillRect(W*0.32+i*W*0.033,H*0.45,W*0.025,W*0.025); }
   if(state.includes('steam')){ for(let i=0;i<8;i++){ x.fillStyle=P.line2; x.beginPath(); x.arc(W*0.33+Math.random()*W*0.24,H*0.15+Math.random()*H*0.2,3,0,7); x.fill(); } }
   x.fillStyle=on?P.accent:P.line2; x.fillRect(W*0.3,H-10,W*0.3,8); LK.text(x,LK.fx(T,1)+' °C',W*0.72,H/2,P.brand,{weight:700,size:18});
   ro.set('T',LK.fx(T,1)+' °C'); ro.set('E',LK.sig(E/1000,4)+' kJ'); ro.set('st',state); ro.set('stage',what);
   pl.set([{pts:data,color:P.brand}],{ymin:-25,ymax:165});
 });
 return ()=>S.dispose(); }};

/* ---------- Radioactive decay ---------- */
L.decay={title:'Radioactive decay and half-life',cat:'Nuclear',topic:'6.4',desc:'Watch a grid of nuclei decay at random. Plot N against t and ln N against t, and use dice for the classic model.',
icon:'<path d="M10 15 C30 70 60 95 110 100" fill="none" stroke="currentColor" stroke-width="5"/><path d="M10 10 V105 H115" fill="none" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const half=LK.slider(ct,{label:'Half-life',min:1,max:20,step:0.5,value:5,fmt:v=>v+' s',on:()=>reset()});
 const n0=LK.select(ct,{label:'Starting nuclei',value:'400',options:[['100','100'],['400','400'],['1600','1600']],on:()=>reset()});
 const yax=LK.select(ct,{label:'Plot',value:'N',options:[['N','N against t'],['ln','ln N against t']]});
 const dice=LK.check(ct,'Dice model (each throw = 1 s; a six decays)',false,()=>reset());
 LK.button(ct,'Restart',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.42});
 const ro=LK.readout(el,[['N','undecayed N'],['A','activity A = λN'],['lam','decay constant λ'],['th','half-life from ln N fit']]);
 const pl=LK.plot(el,S,{xlab:'t / s',ylab:'',ratio:0.36});
 LK.note(el,'Each nucleus has the same constant probability of decaying per second (λ). You cannot predict which nucleus decays next, but large numbers follow N = N₀e^(−λt). ln N against t is a straight line of gradient −λ; t½ = ln 2/λ. With dice, λ = 1/6 per throw so t½ ≈ 4.2 throws.');
 let nuc,t,data,acc; const reset=()=>{ nuc=new Array(+n0.value).fill(1); t=0; data=[[0,+n0.value]]; acc=0; }; reset();
 S.loop(dt=>{ const lam=dice.checked?1/6:Math.LN2/half.v; acc+=dt; const step=dice.checked?1:0.1;
   while(acc>=step*(dice.checked?0.6:1)){ acc-=step*(dice.checked?0.6:1); if(t>60) break; const p=dice.checked?1/6:1-Math.exp(-lam*step); for(let i=0;i<nuc.length;i++) if(nuc[i]===1&&Math.random()<p) nuc[i]=2; t+=step; const Nn=nuc.filter(v=>v===1).length; data.push([t,Nn]); nuc=nuc.map(v=>v===2?0:v).map((v,i)=>v); }
   const P=LK.P(),x=st.ctx; st.clear(); const n=nuc.length, cols=Math.ceil(Math.sqrt(n*st.w/st.h)), rows=Math.ceil(n/cols); const cw=st.w/cols, chh=st.h/rows; const r=Math.max(1.5,Math.min(cw,chh)*0.35);
   for(let i=0;i<n;i++){ const cx=(i%cols+0.5)*cw, cy=(Math.floor(i/cols)+0.5)*chh; x.fillStyle=nuc[i]===1?P.brand:P.line2; x.beginPath(); x.arc(cx,cy,r,0,7); x.fill(); }
   const Nn=data[data.length-1][1]; const fit=LK.fit(data.filter(d=>d[1]>5).map(d=>[d[0],Math.log(d[1])]));
   ro.set('N',String(Nn)); ro.set('A',LK.sig(lam*Nn,3)+(dice.checked?' per throw':' Bq')); ro.set('lam',LK.sig(lam,3)+(dice.checked?' per throw':' s⁻¹')); ro.set('th',fit&&data.length>4?LK.fx(Math.LN2/-fit.m,2)+(dice.checked?' throws':' s'):'–');
   const ln=yax.value==='ln'; pl.set([{pts:data.filter(d=>!ln||d[1]>0).map(d=>[d[0],ln?Math.log(d[1]):d[1]]),points:dice.checked,color:P.brand},{pts:Array.from({length:61},(_,i)=>[i,ln?Math.log(+n0.value)-lam*i:+n0.value*Math.exp(-lam*i)]),color:P.ink2,dash:[4,4]}],{ylab:ln?'ln N':'N',xmin:0,xmax:Math.max(10,Math.min(60,t+2)),ymin:ln?0:0});
 });
 return ()=>S.dispose(); }};

/* ---------- Absorption ---------- */
L.absorb={title:'Absorbing α, β and γ',cat:'Nuclear',topic:'6.4',desc:'Count radiation through paper, aluminium or lead of any thickness, and test the inverse square law for gamma.',
icon:'<circle cx="20" cy="60" r="10" fill="currentColor"/><path d="M50 20 V100" stroke="currentColor" stroke-width="5"/><path d="M75 20 V100" stroke="currentColor" stroke-width="10"/><path d="M30 60 H110" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const src=LK.select(ct,{label:'Source',value:'b',options:[['a','Alpha (Am-241)'],['b','Beta (Sr-90)'],['g','Gamma (Co-60)']]});
 const mat=LK.select(ct,{label:'Absorber',value:'al',options:[['none','None'],['paper','Paper'],['al','Aluminium'],['pb','Lead']]});
 const th=LK.slider(ct,{label:'Thickness',min:0,max:20,step:0.5,value:2,fmt:v=>v+' mm'}), d=LK.slider(ct,{label:'Source–detector distance',min:2,max:50,step:1,value:10,fmt:v=>v+' cm'});
 const b=LK.ctrl(el); LK.button(b,'Count for 60 s',()=>{ const C=count(); pts.push([mode(),C/60]); draw(); },'primary'); LK.button(b,'Clear graph',()=>{pts=[];draw();});
 const xax=LK.select(b,{label:'Graph x-axis',value:'th',options:[['th','thickness'],['d','1/d²']],on:()=>{pts=[];draw();}});
 const st=LK.stage(el,S,{ratio:0.3,minH:160});
 const ro=LK.readout(el,[['rate','count rate (corrected)'],['bg','background ≈ 0.4 /s']]);
 const pl=LK.plot(el,S,{xlab:'',ylab:'count rate / s⁻¹',ratio:0.36});
 LK.note(el,'Always measure the background count and subtract it. Alpha: a few cm in air, stopped by paper. Beta: about a metre of air, stopped by a few mm of aluminium. Gamma: intensity falls off as 1/d² in air and roughly exponentially with lead thickness (never quite zero). Handle sources with tongs, keep them at arm’s length and minimise exposure time.');
 const mode=()=>xax.value==='th'?th.v:1/((d.v/100)**2);
 const rate=()=>{ const s=src.value, D=d.v/100; let R=s==='a'?3000:s==='b'?800:400; R*=0.0004/(D*D); if(s==='a'&&d.v>5) R*=Math.max(0,1-(d.v-5)/1); const t=mat.value==='none'?0:th.v; const mu={a:{paper:20,al:50,pb:80},b:{paper:0.05,al:1.4,pb:4},g:{paper:0.0005,al:0.015,pb:0.11}}[s][mat.value]||0; R*=Math.exp(-mu*t); return R; };
 const count=()=>{ const lam=(rate()+0.4)*60; let n=Math.round(lam+Math.sqrt(lam)*LK.gauss()); return Math.max(0,n-24); };
 let pts=[]; const draw=()=>{ const P=LK.P(); pl.set([{pts,points:true,color:P.brand}],{xlab:xax.value==='th'?'thickness / mm':'1/d² / m⁻²',ymin:0,xmin:0}); }; draw();
 let clicks=[]; S.loop(dt=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h,cy=H/2; const R=rate();
   x.fillStyle=P.brand; x.beginPath(); x.arc(30,cy,12,0,7); x.fill(); const dx=30+(W-130)*(d.v/50);
   if(mat.value!=='none'){ const tw=Math.max(2,th.v*3); x.fillStyle=mat.value==='pb'?P.ink2:mat.value==='al'?P.line2:P.accentSoft; x.fillRect(30+(dx-30)*0.5-tw/2,cy-50,tw,100); }
   x.fillStyle=P.deep; x.fillRect(dx,cy-16,70,32); LK.text(x,'GM tube',dx+35,cy+30,P.muted,{align:'center',size:11});
   if(Math.random()<(R+0.4)*dt*0.4) clicks.push(1); if(clicks.length){ x.fillStyle=P.accent; x.beginPath(); x.arc(dx+60,cy,6,0,7); x.fill(); clicks=[]; }
   ro.set('rate',LK.sig(R,3)+' /s'); ro.set('bg','0.4 /s');
 });
 return ()=>S.dispose(); }};

/* ---------- Binding energy curve ---------- */
const BE=[[1,0],[2,1.11],[3,2.83],[4,7.07],[6,5.33],[7,5.61],[9,6.46],[12,7.68],[14,7.48],[16,7.98],[20,8.03],[24,8.26],[28,8.45],[32,8.49],[40,8.55],[56,8.79],[62,8.79],[80,8.71],[100,8.6],[120,8.51],[140,8.38],[160,8.26],[180,8.1],[200,7.92],[235,7.59],[238,7.57]];
L.binding={title:'Binding energy per nucleon',cat:'Nuclear',topic:'6.4',desc:'Explore the binding energy curve. Pick nuclei for fusion or fission and calculate the energy released.',
icon:'<path d="M10 100 L20 50 C35 25 60 20 110 35" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const rx=LK.select(ct,{label:'Reaction',value:'fis',options:[['fis','Fission: U-235 + n → Ba-141 + Kr-92 + 3n'],['fus','Fusion: H-2 + H-3 → He-4 + n'],['fus2','Fusion: 4 ¹H → He-4 (Sun)']]});
 const ro=LK.readout(el,[['bef','BE before'],['aft','BE after'],['Q','energy released']]);
 const pl=LK.plot(el,S,{xlab:'nucleon number A',ylab:'BE per nucleon / MeV',ratio:0.5});
 LK.note(el,'Binding energy is the energy needed to separate a nucleus into its nucleons (= mass defect × c²). Nuclei near iron-56 are the most stable. Energy is released when the products have a greater total binding energy than the reactants: fusing light nuclei or splitting heavy nuclei moves towards the peak.');
 const draw=()=>{ const P=LK.P(); let pts=[],Q=0,bf=0,af=0; if(rx.value==='fis'){ pts=[[235,7.59],[141,8.37],[92,8.66]]; bf=235*7.59; af=141*8.37+92*8.66; } else if(rx.value==='fus'){ pts=[[2,1.11],[3,2.83],[4,7.07]]; bf=2*1.11+3*2.83; af=4*7.07; } else { pts=[[1,0],[4,7.07]]; bf=0; af=4*7.07; }
   Q=af-bf; pl.set([{pts:BE,color:P.brand},{pts,points:true,color:P.accent,r:6}],{xmin:0,xmax:240,ymin:0,ymax:9.5}); ro.set('bef',LK.fx(bf,1)+' MeV'); ro.set('aft',LK.fx(af,1)+' MeV'); ro.set('Q',LK.fx(Q,1)+' MeV'+(rx.value==='fus2'?' (≈ 26.7 MeV incl. positrons)':'')); };
 rx.addEventListener('change',draw); draw(); S.add(()=>{});
 return ()=>S.dispose(); }};

/* ---------- Rutherford scattering ---------- */
L.rutherford={title:'Alpha-particle scattering',cat:'Nuclear',topic:'6.4',desc:'Fire alpha particles at a gold nucleus. Most go straight through; a few bounce back. Count deflections.',
icon:'<circle cx="80" cy="60" r="8" fill="currentColor"/><path d="M5 60 H110 M5 50 C50 50 70 30 110 10 M5 70 C50 70 70 90 110 110 M5 58 C60 58 75 50 30 40" fill="none" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const E=LK.slider(ct,{label:'Alpha energy',min:2,max:10,step:0.5,value:5,fmt:v=>v+' MeV'}); const rate=LK.slider(ct,{label:'Beam rate',min:1,max:20,step:1,value:8});
 LK.button(ct,'Reset counts',()=>{ counts=[0,0,0]; trails=[]; },'primary');
 const st=LK.stage(el,S,{ratio:0.5});
 const ro=LK.readout(el,[['s','straight through (< 10°)'],['d','deflected 10°–90°'],['b','back-scattered (> 90°)']]);
 LK.note(el,'Most alpha particles pass straight through: the atom is mostly empty space. Some are deflected: the nucleus is charged. A very small number come back (> 90°): almost all the mass and positive charge are in a tiny nucleus. Higher-energy alphas get closer before turning round.');
 let ps=[], trails=[], counts=[0,0,0]; const k=2*79*1.44; // MeV fm
 S.loop(dt=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h,cx=W*0.55,cy=H/2, sc=H/400; // fm per px
   if(Math.random()<rate.v*dt){ const b=(Math.random()-0.5)*2*180; ps.push({x:-300,y:b,vx:Math.sqrt(E.v),vy:0,tr:[]}); }
   ps.forEach(p=>{ for(let i=0;i<30;i++){ const r2=p.x*p.x+p.y*p.y+1, r=Math.sqrt(r2); const F=k/r2/6; p.vx+=F*p.x/r*0.4; p.vy+=F*p.y/r*0.4; p.x+=p.vx*0.4*8; p.y+=p.vy*0.4*8; } p.tr.push([p.x,p.y]); });
   ps=ps.filter(p=>{ const out=Math.abs(p.x)>320||Math.abs(p.y)>220; if(out){ const ang=Math.abs(Math.atan2(p.vy,p.vx))*180/Math.PI; counts[ang<10?0:ang<90?1:2]++; trails.push(p.tr); if(trails.length>40) trails.shift(); } return !out; });
   x.lineWidth=1; trails.forEach(t=>{ x.strokeStyle=P.line2; x.beginPath(); t.forEach((q,i)=>i?x.lineTo(cx+q[0]*sc,cy+q[1]*sc):x.moveTo(cx+q[0]*sc,cy+q[1]*sc)); x.stroke(); });
   x.strokeStyle=P.brand; x.lineWidth=1.6; ps.forEach(p=>{ x.beginPath(); p.tr.forEach((q,i)=>i?x.lineTo(cx+q[0]*sc,cy+q[1]*sc):x.moveTo(cx+q[0]*sc,cy+q[1]*sc)); x.stroke(); x.fillStyle=P.brand; x.beginPath(); x.arc(cx+p.x*sc,cy+p.y*sc,3,0,7); x.fill(); });
   x.fillStyle=P.accent; x.beginPath(); x.arc(cx,cy,5,0,7); x.fill(); LK.text(x,'gold nucleus',cx+8,cy-8,P.muted,{size:11});
   ro.set('s',String(counts[0])); ro.set('d',String(counts[1])); ro.set('b',String(counts[2]));
 });
 return ()=>S.dispose(); }};

/* ---------- X-ray attenuation ---------- */
L.xray={title:'X-ray attenuation and imaging',cat:'Medical',topic:'6.5',desc:'Pass an X-ray beam through bone and soft tissue, with or without contrast medium. See I = I₀e^(−μx) and the image contrast.',
icon:'<rect x="10" y="45" width="25" height="30" fill="currentColor"/><path d="M35 60 H110" stroke="currentColor" stroke-width="3" stroke-dasharray="6 4"/><rect x="60" y="30" width="20" height="60" fill="none" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const kv=LK.slider(ct,{label:'Tube p.d.',min:30,max:150,step:5,value:80,fmt:v=>v+' kV'}), cm=LK.check(ct,'Iodine contrast in blood vessel',false), x0=LK.slider(ct,{label:'Bone thickness',min:0,max:4,step:0.1,value:2,fmt:v=>v+' cm'});
 const st=LK.stage(el,S,{ratio:0.45});
 const ro=LK.readout(el,[['Emax','max photon energy'],['tis','I/I₀ soft tissue'],['bone','I/I₀ through bone'],['mech','main attenuation mechanism']]);
 LK.note(el,'I = I₀e^(−μx). Bone has a much larger attenuation coefficient than soft tissue (high-Z calcium; photoelectric absorption ∝ Z³), so it appears white on the image. Contrast media with high Z (iodine, barium) make soft structures visible. Higher tube p.d. gives more penetrating (harder) X-rays with less contrast.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const E=kv.v*0.5; const muT=0.18*Math.pow(60/E,0.6), muB=0.18+1.2*Math.pow(60/E,2.2), muI=muB*1.8;
   const t=10, vt=0.6; const It=Math.exp(-muT*t), Ib=Math.exp(-muT*(t-x0.v)-muB*x0.v), Ii=Math.exp(-muT*(t-vt)-muI*vt);
   const shade=I=>{ const v=Math.round(255*Math.min(1,-Math.log(Math.max(1e-9,I))/7)); return `rgb(${v},${v},${v})`; };
   x.fillStyle=P.ink2; x.fillRect(16,H/2-20,40,40); LK.text(x,'tube',18,H/2-26,P.muted,{size:11});
   const bx=W*0.28, bw=W*0.26; x.fillStyle=P.accentSoft; LK.rr(x,bx,H*0.15,bw,H*0.7,30); x.fill(); LK.text(x,'patient (10 cm soft tissue)',bx+6,H*0.15-6,P.muted,{size:10});
   const bwid=bw*0.36*x0.v/4; if(x0.v>0){ x.fillStyle=P.surface; x.fillRect(bx+bw*0.32,H*0.22,bwid,H*0.56); x.strokeStyle=P.line2; x.strokeRect(bx+bw*0.32,H*0.22,bwid,H*0.56); LK.text(x,'bone',bx+bw*0.32,H*0.82,P.muted,{size:10}); }
   if(cm.checked){ x.fillStyle=P.brand; x.fillRect(bx+bw*0.8,H*0.2,6,H*0.6); }
   x.strokeStyle=P.accent; x.globalAlpha=0.35; for(let i=0;i<9;i++){ x.beginPath(); x.moveTo(56,H/2); x.lineTo(W*0.72,H*0.12+i*H*0.095); x.stroke(); } x.globalAlpha=1;
   const sx=W*0.74, sw=W*0.22; x.fillStyle=shade(1); x.fillRect(sx,H*0.08,sw,H*0.84);
   x.fillStyle=shade(It); LK.rr(x,sx+sw*0.06,H*0.15,sw*0.88,H*0.7,14); x.fill();
   if(x0.v>0){ x.fillStyle=shade(Ib); x.fillRect(sx+sw*0.06+sw*0.88*0.32,H*0.22,Math.max(3,sw*0.88*0.36*x0.v/4),H*0.56); }
   if(cm.checked){ x.fillStyle=shade(Ii); x.fillRect(sx+sw*0.06+sw*0.88*0.8,H*0.2,4,H*0.6); }
   LK.text(x,'radiograph: white = X-rays absorbed',sx-8,H-4,P.muted,{size:10});
   ro.set('Emax',kv.v+' keV'); ro.set('tis',LK.sig(It,3)); ro.set('bone',LK.sig(Ib,3)); ro.set('mech',kv.v<100?'photoelectric effect + simple scatter':'Compton effect');
 });
 return ()=>S.dispose(); }};

/* ---------- Ultrasound ---------- */
const TISS={air:{n:'Air',Z:430},gel:{n:'Coupling gel',Z:1.6e6},fat:{n:'Fat',Z:1.38e6},soft:{n:'Soft tissue',Z:1.63e6},muscle:{n:'Muscle',Z:1.70e6},bone:{n:'Bone',Z:7.8e6}};
L.ultrasound={title:'Ultrasound A-scan and impedance',cat:'Medical',topic:'6.5',desc:'Send an ultrasound pulse through layers of tissue. See reflections at each boundary and why gel is essential.',
icon:'<rect x="10" y="45" width="20" height="30" fill="currentColor"/><path d="M40 50 Q50 60 40 70 M50 45 Q62 60 50 75 M60 40 Q74 60 60 80" fill="none" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const cp=LK.select(ct,{label:'Between probe and skin',value:'gel',options:[['gel','Coupling gel'],['air','Air gap']]});
 const l2=LK.select(ct,{label:'Layer 2',value:'fat',options:Object.entries(TISS).filter(([k])=>k!=='air'&&k!=='gel').map(([k,v])=>[k,v.n])}), l3=LK.select(ct,{label:'Layer 3',value:'muscle',options:Object.entries(TISS).filter(([k])=>k!=='air'&&k!=='gel').map(([k,v])=>[k,v.n])}), l4=LK.select(ct,{label:'Layer 4',value:'bone',options:Object.entries(TISS).filter(([k])=>k!=='air'&&k!=='gel').map(([k,v])=>[k,v.n])});
 const st=LK.stage(el,S,{ratio:0.3,minH:150});
 const ro=LK.readout(el,[['r1','reflected at skin'],['r2','reflected at boundary 2'],['r3','reflected at boundary 3']]);
 const pl=LK.plot(el,S,{xlab:'time after pulse / μs',ylab:'echo amplitude (relative)',ratio:0.32});
 LK.note(el,'Z = ρc. The fraction of intensity reflected is (Z₂ − Z₁)²/(Z₂ + Z₁)². Air and skin have hugely different Z, so without gel almost everything reflects at the skin. Depth of a boundary = ct/2 (the pulse goes there and back). A B-scan builds a 2D image from many A-scans.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const layers=[cp.value,'soft',l2.value,l3.value,l4.value]; const th=[0.2,1.5,2,2.5,3]; const cS=1540;
   let Iin=1, t=0, echoes=[], refl=[]; for(let i=0;i<layers.length-1;i++){ const Z1=TISS[layers[i]].Z, Z2=TISS[layers[i+1]].Z; const R=((Z2-Z1)/(Z2+Z1))**2; t+=2*th[i]/100/cS*1e6; echoes.push([t,Iin*R]); refl.push(R); Iin*=(1-R); }
   let px=20; layers.forEach((L,i)=>{ const w=(W-60)*th[i]/9.2; x.fillStyle=[P.line2,P.accentSoft,P.soft,P.tealSoft,P.surface][i]; x.fillRect(px,20,w,H-40); x.strokeStyle=P.line2; x.strokeRect(px,20,w,H-40); LK.text(x,TISS[L].n,px+4,H-26,P.ink2,{size:10}); px+=w; });
   x.fillStyle=P.deep; x.fillRect(4,H/2-20,16,40);
   ro.set('r1',LK.fx(refl[0]*100,2)+'% then '+LK.fx(refl[1]*100,2)+'%'); ro.set('r2',LK.fx(refl[2]*100,2)+'%'); ro.set('r3',LK.fx(refl[3]*100,2)+'%');
   const trace=[]; for(let tt=0;tt<=80;tt+=0.2){ let a=0; echoes.forEach(([te,I])=>{ a+=Math.sqrt(I)*Math.exp(-Math.pow((tt-te)/0.6,2)); }); trace.push([tt,a]); } pl.set([{pts:trace,color:P.brand}],{xmin:0,xmax:80,ymin:0});
 });
 return ()=>S.dispose(); }};

/* ---------- HR diagram ---------- */
const STARS=[['Sun',5778,1],['Sirius A',9940,25.4],['Betelgeuse',3500,1.26e5],['Rigel',12100,1.2e5],['Proxima Centauri',3042,0.0017],['Sirius B',25200,0.056],['Vega',9602,40],['Aldebaran',3910,439],['Arcturus',4286,170],['Spica',22400,2e4],['Barnard’s Star',3134,0.0035],['Procyon B',7740,0.00049],['Antares',3570,7.5e4],['Polaris',6015,1260],['Altair',7700,10.6]];
L.hr={title:'HR diagram and stellar evolution',cat:'Astrophysics',topic:'5.5',desc:'Plot real stars on a Hertzsprung–Russell diagram and follow the life of a Sun-like star or a massive star.',
icon:'<path d="M10 10 V110 H110" fill="none" stroke="currentColor" stroke-width="4"/><path d="M20 20 C50 50 70 80 105 100" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity=".6"/><circle cx="90" cy="30" r="8" fill="currentColor"/><circle cx="30" cy="95" r="4" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const life=LK.select(ct,{label:'Evolutionary track',value:'none',options:[['none','No track'],['low','Low-mass star (like the Sun)'],['high','Massive star (> 10 M☉)']]});
 const st=LK.stage(el,S,{ratio:0.62});
 const ro=LK.readout(el,[['n','star'],['T','surface temperature'],['L','luminosity'],['r','radius (from Stefan’s law)']]);
 LK.note(el,'Temperature increases to the left; luminosity is on a log scale. Main-sequence stars fuse hydrogen. A low-mass star becomes a red giant, then sheds a planetary nebula to leave a white dwarf (bottom left). A massive star becomes a red supergiant, explodes as a supernova and leaves a neutron star or black hole. Tap a star for its radius: L = 4πr²σT⁴.');
 let pick=STARS[0];
 const map=()=>{ const W=st.w,H=st.h; const X=T=>40+(Math.log10(40000)-Math.log10(T))/(Math.log10(40000)-Math.log10(2500))*(W-60), Y=L=>H-30-(Math.log10(L)+5)/11*(H-50); return {X,Y}; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e), {X,Y}=map(); let best=null,bd=20; STARS.forEach(s=>{ const d=Math.hypot(X(s[1])-p.x,Y(s[2])-p.y); if(d<bd){bd=d;best=s;} }); if(best) pick=best; });
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const {X,Y}=map(); const W=st.w,H=st.h;
   x.strokeStyle=P.line; [ -4,-2,0,2,4,6].forEach(l=>{ x.beginPath(); x.moveTo(40,Y(10**l)); x.lineTo(W-20,Y(10**l)); x.stroke(); LK.text(x,'10'+LK.sup(l),6,Y(10**l)+4,P.muted,{size:10}); });
   [30000,10000,6000,3000].forEach(T=>{ LK.text(x,T+' K',X(T)-16,H-12,P.muted,{size:10}); });
   x.strokeStyle=P.soft; x.lineWidth=18; x.lineCap='round'; x.beginPath(); for(let T=35000;T>=2800;T*=0.97){ const L=Math.pow(T/5778,6.5); x.lineTo(X(T),Y(Math.max(1e-4,L))); } x.stroke(); x.lineCap='butt';
   if(life.value!=='none'){ const tr=life.value==='low'?[[5778,1],[5000,1.5],[4500,3],[4200,100],[4000,1000],[5000,1000],[30000,100],[60000,10],[20000,0.01],[10000,0.001]]:[[25000,2e4],[15000,5e4],[8000,8e4],[4000,1.2e5],[3500,1.3e5]]; x.strokeStyle=P.accent; x.lineWidth=2.5; x.setLineDash([6,4]); x.beginPath(); tr.forEach((p,k)=>{ const xx=X(Math.min(39000,p[0])),yy=Y(p[1]); k?x.lineTo(xx,yy):x.moveTo(xx,yy); }); x.stroke(); x.setLineDash([]); const end=tr[tr.length-1]; LK.text(x,life.value==='low'?'white dwarf':'→ supernova',X(Math.min(39000,end[0]))+6,Y(end[1])+4,P.accent,{size:11,weight:600}); }
   STARS.forEach(s=>{ const col=s[1]>10000?'#9ab8ff':s[1]>7000?'#dfe6ff':s[1]>5500?'#fff1b8':s[1]>4000?'#ffc178':'#ff8a5c'; const r=Math.max(3,Math.min(14,3+Math.log10(Math.sqrt(s[2])/Math.pow(s[1]/5778,2))*2.5+3)); x.fillStyle=col; x.strokeStyle=s===pick?P.brand:P.ink2; x.lineWidth=s===pick?3:1; x.beginPath(); x.arc(X(s[1]),Y(s[2]),r,0,7); x.fill(); x.stroke(); });
   LK.text(x,'main sequence',X(15000),Y(30)-14,P.brand,{size:11,weight:600}); LK.text(x,'white dwarfs',X(20000),Y(0.002),P.muted,{size:11}); LK.text(x,'giants',X(4300),Y(300)-16,P.muted,{size:11}); LK.text(x,'supergiants',X(5000),Y(1e5)-14,P.muted,{size:11});
   const r=Math.sqrt(pick[2]*3.83e26/(4*Math.PI*sig*pick[1]**4)); ro.set('n',pick[0]); ro.set('T',pick[1]+' K'); ro.set('L',LK.sig(pick[2],3)+' L☉'); ro.set('r',LK.sig(r,3)+' m ('+LK.sig(r/6.96e8,3)+' R☉)');
 });
 return ()=>S.dispose(); }};

/* ---------- Black body ---------- */
L.blackbody={title:'Black-body radiation: Wien and Stefan',cat:'Astrophysics',topic:'5.5',desc:'Change a star’s temperature and radius. Watch the spectrum’s peak shift (Wien) and the luminosity grow as T⁴ (Stefan).',
icon:'<path d="M10 105 C30 105 40 20 55 20 C75 20 85 95 110 100" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const T=LK.slider(ct,{label:'Surface temperature',min:2500,max:15000,step:100,value:5800,fmt:v=>v+' K'}), R=LK.slider(ct,{label:'Radius',min:0.1,max:100,step:0.1,value:1,fmt:v=>v+' R☉'});
 const cmp=LK.check(ct,'Compare with the Sun (5800 K)',true);
 const ro=LK.readout(el,[['lm','λ_max = 2.9×10⁻³/T'],['col','colour'],['L','luminosity L = 4πr²σT⁴'],['rel','L / L☉']]);
 const pl=LK.plot(el,S,{xlab:'wavelength / nm',ylab:'relative intensity',ratio:0.5});
 LK.note(el,'Wien’s displacement law: λ_max T = 2.9 × 10⁻³ m K, so hotter stars peak at shorter wavelengths (bluer). Stefan’s law: L = 4πr²σT⁴; doubling T multiplies L by 16. A cool red supergiant can still be very luminous because its radius is enormous.');
 const planck=(lnm,TT)=>{ const l=lnm*1e-9; return 1/(l**5*(Math.exp(h*c/(l*kB*TT))-1)); };
 const draw=()=>{ const P=LK.P(); const ref=planck(2.9e-3/T.v*1e9,T.v); const ser=[{pts:Array.from({length:200},(_,i)=>{const l=100+i*15; return [l,planck(l,T.v)/ref];}),color:P.brand,name:T.v+' K'}]; if(cmp.checked) ser.push({pts:Array.from({length:200},(_,i)=>{const l=100+i*15; return [l,planck(l,5800)/ref];}),color:P.ink2,dash:[5,4],name:'Sun'}); ser.push({pts:[[380,0],[380,1]],color:P.line2,dash:[2,4]},{pts:[[750,0],[750,1]],color:P.line2,dash:[2,4]}); pl.set(ser,{xmin:100,xmax:3100,ymin:0,legend:true});
   const lm=2.9e-3/T.v*1e9; const Ls=4*Math.PI*(R.v*6.96e8)**2*sig*T.v**4; ro.set('lm',LK.fx(lm,0)+' nm'); ro.set('col',T.v>10000?'blue-white':T.v>7500?'white':T.v>6000?'yellow-white':T.v>5000?'yellow':T.v>3700?'orange':'red'); ro.set('L',LK.sig(Ls,3)+' W'); ro.set('rel',LK.sig(Ls/3.83e26,3)); };
 [T,R].forEach(s=>s.input.addEventListener('input',draw)); cmp.addEventListener('change',draw); draw(); S.on(window,'themechange',draw);
 return ()=>S.dispose(); }};

/* ---------- Hubble ---------- */
L.hubble={title:'Redshift and Hubble’s law',cat:'Astrophysics',topic:'5.5',desc:'Measure redshifts of galaxies, convert to recession speeds and plot v against d to find H₀ and the age of the universe.',
icon:'<path d="M10 110 L110 20" stroke="currentColor" stroke-width="5"/><circle cx="30" cy="92" r="5" fill="currentColor"/><circle cx="55" cy="68" r="5" fill="currentColor"/><circle cx="85" cy="45" r="5" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const H0true=70;
 const gal=Array.from({length:12},(_,i)=>{ const d=20+i*35+Math.random()*20; const v=H0true*d*(1+0.08*LK.gauss()); return {name:'Galaxy '+String.fromCharCode(65+i),d,v,meas:false}; });
 const ct=LK.ctrl(el); const sel=LK.select(ct,{label:'Galaxy',value:'0',options:gal.map((g,i)=>[String(i),g.name+' ('+g.d.toFixed(0)+' Mpc)'])}); LK.button(ct,'Measure redshift',()=>{ gal[+sel.value].meas=true; draw(); },'primary'); LK.button(ct,'Measure all',()=>{ gal.forEach(g=>g.meas=true); draw(); });
 const st=LK.stage(el,S,{ratio:0.22,minH:110,maxH:150});
 const ro=LK.readout(el,[['z','Δλ/λ'],['v','v = cΔλ/λ'],['H','H₀ from your graph'],['age','age ≈ 1/H₀']]);
 const pl=LK.plot(el,S,{xlab:'distance / Mpc',ylab:'recession velocity / km s⁻¹',ratio:0.42});
 LK.note(el,'The hydrogen-alpha line (656.3 nm in the lab) is shifted to longer wavelengths. Δλ/λ ≈ v/c. Plot v against d: the gradient is H₀. Convert to s⁻¹ (1 Mpc = 3.09 × 10¹⁹ km) and 1/H₀ estimates the age of the universe.');
 const draw=()=>{ const P=LK.P(); const pts=gal.filter(g=>g.meas).map(g=>[g.d,g.v]); const f=LK.fit(pts.map(p=>[p[0],p[1]]).concat([[0,0]])); const s=[{pts,points:true,color:P.brand}]; if(f&&pts.length>1){ s.push({pts:[[0,0],[460,f.m*460]],color:P.ink2,dash:[5,4]}); const Hs=f.m/3.09e19; ro.set('H',LK.fx(f.m,1)+' km s⁻¹ Mpc⁻¹'); ro.set('age',LK.sig(1/Hs/3.15e7/1e9,3)+' billion years'); } pl.set(s,{xmin:0,ymin:0});
   const g=gal[+sel.value]; const z=g.v/3e5; ro.set('z',g.meas?LK.fx(z,4):'–'); ro.set('v',g.meas?LK.sig(g.v,3)+' km/s':'–'); };
 sel.addEventListener('change',draw); draw();
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const g=gal[+sel.value]; const z=g.v/3e5;
   const row=(y,shift,lab)=>{ for(let i=0;i<W-120;i++){ const l=380+i/(W-120)*370; x.fillStyle=LK.wl2rgb(l); x.fillRect(100+i,y,1,H*0.3); } [656.3,486.1,434.0].forEach(l0=>{ const l=l0*(1+shift); if(l>750) return; const px=100+(l-380)/370*(W-120); x.fillStyle='#000'; x.fillRect(px-1.5,y,3,H*0.3); }); LK.text(x,lab,6,y+H*0.18,P.ink2,{size:11}); };
   row(H*0.1,0,'lab'); row(H*0.55,g.meas?z:0,g.meas?g.name:'(not measured)'); });
 return ()=>S.dispose(); }};

/* ---------- Data grapher ---------- */
L.grapher={title:'Data grapher and gradient finder',cat:'Practical skills',topic:'1.1',desc:'Type or paste your own results, add error bars, linearise with ln or powers, and get best and worst gradients.',
icon:'<path d="M10 10 V110 H110" fill="none" stroke="currentColor" stroke-width="4"/><path d="M20 95 L100 25" stroke="currentColor" stroke-width="4"/><circle cx="35" cy="80" r="5" fill="currentColor"/><circle cx="60" cy="60" r="5" fill="currentColor"/><circle cx="85" cy="40" r="5" fill="currentColor"/>',
mount(el){ const S=LK.scope();
 const ta=LK.el(`<label class="field" for="gr-data"><span>Data (x, y, optional ± in y), one pair per line</span><textarea id="gr-data" rows="7">0.20, 0.90, 0.03\n0.40, 1.26, 0.03\n0.60, 1.56, 0.04\n0.80, 1.79, 0.04\n1.00, 2.01, 0.05</textarea></label>`); el.appendChild(ta);
 const ct=LK.ctrl(el); const tx=LK.select(ct,{label:'x transform',value:'x',options:[['x','x'],['x2','x²'],['sqrt','√x'],['inv','1/x'],['ln','ln x']]}), ty=LK.select(ct,{label:'y transform',value:'y2',options:[['y','y'],['y2','y²'],['sqrt','√y'],['inv','1/y'],['ln','ln y']]});
 const xl=LK.el('<label for="gr-xl"><span>x label</span><input id="gr-xl" type="text" value="L / m"></label>'), yl=LK.el('<label for="gr-yl"><span>y label</span><input id="gr-yl" type="text" value="T / s"></label>'); ct.appendChild(xl); ct.appendChild(yl);
 const ro=LK.readout(el,[['m','best gradient'],['c','intercept'],['mw','worst gradient'],['u','% uncertainty in gradient'],['r2','R²']]);
 const pl=LK.plot(el,S,{xlab:'',ylab:'',ratio:0.5});
 LK.note(el,'The example is pendulum data: plotting T² against L gives a straight line through the origin with gradient 4π²/g. Error bars are transformed too (for y², the absolute uncertainty becomes 2yΔy). The worst line here is drawn through the extremes of the first and last error bars.');
 const T={x:v=>v,x2:v=>v*v,sqrt:v=>Math.sqrt(v),inv:v=>1/v,ln:v=>Math.log(v),y:v=>v,y2:v=>v*v};
 const draw=()=>{ const P=LK.P(); const rows=ta.querySelector('textarea').value.split(/\n/).map(l=>l.split(/[\s,;\t]+/).filter(Boolean).map(Number)).filter(r=>r.length>=2&&r.every(isFinite));
   const fx=T[tx.value], fy=T[ty.value]; const pts=rows.map(r=>{ const y=fy(r[1]); const dy=r[2]?Math.abs(fy(r[1]+r[2])-fy(r[1]-r[2]))/2:0; return [fx(r[0]),y,dy]; }).filter(p=>isFinite(p[0])&&isFinite(p[1]));
   const f=LK.fit(pts.map(p=>[p[0],p[1]])); const s=[{pts,points:true,color:P.brand}]; if(f){ const xs=pts.map(p=>p[0]); const x0=Math.min(...xs), x1=Math.max(...xs); s.push({pts:[[Math.min(0,x0),f.m*Math.min(0,x0)+f.c],[x1,f.m*x1+f.c]],color:P.ink2});
     const a=pts.reduce((p,q)=>q[0]<p[0]?q:p), b=pts.reduce((p,q)=>q[0]>p[0]?q:p); const mw1=((b[1]+b[2])-(a[1]-a[2]))/(b[0]-a[0]), mw2=((b[1]-b[2])-(a[1]+a[2]))/(b[0]-a[0]); const mw=Math.abs(mw1-f.m)>Math.abs(mw2-f.m)?mw1:mw2; const cw=(a[1]+(mw===mw1?-a[2]:a[2]))-mw*a[0];
     s.push({pts:[[Math.min(0,x0),mw*Math.min(0,x0)+cw],[x1,mw*x1+cw]],color:P.accent,dash:[5,4]});
     ro.set('m',LK.sig(f.m,4)); ro.set('c',LK.sig(f.c,3)); ro.set('mw',LK.sig(mw,4)); ro.set('u',LK.fx(Math.abs(mw-f.m)/Math.abs(f.m)*100,1)+'%'); ro.set('r2',LK.fx(f.r2,4)); }
   const lx={x:'',x2:'²',sqrt:'√',inv:'1/',ln:'ln '}[tx.value], ly={y:'',y2:'²',sqrt:'√',inv:'1/',ln:'ln '}[ty.value]; const xlab=xl.querySelector('input').value, ylab=yl.querySelector('input').value;
   const wrap=(t,v)=>t==='x2'||t==='y2'?`(${v})²`:t==='x'||t==='y'?v:`${{sqrt:'√',inv:'1/',ln:'ln '}[t]}(${v})`;
   pl.set(s,{xlab:wrap(tx.value,xlab),ylab:wrap(ty.value,ylab)}); };
 [ta.querySelector('textarea'),xl.querySelector('input'),yl.querySelector('input')].forEach(i=>i.addEventListener('input',draw)); [tx,ty].forEach(s=>s.addEventListener('change',draw)); draw();
 return ()=>S.dispose(); }};
})();
