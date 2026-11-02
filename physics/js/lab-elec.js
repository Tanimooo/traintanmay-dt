/* Electricity, fields and electromagnetism labs */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const e=1.6e-19, me=9.11e-31, mp=1.673e-27, k0=8.99e9;

/* ---------- I–V characteristics ---------- */
const IV={
 res:{n:'Resistor 47 Ω',I:V=>V/47},
 lamp:{n:'Filament lamp 6 V',I:V=>{ const s=Math.sign(V), a=Math.abs(V); return s*0.5*Math.pow(a/6,0.6); }},
 diode:{n:'Silicon diode',I:V=>V<0?-1e-8:1e-9*(Math.exp(V/0.045)-1)>0.6?0.6:1e-9*(Math.exp(V/0.045)-1)},
 red:{n:'Red LED (≈ 630 nm)',I:V=>V<1.7?0:Math.min(0.05,(V-1.7)*0.08)},
 green:{n:'Green LED (≈ 525 nm)',I:V=>V<2.15?0:Math.min(0.05,(V-2.15)*0.08)},
 blue:{n:'Blue LED (≈ 470 nm)',I:V=>V<2.55?0:Math.min(0.05,(V-2.55)*0.08)},
 therm:{n:'NTC thermistor (self-heating)',I:V=>{ const s=Math.sign(V), a=Math.abs(V); let R=1000; for(let i=0;i<20;i++){ const P=a*a/R; const T=20+P*40; R=1000*Math.exp(3600*(1/(T+273)-1/293)); } return s*a/R; }}
};
L.iv={title:'I–V characteristics',cat:'Electricity',topic:'4.2',desc:'Sweep the p.d. across a resistor, filament lamp, diode, LEDs or a thermistor and plot the characteristic.',
icon:'<path d="M10 60 H110 M60 110 V10" stroke="currentColor" stroke-width="3"/><path d="M15 100 C35 90 50 75 60 60 C70 45 85 30 105 20" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const comp=LK.select(c,{label:'Component',value:'lamp',options:Object.entries(IV).map(([k,v])=>[k,v.n]),on:()=>{pts=[];redraw();}});
 const V=LK.slider(c,{label:'p.d. V',min:-6,max:6,step:0.05,value:2,fmt:v=>v.toFixed(2)+' V'});
 const b=LK.ctrl(el); LK.button(b,'Record',()=>{ pts.push([V.v,cur()*1000]); redraw(); },'primary'); LK.button(b,'Auto sweep',()=>{ pts=[]; for(let v=-6;v<=6.001;v+=0.25) pts.push([v,IV[comp.value].I(v)*1000]); redraw(); }); LK.button(b,'Clear',()=>{pts=[];redraw();});
 const ro=LK.readout(el,[['v','V'],['i','I'],['r','R = V/I']]);
 const pl=LK.plot(el,S,{xlab:'V / V',ylab:'I / mA',ratio:0.5});
 LK.note(el,'An ohmic resistor gives a straight line through the origin. The lamp’s resistance rises as it heats up, so the curve flattens. Diodes and LEDs conduct only in forward bias above a threshold p.d.; for an LED eV ≈ hc/λ (PAG 6.1). The thermistor heats itself, its resistance falls and the curve bends upwards.');
 let pts=[]; const cur=()=>IV[comp.value].I(V.v);
 const redraw=()=>{ const P=LK.P(); pl.set([{pts,points:true,color:P.brand},{pts:[[V.v,cur()*1000]],points:true,color:P.accent,r:6}],{xmin:-6,xmax:6}); };
 V.input.addEventListener('input',redraw); redraw();
 S.loop(()=>{ const I=cur(); ro.set('v',LK.fx(V.v,2)+' V'); ro.set('i',LK.sig(I*1000,3)+' mA'); ro.set('r',Math.abs(I)<1e-7?'very large':LK.sig(V.v/I,3)+' Ω'); });
 return ()=>S.dispose(); }};

/* ---------- Internal resistance ---------- */
L.intres={title:'Internal resistance and max power',cat:'Electricity',topic:'4.3',desc:'Vary the load on a cell. Plot terminal p.d. against current to read off ε and r, and find the load for maximum power.',
icon:'<path d="M15 25 L105 95" stroke="currentColor" stroke-width="5"/><path d="M15 10 V105 H110" fill="none" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const E=LK.slider(c,{label:'e.m.f. ε',min:1.5,max:12,step:0.5,value:6,fmt:v=>v+' V',on:()=>{pts=[];draw();}}), r=LK.slider(c,{label:'internal r',min:0.2,max:5,step:0.1,value:1.5,fmt:v=>v+' Ω',on:()=>{pts=[];draw();}});
 const R=LK.slider(c,{label:'load R',min:0.2,max:20,step:0.1,value:4,fmt:v=>v+' Ω',on:()=>draw()});
 const b=LK.ctrl(el); LK.button(b,'Record reading',()=>{ const I=E.v/(R.v+r.v); pts.push([I,E.v-I*r.v,R.v]); draw(); },'primary'); LK.button(b,'Clear',()=>{pts=[];draw();});
 const ro=LK.readout(el,[['I','current I'],['V','terminal p.d. V'],['lv','lost volts Ir'],['P','power in load'],['fit','from graph']]);
 const pl=LK.plot(el,S,{xlab:'I / A',ylab:'V / V',ratio:0.42}); const pl2=LK.plot(el,S,{xlab:'load R / Ω',ylab:'power in load / W',ratio:0.32});
 LK.note(el,'V = ε − Ir: a straight line with gradient −r and intercept ε. Power in the load P = ε²R/(R + r)² is greatest when R = r (maximum power theorem); then efficiency is only 50%.');
 let pts=[];
 const draw=()=>{ const P=LK.P(); const f=LK.fit(pts.map(p=>[p[0],p[1]])); const s=[{pts:pts.map(p=>[p[0],p[1]]),points:true,color:P.brand}]; if(f&&pts.length>1){ const xm=E.v/r.v; s.push({pts:[[0,f.c],[xm,f.m*xm+f.c]],color:P.ink2,dash:[5,4]}); ro.set('fit','ε = '+LK.fx(f.c,2)+' V, r = '+LK.fx(-f.m,2)+' Ω'); } else ro.set('fit','record 2+ points');
   pl.set(s,{xmin:0,ymin:0,xmax:E.v/(0.2+r.v)*1.05,ymax:E.v*1.05});
   const curve=Array.from({length:120},(_,i)=>{ const RR=0.2+i*19.8/119; return [RR,E.v*E.v*RR/(RR+r.v)**2]; }); const I=E.v/(R.v+r.v); pl2.set([{pts:curve,color:P.teal},{pts:[[R.v,I*I*R.v]],points:true,color:P.accent,r:6},{pts:[[r.v,0],[r.v,E.v*E.v/(4*r.v)]],color:P.ink2,dash:[4,4]}],{xmin:0,ymin:0});
   ro.set('I',LK.fx(I,3)+' A'); ro.set('V',LK.fx(E.v-I*r.v,3)+' V'); ro.set('lv',LK.fx(I*r.v,3)+' V'); ro.set('P',LK.fx(I*I*R.v,3)+' W'); };
 draw();
 return ()=>S.dispose(); }};

