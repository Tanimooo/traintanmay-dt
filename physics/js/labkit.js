/* Lab kit: shared helpers for every simulation */
(function(){
'use strict';
window.LABS = window.LABS || {};
const LK = window.LK = {};
LK.time={scale:1,paused:false,step:0};
let PAL=null;
window.addEventListener('themechange',()=>{PAL=null;});
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{PAL=null;}); }catch(e){}
LK.P = ()=>{ if(PAL) return PAL; const cs=getComputedStyle(document.documentElement); const g=n=>cs.getPropertyValue(n).trim();
  PAL={bg:g('--surface-2'),surface:g('--surface'),ink:g('--ink'),ink2:g('--ink-2'),muted:g('--muted'),line:g('--line'),line2:g('--line-strong'),brand:g('--brand'),deep:g('--deep'),accent:g('--accent'),teal:g('--teal'),good:g('--good'),warn:g('--warn'),bad:g('--bad'),soft:g('--brand-soft'),accentSoft:g('--accent-soft'),tealSoft:g('--teal-soft'),grid:g('--grid'),mono:g('--f-mono')||'monospace',body:g('--f-body')||'sans-serif'}; return PAL; };
LK.el = html=>{ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
LK.esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
LK.reduced = ()=>{ try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;} };
let uid=0; const nid=()=>'lk'+(++uid);

/* scope: everything a lab creates is cleaned up by dispose() */
LK.scope = ()=>{
  const fns=[]; let dead=false;
  const S={
    add(f){fns.push(f);return f;},
    get dead(){return dead;},
    dispose(){dead=true; fns.splice(0).forEach(f=>{try{f();}catch(e){}});},
    loop(fn){ let id=0,last=performance.now(),run=true;
      const tick=t=>{ if(!run) return; let dt=Math.max(0,Math.min(0.05,(t-last)/1000)); last=Math.max(last,t); const T=LK.time; if(T.paused){ if(T.step>0){ T.step--; dt=1/60; } else dt=0; } else dt*=T.scale; if(!document.hidden) fn(dt,t/1000); id=requestAnimationFrame(tick); };
      id=requestAnimationFrame(tick); const stop=()=>{run=false;cancelAnimationFrame(id);}; fns.push(stop); return stop; },
    on(target,ev,h,o){ target.addEventListener(ev,h,o); fns.push(()=>target.removeEventListener(ev,h,o)); }
  };
  return S;
};

/* canvas stage that keeps its aspect and DPR */
LK.stage = (parent,S,opt={})=>{
  const cv=document.createElement('canvas'); cv.className='stage'; parent.appendChild(cv);
  const ctx=cv.getContext('2d'); const st={cv,ctx,w:0,h:0,onResize:null};
  const ratio=opt.ratio||0.5, maxH=opt.maxH||460, minH=opt.minH||220;
  const fit=()=>{ const W=Math.max(260,cv.parentElement? cv.parentElement.clientWidth:600); const H=Math.round(Math.max(minH,Math.min(maxH,W*ratio))); const d=Math.min(2,window.devicePixelRatio||1);
    cv.style.height=H+'px'; cv.width=Math.round(W*d); cv.height=Math.round(H*d); ctx.setTransform(d,0,0,d,0,0); st.w=W; st.h=H; st.onResize&&st.onResize(); };
  fit(); let ro=null; try{ ro=new ResizeObserver(()=>{ const W=cv.parentElement?cv.parentElement.clientWidth:0; if(Math.abs(W-st.w)>2) fit(); }); ro.observe(parent); S.add(()=>ro.disconnect()); }catch(e){ S.on(window,'resize',fit); }
  st.pos = e=>{ const r=cv.getBoundingClientRect(); const p=e.touches?e.touches[0]:e; return {x:p.clientX-r.left,y:p.clientY-r.top}; };
  st.clear = ()=>{ const P=LK.P(); ctx.fillStyle=P.bg; ctx.fillRect(0,0,st.w,st.h); };
  return st;
};

