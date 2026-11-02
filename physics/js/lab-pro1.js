/* Rebuilt mechanics labs: projectile, 1D track, 2D air table */
(function(){
'use strict';
const LK=window.LK, L=window.LABS;
const COLS=()=>{ const P=LK.P(); return [P.brand,P.teal,P.accent,P.warn,P.deep,P.good]; };

/* ================= PROJECTILE ================= */
L.projectile={title:'Projectile launcher',cat:'Mechanics',topic:'3.1',
desc:'Aim by dragging, hit targets, add air resistance, take a strobe photo and graph every shot.',
howto:'drag from the cannon’s muzzle in the direction you want to fire; the longer the arrow, the faster the shot. Let go to fire. Drag the platform up or down to change the launch height. Every shot is kept so you can compare.',
icon:'<path d="M15 100 Q55 5 105 100" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="60" cy="40" r="7" fill="currentColor"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const u=LK.slider(c,{label:'Launch speed u',min:2,max:40,step:0.5,value:18,fmt:v=>v+' m/s'});
 const th=LK.slider(c,{label:'Launch angle θ',min:-30,max:90,step:1,value:40,fmt:v=>v+'°'});
 const h0=LK.slider(c,{label:'Launch height',min:0,max:40,step:0.5,value:0,fmt:v=>v+' m'});
 const gs=LK.select(c,{label:'Planet',value:'9.81',options:[['9.81','Earth (g = 9.81)'],['1.62','Moon (1.62)'],['3.71','Mars (3.71)'],['24.8','Jupiter (24.8)']]});
 const ar=LK.slider(c,{label:'Air resistance',min:0,max:10,step:0.5,value:0,fmt:v=>v===0?'off':v+' (k/m ×10⁻³)'});
 const c2=LK.ctrl(el);
 const strobe=LK.check(c2,'Strobe photo (every 0.1 s)',false), ghost=LK.check(c2,'Show predicted path',true), comps=LK.check(c2,'Velocity components',true);
 const c3=LK.ctrl(el); LK.button(c3,'Fire',()=>fire(),'primary'); LK.button(c3,'New target',()=>newTarget()); LK.button(c3,'Clear shots',()=>{ shots=[]; table(); });
 const st=LK.stage(el,S,{ratio:0.52,maxH:520,minH:280});
 const ro=LK.readout(el,[['t','time in air'],['R','range'],['H','max height'],['vx','v_x now'],['vy','v_y now'],['msg','target']]);
 const gc=LK.ctrl(el); const gsel=LK.select(gc,{label:'Graph',value:'y',options:[['y','height y against t'],['x','distance x against t'],['vy','v_y against t'],['vx','v_x against t'],['traj','path: y against x']]});
 const pl=LK.plot(el,S,{ratio:0.34});
 const tw=LK.el('<div class="tbl"></div>'); el.appendChild(tw);
 LK.note(el,'Without air resistance the horizontal velocity u cos θ never changes, while the vertical velocity changes by g every second, so horizontal and vertical motion are independent. Turn on the strobe: the dots are equally spaced horizontally but not vertically. With air resistance both components shrink, the path is no longer symmetrical and the best angle for range drops below 45°.');
 let shots=[], target=null, aim=null, dragH=false, msg='–';
 const g=()=>+gs.value, kdrag=()=>ar.v*1e-3;
 const predict=()=>{ const a=th.v*Math.PI/180; const pts=[]; let x=0,y=h0.v,vx=u.v*Math.cos(a),vy=u.v*Math.sin(a),t=0; const k=kdrag(); while(t<60){ const h=0.01; const v=Math.hypot(vx,vy); vx+=(-k*v*vx)*h; vy+=(-g()-k*v*vy)*h; x+=vx*h; y+=vy*h; t+=h; pts.push([x,y]); if(y<0) break; } return pts; };
 function newTarget(){ const a=Math.PI/4; const R=u.v*u.v/g()*1.2; target={x:Math.max(6,Math.min(110,(0.35+Math.random()*0.6)*Math.max(20,R))),w:2.5}; msg='aim for the target'; }
 function fire(){ const a=th.v*Math.PI/180; const col=COLS()[shots.length%6]; shots.push({x:0,y:h0.v,vx:u.v*Math.cos(a),vy:u.v*Math.sin(a),t:0,H:h0.v,trail:[[0,0,h0.v,u.v*Math.cos(a),u.v*Math.sin(a)]],col,u:u.v,th:th.v,h0:h0.v,g:g(),k:kdrag(),done:false,nextStrobe:0.1,strobe:[[0,h0.v]]}); if(shots.length>8) shots.shift(); }
 newTarget();
 let view={R:30,H:15};
 const tf=()=>{ const W=st.w,H=st.h; const sc=Math.min((W-80)/view.R,(H-50)/view.H); return {sc,X:v=>50+v*sc,Y:v=>H-28-v*sc,iX:p=>(p-50)/sc,iY:p=>(H-28-p)/sc}; };
 const muzzle=()=>{ const T=tf(); return [T.X(0),T.Y(h0.v)]; };
 S.on(st.cv,'pointerdown',e=>{ const p=st.pos(e); const [mx,my]=muzzle(); const T=tf();
   if(Math.hypot(p.x-mx,p.y-my)<40&&p.x>=mx-14){ aim={x:p.x,y:p.y}; st.cv.setPointerCapture(e.pointerId); }
   else if(p.x<mx-6&&p.x>mx-60){ dragH=true; st.cv.setPointerCapture(e.pointerId); } });
 S.on(st.cv,'pointermove',e=>{ const p=st.pos(e); const [mx,my]=muzzle(); const T=tf();
   if(aim){ aim={x:p.x,y:p.y}; const dx=p.x-mx, dy=my-p.y; const L=Math.hypot(dx,dy); if(L>6){ th.set(Math.round(Math.max(-30,Math.min(90,Math.atan2(dy,dx)*180/Math.PI)))); u.set(Math.round(Math.max(2,Math.min(40,L/4))*2)/2); } }
   else if(dragH){ h0.set(Math.round(Math.max(0,Math.min(40,T.iY(p.y)))*2)/2); }
   st.cv.style.cursor=(Math.hypot(p.x-mx,p.y-my)<40)?'crosshair':(p.x<mx-6&&p.x>mx-60)?'ns-resize':'default'; });
 const up=()=>{ if(aim){ aim=null; fire(); } dragH=false; }; S.on(st.cv,'pointerup',up); S.on(st.cv,'pointercancel',up);
 function table(){ tw.innerHTML=shots.length?`<table><tr><th>Shot</th><th>u / m s⁻¹</th><th>θ</th><th>height / m</th><th>air res.</th><th>time / s</th><th>range / m</th><th>max height / m</th></tr>${shots.map((s,i)=>`<tr><td><span class="rag" style="background:${s.col}"></span> ${i+1}</td><td>${s.u}</td><td>${s.th}°</td><td>${s.h0}</td><td>${s.k?'on':'off'}</td><td>${s.done?s.t.toFixed(2):'…'}</td><td>${s.done?s.x.toFixed(1):'…'}</td><td>${s.H.toFixed(1)}</td></tr>`).join('')}</table>`:'<p class="muted" style="margin:8px">Your shots will be listed here.</p>'; }
 table(); let tick=0;
 S.loop(dt=>{ const P=LK.P(),x=st.ctx;
   // physics
   shots.forEach(s=>{ if(s.done) return; const sub=10; for(let i=0;i<sub;i++){ const h=dt/sub; const v=Math.hypot(s.vx,s.vy); s.vx+=(-s.k*v*s.vx)*h; s.vy+=(-s.g-s.k*v*s.vy)*h; s.x+=s.vx*h; s.y+=s.vy*h; s.t+=h; s.H=Math.max(s.H,s.y);
     if(s.t>=s.nextStrobe){ s.strobe.push([s.x,s.y]); s.nextStrobe+=0.1; }
     if(s.y<0){ const f=s.y/(s.vy*h); s.x-=s.vx*h*f; s.t-=h*f; s.y=0; s.done=true; if(target){ msg=Math.abs(s.x-target.x)<=target.w/2?'HIT! 🎯':(s.x<target.x?'short by ':'long by ')+Math.abs(s.x-target.x).toFixed(1)+' m'; } table(); break; } }
     if(dt>0) s.trail.push([s.t,s.x,s.y,s.vx,s.vy]); });
   // view
   const pr=predict(); let mR=Math.max(20,target?target.x+5:0,...pr.map(p=>p[0])), mH=Math.max(10,...pr.map(p=>p[1]),h0.v+4); shots.forEach(s=>{ s.trail.forEach(q=>{ mR=Math.max(mR,q[1]); mH=Math.max(mH,q[2]); }); }); mR*=1.08; mH*=1.12; view.R+=(mR-view.R)*0.12; view.H+=(mH-view.H)*0.12;
   const T=tf(); st.clear(); LK.grid(x,st.w,st.h,24);
   x.fillStyle=P.line2; x.fillRect(0,T.Y(0),st.w,st.h-T.Y(0)); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(0,T.Y(0)); x.lineTo(st.w,T.Y(0)); x.stroke();
   const step=LK.nice(view.R,8); x.fillStyle=P.ink2; x.font=`11px ${P.mono}`; x.textAlign='center'; for(let v=0;v<=view.R;v+=step){ x.fillText(String(+v.toFixed(1)),T.X(v),T.Y(0)+15); } x.textAlign='left'; x.fillText('m',st.w-16,T.Y(0)+15);
   const hs=LK.nice(view.H,6); for(let v=hs;v<=view.H;v+=hs){ x.fillStyle=P.muted; x.fillText(String(+v.toFixed(1)),4,T.Y(v)+4); x.strokeStyle=P.line; x.beginPath(); x.moveTo(28,T.Y(v)); x.lineTo(36,T.Y(v)); x.stroke(); }
   if(target){ x.fillStyle=P.bad; x.fillRect(T.X(target.x-target.w/2),T.Y(0)-5,target.w*T.sc,7); x.fillStyle=P.surface; x.fillRect(T.X(target.x)-2,T.Y(0)-5,4,7); LK.text(x,'target',T.X(target.x),T.Y(0)-10,P.bad,{align:'center',size:11,weight:600}); }
   // platform
   const [mx,my]=muzzle(); if(h0.v>0){ x.fillStyle=P.ink2; x.fillRect(mx-40,my+8,40,T.Y(0)-my-8); } x.fillStyle=P.ink2; x.beginPath(); x.arc(mx-8,my+6,9,0,7); x.fill();
   const a=th.v*Math.PI/180; x.save(); x.translate(mx,my); x.rotate(-a); x.fillStyle=P.deep; LK.rr(x,-10,-6,34,12,4); x.fill(); x.restore();
   if(ghost.checked){ x.setLineDash([4,5]); x.strokeStyle=P.muted; x.lineWidth=1.5; x.beginPath(); pr.forEach((p,i)=>i?x.lineTo(T.X(p[0]),T.Y(p[1])):x.moveTo(T.X(p[0]),T.Y(p[1]))); x.stroke(); x.setLineDash([]); }
   if(aim){ LK.arrow(x,mx,my,aim.x,aim.y,P.accent,3,12); LK.text(x,u.v+' m/s at '+th.v+'°',aim.x+8,aim.y-8,P.accent,{weight:700}); }
   else { LK.arrow(x,mx,my,mx+Math.cos(a)*u.v*4,my-Math.sin(a)*u.v*4,P.accent,1.5,8); }
   shots.forEach((s,i)=>{ x.strokeStyle=s.col; x.lineWidth=i===shots.length-1?2.6:1.6; x.globalAlpha=i===shots.length-1?1:0.55; x.beginPath(); s.trail.forEach((q,k)=>k?x.lineTo(T.X(q[1]),T.Y(q[2])):x.moveTo(T.X(q[1]),T.Y(q[2]))); x.stroke(); x.globalAlpha=1;
     if(strobe.checked){ s.strobe.forEach(q=>{ x.fillStyle=s.col; x.beginPath(); x.arc(T.X(q[0]),T.Y(q[1]),3.5,0,7); x.fill(); x.fillStyle=P.line2; x.fillRect(T.X(q[0])-1,T.Y(0)+1,2,6); x.fillRect(2,T.Y(q[1])-1,6,2); }); }
     if(!s.done||i===shots.length-1){ const bx=T.X(s.x), by=T.Y(s.y); if(comps.checked&&!s.done){ LK.arrow(x,bx,by,bx+s.vx*3,by,P.teal,2.5,9); LK.arrow(x,bx,by,bx,by-s.vy*3,P.accent,2.5,9); } x.fillStyle=s.col; x.beginPath(); x.arc(bx,by,6.5,0,7); x.fill(); } });
   if(comps.checked){ LK.text(x,'→ v_x',st.w-120,20,P.teal,{weight:700}); LK.text(x,'↑ v_y',st.w-60,20,P.accent,{weight:700}); }
   const s=shots[shots.length-1]; if(s){ ro.set('t',s.t.toFixed(2)+' s'); ro.set('R',s.x.toFixed(1)+' m'); ro.set('H',s.H.toFixed(1)+' m'); ro.set('vx',s.vx.toFixed(1)+' m/s'); ro.set('vy',s.vy.toFixed(1)+' m/s'); } ro.set('msg',msg);
   if((tick++)%6===0){ const k=gsel.value; const ix={x:1,y:2,vx:3,vy:4}[k]; pl.set(shots.map(s=>({pts:s.trail.filter((q,j)=>j%2===0).map(q=>k==='traj'?[q[1],q[2]]:[q[0],q[ix]]),color:s.col})),{xlab:k==='traj'?'x / m':'t / s',ylab:{y:'y / m',x:'x / m',vy:'v_y / m s⁻¹',vx:'v_x / m s⁻¹',traj:'y / m'}[k]}); }
 });
 return ()=>S.dispose(); }};

/* ================= 1D AIR TRACK ================= */
L.collide1d={title:'Momentum: 1D air track',cat:'Mechanics',topic:'3.5',
desc:'Up to three gliders. Drag them into place, drag their arrows to set velocities, choose how bouncy the collision is, and watch momentum and kinetic energy.',
howto:'press <b>Edit setup</b>, then drag a glider to move it and drag the round handle on its arrow to set its velocity. Press <b>Run</b>. The bar charts compare momentum and kinetic energy now with the start.',
icon:'<rect x="10" y="50" width="35" height="22" fill="currentColor"/><rect x="72" y="50" width="35" height="22" fill="none" stroke="currentColor" stroke-width="5"/><path d="M5 80 H115" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const n=LK.select(c,{label:'Gliders',value:'2',options:[['2','2'],['3','3']],on:()=>{ setup(); }});
 const e=LK.slider(c,{label:'Coefficient of restitution e',min:0,max:1,step:0.05,value:1,fmt:v=>v.toFixed(2)+(v===1?' (perfectly elastic)':v===0?' (stick together)':' (inelastic)')});
 const ends=LK.select(c,{label:'Track ends',value:'stop',options:[['stop','Soft buffers (glider stops)'],['bounce','Springy buffers (bounce)']]});
 const ms=[0,1,2].map(i=>LK.slider(c,{label:'Mass '+'ABC'[i],min:0.1,max:2,step:0.1,value:[0.5,0.5,1][i],fmt:v=>v.toFixed(1)+' kg',on:v=>{ G0[i].m=v; if(!running) G[i].m=v; }}));
 const c2=LK.ctrl(el); const runB=LK.button(c2,'Run',()=>{ if(!running){ start(); } },'primary'); LK.button(c2,'Edit setup',()=>{ editing(); }); LK.button(c2,'Explosion',()=>{ explosion(); });
 const st=LK.stage(el,S,{ratio:0.3,minH:190,maxH:300});
 const ro=LK.readout(el,[['p0','total p at start'],['p','total p now'],['k0','total KE at start'],['k','total KE now'],['ev','events']]);
 const bars=LK.stage(el,S,{ratio:0.18,minH:120,maxH:170});
 const gc=LK.ctrl(el); const gsel=LK.select(gc,{label:'Graph',value:'p',options:[['p','momentum against time'],['x','position against time'],['v','velocity against time'],['k','kinetic energy against time']]});
 const pl=LK.plot(el,S,{ratio:0.3});
 LK.note(el,'With no external force the total momentum never changes, whatever happens in the collisions. Kinetic energy is only conserved when e = 1. With e = 0 the gliders stick together and the most KE possible is lost. In an explosion the total momentum stays zero but KE appears from the stored elastic energy. If the buffers at the ends stop a glider, that is an external force and the total momentum changes.');
 const TRACK=4, W=0.2; let G0=[{x:0.8,v:1.5,m:0.5},{x:2.4,v:0,m:0.5},{x:3.3,v:0,m:1}], G=[], running=false, t=0, data=[], spring=null, events=0, drag=null, start0={p:0,k:0};
 const tot=(arr)=>({p:arr.reduce((a,g)=>a+g.m*g.v,0),k:arr.reduce((a,g)=>a+0.5*g.m*g.v*g.v,0)});
 function setup(){ G=G0.slice(0,+n.value).map(g=>Object.assign({},g)); running=false; t=0; data=[]; spring=null; events=0; runB.disabled=false; start0=tot(G); }
 function editing(){ setup(); }
 function start(){ G=G0.slice(0,+n.value).map(g=>Object.assign({},g)); start0=tot(G); running=true; t=0; data=[]; events=0; }
 function explosion(){ n.value='2'; G0[0]={x:1.8,v:0,m:ms[0].v}; G0[1]={x:1.8+W,v:0,m:ms[1].v}; setup(); spring={E:0.4}; start(); }
 setup();
 el.lkPreset=(gl,ev)=>{ n.value=String(gl.length); gl.forEach((g,i)=>{ G0[i]=Object.assign({},g); ms[i].set(g.m); }); if(ev!=null){ e.set(ev); } setup(); start(); };
 const T=()=>{ const sc=(st.w-40)/TRACK; return {sc,X:v=>20+v*sc,iX:p=>(p-20)/sc,y:st.h*0.62}; };
 S.on(st.cv,'pointerdown',ev=>{ if(running) return; const p=st.pos(ev), Tt=T(); G.forEach((g,i)=>{ const gx=Tt.X(g.x), ax=gx+g.v*60; if(Math.hypot(p.x-ax,p.y-(Tt.y-58))<16) drag={i,k:'v'}; else if(!drag&&Math.abs(p.x-gx)<Tt.sc*W/2+6&&Math.abs(p.y-(Tt.y-14))<26) drag={i,k:'x',off:p.x-gx}; }); if(drag) st.cv.setPointerCapture(ev.pointerId); });
 S.on(st.cv,'pointermove',ev=>{ const p=st.pos(ev), Tt=T(); if(!drag){ st.cv.style.cursor=running?'default':'grab'; return; } const g=G0[drag.i];
   if(drag.k==='v'){ g.v=Math.round(Math.max(-3,Math.min(3,(p.x-Tt.X(g.x))/60))*10)/10; } else { let nx=Tt.iX(p.x-drag.off); nx=Math.max(W/2+0.05,Math.min(TRACK-W/2-0.05,nx)); const others=G0.slice(0,+n.value).filter((o,j)=>j!==drag.i); if(others.every(o=>Math.abs(o.x-nx)>W)) g.x=Math.round(nx*100)/100; }
   setup(); });
 S.on(st.cv,'pointerup',()=>drag=null); S.on(st.cv,'pointercancel',()=>drag=null);
 let tick=0;
 S.loop(dt=>{ const P=LK.P(), C=COLS();
   if(running&&dt>0){ if(spring&&t>0.6){ const m1=G[0].m,m2=G[1].m; const v2=Math.sqrt(2*spring.E/(m2*(1+m2/m1))); G[1].v=v2; G[0].v=-m2*v2/m1; spring=null; events++; }
     const sub=20; for(let s=0;s<sub;s++){ const h=dt/sub; G.forEach(g=>g.x+=g.v*h);
       for(let i=0;i<G.length-1;i++){ const a=G[i], b=G[i+1]; if(b.x-a.x<W && a.v>b.v){ const ee=e.v, m1=a.m,m2=b.m,u1=a.v,u2=b.v; a.v=(m1*u1+m2*u2+m2*ee*(u2-u1))/(m1+m2); b.v=(m1*u1+m2*u2+m1*ee*(u1-u2))/(m1+m2); const ov=W-(b.x-a.x); a.x-=ov/2; b.x+=ov/2; events++; } }
       G.forEach(g=>{ if(g.x<W/2&&g.v<0){ g.x=W/2; g.v=ends.value==='bounce'?-g.v:0; events++; } if(g.x>TRACK-W/2&&g.v>0){ g.x=TRACK-W/2; g.v=ends.value==='bounce'?-g.v:0; events++; } }); }
     t+=dt; if(t<20) data.push([t,G.map(g=>[g.x,g.v,g.m*g.v,0.5*g.m*g.v*g.v])]); }
   const x=st.ctx, Tt=T(); st.clear(); x.fillStyle=P.line2; x.fillRect(10,Tt.y,st.w-20,10); for(let i=12;i<st.w-12;i+=12){ x.fillStyle=P.surface; x.fillRect(i,Tt.y+3,3,3); }
   x.fillStyle=P.ink2; x.fillRect(4,Tt.y-36,8,46); x.fillRect(st.w-12,Tt.y-36,8,46);
   for(let v=0;v<=TRACK;v+=0.5){ LK.text(x,v.toFixed(1),Tt.X(v),Tt.y+26,P.muted,{align:'center',size:10}); }
   G.forEach((g,i)=>{ const gx=Tt.X(g.x), gw=Tt.sc*W, gh=22+g.m*10; x.fillStyle=C[i]; LK.rr(x,gx-gw/2,Tt.y-gh,gw,gh,5); x.fill(); LK.text(x,'ABC'[i],gx,Tt.y-gh/2+5,'#fff',{align:'center',weight:700,size:14});
     const ay=Tt.y-58; if(Math.abs(g.v)>0.01) LK.arrow(x,gx,ay,gx+g.v*60,ay,C[i],3,10); if(!running){ x.fillStyle=P.surface; x.strokeStyle=C[i]; x.lineWidth=2.5; x.beginPath(); x.arc(gx+g.v*60,ay,8,0,7); x.fill(); x.stroke(); }
     LK.text(x,g.v.toFixed(2)+' m/s · '+g.m.toFixed(1)+' kg',gx,ay-14,P.ink2,{align:'center',size:11}); });
   if(spring&&running){ x.strokeStyle=P.ink; x.lineWidth=2; LK.spring(x,Tt.X(G[0].x),Tt.y-12,Tt.X(G[1].x),Tt.y-12,4,5); }
   if(!running) LK.text(x,'Setup mode: drag gliders and arrow handles, then press Run',st.w/2,18,P.muted,{align:'center',size:12});
   // bar charts
   const b=bars.ctx; bars.clear(); const now=tot(G); const items=[...G.map((g,i)=>({l:'p '+'ABC'[i],v:g.m*g.v,c:C[i]})),{l:'Σp',v:now.p,c:P.ink,ref:start0.p}]; const kitems=[...G.map((g,i)=>({l:'KE '+'ABC'[i],v:0.5*g.m*g.v*g.v,c:C[i]})),{l:'ΣKE',v:now.k,c:P.ink,ref:start0.k}];
   const half=bars.w/2, mid=bars.h*0.5; const pm=Math.max(0.5,...items.map(i=>Math.abs(i.v)),Math.abs(start0.p)), km=Math.max(0.2,...kitems.map(i=>i.v),start0.k);
   const draw=(arr,x0,w,zero,scale,lab)=>{ const bw=w/arr.length; LK.text(b,lab,x0+4,14,P.muted,{size:11,weight:600}); b.strokeStyle=P.line2; b.beginPath(); b.moveTo(x0,zero); b.lineTo(x0+w-10,zero); b.stroke(); arr.forEach((it,i)=>{ const hh=it.v*scale; b.fillStyle=it.c; b.fillRect(x0+i*bw+8,zero-Math.max(0,hh),bw-20,Math.abs(hh)); if(it.ref!=null){ b.strokeStyle=P.bad; b.setLineDash([4,3]); b.strokeRect(x0+i*bw+6,zero-Math.max(0,it.ref*scale),bw-16,Math.abs(it.ref*scale)||1); b.setLineDash([]); } LK.text(b,it.l,x0+i*bw+bw/2-6,bars.h-4,P.ink2,{align:'center',size:10}); }); };
   draw(items,0,half,mid,(bars.h*0.32)/pm,'Momentum (dashed = total at start)'); draw(kitems,half,half,bars.h-18,(bars.h-40)/km,'Kinetic energy');
   ro.set('p0',start0.p.toFixed(3)+' N s'); ro.set('p',now.p.toFixed(3)+' N s'); ro.set('k0',start0.k.toFixed(3)+' J'); ro.set('k',now.k.toFixed(3)+' J'); ro.set('ev',String(events));
   if((tick++)%5===0&&data.length){ const k=gsel.value, ix={x:0,v:1,p:2,k:3}[k]; const ser=G.map((g,i)=>({pts:data.map(d=>[d[0],d[1][i]?d[1][i][ix]:0]),color:C[i],name:'ABC'[i]})); if(k==='p'||k==='k') ser.push({pts:data.map(d=>[d[0],d[1].reduce((a,q)=>a+q[ix],0)]),color:P.ink,dash:[5,4],name:'total'}); pl.set(ser,{xlab:'t / s',ylab:{x:'x / m',v:'v / m s⁻¹',p:'p / N s',k:'KE / J'}[k],legend:true}); }
 });
 return ()=>S.dispose(); }};

