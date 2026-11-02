/* Drawing, measuring, CAD/CAM and anthropometrics labs */
(function(){
'use strict';
const LK=window.LK;

/* ------------- orthographic projection (three.js) ------------- */
function makeModels(){ const T=window.THREE; const S=(pts,holes)=>{ const s=new T.Shape(); pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); s.closePath(); (holes||[]).forEach(hh=>s.holes.push(hh)); return s; };
  const ext=(shape,depth)=>new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:32});
  const M=[];
  M.push({n:'L-block',parts:[[ext(S([[0,0],[4,0],[4,1],[1,1],[1,3],[0,3]]),2)]]});
  M.push({n:'Stepped block',parts:[[ext(S([[0,0],[4,0],[4,1],[3,1],[3,2],[2,2],[2,3],[0,3]]),2)]]});
  M.push({n:'U-channel',parts:[[ext(S([[0,0],[4,0],[4,2],[3,2],[3,1],[1,1],[1,2],[0,2]]),2.5)]]});
  M.push({n:'Wedge block',parts:[[ext(S([[0,0],[4,0],[4,1],[2.2,2.5],[0,2.5]]),2)]]});
  { const h=new T.Path(); h.absarc(2,1.25,.6,0,Math.PI*2,true); M.push({n:'Block with hole',parts:[[ext(S([[0,0],[4,0],[4,2.5],[0,2.5]],[h]),1.5)]]}); }
  { const L=ext(S([[0,0],[4,0],[4,.8],[.7,.8],[.7,3.4],[0,3.4]]),3); const rib=ext(S([[0,0],[2,0],[0,1.7]]),.5); rib.translate(.7,.8,1.25); M.push({n:'Bracket with rib',parts:[[L],[rib]]}); }
  { const base=ext(S([[0,0],[4,0],[4,1],[0,1]]),3); const cyl=new T.CylinderGeometry(.75,.75,1.6,40); cyl.translate(2,1.8,1.5); M.push({n:'Base with boss',parts:[[base],[cyl]]}); }
  { const g=ext(S([[0,0],[4,0],[4,1.2],[2.8,1.2],[2.8,2.6],[1.2,2.6],[1.2,1.2],[0,1.2]]),1.4); M.push({n:'T-block',parts:[[g]]}); }
  return M; }