/* ---------- Potential divider ---------- */
L.potdiv={title:'Potential divider and sensors',cat:'Electricity',topic:'4.3',desc:'Build a light or temperature sensor from a potential divider and see how V_out responds, including the effect of a load.',
icon:'<path d="M60 5 V20 M60 50 V65 M60 95 V115 M60 58 H100" stroke="currentColor" stroke-width="4"/><rect x="48" y="20" width="24" height="30" fill="none" stroke="currentColor" stroke-width="4"/><rect x="48" y="65" width="24" height="30" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const Vin=LK.slider(c,{label:'V_in',min:1,max:12,step:0.5,value:9,fmt:v=>v+' V'});
 const R1=LK.select(c,{label:'Top resistor R₁',value:'2200',options:[['470','470 Ω'],['1000','1 kΩ'],['2200','2.2 kΩ'],['4700','4.7 kΩ'],['10000','10 kΩ']]});
 const sens=LK.select(c,{label:'Bottom component R₂',value:'ldr',options:[['fixed','Fixed 2.2 kΩ'],['ldr','LDR'],['therm','NTC thermistor']]});
 const cond=LK.slider(c,{label:'Light / temperature',min:0,max:100,step:1,value:40,fmt:v=>sens.value==='therm'?v+' °C':v+'%'});
 const load=LK.select(c,{label:'Load across V_out',value:'none',options:[['none','None (ideal voltmeter)'],['10000','10 kΩ'],['1000','1 kΩ']]});
 const st=LK.stage(el,S,{ratio:0.42});
 const ro=LK.readout(el,[['r2','R₂'],['vo','V_out (across R₂)'],['v1','V across R₁']]);
 const pl=LK.plot(el,S,{xlab:'light (%) or temperature (°C)',ylab:'V_out / V',ratio:0.32});
 LK.note(el,'V_out = R₂/(R₁ + R₂) × V_in. As light increases the LDR’s resistance falls so V_out across it falls. Swap the components (output across R₁) to make the output rise with light. A load in parallel with R₂ lowers the effective resistance and pulls V_out down.');
 const R2of=v=>sens.value==='fixed'?2200:sens.value==='ldr'?150*Math.pow(10,2.8*(1-v/100)):10000*Math.exp(3600*(1/(v+273)-1/298));
 const vout=v=>{ let r2=R2of(v); if(load.value!=='none'){ const RL=+load.value; r2=1/(1/r2+1/RL);} return Vin.v*r2/(+R1.value+r2); };
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w, H=st.h; const lx=W*0.3, top=24, bot=H-24;
   x.strokeStyle=P.ink; x.lineWidth=2; x.beginPath(); x.moveTo(lx,top); x.lineTo(W*0.1,top); x.lineTo(W*0.1,bot); x.lineTo(lx,bot); x.stroke();
   x.beginPath(); x.moveTo(lx,top); x.lineTo(lx,top+20); x.moveTo(lx,H/2-20); x.lineTo(lx,H/2+20); x.moveTo(lx,bot-20); x.lineTo(lx,bot); x.stroke();
   x.fillStyle=P.surface; x.fillRect(lx-12,top+20,24,H/2-40-top); x.strokeRect(lx-12,top+20,24,H/2-40-top); x.fillRect(lx-12,H/2+20,24,bot-20-H/2-20); x.strokeRect(lx-12,H/2+20,24,bot-20-H/2-20);
   LK.text(x,'R₁ '+(+R1.value>=1000?R1.value/1000+' kΩ':R1.value+' Ω'),lx+20,H/4+4,P.ink2,{size:12}); LK.text(x,'R₂ '+(sens.value==='fixed'?'2.2 kΩ':sens.value==='ldr'?'LDR':'thermistor'),lx+20,H*0.72,P.ink2,{size:12});
   x.beginPath(); x.moveTo(lx,H/2); x.lineTo(W*0.6,H/2); x.moveTo(lx,bot); x.lineTo(W*0.6,bot); x.stroke(); x.fillStyle=P.ink; x.beginPath(); x.arc(W*0.6,H/2,4,0,7); x.arc(W*0.6,bot,4,0,7); x.fill();
   const vo=vout(cond.v); LK.text(x,'V_out = '+LK.fx(vo,2)+' V',W*0.62,(H/2+bot)/2,P.brand,{weight:700,size:16}); LK.text(x,'V_in = '+Vin.v+' V',W*0.12,H/2,P.ink2,{size:12});
   x.fillStyle=P.brand; x.fillRect(W*0.85,bot-(bot-top)*vo/12,W*0.06,(bot-top)*vo/12); x.strokeStyle=P.line2; x.strokeRect(W*0.85,top,W*0.06,bot-top);
   ro.set('r2',LK.sig(R2of(cond.v),3)+' Ω'); ro.set('vo',LK.fx(vo,3)+' V'); ro.set('v1',LK.fx(Vin.v-vo,3)+' V');
   pl.set([{pts:Array.from({length:101},(_,i)=>[i,vout(i)]),color:P.brand},{pts:[[cond.v,vo]],points:true,color:P.accent,r:6}],{xmin:0,xmax:100,ymin:0,ymax:Vin.v});
 });
 return ()=>S.dispose(); }};

