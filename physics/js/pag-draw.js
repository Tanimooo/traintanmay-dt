/* Clear, labelled apparatus drawings for every PAG, with step-by-step captions.
   Every drawing is authored in a 640 x 340 virtual space: apparatus on the left (x < 456),
   the "your reading" card on the right. st = {xv, a (0..1 progress of the reading), busy,
   y (value being measured), ys (repeats), show (reading revealed), opt, fx, fy}. */
(function(){
'use strict';
const LK=window.LK;
const H={}; window.PAGH=H;
const T=H.T=(x,t,px,py,c,o)=>LK.text(x,t,px,py,c,Object.assign({size:13,mono:false},o||{}));
const cl=H.cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const seg=H.seg=(a,a0,a1)=>cl((a-a0)/(a1-a0),0,1);
const ease=H.ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const now=()=>performance.now()/1000;
H.bench=(x,P,y,x0=6,x1=456)=>{ x.fillStyle=P.line2; x.fillRect(x0,y,x1-x0,7); };
H.stand=(x,P,bx,by,top)=>{ x.fillStyle=P.ink2; x.fillRect(bx-34,by-9,68,9); x.fillRect(bx-3,top,6,by-9-top); };
H.arm=(x,P,bx,y,x2)=>{ x.fillStyle=P.ink2; x.fillRect(bx-7,y-7,14,14); x.fillRect(Math.min(bx,x2),y-2.5,Math.abs(x2-bx),5); };
H.wire=(x,P,pts,col,w)=>{ x.save(); x.strokeStyle=col||P.ink2; x.lineWidth=w||2; x.lineJoin='round'; x.lineCap='round'; x.beginPath(); pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])); x.stroke(); x.restore(); };
H.note=(x,P,text,tx,ty,lx,ly,o)=>{ o=o||{}; const al=o.align||(lx<tx?'right':'left'); x.save(); x.strokeStyle=P.muted; x.lineWidth=1; x.beginPath(); x.moveTo(tx,ty); x.lineTo(lx+(al==='right'?4:al==='left'?-4:0),ly-4); x.stroke(); x.fillStyle=P.muted; x.beginPath(); x.arc(tx,ty,2.4,0,7); x.fill(); x.restore();
  String(text).split('\n').forEach((ln,i)=>T(x,ln,lx,ly+i*14,o.col||P.ink2,{align:al,size:o.size||12,weight:o.weight||500})); };