LK.reg('ortho',{title:'3D projection lab',cat:'Drawing',topics:['3.3'],blurb:'Spin a 3D model and see its third angle orthographic front view, plan and end view – then test yourself.',
 icon:LK.ico('<path d="M20 70V40l20-12 20 12v30L40 82z"/><path d="M20 40l20 12 20-12M40 52v30"/><rect x="66" y="18" width="20" height="16"/><rect x="66" y="40" width="20" height="16"/>'),
 mount(el){
  const T=window.THREE; if(!T){ el.innerHTML='<div class="empty">3D needs WebGL, which is not available here.</div>'; return; }
  const models=makeModels(); const st={m:0,hidden:true,rx:-.5,ry:.7,quiz:null};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Model',options:models.map((m,i)=>[i,m.n]),value:0,on:v=>{st.m=+v; build();}});
  LK.check(ctrl,'Show hidden detail (dashed)',true,v=>{st.hidden=v;});
  LK.btn(ctrl,'Test me',()=>quiz(),'btn btn-sm primary');
  const box=LK.el('<div style="position:relative"></div>'); el.appendChild(box);
  let renderer; try{ renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); }catch(e){ box.innerHTML='<div class="empty">3D needs WebGL, which is not available here.</div>'; return; }
  const cvs=renderer.domElement; box.appendChild(cvs); cvs.style.cursor='grab';
  const ov=document.createElement('canvas'); ov.style.cssText='position:absolute;inset:0;pointer-events:none;background:transparent;border:0'; box.appendChild(ov);
  const qEl=LK.el('<div></div>'); el.appendChild(qEl);
  LK.note(el,'<b>Third angle projection</b> (the British Standard used in the exam): the <b>plan</b> is drawn <b>above</b> the front view and the <b>end view</b> from the right is drawn to the <b>right</b> of the front view – each view is placed on the side it is seen from. Hidden edges are shown as dashed lines. Drag the 3D model to rotate it.');
  const scene=new T.Scene(); const group=new T.Group(); scene.add(group);
  scene.add(new T.AmbientLight(0xffffff,.6)); const dl=new T.DirectionalLight(0xffffff,.7); dl.position.set(3,5,4); scene.add(dl);
  const persp=new T.PerspectiveCamera(32,1,.1,100);
  let W=0,H=0,layout=null;
  const mats={}; function makeMats(){ const p=LK.P(); mats.shade=new T.MeshStandardMaterial({color:new T.Color(p.brand),roughness:.6,metalness:.1,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
    mats.flat=new T.MeshBasicMaterial({color:new T.Color(p.surface),polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
    mats.edge=new T.LineBasicMaterial({color:new T.Color(p.ink)}); mats.edge3=new T.LineBasicMaterial({color:new T.Color(p.navy)});
    mats.hid=new T.LineDashedMaterial({color:new T.Color(p.muted),dashSize:.12,gapSize:.08,depthFunc:T.GreaterDepth,depthWrite:false}); }
  makeMats();
  let meshes=[],edges=[],hids=[],size=4;
  function build(){ while(group.children.length) group.remove(group.children[0]); meshes=[];edges=[];hids=[];
    const m=models[st.m]; const bb=new T.Box3();
    m.parts.forEach(([g])=>{ g.computeBoundingBox(); bb.union(g.boundingBox); });
    const c=bb.getCenter(new T.Vector3()); const sz=bb.getSize(new T.Vector3()); size=Math.max(sz.x,sz.y,sz.z); st.sz=sz;
    m.parts.forEach(([g])=>{ const mesh=new T.Mesh(g,mats.shade); mesh.position.sub(c); group.add(mesh); meshes.push(mesh); const eg=new T.EdgesGeometry(g,25); const e=new T.LineSegments(eg,mats.edge); e.position.copy(mesh.position); e.renderOrder=2; group.add(e); edges.push(e); const hd=new T.LineSegments(eg,mats.hid); hd.computeLineDistances(); hd.position.copy(mesh.position); hd.renderOrder=1; group.add(hd); hids.push(hd); });
    qEl.innerHTML=''; st.quiz=null; }
  build();
  let drag=null; cvs.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,rx:st.rx,ry:st.ry}; cvs.setPointerCapture(e.pointerId); cvs.style.cursor='grabbing'; });
  cvs.addEventListener('pointermove',e=>{ if(!drag) return; st.ry=drag.ry+(e.clientX-drag.x)*.01; st.rx=Math.max(-1.4,Math.min(1.4,drag.rx+(e.clientY-drag.y)*.01)); });
  const endDrag=()=>{ drag=null; cvs.style.cursor='grab'; }; cvs.addEventListener('pointerup',endDrag); cvs.addEventListener('pointercancel',endDrag);
  function orthoCam(view,aspect){ const s=size*.75; const cam=new T.OrthographicCamera(-s*aspect,s*aspect,s,-s,.1,100); if(view==='front'){ cam.position.set(0,0,20); cam.up.set(0,1,0); } if(view==='plan'){ cam.position.set(0,20,0); cam.up.set(0,0,-1); } if(view==='end'){ cam.position.set(20,0,0); cam.up.set(0,1,0); } cam.lookAt(0,0,0); return cam; }
  function resize(){ const w=Math.max(280,box.clientWidth); const stack=w<640; const h=stack?Math.round(w*1.35):Math.round(Math.min(460,w*.5)); if(w===W&&h===H) return; W=w;H=h; renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)); renderer.setSize(w,h); cvs.style.width=w+'px'; cvs.style.height=h+'px';
    const d=Math.min(2,window.devicePixelRatio||1); ov.width=w*d; ov.height=h*d; ov.style.width=w+'px'; ov.style.height=h+'px'; ov.getContext('2d').setTransform(d,0,0,d,0,0);
    if(stack){ const top=Math.round(h*.42); const cw=w/2, ch=(h-top)/2; layout={p3:[0,0,w,top],plan:[0,top,cw,ch],sym:[cw,top,cw,ch],front:[0,top+ch,cw,ch],end:[cw,top+ch,cw,ch]}; }
    else { const lw=Math.round(w*.42); const cw=(w-lw)/2, ch=h/2; layout={p3:[0,0,lw,h],plan:[lw,0,cw,ch],sym:[lw+cw,0,cw,ch],front:[lw,ch,cw,ch],end:[lw+cw,ch,cw,ch]}; } }
  const ro=new ResizeObserver(resize); ro.observe(box); resize();
  function overlay(){ const p=LK.P(); const ctx=ov.getContext('2d'); ctx.clearRect(0,0,W,H); ctx.strokeStyle=p.line; ctx.lineWidth=1;
    ['plan','front','end','sym'].forEach(k=>{ const [x,y,w,h]=layout[k]; ctx.strokeRect(x+.5,y+.5,w-1,h-1); if(k!=='sym') LK.text(ctx,{plan:'PLAN',front:'FRONT VIEW',end:'END VIEW'}[k],x+8,y+12,{size:11,weight:700,color:p.muted}); });
    // projection lines
    const [px,py,pw,ph]=layout.front; ctx.setLineDash([2,4]); ctx.strokeStyle=p.line2; ctx.beginPath(); ctx.moveTo(px+pw,py+ph/2); ctx.lineTo(px+pw+8,py+ph/2); ctx.stroke(); ctx.setLineDash([]);
    const [sx,sy,sw,sh]=layout.sym; const cx=sx+sw/2, cy=sy+sh/2, u=Math.min(sw,sh)/9; ctx.strokeStyle=p.ink; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(cx-3*u,cy-u); ctx.lineTo(cx-.4*u,cy-.4*u*1.6); ctx.lineTo(cx-.4*u,cy+.4*u*1.6); ctx.lineTo(cx-3*u,cy+u); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+1.8*u,cy,1*u,0,7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx+1.8*u,cy,.45*u,0,7); ctx.stroke();
    ctx.setLineDash([6,2,1,2]); ctx.lineWidth=.8; ctx.beginPath(); ctx.moveTo(cx-3.5*u,cy); ctx.lineTo(cx+3.2*u,cy); ctx.moveTo(cx+1.8*u,cy-1.4*u); ctx.lineTo(cx+1.8*u,cy+1.4*u); ctx.stroke(); ctx.setLineDash([]);
    LK.text(ctx,'Third angle projection',cx,cy+2.2*u,{align:'center',size:11,color:p.ink2,weight:600});
    const [ax,ay]=layout.p3; LK.text(ctx,'Drag to rotate',ax+8,ay+12,{size:11,color:p.muted}); }
  function renderViews(r,w,h,lay,showH){ const p=LK.P(); r.setScissorTest(true); r.setClearColor(new T.Color(p.bg),1);
    for(const k of ['p3','plan','front','end','sym']){ if(!lay[k]) continue; const [x,y,vw,vh]=lay[k]; r.setViewport(x,h-y-vh,vw,vh); r.setScissor(x,h-y-vh,vw,vh); r.clear(); if(k==='sym') continue;
      if(k==='p3'){ meshes.forEach(m=>m.material=mats.shade); edges.forEach(e=>e.material=mats.edge3); hids.forEach(e=>e.visible=false); group.rotation.set(st.rx,st.ry,0); persp.aspect=vw/vh; persp.position.set(0,0,size*3.4); persp.lookAt(0,0,0); persp.updateProjectionMatrix(); r.render(scene,persp); }
      else { meshes.forEach(m=>m.material=mats.flat); edges.forEach(e=>e.material=mats.edge); hids.forEach(e=>e.visible=showH); group.rotation.set(0,0,0); r.render(scene,orthoCam(k,vw/vh)); } }
    r.setScissorTest(false); group.rotation.set(st.rx,st.ry,0); }
  const onTheme=()=>{ Object.values(mats).forEach(m=>m.dispose()); makeMats(); build(); }; window.addEventListener('themechange',onTheme);
  const stop=LK.loop(()=>{ if(!layout) return; if(!drag&&!LK.reduce()) st.ry+=.003; const lay=Object.assign({},layout); if(st.quiz&&!st.quiz.done) delete lay[st.quiz.view]; renderViews(renderer,W,H,lay,st.hidden); overlay(); if(st.quiz&&!st.quiz.done){ const ctx=ov.getContext('2d'); const [x,y,w,h]=layout[st.quiz.view]; ctx.fillStyle=LK.P().bg; ctx.fillRect(x+1,y+1,w-2,h-2); LK.text(ctx,'?',x+w/2,y+h/2,{align:'center',size:40,weight:800,color:LK.P().brand}); } });
  function snap(view){ const r=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); r.setSize(200,160); const lay={}; lay[view]=[0,0,200,160]; renderViews(r,200,160,lay,st.hidden); const url=r.domElement.toDataURL(); r.dispose(); try{ r.forceContextLoss(); }catch(e){} return url; }
  function quiz(){ const views=['plan','front','end']; const view=views[Math.floor(Math.random()*3)]; const cur=st.m; const opts=[];
    views.forEach(v=>opts.push({url:snap(v),ok:v===view,lbl:`the ${v==='end'?'end view':v==='plan'?'plan':'front view'} of this model`}));
    const other=(cur+1+Math.floor(Math.random()*(models.length-1)))%models.length; st.m=other; build(); opts.push({url:snap(view),ok:false,lbl:`the ${view} of a different model (${models[other].n})`}); st.m=cur; build();
    const uniq=[]; opts.forEach(o=>{ if(!uniq.some(u=>u.url===o.url)) uniq.push(o); else if(o.ok){ uniq.forEach(u=>{ if(u.url===o.url) u.ok=true; }); } });
    uniq.sort(()=>Math.random()-.5); st.quiz={view,done:false};
    const name=view==='end'?'END VIEW':view==='plan'?'PLAN':'FRONT VIEW';
    qEl.innerHTML=`<div class="card" style="margin-top:12px"><b>Which drawing is the ${name} of this model?</b> <span class="muted">(Its box is hidden above.)</span><div class="row" style="margin-top:10px">${uniq.map((o,i)=>`<button type="button" class="btn" data-i="${i}" style="padding:4px;height:auto"><img src="${o.url}" width="150" height="120" alt="Option ${i+1}" style="display:block;border-radius:6px"></button>`).join('')}</div><div class="qa" style="margin-top:10px"></div></div>`;
    qEl.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ const o=uniq[+b.dataset.i]; qEl.querySelectorAll('[data-i]').forEach(x=>{ x.disabled=true; if(uniq[+x.dataset.i].ok) x.style.outline='3px solid var(--good)'; }); if(!o.ok) b.style.outline='3px solid var(--bad)'; qEl.querySelector('.qa').innerHTML=o.ok?'<b style="color:var(--good)">Correct!</b>':`<b style="color:var(--bad)">Not quite</b> – that was ${o.lbl}. Remember: plan = looking down from above; front = looking straight at the front; end = looking from the right-hand side.`; st.quiz.done=true; const again=LK.el('<button class="btn btn-sm" style="margin-left:10px">Another</button>'); again.onclick=quiz; qEl.querySelector('.qa').appendChild(again); }); }
  return ()=>{ stop(); ro.disconnect(); window.removeEventListener('themechange',onTheme); renderer.dispose(); try{ renderer.forceContextLoss(); }catch(e){} };
 }});