/* ---------- Capacitor ---------- */
L.capacitor={title:'Capacitor charge and discharge',cat:'Fields & particles',topic:'6.1',desc:'Charge and discharge a capacitor through a resistor. Read the time constant from V–t or ln V–t graphs.',
icon:'<path d="M10 60 H50 M70 60 H110" stroke="currentColor" stroke-width="4"/><path d="M50 30 V90 M70 30 V90" stroke="currentColor" stroke-width="7"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const C=LK.select(c,{label:'C',value:'470',options:[['100','100 μF'],['220','220 μF'],['470','470 μF'],['1000','1000 μF'],['2200','2200 μF']]});
 const R=LK.select(c,{label:'R',value:'10',options:[['4.7','4.7 kΩ'],['10','10 kΩ'],['22','22 kΩ'],['47','47 kΩ']]});
 const V0=LK.slider(c,{label:'Supply',min:1,max:12,step:0.5,value:6,fmt:v=>v+' V'});
 const yv=LK.select(c,{label:'Plot',value:'V',options:[['V','V against t'],['Q','Q against t'],['I','I against t'],['lnV','ln V against t']]});
 const b=LK.ctrl(el); LK.button(b,'Charge',()=>{mode='charge';t=0;data=[];start=Vc;run=true;},'primary'); LK.button(b,'Discharge',()=>{mode='dis';t=0;data=[];start=Vc;run=true;});
 const st=LK.stage(el,S,{ratio:0.3,minH:150});
 const ro=LK.readout(el,[['t','time t'],['tau','τ = CR'],['v','V across C'],['q','charge Q'],['i','current'],['w','energy ½CV²']]);
 const pl=LK.plot(el,S,{xlab:'t / s',ylab:'',ratio:0.4});
 LK.note(el,'Discharge: V = V₀e^(−t/CR); after one time constant V has fallen to 37%. Charging: V_C = V₀(1 − e^(−t/CR)); after τ it reaches 63%. A graph of ln V against t during discharge is a straight line of gradient −1/CR (PAG 9.1).');
 let Vc=0, mode='charge', t=0, data=[], start=0, run=true;
 S.loop(dt=>{ const Cv=+C.value*1e-6, Rv=+R.value*1e3, tau=Cv*Rv; const sp=Math.max(1,tau/3); const tEnd=6*tau;
   if(run){ const h=Math.min(dt*sp,tEnd-t);
     if(mode==='charge') Vc=V0.v-(V0.v-Vc)*Math.exp(-h/tau); else Vc=Vc*Math.exp(-h/tau); t+=h;
     data.push([t,Vc,Cv*Vc,(mode==='charge'?(V0.v-Vc):Vc)/Rv]); if(t>=tEnd-1e-9){ t=tEnd; run=false; } }
   const I=run?(mode==='charge'?(V0.v-Vc):Vc)/Rv:(data.length?data[data.length-1][3]:0);
   const P=LK.P(),x=st.ctx; st.clear(); const W=st.w, H=st.h; const cx=W*0.55;
   x.strokeStyle=P.ink; x.lineWidth=2; x.strokeRect(W*0.12,24,W*0.76,H-48);
   x.clearRect(cx-14,20,28,10); x.fillStyle=P.bg; x.fillRect(cx-14,18,28,12); x.lineWidth=5; x.beginPath(); x.moveTo(cx-6,8); x.lineTo(cx-6,40); x.moveTo(cx+6,8); x.lineTo(cx+6,40); x.stroke(); x.lineWidth=2;
   const q=Vc/12; x.fillStyle=P.brand; x.globalAlpha=0.25+0.75*q; for(let i=0;i<6;i++){ LK.text(x,'+',cx-20,12+i*6,P.brand,{size:9}); LK.text(x,'−',cx+12,12+i*6,P.teal,{size:9}); } x.globalAlpha=1;
   x.fillStyle=P.surface; x.fillRect(W*0.3,H-34,60,20); x.strokeRect(W*0.3,H-34,60,20); LK.text(x,'R',W*0.3+30,H-20,P.ink,{align:'center'});
   LK.text(x,mode==='charge'?'switch → supply (charging)':'switch → resistor only (discharging)',W*0.14,H/2+4,P.muted,{size:12});
   if(!run) LK.text(x,'Stopped at 6τ (fully '+(mode==='charge'?'charged':'discharged')+'). Press Charge or Discharge to run again.',W*0.14,H/2+22,P.brand,{size:12});
   ro.set('t',LK.sig(t,3)+' s'+(run?'':' (stopped)')); ro.set('tau',LK.sig(tau,3)+' s'); ro.set('v',LK.fx(Vc,3)+' V'); ro.set('q',LK.sig(Cv*Vc*1000,3)+' mC'); ro.set('i',LK.sig(I*1000,3)+' mA'); ro.set('w',LK.sig(0.5*Cv*Vc*Vc,3)+' J');
   if(Math.floor(performance.now()/80)%2===0){ const k=yv.value; const pts=data.map(d=>[d[0],k==='V'?d[1]:k==='Q'?d[2]*1000:k==='I'?d[3]*1000:Math.log(Math.max(1e-6,d[1]))]); const lab={V:'V / V',Q:'Q / mC',I:'I / mA',lnV:'ln (V / V)'}[k];
     pl.set([{pts,color:P.brand},{pts:[[tau,k==='lnV'?-5:0],[tau,k==='V'?V0.v:k==='Q'?Cv*V0.v*1000:k==='I'?V0.v/Rv*1000:Math.log(V0.v)]],color:P.ink2,dash:[4,4]}],{ylab:lab,xmin:0,xmax:6*tau,ymin:k==='lnV'?undefined:0}); }
 });
 return ()=>S.dispose(); }};

