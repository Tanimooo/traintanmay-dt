/* TrainTanmay Chemistry: IUPAC naming lab.
   Explorer: build or edit a molecule (click, drag, palette, keyboard) or type a name, and see its IUPAC name
   split into prefixes / stem / bonds / suffix, with "Why not…?" wrong names and a step-by-step walkthrough.
   Quiz: name it, pick the name, or draw it, at four levels, with streaks and a review list saved in this browser.
   Cheat sheet: the naming rules. Uses the engine in iupac-engine.js. */
(function(){
'use strict';
const LK=window.LK, L=window.LABS, I=window.IUPAC;
if(!LK||!L||!I) return;
const esc=LK.esc;
const SUBD=n=>String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
const coarse=()=>{ try{ return matchMedia('(pointer:coarse)').matches; }catch(e){ return false; } };
const ELN={C:'Carbon',O:'Oxygen',N:'Nitrogen',F:'Fluorine',Cl:'Chlorine',Br:'Bromine',I:'Iodine',NO2:'Nitro group'};

/* ---------- 2D layout (units: one bond = 1) ---------- */
function layout(m,an){
  const A=I.adj(m), N=m.atoms.length, P=new Array(N).fill(null), turn=new Array(N).fill(0);
  const rings=I.findRings(m,A), ringOf=new Array(N).fill(-1); rings.forEach((r,k)=>r.forEach(a=>{ ringOf[a]=k; }));
  const done=new Set(), q=[];
  const ord=an&&an.best&&an.best.ord&&an.best.ord.length?an.best.ord:null;
  const ringR=n=>1/(2*Math.sin(Math.PI/n));
  const putRing=(k,start,cx,cy,base)=>{ const r=rings[k], n=r.length, R=ringR(n), i0=r.indexOf(start);
    for(let t=0;t<n;t++){ const a=r[(i0+t)%n], g=base+t*2*Math.PI/n; P[a]={x:cx+R*Math.cos(g),y:cy+R*Math.sin(g)}; q.push(a); } done.add(k); };
  if(ord&&an.best.cd&&an.best.cd.ring&&ringOf[ord[0]]>=0){ const n=ord.length, R=ringR(n); ord.forEach((a,t)=>{ const g=Math.PI/2-t*2*Math.PI/n; P[a]={x:R*Math.cos(g),y:R*Math.sin(g)}; q.push(a); }); done.add(ringOf[ord[0]]); }
  else if(ord){ ord.forEach((a,i)=>{ P[a]={x:i*0.866,y:i%2?0.5:0}; turn[a]=i===0?1:(i%2?1:-1); q.push(a); }); }
  else if(ringOf[0]>=0){ putRing(ringOf[0],0,0,0,Math.PI/2); }
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
    const size=j=>{ const seen=new Set([a,j]), st=[j]; while(st.length){ const u=st.pop(); A[u].forEach(x=>{ if(!seen.has(x.j)&&!P[x.j]){ seen.add(x.j); st.push(x.j); } }); } return seen.size; };
    if(k>1){ un.sort((x,y)=>size(y.j)-size(x.j)); }
    un.forEach((x,i)=>{ const j=x.j, g=dirs[i]; const u=unit(g);
      if(ringOf[j]>=0&&!done.has(ringOf[j])){ const n=rings[ringOf[j]].length, R=ringR(n); const px=P[a].x+u.x, py=P[a].y+u.y; putRing(ringOf[j],j,px+u.x*R,py+u.y*R,g+Math.PI); return; }
      P[j]={x:P[a].x+u.x,y:P[a].y+u.y}; const rel=Math.atan2(Math.sin(g-(pl.length===1?pl[0]+Math.PI:g)),Math.cos(g-(pl.length===1?pl[0]+Math.PI:g))); turn[j]=rel>0.01?1:rel<-0.01?-1:(turn[a]||1); q.push(j); });
  }
  P.forEach((p,i)=>{ if(!p) P[i]={x:Math.random(),y:Math.random()}; });
  // E/Z: reflect one side of a C=C so the drawing matches its label
  let stereo=[]; try{ stereo=I.stereoBonds(m,A,rings); }catch(e){}
  stereo.forEach(s=>{ if(!s.d||s.A.hi<0||s.B.hi<0) return; const a=s.a,b=s.b, pa=P[a], pb=P[b], dx=pb.x-pa.x, dy=pb.y-pa.y;
    const cr=p=>dx*(p.y-pa.y)-dy*(p.x-pa.x); const sa=cr(P[s.A.hi]), sb=cr(P[s.B.hi]); if(Math.abs(sa)<1e-3||Math.abs(sb)<1e-3) return;
    if(((sa>0)===(sb>0))===(s.d==='Z')) return;
    const side=new Set([b]), st=[b]; while(st.length){ const u=st.pop(); A[u].forEach(x=>{ if(u===b&&x.j===a) return; if(!side.has(x.j)){ side.add(x.j); st.push(x.j); } }); }
    if(side.has(a)) return; const L2=dx*dx+dy*dy;
    side.forEach(i=>{ if(i===b) return; const p=P[i]; const t=((p.x-pa.x)*dx+(p.y-pa.y)*dy)/L2; const fx=pa.x+t*dx, fy=pa.y+t*dy; p.x=2*fx-p.x; p.y=2*fy-p.y; }); });
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
/* directions for k extra things (H atoms, ion labels) around an atom: spread evenly in the biggest gap */
function gapDirs(angles,k){
  if(!k) return [];
  if(!angles.length){ return Array.from({length:k},(_,i)=>(k===1?0:Math.PI/2*(k===2?1:0))+i*2*Math.PI/k); }
  const s=angles.map(g=>(g+4*Math.PI)%(2*Math.PI)).sort((x,y)=>x-y); let gs=0,gap=-1;
  for(let i=0;i<s.length;i++){ const nx=i+1<s.length?s[i+1]:s[0]+2*Math.PI; if(nx-s[i]>gap+1e-6){ gap=nx-s[i]; gs=s[i]; } }
  return Array.from({length:k},(_,i)=>gs+gap*(i+1)/(k+1));
}

/* ---------- drawing ---------- */
function drawMol(ctx,W,H,m,an,o){
  o=o||{}; const Pal=LK.P();
  ctx.save(); ctx.fillStyle=o.bg||Pal.bg; ctx.fillRect(0,0,W,H);
  const geo={X:[],Y:[],hs:[],bonds:[],locs:[],s:0,fs:12,ok:false};
  if(!m||!m.atoms.length){ ctx.restore(); return geo; }
  const lay=o.lay||layout(m,an), {P,A,rings}=lay, N=m.atoms.length, disp=!!o.displayed;
  const hAng=[], ionAng=[];
  for(let i=0;i<N;i++){ const a=m.atoms[i]; const h=I.hcount(m,A,i); const angs=A[i].map(x=>Math.atan2(P[x.j].y-P[i].y,P[x.j].x-P[i].x));
    const nH=disp&&a.el!=='NO2'&&h>0?h:0; const dirs=gapDirs(angs,nH+(a.ion?1:0)); hAng[i]=dirs.slice(0,nH); if(a.ion) ionAng[i]=dirs[nH]!=null?dirs[nH]:0; }
  const HL=0.62;
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity; const ext=(x,y)=>{ x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); };
  P.forEach((p,i)=>{ ext(p.x,p.y); hAng[i].forEach(g=>ext(p.x+HL*Math.cos(g),p.y+HL*Math.sin(g))); if(m.atoms[i].ion!=null) ext(p.x+1.0*Math.cos(ionAng[i]),p.y+1.0*Math.sin(ionAng[i])); });
  const pad=o.pad||40, s=Math.min(o.max||(disp?72:68),(W-2*pad)/Math.max(0.5,x1-x0),(H-2*pad)/Math.max(0.5,y1-y0));
  const cx=W/2, cy=H/2, mx=(x0+x1)/2, my=(y0+y1)/2;
  const X=i=>cx+(P[i].x-mx)*s, Y=i=>cy-(P[i].y-my)*s;
  const fs=Math.max(11,Math.min(20,s*(disp?0.36:0.42))), ink=o.ink||Pal.ink;
  geo.s=s; geo.fs=fs; geo.ok=true; for(let i=0;i<N;i++){ geo.X[i]=X(i); geo.Y[i]=Y(i); }
  const COL={O:o.mono?ink:'#d64545',N:o.mono?ink:'#3b6fd9',F:o.mono?ink:'#2e9e6a',Cl:o.mono?ink:'#2e9e6a',Br:o.mono?ink:'#a0522d',I:o.mono?ink:'#8a4fc0',NO2:o.mono?ink:'#3b6fd9'};
  if(document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches)){ if(!o.mono){ COL.O='#ff7b72'; COL.N='#79a8ff'; COL.Br='#e0915a'; COL.I='#c39bff'; COL.NO2='#79a8ff'; COL.F=COL.Cl='#5ad19a'; } }
  const lab=i=>disp||m.atoms[i].el!=='C'||N===1||A[i].length===0;
  const order=an&&an.best&&an.best.ord?an.best.ord:[], locOf=new Map(order.map((a,k)=>[a,k+1]));
  const hl=o.hl||null;
  // highlights
  if(hl&&hl.size){ ctx.save(); ctx.fillStyle=Pal.accent; ctx.strokeStyle=Pal.accent; ctx.globalAlpha=0.28; ctx.lineCap='round'; ctx.lineWidth=Math.max(10,s*0.3);
    m.bonds.forEach(b=>{ if(hl.has(b.a)&&hl.has(b.b)){ ctx.beginPath(); ctx.moveTo(X(b.a),Y(b.a)); ctx.lineTo(X(b.b),Y(b.b)); ctx.stroke(); } });
    hl.forEach(i=>{ if(i>=N) return; ctx.beginPath(); ctx.arc(X(i),Y(i),Math.max(10,s*0.26),0,7); ctx.fill(); }); ctx.restore(); }
  // parent chain
  if(o.numbers&&order.length){ ctx.save(); ctx.strokeStyle=Pal.brand; ctx.globalAlpha=0.2; ctx.lineWidth=Math.max(8,s*0.24); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.beginPath();
    order.forEach((a,k)=>{ k?ctx.lineTo(X(a),Y(a)):ctx.moveTo(X(a),Y(a)); }); if(an.best.cd&&an.best.cd.ring) ctx.closePath(); if(order.length===1){ ctx.arc(X(order[0]),Y(order[0]),s*0.14,0,7); } ctx.stroke(); ctx.restore(); }
  // bonds
  ctx.lineCap='round'; ctx.lineWidth=Math.max(1.6,s*0.04); ctx.strokeStyle=ink;
  const shrink=fs*0.62, g=Math.max(4,s*0.12);
  const aromBonds=new Set(); rings.forEach(r=>{ if(I.isArom(m,r)) r.forEach((a,k)=>{ const b=r[(k+1)%r.length]; aromBonds.add(a+'-'+b); aromBonds.add(b+'-'+a); }); });
  const line=(xa,ya,xb,yb)=>{ ctx.beginPath(); ctx.moveTo(xa,ya); ctx.lineTo(xb,yb); ctx.stroke(); };
  m.bonds.forEach((b,bi)=>{
    let xa=X(b.a),ya=Y(b.a),xb=X(b.b),yb=Y(b.b); geo.bonds[bi]={xa,ya,xb,yb};
    const dx=xb-xa, dy=yb-ya, d=Math.hypot(dx,dy)||1, ux=dx/d, uy=dy/d, nx=-uy, ny=ux;
    if(lab(b.a)){ xa+=ux*shrink; ya+=uy*shrink; } if(lab(b.b)){ xb-=ux*shrink; yb-=uy*shrink; }
    ctx.strokeStyle=o.selBond===bi?Pal.accent:ink;
    if(b.o===1||aromBonds.has(b.a+'-'+b.b)){ line(xa,ya,xb,yb); return; }
    if(b.o===3){ line(xa,ya,xb,yb); line(xa+nx*g,ya+ny*g,xb+nx*g,yb+ny*g); line(xa-nx*g,ya-ny*g,xb-nx*g,yb-ny*g); return; }
    let side=0; [b.a,b.b].forEach(at=>A[at].forEach(x=>{ if(x.j===b.a||x.j===b.b) return; const c=(X(x.j)-X(b.a))*nx+(Y(x.j)-Y(b.a))*ny; side+=c>1?1:c<-1?-1:0; }));
    const hetero=lab(b.a)||lab(b.b);
    if(side===0||hetero){ line(xa+nx*g/2,ya+ny*g/2,xb+nx*g/2,yb+ny*g/2); line(xa-nx*g/2,ya-ny*g/2,xb-nx*g/2,yb-ny*g/2); return; }
    const sg=side>0?1:-1; line(xa,ya,xb,yb); const t=0.14*d; line(xa+ux*t+nx*g*sg,ya+uy*t+ny*g*sg,xb-ux*t+nx*g*sg,yb-uy*t+ny*g*sg);
  });
  ctx.strokeStyle=ink;
  rings.forEach(r=>{ if(!I.isArom(m,r)) return; let ax=0,ay=0; r.forEach(a=>{ ax+=X(a); ay+=Y(a); }); ax/=r.length; ay/=r.length; ctx.beginPath(); ctx.arc(ax,ay,s*0.58,0,7); ctx.stroke(); });
  // H atoms (displayed formula)
  ctx.textBaseline='middle'; ctx.textAlign='center';
  const hfs=Math.round(fs*0.9);
  for(let i=0;i<N;i++) hAng[i].forEach(gA=>{ const hx=X(i)+Math.cos(gA)*HL*s, hy=Y(i)-Math.sin(gA)*HL*s;
    ctx.save(); ctx.globalAlpha=0.75; ctx.lineWidth=Math.max(1.2,s*0.03); line(X(i)+Math.cos(gA)*shrink,Y(i)-Math.sin(gA)*shrink,hx-Math.cos(gA)*hfs*0.45,hy+Math.sin(gA)*hfs*0.45); ctx.restore();
    ctx.font=`500 ${hfs}px ${Pal.body}`; ctx.fillStyle=Pal.muted; ctx.fillText('H',hx,hy+1); geo.hs.push({x:hx,y:hy,atom:i}); });
  // atom labels
  for(let i=0;i<N;i++){ if(!lab(i)) continue;
    const at=m.atoms[i], el=at.el, h=I.hcount(m,A,i);
    let sym=el==='NO2'?'N':el, tail=el==='NO2'?'O₂':(!disp&&h>0?'H'+(h>1?SUBD(h):''):'');
    if(!disp&&N===1&&el==='C'){ tail='H₄'; }
    const chg=at.ch?(at.ch>0?'⁺':'⁻'):''; tail+=chg;
    let nx=0; A[i].forEach(x=>{ nx+=X(x.j)-X(i); }); const left=nx>2&&!disp;
    ctx.font=`600 ${fs}px ${Pal.body}`; ctx.fillStyle=el==='C'?ink:(COL[el]||ink); ctx.textAlign='center';
    const w=ctx.measureText(sym).width;
    ctx.save(); ctx.fillStyle=o.bg||Pal.bg; ctx.beginPath(); ctx.arc(X(i),Y(i),fs*0.55,0,7); ctx.fill();
    if(hl&&hl.has(i)){ ctx.fillStyle=Pal.accent; ctx.globalAlpha=0.28; ctx.fill(); } ctx.restore();
    ctx.fillText(sym,X(i),Y(i)+1);
    if(tail){ ctx.textAlign=left?'right':'left'; ctx.fillText(tail,left?X(i)-w/2:X(i)+w/2,Y(i)+1); }
  }
  // counter-ions (no bond line: ionic)
  for(let i=0;i<N;i++){ const at=m.atoms[i]; if(!at.ion) continue; const gA=ionAng[i]||0; const ix=X(i)+Math.cos(gA)*s*1.0, iy=Y(i)-Math.sin(gA)*s*1.0;
    ctx.font=`600 ${fs}px ${Pal.body}`; ctx.textAlign='center'; ctx.fillStyle=at.ch>0?(COL[at.ion]||ink):ink; ctx.fillText(at.ion+(at.ch>0?'⁻':'⁺'),ix,iy+1); }
  // selection ring
  if(o.sel!=null&&o.sel<N){ ctx.save(); ctx.strokeStyle=Pal.accent; ctx.lineWidth=2.5; ctx.setLineDash([4,3]); ctx.beginPath(); ctx.arc(X(o.sel),Y(o.sel),Math.max(13,fs*0.85),0,7); ctx.stroke(); ctx.restore(); }
  if(o.bondFrom!=null&&o.bondFrom<N){ ctx.save(); ctx.strokeStyle=Pal.brand; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(X(o.bondFrom),Y(o.bondFrom),Math.max(14,fs*0.9),0,7); ctx.stroke(); ctx.restore(); }
  // locants
  if(o.numbers&&order.length){ ctx.font=`700 ${Math.round(fs*0.72)}px ${Pal.mono}`; ctx.textAlign='center';
    const isR=!!(an.best.cd&&an.best.cd.ring); let rcx=0,rcy=0; if(isR){ order.forEach(a=>{ rcx+=X(a); rcy+=Y(a); }); rcx/=order.length; rcy/=order.length; }
    order.forEach(a=>{ const used=A[a].map(x=>Math.atan2(Y(x.j)-Y(a),X(x.j)-X(a))).concat(hAng[a].map(gA=>-gA)); let best=0,bd=-1; const out=Math.atan2(Y(a)-rcy,X(a)-rcx);
      for(let k=0;k<16;k++){ const gg=k*Math.PI/8; if(isR&&Math.abs(Math.atan2(Math.sin(gg-out),Math.cos(gg-out)))>1.3) continue; const d=used.length?Math.min(...used.map(u=>Math.abs(Math.atan2(Math.sin(gg-u),Math.cos(gg-u))))):3; if(d>bd+0.01){ bd=d; best=gg; } }
      const r=fs*(disp?1.25:0.95), px=X(a)+Math.cos(best)*r, py=Y(a)+Math.sin(best)*r;
      geo.locs.push({x:px,y:py,i:a}); ctx.fillStyle=Pal.brand; ctx.beginPath(); ctx.arc(px,py,fs*0.5,0,7); ctx.fill(); ctx.fillStyle=Pal.bg||'#fff'; ctx.fillText(String(locOf.get(a)),px,py+1); });
  }
  if(o.drag){ ctx.save(); ctx.strokeStyle=Pal.brand; ctx.setLineDash([6,4]); ctx.lineWidth=2.5; line(X(o.drag.from),Y(o.drag.from),o.drag.x,o.drag.y); ctx.restore(); }
  ctx.restore();
  return geo;
}
function hitTest(geo,m,x,y){
  if(!geo||!geo.ok) return null;
  const R=Math.max(14,geo.fs*0.85); let best=null,bd=R;
  geo.X.forEach((gx,i)=>{ const d=Math.hypot(gx-x,geo.Y[i]-y); if(d<bd){ bd=d; best={type:'atom',i}; } });
  if(best) return best;
  bd=Math.max(11,geo.fs*0.6); (geo.locs||[]).forEach(l=>{ const d=Math.hypot(l.x-x,l.y-y); if(d<bd){ bd=d; best={type:'atom',i:l.i}; } });
  if(best) return best;
  bd=12; geo.hs.forEach(h=>{ const d=Math.hypot(h.x-x,h.y-y); if(d<bd){ bd=d; best={type:'h',i:h.atom}; } });
  if(best) return best;
  bd=9; geo.bonds.forEach((b,bi)=>{ if(!b) return; const dx=b.xb-b.xa, dy=b.yb-b.ya, L2=dx*dx+dy*dy||1; const t=Math.max(0,Math.min(1,((x-b.xa)*dx+(y-b.ya)*dy)/L2)); const d=Math.hypot(b.xa+t*dx-x,b.ya+t*dy-y); if(d<bd){ bd=d; best={type:'bond',bi}; } });
  return best;
}

