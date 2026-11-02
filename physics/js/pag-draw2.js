/* PAG drawings, part 2 (see pag-draw.js for helpers) */
(function(){
'use strict';
const LK=window.LK, H=window.PAGH, D=window.PAGDRAW;
const T=H.T, cl=H.cl, seg=H.seg, ease=H.ease, now=()=>performance.now()/1000;
const measOf=id=>window.PAGS.list.find(q=>q.id===id).sim.meas;

/* ===== PAG 6.3  Malus's law ===== */
D['p6-3']={dur:3.8,reveal:0.74,
 idle:'Light passes through a fixed polariser, then a rotating analyser, onto a light sensor. Choose the analyser angle, then press Take reading.',
 steps:[[0,'Unpolarised light from the lamp: its vibrations are in every direction'],[0.12,'The polariser lets through only vertical vibrations'],[0.3,'Rotate the analyser to angle θ: only the part of the vibration along its axis gets through'],[0.74,'Read the light sensor. Intensity ∝ cos²θ (subtract the background reading)']],
 draw(x,P,st){ const th=st.xv, a=st.a; const busy=st.busy||st.show; const thc= st.busy? th*ease(seg(a,0.3,0.68)) : (st.show?th:0); const r=Math.PI/180; const I=Math.cos(thc*r)**2; const cy=150;
  x.fillStyle=P.ink2; LK.rr(x,14,cy-22,56,44,8); x.fill(); x.fillStyle='rgba(255,210,90,0.9)'; x.beginPath(); x.arc(70,cy,10,-Math.PI/2,Math.PI/2); x.fill(); T(x,'lamp',42,cy+38,P.ink2,{size:11,align:'center'});
  const band=(x0,x1,al)=>{ x.fillStyle=`rgba(255,200,80,${al})`; x.fillRect(x0,cy-14,x1-x0,28); };
  if(busy){ band(80,150,0.55); band(162,270,0.32); band(282,368,0.32*I+0.02); }
  const vib=(cx,ang,len,col)=>{ x.save(); x.translate(cx,cy); x.rotate(ang); LK.arrow(x,0,0,0,-len,col,2.2,7); LK.arrow(x,0,0,0,len,col,2.2,7); x.restore(); };
  if(busy){ for(let k=0;k<4;k++) vib(112,k*Math.PI/4,20,P.accent); vib(215,0,22,P.accent); vib(325,thc*r,22*Math.cos(thc*r),P.accent); }
  const filt=(cx,ang,label)=>{ x.save(); x.translate(cx,cy); x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.ellipse(0,0,10,48,0,0,7); x.fill(); x.stroke(); x.restore(); x.save(); x.translate(cx,cy); x.rotate(ang); x.strokeStyle=P.brand; x.lineWidth=1.2; for(let i=-3;i<=3;i++){ x.beginPath(); x.moveTo(i*2.6,-36); x.lineTo(i*2.6,36); x.stroke(); } x.restore(); T(x,label,cx,cy+72,P.ink2,{size:11.5,align:'center',weight:700}); };
  filt(156,0,'polariser'); filt(276,thc*r,'analyser');
  x.strokeStyle=P.ink2; x.lineWidth=1.5; x.beginPath(); x.arc(276,cy,62,-Math.PI/2-0.01,-Math.PI/2+thc*r); x.stroke(); T(x,'θ = '+thc.toFixed(0)+'°',276,cy-72,P.brand,{size:14,weight:700,align:'center'});
  x.fillStyle=P.ink2; LK.rr(x,372,cy-16,30,32,5); x.fill(); T(x,'light sensor',387,cy+34,P.ink2,{size:11,align:'center'});
  H.wire(x,P,[[402,cy],[420,cy],[420,262],[396,262]],P.ink2,1.5); H.meter(x,P,300,236,busy?(400*I+12).toFixed(0)+' lux':'— lux','data-logger',{hot:st.busy&&a>0.68});
  T(x,'unpolarised',112,cy+56,P.muted,{size:10.5,align:'center'}); T(x,'vertically polarised',215,cy+56,P.muted,{size:10.5,align:'center'}); } };

/* ===== PAG 7.2  gamma absorption ===== */
D['p7-2']={dur:4.4,reveal:0.86,
 idle:'A sealed gamma source faces a GM tube a fixed distance away. Lead sheets go in between. Choose the lead thickness, then press Take reading.',
 steps:[[0,'Using tongs, put lead sheets of the chosen total thickness in the holder'],[0.15,'Gamma photons travel from the source; some are absorbed by the lead'],[0.2,'The GM tube and counter count the photons that get through for a fixed time'],[0.86,'Subtract the background count. Corrected count rate C = C₀ e^(−μx)']],
 draw(x,P,st){ const t=st.xv, a=st.a; const busy=st.busy||st.show; const cy=160; const pass=Math.exp(-0.055*t);
  x.fillStyle=P.ink2; LK.rr(x,30,cy-20,50,40,6); x.fill(); x.fillStyle='#e0245e'; x.beginPath(); x.arc(80,cy,6,0,7); x.fill(); T(x,'gamma source',55,cy+38,P.ink2,{size:11,align:'center',weight:700}); T(x,'(sealed — use tongs)',55,cy+52,P.muted,{size:10.5,align:'center'});
  x.fillStyle=P.ink2; x.fillRect(16,cy-4,14,8); // handle
  const nS=Math.round(t/2.5), lw=Math.max(0,nS*3); x.fillStyle='#8a8fa0'; for(let i=0;i<nS;i++){ x.fillRect(180+i*3.2,cy-55,2.6,110); } x.strokeStyle=P.ink2; x.lineWidth=1.5; x.strokeRect(176,cy-60,Math.max(12,lw+8),120); T(x,'lead: '+t.toFixed(1)+' mm',180+lw/2,cy-68,P.ink,{size:12,weight:700,align:'center'});
  x.fillStyle=P.ink2; LK.rr(x,320,cy-14,80,28,10); x.fill(); x.fillStyle=P.line2; x.fillRect(312,cy-10,10,20); T(x,'GM tube',360,cy+34,P.ink2,{size:11,align:'center',weight:700});
  H.dim(x,P,84,cy+80,312,cy+80,'fixed distance',{dy:-6,col:P.muted});
  if(st.busy&&a>0.12&&a<0.88){ const T0=now(); for(let k=0;k<26;k++){ const ph=((T0*0.9+k*0.137)%1); const yy=cy+((k*37)%30-15); const stopX = (k%100)/100<pass ? 330 : 180+lw*((k*13)%10)/10; const px=86+ph*(330-86); if(px>stopX) continue; x.fillStyle=px>176&&px<180+lw?'#e0245e':P.brand; x.beginPath(); x.arc(px,yy,2.4,0,7); x.fill(); } }
  const cnt= st.busy? Math.round(st.y*2*seg(a,0.2,0.86)) : (st.show?Math.round(st.ys[0]*2):0); H.meter(x,P,330,40,String(cnt),'counter (2 min)',{w:110,hot:st.busy&&a>0.86}); H.wire(x,P,[[400,cy],[440,cy],[440,66]],P.ink2,1.5);
  if(busy) T(x,'≈ '+Math.round(pass*100)+'% of photons get through',230,cy+120,P.muted,{size:11.5,align:'center'}); },
 extra:st=>st.show?[['rate',st.ys[0].toFixed(0)+' /min']]:null };

/* ===== PAG 7.3  protactinium half-life ===== */
D['p7-3']={dur:4,reveal:0.8,
 idle:'A sealed bottle has two liquid layers. Shaking it moves protactinium-234m into the top layer. Choose the time since shaking, then press Take reading.',
 steps:[[0,'Shake the bottle and start the stopwatch. Let the layers separate'],[0.25,'Point the GM tube at the top layer, which now holds the protactinium'],[0.4,'Count for 10 s starting at the chosen time'],[0.8,'Corrected count rate = counts ÷ 10 s − background. It halves every half-life']],
 draw(x,P,st){ const ts=st.xv, a=st.a; const busy=st.busy||st.show; const shake= st.busy&&a<0.22? Math.sin(now()*30)*0.18*(1-a/0.22):0; const sep= st.busy? seg(a,0.05,0.25):1;
  const bx=140, by=110, bw=90, bh=180; x.save(); x.translate(bx+bw/2,by+bh); x.rotate(shake); x.translate(-(bx+bw/2),-(by+bh));
  x.fillStyle=P.line; x.fillRect(bx+28,by-26,34,26); x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2.5; LK.rr(x,bx,by,bw,bh,10); x.fill(); x.stroke();
  const mid=by+bh*0.5; if(sep<1){ x.fillStyle='rgba(200,170,90,0.45)'; x.fillRect(bx+3,by+30,bw-6,bh-33); } else { x.fillStyle='rgba(240,200,80,0.55)'; x.fillRect(bx+3,by+30,bw-6,mid-by-30); x.fillStyle=P.tealSoft; x.fillRect(bx+3,mid,bw-6,by+bh-3-mid); }
  x.restore();
  T(x,'top layer:',bx-10,by+60,P.ink2,{size:11,align:'right',weight:700}); T(x,'protactinium',bx-10,by+74,P.ink2,{size:11,align:'right'}); T(x,'bottom layer',bx-10,by+bh-30,P.muted,{size:11,align:'right'});
  x.fillStyle=P.ink2; LK.rr(x,bx+bw+30,by+40,90,26,10); x.fill(); x.fillStyle=P.line2; x.fillRect(bx+bw+22,by+44,10,18); T(x,'GM tube',bx+bw+75,by+86,P.ink2,{size:11,align:'center',weight:700});
  const rate=40*Math.exp(-Math.LN2*ts/70); if(st.busy&&a>0.4&&a<0.8){ for(let k=0;k<Math.round(rate/3);k++){ const ph=(now()*1.3+k*0.29)%1; x.fillStyle=P.brand; x.beginPath(); x.arc(bx+bw-4+ph*28,by+48+((k*7)%14)-7+8,2.2,0,7); x.fill(); } }
  const sw = st.busy? (a<0.25? 0 : ts+10*seg(a,0.4,0.8)) : ts; H.stopwatch(x,P,400,240,sw,{dp:0,label:'time since shaking',hot:st.busy&&a>0.4&&a<0.8});
  const cnt= st.busy? Math.round(st.y*10*seg(a,0.4,0.8)) : (st.show?Math.round(st.ys[0]*10):0); H.meter(x,P,330,30,String(cnt),'counts in 10 s',{w:110,hot:st.busy&&a>0.8}); H.wire(x,P,[[bx+bw+120,by+53],[440,by+53],[440,82]],P.ink2,1.5); } };

/* ===== PAG 8.1  absolute zero ===== */
D['p8-1']={dur:4,reveal:0.8,
 idle:'A flask of air sits completely under water, connected by short tubing to a pressure gauge. Choose the bath temperature, then press Take reading.',
 steps:[[0,'Heat the water bath (or add ice) to the chosen temperature'],[0.3,'Stir and wait: the air in the flask must reach the water temperature'],[0.55,'The trapped air pushes harder as it warms, so the gauge reading rises'],[0.8,'Record θ and p. Extrapolating p against θ back to p = 0 gives absolute zero']],
 draw(x,P,st){ const th=st.xv, a=st.a; const busy=st.busy||st.show; const t0=st.prevX!=null?st.prevX:20; const tc= st.busy? t0+(th-t0)*ease(seg(a,0.02,0.5)) : th; const pc=measOf('p8-1')(st.busy? t0+(th-t0)*ease(seg(a,0.2,0.75)) : th);
  const bx=60,by=80,bw=250,bh=220; H.bench(x,P,by+bh+18); const hot=cl(th/90,0,1)*cl((tc-0)/90,0,1)/Math.max(0.01,cl(th/90,0,1)); x.fillStyle=`rgba(${Math.round(120+135*cl(tc/90,0,1))},${Math.round(180-80*cl(tc/90,0,1))},${Math.round(230-150*cl(tc/90,0,1))},0.42)`; x.fillRect(bx,by+20,bw,bh-20); H.beaker(x,P,bx,by,bw,bh);
  const fx=170, fy=210; x.fillStyle='rgba(255,255,255,0.55)'; x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.arc(fx,fy,52,0,7); x.fill(); x.stroke(); x.fillRect(fx-9,fy-120,18,72); x.strokeRect(fx-9,fy-120,18,72);
  for(let k=0;k<14;k++){ const sp=0.5+tc/60; const ang=k*2.3+now()*sp*(1+k%3); x.fillStyle=P.brand; x.beginPath(); x.arc(fx+Math.cos(ang)*(20+(k*7)%26),fy+Math.sin(ang*1.3)*(18+(k*5)%22),2.4,0,7); x.fill(); }
  T(x,'air in flask',fx,fy+4,P.ink2,{size:11,align:'center',weight:700});
  H.wire(x,P,[[fx,fy-120],[fx,by-30],[360,by-30],[360,by-6]],P.ink2,4); H.dial(x,P,380,by+30,34,(pc-90)/50,'kPa',{val:busy?pc.toFixed(1)+' kPa':'',hot:st.busy&&a>0.75});
  T(x,'pressure gauge',380,by+108,P.ink2,{size:11,align:'center'});
  H.thermo(x,P,bx+220,by-30,by+bh-30,tc/100,{label:tc.toFixed(0)+' °C'});
  if(st.busy&&a>0.25&&a<0.8) T(x,'stir… wait for steady readings',bx+bw/2,by+bh+40,P.muted,{size:11.5,align:'center'}); } };

/* ===== PAG 8.2  Boyle's law ===== */
D['p8-2']={dur:4,reveal:0.8,
 idle:'Air is trapped above a column of oil in a sealed glass tube. A pump pushes the oil up. Choose the volume, then press Take reading.',
 steps:[[0,'Use the pump to push oil up the tube, squashing the trapped air'],[0.4,'Wait about a minute so the air returns to room temperature'],[0.65,'Read the volume of air from the scale and the pressure from the gauge'],[0.8,'p × V stays (almost) constant: p ∝ 1/V']],
 draw(x,P,st){ const V=st.xv, a=st.a; const busy=st.busy||st.show; const V0=st.prevX!=null?st.prevX:50; const Vc= st.busy? V0+(V-V0)*ease(seg(a,0.03,0.4)) : V; const p=100*50/Vc;
  const tx=170, top=40, sc=4.4, tw=34; const yOil=top+Vc*sc; H.bench(x,P,326);
  x.fillStyle='rgba(255,255,255,0.4)'; x.fillRect(tx,top,tw,yOil-top); x.fillStyle='rgba(230,170,40,0.75)'; x.fillRect(tx,yOil,tw,300-yOil); x.strokeStyle=P.ink2; x.lineWidth=2.5; x.strokeRect(tx,top,tw,300-top);
  for(let k=0;k<10;k++){ const ph=now()*(1+k%3)+k; x.fillStyle=P.brand; x.beginPath(); x.arc(tx+6+((Math.sin(ph)+1)/2)*(tw-12),top+6+((Math.cos(ph*1.3)+1)/2)*(yOil-top-12),2.2,0,7); x.fill(); }
  T(x,'trapped air',tx-10,top+20,P.ink2,{size:11,align:'right',weight:700}); T(x,'oil',tx-10,yOil+24,'#b07a10',{size:11,align:'right',weight:700});
  for(let v=0;v<=55;v+=5){ const y=top+v*sc; if(y>300) break; x.strokeStyle=P.ink2; x.lineWidth=1; x.beginPath(); x.moveTo(tx+tw,y); x.lineTo(tx+tw+(v%10?6:12),y); x.stroke(); if(v%10===0) T(x,String(v),tx+tw+16,y+4,P.ink2,{size:10}); } T(x,'volume / cm³',tx+tw+8,top-10,P.muted,{size:10.5});
  H.wire(x,P,[[tx+tw/2,300],[tx+tw/2,316],[330,316],[330,250]],P.ink2,4); x.fillStyle=P.line2; x.fillRect(318,190,24,60); const pump= st.busy&&a<0.4? Math.abs(Math.sin(now()*6))*20:0; x.fillStyle=P.ink2; x.fillRect(326,150+pump,8,42); x.fillRect(312,146+pump,36,6); T(x,'pump',355,230,P.ink2,{size:11});
  H.wire(x,P,[[tx+tw/2,top],[tx+tw/2,26],[400,26],[400,46]],P.ink2,3); H.dial(x,P,400,82,34,(p-90)/180,'kPa',{val:busy?p.toFixed(1)+' kPa':'',hot:st.busy&&a>0.65});
  if(st.busy&&a>0.4&&a<0.65) T(x,'waiting for temperature to settle…',230,334,P.muted,{size:11.5,align:'center'}); } ,
 extra:st=>st.show?[['p × V',(st.ys[0]*st.xv).toFixed(0)]]:null };

/* ===== PAG 9.1  capacitor discharge ===== */
D['p9-1']={dur:4.6,reveal:0.84,
 idle:'A 470 μF capacitor is charged by the supply, then discharged through a 47 kΩ resistor. Choose the time, then press Take reading.',
 steps:[[0,'Switch to A: the supply charges the capacitor to 9 V'],[0.2,'Switch to B and start the stopwatch: charge flows off the capacitor through the resistor'],[0.3,'The p.d. falls quickly at first, then more slowly (exponential decay)'],[0.84,'At the chosen time, read the voltmeter']],
 draw(x,P,st){ const tt=st.xv, a=st.a; const busy=st.busy||st.show; const sB=st.busy? a>0.2 : true; const tNow= st.busy? (a<0.2?0: tt*seg(a,0.25,0.84)) : tt; const V= st.busy? (a<0.2? 9*Math.min(1,a/0.12) : 9*Math.exp(-tNow/22.09)) : (st.show? st.ys[0] : 9);
  const X0=40, Xm=170, X1=330, Y0=60, Y1=260; H.wire(x,P,[[Xm-20,Y0],[X0,Y0],[X0,Y1],[X1,Y1],[X1,Y0],[Xm+20,Y0]]); H.wire(x,P,[[Xm,Y1],[Xm,Y0+40]]);
  H.sym.supply(x,P,X0,(Y0+Y1)/2,'9 V d.c.'); x.fillStyle=P.ink2; [[Xm-20,Y0],[Xm+20,Y0]].forEach(p=>{ x.beginPath(); x.arc(p[0],p[1],3,0,7); x.fill(); }); x.beginPath(); x.arc(Xm,Y0+40,3,0,7); x.fill();
  x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.moveTo(Xm,Y0+40); x.lineTo(sB?Xm+20:Xm-20,Y0+2); x.stroke(); T(x,'A',Xm-24,Y0-8,P.ink2,{size:12,weight:700,align:'center'}); T(x,'B',Xm+24,Y0-8,P.ink2,{size:12,weight:700,align:'center'}); T(x,'two-way switch',Xm,Y0-26,P.muted,{size:10.5,align:'center'});
  H.sym.cap(x,P,Xm,(Y0+40+Y1)/2,true); T(x,'C = 470 μF',Xm-22,(Y0+40+Y1)/2+4,P.ink,{size:12,weight:700,align:'right'}); H.sym.res(x,P,X1,(Y0+Y1)/2,true); T(x,'R = 47 kΩ',X1+26,(Y0+Y1)/2+4,P.ink,{size:12,weight:700,align:'left'});
  const cy=(Y0+40+Y1)/2; H.wire(x,P,[[Xm,cy-30],[Xm+60,cy-30],[Xm+60,cy+30],[Xm,cy+30]]); H.sym.meter(x,P,Xm+60,cy,'V',{val:V.toFixed(2)+' V',vx:18,va:'left',vy:4,hot:st.busy&&a>0.84});
  if(st.busy&&a>0.2&&V>0.3) H.flow(x,P,[[Xm,Y0+40],[Xm+20,Y0],[X1,Y0],[X1,Y1],[Xm,Y1]],now()*cl(V/9,0.15,1),P.brand,true);
  if(st.busy&&a<0.2) H.flow(x,P,[[X0,Y1],[X0,Y0],[Xm-20,Y0],[Xm,Y0+40]],now(),P.brand,true);
  H.stopwatch(x,P,410,70,tNow,{dp:1,label:'stopwatch',hot:st.busy&&a>0.84}); } };

/* ===== PAG 10.1  SHM period ===== */
D['p10-1']={dur:5,reveal:0.86,
 idle:'A mass hangs on a spring. A pin marks the equilibrium position. Choose the mass, then press Take reading.',
 steps:[[0,'Pull the mass down a small distance and let go'],[0.1,'Start timing as the mass passes the marker (fiducial pin) going down'],[0.12,'Count 10 complete oscillations — each one is back to the marker, moving the same way'],[0.86,'Stop timing. Period T = time ÷ 10']],
 draw(x,P,st){ const m=st.xv, a=st.a; const busy=st.busy||st.show; const top=30, eq=150+m*120; H.bench(x,P,322); H.stand(x,P,70,322,18); H.arm(x,P,70,top,200);
  let disp=0, osc=0; if(st.busy){ if(a<0.1) disp=40*seg(a,0,0.08); else { const f=seg(a,0.1,0.86); osc=f*10; disp=40*Math.cos(2*Math.PI*osc)*(a<0.86?1:0.0); if(a>=0.86) disp=40*Math.cos(2*Math.PI*10)*Math.exp(-(a-0.86)*10); } }
  const ym=eq+disp; x.strokeStyle=P.brand; x.lineWidth=2; LK.spring(x,200,top,200,ym,12,10); const n=Math.round(m/0.05); H.mass(x,P,200,ym,Math.min(10,n));
  x.fillStyle=P.accent; x.fillRect(240,eq+20,40,3); x.beginPath(); x.arc(240,eq+21,4,0,7); x.fill(); T(x,'fiducial marker',286,eq+25,P.accent,{size:11,weight:700});
  const count= st.busy? Math.min(10,Math.floor(osc+1e-6)) : (st.show?10:0); T(x,'oscillations counted: '+count,290,60,P.ink,{size:13,weight:700});
  const tm= st.busy? (a<0.1?0: st.y*seg(a,0.1,0.86)) : (st.show?st.ys[0]:0); H.stopwatch(x,P,380,250,tm,{label:'time for 10',hot:st.busy&&a>0.86});
  T(x,'m = '+m.toFixed(2)+' kg',200,318-8,P.ink2,{size:12,align:'center',weight:700}); },
 extra:st=>st.show?[['T = t/10',(st.ys[0]/10).toFixed(3)+' s']]:null };

/* ===== PAG 10.2  forced oscillations ===== */
D['p10-2']={dur:5,reveal:0.84,
 idle:'A vibration generator shakes the top of a spring with a mass on the end. Choose the driving frequency, then press Take reading.',
 steps:[[0,'Set the signal generator to the chosen frequency: the vibration generator shakes the spring'],[0.1,'Wait: the mass’s oscillation grows until it is steady'],[0.6,'Measure the amplitude against the ruler: half the distance from the top to the bottom of the motion'],[0.84,'Biggest amplitude when the driving frequency equals the natural frequency (resonance)']],
 draw(x,P,st){ const f=st.xv, o=st.opt||'l', a=st.a; const busy=st.busy||st.show; const A=st.y; const sc=6; const vis=Math.min(2.2,f*1.5);
  H.bench(x,P,326); x.fillStyle=P.ink2; x.fillRect(150,10,100,8); H.box(x,P,170,18,60,30,P.line2,P.ink2,4); T(x,'vibration generator',260,36,P.ink2,{size:11});
  const amp= st.busy? A*(1-Math.exp(-6*seg(a,0.08,0.6))) : (st.show?A:0); const ph=now()*2*Math.PI*vis; const drv= busy? 3*Math.sin(ph):0;
  x.fillStyle=P.ink2; x.fillRect(198,48,4,14+drv); const sTop=62+drv, eq=200, ym=eq+amp*sc*Math.sin(ph-Math.PI/3);
  x.strokeStyle=P.brand; x.lineWidth=2; LK.spring(x,200,sTop,200,ym-20,12,10); H.box(x,P,182,ym-20,36,32,P.deep,null,4);
  if(o==='h'){ x.fillStyle=P.line; x.fillRect(150,ym+12,100,4); x.strokeStyle=P.ink2; x.lineWidth=1; x.strokeRect(150,ym+12,100,4); T(x,'card (more air resistance)',150,ym+30,P.muted,{size:10.5}); }
  x.fillStyle=P.surface; x.fillRect(290,90,26,220); x.strokeStyle=P.ink2; x.lineWidth=1; x.strokeRect(290,90,26,220); for(let cm=-18;cm<=18;cm++){ const y=eq+cm*sc; if(y<92||y>308) continue; x.beginPath(); x.moveTo(290,y); x.lineTo(290+(cm%5?5:10),y); x.stroke(); if(cm%10===0) T(x,String(cm),320,y+4,P.ink2,{size:10}); } T(x,'ruler / cm',303,82,P.muted,{size:10.5,align:'center'});
  if(busy&&amp>0.3){ x.fillStyle=P.soft; x.globalAlpha=0.5; x.fillRect(240,eq-amp*sc,46,2*amp*sc); x.globalAlpha=1; H.dim(x,P,262,eq,262,eq-amp*sc,'A',{align:'center',dx:-12}); }
  x.setLineDash([3,3]); x.strokeStyle=P.muted; x.beginPath(); x.moveTo(220,eq); x.lineTo(290,eq); x.stroke(); x.setLineDash([]);
  H.meter(x,P,24,60,f.toFixed(2)+' Hz','signal generator',{w:110}); H.wire(x,P,[[134,86],[170,86],[170,40]],P.ink2,1.5); } };

/* ===== PAG 11.1  transformer ===== */
D['p11-1']={dur:4,reveal:0.72,
 idle:'Two coils are wound on the same iron core. The primary (100 turns) is connected to a 6 V a.c. supply. Choose the secondary turns, then press Take reading.',
 steps:[[0,'Wind the secondary coil with the chosen number of turns on the other side of the iron core'],[0.2,'Switch on the a.c. supply: the alternating current in the primary makes an alternating magnetic field'],[0.4,'The iron core carries this changing magnetic flux round to the secondary coil'],[0.6,'The changing flux through the secondary induces an alternating p.d. V_s. Read the a.c. voltmeter']],
 draw(x,P,st){ const Ns=st.xv, a=st.a; const busy=st.busy||st.show; const on= st.busy? a>0.2 : st.show; const X0=120, X1=340, Y0=70, Y1=270, th=32;
  // iron core (square ring)
  x.fillStyle='#9aa0ae'; x.fillRect(X0,Y0,X1-X0,th); x.fillRect(X0,Y1-th,X1-X0,th); x.fillRect(X0,Y0,th,Y1-Y0); x.fillRect(X1-th,Y0,th,Y1-Y0); x.strokeStyle=P.ink2; x.lineWidth=1.5; x.strokeRect(X0,Y0,X1-X0,Y1-Y0); x.strokeRect(X0+th,Y0+th,X1-X0-2*th,Y1-Y0-2*th);
  x.strokeStyle='rgba(255,255,255,0.35)'; x.lineWidth=1; for(let i=4;i<th;i+=5){ x.beginPath(); x.rect(X0+i,Y0+i,X1-X0-2*i,Y1-Y0-2*i); x.stroke(); }
  T(x,'laminated iron core',(X0+X1)/2,Y0-10,P.ink2,{size:11.5,align:'center',weight:700});
  // flux arrows going round the core, reversing with the a.c.
  if(on){ const s=Math.sin(now()*2*Math.PI*0.8); const al=Math.abs(s); const dir=s>=0?1:-1; x.save(); x.globalAlpha=0.25+0.75*al; const c=P.teal; const mid=th/2; const L=[[X0+mid,Y1-mid],[X0+mid,Y0+mid],[X1-mid,Y0+mid],[X1-mid,Y1-mid],[X0+mid,Y1-mid]]; for(let i=0;i<4;i++){ const p=L[i], q=L[i+1]; const mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2; const dx=(q[0]-p[0])*0.12*dir, dy=(q[1]-p[1])*0.12*dir; LK.arrow(x,mx-dx,my-dy,mx+dx,my+dy,c,3,10); } x.restore(); T(x,'changing magnetic flux',(X0+X1)/2,(Y0+Y1)/2+4,P.teal,{size:11.5,align:'center',weight:700}); T(x,'(reverses with the a.c.)',(X0+X1)/2,(Y0+Y1)/2+20,P.muted,{size:10.5,align:'center'}); }
  // coils wrapped round the side limbs
  const coil=(cx,y0,y1,n,col)=>{ const k=Math.max(3,Math.min(18,n)); x.strokeStyle=col; x.lineWidth=2.6; for(let i=0;i<k;i++){ const yy=y0+(i+0.5)*(y1-y0)/k; x.beginPath(); x.moveTo(cx-th/2-6,yy+3); x.lineTo(cx+th/2+6,yy-3); x.stroke(); } };
  const nP=10, nS=st.busy? Math.round(Math.max(1,Ns/25)*Math.min(1,0.2+seg(a,0,0.18)*0.8)) : Math.round(Ns/25); coil(X0+th/2,Y0+th+10,Y1-th-10,nP,P.accent); coil(X1-th/2,Y0+th+10,Y1-th-10,nS,P.brand);
  H.wire(x,P,[[X0-6,Y0+th+12],[60,Y0+th+12],[60,130]],P.accent,2); H.wire(x,P,[[X0-6,Y1-th-12],[60,Y1-th-12],[60,210]],P.accent,2);
  H.box(x,P,24,130,72,80,P.surface,P.ink2,8); T(x,'6 V',60,160,P.ink,{size:14,weight:700,align:'center'}); T(x,'a.c. ~',60,178,P.ink,{size:13,align:'center'}); T(x,on?'ON':'off',60,198,on?P.brand:P.muted,{size:11,weight:700,align:'center'});
  H.wire(x,P,[[X1+6,Y0+th+12],[400,Y0+th+12],[400,140]],P.brand,2); H.wire(x,P,[[X1+6,Y1-th-12],[400,Y1-th-12],[400,200]],P.brand,2);
  H.meter(x,P,354,140,on? (st.show&&!st.busy? st.ys[0]: st.y*(st.busy?seg(a,0.55,0.7):1)).toFixed(2)+' V':'0.00 V','a.c. voltmeter',{w:96,hot:st.busy&&a>0.62});
  T(x,'primary coil',X0+th/2,Y1+20,P.accent,{size:12,align:'center',weight:700}); T(x,'N_p = 100 turns',X0+th/2,Y1+36,P.ink2,{size:11.5,align:'center'});
  T(x,'secondary coil',X1-th/2,Y1+20,P.brand,{size:12,align:'center',weight:700}); T(x,'N_s = '+Ns+' turns',X1-th/2,Y1+36,P.ink2,{size:11.5,align:'center'});
  T(x,'(each loop drawn = 25 turns)',(X0+X1)/2,Y1+52,P.muted,{size:10.5,align:'center'}); },
 extra:st=>[['ideal V_s',(6*st.xv/100).toFixed(2)+' V']] };

/* ===== PAG 11.2  specific heat capacity ===== */
D['p11-2']={dur:4.4,reveal:0.84,
 idle:'A 1.0 kg aluminium block has a heater in one hole and a thermometer in the other. Choose the time, then press Take reading.',
 steps:[[0,'Switch on the heater and start the stopwatch. Note V and I (they stay constant)'],[0.15,'Energy from the heater (power = VI) warms the block'],[0.84,'At the chosen time, read the thermometer. Energy supplied = VIt = mcΔθ']],
 draw(x,P,st){ const tt=st.xv, a=st.a; const on=st.busy? a>0.04 : st.show; const tNow= st.busy? tt*seg(a,0.06,0.84) : tt; const th= measOf('p11-2')(st.busy?tNow:tt);
  // --- heater circuit (circuit diagram, top left) ---
  H.box(x,P,8,8,212,150,P.bg,P.line2,10); T(x,'Heater circuit',18,26,P.ink2,{size:11.5,weight:700});
  const L=40,R=150,TOP=58,BOT=128; H.loop(x,P,L,TOP,R-L,BOT-TOP);
  H.sym.cell(x,P,L,(TOP+BOT)/2,true); T(x,'12 V',L-12,(TOP+BOT)/2+4,P.ink,{size:11,weight:700,align:'right'});
  H.sym.meter(x,P,(L+R)/2,TOP,'A'); T(x,on?'4.00 A':'0.00 A',(L+R)/2,TOP-18,P.brand,{size:12,weight:700,mono:true,align:'center'});
  H.sym.res(x,P,R,(TOP+BOT)/2,true,{fill:on?'#e0245e':P.surface}); T(x,'heater',R-14,(TOP+BOT)/2+4,P.ink2,{size:11,align:'right'});
  H.wire(x,P,[[R,TOP+14],[R+44,TOP+14],[R+44,BOT-14],[R,BOT-14]]); H.sym.meter(x,P,R+44,(TOP+BOT)/2,'V'); T(x,on?'12.0 V':'0.0 V',R+44,BOT+4,P.brand,{size:12,weight:700,mono:true,align:'center'});
  if(st.busy&&on) H.flow(x,P,[[L,BOT],[L,TOP],[R,TOP],[R,BOT],[L,BOT]],now(),P.brand,true);
  // --- stopwatch (bottom left) ---
  H.stopwatch(x,P,80,226,tNow,{dp:0,label:'stopwatch',hot:st.busy&&a>0.84});
  // --- insulated aluminium block (right) ---
  const bx=262, by=196, bw=176, bh=104; H.bench(x,P,by+bh+16,240,456);
  x.fillStyle=P.line; x.fillRect(bx-12,by-8,bw+24,bh+16); T(x,'insulation',bx+bw+8,by+bh+8,P.muted,{size:10.5,align:'right'});
  const w=cl((th-18)/30,0,1); x.fillStyle=`rgb(${Math.round(185+70*w)},${Math.round(190-60*w)},${Math.round(200-110*w)})`; x.fillRect(bx,by,bw,bh); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(bx,by,bw,bh);
  T(x,'aluminium block, 1.0 kg',bx+bw/2,by+bh-12,P.ink,{size:11.5,align:'center',weight:700});
  // heater in the left hole, thermometer in the right hole
  const hx=bx+48; x.fillStyle=on?'#e0245e':P.ink2; x.fillRect(hx-7,by-34,14,96); T(x,'heater',hx-12,by-14,P.ink2,{size:11,align:'right',weight:700});
  H.wire(x,P,[[hx-3,by-34],[hx-3,by-44]],P.ink2,2); H.wire(x,P,[[hx+3,by-34],[hx+3,by-44]],P.ink2,2); T(x,'(leads to heater circuit)',hx,by-50,P.muted,{size:9.5,align:'center'}); 
  const tx=bx+130; H.thermo(x,P,tx,40,by+60,(th-10)/60); T(x,'thermometer',tx-12,56,P.ink2,{size:11,weight:700,align:'right'}); T(x,th.toFixed(1)+' °C',tx-12,74,P.brand,{size:13,weight:700,mono:true,align:'right'});
 } };

/* ===== PAG 11.3  current balance ===== */
D['p11-3']={dur:4,reveal:0.78,
 idle:'A U-shaped magnet sits on a top-pan balance. A stiff wire is clamped between its poles (not touching). Choose the current, then press Take reading.',
 steps:[[0,'Zero (tare) the balance with no current flowing'],[0.2,'Switch on: current I flows through the wire between the poles'],[0.35,'The field pushes the wire up (F = BIL). By Newton’s third law the wire pushes the magnet down equally'],[0.78,'So the balance reading increases. Record the change Δm; then F = Δm g']],
 draw(x,P,st){ const I=st.xv, a=st.a; const busy=st.busy||st.show; const on= st.busy? a>0.2 : st.show; const dm= on? (st.busy? st.y*seg(a,0.35,0.7) : st.ys[0]) : 0;
  H.bench(x,P,318); H.box(x,P,110,262,220,56,P.line2,P.ink2,8); x.fillStyle=P.ink2; x.fillRect(130,250,180,12); H.box(x,P,175,276,90,30,P.deep,null,4); T(x,(dm>=0?'':'−')+Math.abs(dm).toFixed(2)+' g',220,297,'#ffe2ef',{size:14,weight:700,align:'center',mono:true}); if(st.busy&&a>0.7) H.hot(x,P,175,276,90,30); T(x,'top-pan balance',220,334,P.muted,{size:11,align:'center'});
  // U magnet seen from the side: two poles
  x.fillStyle=P.ink2; x.fillRect(150,236,140,14); x.fillStyle='#e0245e'; x.fillRect(150,150,30,86); x.fillStyle='#2b6cb0'; x.fillRect(260,150,30,86); T(x,'N',165,200,'#fff',{size:14,weight:700,align:'center'}); T(x,'S',275,200,'#fff',{size:14,weight:700,align:'center'});
  x.strokeStyle=P.teal; x.lineWidth=1.2; x.setLineDash([4,4]); for(let k=0;k<4;k++){ x.beginPath(); x.moveTo(182,165+k*20); x.lineTo(258,165+k*20); x.stroke(); } x.setLineDash([]); T(x,'B',220,158,P.teal,{size:12,weight:700,align:'center'});
  // wire seen end-on, current out of the page
  const wy=196; x.fillStyle=P.surface; x.strokeStyle=P.ink; x.lineWidth=2; x.beginPath(); x.arc(220,wy,9,0,7); x.fill(); x.stroke(); if(on){ x.fillStyle=P.ink; x.beginPath(); x.arc(220,wy,2.8,0,7); x.fill(); }
  T(x,'wire (current out of page)',330,120,P.ink2,{size:11}); x.strokeStyle=P.muted; x.lineWidth=1; x.beginPath(); x.moveTo(228,wy-8); x.lineTo(330,124); x.stroke();
  H.stand(x,P,400,318,40); H.arm(x,P,400,60,220); x.fillStyle=P.ink2; x.fillRect(216,60,8,120);
  if(on&&(!st.busy||a>0.35)){ const L=18+I*8; LK.arrow(x,220,wy-10,220,wy-10-L,P.brand,3,10); T(x,'force on wire',220,wy-16-L,P.brand,{size:11,weight:700,align:'center'}); LK.arrow(x,120,240,120,240+L*0.8,P.brand,3,10); T(x,'equal force',100,250,P.brand,{size:11,weight:700,align:'right'}); T(x,'down on magnet',100,264,P.brand,{size:11,align:'right'}); }
  H.meter(x,P,20,40,on?I.toFixed(1)+' A':'0.0 A','ammeter',{w:90,h:46}); T(x,'d.c. supply → wire',65,104,P.muted,{size:10.5,align:'center'}); } };

})();