/* ---------- Electric field mapper ---------- */
L.efield={title:'Electric field mapper',howto:'drag the big charges to move them. Tap anywhere else to release a small positive test charge and watch it follow the field. Move the pointer to probe E and V.',cat:'Fields & particles',topic:'6.2',desc:'Drag point charges around. See field lines and equipotentials, and probe E and V anywhere.',
icon:'<circle cx="35" cy="60" r="12" fill="currentColor"/><circle cx="85" cy="60" r="12" fill="none" stroke="currentColor" stroke-width="5"/><path d="M47 60 H73 M42 50 Q60 30 78 50 M42 70 Q60 90 78 70" fill="none" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const pre=LK.select(c,{label:'Arrangement',value:'dip',options:[['one','Single + charge'],['dip','Dipole (+ and −)'],['like','Two like charges'],['plates','Parallel plates']],on:()=>setup()});
 const eq=LK.check(c,'Equipotentials',true); const tmode=LK.check(c,'Tap to release a + test charge',true); LK.button(c,'Add + charge',()=>{ Q.push({x:0.5,y:0.3,q:1}); }); LK.button(c,'Add − charge',()=>{ Q.push({x:0.5,y:0.7,q:-1}); }); LK.button(c,'Clear test charges',()=>{ tests=[]; }); let tests=[];
 const st=LK.stage(el,S,{ratio:0.55});
 const ro=LK.readout(el,[['E','|E| at probe (relative)'],['V','V at probe (relative)']]);
 LK.note(el,'Field lines start on positive charges and end on negative ones; they never cross. Equipotentials are always perpendicular to field lines and are closer together where the field is stronger. Between parallel plates the field is uniform: E = V/d. Drag charges to move them; move the pointer to probe the field.');
 let Q=[], probe={x:0.5,y:0.5}, drag=null;
 const setup=()=>{ const v=pre.value; Q= v==='one'?[{x:0.5,y:0.5,q:1}]: v==='dip'?[{x:0.35,y:0.5,q:1},{x:0.65,y:0.5,q:-1}]: v==='like'?[{x:0.35,y:0.5,q:1},{x:0.65,y:0.5,q:1}]: Array.from({length:12},(_,i)=>({x:0.18+i*0.058,y:0.3,q:1,fixed:true})).concat(Array.from({length:12},(_,i)=>({x:0.18+i*0.058,y:0.7,q:-1,fixed:true}))); }; setup();
 const asp=()=>st.h/st.w;
 const field=(x,y)=>{ let Ex=0,Ey=0,V=0; const a=asp(); Q.forEach(c=>{ const dx=x-c.x, dy=(y-c.y)*a, r2=dx*dx+dy*dy+1e-5, r=Math.sqrt(r2); Ex+=c.q*dx/(r2*r); Ey+=c.q*dy/(r2*r)/a; V+=c.q/r; }); return {Ex,Ey,V}; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e); const x=p.x/st.w,y=p.y/st.h; drag=Q.find(c=>!c.fixed&&Math.hypot((c.x-x)*st.w,(c.y-y)*st.h)<20)||null; if(drag) st.cv.setPointerCapture(e.pointerId); else if(tmode.checked){ tests.push({x,y,trail:[[x,y]]}); if(tests.length>12) tests.shift(); } });
 S.on(st.cv,'pointermove',e=>{ const p=st.pos(e); probe={x:p.x/st.w,y:p.y/st.h}; if(drag){ drag.x=probe.x; drag.y=probe.y; } });
 S.on(st.cv,'pointerup',()=>drag=null);
 let cache=null, key='';
 S.loop((dt)=>{ const P=LK.P(),x=st.ctx; const k=JSON.stringify(Q)+st.w+eq.checked+P.brand;
   if(k!==key){ key=k; st.clear();
     if(eq.checked){ const N=6; const img=x.getImageData(0,0,st.cv.width,st.cv.height); const dpr=st.cv.width/st.w;
       x.save(); for(let px=0;px<st.w;px+=N) for(let py=0;py<st.h;py+=N){ const f=field(px/st.w,py/st.h); const lv=Math.atan(f.V*0.15)/(Math.PI/2); x.fillStyle=lv>0?`rgba(214,36,110,${Math.abs(lv)*0.22})`:`rgba(15,143,138,${Math.abs(lv)*0.22})`; x.fillRect(px,py,N,N); }
       // contour lines
       const levels=[-20,-10,-6,-4,-2.5,-1.5,-0.8,0,0.8,1.5,2.5,4,6,10,20]; x.strokeStyle=P.muted; x.lineWidth=1; x.globalAlpha=0.6; const G=5;
       for(let px=0;px<st.w-G;px+=G) for(let py=0;py<st.h-G;py+=G){ const v00=field(px/st.w,py/st.h).V, v10=field((px+G)/st.w,py/st.h).V, v01=field(px/st.w,(py+G)/st.h).V; levels.forEach(L=>{ if((v00-L)*(v10-L)<0||(v00-L)*(v01-L)<0){ x.fillStyle=P.muted; x.fillRect(px,py,1.3,1.3); } }); }
       x.globalAlpha=1; x.restore(); }
     // field lines
     x.strokeStyle=P.ink2; x.lineWidth=1.3;
     Q.filter(c=>c.q>0).forEach(c=>{ const n=c.fixed?2:16; for(let i=0;i<n;i++){ const a=c.fixed?(Math.PI/2):i/n*Math.PI*2; let px=c.x*st.w+Math.cos(a)*10, py=c.y*st.h+Math.sin(a)*10; if(c.fixed){ px=c.x*st.w; py=c.y*st.h+8; }
       x.beginPath(); x.moveTo(px,py); for(let s=0;s<700;s++){ const f=field(px/st.w,py/st.h); const ex=f.Ex*st.w, ey=f.Ey*st.h; const m=Math.hypot(f.Ex,f.Ey*asp()); if(!m) break; px+=f.Ex/m*3; py+=f.Ey*asp()/m*3; x.lineTo(px,py); if(px<0||py<0||px>st.w||py>st.h) break; if(Q.some(q=>q.q<0&&Math.hypot(q.x*st.w-px,q.y*st.h-py)<8)) break; if(s===60){ x.stroke(); LK.arrow(x,px-f.Ex/m*6,py-f.Ey*asp()/m*6,px,py,P.ink2,1.3,7); x.beginPath(); x.moveTo(px,py);} } x.stroke(); } });
     Q.forEach(c=>{ x.fillStyle=c.q>0?P.brand:P.teal; x.beginPath(); x.arc(c.x*st.w,c.y*st.h,c.fixed?5:12,0,7); x.fill(); if(!c.fixed) LK.text(x,c.q>0?'+':'−',c.x*st.w,c.y*st.h+5,'#fff',{align:'center',size:16,weight:700}); });
     cache=x.getImageData(0,0,st.cv.width,st.cv.height); }
   else if(cache) x.putImageData(cache,0,0);
   tests.forEach(tc=>{ if(tc.dead) return; for(let k=0;k<4;k++){ const f=field(tc.x,tc.y); const m=Math.hypot(f.Ex,f.Ey*asp()); if(!m){ tc.dead=true; break; } const sp=dt*0.08; tc.x+=f.Ex/m*sp; tc.y+=f.Ey*asp()/m*sp/asp(); if(tc.x<0||tc.y<0||tc.x>1||tc.y>1||Q.some(q=>q.q<0&&Math.hypot((q.x-tc.x)*st.w,(q.y-tc.y)*st.h)<10)) { tc.dead=true; break; } } tc.trail.push([tc.x,tc.y]); });
   tests.forEach(tc=>{ const P2=LK.P(); x.strokeStyle=P2.accent; x.lineWidth=2.5; x.beginPath(); tc.trail.forEach((p,k)=>k?x.lineTo(p[0]*st.w,p[1]*st.h):x.moveTo(p[0]*st.w,p[1]*st.h)); x.stroke(); if(!tc.dead){ x.fillStyle=P2.accent; x.beginPath(); x.arc(tc.x*st.w,tc.y*st.h,5,0,7); x.fill(); } });
   const f=field(probe.x,probe.y); const m=Math.hypot(f.Ex,f.Ey*asp()); const px=probe.x*st.w, py=probe.y*st.h; x.strokeStyle=P.accent; x.beginPath(); x.arc(px,py,6,0,7); x.stroke(); if(m) LK.arrow(x,px,py,px+f.Ex/m*28,py+f.Ey*asp()/m*28,P.accent,2.5);
   ro.set('E',LK.sig(m,3)); ro.set('V',LK.sig(f.V,3));
 });
 return ()=>S.dispose(); }};

