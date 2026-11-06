/* Mechanics labs */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const g0=9.81;


/* ---------- Motion graphs ---------- */
L.motiongraphs={title:'Motion graphs',cat:'Mechanics',topic:'3.1',desc:'Drive a trolley with the accelerator and watch s–t, v–t and a–t graphs draw themselves.',
icon:'<path d="M15 100 L15 15 M15 100 L105 100" stroke="currentColor" stroke-width="4"/><path d="M15 95 Q60 90 100 25" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const acc=LK.slider(c,{label:'Acceleration',min:-3,max:3,step:0.1,value:1,fmt:v=>v+' m/s²',on:()=>{ if(prof.value!=='manual'){ prof.value='manual'; } }});
 const prof=LK.select(c,{label:'Scenario',value:'manual',options:[['manual','Use the slider'],['const','Constant velocity'],['uni','Uniform acceleration from rest'],['brake','Speed up, cruise, brake'],['bounce','Bouncing ball (vertical)']],on:()=>reset()});
 LK.button(c,'Restart',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.14,minH:90,maxH:130});
 const p1=LK.plot(el,S,{xlab:'t / s',ylab:'s / m',ratio:0.3}), p2=LK.plot(el,S,{xlab:'t / s',ylab:'v / m s⁻¹',ratio:0.3}), p3=LK.plot(el,S,{xlab:'t / s',ylab:'a / m s⁻²',ratio:0.3});
 LK.note(el,'Gradient of s–t = velocity. Gradient of v–t = acceleration; area under v–t = displacement. Area under a–t = change in velocity.');
 let t,s,v,a,data,cam=0; const reset=()=>{ t=0; s=0; cam=0; v=prof.value==='const'?3:prof.value==='bounce'?0:0; data=[]; if(prof.value==='bounce'){ s=10; } }; reset();
 S.loop(dt=>{ if(t<12){ const pv=prof.value;
   if(pv==='manual') a=acc.v; else if(pv==='const') a=0; else if(pv==='uni') a=1.2; else if(pv==='brake') a=t<4?2:t<8?0:-2; if(pv!=='manual'&&pv!=='bounce'&&acc.v!==a) acc.set(a);
   if(pv==='bounce'){ a=-9.81; v+=a*dt; s+=v*dt; if(s<0){ s=0; v=-v*0.8; } } else { v+=a*dt; if(pv==='brake'&&v<0){v=0;a=0;} s+=v*dt; }
   t+=dt; data.push([t,s,v,a]); }
   const P=LK.P(),x=st.ctx; st.clear(); LK.grid(x,st.w,st.h,24);
   if(prof.value==='bounce'){ const Y=st.h-14-(s/10)*(st.h-30); x.fillStyle=P.brand; x.beginPath(); x.arc(st.w/2,Y,9,0,7); x.fill(); x.fillStyle=P.ink2; x.fillRect(0,st.h-6,st.w,6); }
   else { /* fixed scale; the view scrolls with the trolley so it never sticks at the edge */
     const view=40, ppm=(st.w-60)/view; if(s-cam>view*0.75) cam=s-view*0.75; if(s-cam<view*0.1) cam=s-view*0.1;
     x.fillStyle=P.ink2; x.fillRect(0,st.h-12,st.w,3);
     for(let m=Math.floor(cam/5)*5; m<=cam+view+5; m+=5){ const mx=30+(m-cam)*ppm; x.fillRect(mx,st.h-12,1.5,7); if(mx>16&&mx<st.w-16) LK.text(x,m+' m',mx,14,P.muted,{size:10,align:'center'}); x.fillStyle=P.line; x.fillRect(mx,18,1,st.h-32); x.fillStyle=P.ink2; }
     const X=30+(s-cam)*ppm-27; x.fillStyle=P.brand; LK.rr(x,X,st.h-40,54,24,6); x.fill(); x.fillStyle=P.deep; x.beginPath(); x.arc(X+12,st.h-14,6,0,7); x.arc(X+42,st.h-14,6,0,7); x.fill();
     if(Math.abs(v)>0.05) LK.arrow(x,X+27,st.h-52,X+27+Math.max(-60,Math.min(60,v*8)),st.h-52,P.teal,2,7); }
   if(t>=12) LK.text(x,'12 s recorded: press Restart to go again',st.w-8,36,P.brand,{align:'right',size:11,weight:600});
   if(t<12||!data.drawn){ if(t>=12) data.drawn=true; p1.set([{pts:data.map(d=>[d[0],d[1]])}],{xmax:12}); p2.set([{pts:data.map(d=>[d[0],d[2]]),color:LK.P().teal}],{xmax:12}); p3.set([{pts:data.map(d=>[d[0],d[3]]),color:LK.P().accent}],{xmax:12}); }
 });
 return ()=>S.dispose(); }};

/* ---------- Terminal velocity ---------- */
L.terminal={title:'Terminal velocity',cat:'Mechanics',topic:'3.2',desc:'Drop a skydiver or a ball bearing through oil. Watch drag grow until forces balance, then open the parachute.',
icon:'<path d="M30 40 Q60 0 90 40 Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M30 40 L60 80 L90 40" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="60" cy="88" r="8" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const mode=LK.select(c,{label:'Object',value:'sky',options:[['sky','Skydiver in air'],['ball','Ball bearing in oil (PAG 1.2)']],on:()=>reset()});
 const m=LK.slider(c,{label:'Mass',min:40,max:120,step:1,value:80,fmt:v=>mode.value==='sky'?v+' kg':(v/20).toFixed(1)+' g'});
 const chute=LK.button(c,'Open parachute',()=>{ open=true; },'primary');
 LK.button(c,'Restart',()=>reset());
 const st=LK.stage(el,S,{ratio:0.42});
 const ro=LK.readout(el,[['v','velocity'],['a','acceleration'],['W','weight'],['D','drag'],['U','upthrust']]);
 const pl=LK.plot(el,S,{xlab:'t / s',ylab:'v / m s⁻¹',ratio:0.32});
 LK.note(el,'Resultant force = W − D − U. As speed rises, drag rises, so acceleration falls. When D + U = W the resultant force is zero and the object falls at terminal velocity. Opening the parachute increases area, so drag exceeds weight and the diver slows to a new, lower terminal velocity.');
 let t,v,y,open,data,landed; const reset=()=>{ t=0;v=0;y=0;open=false;data=[];landed=false; chute.disabled=mode.value!=='sky'; }; reset();
 S.loop(dt=>{ const sky=mode.value==='sky'; const mass=sky?m.v:m.v/20/1000; const W=mass*g0;
   let k,U; if(sky){ k=open?30:0.25; U=0; } else { const r=Math.cbrt(mass/7800*3/(4*Math.PI)); U=(4/3)*Math.PI*r**3*900*g0; k=6*Math.PI*0.8*r; }
   const tubeY=()=>(st.h-48)/1000; /* tube depth in m at 1000 px per m */
   const sub=10; if(!landed) for(let i=0;i<sub;i++){ const h=(sky?dt:dt*0.15)/sub; const D=sky?k*v*Math.abs(v):k*v; const a=(W-D-U)/mass; v+=a*h; y+=v*h; t+=h; if(!sky&&y>=tubeY()){ y=tubeY(); landed=true; v=0; break; } }
   const D=landed?0:(sky?k*v*Math.abs(v):k*v); const a=landed?0:(W-D-U)/mass;
   if(!landed&&t<(sky?60:6)) data.push([t,v]);
   const P=LK.P(),x=st.ctx; st.clear();
   if(sky){ const off=(y*6)%60; x.strokeStyle=P.line; for(let i=-1;i<st.h/60+1;i++){ const yy=i*60-off; x.beginPath(); x.moveTo(40,yy); x.lineTo(80,yy); x.moveTo(st.w-80,yy); x.lineTo(st.w-40,yy); x.stroke(); } }
   else { x.fillStyle=P.accentSoft; x.fillRect(st.w/2-60,10,120,st.h-20); x.strokeStyle=P.ink2; x.strokeRect(st.w/2-60,10,120,st.h-20); }
   const cx=st.w/2, cy=sky?st.h*0.45:20+Math.min(st.h-48,y*1000);
   if(sky&&open){ x.strokeStyle=P.brand; x.fillStyle=P.soft; x.lineWidth=2; x.beginPath(); x.arc(cx,cy-60,50,Math.PI,0); x.fill(); x.stroke(); x.beginPath(); x.moveTo(cx-50,cy-60); x.lineTo(cx,cy-12); x.lineTo(cx+50,cy-60); x.stroke(); }
   x.fillStyle=P.deep; x.beginPath(); x.arc(cx,cy,sky?12:8,0,7); x.fill();
   if(landed){ LK.text(x,'Reached the bottom of the tube.',st.w/2+72,st.h-34,P.brand,{size:12,weight:600}); LK.text(x,'Press Restart to drop again.',st.w/2+72,st.h-18,P.brand,{size:12,weight:600}); }
   const sc=v=>Math.min(110,v/W*80);
   LK.arrow(x,cx,cy+14,cx,cy+14+sc(W),P.ink,3); LK.text(x,'W',cx+8,cy+14+sc(W),P.ink,{weight:700});
   LK.arrow(x,cx-6,cy-14,cx-6,cy-14-sc(D),P.brand,3); LK.text(x,'D',cx-26,cy-14-sc(D)+12,P.brand,{weight:700});
   if(U) { LK.arrow(x,cx+6,cy-14,cx+6,cy-14-sc(U),P.teal,3); LK.text(x,'U',cx+14,cy-14-sc(U)+12,P.teal,{weight:700}); }
   ro.set('v',LK.sig(v,3)+' m/s'); ro.set('a',LK.sig(a,2)+' m/s²'); ro.set('W',LK.sig(W,3)+' N'); ro.set('D',LK.sig(D,3)+' N'); ro.set('U',U?LK.sig(U,3)+' N':'≈ 0');
   if(Math.floor(t*20)%3===0) pl.set([{pts:data}],{});
 });
 return ()=>S.dispose(); }};

