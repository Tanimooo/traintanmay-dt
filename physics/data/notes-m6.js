/* Full topic notes, Module 6: Particles and medical physics. Replaces the short notes in m6.js (loaded after it). */
(function(){
const N={};

N['6.1']=`
<h2>What a capacitor is</h2>
<p>A capacitor is two conducting plates separated by an insulator (called the <strong>dielectric</strong>: air, paper, plastic or ceramic). No charge can flow <em>through</em> the insulator, so a capacitor in a d.c. circuit blocks a steady current. What it can do is <strong>store charge, and so store energy</strong>.</p>
<h3>How it charges</h3>
<p>Connect a capacitor to a cell. Electrons flow from the cell's negative terminal onto one plate, which becomes negatively charged. The negative charge repels electrons off the other plate, and they flow to the cell's positive terminal, leaving that plate positive. The plates end up with <strong>equal and opposite charges</strong>, +Q and −Q. (We say "the capacitor stores charge Q".) No electrons cross the gap.</p>
<p>As charge builds up, the p.d. across the plates rises and opposes the cell more and more. The current is large at first and falls to zero when the capacitor's p.d. equals the cell's e.m.f. When you then connect the capacitor across a resistor instead, the electrons flow back from the negative plate round the circuit to the positive plate until both are neutral: it discharges.</p>

<h2>Capacitance</h2>
<p>The charge stored is directly proportional to the p.d. across the capacitor. The constant is the <strong>capacitance</strong>:</p>
<div class="eqgrid"><div>C = Q / V</div></div>
<p><strong>Capacitance is the charge stored per unit p.d.</strong> The unit is the <strong>farad</strong>: 1 F = 1 C V<sup>−1</sup>. A farad is very large, so most capacitors are measured in μF, nF or pF.</p>
<div class="wex"><p><strong>Worked example.</strong> A 470 μF capacitor is charged to 12 V. Q = CV = 470 × 10<sup>−6</sup> × 12 = <strong>5.6 × 10<sup>−3</sup> C</strong>. That is 3.5 × 10<sup>16</sup> electrons moved from one plate to the other.</p></div>

<h2>Capacitors in series and parallel</h2>
<ul>
<li><strong>Parallel</strong>: each capacitor has the same p.d. V. The charges add: Q = Q₁ + Q₂, so CV = C₁V + C₂V and <strong>C = C₁ + C₂ + ...</strong>. Parallel capacitors act like one capacitor with bigger plates.</li>
<li><strong>Series</strong>: each capacitor has the <strong>same charge</strong> Q (the charge pushed onto one plate repels an equal charge off the next). The p.d.s add: V = V₁ + V₂, so Q/C = Q/C₁ + Q/C₂ and <strong>1/C = 1/C₁ + 1/C₂ + ...</strong>. The total is less than the smallest capacitor.</li>
</ul>
<blockquote class="tip"><p>These rules are the opposite way round from resistors. To remember which is which: capacitors in parallel effectively have bigger plates, so more capacitance.</p></blockquote>
<div class="wex"><p><strong>Worked example.</strong> A 20 μF and a 30 μF capacitor are in series across 10 V. Find the total capacitance, the charge on each and the p.d. across each.</p>
<p>1/C = 1/20 + 1/30 = 5/60, so C = <strong>12 μF</strong>. Q = 12 × 10<sup>−6</sup> × 10 = <strong>1.2 × 10<sup>−4</sup> C</strong> on each.</p>
<p>V₁ = Q/C₁ = 1.2 × 10<sup>−4</sup>/20 × 10<sup>−6</sup> = <strong>6.0 V</strong>; V₂ = <strong>4.0 V</strong>. The smaller capacitor takes the bigger share of the p.d.</p></div>

<h2>Energy stored</h2>
<p>Charging a capacitor takes work: each extra bit of charge must be pushed onto a plate against the repulsion of the charge already there, and that repulsion grows as Q grows.</p>
<p>The p.d. across a capacitor is directly proportional to the charge (V = Q/C), so a <strong>graph of V against Q</strong> is a straight line through the origin. Adding a small charge ΔQ at p.d. V takes work VΔQ, a thin strip under the graph. So <strong>the energy stored is the area under the V–Q graph</strong>, a triangle:</p>
<div class="eqgrid"><div>W = ½QV</div><div>W = ½CV²</div><div>W = ½Q²/C</div></div>
<p>(The last two come from substituting Q = CV.) Note the ½: when you charge a capacitor from a battery of e.m.f. V, the battery supplies energy QV, but only half is stored. The other half is dissipated as heat in the resistance of the circuit, however small that resistance is.</p>
<div class="wex"><p><strong>Worked example.</strong> A camera flash uses a 220 μF capacitor charged to 300 V and discharged in 1.0 ms. Energy = ½ × 220 × 10<sup>−6</sup> × 300² = <strong>9.9 J</strong>. Average power ≈ 9.9/1.0 × 10<sup>−3</sup> ≈ <strong>10 kW</strong>.</p></div>
<p><strong>Uses</strong>: capacitors release their energy very quickly, which a battery cannot do. Camera flashes; defibrillators (a large charge delivered to the heart in a few milliseconds); back-up power to keep memory or clocks running during a power cut; smoothing the output of power supplies; timing circuits (using the time constant). Supercapacitors are used for regenerative braking in vehicles. A capacitor stores far less energy than a battery of similar size.</p>

<h2>Charging and discharging through a resistor</h2>
<svg class="diagram" viewBox="-24 0 584 210" role="img" aria-label="Discharge: V, Q and I fall exponentially to 0.37 of their starting value after one time constant CR. Charging: the capacitor p.d. and charge rise to 0.63 of their final value after CR while the current and resistor p.d. fall.">
<g><line class="ax" x1="30" y1="180" x2="260" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" fill="none" d="M30 30.0 L33 39.7 L36 48.7 L39 57.2 L42 65.1 L45 72.5 L48 79.5 L51 85.9 L54 92.0 L57 97.7 L60 103.0 L63 108.0 L66 112.6 L69 116.9 L72 121.0 L75 124.8 L78 128.4 L81 131.7 L84 134.8 L87 137.7 L90 140.5 L93 143.0 L96 145.4 L99 147.6 L102 149.7 L105 151.7 L108 153.5 L111 155.2 L114 156.8 L117 158.3 L120 159.7 L123 161.0 L126 162.2 L129 163.4 L132 164.5 L135 165.5 L138 166.4 L141 167.3 L144 168.1 L147 168.9 L150 169.6 L153 170.2 L156 170.9 L159 171.5 L162 172.0 L165 172.5 L168 173.0 L171 173.5 L174 173.9 L177 174.3 L180 174.6 L183 175.0 L186 175.3 L189 175.6 L192 175.9 L195 176.2 L198 176.4 L201 176.6 L204 176.9 L207 177.1 L210 177.3 L213 177.4 L216 177.6 L219 177.8 L222 177.9 L225 178.0 L228 178.2 L231 178.3 L234 178.4 L237 178.5 L240 178.6 L243 178.7 L246 178.8 L249 178.8 L252 178.9 L255 179.0"/><line class="dash ax" x1="75" y1="180" x2="75" y2="124.8"/><line class="dash ax" x1="30" y1="124.8" x2="75" y2="124.8"/><text x="75" y="196" class="small" text-anchor="middle">CR</text><text x="26" y="34" class="small" text-anchor="end">V₀</text><text x="26" y="128.8" class="small" text-anchor="end">0.37V₀</text><text x="110" y="40" class="small">discharge: V, Q, I</text></g>
<g transform="translate(296 0)"><line class="ax" x1="30" y1="180" x2="260" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" fill="none" d="M30 180.0 L33 170.3 L36 161.3 L39 152.8 L42 144.9 L45 137.5 L48 130.5 L51 124.1 L54 118.0 L57 112.3 L60 107.0 L63 102.0 L66 97.4 L69 93.1 L72 89.0 L75 85.2 L78 81.6 L81 78.3 L84 75.2 L87 72.3 L90 69.5 L93 67.0 L96 64.6 L99 62.4 L102 60.3 L105 58.3 L108 56.5 L111 54.8 L114 53.2 L117 51.7 L120 50.3 L123 49.0 L126 47.8 L129 46.6 L132 45.5 L135 44.5 L138 43.6 L141 42.7 L144 41.9 L147 41.1 L150 40.4 L153 39.8 L156 39.1 L159 38.5 L162 38.0 L165 37.5 L168 37.0 L171 36.5 L174 36.1 L177 35.7 L180 35.4 L183 35.0 L186 34.7 L189 34.4 L192 34.1 L195 33.8 L198 33.6 L201 33.4 L204 33.1 L207 32.9 L210 32.7 L213 32.6 L216 32.4 L219 32.2 L222 32.1 L225 32.0 L228 31.8 L231 31.7 L234 31.6 L237 31.5 L240 31.4 L243 31.3 L246 31.2 L249 31.2 L252 31.1 L255 31.0"/><path class="c2" fill="none" d="M30 30.0 L33 39.7 L36 48.7 L39 57.2 L42 65.1 L45 72.5 L48 79.5 L51 85.9 L54 92.0 L57 97.7 L60 103.0 L63 108.0 L66 112.6 L69 116.9 L72 121.0 L75 124.8 L78 128.4 L81 131.7 L84 134.8 L87 137.7 L90 140.5 L93 143.0 L96 145.4 L99 147.6 L102 149.7 L105 151.7 L108 153.5 L111 155.2 L114 156.8 L117 158.3 L120 159.7 L123 161.0 L126 162.2 L129 163.4 L132 164.5 L135 165.5 L138 166.4 L141 167.3 L144 168.1 L147 168.9 L150 169.6 L153 170.2 L156 170.9 L159 171.5 L162 172.0 L165 172.5 L168 173.0 L171 173.5 L174 173.9 L177 174.3 L180 174.6 L183 175.0 L186 175.3 L189 175.6 L192 175.9 L195 176.2 L198 176.4 L201 176.6 L204 176.9 L207 177.1 L210 177.3 L213 177.4 L216 177.6 L219 177.8 L222 177.9 L225 178.0 L228 178.2 L231 178.3 L234 178.4 L237 178.5 L240 178.6 L243 178.7 L246 178.8 L249 178.8 L252 178.9 L255 179.0"/><line class="dash ax" x1="75" y1="180" x2="75" y2="85.2"/><line class="dash ax" x1="30" y1="85.2" x2="75" y2="85.2"/><text x="75" y="196" class="small" text-anchor="middle">CR</text><text x="26" y="89.2" class="small" text-anchor="end">0.63</text><text x="190" y="62" class="small lbl1">V<tspan dy="3" font-size="9">C</tspan><tspan dy="-3">, Q</tspan></text><text x="140" y="150" class="small lbl2">I, V<tspan dy="3" font-size="9">R</tspan></text></g></svg>
<h3>Discharging: why it is exponential</h3>
<p>A capacitor charged to V₀ discharges through a resistor R. At any moment the current is I = V/R = Q/CR. The current is the rate at which charge leaves: ΔQ/Δt = −I. So:</p>
<div class="eqgrid"><div>ΔQ/Δt = −Q/CR</div></div>
<p>The rate of loss of charge is <strong>proportional to the charge remaining</strong>. A lot of charge means a big p.d., a big current and fast loss; as Q falls, the loss slows down. That is the definition of <strong>exponential decay</strong> (the same maths as radioactive decay, 6.4). The solution is:</p>
<div class="eqgrid"><div>x = x₀ e<sup>−t/CR</sup></div></div>
<p>where x can be Q, V or I (all are proportional to each other during discharge).</p>
<h3>The time constant</h3>
<p>The product <strong>τ = CR</strong> is the <strong>time constant</strong>, in seconds (Ω × F = (V/A) × (C/V) = C/A = s). After one time constant, t = CR, so x = x₀e<sup>−1</sup> = <strong>0.37x₀</strong>: the charge has fallen to 37% of its starting value. After 2CR it is 0.37² = 14%; after 5CR it is less than 1%, effectively fully discharged. A bigger C (more charge to move) or a bigger R (smaller current) makes discharge slower.</p>
<p>The time to halve is found from ½ = e<sup>−t/CR</sup>: <strong>t<sub>½</sub> = CR ln 2 ≈ 0.69CR</strong>.</p>
<p><strong>Constant-ratio property</strong>: in any equal time intervals, the value falls by the same fraction. If V falls from 10 V to 8 V in 2 s, it will fall from 8 V to 6.4 V in the next 2 s. This is a quick test for exponential decay from data.</p>
<h3>Charging</h3>
<p>When charging from a supply of e.m.f. V₀ through R, the capacitor's charge and p.d. <strong>rise</strong> towards their final values, while the current (and the p.d. across the resistor) <strong>fall</strong> exponentially:</p>
<div class="eqgrid"><div>V<sub>C</sub> = V₀(1 − e<sup>−t/CR</sup>)</div><div>Q = Q₀(1 − e<sup>−t/CR</sup>)</div><div>I = I₀e<sup>−t/CR</sup></div></div>
<p>After one time constant the capacitor has reached 63% of its final charge and p.d. At every moment V<sub>C</sub> + V<sub>R</sub> = V₀ (Kirchhoff's second law).</p>
<div class="wex"><p><strong>Worked example.</strong> A 100 μF capacitor charged to 9.0 V discharges through a 47 kΩ resistor. Find the time constant, the p.d. after 10 s and the time to fall to 1.0 V.</p>
<p>τ = CR = 100 × 10<sup>−6</sup> × 47 × 10<sup>3</sup> = <strong>4.7 s</strong>.</p>
<p>V = 9.0e<sup>−10/4.7</sup> = 9.0 × 0.119 = <strong>1.07 V</strong>.</p>
<p>1.0 = 9.0e<sup>−t/4.7</sup> → ln(1/9) = −t/4.7 → t = 4.7 × ln 9 = <strong>10.3 s</strong>.</p></div>
<p>To find t from an exponential, take natural logs of both sides: the ln undoes the e.</p>

<h2>Investigating discharge (PAG 9)</h2>
<p>Charge a capacitor from a d.c. supply, then switch it to discharge through a large resistor (so the discharge is slow enough to time), with a voltmeter across the capacitor (or a data-logger). Record V at regular intervals.</p>
<p>Taking logs of V = V₀e<sup>−t/CR</sup>: <strong>ln V = ln V₀ − t/CR</strong>. Plot ln V against t: a straight line with <strong>gradient = −1/CR</strong> and y-intercept ln V₀. So CR = −1/gradient, and knowing R you can find C.</p>
<p>Alternatively, find the time for V to fall to 0.37V₀ (that is CR), or measure the current with a microammeter and find the charge from the area under the I–t graph.</p>

<h2>Modelling with a spreadsheet</h2>
<p>The equation ΔQ = −(Q/CR)Δt can be used step by step, without needing the exponential formula:</p>
<ol>
<li>Start with Q = Q₀ at t = 0. Choose a small time step Δt (say CR/10).</li>
<li>Calculate the charge lost in that step: ΔQ = (Q/CR) × Δt.</li>
<li>New Q = old Q − ΔQ; new t = old t + Δt.</li>
<li>Repeat for many rows.</li>
</ol>
<p>This iterative method slightly overestimates the charge lost, because it uses the current at the start of each step, which is the largest it will be in that step. Smaller time steps give results closer to the true exponential curve.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> for "how much of the charge is left after 3 time constants?", you do not need the numbers: e<sup>−3</sup> = 0.050, so 5% remains.</p></blockquote>
`;

N['6.2']=`
<h2>Electric fields</h2>
<p>An <strong>electric field</strong> is a region in which a <strong>charged</strong> object experiences a force. Every charge creates a field around it, and every charge feels a force in another charge's field.</p>
<p><strong>Electric field strength</strong> E at a point is the <strong>force per unit positive charge</strong> on a small test charge placed there:</p>
<div class="eqgrid"><div>E = F / Q</div></div>
<p>Unit: N C<sup>−1</sup> (which is the same as V m<sup>−1</sup>). E is a vector; it points in the direction of the force on a <strong>positive</strong> charge. A negative charge feels a force in the opposite direction to E.</p>
<h3>Field lines</h3>
<ul>
<li>Field lines point from <strong>positive to negative</strong>: away from positive charges, towards negative charges.</li>
<li>The closer the lines, the stronger the field. Lines never cross. They meet conducting surfaces at right angles.</li>
<li>Around a point charge (or a charged sphere) the field is <strong>radial</strong> and weakens with distance.</li>
<li>Between two parallel charged plates the field is <strong>uniform</strong>: parallel, equally spaced lines, with the same strength everywhere (except near the edges).</li>
</ul>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Radial field of a positive point charge and uniform field between parallel plates">
<g><circle cx="110" cy="105" r="16" class="fill1 ax"/><text x="104" y="110" class="lblw">+</text>
<g class="c1"><line x1="130" y1="105" x2="200" y2="105" marker-end="url(#ahb)"/><line x1="90" y1="105" x2="20" y2="105" marker-end="url(#ahb)"/><line x1="110" y1="85" x2="110" y2="15" marker-end="url(#ahb)"/><line x1="110" y1="125" x2="110" y2="195" marker-end="url(#ahb)"/><line x1="124" y1="91" x2="170" y2="45" marker-end="url(#ahb)"/><line x1="96" y1="91" x2="50" y2="45" marker-end="url(#ahb)"/><line x1="124" y1="119" x2="170" y2="165" marker-end="url(#ahb)"/><line x1="96" y1="119" x2="50" y2="165" marker-end="url(#ahb)"/></g><text x="60" y="205" class="small">radial field</text></g>
<g transform="translate(270 0)"><rect x="20" y="20" width="240" height="12" class="fill1 ax"/><rect x="20" y="178" width="240" height="12" class="fill2 ax"/><text x="264" y="30">+</text><text x="264" y="190">−</text>
<g class="c1"><line x1="50" y1="34" x2="50" y2="174" marker-end="url(#ahb)"/><line x1="100" y1="34" x2="100" y2="174" marker-end="url(#ahb)"/><line x1="150" y1="34" x2="150" y2="174" marker-end="url(#ahb)"/><line x1="200" y1="34" x2="200" y2="174" marker-end="url(#ahb)"/><line x1="240" y1="34" x2="240" y2="174" marker-end="url(#ahb)"/></g><text x="60" y="206" class="small">uniform field E = V/d</text></g></svg>
<p>A charged <strong>conducting sphere</strong> behaves, outside itself, as if all its charge were a point charge at its centre (the charge spreads evenly over its surface). Inside a hollow conductor the field is zero.</p>

<h2>Coulomb's law</h2>
<p><strong>The force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of their separation.</strong></p>
<div class="eqgrid"><div>F = Qq / 4πε₀r²</div><div>E = Q / 4πε₀r²</div></div>
<ul>
<li>ε₀ = 8.85 × 10<sup>−12</sup> F m<sup>−1</sup> is the <strong>permittivity of free space</strong>. The constant 1/4πε₀ ≈ 9.0 × 10<sup>9</sup> N m² C<sup>−2</sup>.</li>
<li>If Qq is positive (like charges) F is positive: <strong>repulsion</strong>. If negative (unlike charges): <strong>attraction</strong>.</li>
<li>The second equation is the field strength of a point charge Q, found by dividing F by the test charge q. Both are inverse square laws.</li>
<li>In a material other than a vacuum, the force is smaller: replace ε₀ by the material's permittivity ε. Air is very close to a vacuum.</li>
</ul>
<div class="wex"><p><strong>Worked example: electric vs gravitational force in hydrogen.</strong> The electron and proton are 5.3 × 10<sup>−11</sup> m apart.</p>
<p>Electric: F = (1.60 × 10<sup>−19</sup>)²/(4π × 8.85 × 10<sup>−12</sup> × (5.3 × 10<sup>−11</sup>)²) = <strong>8.2 × 10<sup>−8</sup> N</strong>.</p>
<p>Gravitational: F = 6.67 × 10<sup>−11</sup> × 9.11 × 10<sup>−31</sup> × 1.67 × 10<sup>−27</sup>/(5.3 × 10<sup>−11</sup>)² = 3.6 × 10<sup>−47</sup> N. The electric force is about 10<sup>39</sup> times larger, so gravity is irrelevant inside atoms.</p></div>
<p>When more than one charge is present, find the field from each one and add them as <strong>vectors</strong>. At a point between two like charges there is a "neutral point" where their fields cancel.</p>

<h2>Uniform fields</h2>
<p>Between two parallel plates with a p.d. V across them, a distance d apart:</p>
<div class="eqgrid"><div>E = V / d</div></div>
<p>Why: moving a charge Q from one plate to the other takes work W = QV (from the definition of p.d.). It also equals force × distance = EQ × d. So EQd = QV and E = V/d. This shows why the unit of E can be written V m<sup>−1</sup>.</p>
<h3>Charged particles moving in a uniform field</h3>
<p>A charge Q in a uniform field feels a constant force EQ, so it has a constant acceleration <strong>a = EQ/m</strong> parallel to the field lines (in the field direction for positive charge, opposite for negative).</p>
<ul>
<li>A particle that starts from rest, or moves along the field lines, simply speeds up or slows down. It gains kinetic energy QV crossing a p.d. V (see eV = ½mv², topic 4.2).</li>
<li>A particle that enters the field at <strong>right angles</strong> to the field lines behaves like a projectile in gravity (3.1). Its velocity across the field is constant; along the field it accelerates uniformly. So it follows a <strong>parabola</strong>.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> An electron enters the field between two plates 2.0 cm apart with p.d. 500 V, at right angles to the field, travelling at 3.0 × 10<sup>7</sup> m s<sup>−1</sup>. The plates are 6.0 cm long. Find its sideways deflection as it leaves.</p>
<p>E = 500/0.020 = 2.5 × 10<sup>4</sup> V m<sup>−1</sup>. a = eE/m = 1.60 × 10<sup>−19</sup> × 2.5 × 10<sup>4</sup>/9.11 × 10<sup>−31</sup> = 4.4 × 10<sup>15</sup> m s<sup>−2</sup>.</p>
<p>Time in the field t = 0.060/3.0 × 10<sup>7</sup> = 2.0 × 10<sup>−9</sup> s. Deflection = ½at² = ½ × 4.4 × 10<sup>15</sup> × (2.0 × 10<sup>−9</sup>)² = <strong>8.8 mm</strong>, towards the positive plate.</p></div>

<h2>The parallel-plate capacitor</h2>
<p>The capacitance of two parallel plates of area A a distance d apart is</p>
<div class="eqgrid"><div>C = ε₀A / d</div><div>C = ε₀ε<sub>r</sub>A / d</div></div>
<p>Bigger plates hold more charge for a given p.d.; closer plates give a stronger field for a given p.d. (E = V/d), which pulls more charge on. Putting an insulator (dielectric) between the plates increases C by a factor ε<sub>r</sub>, the <strong>relative permittivity</strong> (or dielectric constant), defined as ε<sub>r</sub> = ε/ε₀. It has no unit. In the dielectric the molecules become polarised and partly cancel the field, so more charge can be stored at the same p.d. ε<sub>r</sub> is about 1 for air, 2–3 for plastics, 80 for water.</p>

<h2>Electric potential</h2>
<p><strong>The electric potential V at a point is the work done per unit positive charge in bringing a small test charge from infinity to that point.</strong></p>
<div class="eqgrid"><div>V = Q / 4πε₀r</div></div>
<ul>
<li>Unit: volts (J C<sup>−1</sup>). It is a scalar.</li>
<li>Near a <strong>positive</strong> charge, V is positive: you have to push a positive test charge in against repulsion. Near a negative charge, V is negative.</li>
<li>It is zero at infinity, and varies as 1/r (more slowly than E, which varies as 1/r²).</li>
<li>The p.d. between two points is the difference in their potentials.</li>
<li>Field strength is minus the potential gradient: <strong>E = −ΔV/Δr</strong>. Equipotentials are perpendicular to field lines.</li>
</ul>
<h3>Electric potential energy</h3>
<p>The potential energy of a charge q at a point is q times the potential there:</p>
<div class="eqgrid"><div>E<sub>p</sub> = Vq = Qq / 4πε₀r</div></div>
<p>The work done moving a charge between two points equals the change in its potential energy, which is also the <strong>area under the force–distance graph</strong> between them.</p>
<div class="wex"><p><strong>Worked example: closest approach.</strong> An alpha particle (charge +2e) with kinetic energy 5.0 MeV heads straight for a gold nucleus (charge +79e). Find the closest it gets.</p>
<p>At closest approach all its kinetic energy has become electric potential energy: 5.0 × 10<sup>6</sup> × 1.60 × 10<sup>−19</sup> = (2e)(79e)/4πε₀r.</p>
<p>r = (2 × 79 × (1.60 × 10<sup>−19</sup>)²)/(4π × 8.85 × 10<sup>−12</sup> × 8.0 × 10<sup>−13</sup>) = <strong>4.5 × 10<sup>−14</sup> m</strong>, an upper limit for the radius of the gold nucleus.</p></div>
<h3>Capacitance of an isolated sphere</h3>
<p>A sphere of radius R carrying charge Q has potential V = Q/4πε₀R at its surface. So C = Q/V gives:</p>
<div class="eqgrid"><div>C = 4πε₀R</div></div>
<p>(Even the Earth, with R = 6.4 × 10<sup>6</sup> m, has a capacitance of only about 0.7 mF.)</p>

<h2>Comparing gravitational and electric fields</h2>
<div class="tbl"><table><tr><th></th><th>Gravitational</th><th>Electric</th></tr>
<tr><td>Acts on</td><td>mass</td><td>charge</td></tr>
<tr><td>Field strength</td><td>g = F/m (force per unit mass)</td><td>E = F/Q (force per unit positive charge)</td></tr>
<tr><td>Force between point sources</td><td>F = −GMm/r²</td><td>F = Qq/4πε₀r²</td></tr>
<tr><td>Field of a point source</td><td>g = −GM/r²</td><td>E = Q/4πε₀r²</td></tr>
<tr><td>Potential</td><td>V<sub>g</sub> = −GM/r (always negative)</td><td>V = Q/4πε₀r (sign of Q)</td></tr>
<tr><td>Potential energy</td><td>−GMm/r</td><td>Qq/4πε₀r</td></tr>
<tr><td>Attractive or repulsive?</td><td>always attractive</td><td>either</td></tr>
<tr><td>Uniform field</td><td>near a planet's surface</td><td>between parallel plates</td></tr></table></div>
<p>Similarities: both are inverse square law fields for point sources, both use field lines, both have a potential that varies as 1/r and is zero at infinity, and in both, field strength = −potential gradient.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> in Coulomb's law questions, check whether r is measured from the centre: for charged spheres, add the radii. Square r, not the whole denominator.</p></blockquote>
`;

N['6.3']=`
<h2>Magnetic fields</h2>
<p>A <strong>magnetic field</strong> is a region in which a <strong>moving charge</strong> (including a current in a wire) or a magnetic material experiences a force. Magnetic fields are produced by <strong>moving charges</strong>, that is, by electric currents, and by permanent magnets (where the moving charges are electrons inside the atoms).</p>
<h3>Field patterns</h3>
<ul>
<li>Field lines run from the <strong>north pole to the south pole</strong> outside a magnet. The closer the lines, the stronger the field.</li>
<li><strong>Long straight wire</strong>: concentric circles around the wire, getting further apart with distance. Direction: <strong>right-hand grip rule</strong>, with your thumb along the conventional current, your curled fingers show the field direction.</li>
<li><strong>Flat circular coil</strong>: the field lines go through the coil and loop around the outside, like a short bar magnet.</li>
<li><strong>Solenoid</strong> (a long coil): a field like a bar magnet outside, and a strong, <strong>uniform</strong> field inside (parallel, equally spaced lines). Grip the solenoid with your right hand, fingers following the current: your thumb points to the north end. An iron core makes the field much stronger (an electromagnet).</li>
</ul>
<p>In diagrams, a dot (•) means a field or current coming <strong>out of</strong> the page, and a cross (×) means going <strong>into</strong> the page.</p>

<h2>Force on a current-carrying conductor</h2>
<p>A wire carrying a current at an angle to a magnetic field feels a force (the motor effect). The force is <strong>perpendicular to both the current and the field</strong>.</p>
<div class="eqgrid"><div>F = BIL sin θ</div></div>
<p>I is the current, L the length of wire in the field and θ the angle between the wire and the field. The force is greatest when the wire is at right angles to the field (F = BIL) and zero when the wire is parallel to it.</p>
<p><strong>Fleming's left-hand rule</strong>: hold the thumb, first finger and second finger of your left hand at right angles. <strong>F</strong>irst finger = <strong>F</strong>ield (N to S); se<strong>C</strong>ond finger = <strong>C</strong>urrent (conventional, + to −); thu<strong>M</strong>b = <strong>M</strong>otion (the force).</p>
<h3>Magnetic flux density and the tesla</h3>
<p>The strength of a magnetic field is its <strong>magnetic flux density</strong> B. Rearranging F = BIL, B = F/IL: the force per unit current per unit length on a wire at right angles to the field.</p>
<p><strong>The tesla (T) is the magnetic flux density that produces a force of 1 N on a 1 m length of wire carrying a current of 1 A at right angles to the field.</strong> 1 T = 1 N A<sup>−1</sup> m<sup>−1</sup>. The Earth's field is about 5 × 10<sup>−5</sup> T; a strong permanent magnet about 0.1–1 T; an MRI scanner 1.5–3 T.</p>
<h3>Measuring B with a current balance</h3>
<p>Place a U-shaped magnet (or two magnets on a yoke) on a top-pan balance and zero it. Clamp a stiff horizontal wire between the poles, at right angles to the field, not touching the magnet. Pass a current through the wire. By Newton's third law, the force on the wire produces an equal and opposite force on the magnet, changing the balance reading by Δm. So F = Δm × g.</p>
<p>Vary I and record Δm. Plot F against I: a straight line through the origin with <strong>gradient = BL</strong>, so B = gradient/L. Measure L (the length of wire in the field, roughly the width of the pole pieces) with a ruler.</p>

<h2>Force on a moving charge</h2>
<p>A current is just moving charges, so each charged particle moving through a magnetic field feels a force too. For a charge Q moving at speed v at right angles to the field:</p>
<div class="eqgrid"><div>F = BQv</div></div>
<p><strong>Derivation from F = BIL.</strong> Suppose a charge Q takes time t to travel a length L of wire. The current is I = Q/t and L = vt. So F = BIL = B(Q/t)(vt) = BQv.</p>
<p>Use Fleming's left-hand rule with the second finger along the direction of conventional current: the direction of motion for a positive charge, but <strong>opposite</strong> to the motion of an electron.</p>
<h3>Circular orbits</h3>
<p>The magnetic force is always <strong>perpendicular to the velocity</strong>. So it does no work, cannot change the particle's speed, and only changes its direction. A force of constant size always at right angles to the motion is exactly the condition for circular motion (5.2). The magnetic force provides the centripetal force:</p>
<p>BQv = mv²/r, so</p>
<div class="eqgrid"><div>r = mv / BQ</div></div>
<ul>
<li>Faster or heavier particles move in <strong>larger</strong> circles; stronger fields or bigger charges give <strong>smaller</strong> circles.</li>
<li>Positive and negative particles curve in opposite directions.</li>
<li>This is used in mass spectrometers (to separate ions by mass), cyclotrons and particle detectors (the curvature of a track tells you a particle's momentum and charge sign).</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> An electron moving at 4.0 × 10<sup>6</sup> m s<sup>−1</sup> enters a 2.0 mT field at right angles. Find the radius of its path.</p>
<p>r = mv/BQ = 9.11 × 10<sup>−31</sup> × 4.0 × 10<sup>6</sup>/(2.0 × 10<sup>−3</sup> × 1.60 × 10<sup>−19</sup>) = <strong>1.1 cm</strong>.</p></div>

<h2>The velocity selector</h2>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Velocity selector: crossed electric and magnetic fields; only particles with v = E/B pass straight through">
<rect x="120" y="30" width="280" height="10" class="fill1 ax"/><rect x="120" y="170" width="280" height="10" class="fill2 ax"/>
<g class="bdots"><circle cx="140" cy="70" r="2.5"/><circle cx="188" cy="70" r="2.5"/><circle cx="236" cy="70" r="2.5"/><circle cx="284" cy="70" r="2.5"/><circle cx="332" cy="70" r="2.5"/><circle cx="380" cy="70" r="2.5"/><circle cx="140" cy="110" r="2.5"/><circle cx="188" cy="110" r="2.5"/><circle cx="236" cy="110" r="2.5"/><circle cx="284" cy="110" r="2.5"/><circle cx="332" cy="110" r="2.5"/><circle cx="380" cy="110" r="2.5"/><circle cx="140" cy="150" r="2.5"/><circle cx="188" cy="150" r="2.5"/><circle cx="236" cy="150" r="2.5"/><circle cx="284" cy="150" r="2.5"/><circle cx="332" cy="150" r="2.5"/><circle cx="380" cy="150" r="2.5"/></g>
<line class="c1 thick" x1="20" y1="105" x2="500" y2="105" marker-end="url(#ahb)"/><path class="c2 dash" d="M120 105 Q260 100 400 50"/><path class="c3 dash" d="M120 105 Q260 110 400 160"/>
<text x="20" y="96" class="small">v</text><text x="410" y="48" class="small lbl2">v &lt; E/B</text><text x="410" y="170" class="small lbl3">v &gt; E/B</text><text x="200" y="208" class="small">B out of page (•), E down</text></svg>
<p>A velocity selector has an electric field and a magnetic field at right angles to each other and to the particles' path ("crossed fields"). They are arranged so the electric force EQ and the magnetic force BQv on a particle point in <strong>opposite</strong> directions.</p>
<p>A particle goes straight through, undeflected, only if the forces balance: EQ = BQv, so</p>
<div class="eqgrid"><div>v = E / B</div></div>
<p>The charge cancels, so this works for any particle, whatever its mass or charge. Slower particles feel a smaller magnetic force, so the electric force wins and they are deflected one way; faster ones are deflected the other way. Placing a slit at the exit lets through only particles of one speed. Used as the first stage of a mass spectrometer.</p>

<h2>Magnetic flux and flux linkage</h2>
<p><strong>Magnetic flux</strong> φ through an area measures the "amount of field" passing through it:</p>
<div class="eqgrid"><div>φ = BA cos θ</div><div>flux linkage = Nφ</div></div>
<p>θ is the angle between the field and the <strong>normal</strong> to the area. Flux is greatest (BA) when the field passes straight through the coil (θ = 0) and zero when the coil's plane is parallel to the field (θ = 90°). The unit of flux is the <strong>weber</strong>: 1 Wb = 1 T m². (That is why B is called flux <em>density</em>: flux per unit area.)</p>
<p>For a coil of N turns, the flux passes through every turn, so the <strong>flux linkage</strong> is Nφ (unit Wb, or Wb-turns).</p>

<h2>Electromagnetic induction</h2>
<p>When the magnetic flux linking a circuit <strong>changes</strong>, an e.m.f. is induced in it. If the circuit is complete, a current flows. The flux can change because a magnet moves, a coil moves or rotates, a wire cuts through field lines, or a nearby current changes.</p>
<h3>Faraday's law</h3>
<p><strong>The magnitude of the induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage.</strong></p>
<h3>Lenz's law</h3>
<p><strong>The direction of the induced e.m.f. (or current) is such that it opposes the change that produces it.</strong> Push the north pole of a magnet into a coil and the induced current makes that end of the coil a north pole, repelling the magnet. You must do work to push it in, and that work becomes the electrical energy. If the induced current helped the change instead, you would get energy for nothing: Lenz's law is a consequence of <strong>conservation of energy</strong>.</p>
<p>Together:</p>
<div class="eqgrid"><div>ε = −Δ(Nφ) / Δt</div></div>
<p>The minus sign represents Lenz's law. The induced e.m.f. is the <strong>gradient</strong> of a flux linkage–time graph.</p>
<div class="wex"><p><strong>Worked example.</strong> A 200-turn coil of area 4.0 cm² sits at right angles to a 0.50 T field. The field is switched off in 0.020 s. Find the average induced e.m.f.</p>
<p>Change in flux linkage = NBA = 200 × 0.50 × 4.0 × 10<sup>−4</sup> = 0.040 Wb.</p>
<p>ε = 0.040/0.020 = <strong>2.0 V</strong>.</p></div>
<h3>A wire cutting a field</h3>
<p>A straight wire of length L moving at speed v at right angles to a field B sweeps out area Lv per second, so the rate of change of flux is BLv: <strong>ε = BLv</strong>. (Fleming's <em>right</em>-hand rule gives the direction of the induced current.)</p>
<h3>Investigating with a search coil</h3>
<p>A search coil is a small flat coil with many turns, connected to an oscilloscope. Place it in the alternating magnetic field of a coil or solenoid carrying a.c. The changing flux induces an alternating e.m.f. in the search coil. Its peak value is proportional to the field strength, and is largest when the plane of the search coil is perpendicular to the field (maximum flux linkage). Rotating the search coil shows the cos θ dependence; moving it maps out how the field varies with position.</p>

<h2>The a.c. generator</h2>
<p>A coil of N turns and area A rotating at angular speed ω in a uniform field B is a simple generator. The angle between the field and the normal to the coil is θ = ωt, so the flux linkage varies as Nφ = BAN cos ωt. The induced e.m.f. is the (negative) rate of change of this:</p>
<div class="eqgrid"><div>ε = BANω sin ωt</div><div>ε₀ = BANω</div></div>
<ul>
<li>The output is a sinusoidal alternating e.m.f.</li>
<li>The e.m.f. is <strong>maximum when the flux linkage is zero</strong> (the coil's plane is parallel to the field), because that is when the flux is changing fastest. The e.m.f. is zero when the flux linkage is maximum.</li>
<li>Spinning the coil twice as fast <strong>doubles the peak e.m.f. and doubles the frequency</strong>.</li>
<li>Slip rings and brushes connect the rotating coil to the outside circuit.</li>
</ul>

<h2>Transformers</h2>
<p>A transformer has two coils, the <strong>primary</strong> (N<sub>p</sub> turns) and the <strong>secondary</strong> (N<sub>s</sub> turns), wound on a shared soft iron core.</p>
<ol>
<li>An alternating current in the primary produces an alternating magnetic field.</li>
<li>The iron core concentrates this field and carries the alternating flux through the secondary coil.</li>
<li>The changing flux linkage in the secondary induces an alternating e.m.f. (Faraday's law), at the same frequency.</li>
</ol>
<p>It only works with a.c.: a steady d.c. current gives a constant flux, and so no induced e.m.f.</p>
<p>For an <strong>ideal</strong> transformer (100% efficient), each turn of both coils has the same e.m.f., and the power in equals the power out (V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>). So:</p>
<div class="eqgrid"><div>n<sub>s</sub>/n<sub>p</sub> = V<sub>s</sub>/V<sub>p</sub> = I<sub>p</sub>/I<sub>s</sub></div></div>
<ul>
<li><strong>Step-up</strong> transformer: more turns on the secondary; increases the voltage and decreases the current.</li>
<li><strong>Step-down</strong>: fewer turns on the secondary; decreases the voltage, increases the current.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A phone charger steps 230 V down to 5.0 V. The primary has 2300 turns. How many turns on the secondary? If it delivers 2.0 A, what current does it take from the mains (assume ideal)?</p>
<p>n<sub>s</sub> = 2300 × 5.0/230 = <strong>50 turns</strong>. I<sub>p</sub> = I<sub>s</sub>V<sub>s</sub>/V<sub>p</sub> = 2.0 × 5.0/230 = <strong>0.043 A</strong>.</p></div>
<p><strong>Energy losses</strong> in real transformers: changing flux also induces <strong>eddy currents</strong> in the iron core, which heat it. The core is <strong>laminated</strong> (made of thin sheets separated by insulating layers), which breaks up the eddy current paths. Other losses: resistance of the coils (thick copper wire reduces it), and some flux not linking both coils.</p>
<p><strong>Power transmission</strong>: the National Grid steps the voltage up to 400 kV for transmission. For the same power, the current is much smaller, and the power wasted heating the cables is I²R, so it falls dramatically. Transformers near homes step it back down to 230 V.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> Fleming's <strong>left</strong>-hand rule is for <strong>motors</strong> (force on a current). For induced current direction, use Lenz's law ("opposes the change") or the right-hand rule.</p></blockquote>
`;

N['6.4']=`
<h2>Discovering the nucleus: alpha-particle scattering</h2>
<p>Before 1909 the accepted "plum pudding" model pictured the atom as a sphere of spread-out positive charge with electrons dotted through it. Rutherford's team (Geiger and Marsden) tested it by firing <strong>alpha particles</strong> at a very thin <strong>gold foil</strong> in a vacuum, and counting how many were scattered at each angle using a detector (a zinc sulfide screen viewed through a microscope) that could be moved round the foil.</p>
<div class="tbl"><table><tr><th>Observation</th><th>Conclusion</th></tr>
<tr><td>Almost all the alpha particles went straight through, or were deflected by only a few degrees.</td><td>Most of the atom is <strong>empty space</strong>.</td></tr>
<tr><td>Some were deflected through larger angles.</td><td>The centre of the atom is <strong>charged</strong>; alpha particles are positive and are repelled, so the nucleus is <strong>positive</strong>.</td></tr>
<tr><td>A very small number (about 1 in 10 000) bounced back by more than 90°.</td><td>Nearly all the <strong>mass and positive charge</strong> are concentrated in a <strong>tiny nucleus</strong>. Only a massive, concentrated charge could turn a fast alpha particle back.</td></tr></table></div>
<p>A vacuum is needed so the alpha particles are not absorbed by air; the foil is very thin so each alpha is scattered by only one nucleus.</p>

<h2>The nuclear model of the atom</h2>
<ul>
<li>The atom has a diameter of about <strong>10<sup>−10</sup> m</strong>. The nucleus is about <strong>10<sup>−15</sup>–10<sup>−14</sup> m</strong> across: around 100 000 times smaller. If the atom were a stadium, the nucleus would be a pea in the centre.</li>
<li>The nucleus contains <strong>protons</strong> (charge +e) and <strong>neutrons</strong> (no charge), together called <strong>nucleons</strong>. Electrons (charge −e, about 1/1840 the mass of a proton) occupy the space around it.</li>
<li><strong>Proton number</strong> (atomic number) Z: the number of protons. It defines the element.</li>
<li><strong>Nucleon number</strong> (mass number) A: the total number of protons and neutrons. Neutrons = A − Z.</li>
<li>Notation: <sup>A</sup><sub>Z</sub>X, for example <sup>235</sup><sub>92</sub>U has 92 protons and 143 neutrons.</li>
<li><strong>Isotopes</strong>: atoms of the same element (same Z) with different numbers of neutrons (different A), such as carbon-12 and carbon-14. They have the same chemistry but different nuclear stability.</li>
</ul>
<h3>The size and density of nuclei</h3>
<p>Experiments show that the nuclear radius depends on the nucleon number:</p>
<div class="eqgrid"><div>R = r₀A<sup>1/3</sup></div></div>
<p>r₀ ≈ 1.2 fm (1 fm = 10<sup>−15</sup> m). Cube both sides: R³ ∝ A, so the <strong>volume of a nucleus is proportional to the number of nucleons</strong>. The nucleons are packed together like marbles in a bag, each taking up the same space. That means <strong>all nuclei have the same density</strong>, about 10<sup>17</sup> kg m<sup>−3</sup>, vastly more than ordinary matter (about 10<sup>3</sup>–10<sup>4</sup> kg m<sup>−3</sup>), because the atom is mostly empty space.</p>
<div class="wex"><p><strong>Worked example.</strong> Estimate the density of a nucleus. For any nucleus, mass ≈ A × 1.67 × 10<sup>−27</sup> kg and volume = 4/3 π(r₀A<sup>1/3</sup>)³ = 4/3 πr₀³A. The A cancels:</p>
<p>ρ = 1.67 × 10<sup>−27</sup>/(4/3 π(1.2 × 10<sup>−15</sup>)³) = <strong>2.3 × 10<sup>17</sup> kg m<sup>−3</sup></strong>.</p></div>

<h2>The strong nuclear force</h2>
<p>Protons in a nucleus are only about 10<sup>−15</sup> m apart, so their electrostatic repulsion is enormous. Something stronger must hold the nucleus together: the <strong>strong nuclear force</strong>.</p>
<ul>
<li>It acts between <strong>all nucleons</strong> (proton–proton, proton–neutron, neutron–neutron), but not on electrons.</li>
<li>It is <strong>attractive</strong> up to a separation of about <strong>3 fm</strong>, and very short range: beyond this it falls to nothing.</li>
<li>It is <strong>repulsive</strong> below about <strong>0.5 fm</strong>, which stops the nucleus collapsing.</li>
<li>Nucleons settle at around 1 fm apart, where the attraction is strongest.</li>
</ul>
<p>Because it is so short-range, a nucleon only feels its nearest neighbours, while electrostatic repulsion acts across the whole nucleus. Large nuclei need extra neutrons (which add attraction but no repulsion) to stay stable.</p>

<h2>Fundamental particles</h2>
<h3>Antiparticles</h3>
<p>Every particle has an <strong>antiparticle</strong> with the <strong>same mass</strong> but <strong>opposite charge</strong> (and other opposite properties). The positron (e<sup>+</sup>) is the antielectron; the antiproton has charge −e. When a particle meets its antiparticle they annihilate (below).</p>
<h3>Hadrons, leptons and quarks</h3>
<ul>
<li><strong>Hadrons</strong> are particles that feel the <strong>strong nuclear force</strong>. They are not fundamental: they are made of quarks. Protons and neutrons are hadrons.</li>
<li><strong>Leptons</strong> are <strong>fundamental</strong> particles (not made of anything smaller) that do <strong>not</strong> feel the strong force. They interact through the <strong>weak interaction</strong> (and electromagnetically if charged). Electrons, positrons and neutrinos are leptons. Neutrinos have no charge and almost no mass and hardly interact with anything.</li>
<li><strong>Quarks</strong> are fundamental particles that make up hadrons. You need three:</li>
</ul>
<div class="tbl"><table><tr><th>Quark</th><th>Symbol</th><th>Charge / e</th><th>Antiquark charge / e</th></tr>
<tr><td>up</td><td>u</td><td>+⅔</td><td>ū: −⅔</td></tr>
<tr><td>down</td><td>d</td><td>−⅓</td><td>d̄: +⅓</td></tr>
<tr><td>strange</td><td>s</td><td>−⅓</td><td>s̄: +⅓</td></tr></table></div>
<p><strong>Proton = uud</strong>: +⅔ + ⅔ − ⅓ = +1. <strong>Neutron = udd</strong>: +⅔ − ⅓ − ⅓ = 0. (Mesons, such as pions, are hadrons made of one quark and one antiquark.)</p>
<h3>Beta decay and the weak interaction</h3>
<p>Beta decay changes the identity of a nucleon by changing one of its quarks. This is caused by the <strong>weak interaction</strong> (the weak nuclear force).</p>
<ul>
<li><strong>β<sup>−</sup> decay</strong>: a neutron becomes a proton, emitting an electron and an electron <strong>antineutrino</strong>. In quarks: <strong>d → u + e<sup>−</sup> + ν̄</strong>, so udd becomes uud. n → p + e<sup>−</sup> + ν̄. Happens in nuclei with too many neutrons.</li>
<li><strong>β<sup>+</sup> decay</strong>: a proton becomes a neutron, emitting a positron and an electron <strong>neutrino</strong>. In quarks: <strong>u → d + e<sup>+</sup> + ν</strong>. p → n + e<sup>+</sup> + ν. Happens in nuclei with too many protons.</li>
</ul>
<p>In every interaction, <strong>charge</strong>, <strong>nucleon (baryon) number</strong> and <strong>lepton number</strong> are conserved. Check charge in β<sup>−</sup>: 0 → +1 − 1 + 0. ✓ The neutrino was predicted because, without it, beta particles would always come out with the same energy; in fact they have a range of energies, the rest being carried off by the (anti)neutrino.</p>

<h2>Radioactive decay</h2>
<p>Some nuclei are unstable and decay, emitting radiation, to become more stable. Decay is:</p>
<ul>
<li><strong>Spontaneous</strong>: not affected by external conditions such as temperature, pressure or chemical combination.</li>
<li><strong>Random</strong>: you cannot predict which nucleus will decay next, or when a particular nucleus will decay. Each nucleus has a fixed <strong>probability</strong> of decaying per unit time. The randomness shows up as fluctuations in the count rate from a Geiger–Müller tube.</li>
</ul>
<div class="tbl"><table><tr><th>Radiation</th><th>Nature</th><th>Charge</th><th>Ionising</th><th>Range in air</th><th>Stopped by</th></tr>
<tr><td>Alpha α</td><td>helium nucleus, 2 protons + 2 neutrons</td><td>+2e</td><td>strongly</td><td>a few cm</td><td>a sheet of paper, or skin</td></tr>
<tr><td>Beta-minus β<sup>−</sup></td><td>fast electron</td><td>−e</td><td>moderately</td><td>about 1 m</td><td>a few mm of aluminium</td></tr>
<tr><td>Beta-plus β<sup>+</sup></td><td>fast positron</td><td>+e</td><td>—</td><td>annihilates almost immediately</td><td>—</td></tr>
<tr><td>Gamma γ</td><td>high-energy EM photon</td><td>0</td><td>weakly</td><td>very long: intensity falls by the inverse square law</td><td>reduced (not fully stopped) by several cm of lead or metres of concrete</td></tr></table></div>
<p>Alpha particles are the most ionising because they are big, slow and doubly charged: they interact strongly with every atom they pass, losing energy quickly. That is also why they have the shortest range.</p>
<h3>Identifying radiation by absorption (PAG 7)</h3>
<p>Measure the <strong>background count</strong> first (with no source) and subtract it from every reading. Place the source in front of a Geiger–Müller tube and record the count rate with no absorber, then with paper, a few mm of aluminium and several cm of lead between them. A big drop with paper means α is present; a drop with aluminium means β; radiation still getting through the aluminium is γ. To investigate how γ is absorbed, measure count rate against lead thickness. Safety: handle sources with tongs, keep them pointed away from people, keep exposure time short and return them to their lead-lined boxes.</p>
<h3>Decay equations</h3>
<p>Nucleon number and proton number must balance on both sides.</p>
<ul>
<li>Alpha: <sup>A</sup><sub>Z</sub>X → <sup>A−4</sup><sub>Z−2</sub>Y + <sup>4</sup><sub>2</sub>α. Example: <sup>226</sup><sub>88</sub>Ra → <sup>222</sup><sub>86</sub>Rn + <sup>4</sup><sub>2</sub>α.</li>
<li>Beta-minus: <sup>A</sup><sub>Z</sub>X → <sup>A</sup><sub>Z+1</sub>Y + <sup>0</sup><sub>−1</sub>e + ν̄. Example: <sup>14</sup><sub>6</sub>C → <sup>14</sup><sub>7</sub>N + <sup>0</sup><sub>−1</sub>e + ν̄.</li>
<li>Beta-plus: <sup>A</sup><sub>Z</sub>X → <sup>A</sup><sub>Z−1</sub>Y + <sup>0</sup><sub>+1</sub>e + ν.</li>
<li>Gamma: no change in A or Z. The nucleus just loses energy, usually straight after an α or β decay.</li>
</ul>

<h2>Activity, decay constant and half-life</h2>
<ul>
<li><strong>Activity</strong> A: the number of nuclei decaying per second, in <strong>becquerels</strong> (1 Bq = 1 decay per second).</li>
<li><strong>Decay constant</strong> λ: the probability that an individual nucleus will decay per unit time, in s<sup>−1</sup>.</li>
</ul>
<p>If there are N undecayed nuclei, each with probability λ of decaying per second, the number decaying per second is:</p>
<div class="eqgrid"><div>A = λN</div><div>ΔN/Δt = −λN</div></div>
<p>The rate of decay is <strong>proportional to the number of nuclei remaining</strong>: exponential decay, exactly as for a discharging capacitor (6.1). The solutions are:</p>
<div class="eqgrid"><div>N = N₀e<sup>−λt</sup></div><div>A = A₀e<sup>−λt</sup></div></div>
<p><strong>Half-life</strong> t<sub>½</sub>: the average time taken for half the undecayed nuclei of an isotope to decay (or for the activity to halve). Putting N = ½N₀: ½ = e<sup>−λt½</sup>, so:</p>
<div class="eqgrid"><div>λt<sub>½</sub> = ln 2</div></div>
<p>After n half-lives, the fraction remaining is (½)<sup>n</sup>. Half-lives range from fractions of a second to billions of years.</p>
<div class="wex"><p><strong>Worked example.</strong> Iodine-131 has a half-life of 8.0 days. A sample has an activity of 4.0 MBq. Find (a) λ, (b) the number of I-131 nuclei, (c) the activity after 20 days.</p>
<p>(a) λ = ln 2/(8.0 × 86 400) = <strong>1.0 × 10<sup>−6</sup> s<sup>−1</sup></strong>.</p>
<p>(b) N = A/λ = 4.0 × 10<sup>6</sup>/1.0 × 10<sup>−6</sup> = <strong>4.0 × 10<sup>12</sup></strong>.</p>
<p>(c) A = 4.0e<sup>−(ln 2/8.0) × 20</sup> = 4.0 × 0.177 = <strong>0.71 MBq</strong>.</p>
<p>(Remember to use λ in s<sup>−1</sup> with A in Bq; or keep both λ and t in days for the exponential.)</p></div>
<h3>Measuring half-life (PAG 7)</h3>
<p>The protactinium generator: a bottle containing uranium compounds produces protactinium-234m (half-life about 70 s). Shaking separates it into a layer next to a GM tube. Record the count rate every 10 s, subtract background, and plot ln(count rate) against time: the gradient is −λ, so t<sub>½</sub> = ln 2/λ.</p>
<h3>Modelling decay</h3>
<ul>
<li><strong>Dice simulation</strong>: start with, say, 100 dice; each throw represents a time interval. Remove every die that shows a six (probability ⅙ = "λΔt") and count those left. Repeat. A graph of number remaining against throw number is an exponential decay, with a "half-life" of about 3.8 throws. It shows that decay is random for each die but predictable for large numbers.</li>
<li><strong>Spreadsheet</strong>: use ΔN = −λNΔt in steps, as for the capacitor in 6.1.</li>
</ul>

<h2>Radioactive dating</h2>
<p><strong>Carbon dating</strong>: carbon-14 is made continuously in the upper atmosphere by cosmic rays and decays with t<sub>½</sub> ≈ 5700 years. Living things constantly take in carbon, so they keep the same ratio of C-14 to C-12 as the atmosphere. When an organism dies, it stops taking in carbon and its C-14 decays. Comparing the activity per gram of carbon in a sample with that of living material gives its age, using A = A₀e<sup>−λt</sup>.</p>
<div class="wex"><p><strong>Worked example.</strong> A piece of ancient wood has 25% of the C-14 activity of fresh wood. That is two half-lives: about <strong>11 400 years</strong>. For a non-whole number, solve t = ln(A₀/A)/λ.</p></div>
<p>Limitations: assumes the atmospheric C-14 ratio has always been the same (it has varied, and nuclear tests changed it); very old samples (more than about 50 000 years) have so little activity left that it is swamped by background radiation; samples must be large enough and uncontaminated. Other isotopes date rocks: potassium-40 to argon-40 (t<sub>½</sub> 1.3 billion years) and uranium–lead.</p>

<h2>Mass and energy</h2>
<p>Einstein showed that mass and energy are equivalent:</p>
<div class="eqgrid"><div>ΔE = Δmc²</div></div>
<p>Any change in energy comes with a change in mass. Since c² is huge (9 × 10<sup>16</sup>), a tiny mass corresponds to an enormous energy. In nuclear physics, masses are often given in atomic mass units: 1 u = 1.661 × 10<sup>−27</sup> kg, equivalent to 931.5 MeV.</p>
<h3>Annihilation and pair production</h3>
<ul>
<li><strong>Annihilation</strong>: when a particle meets its antiparticle, their total mass is converted into energy in the form of <strong>two gamma photons</strong>, travelling in opposite directions (two photons are needed to conserve momentum). For an electron and positron at rest, each photon has energy m<sub>e</sub>c² = 0.511 MeV. This is the basis of PET scanning (6.5).</li>
<li><strong>Pair production</strong>: a high-energy photon, passing close to a nucleus, turns into a particle and its antiparticle. The photon needs at least enough energy to create both masses: E ≥ 2mc². For an electron–positron pair, at least 1.02 MeV; any extra becomes their kinetic energy.</li>
</ul>

<h2>Binding energy</h2>
<p>Measure the mass of a nucleus and it is always <strong>less</strong> than the total mass of its separate protons and neutrons.</p>
<ul>
<li><strong>Mass defect</strong>: the difference between the total mass of the separate nucleons and the mass of the nucleus.</li>
<li><strong>Binding energy</strong>: the minimum energy needed to separate a nucleus completely into its individual protons and neutrons. Binding energy = mass defect × c².</li>
</ul>
<p>When nucleons come together to form a nucleus, energy is released (it falls into the strong force's "pull"), and that energy carries away mass. To pull them apart again, you would have to put the binding energy back in.</p>
<div class="wex"><p><strong>Worked example: helium-4.</strong> m<sub>p</sub> = 1.673 × 10<sup>−27</sup> kg, m<sub>n</sub> = 1.675 × 10<sup>−27</sup> kg, mass of He-4 nucleus = 6.646 × 10<sup>−27</sup> kg.</p>
<p>Separate nucleons: 2 × 1.673 + 2 × 1.675 = 6.696 × 10<sup>−27</sup> kg. Mass defect = 0.050 × 10<sup>−27</sup> = 5.0 × 10<sup>−29</sup> kg.</p>
<p>Binding energy = 5.0 × 10<sup>−29</sup> × (3.00 × 10<sup>8</sup>)² = 4.5 × 10<sup>−12</sup> J = <strong>28 MeV</strong>, or 7.0 MeV per nucleon.</p></div>
<h3>Binding energy per nucleon</h3>
<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="Binding energy per nucleon against nucleon number, peaking at iron-56; fusion on the left, fission on the right">
<line class="ax" x1="50" y1="200" x2="500" y2="200" marker-end="url(#ah)"/><line class="ax" x1="50" y1="200" x2="50" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M55 180 L62 110 L70 90 C80 60 110 45 140 40 C200 38 300 48 480 70"/>
<circle cx="140" cy="40" r="4" class="dotb"/><text x="146" y="36" class="small">Fe-56 (≈ 8.8 MeV)</text><circle cx="70" cy="62" r="3" class="dotb"/><text x="76" y="70" class="small">He-4</text>
<text x="60" y="140" class="small lbl2">fusion →</text><text x="360" y="100" class="small lbl2">← fission</text><text x="430" y="218" class="small">A</text><text x="4" y="30" class="small">BE/A</text></svg>
<p>The <strong>binding energy per nucleon</strong> measures how tightly bound, and so how stable, a nucleus is. Plotted against A, it rises steeply for light nuclei, peaks at about <strong>8.8 MeV for iron-56</strong> (the most stable nucleus), then falls slowly for heavy nuclei. He-4 is unusually stable for its size.</p>
<p>Any nuclear reaction that moves the products <strong>towards the peak</strong> increases the total binding energy, so it releases energy (the products have less mass than the reactants):</p>
<ul>
<li><strong>Fusion</strong> of light nuclei (left of the peak) releases energy.</li>
<li><strong>Fission</strong> of heavy nuclei (right of the peak) releases energy.</li>
</ul>
<p>Energy released = total binding energy of products − total binding energy of reactants = (mass before − mass after) × c².</p>

<h2>Nuclear fission</h2>
<p><strong>Induced fission</strong>: a slow-moving (thermal) neutron is absorbed by a uranium-235 nucleus, making unstable U-236, which splits into two smaller nuclei of roughly similar size, releasing <strong>2 or 3 neutrons</strong> and about 200 MeV of energy (mostly as kinetic energy of the fragments). For example:</p>
<p><sup>1</sup><sub>0</sub>n + <sup>235</sup><sub>92</sub>U → <sup>141</sup><sub>56</sub>Ba + <sup>92</sup><sub>36</sub>Kr + 3 <sup>1</sup><sub>0</sub>n</p>
<p>The released neutrons can cause further fissions, which release more neutrons: a <strong>chain reaction</strong>. Uncontrolled, it is a bomb; in a reactor it is controlled so that, on average, exactly <strong>one</strong> neutron from each fission goes on to cause another fission.</p>
<h3>The fission reactor</h3>
<ul>
<li><strong>Fuel rods</strong>: uranium enriched to about 3% U-235 (natural uranium is mostly U-238, which does not fission with slow neutrons).</li>
<li><strong>Moderator</strong> (water or graphite): neutrons from fission are too fast to be captured easily by U-235. Colliding with the moderator's light nuclei slows them down to thermal speeds. Light nuclei are best because a neutron loses most energy in a collision with something of similar mass.</li>
<li><strong>Control rods</strong> (boron or cadmium): absorb neutrons. Lowering them in reduces the number of neutrons and slows the reaction; raising them speeds it up. They can be dropped in fully to shut the reactor down.</li>
<li><strong>Coolant</strong> (water or carbon dioxide): carries the heat away to make steam, which drives turbines.</li>
<li><strong>Shielding</strong>: thick steel and concrete absorb radiation.</li>
</ul>
<h3>Nuclear waste</h3>
<p>Spent fuel contains fission products that are highly radioactive, some with very long half-lives (thousands of years). It is handled remotely, stored in cooling ponds under water (which absorbs radiation and heat) until its activity falls, then sealed into glass (vitrification) in steel containers and planned to be buried deep underground in geologically stable sites.</p>

<h2>Nuclear fusion</h2>
<p>In <strong>fusion</strong>, two light nuclei join to form a heavier nucleus, releasing energy. Example: deuterium + tritium → helium + neutron, releasing 17.6 MeV.</p>
<p>Conditions needed:</p>
<ul>
<li><strong>Very high temperature</strong> (around 10<sup>7</sup>–10<sup>8</sup> K). Both nuclei are positive and repel each other strongly. They need very high kinetic energies to overcome this electrostatic repulsion and get close enough (about 3 fm) for the strong nuclear force to pull them together.</li>
<li><strong>High density</strong> (and enough time), so that collisions happen often enough to keep the reaction going.</li>
</ul>
<p>Stars achieve this with gravity (5.5). On Earth, fusion reactors (tokamaks) hold very hot plasma in magnetic fields, but sustaining a reaction that releases more energy than it consumes is still very difficult. Fusion releases more energy per kilogram of fuel than fission, uses abundant fuel and produces little long-lived waste.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> in "describe and explain" questions about alpha scattering, pair each observation with its conclusion, as in the table. Saying only "the nucleus is small and dense" does not get the marks for the evidence.</p></blockquote>
`;

N['6.5']=`
<h2>Producing X-rays</h2>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="X-ray tube: heated cathode emits electrons accelerated to tungsten target on rotating anode; X-rays emitted through window">
<rect x="30" y="40" width="440" height="110" rx="50" class="ax dash"/><text x="200" y="34" class="small">evacuated glass tube</text>
<rect x="60" y="80" width="30" height="30" class="fill2 ax"/><text x="40" y="132" class="small">heated cathode (−)</text>
<line class="c1 thick" x1="95" y1="95" x2="355" y2="95" marker-end="url(#ahb)"/><text x="170" y="88" class="small lbl1">electrons, ≈ 100 kV</text>
<path class="fill1 ax" d="M360 60 L410 60 L410 130 L380 130 Z"/><text x="385" y="54" class="small">tungsten target (anode +)</text>
<line class="c2 dash" x1="370" y1="110" x2="330" y2="190" marker-end="url(#aha)"/><line class="c2 dash" x1="372" y1="110" x2="360" y2="195" marker-end="url(#aha)"/><text x="260" y="190" class="small lbl2">X-rays</text></svg>
<p>X-rays are high-energy electromagnetic photons (wavelengths around 10<sup>−8</sup> to 10<sup>−13</sup> m). An <strong>X-ray tube</strong> makes them like this:</p>
<ol>
<li>A <strong>heater</strong> warms the <strong>cathode</strong> (a filament). Electrons gain enough energy to escape from its surface: <strong>thermionic emission</strong>.</li>
<li>A very large p.d. (a <strong>high-voltage supply</strong>, typically 30–150 kV) between the cathode and the <strong>anode</strong> accelerates the electrons across the tube. The tube is evacuated so the electrons do not collide with air molecules.</li>
<li>The electrons smash into a <strong>target metal</strong> (usually tungsten) on the anode. As they decelerate rapidly, they lose kinetic energy, and some of it is emitted as X-ray photons (called bremsstrahlung, "braking radiation").</li>
</ol>
<p>Each electron arrives with kinetic energy eV, so the <strong>maximum X-ray photon energy is eV</strong> and the minimum wavelength is λ<sub>min</sub> = hc/eV. Increasing the accelerating voltage gives more energetic, more penetrating X-rays; increasing the heater current gives more electrons and so a greater X-ray intensity.</p>
<p>Only about 1% of the electrons' energy becomes X-rays; 99% heats the target. So the target is a metal with a <strong>high melting point</strong> (tungsten), the anode is often <strong>rotated</strong> to spread the heating, and it is cooled with oil. A lead casing absorbs X-rays except through a window that lets the beam out.</p>

<h2>How X-rays are attenuated</h2>
<p>As X-rays pass through matter, the beam's intensity falls (it is <strong>attenuated</strong>) because photons are absorbed or scattered. Four mechanisms, each dominant at different photon energies:</p>
<div class="tbl"><table><tr><th>Mechanism</th><th>Photon energy</th><th>What happens</th></tr>
<tr><td>Simple scatter</td><td>1–20 keV</td><td>The photon has too little energy to remove an electron. It bounces off an electron and is scattered <strong>without losing energy</strong>.</td></tr>
<tr><td>Photoelectric effect</td><td>below about 100 keV</td><td>The photon is <strong>completely absorbed</strong> by an electron, which is ejected from the atom. (Most important in diagnostic X-ray imaging, and strongly depends on proton number Z, which is why bone shows up.)</td></tr>
<tr><td>Compton effect</td><td>0.5–5 MeV</td><td>The photon is <strong>scattered</strong> by an electron and loses some of its energy; the electron is ejected. The scattered photon has a longer wavelength.</td></tr>
<tr><td>Pair production</td><td>above 1.02 MeV</td><td>The photon passes close to a nucleus and turns into an <strong>electron–positron pair</strong>. 1.02 MeV is the energy equivalent of their two masses.</td></tr></table></div>

<h2>The attenuation equation</h2>
<div class="eqgrid"><div>I = I₀e<sup>−μx</sup></div></div>
<p>I₀ is the initial intensity, I the intensity after passing through a thickness x, and μ the <strong>attenuation (absorption) coefficient</strong> of the material, in m<sup>−1</sup> (or cm<sup>−1</sup>). Each layer of equal thickness removes the same fraction of the beam, so intensity decreases exponentially.</p>
<p>μ depends on the material (dense, high-Z materials like bone and lead have large μ) and on the photon energy (higher energy X-rays usually penetrate further). The <strong>half-value thickness</strong> x<sub>½</sub> = ln 2/μ is the thickness that halves the intensity.</p>
<div class="wex"><p><strong>Worked example.</strong> For a particular X-ray beam, μ = 0.20 cm<sup>−1</sup> in soft tissue and 3.0 cm<sup>−1</sup> in bone. Compare the fraction transmitted through 2.0 cm of each.</p>
<p>Tissue: I/I₀ = e<sup>−0.20 × 2.0</sup> = <strong>0.67</strong>. Bone: e<sup>−3.0 × 2.0</sup> = <strong>0.0025</strong>.</p>
<p>Bone lets through hardly any X-rays, so it shows up white on the image, against darker soft tissue. This difference is the <strong>contrast</strong>.</p></div>

<h2>Contrast media</h2>
<p>Different soft tissues (stomach, intestine, blood vessels) have very similar attenuation coefficients, so they barely show up on a normal X-ray. A <strong>contrast medium</strong> is a substance with a <strong>high proton number</strong> (and so a high attenuation coefficient, as it absorbs X-rays strongly by the photoelectric effect) put into the organ to make it visible:</p>
<ul>
<li><strong>Barium</strong> (Z = 56), as a barium sulfate "meal", is swallowed to image the digestive system.</li>
<li><strong>Iodine</strong> (Z = 53) compounds are injected into the blood to image blood vessels (angiography) and organs like the kidneys.</li>
</ul>

<h2>CAT scans (computerised axial tomography)</h2>
<p>A normal X-ray is a flat shadow: structures at different depths overlap. A CAT (or CT) scan builds up a 3D picture.</p>
<ul>
<li>The patient lies on a table inside a ring.</li>
<li>An <strong>X-ray tube rotates</strong> around the patient, producing a <strong>thin, fan-shaped beam</strong>.</li>
<li>A <strong>ring of detectors</strong> on the opposite side measures the intensity of the X-rays that pass through, from every angle.</li>
<li>The table moves the patient through the ring so that slice after slice is scanned (or it spirals continuously).</li>
<li><strong>Computer software</strong> combines all the readings to reconstruct a 2D image of each slice, and stacks the slices into a 3D image, shown on a <strong>display</strong>.</li>
</ul>
<p><strong>Advantages over a plain X-ray image</strong>: it produces 3D images that can be rotated and viewed from any angle; it shows the depth and position of structures; it can distinguish between soft tissues with very similar attenuation coefficients.</p>
<p><strong>Disadvantages</strong>: a much higher dose of ionising radiation (many X-ray images' worth); expensive; takes longer; the patient must keep very still.</p>

<h2>Medical tracers</h2>
<p>A <strong>medical tracer</strong> is a radioactive substance (a radioisotope attached to a chemical the body uses) put into the body, usually by injection, so its movement and where it builds up can be tracked from outside with a gamma camera or PET scanner. This shows how organs are <strong>functioning</strong>, not just their structure.</p>
<p>A good tracer should: emit <strong>gamma</strong> rays (which escape the body and are weakly ionising; alpha and beta would be absorbed and damage tissue); have a <strong>short half-life</strong> (hours), long enough for the scan but so the patient's dose is low; be non-toxic; and be easy to prepare.</p>
<ul>
<li><strong>Technetium-99m</strong>: emits 140 keV gamma rays only, half-life 6 hours. Made on site in hospitals from molybdenum-99. ("m" means metastable: an excited state of the nucleus.) Can be attached to many different compounds to study the bones, heart, brain, thyroid, lungs and kidneys.</li>
<li><strong>Fluorine-18</strong>: a <strong>β<sup>+</sup> (positron) emitter</strong>, half-life 110 minutes, used in PET. Attached to glucose to make FDG (fluorodeoxyglucose), which collects in cells that use a lot of glucose, such as active brain regions and cancer cells. Made in a cyclotron.</li>
</ul>

<h2>The gamma camera</h2>
<p>A gamma camera detects the gamma rays from a tracer to build an image of where the tracer is in the body. It has five parts:</p>
<ol>
<li><strong>Collimator</strong>: a thick lead plate with thousands of long, narrow parallel holes. Only gamma photons travelling straight along the holes (parallel to them) get through; the rest are absorbed by the lead. This ensures each photon detected comes from directly beneath that point, so the image is sharp.</li>
<li><strong>Scintillator</strong>: a large crystal of sodium iodide. Each gamma photon that hits it produces thousands of visible-light photons (a flash of light).</li>
<li><strong>Photomultiplier tubes</strong>: an array of tubes behind the scintillator. Each converts the light into an electrical pulse (light releases electrons by the photoelectric effect, then the number of electrons is multiplied greatly).</li>
<li><strong>Computer</strong>: compares the size of the pulses from neighbouring photomultipliers to work out exactly where each flash happened, and so where in the body the gamma ray came from.</li>
<li><strong>Display</strong>: shows the image: areas with lots of tracer ("hot spots") and little tracer.</li>
</ol>
<p><strong>Diagnosis</strong>: bone scans (cancer spread, fractures), heart muscle blood flow, kidney and thyroid function, blood flow in the brain and lungs. The image shows function but has poor resolution compared with a CT scan.</p>

<h2>PET scanning (positron emission tomography)</h2>
<ol>
<li>The patient is injected with a positron-emitting tracer, usually F-18 in FDG, which collects in tissues with high metabolic activity.</li>
<li>Each emitted positron travels a millimetre or so, then meets an electron and <strong>annihilates</strong>, producing <strong>two gamma photons, each of 511 keV, travelling in exactly opposite directions</strong> (to conserve momentum).</li>
<li>A <strong>ring of gamma detectors</strong> around the patient registers both photons. The annihilation must have happened on the straight line joining the two detectors.</li>
<li>The tiny <strong>difference in their arrival times</strong> shows where along that line it happened: the photon that travelled less far arrived first. (Δx = cΔt/2.)</li>
<li>A computer collects millions of these events and builds a 3D image of where the tracer is concentrated.</li>
</ol>
<p><strong>Diagnosis</strong>: finding cancers and whether they have spread (tumours use glucose fast), studying brain function (in dementia, epilepsy, strokes), and heart disease. <strong>Disadvantages</strong>: very expensive; F-18's short half-life means a cyclotron must be nearby; radiation dose to the patient. PET is often combined with a CT scan, which supplies the structure while PET shows the function.</p>

<h2>Ultrasound</h2>
<p><strong>Ultrasound is a longitudinal (sound) wave with a frequency above 20 kHz</strong>, the upper limit of human hearing. Medical ultrasound uses about 1–15 MHz. It is not ionising, so it is safe for imaging fetuses.</p>
<h3>The piezoelectric transducer</h3>
<p>A <strong>piezoelectric crystal</strong> (such as quartz or lead zirconate titanate) changes shape when a p.d. is applied across it, and produces a p.d. when it is squashed or stretched. This is the <strong>piezoelectric effect</strong>. An ultrasound <strong>transducer</strong> uses it both ways:</p>
<ul>
<li>As a <strong>transmitter</strong>: an alternating p.d. at the crystal's resonant frequency makes it vibrate strongly, producing ultrasound. Short pulses are used.</li>
<li>As a <strong>receiver</strong>: returning echoes make the crystal vibrate, producing a small alternating p.d. that is amplified and processed. Between transmitted pulses, the same crystal listens for echoes.</li>
</ul>
<p>Ultrasound reflects at every boundary between tissues. The time taken for an echo to return gives the depth of the boundary: if the speed of sound in tissue is c and the echo returns after time t, the boundary is at depth <strong>d = ct/2</strong> (the pulse goes there and back).</p>
<h3>A-scans and B-scans</h3>
<ul>
<li><strong>A-scan</strong> (amplitude scan): the transducer stays in one position and sends pulses in one direction. The echoes are shown as spikes on a graph of amplitude against time. The time between spikes gives the distances between boundaries. Used to measure distances, for example the depth of the eye (before cataract surgery) or the width of a baby's head.</li>
<li><strong>B-scan</strong> (brightness scan): the transducer is moved over the body (or contains an array of crystals). Each echo is shown as a dot whose <strong>brightness</strong> depends on the strength of the reflection, at a position given by its depth. Many lines together build a 2D image, as in pregnancy scans.</li>
</ul>

<h2>Acoustic impedance and reflection</h2>
<p>How much ultrasound reflects at a boundary depends on the <strong>acoustic impedance</strong> Z of the two materials:</p>
<div class="eqgrid"><div>Z = ρc</div><div>I<sub>r</sub>/I₀ = (Z₂ − Z₁)² / (Z₂ + Z₁)²</div></div>
<p>ρ is the density and c the speed of sound in the material. The unit of Z is kg m<sup>−2</sup> s<sup>−1</sup>. The second equation gives the <strong>fraction of intensity reflected</strong> at a boundary between materials of impedance Z₁ and Z₂. The bigger the difference in Z, the more is reflected.</p>
<div class="wex"><p><strong>Worked example.</strong> Z for air ≈ 430, for soft tissue ≈ 1.6 × 10<sup>6</sup>, for bone ≈ 7.8 × 10<sup>6</sup> kg m<sup>−2</sup> s<sup>−1</sup>.</p>
<p>Air–tissue: (1.6 × 10<sup>6</sup> − 430)²/(1.6 × 10<sup>6</sup> + 430)² ≈ <strong>0.999</strong>: 99.9% reflected.</p>
<p>Tissue–bone: (7.8 − 1.6)²/(7.8 + 1.6)² = <strong>0.44</strong>: 44% reflected.</p></div>
<h3>Impedance matching and coupling gel</h3>
<p>Almost all ultrasound reflects at an air–skin boundary, so even a thin layer of air between the transducer and the skin would stop any ultrasound getting in. A <strong>coupling gel</strong> with an acoustic impedance close to that of skin is spread on first. It fills the gaps and removes the air, so very little ultrasound is reflected at the skin and most passes into the body. This is <strong>impedance matching</strong>.</p>
<p>Because so much reflects from bone and gas, ultrasound cannot image structures behind bone or in the lungs well.</p>

<h2>Doppler ultrasound: measuring blood flow</h2>
<p>When ultrasound reflects off <strong>moving</strong> red blood cells, its frequency changes (the Doppler effect, see 5.5). Cells moving towards the transducer raise the frequency; cells moving away lower it. The change in frequency is:</p>
<div class="eqgrid"><div>Δf = 2fv cos θ / c</div></div>
<p>f is the transmitted frequency, v the speed of the blood, c the speed of ultrasound in tissue and θ the angle between the ultrasound beam and the direction of blood flow. The factor 2 appears because the shift happens twice: once when the moving cells receive the wave, and again when they re-emit it. The transducer is held at an angle (not at 90°, where cos θ = 0 and there would be no shift).</p>
<div class="wex"><p><strong>Worked example.</strong> 5.0 MHz ultrasound at 30° to an artery gives a frequency shift of 2.0 kHz. Speed of ultrasound in tissue = 1540 m s<sup>−1</sup>.</p>
<p>v = Δf c/(2f cos θ) = 2000 × 1540/(2 × 5.0 × 10<sup>6</sup> × cos 30°) = <strong>0.36 m s<sup>−1</sup></strong>.</p></div>
<p>Used to detect blocked or narrowed arteries, blood clots and heart valve problems, and to monitor the fetal heartbeat.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> for "compare imaging techniques" questions, use three headings: what it shows (structure or function), the radiation dose (ionising or not), and cost/availability. Ultrasound is non-ionising; X-ray and CT show structure; gamma camera and PET show function.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
