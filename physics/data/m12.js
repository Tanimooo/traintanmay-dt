/* Modules 1 & 2 */
(function(){
const S=window.SPEC, P=S.pack;
S.addTopic({
id:'1.1',mod:1,title:'Practical skills and uncertainties',short:'Plan, implement, analyse and evaluate experiments; the 12 PAGs.',
labs:['grapher'],pags:['p1-1','p2-1','p3-1'],
spec:['Plan experiments: identify independent, dependent and control variables; choose apparatus and safe methods','Implement methods using a range of apparatus; record data in tables with units and consistent significant figures','Analyse data: plot graphs, draw lines of best fit, find gradients and intercepts, use logarithmic plots','Evaluate: identify random and systematic errors, anomalies, percentage uncertainty, and suggest improvements','Use of apparatus: micrometer, vernier calipers, light gates, data-loggers, oscilloscope, multimeters, ionising radiation sources','Practical endorsement: 12 PAGs covering the CPAC criteria (assessed by teacher, reported Pass/Not classified)'],
packs:[P('Set M (legacy)','Practical Skills & Applications QP','1-Practical-Skills-in-Physics/Set-M/Practical Skills and Applications QP.pdf'),P('Set M (legacy)','Practical Skills & Applications MS','1-Practical-Skills-in-Physics/Set-M/Practical Skills and Applications MS.pdf')],
notes:`
<h2>Variables and fair tests</h2>
<p>The <strong>independent variable</strong> is the one you change, the <strong>dependent variable</strong> is the one you measure, and <strong>control variables</strong> are kept constant so they cannot affect the result. Papers ask you to <em>state how</em> you would keep a variable constant, not just that you would.</p>
<h2>Errors and uncertainty</h2>
<div class="tbl"><table><tr><th>Type</th><th>What it does</th><th>How to reduce it</th></tr>
<tr><td>Random error</td><td>Scatters readings unpredictably either side of the true value. Affects <strong>precision</strong>.</td><td>Repeat and average; use a larger range; use data-loggers.</td></tr>
<tr><td>Systematic error</td><td>Shifts every reading by the same amount or factor. Affects <strong>accuracy</strong>. Repeats do not help.</td><td>Calibrate; check zero error; remove parallax; change technique.</td></tr>
<tr><td>Zero error</td><td>Instrument reads non-zero when it should read zero (a type of systematic error).</td><td>Check before use and subtract.</td></tr></table></div>
<p><strong>Accuracy</strong>: how close a value is to the true value. <strong>Precision</strong>: how close repeated values are to each other. <strong>Resolution</strong>: the smallest change an instrument can show.</p>
<h3>Combining uncertainties</h3>
<ul>
<li>Absolute uncertainty of a single reading ≈ ± resolution (or half the range of repeats).</li>
<li>Percentage uncertainty = (absolute uncertainty ÷ value) × 100%.</li>
<li>Adding or subtracting quantities: <strong>add absolute</strong> uncertainties.</li>
<li>Multiplying or dividing: <strong>add percentage</strong> uncertainties.</li>
<li>Raising to a power n: <strong>multiply percentage uncertainty by n</strong> (e.g. r² doubles it).</li>
</ul>
<svg class="diagram" viewBox="0 0 520 250" role="img" aria-label="Graph with error bars, best fit line and worst acceptable line">
<line class="ax" x1="50" y1="210" x2="500" y2="210" marker-end="url(#ah)"/><line class="ax" x1="50" y1="210" x2="50" y2="20" marker-end="url(#ah)"/>
<text x="470" y="232">x</text><text x="30" y="30">y</text>
<g class="c1"><line x1="60" y1="196" x2="480" y2="44"/></g>
<g class="c2 dash"><line x1="60" y1="184" x2="480" y2="56"/></g>
<g class="pt">
<circle cx="110" cy="176" r="4"/><line x1="110" y1="166" x2="110" y2="186"/>
<circle cx="190" cy="152" r="4"/><line x1="190" y1="140" x2="190" y2="164"/>
<circle cx="270" cy="118" r="4"/><line x1="270" y1="106" x2="270" y2="130"/>
<circle cx="350" cy="95" r="4"/><line x1="350" y1="82" x2="350" y2="108"/>
<circle cx="430" cy="60" r="4"/><line x1="430" y1="46" x2="430" y2="74"/></g>
<text x="440" y="34" class="lbl1" text-anchor="middle">best fit</text><text x="400" y="106" class="lbl2" text-anchor="middle">worst acceptable</text>
</svg>
<p>The <strong>uncertainty in a gradient</strong> = |best gradient − worst gradient|. The worst acceptable line goes through all error bars, as steep (or shallow) as possible. % uncertainty in gradient = (difference ÷ best gradient) × 100%.</p>
<h2>Graphs and linearising</h2>
<p>Rearrange the equation into y = mx + c so the gradient or intercept gives the quantity you want.</p>
<div class="tbl"><table><tr><th>Relationship</th><th>Plot</th><th>Gradient / intercept</th></tr>
<tr><td>T = 2π√(m/k)</td><td>T² against m</td><td>gradient = 4π²/k</td></tr>
<tr><td>s = ½gt²</td><td>s against t²</td><td>gradient = g/2</td></tr>
<tr><td>V = V₀e<sup>−t/CR</sup></td><td>ln V against t</td><td>gradient = −1/CR, intercept = ln V₀</td></tr>
<tr><td>y = kx<sup>n</sup></td><td>ln y against ln x</td><td>gradient = n, intercept = ln k</td></tr>
<tr><td>E = V + Ir… V = E − Ir</td><td>V against I</td><td>gradient = −r, intercept = E</td></tr></table></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> use a large triangle covering more than half the line when finding a gradient, and quote the gradient with units. Points on a graph should be plotted to within half a small square.</p></blockquote>
<h2>The practical endorsement</h2>
<p>OCR A has 12 Practical Activity Groups (PAGs). Paper 3 and all written papers test the skills, and around 15% of marks across the A level are on practical skills. Use the <a href="#pags">Practicals</a> section to run each one.</p>`,
eqs:[['% uncertainty = (Δx / x) × 100%','Percentage uncertainty'],['Δ(gradient) = |m<sub>best</sub> − m<sub>worst</sub>|','Uncertainty in gradient'],['% diff = |experimental − accepted| / accepted × 100%','Percentage difference']],
terms:[['Independent variable','The variable that is deliberately changed by the experimenter.'],['Dependent variable','The variable that is measured as the independent variable changes.'],['Control variable','A variable kept constant so it does not affect the dependent variable.'],['Random error','Unpredictable variation in readings that causes scatter about the true value.'],['Systematic error','An error that shifts all readings by the same amount or proportion, e.g. a zero error.'],['Accuracy','How close a measured value is to the true value.'],['Precision','How close repeated measurements are to each other (small spread).'],['Resolution','The smallest change in a quantity that an instrument can detect.'],['Anomaly','A result that does not fit the pattern of the other results.'],['Uncertainty','The interval within which the true value is expected to lie.'],['Repeatable','Same results when the same experimenter repeats the experiment with the same method and equipment.'],['Reproducible','Same results when a different person or a different technique/equipment is used.']],
mcq:[
{q:'The length of a wire is 0.800 ± 0.002 m and its diameter is 0.40 ± 0.01 mm. What is the percentage uncertainty in its cross-sectional area?',o:['2.5%','5.0%','5.25%','0.25%'],a:1,e:'A ∝ d², so % uncertainty in A = 2 × (0.01/0.40 × 100%) = 2 × 2.5% = 5.0%. The length is not in A.'},
{q:'Which change reduces a systematic error?',o:['Repeating readings and taking a mean','Using a data-logger with a higher sample rate','Correcting for the zero error of a micrometer','Plotting more points on the graph'],a:2,e:'Systematic errors shift every reading; repeats do not remove them. Correcting the zero error does.'},
{q:'A student plots ln V against t for a discharging capacitor. The gradient is −0.050 s⁻¹. The resistance is 100 kΩ. What is the capacitance?',o:['200 μF','20 μF','2.0 mF','5.0 μF'],a:0,e:'Gradient = −1/CR, so CR = 20 s and C = 20 / 100 000 = 2.0 × 10⁻⁴ F = 200 μF.'},
{q:'Readings: 2.31 s, 2.35 s, 2.29 s, 2.33 s. What is the best estimate of the absolute uncertainty in the mean?',o:['±0.01 s','±0.03 s','±0.06 s','±0.12 s'],a:1,e:'Half the range: (2.35 − 2.29)/2 = 0.03 s.'},
{q:'Which instrument is most suitable to measure the diameter of a wire of about 0.3 mm?',o:['Metre rule','Vernier calipers (0.1 mm)','Micrometer screw gauge (0.01 mm)','Travelling microscope with 1 mm scale'],a:2,e:'The micrometer gives the smallest percentage uncertainty for a 0.3 mm diameter.'}
],
exam:[
{id:'1.1-E1',marks:6,style:'Paper 3 style · planning',stem:'A student wants to determine the spring constant k of a spring by timing oscillations of a mass m hanging on it. The period is T = 2π√(m/k).',parts:[
{q:'Describe how the student should collect accurate data and how a graph can be used to find k.',m:6,ms:['Measure m using a top-pan balance; use a range of at least 5 masses (e.g. 100 g to 500 g)','Displace mass a small distance and release; time 10 (or 20) oscillations with a stopwatch and divide by number of oscillations','Use a fiducial marker at the equilibrium position to start/stop timing','Repeat timings and calculate mean T','Plot T² against m: straight line through origin','k = 4π² / gradient']}]},
{id:'1.1-E2',marks:5,style:'Structured · uncertainty',stem:'The resistivity of a metal is found using ρ = RA/L. Measurements: R = 4.6 ± 0.1 Ω, diameter d = 0.38 ± 0.01 mm, L = 1.000 ± 0.002 m.',parts:[
{q:'Calculate ρ.',m:2,ms:['A = π(0.19 × 10⁻³)² = 1.13 × 10⁻⁷ m²','ρ = 4.6 × 1.13 × 10⁻⁷ / 1.000 = 5.2 × 10⁻⁷ Ω m'],ans:'5.2 × 10⁻⁷ Ω m'},
{q:'Calculate the absolute uncertainty in ρ.',m:3,ms:['% in R = 2.2%; % in d = 2.6% so % in A = 5.3%','% in L = 0.2%; total = 2.2 + 5.3 + 0.2 = 7.7%','Δρ = 0.077 × 5.2 × 10⁻⁷ ≈ 0.4 × 10⁻⁷ Ω m'],ans:'± 0.4 × 10⁻⁷ Ω m (≈ 8%)'}]}
]});

S.addTopic({
id:'2.1',mod:2,title:'Physical quantities and S.I. units',short:'Base units, derived units, prefixes, homogeneity and estimation.',
labs:[],pags:[],
spec:['Physical quantities have a numerical value and a unit','Make sensible estimates of physical quantities in this specification','S.I. base quantities: mass (kg), length (m), time (s), current (A), temperature (K), amount of substance (mol)','Derived units expressed in base units, e.g. momentum kg m s⁻¹','Check homogeneity of equations using S.I. base units','Prefixes from pico (p) to tera (T)'],
packs:[P('Set O 2022–24','2.1 Physical Quantities QP','2-Foundations-of-Physics/Set-O/2.1 Physical Quantities QP.pdf'),P('Set O 2022–24','2.1 Physical Quantities MS','2-Foundations-of-Physics/Set-O/2.1 Physical Quantities MS.pdf'),P('Set O 2022–24','2.1 SI units QP','2-Foundations-of-Physics/Set-O/2.1 SI units QP.pdf'),P('Set O 2022–24','2.1 SI units MS','2-Foundations-of-Physics/Set-O/2.1 SI units MS.pdf'),P('Set N 2016–21','2.1 Physical Quantities QP','2-Foundations-of-Physics/Set-N/2.1 Physical Quantities QP.pdf'),P('Set N 2016–21','2.1 Physical Quantities MS','2-Foundations-of-Physics/Set-N/2.1 Physical Quantities MS.pdf'),P('Set N 2016–21','2.1 SI units QP','2-Foundations-of-Physics/Set-N/2.1 SI units QP.pdf'),P('Set N 2016–21','2.1 SI Units MS','2-Foundations-of-Physics/Set-N/2.1 SI Units MS.pdf'),P('Set M (legacy)','Physical Quantities and Units QP','2-Foundations-of-Physics/Set-M/Physical Quantities and Units QP.pdf'),P('Set M (legacy)','Physical Quantities and Units MS','2-Foundations-of-Physics/Set-M/Physical Quantities and Units MS.pdf')],
notes:`
<h2>Base quantities</h2>
<div class="tbl"><table><tr><th>Quantity</th><th>Unit</th><th>Symbol</th></tr>
<tr><td>Mass</td><td>kilogram</td><td>kg</td></tr><tr><td>Length</td><td>metre</td><td>m</td></tr><tr><td>Time</td><td>second</td><td>s</td></tr><tr><td>Current</td><td>ampere</td><td>A</td></tr><tr><td>Temperature</td><td>kelvin</td><td>K</td></tr><tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr></table></div>
<p>Every other unit is <strong>derived</strong> from these. Work it out from a defining equation:</p>
<ul><li>Force: F = ma → kg m s<sup>−2</sup> (the newton)</li><li>Energy: W = Fx → kg m<sup>2</sup> s<sup>−2</sup> (the joule)</li><li>Power: P = W/t → kg m<sup>2</sup> s<sup>−3</sup> (the watt)</li><li>Charge: Q = It → A s (the coulomb)</li><li>p.d.: V = W/Q → kg m<sup>2</sup> s<sup>−3</sup> A<sup>−1</sup> (the volt)</li><li>Resistance: R = V/I → kg m<sup>2</sup> s<sup>−3</sup> A<sup>−2</sup> (the ohm)</li></ul>
<h2>Homogeneity</h2>
<p>An equation is <strong>homogeneous</strong> if the base units on both sides are the same. Homogeneity is necessary but <strong>not sufficient</strong> for an equation to be correct: it cannot detect wrong pure numbers such as ½ or 2π.</p>
<blockquote class="tip"><p><strong>Example:</strong> check v² = u² + 2as. Each term has units m² s<sup>−2</sup>, since a × s = m s<sup>−2</sup> × m. Homogeneous.</p></blockquote>
<h2>Prefixes</h2>
<p>pico 10<sup>−12</sup>, nano 10<sup>−9</sup>, micro 10<sup>−6</sup>, milli 10<sup>−3</sup>, centi 10<sup>−2</sup>, deci 10<sup>−1</sup>, kilo 10<sup>3</sup>, mega 10<sup>6</sup>, giga 10<sup>9</sup>, tera 10<sup>12</sup>.</p>
<p>Watch area and volume conversions: 1 mm² = 10<sup>−6</sup> m² and 1 cm³ = 10<sup>−6</sup> m³.</p>
<h2>Estimates worth knowing</h2>
<div class="tbl"><table><tr><th>Quantity</th><th>Order of magnitude</th></tr>
<tr><td>Mass of an adult</td><td>70 kg</td></tr><tr><td>Walking speed</td><td>1.5 m s<sup>−1</sup></td></tr><tr><td>Height of a room</td><td>2.5 m</td></tr><tr><td>Diameter of an atom</td><td>10<sup>−10</sup> m</td></tr><tr><td>Diameter of a nucleus</td><td>10<sup>−15</sup> m</td></tr><tr><td>Wavelength of visible light</td><td>400–700 nm</td></tr><tr><td>Mass of an apple</td><td>0.1 kg</td></tr><tr><td>Power of a kettle</td><td>2 kW</td></tr><tr><td>Mains p.d. (UK)</td><td>230 V</td></tr><tr><td>Density of water</td><td>1000 kg m<sup>−3</sup></td></tr></table></div>`,
eqs:[['1 N = 1 kg m s<sup>−2</sup>','Newton in base units'],['1 J = 1 kg m<sup>2</sup> s<sup>−2</sup>','Joule in base units'],['1 V = 1 kg m<sup>2</sup> s<sup>−3</sup> A<sup>−1</sup>','Volt in base units'],['1 Ω = 1 kg m<sup>2</sup> s<sup>−3</sup> A<sup>−2</sup>','Ohm in base units']],
terms:[['Base unit','One of the six S.I. units from which all others are derived (kg, m, s, A, K, mol).'],['Derived unit','A unit expressed as a product or quotient of base units.'],['Homogeneous equation','An equation in which every term has the same base units.'],['Physical quantity','A property that has a numerical value and a unit.'],['Order of magnitude','The power of ten nearest to a value.']],
mcq:[
{q:'What are the S.I. base units of the pascal?',o:['kg m s⁻²','kg m⁻¹ s⁻²','kg m⁻² s⁻²','N m⁻²'],a:1,e:'Pa = N m⁻² = kg m s⁻² × m⁻² = kg m⁻¹ s⁻². N is not a base unit.'},
{q:'Which is not an S.I. base quantity?',o:['Temperature','Amount of substance','Charge','Current'],a:2,e:'Charge is derived: Q = It, unit A s.'},
{q:'The drag force on a sphere is F = kv². What are the base units of k?',o:['kg m⁻¹','kg s⁻¹','kg m s⁻¹','kg m⁻²'],a:0,e:'k = F/v² = kg m s⁻² / (m² s⁻²) = kg m⁻¹.'},
{q:'A wire has cross-sectional area 0.20 mm². What is this in m²?',o:['2.0 × 10⁻⁴','2.0 × 10⁻⁵','2.0 × 10⁻⁷','2.0 × 10⁻⁸'],a:2,e:'1 mm² = 10⁻⁶ m², so 0.20 mm² = 2.0 × 10⁻⁷ m².'},
{q:'Which is the best estimate of the kinetic energy of a sprinter at top speed?',o:['40 J','400 J','4000 J','40 000 J'],a:2,e:'½ × 70 × 10² ≈ 3500 J ~ 4000 J.'},
{q:'What are the base units of power?',o:['kg m² s⁻²','kg m² s⁻³','kg m s⁻³','J s⁻¹'],a:1,e:'W = J/s = kg m² s⁻² / s.'}
],
exam:[
{id:'2.1-E1',marks:4,style:'Structured · homogeneity',stem:'The speed v of a wave on a string is thought to be given by v = √(T/μ), where T is tension and μ is mass per unit length.',parts:[
{q:'Show that the equation is homogeneous.',m:3,ms:['T has units kg m s⁻²','μ has units kg m⁻¹','T/μ = m² s⁻² so √ gives m s⁻¹, the unit of v']},
{q:'Explain why showing an equation is homogeneous does not prove it is correct.',m:1,ms:['Numerical factors / dimensionless constants (e.g. ½, 2π) cannot be checked']}]},
{id:'2.1-E2',marks:3,style:'Structured · base units',stem:'Resistivity ρ is defined by ρ = RA/L.',parts:[{q:'Determine the S.I. base units of resistivity.',m:3,ms:['R = V/I; V = W/Q = kg m² s⁻² / (A s) = kg m² s⁻³ A⁻¹','R: kg m² s⁻³ A⁻²','ρ = RA/L: kg m³ s⁻³ A⁻²'],ans:'kg m³ s⁻³ A⁻²'}]}
]});

S.addTopic({
id:'2.2',mod:2,title:'Making measurements and analysing data',short:'Uncertainties, errors, significant figures, best-fit lines.',
labs:['grapher'],pags:['p1-1'],
spec:['Systematic errors (including zero errors) and random errors in measurements','Precision and accuracy','Absolute and percentage uncertainties when data are combined by addition, subtraction, multiplication, division and raising to powers','Graphical treatment of errors and uncertainties; line of best fit; worst line; absolute and percentage uncertainty in gradient and intercept'],
packs:[P('Set O 2022–24','2.2 Measurements & Data QP','2-Foundations-of-Physics/Set-O/2.2 Making Measuremants and Analysing Data QP.pdf'),P('Set O 2022–24','2.2 Measurements & Data MS','2-Foundations-of-Physics/Set-O/2.2 Making Measuremants and Analysing Data MS.pdf'),P('Set N 2016–21','2.2 Measurements & Data QP','2-Foundations-of-Physics/Set-N/2.2 Making Measuremants and Analysing Data QP.pdf'),P('Set N 2016–21','2.2 Measurements & Data MS','2-Foundations-of-Physics/Set-N/2.2 Making Measuremants and Analysing Data MS.pdf')],
notes:`
<h2>Recording results</h2>
<ul><li>Column headings carry a quantity and a unit: <em>t / s</em>.</li><li>Raw data are recorded to the resolution of the instrument; processed data to the same or one more significant figure than the raw data.</li><li>Final answers: no more significant figures than the least precise data used.</li></ul>
<h2>Uncertainty rules worked through</h2>
<blockquote class="tip"><p>Density ρ = m/V of a cube: m = 52.0 ± 0.1 g (0.19%), side l = 2.00 ± 0.02 cm (1.0%). V = l³ so %V = 3.0%. %ρ = 0.19 + 3.0 = 3.2%. ρ = 6.50 g cm<sup>−3</sup> ± 0.21 g cm<sup>−3</sup>.</p></blockquote>
<h2>Uncertainty from a graph</h2>
<p>Draw error bars on each point. The <strong>line of best fit</strong> passes through the error bars with points balanced either side. The <strong>worst acceptable line</strong> is the steepest or shallowest line still passing through all the error bars.</p>
<p>Uncertainty in y-intercept = |intercept<sub>best</sub> − intercept<sub>worst</sub>|.</p>
<h2>Systematic error spotted on a graph</h2>
<p>A straight line that should pass through the origin but has a constant intercept suggests a systematic error such as a zero error, or a quantity not accounted for (e.g. the radius of a pendulum bob).</p>`,
eqs:[['Δ(A ± B) = ΔA + ΔB','Adding/subtracting: add absolute uncertainties'],['%(AB) = %A + %B; %(A/B) = %A + %B','Multiplying/dividing: add % uncertainties'],['%(A<sup>n</sup>) = n × %A','Powers: multiply % by n']],
terms:[['Absolute uncertainty','The uncertainty in a quantity, in the same units as the quantity.'],['Percentage uncertainty','Absolute uncertainty divided by the value, × 100%.'],['Line of best fit','A line drawn through the data with points evenly balanced either side.'],['Worst acceptable line','Steepest or shallowest straight line that passes through all error bars.'],['Zero error','A non-zero reading when the true value is zero.']],
mcq:[
{q:'A = 4.0 ± 0.2 and B = 2.0 ± 0.1. What is the uncertainty in A − B?',o:['±0.1','±0.2','±0.3','±10%'],a:2,e:'Subtracting: add absolute uncertainties → 0.3.'},
{q:'The kinetic energy E = ½mv². m has 1% uncertainty and v has 3% uncertainty. What is the % uncertainty in E?',o:['4%','5%','7%','10%'],a:2,e:'1% + 2 × 3% = 7%.'},
{q:'A straight-line graph of extension against load has a positive intercept on the extension axis. The most likely cause is',o:['random error in loads','a zero error in the extension measurement','the spring exceeding its limit of proportionality','too few readings'],a:1,e:'A constant offset is systematic, typically a zero error.'},
{q:'Best gradient 2.40; worst gradient 2.58. What is the % uncertainty in the gradient?',o:['3.7%','7.5%','0.18%','18%'],a:1,e:'(2.58 − 2.40)/2.40 × 100 = 7.5%.'},
{q:'The radius of a sphere is measured with 2% uncertainty. What is the % uncertainty in its volume?',o:['2%','4%','6%','8%'],a:2,e:'V ∝ r³ → 3 × 2% = 6%.'}
],
exam:[
{id:'2.2-E1',marks:5,style:'Structured · graph',stem:'A student measures the period T of a pendulum for different lengths L and plots T² against L. The best-fit line has gradient 4.06 s² m⁻¹ and the worst acceptable line has gradient 3.88 s² m⁻¹.',parts:[
{q:'Use T = 2π√(L/g) to show that the gradient equals 4π²/g.',m:1,ms:['T² = (4π²/g)L, so a graph of T² against L has gradient 4π²/g']},
{q:'Determine g and its absolute uncertainty.',m:4,ms:['g = 4π²/4.06 = 9.72 m s⁻²','g(worst) = 4π²/3.88 = 10.17 m s⁻²','Δg = 10.17 − 9.72 = 0.45 m s⁻²','g = 9.7 ± 0.5 m s⁻² (consistent sf)'],ans:'9.7 ± 0.5 m s⁻²'}]}
]});

S.addTopic({
id:'2.3',mod:2,title:'Nature of quantities: scalars and vectors',short:'Adding and resolving vectors.',
labs:['vectors'],pags:[],
spec:['Scalar and vector quantities','Vector addition and subtraction','Vector triangle to determine the resultant of any two coplanar vectors','Resolving a vector into two perpendicular components: Fx = F cos θ, Fy = F sin θ'],
packs:[P('Set O 2022–24','2.3 Nature of Quantities QP','2-Foundations-of-Physics/Set-O/2.3 Nature of Quantities QP.pdf'),P('Set O 2022–24','2.3 Nature of Quantities MS','2-Foundations-of-Physics/Set-O/2.3 Nature of Quantities MS.pdf'),P('Set N 2016–21','2.3 Nature of Quantities QP','2-Foundations-of-Physics/Set-N/2.3 Nature of Quantities QP.pdf'),P('Set N 2016–21','2.3 Nature of Quantities MS','2-Foundations-of-Physics/Set-N/2.3 Nature of Quantities MS.pdf'),P('Set M (legacy)','Nature of Quantities 1 QP','2-Foundations-of-Physics/Set-M/Nature of Quantities 1 QP.pdf'),P('Set M (legacy)','Nature of Quantities 1 MS','2-Foundations-of-Physics/Set-M/Nature of Quantities 1 MS.pdf'),P('Set M (legacy)','Nature of Quantities 2 QP','2-Foundations-of-Physics/Set-M/Nature of Quantities 2 QP.pdf'),P('Set M (legacy)','Nature of Quantities 2 MS','2-Foundations-of-Physics/Set-M/Nature of Quantities 2 MS.pdf')],
notes:`
<h2>Scalars and vectors</h2>
<p>A <strong>scalar</strong> has magnitude only (mass, speed, distance, energy, time, temperature, charge). A <strong>vector</strong> has magnitude and direction (displacement, velocity, acceleration, force, momentum, weight, field strength).</p>
<h2>Adding vectors</h2>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Vector triangle: A then B tip to tail, resultant R from start to end">
<line class="c1 thick" x1="60" y1="180" x2="300" y2="180" marker-end="url(#ahb)"/>
<line class="c2 thick" x1="300" y1="180" x2="380" y2="50" marker-end="url(#aha)"/>
<line class="ax thick" x1="60" y1="180" x2="378" y2="53" marker-end="url(#ah)"/>
<text x="170" y="204" class="lbl1">A</text><text x="352" y="128" class="lbl2">B</text><text x="200" y="100">R = A + B</text>
<path class="ax" d="M100 180 A40 40 0 0 0 97 165"/><text x="106" y="172">θ</text>
</svg>
<p>Draw vectors <strong>tip to tail</strong>. The resultant goes from the tail of the first to the tip of the last. For perpendicular vectors use Pythagoras: R = √(A² + B²), θ = tan<sup>−1</sup>(B/A). For non-perpendicular vectors draw a scale diagram, or use the cosine and sine rules.</p>
<h2>Resolving</h2>
<p>A vector F at angle θ to the horizontal has components <strong>F<sub>x</sub> = F cos θ</strong> and <strong>F<sub>y</sub> = F sin θ</strong>. On a slope of angle θ, weight resolves into mg sin θ down the slope and mg cos θ perpendicular to it.</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Block on a slope with weight resolved">
<path class="fillsoft ax" d="M40 190 L460 190 L460 50 Z"/>
<g transform="rotate(-18.4 250 120)"><rect x="220" y="85" width="60" height="38" class="fill2 ax"/></g>
<line class="ax thick" x1="250" y1="118" x2="250" y2="200" marker-end="url(#ah)"/><text x="256" y="210">mg</text>
<line class="c1 thick" x1="250" y1="118" x2="226" y2="126" marker-end="url(#ahb)"/><text x="160" y="140" class="lbl1">mg sin θ</text>
<line class="c2 thick" x1="250" y1="118" x2="275" y2="194" marker-end="url(#aha)"/><text x="282" y="178" class="lbl2">mg cos θ</text>
<text x="70" y="182">θ</text></svg>`,
eqs:[['R = √(F<sub>x</sub>² + F<sub>y</sub>²)','Magnitude of resultant of perpendicular components'],['F<sub>x</sub> = F cos θ, F<sub>y</sub> = F sin θ','Resolving a vector'],['a² = b² + c² − 2bc cos A','Cosine rule for non-right-angled triangles']],
terms:[['Scalar','A quantity with magnitude only.'],['Vector','A quantity with both magnitude and direction.'],['Resultant','The single vector that has the same effect as two or more vectors combined.'],['Resolving','Splitting a vector into two perpendicular components.'],['Coplanar','Lying in the same plane.']],
mcq:[
{q:'Which list contains only vectors?',o:['velocity, momentum, energy','acceleration, weight, displacement','speed, force, mass','work, power, impulse'],a:1,e:'Energy, speed, mass, work and power are scalars.'},
{q:'Forces of 6 N and 8 N act at right angles. The resultant is',o:['2 N','10 N','14 N','48 N'],a:1,e:'√(36 + 64) = 10 N.'},
{q:'A 20 N force acts at 30° above the horizontal. Its vertical component is',o:['10 N','17 N','20 N','11.5 N'],a:0,e:'20 sin 30° = 10 N.'},
{q:'Two forces of 5 N and 12 N act on a point. Which resultant is impossible?',o:['7 N','10 N','17 N','18 N'],a:3,e:'The resultant lies between 7 N and 17 N.'},
{q:'A 2.0 kg box rests on a 25° frictionless slope. The component of weight down the slope is',o:['8.3 N','17.8 N','19.6 N','4.9 N'],a:0,e:'mg sin θ = 19.62 × sin 25° = 8.3 N.'}
],
exam:[
{id:'2.3-E1',marks:4,style:'Structured · vectors',stem:'A boat heads due north at 4.0 m s⁻¹ relative to the water. A current flows due east at 1.5 m s⁻¹.',parts:[
{q:'Calculate the resultant velocity of the boat (magnitude and direction).',m:3,ms:['v = √(4.0² + 1.5²) = 4.3 m s⁻¹','θ = tan⁻¹(1.5/4.0) = 21°','direction: 21° east of north (bearing 021°)'],ans:'4.3 m s⁻¹ at 21° east of north'},
{q:'State why a scale drawing would give the same answer.',m:1,ms:['vectors add tip-to-tail; the drawn resultant represents the same vector sum']}]}
]});
})();
