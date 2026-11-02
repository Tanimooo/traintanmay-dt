/* Materials and processes labs */
(function(){
'use strict';
const LK=window.LK;

/* ------------- materials explorer ------------- */
const MATS=[
 // name, cat, density kg/m3, tensile MPa, E GPa, cost £/kg (indicative), hardness 1-10, conducts?, uses
 ['Oak','Hardwood',700,90,11,3,6,0,'Furniture, flooring, boat building – strong, hard, attractive grain'],
 ['Ash','Hardwood',680,100,12,3,6,0,'Tool handles, sports equipment, bent furniture – tough and flexible'],
 ['Beech','Hardwood',720,100,13,2.5,6,0,'Toys, kitchen utensils, chairs – close grain, steam bends well'],
 ['Balsa','Hardwood',150,15,3,15,1,0,'Model aircraft, prototypes – very light, soft and weak'],
 ['Pine','Softwood',500,70,9,1,3,0,'Construction, cheap furniture – light, easy to work, knotty'],
 ['MDF','Manufactured board',750,15,3.5,0.6,3,0,'Flat-pack furniture, formers for vacuum forming – smooth, stable'],
 ['Plywood','Manufactured board',600,40,8,1.2,4,0,'Furniture, boats, packaging crates – strong in all directions'],
 ['Mild steel','Ferrous metal',7850,400,210,0.8,6,1,'Car bodies, nuts and bolts, structures – tough, cheap, rusts'],
 ['High carbon steel','Ferrous metal',7850,800,210,1.2,8,1,'Cutting tools, springs, chisels – very hard once hardened'],
 ['Stainless steel','Ferrous metal',8000,600,193,3,7,1,'Cutlery, sinks, surgical tools – corrosion resistant'],
 ['Cast iron','Ferrous metal',7200,200,110,0.6,7,1,'Vices, engine blocks, manhole covers – hard, brittle, good in compression'],
 ['Aluminium alloy','Non-ferrous metal',2700,300,70,2.5,4,1,'Drinks cans, bike frames, aircraft – light, corrosion resistant'],
 ['Copper','Non-ferrous metal',8960,220,120,8,3,1,'Electrical wire, pipes – excellent conductor, ductile'],
 ['Brass','Non-ferrous metal',8500,350,100,6,5,1,'Plumbing fittings, instruments, locks – casts and machines well'],
 ['Titanium alloy','Non-ferrous metal',4500,900,114,25,7,1,'Aerospace, hip joints, high-end bike frames – strong and light'],
 ['ABS','Thermoplastic',1050,40,2.3,2.5,4,0,'Toys (building bricks), phone cases, kettles – tough, glossy'],
 ['Acrylic (PMMA)','Thermoplastic',1180,70,3.1,3,5,0,'Signs, light diffusers, display cases – clear, scratches, brittle'],
 ['HDPE','Thermoplastic',960,30,1,1.4,3,0,'Milk bottles, bowls, pipes – tough, chemical resistant'],
 ['LDPE','Thermoplastic',920,12,0.25,1.4,2,0,'Carrier bags, squeezy bottles, cable insulation – flexible'],
 ['Polypropylene','Thermoplastic',905,33,1.5,1.3,3,0,'Living hinges, food containers, chairs – fatigue resistant'],
 ['PVC (rigid)','Thermoplastic',1400,50,3,1.2,4,0,'Window frames, pipes, guttering – weather resistant'],
 ['HIPS','Thermoplastic',1050,30,2,1.5,3,0,'Vacuum-formed packaging, model making – easy to form'],
 ['PET','Thermoplastic',1380,55,2.8,1.3,4,0,'Drinks bottles, food trays, fibres – clear, recyclable'],
 ['Nylon','Thermoplastic',1140,75,2.8,3.5,4,0,'Gears, bearings, zip ties – low friction, tough'],
 ['PLA','Thermoplastic',1240,55,3.5,2.5,4,0,'3D printing filament, compostable packaging – plant-based'],
 ['Epoxy resin','Thermoset',1200,60,3,6,5,0,'Adhesives, matrix for carbon fibre, PCB boards'],
 ['Polyester resin','Thermoset',1200,50,3.5,3,5,0,'Matrix for GRP boat hulls, casting, car repair'],
 ['Urea formaldehyde','Thermoset',1500,50,9,2,7,0,'Electrical sockets and plugs – hard, insulator'],
 ['Melamine formaldehyde','Thermoset',1500,60,9,2,7,0,'Kitchen worktop laminates, picnic ware – hard, heat resistant'],
 ['GRP (glass fibre)','Composite',1800,200,20,5,5,0,'Boat hulls, car bodies, kayaks – strong, can be moulded'],
 ['CFRP (carbon fibre)','Composite',1600,1500,150,40,6,1,'F1 cars, bike frames, tennis racquets – very high strength-to-weight'],
 ['Kevlar composite','Composite',1400,1200,70,40,5,0,'Body armour, helmets, kayaks – very tough, impact resistant'],
 ['Concrete','Composite',2400,3,30,0.1,6,0,'Buildings – strong in compression, weak in tension (reinforce with steel)'],
 ['Soda-lime glass','Ceramic',2500,40,70,1,7,0,'Windows, bottles – transparent, hard, brittle'],
];
const CATS=['Hardwood','Softwood','Manufactured board','Ferrous metal','Non-ferrous metal','Thermoplastic','Thermoset','Composite','Ceramic'];
const CCOL=['#9a6b3f','#c9a46a','#b8875a','#5a6b7d','#9aa7b5','#1f8ad0','#7b4bc4','#d9822b','#3aa58a'];
const PROPS={density:['Density','kg/m³',2],strength:['Tensile strength','MPa',3],stiff:['Stiffness (Young’s modulus)','GPa',4],cost:['Cost (indicative)','£/kg',5],sstr:['Strength-to-weight','kN·m/kg',-1],hard:['Hardness (relative)','1–10',6]};
const pv=(m,k)=>k==='sstr'? m[3]/m[2]*1000 : m[PROPS[k][2]];
LK.reg('materials',{title:'Materials property explorer',cat:'Materials',topics:['1.1','1.2','1.3','1.4','2.1'],blurb:'Plot any two properties of 35 materials against each other, Ashby-chart style, and compare families of materials.',
 icon:LK.ico('<path d="M12 88V12M12 88h76"/><circle cx="30" cy="68" r="5"/><circle cx="46" cy="52" r="5"/><circle cx="68" cy="30" r="5"/><circle cx="74" cy="60" r="5"/>'),
 mount(el){
  const st={x:'density',y:'strength',sel:null,on:new Set(CATS),hover:null};
  const ctrl=LK.ctrl(el); const opts=Object.entries(PROPS).map(([k,v])=>[k,v[0]]);
  LK.select(ctrl,{label:'Horizontal axis',options:opts,value:st.x,on:v=>{st.x=v;draw();}});
  LK.select(ctrl,{label:'Vertical axis',options:opts,value:st.y,on:v=>{st.y=v;draw();}});
  const leg=LK.el('<div class="row" style="gap:6px;margin-bottom:10px;flex-wrap:wrap"></div>'); el.appendChild(leg);
  CATS.forEach((c,i)=>{ const b=LK.el(`<button type="button" class="chip" aria-pressed="true" style="cursor:pointer;border-color:${CCOL[i]}"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${CCOL[i]}"></span>${c}</button>`); b.onclick=()=>{ if(st.on.has(c)) st.on.delete(c); else st.on.add(c); b.style.opacity=st.on.has(c)?1:.4; b.setAttribute('aria-pressed',st.on.has(c)); draw(); }; leg.appendChild(b); });
  const cv=LK.canvas(el,w=>Math.min(460,Math.max(320,w*.6)),()=>draw());
  const card=LK.el('<div class="card" style="margin-top:12px"><span class="muted">Tap or click a point to see that material’s properties and uses. Both axes use a logarithmic scale, like the Ashby charts used by engineers.</span></div>'); el.appendChild(card);
  let pts=[];
  const pick=pt=>{ let b=null,bd=16; pts.forEach(q=>{ const d=Math.hypot(q.x-pt.x,q.y-pt.y); if(d<bd){bd=d;b=q;} }); return b; };
  LK.pointer(cv.cv,{down:pt=>{ const q=pick(pt); if(q){ st.sel=q.m; show(q.m); draw(); } },hover:pt=>{ const q=pick(pt); const n=q?q.m:null; if(n!==st.hover){ st.hover=n; cv.cv.style.cursor=q?'pointer':'default'; draw(); } }});
  function show(m){ const c=CATS.indexOf(m[1]); card.innerHTML=`<div class="row" style="justify-content:space-between"><h3 style="margin:0">${m[0]}</h3><span class="chip" style="border-color:${CCOL[c]}">${m[1]}</span></div><p style="margin:8px 0">${m[8]}</p><div class="readout">${[['Density',m[2].toLocaleString()+' kg/m³'],['Tensile strength',m[3]+' MPa'],['Young’s modulus',m[4]+' GPa'],['Strength-to-weight',LK.fmt(m[3]/m[2]*1000,0)+' kN·m/kg'],['Hardness (relative)',m[6]+'/10'],['Electrical',m[7]?'Conductor':'Insulator'],['Cost (indicative)','£'+m[5]+'/kg']].map(([a,b])=>`<div><b>${b}</b><span>${a}</span></div>`).join('')}</div>`; }
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const L=58,R=16,T=16,B=46;
    const vis=MATS.filter(m=>st.on.has(m[1])); const lin=k=>k==='hard';
    const rng=k=>{ const v=MATS.map(m=>pv(m,k)); let a=Math.min(...v), b=Math.max(...v); if(lin(k)) return [0,10.5]; return [Math.pow(10,Math.floor(Math.log10(a)*2)/2),Math.pow(10,Math.ceil(Math.log10(b)*2)/2)]; };
    const [x0,x1]=rng(st.x), [y0,y1]=rng(st.y);
    const X=v=>L+(lin(st.x)?(v-x0)/(x1-x0):(Math.log10(v)-Math.log10(x0))/(Math.log10(x1)-Math.log10(x0)))*(w-L-R);
    const Y=v=>h-B-(lin(st.y)?(v-y0)/(y1-y0):(Math.log10(v)-Math.log10(y0))/(Math.log10(y1)-Math.log10(y0)))*(h-T-B);
    ctx.strokeStyle=p.line; ctx.lineWidth=1;
    const ticks=(a,b,l)=>{ if(l){ const t=[]; for(let i=0;i<=10;i+=2) t.push(i); return t; } const t=[]; for(let e=Math.floor(Math.log10(a));e<=Math.ceil(Math.log10(b));e++){ [1,3].forEach(m=>{ const v=m*Math.pow(10,e); if(v>=a*0.999&&v<=b*1.001) t.push(v); }); } return t; };
    const fmtT=v=>v>=1000?(v/1000)+'k':String(+v.toPrecision(2));
    ticks(x0,x1,lin(st.x)).forEach(v=>{ const x=X(v); ctx.beginPath(); ctx.moveTo(x,T); ctx.lineTo(x,h-B); ctx.stroke(); LK.text(ctx,fmtT(v),x,h-B+12,{align:'center',size:11,color:p.muted,mono:1}); });
    ticks(y0,y1,lin(st.y)).forEach(v=>{ const y=Y(v); ctx.beginPath(); ctx.moveTo(L,y); ctx.lineTo(w-R,y); ctx.stroke(); LK.text(ctx,fmtT(v),L-6,y,{align:'right',size:11,color:p.muted,mono:1}); });
    LK.text(ctx,PROPS[st.x][0]+' ('+PROPS[st.x][1]+')',(L+w-R)/2,h-12,{align:'center',size:12,color:p.ink2,weight:600});
    ctx.save(); ctx.translate(14,(T+h-B)/2); ctx.rotate(-Math.PI/2); LK.text(ctx,PROPS[st.y][0]+' ('+PROPS[st.y][1]+')',0,0,{align:'center',size:12,color:p.ink2,weight:600}); ctx.restore();
    // family envelopes
    CATS.forEach((c,i)=>{ if(!st.on.has(c)) return; const ms=vis.filter(m=>m[1]===c); if(ms.length<2) return; const xs=ms.map(m=>X(pv(m,st.x))), ys=ms.map(m=>Y(pv(m,st.y))); const cx=(Math.min(...xs)+Math.max(...xs))/2, cy=(Math.min(...ys)+Math.max(...ys))/2; const rx=(Math.max(...xs)-Math.min(...xs))/2+14, ry=(Math.max(...ys)-Math.min(...ys))/2+14; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,7); ctx.fillStyle=CCOL[i]; ctx.globalAlpha=.1; ctx.fill(); ctx.globalAlpha=.5; ctx.strokeStyle=CCOL[i]; ctx.stroke(); ctx.globalAlpha=1; });
    pts=vis.map(m=>({m,x:X(pv(m,st.x)),y:Y(pv(m,st.y))}));
    pts.forEach(q=>{ const c=CCOL[CATS.indexOf(q.m[1])]; ctx.beginPath(); ctx.arc(q.x,q.y,q.m===st.sel?8:6,0,7); ctx.fillStyle=c; ctx.fill(); ctx.strokeStyle=q.m===st.sel?p.ink:p.surface; ctx.lineWidth=2; ctx.stroke(); });
    pts.forEach(q=>{ if(q.m===st.sel||q.m===st.hover||pts.length<=12) LK.text(ctx,q.m[0],q.x+9,q.y-9,{size:q.m===st.sel||q.m===st.hover?12:10,weight:q.m===st.sel?700:500,color:q.m===st.sel||q.m===st.hover?p.ink:p.muted}); }); }
  return ()=>cv.ro.disconnect();
 }});