/* ---------- Moments ---------- */
L.moments={title:'Moments and equilibrium',cat:'Mechanics',topic:'3.2',desc:'Hang loads on a uniform beam and move the pivot. See clockwise and anticlockwise moments and when the beam balances.',
icon:'<path d="M10 60 H110" stroke="currentColor" stroke-width="6"/><path d="M60 62 L48 90 H72 Z" fill="currentColor"/><rect x="18" y="68" width="16" height="20" fill="currentColor"/><rect x="88" y="68" width="12" height="14" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const piv=LK.slider(c,{label:'Pivot position',min:0.1,max:1.9,step:0.05,value:1.0,fmt:v=>v.toFixed(2)+' m'});
 const wb=LK.slider(c,{label:'Beam weight',min:0,max:50,step:1,value:20,fmt:v=>v+' N'});
 const w1=LK.slider(c,{label:'Load A',min:0,max:60,step:1,value:30,fmt:v=>v+' N'}), x1=LK.slider(c,{label:'A position',min:0,max:2,step:0.05,value:0.3,fmt:v=>v.toFixed(2)+' m'});
 const w2=LK.slider(c,{label:'Load B',min:0,max:60,step:1,value:20,fmt:v=>v+' N'}), x2=LK.slider(c,{label:'B position',min:0,max:2,step:0.05,value:1.8,fmt:v=>v.toFixed(2)+' m'});
 const st=LK.stage(el,S,{ratio:0.38});
 const ro=LK.readout(el,[['acw','anticlockwise moment'],['cw','clockwise moment'],['net','resultant moment'],['R','pivot reaction']]);
 LK.note(el,'Moments are taken about the pivot. The beam’s weight acts at its centre of gravity (1.00 m). In equilibrium the sum of clockwise moments equals the sum of anticlockwise moments, and the pivot reaction equals the total weight.');
 let ang=0, om=0;
 S.loop(dt=>{ const p=piv.v; const loads=[[w1.v,x1.v],[w2.v,x2.v],[wb.v,1.0]]; let cw=0,acw=0; loads.forEach(([w,xx])=>{ const m=w*(xx-p); if(m>0) cw+=m; else acw+=-m; }); const net=cw-acw;
   const target=Math.abs(net)<0.05?0:Math.sign(net)*0.25; om+=(target-ang)*dt*8-om*dt*4; ang+=om*dt*2; ang=Math.max(-0.25,Math.min(0.25,ang));
   const P=LK.P(),x=st.ctx; st.clear(); const W=st.w, ox=W*0.1, sc=W*0.8/2, by=st.h*0.45;
   const px=ox+p*sc; x.fillStyle=P.ink2; x.beginPath(); x.moveTo(px,by+6); x.lineTo(px-18,by+50); x.lineTo(px+18,by+50); x.closePath(); x.fill(); x.fillRect(0,by+50,W,4);
   x.save(); x.translate(px,by); x.rotate(ang); x.fillStyle=P.brand; x.fillRect(-p*sc,-6,2*sc,12);
   x.fillStyle=P.surface; x.font=`10px ${P.mono}`; for(let i=0;i<=20;i++){ x.fillRect(-p*sc+i*sc/10,-6,1,5); }
   const drawLoad=(w,xx,col,lab)=>{ if(!w) return; const lx=(xx-p)*sc; const s=10+w/3; x.strokeStyle=P.ink2; x.beginPath(); x.moveTo(lx,6); x.lineTo(lx,30); x.stroke(); x.fillStyle=col; x.fillRect(lx-s/2,30,s,s); x.save(); x.rotate(-ang); LK.text(x,lab+' '+w+' N',lx-14,30+s+16,P.ink2,{size:11}); x.restore(); };
   drawLoad(w1.v,x1.v,P.accent,'A'); drawLoad(w2.v,x2.v,P.teal,'B');
   if(wb.v){ LK.arrow(x,(1-p)*sc,0,(1-p)*sc,30+wb.v,P.ink,2); }
   x.restore();
   LK.arrow(x,px,by+60,px,by+60,P.ink,1);
   ro.set('acw',LK.fx(acw,2)+' N m'); ro.set('cw',LK.fx(cw,2)+' N m'); ro.set('net',(Math.abs(net)<0.05?'0 (balanced)':LK.fx(net,2)+' N m '+(net>0?'clockwise':'anticlockwise'))); ro.set('R',(w1.v+w2.v+wb.v)+' N');
 });
 return ()=>S.dispose(); }};

