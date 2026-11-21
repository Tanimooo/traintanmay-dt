/* Full topic notes, Modules 1 and 2. Replaces the short notes in m12.js (loaded after it). */
(function(){
const N={};

N['1.1']=`
<h2>Why practical skills matter</h2>
<p>Practical skills are tested in two ways. In the written papers, about 15% of the marks come from questions about experiments: planning one, spotting errors, processing data, drawing graphs and evaluating results. Separately, your teacher signs off the <strong>Practical Endorsement</strong>: you must complete the 12 Practical Activity Groups (PAGs) and show the CPAC skills (below). The endorsement is reported as Pass or Not classified and does not change your grade, but universities often ask for it.</p>
<p>This topic is the toolkit. Topic 2.2 goes deeper into uncertainties, and each practical has its own page in the <a href="#pags">Practicals</a> section.</p>

<h2>Planning an experiment</h2>
<h3>Variables</h3>
<ul>
<li>The <strong>independent variable</strong> is the one you deliberately change (for example, the length of a wire).</li>
<li>The <strong>dependent variable</strong> is the one you measure in response (the resistance of the wire).</li>
<li><strong>Control variables</strong> are everything else that could affect the dependent variable, so you keep them constant (the wire's material, its diameter and its temperature).</li>
</ul>
<p>Exam questions want you to say <em>how</em> you would keep a variable constant. "Keep the temperature constant" earns little. "Use a small current and switch off between readings so the wire does not heat up" earns the mark.</p>
<h3>Writing a method</h3>
<p>A good plan, the kind asked for in 6-mark questions, covers:</p>
<ol>
<li><strong>Diagram</strong> of the arrangement, labelled.</li>
<li><strong>What you measure and with what</strong>: "measure the length with a metre rule; measure the diameter with a micrometer at several points and take the mean".</li>
<li><strong>Range and number of readings</strong>: at least 5–6 values of the independent variable over as wide a range as is sensible, with repeats.</li>
<li><strong>How you will analyse the data</strong>: what graph you will plot and how the gradient or intercept gives the answer.</li>
<li><strong>Control variables and safety</strong>.</li>
</ol>
<h3>Safety and risk assessment</h3>
<p>Identify the hazard, the risk it causes and how you reduce it. Examples: masses falling from a stretched wire (use a sand tray, wear goggles because the wire may snap); hot resistors (low current, let them cool); radioactive sources (use tongs, keep a distance, keep exposure time short, return the source to its lead box); lasers (never look into the beam, point it away from people).</p>

<h2>Measuring instruments</h2>
<div class="tbl"><table><tr><th>Instrument</th><th>Typical resolution</th><th>Use it for</th></tr>
<tr><td>Metre rule</td><td>1 mm</td><td>Lengths from a few cm to 1 m. Read at eye level to avoid parallax.</td></tr>
<tr><td>Vernier calipers</td><td>0.1 mm (sometimes 0.05 mm)</td><td>Internal and external diameters, depths, up to ~15 cm.</td></tr>
<tr><td>Micrometer screw gauge</td><td>0.01 mm</td><td>Small diameters such as wires or ball bearings.</td></tr>
<tr><td>Stopwatch</td><td>0.01 s (but human reaction time is ~0.2 s)</td><td>Times longer than a few seconds. Time many oscillations and divide.</td></tr>
<tr><td>Light gate + data-logger</td><td>~0.001 s or better</td><td>Short times and speeds: the card of length L blocks the beam for time t, so v = L/t.</td></tr>
<tr><td>Digital multimeter</td><td>Last digit shown, e.g. 0.01 V</td><td>p.d. (in parallel), current (in series), resistance (component disconnected).</td></tr>
<tr><td>Oscilloscope</td><td>Set by the time-base and volts/div settings</td><td>Measuring a varying p.d.: peak voltage, period and so frequency.</td></tr>
<tr><td>Top-pan balance</td><td>0.01 g or 0.1 g</td><td>Mass. Zero (tare) it first.</td></tr>
<tr><td>Thermometer / temperature probe</td><td>1 °C or 0.1 °C</td><td>Temperature. Stir the liquid; wait for the reading to settle.</td></tr>
</table></div>
<h3>Reading a micrometer</h3>
<p>The main scale on the sleeve shows whole and half millimetres. The rotating thimble has 50 divisions, and one full turn moves the spindle 0.50 mm, so each division is 0.01 mm. Reading = sleeve reading + (thimble division × 0.01 mm). Always close the jaws first to check for a <strong>zero error</strong>, and use the ratchet so you do not squeeze the object.</p>
<h3>Reading vernier calipers</h3>
<p>Read the main scale just to the left of the vernier's zero. Then find the vernier line that lines up exactly with a main-scale line; its number gives the extra tenths of a millimetre. For example: main scale 23 mm, vernier line 6 aligned, so the reading is 23.6 mm.</p>
<h3>Reading an oscilloscope</h3>
<p>Count squares (divisions). <strong>Peak p.d.</strong> = number of vertical divisions from the centre line to the peak × volts/div. <strong>Period</strong> T = number of horizontal divisions for one full cycle × time-base (s/div). Then <strong>f = 1/T</strong>. Measure across several cycles to reduce the uncertainty.</p>

<h2>Recording data</h2>
<ul>
<li>Draw the table <strong>before</strong> you start. Independent variable in the first column, then repeats, then the mean, then any processed values (for example 1/x or T²).</li>
<li>Every column heading has a quantity and a unit, separated by a solidus: <strong>length / m</strong>, <strong>T² / s²</strong>. No units in the body of the table.</li>
<li>Raw readings are all recorded to the <strong>same number of decimal places</strong>, matching the resolution of the instrument. Writing 2.0, 2.5, 3 is wrong: it should be 2.0, 2.5, 3.0.</li>
<li>Processed values (means, squares) should have the same number of significant figures as the raw data, or one more.</li>
<li>An <strong>anomaly</strong> is a reading that does not fit the pattern. Check it by repeating. Leave it out of the mean, but do not delete it from the table: mark it.</li>
</ul>

<h2>Graphs</h2>
<h3>Drawing a good graph</h3>
<ol>
<li>Independent variable on the x-axis, dependent variable on the y-axis (unless the question tells you otherwise).</li>
<li>Label both axes with quantity and unit, exactly like the table headings.</li>
<li>Choose scales so the points fill <strong>more than half</strong> the grid in each direction. Use sensible steps (1, 2, 5, 10 per big square), never 3 or 7. The origin does not have to be included.</li>
<li>Plot points with neat crosses, accurate to within half a small square.</li>
<li>Draw a single thin <strong>line of best fit</strong> (straight or a smooth curve) with points evenly scattered either side. Do not join the dots.</li>
</ol>
<h3>Gradient and intercept</h3>
<p>Draw a large triangle: its hypotenuse should cover more than half the length of the line. Gradient = Δy/Δx, read using points <strong>on the line</strong>, not data points. Give the gradient a unit (the y unit divided by the x unit). The y-intercept is read where x = 0. If the x-axis does not start at 0, calculate it from c = y − mx instead.</p>
<h3>Turning equations into straight lines</h3>
<p>A straight line is the easiest graph to analyse, so we rearrange the physics into the form <strong>y = mx + c</strong>. Whatever you plot on the y-axis is "y", whatever you plot on the x-axis is "x", and the constants left over make up the gradient m and intercept c.</p>
<div class="tbl"><table><tr><th>Equation</th><th>Plot y against x</th><th>Gradient</th><th>Intercept</th></tr>
<tr><td>T = 2π√(m/k)</td><td>T² against m</td><td>4π²/k</td><td>0</td></tr>
<tr><td>s = ½gt² (from rest)</td><td>s against t²</td><td>g/2</td><td>0</td></tr>
<tr><td>V = E − Ir</td><td>V against I</td><td>−r</td><td>E</td></tr>
<tr><td>R = ρL/A</td><td>R against L</td><td>ρ/A</td><td>0</td></tr>
<tr><td>V = V₀e<sup>−t/CR</sup></td><td>ln V against t</td><td>−1/CR</td><td>ln V₀</td></tr>
<tr><td>y = kx<sup>n</sup></td><td>ln y against ln x</td><td>n</td><td>ln k</td></tr>
</table></div>
<h3>Logarithmic graphs</h3>
<p>For exponentials and power laws, take natural logs of both sides. For y = kx<sup>n</sup>: ln y = n ln x + ln k, which is a straight line of gradient n. For y = Ae<sup>−λx</sup>: ln y = −λx + ln A, gradient −λ. To get the constant back from an intercept c, use k = e<sup>c</sup>. Logs have no units, so label the axis "ln (V / V)", that is, the log of the number.</p>

<h2>Errors, accuracy and precision</h2>
<ul>
<li><strong>Random errors</strong> make readings scatter unpredictably either side of the true value (reaction time, a fluctuating meter reading). They reduce <strong>precision</strong>. Reduce their effect by repeating and taking a mean.</li>
<li><strong>Systematic errors</strong> shift every reading by the same amount or proportion (a zero error, a meter that reads 2% high, always reading a scale from above). They reduce <strong>accuracy</strong>. Repeating does not help; you must fix the cause, for example by calibrating.</li>
<li><strong>Accuracy</strong>: how close a measurement is to the true value.</li>
<li><strong>Precision</strong>: how close repeated measurements are to each other (small spread).</li>
<li><strong>Repeatable</strong>: the same person with the same method and equipment gets the same results. <strong>Reproducible</strong>: a different person, or different equipment or method, gets the same results.</li>
<li><strong>Resolution</strong>: the smallest change in a quantity that an instrument can detect.</li>
</ul>
<p>Topic 2.2 shows how to put numbers on these ideas with uncertainties.</p>

<h2>Evaluating an experiment</h2>
<p>When asked to evaluate, work through these:</p>
<ol>
<li><strong>Compare</strong> with the accepted value: percentage difference = |experimental − accepted| ÷ accepted × 100%. If the percentage difference is smaller than the percentage uncertainty, the result agrees with the accepted value within experimental uncertainty.</li>
<li><strong>Find the biggest source of uncertainty</strong>: the measurement with the largest percentage uncertainty. That is the one worth improving.</li>
<li><strong>Suggest specific improvements</strong> that tackle that source. "Use a micrometer instead of a ruler to measure the diameter, as it has a resolution of 0.01 mm" is specific. "Be more careful" or "use better equipment" get no marks.</li>
<li>Look for evidence of <strong>systematic error</strong> on the graph, such as a line that should pass through the origin but does not.</li>
</ol>

<h2>The Practical Endorsement and CPAC</h2>
<p>The 12 PAGs are: 1 Investigating motion · 2 Investigating properties of materials · 3 Investigating electrical properties · 4 Investigating electrical circuits · 5 Investigating waves · 6 Investigating quantum effects · 7 Investigating ionising radiation · 8 Investigating gases · 9 Investigating capacitors · 10 Investigating simple harmonic motion · 11 Individual investigation (for example specific heat capacity or transformers) · 12 Research skills.</p>
<p>Across them your teacher checks the five Common Practical Assessment Criteria (CPAC):</p>
<ol>
<li>Follows written procedures.</li>
<li>Applies investigative approaches and methods when using instruments and equipment.</li>
<li>Works safely.</li>
<li>Makes and records observations.</li>
<li>Researches, references and reports.</li>
</ol>
<blockquote class="tip"><p><strong>Exam tip:</strong> "Suggest one way to improve the experiment" questions are marked on two things: <em>what</em> you would change and <em>why</em> it helps. Always give both.</p></blockquote>
`;

N['2.1']=`
<h2>Quantities and units</h2>
<p>A <strong>physical quantity</strong> is anything you can measure, and it always has two parts: a number and a unit. "The mass is 3.0" means nothing; "the mass is 3.0 kg" is a quantity. A useful way to think about it is quantity = number × unit. That is why table headings are written <em>mass / kg</em>: dividing the quantity by its unit leaves the pure number that goes in the table.</p>
<p>Symbols for quantities are written in italics (<em>m</em> for mass); unit symbols are upright (m for metre). This matters: <em>m</em> = 2 m means "the mass is 2 metres", which is nonsense.</p>

<h2>The S.I. base units</h2>
<p>Scientists agreed on a small set of base quantities. Every other quantity can be built from them. OCR expects you to know six:</p>
<div class="tbl"><table><tr><th>Base quantity</th><th>Unit</th><th>Symbol</th></tr>
<tr><td>Mass</td><td>kilogram</td><td>kg</td></tr><tr><td>Length</td><td>metre</td><td>m</td></tr><tr><td>Time</td><td>second</td><td>s</td></tr><tr><td>Electric current</td><td>ampere</td><td>A</td></tr><tr><td>Temperature</td><td>kelvin</td><td>K</td></tr><tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr></table></div>
<p>Note: charge is <strong>not</strong> a base quantity, and nor is the coulomb a base unit. Current is the base quantity; charge is derived from it (Q = It). The kilogram is the only base unit with a prefix built in.</p>

<h2>Derived units</h2>
<p>A derived unit is built from base units by multiplying and dividing. The method is always the same: take a defining equation for the quantity, and replace each quantity with its base units.</p>
<div class="tbl"><table><tr><th>Quantity</th><th>Defining equation</th><th>Base units</th><th>Named unit</th></tr>
<tr><td>Velocity</td><td>v = s/t</td><td>m s<sup>−1</sup></td><td>—</td></tr>
<tr><td>Acceleration</td><td>a = Δv/t</td><td>m s<sup>−2</sup></td><td>—</td></tr>
<tr><td>Force</td><td>F = ma</td><td>kg m s<sup>−2</sup></td><td>newton, N</td></tr>
<tr><td>Momentum</td><td>p = mv</td><td>kg m s<sup>−1</sup></td><td>(N s)</td></tr>
<tr><td>Work / energy</td><td>W = Fx</td><td>kg m<sup>2</sup> s<sup>−2</sup></td><td>joule, J</td></tr>
<tr><td>Power</td><td>P = W/t</td><td>kg m<sup>2</sup> s<sup>−3</sup></td><td>watt, W</td></tr>
<tr><td>Pressure</td><td>p = F/A</td><td>kg m<sup>−1</sup> s<sup>−2</sup></td><td>pascal, Pa</td></tr>
<tr><td>Charge</td><td>Q = It</td><td>A s</td><td>coulomb, C</td></tr>
<tr><td>Potential difference</td><td>V = W/Q</td><td>kg m<sup>2</sup> s<sup>−3</sup> A<sup>−1</sup></td><td>volt, V</td></tr>
<tr><td>Resistance</td><td>R = V/I</td><td>kg m<sup>2</sup> s<sup>−3</sup> A<sup>−2</sup></td><td>ohm, Ω</td></tr>
<tr><td>Frequency</td><td>f = 1/T</td><td>s<sup>−1</sup></td><td>hertz, Hz</td></tr>
<tr><td>Density</td><td>ρ = m/V</td><td>kg m<sup>−3</sup></td><td>—</td></tr>
</table></div>
<div class="wex"><p><strong>Worked example: the volt in base units.</strong></p>
<p>V = W/Q. Work W is in joules = kg m<sup>2</sup> s<sup>−2</sup>. Charge Q = It is in A s.</p>
<p>So volt = (kg m<sup>2</sup> s<sup>−2</sup>) ÷ (A s) = <strong>kg m<sup>2</sup> s<sup>−3</sup> A<sup>−1</sup></strong>.</p>
<p>Build up step by step like this. Each named unit you work out (N, J, C) becomes a stepping stone for the next.</p></div>
<p>Pure numbers, and quantities that are ratios of the same thing (strain, refractive index, efficiency), have <strong>no unit</strong>. Angles in radians are also unitless in base-unit terms.</p>

<h2>Checking equations: homogeneity</h2>
<p>You can only add, subtract or equate quantities that have the same units: you cannot add 3 kg to 2 m. So in a correct equation every term must have the same base units. An equation like this is called <strong>homogeneous</strong>.</p>
<div class="wex"><p><strong>Worked example: is s = ut + ½at² homogeneous?</strong></p>
<p>Left: s is in m.</p>
<p>ut: (m s<sup>−1</sup>)(s) = m. ½at²: the ½ has no unit, so (m s<sup>−2</sup>)(s<sup>2</sup>) = m.</p>
<p>Every term is in metres, so the equation is homogeneous.</p></div>
<div class="wex"><p><strong>Worked example: find the unit of a constant.</strong> The drag force on a sphere is F = kv². Find the base units of k.</p>
<p>k = F/v² = (kg m s<sup>−2</sup>) ÷ (m<sup>2</sup> s<sup>−2</sup>) = <strong>kg m<sup>−1</sup></strong>.</p></div>
<p>Homogeneity is a useful check, but it cannot prove an equation is right. Pure numbers like ½, 2 or π have no units, so s = ut + at² is also homogeneous but wrong. Homogeneous is necessary but <strong>not sufficient</strong>.</p>

<h2>Prefixes and standard form</h2>
<p>Prefixes stand for powers of ten, so you can write very large and very small values neatly:</p>
<div class="tbl"><table><tr><th>Prefix</th><th>Symbol</th><th>Factor</th><th>Prefix</th><th>Symbol</th><th>Factor</th></tr>
<tr><td>tera</td><td>T</td><td>10<sup>12</sup></td><td>centi</td><td>c</td><td>10<sup>−2</sup></td></tr>
<tr><td>giga</td><td>G</td><td>10<sup>9</sup></td><td>milli</td><td>m</td><td>10<sup>−3</sup></td></tr>
<tr><td>mega</td><td>M</td><td>10<sup>6</sup></td><td>micro</td><td>μ</td><td>10<sup>−6</sup></td></tr>
<tr><td>kilo</td><td>k</td><td>10<sup>3</sup></td><td>nano</td><td>n</td><td>10<sup>−9</sup></td></tr>
<tr><td>deci</td><td>d</td><td>10<sup>−1</sup></td><td>pico</td><td>p</td><td>10<sup>−12</sup></td></tr>
</table></div>
<p>To convert, replace the prefix with its power of ten: 470 μF = 470 × 10<sup>−6</sup> F = 4.70 × 10<sup>−4</sup> F.</p>
<h3>Area and volume conversions</h3>
<p>The prefix is squared or cubed along with the unit. 1 cm = 10<sup>−2</sup> m, so 1 cm² = (10<sup>−2</sup> m)² = 10<sup>−4</sup> m² and 1 cm³ = 10<sup>−6</sup> m³. Likewise 1 mm² = 10<sup>−6</sup> m². This catches people out in resistivity (cross-sectional area) and density questions.</p>
<h3>Other conversions you will meet</h3>
<ul>
<li>km h<sup>−1</sup> to m s<sup>−1</sup>: divide by 3.6 (since 1000 m ÷ 3600 s).</li>
<li>Electronvolt: 1 eV = 1.60 × 10<sup>−19</sup> J.</li>
<li>Kilowatt-hour: 1 kWh = 1000 W × 3600 s = 3.6 × 10<sup>6</sup> J.</li>
<li>Temperature: T / K = θ / °C + 273 (use 273.15 only if the data are that precise).</li>
</ul>
<h3>Significant figures</h3>
<p>Give your final answer to the same number of significant figures as the <strong>least precise</strong> data in the question, usually 2 or 3. Keep full figures in your calculator during the working and only round at the end, otherwise rounding errors build up.</p>

<h2>Estimating</h2>
<p>Estimation questions ask for a sensible value, often to an order of magnitude (the nearest power of ten). Use everyday values you know, show each assumption, and round sensibly.</p>
<div class="tbl"><table><tr><th>Quantity</th><th>Typical value</th></tr>
<tr><td>Mass of an adult</td><td>70 kg</td></tr><tr><td>Mass of a car</td><td>1000–1500 kg</td></tr><tr><td>Mass of an apple</td><td>0.1 kg</td></tr>
<tr><td>Walking speed</td><td>1.5 m s<sup>−1</sup></td></tr><tr><td>Motorway speed</td><td>30 m s<sup>−1</sup></td></tr><tr><td>Speed of sound in air</td><td>340 m s<sup>−1</sup></td></tr>
<tr><td>Height of a room / person</td><td>2.5 m / 1.7 m</td></tr><tr><td>Diameter of an atom</td><td>10<sup>−10</sup> m</td></tr><tr><td>Diameter of a nucleus</td><td>10<sup>−15</sup> m</td></tr>
<tr><td>Wavelength of visible light</td><td>400–700 nm</td></tr><tr><td>Power of a kettle / light bulb</td><td>2 kW / 10–60 W</td></tr><tr><td>Mains p.d. (UK)</td><td>230 V</td></tr>
<tr><td>Density of water / air</td><td>1000 / 1.2 kg m<sup>−3</sup></td></tr><tr><td>Atmospheric pressure</td><td>1.0 × 10<sup>5</sup> Pa</td></tr><tr><td>Thickness of paper</td><td>0.1 mm</td></tr></table></div>
<div class="wex"><p><strong>Worked example: estimate the kinetic energy of a person jogging.</strong></p>
<p>Assume m ≈ 70 kg and v ≈ 3 m s<sup>−1</sup>. E<sub>k</sub> = ½mv² = ½ × 70 × 3² ≈ 300 J. The order of magnitude is 10<sup>2</sup> J.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> in "show that" unit questions, write each step: start from an equation, substitute units, then simplify. Jumping straight to the answer loses the method marks.</p></blockquote>
`;

N['2.2']=`
<h2>No measurement is exact</h2>
<p>Every measurement has some doubt in it. The <strong>uncertainty</strong> is the range either side of your value within which the true value probably lies. Writing <em>l</em> = 25.3 ± 0.1 cm says the true length is probably between 25.2 cm and 25.4 cm. Being able to estimate, combine and reduce uncertainties is what this topic is about. It builds on the error types in topic 1.1.</p>

<h2>Types of error</h2>
<h3>Random errors</h3>
<p>Unpredictable variations that make repeated readings scatter either side of the true value. Causes include human reaction time, small fluctuations in conditions (draughts, temperature) and reading a scale that wobbles. They affect <strong>precision</strong>. Because they scatter both ways, taking many readings and averaging reduces their effect. Plotting a graph and drawing a best-fit line also averages them out.</p>
<h3>Systematic errors</h3>
<p>Errors that push every reading in the same direction by the same amount (or the same proportion). They affect <strong>accuracy</strong>. Repeating readings will <em>not</em> reveal or reduce them, because every repeat is wrong in the same way. Causes include:</p>
<ul>
<li><strong>Zero error</strong>: the instrument reads a value when it should read zero (a micrometer that reads 0.02 mm with its jaws closed, a balance not tared). Correct by subtracting the zero reading from every measurement.</li>
<li><strong>Calibration error</strong>: the scale itself is wrong, for example a thermometer reading 1 °C high at all temperatures.</li>
<li><strong>Parallax</strong>, if you always read the scale from the same wrong angle.</li>
<li>A <strong>flaw in the method</strong>, like ignoring heat lost to the surroundings, or measuring a pendulum length to the top of the bob instead of its centre.</li>
</ul>
<svg class="diagram" viewBox="0 0 520 150" role="img" aria-label="Four targets showing accurate and precise, precise not accurate, accurate not precise, neither">
<g transform="translate(65 70)"><circle r="48" class="ax"/><circle r="30" class="ax"/><circle r="12" class="ax"/><circle class="dotb" cx="2" cy="-3" r="4"/><circle class="dotb" cx="-4" cy="2" r="4"/><circle class="dotb" cx="4" cy="4" r="4"/><circle class="dotb" cx="-1" cy="-6" r="4"/></g>
<g transform="translate(195 70)"><circle r="48" class="ax"/><circle r="30" class="ax"/><circle r="12" class="ax"/><circle class="dotb" cx="24" cy="-22" r="4"/><circle class="dotb" cx="30" cy="-20" r="4"/><circle class="dotb" cx="26" cy="-28" r="4"/><circle class="dotb" cx="32" cy="-26" r="4"/></g>
<g transform="translate(325 70)"><circle r="48" class="ax"/><circle r="30" class="ax"/><circle r="12" class="ax"/><circle class="dotb" cx="-30" cy="10" r="4"/><circle class="dotb" cx="28" cy="18" r="4"/><circle class="dotb" cx="5" cy="-34" r="4"/><circle class="dotb" cx="-6" cy="30" r="4"/></g>
<g transform="translate(455 70)"><circle r="48" class="ax"/><circle r="30" class="ax"/><circle r="12" class="ax"/><circle class="dotb" cx="30" cy="-30" r="4"/><circle class="dotb" cx="10" cy="-12" r="4"/><circle class="dotb" cx="36" cy="5" r="4"/><circle class="dotb" cx="18" cy="-40" r="4"/></g>
<text x="65" y="138" text-anchor="middle" class="small">accurate + precise</text><text x="195" y="138" text-anchor="middle" class="small">precise, not accurate</text><text x="325" y="138" text-anchor="middle" class="small">accurate, not precise</text><text x="455" y="138" text-anchor="middle" class="small">neither</text>
</svg>
<p>The bull's-eye is the true value. Systematic error moves the whole cluster off centre; random error spreads the cluster out.</p>

<h2>Estimating the uncertainty in one measurement</h2>
<ul>
<li><strong>Single reading on an analogue scale</strong> (ruler, thermometer): usually ± the smallest division, or ± half a division if you can read it well. Measuring a length with a ruler involves reading <em>two</em> ends, so the uncertainty is often taken as ±1 mm overall.</li>
<li><strong>Digital instrument</strong>: ± 1 in the last digit shown (for example ±0.01 V on a meter reading 1.47 V).</li>
<li><strong>Repeated readings</strong>: uncertainty ≈ <strong>half the range</strong> = (largest − smallest) ÷ 2. This captures the random scatter.</li>
<li>Human timing: the real uncertainty is your reaction time (~0.1–0.2 s), not the stopwatch's 0.01 s resolution.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Five measurements of the period of a pendulum: 1.52, 1.49, 1.55, 1.50, 1.54 s.</p>
<p>Mean = 7.60 ÷ 5 = 1.52 s. Range = 1.55 − 1.49 = 0.06 s, so uncertainty = ±0.03 s.</p>
<p>Result: T = 1.52 ± 0.03 s. Percentage uncertainty = 0.03/1.52 × 100% = 2.0%.</p></div>
<p><strong>Absolute uncertainty</strong> has the same unit as the quantity (±0.03 s). <strong>Percentage uncertainty</strong> = (absolute uncertainty ÷ value) × 100% and has no unit. <strong>Fractional uncertainty</strong> is the same thing without the ×100.</p>
<p>To reduce percentage uncertainty: measure a bigger quantity (time 20 swings rather than 1; measure the thickness of 50 sheets of paper and divide), or use an instrument with a finer resolution.</p>

<h2>Combining uncertainties</h2>
<p>When you calculate a result from several measurements, their uncertainties carry through. The rules come from thinking about the worst case.</p>
<h3>Adding or subtracting: add the absolute uncertainties</h3>
<p>If <em>a</em> = 5.0 ± 0.1 and <em>b</em> = 3.0 ± 0.1, then <em>a</em> + <em>b</em> could be as large as 5.1 + 3.1 = 8.2 or as small as 7.8. So <em>a</em> + <em>b</em> = 8.0 ± 0.2. For <em>a</em> − <em>b</em>, the biggest value is 5.1 − 2.9 = 2.2 and the smallest 4.9 − 3.1 = 1.8, so <em>a</em> − <em>b</em> = 2.0 ± 0.2. The uncertainties still <strong>add</strong> when you subtract.</p>
<p>Notice the percentage uncertainty of the difference (10%) is much bigger than that of either measurement (2–3%). Taking the difference of two similar values is a common source of large uncertainty, for example finding an extension by subtracting two lengths.</p>
<h3>Multiplying or dividing: add the percentage uncertainties</h3>
<p>If a length is 2% too big and a width is 3% too big, the area is about 1.02 × 1.03 ≈ 1.05 times too big: 5%. So for <em>x</em> = <em>ab</em> or <em>x</em> = <em>a</em>/<em>b</em>, %<em>x</em> = %<em>a</em> + %<em>b</em>. (Dividing by a value that is too small also makes the answer too big, so the percentages still add.)</p>
<h3>Powers: multiply the percentage uncertainty by the power</h3>
<p><em>a</em>² = <em>a</em> × <em>a</em>, so %(<em>a</em>²) = %<em>a</em> + %<em>a</em> = 2 × %<em>a</em>. In general %(<em>a</em><sup>n</sup>) = n × %<em>a</em>. This also works for roots: %(√<em>a</em>) = ½ × %<em>a</em>.</p>
<p>Constants like π or ½ have no uncertainty, so ignore them.</p>
<div class="wex"><p><strong>Worked example: density of a cube.</strong> m = 52.0 ± 0.1 g, side l = 2.00 ± 0.02 cm.</p>
<p>%m = 0.1/52.0 × 100 = 0.19%. %l = 0.02/2.00 × 100 = 1.0%.</p>
<p>V = l³, so %V = 3 × 1.0 = 3.0%. ρ = m/V, so %ρ = 0.19 + 3.0 = 3.2%.</p>
<p>ρ = 52.0 ÷ 8.00 = 6.50 g cm<sup>−3</sup>. Absolute uncertainty = 3.2% of 6.50 = 0.21 g cm<sup>−3</sup>.</p>
<p>Answer: ρ = 6.5 ± 0.2 g cm<sup>−3</sup>. The side length is the biggest problem, so measure it with a micrometer or vernier.</p></div>
<div class="wex"><p><strong>Worked example: resistivity.</strong> ρ = RA/L with A = πd²/4. %R = 2%, %L = 0.5%, %d = 1.5%.</p>
<p>%A = 2 × 1.5 = 3%. %ρ = 2 + 3 + 0.5 = 5.5%. The diameter contributes most, because it is squared.</p></div>

<h2>Uncertainty from a graph</h2>
<p><strong>Error bars</strong> show the uncertainty of each plotted point: a line through the point, extending ± the absolute uncertainty. If the x-values have negligible uncertainty you only draw vertical bars.</p>
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
<ol>
<li>Draw the <strong>line of best fit</strong> through the points with roughly equal scatter either side.</li>
<li>Draw the <strong>worst acceptable line</strong>: the steepest (or the shallowest) straight line that still passes through <em>all</em> the error bars. Usually it runs from the bottom of the first bar to the top of the last, or the other way round.</li>
<li>Uncertainty in gradient = |gradient<sub>best</sub> − gradient<sub>worst</sub>|.</li>
<li>Percentage uncertainty in gradient = (uncertainty in gradient ÷ gradient<sub>best</sub>) × 100%.</li>
<li>Uncertainty in y-intercept = |intercept<sub>best</sub> − intercept<sub>worst</sub>|.</li>
</ol>
<p>If your answer is calculated from the gradient (for example g = 2 × gradient), it has the same percentage uncertainty as the gradient.</p>
<h3>What the graph tells you about errors</h3>
<ul>
<li>Points scattered widely about the line: large random errors.</li>
<li>A straight line that should go through the origin but has an intercept: a systematic error (zero error, or a length measured from the wrong point). A constant offset changes the intercept but <strong>not the gradient</strong>, which is one reason gradient methods are popular.</li>
<li>A point well off the line and outside the error bars: an anomaly. Ignore it when drawing the line, and say so.</li>
</ul>

<h2>Comparing with an accepted value</h2>
<p>Percentage difference = |experimental value − accepted value| ÷ accepted value × 100%. If it is smaller than your percentage uncertainty, the experiment agrees with the accepted value. If it is much larger, there is probably a systematic error you have not accounted for.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when asked which measurement contributes most to the uncertainty, compare <em>percentage</em> uncertainties (after multiplying by any powers), not absolute ones.</p></blockquote>
`;

N['2.3']=`
<h2>Scalars and vectors</h2>
<p>A <strong>scalar</strong> quantity has only a size (magnitude). A <strong>vector</strong> quantity has a size and a direction. Direction matters for vectors: walking 3 m east then 3 m west leaves you where you started, so your displacement is zero even though you walked 6 m.</p>
<div class="tbl"><table><tr><th>Scalars</th><th>Vectors</th></tr>
<tr><td>distance, speed, mass, time, energy, work, power, temperature, volume, density, charge, pressure, p.d., resistance</td><td>displacement, velocity, acceleration, force (including weight, tension, drag), momentum, impulse, electric field strength, gravitational field strength, magnetic flux density</td></tr></table></div>
<p>Distance and speed are scalar versions of displacement and velocity. Weight is a force, so it is a vector (it always points down); mass is a scalar.</p>
<p>A vector is drawn as an arrow: its length shows the magnitude (to scale) and it points in the vector's direction. In a calculation, you choose one direction as positive. A vector pointing the other way then gets a negative sign: a velocity of −4 m s<sup>−1</sup> means 4 m s<sup>−1</sup> in the negative direction.</p>

<h2>Adding vectors</h2>
<p>The <strong>resultant</strong> is the single vector that has the same effect as all the vectors acting together. Vectors along the same line just add with signs: 5 N right + 3 N left = 2 N right. For vectors at an angle, draw them <strong>tip to tail</strong>: start the second arrow where the first ends. The resultant runs from the tail of the first arrow to the tip of the last.</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Vector triangle: A then B tip to tail, resultant R from start to end">
<line class="c1 thick" x1="60" y1="180" x2="300" y2="180" marker-end="url(#ahb)"/>
<line class="c2 thick" x1="300" y1="180" x2="380" y2="50" marker-end="url(#aha)"/>
<line class="ax thick" x1="60" y1="180" x2="378" y2="53" marker-end="url(#ah)"/>
<text x="170" y="204" class="lbl1">A</text><text x="352" y="128" class="lbl2">B</text><text x="200" y="100">R = A + B</text>
<path class="ax" d="M100 180 A40 40 0 0 0 97 165"/><text x="106" y="172">θ</text>
</svg>
<p>The order does not matter: B then A gives the same resultant. There are three ways to find it.</p>
<h3>1. Perpendicular vectors: Pythagoras and trigonometry</h3>
<p>If A and B are at right angles, the triangle is right-angled: <strong>R = √(A² + B²)</strong> and the angle from A is θ = tan<sup>−1</sup>(B/A).</p>
<div class="wex"><p><strong>Worked example.</strong> A boat heads north at 4.0 m s<sup>−1</sup> across a river flowing east at 3.0 m s<sup>−1</sup>. Find its resultant velocity.</p>
<p>R = √(4.0² + 3.0²) = √25 = 5.0 m s<sup>−1</sup>. θ = tan<sup>−1</sup>(3.0/4.0) = 37° east of north.</p></div>
<h3>2. A scale drawing</h3>
<p>Choose a scale (say 1 cm = 1 N), draw the first vector at the right angle with a protractor, draw the second tip to tail, then measure the length and angle of the resultant. Use a large scale for accuracy. This works for any angle.</p>
<h3>3. Any angle: cosine and sine rules</h3>
<p>For a triangle with sides a, b, c opposite angles A, B, C:</p>
<div class="eqgrid"><div>a² = b² + c² − 2bc cos A</div><div>a / sin A = b / sin B</div></div>
<p>Careful: the angle you use in the triangle is the angle <em>inside the triangle</em>, between the two vectors drawn tip to tail. That is 180° minus the angle between them when they are drawn from the same point.</p>
<div class="wex"><p><strong>Worked example.</strong> Two forces of 6.0 N and 8.0 N act on a point with 60° between them. Find the resultant.</p>
<p>Drawn tip to tail, the angle inside the triangle is 180° − 60° = 120°.</p>
<p>R² = 6.0² + 8.0² − 2(6.0)(8.0) cos 120° = 36 + 64 + 48 = 148, so R = 12.2 N.</p>
<p>Check: it is bigger than either force but less than 14 N (the total if they were parallel). That makes sense.</p></div>
<h3>Subtracting vectors</h3>
<p>A − B = A + (−B): reverse the arrow B and add it. This matters for <strong>change in velocity</strong>, Δv = v − u. A ball hitting a wall at 5 m s<sup>−1</sup> and bouncing back at 4 m s<sup>−1</sup> has Δv = (−4) − (+5) = −9 m s<sup>−1</sup>, not 1 m s<sup>−1</sup>.</p>

<h2>Resolving a vector into components</h2>
<p>Resolving is the reverse of adding: you replace one vector by two perpendicular vectors that together have the same effect. It is the most useful vector skill at A level, because perpendicular components can be treated completely separately (see projectiles in 3.1 and forces in 3.2).</p>
<p>A vector F at angle θ to the horizontal makes a right-angled triangle with its components:</p>
<div class="eqgrid"><div>F<sub>x</sub> = F cos θ</div><div>F<sub>y</sub> = F sin θ</div></div>
<p>A quick way to remember: the component <strong>next to</strong> the angle uses cos; the component <strong>opposite</strong> the angle uses sin. Always check which angle you have been given.</p>
<p>To combine components back into one vector: magnitude = √(F<sub>x</sub>² + F<sub>y</sub>²), direction θ = tan<sup>−1</sup>(F<sub>y</sub>/F<sub>x</sub>).</p>
<div class="wex"><p><strong>Worked example.</strong> A sledge is pulled with a force of 50 N along a rope at 30° above the horizontal.</p>
<p>Horizontal component (pulls it forward): 50 cos 30° = 43 N. Vertical component (partly lifts it): 50 sin 30° = 25 N.</p></div>
<h3>Several vectors at once</h3>
<p>To add three or more vectors, resolve every one into horizontal and vertical components, add all the horizontal parts (with signs) and all the vertical parts, then combine the two totals with Pythagoras.</p>

<h2>Objects on a slope</h2>
<p>On a slope it is easier to resolve along and perpendicular to the slope, rather than horizontally and vertically. The weight mg points straight down. If the slope is at angle θ to the horizontal, the angle between the weight and the line perpendicular to the slope is also θ. So:</p>
<ul>
<li>component of weight <strong>down the slope = mg sin θ</strong> (this is what makes things slide);</li>
<li>component of weight <strong>into the slope = mg cos θ</strong> (balanced by the normal contact force).</li>
</ul>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Block on a slope with weight resolved">
<path class="fillsoft ax" d="M40 190 L460 190 L460 50 Z"/>
<g transform="rotate(-18.4 250 120)"><rect x="220" y="85" width="60" height="38" class="fill2 ax"/></g>
<line class="ax thick" x1="250" y1="118" x2="250" y2="200" marker-end="url(#ah)"/><text x="256" y="210">mg</text>
<line class="c1 thick" x1="250" y1="118" x2="226" y2="126" marker-end="url(#ahb)"/><text x="160" y="140" class="lbl1">mg sin θ</text>
<line class="c2 thick" x1="250" y1="118" x2="275" y2="194" marker-end="url(#aha)"/><text x="282" y="178" class="lbl2">mg cos θ</text>
<text x="70" y="182">θ</text></svg>
<p>Sanity check: when θ = 0 (flat ground) sin θ = 0, so nothing pulls it along, and cos θ = 1, so all the weight presses into the ground. When θ = 90° (a vertical drop) all the weight acts "down the slope". If your answer does not behave like this, you have swapped sin and cos.</p>
<div class="wex"><p><strong>Worked example.</strong> A 2.0 kg box rests on a ramp at 25°. Find the friction needed to stop it sliding, and the normal contact force.</p>
<p>Down the slope: mg sin θ = 2.0 × 9.81 × sin 25° = 8.3 N, so friction up the slope must be 8.3 N.</p>
<p>Perpendicular: N = mg cos θ = 2.0 × 9.81 × cos 25° = 17.8 N.</p></div>

<h2>Equilibrium and the closed triangle</h2>
<p>If an object is in <strong>equilibrium</strong> (at rest or moving at constant velocity) the resultant force is zero. Two ways to use this:</p>
<ul>
<li>Resolve in two perpendicular directions: the components in each direction must add to zero.</li>
<li>For three forces, drawing them tip to tail makes a <strong>closed triangle</strong>: the last arrow ends where the first began. You can then use trigonometry on that triangle. (Topic 3.2 has more.)</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> when resolving, draw a clear diagram and mark the angle. Most lost marks come from using sin where cos was needed, not from the physics.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
