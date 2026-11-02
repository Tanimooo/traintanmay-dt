/* New and rebuilt labs: wave string, ripple tank, orbits */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;

/* ================= WAVE ON A STRING ================= */
L.string={title:'Wave on a string',cat:'Waves',topic:'4.4',
desc:'Shake the end of a string yourself, send pulses or drive it with an oscillator. See reflection, superposition and stationary waves form.',
howto:'grab the pink handle at the left end and move it up and down to make waves, or pick a driver below. Choose what happens at the right-hand end. Slow time down to watch a reflection.',
icon:'<path d="M5 60 C25 20 35 20 50 60 C65 100 80 100 95 60 C105 35 110 35 115 45" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="8" cy="60" r="7" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const drv=LK.select(c,{label:'Left end',value:'osc',options:[['hand','Moved by hand (drag)'],['osc','Oscillator'],['still','Held still']],on:()=>{}});
 const f=LK.slider(c,{label:'Oscillator frequency',min:0.1,max:3,step:0.01,value:0.75,fmt:v=>v.toFixed(2)+' Hz'});
 const A=LK.slider(c,{label:'Oscillator amplitude',min:0.05,max:0.6,step:0.01,value:0.15,fmt:v=>(v*100).toFixed(0)+' cm'});
 const end=LK.select(c,{label:'Right end',value:'fixed',options:[['fixed','Fixed (tied to a wall)'],['free','Free (on a ring)'],['abs','No reflection (very long string)']]});
 const v=LK.slider(c,{label:'Wave speed (tension)',min:1,max:6,step:0.1,value:3,fmt:v=>v.toFixed(1)+' m/s'});
 const damp=LK.slider(c,{label:'Damping',min:0,max:1,step:0.05,value:0.05,fmt:v=>v.toFixed(2)});
 const c2=LK.ctrl(el); LK.button(c2,'Send a pulse',()=>pulse(1),'primary'); LK.button(c2,'Two pulses meet',()=>twoPulses(1)); LK.button(c2,'Pulse meets inverted pulse',()=>twoPulses(-1)); LK.button(c2,'Flatten string',()=>flatten());
 const c3=LK.ctrl(el); const env=LK.check(c3,'Show envelope (finds nodes)',false); const tr=LK.check(c3,'Track one point',true); const tp=LK.slider(c3,{label:'Tracked point at',min:0.2,max:9.8,step:0.1,value:5,fmt:v=>v.toFixed(1)+' m'});
 const st=LK.stage(el,S,{ratio:0.42,maxH:420,minH:240});
 const ro=LK.readout(el,[['lam','λ = v/f'],['fn','resonances (fixed–fixed)'],['f1','fundamental f₁ = v/2L']]);
 const pl=LK.plot(el,S,{ratio:0.26});
 LK.note(el,'A pulse reflected from a fixed end comes back upside down (a phase change of 180°); from a free end it comes back the right way up. Where two pulses meet, the displacements add (superposition) and then the pulses carry on unchanged. Drive the string at f = n v/2L with a fixed far end and the incoming and reflected waves superpose to form a stationary wave: nodes stay still and antinodes have the largest amplitude. Node spacing is λ/2.');
 const Lm=10, N=250, dx=Lm/N; let y=new Float64Array(N+1), yo=new Float64Array(N+1), yn=new Float64Array(N+1), mx=new Float64Array(N+1), t=0, hand=0, handDrag=false, track=[];
 const flatten=()=>{ y.fill(0); yo.fill(0); mx.fill(0); t=0; track=[]; };
 function setPulse(x0,a,dir){ const w=0.35; const c=v.v, dt=0.9*dx/c; for(let i=0;i<=N;i++){ const g=a*Math.exp(-Math.pow(((i*dx)-x0)/w,2)); y[i]+=g; yo[i]+=a*Math.exp(-Math.pow(((i*dx)-x0+dir*c*dt)/w,2)); } }
 function pulse(){ drv.value='still'; setPulse(1.0,0.3,1); }
 function twoPulses(s){ drv.value='still'; end.value='abs'; flatten(); setPulse(2.0,0.3,1); setPulse(8.0,0.3*s,-1); }
 const T=()=>{ const sc=(st.w-50)/Lm, ys=st.h*0.32; return {sc,X:x=>25+x*sc,Y:q=>st.h/2-q/0.6*ys,iY:p=>(st.h/2-p)/ys*0.6}; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e), Tt=T(); if(p.x<Tt.X(0.8)){ handDrag=true; drv.value='hand'; hand=Math.max(-0.6,Math.min(0.6,Tt.iY(p.y))); st.cv.setPointerCapture(e.pointerId); } });
 S.on(st.cv,'pointermove',e=>{ const p=st.pos(e), Tt=T(); st.cv.style.cursor=p.x<Tt.X(0.8)?'ns-resize':'default'; if(handDrag) hand=Math.max(-0.6,Math.min(0.6,Tt.iY(p.y))); });
 S.on(st.cv,'pointerup',()=>handDrag=false); S.on(st.cv,'pointercancel',()=>handDrag=false);
 let tick=0;
 S.loop(dt=>{ const P=LK.P(), x=st.ctx, Tt=T(); const c=v.v; const h=0.9*dx/c; const r2=(c*h/dx)**2; const steps=Math.min(600,Math.round(dt/h)); const g=damp.v*0.6;
   for(let s=0;s<steps;s++){ t+=h; for(let i=1;i<N;i++){ yn[i]=(2*y[i]-yo[i]*(1-g*h)+r2*(y[i+1]-2*y[i]+y[i-1]))/(1+g*h); }
     if(drv.value==='osc') yn[0]=A.v*Math.sin(2*Math.PI*f.v*t); else if(drv.value==='hand') yn[0]=y[0]+(hand-y[0])*0.05; else yn[0]=0;
     if(end.value==='fixed') yn[N]=0; else if(end.value==='free') yn[N]=yn[N-1]; else { const k=(c*h-dx)/(c*h+dx); yn[N]=y[N-1]+k*(yn[N-1]-y[N]); }
     yo.set(y); y.set(yn); for(let i=0;i<=N;i++){ mx[i]=Math.max(mx[i]*0.9995,Math.abs(y[i])); } }
   if(dt>0){ track.push([t,y[Math.round(tp.v/dx)],y[0]]); if(track.length>600) track.shift(); }
   st.clear(); LK.grid(x,st.w,st.h,24); x.strokeStyle=P.line2; x.setLineDash([4,4]); x.beginPath(); x.moveTo(Tt.X(0),st.h/2); x.lineTo(Tt.X(Lm),st.h/2); x.stroke(); x.setLineDash([]);
   if(env.checked){ x.fillStyle=P.brandSoft||P.soft; x.beginPath(); for(let i=0;i<=N;i++) x.lineTo(Tt.X(i*dx),Tt.Y(mx[i])); for(let i=N;i>=0;i--) x.lineTo(Tt.X(i*dx),Tt.Y(-mx[i])); x.closePath(); x.fill(); }
   x.strokeStyle=P.brand; x.lineWidth=3; x.beginPath(); for(let i=0;i<=N;i++){ const px=Tt.X(i*dx), py=Tt.Y(y[i]); i?x.lineTo(px,py):x.moveTo(px,py); } x.stroke();
   if(end.value==='fixed'){ x.fillStyle=P.ink2; x.fillRect(Tt.X(Lm),st.h/2-60,8,120); } else if(end.value==='free'){ x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.moveTo(Tt.X(Lm)+6,st.h/2-80); x.lineTo(Tt.X(Lm)+6,st.h/2+80); x.stroke(); x.strokeStyle=P.accent; x.beginPath(); x.arc(Tt.X(Lm)+6,Tt.Y(y[N]),6,0,7); x.stroke(); } else { LK.text(x,'… string continues',Tt.X(Lm)-110,st.h/2+70,P.muted,{size:11}); }
   x.fillStyle=P.brand; x.beginPath(); x.arc(Tt.X(0),Tt.Y(y[0]),10,0,7); x.fill(); LK.text(x,drv.value==='hand'?'drag me':'driver',Tt.X(0)+14,Tt.Y(y[0])-12,P.brand,{size:11,weight:700});
   if(tr.checked){ const ix=Math.round(tp.v/dx); x.fillStyle=P.teal; x.beginPath(); x.arc(Tt.X(ix*dx),Tt.Y(y[ix]),7,0,7); x.fill(); }
   for(let m=0;m<=Lm;m++){ x.fillStyle=P.muted; x.fillRect(Tt.X(m),st.h-14,1,6); LK.text(x,m+' m',Tt.X(m),st.h-2,P.muted,{align:'center',size:9}); }
   ro.set('lam',drv.value==='osc'?(c/f.v).toFixed(2)+' m':'–'); ro.set('fn',[1,2,3,4].map(n=>(n*c/(2*Lm)).toFixed(2)).join(', ')+' Hz'); ro.set('f1',(c/(2*Lm)).toFixed(3)+' Hz');
   if((tick++)%4===0&&track.length>1){ pl.set([{pts:track.map(q=>[q[0],q[1]*100]),color:P.teal,name:'tracked point'},{pts:track.map(q=>[q[0],q[2]*100]),color:P.brand,dash:[4,4],name:'left end'}],{xlab:'t / s',ylab:'displacement / cm',xmin:track[0][0],legend:true}); }
 });
 return ()=>S.dispose(); }};