/* ---------- editing (each returns a new molecule, or a string saying why not) ---------- */
const GROUPS={
  CH3:{label:'–CH₃',sub:'carbon',key:'c',need:1,on:'any'},
  OH:{label:'–OH',key:'o',need:1},
  O2:{label:'=O',key:'=',need:2},
  F:{label:'–F',key:'f',need:1}, Cl:{label:'–Cl',key:'l',need:1}, Br:{label:'–Br',key:'b',need:1}, I:{label:'–I',key:'i',need:1},
  NH2:{label:'–NH₂',key:'n',need:1},
  CN:{label:'≡N',sub:'uses 3 H',key:'t',need:3},
  NO2:{label:'–NO₂',key:'x',need:1},
  Ph:{label:'–C₆H₅',sub:'phenyl',key:'p',need:1,on:'any'},
  CC:{label:'C=C',sub:'on a bond',key:'d',on:'bond'},
  Na:{label:'Na⁺',sub:'on –COOH',key:'s',on:'acid'},
  K:{label:'K⁺',sub:'on –COOH',key:'k',on:'acid'},
  HCl:{label:'HCl',sub:'on –NH₂',key:'h',on:'amine'}};
const GORDER=['CH3','OH','O2','F','Cl','Br','I','NH2','CN','NO2','Ph','CC','Na','K','HCl'];
const GWORD={CH3:'a CH₃',OH:'an OH',O2:'a =O',F:'an F',Cl:'a Cl',Br:'a Br',I:'an I',NH2:'an NH₂',CN:'a ≡N',NO2:'an NO₂',Ph:'a phenyl ring',Na:'Na⁺',K:'K⁺',HCl:'HCl'};
const blank=()=>({atoms:[{el:'C'}],bonds:[]});
function acidO(m,A,i){ const a=m.atoms[i];
  const fromC=c=>{ if(m.atoms[c].el!=='C') return null; const dO=A[c].some(x=>m.atoms[x.j].el==='O'&&x.o===2); if(!dO) return null; const oh=A[c].find(x=>m.atoms[x.j].el==='O'&&x.o===1&&A[x.j].length===1&&!m.atoms[x.j].ch); return oh?oh.j:null; };
  if(a.el==='C') return fromC(i);
  if(a.el==='O'&&A[i].length===1&&!a.ch&&A[i][0].o===1){ const c=A[i][0].j; return fromC(c)===i?i:null; }
  return null; }
function amineN(m,A,i){ const a=m.atoms[i]; if(a.el!=='N'||a.ch) return false; return A[i].every(x=>x.o===1&&m.atoms[x.j].el==='C'&&!A[x.j].some(y=>m.atoms[y.j].el==='O'&&y.o===2)); }
function canAdd(m,A,i,g){ const a=m.atoms[i], G=GROUPS[g]; if(!a||!G) return false; const h=I.hcount(m,A,i);
  if(G.on==='bond') return false;
  if(G.on==='acid') return acidO(m,A,i)!=null;
  if(G.on==='amine') return amineN(m,A,i)||(a.el==='C'&&A[i].some(x=>amineN(m,A,x.j)));
  if(G.on==='any') return h>=1&&(a.el==='C'||((a.el==='O'||a.el==='N')&&!(a.ch<0)));
  return a.el==='C'&&h>=G.need; }
function whyNotAdd(m,A,i,g){ const a=m.atoms[i], G=GROUPS[g], h=I.hcount(m,A,i), nm=ELN[a.el]||a.el;
  if(G.on==='bond') return 'Drop C=C onto a C–C bond.';
  if(G.on==='acid') return `${G.label} goes on a COOH group: it swaps the H of the OH for the metal ion.`;
  if(G.on==='amine') return 'HCl goes on an amine NH₂ (not an amide): the N picks up H⁺.';
  if(a.el!=='C'&&G.on!=='any') return `Groups go on carbon atoms. (Only CH₃ or phenyl can go on an O or N, replacing its H.)`;
  if(h<(G.need||1)) return `${nm}${a.el==='C'?'':' '}has ${h?'only '+h:'no'} H left to replace${G.need>1?`, and ${G.label} needs ${G.need}`:''}.`;
  return 'That can’t go there.'; }
function addRing(m,at){ const ids=[]; for(let k=0;k<6;k++){ m.atoms.push({el:'C'}); ids.push(m.atoms.length-1); } for(let k=0;k<6;k++) m.bonds.push({a:ids[k],b:ids[(k+1)%6],o:k%2?1:2,ar:true}); m.bonds.push({a:at,b:ids[0],o:1,ar:false}); }
function addGroupM(m,i,g){ // mutates
  const A=I.adj(m); const add=(el,o)=>{ m.atoms.push({el}); const j=m.atoms.length-1; m.bonds.push({a:i,b:j,o:o||1,ar:false}); return j; };
  switch(g){
    case 'CH3': add('C'); break; case 'OH': add('O'); break; case 'O2': add('O',2); break;
    case 'F': case 'Cl': case 'Br': case 'I': add(g); break;
    case 'NH2': add('N'); break; case 'CN': add('N',3); break; case 'NO2': add('NO2'); break;
    case 'Ph': addRing(m,i); break;
    case 'Na': case 'K': { const o=acidO(m,A,i); m.atoms[o].ch=-1; m.atoms[o].ion=g; break; }
    case 'HCl': { let n=i; if(m.atoms[i].el==='C') n=A[i].find(x=>amineN(m,A,x.j)).j; m.atoms[n].ch=1; m.atoms[n].ion='Cl'; break; }
  } }
function addGroup(m0,i,g){ const A=I.adj(m0); if(!canAdd(m0,A,i,g)) return whyNotAdd(m0,A,i,g); const m=I.clone(m0); addGroupM(m,i,g); return m; }
function keepBiggest(m){ const A=I.adj(m), N=m.atoms.length, comp=new Array(N).fill(-1); let k=0;
  for(let s=0;s<N;s++){ if(comp[s]>=0) continue; const st=[s]; comp[s]=k; while(st.length){ const u=st.pop(); A[u].forEach(x=>{ if(comp[x.j]<0){ comp[x.j]=k; st.push(x.j); } }); } k++; }
  if(k<=1) return m; const score=Array(k).fill(0); m.atoms.forEach((a,i)=>{ score[comp[i]]+=(a.el==='C'?100:1); }); const best=score.indexOf(Math.max(...score));
  return I.subMol(m,m.atoms.map((_,i)=>i).filter(i=>comp[i]===best)).mol; }
function deleteAtom(m0,i){ const A=I.adj(m0), a=m0.atoms[i]; if(!a) return 'Nothing there.';
  if(a.el==='C'&&m0.atoms.filter(x=>x.el==='C').length===1) return 'That’s the last carbon. Use “Start again” instead.';
  const del=[i]; A[i].forEach(x=>{ const b=m0.atoms[x.j]; if(b.el!=='C'&&A[x.j].length===1) del.push(x.j); });
  return keepBiggest(I.removeAtoms(m0,del).mol); }
function branchAtoms(m,A,at,root){ const s=new Set([root]), st=[root]; while(st.length){ const u=st.pop(); A[u].forEach(x=>{ if(u===root&&x.j===at) return; if(!s.has(x.j)&&x.j!==at){ s.add(x.j); st.push(x.j); } }); } return s; }
function bondOrder(m0,bi,o){ const b=m0.bonds[bi]; if(!b) return 'No bond there.'; if(b.ar) return 'The bonds in a benzene ring are delocalised: they can’t be changed one at a time.';
  if(m0.atoms[b.a].el!=='C'||m0.atoms[b.b].el!=='C') return 'Only C–C bonds can be changed here.';
  if(b.o===o) return null; const A=I.adj(m0); const need=o-b.o;
  if(need>0&&(I.hcount(m0,A,b.a)<need||I.hcount(m0,A,b.b)<need)) return `Both carbons need ${need} spare H for a ${o===2?'double':'triple'} bond.`;
  const m=I.clone(m0); m.bonds[bi].o=o; if(o!==2) delete m.bonds[bi].ez; return m; }
function addBond(m0,i,j){ if(i===j) return null; const a=m0.atoms[i], b=m0.atoms[j]; if(!a||!b||a.el!=='C'||b.el!=='C') return 'Bonds can only be drawn between two carbons.';
  if(m0.bonds.some(x=>(x.a===i&&x.b===j)||(x.a===j&&x.b===i))) return 'Those carbons are already bonded.';
  const A=I.adj(m0); if(I.hcount(m0,A,i)<1||I.hcount(m0,A,j)<1) return 'Both carbons need a spare H to make a new bond.';
  const m=I.clone(m0); m.bonds.push({a:i,b:j,o:1,ar:false}); return m; }
function inRing(m,A,bi){ const b=m.bonds[bi]; const seen=new Set([b.a]), st=[b.a]; while(st.length){ const u=st.pop(); for(const x of A[u]){ if(x.i===bi) continue; if(x.j===b.b) return true; if(!seen.has(x.j)){ seen.add(x.j); st.push(x.j); } } } return false; }
function deleteBond(m0,bi){ const A=I.adj(m0), b=m0.bonds[bi]; if(!b) return 'No bond there.';
  if(inRing(m0,A,bi)){ const m=I.clone(m0); m.bonds.splice(bi,1); const A2=I.adj(m); I.findRings(m,A2); m.bonds.forEach(x=>{ if(x.ar) x.ar=false; }); return m; }
  const s1=branchAtoms(m0,A,b.a,b.b), s2=branchAtoms(m0,A,b.b,b.a); const c=s=>[...s].filter(i=>m0.atoms[i].el==='C').length;
  const del=c(s1)<c(s2)||(c(s1)===c(s2)&&s1.size<=s2.size)?s1:s2; if(m0.atoms.length-del.size<1) return 'Nothing would be left.';
  const r=I.removeAtoms(m0,[...del]).mol; return r.atoms.some(a=>a.el==='C')?r:'That would remove every carbon.'; }
function normalise(m){ try{ I.stereoBonds(m).forEach(s=>{ if(!s.d) m.bonds[s.bi].ez='E'; }); }catch(e){} return m; }
/* add a group described by a prefix name, on atom `at` (used when you click a name part) */
const PREFIX_CHOICES=[['methyl','CH3'],['ethyl','Et'],['propyl','Pr'],['chloro','Cl'],['bromo','Br'],['fluoro','F'],['iodo','I'],['hydroxy','OH'],['amino','NH2'],['nitro','NO2'],['methoxy','OMe'],['phenyl','Ph']];
function addNamed(m,at,code){ const add=(i,el,o)=>{ m.atoms.push({el}); const j=m.atoms.length-1; m.bonds.push({a:i,b:j,o:o||1,ar:false}); return j; };
  if(code==='Et'){ add(add(at,'C'),'C'); return; } if(code==='Pr'){ add(add(add(at,'C'),'C'),'C'); return; } if(code==='OMe'){ add(add(at,'O'),'C'); return; }
  addGroupM(m,at,code); }