/* ---------- Charged particles in fields ---------- */
const PART={e:{n:'Electron',q:-e,m:me},p:{n:'Proton',q:e,m:mp},a:{n:'Alpha particle',q:2*e,m:6.646e-27}};
L.deflect={title:'Charged particles in E and B fields',cat:'Fields & particles',topic:'6.3',desc:'Fire electrons, protons or alpha particles through electric, magnetic or crossed fields. Build a velocity selector.',
icon:'<path d="M10 90 H40 Q80 88 105 30" fill="none" stroke="currentColor" stroke-width="5"/><path d="M40 15 H110 M40 105 H110" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const isE=()=>pt.value==='e';
 const pt=LK.select(c,{label:'Particle',value:'e',options:Object.entries(PART).map(([k,v])=>[k,v.n]),on:()=>{ v.refresh(); Ef.refresh(); Bf.refresh(); fire(); }});
 const mode=LK.select(c,{label:'Field',value:'E',options:[['E','Electric field (plates)'],['B','Magnetic field (into page)'],['EB','Crossed E and B (velocity selector)']],on:()=>fire()});
 const v=LK.slider(c,{label:'Speed',min:1,max:100,step:1,value:30,fmt:x=>LK.sig(x*(isE()?1e5:1e4),2)+' m/s',on:()=>fire()});
 const Ef=LK.slider(c,{label:'E',min:0,max:100,step:1,value:40,fmt:x=>LK.sig(x*(isE()?5:90),3)+' V/m',on:()=>fire()});
 const Bf=LK.slider(c,{label:'B',min:0,max:100,step:1,value:40,fmt:x=>LK.sig(x*(isE()?2e-6:4e-4),2)+' T',on:()=>fire()});
 LK.button(c,'Fire',()=>fire(),'primary');
 LK.button(c,'Match v = E/B',()=>{ const p=sc(); if(p.B>0) v.set(Math.max(1,Math.min(100,Math.round((p.E/p.B)/(isE()?1e5:1e4))))); fire(); });
 const st=LK.stage(el,S,{ratio:0.56,minH:240});
 const ro=LK.readout(el,[['F','force on particle'],['a','acceleration'],['r','radius r = mv/BQ'],['sel','E/B'],['st','what happened']]);
 LK.note(el,'In a uniform electric field the force EQ is constant and in the same direction (towards the oppositely charged plate), so the path is a parabola, like a projectile. In a magnetic field the force BQv is always perpendicular to the velocity, so it acts as a centripetal force and the path is an arc of a circle of radius r = mv/BQ. In crossed fields only particles with v = E/B pass straight through, whatever their mass or charge. The arrows show the velocity (purple) and the force (pink).');
 const Lx=0.10, G=0.03; // plates 10 cm long, 6 cm apart
 const sc=()=>{ const ee=isE(); return {v:v.v*(ee?1e5:1e4), E:Ef.v*(ee?5:90), B:Bf.v*(ee?2e-6:4e-4)}; };
 let P0,trail,status,done;
 const fire=()=>{ const p=sc(); P0={x:-0.02,y:0,vx:p.v,vy:0}; trail=[[P0.x,P0.y]]; status='flying'; done=false; };
 fire();
 const acc=(x,y,vx,vy,p,par,m)=>{ let ax=0,ay=0; if(x>=0&&x<=Lx&&Math.abs(y)<=G){ if(m!=='B') ay-=par.q*p.E/par.m; if(m!=='E'){ ax+=-par.q*vy*p.B/par.m; ay+=par.q*vx*p.B/par.m; } } return [ax,ay]; };
 S.loop(dt=>{ const p=sc(), par=PART[pt.value], m=mode.value;
   const Pp=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h;
   const scale=Math.min(W/0.165,H/0.095), ox=(W-0.165*scale)/2+0.025*scale, oy=H/2; const X=q=>ox+q*scale, Y=q=>oy-q*scale;
   // advance (a crossing takes about 2.5 s on screen at any speed)
   if(!done&&dt>0){ const simT=dt*(Lx/p.v)/2.5, n=200, h=simT/n;
     for(let i=0;i<n;i++){ const [ax,ay]=acc(P0.x,P0.y,P0.vx,P0.vy,p,par,m); const mx=P0.x+P0.vx*h/2, my=P0.y+P0.vy*h/2, mvx=P0.vx+ax*h/2, mvy=P0.vy+ay*h/2; const [bx,by]=acc(mx,my,mvx,mvy,p,par,m);
       P0.vx+=bx*h; P0.vy+=by*h; P0.x+=mvx*h; P0.y+=mvy*h;
       if(m!=='B'&&P0.x>=0&&P0.x<=Lx&&Math.abs(P0.y)>=G){ P0.y=Math.sign(P0.y)*G; status='hit the '+(P0.y>0?'+':'−')+' plate'; done=true; break; }
       if(P0.x>0.14||P0.x<-0.03||Math.abs(P0.y)>0.047){ status=Math.abs(P0.y)<0.002&&P0.x>0.14?'passed straight through':P0.x<0?'turned back out of the field':'deflected out of the field'; done=true; break; } }
     trail.push([P0.x,P0.y]); if(trail.length>4000) trail.splice(1,1); }
   // field region
   x.fillStyle=Pp.soft; x.fillRect(X(0),Y(G),Lx*scale,2*G*scale);
   if(m!=='E'){ x.strokeStyle=Pp.muted; x.lineWidth=1.2; const nx=10, ny=5; for(let i=0;i<nx;i++) for(let j=0;j<ny;j++){ const cx=X(Lx*(i+0.5)/nx), cy=Y(G*(1-2*(j+0.5)/ny)); x.beginPath(); x.moveTo(cx-4,cy-4); x.lineTo(cx+4,cy+4); x.moveTo(cx+4,cy-4); x.lineTo(cx-4,cy+4); x.stroke(); }
     LK.text(x,'B into page ×',X(Lx),Y(G)-13,Pp.muted,{align:'right',size:11}); }
   if(m!=='B'){ x.fillStyle=Pp.brand; x.fillRect(X(0),Y(G)-8,Lx*scale,8); x.fillStyle=Pp.teal; x.fillRect(X(0),Y(-G),Lx*scale,8);
     LK.text(x,'+ plate',X(0),Y(G)-13,Pp.brand,{size:11,weight:700}); LK.text(x,'− plate',X(0),Y(-G)+22,Pp.teal,{size:11,weight:700});
     if(m==='E'){ x.strokeStyle=Pp.muted; x.setLineDash([3,4]); for(let i=1;i<6;i++){ LK.arrow(x,X(Lx*i/6),Y(G)+6,X(Lx*i/6),Y(-G)-6,Pp.line2,1.2,7); } x.setLineDash([]); LK.text(x,'E',X(Lx)+8,oy+4,Pp.muted,{size:12,weight:700}); } }
   LK.text(x,'10 cm',X(Lx/2),Y(-G)+(m==='B'?18:38),Pp.muted,{align:'center',size:10});
   // source
   x.fillStyle=Pp.ink2; x.fillRect(X(-0.025)-4,oy-7,14,14);
   // trail and particle
   x.strokeStyle=Pp.accent; x.lineWidth=2.5; x.beginPath(); trail.forEach((q,i)=>i?x.lineTo(X(q[0]),Y(q[1])):x.moveTo(X(q[0]),Y(q[1]))); x.stroke();
   const px=X(P0.x), py=Y(P0.y); x.fillStyle=Pp.deep; x.beginPath(); x.arc(px,py,6,0,7); x.fill();
   LK.text(x,par.q<0?'−':'+',px,py+4,'#fff',{align:'center',size:10,weight:700});
   if(!done){ const sp=Math.hypot(P0.vx,P0.vy)||1; LK.arrow(x,px,py,px+P0.vx/sp*34,py-P0.vy/sp*34,Pp.accent,2,8);
     const [ax,ay]=acc(P0.x,P0.y,P0.vx,P0.vy,p,par,m); const am=Math.hypot(ax,ay); if(am>0){ LK.arrow(x,px,py,px+ax/am*30,py-ay/am*30,Pp.brand,2.4,8); } }
   let F=m==='E'?Math.abs(par.q)*p.E:m==='B'?Math.abs(par.q)*p.B*p.v:Math.abs(par.q)*Math.abs(p.E-p.B*p.v); if(m==='EB'&&Math.abs(p.E-p.B*p.v)<1e-9*p.E) F=0;
   ro.set('F',(F?LK.sig(F,3):'0')+' N'+(m==='EB'?' (resultant)':'')); ro.set('a',LK.sig(F/par.m,3)+' m s⁻²'); ro.set('r',m==='E'?'– (no B field)':LK.sig(par.m*p.v/(Math.abs(par.q)*p.B||1e-30),3)+' m'); ro.set('sel',p.B>0?LK.sig(p.E/p.B,3)+' m/s':'–'); ro.set('st',status);
 });
 return ()=>S.dispose(); }};