H.lab=(x,P,text,px,py,o)=>{ o=o||{}; String(text).split('\n').forEach((ln,i)=>T(x,ln,px,py+i*14,o.col||P.ink2,{align:o.align||'center',size:o.size||12,weight:o.weight||500})); };
H.dim=(x,P,x1,y1,x2,y2,text,o)=>{ o=o||{}; const c=o.col||P.brand; const mx=(x1+x2)/2, my=(y1+y2)/2; LK.arrow(x,mx,my,x1,y1,c,1.6,7); LK.arrow(x,mx,my,x2,y2,c,1.6,7); if(text){ const tx=mx+(o.dx||0), ty=my+(o.dy||0); if(o.bg!==false){ x.font='700 13px '+P.body; const w=x.measureText(text).width; x.fillStyle=P.bg; const ax=o.align==='left'?tx:o.align==='right'?tx-w:tx-w/2; x.fillRect(ax-3,ty-12,w+6,16); } T(x,text,tx,ty,c,{align:o.align||'center',size:13,weight:700}); } };
H.box=(x,P,X,Y,w,h,fill,stroke,r)=>{ x.fillStyle=fill; LK.rr(x,X,Y,w,h,r==null?6:r); x.fill(); if(stroke){ x.strokeStyle=stroke; x.lineWidth=1.5; x.stroke(); } };
H.hot=(x,P,X,Y,w,h)=>{ x.save(); x.strokeStyle=P.brand; x.lineWidth=3; x.globalAlpha=0.45+0.45*Math.sin(now()*7); LK.rr(x,X-5,Y-5,w+10,h+10,10); x.stroke(); x.restore(); };
H.meter=(x,P,X,Y,val,label,o)=>{ o=o||{}; const w=o.w||96, h=o.h||52; H.box(x,P,X,Y,w,h,P.surface,P.ink2,8); H.box(x,P,X+6,Y+6,w-12,h-25,P.deep,null,4); T(x,val,X+w/2,Y+h-25,'#ffe2ef',{align:'center',size:14,weight:700,mono:true}); T(x,label,X+w/2,Y+h-7,P.muted,{align:'center',size:10.5}); if(o.hot) H.hot(x,P,X,Y,w,h); return {l:[X,Y+h/2],r:[X+w,Y+h/2],t:[X+w/2,Y],b:[X+w/2,Y+h]}; };
H.dial=(x,P,cx,cy,r,frac,label,o)=>{ o=o||{}; x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,r,0,7); x.fill(); x.stroke(); x.strokeStyle=P.line2; x.lineWidth=1; for(let i=0;i<=10;i++){ const an=Math.PI*(0.75+1.5*i/10); x.beginPath(); x.moveTo(cx+Math.cos(an)*r*0.78,cy+Math.sin(an)*r*0.78); x.lineTo(cx+Math.cos(an)*r*0.92,cy+Math.sin(an)*r*0.92); x.stroke(); } const an=Math.PI*(0.75+1.5*cl(frac,0,1)); x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(an)*r*0.8,cy+Math.sin(an)*r*0.8); x.stroke(); x.fillStyle=P.ink2; x.beginPath(); x.arc(cx,cy,3,0,7); x.fill(); if(label) T(x,label,cx,cy+r*0.55,P.muted,{align:'center',size:10}); if(o.val) T(x,o.val,cx,cy+r+16,P.ink,{align:'center',size:12,weight:700,mono:true}); if(o.hot) H.hot(x,P,cx-r,cy-r,2*r,2*r); };
H.stopwatch=(x,P,cx,cy,secs,o)=>{ o=o||{}; x.fillStyle=P.ink2; x.fillRect(cx-4,cy-34,8,8); x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.arc(cx,cy,26,0,7); x.fill(); x.stroke(); const an=-Math.PI/2+2*Math.PI*((secs%60)/60); x.strokeStyle=P.brand; x.lineWidth=2; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+Math.cos(an)*20,cy+Math.sin(an)*20); x.stroke(); T(x,o.txt!=null?o.txt:secs.toFixed(o.dp==null?2:o.dp)+' s',cx,cy+44,P.ink,{align:'center',size:12,weight:700,mono:true}); if(o.label) T(x,o.label,cx,cy+58,P.muted,{align:'center',size:10.5}); if(o.hot) H.hot(x,P,cx-28,cy-36,56,100); };
H.water=(x,P,X,Y,w,h,col)=>{ x.fillStyle=col||P.tealSoft; x.fillRect(X,Y,w,h); x.strokeStyle=P.teal; x.globalAlpha=0.5; x.lineWidth=1; x.beginPath(); x.moveTo(X,Y); x.lineTo(X+w,Y); x.stroke(); x.globalAlpha=1; };
H.beaker=(x,P,X,Y,w,h)=>{ x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.moveTo(X-4,Y); x.lineTo(X,Y+4); x.lineTo(X,Y+h); x.lineTo(X+w,Y+h); x.lineTo(X+w,Y+4); x.lineTo(X+w+4,Y); x.stroke(); };
H.thermo=(x,P,X,top,bot,frac,o)=>{ o=o||{}; x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=1.5; LK.rr(x,X-4,top,8,bot-top,4); x.fill(); x.stroke(); x.fillStyle='#e0245e'; x.beginPath(); x.arc(X,bot,6,0,7); x.fill(); const lv=bot-(bot-top-6)*cl(frac,0,1); x.fillRect(X-1.8,lv,3.6,bot-lv); if(o.label) T(x,o.label,X+10,top+10,P.ink,{size:12,weight:700,mono:true}); };
H.mass=(x,P,cx,y,n,o)=>{ o=o||{}; x.fillStyle=P.ink2; x.fillRect(cx-1.5,y,3,10); let yy=y+10; for(let i=0;i<n;i++){ x.fillStyle=i%2?P.deep:P.brand; x.fillRect(cx-16,yy,32,7); yy+=8; } x.fillStyle=P.ink2; x.fillRect(cx-18,yy,36,4); return yy+4; };
H.coilH=(x,P,x1,x2,y,r,n,col)=>{ x.strokeStyle=col||P.accent; x.lineWidth=2.5; for(let i=0;i<n;i++){ const cx=x1+(i+0.5)*(x2-x1)/n; x.beginPath(); x.ellipse(cx,y,(x2-x1)/n*0.55,r,0,Math.PI*0.5,Math.PI*1.5); x.stroke(); } };
H.rays=(x,P,cx,cy,t,col)=>{ x.save(); x.strokeStyle=col||P.brand; x.lineWidth=1.5; for(let k=0;k<3;k++){ const r=8+((t*30+k*10)%30); x.globalAlpha=1-r/38; x.beginPath(); x.arc(cx,cy,r,-0.6,0.6); x.stroke(); x.beginPath(); x.arc(cx,cy,r,Math.PI-0.6,Math.PI+0.6); x.stroke(); } x.restore(); };
/* schematic circuit symbols, drawn over a wire */
const gap=(x,P,cx,cy,w,h)=>{ x.fillStyle=P.bg; x.fillRect(cx-w/2,cy-h/2,w,h); };
H.sym={
 meter(x,P,cx,cy,s,o){ o=o||{}; gap(x,P,cx,cy,30,30); x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,13,0,7); x.fill(); x.stroke(); T(x,s,cx,cy+5,P.ink,{align:'center',size:13,weight:700}); if(o.val) T(x,o.val,cx+(o.vx||0),cy+(o.vy==null?-20:o.vy),P.brand,{align:o.va||'center',size:13,weight:700,mono:true}); if(o.hot) H.hot(x,P,cx-14,cy-14,28,28); },
 cell(x,P,cx,cy,vert){ x.save(); x.translate(cx,cy); if(vert) x.rotate(Math.PI/2); gap(x,P,0,0,16,34); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(-4,-14); x.lineTo(-4,14); x.stroke(); x.lineWidth=4; x.beginPath(); x.moveTo(4,-7); x.lineTo(4,7); x.stroke(); x.restore(); },
 res(x,P,cx,cy,vert,o){ o=o||{}; x.save(); x.translate(cx,cy); if(vert) x.rotate(Math.PI/2); gap(x,P,0,0,46,20); x.strokeStyle=P.ink2; x.lineWidth=2; x.fillStyle=o.fill||P.surface; x.fillRect(-20,-7,40,14); x.strokeRect(-20,-7,40,14); if(o.variable){ LK.arrow(x,-18,12,20,-13,P.ink2,1.5,7); } x.restore(); },
 sw(x,P,cx,cy,closed){ gap(x,P,cx,cy,36,26); x.strokeStyle=P.ink2; x.lineWidth=2; x.fillStyle=P.ink2; x.beginPath(); x.arc(cx-14,cy,2.5,0,7); x.arc(cx+14,cy,2.5,0,7); x.fill(); x.beginPath(); x.moveTo(cx-14,cy); x.lineTo(cx+14,closed?cy:cy-12); x.stroke(); },
 lamp(x,P,cx,cy,glow){ gap(x,P,cx,cy,30,30); if(glow>0.02){ const g=x.createRadialGradient(cx,cy,2,cx,cy,30); g.addColorStop(0,`rgba(255,200,60,${0.8*glow})`); g.addColorStop(1,'rgba(255,200,60,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,30,0,7); x.fill(); } x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.arc(cx,cy,12,0,7); x.stroke(); x.beginPath(); x.moveTo(cx-8.5,cy-8.5); x.lineTo(cx+8.5,cy+8.5); x.moveTo(cx+8.5,cy-8.5); x.lineTo(cx-8.5,cy+8.5); x.stroke(); },
 diode(x,P,cx,cy,o){ o=o||{}; gap(x,P,cx,cy,30,34); if(o.glow>0.02){ const g=x.createRadialGradient(cx,cy,2,cx,cy,34); g.addColorStop(0,o.col.replace('rgb','rgba').replace(')',','+(0.9*o.glow)+')')); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,34,0,7); x.fill(); }
   x.save(); x.translate(cx,cy); x.rotate(o.rot==null?Math.PI/2:o.rot); x.strokeStyle=P.ink2; x.fillStyle=o.col||P.surface; x.lineWidth=2; x.beginPath(); x.moveTo(-9,-10); x.lineTo(-9,10); x.lineTo(8,0); x.closePath(); x.fill(); x.stroke(); x.beginPath(); x.moveTo(8,-10); x.lineTo(8,10); x.stroke(); if(o.led){ LK.arrow(x,0,-12,8,-22,P.ink2,1.3,5); LK.arrow(x,6,-10,14,-20,P.ink2,1.3,5); } x.restore(); },
 cap(x,P,cx,cy,vert){ x.save(); x.translate(cx,cy); if(vert) x.rotate(Math.PI/2); gap(x,P,0,0,14,30); x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.moveTo(-4,-12); x.lineTo(-4,12); x.moveTo(4,-12); x.lineTo(4,12); x.stroke(); x.restore(); },
 supply(x,P,cx,cy,txt){ gap(x,P,cx,cy,64,34); H.box(x,P,cx-30,cy-15,60,30,P.surface,P.ink2,5); T(x,txt||'supply',cx,cy+4,P.ink,{align:'center',size:11,weight:700}); }
};
H.loop=(x,P,X,Y,w,h,o)=>{ o=o||{}; x.strokeStyle=o.col||P.ink2; x.lineWidth=2; x.strokeRect(X,Y,w,h); };
H.flow=(x,P,pts,t,col,on)=>{ if(!on) return; let L=0; const segs=[]; for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); segs.push([pts[i-1],pts[i],L,d]); L+=d; } x.fillStyle=col||P.brand; for(let s=(t*60)%24; s<L; s+=24){ const g=segs.find(q=>s>=q[2]&&s<=q[2]+q[3]); if(!g) continue; const f=(s-g[2])/g[3]; x.beginPath(); x.arc(g[0][0]+(g[1][0]-g[0][0])*f,g[0][1]+(g[1][1]-g[0][1])*f,2.6,0,7); x.fill(); } };
/* right-hand card */
H.panel=(x,P,st,s)=>{ const X=470,Y=12,w=162,h=316; H.box(x,P,X,Y,w,h,P.surface,P.line,12);
  T(x,'YOU SET',X+14,Y+26,P.muted,{size:10.5,weight:700}); T(x,s.x.label,X+14,Y+44,P.ink2,{size:12}); T(x,st.fx(st.xv),X+14,Y+68,P.ink,{size:18,weight:700,mono:true});
  x.strokeStyle=P.line; x.lineWidth=1; x.beginPath(); x.moveTo(X+12,Y+86); x.lineTo(X+w-12,Y+86); x.stroke();
  T(x,'YOU MEASURE',X+14,Y+108,P.muted,{size:10.5,weight:700}); T(x,s.y.label,X+14,Y+126,P.ink2,{size:12});
  const val = st.show ? st.fy(st.ys[0]) : (st.busy ? 'measuring…' : '—'); T(x,val,X+14,Y+152,st.show?P.brand:P.muted,{size:st.show?18:14,weight:700,mono:st.show});
  if(st.show && st.ys.length>1){ T(x,'repeats:',X+14,Y+176,P.muted,{size:11}); st.ys.slice(0,5).forEach((v,i)=>T(x,st.fy(v),X+14+(i%2)*74,Y+194+Math.floor(i/2)*16,P.ink2,{size:11.5,mono:true})); const m=st.ys.reduce((p,q)=>p+q,0)/st.ys.length; T(x,'mean '+st.fy(m),X+14,Y+250,P.ink,{size:12.5,weight:700,mono:true}); }
  const pd=window.PAGDRAW[st.id]; if(pd&&pd.extra){ const ex=pd.extra(st); if(ex) ex.forEach((e,i)=>{ T(x,e[0],X+14,Y+272+i*20,P.muted,{size:11}); T(x,e[1],X+w-14,Y+272+i*20,P.ink,{size:12,weight:700,mono:true,align:'right'}); }); }
  if(!st.busy && !st.show) H.lab(x,P,'Press Take reading',X+w/2,Y+h-14,{col:P.muted,size:11});
};
const D={};
window.PAGDRAW=D;