/* ---------- styles ---------- */
const CSS=`.iu{display:flex;flex-direction:column;gap:12px}
.iu .subtabs{margin-bottom:0}
.iu-card{border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:14px}
.iu-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.iu-in{flex:1;min-width:200px;font-size:1.05rem;padding:10px 13px!important;border-radius:12px!important;font-family:var(--f-body);border:1px solid var(--line);background:var(--surface);color:var(--ink)}
.iu-in:focus{outline:2px solid var(--brand);outline-offset:1px}
.iu-credit{font-size:.72rem;color:var(--muted);opacity:.8;margin:4px 2px 0;text-align:right}
.iu-nmbox{text-align:center;padding:4px 0 2px}
.iu-nm{display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;font-size:clamp(1.35rem,3.4vw,2.15rem);font-weight:700;line-height:1.35;font-family:var(--f-body);word-break:break-word}
.iu-part{font:inherit;color:inherit;background:none;border:0;border-bottom:3px solid currentColor;padding:0 1px;margin:0;border-radius:4px 4px 0 0;cursor:pointer;line-height:1.2}
.iu-part:hover,.iu-part.on{background:color-mix(in srgb,currentColor 15%,transparent)}
.iu-part:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.iu-p{color:var(--muted);white-space:pre}
.k-pre,.k-loc{color:var(--brand)}.k-stem{color:var(--teal)}.k-uns{color:var(--accent)}.k-suf,.k-sloc{color:var(--good)}.k-ez{color:var(--warn)}.k-ester,.k-ion{color:var(--bad)}
.iu-legend{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px}
.iu-legend span{border-bottom:3px solid currentColor;padding-bottom:1px}
.iu-hint{font-size:.85rem;color:var(--muted);text-align:center;margin-top:6px}
.iu-nmerr{color:var(--warn);font-weight:600;font-size:1rem;padding:8px}
.iu-msg{border-radius:12px;padding:10px 13px;border:1px solid var(--line);background:var(--surface);line-height:1.5}
.iu-msg:empty{display:none}
.iu-msg.good{border-color:var(--good);box-shadow:inset 4px 0 0 var(--good)}
.iu-msg.warn{border-color:var(--warn);box-shadow:inset 4px 0 0 var(--warn)}
.iu-msg.bad{border-color:var(--bad);box-shadow:inset 4px 0 0 var(--bad)}
.iu-msg .nm{font-weight:700;font-size:1.05rem;word-break:break-word}
.iu-msg ul{margin:6px 0 0 18px;padding:0}
.mu{color:var(--muted);font-size:.88rem}
.iu-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
.iu-side{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));align-items:start}
@media (min-width:1380px){.iu-grid{grid-template-columns:minmax(0,1fr) 300px}.iu-side{display:flex!important}}
.iu-pal{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.iu-chip{border:1px solid var(--line);background:var(--surface-2);border-radius:999px;padding:5px 10px;cursor:grab;font-size:.88rem;font-weight:600;color:var(--ink);touch-action:none;user-select:none;-webkit-user-select:none;display:inline-flex;gap:5px;align-items:baseline}
.iu-chip small{font-weight:500;color:var(--muted);font-size:.72rem}
.iu-chip:hover{border-color:var(--brand)}
.iu-chip[aria-pressed="true"]{background:var(--brand);color:var(--brand-ink);border-color:var(--brand)}
.iu-chip[aria-pressed="true"] small{color:inherit;opacity:.8}
.iu-chip:disabled{opacity:.4;cursor:not-allowed}
.iu-edbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.iu-tip{position:absolute;left:10px;right:10px;top:8px;font-size:.84rem;color:var(--muted);pointer-events:none;line-height:1.35}
.iu-tip:empty{display:none}
.iu-tip.warn{color:var(--warn)}
.iu-stage{position:relative;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--surface-2);margin-top:8px;outline:none}
.iu-stage:focus-visible{box-shadow:0 0 0 2px var(--brand)}
.iu-stage canvas{display:block;width:100%;touch-action:pan-y}
.iu-help{font-size:.8rem;color:var(--muted);margin-top:6px;line-height:1.45}
.iu-help kbd{font-family:var(--f-mono);font-size:.75rem;border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px;background:var(--surface)}
.iu-pop{position:fixed;z-index:1000;max-width:min(360px,calc(100vw - 16px));background:var(--surface);border:1px solid var(--line-strong,var(--line));border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.22);padding:10px 12px;font-size:.88rem}
.iu-pop h5{margin:0 0 6px;font-size:.95rem;font-family:var(--f-display)}
.iu-pop .sec{font-size:.68rem;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin:8px 0 4px}
.iu-pop .bts{display:flex;flex-wrap:wrap;gap:5px}
.iu-pop button{border:1px solid var(--line);background:var(--surface-2);border-radius:8px;padding:4px 9px;cursor:pointer;font-size:.84rem;color:var(--ink)}
.iu-pop button:hover:not(:disabled){border-color:var(--brand)}
.iu-pop button.on{background:var(--brand);color:var(--brand-ink);border-color:var(--brand)}
.iu-pop button:disabled{opacity:.4;cursor:not-allowed}
.iu-pop button.dang{color:var(--bad)}
.iu-pop .x{position:absolute;top:4px;right:6px;border:0;background:none;font-size:1.1rem;color:var(--muted)}
.iu-ghost{position:fixed;z-index:1001;pointer-events:none;background:var(--brand);color:var(--brand-ink);border-radius:999px;padding:4px 10px;font-weight:700;font-size:.9rem;transform:translate(-50%,-140%);box-shadow:0 4px 12px rgba(0,0,0,.2)}
.iu-side{display:flex;flex-direction:column;gap:12px}
.iu-side h4{margin:0 0 6px;font-family:var(--f-display);font-size:1rem}
.iu-why{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.iu-why li{font-size:.86rem;line-height:1.45;color:var(--ink-2)}
.iu-why button{all:unset;cursor:pointer;display:block;font-weight:700;color:var(--bad);word-break:break-word}
.iu-why button:focus-visible{outline:2px solid var(--brand)}
.iu-why button::before{content:"✗ "}
.iu-steps{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:.88rem;line-height:1.45}
.iu-steps li{cursor:pointer;border-radius:8px;padding:2px 4px;margin-left:-4px}
.iu-steps li:hover,.iu-steps li.on{background:var(--accent-soft)}
.iu-facts{display:flex;flex-wrap:wrap;gap:8px}
.iu-facts div{border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--surface);font-size:.82rem;color:var(--muted)}
.iu-facts b{display:block;color:var(--ink);font-size:.95rem}
.iu-ex{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:8px 12px}
.iu-ex summary{cursor:pointer;font-weight:700}
.iu-exg{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px 16px;margin-top:8px}
.iu-exg h6{margin:0 0 4px;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.iu-exg div{display:flex;flex-wrap:wrap;gap:4px}
.iu-exg button{border:1px solid var(--line);background:var(--surface-2);border-radius:999px;padding:3px 9px;cursor:pointer;font-size:.8rem;color:var(--ink)}
.iu-exg button:hover{border-color:var(--brand)}
.iu-levels{display:flex;gap:0;border:1px solid var(--line);border-radius:999px;overflow:hidden;flex-wrap:wrap}
.iu-levels button{border:0;background:var(--surface);padding:7px 14px;cursor:pointer;font-weight:600;font-size:.86rem;color:var(--ink)}
.iu-levels button+button{border-left:1px solid var(--line)}
.iu-levels button[aria-pressed="true"]{background:var(--brand);color:var(--brand-ink)}
.iu-score{display:flex;gap:16px;flex-wrap:wrap;font-size:.88rem;color:var(--muted);align-items:center}
.iu-score b{color:var(--ink);font-size:1.02rem;font-variant-numeric:tabular-nums}
.iu-q{font-weight:700;font-size:1.1rem;text-align:center;margin:6px 0}
.iu-q .nm{color:var(--brand)}
.iu-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}
@media (max-width:560px){.iu-opts{grid-template-columns:1fr}}
.iu-opts button{border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:10px 12px;cursor:pointer;font-weight:600;font-size:.98rem;text-align:left;color:var(--ink);word-break:break-word}
.iu-opts button:hover:not(:disabled){border-color:var(--brand)}
.iu-opts button kbd{font-family:var(--f-mono);font-size:.75rem;color:var(--muted);margin-right:6px}
.iu-opts button.right{border-color:var(--good);background:var(--good-soft)}
.iu-opts button.wrong{border-color:var(--bad);background:var(--bad-soft)}
.iu-mini{margin-top:8px;border:1px dashed var(--line);border-radius:10px;overflow:hidden}
.iu-mini canvas{display:block;width:100%}
.iu-review{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:6px;max-height:360px;overflow:auto}
.iu-review li{border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:.86rem;display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap}
.iu-review .bad{color:var(--bad);text-decoration:line-through}
.iu-cheat details{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:10px 14px;margin-bottom:8px}
.iu-cheat summary{cursor:pointer;font-weight:700;font-family:var(--f-display)}
.iu-cheat p,.iu-cheat li{line-height:1.55;font-size:.92rem}
.iu-cheat table{border-collapse:collapse;font-size:.88rem;margin:6px 0;width:100%;max-width:640px}
.iu-cheat td,.iu-cheat th{border:1px solid var(--line);padding:4px 8px;text-align:left}
.iu-cheat th{background:var(--surface-2)}
.iu-cheat .ex{font-family:var(--f-mono);font-size:.86rem}
.iu-cheat button.try{border:0;background:none;color:var(--brand);cursor:pointer;font:inherit;text-decoration:underline;padding:0}
@media (max-width:560px){.iu-card{padding:10px}.iu-chip{padding:5px 8px;font-size:.82rem}.iu-chip small{display:none}}`;
const addCSS=()=>{ let st=document.getElementById('iu-css'); if(!st){ st=document.createElement('style'); st.id='iu-css'; document.head.appendChild(st); } st.textContent=CSS; };

/* ---------- popover (one at a time) ---------- */
function makePop(S){
  let el=null, onClose=null;
  const close=()=>{ if(el){ el.remove(); el=null; const f=onClose; onClose=null; f&&f(); } };
  const open=(x,y,build,opt)=>{ close(); opt=opt||{}; el=LK.el('<div class="iu-pop" role="dialog"></div>'); document.body.appendChild(el);
    el.appendChild(LK.el('<button type="button" class="x" aria-label="Close">×</button>')).addEventListener('click',close);
    const api={ h(t){ el.appendChild(LK.el(`<h5>${t}</h5>`)); }, sec(t){ el.appendChild(LK.el(`<div class="sec">${t}</div>`)); }, p(t){ el.appendChild(LK.el(`<div class="mu" style="margin:4px 0">${t}</div>`)); },
      row(){ const d=LK.el('<div class="bts"></div>'); el.appendChild(d); return d; },
      btn(row,label,fn,o2){ o2=o2||{}; const b=LK.el(`<button type="button" class="${o2.cls||''}"${o2.dis?' disabled':''}${o2.title?` title="${esc(o2.title)}"`:''}>${label}</button>`); b.addEventListener('click',e=>{ e.stopPropagation(); if(!o2.keep) close(); fn(); }); row.appendChild(b); return b; } };
    build(api); onClose=opt.onClose||null; sy0=scrollY;
    const r=el.getBoundingClientRect(), vw=innerWidth, vh=innerHeight; let lx=Math.min(Math.max(8,x+10),vw-r.width-8), ty=y+12; if(ty+r.height>vh-8) ty=Math.max(8,y-r.height-12);
    el.style.left=lx+'px'; el.style.top=ty+'px';
    const f=el.querySelector('button:not(.x):not(:disabled)'); if(opt.focus&&f) f.focus(); };
  S.on(document,'pointerdown',e=>{ if(el&&!el.contains(e.target)&&!(e.target.closest&&e.target.closest('[data-keep-pop]'))) close(); },true);
  S.on(document,'keydown',e=>{ if(e.key==='Escape'&&el) close(); });
  let sy0=0; S.on(window,'scroll',()=>{ if(el&&Math.abs(scrollY-sy0)>60) close(); },{passive:true});
  S.add(close);
  return {open,close,get isOpen(){ return !!el; }};
}

