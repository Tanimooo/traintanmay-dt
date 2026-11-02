/* Waves and quantum labs */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const h=6.63e-34, c=3e8, e=1.6e-19, me=9.11e-31;

/* ---------- Wave machine ---------- */
L.wave={title:'Wave machine',cat:'Waves',topic:'4.4',desc:'Transverse and longitudinal waves side by side. Change f, λ and amplitude; track particles and measure phase difference.',
icon:'<path d="M5 60 C20 20 35 20 50 60 C65 100 80 100 95 60 C105 35 110 35 115 45" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const f=LK.slider(ct,{label:'Frequency',min:0.2,max:3,step:0.1,value:1,fmt:v=>v.toFixed(1)+' Hz'}), lam=LK.slider(ct,{label:'Wavelength',min:0.5,max:4,step:0.1,value:2,fmt:v=>v.toFixed(1)+' m'}), A=LK.slider(ct,{label:'Amplitude',min:0.1,max:1,step:0.05,value:0.6,fmt:v=>v.toFixed(2)+' m'});
 const p1=LK.slider(ct,{label:'Marker P at',min:0,max:8,step:0.1,value:1,fmt:v=>v.toFixed(1)+' m'}), p2=LK.slider(ct,{label:'Marker Q at',min:0,max:8,step:0.1,value:2,fmt:v=>v.toFixed(1)+' m'});
 const pause=LK.check(ct,'Pause',false);
 const st=LK.stage(el,S,{ratio:0.55});
 const ro=LK.readout(el,[['v','v = fλ'],['T','period T'],['ph','phase difference P–Q'],['I','relative intensity ∝ A²']]);
 LK.note(el,'Each particle oscillates about a fixed position; only energy travels along the wave. Phase difference = (distance ÷ λ) × 360°. Points one wavelength apart are in phase; half a wavelength apart, in antiphase. In the longitudinal wave look for compressions (close together) and rarefactions (spread out).');
 let t=0; S.loop(dt=>{ if(!pause.checked) t+=dt; const P=LK.P(),x=st.ctx; st.clear(); LK.grid(x,st.w,st.h,24); const W=st.w, len=8, sc=(W-40)/len; const k=2*Math.PI/lam.v, w=2*Math.PI*f.v; const y1=st.h*0.28, y2=st.h*0.75, as=st.h*0.18;
   x.strokeStyle=P.line2; x.beginPath(); x.moveTo(20,y1); x.lineTo(W-20,y1); x.stroke();
   x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); for(let i=0;i<=300;i++){ const xx=i/300*len; const y=A.v*Math.sin(w*t-k*xx); i?x.lineTo(20+xx*sc,y1-y*as):x.moveTo(20+xx*sc,y1-y*as); } x.stroke();
   [[p1.v,P.accent,'P'],[p2.v,P.teal,'Q']].forEach(([xx,col,l])=>{ const y=A.v*Math.sin(w*t-k*xx); x.fillStyle=col; x.beginPath(); x.arc(20+xx*sc,y1-y*as,7,0,7); x.fill(); LK.text(x,l,20+xx*sc-4,y1-as-14,col,{weight:700}); });
   LK.text(x,'transverse',22,18,P.muted,{size:11}); LK.text(x,'longitudinal',22,st.h*0.52,P.muted,{size:11});
   for(let i=0;i<=80;i++){ const x0=i/80*len; const d=A.v*0.35*Math.sin(w*t-k*x0); const px=20+(x0+d)*sc; x.strokeStyle=(Math.abs(x0-p1.v)<0.05)?P.accent:(Math.abs(x0-p2.v)<0.05)?P.teal:P.ink2; x.lineWidth=(Math.abs(x0-p1.v)<0.05||Math.abs(x0-p2.v)<0.05)?3:1.5; x.beginPath(); x.moveTo(px,y2-st.h*0.12); x.lineTo(px,y2+st.h*0.12); x.stroke(); }
   let ph=((Math.abs(p2.v-p1.v)/lam.v)*360)%360; ro.set('v',LK.fx(f.v*lam.v,2)+' m/s'); ro.set('T',LK.fx(1/f.v,2)+' s'); ro.set('ph',LK.fx(ph,0)+'° ('+LK.fx(ph*Math.PI/180,2)+' rad)'); ro.set('I',LK.fx(A.v*A.v/0.36,2)+' ×');
 });
 return ()=>S.dispose(); }};

