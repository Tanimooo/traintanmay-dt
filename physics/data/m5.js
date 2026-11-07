/* Module 5: Newtonian world and astrophysics */
(function(){
const S=window.SPEC, P=S.pack, M='5-Newtonian-World-and-Astrophysics/';
const two=(sub,name)=>[P('Set O 2022–24',name+' QP',M+sub+'/Set-O/'+name+' QP.pdf'),P('Set O 2022–24',name+' MS',M+sub+'/Set-O/'+name+' MS.pdf'),P('Set N 2016–21',name+' QP',M+sub+'/Set-N/'+name+' QP.pdf'),P('Set N 2016–21',name+' MS',M+sub+'/Set-N/'+name+' MS.pdf')];
const seq=(sub,base,n)=>{const a=[];for(let i=1;i<=n;i++)a.push(P('Set M (legacy G484)',base+' '+i+' QP',M+sub+'/Set-M/'+base+' '+i+' QP.pdf'),P('Set M (legacy G484)',base+' '+i+' MS',M+sub+'/Set-M/'+base+' '+i+' MS.pdf'));return a;};

S.addTopic({
id:'5.1',mod:5,title:'Thermal physics',short:'Temperature, internal energy, specific heat and latent heat, ideal gases, kinetic theory.',
labs:['gas','heating'],pags:['p8-1','p8-2','p11-2'],
spec:['Thermal equilibrium; absolute scale of temperature (thermodynamic scale) that does not depend on any property of a substance; T(K) = θ(°C) + 273','Solid, liquid and gas in terms of spacing, ordering and motion of atoms or molecules; simple kinetic model; Brownian motion','Internal energy as the sum of the random distribution of kinetic and potential energies of molecules','Absolute zero; effect of change of state and temperature on internal energy','Specific heat capacity E = mcΔθ; techniques to measure it (electrical method, method of mixtures)','Specific latent heat of fusion and vaporisation E = mL; techniques to measure it','Amount of substance in moles; Avogadro constant','Model of kinetic theory of gases; assumptions; pressure in terms of molecular momentum change','Equation of state pV = nRT; techniques for Boyle’s law and estimating absolute zero (PAG8)','pV = ⅓Nm⟨c²⟩; root mean square speed; mean square speed','Boltzmann constant k = R/N_A; pV = NkT; ½m⟨c²⟩ = 3/2 kT','Internal energy of an ideal gas'],
packs:two('5.1-Thermal-Physics','5.1 Thermal Physics').concat(seq('5.1-Thermal-Physics','Thermal Physics',6)),
notes:`
<h2>Temperature</h2>
<p>Two objects are in <strong>thermal equilibrium</strong> when there is no net flow of thermal energy between them; they are at the same temperature. The <strong>thermodynamic (absolute) scale</strong> does not depend on any property of a particular substance. <strong>T/K = θ/°C + 273</strong>. <strong>Absolute zero</strong> (0 K) is the lowest possible temperature, where substances have minimum internal energy.</p>
<h2>Kinetic model of matter</h2>
<div class="tbl"><table><tr><th></th><th>Solid</th><th>Liquid</th><th>Gas</th></tr><tr><td>Spacing</td><td>close, regular lattice</td><td>close, irregular</td><td>far apart (≈ 10× diameter)</td></tr><tr><td>Motion</td><td>vibrate about fixed positions</td><td>move randomly, sliding past each other</td><td>fast, random, straight lines between collisions</td></tr><tr><td>Forces</td><td>strong</td><td>weaker</td><td>negligible except in collisions</td></tr></table></div>
<p><strong>Brownian motion</strong>: smoke particles viewed in air move randomly because of collisions with fast, randomly moving air molecules; evidence for the kinetic model.</p>
<h2>Internal energy</h2>
<p>The <strong>internal energy</strong> of a substance is the sum of the randomly distributed kinetic and potential energies of its molecules. Heating increases internal energy. During a change of state the temperature stays constant: the kinetic energy is unchanged but the <strong>potential energy increases</strong> as bonds are broken.</p>
<svg class="diagram" viewBox="0 0 520 210" role="img" aria-label="Heating curve: temperature rises, flat at melting, rises, flat at boiling">
<line class="ax" x1="40" y1="190" x2="500" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 175 L100 140 L190 140 L250 80 L400 80 L470 30"/>
<text x="115" y="132" class="small">melting (KE same, PE ↑)</text><text x="275" y="72" class="small">boiling</text><text x="20" y="28" class="small">θ</text><text x="440" y="208" class="small">time (constant power)</text></svg>
<h2>Specific heat capacity and latent heat</h2>
<p><strong>Specific heat capacity</strong> c: energy needed to raise the temperature of 1 kg of a substance by 1 K. <strong>E = mcΔθ</strong>. Electrical method (PAG 11.2): heater in an insulated block, E = VIt, plot θ against t, c = VI/(m × gradient). Heat losses make c appear too large.</p>
<p><strong>Specific latent heat</strong> L: energy needed to change the state of 1 kg of a substance without changing its temperature. <strong>E = mL</strong>; L<sub>f</sub> for fusion (melting), L<sub>v</sub> for vaporisation. L<sub>v</sub> > L<sub>f</sub> because boiling involves breaking all bonds and doing work against the atmosphere as the volume increases a lot.</p>
<h2>Ideal gases</h2>
<p>One <strong>mole</strong> contains N<sub>A</sub> = 6.02 × 10<sup>23</sup> particles. N = nN<sub>A</sub>.</p>
<p><strong>Kinetic theory assumptions</strong>: large number of molecules in random motion; molecules have negligible volume compared to the container; collisions are perfectly elastic; collision time is negligible compared to time between collisions; no forces between molecules except during collisions (so internal energy is entirely kinetic); Newton's laws apply.</p>
<p>Pressure: each molecule changes momentum by 2mu on hitting a wall; force = rate of change of momentum; many molecules give a steady pressure. Result: <strong>pV = ⅓Nm⟨c²⟩</strong>.</p>
<p><strong>Gas laws</strong>: Boyle's law pV = constant (constant T and n); p/T = constant; V/T = constant. Combined: <strong>pV = nRT = NkT</strong>, with T in kelvin.</p>
<svg class="diagram" viewBox="0 0 560 190" role="img" aria-label="Pressure against volume (isotherms) and pressure against temperature extrapolating to absolute zero">
<g><line class="ax" x1="30" y1="170" x2="250" y2="170" marker-end="url(#ah)"/><line class="ax" x1="30" y1="170" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" d="M50 30 C70 120 120 150 240 158"/><path class="c2" d="M70 30 C90 110 150 135 240 142"/><text x="160" y="125" class="small lbl2">higher T</text><text x="236" y="184" class="small">V</text><text x="36" y="24" class="small">p</text></g>
<g transform="translate(290 0)"><line class="ax" x1="10" y1="170" x2="260" y2="170" marker-end="url(#ah)"/><line class="ax" x1="150" y1="170" x2="150" y2="20" marker-end="url(#ah)"/><line class="c1" x1="150" y1="120" x2="250" y2="60"/><line class="c1 dash" x1="67" y1="170" x2="150" y2="120"/><text x="40" y="186" class="small">−273 °C</text><text x="240" y="186" class="small">θ/°C</text><text x="156" y="24" class="small">p</text></g></svg>
<h2>Molecular kinetic energy</h2>
<p>Combining pV = ⅓Nm⟨c²⟩ with pV = NkT gives <strong>½m⟨c²⟩ = 3/2 kT</strong>: the mean kinetic energy of a molecule is proportional to absolute temperature. k = R/N<sub>A</sub> = 1.38 × 10<sup>−23</sup> J K<sup>−1</sup>. The <strong>r.m.s. speed</strong> c<sub>rms</sub> = √⟨c²⟩ = √(3kT/m). Internal energy of an ideal gas = N × 3/2 kT (all kinetic).</p>
<p>The molecules have a <strong>Maxwell–Boltzmann distribution</strong> of speeds; at higher temperature the peak moves to higher speed and the curve flattens.</p>`,
eqs:[['T/K = θ/°C + 273','Absolute temperature'],['E = mcΔθ','Specific heat capacity'],['E = mL','Specific latent heat'],['pV = nRT','Ideal gas equation'],['pV = NkT','Ideal gas (molecules)'],['pV = ⅓Nm⟨c²⟩','Kinetic theory'],['½m⟨c²⟩ = 3/2 kT','Mean KE of a molecule'],['k = R/N<sub>A</sub>','Boltzmann constant'],['c<sub>rms</sub> = √(3kT/m)','r.m.s. speed']],
terms:[['Thermal equilibrium','A state in which there is no net flow of thermal energy between objects; they are at the same temperature.'],['Absolute zero','The lowest possible temperature, 0 K, where a substance has minimum internal energy.'],['Internal energy','The sum of the randomly distributed kinetic and potential energies of the atoms or molecules in a substance.'],['Specific heat capacity','Energy required per unit mass to raise the temperature by 1 K (or 1 °C).'],['Specific latent heat of fusion','Energy required to change 1 kg of solid to liquid with no change in temperature.'],['Specific latent heat of vaporisation','Energy required to change 1 kg of liquid to gas with no change in temperature.'],['Mole','The amount of substance containing 6.02 × 10²³ particles.'],['Avogadro constant','The number of particles in one mole, 6.02 × 10²³ mol⁻¹.'],['Ideal gas','A gas that obeys pV = nRT exactly; its molecules have negligible volume and no intermolecular forces.'],['Brownian motion','Random motion of small particles caused by collisions with fast-moving molecules of a fluid.'],['Root mean square speed','The square root of the mean of the squares of molecular speeds.'],['Boltzmann constant','k = R/N_A, the gas constant per molecule.']],
mcq:[
{q:'How much energy is needed to heat 0.50 kg of water (c = 4200 J kg⁻¹ K⁻¹) from 20 °C to 100 °C?',o:['42 kJ','168 kJ','210 kJ','84 kJ'],a:1,e:'0.50 × 4200 × 80 = 168 000 J.'},
{q:'A gas at 27 °C is heated to 327 °C at constant volume. Its pressure',o:['doubles','increases by 12×','halves','is unchanged'],a:0,e:'T goes 300 K → 600 K; p ∝ T.'},
{q:'Mean KE of a gas molecule at 300 K is',o:['6.2 × 10⁻²¹ J','4.1 × 10⁻²¹ J','3.7 × 10³ J','1.4 × 10⁻²³ J'],a:0,e:'3/2 × 1.38 × 10⁻²³ × 300 = 6.2 × 10⁻²¹ J.'},
{q:'The absolute temperature of a gas is doubled. The r.m.s. speed is multiplied by',o:['√2','2','4','1/√2'],a:0,e:'c_rms ∝ √T.'},
{q:'During melting, the internal energy of ice',o:['stays the same','increases (PE increases)','increases (KE increases)','decreases'],a:1,e:'Temperature constant, so KE unchanged; PE rises as bonds break.'},
{q:'How many moles are in 2.0 × 10⁻³ m³ of gas at 1.0 × 10⁵ Pa and 300 K?',o:['0.080','0.80','8.0','0.0080'],a:0,e:'n = pV/RT = 200/(8.31 × 300) = 0.080.'}
],
exam:[
{id:'5.1-E1',marks:7,style:'Structured · ideal gas',stem:'A cylinder of volume 0.050 m³ contains helium at 2.0 × 10⁵ Pa and 290 K. Mass of a helium atom = 6.6 × 10⁻²⁷ kg.',parts:[
{q:'Calculate the number of atoms in the cylinder.',m:2,ms:['N = pV/kT = 2.0 × 10⁵ × 0.050 / (1.38 × 10⁻²³ × 290)','= 2.5 × 10²⁴'],ans:'2.5 × 10²⁴'},
{q:'Calculate the r.m.s. speed of the atoms.',m:2,ms:['c_rms = √(3kT/m) = √(3 × 1.38 × 10⁻²³ × 290 / 6.6 × 10⁻²⁷)','= 1.3 × 10³ m s⁻¹'],ans:'1.3 × 10³ m s⁻¹'},
{q:'Using the kinetic model, explain why the pressure increases when the temperature increases at constant volume.',m:3,ms:['molecules have higher mean KE / speed','greater change in momentum per collision with the walls','more frequent collisions; greater rate of change of momentum so greater force and pressure']}]},
{id:'5.1-E2',marks:5,style:'Structured · specific heat (practical)',stem:'A 1.0 kg aluminium block is heated by a 12 V heater carrying 4.0 A. The temperature rises from 18.0 °C to 30.5 °C in 4.0 minutes.',parts:[
{q:'Calculate the specific heat capacity of aluminium.',m:3,ms:['E = VIt = 12 × 4.0 × 240 = 11 520 J','c = E/(mΔθ) = 11 520/(1.0 × 12.5)','= 920 J kg⁻¹ K⁻¹'],ans:'920 J kg⁻¹ K⁻¹'},
{q:'Explain whether heat loss makes the result an over- or underestimate, and suggest an improvement.',m:2,ms:['some energy is lost to surroundings so measured Δθ is smaller: c is overestimated','insulate the block / use oil in the thermometer hole / start below room temperature and finish the same amount above']}]}
]});

S.addTopic({
id:'5.2',mod:5,title:'Circular motion',short:'Radians, angular velocity, centripetal acceleration and force.',
labs:['circular'],pags:[],
spec:['The radian; angle in radians; 2π rad = 360°','Period and frequency of an object in circular motion; angular velocity ω = 2π/T = 2πf','A constant net force perpendicular to the velocity causes centripetal acceleration','Centripetal acceleration a = v²/r = ω²r','Centripetal force F = mv²/r = mω²r; techniques to investigate circular motion'],
packs:two('5.2-Circular-Motion','5.2 Circular Motion').concat(seq('5.2-Circular-Motion','Circular Motion',2)),
notes:`
<h2>Radians and angular velocity</h2>
<p>One <strong>radian</strong> is the angle subtended at the centre of a circle by an arc equal in length to the radius. 2π rad = 360°. Arc length s = rθ.</p>
<p><strong>Angular velocity</strong> ω is the rate of change of angle: <strong>ω = 2π/T = 2πf</strong> (rad s<sup>−1</sup>). Linear speed <strong>v = ωr</strong>.</p>
<h2>Centripetal acceleration</h2>
<svg class="diagram" viewBox="0 0 480 240" role="img" aria-label="Object moving in a circle; velocity tangent, acceleration and force towards centre">
<circle cx="200" cy="120" r="90" class="ax dash"/><circle cx="200" cy="120" r="4" class="dot"/>
<circle cx="264" cy="56" r="10" class="fill2 ax"/>
<line class="c1 thick" x1="264" y1="56" x2="324" y2="116" marker-end="url(#ahb)"/><text x="320" y="110" class="lbl1">v (tangent)</text>
<line class="c2 thick" x1="264" y1="56" x2="221" y2="99" marker-end="url(#aha)"/><text x="160" y="80" class="lbl2">a, F</text>
<line class="ax" x1="200" y1="120" x2="264" y2="56"/><text x="236" y="100" class="small">r</text></svg>
<p>An object moving in a circle at constant speed is <strong>accelerating</strong> because its direction, and therefore its velocity, is constantly changing. The acceleration is towards the centre: <strong>a = v²/r = ω²r</strong>.</p>
<h2>Centripetal force</h2>
<p>By Newton II there must be a resultant force towards the centre: <strong>F = mv²/r = mω²r</strong>. It is always perpendicular to the velocity, so it does no work and the speed does not change. It is not a new force: it is provided by tension, friction, gravity, normal contact force, etc.</p>
<ul><li>Car on a bend: friction between tyres and road.</li><li>Satellite: gravitational force.</li><li>Vertical circle on a string: T + mg = mv²/r at the top, T − mg = mv²/r at the bottom (tension is greatest at the bottom).</li><li>Minimum speed at the top of a vertical loop: mg = mv²/r, so v = √(gr).</li><li>Banked track / conical pendulum: the horizontal component of the normal force or tension provides the centripetal force: tan θ = v²/(rg).</li></ul>
<p>Investigate with a whirling bung on a string through a tube with hanging masses providing the tension: Mg = mω²r.</p>`,
eqs:[['ω = 2π/T = 2πf','Angular velocity'],['v = ωr','Linear and angular speed'],['a = v²/r = ω²r','Centripetal acceleration'],['F = mv²/r = mω²r','Centripetal force']],
terms:[['Radian','The angle subtended at the centre of a circle by an arc equal in length to the radius.'],['Angular velocity','The rate of change of angle swept out by the radius.'],['Centripetal acceleration','Acceleration of an object moving in a circle, directed towards the centre.'],['Centripetal force','The resultant force acting towards the centre of the circle that keeps an object moving in a circle.'],['Period','Time for one complete revolution.']],
mcq:[
{q:'A wheel turns at 1200 revolutions per minute. Its angular velocity is',o:['20 rad s⁻¹','126 rad s⁻¹','7540 rad s⁻¹','40π rad s⁻¹ × 2'],a:1,e:'f = 20 Hz; ω = 2π × 20 = 126 rad s⁻¹.'},
{q:'A 0.20 kg mass moves at 4.0 m s⁻¹ in a horizontal circle of radius 0.50 m. Centripetal force =',o:['1.6 N','3.2 N','6.4 N','0.8 N'],a:2,e:'0.20 × 16/0.50 = 6.4 N.'},
{q:'The speed of an object in a circle doubles at the same radius. The centripetal force',o:['doubles','quadruples','halves','is unchanged'],a:1,e:'F ∝ v².'},
{q:'Minimum speed at the top of a vertical loop of radius 2.5 m is',o:['2.5 m s⁻¹','4.95 m s⁻¹','24.5 m s⁻¹','7.0 m s⁻¹'],a:1,e:'√(9.81 × 2.5) = 4.95 m s⁻¹.'},
{q:'Why is no work done by centripetal force?',o:['it is very small','it is perpendicular to the velocity','the object is in equilibrium','it acts outwards'],a:1,e:'W = Fx cos 90° = 0.'}
],
exam:[
{id:'5.2-E1',marks:6,style:'Structured · vertical circle',stem:'A 0.30 kg ball on a 0.80 m string is whirled in a vertical circle at a constant speed of 5.0 m s⁻¹.',parts:[
{q:'Calculate the tension at the top of the circle.',m:2,ms:['T + mg = mv²/r','T = 0.30 × 25/0.80 − 0.30 × 9.81 = 9.38 − 2.94 = 6.4 N'],ans:'6.4 N'},
{q:'Calculate the tension at the bottom.',m:2,ms:['T − mg = mv²/r','T = 9.38 + 2.94 = 12.3 N'],ans:'12 N'},
{q:'Explain why the string is most likely to break at the bottom.',m:2,ms:['at the bottom tension must provide centripetal force AND support weight','so tension is greatest there']}]},
{id:'5.2-E2',marks:4,style:'Structured · banked track',stem:'A car takes a bend of radius 60 m on a flat road. The maximum frictional force is 0.80 times the weight.',parts:[
{q:'Calculate the maximum speed for the car to take the bend without skidding.',m:3,ms:['mv²/r = 0.80mg','v² = 0.80 × 9.81 × 60 = 471','v = 22 m s⁻¹'],ans:'22 m s⁻¹'},
{q:'State why the mass of the car does not affect the answer.',m:1,ms:['mass cancels: both friction and required centripetal force are proportional to m']}]}
]});

S.addTopic({
id:'5.3',mod:5,title:'Oscillations',short:'SHM, energy in SHM, damping, forced oscillations and resonance.',
labs:['shm','resonance'],pags:['p10-1','p10-2'],
spec:['Displacement, amplitude, period, frequency, angular frequency and phase difference; ω = 2π/T = 2πf','Simple harmonic motion; defining equation a = −ω²x','Solutions x = A cos ωt or x = A sin ωt; v = ±ω√(A² − x²); v_max = ωA','Graphical methods to relate changes in displacement, velocity and acceleration during SHM','Period of a simple harmonic oscillator is independent of its amplitude (isochronous oscillator)','Techniques to investigate the motion of a simple harmonic oscillator using a data-logger (PAG10)','Interchange between kinetic and potential energy during SHM; energy–displacement graphs','Free and forced oscillations; damping (light, heavy, critical)','Resonance; natural frequency; amplitude–driving frequency graphs; examples of resonance'],
packs:two('5.3-Oscillations','5.3 Oscillations').concat(seq('5.3-Oscillations','Oscillations',3)),
notes:`
<h2>Simple harmonic motion</h2>
<p>An object performs SHM when its <strong>acceleration is directly proportional to its displacement from a fixed point and always directed towards that point</strong>: <strong>a = −ω²x</strong>.</p>
<ul><li>x = A cos ωt (released from maximum displacement) or x = A sin ωt (from equilibrium).</li><li>v = ±ω√(A² − x²); <strong>v<sub>max</sub> = ωA</strong> at x = 0.</li><li>a<sub>max</sub> = ω²A at x = ±A.</li><li>The period is independent of amplitude: an <strong>isochronous</strong> oscillator.</li><li>Mass–spring: T = 2π√(m/k). Simple pendulum (small angles): T = 2π√(L/g).</li></ul>
<svg class="diagram" viewBox="0 0 560 270" role="img" aria-label="Displacement, velocity and acceleration against time in SHM with 90 degree phase shifts">
<g class="small"><text x="4" y="48">x</text><text x="4" y="138">v</text><text x="4" y="228">a</text></g>
<g><line class="ax" x1="20" y1="45" x2="540" y2="45"/><path class="c1" d="M20 15 C60 15 80 75 120 75 C160 75 180 15 220 15 C260 15 280 75 320 75 C360 75 380 15 420 15 C460 15 480 75 520 75"/></g>
<g><line class="ax" x1="20" y1="135" x2="540" y2="135"/><path class="c2" d="M20 135 C40 165 50 165 70 165 C100 165 110 105 170 105 C190 105 200 135 220 135 C240 165 250 165 270 165 C300 165 310 105 370 105 C390 105 400 135 420 135 C440 165 450 165 470 165 C500 165 510 105 540 105"/></g>
<g><line class="ax" x1="20" y1="225" x2="540" y2="225"/><path class="c3" d="M20 255 C60 255 80 195 120 195 C160 195 180 255 220 255 C260 255 280 195 320 195 C360 195 380 255 420 255 C460 255 480 195 520 195"/></g>
<text x="300" y="262" class="small">x = A cos ωt; v = −Aω sin ωt; a = −Aω² cos ωt</text></svg>
<p>Velocity leads displacement by π/2; acceleration is in antiphase with displacement.</p>
<h2>Energy in SHM</h2>
<p>Total energy is constant (no damping): E<sub>total</sub> = ½mω²A². E<sub>k</sub> = ½mω²(A² − x²), E<sub>p</sub> = ½mω²x². On a graph of energy against displacement, E<sub>p</sub> is a parabola, E<sub>k</sub> an inverted parabola, total a horizontal line.</p>
<h2>Damping</h2>
<p>A <strong>free oscillation</strong> has no external force other than the restoring force; it oscillates at its <strong>natural frequency</strong>. <strong>Damping</strong> is when an external force acts on an oscillator to reduce its amplitude (energy is transferred to the surroundings).</p>
<ul><li><strong>Light damping</strong>: amplitude decreases gradually (exponentially); period almost unchanged.</li><li><strong>Critical damping</strong>: returns to equilibrium in the shortest time without oscillating (car suspension).</li><li><strong>Heavy (over-) damping</strong>: returns very slowly without oscillating.</li></ul>
<h2>Forced oscillations and resonance</h2>
<p>A <strong>forced oscillation</strong> is driven by a periodic external force at the driving frequency. <strong>Resonance</strong>: when the driving frequency equals the natural frequency, the amplitude is maximum (maximum energy transfer from driver to oscillator).</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Amplitude against driving frequency: light damping gives tall sharp peak at f0, heavier damping gives lower broader peak shifted slightly lower">
<line class="ax" x1="40" y1="190" x2="500" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 175 C150 170 220 150 250 30 C270 150 340 178 490 184"/><path class="c2" d="M40 177 C150 172 200 140 240 100 C275 135 340 175 490 185"/>
<line class="dash ax" x1="250" y1="30" x2="250" y2="190"/><text x="243" y="206" class="small">f₀</text><text x="258" y="42" class="small lbl1">light damping</text><text x="290" y="128" class="small lbl2">heavier damping</text><text x="430" y="206" class="small">driving f</text><text x="46" y="24" class="small">A</text></svg>
<p>More damping: lower peak, broader peak, peak slightly below f₀. Useful resonance: radio tuning, microwave ovens, musical instruments, MRI. Unwanted: Tacoma Narrows / Millennium Bridge, buildings in earthquakes, car panels rattling.</p>`,
eqs:[['a = −ω²x','SHM definition'],['x = A cos ωt; x = A sin ωt','Displacement in SHM'],['v = ±ω√(A² − x²)','Velocity in SHM'],['v<sub>max</sub> = ωA','Maximum speed'],['T = 2π√(m/k)','Mass–spring (given in data booklet context)'],['T = 2π√(L/g)','Simple pendulum'],['E = ½mω²A²','Total energy in SHM']],
terms:[['Simple harmonic motion','Oscillation where acceleration is directly proportional to displacement from the equilibrium position and directed towards it.'],['Isochronous','The period is independent of the amplitude.'],['Angular frequency','ω = 2πf.'],['Free oscillation','Oscillation with no external periodic force; occurs at the natural frequency.'],['Natural frequency','Frequency at which an object oscillates when displaced and left to oscillate freely.'],['Forced oscillation','Oscillation caused by an external periodic driving force.'],['Damping','Loss of energy from an oscillating system due to an external (resistive) force, reducing amplitude.'],['Critical damping','Damping that returns the system to equilibrium in the shortest time without oscillating.'],['Resonance','Maximum amplitude when the driving frequency equals the natural frequency of the oscillator.']],
mcq:[
{q:'A mass oscillates in SHM with amplitude 0.050 m and frequency 2.0 Hz. Maximum speed is',o:['0.10 m s⁻¹','0.63 m s⁻¹','0.31 m s⁻¹','7.9 m s⁻¹'],a:1,e:'v_max = 2πfA = 2π × 2 × 0.05 = 0.63 m s⁻¹.'},
{q:'Maximum acceleration in the oscillation above is',o:['7.9 m s⁻²','3.9 m s⁻²','0.63 m s⁻²','16 m s⁻²'],a:0,e:'ω²A = (4π)² × 0.05 = 7.9 m s⁻².'},
{q:'The amplitude of an SHM oscillator doubles. The total energy',o:['doubles','quadruples','stays the same','halves'],a:1,e:'E ∝ A².'},
{q:'Which describes the phase relation of acceleration to displacement in SHM?',o:['in phase','π/2 ahead','π/2 behind','π out of phase'],a:3,e:'a = −ω²x.'},
{q:'The mass on a spring is quadrupled. The period',o:['doubles','quadruples','halves','is unchanged'],a:0,e:'T ∝ √m.'},
{q:'Increasing the damping of a driven oscillator',o:['raises the resonant amplitude','makes the resonance peak sharper','lowers and broadens the peak','increases the natural frequency'],a:2,e:'More damping, lower and broader peak.'}
],
exam:[
{id:'5.3-E1',marks:7,style:'Structured · SHM',stem:'A 0.40 kg mass on a spring (k = 25 N m⁻¹) is pulled 6.0 cm below equilibrium and released.',parts:[
{q:'Show that the motion is simple harmonic and calculate the period.',m:3,ms:['F = −kx so a = −(k/m)x: a ∝ −x → SHM','ω² = k/m = 62.5 → ω = 7.9 rad s⁻¹','T = 2π/ω = 0.79 s'],ans:'0.79 s'},
{q:'Calculate the maximum speed and the speed when x = 3.0 cm.',m:2,ms:['v_max = ωA = 7.9 × 0.060 = 0.47 m s⁻¹','v = ω√(A² − x²) = 7.9 √(0.0036 − 0.0009) = 0.41 m s⁻¹']},
{q:'Calculate the total energy of the oscillation.',m:2,ms:['E = ½kA² (= ½mω²A²)','= ½ × 25 × 0.060² = 0.045 J']}]},
{id:'5.3-E2',marks:6,style:'Extended response · resonance (6-mark LoR style)',stem:'A student wants to investigate how the amplitude of a mass–spring system depends on the frequency of a vibration generator driving it.',parts:[
{q:'Describe how the experiment could be done, what graph would be obtained, and how damping changes the graph.',m:6,ms:['mass on spring attached to vibration generator driven by signal generator','vary frequency in small steps, especially near resonance','measure amplitude with a ruler / motion sensor at each frequency (wait for steady state)','plot amplitude against driving frequency: peak at natural frequency f₀','add damping (e.g. card or immerse mass in water): peak lower and broader','resonant peak shifts slightly to lower frequency with more damping']}]}
]});

S.addTopic({
id:'5.4',mod:5,title:'Gravitational fields',short:'Field strength, Newton’s law, Kepler’s laws, orbits, potential and escape velocity.',
labs:['orbit','missions','gfield'],pags:[],
spec:['Gravitational fields due to a mass; gravitational field strength g = F/m','Modelling the mass of a spherical object as a point mass at its centre','Gravitational field lines to map fields; uniform field near Earth’s surface','Newton’s law of gravitation F = −GMm/r²; g = −GM/r²','Kepler’s three laws of planetary motion; T² = (4π²/GM) r³','Satellites; geostationary orbit; uses','Gravitational potential V_g = −GM/r; force–distance and field–distance graphs; area under g–r graph','Gravitational potential energy E = mV_g = −GMm/r; escape velocity v = √(2GM/r)'],
packs:two('5.4-Gravitational-Fields','5.4 Gravitational Fields').concat(seq('5.4-Gravitational-Fields','Gravitational Fields',3)),
notes:`
<h2>Gravitational field strength</h2>
<p>A gravitational field is a region in which a mass experiences a force. <strong>g = F/m</strong>, the force per unit mass (N kg<sup>−1</sup>). A spherical mass with uniform density acts as a point mass at its centre. Field lines point towards the mass: radial around a planet, nearly <strong>uniform</strong> (parallel, equally spaced) near Earth's surface.</p>
<h2>Newton's law of gravitation</h2>
<p>The force between two point masses is directly proportional to the product of their masses and inversely proportional to the square of their separation: <strong>F = −GMm/r²</strong>. The minus sign shows the force is attractive. Hence <strong>g = −GM/r²</strong> (an inverse square law).</p>
<h2>Kepler's laws</h2>
<ol><li>Planets move in elliptical orbits with the Sun at one focus.</li><li>A line joining a planet to the Sun sweeps out equal areas in equal times (planets move faster when closer to the Sun).</li><li>T² ∝ r³: the square of the period is proportional to the cube of the mean distance.</li></ol>
<p>For a circular orbit, gravitational force provides centripetal force: GMm/r² = mω²r = m(2π/T)²r, so <strong>T² = (4π²/GM) r³</strong> and orbital speed <strong>v = √(GM/r)</strong>.</p><div class="vidrec" data-vid="HJ1fHPzhkZM"></div>
<h2>Satellites</h2>
<p>A <strong>geostationary</strong> satellite orbits above the equator with a period of 24 hours, in the same direction as the Earth's rotation, so it stays above the same point (r ≈ 4.2 × 10<sup>7</sup> m). Used for communications and TV. Low polar orbits are used for imaging, weather and mapping.</p>
<h2>Gravitational potential</h2>
<p>The <strong>gravitational potential</strong> at a point is the work done per unit mass to bring a small test mass from infinity to that point: <strong>V<sub>g</sub> = −GM/r</strong> (J kg<sup>−1</sup>). It is zero at infinity and negative everywhere else. g = −ΔV<sub>g</sub>/Δr (field strength is minus the potential gradient). The area under a g–r graph equals the change in potential.</p>
<p><strong>Gravitational potential energy</strong> E = mV<sub>g</sub> = −GMm/r. The area under a force–distance graph is the work done (change in GPE).</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Graphs of g and V against r for a planet of radius R">
<line class="ax" x1="40" y1="110" x2="500" y2="110" marker-end="url(#ah)"/><line class="ax" x1="40" y1="200" x2="40" y2="20" marker-end="url(#ah)"/><line class="dash ax" x1="110" y1="20" x2="110" y2="200"/><text x="104" y="124" class="small">R</text>
<path class="c1" d="M40 110 L110 30 C160 72 220 92 300 100 C380 105 440 107 490 108"/><text x="160" y="60" class="small lbl1">|g| ∝ 1/r²</text>
<path class="c2" d="M110 190 C170 150 240 130 320 122 C400 116 450 114 490 113"/><text x="200" y="168" class="small lbl2">V<tspan dy="3" font-size="9">g</tspan><tspan dy="-3"> = −GM/r</tspan></text><text x="488" y="128" class="small">r</text></svg>
<h2>Escape velocity</h2>
<p>The minimum speed needed to escape from a planet's gravitational field: ½mv² = GMm/r, so <strong>v<sub>esc</sub> = √(2GM/r)</strong>. For Earth ≈ 11 km s<sup>−1</sup>. It does not depend on the mass of the object.</p>`,
eqs:[['g = F/m','Field strength'],['F = −GMm/r²','Newton’s law of gravitation'],['g = −GM/r²','Field of a point mass'],['T² = (4π²/GM) r³','Kepler’s third law'],['v = √(GM/r)','Orbital speed'],['V<sub>g</sub> = −GM/r','Gravitational potential'],['E = mV<sub>g</sub> = −GMm/r','Gravitational potential energy'],['v<sub>esc</sub> = √(2GM/r)','Escape velocity']],
terms:[['Gravitational field strength','Force per unit mass at a point in a gravitational field.'],['Newton’s law of gravitation','Force between two point masses is proportional to the product of the masses and inversely proportional to the square of their separation.'],['Kepler’s first law','Planets move in elliptical orbits with the Sun at one focus.'],['Kepler’s second law','A line from the Sun to a planet sweeps out equal areas in equal times.'],['Kepler’s third law','T² is proportional to r³ for planets orbiting the same star.'],['Geostationary orbit','Equatorial orbit with a 24-hour period in the direction of Earth’s rotation, so the satellite stays over one point.'],['Gravitational potential','Work done per unit mass to bring a small test mass from infinity to a point.'],['Escape velocity','Minimum speed an object must have to escape a planet’s gravitational field.']],
mcq:[
{q:'At what height above Earth’s surface (radius R) is g a quarter of its surface value?',o:['R/4','R/2','R','2R'],a:2,e:'g ∝ 1/r²; r = 2R so height = R.'},
{q:'A planet has twice Earth’s mass and twice its radius. Surface g is',o:['4.9 N kg⁻¹','9.8 N kg⁻¹','19.6 N kg⁻¹','2.5 N kg⁻¹'],a:0,e:'g ∝ M/r²: × 2/4 = ½ → 4.9 N kg⁻¹.'},
{q:'Satellite A orbits at radius r, B at 4r. Ratio T_B/T_A =',o:['4','8','16','2'],a:1,e:'T ∝ r^1.5: 4^1.5 = 8.'},
{q:'Gravitational potential at the surface of the Moon (M = 7.3 × 10²² kg, R = 1.7 × 10⁶ m) is',o:['−2.9 × 10⁶ J kg⁻¹','−1.6 J kg⁻¹','−2.9 × 10⁻⁶ J kg⁻¹','+2.9 × 10⁶ J kg⁻¹'],a:0,e:'−GM/R = −6.67 × 10⁻¹¹ × 7.3 × 10²² / 1.7 × 10⁶ = −2.86 × 10⁶ J kg⁻¹.'},
{q:'The escape velocity from a planet depends on',o:['mass of the object','planet’s mass and radius only','launch angle','object’s mass and planet’s radius'],a:1,e:'v = √(2GM/r).'}
],
exam:[
{id:'5.4-E1',marks:7,style:'Structured · geostationary orbit',stem:'Earth: mass 6.0 × 10²⁴ kg, radius 6.4 × 10⁶ m.',parts:[
{q:'Show that the radius of a geostationary orbit is about 4.2 × 10⁷ m.',m:3,ms:['T = 24 × 3600 = 86 400 s','r³ = GMT²/4π² = 6.67 × 10⁻¹¹ × 6.0 × 10²⁴ × 86 400² / 4π²','r = 4.2 × 10⁷ m']},
{q:'Calculate the orbital speed.',m:2,ms:['v = 2πr/T = 2π × 4.2 × 10⁷ / 86 400','= 3.1 × 10³ m s⁻¹']},
{q:'Calculate the energy needed to lift a 500 kg satellite from Earth’s surface to this orbit (ignore its kinetic energy).',m:2,ms:['ΔE = GMm(1/R − 1/r) = 6.67 × 10⁻¹¹ × 6.0 × 10²⁴ × 500 × (1/6.4 × 10⁶ − 1/4.2 × 10⁷)','= 2.6 × 10¹⁰ J']}]},
{id:'5.4-E2',marks:3,style:'Structured · escape velocity',stem:'Derive an expression for the escape velocity from the surface of a planet of mass M and radius R, and explain why it is independent of the mass of the object.',parts:[{q:'Derive v_esc and comment.',m:3,ms:['KE must equal the work to reach infinity: ½mv² = GMm/R','v = √(2GM/R)','m cancels, so independent of the object’s mass']}]}
]});

S.addTopic({
id:'5.5',mod:5,title:'Astrophysics and cosmology',short:'Stellar evolution, HR diagram, spectra, Wien and Stefan, parallax, Hubble, Big Bang.',
labs:['hr','blackbody','spectra','hubble'],pags:[],
spec:['Objects in the universe: planets, planetary satellites, comets, solar systems, galaxies, the interstellar medium','Formation of a star from interstellar dust and gas; gravitational collapse; fusion of hydrogen into helium; main sequence','Evolution of low-mass stars into red giant then white dwarf; electron degeneracy pressure; Chandrasekhar limit','Evolution of massive stars into red supergiant then neutron star or black hole; supernova','Hertzsprung–Russell (HR) diagram','Energy levels of electrons in isolated gas atoms; negative energies; emission and absorption line spectra; hf = ΔE','Diffraction gratings; d sin θ = nλ','Wien’s displacement law λ_max ∝ 1/T; Stefan’s law L = 4πr²σT⁴; estimating radius of distant stars','AU, ly, pc; stellar parallax p = 1/d','Cosmological principle; Doppler effect; Δλ/λ ≈ Δf/f ≈ v/c','Hubble’s law v ≈ H₀d; model of an expanding universe; estimating the age of the universe t ≈ H₀⁻¹','Big Bang theory; CMB radiation as evidence; evolution of the universe after the Big Bang','Dark energy and dark matter; galaxy rotation curves'],
packs:two('5.5-Astrophysics-and-Cosmology','5.5 Astrophysics and Cosmology').concat(seq('5.5-Astrophysics-and-Cosmology','Astrophysics & Cosmology',4),[P('Set C (legacy G485)','Universe',M+'5.5-Astrophysics-and-Cosmology/Set-C/Universe.pdf'),P('Set C (legacy G485)','Universe MS',M+'5.5-Astrophysics-and-Cosmology/Set-C/Universe MS.pdf')]),
notes:`
<h2>Objects in the universe</h2>
<ul><li><strong>Planet</strong>: orbits a star, has enough mass for gravity to make it spherical, has cleared its orbit of most other objects; no fusion.</li><li><strong>Planetary satellite</strong>: a body in orbit around a planet.</li><li><strong>Comet</strong>: small irregular body of ice, dust and rock in a highly elliptical orbit; develops a tail near the Sun.</li><li><strong>Solar system</strong>: a star and all the objects orbiting it. <strong>Galaxy</strong>: a collection of stars, dust and gas held together by gravity. <strong>Interstellar medium</strong>: gas and dust between stars.</li></ul>
<h2>Life cycle of stars</h2>
<ol><li>Gravity pulls a nebula (dust and gas) together; the cloud heats up as gravitational PE becomes kinetic energy → <strong>protostar</strong>.</li><li>When the core is hot and dense enough, hydrogen nuclei fuse to helium → <strong>main sequence</strong> star. Stable because radiation (and gas) pressure outwards balances gravity inwards.</li><li><strong>Low-mass stars</strong> (0.5–10 M<sub>☉</sub>): core hydrogen runs out, core contracts, outer layers expand and cool → <strong>red giant</strong>, fusing helium to carbon/oxygen; outer layers drift off as a planetary nebula, leaving a <strong>white dwarf</strong> supported by <strong>electron degeneracy pressure</strong> (Pauli exclusion principle). Maximum white dwarf mass is the <strong>Chandrasekhar limit</strong>, 1.44 M<sub>☉</sub>.</li><li><strong>Massive stars</strong> (> 10 M<sub>☉</sub>): <strong>red supergiant</strong>, fusing elements up to iron; core collapses → <strong>supernova</strong>; remnant core above 1.44 M<sub>☉</sub> becomes a <strong>neutron star</strong>, or above about 3 M<sub>☉</sub> a <strong>black hole</strong> (escape velocity greater than c).</li></ol>
<svg class="diagram" viewBox="0 0 520 300" role="img" aria-label="Hertzsprung-Russell diagram: luminosity against temperature (decreasing to the right) with main sequence diagonal, red giants top right, white dwarfs bottom left">
<line class="ax" x1="60" y1="270" x2="500" y2="270" marker-end="url(#ah)"/><line class="ax" x1="60" y1="270" x2="60" y2="20" marker-end="url(#ah)"/>
<text x="10" y="30" class="small">L/L☉</text><text x="70" y="290" class="small">40 000 K</text><text x="250" y="290" class="small">temperature</text><text x="440" y="290" class="small">2500 K</text>
<text x="30" y="60" class="small">10⁴</text><text x="40" y="150" class="small">1</text><text x="30" y="250" class="small">10⁻⁴</text>
<path class="msband" d="M80 40 C180 90 300 170 470 250 L460 262 C300 186 170 108 70 54 Z"/><text x="230" y="140" class="small">main sequence</text>
<ellipse class="giantz" cx="400" cy="90" rx="70" ry="30"/><text x="370" y="94" class="small">red giants</text>
<ellipse class="giantz" cx="380" cy="40" rx="80" ry="14"/><text x="340" y="44" class="small">supergiants</text>
<ellipse class="dwarfz" cx="150" cy="235" rx="55" ry="18"/><text x="110" y="239" class="small">white dwarfs</text>
<circle cx="285" cy="160" r="6" class="sun"/><text x="295" y="164" class="small">Sun</text></svg>
<h2>Energy levels and spectra</h2>
<p>Electrons in isolated atoms can only have <strong>discrete energy levels</strong>. Levels have negative values because energy must be supplied to free the electron (zero = ionised). An electron moving between levels emits or absorbs a photon of energy <strong>hf = ΔE</strong>.</p>
<ul><li><strong>Emission line spectrum</strong>: bright lines on a dark background from a hot low-pressure gas.</li><li><strong>Absorption line spectrum</strong>: dark lines on a continuous spectrum, when white light passes through a cooler gas. Lines reveal the elements in a star's atmosphere.</li><li><strong>Continuous spectrum</strong>: all wavelengths, from a hot dense object.</li></ul>
<p>A diffraction grating (d sin θ = nλ) is used to measure the wavelengths of spectral lines.</p>
<h2>Black-body radiation</h2>
<p><strong>Wien's displacement law</strong>: <strong>λ<sub>max</sub> ∝ 1/T</strong> (λ<sub>max</sub>T ≈ 2.9 × 10<sup>−3</sup> m K). Hotter stars peak at shorter wavelength (bluer).</p>
<p><strong>Stefan's law</strong>: luminosity <strong>L = 4πr²σT⁴</strong>. Using Wien to get T and the measured L, you can estimate a star's radius.</p>
<h2>Distances</h2>
<ul><li><strong>Astronomical unit</strong>: mean distance from Earth to Sun, 1.50 × 10<sup>11</sup> m.</li><li><strong>Light-year</strong>: distance light travels in a vacuum in one year, 9.46 × 10<sup>15</sup> m.</li><li><strong>Parsec</strong>: the distance at which a star has a parallax angle of one arcsecond (1 pc = 3.1 × 10<sup>16</sup> m ≈ 3.26 ly).</li><li><strong>Stellar parallax</strong>: apparent shift of a nearby star against distant stars as Earth orbits the Sun. <strong>p = 1/d</strong> (p in arcseconds, d in parsecs).</li></ul>
<h2>Cosmology</h2>
<p><strong>Cosmological principle</strong>: on a large scale the universe is homogeneous and isotropic, and the laws of physics are universal.</p>
<p><strong>Doppler effect</strong>: light from receding galaxies is <strong>redshifted</strong>. <strong>Δλ/λ ≈ Δf/f ≈ v/c</strong> (for v ≪ c).</p>
<p><strong>Hubble's law</strong>: the recession velocity of a galaxy is directly proportional to its distance: <strong>v ≈ H₀d</strong>. This implies the universe is expanding. Age of the universe <strong>t ≈ 1/H₀</strong> (≈ 14 billion years). Watch units: convert km s<sup>−1</sup> Mpc<sup>−1</sup> to s<sup>−1</sup>.</p>
<p><strong>Big Bang</strong>: the universe began from a very hot, dense state about 13.7 billion years ago and has been expanding (space itself expanding) and cooling since. Evidence: Hubble's law and galactic redshift; the <strong>cosmic microwave background (CMB)</strong>, black-body radiation at about 2.7 K, the redshifted remnant of radiation released when the universe became transparent about 380 000 years after the Big Bang; its uniformity supports the cosmological principle.</p>
<p>Evolution: quarks and leptons → hadrons (protons, neutrons) → light nuclei formed in the first few minutes (mostly H and He) → atoms after ~380 000 years → first stars and galaxies.</p>
<p><strong>Dark matter</strong>: galaxy rotation curves are flat (outer stars orbit faster than visible mass predicts), so there must be extra unseen mass. <strong>Dark energy</strong>: needed to explain the accelerating expansion of the universe. Ordinary matter is only about 5% of the universe.</p>`,
eqs:[['hf = ΔE','Photon from an energy-level transition'],['d sin θ = nλ','Diffraction grating'],['λ<sub>max</sub> ∝ 1/T','Wien’s displacement law'],['L = 4πr²σT⁴','Stefan’s law'],['p = 1/d','Parallax (arcsec, pc)'],['Δλ/λ ≈ Δf/f ≈ v/c','Doppler shift'],['v ≈ H₀d','Hubble’s law'],['t ≈ H₀<sup>−1</sup>','Age of the universe']],
terms:[['Planet','Object orbiting a star with enough mass to be spherical, that has cleared its orbit and does not undergo fusion.'],['Comet','Small irregular body of ice, dust and rock orbiting the Sun in a highly elliptical orbit.'],['Galaxy','A collection of stars, gas and dust held together by gravity.'],['Interstellar medium','Gas and dust between stars.'],['Main sequence','Stage in which a star fuses hydrogen into helium in its core; gravity balanced by radiation and gas pressure.'],['Electron degeneracy pressure','Pressure that prevents further collapse of a white dwarf; no two electrons can occupy the same quantum state.'],['Chandrasekhar limit','Maximum mass of a white dwarf, 1.44 solar masses.'],['Supernova','Explosion of a massive star at the end of its life.'],['Neutron star','Very dense remnant of a supernova core, made mostly of neutrons.'],['Black hole','Object so dense that its escape velocity exceeds the speed of light.'],['Luminosity','Total radiant power emitted by a star.'],['Astronomical unit','Mean distance from the Earth to the Sun.'],['Light-year','Distance travelled by light in a vacuum in one year.'],['Parsec','Distance at which a star has a parallax angle of one arcsecond.'],['Cosmological principle','On a large scale the universe is homogeneous and isotropic and the laws of physics are universal.'],['Hubble’s law','Recession velocity of a galaxy is directly proportional to its distance from us.'],['Cosmic microwave background','Black-body microwave radiation at about 2.7 K filling the universe, from shortly after the Big Bang.'],['Dark matter','Matter that cannot be observed directly but whose gravitational effects are seen, e.g. in flat galaxy rotation curves.'],['Dark energy','Hypothetical form of energy responsible for the accelerating expansion of the universe.']],
mcq:[
{q:'A star’s spectrum peaks at 290 nm. Using λ_max T = 2.9 × 10⁻³ m K, its surface temperature is',o:['1.0 × 10⁴ K','5800 K','2.9 × 10⁴ K','1000 K'],a:0,e:'T = 2.9 × 10⁻³ / 2.9 × 10⁻⁷ = 1.0 × 10⁴ K.'},
{q:'A star has parallax 0.25 arcsec. Its distance is',o:['0.25 pc','4.0 pc','13 ly × 4','25 pc'],a:1,e:'d = 1/p = 4.0 pc.'},
{q:'A line of rest wavelength 656 nm is observed at 670 nm. Recession speed ≈',o:['6.4 × 10⁶ m s⁻¹','2.1 × 10⁴ m s⁻¹','6.4 × 10⁴ m s⁻¹','3.0 × 10⁸ m s⁻¹'],a:0,e:'v = c Δλ/λ = 3.0 × 10⁸ × 14/656 = 6.4 × 10⁶ m s⁻¹.'},
{q:'Star A has twice the surface temperature and the same radius as star B. L_A/L_B =',o:['2','4','8','16'],a:3,e:'L ∝ T⁴.'},
{q:'What supports a white dwarf against gravitational collapse?',o:['radiation pressure from fusion','neutron degeneracy pressure','electron degeneracy pressure','magnetic pressure'],a:2,e:'Electron degeneracy pressure.'},
{q:'Transition from −3.4 eV to −13.6 eV emits a photon of wavelength',o:['122 nm','91 nm','365 nm','656 nm'],a:0,e:'ΔE = 10.2 eV = 1.63 × 10⁻¹⁸ J; λ = hc/E = 1.22 × 10⁻⁷ m.'},
{q:'H₀ = 70 km s⁻¹ Mpc⁻¹ (1 Mpc = 3.1 × 10²² m). Estimate of the age of the universe is',o:['1.4 × 10¹⁰ years','4.4 × 10¹⁷ years','1.4 × 10⁸ years','2.3 × 10⁻¹⁸ years'],a:0,e:'H₀ = 7.0 × 10⁴/3.1 × 10²² = 2.26 × 10⁻¹⁸ s⁻¹; 1/H₀ = 4.4 × 10¹⁷ s = 1.4 × 10¹⁰ years.'}
],
exam:[
{id:'5.5-E1',marks:6,style:'Structured · Stefan and Wien',stem:'Betelgeuse has a luminosity of 4.5 × 10³¹ W and its spectrum peaks at 830 nm. Wien’s constant = 2.9 × 10⁻³ m K.',parts:[
{q:'Calculate its surface temperature.',m:2,ms:['T = 2.9 × 10⁻³ / 830 × 10⁻⁹','= 3.5 × 10³ K'],ans:'3500 K'},
{q:'Calculate its radius.',m:3,ms:['L = 4πr²σT⁴','r² = 4.5 × 10³¹ / (4π × 5.67 × 10⁻⁸ × 3500⁴) = 4.2 × 10²³','r = 6.5 × 10¹¹ m'],ans:'6.5 × 10¹¹ m'},
{q:'Where would Betelgeuse be on an HR diagram?',m:1,ms:['top right: red supergiant (high luminosity, low temperature)']}]},
{id:'5.5-E2',marks:6,style:'Extended response · evidence for the Big Bang',stem:'The Big Bang model is widely accepted.',parts:[{q:'Describe the evidence for the Big Bang and what it tells us about the universe.',m:6,ms:['light from distant galaxies is redshifted: galaxies receding','Hubble’s law v = H₀d: recession speed ∝ distance → universe expanding','extrapolating back: universe began from a single hot dense point; age ≈ 1/H₀','CMB: microwave radiation from all directions, black-body at 2.7 K','it is radiation from the early hot universe, redshifted by expansion','its uniformity (isotropy) supports the cosmological principle; tiny fluctuations seed galaxies']}]}
]});
})();