/* ---------- the molecule editor (used by the explorer and by "draw it" questions) ---------- */
function makeEditor(host,S,pop,o){
  o=o||{};
  const wrap=LK.el(`<div class="iu-ed">
    <div class="iu-pal" role="toolbar" aria-label="Groups to add: drag one onto the molecule, or tap it then tap an atom">${GORDER.map(k=>{ const G=GROUPS[k]; return `<button type="button" class="iu-chip" data-g="${k}" aria-pressed="false" title="${esc(G.label)}: drag onto ${G.on==='bond'?'a C–C bond':G.on==='acid'?'a COOH group':G.on==='amine'?'an NH₂ group':'an atom'} (key ${G.key==='='?'=':G.key.toUpperCase()})">${G.label}${G.sub?`<small>${G.sub}</small>`:''}</button>`; }).join('')}</div>
    <div class="iu-edbar"><button type="button" class="btn btn-sm" data-e="undo" title="Undo (Ctrl+Z)">↶ Undo</button><button type="button" class="btn btn-sm" data-e="redo" title="Redo (Ctrl+Y)">↷ Redo</button><button type="button" class="btn btn-sm" data-e="reset">Start again</button>
      <label class="toggle" style="font-size:.85rem;display:inline-flex;gap:5px;align-items:center;margin-left:4px"><input type="checkbox" data-e="disp"> Show every H</label></div>
    <div class="iu-stage" tabindex="0" role="application" aria-label="Molecule editor. Use the arrow keys to pick an atom, Enter for its menu, letter keys to add groups."></div>
    <div class="iu-help">${coarse()?'<b>Tap</b> an atom or bond to change it. <b>Drag</b> from one carbon to another to bond them. <b>Tap a group</b>, then tap an atom to add it.':'<b>Click</b> an atom or bond to change it. <b>Drag</b> from one carbon to another to bond them. <b>Right-click</b> an atom to delete it. Drag groups on, or tap one then click atoms.'} Keys: <kbd>←↑→↓</kbd> pick an atom, <kbd>Enter</kbd> menu, <kbd>C</kbd> <kbd>O</kbd> <kbd>=</kbd> <kbd>N</kbd> <kbd>L</kbd>(Cl) <kbd>B</kbd>r … add, <kbd>Del</kbd> remove, <kbd>Ctrl</kbd>+<kbd>Z</kbd> undo.</div>
  </div>`);
  host.appendChild(wrap);
  const $=q=>wrap.querySelector(q), stageHost=$('.iu-stage'), tip=LK.el('<div class="iu-tip" aria-live="polite"></div>');
  const st=LK.stage(stageHost,S,{ratio:o.ratio||0.56,maxH:o.maxH||460,minH:o.minH||260}); stageHost.appendChild(tip);
  let mol=normalise(I.clone(o.mol||blank())), hist=[], fut=[], cur=null, geo=null, hl=null, sel=null, armed=null, bondFrom=null, drag=null, selBond=null;
  let disp=!!o.displayed; $('[data-e=disp]').checked=disp;
  const analyse=()=>{ const c={mol}; try{ const r=I.nameOf(mol); c.an=r.a; c.name=r.name; c.full=r.full; c.parts=r.parts; }catch(e){ if(!e.iu) console.error(e); c.err=e.iu?e.message:'Something went wrong naming this.'; }
    try{ c.lay=layout(mol,c.an||null); }catch(e){ c.lay=null; } cur=c; };
  const redraw=()=>{ if(!cur) return; geo=drawMol(st.ctx,st.w,st.h,mol,cur.an||null,{lay:cur.lay,numbers:o.numbers?o.numbers():false,displayed:disp,hl,sel,bondFrom,drag,selBond}); };
  st.onResize=redraw;
  const say=(t,warn)=>{ tip.textContent=t||''; tip.classList.toggle('warn',!!warn); };
  const changed=(src)=>{ analyse(); redraw(); o.onChange&&o.onChange(cur,src||'edit'); };
  const commit=(r,okMsg)=>{ if(r==null) return false; if(typeof r==='string'){ say(r,true); return false; } hist.push(JSON.stringify(mol)); if(hist.length>120) hist.shift(); fut=[]; mol=normalise(r); sel=sel!=null&&sel<mol.atoms.length?sel:null; selBond=null; say(okMsg||''); changed('edit'); return true; };
  const undo=()=>{ if(!hist.length){ say('Nothing to undo.'); return; } fut.push(JSON.stringify(mol)); mol=JSON.parse(hist.pop()); if(sel!=null&&sel>=mol.atoms.length) sel=null; say('Undone.'); changed('edit'); };
  const redo=()=>{ if(!fut.length){ say('Nothing to redo.'); return; } hist.push(JSON.stringify(mol)); mol=JSON.parse(fut.pop()); if(sel!=null&&sel>=mol.atoms.length) sel=null; say('Redone.'); changed('edit'); };
  const arm=g=>{ armed=armed===g?null:g; wrap.querySelectorAll('.iu-chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===armed)); say(armed?`Now ${coarse()?'tap':'click'} where to put ${GROUPS[armed].label}${GROUPS[armed].on==='bond'?' (a C–C bond)':''}. Tap the group again to stop.`:''); };
  const loc=i=>cur&&cur.an&&cur.an.best&&cur.an.best.loc&&cur.an.best.loc.get?cur.an.best.loc.get(i):null;
  const atomName=i=>{ const a=mol.atoms[i]; const l=loc(i); return a.el==='C'?(l?`Carbon ${l}`:'Branch carbon'):(ELN[a.el]||a.el)+(a.ch?(a.ch>0?' (N⁺)':' (O⁻)'):''); };
  const apply=(target,g)=>{ if(!target) return;
    if(g==='CC'){ if(target.type!=='bond') { say('Drop C=C onto a C–C bond.',true); return; } const b=mol.bonds[target.bi]; commit(bondOrder(mol,target.bi,Math.min(3,b.o+1)),b.o===1?'Made a C=C double bond.':'Made a C≡C triple bond.'); return; }
    if(target.type==='bond'){ say(`Drop ${GROUPS[g].label} onto an atom, not a bond.`,true); return; }
    commit(addGroup(mol,target.i,g),`Added ${GROUPS[g].label}.`); };
  const posOf=i=>{ const r=st.cv.getBoundingClientRect(); return {x:r.left+geo.X[i],y:r.top+geo.Y[i]}; };
  /* menus */
  function atomMenu(i,cx,cy,fromH,focus){
    const A=I.adj(mol), a=mol.atoms[i], h=I.hcount(mol,A,i);
    pop.open(cx,cy,p=>{
      p.h(fromH?`An H on ${atomName(i).toLowerCase()}`:atomName(i)+(a.el==='C'?` <span class="mu">(${h} H)</span>`:''));
      const can=GORDER.filter(g=>GROUPS[g].on!=='bond'&&canAdd(mol,A,i,g));
      if(can.length){ p.sec(fromH?'Replace it with':'Add a group'); const r=p.row(); can.forEach(g=>p.btn(r,GROUPS[g].label,()=>apply({type:'atom',i},g))); }
      else if(a.el==='C') p.p('No H left to replace on this carbon.');
      const cc=A[i].filter(x=>mol.atoms[x.j].el==='C'&&!x.ar);
      if(a.el==='C'&&cc.length){ p.sec('Bonds'); cc.forEach(x=>{ const r=p.row(); r.appendChild(LK.el(`<span class="mu" style="align-self:center;min-width:70px">to ${esc(atomName(x.j).replace(/^Carbon/,'C').replace('Branch carbon','branch C'))}</span>`)); [[1,'single –'],[2,'double ='],[3,'triple ≡']].forEach(([ord,lb])=>p.btn(r,lb,()=>commit(bondOrder(mol,x.i,ord)),{cls:x.o===ord?'on':''})); ezBtn(p,r,x.i); }); }
      if(a.el==='C'&&h>0){ const r=p.row(); p.btn(r,'Bond to another carbon (make a ring)…',()=>{ bondFrom=i; say(`Now ${coarse()?'tap':'click'} the carbon to bond ${atomName(i).toLowerCase()} to. Esc cancels.`); redraw(); }); }
      if(a.ion&&a.ch<0){ p.sec('Salt'); const r=p.row(); ['Na','K'].filter(x=>x!==a.ion).forEach(x=>p.btn(r,`Change to ${x}⁺`,()=>{ const m=I.clone(mol); m.atoms[i].ion=x; commit(m); })); p.btn(r,`Remove ${a.ion}⁺ (back to the acid)`,()=>{ const m=I.clone(mol); delete m.atoms[i].ch; delete m.atoms[i].ion; commit(m); }); }
      if(a.ion&&a.ch>0){ p.sec('Salt'); const r=p.row(); ['Cl','Br','I'].filter(x=>x!==a.ion).forEach(x=>p.btn(r,`Change to ${x}⁻`,()=>{ const m=I.clone(mol); m.atoms[i].ion=x; commit(m); })); const nC=A[i].length; p.btn(r,'Remove H⁺ and the halide (back to the amine)',()=>{ const m=I.clone(mol); delete m.atoms[i].ch; delete m.atoms[i].ion; commit(m); },{dis:nC>3,title:nC>3?'A quaternary N⁺ has no H to lose':''}); }
      if(a.el!=='C'&&A[i].length===1&&!a.ch&&A[i][0].o===1&&mol.atoms[A[i][0].j].el==='C'){ p.sec('Change to'); const r=p.row(); const c=A[i][0].j; ['OH','NH2','F','Cl','Br','I','NO2'].forEach(g=>{ const sym={OH:'O',NH2:'N'}[g]||g; if(sym===a.el) return; p.btn(r,GROUPS[g].label,()=>{ const m=I.clone(mol); const del=[i]; addGroupM(m,c,g); commit(keepBiggest(I.removeAtoms(m,del).mol)); }); }); }
      const r=p.row(); p.btn(r,a.el==='C'?'Remove this carbon':'Remove',()=>commit(deleteAtom(mol,i),'Removed.'),{cls:'dang'});
    },{focus});
  }
  function ezBtn(p,r,bi){ let s=null; try{ s=I.stereoBonds(mol).find(x=>x.bi===bi); }catch(e){} if(!s) return; const d=mol.bonds[bi].ez||'E';
    p.btn(r,`Swap ${d} → ${d==='E'?'Z':'E'}`,()=>{ const m=I.clone(mol); m.bonds[bi].ez=d==='E'?'Z':'E'; commit(m,`Now (${d==='E'?'Z':'E'}).`); },{title:'Swap the E/Z isomer'}); }
  function bondMenu(bi,cx,cy){ const b=mol.bonds[bi], A=I.adj(mol);
    pop.open(cx,cy,p=>{ p.h(`Bond ${esc(atomName(b.a).replace(/^Carbon/,'C').replace('Branch carbon','branch C'))} – ${esc(atomName(b.b).replace(/^Carbon/,'C').replace('Branch carbon','branch C'))}`);
      const cc=mol.atoms[b.a].el==='C'&&mol.atoms[b.b].el==='C';
      if(cc&&!b.ar){ const r=p.row(); [[1,'single –'],[2,'double ='],[3,'triple ≡']].forEach(([ord,lb])=>p.btn(r,lb,()=>commit(bondOrder(mol,bi,ord)),{cls:b.o===ord?'on':''})); ezBtn(p,r,bi); }
      if(b.ar) p.p('A benzene ring bond: the electrons are delocalised round the ring.');
      const r=p.row(); p.btn(r,inRing(mol,A,bi)?'Break this ring bond':'Remove this bond and the smaller side',()=>commit(deleteBond(mol,bi),'Removed.'),{cls:'dang'}); });
  }
  /* pointer: click, drag-to-bond, context menu */
  let down=null;
  const pt=e=>{ const r=st.cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; };
  S.on(st.cv,'touchstart',e=>{ const t=e.touches[0], r=st.cv.getBoundingClientRect(); const h=hitTest(geo,mol,t.clientX-r.left,t.clientY-r.top); if(h&&h.type==='atom'&&mol.atoms[h.i].el==='C') e.preventDefault(); },{passive:false});
  S.on(st.cv,'pointerdown',e=>{ if(e.button===2) return; const p=pt(e); const h=hitTest(geo,mol,p.x,p.y); down={p,h,id:e.pointerId,moved:false};
    if(h&&h.type==='atom'&&mol.atoms[h.i].el==='C'&&!armed&&bondFrom==null){ try{ st.cv.setPointerCapture(e.pointerId); }catch(err){} } });
  S.on(st.cv,'pointermove',e=>{ const p=pt(e);
    if(down&&down.h&&down.h.type==='atom'&&mol.atoms[down.h.i].el==='C'&&!armed){ if(Math.hypot(p.x-down.p.x,p.y-down.p.y)>8) down.moved=true;
      if(down.moved){ drag={from:down.h.i,x:p.x,y:p.y}; const t=hitTest(geo,mol,p.x,p.y); hl=t&&t.type==='atom'&&t.i!==down.h.i?new Set([t.i]):null; redraw(); } return; }
    if(e.pointerType==='mouse'&&!down){ const h=hitTest(geo,mol,p.x,p.y); st.cv.style.cursor=h?'pointer':(armed?'copy':'default'); } });
  const endDrag=()=>{ drag=null; hl=null; redraw(); };
  S.on(st.cv,'pointerup',e=>{ const p=pt(e); const d=down; down=null; if(!d) return;
    if(d.moved&&drag){ const t=hitTest(geo,mol,p.x,p.y); const from=drag.from; endDrag(); if(t&&t.type==='atom'&&t.i!==from) commit(addBond(mol,from,t.i),'Bonded: that made a ring.'); return; }
    const h=hitTest(geo,mol,p.x,p.y); stageHost.focus({preventScroll:true});
    if(bondFrom!=null){ const f=bondFrom; bondFrom=null; if(h&&h.type==='atom'&&h.i!==f) commit(addBond(mol,f,h.i),'Bonded: that made a ring.'); else { say('Cancelled.'); redraw(); } return; }
    if(!h){ sel=null; selBond=null; o.onPick&&o.onPick(null); redraw(); return; }
    if(armed){ apply(h,armed); return; }
    if(h.type==='bond'){ selBond=h.bi; redraw(); bondMenu(h.bi,e.clientX,e.clientY); return; }
    sel=h.i; redraw(); atomMenu(h.i,e.clientX,e.clientY,h.type==='h'); });
  S.on(st.cv,'pointercancel',()=>{ down=null; if(drag) endDrag(); });
  S.on(st.cv,'pointerleave',()=>{ if(!down) st.cv.style.cursor='default'; });
  S.on(st.cv,'contextmenu',e=>{ const p=pt(e); const h=hitTest(geo,mol,p.x,p.y); if(!h) return; e.preventDefault(); pop.close();
    if(h.type==='atom') commit(deleteAtom(mol,h.i),'Removed.'); else if(h.type==='bond') commit(deleteBond(mol,h.bi),'Removed.'); });
  /* palette: tap to arm, or drag a ghost onto the canvas */
  wrap.querySelectorAll('.iu-chip').forEach(ch=>{ let pd=null, ghost=null;
    ch.addEventListener('pointerdown',e=>{ pd={x:e.clientX,y:e.clientY}; try{ ch.setPointerCapture(e.pointerId); }catch(err){} });
    ch.addEventListener('pointermove',e=>{ if(!pd) return; if(!ghost&&Math.hypot(e.clientX-pd.x,e.clientY-pd.y)>6){ ghost=LK.el(`<div class="iu-ghost">${GROUPS[ch.dataset.g].label}</div>`); document.body.appendChild(ghost); }
      if(ghost){ ghost.style.left=e.clientX+'px'; ghost.style.top=e.clientY+'px'; const r=st.cv.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top; const t=x>=0&&y>=0&&x<=r.width&&y<=r.height?hitTest(geo,mol,x,y):null; const nh=t?(t.type==='bond'?new Set([mol.bonds[t.bi].a,mol.bonds[t.bi].b]):new Set([t.i])):null; if(String(nh&&[...nh])!==String(hl&&[...hl])){ hl=nh; redraw(); } } });
    const end=e=>{ if(!pd) return; const wasG=!!ghost; if(ghost){ ghost.remove(); ghost=null; } pd=null;
      if(wasG){ const r=st.cv.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top; hl=null; if(x>=0&&y>=0&&x<=r.width&&y<=r.height){ const t=hitTest(geo,mol,x,y); if(t) apply(t,ch.dataset.g); else { say('Drop it right on an atom'+(ch.dataset.g==='CC'?' or bond':'')+'.',true); redraw(); } } else redraw(); }
      else arm(ch.dataset.g); };
    ch.addEventListener('pointerup',end); ch.addEventListener('pointercancel',()=>{ if(ghost){ ghost.remove(); ghost=null; } pd=null; hl=null; redraw(); });
    ch.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); arm(ch.dataset.g); } });
    ch.addEventListener('click',e=>{ if(e.detail===0) arm(ch.dataset.g); });
  });
  /* keyboard */
  const KEYG={}; GORDER.forEach(g=>{ KEYG[GROUPS[g].key]=g; });
  S.on(wrap,'keydown',e=>{ if(e.target.tagName==='INPUT') return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){ e.preventDefault(); e.shiftKey?redo():undo(); return; }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){ e.preventDefault(); redo(); return; }
    if(e.target!==stageHost) return;
    if(e.key==='Escape'){ if(armed) arm(armed); if(bondFrom!=null){ bondFrom=null; redraw(); } return; }
    const N=mol.atoms.length; if(!N) return;
    const dirs={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(dirs[e.key]){ e.preventDefault(); if(sel==null){ sel=(cur.an&&cur.an.best.ord[0]!=null)?cur.an.best.ord[0]:0; } else { const [dx,dy]=dirs[e.key]; let best=null,bd=1e9;
        for(let j=0;j<N;j++){ if(j===sel) continue; const vx=geo.X[j]-geo.X[sel], vy=geo.Y[j]-geo.Y[sel], d=Math.hypot(vx,vy); if(d<1) continue; const c=(vx*dx+vy*dy)/d; if(c<0.4) continue; const sc=d*(2-c); if(sc<bd){ bd=sc; best=j; } } if(best!=null) sel=best; }
      redraw(); say(atomName(sel)+(mol.atoms[sel].el==='C'?`, ${I.hcount(mol,I.adj(mol),sel)} H`:'')); o.onPick&&o.onPick(sel); return; }
    if(sel==null) return;
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); const p=posOf(sel); atomMenu(sel,p.x,p.y,false,true); return; }
    if(e.key==='Delete'||e.key==='Backspace'){ e.preventDefault(); commit(deleteAtom(mol,sel),'Removed.'); sel=null; redraw(); return; }
    const g=KEYG[e.key.toLowerCase()]||KEYG[e.key]; if(g&&!e.ctrlKey&&!e.metaKey&&!e.altKey){ e.preventDefault(); if(g==='CC'){ const A=I.adj(mol); const x=A[sel].find(y=>mol.atoms[y.j].el==='C'&&y.o<3&&!y.ar); if(x) apply({type:'bond',bi:x.i},'CC'); else say('No C–C bond here to make double.',true); } else apply({type:'atom',i:sel},g); }
  });
  S.on(wrap,'click',e=>{ const b=e.target.closest('[data-e]'); if(!b) return; const k=b.dataset.e;
    if(k==='undo') undo(); else if(k==='redo') redo(); else if(k==='reset'){ commit(I.clone(o.resetTo?o.resetTo():blank()),'Started again from methane.'); } });
  $('[data-e=disp]').addEventListener('change',e=>{ disp=e.target.checked; redraw(); o.onView&&o.onView(disp); });
  analyse(); redraw();
  return {el:wrap,
    get mol(){ return mol; }, get cur(){ return cur; }, get geo(){ return geo; },
    set(m,opt){ opt=opt||{}; if(opt.history===false&&armed) arm(armed); if(opt.history!==false&&JSON.stringify(m)!==JSON.stringify(mol)){ hist.push(JSON.stringify(mol)); fut=[]; } mol=normalise(I.clone(m)); sel=null; selBond=null; bondFrom=null; say(opt.msg||''); analyse(); redraw(); o.onChange&&o.onChange(cur,opt.src||'set'); },
    commit, highlight(s){ hl=s&&s.size?s:null; redraw(); }, redraw, say, setDisplayed(v){ disp=!!v; $('[data-e=disp]').checked=disp; redraw(); },
    clearHistory(){ hist=[]; fut=[]; }, focus(){ stageHost.focus(); }};
}

/* ---------- which atoms a piece of the name refers to ---------- */
function partAtoms(cur,part){
  const s=new Set(); if(!cur||!cur.an) return s; const an=cur.an, sp=an.spec, m=cur.mol, A=an.A, ord=an.best.ord||[];
  switch(part.k){
    case 'pre': case 'loc': (sp.prefixes[part.r]?sp.prefixes[part.r].items:[]).forEach(it=>{ if(it.root!=null) branchAtoms(m,A,it.at,it.root).forEach(x=>s.add(x)); }); break;
    case 'stem': ord.forEach(x=>s.add(x)); if(sp.kind==='ammonium') an.best.anchors.forEach(a=>s.add(a.an)); break;
    case 'uns': if(sp.unsat.length) sp.unsat.forEach(u=>{ s.add(ord[u.loc-1]); s.add(ord[u.loc%ord.length]); }); else ord.forEach(x=>s.add(x)); break;
    case 'suf': case 'sloc': an.best.anchors.forEach(({g,an:c})=>{ s.add(c); g.atoms.forEach(x=>s.add(x)); if(g.c!=null) s.add(g.c); if(g.c2!=null) s.add(g.c2); }); break;
    case 'ester': an.groups.filter(g=>g.t==='ester').forEach(g=>branchAtoms(m,A,g.c,g.O).forEach(x=>s.add(x))); break;
    case 'ez': an.stereo.filter(z=>z.d).forEach(z=>{ s.add(z.a); s.add(z.b); if(z.A.hi>=0) s.add(z.A.hi); if(z.B.hi>=0) s.add(z.B.hi); }); break;
    case 'ion': an.groups.filter(g=>g.t==='ammonium').forEach(g=>s.add(g.N)); break;
  }
  s.delete(undefined); return s;
}
const nameHTML=parts=>parts.map((p,i)=>p.k==='p'?`<span class="iu-p">${esc(p.t)}</span>`:`<button type="button" class="iu-part k-${p.k}" data-i="${i}">${esc(p.t)}</button>`).join('');
const KINDW={pre:'prefixes',loc:'locants',stem:'stem',uns:'bonds',suf:'suffix',sloc:'locants',ez:'E/Z',ester:'ester group',ion:'ion'};