/* ---------- Superposition ---------- */
L.superpose={title:'Superposition and phase',cat:'Waves',topic:'4.4',desc:'Add two waves with any amplitude, frequency and phase difference. See constructive and destructive interference and beats.',
icon:'<path d="M5 45 C25 20 35 20 55 45 C75 70 85 70 115 45" fill="none" stroke="currentColor" stroke-width="3"/><path d="M5 80 C25 50 35 50 55 80 C75 110 85 110 115 80" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const A1=LK.slider(ct,{label:'Amplitude 1',min:0,max:1,step:0.05,value:0.8}), A2=LK.slider(ct,{label:'Amplitude 2',min:0,max:1,step:0.05,value:0.8});
 const f2=LK.slider(ct,{label:'Frequency 2 (× f₁)',min:0.5,max:2,step:0.01,value:1,fmt:v=>v.toFixed(2)}), ph=LK.slider(ct,{label:'Phase difference',min:0,max:360,step:5,value:0,fmt:v=>v+'°'});
 const st=LK.stage(el,S,{ratio:0.6});
 LK.note(el,'At every point the resultant displacement is the sum of the individual displacements. Phase difference 0° (path difference nλ): constructive, amplitude A₁ + A₂. Phase difference 180° (path difference (n + ½)λ): destructive, amplitude |A₁ − A₂|. Slightly different frequencies produce beats.');
 let t=0; S.loop(dt=>{ t+=dt*0.4; const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const rows=[H*0.17,H*0.43,H*0.76], as=H*0.1;
   const w1=(xx)=>A1.v*Math.sin(2*Math.PI*(xx*3-t)), w2=(xx)=>A2.v*Math.sin(2*Math.PI*(xx*3*f2.v-t*f2.v)+ph.v*Math.PI/180);
   const draw=(fn,y0,col,amp)=>{ x.strokeStyle=P.line2; x.lineWidth=1; x.beginPath(); x.moveTo(10,y0); x.lineTo(W-10,y0); x.stroke(); x.strokeStyle=col; x.lineWidth=2.5; x.beginPath(); for(let i=0;i<=400;i++){ const xx=i/400; const y=fn(xx); i?x.lineTo(10+xx*(W-20),y0-y*amp):x.moveTo(10+xx*(W-20),y0-y*amp); } x.stroke(); };
   draw(w1,rows[0],P.brand,as); draw(w2,rows[1],P.teal,as); draw(xx=>w1(xx)+w2(xx),rows[2],P.ink,as);
   LK.text(x,'wave 1',14,rows[0]-as-4,P.brand,{size:11}); LK.text(x,'wave 2',14,rows[1]-as-4,P.teal,{size:11}); LK.text(x,'resultant',14,rows[2]-as*2-4,P.ink,{size:11});
   const res=Math.sqrt(A1.v**2+A2.v**2+2*A1.v*A2.v*Math.cos(ph.v*Math.PI/180)); if(Math.abs(f2.v-1)<0.005) LK.text(x,'resultant amplitude = '+LK.fx(res,2),W-200,rows[2]-as*2-4,P.ink2,{size:12,weight:600});
 });
 return ()=>S.dispose(); }};