/* ===== PAG 1.1  g by free fall ===== */
D['p1-1']={dur:4.2,reveal:0.86,
 idle:'The ball hangs from an electromagnet. Choose a drop height h, then press Take reading.',
 steps:[[0,'Switch off the electromagnet: the ball drops and the timer starts at the same instant'],[0.14,'The ball speeds up as it falls through height h'],[0.78,'The ball hits the trapdoor, which swings open and stops the timer'],[0.86,'Read the time t from the timer. Repeats are averaged']],
 draw(x,P,st){ const h=st.xv, a=st.a, bot=318, trap=292, sc=230/1.2; const yM=trap-8-h*sc-16; H.bench(x,P,bot);
  H.stand(x,P,70,bot,24); H.arm(x,P,70,yM-26,232);
  const on=a<0.12; H.box(x,P,196,yM-26,40,24,on?P.accent:P.line2,P.ink2,4); T(x,on?'ON':'OFF',216,yM-9,on?'#fff':P.ink2,{align:'center',size:10,weight:700});
  const fall=seg(a,0.14,0.78), yb=(yM+6)+fall*fall*(trap-6-(yM+6)); x.fillStyle=P.ink; x.beginPath(); x.arc(216,yb,7,0,7); x.fill();
  H.box(x,P,186,trap,60,bot-trap,P.line,P.ink2,2); x.save(); x.translate(192,trap); x.rotate(a>0.78?0.9*seg(a,0.78,0.84):0); x.fillStyle=P.brand; x.fillRect(0,-4,50,5); x.restore();
  H.dim(x,P,268,yM+13,268,trap-1,'h = '+h.toFixed(2)+' m',{align:'left',dx:6});
  const t = a<0.14?0 : a<0.78? st.y*fall : st.y; const busy=st.busy||st.show;
  const m=H.meter(x,P,330,yM<120?150:70,busy?t.toFixed(3)+' s':'0.000 s','electronic timer',{hot:st.busy&&a>0.8});
  H.wire(x,P,[[236,yM-14],[300,yM-14],[300,m.l[1]-8],[330,m.l[1]-8]],P.ink2,1.5); H.wire(x,P,[[246,trap+8],[300,trap+8],[300,m.l[1]+8],[330,m.l[1]+8]],P.ink2,1.5);
  H.note(x,P,'electromagnet',216,yM-26,216,yM-40,{align:'center'}); H.note(x,P,'steel ball',222,yb,250,Math.min(yb+34,trap-40),{align:'left'}); H.note(x,P,'trapdoor',246,trap+4,300,trap+18,{align:'left'});
  T(x,'clamp stand',70,bot+0-14,P.muted,{size:11,align:'center'}); } };

/* ===== PAG 1.2  terminal velocity ===== */
D['p1-2']={dur:4.4,reveal:0.86,
 idle:'A tall tube of glycerol has two rubber bands 30 cm apart. Choose a ball size, then press Take reading.',
 steps:[[0,'Drop the ball gently into the centre of the glycerol'],[0.1,'It speeds up for a short distance, then falls at a steady terminal velocity'],[0.26,'Start the stopwatch as the ball passes band A — with your eye level with the band'],[0.82,'Stop the stopwatch at band B. Terminal velocity v = 0.30 m ÷ time']],
 draw(x,P,st){ const d=st.xv, a=st.a, X0=150, X1=230, top=24, bot=322, fl=44, bA=118, bB=278; H.bench(x,P,bot);
  x.fillStyle=P.accentSoft; x.fillRect(X0,fl,X1-X0,bot-fl); x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.moveTo(X0,top); x.lineTo(X0,bot); x.lineTo(X1,bot); x.lineTo(X1,top); x.stroke();
  [bA,bB].forEach(y=>{ x.strokeStyle=P.brand; x.lineWidth=5; x.beginPath(); x.moveTo(X0-3,y); x.lineTo(X1+3,y); x.stroke(); });
  H.dim(x,P,X1+26,bA,X1+26,bB,'30 cm',{align:'left',dx:6});
  // position: speeds up quickly, then constant speed; passes A at a=0.26 and B at a=0.82
  let y; if(a<0.06) y=top+10; else if(a<0.16){ const f=seg(a,0.06,0.16); y=fl-4+f*f*24; } else y=fl+20+(a-0.16)*(bB-fl-20)/(0.82-0.16)*1.0; if(a>0.82) y=bB+(a-0.82)/(0.18)*(bot-12-bB); y=Math.min(y,bot-10);
  if(st.busy||st.show){ x.fillStyle=P.ink; x.beginPath(); x.arc((X0+X1)/2,y,2+d*0.9,0,7); x.fill(); }
  const ey= a<0.5?bA:bB; if(st.busy){ x.fillStyle=P.ink2; x.beginPath(); x.ellipse(96,ey,11,7,0,0,7); x.fill(); x.fillStyle=P.surface; x.beginPath(); x.arc(100,ey,3.5,0,7); x.fill(); x.setLineDash([4,4]); x.strokeStyle=P.muted; x.lineWidth=1; x.beginPath(); x.moveTo(110,ey); x.lineTo(X0,ey); x.stroke(); x.setLineDash([]); T(x,'eye level',96,ey+22,P.muted,{align:'center',size:11}); }
  const tm = a<0.26?0 : a<0.82? st.y*seg(a,0.26,0.82) : st.y; H.stopwatch(x,P,380,120,tm,{label:'stopwatch',hot:st.busy&&a>0.82});
  H.note(x,P,'glycerol',X1-8,300,X1+30,316,{align:'left'}); H.note(x,P,'band A',X0,bA,96,bA-26); H.note(x,P,'band B',X0,bB,96,bB+30);
  H.lab(x,P,'ball diameter '+d.toFixed(1)+' mm',(X0+X1)/2,top-6,{size:11.5,col:P.muted}); } ,
 extra:st=>st.show?[['v = 0.30/t',(0.30/st.ys[0]).toPrecision(3)+' m/s']]:null };