/* ------------- isometric grid ------------- */
const VOX={
 'L-block':[[0,0,0],[1,0,0],[2,0,0],[3,0,0],[0,0,1],[1,0,1],[2,0,1],[3,0,1],[0,1,0],[0,1,1],[0,2,0],[0,2,1]],
 'Steps':[[0,0,0],[1,0,0],[2,0,0],[0,0,1],[1,0,1],[2,0,1],[0,1,0],[1,1,0],[0,1,1],[1,1,1],[0,2,0],[0,2,1]],
 'U-block':[[0,0,0],[1,0,0],[2,0,0],[0,0,1],[1,0,1],[2,0,1],[0,1,0],[0,1,1],[2,1,0],[2,1,1]],
 'Corner':[[0,0,0],[1,0,0],[2,0,0],[0,0,1],[1,0,1],[2,0,1],[0,0,2],[1,0,2],[2,0,2],[0,1,0],[1,1,0],[2,1,0],[0,1,1],[0,1,2],[0,2,0],[1,2,0],[0,2,1]],
 'T-block':[[0,0,1],[1,0,1],[2,0,1],[3,0,1],[0,1,1],[1,1,1],[2,1,1],[3,1,1],[1,0,0],[2,0,0],[1,1,0],[2,1,0],[1,0,2],[2,0,2],[1,1,2],[2,1,2]],
};
function orthoSVG(vox,view,p){ // view: front (look -z: x right, y up), plan (look -y: x right, z down), end (look -x: z left->right reversed, y up)
  const key=(a,b)=>a+','+b; const cells={}; let A=0,B=0;
  vox.forEach(([x,y,z])=>{ let a,b,d; if(view==='front'){a=x;b=y;d=z;} else if(view==='plan'){a=x;b=z;d=y;} else {a=-z;b=y;d=x;} const k=key(a,b); if(!(k in cells)||cells[k]<d) cells[k]=d; });
  const ks=Object.keys(cells).map(k=>k.split(',').map(Number)); const minA=Math.min(...ks.map(k=>k[0])), maxA=Math.max(...ks.map(k=>k[0])), minB=Math.min(...ks.map(k=>k[1])), maxB=Math.max(...ks.map(k=>k[1]));
  const u=22, W=(maxA-minA+1)*u, H=(maxB-minB+1)*u; const X=a=>(a-minA)*u, Y=b=> view==='plan'? (b-minB)*u : H-(b-minB+1)*u;
  let lines=''; const get=(a,b)=>cells[key(a,b)];
  ks.forEach(([a,b])=>{ const d=get(a,b); const x=X(a), y=Y(b); const nb=[[a-1,b,'L'],[a+1,b,'R'],[a,b+1,view==='plan'?'B':'T'],[a,b-1,view==='plan'?'T':'B']];
    nb.forEach(([na,nb2,side])=>{ const nd=get(na,nb2); if(nd===undefined||nd!==d){ if(nd!==undefined&&nd>d) return; const seg={L:[x,y,x,y+u],R:[x+u,y,x+u,y+u],T:[x,y,x+u,y],B:[x,y+u,x+u,y+u]}[side]; lines+=`<line x1="${seg[0]}" y1="${seg[1]}" x2="${seg[2]}" y2="${seg[3]}"/>`; } }); });
  return `<svg viewBox="-4 -4 ${W+8} ${H+8}" width="${W*0.9+8}" height="${H*0.9+8}" stroke="currentColor" stroke-width="2" stroke-linecap="square">${lines}</svg>`; }