/* ------------- stress strain ------------- */
const SS={
 mild:{n:'Mild steel',E:210,c:[[0,0],[.119,250],[.2,238],[.6,245],[1.5,250],[3,300],[6,360],[10,405],[15,420],[19,405],[22,380],[25,330]],ey:.119,eu:15,ef:25,ys:250,uts:420,desc:'Ductile with a clear <b>yield point</b> – the stress drops slightly and the steel stretches at almost constant stress before <b>work hardening</b> raises it to the UTS. Then <b>necking</b> starts and it fractures.'},
 hcs:{n:'High carbon steel (hardened)',E:210,c:[[0,0],[.33,700],[.6,780],[1.5,840],[4,890],[7,900],[9,870],[10,830]],ey:.33,eu:7,ef:10,ys:700,uts:900,desc:'Very strong and hard but much <b>less ductile</b> than mild steel – little plastic deformation before fracture.'},
 al:{n:'Aluminium alloy',E:70,c:[[0,0],[.38,265],[.7,285],[2,300],[6,310],[10,310],[12,295],[14,270]],ey:.38,eu:9,ef:14,ys:270,uts:310,desc:'No sharp yield point, so engineers use the <b>0.2% proof stress</b>. Lower stiffness than steel (the elastic line is less steep) but only a third of the density.'},
 ci:{n:'Grey cast iron',E:110,c:[[0,0],[.1,105],[.2,170],[.35,200],[.45,210]],ey:.45,eu:.45,ef:.45,ys:null,uts:210,desc:'<b>Brittle</b> – it fractures with almost no plastic deformation and no necking. Strong in compression but weak in tension.'},
 acr:{n:'Acrylic (PMMA)',E:3.1,c:[[0,0],[1,31],[2,58],[2.8,70],[3.2,72]],ey:3.2,eu:3.2,ef:3.2,ys:null,uts:72,desc:'A <b>brittle</b> thermoplastic at room temperature – it snaps rather than stretching. Much lower stiffness than metals.'},
 pp:{n:'Polypropylene',E:1.5,c:[[0,0],[2,26],[5,33],[10,30],[20,24],[100,24],[250,27],[400,34],[450,35]],ey:5,eu:5,ef:450,ys:33,uts:35,desc:'A <b>ductile</b> polymer – after yielding it forms a neck that travels along the specimen as the molecular chains line up (<b>cold drawing</b>), so it stretches hundreds of per cent.'},
 rub:{n:'Natural rubber',E:.002,c:[[0,0],[50,.9],[100,1.4],[200,2],[300,3],[400,5],[500,9],[600,15],[650,18]],ey:650,eu:650,ef:650,ys:null,uts:18,desc:'An <b>elastomer</b>: the curve is not a straight line but the behaviour is <b>elastic</b> – it returns to its original length when the load is removed, even after huge strains.'}
};
const interp=(c,x)=>{ for(let i=1;i<c.length;i++){ if(x<=c[i][0]){ const [x0,y0]=c[i-1],[x1,y1]=c[i]; return y0+(y1-y0)*(x-x0)/(x1-x0); } } return c[c.length-1][1]; };
LK.reg('stressstrain',{title:'Stress–strain explorer',cat:'Materials',topics:['2.1'],blurb:'Pull a test specimen and watch the stress–strain graph: elastic region, yield, work hardening, necking and fracture.',
 icon:LK.ico('<path d="M12 88V12M12 88h76"/><path d="M14 86L26 40l6 4 20-12 16 2 12 14"/><circle cx="80" cy="48" r="3"/>'),
 mount(el){
  const st={m:'mild',e:0,zoom:false};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Material',options:Object.entries(SS).map(([k,v])=>[k,v.n]),value:st.m,on:v=>{st.m=v; st.e=0; sl.setMax(1000); sl.set(0); draw();}});
  const sl=LK.slider(ctrl,{label:'Pull (strain)',min:0,max:1000,value:0,fmt:v=>LK.fmt(v/1000*SS[st.m].ef,2)+' %',on:v=>{st.e=v/1000*SS[st.m].ef; draw();}});
  LK.btn(ctrl,'Run test',()=>{ let v=0; const id=setInterval(()=>{ v+=8; if(v>1000){ clearInterval(id); v=1000; } sl.set(v); st.e=v/1000*SS[st.m].ef; draw(); },16); });
  LK.check(ctrl,'Zoom into elastic region',false,v=>{st.zoom=v; draw();});
  const cv=LK.canvas(el,w=>w<620?480:340,()=>draw());
  const ro=LK.readout(el,[['s','Stress'],['e','Strain'],['r','Region'],['E','Young’s modulus'],['y','Yield / proof stress'],['u','UTS'],['f','Elongation at fracture'],['perm','If unloaded now']]);
  const note=LK.note(el,'');
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const M=SS[st.m]; const stack=w<620;
    const gx=56, gy=18, gw=stack?w-74:w*.62-70, gh=stack?h*.58-30:h-60;
    const xmax=st.zoom?Math.min(M.ef,M.ey*3):M.ef*1.05, ymax=Math.max(...M.c.map(q=>q[1]))*1.12;
    const X=v=>gx+v/xmax*gw, Y=v=>gy+gh-v/ymax*gh;
    ctx.strokeStyle=p.line2; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx,gy+gh); ctx.lineTo(gx+gw,gy+gh); ctx.stroke();
    for(let i=1;i<=4;i++){ ctx.strokeStyle=p.line; ctx.beginPath(); ctx.moveTo(gx,Y(ymax/1.12*i/4)); ctx.lineTo(gx+gw,Y(ymax/1.12*i/4)); ctx.stroke(); LK.text(ctx,LK.fmt(ymax/1.12*i/4,ymax<40?1:0),gx-6,Y(ymax/1.12*i/4),{align:'right',size:10,color:p.muted,mono:1}); LK.text(ctx,LK.fmt(xmax*i/4,xmax<2?2:xmax<20?1:0)+'%',X(xmax*i/4),gy+gh+12,{align:'center',size:10,color:p.muted,mono:1}); }
    LK.text(ctx,'Stress (MPa)',gx,gy-6,{size:11,color:p.muted}); LK.text(ctx,'Strain (%)',gx+gw,gy+gh+28,{align:'right',size:11,color:p.muted});
    // full curve faint
    ctx.save(); ctx.beginPath(); ctx.rect(gx,gy-4,gw+2,gh+4); ctx.clip();
    const curve=(to,col,lw)=>{ ctx.beginPath(); const steps=300; for(let i=0;i<=steps;i++){ const x=to*i/steps; const y=interp(M.c,x); i?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.stroke(); };
    curve(M.ef,p.line2,2); curve(Math.max(1e-6,st.e),p.brand,3);
    const s=interp(M.c,st.e); ctx.beginPath(); ctx.arc(X(st.e),Y(s),6,0,7); ctx.fillStyle=p.accent; ctx.fill();
    if(M.ys&&M.ey<M.ef){ ctx.setLineDash([4,4]); ctx.strokeStyle=p.muted; ctx.beginPath(); ctx.moveTo(X(M.ey),Y(0)); ctx.lineTo(X(M.ey),Y(M.ys)); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,'yield',X(M.ey)+4,Y(M.ys)-12,{size:11,color:p.ink2,weight:600}); }
    if(M.eu<M.ef){ LK.text(ctx,'UTS',X(M.eu),Y(M.uts)-12,{align:'center',size:11,color:p.ink2,weight:600}); }
    ctx.restore();
    if(st.e>=M.ef*.999){ LK.text(ctx,'✕ fracture',X(M.ef)-4,Y(interp(M.c,M.ef))+16,{align:'right',size:11,color:p.bad,weight:700}); }
    // specimen
    const sx=stack?w/2:w*.62+(w*.38)/2, sy=stack?h*.58+20:30, sh=stack?h*.42-40:h-70; const ext=Math.min(.6,st.e/Math.max(M.ef,1)*.6+(M.ef<5?st.e/M.ef*.03:0));
    const gauge=sh*.45*(1+ext*.6); const neck=st.e>M.eu&&M.eu<M.ef? (st.e-M.eu)/(M.ef-M.eu):0; const broken=st.e>=M.ef*.999;
    const top=sy+ (sh-gauge-80)/2; const W=34; ctx.fillStyle=p.line2; ctx.fillRect(sx-W/2-10,top,W+20,34); ctx.fillRect(sx-W/2-10,top+34+gauge+12,W+20,34);
    const bw=W*.55*(1-ext*.25); const gap=broken?8:0;
    const half=(y0,dir)=>{ ctx.beginPath(); const yA=top+34, yB=top+34+gauge+12; const mid=(yA+yB)/2; for(let i=0;i<=40;i++){ const t=i/40; const y=dir<0? yA+t*(mid-gap-yA) : yB-t*(yB-(mid+gap)); const dist=Math.abs(y-mid)/(mid-yA); const nw=bw/2*(1-neck*.55*Math.exp(-dist*dist*12)); i?ctx.lineTo(sx-nw,y):ctx.moveTo(sx-nw,y); } for(let i=40;i>=0;i--){ const t=i/40; const y=dir<0? yA+t*(mid-gap-yA) : yB-t*(yB-(mid+gap)); const dist=Math.abs(y-mid)/(mid-yA); const nw=bw/2*(1-neck*.55*Math.exp(-dist*dist*12)); ctx.lineTo(sx+nw,y); } ctx.closePath(); ctx.fillStyle=M===SS.rub?'#3b3b3b':(st.m==='acr'?'rgba(120,180,230,.6)':(st.m==='pp'?'#e8e2cf':'#9aa7b5')); ctx.fill(); ctx.strokeStyle=p.ink; ctx.lineWidth=1.2; ctx.stroke(); };
    half(0,-1); half(0,1);
    LK.arrow(ctx,sx,top-4,sx,top-24,p.accent,2,8); LK.arrow(ctx,sx,top+34+gauge+12+38,sx,top+34+gauge+12+58,p.accent,2,8);
    let region; if(st.e===0) region='Unloaded'; else if(broken) region='Fractured'; else if(st.e<=M.ey) region=st.m==='rub'?'Elastic (non-linear)':'Elastic'; else if(st.e<=M.eu) region='Plastic (work hardening)'; else region=st.m==='pp'?'Cold drawing (neck travels)':'Necking';
    const perm = st.e<=M.ey||broken? (broken?'Broken':'Returns to original length') : 'Permanent set ≈ '+LK.fmt(Math.max(0,st.e-s/(M.E*10)),2)+'%';
    ro({s:LK.fmt(s,s<40?1:0)+' MPa',e:LK.fmt(st.e,2)+' %',r:region,E:M.E>=1?M.E+' GPa':(M.E*1000)+' MPa',y:M.ys?M.ys+' MPa':'No clear yield',u:M.uts+' MPa',f:M.ef+' %',perm});
    note.innerHTML=M.desc+' <span class="muted">Stress = force ÷ area. Strain = extension ÷ original length. Young’s modulus = stress ÷ strain in the elastic region (the gradient – a measure of stiffness). Values are typical, not exact.</span>'; }
  return ()=>cv.ro.disconnect();
 }});