/* ---------- step-by-step walkthrough for the current molecule ---------- */
function walkthrough(cur){
  const an=cur.an, sp=an.spec, m=cur.mol, out=[]; const ord=an.best.ord||[];
  const all=new Set(m.atoms.map((_,i)=>i));
  const anchors=new Set(); an.best.anchors.forEach(({g,an:c})=>{ anchors.add(c); g.atoms.forEach(x=>anchors.add(x)); if(g.c!=null) anchors.add(g.c); });
  let cls=[]; try{ cls=I.classify(m,an); }catch(e){}
  if(sp.kind==='ammonium'){
    const g=an.groups.find(x=>x.t==='ammonium');
    out.push({h:`<b>Spot the ion.</b> An N⁺ carrying ${g.carbs.length} carbon group${g.carbs.length>1?'s':''}${4-g.carbs.length?` and ${4-g.carbs.length} H`:''}, with a ${I.HALIDEN[sp.halide]} ion: an ${g.carbs.length===4?'quaternary ':''}ammonium salt. There's no parent chain: every group sits on the N.`,a:new Set([g.N])});
    out.push({h:`<b>Name the groups on the N</b> in alphabetical order, with di-, tri-, tetra- for repeats: ${sp.prefixes.map(x=>`<b>${esc((x.locs.length>1?I.MULT[x.locs.length]:'')+x.name)}</b>`).join(', ')}.`,a:all});
    out.push({h:`<b>Positive ion first, then the negative ion:</b> …ammonium ${I.HALIDEN[sp.halide]}.`,a:new Set([g.N])});
  } else if(sp.kind==='anhydride'){
    const g=an.groups.find(x=>x.t==='anhyd');
    out.push({h:'<b>Spot the anhydride:</b> two C=O groups joined through one O, C(=O)–O–C(=O). It forms when two carboxylic acids lose a water molecule.',a:new Set(g.atoms.concat([g.c,g.c2]))});
    out.push({h:`<b>Split at the middle O</b> and name each half as the acid it came from: ${sp.words.map(w=>`<b>${esc(w)} acid</b>`).join(' and ')}.`,a:new Set(ord)});
    out.push({h:`<b>Write the acid names</b> (once if both halves are the same, otherwise in alphabetical order), then “anhydride” in place of “acid”.`,a:all});
  } else {
    const pr=an.principal;
    out.push({h:`<b>Spot the functional groups:</b> ${esc(cls.map(c=>c[0].toLowerCase()+c.slice(1)).join(', '))}. `+(pr?`The highest-priority group is the ${esc(I.GROUPWORD[pr]||pr)}, so it gives the suffix${sp.kind==='benzene'&&sp.suffix&&sp.suffix.locs.length===1?` (here the ring has a special name: <b>${esc(cur.parts.filter(p=>p.k==='stem'||p.k==='suf').map(p=>p.t).join(''))}</b>)`:` <b>-${esc(sp.suffix&&sp.suffix.exo?'…'+cur.parts.filter(p=>p.k==='suf').map(p=>p.t).join(''):(I.SUFW[pr]||''))}</b>`}. Any other groups become prefixes.`:'There is no suffix group, so the name ends in -ane, -ene or -yne, and every group is a prefix.'),a:anchors.size?anchors:all});
    if(pr==='ester'){ const eg=an.groups.filter(g=>g.t==='ester'); const ea=new Set(); eg.forEach(g=>branchAtoms(m,an.A,g.c,g.O).forEach(x=>ea.add(x)));
      out.push({h:eg.some(g=>g.salt)?`<b>A carboxylate salt:</b> the acid has lost H⁺ from its OH. The metal ion comes first (<b>${esc(sp.ester)}</b>), then the acid part with -oic acid changed to <b>-oate</b>.`:`<b>Split the ester at the single-bonded O.</b> The group on that O came from the alcohol and is the first word: <b>${esc(sp.ester)}</b>. The other side, which includes the C=O carbon, came from the acid and is named …<b>oate</b>.`,a:ea}); }
    out.push({h:sp.kind==='benzene'?'<b>The parent is the benzene ring</b> (C₆H₆). Groups on it are prefixes, unless it has a special name (phenol, benzoic acid…).':sp.kind==='ring'?`<b>The parent is the ring of ${sp.n} carbons:</b> <b>cyclo${I.STEM[sp.n]}-</b>.`:`<b>Find the parent chain:</b> it must ${[pr?(I.TERM[pr]?'end at the suffix group':'include the suffix group'):null,sp.unsat.length?'include the C=C':null,'be as long as possible'].filter(Boolean).join(', then ')}. Here it has <b>${sp.n}</b> carbon${sp.n>1?'s':''}: <b>${I.STEM[sp.n]}-</b>. It doesn't have to be straight in the drawing.`,a:new Set(ord)});
    if(sp.kind!=='benzene') out.push({h:sp.unsat.length?`<b>Bonds:</b> ${sp.unsat.map(u=>`C${u.loc}${u.o===2?'=':'≡'}C${sp.kind==='ring'&&u.loc===sp.n?1:u.loc+1}`).join(', ')} → <b>${esc((cur.parts.find(p=>p.k==='uns')||{t:''}).t)}</b> (the locant is the lower-numbered carbon of the double bond).`:'<b>Bonds:</b> all C–C bonds are single → <b>-an-</b>.',a:new Set(ord)});
    const desc=ev=>{ const b=[]; if(ev.pl.length) b.push(`suffix ${ev.pl.join(',')}`); if(ev.mb.length) b.push(`C=C ${ev.mb.join(',')}`); const pl=[].concat(...ev.gp.map(g=>g.locs)).filter(x=>x!=='N').sort((a,b)=>a-b); if(pl.length) b.push(`prefixes ${pl.join(',')}`); return b.join('; ')||'—'; };
    const set=new Set(ord); const rev=an.all.filter(ev=>ev!==an.best&&ev.ord.length===ord.length&&ev.ord.every(x=>set.has(x))).sort((x,y)=>{ const a=JSON.stringify(x.key), b=JSON.stringify(y.key); return a<b?-1:1; })[0];
    if(ord.length>1) out.push({h:`<b>Number the parent</b> to give the lowest numbers to the suffix group, then the C=C, then the prefixes (the first difference decides). This way: ${esc(desc(an.best))}.${rev&&desc(rev)!==desc(an.best)?` The other way: ${esc(desc(rev))}.`:' Both ways give the same numbers here.'}`,a:new Set(ord),numbers:true});
    if(sp.prefixes.length) out.push({h:`<b>Prefixes</b> in alphabetical order (ignore di-, tri-): ${sp.prefixes.map(g=>`<b>${esc(g.locs.join(',')+'-'+(g.locs.length>1?(g.cx?'bis/tris':I.MULT[g.locs.length]):'')+g.name)}</b>`).join(', ').replace(/bis\/tris/g,'bis')}.`,a:new Set([].concat(...sp.prefixes.map(g=>[].concat(...g.items.map(it=>[...branchAtoms(m,an.A,it.at,it.root)]))))),numbers:true});
    an.stereo.filter(z=>z.d).forEach(z=>{ const l=ord.indexOf(z.a)+1, l2=ord.indexOf(z.b)+1; const lo=Math.min(l,l2);
      out.push({h:`<b>E/Z at C${lo||'?'}=C${lo?lo+1:'?'}:</b> on each carbon, the group whose first atom has the higher atomic number has priority (if tied, look at the next atoms out). The two priority groups are on ${z.d==='Z'?'the <b>same side</b>, so it’s <b>Z</b> (zusammen)':'<b>opposite sides</b>, so it’s <b>E</b> (entgegen)'}. Put (${z.d}) at the front.`,a:new Set([z.a,z.b,z.A.hi,z.B.hi].filter(x=>x>=0))}); });
  }
  out.push({h:`<b>Put it together:</b> <b>${esc(cur.name)}</b>. Commas between numbers, hyphens between numbers and letters, and one word${sp.ester!=null||sp.kind==='ammonium'||sp.kind==='anhydride'?' for each part':''}.`,a:all});
  return out;
}

/* ---------- examples ---------- */
const EXAMPLES=[
 ['Alkanes',['methane','2-methylbutane','2,2-dimethylpropane','3-ethylpentane','2,2,4-trimethylpentane']],
 ['Alkenes',['propene','but-1-ene','buta-1,3-diene','2-methylbut-1-ene','but-2-yne']],
 ['E/Z isomers',['(E)-but-2-ene','(Z)-but-2-ene','(Z)-1,2-dichloroethene','(E)-2-chlorobut-2-ene','(Z)-3-methylpent-2-ene','(E)-but-2-enoic acid','(2Z,4E)-hexa-2,4-diene']],
 ['Halogenoalkanes',['chloromethane','2-bromo-2-methylpropane','1,2-dichloroethane','2-bromo-4-chloropentane','trichloromethane']],
 ['Alcohols',['ethanol','propan-2-ol','butan-1-ol','2-methylpropan-2-ol','ethane-1,2-diol','propane-1,2,3-triol','(E)-pent-3-en-2-ol','prop-2-en-1-ol']],
 ['Ethers',['methoxymethane','methoxyethane','ethoxyethane','2-methoxypropane','1-ethoxy-3-methylbutane','2-methoxyethanol','methoxybenzene']],
 ['Aldehydes & ketones',['methanal','ethanal','butanal','propanone','pentan-3-one','3-methylbutan-2-one','cyclohexanone']],
 ['Hydroxynitriles',['2-hydroxypropanenitrile','2-hydroxy-2-methylpropanenitrile','2-hydroxybutanenitrile']],
 ['Carboxylic acids',['ethanoic acid','2-hydroxypropanoic acid','hexanedioic acid','benzoic acid','2-aminopropanoic acid']],
 ['Esters',['methyl ethanoate','ethyl ethanoate','propyl methanoate','ethyl butanoate','ethyl propenoate','methyl benzoate','phenyl ethanoate','dimethyl ethanedioate','diethyl propanedioate','ethyl methyl propanedioate','dimethyl benzene-1,4-dicarboxylate']],
 ['Salts',['sodium ethanoate','potassium propanoate','sodium benzoate','disodium ethanedioate','ethylammonium chloride','phenylammonium chloride','tetramethylammonium chloride','butyltrimethylammonium bromide']],
 ['Amines',['methanamine','propan-2-amine','N-methylethanamine','N,N-dimethylethanamine','butane-1,4-diamine','phenylamine','N-methylphenylamine','2-aminoethanol']],
 ['Amides & nitriles',['ethanamide','N-methylpropanamide','N,N-dimethylethanamide','benzamide','ethanenitrile','propanenitrile','butanedinitrile','benzonitrile']],
 ['Acyl chlorides & anhydrides',['ethanoyl chloride','propanoyl chloride','benzoyl chloride','ethanoic anhydride','ethanoic propanoic anhydride']],
 ['Nitro compounds',['nitrobenzene','1-nitropropane','methyl 3-nitrobenzoate','2-methyl-1,3,5-trinitrobenzene']],
 ['Rings',['cyclopropane','cyclohexane','cyclohexene','methylcyclohexane','cyclohexanol','1,2-dibromocyclohexane','4-methylcyclohexene','cyclohexa-1,3-diene']],
 ['Benzene & phenyl',['benzene','methylbenzene','1,4-dimethylbenzene','chlorobenzene','phenol','2,4,6-tribromophenol','benzaldehyde','benzene-1,4-dicarboxylic acid','phenylethene','phenylethanone','phenylmethanol','2-phenylethanol']],
 ['Spot the mistake',['2-ethylpropane','3-methylbutane','2-methyl-3-ethylpentane','butan-3-ol','ethoxymethane','1-methylpropan-1-ol','propanoate sodium','trans-2-chlorobut-2-ene']]];