/* ---------- Energy ramp ---------- */
L.energy={title:'Energy skate ramp',cat:'Mechanics',topic:'3.3',desc:'A skater on a U-shaped ramp. Watch GPE, KE and thermal energy trade places, with or without friction.',
icon:'<path d="M10 20 Q60 140 110 20" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="34" cy="62" r="8" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const m=LK.slider(c,{label:'Mass',min:20,max:100,step:5,value:60,fmt:v=>v+' kg'});
 const h=LK.slider(c,{label:'Start height',min:1,max:8,step:0.5,value:6,fmt:v=>v+' m',on:()=>reset()});
 const mu=LK.slider(c,{label:'Friction',min:0,max:0.2,step:0.01,value:0,fmt:v=>v.toFixed(2)});
 LK.button(c,'Restart',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.45});
 const ro=LK.readout(el,[['h','height'],['v','speed'],['ke','KE'],['pe','GPE'],['th','thermal']]);
 LK.note(el,'With no friction, mgh = ½mv² at every point: total energy is conserved. Speed at the bottom = √(2gh), independent of mass. With friction, work done against friction (F × distance) becomes thermal energy and the skater never returns to the same height.');
 const span=10; const yOf=s=>8*Math.pow(s/(span/2),2); // track y(x), x in [-5,5]
 let xpos,vel,heat; const reset=()=>{ xpos=-(span/2)*Math.sqrt(h.v/8); vel=0; heat=0; }; reset();
 S.loop(dt=>{ const sub=20; for(let i=0;i<sub;i++){ const hstep=dt/sub; const slope=16*xpos/((span/2)**2); const cos=1/Math.sqrt(1+slope*slope), sin=slope*cos; let a=-g0*sin; const fr=mu.v*g0*cos; if(Math.abs(vel)>1e-3) a-=Math.sign(vel)*fr; else if(Math.abs(g0*sin)<fr){ a=0; vel=0; }
     const ds=vel*hstep; heat+=m.v*fr*Math.abs(ds); vel+=a*hstep; xpos+=ds*cos; if(Math.abs(xpos)>span/2){ xpos=Math.sign(xpos)*span/2; vel=0; } }
   const y=yOf(xpos), KE=0.5*m.v*vel*vel, PE=m.v*g0*y, tot=m.v*g0*h.v;
   const P=LK.P(),x=st.ctx; st.clear(); LK.grid(x,st.w,st.h,24);
   const W=st.w*0.66, sc=W/span, X=v=>20+(v+span/2)*sc, Y=v=>st.h-20-v*(st.h-40)/9;
   x.strokeStyle=P.ink2; x.lineWidth=4; x.beginPath(); for(let s=-span/2;s<=span/2+1e-9;s+=0.1){ s===-span/2?x.moveTo(X(s),Y(yOf(s))):x.lineTo(X(s),Y(yOf(s))); } x.stroke();
   x.setLineDash([5,5]); x.strokeStyle=P.line2; x.lineWidth=1; x.beginPath(); x.moveTo(X(-span/2),Y(h.v)); x.lineTo(X(span/2),Y(h.v)); x.stroke(); x.setLineDash([]);
   x.fillStyle=P.brand; x.beginPath(); x.arc(X(xpos),Y(y)-10,10,0,7); x.fill();
   const bx=st.w*0.72, bw=(st.w*0.26)/3-8, bh=st.h-60; const bars=[['KE',KE,P.teal],['GPE',PE,P.brand],['Thermal',heat,P.accent]];
   bars.forEach(([n,v,col],i)=>{ const hh=bh*Math.min(1,v/tot); x.fillStyle=col; x.fillRect(bx+i*(bw+8),20+bh-hh,bw,hh); x.strokeStyle=P.line2; x.strokeRect(bx+i*(bw+8),20,bw,bh); LK.text(x,n,bx+i*(bw+8)+bw/2,st.h-24,P.ink2,{align:'center',size:11}); });
   ro.set('h',LK.fx(y,2)+' m'); ro.set('v',LK.fx(Math.abs(vel),2)+' m/s'); ro.set('ke',LK.sig(KE,3)+' J'); ro.set('pe',LK.sig(PE,3)+' J'); ro.set('th',LK.sig(heat,3)+' J');
 });
 return ()=>S.dispose(); }};

/* ---------- Springs ---------- */
L.springs={title:'Springs: Hooke’s law',cat:'Mechanics',topic:'3.4',desc:'Load single springs, or two springs in series or parallel. Plot force against extension and find the stored energy.',
icon:'<path d="M60 5 V20 L45 27 L75 37 L45 47 L75 57 L45 67 L60 74 V85" fill="none" stroke="currentColor" stroke-width="4"/><rect x="45" y="85" width="30" height="25" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const cfg=LK.select(c,{label:'Arrangement',value:'single',options:[['single','Single spring'],['series','Two in series'],['parallel','Two in parallel']],on:()=>{pts=[];draw();}});
 const k1=LK.slider(c,{label:'k₁',min:10,max:100,step:5,value:40,fmt:v=>v+' N/m',on:()=>{pts=[];draw();}}), k2=LK.slider(c,{label:'k₂',min:10,max:100,step:5,value:40,fmt:v=>v+' N/m',on:()=>{pts=[];draw();}});
 const F=LK.slider(c,{label:'Load',min:0,max:12,step:0.5,value:4,fmt:v=>v+' N',on:()=>draw()});
 const b=LK.ctrl(el); LK.button(b,'Record point',()=>{ pts.push([ext(),F.v]); draw(); },'primary'); LK.button(b,'Clear graph',()=>{pts=[];draw();});
 const st=LK.stage(el,S,{ratio:0.5});
 const ro=LK.readout(el,[['k','effective k'],['x','extension'],['E','elastic PE ½kx²']]);
 const pl=LK.plot(el,S,{xlab:'extension x / m',ylab:'force F / N',ratio:0.36});
 LK.note(el,'Series: 1/k = 1/k₁ + 1/k₂, both springs carry the full load so the total extension is bigger. Parallel: k = k₁ + k₂, the load is shared. The gradient of F against x is k; the area under it is the elastic potential energy. Beyond the limit of proportionality (≈ 0.35 m here) the spring stretches more than Hooke’s law predicts.');
 let pts=[];
 const keff=()=>cfg.value==='single'?k1.v:cfg.value==='series'?1/(1/k1.v+1/k2.v):k1.v+k2.v;
 const ext=()=>{ const x=F.v/keff(); return x<0.35?x:0.35+(x-0.35)*1.8; };
 const draw=()=>{ const P=LK.P(); const line=[[0,0],[0.35,0.35*keff()]]; pl.set([{pts:line,color:P.line2,dash:[5,4],name:'Hooke’s law line'},{pts:pts,points:true,color:P.brand,name:'recorded'},{pts:[[ext(),F.v]],points:true,color:P.teal,name:'now'}],{xmin:0,ymin:0,xmax:Math.max(0.4,...pts.map(q=>q[0]),ext())*1.05,ymax:12,legend:true}); };
 draw();
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const top=16, W=st.w; x.fillStyle=P.ink2; x.fillRect(W*0.2,top-6,W*0.6,8);
   const e=ext(), sc=(st.h-90)/0.9, cfgv=cfg.value; x.strokeStyle=P.brand; x.lineWidth=2;
   const L0=60;
   if(cfgv==='single'){ const len=L0+e*sc; LK.spring(x,W/2,top,W/2,top+len,12,10); x.fillStyle=P.deep; x.fillRect(W/2-18,top+len,36,24); }
   else if(cfgv==='series'){ const e1=F.v/k1.v, e2=F.v/k2.v; const l1=L0/2+e1*sc*(e/(e1+e2)||0)*(e1+e2)/e1*e1/(e1+e2); const len1=L0/2+(e*e1/(e1+e2))*sc, len2=L0/2+(e*e2/(e1+e2))*sc; LK.spring(x,W/2,top,W/2,top+len1,7,10); x.fillStyle=P.ink2; x.fillRect(W/2-6,top+len1,12,6); x.strokeStyle=P.teal; LK.spring(x,W/2,top+len1+6,W/2,top+len1+6+len2,7,10); x.fillStyle=P.deep; x.fillRect(W/2-18,top+len1+len2+6,36,24); }
   else { const len=L0+e*sc; LK.spring(x,W/2-22,top,W/2-22,top+len,12,8); x.strokeStyle=P.teal; LK.spring(x,W/2+22,top,W/2+22,top+len,12,8); x.fillStyle=P.ink2; x.fillRect(W/2-32,top+len,64,6); x.fillStyle=P.deep; x.fillRect(W/2-18,top+len+6,36,24); }
   // ruler
   x.strokeStyle=P.line2; x.lineWidth=1; for(let i=0;i<=18;i++){ const yy=top+L0+i*0.05*sc; x.beginPath(); x.moveTo(W*0.75,yy); x.lineTo(W*0.75+(i%2?6:12),yy); x.stroke(); if(i%2===0) LK.text(x,(i*5)+' cm',W*0.75+16,yy+4,P.muted,{size:10}); }
   ro.set('k',LK.sig(keff(),3)+' N/m'); ro.set('x',LK.fx(e*100,1)+' cm'); ro.set('E',LK.sig(0.5*F.v*e,3)+' J');
 });
 return ()=>S.dispose(); }};