/* ---------- Force on a wire ---------- */
L.bfield={title:'Magnetic force on a wire',cat:'Fields & particles',topic:'6.3',desc:'A current balance: change B, I, L and angle; see F = BIL sin θ and Fleming’s left-hand rule.',
icon:'<rect x="20" y="20" width="25" height="80" fill="currentColor"/><rect x="75" y="20" width="25" height="80" fill="none" stroke="currentColor" stroke-width="5"/><path d="M60 5 V115" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const B=LK.slider(c,{label:'B',min:0,max:0.5,step:0.01,value:0.2,fmt:v=>v.toFixed(2)+' T'}), I=LK.slider(c,{label:'Current',min:-5,max:5,step:0.1,value:3,fmt:v=>v.toFixed(1)+' A'}), Lw=LK.slider(c,{label:'Length in field',min:0.02,max:0.1,step:0.005,value:0.05,fmt:v=>(v*100).toFixed(1)+' cm'}), th=LK.slider(c,{label:'Angle to field',min:0,max:90,step:1,value:90,fmt:v=>v+'°'});
 const st=LK.stage(el,S,{ratio:0.48});
 const ro=LK.readout(el,[['F','F = BIL sin θ'],['dm','balance reading change'],['dir','force direction']]);
 LK.note(el,'Magnets sit on a top-pan balance and a fixed wire passes between their poles. The upward/downward force on the wire produces an equal and opposite force on the magnets (Newton III), changing the balance reading by Δm = F/g. Use this to find B (PAG 11.3 style). Fleming’s left-hand rule: First finger Field, seCond finger Current, thuMb Motion.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const F=-B.v*I.v*Lw.v*Math.sin(th.v*Math.PI/180); /* + = upward force on wire */
   x.fillStyle=P.ink2; x.fillRect(W*0.15,H*0.82,W*0.5,H*0.12); LK.text(x,LK.fx(150+F/9.81*1000,2)+' g',W*0.4,H*0.9,P.surface,{align:'center',weight:700,size:14});
   x.fillStyle=P.brand; x.fillRect(W*0.18,H*0.25,W*0.12,H*0.55); x.fillStyle=P.teal; x.fillRect(W*0.48,H*0.25,W*0.12,H*0.55); LK.text(x,'N',W*0.24,H*0.55,'#fff',{align:'center',weight:700,size:16}); LK.text(x,'S',W*0.54,H*0.55,'#fff',{align:'center',weight:700,size:16});
   for(let i=0;i<5;i++) LK.arrow(x,W*0.31,H*(0.32+i*0.1),W*0.47,H*(0.32+i*0.1),P.muted,1.2,6);
   const cx=W*0.39, cy=H*0.52; x.strokeStyle=P.ink; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,10,0,7); x.stroke(); if(I.v>0){ x.beginPath(); x.moveTo(cx-6,cy-6); x.lineTo(cx+6,cy+6); x.moveTo(cx+6,cy-6); x.lineTo(cx-6,cy+6); x.stroke(); } else if(I.v<0){ x.fillStyle=P.ink; x.beginPath(); x.arc(cx,cy,3,0,7); x.fill(); }
   if(Math.abs(F)>1e-6) LK.arrow(x,cx,cy-14*Math.sign(F)*-1,cx,cy+Math.sign(F)*Math.min(90,Math.abs(F)*800)*-1,P.accent,3,11);
   ['Wire seen end-on:','⊗ current into page','⊙ current out of page'].forEach((s,i)=>LK.text(x,s,W*0.66,H*0.3+i*16,P.muted,{size:11}));
   ro.set('F',LK.sig(Math.abs(F),3)+' N'); ro.set('dm',(F<0?'−':'+')+LK.fx(Math.abs(F)/9.81*1000,2)+' g'); ro.set('dir',Math.abs(F)<1e-9?'none':F>0?'up (on wire)':'down (on wire)');
 });
 return ()=>S.dispose(); }};