LK.reg('isogrid',{title:'Isometric drawing practice',cat:'Drawing',topics:['3.3'],blurb:'Draw on an isometric dot grid with snapping lines. Work from orthographic views of a shape, then check against the answer.',
 icon:LK.ico('<path d="M50 14l30 17v34L50 82 20 65V31z"/><path d="M20 31l30 17 30-17M50 48v34"/>'),
 mount(el){
  const st={lines:[],cur:null,shape:'L-block',ans:false};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Challenge shape',options:Object.keys(VOX).map(k=>[k,k]),value:st.shape,on:v=>{st.shape=v; views(); draw();}});
  LK.btn(ctrl,'Undo',()=>{ st.lines.pop(); draw(); }); LK.btn(ctrl,'Clear',()=>{ st.lines=[]; draw(); });
  const ab=LK.btn(ctrl,'Show answer',()=>{ st.ans=!st.ans; ab.textContent=st.ans?'Hide answer':'Show answer'; draw(); });
  const vw=LK.el('<div class="row" style="gap:18px;align-items:flex-end;margin-bottom:10px;color:var(--ink)"></div>'); el.appendChild(vw);
  function views(){ const v=VOX[st.shape]; vw.innerHTML=['plan','front','end'].map(k=>`<div style="text-align:center"><div>${orthoSVG(v,k)}</div><span class="eyebrow">${k==='end'?'End view':k==='plan'?'Plan':'Front view'}</span></div>`).join(''); }
  views();
  const cv=LK.canvas(el,w=>Math.min(460,Math.max(300,w*.6)),()=>draw());
  LK.note(el,'Drag between dots to draw. Isometric lines are <b>vertical</b> or at <b>30°</b> to the horizontal; any other line is shown in red. Start with the nearest vertical corner, draw a crate (box) around the whole shape, then remove the parts you do not need. The <b>front view</b> is seen looking at the left-hand face here.');
  const sp=()=>Math.max(18,Math.min(30,cv.w/26)); const c30=Math.cos(Math.PI/6);
  const toPx=(c,r)=>({x:20+c*sp()*c30,y:16+r*sp()});
  const snapPt=(x,y)=>{ const s=sp(); const c=Math.round((x-20)/(s*c30)); let r=(y-16)/s; r= (Math.abs(c)%2)? Math.round(r-.5)+.5 : Math.round(r); return {c,r}; };
  LK.pointer(cv.cv,{down:pt=>{ const a=snapPt(pt.x,pt.y); st.cur={a,b:a}; draw(); },move:pt=>{ if(st.cur){ st.cur.b=snapPt(pt.x,pt.y); draw(); } },up:()=>{ if(st.cur&&(st.cur.a.c!==st.cur.b.c||st.cur.a.r!==st.cur.b.r)) st.lines.push(st.cur); st.cur=null; draw(); }});
  const iso=(l)=>{ const dc=l.b.c-l.a.c, dr=l.b.r-l.a.r; return dc===0 || Math.abs(Math.abs(dr)-Math.abs(dc)/2)<1e-6; };
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const s=sp();
    ctx.fillStyle=p.line2; const cols=Math.floor((w-40)/(s*c30)), rows=Math.floor((h-30)/s); for(let c=0;c<=cols;c++){ for(let r=0;r<=rows;r++){ const rr=r+((c%2)?.5:0); if(rr>rows) continue; const q=toPx(c,rr); ctx.beginPath(); ctx.arc(q.x,q.y,1.6,0,7); ctx.fill(); } }
    if(st.ans){ const v=VOX[st.shape]; const oc=2*Math.round(cols/4)-2, orr=Math.round(rows*.62); const set=new Set(v.map(q=>q.join(',')));
      const P3=(x,y,z)=>toPx(oc+(x-z),orr+((x+z)/2-y)+(((oc+(x-z))%2)?0:0));
      const order=v.slice().sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2])||(a[1]-b[1]));
      const face=(pts,col)=>{ ctx.beginPath(); pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)); ctx.closePath(); ctx.fillStyle=col; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=1; ctx.stroke(); };
      ctx.globalAlpha=.55; order.forEach(([x,y,z])=>{ if(!set.has([x,y+1,z].join(','))) face([P3(x,y+1,z),P3(x+1,y+1,z),P3(x+1,y+1,z+1),P3(x,y+1,z+1)],p.brand); if(!set.has([x+1,y,z].join(','))) face([P3(x+1,y,z),P3(x+1,y+1,z),P3(x+1,y+1,z+1),P3(x+1,y,z+1)],p.navy); if(!set.has([x,y,z+1].join(','))) face([P3(x,y,z+1),P3(x+1,y,z+1),P3(x+1,y+1,z+1),P3(x,y+1,z+1)],p.accent); }); ctx.globalAlpha=1; }
    const all=st.lines.concat(st.cur?[st.cur]:[]); all.forEach(l=>{ const a=toPx(l.a.c,l.a.r), b=toPx(l.b.c,l.b.r); const ok=iso(l); ctx.strokeStyle=ok?p.ink:p.bad; ctx.lineWidth=2.5; ctx.setLineDash(ok?[]:[6,4]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]); }); }
  return ()=>cv.ro.disconnect();
 }});