/* ------------- heat treatment ------------- */
const STEELS={mild:{n:'Mild steel (0.15% carbon)',crit:880,c:.15},med:{n:'Medium carbon steel (0.4% carbon)',crit:820,c:.4},high:{n:'High carbon / tool steel (0.9% carbon)',crit:760,c:.9}};
const TEMPER=[[220,'#f2e3ad','Pale straw','scribers, lathe tools, scrapers'],[230,'#e8cf78','Straw','drills, centre punches'],[240,'#d7a94b','Dark straw','punches, taps, reamers'],[255,'#a5733a','Brown','shears, scissors, plane irons'],[265,'#8b4a55','Brown-purple','axes, wood chisels'],[275,'#6c3b7e','Purple','cold chisels, knives'],[290,'#2f3f8c','Dark blue','springs, saws'],[300,'#3c66b0','Blue','screwdrivers, spanners'],[330,'#7d9bc2','Light blue','springs (tougher)']];
function glow(T){ const stops=[[480,[110,110,115]],[550,[70,20,20]],[650,[130,25,15]],[750,[190,40,20]],[850,[230,85,30]],[950,[255,140,40]],[1050,[255,200,80]],[1150,[255,240,170]]]; if(T<=480) return null; for(let i=1;i<stops.length;i++){ if(T<=stops[i][0]){ const [t0,c0]=stops[i-1],[t1,c1]=stops[i]; const f=(T-t0)/(t1-t0); return `rgb(${c0.map((v,k)=>Math.round(v+(c1[k]-v)*f)).join(',')})`; } } return 'rgb(255,245,200)'; }
LK.reg('heat',{title:'Heat treatment lab',cat:'Materials',topics:['3.1a','1.2'],blurb:'Heat a steel bar, watch its colour, then quench, air cool or furnace cool it – and temper it to the right colour.',
 icon:LK.ico('<rect x="10" y="40" width="80" height="20" rx="3"/><path d="M28 86c0-8 8-8 8-16M50 86c0-8 8-8 8-16M72 86c0-8 8-8 8-16"/>'),
 mount(el){
  const st={steel:'med',target:20,T:20,state:'normalised',hard:35,tough:60,duct:55,cool:null,hist:[],msg:'Choose a steel and a temperature, then press <b>Heat</b>.',proc:'As supplied (normalised)',temperCol:null,case:false};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Steel',options:Object.entries(STEELS).map(([k,v])=>[k,v.n]),value:st.steel,on:v=>{st.steel=v; reset();}});
  const ts=LK.slider(ctrl,{label:'Furnace temperature',min:100,max:1000,step:10,value:850,fmt:v=>v+' °C'});
  LK.btn(ctrl,'Heat',()=>{ st.target=ts.v; st.cool=null; st.msg=`Heating to ${ts.v} °C… then choose how to cool it.`; },'btn btn-sm primary');
  const c2=LK.ctrl(el);
  [['water','Quench in water'],['oil','Quench in oil'],['air','Cool in air'],['furnace','Cool in furnace']].forEach(([k,l])=>LK.btn(c2,l,()=>cool(k)));
  LK.btn(c2,'Case harden (carburise)',()=>caseH());
  LK.btn(c2,'Reset',()=>reset(),'btn btn-sm ghost');
  const cv=LK.canvas(el,w=>w<620?330:280,()=>{});
  const ro=LK.readout(el,[['T','Bar temperature'],['p','Result'],['h','Hardness'],['t','Toughness'],['d','Ductility']]);
  const note=LK.note(el,'');
  function reset(){ Object.assign(st,{target:20,T:20,state:'normalised',hard:STEELS[st.steel].c*60+20,tough:70-STEELS[st.steel].c*30,duct:70-STEELS[st.steel].c*40,cool:null,hist:[],proc:'As supplied (normalised)',temperCol:null,case:false,msg:'Choose a temperature and press <b>Heat</b>.'}); }
  reset();
  function cool(k){ const S=STEELS[st.steel]; const T=st.T; if(T<150){ st.msg='The bar is already cold – heat it first.'; return; }
    st.cool=k; st.target=20; const hardenable=S.c>=.3;
    if(T>=S.crit-20){
      if(k==='water'||k==='oil'){ if(!hardenable){ st.proc='Quenched – little change'; st.hard=Math.min(st.hard+8,45); st.msg='<b>Mild steel has too little carbon (under about 0.3%) to harden properly by quenching.</b> To get a hard surface on mild steel, <b>case harden</b> it instead.'; st.state='normalised'; }
        else { st.state='hardened'; st.proc='Hardened'+(k==='oil'?' (oil quench)':''); st.hard=k==='water'?(S.c>.6?95:85):(S.c>.6?88:78); st.tough=k==='water'?12:20; st.duct=5; st.temperCol=null; st.msg=`<b>Hardening:</b> heated above the upper critical temperature (about ${S.crit} °C for this steel – bright cherry red) and cooled rapidly. The steel is now very hard but <b>brittle</b>. ${k==='water'?'Water quenching is fastest but can cause cracking and distortion.':'Oil cools more slowly than water, so there is less risk of cracking.'} Next, <b>temper</b> it: clean it to bare metal, heat to 220–300 °C and quench.`; } }
      else if(k==='air'){ st.state='normalised'; st.proc='Normalised'; st.hard=S.c*60+22; st.tough=72-S.c*30; st.duct=68-S.c*40; st.msg='<b>Normalising:</b> heated above the upper critical temperature and left to cool in still air. This refines the grain structure and relieves internal stresses from working, giving a tougher, more uniform steel that is slightly harder than annealed steel.'; }
      else { st.state='annealed'; st.proc='Annealed'; st.hard=S.c*45+12; st.tough=78-S.c*25; st.duct=88-S.c*35; st.msg='<b>Annealing:</b> heated above the upper critical temperature, held (soaked), then cooled <b>very slowly</b> in the furnace. The steel is as soft and ductile as possible – easy to bend, press and machine.'; }
    } else if(T>=200&&T<=350&&st.state==='hardened'||T>=200&&T<=350&&st.state==='tempered'){
      const tc=TEMPER.reduce((a,b)=>Math.abs(b[0]-T)<Math.abs(a[0]-T)?b:a); st.temperCol=tc; st.state='tempered'; st.proc='Tempered – '+tc[2]; const f=(T-200)/150; st.hard=88-f*25; st.tough=30+f*40; st.duct=10+f*15;
      st.msg=`<b>Tempering:</b> the hardened steel was cleaned and reheated to ${T} °C. The oxide colour on the bright surface shows the temperature – <b>${tc[2].toLowerCase()}</b>, used for ${tc[3]}. Tempering removes some hardness and brittleness and makes the steel <b>tougher</b>. Higher temperature = tougher but softer.`; }
    else if(T>350&&st.state==='hardened'||T>350&&st.state==='tempered'){ st.state='tempered'; st.proc='Over-tempered'; st.hard=50; st.tough=72; st.duct=35; st.temperCol=null; st.msg='Reheating hardened steel well above about 350 °C (but below the critical temperature) tempers it a lot – it becomes tough but loses most of its hardness. Too hot for a cutting tool.'; }
    else { st.proc='No significant change'; st.msg=`Below the critical temperature (about ${S.crit} °C for this steel) the crystal structure does not change, so cooling ${k==='water'||k==='oil'?'quickly':'slowly'} makes little difference. (Low temperatures can still relieve stresses.) Try heating higher.`; } }
  function caseH(){ const S=STEELS[st.steel]; st.case=true; st.T=900; st.target=900; st.cool=null; st.state='case'; st.proc='Case hardened'; st.hard=88; st.tough=70; st.duct=45; st.temperCol=null; st.msg=`<b>Case hardening</b> (carburising): ${S.c<.3?'ideal for mild steel. ':''}The steel is heated to about 900 °C in contact with a carbon-rich material so carbon soaks into the surface, then re-heated and quenched. The result is a <b>hard, wear-resistant skin</b> with a <b>tough core</b> – used for gears, cams and hammer heads. Now quench it to finish.`; setTimeout(()=>{ st.target=20; st.cool='water'; },1200); }
  const stop=LK.loop((dt)=>{ const rate=st.cool==='water'?900:st.cool==='oil'?500:st.cool==='air'?120:st.cool==='furnace'?40:300; if(st.T<st.target) st.T=Math.min(st.target,st.T+dt*(st.target-st.T+60)*1.4); else if(st.T>st.target) st.T=Math.max(st.target,st.T-dt*rate*(st.cool?1:0.6)*(st.T>200?1:.5)); st.hist.push(st.T); if(st.hist.length>500) st.hist.shift(); draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const stack=w<620;
    const bx=24, by=stack?30:40, bw=stack?w-48:w*.5-30, bh=46;
    // furnace
    ctx.fillStyle=p.line; ctx.fillRect(bx-10,by-20,bw+20,bh+40);
    const g=glow(st.T); let col= g || '#8b95a1'; if(!g&&st.temperCol&&st.T<380) col=st.temperCol[1];
    const grd=ctx.createLinearGradient(0,by,0,by+bh); grd.addColorStop(0,col); grd.addColorStop(.5,g?col:'#c9d0d8'); grd.addColorStop(1,col);
    ctx.fillStyle=g?col:grd; if(!g&&st.temperCol&&st.T<380) ctx.fillStyle=col; ctx.fillRect(bx,by,bw,bh); ctx.strokeStyle=p.ink; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,bh);
    if(g){ ctx.save(); ctx.shadowColor=g; ctx.shadowBlur=24; ctx.fillRect(bx,by,bw,bh); ctx.restore(); }
    if(st.case){ ctx.strokeStyle=p.navy; ctx.lineWidth=4; ctx.strokeRect(bx+2,by+2,bw-4,bh-4); }
    LK.text(ctx,Math.round(st.T)+' °C',bx+bw/2,by+bh+18,{align:'center',size:13,weight:700,mono:1});
    // temp graph
    const gx=stack?40:w*.5+30, gy=stack?by+bh+44:20, gw=stack?w-60:w*.5-50, gh=stack?h-gy-28:h-50;
    ctx.strokeStyle=p.line2; ctx.strokeRect(gx,gy,gw,gh); const S=STEELS[st.steel]; const Y=v=>gy+gh-v/1100*gh;
    ctx.setLineDash([4,4]); ctx.strokeStyle=p.bad; ctx.beginPath(); ctx.moveTo(gx,Y(S.crit)); ctx.lineTo(gx+gw,Y(S.crit)); ctx.stroke(); ctx.strokeStyle=p.warn; ctx.beginPath(); ctx.moveTo(gx,Y(723)); ctx.lineTo(gx+gw,Y(723)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=p.accentSoft; ctx.fillRect(gx,Y(300),gw,Y(220)-Y(300));
    LK.text(ctx,'upper critical ≈ '+S.crit+' °C',gx+4,Y(S.crit)-8,{size:10,color:p.bad}); LK.text(ctx,'lower critical 723 °C',gx+4,Y(723)+9,{size:10,color:p.warn}); LK.text(ctx,'tempering range',gx+4,Y(260),{size:10,color:p.ink2});
    ctx.beginPath(); st.hist.forEach((v,i)=>{ const x=gx+gw*i/500; i?ctx.lineTo(x,Y(v)):ctx.moveTo(x,Y(v)); }); ctx.strokeStyle=p.brand; ctx.lineWidth=2; ctx.stroke();
    LK.text(ctx,'Temperature over time',gx,gy-8,{size:11,color:p.muted});
    if(st.temperCol&&!stack){ LK.text(ctx,'Temper colour: '+st.temperCol[2],bx,by+bh+44,{size:12,weight:600,color:p.ink}); }
    const bar=v=>Math.round(v)+'%'; ro({T:Math.round(st.T)+' °C',p:st.proc,h:bar(st.hard),t:bar(st.tough),d:bar(st.duct)}); if(note.dataset.m!==st.msg){ note.dataset.m=st.msg; note.innerHTML=st.msg; } }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ------------- corrosion ------------- */
const GAL=[['Magnesium',-1.6],['Zinc',-1.0],['Aluminium',-0.8],['Mild steel',-0.6],['Cast iron',-0.6],['Lead',-0.5],['Tin',-0.45],['Brass',-0.3],['Copper',-0.3],['Stainless steel',-0.1],['Silver',-0.05],['Gold',0.15]];
const FIN=[['Bare mild steel',1,0,'Rusts quickly all over – iron + water + oxygen → iron oxide.'],['Oiled / waxed',.35,0,'A thin barrier that slows rust but wears off and needs re-applying.'],['Painted',0.02,1,'Paint is a barrier. Once scratched, rust starts at the scratch and creeps under the paint.'],['Powder coated',0.01,.45,'A thick, tough barrier. A scratch still lets rust in, but it spreads slowly.'],['Galvanised (zinc)',0,0,'Zinc is more reactive than steel, so it corrodes instead (sacrificial protection) – even a scratch stays rust-free.'],['Stainless steel',0,0,'Chromium forms a self-healing oxide layer, so it does not rust (in normal conditions).']];
LK.reg('corrosion',{title:'Corrosion lab',cat:'Materials',topics:['3.5a','1.2'],blurb:'See which metal corrodes in a galvanic pair, and run a salt-spray test on six finishes.',
 icon:LK.ico('<rect x="14" y="14" width="72" height="72" rx="4"/><path d="M20 80L80 20"/><circle cx="36" cy="64" r="6"/><circle cx="58" cy="40" r="4"/><circle cx="66" cy="70" r="7"/>'),
 mount(el){
  const st={mode:'spray',a:'Zinc',b:'Mild steel',wk:0};
  const wrapA=document.createElement('div'), wrapB=document.createElement('div');
  LK.subtabs(el,[['spray','Salt-spray test'],['gal','Galvanic corrosion']],k=>{ st.mode=k; wrapA.style.display=k==='spray'?'':'none'; wrapB.style.display=k==='gal'?'':'none'; draw(); });
  el.appendChild(wrapA); el.appendChild(wrapB);
  const ca=LK.ctrl(wrapA); const ws=LK.slider(ca,{label:'Exposure time',min:0,max:52,value:0,fmt:v=>v+' weeks',on:v=>{st.wk=v; draw();}});
  LK.btn(ca,'Run 52 weeks',()=>{ let v=0; const id=setInterval(()=>{ v++; ws.set(v); st.wk=v; draw(); if(v>=52) clearInterval(id); },60); });
  const cb=LK.ctrl(wrapB); const opts=GAL.map(g=>[g[0],g[0]]);
  LK.select(cb,{label:'Metal A',options:opts,value:st.a,on:v=>{st.a=v; draw();}}); LK.select(cb,{label:'Metal B',options:opts,value:st.b,on:v=>{st.b=v; draw();}});
  const cv=LK.canvas(el,w=>st.mode==='spray'?(w<620?560:360):300,()=>draw());
  const note=LK.note(el,'');
  const rnd=(seed)=>()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  function draw(){ if(!cv.w) return; const p=LK.P(), ctx=cv.ctx, w=cv.w; const want=st.mode==='spray'?(w<620?560:360):300; if(cv.h!==want){ cv.o=0; const d=cv.dpr; cv.cv.height=want*d; cv.cv.style.height=want+'px'; cv.ctx.setTransform(d,0,0,d,0,0); cv.h=want; }
    const h=cv.h; ctx.clearRect(0,0,w,h);
    if(st.mode==='spray'){ const cols=w<620?2:3, rows=3/ (cols===3?1.5:1); const pw=(w-20*(cols+1))/cols, ph=(h-20-36*Math.ceil(6/cols))/Math.ceil(6/cols)-10;
      FIN.forEach((f,i)=>{ const cx=20+(i%cols)*(pw+20), cy=14+Math.floor(i/cols)*(ph+46); const base=i===5?'#c8ced6':i===4?'#a9b4bf':i===2?p.brand:i===3?'#2f7d5b':'#7b8794';
        ctx.fillStyle=base; ctx.fillRect(cx,cy,pw,ph); if(i===4){ const r=rnd(99); ctx.fillStyle='rgba(255,255,255,.25)'; for(let k=0;k<40;k++){ ctx.beginPath(); ctx.arc(cx+r()*pw,cy+r()*ph,4+r()*10,0,7); ctx.fill(); } }
        // scratch
        ctx.strokeStyle=i<2?base:'#8a929b'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx+pw*.15,cy+ph*.85); ctx.lineTo(cx+pw*.85,cy+ph*.15); ctx.stroke();
        const r=rnd(1000+i*77); const t=st.wk/52;
        if(f[1]>0){ const n=Math.round(140*Math.min(1,t*f[1]*1.6)); for(let k=0;k<n;k++){ const x=cx+r()*pw, y=cy+r()*ph, rr=(2+r()*9)*(0.4+t); ctx.beginPath(); ctx.arc(x,y,rr,0,7); ctx.fillStyle=`rgba(${150+r()*40|0},${60+r()*30|0},${20},${.55+r()*.35})`; ctx.fill(); } }
        if(f[2]>0){ const n=Math.round(60*t); for(let k=0;k<n;k++){ const u=r(); const x=cx+pw*(.15+.7*u), y=cy+ph*(.85-.7*u); const sp=f[2]*t*24; const rr=(2+r()*5)*(.5+t)*f[2]; ctx.beginPath(); ctx.arc(x+(r()-.5)*sp,y+(r()-.5)*sp,rr+1,0,7); ctx.fillStyle=`rgba(${160+r()*30|0},${70},${25},${.7})`; ctx.fill(); } }
        if(i===4&&t>.3){ const n=Math.round(30*t); for(let k=0;k<n;k++){ ctx.beginPath(); ctx.arc(cx+r()*pw,cy+r()*ph,2+r()*4,0,7); ctx.fillStyle='rgba(255,255,255,.55)'; ctx.fill(); } }
        ctx.strokeStyle=p.ink; ctx.lineWidth=1; ctx.strokeRect(cx,cy,pw,ph);
        LK.text(ctx,f[0],cx,cy+ph+12,{size:12,weight:700}); });
      note.innerHTML='Steel panels with a scratch through the finish, sprayed with salt water. '+FIN.map(f=>`<b>${f[0]}:</b> ${f[3]}`).join(' ')+' <span class="muted">Illustrative, not real test data.</span>'; }
    else { const A=GAL.find(g=>g[0]===st.a), B=GAL.find(g=>g[0]===st.b); const an=A[1]<B[1]?A:B, ca=an===A?B:A; const same=A===B||A[1]===B[1];
      const tx=w*.15, tw=w*.7, ty=60, th=h-110; ctx.fillStyle='rgba(80,150,220,.18)'; ctx.fillRect(tx,ty+30,tw,th-30); ctx.strokeStyle=p.line2; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx,ty+th); ctx.lineTo(tx+tw,ty+th); ctx.lineTo(tx+tw,ty); ctx.stroke();
      LK.text(ctx,'salt water (electrolyte)',tx+tw/2,ty+th-14,{align:'center',size:11,color:p.muted});
      const ew=Math.min(70,tw*.18); const xA=tx+tw*.25-ew/2, xB=tx+tw*.75-ew/2;
      const drawE=(x,g,isAn)=>{ ctx.fillStyle=isAn&&!same?'#9aa0a6':'#c3cad2'; ctx.fillRect(x,ty-20,ew,th-30); if(isAn&&!same){ const r=rnd(7); for(let k=0;k<26;k++){ ctx.beginPath(); ctx.arc(x+r()*ew,ty+40+r()*(th-100),2+r()*6,0,7); ctx.fillStyle='rgba(140,70,30,.7)'; ctx.fill(); } } ctx.strokeStyle=p.ink; ctx.strokeRect(x,ty-20,ew,th-30); LK.text(ctx,g[0],x+ew/2,ty-34,{align:'center',size:12,weight:700}); LK.text(ctx,same?'':isAn?'ANODE – corrodes':'CATHODE – protected',x+ew/2,ty+th-46,{align:'center',size:11,weight:700,color:isAn?p.bad:p.good,bg:p.surface}); };
      drawE(xA,A,A===an); drawE(xB,B,B===an);
      ctx.strokeStyle=p.ink2; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xA+ew/2,ty-20); ctx.lineTo(xA+ew/2,ty-48+0); ctx.moveTo(xA+ew/2,ty-48); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xA+ew/2,ty-50); ctx.lineTo(xB+ew/2,ty-50); ctx.lineTo(xB+ew/2,ty-20); ctx.stroke();
      if(!same){ const fromX=(an===A?xA:xB)+ew/2, toX=(an===A?xB:xA)+ew/2; LK.arrow(ctx,fromX+(toX>fromX?20:-20),ty-50,(fromX+toX)/2,ty-50,p.accent,2.5,9); LK.text(ctx,'electrons flow',(fromX+toX)/2,ty-64,{align:'center',size:11,color:p.accent}); }
      note.innerHTML= same?'These metals have (almost) the same position in the galvanic series, so there is little galvanic corrosion.':`<b>${an[0]}</b> is more reactive (more anodic) than <b>${ca[0]}</b>, so when they touch in an electrolyte such as salt water, the ${an[0].toLowerCase()} corrodes and protects the ${ca[0].toLowerCase()}. ${an[0]==='Zinc'||an[0]==='Magnesium'?'This is how <b>sacrificial anodes</b> on ship hulls and <b>galvanising</b> protect steel.':''} ${ca[0]==='Mild steel'?'':(an[0]==='Mild steel'||an[0]==='Cast iron'?'Here the steel is the one that corrodes faster – avoid joining steel to '+ca[0].toLowerCase()+' outdoors without insulating them.':'')} The further apart the metals are in the series, the faster the corrosion.`; } }
  return ()=>cv.ro.disconnect();
 }});