/* ===== PAG 1.3  stopping distance ===== */
D['p1-3']={dur:4.4,reveal:0.86,
 idle:'A trolley rolls down a ramp, through a light gate, onto carpet. Choose the speed, then press Take reading.',
 steps:[[0,'Release the trolley from the marked point on the ramp (higher = faster)'],[0.32,'The card on the trolley cuts the light beam: the data-logger works out v = card length ÷ time'],[0.4,'Friction from the carpet decelerates the trolley until it stops'],[0.86,'Measure the stopping distance d along the carpet with a metre rule']],
 draw(x,P,st){ const v=st.xv, a=st.a, yb=268, rx0=16, ry0=92, rx1=170; const sc=360; H.bench(x,P,yb+6);
  x.fillStyle=P.line; x.beginPath(); x.moveTo(rx0,ry0); x.lineTo(rx1,yb); x.lineTo(rx0,yb); x.closePath(); x.fill(); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.moveTo(rx0,ry0); x.lineTo(rx1,yb); x.lineTo(456,yb); x.stroke();
  for(let i=200;i<452;i+=6){ x.fillStyle=i%12?P.accentSoft:P.soft; x.fillRect(i,yb-4,6,4); } T(x,'carpet',330,yb+26,P.muted,{size:11,align:'center'});
  const f0=cl((v*v)/(4.2),0.12,1); const sx=rx1-(rx1-rx0)*f0, sy=yb-(yb-ry0)*f0; x.fillStyle=P.brand; x.beginPath(); x.moveTo(sx-6,sy-6); x.lineTo(sx+6,sy+6); x.stroke(); T(x,'release',sx-4,sy-14,P.brand,{size:11,align:'center',weight:700});
  const d=st.y; let px,py,ang=0; const ang0=Math.atan2(yb-ry0,rx1-rx0);
  if(a<0.32){ const f=ease(seg(a,0.02,0.32)); px=sx+(rx1-sx)*f; py=sy+(yb-sy)*f; ang=ang0; } else { const f=seg(a,0.36,0.84); const s=1-Math.pow(1-f,2); px=rx1+18+s*d*sc; py=yb; }
  if(!(st.busy||st.show)){ px=sx; py=sy; ang=ang0; }
  x.save(); x.translate(px,py); x.rotate(ang); x.fillStyle=P.deep; LK.rr(x,-22,-20,44,14,4); x.fill(); x.fillStyle=P.ink2; x.fillRect(-2,-34,4,14); x.fillStyle=P.ink; x.beginPath(); x.arc(-13,-4,4.5,0,7); x.arc(13,-4,4.5,0,7); x.fill(); x.restore();
  x.fillStyle=P.ink2; x.fillRect(184,yb-60,6,60); x.fillRect(214,yb-60,6,60); x.fillRect(184,yb-62,36,6); x.strokeStyle='#e0245e'; x.lineWidth=1; x.setLineDash([3,3]); x.beginPath(); x.moveTo(190,yb-26); x.lineTo(214,yb-26); x.stroke(); x.setLineDash([]);
  const m=H.meter(x,P,250,36,(st.busy&&a>0.34)||st.show? v.toFixed(2)+' m/s':'— m/s','data-logger',{hot:st.busy&&a>0.32&&a<0.45}); H.wire(x,P,[[202,yb-62],[202,62],[250,62]],P.ink2,1.5);
  if((st.busy&&a>0.84)||st.show){ H.dim(x,P,rx1+18,yb+40,rx1+18+d*sc,yb+40,'d = '+d.toFixed(3)+' m',{dy:-6}); }
  H.note(x,P,'light gate',202,yb-60,150,40); H.note(x,P,'ramp',70,200,40,236,{align:'center'}); } };

/* ===== PAG 2.1  Young modulus ===== */
D['p2-1']={dur:4,reveal:0.8,
 idle:'A long copper wire runs along the bench, over a pulley, to a mass hanger. Choose a load, then press Take reading.',
 steps:[[0,'Add slotted masses to the hanger: the load is F = mg'],[0.3,'The wire stretches. The tape marker moves along the metre rule'],[0.65,'Read the marker (see the magnified view). Extension = new reading − reading with no extra load']],
 draw(x,P,st){ const F=st.xv, a=st.a, yw=120; const busy=st.busy||st.show; const Fn= busy? (st.busy? F*seg(a,0.05,0.3):F):0; const ext= busy?(st.busy? st.y*ease(seg(a,0.3,0.6)):st.y):0;
  H.bench(x,P,yw+8,6,420); x.fillStyle=P.ink2; x.fillRect(8,yw-16,18,24); T(x,'clamp',17,yw-22,P.muted,{size:11,align:'center'});
  x.strokeStyle='#c96a2c'; x.lineWidth=2; x.beginPath(); x.moveTo(26,yw-2); x.lineTo(408,yw-2); x.stroke(); x.strokeStyle=P.ink2; x.lineWidth=2; x.beginPath(); x.arc(414,yw+6,10,0,7); x.stroke(); x.strokeStyle='#c96a2c'; x.beginPath(); x.moveTo(424,yw+6); x.lineTo(424,yw+48); x.stroke();
  const n=Math.round(Fn/4); H.mass(x,P,424,yw+48,n);
  for(let i=0;i<24;i++){ x.fillStyle=i%2?P.line2:P.line; x.fillRect(240+i*7,yw+1,7,6); }
  const mx=330+ext*2.2; x.fillStyle=P.brand; x.fillRect(mx-3,yw-14,6,12); T(x,'marker',mx,yw-18,P.brand,{size:11,align:'center',weight:700});
  // magnified view
  const IX=40, IY=200, IW=360, IH=110; H.box(x,P,IX,IY,IW,IH,P.surface,P.line2,10); T(x,'magnified view of the marker against the rule (mm)',IX+12,IY+20,P.muted,{size:11});
  const z=IW/20; for(let mm=0;mm<=20;mm++){ const px=IX+mm*z; x.strokeStyle=P.ink2; x.lineWidth=1; x.beginPath(); x.moveTo(px,IY+IH-14); x.lineTo(px,IY+IH-14-(mm%5?8:16)); x.stroke(); if(mm%5===0) T(x,String(mm),px,IY+IH-2,P.ink2,{size:10.5,align:'center'}); }
  const pm=IX+(2+ext)*z; x.fillStyle=P.brand; x.fillRect(pm-4,IY+34,8,40); x.strokeStyle=P.brand; x.setLineDash([3,3]); x.beginPath(); x.moveTo(pm,IY+74); x.lineTo(pm,IY+IH-14); x.stroke(); x.setLineDash([]);
  x.fillStyle=P.muted; x.fillRect(IX+2*z-1,IY+60,2,14); T(x,'start',IX+2*z,IY+56,P.muted,{size:10,align:'center'});
  if(busy&&ext>0.05) H.dim(x,P,IX+2*z,IY+44,pm,IY+44,'',{});
  H.note(x,P,'copper wire, 2.50 m',150,yw-2,150,yw-40,{align:'center'}); H.note(x,P,'pulley',414,yw-4,380,yw-34); T(x,'load F = '+Fn.toFixed(0)+' N',404,yw+64,P.ink,{size:12,weight:700,align:'right'});
 } };

