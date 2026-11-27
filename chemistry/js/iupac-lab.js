/* TrainTanmay Chemistry: IUPAC naming lab.
   Two modes: type a name and see the molecule drawn as you type (with the correct IUPAC name if yours isn't quite right),
   or name a randomly drawn molecule. Uses the engine in iupac-engine.js. */
(function(){
'use strict';
const LK=window.LK, L=window.LABS, I=window.IUPAC;
if(!LK||!L||!I) return;

/* ---------- 2D layout (units: one bond = 1) ---------- */
function layout(m,an){
  const A=I.adj(m), N=m.atoms.length, P=new Array(N).fill(null), turn=new Array(N).fill(0);
  const rings=I.findRings(m,A), ringOf=new Array(N).fill(-1); rings.forEach((r,k)=>r.forEach(a=>{ ringOf[a]=k; }));
  const done=new Set(), q=[];
  const ord=an&&an.best?an.best.ord:null;
  const ringR=L_=>1/(2*Math.sin(Math.PI/L_));
  const putRing=(k,start,cx,cy,base)=>{ const r=rings[k], n=r.length, R=ringR(n), i0=r.indexOf(start);
    for(let t=0;t<n;t++){ const a=r[(i0+t)%n], g=base+t*2*Math.PI/n; P[a]={x:cx+R*Math.cos(g),y:cy+R*Math.sin(g)}; q.push(a); } done.add(k); };
  if(ord&&an.best.cd.ring){ const n=ord.length, R=ringR(n); ord.forEach((a,t)=>{ const g=Math.PI/2-t*2*Math.PI/n; P[a]={x:R*Math.cos(g),y:R*Math.sin(g)}; q.push(a); }); done.add(ringOf[ord[0]]); }
  else if(ord){ ord.forEach((a,i)=>{ P[a]={x:i*0.866,y:i%2?0.5:0}; turn[a]=i===0?1:(i%2?1:-1); q.push(a); }); }
  else { P[0]={x:0,y:0}; q.push(0); }
  const unit=g=>({x:Math.cos(g),y:Math.sin(g)});
  const clear=(a,g)=>{ const p={x:P[a].x+Math.cos(g),y:P[a].y+Math.sin(g)}; let d=9; P.forEach((o,i)=>{ if(o&&i!==a) d=Math.min(d,Math.hypot(o.x-p.x,o.y-p.y)); }); return d; };
  while(q.length){
    const a=q.shift(); const un=A[a].filter(x=>!P[x.j]); if(!un.length) continue;
    const pl=A[a].filter(x=>P[x.j]).map(x=>Math.atan2(P[x.j].y-P[a].y,P[x.j].x-P[a].x));
    const linear=A[a].some(x=>x.o===3)||A[a].filter(x=>x.o===2&&!x.ar).length===2;
    const k=un.length; let dirs=[];
    if(!pl.length){ for(let i=0;i<k;i++) dirs.push(Math.PI/6+i*2*Math.PI/k); }
    else if(pl.length===1){ const a0=pl[0], din=a0+Math.PI;
      if(linear&&k===1) dirs=[din];
      else if(k===1){ const s=-(turn[a]||-1); let g=din+s*Math.PI/3; const g2=din-s*Math.PI/3; if(clear(a,g2)>clear(a,g)+0.15) g=g2; dirs=[g]; }
      else if(k===2) dirs=[din-Math.PI/3,din+Math.PI/3];
      else dirs=[a0+Math.PI/2,din,a0-Math.PI/2]; }
    else { const s=pl.map(g=>(g+4*Math.PI)%(2*Math.PI)).sort((x,y)=>x-y); let gs=0,gap=-1; for(let i=0;i<s.length;i++){ const nx=i+1<s.length?s[i+1]:s[0]+2*Math.PI; if(nx-s[i]>gap){ gap=nx-s[i]; gs=s[i]; } }
      for(let i=0;i<k;i++) dirs.push(gs+gap*(i+1)/(k+1)); }
    // put the longest branch in the roomiest direction
    const size=j=>{ const seen=new Set([a,j]), st=[j]; while(st.length){ const u=st.pop(); A[u].forEach(x=>{ if(!seen.has(x.j)&&!P[x.j]){ seen.add(x.j); st.push(x.j); } }); } return seen.size; };
    if(k>1){ un.sort((x,y)=>size(y.j)-size(x.j)); }
    un.forEach((x,i)=>{ const j=x.j, g=dirs[i]; const u=unit(g);
      if(ringOf[j]>=0&&!done.has(ringOf[j])){ const n=rings[ringOf[j]].length, R=ringR(n); const px=P[a].x+u.x, py=P[a].y+u.y; putRing(ringOf[j],j,px+u.x*R,py+u.y*R,g+Math.PI); return; }
      P[j]={x:P[a].x+u.x,y:P[a].y+u.y}; const rel=Math.atan2(Math.sin(g-(pl.length===1?pl[0]+Math.PI:g)),Math.cos(g-(pl.length===1?pl[0]+Math.PI:g))); turn[j]=rel>0.01?1:rel<-0.01?-1:(turn[a]||1); q.push(j); });
  }
  P.forEach((p,i)=>{ if(!p) P[i]={x:Math.random(),y:Math.random()}; });
  // relax any clashes
  const bonded=new Set(m.bonds.map(b=>b.a+'-'+b.b).concat(m.bonds.map(b=>b.b+'-'+b.a)));
  const minD=()=>{ let d=9; for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) if(!bonded.has(i+'-'+j)) d=Math.min(d,Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y)); return d; };
  if(N>2&&minD()<0.6){
    for(let it=0;it<400;it++){ const F=P.map(()=>({x:0,y:0}));
      m.bonds.forEach(b=>{ const dx=P[b.b].x-P[b.a].x, dy=P[b.b].y-P[b.a].y, d=Math.hypot(dx,dy)||1e-3, f=(d-1)*0.3; F[b.a].x+=dx/d*f; F[b.a].y+=dy/d*f; F[b.b].x-=dx/d*f; F[b.b].y-=dy/d*f; });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){ if(bonded.has(i+'-'+j)) continue; const dx=P[j].x-P[i].x, dy=P[j].y-P[i].y, d=Math.hypot(dx,dy)||1e-3; if(d<1.45){ const f=(1.45-d)*0.18; F[i].x-=dx/d*f; F[i].y-=dy/d*f; F[j].x+=dx/d*f; F[j].y+=dy/d*f; } }
      P.forEach((p,i)=>{ p.x+=F[i].x; p.y+=F[i].y; }); }
  }
  return {P,A,rings,ringOf};
}