/* ---------- Stationary waves ---------- */
L.stationary={title:'Stationary waves and harmonics',cat:'Waves',topic:'4.4',desc:'Strings fixed at both ends and pipes open or closed. Step through harmonics and measure node spacing.',
icon:'<path d="M10 60 Q35 15 60 60 Q85 105 110 60" fill="none" stroke="currentColor" stroke-width="5"/><path d="M10 60 Q35 105 60 60 Q85 15 110 60" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5 5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const sys=LK.select(ct,{label:'System',value:'string',options:[['string','String fixed at both ends'],['open','Pipe open at both ends'],['closed','Pipe closed at one end']]});
 const n=LK.slider(ct,{label:'Harmonic',min:1,max:6,step:1,value:2}), Lr=LK.slider(ct,{label:'Length',min:0.3,max:1.5,step:0.05,value:1,fmt:v=>v.toFixed(2)+' m'}), v=LK.slider(ct,{label:'Wave speed',min:50,max:400,step:10,value:340,fmt:v=>v+' m/s'});
 const show=LK.check(ct,'Show the two travelling waves',false);
 const st=LK.stage(el,S,{ratio:0.4});
 const ro=LK.readout(el,[['lam','wavelength'],['f','frequency'],['nn','node spacing λ/2'],['f1','fundamental f₁']]);
 LK.note(el,'A stationary wave forms when two waves of the same frequency travel in opposite directions and superpose. Nodes have zero amplitude; antinodes maximum. String and open pipe: L = nλ/2, all harmonics. Closed pipe: L = (2n − 1)λ/4, odd harmonics only, with a node at the closed end and an antinode at the open end. For pipes the curve shows the air’s displacement amplitude.');
 let t=0; S.loop(dt=>{ t+=dt; const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const ox=30, len=W-60, cy=H/2, amp=H*0.3; const s=sys.value, N=n.v;
   let lam, fn; if(s==='closed'){ const m=2*N-1; lam=4*Lr.v/m; fn=xx=>Math.sin(2*Math.PI*xx/lam*Lr.v); } else if(s==='open'){ lam=2*Lr.v/N; fn=xx=>Math.cos(2*Math.PI*xx/lam*Lr.v); } else { lam=2*Lr.v/N; fn=xx=>Math.sin(2*Math.PI*xx/lam*Lr.v); }
   const fr=v.v/lam, w=2*Math.PI*0.6;
   if(s!=='string'){ x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.moveTo(ox,cy-amp-10); x.lineTo(ox+len,cy-amp-10); x.moveTo(ox,cy+amp+10); x.lineTo(ox+len,cy+amp+10); x.stroke(); if(s==='closed'){ x.lineWidth=6; x.beginPath(); x.moveTo(ox+len,cy-amp-10); x.lineTo(ox+len,cy+amp+10); x.stroke(); } }
   else { x.fillStyle=P.ink2; x.fillRect(ox-6,cy-30,6,60); x.fillRect(ox+len,cy-30,6,60); }
   const xs=xx=>ox+xx*len; const pts=k=>{ x.beginPath(); for(let i=0;i<=300;i++){ const xx=i/300; const y=k(xx); i?x.lineTo(xs(xx),cy-y*amp):x.moveTo(xs(xx),cy-y*amp);} x.stroke(); };
   x.strokeStyle=P.line2; x.lineWidth=1; x.setLineDash([4,4]); pts(xx=>fn(xx)); pts(xx=>-fn(xx)); x.setLineDash([]);
   if(show.checked){ const kx=2*Math.PI*Lr.v/lam; x.lineWidth=1.5; x.strokeStyle=P.teal; pts(xx=>0.5*Math.sin(kx*xx-w*t)*(s==='open'?1:1)); x.strokeStyle=P.accent; pts(xx=>0.5*Math.sin(kx*xx+w*t+(s==='open'?Math.PI:0))*(s==='open'?-1:1)); }
   x.strokeStyle=P.brand; x.lineWidth=3; pts(xx=>fn(xx)*Math.cos(w*t));
   for(let i=0;i<=300;i++){ const xx=i/300, a=fn(xx), b=fn(xx+1/300); if(i<300&&(a===0||a*b<0)){ x.fillStyle=P.ink; x.beginPath(); x.arc(xs(xx),cy,4,0,7); x.fill(); LK.text(x,'N',xs(xx)-4,cy+amp+28,P.muted,{size:11}); } }
   ro.set('lam',LK.fx(lam,3)+' m'); ro.set('f',LK.sig(fr,3)+' Hz'); ro.set('nn',LK.fx(lam/2,3)+' m'); ro.set('f1',LK.sig(s==='closed'?v.v/(4*Lr.v):v.v/(2*Lr.v),3)+' Hz');
 });
 return ()=>S.dispose(); }};

/* ---------- Young's double slit & grating ---------- */
L.youngs={title:'Double slit and diffraction grating',cat:'Waves',topic:'4.4',desc:'Shine a laser through two slits or a grating. Vary λ, slit separation and screen distance and measure the fringes.',
icon:'<path d="M20 10 V50 M20 58 V62 M20 70 V110" stroke="currentColor" stroke-width="6"/><path d="M100 10 V110" stroke="currentColor" stroke-width="4"/><path d="M85 25 H100 M85 45 H100 M85 65 H100 M85 85 H100" stroke="currentColor" stroke-width="6"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const mode=LK.select(ct,{label:'Aperture',value:'two',options:[['two','Young’s double slit'],['grat','Diffraction grating']]});
 const lam=LK.slider(ct,{label:'Wavelength',min:400,max:700,step:5,value:633,fmt:v=>v+' nm'}), a=LK.slider(ct,{label:'Slit separation a',min:0.1,max:1,step:0.05,value:0.5,fmt:v=>v.toFixed(2)+' mm'}), D=LK.slider(ct,{label:'Screen distance D',min:0.5,max:3,step:0.1,value:2,fmt:v=>v.toFixed(1)+' m'});
 const N=LK.slider(ct,{label:'Grating lines per mm',min:100,max:600,step:10,value:300});
 const st=LK.stage(el,S,{ratio:0.5});
 const ro=LK.readout(el,[['x','fringe spacing x = λD/a'],['n','max order (grating)'],['th','first-order angle']]);
 LK.note(el,'Double slit: bright fringes where the path difference is a whole number of wavelengths; x = λD/a when a ≪ D. Measure across several fringes and divide to reduce uncertainty. Grating: d sin θ = nλ with d = 1/(lines per metre), giving sharp, bright, widely spaced maxima. Highest order n ≤ d/λ.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const col=LK.wl2rgb(lam.v); const lm=lam.v*1e-9;
   const sx=W*0.62; x.fillStyle=P.deep; x.fillRect(sx,10,10,H-20);
   const xsF=lm*D.v/(a.v*1e-3), dG=1e-3/N.v; const screenH=H-20; const halfW=mode.value==='two'?6.5*xsF:Math.min(D.v*3,D.v*Math.tan(Math.asin(Math.min(0.99,Math.min(3,Math.floor(dG/lm))*lm/dG)))*1.25); // metres shown each side
   const img=x.createImageData(Math.round(W*0.3),1);
   for(let py=0;py<screenH;py++){ const yy=(py/screenH-0.5)*2*halfW; let I; if(mode.value==='two'){ const am=a.v*1e-3; const th=Math.atan(yy/D.v); const beta=Math.PI*am*Math.sin(th)/lm; const env=(()=>{ const b=Math.PI*0.06e-3*Math.sin(th)/lm; return b?Math.pow(Math.sin(b)/b,2):1; })(); I=Math.pow(Math.cos(beta),2)*env; } else { const d=1e-3/N.v; const th=Math.atan(yy/D.v); const ph=Math.PI*d*Math.sin(th)/lm; const n=40; const s=Math.sin(ph); I=Math.abs(s)<1e-6?1:Math.pow(Math.sin(n*ph)/(n*s),2); }
     x.fillStyle=col; x.globalAlpha=Math.min(1,I*1.1); x.fillRect(sx+12,10+py,W*0.3,1); }
   x.globalAlpha=1;
   x.fillStyle=col; x.fillRect(20,H/2-6,W*0.12,12); LK.text(x,'laser',20,H/2-12,P.muted,{size:11});
   x.fillStyle=P.ink2; x.fillRect(W*0.2,10,6,H/2-22); x.fillRect(W*0.2,H/2-8,6,16); x.fillRect(W*0.2,H/2+16,6,H/2-26);
   x.strokeStyle=col; x.globalAlpha=0.25; for(let i=-6;i<=6;i++){ x.beginPath(); x.moveTo(W*0.2+6,H/2); x.lineTo(sx,H/2+i*H/12); x.stroke(); } x.globalAlpha=1;
   LK.text(x,'D = '+D.v+' m',W*0.38,H-14,P.ink2,{size:12}); LK.text(x,'screen: ±'+LK.sig(halfW*100,2)+' cm shown',sx-20,H-2,P.muted,{size:10});
   const xs=lm*D.v/(a.v*1e-3); const d=1e-3/N.v; ro.set('x',LK.sig(xs*1000,3)+' mm'); ro.set('n',String(Math.floor(d/lm))); ro.set('th',mode.value==='grat'?LK.fx(Math.asin(Math.min(1,lm/d))*180/Math.PI,1)+'°':LK.fx(Math.atan(xs/D.v)*180/Math.PI,3)+'°');
 });
 return ()=>S.dispose(); }};