/* ---------- Tensile test (stress–strain explorer, same layout as the DT site) ---------- */
const SS={
 steel:{n:'Mild steel',E:210,c:[[0,0],[.119,250],[.2,238],[.6,245],[1.5,250],[3,300],[6,360],[10,405],[15,420],[19,405],[22,380],[25,330]],ey:.119,eu:15,ef:25,ys:250,uts:420,desc:'<b>Ductile</b> with a clear <b>yield point</b>: the stress drops slightly and the steel stretches at almost constant stress, then <b>work hardening</b> raises it to the UTS. After that <b>necking</b> starts and it fractures.'},
 copper:{n:'Copper (ductile)',E:120,c:[[0,0],[.06,70],[.2,95],[1,120],[5,165],[15,205],[30,220],[38,210],[42,190],[45,170]],ey:.06,eu:30,ef:45,ys:70,uts:220,desc:'Very <b>ductile</b>: a short straight elastic line, no sharp yield point (use the 0.2% proof stress), then a long plastic region. It can be drawn into wires.'},
 hcs:{n:'High carbon steel (hardened)',E:210,c:[[0,0],[.33,700],[.6,780],[1.5,840],[4,890],[7,900],[9,870],[10,830]],ey:.33,eu:7,ef:10,ys:700,uts:900,desc:'Very strong and hard but much <b>less ductile</b> than mild steel: little plastic deformation before fracture.'},
 al:{n:'Aluminium alloy',E:70,c:[[0,0],[.38,265],[.7,285],[2,300],[6,310],[10,310],[12,295],[14,270]],ey:.38,eu:9,ef:14,ys:270,uts:310,desc:'No sharp yield point, so engineers use the <b>0.2% proof stress</b>. A lower Young modulus than steel (the elastic line is less steep) but only a third of the density.'},
 ci:{n:'Grey cast iron (brittle)',E:110,c:[[0,0],[.1,105],[.2,170],[.35,200],[.45,210]],ey:.45,eu:.45,ef:.45,ys:null,uts:210,desc:'<b>Brittle</b>: it fractures with almost no plastic deformation and no necking. Strong in compression but weak in tension.'},
 glass:{n:'Glass (brittle)',E:70,c:[[0,0],[.07,50]],ey:.07,eu:.07,ef:.07,ys:null,uts:50,desc:'<b>Brittle</b>: it obeys Hooke’s law right up to fracture, which happens at the end of the straight line with no plastic region at all. Tick “Zoom into elastic region” to see the line clearly.'},
 acr:{n:'Acrylic (PMMA)',E:3.1,c:[[0,0],[1,31],[2,58],[2.8,70],[3.2,72]],ey:3.2,eu:3.2,ef:3.2,ys:null,uts:72,desc:'A <b>brittle</b> polymer at room temperature: it snaps rather than stretching. Its Young modulus is far lower than a metal’s.'},
 poly:{n:'Polythene (plastic polymer)',E:.3,c:[[0,0],[3,9],[8,12],[15,11],[40,10],[200,11],[400,14],[500,16],[520,16.5]],ey:8,eu:8,ef:520,ys:12,uts:16.5,desc:'A <b>ductile</b> polymer showing <b>plastic</b> behaviour: after yielding a neck forms and travels along the specimen as the molecular chains line up (<b>cold drawing</b>), so it stretches hundreds of per cent and does not return to its original length.'},
 rubber:{n:'Rubber (polymer)',E:.002,c:[[0,0],[50,.9],[100,1.4],[200,2],[300,3],[400,5],[500,9],[600,15],[650,18]],ey:650,eu:650,ef:650,ys:null,uts:18,desc:'An <b>elastomer</b>: the curve is not a straight line, so it does not obey Hooke’s law, but the behaviour is <b>elastic</b>. It returns to its original length when unloaded, even after huge strains (the unloading curve lies below the loading curve: hysteresis).'}
};
const ssI=(c,x)=>{ for(let i=1;i<c.length;i++){ if(x<=c[i][0]){ const [x0,y0]=c[i-1],[x1,y1]=c[i]; return y0+(y1-y0)*(x-x0)/(x1-x0); } } return c[c.length-1][1]; };
const ssF=(v,d)=>(+v).toFixed(d);
L.tensile={title:'Tensile tester',cat:'Mechanics',topic:'3.4',desc:'Pull a test specimen of steel, copper, glass, polythene, rubber and more. Watch the stress–strain graph: elastic region, yield, work hardening, necking and fracture.',
icon:'<path d="M15 105 L30 30 C45 22 75 18 100 30 L105 45" fill="none" stroke="currentColor" stroke-width="5"/><path d="M15 105 L15 10 M15 105 L110 105" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const st={m:'steel',e:0,zoom:false,run:false};
 const c=LK.ctrl(el);
 LK.select(c,{label:'Material',value:st.m,options:Object.entries(SS).map(([k,v])=>[k,v.n]),on:v=>{ st.m=v; st.e=0; st.run=false; runB.textContent='Run test'; sl.set(0); }});
 const sl=LK.slider(c,{label:'Pull (strain)',min:0,max:1000,value:0,fmt:v=>ssF(v/1000*SS[st.m].ef,2)+' %',on:v=>{ st.e=v/1000*SS[st.m].ef; st.run=false; runB.textContent='Run test'; }});
 const runB=LK.button(c,'Run test',()=>{ if(st.run){ st.run=false; runB.textContent='Run test'; return; } if(st.e>=SS[st.m].ef*.999) st.e=0; st.run=true; runB.textContent='Pause test'; },'primary');
 LK.button(c,'Reset',()=>{ st.e=0; st.run=false; runB.textContent='Run test'; sl.set(0); });
 LK.check(c,'Zoom into elastic region',false,v=>{ st.zoom=v; });
 const cv=LK.stage(el,S,{ratio:1.3,minH:340,maxH:470});
 const ro=LK.readout(el,[['s','Stress'],['e','Strain'],['r','Region'],['E','Young modulus'],['y','Yield / proof stress'],['u','UTS'],['f','Strain at fracture'],['perm','If unloaded now']]);
 const cap=LK.el('<div class="mcap"></div>'); el.appendChild(cap);
 LK.note(el,'Stress σ = F/A (force ÷ cross-sectional area). Strain ε = x/L (extension ÷ original length). In the straight elastic region Hooke’s law applies and the gradient is the Young modulus, E = σ/ε. Beyond the elastic limit the deformation is plastic: when unloaded, the line comes down parallel to the loading line and leaves a permanent strain. The UTS is the highest stress on the curve. Values are typical, not exact.');
 let lastM='';
 S.loop(dt=>{ const M=SS[st.m];
  if(st.run){ st.e=Math.min(M.ef,st.e+dt*M.ef/7.5); sl.set(Math.round(st.e/M.ef*1000)); if(st.e>=M.ef){ st.run=false; runB.textContent='Run again'; } }
  const P=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; cv.clear(); const stack=w<620;
  const gx=58, gy=26, gw=stack?w-76:w*.62-72, gh=stack?h*.58-34:h-66;
  const xmax=st.zoom?Math.min(M.ef,M.ey*3)*1.02:M.ef*1.05, ymax=Math.max(...M.c.map(q=>q[1]))*1.12;
  const X=v=>gx+v/xmax*gw, Y=v=>gy+gh-v/ymax*gh;
  ctx.strokeStyle=P.line2; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx,gy+gh); ctx.lineTo(gx+gw,gy+gh); ctx.stroke();
  const top=ymax/1.12;
  for(let i=1;i<=4;i++){ ctx.strokeStyle=P.line; ctx.beginPath(); ctx.moveTo(gx,Y(top*i/4)); ctx.lineTo(gx+gw,Y(top*i/4)); ctx.stroke();
   LK.text(ctx,ssF(top*i/4,top<40?1:0),gx-6,Y(top*i/4)+4,P.muted,{align:'right',size:10});
   LK.text(ctx,ssF(xmax*i/4,xmax<2?2:xmax<20?1:0)+'%',X(xmax*i/4),gy+gh+14,P.muted,{align:'center',size:10}); }
  LK.text(ctx,'Stress / MPa',gx,gy-10,P.muted,{size:11,mono:false,weight:600}); LK.text(ctx,'Strain / %',gx+gw,gy+gh+30,P.muted,{align:'right',size:11,mono:false,weight:600});
  ctx.save(); ctx.beginPath(); ctx.rect(gx,gy-4,gw+2,gh+4); ctx.clip();
  const curve=(to,col,lw)=>{ ctx.beginPath(); const n=300; for(let i=0;i<=n;i++){ const x=to*i/n, y=ssI(M.c,x); i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.stroke(); };
  curve(M.ef,P.line2,2); curve(Math.max(1e-6,st.e),P.brand,3);
  const s=ssI(M.c,st.e); ctx.beginPath(); ctx.arc(X(st.e),Y(s),6,0,7); ctx.fillStyle=P.accent; ctx.fill();
  if(M.ys&&M.ey<M.ef){ ctx.setLineDash([4,4]); ctx.strokeStyle=P.muted; ctx.beginPath(); ctx.moveTo(X(M.ey),Y(0)); ctx.lineTo(X(M.ey),Y(M.ys)); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,'yield',X(M.ey)+4,Y(M.ys)-10,P.ink2,{size:11,weight:600,mono:false}); }
  if(M.eu<M.ef){ LK.text(ctx,'UTS',X(M.eu),Y(M.uts)-10,P.ink2,{align:'center',size:11,weight:600,mono:false}); }
  ctx.restore();
  const broken=st.e>=M.ef*.999;
  if(broken) LK.text(ctx,'✕ fracture',Math.min(X(M.ef),gx+gw)-4,Math.max(gy+14,Y(ssI(M.c,M.ef))+18),P.bad,{align:'right',size:11,weight:700,mono:false});
  // specimen in its grips
  const sx=stack?w/2:w*.62+(w*.38)/2, sy=stack?h*.58+36:30, sh=stack?h*.42-50:h-70;
  const ext=Math.min(.6,st.e/Math.max(M.ef,1)*.6+(M.ef<5?st.e/M.ef*.03:0));
  const gauge=sh*.45*(1+ext*.6); const neck=st.e>M.eu&&M.eu<M.ef?(st.e-M.eu)/(M.ef-M.eu):0;
  const tp=sy+(sh-gauge-80)/2, Wd=34; ctx.fillStyle=P.line2; ctx.fillRect(sx-Wd/2-10,tp,Wd+20,34); ctx.fillRect(sx-Wd/2-10,tp+34+gauge+12,Wd+20,34);
  const bw=Wd*.55*(1-ext*.25), gap=broken?8:0;
  const fill=st.m==='rubber'?'#3b3b3b':st.m==='acr'||st.m==='glass'?'rgba(120,180,230,.6)':st.m==='poly'?'#e8e2cf':st.m==='copper'?'#c27a4a':'#9aa7b5';
  const half=dir=>{ ctx.beginPath(); const yA=tp+34, yB=tp+34+gauge+12, mid=(yA+yB)/2;
   const at=i=>{ const t=i/40; const y=dir<0?yA+t*(mid-gap-yA):yB-t*(yB-(mid+gap)); const d=Math.abs(y-mid)/(mid-yA); return [y,bw/2*(1-neck*.55*Math.exp(-d*d*12))]; };
   for(let i=0;i<=40;i++){ const [y,nw]=at(i); i?ctx.lineTo(sx-nw,y):ctx.moveTo(sx-nw,y); } for(let i=40;i>=0;i--){ const [y,nw]=at(i); ctx.lineTo(sx+nw,y); }
   ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=P.ink; ctx.lineWidth=1.2; ctx.stroke(); };
  half(-1); half(1);
  LK.arrow(ctx,sx,tp-4,sx,tp-24,P.accent,2,8); LK.arrow(ctx,sx,tp+34+gauge+12+38,sx,tp+34+gauge+12+58,P.accent,2,8);
  let region; if(st.e===0) region='Unloaded'; else if(broken) region='Fractured'; else if(st.e<=M.ey) region=st.m==='rubber'?'Elastic (non-linear)':'Elastic (Hooke’s law)'; else if(st.e<=M.eu) region='Plastic (work hardening)'; else region=st.m==='poly'?'Cold drawing (neck travels)':'Necking';
  const perm=broken?'Broken':st.e<=M.ey?'Returns to original length':'Permanent strain ≈ '+ssF(Math.max(0,st.e-s/(M.E*10)),2)+' %';
  ro.set('s',ssF(s,s<40?1:0)+' MPa'); ro.set('e',ssF(st.e,2)+' %'); ro.set('r',region); ro.set('E',M.E>=1?M.E+' GPa':(M.E*1000)+' MPa'); ro.set('y',M.ys?M.ys+' MPa':'No clear yield'); ro.set('u',M.uts+' MPa'); ro.set('f',M.ef+' %'); ro.set('perm',perm);
  if(lastM!==st.m){ cap.innerHTML=M.desc; lastM=st.m; }
 });
 return ()=>S.dispose(); }};


