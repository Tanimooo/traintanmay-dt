/* Module 3: Forces and motion */
(function(){
const S=window.SPEC, P=S.pack, M='3-Forces-and-Motion/';
const pk=(sub,name)=>[P('Set O 2022–24',name+' QP',M+sub+'/Set-O/'+name+' QP.pdf'),P('Set O 2022–24',name+' MS',M+sub+'/Set-O/'+name+' MS.pdf'),P('Set N 2016–21',name+' QP',M+sub+'/Set-N/'+name+' QP.pdf'),P('Set N 2016–21',name+' MS',M+sub+'/Set-N/'+name+' MS.pdf')];
const legacy=(sub,base,n,c1)=>{const a=[];for(let i=1;i<=n;i++){a.push(P('Set M (legacy)',base+' '+i+' QP',M+sub+'/Set-M/'+base+' '+i+' QP.pdf'),P('Set M (legacy)',base+' '+i+' MS',M+sub+'/Set-M/'+base+' '+i+' MS.pdf'));} if(c1){a.push(P('Set C (legacy G481)',c1,M+sub+'/Set-C/'+c1+'.pdf'),P('Set C (legacy G481)',c1+' MS',M+sub+'/Set-C/'+c1+' MS.pdf'));} return a;};

S.addTopic({
id:'3.1',mod:3,title:'Motion',short:'Kinematics graphs, suvat, stopping distances and projectiles.',
labs:['projectile','motiongraphs'],pags:['p1-1','p1-3'],
spec:['Displacement, instantaneous speed, average speed, velocity and acceleration','Graphical representations of displacement, speed, velocity and acceleration','Displacement–time graphs: velocity is the gradient','Velocity–time graphs: acceleration is the gradient; displacement is the area under the graph','The suvat equations for constant acceleration (derivation from a v–t graph)','Acceleration g of free fall; experimental determination of g in the laboratory (PAG1)','Reaction time and thinking distance; braking distance and stopping distance for a vehicle','Independence of the vertical and horizontal motion of a projectile; two-dimensional motion of a projectile with constant velocity in one direction and constant acceleration in a perpendicular direction'],
packs:pk('3.1-Motion','3.1 Motion').concat(legacy('3.1-Motion','Motion',3,'Motion')),
notes:`
<h2>Definitions</h2>
<ul><li><strong>Displacement</strong>: distance in a given direction (vector).</li><li><strong>Average speed</strong> = total distance ÷ total time. <strong>Instantaneous speed</strong>: speed at a particular instant, from the gradient of a tangent on a distance–time graph.</li><li><strong>Velocity</strong>: rate of change of displacement.</li><li><strong>Acceleration</strong>: rate of change of velocity, a = Δv/Δt.</li></ul>
<h2>Motion graphs</h2>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Displacement-time, velocity-time and acceleration-time graphs for uniform acceleration">
<g><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><path class="c1" d="M20 170 Q100 165 160 50"/><text x="30" y="30">s</text><text x="160" y="190">t</text><text x="30" y="205" class="small">gradient = v</text></g>
<g transform="translate(190 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><path class="fillsoft" d="M20 170 L160 60 L160 170 Z"/><line class="c1" x1="20" y1="170" x2="160" y2="60"/><text x="30" y="30">v</text><text x="160" y="190">t</text><text x="30" y="205" class="small">gradient = a, area = s</text></g>
<g transform="translate(380 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><line class="c1" x1="20" y1="100" x2="160" y2="100"/><text x="30" y="30">a</text><text x="160" y="190">t</text><text x="30" y="205" class="small">area = Δv</text></g>
</svg>
<h2>The suvat equations</h2>
<p>For <strong>constant acceleration</strong> only. s displacement, u initial velocity, v final velocity, a acceleration, t time.</p>
<div class="eqgrid"><div>v = u + at</div><div>s = ½(u + v)t</div><div>s = ut + ½at²</div><div>v² = u² + 2as</div></div>
<p>Derivation: on a v–t graph, gradient (v − u)/t = a gives v = u + at; the area of the trapezium is s = ½(u + v)t; substituting gives the other two.</p>
<h2>Free fall</h2>
<p>An object falling with only gravity acting accelerates at <strong>g = 9.81 m s<sup>−2</sup></strong>. Methods to measure g: electromagnet and trapdoor with timer; light gates; video analysis; data-logger with ticker tape. Plot <strong>s against t²</strong>; gradient = g/2.</p>
<h2>Stopping distance</h2>
<p><strong>Stopping distance = thinking distance + braking distance</strong>. Thinking distance = speed × reaction time (∝ v). Braking distance ∝ v² because the work done by the braking force Fd = ½mv². Reaction time increases with tiredness, alcohol, drugs, distractions; braking distance increases with wet/icy roads, worn tyres or brakes, greater mass.</p>
<h2>Projectiles</h2>
<svg class="diagram" viewBox="0 0 540 220" role="img" aria-label="Projectile path with constant horizontal velocity and changing vertical velocity">
<line class="ax" x1="30" y1="190" x2="520" y2="190"/>
<path class="c1" d="M40 190 Q270 -50 500 190"/>
<g class="c2 thick"><line x1="40" y1="190" x2="100" y2="190" marker-end="url(#aha)"/><line x1="40" y1="190" x2="40" y2="120" marker-end="url(#aha)"/></g>
<g class="c2 thick"><line x1="270" y1="70" x2="330" y2="70" marker-end="url(#aha)"/></g>
<g class="c2 thick"><line x1="470" y1="150" x2="530" y2="150" marker-end="url(#aha)"/><line x1="470" y1="150" x2="470" y2="205" marker-end="url(#aha)"/></g>
<text x="60" y="110" class="small">u sin θ</text><text x="100" y="206" class="small">u cos θ</text><text x="235" y="60" class="small">v<tspan dy="3" font-size="9">y</tspan><tspan dy="-3"> = 0 at top</tspan></text></svg>
<p>Horizontal and vertical motion are <strong>independent</strong>. Without air resistance:</p>
<ul><li>Horizontal: constant velocity u<sub>x</sub> = u cos θ, so x = u<sub>x</sub>t.</li><li>Vertical: constant acceleration −g, u<sub>y</sub> = u sin θ, use suvat.</li><li>Time links the two. At maximum height v<sub>y</sub> = 0.</li></ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> a ball thrown horizontally from a cliff and one dropped from the same height land at the same time.</p></blockquote>`,
eqs:[['v = u + at','suvat'],['s = ½(u + v)t','suvat'],['s = ut + ½at²','suvat'],['v² = u² + 2as','suvat'],['thinking distance = v × t<sub>reaction</sub>','Stopping distances'],['range (level ground) = u² sin 2θ / g','Useful result (derive, not given)']],
terms:[['Displacement','Distance travelled in a specified direction.'],['Velocity','Rate of change of displacement.'],['Acceleration','Rate of change of velocity.'],['Instantaneous speed','Speed at a particular instant; gradient of the tangent to a distance–time graph.'],['Average speed','Total distance travelled divided by total time.'],['Thinking distance','Distance travelled between seeing a hazard and applying the brakes.'],['Braking distance','Distance travelled from applying the brakes until the vehicle stops.'],['Stopping distance','Thinking distance + braking distance.'],['Free fall','Motion of an object with only gravity acting on it, acceleration g.'],['Projectile','An object moving under gravity alone after being launched.']],
mcq:[
{q:'A car accelerates uniformly from 12 m s⁻¹ to 30 m s⁻¹ in 6.0 s. How far does it travel?',o:['72 m','126 m','180 m','252 m'],a:1,e:'s = ½(12 + 30) × 6 = 126 m.'},
{q:'A stone is dropped from rest. How far does it fall in the third second?',o:['14.7 m','24.5 m','44.1 m','29.4 m'],a:1,e:'s(3) − s(2) = ½ × 9.81 × (9 − 4) = 24.5 m.'},
{q:'A ball is projected horizontally at 8.0 m s⁻¹ from a 20 m high wall. Ignoring air resistance, how far from the wall does it land?',o:['8.1 m','16 m','20 m','32 m'],a:1,e:'t = √(2 × 20 / 9.81) = 2.02 s; x = 8.0 × 2.02 = 16 m.'},
{q:'The speed of a car doubles. The braking distance (same braking force)',o:['doubles','halves','quadruples','stays the same'],a:2,e:'Fd = ½mv², so d ∝ v².'},
{q:'What does the area under an acceleration–time graph represent?',o:['displacement','change in velocity','jerk','force'],a:1,e:'∫a dt = Δv.'},
{q:'A ball is thrown at 20 m s⁻¹ at 30° above the horizontal. Its speed at the top of its flight is',o:['0','10 m s⁻¹','17.3 m s⁻¹','20 m s⁻¹'],a:2,e:'Only horizontal velocity remains: 20 cos 30° = 17.3 m s⁻¹.'}
],
exam:[
{id:'3.1-E1',marks:7,style:'Structured · projectile',stem:'A golf ball is struck at 35 m s⁻¹ at 40° to the horizontal on level ground. Air resistance is negligible.',parts:[
{q:'Calculate the horizontal and vertical components of the initial velocity.',m:2,ms:['u_x = 35 cos 40° = 26.8 m s⁻¹','u_y = 35 sin 40° = 22.5 m s⁻¹']},
{q:'Calculate the maximum height reached.',m:2,ms:['v² = u² + 2as with v = 0: 0 = 22.5² − 2 × 9.81 × h','h = 25.8 m'],ans:'26 m'},
{q:'Calculate the horizontal range.',m:3,ms:['time of flight t = 2u_y/g = 2 × 22.5 / 9.81 = 4.59 s','range = u_x t = 26.8 × 4.59','= 123 m'],ans:'≈ 120 m'}]},
{id:'3.1-E2',marks:6,style:'Structured · stopping distance',stem:'A driver travelling at 25 m s⁻¹ sees a hazard. The reaction time is 0.70 s and the car decelerates uniformly at 6.5 m s⁻² once the brakes are applied.',parts:[
{q:'Calculate the stopping distance.',m:3,ms:['thinking distance = 25 × 0.70 = 17.5 m','braking distance = 25² / (2 × 6.5) = 48.1 m','stopping distance = 65.6 m'],ans:'66 m'},
{q:'The driver has drunk alcohol and the reaction time doubles. Explain, with a calculation, how the stopping distance changes.',m:2,ms:['thinking distance doubles to 35 m; braking distance unchanged','stopping distance = 83 m (increase of 17.5 m)']},
{q:'State one factor that increases braking distance but not thinking distance.',m:1,ms:['wet/icy road, worn tyres, worn brakes, greater mass, downhill slope (any one)']}]}
]});

S.addTopic({
id:'3.2',mod:3,title:'Forces in action',short:'Newton II, drag and terminal velocity, moments, equilibrium, density, pressure, upthrust.',
labs:['terminal','moments','forces'],pags:['p1-2'],
spec:['Net force = mass × acceleration (F = ma); the newton','Weight as the gravitational force; W = mg','Free-body diagrams; one- and two-dimensional motion under constant force','Drag as the frictional force experienced by an object travelling through a fluid; factors affecting drag','Motion of objects falling in a uniform gravitational field in the presence of drag; terminal velocity','Moment of a force; couple; torque of a couple','The principle of moments; centre of mass and centre of gravity','Triangle of forces for three coplanar forces in equilibrium','Density ρ = m/V; pressure p = F/A; p = hρg; upthrust; Archimedes’ principle'],
packs:[...['3.2 Forces in Action - Density','3.2 Forces in Action - Equilibrium','3.2 Forces in Action - Motion with non-uniform acceleration','3.2 Forces in Dynamics'].flatMap(n=>pk('3.2-Forces-in-Action',n))].concat(legacy('3.2-Forces-in-Action','Forces',6,'Forces')),
notes:`
<h2>Newton's second law and weight</h2>
<p><strong>F<sub>net</sub> = ma</strong>. One newton is the force that gives a 1 kg mass an acceleration of 1 m s<sup>−2</sup>. <strong>Weight</strong> W = mg is the gravitational force on an object; mass is the amount of matter and does not change.</p>
<h2>Free-body diagrams</h2>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Free-body diagram of a skydiver: weight down, drag up">
<rect x="230" y="90" width="50" height="40" rx="8" class="fill2 ax"/>
<line class="ax thick" x1="255" y1="130" x2="255" y2="205" marker-end="url(#ah)"/><text x="262" y="200">W = mg</text>
<line class="c1 thick" x1="255" y1="90" x2="255" y2="30" marker-end="url(#ahb)"/><text x="262" y="40" class="lbl1">drag D</text>
<text x="330" y="112">F<tspan font-size="9" dy="3">net</tspan><tspan dy="-3"> = mg − D</tspan></text></svg>
<p>Draw only forces acting <em>on</em> the object, from the point of action, with arrow length showing relative size.</p>
<h2>Drag and terminal velocity</h2>
<p>Drag depends on speed (roughly ∝ v² at high speed), cross-sectional area, shape and the density/viscosity of the fluid. A falling object:</p>
<ol><li>At release v = 0, drag = 0, a = g.</li><li>As v increases, drag increases, resultant force decreases, so acceleration decreases.</li><li>When drag = weight, resultant force = 0, a = 0: <strong>terminal velocity</strong>.</li></ol>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="Velocity-time graph rising to terminal velocity, then a parachute drop to a lower terminal velocity">
<line class="ax" x1="40" y1="170" x2="500" y2="170" marker-end="url(#ah)"/><line class="ax" x1="40" y1="170" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 170 C110 60 150 45 250 42 L260 42 C270 140 280 128 330 132 L490 132"/>
<line class="dash ax" x1="40" y1="42" x2="250" y2="42"/><text x="46" y="36" class="small">terminal velocity 1</text><text x="330" y="124" class="small">parachute open → lower terminal velocity</text><text x="22" y="30">v</text><text x="485" y="190">t</text></svg>
<h2>Moments and equilibrium</h2>
<p><strong>Moment</strong> of a force = force × perpendicular distance from the pivot to the line of action (N m). <strong>Principle of moments</strong>: for an object in equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about that point.</p>
<p>A <strong>couple</strong> is a pair of equal, opposite, parallel forces that produce rotation but no translation. <strong>Torque of a couple</strong> = one force × perpendicular distance between the forces.</p>
<p>For <strong>equilibrium</strong>: resultant force = 0 and resultant moment = 0. Three coplanar forces in equilibrium form a closed <strong>triangle of forces</strong>.</p>
<p>The <strong>centre of mass</strong> is the point where all the mass may be considered to act; the <strong>centre of gravity</strong> is the point where the weight may be considered to act. Find it for a flat lamina by hanging it from two points and drawing plumb lines.</p>
<h2>Density, pressure and upthrust</h2>
<ul><li>ρ = m/V (kg m<sup>−3</sup>); p = F/A (Pa)</li><li>Pressure in a fluid at depth h: <strong>p = hρg</strong> (depends on depth and density, not on the shape of the container).</li><li><strong>Upthrust</strong> exists because pressure is greater on the lower surface than on the upper surface. <strong>Archimedes' principle</strong>: upthrust equals the weight of fluid displaced.</li><li>An object floats when upthrust = weight.</li></ul>`,
eqs:[['F = ma','Newton’s second law'],['W = mg','Weight'],['moment = Fx','Moment of a force'],['torque = Fd','Torque of a couple'],['ρ = m/V','Density'],['p = F/A','Pressure'],['p = hρg','Pressure in a fluid'],['upthrust = ρ<sub>fluid</sub> V g','Archimedes’ principle']],
terms:[['Newton','The force that gives a mass of 1 kg an acceleration of 1 m s⁻².'],['Weight','The gravitational force acting on an object, W = mg.'],['Drag','A frictional force on an object moving through a fluid.'],['Terminal velocity','The constant velocity reached when drag equals weight so the resultant force is zero.'],['Moment of a force','Force × perpendicular distance from the pivot to the line of action of the force.'],['Couple','A pair of equal, opposite forces acting along different lines that cause rotation only.'],['Torque of a couple','One of the forces × the perpendicular distance between them.'],['Principle of moments','For equilibrium, the sum of clockwise moments about any point = sum of anticlockwise moments about the same point.'],['Centre of gravity','The point where the entire weight of an object can be considered to act.'],['Centre of mass','The point where the entire mass of an object can be considered to act.'],['Density','Mass per unit volume.'],['Pressure','Normal force per unit area.'],['Upthrust','The upward force on an object in a fluid due to the pressure difference between its lower and upper surfaces.'],['Archimedes’ principle','The upthrust on an object equals the weight of the fluid it displaces.']],
mcq:[
{q:'A uniform 2.0 m plank of weight 120 N rests on a pivot 0.50 m from one end. What downward force at that end keeps it horizontal?',o:['60 N','120 N','180 N','240 N'],a:1,e:'Weight acts 0.50 m from the pivot on the other side: F × 0.50 = 120 × 0.50 → F = 120 N.'},
{q:'A ball falls through oil at terminal velocity. Which is correct?',o:['weight = drag','weight = drag + upthrust','drag = 0','acceleration = g'],a:1,e:'In a liquid, upthrust is significant; resultant force zero means W = D + U.'},
{q:'Pressure at 12 m below a water surface due to the water alone (ρ = 1000 kg m⁻³) is',o:['1.2 × 10⁴ Pa','1.2 × 10⁵ Pa','1.0 × 10⁵ Pa','2.2 × 10⁵ Pa'],a:1,e:'p = hρg = 12 × 1000 × 9.81 = 1.18 × 10⁵ Pa.'},
{q:'Two 15 N forces form a couple, 0.40 m apart. The torque is',o:['3.0 N m','6.0 N m','12 N m','37.5 N m'],a:1,e:'Torque = F × d = 15 × 0.40 = 6.0 N m.'},
{q:'A 1500 kg car accelerates at 2.0 m s⁻² against a resistive force of 600 N. The driving force is',o:['2400 N','3000 N','3600 N','600 N'],a:2,e:'F − 600 = 1500 × 2 → F = 3600 N.'},
{q:'A block of volume 2.0 × 10⁻³ m³ is fully submerged in water. Upthrust is',o:['2.0 N','19.6 N','196 N','2.0 kN'],a:1,e:'ρVg = 1000 × 2.0 × 10⁻³ × 9.81 = 19.6 N.'}
],
exam:[
{id:'3.2-E1',marks:6,style:'Structured · terminal velocity (extended)',stem:'A skydiver jumps from a stationary balloon, falls for some time, then opens her parachute.',parts:[
{q:'Describe and explain how the velocity changes from jumping until she reaches the ground. Refer to forces.',m:6,ms:['initially only weight acts; acceleration = g','as speed increases drag increases','resultant force (and so acceleration) decreases','drag = weight: zero resultant force → terminal velocity','parachute opens: area increases so drag > weight; she decelerates','drag falls as v falls until drag = weight again at a lower terminal velocity']}]},
{id:'3.2-E2',marks:5,style:'Structured · moments',stem:'A uniform beam of length 4.0 m and weight 300 N is supported at its ends A and B. A 500 N load hangs 1.0 m from A.',parts:[
{q:'Calculate the support forces at A and B.',m:4,ms:['moments about A: R_B × 4.0 = 500 × 1.0 + 300 × 2.0','R_B = 275 N','R_A + R_B = 800 N','R_A = 525 N'],ans:'R_A = 525 N, R_B = 275 N'},
{q:'State the two conditions for the beam to be in equilibrium.',m:1,ms:['resultant force = 0 and resultant moment (about any point) = 0']}]},
{id:'3.2-E3',marks:4,style:'Structured · upthrust',stem:'A wooden block of density 650 kg m⁻³ and volume 8.0 × 10⁻⁴ m³ floats in water of density 1000 kg m⁻³.',parts:[
{q:'Calculate the fraction of the block’s volume below the surface.',m:2,ms:['weight = upthrust: ρ_wood V g = ρ_water V_sub g','V_sub/V = 650/1000 = 0.65'],ans:'0.65'},
{q:'Calculate the upthrust on the block.',m:2,ms:['upthrust = weight = 650 × 8.0 × 10⁻⁴ × 9.81','= 5.1 N'],ans:'5.1 N'}]}
]});

S.addTopic({
id:'3.3',mod:3,title:'Work, energy and power',short:'Work done, conservation of energy, kinetic and GPE, power and efficiency.',
labs:['energy'],pags:[],
spec:['Work done by a force; the unit joule','W = Fx cos θ for work done by a force','Principle of conservation of energy','Energy in different forms; transfer and conservation','Transfer of energy is equal to work done','Kinetic energy E_k = ½mv²; gravitational potential energy E_p = mgh; energy exchange between them','Power; the unit watt; P = W/t; P = Fv','Efficiency of a mechanical system'],
packs:[P('Set O 2022–24','3.3 Work, Energy and Power QP',M+'3.3-Work-Energy-Power/Set-O/3.3 Work, Energy and Power QP.pdf'),P('Set O 2022–24','3.3 Work, Energy and Power MS',M+'3.3-Work-Energy-Power/Set-O/3.3 Work, Energy and Power MS.pdf'),P('Set N 2016–21','3.3 Work Energy and Power QP',M+'3.3-Work-Energy-Power/Set-N/3.3 Work Energy and Power QP.pdf'),P('Set N 2016–21','3.3 Work Energy and Power MS',M+'3.3-Work-Energy-Power/Set-N/3.3 Work Energy and Power MS.pdf')].concat(legacy('3.3-Work-Energy-Power','Work, Energy & Power',3,'Work & Energy')),
notes:`
<h2>Work done</h2>
<p>Work is done when a force moves its point of application in the direction of the force. <strong>W = Fx cos θ</strong>, where θ is the angle between the force and the displacement. 1 J is the work done when a 1 N force moves its point of application 1 m in the direction of the force.</p>
<h2>Energy</h2>
<p><strong>Principle of conservation of energy</strong>: energy cannot be created or destroyed; it can only be transferred from one form to another. The total energy of a closed system remains constant. Work done = energy transferred.</p>
<ul><li>Kinetic energy: <strong>E<sub>k</sub> = ½mv²</strong> (derived from W = Fs and v² = 2as).</li><li>Gravitational potential energy change: <strong>ΔE<sub>p</sub> = mgΔh</strong> (near Earth's surface).</li><li>Falling with no air resistance: mgh = ½mv² so v = √(2gh), independent of mass.</li></ul>
<h2>Power and efficiency</h2>
<p><strong>Power</strong> is the rate of doing work or transferring energy: P = W/t, unit the watt (1 W = 1 J s<sup>−1</sup>). For a force moving at constant velocity, <strong>P = Fv</strong>.</p>
<p><strong>Efficiency</strong> = useful output energy ÷ total input energy × 100% (also with power).</p>
<svg class="diagram" viewBox="0 0 520 160" role="img" aria-label="Sankey-style energy flow: input splits into useful and wasted">
<path class="fillsoft ax" d="M20 40 H300 C360 40 360 30 420 30 H500 V90 H420 C360 90 360 70 300 70 V120 C330 120 340 150 360 150 H330 C320 140 300 120 280 110 H20 Z"/>
<text x="40" y="70">Input 100 J</text><text x="425" y="65">Useful 70 J</text><text x="260" y="150" class="small">Wasted 30 J (heat, sound)</text></svg>`,
eqs:[['W = Fx cos θ','Work done'],['E<sub>k</sub> = ½mv²','Kinetic energy'],['E<sub>p</sub> = mgh','Gravitational potential energy'],['P = W/t','Power'],['P = Fv','Power at constant velocity'],['efficiency = useful output / total input × 100%','Efficiency']],
terms:[['Work done','Force × displacement in the direction of the force.'],['Joule','The work done when a force of 1 N moves its point of application 1 m in the direction of the force.'],['Principle of conservation of energy','Energy cannot be created or destroyed, only transferred from one form to another; the total energy of a closed system is constant.'],['Power','The rate of doing work or rate of energy transfer.'],['Watt','A rate of energy transfer of 1 J s⁻¹.'],['Efficiency','Useful output energy (or power) ÷ total input energy (or power).'],['Kinetic energy','Energy of an object due to its motion, ½mv².']],
mcq:[
{q:'A 25 N force pulls a box 4.0 m along the floor. The force is at 60° to the floor. Work done by the force is',o:['50 J','87 J','100 J','25 J'],a:0,e:'W = 25 × 4.0 × cos 60° = 50 J.'},
{q:'A car of mass 900 kg moves at 20 m s⁻¹ against total resistive forces of 450 N. The power output of the engine is',o:['9.0 kW','18 kW','180 kW','4.5 kW'],a:0,e:'Constant velocity → driving force = 450 N. P = Fv = 450 × 20 = 9000 W.'},
{q:'A ball is dropped from 5.0 m. Ignoring air resistance, its speed just before landing is',o:['7.0 m s⁻¹','9.9 m s⁻¹','49 m s⁻¹','98 m s⁻¹'],a:1,e:'v = √(2 × 9.81 × 5.0) = 9.9 m s⁻¹.'},
{q:'The speed of a moving object triples. Its kinetic energy is multiplied by',o:['3','6','9','27'],a:2,e:'E_k ∝ v².'},
{q:'A motor lifts 50 kg through 6.0 m in 12 s. The input power is 400 W. Efficiency is',o:['49%','61%','75%','25%'],a:1,e:'Useful power = 50 × 9.81 × 6 / 12 = 245 W; 245/400 = 61%.'}
],
exam:[
{id:'3.3-E1',marks:7,style:'Structured · energy on a slope',stem:'A sledge of mass 40 kg starts from rest at the top of a 30 m long slope inclined at 20° to the horizontal. The average frictional force on the sledge is 60 N.',parts:[
{q:'Calculate the loss in gravitational potential energy as it reaches the bottom.',m:2,ms:['h = 30 sin 20° = 10.3 m','ΔE_p = 40 × 9.81 × 10.3 = 4.03 × 10³ J'],ans:'4.0 × 10³ J'},
{q:'Calculate the work done against friction.',m:1,ms:['W = 60 × 30 = 1800 J']},
{q:'Calculate the speed of the sledge at the bottom.',m:3,ms:['E_k = 4030 − 1800 = 2230 J','½ × 40 × v² = 2230','v = 10.6 m s⁻¹'],ans:'11 m s⁻¹'},
{q:'State the principle of conservation of energy.',m:1,ms:['energy cannot be created or destroyed; total energy of a closed system is constant']}]},
{id:'3.3-E2',marks:3,style:'Structured · power',stem:'Show that the power of a force F moving an object at constant velocity v is P = Fv.',parts:[{q:'Derive P = Fv.',m:3,ms:['P = W/t','W = Fx so P = Fx/t','x/t = v so P = Fv']}]}
]});

S.addTopic({
id:'3.4',mod:3,title:'Materials',short:'Hooke’s law, springs, elastic PE, stress, strain and Young modulus.',
labs:['springs','tensile'],pags:['p2-1','p2-2'],
spec:['Tensile and compressive deformation; extension and compression','Hooke’s law; force constant k of a spring or wire; F = kx','Force–extension (or compression) graphs for springs and wires; techniques to investigate them','Force–extension graphs; work done is area under the graph; elastic potential energy E = ½Fx = ½kx²','Stress, strain and ultimate tensile strength','Young modulus = tensile stress / tensile strain, E = σ/ε; techniques to determine the Young modulus of a metal (PAG2)','Stress–strain graphs for typical ductile, brittle and polymeric materials; elastic and plastic deformation of materials','Springs in series and parallel'],
packs:pk('3.4-Materials','3.4 Materials').concat([P('Set M (legacy)','Materials 1 QP',M+'3.4-Materials/Set-M/Materials 1 QP.pdf'),P('Set M (legacy)','Materials 1 MS',M+'3.4-Materials/Set-M/Materials 1 MS.pdf'),P('Set M (legacy)','Materials 2 QP',M+'3.4-Materials/Set-M/Materials 2  QP.pdf'),P('Set M (legacy)','Materials 2 MS',M+'3.4-Materials/Set-M/Materials 2 MS.pdf'),P('Set M (legacy)','Materials 3 QP',M+'3.4-Materials/Set-M/Materials 3 QP.pdf'),P('Set M (legacy)','Materials 3 MS',M+'3.4-Materials/Set-M/Materials 3 MS.pdf')]),
notes:`
<h2>Hooke's law</h2>
<p>The extension of a spring is directly proportional to the applied force, provided the <strong>limit of proportionality</strong> is not exceeded: <strong>F = kx</strong>. k is the force constant (stiffness), in N m<sup>−1</sup>.</p>
<ul><li>Springs in <strong>series</strong>: 1/k<sub>total</sub> = 1/k<sub>1</sub> + 1/k<sub>2</sub> (each spring takes the full force).</li><li>Springs in <strong>parallel</strong>: k<sub>total</sub> = k<sub>1</sub> + k<sub>2</sub> (the force is shared).</li></ul>
<h2>Elastic potential energy</h2>
<p>Work done stretching = area under the force–extension graph. Within the Hooke's law region <strong>E = ½Fx = ½kx²</strong>. On unloading a rubber band, the unloading curve lies below the loading curve; the area between them (hysteresis loop) is energy transferred to heat.</p>
<h2>Elastic and plastic deformation</h2>
<p><strong>Elastic</strong> deformation: the material returns to its original shape when the force is removed. <strong>Plastic</strong> deformation: permanent extension remains after the force is removed. The <strong>elastic limit</strong> marks the change.</p>
<h2>Stress, strain, Young modulus</h2>
<p><strong>Tensile stress</strong> σ = F/A (Pa). <strong>Tensile strain</strong> ε = x/L (no units). <strong>Young modulus</strong> E = σ/ε (Pa), the gradient of the linear part of a stress–strain graph. <strong>Ultimate tensile strength</strong>: the maximum stress a material can withstand before breaking.</p>
<svg class="diagram" viewBox="0 0 540 240" role="img" aria-label="Stress-strain graphs for ductile, brittle and polymeric materials">
<line class="ax" x1="40" y1="210" x2="520" y2="210" marker-end="url(#ah)"/><line class="ax" x1="40" y1="210" x2="40" y2="20" marker-end="url(#ah)"/>
<text x="20" y="30">σ</text><text x="505" y="230">ε</text>
<path class="c1" d="M40 210 L95 80 C110 70 120 72 140 70 C220 55 300 50 380 62 L392 85"/><text x="300" y="44" class="lbl1">ductile (copper)</text><circle cx="392" cy="85" r="3" class="dotb"/>
<path class="c2" d="M40 210 L110 40"/><circle cx="110" cy="40" r="3" class="dota"/><text x="118" y="36" class="lbl2">brittle (glass, cast iron)</text>
<path class="c3" d="M40 210 C120 195 200 185 260 175 C330 160 400 120 470 105"/><text x="400" y="140" class="lbl3">polymer (rubber)</text>
<text x="96" y="100" class="small">P</text><text x="140" y="88" class="small">Y</text></svg>
<p>P = limit of proportionality, Y = yield point. Ductile materials can be drawn into wires (large plastic region). Brittle materials fracture with little or no plastic deformation.</p>
<h2>Determining the Young modulus (PAG 2.1)</h2>
<p>A long thin wire (≈ 2 m) clamped at one end runs over a pulley with masses hung from it. Measure the diameter in several places with a micrometer; measure extension using a marker against a mm scale (or a vernier on a Searle's apparatus). Plot stress against strain; gradient = E. A long wire gives a larger, more measurable extension.</p>`,
eqs:[['F = kx','Hooke’s law'],['E = ½Fx = ½kx²','Elastic potential energy'],['σ = F/A','Tensile stress'],['ε = x/L','Tensile strain'],['E = σ/ε','Young modulus'],['1/k = 1/k₁ + 1/k₂ (series); k = k₁ + k₂ (parallel)','Spring combinations']],
terms:[['Hooke’s law','Extension is directly proportional to force applied, provided the limit of proportionality is not exceeded.'],['Force constant','Force per unit extension, k = F/x.'],['Limit of proportionality','The point beyond which extension is no longer proportional to force.'],['Elastic limit','The maximum force (or stress) a material can take and still return to its original shape.'],['Elastic deformation','Deformation where the object returns to its original shape when the force is removed.'],['Plastic deformation','Permanent deformation: the object does not return to its original shape.'],['Tensile stress','Force per unit cross-sectional area.'],['Tensile strain','Extension per unit original length.'],['Young modulus','Tensile stress ÷ tensile strain (in the linear region).'],['Ultimate tensile strength','The maximum stress a material can withstand before it breaks.'],['Ductile','Can be drawn into wires; undergoes large plastic deformation.'],['Brittle','Breaks with little or no plastic deformation.']],
mcq:[
{q:'A spring of k = 40 N m⁻¹ is stretched by 5.0 cm. Elastic potential energy stored is',o:['0.05 J','0.10 J','1.0 J','2.0 J'],a:0,e:'½ × 40 × 0.050² = 0.050 J.'},
{q:'Two identical springs, each k, are connected in series. The combined force constant is',o:['k/2','k','2k','4k'],a:0,e:'1/k_t = 2/k.'},
{q:'A steel wire, length 2.0 m, area 2.0 × 10⁻⁷ m², stretches by 1.0 mm under 20 N. Its Young modulus is',o:['1.0 × 10¹¹ Pa','2.0 × 10¹¹ Pa','1.0 × 10⁸ Pa','2.0 × 10⁸ Pa'],a:1,e:'σ = 1.0 × 10⁸ Pa; ε = 5.0 × 10⁻⁴; E = 2.0 × 10¹¹ Pa.'},
{q:'The area between loading and unloading curves for rubber represents',o:['elastic PE stored','energy dissipated as heat','Young modulus','work done by gravity'],a:1,e:'Hysteresis: energy transferred to thermal energy in one cycle.'},
{q:'Which material shows a large plastic region?',o:['glass','cast iron','copper','concrete'],a:2,e:'Copper is ductile.'}
],
exam:[
{id:'3.4-E1',marks:7,style:'Structured · Young modulus',stem:'A copper wire of length 2.50 m and diameter 0.46 mm supports a load of 40 N. The extension is 3.8 mm.',parts:[
{q:'Calculate the stress in the wire.',m:2,ms:['A = π(0.23 × 10⁻³)² = 1.66 × 10⁻⁷ m²','σ = 40 / 1.66 × 10⁻⁷ = 2.4 × 10⁸ Pa'],ans:'2.4 × 10⁸ Pa'},
{q:'Calculate the Young modulus of copper.',m:2,ms:['ε = 3.8 × 10⁻³ / 2.50 = 1.52 × 10⁻³','E = 2.4 × 10⁸ / 1.52 × 10⁻³ = 1.6 × 10¹¹ Pa'],ans:'1.6 × 10¹¹ Pa'},
{q:'Describe how the student should measure the diameter and why a long wire is used.',m:3,ms:['use a micrometer screw gauge','measure at several points along the wire and in perpendicular directions; take the mean','long wire gives larger extension so smaller percentage uncertainty in x']}]},
{id:'3.4-E2',marks:3,style:'Structured · springs',stem:'Two springs of force constants 30 N m⁻¹ and 60 N m⁻¹ are connected.',parts:[
{q:'Calculate the extension when a 6.0 N load hangs from them in series.',m:2,ms:['1/k = 1/30 + 1/60 → k = 20 N m⁻¹','x = 6.0/20 = 0.30 m'],ans:'0.30 m'},
{q:'Calculate the extension when they share the load in parallel.',m:1,ms:['k = 90 N m⁻¹; x = 6.0/90 = 0.067 m']}]}
]});

S.addTopic({
id:'3.5',mod:3,title:'Newton’s laws and momentum',short:'Newton’s three laws, impulse, conservation of momentum, collisions in 1D and 2D.',
labs:['collide1d','collide2d'],pags:[],
spec:['Newton’s three laws of motion','Linear momentum p = mv; vector nature of momentum','Net force = rate of change of momentum, F = Δp/Δt','Impulse of a force; impulse = FΔt','Impulse is equal to the area under a force–time graph','The principle of conservation of momentum','Collisions and interaction of bodies in one dimension and in two dimensions','Perfectly elastic collision and inelastic collision'],
packs:[P('Set O 2022–24',"3.5 Newton's Laws & Momentum QP",M+"3.5-Momentum/Set-O/3.5 Newton's Laws of Motion and Momentum QP.pdf"),P('Set O 2022–24',"3.5 Newton's Laws & Momentum MS",M+"3.5-Momentum/Set-O/3.5 Newton's Laws of Motion and Momentum MS.pdf"),P('Set N 2016–21',"3.5 Newton's Laws & Momentum QP",M+"3.5-Momentum/Set-N/3.5 Newton's Laws of Motion and Momentum QP.pdf"),P('Set N 2016–21',"3.5 Newton's Laws & Momentum MS",M+"3.5-Momentum/Set-N/3.5 Newton's Laws of Motion and Momentum MS.pdf")].concat(legacy('3.5-Momentum',"Newton's Laws of Motion and Momentum",3)),
notes:`
<h2>Newton's laws</h2>
<ol><li><strong>First law</strong>: an object remains at rest or moves with constant velocity unless acted on by a resultant force.</li><li><strong>Second law</strong>: the resultant force is directly proportional to the rate of change of momentum, and in the same direction: F = Δp/Δt. For constant mass this gives F = ma.</li><li><strong>Third law</strong>: when body A exerts a force on body B, body B exerts an equal and opposite force on body A. The pair are the same type of force and act on <em>different</em> bodies.</li></ol>
<blockquote class="tip"><p>Weight and the normal contact force on a book on a table are <strong>not</strong> a Newton III pair: they act on the same object and are different types. The pair to the book's weight is the book's gravitational pull on the Earth.</p></blockquote>
<h2>Momentum and impulse</h2>
<p><strong>Momentum</strong> p = mv (kg m s<sup>−1</sup>), a vector. <strong>Impulse</strong> = FΔt = Δp (N s). The area under a force–time graph equals the impulse, and so the change in momentum.</p>
<svg class="diagram" viewBox="0 0 520 190" role="img" aria-label="Force-time graph; area equals impulse; longer contact time gives smaller peak force">
<line class="ax" x1="40" y1="160" x2="500" y2="160" marker-end="url(#ah)"/><line class="ax" x1="40" y1="160" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="fillsoft c1" d="M60 160 C90 160 100 40 130 40 C160 40 170 160 200 160 Z"/>
<path class="c2" d="M240 160 C300 160 320 110 370 110 C420 110 440 160 480 160"/>
<text x="20" y="30">F</text><text x="490" y="180">t</text><text x="90" y="125" class="small">area = impulse</text><text x="300" y="100" class="lbl2 small">same Δp, longer Δt (crumple zone)</text></svg>
<p>Safety features (crumple zones, airbags, seat belts, helmets) <strong>increase the collision time</strong> so, for the same change in momentum, the force is smaller.</p>
<h2>Conservation of momentum</h2>
<p>For a closed system (no external forces), the <strong>total momentum before an interaction equals the total momentum after</strong>. In 2D, momentum is conserved separately in each perpendicular direction: resolve, conserve in x, conserve in y, then recombine.</p>
<div class="tbl"><table><tr><th>Collision</th><th>Momentum</th><th>Kinetic energy</th></tr><tr><td>Perfectly elastic</td><td>conserved</td><td>conserved; relative speed of approach = relative speed of separation</td></tr><tr><td>Inelastic</td><td>conserved</td><td>not conserved (some transferred to heat, sound, deformation)</td></tr><tr><td>Explosion</td><td>conserved (total zero if initially at rest)</td><td>increases (from chemical/elastic energy)</td></tr></table></div>`,
eqs:[['p = mv','Momentum'],['F = Δp/Δt','Newton’s second law (general form)'],['impulse = FΔt = Δp','Impulse'],['m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂','Conservation of momentum (1D)']],
terms:[['Newton’s first law','An object remains at rest or moves with constant velocity unless acted on by a resultant force.'],['Newton’s second law','Resultant force is proportional to the rate of change of momentum and acts in the same direction.'],['Newton’s third law','If body A exerts a force on body B, then B exerts an equal and opposite force on A.'],['Momentum','Mass × velocity; a vector.'],['Impulse','Force × time for which it acts; equals change in momentum.'],['Principle of conservation of momentum','For a closed system, total momentum before = total momentum after an interaction.'],['Perfectly elastic collision','Collision in which momentum and kinetic energy are both conserved.'],['Inelastic collision','Collision in which momentum is conserved but kinetic energy is not.'],['Closed system','A system on which no external resultant force acts.']],
mcq:[
{q:'A 0.15 kg ball hits a wall at 20 m s⁻¹ and rebounds at 15 m s⁻¹. Contact time 0.050 s. The mean force is',o:['15 N','60 N','105 N','35 N'],a:2,e:'Δp = 0.15 × (15 − (−20)) = 5.25 N s; F = 5.25/0.050 = 105 N.'},
{q:'Trolley A (2.0 kg, 3.0 m s⁻¹) hits stationary B (1.0 kg) and they stick. Their common velocity is',o:['1.0 m s⁻¹','1.5 m s⁻¹','2.0 m s⁻¹','3.0 m s⁻¹'],a:2,e:'6.0 = 3.0 v → v = 2.0 m s⁻¹.'},
{q:'In the collision above, the kinetic energy lost is',o:['0','3.0 J','6.0 J','9.0 J'],a:1,e:'Before: 9.0 J. After: ½ × 3 × 4 = 6.0 J. Lost: 3.0 J.'},
{q:'The area under a force–time graph is 12 N s for a 3.0 kg object initially at rest. Its final speed is',o:['0.25 m s⁻¹','4.0 m s⁻¹','36 m s⁻¹','12 m s⁻¹'],a:1,e:'Δp = 12 = 3.0 v → v = 4.0 m s⁻¹.'},
{q:'Which pair is a Newton’s third-law pair?',o:['Weight of a book and normal reaction on the book','Earth pulls Moon; Moon pulls Earth','Thrust and drag on a plane at constant speed','Tension and weight on a hanging mass'],a:1,e:'Same type of force (gravity), acting on different bodies.'},
{q:'A 60 kg skater at rest pushes a 40 kg skater, who moves off at 1.5 m s⁻¹. The 60 kg skater moves at',o:['1.0 m s⁻¹ opposite','1.5 m s⁻¹ opposite','2.25 m s⁻¹ opposite','0'],a:0,e:'Total momentum 0: 60 v = 40 × 1.5 → v = 1.0 m s⁻¹ in the opposite direction.'}
],
exam:[
{id:'3.5-E1',marks:7,style:'Structured · 2D collision',stem:'A puck A of mass 0.20 kg moving at 3.0 m s⁻¹ strikes a stationary puck B of mass 0.20 kg on a frictionless air table. After the collision A moves at 1.5 m s⁻¹ at 60° to its original direction.',parts:[
{q:'Calculate the components of A’s momentum after the collision, parallel and perpendicular to its original direction.',m:2,ms:['parallel: 0.20 × 1.5 cos 60° = 0.15 N s','perpendicular: 0.20 × 1.5 sin 60° = 0.26 N s']},
{q:'Determine the velocity of B after the collision.',m:3,ms:['parallel: 0.60 = 0.15 + p_Bx → p_Bx = 0.45 N s','perpendicular: p_By = 0.26 N s (opposite side)','p_B = 0.52 N s so v_B = 2.6 m s⁻¹ at 30° to A’s original direction'],ans:'2.6 m s⁻¹ at 30° (other side)'},
{q:'Show whether the collision is elastic.',m:2,ms:['KE before = ½ × 0.20 × 9 = 0.90 J','KE after = ½(0.20)(1.5²) + ½(0.20)(2.6²) = 0.225 + 0.675 = 0.90 J → elastic']}]},
{id:'3.5-E2',marks:5,style:'Structured · impulse',stem:'A 70 kg person jumps from a wall and lands with a speed of 6.0 m s⁻¹.',parts:[
{q:'Calculate the impulse needed to stop the person.',m:1,ms:['Δp = 70 × 6.0 = 420 N s']},
{q:'Explain, using Newton’s second law, why bending the knees on landing reduces the risk of injury. Calculate the mean force if the stopping time is 0.40 s.',m:4,ms:['F = Δp/Δt','bending knees increases the stopping time','for the same change in momentum the force is smaller','F = 420/0.40 = 1050 N (stopping force; total from ground ≈ 1050 + 687 = 1.7 kN)']}]}
]});
})();