/* controls */
LK.ctrl = parent=>{ const d=document.createElement('div'); d.className='lab-ctrl'; parent.appendChild(d); return d; };
LK.slider = (ctrl,o)=>{ const id=nid(); const lab=LK.el(`<label for="${id}"><span></span><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${o.value}"></label>`); ctrl.appendChild(lab);
  const inp=lab.querySelector('input'), sp=lab.querySelector('span'); const fmt=o.fmt||(v=>v);
  const upd=()=>{ sp.textContent=`${o.label}: ${fmt(+inp.value)}`; };
  inp.addEventListener('input',()=>{ upd(); o.on&&o.on(+inp.value); }); upd();
  return {input:inp,get v(){return +inp.value;},set(v){inp.value=v;upd();},refresh:upd}; };
LK.select = (ctrl,o)=>{ const id=nid(); const lab=LK.el(`<label for="${id}"><span>${LK.esc(o.label)}</span><select id="${id}">${o.options.map(([v,l])=>`<option value="${LK.esc(v)}">${LK.esc(l)}</option>`).join('')}</select></label>`); ctrl.appendChild(lab); const s=lab.querySelector('select'); if(o.value!=null) s.value=o.value; s.addEventListener('change',()=>o.on&&o.on(s.value)); return s; };
LK.check = (ctrl,label,val,on)=>{ const id=nid(); const lab=LK.el(`<label class="toggle" for="${id}"><input id="${id}" type="checkbox" ${val?'checked':''}> ${LK.esc(label)}</label>`); ctrl.appendChild(lab); const c=lab.querySelector('input'); c.addEventListener('change',()=>on&&on(c.checked)); return c; };
LK.button = (ctrl,label,on,cls='')=>{ const b=LK.el(`<button type="button" class="btn btn-sm ${cls}">${LK.esc(label)}</button>`); b.addEventListener('click',on); ctrl.appendChild(b); return b; };
LK.readout = (parent,items)=>{ const d=LK.el(`<div class="readout">${items.map(([k,l])=>`<div><b data-k="${k}" style="white-space:nowrap;font-variant-numeric:tabular-nums">–</b><span>${l}</span></div>`).join('')}</div>`); parent.appendChild(d);
  // boxes only ever grow (to the longest value shown so far) so changing numbers do not make them jitter
  const mx={}; return {set(k,v){ const b=d.querySelector(`[data-k="${k}"]`); const t=String(v); if(!b||b.textContent===t) return; b.textContent=t; const n=Math.max(t.length,6); if(!(mx[k]>=n)){ mx[k]=n+1; b.style.minWidth=(n+1)+'ch'; } }}; };
LK.note = (parent,html)=>{ const n=LK.el(`<div class="lab-note">${html}</div>`); parent.appendChild(n); return n; };