/* ------------- smart materials ------------- */
LK.reg('smart',{title:'Smart materials playground',cat:'Materials',topics:['1.7'],blurb:'Thermochromic pigment, photochromic lenses, QTC pressure sensing and shape memory alloy – change the input and see the response.',
 icon:LK.ico('<path d="M30 30h40v44a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6z"/><path d="M70 40h8a8 8 0 0 1 0 16h-8"/><path d="M40 20c0-6 6-6 6-12M54 20c0-6 6-6 6-12"/>'),
 mount(el){
  const st={mode:'thermo',temp:20,uv:0,press:0,sma:'memory',k:0,heat:false,thr:45};
  const wraps={}; const ctrls={};
  LK.subtabs(el,[['thermo','Thermochromic'],['photo','Photochromic'],['qtc','QTC'],['sma','Shape memory alloy']],k=>{ st.mode=k; Object.entries(wraps).forEach(([kk,d])=>d.style.display=kk===k?'':'none'); });
  ['thermo','photo','qtc','sma'].forEach(k=>{ wraps[k]=document.createElement('div'); el.appendChild(wraps[k]); ctrls[k]=LK.ctrl(wraps[k]); });
  LK.slider(ctrls.thermo,{label:'Temperature',min:5,max:80,value:20,fmt:v=>v+' °C',on:v=>st.temp=v}); LK.select(ctrls.thermo,{label:'Pigment changes at',options:[['45','45 °C (mug, kettle)'],['27','27 °C (forehead strip)'],['37','37 °C (baby spoon)']],value:'45',on:v=>st.thr=+v});
  LK.slider(ctrls.photo,{label:'UV light level',min:0,max:100,value:0,fmt:v=>v+'%',on:v=>st.uv=v});
  LK.slider(ctrls.qtc,{label:'Pressure on the QTC pad',min:0,max:100,value:0,fmt:v=>v+'%',on:v=>st.press=v});
  LK.btn(ctrls.sma,'1. Bend it (cold)',()=>{ st.sma='bent'; st.heat=false; }); LK.btn(ctrls.sma,'2. Heat it (pass a current)',()=>{ st.heat=true; }); LK.btn(ctrls.sma,'Cool down',()=>{ st.heat=false; });
  const cv=LK.canvas(el,w=>Math.min(320,Math.max(240,w*.42)));
  const note=LK.note(el,''); const ro=LK.readout(el,[['a','–'],['b','–']]); const roS=el.querySelectorAll('.readout span');
  const NOTES={thermo:'<b>Thermochromic pigment</b> changes colour with temperature. Leuco dyes change at a set temperature (here they become colourless to reveal the colour underneath); liquid crystals show a range of colours. Uses: warning mugs and kettles, baby spoons and bath ducks, battery testers, forehead thermometers.',photo:'<b>Photochromic</b> materials darken when exposed to ultraviolet light and clear again when the UV is removed. Uses: lenses in sunglasses, UV-sensitive beads, novelty prints.',qtc:'<b>Quantum tunnelling composite (QTC)</b>: metal particles in a polymer. With no pressure it is an insulator; as it is squeezed the particles come close enough for electrons to “tunnel” between them and the <b>resistance falls dramatically</b>. Used as a pressure switch or sensor in touch pads, robotic grippers and wearables.',sma:'<b>Shape memory alloy (Nitinol – nickel and titanium)</b> can be deformed when cool, then returns to its “remembered” shape when heated above its transition temperature (about 70 °C here) – often by passing an electric current through it. Uses: spectacle frames, medical stents, dental braces, actuators.'};
  let smaK=0; const stop=LK.loop(dt=>{ if(st.mode==='sma'){ const target=st.sma==='bent'&&!st.heat?1:0; if(st.heat&&st.sma==='bent'){ smaK=Math.max(0,smaK-dt*1.3); if(smaK===0) st.sma='memory'; } else if(st.sma==='bent'&&!st.heat) smaK=Math.min(1,smaK+dt*2.5); } draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const cx=w/2, cy=h/2;
    if(st.mode==='thermo'){ roS[0].textContent='Temperature'; roS[1].textContent='Pigment'; const t=Math.max(0,Math.min(1,(st.temp-(st.thr-3))/6));
      // mug
      const mw=Math.min(170,w*.35), mh=mw*1.05, mx=cx-mw/2-20, my=cy-mh/2+10;
      const under=p.accent; ctx.fillStyle=under; ctx.fillRect(mx,my,mw,mh); ctx.save(); ctx.globalAlpha=1-t; ctx.fillStyle='#1c1f26'; ctx.fillRect(mx,my,mw,mh); ctx.restore();
      ctx.globalAlpha=t; LK.text(ctx,'HOT!',mx+mw/2,my+mh/2,{align:'center',size:28,weight:800,color:'#fff'}); ctx.globalAlpha=1;
      ctx.lineWidth=12; ctx.strokeStyle=p.line2; ctx.beginPath(); ctx.arc(mx+mw+6,my+mh/2,mh*.26,-Math.PI/2,Math.PI/2); ctx.stroke(); ctx.lineWidth=1.5; ctx.strokeStyle=p.ink; ctx.strokeRect(mx,my,mw,mh);
      if(st.temp>45){ ctx.strokeStyle=p.muted; ctx.lineWidth=2; for(let i=0;i<3;i++){ const x=mx+mw*(.25+i*.25); ctx.beginPath(); ctx.moveTo(x,my-8); ctx.bezierCurveTo(x-10,my-22,x+10,my-30,x,my-46); ctx.stroke(); } }
      // thermometer
      const tx=w-60, ty=30, tht=h-70; ctx.fillStyle=p.surface; ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.fillRect(tx-6,ty,12,tht); ctx.strokeRect(tx-6,ty,12,tht); const lv=(st.temp-5)/75; ctx.fillStyle=p.bad; ctx.fillRect(tx-4,ty+tht*(1-lv),8,tht*lv); ctx.beginPath(); ctx.arc(tx,ty+tht+10,12,0,7); ctx.fill();
      const ythr=ty+tht*(1-(st.thr-5)/75); ctx.setLineDash([3,3]); ctx.strokeStyle=p.ink2; ctx.beginPath(); ctx.moveTo(tx-40,ythr); ctx.lineTo(tx+12,ythr); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,st.thr+'°C',tx-44,ythr,{align:'right',size:11,color:p.ink2,mono:1});
      ro({a:st.temp+' °C',b:t>=.5?'Colourless – design shows':'Coloured (black)'}); }
    if(st.mode==='photo'){ roS[0].textContent='UV level'; roS[1].textContent='Light let through'; const d=st.uv/100;
      // sun
      ctx.save(); ctx.globalAlpha=.25+.75*d; ctx.fillStyle='#f2b233'; ctx.beginPath(); ctx.arc(50,50,24,0,7); ctx.fill(); ctx.strokeStyle='#f2b233'; ctx.lineWidth=3; for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; ctx.beginPath(); ctx.moveTo(50+30*Math.cos(a),50+30*Math.sin(a)); ctx.lineTo(50+40*Math.cos(a),50+40*Math.sin(a)); ctx.stroke(); } ctx.restore();
      const lw=Math.min(140,w*.22), lh=lw*.7; [cx-lw*.62,cx+lw*.62].forEach(x=>{ ctx.beginPath(); ctx.ellipse(x,cy,lw/2,lh/2,0,0,7); ctx.fillStyle=`rgba(40,35,30,${.08+.8*d})`; ctx.fill(); ctx.strokeStyle=p.ink; ctx.lineWidth=5; ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(cx-lw*.12,cy-8); ctx.quadraticCurveTo(cx,cy-20,cx+lw*.12,cy-8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx-lw*1.12,cy-10); ctx.lineTo(cx-lw*1.45,cy-20); ctx.moveTo(cx+lw*1.12,cy-10); ctx.lineTo(cx+lw*1.45,cy-20); ctx.stroke();
      ro({a:st.uv+'%',b:Math.round(92-80*d)+'%'}); }
    if(st.mode==='qtc'){ roS[0].textContent='Resistance'; roS[1].textContent='LED'; const pr=st.press/100; const R=Math.pow(10,7-6.6*Math.pow(pr,.6)); const I=Math.min(1,9/(R+200)*40);
      ctx.strokeStyle=p.ink2; ctx.lineWidth=2.5; const L=w*.15, Rr=w*.85, T=50, B=h-50; ctx.strokeRect(L,T,Rr-L,B-T);
      // battery
      ctx.fillStyle=p.surface; ctx.fillRect(L-10,cy-26,20,52); ctx.fillStyle=p.ink; ctx.fillRect(L-14,cy-8,28,4); ctx.fillRect(L-8,cy+6,16,4); LK.text(ctx,'9 V',L-20,cy,{align:'right',size:11,mono:1});
      // QTC pad
      const qx=cx, qw=110; ctx.fillStyle=p.surface; ctx.fillRect(qx-qw/2,T-16,qw,32); ctx.fillStyle='#555'; ctx.fillRect(qx-qw/2,T-10+pr*4,qw,20-pr*8); ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.strokeRect(qx-qw/2,T-10+pr*4,qw,20-pr*8);
      const r=(s=>()=>{ s=(s*16807)%2147483647; return s/2147483647; })(5); ctx.fillStyle='#c9a24a'; for(let i=0;i<40;i++){ const x=qx-qw/2+6+r()*(qw-12), y=T-6+pr*4+r()*(12-pr*8); ctx.beginPath(); ctx.arc(x,y,2.2,0,7); ctx.fill(); }
      LK.arrow(ctx,qx,T-60,qx,T-20-pr*4+4,p.accent,3+pr*3,10); LK.text(ctx,'squeeze',qx+10,T-46,{size:11,color:p.accent}); LK.text(ctx,'QTC',qx,T+26,{align:'center',size:11,weight:700});
      // LED
      const lx=Rr, ly=cy; ctx.beginPath(); ctx.arc(lx,ly,16,0,7); ctx.fillStyle=`rgba(255,60,60,${.15+.85*I})`; ctx.fill(); if(I>.05){ ctx.save(); ctx.shadowColor='rgba(255,60,60,.9)'; ctx.shadowBlur=30*I; ctx.fill(); ctx.restore(); } ctx.strokeStyle=p.ink; ctx.stroke(); LK.text(ctx,'LED',lx+24,ly,{size:11,weight:700});
      const fr=R>=1e6?LK.fmt(R/1e6,1)+' MΩ':R>=1e3?LK.fmt(R/1e3,1)+' kΩ':LK.fmt(R,0)+' Ω'; ro({a:fr,b:I<.05?'Off':I<.5?'Dim':'Bright'}); }
    if(st.mode==='sma'){ roS[0].textContent='Wire temperature'; roS[1].textContent='Shape'; const k=smaK; const T=st.heat?85:20;
      ctx.strokeStyle=st.heat?'#e0632a':'#9aa7b5'; ctx.lineWidth=7; ctx.lineCap='round'; ctx.beginPath(); const x0=cx-w*.3, x1=cx+w*.3; for(let i=0;i<=60;i++){ const t=i/60; const x=x0+(x1-x0)*t; const y=cy+20 - k*Math.sin(t*Math.PI)*90 - k*Math.sin(t*Math.PI*3)*20; i?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.stroke(); ctx.lineCap='butt';
      if(st.heat){ ctx.save(); ctx.shadowColor='#ff7a3a'; ctx.shadowBlur=18; ctx.stroke(); ctx.restore(); }
      ctx.fillStyle=p.line2; ctx.fillRect(x0-24,cy+6,18,30); ctx.fillRect(x1+6,cy+6,18,30);
      LK.text(ctx,st.heat?'Current flowing – heating above transition temperature':'',cx,h-24,{align:'center',size:12,color:p.accent,weight:600});
      ro({a:T+' °C',b:k>.9?'Bent (deformed)':k<.05?'Remembered shape':'Recovering…'}); }
    if(note.dataset.m!==st.mode){ note.dataset.m=st.mode; note.innerHTML=NOTES[st.mode]; } }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ------------- process animator ------------- */
const PROC={
 inj:{n:'Injection moulding',t:'3.1e',steps:['Polymer granules are fed from the hopper into the barrel.','A rotating Archimedean screw carries the granules forward past heaters, which melt the polymer (about 200–300 °C).','The screw acts as a ram and injects the molten polymer into the closed, clamped mould under high pressure.','Pressure is held while the polymer cools and solidifies – the mould is water-cooled to speed up the cycle.','The moving half of the mould opens.','Ejector pins push the finished part out. The cycle repeats every few seconds – ideal for mass production.']},
 blow:{n:'Blow moulding',t:'3.1e',steps:['A hollow tube of molten polymer, called a parison, is extruded downwards between the two open halves of the mould.','The mould closes around the parison, pinching and sealing the bottom.','Compressed air is blown into the parison, inflating it against the cold walls of the mould.','The polymer cools and sets in the shape of the mould.','The mould opens and the bottle is removed. The excess (flash) is trimmed off and recycled.']},
 vac:{n:'Vacuum forming',t:'3.1e',steps:['A former (often MDF) with draft angles and rounded edges is placed on the platen, which is lowered.','A thermoplastic sheet (e.g. HIPS) is clamped in the frame and heated until soft and flexible.','The heater is moved away and the platen is raised, pushing the former into the soft sheet.','The vacuum pump removes the air from beneath the sheet – atmospheric pressure pushes it tightly over the former.','The sheet cools and hardens. The platen is lowered, the moulding is removed and the excess is trimmed.']},
 ext:{n:'Extrusion',t:'3.1e',steps:['Polymer granules are fed from the hopper into the barrel.','The rotating screw carries them past heaters and melts them.','The molten polymer is forced continuously through a shaped die.','The continuous profile (e.g. pipe, window frame, rod) is cooled by water or air and cut to length.']},
 rot:{n:'Rotational moulding',t:'3.1e',steps:['A measured amount of polymer powder is put into one half of a metal mould and the mould is closed.','The mould is heated in an oven while rotating slowly about two axes.','The powder melts and coats the inside surface of the mould evenly.','The mould moves to a cooling chamber, still rotating, so the walls set at an even thickness.','The mould is opened and the hollow, seamless product (kayak, traffic cone, water tank) is removed.']},
 sand:{n:'Sand casting',t:'3.1c',steps:['A pattern, slightly larger than the final part to allow for shrinkage, is placed in the drag (lower box) and green sand is rammed around it.','The drag is turned over and the cope (upper box) is added, with sprue and riser pins in place. More sand is rammed in.','The cope is lifted off, the pattern and pins are removed, a runner is cut, and the boxes are put back together.','Molten metal (e.g. aluminium) is poured into the sprue until it appears in the riser.','After cooling the sand is broken away and the sprue, riser and runner are cut off (fettling). The sand can be re-used.']},
 die:{n:'Die casting',t:'3.1c',steps:['The two halves of a hardened steel die are closed and clamped together.','Molten metal (aluminium or zinc alloy) is injected into the die under high pressure.','The metal cools rapidly in the water-cooled die.','The die opens and ejector pins push out the casting – excellent surface finish, thin walls, very high volumes.']},
 inv:{n:'Investment (lost wax) casting',t:'3.1c',steps:['Wax patterns are made by injecting wax into a metal die.','Several patterns are attached to a central wax sprue to make a “tree”.','The tree is repeatedly dipped in a ceramic slurry and coated in fine sand to build a shell.','The shell is heated so the wax melts and runs out (it is “lost”), then fired to harden it.','Molten metal is poured into the hot shell.','When cool the shell is broken away and the parts are cut off the tree – very fine detail and accuracy (e.g. jewellery, turbine blades).']},
 press:{n:'Press forming',t:'3.1d',steps:['A sheet metal blank is placed on the lower die (bolster).','The press drives the upper die (punch) down with great force.','The sheet is permanently deformed into the shape of the dies – e.g. car body panels, sink bowls.','The punch rises and the pressing is removed. Blanking and piercing tools cut the outline and holes.']},
};
LK.reg('moulding',{title:'Process animator',cat:'Processes',topics:['3.1e','3.1c','3.1d','1.3'],blurb:'Step through moulding, casting and pressing processes stage by stage – ideal for “describe with labelled sketches” questions.',
 icon:LK.ico('<rect x="10" y="38" width="46" height="22" rx="3"/><path d="M18 38V24h14v14"/><path d="M56 44h10v10H56"/><rect x="66" y="28" width="24" height="42"/><path d="M78 28v42"/>'),
 mount(el){
  const st={p:'inj',s:0,t:0,play:false};
  const ctrl=LK.ctrl(el);
  LK.select(ctrl,{label:'Process',options:Object.entries(PROC).map(([k,v])=>[k,v.n]),value:st.p,on:v=>{st.p=v; st.s=0; steps();}});
  LK.btn(ctrl,'← Back',()=>{ st.s=Math.max(0,st.s-1); steps(); }); LK.btn(ctrl,'Next →',()=>{ st.s=Math.min(PROC[st.p].steps.length-1,st.s+1); steps(); },'btn btn-sm primary');
  const pb=LK.btn(ctrl,'Auto-play',()=>{ st.play=!st.play; pb.textContent=st.play?'Stop':'Auto-play'; });
  const stepsEl=LK.el('<div class="steps" role="group" aria-label="Stages"></div>'); el.appendChild(stepsEl);
  const cv=LK.canvas(el,w=>Math.min(380,Math.max(250,w*.5)));
  const txt=LK.el('<div class="steptext" aria-live="polite"></div>'); el.appendChild(txt);
  function steps(){ const P=PROC[st.p]; stepsEl.innerHTML=P.steps.map((_,i)=>`<button type="button" ${i===st.s?'aria-current="step"':''}>${i+1}</button>`).join(''); stepsEl.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{ st.s=i; steps(); }); txt.innerHTML=`<b>Stage ${st.s+1}:</b> ${P.steps[st.s]}`; st.t=0; }
  steps(); let acc=0;
  const stop=LK.loop(dt=>{ st.t+=dt; if(st.play){ acc+=dt; if(acc>3.2){ acc=0; st.s=(st.s+1)%PROC[st.p].steps.length; steps(); } } draw(); });
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const s=Math.min(w/640,h/320); ctx.save(); ctx.translate((w-640*s)/2,(h-320*s)/2); ctx.scale(s,s);
    const k=Math.min(1,st.t/1.2); const S=st.s; const ink=p.ink, steel='#9aa7b5', steelD='#6f7b88', poly=p.brand, hot='#e0632a', mould='#7f8a96';
    const R=(x,y,ww,hh,f,str=ink)=>{ ctx.fillStyle=f; ctx.fillRect(x,y,ww,hh); if(str){ ctx.strokeStyle=str; ctx.lineWidth=1.5; ctx.strokeRect(x,y,ww,hh); } };
    const lab=(t,x,y,tx,ty)=>{ ctx.strokeStyle=p.muted; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(tx,ty); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,2.5,0,7); ctx.fillStyle=p.muted; ctx.fill(); LK.text(ctx,t,tx+(tx<x?-4:4),ty,{align:tx<x?'right':'left',size:13,weight:600,color:p.ink2}); };
    const gran=(x,y,ww,hh,n,seed=3)=>{ let q=seed; const r=()=>{ q=(q*16807)%2147483647; return q/2147483647; }; ctx.fillStyle=poly; for(let i=0;i<n;i++){ ctx.beginPath(); ctx.arc(x+r()*ww,y+r()*hh,3,0,7); ctx.fill(); } };
    const screw=(x,y,len,off)=>{ ctx.strokeStyle=steelD; ctx.lineWidth=3; ctx.beginPath(); for(let i=0;i<=len;i+=2){ const yy=y+Math.sin((i+off)/9)*12; i?ctx.lineTo(x+i,yy):ctx.moveTo(x+i,yy); } ctx.stroke(); ctx.fillStyle=steelD; ctx.fillRect(x,y-3,len,6); };
    const hopperBarrel=(melt,screwX=0,heat=true)=>{ ctx.fillStyle=p.line; ctx.beginPath(); ctx.moveTo(60,40); ctx.lineTo(130,40); ctx.lineTo(108,110); ctx.lineTo(82,110); ctx.closePath(); ctx.fill(); ctx.strokeStyle=ink; ctx.stroke(); gran(72,52,50,50,40);
      R(40,110,300,50,p.surface); screw(50+screwX,135,230,st.t*60); if(melt>0){ ctx.fillStyle=poly; ctx.globalAlpha=.75; ctx.fillRect(340-melt,114,melt,42); ctx.globalAlpha=1; }
      for(let i=0;i<4;i++){ R(150+i*45,104,32,6,heat?hot:'#c9b8ad',null); R(150+i*45,160,32,6,heat?hot:'#c9b8ad',null); }
      ctx.fillStyle=steel; ctx.beginPath(); ctx.moveTo(340,118); ctx.lineTo(362,128); ctx.lineTo(362,142); ctx.lineTo(340,152); ctx.closePath(); ctx.fill(); ctx.strokeStyle=ink; ctx.stroke(); };
    if(st.p==='inj'){ const open=S>=4?Math.min(1,S===4?k:1)*70:0; hopperBarrel(S>=1?Math.min(150,(S===1?k:1)*150):0, S===2?k*-20:S>2?-20:0, true);
      R(380,60,70,170,mould); R(450+open,60,70,170,mould); ctx.fillStyle=p.surface; ctx.fillRect(430,110,20,70); ctx.fillRect(450+open,110,20,70);
      ctx.fillStyle=steelD; ctx.fillRect(362,131,20,8);
      if(S>=2){ const f=S===2?k:1; ctx.fillStyle=poly; if(S<4){ ctx.fillRect(430,180-70*f,40,70*f); } }
      if(S>=3&&S<4){ ctx.fillStyle='rgba(80,150,220,.6)'; [80,200].forEach(y=>{ ctx.beginPath(); ctx.arc(400,y,6,0,7); ctx.arc(500,y,6,0,7); ctx.fill(); }); }
      if(S>=4){ const ej=S===5?k*30:0; ctx.fillStyle=steelD; ctx.fillRect(520+open,125,40,6); ctx.fillRect(520+open,160,40,6); ctx.fillRect(470+open-ej,125,50+ej,6); ctx.fillRect(470+open-ej,160,50+ej,6);
        const px=S===5?430+open-ej*1.2:430+open, py=S===5?110+k*k*60:110; ctx.fillStyle=poly; ctx.fillRect(px+(S===5?0:20),py,40,70); }
      lab('Hopper',95,50,160,30); lab('Heaters',230,104,250,80); lab('Screw',260,135,250,200); lab('Mould',415,70,470,30); if(S>=4) lab('Ejector pins',545+open,128,580,250);
      lab('Barrel',60,155,40,200); }
    if(st.p==='ext'){ hopperBarrel(S>=1?Math.min(170,(S===1?k:1)*170):0,0,true); R(362,110,26,50,steel); ctx.fillStyle=p.surface; ctx.fillRect(362,124,26,22);
      if(S>=2){ const L=S===2?k*180:220; ctx.fillStyle=poly; ctx.fillRect(388,124,L,22); ctx.strokeStyle=ink; ctx.strokeRect(388,124,L,22); ctx.fillStyle=p.surface; ctx.fillRect(388,130,L,10); }
      if(S>=3){ ctx.fillStyle='rgba(80,150,220,.3)'; ctx.fillRect(420,100,130,80); ctx.strokeStyle=p.muted; ctx.strokeRect(420,100,130,80); LK.text(ctx,'water bath',485,192,{align:'center',size:12,color:p.muted}); ctx.strokeStyle=p.bad; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(590,95); ctx.lineTo(590-k*0,175); ctx.stroke(); LK.text(ctx,'cut to length',590,82,{align:'center',size:12,color:p.bad}); }
      lab('Hopper',95,50,160,30); lab('Heaters',230,104,250,80); lab('Screw',260,135,250,210); lab('Die',375,112,380,50); }
    if(st.p==='blow'){ const close=S===0?0:S===1?k:1; const open=S===4?k:0; const gap=110-close*58+open*90;
      R(255,10,130,40,steel); LK.text(ctx,'extruder',320,30,{align:'center',size:12,color:'#fff'});
      const inflate=S>=2?(S===2?k:1):0; const pw=26+inflate*60;
      if(!(S===4&&k>.5)||true){ ctx.fillStyle=poly; ctx.globalAlpha=.85; ctx.beginPath(); ctx.moveTo(320-13,50); ctx.lineTo(320-pw/2*(inflate?1:1),110); ctx.lineTo(320-pw/2,240); ctx.lineTo(320+pw/2,240); ctx.lineTo(320+pw/2,110); ctx.lineTo(320+13,50); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=ink; ctx.stroke(); }
      ctx.fillStyle=mould; ctx.fillRect(320-gap-60,70,60,190); ctx.fillRect(320+gap,70,60,190); ctx.strokeStyle=ink; ctx.strokeRect(320-gap-60,70,60,190); ctx.strokeRect(320+gap,70,60,190);
      if(S===2||S===3){ LK.arrow(ctx,320,62,320,150,'#fff',3,9); LK.text(ctx,'air',330,90,{size:12,color:p.ink,weight:700}); }
      if(S===3){ ctx.fillStyle='rgba(80,150,220,.6)'; [110,170,230].forEach(y=>{ ctx.beginPath(); ctx.arc(320-gap-30,y,6,0,7); ctx.arc(320+gap+30,y,6,0,7); ctx.fill(); }); }
      lab('Parison',320-pw/2,180,180,200); lab('Mould halves',320+gap+60,120,460,90); if(S>=4) lab('Flash trimmed',320,245,460,280); }
    if(st.p==='vac'){ const plat=S<2?0:S===2?k:1; const heated=S===1||S===2&&k<.3; const formY=230-plat*80;
      R(120,260,400,30,p.line2); LK.text(ctx,'vacuum pump',560,275,{size:12,color:p.muted}); R(170,formY+40,300,14,steelD); // platen
      ctx.fillStyle='#b98a5a'; ctx.beginPath(); ctx.moveTo(250,formY+40); ctx.lineTo(265,formY); ctx.lineTo(375,formY); ctx.lineTo(390,formY+40); ctx.closePath(); ctx.fill(); ctx.strokeStyle=ink; ctx.stroke();
      const sheetY=140; ctx.fillStyle=steel; ctx.fillRect(150,sheetY-8,30,16); ctx.fillRect(460,sheetY-8,30,16);
      ctx.strokeStyle=poly; ctx.lineWidth=6; ctx.beginPath(); if(S<3){ const sag=heated?10:0; if(plat>0&&formY<sheetY){ ctx.moveTo(165,sheetY); ctx.quadraticCurveTo(220,sheetY,265,formY); ctx.lineTo(375,formY); ctx.quadraticCurveTo(420,sheetY,475,sheetY); } else { ctx.moveTo(165,sheetY); ctx.quadraticCurveTo(320,sheetY+sag,475,sheetY); } } else { const f=S===3?k:1; ctx.moveTo(165,sheetY); ctx.lineTo(250-0*f,sheetY+(formY+40-sheetY)*f); ctx.lineTo(265,formY); ctx.lineTo(375,formY); ctx.lineTo(390,sheetY+(formY+40-sheetY)*f); ctx.lineTo(475,sheetY); } ctx.stroke(); ctx.lineWidth=1;
      if(S===1||S===2&&k<.3){ R(170,40,300,30,hot); LK.text(ctx,'heater',320,55,{align:'center',size:12,color:'#fff',weight:700}); }
      if(S===3){ for(let i=0;i<4;i++){ LK.arrow(ctx,200+i*80,252,200+i*80,272,p.ink2,2,6); } LK.text(ctx,'air removed',320,300,{align:'center',size:12,color:p.ink2}); }
      lab('Former (draft angles)',380,formY+20,520,formY+10); lab('Thermoplastic sheet',475,sheetY,540,110); lab('Clamp frame',160,sheetY,80,110); lab('Platen',190,formY+47,80,formY+60); }
    if(st.p==='rot'){ const ang=(S===1||S===2||S===3)?st.t*1.4:0; ctx.save(); ctx.translate(320,160); ctx.rotate(ang); ctx.scale(1,1-.25*Math.abs(Math.sin(st.t*.9))*(S>=1&&S<=3?1:0));
      const open=S===4?k*40:0; ctx.fillStyle=mould; ctx.beginPath(); ctx.ellipse(0,-open,110,70,0,Math.PI,0); ctx.fill(); ctx.beginPath(); ctx.ellipse(0,open,110,70,0,0,Math.PI); ctx.fill(); ctx.strokeStyle=ink; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(0,-open,110,70,0,Math.PI,0); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0,open,110,70,0,0,Math.PI); ctx.stroke();
      ctx.fillStyle=p.surface; ctx.beginPath(); ctx.ellipse(0,0,96,58,0,0,7); ctx.fill();
      if(S===0||S===1&&k<.5){ gran(-50,30,100,22,60); }
      if(S>=2||S===1&&k>=.5){ const th=S===1?2:S===2?2+k*6:8; ctx.strokeStyle=poly; ctx.lineWidth=th; ctx.beginPath(); ctx.ellipse(0,0,96-th/2,58-th/2,0,0,7); ctx.stroke(); }
      ctx.restore(); if(S===1||S===2){ ctx.fillStyle='rgba(224,99,42,.12)'; ctx.fillRect(150,20,340,280); LK.text(ctx,'OVEN ~300 °C',170,36,{size:12,weight:700,color:hot}); } if(S===3){ ctx.fillStyle='rgba(80,150,220,.12)'; ctx.fillRect(150,20,340,280); LK.text(ctx,'COOLING (air / water spray)',170,36,{size:12,weight:700,color:p.brand}); }
      if(S>=1&&S<=3){ LK.text(ctx,'rotates about two axes ↻',320,300,{align:'center',size:12,color:p.ink2}); }
      lab('Metal mould',420,140,520,90); lab('Polymer powder → even wall',320,205,470,260); }
    if(st.p==='sand'){ const cope=S===2?Math.sin(Math.min(1,k)*Math.PI)*70:0;
      R(150,170,340,90,'#cdb68b'); if(S>=1) R(150,80-cope,340,90,'#cdb68b'); ctx.strokeStyle=ink; ctx.strokeRect(150,170,340,90); LK.text(ctx,'DRAG',160,250,{size:11,weight:700,color:ink}); if(S>=1) LK.text(ctx,'COPE',160,92-cope,{size:11,weight:700,color:ink});
      const pat=S<2||S===2&&k<.5; const metal=S>=3; const pour=S===3?k:S>3?1:0;
      if(pat){ ctx.fillStyle='#b98a5a'; ctx.fillRect(260,140-(S>=1?0:-30),120,60-(S>=1?0:30)); ctx.strokeStyle=ink; ctx.strokeRect(260,140-(S>=1?0:-30),120,60-(S>=1?0:30)); }
      if(S>=1&&pat){ ctx.fillStyle='#b98a5a'; ctx.fillRect(215,80-cope,16,62); ctx.fillRect(405,80-cope,16,62); }
      if(!pat){ ctx.fillStyle=metal?`rgba(224,99,42,${pour})`:p.surface; ctx.fillRect(260,140,120,60); ctx.fillRect(215,80-cope,16,62); ctx.fillRect(405,80-cope,16,62); ctx.fillRect(231,150,29,10); ctx.strokeStyle=ink; ctx.strokeRect(260,140,120,60); }
      if(metal&&S===3){ ctx.fillStyle='#4b525a'; ctx.beginPath(); ctx.moveTo(190,20); ctx.lineTo(240,20); ctx.lineTo(232,60); ctx.lineTo(198,60); ctx.closePath(); ctx.fill(); ctx.strokeStyle=hot; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(224,60); ctx.lineTo(223,82); ctx.stroke(); ctx.lineWidth=1; LK.text(ctx,'crucible',180,40,{align:'right',size:12,color:p.muted}); }
      if(S===4){ ctx.fillStyle='rgba(255,255,255,.7)'; ctx.fillRect(150,80,340,180); ctx.fillStyle='#b6bcc3'; ctx.fillRect(260,140,120,60); ctx.fillRect(215,80,16,62); ctx.fillRect(405,80,16,62); ctx.fillRect(231,150,29,10); ctx.strokeStyle=p.bad; ctx.setLineDash([5,4]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(205,140); ctx.lineTo(262,140); ctx.moveTo(395,140); ctx.lineTo(430,140); ctx.stroke(); ctx.setLineDash([]); LK.text(ctx,'cut off sprue and riser',320,120,{align:'center',size:12,color:p.bad,weight:600}); }
      lab(S>=2?'Mould cavity':'Pattern',320,170,560,200); if(S>=1){ lab('Sprue',223,90-cope,110,60); lab('Riser',413,90-cope,560,60); } }
    if(st.p==='die'){ const open=S===3?k*70:0; R(220,60,90,200,steelD); R(330+open,60,90,200,steelD); ctx.fillStyle=p.surface; ctx.fillRect(290,110,20,100); ctx.fillRect(330+open,110,20,100);
      R(150,150,70,20,steel); if(S>=1){ const f=S===1?k:1; if(S<3){ ctx.fillStyle=`rgba(224,99,42,${S===2?1-k*.6:1})`; ctx.fillRect(290,210-100*f,60,100*f); } LK.arrow(ctx,120,160,215,160,hot,3,10); }
      if(S===2){ ctx.fillStyle='rgba(80,150,220,.6)'; [90,230].forEach(y=>{ ctx.beginPath(); ctx.arc(250,y,7,0,7); ctx.arc(390,y,7,0,7); ctx.fill(); }); }
      if(S===3){ ctx.fillStyle='#b6bcc3'; ctx.fillRect(330+open-20-k*30,110,40,100); ctx.fillStyle=steel; ctx.fillRect(350+open-k*30,130,70,6); ctx.fillRect(350+open-k*30,185,70,6); lab('Ejector pins',420+open,133,540,260); }
      lab('Fixed die half',250,70,150,40); lab('Moving die half',390+open,70,500,40); lab('Molten metal injected',150,160,60,210); }
    if(st.p==='inv'){ const tree=(x,y,c,f=1)=>{ ctx.fillStyle=c; ctx.fillRect(x-6,y,12,150); for(let i=0;i<3;i++){ ctx.fillRect(x-40,y+30+i*40,34,14); ctx.fillRect(x+6,y+30+i*40,34,14); } };
      if(S===0){ R(200,90,120,80,steelD); ctx.fillStyle='#e6d58a'; ctx.fillRect(235,115,50,30); lab('Metal die',260,95,340,60); lab('Wax pattern',285,130,360,150); }
      if(S===1) { tree(320,60,'#e6d58a'); lab('Wax tree',326,80,420,60); }
      if(S===2){ ctx.fillStyle='#d7d2c8'; ctx.fillRect(250,150,140,130); ctx.strokeStyle=ink; ctx.strokeRect(250,150,140,130); const y=60+Math.sin(st.t*2)*20+40; ctx.save(); ctx.translate(0,y-60); tree(320,0,'#e6d58a'); ctx.restore(); lab('Ceramic slurry',380,250,480,260); }
      if(S===3){ tree(320,60,'#cfc6b6'); ctx.fillStyle='#e6d58a'; for(let i=0;i<6;i++){ ctx.beginPath(); ctx.arc(320,220+((st.t*40+i*15)%60),3,0,7); ctx.fill(); } ctx.fillStyle='rgba(224,99,42,.12)'; ctx.fillRect(220,40,200,260); lab('Wax melts out',320,240,440,270); }
      if(S===4){ tree(320,60,'#cfc6b6'); ctx.fillStyle=hot; ctx.fillRect(316,60,8,150*k); ctx.fillStyle='#4b525a'; ctx.beginPath(); ctx.moveTo(290,10); ctx.lineTo(340,10); ctx.lineTo(334,44); ctx.lineTo(298,44); ctx.closePath(); ctx.fill(); lab('Ceramic shell',360,110,460,90); }
      if(S===5){ tree(320,60,'#b6bcc3'); ctx.strokeStyle=p.bad; ctx.setLineDash([4,4]); ctx.lineWidth=2; for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(312,98+i*40); ctx.lineTo(312,118+i*40); ctx.moveTo(328,98+i*40); ctx.lineTo(328,118+i*40); ctx.stroke(); } ctx.setLineDash([]); lab('Cast parts cut off',360,110,460,90); } }
    if(st.p==='press'){ const down=S===1?k:S===2?1:S===3?1-k:0; R(170,20,300,40,steelD); const py=60+down*92; ctx.fillStyle=steel; ctx.beginPath(); ctx.moveTo(250,py); ctx.lineTo(390,py); ctx.lineTo(370,py+60); ctx.lineTo(270,py+60); ctx.closePath(); ctx.fill(); ctx.strokeStyle=ink; ctx.stroke(); ctx.fillStyle=steelD; ctx.fillRect(300,60,40,Math.max(0,py-60));
      ctx.fillStyle=steel; ctx.beginPath(); ctx.moveTo(170,210); ctx.lineTo(245,210); ctx.lineTo(265,270); ctx.lineTo(375,270); ctx.lineTo(395,210); ctx.lineTo(470,210); ctx.lineTo(470,290); ctx.lineTo(170,290); ctx.closePath(); ctx.fill(); ctx.stroke();
      const formed=S>=2||S===1&&k>.9; ctx.strokeStyle=p.accent; ctx.lineWidth=5; ctx.beginPath(); if(!formed&&S<2){ const sag=S===1?Math.max(0,(py+60-205))*1:0; ctx.moveTo(190,205); ctx.lineTo(250,205); ctx.lineTo(270,205+sag); ctx.lineTo(370,205+sag); ctx.lineTo(390,205); ctx.lineTo(450,205); } else { const lift=S===3?-k*40:0; ctx.moveTo(190,205+lift); ctx.lineTo(247,205+lift); ctx.lineTo(267,265+lift); ctx.lineTo(373,265+lift); ctx.lineTo(393,205+lift); ctx.lineTo(450,205+lift); } ctx.stroke(); ctx.lineWidth=1;
      lab('Punch (upper die)',390,py+20,500,100); lab('Lower die',440,250,540,250); lab('Sheet blank',190,205,90,180); }
    ctx.restore(); }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});

/* ------------- printing ------------- */
LK.reg('printing',{title:'Printing press lab',cat:'Processes',topics:['3.1b'],blurb:'Animated offset lithography, flexography, gravure and screen printing, plus a CMYK colour mixer.',
 icon:LK.ico('<circle cx="34" cy="30" r="14"/><circle cx="34" cy="62" r="14"/><circle cx="70" cy="62" r="14"/><path d="M6 78h88"/>'),
 mount(el){
  const st={m:'litho',t:0,c:0,mg:0,y:0,k:0};
  const cw=document.createElement('div');
  const INFO={litho:'<b>Offset lithography</b> works because <b>oil and water do not mix</b>. The aluminium plate is treated so the image areas attract greasy ink and the non-image areas attract water from the dampening rollers. The inked image is transferred (offset) onto a rubber <b>blanket cylinder</b> and then onto the paper, which is pressed against it by the <b>impression cylinder</b>. High quality, fast, used for books, magazines and leaflets. Four plates print CMYK.',
   flexo:'<b>Flexography</b> uses a flexible <b>raised (relief) rubber or photopolymer plate</b> wrapped around the plate cylinder. The <b>anilox roller</b>, covered in tiny cells, delivers a precise amount of quick-drying ink. Prints on almost anything – corrugated card, plastic bags, labels and food packaging – at high speed on a continuous web.',
   grav:'<b>Gravure</b> uses an image <b>engraved into tiny cells</b> on a copper-plated cylinder. The cylinder dips into the ink trough, a <b>doctor blade</b> wipes the surface clean so ink stays only in the cells, and the impression roller presses the paper on to pick it up. Very high quality and consistent over millions of copies (magazines, stamps, wallpaper), but cylinders are expensive.',
   screen:'<b>Screen printing</b>: a <b>squeegee</b> forces ink through a fine mesh screen. A stencil blocks the mesh where no ink is wanted. One colour per screen. Used for T-shirts, posters, signs and printing on to uneven surfaces; cheap set-up for short runs.',
   cmyk:'<b>Four-colour process printing</b> builds colours from Cyan, Magenta, Yellow and Key (black) dots. Colours are <b>subtractive</b>: each ink absorbs some light, so overlapping C + M + Y gives a dark brown-black – black ink (K) is added for true blacks, sharper text and to save ink. Printers check quality with <b>registration marks</b>, <b>colour bars</b> and <b>crop marks</b>.'};
  LK.subtabs(el,[['litho','Offset lithography'],['flexo','Flexography'],['grav','Gravure'],['screen','Screen printing'],['cmyk','CMYK mixer']],k=>{ st.m=k; cw.style.display=k==='cmyk'?'':'none'; note.innerHTML=INFO[k]; });
  el.appendChild(cw); const cc=LK.ctrl(cw); [['c','Cyan'],['mg','Magenta'],['y','Yellow'],['k','Key (black)']].forEach(([k,l])=>LK.slider(cc,{label:l,min:0,max:100,value:0,fmt:v=>v+'%',on:v=>st[k]=v}));
  const cv=LK.canvas(el,w=>Math.min(360,Math.max(250,w*.5)));
  const note=LK.note(el,'');
  const stop=LK.loop(dt=>{ if(!LK.reduce()) st.t+=dt; draw(); });
  function cyl(ctx,x,y,r,c,label,dir=1,lx,ly){ const p=LK.P(); ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fillStyle=c; ctx.fill(); ctx.strokeStyle=p.ink; ctx.lineWidth=1.5; ctx.stroke(); const a=st.t*dir*60/r; for(let i=0;i<6;i++){ const q=a+i*Math.PI/3; ctx.beginPath(); ctx.moveTo(x+r*.35*Math.cos(q),y+r*.35*Math.sin(q)); ctx.lineTo(x+r*.85*Math.cos(q),y+r*.85*Math.sin(q)); ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=2; ctx.stroke(); } ctx.beginPath(); ctx.arc(x,y,3,0,7); ctx.fillStyle=p.surface; ctx.fill();
    if(label){ ctx.strokeStyle=p.muted; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(lx,ly); ctx.stroke(); LK.text(ctx,label,lx+(lx<x?-4:4),ly,{align:lx<x?'right':'left',size:13,weight:600,color:p.ink2,bg:p.bg}); } }
  function draw(){ const p=LK.P(), ctx=cv.ctx, w=cv.w, h=cv.h; ctx.clearRect(0,0,w,h); const s=Math.min(w/640,h/320); ctx.save(); ctx.translate((w-640*s)/2,(h-320*s)/2); ctx.scale(s,s);
    const ink='#1f8ad0', water='rgba(80,150,220,.35)'; const off=(st.t*60)%40;
    const paper=(y,x0,x1,printed)=>{ ctx.fillStyle='#fbfbf7'; ctx.fillRect(x0,y-3,x1-x0,6); ctx.strokeStyle=p.line2; ctx.strokeRect(x0,y-3,x1-x0,6); for(let x=x0-40+off;x<x1;x+=40){ if(x>printed) { ctx.fillStyle=ink; ctx.fillRect(Math.max(x,printed),y-3,Math.min(18,x1-x),6); } } LK.arrow(ctx,x1-40,y+16,x1,y+16,p.ink2,1.5,6); };
    if(st.m==='litho'){ cyl(ctx,250,80,46,'#c3cad2','Plate cylinder',1,330,22); cyl(ctx,250,175,46,'#3f4650','Blanket cylinder',-1,345,150); cyl(ctx,250,268,46,'#8a939d','Impression cylinder',1,345,300);
      [[150,40],[170,80],[150,120]].forEach(([x,y],i)=>cyl(ctx,x,y,16,ink,i===0?'Ink rollers':'',i%2?-1:1,60,20)); R2(ctx,80,20,40,30,ink);
      [[350,70],[365,110]].forEach(([x,y],i)=>cyl(ctx,x,y,13,water,i===0?'Water (damping) rollers':'',1,420,80)); paper(221,40,600,250); LK.text(ctx,'Paper',60,206,{size:13,weight:600,color:p.ink2}); }
    if(st.m==='flexo'){ R2(ctx,90,230,90,40,ink); LK.text(ctx,'Ink pan',135,288,{align:'center',size:13,weight:600,color:p.ink2}); cyl(ctx,135,215,20,'#6c6f75','Fountain roller',1,40,180); cyl(ctx,190,160,30,'#c9a24a','Anilox roller (ink cells)',-1,60,110); cyl(ctx,270,110,40,'#c3cad2','Plate cylinder (raised flexible plate)',1,330,40);
      ctx.strokeStyle='#7a3d8e'; ctx.lineWidth=4; for(let i=0;i<5;i++){ const a=st.t*60/40+i*1.25; ctx.beginPath(); ctx.arc(270,110,42,a,a+.4); ctx.stroke(); } ctx.lineWidth=1;
      cyl(ctx,270,205,40,'#8a939d','Impression cylinder',-1,360,240); paper(152,30,620,280); LK.text(ctx,'Web (card, film, labels)',420,138,{size:13,weight:600,color:p.ink2}); }
    if(st.m==='grav'){ R2(ctx,170,220,160,70,ink); LK.text(ctx,'Ink trough',250,305,{align:'center',size:13,weight:600,color:p.ink2}); cyl(ctx,250,190,52,'#c47f3a','Engraved cylinder (copper cells)',1,390,250);
      ctx.fillStyle=p.ink2; ctx.save(); ctx.translate(320,170); ctx.rotate(-.5); ctx.fillRect(0,-3,80,6); ctx.restore(); LK.text(ctx,'Doctor blade',405,140,{size:13,weight:600,color:p.ink2});
      cyl(ctx,250,90,40,'#6c6f75','Impression roller',-1,360,50); paper(134,30,620,260); }
    if(st.m==='screen'){ const sx=150+((Math.sin(st.t*1.2)+1)/2)*320; ctx.fillStyle='#f5f2ea'; ctx.fillRect(100,210,440,20); ctx.strokeStyle=p.line2; ctx.strokeRect(100,210,440,20); LK.text(ctx,'Substrate (T-shirt, card)',320,248,{align:'center',size:13,weight:600,color:p.ink2});
      ctx.fillStyle=ink; for(let x=230;x<410;x+=12){ if(x<sx) ctx.fillRect(x,206,8,4); }
      ctx.strokeStyle=p.line2; ctx.lineWidth=10; ctx.strokeRect(120,150,400,56); ctx.lineWidth=1; ctx.strokeStyle=p.muted; for(let x=125;x<520;x+=6){ ctx.beginPath(); ctx.moveTo(x,200); ctx.lineTo(x+3,206); ctx.stroke(); }
      ctx.fillStyle='rgba(60,60,60,.7)'; ctx.fillRect(125,200,105,6); ctx.fillRect(410,200,105,6); LK.text(ctx,'Stencil blocks mesh',130,140,{size:12,color:p.ink2}); LK.text(ctx,'Mesh screen in frame',520,140,{align:'right',size:12,color:p.ink2});
      ctx.fillStyle=ink; ctx.beginPath(); ctx.ellipse(sx+22,194,14,6,0,0,7); ctx.fill(); ctx.fillStyle='#2f3640'; ctx.fillRect(sx-6,100,12,96); ctx.fillStyle='#c9a24a'; ctx.fillRect(sx-30,80,60,22); LK.text(ctx,'Squeegee',sx,68,{align:'center',size:13,weight:600,color:p.ink2}); }
    if(st.m==='cmyk'){ const C=st.c/100,M=st.mg/100,Y=st.y/100,K=st.k/100; const col=`rgb(${Math.round(255*(1-C)*(1-K))},${Math.round(255*(1-M)*(1-K))},${Math.round(255*(1-Y)*(1-K))})`;
      ctx.fillStyle=col; ctx.fillRect(40,40,220,220); ctx.strokeStyle=p.ink; ctx.strokeRect(40,40,220,220); LK.text(ctx,`C${st.c} M${st.mg} Y${st.y} K${st.k}`,150,280,{align:'center',size:13,weight:600,mono:1});
      ctx.save(); ctx.fillStyle='#fff'; ctx.fillRect(330,40,270,240); ctx.globalCompositeOperation='multiply'; [['#00aeef',420,120],['#ec008c',510,120],['#fff200',465,200]].forEach(([c,x,y])=>{ ctx.beginPath(); ctx.arc(x,y,65,0,7); ctx.fillStyle=c; ctx.fill(); }); ctx.restore(); ctx.strokeStyle=p.line2; ctx.strokeRect(330,40,270,240);
      // registration mark
      ctx.strokeStyle=p.ink; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(600,300,8,0,7); ctx.moveTo(588,300); ctx.lineTo(612,300); ctx.moveTo(600,288); ctx.lineTo(600,312); ctx.stroke(); LK.text(ctx,'registration mark',584,300,{align:'right',size:10,color:p.muted}); }
    ctx.restore(); }
  function R2(ctx,x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x,y,w,h); ctx.strokeStyle=LK.P().ink; ctx.lineWidth=1.5; ctx.strokeRect(x,y,w,h); }
  return ()=>{ stop(); cv.ro.disconnect(); };
 }});
})();