/* ---------- Induction ---------- */
L.induction={title:'Electromagnetic induction',cat:'Fields & particles',topic:'6.3',desc:'Drop a magnet through a coil, or spin a generator coil. Watch flux linkage and the induced e.m.f. (Faraday and Lenz).',
icon:'<path d="M30 30 Q60 15 90 30 M30 50 Q60 35 90 50 M30 70 Q60 55 90 70 M30 90 Q60 75 90 90" fill="none" stroke="currentColor" stroke-width="4"/><rect x="50" y="2" width="20" height="40" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const mode=LK.select(c,{label:'Experiment',value:'drop',options:[['drop','Magnet falling through coil'],['gen','a.c. generator (rotating coil)']],on:()=>reset()});
 const N=LK.slider(c,{label:'Turns N',min:50,max:500,step:10,value:200}), sp=LK.slider(c,{label:'Speed (drop height or rotation rate)',min:1,max:10,step:0.5,value:4});
 const Bv=LK.slider(c,{label:'B (generator)',min:0.05,max:0.5,step:0.01,value:0.2,fmt:v=>v.toFixed(2)+' T'});
 LK.button(c,'Start again',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.36});
 const ro=LK.readout(el,[['phi','flux linkage Nφ'],['emf','induced e.m.f.'],['pk','peak e.m.f.']]);
 const pl=LK.plot(el,S,{xlab:'t / s',ylab:'e.m.f. / V and Nφ (scaled)',ratio:0.36});
 LK.note(el,'ε = −Δ(Nφ)/Δt. For the falling magnet the second pulse is larger and shorter because the magnet is moving faster, and opposite in sign (Lenz). The areas of the two pulses are equal. For the generator, Nφ = BAN cos ωt and ε = BANω sin ωt: doubling the speed doubles both the peak e.m.f. and the frequency.');
 let t,y,vy,data,pk,prevL,fin,plotted=false; const Y0=-0.34, YEND=0.36; const reset=()=>{ t=0; y=Y0; vy=Math.sqrt(2*9.81*sp.v*0.02); data=[]; pk=0; prevL=null; fin=false; plotted=false; }; reset();
 [N,sp,Bv].forEach(s_=>s_.input.addEventListener('change',()=>reset()));
 S.loop(dt=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; let NL=0,emf=0; const h=dt*0.25;
   if(mode.value==='drop'){
     // the run ends once the magnet has fallen clear of the coil: time, data and graph freeze
     if(!fin && h>0){ vy+=9.81*h; y+=vy*h; t+=h; if(y>=YEND){ y=YEND; fin=true; } }
     const phi=1e-4/Math.pow(1+(y/0.03)**2,1.5); NL=N.v*phi; if(!fin && h>0){ if(prevL!==null) emf=-(NL-prevL)/h; prevL=NL; } else emf=data.length?data[data.length-1][1]:0;
     if(fin) emf=0;
     const cx=W*0.28, cy=H/2, sc=(H/2-34)/YEND, my=cy+y*sc;
     // coil: back halves, magnet, front halves (so the magnet passes through the middle)
     x.lineWidth=3; x.strokeStyle=P.line2; for(let i=0;i<9;i++){ x.beginPath(); x.ellipse(cx,cy-24+i*6,38,8,0,Math.PI,2*Math.PI); x.stroke(); }
     x.fillStyle=P.brand; x.fillRect(cx-10,my-30,20,30); x.fillStyle=P.teal; x.fillRect(cx-10,my,20,30); LK.text(x,'N',cx,my-11,'#fff',{align:'center',weight:700}); LK.text(x,'S',cx,my+19,'#fff',{align:'center',weight:700});
     x.strokeStyle=P.accent; for(let i=0;i<9;i++){ x.beginPath(); x.ellipse(cx,cy-24+i*6,38,8,0,0,Math.PI); x.stroke(); }
     // leads to a data-logger with a live needle
     const lx=W*0.5, ly=cy-28; x.strokeStyle=P.ink2; x.lineWidth=1.5; x.beginPath(); x.moveTo(cx+38,cy-24); x.lineTo(lx,cy-24); x.moveTo(cx+38,cy+24); x.lineTo(lx,cy+24); x.stroke();
     x.fillStyle=P.surface; x.strokeStyle=P.ink2; LK.rr(x,lx,ly-8,110,72,8); x.fill(); x.stroke(); LK.text(x,'data-logger',lx+55,ly+6,P.muted,{align:'center',size:11});
     const mE=Math.max(pk,1e-4); const ang=Math.max(-1,Math.min(1,emf/mE))*1.1; x.strokeStyle=P.brand; x.lineWidth=3; x.beginPath(); x.moveTo(lx+55,ly+56); x.lineTo(lx+55+Math.sin(ang)*30,ly+56-Math.cos(ang)*30); x.stroke(); LK.text(x,'0',lx+55,ly+20,P.muted,{align:'center',size:10});
     const msg = fin ? 'Finished: the magnet has fallen through. Press Start again to drop it again.' : (y<-0.06 ? 'Magnet approaching: flux through the coil is increasing' : (y<0.06 ? 'Magnet inside the coil: flux is at its maximum, e.m.f. passes through zero' : 'Magnet leaving faster: flux decreasing, so the e.m.f. reverses (Lenz)'));
     LK.text(x,msg,W*0.5,H-8,fin?P.brand:P.ink,{align:'left',size:12,weight:fin?700:400,mono:false});
     LK.text(x,'Falling from '+(sp.v*2).toFixed(0)+' cm above the coil',W*0.98,16,P.muted,{align:'right',size:11});
   }
   else { const w=sp.v*2; t+=dt; const A=0.01; NL=Bv.v*A*N.v*Math.cos(w*t); emf=Bv.v*A*N.v*w*Math.sin(w*t); const cx=W*0.3, cy=H/2; x.fillStyle=P.brand; x.fillRect(cx-110,cy-50,30,100); x.fillStyle=P.teal; x.fillRect(cx+80,cy-50,30,100); x.strokeStyle=P.accent; x.lineWidth=4; x.beginPath(); x.ellipse(cx,cy,Math.abs(Math.cos(w*t))*60+2,45,0,0,7); x.stroke(); LK.text(x,'N',cx-95,cy+5,'#fff',{align:'center',weight:700}); LK.text(x,'S',cx+95,cy+5,'#fff',{align:'center',weight:700}); }
   const recording = mode.value!=='drop' ? dt>0 : (!fin && h>0);
   if(recording){ pk=Math.max(pk,Math.abs(emf)); data.push([t,emf,NL]); if(data.length>(mode.value==='drop'?3000:500)) data.shift(); }
   ro.set('phi',LK.sig(NL,3)+' Wb-turns'); ro.set('emf',LK.sig(emf,3)+' V'); ro.set('pk',LK.sig(pk,3)+' V');
   if(data.length>2&&(recording||!plotted)){ plotted=!recording; const mN=Math.max(...data.map(d=>Math.abs(d[2])))||1, mE=Math.max(...data.map(d=>Math.abs(d[1])))||1; pl.set([{pts:data.map(d=>[d[0],d[1]]),color:P.brand,name:'e.m.f.'},{pts:data.map(d=>[d[0],d[2]/mN*mE]),color:P.teal,dash:[5,4],name:'Nφ (scaled)'}],{xmin:data[0][0],legend:true}); }
 });
 return ()=>S.dispose(); }};

