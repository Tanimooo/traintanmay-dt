/* Full topic notes, Modules 1 and 2: Practical skills; Foundations in chemistry. Replace the short notes in m12.js (loaded after it). */
(function(){
const N={};

N['1.1']=`
<h2>Why practical skills matter in the written papers</h2>
<p>About 15% of the marks across H432 test practical skills, and they turn up in all three papers, not just Paper 3. You are expected to be able to <strong>plan</strong> an experiment, <strong>carry it out</strong> safely, <strong>analyse</strong> the results and <strong>evaluate</strong> them. The questions usually describe a practical you have done (a titration, an enthalpy experiment, a rates experiment) and ask you to work with the data.</p>

<h2>Planning</h2>
<h3>Variables</h3>
<ul>
<li><strong>Independent variable</strong>: the one you deliberately change (for example the concentration of acid).</li>
<li><strong>Dependent variable</strong>: the one you measure to see the effect (for example the time for a colour change).</li>
<li><strong>Control variables</strong>: everything else that could affect the result, which you keep the same (temperature, total volume, surface area of a solid, the same batch of a solution).</li>
</ul>
<p>When a question asks how to make a test fair, name the specific control variable and say how you would keep it constant ("use a water bath at 25 °C", not just "keep the temperature the same").</p>
<h3>Choosing apparatus</h3>
<p>Pick apparatus by the <strong>precision</strong> you need:</p>
<div class="tbl"><table><tr><th>Apparatus</th><th>Typical uncertainty</th><th>Use it for</th></tr>
<tr><td>25.0 cm³ volumetric pipette</td><td>±0.06 cm³</td><td>a fixed, accurate volume of solution (titrations)</td></tr>
<tr><td>50 cm³ burette</td><td>±0.05 cm³ per reading</td><td>a variable, accurately measured volume</td></tr>
<tr><td>250 cm³ volumetric flask</td><td>±0.2 cm³</td><td>making a standard solution</td></tr>
<tr><td>Measuring cylinder (25 cm³)</td><td>±0.5 cm³</td><td>approximate volumes, e.g. adding excess acid</td></tr>
<tr><td>2-decimal-place balance</td><td>±0.005 g per reading</td><td>masses of a few grams</td></tr>
<tr><td>Thermometer (1 °C divisions)</td><td>±0.5 °C</td><td>temperature changes</td></tr></table></div>
<p>Beakers and conical flasks have rough volume marks only: never use them to measure a volume.</p>
<h3>Risk assessment</h3>
<p>For each hazard, say what the hazard is, what could go wrong and how you reduce the risk. "Wear goggles" earns little on its own; "concentrated sulfuric acid is corrosive, so wear goggles and gloves and add it slowly" is what examiners want. Flammable organic liquids: no naked flames, heat with an electric heater or water bath. Toxic gases or volatile organics: use a fume cupboard.</p>

<h2>Implementing: recording results</h2>
<ul>
<li>Draw a results table <strong>before</strong> you start. Headings carry the quantity and unit (volume / cm³); the body of the table then holds numbers only.</li>
<li>Record every reading to the precision of the apparatus. A burette reads to the nearest 0.05 cm³, so 23.40 cm³ (not 23.4) and 0.00 cm³ (not 0).</li>
<li>Read a meniscus at eye level, from the bottom of the curve.</li>
<li>Record raw data (start and end readings), then the processed value (titre), so mistakes can be traced.</li>
</ul>

<h2>Analysis</h2>
<h3>Significant figures and decimal places</h3>
<p>Give a calculated answer to the same number of significant figures as the <strong>least precise</strong> piece of data you used. If masses are given to 3 s.f. and a volume to 4 s.f., give the answer to 3 s.f. Keep all the figures in your calculator during the working and only round at the end; rounding early is the most common way to lose an accuracy mark.</p>
<h3>Graphs</h3>
<ul>
<li>Independent variable on the x-axis, dependent on the y-axis; label both with quantity and unit.</li>
<li>Choose scales so the points cover <strong>more than half</strong> of the grid in each direction, using sensible steps (1, 2, 5, 10, not 3 or 7).</li>
<li>Plot points as small crosses, to within half a small square.</li>
<li>Draw a single thin line of best fit (straight or a smooth curve) with points evenly scattered either side. Don't join the dots.</li>
<li>Gradient: use a triangle that covers at least half the line, and read its corners carefully. Give the units (y-unit ÷ x-unit).</li>
<li>For a curve, the gradient at a point is the gradient of the <strong>tangent</strong> drawn at that point. This is how you find a rate from a concentration–time graph.</li>
</ul>

<h2>Evaluation</h2>
<h3>Accuracy, precision and errors</h3>
<ul>
<li><strong>Accurate</strong>: close to the true value.</li>
<li><strong>Precise</strong>: repeat readings close together. Results can be precise but inaccurate if there is a systematic error.</li>
<li><strong>Random errors</strong> scatter results either side of the true value (judging a colour change, reading a meniscus). Reduce their effect by repeating and averaging.</li>
<li><strong>Systematic errors</strong> push every result the same way (heat lost to the surroundings in calorimetry, a balance that reads 0.02 g high). Repeating does <em>not</em> help; you have to change the method or the apparatus.</li>
</ul>
<h3>Uncertainty</h3>
<p>The uncertainty of a single reading is usually ± half the smallest division. If a value comes from <strong>two readings</strong> (a burette titre = final − initial; a mass by difference; a temperature change), the two uncertainties add:</p>
<div class="eqgrid"><div>$$\\text{titre uncertainty}=2\\times 0.05=\\pm 0.10\\ \\text{cm}^3$$</div><div>$$\\%\\ \\text{uncertainty}=\\dfrac{\\text{uncertainty}}{\\text{value}}\\times 100$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> A titre is 22.50 cm³ from a burette read to ±0.05 cm³. Find the percentage uncertainty.</p>
<p>Two readings, so the uncertainty is ±0.10 cm³.</p>$$\\%\\ \\text{uncertainty}=\\dfrac{0.10}{22.50}\\times 100=\\mathbf{0.44\\,\\%}$$
<p>To make it smaller, use a larger titre, for example by using a more dilute titrant or a larger pipette volume.</p></div>
<p>When several measured quantities combine in a calculation (multiplied or divided), add their <strong>percentage</strong> uncertainties to get the uncertainty of the final answer.</p>
<h3>Comparing with a true value</h3>
$$\\%\\ \\text{error}=\\dfrac{|\\text{experimental}-\\text{accepted}|}{\\text{accepted}}\\times 100$$<p>If the percentage error is <em>bigger</em> than the total percentage uncertainty, the measurement uncertainty can't explain the difference, so there must be a systematic error (or a mistake). Name it, and suggest a specific improvement.</p>
<h3>Anomalies</h3>
<p>An anomalous result is one that doesn't fit the pattern. Leave it out of averages and lines of best fit, but say that you have. In titrations, only <strong>concordant</strong> titres (within 0.10 cm³ of each other) are averaged; the rough titre is never included.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> "Suggest an improvement" questions want something specific and practical: "use a burette instead of a measuring cylinder", "insulate the cup and add a lid", "use a data-logger with a gas syringe". "Repeat the experiment" or "be more careful" score nothing.</p></blockquote>
`;

N['1.2']=`
<h2>The Practical Endorsement</h2>
<p>Alongside your A level grade you get a separate result for practical work: <strong>Pass</strong> or <strong>Not classified</strong>. It doesn't change your grade, but many science courses at university ask for a Pass. Your teacher assesses it during the course; there's no practical exam.</p>
<h3>PAGs: Practical Activity Groups</h3>
<p>OCR groups the required practical work into 12 PAGs. You must complete at least one activity from each, and keep a record (lab book or folder) of what you did.</p>
<div class="tbl"><table><tr><th>PAG</th><th>Title</th><th>Typical activity</th><th>Topic</th></tr>
<tr><td>1</td><td>Moles determination</td><td>A<sub>r</sub> of Mg from the volume of H₂ made</td><td>2.1.3</td></tr>
<tr><td>2</td><td>Acid–base titration</td><td>making a standard solution and titrating</td><td>2.1.4</td></tr>
<tr><td>3</td><td>Enthalpy determination</td><td>enthalpy of neutralisation or combustion</td><td>3.2.1</td></tr>
<tr><td>4</td><td>Qualitative analysis of ions</td><td>tests for anions and cations</td><td>3.1.4, 5.3.2</td></tr>
<tr><td>5</td><td>Synthesis of an organic liquid</td><td>cyclohexene from cyclohexanol</td><td>4.2.3</td></tr>
<tr><td>6</td><td>Synthesis of an organic solid</td><td>aspirin, recrystallisation, melting point</td><td>6.2.5</td></tr>
<tr><td>7</td><td>Qualitative analysis of organic functional groups</td><td>test-tube tests</td><td>6.3.1</td></tr>
<tr><td>8</td><td>Electrochemical cells</td><td>measuring cell potentials</td><td>5.2.3</td></tr>
<tr><td>9</td><td>Rates: continuous monitoring</td><td>gas volume against time</td><td>5.1.1</td></tr>
<tr><td>10</td><td>Rates: initial rates</td><td>iodine clock</td><td>5.1.1</td></tr>
<tr><td>11</td><td>pH measurement</td><td>pH titration curve, buffers</td><td>5.1.3</td></tr>
<tr><td>12</td><td>Research skills</td><td>researching and referencing a technique</td><td>any</td></tr></table></div>
<h3>CPAC: what your teacher is checking</h3>
<p>The Common Practical Assessment Criteria are the same for every board. Over the two years you must show that you can:</p>
<ol>
<li>Follow written procedures.</li>
<li>Apply investigative approaches and methods when using instruments and equipment (choosing apparatus, identifying variables, repeating).</li>
<li>Use a range of practical equipment and materials safely (risk assessment).</li>
<li>Make and record observations (precise readings, tables, units).</li>
<li>Research, reference and report (citing sources properly).</li>
</ol>
<p>Every PAG has its own page in <a href="#pags">Practicals</a> with apparatus, method, safety, sources of error and improvements. The written papers ask about these practicals, so learn the methods as well as doing them.</p>
<h3>Core techniques you must be able to describe</h3>
<ul>
<li><strong>Making a standard solution</strong>: weigh by difference, dissolve in a beaker, transfer with rinsings to a volumetric flask, make up to the mark, invert to mix.</li>
<li><strong>Titration</strong>: rinse the pipette and burette with the solutions they will hold; add indicator; titrate dropwise near the end point while swirling; repeat to concordant titres.</li>
<li><strong>Heating under reflux</strong>: heat a reaction mixture with a vertical condenser so volatile liquids condense and drip back (4.2.3).</li>
<li><strong>Distillation</strong> and <strong>redistillation</strong>: separate a liquid by its boiling point.</li>
<li><strong>Using a separating funnel</strong>: separate two immiscible liquids; the denser layer is at the bottom.</li>
<li><strong>Drying</strong> an organic liquid with an anhydrous salt (MgSO₄, CaCl₂).</li>
<li><strong>Filtration under reduced pressure</strong> (Büchner funnel) and <strong>recrystallisation</strong>.</li>
<li><strong>Melting point</strong> determination to check purity.</li>
<li><strong>Thin-layer chromatography</strong>.</li>
<li>Using a <strong>pH meter</strong>, a <strong>gas syringe</strong> and a <strong>colorimeter</strong> or data-logger.</li>
</ul>
`;

N['2.1.1']=`
<h2>Inside the atom</h2>
<p>An atom has a tiny, dense <strong>nucleus</strong> containing protons and neutrons, surrounded by electrons. Almost all the mass is in the nucleus; almost all the volume is empty space around it.</p>
<div class="tbl"><table><tr><th>Particle</th><th>Relative mass</th><th>Relative charge</th><th>Where</th></tr>
<tr><td>Proton</td><td>1</td><td>+1</td><td>nucleus</td></tr>
<tr><td>Neutron</td><td>1</td><td>0</td><td>nucleus</td></tr>
<tr><td>Electron</td><td>1/1836 (negligible)</td><td>−1</td><td>shells around the nucleus</td></tr></table></div>
<ul>
<li><strong>Atomic number Z</strong> = number of protons. It defines the element: every carbon atom has 6 protons.</li>
<li><strong>Mass number A</strong> = protons + neutrons. Neutrons = A − Z.</li>
<li>A neutral atom has the same number of electrons as protons. Written as <sup>A</sup><sub>Z</sub>X, e.g. <sup>23</sup><sub>11</sub>Na has 11 protons, 12 neutrons and 11 electrons.</li>
</ul>
<h3>Ions</h3>
<p>An ion has gained or lost electrons; the number of protons never changes in a chemical reaction. A positive ion (cation) has <em>lost</em> electrons; a negative ion (anion) has <em>gained</em> them.</p>
<div class="wex"><p><strong>Worked example.</strong> How many protons, neutrons and electrons are in <sup>32</sup><sub>16</sub>S<sup>2−</sup>?</p>
<p>Protons = 16. Neutrons = 32 − 16 = 16. The 2− charge means 2 extra electrons: electrons = 16 + 2 = <strong>18</strong>.</p></div>

<h2>Isotopes</h2>
<p><strong>Isotopes</strong> are atoms of the same element with different numbers of neutrons, so different masses. Chlorine exists as <sup>35</sup>Cl and <sup>37</sup>Cl; both have 17 protons, but 18 and 20 neutrons.</p>
<ul>
<li>Isotopes have the <strong>same chemical properties</strong>, because chemistry depends on electrons and they have the same electron configuration.</li>
<li>They have slightly <strong>different physical properties</strong> that depend on mass, such as density and rate of diffusion.</li>
</ul>

<h2>Relative masses</h2>
<p>Atoms are far too light to weigh in grams usefully, so masses are compared with a standard: <strong>one-twelfth of the mass of a carbon-12 atom</strong>. On this scale a carbon-12 atom is exactly 12.</p>
<ul>
<li><strong>Relative isotopic mass</strong>: the mass of an atom of an isotope compared with 1/12 of the mass of an atom of carbon-12. (Very close to the mass number.)</li>
<li><strong>Relative atomic mass, A<sub>r</sub></strong>: the <em>weighted mean</em> mass of an atom of an element compared with 1/12 of the mass of an atom of carbon-12. "Weighted" means it takes account of how abundant each isotope is. This is the value on the periodic table.</li>
<li><strong>Relative molecular mass, M<sub>r</sub></strong>: for simple molecules, the sum of the A<sub>r</sub> values of all the atoms, e.g. M<sub>r</sub>(H₂O) = 2(1.0) + 16.0 = 18.0.</li>
<li><strong>Relative formula mass</strong>: the same idea for giant ionic compounds, which don't contain molecules, e.g. NaCl = 23.0 + 35.5 = 58.5.</li>
</ul>
<p>None of these have units: they are ratios.</p>

<h2>Mass spectrometry</h2>
<p>A mass spectrometer measures the masses and abundances of the isotopes in a sample. You don't need to know how it works inside, only how to read the output. Atoms are turned into positive ions, separated by their <strong>mass-to-charge ratio (m/z)</strong>, and detected. For ions with a 1+ charge, m/z is just the mass.</p>
<svg class="diagram" viewBox="0 0 420 200" role="img" aria-label="Mass spectrum of chlorine showing a tall peak at m/z 35 and a peak one third the height at 37">
<line class="ax" x1="40" y1="170" x2="400" y2="170" marker-end="url(#ah)"/><line class="ax" x1="40" y1="170" x2="40" y2="20" marker-end="url(#ah)"/>
<line class="c1 thick" x1="170" y1="170" x2="170" y2="50"/><line class="c1 thick" x1="270" y1="170" x2="270" y2="130"/>
<text x="160" y="188">35</text><text x="260" y="188">37</text><text x="330" y="195" class="small">m/z</text>
<text x="48" y="30" class="small">abundance / %</text><text x="178" y="56" class="small">75%</text><text x="278" y="128" class="small">25%</text>
</svg>
<ul>
<li>Each <strong>peak</strong> is one isotope. Its m/z gives the relative isotopic mass.</li>
<li>The <strong>height</strong> of the peak gives the relative abundance (as a percentage, or relative to the tallest peak).</li>
</ul>
<div class="eqgrid"><div>$$A_r=\\dfrac{\\bigsum(\\text{isotopic mass}\\times\\text{abundance})}{\\bigsum\\text{abundance}}$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> A sample of rubidium is 72.2% <sup>85</sup>Rb and 27.8% <sup>87</sup>Rb. Calculate A<sub>r</sub>.</p>
$$A_r=\\dfrac{(85\\times 72.2)+(87\\times 27.8)}{100}=\\dfrac{6137+2418.6}{100}=\\mathbf{85.6}$$</div>
<div class="wex"><p><strong>Worked example (reverse).</strong> Boron has A<sub>r</sub> = 10.8 and two isotopes, <sup>10</sup>B and <sup>11</sup>B. Find the percentage of each.</p>
<p>Let x% be <sup>10</sup>B, so (100 − x)% is <sup>11</sup>B. Then:</p>$$\\dfrac{10x+11(100-x)}{100}=10.8\\ \\Rightarrow\\ 1100-x=1080\\ \\Rightarrow\\ x=20$$
<p><strong>20% <sup>10</sup>B and 80% <sup>11</sup>B.</strong></p></div>
<p>Mass spectrometry of <em>molecules</em> (to find M<sub>r</sub> of an organic compound from the molecular ion peak) comes in topic 4.2.4.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> definitions of relative isotopic mass and relative atomic mass are regularly asked word for word. The phrases that earn the marks are "weighted mean mass" (for A<sub>r</sub>) and "compared with 1/12 of the mass of an atom of carbon-12".</p></blockquote>
`;

N['2.1.2']=`
<h2>Ions and ionic formulae</h2>
<p>Many elements form ions with a predictable charge from their group in the periodic table:</p>
<div class="tbl"><table><tr><th>Group</th><th>1</th><th>2</th><th>13</th><th>15</th><th>16</th><th>17</th></tr>
<tr><td>Ion charge</td><td>+1 (Na⁺)</td><td>+2 (Mg²⁺)</td><td>+3 (Al³⁺)</td><td>−3 (N³⁻)</td><td>−2 (O²⁻)</td><td>−1 (Cl⁻)</td></tr></table></div>
<p>Metals lose electrons to form positive ions; non-metals gain electrons to form negative ions. Transition metals can form ions with different charges, shown by a Roman numeral: iron(II) is Fe²⁺, iron(III) is Fe³⁺.</p>
<h3>Ions to learn</h3>
<div class="tbl"><table><tr><th>Positive ions</th><th>Negative ions</th></tr>
<tr><td>ammonium NH₄⁺<br>silver Ag⁺<br>zinc Zn²⁺<br>hydrogen H⁺</td><td>hydroxide OH⁻<br>nitrate NO₃⁻<br>carbonate CO₃²⁻<br>sulfate SO₄²⁻<br>hydrogencarbonate HCO₃⁻<br>phosphate PO₄³⁻</td></tr></table></div>
<h3>Writing a formula</h3>
<p>An ionic compound has no overall charge, so the charges must cancel. Find the lowest whole numbers of each ion that balance the charges. Use brackets when you need more than one of a polyatomic ion.</p>
<div class="wex"><p><strong>Worked examples.</strong></p>
<p>Calcium nitrate: Ca²⁺ and NO₃⁻. Two nitrates balance one calcium: <strong>Ca(NO₃)₂</strong>.</p>
<p>Aluminium sulfate: Al³⁺ and SO₄²⁻. Lowest common multiple of 3 and 2 is 6: two Al³⁺ (+6) and three SO₄²⁻ (−6): <strong>Al₂(SO₄)₃</strong>.</p>
<p>Ammonium carbonate: NH₄⁺ and CO₃²⁻: <strong>(NH₄)₂CO₃</strong>.</p></div>
<h3>Formulae of common acids and other compounds</h3>
<p>Learn: hydrochloric acid HCl, sulfuric acid H₂SO₄, nitric acid HNO₃, ethanoic acid CH₃COOH, ammonia NH₃, water H₂O, carbon dioxide CO₂. The elements that exist as diatomic molecules are H₂, N₂, O₂, F₂, Cl₂, Br₂ and I₂.</p>

<h2>Balanced equations</h2>
<p>Atoms are not created or destroyed in a reaction, so an equation must have the same number of each type of atom on both sides. Balance by putting numbers <em>in front</em> of formulae; never change the formulae themselves.</p>
<div class="wex"><p><strong>Worked example.</strong> Balance the combustion of propane: C₃H₈ + O₂ → CO₂ + H₂O.</p>
<p>Carbon: 3 on the left, so 3CO₂. Hydrogen: 8 on the left, so 4H₂O. Oxygen on the right: (3 × 2) + (4 × 1) = 10 atoms, so 5O₂.</p>
<p><strong>C₃H₈ + 5O₂ → 3CO₂ + 4H₂O</strong>. Balance O last, because it appears in more than one product.</p></div>
<h3>State symbols</h3>
<p>(s) solid, (l) liquid, (g) gas, (aq) dissolved in water. Use them whenever an equation describes a real reaction; they are often required for marks in enthalpy and ionic equations.</p>

<h2>Ionic equations</h2>
<p>In aqueous reactions, some ions take no part: they are <strong>spectator ions</strong>. An ionic equation shows only the species that change.</p>
<ol>
<li>Write the full balanced equation with state symbols.</li>
<li>Split every <em>aqueous ionic</em> compound into its ions (solids, liquids, gases and covalent molecules stay together).</li>
<li>Cross out ions that appear unchanged on both sides.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> Silver nitrate solution reacts with sodium chloride solution.</p>
<p>Full: AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq).</p>
<p>Ions: Ag⁺ + NO₃⁻ + Na⁺ + Cl⁻ → AgCl(s) + Na⁺ + NO₃⁻.</p>
<p>Cancel Na⁺ and NO₃⁻: <strong>Ag⁺(aq) + Cl⁻(aq) → AgCl(s)</strong>.</p></div>
<p>The same ionic equation describes any soluble chloride with any soluble silver salt, which is why the silver nitrate test works for every chloride. Other key ionic equations: H⁺(aq) + OH⁻(aq) → H₂O(l) for every acid–alkali neutralisation, and Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s) for the sulfate test.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> an ionic equation must balance for charge as well as atoms. Add up the charges on each side as a final check.</p></blockquote>
`;

N['2.1.3']=`
<h2>The mole</h2>
<p>Chemists count particles in <strong>moles</strong>. One mole is the amount of substance containing <strong>6.02 × 10²³</strong> particles: the <strong>Avogadro constant, N<sub>A</sub></strong>. The number is chosen so that one mole of a substance has a mass in grams equal to its relative mass: 1 mol of carbon-12 atoms has a mass of exactly 12 g.</p>
<ul>
<li><strong>Molar mass, M</strong>: the mass per mole of a substance, in g mol⁻¹. Numerically equal to A<sub>r</sub> or M<sub>r</sub>. M(H₂O) = 18.0 g mol⁻¹.</li>
<li>Number of particles = amount (mol) × N<sub>A</sub>.</li>
</ul>
<div class="eqgrid"><div>$$n=\\dfrac{m}{M}$$</div><div>$$\\text{particles}=n\\times N_A$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> How many molecules are in 9.00 g of water?</p>
$$n=\\dfrac{m}{M}=\\dfrac{9.00}{18.0}=0.500\\ \\text{mol}$$$$\\text{molecules}=n\\times N_A=0.500\\times 6.02\\times 10^{23}=\\mathbf{3.01\\times 10^{23}}$$
<p>How many <em>atoms</em>? Each H₂O has 3 atoms, so:</p>$$3\\times 3.01\\times 10^{23}=9.03\\times 10^{23}\\ \\text{atoms}$$</div>

<h2>Empirical and molecular formulae</h2>
<ul>
<li><strong>Empirical formula</strong>: the simplest whole-number ratio of atoms of each element in a compound.</li>
<li><strong>Molecular formula</strong>: the actual number of atoms of each element in a molecule. It is a whole-number multiple of the empirical formula.</li>
</ul>
<p>Ethane has molecular formula C₂H₆ and empirical formula CH₃. Glucose is C₆H₁₂O₆, empirical formula CH₂O.</p>
<h3>Finding an empirical formula</h3>
<ol>
<li>Write the mass (or percentage) of each element.</li>
<li>Divide each by its A<sub>r</sub> to get moles.</li>
<li>Divide by the smallest number of moles.</li>
<li>If you get a value like 1.5 or 1.33, multiply all values to get whole numbers (× 2 or × 3).</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> A compound contains 40.0% C, 6.7% H and 53.3% O by mass. Its M<sub>r</sub> is 180. Find its molecular formula.</p>
$$\\mathrm{C}:\\ \\dfrac{40.0}{12.0}=3.33$$$$\\mathrm{H}:\\ \\dfrac{6.7}{1.0}=6.7$$$$\\mathrm{O}:\\ \\dfrac{53.3}{16.0}=3.33$$
<p>Divide by 3.33: C 1, H 2.0, O 1. Empirical formula CH₂O, empirical formula mass = 30.</p>
$$\\dfrac{M_r}{\\text{empirical formula mass}}=\\dfrac{180}{30}=6\\ \\Rightarrow\\ (\\mathrm{CH_2O})_6=\\mathbf{C_6H_{12}O_6}$$</div>
<h3>Water of crystallisation</h3>
<p>Some salts form crystals containing water molecules in a fixed ratio: hydrated copper(II) sulfate is CuSO₄·5H₂O. Heating drives the water off, leaving the <strong>anhydrous</strong> salt. To find the number of water molecules x in a formula such as MgSO₄·xH₂O, heat a weighed sample <strong>to constant mass</strong> (heat, cool, weigh, repeat until two masses agree) so all the water has gone.</p>
<div class="wex"><p><strong>Worked example.</strong> 2.46 g of MgSO₄·xH₂O is heated to constant mass, leaving 1.20 g of anhydrous MgSO₄. Find x.</p>
<p>Mass of water lost = 2.46 − 1.20 = 1.26 g.</p>$$n(\\mathrm{MgSO_4})=\\dfrac{1.20}{120.4}=0.00997\\ \\text{mol}$$$$ n(\\mathrm{H_2O})=\\dfrac{1.26}{18.0}=0.0700\\ \\text{mol}$$
$$x=\\dfrac{n(\\mathrm{H_2O})}{n(\\mathrm{MgSO_4})}=\\dfrac{0.0700}{0.00997}=7.0\\ \\Rightarrow\\ \\mathbf{x=7}$$</div>
<p>If the solid isn't heated to constant mass, some water remains and x comes out too small. If it is overheated, the salt may decompose further and x comes out too large.</p>

<h2>Moles in solution</h2>
<p>Concentration is the amount of solute per unit volume of solution, in mol dm⁻³ (1 dm³ = 1000 cm³ = 1 litre).</p>
<div class="eqgrid"><div>$$n=c\\times V\\quad(V\\text{ in dm}^3)$$</div><div>$$n=\\dfrac{c\\times V(\\text{cm}^3)}{1000}$$</div><div>$$\\text{mass conc.}=c\\times M$$</div></div>
<p>A <strong>standard solution</strong> has a known, accurate concentration (see PAG 2). "Concentrated" and "dilute" describe how much solute there is; "strong" and "weak" mean something different for acids (topic 2.1.4).</p>

<h2>Moles of gas</h2>
<p>At the same temperature and pressure, equal volumes of all gases contain the same number of molecules. At room temperature and pressure (RTP: about 293 K and 101 kPa), one mole of any gas occupies <strong>24.0 dm³</strong> (24 000 cm³).</p>
<div class="eqgrid"><div>$$n=\\dfrac{V(\\text{dm}^3)}{24.0}$$</div><div>$$n=\\dfrac{V(\\text{cm}^3)}{24\\,000}$$</div></div>
<h3>The ideal gas equation</h3>
<p>For other conditions use <strong>pV = nRT</strong>, where R = 8.314 J mol⁻¹ K⁻¹. Every quantity must be in SI units:</p>
<ul>
<li>p in <strong>Pa</strong> (kPa × 10³)</li>
<li>V in <strong>m³</strong> (cm³ × 10⁻⁶, dm³ × 10⁻³)</li>
<li>T in <strong>K</strong> (°C + 273)</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A 0.140 g sample of a volatile liquid vaporises to give 50.0 cm³ of gas at 100 °C and 101 kPa. Find its M<sub>r</sub>.</p>
$$n=\\dfrac{pV}{RT}=\\dfrac{101\\times 10^{3}\\times 50.0\\times 10^{-6}}{8.314\\times 373}=\\dfrac{5.05}{3101}=1.63\\times 10^{-3}\\ \\text{mol}$$
$$M=\\dfrac{m}{n}=\\dfrac{0.140}{1.63\\times 10^{-3}}=\\mathbf{86.0}\\ \\text{g mol}^{-1}$$</div>

<h2>Reacting quantities</h2>
<p>The balanced equation gives the <strong>mole ratio</strong> in which substances react. Every reacting-mass question follows the same three steps:</p>
<ol>
<li>Find moles of the substance you know about (from mass, solution or gas).</li>
<li>Use the equation's ratio to find moles of the substance you want.</li>
<li>Convert those moles to whatever the question asks (mass, volume, concentration).</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> What volume of CO₂ at RTP is produced when 5.00 g of CaCO₃ reacts with excess hydrochloric acid?</p>
<p>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</p>
$$n(\\mathrm{CaCO_3})=\\dfrac{5.00}{100.1}=0.0500\\ \\text{mol}$$<p>The ratio is 1 : 1, so n(CO₂) = 0.0500 mol.</p>$$V=n\\times 24.0=0.0500\\times 24.0=\\mathbf{1.20}\\ \\text{dm}^3$$</div>
<h3>Limiting reagent</h3>
<p>If you're given amounts of two reactants, work out which runs out first: divide the moles of each by its coefficient in the equation; the smaller value is the <strong>limiting reagent</strong>, and it decides how much product forms. The other is in excess.</p>

<h2>Percentage yield and atom economy</h2>
<div class="eqgrid"><div>$$\\%\\ \\text{yield}=\\dfrac{\\text{actual amount}}{\\text{theoretical amount}}\\times 100$$</div><div>$$\\text{atom economy}=\\dfrac{M(\\text{desired product})}{\\bigsum M(\\text{all products})}\\times 100$$</div></div>
<p><strong>Percentage yield</strong> is below 100% in practice because the reaction may be reversible and not go to completion, side reactions make other products, and product is lost when it is separated and purified.</p>
<p><strong>Atom economy</strong> measures how much of the reactants' mass ends up in the product you want, assuming 100% yield. It is calculated from the balanced equation, using the coefficients. Addition reactions (one product) have 100% atom economy; substitution and elimination reactions always produce a by-product and have lower atom economy.</p>
<div class="wex"><p><strong>Worked example.</strong> Ethanol can be made by fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Find the atom economy.</p>
<p>Mass of desired product = 2 × 46.0 = 92.0; total mass of products = 92.0 + (2 × 44.0) = 180.0.</p>
$$\\text{atom economy}=\\dfrac{92.0}{180.0}\\times 100=\\mathbf{51.1\\,\\%}$$<p>Hydrating ethene (C₂H₄ + H₂O → C₂H₅OH) has 100% atom economy.</p></div>
<p>A high atom economy means less waste, fewer raw materials and lower costs: it makes a process more <strong>sustainable</strong>. A process can have high yield but low atom economy, or the reverse, so both matter. Finding a use for a by-product effectively raises the atom economy.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> write the unit conversion step out every time (cm³ ÷ 1000 → dm³). The single most common mistake in mole calculations is using a volume in cm³ in n = cV.</p></blockquote>
`;

N['2.1.4']=`
<h2>What makes an acid</h2>
<p>An <strong>acid</strong> releases H⁺ ions when it dissolves in water (a fuller definition, proton donor, comes in 5.1.3). A <strong>base</strong> neutralises an acid; an <strong>alkali</strong> is a base that dissolves in water, releasing OH⁻ ions.</p>
<div class="tbl"><table><tr><th>Acids</th><th>Bases and alkalis</th></tr>
<tr><td>hydrochloric acid HCl<br>sulfuric acid H₂SO₄<br>nitric acid HNO₃<br>ethanoic acid CH₃COOH</td><td>sodium hydroxide NaOH (alkali)<br>potassium hydroxide KOH (alkali)<br>aqueous ammonia NH₃ (alkali)<br>metal oxides and carbonates (bases)</td></tr></table></div>
<p>HCl(aq) → H⁺(aq) + Cl⁻(aq); NaOH(aq) → Na⁺(aq) + OH⁻(aq). Ammonia is an alkali because it reacts with water: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻.</p>
<h3>Strong and weak acids</h3>
<ul>
<li>A <strong>strong acid</strong> completely dissociates (splits into ions) in water: HCl → H⁺ + Cl⁻.</li>
<li>A <strong>weak acid</strong> only partially dissociates; most molecules stay intact: CH₃COOH ⇌ H⁺ + CH₃COO⁻. Carboxylic acids are weak acids.</li>
</ul>
<p>"Strong" is about the <em>extent of dissociation</em>, not concentration. A dilute solution of a strong acid can have the same pH as a concentrated solution of a weak one.</p>

<h2>Neutralisation</h2>
<p>In every neutralisation, H⁺ ions from the acid are removed. The products depend on the base:</p>
<div class="tbl"><table><tr><th>Acid +</th><th>Products</th><th>Example</th></tr>
<tr><td>alkali</td><td>salt + water</td><td>HCl + NaOH → NaCl + H₂O</td></tr>
<tr><td>metal oxide (base)</td><td>salt + water</td><td>H₂SO₄ + CuO → CuSO₄ + H₂O</td></tr>
<tr><td>carbonate</td><td>salt + water + carbon dioxide</td><td>2HNO₃ + CaCO₃ → Ca(NO₃)₂ + H₂O + CO₂</td></tr>
<tr><td>ammonia</td><td>ammonium salt</td><td>NH₃ + HCl → NH₄Cl</td></tr></table></div>
<p>A <strong>salt</strong> is formed when the H⁺ of an acid is replaced by a metal ion or an ammonium ion. Hydrochloric acid makes chlorides, sulfuric acid makes sulfates, nitric acid makes nitrates. The ionic equation for acid + alkali is always H⁺(aq) + OH⁻(aq) → H₂O(l); for a carbonate it is 2H⁺(aq) + CO₃²⁻(aq) → H₂O(l) + CO₂(g) (with a solid carbonate, the whole formula stays together).</p>
<p>The reaction of an acid with a metal (e.g. Mg + 2HCl → MgCl₂ + H₂) is a <strong>redox</strong> reaction, not a neutralisation: see 2.1.5.</p>

<h2>Acid–base titrations</h2>
<p>A titration finds the exact volume of one solution that reacts with a known volume of another. If one concentration is known, the other can be calculated.</p>
<h3>Making a standard solution</h3>
<ol>
<li>Weigh the solid accurately in a weighing bottle; tip it into a beaker and reweigh the bottle, so the mass used is the difference.</li>
<li>Dissolve in a small volume of distilled water, stirring.</li>
<li>Transfer to a volumetric flask through a funnel, rinsing the beaker, rod and funnel into the flask so no solid is lost.</li>
<li>Add water until the bottom of the meniscus sits on the line (use a dropping pipette near the end).</li>
<li>Stopper and invert several times to mix.</li>
</ol>
<h3>Carrying out a titration</h3>
<ol>
<li>Rinse the pipette with the solution it will measure, then pipette 25.0 cm³ into a conical flask.</li>
<li>Add 2–3 drops of indicator.</li>
<li>Rinse the burette with the titrant, fill it (with the tap filled too, no air bubble) and read it.</li>
<li>Run in the titrant while swirling: a rough titre first, then accurate titres adding dropwise near the end point.</li>
<li>Repeat until you have <strong>concordant titres</strong> (within 0.10 cm³) and average them.</li>
</ol>
<p>Indicators: <strong>methyl orange</strong> (red in acid, yellow in alkali, orange at the end point) and <strong>phenolphthalein</strong> (colourless in acid, pink in alkali). Choosing the right indicator for weak acids or bases is covered in 5.1.3.</p>
<h3>Titration calculations</h3>
<div class="wex"><p><strong>Worked example.</strong> 25.0 cm³ of sodium hydroxide is neutralised by 21.30 cm³ of 0.100 mol dm⁻³ sulfuric acid. Find the concentration of the NaOH.</p>
<p>2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O</p>
$$n(\\mathrm{H_2SO_4})=c\\times V=0.100\\times\\dfrac{21.30}{1000}=2.130\\times 10^{-3}\\ \\text{mol}$$
<p>The ratio NaOH : H₂SO₄ is 2 : 1, so:</p>$$n(\\mathrm{NaOH})=2\\times 2.130\\times 10^{-3}=4.260\\times 10^{-3}\\ \\text{mol}$$
$$c(\\mathrm{NaOH})=\\dfrac{n}{V}=\\dfrac{4.260\\times 10^{-3}}{0.0250}=\\mathbf{0.170}\\ \\text{mol dm}^{-3}$$</div>
<div class="wex"><p><strong>Worked example (back to a solid).</strong> 1.325 g of an impure sample of sodium carbonate was dissolved and made up to 250.0 cm³. 25.0 cm³ portions needed 23.60 cm³ of 0.100 mol dm⁻³ HCl. Find the percentage purity.</p>
$$\\mathrm{Na_2CO_3}+2\\,\\mathrm{HCl}\\longrightarrow 2\\,\\mathrm{NaCl}+\\mathrm{H_2O}+\\mathrm{CO_2}$$$$n(\\mathrm{HCl})=0.100\\times\\dfrac{23.60}{1000}=2.360\\times 10^{-3}\\ \\text{mol}$$$$ n(\\mathrm{Na_2CO_3})=\\dfrac{2.360\\times 10^{-3}}{2}=1.180\\times 10^{-3}\\ \\text{mol}$$
<p>In the whole 250.0 cm³ there is 10 times as much: 1.180 × 10⁻² mol.</p>$$m=n\\times M=1.180\\times 10^{-2}\\times 106.0=1.251\\ \\text{g}$$
$$\\text{purity}=\\dfrac{1.251}{1.325}\\times 100=\\mathbf{94.4\\,\\%}$$</div>
<blockquote class="tip"><p><strong>Exam tip:</strong> watch for the "scaling up" step. If a solution was made up in a 250 cm³ flask and you titrated 25.0 cm³ of it, multiply by 10 to get back to the whole sample.</p></blockquote>
`;

N['2.1.5']=`
<h2>Oxidation numbers</h2>
<p>An <strong>oxidation number</strong> is the charge an atom would have if all its bonds were ionic. It lets you track electrons in any reaction, including covalent ones.</p>
<h3>Rules (apply in this order)</h3>
<ol>
<li>An uncombined element is 0 (Mg, O₂, S₈, Cl₂).</li>
<li>The oxidation numbers in a neutral compound add up to 0; in an ion they add up to the charge.</li>
<li>A simple ion has the oxidation number of its charge (Na⁺ is +1, Cl⁻ is −1).</li>
<li>Group 1 metals are +1; Group 2 metals are +2; aluminium is +3; fluorine is always −1.</li>
<li>Hydrogen is +1, <em>except</em> in metal hydrides (NaH, CaH₂) where it is −1.</li>
<li>Oxygen is −2, <em>except</em> in peroxides (H₂O₂, where it is −1) and in compounds with fluorine (OF₂, where it is +2).</li>
<li>Chlorine is −1 except in compounds with O or F.</li>
</ol>
<div class="wex"><p><strong>Worked examples.</strong></p>
<p>S in H₂SO₄:</p>$$2(+1)+\\mathrm{S}+4(-2)=0\\ \\Rightarrow\\ \\mathbf{S=+6}$$
<p>Mn in MnO₄⁻ (the total is the ion's charge, −1):</p>$$\\mathrm{Mn}+4(-2)=-1\\ \\Rightarrow\\ \\mathbf{Mn=+7}$$
<p>Cr in Cr₂O₇²⁻:</p>$$2\\,\\mathrm{Cr}+7(-2)=-2\\ \\Rightarrow\\ 2\\,\\mathrm{Cr}=+12\\ \\Rightarrow\\ \\mathbf{Cr=+6}$$
<p>N in NH₄⁺:</p>$$\\mathrm{N}+4(+1)=+1\\ \\Rightarrow\\ \\mathbf{N=-3}$$</div>
<h3>Roman numerals in names</h3>
<p>When an element can have more than one oxidation number, it is shown in the name: iron(III) chloride is FeCl₃; copper(I) oxide is Cu₂O. For oxyanions, the numeral belongs to the central atom: sulfate(VI) is SO₄²⁻ (S = +6); sulfate(IV) (sulfite) is SO₃²⁻; nitrate(V) is NO₃⁻; nitrate(III) (nitrite) is NO₂⁻; chlorate(I) is ClO⁻; chlorate(V) is ClO₃⁻; manganate(VII) is MnO₄⁻.</p>

<h2>Oxidation and reduction</h2>
<div class="tbl"><table><tr><th></th><th>In terms of electrons</th><th>In terms of oxidation number</th></tr>
<tr><td><strong>Oxidation</strong></td><td>loss of electrons</td><td>increase in oxidation number</td></tr>
<tr><td><strong>Reduction</strong></td><td>gain of electrons</td><td>decrease in oxidation number</td></tr></table></div>
<p><strong>OIL RIG</strong>: Oxidation Is Loss, Reduction Is Gain. In a <strong>redox</strong> reaction both happen at once: the electrons lost by one species are gained by another.</p>
<ul>
<li>An <strong>oxidising agent</strong> takes electrons from something else, so it is itself <em>reduced</em> (e.g. O₂, Cl₂, MnO₄⁻).</li>
<li>A <strong>reducing agent</strong> gives electrons to something else, so it is itself <em>oxidised</em> (e.g. metals, H₂, I⁻).</li>
</ul>
<h2>Redox reactions of metals with acids</h2>
<p>A reactive metal reacts with a dilute acid to give a salt and hydrogen. The metal is oxidised; the hydrogen ions are reduced.</p>
<div class="rxn">Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)</div>
<p>Oxidation numbers: Mg 0 → +2 (oxidised); H +1 → 0 (reduced); Cl stays −1 (spectator). Ionic equation: Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g).</p>
<p>Half-equations show each process separately with electrons:</p>
<div class="rxn">Mg → Mg²⁺ + 2e⁻ (oxidation)<br>2H⁺ + 2e⁻ → H₂ (reduction)</div>
<div class="wex"><p><strong>Worked example.</strong> In 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂, identify what is oxidised and what is reduced.</p>
<p>Fe: +3 → +2, a decrease: Fe³⁺ is <strong>reduced</strong> (it is the oxidising agent).</p>
<p>I: −1 → 0, an increase: I⁻ is <strong>oxidised</strong> (it is the reducing agent).</p></div>
<p>Building full redox equations from half-equations, and redox titrations, are covered in 5.2.3. Disproportionation (one element both oxidised and reduced) comes in 3.1.3.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when asked to "use oxidation numbers to explain" a redox reaction, give the oxidation numbers before and after for the element that is oxidised and for the one that is reduced, and say which is which.</p></blockquote>
`;

N['2.2.1']=`
<h2>Shells and energy levels</h2>
<p>Electrons occupy <strong>shells</strong> (energy levels) around the nucleus, numbered n = 1, 2, 3, 4 outward. Shell n can hold up to 2n² electrons: 2, 8, 18, 32. The further out a shell, the higher the energy of its electrons.</p>
<h2>Sub-shells and orbitals</h2>
<p>Each shell is divided into <strong>sub-shells</strong> called s, p, d and f. Each sub-shell is made of <strong>orbitals</strong>.</p>
<ul>
<li>An <strong>orbital</strong> is a region around the nucleus that can hold <strong>up to two electrons, with opposite spins</strong>.</li>
<li>An <strong>s</strong> sub-shell has 1 orbital (2 electrons); <strong>p</strong> has 3 orbitals (6); <strong>d</strong> has 5 orbitals (10); <strong>f</strong> has 7 orbitals (14).</li>
</ul>
<div class="tbl"><table><tr><th>Shell</th><th>Sub-shells</th><th>Electrons</th></tr>
<tr><td>1</td><td>1s</td><td>2</td></tr><tr><td>2</td><td>2s 2p</td><td>2 + 6 = 8</td></tr><tr><td>3</td><td>3s 3p 3d</td><td>2 + 6 + 10 = 18</td></tr><tr><td>4</td><td>4s 4p 4d 4f</td><td>2 + 6 + 10 + 14 = 32</td></tr></table></div>
<h3>Shapes of orbitals</h3>
<svg class="diagram" viewBox="0 0 440 150" role="img" aria-label="An s orbital is a sphere; a p orbital is a dumbbell along one axis">
<circle class="fillsoft" cx="80" cy="75" r="45"/><circle class="c1" cx="80" cy="75" r="45"/><text x="60" y="140">s orbital</text>
<g transform="translate(250 75)"><ellipse class="fillsoft" cx="-38" cy="0" rx="38" ry="22"/><ellipse class="fillsoft" cx="38" cy="0" rx="38" ry="22"/><ellipse class="c1" cx="-38" cy="0" rx="38" ry="22"/><ellipse class="c1" cx="38" cy="0" rx="38" ry="22"/><line class="ax dash" x1="-95" y1="0" x2="95" y2="0"/><text x="-40" y="65">p orbital (pₓ)</text></g>
</svg>
<p>An <strong>s orbital</strong> is spherical. A <strong>p orbital</strong> is dumbbell-shaped; the three p orbitals in a sub-shell point along the x, y and z axes at 90° to each other. You don't need the shapes of d orbitals.</p>

<h2>Filling order</h2>
<p>Electrons fill the lowest energy sub-shells first. The order up to 4p is:</p>
<div class="rxn">1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p</div>
<p>Note that <strong>4s fills before 3d</strong>, because at that point 4s is slightly lower in energy. Two more rules:</p>
<ul>
<li>Within a sub-shell, electrons occupy orbitals <strong>singly first</strong>, with parallel spins, before pairing up (because electrons repel). So nitrogen's three 2p electrons are in three different orbitals.</li>
<li>Electrons in the same orbital have opposite spins, shown as ↑↓ in "electrons-in-boxes" diagrams.</li>
</ul>
<div class="wex"><p><strong>Worked examples.</strong></p>
<p>Na (11): 1s² 2s² 2p⁶ 3s¹</p>
<p>Cl (17): 1s² 2s² 2p⁶ 3s² 3p⁵</p>
<p>Fe (26): 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² (written in shell order; [Ar] 3d⁶ 4s² in shorthand)</p>
<p>Br (35): [Ar] 3d¹⁰ 4s² 4p⁵</p></div>
<h3>Two exceptions: chromium and copper</h3>
<p>Cr is <strong>[Ar] 3d⁵ 4s¹</strong> (not 3d⁴ 4s²) and Cu is <strong>[Ar] 3d¹⁰ 4s¹</strong> (not 3d⁹ 4s²). A half-full or full d sub-shell is extra stable.</p>
<h3>Ions</h3>
<p>For positive ions, remove electrons from the highest shell first. For d-block elements, the <strong>4s electrons are lost before the 3d</strong>, even though 4s filled first.</p>
<div class="wex"><p><strong>Worked example.</strong> Fe²⁺ and Fe³⁺.</p>
<p>Fe: [Ar] 3d⁶ 4s². Fe²⁺: lose both 4s electrons → <strong>[Ar] 3d⁶</strong>. Fe³⁺: lose one 3d as well → <strong>[Ar] 3d⁵</strong>.</p>
<p>Negative ions add electrons to the next available orbital: O²⁻ is 1s² 2s² 2p⁶, the same as neon.</p></div>
<h2>Blocks of the periodic table</h2>
<p>An element's block is the sub-shell its highest-energy electron is in: Groups 1–2 are the <strong>s-block</strong>, Groups 13–18 the <strong>p-block</strong>, the transition elements the <strong>d-block</strong>.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> "Electron configuration" questions often target the two traps together: Cr/Cu exceptions, and losing 4s before 3d in ions. Check both every time a d-block element appears.</p></blockquote>
`;

N['2.2.2']=`
<h2>Ionic bonding</h2>
<p>An <strong>ionic bond</strong> is the electrostatic attraction between positive and negative ions. It forms when a metal transfers electrons to a non-metal; both usually end up with a noble-gas configuration. Dot-and-cross diagrams show the ions with their outer electrons and charges in square brackets.</p>
<p>Ionic compounds form <strong>giant ionic lattices</strong>: a regular 3D arrangement where each ion is surrounded by oppositely charged ions (in NaCl, each Na⁺ has six Cl⁻ neighbours).</p>
<h3>Properties of ionic compounds</h3>
<ul>
<li><strong>High melting and boiling points</strong>: a lot of energy is needed to overcome the strong electrostatic attractions between oppositely charged ions throughout the lattice. Higher charges and smaller ions give stronger attraction (MgO melts at 2852 °C, NaCl at 801 °C).</li>
<li><strong>Conduct electricity when molten or dissolved</strong>, because the ions are free to move and carry charge. <strong>Not when solid</strong>: the ions are fixed in the lattice.</li>
<li><strong>Often soluble in water</strong>: polar water molecules attract and surround the ions, pulling them out of the lattice. Some ionic compounds are insoluble when the lattice attractions are too strong.</li>
</ul>

<h2>Covalent bonding</h2>
<p>A <strong>covalent bond</strong> is the strong electrostatic attraction between a <strong>shared pair of electrons</strong> and the nuclei of the bonded atoms. It forms between non-metal atoms. A double bond shares two pairs; a triple bond three pairs.</p>
<ul>
<li>Atoms in period 3 and beyond can have <strong>more than eight electrons</strong> around them ("expanding the octet") because they have d orbitals available: SF₆ has 12 electrons around S, PCl₅ has 10.</li>
<li>Some atoms have fewer than eight: BF₃ has only 6 electrons around boron.</li>
</ul>
<h3>Dative covalent bonds</h3>
<p>A <strong>dative covalent (coordinate) bond</strong> is a covalent bond in which the shared pair of electrons comes from one atom only. It is drawn as an arrow from the atom that donates the pair. Example: NH₃ + H⁺ → NH₄⁺, where N's lone pair forms the fourth bond. Once formed, all four N–H bonds in NH₄⁺ are identical.</p>
<h3>Average bond enthalpy</h3>
<p>The strength of a covalent bond is measured by its <strong>average bond enthalpy</strong>: the energy needed to break one mole of that type of bond in gaseous molecules, averaged over many compounds. A larger bond enthalpy means a stronger bond. Used in 3.2.1.</p>

<h2>Shapes of molecules: electron-pair repulsion</h2>
<p>Pairs of electrons around a central atom repel each other and spread out as far as possible. Count the <strong>bonding pairs</strong> and <strong>lone pairs</strong> on the central atom (a double bond counts as one "region" of electron density). Lone pairs repel more strongly than bonding pairs (they are closer to the nucleus), so each lone pair squeezes the bond angle by about <strong>2.5°</strong>.</p>
<div class="tbl"><table><tr><th>Bonding pairs</th><th>Lone pairs</th><th>Shape</th><th>Angle</th><th>Example</th></tr>
<tr><td>2</td><td>0</td><td>linear</td><td>180°</td><td>CO₂, BeCl₂</td></tr>
<tr><td>3</td><td>0</td><td>trigonal planar</td><td>120°</td><td>BF₃</td></tr>
<tr><td>4</td><td>0</td><td>tetrahedral</td><td>109.5°</td><td>CH₄, NH₄⁺</td></tr>
<tr><td>3</td><td>1</td><td>pyramidal</td><td>107°</td><td>NH₃</td></tr>
<tr><td>2</td><td>2</td><td>non-linear (bent)</td><td>104.5°</td><td>H₂O</td></tr>
<tr><td>6</td><td>0</td><td>octahedral</td><td>90°</td><td>SF₆</td></tr>
<tr><td>5</td><td>0</td><td>trigonal bipyramidal</td><td>90° and 120°</td><td>PCl₅</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> Predict the shape of PH₃ and its bond angle.</p>
<p>P has 5 outer electrons; three form bonds with H, leaving one lone pair. 3 bonding pairs + 1 lone pair: <strong>pyramidal, about 107°</strong>.</p>
<p>For an ion, adjust the electron count for the charge first: NH₄⁺ has 4 bonding pairs and no lone pairs, so it is tetrahedral, 109.5°.</p></div>
<p>When explaining a shape, say: how many bonding pairs and lone pairs; that electron pairs repel and get as far apart as possible; that lone pairs repel more than bonding pairs.</p>

<h2>Electronegativity and polarity</h2>
<p><strong>Electronegativity</strong> is the ability of an atom to attract the bonding electrons in a covalent bond. It increases across a period (more protons, similar shielding) and decreases down a group (more shells, more shielding). Fluorine is the most electronegative element (Pauling value 4.0), then O (3.5), N and Cl (3.0).</p>
<ul>
<li>Two identical atoms share electrons equally: a <strong>non-polar</strong> bond (H–H, Cl–Cl).</li>
<li>If the atoms differ in electronegativity, the shared pair is pulled toward the more electronegative atom, giving it a partial negative charge δ−: a <strong>polar bond</strong> (H<sup>δ+</sup>–Cl<sup>δ−</sup>), with a permanent dipole.</li>
<li>A very large difference means the electron is effectively transferred: the bond is ionic. Bonding is a scale from pure covalent to ionic.</li>
</ul>
<h3>Polar molecules</h3>
<p>A molecule with polar bonds is only polar overall if the dipoles <strong>don't cancel</strong>. CO₂ has two polar C=O bonds, but it is linear, so the dipoles point in opposite directions and cancel: CO₂ is non-polar. H₂O is bent, so its dipoles add: water is polar. CCl₄ (symmetrical tetrahedron) is non-polar; CH₃Cl is polar.</p>

<h2>Intermolecular forces</h2>
<p>Intermolecular forces are weak attractions <em>between</em> molecules. They are much weaker than covalent bonds, and they decide boiling points and solubility of simple molecular substances.</p>
<h3>Induced dipole–dipole (London) forces</h3>
<p>Found between <strong>all</strong> molecules. Electrons move constantly, so at any instant the electron cloud may be uneven: an <strong>instantaneous dipole</strong>. This induces a dipole in a neighbouring molecule, and the two attract. Their strength increases with the <strong>number of electrons</strong> (bigger molecules) and with more surface contact between molecules.</p>
<h3>Permanent dipole–dipole forces</h3>
<p>Between polar molecules: the δ+ end of one attracts the δ− end of another. These act in addition to London forces.</p>
<h3>Hydrogen bonding</h3>
<p>The strongest type of intermolecular force. It forms between a hydrogen atom bonded to <strong>N, O or F</strong> in one molecule and a <strong>lone pair</strong> on an N, O or F atom in another. The H is strongly δ+ because the very electronegative atom pulls its bonding electrons away. Draw it as a dashed line from H to the lone pair, in a straight line (180°), with dipoles and the lone pair shown.</p>
<svg class="diagram" viewBox="0 0 420 120" role="img" aria-label="Hydrogen bond between two water molecules">
<text x="30" y="70">H</text><text x="70" y="70">O</text><text x="62" y="38">H</text><line class="wire" x1="45" y1="65" x2="66" y2="65"/><line class="wire" x1="74" y1="52" x2="70" y2="40"/>
<text x="90" y="58" class="small lbl1">δ−</text><text x="150" y="58" class="small lbl1">δ+</text>
<line class="wire" x1="86" y1="65" x2="150" y2="65"/><text x="155" y="70">H</text><line class="c1 dash" x1="170" y1="65" x2="250" y2="65"/>
<text x="255" y="70">O</text><text x="262" y="45" class="small">: lone pair</text><line class="wire" x1="270" y1="65" x2="300" y2="65"/><text x="305" y="70">H</text><line class="wire" x1="262" y1="75" x2="262" y2="95"/><text x="255" y="112">H</text>
<text x="180" y="95" class="small lbl1">hydrogen bond</text>
</svg>
<h3>Consequences of hydrogen bonding in water</h3>
<ul>
<li><strong>Ice is less dense than water</strong>: in ice, hydrogen bonds hold the molecules in an open lattice with lots of space; when ice melts some hydrogen bonds break and molecules pack closer together.</li>
<li><strong>Relatively high melting and boiling points</strong>: extra energy is needed to break the hydrogen bonds as well as the London forces. H₂O boils at 100 °C while H₂S (no hydrogen bonding, but more electrons) boils at −60 °C.</li>
</ul>
<h2>Simple molecular lattices</h2>
<p>Substances made of small covalent molecules (I₂, ice, CO₂) form <strong>simple molecular lattices</strong>: molecules held in a regular arrangement by weak intermolecular forces.</p>
<ul>
<li><strong>Low melting and boiling points</strong>: melting only overcomes the weak intermolecular forces; the covalent bonds inside the molecules don't break.</li>
<li><strong>Don't conduct electricity</strong>: no charged particles are free to move.</li>
<li><strong>Solubility</strong>: non-polar substances dissolve in non-polar solvents (like dissolves like). Polar molecules that can hydrogen bond with water (ethanol, ammonia) dissolve in water.</li>
</ul>
<p>Giant covalent structures (diamond, graphite, silicon) are different again: see 3.1.1.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when you explain a boiling point, name the force (London / permanent dipole / hydrogen bonding), say which substance has the stronger forces and why, and say that more energy is needed to overcome them. Never say covalent bonds break when a simple molecular substance boils.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