/* ================= 2D AIR TABLE ================= */
L.collide2d={title:'Momentum: 2D air table',cat:'Mechanics',topic:'3.5',
desc:'Up to six pucks on a frictionless table. Drag to place and aim them, run, and watch total momentum stay constant in both directions.',
howto:'in <b>Edit setup</b> drag a puck to move it and drag the round handle at the end of its arrow to set its velocity. Tap a puck to select it and change its mass. Press <b>Run</b>. Pucks stop when they reach the table edge and their paths stay drawn, so you can measure angles afterwards. Old runs stay faint until you press <b>Clear trails</b>.',
icon:'<circle cx="35" cy="75" r="16" fill="currentColor"/><circle cx="80" cy="45" r="16" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 65 L70 55" stroke="currentColor" stroke-width="4"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 const e=LK.slider(c,{label:'Coefficient of restitution e',min:0,max:1,step:0.05,value:1,fmt:v=>v.toFixed(2)+(v===1?' (elastic)':'')});
 const edge=LK.select(c,{label:'At the table edge',value:'stop',options:[['stop','Pucks stop (paths stay)'],['bounce','Pucks bounce off']]}); const walls={get checked(){ return edge.value==='bounce'; }};
 const msel=LK.slider(c,{label:'Mass of selected puck',min:0.1,max:2,step:0.1,value:0.2,fmt:v=>v.toFixed(1)+' kg',on:v=>{ if(sel!=null){ P0[sel].m=v; setup(); } }});
 const c2=LK.ctrl(el); LK.button(c2,'Run',()=>start(),'primary'); LK.button(c2,'Edit setup',()=>setup()); LK.button(c2,'Add puck',()=>{ if(P0.length<6){ P0.push({x:0.2+Math.random()*1.2,y:0.2+Math.random()*0.6,vx:0,vy:0,m:0.2}); setup(); } }); LK.button(c2,'Remove selected',()=>{ if(sel!=null&&P0.length>1){ P0.splice(sel,1); sel=null; setup(); } }); LK.button(c2,'Clear trails',()=>{ old=[]; trail=[]; });
 const c3=LK.ctrl(el); const pre=LK.select(c3,{label:'Preset',value:'',options:[['','Choose a preset…'],['glance','Glancing blow, equal masses'],['head','Head-on, unequal masses'],['stick','Two pucks stick together'],['explode','Three-way explosion'],['pool','Pool break']],on:v=>{ preset(v); }});
 const vecs=LK.check(c3,'Show momentum arrows',true), com=LK.check(c3,'Show centre of mass',true);
 const st=LK.stage(el,S,{ratio:0.58,maxH:560,minH:300});
 const ro=LK.readout(el,[['px','Σp_x start → after collisions'],['py','Σp_y start → after collisions'],['k','Σ KE start → after collisions'],['n','collisions']]);
 LK.note(el,'Momentum is a vector, so it is conserved separately in the x and y directions. The centre of mass of the system moves in a straight line at constant speed because there is no external force. Equal masses in an elastic glancing collision move off at 90° to each other. With e < 1 kinetic energy falls but momentum is still conserved. When a puck is stopped by the edge, the edge exerts an external force; the readout uses each puck’s velocity just before it reached the edge, so you can still check conservation. If you choose bouncing edges, total momentum changes at every bounce because the edge pushes on the puck.');
 const TW=1.6, TH=1.0, R=0.06; let P0=[{x:0.3,y:0.42,vx:0.5,vy:0,m:0.2},{x:1.0,y:0.5,vx:0,vy:0,m:0.2}], Ps=[], running=false, done=false, sel=null, drag=null, trail=[], old=[], hits=0, rt=0, s0={px:0,py:0,k:0};
 const vel=p=>p.stop?[p.svx,p.svy]:[p.vx,p.vy];
 const tot=a=>({px:a.reduce((s,p)=>s+p.m*vel(p)[0],0),py:a.reduce((s,p)=>s+p.m*vel(p)[1],0),k:a.reduce((s,p)=>{ const v=vel(p); return s+0.5*p.m*(v[0]*v[0]+v[1]*v[1]); },0)});
 function setup(){ if(trail.length>2){ old.push({tr:trail,n:Ps.length}); if(old.length>6) old.shift(); } trail=[]; Ps=P0.map(p=>Object.assign({},p)); running=false; done=false; hits=0; rt=0; s0=tot(Ps); }
 function start(){ setup(); running=true; }
 function preset(v){ if(v&&v!=='stick'){ e.set(1); } if(v==='glance') P0=[{x:0.3,y:0.44,vx:0.6,vy:0,m:0.2},{x:1.0,y:0.5,vx:0,vy:0,m:0.2}];
   if(v==='head') P0=[{x:0.3,y:0.5,vx:0.6,vy:0,m:0.6},{x:1.1,y:0.5,vx:-0.3,vy:0,m:0.2}];
   if(v==='stick'){ P0=[{x:0.3,y:0.3,vx:0.5,vy:0.25,m:0.3},{x:0.8,y:0.55,vx:0,vy:0,m:0.3}]; e.set(0); e.input.dispatchEvent(new Event('input')); }
   if(v==='explode'){ P0=[{x:0.8,y:0.5,vx:0.5,vy:0,m:0.2},{x:0.8,y:0.5,vx:-0.25,vy:0.433,m:0.2},{x:0.8,y:0.5,vx:-0.25,vy:-0.433,m:0.2}]; P0.forEach(p=>{ p.x+=p.vx*0.3; p.y+=p.vy*0.3; }); }
   if(v==='pool'){ P0=[{x:0.2,y:0.5,vx:1.2,vy:0.01,m:0.17}]; const r2=2*R+0.002; for(let row=0;row<4;row++) for(let k=0;k<=row;k++) P0.push({x:1.0+row*r2*0.87,y:0.5+(k-row/2)*r2,vx:0,vy:0,m:0.16}); P0=P0.slice(0,6); }
   sel=null; setup(); }
 setup();
 el.lkPreset=(name)=>{ pre.value=name; preset(name); start(); };
 const Tf=()=>{ const sc=Math.min((st.w-20)/TW,(st.h-20)/TH); const ox=(st.w-TW*sc)/2, oy=(st.h-TH*sc)/2; return {sc,X:v=>ox+v*sc,Y:v=>oy+v*sc,iX:p=>(p-ox)/sc,iY:p=>(p-oy)/sc}; };
 const AS=0.35; // arrow seconds
 S.on(st.cv,'pointerdown',ev=>{ const p=st.pos(ev), T=Tf(); if(running||done){ setup(); }
   let hit=null; P0.forEach((q,i)=>{ const hx=T.X(q.x+q.vx*AS), hy=T.Y(q.y+q.vy*AS); if(Math.hypot(p.x-hx,p.y-hy)<14) hit={i,k:'v'}; }); if(!hit) P0.forEach((q,i)=>{ if(Math.hypot(p.x-T.X(q.x),p.y-T.Y(q.y))<R*T.sc+4) hit={i,k:'x'}; });
   if(hit){ drag=hit; sel=hit.i; msel.set(P0[sel].m); st.cv.setPointerCapture(ev.pointerId); } else sel=null; });
 S.on(st.cv,'pointermove',ev=>{ if(!drag) return; const p=st.pos(ev), T=Tf(), q=P0[drag.i]; if(drag.k==='x'){ q.x=Math.max(R,Math.min(TW-R,T.iX(p.x))); q.y=Math.max(R,Math.min(TH-R,T.iY(p.y))); } else { q.vx=Math.round((T.iX(p.x)-q.x)/AS*20)/20; q.vy=Math.round((T.iY(p.y)-q.y)/AS*20)/20; } setup(); });
 S.on(st.cv,'pointerup',()=>drag=null); S.on(st.cv,'pointercancel',()=>drag=null);
 S.loop(dt=>{ const P=LK.P(), C=COLS(), x=st.ctx, T=Tf();
   if(running&&dt>0){ const sub=20; for(let s=0;s<sub;s++){ const h=dt/sub; rt+=h; Ps.forEach(q=>{ if(q.stop) return; q.x+=q.vx*h; q.y+=q.vy*h; if(!walls.checked){ if(q.x<R||q.x>TW-R||q.y<R||q.y>TH-R){ q.x=Math.max(R,Math.min(TW-R,q.x)); q.y=Math.max(R,Math.min(TH-R,q.y)); q.stop=true; q.svx=q.vx; q.svy=q.vy; q.vx=0; q.vy=0; } } else { if(q.x<R&&q.vx<0||q.x>TW-R&&q.vx>0){ q.vx=-q.vx; hits++; } if(q.y<R&&q.vy<0||q.y>TH-R&&q.vy>0){ q.vy=-q.vy; hits++; } } });
     for(let i=0;i<Ps.length;i++) for(let j=i+1;j<Ps.length;j++){ const a=Ps[i], b=Ps[j]; if(a.stop||b.stop) continue; const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy); if(d<2*R&&d>0){ const nx=dx/d, ny=dy/d; const rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny; if(rel>0){ const J=(1+e.v)*rel/(1/a.m+1/b.m); a.vx-=J/a.m*nx; a.vy-=J/a.m*ny; b.vx+=J/b.m*nx; b.vy+=J/b.m*ny; hits++; } const ov=(2*R-d)/2; a.x-=nx*ov; a.y-=ny*ov; b.x+=nx*ov; b.y+=ny*ov; } } }
     trail.push(Ps.map(q=>[q.x,q.y])); if(trail.length>6000) trail.shift();
     if(rt>0.2 && Ps.every(q=>Math.hypot(q.vx,q.vy)<1e-4)){ running=false; done=true; } }
   st.clear(); x.fillStyle=P.surface; x.fillRect(T.X(0),T.Y(0),TW*T.sc,TH*T.sc); x.strokeStyle=walls.checked?P.ink2:P.line2; x.lineWidth=walls.checked?4:1.5; x.strokeRect(T.X(0),T.Y(0),TW*T.sc,TH*T.sc);
   x.fillStyle=P.grid; for(let i=0.1;i<TW;i+=0.1) x.fillRect(T.X(i),T.Y(0),1,TH*T.sc); for(let j=0.1;j<TH;j+=0.1) x.fillRect(T.X(0),T.Y(j),TW*T.sc,1);
   old.forEach(o=>{ for(let i=0;i<o.n;i++){ x.strokeStyle=C[i%6]; x.globalAlpha=0.18; x.lineWidth=2; x.beginPath(); o.tr.forEach((f,k)=>{ const pt=f[i]; if(!pt) return; k?x.lineTo(T.X(pt[0]),T.Y(pt[1])):x.moveTo(T.X(pt[0]),T.Y(pt[1])); }); x.stroke(); } x.globalAlpha=1; });
   Ps.forEach((q,i)=>{ x.strokeStyle=C[i%6]; x.globalAlpha=0.6; x.lineWidth=2; x.beginPath(); trail.forEach((f,k)=>{ const pt=f[i]; if(!pt) return; k?x.lineTo(T.X(pt[0]),T.Y(pt[1])):x.moveTo(T.X(pt[0]),T.Y(pt[1])); }); x.stroke(); x.globalAlpha=1; });
   const M=Ps.reduce((a,q)=>a+q.m,0), cx=Ps.reduce((a,q)=>a+q.m*q.x,0)/M, cy=Ps.reduce((a,q)=>a+q.m*q.y,0)/M; const now=tot(Ps);
   if(com.checked){ const comT=trail.map(f=>[f.reduce((a,p,i)=>a+Ps[i].m*p[0],0)/M,f.reduce((a,p,i)=>a+Ps[i].m*p[1],0)/M]); x.strokeStyle=P.ink; x.setLineDash([3,4]); x.lineWidth=1.5; x.beginPath(); comT.forEach((p,k)=>k?x.lineTo(T.X(p[0]),T.Y(p[1])):x.moveTo(T.X(p[0]),T.Y(p[1]))); x.stroke(); x.setLineDash([]); x.strokeStyle=P.ink; x.lineWidth=2; const X0=T.X(cx),Y0=T.Y(cy); x.beginPath(); x.moveTo(X0-7,Y0); x.lineTo(X0+7,Y0); x.moveTo(X0,Y0-7); x.lineTo(X0,Y0+7); x.stroke(); LK.arrow(x,X0,Y0,X0+now.px/M*AS*T.sc,Y0+now.py/M*AS*T.sc,P.ink,3,11); }
   Ps.forEach((q,i)=>{ const X0=T.X(q.x), Y0=T.Y(q.y); x.fillStyle=C[i%6]; x.beginPath(); x.arc(X0,Y0,R*T.sc*(0.75+q.m*0.4),0,7); x.fill(); if(i===sel){ x.strokeStyle=P.ink; x.lineWidth=3; x.stroke(); } if(q.stop){ x.strokeStyle=P.ink2; x.lineWidth=1.5; x.setLineDash([3,3]); x.beginPath(); x.arc(X0,Y0,R*T.sc*(0.75+q.m*0.4)+4,0,7); x.stroke(); x.setLineDash([]); } LK.text(x,q.m.toFixed(1),X0,Y0+4,'#fff',{align:'center',size:11,weight:700});
     if(vecs.checked&&(Math.abs(q.vx)+Math.abs(q.vy)>0.005)){ LK.arrow(x,X0,Y0,X0+q.vx*AS*T.sc,Y0+q.vy*AS*T.sc,C[i%6],2.5,10); }
     if(!running&&!done){ x.fillStyle=P.surface; x.strokeStyle=C[i%6]; x.lineWidth=2.5; x.beginPath(); x.arc(X0+q.vx*AS*T.sc,Y0+q.vy*AS*T.sc,7,0,7); x.fill(); x.stroke(); } });
   if(done) LK.text(x,'Run finished: paths kept. Tap the table or press Edit setup to try again; Clear trails wipes old paths.',st.w/2,16,P.muted,{align:'center',size:12});
   else if(!running) LK.text(x,'Setup mode: drag pucks and arrow handles, then press Run',st.w/2,16,P.muted,{align:'center',size:12});
   ro.set('px',s0.px.toFixed(3)+' → '+now.px.toFixed(3)); ro.set('py',s0.py.toFixed(3)+' → '+now.py.toFixed(3)); ro.set('k',s0.k.toFixed(3)+' → '+now.k.toFixed(3)+' J'); ro.set('n',String(hits));
 });
 return ()=>S.dispose(); }};
})();