/* ------------- vernier and micrometer ------------- */
LK.reg('measure',{title:'Vernier callipers and micrometer',cat:'Drawing',topics:['3.2','3.1f'],blurb:'Read random vernier calliper and micrometer settings, type your answer and see the worked reading.',
 icon:LK.ico('<path d="M8 30h84v14H8z"/><path d="M14 44v34h12V44M60 44v24h12V44"/><path d="M20 30v-8M30 30v-5M40 30v-8M50 30v-5"/>'),
 mount(el){
  const st={tool:'vernier',res:.02,R:0,shown:false,score:0,n:0};
  const wrapRes=document.createElement('div');
  LK.subtabs(el,[['vernier','Vernier callipers'],['micro','Micrometer']],k=>{ st.tool=k; wrapRes.style.display=k==='vernier'?'':'none'; newQ(); });
  el.appendChild(wrapRes); const c0=LK.ctrl(wrapRes); LK.select(c0,{label:'Vernier resolution',options:[['0.02','0.02 mm (50 divisions)'],['0.1','0.1 mm (10 divisions)']],value:'0.02',on:v=>{st.res=+v; newQ();}});
  const cv=LK.canvas(el,w=>st.tool==='vernier'?220:240,()=>draw());
  const form=LK.el('<div class="row" style="margin-top:12px"><label class="field" style="flex-direction:row;align-items:center;gap:8px">Your reading <input type="number" step="0.01" inputmode="decimal" style="width:120px" aria-label="Your reading in mm"> mm</label><button class="btn btn-sm primary" type="button">Check</button><button class="btn btn-sm" type="button">Show me</button><button class="btn btn-sm ghost" type="button">New reading</button><span class="mono muted sc"></span></div>'); el.appendChild(form);
  const inp=form.querySelector('input'); const [bC,bS,bN]=form.querySelectorAll('button'); const scEl=form.querySelector('.sc');
  const out=LK.el('<div class="lab-note" aria-live="polite"></div>'); el.appendChild(out);
  function newQ(){ if(st.tool==='vernier'){ const steps=Math.round(1/st.res); st.R=Math.round((5+Math.random()*120)*steps)/steps; } else { st.R=Math.round(Math.random()*2400+50)/100; } st.shown=false; inp.value=''; out.innerHTML=''; draw(); }
  function explain(){ const R=st.R; if(st.tool==='vernier'){ const main=Math.floor(R+1e-9); const n=Math.round((R-main)/st.res); return `<b>Main scale:</b> the vernier zero is just past <b>${main} mm</b>. <b>Vernier:</b> line <b>${n}</b> lines up exactly with a main scale line, so add ${n} × ${st.res} = ${(n*st.res).toFixed(2)} mm. <b>Reading = ${main} + ${(n*st.res).toFixed(2)} = ${R.toFixed(2)} mm.</b>`; }
    const mm=Math.floor(R+1e-9); const half=(R-mm)>=.5-1e-9?.5:0; const th=Math.round((R-mm-half)*100); return `<b>Sleeve:</b> ${mm} mm${half?' plus a half-millimetre line (0.50 mm)':''} visible = ${(mm+half).toFixed(2)} mm. <b>Thimble:</b> division <b>${th}</b> is on the datum line = ${(th/100).toFixed(2)} mm. <b>Reading = ${(mm+half).toFixed(2)} + ${(th/100).toFixed(2)} = ${R.toFixed(2)} mm.</b>`; }
  bC.onclick=()=>{ const v=parseFloat(inp.value); if(isNaN(v)){ out.innerHTML='Type a reading in millimetres.'; return; } const tol=(st.tool==='vernier'?st.res:.01)/2+1e-6; st.n++; if(Math.abs(v-st.R)<=tol){ st.score++; out.innerHTML='<b style="color:var(--good)">Correct!</b> '+explain(); st.shown=true; } else out.innerHTML=`<b style="color:var(--bad)">Not quite</b> – try again or press “Show me”.`; scEl.textContent=`${st.score}/${st.n} correct`; draw(); };
  bS.onclick=()=>{ st.shown=true; out.innerHTML=explain(); draw(); }; bN.onclick=newQ; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') bC.click(); });
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w; const want=st.tool==='vernier'?220:240; if(cv.h!==want){ const d=cv.dpr; cv.cv.height=want*d; cv.cv.style.height=want+'px'; ctx.setTransform(d,0,0,d,0,0); cv.h=want; } const h=cv.h; ctx.clearRect(0,0,w,h);
    if(st.tool==='vernier'){ const R=st.R; const vlen=st.res===.02?49:9; const ndiv=st.res===.02?50:10; const span=vlen+12; const k=(w-40)/span; const start=R-6; const X=mm=>20+(mm-start)*k;
      // main beam
      ctx.fillStyle='#d9dde2'; ctx.fillRect(0,30,w,70); ctx.strokeStyle=p.ink; ctx.lineWidth=1; ctx.strokeRect(-1,30,w+2,70);
      ctx.fillStyle='#1d232b'; ctx.strokeStyle='#1d232b'; for(let m=Math.ceil(start);m<=start+span;m++){ const x=X(m); const L=m%10===0?30:m%5===0?22:15; ctx.beginPath(); ctx.moveTo(x,100); ctx.lineTo(x,100-L); ctx.lineWidth=1.2; ctx.stroke(); if(m%10===0) LK.text(ctx,String(m/10),x,52,{align:'center',size:14,weight:700,color:'#1d232b',mono:1}); }
      LK.text(ctx,'cm',w-24,40,{size:10,color:'#4a535e'});
      // vernier slider
      ctx.fillStyle='#b8c4d2'; ctx.fillRect(X(R)-18,100,vlen*k+36,70); ctx.strokeStyle=p.ink; ctx.strokeRect(X(R)-18,100,vlen*k+36,70);
      ctx.strokeStyle='#1d232b'; for(let i=0;i<=ndiv;i++){ const x=X(R+i*vlen/ndiv); const big=st.res===.02?i%5===0:true; ctx.beginPath(); ctx.moveTo(x,100); ctx.lineTo(x,100+(big?20:12)); ctx.lineWidth=1.1; ctx.stroke(); if(st.res===.02?i%5===0:true) LK.text(ctx,String(st.res===.02?i/5:i),x,132,{align:'center',size:11,color:'#1d232b',mono:1,weight:600}); }
      LK.text(ctx,st.res+' mm',X(R)+vlen*k+12,158,{align:'right',size:10,color:'#1d232b'});
      if(st.shown){ const n=Math.round((R-Math.floor(R+1e-9))/st.res); const x=X(R+n*vlen/ndiv); ctx.strokeStyle=p.bad; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(x,70); ctx.lineTo(x,125); ctx.stroke(); ctx.strokeStyle=p.good; ctx.beginPath(); ctx.moveTo(X(R),100); ctx.lineTo(X(R),180); ctx.stroke(); LK.text(ctx,'vernier zero',X(R),192,{align:'center',size:11,color:p.good,weight:700}); }
      LK.text(ctx,'Main scale (mm)',8,20,{size:11,color:p.muted}); LK.text(ctx,'Vernier scale',8,210,{size:11,color:p.muted}); }
    else { const R=st.R; const k=Math.min(26,(w-200)/12); const sx=30; const datum=120; const thX=sx+ (Math.min(R,25)-Math.max(0,R-9))*0+ (R- Math.max(0,Math.floor(R)-8))*k; const first=Math.max(0,Math.floor(R)-8);
      ctx.fillStyle='#d9dde2'; ctx.fillRect(0,datum-40,thX+2,80); ctx.strokeStyle=p.ink; ctx.strokeRect(-1,datum-40,thX+3,80);
      ctx.strokeStyle='#1d232b'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(0,datum); ctx.lineTo(thX,datum); ctx.stroke();
      for(let m=first;m<=R+1e-9;m+=.5){ const x=sx+(m-first)*k; if(x>thX) break; const full=Math.abs(m-Math.round(m))<1e-9; ctx.beginPath(); if(full){ ctx.moveTo(x,datum); ctx.lineTo(x,datum-(m%5===0?20:13)); if(m%5===0) LK.text(ctx,String(m),x,datum-28,{align:'center',size:12,weight:700,color:'#1d232b',mono:1}); } else { ctx.moveTo(x,datum); ctx.lineTo(x,datum+12); } ctx.stroke(); }
      // thimble
      const tw=150, th=150; const tx=thX, ty=datum-th/2; const grd=ctx.createLinearGradient(0,ty,0,ty+th); grd.addColorStop(0,'#9aa5b2'); grd.addColorStop(.5,'#e3e7ec'); grd.addColorStop(1,'#9aa5b2'); ctx.fillStyle=grd; ctx.fillRect(tx,ty,tw,th); ctx.strokeStyle=p.ink; ctx.strokeRect(tx,ty,tw,th);
      ctx.fillStyle='#c3cad2'; ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+14,ty+4); ctx.lineTo(tx+14,ty+th-4); ctx.lineTo(tx,ty+th); ctx.closePath(); ctx.fill(); ctx.stroke();
      const frac=((R*100)%50+50)%50; for(let d=0;d<50;d++){ let ph=(d-frac)/50*2*Math.PI; const c=Math.cos(ph); if(c<=0.05) continue; const y=datum - Math.sin(ph)*th/2*.95; ctx.strokeStyle='#1d232b'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(tx+14,y); ctx.lineTo(tx+14+(d%5===0?22:12),y); ctx.stroke(); if(d%5===0) LK.text(ctx,String(d),tx+46,y,{size:12*Math.max(.5,c),weight:700,color:'#1d232b',mono:1}); }
      if(st.shown){ ctx.strokeStyle=p.bad; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(tx-30,datum); ctx.lineTo(tx+60,datum); ctx.stroke(); }
      LK.text(ctx,'Sleeve: mm above the line, half-mm below',8,14,{size:11,color:p.muted}); LK.text(ctx,'Thimble: 50 divisions = 0.5 mm, each 0.01 mm',8,h-10,{size:11,color:p.muted}); } }
  return ()=>cv.ro.disconnect();
 }});