/* numbers */
LK.sig = (v,s=3)=>{ if(!isFinite(v)) return '–'; if(v===0) return '0'; const a=Math.abs(v); if(a>=1e5||a<1e-3){ const e=Math.floor(Math.log10(a)); const m=v/Math.pow(10,e); return `${(+m.toPrecision(s)).toString()} × 10${LK.sup(e)}`; } return (+v.toPrecision(s)).toString(); };
LK.sup = n=>String(n).split('').map(c=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c]||c)).join('');
LK.fx = (v,d=2)=>isFinite(v)?v.toFixed(d):'–';
LK.gauss = ()=>{ let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
LK.nice = (span,n=5)=>{ const raw=span/n; const p=Math.pow(10,Math.floor(Math.log10(raw))); const f=raw/p; return (f<1.5?1:f<3?2:f<7?5:10)*p; };

/* drawing helpers */
LK.arrow = (ctx,x1,y1,x2,y2,col,w=2,head=9)=>{ const a=Math.atan2(y2-y1,x2-x1), L=Math.hypot(x2-x1,y2-y1); if(L<1) return; ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2-Math.cos(a)*head*0.8,y2-Math.sin(a)*head*0.8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-head*Math.cos(a-0.4),y2-head*Math.sin(a-0.4)); ctx.lineTo(x2-head*Math.cos(a+0.4),y2-head*Math.sin(a+0.4)); ctx.closePath(); ctx.fill(); ctx.restore(); };
LK.text = (ctx,t,x,y,col,o={})=>{ const P=LK.P(); ctx.save(); ctx.fillStyle=col||P.ink; ctx.font=`${o.weight||500} ${o.size||12}px ${o.mono===false?P.body:P.mono}`; ctx.textAlign=o.align||'left'; ctx.textBaseline=o.base||'alphabetic'; ctx.fillText(t,x,y); ctx.restore(); };
LK.grid = (ctx,w,h,step=24)=>{ const P=LK.P(); ctx.save(); ctx.strokeStyle=P.grid; ctx.lineWidth=1; ctx.beginPath(); for(let x=0;x<w;x+=step){ctx.moveTo(x+.5,0);ctx.lineTo(x+.5,h);} for(let y=0;y<h;y+=step){ctx.moveTo(0,y+.5);ctx.lineTo(w,y+.5);} ctx.stroke(); ctx.restore(); };
LK.rr = (ctx,x,y,w,h,r)=>{ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); };
LK.spring = (ctx,x1,y1,x2,y2,coils=10,amp=8)=>{ const L=Math.hypot(x2-x1,y2-y1), a=Math.atan2(y2-y1,x2-x1); ctx.save(); ctx.translate(x1,y1); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0,0); const s=L*0.1; ctx.lineTo(s,0); const n=coils*2; for(let i=1;i<n;i++){ ctx.lineTo(s+(L-2*s)*i/n,(i%2?1:-1)*amp); } ctx.lineTo(L-s,0); ctx.lineTo(L,0); ctx.stroke(); ctx.restore(); };
LK.wl2rgb = nm=>{ let r=0,g=0,b=0; if(nm>=380&&nm<440){r=-(nm-440)/60;b=1;}else if(nm<490){g=(nm-440)/50;b=1;}else if(nm<510){g=1;b=-(nm-510)/20;}else if(nm<580){r=(nm-510)/70;g=1;}else if(nm<645){r=1;g=-(nm-645)/65;}else if(nm<=780){r=1;} let f=1; if(nm<420)f=.3+.7*(nm-380)/40; else if(nm>700)f=.3+.7*(780-nm)/80; const c=v=>Math.round(255*Math.pow(Math.max(0,v*f),0.8)); return `rgb(${c(r)},${c(g)},${c(b)})`; };