/* ---------- Refraction & TIR ---------- */
L.refraction={title:'Refraction and total internal reflection',cat:'Waves',topic:'4.4',desc:'Shine a ray across a boundary. Change refractive indices and the angle; find the critical angle and TIR.',
icon:'<path d="M5 60 H115" stroke="currentColor" stroke-width="3"/><path d="M20 10 L60 60 L80 110" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const n1=LK.select(ct,{label:'Medium 1 (ray starts here)',value:'1.50',options:[['1.00','Air 1.00'],['1.33','Water 1.33'],['1.50','Glass 1.50'],['2.42','Diamond 2.42']]}), n2=LK.select(ct,{label:'Medium 2',value:'1.00',options:[['1.00','Air 1.00'],['1.33','Water 1.33'],['1.50','Glass 1.50'],['2.42','Diamond 2.42']]});
 const th=LK.slider(ct,{label:'Angle of incidence',min:0,max:89,step:0.5,value:35,fmt:v=>v.toFixed(1)+'°'});
 const st=LK.stage(el,S,{ratio:0.6});
 const ro=LK.readout(el,[['r','angle of refraction'],['C','critical angle'],['v','speed in medium 1'],['s','state']]);
 LK.note(el,'n₁ sin θ₁ = n₂ sin θ₂ and n = c/v. Going into a denser medium the ray bends towards the normal. From a higher to a lower refractive index, if θ₁ exceeds the critical angle C (sin C = n₂/n₁) all the light is reflected: total internal reflection, as in optical fibres.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h,cx=W/2,cy=H/2; const a=+n1.value,b=+n2.value; const t1=th.v*Math.PI/180; const s2=a*Math.sin(t1)/b;
   x.fillStyle=P.soft; x.globalAlpha=0.3+(a-1)*0.3; x.fillRect(0,0,W,cy); x.globalAlpha=0.15+(b-1)*0.3; x.fillStyle=P.tealSoft||P.soft; x.fillRect(0,cy,W,cy); x.globalAlpha=1;
   x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(0,cy); x.lineTo(W,cy); x.stroke(); x.setLineDash([5,5]); x.beginPath(); x.moveTo(cx,10); x.lineTo(cx,H-10); x.stroke(); x.setLineDash([]);
   const R=Math.min(W,H)*0.45; const ix=cx-Math.sin(t1)*R, iy=cy-Math.cos(t1)*R; LK.arrow(x,ix,iy,cx,cy,P.brand,3);
   const tir=s2>=1; const rf=tir?1:Math.pow((a*Math.cos(t1)-b*Math.sqrt(1-s2*s2))/(a*Math.cos(t1)+b*Math.sqrt(1-s2*s2)),2);
   x.globalAlpha=Math.max(0.15,rf); LK.arrow(x,cx,cy,cx+Math.sin(t1)*R,cy-Math.cos(t1)*R,P.brand,3); x.globalAlpha=1;
   if(!tir){ const t2=Math.asin(s2); LK.arrow(x,cx,cy,cx+Math.sin(t2)*R,cy+Math.cos(t2)*R,P.accent,3); ro.set('r',LK.fx(t2*180/Math.PI,1)+'°'); ro.set('s','refraction (+ partial reflection)'); } else { ro.set('r','–'); ro.set('s','TOTAL INTERNAL REFLECTION'); }
   LK.text(x,'n = '+a,12,22,P.ink2,{weight:600}); LK.text(x,'n = '+b,12,H-12,P.ink2,{weight:600});
   ro.set('C',a>b?LK.fx(Math.asin(b/a)*180/Math.PI,1)+'°':'none (n₁ ≤ n₂)'); ro.set('v',LK.sig(3e8/a,3)+' m/s');
 });
 return ()=>S.dispose(); }};