/* ------------- CNC G-code ------------- */
const GPRE={
 'Rounded rectangle':`(Rounded rectangle 60 x 40, 5 mm radius corners)
G21 G90        (mm, absolute)
M03 S12000     (spindle on)
G00 Z5
G00 X25 Y15
G01 Z-2 F300   (plunge)
G01 X75 F800
G03 X80 Y20 I0 J5
G01 Y50
G03 X75 Y55 I-5 J0
G01 X25
G03 X20 Y50 I0 J-5
G01 Y20
G03 X25 Y15 I5 J0
G00 Z5
M05            (spindle off)
G00 X0 Y0
M30`,
 'Circle and holes':`(Circle with four drilled holes)
G21 G90
M03 S10000
G00 Z5
G00 X70 Y40
G01 Z-3 F200
G02 X70 Y40 I-20 J0 F600
G00 Z5
G00 X30 Y10
G01 Z-6 F150
G00 Z5
G00 X70 Y10
G01 Z-6
G00 Z5
G00 X30 Y70
G01 Z-6
G00 Z5
G00 X70 Y70
G01 Z-6
G00 Z5
M05
G00 X0 Y0
M30`,
 'Letter T':`(Engrave a letter T)
G21 G90
M03 S15000
G00 Z5
G00 X25 Y65
G01 Z-1 F200
G01 X75 F600
G00 Z5
G00 X50 Y65
G01 Z-1
G01 Y15
G00 Z5
M05
G00 X0 Y0
M30`};
function parseG(src){ const segs=[]; let x=0,y=0,z=5,mode=0,abs=true,spin=false; const errs=[];
  src.split('\n').forEach((line,li)=>{ const l=line.replace(/\(.*?\)/g,'').replace(/;.*/,'').toUpperCase().trim(); if(!l) return; const words={}; const gs=[]; (l.match(/[A-Z]-?\d*\.?\d+/g)||[]).forEach(w=>{ const c=w[0], v=parseFloat(w.slice(1)); if(c==='G') gs.push(v); else if(c==='M'){ if(v===3||v===4) spin=true; if(v===5) spin=false; } else words[c]=v; });
    gs.forEach(g=>{ if([0,1,2,3].includes(g)) mode=g; if(g===90) abs=true; if(g===91) abs=false; });
    if(!('X' in words)&&!('Y' in words)&&!('Z' in words)) return;
    const nx='X' in words?(abs?words.X:x+words.X):x, ny='Y' in words?(abs?words.Y:y+words.Y):y, nz='Z' in words?(abs?words.Z:z+words.Z):z;
    if(mode===2||mode===3){ const cx=x+(words.I||0), cy=y+(words.J||0); const r=Math.hypot(x-cx,y-cy); let a0=Math.atan2(y-cy,x-cx), a1=Math.atan2(ny-cy,nx-cx); if(mode===2){ while(a1>=a0) a1-=2*Math.PI; } else { while(a1<=a0) a1+=2*Math.PI; } const n=Math.max(8,Math.ceil(Math.abs(a1-a0)*r/1.5)); for(let i=1;i<=n;i++){ const a=a0+(a1-a0)*i/n; const px=cx+r*Math.cos(a), py=cy+r*Math.sin(a); segs.push({x0:x,y0:y,x1:px,y1:py,z0:z,z1:nz,rapid:false,line:li,spin}); x=px; y=py; } x=nx; y=ny; z=nz; }
    else { segs.push({x0:x,y0:y,x1:nx,y1:ny,z0:z,z1:nz,rapid:mode===0,line:li,spin}); x=nx; y=ny; z=nz; } });
  return segs; }