/* ===== PAG 2.2  springs ===== */
D['p2-2']={dur:4,reveal:0.8,
 idle:'Springs hang from a clamp with a pointer beside a vertical metre rule. Choose the load and arrangement, then press Take reading.',
 steps:[[0,'Hang the masses on the spring(s). Each 100 g gives about 1 N'],[0.2,'The spring stretches and bounces, then settles'],[0.62,'Read where the pointer is on the rule. Extension x = this reading − the reading with no load']],
 draw(x,P,st){ const F=st.xv, o=st.opt||'1', a=st.a, top=34, bot=322; const busy=st.busy||st.show; H.bench(x,P,bot); H.stand(x,P,60,bot,20); H.arm(x,P,60,top,240);
  const sc=4.2; let e= busy? st.y : 0; if(st.busy){ const f=seg(a,0.15,0.62); e = st.y*(1-Math.exp(-6*f)*Math.cos(14*f)); if(a<0.15) e=0; }
  const L0=70, cx=180; let yb;
  x.strokeStyle=P.brand; x.lineWidth=2;
  if(o==='1'){ yb=top+L0+e*sc; LK.spring(x,cx,top,cx,yb,10,10); }
  else if(o==='s'){ const h=(L0+e*sc)/2; LK.spring(x,cx,top,cx,top+h,8,9); x.fillStyle=P.ink2; x.fillRect(cx-6,top+h,12,5); x.strokeStyle=P.teal; LK.spring(x,cx,top+h+5,cx,top+2*h+5,8,9); yb=top+2*h+5; }
  else { yb=top+L0+e*sc; LK.spring(x,cx-18,top,cx-18,yb,10,8); x.strokeStyle=P.teal; LK.spring(x,cx+18,top,cx+18,yb,10,8); x.fillStyle=P.ink2; x.fillRect(cx-26,yb,52,5); yb+=5; }
  x.fillStyle=P.accent; x.beginPath(); x.moveTo(cx,yb); x.lineTo(cx+70,yb); x.lineTo(cx+70,yb+3); x.lineTo(cx,yb+3); x.fill(); T(x,'pointer',cx+66,yb-6,P.accent,{size:11,align:'right',weight:700});
  const n= busy? Math.round(F/0.5):0; H.mass(x,P,cx,yb+3,Math.min(n,12));
  const rx=cx+74, r0=top+L0+(o==='s'?5:o==='p'?5:0); x.fillStyle=P.surface; x.fillRect(rx,r0-20,30,260); x.strokeStyle=P.ink2; x.lineWidth=1; x.strokeRect(rx,r0-20,30,260);
  for(let cm=-4;cm<=55;cm++){ const y=r0+cm*sc; if(y<r0-18||y>r0+238) continue; x.beginPath(); x.moveTo(rx,y); x.lineTo(rx+(cm%5?6:12),y); x.stroke(); if(cm%10===0) T(x,String(cm),rx+28,y+4,P.ink2,{size:10,align:'right'}); }
  T(x,'rule / cm',rx+15,r0-26,P.muted,{size:10.5,align:'center'});
  if(busy) H.dim(x,P,rx+48,r0,rx+48,yb,'x',{align:'left',dx:6});
  H.lab(x,P,o==='1'?'single spring':o==='s'?'two springs in series':'two springs in parallel',cx,bot-8,{col:P.muted,size:11.5}); } };

/* ===== PAG 3.1  resistivity ===== */
D['p3-1']={dur:4,reveal:0.66,
 idle:'A thin wire is taped along a metre rule. Choose a length L between the crocodile clips, then press Take reading.',
 steps:[[0,'Move the sliding crocodile clip so length L of wire is in the circuit'],[0.3,'Close the switch briefly: current flows through the wire'],[0.5,'Read the voltmeter (p.d. across the wire) and ammeter (current). R = V ÷ I'],[0.86,'Open the switch so the wire does not heat up between readings']],
 draw(x,P,st){ const L=st.xv, a=st.a, ry=90, x0=40, sc=3.8; const busy=st.busy||st.show; const Lc = st.busy? L*ease(seg(a,0,0.28)) + (st.prevX!=null?st.prevX:L)*(1-ease(seg(a,0,0.28))) : L; const xc=x0+Lc*sc; const closed=st.busy&&a>0.3&&a<0.86;
  x.fillStyle='#f3d9a4'; x.fillRect(x0-10,ry,400,22); x.strokeStyle=P.ink2; x.lineWidth=1; x.strokeRect(x0-10,ry,400,22); for(let c=0;c<=100;c+=5){ const px=x0+c*sc; x.beginPath(); x.moveTo(px,ry+22); x.lineTo(px,ry+22-(c%10?5:9)); x.stroke(); if(c%20===0) T(x,String(c),px,ry+40,P.ink2,{size:10,align:'center'}); }
  T(x,'metre rule / cm',x0+190,ry+54,P.muted,{size:10.5,align:'center'});
  x.strokeStyle='#b87333'; x.lineWidth=2; x.beginPath(); x.moveTo(x0-6,ry+6); x.lineTo(x0+385,ry+6); x.stroke();
  const clip=(cx,c)=>{ x.fillStyle=c; x.beginPath(); x.moveTo(cx-5,ry-16); x.lineTo(cx+5,ry-16); x.lineTo(cx+3,ry+8); x.lineTo(cx-3,ry+8); x.fill(); };
  clip(x0,P.ink); clip(xc,'#e0245e');
  if(closed) H.flow(x,P,[[x0,ry+6],[xc,ry+6]],now(),P.brand,true);
  // circuit below: cell, switch, ammeter in series; voltmeter across the clips
  const cy=250; H.wire(x,P,[[x0,ry-16],[x0,ry-40],[20,ry-40],[20,cy],[430,cy],[430,ry-56],[xc,ry-56],[xc,ry-16]]);
  H.sym.cell(x,P,110,cy); H.sym.sw(x,P,200,cy,closed); const I=closed||st.show? 1.5/(st.y+2):0; H.sym.meter(x,P,300,cy,'A',{val:(closed||st.show)?I.toFixed(3)+' A':'0.000 A',vy:28,hot:st.busy&&a>0.5&&a<0.86});
  H.wire(x,P,[[x0,ry+8],[x0,ry+70],[150,ry+70]]); H.wire(x,P,[[xc,ry+8],[xc,ry+70],[150,ry+70]]); H.sym.meter(x,P,Math.max(x0+30,Math.min(xc-30,(x0+xc)/2)),ry+70,'V',{val:(closed||st.show)?(I*st.y).toFixed(3)+' V':'0.000 V',vy:28,hot:st.busy&&a>0.5&&a<0.86});
  H.dim(x,P,x0,ry-26,xc,ry-26,'L = '+L.toFixed(0)+' cm',{dy:-6});
  H.note(x,P,'switch',200,cy-8,220,cy-32,{align:'left'}); H.note(x,P,'cell',110,cy-14,96,cy-32,{align:'right'});
 }, extra:st=>st.show?[['R = V/I',st.ys[0].toFixed(2)+' Ω']]:null };