/* ---------- cheat sheet ---------- */
const T=(n)=>`<button type="button" class="try" data-ex="${esc(n)}">${esc(n)}</button>`;
const CHEAT=`<div class="iu-cheat">
<details open><summary>Naming in five steps</summary><ol>
<li><b>Functional groups.</b> Find them all. The one highest in the priority list gives the <b>suffix</b>; the rest become <b>prefixes</b>.</li>
<li><b>Parent chain.</b> The longest carbon chain that contains the suffix group (and any C=C). It can bend round corners in the drawing. Its length gives the <b>stem</b>.</li>
<li><b>Number it</b> from the end that gives the lowest locants: first to the suffix group, then to C=C, then to all the prefixes as a set (compare one number at a time; the first difference decides). Still tied? The prefix that comes first alphabetically gets the lower number.</li>
<li><b>Prefixes</b> go in alphabetical order, each with its locant. Repeats use di-, tri-, tetra- (ignored when alphabetising): ${T('3-ethyl-2-methylpentane')}, ${T('2,2-dimethylpropane')}.</li>
<li><b>Punctuation.</b> Commas between numbers, hyphens between numbers and letters, and no space between prefixes, stem and suffix. A space only goes before a separate word: ${T('ethanoic acid')}, ${T('ethanoyl chloride')}, ${T('ethyl ethanoate')}, ${T('sodium ethanoate')}. Drop the “e” of -ane before a vowel: ${T('propan-2-ol')}, but keep it before a consonant: ${T('propanenitrile')}, ${T('ethane-1,2-diol')}.</li></ol></details>
<details><summary>Chain stems</summary><table><tr><th>C</th><th>stem</th><th>C</th><th>stem</th></tr><tr><td>1</td><td>meth-</td><td>6</td><td>hex-</td></tr><tr><td>2</td><td>eth-</td><td>7</td><td>hept-</td></tr><tr><td>3</td><td>prop-</td><td>8</td><td>oct-</td></tr><tr><td>4</td><td>but-</td><td>9</td><td>non-</td></tr><tr><td>5</td><td>pent-</td><td>10</td><td>dec-</td></tr></table><p>A ring adds <b>cyclo-</b>: ${T('cyclohexane')}. As a branch the stem ends in <b>-yl</b> (methyl, ethyl…).</p></details>
<details><summary>Functional group priority</summary><table><tr><th>Group (highest first)</th><th>Suffix</th><th>As a prefix</th></tr>
<tr><td>carboxylic acid –COOH</td><td>-oic acid</td><td>–</td></tr><tr><td>acid anhydride (RCO)₂O</td><td>-oic anhydride</td><td>–</td></tr><tr><td>ester –COO–</td><td>alkyl …-oate</td><td>–</td></tr><tr><td>acyl chloride –COCl</td><td>-oyl chloride</td><td>–</td></tr><tr><td>amide –CONH₂</td><td>-amide</td><td>–</td></tr><tr><td>nitrile –C≡N</td><td>-nitrile</td><td>cyano-</td></tr><tr><td>aldehyde –CHO</td><td>-al</td><td>oxo-</td></tr><tr><td>ketone C=O</td><td>-one</td><td>oxo-</td></tr><tr><td>alcohol / phenol –OH</td><td>-ol</td><td>hydroxy-</td></tr><tr><td>amine –NH₂</td><td>-amine</td><td>amino-</td></tr><tr><td>alkene C=C</td><td>-ene</td><td>–</td></tr><tr><td>ether C–O–C</td><td>–</td><td>methoxy-, ethoxy-…</td></tr><tr><td>nitro –NO₂</td><td>–</td><td>nitro-</td></tr><tr><td>halogen</td><td>–</td><td>fluoro- chloro- bromo- iodo-</td></tr><tr><td>alkyl / benzene ring branch</td><td>–</td><td>methyl-… / phenyl-</td></tr></table>
<p>Example: ${T('2-hydroxypropanoic acid')}: the acid beats the alcohol, so OH becomes hydroxy-.</p></details>
<details><summary>E/Z isomers</summary><p>A C=C can't rotate. If <b>each</b> carbon of the C=C has two <b>different</b> groups, there are two stereoisomers.</p><p><b>CIP priority:</b> on each carbon, the group whose first atom has the higher atomic number wins (Br &gt; Cl &gt; O &gt; N &gt; C &gt; H). If they tie, compare the atoms one bond further out, so –CH₂CH₃ beats –CH₃.</p><p><b>Z</b> (zusammen, together): the two priority groups are on the same side. <b>E</b> (entgegen, opposite): on opposite sides. Write it in brackets at the front: ${T('(E)-but-2-ene')}, ${T('(Z)-1,2-dichloroethene')}. With two C=C, add locants: ${T('(2Z,4E)-hexa-2,4-diene')}.</p><p><b>cis/trans</b> only works when each carbon has one H (then cis = Z, trans = E). ${T('(Z)-3-methylpent-2-ene')} has no H on C3, so only E/Z works.</p><p>In the explorer, click the C=C (or the (E)/(Z) in the name) to swap.</p></details>
<details><summary>Esters</summary><p>R–COO–R′ is made from a carboxylic acid and an alcohol, and its name is two words. <b>First word:</b> the group on the single-bonded O, from the alcohol (methyl, ethyl…, or phenyl from phenol). <b>Second word:</b> the acid part, including the C=O carbon (which is C1), with -oic acid → <b>-oate</b>.</p><p>${T('ethyl ethanoate')} CH₃COOCH₂CH₃, ${T('methyl benzoate')}, ${T('phenyl ethanoate')}. Careful: ${T('propyl ethanoate')} and ${T('ethyl propanoate')} are different isomers.</p><p><b>Diesters</b> (from a dicarboxylic acid) end -dioate: ${T('dimethyl ethanedioate')}. Two different groups are separate words in alphabetical order: ${T('ethyl methyl propanedioate')}. On a ring: ${T('dimethyl benzene-1,4-dicarboxylate')}.</p><p>Fats and oils are triesters of propane-1,2,3-triol (glycerol). To build an ester in the explorer, drop –CH₃ onto the OH of a COOH.</p></details>
<details><summary>Salts</summary><p>Positive ion first, then negative ion. There's no bond line between them: they're held by ionic attraction.</p><p><b>Carboxylate salts:</b> the acid loses H⁺, so -oic acid → -oate: ${T('sodium ethanoate')}, ${T('sodium benzoate')}, ${T('disodium ethanedioate')}. They form with NaOH or Na₂CO₃, or when an ester is hydrolysed by an alkali.</p><p><b>Ammonium salts:</b> an amine accepts H⁺ from an acid. Name the groups on N⁺ (alphabetical), then <b>ammonium</b>, then the halide: ${T('ethylammonium chloride')}, ${T('phenylammonium chloride')}. With four carbon groups and no H it's a <b>quaternary</b> ammonium salt: ${T('tetramethylammonium chloride')}; long-chain ones are cationic surfactants.</p><p>In the explorer, drop Na⁺ or K⁺ on a COOH, or HCl on an NH₂.</p></details>
<details><summary>Ethers</summary><p>An O between two carbon groups, C–O–C, with no C=O next to it. The bigger side (or the ring, or the side with the main functional group) is the parent; the other side plus its O is an <b>alkoxy</b> prefix: methoxy-, ethoxy-, propoxy-.</p><p>${T('methoxyethane')} (not ethoxymethane), ${T('methoxybenzene')}, ${T('2-methoxyethanol')}. In the explorer, drop –CH₃ onto the H of an OH.</p></details>
<details><summary>Nitrogen groups and acid derivatives</summary><p><b>Amines:</b> ${T('propan-1-amine')}, ${T('propan-2-amine')}, ${T('ethane-1,2-diamine')}. Groups on the N get the locant <b>N</b>: ${T('N-methylethanamine')} (the longest chain is the parent), ${T('N,N-dimethylethanamine')}. C₆H₅NH₂ is ${T('phenylamine')}. With a higher group, NH₂ becomes amino-: ${T('2-aminopropanoic acid')}.</p><p><b>Amides:</b> ${T('ethanamide')}, ${T('N-methylethanamide')}, ${T('benzamide')}. <b>Nitriles:</b> the C of C≡N counts in the chain: CH₃CH₂CN is ${T('propanenitrile')}. <b>Hydroxynitriles</b> (from HCN + aldehyde/ketone): ${T('2-hydroxypropanenitrile')}.</p><p><b>Acyl chlorides:</b> ${T('ethanoyl chloride')}, ${T('benzoyl chloride')}. <b>Anhydrides:</b> ${T('ethanoic anhydride')} (CH₃CO)₂O; mixed ones list both acids alphabetically: ${T('ethanoic propanoic anhydride')}.</p></details>
<details><summary>Rings and benzene</summary><p>Number a ring from the carbon with the suffix group (or C=C), going the way that gives lower locants. If only one place is possible, leave the number out: ${T('methylcyclohexane')}, ${T('cyclohexanol')}, ${T('cyclohexene')}.</p><p>Benzene C₆H₆: groups are prefixes (${T('methylbenzene')}, ${T('1,4-dimethylbenzene')}, ${T('nitrobenzene')}). Some have special names, with that group's carbon as C1: ${T('phenol')}, ${T('benzoic acid')}, ${T('benzaldehyde')}, ${T('phenylamine')}.</p><p>If a chain carries the functional group or a C=C, the chain is the parent and the ring is a <b>phenyl</b> prefix: ${T('phenylethene')}, ${T('phenylethanone')}, ${T('2-phenylethanol')}. Otherwise the ring is the parent: ${T('ethylbenzene')}.</p></details>
<details><summary>Common names you'll meet</summary><table><tr><th>Common</th><th>IUPAC</th></tr>${[['acetone','propanone'],['acetic acid','ethanoic acid'],['ethyl acetate','ethyl ethanoate'],['glycerol','propane-1,2,3-triol'],['lactic acid','2-hydroxypropanoic acid'],['toluene','methylbenzene'],['aniline','phenylamine'],['styrene','phenylethene'],['chloroform','trichloromethane'],['diethyl ether','ethoxyethane'],['acetic anhydride','ethanoic anhydride'],['alanine','2-aminopropanoic acid']].map(([a,b])=>`<tr><td>${a}</td><td>${T(b)}</td></tr>`).join('')}</table><p class="mu">Type a common name in the explorer and it will give you the IUPAC one.</p></details>
<details><summary>Exam tips (AQA A-level Chemistry 7405, section 3.3.1)</summary><ul><li>AQA expects IUPAC names for structures with up to 6 carbons in the main chain, plus the functional groups in the spec. Draw-and-name questions often ask for displayed, structural or skeletal formulae: this lab shows skeletal and displayed (tick “Show every H”).</li><li>Locants that can only be in one place are usually left out (propanone, butanone, ethanol, propene). Writing them in (propan-2-one) is still correct and normally gets the mark.</li><li>A-level uses “phenylethene” where strict IUPAC 2013 says ethenylbenzene; AQA mark schemes accept the A-level form.</li><li>Check your name by drawing it back from the name: if you get a different molecule, the name is wrong.</li><li>Typical slips: missing hyphens or commas, prefixes out of alphabetical order, numbering from the wrong end, and a parent chain that isn't the longest.</li><li>For E/Z, always use CIP priorities, not “the bigger group”.</li></ul></details>
</div>`;

/* ---------- the lab ---------- */
const LEVELS=[['Easy','Short chains with one group or none.'],['Medium','Every AQA family, with one or two groups.'],['Hard','More groups, E/Z, diesters, salts, anhydrides and hydroxynitriles.'],['Extreme','Several groups at once: everything in the AQA spec (chains and rings up to six carbons).']];
const QTYPES=[['mix','Mixed questions'],['name','Name this molecule'],['pick','Pick the correct name'],['draw','Draw this molecule']];
const KEY='tt-iupac-v2';