/* ---------- drawing ---------- */
const SUBD=n=>String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
function drawMol(ctx,W,H,m,an,o){
  o=o||{}; const Pal=LK.P();
  ctx.save(); ctx.fillStyle=o.bg||Pal.bg; ctx.fillRect(0,0,W,H);
  if(!m||!m.atoms.length){ ctx.restore(); return; }
  const {P,A,rings}=layout(m,an), N=m.atoms.length;
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity; P.forEach(p=>{ x0=Math.min(x0,p.x); x1=Math.max(x1,p.x); y0=Math.min(y0,p.y); y1=Math.max(y1,p.y); });
  const pad=o.pad||44, s=Math.min(o.max||56,(W-2*pad)/Math.max(0.5,x1-x0),(H-2*pad)/Math.max(0.5,y1-y0));
  const cx=W/2, cy=H/2, mx=(x0+x1)/2, my=(y0+y1)/2;
  const X=i=>cx+(P[i].x-mx)*s, Y=i=>cy-(P[i].y-my)*s;
  const fs=Math.max(12,Math.min(20,s*0.42)), ink=o.ink||Pal.ink;
  const COL={O:o.mono?ink:'#d64545',N:o.mono?ink:'#3b6fd9',F:o.mono?ink:'#2e9e6a',Cl:o.mono?ink:'#2e9e6a',Br:o.mono?ink:'#a0522d',I:o.mono?ink:'#8a4fc0',NO2:o.mono?ink:'#3b6fd9'};
  const lab=i=>m.atoms[i].el!=='C'||(N===1);
  const order=an&&an.best?an.best.ord:null, locOf=new Map(order?order.map((a,k)=>[a,k+1]):[]);
  // parent highlight
  if(o.numbers&&order){ ctx.save(); ctx.strokeStyle=Pal.brand; ctx.globalAlpha=0.22; ctx.lineWidth=Math.max(8,s*0.26); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath();
    order.forEach((a,k)=>{ k?ctx.lineTo(X(a),Y(a)):ctx.moveTo(X(a),Y(a)); }); if(an.best.cd.ring) ctx.closePath(); if(order.length===1){ ctx.arc(X(order[0]),Y(order[0]),s*0.14,0,7); } ctx.stroke(); ctx.restore(); }
  // bonds
  ctx.lineCap='round'; ctx.lineWidth=Math.max(1.6,s*0.045); ctx.strokeStyle=ink;
  const shrink=fs*0.62, g=Math.max(4,s*0.13);
  const aromBonds=new Set(); rings.forEach(r=>{ if(I.isArom(m,r)) r.forEach((a,k)=>{ const b=r[(k+1)%r.length]; aromBonds.add(a+'-'+b); aromBonds.add(b+'-'+a); }); });
  const line=(xa,ya,xb,yb)=>{ ctx.beginPath(); ctx.moveTo(xa,ya); ctx.lineTo(xb,yb); ctx.stroke(); };
  m.bonds.forEach(b=>{
    let xa=X(b.a),ya=Y(b.a),xb=X(b.b),yb=Y(b.b); const dx=xb-xa, dy=yb-ya, d=Math.hypot(dx,dy)||1, ux=dx/d, uy=dy/d, nx=-uy, ny=ux;
    if(lab(b.a)){ xa+=ux*shrink; ya+=uy*shrink; } if(lab(b.b)){ xb-=ux*shrink; yb-=uy*shrink; }
    if(b.o===1||aromBonds.has(b.a+'-'+b.b)){ line(xa,ya,xb,yb); return; }
    if(b.o===3){ line(xa,ya,xb,yb); line(xa+nx*g,ya+ny*g,xb+nx*g,yb+ny*g); line(xa-nx*g,ya-ny*g,xb-nx*g,yb-ny*g); return; }
    // double bond: which side has more neighbours?
    let side=0; [b.a,b.b].forEach(at=>A[at].forEach(x=>{ if(x.j===b.a||x.j===b.b) return; const c=(X(x.j)-X(b.a))*nx+(Y(x.j)-Y(b.a))*ny; side+=c>1?1:c<-1?-1:0; }));
    const hetero=lab(b.a)||lab(b.b);
    if(side===0||hetero){ line(xa+nx*g/2,ya+ny*g/2,xb+nx*g/2,yb+ny*g/2); line(xa-nx*g/2,ya-ny*g/2,xb-nx*g/2,yb-ny*g/2); return; }
    const sg=side>0?1:-1; line(xa,ya,xb,yb); const t=0.14*d; line(xa+ux*t+nx*g*sg,ya+uy*t+ny*g*sg,xb-ux*t+nx*g*sg,yb-uy*t+ny*g*sg);
  });
  rings.forEach(r=>{ if(!I.isArom(m,r)) return; let ax=0,ay=0; r.forEach(a=>{ ax+=X(a); ay+=Y(a); }); ax/=r.length; ay/=r.length; ctx.beginPath(); ctx.arc(ax,ay,s*0.6,0,7); ctx.stroke(); });
  // atom labels
  ctx.textBaseline='middle';
  for(let i=0;i<N;i++){ if(!lab(i)) continue;
    const el=m.atoms[i].el, h=I.hcount(m,A,i);
    let sym=el==='NO2'?'N':el, tail=el==='NO2'?'O₂':(h>0?'H'+(h>1?SUBD(h):''):'');
    if(N===1&&el==='C'){ sym='C'; tail='H₄'; }
    let nx=0; A[i].forEach(x=>{ nx+=X(x.j)-X(i); }); const left=nx>2;
    ctx.font=`600 ${fs}px ${Pal.body}`; ctx.fillStyle=COL[el]||ink; ctx.textAlign='center';
    const w=ctx.measureText(sym).width;
    ctx.save(); ctx.fillStyle=o.bg||Pal.bg; ctx.beginPath(); ctx.arc(X(i),Y(i),fs*0.5,0,7); ctx.fill(); ctx.restore();
    ctx.fillText(sym,X(i),Y(i)+1);
    if(tail){ ctx.textAlign=left?'right':'left'; ctx.fillText(tail,left?X(i)-w/2:X(i)+w/2,Y(i)+1); }
  }
  // locants
  if(o.numbers&&order){ ctx.font=`700 ${Math.round(fs*0.72)}px ${Pal.mono}`; ctx.textAlign='center';
    const isR=an.best.cd.ring; let rcx=0,rcy=0; if(isR){ order.forEach(a=>{ rcx+=X(a); rcy+=Y(a); }); rcx/=order.length; rcy/=order.length; }
    order.forEach(a=>{ const used=A[a].map(x=>Math.atan2(Y(x.j)-Y(a),X(x.j)-X(a))); let best=0,bd=-1; const out=Math.atan2(Y(a)-rcy,X(a)-rcx);
      for(let k=0;k<16;k++){ const gg=k*Math.PI/8; if(isR&&Math.abs(Math.atan2(Math.sin(gg-out),Math.cos(gg-out)))>1.3) continue; const d=used.length?Math.min(...used.map(u=>{ const t=Math.abs(Math.atan2(Math.sin(gg-u),Math.cos(gg-u))); return t; })):3; if(d>bd+0.01){ bd=d; best=gg; } }
      const r=fs*0.95, px=X(a)+Math.cos(best)*r, py=Y(a)+Math.sin(best)*r;
      ctx.fillStyle=Pal.brand; ctx.beginPath(); ctx.arc(px,py,fs*0.5,0,7); ctx.fill(); ctx.fillStyle=Pal.bg||'#fff'; ctx.fillText(String(locOf.get(a)),px,py+1); });
  }
  ctx.restore();
}