/* ---------- Polarisation ---------- */
L.polarise={title:'Polarisation',cat:'Waves',topic:'4.4',desc:'Pass light through a polariser and an analyser, or rotate a microwave receiver. See Malus’s law in action.',
icon:'<circle cx="35" cy="60" r="25" fill="none" stroke="currentColor" stroke-width="4"/><path d="M35 35 V85" stroke="currentColor" stroke-width="4"/><circle cx="90" cy="60" r="25" fill="none" stroke="currentColor" stroke-width="4"/><path d="M65 60 H115" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const th=LK.slider(ct,{label:'Analyser angle',min:0,max:360,step:1,value:30,fmt:v=>v+'°'}); const spin=LK.check(ct,'Rotate automatically',false);
 const st=LK.stage(el,S,{ratio:0.38});
 const ro=LK.readout(el,[['I','transmitted intensity I/I₀'],['m','Malus I = I₀cos²θ']]);
 const pl=LK.plot(el,S,{xlab:'angle θ / °',ylab:'I / I₀',ratio:0.3});
 LK.note(el,'Unpolarised light oscillates in all planes perpendicular to its direction. The first filter transmits one plane (and half the intensity). The analyser transmits the component of the amplitude along its axis, A cos θ, so intensity ∝ cos²θ. Crossed filters (90°) block all light. Only transverse waves can be polarised.');
 let ang=th.v; S.loop(dt=>{ if(spin.checked){ ang=(ang+dt*40)%360; th.set(Math.round(ang)); } else ang=th.v; const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h,cy=H/2; const I=Math.cos(ang*Math.PI/180)**2;
   const disc=(cx,a,lab)=>{ x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.ellipse(cx,cy,18,H*0.32,0,0,7); x.stroke(); x.strokeStyle=P.brand; x.beginPath(); x.moveTo(cx-Math.sin(a)*14,cy-Math.cos(a)*H*0.28); x.lineTo(cx+Math.sin(a)*14,cy+Math.cos(a)*H*0.28); x.stroke(); LK.text(x,lab,cx,H-6,P.muted,{align:'center',size:11}); };
   for(let i=0;i<6;i++){ const a=i*Math.PI/6; x.strokeStyle=P.accent; x.lineWidth=1.5; x.beginPath(); x.moveTo(W*0.1-Math.sin(a)*20,cy-Math.cos(a)*20); x.lineTo(W*0.1+Math.sin(a)*20,cy+Math.cos(a)*20); x.stroke(); }
   disc(W*0.3,0,'polariser'); x.strokeStyle=P.accent; x.lineWidth=2.5; x.beginPath(); x.moveTo(W*0.48,cy-30); x.lineTo(W*0.48,cy+30); x.stroke(); disc(W*0.62,ang*Math.PI/180,'analyser');
   x.fillStyle=`rgba(255,200,60,${I})`; x.beginPath(); x.arc(W*0.86,cy,40,0,7); x.fill(); x.strokeStyle=P.line2; x.stroke(); LK.text(x,'detector',W*0.86,H-6,P.muted,{align:'center',size:11});
   ro.set('I',LK.fx(I,3)); ro.set('m','cos²('+Math.round(ang)+'°) = '+LK.fx(I,3));
   pl.set([{pts:Array.from({length:181},(_,i)=>[i*2,Math.cos(i*2*Math.PI/180)**2]),color:P.brand},{pts:[[ang,I]],points:true,color:P.accent,r:6}],{xmin:0,xmax:360,ymin:0,ymax:1.05});
 });
 return ()=>S.dispose(); }};

