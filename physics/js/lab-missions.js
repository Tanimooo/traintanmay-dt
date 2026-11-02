/* Famous space missions: real trajectories and orbits to explore (topic 5.4) */
(function(){
'use strict';
const LK=window.LK, L=window.LABS, D=window.MISSIONDATA||{};
const GE=398600, GMm=4902.8, RM=384400, WM=2*Math.PI/(27.3217*86400), RE=6378, RMOON=1737.4, AU=1.496e8;
const fmtDH=h=>{ const d=Math.floor(h/24), hh=Math.floor(h%24), mm=Math.floor((h*60)%60); return (d?d+' d ':'')+hh+' h '+String(mm).padStart(2,'0')+' min'; };
const lerp=(a,b,k)=>a+(b-a)*k;

/* sample a [[min,x,y],...] path at time tmin (minutes) */
function samp(P,t){ if(t<=P[0][0]) return [P[0][1],P[0][2]]; const n=P.length; if(t>=P[n-1][0]) return [P[n-1][1],P[n-1][2]];
  let lo=0,hi=n-1; while(hi-lo>1){ const m=(lo+hi)>>1; if(P[m][0]<=t) lo=m; else hi=m; } const a=P[lo],b=P[hi],k=(t-a[0])/(b[0]-a[0]||1); return [lerp(a[1],b[1],k),lerp(a[2],b[2],k)]; }

/* ---------- Earth–Moon missions (Apollo 11, Artemis II) ---------- */
function lunarMission(kind){
  const A=D[kind==='apollo'?'apollo':'artemis']; const ph=A.ph;
  const moonAt=tmin=>{ const a=ph+WM*tmin*60; return [RM*Math.cos(a),RM*Math.sin(a),a]; };
  let pos, Tend;
  if(kind==='apollo'){
    const out=A.out, ret=A.ret, loi=A.loi, tei=A.tei, rl=A.rl; const Tl=2*Math.PI*Math.sqrt(rl**3/GMm)/60; // lunar orbit period, min
    const last=out[out.length-1], m0=moonAt(loi); const a0=Math.atan2(last[2]-m0[1],last[1]-m0[0]);
    const prev=out[out.length-3]; const mp=moonAt(prev[0]); const cr=(prev[1]-mp[0])*(last[2]-m0[1])-(prev[2]-mp[1])*(last[1]-m0[0]); const dir=cr>=0?1:-1;
    Tend=ret[ret.length-1][0]/60;
    pos=tmin=>{ if(tmin<=loi) return samp(out,tmin); if(tmin<tei){ const m=moonAt(tmin); const a=a0+dir*2*Math.PI*(tmin-loi)/Tl; return [m[0]+rl*Math.cos(a),m[1]+rl*Math.sin(a)]; } return samp(ret,tmin); };
  } else { const P=A.path; Tend=P[P.length-1][0]/60; pos=tmin=>samp(P,tmin); }
  return {moonAt,pos,Tend};
}

const MISSIONS={
 apollo:{name:'Apollo 11 (1969)',rate:4,unit:'h',
  info:`<b>Apollo 11</b> · launched 16 July 1969 on a Saturn V · crew Neil Armstrong, Buzz Aldrin, Michael Collins · first crewed Moon landing on 20 July 1969 (Sea of Tranquillity) · splashdown 24 July 1969.`,
  physics:['The path is worked out from Newton’s law of gravitation, F = GMm/r², using the pull of both the Earth and the Moon. It is not a drawing.','After the engine burn (translunar injection) the spacecraft coasts. It slows down for about 3 days as it climbs out of Earth’s potential well, then the Moon’s gravity takes over and it speeds up again.','In lunar orbit at about 110 km, gravity provides the centripetal force: v = √(GM/r) ≈ 1.6 km/s, giving a period of about 2 hours.','Switch to the rotating frame to see the classic figure-of-8 shape.'],
  events:[[0,'Translunar injection','The S-IVB engine fires in Earth orbit and sends Apollo 11 towards the Moon at about 10.9 km/s.'],[20,'Coasting uphill','With the engine off, Earth’s gravity slows the spacecraft continuously. Kinetic energy is being converted to gravitational potential energy.'],[60,'Into the Moon’s pull','Past the point where the Moon’s gravitational field is stronger than Earth’s, the spacecraft starts to speed up towards the Moon.'],['loi','Lunar orbit insertion','Behind the Moon, the engine fires to slow down so the Moon can capture the spacecraft into a ~110 km orbit.'],['land','Eagle lands','Armstrong and Aldrin land in the lunar module Eagle while Collins orbits in Columbia. “That’s one small step for [a] man…”'],['tei','Trans-Earth injection','The engine fires again to escape lunar orbit and head home.'],['end','Splashdown','The command module re-enters the atmosphere at about 11 km/s and splashes down in the Pacific.']]},
 artemis:{name:'Artemis II (2026)',rate:4,unit:'h',
  info:`<b>Artemis II</b> · launched 1 April 2026 on NASA’s SLS rocket · crew Reid Wiseman, Victor Glover, Christina Koch, Jeremy Hansen (CSA) · first crewed flight around the Moon since 1972 · splashdown 10 April 2026. The crew travelled 406,771 km from Earth, the farthest any humans have been.`,
  physics:['Artemis II used a <b>free-return trajectory</b>: no engine burn is needed at the Moon. The Moon’s gravity bends the path around the far side and slings Orion back towards Earth.','This makes it safe: if the main engine fails after leaving Earth orbit, gravity still brings the crew home. Apollo 13 used the same idea in 1970.','The simulation keeps the Moon on a circular orbit, so here the far point is about 393,000 km. In April 2026 the real Moon was near its farthest point, which is how the crew set the distance record of 406,771 km.','The real flight first spent about a day in a high Earth orbit for checks. The clock here starts at the burn towards the Moon.'],
  events:[[0,'Translunar injection','Orion’s engine fires and puts the crew on a free-return path to the Moon.'],[30,'Coasting','Earth’s gravity slows Orion all the way out. No engine burns are needed for the rest of the trip.'],['flyby','Lunar flyby','Orion swings round the far side of the Moon, thousands of kilometres above the surface. The crew see the far side with their own eyes.'],['far','Farthest from Earth','The crew are farther from Earth than any humans before them.'],['end','Splashdown','Gravity has brought Orion home. It re-enters at about 11 km/s and splashes down in the Pacific off San Diego.']]},
 hubble:{name:'Hubble and other Earth orbits',rate:0.25,unit:'h',
  info:`<b>Hubble Space Telescope</b> · launched 24 April 1990 from Space Shuttle Discovery · 2.4 m mirror · repaired and upgraded by astronauts on five servicing missions (1993 to 2009). It orbits at roughly 520 km, slowly sinking because of the thin upper atmosphere.`,
  physics:['Every orbit obeys GMm/r² = mv²/r, so v = √(GM/r) and T = 2π√(r³/GM). Lower orbits are faster.','Hubble: r ≈ 6900 km from Earth’s centre, so v ≈ 7.6 km/s and T ≈ 95 minutes. It circles Earth about 15 times a day.','Geostationary satellites: T = 24 h needs r ≈ 42,200 km (about 35,800 km up). They stay above one point on the equator.','At Hubble’s height g is still about 8.4 N/kg. Astronauts feel weightless because they are in free fall, not because there is no gravity.'],
  events:[[0,'Low Earth orbit','Hubble (pink) and the International Space Station (teal) race round Earth every hour and a half.'],[6,'Compare the periods','Hubble has gone round about four times while the geostationary satellite (gold) has gone a quarter of the way round.'],[18,'Kepler’s third law','For every satellite here, T²/r³ is the same: 4π²/GM.']]},
 roman:{name:'Nancy Grace Roman and JWST at L2',rate:72,unit:'h',
  info:`<b>Nancy Grace Roman Space Telescope</b> · launched 30 August 2026 on a SpaceX Falcon Heavy · heading to the Sun–Earth L2 point, about 1.5 million km from Earth on the side away from the Sun · about three months to get there. Its infrared camera has a field of view at least 100 times larger than Hubble’s. The James Webb Space Telescope has orbited L2 since 2022.`,
  physics:['L2 is a Lagrange point. It lies farther from the Sun than Earth does, so on its own it would orbit more slowly. The extra pull of Earth adds to the Sun’s, so an object there keeps pace with Earth: one orbit per year.','Check: at L2, g from the Sun ≈ 5.82 × 10⁻³ N/kg and g from Earth ≈ 1.8 × 10⁻⁴ N/kg. Their sum equals ω²r with ω = 2π / 1 year and r = 1.511 × 10¹¹ m.','The Sun, Earth and Moon are all behind the telescope, so one sunshield keeps its infrared detectors cold.','The view rotates with Earth around the Sun, so the Sun–Earth line stays fixed on the screen.'],
  events:[[0,'Launch','Falcon Heavy sends Roman away from Earth on a path towards L2.'],[24*14,'Cruising out','Roman passes the Moon’s orbit. The Wide Field Instrument is switched on a few weeks into the journey.'],[24*90,'Arrival at L2','About three months after launch Roman settles into a large halo orbit around L2, alongside JWST.'],[24*180,'Science','Roman loops around L2 roughly every six months, with small thruster burns to stay there.']]},
 martian:{name:'The Martian: Earth to Mars',rate:144,unit:'h',
  info:`<b>The Martian</b> (book 2011, film 2015) is fiction. The Hermes crew, and later Mark Watney’s rescuers, travel between Earth and Mars. This shows the real physics any Mars mission has to follow: the most fuel-efficient route, a <b>Hohmann transfer orbit</b>.`,
  physics:['A Hohmann transfer is half of an ellipse that touches Earth’s orbit (1.00 AU) and Mars’s orbit (1.52 AU) about the Sun.','By Kepler’s third law, the transfer ellipse (semi-major axis 1.26 AU) takes 0.5 × 1.26^1.5 years ≈ 259 days.','You can only launch when Mars is about 44° ahead of Earth, so that Mars arrives at the meeting point at the same time. These launch windows come round every 26 months.','In the story Hermes uses ion engines that thrust continuously, so it can be faster than a pure coasting transfer. The “Rich Purnell manoeuvre” uses a gravity assist from Earth to swing straight back to Mars.'],
  events:[[0,'Launch window','Mars is 44° ahead of Earth. The spacecraft speeds up by about 2.9 km/s, from Earth’s 29.8 km/s to 32.7 km/s, which puts it on the transfer ellipse.'],[24*60,'Coasting outward','The spacecraft slows as it climbs away from the Sun: its kinetic energy turns into gravitational potential energy.'],[24*259,'Arrival at Mars','At the far end of the ellipse it is moving at 21.5 km/s, but Mars moves at 24.1 km/s, so it must speed up or be captured by Mars.']]},
 voyager:{name:'Voyager 2: the Grand Tour',rate:24*365,unit:'h',
  info:`<b>Voyager 2</b> · launched 20 August 1977 · flew past Jupiter (1979), Saturn (1981), Uranus (1986) and Neptune (1989). It is still the only spacecraft to visit Uranus and Neptune. It crossed into interstellar space in November 2018 at about 119 AU and is still sending data, now about 140 AU away.`,
  physics:['A rare line-up of the outer planets let each flyby use a <b>gravity assist</b>: the planet’s gravity bends the path and, in the Sun’s frame, the spacecraft gains kinetic energy taken from the planet’s orbital motion.','Without these assists the trip to Neptune would have taken about 30 years instead of 12.','The light-travel time readout shows how long its radio signals take to reach Earth, at c = 3.00 × 10⁸ m/s. At Neptune it was about 4 hours.','Distances here are drawn on a square-root scale so the inner and outer planets fit on one screen. Planet positions are calculated for each date.'],
  events:[[0,'Launch','Voyager 2 leaves Earth on a Titan-Centaur rocket.'],['jup','Jupiter','Closest approach 9 July 1979. Jupiter’s gravity bends the path and speeds Voyager up towards Saturn.'],['sat','Saturn','26 August 1981: the rings, moons and another gravity assist.'],['ura','Uranus','24 January 1986: the first and only visit to Uranus.'],['nep','Neptune','25 August 1989: Neptune and its moon Triton. The last planet on the Grand Tour.'],['helio','Interstellar space','5 November 2018: Voyager 2 crosses the heliopause, where the solar wind gives way to interstellar space.'],['now','Still going','Its radioisotope power supply is running down, but it is still sending data home.']]}
};

/* outer-planet model (circular, coplanar) */
const PL={earth:[1,100.46,1],mars:[1.524,355.45,1.8809],jupiter:[5.203,34.40,11.862],saturn:[9.537,49.94,29.457],uranus:[19.19,313.23,84.01],neptune:[30.07,304.88,164.8]};
const plAng=(k,yr)=>{ const p=PL[k]; return (p[1]+360*(yr-2000)/p[2])*Math.PI/180; };
const VY={t0:1977.635,keys:[[1977.635,'earth'],[1979.52,'jupiter'],[1981.65,'saturn'],[1986.07,'uranus'],[1989.65,'neptune']]};
(function(){ let prev=null; VY.pts=VY.keys.map(([y,k])=>{ let a=((plAng(k,y)%(2*Math.PI))+2*Math.PI)%(2*Math.PI); if(prev!=null){ while(a<prev) a+=2*Math.PI; } prev=a; return [y,a,PL[k][0]]; });
  const an=VY.pts[VY.pts.length-1][1]; VY.pts.push([2018.85,an+0.12,119]); VY.pts.push([2026.9,an+0.13,141]); })();
const vyAt=yr=>{ const P=VY.pts; if(yr<=P[0][0]) return [P[0][1],P[0][2]]; for(let i=1;i<P.length;i++) if(yr<=P[i][0]){ const k=(yr-P[i-1][0])/(P[i][0]-P[i-1][0]); return [lerp(P[i-1][1],P[i][1],k),lerp(P[i-1][2],P[i][2],k)]; } const l=P[P.length-1]; return [l[1],l[2]]; };


/* calculation questions for each mission: answer in the given unit, accepted within tol (fraction) */
const G_E='GM for Earth = 3.99 × 10¹⁴ N m² kg⁻¹', R_E='radius of Earth = 6.37 × 10⁶ m';
const MQ={
 apollo:[
  {q:'Before heading for the Moon, Apollo 11 waited in a circular parking orbit 185 km above Earth’s surface. Calculate its orbital speed.',data:[G_E,R_E],ans:7.80,unit:'km/s',tol:0.02,work:['r = 6.37 × 10⁶ + 1.85 × 10⁵ = 6.555 × 10⁶ m','Gravity provides the centripetal force: GMm/r² = mv²/r, so v = √(GM/r)','v = √(3.99 × 10¹⁴ / 6.555 × 10⁶) = 7.80 × 10³ m/s ≈ 7.8 km/s']},
  {q:'Calculate the escape speed from the parking orbit (185 km up). The translunar burn took Apollo 11 to about 10.9 km/s. Explain why that is enough to reach the Moon even though it is below escape speed.',data:[G_E,R_E],ans:11.0,unit:'km/s',tol:0.02,work:['At escape speed, ½mv² = GMm/r, so v = √(2GM/r)','v = √(2 × 3.99 × 10¹⁴ / 6.555 × 10⁶) = 1.10 × 10⁴ m/s = 11.0 km/s','10.9 km/s is not enough to escape, so the spacecraft is on a very long ellipse. Its far point is out near the Moon’s orbit, where the Moon’s gravity takes over.']},
  {q:'In lunar orbit the command module Columbia circled 110 km above the Moon’s surface. Calculate the orbital period in minutes.',data:['GM for the Moon = 4.90 × 10¹² N m² kg⁻¹','radius of Moon = 1.74 × 10⁶ m'],ans:119,unit:'min',tol:0.03,work:['r = 1.74 × 10⁶ + 1.10 × 10⁵ = 1.85 × 10⁶ m','T = 2π√(r³/GM) = 2π√((1.85 × 10⁶)³ / 4.90 × 10¹²)','T = 7.14 × 10³ s ≈ 119 minutes, so about two hours per orbit']}],
 artemis:[
  {q:'Orion left a parking orbit with r = 6.56 × 10⁶ m (from Earth’s centre). Ignoring the Moon’s gravity, find the minimum speed it needed there to coast out to r = 4.07 × 10⁸ m, its record distance.',data:[G_E,'Use conservation of energy. At the far point the speed is about zero.'],ans:10.9,unit:'km/s',tol:0.02,work:['½mv² − GMm/r₁ = 0 − GMm/r₂','v = √(2GM(1/r₁ − 1/r₂))','v = √(2 × 3.99 × 10¹⁴ × (1/6.56 × 10⁶ − 1/4.07 × 10⁸)) = 1.09 × 10⁴ m/s ≈ 10.9 km/s','This is only about 1% below escape speed: most of the energy is spent climbing out of Earth’s potential well.']},
  {q:'At its farthest point the crew were 4.07 × 10⁸ m from Earth’s centre. Calculate Earth’s gravitational field strength there.',data:[G_E],ans:0.00241,unit:'N/kg',tol:0.03,work:['g = GM/r²','g = 3.99 × 10¹⁴ / (4.07 × 10⁸)² = 2.41 × 10⁻³ N/kg','That is about 4000 times weaker than at Earth’s surface, but it is still what pulls Orion home.']},
  {q:'How long does a radio message take to reach the crew at 4.07 × 10⁸ m?',data:['c = 3.00 × 10⁸ m/s'],ans:1.36,unit:'s',tol:0.02,work:['t = d/c = 4.07 × 10⁸ / 3.00 × 10⁸ = 1.36 s','So a reply comes back about 2.7 s after a question is asked.']}],
 hubble:[
  {q:'Hubble was released into orbit about 540 km above Earth’s surface. Calculate its orbital period in minutes.',data:[G_E,R_E],ans:95.2,unit:'min',tol:0.02,work:['r = 6.37 × 10⁶ + 5.4 × 10⁵ = 6.91 × 10⁶ m','T = 2π√(r³/GM) = 2π√((6.91 × 10⁶)³ / 3.99 × 10¹⁴)','T = 5.71 × 10³ s ≈ 95 minutes']},
  {q:'A geostationary satellite has a period of one sidereal day, 8.62 × 10⁴ s. Calculate its height above Earth’s surface in km.',data:[G_E,R_E],ans:35800,unit:'km',tol:0.02,work:['T² = (4π²/GM) r³, so r = (GMT²/4π²)^(1/3)','r = (3.99 × 10¹⁴ × (8.62 × 10⁴)² / 4π²)^(1/3) = 4.22 × 10⁷ m','height = 4.22 × 10⁷ − 6.37 × 10⁶ = 3.58 × 10⁷ m ≈ 35 800 km']}],
 roman:[
  {q:'Roman orbits the Sun once a year at L2, 1.511 × 10¹¹ m from the Sun. Calculate the centripetal acceleration it needs.',data:['1 year = 3.16 × 10⁷ s'],ans:0.00598,unit:'m/s²',tol:0.03,work:['ω = 2π/T = 2π / 3.16 × 10⁷ = 1.99 × 10⁻⁷ rad/s','a = ω²r = (1.99 × 10⁻⁷)² × 1.511 × 10¹¹ = 5.98 × 10⁻³ m/s²','The Sun alone gives only 5.81 × 10⁻³ m/s² there. Earth’s pull (1.8 × 10⁻⁴) makes up the difference, which is why L2 works.']},
  {q:'L2 is 1.5 × 10⁹ m from Earth. How long do Roman’s radio signals take to reach Earth?',data:['c = 3.00 × 10⁸ m/s'],ans:5.0,unit:'s',tol:0.02,work:['t = d/c = 1.5 × 10⁹ / 3.00 × 10⁸ = 5.0 s']}],
 martian:[
  {q:'A Hohmann transfer orbit to Mars has a semi-major axis of 1.26 AU. Use Kepler’s third law to find the travel time (half an orbit) in days.',data:['For Earth: T = 1 year = 365 days, r = 1.00 AU','Kepler’s third law: T² ∝ r³'],ans:258,unit:'days',tol:0.02,work:['T² ∝ a³, so T = 1.26^1.5 years = 1.414 years','Half an orbit: 0.707 years × 365 = 258 days ≈ 259 days']},
  {q:'Calculate Earth’s orbital speed around the Sun, assuming a circular orbit.',data:['Earth–Sun distance = 1.50 × 10¹¹ m','1 year = 3.16 × 10⁷ s'],ans:29.8,unit:'km/s',tol:0.02,work:['v = 2πr/T = 2π × 1.50 × 10¹¹ / 3.16 × 10⁷','v = 2.98 × 10⁴ m/s ≈ 29.8 km/s','To get onto the transfer orbit the spacecraft must leave at about 32.7 km/s in the same direction, about 2.9 km/s faster.']}],
 voyager:[
  {q:'In 2026 Voyager 2 is about 140 AU from the Sun. How long do its radio signals take to reach Earth? Give your answer in hours.',data:['1 AU = 1.50 × 10¹¹ m','c = 3.00 × 10⁸ m/s'],ans:19.4,unit:'h',tol:0.03,work:['d = 140 × 1.50 × 10¹¹ = 2.10 × 10¹³ m','t = d/c = 2.10 × 10¹³ / 3.00 × 10⁸ = 7.0 × 10⁴ s','t = 7.0 × 10⁴ / 3600 ≈ 19.4 hours']},
  {q:'Voyager 2 now moves away from the Sun at about 15.4 km/s. How many AU does it travel in one year?',data:['1 AU = 1.50 × 10¹¹ m','1 year = 3.16 × 10⁷ s'],ans:3.24,unit:'AU',tol:0.03,work:['distance = 1.54 × 10⁴ × 3.16 × 10⁷ = 4.87 × 10¹¹ m','4.87 × 10¹¹ / 1.50 × 10¹¹ = 3.24 AU per year']}]
};
const MLINKS={
 artemis:[['Artemis II astronauts return from the Moon (OPB, 10 April 2026)','https://www.opb.org/article/2026/04/10/artemis-ii-astronauts-return-from-moon-with-a-splashdown-to-close-out-a-record-breaking-lunar-voyage']],
 roman:[['NASA’s Roman Space Telescope launches (Sci.News)','https://www.sci.news/astronomy/roman-space-telescope-launch-15027.html']]
};
const num=s=>{ const t=String(s).trim().replace(/\s/g,'').replace(/×10\^?/,'e').replace(/,/g,''); const v=parseFloat(t); return isFinite(v)?v:NaN; };
function quizHTML(k){ const Q=MQ[k]||[]; if(!Q.length) return ''; return `<div class="mq"><h3 style="margin:18px 0 8px">Try the calculations</h3>${Q.map((q,i)=>`<div class="card mqc" data-i="${i}"><p style="margin:0 0 6px"><b>Q${i+1}.</b> ${q.q}</p><ul class="muted" style="margin:0 0 8px;padding-left:18px;font-size:.9rem">${q.data.map(d=>`<li>${d}</li>`).join('')}</ul><div class="row"><label class="sr" for="mqa${i}">Your answer</label><input id="mqa${i}" type="text" inputmode="decimal" placeholder="Your answer" style="width:150px"><span>${q.unit}</span><button type="button" class="btn btn-sm primary" data-chk="${i}">Check</button><span class="mqr" aria-live="polite"></span></div><details style="margin-top:8px"><summary>Show the working</summary><ol style="margin:6px 0 0;padding-left:20px">${q.work.map(w=>`<li>${w}</li>`).join('')}</ol></details></div>`).join('')}</div>`; }
function linksHTML(k){ const Lk=MLINKS[k]; return Lk?`<p style="margin:10px 0 0;font-size:.9rem"><b>Read more:</b> ${Lk.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join(' · ')}</p>`:''; }
L.missions={title:'Famous space missions',cat:'Newtonian world',topic:'5.4',
desc:'Follow Apollo 11, Artemis II, Hubble, the Roman telescope at L2, a Mars transfer from The Martian and Voyager 2’s Grand Tour, with the gravity physics behind each.',
howto:'pick a mission, then press play (❚❚ pauses). Drag the <b>Mission time</b> slider to jump around, or tap an event below the picture. For Apollo 11 and Artemis II try the rotating frame to see the figure-of-8.',
icon:'<circle cx="30" cy="70" r="14" fill="currentColor"/><circle cx="95" cy="40" r="7" fill="currentColor"/><path d="M42 62 C70 20 100 20 102 40 C104 58 70 60 44 76" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="6 5"/>',
mount(el){ const S=LK.scope(); const c=LK.ctrl(el);
 let M, key, tm=0, Tend=1, fin=false, LM=null, EV=[], curEv=-1, trail=[];
 const mis=LK.select(c,{label:'Mission',value:'apollo',options:Object.entries(MISSIONS).map(([k,m])=>[k,m.name]),on:()=>setup()});
 const frame=LK.select(c,{label:'View',value:'in',options:[['in','Earth-centred (inertial)'],['rot','Rotating with the Moon (figure-of-8)']]});
 const tsl=LK.slider(c,{label:'Mission time',min:0,max:1000,step:1,value:0,fmt:()=>tLabel(),on:v=>{ tm=v/1000*Tend; fin=false; }});
 LK.button(c,'Restart',()=>{ tm=0; fin=false; LK.time.paused=false; });
 const st=LK.stage(el,S,{ratio:0.6,maxH:600,minH:300});
 const cap=LK.el('<div class="mcap" aria-live="polite"></div>'); el.appendChild(cap);
 const evs=LK.el('<div class="mevs" role="group" aria-label="Mission events"></div>'); el.appendChild(evs);
 const ro=LK.readout(el,[['a','mission time'],['b',''],['c',''],['d','']]);
 const info=LK.el('<div class="minfo lab-after"></div>'); el.appendChild(info);
 const roLab=(k,l)=>{ const b=el.querySelector(`.readout [data-k="${k}"]`); if(b) b.nextElementSibling.textContent=l; };
 function tLabel(){ if(!M) return ''; if(key==='voyager') return (VY.t0+tm/8766).toFixed(1); if(M.unit==='h'&&Tend>24*20) return 'day '+(tm/24).toFixed(0); return fmtDH(tm); }
 function setup(){ key=mis.value; M=MISSIONS[key]; tm=0; fin=false; curEv=-1; trail=[];
   frame.closest('label').hidden=!(key==='apollo'||key==='artemis');
   if(key==='apollo'||key==='artemis'){ LM=lunarMission(key); Tend=LM.Tend; }
   else if(key==='hubble') Tend=24; else if(key==='roman') Tend=24*365; else if(key==='martian') Tend=24*300; else Tend=(2026.9-VY.t0)*8766;
   // resolve named event times
   const named={};
   if(key==='apollo'){ named.loi=D.apollo.loi/60; named.tei=D.apollo.tei/60; named.land=named.loi+26.9; named.end=Tend; }
   if(key==='artemis'){ let best=1e18,bt=0,far=0,ft=0; for(let h=0;h<Tend;h+=0.25){ const p=LM.pos(h*60), m=LM.moonAt(h*60); const d=Math.hypot(p[0]-m[0],p[1]-m[1]); if(d<best){best=d;bt=h;} const r=Math.hypot(p[0],p[1]); if(r>far){far=r;ft=h;} } named.flyby=bt; named.far=ft; named.end=Tend; }
   if(key==='voyager'){ const y=yr=>(yr-VY.t0)*8766; named.jup=y(1979.52); named.sat=y(1981.65); named.ura=y(1986.07); named.nep=y(1989.65); named.helio=y(2018.85); named.now=y(2026.8); }
   EV=M.events.map(e=>[typeof e[0]==='string'?named[e[0]]:e[0],e[1],e[2]]).sort((a,b)=>a[0]-b[0]);
   evs.innerHTML=EV.map((e,i)=>`<button type="button" class="chip" data-e="${i}">${LK.esc(e[1])}</button>`).join('');
   evs.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{ tm=EV[+b.dataset.e][0]; fin=false; trail=[]; });
   info.innerHTML=`<p style="margin:0 0 8px">${M.info}</p><b>The physics</b><ul>${M.physics.map(p=>`<li>${p}</li>`).join('')}</ul>${linksHTML(key)}${quizHTML(key)}`;
   info.querySelectorAll('[data-chk]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.chk, q=MQ[key][i], box=b.closest('.mqc'), v=num(box.querySelector('input').value), r=box.querySelector('.mqr'); if(isNaN(v)){ r.textContent='Enter a number (e.g. 7.8 or 3.6e4)'; r.className='mqr muted'; return; } const ok=Math.abs(v-q.ans)<=Math.abs(q.ans)*q.tol; r.textContent=ok?'✓ Correct':'✗ Not quite: check your working'; r.className='mqr '+(ok?'good':'bad'); if(!ok) box.querySelector('details').open=false; });
   info.querySelectorAll('.mqc input').forEach(inp=>inp.onkeydown=e=>{ if(e.key==='Enter') inp.closest('.mqc').querySelector('[data-chk]').click(); });
   const labs={apollo:['distance from Earth','distance from Moon','speed (Earth frame)'],artemis:['distance from Earth','distance from Moon','speed (Earth frame)'],hubble:['Hubble speed','Hubble period','g at Hubble’s height'],roman:['distance from Earth','Roman’s status','g at L2 (Sun + Earth)'],martian:['distance from Sun','speed (Sun frame)','Mars ahead of Earth by'],voyager:['distance from Sun','light travel time to Earth','last planet passed']}[key];
   roLab('b',labs[0]); roLab('c',labs[1]); roLab('d',labs[2]);
 }
 setup();
 const P0=()=>LK.P();
 function caption(){ let i=-1; EV.forEach((e,k)=>{ if(tm>=e[0]-1e-6) i=k; }); if(i!==curEv){ curEv=i; const e=EV[Math.max(0,i)]; cap.innerHTML=e?`<b>${LK.esc(e[1])}.</b> ${LK.esc(e[2])}`:''; evs.querySelectorAll('[data-e]').forEach((b,k)=>b.setAttribute('aria-pressed',k===i)); } }
 const disc=(x,X,Y,r,col)=>{ x.fillStyle=col; x.beginPath(); x.arc(X,Y,Math.max(1.5,r),0,7); x.fill(); };
 const label=(x,t,X,Y,col,o={})=>LK.text(x,t,X,Y,col,Object.assign({size:11,weight:600},o));
 const stars=x=>{ const P=P0(); x.fillStyle=P.ink2; x.globalAlpha=0.35; for(let i=0;i<70;i++){ const a=i*2.39996, rr=((i*73)%100)/100; x.fillRect(st.w/2+Math.cos(a)*rr*st.w*0.6,st.h/2+Math.sin(a)*rr*st.h*0.6,1.4,1.4); } x.globalAlpha=1; };

 function drawLunar(x){ const P=P0(), tmin=tm*60, rot=frame.value==='rot'; const m=LM.moonAt(tmin); const ca=Math.cos(-m[2]), sa=Math.sin(-m[2]);
   const ox=st.w*0.42, oy=st.h/2, sc=Math.min(st.w*0.5,st.h*0.47)/(RM*1.08);
   const EX=3, blend=(p,cx,cy,R1)=>{ const dx=p[0]-cx, dy=p[1]-cy, d=Math.hypot(dx,dy); if(d>=R1) return p; const f=1+(EX-1)*(1-d/R1)**1.5; return [cx+dx*f,cy+dy*f]; };
   const tf=(p,t)=>{ let q=blend(p,0,0,60000); const mm=t==null?m:LM.moonAt(t); q=blend(q,mm[0],mm[1],30000); if(rot){ const c2=Math.cos(-mm[2]), s2=Math.sin(-mm[2]); q=[q[0]*c2-q[1]*s2,q[0]*s2+q[1]*c2]; } return [ox+q[0]*sc,oy-q[1]*sc]; };
   st.clear(); stars(x);
   // Moon orbit
   x.strokeStyle=P.line2; x.setLineDash([4,6]); x.lineWidth=1; x.beginPath(); x.arc(ox,oy,RM*sc,0,7); x.stroke(); x.setLineDash([]);
   // full path (faint) and flown path
   x.lineWidth=1.2; x.strokeStyle=P.line2; x.globalAlpha=0.7; x.beginPath(); for(let t=0;t<=Tend*60;t+=10){ const q=tf(LM.pos(t),t); t?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); } x.stroke(); x.globalAlpha=1;
   x.strokeStyle=P.brand; x.lineWidth=2.4; x.beginPath(); const stp=Math.max(2,tmin/600); for(let t=0;t<=tmin;t+=stp){ const q=tf(LM.pos(t),t); t?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); } const qn=tf(LM.pos(tmin),tmin); x.lineTo(qn[0],qn[1]); x.stroke();
   // bodies
   const g=x.createRadialGradient(ox-4,oy-4,1,ox,oy,RE*EX*sc); g.addColorStop(0,'#5fb6ff'); g.addColorStop(1,'#1d4f8f'); x.fillStyle=g; x.beginPath(); x.arc(ox,oy,Math.max(5,RE*EX*sc),0,7); x.fill(); label(x,'Earth',ox,oy+Math.max(5,RE*EX*sc)+14,P.ink2,{align:'center'});
   const mq=rot?[ox+RM*sc,oy]:[ox+m[0]*sc,oy-m[1]*sc]; disc(x,mq[0],mq[1],RMOON*EX*sc,'#a9a3ad'); label(x,'Moon',mq[0],mq[1]+Math.max(4,RMOON*EX*sc)+14,P.ink2,{align:'center'});
   x.fillStyle=P.surface; x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); x.arc(qn[0],qn[1],5,0,7); x.fill(); x.stroke();
   label(x,(key==='apollo'?'Apollo 11':'Orion'),qn[0]+9,qn[1]-8,P.brand);
   label(x,'Earth and Moon drawn 3× larger than scale',10,st.h-10,P.muted,{weight:500,size:10});
   if(rot) label(x,'Rotating frame: the Earth–Moon line stays fixed',10,18,P.muted,{weight:500,size:10});
   const p=LM.pos(tmin), p2=LM.pos(tmin+1); const v=Math.hypot(p2[0]-p[0],p2[1]-p[1])/60;
   ro.set('b',LK.sig(Math.hypot(p[0],p[1]),4).replace(/\.\d+ ×/,' ×')+' km'); ro.set('c',Math.round(Math.hypot(p[0]-m[0],p[1]-m[1])).toLocaleString()+' km'); ro.set('d',v.toFixed(2)+' km/s');
   ro.set('b',Math.round(Math.hypot(p[0],p[1])).toLocaleString()+' km');
 }
 const hub=[{n:'Hubble',alt:525,col:'brand'},{n:'ISS',alt:420,col:'teal'},{n:'Geostationary',alt:35786,col:'warn'}];
 function drawHubble(x){ const P=P0(); st.clear(); stars(x); const ox=st.w/2, oy=st.h/2; const sc=Math.min(st.w,st.h)*0.46/(42164); const sc2=Math.min(st.w,st.h)*0.2/(RE+600);
   // inset: close-up of LEO in the left; main: whole system up to GEO
   const g=x.createRadialGradient(ox-6,oy-6,2,ox,oy,RE*sc); g.addColorStop(0,'#5fb6ff'); g.addColorStop(1,'#1d4f8f'); x.fillStyle=g; x.beginPath(); x.arc(ox,oy,RE*sc,0,7); x.fill();
   hub.forEach((s,i)=>{ const r=RE+s.alt; const T=2*Math.PI*Math.sqrt(r**3/GE)/3600; const a=2*Math.PI*tm/T+i*2.1; const col=P[s.col];
     x.strokeStyle=col; x.globalAlpha=0.5; x.lineWidth=1; x.beginPath(); x.arc(ox,oy,r*sc,0,7); x.stroke(); x.globalAlpha=1;
     const X=ox+r*sc*Math.cos(a), Y=oy-r*sc*Math.sin(a); disc(x,X,Y,4,col); if(i===2) label(x,s.n+' (T = 24 h)',X+8,Y-6,col); });
   // close-up panel
   const bx=12, by=12, bw=Math.min(220,st.w*0.36), bh=bw; x.fillStyle=P.surface; x.strokeStyle=P.line2; x.fillRect(bx,by,bw,bh); x.strokeRect(bx,by,bw,bh);
   const cx=bx+bw/2, cy=by+bh/2, s2=bw*0.45/(RE+600); const g2=x.createRadialGradient(cx-6,cy-6,2,cx,cy,RE*s2); g2.addColorStop(0,'#5fb6ff'); g2.addColorStop(1,'#1d4f8f'); x.fillStyle=g2; x.beginPath(); x.arc(cx,cy,RE*s2,0,7); x.fill();
   hub.slice(0,2).forEach((s,i)=>{ const r=RE+s.alt; const T=2*Math.PI*Math.sqrt(r**3/GE)/3600; const a=2*Math.PI*tm/T+i*2.1; const col=P[s.col]; x.strokeStyle=col; x.globalAlpha=0.6; x.beginPath(); x.arc(cx,cy,r*s2,0,7); x.stroke(); x.globalAlpha=1; const X=cx+r*s2*Math.cos(a), Y=cy-r*s2*Math.sin(a); disc(x,X,Y,4,col); label(x,s.n,X+(Math.cos(a)>0?7:-7),Y-6,col,{align:Math.cos(a)>0?'left':'right'}); });
   label(x,'Close-up: low Earth orbit (to scale)',bx+6,by+bh-8,P.muted,{weight:500,size:10});
   label(x,'Main view: to scale out to geostationary orbit',10,st.h-10,P.muted,{weight:500,size:10});
   const r=RE+525; ro.set('b',(Math.sqrt(GE/r)).toFixed(2)+' km/s'); ro.set('c',(2*Math.PI*Math.sqrt(r**3/GE)/60).toFixed(1)+' min'); ro.set('d',(GE*1e9/(r*1e3)**2).toFixed(2)+' N/kg');
 }
 function drawRoman(x){ const P=P0(); st.clear(); stars(x); const day=tm/24; const ex=st.w*0.24, ey=st.h/2; const DL2=1.5e6; const sc=(st.w*0.62)/DL2; const lx=ex+DL2*sc;
   // Sun direction arrow
   x.fillStyle='#f5b83d'; x.beginPath(); x.arc(-st.h*0.9,ey,st.h*0.98,0,7); x.globalAlpha=0.25; x.fill(); x.globalAlpha=1; LK.arrow(x,ex-30,ey+0,10,ey,'#d99a1e',2,8); label(x,'to the Sun (150 million km)',12,ey-10,'#b27a00');
   // Moon orbit
   x.strokeStyle=P.line2; x.setLineDash([4,6]); x.beginPath(); x.arc(ex,ey,RM*sc,0,7); x.stroke(); x.setLineDash([]); const ma=2*Math.PI*day/29.53; disc(x,ex+RM*sc*Math.cos(ma),ey-RM*sc*Math.sin(ma),3,'#a9a3ad');
   disc(x,ex,ey,7,'#2f7fd1'); label(x,'Earth',ex,ey+22,P.ink2,{align:'center'});
   // L2 marker
   x.strokeStyle=P.ink2; x.lineWidth=1.2; x.beginPath(); x.moveTo(lx-6,ey-6); x.lineTo(lx+6,ey+6); x.moveTo(lx+6,ey-6); x.lineTo(lx-6,ey+6); x.stroke(); label(x,'L2',lx+8,ey+16,P.ink2);
   // halo orbit (drawn as ellipse projected into this view)
   const hx=st.w*0.08, hy=Math.min(st.h*0.36,st.w*0.2); x.strokeStyle=P.line2; x.setLineDash([3,5]); x.beginPath(); x.ellipse(lx,ey,hx,hy,0,0,7); x.stroke(); x.setLineDash([]);
   const haloPos=(d,ph0)=>{ const a=2*Math.PI*d/180+ph0; return [lx+hx*Math.cos(a),ey-hy*Math.sin(a)]; };
   const jw=haloPos(day+60,1.3); disc(x,jw[0],jw[1],4,P.teal); label(x,'JWST',jw[0]+7,jw[1]-6,P.teal);
   // Roman transfer: smooth curve from Earth to halo entry over 90 days
   const entry=haloPos(0,Math.PI*0.75); const curve=k=>{ const s=k*k*(3-2*k); return [lerp(ex,entry[0],s)+Math.sin(Math.PI*k)*st.w*0.03,lerp(ey,entry[1],s)-Math.sin(Math.PI*k)*hy*0.6]; };
   let rp; x.strokeStyle=P.brand; x.lineWidth=2; x.beginPath(); for(let k=0;k<=1.0001;k+=0.02){ if(k*90>day) break; const q=curve(k); k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]); }
   if(day<=90){ rp=curve(day/90); x.lineTo(rp[0],rp[1]); x.stroke(); } else { const q=curve(1); x.lineTo(q[0],q[1]); x.stroke(); x.strokeStyle=P.brand; x.beginPath(); const a0=Math.PI*0.75; for(let d=0;d<=day-90;d+=1){ const q2=haloPos(d,a0); d?x.lineTo(q2[0],q2[1]):x.moveTo(q2[0],q2[1]); } x.stroke(); rp=haloPos(day-90,a0); }
   x.fillStyle=P.surface; x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); x.arc(rp[0],rp[1],5,0,7); x.fill(); x.stroke(); label(x,'Roman',rp[0]+8,rp[1]-8,P.brand);
   label(x,'Halo orbit shown schematically. Distances along the Sun–Earth line to scale.',10,st.h-10,P.muted,{weight:500,size:10});
   const dist=Math.hypot(rp[0]-ex,(rp[1]-ey))/sc; ro.set('b',(dist/1e6).toFixed(2)+' million km'); ro.set('c',day<90?'travelling to L2':'orbiting L2'); ro.set('d','5.99 × 10⁻³ N/kg = ω²r');
 }
 function drawMartian(x){ const P=P0(); st.clear(); stars(x); const day=tm/24; const ox=st.w/2, oy=st.h/2; const sc=Math.min(st.w,st.h)*0.44/1.6;
   const sun=x.createRadialGradient(ox,oy,1,ox,oy,12); sun.addColorStop(0,'#fff3b0'); sun.addColorStop(1,'#f5a623'); x.fillStyle=sun; x.beginPath(); x.arc(ox,oy,10,0,7); x.fill(); label(x,'Sun',ox,oy+24,P.ink2,{align:'center'});
   const yr=365.25, TM=686.98; const aE=2*Math.PI*day/yr, aM=44.3*Math.PI/180+2*Math.PI*day/TM;
   [[1,'#2f7fd1','Earth',aE],[1.524,'#c4573a','Mars',aM]].forEach(([r,col,n,a])=>{ x.strokeStyle=P.line2; x.setLineDash([4,6]); x.beginPath(); x.arc(ox,oy,r*sc,0,7); x.stroke(); x.setLineDash([]); const X=ox+r*sc*Math.cos(a), Y=oy-r*sc*Math.sin(a); disc(x,X,Y,6,col); label(x,n,X+9,Y-8,col); });
   // transfer ellipse, perihelion at angle 0
   const a=(1+1.524)/2, e=(1.524-1)/(1.524+1), Tt=yr*a**1.5/2; const rAt=th=>a*(1-e*e)/(1+e*Math.cos(th));
   const thAt=d=>{ const Mm=Math.PI*Math.min(d,Tt)/Tt; let E=Mm; for(let i=0;i<20;i++) E=E-(E-e*Math.sin(E)-Mm)/(1-e*Math.cos(E)); return 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2)); };
   x.strokeStyle=P.line2; x.beginPath(); for(let th=0;th<=Math.PI+1e-6;th+=0.03){ const r=rAt(th); const X=ox+r*sc*Math.cos(th), Y=oy-r*sc*Math.sin(th); th?x.lineTo(X,Y):x.moveTo(X,Y); } x.stroke();
   let th=thAt(day), r=rAt(th), X, Y; if(day>Tt){ th=aM; r=1.524; }
   x.strokeStyle=P.brand; x.lineWidth=2.4; x.beginPath(); const thEnd=Math.min(th,Math.PI); for(let t=0;t<=thEnd;t+=0.02){ const rr=rAt(t); const XX=ox+rr*sc*Math.cos(t), YY=oy-rr*sc*Math.sin(t); t?x.lineTo(XX,YY):x.moveTo(XX,YY); } x.stroke();
   X=ox+r*sc*Math.cos(th); Y=oy-r*sc*Math.sin(th); x.fillStyle=P.surface; x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); x.arc(X,Y,5,0,7); x.fill(); x.stroke(); label(x,day>Tt?'Arrived at Mars':'Spacecraft',X+8,Y+16,P.brand);
   label(x,'Orbits to scale (circular). Mars started 44° ahead of Earth.',10,st.h-10,P.muted,{weight:500,size:10});
   const GMs=1.327e11; const rk=r*AU; const v=day>Tt?24.1:Math.sqrt(GMs*(2/rk-1/(a*AU))); let lead=((aM-aE)*180/Math.PI)%360; if(lead<0) lead+=360;
   ro.set('b',r.toFixed(3)+' AU'); ro.set('c',v.toFixed(1)+' km/s'); ro.set('d',Math.round(lead)+'°');
 }
 function drawVoyager(x){ const P=P0(); st.clear(); stars(x); const yr=VY.t0+tm/8766; const ox=st.w*0.5, oy=st.h*0.5; const R=Math.min(st.w,st.h)*0.47; const f=r=>R*Math.sqrt(r)/Math.sqrt(150);
   const sun=x.createRadialGradient(ox,oy,1,ox,oy,8); sun.addColorStop(0,'#fff3b0'); sun.addColorStop(1,'#f5a623'); x.fillStyle=sun; x.beginPath(); x.arc(ox,oy,6,0,7); x.fill();
   x.strokeStyle=P.line2; x.globalAlpha=0.6; x.setLineDash([2,6]); x.beginPath(); x.arc(ox,oy,f(119),0,7); x.stroke(); x.setLineDash([]); x.globalAlpha=1; label(x,'heliopause ≈ 120 AU',ox+f(119)*0.72,oy-f(119)*0.72,P.muted,{weight:500,size:10});
   const cols={earth:'#2f7fd1',jupiter:'#c99a62',saturn:'#d8b26a',uranus:'#6fc3c9',neptune:'#4a6fd6'};
   Object.keys(cols).forEach(k=>{ const r=PL[k][0], a=plAng(k,yr); x.strokeStyle=P.line2; x.globalAlpha=0.6; x.beginPath(); x.arc(ox,oy,f(r),0,7); x.stroke(); x.globalAlpha=1; const X=ox+f(r)*Math.cos(a), Y=oy-f(r)*Math.sin(a); disc(x,X,Y,k==='earth'?3:5,cols[k]); label(x,k[0].toUpperCase()+k.slice(1),X+7,Y-6,cols[k],{size:10}); });
   x.strokeStyle=P.brand; x.lineWidth=2.2; x.beginPath(); let first=true; for(let y=VY.t0;y<=yr;y+=0.02){ const [a,r]=vyAt(y); const X=ox+f(r)*Math.cos(a), Y=oy-f(r)*Math.sin(a); first?x.moveTo(X,Y):x.lineTo(X,Y); first=false; } const [a,r]=vyAt(yr); const X=ox+f(r)*Math.cos(a), Y=oy-f(r)*Math.sin(a); x.lineTo(X,Y); x.stroke();
   x.fillStyle=P.surface; x.strokeStyle=P.brand; x.lineWidth=2.5; x.beginPath(); x.arc(X,Y,5,0,7); x.fill(); x.stroke(); label(x,'Voyager 2',X+8,Y+16,P.brand);
   label(x,'Square-root distance scale · path drawn in the plane of the planets',10,st.h-10,P.muted,{weight:500,size:10});
   const passed=[['Jupiter',1979.52],['Saturn',1981.65],['Uranus',1986.07],['Neptune',1989.65]].filter(p=>yr>=p[1]).pop();
   ro.set('b',r.toFixed(1)+' AU'); const lt=r*499/3600; ro.set('c',lt<1?(lt*60).toFixed(0)+' min':lt.toFixed(1)+' h'); ro.set('d',passed?passed[0]:'none yet');
 }
 let fl=0;
 S.loop(dt=>{ if(!M) return; if(!fin){ tm+=dt*M.rate; if(tm>=Tend){ tm=Tend; fin=true; } }
   if((fl++)%3===0){ tsl.set(Math.round(tm/Tend*1000)); }
   ro.set('a',key==='voyager'?'year '+(VY.t0+tm/8766).toFixed(1):tLabel());
   const x=st.ctx;
   if(key==='apollo'||key==='artemis') drawLunar(x); else if(key==='hubble') drawHubble(x); else if(key==='roman') drawRoman(x); else if(key==='martian') drawMartian(x); else drawVoyager(x);
   if(fin){ const P=P0(); LK.text(x,'Mission complete. Press Restart to watch again.',st.w-12,22,P.brand,{align:'right',size:12,weight:700}); }
   caption();
 });
 return ()=>S.dispose(); }};
})();