/* ---------- Vectors ---------- */
L.vectors={title:'Vector adder',cat:'Mechanics',topic:'2.3',desc:'Drag the tips of two vectors. See components, the tip-to-tail triangle and the resultant.',
icon:'<path d="M15 100 L80 100 L100 30" fill="none" stroke="currentColor" stroke-width="5"/><path d="M15 100 L100 30" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5"/>',
mount(el){ const S=LK.scope(); const st=LK.stage(el,S,{ratio:0.55});
 const ro=LK.readout(el,[['a','A (magnitude, angle)'],['b','B (magnitude, angle)'],['r','resultant R'],['c','R components']]);
 LK.note(el,'Drag the pink and teal arrow tips. Components: F_x = F cos θ, F_y = F sin θ. The resultant is found by adding x-components and y-components, or by drawing the vectors tip to tail. Grid squares are 1 unit.');
 let A=[6,2], B=[2,5], drag=null; const U=()=>Math.min(st.w,st.h*1.6)/22; const O=()=>[st.w*0.3,st.h*0.78];
 const toP=(v,o=[0,0])=>{ const [ox,oy]=O(); return [ox+(v[0]+o[0])*U(), oy-(v[1]+o[1])*U()]; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e); const ta=toP(A), tb=toP(B,A); if(Math.hypot(p.x-ta[0],p.y-ta[1])<22) drag='A'; else if(Math.hypot(p.x-tb[0],p.y-tb[1])<22) drag='B'; if(drag) st.cv.setPointerCapture(e.pointerId); });
 S.on(st.cv,'pointermove',e=>{ if(!drag) return; const p=st.pos(e); const [ox,oy]=O(); let vx=(p.x-ox)/U(), vy=(oy-p.y)/U(); vx=Math.round(vx*2)/2; vy=Math.round(vy*2)/2; if(drag==='A') A=[vx,vy]; else B=[vx-A[0],vy-A[1]]; });
 S.on(st.cv,'pointerup',()=>drag=null);
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const u=U(), [ox,oy]=O(); LK.grid(x,st.w,st.h,u);
   x.strokeStyle=P.line2; x.beginPath(); x.moveTo(0,oy); x.lineTo(st.w,oy); x.moveTo(ox,0); x.lineTo(ox,st.h); x.stroke();
   const a=toP(A), b=toP(B,A), r=toP([A[0]+B[0],A[1]+B[1]]);
   x.setLineDash([4,4]); x.strokeStyle=P.brand; x.beginPath(); x.moveTo(ox,oy); x.lineTo(a[0],oy); x.lineTo(a[0],a[1]); x.stroke(); x.setLineDash([]);
   LK.arrow(x,ox,oy,a[0],a[1],P.brand,3.5,12); LK.arrow(x,a[0],a[1],b[0],b[1],P.teal,3.5,12); LK.arrow(x,ox,oy,r[0],r[1],P.ink,3,12);
   [[a,'A',P.brand],[b,'B',P.teal]].forEach(([p,l,col])=>{ x.fillStyle=col; x.beginPath(); x.arc(p[0],p[1],8,0,7); x.fill(); LK.text(x,l,p[0]+10,p[1]-8,col,{weight:700,size:14}); });
   LK.text(x,'R',(ox+r[0])/2-14,(oy+r[1])/2-4,P.ink,{weight:700,size:14});
   const mag=v=>Math.hypot(v[0],v[1]), ang=v=>Math.atan2(v[1],v[0])*180/Math.PI, R=[A[0]+B[0],A[1]+B[1]];
   ro.set('a',LK.fx(mag(A),2)+' at '+LK.fx(ang(A),1)+'°'); ro.set('b',LK.fx(mag(B),2)+' at '+LK.fx(ang(B),1)+'°'); ro.set('r',LK.fx(mag(R),2)+' at '+LK.fx(ang(R),1)+'°'); ro.set('c','('+R[0]+', '+R[1]+')');
 });
 return ()=>S.dispose(); }};