/* ================= RIPPLE TANK ================= */
L.ripple={title:'Ripple tank',cat:'Waves',topic:'4.4',
desc:'A real 2D wave simulation. Drag sources, choose slits, draw your own barriers and see diffraction and two-source interference appear.',
howto:'drag the pink dots to move the sources. Choose a barrier or tick <b>Draw walls</b> and paint on the water. Switch to <b>Intensity</b> to see the bright and dark fringes clearly. Move the pointer over the water to read the path difference (or, with one source or plane waves, the distance in wavelengths).',
icon:'<circle cx="40" cy="60" r="10" fill="currentColor"/><circle cx="40" cy="60" r="25" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="40" cy="60" r="42" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="80" cy="60" r="25" fill="none" stroke="currentColor" stroke-width="3" opacity=".6"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const src=LK.select(c,{label:'Sources',value:'two',options:[['one','One point source'],['two','Two coherent sources'],['plane','Plane waves (straight wavefronts)']],on:()=>reset()});
 const bar=LK.select(c,{label:'Barrier',value:'none',options:[['none','None'],['single','Single slit'],['double','Double slit'],['edge','Edge of a wall']],on:()=>{ src.value=bar.value==='none'?src.value:'plane'; reset(); }});
 const lam=LK.slider(c,{label:'Wavelength',min:6,max:24,step:1,value:12,fmt:v=>v+' mm'});
 const sep=LK.slider(c,{label:'Source / slit separation',min:10,max:70,step:1,value:36,fmt:v=>v+' mm',on:()=>reset()});
 const gap=LK.slider(c,{label:'Slit width',min:4,max:50,step:1,value:12,fmt:v=>v+' mm',on:()=>reset()});
 const ph=LK.slider(c,{label:'Phase difference of sources',min:0,max:360,step:15,value:0,fmt:v=>v+'°'});
 const c2=LK.ctrl(el); const view=LK.select(c2,{label:'Show',value:'wave',options:[['wave','Waves'],['int','Intensity (time-averaged)']]}); const paint=LK.check(c2,'Draw walls with the pointer',false); LK.button(c2,'Clear walls',()=>{ walls.fill(0); applyBarrier(); }); LK.button(c2,'Restart',()=>reset(),'primary');
 const st=LK.stage(el,S,{ratio:0.6,maxH:560,minH:280});
 const ro=LK.readout(el,[['pd','path difference at pointer'],['pl','in wavelengths'],['ty','expected']]);
 LK.note(el,'Each source sends out circular wavefronts; where crest meets crest the water rises twice as high (constructive), where crest meets trough it stays flat (destructive). Lines of constructive interference are where the path difference is a whole number of wavelengths. A gap about the same size as the wavelength diffracts the waves the most; a wide gap barely spreads them. Change the phase difference and the whole pattern shifts sideways.');
 const NX=220, NY=140, mm=1; let u=new Float32Array(NX*NY), uo=new Float32Array(NX*NY), un=new Float32Array(NX*NY), acc=new Float32Array(NX*NY), walls=new Uint8Array(NX*NY), bmask=new Uint8Array(NX*NY), damp=new Float32Array(NX*NY), t=0, accN=0, sources=[], dragS=null, mouse=null;
 for(let j=0;j<NY;j++) for(let i=0;i<NX;i++){ const d=Math.min(i,NX-1-i,j,NY-1-j); damp[j*NX+i]=d<16?Math.pow((16-d)/16,2)*0.25:0; }
 const id=(i,j)=>j*NX+i;
 function applyBarrier(){ bmask.fill(0); const bx=Math.round(NX*0.32); const cy=NY/2; const b=bar.value;
   if(b!=='none'){ for(let j=0;j<NY;j++){ let open=false; const d=(j-cy); if(b==='single') open=Math.abs(d)<=gap.v/2; if(b==='double') open=Math.abs(Math.abs(d)-sep.v/2)<=Math.max(2,gap.v/4); if(b==='edge') open=j<cy; if(!open) for(let k=0;k<3;k++) bmask[id(bx+k,j)]=1; } }
   for(let k=0;k<NX*NY;k++) if(walls[k]) bmask[k]=1; }
 function reset(){ u.fill(0); uo.fill(0); acc.fill(0); accN=0; t=0; const cy=NY/2; if(src.value==='one') sources=[{x:50,y:cy}]; else if(src.value==='two') sources=[{x:50,y:cy-sep.v/2},{x:50,y:cy+sep.v/2}]; else sources=[]; applyBarrier(); }
 reset();
 const img=document.createElement('canvas'); img.width=NX; img.height=NY; const ic=img.getContext('2d'); const im=ic.createImageData(NX,NY);
 const T=()=>{ const sc=Math.min(st.w/NX,st.h/NY); return {sc,ox:(st.w-NX*sc)/2,oy:(st.h-NY*sc)/2}; };
 const toG=p=>{ const Tt=T(); return {i:(p.x-Tt.ox)/Tt.sc,j:(p.y-Tt.oy)/Tt.sc}; };
 S.on(st.cv,'pointerdown',e=>{ const g=toG(st.pos(e)); const s=sources.find(s=>Math.hypot(s.x-g.i,s.y-g.j)<8); if(s){ dragS=s; } else if(paint.checked){ dragS='paint'; } if(dragS) st.cv.setPointerCapture(e.pointerId); if(dragS==='paint') paintAt(g); });
 const paintAt=g=>{ for(let dj=-2;dj<=2;dj++) for(let di=-2;di<=2;di++){ const i=Math.round(g.i+di), j=Math.round(g.j+dj); if(i>0&&j>0&&i<NX-1&&j<NY-1) walls[id(i,j)]=1; } applyBarrier(); };
 S.on(st.cv,'pointermove',e=>{ const g=toG(st.pos(e)); mouse=g; if(dragS==='paint') paintAt(g); else if(dragS){ dragS.x=Math.max(18,Math.min(NX-18,g.i)); dragS.y=Math.max(18,Math.min(NY-18,g.j)); acc.fill(0); accN=0; } });
 S.on(st.cv,'pointerup',()=>dragS=null); S.on(st.cv,'pointerleave',()=>{ mouse=null; });
 S.loop(dt=>{ const P=LK.P(), x=st.ctx; const steps=view.value==='int'?Math.min(12,Math.round(dt*360)):Math.min(3,Math.max(1,Math.round(dt*75))); const k=2*Math.PI/lam.v; const w=k*0.5*1.0; // c=0.5 cells/step
   for(let s=0;s<steps;s++){ t+=1; const c2=0.25;
     for(let j=1;j<NY-1;j++){ const r=j*NX; for(let i=1;i<NX-1;i++){ const q=r+i; if(bmask[q]){ un[q]=0; continue; } un[q]=(2*u[q]-uo[q]+c2*(u[q+1]+u[q-1]+u[q+NX]+u[q-NX]-4*u[q]))*(1-damp[q]); } }
     const amp=0.8; sources.forEach((s,n)=>{ const v=amp*Math.sin(w*t+(n===1?ph.v*Math.PI/180:0)); const i=Math.round(s.x), j=Math.round(s.y); un[id(i,j)]=v; un[id(i+1,j)]=v; un[id(i,j+1)]=v; un[id(i+1,j+1)]=v; });
     if(src.value==='plane'){ const v=amp*Math.sin(w*t); for(let j=1;j<NY-1;j++) un[id(18,j)]=v; }
     const tmp=uo; uo=u; u=un; un=tmp;
     if(view.value==='int'&&t>NX*2.2){ for(let q=0;q<NX*NY;q++) acc[q]+=u[q]*u[q]; accN++; } }
   const d=im.data; const pr=LK.P(); const isInt=view.value==='int'&&accN>10;
   for(let q=0;q<NX*NY;q++){ const o=q*4; if(bmask[q]){ d[o]=50;d[o+1]=18;d[o+2]=38;d[o+3]=255; continue; }
     if(isInt){ const v=Math.min(1,acc[q]/accN*2.2); d[o]=Math.round(22+233*v); d[o+1]=Math.round(8+84*v+90*v*v); d[o+2]=Math.round(26+134*v+60*v*v); d[o+3]=255; }
     else { const v=Math.max(-1,Math.min(1,u[q]*0.55)); if(v>=0){ d[o]=Math.round(236+12*v); d[o+1]=Math.round(230-95*v); d[o+2]=Math.round(236-55*v); } else { const w=-v; d[o]=Math.round(236-120*w); d[o+1]=Math.round(230-60*w); d[o+2]=Math.round(236-50*w); } d[o+3]=255; } }
   ic.putImageData(im,0,0); st.clear(); const Tt=T(); x.imageSmoothingEnabled=true; x.drawImage(img,Tt.ox,Tt.oy,NX*Tt.sc,NY*Tt.sc);
   sources.forEach(s=>{ x.fillStyle=P.brand; x.strokeStyle='#fff'; x.lineWidth=2; x.beginPath(); x.arc(Tt.ox+s.x*Tt.sc,Tt.oy+s.y*Tt.sc,7,0,7); x.fill(); x.stroke(); });
   if(view.value==='int'&&accN<=10) LK.text(x,'building up the average…',st.w/2,22,'#ffd6e8',{align:'center',weight:600});
   const scale=20; const sbc=view.value==='int'?'#ffd6e8':'#3a1027'; x.fillStyle=sbc; x.fillRect(Tt.ox+12,Tt.oy+NY*Tt.sc-16,scale*Tt.sc,3); LK.text(x,scale+' mm',Tt.ox+12,Tt.oy+NY*Tt.sc-22,sbc,{size:10});
   // pointer readouts: work out which points the waves effectively come from in each set-up
   const roEl=el.querySelector('.readout'); const lbl=(k,tx)=>{ const sp=roEl&&roEl.children[k]&&roEl.children[k].querySelector('span'); if(sp&&sp.textContent!==tx) sp.textContent=tx; };
   const lineCol=view.value==='int'?'#ffd6e8':'#3a1027'; const bxp=Math.round(NX*0.32)+1.5, cyp=NY/2;
   const dash=pts=>{ x.strokeStyle=lineCol; x.setLineDash([3,4]); x.lineWidth=1; pts.forEach(s=>{ x.beginPath(); x.moveTo(Tt.ox+s.x*Tt.sc,Tt.oy+s.y*Tt.sc); x.lineTo(Tt.ox+mouse.i*Tt.sc,Tt.oy+mouse.j*Tt.sc); x.stroke(); }); x.setLineDash([]); };
   const inside=mouse&&mouse.i>=0&&mouse.j>=0&&mouse.i<NX&&mouse.j<NY;
   let pair=null, mode2='';
   if(sources.length===2){ pair=sources; mode2='two'; }
   else if(bar.value==='double'){ pair=[{x:bxp,y:cyp-sep.v/2},{x:bxp,y:cyp+sep.v/2}]; mode2='double'; }
   else if(bar.value==='single'){ pair=[{x:bxp,y:cyp-gap.v/2},{x:bxp,y:cyp+gap.v/2}]; mode2='single'; }
   const beyond=bar.value==='none'||(mouse&&mouse.i>bxp+2);
   if(!inside){ lbl(0,'path difference at pointer'); lbl(1,'in wavelengths'); lbl(2,'expected'); ro.set('pd','move the pointer over the water'); ro.set('pl','–'); ro.set('ty','–'); }
   else if(pair&&!beyond){ ro.set('pd','move the pointer past the barrier'); ro.set('pl','–'); ro.set('ty','–'); }
   else if(pair){ const r1=Math.hypot(mouse.i-pair[0].x,mouse.j-pair[0].y), r2=Math.hypot(mouse.i-pair[1].x,mouse.j-pair[1].y); const pd=Math.abs(r1-r2), n=pd/lam.v;
     lbl(0,mode2==='single'?'path difference between slit edges':mode2==='double'?'path difference from the two slits':'path difference at pointer'); lbl(1,'in wavelengths'); lbl(2,'expected');
     ro.set('pd',pd.toFixed(1)+' mm'); ro.set('pl',n.toFixed(2)+' λ');
     if(mode2==='single'){ const fr=n%1; ro.set('ty',n<0.5?'central maximum (bright)':(fr<0.15||fr>0.85)?'minimum (dark): edges differ by '+Math.round(n)+'λ':Math.abs(fr-0.5)<0.2?'weaker side maximum':'in between'); }
     else { const fr=(n+(mode2==='two'?ph.v/360:0))%1; ro.set('ty',fr<0.15||fr>0.85?'constructive (bright)':Math.abs(fr-0.5)<0.15?'destructive (dark)':'in between'); }
     dash(pair); }
   else if(sources.length===1){ const r=Math.hypot(mouse.i-sources[0].x,mouse.j-sources[0].y); const n=r/lam.v;
     lbl(0,'distance from source'); lbl(1,'in wavelengths'); lbl(2,'phase behind the source');
     ro.set('pd',r.toFixed(1)+' mm'); ro.set('pl',n.toFixed(2)+' λ'); ro.set('ty',Math.round((n%1)*360)+'°'); dash(sources); }
   else if(bar.value==='edge'){ const ed={x:bxp,y:cyp}; const r=Math.hypot(mouse.i-ed.x,mouse.j-ed.y);
     lbl(0,'distance from the edge'); lbl(1,'in wavelengths'); lbl(2,'region');
     ro.set('pd',r.toFixed(1)+' mm'); ro.set('pl',(r/lam.v).toFixed(2)+' λ'); ro.set('ty',mouse.i<bxp?'before the wall':mouse.j>cyp?'geometric shadow: waves arrive only by diffraction':'open water, direct waves'); dash([ed]); }
   else { const r=Math.max(0,mouse.i-18); const n=r/lam.v;
     lbl(0,'distance from the wave source'); lbl(1,'in wavelengths'); lbl(2,'phase behind the source');
     ro.set('pd',r.toFixed(1)+' mm'); ro.set('pl',n.toFixed(2)+' λ'); ro.set('ty',Math.round((n%1)*360)+'°'); }
 });
 return ()=>S.dispose(); }};