/* live plot widget */
LK.plot = (parent,S,o={})=>{
  const wrap=LK.el('<div class="plotwrap"></div>'); parent.appendChild(wrap);
  const st=LK.stage(wrap,S,{ratio:o.ratio||0.45,maxH:o.maxH||300,minH:o.minH||180});
  const P_={series:[],opt:{}};
  const draw=()=>{ const P=LK.P(), c=st.ctx, W=st.w, H=st.h; st.clear();
    const m={l:56,r:14,t:14,b:38}; const pw=W-m.l-m.r, ph=H-m.t-m.b;
    let xs=[],ys=[]; P_.series.forEach(s=>s.pts.forEach(p=>{xs.push(p[0]);ys.push(p[1]);}));
    let xmin=P_.opt.xmin??(xs.length?Math.min(...xs):0), xmax=P_.opt.xmax??(xs.length?Math.max(...xs):1);
    let ymin=P_.opt.ymin??(ys.length?Math.min(0,...ys):0), ymax=P_.opt.ymax??(ys.length?Math.max(...ys):1);
    if(P_.opt.zeroX!==false && P_.opt.xmin==null) xmin=Math.min(0,xmin);
    if(xmax-xmin<1e-12){xmax=xmin+1;} if(ymax-ymin<1e-12){ymax=ymin+1;} const pad=(ymax-ymin)*0.06; if(P_.opt.ymax==null) ymax+=pad; if(P_.opt.ymin==null&&ymin<0) ymin-=pad;
    const X=v=>m.l+(v-xmin)/(xmax-xmin)*pw, Y=v=>m.t+ph-(v-ymin)/(ymax-ymin)*ph;
    c.strokeStyle=P.line; c.lineWidth=1; c.fillStyle=P.muted; c.font=`11px ${P.mono}`;
    const sx=LK.nice(xmax-xmin), sy=LK.nice(ymax-ymin);
    c.textAlign='center'; for(let v=Math.ceil(xmin/sx)*sx; v<=xmax+1e-9; v+=sx){ const x=X(v); c.beginPath(); c.moveTo(x+.5,m.t); c.lineTo(x+.5,m.t+ph); c.stroke(); c.fillText(LK.sig(+v.toPrecision(6),3),x,m.t+ph+14); }
    c.textAlign='right'; for(let v=Math.ceil(ymin/sy)*sy; v<=ymax+1e-9; v+=sy){ const y=Y(v); c.beginPath(); c.moveTo(m.l,y+.5); c.lineTo(m.l+pw,y+.5); c.stroke(); c.fillText(LK.sig(+v.toPrecision(6),3),m.l-5,y+4); }
    c.strokeStyle=P.ink2; c.lineWidth=1.4; c.beginPath(); const y0=Y(Math.max(ymin,Math.min(ymax,0))); c.moveTo(m.l,y0); c.lineTo(m.l+pw,y0); c.moveTo(X(Math.max(xmin,Math.min(xmax,0))),m.t); c.lineTo(X(Math.max(xmin,Math.min(xmax,0))),m.t+ph); c.stroke();
    c.fillStyle=P.ink2; c.textAlign='center'; c.font=`600 12px ${P.body}`; c.fillText(o.xlab||P_.opt.xlab||'',m.l+pw/2,H-6);
    c.save(); c.translate(13,m.t+ph/2); c.rotate(-Math.PI/2); c.fillText(o.ylab||P_.opt.ylab||'',0,0); c.restore();
    c.save(); c.beginPath(); c.rect(m.l,m.t,pw,ph); c.clip();
    P_.series.forEach(s=>{ const col=s.color||P.brand; c.strokeStyle=col; c.fillStyle=col; c.lineWidth=s.w||2.2; c.setLineDash(s.dash||[]);
      if(s.points){ s.pts.forEach(p=>{ c.beginPath(); c.arc(X(p[0]),Y(p[1]),s.r||4,0,7); c.fill(); if(p[2]){ c.beginPath(); c.lineWidth=1.3; c.moveTo(X(p[0]),Y(p[1]-p[2])); c.lineTo(X(p[0]),Y(p[1]+p[2])); c.stroke(); } }); }
      else { c.beginPath(); s.pts.forEach((p,i)=>{ const x=X(p[0]),y=Y(p[1]); i?c.lineTo(x,y):c.moveTo(x,y); }); c.stroke(); }
      c.setLineDash([]); });
    c.restore();
    if(P_.opt.legend){ let lx=m.l+8; P_.series.filter(s=>s.name).forEach(s=>{ c.fillStyle=s.color||P.brand; c.fillRect(lx,m.t+6,12,4); c.fillStyle=P.ink2; c.textAlign='left'; c.font=`11px ${P.body}`; c.fillText(s.name,lx+16,m.t+11); lx+=c.measureText(s.name).width+34; }); }
    P_.map={X,Y,xmin,xmax,ymin,ymax,m};
  };
  st.onResize=draw;
  return {set(series,opt){ P_.series=series; P_.opt=Object.assign({},opt||{}); draw(); }, redraw:draw, stage:st, get map(){return P_.map;}};
};

/* least squares */
LK.fit = pts=>{ const n=pts.length; if(n<2) return null; let sx=0,sy=0,sxx=0,sxy=0; pts.forEach(([x,y])=>{sx+=x;sy+=y;sxx+=x*x;sxy+=x*y;}); const d=n*sxx-sx*sx; if(Math.abs(d)<1e-30) return null; const m=(n*sxy-sx*sy)/d, c=(sy-m*sx)/n;
  let ssr=0,sst=0; const my=sy/n; pts.forEach(([x,y])=>{ ssr+=(y-(m*x+c))**2; sst+=(y-my)**2; }); const se=n>2?Math.sqrt(ssr/(n-2)/(sxx-sx*sx/n)):0; return {m,c,r2:sst?1-ssr/sst:1,se}; };
})();