/* ---------- styles ---------- */
const CSS=`.iu{display:flex;flex-direction:column;gap:12px}
.iu .subtabs{margin-bottom:2px}
.iu-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.iu-in{flex:1;min-width:220px;font-size:1.15rem;padding:11px 14px!important;border-radius:12px!important;font-family:var(--f-body)}
.iu-in:focus{outline:2px solid var(--brand);outline-offset:1px}
.iu-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:.85rem;color:var(--muted)}
.iu-chips button{border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:4px 10px;cursor:pointer;font-size:.84rem;color:var(--ink)}
.iu-chips button:hover{border-color:var(--brand)}
.iu-chips button.bad{border-style:dashed}
.iu-stage{position:relative;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--surface-2)}
.iu-stage canvas{display:block;width:100%}
.iu-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.95rem;pointer-events:none;text-align:center;padding:20px}
.iu-msg{border-radius:12px;padding:12px 14px;border:1px solid var(--line);background:var(--surface);line-height:1.5;min-height:48px}
.iu-msg.good{border-color:var(--good);box-shadow:inset 4px 0 0 var(--good)}
.iu-msg.warn{border-color:var(--warn);box-shadow:inset 4px 0 0 var(--warn)}
.iu-msg.bad{border-color:var(--bad);box-shadow:inset 4px 0 0 var(--bad)}
.iu-msg .nm{font-weight:700;font-size:1.08rem;font-family:var(--f-body);white-space:normal;word-break:break-word}
.iu-msg ul{margin:6px 0 0 18px;padding:0}
.iu-msg .mu{color:var(--muted);font-size:.88rem}
.iu-facts{display:flex;flex-wrap:wrap;gap:8px}
.iu-facts div{border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--surface);font-size:.85rem;color:var(--muted)}
.iu-facts b{display:block;color:var(--ink);font-size:.98rem}
.iu-score{display:flex;gap:16px;flex-wrap:wrap;font-size:.9rem;color:var(--muted)}
.iu-score b{color:var(--ink);font-size:1.05rem;font-variant-numeric:tabular-nums}
.iu-mini{margin-top:8px;border:1px dashed var(--line);border-radius:10px;overflow:hidden}
.iu-mini canvas{display:block;width:100%}
.iu .q{font-weight:700;font-size:1.05rem}`;
const addCSS=()=>{ if(document.getElementById('iu-css')) return; const st=document.createElement('style'); st.id='iu-css'; st.textContent=CSS; document.head.appendChild(st); };