L.iupac={title:'IUPAC naming: build it, name it, quiz it',cat:'Organic',topic:'3.3.1',anim:false,inlineControls:false,
desc:'Build any organic molecule by clicking and dragging (or type a name) and watch its IUPAC name update, split into prefixes, stem and suffix. See why plausible wrong names are wrong, follow a step-by-step walkthrough, and quiz yourself at four levels.',
icon:'<path d="M14 78l20-12 20 12 20-12 20 12" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M54 78v20" stroke="currentColor" stroke-width="5"/><text x="60" y="44" font-size="26" font-weight="700" text-anchor="middle" fill="currentColor" font-family="sans-serif">OH</text><path d="M94 66V50" stroke="currentColor" stroke-width="5"/><text x="18" y="112" font-size="16" font-weight="700" fill="currentColor" font-family="sans-serif">1 2 3 4</text>',
mount(el){ addCSS(); const S=LK.scope(); const pop=makePop(S);
  const store=(()=>{ let s={}; try{ s=JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){} if(!s.best){ let old=0; try{ old=(JSON.parse(localStorage.getItem('tt-iupac')||'{}').best)||0; }catch(e){} s.best=[0,old,0,0]; } s.mistakes=s.mistakes||[]; s.total=s.total||0; s.right=s.right||0; s.streak=s.streak||0; s.level=s.level==null?1:s.level; s.qtype=s.qtype||'mix'; return s; })();
  const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(store)); }catch(e){} };
  let numbers=true, mode='explore';
  const root=LK.el(`<div class="iu">
    <div class="subtabs" role="group" aria-label="Mode"><button type="button" data-m="explore" aria-pressed="true">Explorer</button><button type="button" data-m="quiz" aria-pressed="false">Quiz</button><button type="button" data-m="cheat" aria-pressed="false">Cheat sheet</button></div>
    <section class="iu-explore" style="display:flex;flex-direction:column;gap:12px">
      <div class="iu-card"><div class="iu-nmbox" aria-live="polite"></div><div class="iu-legend" aria-hidden="true"><span class="k-pre">prefixes</span><span class="k-stem">stem</span><span class="k-uns">bonds</span><span class="k-suf">suffix</span></div><div class="iu-hint">Hover over (or tap) part of the name to see it in the molecule; click it to change it.</div></div>
      <div class="iu-row"><input type="text" class="iu-in" id="iuIn" aria-label="Type an IUPAC name or a structural formula to build it" placeholder="…or type a name or a formula, e.g. 2-methylbutan-2-ol or CH3CH(OH)CH3" autocomplete="off" autocapitalize="off" spellcheck="false"></div>
      <div class="iu-credit">Typing a formula: suggested by Arnav :)</div>
      <details class="iu-ex"><summary>Examples</summary><div class="iu-exg">${EXAMPLES.map(([h,l])=>`<section><h6>${esc(h)}</h6><div>${l.map(n=>`<button type="button" data-ex="${esc(n)}">${esc(n)}</button>`).join('')}</div></section>`).join('')}</div></details>
      <div class="iu-msg" role="status" aria-live="polite"></div>
      <div class="iu-grid"><div class="iu-card iu-edhost"></div>
        <div class="iu-side"><div class="iu-card"><h4>Why not…?</h4><div class="mu" style="margin-bottom:8px">The same molecule, but each name breaks a rule. Click one to check it.</div><ul class="iu-why"></ul></div>
          <div class="iu-card"><h4>How to name it</h4><ol class="iu-steps"></ol></div>
          <div class="iu-facts"></div></div></div>
    </section>
    <section class="iu-quiz" hidden style="display:flex;flex-direction:column;gap:12px">
      <div class="iu-row" style="justify-content:space-between"><div class="iu-levels" role="group" aria-label="Level">${LEVELS.map(([l],i)=>`<button type="button" data-lv="${i}" aria-pressed="false">${l}</button>`).join('')}</div>
        <label style="font-size:.85rem;color:var(--muted);display:flex;gap:6px;align-items:center">Questions <select class="iu-qt" style="height:34px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink)">${QTYPES.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label></div>
      <div class="mu iu-lvdesc"></div>
      <div class="iu-score" aria-live="polite"><span>Score <b data-k="sc">0</b></span><span>Streak <b data-k="st">0</b></span><span>Best streak (this level) <b data-k="be">0</b></span><span>All-time <b data-k="acc">–</b></span><button type="button" class="btn btn-sm" data-a="review"><span>Review mistakes (<span data-k="nm">0</span>)</span></button></div>
      <div class="iu-card iu-qcard">
        <div class="mu iu-qkind" style="text-transform:uppercase;letter-spacing:.06em;font-size:.72rem"></div>
        <div class="iu-q"></div>
        <div class="iu-qstage iu-stage"></div>
        <div class="iu-qdraw"></div>
        <label class="toggle iu-qdisp" style="font-size:.85rem;display:inline-flex;gap:5px;align-items:center;margin-top:6px"><input type="checkbox"> Show every H</label>
        <div class="iu-qname iu-row" style="margin-top:8px"><input type="text" class="iu-in" id="iuAns" aria-label="Your answer" placeholder="Type its IUPAC name, then Enter" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" class="btn primary" data-a="check">Check</button></div>
        <div class="iu-opts"></div>
        <div class="iu-row" style="margin-top:10px"><button type="button" class="btn primary btn-sm" data-a="checkdraw">Check my molecule</button><button type="button" class="btn btn-sm" data-a="hint">Hint</button><button type="button" class="btn btn-sm" data-a="reveal">Show answer</button><button type="button" class="btn btn-sm" data-a="explore">Open in explorer</button><button type="button" class="btn btn-sm" data-a="next" style="margin-left:auto">Next question →</button></div>
      </div>
      <div class="iu-msg iu-qmsg" role="status" aria-live="polite"></div>
      <div class="iu-card iu-rev" hidden><h4 style="margin:0">Your mistakes</h4><div class="mu">Saved in this browser. Practise them again, or open one in the explorer.</div><div class="iu-row" style="margin-top:6px"><button type="button" class="btn btn-sm primary" data-a="retry">Practise these</button><button type="button" class="btn btn-sm" data-a="clearrev">Clear the list</button></div><ul class="iu-review"></ul></div>
    </section>
    <section class="iu-cheatsec" hidden>${CHEAT}</section>
  </div>`);
  el.appendChild(root);
  const $=q=>root.querySelector(q);
  const nmbox=$('.iu-nmbox'), inp=$('#iuIn'), msg=$('.iu-explore .iu-msg'), whyL=$('.iu-why'), stepsL=$('.iu-steps'), facts=$('.iu-facts');
  const setMsg=(box,cls,html)=>{ box.className='iu-msg'+(box.classList.contains('iu-qmsg')?' iu-qmsg':'')+(cls?' '+cls:''); box.innerHTML=html; };

  /* ===== explorer ===== */
  let stepsCache=[], typing=false;
  const ed=makeEditor($('.iu-edhost'),S,pop,{numbers:()=>numbers,displayed:!!store.disp,onView:v=>{ store.disp=v; save(); },onChange:(cur,src)=>{
      renderName(cur); renderWhy(cur); renderSteps(cur); renderFacts(cur);
      if(src==='edit'){ inp.value=cur.name||''; setMsg(msg,cur.err?'warn':'',cur.err?`<b>This can't be named here:</b> ${esc(cur.err)}`:''); } }});
  function renderName(cur){
    if(cur.err||!cur.parts){ nmbox.innerHTML=`<div class="iu-nmerr">${esc(cur.err||'')}</div>`; return; }
    nmbox.innerHTML=`<div class="iu-nm">${nameHTML(cur.parts)}</div>`;
    const kinds=new Set(cur.parts.map(p=>p.k)); root.querySelectorAll('.iu-legend span').forEach(s=>{ const k=s.className.slice(2); s.hidden=!(kinds.has(k)||(k==='pre'&&kinds.has('loc'))); });
    const lg=$('.iu-legend'); lg.querySelectorAll('.extra').forEach(x=>x.remove()); [['ez','E/Z'],['ester','ester group'],['ion','negative ion']].forEach(([k,t])=>{ if(kinds.has(k)) lg.appendChild(LK.el(`<span class="k-${k} extra">${t}</span>`)); }); }
  const partOf=b=>ed.cur&&ed.cur.parts?ed.cur.parts[+b.dataset.i]:null;
  S.on(nmbox,'pointerover',e=>{ const b=e.target.closest('.iu-part'); if(!b) return; const p=partOf(b); if(p) ed.highlight(partAtoms(ed.cur,p)); });
  S.on(nmbox,'pointerout',e=>{ if(e.target.closest('.iu-part')&&!pop.isOpen) ed.highlight(null); });
  S.on(nmbox,'focusin',e=>{ const b=e.target.closest('.iu-part'); if(b){ const p=partOf(b); if(p) ed.highlight(partAtoms(ed.cur,p)); } });
  S.on(nmbox,'click',e=>{ const b=e.target.closest('.iu-part'); if(!b) return; const p=partOf(b); if(!p) return; ed.highlight(partAtoms(ed.cur,p)); const r=b.getBoundingClientRect(); partMenu(p,r.left,r.bottom,e.detail===0); });
  function partMenu(part,x,y,focus){
    const cur=ed.cur, an=cur.an, sp=an.spec, m=cur.mol, A=an.A, ord=an.best.ord||[];
    pop.open(x,y,p=>{
      if(part.k==='pre'||part.k==='loc'){ const g=sp.prefixes[part.r]; if(!g) return; const onN=g.items.some(it=>it.loc==='N');
        p.h(`${esc(g.name.replace(/^\((.*)\)$/,'$1'))} on ${g.locs.map(l=>l==='N'?'the N':'C'+l).join(', ')}`);
        p.sec('Change to'); let r=p.row();
        PREFIX_CHOICES.filter(([w])=>!(sp.kind==='ammonium'||onN)||['methyl','ethyl','propyl','phenyl'].includes(w)).forEach(([w,code])=>p.btn(r,w,()=>{ const mm=I.clone(m); const del=new Set(); g.items.forEach(it=>{ branchAtoms(m,A,it.at,it.root).forEach(z=>del.add(z)); addNamed(mm,it.at,code); }); ed.commit(keepBiggest(I.removeAtoms(mm,[...del]).mol)); },{cls:g.key===w?'on':''}));
        g.items.forEach(it=>{ if(it.loc==='N') return; const b=I.adj(m)[it.at].find(z=>z.j===it.root); const free=ord.map((a,k)=>({a,k:k+1})).filter(c=>c.a!==it.at&&I.hcount(m,A,c.a)>=(b?b.o:1));
          if(free.length){ p.sec(`Move the one on C${it.loc} to`); r=p.row(); free.forEach(c=>p.btn(r,'C'+c.k,()=>{ const mm=I.clone(m); const bd=mm.bonds[b.i]; if(bd.a===it.at) bd.a=c.a; else bd.b=c.a; ed.commit(mm,`Moved to C${c.k}.`); })); } });
        p.sec('More'); r=p.row(); const code=(PREFIX_CHOICES.find(([w])=>w===g.key)||[])[1];
        if(code&&sp.kind!=='ammonium'){ const spot=ord.find(a=>I.hcount(m,A,a)>=1&&a!==g.items[0].at)??ord.find(a=>I.hcount(m,A,a)>=1); p.btn(r,`+ another ${g.key}`,()=>{ const mm=I.clone(m); addNamed(mm,spot,code); ed.commit(mm); },{dis:spot==null}); }
        p.btn(r,g.items.length>1?'Remove them':'Remove',()=>{ const del=new Set(); g.items.forEach(it=>branchAtoms(m,A,it.at,it.root).forEach(z=>del.add(z))); const r2=I.removeAtoms(m,[...del]).mol; ed.commit(r2.atoms.some(a=>a.el==='C')?keepBiggest(r2):'That would leave nothing to name.'); },{cls:'dang'});
        return; }
      if(part.k==='stem'&&sp.kind==='ammonium'){ p.h('ammonium: the N⁺'); p.p('Every group on the N is a prefix. Add one by dropping –CH₃ on an H of the N.'); return; }
      if(part.k==='stem'||part.k==='uns'){ const n=ord.length, ring=!!(an.best.cd&&an.best.cd.ring), arom=!!(an.best.cd&&an.best.cd.arom);
        p.h(arom?'Benzene ring':ring?`Ring of ${n} carbons`:`Parent chain: ${n} carbon${n>1?'s':''} (${I.STEM[n]}-)`);
        if(!arom&&n>1){ p.sec('Bonds in the parent'); for(let k=0;k<(ring?n:n-1);k++){ const a=ord[k], b=ord[(k+1)%n]; const bd=I.adj(m)[a].find(z=>z.j===b); if(!bd) continue; const r=p.row(); r.appendChild(LK.el(`<span class="mu" style="align-self:center;min-width:64px">C${k+1}–C${(k+1)%n+1}</span>`)); [[1,'–'],[2,'='],[3,'≡']].forEach(([o2,lb])=>p.btn(r,lb,()=>ed.commit(bondOrder(m,bd.i,o2)),{cls:bd.o===o2?'on':'',title:['single','double','triple'][o2-1]+' bond',dis:ring&&o2===3})); } }
        if(!ring){ p.sec('Chain'); const r=p.row(); const end=[ord[n-1],ord[0]].find(a=>I.hcount(m,A,a)>=1);
          p.btn(r,'+1 carbon',()=>{ const mm=I.clone(m); addGroupM(mm,end,'CH3'); ed.commit(mm); },{dis:end==null});
          const tail=[ord[n-1],ord[0]].find(a=>A[a].length===1&&m.atoms.filter(z=>z.el==='C').length>1);
          p.btn(r,'−1 carbon',()=>ed.commit(deleteAtom(m,tail)),{dis:tail==null||n<2});
          p.btn(r,'Join the ends into a ring',()=>ed.commit(addBond(m,ord[0],ord[n-1])),{dis:n<3||I.hcount(m,A,ord[0])<1||I.hcount(m,A,ord[n-1])<1}); }
        else if(!arom){ const r=p.row(); const bd=I.adj(m)[ord[0]].find(z=>z.j===ord[n-1]); p.btn(r,'Open the ring',()=>ed.commit(deleteBond(m,bd.i)),{dis:!bd}); }
        return; }
      if(part.k==='suf'||part.k==='sloc'){ const anc=an.best.anchors;
        p.h(`The main group: ${esc(I.GROUPWORD[an.principal]||an.principal)}`); p.sec('Change it to');
        const RC=[['alcohol –OH',['OH']],['C=O (aldehyde or ketone)',['O2']],['carboxylic acid',['O2','OH']],['methyl ester',['O2','OH','@']],['acyl chloride',['O2','Cl']],['amide',['O2','NH2']],['nitrile',['CN']],['amine –NH₂',['NH2']]];
        const r=p.row();
        const build=rc=>{ const mm=I.clone(m); const del=new Set(); anc.forEach(({g,an:c})=>{ const tc=g.t==='amine'?c:g.c; g.atoms.forEach(z=>del.add(z)); if(g.alk!=null) branchAtoms(m,A,g.c,g.O).forEach(z=>del.add(z)); if(g.t==='anhyd'){ return; }
            rc.forEach(st=>{ if(st==='@'){ const o2=mm.atoms.length-1; mm.atoms.push({el:'C'}); mm.bonds.push({a:o2,b:mm.atoms.length-1,o:1,ar:false}); } else addGroupM(mm,tc,st); }); });
          const res=keepBiggest(I.removeAtoms(mm,[...del]).mol); const AA=I.adj(res); return res.atoms.some((_,i)=>I.hcount(res,AA,i)<0)?null:res; };
        RC.forEach(([lb,rc])=>{ const res=build(rc); p.btn(r,lb,()=>ed.commit(res),{dis:!res}); });
        const r2=p.row(); p.btn(r2,'Remove it',()=>ed.commit(build([])||'Can’t remove that.'),{cls:'dang'}); return; }
      if(part.k==='ester'){ const eg=an.groups.filter(g=>g.t==='ester');
        p.h('The first word: the group on the single-bonded O'); p.sec('Change to'); const r=p.row();
        [['methyl','CH3'],['ethyl','Et'],['propyl','Pr'],['phenyl','Ph'],['sodium','Na'],['potassium','K']].forEach(([w,code])=>p.btn(r,w,()=>{ const mm=I.clone(m); const del=new Set();
          eg.forEach(g=>{ if(g.alk!=null) branchAtoms(m,A,g.O,g.alk).forEach(z=>del.add(z)); const O=mm.atoms[g.O]; delete O.ch; delete O.ion; if(code==='Na'||code==='K'){ O.ch=-1; O.ion=code; } else addNamed(mm,g.O,code); });
          ed.commit(keepBiggest(I.removeAtoms(mm,[...del]).mol)); },{cls:sp.ester===w?'on':''})); return; }
      if(part.k==='ez'){ p.h('E/Z: which isomer'); const r=p.row(); an.stereo.filter(z=>z.d).forEach(z=>{ const l=ord.indexOf(z.a)+1, l2=ord.indexOf(z.b)+1; const lo=l&&l2?Math.min(l,l2):null;
          p.btn(r,`${lo?'C'+lo+': ':''}swap ${z.d} → ${z.d==='E'?'Z':'E'}`,()=>{ const mm=I.clone(m); mm.bonds[z.bi].ez=z.d==='E'?'Z':'E'; ed.commit(mm); }); }); return; }
      if(part.k==='ion'){ const g=an.groups.find(x=>x.t==='ammonium'); p.h('The negative ion'); const r=p.row(); ['Cl','Br','I'].forEach(x=>p.btn(r,I.HALIDEN[x],()=>{ const mm=I.clone(m); mm.atoms[g.N].ion=x; ed.commit(mm); },{cls:m.atoms[g.N].ion===x?'on':''})); return; }
    },{focus,onClose:()=>ed.highlight(null)});
  }
  function renderWhy(cur){ if(cur.err){ whyL.innerHTML='<li class="mu">Make a molecule that can be named to see common wrong names.</li>'; return; }
    let w=[]; try{ w=I.whyNot(cur.mol); }catch(e){}
    whyL.innerHTML=w.length?w.map(x=>`<li><button type="button" data-why="${esc(x.name)}">${esc(x.name)}</button>${esc(x.why)}</li>`).join(''):'<li class="mu">No common wrong names for this one.</li>'; }
  S.on(whyL,'click',e=>{ const b=e.target.closest('[data-why]'); if(!b) return; inp.value=b.dataset.why; renderTyped(); inp.focus(); });
  function renderSteps(cur){ if(cur.err||!cur.an){ stepsL.innerHTML=''; stepsCache=[]; return; } try{ stepsCache=walkthrough(cur); }catch(e){ console.error(e); stepsCache=[]; }
    stepsL.innerHTML=stepsCache.map((s,i)=>`<li tabindex="0" data-st="${i}">${s.h}</li>`).join(''); }
  const stepOn=li=>{ stepsL.querySelectorAll('li').forEach(x=>x.classList.toggle('on',x===li)); const s=li?stepsCache[+li.dataset.st]:null; if(s&&s.numbers&&!numbers){ numbers=true; cNum.checked=true; } ed.highlight(s?s.a:null); };
  S.on(stepsL,'pointerover',e=>{ const li=e.target.closest('li'); if(li) stepOn(li); });
  S.on(stepsL,'pointerleave',()=>stepOn(null));
  S.on(stepsL,'focusin',e=>{ const li=e.target.closest('li'); if(li) stepOn(li); });
  S.on(stepsL,'click',e=>{ const li=e.target.closest('li'); if(li) stepOn(li); });
  function renderFacts(cur){ const m=cur.mol; let f; try{ f=I.formula(m); }catch(e){ facts.innerHTML=''; return; } let cls=[]; try{ cls=cur.an?I.classify(m,cur.an):[]; }catch(e){}
    facts.innerHTML=`<div>Molecular formula<b>${esc(f.f)}</b></div><div>M<sub>r</sub><b>${f.mr.toFixed(1)}</b></div>${cls.length?`<div style="flex-basis:100%">Type<b>${esc(cls.join(' · '))}</b></div>`:''}`; }
  /* typing a name builds it */
  let tmr=0;
  function renderTyped(){ const v=inp.value.trim(); if(!v){ setMsg(msg,'',''); return; }
    if(I.looksLikeFormula(v)){ let fm;
      try{ fm=I.fromFormula(v); }catch(e){ if(!e.iu) console.error(e); setMsg(msg,'warn',`<b>Can’t read that formula yet.</b> ${esc(e.iu?e.message:'Something went wrong reading it.')}`); return; }
      ed.set(fm,{src:'type'}); const c=ed.cur; let ez=false; try{ ez=c.an&&c.an.stereo.length>0; }catch(e){}
      if(c.err){ setMsg(msg,'warn',`Built from your formula, but: ${esc(c.err)}`); return; }
      setMsg(msg,'good',`<div>That formula is <span class="nm">${esc(c.name)}</span></div><div class="mu">Read as a structural formula: groups in brackets are branches on the atom before them, e.g. CH3CH(OH)CH3.${ez?' This C=C has E/Z isomers and a formula doesn’t say which, so it’s drawn as E: click the C=C to swap.':''}</div>`); return; }
    let r; try{ r=I.check(v); }catch(e){ if(!e.iu) console.error(e); setMsg(msg,'warn',`<b>Can’t build that yet.</b> ${esc(e.iu?e.message:'Something went wrong reading that name.')}`); return; }
    ed.set(r.mol,{src:'type'});
    const notes=r.notes&&r.notes.length?`<div class="mu" style="margin-top:6px">${r.notes.map(esc).join(' ')}${r.ezMissing?' The drawing shows E: click the C=C to swap.':''}</div>`:'';
    if(!r.ok){ setMsg(msg,'warn',`Built from your name, but: ${esc(r.unnamed)}${notes}`); return; }
    if(r.valid){ const same=I.norm(v).replace(/\s/g,'')===I.norm(r.name).replace(/\s/g,'');
      setMsg(msg,'good',`<div>✓ <span class="nm">${esc(v)}</span> is a correct IUPAC name.</div>${same?'':`<div class="mu">Usually written <b>${esc(r.name)}</b>${r.full!==r.name?` (or ${esc(r.full)})`:''}.</div>`}${notes}`); }
    else { const why=[r.reason].concat(r.issues).filter(Boolean);
      setMsg(msg,'warn',`<div>Built from your name, but the IUPAC name is <span class="nm">${esc(r.name)}</span></div>${why.length?`<ul>${why.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${notes}`); } }
  S.on(inp,'input',()=>{ clearTimeout(tmr); tmr=setTimeout(renderTyped,160); });
  S.on(inp,'keydown',e=>{ if(e.key==='Enter'){ clearTimeout(tmr); renderTyped(); } });
  S.add(()=>clearTimeout(tmr));
  const loadName=n=>{ setMode('explore'); inp.value=n; renderTyped(); const ex=$('.iu-ex'); if(ex) ex.open=false; };
  S.on(root,'click',e=>{ const b=e.target.closest('[data-ex]'); if(b){ loadName(b.dataset.ex); $('.iu-nmbox').scrollIntoView({block:'nearest',behavior:'smooth'}); } });
  S.on(document,'keydown',e=>{ if(mode!=='explore'||e.key!=='/'||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if(!root.isConnected) return; e.preventDefault(); inp.focus(); inp.select(); });

  /* side panel controls */
  const ct=LK.ctrl(el);
  const cNum=LK.check(ct,'Number the parent chain',true,v=>{ numbers=v; ed.redraw(); });

  /* ===== quiz ===== */
  const qstageHost=$('.iu-qstage'), qmsg=$('.iu-qmsg'), ans=$('#iuAns'), opts=$('.iu-opts');
  const qst=LK.stage(qstageHost,S,{ratio:0.5,maxH:380,minH:230});
  let qdisp=!!store.disp; $('.iu-qdisp input').checked=qdisp;
  let q=null, score=0, attempted=false, solved=false, hint=0, recent=[], practice=null, qShowNum=false;
  const qredraw=()=>{ if(!q||q.type==='draw') return; drawMol(qst.ctx,qst.w,qst.h,q.mol,q.an,{numbers:qShowNum,displayed:qdisp}); };
  qst.onResize=qredraw;
  const qed=makeEditor($('.iu-qdraw'),S,pop,{numbers:()=>false,displayed:qdisp,ratio:0.5,minH:240,maxH:400,onView:v=>{ qdisp=v; }});
  const upScore=()=>{ $('[data-k=sc]').textContent=score; $('[data-k=st]').textContent=store.streak; $('[data-k=be]').textContent=store.best[store.level]||0; $('[data-k=acc]').textContent=store.total?`${store.right}/${store.total} (${Math.round(100*store.right/store.total)}%)`:'–'; $('[data-k=nm]').textContent=store.mistakes.length;
    root.querySelectorAll('[data-lv]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.lv===store.level)); $('.iu-lvdesc').textContent=LEVELS[store.level][1]; $('.iu-qt').value=store.qtype; };
  const record=(ok,yours)=>{ if(attempted) return; attempted=true; store.total++; if(ok){ store.right++; score++; store.streak++; if(store.streak>(store.best[store.level]||0)) store.best[store.level]=store.streak; if(practice) store.mistakes=store.mistakes.filter(x=>x.name!==q.name); }
    else { store.streak=0; store.mistakes=[{name:q.name,type:q.type,yours:yours||'',t:Date.now(),lv:store.level}].concat(store.mistakes.filter(x=>!(x.name===q.name&&x.type===q.type))).slice(0,60); }
    save(); upScore(); renderReview(); };
  function show(kind){ const t=q.type;
    $('.iu-qkind').textContent={name:'Name this molecule',pick:'Pick the correct name',draw:'Draw this molecule'}[t]+(practice?' · practising your mistakes':'');
    qstageHost.hidden=t==='draw'; $('.iu-qdraw').hidden=t!=='draw'; $('.iu-qdisp').hidden=t==='draw'; $('.iu-qname').hidden=t!=='name'; opts.hidden=t!=='pick'; $('[data-a=checkdraw]').hidden=t!=='draw'; $('[data-a=hint]').hidden=t==='pick'; }
  function makeQ(){
    let t=store.qtype==='mix'?['name','pick','draw','name','pick'][Math.floor(Math.random()*5)]:store.qtype;
    if(practice&&practice.length){ const it=practice.shift(); try{ const mol=I.fromName(it.name); const nm=I.nameOf(mol); return {mol:normalise(mol),name:nm.name,full:nm.full,an:nm.a,type:it.type||t}; }catch(e){} }
    if(practice&&!practice.length){ practice=null; setMsg(qmsg,'good','You’ve worked through your mistakes list. Back to new questions.'); }
    const r=I.random({level:store.level,avoid:recent}); r.type=t; return r; }
  function next(){
    pop.close(); q=makeQ(); recent=recent.concat(q.name).slice(-20); attempted=false; solved=false; hint=0; qShowNum=false;
    if(q.type==='pick'){ let w=[]; try{ w=I.whyNot(q.mol); }catch(e){} const kinds=new Set(); const pool=[]; w.sort(()=>Math.random()-.5).forEach(x=>{ if(!kinds.has(x.kind)||pool.length<1){ kinds.add(x.kind); pool.push(x); } }); w.forEach(x=>{ if(!pool.includes(x)) pool.push(x); });
      let ds=pool.slice(0,3).map(x=>({name:x.name,why:x.why}));
      for(let k=0;ds.length<3&&k<30;k++){ try{ const o=I.random({level:store.level}); if(o.name!==q.name&&!ds.some(d=>d.name===o.name)) ds.push({name:o.name,why:'That name describes a different molecule.'}); }catch(e){} }
      q.opts=ds.concat([{name:q.name,ok:true}]).sort(()=>Math.random()-.5);
      opts.innerHTML=q.opts.map((o2,i)=>`<button type="button" data-opt="${i}"><kbd>${i+1}</kbd>${esc(o2.name)}</button>`).join(''); }
    show(); $('.iu-q').innerHTML=q.type==='draw'?`Draw <span class="nm">${esc(q.name)}</span>`:'';
    if(q.type==='draw'){ qed.set(blank(),{history:false,msg:'Start from methane: drag groups on, and click atoms or bonds to change them.'}); qed.clearHistory(); }
    else qredraw();
    ans.value=''; setMsg(qmsg,'',q.type==='name'?'<span class="mu">Type the IUPAC name and press Enter. Stuck? Try a hint.</span>':q.type==='pick'?'<span class="mu">Choose one (or press 1–4).</span>':'');
    upScore(); if(q.type==='name'&&!coarse()) ans.focus(); }
  const finish=()=>{ solved=true; if(q.type!=='draw'){ qShowNum=true; qredraw(); } };
  function checkName(){ if(!q) return; if(solved){ next(); return; } const v=ans.value.trim(); if(!v){ ans.focus(); return; }
    let r; try{ r=I.check(v); }catch(e){ setMsg(qmsg,'bad',`<b>I can’t read that name.</b> ${esc(e.iu?e.message:'')}`); return; }
    const same=I.canon(r.mol)===I.canon(q.mol);
    if(same&&r.valid){ const first=!attempted; if(hint<3) record(true); else record(false,v+' (after hints)'); setMsg(qmsg,'good',`<div>✓ Correct: <span class="nm">${esc(q.name)}</span></div><div class="mu">${first&&hint<3?`Streak ${store.streak}.`:'Only your first try counts towards the score.'} Press Enter for the next one.</div>`); finish(); return; }
    record(false,v);
    if(same){ const why=[r.reason].concat(r.issues).filter(Boolean); setMsg(qmsg,'warn',`<div><b>Right molecule, but that isn’t the IUPAC name.</b></div>${why.length?`<ul>${why.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<div class="mu">Have another go, or press Show answer.</div>`); return; }
    const sameNoEZ=(()=>{ const a=I.clone(r.mol), b=I.clone(q.mol); a.bonds.forEach(x=>delete x.ez); b.bonds.forEach(x=>delete x.ez); return I.canon(a)===I.canon(b); })();
    if(sameNoEZ){ setMsg(qmsg,'warn','<b>Right structure, wrong isomer (or no E/Z label).</b> Work out the CIP priorities on each carbon of the C=C: same side is Z, opposite sides is E.'); return; }
    setMsg(qmsg,'bad',`<div><b>Not quite: that name is a different molecule.</b> This is what “${esc(v)}” looks like:</div>`); mini(qmsg,r.mol,r.an||null); qmsg.appendChild(LK.el('<div class="mu" style="margin-top:6px">Compare it with the molecule above, then try again.</div>')); }
  function mini(host,m,an){ const wrap=LK.el('<div class="iu-mini"></div>'); host.appendChild(wrap); const cv=document.createElement('canvas'); wrap.appendChild(cv);
    const W=Math.max(240,wrap.clientWidth||320), H=170, d=Math.min(2,window.devicePixelRatio||1); cv.width=W*d; cv.height=H*d; cv.style.height=H+'px'; const c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0); drawMol(c,W,H,m,an,{max:36,pad:26}); }
  function pick(i){ if(!q||q.type!=='pick'||solved) return; const o2=q.opts[i]; if(!o2) return; const bs=opts.querySelectorAll('button');
    if(o2.ok){ record(true); bs[i].classList.add('right'); setMsg(qmsg,'good',`<div>✓ Correct: <span class="nm">${esc(q.name)}</span></div><div class="mu">Press Enter or Next for another.</div>`); finish(); bs.forEach(b=>b.disabled=true); }
    else { record(false,o2.name); bs[i].classList.add('wrong'); bs[i].disabled=true; setMsg(qmsg,'bad',`<div>✗ <b>${esc(o2.name)}</b>: ${esc(o2.why)}</div><div class="mu">Try again.</div>`); } }
  function checkDraw(){ if(!q||q.type!=='draw') return; if(solved){ next(); return; } const m=qed.mol;
    if(I.canon(m)===I.canon(q.mol)){ record(hint<2); setMsg(qmsg,'good',`<div>✓ That’s <span class="nm">${esc(q.name)}</span>.</div><div class="mu">Press Next for another.</div>`); finish(); return; }
    const strip=x=>{ const a=I.clone(x); a.bonds.forEach(b=>delete b.ez); return I.canon(a); };
    record(false,qed.cur&&qed.cur.name?qed.cur.name:'(drawing)');
    if(strip(m)===strip(q.mol)){ setMsg(qmsg,'warn','<b>Right structure, wrong isomer.</b> Click the C=C and swap E/Z. Same side for the two priority groups is Z, opposite sides is E.'); return; }
    setMsg(qmsg,'bad',`<div><b>Not yet.</b> ${qed.cur&&qed.cur.name?`You’ve drawn <b>${esc(qed.cur.name)}</b>.`:esc(qed.cur&&qed.cur.err||'')}</div><div class="mu">Compare it with the name, change it, and check again.</div>`); }
  function giveHint(){ if(!q||solved) return; hint=Math.min(3,hint+1); const an=q.an, sp=an.spec; let cls=''; try{ cls=I.classify(q.mol,an).join(' · ').toLowerCase(); }catch(e){}
    const h=[`<b>Hint 1:</b> it’s ${/^[aeiou]/.test(cls)?'an':'a'} ${esc(cls)}.`];
    if(hint>=2) h.push(`<b>Hint 2:</b> ${sp.kind==='ammonium'?'every carbon group is on the N⁺':sp.kind==='anhydride'?'split it at the O between the two C=O groups':`the parent is ${sp.kind==='benzene'?'a benzene ring':sp.kind==='ring'?`a ring of ${sp.n} carbons (cyclo${I.STEM[sp.n]}-)`:`a chain of ${sp.n} carbon${sp.n>1?'s':''} (${I.STEM[sp.n]}-)`}`}${sp.prefixes.length?`, with ${esc(sp.prefixes.map(g=>(g.locs.length>1?g.locs.length+' × ':'')+g.name.replace(/[()]/g,'')).join(', '))}`:''}.`);
    if(hint>=3){ if(q.type==='name'){ h.push('<b>Hint 3:</b> the parent is highlighted and numbered. (This one won’t count towards your streak.)'); qShowNum=true; qredraw(); } else h.push(`<b>Hint 3:</b> ${walkthrough({mol:q.mol,an,name:q.name,parts:I.nameParts(sp,false)}).slice(0,-1).map(s=>s.h).join(' ')}`); }
    setMsg(qmsg,'',h.join('<br>')); }
  function reveal(){ if(!q) return; record(false,'(showed the answer)'); hint=3;
    if(q.type==='draw'){ qed.set(q.mol,{msg:'Here it is.'}); }
    setMsg(qmsg,'warn',`<div>The answer is <span class="nm">${esc(q.name)}</span></div>`); if(q.type==='pick') opts.querySelectorAll('button').forEach((b,i)=>{ if(q.opts[i].ok) b.classList.add('right'); b.disabled=true; }); finish(); }
  function renderReview(){ const ul=$('.iu-review'); ul.innerHTML=store.mistakes.length?store.mistakes.map((x,i)=>`<li><span><b>${esc(x.name)}</b>${x.yours?` <span class="mu">you:</span> <span class="bad">${esc(x.yours)}</span>`:''} <span class="mu">· ${esc({name:'name it',pick:'pick',draw:'draw it'}[x.type]||'')} · ${esc(LEVELS[x.lv||0][0])}</span></span><span><button type="button" class="btn btn-sm" data-revx="${i}">Explore</button> <button type="button" class="btn btn-sm" data-revd="${i}" aria-label="Remove">✕</button></span></li>`).join(''):'<li class="mu">No mistakes saved. Nice.</li>'; }
  S.on(ans,'keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); checkName(); } });
  S.on(root.querySelector('.iu-quiz'),'click',e=>{ const lv=e.target.closest('[data-lv]'); if(lv){ store.level=+lv.dataset.lv; save(); score=0; practice=null; next(); return; }
    const o2=e.target.closest('[data-opt]'); if(o2){ pick(+o2.dataset.opt); return; }
    const rx=e.target.closest('[data-revx]'); if(rx){ loadName(store.mistakes[+rx.dataset.revx].name); return; }
    const rd=e.target.closest('[data-revd]'); if(rd){ store.mistakes.splice(+rd.dataset.revd,1); save(); renderReview(); upScore(); return; }
    const b=e.target.closest('[data-a]'); if(!b) return; const a=b.dataset.a;
    if(a==='check') checkName(); else if(a==='checkdraw') checkDraw(); else if(a==='hint') giveHint(); else if(a==='reveal') reveal(); else if(a==='next') next();
    else if(a==='explore'){ if(q) loadName(q.name); }
    else if(a==='review'){ const r=$('.iu-rev'); r.hidden=!r.hidden; renderReview(); if(!r.hidden) r.scrollIntoView({block:'nearest',behavior:'smooth'}); }
    else if(a==='retry'){ if(!store.mistakes.length) return; practice=store.mistakes.slice().reverse().map(x=>({name:x.name,type:x.type})); $('.iu-rev').hidden=true; next(); }
    else if(a==='clearrev'){ if(confirm('Clear your saved mistakes?')){ store.mistakes=[]; save(); renderReview(); upScore(); } } });
  S.on($('.iu-qt'),'change',e=>{ store.qtype=e.target.value; save(); next(); });
  S.on($('.iu-qdisp input'),'change',e=>{ qdisp=e.target.checked; qredraw(); });
  S.on(document,'keydown',e=>{ if(mode!=='quiz'||!root.isConnected||!q) return; const tag=document.activeElement.tagName; if(/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if(q.type==='pick'&&/^[1-4]$/.test(e.key)){ pick(+e.key-1); return; } if(e.key==='Enter'&&solved&&!/BUTTON/.test(tag)){ e.preventDefault(); next(); } });

  /* ===== modes ===== */
  const setMode=md=>{ mode=md; pop.close(); root.querySelectorAll('.subtabs button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===md));
    $('.iu-explore').hidden=md!=='explore'; $('.iu-quiz').hidden=md!=='quiz'; $('.iu-cheatsec').hidden=md!=='cheat';
    $('.iu-explore').style.display=md==='explore'?'flex':'none'; $('.iu-quiz').style.display=md==='quiz'?'flex':'none';
    if(md==='quiz'){ if(!q) next(); else { upScore(); qredraw(); qed.redraw(); } } else if(md==='explore') ed.redraw(); };
  S.on(root.querySelector('.subtabs'),'click',e=>{ const b=e.target.closest('button[data-m]'); if(b) setMode(b.dataset.m); });
  S.on(window,'themechange',()=>{ ed.redraw(); qed.redraw(); qredraw(); });
  el.lkPreset=o2=>{ o2=o2||{}; if(o2.mode==='quiz'){ setMode('quiz'); return; } if(o2.mode==='cheat'){ setMode('cheat'); return; } setMode('explore'); if(o2.name!=null) loadName(o2.name); if(o2.numbers!=null){ cNum.checked=o2.numbers; numbers=o2.numbers; ed.redraw(); } };
  upScore(); renderReview(); setMode('explore'); loadName('2-methylbutane'); ed.clearHistory();
  LK.note(el,`<p><b>How a name is built:</b> prefixes (substituents, alphabetical) + stem (carbons in the parent chain) + bonds (-an-, -en-, -yn-) + suffix (the highest-priority functional group).</p>
<p><b>Priority</b> (highest first): carboxylic acid › anhydride › ester › acyl chloride › amide › nitrile › aldehyde › ketone › alcohol › amine. The top one is the suffix; the rest are prefixes (hydroxy-, oxo-, amino-…). Halogens, nitro, alkoxy and alkyl groups are always prefixes.</p>
<p><b>Number</b> the parent so the suffix group gets the lowest locant, then C=C, then the prefixes as a set (first point of difference).</p>
<p><b>E/Z</b> uses CIP priorities: higher atomic number of the first atom wins. Same side = Z, opposite = E.</p>
<p>All of this is in the Cheat sheet tab, with examples you can open in the explorer.</p>`);
  return ()=>{ S.dispose(); };
}};
L.iupac.draw=drawMol;
})();
