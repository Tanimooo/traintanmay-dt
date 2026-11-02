/* PAG practical simulations: apparatus, method, data table, graph, fit, evaluation */
(function(){
'use strict';
const LK=window.LK;
const g=9.81, G=LK.gauss;
const nz=(v,sd)=>v+sd*G();
const rnd=(v,dp)=>Math.round(v*10**dp)/10**dp;

/* drawing helpers for apparatus */
const D={
 stand(x,P,bx,by,h){ x.fillStyle=P.ink2; x.fillRect(bx-30,by,60,8); x.fillRect(bx-3,by-h,6,h); },
 label(x,P,t,px,py,o){ LK.text(x,t,px,py,P.muted,Object.assign({size:11},o||{})); },
 meter(x,P,px,py,txt,lab){ x.fillStyle=P.deep; LK.rr(x,px,py,96,34,6); x.fill(); LK.text(x,txt,px+48,py+22,'#ffe2ef',{align:'center',size:14,weight:600}); if(lab) LK.text(x,lab,px+48,py+48,P.muted,{align:'center',size:10}); }
};

const PAGS=[
{id:'p1-1',pag:1,title:'Acceleration of free fall, g',topic:'3.1',
 aim:'Determine g by timing a ball bearing falling through different heights.',
 apparatus:['Electromagnet and steel ball bearing','Trapdoor (or light gate) connected to an electronic timer','Metre rule and set square','Clamp stand'],
 method:['Set up the electromagnet so the ball hangs above the trapdoor; switching off the magnet starts the timer, the ball opening the trapdoor stops it.','Measure the height h from the bottom of the ball to the trapdoor with a metre rule, using a set square to avoid parallax.','Release the ball and record the time t. Repeat three times and calculate the mean.','Repeat for at least six heights between 0.20 m and 1.20 m.','Plot h against t². The gradient is g/2.'],
 safety:['Use a tray of sand to catch the ball.','Keep the stand clamped so it cannot topple.'],
 vars:{iv:'drop height h',dv:'fall time t',cv:'same ball, same release mechanism, same trapdoor'},
 errors:['The magnet takes time to demagnetise, so measured t is slightly too long (systematic). This gives a non-zero intercept.','Height measured to the wrong part of the ball (systematic).','Random variation in release and trapdoor opening.'],
 improve:['Plot h against t²: a release delay then appears as an intercept instead of affecting the gradient.','Use light gates and a data-logger.','Use a larger range of heights and more repeats.'],
 sim:{x:{label:'Height h',unit:'m',min:0.2,max:1.2,step:0.05,value:0.5,dp:2},y:{label:'time t',unit:'s',dp:3},
  meas:(h)=>Math.sqrt(2*h/g)+0.012, sd:0.004,
  plots:[{name:'h against t²',X:(x,y)=>y*y,Y:(x,y)=>x,xl:'t² / s²',yl:'h / m',res:(m)=>({label:'g = 2 × gradient',v:2*m,u:'m s⁻²',acc:9.81})}],
  draw(x,P,W,H,h,a){ const top=20,bot=H-30,sc=(bot-top-30)/1.2; const my=bot-h*sc-14; D.stand(x,P,W*0.3,bot,bot-top); x.fillStyle=P.ink2; x.fillRect(W*0.3,my-18,W*0.16,6); x.fillStyle=P.accent; x.fillRect(W*0.45,my-14,26,14); D.label(x,P,'electromagnet',W*0.45+30,my-4);
   const by=my+7+(a>0?Math.min(1,a*a)*(h*sc):0); x.fillStyle=P.ink; x.beginPath(); x.arc(W*0.45+13,by,7,0,7); x.fill();
   x.fillStyle=P.brand; x.save(); x.translate(W*0.45-6,bot-10); if(a>0.98) x.rotate(0.6); x.fillRect(0,0,40,5); x.restore(); D.label(x,P,'trapdoor',W*0.45+44,bot-4);
   x.strokeStyle=P.line2; x.setLineDash([4,4]); x.beginPath(); x.moveTo(W*0.62,my+7); x.lineTo(W*0.62,bot-10); x.stroke(); x.setLineDash([]); D.label(x,P,'h = '+h.toFixed(2)+' m',W*0.64,(my+bot)/2);
   D.meter(x,P,W*0.74,top+10,a>0&&a<1?(Math.sqrt(2*h/g)*a).toFixed(3)+' s':'timer','timer'); }}},

{id:'p1-2',pag:1,title:'Terminal velocity in a viscous liquid',topic:'3.2',
 aim:'Investigate how the terminal velocity of a ball bearing in glycerol depends on its radius.',
 apparatus:['Tall measuring cylinder of glycerol','Steel ball bearings of different diameters','Micrometer','Rubber bands as markers','Stopwatch','Magnet to retrieve balls'],
 method:['Measure each ball’s diameter with a micrometer (several readings).','Place two rubber bands 30 cm apart, the top one well below the surface so the ball has reached terminal velocity.','Drop the ball gently at the centre of the cylinder and time it between the bands, viewing at eye level.','Repeat for each size three times; v = distance ÷ mean time.','Plot v against r². Stokes’ law predicts a straight line through the origin.'],
 safety:['Wipe up spills of glycerol (slip hazard).','Use a magnet to retrieve balls rather than putting hands in.'],
 vars:{iv:'ball radius r',dv:'terminal velocity v',cv:'liquid, temperature, distance between bands, ball material'},
 errors:['Parallax when judging when the ball passes the band.','Reaction time with a stopwatch.','Ball not at terminal velocity before the first band.','Wall effects for larger balls.'],
 improve:['Use video analysis frame by frame.','Use a wider tube.','Check terminal velocity by timing two successive sections.'],
 sim:{x:{label:'Ball diameter',unit:'mm',min:1,max:6,step:0.5,value:3,dp:1},y:{label:'time over 30 cm',unit:'s',dp:2},
  meas:(d)=>{ const r=d/2000; const v=2*r*r*(7800-1260)*g/(9*1.4); return 0.30/v; }, sd:0.12,
  derived:{label:'v / m s⁻¹',f:(x,y)=>0.30/y},
  plots:[{name:'v against r²',X:(x,y)=>(x/2000)**2*1e6,Y:(x,y)=>0.30/y,xl:'r² / mm²',yl:'v / m s⁻¹',res:(m)=>({label:'viscosity η = 2(ρ_s − ρ_f)g / (9 × gradient)',v:2*(7800-1260)*g/(9*m*1e6),u:'Pa s',acc:1.4})}],
  draw(x,P,W,H,d,a){ const cx=W*0.4,top=16,bot=H-16; x.fillStyle=P.accentSoft; x.fillRect(cx-40,top+20,80,bot-top-20); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(cx-40,top,80,bot-top);
   const b1=top+(bot-top)*0.35,b2=top+(bot-top)*0.85; x.strokeStyle=P.brand; x.lineWidth=3; [b1,b2].forEach(y=>{x.beginPath();x.moveTo(cx-42,y);x.lineTo(cx+42,y);x.stroke();}); D.label(x,P,'30 cm',cx+48,(b1+b2)/2);
   const by=top+22+a*(bot-top-40); x.fillStyle=P.ink; x.beginPath(); x.arc(cx,by,Math.max(2,d*1.5),0,7); x.fill(); D.meter(x,P,W*0.66,top+10,'stopwatch','time between bands'); }}},

{id:'p1-3',pag:1,title:'Initial speed and stopping distance',topic:'3.1',
 aim:'Investigate how the stopping distance of a trolley on carpet depends on its initial speed.',
 apparatus:['Trolley with a card','Ramp','Light gate and data-logger','Strip of carpet','Metre rule'],
 method:['Release the trolley from different points on the ramp so it reaches the carpet at different speeds.','The light gate at the bottom measures the speed v (card length ÷ time).','Measure the distance the trolley travels on the carpet before stopping.','Repeat each speed three times.','Plot d against v². The gradient is 1/(2a), where a is the deceleration.'],
 safety:['Place a stop at the end of the bench.'],
 vars:{iv:'speed v at the light gate',dv:'stopping distance d',cv:'trolley mass, carpet, card length'},
 errors:['Trolley not moving straight.','Light gate not at the start of the carpet.'],
 improve:['Use a longer card or two light gates.','Use a video to record where it stops.'],
 sim:{x:{label:'Speed at light gate',unit:'m/s',min:0.4,max:2.0,step:0.1,value:1.0,dp:2},y:{label:'stopping distance d',unit:'m',dp:3},
  meas:(v)=>v*v/(2*0.30*g), sd:0.012,
  plots:[{name:'d against v²',X:(x,y)=>x*x,Y:(x,y)=>y,xl:'v² / m² s⁻²',yl:'d / m',res:(m)=>({label:'deceleration a = 1/(2 × gradient)',v:1/(2*m),u:'m s⁻²',acc:0.30*g})}],
  draw(x,P,W,H,v,a){ x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.moveTo(10,H*0.3); x.lineTo(W*0.3,H*0.7); x.lineTo(W-10,H*0.7); x.stroke(); x.fillStyle=P.accentSoft; x.fillRect(W*0.32,H*0.7,W*0.66,8); const d=v*v/(2*0.3*g); const tx=W*0.32+Math.min(1,a)*d/0.7*(W*0.6); x.fillStyle=P.brand; LK.rr(x,tx-30,H*0.7-22,40,18,4); x.fill(); x.fillStyle=P.teal; x.fillRect(W*0.3,H*0.45,6,H*0.25); D.label(x,P,'light gate',W*0.3-20,H*0.42); D.label(x,P,'carpet',W*0.7,H*0.7+24); }}},

{id:'p2-1',pag:2,title:'Young modulus of a metal wire',topic:'3.4',
 aim:'Determine the Young modulus of copper by loading a long thin wire.',
 apparatus:['Copper wire ≈ 2.5 m, clamped at one end','Pulley and slotted masses','Marker (tape flag) on the wire and metre rule on the bench','Micrometer','Safety goggles'],
 method:['Measure the original length L from the clamp to the marker with a tape measure.','Measure the diameter in several places and orientations with a micrometer; calculate the mean and the cross-sectional area.','Add a small initial load to straighten the wire; record the marker position.','Add masses in 100 g steps; record the extension each time. Remove the masses and check the wire returns (still elastic).','Plot stress against strain; the gradient of the linear section is the Young modulus.'],
 safety:['Wear goggles: a breaking wire can whip back.','Put a box of padding under the masses.'],
 vars:{iv:'load F (tension)',dv:'extension x',cv:'material, original length, diameter, temperature'},
 errors:['Small extensions give a large percentage uncertainty (use a long wire).','Diameter uncertainty is doubled in the area.','Parallax reading the marker.','Wire heating up or creeping.'],
 improve:['Use Searle’s apparatus with a vernier scale.','Use a travelling microscope to read the marker.','Take readings when unloading as well.'],
 sim:{x:{label:'Load',unit:'N',min:0,max:40,step:2,value:10,dp:0},y:{label:'extension x',unit:'mm',dp:1},
  meas:(F)=>F*2.50/(Math.PI*(0.28e-3)**2*1.2e11)*1000, sd:0.25,
  plots:[{name:'stress against strain',X:(x,y)=>y/1000/2.50,Y:(x,y)=>x/(Math.PI*(0.28e-3)**2)/1e6,xl:'strain',yl:'stress / MPa',res:(m)=>({label:'Young modulus = gradient',v:m*1e6,u:'Pa',acc:1.2e11})},{name:'F against x',X:(x,y)=>y,Y:(x,y)=>x,xl:'x / mm',yl:'F / N',res:(m)=>({label:'E = (gradient × L) / A',v:m*1000*2.50/(Math.PI*(0.28e-3)**2),u:'Pa',acc:1.2e11})}],
  info:'L = 2.50 m, diameter d = 0.56 mm (A = π(0.28 × 10⁻³)² m²).',
  draw(x,P,W,H,F,a){ const y=H*0.4; x.fillStyle=P.ink2; x.fillRect(10,y-20,14,40); x.strokeStyle=P.accent; x.lineWidth=2; x.beginPath(); x.moveTo(24,y); x.lineTo(W*0.82,y); x.stroke(); x.fillStyle=P.ink2; x.beginPath(); x.arc(W*0.84,y+10,10,0,7); x.fill(); x.strokeStyle=P.accent; x.beginPath(); x.moveTo(W*0.84+10,y+10); x.lineTo(W*0.84+10,H*0.75); x.stroke(); const n=Math.round(F/2); for(let i=0;i<Math.min(12,n);i++){ x.fillStyle=P.brand; x.fillRect(W*0.84,H*0.75+i*5,20,4); }
   const ext=F*2.5/(Math.PI*(0.28e-3)**2*1.2e11)*1000; const mx=W*0.6+ext*3; x.fillStyle=P.teal; x.fillRect(mx-2,y-12,4,12); for(let i=0;i<=40;i++){ x.fillStyle=P.line2; x.fillRect(W*0.5+i*6,y+4,1,i%5?4:8); } D.label(x,P,'marker against mm scale',W*0.5,y+26); }}},

{id:'p2-2',pag:2,title:'Springs in series and parallel',topic:'3.4',
 aim:'Find the force constant of single springs and of combinations.',
 apparatus:['Two identical springs','Clamp stand and pointer','Metre rule','Slotted masses (100 g)'],
 method:['Hang the spring(s) and record the pointer position with no load.','Add 100 g masses one at a time and record the position; extension = position − original.','Repeat with the springs in series and then in parallel.','Plot F against x for each arrangement; gradient = k.'],
 safety:['Do not overload: exceeding the elastic limit damages the springs.','Keep feet clear of falling masses.'],
 vars:{iv:'load F',dv:'extension x',cv:'same springs, same mass hanger'},
 errors:['Parallax reading the ruler.','Spring still oscillating when read.'],
 improve:['Use a fiducial pointer and set square.','Wait for the spring to come to rest.'],
 sim:{x:{label:'Load',unit:'N',min:0,max:6,step:0.5,value:2,dp:1},y:{label:'extension x',unit:'cm',dp:1},
  opts:{label:'Arrangement',options:[['1','Single spring'],['s','Two in series'],['p','Two in parallel']],value:'1'},
  meas:(F,o)=>F/(o==='s'?12.5:o==='p'?50:25)*100, sd:0.15,
  plots:[{name:'F against x',X:(x,y)=>y/100,Y:(x,y)=>x,xl:'x / m',yl:'F / N',res:(m,o)=>({label:'force constant k = gradient',v:m,u:'N m⁻¹',acc:o==='s'?12.5:o==='p'?50:25})}],
  info:'Each spring has k = 25 N m⁻¹.',
  draw(x,P,W,H,F,a,o){ const top=14; x.fillStyle=P.ink2; x.fillRect(W*0.3,top-4,W*0.3,6); const e=F/(o==='s'?12.5:o==='p'?50:25)*(H*0.5); x.strokeStyle=P.brand; x.lineWidth=2;
   if(o==='p'){ LK.spring(x,W*0.43,top,W*0.43,top+60+e,10,7); LK.spring(x,W*0.47,top,W*0.47,top+60+e,10,7); } else if(o==='s'){ LK.spring(x,W*0.45,top,W*0.45,top+30+e/2,6,8); LK.spring(x,W*0.45,top+30+e/2,W*0.45,top+60+e,6,8); } else LK.spring(x,W*0.45,top,W*0.45,top+60+e,10,8);
   x.fillStyle=P.deep; x.fillRect(W*0.45-14,top+60+e,28,8+F*3); for(let i=0;i<=20;i++){ x.fillStyle=P.line2; x.fillRect(W*0.62,top+50+i*10,i%5?6:12,1); } }}},

{id:'p3-1',pag:3,title:'Resistivity of a metal wire',topic:'4.2',
 aim:'Determine the resistivity of constantan wire.',
 apparatus:['Constantan wire taped to a metre rule','Crocodile clips','Ammeter, voltmeter (or ohmmeter)','Power supply / cell and switch','Micrometer'],
 method:['Measure the diameter of the wire at several places with a micrometer; find the mean and the area A = πd²/4.','Connect the circuit with one crocodile clip at 0 cm and the other at length L.','Close the switch briefly, read V and I, and calculate R = V/I. Open the switch between readings so the wire does not heat up.','Repeat for lengths 10 cm to 100 cm.','Plot R against L; gradient = ρ/A so ρ = gradient × A.'],
 safety:['Keep the current low: the wire gets hot.','Switch off between readings.'],
 vars:{iv:'length L',dv:'resistance R',cv:'wire material and diameter, temperature'},
 errors:['Contact resistance at the clips (systematic, gives an intercept on the R axis).','Wire heating increases R.','Diameter uncertainty is doubled in A.'],
 improve:['Use a low current and switch off between readings.','Plot R against L so contact resistance only affects the intercept.','Measure diameter with a micrometer at many points.'],
 sim:{x:{label:'Length L',unit:'cm',min:10,max:100,step:5,value:50,dp:0},y:{label:'resistance R',unit:'Ω',dp:2},
  meas:(L)=>4.9e-7*(L/100)/(Math.PI*(0.16e-3)**2)+0.15, sd:0.03,
  plots:[{name:'R against L',X:(x,y)=>x/100,Y:(x,y)=>y,xl:'L / m',yl:'R / Ω',res:(m)=>({label:'ρ = gradient × A',v:m*Math.PI*(0.16e-3)**2,u:'Ω m',acc:4.9e-7})}],
  info:'Mean diameter d = 0.32 mm.',
  draw(x,P,W,H,L,a){ const y=H*0.62; x.fillStyle=P.accentSoft; x.fillRect(20,y,W-40,16); for(let i=0;i<=100;i+=10){ LK.text(x,String(i),20+i/100*(W-40),y+30,P.muted,{size:10,align:'center'}); } x.strokeStyle=P.accent; x.lineWidth=2; x.beginPath(); x.moveTo(20,y+4); x.lineTo(W-20,y+4); x.stroke();
   const cx=20+L/100*(W-40); x.fillStyle=P.ink; x.fillRect(16,y-12,8,14); x.fillRect(cx-4,y-12,8,14); x.strokeStyle=P.ink2; x.beginPath(); x.moveTo(20,y-12); x.lineTo(20,H*0.2); x.lineTo(W*0.4,H*0.2); x.moveTo(cx,y-12); x.lineTo(cx,H*0.3); x.lineTo(W*0.6,H*0.3); x.stroke();
   const R=4.9e-7*(L/100)/(Math.PI*(0.16e-3)**2)+0.15; D.meter(x,P,W*0.42,H*0.05,a>0?(1.0/R*1).toFixed(3)+' A':'– A','ammeter'); D.meter(x,P,W*0.62,H*0.05,a>0?'1.000 V':'– V','voltmeter'); }}},

{id:'p3-2',pag:3,title:'I–V characteristics',topic:'4.2',
 aim:'Plot the I–V characteristics of a resistor, filament lamp and diode.',
 apparatus:['Variable power supply (or potential divider)','Ammeter and voltmeter','Component under test','Protective resistor for the diode'],
 method:['Connect the component in series with the ammeter; voltmeter in parallel across it.','Use a potential divider to vary the p.d. from 0 V in small steps; record V and I.','Reverse the supply connections and repeat for negative p.d.s.','For the diode use smaller steps near 0.6 V and a protective resistor.','Plot I against V.'],
 safety:['Lamps get hot.','Do not exceed the diode’s maximum current.'],
 vars:{iv:'p.d. V',dv:'current I',cv:'temperature (for the resistor)'},
 errors:['Meter resolution at small currents.','Lamp needs time to reach a steady temperature.'],
 improve:['Use a data-logger and sweep quickly.','Use a milliammeter for small currents.'],
 sim:{x:{label:'p.d. V',unit:'V',min:-6,max:6,step:0.25,value:2,dp:2},y:{label:'current I',unit:'mA',dp:1},
  opts:{label:'Component',options:[['r','Resistor 100 Ω'],['l','Filament lamp 6 V'],['d','Silicon diode + 47 Ω']],value:'l'},
  meas:(V,o)=>o==='r'?V/100*1000:o==='l'?Math.sign(V)*500*Math.pow(Math.abs(V)/6,0.6):(V<0.6?0:(V-0.62)/47*1000), sd:0.4,
  plots:[{name:'I against V',X:(x,y)=>x,Y:(x,y)=>y,xl:'V / V',yl:'I / mA',res:(m,o)=>o==='r'?({label:'R = 1/gradient',v:1000/m,u:'Ω',acc:100}):({label:'gradient (only meaningful for the resistor)',v:m,u:'mA V⁻¹',acc:null})}],
  draw(x,P,W,H,V,a,o){ const cx=W*0.4,cy=H*0.5; x.strokeStyle=P.ink; x.lineWidth=2; x.strokeRect(cx-100,cy-50,200,100); x.fillStyle=P.surface; x.fillRect(cx-20,cy-62,40,24); x.strokeRect(cx-20,cy-62,40,24); LK.text(x,o==='r'?'R':o==='l'?'⊗':'▷|',cx,cy-45,P.ink,{align:'center',size:13,weight:700}); if(o==='l'&&Math.abs(V)>1){ x.fillStyle=`rgba(255,210,80,${Math.min(0.8,Math.abs(V)/7)})`; x.beginPath(); x.arc(cx,cy-50,24,0,7); x.fill(); }
   D.meter(x,P,W*0.66,H*0.12,V.toFixed(2)+' V','voltmeter'); D.label(x,P,'potential divider supply',cx-60,cy+70); }}},

{id:'p3-3',pag:3,title:'Internal resistance of a cell',topic:'4.3',
 aim:'Determine the e.m.f. and internal resistance of a cell.',
 apparatus:['Cell in holder','Variable resistor (or resistance box)','Ammeter, voltmeter','Switch'],
 method:['Connect the cell, switch, ammeter and variable resistor in series, with the voltmeter across the cell terminals.','Set the resistance, close the switch briefly and read V and I.','Repeat for a range of resistances.','Plot V against I. Intercept = ε, gradient = −r.'],
 safety:['Do not short-circuit the cell: it gets hot.'],
 vars:{iv:'load resistance R',dv:'terminal p.d. V and current I',cv:'same cell'},
 errors:['Cell runs down during the experiment (ε falls).','Internal resistance changes as the cell heats.'],
 improve:['Open the switch between readings.','Take readings quickly.'],
 sim:{x:{label:'Load R',unit:'Ω',min:1,max:20,step:0.5,value:5,dp:1},y:{label:'terminal p.d. V',unit:'V',dp:3},
  meas:(R)=>1.55*R/(R+0.85), sd:0.004, derived:{label:'I / A',f:(x,y)=>y/x},
  plots:[{name:'V against I',X:(x,y)=>y/x,Y:(x,y)=>y,xl:'I / A',yl:'V / V',res:(m,o,c)=>({label:'r = −gradient (ε = intercept = '+c.toFixed(3)+' V)',v:-m,u:'Ω',acc:0.85})}],
  draw(x,P,W,H,R,a){ const cx=W*0.4,cy=H*0.5; x.strokeStyle=P.ink; x.lineWidth=2; x.strokeRect(cx-110,cy-50,220,100); x.fillStyle=P.bg; x.fillRect(cx-10,cy+42,20,16); x.lineWidth=2; x.beginPath(); x.moveTo(cx-4,cy+38); x.lineTo(cx-4,cy+62); x.stroke(); x.lineWidth=4; x.beginPath(); x.moveTo(cx+4,cy+32); x.lineTo(cx+4,cy+68); x.stroke(); x.lineWidth=2; x.fillStyle=P.surface; x.fillRect(cx-25,cy-60,50,20); x.strokeRect(cx-25,cy-60,50,20); LK.arrow(x,cx-30,cy-35,cx+30,cy-65,P.ink,1.5,6);
   const V=1.55*R/(R+0.85); D.meter(x,P,W*0.7,H*0.12,a>0?V.toFixed(3)+' V':'– V','voltmeter'); D.meter(x,P,W*0.7,H*0.55,a>0?(V/R).toFixed(3)+' A':'– A','ammeter'); }}},

{id:'p4-3',pag:4,title:'Calibrating a thermistor sensor',topic:'4.3',
 aim:'Measure how the resistance of an NTC thermistor varies with temperature and find its B constant.',
 apparatus:['NTC thermistor sealed in a test tube','Beaker of water, kettle and ice','Thermometer','Ohmmeter (or ammeter and voltmeter)'],
 method:['Place the thermistor and thermometer in water and heat or cool it.','Stir, wait for the reading to settle, and record temperature θ and resistance R.','Repeat every 10 °C from about 10 °C to 90 °C.','Convert to kelvin and plot ln R against 1/T; the gradient is B.'],
 safety:['Take care with hot water and the kettle.'],
 vars:{iv:'temperature',dv:'resistance',cv:'same thermistor, same meter'},
 errors:['Thermistor not at the same temperature as the thermometer.','Ohmmeter current heats the thermistor.'],
 improve:['Stir well and wait; use a water bath.','Use a data-logger with a temperature probe.'],
 sim:{x:{label:'Water temperature',unit:'°C',min:5,max:90,step:5,value:20,dp:0},y:{label:'resistance R',unit:'kΩ',dp:3},
  meas:(t)=>10*Math.exp(3600*(1/(t+273)-1/298)), sd:0.02, sdRel:true,
  plots:[{name:'ln R against 1/T',X:(x,y)=>1/(x+273),Y:(x,y)=>Math.log(y*1000),xl:'1/T / K⁻¹',yl:'ln (R / Ω)',res:(m)=>({label:'B constant = gradient',v:m,u:'K',acc:3600})},{name:'R against θ',X:(x,y)=>x,Y:(x,y)=>y,xl:'θ / °C',yl:'R / kΩ',res:()=>({label:'curve: R falls as θ rises (NTC)',v:NaN,u:'',acc:null})}],
  draw(x,P,W,H,t,a){ const cx=W*0.35; x.fillStyle=t>50?P.accentSoft:P.tealSoft; x.fillRect(cx-60,H*0.35,120,H*0.55); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(cx-60,H*0.25,120,H*0.65); x.fillStyle=P.surface; x.fillRect(cx-10,H*0.15,20,H*0.6); x.strokeRect(cx-10,H*0.15,20,H*0.6); x.fillStyle=P.ink; x.beginPath(); x.arc(cx,H*0.7,6,0,7); x.fill(); x.fillStyle=P.bad; x.fillRect(cx+30,H*0.85-t/100*H*0.6,4,t/100*H*0.6); D.meter(x,P,W*0.62,H*0.2,a>0?(10*Math.exp(3600*(1/(t+273)-1/298))).toFixed(2)+' kΩ':'– kΩ','ohmmeter'); D.label(x,P,t+' °C',cx+38,H*0.25); }}},

{id:'p5-1',pag:5,title:'Wavelength of light with a diffraction grating',topic:'4.4',
 aim:'Determine the wavelength of a laser using a diffraction grating.',
 apparatus:['Laser (class 2)','Diffraction grating, 300 lines per mm','Screen','Metre rule'],
 method:['Set the grating perpendicular to the beam with the screen D ≈ 1 m away.','Measure the distance y from the central maximum to the nth order maximum on each side and average.','Calculate θ from tan θ = y/D.','Plot sin θ against n; the gradient is λ/d.'],
 safety:['Never look along the beam; avoid reflections; warning sign on the door.'],
 vars:{iv:'order n',dv:'angle θ',cv:'same grating and laser'},
 errors:['Grating not perpendicular to the beam.','Locating the centre of each bright spot.'],
 improve:['Measure between orders on both sides (2y).','Use a larger D.'],
 sim:{x:{label:'Order n',unit:'',min:1,max:5,step:1,value:1,dp:0},y:{label:'angle θ',unit:'°',dp:1},
  meas:(n)=>Math.asin(n*650e-9*300e3)*180/Math.PI, sd:0.15,
  plots:[{name:'sin θ against n',X:(x,y)=>x,Y:(x,y)=>Math.sin(y*Math.PI/180),xl:'order n',yl:'sin θ',res:(m)=>({label:'λ = gradient × d (d = 1/300 mm)',v:m*1e-3/300,u:'m',acc:650e-9})}],
  draw(x,P,W,H,n,a){ const cy=H/2; x.fillStyle='rgb(220,30,40)'; x.fillRect(20,cy-6,50,12); x.fillStyle=P.ink2; x.fillRect(W*0.25,cy-30,4,60); x.fillStyle=P.deep; x.fillRect(W*0.85,10,8,H-20);
   for(let k=-5;k<=5;k++){ const th=Math.asin(Math.min(1,Math.abs(k)*650e-9*300e3))*Math.sign(k); const yy=cy+Math.tan(th)*(W*0.6)*0.25; if(Math.abs(yy-cy)<H/2-12){ x.strokeStyle='rgba(220,30,40,.35)'; x.beginPath(); x.moveTo(W*0.25+4,cy); x.lineTo(W*0.85,yy); x.stroke(); x.fillStyle=Math.abs(k)===n?'#ff2a4a':'rgba(220,30,40,.7)'; x.beginPath(); x.arc(W*0.85-4,yy,Math.abs(k)===n?6:4,0,7); x.fill(); } }
   D.label(x,P,'grating 300 lines/mm',W*0.18,cy+48); }}},

{id:'p5-2',pag:5,title:'Speed of sound using a resonance tube',topic:'4.4',
 aim:'Find the speed of sound from the first resonance length of a tube closed at one end.',
 apparatus:['Glass tube in a tall measuring cylinder full of water','Set of tuning forks','Metre rule','Clamp'],
 method:['Strike a tuning fork and hold it above the open end of the tube.','Raise the tube slowly until the loudest sound is heard: the first resonance. Measure the length L of air column.','Repeat for each fork and record L.','At the first resonance L + e = λ/4 where e is the end correction. Plot L against 1/f: gradient = v/4, intercept = −e.'],
 safety:['Do not strike tuning forks on the bench or glass.'],
 vars:{iv:'frequency f',dv:'resonance length L',cv:'tube diameter, air temperature'},
 errors:['Judging the exact position of loudest sound.','End correction (systematic, handled by the graph).'],
 improve:['Approach the resonance from above and below and average.','Use a signal generator and loudspeaker for more frequencies.'],
 sim:{x:{label:'Fork frequency',unit:'Hz',min:256,max:512,step:32,value:320,dp:0},y:{label:'resonance length L',unit:'cm',dp:1},
  meas:(f)=>(343/(4*f)-0.012)*100, sd:0.3,
  plots:[{name:'L against 1/f',X:(x,y)=>1/x,Y:(x,y)=>y/100,xl:'1/f / s',yl:'L / m',res:(m,o,c)=>({label:'v = 4 × gradient (end correction = '+(-c*100).toFixed(1)+' cm)',v:4*m,u:'m s⁻¹',acc:343})}],
  draw(x,P,W,H,f,a){ const cx=W*0.35; x.fillStyle=P.tealSoft; x.fillRect(cx-50,H*0.4,100,H*0.55); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(cx-50,H*0.2,100,H*0.75); const L=343/(4*f)-0.012; const top=H*0.4-L*H*1.2; x.strokeStyle=P.brand; x.strokeRect(cx-14,top,28,H*0.95-top); x.fillStyle=P.tealSoft; x.fillRect(cx-13,H*0.4,26,H*0.55); x.strokeStyle=P.ink; x.lineWidth=3; x.beginPath(); x.moveTo(cx-10,top-40); x.lineTo(cx-10,top-10); x.moveTo(cx+10,top-40); x.lineTo(cx+10,top-10); x.stroke(); D.label(x,P,f+' Hz fork',cx+20,top-24); D.label(x,P,'L',cx+20,(top+H*0.4)/2); }}},

{id:'p6-1',pag:6,title:'Planck constant using LEDs',topic:'4.5',
 aim:'Estimate h from the threshold p.d. of LEDs of different colours.',
 apparatus:['LEDs of known wavelength','Variable supply / potential divider','Voltmeter, milliammeter','Protective resistor','Black tube to view the LED'],
 method:['Connect each LED in forward bias with a protective resistor.','Increase the p.d. slowly from zero until the LED just starts to emit (view through a tube in a dim room). Record V.','Repeat for each LED.','At threshold eV = hc/λ. Plot V against 1/λ; gradient = hc/e so h = gradient × e/c.'],
 safety:['Do not exceed the LED current rating.'],
 vars:{iv:'wavelength λ',dv:'threshold p.d. V',cv:'same method of judging "just lit"'},
 errors:['Judging when the LED first lights is subjective.','LEDs emit a range of wavelengths.'],
 improve:['Use the I–V graph and extrapolate the straight part to I = 0.','Use a light sensor.'],
 sim:{x:{label:'LED wavelength',unit:'nm',min:470,max:660,step:5,value:590,dp:0,list:[470,505,525,590,610,630,660]},y:{label:'threshold p.d. V',unit:'V',dp:2},
  meas:(l)=>6.63e-34*3e8/(1.6e-19*l*1e-9)-0.05, sd:0.04,
  plots:[{name:'V against 1/λ',X:(x,y)=>1/(x*1e-9),Y:(x,y)=>y,xl:'1/λ / m⁻¹',yl:'V / V',res:(m)=>({label:'h = gradient × e / c',v:m*1.6e-19/3e8,u:'J s',acc:6.63e-34})}],
  draw(x,P,W,H,l,a){ const cx=W*0.4,cy=H*0.5; const col=LK.wl2rgb(l); if(a>0.5){ const g2=x.createRadialGradient(cx,cy,2,cx,cy,50); g2.addColorStop(0,col); g2.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g2; x.beginPath(); x.arc(cx,cy,50,0,7); x.fill(); } x.fillStyle=col; x.beginPath(); x.arc(cx,cy-6,14,Math.PI,0); x.lineTo(cx+14,cy+14); x.lineTo(cx-14,cy+14); x.fill(); x.fillStyle=P.ink2; x.fillRect(cx-8,cy+14,3,30); x.fillRect(cx+5,cy+14,3,24);
   D.meter(x,P,W*0.66,H*0.2,a>0?(6.63e-34*3e8/(1.6e-19*l*1e-9)*Math.min(1,a*1.1)).toFixed(2)+' V':'0.00 V','voltmeter'); D.label(x,P,l+' nm LED',cx-30,cy+64); }}},

{id:'p6-3',pag:6,title:'Polarisation of light (Malus)',topic:'4.4',
 aim:'Investigate how the intensity transmitted through two polarisers depends on the angle between them.',
 apparatus:['Lamp','Two polarising filters, one on a protractor mount','Light sensor and data-logger (or lux meter)'],
 method:['Align the polariser and analyser for maximum intensity (θ = 0).','Rotate the analyser in 10° steps and record the light intensity.','Subtract the background reading (lamp off).','Plot I against cos²θ: a straight line through the origin confirms Malus’s law.'],
 safety:['Lamp housing gets hot.'],
 vars:{iv:'angle θ',dv:'intensity I',cv:'lamp distance, room lighting'},
 errors:['Background light.','Reading the protractor.'],
 improve:['Work in a dark room; subtract background.','Use a data-logger with a rotary sensor.'],
 sim:{x:{label:'Analyser angle θ',unit:'°',min:0,max:90,step:10,value:30,dp:0},y:{label:'intensity',unit:'lux',dp:0},
  meas:(t)=>400*Math.cos(t*Math.PI/180)**2+12, sd:4,
  plots:[{name:'I against cos²θ',X:(x,y)=>Math.cos(x*Math.PI/180)**2,Y:(x,y)=>y,xl:'cos²θ',yl:'I / lux',res:(m,o,c)=>({label:'I₀ = gradient (background = intercept '+c.toFixed(0)+' lux)',v:m,u:'lux',acc:400})}],
  draw(x,P,W,H,t,a){ const cy=H/2; x.fillStyle='rgba(255,210,90,.9)'; x.beginPath(); x.arc(30,cy,14,0,7); x.fill(); [[W*0.3,0],[W*0.55,t]].forEach(([px,ang])=>{ x.strokeStyle=P.ink2; x.lineWidth=3; x.beginPath(); x.ellipse(px,cy,12,H*0.32,0,0,7); x.stroke(); const r=ang*Math.PI/180; x.strokeStyle=P.brand; x.beginPath(); x.moveTo(px-Math.sin(r)*10,cy-Math.cos(r)*H*0.28); x.lineTo(px+Math.sin(r)*10,cy+Math.cos(r)*H*0.28); x.stroke(); }); x.fillStyle=P.deep; x.fillRect(W*0.75,cy-14,30,28); D.meter(x,P,W*0.8,10,a>0?(400*Math.cos(t*Math.PI/180)**2+12).toFixed(0)+' lux':'– lux','light sensor'); }}},

{id:'p7-2',pag:7,title:'Absorption of gamma rays by lead',topic:'6.4',
 aim:'Find the attenuation coefficient of lead for gamma radiation.',
 apparatus:['Sealed gamma source (e.g. Co-60) and tongs','GM tube and counter','Lead sheets of measured thickness','Stopwatch','Metre rule to fix distance'],
 method:['Measure the background count rate over several minutes.','Fix the source–GM tube distance.','Insert lead of increasing thickness x; count for a fixed time (e.g. 2 minutes).','Subtract background to get corrected count rate C.','C = C₀e^(−μx): plot ln C against x; gradient = −μ.'],
 safety:['Handle the source with tongs at arm’s length; never point it at anyone.','Minimise exposure time; return the source to its lead box immediately.','Follow local rules; wash hands afterwards.'],
 vars:{iv:'thickness of lead x',dv:'count rate',cv:'source–detector distance, counting time, same source'},
 errors:['Random nature of decay: counts fluctuate (≈ √N).','Background varies.'],
 improve:['Count for longer to reduce percentage uncertainty.','Repeat and average; measure background before and after.'],
 sim:{x:{label:'Lead thickness',unit:'mm',min:0,max:40,step:2.5,value:5,dp:1},y:{label:'corrected count rate',unit:'min⁻¹',dp:0},
  meas:(t)=>1800*Math.exp(-0.055*t), sd:0, poisson:true,
  plots:[{name:'ln C against x',X:(x,y)=>x,Y:(x,y)=>Math.log(Math.max(1,y)),xl:'x / mm',yl:'ln (C / min⁻¹)',res:(m)=>({label:'μ = −gradient',v:-m,u:'mm⁻¹',acc:0.055})}],
  draw(x,P,W,H,t,a){ const cy=H/2; x.fillStyle=P.ink2; x.fillRect(20,cy-20,40,40); x.fillStyle=P.brand; x.beginPath(); x.arc(56,cy,6,0,7); x.fill(); const tw=Math.max(1,t*2.2); x.fillStyle=P.ink; x.fillRect(W*0.4-tw/2,cy-40,tw,80); x.fillStyle=P.deep; x.fillRect(W*0.7,cy-12,80,24); D.label(x,P,'GM tube',W*0.7,cy+34); D.label(x,P,t+' mm lead',W*0.4-20,cy+56); if(a>0&&Math.random()<0.4){ x.fillStyle=P.accent; x.beginPath(); x.arc(W*0.7+70,cy,5,0,7); x.fill(); } }}},

{id:'p7-3',pag:7,title:'Half-life of protactinium-234m',topic:'6.4',
 aim:'Measure the half-life of Pa-234m using a protactinium generator and GM tube.',
 apparatus:['Protactinium generator bottle (sealed)','GM tube and ratemeter/counter','Stopwatch'],
 method:['Measure the background count.','Shake the bottle so the organic layer extracts the Pa-234m; place the GM tube by the top layer.','Record counts in successive 10 s intervals for about 5 minutes.','Subtract background; plot ln(count rate) against time. Gradient = −λ; t½ = ln 2/λ.'],
 safety:['Keep the bottle sealed and in a tray; wear gloves; wash hands afterwards.'],
 vars:{iv:'time t',dv:'count rate',cv:'GM tube position, counting interval'},
 errors:['Random fluctuations in count.','Counts in an interval measure the average over 10 s, not an instant.'],
 improve:['Use a data-logger to count continuously.','Repeat the experiment and average.'],
 sim:{x:{label:'Time since shaking',unit:'s',min:0,max:300,step:10,value:0,dp:0},y:{label:'corrected count rate',unit:'s⁻¹',dp:1},
  meas:(t)=>40*Math.exp(-Math.LN2*t/70), sd:0, poisson:true, pscale:10,
  plots:[{name:'ln C against t',X:(x,y)=>x,Y:(x,y)=>Math.log(Math.max(0.1,y)),xl:'t / s',yl:'ln (C / s⁻¹)',res:(m)=>({label:'t½ = ln 2 / (−gradient)',v:Math.LN2/-m,u:'s',acc:70})}],
  draw(x,P,W,H,t,a){ const cx=W*0.35; x.fillStyle=P.accentSoft; LK.rr(x,cx-40,H*0.2,80,H*0.7,10); x.fill(); x.fillStyle=P.tealSoft; x.fillRect(cx-38,H*0.55,76,H*0.33); x.strokeStyle=P.ink2; x.strokeRect(cx-40,H*0.2,80,H*0.7); x.fillStyle=P.deep; x.fillRect(cx+50,H*0.3,70,20); D.label(x,P,'GM tube at top (organic) layer',cx+50,H*0.26); D.meter(x,P,W*0.7,H*0.55,'t = '+t+' s','stopwatch'); }}},

{id:'p8-1',pag:8,title:'Estimating absolute zero',topic:'5.1',
 aim:'Measure the pressure of a fixed volume of air at different temperatures and extrapolate to zero pressure.',
 apparatus:['Round-bottomed flask of air connected by short tubing to a pressure gauge','Large water bath, kettle, ice','Thermometer, stirrer'],
 method:['Immerse the flask fully in the water bath with ice and record temperature and pressure once steady.','Heat the bath in stages, stirring, and record pairs of readings.','Plot p against θ (°C) and extrapolate to p = 0. The θ-intercept estimates absolute zero.'],
 safety:['Hot water burns; do not seal the bath.','Clamp the flask securely.'],
 vars:{iv:'temperature θ',dv:'pressure p',cv:'volume and mass of gas'},
 errors:['Air in the tubing is not at bath temperature (systematic).','Gas not in thermal equilibrium with the water.'],
 improve:['Keep tubing short; wait for readings to settle; stir.','Use a data-logger with pressure and temperature sensors.'],
 sim:{x:{label:'Bath temperature',unit:'°C',min:0,max:90,step:10,value:20,dp:0},y:{label:'pressure p',unit:'kPa',dp:1},
  meas:(t)=>100*(t+273)/273*0.995+0.5, sd:0.4,
  plots:[{name:'p against θ',X:(x,y)=>x,Y:(x,y)=>y,xl:'θ / °C',yl:'p / kPa',zeroX:false,res:(m,o,c)=>({label:'absolute zero ≈ −intercept/gradient',v:-c/m,u:'°C',acc:-273})}],
  draw(x,P,W,H,t,a){ const cx=W*0.35; x.fillStyle=t>40?P.accentSoft:P.tealSoft; x.fillRect(cx-80,H*0.35,160,H*0.6); x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(cx-80,H*0.25,160,H*0.7); x.beginPath(); x.arc(cx,H*0.65,34,0,7); x.stroke(); x.beginPath(); x.moveTo(cx,H*0.65-34); x.lineTo(cx,H*0.12); x.lineTo(W*0.7,H*0.12); x.stroke(); x.beginPath(); x.arc(W*0.7+30,H*0.2,30,0,7); x.stroke(); const pr=100*(t+273)/273; const ang=-Math.PI*0.9+pr/140*Math.PI*1.4; LK.arrow(x,W*0.7+30,H*0.2,W*0.7+30+Math.cos(ang)*22,H*0.2+Math.sin(ang)*22,P.brand,2,6); D.label(x,P,pr.toFixed(0)+' kPa',W*0.7+10,H*0.2+46); D.label(x,P,t+' °C',cx-74,H*0.31); }}},

{id:'p8-2',pag:8,title:'Boyle’s law',topic:'5.1',
 aim:'Investigate how the volume of a fixed mass of gas depends on pressure at constant temperature.',
 apparatus:['Sealed syringe (or oil column Boyle’s law apparatus)','Pressure gauge','Pump'],
 method:['Read the volume and pressure of the trapped air.','Increase the pressure in steps; wait for the temperature to return to room temperature before each reading.','Plot p against 1/V: a straight line through the origin shows p ∝ 1/V.'],
 safety:['Do not exceed the gauge maximum; wear goggles.'],
 vars:{iv:'volume V',dv:'pressure p',cv:'temperature, mass of gas'},
 errors:['Compression warms the gas briefly.','Leaks reduce the mass of gas.'],
 improve:['Wait between readings for thermal equilibrium.','Check for leaks; repeat on decreasing pressure.'],
 sim:{x:{label:'Volume V',unit:'cm³',min:20,max:50,step:2.5,value:40,dp:1},y:{label:'pressure p',unit:'kPa',dp:1},
  meas:(V)=>100*50/V, sd:0.6,
  plots:[{name:'p against 1/V',X:(x,y)=>1/x,Y:(x,y)=>y,xl:'1/V / cm⁻³',yl:'p / kPa',res:(m)=>({label:'pV = gradient (constant)',v:m,u:'kPa cm³',acc:5000})},{name:'pV against p',X:(x,y)=>y,Y:(x,y)=>x*y,xl:'p / kPa',yl:'pV / kPa cm³',res:()=>({label:'pV should be constant (horizontal line)',v:NaN,u:'',acc:null})}],
  draw(x,P,W,H,V,a){ const cy=H/2, L=V/50*W*0.45; x.strokeStyle=P.ink2; x.lineWidth=2; x.strokeRect(40,cy-24,W*0.5,48); x.fillStyle=P.tealSoft; x.fillRect(42,cy-22,L,44); x.fillStyle=P.ink2; x.fillRect(42+L,cy-24,10,48); x.fillRect(52+L,cy-4,W*0.5-L,8); D.meter(x,P,W*0.7,cy-20,(100*50/V).toFixed(1)+' kPa','gauge'); }}},

{id:'p9-1',pag:9,title:'Capacitor discharge and time constant',topic:'6.1',
 aim:'Determine the capacitance of a capacitor from its discharge through a known resistor.',
 apparatus:['Capacitor (470 μF), resistor (47 kΩ)','Power supply, two-way switch','Voltmeter (or data-logger)','Stopwatch'],
 method:['Charge the capacitor to V₀ with the switch in position A.','Move the switch to B to discharge through R; start the stopwatch.','Record V every 5 s.','Plot ln V against t; gradient = −1/CR. Calculate C.'],
 safety:['Electrolytic capacitors must be connected the right way round; do not exceed the voltage rating.'],
 vars:{iv:'time t',dv:'p.d. V',cv:'R, C, V₀'},
 errors:['Reaction time reading the voltmeter at exact times.','Voltmeter resistance in parallel with R (systematic: faster discharge).','Tolerance of C (±20%).'],
 improve:['Use a data-logger.','Use a larger CR so readings are easier to take.'],
 sim:{x:{label:'Time t',unit:'s',min:0,max:60,step:5,value:0,dp:0},y:{label:'p.d. V',unit:'V',dp:2},
  meas:(t)=>9.0*Math.exp(-t/(470e-6*47e3)), sd:0.02,
  plots:[{name:'ln V against t',X:(x,y)=>x,Y:(x,y)=>Math.log(y),xl:'t / s',yl:'ln (V / V)',res:(m)=>({label:'C = −1/(gradient × R), R = 47 kΩ',v:-1/(m*47e3),u:'F',acc:470e-6})}],
  draw(x,P,W,H,t,a){ const V=9*Math.exp(-t/22.09); x.strokeStyle=P.ink; x.lineWidth=2; x.strokeRect(W*0.15,H*0.2,W*0.4,H*0.6); x.fillStyle=P.bg; x.fillRect(W*0.35-10,H*0.2-6,20,12); x.lineWidth=4; x.beginPath(); x.moveTo(W*0.35-5,H*0.2-14); x.lineTo(W*0.35-5,H*0.2+14); x.moveTo(W*0.35+5,H*0.2-14); x.lineTo(W*0.35+5,H*0.2+14); x.stroke(); x.lineWidth=2; x.fillStyle=P.surface; x.fillRect(W*0.3,H*0.8-10,40,20); x.strokeRect(W*0.3,H*0.8-10,40,20); D.meter(x,P,W*0.65,H*0.3,V.toFixed(2)+' V','voltmeter across C'); D.label(x,P,'t = '+t+' s',W*0.65,H*0.85); }}},

{id:'p10-1',pag:10,title:'Factors affecting the period of SHM',topic:'5.3',
 aim:'Investigate how the period of a mass–spring oscillator depends on the mass.',
 apparatus:['Spring, clamp stand','Slotted masses','Stopwatch, fiducial marker'],
 method:['Hang a mass, pull it down a small distance and release.','Time 10 oscillations from the fiducial marker at the equilibrium position; repeat and find T.','Repeat for masses 100 g to 500 g.','Plot T² against m; gradient = 4π²/k.'],
 safety:['Clamp the stand to the bench.','Keep the amplitude small.'],
 vars:{iv:'mass m',dv:'period T',cv:'spring, amplitude (small)'},
 errors:['Reaction time (reduced by timing many oscillations).','Mass of the spring itself (systematic intercept).'],
 improve:['Use a motion sensor and data-logger.','Time 20 oscillations.'],
 sim:{x:{label:'Mass',unit:'kg',min:0.1,max:0.5,step:0.05,value:0.2,dp:2},y:{label:'time for 10 oscillations',unit:'s',dp:2},
  meas:(m)=>10*2*Math.PI*Math.sqrt((m+0.01)/25), sd:0.08, derived:{label:'T / s',f:(x,y)=>y/10},
  plots:[{name:'T² against m',X:(x,y)=>x,Y:(x,y)=>(y/10)**2,xl:'m / kg',yl:'T² / s²',res:(m)=>({label:'k = 4π² / gradient',v:4*Math.PI**2/m,u:'N m⁻¹',acc:25})}],
  draw(x,P,W,H,m,a){ const top=12, ext=m*9.81/25*H*1.2; const osc=a>0?Math.sin(a*20*Math.PI)*16*(1-a*0.3):0; x.fillStyle=P.ink2; x.fillRect(W*0.3,top-4,W*0.25,6); x.strokeStyle=P.brand; x.lineWidth=2; LK.spring(x,W*0.42,top,W*0.42,top+50+ext+osc,12,8); x.fillStyle=P.deep; x.fillRect(W*0.42-14,top+50+ext+osc,28,10+m*40); x.strokeStyle=P.accent; x.setLineDash([4,4]); x.beginPath(); x.moveTo(W*0.3,top+50+ext+5); x.lineTo(W*0.6,top+50+ext+5); x.stroke(); x.setLineDash([]); D.label(x,P,'fiducial marker',W*0.62,top+50+ext+9); }}},

{id:'p10-2',pag:10,title:'Forced and damped oscillations',topic:'5.3',
 aim:'Plot the resonance curve of a mass–spring system driven by a vibration generator.',
 apparatus:['Vibration generator and signal generator','Spring and mass','Ruler (or motion sensor)','Card to add damping'],
 method:['Attach the spring to the vibration generator and hang the mass.','Set a low driving frequency; wait for steady oscillation and measure the amplitude.','Increase the frequency in small steps, using smaller steps near resonance.','Repeat with a card attached to the mass (more damping).','Plot amplitude against driving frequency; the peak is at the natural frequency.'],
 safety:['Large amplitudes at resonance can throw masses off.'],
 vars:{iv:'driving frequency',dv:'amplitude',cv:'mass, spring, driver amplitude, damping'},
 errors:['Measuring a moving amplitude by eye.','Not waiting for a steady state.'],
 improve:['Use a motion sensor.','Use smaller frequency steps near resonance.'],
 sim:{x:{label:'Driving frequency',unit:'Hz',min:0.6,max:2.0,step:0.05,value:1.0,dp:2},y:{label:'amplitude',unit:'cm',dp:1},
  opts:{label:'Damping',options:[['l','Light'],['h','Heavy (card)']],value:'l'},
  meas:(f,o)=>{ const w=2*Math.PI*f, w0=2*Math.PI*1.25, b=o==='h'?2.2:0.6; return 1.2*w0*w0/Math.sqrt((w0*w0-w*w)**2+(b*w)**2); }, sd:0.15, curve:true,
  plots:[{name:'A against f',X:(x,y)=>x,Y:(x,y)=>y,xl:'f / Hz',yl:'A / cm',peak:true,res:(m,o,c,pts)=>{ const best=pts.reduce((p,q)=>q[1]>p[1]?q:p,[0,0]); return {label:'resonant frequency (peak)',v:best[0],u:'Hz',acc:1.25}; }}],
  draw(x,P,W,H,f,a,o){ const top=14; x.fillStyle=P.ink2; x.fillRect(W*0.32,top,W*0.2,14); const w=2*Math.PI*f, w0=2*Math.PI*1.25, b=o==='h'?2.2:0.6; const A=1.2*w0*w0/Math.sqrt((w0*w0-w*w)**2+(b*w)**2); const y=Math.sin(performance.now()/1000*w)*Math.min(H*0.3,A*6); x.strokeStyle=P.brand; x.lineWidth=2; LK.spring(x,W*0.42,top+14,W*0.42,H*0.5+y,10,8); x.fillStyle=P.deep; x.fillRect(W*0.42-14,H*0.5+y,28,20); if(o==='h'){ x.fillStyle=P.line2; x.fillRect(W*0.42-40,H*0.5+y-4,80,4); } D.label(x,P,'vibration generator '+f.toFixed(2)+' Hz',W*0.54,top+12); }}},

{id:'p11-1',pag:11,title:'Investigating transformers',topic:'6.3',
 aim:'Investigate how the output p.d. of a transformer depends on the number of secondary turns.',
 apparatus:['C-core or laminated iron core','Insulated wire for coils','Low-voltage a.c. supply','a.c. voltmeters'],
 method:['Wind a 100-turn primary and connect it to a 6 V a.c. supply.','Wind secondary coils with different numbers of turns and measure V_s for each.','Plot V_s against N_s; for an ideal transformer gradient = V_p/N_p.'],
 safety:['Never connect to the mains; keep output p.d. low (step-up can give dangerous voltages).'],
 vars:{iv:'number of secondary turns',dv:'secondary p.d.',cv:'primary turns and p.d., core'},
 errors:['Flux leakage and eddy currents reduce V_s (efficiency < 100%).'],
 improve:['Use a laminated core that is closed (no gaps).'],
 sim:{x:{label:'Secondary turns N_s',unit:'',min:25,max:400,step:25,value:100,dp:0},y:{label:'V_s',unit:'V',dp:2},
  meas:(N)=>6*N/100*0.94, sd:0.03, sdRel:true,
  plots:[{name:'V_s against N_s',X:(x,y)=>x,Y:(x,y)=>y,xl:'N_s',yl:'V_s / V',res:(m)=>({label:'efficiency estimate = gradient ÷ (V_p/N_p = 0.060 V per turn)',v:m/0.06*100,u:'%',acc:100})}],
  draw(x,P,W,H,N,a){ x.strokeStyle=P.ink2; x.lineWidth=16; x.strokeRect(W*0.28,H*0.2,W*0.32,H*0.6); x.lineWidth=3; for(let i=0;i<5;i++){ x.strokeStyle=P.brand; x.beginPath(); x.ellipse(W*0.28,H*0.32+i*12,16,5,0,0,7); x.stroke(); } const k=Math.max(2,Math.round(N/30)); for(let i=0;i<k;i++){ x.strokeStyle=P.teal; x.beginPath(); x.ellipse(W*0.6,H*0.25+i*(H*0.5/k),16,4,0,0,7); x.stroke(); } D.label(x,P,'100 turns, 6 V',W*0.12,H*0.9); D.meter(x,P,W*0.72,H*0.35,a>0?(6*N/100*0.94).toFixed(2)+' V':'– V','a.c. voltmeter'); }}},

{id:'p11-2',pag:11,title:'Specific heat capacity of a metal',topic:'5.1',
 aim:'Determine the specific heat capacity of aluminium using an electrical heater.',
 apparatus:['1.0 kg aluminium block with holes for heater and thermometer','12 V heater, ammeter, voltmeter','Thermometer (with a drop of oil), stopwatch','Insulation'],
 method:['Measure the block’s mass. Insulate it.','Switch on the heater; record V and I (constant).','Record the temperature every minute for 10 minutes.','Plot θ against t. The gradient Δθ/Δt of the linear part gives c = VI/(m × gradient).'],
 safety:['The heater and block get hot; allow to cool before handling.'],
 vars:{iv:'time (energy supplied)',dv:'temperature',cv:'mass, power'},
 errors:['Heat loss to surroundings (makes c too large).','Thermometer lags the block.','Heater not fully in contact with the block.'],
 improve:['Insulate; use oil in the holes.','Start below room temperature and end the same amount above it.'],
 sim:{x:{label:'Time t',unit:'s',min:0,max:600,step:60,value:0,dp:0},y:{label:'temperature θ',unit:'°C',dp:1},
  meas:(t)=>{ const P=48, mc=900, k=0.25; return 18+P/k*(1-Math.exp(-k*t/mc)); }, sd:0.1,
  plots:[{name:'θ against t',X:(x,y)=>x,Y:(x,y)=>y,xl:'t / s',yl:'θ / °C',zeroX:true,res:(m)=>({label:'c = VI / (m × gradient), VI = 48 W, m = 1.0 kg',v:48/(1*m),u:'J kg⁻¹ K⁻¹',acc:900})}],
  draw(x,P,W,H,t,a){ const T=18+48/0.25*(1-Math.exp(-0.25*t/900)); x.fillStyle=`rgb(${180+Math.min(60,(T-18)*4)},${180-Math.min(60,(T-18)*3)},${190-Math.min(60,(T-18)*3)})`; x.fillRect(W*0.25,H*0.3,W*0.25,H*0.55); x.strokeStyle=P.ink2; x.strokeRect(W*0.25,H*0.3,W*0.25,H*0.55); x.fillStyle=P.ink; x.fillRect(W*0.31,H*0.1,8,H*0.5); x.fillStyle=P.surface; x.fillRect(W*0.42,H*0.08,8,H*0.5); x.fillStyle=P.bad; x.fillRect(W*0.43,H*0.58-(T-10)*3,6,(T-10)*3); D.meter(x,P,W*0.62,H*0.2,'12.0 V','voltmeter'); D.meter(x,P,W*0.62,H*0.55,'4.00 A','ammeter'); D.label(x,P,'t = '+t+' s',W*0.25,H*0.95); }}},

{id:'p11-3',pag:11,title:'Magnetic flux density with a current balance',topic:'6.3',
 aim:'Determine B between two magnets using a wire carrying a current over a top-pan balance.',
 apparatus:['U-shaped magnet (or two magnets on a yoke) on a top-pan balance','Rigid wire clamped horizontally between the poles','Variable d.c. supply and ammeter','Ruler to measure the length of wire in the field'],
 method:['Zero the balance with the magnet on it and no current.','Pass a current I through the wire; record the change in reading Δm.','Repeat for currents up to 5 A, reversing the current to check.','F = Δm g = BIL. Plot Δm against I; gradient = BL/g, so B = gradient × g / L.'],
 safety:['Wires get hot at higher currents; switch off between readings.'],
 vars:{iv:'current I',dv:'change in balance reading Δm',cv:'length of wire in field, magnet, angle (90°)'},
 errors:['Field is not uniform at the edges (effective L uncertain).','Balance drift.'],
 improve:['Use a longer magnet region; check zero between readings.'],
 sim:{x:{label:'Current I',unit:'A',min:0,max:5,step:0.5,value:2,dp:1},y:{label:'Δm',unit:'g',dp:2},
  meas:(I)=>0.080*I*0.050/9.81*1000, sd:0.01,
  plots:[{name:'Δm against I',X:(x,y)=>x,Y:(x,y)=>y,xl:'I / A',yl:'Δm / g',res:(m)=>({label:'B = gradient × g / L, L = 5.0 cm',v:m/1000*9.81/0.050,u:'T',acc:0.080})}],
  draw(x,P,W,H,I,a){ x.fillStyle=P.ink2; x.fillRect(W*0.2,H*0.75,W*0.4,H*0.15); const dm=0.08*I*0.05/9.81*1000; LK.text(x,(120+(a>0?dm:0)).toFixed(2)+' g',W*0.4,H*0.86,P.surface,{align:'center',weight:700}); x.fillStyle=P.brand; x.fillRect(W*0.25,H*0.3,W*0.08,H*0.45); x.fillStyle=P.teal; x.fillRect(W*0.47,H*0.3,W*0.08,H*0.45); x.strokeStyle=P.accent; x.lineWidth=4; x.beginPath(); x.moveTo(W*0.1,H*0.5); x.lineTo(W*0.7,H*0.5); x.stroke(); D.label(x,P,'wire carrying I = '+I+' A',W*0.62,H*0.45); }}}
];

/* ---------- engine ---------- */
function mountPag(el,p,S){
  const s=p.sim, P0=LK.P; let opt=s.opts?s.opts.value:null; let rows=[]; let anim=0, animOn=false; let plotIx=0; let pending=null;
  const head=LK.ctrl(el);
  let xs; if(s.x.list){ xs=LK.select(head,{label:s.x.label,value:String(s.x.value),options:s.x.list.map(v=>[String(v),v+' '+s.x.unit])}); xs.getV=()=>+xs.value; } else { const sl=LK.slider(head,{label:s.x.label,min:s.x.min,max:s.x.max,step:s.x.step,value:s.x.value,fmt:v=>(+v).toFixed(s.x.dp)+(s.x.unit?' '+s.x.unit:'')}); xs=sl; xs.getV=()=>sl.v; }
  if(s.opts) LK.select(head,{label:s.opts.label,value:s.opts.value,options:s.opts.options,on:v=>{ opt=v; rows=[]; table(); draw(); }});
  const reps=LK.select(head,{label:'Repeats per reading',value:'3',options:[['1','1'],['3','3'],['5','5']]});
  const btns=LK.ctrl(el); const PD=(window.PAGDRAW||{})[p.id]; let pendYs=null, last=null, prevX=null;
  const take=LK.button(btns,'Take reading',()=>{ if(animOn) return; animOn=true; anim=0; pending=xs.getV(); pendYs=Array.from({length:+reps.value},()=>measOnce(pending)); take.disabled=true; },'primary'); LK.button(btns,'Fill a full set',()=>{ autoFill(); }); LK.button(btns,'Clear results',()=>{ rows=[]; table(); draw(); },'ghost');
  const stage=LK.stage(el,S,PD?{ratio:0.53,minH:250,maxH:430}:{ratio:0.36,minH:180,maxH:320});
  const cap=LK.el('<div class="pagcap" aria-live="polite"><div class="pc-steps"></div><p></p></div>'); if(PD) el.appendChild(cap); let capKey='';
  if(s.info) LK.note(el,'<b>Given:</b> '+s.info);
  const tw=LK.el('<div class="tbl pagtbl"></div>'); el.appendChild(tw);
  const pc=LK.ctrl(el); const psel=LK.select(pc,{label:'Graph',value:'0',options:s.plots.map((q,i)=>[String(i),q.name]),on:v=>{ plotIx=+v; draw(); }});
  const pl=LK.plot(el,S,{ratio:0.48});
  const res=LK.el('<div class="pagres" aria-live="polite"></div>'); el.appendChild(res);
  const measOnce=(xv)=>{ let y=s.meas(xv,opt); if(s.poisson){ const sc=s.pscale||1; const N=Math.max(0,y*sc+Math.sqrt(Math.max(1,y*sc))*G()); y=N/sc; } else y=nz(y,s.sdRel?Math.abs(y)*s.sd:s.sd); if(Math.random()<0.04&&!s.poisson) y*=1+(Math.random()<0.5?-1:1)*0.12; return rnd(y,s.y.dp); };
  const addRow=(xv,given)=>{ const n=+reps.value; const ys=given||Array.from({length:n},()=>measOnce(xv)); const existing=rows.find(r=>Math.abs(r.x-xv)<1e-9); const row={x:xv,ys,use:true}; if(existing) Object.assign(existing,row); else rows.push(row); rows.sort((a,b)=>a.x-b.x); };
  const autoFill=()=>{ rows=[]; const list=s.x.list||(()=>{ const a=[]; const n=Math.round((s.x.max-s.x.min)/s.x.step); const k=Math.max(1,Math.round(n/7)); for(let v=s.x.min; v<=s.x.max+1e-9; v+=s.x.step*k) a.push(+v.toFixed(6)); return a; })(); list.forEach(v=>addRow(v)); table(); draw(); };
  const mean=r=>r.ys.reduce((a,b)=>a+b,0)/r.ys.length, unc=r=>r.ys.length>1?(Math.max(...r.ys)-Math.min(...r.ys))/2:0;
  function table(){ const n=Math.max(1,...rows.map(r=>r.ys.length)); const dpm=s.y.dp+1;
    tw.innerHTML=`<table><thead><tr><th>${LK.esc(s.x.label)}${s.x.unit?' / '+LK.esc(s.x.unit):''}</th>${Array.from({length:n},(_,i)=>`<th>${LK.esc(s.y.label.split(' ').slice(-1)[0])} ${i+1}${s.y.unit?' / '+LK.esc(s.y.unit):''}</th>`).join('')}<th>mean${s.y.unit?' / '+LK.esc(s.y.unit):''}</th><th>± (half range)</th>${s.derived?`<th>${LK.esc(s.derived.label)}</th>`:''}<th>use</th></tr></thead><tbody>${rows.length?rows.map((r,i)=>{ const m=mean(r); const spread=unc(r); const anom=r.ys.length>2&&r.ys.some(y=>Math.abs(y-m)>Math.max(3*spread/2,Math.abs(m)*0.06)); return `<tr class="${r.use?'':'off'}"><td>${(+r.x).toFixed(s.x.dp)}</td>${Array.from({length:n},(_,k)=>`<td class="${r.ys.length>2&&Math.abs(r.ys[k]-m)>Math.abs(m)*0.06?'anom':''}">${r.ys[k]!=null?r.ys[k].toFixed(s.y.dp):''}</td>`).join('')}<td><b>${m.toFixed(dpm)}</b></td><td>${spread.toFixed(dpm)}</td>${s.derived?`<td>${LK.sig(s.derived.f(r.x,m),3)}</td>`:''}<td><input type="checkbox" aria-label="use this row" data-i="${i}" ${r.use?'checked':''}></td></tr>`; }).join(''):`<tr><td colspan="${n+4+(s.derived?1:0)}" class="muted">No readings yet. Set the ${LK.esc(s.x.label.toLowerCase())} and press <b>Take reading</b>, or <b>Fill a full set</b>.</td></tr>`}</tbody></table>`;
    tw.querySelectorAll('input[data-i]').forEach(cb=>cb.onchange=()=>{ rows[+cb.dataset.i].use=cb.checked; table(); draw(); }); }
  function draw(){ const P=P0(); const q=s.plots[plotIx]; const pts=rows.filter(r=>r.use).map(r=>{ const m=mean(r), u=unc(r); const X=q.X(r.x,m), Y=q.Y(r.x,m); const dY=u?Math.abs(q.Y(r.x,m+u)-q.Y(r.x,m-u))/2:0; return [X,Y,dY]; }).filter(p=>isFinite(p[0])&&isFinite(p[1]));
    const series=[{pts,points:true,color:P.brand}]; let html='';
    if(q.peak||s.curve){ series.unshift({pts:pts.map(p=>[p[0],p[1]]),color:P.line2}); const r=q.res(0,opt,0,pts); if(pts.length>2) html=`<b>${r.label}:</b> ${LK.sig(r.v,3)} ${r.u} <span class="muted">(true value ${r.acc} ${r.u})</span>`; }
    else { const f=LK.fit(pts.map(p=>[p[0],p[1]])); if(f&&pts.length>=2){ const xs_=pts.map(p=>p[0]); let x0=Math.min(...xs_), x1=Math.max(...xs_); const lo=q.zeroX===false?x0:Math.min(0,x0); const xa=q.zeroX===false&&q.name.includes('θ')?Math.min(-280,x0):lo; series.push({pts:[[xa,f.m*xa+f.c],[x1,f.m*x1+f.c]],color:P.ink2});
        const a=pts.reduce((p,q2)=>q2[0]<p[0]?q2:p), b=pts.reduce((p,q2)=>q2[0]>p[0]?q2:p); let mw=f.m, cw=f.c; if(b[0]!==a[0]){ const m1=((b[1]+b[2])-(a[1]-a[2]))/(b[0]-a[0]), m2=((b[1]-b[2])-(a[1]+a[2]))/(b[0]-a[0]); mw=Math.abs(m1-f.m)>Math.abs(m2-f.m)?m1:m2; cw=mw===m1?(a[1]-a[2])-mw*a[0]:(a[1]+a[2])-mw*a[0]; if(a[2]||b[2]) series.push({pts:[[xa,mw*xa+cw],[x1,mw*x1+cw]],color:P.accent,dash:[5,4]}); }
        const r=q.res(f.m,opt,f.c,pts), rw=q.res(mw,opt,cw,pts); if(isFinite(r.v)){ const du=isFinite(rw.v)?Math.abs(rw.v-r.v):0; const pct=du/Math.abs(r.v)*100; const diff=r.acc!=null?Math.abs(r.v-r.acc)/Math.abs(r.acc)*100:null;
          html=`<div class="pr-row"><span>Gradient</span><b>${LK.sig(f.m,4)}</b><span>Intercept</span><b>${LK.sig(f.c,3)}</b></div><p><b>${r.label}</b> = <b class="big">${LK.sig(r.v,3)} ${r.u}</b>${du?` ± ${LK.sig(du,2)} ${r.u} (${pct.toFixed(1)}% from worst line)`:''}</p>${diff!=null?`<p>Accepted value ${LK.sig(r.acc,3)} ${r.u}: <b>${diff.toFixed(1)}% difference</b>. ${diff<=(pct||5)?'The accepted value lies within your uncertainty.':'The accepted value lies outside your uncertainty: look for a systematic error.'}</p>`:''}`; } else html=`<p>${r.label}</p>`; } else html='<p class="muted">Take at least two readings to draw a line of best fit.</p>'; }
    pl.set(series,{xlab:q.xl,ylab:q.yl,zeroX:q.zeroX!==false?undefined:false,xmin:q.zeroX===false&&q.name.includes('θ')?-300:undefined,ymin:q.zeroX===false&&q.name.includes('θ')?0:undefined}); res.innerHTML=html; }
  table(); draw();
  const fx=v=>(+v).toFixed(s.x.dp)+(s.x.unit?' '+s.x.unit:''), fy=v=>(+v).toFixed(s.y.dp)+(s.y.unit?' '+s.y.unit:'');
  const setCap=(i,txt)=>{ const k=i+'|'+txt; if(k===capKey) return; capKey=k; const steps=PD.steps||[]; cap.querySelector('.pc-steps').innerHTML=steps.map((q,j)=>`<span class="${j<i?'done':j===i?'on':''}">${j+1}</span>`).join(''); cap.querySelector('p').innerHTML=(i>=0?`<b>Step ${i+1} of ${steps.length}.</b> `:'')+LK.esc(txt); };
  S.loop(dt=>{ const P=P0(), x=stage.ctx; stage.clear();
    if(animOn){ anim+=dt/(PD&&PD.dur||1.4); if(anim>=1){ anim=1; animOn=false; addRow(pending,pendYs); last={x:pending,opt,ys:pendYs}; prevX=pending; table(); draw(); take.disabled=false; } }
    if(!PD){ LK.grid(x,stage.w,stage.h,24); s.draw(x,P,stage.w,stage.h,animOn?pending:xs.getV(),animOn?anim:0,opt); return; }
    const xv=animOn?pending:xs.getV(); const done=!animOn&&last&&Math.abs(last.x-xv)<1e-9&&last.opt===opt; const busy=animOn;
    const st={id:p.id,xv,a:busy?anim:(done?1:0),busy,opt,fx,fy,prevX:busy?(last&&last.x!==pending?last.x:prevX):prevX,ys:busy?pendYs:(done?last.ys:[]),show:busy?anim>=(PD.reveal||0.8):!!done};
    st.y= busy? pendYs.reduce((q,r)=>q+r,0)/pendYs.length : (done? last.ys.reduce((q,r)=>q+r,0)/last.ys.length : s.meas(xv,opt));
    const W=stage.w,Hh=stage.h,u=Math.min(W/640,Hh/340); x.save(); x.translate((W-640*u)/2,(Hh-340*u)/2); x.scale(u,u);
    try{ PD.draw(x,P,st); window.PAGH.panel(x,P,st,s); }catch(e){ console.error(e); } x.restore();
    if(busy){ const steps=PD.steps||[]; let i=0; steps.forEach((q,j)=>{ if(anim>=q[0]) i=j; }); setCap(i,steps[i]?steps[i][1]:''); }
    else setCap(-1, done? 'Reading recorded in the table below. Change '+s.x.label.toLowerCase()+' and take another, or press Take reading again to repeat.' : (PD.idle||'Choose a value, then press Take reading.'));
  });
}

window.PAGS={list:PAGS,mount(el,id){ const p=PAGS.find(q=>q.id===id); const S=LK.scope(); mountPag(el,p,S); return ()=>S.dispose(); }};
})();