/* ===== PAG 3.2  I–V ===== */
D['p3-2']={dur:3.6,reveal:0.7,
 idle:'The component is in series with an ammeter, with a voltmeter across it. Choose the p.d., then press Take reading.',
 steps:[[0,'Turn the potential divider knob to set the p.d. across the component'],[0.4,'The voltmeter shows the p.d. across the component; the ammeter shows the current through it'],[0.7,'Record V and I. For negative p.d.s, reverse the supply connections']],
 draw(x,P,st){ const V=st.xv, o=st.opt||'l', a=st.a; const busy=st.busy||st.show; const f=st.busy?ease(seg(a,0.05,0.45)):(st.show?1:0); const Vn=V*f; const meas=window.PAGS.list.find(q=>q.id==='p3-2').sim.meas; const I=meas(Vn,o);
  const X0=50,Y0=60,X1=400,Y1=250; H.loop(x,P,X0,Y0,X1-X0,Y1-Y0);
  // supply on left side, ammeter top, component right side, voltmeter across component
  H.sym.supply(x,P,X0,(Y0+Y1)/2,'0–6 V'); const kn=-2.3+4.6*((Vn+6)/12); x.strokeStyle=P.brand; x.lineWidth=3; x.beginPath(); x.arc(X0-46,(Y0+Y1)/2,12,0,7); x.stroke(); x.beginPath(); x.moveTo(X0-46,(Y0+Y1)/2); x.lineTo(X0-46+Math.sin(kn)*11,(Y0+Y1)/2-Math.cos(kn)*11); x.stroke(); T(x,'knob',X0-46,(Y0+Y1)/2+28,P.muted,{size:10.5,align:'center'});
  H.sym.meter(x,P,(X0+X1)/2-40,Y0,'A',{val:(busy? I.toFixed(1):'0.0')+' mA',hot:st.busy&&a>0.45});
  const cy=(Y0+Y1)/2; if(o==='r') H.sym.res(x,P,X1,cy,true); else if(o==='l') H.sym.lamp(x,P,X1,cy,Math.min(1,Math.abs(I)/500)); else { H.sym.res(x,P,X1,Y0+40,true); H.sym.diode(x,P,X1,cy+30,{col:P.surface}); }
  const cTop=o==='d'?cy+6:cy-24, cBot=o==='d'?cy+54:cy+24; H.wire(x,P,[[X1,cTop],[X1+44,cTop],[X1+44,cBot],[X1,cBot]]); H.sym.meter(x,P,X1+44,(cTop+cBot)/2,'V',{val:(busy?Vn.toFixed(2):'0.00')+' V',vx:0,va:'center',vy:32,hot:st.busy&&a>0.45});
  if(busy&&Math.abs(I)>0.5) H.flow(x,P,Vn>=0?[[X0,Y1],[X0,Y0],[X1,Y0],[X1,Y1],[X0,Y1]]:[[X0,Y0],[X0,Y1],[X1,Y1],[X1,Y0],[X0,Y0]],now()*Math.min(1,Math.abs(I)/200+0.3),P.brand,true);
  T(x,o==='r'?'resistor':o==='l'?'filament lamp':'diode + protective resistor',X1-14,Y1+30,P.ink2,{size:12,align:'right',weight:700});
  if(Vn<0) T(x,'supply reversed',X0,Y1+30,P.brand,{size:12,weight:700}); } };

/* ===== PAG 3.3  internal resistance ===== */
D['p3-3']={dur:3.8,reveal:0.7,
 idle:'The cell has a hidden internal resistance r. Choose the load resistance, then press Take reading.',
 steps:[[0,'Set the variable resistor to the chosen load R'],[0.25,'Close the switch: current flows round the circuit'],[0.5,'Read V across the cell terminals and the current I. Some energy is lost inside the cell, so V < ε'],[0.86,'Open the switch so the cell does not run down or heat up']],
 draw(x,P,st){ const R=st.xv, a=st.a; const closed=(st.busy&&a>0.25&&a<0.86); const on=closed||st.show; const V=on?st.y:1.55, I=on?st.y/R:0;
  const X0=60,Y0=60,X1=380,Y1=250; H.loop(x,P,X0,Y0,X1-X0,Y1-Y0);
  x.save(); x.setLineDash([5,4]); x.strokeStyle=P.brand; x.lineWidth=1.5; LK.rr(x,X0-36,120,72,80,8); x.stroke(); x.restore(); H.sym.cell(x,P,X0,145,true); H.sym.res(x,P,X0,180,true,{fill:P.soft}); T(x,'inside the cell',X0,214,P.brand,{size:10.5,align:'center',weight:700}); T(x,'ε',X0+18,150,P.ink,{size:13,weight:700}); T(x,'r',X0+18,186,P.ink,{size:13,weight:700});
  H.sym.sw(x,P,170,Y0,closed); H.sym.meter(x,P,270,Y0,'A',{val:on?I.toFixed(3)+' A':'0.000 A',hot:st.busy&&a>0.5&&a<0.86}); H.sym.res(x,P,X1,(Y0+Y1)/2,true,{variable:true}); T(x,'R = '+R.toFixed(1)+' Ω',X1+30,(Y0+Y1)/2+4,P.ink,{size:12,weight:700});
  H.wire(x,P,[[X0,110],[X0-60,110],[X0-60,215],[X0,215]]); x.fillStyle=P.ink2; [[X0,110],[X0,215]].forEach(p=>{ x.beginPath(); x.arc(p[0],p[1],3,0,7); x.fill(); }); H.sym.meter(x,P,X0-60,162,'V',{val:on?V.toFixed(3)+' V':'—',vx:-18,va:'right',vy:4,hot:st.busy&&a>0.5&&a<0.86});
  if(closed) H.flow(x,P,[[X0,Y0+40],[X0,Y0],[X1,Y0],[X1,Y1],[X0,Y1],[X0,Y0+40]],now(),P.brand,true);
  T(x,'switch',170,Y0-20,P.muted,{size:11,align:'center'}); T(x,'variable resistor',X1,Y1+22,P.muted,{size:11,align:'center'}); },
 extra:st=>st.show?[['I = V/R',(st.ys[0]/st.xv).toFixed(3)+' A']]:null };