/* ================= ORBITS ================= */
const BODIES={earth:{n:'Earth',GM:3.986e14,R:6.37e6,col:'#2a8f86'},moon:{n:'Moon',GM:4.90e12,R:1.74e6,col:'#9a8f99'},mars:{n:'Mars',GM:4.28e13,R:3.39e6,col:'#c4573a'},jupiter:{n:'Jupiter',GM:1.267e17,R:6.99e7,col:'#c99a62'}};
L.orbit={title:'Orbits and gravitational fields',cat:'Newtonian world',topic:'5.4',
desc:'Launch satellites by dragging. Find circular orbits, ellipses and escape speed, check Kepler’s laws and read g and V anywhere.',
howto:'in <b>Aim</b> mode, press on space where you want the satellite to start and drag to set its velocity, then let go. Add several satellites to compare periods. Hover over space to read the field strength and potential there.',
icon:'<circle cx="60" cy="60" r="16" fill="currentColor"/><ellipse cx="60" cy="60" rx="50" ry="30" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="110" cy="60" r="6" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const body=LK.select(c,{label:'Central body',value:'earth',options:Object.entries(BODIES).map(([k,b])=>[k,b.n]),on:()=>{ sats=[]; zoom=4; }});
 const warp=LK.slider(c,{label:'Time warp',min:100,max:20000,step:100,value:3000,fmt:v=>'×'+v});
 const zm=LK.slider(c,{label:'Zoom out',min:2,max:30,step:0.5,value:4,fmt:v=>'±'+v+' radii',on:v=>{zoom=v;}});
 const kep=LK.check(c,'Kepler’s 2nd law: shade equal-time areas',false); LK.el; c.appendChild(LK.el('<a class="btn btn-sm" href="#lab-missions">Famous missions mode →</a>'));
 const c2=LK.ctrl(el); LK.button(c2,'Circular orbit',()=>addPreset(1),'primary'); LK.button(c2,'Ellipse',()=>addPreset(1.2)); LK.button(c2,'Escape speed',()=>addPreset(Math.SQRT2*1.001)); LK.button(c2,'Geostationary',()=>{ body.value='earth'; zoom=8; zm.set(8); const r=4.22e7; sats.push(mk(r,0,0,Math.sqrt(BODIES.earth.GM/r))); }); LK.button(c2,'Clear',()=>{ sats=[]; });
 const st=LK.stage(el,S,{ratio:0.62,maxH:600,minH:300});
 const ro=LK.readout(el,[['r','r (latest satellite)'],['v','speed'],['T','period'],['E','total energy per kg'],['g','g at pointer'],['V','V at pointer']]);
 const tw=LK.el('<div class="tbl"></div>'); el.appendChild(tw);
 LK.note(el,'Gravity provides the centripetal force: GMm/r² = mv²/r, so a circular orbit needs v = √(GM/r) and has period T = 2π√(r³/GM). Compare T² against r³ for several circular satellites in the table: the ratio is the same (Kepler’s 3rd law). In an ellipse the satellite speeds up near the planet and the shaded equal-time areas are equal (Kepler’s 2nd law). At v = √(2GM/r) the total energy reaches zero and the satellite escapes.');
 let sats=[], zoom=4, aim=null, mouse=null, simT=0;
 const B=()=>BODIES[body.value];
 const mk=(x,y,vx,vy)=>({x,y,vx,vy,trail:[],col:[LK.P().brand,LK.P().accent,LK.P().teal,LK.P().warn,LK.P().deep][sats.length%5],t:0,lastSweep:0,sweeps:[],r0:Math.hypot(x,y),period:null,ang:0,lastAng:Math.atan2(y,x)});
 const addPreset=k=>{ const b=B(); const r=b.R*(1.6+sats.length*0.5); sats.push(mk(r,0,0,k*Math.sqrt(b.GM/r))); };
 const Tf=()=>{ const b=B(); const sc=Math.min(st.w,st.h)/2/(zoom*b.R); return {sc,cx:st.w/2,cy:st.h/2,X:v=>st.w/2+v*sc,Y:v=>st.h/2-v*sc,iX:p=>(p-st.w/2)/sc,iY:p=>(st.h/2-p)/sc}; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e), T=Tf(); const wx=T.iX(p.x), wy=T.iY(p.y); if(Math.hypot(wx,wy)>B().R*1.02){ aim={x:wx,y:wy,px:p.x,py:p.y,ex:p.x,ey:p.y}; st.cv.setPointerCapture(e.pointerId); } });
 S.on(st.cv,'pointermove',e=>{ const p=st.pos(e), T=Tf(); mouse={x:T.iX(p.x),y:T.iY(p.y)}; if(aim){ aim.ex=p.x; aim.ey=p.y; } });
 const vScale=()=>{ const T=Tf(); return Math.sqrt(B().GM/(B().R*2))/(80); }; // px → m/s
 S.on(st.cv,'pointerup',()=>{ if(aim){ const vs=vScale(); const vx=(aim.ex-aim.px)*vs, vy=-(aim.ey-aim.py)*vs; sats.push(mk(aim.x,aim.y,vx,vy)); if(sats.length>5) sats.shift(); aim=null; } });
 S.on(st.cv,'pointerleave',()=>{ mouse=null; });
 let tick=0;
 S.loop(dt=>{ const P=LK.P(), x=st.ctx, T=Tf(), b=B(); const tt=dt*warp.v; const sub=Math.max(20,Math.min(800,Math.round(tt/20)));
   sats.forEach(s=>{ if(s.crashed) return; for(let i=0;i<sub;i++){ const h=tt/sub; const r=Math.hypot(s.x,s.y); if(r<b.R){ s.crashed=true; break; } const a=-b.GM/(r*r*r); s.vx+=a*s.x*h; s.vy+=a*s.y*h; s.x+=s.vx*h; s.y+=s.vy*h; s.t+=h;
       const an=Math.atan2(s.y,s.x); let d=an-s.lastAng; if(d>Math.PI) d-=2*Math.PI; if(d<-Math.PI) d+=2*Math.PI; s.ang+=d; s.lastAng=an; if(!s.period&&Math.abs(s.ang)>=2*Math.PI) s.period=s.t; }
     if(dt>0){ s.trail.push([s.x,s.y]); if(s.trail.length>2500) s.trail.shift(); const Tp=s.period||2*Math.PI*Math.sqrt(Math.pow(s.r0,3)/b.GM); if(s.t-s.lastSweep>Tp/12){ s.lastSweep=s.t; s.sweeps.push(s.trail.length-1); if(s.sweeps.length>13) s.sweeps.shift(); } } });
   st.clear(); x.fillStyle=P.ink2; for(let i=0;i<60;i++){ const a=i*2.39996, rr=((i*73)%100)/100; x.globalAlpha=0.5; x.fillRect(st.w/2+Math.cos(a)*rr*st.w*0.55,st.h/2+Math.sin(a)*rr*st.h*0.55,1.6,1.6); } x.globalAlpha=1;
   const grd=x.createRadialGradient(T.cx-b.R*T.sc*0.3,T.cy-b.R*T.sc*0.3,2,T.cx,T.cy,b.R*T.sc); grd.addColorStop(0,b.col); grd.addColorStop(1,P.deep); x.fillStyle=grd; x.beginPath(); x.arc(T.cx,T.cy,b.R*T.sc,0,7); x.fill();
   sats.forEach((s,k)=>{ if(kep.checked&&s.sweeps.length>1){ for(let q=0;q<s.sweeps.length-1;q+=2){ const a0=s.sweeps[q], a1=s.sweeps[q+1]; if(a1==null) break; x.fillStyle=s.col; x.globalAlpha=0.18; x.beginPath(); x.moveTo(T.cx,T.cy); for(let m=a0;m<=a1;m++){ const p=s.trail[m]; if(p) x.lineTo(T.X(p[0]),T.Y(p[1])); } x.closePath(); x.fill(); x.globalAlpha=1; } }
     x.strokeStyle=s.col; x.lineWidth=1.8; x.beginPath(); s.trail.forEach((p,m)=>m?x.lineTo(T.X(p[0]),T.Y(p[1])):x.moveTo(T.X(p[0]),T.Y(p[1]))); x.stroke();
     const sx=T.X(s.x), sy=T.Y(s.y); x.fillStyle=s.col; x.beginPath(); x.arc(sx,sy,5,0,7); x.fill(); if(!s.crashed){ const r=Math.hypot(s.x,s.y); LK.arrow(x,sx,sy,sx-s.x/r*22,sy+s.y/r*22,P.ink2,1.5,7); } else LK.text(x,'crashed',sx+6,sy,P.bad,{size:11,weight:700}); });
   if(aim){ LK.arrow(x,aim.px,aim.py,aim.ex,aim.ey,P.accent,3,11); const vs=vScale(); const v=Math.hypot(aim.ex-aim.px,aim.ey-aim.py)*vs; const r=Math.hypot(aim.x,aim.y); LK.text(x,(v/1000).toFixed(2)+' km/s (circular '+(Math.sqrt(b.GM/r)/1000).toFixed(2)+', escape '+(Math.sqrt(2*b.GM/r)/1000).toFixed(2)+')',aim.ex+10,aim.ey-10,P.accent,{weight:700,size:12}); }
   const s=sats[sats.length-1]; if(s){ const r=Math.hypot(s.x,s.y), v=Math.hypot(s.vx,s.vy), E=0.5*v*v-b.GM/r; ro.set('r',LK.sig(r/1000,4)+' km'); ro.set('v',LK.sig(v/1000,3)+' km/s'); ro.set('T',s.period?LK.sig(s.period/3600,3)+' h':(E<0?'measuring…':'none (escapes)')); ro.set('E',LK.sig(E,3)+' J/kg'+(E>=0?' (≥ 0: escapes)':'')); } else { ['r','v','T','E'].forEach(k=>ro.set(k,'–')); }
   if(mouse){ const r=Math.hypot(mouse.x,mouse.y); if(r>b.R){ ro.set('g',LK.sig(b.GM/r/r,3)+' N/kg'); ro.set('V',LK.sig(-b.GM/r,3)+' J/kg'); } }
   if((tick++)%30===0){ tw.innerHTML=sats.length?`<table><tr><th>Satellite</th><th>start r / km</th><th>period T / h</th><th>T²/r³ / s² m⁻³</th><th>4π²/GM</th></tr>${sats.map((s,i)=>`<tr><td><span class="rag" style="background:${s.col}"></span> ${i+1}</td><td>${LK.sig(s.r0/1000,4)}</td><td>${s.period?LK.sig(s.period/3600,4):'…'}</td><td>${s.period?LK.sig(s.period**2/Math.pow(s.r0,3),3):'…'}</td><td>${LK.sig(4*Math.PI**2/b.GM,3)}</td></tr>`).join('')}</table><p class="muted" style="margin:6px 8px;font-size:.85rem">For circular orbits T²/r³ matches 4π²/GM. For ellipses use the semi-major axis instead of the starting radius.</p>`:''; }
 });
 return ()=>S.dispose(); }};
})();