/* ---------- lab frame: layout, transport, guided experiments ---------- */
(function(){
const LK=window.LK;
const findCtl=(root,label)=>{ const want=String(label).toLowerCase(); const labs=Array.from(root.querySelectorAll('label')); const lab=labs.find(l=>{ const sp=l.querySelector('span'); const txt=(sp?sp.textContent:l.textContent).toLowerCase().trim(); return txt.startsWith(want); }); return lab?lab.querySelector('input,select'):null; };
LK.api=root=>({
  set(label,val){ const c=findCtl(root,label); if(!c) return false; if(c.type==='checkbox'){ if(c.checked!==!!val){ c.checked=!!val; c.dispatchEvent(new Event('change',{bubbles:true})); } } else { c.value=String(val); c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true})); } return true; },
  click(text){ const b=Array.from(root.querySelectorAll('button')).find(x=>x.textContent.trim().toLowerCase().startsWith(String(text).toLowerCase())); if(b){ b.click(); return true; } return false; },
  speed(v){ LK.time.scale=v; LK.time.paused=false; root.dispatchEvent(new Event('lk-time')); },
  preset(...a){ const b=root.querySelector('.lab-body'); if(b&&b.lkPreset) b.lkPreset(...a); }
});
LK.frame=(root,lab,guides)=>{
  LK.time.scale=1; LK.time.paused=false; LK.time.step=0;
  root.classList.add('labframe'); root.innerHTML='';
  const how=lab.howto||(window.LABHOW||{})[lab.id];
  if(how) root.appendChild(LK.el(`<div class="lab-howto"><b>How to use:</b> ${how}</div>`));
  const grid=LK.el('<div class="lab-grid"><div class="lab-main"></div><aside class="lab-side"></aside></div>'); root.appendChild(grid);
  const main=grid.querySelector('.lab-main'), side=grid.querySelector('.lab-side');
  let tbar=null;
  if(lab.anim!==false){ tbar=LK.el(`<div class="transport" role="group" aria-label="Time controls"><button type="button" class="tbtn" data-a="play" aria-label="Pause">❚❚</button><button type="button" class="tbtn" data-a="step" aria-label="Step one frame" title="Step one frame">▸|</button><span class="tlabel">Speed</span>${[0.1,0.25,0.5,1,2].map(v=>`<button type="button" class="tspd" data-s="${v}" aria-pressed="${v===1}">${v<1?'×'+v:'×'+v}</button>`).join('')}</div>`); main.appendChild(tbar);
    const sync=()=>{ const pb=tbar.querySelector('[data-a="play"]'); pb.textContent=LK.time.paused?'▶':'❚❚'; pb.setAttribute('aria-label',LK.time.paused?'Play':'Pause'); tbar.querySelectorAll('.tspd').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.s===LK.time.scale)); };
    tbar.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; if(b.dataset.a==='play') LK.time.paused=!LK.time.paused; if(b.dataset.a==='step'){ LK.time.paused=true; LK.time.step=1; } if(b.dataset.s) LK.time.scale=+b.dataset.s; sync(); });
    root.addEventListener('lk-time',sync); sync(); }
  const body=LK.el('<div class="lab-body"></div>'); main.appendChild(body);
  const dispose=lab.mount(body);
  // move control rows into the side panel unless the lab keeps them inline
  const cp=LK.el('<div class="lab-panel"><h4>Controls</h4></div>');
  if(!lab.inlineControls){ Array.from(body.children).filter(c=>c.classList.contains('lab-ctrl')).forEach(c=>cp.appendChild(c)); }
  if(cp.children.length>1) side.appendChild(cp);
  Array.from(body.querySelectorAll(':scope > .lab-after')).forEach(n=>root.appendChild(n));
  const notes=Array.from(body.querySelectorAll(':scope > .lab-note'));
  if(guides&&guides.length){ const api=LK.api(root); const gp=LK.el(`<div class="lab-panel guide"><h4>Experiments to try</h4><ol class="glist">${guides.map((g,i)=>`<li><details ${i===0?'open':''}><summary>${LK.esc(g.t)}</summary><p>${g.d}</p>${g.set?`<button type="button" class="btn btn-sm primary" data-g="${i}">Set it up</button>`:''}${g.q?`<div class="gq"><b>Question:</b> ${g.q} <details class="ga"><summary>Show answer</summary><p>${g.a}</p></details></div>`:''}</details></li>`).join('')}</ol></div>`);
    gp.addEventListener('click',e=>{ const b=e.target.closest('[data-g]'); if(!b) return; try{ guides[+b.dataset.g].set(api); }catch(err){} b.textContent='Set up again'; });
    side.appendChild(gp); }
  if(notes.length){ const ph=LK.el('<details class="lab-panel physics"><summary><h4>The physics</h4></summary></details>'); notes.forEach(n=>ph.appendChild(n)); side.appendChild(ph); }
  return ()=>{ LK.time.scale=1; LK.time.paused=false; dispose&&dispose(); };
};
})();