LK.reg('cnc',{title:'CNC G-code simulator',cat:'CAD/CAM',topics:['4.1'],blurb:'Edit a CNC program and watch the cutter follow the tool path – rapid moves, cutting moves and arcs.',
 icon:LK.ico('<rect x="10" y="60" width="80" height="26"/><path d="M50 10v30M40 40h20l-4 14h-12z"/><path d="M24 74h22M54 74h20"/>'),
 mount(el){
  const st={i:0,t:0,run:true,segs:[]};
  const ctrl=LK.ctrl(el); LK.select(ctrl,{label:'Example program',options:Object.keys(GPRE).map(k=>[k,k]),value:'Rounded rectangle',on:v=>{ ta.value=GPRE[v]; load(); }});
  LK.btn(ctrl,'Run program',()=>{ load(); st.run=true; },'btn btn-sm primary'); const pb=LK.btn(ctrl,'Pause',()=>{ st.run=!st.run; pb.textContent=st.run?'Pause':'Resume'; });
  const grid=LK.el('<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:14px"></div>'); el.appendChild(grid);
  const ta=LK.el('<textarea spellcheck="false" aria-label="G-code program" style="font-family:var(--f-mono);font-size:.82rem;min-height:330px;line-height:1.5"></textarea>'); ta.value=GPRE['Rounded rectangle']; grid.appendChild(ta);
  const right=document.createElement('div'); grid.appendChild(right);
  const mq=matchMedia('(max-width: 700px)'); const lay=()=>{ grid.style.gridTemplateColumns=mq.matches?'1fr':'minmax(0,1fr) minmax(0,1.6fr)'; }; lay(); try{ mq.addEventListener('change',lay); }catch(e){}
  const cv=LK.canvas(right,w=>Math.round(w*.8));
  const ro=LK.readout(right,[['x','X'],['y','Y'],['z','Z (depth)'],['m','Move']]);
  LK.note(el,'<b>G00</b> rapid move (not cutting, dashed) · <b>G01</b> straight cutting move at feed rate <b>F</b> (mm/min) · <b>G02 / G03</b> clockwise / anticlockwise arc, with <b>I</b> and <b>J</b> giving the centre relative to the start · <b>G21</b> millimetres · <b>G90</b> absolute co-ordinates · <b>M03 / M05</b> spindle on / off · <b>S</b> spindle speed (rpm) · <b>M30</b> end of program. A negative <b>Z</b> means the cutter is below the surface of the material. CAM software generates this code from a CAD model and adds tool-diameter offsets.');
  function load(){ st.segs=parseG(ta.value); st.i=0; st.t=0; }
  load(); ta.addEventListener('input',()=>{ load(); });
  const stop=LK.loop(dt=>{ if(st.run&&st.i<st.segs.length){ const s=st.segs[st.i]; const L=Math.max(.5,Math.hypot(s.x1-s.x0,s.y1-s.y0)+Math.abs(s.z1-s.z0)); st.t+=dt*(s.rapid?140:60)/L; while(st.t>=1&&st.i<st.segs.length){ st.t-=1; st.i++; } } draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const m=24; const k=Math.min((w-2*m)/100,(h-2*m)/80); const X=v=>m+v*k, Y=v=>h-m-v*k;
    ctx.fillStyle='#d8c3a0'; ctx.fillRect(X(0),Y(80),100*k,80*k); ctx.strokeStyle=p.line2; ctx.strokeRect(X(0),Y(80),100*k,80*k);
    ctx.strokeStyle='rgba(0,0,0,.08)'; for(let i=10;i<100;i+=10){ ctx.beginPath(); ctx.moveTo(X(i),Y(0)); ctx.lineTo(X(i),Y(80)); ctx.stroke(); } for(let i=10;i<80;i+=10){ ctx.beginPath(); ctx.moveTo(X(0),Y(i)); ctx.lineTo(X(100),Y(i)); ctx.stroke(); }
    LK.text(ctx,'X →',X(100)-4,h-8,{align:'right',size:11,color:p.muted}); LK.text(ctx,'Y ↑',4,Y(80)+8,{size:11,color:p.muted}); LK.text(ctx,'0,0',X(0),h-8,{size:10,color:p.muted,mono:1});
    // planned path faint
    st.segs.forEach(s=>{ ctx.strokeStyle=s.rapid?p.muted:'rgba(0,0,0,.18)'; ctx.setLineDash(s.rapid?[4,4]:[]); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(X(s.x0),Y(s.y0)); ctx.lineTo(X(s.x1),Y(s.y1)); ctx.stroke(); }); ctx.setLineDash([]);
    // done path
    let cx=0,cy=0,cz=5,cur=null; for(let i=0;i<=Math.min(st.i,st.segs.length-1);i++){ const s=st.segs[i]; const f=i<st.i?1:Math.min(1,st.t); const ex=s.x0+(s.x1-s.x0)*f, ey=s.y0+(s.y1-s.y0)*f, ez=s.z0+(s.z1-s.z0)*f; if(!s.rapid&&Math.min(s.z0,s.z1)<0){ ctx.strokeStyle='#5a3d1e'; ctx.lineWidth=Math.max(2,3*k*.6); ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(X(s.x0),Y(s.y0)); ctx.lineTo(X(ex),Y(ey)); ctx.stroke(); if(s.x0===s.x1&&s.y0===s.y1&&ez<0){ ctx.beginPath(); ctx.arc(X(ex),Y(ey),3*k*.4,0,7); ctx.fillStyle='#5a3d1e'; ctx.fill(); } } cx=ex; cy=ey; cz=ez; cur=s; }
    ctx.lineCap='butt';
    if(st.segs.length){ ctx.beginPath(); ctx.arc(X(cx),Y(cy),Math.max(5,3*k),0,7); ctx.fillStyle=cz<0?p.accent:p.brand; ctx.globalAlpha=.85; ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=p.ink; ctx.stroke(); }
    ro({x:LK.fmt(cx,2),y:LK.fmt(cy,2),z:LK.fmt(cz,2),m:!cur?'–':st.i>=st.segs.length?'Finished':cur.rapid?'G00 rapid':cz<0?'Cutting':'Feed (in air)'}); }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ------------- anthropometrics ------------- */
const ANTH={ // approx. UK adults 19–65 (mean, SD) mm – men, women
 stature:['Stature (height)',[1755,71],[1620,62],'clear'], eye:['Eye height, standing',[1640,69],[1520,61],'either'], shoulder:['Shoulder height, standing',[1425,66],[1320,58],'either'], elbow:['Elbow height, standing',[1100,50],[1020,45],'either'],
 sit:['Sitting height',[915,36],[850,35],'clear'], pop:['Popliteal height (seat height)',[440,29],[400,27],'reach'], bpl:['Buttock–popliteal length (seat depth)',[495,32],[480,30],'reach'], hip:['Hip breadth, sitting',[360,29],[370,38],'clear'],
 shb:['Shoulder breadth',[465,28],[395,24],'clear'], reach:['Forward grip reach',[780,34],[705,31],'reach'], vreach:['Vertical grip reach, standing',[2060,80],[1910,74],'reach'], hand:['Hand length',[190,10],[175,9],'either'], handb:['Hand breadth',[87,5],[76,4],'clear']};
const erf=x=>{ const s=Math.sign(x); x=Math.abs(x); const t=1/(1+.3275911*x); const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x); return s*y; };
const cdf=(x,m,s)=>.5*(1+erf((x-m)/(s*Math.SQRT2)));
LK.reg('anthro',{title:'Percentile calculator',cat:'Human factors',topics:['5.2'],blurb:'Pick a body dimension and a design limit – the bell curve shows what percentage of users your design fits.',
 icon:LK.ico('<path d="M8 84c18 0 22-60 42-60s24 60 42 60"/><path d="M28 84V58M72 84V58" stroke-dasharray="4 4"/>'),
 mount(el){
  const st={d:'stature',pop:'both',type:'clear',v:1900};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Body dimension',options:Object.entries(ANTH).map(([k,v])=>[k,v[0]]),value:st.d,on:v=>{st.d=v; const t=ANTH[v][3]; if(t!=='either'){ st.type=t; ts.value=t; } setRange(); setP(95); }});
  LK.select(ctrl,{label:'Users',options:[['both','Men and women'],['m','Men'],['f','Women'],['c5','Children aged 5'],['c8','Children aged 8'],['c11','Children aged 11'],['all','Everyone (adults and children 5–11)']],value:st.pop,on:v=>{st.pop=v; setP(st.type==='clear'?95:5);}});
  const ts=LK.select(ctrl,{label:'Type of design limit',options:[['clear','Clearance – people this size or smaller fit'],['reach','Reach – people this size or larger can reach']],value:st.type,on:v=>{st.type=v; setP(v==='clear'?95:5);}});
  const sl=LK.slider(ctrl,{label:'Design value',min:0,max:1,value:0,fmt:v=>v+' mm',on:v=>{st.v=v; draw();}});
  const c2=LK.ctrl(el); [5,50,95].forEach(pp=>LK.btn(c2,`Set to ${pp}th percentile`,()=>setP(pp)));
  const cv=LK.canvas(el,w=>Math.min(320,Math.max(230,w*.4)),()=>draw());
  const ro=LK.readout(el,[['acc','Users accommodated'],['p5','5th percentile'],['p50','50th percentile'],['p95','95th percentile']]);
  const note=LK.note(el,'');
  const CH={c5:[1110,47],c8:[1290,55],c11:[1450,68]}; const AD=1688;
  const child=(A,c)=>{ if(A===ANTH.stature) return CH[c]; const k=CH[c][0]/AD; return [Math.round((A[1][0]+A[2][0])/2*k),Math.round((A[1][1]+A[2][1])/2*k*1.05)]; };
  const dist=()=>{ const A=ANTH[st.d]; if(CH[st.pop]) return [child(A,st.pop)]; if(st.pop==='all') return [A[1],A[2],child(A,'c5'),child(A,'c8'),child(A,'c11')]; return st.pop==='m'?[A[1]]:st.pop==='f'?[A[2]]:[A[1],A[2]]; };
  const pct=(x)=>{ const ds=dist(); return ds.reduce((a,[m,s])=>a+cdf(x,m,s),0)/ds.length; };
  const inv=q=>{ let lo=0,hi=3000; for(let i=0;i<60;i++){ const mid=(lo+hi)/2; if(pct(mid)<q) lo=mid; else hi=mid; } return (lo+hi)/2; };
  function setRange(){ const ds=dist(); const lo=Math.max(0,Math.min(...ds.map(d=>d[0]-4*d[1]))), hi=Math.max(...ds.map(d=>d[0]+4*d[1])); sl.input.min=Math.round(lo); sl.input.max=Math.round(hi); }
  function setP(pp){ setRange(); const v=Math.round(inv(pp/100)); st.v=v; sl.set(v); draw(); }
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const A=ANTH[st.d]; const lo=+sl.input.min, hi=+sl.input.max; const X=v=>30+(v-lo)/(hi-lo)*(w-60);
    const ds=dist(); const pdf=x=>ds.reduce((a,[m,s])=>a+Math.exp(-((x-m)**2)/(2*s*s))/(s*Math.sqrt(2*Math.PI)),0)/ds.length; let pm=0; for(let x=lo;x<=hi;x+=(hi-lo)/200) pm=Math.max(pm,pdf(x)); const Y=v=>h-34-v/pm*(h-70);
    const fill=(a,b,col)=>{ ctx.beginPath(); ctx.moveTo(X(a),Y(0)); for(let x=a;x<=b;x+=(hi-lo)/300) ctx.lineTo(X(x),Y(pdf(x))); ctx.lineTo(X(b),Y(0)); ctx.closePath(); ctx.fillStyle=col; ctx.fill(); };
    const v=st.v; if(st.type==='clear'){ fill(lo,v,p.goodSoft); fill(v,hi,p.badSoft); } else { fill(lo,v,p.badSoft); fill(v,hi,p.goodSoft); }
    ctx.beginPath(); for(let x=lo;x<=hi;x+=(hi-lo)/300){ const yy=Y(pdf(x)); x===lo?ctx.moveTo(X(x),yy):ctx.lineTo(X(x),yy); } ctx.strokeStyle=p.brand; ctx.lineWidth=2.5; ctx.stroke();
    if(ds.length===2){ ds.forEach(([m,s],i)=>{ ctx.beginPath(); for(let x=lo;x<=hi;x+=(hi-lo)/200){ const yy=Y(Math.exp(-((x-m)**2)/(2*s*s))/(s*Math.sqrt(2*Math.PI))/2); x===lo?ctx.moveTo(X(x),yy):ctx.lineTo(X(x),yy); } ctx.strokeStyle=i?p.accent:p.navy; ctx.setLineDash([4,4]); ctx.lineWidth=1.2; ctx.stroke(); ctx.setLineDash([]); }); LK.text(ctx,'– – men',w-110,14,{size:11,color:p.navy}); LK.text(ctx,'– – women',w-110,30,{size:11,color:p.accent}); }
    ctx.strokeStyle=p.ink; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(X(v),12); ctx.lineTo(X(v),h-34); ctx.stroke(); LK.text(ctx,v+' mm',X(v),10+0,{align:X(v)>w-60?'right':'center',size:12,weight:700,mono:1,bg:p.surface});
    ctx.strokeStyle=p.line2; ctx.beginPath(); ctx.moveTo(20,h-34); ctx.lineTo(w-20,h-34); ctx.stroke(); for(let t=Math.ceil(lo/50)*50;t<=hi;t+=((hi-lo)>600?200:(hi-lo)>200?50:10)){ LK.text(ctx,String(t),X(t),h-20,{align:'center',size:10,color:p.muted,mono:1}); }
    const q=pct(v); const acc=st.type==='clear'?q:1-q; const ps=[5,50,95].map(x=>Math.round(inv(x/100)));
    ro({acc:LK.fmt(acc*100,1)+'%',p5:ps[0]+' mm',p50:ps[1]+' mm',p95:ps[2]+' mm'});
    note.innerHTML=`Green = users who fit, red = users excluded. Designers usually aim to accommodate <b>90%</b> of users (5th to 95th percentile). For <b>clearances</b> (doorways, seat width, headroom) design for the <b>95th percentile of the larger users</b>; for <b>reach</b> (shelf height, controls, seat height) design for the <b>5th percentile of the smaller users</b>; adjustable products cover a range. <span class="muted">Data: approximate values for UK adults aged 19–65 from published anthropometric tables. Child statures are approximate UK averages for boys and girls; other child dimensions are estimated by scaling adult proportions, so treat them as rough – children’s proportions differ from adults’ (for example larger heads and shorter legs). For products used by children, designers often take the 95th percentile of the oldest child for clearances and the 5th percentile of the youngest child for reach.</span>`; }
  setP(95);
  return ()=>cv.ro.disconnect();
 }});
})();
