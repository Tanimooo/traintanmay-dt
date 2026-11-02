/* Module 6: Particles and medical physics */
(function(){
const S=window.SPEC, P=S.pack, M='6-Particles-and-Medical-Physics/';
const two=(sub,name)=>[P('Set O 2022–24',name+' QP',M+sub+'/Set-O/'+name+' QP.pdf'),P('Set O 2022–24',name+' MS',M+sub+'/Set-O/'+name+' MS.pdf'),P('Set N 2016–21',name+' QP',M+sub+'/Set-N/'+name+' QP.pdf'),P('Set N 2016–21',name+' MS',M+sub+'/Set-N/'+name+' MS.pdf')];
const seq=(sub,base,n)=>{const a=[];for(let i=1;i<=n;i++)a.push(P('Set M (legacy G485)',base+' '+i+' QP',M+sub+'/Set-M/'+base+' '+i+' QP.pdf'),P('Set M (legacy G485)',base+' '+i+' MS',M+sub+'/Set-M/'+base+' '+i+' MS.pdf'));return a;};
const c=(sub,name)=>[P('Set C (legacy G485)',name,M+sub+'/Set-C/'+name+'.pdf'),P('Set C (legacy G485)',name+' MS',M+sub+'/Set-C/'+name+' MS.pdf')];

S.addTopic({
id:'6.1',mod:6,title:'Capacitors',short:'Capacitance, series and parallel, energy stored, charging and discharging, time constant.',
labs:['capacitor'],pags:['p9-1','p9-2'],
spec:['Capacitance C = Q/V; the farad','Charging and discharging of a capacitor in terms of the flow of electrons','Total capacitance of two or more capacitors in series and in parallel','Analysis of circuits containing capacitors, including resistors; techniques to investigate capacitors (PAG9)','Potential difference across a capacitor is directly proportional to charge; area under a p.d.–charge graph is energy stored','W = ½QV, W = ½Q²/C, W = ½V²C; uses of capacitors as storage of energy','Charging and discharging through a resistor; time constant τ = CR','x = x₀e^(−t/CR) and x = x₀(1 − e^(−t/CR))','Graphical methods and spreadsheet modelling of ΔQ/Δt = −Q/CR; exponential decay; constant-ratio property'],
packs:two('6.1-Capacitors','6.1 Capacitors').concat(seq('6.1-Capacitors','Capacitors',2),c('6.1-Capacitors','Capacitors')),
notes:`
<h2>Capacitance</h2>
<p>A capacitor is two conducting plates separated by an insulator (dielectric). When connected to a supply, electrons are pushed onto one plate and removed from the other: the plates gain <strong>equal and opposite charge</strong>. <strong>Capacitance C = Q/V</strong>, the charge stored per unit p.d. 1 farad = 1 C V<sup>−1</sup>.</p>
<ul><li>Parallel: <strong>C = C₁ + C₂ + …</strong> (same p.d., charges add).</li><li>Series: <strong>1/C = 1/C₁ + 1/C₂ + …</strong> (same charge on each, p.d.s add).</li></ul>
<blockquote class="tip"><p>The rules are the opposite way round from resistors.</p></blockquote>
<h2>Energy stored</h2>
<p>The area under a V–Q graph (a straight line through the origin) is the energy stored: <strong>W = ½QV = ½CV² = ½Q²/C</strong>. Only half the energy taken from the supply is stored; the other half is dissipated in the resistance of the circuit. Uses: camera flash, back-up power, defibrillators, smoothing.</p>
<h2>Charging and discharging through a resistor</h2>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Discharge and charge curves: exponential decay of V, Q, I; V across capacitor rising to supply during charging">
<g><line class="ax" x1="30" y1="180" x2="260" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" d="M30 30 C70 105 110 140 160 160 C200 172 230 176 255 178"/><line class="dash ax" x1="85" y1="180" x2="85" y2="85"/><line class="dash ax" x1="30" y1="85" x2="85" y2="85"/><text x="74" y="196" class="small">CR</text><text x="36" y="80" class="small">0.37V₀</text><text x="100" y="40" class="small">discharge: V, Q, I</text></g>
<g transform="translate(290 0)"><line class="ax" x1="30" y1="180" x2="260" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" d="M30 180 C70 105 110 70 160 50 C200 38 230 34 255 32"/><path class="c2" d="M30 30 C70 105 110 140 160 160 C200 172 230 176 255 178"/><line class="dash ax" x1="85" y1="180" x2="85" y2="85"/><text x="74" y="196" class="small">CR</text><text x="120" y="44" class="small lbl1">V<tspan dy="3" font-size="9">C</tspan><tspan dy="-3">, Q (0.63 at CR)</tspan></text><text x="140" y="150" class="small lbl2">I, V<tspan dy="3" font-size="9">R</tspan></text></g></svg>
<p>The <strong>time constant τ = CR</strong> is the time for the charge (or p.d., or current) to fall to 1/e ≈ 37% of its initial value during discharge, or to rise to 63% of its final value during charging.</p>
<ul><li>Discharge: <strong>x = x₀ e<sup>−t/CR</sup></strong> for Q, V and I.</li><li>Charge: V<sub>C</sub> = V₀(1 − e<sup>−t/CR</sup>) and Q = Q₀(1 − e<sup>−t/CR</sup>); current I = I₀e<sup>−t/CR</sup>.</li><li>Time to halve: t<sub>½</sub> = CR ln 2 ≈ 0.69CR.</li><li><strong>Constant-ratio property</strong>: in equal time intervals, the value falls by the same fraction.</li><li>ln V = ln V₀ − t/CR: plot ln V against t, gradient = −1/CR (PAG 9.1).</li></ul>
<h2>Iterative (spreadsheet) modelling</h2>
<p>ΔQ = −(Q/CR) Δt. Starting from Q₀, repeatedly calculate the charge lost in a small time step and subtract. Smaller Δt gives a closer match to the exponential.</p>`,
eqs:[['C = Q/V','Capacitance'],['C = C₁ + C₂','Parallel'],['1/C = 1/C₁ + 1/C₂','Series'],['W = ½QV = ½CV² = ½Q²/C','Energy stored'],['τ = CR','Time constant'],['x = x₀e<sup>−t/CR</sup>','Discharge'],['x = x₀(1 − e<sup>−t/CR</sup>)','Charging (V, Q)'],['ΔQ/Δt = −Q/CR','Rate of discharge']],
terms:[['Capacitance','Charge stored per unit p.d. across a capacitor.'],['Farad','Capacitance of a capacitor that stores 1 C per volt.'],['Dielectric','Insulating material between the plates of a capacitor.'],['Time constant','The product CR; time for charge to fall to 1/e (37%) of its initial value during discharge.'],['Exponential decay','A quantity decreases by the same fraction in equal time intervals.']],
mcq:[
{q:'A 470 μF capacitor is charged to 12 V. Energy stored =',o:['34 mJ','2.8 mJ','68 mJ','5.6 mJ'],a:0,e:'½ × 470 × 10⁻⁶ × 144 = 0.034 J.'},
{q:'Capacitors of 2.0 μF and 3.0 μF are in series. Total capacitance =',o:['5.0 μF','1.2 μF','0.83 μF','6.0 μF'],a:1,e:'1/C = 1/2 + 1/3 → C = 1.2 μF.'},
{q:'A capacitor discharges through a resistor. After one time constant, the p.d. is what percentage of the starting value?',o:['50%','63%','37%','0%'],a:2,e:'e⁻¹ = 0.37.'},
{q:'C = 100 μF, R = 47 kΩ. The time for the charge to halve is',o:['4.7 s','3.3 s','6.8 s','0.47 s'],a:1,e:'CR ln 2 = 4.7 × 0.693 = 3.3 s.'},
{q:'The p.d. across a capacitor is doubled. The energy stored is',o:['halved','doubled','quadrupled','unchanged'],a:2,e:'W ∝ V².'},
{q:'A graph of ln I against t during discharge has gradient −0.20 s⁻¹. CR =',o:['0.20 s','5.0 s','2.0 s','0.050 s'],a:1,e:'gradient = −1/CR.'}
],
exam:[
{id:'6.1-E1',marks:7,style:'Structured · discharge',stem:'A 2200 μF capacitor is charged to 9.0 V and then discharged through a 4.7 kΩ resistor.',parts:[
{q:'Calculate the initial charge and energy stored.',m:2,ms:['Q = CV = 2200 × 10⁻⁶ × 9.0 = 0.020 C (19.8 mC)','W = ½CV² = 0.089 J']},
{q:'Calculate the time constant and the p.d. after 15 s.',m:3,ms:['τ = CR = 2200 × 10⁻⁶ × 4700 = 10.3 s','V = 9.0 e^(−15/10.3)','= 2.1 V'],ans:'τ = 10 s; V = 2.1 V'},
{q:'Calculate the time for the p.d. to fall to 1.0 V.',m:2,ms:['t = CR ln(V₀/V) = 10.3 × ln 9','= 23 s']}]},
{id:'6.1-E2',marks:5,style:'Practical · PAG 9.1',stem:'A student records the p.d. across a discharging capacitor every 5 s using a voltmeter and stopwatch.',parts:[
{q:'Describe how a straight-line graph can be used to determine the time constant.',m:3,ms:['V = V₀e^(−t/CR) → ln V = ln V₀ − t/CR','plot ln V against t','gradient = −1/CR, so CR = −1/gradient']},
{q:'Suggest why a data-logger may give a more accurate result.',m:2,ms:['many readings at very short intervals / high sampling rate','avoids human reaction time error in reading V at exact times']}]}
]});

S.addTopic({
id:'6.2',mod:6,title:'Electric fields',short:'Coulomb’s law, uniform fields, potential, energy and charged particles in fields.',
labs:['efield','deflect'],pags:[],
spec:['Electric fields due to charges; electric field strength E = F/Q','Representing electric fields with field lines; uniform and radial fields','Similarities and differences between gravitational and electric fields','Coulomb’s law F = Qq/4πε₀r²; E = Q/4πε₀r² for a point charge','Uniform electric field E = V/d; parallel plate capacitor C = ε₀A/d (and permittivity, relative permittivity)','Motion of charged particles in a uniform electric field','Electric potential V = Q/4πε₀r; capacitance of an isolated sphere C = 4πε₀R','Force–distance graph; area under it as work done','Electric potential energy = Vq = Qq/4πε₀r'],
packs:[P('Set O 2022–24','6.2 Electrical Fields QP',M+'6.2-Electric-Fields/Set-O/6.2 Electrical Fields QP.pdf'),P('Set O 2022–24','6.2 Electrical Fields MS',M+'6.2-Electric-Fields/Set-O/6.2 Electrical Fields MS.pdf'),P('Set N 2016–21','6.2 Electrical Fields QP',M+'6.2-Electric-Fields/Set-N/6.2 Electrical Fields QP.pdf'),P('Set N 2016–21','6.2 Electrical Fields MS',M+'6.2-Electric-Fields/Set-N/6.2 Electrical Fields MS.pdf')].concat(seq('6.2-Electric-Fields','Electric Fields',3),c('6.2-Electric-Fields','Electric & Magnetic Fields')),
notes:`
<h2>Electric field strength</h2>
<p>An electric field is a region where a charge experiences a force. <strong>E = F/Q</strong>: the force per unit positive charge (N C<sup>−1</sup> = V m<sup>−1</sup>). Field lines point in the direction of force on a positive charge: away from positive, towards negative. A charged conducting sphere acts as a point charge at its centre.</p>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Radial field of a positive point charge and uniform field between parallel plates">
<g><circle cx="110" cy="105" r="16" class="fill1 ax"/><text x="104" y="110" class="lblw">+</text>
<g class="c1"><line x1="130" y1="105" x2="200" y2="105" marker-end="url(#ahb)"/><line x1="90" y1="105" x2="20" y2="105" marker-end="url(#ahb)"/><line x1="110" y1="85" x2="110" y2="15" marker-end="url(#ahb)"/><line x1="110" y1="125" x2="110" y2="195" marker-end="url(#ahb)"/><line x1="124" y1="91" x2="170" y2="45" marker-end="url(#ahb)"/><line x1="96" y1="91" x2="50" y2="45" marker-end="url(#ahb)"/><line x1="124" y1="119" x2="170" y2="165" marker-end="url(#ahb)"/><line x1="96" y1="119" x2="50" y2="165" marker-end="url(#ahb)"/></g><text x="60" y="205" class="small">radial field</text></g>
<g transform="translate(270 0)"><rect x="20" y="20" width="240" height="12" class="fill1 ax"/><rect x="20" y="178" width="240" height="12" class="fill2 ax"/><text x="264" y="30">+</text><text x="264" y="190">−</text>
<g class="c1"><line x1="50" y1="34" x2="50" y2="174" marker-end="url(#ahb)"/><line x1="100" y1="34" x2="100" y2="174" marker-end="url(#ahb)"/><line x1="150" y1="34" x2="150" y2="174" marker-end="url(#ahb)"/><line x1="200" y1="34" x2="200" y2="174" marker-end="url(#ahb)"/><line x1="240" y1="34" x2="240" y2="174" marker-end="url(#ahb)"/></g><text x="60" y="206" class="small">uniform field E = V/d</text></g></svg>
<h2>Coulomb's law</h2>
<p>The force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of their separation: <strong>F = Qq/4πε₀r²</strong>. Like charges repel, unlike attract. Field of a point charge: <strong>E = Q/4πε₀r²</strong>.</p>
<h2>Uniform fields and capacitors</h2>
<p>Between parallel plates: <strong>E = V/d</strong>. Parallel-plate capacitance <strong>C = ε₀A/d</strong>, or C = ε₀ε<sub>r</sub>A/d with a dielectric of relative permittivity ε<sub>r</sub> = ε/ε₀.</p>
<p>A charged particle entering a uniform field at right angles moves in a <strong>parabola</strong> (like a projectile): constant horizontal velocity, constant acceleration a = EQ/m parallel to the field.</p>
<h2>Electric potential and energy</h2>
<p><strong>Electric potential</strong> at a point: work done per unit positive charge to bring a small test charge from infinity to that point. <strong>V = Q/4πε₀r</strong> (positive near a positive charge). <strong>Electric potential energy</strong> = Vq = Qq/4πε₀r. Isolated sphere capacitance <strong>C = 4πε₀R</strong>. E is minus the potential gradient; area under F–r graph = work done.</p>
<h2>Gravitational vs electric fields</h2>
<div class="tbl"><table><tr><th></th><th>Gravitational</th><th>Electric</th></tr><tr><td>Acts on</td><td>mass</td><td>charge</td></tr><tr><td>Force</td><td>always attractive</td><td>attractive or repulsive</td></tr><tr><td>Point source</td><td>F = −GMm/r² (inverse square)</td><td>F = Qq/4πε₀r² (inverse square)</td></tr><tr><td>Field strength</td><td>g = F/m</td><td>E = F/Q</td></tr><tr><td>Potential</td><td>−GM/r (always negative)</td><td>Q/4πε₀r (sign of Q)</td></tr></table></div>`,
eqs:[['E = F/Q','Field strength'],['F = Qq/4πε₀r²','Coulomb’s law'],['E = Q/4πε₀r²','Point charge field'],['E = V/d','Uniform field'],['C = ε₀A/d','Parallel plates'],['V = Q/4πε₀r','Potential of point charge'],['E<sub>p</sub> = Qq/4πε₀r','Electric potential energy'],['C = 4πε₀R','Isolated sphere']],
terms:[['Electric field strength','Force per unit positive charge at a point.'],['Coulomb’s law','The force between two point charges is proportional to the product of the charges and inversely proportional to the square of their separation.'],['Uniform field','A field with the same strength and direction everywhere; parallel, equally spaced lines.'],['Electric potential','Work done per unit positive charge to bring a small test charge from infinity to a point.'],['Permittivity','A property of a material describing how it affects the electric field; ε₀ for free space.'],['Relative permittivity','Ratio of the permittivity of a material to the permittivity of free space.']],
mcq:[
{q:'Two charges of +2.0 μC are 0.30 m apart in air. Force between them =',o:['0.40 N','0.12 N','1.2 N','0.040 N'],a:0,e:'F = 8.99 × 10⁹ × (2.0 × 10⁻⁶)² / 0.09 = 0.40 N.'},
{q:'Plates 5.0 mm apart have a p.d. of 200 V. Field strength =',o:['40 V m⁻¹','1000 V m⁻¹','4.0 × 10⁴ V m⁻¹','1.0 × 10⁶ V m⁻¹'],a:2,e:'200/0.005 = 4.0 × 10⁴ V m⁻¹.'},
{q:'The separation of two point charges triples. The force becomes',o:['1/3','1/9','3×','9×'],a:1,e:'Inverse square law.'},
{q:'An electron enters a uniform field between plates at right angles to it. Its path is',o:['a circle','a straight line','a parabola','a helix'],a:2,e:'Constant acceleration perpendicular to initial velocity.'},
{q:'Potential at 0.10 m from a +5.0 nC point charge is',o:['450 V','45 V','4500 V','4.5 × 10⁻⁷ V'],a:0,e:'8.99 × 10⁹ × 5.0 × 10⁻⁹/0.10 = 450 V.'}
],
exam:[
{id:'6.2-E1',marks:7,style:'Structured · electron in a field',stem:'An electron travelling horizontally at 3.0 × 10⁷ m s⁻¹ enters the uniform field between two horizontal plates 40 mm apart with a p.d. of 500 V. The plates are 60 mm long.',parts:[
{q:'Calculate the electric field strength and the acceleration of the electron.',m:3,ms:['E = 500/0.040 = 1.25 × 10⁴ V m⁻¹','F = eE = 2.0 × 10⁻¹⁵ N','a = F/m = 2.2 × 10¹⁵ m s⁻²']},
{q:'Calculate the vertical deflection on leaving the plates.',m:3,ms:['t = 0.060/3.0 × 10⁷ = 2.0 × 10⁻⁹ s','y = ½at² = ½ × 2.2 × 10¹⁵ × (2.0 × 10⁻⁹)²','= 4.4 × 10⁻³ m'],ans:'4.4 mm'},
{q:'State the shape of the path between the plates.',m:1,ms:['parabolic']}]},
{id:'6.2-E2',marks:4,style:'Structured · comparing fields',stem:'Both gravitational and electric fields of point sources obey inverse square laws.',parts:[{q:'State two similarities and two differences between gravitational and electric fields.',m:4,ms:['similar: inverse square law for point sources','similar: field strength = force per unit (mass/charge); radial field lines','different: gravitational force always attractive; electric can repel','different: gravitational potential always negative; electric potential can be positive or negative']}]}
]});

S.addTopic({
id:'6.3',mod:6,title:'Electromagnetism',short:'Magnetic fields, F = BIL, F = BQv, flux, Faraday and Lenz, generators and transformers.',
labs:['bfield','induction','transformer','deflect'],pags:['p11-1','p11-3'],
spec:['Magnetic fields due to moving charges or permanent magnets; field lines; fields of a long straight wire, flat coil and solenoid','Fleming’s left-hand rule','Force on a current-carrying conductor F = BIL sin θ; techniques to determine B using a current balance','Magnetic flux density; the tesla','Force on a charged particle in a magnetic field F = BQv; charged particles in circular orbits r = mv/BQ','Velocity selector: particles in crossed E and B fields, v = E/B','Magnetic flux φ = BA cos θ; the weber; flux linkage Nφ','Faraday’s law and Lenz’s law; ε = −Δ(Nφ)/Δt; investigating flux with search coils','Simple a.c. generator','Simple laminated iron-cored transformer; n_s/n_p = V_s/V_p = I_p/I_s for an ideal transformer'],
packs:two('6.3-Electromagnetism','6.3 Electromagnetism').concat(seq('6.3-Electromagnetism','Electromagnetism',4),c('6.3-Electromagnetism','Electric & Magnetic Fields')),
notes:`
<h2>Magnetic fields</h2>
<p>Magnetic fields are produced by <strong>moving charges</strong> (currents) or permanent magnets. Field lines go from N to S. Around a long straight wire the field is concentric circles (right-hand grip rule). A solenoid produces a field like a bar magnet, uniform inside.</p>
<h2>Force on a current-carrying conductor</h2>
<p><strong>F = BIL sin θ</strong>, θ the angle between wire and field. Direction by <strong>Fleming's left-hand rule</strong>: First finger = Field, seCond finger = Current, thuMb = Motion (force).</p>
<p><strong>Magnetic flux density</strong> B: the tesla is the flux density that gives a force of 1 N on 1 m of wire carrying 1 A at right angles to the field. Measure B with a <strong>current balance</strong> (magnet on a top-pan balance, wire through the field; F = Δm g).</p>
<h2>Charged particles in magnetic fields</h2>
<p><strong>F = BQv</strong> (at right angles to the field). The force is always perpendicular to the velocity, so it provides a centripetal force: BQv = mv²/r, <strong>r = mv/BQ</strong>. Faster or heavier particles make bigger circles.</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Velocity selector: crossed electric and magnetic fields; only particles with v = E/B pass straight through">
<rect x="120" y="30" width="280" height="10" class="fill1 ax"/><rect x="120" y="170" width="280" height="10" class="fill2 ax"/>
<g class="bdots">${Array.from({length:18},(_,i)=>`<circle cx="${140+(i%6)*48}" cy="${70+Math.floor(i/6)*40}" r="2.5"/>`).join('')}</g>
<line class="c1 thick" x1="20" y1="105" x2="500" y2="105" marker-end="url(#ahb)"/><path class="c2 dash" d="M120 105 Q260 100 400 50"/><path class="c3 dash" d="M120 105 Q260 110 400 160"/>
<text x="20" y="96" class="small">v</text><text x="410" y="48" class="small lbl2">v &lt; E/B</text><text x="410" y="170" class="small lbl3">v &gt; E/B</text><text x="200" y="208" class="small">B out of page (•), E down</text></svg>
<p><strong>Velocity selector</strong>: crossed E and B fields. A particle goes straight through when EQ = BQv, so <strong>v = E/B</strong>, regardless of mass or charge.</p>
<h2>Electromagnetic induction</h2>
<p><strong>Magnetic flux</strong> φ = BA cos θ (weber, Wb), θ between B and the normal to the area. <strong>Flux linkage</strong> = Nφ.</p>
<p><strong>Faraday's law</strong>: the magnitude of the induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage. <strong>Lenz's law</strong>: the direction of the induced e.m.f. (or current) is such as to oppose the change producing it (a consequence of conservation of energy). Together: <strong>ε = −Δ(Nφ)/Δt</strong>.</p>
<p>A <strong>search coil</strong> connected to an oscilloscope measures alternating flux; the peak e.m.f. is greatest when the coil's plane is perpendicular to B.</p>
<h2>Generators and transformers</h2>
<p>A coil rotating at angular speed ω in a uniform field: Nφ = BAN cos ωt, so ε = BANω sin ωt. Peak e.m.f. ε<sub>0</sub> = BANω; doubling the rotation speed doubles both the peak e.m.f. and the frequency.</p>
<p>A <strong>transformer</strong>: alternating current in the primary produces an alternating flux in the laminated soft-iron core, which links the secondary and induces an alternating e.m.f. <strong>n<sub>s</sub>/n<sub>p</sub> = V<sub>s</sub>/V<sub>p</sub> = I<sub>p</sub>/I<sub>s</sub></strong> (ideal: 100% efficient, V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>). Laminations reduce eddy currents. Step-up for transmission reduces current and so I²R losses.</p>`,
eqs:[['F = BIL sin θ','Force on a wire'],['F = BQv','Force on a moving charge'],['r = mv/BQ','Radius of circular path'],['v = E/B','Velocity selector'],['φ = BA cos θ','Magnetic flux'],['ε = −Δ(Nφ)/Δt','Faraday and Lenz'],['ε = BANω sin ωt','Generator e.m.f.'],['n<sub>s</sub>/n<sub>p</sub> = V<sub>s</sub>/V<sub>p</sub> = I<sub>p</sub>/I<sub>s</sub>','Ideal transformer']],
terms:[['Magnetic flux density','Force per unit current per unit length on a wire at right angles to the field.'],['Tesla','The flux density that gives a force of 1 N on a 1 m wire carrying 1 A at right angles to the field.'],['Fleming’s left-hand rule','Thumb = motion (force), first finger = field, second finger = current.'],['Magnetic flux','φ = BA cos θ; product of flux density and the area perpendicular to it.'],['Weber','Unit of magnetic flux, 1 Wb = 1 T m².'],['Flux linkage','Product of number of turns and magnetic flux, Nφ.'],['Faraday’s law','Induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage.'],['Lenz’s law','The direction of the induced e.m.f. or current opposes the change that produces it.'],['Velocity selector','Crossed electric and magnetic fields that allow only particles with v = E/B to pass undeflected.'],['Transformer','Device that changes alternating p.d.s using electromagnetic induction between two coils on a soft iron core.']],
mcq:[
{q:'A 0.20 m wire carrying 3.0 A is at 90° to a 0.50 T field. Force =',o:['0.30 N','0.60 N','3.0 N','0.030 N'],a:0,e:'BIL = 0.50 × 3.0 × 0.20 = 0.30 N.'},
{q:'A proton moves at 2.0 × 10⁶ m s⁻¹ perpendicular to a 0.40 T field. Radius of path =',o:['5.2 cm','2.6 cm','0.52 m','1.3 cm'],a:0,e:'r = mv/BQ = 1.673 × 10⁻²⁷ × 2 × 10⁶/(0.40 × 1.6 × 10⁻¹⁹) = 0.052 m.'},
{q:'In a velocity selector E = 3.0 × 10⁴ V m⁻¹ and B = 0.15 T. Selected speed is',o:['2.0 × 10⁵ m s⁻¹','4.5 × 10³ m s⁻¹','5.0 × 10⁻⁶ m s⁻¹','2.0 × 10⁴ m s⁻¹'],a:0,e:'v = E/B = 2.0 × 10⁵ m s⁻¹.'},
{q:'A coil of 200 turns, area 4.0 × 10⁻³ m², is removed from a 0.25 T field in 0.10 s. Average induced e.m.f. =',o:['2.0 V','0.20 V','0.010 V','20 V'],a:0,e:'ΔNφ = 200 × 0.25 × 4.0 × 10⁻³ = 0.20 Wb; /0.10 = 2.0 V.'},
{q:'A transformer has 50 primary and 1000 secondary turns. Input 12 V a.c. Output (ideal) =',o:['0.6 V','240 V','12 V','600 V'],a:1,e:'× 20.'},
{q:'Lenz’s law is a consequence of conservation of',o:['charge','momentum','energy','flux'],a:2,e:'Otherwise energy would be created.'}
],
exam:[
{id:'6.3-E1',marks:6,style:'Structured · mass spectrometer',stem:'Singly charged ions pass through a velocity selector (E = 2.0 × 10⁴ V m⁻¹, B = 0.10 T) and then enter a region of uniform field B = 0.10 T, where they travel in a semicircle.',parts:[
{q:'Calculate the speed of ions that pass through the selector.',m:1,ms:['v = E/B = 2.0 × 10⁵ m s⁻¹']},
{q:'An ion lands 0.17 m from the entry slit after a semicircle. Calculate its mass.',m:3,ms:['r = 0.085 m','m = BQr/v = 0.10 × 1.6 × 10⁻¹⁹ × 0.085 / 2.0 × 10⁵','= 6.8 × 10⁻²⁷ kg (≈ 4 u)'],ans:'6.8 × 10⁻²⁷ kg'},
{q:'Explain why the ion moves in a circle in the magnetic field.',m:2,ms:['force BQv is perpendicular to velocity','constant magnitude so it provides a centripetal force; speed unchanged']}]},
{id:'6.3-E2',marks:6,style:'Extended response · induction',stem:'A bar magnet is dropped through a coil connected to a data-logger, which records the induced e.m.f. against time.',parts:[{q:'Describe and explain the shape of the e.m.f.–time graph.',m:6,ms:['as the magnet enters, flux linkage increases so e.m.f. induced (Faraday)','e.m.f. zero briefly when magnet is in the middle: flux linkage not changing','as it leaves, flux linkage decreases: e.m.f. in opposite direction (Lenz)','second peak larger because the magnet is moving faster (accelerating under gravity)','second pulse shorter in time','areas of the two pulses equal (same change in flux linkage)']}]}
]});

S.addTopic({
id:'6.4',mod:6,title:'Nuclear and particle physics',short:'Nuclear atom, particles and quarks, radioactivity, half-life, E = mc², binding energy, fission and fusion.',
labs:['decay','absorb','binding','rutherford'],pags:['p7-1','p7-2','p7-3'],
spec:['Alpha-particle scattering experiment; evidence of a small charged nucleus','Nuclear model of the atom; relative sizes; proton number, nucleon number, isotopes, ᴬ_Z X notation','Strong nuclear force: attractive to about 3 fm, repulsive below about 0.5 fm','Radius of nuclei R = r₀A^(1/3); mean densities of atoms and nuclei','Particles and antiparticles; hadrons and leptons; quarks (up, down, strange) and antiquarks; charges; proton uud, neutron udd','Beta-minus and beta-plus decay in terms of the quark model; neutrinos; weak interaction','Radioactive decay: spontaneous and random; α, β, γ: nature, penetration, range; absorption experiments (PAG7)','Nuclear decay equations; activity A = λN; half-life λt½ = ln 2; A = A₀e^(−λt), N = N₀e^(−λt)','Simulation of decay with dice; graphical and spreadsheet modelling ΔN/Δt = −λN','Radioactive dating, e.g. carbon-dating','ΔE = Δmc²; annihilation and pair production','Mass defect; binding energy; binding energy per nucleon curve','Induced fission; chain reaction; fission reactor: fuel rods, control rods, moderator; nuclear waste','Nuclear fusion; conditions; energy released'],
packs:two('6.4-Nuclear-and-Particle-Physics','6.4 Nuclear and Particle Physics').concat(seq('6.4-Nuclear-and-Particle-Physics','Nuclear and Particle Physics',5),c('6.4-Nuclear-and-Particle-Physics','Nuclear Physics')),
notes:`
<h2>The nuclear atom</h2>
<p><strong>Rutherford's alpha-scattering experiment</strong>: alpha particles fired at thin gold foil in a vacuum.</p>
<ul><li>Most passed straight through → the atom is mostly empty space.</li><li>A few were deflected → the nucleus is charged (positive, repels α).</li><li>Very few (≈ 1 in 10 000) were deflected by more than 90° → the mass and positive charge are concentrated in a tiny nucleus.</li></ul>
<p>Atom diameter ≈ 10<sup>−10</sup> m; nucleus ≈ 10<sup>−15</sup> to 10<sup>−14</sup> m. Notation <sup>A</sup><sub>Z</sub>X: Z proton number, A nucleon number. <strong>Isotopes</strong>: same Z, different number of neutrons.</p>
<p><strong>Nuclear radius R = r₀A<sup>1/3</sup></strong> (r₀ ≈ 1.2 fm), so nuclear volume ∝ A and nuclear density is constant (≈ 10<sup>17</sup> kg m<sup>−3</sup>), much greater than atomic density.</p>
<p>The <strong>strong nuclear force</strong> holds nucleons together: attractive up to about 3 fm, repulsive below about 0.5 fm, and acts between all nucleons. It overcomes electrostatic repulsion between protons.</p>
<h2>Fundamental particles</h2>
<p>Every particle has an <strong>antiparticle</strong> with the same mass and opposite charge (e.g. electron and positron). <strong>Hadrons</strong> feel the strong force (and the weak force) and are made of quarks: protons (uud) and neutrons (udd). <strong>Leptons</strong> are fundamental and feel the weak force but not the strong force: electron, neutrino.</p>
<div class="tbl"><table><tr><th>Quark</th><th>Symbol</th><th>Charge / e</th></tr><tr><td>up</td><td>u</td><td>+⅔</td></tr><tr><td>down</td><td>d</td><td>−⅓</td></tr><tr><td>strange</td><td>s</td><td>−⅓</td></tr></table></div>
<p>Antiquarks have opposite charges. <strong>β<sup>−</sup> decay</strong>: n → p + e<sup>−</sup> + ν̄ (a d quark changes to a u quark). <strong>β<sup>+</sup> decay</strong>: p → n + e<sup>+</sup> + ν (u → d). Both are caused by the <strong>weak interaction</strong>. Charge, nucleon number and lepton number are conserved.</p>
<h2>Radioactivity</h2>
<p>Decay is <strong>spontaneous</strong> (not affected by external factors such as temperature or pressure) and <strong>random</strong> (cannot predict which nucleus will decay or when; each nucleus has a constant probability of decay per unit time).</p>
<div class="tbl"><table><tr><th>Radiation</th><th>Nature</th><th>Ionising</th><th>Range in air</th><th>Stopped by</th></tr><tr><td>α</td><td>helium nucleus ⁴₂He</td><td>strongly</td><td>a few cm</td><td>paper</td></tr><tr><td>β<sup>−</sup> / β<sup>+</sup></td><td>fast electron / positron</td><td>moderately</td><td>≈ 1 m</td><td>few mm aluminium</td></tr><tr><td>γ</td><td>EM photon</td><td>weakly</td><td>infinite (inverse square)</td><td>reduced by thick lead / concrete</td></tr></table></div>
<p>Decay equations: α: <sup>A</sup><sub>Z</sub>X → <sup>A−4</sup><sub>Z−2</sub>Y + ⁴₂α. β<sup>−</sup>: Z increases by 1. β<sup>+</sup>: Z decreases by 1. γ: no change in A or Z.</p>
<h2>Activity and half-life</h2>
<p><strong>Activity</strong> A = λN (becquerel, Bq = decays per second). <strong>Decay constant</strong> λ: probability of decay of a nucleus per unit time. <strong>Half-life</strong>: average time for half the active nuclei to decay; <strong>λt<sub>½</sub> = ln 2</strong>. <strong>N = N₀e<sup>−λt</sup></strong>, A = A₀e<sup>−λt</sup>. ΔN/Δt = −λN, modelled with dice or a spreadsheet.</p>
<p><strong>Carbon dating</strong>: living things keep a constant ratio of C-14 to C-12. After death, C-14 (t<sub>½</sub> = 5700 years) decays. Measuring the activity per gram gives the age. Limitations: background count is significant for old samples; assumes constant atmospheric C-14 ratio; not useful for very young or very old (> ~50 000 years) samples.</p>
<h2>Mass and energy</h2>
<p><strong>ΔE = Δmc²</strong>. In <strong>annihilation</strong>, a particle and its antiparticle convert into two gamma photons. In <strong>pair production</strong>, a photon produces a particle–antiparticle pair (needs E ≥ 2mc²).</p>
<p><strong>Mass defect</strong>: the difference between the total mass of the separate nucleons and the mass of the nucleus. <strong>Binding energy</strong>: the minimum energy needed to separate a nucleus into its constituent protons and neutrons = mass defect × c².</p>
<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="Binding energy per nucleon against nucleon number, peaking at iron-56; fusion on the left, fission on the right">
<line class="ax" x1="50" y1="200" x2="500" y2="200" marker-end="url(#ah)"/><line class="ax" x1="50" y1="200" x2="50" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M55 180 L62 110 L70 90 C80 60 110 45 140 40 C200 38 300 48 480 70"/>
<circle cx="140" cy="40" r="4" class="dotb"/><text x="146" y="36" class="small">Fe-56 (≈ 8.8 MeV)</text><circle cx="70" cy="62" r="3" class="dotb"/><text x="76" y="70" class="small">He-4</text>
<text x="60" y="140" class="small lbl2">fusion →</text><text x="360" y="100" class="small lbl2">← fission</text><text x="430" y="218" class="small">A</text><text x="4" y="30" class="small">BE/A</text></svg>
<p>Iron-56 has the highest binding energy per nucleon (most stable). Energy is released when light nuclei <strong>fuse</strong> or heavy nuclei <strong>split</strong> to move towards the peak.</p>
<h2>Fission and fusion</h2>
<p><strong>Induced fission</strong>: a slow (thermal) neutron is absorbed by U-235, which splits into two daughter nuclei plus 2–3 neutrons and energy. These neutrons can cause further fissions: a <strong>chain reaction</strong>.</p>
<ul><li><strong>Fuel rods</strong>: enriched uranium.</li><li><strong>Moderator</strong> (water, graphite): slows neutrons by collisions so they are more likely to be absorbed by U-235.</li><li><strong>Control rods</strong> (boron, cadmium): absorb neutrons to control the rate, keeping one fission per fission on average.</li><li>Waste: highly radioactive, long half-lives; stored underwater then vitrified and buried deep underground.</li></ul>
<p><strong>Fusion</strong>: light nuclei join. Needs very high temperatures (≈ 10<sup>7</sup> K and above) so nuclei have enough kinetic energy to overcome electrostatic repulsion and get within range of the strong force, and high density so collisions are frequent.</p>`,
eqs:[['R = r₀A<sup>1/3</sup>','Nuclear radius'],['A = λN','Activity'],['λt<sub>½</sub> = ln 2','Half-life'],['N = N₀e<sup>−λt</sup>; A = A₀e<sup>−λt</sup>','Exponential decay'],['ΔE = Δmc²','Mass–energy'],['BE = Δm c²','Binding energy']],
terms:[['Isotopes','Nuclei of the same element with the same number of protons but different numbers of neutrons.'],['Nucleon number','Total number of protons and neutrons in a nucleus.'],['Strong nuclear force','Short-range force between nucleons; attractive to about 3 fm, repulsive below about 0.5 fm.'],['Antiparticle','Particle with the same mass but opposite charge (and other quantum numbers) to its particle.'],['Hadron','Particle made of quarks that feels the strong nuclear force.'],['Lepton','Fundamental particle not affected by the strong force, e.g. electron, neutrino.'],['Activity','Number of nuclei decaying per unit time.'],['Decay constant','Probability that an individual nucleus will decay per unit time.'],['Half-life','Average time taken for half the active nuclei in a sample to decay.'],['Spontaneous decay','Decay not affected by external conditions.'],['Random decay','Impossible to predict which nucleus will decay or when.'],['Mass defect','Difference between the total mass of separate nucleons and the mass of the nucleus.'],['Binding energy','Minimum energy required to completely separate a nucleus into its constituent nucleons.'],['Annihilation','A particle and its antiparticle meet and their mass is converted into energy (photons).'],['Pair production','A photon produces a particle and its antiparticle.'],['Induced fission','Splitting of a heavy nucleus after it absorbs a neutron.'],['Chain reaction','Neutrons from one fission cause further fissions.'],['Moderator','Material that slows down neutrons in a reactor.'],['Fusion','Joining of two light nuclei to form a heavier nucleus.']],
mcq:[
{q:'A source has half-life 6.0 h. What fraction remains after 24 h?',o:['1/4','1/8','1/16','1/24'],a:2,e:'4 half-lives → (½)⁴.'},
{q:'The decay constant of a nuclide with half-life 30 s is',o:['0.023 s⁻¹','0.033 s⁻¹','43 s⁻¹','20.8 s⁻¹'],a:0,e:'λ = ln 2/30 = 0.0231 s⁻¹.'},
{q:'²³⁸₉₂U decays by α emission. The daughter is',o:['²³⁴₉₀Th','²³⁴₉₂U','²³⁸₉₃Np','²³⁴₉₁Pa'],a:0,e:'A − 4, Z − 2.'},
{q:'Quark composition of a neutron is',o:['uud','udd','uds','ddd'],a:1,e:'Charge ⅔ − ⅓ − ⅓ = 0.'},
{q:'Which is a lepton?',o:['proton','neutron','neutrino','pion'],a:2,e:'Neutrinos are leptons.'},
{q:'The radius of ²⁷Al is 3.6 fm. The radius of ²¹⁶Po (A = 216) is about',o:['7.2 fm','29 fm','14 fm','3.6 fm'],a:0,e:'(216/27)^⅓ = 2 → 7.2 fm.'},
{q:'In a fission reactor the moderator',o:['absorbs neutrons','slows neutrons down','cools the core only','reflects γ-rays'],a:1,e:'Slow (thermal) neutrons are more readily absorbed by U-235.'}
],
exam:[
{id:'6.4-E1',marks:7,style:'Structured · binding energy',stem:'Mass of a ⁴₂He nucleus = 4.00151 u. Proton mass = 1.00728 u, neutron mass = 1.00867 u. 1 u = 1.661 × 10⁻²⁷ kg.',parts:[
{q:'Calculate the mass defect in kg.',m:2,ms:['Δm = 2(1.00728) + 2(1.00867) − 4.00151 = 0.03039 u','= 5.05 × 10⁻²⁹ kg']},
{q:'Calculate the binding energy per nucleon in MeV.',m:3,ms:['BE = Δmc² = 5.05 × 10⁻²⁹ × (3.00 × 10⁸)² = 4.54 × 10⁻¹² J','= 28.4 MeV','per nucleon = 7.1 MeV'],ans:'7.1 MeV'},
{q:'Explain why energy is released when hydrogen nuclei fuse to form helium.',m:2,ms:['helium has a higher binding energy per nucleon than hydrogen (more tightly bound)','total binding energy increases; mass decreases; the difference is released (ΔE = Δmc²)']}]},
{id:'6.4-E2',marks:6,style:'Structured · half-life',stem:'A sample of iodine-131 (half-life 8.0 days) has an activity of 4.0 × 10⁶ Bq.',parts:[
{q:'Calculate the decay constant in s⁻¹.',m:1,ms:['λ = ln 2/(8.0 × 86 400) = 1.0 × 10⁻⁶ s⁻¹']},
{q:'Calculate the number of undecayed nuclei.',m:2,ms:['N = A/λ = 4.0 × 10⁶ / 1.0 × 10⁻⁶','= 4.0 × 10¹²']},
{q:'Calculate the activity after 20 days.',m:2,ms:['A = A₀e^(−λt) = 4.0 × 10⁶ × e^(−ln2 × 20/8)','= 7.1 × 10⁵ Bq']},
{q:'Explain what is meant by "random" decay.',m:1,ms:['cannot predict which nucleus will decay or when; each has a constant probability per unit time']}]}
]});

S.addTopic({
id:'6.5',mod:6,title:'Medical imaging',short:'X-rays, attenuation, CAT, tracers, gamma camera, PET and ultrasound.',
labs:['xray','ultrasound'],pags:[],
spec:['Basic structure of an X-ray tube: heater (cathode), anode, target metal, high voltage supply; production of X-ray photons','X-ray attenuation mechanisms: simple scatter, photoelectric effect, Compton effect and pair production','Attenuation of X-rays I = I₀e^(−μx); attenuation coefficient','X-ray imaging with contrast media (barium and iodine)','CAT scanning: rotating X-ray tube, thin fan-shaped beam, ring of detectors, computer software and display; advantages over an X-ray image','Medical tracers: technetium-99m and fluorine-18','Gamma camera: collimator, scintillator, photomultiplier tubes, computer and display; diagnosis','PET scanner: annihilation of positron–electron pairs; formation of image; diagnosis','Ultrasound: longitudinal wave above 20 kHz; piezoelectric effect; transducer','Ultrasound A-scan and B-scan','Acoustic impedance Z = ρc; reflection at a boundary I_r/I₀ = (Z₂ − Z₁)²/(Z₂ + Z₁)²','Impedance matching; coupling gel','Doppler effect in ultrasound; speed of blood Δf = 2fv cos θ/c'],
packs:two('6.5-Medical-Imaging','6.5 Medical Imaging').concat(seq('6.5-Medical-Imaging','Medical Imaging',5),c('6.5-Medical-Imaging','Medical Imaging')),
notes:`
<h2>X-ray production</h2>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="X-ray tube: heated cathode emits electrons accelerated to tungsten target on rotating anode; X-rays emitted through window">
<rect x="30" y="40" width="440" height="110" rx="50" class="ax dash"/><text x="200" y="34" class="small">evacuated glass tube</text>
<rect x="60" y="80" width="30" height="30" class="fill2 ax"/><text x="40" y="132" class="small">heated cathode (−)</text>
<line class="c1 thick" x1="95" y1="95" x2="355" y2="95" marker-end="url(#ahb)"/><text x="170" y="88" class="small lbl1">electrons, ≈ 100 kV</text>
<path class="fill1 ax" d="M360 60 L410 60 L410 130 L380 130 Z"/><text x="385" y="54" class="small">tungsten target (anode +)</text>
<line class="c2 dash" x1="370" y1="110" x2="330" y2="190" marker-end="url(#aha)"/><line class="c2 dash" x1="372" y1="110" x2="360" y2="195" marker-end="url(#aha)"/><text x="260" y="190" class="small lbl2">X-rays</text></svg>
<p>Thermionic emission releases electrons from the heated cathode; they are accelerated through a large p.d. and hit a tungsten target. They decelerate and produce X-ray photons (bremsstrahlung). Maximum photon energy = eV. Only ≈ 1% of the energy becomes X-rays; the rest heats the target, so the anode is rotated and cooled (tungsten has a high melting point).</p>
<h2>Attenuation mechanisms</h2>
<div class="tbl"><table><tr><th>Mechanism</th><th>Energy range</th><th>What happens</th></tr><tr><td>Simple scatter</td><td>1–20 keV</td><td>photon bounces off an electron with no change in energy.</td></tr><tr><td>Photoelectric effect</td><td>&lt; 100 keV</td><td>photon absorbed by an electron, which is ejected from the atom.</td></tr><tr><td>Compton effect</td><td>0.5–5 MeV</td><td>photon scattered by an electron; loses energy; electron ejected.</td></tr><tr><td>Pair production</td><td>&gt; 1.02 MeV</td><td>photon near a nucleus becomes an electron–positron pair.</td></tr></table></div>
<p><strong>I = I₀e<sup>−μx</sup></strong>, μ the attenuation coefficient. Bone has a much larger μ than soft tissue, giving contrast. <strong>Contrast media</strong> (barium sulfate swallowed, iodine injected) have high Z and high μ, so soft-tissue organs such as the gut or blood vessels show up.</p>
<h2>CAT scans</h2>
<p>An X-ray tube rotates around the patient producing a thin <strong>fan-shaped beam</strong>; a <strong>ring of detectors</strong> measures intensity; <strong>computer software</strong> reconstructs 2D slices and a 3D image shown on a <strong>display</strong>. Advantages over a plain X-ray: 3D image, distinguishes tissues of similar density, shows depth and position, can be rotated. Disadvantages: larger radiation dose, expensive, slower.</p>
<h2>Nuclear medicine</h2>
<p><strong>Tracers</strong>: technetium-99m (γ-emitter, half-life 6 h, made on site) and fluorine-18 (β<sup>+</sup> emitter in FDG, half-life 110 min) for PET.</p>
<p><strong>Gamma camera</strong>: <strong>collimator</strong> (lead tubes, only lets through γ travelling parallel to the tubes) → <strong>scintillator</strong> (sodium iodide crystal, each γ produces thousands of visible photons) → <strong>photomultiplier tubes</strong> (convert light to electrical pulses) → <strong>computer</strong> works out where each γ came from and builds the image on the <strong>display</strong>. Used to look at function, e.g. blood flow, bone scans, thyroid.</p>
<p><strong>PET</strong>: F-18 emits a positron, which annihilates with an electron producing two 511 keV γ photons travelling in opposite directions. A ring of detectors registers both; the time difference locates the annihilation point. Builds a 3D image of metabolic activity (cancers, brain function). Expensive; needs a nearby cyclotron.</p>
<h2>Ultrasound</h2>
<p>Ultrasound is a <strong>longitudinal wave with frequency above 20 kHz</strong> (medical: 1–15 MHz). A <strong>piezoelectric</strong> crystal changes shape when a p.d. is applied (emitter) and produces a p.d. when compressed by a returning wave (receiver): an ultrasound <strong>transducer</strong>.</p>
<ul><li><strong>A-scan</strong>: amplitude against time for one direction; time delay gives depth (2d = ct).</li><li><strong>B-scan</strong>: transducer moved over the body, brightness shows reflection strength, building a 2D image.</li></ul>
<p><strong>Acoustic impedance Z = ρc</strong> (kg m<sup>−2</sup> s<sup>−1</sup>). Fraction reflected at a boundary: <strong>I<sub>r</sub>/I₀ = (Z₂ − Z₁)²/(Z₂ + Z₁)²</strong>. Air–skin reflects almost all ultrasound, so a <strong>coupling gel</strong> with Z close to skin is used: <strong>impedance matching</strong>.</p>
<p><strong>Doppler ultrasound</strong>: reflections from moving red blood cells change frequency: <strong>Δf = 2fv cos θ/c</strong>, used to measure blood flow speed.</p>`,
eqs:[['I = I₀e<sup>−μx</sup>','X-ray attenuation'],['Z = ρc','Acoustic impedance'],['I<sub>r</sub>/I₀ = (Z₂ − Z₁)²/(Z₂ + Z₁)²','Intensity reflection coefficient'],['Δf = 2fv cos θ/c','Doppler ultrasound'],['E<sub>max</sub> = eV','Maximum X-ray photon energy']],
terms:[['Attenuation','Reduction in intensity of a beam as it passes through a material.'],['Attenuation coefficient','μ in I = I₀e^(−μx); fraction of intensity absorbed per unit thickness.'],['Compton effect','X-ray photon scattered by an electron, losing energy and ejecting the electron.'],['Pair production','Photon converts into an electron–positron pair (needs ≥ 1.02 MeV).'],['Contrast medium','Substance with high attenuation coefficient (barium, iodine) used to show soft tissue.'],['CAT scan','Computerised axial tomography: rotating fan-shaped X-ray beam and detector ring produce slice images.'],['Medical tracer','A radioactive substance introduced into the body that is absorbed by tissue to be studied.'],['Collimator','Lead tubes in a gamma camera that only allow γ-rays parallel to them through.'],['Scintillator','Material that emits a flash of light when it absorbs a γ photon.'],['Photomultiplier tube','Converts a light flash into an amplified electrical pulse.'],['PET scan','Positron emission tomography; detects pairs of γ photons from positron–electron annihilation.'],['Piezoelectric effect','Some crystals produce a p.d. when stressed and change shape when a p.d. is applied.'],['Acoustic impedance','Z = ρc, density × speed of sound in a material.'],['Impedance matching','Using materials of similar Z so most ultrasound is transmitted at a boundary.']],
mcq:[
{q:'An X-ray tube operates at 80 kV. Maximum photon energy is',o:['80 eV','80 keV','80 MeV','40 keV'],a:1,e:'E_max = eV.'},
{q:'The intensity of an X-ray beam halves after 3.0 mm of a material. μ is',o:['0.23 mm⁻¹','0.69 mm⁻¹','2.1 mm⁻¹','4.3 mm⁻¹'],a:0,e:'μ = ln 2/3.0 = 0.23 mm⁻¹.'},
{q:'Z for soft tissue = 1.6 × 10⁶ and for bone = 7.0 × 10⁶ kg m⁻² s⁻¹. Fraction reflected =',o:['0.39','0.25','0.63','0.065'],a:0,e:'(5.4/8.6)² = 0.39.'},
{q:'Which attenuation mechanism requires photon energy above 1.02 MeV?',o:['simple scatter','photoelectric','Compton','pair production'],a:3,e:'2 × 0.511 MeV.'},
{q:'The tracer used in PET is',o:['Tc-99m','F-18','I-131','Co-60'],a:1,e:'F-18 is a positron emitter.'},
{q:'Why is gel used in ultrasound scanning?',o:['to cool the transducer','to remove air so Z is matched','to absorb reflections','to increase frequency'],a:1,e:'Without gel, the air gap reflects almost all ultrasound.'}
],
exam:[
{id:'6.5-E1',marks:6,style:'Extended response · gamma camera',stem:'A patient is injected with technetium-99m and imaged with a gamma camera.',parts:[{q:'Describe how the gamma camera produces an image.',m:6,ms:['collimator: lead tubes; only γ-rays travelling along the axis pass through','scintillator (NaI): each γ photon produces many visible photons','photomultiplier tubes convert the light into electrical pulses','position of the pulse found from the relative signals of several PMTs','computer builds an image from many events; display','Tc-99m: γ only, 6 h half-life — enough for imaging but low dose']}]},
{id:'6.5-E2',marks:6,style:'Structured · ultrasound',stem:'An A-scan pulse reflects from the far side of an organ. Speed of ultrasound in tissue = 1540 m s⁻¹. The echoes from the near and far sides of the organ arrive 52 μs apart.',parts:[
{q:'Calculate the thickness of the organ.',m:2,ms:['distance = ct/2','= 1540 × 52 × 10⁻⁶ / 2 = 0.040 m'],ans:'4.0 cm'},
{q:'Explain why a gel is used between the transducer and the skin.',m:2,ms:['air has very different acoustic impedance from skin, so almost all ultrasound would be reflected','gel has Z close to skin: impedance matching so most is transmitted']},
{q:'Blood moves at 0.30 m s⁻¹ at 30° to a 5.0 MHz beam. Calculate the Doppler shift.',m:2,ms:['Δf = 2fv cos θ / c = 2 × 5.0 × 10⁶ × 0.30 × cos 30° / 1540','= 1.7 × 10³ Hz']}]}
]});
})();
