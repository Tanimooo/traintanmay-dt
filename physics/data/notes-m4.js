/* Full topic notes, Module 4: Electrons, waves and photons. Replaces the short notes in m4.js (loaded after it). */
(function(){
const N={};

N['4.1']=`
<h2>Electric charge</h2>
<p>Charge is a property of particles, like mass. It comes in two types, positive and negative: like charges repel and unlike charges attract. In atoms, protons carry positive charge, electrons carry negative charge and neutrons are neutral. An object becomes charged by gaining electrons (negative) or losing them (positive). Protons stay locked in nuclei, so in everyday charging it is always electrons that move.</p>
<p>The unit of charge is the <strong>coulomb</strong> (C), defined from current: <strong>1 C is the charge that passes a point in a circuit when a current of 1 A flows for 1 s</strong>.</p>
<h3>Charge is quantised</h3>
<p>The smallest free charge is the <strong>elementary charge</strong>, <strong>e = 1.60 × 10<sup>−19</sup> C</strong>, the size of the charge on a proton or electron. An electron has charge −e and a proton +e. Any object's net charge Q must be a whole-number multiple of e: Q = ±ne. You cannot have half an electron's worth. (Quarks have charges of ±⅓e and ±⅔e, but they are never found on their own.)</p>
<div class="wex"><p><strong>Worked example.</strong> How many electrons must be removed from a sphere to give it a charge of +4.8 nC?</p>
<p>n = Q/e = 4.8 × 10<sup>−9</sup>/1.60 × 10<sup>−19</sup> = <strong>3.0 × 10<sup>10</sup> electrons</strong>.</p></div>

<h2>Electric current</h2>
<p><strong>Electric current is the rate of flow of charge.</strong></p>
<div class="eqgrid"><div>I = ΔQ / Δt</div></div>
<p>The unit is the ampere (A), one of the S.I. base units; 1 A = 1 C s<sup>−1</sup>. Rearranged, ΔQ = IΔt, so the <strong>area under a current–time graph is the charge</strong> that has flowed (very useful for capacitors in 6.1).</p>
<p>Current is measured with an <strong>ammeter</strong> connected in <strong>series</strong>, so the same current flows through it. An ideal ammeter has zero resistance.</p>
<h3>What carries the current</h3>
<ul>
<li>In <strong>metals</strong> the charge carriers are <strong>free (delocalised) electrons</strong>. Each metal atom gives up one or more outer electrons, which wander freely through the lattice of positive ions.</li>
<li>In <strong>electrolytes</strong> (molten or dissolved ionic compounds) the charge carriers are <strong>ions</strong>: positive ions move one way and negative ions the other. Both contribute to the current.</li>
<li>In semiconductors, electrons and "holes" (gaps left by electrons, which behave like positive charges) carry the current.</li>
</ul>
<h3>Conventional current and electron flow</h3>
<p>Before electrons were discovered, current was taken to flow from the positive terminal to the negative terminal. We still use this <strong>conventional current</strong> direction on circuit diagrams. In a metal wire the electrons actually move the opposite way, from − to +. In an electrolyte, positive ions move in the direction of conventional current.</p>

<h2>Kirchhoff's first law</h2>
<p><strong>The sum of the currents entering any point (junction) in a circuit equals the sum of the currents leaving that point.</strong></p>
<svg class="diagram" viewBox="0 0 460 170" role="img" aria-label="Junction: 5 A in splits into 3 A and 2 A">
<line class="wire" x1="40" y1="85" x2="220" y2="85" marker-end="url(#ah)"/><line class="wire" x1="220" y1="85" x2="400" y2="30" marker-end="url(#ah)"/><line class="wire" x1="220" y1="85" x2="400" y2="140" marker-end="url(#ah)"/><circle cx="220" cy="85" r="5" class="dot"/>
<text x="90" y="75">5.0 A</text><text x="320" y="40">3.0 A</text><text x="320" y="145">2.0 A</text></svg>
<p>This is a statement of <strong>conservation of charge</strong>. Charge cannot be created, destroyed or stored at a junction, so every coulomb that arrives each second must leave each second. Consequences: the current is the same at every point in a series circuit, and the branch currents in a parallel circuit add up to the supply current.</p>

<h2>Mean drift velocity</h2>
<p>Free electrons in a metal move randomly at very high speeds (around 10<sup>5</sup> m s<sup>−1</sup>), but with no p.d. these random motions cancel and there is no net flow. Applying a p.d. adds a small average velocity along the wire, the <strong>mean drift velocity</strong> v.</p>
<h3>Deriving I = Anev</h3>
<p>Take a wire of cross-sectional area A containing n free electrons per cubic metre (the <strong>number density</strong>), each of charge e, drifting at speed v.</p>
<ol>
<li>In time Δt, each electron moves a distance vΔt. So every electron in a length vΔt of wire passes a given point.</li>
<li>That length of wire has volume A × vΔt and contains n × AvΔt electrons.</li>
<li>Charge passing the point: ΔQ = nAvΔt × e.</li>
<li>Current I = ΔQ/Δt = <strong>Anev</strong>.</li>
</ol>
<div class="eqgrid"><div>I = Anev</div></div>
<p>(For other charge carriers, replace e with the carrier's charge q.)</p>
<div class="wex"><p><strong>Worked example.</strong> A copper wire of cross-sectional area 1.0 mm² carries 2.0 A. Copper has n = 8.5 × 10<sup>28</sup> m<sup>−3</sup>. Find the drift velocity.</p>
<p>v = I/(Ane) = 2.0/(1.0 × 10<sup>−6</sup> × 8.5 × 10<sup>28</sup> × 1.60 × 10<sup>−19</sup>) = <strong>1.5 × 10<sup>−4</sup> m s<sup>−1</sup></strong>, about 0.15 mm per second.</p></div>
<p>If drift is so slow, why does a lamp come on instantly? Because the wire is already full of free electrons. When the circuit is closed, the electric field travels through the wire at nearly the speed of light and sets <em>all</em> the electrons drifting at once, including those already inside the lamp.</p>
<p>If a wire narrows, the current must be the same in both parts (Kirchhoff's first law). With the same n and e, a smaller A means a <strong>larger drift velocity</strong> in the thin section.</p>

<h2>Conductors, semiconductors and insulators</h2>
<p>From I = Anev, for the same wire size and drift velocity the current depends on n. Materials differ hugely in how many free charge carriers they have:</p>
<div class="tbl"><table><tr><th>Material</th><th>n / m<sup>−3</sup> (roughly)</th><th>Behaviour</th></tr>
<tr><td>Conductor (copper, metals)</td><td>10<sup>28</sup>–10<sup>29</sup></td><td>Conducts easily. n is essentially fixed.</td></tr>
<tr><td>Semiconductor (silicon, germanium)</td><td>10<sup>15</sup>–10<sup>17</sup> at room temperature</td><td>Conducts a little. n rises sharply as temperature rises (or when light falls on it), so its resistance falls. Used in thermistors and LDRs.</td></tr>
<tr><td>Insulator (plastic, glass)</td><td>very small (≈ 10<sup>5</sup> or less)</td><td>Almost no current. Electrons are tightly bound to their atoms.</td></tr></table></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> when comparing two wires in series, start from "the current is the same in both" and then use I = Anev to compare v. Students often wrongly assume the drift velocity is the same.</p></blockquote>
`;

N['4.2']=`
<h2>Circuit symbols</h2>
<p>You need to recognise and draw: cell, battery, d.c. and a.c. power supply, switch, filament lamp, fixed resistor, variable resistor, potentiometer, ammeter, voltmeter, fuse, diode, LED, NTC thermistor, light-dependent resistor (LDR), capacitor and earth. Draw circuits with a ruler, with straight wires and no gaps.</p>

<h2>Potential difference and e.m.f.</h2>
<p>A circuit is a way of moving energy. Charges pick up energy in the source and give it up in the components. Both potential difference and electromotive force measure energy transferred <strong>per unit charge</strong>, and both are measured in volts, where <strong>1 V = 1 J C<sup>−1</sup></strong>. The difference is the <em>direction</em> of the energy transfer:</p>
<ul>
<li><strong>Potential difference (p.d.)</strong> V across a component is the energy transferred <strong>from electrical energy to other forms</strong> (heat, light, motion) per unit charge passing through it: <strong>W = VQ</strong>.</li>
<li><strong>Electromotive force (e.m.f.)</strong> ε of a source is the energy transferred <strong>from other forms</strong> (chemical, mechanical, light) <strong>to electrical energy</strong> per unit charge passing through it: <strong>W = εQ</strong>.</li>
</ul>
<p>So a 9 V battery gives each coulomb 9 J; a lamp with 6 V across it takes 6 J from each coulomb that passes through. The volt: <strong>1 V is the p.d. across a component when 1 J of energy is transferred per coulomb of charge passing through it</strong>.</p>
<p>P.d. is measured with a <strong>voltmeter</strong> connected in <strong>parallel</strong> across the component. An ideal voltmeter has infinite resistance, so it draws no current.</p>

<h2>Accelerating charged particles</h2>
<p>An electron accelerated through a p.d. V has work eV done on it, which becomes kinetic energy:</p>
<div class="eqgrid"><div>eV = ½mv²</div></div>
<p>This is how electron guns work (in old TV tubes, electron microscopes and the electron diffraction tube of topic 4.5). It leads to a convenient unit of energy, the <strong>electronvolt</strong>: the energy gained by an electron accelerated through a p.d. of 1 V. <strong>1 eV = 1.60 × 10<sup>−19</sup> J</strong>.</p>
<div class="wex"><p><strong>Worked example.</strong> Find the speed of an electron accelerated from rest through 2000 V.</p>
<p>KE = eV = 1.60 × 10<sup>−19</sup> × 2000 = 3.2 × 10<sup>−16</sup> J.</p>
<p>v = √(2KE/m) = √(2 × 3.2 × 10<sup>−16</sup>/9.11 × 10<sup>−31</sup>) = <strong>2.7 × 10<sup>7</sup> m s<sup>−1</sup></strong> (about 9% of the speed of light).</p></div>

<h2>Resistance and Ohm's law</h2>
<p><strong>Resistance</strong> is defined by</p>
<div class="eqgrid"><div>R = V / I</div></div>
<p>The unit is the ohm: <strong>1 Ω is the resistance of a component when a p.d. of 1 V drives a current of 1 A through it</strong>. In a metal, resistance arises because the drifting electrons keep colliding with the vibrating positive ions of the lattice, transferring energy to them (which is why wires heat up).</p>
<p><strong>Ohm's law: for a metallic conductor at constant temperature (and other physical conditions), the current is directly proportional to the p.d. across it.</strong> A component that obeys this is <strong>ohmic</strong>: its I–V graph is a straight line through the origin and R is constant. R = V/I always defines resistance, but only ohmic components have a constant R.</p>

<h2>I–V characteristics</h2>
<p>An I–V characteristic shows how the current through a component changes with the p.d. across it. To measure one, use a variable supply or a potential divider, with an ammeter in series and a voltmeter in parallel; reverse the supply connections to get negative values (PAG 3.2). R at any point = V/I at that point (<em>not</em> the gradient).</p>
<svg class="diagram" viewBox="0 0 580 200" role="img" aria-label="I-V characteristics for a resistor, filament lamp and diode">
<g><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="95" y1="180" x2="95" y2="20"/><line class="c1" x1="20" y1="170" x2="170" y2="30"/><text x="40" y="195" class="small">ohmic resistor</text><text x="170" y="95" class="small">V</text><text x="100" y="28" class="small">I</text></g>
<g transform="translate(195 0)"><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="95" y1="180" x2="95" y2="20"/><path class="c1" d="M20 160 C40 150 60 140 75 125 C85 115 90 108 95 100 C100 92 105 85 115 75 C130 60 150 50 170 40"/><text x="40" y="195" class="small">filament lamp</text></g>
<g transform="translate(390 0)"><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="80" y1="180" x2="80" y2="20"/><path class="c1" d="M15 100 L120 100 C130 98 135 85 140 60 L148 25"/><text x="40" y="195" class="small">diode / LED</text><text x="110" y="115" class="small">≈0.6 V</text></g></svg>
<ul>
<li><strong>Fixed resistor</strong> (at constant temperature): straight line through the origin. Ohmic.</li>
<li><strong>Filament lamp</strong>: the graph curves, getting flatter at higher p.d., so the resistance increases. Why: a bigger current heats the filament; the metal ions vibrate with greater amplitude, so the electrons collide with them more often, and the resistance rises. The graph is symmetrical because the lamp works the same in either direction.</li>
<li><strong>Diode</strong>: lets current flow in one direction only. In <strong>reverse bias</strong> the resistance is extremely high and the current is effectively zero. In <strong>forward bias</strong> almost no current flows until a <strong>threshold p.d.</strong> (about 0.6 V for a silicon diode), after which the resistance falls rapidly and the current rises steeply.</li>
<li><strong>Light-emitting diode (LED)</strong>: a diode that emits light when it conducts in forward bias. Its threshold p.d. is higher, about 1.5–3.5 V, and depends on the colour (bluer light needs a bigger p.d., see 4.5). Always used with a series resistor to limit the current.</li>
</ul>

<h2>Thermistors and LDRs</h2>
<p>Both are made from <strong>semiconductors</strong>, in which energy (heat or light) frees more charge carriers, so n increases and the resistance decreases.</p>
<ul>
<li><strong>NTC thermistor</strong> (negative temperature coefficient): resistance <strong>decreases</strong> as temperature increases, steeply and non-linearly. Used in temperature sensors.</li>
<li><strong>LDR</strong>: resistance <strong>decreases</strong> as light intensity increases. Typically about 1 MΩ in darkness and a few hundred ohms in bright light. Used in light sensors (street lights, cameras).</li>
</ul>
<p>Investigating a thermistor: put it in a beaker of water with a thermometer, heat the water in stages and measure the resistance with an ohmmeter (or V/I) at each temperature, stirring and waiting for the reading to settle each time.</p>

<h2>Resistivity</h2>
<p>The resistance of a wire depends on its size as well as its material. A longer wire means more collisions (R ∝ L); a thicker wire means more paths side by side (R ∝ 1/A). So:</p>
<div class="eqgrid"><div>R = ρL / A</div></div>
<p>The constant ρ is the <strong>resistivity</strong> of the material, in <strong>Ω m</strong>. It is a property of the material (at a given temperature), not of the particular wire. Copper is about 1.7 × 10<sup>−8</sup> Ω m; nichrome about 1.1 × 10<sup>−6</sup> Ω m; silicon about 10<sup>3</sup> Ω m; insulators 10<sup>10</sup> Ω m or more.</p>
<div class="wex"><p><strong>Worked example.</strong> Find the resistance of 5.0 m of copper wire of diameter 0.40 mm.</p>
<p>A = π(0.20 × 10<sup>−3</sup>)² = 1.26 × 10<sup>−7</sup> m². R = 1.7 × 10<sup>−8</sup> × 5.0/1.26 × 10<sup>−7</sup> = <strong>0.68 Ω</strong>.</p></div>
<h3>Measuring resistivity (PAG 3.1)</h3>
<ol>
<li>Tape a length of resistance wire (such as constantan) along a metre rule. Connect a crocodile clip at the zero end and a second, sliding clip at a length L.</li>
<li>Measure V and I for several lengths (an ohmmeter can also be used) and calculate R = V/I.</li>
<li>Measure the diameter with a micrometer in several places and directions; take the mean and calculate A = πd²/4.</li>
<li>Plot R against L. The gradient is ρ/A, so <strong>ρ = gradient × A</strong>.</li>
</ol>
<p>Keep the current small and switch off between readings, so the wire does not heat up (which would change ρ). Contact resistance at the clips gives a small y-intercept but does not affect the gradient.</p>
<h3>How resistivity changes with temperature</h3>
<ul>
<li><strong>Metals</strong>: n is fixed. Heating makes the ions vibrate more, so electrons collide more often: resistivity <strong>increases</strong> with temperature (roughly linearly).</li>
<li><strong>Semiconductors</strong>: heating also increases vibrations, but more importantly it frees many more charge carriers. The big increase in n outweighs the extra collisions, so resistivity <strong>decreases</strong> with temperature. This is how an NTC thermistor works.</li>
</ul>

<h2>Electrical power and energy</h2>
<p>Power is the rate of energy transfer. Since V is energy per coulomb and I is coulombs per second, P = V × I gives joules per second. Substituting V = IR gives the other two forms:</p>
<div class="eqgrid"><div>P = VI</div><div>P = I²R</div><div>P = V²/R</div><div>W = VIt</div></div>
<p>Choose the form that uses what you know. P = I²R shows that power wasted heating a cable rises with the <em>square</em> of the current, which is why the National Grid transmits at very high voltage and low current.</p>
<div class="wex"><p><strong>Worked example.</strong> A 230 V, 2.3 kW kettle: find the current and the resistance of its element.</p>
<p>I = P/V = 2300/230 = <strong>10 A</strong>. R = V/I = 230/10 = <strong>23 Ω</strong> (or V²/P = 230²/2300 = 23 Ω).</p></div>
<h3>The kilowatt-hour</h3>
<p>Electricity companies charge for energy in <strong>kilowatt-hours</strong>. 1 kW h is the energy transferred by a 1 kW device in 1 hour: 1000 W × 3600 s = <strong>3.6 × 10<sup>6</sup> J</strong>. It is a unit of energy, not power.</p>
<p>Energy (kW h) = power (kW) × time (h). Cost = energy in kW h × price per kW h.</p>
<div class="wex"><p><strong>Worked example.</strong> A 2.5 kW heater runs for 3 hours a day for 30 days at 28p per kW h. Energy = 2.5 × 3 × 30 = 225 kW h. Cost = 225 × 28p = <strong>£63</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> e.m.f. and p.d. definitions must mention "energy transferred per unit charge" <em>and</em> the direction of transfer (into or out of electrical energy). That second part is what separates them.</p></blockquote>
`;

N['4.3']=`
<h2>Kirchhoff's laws</h2>
<p>Two rules let you work out the current and p.d. anywhere in a circuit.</p>
<ul>
<li><strong>First law</strong> (from 4.1): the sum of currents into a junction equals the sum out. This is conservation of <strong>charge</strong>.</li>
<li><strong>Second law: in any closed loop of a circuit, the sum of the e.m.f.s equals the sum of the p.d.s.</strong> This is conservation of <strong>energy</strong>. Each coulomb that goes round a complete loop gains energy in the sources (the e.m.f.s) and must give all of it up in the components (the p.d.s), returning to where it started with the same energy.</li>
</ul>
<p>Consequences for simple circuits:</p>
<div class="tbl"><table><tr><th></th><th>Series</th><th>Parallel</th></tr>
<tr><td>Current</td><td>The same through every component</td><td>Splits between branches; branch currents add to the total</td></tr>
<tr><td>P.d.</td><td>Shared: p.d.s add up to the supply e.m.f.</td><td>The same across every branch</td></tr>
<tr><td>Total resistance</td><td>R = R₁ + R₂ + R₃ ...</td><td>1/R = 1/R₁ + 1/R₂ + 1/R₃ ...</td></tr></table></div>

<h2>Resistors in series and parallel: derivations</h2>
<h3>Series</h3>
<p>The same current I flows through each resistor. By Kirchhoff's second law the total p.d. V = V₁ + V₂ + V₃. Dividing by I: V/I = V₁/I + V₂/I + V₃/I, so <strong>R = R₁ + R₂ + R₃</strong>.</p>
<h3>Parallel</h3>
<p>Each resistor has the same p.d. V across it. By Kirchhoff's first law the total current I = I₁ + I₂ + I₃. Dividing by V: I/V = I₁/V + I₂/V + I₃/V, so <strong>1/R = 1/R₁ + 1/R₂ + 1/R₃</strong>.</p>
<p>Adding a resistor in parallel always <em>lowers</em> the total resistance (it gives the current another path), and the total is always less than the smallest single resistor. Two equal resistors R in parallel give R/2. For just two resistors, R = R₁R₂/(R₁ + R₂) ("product over sum").</p>
<div class="wex"><p><strong>Worked example: a mixed circuit.</strong> A 12 V supply (no internal resistance) is connected to a 4.0 Ω resistor in series with a parallel pair of 6.0 Ω and 12 Ω. Find the current from the supply and the current in the 12 Ω resistor.</p>
<p>Parallel pair: 1/R = 1/6 + 1/12 = 3/12, so R = 4.0 Ω. Total R = 4.0 + 4.0 = 8.0 Ω.</p>
<p>Supply current I = 12/8.0 = <strong>1.5 A</strong>.</p>
<p>P.d. across the parallel pair = 1.5 × 4.0 = 6.0 V. Current in 12 Ω = 6.0/12 = <strong>0.50 A</strong> (and 1.0 A in the 6.0 Ω, which adds to 1.5 A, as it should).</p></div>
<h3>Strategy for circuit problems</h3>
<ol>
<li>Reduce parallel groups to single equivalent resistors, then add the series parts to get the total resistance.</li>
<li>Find the total current from I = ε/R<sub>total</sub>.</li>
<li>Work back out: use V = IR on each series part, then share the current in parallel branches.</li>
<li>Check that your currents obey the first law and your p.d.s obey the second law.</li>
</ol>

<h2>Circuits with more than one e.m.f.</h2>
<p>When there are several sources, you cannot simply combine resistors. Instead apply Kirchhoff's second law around each loop:</p>
<ol>
<li>Label a current in each branch with an arrow (guess the direction; a negative answer just means it flows the other way).</li>
<li>Use the first law at junctions to reduce the number of unknown currents.</li>
<li>Go round a loop in one direction. An e.m.f. counts as positive if you go through it from − to +, negative otherwise. A p.d. IR counts as positive if you go through the resistor in the direction of your current arrow, negative if against it.</li>
<li>Set (sum of e.m.f.s) = (sum of IR terms) for as many loops as you have unknowns, and solve the simultaneous equations.</li>
</ol>
<p>Two cells connected in series the same way round add their e.m.f.s; connected back to back (opposing), they subtract.</p>

<h2>Internal resistance</h2>
<p>Real sources are not perfect. Charges moving through a battery meet resistance from the chemicals inside it. This <strong>internal resistance</strong> r wastes some of the energy as heat inside the source, which is why batteries get warm when they supply big currents.</p>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="Cell with internal resistance r connected to external resistor R">
<rect x="40" y="40" width="200" height="110" rx="6" class="dash ax"/><text x="48" y="60" class="small">cell</text>
<line class="wire" x1="80" y1="95" x2="110" y2="95"/><line class="ax thick" x1="110" y1="75" x2="110" y2="115"/><line class="ax thick" x1="122" y1="85" x2="122" y2="105"/><line class="wire" x1="122" y1="95" x2="150" y2="95"/>
<rect x="150" y="85" width="50" height="20" class="fill2 ax"/><line class="wire" x1="200" y1="95" x2="280" y2="95"/><line class="wire" x1="80" y1="95" x2="20" y2="95"/>
<text x="110" y="135">ε</text><text x="168" y="125">r</text>
<line class="wire" x1="280" y1="95" x2="480" y2="95"/><line class="wire" x1="480" y1="95" x2="480" y2="180"/><line class="wire" x1="20" y1="95" x2="20" y2="180"/><line class="wire" x1="20" y1="180" x2="480" y2="180"/>
<rect x="320" y="170" width="70" height="20" class="fill2 ax"/><text x="350" y="166">R</text>
<text x="290" y="85" class="small">terminal p.d. V = ε − Ir</text></svg>
<p>Model the source as a perfect e.m.f. ε in series with a resistor r. Applying Kirchhoff's second law to the loop:</p>
<div class="eqgrid"><div>ε = I(R + r)</div><div>ε = V + Ir</div></div>
<ul>
<li><strong>Terminal p.d.</strong> V = IR: the p.d. across the source's terminals, which is what is available to the external circuit.</li>
<li><strong>Lost volts</strong> = Ir: the energy per coulomb wasted inside the source.</li>
</ul>
<p>So V = ε − Ir. The more current you draw, the more volts are lost and the lower the terminal p.d. With no current (an open circuit, or measured with a high-resistance voltmeter) there are no lost volts and V = ε. This is why car headlights dim when the starter motor (which draws a huge current) is running.</p>
<ul>
<li>A car battery must have a <strong>very low</strong> internal resistance so it can supply the 100+ A a starter motor needs without losing most of its e.m.f.</li>
<li>A high-voltage supply (an EHT supply in a lab) is deliberately given a <strong>very high</strong> internal resistance, so that if someone touches it the current is limited to a safe value.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A battery of e.m.f. 9.0 V and internal resistance 0.50 Ω is connected to a 4.0 Ω resistor. Find the current, terminal p.d. and power wasted inside the battery.</p>
<p>I = ε/(R + r) = 9.0/4.5 = <strong>2.0 A</strong>. V = IR = 2.0 × 4.0 = <strong>8.0 V</strong>. Lost volts = 1.0 V.</p>
<p>Power wasted = I²r = 2.0² × 0.50 = <strong>2.0 W</strong>.</p></div>
<h3>Measuring ε and r (PAG 3)</h3>
<p>Connect the cell in series with a variable resistor and an ammeter, with a voltmeter across the cell's terminals. Vary the resistance and record pairs of V and I. A small fixed resistor in series protects the cell from too large a current.</p>
<p>Rearrange to y = mx + c: <strong>V = −rI + ε</strong>. Plot V (y-axis) against I (x-axis). The graph is a straight line with <strong>y-intercept = ε</strong> and <strong>gradient = −r</strong>.</p>
<p>Switch off between readings: a cell's internal resistance changes as it warms up and as it runs down.</p>

<h2>Potential dividers</h2>
<p>A potential divider is two (or more) resistors in series across a supply. The supply p.d. is shared between them in proportion to their resistances, so you can take off any fraction of the supply p.d. you want.</p>
<svg class="diagram" viewBox="0 0 400 220" role="img" aria-label="Potential divider: a cell of e.m.f. Vin across two resistors in series, with Vout across R2">
<line class="wire" x1="80" y1="20" x2="80" y2="102"/><line class="wire" x1="62" y1="102" x2="98" y2="102"/><line class="wire thick" x1="70" y1="114" x2="90" y2="114" style="stroke-width:5"/><line class="wire" x1="80" y1="114" x2="80" y2="200"/><text x="102" y="98" class="small">+</text><line class="wire" x1="80" y1="20" x2="200" y2="20"/><line class="wire" x1="80" y1="200" x2="200" y2="200"/>
<line class="wire" x1="200" y1="20" x2="200" y2="40"/><rect x="190" y="40" width="20" height="55" class="fill2 ax"/><line class="wire" x1="200" y1="95" x2="200" y2="125"/><rect x="190" y="125" width="20" height="55" class="fill2 ax"/><line class="wire" x1="200" y1="180" x2="200" y2="200"/>
<line class="wire" x1="200" y1="110" x2="320" y2="110"/><line class="wire" x1="200" y1="200" x2="320" y2="200"/><circle cx="320" cy="110" r="4" class="dot"/><circle cx="320" cy="200" r="4" class="dot"/>
<text x="220" y="72">R₁</text><text x="220" y="158">R₂</text><text x="330" y="160">V<tspan dy="3" font-size="10">out</tspan></text><text x="22" y="113">V<tspan dy="3" font-size="10">in</tspan></text></svg>
<p><strong>Derivation.</strong> The same current flows through both: I = V<sub>in</sub>/(R₁ + R₂). The p.d. across R₂ is V<sub>out</sub> = IR₂, so:</p>
<div class="eqgrid"><div>V<sub>out</sub> = R₂/(R₁ + R₂) × V<sub>in</sub></div><div>V₁/V₂ = R₁/R₂</div></div>
<p>The bigger resistor gets the bigger share of the p.d.</p>
<div class="wex"><p><strong>Worked example.</strong> R₁ = 2.2 kΩ and R₂ = 3.3 kΩ across a 6.0 V supply. V<sub>out</sub> = 3.3/5.5 × 6.0 = <strong>3.6 V</strong>.</p></div>
<h3>Sensing circuits</h3>
<p>Replace one resistor with a sensor whose resistance changes:</p>
<ul>
<li><strong>Light sensor</strong>: an LDR in the R₂ position. As light intensity increases, R<sub>LDR</sub> falls, so it takes a smaller share: V<sub>out</sub> across the LDR <strong>falls</strong>. So V<sub>out</sub> is high in the dark, which suits a circuit that switches a street light on at night. Swap the LDR and the fixed resistor and V<sub>out</sub> rises with brightness instead. Always say which component V<sub>out</sub> is across.</li>
<li><strong>Temperature sensor</strong>: an NTC thermistor. As temperature rises its resistance falls, so the p.d. across it falls and the p.d. across the fixed resistor rises.</li>
<li>Replacing the fixed resistor with a <strong>variable resistor</strong> lets you set the light level or temperature at which the output reaches a particular value (the switching point).</li>
</ul>
<h3>The potentiometer</h3>
<p>A potentiometer is a single resistor with a sliding contact. It acts as a potential divider whose ratio you can vary smoothly, giving any output from 0 to V<sub>in</sub>. That is why it is used to vary the p.d. when measuring I–V characteristics (a variable resistor in series cannot take the p.d. down to zero).</p>
<blockquote class="tip"><p><strong>Loading effect:</strong> connecting a load across V<sub>out</sub> puts it in parallel with R₂, lowering the resistance of that section, so V<sub>out</sub> drops. A voltmeter used to measure V<sub>out</sub> must have a resistance much larger than R₂.</p></blockquote>
`;

N['4.4']=`
<h2>What a progressive wave is</h2>
<p>A <strong>progressive wave</strong> is an oscillation that travels through a medium (or through a vacuum, for electromagnetic waves), <strong>transferring energy from one place to another without transferring matter</strong>. Each particle of the medium just oscillates about its fixed rest position, passing the disturbance on to its neighbours.</p>
<h3>Transverse and longitudinal waves</h3>
<ul>
<li><strong>Transverse</strong>: the oscillations are <strong>perpendicular</strong> to the direction of energy transfer. Examples: all electromagnetic waves, waves on a string, water ripples (approximately), S-waves in earthquakes.</li>
<li><strong>Longitudinal</strong>: the oscillations are <strong>parallel</strong> to the direction of energy transfer. Particles bunch up in <strong>compressions</strong> and spread out in <strong>rarefactions</strong>. Examples: sound, ultrasound, P-waves in earthquakes, a slinky pushed back and forth.</li>
</ul>
<p>Sound needs a medium (it cannot travel through a vacuum). Electromagnetic waves do not need one.</p>

<h2>Describing waves</h2>
<ul>
<li><strong>Displacement</strong> x or s: distance and direction of a point from its rest position.</li>
<li><strong>Amplitude</strong> A: the maximum displacement from the rest position.</li>
<li><strong>Wavelength</strong> λ: the minimum distance between two points oscillating in phase (for example crest to crest).</li>
<li><strong>Period</strong> T: the time for one complete oscillation of a point on the wave.</li>
<li><strong>Frequency</strong> f: the number of oscillations per second (wavelengths passing a point per second), in hertz. <strong>f = 1/T</strong>.</li>
<li><strong>Wave speed</strong> v: the distance travelled by the wave per unit time.</li>
<li><strong>Phase difference</strong>: how far one oscillation is ahead of or behind another, as a fraction of a cycle, in degrees or radians.</li>
</ul>
<h3>The wave equation</h3>
<p>In one period T the wave moves forward exactly one wavelength λ. So speed = distance/time = λ/T = fλ.</p>
<div class="eqgrid"><div>v = fλ</div><div>f = 1/T</div></div>
<p>When a wave passes into a new medium, its <strong>frequency stays the same</strong> (it is fixed by the source), so if the speed changes, the wavelength changes in proportion.</p>
<h3>Wave graphs</h3>
<svg class="diagram" viewBox="0 0 560 190" role="img" aria-label="Displacement-distance graph showing amplitude and wavelength">
<line class="ax" x1="20" y1="95" x2="540" y2="95" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M20 95 C55 15 95 15 130 95 C165 175 205 175 240 95 C275 15 315 15 350 95 C385 175 425 175 460 95 C480 50 500 40 520 50"/>
<line class="dimline" x1="75" y1="95" x2="75" y2="36" marker-end="url(#ah)"/><text x="80" y="64" class="small">A</text>
<line class="dimline" x1="75" y1="20" x2="295" y2="20" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="175" y="16" class="small">λ</text>
<text x="525" y="114" class="small">x</text><text x="26" y="20" class="small">s</text></svg>
<ul>
<li>A <strong>displacement–distance</strong> graph is a snapshot of the whole wave at one instant. Distance between repeats = <strong>wavelength</strong>.</li>
<li>A <strong>displacement–time</strong> graph follows one point over time. Time between repeats = <strong>period</strong>.</li>
</ul>
<p>For a longitudinal wave, the displacement–distance graph still looks like a sine curve: positive displacement means moved to the right (say), negative to the left. Compressions are where particles on either side have moved towards each other.</p>
<h3>Phase difference</h3>
<p>For two points a distance d apart along a wave: <strong>phase difference = (d/λ) × 360°</strong> (or × 2π radians). Points one whole wavelength apart are <strong>in phase</strong> (0° or 360°). Points half a wavelength apart are in <strong>antiphase</strong> (180° or π rad): they always move in opposite directions.</p>

<h2>Reflection, refraction, diffraction</h2>
<p>All waves can do these. A <strong>ripple tank</strong> is the classic way to see them: a vibrating bar makes straight (plane) waves in shallow water, lit from above so the crests show as bright lines on paper underneath.</p>
<ul>
<li><strong>Reflection</strong>: the wave bounces off a boundary. Angle of incidence = angle of reflection (measured from the normal). Wavelength and frequency do not change.</li>
<li><strong>Refraction</strong>: the wave changes speed as it enters a different medium (or, in a ripple tank, different depth of water). If it meets the boundary at an angle, it changes direction. Frequency stays the same; wavelength changes. Waves bend towards the normal when they slow down.</li>
<li><strong>Diffraction</strong>: the wave spreads out after passing through a gap or around an obstacle. The spreading is greatest when the gap is about the same size as the wavelength. A much wider gap gives very little spreading. Diffraction does not change wavelength, frequency or speed. It is why you can hear round corners (sound wavelengths are about 1 m) but not see round them (light wavelengths are about 500 nm).</li>
</ul>

<h2>Intensity</h2>
<p><strong>Intensity is the radiant power passing through a surface per unit area</strong>, at right angles to the direction the wave travels.</p>
<div class="eqgrid"><div>I = P / A</div><div>I ∝ amplitude²</div></div>
<p>The unit is W m<sup>−2</sup>. A point source radiating power P equally in all directions spreads it over a sphere of area 4πr², so <strong>I = P/4πr²</strong>: intensity falls with the square of distance (the inverse square law). Doubling the distance quarters the intensity.</p>
<p>Intensity is proportional to the <strong>square of the amplitude</strong>: double the amplitude and the intensity is four times as big. (The energy of an oscillation goes as amplitude squared, like ½kx² for a spring.)</p>
<div class="wex"><p><strong>Worked example.</strong> A 60 W lamp radiates 5% of its power as light. Find the light intensity 2.0 m away.</p>
<p>I = 0.05 × 60/(4π × 2.0²) = 3.0/50.3 = <strong>0.060 W m<sup>−2</sup></strong>.</p></div>

<h2>The electromagnetic spectrum</h2>
<div class="emspec"><span style="--h:0">radio<br><small>&gt; 10⁻¹ m</small></span><span style="--h:1">microwave<br><small>10⁻¹–10⁻³ m</small></span><span style="--h:2">infrared<br><small>10⁻³–7×10⁻⁷</small></span><span style="--h:3">visible<br><small>700–400 nm</small></span><span style="--h:4">UV<br><small>10⁻⁷–10⁻⁸</small></span><span style="--h:5">X-ray<br><small>10⁻⁸–10⁻¹³</small></span><span style="--h:6">gamma<br><small>10⁻¹⁰–10⁻¹⁶</small></span></div>
<p>Properties shared by all electromagnetic waves:</p>
<ul>
<li>They travel at <strong>c = 3.00 × 10<sup>8</sup> m s<sup>−1</sup></strong> in a vacuum.</li>
<li>They are <strong>transverse</strong>: oscillating electric and magnetic fields, at right angles to each other and to the direction of travel.</li>
<li>They can be reflected, refracted, diffracted, polarised and can interfere.</li>
<li>They do not need a medium.</li>
</ul>
<p>Going from radio to gamma, wavelength decreases and frequency (and photon energy, 4.5) increases. Know the order and approximate wavelengths, especially visible light: about <strong>400 nm (violet) to 700 nm (red)</strong>. X-rays and gamma rays overlap in wavelength: they are named by their source (X-rays from fast electrons being decelerated, gamma rays from unstable nuclei).</p>
<p>Uses and effects: radio (communication), microwaves (cooking, mobile phones, radar, satellite links), infrared (heating, remote controls, thermal imaging), visible (sight, optical fibres), UV (sterilising, tanning; can damage skin), X-rays (medical imaging, 6.5), gamma (cancer treatment, sterilising equipment). UV, X-rays and gamma are ionising.</p>

<h2>Polarisation</h2>
<p>In an unpolarised transverse wave (light from the Sun or a bulb), the oscillations occur in all planes perpendicular to the direction of travel. A <strong>plane polarised</strong> wave oscillates in <strong>one plane only</strong>.</p>
<ul>
<li>A <strong>polarising filter</strong> only lets through oscillations in one plane. Unpolarised light through one filter comes out plane polarised, at half the intensity.</li>
<li>A second filter (the analyser) at 90° to the first blocks the light completely ("crossed polarisers"). Rotating it through 360° gives two maxima and two minima.</li>
<li>Only <strong>transverse</strong> waves can be polarised. Longitudinal waves already oscillate along their direction of travel, so there is nothing to filter. That is how we know light is transverse and sound is longitudinal.</li>
<li>Light reflected from water, glass or a road surface is <strong>partially polarised</strong>; polarising sunglasses cut out this glare.</li>
<li><strong>Microwaves</strong> from a lab transmitter are already plane polarised. Rotating a metal grille between transmitter and receiver changes the signal: the signal is at a minimum when the rods are <strong>parallel</strong> to the plane of the electric field oscillations (the rods absorb that energy) and a maximum when they are perpendicular. TV aerials must be lined up with the polarisation of the broadcast signal for the same reason.</li>
</ul>
<p>(Malus's law, I = I₀cos²θ for light through a second filter at angle θ, is useful in PAG 6.3 but is not required.)</p>

<h2>Refraction of light</h2>
<p>Light slows down when it enters a material. The <strong>refractive index</strong> n of a material is</p>
<div class="eqgrid"><div>n = c / v</div><div>n₁ sin θ₁ = n₂ sin θ₂</div></div>
<p>where v is the speed of light in the material. n has no unit; for a vacuum (and very nearly for air) n = 1; for glass about 1.5; for water 1.33; for diamond 2.4. The second equation is <strong>Snell's law</strong>: angles θ are measured from the <strong>normal</strong>. Light entering a material with a higher n (slower) bends <strong>towards</strong> the normal; leaving into a lower n, it bends <strong>away</strong>.</p>
<div class="wex"><p><strong>Worked example.</strong> Light passes from air into glass (n = 1.50) at 40° to the normal. Find the angle of refraction and the speed in glass.</p>
<p>1.00 × sin 40° = 1.50 × sin θ, so sin θ = 0.429 and θ = <strong>25°</strong>.</p>
<p>v = c/n = 3.00 × 10<sup>8</sup>/1.50 = <strong>2.00 × 10<sup>8</sup> m s<sup>−1</sup></strong>.</p></div>
<h3>Total internal reflection</h3>
<p>When light travels from a <strong>higher</strong> to a <strong>lower</strong> refractive index (glass to air), it bends away from the normal. As the angle of incidence increases, the refracted ray bends closer to the surface. At the <strong>critical angle C</strong> the refracted ray runs along the boundary (angle of refraction 90°). Beyond it, no light refracts out: all of it is reflected. This is <strong>total internal reflection</strong> (TIR).</p>
<p>Conditions for TIR: (1) light is travelling towards a lower refractive index, and (2) the angle of incidence is greater than the critical angle.</p>
<p>Putting θ₂ = 90° into Snell's law: n₁ sin C = n₂ × 1, so sin C = n₂/n₁. Into air (n₂ = 1):</p>
<div class="eqgrid"><div>sin C = 1 / n</div></div>
<p>For glass with n = 1.50, C = sin<sup>−1</sup>(1/1.50) = 42°.</p>
<h3>Optical fibres</h3>
<p>An optical fibre has a thin glass <strong>core</strong> surrounded by <strong>cladding</strong> of slightly <strong>lower</strong> refractive index. Light entering the core hits the core–cladding boundary at more than the critical angle and is totally internally reflected again and again, so it travels along the fibre even round gentle bends. The cladding protects the core from scratches (which would let light escape) and stops signals crossing between touching fibres. Uses: telecommunications (carrying data as light pulses) and endoscopes (6.5).</p>

<h2>Superposition and interference</h2>
<p><strong>The principle of superposition: when two or more waves meet at a point, the resultant displacement is the sum of the individual displacements.</strong></p>
<ul>
<li><strong>Constructive interference</strong>: the waves arrive <strong>in phase</strong> (crest meets crest). The amplitudes add, giving a bigger oscillation.</li>
<li><strong>Destructive interference</strong>: the waves arrive in <strong>antiphase</strong> (crest meets trough). They cancel; if their amplitudes are equal the result is zero.</li>
</ul>
<h3>Path difference</h3>
<p>If two sources oscillate in phase, whether the waves arrive in phase at a point depends on the <strong>path difference</strong>: how much further one wave has travelled than the other.</p>
<div class="tbl"><table><tr><th></th><th>Path difference</th><th>Phase difference</th></tr>
<tr><td>Constructive (maximum)</td><td>0, λ, 2λ ... = nλ</td><td>0, 360° ... (0, 2π ...)</td></tr>
<tr><td>Destructive (minimum)</td><td>½λ, 1½λ ... = (n + ½)λ</td><td>180°, 540° ... (π, 3π ...)</td></tr></table></div>
<h3>Coherence</h3>
<p>To see a steady interference pattern, the two sources must be <strong>coherent</strong>: they have a <strong>constant phase difference</strong> (which means they must also have the same frequency). Two separate light bulbs are not coherent, as each emits light in random short bursts. A laser is coherent, and splitting one wave into two (with two slits, or two speakers driven by the same signal generator) makes coherent sources.</p>
<h3>Demonstrating interference</h3>
<ul>
<li><strong>Sound</strong>: two loudspeakers connected to the same signal generator. Walking across in front of them, you hear alternate loud and quiet regions.</li>
<li><strong>Microwaves</strong>: a transmitter aimed at a metal plate with two slits a few centimetres apart. Moving a receiver along a line beyond the slits finds alternate maxima and minima.</li>
<li><strong>Water waves</strong>: two dippers on the same vibrating bar in a ripple tank produce a pattern of calm lines (destructive) and rough lines (constructive) spreading out.</li>
</ul>

<h2>Young's double-slit experiment</h2>
<svg class="diagram" viewBox="0 0 560 220" role="img" aria-label="Young's double slit: laser, double slit separation a, screen distance D, fringe separation x">
<rect x="20" y="95" width="40" height="30" rx="3" class="fill2 ax"/><text x="18" y="145" class="small">laser</text><line class="c1" x1="60" y1="110" x2="150" y2="110"/>
<line class="ax thick" x1="150" y1="20" x2="150" y2="100"/><line class="ax thick" x1="150" y1="105" x2="150" y2="115"/><line class="ax thick" x1="150" y1="120" x2="150" y2="200"/>
<text x="122" y="214" class="small">slits a</text>
<line class="ax thick" x1="500" y1="20" x2="500" y2="200"/>
<g class="fringes"><rect x="505" y="30" width="22" height="10"/><rect x="505" y="58" width="22" height="10"/><rect x="505" y="86" width="22" height="10"/><rect x="505" y="114" width="22" height="10"/><rect x="505" y="142" width="22" height="10"/><rect x="505" y="170" width="22" height="10"/></g>
<line class="c2 dash" x1="150" y1="102" x2="500" y2="63"/><line class="c2 dash" x1="150" y1="118" x2="500" y2="63"/>
<line class="dimline" x1="150" y1="210" x2="500" y2="210" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="320" y="206" class="small">D</text>
<line class="dimline" x1="540" y1="63" x2="540" y2="91" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="545" y="81" class="small">x</text></svg>
<p>Laser light shines on two narrow slits a small distance a apart (typically 0.1–0.5 mm). Each slit diffracts the light so the two beams overlap, and because they come from the same laser they are coherent. On a screen a distance D away (a few metres) you see equally spaced bright and dark <strong>fringes</strong>.</p>
<div class="eqgrid"><div>λ = ax / D</div></div>
<p>x is the <strong>fringe separation</strong>: the distance between the centres of adjacent bright fringes. The equation applies when D is much larger than a and x.</p>
<ul>
<li>Bright fringes: path difference from the two slits = nλ. Dark fringes: (n + ½)λ.</li>
<li>To reduce uncertainty: measure across many fringes (say 10 fringe spacings) and divide; use a large D so x is bigger.</li>
<li><strong>Safety</strong>: never look into the laser beam or its reflections; use a low-power laser and point it away from people.</li>
<li>Historically, Young's experiment (1801) was key evidence that light behaves as a <strong>wave</strong>: particles could not produce dark fringes by cancelling.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Slits 0.40 mm apart; screen 2.5 m away; 10 fringe spacings measure 38 mm. Find the wavelength.</p>
<p>x = 38/10 = 3.8 mm. λ = ax/D = (0.40 × 10<sup>−3</sup> × 3.8 × 10<sup>−3</sup>)/2.5 = <strong>6.1 × 10<sup>−7</sup> m</strong> (610 nm, orange-red).</p></div>
<h3>Diffraction gratings</h3>
<p>A diffraction grating has hundreds of slits per millimetre. Light from all the slits interferes to give very sharp, bright maxima at angles θ given by</p>
<div class="eqgrid"><div>d sin θ = nλ</div></div>
<p>where d is the slit spacing (d = 1/number of lines per metre) and n is the order (0 straight through, 1, 2 ...). The maximum order is the largest whole number below d/λ (since sin θ cannot exceed 1). Gratings give much sharper, more widely spaced maxima than a double slit, so wavelengths can be measured more precisely. White light gives a spectrum in each order, with red diffracted most.</p>

<h2>Stationary (standing) waves</h2>
<p>A <strong>stationary wave</strong> forms when <strong>two progressive waves with the same frequency (and similar amplitude) travelling in opposite directions superpose</strong>. Usually a wave reflects off a fixed end and meets itself coming back.</p>
<ul>
<li><strong>Nodes</strong>: points that never move (zero amplitude). The two waves always cancel there.</li>
<li><strong>Antinodes</strong>: points of maximum amplitude, halfway between nodes.</li>
<li><strong>Separation between adjacent nodes</strong> (or adjacent antinodes) = <strong>λ/2</strong>, where λ is the wavelength of the progressive waves.</li>
</ul>
<div class="tbl"><table><tr><th></th><th>Progressive wave</th><th>Stationary wave</th></tr>
<tr><td>Energy</td><td>transferred along the wave</td><td>not transferred: stored</td></tr>
<tr><td>Amplitude</td><td>the same for all points</td><td>varies with position: zero at nodes, maximum at antinodes</td></tr>
<tr><td>Phase</td><td>changes continuously along the wave</td><td>all points between two adjacent nodes are in phase; points either side of a node are in antiphase</td></tr>
<tr><td>Wavelength</td><td>distance between adjacent points in phase</td><td>twice the distance between adjacent nodes</td></tr></table></div>
<h3>Strings fixed at both ends</h3>
<p>Both fixed ends must be nodes. So the string must hold a whole number of half-wavelengths: <strong>L = nλ/2</strong>. The simplest pattern, with one loop, is the <strong>fundamental</strong> or <strong>first harmonic</strong>: λ = 2L and f₁ = v/2L. The higher harmonics have frequencies 2f₁, 3f₁, 4f₁ ... A string only forms stationary waves at these resonant frequencies.</p>
<svg class="diagram" viewBox="0 0 560 300" role="img" aria-label="Harmonics on a string fixed at both ends and in a pipe closed at one end">
<text x="10" y="18" class="small">string fixed both ends: L = nλ/2</text>
<g transform="translate(0 30)"><line class="ax" x1="20" y1="30" x2="260" y2="30"/><path class="c1" d="M20 30 Q140 -10 260 30"/><path class="c1 dash" d="M20 30 Q140 70 260 30"/><text x="270" y="34" class="small">1st harmonic λ = 2L</text></g>
<g transform="translate(0 95)"><line class="ax" x1="20" y1="30" x2="260" y2="30"/><path class="c1" d="M20 30 Q80 -10 140 30 Q200 70 260 30"/><path class="c1 dash" d="M20 30 Q80 70 140 30 Q200 -10 260 30"/><text x="270" y="34" class="small">2nd harmonic λ = L</text></g>
<text x="10" y="200" class="small">pipe closed at one end: L = (2n − 1)λ/4, odd harmonics only</text>
<g transform="translate(0 215)"><rect x="20" y="10" width="240" height="40" class="ax"/><line class="ax thick" x1="20" y1="10" x2="20" y2="50"/><path class="c2" d="M20 30 Q140 30 260 6"/><path class="c2" d="M20 30 Q140 30 260 54"/><text x="270" y="34" class="small">fundamental λ = 4L (N at closed end, A at open end)</text></g></svg>
<p>Practical: a string runs over a pulley to a hanging mass, with a vibration generator near the other end driven by a signal generator. Increase the frequency slowly from low and note each frequency at which a clear pattern appears (a "stationary wave on a string" or Melde's experiment).</p>
<h3>Air columns</h3>
<p>Sound waves in pipes form stationary waves too. A <strong>closed end</strong> is a <strong>node</strong> (the air cannot move); an <strong>open end</strong> is an <strong>antinode</strong>.</p>
<ul>
<li><strong>Pipe closed at one end</strong>: node at one end, antinode at the other. Fundamental: L = λ/4, so λ = 4L. Only <strong>odd</strong> harmonics are possible: L = λ/4, 3λ/4, 5λ/4 ..., frequencies f₁, 3f₁, 5f₁ ...</li>
<li><strong>Pipe open at both ends</strong>: antinodes at both ends. Fundamental: L = λ/2. All harmonics are possible.</li>
</ul>
<h3>Measuring the speed of sound with a resonance tube (PAG 5.2)</h3>
<p>Hold a vibrating tuning fork of known frequency f over the top of a tube standing in water. Raise the tube until the sound is loudest: the first resonance, with an air column length L₁. Raise it further to find the second resonance, L₂. The air column acts as a pipe closed at one end.</p>
<p>The antinode is actually slightly above the open end (the <strong>end correction</strong>), but it cancels in the difference: L₂ − L₁ = λ/2, so <strong>λ = 2(L₂ − L₁)</strong> and v = fλ.</p>
<h3>Microwaves</h3>
<p>A microwave transmitter aimed at a metal plate: the reflected wave superposes with the incoming wave to form a stationary wave. Moving a probe receiver along the line between them finds nodes and antinodes. Distance between adjacent nodes = λ/2. Measure across several nodes for accuracy, then f = c/λ.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> "explain how a stationary wave forms" needs three things: the wave is reflected; two waves of the same frequency travel in opposite directions; they superpose, giving nodes where they always cancel and antinodes where they reinforce.</p></blockquote>
`;

N['4.5']=`
<h2>Light as particles: photons</h2>
<p>Topic 4.4 treated light as a wave, and diffraction and interference show that it really does behave like one. But in the early 1900s, experiments on how light is emitted and absorbed could only be explained if light comes in separate packets of energy. A <strong>photon</strong> is <strong>a quantum (discrete packet) of energy of electromagnetic radiation</strong>. Light is emitted and absorbed one photon at a time.</p>
<div class="eqgrid"><div>E = hf</div><div>E = hc / λ</div></div>
<p>h is the <strong>Planck constant</strong>, 6.63 × 10<sup>−34</sup> J s. The second form uses c = fλ. So photons of higher frequency (shorter wavelength) carry more energy: one UV photon has more energy than one red photon, however bright the red light is. Photons have no mass and no charge, and travel at c.</p>
<div class="wex"><p><strong>Worked example.</strong> Find the energy of a photon of green light, λ = 530 nm, in joules and electronvolts.</p>
<p>E = hc/λ = (6.63 × 10<sup>−34</sup> × 3.00 × 10<sup>8</sup>)/530 × 10<sup>−9</sup> = <strong>3.75 × 10<sup>−19</sup> J</strong>.</p>
<p>In eV: 3.75 × 10<sup>−19</sup>/1.60 × 10<sup>−19</sup> = <strong>2.3 eV</strong>.</p></div>
<p>A light source of power P emitting photons of energy E sends out P/E photons per second. For a 1 mW laser at 630 nm that is about 3 × 10<sup>15</sup> photons every second, which is why light normally looks continuous.</p>

<h2>The electronvolt</h2>
<p>Photon and electron energies are tiny in joules, so we use the <strong>electronvolt</strong>: <strong>the energy transferred when an electron moves through a p.d. of 1 V</strong>. Since W = QV = e × 1 V:</p>
<div class="eqgrid"><div>1 eV = 1.60 × 10<sup>−19</sup> J</div></div>
<p>To convert eV to J, multiply by 1.60 × 10<sup>−19</sup>; to convert J to eV, divide. Visible photons are about 1.8–3.1 eV.</p>

<h2>Estimating the Planck constant with LEDs (PAG 6.1)</h2>
<p>In an LED, each electron crossing the junction can give up its energy as one photon. The LED only starts to emit light when the p.d. across it is big enough for each electron to gain one photon's worth of energy. At this <strong>threshold p.d.</strong> V:</p>
<div class="eqgrid"><div>eV = hc / λ</div></div>
<p>Method: connect each LED (of known wavelength) in series with a protective resistor and a variable supply (or potentiometer), with a voltmeter across the LED. Slowly increase the p.d. until the LED just starts to glow (view it through a dark tube to judge this) and record V. Repeat for several colours.</p>
<p>Analysis: V = (hc/e) × (1/λ). Plot <strong>V against 1/λ</strong>: a straight line through the origin with <strong>gradient = hc/e</strong>, so <strong>h = gradient × e/c</strong>.</p>
<p>Main uncertainty: judging the exact moment the LED switches on. Measuring the current with a sensitive ammeter and finding where it starts to rise is more objective.</p>

<h2>The photoelectric effect</h2>
<p>When electromagnetic radiation of a high enough frequency falls on a metal surface, electrons are emitted from the surface. These are called <strong>photoelectrons</strong>.</p>
<h3>The gold-leaf electroscope demonstration</h3>
<p>A clean zinc plate sits on top of a gold-leaf electroscope, which is given a negative charge so the gold leaf rises (it repels the stem).</p>
<ul>
<li>Shine <strong>UV</strong> light on the zinc: the leaf <strong>falls</strong> gradually. Photoelectrons are leaving the zinc, so the electroscope loses its negative charge.</li>
<li>Shine bright <strong>visible light</strong> on it, for as long as you like: <strong>nothing happens</strong>.</li>
<li>Make the UV brighter: the leaf falls <strong>faster</strong>.</li>
<li>If the electroscope is charged <strong>positively</strong>, UV has no effect: any photoelectrons released are attracted straight back.</li>
</ul>
<h3>Why the wave model fails</h3>
<p>If light were just a wave, its energy would spread continuously over the surface. Electrons would absorb energy gradually, so <em>any</em> frequency should eventually free them if it is intense enough or shines long enough, and brighter light should give them more kinetic energy. Experiments show the opposite:</p>
<ol>
<li>There is a <strong>threshold frequency</strong>, below which no electrons are emitted, however intense the light.</li>
<li>Above it, emission is <strong>instantaneous</strong>, even for very dim light.</li>
<li>The maximum kinetic energy of the photoelectrons depends on the <strong>frequency</strong> of the light, not its intensity.</li>
<li>Increasing the intensity increases the <strong>number</strong> of electrons emitted per second, but not their maximum kinetic energy.</li>
</ol>
<h3>Einstein's explanation</h3>
<p>Light arrives as photons, each with energy hf. Each photon interacts with <strong>one</strong> electron and gives it all its energy, at once (a <strong>one-to-one</strong> interaction). An electron cannot collect energy from several photons; any energy that is not enough to free it is quickly lost as heat.</p>
<p>To escape, the electron must use some energy to break free of the metal. The minimum energy needed to remove an electron from the surface is the <strong>work function</strong> φ. Whatever is left over becomes kinetic energy. Conservation of energy gives <strong>Einstein's photoelectric equation</strong>:</p>
<div class="eqgrid"><div>hf = φ + KE<sub>max</sub></div></div>
<p>KE<sub>max</sub> is the kinetic energy of electrons from the very surface. Electrons from deeper inside lose extra energy on the way out, so they emerge with less: that is why we talk about the <em>maximum</em> kinetic energy.</p>
<ul>
<li><strong>Threshold frequency</strong> f₀: the minimum frequency for emission, when KE<sub>max</sub> = 0. So hf₀ = φ and <strong>f₀ = φ/h</strong>. Below it, a single photon simply does not have enough energy to free an electron.</li>
<li><strong>Intensity</strong> = number of photons per second × energy of each. Brighter light means more photons, so more electrons freed per second (a bigger photocurrent), but each photon's energy, and so KE<sub>max</sub>, is unchanged.</li>
<li>Different metals have different work functions: zinc about 4.3 eV (needs UV), caesium about 2.1 eV (works with visible light).</li>
</ul>
<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="Graph of KEmax against frequency: straight line, gradient h, x-intercept threshold frequency, y-intercept minus work function">
<line class="ax" x1="60" y1="150" x2="500" y2="150" marker-end="url(#ah)"/><line class="ax" x1="100" y1="220" x2="100" y2="20" marker-end="url(#ah)"/>
<line class="c1" x1="200" y1="150" x2="460" y2="40"/><line class="c1 dash" x1="100" y1="192" x2="200" y2="150"/>
<text x="480" y="170" class="small">f</text><text x="106" y="28" class="small">KE<tspan dy="3" font-size="9">max</tspan></text><text x="188" y="168" class="small">f₀</text><text x="40" y="196" class="small">−φ</text><text x="340" y="80" class="lbl1 small">gradient = h</text></svg>
<p>Rearranging: KE<sub>max</sub> = hf − φ, a straight line of the form y = mx + c. Plotting KE<sub>max</sub> against f gives <strong>gradient = h</strong> (the same for every metal), <strong>x-intercept = f₀</strong> and <strong>y-intercept = −φ</strong>. A different metal gives a parallel line.</p>
<div class="wex"><p><strong>Worked example.</strong> UV of wavelength 200 nm falls on zinc (φ = 4.3 eV). Find KE<sub>max</sub> of the photoelectrons and the threshold frequency.</p>
<p>Photon energy: hc/λ = 6.63 × 10<sup>−34</sup> × 3.00 × 10<sup>8</sup>/200 × 10<sup>−9</sup> = 9.95 × 10<sup>−19</sup> J = 6.2 eV.</p>
<p>KE<sub>max</sub> = 6.2 − 4.3 = <strong>1.9 eV</strong> (3.0 × 10<sup>−19</sup> J).</p>
<p>f₀ = φ/h = (4.3 × 1.60 × 10<sup>−19</sup>)/6.63 × 10<sup>−34</sup> = <strong>1.0 × 10<sup>15</sup> Hz</strong> (in the UV, so visible light cannot do it).</p></div>

<h2>Wave–particle duality</h2>
<p>Light behaves as a wave when it travels (diffraction, interference) and as particles when it interacts with matter (the photoelectric effect). In 1924 de Broglie suggested the reverse: <strong>particles such as electrons should also behave as waves</strong>, with a wavelength given by</p>
<div class="eqgrid"><div>λ = h / p = h / mv</div></div>
<p>where p is the particle's momentum. The <strong>de Broglie wavelength</strong> is tiny for everyday objects (a moving tennis ball has λ ≈ 10<sup>−34</sup> m, far too small to notice), but for electrons it is comparable to the spacing of atoms.</p>
<h3>Evidence: electron diffraction</h3>
<p>In an <strong>electron diffraction tube</strong>, electrons are accelerated by a p.d. of a few kilovolts and pass through a very thin film of <strong>graphite</strong>. A fluorescent screen beyond it shows <strong>concentric rings</strong>: a diffraction pattern. Only waves diffract, so this is evidence that electrons behave as waves.</p>
<ul>
<li>Diffraction is significant because the electrons' de Broglie wavelength (about 10<sup>−11</sup> to 10<sup>−10</sup> m) is similar to the spacing between the carbon atoms in graphite (about 10<sup>−10</sup> m), which act like a grating.</li>
<li>Graphite is made of many tiny crystals at random angles, which is why you see rings rather than spots.</li>
<li>Increasing the accelerating p.d. gives the electrons more momentum, so a shorter wavelength, less diffraction and <strong>smaller rings</strong>.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Find the de Broglie wavelength of electrons accelerated through 3000 V.</p>
<p>KE = eV = 4.8 × 10<sup>−16</sup> J. Since KE = p²/2m, p = √(2mKE) = √(2 × 9.11 × 10<sup>−31</sup> × 4.8 × 10<sup>−16</sup>) = 2.96 × 10<sup>−23</sup> kg m s<sup>−1</sup>.</p>
<p>λ = h/p = 6.63 × 10<sup>−34</sup>/2.96 × 10<sup>−23</sup> = <strong>2.2 × 10<sup>−11</sup> m</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> in photoelectric explanations, use the words "one photon", "one electron", "all its energy" and "work function". Saying "the light gives the electron energy" is not enough.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
