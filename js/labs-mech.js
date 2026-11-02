/* Lab kit + mechanisms labs */
(function(){
'use strict';
window.LABS = window.LABS || {};
const LK = window.LK = {};
let P=null;
window.addEventListener('themechange',()=>{P=null;});
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{P=null;}); }catch(e){}
LK.P = ()=>{ if(P) return P; const cs=getComputedStyle(document.documentElement); const g=n=>cs.getPropertyValue(n).trim();
  P={bg:g('--surface-2'),surface:g('--surface'),ink:g('--ink'),ink2:g('--ink-2'),muted:g('--muted'),line:g('--line'),line2:g('--line-strong'),brand:g('--brand'),navy:g('--navy'),accent:g('--accent'),good:g('--good'),warn:g('--warn'),bad:g('--bad'),soft:g('--brand-soft'),accentSoft:g('--accent-soft'),goodSoft:g('--good-soft'),badSoft:g('--bad-soft'),warnSoft:g('--warn-soft'),mono:g('--f-mono')||'monospace',body:g('--f-body')||'sans-serif'}; return P; };
LK.el = (html)=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
LK.esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
LK.ctrl = (parent)=>{ const d=document.createElement('div'); d.className='lab-ctrl'; parent.appendChild(d); return d; };
LK.slider = (ctrl,o)=>{ const id='s'+Math.random().toString(36).slice(2,8); const lab=LK.el(`<label for="${id}"><span></span><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${o.value}"></label>`); ctrl.appendChild(lab);
  const inp=lab.querySelector('input'), sp=lab.querySelector('span'); const fmt=o.fmt||(v=>v); const upd=()=>{ sp.textContent=`${o.label}: ${fmt(+inp.value)}`; };
  inp.addEventListener('input',()=>{ upd(); o.on&&o.on(+inp.value); }); upd();
  return {input:inp,get v(){return +inp.value;},set(v){ inp.value=v; upd(); },setMax(m){ inp.max=m; upd(); }}; };
LK.select = (ctrl,o)=>{ const lab=LK.el(`<label><span>${LK.esc(o.label)}</span><select>${o.options.map(([v,l])=>`<option value="${LK.esc(v)}">${LK.esc(l)}</option>`).join('')}</select></label>`); ctrl.appendChild(lab); const s=lab.querySelector('select'); if(o.value!=null) s.value=o.value; s.addEventListener('change',()=>o.on&&o.on(s.value)); return s; };
LK.check = (ctrl,label,val,on)=>{ const lab=LK.el(`<label class="toggle" style="flex-direction:row;align-items:center"><input type="checkbox" ${val?'checked':''}> ${LK.esc(label)}</label>`); ctrl.appendChild(lab); const c=lab.querySelector('input'); c.addEventListener('change',()=>on&&on(c.checked)); return c; };
LK.btn = (ctrl,label,on,cls='btn btn-sm')=>{ const b=LK.el(`<button class="${cls}" type="button">${label}</button>`); ctrl.appendChild(b); b.addEventListener('click',on); return b; };
LK.readout = (parent,items)=>{ const d=document.createElement('div'); d.className='readout'; d.setAttribute('aria-live','polite'); parent.appendChild(d); const m={}; items.forEach(([k,l])=>{ const x=LK.el(`<div><b>–</b><span>${LK.esc(l)}</span></div>`); d.appendChild(x); m[k]=x.querySelector('b'); }); return (vals)=>{ for(const k in vals) if(m[k]&&m[k].textContent!==String(vals[k])) m[k].textContent=vals[k]; }; };
LK.note = (parent,html)=>{ const d=document.createElement('div'); d.className='lab-note'; d.innerHTML=html; parent.appendChild(d); return d; };
LK.subtabs = (parent,tabs,on,cur)=>{ const d=document.createElement('div'); d.className='subtabs'; parent.appendChild(d); const set=k=>{ d.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k)); on(k); }; tabs.forEach(([k,l])=>{ const b=LK.el(`<button type="button" data-k="${k}">${LK.esc(l)}</button>`); b.onclick=()=>set(k); d.appendChild(b); }); setTimeout(()=>set(cur||tabs[0][0]),0); return {el:d,set}; };
LK.canvas = (parent,H,onResize)=>{ const cv=document.createElement('canvas'); parent.appendChild(cv); const ctx=cv.getContext('2d'); const o={cv,ctx,w:0,h:0,dirty:true};
  const fit=()=>{ const w=Math.max(260,cv.clientWidth||parent.clientWidth||600); if(w===o.w) return; const h=typeof H==='function'?H(w):H; const d=Math.min(2,window.devicePixelRatio||1); cv.width=Math.round(w*d); cv.height=Math.round(h*d); cv.style.height=h+'px'; ctx.setTransform(d,0,0,d,0,0); o.w=w; o.h=h; o.dpr=d; o.dirty=true; if(onResize){ if(o.ready) onResize(o); else Promise.resolve().then(()=>onResize(o)); } };
  o.fit=fit; o.ro=new ResizeObserver(()=>fit()); o.ro.observe(parent); fit(); o.ready=true; return o; };
LK.loop = (fn)=>{ let raf=0,last=performance.now(),alive=true; const f=t=>{ if(!alive) return; const dt=Math.min(.05,(t-last)/1000); last=t; fn(dt,t/1000); raf=requestAnimationFrame(f); }; raf=requestAnimationFrame(f); return ()=>{ alive=false; cancelAnimationFrame(raf); }; };
LK.reduce = ()=>{ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };
LK.text = (ctx,s,x,y,o={})=>{ const p=LK.P(); ctx.save(); ctx.fillStyle=o.color||p.ink; ctx.font=`${o.weight||500} ${o.size||12}px ${o.mono?p.mono:p.body}`; ctx.textAlign=o.align||'left'; ctx.textBaseline=o.base||'middle'; if(o.bg){ const m=ctx.measureText(s); const pw=m.width+8, ph=(o.size||12)+6; let bx=x-(o.align==='center'?pw/2:o.align==='right'?pw-4:4); ctx.fillStyle=o.bg; ctx.fillRect(bx,y-ph/2,pw,ph); ctx.fillStyle=o.color||p.ink; } ctx.fillText(s,x,y); ctx.restore(); };
LK.arrow = (ctx,x1,y1,x2,y2,color,w=2,head=8)=>{ ctx.save(); ctx.strokeStyle=ctx.fillStyle=color; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); const a=Math.atan2(y2-y1,x2-x1); ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-head*Math.cos(a-.4),y2-head*Math.sin(a-.4)); ctx.lineTo(x2-head*Math.cos(a+.4),y2-head*Math.sin(a+.4)); ctx.closePath(); ctx.fill(); ctx.restore(); };
LK.pointer = (cv,h)=>{ const pos=e=>{ const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }; let down=false;
  cv.addEventListener('pointerdown',e=>{ down=true; try{cv.setPointerCapture(e.pointerId);}catch(_){} h.down&&h.down(pos(e),e); });
  cv.addEventListener('pointermove',e=>{ if(down) h.move&&h.move(pos(e),e); else h.hover&&h.hover(pos(e),e); });
  const up=e=>{ if(!down) return; down=false; h.up&&h.up(pos(e),e); }; cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up); };
