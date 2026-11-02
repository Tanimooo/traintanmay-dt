/* Module 4: Electrons, waves and photons */
(function(){
const S=window.SPEC, P=S.pack, M='4-Electrons-Waves-Photons/', E=M+'4.1-4.3-Electricity/';
const two=(dir,name,setO,setN)=>[P('Set O 2022–24',name+' QP',dir+'/Set-O/'+(setO||name)+' QP.pdf'),P('Set O 2022–24',name+' MS',dir+'/Set-O/'+(setO||name)+' MS.pdf'),P('Set N 2016–21',name+' QP',dir+'/Set-N/'+(setN||setO||name)+' QP.pdf'),P('Set N 2016–21',name+' MS',dir+'/Set-N/'+(setN||setO||name)+' MS.pdf')];
const seq=(dir,base,n,sp)=>{const a=[];for(let i=1;i<=n;i++){const s=(sp&&sp.includes(i))?'  ':' ';a.push(P('Set M (legacy)',base+' '+i+' QP',dir+'/Set-M/'+base+' '+i+s+'QP.pdf'),P('Set M (legacy)',base+' '+i+' MS',dir+'/Set-M/'+base+' '+i+s+'MS.pdf'));}return a;};
const c=(dir,name)=>[P('Set C (legacy G482)',name,dir+'/Set-C/'+name+'.pdf'),P('Set C (legacy G482)',name+' MS',dir+'/Set-C/'+name+' MS.pdf')];

S.addTopic({
id:'4.1',mod:4,title:'Charge and current',short:'Charge carriers, Kirchhoff’s first law, mean drift velocity.',
labs:['circuit'],pags:[],
spec:['Electric current as rate of flow of charge; I = ΔQ/Δt','The coulomb as the unit of charge','The elementary charge e = 1.60 × 10⁻¹⁹ C','Net charge on a particle or object is quantised and a multiple of e','Current as the movement of electrons in metals and movement of ions in electrolytes','Conventional current and electron flow','Kirchhoff’s first law; conservation of charge','Mean drift velocity of charge carriers; I = Anev','Distinguish between conductors, semiconductors and insulators in terms of n'],
packs:two(E,'4.1 Charge and Current').concat(seq(E,'Charge and Current',2),c(E,'Current')),
notes:`
<h2>Charge and current</h2>
<p><strong>Electric current</strong> is the rate of flow of charge: <strong>I = ΔQ/Δt</strong>. The <strong>coulomb</strong> is the charge that passes a point when a current of 1 A flows for 1 s. Charge is <strong>quantised</strong>: any charge is an integer multiple of e = 1.60 × 10<sup>−19</sup> C.</p>
<p>In metals the charge carriers are free (delocalised) <strong>electrons</strong>; in electrolytes they are positive and negative <strong>ions</strong>. <strong>Conventional current</strong> flows from + to −; electron flow is from − to +.</p>
<h2>Kirchhoff's first law</h2>
<p>The sum of the currents entering any junction equals the sum of the currents leaving it. This is a consequence of <strong>conservation of charge</strong>.</p>
<svg class="diagram" viewBox="0 0 460 170" role="img" aria-label="Junction: 5 A in splits into 3 A and 2 A">
<line class="wire" x1="40" y1="85" x2="220" y2="85" marker-end="url(#ah)"/><line class="wire" x1="220" y1="85" x2="400" y2="30" marker-end="url(#ah)"/><line class="wire" x1="220" y1="85" x2="400" y2="140" marker-end="url(#ah)"/><circle cx="220" cy="85" r="5" class="dot"/>
<text x="90" y="75">5.0 A</text><text x="320" y="40">3.0 A</text><text x="320" y="145">2.0 A</text></svg>
<h2>Mean drift velocity</h2>
<p><strong>I = Anev</strong> where A is cross-sectional area, n is the number density of charge carriers (m<sup>−3</sup>), e is the charge on each carrier and v is the mean drift velocity. Drift velocities in metals are tiny (≈ mm s<sup>−1</sup>) because n is huge (≈ 10<sup>28</sup> to 10<sup>29</sup> m<sup>−3</sup>).</p>
<div class="tbl"><table><tr><th>Material</th><th>n / m<sup>−3</sup></th><th>Notes</th></tr><tr><td>Conductor (copper)</td><td>≈ 10<sup>28</sup>–10<sup>29</sup></td><td>low resistance</td></tr><tr><td>Semiconductor (silicon)</td><td>≈ 10<sup>16</sup>–10<sup>17</sup></td><td>n increases with temperature</td></tr><tr><td>Insulator</td><td>very small (≈ 10<sup>5</sup>)</td><td>almost no current</td></tr></table></div>
<p>In a wire that narrows, the current is the same everywhere (Kirchhoff I), so v is larger where A is smaller.</p>`,
eqs:[['I = ΔQ/Δt','Current'],['I = Anev','Mean drift velocity'],['Q = ne','Charge is quantised']],
terms:[['Electric current','The rate of flow of charge.'],['Coulomb','The charge that flows past a point when a current of 1 A flows for 1 s.'],['Elementary charge','e = 1.60 × 10⁻¹⁹ C, the magnitude of the charge on an electron.'],['Conventional current','Flow from positive to negative terminal (direction positive charge would move).'],['Kirchhoff’s first law','The sum of currents into a junction equals the sum of currents out of it (conservation of charge).'],['Mean drift velocity','The average velocity of charge carriers along a conductor.'],['Number density','Number of free charge carriers per unit volume.']],
mcq:[
{q:'A current of 0.40 A flows for 2 minutes. How many electrons pass a point?',o:['3.0 × 10²⁰','5.0 × 10¹⁸','48','7.7 × 10⁻¹⁸'],a:0,e:'Q = 0.40 × 120 = 48 C; N = 48/1.6 × 10⁻¹⁹ = 3.0 × 10²⁰.'},
{q:'A copper wire (n = 8.5 × 10²⁸ m⁻³, A = 1.0 mm²) carries 2.0 A. Drift velocity ≈',o:['1.5 × 10⁻⁴ m s⁻¹','1.5 × 10⁻² m s⁻¹','0.15 m s⁻¹','15 m s⁻¹'],a:0,e:'v = 2.0 / (1.0 × 10⁻⁶ × 8.5 × 10²⁸ × 1.6 × 10⁻¹⁹) = 1.5 × 10⁻⁴ m s⁻¹.'},
{q:'A wire narrows to half its diameter. The drift velocity in the narrow part is',o:['half','the same','double','four times'],a:3,e:'Area is quarter, I same → v × 4.'},
{q:'Which charge is impossible on an oil drop?',o:['3.2 × 10⁻¹⁹ C','4.8 × 10⁻¹⁹ C','2.4 × 10⁻¹⁹ C','8.0 × 10⁻¹⁹ C'],a:2,e:'2.4 × 10⁻¹⁹ = 1.5e, not an integer multiple.'},
{q:'Kirchhoff’s first law is a consequence of conservation of',o:['energy','charge','momentum','mass'],a:1,e:'Charge cannot build up at a junction.'}
],
exam:[
{id:'4.1-E1',marks:5,style:'Structured · drift velocity',stem:'A metal wire of cross-sectional area 0.50 mm² carries a current of 3.0 A. The number density of free electrons is 6.0 × 10²⁸ m⁻³.',parts:[
{q:'Calculate the mean drift velocity of the electrons.',m:2,ms:['v = I/(Ane)','= 3.0/(0.50 × 10⁻⁶ × 6.0 × 10²⁸ × 1.6 × 10⁻¹⁹) = 6.3 × 10⁻⁴ m s⁻¹'],ans:'6.3 × 10⁻⁴ m s⁻¹'},
{q:'The wire is replaced by a semiconductor of the same dimensions carrying the same current. Explain how the drift velocity compares.',m:3,ms:['n is much smaller in a semiconductor','I = Anev, with I and A the same','so v is much larger']}]}
]});

S.addTopic({
id:'4.2',mod:4,title:'Energy, power and resistance',short:'E.m.f. vs p.d., I–V characteristics, resistivity, thermistors, LDRs and power.',
labs:['iv','circuit','resistivity'],pags:['p3-1','p3-2'],
spec:['Circuit symbols','Potential difference and electromotive force; the volt','Distinguish between e.m.f. and p.d. in terms of energy transfer; W = VQ and W = εQ','Energy transfer eV = ½mv² for electrons accelerated through a p.d.','Resistance R = V/I; the ohm; Ohm’s law','I–V characteristics of resistor, filament lamp, thermistor, diode and LED; LED as an emitter of light','Light-dependent resistor; variation of resistance with light intensity','Resistivity ρ = RA/L; techniques to determine resistivity (PAG3); variation of resistivity with temperature for metals and semiconductors; NTC thermistor','Power P = VI, P = I²R, P = V²/R; W = VIt; the kilowatt-hour; cost of energy'],
packs:[...['4.2 Energy, Power and Resistance - EMF and PD','4.2 Energy, Power and Resistance - Power','4.2 Energy, Power and Resistance - Resistance','4.2 Energy, Power and Resistance - Resistivity'].flatMap(n=>two(E,n.replace('4.2 Energy, Power and Resistance - ','4.2 '),n)),P('Set O 2022–24','4.2 Circuit Symbols QP',E+'/Set-O/4.2 Energy, Power and Resistance - Circuit Symbols QP.pdf'),P('Set O 2022–24','4.2 Circuit Symbols MS',E+'/Set-O/4.2 Energy, Power and Resistance - Circuit Symbols MS.pdf')].concat(seq(E,'Energy, Power & Resistance',8,[1]),c(E,'Resistance')),
notes:`
<h2>E.m.f. and p.d.</h2>
<p>Both are energy transferred per unit charge, measured in volts (1 V = 1 J C<sup>−1</sup>).</p>
<ul><li><strong>Potential difference</strong> V: energy transferred <em>from electrical to other forms</em> per unit charge, W = VQ.</li><li><strong>Electromotive force</strong> ε: energy transferred <em>from other forms to electrical</em> per unit charge, W = εQ.</li></ul>
<p>An electron accelerated through a p.d. V gains kinetic energy <strong>eV = ½mv²</strong>. 1 eV = 1.60 × 10<sup>−19</sup> J.</p>
<h2>Resistance and Ohm's law</h2>
<p><strong>R = V/I</strong>, unit the ohm (1 Ω = 1 V A<sup>−1</sup>). <strong>Ohm's law</strong>: for a metallic conductor at constant temperature, current is directly proportional to p.d.</p>
<svg class="diagram" viewBox="0 0 580 200" role="img" aria-label="I-V characteristics for a resistor, filament lamp and diode">
<g><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="95" y1="180" x2="95" y2="20"/><line class="c1" x1="20" y1="170" x2="170" y2="30"/><text x="40" y="195" class="small">ohmic resistor</text><text x="170" y="95" class="small">V</text><text x="100" y="28" class="small">I</text></g>
<g transform="translate(195 0)"><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="95" y1="180" x2="95" y2="20"/><path class="c1" d="M20 160 C40 150 60 140 75 125 C85 115 90 108 95 100 C100 92 105 85 115 75 C130 60 150 50 170 40"/><text x="40" y="195" class="small">filament lamp</text></g>
<g transform="translate(390 0)"><line class="ax" x1="10" y1="100" x2="180" y2="100"/><line class="ax" x1="80" y1="180" x2="80" y2="20"/><path class="c1" d="M15 100 L120 100 C130 98 135 85 140 60 L148 25"/><text x="40" y="195" class="small">diode / LED</text><text x="110" y="115" class="small">≈0.6 V</text></g></svg>
<ul><li><strong>Filament lamp</strong>: as current increases the filament heats up, ions vibrate more, electrons collide more often, resistance increases.</li><li><strong>Diode</strong>: very high resistance in reverse bias; conducts above a threshold p.d. (≈ 0.6 V for silicon, ≈ 1.5–3 V for an LED) in forward bias.</li><li><strong>NTC thermistor</strong>: resistance falls as temperature rises (more charge carriers released, n increases).</li><li><strong>LDR</strong>: resistance falls as light intensity increases.</li></ul>
<h2>Resistivity</h2>
<p><strong>R = ρL/A</strong>. Resistivity ρ (Ω m) is a property of the material at a given temperature. For metals ρ increases with temperature (more lattice vibration); for semiconductors ρ decreases with temperature (n increases greatly).</p>
<p><strong>PAG 3.1</strong>: measure R for several lengths of wire with an ammeter and voltmeter, measure diameter with a micrometer, plot R against L; gradient = ρ/A. Use low current to stop the wire heating.</p>
<h2>Electrical power and energy</h2>
<p><strong>P = VI = I²R = V²/R</strong>. Energy W = VIt. The <strong>kilowatt-hour</strong> is the energy transferred by a 1 kW device in 1 hour: 1 kW h = 3.6 × 10<sup>6</sup> J. Cost = number of kW h × price per kW h.</p>`,
eqs:[['W = VQ','p.d.'],['W = εQ','e.m.f.'],['eV = ½mv²','Electron accelerated through p.d.'],['V = IR','Resistance'],['R = ρL/A','Resistivity'],['P = VI = I²R = V²/R','Power'],['W = VIt','Energy'],['1 kW h = 3.6 × 10⁶ J','Kilowatt-hour']],
terms:[['Potential difference','Energy transferred from electrical energy to other forms per unit charge.'],['Electromotive force','Energy transferred from other forms to electrical energy per unit charge.'],['Volt','One joule per coulomb.'],['Resistance','The ratio of p.d. across a component to the current through it.'],['Ohm','The resistance when a p.d. of 1 V drives a current of 1 A.'],['Ohm’s law','For a metallic conductor at constant temperature, current is directly proportional to p.d.'],['Resistivity','ρ = RA/L; a property of a material, numerically the resistance of a 1 m length with 1 m² cross-section.'],['NTC thermistor','A component whose resistance decreases as its temperature increases.'],['LDR','Light-dependent resistor; resistance decreases as light intensity increases.'],['Kilowatt-hour','Energy transferred by a 1 kW device in 1 hour (3.6 MJ).'],['Electronvolt','Energy gained by an electron accelerated through a p.d. of 1 V; 1.60 × 10⁻¹⁹ J.']],
mcq:[
{q:'A wire has resistance 12 Ω. A second wire of the same material has twice the length and twice the diameter. Its resistance is',o:['3 Ω','6 Ω','12 Ω','24 Ω'],a:1,e:'R ∝ L/d²: × 2 / 4 → 6 Ω.'},
{q:'A 2.0 kW heater runs for 3.0 hours at 25p per kW h. The cost is',o:['£0.75','£1.50','£6.00','£15'],a:1,e:'6.0 kW h × £0.25 = £1.50.'},
{q:'An electron is accelerated through 500 V. Its speed is',o:['1.3 × 10⁷ m s⁻¹','4.2 × 10⁶ m s⁻¹','1.8 × 10¹⁴ m s⁻¹','9.4 × 10⁶ m s⁻¹'],a:0,e:'v = √(2 × 1.6 × 10⁻¹⁹ × 500 / 9.11 × 10⁻³¹) = 1.33 × 10⁷ m s⁻¹.'},
{q:'Why does the resistance of a filament lamp increase with current?',o:['n decreases','the filament gets longer','lattice ions vibrate more, so more collisions','e decreases'],a:2,e:'Higher temperature, more lattice vibration.'},
{q:'The resistance of an NTC thermistor falls as temperature rises because',o:['ions vibrate less','the number density of charge carriers increases','drift velocity falls','its length decreases'],a:1,e:'More electrons are released into conduction.'},
{q:'A 60 W lamp operates at 230 V. The current is',o:['0.26 A','3.8 A','0.0011 A','13.8 kA'],a:0,e:'I = P/V = 0.26 A.'}
],
exam:[
{id:'4.2-E1',marks:6,style:'Structured · resistivity',stem:'Nichrome wire has resistivity 1.1 × 10⁻⁶ Ω m. A heating element is made from 2.4 m of nichrome wire of diameter 0.50 mm.',parts:[
{q:'Calculate the resistance of the element.',m:2,ms:['A = π(0.25 × 10⁻³)² = 1.96 × 10⁻⁷ m²','R = 1.1 × 10⁻⁶ × 2.4 / 1.96 × 10⁻⁷ = 13.4 Ω'],ans:'13 Ω'},
{q:'Calculate the power dissipated when connected to 230 V.',m:2,ms:['P = V²/R','= 230²/13.4 = 3.9 kW'],ans:'3.9 kW'},
{q:'Explain why the resistance of the element increases as it warms up.',m:2,ms:['positive ions in the lattice vibrate with larger amplitude','electrons collide more frequently, so resistivity/resistance increases']}]},
{id:'4.2-E2',marks:4,style:'Structured · e.m.f. vs p.d.',stem:'A battery is labelled 12 V and drives a current of 2.0 A through a lamp for 5.0 minutes.',parts:[
{q:'Explain the difference between e.m.f. and potential difference.',m:2,ms:['e.m.f.: energy transferred from chemical (other forms) to electrical per unit charge','p.d.: energy transferred from electrical to other forms per unit charge']},
{q:'Calculate the charge that flows and the energy transferred by the battery.',m:2,ms:['Q = 2.0 × 300 = 600 C','W = εQ = 12 × 600 = 7.2 kJ']}]}
]});

S.addTopic({
id:'4.3',mod:4,title:'Electrical circuits',short:'Series and parallel, Kirchhoff’s second law, internal resistance, potential dividers.',
labs:['circuit','intres','potdiv'],pags:['p3-3','p4-1','p4-3'],
spec:['Kirchhoff’s second law; conservation of energy','Kirchhoff’s first and second laws applied to circuits','Total resistance of two or more resistors in series and in parallel','Analysis of circuits with components, including both series and parallel','Analysis of circuits with more than one source of e.m.f.','Source of e.m.f.; internal resistance; terminal p.d.; lost volts','ε = I(R + r) and ε = V + Ir; techniques to determine internal resistance (PAG4)','Potential divider circuit with components; V_out = R₂/(R₁ + R₂) × V_in','Potential divider circuits with variable components, e.g. LDR and thermistor; sensing circuits'],
packs:two(E,'4.3 Electrical Circuits').concat(seq(E,'Electrical Circuits',4,[2,3]),c(E,'DC Circuits')),
notes:`
<h2>Kirchhoff's second law</h2>
<p>In any closed loop of a circuit, the sum of the e.m.f.s equals the sum of the p.d.s. It is a consequence of <strong>conservation of energy</strong>.</p>
<h2>Combining resistors</h2>
<ul><li>Series: <strong>R = R₁ + R₂ + …</strong> (same current; p.d.s add).</li><li>Parallel: <strong>1/R = 1/R₁ + 1/R₂ + …</strong> (same p.d.; currents add). The total is less than the smallest resistor.</li></ul>
<h2>Internal resistance</h2>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="Cell with internal resistance r connected to external resistor R">
<rect x="40" y="40" width="200" height="110" rx="6" class="dash ax"/><text x="48" y="60" class="small">cell</text>
<line class="wire" x1="80" y1="95" x2="110" y2="95"/><line class="ax thick" x1="110" y1="75" x2="110" y2="115"/><line class="ax thick" x1="122" y1="85" x2="122" y2="105"/><line class="wire" x1="122" y1="95" x2="150" y2="95"/>
<rect x="150" y="85" width="50" height="20" class="fill2 ax"/><line class="wire" x1="200" y1="95" x2="280" y2="95"/><line class="wire" x1="80" y1="95" x2="20" y2="95"/>
<text x="110" y="135">ε</text><text x="168" y="125">r</text>
<line class="wire" x1="280" y1="95" x2="480" y2="95"/><line class="wire" x1="480" y1="95" x2="480" y2="180"/><line class="wire" x1="20" y1="95" x2="20" y2="180"/><line class="wire" x1="20" y1="180" x2="480" y2="180"/>
<rect x="320" y="170" width="70" height="20" class="fill2 ax"/><text x="350" y="166">R</text>
<text x="290" y="85" class="small">terminal p.d. V = ε − Ir</text></svg>
<p>Energy is dissipated inside the source by its internal resistance r. The p.d. across r is the <strong>lost volts</strong> (Ir). The p.d. across the terminals is the <strong>terminal p.d.</strong> V.</p>
<p><strong>ε = I(R + r)</strong> and <strong>ε = V + Ir</strong>. Plot V against I: straight line with gradient −r and y-intercept ε. More current → more lost volts → lower terminal p.d. A car battery needs very low r to deliver large starter-motor currents; a high-voltage supply has very high r for safety.</p>
<h2>Potential dividers</h2>
<svg class="diagram" viewBox="0 0 400 220" role="img" aria-label="Potential divider: a cell of e.m.f. Vin across two resistors in series, with Vout across R2">
<line class="wire" x1="80" y1="20" x2="80" y2="102"/><line class="wire" x1="62" y1="102" x2="98" y2="102"/><line class="wire thick" x1="70" y1="114" x2="90" y2="114" style="stroke-width:5"/><line class="wire" x1="80" y1="114" x2="80" y2="200"/><text x="102" y="98" class="small">+</text><line class="wire" x1="80" y1="20" x2="200" y2="20"/><line class="wire" x1="80" y1="200" x2="200" y2="200"/>
<line class="wire" x1="200" y1="20" x2="200" y2="40"/><rect x="190" y="40" width="20" height="55" class="fill2 ax"/><line class="wire" x1="200" y1="95" x2="200" y2="125"/><rect x="190" y="125" width="20" height="55" class="fill2 ax"/><line class="wire" x1="200" y1="180" x2="200" y2="200"/>
<line class="wire" x1="200" y1="110" x2="320" y2="110"/><line class="wire" x1="200" y1="200" x2="320" y2="200"/><circle cx="320" cy="110" r="4" class="dot"/><circle cx="320" cy="200" r="4" class="dot"/>
<text x="220" y="72">R₁</text><text x="220" y="158">R₂</text><text x="330" y="160">V<tspan dy="3" font-size="10">out</tspan></text><text x="22" y="113">V<tspan dy="3" font-size="10">in</tspan></text></svg>
<p><strong>V<sub>out</sub> = R₂/(R₁ + R₂) × V<sub>in</sub></strong>, and V₁/V₂ = R₁/R₂. Replace R₂ with a <strong>thermistor</strong> to make a temperature sensor, or with an <strong>LDR</strong> to make a light sensor: as light increases, R<sub>LDR</sub> falls, so V across the LDR falls.</p>
<blockquote class="tip"><p>Connecting a load of resistance comparable to R₂ across V<sub>out</sub> lowers V<sub>out</sub>, because the parallel combination has lower resistance.</p></blockquote>`,
eqs:[['R = R₁ + R₂ + …','Series'],['1/R = 1/R₁ + 1/R₂ + …','Parallel'],['ε = I(R + r)','Internal resistance'],['ε = V + Ir','Terminal p.d.'],['V<sub>out</sub> = R₂/(R₁ + R₂) × V<sub>in</sub>','Potential divider'],['V₁/V₂ = R₁/R₂','Potential divider ratio']],
terms:[['Kirchhoff’s second law','In any closed loop, the sum of e.m.f.s equals the sum of p.d.s (conservation of energy).'],['Internal resistance','The resistance of a source of e.m.f., which causes energy to be dissipated inside it.'],['Terminal p.d.','The p.d. across the terminals of a source; V = ε − Ir.'],['Lost volts','The p.d. across the internal resistance, Ir; energy per unit charge wasted in the source.'],['Potential divider','Two or more resistors in series that split a p.d. in the ratio of their resistances.']],
mcq:[
{q:'Resistors of 6 Ω and 3 Ω are in parallel, in series with 4 Ω. Total resistance is',o:['13 Ω','6 Ω','4.5 Ω','2.0 Ω'],a:1,e:'6∥3 = 2 Ω; + 4 = 6 Ω.'},
{q:'A cell (ε = 1.5 V, r = 0.50 Ω) drives current through a 2.5 Ω resistor. The terminal p.d. is',o:['1.5 V','1.25 V','0.25 V','0.50 V'],a:1,e:'I = 1.5/3.0 = 0.50 A; V = 0.50 × 2.5 = 1.25 V.'},
{q:'In a potential divider, R₁ = 2.0 kΩ and R₂ = 3.0 kΩ, V_in = 10 V. V_out (across R₂) is',o:['4.0 V','6.0 V','5.0 V','3.0 V'],a:1,e:'10 × 3/5 = 6.0 V.'},
{q:'An LDR is R₂ in a divider (V_out across the LDR). The light gets brighter. V_out',o:['increases','decreases','stays the same','falls to zero'],a:1,e:'R_LDR falls so its share of the p.d. falls.'},
{q:'A graph of terminal p.d. against current for a cell has gradient −0.80 Ω and intercept 9.0 V. The short-circuit current is',o:['7.2 A','9.0 A','11 A','0.80 A'],a:2,e:'I = ε/r = 9.0/0.80 = 11.25 A.'}
],
exam:[
{id:'4.3-E1',marks:6,style:'Structured · internal resistance',stem:'A student connects a variable resistor across a battery and records terminal p.d. V and current I: (0.20 A, 5.62 V), (0.50 A, 5.05 V), (0.80 A, 4.48 V), (1.10 A, 3.91 V).',parts:[
{q:'Explain why the terminal p.d. decreases as current increases.',m:2,ms:['lost volts Ir across the internal resistance increases with I','V = ε − Ir so V decreases']},
{q:'Use the data to determine the e.m.f. and internal resistance.',m:3,ms:['gradient = (3.91 − 5.62)/(1.10 − 0.20) = −1.9 V A⁻¹','r = 1.9 Ω','ε = 5.62 + 0.20 × 1.9 = 6.0 V'],ans:'ε = 6.0 V, r = 1.9 Ω'},
{q:'Calculate the maximum power that can be delivered to an external resistor.',m:1,ms:['when R = r: P = ε²/4r = 36/7.6 = 4.7 W']}]},
{id:'4.3-E2',marks:5,style:'Structured · sensing circuit',stem:'A thermistor and a fixed 1.5 kΩ resistor form a potential divider across a 9.0 V supply. V_out is taken across the fixed resistor. At 20 °C the thermistor resistance is 3.0 kΩ.',parts:[
{q:'Calculate V_out at 20 °C.',m:2,ms:['V_out = 1.5/(1.5 + 3.0) × 9.0','= 3.0 V'],ans:'3.0 V'},
{q:'Explain how V_out changes as temperature rises.',m:3,ms:['NTC thermistor: resistance falls as temperature rises','fixed resistor gets a larger share of the supply p.d.','V_out increases']}]}
]});

S.addTopic({
id:'4.4',mod:4,title:'Waves',short:'Wave properties, EM spectrum, polarisation, refraction, TIR, superposition, interference, stationary waves.',
labs:['string','ripple','wave','superpose','youngs','refraction','stationary','polarise'],pags:['p5-1','p5-2','p6-3'],
spec:['Progressive waves; longitudinal and transverse waves','Displacement, amplitude, wavelength, period, phase difference, frequency and speed; f = 1/T; v = fλ','Graphical representations of transverse and longitudinal waves','Reflection, refraction, polarisation and diffraction of all waves','Intensity I = P/A; intensity ∝ amplitude²','Electromagnetic spectrum; properties; orders of magnitude of wavelengths','Plane polarised waves; polarising filters; polarisation of microwaves','Refraction of light; refractive index n = c/v; n sin θ = constant; critical angle sin C = 1/n; total internal reflection in optical fibres','Principle of superposition; constructive and destructive interference; path difference and phase difference','Coherence; two-source interference with sound and microwaves; Young’s double-slit experiment; λ = ax/D','Stationary (standing) waves; nodes and antinodes; separation between adjacent nodes = λ/2','Stationary waves on strings, in air columns and with microwaves; fundamental and harmonics'],
packs:['4.4 Waves - Wave Motion','4.4 Waves - Electromagnetic Waves','4.4 Waves - Superposition','4.4 Waves - Stationary Waves'].flatMap(n=>two(M+'4.4-Waves',n)).concat(seq(M+'4.4-Waves','Waves',9),c(M+'4.4-Waves','Waves')),
notes:`
<h2>Progressive waves</h2>
<p>A progressive wave transfers energy (not matter) from one place to another. In a <strong>transverse</strong> wave the oscillations are perpendicular to the direction of energy transfer (EM waves, waves on strings). In a <strong>longitudinal</strong> wave they are parallel (sound), with compressions and rarefactions.</p>
<svg class="diagram" viewBox="0 0 560 190" role="img" aria-label="Displacement-distance graph showing amplitude and wavelength">
<line class="ax" x1="20" y1="95" x2="540" y2="95" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M20 95 C55 15 95 15 130 95 C165 175 205 175 240 95 C275 15 315 15 350 95 C385 175 425 175 460 95 C480 50 500 40 520 50"/>
<line class="dimline" x1="75" y1="95" x2="75" y2="36" marker-end="url(#ah)"/><text x="80" y="64" class="small">A</text>
<line class="dimline" x1="75" y1="20" x2="295" y2="20" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="175" y="16" class="small">λ</text>
<text x="525" y="114" class="small">x</text><text x="26" y="20" class="small">s</text></svg>
<p><strong>Phase difference</strong> between two points on a wave = (separation/λ) × 360° (or × 2π rad). Points one wavelength apart are in phase.</p>
<p><strong>f = 1/T</strong> and <strong>v = fλ</strong>. <strong>Intensity</strong> is power per unit area, I = P/A, with I ∝ A² (amplitude squared). For a point source I = P/4πr².</p>
<p>All waves can be <strong>reflected, refracted and diffracted</strong>. Diffraction is greatest when the gap is about the same size as the wavelength. Only transverse waves can be <strong>polarised</strong>.</p>
<h2>Electromagnetic spectrum</h2>
<div class="emspec"><span style="--h:0">radio<br><small>&gt; 10⁻¹ m</small></span><span style="--h:1">microwave<br><small>10⁻¹–10⁻³ m</small></span><span style="--h:2">infrared<br><small>10⁻³–7×10⁻⁷</small></span><span style="--h:3">visible<br><small>700–400 nm</small></span><span style="--h:4">UV<br><small>10⁻⁷–10⁻⁸</small></span><span style="--h:5">X-ray<br><small>10⁻⁸–10⁻¹³</small></span><span style="--h:6">gamma<br><small>10⁻¹⁰–10⁻¹⁶</small></span></div>
<p>All EM waves travel at c = 3.00 × 10<sup>8</sup> m s<sup>−1</sup> in a vacuum, are transverse, consist of oscillating electric and magnetic fields, and can be polarised. X-rays and gamma rays overlap in wavelength; they differ in origin (electron deceleration vs nuclear decay).</p>
<h2>Polarisation</h2>
<p>A <strong>plane polarised</strong> wave oscillates in one plane only. A polarising filter transmits one plane; two crossed filters block light. Light reflected from water or glass is partially polarised. Microwaves from a transmitter are polarised: rotating a metal grille receiver changes the intensity detected. Malus's law (not on the spec but used in PAG 6.3): I = I₀ cos²θ.</p>
<h2>Refraction and total internal reflection</h2>
<p><strong>n = c/v</strong>. Snell's law: <strong>n₁ sin θ₁ = n₂ sin θ₂</strong>. Light bends towards the normal when it slows down. <strong>Total internal reflection</strong> happens when light travels from a higher to a lower refractive index and the angle of incidence exceeds the critical angle C, where <strong>sin C = 1/n</strong> (to air). Optical fibres use a core of higher n surrounded by a lower-n cladding.</p>
<h2>Superposition and interference</h2>
<p><strong>Principle of superposition</strong>: when two waves meet, the resultant displacement equals the sum of the individual displacements.</p>
<ul><li>Constructive interference: path difference = nλ (phase difference 0, 360°…).</li><li>Destructive interference: path difference = (n + ½)λ (phase difference 180°).</li><li><strong>Coherent</strong> sources have a constant phase difference (and the same frequency). Needed for a stable interference pattern.</li></ul>
<svg class="diagram" viewBox="0 0 560 220" role="img" aria-label="Young's double slit: laser, double slit separation a, screen distance D, fringe separation x">
<rect x="20" y="95" width="40" height="30" rx="3" class="fill2 ax"/><text x="18" y="145" class="small">laser</text><line class="c1" x1="60" y1="110" x2="150" y2="110"/>
<line class="ax thick" x1="150" y1="20" x2="150" y2="100"/><line class="ax thick" x1="150" y1="105" x2="150" y2="115"/><line class="ax thick" x1="150" y1="120" x2="150" y2="200"/>
<text x="122" y="214" class="small">slits a</text>
<line class="ax thick" x1="500" y1="20" x2="500" y2="200"/>
<g class="fringes"><rect x="505" y="30" width="22" height="10"/><rect x="505" y="58" width="22" height="10"/><rect x="505" y="86" width="22" height="10"/><rect x="505" y="114" width="22" height="10"/><rect x="505" y="142" width="22" height="10"/><rect x="505" y="170" width="22" height="10"/></g>
<line class="c2 dash" x1="150" y1="102" x2="500" y2="63"/><line class="c2 dash" x1="150" y1="118" x2="500" y2="63"/>
<line class="dimline" x1="150" y1="210" x2="500" y2="210" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="320" y="206" class="small">D</text>
<line class="dimline" x1="540" y1="63" x2="540" y2="91" marker-start="url(#ahs)" marker-end="url(#ah)"/><text x="545" y="81" class="small">x</text></svg>
<p><strong>Young's double-slit</strong>: <strong>λ = ax/D</strong> (valid when a ≪ D). It provided evidence that light is a wave. Increase D to increase x and reduce percentage uncertainty; measure across several fringes.</p>
<p><strong>Diffraction grating</strong> (from 4.4.3 practical work): d sin θ = nλ, with d = 1/(lines per metre).</p>
<h2>Stationary waves</h2>
<p>A <strong>stationary wave</strong> is formed by the superposition of two progressive waves of the same frequency (and similar amplitude) travelling in opposite directions. It stores energy rather than transferring it.</p>
<div class="tbl"><table><tr><th></th><th>Progressive</th><th>Stationary</th></tr><tr><td>Energy</td><td>transferred</td><td>not transferred</td></tr><tr><td>Amplitude</td><td>same for all points</td><td>varies: zero at nodes, maximum at antinodes</td></tr><tr><td>Phase</td><td>varies continuously along the wave</td><td>all points between adjacent nodes in phase; 180° across a node</td></tr><tr><td>Wavelength</td><td>distance between adjacent in-phase points</td><td>twice the distance between adjacent nodes</td></tr></table></div>
<svg class="diagram" viewBox="0 0 560 300" role="img" aria-label="Harmonics on a string fixed at both ends and in a pipe closed at one end">
<text x="10" y="18" class="small">string fixed both ends: L = nλ/2</text>
<g transform="translate(0 30)"><line class="ax" x1="20" y1="30" x2="260" y2="30"/><path class="c1" d="M20 30 Q140 -10 260 30"/><path class="c1 dash" d="M20 30 Q140 70 260 30"/><text x="270" y="34" class="small">1st harmonic λ = 2L</text></g>
<g transform="translate(0 95)"><line class="ax" x1="20" y1="30" x2="260" y2="30"/><path class="c1" d="M20 30 Q80 -10 140 30 Q200 70 260 30"/><path class="c1 dash" d="M20 30 Q80 70 140 30 Q200 -10 260 30"/><text x="270" y="34" class="small">2nd harmonic λ = L</text></g>
<text x="10" y="200" class="small">pipe closed at one end: L = (2n − 1)λ/4, odd harmonics only</text>
<g transform="translate(0 215)"><rect x="20" y="10" width="240" height="40" class="ax"/><line class="ax thick" x1="20" y1="10" x2="20" y2="50"/><path class="c2" d="M20 30 Q140 30 260 6"/><path class="c2" d="M20 30 Q140 30 260 54"/><text x="270" y="34" class="small">fundamental λ = 4L (N at closed end, A at open end)</text></g></svg>
<p><strong>Resonance tube (PAG 5.2)</strong>: tuning fork over a tube in water; first resonance at L₁ = λ/4 − end correction, second at L₂ = 3λ/4 − end correction; so λ = 2(L₂ − L₁) and v = fλ.</p>
<p>Microwaves reflected from a metal plate form stationary waves; moving a probe between nodes gives λ/2.</p>`,
eqs:[['v = fλ','Wave equation'],['f = 1/T','Frequency'],['I = P/A; I ∝ A²','Intensity'],['n = c/v','Refractive index'],['n₁ sin θ₁ = n₂ sin θ₂','Snell’s law'],['sin C = 1/n','Critical angle (to air)'],['λ = ax/D','Young’s double slit'],['d sin θ = nλ','Diffraction grating'],['node spacing = λ/2','Stationary waves']],
terms:[['Progressive wave','A wave that transfers energy from one place to another.'],['Transverse wave','Oscillations perpendicular to the direction of energy transfer.'],['Longitudinal wave','Oscillations parallel to the direction of energy transfer.'],['Displacement','Distance of a point on the wave from its equilibrium position, in a given direction.'],['Amplitude','Maximum displacement from the equilibrium position.'],['Wavelength','Smallest distance between two points oscillating in phase.'],['Period','Time for one complete oscillation.'],['Frequency','Number of oscillations per unit time.'],['Phase difference','The difference in the stage of oscillation between two points, in degrees or radians.'],['Intensity','Radiant power passing through a surface per unit area.'],['Diffraction','The spreading of a wave as it passes through a gap or around an obstacle.'],['Plane polarised','Oscillations in one plane only, containing the direction of travel.'],['Refractive index','n = c/v, the ratio of the speed of light in vacuum to that in the material.'],['Critical angle','Angle of incidence at which the angle of refraction is 90°.'],['Principle of superposition','When two waves meet, the resultant displacement is the sum of the individual displacements.'],['Coherence','Constant phase difference between two waves of the same frequency.'],['Path difference','Difference in distance travelled by two waves from their sources to a point.'],['Stationary wave','A wave formed by superposition of two progressive waves of the same frequency travelling in opposite directions; no net energy transfer.'],['Node','Point on a stationary wave with zero amplitude.'],['Antinode','Point on a stationary wave with maximum amplitude.'],['Fundamental mode','The lowest-frequency stationary wave pattern of a system.']],
mcq:[
{q:'Two points on a wave are 15 cm apart. The wavelength is 60 cm. Phase difference is',o:['45°','90°','180°','270°'],a:1,e:'15/60 × 360° = 90°.'},
{q:'Light passes from glass (n = 1.50) to air. The critical angle is',o:['33.7°','41.8°','48.2°','56.3°'],a:1,e:'sin C = 1/1.5 → C = 41.8°.'},
{q:'In a Young’s slit experiment a = 0.50 mm, D = 2.0 m, fringe spacing 2.4 mm. λ =',o:['600 nm','480 nm','1.2 μm','240 nm'],a:0,e:'λ = ax/D = 0.50 × 10⁻³ × 2.4 × 10⁻³ / 2.0 = 6.0 × 10⁻⁷ m.'},
{q:'A string fixed at both ends has length 0.80 m. Waves travel at 120 m s⁻¹. The fundamental frequency is',o:['75 Hz','150 Hz','96 Hz','300 Hz'],a:0,e:'λ = 1.6 m; f = 120/1.6 = 75 Hz.'},
{q:'The amplitude of a wave halves. The intensity becomes',o:['half','a quarter','double','unchanged'],a:1,e:'I ∝ A².'},
{q:'Which cannot be polarised?',o:['microwaves','sound in air','light','radio waves'],a:1,e:'Sound in air is longitudinal.'},
{q:'A grating has 500 lines per mm. Light of 600 nm. Highest order visible is',o:['2','3','4','6'],a:1,e:'d = 2.0 μm; n_max = d/λ = 3.33 → 3.'}
],
exam:[
{id:'4.4-E1',marks:6,style:'Structured · stationary waves',stem:'A string of length 1.20 m is fixed at both ends and vibrated by a signal generator. A stationary wave with three antinodes forms at 150 Hz.',parts:[
{q:'Explain how the stationary wave is formed.',m:2,ms:['wave reflects at the fixed end','reflected and incident waves (same f, opposite directions) superpose']},
{q:'Calculate the wavelength and the speed of waves on the string.',m:2,ms:['3 loops: L = 3λ/2 → λ = 0.80 m','v = fλ = 150 × 0.80 = 120 m s⁻¹'],ans:'λ = 0.80 m; v = 120 m s⁻¹'},
{q:'State the phase difference between two points on either side of a node, and the frequency of the fundamental.',m:2,ms:['180° (π rad)','f₁ = 150/3 = 50 Hz']}]},
{id:'4.4-E2',marks:6,style:'Structured · interference',stem:'Two loudspeakers 1.5 m apart are connected to the same signal generator at 1.7 kHz. A microphone moves along a line 6.0 m away, parallel to the line joining the speakers. Speed of sound 340 m s⁻¹.',parts:[
{q:'Explain why the two loudspeakers act as coherent sources.',m:1,ms:['same signal generator: same frequency and constant phase difference']},
{q:'Calculate the separation of adjacent maxima detected.',m:3,ms:['λ = 340/1700 = 0.20 m','x = λD/a = 0.20 × 6.0 / 1.5','= 0.80 m'],ans:'0.80 m'},
{q:'Explain why the intensity at a minimum is not zero.',m:2,ms:['waves from the two speakers have different amplitudes at that point (different distances)','reflections from walls/surroundings']}]},
{id:'4.4-E3',marks:4,style:'Structured · TIR',stem:'An optical fibre has a core of refractive index 1.52 and cladding of refractive index 1.48.',parts:[
{q:'Calculate the critical angle at the core–cladding boundary.',m:2,ms:['sin C = 1.48/1.52','C = 77°'],ans:'77°'},
{q:'Explain why cladding is used.',m:2,ms:['protects the core from scratches (which would let light escape)','prevents signal crossing between fibres / maintains TIR / security']}]}
]});

S.addTopic({
id:'4.5',mod:4,title:'Quantum physics',short:'Photons, photoelectric effect, Einstein’s equation, LEDs and Planck constant, de Broglie.',
labs:['photoelectric','debroglie'],pags:['p6-1'],
spec:['Particulate nature (photon model) of electromagnetic radiation; photon as a quantum of energy','Energy of a photon E = hf and E = hc/λ','The electronvolt; 1 eV = 1.60 × 10⁻¹⁹ J','Using LEDs and the equation eV = hc/λ to estimate the Planck constant h (PAG6)','Demonstration of the photoelectric effect using a gold-leaf electroscope and zinc plate','Photoelectrons; one-to-one interaction between a photon and a surface electron; Einstein’s photoelectric equation hf = φ + KE_max','Work function; threshold frequency','Effect of intensity on the photoelectric current; KE_max independent of intensity','Electron diffraction as evidence of the wave-like nature of particles; de Broglie equation λ = h/p'],
packs:two(M+'4.5-Quantum-Physics','4.5 Quantum Physics').concat(seq(M+'4.5-Quantum-Physics','Quantum Physics',5),c(M+'4.5-Quantum-Physics','Quantum Physics')),
notes:`
<h2>Photons</h2>
<p>EM radiation is emitted and absorbed in discrete packets called <strong>photons</strong>: a quantum of energy of EM radiation. <strong>E = hf = hc/λ</strong>, h = 6.63 × 10<sup>−34</sup> J s. Photons have no mass and no charge and travel at c.</p>
<h2>Estimating h with LEDs (PAG 6.1)</h2>
<p>Each LED starts to emit light at a threshold p.d. V, when the energy given to each electron equals the photon energy: <strong>eV = hc/λ</strong>. Plot V against 1/λ for several LEDs: gradient = hc/e, so h = gradient × e/c.</p>
<h2>The photoelectric effect</h2>
<p>When EM radiation of high enough frequency shines on a metal, electrons (<strong>photoelectrons</strong>) are emitted from its surface. A charged gold-leaf electroscope with a clean zinc plate: UV makes the leaf of a negatively charged electroscope fall; visible light, however intense, does nothing.</p>
<p><strong>Einstein's photoelectric equation</strong>: <strong>hf = φ + KE<sub>max</sub></strong>.</p>
<ul><li><strong>Work function</strong> φ: the minimum energy needed to free an electron from the surface of the metal.</li><li><strong>Threshold frequency</strong> f₀ = φ/h: the minimum frequency for emission.</li><li>One photon interacts with one electron (one-to-one, instantaneous). Energy is not "saved up".</li><li>KE<sub>max</sub> depends on frequency only, not intensity. Electrons deeper in the metal lose more energy escaping, so most have less than KE<sub>max</sub>.</li><li>Increasing intensity (above f₀) increases the number of photons per second and so the <strong>rate of emission</strong> (photocurrent), not KE<sub>max</sub>.</li></ul>
<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="Graph of KEmax against frequency: straight line, gradient h, x-intercept threshold frequency, y-intercept minus work function">
<line class="ax" x1="60" y1="150" x2="500" y2="150" marker-end="url(#ah)"/><line class="ax" x1="100" y1="220" x2="100" y2="20" marker-end="url(#ah)"/>
<line class="c1" x1="200" y1="150" x2="460" y2="40"/><line class="c1 dash" x1="100" y1="192" x2="200" y2="150"/>
<text x="480" y="170" class="small">f</text><text x="106" y="28" class="small">KE<tspan dy="3" font-size="9">max</tspan></text><text x="188" y="168" class="small">f₀</text><text x="40" y="196" class="small">−φ</text><text x="340" y="80" class="lbl1 small">gradient = h</text></svg>
<p>The wave model fails because it predicts emission at any frequency given enough intensity or time, and KE increasing with intensity. This is evidence for the particle nature of light.</p>
<h2>Wave–particle duality</h2>
<p>Particles have wave-like properties. The <strong>de Broglie wavelength</strong>: <strong>λ = h/p = h/mv</strong>. <strong>Electron diffraction</strong>: a beam of electrons through a thin graphite film gives rings on a fluorescent screen, evidence for the wave nature of electrons. The spacing between carbon atoms (≈ 10<sup>−10</sup> m) is similar to the electrons' de Broglie wavelength, so diffraction is significant. Increasing the accelerating p.d. increases momentum, shortens λ and makes the rings smaller.</p>`,
eqs:[['E = hf = hc/λ','Photon energy'],['hf = φ + KE<sub>max</sub>','Einstein’s photoelectric equation'],['φ = hf₀','Work function and threshold frequency'],['eV = hc/λ','LED threshold p.d.'],['λ = h/p = h/mv','de Broglie wavelength'],['p = √(2meV)','Momentum of electron accelerated through V']],
terms:[['Photon','A quantum of energy of electromagnetic radiation.'],['Electronvolt','Energy transferred to an electron accelerated through a p.d. of 1 V.'],['Photoelectric effect','Emission of electrons from a metal surface when EM radiation above a threshold frequency is incident on it.'],['Work function','The minimum energy required to free an electron from the surface of a metal.'],['Threshold frequency','The minimum frequency of EM radiation that causes photoelectric emission from a metal.'],['Wave–particle duality','Light and matter can show both wave-like and particle-like behaviour.'],['de Broglie wavelength','λ = h/p, the wavelength associated with a moving particle.']],
mcq:[
{q:'The energy of a photon of wavelength 450 nm is',o:['4.4 × 10⁻¹⁹ J','2.2 × 10⁻¹⁹ J','8.8 × 10⁻²⁸ J','2.8 eV × 10⁻¹⁹'],a:0,e:'hc/λ = 6.63 × 10⁻³⁴ × 3.0 × 10⁸ / 4.5 × 10⁻⁷ = 4.4 × 10⁻¹⁹ J.'},
{q:'A metal has work function 2.3 eV. Light of photon energy 3.1 eV hits it. KE_max of photoelectrons =',o:['0.8 eV','2.3 eV','3.1 eV','5.4 eV'],a:0,e:'KE_max = 3.1 − 2.3 = 0.8 eV.'},
{q:'Doubling the intensity of light (above f₀) on a metal',o:['doubles KE_max','doubles the rate of emission','halves the threshold frequency','has no effect'],a:1,e:'More photons per second → more electrons per second.'},
{q:'The de Broglie wavelength of an electron moving at 2.0 × 10⁶ m s⁻¹ is',o:['3.6 × 10⁻¹⁰ m','3.6 × 10⁻¹³ m','1.8 × 10⁻¹⁰ m','7.3 × 10⁻¹⁰ m'],a:0,e:'λ = 6.63 × 10⁻³⁴ / (9.11 × 10⁻³¹ × 2.0 × 10⁶) = 3.6 × 10⁻¹⁰ m.'},
{q:'The gradient of a KE_max against f graph is',o:['φ','h','f₀','e'],a:1,e:'KE_max = hf − φ.'},
{q:'An LED switches on at 2.1 V. The wavelength emitted is approximately',o:['590 nm','420 nm','950 nm','310 nm'],a:0,e:'λ = hc/eV = 1.989 × 10⁻²⁵/(3.36 × 10⁻¹⁹) = 5.9 × 10⁻⁷ m.'}
],
exam:[
{id:'4.5-E1',marks:7,style:'Structured · photoelectric',stem:'Ultraviolet radiation of wavelength 220 nm is incident on a zinc plate. The work function of zinc is 4.3 eV.',parts:[
{q:'Calculate the energy of a UV photon in eV.',m:2,ms:['E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ / 220 × 10⁻⁹ = 9.04 × 10⁻¹⁹ J','= 5.65 eV'],ans:'5.7 eV'},
{q:'Calculate the maximum speed of the photoelectrons.',m:3,ms:['KE_max = 5.65 − 4.3 = 1.35 eV = 2.16 × 10⁻¹⁹ J','v = √(2 × 2.16 × 10⁻¹⁹ / 9.11 × 10⁻³¹)','= 6.9 × 10⁵ m s⁻¹'],ans:'6.9 × 10⁵ m s⁻¹'},
{q:'Explain why very intense red light does not cause emission.',m:2,ms:['photon energy of red light is less than the work function (f < f₀)','one photon interacts with one electron; energy cannot accumulate, so intensity does not matter']}]},
{id:'4.5-E2',marks:5,style:'Structured · electron diffraction',stem:'Electrons are accelerated through 3.0 kV and pass through a thin graphite target.',parts:[
{q:'Calculate the de Broglie wavelength of the electrons.',m:3,ms:['KE = 3000 × 1.6 × 10⁻¹⁹ = 4.8 × 10⁻¹⁶ J','p = √(2mE) = √(2 × 9.11 × 10⁻³¹ × 4.8 × 10⁻¹⁶) = 2.96 × 10⁻²³ kg m s⁻¹','λ = h/p = 2.2 × 10⁻¹¹ m'],ans:'2.2 × 10⁻¹¹ m'},
{q:'State and explain what happens to the diffraction rings when the p.d. is increased.',m:2,ms:['electrons have greater momentum so shorter wavelength','less diffraction: rings get smaller (smaller radius)']}]}
]});
})();