/* ===== PAG 4.3  thermistor ===== */
D['p4-3']={dur:4.2,reveal:0.82,
 idle:'A thermistor (sealed in a test tube) and a thermometer sit in a beaker of water. Choose the water temperature, then press Take reading.',
 steps:[[0,'Heat the water (or add ice) to reach the chosen temperature'],[0.3,'Stir, and wait for the thermometer reading to settle'],[0.6,'The ohmmeter reading changes as the thermistor warms or cools'],[0.82,'Record θ and R once both are steady. Higher θ → lower R for an NTC thermistor']],
 draw(x,P,st){ const th=st.xv, a=st.a; const busy=st.busy||st.show; const t0=st.prevX!=null?st.prevX:20; const tc= st.busy? t0+(th-t0)*ease(seg(a,0.02,0.55)) : th; const meas=window.PAGS.list.find(q=>q.id==='p4-3').sim.meas; const Rc= st.busy? meas(t0+(th-t0)*ease(seg(a,0.15,0.75))) : meas(th);
  const bx=110,by=120,bw=170,bh=170; H.bench(x,P,by+bh+24); x.fillStyle=P.ink2; x.fillRect(bx-10,by+bh,bw+20,6); x.fillRect(bx,by+bh+6,6,18); x.fillRect(bx+bw-6,by+bh+6,6,18);
  const hot=cl((tc-5)/85,0,1); x.fillStyle=`rgba(${Math.round(120+135*hot)},${Math.round(180-80*hot)},${Math.round(230-150*hot)},0.45)`; x.fillRect(bx,by+30,bw,bh-30); H.beaker(x,P,bx,by,bw,bh);
  if(st.busy&&a<0.55&&th>t0){ for(let i=0;i<3;i++){ const ph=(now()*1.5+i/3)%1; x.fillStyle='rgba(255,140,60,'+(0.7-0.6*ph)+')'; x.beginPath(); x.moveTo(bx+40+i*45,by+bh+46); x.quadraticCurveTo(bx+30+i*45,by+bh+30-ph*10,bx+40+i*45,by+bh+22-ph*10); x.quadraticCurveTo(bx+50+i*45,by+bh+30-ph*10,bx+40+i*45,by+bh+46); x.fill(); } T(x,'heat',bx+bw+14,by+bh+42,P.muted,{size:11}); }
  if(st.busy&&a<0.55&&th<t0){ for(let i=0;i<4;i++){ x.fillStyle=P.surface; x.strokeStyle=P.teal; x.lineWidth=1.5; x.fillRect(bx+20+i*36,by+40+Math.sin(now()*2+i)*4,18,16); x.strokeRect(bx+20+i*36,by+40+Math.sin(now()*2+i)*4,18,16); } T(x,'ice',bx+bw+12,by+56,P.muted,{size:11}); }
  x.strokeStyle=P.ink2; x.lineWidth=2; LK.rr(x,bx+30,by-30,22,bh-20,10); x.stroke(); x.fillStyle=P.ink; x.beginPath(); x.ellipse(bx+41,by+bh-62,6,9,0,0,7); x.fill(); T(x,'thermistor',bx+41,by+bh-36,P.ink2,{size:10.5,align:'center',weight:700});
  H.thermo(x,P,bx+110,by-40,by+bh-20,(tc-0)/100,{label:tc.toFixed(0)+' °C'});
  const sx=bx+140+Math.sin(st.busy&&a>0.3&&a<0.6?now()*10:0)*10; x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.moveTo(sx,by-30); x.lineTo(sx,by+bh-14); x.stroke(); x.beginPath(); x.moveTo(sx-10,by+bh-14); x.lineTo(sx+10,by+bh-14); x.stroke(); T(x,'stirrer',sx+8,by+bh-24,P.muted,{size:10.5});
  H.wire(x,P,[[bx+37,by-30],[bx+37,by-60],[330,by-60],[330,by-40]],P.ink2,1.5); H.wire(x,P,[[bx+45,by-30],[bx+45,by-52],[350,by-52],[350,by-40]],P.ink2,1.5);
  H.meter(x,P,300,by-40,(busy?Rc.toFixed(2):meas(th).toFixed(2))+' kΩ','ohmmeter',{w:110,hot:st.busy&&a>0.82});
  if(st.busy&&a>0.3&&a<0.82) T(x,'waiting for readings to settle…',230,330,P.muted,{size:11.5,align:'center'}); } };

/* ===== PAG 5.1  diffraction grating ===== */
D['p5-1']={dur:3.8,reveal:0.72,
 idle:'Top view: a laser shines through a grating with 300 lines per mm onto a screen. Choose the order n, then press Take reading.',
 steps:[[0,'Switch on the laser: the grating splits the beam into bright spots (orders) either side of the centre'],[0.3,'Find the nth-order spot on each side of the central spot'],[0.55,'Measure the angle θ between the straight-through beam and the nth-order beam (or use tan θ = y/D)'],[0.72,'Record θ. Then d sin θ = nλ, with d = 1/300 mm']],
 draw(x,P,st){ const n=st.xv, a=st.a, gx=150, gy=170; const on= st.busy? a>0.03 : st.show; const lam=650e-9, d=1/300e3, col=LK.wl2rgb(650);
  x.fillStyle=P.ink2; LK.rr(x,20,gy-12,80,24,5); x.fill(); T(x,'laser',60,gy+4,'#fff',{size:11,align:'center',weight:700}); x.fillStyle=P.ink2; x.fillRect(gx-3,gy-50,6,100); T(x,'grating',gx,gy-58,P.ink2,{size:11,align:'center',weight:700});
  const SX=440; x.fillStyle=P.line; x.fillRect(SX,14,8,312); T(x,'screen',SX+4,336,P.ink2,{size:11,align:'center'});
  if(on){ x.save(); x.strokeStyle=col; x.lineWidth=3; x.globalAlpha=0.9; x.beginPath(); x.moveTo(100,gy); x.lineTo(gx,gy); x.stroke(); x.restore();
    for(let k=-5;k<=5;k++){ const s=k*lam/d; if(Math.abs(s)>=1) continue; const th=Math.asin(s); const L=st.busy? (SX-gx)/Math.cos(th)*seg(a,0.03,0.3) : (SX-gx)/Math.cos(th); let ex=gx+Math.cos(th)*L, ey=gy+Math.sin(th)*L; let off=false; if(ey<14||ey>326){ off=true; const t=(th>0?(326-gy):(14-gy))/Math.sin(th); ex=gx+Math.cos(th)*Math.min(L,t); ey=gy+Math.sin(th)*Math.min(L,t); }
      x.save(); x.strokeStyle=col; x.globalAlpha=Math.abs(k)===n?0.95:0.35; x.lineWidth=Math.abs(k)===n?2.5:1.5; x.beginPath(); x.moveTo(gx,gy); x.lineTo(ex,ey); x.stroke(); x.restore();
      if(!off&&(!st.busy||a>0.3)){ x.fillStyle=col; x.beginPath(); x.arc(SX,ey,Math.abs(k)===n?6:4,0,7); x.fill(); T(x,String(k),SX-10,ey+4,P.muted,{size:10,align:'right'}); } } }
  if(on&&(!st.busy||a>0.45)){ const th=Math.asin(n*lam/d); x.strokeStyle=P.brand; x.lineWidth=2; x.beginPath(); x.arc(gx,gy,60,0,th); x.stroke(); T(x,'θ',gx+68*Math.cos(th/2)+4,gy+68*Math.sin(th/2)+4,P.brand,{size:15,weight:700}); x.setLineDash([4,4]); x.strokeStyle=P.muted; x.lineWidth=1; x.beginPath(); x.moveTo(gx,gy); x.lineTo(SX,gy); x.stroke(); x.setLineDash([]);
    if(st.show||a>0.55) T(x,'θ = '+(st.show?st.ys[0]:st.y).toFixed(1)+'°',gx+80,gy+120,P.brand,{size:14,weight:700}); }
  T(x,'order n = '+n,gx+8,30,P.ink,{size:13,weight:700}); } };