/* ---------- Circular motion ---------- */
L.circular={title:'Circular motion',cat:'Newtonian world',topic:'5.2',desc:'Whirl a mass in a horizontal or vertical circle. Change speed and radius, see the centripetal force, then cut the string.',
icon:'<circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="8 6"/><circle cx="88" cy="32" r="9" fill="currentColor"/><path d="M60 60 L88 32" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const mode=LK.select(c,{label:'View',value:'h',options:[['h','Horizontal circle (top view)'],['v','Vertical circle (side view)']]});
 const m=LK.slider(c,{label:'Mass',min:0.1,max:2,step:0.1,value:0.5,fmt:v=>v.toFixed(1)+' kg'}), r=LK.slider(c,{label:'Radius',min:0.2,max:1.5,step:0.05,value:0.8,fmt:v=>v.toFixed(2)+' m'}), v=LK.slider(c,{label:'Speed',min:0.5,max:10,step:0.1,value:4,fmt:v=>v.toFixed(1)+' m/s'});
 LK.button(c,'Cut string',()=>{ if(!free) free={x:Math.cos(th)*r.v,y:Math.sin(th)*r.v,vx:-Math.sin(th)*v.v,vy:Math.cos(th)*v.v,t:0}; },'primary'); LK.button(c,'Reset',()=>{free=null;});
 const st=LK.stage(el,S,{ratio:0.5});
 const ro=LK.readout(el,[['w','ω'],['T','period'],['a','a = v²/r'],['F','F = mv²/r'],['ten','tension']]);
 LK.note(el,'The velocity is always along the tangent; the acceleration and resultant force point to the centre. Cut the string and the mass leaves along the tangent (Newton’s first law). In a vertical circle tension is greatest at the bottom (T = mg + mv²/r) and least at the top (T = mv²/r − mg); if v < √(gr) at the top the string goes slack.');
 let th=0, free=null;
 S.loop(dt=>{ const P=LK.P(),x=st.ctx; st.clear(); LK.grid(x,st.w,st.h,24); const cx=st.w/2, cy=st.h/2, sc=(st.h*0.42)/1.5;
   const vert=mode.value==='v'; const w=v.v/r.v; let vv=v.v;
   if(!free) th+=w*dt*0.6;
   x.strokeStyle=P.line2; x.setLineDash([5,5]); x.beginPath(); x.arc(cx,cy,r.v*sc,0,7); x.stroke(); x.setLineDash([]);
   const px=cx+Math.cos(th)*r.v*sc, py=cy-Math.sin(th)*r.v*sc;
   let T=m.v*v.v*v.v/r.v; if(vert){ const height=Math.sin(th); T=m.v*v.v*v.v/r.v + m.v*g0*(-height); }
   if(free){ free.t+=dt*0.6; free.x+=free.vx*dt*0.6; free.y+=free.vy*dt*0.6; if(vert) free.vy-=g0*dt*0.6; const fx=cx+free.x*sc, fy=cy-free.y*sc; x.fillStyle=P.brand; x.beginPath(); x.arc(fx,fy,10,0,7); x.fill(); LK.arrow(x,fx,fy,fx+free.vx*10,fy-free.vy*10,P.teal,2.5); }
   else { x.strokeStyle=T>=0?P.ink2:P.bad; x.lineWidth=T>=0?2:1; if(T<0) x.setLineDash([3,4]); x.beginPath(); x.moveTo(cx,cy); x.lineTo(px,py); x.stroke(); x.setLineDash([]); x.fillStyle=P.brand; x.beginPath(); x.arc(px,py,10,0,7); x.fill();
     LK.arrow(x,px,py,px-Math.sin(th)*vv*12,py-Math.cos(th)*vv*12,P.teal,2.5); LK.arrow(x,px,py,px+(cx-px)*0.45,py+(cy-py)*0.45,P.accent,2.5);
     LK.text(x,'v',px-Math.sin(th)*vv*12+6,py-Math.cos(th)*vv*12,P.teal,{weight:700}); LK.text(x,'F',px+(cx-px)*0.5+6,py+(cy-py)*0.5,P.accent,{weight:700}); }
   x.fillStyle=P.ink; x.beginPath(); x.arc(cx,cy,4,0,7); x.fill();
   ro.set('w',LK.fx(w,2)+' rad/s'); ro.set('T',LK.fx(2*Math.PI/w,2)+' s'); ro.set('a',LK.sig(v.v**2/r.v,3)+' m/s²'); ro.set('F',LK.sig(m.v*v.v**2/r.v,3)+' N');
   ro.set('ten',vert?(T<0?'slack!':LK.sig(T,3)+' N'):LK.sig(T,3)+' N');
 });
 return ()=>S.dispose(); }};

