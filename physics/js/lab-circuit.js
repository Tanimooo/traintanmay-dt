/* Circuit sandbox: build any DC circuit on a grid and solve it with nodal analysis */
(function(){
'use strict';
const LK=window.LK;
const TYPES={
 wire:{name:'Wire',key:'W'}, cell:{name:'Cell',key:'C',props:{E:6,r:0.5}}, resistor:{name:'Resistor',key:'R',props:{R:10}}, varres:{name:'Variable resistor',key:'V',props:{R:20}},
 bulb:{name:'Filament lamp',key:'L',props:{rated:6}}, switch:{name:'Switch',key:'S',props:{closed:true}}, ammeter:{name:'Ammeter',key:'A'}, voltmeter:{name:'Voltmeter',key:'M'},
 ldr:{name:'LDR',key:'D',props:{light:50}}, cap:{name:'Capacitor',key:'K',props:{C:1000}}, therm:{name:'Thermistor (NTC)',key:'T',props:{temp:20}}, diode:{name:'Diode',key:'O'}, led:{name:'LED',key:'E'}
};
const icons={wire:'—',cell:'⊣|',resistor:'▭',varres:'▭↗',bulb:'⊗',switch:'⌐',ammeter:'Ⓐ',voltmeter:'Ⓥ',ldr:'▭☀',therm:'▭⌐',diode:'▷|',led:'▷|↗',cap:'⊣⊢'};
const COLS=13, ROWS=8;
const kOf=(a,b)=>{ const s=[a,b].sort((p,q)=>p[0]-q[0]||p[1]-q[1]); return s[0]+'|'+s[1]; };

function ldrR(l){ return 150*Math.pow(10,2.8*(1-l/100)); }
function thermR(t){ return 10000*Math.exp(3600*(1/(t+273)-1/298)); }
function bulbR(I,rated){ const Rh=rated*rated/3, Rc=Rh/7; const x=Math.min(1,Math.abs(I)/(3/rated)); return Rc+(Rh-Rc)*Math.pow(x,0.75); }

function solve(comps,dtc){ dtc=dtc||0;
  // nodes
  const nodes=new Map(); const nid=p=>{ const k=p[0]+','+p[1]; if(!nodes.has(k)) nodes.set(k,nodes.size); return nodes.get(k); };
  const list=[...comps.values()]; list.forEach(c=>{ c.na=nid(c.a); c.nb=nid(c.b); });
  const N=nodes.size; if(!N) return {N:0};
  const gmin=1e-9;
  let state=list.map(c=>({R:null,on:false,I:0}));
  let V=new Float64Array(N);
  for(let it=0; it<40; it++){
    const G=Array.from({length:N},()=>new Float64Array(N)), J=new Float64Array(N);
    for(let i=0;i<N;i++) G[i][i]+=gmin;
    const stampG=(a,b,g)=>{ G[a][a]+=g; G[b][b]+=g; G[a][b]-=g; G[b][a]-=g; };
    const stampI=(a,b,i)=>{ /* current i flows from a to b through source externally pushes into b */ J[a]-=i; J[b]+=i; };
    list.forEach((c,ix)=>{ const a=c.na,b=c.nb, s=state[ix];
      switch(c.type){
        case 'wire': case 'ammeter': stampG(a,b,1000); break;
        case 'switch': if(c.p.closed) stampG(a,b,1000); break;
        case 'voltmeter': stampG(a,b,1e-7); break;
        case 'resistor': case 'varres': stampG(a,b,1/Math.max(0.01,c.p.R)); break;
        case 'ldr': stampG(a,b,1/ldrR(c.p.light)); break;
        case 'therm': stampG(a,b,1/thermR(c.p.temp)); break;
        case 'bulb': { const R=s.R??bulbR(0,c.p.rated); stampG(a,b,1/R); break; }
        case 'cell': { const r=Math.max(0.01,c.p.r); stampG(a,b,1/r); stampI(a,b,c.p.E/r); break; }
        case 'cap': { if(dtc>0){ const Gc=c.p.C*1e-6/dtc; stampG(a,b,Gc); stampI(a,b,-Gc*(c.vc||0)); } else stampG(a,b,1e-9); break; }
        case 'diode': case 'led': { const Vf=c.type==='led'?1.9:0.65; if(s.on){ stampG(a,b,1/1.5); stampI(a,b,-Vf/1.5); } else stampG(a,b,1e-9); break; }
      }
    });
    // gaussian elimination
    const A=G.map(r=>Array.from(r)), x=Array.from(J);
    for(let i=0;i<N;i++){ let p=i; for(let r=i+1;r<N;r++) if(Math.abs(A[r][i])>Math.abs(A[p][i])) p=r; [A[i],A[p]]=[A[p],A[i]]; [x[i],x[p]]=[x[p],x[i]]; const d=A[i][i]; if(Math.abs(d)<1e-300) continue;
      for(let r=i+1;r<N;r++){ const f=A[r][i]/d; if(!f) continue; for(let k=i;k<N;k++) A[r][k]-=f*A[i][k]; x[r]-=f*x[i]; } }
    for(let i=N-1;i>=0;i--){ let s=x[i]; for(let k=i+1;k<N;k++) s-=A[i][k]*x[k]; x[i]=A[i][i]?s/A[i][i]:0; }
    V=Float64Array.from(x);
    let changed=false;
    list.forEach((c,ix)=>{ const s=state[ix], vd=V[c.na]-V[c.nb];
      if(c.type==='bulb'){ const R=s.R??bulbR(0,c.p.rated); const I=vd/R; const nR=bulbR(I,c.p.rated); const R2=R+(nR-R)*0.6; if(Math.abs(R2-R)>1e-4*R) changed=true; s.R=R2; }
      if(c.type==='diode'||c.type==='led'){ const Vf=c.type==='led'?1.9:0.65; const on = s.on ? ((vd-Vf)/1.5>-1e-6) : vd>Vf; if(on!==s.on){ s.on=on; changed=true; } }
    });
    if(!changed && it>0) break;
  }
  // currents
  list.forEach((c,ix)=>{ const s=state[ix], vd=V[c.na]-V[c.nb]; let I=0;
    switch(c.type){
      case 'wire': case 'ammeter': I=vd*1000; break; case 'switch': I=c.p.closed?vd*1000:0; break; case 'voltmeter': I=vd*1e-7; break;
      case 'resistor': case 'varres': I=vd/Math.max(0.01,c.p.R); break; case 'ldr': I=vd/ldrR(c.p.light); break; case 'therm': I=vd/thermR(c.p.temp); break;
      case 'bulb': I=vd/(s.R??bulbR(0,c.p.rated)); c.Rnow=s.R; break;
      case 'cell': { const r=Math.max(0.01,c.p.r); I=(vd + c.p.E)/r; /* conventional current a(-) -> b(+) inside the cell */ break; }
      case 'cap': { I=dtc>0?c.p.C*1e-6/dtc*(vd-(c.vc||0)):0; break; }
      case 'diode': case 'led': { const Vf=c.type==='led'?1.9:0.65; I=s.on?(vd-Vf)/1.5:vd*1e-9; c.lit=s.on&&I>0.002; break; }
    }
    c.I=I; c.V=vd; });
  if(dtc>0) list.forEach(c=>{ if(c.type==='cap') c.vc=c.V; });
  return {N,V,nodes};
}

window.LABS.circuit={title:'Circuit sandbox',inlineControls:true,howto:'pick a component from the bar and tap a line between two grid dots to place it. With the wire tool, press anywhere and drag in one continuous stroke: the wire follows your finger along the grid lines, round corners and all. Tap a component you have placed to select it: its values appear below, along with a live graph. Tapping a switch flips it. Try a preset first if you are not sure where to start.',cat:'Electricity',topic:'4.3',desc:'Build any DC circuit: cells with internal resistance, resistors, lamps, LDRs, thermistors, diodes, switches and meters. Currents and p.d.s are solved live.',
icon:'<path d="M20 60h25M75 60h25M45 45v30M55 52v16M60 20h40v80H20V20h20" fill="none" stroke="currentColor" stroke-width="5"/><rect x="45" y="12" width="20" height="16" fill="none" stroke="currentColor" stroke-width="5"/>',
mount(el){
  const S=LK.scope();
  const comps=new Map(); let tool='wire', sel=null, flowE=false, showV=true, sol=null, dirty=true;
  const bar=LK.el('<div class="toolbar" role="toolbar" aria-label="Components"></div>'); el.appendChild(bar);
  const toolsList=['select','wire','cell','resistor','varres','bulb','switch','ammeter','voltmeter','ldr','therm','diode','led','cap','erase'];
  toolsList.forEach(t=>{ const b=LK.el(`<button type="button" class="tool" data-t="${t}" aria-pressed="${t===tool}"><span class="ti">${t==='select'?'↖':t==='erase'?'⌫':icons[t]}</span><span>${t==='select'?'Select / edit':t==='erase'?'Erase':TYPES[t].name}</span></button>`); b.onclick=()=>{ tool=t; bar.querySelectorAll('.tool').forEach(x=>x.setAttribute('aria-pressed',x.dataset.t===t)); }; bar.appendChild(b); });
  const pre=LK.ctrl(el);
  const presets={
    'Series lamps':()=>{ add('cell',[2,6],[3,6],{E:6,r:0.5}); wirePath([[3,6],[9,6],[9,2],[8,2]]); add('bulb',[8,2],[7,2]); add('wire',[7,2],[6,2]); add('bulb',[6,2],[5,2]); wirePath([[5,2],[2,2],[2,4]]); add('ammeter',[2,4],[2,5]); add('wire',[2,5],[2,6]); },
    'Parallel lamps':()=>{ add('cell',[2,6],[3,6],{E:6,r:0.5}); wirePath([[3,6],[9,6],[9,2],[7,2]]); add('bulb',[7,2],[6,2]); wirePath([[6,2],[2,2],[2,6]]); wirePath([[9,4],[7,4]]); add('bulb',[7,4],[6,4]); wirePath([[6,4],[2,4]]); add('ammeter',[3,6],[4,6]); },
    'Internal resistance':()=>{ add('cell',[2,6],[3,6],{E:9,r:2}); add('wire',[2,6],[2,5]); add('voltmeter',[2,5],[3,5]); add('wire',[3,5],[3,6]); wirePath([[3,6],[9,6],[9,2],[8,2]]); add('varres',[8,2],[7,2],{R:10}); wirePath([[7,2],[5,2]]); add('ammeter',[5,2],[4,2]); wirePath([[4,2],[1,2],[1,6],[2,6]]); },
    'LDR potential divider':()=>{ add('cell',[2,7],[3,7],{E:9,r:0.1}); wirePath([[3,7],[7,7],[7,6]]); add('resistor',[7,6],[7,5],{R:2000}); add('wire',[7,5],[7,4]); add('ldr',[7,4],[7,3],{light:50}); wirePath([[7,3],[7,1],[2,1],[2,7]]); wirePath([[7,4],[10,4]]); add('voltmeter',[10,4],[10,3]); wirePath([[10,3],[10,1],[7,1]]); },
    'Two cells (Kirchhoff)':()=>{ add('cell',[1,6],[1,5],{E:6,r:1}); wirePath([[1,5],[1,2],[3,2]]); add('resistor',[3,2],[4,2],{R:4}); wirePath([[4,2],[6,2],[6,3]]); add('ammeter',[6,3],[6,4]); add('resistor',[6,4],[6,5],{R:10}); wirePath([[6,5],[6,6],[1,6]]); wirePath([[6,2],[9,2]]); add('resistor',[9,2],[10,2],{R:2}); wirePath([[10,2],[11,2],[11,5]]); add('cell',[11,6],[11,5],{E:3,r:1}); wirePath([[11,6],[6,6]]); },
    'LED characteristic':()=>{ add('cell',[1,6],[2,6],{E:3,r:0.1}); wirePath([[2,6],[8,6],[8,4]]); add('varres',[8,4],[8,3],{R:50}); wirePath([[8,3],[8,2],[6,2]]); add('led',[6,2],[5,2]); wirePath([[5,2],[3,2]]); add('ammeter',[3,2],[2,2]); wirePath([[2,2],[1,2],[1,6]]); add('wire',[6,2],[6,1]); add('voltmeter',[6,1],[5,1]); add('wire',[5,1],[5,2]); },
    'Capacitor charging':()=>{ add('cell',[2,6],[3,6],{E:6,r:0.1}); wirePath([[3,6],[5,6]]); add('switch',[5,6],[6,6],{closed:false}); wirePath([[6,6],[9,6],[9,5]]); add('resistor',[9,5],[9,4],{R:4700}); wirePath([[9,4],[9,2],[7,2]]); add('cap',[7,2],[6,2],{C:1000}); wirePath([[6,2],[2,2],[2,6]]); add('wire',[7,2],[7,1]); add('voltmeter',[7,1],[6,1]); add('wire',[6,1],[6,2]); },
    'Clear':()=>{}
  };
  function add(type,a,b,p){ comps.set(kOf(a,b),{type,a,b,p:Object.assign({},TYPES[type].props||{},p||{})}); dirty=true; }
  function wirePath(pts){ for(let i=0;i<pts.length-1;i++){ let [x,y]=pts[i]; const [X,Y]=pts[i+1]; while(x!==X||y!==Y){ const nx=x+Math.sign(X-x), ny=x===X?y+Math.sign(Y-y):y; add('wire',[x,y],[nx,ny]); x=nx; y=ny; } } }
  Object.keys(presets).forEach(n=>LK.button(pre,n,()=>{ comps.clear(); sel=null; presets[n](); dirty=true; inspect(); }, n==='Clear'?'ghost':''));
  LK.check(pre,'Show electron flow',false,v=>{flowE=v;});
  LK.check(pre,'Show p.d. labels',true,v=>{showV=v;});
  const wrap=LK.el('<div class="circ-wrap"></div>'); el.appendChild(wrap);
  const st=LK.stage(wrap,S,{ratio:0.58,maxH:560,minH:300});
  const insp=LK.el('<div class="inspector" aria-live="polite"></div>'); el.appendChild(insp);
  let hist=[], ht=0; const hp=LK.plot(el,S,{ratio:0.26});
  LK.note(el,'Pick a component and tap a grid edge to place it. Drag with the wire tool to draw wires. Use <b>Select / edit</b> to change values or flip a component. The + terminal of a cell and the arrow of a diode point the way you placed them (flip to reverse). Ammeters have near-zero resistance and voltmeters near-infinite resistance, just like ideal meters. Currents above 20 A are flagged as a short circuit.');
  let geo={s:40,ox:20,oy:20};
  const layout=()=>{ const s=Math.min((st.w-20)/COLS,(st.h-20)/ROWS); geo={s,ox:(st.w-s*(COLS-1))/2,oy:(st.h-s*(ROWS-1))/2}; };
  st.onResize=layout; layout();
  const toPx=p=>[geo.ox+p[0]*geo.s, geo.oy+p[1]*geo.s];
  const nearestEdge=(x,y)=>{ const gx=(x-geo.ox)/geo.s, gy=(y-geo.oy)/geo.s; let best=null,bd=0.55;
    for(let i=Math.floor(gx)-1;i<=Math.ceil(gx)+1;i++) for(let j=Math.floor(gy)-1;j<=Math.ceil(gy)+1;j++){
      [[1,0],[0,1]].forEach(([dx,dy])=>{ const a=[i,j],b=[i+dx,j+dy]; if(a[0]<0||a[1]<0||b[0]>=COLS||b[1]>=ROWS) return; const mx=i+dx/2,my=j+dy/2; const d=Math.hypot(gx-mx,gy-my); if(d<bd){bd=d;best=[a,b];} }); }
    return best; };
  const nearestNode=(x,y)=>{ const gx=Math.round((x-geo.ox)/geo.s), gy=Math.round((y-geo.oy)/geo.s); if(gx<0||gy<0||gx>=COLS||gy>=ROWS) return null; const [px,py]=toPx([gx,gy]); return Math.hypot(px-x,py-y)<geo.s*0.35?[gx,gy]:null; };
  let drag=null, dragMoved=false, downEdge=null;
  const snapNode=(x,y)=>[Math.max(0,Math.min(COLS-1,Math.round((x-geo.ox)/geo.s))), Math.max(0,Math.min(ROWS-1,Math.round((y-geo.oy)/geo.s)))];
  S.on(st.cv,'pointerdown',e=>{ e.preventDefault(); const p=st.pos(e);
    if(tool==='wire'){ drag=snapNode(p.x,p.y); dragMoved=false; downEdge=nearestEdge(p.x,p.y); try{st.cv.setPointerCapture(e.pointerId);}catch(_){} return; }
    const ed=nearestEdge(p.x,p.y); if(!ed) return; const k=kOf(ed[0],ed[1]);
    if(tool==='erase'){ comps.delete(k); if(sel===k) sel=null; dirty=true; inspect(); return; }
    if(comps.has(k)&&(tool==='select'||tool!=='wire')){ const c=comps.get(k); if(c.type==='switch'){ c.p.closed=!c.p.closed; dirty=true; } sel=k; hist=[]; inspect(); return; }
    if(tool==='select'){ sel=null; inspect(); return; }
    add(tool,ed[0],ed[1]); sel=k; hist=[]; inspect(); });
  // continuous wire drawing: follow the pointer node-to-node along grid lines, however fast it moves
  S.on(st.cv,'pointermove',e=>{ if(!drag) return; const p=st.pos(e); const t=snapNode(p.x,p.y);
    // only commit once the pointer is reasonably close to a grid point (avoids diagonal jitter)
    const [px,py]=toPx(t); if(Math.hypot(px-p.x,py-p.y)>geo.s*0.45) return;
    let guard=0; while((drag[0]!==t[0]||drag[1]!==t[1]) && guard++<60){
      const dx=t[0]-drag[0], dy=t[1]-drag[1]; const n = Math.abs(dx)>=Math.abs(dy) ? [drag[0]+Math.sign(dx),drag[1]] : [drag[0],drag[1]+Math.sign(dy)];
      const k=kOf(drag,n); if(!comps.has(k)) add('wire',drag,n); drag=n; dragMoved=true; } });
  S.on(st.cv,'pointerup',()=>{ if(drag && !dragMoved && downEdge){ const k=kOf(downEdge[0],downEdge[1]); if(!comps.has(k)) add('wire',downEdge[0],downEdge[1]); } drag=null; });
  S.on(st.cv,'pointercancel',()=>{ drag=null; });

  function inspect(){
    insp.innerHTML='';
    if(!sel||!comps.has(sel)){ insp.innerHTML='<p class="muted">Select a component to see its p.d., current, resistance and power.</p>'; return; }
    const c=comps.get(sel); const T=TYPES[c.type];
    const head=LK.el(`<div class="insp-head"><b>${T.name}</b></div>`); insp.appendChild(head);
    const ctl=LK.ctrl(insp);
    if(c.type==='cell'){ LK.slider(ctl,{label:'e.m.f. ε',min:0.5,max:24,step:0.5,value:c.p.E,fmt:v=>v+' V',on:v=>{c.p.E=v;dirty=true;}}); LK.slider(ctl,{label:'internal r',min:0,max:10,step:0.1,value:c.p.r,fmt:v=>v+' Ω',on:v=>{c.p.r=v;dirty=true;}}); }
    if(c.type==='resistor'){ LK.select(ctl,{label:'Resistance',value:String(c.p.R),options:[1,2,4,5,10,12,20,47,100,220,470,1000,2000,4700,10000].map(v=>[String(v),v>=1000?v/1000+' kΩ':v+' Ω']),on:v=>{c.p.R=+v;dirty=true;}}); }
    if(c.type==='varres'){ LK.slider(ctl,{label:'Resistance',min:0,max:100,step:0.5,value:c.p.R,fmt:v=>v+' Ω',on:v=>{c.p.R=v;dirty=true;}}); }
    if(c.type==='bulb'){ LK.select(ctl,{label:'Rating',value:String(c.p.rated),options:[['2.5','2.5 V'],['6','6 V'],['12','12 V']],on:v=>{c.p.rated=+v;dirty=true;}}); }
    if(c.type==='ldr'){ LK.slider(ctl,{label:'Light intensity',min:0,max:100,step:1,value:c.p.light,fmt:v=>v+'%',on:v=>{c.p.light=v;dirty=true;}}); }
    if(c.type==='therm'){ LK.slider(ctl,{label:'Temperature',min:-10,max:100,step:1,value:c.p.temp,fmt:v=>v+' °C',on:v=>{c.p.temp=v;dirty=true;}}); }
    if(c.type==='switch'){ LK.check(ctl,'Closed',c.p.closed,v=>{c.p.closed=v;dirty=true;}); }
    if(c.type==='cap'){ LK.select(ctl,{label:'Capacitance',value:String(c.p.C),options:[100,470,1000,2200,4700].map(v=>[String(v),v+' μF']),on:v=>{c.p.C=+v;dirty=true;}}); LK.button(ctl,'Discharge it',()=>{ c.vc=0; dirty=true; }); }
    if(c.type!=='wire') LK.button(ctl,'Flip direction',()=>{ const t=c.a; c.a=c.b; c.b=t; dirty=true; });
    LK.button(ctl,'Delete',()=>{ comps.delete(sel); sel=null; dirty=true; inspect(); },'ghost');
    insp._ro=LK.readout(insp,[['v','p.d. across'],['i','current'],['r','resistance'],['p','power']]);
    insp.appendChild(LK.el('<p class="muted" style="margin:8px 0 0;font-size:.85rem">The graph below records this component’s p.d. and current over time.</p>'));
  }
  const fmtA=I=>{ const a=Math.abs(I); return a<1e-6?'0 A':a<1e-3?LK.sig(a*1e6,3)+' μA':a<1?LK.sig(a*1e3,3)+' mA':LK.sig(a,3)+' A'; };
  const fmtV=v=>Math.abs(v)<1e-4?'0 V':LK.sig(Math.abs(v),3)+' V';
  const fmtR=r=>!isFinite(r)||r>1e8?'∞':r>=1000?LK.sig(r/1000,3)+' kΩ':LK.sig(r,3)+' Ω';
  let phase=0; let warn=false;
  presets['Series lamps'](); sel=null; inspect();
  S.loop(dt=>{
    const hasCap=[...comps.values()].some(c=>c.type==='cap'); if(hasCap&&dt>0) dirty=true;
    if(dirty){ sol=solve(comps,hasCap?Math.max(dt,1e-4):0); dirty=false; warn=[...comps.values()].some(c=>Math.abs(c.I||0)>20);
      // keep bulbs/diodes settled
    }
    phase+=dt; ht+=dt; if(sel&&comps.has(sel)&&dt>0){ const c=comps.get(sel); hist.push([ht,Math.abs(c.V||0),Math.abs(c.I||0)*1000]); if(hist.length>900) hist.shift(); if(Math.floor(ht*20)%3===0){ const PP=LK.P(); hp.set([{pts:hist.map(h=>[h[0],h[1]]),color:PP.brand,name:'p.d. / V'},{pts:hist.map(h=>[h[0],h[2]]),color:PP.teal,name:'current / mA'}],{xlab:'t / s',ylab:'V and I',xmin:hist[0][0],legend:true}); } }
    const P=LK.P(), x=st.ctx; st.clear();
    // grid dots
    x.fillStyle=P.line2; for(let i=0;i<COLS;i++) for(let j=0;j<ROWS;j++){ const [px,py]=toPx([i,j]); x.beginPath(); x.arc(px,py,1.6,0,7); x.fill(); }
    // degree for junction dots
    const deg=new Map(); comps.forEach(c=>{ [c.a,c.b].forEach(p=>{ const k=p+''; deg.set(k,(deg.get(k)||0)+1); }); });
    comps.forEach((c,k)=>{ const [ax,ay]=toPx(c.a),[bx,by]=toPx(c.b); const ang=Math.atan2(by-ay,bx-ax), L=geo.s; const mx=(ax+bx)/2, my=(ay+by)/2;
      x.save(); x.translate(mx,my); x.rotate(ang); x.lineWidth=2.2; x.strokeStyle=k===sel?P.brand:P.ink; x.fillStyle=P.surface;
      const h=L/2, s=L*0.28;
      const leads=(g)=>{ x.beginPath(); x.moveTo(-h,0); x.lineTo(-g,0); x.moveTo(g,0); x.lineTo(h,0); x.stroke(); };
      switch(c.type){
        case 'wire': x.beginPath(); x.moveTo(-h,0); x.lineTo(h,0); x.stroke(); break;
        case 'cell': leads(5); x.lineWidth=2.5; x.beginPath(); x.moveTo(-5,-s*0.55); x.lineTo(-5,s*0.55); x.stroke(); x.lineWidth=4; x.beginPath(); x.moveTo(5,-s*1.0); x.lineTo(5,s*1.0); x.stroke(); x.rotate(-ang); LK.text(x,'+',8*Math.cos(ang)+(Math.abs(Math.sin(ang))>0.5?10:0),-s-2,P.brand,{size:12,weight:700}); break;
        case 'resistor': case 'varres': case 'ldr': case 'therm': leads(s); x.beginPath(); x.rect(-s,-s*0.38,2*s,s*0.76); x.fill(); x.stroke();
          if(c.type==='varres'){ LK.arrow(x,-s*0.9,s*0.8,s*0.9,-s*0.9,k===sel?P.brand:P.ink,1.6,6); }
          if(c.type==='therm'){ x.beginPath(); x.moveTo(-s*1.1,s*0.7); x.lineTo(s*0.8,-s*0.7); x.lineTo(s*1.2,-s*0.7); x.stroke(); }
          if(c.type==='ldr'){ x.beginPath(); x.arc(0,0,s*1.15,0,7); x.stroke(); LK.arrow(x,-s*1.5,-s*1.8,-s*0.6,-s*0.9,P.warn,1.4,5); LK.arrow(x,-s*0.7,-s*2.0,s*0.2,-s*1.1,P.warn,1.4,5); }
          break;
        case 'bulb': { leads(s*0.9); const pw=Math.abs((c.I||0)*(c.V||0)); const glow=Math.min(1,pw/3); if(glow>0.02){ const g=x.createRadialGradient(0,0,2,0,0,s*2.4); g.addColorStop(0,`rgba(255,214,90,${0.85*glow})`); g.addColorStop(1,'rgba(255,214,90,0)'); x.fillStyle=g; x.beginPath(); x.arc(0,0,s*2.4,0,7); x.fill(); x.fillStyle=P.surface; }
          x.beginPath(); x.arc(0,0,s*0.9,0,7); x.fill(); x.stroke(); const q=s*0.62; x.beginPath(); x.moveTo(-q,-q); x.lineTo(q,q); x.moveTo(-q,q); x.lineTo(q,-q); x.stroke(); break; }
        case 'switch': x.beginPath(); x.moveTo(-h,0); x.lineTo(-s*0.8,0); x.moveTo(s*0.8,0); x.lineTo(h,0); x.stroke(); x.beginPath(); x.arc(-s*0.8,0,2.5,0,7); x.arc(s*0.8,0,2.5,0,7); x.fill(); x.stroke(); x.beginPath(); x.moveTo(-s*0.8,0); c.p.closed? x.lineTo(s*0.8,-2): x.lineTo(s*0.6,-s*0.9); x.stroke(); break;
        case 'ammeter': case 'voltmeter': leads(s*0.9); x.beginPath(); x.arc(0,0,s*0.9,0,7); x.fill(); x.stroke(); x.rotate(-ang); LK.text(x,c.type==='ammeter'?'A':'V',0,1,k===sel?P.brand:P.ink,{align:'center',base:'middle',size:13,weight:700}); break;
        case 'cap': { leads(4); x.lineWidth=4; x.beginPath(); x.moveTo(-4,-s*0.9); x.lineTo(-4,s*0.9); x.moveTo(4,-s*0.9); x.lineTo(4,s*0.9); x.stroke(); const q=Math.min(6,Math.round(Math.abs(c.vc||0)/1.2)); x.rotate(-ang); for(let n=0;n<q;n++){ const sg=(c.vc||0)>=0; LK.text(x,sg?'+':'−',(Math.abs(Math.sin(ang))>0.5?-14:-12)+(Math.abs(Math.sin(ang))>0.5?0:0),-s*0.8+n*7,P.brand,{size:9}); } break; }
        case 'diode': case 'led': { leads(s*0.6); if(c.type==='led'&&c.lit){ const g=x.createRadialGradient(0,0,2,0,0,s*2); g.addColorStop(0,'rgba(255,60,140,.75)'); g.addColorStop(1,'rgba(255,60,140,0)'); x.fillStyle=g; x.beginPath(); x.arc(0,0,s*2,0,7); x.fill(); }
          x.fillStyle=k===sel?P.brand:P.ink; x.beginPath(); x.moveTo(-s*0.6,-s*0.6); x.lineTo(s*0.5,0); x.lineTo(-s*0.6,s*0.6); x.closePath(); x.fill(); x.beginPath(); x.moveTo(s*0.6,-s*0.6); x.lineTo(s*0.6,s*0.6); x.stroke(); if(c.type==='led'){ LK.arrow(x,0,-s*0.8,s*0.7,-s*1.6,P.brand,1.4,5); LK.arrow(x,s*0.4,-s*0.7,s*1.1,-s*1.5,P.brand,1.4,5); } break; }
      }
      x.restore();
      // moving charges
      const I=c.I||0; if(Math.abs(I)>1e-5 && c.type!=='voltmeter'){ const dir=(I>0?1:-1)*(flowE?-1:1); const sp=Math.min(3,0.25+Math.log10(1+Math.abs(I)*200)*0.7); const n=3;
        x.fillStyle=flowE?P.teal:P.accent; for(let i=0;i<n;i++){ let f=((phase*sp*dir)+i/n)%1; if(f<0) f+=1; const px=ax+(bx-ax)*f, py=ay+(by-ay)*f; x.beginPath(); x.arc(px,py,2.6,0,7); x.fill(); } }
      // meter readings
      if(c.type==='ammeter'||c.type==='voltmeter'){ const txt=c.type==='ammeter'?fmtA(c.I||0):fmtV(c.V||0); x.font=`600 12px ${P.mono}`; const tw=x.measureText(txt).width+10; const ox=Math.abs(Math.sin(ang))>0.5?geo.s*0.32+tw/2:0, oy=Math.abs(Math.sin(ang))>0.5?0:-geo.s*0.55;
        x.fillStyle=P.deep; LK.rr(x,mx+ox-tw/2,my+oy-10,tw,20,5); x.fill(); LK.text(x,txt,mx+ox,my+oy+4,P.surface,{align:'center',size:12,weight:600}); }
      else if(showV && c.type!=='wire' && c.type!=='switch' && Math.abs(c.V||0)>1e-3){ const ox=Math.abs(Math.sin(ang))>0.5?geo.s*0.42:0, oy=Math.abs(Math.sin(ang))>0.5?0:geo.s*0.46; LK.text(x,fmtV(c.V),mx+ox,my+oy+4,P.muted,{align:'center',size:11}); }
    });
    deg.forEach((d,k)=>{ if(d>=3){ const p=k.split(',').map(Number); const [px,py]=toPx(p); x.fillStyle=P.ink; x.beginPath(); x.arc(px,py,3.5,0,7); x.fill(); } });
    if(warn){ x.fillStyle=P.bad; LK.rr(x,10,10,170,26,6); x.fill(); LK.text(x,'Short circuit! I > 20 A',95,28,'#fff',{align:'center',weight:700}); }
    if(insp._ro && sel && comps.has(sel)){ const c=comps.get(sel); const R=Math.abs(c.I)>1e-9?Math.abs(c.V/c.I):Infinity; insp._ro.set('v',fmtV(c.V||0)); insp._ro.set('i',fmtA(c.I||0)); insp._ro.set('r',c.type==='cell'?('r = '+c.p.r+' Ω'):fmtR(R)); insp._ro.set('p',LK.sig(Math.abs((c.V||0)*(c.I||0)),3)+' W'); }
  });
  return ()=>S.dispose();
}};
})();