const esc=LK.esc;
const EXAMPLES=['2-methylbutane','but-2-ene','propan-2-ol','4-methylpentan-2-one','ethyl ethanoate','2-chloro-2-methylpropane','buta-1,3-diene','2-aminopropanoic acid','N-methylethanamine','propanenitrile','cyclohexanol','4-nitrophenol','1-phenylethanone'];
const WRONG=['2-ethylpropane','3-chlorobutane','2-methyl-3-ethylpentane','butan-3-ol','1-phenylpropane'];
const LEVELS=[['0','Starter'],['1','Exam standard'],['2','Tricky']];

function miniCanvas(host,m,an){
  const wrap=document.createElement('div'); wrap.className='iu-mini'; host.appendChild(wrap);
  const cv=document.createElement('canvas'); wrap.appendChild(cv);
  const W=Math.max(240,wrap.clientWidth||320), H=180, d=Math.min(2,window.devicePixelRatio||1);
  cv.width=W*d; cv.height=H*d; cv.style.height=H+'px'; const c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0);
  drawMol(c,W,H,m,an,{max:38,pad:30});
}

L.iupac={title:'IUPAC naming: name it or draw it',cat:'Organic',topic:'3.3.1',anim:false,inlineControls:false,
desc:'Type any IUPAC name and watch the molecule draw itself as you type. Get a name wrong and it shows you the correct one and why. Then test yourself: name randomly drawn molecules from every A-level family.',
icon:'<path d="M14 78l20-12 20 12 20-12 20 12" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M54 78v20" stroke="currentColor" stroke-width="5"/><text x="60" y="44" font-size="26" font-weight="700" text-anchor="middle" fill="currentColor" font-family="sans-serif">OH</text><path d="M94 66V50" stroke="currentColor" stroke-width="5"/><text x="18" y="112" font-size="16" font-weight="700" fill="currentColor" font-family="sans-serif">1 2 3 4</text>',
mount(el){ addCSS(); const S=LK.scope();
  let mode='draw', numbers=true, level=1, fams=Object.keys(I.FAMILIES);
  const root=LK.el(`<div class="iu">
    <div class="subtabs" role="group" aria-label="Mode"><button type="button" data-m="draw" aria-pressed="true">Type a name, see the molecule</button><button type="button" data-m="quiz" aria-pressed="false">Name the molecule (quiz)</button></div>
    <div class="iu-draw">
      <div class="iu-row"><input type="text" class="iu-in" id="iuIn" aria-label="Type an IUPAC name" placeholder="Type a name, e.g. 2-methylbutan-2-ol" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
      <div class="iu-chips" style="margin-top:8px"><span>Try:</span>${EXAMPLES.map(x=>`<button type="button" data-ex="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <div class="iu-chips" style="margin-top:6px"><span>Spot the mistake:</span>${WRONG.map(x=>`<button type="button" class="bad" data-ex="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    </div>
    <div class="iu-quiz" hidden>
      <div class="iu-score" aria-live="polite"><span>Score <b data-k="sc">0</b></span><span>Streak <b data-k="st">0</b></span><span>Best streak <b data-k="be">0</b></span></div>
      <div class="q" style="margin-top:6px">Name this molecule</div>
    </div>
    <div class="iu-stage"><div class="iu-empty"></div></div>
    <div class="iu-quizin" hidden>
      <div class="iu-row"><input type="text" class="iu-in" id="iuAns" aria-label="Your answer" placeholder="Type its IUPAC name" autocomplete="off" autocapitalize="off" spellcheck="false">
      <button type="button" class="btn primary" data-a="check">Check</button></div>
      <div class="iu-row" style="margin-top:8px"><button type="button" class="btn btn-sm" data-a="hint">Hint</button><button type="button" class="btn btn-sm" data-a="reveal">Show answer</button><button type="button" class="btn btn-sm" data-a="next">Next molecule →</button></div>
    </div>
    <div class="iu-msg" role="status" aria-live="polite"></div>
    <div class="iu-facts"></div>
  </div>`);
  el.appendChild(root);
  const $=q=>root.querySelector(q);
  const stageHost=$('.iu-stage'), empty=$('.iu-empty'), msg=$('.iu-msg'), facts=$('.iu-facts'), inp=$('#iuIn'), ans=$('#iuAns');
  const st=LK.stage(stageHost,S,{ratio:0.5,maxH:400,minH:240}); stageHost.appendChild(empty);
  let cur=null;   // {mol, an}
  const redraw=()=>{ const c=st.ctx; if(!cur){ st.clear(); return; } drawMol(c,st.w,st.h,cur.mol,cur.an,{numbers:cur.numbers}); };
  st.onResize=redraw;
  window.addEventListener('themechange',redraw); S.add(()=>window.removeEventListener('themechange',redraw));

  /* side panel controls */
  const ct=LK.ctrl(el);
  const cNum=LK.check(ct,'Show the parent chain and numbering',true,v=>{ numbers=v; if(mode==='draw'&&cur){ cur.numbers=v; redraw(); } });
  const ctq=LK.ctrl(el);
  LK.select(ctq,{label:'Quiz difficulty',options:LEVELS,value:'1',on:v=>{ level=+v; if(mode==='quiz') next(); }});
  const famBox=LK.ctrl(el);
  famBox.appendChild(LK.el('<span style="font-size:.82rem;color:var(--muted);font-weight:600">Quiz families</span>'));
  Object.entries(I.FAMILIES).forEach(([k,f])=>LK.check(famBox,f.label,true,v=>{ fams=v?fams.concat(k):fams.filter(x=>x!==k); if(!fams.length){ fams=[k]; } }));

  /* facts */
  const showFacts=(m,an)=>{ if(!m){ facts.innerHTML=''; return; } const f=I.formula(m); let cls=[]; try{ cls=an?I.classify(m,an):[]; }catch(e){}
    facts.innerHTML=`<div>Molecular formula<b>${esc(f.f)}</b></div><div>M<sub>r</sub><b>${f.mr.toFixed(1)}</b></div>${cls.length?`<div>Type<b>${esc(cls.join(' · '))}</b></div>`:''}`; };
  const setMsg=(cls,html)=>{ msg.className='iu-msg'+(cls?' '+cls:''); msg.innerHTML=html; };

  /* ---------- draw mode ---------- */
  let tmr=0;
  const render=()=>{
    const v=inp.value.trim();
    if(!v){ cur=null; redraw(); empty.textContent='Your molecule appears here as you type.'; empty.hidden=false; setMsg('','<span class="mu">Type an IUPAC name above. Each name describes exactly one molecule, so you’ll see it drawn as you type. If the name isn’t quite right, you’ll get the correct one and the reason.</span>'); showFacts(null); return; }
    let r;
    try{ r=I.check(v); }catch(e){ if(!e.iu) console.error(e); cur=null; redraw(); empty.textContent='Keep typing…'; empty.hidden=false; setMsg('warn',`<b>Can’t draw that yet.</b> ${esc(e.iu?e.message:'Something went wrong reading that name.')}`); showFacts(null); return; }
    empty.hidden=true;
    const notes=r.notes.length?`<div class="mu" style="margin-top:6px">${r.notes.map(esc).join(' ')}</div>`:'';
    if(!r.ok){ cur={mol:r.mol,an:null}; redraw(); setMsg('warn',`Drawn from your name. ${esc(r.unnamed)}${notes}`); showFacts(r.mol,null); return; }
    cur={mol:r.mol,an:r.an,numbers}; redraw(); showFacts(r.mol,r.an);
    if(r.valid){
      const same=I.norm(v).replace(/\s/g,'')===I.norm(r.name).replace(/\s/g,'');
      setMsg('good',`<div>✓ <span class="nm">${esc(r.name)}</span> is a correct IUPAC name.</div>${same?'':`<div class="mu">The usual way to write it: <b>${esc(r.name)}</b>${r.full!==r.name?` (or ${esc(r.full)})`:''}.</div>`}${notes}`);
    } else {
      const why=[r.reason].concat(r.issues).filter(Boolean);
      setMsg('warn',`<div>Drawn from your name, but the IUPAC name for this molecule is <span class="nm">${esc(r.name)}</span></div>${why.length?`<ul>${why.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${notes}`);
    }
  };
  S.on(inp,'input',()=>{ clearTimeout(tmr); tmr=setTimeout(render,120); });
  S.add(()=>clearTimeout(tmr));
  S.on(root,'click',e=>{ const b=e.target.closest('[data-ex]'); if(!b) return; inp.value=b.dataset.ex; render(); inp.focus(); });

  /* ---------- quiz mode ---------- */
  const store=(()=>{ try{ return JSON.parse(localStorage.getItem('tt-iupac')||'{}'); }catch(e){ return {}; } })();
  let score=0, streak=0, best=store.best||0, hint=0, solved=false, recent=[], q=null, tries=0;
  const upScore=()=>{ $('[data-k=sc]').textContent=score; $('[data-k=st]').textContent=streak; $('[data-k=be]').textContent=best; };
  const save=()=>{ try{ localStorage.setItem('tt-iupac',JSON.stringify({best})); }catch(e){} };
  function next(){
    q=I.random({families:fams,level,avoid:recent}); recent=recent.concat(q.name).slice(-15);
    hint=0; solved=false; tries=0; cur={mol:q.mol,an:q.an,numbers:false}; empty.hidden=true; redraw(); ans.value='';
    setMsg('','<span class="mu">Type the IUPAC name and press Enter. Stuck? Use Hint.</span>'); showFacts(null); upScore();
    if(!matchMedia('(pointer:coarse)').matches) ans.focus();
  }
  const finish=()=>{ solved=true; cur.numbers=true; redraw(); showFacts(q.mol,q.an); };
  function checkAns(){
    if(!q) return; const v=ans.value.trim();
    if(solved){ next(); return; }
    if(!v){ ans.focus(); return; }
    let r; try{ r=I.check(v); }catch(e){ setMsg('bad',`<b>I can’t read that name.</b> ${esc(e.iu?e.message:'')}`); return; }
    tries++;
    const same=I.canon(r.mol)===I.canon(q.mol);
    if(same&&r.valid){
      if(hint<3){ score++; streak++; if(streak>best){ best=streak; save(); } }
      const same2=I.norm(v).replace(/\s/g,'')===I.norm(q.name).replace(/\s/g,'');
      setMsg('good',`<div>✓ Correct: <span class="nm">${esc(q.name)}</span></div>${same2?'':`<div class="mu">Usually written ${esc(q.name)}.</div>`}<div class="mu">Press Enter for the next one.</div>`);
      finish(); upScore(); return; }
    streak=0; upScore();
    if(same){ const why=[r.reason].concat(r.issues).filter(Boolean);
      setMsg('warn',`<div><b>Right molecule, but that isn’t the IUPAC name.</b></div>${why.length?`<ul>${why.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<div class="mu">Have another go, or press Show answer.</div>`); return; }
    setMsg('bad',`<div><b>Not quite: that name is a different molecule.</b> This is what “${esc(v)}” looks like${r.ok&&r.name&&I.norm(r.name)!==I.norm(v)?` (its IUPAC name is ${esc(r.name)})`:''}:</div>`);
    if(r.mol) miniCanvas(msg,r.mol,r.an||null);
    msg.appendChild(LK.el('<div class="mu" style="margin-top:6px">Compare it with the molecule above, then try again.</div>'));
  }
  function giveHint(){
    if(!q||solved) return; hint=Math.min(3,hint+1); const an=q.an, sp=an.spec;
    const cls=I.classify(q.mol,an).join(' · ');
    const suf=sp.suffix?(sp.kind==='benzene'?'':`Its name ends in “-${I.SUFW[sp.suffix.t]}”.`):'';
    const h=[`<b>Hint 1:</b> it’s a ${esc(cls.toLowerCase())}. ${esc(suf)}`];
    if(hint>=2) h.push(`<b>Hint 2:</b> the parent is ${sp.kind==='benzene'?'a benzene ring':sp.kind==='ring'?`a ring of ${sp.n} carbons (cyclo${I.STEM[sp.n]}-)`:`a chain of ${sp.n} carbon${sp.n>1?'s':''} (${I.STEM[sp.n]}-)`}${sp.prefixes.length?`, with ${sp.prefixes.map(g=>(g.locs.length>1?g.locs.length+' × ':'')+g.name.replace(/[()]/g,'')).join(', ')} on it`:''}.`);
    if(hint>=3){ h.push('<b>Hint 3:</b> the parent is highlighted with its numbering. (Answers after this hint don’t score.)'); cur.numbers=true; redraw(); }
    setMsg('',h.join('<br>'));
  }
  function reveal(){ if(!q) return; streak=0; hint=3; upScore(); setMsg('warn',`<div>The answer is <span class="nm">${esc(q.name)}</span></div><div class="mu">The parent ${q.an.spec.kind==='chain'?'chain':'ring'} is highlighted and numbered. Press Next for another.</div>`); finish(); }
  S.on(ans,'keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); checkAns(); } });
  S.on(root,'click',e=>{ const b=e.target.closest('[data-a]'); if(!b) return; ({check:checkAns,hint:giveHint,reveal,next})[b.dataset.a](); });

  /* ---------- modes ---------- */
  const setMode=md=>{ mode=md; root.querySelectorAll('.subtabs button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===md));
    $('.iu-draw').hidden=md!=='draw'; $('.iu-quiz').hidden=md!=='quiz'; $('.iu-quizin').hidden=md!=='quiz';
    if(md==='draw'){ render(); } else next(); };
  S.on(root.querySelector('.subtabs'),'click',e=>{ const b=e.target.closest('button[data-m]'); if(b) setMode(b.dataset.m); });
  el.lkPreset=o=>{ o=o||{}; if(o.mode==='quiz'){ setMode('quiz'); return; } setMode('draw'); if(o.name!=null){ inp.value=o.name; render(); } if(o.numbers!=null){ cNum.checked=o.numbers; numbers=o.numbers; if(cur){ cur.numbers=numbers; redraw(); } } };
  upScore(); setMode('draw');
  LK.note(el,`<p><b>How a name is built:</b> prefixes (substituents, in alphabetical order) + stem (number of carbons in the parent chain: meth, eth, prop, but, pent, hex…) + suffix (the main functional group).</p>
<p><b>1. Find the parent chain.</b> It must contain the main functional group, then as many C=C bonds as possible, then be as long as possible. It can bend: follow the carbons round corners.</p>
<p><b>2. Number it</b> from the end that gives the lowest number to the main functional group, then to the C=C, then to the substituents (compare locants one at a time; the first difference decides).</p>
<p><b>3. Name the substituents</b> with their locants, in alphabetical order. Repeated groups use di-, tri-, tetra- (which are ignored when alphabetising).</p>
<p><b>Priority of groups</b> (highest first): carboxylic acid › ester › acyl chloride › amide › nitrile › aldehyde › ketone › alcohol › amine. The highest one is the suffix; the rest become prefixes (hydroxy-, oxo-, amino-).</p>
<p><b>Esters</b> are named alkyl alkanoate: the part from the alcohol first, then the acid part ending in -oate (ethyl ethanoate, CH₃COOCH₂CH₃).</p>`);
  return ()=>{ S.dispose(); };
}};
L.iupac.draw=drawMol;
})();