/* ===== PAG 5.2  resonance tube ===== */
D['p5-2']={dur:5,reveal:0.8,
 idle:'A glass tube stands in a tall measuring cylinder filled almost to the top with water. The water closes the bottom of the air column. Choose a tuning fork, then press Take reading.',
 steps:[[0,'Strike the tuning fork and hold it just above the open top of the tube'],[0.1,'Slowly raise the tube out of the water: the air column above the water gets longer'],[0.55,'At one length the sound suddenly gets much louder: the air column resonates (a stationary wave fits in it)'],[0.8,'Measure L from the water surface to the top of the tube. Here L + e = λ/4']],
 draw(x,P,st){ const f=st.xv, a=st.a; const Lr=st.y; const sc=2.5; const busy=st.busy||st.show;
  const cx0=168, cx1=252, rim=132, bot=326, water=142; H.bench(x,P,bot);
  // measuring cylinder: foot, walls, spout, water, graduations
  x.fillStyle=P.surface; x.strokeStyle=P.ink2; x.lineWidth=2; x.fillRect(cx0-22,bot-8,cx1-cx0+44,8); x.strokeRect(cx0-22,bot-8,cx1-cx0+44,8);
  x.fillStyle=P.tealSoft; x.fillRect(cx0,water,cx1-cx0,bot-8-water);
  x.strokeStyle=P.ink2; x.lineWidth=2.5; x.beginPath(); x.moveTo(cx0-6,rim-6); x.lineTo(cx0,rim); x.lineTo(cx0,bot-8); x.moveTo(cx1,bot-8); x.lineTo(cx1,rim); x.stroke();
  x.strokeStyle=P.teal; x.lineWidth=1.5; x.beginPath(); x.moveTo(cx0,water); x.lineTo(cx1,water); x.stroke();
  x.strokeStyle=P.muted; x.lineWidth=1; for(let k=0;k<=16;k++){ const yy=bot-18-k*10.5; if(yy<rim+6) break; const big=k%4===0; x.beginPath(); x.moveTo(cx1-(big?14:8),yy); x.lineTo(cx1,yy); x.stroke(); if(big&&k) T(x,String(k*25),cx1-16,yy+3,P.muted,{size:8,align:'right'}); }
  T(x,'ml',cx1-4,bot-14,P.muted,{size:8,align:'right'});
  const Lstart=Math.max(4,Lr*0.35); const L= st.busy? (a<0.1?Lstart: a<0.62? Lstart+(Lr*1.0-Lstart)*ease(seg(a,0.1,0.62)) : Lr) : (st.show?Lr:Lstart+2);
  const tx0=194, tx1=226, ttop=water-L*sc, tbot=bot-22;
  x.fillStyle=P.surface; x.globalAlpha=0.55; x.fillRect(tx0,ttop,tx1-tx0,water-ttop); x.globalAlpha=1;
  x.strokeStyle=P.ink; x.lineWidth=2.5; x.beginPath(); x.moveTo(tx0,ttop); x.lineTo(tx0,tbot); x.moveTo(tx1,ttop); x.lineTo(tx1,tbot); x.stroke();
  H.stand(x,P,70,bot,30); H.arm(x,P,70,Math.max(ttop+16,40),tx0);
  const loud=busy? Math.exp(-Math.pow((L-Lr)/(Lr*0.08),2)) : 0;
  if(busy&&loud>0.05){ x.save(); x.globalAlpha=loud; x.strokeStyle=P.brand; x.lineWidth=2; const ph=Math.sin(now()*6); for(const sgn of [1,-1]){ x.beginPath(); for(let i=0;i<=40;i++){ const yy=water-(L*sc)*i/40; const amp=Math.sin(Math.PI/2*i/40)*11*ph*sgn; i?x.lineTo((tx0+tx1)/2+amp,yy):x.moveTo((tx0+tx1)/2+amp,yy); } x.stroke(); } x.restore();
    T(x,'N',tx0-14,water-3,P.brand,{size:12,weight:700}); T(x,'A',tx0-14,ttop+12,P.brand,{size:12,weight:700}); }
  const fx=210, fy=ttop-28; const vib=busy? Math.sin(now()*40)*1.5:0; x.fillStyle=P.ink2; x.fillRect(fx-2,fy+20,4,18); x.fillRect(fx-11-vib,fy-20,5,42); x.fillRect(fx+6+vib,fy-20,5,42); x.fillRect(fx-11,fy+18,22,4);
  if(busy) H.rays(x,P,fx,fy+4,now(),P.ink2);
  H.note(x,P,'tuning fork\n'+f+' Hz',fx+14,fy-8,300,Math.max(18,fy-18),{align:'left',weight:700});
  H.note(x,P,'measuring cylinder\nfull of water',cx1,bot-40,300,bot-34,{align:'left'});
  H.note(x,P,'glass tube\n(raise slowly)',tx1,water+90,300,water+110,{align:'left'});
  H.dim(x,P,cx1+26,ttop,cx1+26,water,'L = '+L.toFixed(1)+' cm',{align:'left',dx:8});
  x.strokeStyle=P.teal; x.setLineDash([3,3]); x.lineWidth=1; x.beginPath(); x.moveTo(tx1,water); x.lineTo(cx1+32,water); x.stroke(); x.setLineDash([]);
  const LX=300, LY=150; T(x,'how loud?',LX,LY-8,P.muted,{size:11}); H.box(x,P,LX,LY,110,16,P.line,null,8); H.box(x,P,LX,LY,Math.max(6,110*(busy?0.08+0.92*loud:0)),16,loud>0.7?P.brand:P.accent,null,8); if(loud>0.7) T(x,'LOUDEST: resonance',LX,LY+34,P.brand,{size:12,weight:700});
  if(loud>0.7){ T(x,'the air column holds',LX,LY+52,P.muted,{size:11}); T(x,'a quarter wavelength',LX,LY+66,P.muted,{size:11}); } } };

/* ===== PAG 6.1  Planck constant with LEDs ===== */
D['p6-1']={dur:4,reveal:0.8,
 idle:'Each LED is in series with a protective resistor; a voltmeter is across the LED. Choose an LED, then press Take reading.',
 steps:[[0,'Turn the potential divider up slowly from 0 V'],[0.2,'Look down the black tube at the LED. Below the threshold it stays dark'],[0.62,'Stop when the LED just starts to glow'],[0.8,'Record that threshold p.d. V. Then eV ≈ hc/λ']],
 draw(x,P,st){ const lam=st.xv, a=st.a; const busy=st.busy||st.show; const V= st.busy? st.y*Math.min(1,seg(a,0.05,0.62)) : (st.show?st.y:0); const col=LK.wl2rgb(lam); const glow= busy? cl((V-st.y*0.97)/(st.y*0.03),0,1)*0.8 : 0;
  const X0=50,Y0=70,X1=330,Y1=250; H.loop(x,P,X0,Y0,X1-X0,Y1-Y0); H.sym.supply(x,P,X0,(Y0+Y1)/2,'0–3 V'); H.sym.res(x,P,170,Y0); T(x,'protective resistor',170,Y0-18,P.muted,{size:10.5,align:'center'}); H.sym.meter(x,P,250,Y0,'mA',{val:busy?(glow>0?(2+glow*8).toFixed(1):'0.0')+' mA':''});
  const ly=(Y0+Y1)/2; H.sym.diode(x,P,X1,ly,{col,led:true,glow});
  H.wire(x,P,[[X1,ly-30],[X1+60,ly-30],[X1+60,ly+30],[X1,ly+30]]); H.sym.meter(x,P,X1+60,ly,'V',{val:busy?V.toFixed(2)+' V':'0.00 V',vx:16,va:'left',vy:4,hot:st.busy&&a>0.62});
  x.fillStyle=P.ink; LK.rr(x,X1-14,ly+44,28,60,4); x.fill(); x.fillStyle=P.ink2; x.beginPath(); x.ellipse(X1,ly+120,12,7,0,0,7); x.fill(); x.fillStyle=P.surface; x.beginPath(); x.arc(X1,ly+120,3.2,0,7); x.fill(); T(x,'black viewing tube',X1-24,ly+80,P.muted,{size:10.5,align:'right'});
  T(x,lam+' nm LED',X1-26,ly+4,P.ink,{size:12,weight:700,align:'right'}); T(x,glow>0.05?'just glowing!':'dark',X1-26,ly+20,glow>0.05?P.brand:P.muted,{size:11.5,weight:700,align:'right'}); } };

window.PAGDRAW_H=H;
})();