/* ---------- SHM ---------- */
L.shm={title:'Simple harmonic motion',howto:'drag the mass sideways and let go to start it oscillating, or set the amplitude and press <b>Release</b>. Turn on the reference circle to see SHM as the shadow of circular motion.',cat:'Newtonian world',topic:'5.3',desc:'A mass on a spring or a pendulum with adjustable damping. Live x, v and a graphs plus energy bars.',
icon:'<path d="M5 60 C25 10 35 10 45 60 C55 110 65 110 75 60 C85 10 95 10 115 60" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const typ=LK.select(c,{label:'Oscillator',value:'spring',options:[['spring','Mass–spring'],['pend','Simple pendulum']],on:()=>reset()});
 const m=LK.slider(c,{label:'Mass',min:0.1,max:2,step:0.1,value:0.5,fmt:v=>v.toFixed(1)+' kg'}), k=LK.slider(c,{label:'k / length',min:5,max:100,step:1,value:20,fmt:v=>typ.value==='spring'?v+' N/m':(v/50).toFixed(2)+' m',on:()=>reset()});
 const A=LK.slider(c,{label:'Amplitude',min:0.02,max:0.2,step:0.01,value:0.1,fmt:v=>typ.value==='spring'?(v*100).toFixed(0)+' cm':(v*57.3).toFixed(1)+'°',on:()=>reset()});
 const b=LK.slider(c,{label:'Damping',min:0,max:2,step:0.05,value:0,fmt:v=>v.toFixed(2)+' kg/s'});
 LK.button(c,'Release',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.36});
 const ro=LK.readout(el,[['T','period'],['f','frequency'],['vm','v_max = ωA'],['am','a_max = ω²A'],['E','total energy']]);
 const pl=LK.plot(el,S,{xlab:'t / s',ylab:'x, v, a (scaled)',ratio:0.34});
 LK.note(el,'a = −ω²x. Velocity leads displacement by a quarter cycle; acceleration is in antiphase with displacement. Change the amplitude: the period does not change (isochronous). Add damping and the amplitude decays exponentially while the period hardly changes.');
 let x0,v0,t,data; const reset=()=>{ x0=typ.value==='spring'?A.v:A.v*1.0; v0=0; t=0; data=[]; }; reset();
 const refc=LK.check(c,'Reference circle (SHM as circular motion)',false); let held=false;
 const geo=()=>{ const cx=st.w*0.32; return {cx,sc:st.w*0.12/0.1,L:st.h*0.75}; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e), G=geo(); const pend=typ.value==='pend'; const mxp=pend?G.cx+Math.sin(x0)*G.L:G.cx+x0*G.sc, myp=pend?20+Math.cos(x0)*G.L:st.h/2; if(Math.hypot(p.x-mxp,p.y-myp)<40){ held=true; st.cv.setPointerCapture(e.pointerId); } });
 S.on(st.cv,'pointermove',e=>{ const p=st.pos(e), G=geo(); st.cv.style.cursor='grab'; if(!held) return; if(typ.value==='pend') x0=Math.max(-0.6,Math.min(0.6,Math.asin(Math.max(-1,Math.min(1,(p.x-G.cx)/G.L))))); else x0=Math.max(-0.22,Math.min(0.22,(p.x-G.cx)/G.sc)); v0=0; });
 S.on(st.cv,'pointerup',()=>{ if(held){ held=false; t=0; data=[]; } });
 S.loop(dt=>{ const pend=typ.value==='pend'; const Lp=k.v/50; const w2=pend?g0/Lp:k.v/m.v; const sub=held?0:20; for(let i=0;i<sub;i++){ const h=dt/sub; const a=-w2*x0 - b.v/m.v*v0; v0+=a*h; x0+=v0*h; } t+=dt; const a=-w2*x0-b.v/m.v*v0; const w=Math.sqrt(w2);
   data.push([t,x0,v0,a]); if(data.length>400) data.shift();
   const P=LK.P(),x=st.ctx; st.clear(); LK.grid(x,st.w,st.h,24); const cx=st.w*0.32;
   if(refc.checked&&!pend){ const sc=st.w*0.12/0.1; const Am=Math.hypot(x0,v0/w); const phi=Math.atan2(-v0/w,x0); const R=Am*sc; const cy0=st.h/2; x.strokeStyle=P.accent; x.setLineDash([3,4]); x.lineWidth=1.5; x.beginPath(); x.arc(cx,cy0,R,0,7); x.stroke(); const px=cx+Math.cos(phi)*R, py=cy0-Math.sin(phi)*R; x.beginPath(); x.moveTo(px,py); x.lineTo(px,cy0); x.stroke(); x.setLineDash([]); x.fillStyle=P.accent; x.beginPath(); x.arc(px,py,6,0,7); x.fill(); LK.text(x,'point moving in a circle at ω',cx-R,cy0-R-8,P.accent,{size:11}); }
   if(held) LK.text(x,'let go to release',cx,st.h-10,P.muted,{align:'center',size:11});
   if(pend){ const L=st.h*0.75, ang=x0; const bx=cx+Math.sin(ang)*L, by=20+Math.cos(ang)*L; x.fillStyle=P.ink2; x.fillRect(cx-40,14,80,6); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(cx,20); x.lineTo(bx,by); x.stroke(); x.fillStyle=P.brand; x.beginPath(); x.arc(bx,by,14,0,7); x.fill(); x.setLineDash([4,4]); x.strokeStyle=P.line2; x.beginPath(); x.moveTo(cx,20); x.lineTo(cx,20+L+20); x.stroke(); x.setLineDash([]); }
   else { const sc=st.w*0.12/0.1; const wall=30, eq=cx; x.fillStyle=P.ink2; x.fillRect(wall-10,st.h/2-50,10,100); x.fillRect(0,st.h/2+28,st.w*0.62,4); const mx=eq+x0*sc; x.strokeStyle=P.ink2; x.lineWidth=2; LK.spring(x,wall,st.h/2,mx-24,st.h/2,12,10); x.fillStyle=P.brand; LK.rr(x,mx-24,st.h/2-24,48,48,6); x.fill(); x.setLineDash([4,4]); x.strokeStyle=P.line2; x.beginPath(); x.moveTo(eq,st.h/2-50); x.lineTo(eq,st.h/2+50); x.stroke(); x.setLineDash([]); LK.arrow(x,mx,st.h/2-34,mx+v0*sc*0.3,st.h/2-34,P.teal,2.5); LK.arrow(x,mx,st.h/2+40,mx+a*sc*0.03,st.h/2+40,P.accent,2.5); }
   const KE=0.5*m.v*v0*v0*(pend?Lp*Lp:1), PE=0.5*m.v*w2*x0*x0*(pend?Lp*Lp:1), E0=KE+PE; const bx=st.w*0.72, bh=st.h-60, Emax=Math.max(E0,0.5*m.v*w2*(A.v)**2*(pend?Lp*Lp:1));
   [['KE',KE,P.teal],['PE',PE,P.brand],['Total',E0,P.ink2]].forEach(([n,v,col],i)=>{ const hh=bh*Math.min(1,v/Emax); x.fillStyle=col; x.fillRect(bx+i*44,20+bh-hh,32,hh); x.strokeStyle=P.line2; x.strokeRect(bx+i*44,20,32,bh); LK.text(x,n,bx+i*44+16,st.h-24,P.ink2,{align:'center',size:11}); });
   const T=2*Math.PI/w; ro.set('T',LK.fx(T,3)+' s'); ro.set('f',LK.fx(1/T,3)+' Hz'); ro.set('vm',LK.sig(w*A.v*(pend?Lp:1),3)+(pend?' m/s':' m/s')); ro.set('am',LK.sig(w2*A.v*(pend?Lp:1),3)+' m/s²'); ro.set('E',LK.sig(E0,3)+' J');
   if(Math.floor(t*30)%2===0){ const mx=Math.max(...data.map(d=>Math.abs(d[1])))||1, mv=Math.max(...data.map(d=>Math.abs(d[2])))||1, ma=Math.max(...data.map(d=>Math.abs(d[3])))||1;
     pl.set([{pts:data.map(d=>[d[0],d[1]/mx]),color:P.brand,name:'x'},{pts:data.map(d=>[d[0],d[2]/mv]),color:P.teal,name:'v'},{pts:data.map(d=>[d[0],d[3]/ma]),color:P.accent,name:'a'}],{ymin:-1.1,ymax:1.1,xmin:data[0][0],legend:true}); }
 });
 return ()=>S.dispose(); }};