LK.fmt = (v,d=1)=>{ const n=Number(v); return isFinite(n)? n.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:0}) : '–'; };
LK.reg = (id,def)=>{ window.LABS[id]=Object.assign({id},def); };
LK.ico = (inner)=>`<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

/* ---------------- gear helpers ---------------- */
const gearCache={};
function gearPath(T){ if(gearCache[T]) return gearCache[T]; const p=new Path2D(); const r=T/2, ra=r+1, rr=r-1.25, pc=Math.PI*2/T;
  for(let k=0;k<T;k++){ const c=k*pc; const pts=[[rr,c-.5*pc],[rr,c-.27*pc],[ra,c-.12*pc],[ra,c+.12*pc],[rr,c+.27*pc]]; pts.forEach(([R,a],i)=>{ const x=R*Math.cos(a), y=R*Math.sin(a); (k===0&&i===0)?p.moveTo(x,y):p.lineTo(x,y); }); }
  p.closePath(); const hr=Math.max(.9,r*.18); p.moveTo(hr,0); p.arc(0,0,hr,0,Math.PI*2,true); gearCache[T]=p; return p; }
function drawGear(ctx,x,y,T,ang,s,fill,stroke,label,alpha=1){ const p=LK.P(); ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); ctx.scale(s,s); ctx.rotate(ang); ctx.fillStyle=fill; ctx.strokeStyle=stroke; ctx.lineWidth=1.4/s; ctx.fill(gearPath(T),'evenodd'); ctx.stroke(gearPath(T));
  const r=T/2; ctx.beginPath(); ctx.arc(0,0,r*.62,0,Math.PI*2); ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.stroke();
  for(let i=0;i<3;i++){ ctx.save(); ctx.rotate(i*Math.PI*2/3); ctx.fillStyle='rgba(255,255,255,.28)'; ctx.fillRect(Math.max(.9,r*.18),-.35,r*.62-Math.max(.9,r*.18),.7); ctx.restore(); }
  ctx.beginPath(); ctx.arc(r*.45,0,Math.max(.35,r*.06),0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
  ctx.restore(); if(label){ LK.text(ctx,label,x,y+(T/2+2.2)*s+8,{align:'center',size:12,weight:600,color:p.ink2}); } }
function rotArrow(ctx,x,y,R,dir,color){ ctx.save(); ctx.strokeStyle=ctx.fillStyle=color; ctx.lineWidth=2; const a0=-Math.PI*.75, a1=-Math.PI*.35; ctx.beginPath(); ctx.arc(x,y,R,a0,a1); ctx.stroke(); const ae=dir>0?a1:a0; const tx=x+R*Math.cos(ae), ty=y+R*Math.sin(ae); const tang=ae+(dir>0?Math.PI/2:-Math.PI/2); ctx.beginPath(); ctx.moveTo(tx+7*Math.cos(tang),ty+7*Math.sin(tang)); ctx.lineTo(tx+5*Math.cos(tang+2.2),ty+5*Math.sin(tang+2.2)); ctx.lineTo(tx+5*Math.cos(tang-2.2),ty+5*Math.sin(tang-2.2)); ctx.closePath(); ctx.fill(); ctx.restore(); }

LK.reg('gears',{title:'Gear trains',cat:'Mechanisms (extension)',topics:['X.3'],blurb:'Simple, idler and compound gear trains. Change the teeth and driver speed and see the gear ratio, output speed and direction.',
 icon:LK.ico('<circle cx="38" cy="55" r="22"/><circle cx="38" cy="55" r="6"/><circle cx="72" cy="35" r="14"/><circle cx="72" cy="35" r="4"/><path d="M38 28v-6M38 88v-6M11 55h6M65 55h-6M57 36l4-4M19 74l-4 4M72 16v5M72 54v-5M86 35h-5"/>'),
 mount(el){
  const st={mode:'simple',T1:12,T2:36,Ti:20,T4:24,rpm:30,a:0,run:true};
  const tabs=LK.subtabs(el,[['simple','Simple train'],['idler','With idler'],['compound','Compound train']],k=>{st.mode=k; ui();});
  const ctrl=LK.ctrl(el);
  const s1=LK.slider(ctrl,{label:'Driver teeth',min:8,max:60,value:st.T1,on:v=>{st.T1=v;}});
  const sI=LK.slider(ctrl,{label:'Idler teeth',min:8,max:60,value:st.Ti,on:v=>{st.Ti=v;}});
  const s2=LK.slider(ctrl,{label:'Driven teeth',min:8,max:60,value:st.T2,on:v=>{st.T2=v;}});
  const s4=LK.slider(ctrl,{label:'Output gear teeth',min:8,max:60,value:st.T4,on:v=>{st.T4=v;}});
  LK.slider(ctrl,{label:'Driver speed',min:5,max:60,value:st.rpm,fmt:v=>v+' rpm',on:v=>{st.rpm=v;}});
  const pb=LK.btn(ctrl,'Pause',()=>{st.run=!st.run; pb.textContent=st.run?'Pause':'Play';});
  const cv=LK.canvas(el,w=>Math.max(260,Math.min(420,w*.55)));
  const ro=LK.readout(el,[['vr','Gear ratio (driven : driver)'],['out','Output speed'],['dir','Output direction'],['tq','Output torque']]);
  const note=LK.note(el,'');
  function ui(){ const c=st.mode==='compound'; sI.input.parentElement.querySelector('span'); sI.input.parentElement.style.display=st.mode==='simple'?'none':'';
    sI.input.parentElement.querySelector('span').textContent=(c?'Compound gear (B) teeth':'Idler teeth')+': '+sI.v; s4.input.parentElement.style.display=c?'':'none';
    s2.input.parentElement.querySelector('span').textContent=(c?'Compound gear (A) teeth':'Driven teeth')+': '+s2.v;
    note.innerHTML= st.mode==='simple'?'<b>Gear ratio = teeth on driven ÷ teeth on driver.</b> A small driver turning a large driven gear reduces speed and increases torque. Two meshing gears always turn in opposite directions.':
      st.mode==='idler'?'An <b>idler gear</b> sits between the driver and the driven gear. It makes them turn in the <b>same direction</b> but does not change the gear ratio – its teeth cancel out of the calculation.':
      'In a <b>compound train</b> two gears are fixed to the same shaft and turn together. Total ratio = (A ÷ driver) × (output ÷ B). Compound trains give large speed reductions in a small space, e.g. clocks, gearboxes and food mixers.'; }
  sI.input.addEventListener('input',ui); s2.input.addEventListener('input',ui);
  const stop=LK.loop(dt=>{ if(st.run&&!LK.reduce()) st.a+=dt*st.rpm/60*Math.PI*2*.5; draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h);
    const {T1,T2,Ti,T4}=st; const r1=T1/2,r2=T2/2,ri=Ti/2,r4=T4/2; let gears=[]; const a1=-st.a; // clockwise on screen? positive canvas rotation = clockwise
    const A1=st.a; // canvas: positive rotate = clockwise
    const mesh=(ga,Ta,ang,theta,Tb)=>{ // returns angle of gear b meshing with gear a at direction theta (canvas)
      return (theta+Math.PI) - (ang-theta)*Ta/Tb + Math.PI/Tb; };
    if(st.mode==='simple'){ const A2=mesh(0,T1,A1,0,T2); gears=[{x:0,y:0,T:T1,a:A1,c:p.brand,l:'Driver',d:1},{x:r1+r2,y:0,T:T2,a:A2,c:p.accent,l:'Driven',d:-1}]; }
    else if(st.mode==='idler'){ const Ai=mesh(0,T1,A1,0,Ti); const A2=mesh(0,Ti,Ai,0,T2); gears=[{x:0,y:0,T:T1,a:A1,c:p.brand,l:'Driver',d:1},{x:r1+ri,y:0,T:Ti,a:Ai,c:p.muted,l:'Idler',d:-1},{x:r1+2*ri+r2,y:0,T:T2,a:A2,c:p.accent,l:'Driven',d:1}]; }
    else { const A2=mesh(0,T1,A1,0,T2); const th=.55; const A4=mesh(0,Ti,A2,th,T4); const x2=r1+r2; gears=[{x:0,y:0,T:T1,a:A1,c:p.brand,l:'Driver',d:1,back:1},{x:x2,y:0,T:T2,a:A2,c:p.navy,l:'',d:-1,back:1},{x:x2,y:0,T:Ti,a:A2,c:p.muted,l:'',d:-1},{x:x2+(ri+r4)*Math.cos(th),y:(ri+r4)*Math.sin(th),T:T4,a:A4,c:p.accent,l:'Output',d:1}]; }
    let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9; gears.forEach(g=>{ const R=g.T/2+1; minx=Math.min(minx,g.x-R); maxx=Math.max(maxx,g.x+R); miny=Math.min(miny,g.y-R); maxy=Math.max(maxy,g.y+R); });
    const s=Math.min((w-40)/(maxx-minx),(h-60)/(maxy-miny)); const ox=(w-(maxx-minx)*s)/2-minx*s, oy=(h-20-(maxy-miny)*s)/2-miny*s;
    gears.forEach(g=>drawGear(ctx,ox+g.x*s,oy+g.y*s,g.T,g.a,s,g.c,p.ink,g.l,g.back?.55:1));
    gears.forEach(g=>{ if(g.l) rotArrow(ctx,ox+g.x*s,oy+g.y*s,(g.T/2+1.6)*s,g.d,p.ink2); });
    if(st.mode==='compound'){ const g=gears[1]; LK.text(ctx,'A (back) + B (front) on one shaft',ox+g.x*s,oy+(g.y-g.T/2-1.6)*s-8,{align:'center',size:12,weight:600,color:p.ink2}); }
    let vr, dir; if(st.mode==='simple'){ vr=T2/T1; dir='Opposite to driver'; } else if(st.mode==='idler'){ vr=T2/T1; dir='Same as driver'; } else { vr=(T2/T1)*(T4/Ti); dir='Same as driver'; }
    ro({vr:(vr>=1?LK.fmt(vr,2)+' : 1':'1 : '+LK.fmt(1/vr,2)),out:LK.fmt(st.rpm/vr,1)+' rpm',dir,tq:'× '+LK.fmt(vr,2)+(vr>1?' (more)':vr<1?' (less)':'')}); }
  ui();
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ---------------- cams ---------------- */
LK.reg('cams',{title:'Cams and followers',cat:'Mechanisms (extension)',topics:['X.3'],blurb:'Eccentric, pear, heart and snail cams with knife, roller and flat followers, plus a live displacement graph.',
 icon:LK.ico('<path d="M50 88c-16 0-24-12-24-26s10-30 24-50c14 20 24 36 24 50S66 88 50 88z"/><circle cx="50" cy="62" r="5"/><path d="M50 12V2"/>'),
 mount(el){
  const st={cam:'pear',fol:'knife',lift:18,rpm:12,t:0,run:true}; const r0=25;
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Cam',value:st.cam,options:[['eccentric','Eccentric (circular)'],['pear','Pear'],['heart','Heart'],['snail','Snail (drop)']],on:v=>{st.cam=v; recalc();}});
  LK.select(ctrl,{label:'Follower',value:st.fol,options:[['knife','Knife edge'],['roller','Roller'],['flat','Flat']],on:v=>{st.fol=v; recalc();}});
  LK.slider(ctrl,{label:'Lift',min:8,max:24,value:st.lift,fmt:v=>v+' mm',on:v=>{st.lift=v; recalc();}});
  LK.slider(ctrl,{label:'Speed',min:2,max:40,value:st.rpm,fmt:v=>v+' rpm',on:v=>{st.rpm=v;}});
  const pb=LK.btn(ctrl,'Pause',()=>{st.run=!st.run; pb.textContent=st.run?'Pause':'Play';});
  const cv=LK.canvas(el,w=>w<620?560:340);
  const ro=LK.readout(el,[['ang','Cam angle'],['disp','Follower displacement'],['type','Motion']]);
  const note=LK.note(el,'');
  const desc={eccentric:'<b>Eccentric cam</b>: a circle rotating off-centre. Gives smooth <b>simple harmonic</b> rise and fall with no dwell – used in pumps and toys.',pear:'<b>Pear cam</b>: the follower <b>dwells</b> (stays still) for about half a turn, then rises and falls smoothly – used to open and close valves in engines.',heart:'<b>Heart cam</b>: gives <b>uniform velocity</b> – the follower rises and falls at a constant speed. Used for winding thread evenly on a bobbin.',snail:'<b>Snail (drop) cam</b>: gradual rise then a <b>sudden drop</b>. It can only rotate in one direction, otherwise the follower jams on the step. Used in hammers and alarm clocks.'};
  const N=360; let prof=[], graph=[], gmin=0;
  function r(phi){ const h=st.lift; phi=((phi%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    if(st.cam==='eccentric'){ const e=h/2, R=r0+e, d=phi-Math.PI/2; return e*Math.cos(d)+Math.sqrt(R*R-e*e*Math.sin(d)**2); }
    if(st.cam==='pear'){ const d=Math.abs(((phi-Math.PI/2+Math.PI)%(2*Math.PI))-Math.PI); return d<Math.PI/2? r0+h*(1+Math.cos(2*d))/2 : r0; }
    if(st.cam==='heart'){ return phi<Math.PI? r0+h*phi/Math.PI : r0+h*(2-phi/Math.PI); }
    return r0+h*phi/(2*Math.PI); }
  const RR=6;
  function lift(alpha){ // alpha = cam rotation (math coords)
    if(st.fol==='knife') return r(Math.PI/2-alpha);
    let best=-1e9; for(let i=0;i<N;i++){ const ph=i/N*2*Math.PI; const R=prof[i]; const x=R*Math.cos(ph+alpha), y=R*Math.sin(ph+alpha);
      if(st.fol==='flat'){ if(y>best) best=y; } else if(Math.abs(x)<RR){ const v=y+Math.sqrt(RR*RR-x*x); if(v>best) best=v; } }
    return st.fol==='roller'?best-RR:best; }
  function recalc(){ prof=[]; for(let i=0;i<N;i++) prof.push(r(i/N*2*Math.PI)); graph=[]; for(let i=0;i<=180;i++){ const th=i/180*2*Math.PI; graph.push(lift(-th)); } gmin=Math.min(...graph); note.innerHTML=desc[st.cam]+' <span class="muted">Followers: a <b>knife edge</b> follows the profile accurately but wears quickly; a <b>roller</b> runs smoothly with less friction; a <b>flat</b> follower is hard-wearing but cannot follow hollow profiles.</span>'; }
  recalc();
  const stop=LK.loop(dt=>{ if(st.run&&!LK.reduce()) st.t+=dt*st.rpm/60*2*Math.PI; draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const stack=w<620;
    const th=st.t%(2*Math.PI), alpha=-th; const L=lift(alpha);
    const camW=stack?w:w*.42, camH=stack?h*.55:h; const s=Math.min(camW/120, camH/((r0+st.lift)*2+60));
    const cx=camW/2, cy=camH-(r0+st.lift)*s-14;
    // cam
    ctx.save(); ctx.translate(cx,cy); ctx.beginPath(); for(let i=0;i<=N;i++){ const ph=(i%N)/N*2*Math.PI; const R=prof[i%N]; const x=R*Math.cos(ph+alpha)*s, y=-R*Math.sin(ph+alpha)*s; i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); ctx.fillStyle=p.accent; ctx.globalAlpha=.9; ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,0,4,0,7); ctx.fillStyle=p.surface; ctx.fill(); ctx.stroke(); ctx.restore();
    rotArrow(ctx,cx,cy,(r0+st.lift+6)*s,1,p.ink2);
    // follower
    const fy=cy-L*s; const rodTop=Math.max(8,fy-(st.lift+40)*s*0.9);
    ctx.fillStyle=p.line2; ctx.fillRect(cx-16,rodTop+20,8,14); ctx.fillRect(cx+8,rodTop+20,8,14); ctx.fillRect(cx-16,rodTop+48,8,14); ctx.fillRect(cx+8,rodTop+48,8,14);
    ctx.fillStyle=p.brand; ctx.strokeStyle=p.ink; ctx.lineWidth=1.5;
    const tipY = st.fol==='roller'? fy-RR*s : fy;
    ctx.fillRect(cx-5,rodTop,10,tipY-rodTop- (st.fol==='knife'?10:0)); ctx.strokeRect(cx-5,rodTop,10,tipY-rodTop-(st.fol==='knife'?10:0));
    if(st.fol==='knife'){ ctx.beginPath(); ctx.moveTo(cx-5,tipY-10); ctx.lineTo(cx+5,tipY-10); ctx.lineTo(cx,tipY); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    if(st.fol==='roller'){ ctx.beginPath(); ctx.arc(cx,fy-RR*s,RR*s,0,7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,fy-RR*s,2,0,7); ctx.fillStyle=p.surface; ctx.fill(); }
    if(st.fol==='flat'){ ctx.fillRect(cx-26,fy-6,52,6); ctx.strokeRect(cx-26,fy-6,52,6); }
    // graph
    const gx=stack?40:camW+44, gy=stack?camH+24:30, gw=stack?w-60:w-camW-64, gh=stack?h-camH-60:h-80;
    ctx.strokeStyle=p.line2; ctx.lineWidth=1; ctx.strokeRect(gx,gy,gw,gh);
    for(let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(gx+gw*i/4,gy); ctx.lineTo(gx+gw*i/4,gy+gh); ctx.strokeStyle=p.line; ctx.stroke(); }
    const ymax=st.lift+2; const Y=v=>gy+gh-(v-gmin)/ymax*gh;
    ctx.beginPath(); graph.forEach((v,i)=>{ const x=gx+gw*i/180; i?ctx.lineTo(x,Y(v)):ctx.moveTo(x,Y(v)); }); ctx.strokeStyle=p.brand; ctx.lineWidth=2.2; ctx.stroke();
    const mx=gx+gw*th/(2*Math.PI); ctx.beginPath(); ctx.arc(mx,Y(L),5,0,7); ctx.fillStyle=p.accent; ctx.fill();
    ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(mx,gy); ctx.lineTo(mx,gy+gh); ctx.strokeStyle=p.muted; ctx.stroke(); ctx.setLineDash([]);
    ['0°','90°','180°','270°','360°'].forEach((t,i)=>LK.text(ctx,t,gx+gw*i/4,gy+gh+12,{align:'center',size:11,color:p.muted,mono:1}));
    LK.text(ctx,'Displacement',gx,gy-12,{size:11,color:p.muted}); LK.text(ctx,'0',gx-6,Y(gmin),{align:'right',size:11,color:p.muted,mono:1}); LK.text(ctx,st.lift+' mm',gx-6,Y(gmin+st.lift),{align:'right',size:11,color:p.muted,mono:1});
    LK.text(ctx,'Cam rotation',gx+gw,gy+gh+28,{align:'right',size:11,color:p.muted});
    ro({ang:Math.round(th*180/Math.PI)+'°',disp:LK.fmt(L-gmin,1)+' mm',type:{eccentric:'Simple harmonic',pear:'Dwell, rise, fall',heart:'Uniform velocity',snail:'Rise, sudden drop'}[st.cam]}); }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ---------------- linkages ---------------- */
LK.reg('linkages',{title:'Linkages',cat:'Mechanisms (extension)',topics:['X.3'],blurb:'Reverse motion, parallel motion, bell crank and crank-and-slider linkages. Move the pivots and watch how the output changes.',
 icon:LK.ico('<path d="M20 20l60 60"/><circle cx="50" cy="50" r="5"/><path d="M5 20h15M80 80h15"/><circle cx="20" cy="20" r="4"/><circle cx="80" cy="80" r="4"/>'),
 mount(el){
  const st={mode:'reverse',t:0,run:true,f:.5,a:90,b:90,cr:45,cl:170};
  const tabs=LK.subtabs(el,[['reverse','Reverse motion'],['parallel','Parallel motion'],['bell','Bell crank'],['crank','Crank and slider']],k=>{st.mode=k; ui();});
  const ctrl=LK.ctrl(el);
  const sf=LK.slider(ctrl,{label:'Pivot position',min:25,max:75,value:50,fmt:v=>v+'% down the link',on:v=>{st.f=v/100;}});
  const sa=LK.slider(ctrl,{label:'Input arm',min:50,max:130,value:90,fmt:v=>v+' mm',on:v=>{st.a=v;}});
  const sb=LK.slider(ctrl,{label:'Output arm',min:50,max:130,value:90,fmt:v=>v+' mm',on:v=>{st.b=v;}});
  const sr=LK.slider(ctrl,{label:'Crank radius',min:20,max:70,value:45,fmt:v=>v+' mm',on:v=>{st.cr=v;}});
  const sl=LK.slider(ctrl,{label:'Connecting rod',min:110,max:230,value:170,fmt:v=>v+' mm',on:v=>{st.cl=v;}});
  const pb=LK.btn(ctrl,'Pause',()=>{st.run=!st.run; pb.textContent=st.run?'Pause':'Play';});
  const cv=LK.canvas(el,w=>Math.min(380,Math.max(280,w*.5)));
  const ro=LK.readout(el,[['in','Input'],['out','Output'],['ratio','Output ÷ input movement']]);
  const note=LK.note(el,'');
  const show=(s,v)=>s.input.parentElement.style.display=v?'':'none';
  function ui(){ show(sf,st.mode==='reverse'); show(sa,st.mode==='bell'); show(sb,st.mode==='bell'); show(sr,st.mode==='crank'); show(sl,st.mode==='crank');
    note.innerHTML={reverse:'<b>Reverse motion linkage:</b> the output moves in the <b>opposite direction</b> to the input. With the fixed pivot in the centre the output moves the same distance; move the pivot towards the input to make the output move further (but with less force).',
     parallel:'<b>Parallel motion linkage:</b> the output moves in the <b>same direction</b> as the input and the links stay parallel – used in toolboxes with cantilever trays, pantographs and some lamps.',
     bell:'<b>Bell crank:</b> changes the direction of motion through <b>90°</b>. Changing the arm lengths changes the distance moved and the force – used in bicycle brakes and doorbells.',
     crank:'<b>Crank and slider:</b> changes <b>rotary motion into reciprocating motion</b> (or the other way, as in a car engine). The stroke of the slider is twice the crank radius.'}[st.mode]; }
  const stop=LK.loop(dt=>{ if(st.run&&!LK.reduce()) st.t+=dt*1.6; draw(); });
  function pivot(ctx,x,y,fixed){ const p=LK.P(); if(fixed){ ctx.fillStyle=p.line2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-11,y+16); ctx.lineTo(x+11,y+16); ctx.closePath(); ctx.fill(); ctx.strokeStyle=p.muted; ctx.lineWidth=1; for(let i=-12;i<=8;i+=5){ ctx.beginPath(); ctx.moveTo(x+i,y+21); ctx.lineTo(x+i+5,y+16); ctx.stroke(); } }
    ctx.beginPath(); ctx.arc(x,y,5.5,0,7); ctx.fillStyle=p.surface; ctx.fill(); ctx.strokeStyle=p.ink; ctx.lineWidth=2; ctx.stroke(); }
  function bar(ctx,x1,y1,x2,y2,c,w=10){ ctx.save(); ctx.lineCap='round'; ctx.strokeStyle=LK.P().ink; ctx.lineWidth=w+3; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.strokeStyle=c; ctx.lineWidth=w; ctx.stroke(); ctx.restore(); }
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const s=Math.min(1.25,Math.min(w/640,h/340)); const cx=w/2, cy=h/2; const S=Math.sin(st.t);
    let inp='',out='',ratio='';
    if(st.mode==='reverse'){ const L=230*s, a=st.f*L, b=(1-st.f)*L, th=.32*S; const T={x:cx+Math.sin(th)*a,y:cy-a*Math.cos(th)}, B={x:cx-Math.sin(th)*b,y:cy+b*Math.cos(th)};
      bar(ctx,T.x-180*s,T.y,T.x,T.y,p.brand,8); bar(ctx,B.x-180*s,B.y,B.x,B.y,p.accent,8); bar(ctx,T.x,T.y,B.x,B.y,p.navy,11); pivot(ctx,T.x,T.y); pivot(ctx,B.x,B.y); pivot(ctx,cx,cy,1);
      const d=Math.cos(st.t); LK.arrow(ctx,T.x-150*s,T.y-16,T.x-150*s+(d>0?40:-40),T.y-16,p.brand); LK.arrow(ctx,B.x-150*s,B.y-16,B.x-150*s+(d>0?-40:40),B.y-16,p.accent);
      LK.text(ctx,'INPUT',T.x-180*s,T.y-30,{size:11,weight:700,color:p.brand}); LK.text(ctx,'OUTPUT',B.x-180*s,B.y-30,{size:11,weight:700,color:p.accent}); LK.text(ctx,'Fixed pivot',cx+16,cy+8,{size:11,color:p.muted});
      inp='Push / pull'; out='Opposite direction'; ratio=LK.fmt((1-st.f)/st.f,2)+' ×'; }
    if(st.mode==='parallel'){ const L=170*s, gap=230*s, th=.33*S; const P1={x:cx-gap/2,y:cy}, P2={x:cx+gap/2,y:cy}; const half=L/2;
      const t1={x:P1.x+Math.sin(th)*half,y:P1.y-Math.cos(th)*half}, b1={x:P1.x-Math.sin(th)*half,y:P1.y+Math.cos(th)*half}, t2={x:P2.x+Math.sin(th)*half,y:P2.y-Math.cos(th)*half}, b2={x:P2.x-Math.sin(th)*half,y:P2.y+Math.cos(th)*half};
      bar(ctx,t1.x-120*s,t1.y,t1.x,t1.y,p.brand,8); bar(ctx,t2.x,t2.y,t2.x+120*s,t2.y,p.accent,8); bar(ctx,t1.x,t1.y,t2.x,t2.y,p.navy,9); bar(ctx,b1.x,b1.y,b2.x,b2.y,p.navy,9); bar(ctx,t1.x,t1.y,b1.x,b1.y,p.muted,10); bar(ctx,t2.x,t2.y,b2.x,b2.y,p.muted,10);
      [t1,b1,t2,b2].forEach(q=>pivot(ctx,q.x,q.y)); pivot(ctx,P1.x,P1.y,1); pivot(ctx,P2.x,P2.y,1);
      const d=Math.cos(st.t); LK.arrow(ctx,t1.x-100*s,t1.y-16,t1.x-100*s+(d>0?40:-40),t1.y-16,p.brand); LK.arrow(ctx,t2.x+70*s,t2.y-16,t2.x+70*s+(d>0?40:-40),t2.y-16,p.accent);
      LK.text(ctx,'INPUT',t1.x-120*s,t1.y-30,{size:11,weight:700,color:p.brand}); LK.text(ctx,'OUTPUT',t2.x+70*s,t2.y-30,{size:11,weight:700,color:p.accent});
      inp='Push / pull'; out='Same direction, parallel'; ratio='1 ×'; }
    if(st.mode==='bell'){ const a=st.a*s*1.3, b=st.b*s*1.3, th=.3*S; const P0={x:cx-20*s,y:cy+40*s}; const E1={x:P0.x+a*Math.sin(th),y:P0.y-a*Math.cos(th)}, E2={x:P0.x+b*Math.cos(th),y:P0.y+b*Math.sin(th)};
      bar(ctx,E1.x-160*s,E1.y,E1.x,E1.y,p.brand,8); bar(ctx,E2.x,E2.y,E2.x,E2.y+110*s,p.accent,8); bar(ctx,P0.x,P0.y,E1.x,E1.y,p.navy,11); bar(ctx,P0.x,P0.y,E2.x,E2.y,p.navy,11);
      pivot(ctx,E1.x,E1.y); pivot(ctx,E2.x,E2.y); pivot(ctx,P0.x,P0.y,1);
      const d=Math.cos(st.t); LK.arrow(ctx,E1.x-130*s,E1.y-16,E1.x-130*s+(d>0?40:-40),E1.y-16,p.brand); LK.arrow(ctx,E2.x+18,E2.y+60*s,E2.x+18,E2.y+60*s+(d>0?36:-36),p.accent);
      LK.text(ctx,'INPUT',E1.x-160*s,E1.y-30,{size:11,weight:700,color:p.brand}); LK.text(ctx,'OUTPUT',E2.x+30,E2.y+110*s,{size:11,weight:700,color:p.accent});
      inp='Horizontal'; out='Vertical (turned 90°)'; ratio=LK.fmt(st.b/st.a,2)+' ×'; }
    if(st.mode==='crank'){ const r=st.cr*s*1.2, l=st.cl*s*1.2; const C={x:cx-150*s,y:cy}; const th=st.t; const Pn={x:C.x+r*Math.cos(th),y:C.y-r*Math.sin(th)}; const sx=C.x+r*Math.cos(th)+Math.sqrt(l*l-(r*Math.sin(th))**2);
      ctx.fillStyle=p.line; ctx.fillRect(C.x+l-r-30,cy-26,2*r+120,6); ctx.fillRect(C.x+l-r-30,cy+20,2*r+120,6);
      ctx.beginPath(); ctx.arc(C.x,C.y,r+12,0,7); ctx.fillStyle=p.soft; ctx.fill(); ctx.strokeStyle=p.line2; ctx.lineWidth=1; ctx.stroke();
      bar(ctx,C.x,C.y,Pn.x,Pn.y,p.brand,11); bar(ctx,Pn.x,Pn.y,sx,cy,p.navy,9);
      ctx.fillStyle=p.accent; ctx.strokeStyle=p.ink; ctx.lineWidth=2; ctx.fillRect(sx-4,cy-19,70,38); ctx.strokeRect(sx-4,cy-19,70,38);
      pivot(ctx,Pn.x,Pn.y); pivot(ctx,sx,cy); pivot(ctx,C.x,C.y,1); rotArrow(ctx,C.x,C.y,r+22,-1,p.ink2);
      const xmin=C.x+l-r, xmax=C.x+l+r; ctx.setLineDash([4,4]); ctx.strokeStyle=p.muted; [xmin,xmax].forEach(x=>{ ctx.beginPath(); ctx.moveTo(x,cy+34); ctx.lineTo(x,cy+60); ctx.stroke(); }); ctx.setLineDash([]);
      LK.arrow(ctx,xmin,cy+52,xmax,cy+52,p.ink2,1.5,6); LK.arrow(ctx,xmax,cy+52,xmin,cy+52,p.ink2,1.5,6); LK.text(ctx,'Stroke = 2 × crank radius = '+(2*st.cr)+' mm',(xmin+xmax)/2,cy+70,{align:'center',size:12,color:p.ink2});
      LK.text(ctx,'CRANK (rotary)',C.x-30,C.y-r-30,{size:11,weight:700,color:p.brand}); LK.text(ctx,'SLIDER (reciprocating)',sx,cy-34,{size:11,weight:700,color:p.accent});
      inp='Rotary'; out='Reciprocating'; ratio='Stroke '+(2*st.cr)+' mm'; }
    ro({in:inp,out,ratio}); }
  ui();
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ---------------- levers ---------------- */
LK.reg('levers',{title:'Levers',cat:'Mechanisms (extension)',topics:['X.3'],blurb:'First, second and third class levers. Drag the fulcrum, load and effort to change the mechanical advantage.',
 icon:LK.ico('<path d="M8 62l84-18"/><path d="M42 56l-10 26h20z"/><rect x="10" y="40" width="16" height="14"/><path d="M84 18v22"/>'),
 mount(el){
  const pre={1:{L:1,F:3,E:9.5},2:{F:.3,L:3,E:9.5},3:{F:.3,E:3.5,L:9.5}}; const st={cls:1,load:400,...pre[1]};
  LK.subtabs(el,[['1','1st class'],['2','2nd class'],['3','3rd class']],k=>{ st.cls=+k; Object.assign(st,pre[k]); draw(); });
  const ctrl=LK.ctrl(el);
  LK.slider(ctrl,{label:'Load',min:50,max:1000,step:10,value:st.load,fmt:v=>v+' N',on:v=>{st.load=v; draw();}});
  const cv=LK.canvas(el,w=>Math.min(300,Math.max(230,w*.38)),()=>draw());
  const ro=LK.readout(el,[['ma','Mechanical advantage'],['eff','Effort needed'],['de','Effort distance from fulcrum'],['dl','Load distance from fulcrum']]);
  const note=LK.note(el,'');
  let drag=null; const X0=()=>40, X1=()=>cv.w-40, ux=u=>X0()+(X1()-X0())*u/10, xu=x=>(x-X0())/(X1()-X0())*10;
  LK.pointer(cv.cv,{down:pt=>{ let best=null,bd=28; ['F','L','E'].forEach(k=>{ const d=Math.abs(ux(st[k])-pt.x); if(d<bd&&Math.abs(pt.y-cv.h*.55)<90){bd=d;best=k;} }); drag=best; },
    move:pt=>{ if(!drag) return; const order=st.cls===1?['L','F','E']:st.cls===2?['F','L','E']:['F','E','L']; const i=order.indexOf(drag); let v=xu(pt.x); const lo=i>0?st[order[i-1]]+.4:0, hi=i<2?st[order[i+1]]-.4:10; st[drag]=Math.max(lo,Math.min(hi,v)); draw(); }, up:()=>{drag=null;}});
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const y=h*.55;
    const dE=Math.abs(st.E-st.F), dL=Math.abs(st.L-st.F); const ma=dE/dL; const eff=st.load/ma;
    ctx.fillStyle=p.line; ctx.fillRect(0,h-18,w,18);
    // fulcrum
    const fx=ux(st.F); ctx.beginPath(); ctx.moveTo(fx,y+6); ctx.lineTo(fx-18,h-18); ctx.lineTo(fx+18,h-18); ctx.closePath(); ctx.fillStyle=p.navy; ctx.fill();
    // beam
    ctx.fillStyle=p.brand; ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.fillRect(X0(),y-6,X1()-X0(),12); ctx.strokeRect(X0(),y-6,X1()-X0(),12);
    for(let i=0;i<=10;i++){ ctx.fillStyle='rgba(255,255,255,.5)'; ctx.fillRect(ux(i)-.5,y-6,1,6); }
    // load
    const lx=ux(st.L), bs=26+st.load/1000*24; ctx.fillStyle=p.accent; ctx.fillRect(lx-bs/2,y-6-bs,bs,bs); ctx.strokeRect(lx-bs/2,y-6-bs,bs,bs); LK.arrow(ctx,lx,y-6-bs-4,lx,y-6-bs+2,p.accent,1); LK.text(ctx,'LOAD '+st.load+' N',lx,y-bs-22,{align:'center',size:11,weight:700,color:p.accent});
    // effort
    const ex=ux(st.E); const up=st.cls!==1; const len=Math.min(90,20+eff/st.load*40);
    if(up) LK.arrow(ctx,ex,y+8+len,ex,y+8,p.good,3,11); else LK.arrow(ctx,ex,y-8-len,ex,y-8,p.good,3,11);
    LK.text(ctx,'EFFORT '+LK.fmt(eff,0)+' N',ex,up?y+len+22:y-len-20,{align:'center',size:11,weight:700,color:p.good});
    LK.text(ctx,'FULCRUM',fx,h-8,{align:'center',size:10,weight:700,color:p.surface});
    ['F','L','E'].forEach(k=>{ ctx.beginPath(); ctx.arc(ux(st[k]),y,7,0,7); ctx.fillStyle=p.surface; ctx.fill(); ctx.strokeStyle=k==='F'?p.navy:k==='L'?p.accent:p.good; ctx.lineWidth=3; ctx.stroke(); });
    LK.text(ctx,'Drag the circles on the beam',10,14,{size:11,color:p.muted});
    ro({ma:LK.fmt(ma,2),eff:LK.fmt(eff,0)+' N',de:LK.fmt(dE*100,0)+' mm',dl:LK.fmt(dL*100,0)+' mm'});
    note.innerHTML={1:'<b>1st class</b> – the fulcrum is between the load and effort (see-saw, crowbar, scissors, pliers). ',2:'<b>2nd class</b> – the load is between the fulcrum and effort (wheelbarrow, nutcracker, bottle opener). MA is always greater than 1. ',3:'<b>3rd class</b> – the effort is between the fulcrum and load (tweezers, fishing rod, your forearm). MA is always less than 1, but the load moves further and faster. '}[st.cls]+'<b>Mechanical advantage = load ÷ effort = effort distance ÷ load distance</b> (from the fulcrum). Effort × distance = load × distance (the principle of moments).'; }
  return ()=>cv.ro.disconnect();
 }});

/* ---------------- pulleys ---------------- */
LK.reg('pulleys',{title:'Pulleys and belts',cat:'Mechanisms (extension)',topics:['X.3'],blurb:'Belt drives (open and crossed) and block-and-tackle pulley systems with mechanical advantage.',
 icon:LK.ico('<circle cx="28" cy="50" r="18"/><circle cx="76" cy="50" r="11"/><path d="M28 32L76 39M28 68L76 61"/><circle cx="28" cy="50" r="3"/><circle cx="76" cy="50" r="3"/>'),
 mount(el){
  const st={mode:'belt',d1:60,d2:120,rpm:40,cross:false,a1:0,a2:0,off:0,n:4,load:600,lift:0,run:true};
  const wrapB=document.createElement('div'); const wrapT=document.createElement('div');
  LK.subtabs(el,[['belt','Belt drive'],['tackle','Block and tackle']],k=>{ st.mode=k; wrapB.style.display=k==='belt'?'':'none'; wrapT.style.display=k==='tackle'?'':'none'; note(); });
  el.appendChild(wrapB); el.appendChild(wrapT);
  const c1=LK.ctrl(wrapB); LK.slider(c1,{label:'Driver diameter',min:30,max:150,value:st.d1,fmt:v=>v+' mm',on:v=>st.d1=v}); LK.slider(c1,{label:'Driven diameter',min:30,max:150,value:st.d2,fmt:v=>v+' mm',on:v=>st.d2=v}); LK.slider(c1,{label:'Driver speed',min:10,max:120,value:st.rpm,fmt:v=>v+' rpm',on:v=>st.rpm=v}); LK.check(c1,'Crossed belt',false,v=>st.cross=v);
  const c2=LK.ctrl(wrapT); LK.slider(c2,{label:'Rope sections supporting the load',min:1,max:6,value:st.n,on:v=>{st.n=v;}}); LK.slider(c2,{label:'Load',min:100,max:2000,step:50,value:st.load,fmt:v=>v+' N',on:v=>st.load=v}); LK.slider(c2,{label:'Lift the load',min:0,max:100,value:0,fmt:v=>v+' mm',on:v=>st.lift=v});
  const cv=LK.canvas(el,w=>Math.min(400,Math.max(280,w*.52)));
  const ro=LK.readout(el,[['a','–'],['b','–'],['c','–'],['d','–']]); const nt=LK.note(el,'');
  const roEl=el.querySelector('.readout');
  function labels(ls){ roEl.querySelectorAll('span').forEach((s,i)=>s.textContent=ls[i]); }
  function note(){ if(st.mode==='belt'){ labels(['Velocity ratio','Output speed','Output direction','Belt speed']); nt.innerHTML='<b>Velocity ratio = driven diameter ÷ driver diameter.</b> Output speed = input speed ÷ VR. An open belt keeps the same direction; a <b>crossed belt</b> reverses it. Belts can slip, which protects the motor if the machine jams; toothed belts and chains do not slip.'; }
    else { labels(['Mechanical advantage (ideal)','Effort needed','Rope pulled','Load lifted']); nt.innerHTML='<b>Ideal mechanical advantage = number of rope sections supporting the load.</b> The effort is divided by the number of sections, but you must pull the rope that many times further – the work done stays the same. A single fixed pulley (1 section) only changes the direction of the force.'; } }
  const stop=LK.loop(dt=>{ if(st.run&&!LK.reduce()){ const w1=st.rpm/60*2*Math.PI*.5; st.a1+=dt*w1; st.a2+=dt*w1*st.d1/st.d2*(st.cross?-1:1); st.off+=dt*w1*st.d1/2; } draw(); });
  function pul(ctx,x,y,R,a,c){ const p=LK.P(); ctx.beginPath(); ctx.arc(x,y,R,0,7); ctx.fillStyle=c; ctx.fill(); ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,R-5,0,7); ctx.strokeStyle='rgba(255,255,255,.4)'; ctx.stroke(); for(let i=0;i<4;i++){ const q=a+i*Math.PI/2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+(R-6)*Math.cos(q),y+(R-6)*Math.sin(q)); ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=2.5; ctx.stroke(); } ctx.beginPath(); ctx.arc(x,y,4,0,7); ctx.fillStyle=p.surface; ctx.fill(); }
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h);
    if(st.mode==='belt'){ const s=Math.min(w/520,h/240); const r1=st.d1/2*s*1.2, r2=st.d2/2*s*1.2; const C1={x:w*.28,y:h/2}, C2={x:w*.72,y:h/2}; const d=C2.x-C1.x;
      ctx.lineWidth=5; ctx.strokeStyle=p.ink2; ctx.setLineDash([12,6]); ctx.lineDashOffset=-st.off*s*1.2;
      const tan=(sgn)=>{ const k=st.cross?(r1+r2)/d:(r1-r2)/d; const b=Math.acos(Math.max(-1,Math.min(1,k))); const n={x:Math.cos(sgn*b),y:Math.sin(sgn*b)}; return [{x:C1.x+r1*n.x,y:C1.y+r1*n.y},{x:C2.x+(st.cross?-r2:r2)*n.x,y:C2.y+(st.cross?-r2:r2)*n.y}]; };
      [1,-1].forEach(sg=>{ const [a,b]=tan(sg); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(C1.x,C1.y,r1+2,0,7); ctx.stroke(); ctx.beginPath(); ctx.arc(C2.x,C2.y,r2+2,0,7); ctx.stroke();
      pul(ctx,C1.x,C1.y,r1,st.a1,p.brand); pul(ctx,C2.x,C2.y,r2,st.a2,p.accent); rotArrow(ctx,C1.x,C1.y,r1+14,1,p.ink2); rotArrow(ctx,C2.x,C2.y,r2+14,st.cross?-1:1,p.ink2);
      LK.text(ctx,'DRIVER',C1.x,C1.y+r1+24,{align:'center',size:11,weight:700,color:p.brand}); LK.text(ctx,'DRIVEN',C2.x,C2.y+r2+24,{align:'center',size:11,weight:700,color:p.accent});
      const vr=st.d2/st.d1; ro({a:(vr>=1?LK.fmt(vr,2)+' : 1':'1 : '+LK.fmt(1/vr,2)),b:LK.fmt(st.rpm/vr,1)+' rpm',c:st.cross?'Reversed':'Same',d:LK.fmt(Math.PI*st.d1/1000*st.rpm/60,2)+' m/s'}); }
    else { const n=st.n; const lines=n+1; const R=Math.min(20,w/(lines*2.6)); const gapX=R*2; const x0=w/2-(lines-1)*gapX/2; const topY=34; const baseBot=h-90; const s=(h-200)/100; const botY=baseBot-st.lift*s;
      ctx.fillStyle=p.line2; ctx.fillRect(x0-40,6,(lines-1)*gapX+80,10);
      ctx.strokeStyle=p.ink2; ctx.lineWidth=2.5;
      const X=i=>x0+i*gapX;
      for(let i=0;i<lines;i++){ const x=X(i); const y1=topY+R, y2=i===0? Math.min(h-12,botY+40+ n*st.lift*s*.0 + st.lift*s*(n)) : botY-R; ctx.beginPath(); ctx.moveTo(x,y1); ctx.lineTo(x,i===0?Math.min(h-14,baseBot-10+n*st.lift*s*0.35):((i%2===1&&i+1>=lines)?botY:y2)); ctx.stroke(); }
      // top pulleys connect (0,1),(2,3)...
      for(let i=0;i<lines;i+=2){ if(i+1<lines){ const cx=(X(i)+X(i+1))/2; ctx.beginPath(); ctx.arc(cx,topY+R,R,Math.PI,0); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,topY+R,R-3,0,7); ctx.fillStyle=p.brand; ctx.globalAlpha=.35; ctx.fill(); ctx.globalAlpha=1; ctx.beginPath(); ctx.moveTo(cx,16); ctx.lineTo(cx,topY+R); ctx.strokeStyle=p.line2; ctx.lineWidth=3; ctx.stroke(); ctx.strokeStyle=p.ink2; ctx.lineWidth=2.5; } else { ctx.beginPath(); ctx.moveTo(X(i),16); ctx.lineTo(X(i),topY+R); ctx.stroke(); } }
      for(let i=1;i<lines;i+=2){ if(i+1<lines){ const cx=(X(i)+X(i+1))/2; ctx.beginPath(); ctx.arc(cx,botY-R,R,0,Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,botY-R,R-3,0,7); ctx.fillStyle=p.accent; ctx.globalAlpha=.35; ctx.fill(); ctx.globalAlpha=1; } }
      const bx1=X(1)-12, bx2=X(lines-1)+12; ctx.fillStyle=p.line2; ctx.fillRect(Math.min(bx1,X(1)-12),botY,Math.max(24,bx2-bx1),8);
      const bs=36+st.load/2000*30; const bc=(X(1)+X(lines-1))/2; ctx.fillStyle=p.accent; ctx.fillRect(bc-bs/2,botY+18,bs,bs); ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.strokeRect(bc-bs/2,botY+18,bs,bs); ctx.beginPath(); ctx.moveTo(bc,botY+8); ctx.lineTo(bc,botY+18); ctx.stroke();
      LK.text(ctx,st.load+' N',bc,botY+18+bs/2,{align:'center',size:11,weight:700,color:'#fff'});
      const ey=Math.min(h-14,baseBot-10+n*st.lift*s*0.35); LK.arrow(ctx,X(0)-14,ey-40,X(0)-14,ey,p.good,3,10); LK.text(ctx,'EFFORT',X(0)-20,ey-50,{align:'right',size:11,weight:700,color:p.good});
      ro({a:String(n),b:LK.fmt(st.load/n,0)+' N',c:LK.fmt(st.lift*n,0)+' mm',d:st.lift+' mm'}); } }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});
})();