/* ---------- Transformer ---------- */
L.transformer={title:'Transformer',cat:'Fields & particles',topic:'6.3',desc:'Change the turns ratio and load. See step-up and step-down, currents and why power lines use high voltage.',
icon:'<rect x="25" y="25" width="70" height="70" fill="none" stroke="currentColor" stroke-width="10"/><path d="M15 40 H35 M15 55 H35 M15 70 H35 M85 35 H105 M85 50 H105 M85 65 H105 M85 80 H105" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const Np=LK.slider(c,{label:'Primary turns',min:10,max:1000,step:10,value:100}), Ns=LK.slider(c,{label:'Secondary turns',min:10,max:2000,step:10,value:500});
 const Vp=LK.slider(c,{label:'V_p (a.c. r.m.s.)',min:1,max:240,step:1,value:12,fmt:v=>v+' V'}), RL=LK.slider(c,{label:'Load',min:5,max:1000,step:5,value:200,fmt:v=>v+' Ω'});
 const eff=LK.slider(c,{label:'Efficiency',min:50,max:100,step:1,value:100,fmt:v=>v+'%'});
 const st=LK.stage(el,S,{ratio:0.42});
 const ro=LK.readout(el,[['vs','V_s'],['is','I_s'],['ip','I_p'],['p','P_out'],['type','type']]);
 LK.note(el,'Ideal transformer: n_s/n_p = V_s/V_p = I_p/I_s. A changing current in the primary makes a changing flux in the laminated iron core, which induces an e.m.f. in the secondary. It only works with a.c. Step up the voltage for transmission so the current, and the I²R losses, are smaller.');
 let t=0; S.loop(dt=>{ t+=dt; const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const Vs=Vp.v*Ns.v/Np.v, Is=Vs/RL.v, Ip=Vs*Is/(Vp.v*eff.v/100);
   x.strokeStyle=P.ink2; x.lineWidth=18; x.strokeRect(W*0.3,H*0.18,W*0.4,H*0.64); x.lineWidth=1; for(let i=0;i<10;i++){ x.strokeStyle=P.line2; x.beginPath(); x.moveTo(W*0.3-9,H*0.18-9+i*1.5); x.stroke(); }
   const coil=(cx,n,col)=>{ x.strokeStyle=col; x.lineWidth=3; const k=Math.min(18,Math.max(3,Math.round(n/40))); for(let i=0;i<k;i++){ const yy=H*0.3+i*(H*0.4/k); x.beginPath(); x.ellipse(cx,yy,18,5,0,0,Math.PI*2); x.stroke(); } };
   coil(W*0.3,Np.v,P.brand); coil(W*0.7,Ns.v,P.teal);
   const ph=Math.sin(t*6); for(let i=0;i<4;i++){ const a=(t*0.8+i/4)%1; const px=W*0.3+a*W*0.4; x.fillStyle=P.accent; x.globalAlpha=0.5+0.5*Math.abs(ph); x.beginPath(); x.arc(px,H*0.18,4,0,7); x.arc(W*0.7-a*W*0.4,H*0.82,4,0,7); x.fill(); x.globalAlpha=1; }
   LK.text(x,'V_p = '+Vp.v+' V',W*0.1,H*0.5,P.brand,{weight:700}); LK.text(x,'V_s = '+LK.sig(Vs,3)+' V',W*0.76,H*0.5,P.teal,{weight:700});
   ro.set('vs',LK.sig(Vs,3)+' V'); ro.set('is',LK.sig(Is,3)+' A'); ro.set('ip',LK.sig(Ip,3)+' A'); ro.set('p',LK.sig(Vs*Is,3)+' W'); ro.set('type',Ns.v>Np.v?'step-up':Ns.v<Np.v?'step-down':'1 : 1');
 });
 return ()=>S.dispose(); }};
})();