/* ---------- Resonance ---------- */
L.resonance={title:'Forced oscillations and resonance',cat:'Newtonian world',topic:'5.3',desc:'Drive a mass on a spring at any frequency. The resonance curve redraws live as you change the damping; keep a curve to compare.',
icon:'<path d="M10 100 C40 98 50 90 60 20 C70 90 80 98 110 100" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const fd=LK.slider(c,{label:'Driving frequency',min:0.2,max:3,step:0.01,value:0.8,fmt:v=>v.toFixed(2)+' Hz'});
 const b=LK.slider(c,{label:'Damping',min:0.1,max:2,step:0.05,value:0.3,fmt:v=>v.toFixed(2)+' kg/s'});
 LK.button(c,'Keep this curve',()=>{ const P=LK.P(); curves.push({b:b.v,col:[P.teal,P.accent,P.warn,P.brand][curves.length%4]}); if(curves.length>4) curves.shift(); drawCurves(); },'primary');
 LK.button(c,'Clear curves',()=>{curves=[];drawCurves();});
 LK.button(c,'Restart from rest',()=>{ x0=0; v0=0; t=0; });
 const st=LK.stage(el,S,{ratio:0.42,minH:280,maxH:400});
 const ro=LK.readout(el,[['f0','natural frequency f₀'],['amp','steady amplitude'],['now','displacement now'],['ph','phase lag behind driver']]);
 const pl=LK.plot(el,S,{xlab:'driving frequency / Hz',ylab:'amplitude / cm',ratio:0.4});
 LK.note(el,'At low driving frequency the mass follows the driver in phase with a small amplitude. At resonance (driving frequency = natural frequency) energy is transferred most efficiently, the amplitude is a maximum and the mass lags the driver by 90°. Well above f₀ it moves in antiphase (180° lag) with a small amplitude. More damping lowers and broadens the peak, which shifts slightly below f₀. When you change the frequency, wait a few seconds for the motion to settle to the steady amplitude.');
 const m=1, k=(2*Math.PI*1.2)**2*m, F0=0.06; const f0=Math.sqrt(k/m)/(2*Math.PI); let curves=[]; let x0=0,v0=0,t=0;
 const ampOf=(f,bb)=>{ const w=2*Math.PI*f; return 100*(F0/m)/Math.sqrt((k/m-w*w)**2+(bb*w/m)**2); }; // cm
 const curvePts=bb=>Array.from({length:240},(_,i)=>{const f=0.2+i*2.8/239; return [f,ampOf(f,bb)];});
 const peak=ampOf(f0,0.1);
 const drawCurves=()=>{ const P=LK.P(); const s=curves.map(cv=>({pts:curvePts(cv.b),color:cv.col,name:'kept: '+cv.b.toFixed(2)}));
   s.push({pts:curvePts(b.v),color:P.deep||P.brand,w:3.2,name:'now: '+b.v.toFixed(2)});
   s.push({pts:[[fd.v,0],[fd.v,ampOf(fd.v,b.v)]],color:P.ink2,dash:[4,4],name:'driver'});
   pl.set(s,{xmin:0.2,xmax:3,ymin:0,ymax:peak*1.3,legend:true}); };
 drawCurves(); fd.input.addEventListener('input',drawCurves); b.input.addEventListener('input',drawCurves);
 S.loop(dt=>{ const w=2*Math.PI*fd.v; const sub=40; for(let i=0;i<sub;i++){ const h=dt/sub; const a=(F0*Math.cos(w*t)-k*x0-b.v*v0)/m; v0+=a*h; x0+=v0*h; t+=h; }
   const P=LK.P(),x=st.ctx,W=st.w,H=st.h; st.clear();
   const cx=W*0.42, top=18, eq=H*0.6, range=H*0.32, pxcm=range/(peak*1.05);
   // driver (vibration generator) – drawn moving 7 px so you can see its phase
   const drv=-Math.cos(w*t)*7; // up = positive cos
   x.fillStyle=P.ink2; x.fillRect(cx-70,top,140,10);
   x.fillStyle=P.accent; LK.rr(x,cx-22,top+12+drv,44,12,3); x.fill();
   LK.text(x,'driver (vibration generator)',cx+80,top+10,P.muted,{size:11,mono:false});
   const yTop=top+24+drv;
   let disp=x0*100; const clipped=Math.abs(disp)>peak*1.05; disp=Math.max(-peak*1.05,Math.min(peak*1.05,disp));
   const my=eq-disp*pxcm; // mass centre
   x.strokeStyle=P.ink2; x.lineWidth=2; LK.spring(x,cx,yTop,cx,Math.max(yTop+14,my-18),14,10);
   x.fillStyle=P.brand; LK.rr(x,cx-26,my-18,52,36,6); x.fill(); LK.text(x,'m',cx,my+5,'#fff',{align:'center',weight:700,size:13});
   // ruler in cm and the steady amplitude band
   const rx=cx+70; x.strokeStyle=P.line2; x.lineWidth=1; x.beginPath(); x.moveTo(rx,eq-range); x.lineTo(rx,eq+range); x.stroke();
   const stp=LK.nice(peak,4); for(let v=-Math.floor(peak/stp)*stp; v<=peak+1e-9; v+=stp){ const yy=eq-v*pxcm; x.beginPath(); x.moveTo(rx,yy); x.lineTo(rx+8,yy); x.stroke(); LK.text(x,(v>0?'+':'')+(+v.toFixed(1))+' cm',rx+12,yy+4,P.muted,{size:10}); }
   const A=ampOf(fd.v,b.v), Ac=Math.min(A,peak*1.05);
   x.fillStyle=P.soft; x.globalAlpha=.7; x.fillRect(rx-14,eq-Ac*pxcm,10,2*Ac*pxcm); x.globalAlpha=1;
   x.setLineDash([4,4]); x.strokeStyle=P.muted; x.beginPath(); x.moveTo(cx-40,eq); x.lineTo(rx,eq); x.stroke(); x.setLineDash([]);
   LK.text(x,'equilibrium',cx-44,eq+4,P.muted,{size:10,align:'right',mono:false});
   const ph=Math.atan2(b.v*w,(k-m*w*w))*180/Math.PI;
   ro.set('f0',LK.fx(f0,2)+' Hz'); ro.set('amp',LK.fx(A,2)+' cm'); ro.set('now',LK.fx(x0*100,2)+' cm'+(clipped?' (off scale)':'')); ro.set('ph',LK.fx(ph,0)+'°');
 });
 return ()=>S.dispose(); }};

})();
