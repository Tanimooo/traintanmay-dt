/* Full topic notes, Module 5: Newtonian world and astrophysics. Replaces the short notes in m5.js (loaded after it). */
(function(){
const N={};

N['5.1']=`
<h2>Temperature and thermal equilibrium</h2>
<p>When a hot object touches a cold one, energy flows from hot to cold until they reach the same temperature. Then there is no <em>net</em> flow of energy between them, and they are in <strong>thermal equilibrium</strong>. Temperature is the quantity that tells you which way thermal energy will flow: always from higher to lower temperature.</p>
<h3>The absolute (thermodynamic) scale</h3>
<p>The Celsius scale is based on a property of one substance: water freezes at 0 °C and boils at 100 °C. The <strong>thermodynamic scale</strong> (kelvin) does <strong>not depend on the property of any particular substance</strong>. Its zero is <strong>absolute zero</strong>, the lowest possible temperature, where every substance has its <strong>minimum internal energy</strong> (the particles have the least possible kinetic energy). Nothing can be colder.</p>
<div class="eqgrid"><div>T / K = θ / °C + 273</div></div>
<p>A temperature <em>change</em> of 1 K is the same as a change of 1 °C. Absolute zero is −273 °C (more precisely −273.15 °C). In gas-law and kinetic-theory equations you <strong>must</strong> use kelvin.</p>

<h2>The kinetic model of matter</h2>
<p>All matter is made of particles (atoms or molecules) in constant motion. The differences between solids, liquids and gases come from how far apart the particles are, how ordered they are and how they move.</p>
<div class="tbl"><table><tr><th></th><th>Solid</th><th>Liquid</th><th>Gas</th></tr>
<tr><td>Spacing</td><td>Very close, touching</td><td>Close, about the same as in the solid (so similar density)</td><td>Far apart: about 10 molecular diameters on average</td></tr>
<tr><td>Ordering</td><td>Regular arrangement (lattice) in crystalline solids</td><td>Disordered, with short-range order only</td><td>Completely random</td></tr>
<tr><td>Motion</td><td>Vibrate about fixed positions</td><td>Move randomly, sliding past each other</td><td>Move fast and randomly in straight lines between collisions</td></tr>
<tr><td>Forces between particles</td><td>Strong</td><td>Weaker, but still significant</td><td>Negligible except during collisions</td></tr></table></div>
<h3>Brownian motion: evidence for moving molecules</h3>
<p>Put some smoke in a small glass cell, light it from the side and look through a microscope. The smoke particles appear as specks of light that jiggle about <strong>randomly</strong> in jerky, zig-zag paths. The smoke particles are being hit unevenly by <strong>air molecules</strong> that are far too small to see, moving <strong>fast and randomly</strong>. At any instant more molecules hit one side than the other, giving a random net force. This is evidence for the kinetic model. (Pollen grains in water show the same thing.)</p>

<h2>Internal energy</h2>
<p><strong>The internal energy of a substance is the sum of the randomly distributed kinetic and potential energies of all its particles.</strong></p>
<ul>
<li><strong>Kinetic energy</strong> comes from the particles' random motion (vibration in a solid, translation and rotation in fluids). Temperature is a measure of the mean kinetic energy.</li>
<li><strong>Potential energy</strong> comes from the forces (bonds) between particles: it depends on their separation. It is negative (energy must be supplied to separate bound particles), and gets less negative as particles move further apart.</li>
</ul>
<p>Internal energy increases when you heat something or do work on it (like rubbing or compressing).</p>
<h3>Changes of state</h3>
<svg class="diagram" viewBox="0 0 520 210" role="img" aria-label="Heating curve: temperature rises, flat at melting, rises, flat at boiling">
<line class="ax" x1="40" y1="190" x2="500" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 175 L100 140 L190 140 L250 80 L400 80 L470 30"/>
<text x="115" y="132" class="small">melting (KE same, PE ↑)</text><text x="275" y="72" class="small">boiling</text><text x="20" y="28" class="small">θ</text><text x="440" y="208" class="small">time (constant power)</text></svg>
<p>Heat ice at a steady rate and its temperature rises, until it starts to melt. Then the temperature <strong>stays constant</strong> until all of it has melted, even though energy is still going in. Why? During a change of state the energy breaks bonds (or loosens them), increasing the <strong>potential energy</strong> of the particles. Their mean <strong>kinetic energy</strong> does not change, so the temperature does not change. Once it is all liquid, the temperature rises again until boiling, where the same thing happens.</p>
<p>The boiling flat section is much longer than the melting one: boiling separates the particles completely, and the gas must also push back the atmosphere as its volume increases hugely.</p>

<h2>Specific heat capacity</h2>
<p><strong>The specific heat capacity c of a substance is the energy needed to raise the temperature of 1 kg of the substance by 1 K (or 1 °C)</strong>, with no change of state.</p>
<div class="eqgrid"><div>E = mcΔθ</div></div>
<p>Unit: J kg<sup>−1</sup> K<sup>−1</sup>. Water has a very high value, 4200 J kg<sup>−1</sup> K<sup>−1</sup>; copper about 390; aluminium about 900.</p>
<h3>Electrical method (PAG 11)</h3>
<ol>
<li>Put an electrical heater and a thermometer (or temperature probe) into holes in a metal block of known mass (or a known mass of liquid). Wrap the block in insulation.</li>
<li>Connect the heater to a power supply with an ammeter in series and a voltmeter in parallel.</li>
<li>Switch on and start a stopwatch. Record V, I and the temperature at regular time intervals.</li>
<li>Energy supplied E = VIt. Plot θ against t. Since VIt = mcΔθ, the gradient Δθ/Δt = VI/mc, so <strong>c = VI/(m × gradient)</strong>.</li>
</ol>
<p>Heat lost to the surroundings means more energy is supplied than goes into the block, so the calculated c is <strong>too high</strong>. Reduce this with insulation, and by using the straight part of the graph (after the heater has warmed up). Put a drop of oil in the thermometer hole for good thermal contact.</p>
<h3>Method of mixtures</h3>
<p>Heat a metal object to a known temperature (in boiling water), then quickly transfer it into a known mass of cold water in an insulated cup. Measure the final temperature when they reach thermal equilibrium. Energy lost by metal = energy gained by water: m<sub>metal</sub> c<sub>metal</sub> Δθ<sub>metal</sub> = m<sub>water</sub> c<sub>water</sub> Δθ<sub>water</sub>.</p>
<div class="wex"><p><strong>Worked example.</strong> A 0.20 kg block of metal at 100 °C is dropped into 0.30 kg of water at 20 °C. The final temperature is 25 °C. Find c for the metal.</p>
<p>Energy gained by water = 0.30 × 4200 × 5.0 = 6300 J.</p>
<p>Energy lost by metal = 0.20 × c × 75 = 15c. So c = 6300/15 = <strong>420 J kg<sup>−1</sup> K<sup>−1</sup></strong>.</p></div>

<h2>Specific latent heat</h2>
<p><strong>The specific latent heat L of a substance is the energy needed to change the state of 1 kg of the substance without any change in temperature.</strong></p>
<div class="eqgrid"><div>E = mL</div></div>
<ul>
<li><strong>Specific latent heat of fusion</strong> L<sub>f</sub>: solid ↔ liquid. For water, 3.3 × 10<sup>5</sup> J kg<sup>−1</sup>.</li>
<li><strong>Specific latent heat of vaporisation</strong> L<sub>v</sub>: liquid ↔ gas. For water, 2.3 × 10<sup>6</sup> J kg<sup>−1</sup>, about 7 times L<sub>f</sub>. When liquid becomes gas, all the remaining bonds must be broken, the particles end up much further apart, and work is done pushing back the atmosphere as the volume expands about 1000 times. Melting only loosens the bonds a little.</li>
</ul>
<h3>Measuring L (electrical method)</h3>
<p>For L<sub>f</sub>: put an immersion heater in a funnel packed with crushed ice, with a beaker underneath. Run a control funnel with no heater alongside, to find how much ice melts from the room's heat alone. Switch on for a measured time; the extra mass of water collected compared to the control gives m, and E = VIt. Then L = VIt/m.</p>
<p>For L<sub>v</sub>: put a beaker of water with a heater on a balance. Once it is boiling steadily, measure the mass lost over a known time: L = VIt/m.</p>
<div class="wex"><p><strong>Worked example.</strong> How much energy turns 0.50 kg of ice at −10 °C into water at 20 °C? (c<sub>ice</sub> = 2100, c<sub>water</sub> = 4200 J kg<sup>−1</sup> K<sup>−1</sup>; L<sub>f</sub> = 3.3 × 10<sup>5</sup> J kg<sup>−1</sup>)</p>
<p>Warm the ice: 0.50 × 2100 × 10 = 10 500 J. Melt it: 0.50 × 3.3 × 10<sup>5</sup> = 165 000 J. Warm the water: 0.50 × 4200 × 20 = 42 000 J.</p>
<p>Total = <strong>2.2 × 10<sup>5</sup> J</strong>. Each stage needs its own equation.</p></div>

<h2>The mole and the Avogadro constant</h2>
<p>Gases contain enormous numbers of particles, so we count them in <strong>moles</strong>. One mole of any substance contains <strong>N<sub>A</sub> = 6.02 × 10<sup>23</sup></strong> particles (the Avogadro constant). The amount of substance n (in mol) is one of the S.I. base quantities.</p>
<div class="eqgrid"><div>N = nN<sub>A</sub></div><div>n = mass / molar mass</div></div>
<p>The molar mass is the mass of one mole. For example, 1 mol of helium has a mass of 4.0 g; 1 mol of N₂ has a mass of 28 g. So the mass of one particle is molar mass ÷ N<sub>A</sub>.</p>

<h2>Ideal gases and the gas laws</h2>
<p>For a fixed mass of gas, experiments show three relationships between pressure p, volume V and absolute temperature T:</p>
<ul>
<li><strong>Boyle's law</strong>: at constant temperature, pV = constant (p ∝ 1/V). Squash a gas to half its volume and its pressure doubles.</li>
<li>At constant volume, p ∝ T (the pressure law).</li>
<li>At constant pressure, V ∝ T (Charles's law).</li>
</ul>
<p>These combine into the <strong>equation of state for an ideal gas</strong>:</p>
<div class="eqgrid"><div>pV = nRT</div><div>pV = NkT</div></div>
<p>R = 8.31 J mol<sup>−1</sup> K<sup>−1</sup> is the molar gas constant. k is the Boltzmann constant (below). An <strong>ideal gas</strong> is one that obeys this equation exactly; real gases come close at low pressure and high temperature, when their particles are far apart.</p>
<svg class="diagram" viewBox="0 0 560 190" role="img" aria-label="Pressure against volume (isotherms) and pressure against temperature extrapolating to absolute zero">
<g><line class="ax" x1="30" y1="170" x2="250" y2="170" marker-end="url(#ah)"/><line class="ax" x1="30" y1="170" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" d="M50 30 C70 120 120 150 240 158"/><path class="c2" d="M70 30 C90 110 150 135 240 142"/><text x="160" y="125" class="small lbl2">higher T</text><text x="236" y="184" class="small">V</text><text x="36" y="24" class="small">p</text></g>
<g transform="translate(290 0)"><line class="ax" x1="10" y1="170" x2="260" y2="170" marker-end="url(#ah)"/><line class="ax" x1="150" y1="170" x2="150" y2="20" marker-end="url(#ah)"/><line class="c1" x1="150" y1="120" x2="250" y2="60"/><line class="c1 dash" x1="67" y1="170" x2="150" y2="120"/><text x="40" y="186" class="small">−273 °C</text><text x="240" y="186" class="small">θ/°C</text><text x="156" y="24" class="small">p</text></g></svg>
<h3>Practical: Boyle's law and absolute zero (PAG 8)</h3>
<ul>
<li><strong>Boyle's law</strong>: trap air in a sealed syringe or tube connected to a pressure gauge. Change the volume in steps, waiting each time for the gas to return to room temperature, and record p and V. Plot p against 1/V: a straight line through the origin confirms p ∝ 1/V. Change the volume slowly so the temperature stays constant.</li>
<li><strong>Estimating absolute zero</strong>: a flask of air connected to a pressure gauge sits in a water bath. Heat the water in stages, stirring and waiting for the air to reach the water temperature each time, and record p and θ. Plot p against θ in °C and <strong>extrapolate</strong> the straight line back to p = 0. It meets the axis at about −273 °C. Keep the tubing short, so that most of the gas is at the measured temperature.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A 0.020 m³ cylinder contains gas at 2.0 × 10<sup>5</sup> Pa and 20 °C. Find the number of moles and molecules.</p>
<p>T = 293 K. n = pV/RT = (2.0 × 10<sup>5</sup> × 0.020)/(8.31 × 293) = <strong>1.6 mol</strong>.</p>
<p>N = nN<sub>A</sub> = 1.64 × 6.02 × 10<sup>23</sup> = <strong>9.9 × 10<sup>23</sup></strong> molecules.</p></div>

<h2>Kinetic theory: explaining pressure</h2>
<p>Kinetic theory explains the gas laws by treating a gas as a huge number of tiny particles bouncing around. It rests on these <strong>assumptions</strong> for an ideal gas:</p>
<ol>
<li>The gas contains a very large number of molecules, moving <strong>rapidly and randomly</strong>.</li>
<li>The <strong>volume of the molecules is negligible</strong> compared with the volume of the container.</li>
<li>All <strong>collisions are perfectly elastic</strong> (no kinetic energy is lost).</li>
<li>The <strong>time spent in collisions is negligible</strong> compared with the time between collisions.</li>
<li>There are <strong>no forces between molecules except during collisions</strong>. (So they move in straight lines between collisions, and the gas has no potential energy.)</li>
<li>Newton's laws apply to the molecules.</li>
</ol>
<h3>Deriving pV = ⅓Nm⟨c²⟩</h3>
<p>Take a cube of side L containing N molecules, each of mass m.</p>
<ol>
<li>One molecule moves with velocity component c<sub>x</sub> towards a wall. It bounces back elastically with −c<sub>x</sub>. Its change in momentum is <strong>2mc<sub>x</sub></strong>.</li>
<li>It travels 2L across the box and back before it hits the same wall again, taking time 2L/c<sub>x</sub>.</li>
<li>Average force on the wall from this one molecule = rate of change of momentum = 2mc<sub>x</sub> ÷ (2L/c<sub>x</sub>) = mc<sub>x</sub>²/L.</li>
<li>Pressure from this molecule = force/area = (mc<sub>x</sub>²/L)/L² = mc<sub>x</sub>²/L³ = mc<sub>x</sub>²/V.</li>
<li>Adding all N molecules: p = Nm⟨c<sub>x</sub>²⟩/V, where ⟨c<sub>x</sub>²⟩ is the mean of the squared x-velocities.</li>
<li>Molecules move randomly in all three directions equally, and c² = c<sub>x</sub>² + c<sub>y</sub>² + c<sub>z</sub>², so ⟨c<sub>x</sub>²⟩ = ⅓⟨c²⟩.</li>
<li>So p = Nm⟨c²⟩/3V, giving:</li>
</ol>
<div class="eqgrid"><div>pV = ⅓Nm⟨c²⟩</div></div>
<p>(Using density ρ = Nm/V, this is also p = ⅓ρ⟨c²⟩.) The molecules collide with each other too, but because those collisions are elastic and momentum is conserved, they do not change the result.</p>
<h3>Mean square and r.m.s. speed</h3>
<p>The molecules have a wide spread of speeds. ⟨c²⟩ is the <strong>mean square speed</strong>: square every speed, then take the mean. Its square root is the <strong>root mean square (r.m.s.) speed</strong>, c<sub>rms</sub> = √⟨c²⟩.</p>
<div class="wex"><p><strong>Worked example.</strong> Four molecules have speeds 300, 400, 500 and 600 m s<sup>−1</sup>.</p>
<p>Mean speed = 450 m s<sup>−1</sup>. Mean square speed = (9 + 16 + 25 + 36) × 10<sup>4</sup>/4 = 2.15 × 10<sup>5</sup> m² s<sup>−2</sup>. r.m.s. speed = √(2.15 × 10<sup>5</sup>) = <strong>464 m s<sup>−1</sup></strong>, slightly more than the mean speed.</p></div>
<p>The speeds follow a <strong>Maxwell–Boltzmann distribution</strong>: a skewed curve with a long tail at high speeds. At a higher temperature the peak moves to higher speed and the curve becomes lower and broader (the area, the total number of molecules, stays the same).</p>

<h2>Temperature and molecular kinetic energy</h2>
<p>Comparing pV = ⅓Nm⟨c²⟩ (from theory) with pV = NkT (from experiment): ⅓Nm⟨c²⟩ = NkT, so m⟨c²⟩ = 3kT, and therefore:</p>
<div class="eqgrid"><div>½m⟨c²⟩ = 3/2 kT</div></div>
<p>The <strong>mean kinetic energy of a gas molecule is directly proportional to the absolute temperature</strong>. This is what temperature really means at the molecular level. At absolute zero the mean kinetic energy would be zero.</p>
<p>The <strong>Boltzmann constant</strong> k = R/N<sub>A</sub> = 1.38 × 10<sup>−23</sup> J K<sup>−1</sup>. It plays the role of the gas constant for a single molecule (R is for a mole).</p>
<p>Different gases at the same temperature have the same mean kinetic energy, so lighter molecules move faster: c<sub>rms</sub> = √(3kT/m).</p>
<div class="wex"><p><strong>Worked example.</strong> Find the r.m.s. speed of nitrogen molecules (mass 4.65 × 10<sup>−26</sup> kg) at 300 K.</p>
<p>c<sub>rms</sub> = √(3 × 1.38 × 10<sup>−23</sup> × 300/4.65 × 10<sup>−26</sup>) = <strong>517 m s<sup>−1</sup></strong>.</p></div>
<h3>Internal energy of an ideal gas</h3>
<p>An ideal gas has no forces between its molecules, so it has <strong>no potential energy</strong>. Its internal energy is <strong>all kinetic</strong>: U = N × 3/2 kT = 3/2 nRT. So the internal energy of an ideal gas is proportional to its absolute temperature, and depends on nothing else.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when explaining pressure with kinetic theory, the chain is: molecules collide with the walls → each collision changes their momentum → force = rate of change of momentum → many collisions per second give a steady force → pressure = force/area.</p></blockquote>
`;

N['5.2']=`
<h2>Measuring angles in radians</h2>
<p>For circular motion we measure angles in <strong>radians</strong> rather than degrees, because it makes the equations much simpler.</p>
<p><strong>One radian is the angle subtended at the centre of a circle by an arc whose length equals the radius.</strong> In general, the angle in radians is θ = arc length ÷ radius = s/r, so <strong>s = rθ</strong>.</p>
<p>A whole circle has circumference 2πr, so the full angle is 2πr/r = <strong>2π rad = 360°</strong>. So π rad = 180°, π/2 rad = 90°, and 1 rad ≈ 57.3°. Make sure your calculator is in radian mode when using sin and cos with radians.</p>

<h2>Describing circular motion</h2>
<ul>
<li><strong>Period</strong> T: the time for one complete revolution.</li>
<li><strong>Frequency</strong> f: revolutions per second; f = 1/T.</li>
<li><strong>Angular velocity</strong> ω: the angle swept out per second (rad s<sup>−1</sup>). In one period it sweeps 2π, so:</li>
</ul>
<div class="eqgrid"><div>ω = 2π / T = 2πf</div><div>v = ωr</div></div>
<p>The second equation links angular velocity to the linear speed v of an object at radius r. Derivation: in one period the object travels 2πr, so v = 2πr/T = ωr. Every point on a spinning disc has the same ω, but points further out move faster.</p>
<div class="wex"><p><strong>Worked example.</strong> A washing machine drum of radius 0.25 m spins at 1200 revolutions per minute. f = 1200/60 = 20 Hz, so ω = 2π × 20 = <strong>126 rad s<sup>−1</sup></strong> and v = ωr = <strong>31 m s<sup>−1</sup></strong>.</p></div>

<h2>Centripetal acceleration</h2>
<svg class="diagram" viewBox="0 0 480 240" role="img" aria-label="Object moving in a circle; velocity tangent, acceleration and force towards centre">
<circle cx="200" cy="120" r="90" class="ax dash"/><circle cx="200" cy="120" r="4" class="dot"/>
<circle cx="264" cy="56" r="10" class="fill2 ax"/>
<line class="c1 thick" x1="264" y1="56" x2="324" y2="116" marker-end="url(#ahb)"/><text x="320" y="110" class="lbl1">v (tangent)</text>
<line class="c2 thick" x1="264" y1="56" x2="221" y2="99" marker-end="url(#aha)"/><text x="160" y="80" class="lbl2">a, F</text>
<line class="ax" x1="200" y1="120" x2="264" y2="56"/><text x="236" y="100" class="small">r</text></svg>
<p>An object moving in a circle at constant speed has a velocity that keeps changing <strong>direction</strong>. Its velocity is always along the <strong>tangent</strong> to the circle. A changing velocity means it is <strong>accelerating</strong>, even though its speed is constant.</p>
<p>The acceleration points towards the <strong>centre</strong> of the circle and is called <strong>centripetal acceleration</strong>:</p>
<div class="eqgrid"><div>a = v² / r</div><div>a = ω²r</div></div>
<h3>Where a = v²/r comes from</h3>
<p>In a short time Δt the object moves through a small angle Δθ = ωΔt. Its velocity vector, of fixed length v, turns through the same angle Δθ. For a small angle, the change in velocity Δv is a short arc of length vΔθ, pointing towards the centre. So a = Δv/Δt = vΔθ/Δt = vω. Using ω = v/r gives <strong>a = v²/r</strong>, and using v = ωr gives <strong>a = ω²r</strong>.</p>

<h2>Centripetal force</h2>
<p>By Newton's second law, an acceleration needs a resultant force in the same direction. So an object moving in a circle must have a <strong>resultant force towards the centre</strong>:</p>
<div class="eqgrid"><div>F = mv² / r</div><div>F = mω²r</div></div>
<ul>
<li>The force is always <strong>perpendicular to the velocity</strong>. Because there is no component along the direction of motion, it does <strong>no work</strong>, and the speed (and kinetic energy) stays constant. It only changes the direction.</li>
<li>"Centripetal force" is not a new kind of force. It is the name for whatever resultant force points to the centre: tension, friction, gravity, a normal contact force, or a combination. Never add "centripetal force" as an extra arrow on a free-body diagram.</li>
<li>If the force disappears (the string breaks), the object moves off in a straight line along the tangent (Newton's first law). It does not fly outwards.</li>
</ul>
<h3>Examples</h3>
<ul>
<li><strong>Car on a flat bend</strong>: friction between the tyres and road provides the centripetal force. If mv²/r is more than the maximum friction (fast, tight bend, icy road), the car skids outwards along a tangent.</li>
<li><strong>Satellite or moon</strong>: gravity provides it (topic 5.4).</li>
<li><strong>Banked track or aircraft turning</strong>: the surface (or lift force) is tilted, so its horizontal component provides the centripetal force. On a track banked at angle θ with no friction: N cos θ = mg and N sin θ = mv²/r, so <strong>tan θ = v²/rg</strong>. A conical pendulum works the same way with tension instead of N.</li>
<li><strong>Electron in a magnetic field</strong>: the magnetic force provides it (6.3).</li>
</ul>
<h3>Vertical circles</h3>
<p>For a mass whirled in a vertical circle on a string, gravity helps at the top and opposes at the bottom:</p>
<ul>
<li>At the <strong>top</strong>: both tension and weight point down, towards the centre: T + mg = mv²/r, so T = mv²/r − mg.</li>
<li>At the <strong>bottom</strong>: tension points up (to the centre), weight down: T − mg = mv²/r, so T = mv²/r + mg. The tension is <strong>greatest at the bottom</strong>, which is where the string would break.</li>
<li>The string goes slack at the top if v is too small. The <strong>minimum speed at the top</strong> is when T = 0: mg = mv²/r, so <strong>v = √(gr)</strong>. The same applies to a roller coaster loop, where the normal force replaces the tension.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A 0.50 kg ball on a 0.80 m string moves in a vertical circle at 5.0 m s<sup>−1</sup> at the bottom. Find the tension at the bottom.</p>
<p>T = mv²/r + mg = 0.50 × 25/0.80 + 0.50 × 9.81 = 15.6 + 4.9 = <strong>20.5 N</strong>.</p></div>
<div class="wex"><p><strong>Worked example.</strong> What is the maximum speed a 1200 kg car can take a flat bend of radius 40 m if the maximum friction is 7200 N?</p>
<p>mv²/r = 7200, so v = √(7200 × 40/1200) = √240 = <strong>15.5 m s<sup>−1</sup></strong>.</p></div>

<h2>Investigating circular motion</h2>
<p>Whirl a rubber bung on a string in a horizontal circle above your head. The string passes through a glass tube you hold, and hangs down to a weight of mass M below. The weight provides the tension, so Mg = mω²r = mv²/r. Put a paper clip marker on the string just below the tube to keep the radius constant. Time 10 revolutions to find T, then ω = 2π/T.</p>
<p>Change M and measure T each time: since Mg = m(4π²/T²)r, a graph of M against 1/T² is a straight line through the origin. Friction between the string and tube, and the string not being perfectly horizontal, are the main sources of error. Wear goggles and stand clear of others.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> to explain why something moving in a circle accelerates, write: its direction changes, so its velocity changes, so it accelerates; the acceleration (and the resultant force) are towards the centre.</p></blockquote>
`;

N['5.3']=`
<h2>Describing oscillations</h2>
<p>An <strong>oscillation</strong> is a repeated motion back and forth about an equilibrium position: a pendulum, a mass on a spring, a guitar string, atoms in a solid. The vocabulary is the same as for waves:</p>
<ul>
<li><strong>Displacement</strong> x: distance from the equilibrium position, in a given direction.</li>
<li><strong>Amplitude</strong> A: the maximum displacement.</li>
<li><strong>Period</strong> T: time for one complete oscillation. <strong>Frequency</strong> f = 1/T.</li>
<li><strong>Angular frequency</strong> ω = 2π/T = 2πf, in rad s<sup>−1</sup>. (One full oscillation is treated as 2π radians of a cycle.)</li>
<li><strong>Phase difference</strong>: how far one oscillation is ahead of another, as a fraction of a cycle: Δφ = 2π × (Δt/T) radians.</li>
</ul>

<h2>Simple harmonic motion</h2>
<p><strong>An object moves with simple harmonic motion (SHM) when its acceleration is directly proportional to its displacement from a fixed point, and is always directed towards that point.</strong></p>
<div class="eqgrid"><div>a = −ω²x</div></div>
<p>The minus sign says the acceleration always points back towards equilibrium (opposite to the displacement). The constant of proportionality is ω², where ω is the angular frequency. Plot a against x for SHM and you get a straight line through the origin with gradient −ω².</p>
<h3>Why a mass on a spring does SHM</h3>
<p>Pull a mass m on a spring of force constant k a distance x from equilibrium. The spring pulls it back with F = −kx (Hooke's law, restoring). So ma = −kx and a = −(k/m)x. This has the form a = −ω²x with ω² = k/m. Any system with a restoring force proportional to displacement performs SHM.</p>
<div class="eqgrid"><div>mass–spring: T = 2π√(m/k)</div><div>simple pendulum: T = 2π√(L/g)</div></div>
<p>The pendulum formula only holds for small angles (less than about 10°), where the restoring force is close to proportional to displacement. Note it does not depend on the mass of the bob.</p>

<h2>Equations of SHM</h2>
<p>The solutions to a = −ω²x are sine or cosine functions:</p>
<div class="eqgrid"><div>x = A cos ωt</div><div>x = A sin ωt</div></div>
<p>Use cos if timing starts at maximum displacement (released from x = A); use sin if timing starts at equilibrium moving in the positive direction. (ωt is in radians.)</p>
<div class="eqgrid"><div>v = ±ω√(A² − x²)</div><div>v<sub>max</sub> = ωA</div><div>a<sub>max</sub> = ω²A</div></div>
<ul>
<li>Speed is <strong>maximum at equilibrium</strong> (x = 0), where v<sub>max</sub> = ωA, and <strong>zero at the extremes</strong> (x = ±A), where the object momentarily stops and turns round.</li>
<li>Acceleration is <strong>zero at equilibrium</strong> (no restoring force there) and <strong>maximum at the extremes</strong>, a<sub>max</sub> = ω²A.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A 0.40 kg mass on a spring of k = 40 N m<sup>−1</sup> is pulled down 5.0 cm and released. Find the period, the maximum speed and the speed when x = 3.0 cm.</p>
<p>ω = √(k/m) = √(40/0.40) = 10 rad s<sup>−1</sup>. T = 2π/ω = <strong>0.63 s</strong>.</p>
<p>v<sub>max</sub> = ωA = 10 × 0.050 = <strong>0.50 m s<sup>−1</sup></strong>.</p>
<p>At x = 0.030 m: v = 10√(0.050² − 0.030²) = 10 × 0.040 = <strong>0.40 m s<sup>−1</sup></strong>.</p></div>

<h2>Graphs of SHM</h2>
<svg class="diagram" viewBox="0 0 560 270" role="img" aria-label="Displacement, velocity and acceleration against time in SHM with 90 degree phase shifts">
<g class="small"><text x="4" y="48">x</text><text x="4" y="138">v</text><text x="4" y="228">a</text></g>
<g><line class="ax" x1="20" y1="45" x2="540" y2="45"/><path class="c1" d="M20 15 C60 15 80 75 120 75 C160 75 180 15 220 15 C260 15 280 75 320 75 C360 75 380 15 420 15 C460 15 480 75 520 75"/></g>
<g><line class="ax" x1="20" y1="135" x2="540" y2="135"/><path class="c2" d="M20 135 C40 165 50 165 70 165 C100 165 110 105 170 105 C190 105 200 135 220 135 C240 165 250 165 270 165 C300 165 310 105 370 105 C390 105 400 135 420 135 C440 165 450 165 470 165 C500 165 510 105 540 105"/></g>
<g><line class="ax" x1="20" y1="225" x2="540" y2="225"/><path class="c3" d="M20 255 C60 255 80 195 120 195 C160 195 180 255 220 255 C260 255 280 195 320 195 C360 195 380 255 420 255 C460 255 480 195 520 195"/></g>
<text x="300" y="262" class="small">x = A cos ωt; v = −Aω sin ωt; a = −Aω² cos ωt</text></svg>
<ul>
<li>The <strong>velocity</strong> graph is the <strong>gradient</strong> of the displacement graph. Where x is at a peak (gradient zero), v = 0; where x crosses zero (steepest), v is maximum. Velocity is a quarter of a cycle (π/2) <strong>ahead</strong> of displacement.</li>
<li>The <strong>acceleration</strong> graph is the gradient of the velocity graph. It is the displacement graph flipped upside down: acceleration is in <strong>antiphase</strong> with displacement (π out of phase), as a = −ω²x says.</li>
</ul>

<h2>The isochronous oscillator</h2>
<p>In SHM the <strong>period does not depend on the amplitude</strong>: T depends only on ω (on m and k, or on L and g). A bigger amplitude means more distance to cover but a bigger restoring force and higher speeds, and the two effects exactly cancel. Such an oscillator is called <strong>isochronous</strong>. This is why pendulums were used to keep time in clocks: as the swings die away, the period stays the same.</p>

<h2>Investigating SHM (PAG 10)</h2>
<ul>
<li><strong>Period of a mass on a spring</strong>: time 10 or 20 oscillations with a stopwatch, using a fiducial marker (a fixed pointer at the equilibrium position) to count from, and divide. Vary m: T² = (4π²/k)m, so a graph of T² against m is a straight line with gradient 4π²/k.</li>
<li><strong>Using a data-logger</strong>: a motion sensor below the oscillating mass (or a position sensor) records displacement many times a second, giving x–t, v–t and a–t graphs directly. This removes reaction-time errors.</li>
<li><strong>Pendulum</strong>: vary L and plot T² against L. Gradient = 4π²/g. Measure L to the centre of the bob.</li>
<li>To show the oscillator is isochronous, measure T at different amplitudes and show it stays the same.</li>
</ul>

<h2>Energy in SHM</h2>
<p>During SHM, energy continually swaps between kinetic and potential (elastic potential for a spring, gravitational for a pendulum). With no damping, the total stays constant.</p>
<ul>
<li>At equilibrium: all kinetic, E<sub>k</sub> = ½mv<sub>max</sub>² = ½mω²A².</li>
<li>At the extremes: all potential.</li>
</ul>
<div class="eqgrid"><div>E<sub>total</sub> = ½mω²A²</div><div>E<sub>k</sub> = ½mω²(A² − x²)</div><div>E<sub>p</sub> = ½mω²x²</div></div>
<p>The kinetic energy formula comes from E<sub>k</sub> = ½mv² with v² = ω²(A² − x²). For a spring, ½mω²x² is the same as ½kx², since mω² = k.</p>
<p>On a graph of energy against <strong>displacement</strong>: E<sub>p</sub> is a U-shaped parabola, E<sub>k</sub> an upside-down parabola, and their sum a horizontal line. Against <strong>time</strong>, both E<sub>k</sub> and E<sub>p</sub> oscillate at <strong>twice</strong> the frequency of the oscillation (energy peaks twice per cycle) and never go negative.</p>
<p>Total energy ∝ A²: doubling the amplitude quadruples the energy.</p>

<h2>Damping</h2>
<p>A <strong>free oscillation</strong> is one where the only force is the internal restoring force: the system oscillates at its <strong>natural frequency</strong> f₀ and, in an ideal world, keeps its amplitude forever. In reality, <strong>damping</strong> forces (friction, air resistance, viscous drag) act on the oscillator and transfer its energy to the surroundings, so its amplitude decreases.</p>
<ul>
<li><strong>Light damping</strong>: the amplitude decreases gradually and exponentially (by the same fraction each cycle). The period is almost unchanged. Example: a pendulum in air.</li>
<li><strong>Critical damping</strong>: the system returns to equilibrium in the <strong>shortest possible time without oscillating</strong>. Example: car suspension, which should stop the car bouncing after a bump as quickly as possible.</li>
<li><strong>Heavy damping (over-damping)</strong>: no oscillation, but it returns to equilibrium much more slowly than with critical damping. Example: a door closer, or a pendulum in thick oil.</li>
</ul>

<h2>Forced oscillations and resonance</h2>
<p>A <strong>forced oscillation</strong> is produced when a periodic external force (the <strong>driver</strong>) makes a system oscillate. Once it settles, the system oscillates at the <strong>driving frequency</strong>, not its natural frequency. Its amplitude depends on how close the two frequencies are.</p>
<p><strong>Resonance</strong> occurs when the <strong>driving frequency equals the natural frequency</strong> of the system. The amplitude of the oscillations becomes a <strong>maximum</strong>, because the driver transfers energy to the system most efficiently. (At resonance the driver is a quarter of a cycle ahead of the displacement, so it always pushes in the direction the oscillator is moving.)</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Amplitude against driving frequency: light damping gives tall sharp peak at f0, heavier damping gives lower broader peak shifted slightly lower">
<line class="ax" x1="40" y1="190" x2="500" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 175 C150 170 220 150 250 30 C270 150 340 178 490 184"/><path class="c2" d="M40 177 C150 172 200 140 240 100 C275 135 340 175 490 185"/>
<line class="dash ax" x1="250" y1="30" x2="250" y2="190"/><text x="243" y="206" class="small">f₀</text><text x="258" y="42" class="small lbl1">light damping</text><text x="290" y="128" class="small lbl2">heavier damping</text><text x="430" y="206" class="small">driving f</text><text x="46" y="24" class="small">A</text></svg>
<p>Effect of more damping on the resonance curve: the peak amplitude is <strong>lower</strong>, the peak is <strong>broader</strong> (the system responds over a wider range of frequencies) and the peak shifts slightly <strong>below</strong> f₀. At very low driving frequencies the amplitude equals the driver's amplitude; at very high frequencies it tends to zero.</p>
<p>Practical demonstration: Barton's pendulums (several pendulums of different lengths hanging from a string driven by one heavy pendulum; only the one with the same length swings strongly), or a mass on a spring driven by a vibration generator whose frequency is slowly increased.</p>
<h3>Resonance in real life</h3>
<ul>
<li><strong>Useful</strong>: tuning a radio (the circuit resonates at the station's frequency), musical instruments (air columns and strings resonate), microwave ovens (water molecules absorb energy at a resonant frequency), MRI scanners, pushing a child on a swing at the right moments.</li>
<li><strong>Problems</strong>: bridges (the Millennium Bridge wobbled when pedestrians' footsteps matched its natural frequency; it was fixed with dampers), buildings in earthquakes (tall buildings use tuned mass dampers), rattling car panels or washing machines at certain speeds, a singer shattering a glass.</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> to show something is SHM from data, show that a ∝ −x (a straight line through the origin with negative gradient), or that the period is the same at different amplitudes.</p></blockquote>
`;

N['5.4']=`
<h2>Gravitational fields</h2>
<p>A <strong>gravitational field</strong> is a region of space in which a mass experiences a force. Every object with mass produces a field and is attracted by other masses' fields. Gravity is always attractive.</p>
<p><strong>Gravitational field strength</strong> g at a point is the <strong>force per unit mass</strong> on a small test mass placed there:</p>
<div class="eqgrid"><div>g = F / m</div></div>
<p>Unit: N kg<sup>−1</sup> (which equals m s<sup>−2</sup>, because a = F/m too: field strength equals the free-fall acceleration). Near the Earth's surface g = 9.81 N kg<sup>−1</sup>.</p>
<h3>Field lines</h3>
<ul>
<li>Field lines show the direction of the force on a mass. Arrows always point <strong>towards</strong> the mass producing the field.</li>
<li>The closer the lines, the stronger the field.</li>
<li>Around a spherical planet the field is <strong>radial</strong>: lines point to the centre and spread out with distance, so the field gets weaker further away.</li>
<li>Close to the Earth's surface (over distances small compared with Earth's radius) the lines are almost parallel and equally spaced: the field is effectively <strong>uniform</strong>, so g is constant.</li>
</ul>
<p>A spherical object of uniform density (like a planet) produces the same field outside it as a <strong>point mass</strong> at its centre with the same total mass. So distances r are always measured <strong>from the centre</strong>.</p>

<h2>Newton's law of gravitation</h2>
<p><strong>The force between two point masses is directly proportional to the product of their masses and inversely proportional to the square of their separation.</strong></p>
<div class="eqgrid"><div>F = −GMm / r²</div></div>
<p>G = 6.67 × 10<sup>−11</sup> N m² kg<sup>−2</sup> is the gravitational constant. It is tiny, which is why gravity is only noticeable when at least one mass is huge. The minus sign shows the force is attractive (it points opposite to r, which is measured outwards). In calculations you can usually work with magnitudes.</p>
<p>It is an <strong>inverse square law</strong>: double the distance and the force falls to a quarter.</p>
<p>Dividing by m gives the field strength of a point mass M:</p>
<div class="eqgrid"><div>g = −GM / r²</div></div>
<div class="wex"><p><strong>Worked example.</strong> Find g at the surface of the Earth (M = 5.97 × 10<sup>24</sup> kg, R = 6.37 × 10<sup>6</sup> m) and at the International Space Station, 400 km up.</p>
<p>At the surface: g = GM/R² = 6.67 × 10<sup>−11</sup> × 5.97 × 10<sup>24</sup>/(6.37 × 10<sup>6</sup>)² = <strong>9.81 N kg<sup>−1</sup></strong>.</p>
<p>At the ISS, r = 6.77 × 10<sup>6</sup> m: g = 8.69 N kg<sup>−1</sup>, still about 89% of the surface value. Astronauts feel weightless because they are in free fall with the station, not because there is no gravity.</p></div>
<p>Inside a planet (r &lt; R), g decreases linearly to zero at the centre, as only the mass inside radius r pulls you inwards.</p>

<h2>Kepler's laws of planetary motion</h2>
<ol>
<li><strong>Each planet moves in an ellipse, with the Sun at one focus.</strong> (Most planetary orbits are nearly circular, so we model them as circles.)</li>
<li><strong>A line joining a planet to the Sun sweeps out equal areas in equal time intervals.</strong> So a planet moves fastest when it is closest to the Sun.</li>
<li><strong>The square of the orbital period is directly proportional to the cube of the mean distance from the Sun: T² ∝ r³.</strong></li>
</ol>
<h3>Deriving the third law</h3>
<p>For a circular orbit, gravity provides the centripetal force:</p>
<p>GMm/r² = mv²/r. With v = 2πr/T: GMm/r² = m(4π²r²/T²)/r. Cancelling m and rearranging:</p>
<div class="eqgrid"><div>T² = (4π² / GM) r³</div><div>v = √(GM / r)</div></div>
<p>So T²/r³ is the same for every object orbiting the same central mass M, and the orbiting object's own mass m cancels. This gives a way to "weigh" a planet or star: measure T and r for anything orbiting it and calculate M = 4π²r³/GT². Higher orbits are slower: v ∝ 1/√r.</p><div class="vidrec" data-vid="HJ1fHPzhkZM"></div>
<div class="wex"><p><strong>Worked example.</strong> The Moon orbits Earth at r = 3.84 × 10<sup>8</sup> m with T = 27.3 days. Find the mass of the Earth.</p>
<p>T = 27.3 × 86 400 = 2.36 × 10<sup>6</sup> s. M = 4π²r³/GT² = 4π² × (3.84 × 10<sup>8</sup>)³/(6.67 × 10<sup>−11</sup> × (2.36 × 10<sup>6</sup>)²) = <strong>6.0 × 10<sup>24</sup> kg</strong>.</p></div>

<h2>Satellites</h2>
<p>A satellite is any object orbiting a larger one. Artificial satellites are used for communications, GPS navigation, weather monitoring, mapping and astronomy.</p>
<h3>Geostationary orbits</h3>
<p>A <strong>geostationary</strong> satellite stays above the same point on the Earth's surface. To do so it must:</p>
<ul>
<li>have a <strong>period of 24 hours</strong> (one sidereal day, strictly 23 h 56 min);</li>
<li>orbit <strong>above the equator</strong>;</li>
<li>move in the <strong>same direction as the Earth rotates</strong> (west to east).</li>
</ul>
<p>Using T² = (4π²/GM)r³ with T = 86 400 s gives r ≈ 4.2 × 10<sup>7</sup> m from Earth's centre (about 36 000 km above the surface). Because they do not move across the sky, dish aerials can point at them permanently: ideal for satellite TV and communications. Their great height means a time delay and weak signals.</p>
<p><strong>Low (polar) orbits</strong> are only a few hundred kilometres up, with periods around 90 minutes. As the Earth turns underneath, a polar satellite eventually passes over every part of the surface, which suits imaging, weather and spying.</p>

<h2>Gravitational potential</h2>
<p>Lifting an object away from a planet takes work, because gravity pulls it back. To compare positions we need a zero, and the natural choice is <strong>infinity</strong>, where the planet's pull has dropped to nothing.</p>
<p><strong>The gravitational potential V<sub>g</sub> at a point is the work done per unit mass to bring a small test mass from infinity to that point.</strong></p>
<div class="eqgrid"><div>V<sub>g</sub> = −GM / r</div></div>
<p>Unit: J kg<sup>−1</sup>. It is a scalar. It is <strong>negative everywhere</strong> (and zero at infinity) because gravity is attractive: a mass coming in from infinity is pulled in, so work is done <em>by</em> the field, not on it, and you would have to supply energy to take it back out. The closer to the planet, the more negative the potential.</p>
<ul>
<li>Potential falls as 1/r, more slowly than field strength (1/r²).</li>
<li><strong>Equipotentials</strong> are surfaces of constant potential: spheres around a planet, horizontal planes in a uniform field. No work is done moving along one, and field lines always cross them at right angles.</li>
<li>Field strength is minus the potential gradient: <strong>g = −ΔV<sub>g</sub>/Δr</strong>. So the gradient of a V<sub>g</sub>–r graph gives g, and the <strong>area under a g–r graph</strong> gives the change in potential between two radii.</li>
</ul>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Graphs of g and V against r for a planet of radius R">
<line class="ax" x1="40" y1="110" x2="500" y2="110" marker-end="url(#ah)"/><line class="ax" x1="40" y1="200" x2="40" y2="20" marker-end="url(#ah)"/><line class="dash ax" x1="110" y1="20" x2="110" y2="200"/><text x="104" y="124" class="small">R</text>
<path class="c1" d="M40 110 L110 30 C160 72 220 92 300 100 C380 105 440 107 490 108"/><text x="160" y="60" class="small lbl1">|g| ∝ 1/r²</text>
<path class="c2" d="M110 190 C170 150 240 130 320 122 C400 116 450 114 490 113"/><text x="200" y="168" class="small lbl2">V<tspan dy="3" font-size="9">g</tspan><tspan dy="-3"> = −GM/r</tspan></text><text x="488" y="128" class="small">r</text></svg>

<h2>Gravitational potential energy</h2>
<p>The gravitational potential energy of a mass m at a point is m times the potential there:</p>
<div class="eqgrid"><div>E = mV<sub>g</sub> = −GMm / r</div></div>
<p>The work done moving a mass between two points is the change in its potential energy, m ΔV<sub>g</sub>. It is also the <strong>area under the force–distance graph</strong> between those points.</p>
<p>Near the Earth's surface, where g is constant, the change in potential energy reduces to the familiar mgΔh. Over large distances you must use −GMm/r instead.</p>
<div class="wex"><p><strong>Worked example.</strong> How much energy is needed to lift a 1000 kg satellite from the Earth's surface to a height of 1000 km? (GM = 3.98 × 10<sup>14</sup> N m² kg<sup>−1</sup>, R = 6.37 × 10<sup>6</sup> m)</p>
<p>ΔE = GMm(1/r₁ − 1/r₂) = 3.98 × 10<sup>14</sup> × 1000 × (1/6.37 × 10<sup>6</sup> − 1/7.37 × 10<sup>6</sup>) = <strong>8.5 × 10<sup>9</sup> J</strong>.</p>
<p>(Using mgh would give 9.8 × 10<sup>9</sup> J: too much, because g gets weaker with height.)</p></div>

<h2>Escape velocity</h2>
<p><strong>Escape velocity</strong> is the minimum speed an object must be given at a planet's surface to escape its gravitational field completely (reach infinity), with no further propulsion. Its kinetic energy must be at least enough to raise its potential energy from −GMm/r to zero:</p>
<p>½mv² = GMm/r, so</p>
<div class="eqgrid"><div>v<sub>esc</sub> = √(2GM / r)</div></div>
<p>It does not depend on the mass of the object. For Earth, v<sub>esc</sub> ≈ 11.2 km s<sup>−1</sup>. In practice rockets do not need to reach this speed at the surface because their engines keep pushing them. A black hole is an object whose escape velocity exceeds the speed of light (5.5).</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> always measure r from the centre of the planet. If a question gives the height above the surface, add the planet's radius first.</p></blockquote>
`;

N['5.5']=`
<h2>Objects in the universe</h2>
<ul>
<li><strong>Planet</strong>: an object that orbits a star, has enough mass for its own gravity to pull it into a (nearly) spherical shape, has cleared its orbit of most other objects, and has no nuclear fusion. (Pluto fails the "cleared its orbit" test, so it is a dwarf planet.)</li>
<li><strong>Planetary satellite</strong>: a body that orbits a planet, such as a moon (or an artificial satellite).</li>
<li><strong>Comet</strong>: a small, irregular body of ice, dust and small pieces of rock, in a highly elliptical orbit around the Sun. Near the Sun its ice evaporates to form a tail, which always points away from the Sun.</li>
<li><strong>Solar system</strong>: a star together with all the objects that orbit it (planets, dwarf planets, moons, asteroids, comets).</li>
<li><strong>Galaxy</strong>: a huge collection of stars, dust and gas (and dark matter) held together by gravity. Our galaxy, the Milky Way, has about 10<sup>11</sup> stars. There are about 10<sup>11</sup> galaxies in the observable universe.</li>
<li><strong>Interstellar medium</strong>: the gas (mostly hydrogen and helium) and dust between the stars in a galaxy. Dense clouds of it are called nebulae.</li>
</ul>

<h2>How stars form</h2>
<ol>
<li>A dense cloud of gas and dust (a <strong>nebula</strong>) starts to collapse under its own gravity, perhaps triggered by a nearby supernova shock wave.</li>
<li>As it collapses, <strong>gravitational potential energy is transferred to kinetic energy</strong> of the particles, so the gas heats up. The dense, hot core is a <strong>protostar</strong>.</li>
<li>When the core becomes hot enough (about 10<sup>7</sup> K) and dense enough, hydrogen nuclei move fast enough to overcome their electrostatic repulsion and <strong>fuse into helium</strong>, releasing huge amounts of energy.</li>
<li>The star is now on the <strong>main sequence</strong>. It is stable because the outward pressure from the hot gas and radiation (produced by fusion) <strong>balances</strong> the inward pull of gravity. Stars spend about 90% of their lives here. The Sun has been on the main sequence for 4.6 billion years and has about 5 billion to go.</li>
</ol>

<h2>The death of stars</h2>
<p>When the hydrogen in the core runs out, fusion there stops, the pressure drops, and gravity wins: the core collapses. What happens next depends on the star's mass (M<sub>☉</sub> = one solar mass).</p>
<h3>Low-mass stars (about 0.5 M<sub>☉</sub> to 10 M<sub>☉</sub>), like the Sun</h3>
<ol>
<li>The core contracts and heats up. Hydrogen continues to fuse in a shell around the core. The outer layers <strong>expand and cool</strong>: the star becomes a <strong>red giant</strong>.</li>
<li>The core becomes hot enough to fuse helium into carbon and oxygen.</li>
<li>Eventually the outer layers drift away, forming a glowing <strong>planetary nebula</strong>.</li>
<li>The hot, dense core left behind is a <strong>white dwarf</strong>: about the size of the Earth, very hot but dim, with no fusion. It slowly cools.</li>
</ol>
<p>What stops a white dwarf collapsing further? <strong>Electron degeneracy pressure</strong>. The <strong>Pauli exclusion principle</strong> says no two electrons can be in the same quantum state. When matter is squeezed this hard, the electrons are forced into higher and higher energy states, and they resist further compression. This pressure can only support a core up to the <strong>Chandrasekhar limit</strong> of about <strong>1.44 M<sub>☉</sub></strong>. Above this, electron degeneracy pressure is not enough.</p>
<h3>Massive stars (more than about 10 M<sub>☉</sub>)</h3>
<ol>
<li>When core hydrogen runs out, the star swells into a <strong>red supergiant</strong>.</li>
<li>Its core is hot enough to fuse heavier and heavier elements (carbon, neon, oxygen, silicon) in shells like an onion, up to <strong>iron</strong>. Fusing iron does not release energy, so fusion stops.</li>
<li>The core suddenly collapses. The outer layers fall in, rebound and are blasted outwards in a <strong>supernova</strong>, briefly as bright as a whole galaxy. Elements heavier than iron are made in the explosion and scattered into space (the material in your body was made in stars).</li>
<li>If the remaining core is more than 1.44 M<sub>☉</sub>, electrons and protons are squeezed together into neutrons: a <strong>neutron star</strong>, only about 20 km across but denser than an atomic nucleus.</li>
<li>If the core is more than about 3 M<sub>☉</sub>, nothing can stop the collapse: it becomes a <strong>black hole</strong>, an object so dense that its escape velocity is greater than the speed of light, so not even light can escape.</li>
</ol>

<h2>The Hertzsprung–Russell diagram</h2>
<svg class="diagram" viewBox="0 0 520 300" role="img" aria-label="Hertzsprung-Russell diagram: luminosity against temperature (decreasing to the right) with main sequence diagonal, red giants top right, white dwarfs bottom left">
<line class="ax" x1="60" y1="270" x2="500" y2="270" marker-end="url(#ah)"/><line class="ax" x1="60" y1="270" x2="60" y2="20" marker-end="url(#ah)"/>
<text x="10" y="30" class="small">L/L☉</text><text x="70" y="290" class="small">40 000 K</text><text x="250" y="290" class="small">temperature</text><text x="440" y="290" class="small">2500 K</text>
<text x="30" y="60" class="small">10⁴</text><text x="40" y="150" class="small">1</text><text x="30" y="250" class="small">10⁻⁴</text>
<path class="msband" d="M80 40 C180 90 300 170 470 250 L460 262 C300 186 170 108 70 54 Z"/><text x="230" y="140" class="small">main sequence</text>
<ellipse class="giantz" cx="400" cy="90" rx="70" ry="30"/><text x="370" y="94" class="small">red giants</text>
<ellipse class="giantz" cx="380" cy="40" rx="80" ry="14"/><text x="340" y="44" class="small">supergiants</text>
<ellipse class="dwarfz" cx="150" cy="235" rx="55" ry="18"/><text x="110" y="239" class="small">white dwarfs</text>
<circle cx="285" cy="160" r="6" class="sun"/><text x="295" y="164" class="small">Sun</text></svg>
<p>The HR diagram plots stars' <strong>luminosity</strong> (total power output, relative to the Sun) against their <strong>surface temperature</strong>. Two oddities: temperature <strong>increases to the left</strong>, and both axes are logarithmic.</p>
<ul>
<li><strong>Main sequence</strong>: a diagonal band from hot, bright, massive stars (top left, blue) to cool, dim, low-mass stars (bottom right, red). A star stays at one point on it while it fuses hydrogen.</li>
<li><strong>Red giants and supergiants</strong>: top right. Cool (so red) but very luminous, so they must be huge (see Stefan's law below).</li>
<li><strong>White dwarfs</strong>: bottom left. Hot but dim, so they must be tiny.</li>
</ul>
<p>Evolution paths: a Sun-like star moves from the main sequence up and right to the red giant region, then down and left to the white dwarf region.</p>

<h2>Energy levels and spectra</h2>
<p>Electrons in an <strong>isolated</strong> atom (as in a low-pressure gas) can only have certain <strong>discrete energy levels</strong>. They cannot have energies in between. Each element has its own unique set of levels.</p>
<ul>
<li>The energies are <strong>negative</strong>. Zero is defined as the energy of an electron that has just escaped from the atom (ionisation). A bound electron has less energy than that, so its energy is negative. The lowest level, the <strong>ground state</strong>, is the most negative.</li>
<li>An electron moves <strong>up</strong> a level (excitation) by absorbing exactly the right amount of energy, for example from a photon or a collision.</li>
<li>An electron moves <strong>down</strong> a level (de-excitation) by emitting a single photon whose energy equals the difference between the levels:</li>
</ul>
<div class="eqgrid"><div>hf = ΔE</div><div>hc/λ = E₁ − E₂</div></div>
<p>Because only certain energy differences exist, only certain photon frequencies are emitted or absorbed. That is why spectra show lines.</p>
<div class="wex"><p><strong>Worked example.</strong> In hydrogen an electron drops from −1.51 eV to −3.40 eV. Find the wavelength of the photon emitted.</p>
<p>ΔE = 1.89 eV = 1.89 × 1.60 × 10<sup>−19</sup> = 3.02 × 10<sup>−19</sup> J.</p>
<p>λ = hc/ΔE = 6.63 × 10<sup>−34</sup> × 3.00 × 10<sup>8</sup>/3.02 × 10<sup>−19</sup> = <strong>6.6 × 10<sup>−7</sup> m</strong> (656 nm, the red line of hydrogen).</p></div>
<h3>Three types of spectrum</h3>
<ul>
<li><strong>Continuous spectrum</strong>: all wavelengths in a smooth band. Produced by a hot, dense object (a filament lamp, the dense interior of a star).</li>
<li><strong>Emission line spectrum</strong>: <strong>bright lines on a dark background</strong>. Produced by a hot, low-pressure gas: its excited electrons drop down and emit only particular wavelengths.</li>
<li><strong>Absorption line spectrum</strong>: <strong>dark lines on a continuous spectrum</strong>. Produced when white light passes through a cooler gas: the gas absorbs photons of exactly the right energies to excite its electrons. They are re-emitted in random directions, so those wavelengths are missing from the beam. Starlight shows absorption lines from the star's cooler outer atmosphere.</li>
</ul>
<p>Each element's lines are at the same wavelengths in emission and absorption, like a fingerprint. Matching the lines in a star's spectrum to laboratory spectra tells us which elements it contains. (Helium was discovered in the Sun this way before it was found on Earth.)</p>
<h3>Measuring wavelengths with a diffraction grating</h3>
<p>Spectral lines are measured with a diffraction grating (see 4.4): <strong>d sin θ = nλ</strong>, where d = 1/(lines per metre). Each wavelength is diffracted to a different angle, so the lines are spread out and their angles measured precisely.</p>

<h2>Black-body radiation: temperature and size of stars</h2>
<p>A <strong>black body</strong> is an ideal object that absorbs all radiation falling on it and emits a continuous spectrum that depends only on its temperature. Stars are close to black bodies. The graph of intensity against wavelength is a hump, which peaks at a wavelength λ<sub>max</sub>. Hotter objects emit more at every wavelength and peak at shorter wavelengths.</p>
<h3>Wien's displacement law</h3>
<div class="eqgrid"><div>λ<sub>max</sub> ∝ 1/T</div><div>λ<sub>max</sub>T = 2.9 × 10<sup>−3</sup> m K</div></div>
<p>So a star's colour tells you its surface temperature: the Sun (5800 K) peaks at about 500 nm; red stars are cooler (around 3000 K); blue stars are hotter (over 10 000 K).</p>
<h3>Stefan's law</h3>
<div class="eqgrid"><div>L = 4πr²σT⁴</div></div>
<p>The <strong>luminosity</strong> L (total power emitted, in W) depends on the surface area 4πr² and the fourth power of the surface temperature. σ = 5.67 × 10<sup>−8</sup> W m<sup>−2</sup> K<sup>−4</sup> is the Stefan constant. Doubling T increases L sixteen times.</p>
<div class="wex"><p><strong>Worked example: the radius of a star.</strong> A star's spectrum peaks at 420 nm and its luminosity is 1.5 × 10<sup>28</sup> W. Find its radius.</p>
<p>Wien: T = 2.9 × 10<sup>−3</sup>/420 × 10<sup>−9</sup> = 6900 K.</p>
<p>Stefan: r = √(L/4πσT⁴) = √(1.5 × 10<sup>28</sup>/(4π × 5.67 × 10<sup>−8</sup> × 6900⁴)) = <strong>3.0 × 10<sup>9</sup> m</strong> (about four times the Sun's radius).</p></div>
<p>This explains the HR diagram: red giants are cool but very luminous, so r must be huge; white dwarfs are hot but dim, so r must be tiny.</p>

<h2>Astronomical distances</h2>
<ul>
<li><strong>Astronomical unit (AU)</strong>: the mean distance from the Earth to the Sun, 1.50 × 10<sup>11</sup> m.</li>
<li><strong>Light-year (ly)</strong>: the distance travelled by light in a vacuum in one year, 9.46 × 10<sup>15</sup> m.</li>
<li><strong>Parsec (pc)</strong>: the distance at which a star has a parallax angle of one arcsecond; 1 pc = 3.1 × 10<sup>16</sup> m ≈ 3.26 ly.</li>
</ul>
<h3>Stellar parallax</h3>
<p>As the Earth orbits the Sun, a nearby star seems to shift position against the background of much more distant stars, just as your thumb seems to jump when you look at it with one eye then the other. Measure the star's position six months apart (opposite sides of the orbit). The <strong>parallax angle</strong> p is half the total angular shift: the angle the radius of Earth's orbit (1 AU) subtends at the star.</p>
<div class="eqgrid"><div>p = 1/d</div></div>
<p>with p in <strong>arcseconds</strong> and d in <strong>parsecs</strong>. (1 arcsecond = 1/3600 of a degree.) Closer stars have bigger parallax angles. Parallax only works out to a few thousand parsecs, beyond which the angles are too small to measure.</p>

<h2>The Doppler effect and redshift</h2>
<p>When a source of waves moves away from you, each wave is emitted from a little further away, so the waves arrive stretched out: the observed wavelength is longer and the frequency lower. For light, this shifts spectral lines towards the red end: <strong>redshift</strong>. A source moving towards you is <strong>blueshifted</strong>.</p>
<div class="eqgrid"><div>Δλ/λ ≈ Δf/f ≈ v/c</div></div>
<p>v is the speed of the source along the line of sight (valid for v much less than c). Δλ is the shift in wavelength and λ is the wavelength the line has in the laboratory.</p>
<div class="wex"><p><strong>Worked example.</strong> A hydrogen line at 656.3 nm in the lab is observed at 662.9 nm in a galaxy. Find its recession speed.</p>
<p>v = c × Δλ/λ = 3.00 × 10<sup>8</sup> × 6.6/656.3 = <strong>3.0 × 10<sup>6</sup> m s<sup>−1</sup></strong>, moving away.</p></div>

<h2>The expanding universe</h2>
<h3>The cosmological principle</h3>
<p><strong>On a large scale, the universe is homogeneous (evenly spread out) and isotropic (looks the same in every direction), and the laws of physics are the same everywhere.</strong> We are not in a special place.</p>
<h3>Hubble's law</h3>
<p>Hubble measured the redshifts and distances of galaxies and found that (almost) all are moving away from us, and <strong>the recession velocity of a galaxy is directly proportional to its distance</strong>:</p>
<div class="eqgrid"><div>v ≈ H₀d</div></div>
<p>H₀ is the Hubble constant, about 70 km s<sup>−1</sup> Mpc<sup>−1</sup> ≈ 2.2 × 10<sup>−18</sup> s<sup>−1</sup>. To convert: divide by the number of km in a Mpc (3.1 × 10<sup>19</sup>).</p>
<p>Interpretation: <strong>space itself is expanding</strong>, carrying the galaxies with it. Every galaxy sees every other moving away, like dots on an inflating balloon, so there is no centre. Galaxies twice as far away recede twice as fast.</p>
<h3>The age of the universe</h3>
<p>If the galaxies have always moved at constant speeds, they were all together at one point a time t ago, where t = d/v = d/H₀d:</p>
<div class="eqgrid"><div>t ≈ 1/H₀</div></div>
<p>With H₀ = 2.2 × 10<sup>−18</sup> s<sup>−1</sup>, t ≈ 4.5 × 10<sup>17</sup> s ≈ 14 billion years. The accepted figure is 13.8 billion years.</p>

<h2>The Big Bang</h2>
<p><strong>The Big Bang theory</strong>: the universe (space and time) began about 13.8 billion years ago from an extremely hot, dense state, and has been expanding and cooling ever since. It was not an explosion into empty space; space itself has been stretching.</p>
<h3>Evidence</h3>
<ul>
<li><strong>Hubble's law and galactic redshift</strong>: the universe is expanding, so it must once have been much smaller and denser.</li>
<li><strong>The cosmic microwave background (CMB)</strong>: microwave radiation reaching us almost equally from every direction, with a black-body spectrum at about <strong>2.7 K</strong>. It was released about 380 000 years after the Big Bang, when the universe had cooled enough (to about 3000 K) for atoms to form, so photons could travel freely. The expansion of space since then has stretched its wavelength from infrared to microwaves. Its near-perfect uniformity supports the cosmological principle; its tiny variations were the seeds of galaxies.</li>
<li>The observed amounts of hydrogen (about 75%) and helium (about 25%) match predictions of fusion in the first few minutes.</li>
</ul>
<h3>The evolution of the universe</h3>
<ol>
<li>First instants: extremely hot; the four fundamental forces become separate. A very rapid expansion (inflation).</li>
<li>Quarks, leptons and their antiparticles form from energy. Matter slightly outnumbers antimatter.</li>
<li>About 10<sup>−6</sup> s: quarks combine into hadrons, including protons and neutrons.</li>
<li>First few minutes: protons and neutrons fuse into light nuclei, mainly helium (nucleosynthesis).</li>
<li>About 380 000 years: electrons combine with nuclei to form neutral atoms; the universe becomes transparent (the CMB is released).</li>
<li>Hundreds of millions of years: gravity pulls gas together to form the first stars and galaxies. Heavier elements are made in stars and supernovae.</li>
</ol>

<h2>Dark matter and dark energy</h2>
<ul>
<li><strong>Dark matter</strong>: stars in the outer parts of spiral galaxies orbit much faster than expected. If all the mass were the visible stars and gas, concentrated near the centre, the orbital speed v = √(GM/r) should fall with distance. Instead, <strong>galaxy rotation curves are flat</strong>: v stays roughly constant far out. There must be a lot of extra, invisible mass spread through and around galaxies. It does not emit or absorb light, and we do not know what it is.</li>
<li><strong>Dark energy</strong>: observations of distant supernovae (1998) show that the expansion of the universe is <strong>accelerating</strong>. Something is pushing space apart; we call it dark energy, but its nature is unknown.</li>
</ul>
<p>Current estimates: about 5% of the universe is ordinary matter, about 27% dark matter and about 68% dark energy.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when describing star evolution, always say what supports the star at each stage (radiation pressure from fusion on the main sequence; electron degeneracy pressure in a white dwarf; neutron degeneracy in a neutron star) and give the mass limits.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