/* ---------- Photoelectric effect ---------- */
const METALS={Cs:{n:'Caesium',phi:2.1},Na:{n:'Sodium',phi:2.3},Ca:{n:'Calcium',phi:2.9},Zn:{n:'Zinc',phi:4.3},Pt:{n:'Platinum',phi:5.6}};
L.photoelectric={title:'Photoelectric effect',cat:'Quantum',topic:'4.5',desc:'Shine light on a metal. Change wavelength, intensity, metal and stopping p.d. Plot KE_max against frequency to find h.',
icon:'<path d="M15 15 L45 55 M30 10 L60 50" stroke="currentColor" stroke-width="4"/><rect x="50" y="60" width="60" height="12" fill="currentColor"/><circle cx="85" cy="40" r="5" fill="currentColor"/><path d="M85 40 L105 15" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const metal=LK.select(ct,{label:'Metal',value:'Na',options:Object.entries(METALS).map(([k,v])=>[k,v.n+' (φ = '+v.phi+' eV)'])});
 const lam=LK.slider(ct,{label:'Wavelength',min:150,max:750,step:5,value:400,fmt:v=>v+' nm'}), I=LK.slider(ct,{label:'Intensity',min:0,max:100,step:5,value:50,fmt:v=>v+'%'}), Vs=LK.slider(ct,{label:'Stopping p.d.',min:0,max:6,step:0.05,value:0,fmt:v=>v.toFixed(2)+' V'});
 const b=LK.ctrl(el); LK.button(b,'Record KE_max point',()=>{ const f=c/(lam.v*1e-9); const K=hf()-METALS[metal.value].phi; if(K>0) pts.push([f/1e14,K]); draw(); },'primary'); LK.button(b,'Clear graph',()=>{pts=[];draw();});
 const st=LK.stage(el,S,{ratio:0.42});
 const ro=LK.readout(el,[['E','photon energy hf'],['K','KE_max = hf − φ'],['cur','photocurrent'],['f0','threshold f₀ / your h']]);
 const pl=LK.plot(el,S,{xlab:'f / 10¹⁴ Hz',ylab:'KE_max / eV',ratio:0.36});
 LK.note(el,'One photon gives all its energy to one electron. Below the threshold frequency nothing is emitted, however intense the light. Above it, KE_max depends only on frequency; intensity changes the number of photoelectrons per second (the current). Increase the stopping p.d. until the current is zero: eV_s = KE_max. The KE_max–f graph has gradient h and x-intercept f₀ for every metal.');
 const hf=()=>h*c/(lam.v*1e-9)/e; let pts=[], els=[];
 const draw=()=>{ const P=LK.P(); const s=[{pts,points:true,color:P.brand}]; Object.entries(METALS).forEach(([k,m])=>{ if(k===metal.value) s.push({pts:[[m.phi*e/h/1e14,0],[20,20*1e14*h/e-m.phi]],color:P.line2,dash:[5,4]}); }); const f=LK.fit(pts); pl.set(s,{xmin:0,xmax:20,ymin:0,ymax:5}); if(f&&pts.length>1) ro.set('f0','h ≈ '+LK.sig(f.m*e/1e14,3)+' J s from your graph'); };
 draw();
 S.loop(dt=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const phi=METALS[metal.value].phi, E=hf(), K=E-phi; const emit=K>0; const current=emit&&Vs.v<K?I.v/100*(1-Math.pow(Vs.v/K,1.2))*12:0;
   const col=lam.v<380?P.deep:lam.v>700?'#a33':LK.wl2rgb(lam.v); const py=H*0.78; x.fillStyle=P.ink2; x.fillRect(W*0.15,py,W*0.32,14); LK.text(x,METALS[metal.value].n,W*0.31,py+30,P.ink2,{align:'center',size:12});
   x.fillStyle=P.ink2; x.fillRect(W*0.62,H*0.1,14,H*0.6); LK.text(x,'collector',W*0.62+7,H*0.08,P.muted,{align:'center',size:11});
   const n=Math.round(I.v/10); for(let i=0;i<n;i++){ const ph=((performance.now()/600)+i/n)%1; const sx=W*0.05+ph*W*0.18, sy=H*0.1+ph*(py-H*0.1); x.strokeStyle=col; x.lineWidth=2; x.beginPath(); for(let k=0;k<12;k++){ const t=k/12; x.lineTo(sx-20+t*20+Math.sin(t*12)*3,sy-20+t*20-Math.sin(t*12)*3); } x.stroke(); }
   if(emit && Math.random()<I.v/100*dt*20) els.push({x:W*0.2+Math.random()*W*0.25,y:py,vx:Math.sqrt(K*Math.random())*60,vy:-Math.sqrt(K)*40*(0.5+Math.random()*0.5),K:K*Math.random()});
   els.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; const decel=Vs.v*35; if(p.x>W*0.45) p.vx-=decel*dt; }); els=els.filter(p=>p.x<W*0.62&&p.x>0&&p.y>0&&p.vx>-50); x.fillStyle=P.teal; els.forEach(p=>{ x.beginPath(); x.arc(p.x,p.y,3.5,0,7); x.fill(); });
   ro.set('E',LK.fx(E,2)+' eV'); ro.set('K',emit?LK.fx(K,2)+' eV':'no emission'); ro.set('cur',LK.fx(current,2)+' μA');
   if(pts.length<2) ro.set('f0',LK.sig(phi*e/h,3)+' Hz');
 });
 return ()=>S.dispose(); }};

/* ---------- de Broglie / electron diffraction ---------- */
L.debroglie={title:'Electron diffraction',cat:'Quantum',topic:'4.5',desc:'Accelerate electrons through a graphite target. Change the p.d. and see the rings shrink as λ = h/p falls.',
icon:'<circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" stroke-width="3"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const V=LK.slider(ct,{label:'Accelerating p.d.',min:1,max:10,step:0.1,value:4,fmt:v=>v.toFixed(1)+' kV'});
 const st=LK.stage(el,S,{ratio:0.5});
 const ro=LK.readout(el,[['p','momentum p = √(2meV)'],['lam','λ = h/p'],['v','speed']]);
 LK.note(el,'Electrons diffract through the gaps between carbon atoms (≈ 10⁻¹⁰ m) in graphite because their de Broglie wavelength is similar in size. This is evidence for the wave nature of particles. Raising the p.d. increases momentum, shortens the wavelength and makes the rings smaller.');
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w,H=st.h; const p=Math.sqrt(2*me*e*V.v*1000), lam=h/p;
   x.fillStyle=P.deep; x.beginPath(); x.ellipse(W*0.7,H/2,H*0.42,H*0.42,0,0,7); x.fill();
   [2.13e-10,1.23e-10].forEach((d,i)=>{ const r=H*0.36*(lam/3.88e-11)*(1.23e-10/d); x.strokeStyle=`rgba(120,255,190,${0.9-i*0.25})`; x.lineWidth=5-i; x.beginPath(); x.arc(W*0.7,H/2,Math.min(H*0.41,r),0,7); x.stroke(); });
   x.fillStyle='rgba(120,255,190,.9)'; x.beginPath(); x.arc(W*0.7,H/2,5,0,7); x.fill();
   x.fillStyle=P.ink2; x.fillRect(W*0.08,H/2-8,40,16); LK.text(x,'electron gun',W*0.08,H/2-14,P.muted,{size:11}); x.fillStyle=P.accent; x.fillRect(W*0.33,H/2-14,6,28); LK.text(x,'graphite',W*0.31,H/2+30,P.muted,{size:11});
   x.strokeStyle=P.teal; x.setLineDash([3,4]); x.beginPath(); x.moveTo(W*0.08+40,H/2); x.lineTo(W*0.7,H/2); x.stroke(); x.setLineDash([]);
   ro.set('p',LK.sig(p,3)+' kg m/s'); ro.set('lam',LK.sig(lam,3)+' m'); ro.set('v',LK.sig(p/me,3)+' m/s');
 });
 return ()=>S.dispose(); }};

/* ---------- Energy levels & spectra ---------- */
const HL=[-13.6,-3.40,-1.51,-0.85,-0.54,-0.38];
L.spectra={title:'Energy levels and line spectra',cat:'Astrophysics',topic:'5.5',desc:'Click hydrogen energy levels to make transitions. Each photon adds a line to the emission or absorption spectrum.',
icon:'<path d="M15 100 H105 M15 60 H105 M15 40 H105 M15 30 H105" stroke="currentColor" stroke-width="4"/><path d="M60 40 V95" stroke="currentColor" stroke-width="4" marker-end="url(#ah)"/>',
mount(el){ const S=LK.scope(); const ct=LK.ctrl(el);
 const mode=LK.select(ct,{label:'Spectrum',value:'em',options:[['em','Emission (electron falls)'],['ab','Absorption (electron rises)']],on:()=>{lines=[];}});
 LK.button(ct,'All Balmer lines',()=>{ for(let n=3;n<=6;n++) add(n-1,1); }); LK.button(ct,'Clear',()=>{lines=[];});
 const st=LK.stage(el,S,{ratio:0.7,minH:380,maxH:620});
 const ro=LK.readout(el,[['de','ΔE'],['lam','wavelength λ = hc/ΔE'],['reg','region']]);
 LK.note(el,'Energy levels are negative because energy must be supplied to free the electron (0 eV = ionised). A transition between levels emits or absorbs a single photon with hf = ΔE. Tap one level and then another. Transitions down to n = 2 (Balmer series) are visible; down to n = 1 are ultraviolet.');
 let lines=[], first=null, last=null;
 const add=(i,j)=>{ const dE=Math.abs(HL[i]-HL[j]); const l=h*c/(dE*e)*1e9; lines.push(l); last={i,j,dE,l}; };
 const fE=E=>Math.sqrt(-E); // square-root scale so the crowded upper levels can be told apart (spacing not to scale)
 const lv=(i)=>{ const top=40, bot=st.h*0.6; return top+fE(HL[i])/fE(-13.6)*(bot-top); };
 S.on(st.cv,'pointerdown',ev=>{ const p=st.pos(ev); let best=-1,bd=14; HL.forEach((E,i)=>{ const d=Math.abs(p.y-lv(i)); if(d<bd){bd=d;best=i;} }); if(best<0) return; if(first===null){ first=best; } else { if(best!==first){ const up=best<first?false:true; if((mode.value==='em'&&best<first)||(mode.value==='ab'&&best>first)) add(first,best); } first=null; } });
 S.loop(()=>{ const P=LK.P(),x=st.ctx; st.clear(); const W=st.w;
   // labels are spread out so the closely spaced upper levels never overlap; a thin leader joins each label to its level
   const x1=W*0.08, x2=W*0.56, lx=W*0.62; const fs=W<520?10:12, gapY=fs+6;
   const items=[{y:40,t:'0 eV (ionised)',n:''}].concat(HL.map((E,i)=>({y:lv(i),t:E.toFixed(2)+' eV',n:'n = '+(i+1),i})));
   items.sort((p,q)=>q.y-p.y); // bottom first
   let prev=Infinity; items.forEach(it=>{ it.ly=Math.min(it.y,prev-gapY); prev=it.ly; });
   let nxt=12-gapY; for(let k=items.length-1;k>=0;k--){ const it=items[k]; if(it.ly<nxt+gapY) it.ly=nxt+gapY; nxt=it.ly; }
   x.strokeStyle=P.line2; x.setLineDash([4,4]); x.lineWidth=1.5; x.beginPath(); x.moveTo(x1,40); x.lineTo(x2,40); x.stroke(); x.setLineDash([]);
   HL.forEach((E,i)=>{ const y=lv(i); x.strokeStyle=i===first?P.brand:P.ink2; x.lineWidth=i===first?3.5:2; x.beginPath(); x.moveTo(x1,y); x.lineTo(x2,y); x.stroke(); });
   items.forEach(it=>{ x.strokeStyle=P.line2; x.lineWidth=1; x.beginPath(); x.moveTo(x2+3,it.y); x.lineTo(lx-6,it.ly); x.stroke();
     const sel=it.i!=null&&it.i===first; if(it.n){ LK.text(x,it.n,lx,it.ly+fs*0.35,sel?P.brand:P.ink2,{size:fs,weight:sel?700:500}); LK.text(x,it.t,lx+fs*4.6,it.ly+fs*0.35,P.muted,{size:fs}); } else LK.text(x,it.t,lx,it.ly+fs*0.35,P.muted,{size:fs}); });
   LK.text(x,first===null?(mode.value==='em'?'Tap a higher level, then a lower one':'Tap a lower level, then a higher one'):'Now tap the level it '+(mode.value==='em'?'falls to':'rises to'),x1,st.h*0.6+22,first===null?P.muted:P.brand,{size:fs,mono:false,weight:600});
   if(last){ const xx=W*0.35; LK.arrow(x,xx,lv(last.i),xx,lv(last.j),last.l>=380&&last.l<=750?LK.wl2rgb(last.l):P.accent,3); }
   const sy=st.h*0.6+58, sh=Math.min(st.h*0.18,st.h-sy-24); if(W<520) LK.text(x,'Level spacing is not to scale.',x1,20,P.muted,{size:10,mono:false}); else LK.text(x,'Level spacing is not to scale.',W-12,st.h*0.6+22,P.muted,{size:10,align:'right',mono:false}); for(let i=0;i<W-40;i++){ const l=380+i/(W-40)*(750-380); x.fillStyle=mode.value==='ab'?LK.wl2rgb(l):'#0b0710'; x.fillRect(20+i,sy,1,sh); }
   const seen=[]; lines.forEach(l=>{ if(l<380||l>750) return; const px=20+(l-380)/(750-380)*(W-40); x.fillStyle=mode.value==='ab'?'#0b0710':LK.wl2rgb(l); x.fillRect(px-1.5,sy,3,sh); const r=Math.round(l); if(seen.some(q=>Math.abs(q-px)<34)) return; seen.push(px); LK.text(x,r+' nm',px,sy-6,P.ink2,{size:10,align:'center'}); });
   LK.text(x,'380 nm',20,sy+sh+14,P.muted,{size:10}); LK.text(x,'750 nm',W-60,sy+sh+14,P.muted,{size:10});
   const uv=lines.filter(l=>l<380).length; if(uv) LK.text(x,uv+' UV line(s) off the visible scale',W/2,sy+sh+14,P.muted,{align:'center',size:10});
   if(last){ ro.set('de',LK.fx(last.dE,2)+' eV'); ro.set('lam',LK.fx(last.l,0)+' nm'); ro.set('reg',last.l<380?'ultraviolet':last.l>750?'infrared':'visible'); } else { ro.set('de','tap two levels'); }
 });
 return ()=>S.dispose(); }};
})();
