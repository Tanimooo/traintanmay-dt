/* Extra teaching for the topic notes: deeper explanations, more worked examples and
   "check yourself" questions with hidden answers. Appended to the notes from notes-m*.js (load after them). */
(function(){
const X={};
const Q=(q,a)=>`<details class="fold"><summary>${q}</summary><div><p>${a}</p></div></details>`;
const CY=(...qs)=>`<h2>Check yourself</h2><p class="muted">Try each one before opening the answer.</p>${qs.join('')}`;

X['1.2']=`
<h2>Writing up a practical</h2>
<p>Your lab book is evidence for the endorsement. For each practical, record:</p>
<ul>
<li>the <strong>aim</strong> and the date;</li>
<li>a <strong>risk assessment</strong>: hazards, risks and control measures, specific to the chemicals used;</li>
<li>the <strong>method</strong> you actually followed, including any changes you made and why;</li>
<li><strong>raw results</strong> in a table with units in the headings, recorded to the precision of the apparatus, written straight into the book (not copied up later);</li>
<li><strong>processed results</strong> and calculations, with working;</li>
<li>an <strong>evaluation</strong>: sources of error, uncertainties and improvements;</li>
<li><strong>references</strong> for anything you looked up (PAG 12 and CPAC 5), with author, title, source and date accessed.</li>
</ul>
<h2>How PAG questions appear in the exams</h2>
<p>Written questions on practicals usually test one of these: choosing apparatus and explaining the choice; identifying variables and how to control them; a hazard and a precaution; processing data (titres, temperature changes, gas volumes); drawing or interpreting a graph; calculating uncertainty; or suggesting a specific improvement. Paper 3 often includes an unfamiliar practical built from these familiar skills.</p>
<div class="wex"><p><strong>Worked example.</strong> A student measures an enthalpy change of neutralisation and gets −51 kJ mol⁻¹. The data-book value is −57 kJ mol⁻¹. The thermometer reads to ±0.5 °C and the temperature rise was 6.0 °C. Is the difference explained by the thermometer uncertainty?</p>
<p>ΔT comes from two readings, so its uncertainty is ±1.0 °C.</p>$$\\%\\ \\text{uncertainty}=\\dfrac{1.0}{6.0}\\times 100=17\\,\\%$$$$\\%\\ \\text{error}=\\dfrac{57-51}{57}\\times 100=11\\,\\%$$
<p>The error (11%) is less than the uncertainty (17%), so the difference <strong>could</strong> be explained by the thermometer alone. A more precise thermometer (±0.05 °C) would reduce the uncertainty and test whether heat loss is also significant.</p></div>
${CY(Q('Why is a pipette used rather than a measuring cylinder to measure 25.0 cm³ of solution in a titration?','A pipette has a much smaller uncertainty (about ±0.06 cm³ against ±0.5 cm³), so the volume, and therefore the number of moles in the flask, is known accurately.'),Q('Why must you record 0.00 cm³, not 0, as a burette reading?','A burette reads to ±0.05 cm³, so readings are recorded to 2 decimal places, ending in 0 or 5. Writing 0 suggests a less precise measurement.'),Q('What does CPAC stand for, and is the endorsement part of the A level grade?','Common Practical Assessment Criteria. The endorsement is reported separately as Pass or Not classified and does not change the grade.'))}`;

X['2.1.1']=`
<h2>Why isotopes behave the same chemically</h2>
<p>Chemical reactions involve electrons: bonds form when electrons are shared or transferred. Isotopes of an element have the same number of protons, so the same number and arrangement of electrons. The extra neutrons change only the mass. That's why <sup>35</sup>Cl and <sup>37</sup>Cl both form NaCl in the same way, but <sup>37</sup>Cl₂ gas is slightly denser.</p>
<h2>Relative masses of molecules from a mass spectrum of an element</h2>
<p>Diatomic elements such as chlorine give extra peaks for the molecules. Chlorine (75% <sup>35</sup>Cl, 25% <sup>37</sup>Cl) gives Cl₂⁺ peaks at m/z 70 (<sup>35</sup>Cl–<sup>35</sup>Cl), 72 (<sup>35</sup>Cl–<sup>37</sup>Cl) and 74 (<sup>37</sup>Cl–<sup>37</sup>Cl).</p>
<div class="wex"><p><strong>Worked example.</strong> Predict the relative heights of the Cl₂⁺ peaks at 70, 72 and 74.</p>
<p>Probabilities: P(35) = 0.75, P(37) = 0.25.</p>
$$m/z\\ 70:\\ 0.75\\times 0.75=0.5625$$$$ m/z\\ 74:\\ 0.25\\times 0.25=0.0625$$<p>m/z 72 can be 35–37 or 37–35:</p>$$2\\times 0.75\\times 0.25=0.375$$
<p>Ratio 0.5625 : 0.375 : 0.0625 = <strong>9 : 6 : 1</strong>.</p></div>
<h2>More practice with A<sub>r</sub></h2>
<div class="wex"><p><strong>Worked example (three isotopes).</strong> Magnesium: <sup>24</sup>Mg 78.99%, <sup>25</sup>Mg 10.00%, <sup>26</sup>Mg 11.01%. Find A<sub>r</sub> to 2 d.p.</p>
$$A_r=\\dfrac{(24\\times 78.99)+(25\\times 10.00)+(26\\times 11.01)}{100}=\\dfrac{1895.76+250.00+286.26}{100}=\\mathbf{24.32}$$</div>
<div class="wex"><p><strong>Worked example (relative heights).</strong> A spectrum shows peaks at m/z 63 (height 9.0 cm) and 65 (height 4.0 cm). Find A<sub>r</sub>.</p>
<p>The heights don't need to be percentages:</p>$$A_r=\\dfrac{(63\\times 9.0)+(65\\times 4.0)}{9.0+4.0}=\\dfrac{567+260}{13.0}=\\mathbf{63.6}\\quad(\\text{copper})$$</div>
${CY(Q('How many protons, neutrons and electrons are in <sup>56</sup>Fe³⁺?','Protons 26; neutrons 56 − 26 = 30; electrons 26 − 3 = 23.'),Q('Why is A<sub>r</sub> of chlorine 35.5, not a whole number?','It is a weighted mean of the masses of its isotopes (³⁵Cl and ³⁷Cl), taking their abundances into account.'),Q('Gallium has A<sub>r</sub> 69.7 and isotopes ⁶⁹Ga and ⁷¹Ga. Find the percentage of ⁶⁹Ga.','69x + 71(100 − x) = 6970, so 7100 − 2x = 6970, x = 65%. 65% ⁶⁹Ga, 35% ⁷¹Ga.'))}`;

X['2.1.2']=`
<h2>Working out formulae from names</h2>
<p>Many questions give a name you haven't met. Use the clues in it:</p>
<ul>
<li><strong>-ide</strong> usually means just the element: sodium chloride, magnesium oxide, calcium nitride (Ca₃N₂).</li>
<li><strong>-ate</strong> means the anion contains oxygen: sulfate, nitrate, carbonate, phosphate.</li>
<li><strong>Roman numerals</strong> give the oxidation state, so the charge of a metal ion: lead(II) nitrate is Pb(NO₃)₂; iron(III) oxide is Fe₂O₃.</li>
<li><strong>hydrogen</strong> in a salt name means an H remains: sodium hydrogencarbonate NaHCO₃; sodium hydrogensulfate NaHSO₄.</li>
<li>Hydrated salts: the number of waters is given, e.g. copper(II) sulfate pentahydrate CuSO₄·5H₂O.</li>
</ul>
<h2>More balancing practice</h2>
<div class="wex"><p><strong>Worked example.</strong> Balance: Al + O₂ → Al₂O₃.</p>
<p>O: 2 on the left, 3 on the right. The lowest common multiple is 6, so 3O₂ and 2Al₂O₃. Then Al: 4 on the right, so 4Al.</p>
<p><strong>4Al + 3O₂ → 2Al₂O₃</strong></p></div>
<div class="wex"><p><strong>Worked example.</strong> Write the equation, with state symbols, for aqueous lead(II) nitrate reacting with aqueous potassium iodide to form a yellow precipitate of lead(II) iodide, then the ionic equation.</p>
<p>Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s) + 2KNO₃(aq)</p>
<p>Ionic: <strong>Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)</strong> (K⁺ and NO₃⁻ are spectators).</p></div>
<h2>Which compounds dissolve?</h2>
<p>To decide what's (aq) and what's (s) in a precipitation reaction: all sodium, potassium, ammonium and nitrate salts are soluble; most chlorides are soluble except silver chloride and lead chloride; most sulfates are soluble except barium sulfate, lead sulfate and (slightly) calcium sulfate; most carbonates and hydroxides are insoluble except those of Group 1 and ammonium.</p>
${CY(Q('Write the formula of iron(III) sulfate.','Fe³⁺ and SO₄²⁻: two Fe³⁺ (+6) and three SO₄²⁻ (−6) → Fe₂(SO₄)₃.'),Q('Balance: C₂H₆ + O₂ → CO₂ + H₂O.','2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O (or C₂H₆ + 3½O₂ → 2CO₂ + 3H₂O).'),Q('Write the ionic equation for aqueous barium chloride reacting with aqueous sodium sulfate.','Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)'))}`;

X['2.1.5']=`
<h2>Using oxidation numbers to balance equations</h2>
<p>In a redox reaction, the total <strong>increase</strong> in oxidation number must equal the total <strong>decrease</strong>. This gives the ratio of the reacting species.</p>
<div class="wex"><p><strong>Worked example.</strong> Copper reacts with dilute nitric acid to form Cu²⁺ and NO. Find the ratio Cu : NO₃⁻ that is reduced.</p>
<p>Cu: 0 → +2, an increase of 2. N: +5 (in NO₃⁻) → +2 (in NO), a decrease of 3.</p>
<p>To balance: 3 Cu (increase 6) for every 2 N (decrease 6). <strong>3Cu : 2NO₃⁻</strong>. The full equation is 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O.</p></div>
<h2>Is it redox?</h2>
<p>Check oxidation numbers on both sides. If none change, it isn't redox. Neutralisation (HCl + NaOH) and precipitation (Ag⁺ + Cl⁻) are <strong>not</strong> redox. Acid + metal <strong>is</strong> redox; acid + metal oxide is not.</p>
<div class="wex"><p><strong>Worked example.</strong> Is CaCO₃ → CaO + CO₂ a redox reaction?</p>
<p>Ca +2 → +2; C +4 → +4; O −2 → −2. No change: <strong>not redox</strong>.</p></div>
<h2>Oxidation numbers in organic and unusual compounds</h2>
<ul>
<li>In H₂O₂, O is −1 (a peroxide); it can be oxidised to O₂ (0) or reduced to H₂O (−2).</li>
<li>In NaH, H is −1, because Na is +1 and the compound is neutral.</li>
<li>In S₂O₃²⁻ (thiosulfate), the average S oxidation number is +2; in S₄O₆²⁻ (tetrathionate) it is +2.5. Fractional values are averages over atoms in different positions.</li>
</ul>
${CY(Q('What is the oxidation number of Cl in NaClO₃?','+1 + Cl + 3(−2) = 0, so Cl = +5 (sodium chlorate(V)).'),Q('In Zn + Cu²⁺ → Zn²⁺ + Cu, which species is the oxidising agent?','Cu²⁺: it gains electrons (is reduced from +2 to 0), taking them from zinc.'),Q('Write the half-equation for the oxidation of iron(II) ions.','Fe²⁺ → Fe³⁺ + e⁻'))}`;

X['2.2.1']=`
<h2>Electrons in boxes</h2>
<p>An electrons-in-boxes diagram shows each orbital as a box and each electron as a half-arrow (↑ or ↓). Use it to show the "singly first" rule and pairing.</p>
<div class="tbl"><table><tr><th>Atom</th><th>1s</th><th>2s</th><th>2p</th></tr>
<tr><td>C (6)</td><td>↑↓</td><td>↑↓</td><td>↑ | ↑ | &nbsp;</td></tr>
<tr><td>N (7)</td><td>↑↓</td><td>↑↓</td><td>↑ | ↑ | ↑</td></tr>
<tr><td>O (8)</td><td>↑↓</td><td>↑↓</td><td>↑↓ | ↑ | ↑</td></tr></table></div>
<p>Oxygen has one <strong>paired</strong> 2p orbital; the repulsion between those paired electrons explains why oxygen's first ionisation energy is lower than nitrogen's (3.1.1).</p>
<h2>Why does 4s fill before 3d?</h2>
<p>In potassium and calcium, the 4s sub-shell is lower in energy than 3d, so it fills first. Once the 3d orbitals start filling (from scandium), they drop below 4s in energy. That is why the 4s electrons are the first to be removed when d-block atoms form ions.</p>
<h2>Linking configurations to the periodic table</h2>
<p>You can read an atom's configuration straight from the table: count across each block. Selenium (period 4, p-block, 4th element in the p-block): [Ar] 3d¹⁰ 4s² 4p⁴. The outer-shell configuration of a group is the same for every member: Group 2 is ns², Group 17 is ns² np⁵.</p>
<div class="wex"><p><strong>Worked example.</strong> Write the configurations of Cu⁺ and Cr³⁺.</p>
<p>Cu: [Ar] 3d¹⁰ 4s¹, lose the 4s electron: Cu⁺ = <strong>[Ar] 3d¹⁰</strong>.</p>
<p>Cr: [Ar] 3d⁵ 4s¹, lose 4s¹ then two 3d: Cr³⁺ = <strong>[Ar] 3d³</strong>.</p></div>
${CY(Q('How many orbitals are in the third shell, and how many electrons can it hold?','3s (1) + 3p (3) + 3d (5) = 9 orbitals, holding 18 electrons.'),Q('Write the full electron configuration of S²⁻.','1s² 2s² 2p⁶ 3s² 3p⁶ (the same as argon).'),Q('Which element has the configuration [Ar] 3d⁶ 4s²?','Iron (26 electrons).'))}`;

X['3.1.2']=`
<h2>Explaining the trend in detail</h2>
<p>Going down Group 2, each element has one more shell of electrons. Three effects follow:</p>
<ol>
<li>The <strong>atomic radius increases</strong>, so the outer electrons are further from the nucleus.</li>
<li>There is <strong>more shielding</strong> from the extra inner shells.</li>
<li>The <strong>nuclear charge increases</strong>, but its effect is outweighed by distance and shielding.</li>
</ol>
<p>So the attraction between the nucleus and the outer electrons decreases, the first and second ionisation energies decrease, and the metals lose their outer electrons more easily: they become more reactive (stronger reducing agents).</p>
<h2>Observations to learn</h2>
<div class="tbl"><table><tr><th>Element</th><th>With cold water</th><th>Burning in oxygen</th></tr>
<tr><td>Mg</td><td>very slow; a few bubbles over days</td><td>bright white flame, white solid MgO</td></tr>
<tr><td>Ca</td><td>steady fizzing; cloudy white suspension (Ca(OH)₂ only slightly soluble)</td><td>brick-red flame</td></tr>
<tr><td>Sr</td><td>faster fizzing</td><td>crimson flame</td></tr>
<tr><td>Ba</td><td>vigorous fizzing; colourless solution</td><td>pale green flame</td></tr></table></div>
<h2>Writing redox equations for Group 2</h2>
<div class="wex"><p><strong>Worked example.</strong> Write the equation for strontium with water, and show it is a redox reaction.</p>
<p>Sr(s) + 2H₂O(l) → Sr(OH)₂(aq) + H₂(g)</p>
<p>Sr: 0 → +2, oxidised. H: +1 (in H₂O) → 0 (in H₂), reduced. Electrons are transferred from Sr to H.</p></div>
<div class="wex"><p><strong>Worked example (calculation).</strong> An antacid tablet contains 0.500 g of CaCO₃. What volume of 0.100 mol dm⁻³ HCl can it neutralise?</p>
$$n(\\mathrm{CaCO_3})=\\dfrac{0.500}{100.1}=5.00\\times 10^{-3}\\ \\text{mol}$$<p>CaCO₃ reacts with 2HCl, so n(HCl) = 1.00 × 10⁻² mol.</p>
$$V=\\dfrac{n}{c}=\\dfrac{1.00\\times 10^{-2}}{0.100}=0.100\\ \\text{dm}^3=\\mathbf{100}\\ \\text{cm}^3$$</div>
${CY(Q('Why is barium more reactive than magnesium?','Barium atoms are larger with more shielding, so the outer electrons are less strongly attracted to the nucleus; the ionisation energies are lower and the electrons are lost more easily.'),Q('Predict the pH of a saturated solution of barium hydroxide compared with magnesium hydroxide.','Higher (about 13 versus about 10): Ba(OH)₂ is more soluble, so the solution contains more OH⁻ ions.'),Q('Write the equation for calcium oxide reacting with water.','CaO(s) + H₂O(l) → Ca(OH)₂(aq)'))}`;

X['3.1.3']=`
<h2>Explaining reactivity in detail</h2>
<p>A halogen atom reacts by <strong>gaining</strong> an electron into its outer p sub-shell. Down the group:</p>
<ul>
<li>atomic radius increases, so an incoming electron is further from the nucleus;</li>
<li>shielding increases;</li>
<li>so the nuclear attraction for the incoming electron decreases, and the halogen gains an electron less easily.</li>
</ul>
<p>So oxidising power decreases: Cl₂ > Br₂ > I₂. This is the opposite of Group 2, where reactivity increases down the group because those atoms <em>lose</em> electrons.</p>
<h2>Fluorine and astatine</h2>
<p>Fluorine is a pale yellow gas, the most reactive halogen and the strongest oxidising agent. Astatine is radioactive and rare; you can predict that it is a dark solid, less reactive than iodine, and that AgAt would be an insoluble precipitate.</p>
<h2>Halogens as oxidising agents: more examples</h2>
<div class="wex"><p><strong>Worked example.</strong> Chlorine is bubbled through aqueous potassium iodide. Give the observation and the ionic equation, and identify the oxidising agent.</p>
<p>The colourless solution turns brown (I₂); adding cyclohexane gives a violet top layer.</p>
<p>Cl₂(aq) + 2I⁻(aq) → 2Cl⁻(aq) + I₂(aq). Chlorine is the oxidising agent (0 → −1).</p></div>
<h2>Bleach and disproportionation: calculations</h2>
<div class="wex"><p><strong>Worked example.</strong> In Cl₂ + 2NaOH → NaCl + NaClO + H₂O, show that chlorine disproportionates.</p>
<p>Cl in Cl₂: 0. In NaCl: −1 (reduced). In NaClO: Na +1, O −2, so Cl = +1 (oxidised). The same element is both oxidised and reduced.</p></div>
<p>With <strong>hot</strong> concentrated NaOH, chlorine disproportionates differently, forming chlorate(V): 3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O (Cl goes to −1 and +5).</p>
${CY(Q('Why does bromine not react with potassium chloride solution?','Bromine is a weaker oxidising agent than chlorine: it can’t remove an electron from Cl⁻, so it can’t displace chlorine.'),Q('Why is nitric acid added before silver nitrate in the halide test?','To react with and remove carbonate (and hydroxide) ions, which would also form precipitates with Ag⁺ and give a false result.'),Q('Explain the increase in boiling point from Cl₂ to I₂.','Down the group the molecules have more electrons, so stronger London forces between molecules; more energy is needed to overcome them.'))}`;

X['3.1.4']=`
<h2>Why the tests work</h2>
<ul>
<li><strong>Carbonate</strong>: carbonate ions are a base and react with H⁺ to release CO₂. CO₂ is acidic, and reacts with calcium hydroxide (limewater) to form insoluble calcium carbonate, the milky precipitate.</li>
<li><strong>Sulfate</strong>: barium sulfate is extremely insoluble, so it precipitates even from dilute solutions.</li>
<li><strong>Halides</strong>: silver halides are insoluble; their solubility in ammonia decreases from AgCl to AgI.</li>
<li><strong>Ammonium</strong>: OH⁻ removes H⁺ from NH₄⁺, releasing ammonia gas, which is alkaline.</li>
</ul>
<h2>Designing a sequence of tests</h2>
<div class="wex"><p><strong>Worked example.</strong> You have four unlabelled solutions: sodium carbonate, sodium sulfate, sodium chloride and ammonium chloride. Describe how to identify each one.</p>
<p>1. Add dilute HNO₃ to a sample of each: the one that fizzes (CO₂ turns limewater milky) is <strong>sodium carbonate</strong>.</p>
<p>2. To fresh samples of the other three, add Ba(NO₃)₂(aq): a white precipitate shows <strong>sodium sulfate</strong>.</p>
<p>3. The remaining two both give a white precipitate with AgNO₃ (both chlorides). Warm each with NaOH(aq): the one that gives a gas turning damp red litmus blue is <strong>ammonium chloride</strong>; the other is <strong>sodium chloride</strong>.</p></div>
<h2>Common mistakes</h2>
<ul>
<li>Using HCl to acidify, then testing for chloride.</li>
<li>Using BaCl₂ for the sulfate test, then testing the same solution for halides.</li>
<li>Saying "limewater goes cloudy" without first saying there is effervescence.</li>
<li>Forgetting that the litmus paper must be <strong>damp</strong>: ammonia must dissolve to form OH⁻ before it changes colour.</li>
</ul>
${CY(Q('A solution gives a white precipitate with acidified silver nitrate that dissolves in dilute ammonia. What ion is present?','Chloride, Cl⁻.'),Q('Why must you test for carbonate before sulfate?','Carbonate ions also form a white precipitate with barium ions (BaCO₃), so they must be removed (and identified) first.'),Q('Give the ionic equation for the ammonium test.','NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)'))}`;

X['3.2.2']=`
<h2>Interpreting rate graphs</h2>
<p>On a graph of volume of gas (or product) against time:</p>
<ul>
<li>the curve is <strong>steepest at the start</strong>, when reactant concentration is highest;</li>
<li>it gets less steep as reactants are used up;</li>
<li>it becomes horizontal when one reactant has run out (the reaction has finished).</li>
</ul>
<p>If the same amounts react faster (higher temperature, catalyst, powder instead of lumps), the curve is steeper but ends at the <strong>same final volume</strong>. If more of the limiting reactant is used, the final volume is higher.</p>
<div class="wex"><p><strong>Worked example.</strong> A tangent drawn at 20 s to a graph of CO₂ volume against time passes through (0 s, 10 cm³) and (50 s, 60 cm³). Find the rate at 20 s.</p>
$$\\text{gradient}=\\dfrac{\\Delta y}{\\Delta x}=\\dfrac{60-10}{50-0}=\\mathbf{1.0}\\ \\text{cm}^3\\,\\text{s}^{-1}$$</div>
<h2>Explaining rate changes: full answers</h2>
<div class="wex"><p><strong>Worked example.</strong> Explain why increasing the temperature increases the rate of reaction. (3 marks)</p>
<p>1. At a higher temperature the molecules have more energy (the Boltzmann distribution shifts to higher energy).</p>
<p>2. A greater proportion of molecules have energy greater than or equal to the activation energy.</p>
<p>3. So there are more <strong>successful</strong> collisions per unit time (collision frequency also increases a little).</p></div>
<div class="wex"><p><strong>Worked example.</strong> Explain how a catalyst increases rate, with reference to the Boltzmann distribution.</p>
<p>The catalyst provides an alternative route with a lower activation energy. The distribution is unchanged, but more of the area lies above the new, lower E<sub>a</sub>, so a greater proportion of molecules have enough energy to react, and there are more successful collisions per unit time.</p></div>
${CY(Q('Why does powdered calcium carbonate react faster with acid than lumps of the same mass?','The powder has a larger surface area, so more particles are exposed and there are more frequent collisions with acid particles.'),Q('Give one example each of a homogeneous and a heterogeneous catalyst.','Homogeneous: H₂SO₄ in esterification (all in solution). Heterogeneous: Fe in the Haber process (solid catalyst, gaseous reactants).'),Q('What does the area under a Boltzmann distribution curve represent, and does it change with temperature?','The total number of molecules. It doesn’t change with temperature.'))}`;

X['3.2.3']=`
<h2>More Le Chatelier practice</h2>
<div class="wex"><p><strong>Worked example.</strong> 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH = −196 kJ mol⁻¹ (the Contact process, V₂O₅ catalyst). Predict the effect on the yield of SO₃ of (a) increasing temperature, (b) increasing pressure, (c) removing SO₃.</p>
<p>(a) Forward reaction is exothermic. Increasing temperature shifts equilibrium in the endothermic (reverse) direction: <strong>yield decreases</strong>.</p>
<p>(b) 3 mol of gas on the left, 2 on the right. Increasing pressure shifts equilibrium to fewer moles of gas: <strong>yield increases</strong>.</p>
<p>(c) Removing a product shifts equilibrium to the right to replace it: <strong>more SO₃ forms</strong>.</p>
<p>In practice: about 450 °C (compromise between rate and yield), about 1–2 atm (the yield is already high, so high pressure isn't worth the cost).</p></div>
<h2>Equilibria you might meet</h2>
<ul>
<li>CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (esterification; adding excess ethanol increases the ester yield).</li>
<li>2CrO₄²⁻ (yellow) + 2H⁺ ⇌ Cr₂O₇²⁻ (orange) + H₂O: adding acid turns it orange; adding alkali removes H⁺ and turns it yellow.</li>
<li>N₂O₄ (colourless) ⇌ 2NO₂ (brown), ΔH positive: heating makes the gas browner.</li>
</ul>
<h2>Writing K<sub>c</sub> carefully</h2>
<div class="wex"><p><strong>Worked example.</strong> Write K<sub>c</sub> for N₂(g) + 3H₂(g) ⇌ 2NH₃(g).</p>
$$K_c=\\dfrac{[\\mathrm{NH_3}]^2}{[\\mathrm{N_2}][\\mathrm{H_2}]^3}$$
<p>If K<sub>c</sub> at a given temperature is very small (e.g. 10⁻⁵), the equilibrium lies well to the left.</p></div>
${CY(Q('Why does a catalyst not change the position of equilibrium?','It speeds up the forward and reverse reactions equally, so the equilibrium concentrations are the same; equilibrium is just reached sooner.'),Q('For H₂(g) + I₂(g) ⇌ 2HI(g), what is the effect of increasing pressure on the position of equilibrium?','None: there are 2 moles of gas on each side.'),Q('State two features of a dynamic equilibrium.','The rates of the forward and reverse reactions are equal; the concentrations of reactants and products remain constant (in a closed system).'))}`;

X['4.1.2']=`
<h2>Alkanes as fuels: more detail</h2>
<p>Crude oil is separated by fractional distillation into fractions of alkanes with similar boiling points. Shorter alkanes are in greater demand as fuels; longer ones are cracked into shorter alkanes and alkenes. The combustion of alkanes releases CO₂, a greenhouse gas, and incomplete combustion releases CO and soot. Sulfur impurities produce SO₂, which causes acid rain; car engines also produce NO<sub>x</sub> from nitrogen and oxygen in the air.</p>
<h2>Writing combustion equations</h2>
<div class="wex"><p><strong>Worked example.</strong> Write equations for the complete and incomplete (forming CO) combustion of hexane.</p>
<p>Complete: C₆H₁₄ + 9½O₂ → 6CO₂ + 7H₂O (or 2C₆H₁₄ + 19O₂ → 12CO₂ + 14H₂O).</p>
<p>Incomplete: C₆H₁₄ + 6½O₂ → 6CO + 7H₂O.</p></div>
<h2>Radical substitution: more practice</h2>
<div class="wex"><p><strong>Worked example.</strong> Write the mechanism for the formation of chloroethane from ethane.</p>
<p>Initiation: Cl₂ → 2Cl• (UV).</p>
<p>Propagation: C₂H₆ + Cl• → •C₂H₅ + HCl; •C₂H₅ + Cl₂ → C₂H₅Cl + Cl•.</p>
<p>Termination: •C₂H₅ + Cl• → C₂H₅Cl; 2•C₂H₅ → C₄H₁₀; 2Cl• → Cl₂.</p></div>
<p>Isomers from substitution: monochlorination of butane gives 1-chlorobutane and 2-chlorobutane, because H atoms on the end carbons and on the middle carbons are in different environments. Count the number of different H environments to predict how many mono-substituted isomers form.</p>
${CY(Q('How many mono-brominated isomers can form from 2-methylpropane?','Two: 1-bromo-2-methylpropane (substitution on a CH₃) and 2-bromo-2-methylpropane (on the central CH).'),Q('Why are alkanes unreactive towards most reagents?','The C–C and C–H bonds are strong (high bond enthalpy) and essentially non-polar, so they don’t attract nucleophiles or electrophiles.'),Q('Explain why pentane has a higher boiling point than 2,2-dimethylpropane.','Pentane is unbranched, so its molecules have more surface contact and stronger London forces, needing more energy to overcome.'))}`;

X['4.2.1']=`
<h2>Equations for oxidation: writing them with [O]</h2>
<p>Count how many oxygen atoms are added (and hydrogens removed as water):</p>
<ul>
<li>Primary alcohol → aldehyde: RCH₂OH + [O] → RCHO + H₂O</li>
<li>Primary alcohol → acid: RCH₂OH + 2[O] → RCOOH + H₂O</li>
<li>Aldehyde → acid: RCHO + [O] → RCOOH</li>
<li>Secondary alcohol → ketone: R₂CHOH + [O] → R₂CO + H₂O</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Name the products of oxidising butan-1-ol, butan-2-ol and 2-methylpropan-2-ol with acidified dichromate.</p>
<p>Butan-1-ol (primary): <strong>butanal</strong> by distillation, or <strong>butanoic acid</strong> under reflux. Butan-2-ol (secondary): <strong>butanone</strong>. 2-methylpropan-2-ol (tertiary): <strong>no reaction</strong>, stays orange.</p></div>
<h2>Why aldehydes can be distilled off</h2>
<p>An aldehyde has a C=O but no O–H, so its molecules can't form hydrogen bonds with each other (only weaker permanent dipole–dipole forces). It has a lower boiling point than the alcohol it was made from (ethanal 21 °C, ethanol 78 °C), so it evaporates out of the warm mixture and can be collected before further oxidation.</p>
<h2>Dehydration: predicting all the products</h2>
<div class="wex"><p><strong>Worked example.</strong> Butan-2-ol is heated with concentrated phosphoric acid. Name all the alkene products.</p>
<p>H can be removed from carbon 1 or carbon 3 (either side of the C–OH). From C1: <strong>but-1-ene</strong>. From C3: <strong>but-2-ene</strong>, which has <strong>E and Z</strong> isomers. Three products in total.</p></div>
${CY(Q('Why does ethanol dissolve in water but hexan-1-ol does not dissolve well?','Both can hydrogen bond with water through –OH, but hexan-1-ol has a long non-polar hydrocarbon chain that cannot, so its solubility is much lower.'),Q('What colour change shows a positive result with acidified potassium dichromate?','Orange to green.'),Q('Classify propan-2-ol and name its oxidation product.','Secondary alcohol; it is oxidised to propanone.'))}`;

X['4.2.2']=`
<h2>Haloalkanes in synthesis</h2>
<p>Haloalkanes are useful intermediates because the halogen can be replaced by other groups using different nucleophiles:</p>
<div class="tbl"><table><tr><th>Nucleophile</th><th>Conditions</th><th>Product</th></tr>
<tr><td>OH⁻</td><td>NaOH(aq), heat under reflux</td><td>alcohol</td></tr>
<tr><td>CN⁻</td><td>NaCN in ethanol, heat</td><td>nitrile (chain + 1 carbon), 6.2.4</td></tr>
<tr><td>NH₃</td><td>excess ethanolic ammonia, heat</td><td>amine, 6.2.1</td></tr></table></div>
<h2>Comparing primary, secondary and tertiary haloalkanes</h2>
<p>With aqueous silver nitrate in ethanol, tertiary haloalkanes hydrolyse fastest and primary slowest (for the same halogen). You only need the comparison of C–Cl, C–Br and C–I for primary haloalkanes, but if asked, the experiment is the same.</p>
<h2>Writing the mechanism with water</h2>
<p>In the silver nitrate experiment the nucleophile is <strong>water</strong>. The mechanism is the same, but water's lone pair attacks the δ+ carbon, then the intermediate loses H⁺:</p>
<div class="rxn">CH₃CH₂Br + H₂O → CH₃CH₂OH + H⁺ + Br⁻</div>
<div class="wex"><p><strong>Worked example.</strong> 1-chlorobutane, 1-bromobutane and 1-iodobutane are each warmed with AgNO₃ in ethanol at 50 °C. Predict the order in which precipitates appear and explain.</p>
<p>1-iodobutane (yellow) first, then 1-bromobutane (cream), then 1-chlorobutane (white). The C–I bond has the lowest bond enthalpy, so it breaks most easily and the halide ion is released fastest.</p></div>
<h2>Environmental chemistry: the full picture</h2>
<p>CFCs are dangerous to ozone because they are so <strong>unreactive</strong>: they last long enough (decades) to drift up into the stratosphere. There, high-energy UV breaks the C–Cl bond. C–F bonds are stronger and are not broken, which is why HFCs (no chlorine) don't deplete ozone (though they are greenhouse gases).</p>
${CY(Q('Define a nucleophile.','An electron-pair donor.'),Q('Write the two propagation steps for ozone depletion by chlorine radicals.','Cl• + O₃ → ClO• + O₂; ClO• + O → Cl• + O₂.'),Q('Why is the C–F bond not broken by UV in the stratosphere, while C–Cl is?','The C–F bond is much stronger (higher bond enthalpy), so UV radiation there does not have enough energy to break it.'))}`;

X['4.2.3']=`
<h2>Example preparation: 1-bromobutane</h2>
<p>A typical aliphatic preparation combines all the techniques in this topic.</p>
<ol>
<li>Put butan-1-ol, sodium bromide, water and concentrated sulfuric acid (added slowly, with cooling) in a round-bottomed flask with anti-bumping granules.</li>
<li><strong>Heat under reflux</strong> for about 45 minutes: H₂SO₄ + NaBr make HBr, which substitutes the –OH.</li>
<li>Rearrange for <strong>distillation</strong> and distil off the crude 1-bromobutane with water.</li>
<li>Transfer to a <strong>separating funnel</strong>. 1-bromobutane is denser than water, so it is the <strong>lower</strong> layer. Run it off.</li>
<li>Wash with <strong>sodium hydrogencarbonate solution</strong> to neutralise acid, releasing pressure often; then with water.</li>
<li><strong>Dry</strong> with anhydrous calcium chloride until the liquid is clear.</li>
<li><strong>Redistil</strong>, collecting the fraction boiling at 100–104 °C (b.p. 101 °C).</li>
</ol>
<h2>Calculating yield in a preparation</h2>
<div class="wex"><p><strong>Worked example.</strong> 7.40 g of butan-1-ol (M = 74.0) gives 8.22 g of 1-bromobutane (M = 137.0). Find the percentage yield.</p>
<p>n(butan-1-ol) = 0.100 mol; theoretical n(product) = 0.100 mol, mass 13.70 g.</p>
$$\\%\\ \\text{yield}=\\dfrac{8.22}{13.70}\\times 100=\\mathbf{60.0\\,\\%}$$<p>Losses: incomplete reaction, side reactions (elimination to but-1-ene), and product left behind during transfers and separation.</p></div>
<h2>Two-step routes: more examples</h2>
<div class="wex"><p><strong>Worked example.</strong> Ethene to ethanoic acid.</p>
<p>1. Steam, H₃PO₄ catalyst → ethanol. 2. Excess acidified K₂Cr₂O₇, heat under reflux → <strong>ethanoic acid</strong>.</p></div>
<div class="wex"><p><strong>Worked example.</strong> Propan-1-ol to 1,2-dibromopropane.</p>
<p>1. Conc. H₃PO₄, heat → propene (elimination). 2. Br₂ at room temperature → <strong>1,2-dibromopropane</strong> (electrophilic addition).</p></div>
${CY(Q('Why is the top of a reflux condenser left open?','To stop pressure building up as the mixture is heated, which could make the apparatus burst.'),Q('How can you tell which layer in a separating funnel is aqueous?','Add a little water and see which layer increases in volume (or check densities).'),Q('How do you know when an organic liquid is dry?','It changes from cloudy to clear, and fresh drying agent no longer clumps together.'))}`;

X['4.2.4']=`
<h2>Interpreting an IR spectrum step by step</h2>
<ol>
<li>Look at 2500–3600 cm⁻¹: a broad O–H? Very broad (acid) or broad (alcohol)? A sharper N–H?</li>
<li>Look at about 1700 cm⁻¹: a strong C=O?</li>
<li>Look at 1000–1300 cm⁻¹: a C–O?</li>
<li>Put it together and check against the formula.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> A compound C₃H₆O₂ has IR peaks at 1740 and 1200 cm⁻¹ and nothing broad above 2500 except C–H. Which functional group?</p>
<p>C=O (1740) and C–O (1200), no O–H: an <strong>ester</strong> (methyl ethanoate or ethyl methanoate).</p></div>
<h2>Using IR to follow a reaction</h2>
<p>IR is used to check how far a reaction has gone. Oxidising propan-1-ol: the starting alcohol shows broad O–H only; propanal shows C=O only; propanoic acid shows very broad O–H <em>and</em> C=O. If a product sample shows both broad alcohol O–H and C=O, some unreacted alcohol remains.</p>
<h2>Mass spectrometry: isotope peaks</h2>
<ul>
<li><strong>M+1 peak</strong>: a small peak one unit above M⁺, caused by molecules containing one <sup>13</sup>C atom (1.1% of carbon). Ignore it when finding M<sub>r</sub>.</li>
<li><strong>Chlorine</strong>: M⁺ and M+2 peaks in a 3 : 1 ratio (<sup>35</sup>Cl and <sup>37</sup>Cl).</li>
<li><strong>Bromine</strong>: M⁺ and M+2 peaks of about equal height (<sup>79</sup>Br and <sup>81</sup>Br).</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A haloalkane gives peaks at m/z 64 and 66 in a 3 : 1 ratio, and a fragment at 29. Identify it.</p>
<p>3 : 1 M⁺ and M+2: one Cl atom. M<sub>r</sub> = 64 → C₂H₅Cl (24 + 5 + 35 = 64). Fragment 29 = C₂H₅⁺. <strong>Chloroethane</strong>.</p></div>
${CY(Q('Why does every organic compound show absorption near 2900 cm⁻¹?','Almost all organic compounds contain C–H bonds, which absorb between 2850 and 3100 cm⁻¹.'),Q('How would you use IR to show that ethanol has been oxidised to ethanal, not ethanoic acid?','Ethanal: C=O absorption (about 1720–1740) with no broad O–H. Ethanoic acid would also show a very broad O–H at 2500–3300.'),Q('What species gives the molecular ion peak?','The molecule that has lost one electron, M⁺; its m/z equals the relative molecular mass.'))}`;

X['5.1.2']=`
<h2>A full worked example with units</h2>
<div class="wex"><p><strong>Worked example.</strong> 0.400 mol of PCl₅ is heated in a 2.00 dm³ flask: PCl₅(g) ⇌ PCl₃(g) + Cl₂(g). At equilibrium 0.250 mol of PCl₅ remains. Calculate K<sub>c</sub> with units.</p>
<p>PCl₅ reacted = 0.150 mol, so 0.150 mol PCl₃ and 0.150 mol Cl₂ formed.</p>
$$[\\mathrm{PCl_5}]=\\dfrac{0.250}{2.00}=0.125$$$$[\\mathrm{PCl_3}]=[\\mathrm{Cl_2}]=\\dfrac{0.150}{2.00}=0.0750\\ \\text{mol dm}^{-3}$$
$$K_c=\\dfrac{[\\mathrm{PCl_3}][\\mathrm{Cl_2}]}{[\\mathrm{PCl_5}]}=\\dfrac{0.0750\\times 0.0750}{0.125}=\\mathbf{0.0450}\\ \\text{mol dm}^{-3}$$<p>Here the volume does <em>not</em> cancel, so you must use concentrations.</p></div>
<h2>Finding an unknown concentration</h2>
<div class="wex"><p><strong>Worked example.</strong> For H₂ + I₂ ⇌ 2HI, K<sub>c</sub> = 49.0 at a given temperature. An equilibrium mixture has [H₂] = [I₂] = 0.0100 mol dm⁻³. Find [HI].</p>
$$[\\mathrm{HI}]^2=K_c[\\mathrm{H_2}][\\mathrm{I_2}]=49.0\\times 0.0100\\times 0.0100=4.90\\times 10^{-3}$$$$[\\mathrm{HI}]=\\sqrt{4.90\\times 10^{-3}}=\\mathbf{0.0700}\\ \\text{mol dm}^{-3}$$</div>
<h2>K<sub>p</sub> units</h2>
<p>For N₂ + 3H₂ ⇌ 2NH₃: $K_p=\\dfrac{p(\\mathrm{NH_3})^2}{p(\\mathrm{N_2})\\,p(\\mathrm{H_2})^3}$, with units $\\dfrac{\\text{kPa}^2}{\\text{kPa}^4}=\\text{kPa}^{-2}$. For heterogeneous equilibria involving gases and solids, such as CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = p(CO₂) only.</p>
<h2>Temperature and K: explaining it</h2>
<div class="wex"><p><strong>Worked example.</strong> For 2SO₂ + O₂ ⇌ 2SO₃ (ΔH negative), explain what happens to K<sub>c</sub> and the equilibrium position when the temperature is raised.</p>
<p>The forward reaction is exothermic, so increasing temperature <strong>decreases K<sub>c</sub></strong>. The ratio [SO₃]²/([SO₂]²[O₂]) is now greater than the new K<sub>c</sub>, so the system reacts in the reverse direction: the equilibrium shifts <strong>left</strong> until the ratio equals the new K<sub>c</sub>.</p></div>
${CY(Q('Which of concentration, pressure, temperature and catalyst change the value of K<sub>c</sub>?','Only temperature.'),Q('Give the units of K<sub>c</sub> for 2NO₂ ⇌ N₂O₄.','K<sub>c</sub> = [N₂O₄]/[NO₂]²: (mol dm⁻³)/(mol dm⁻³)² = dm³ mol⁻¹.'),Q('The mole fractions in a mixture are 0.20 and 0.80 at a total pressure of 500 kPa. What are the partial pressures?','100 kPa and 400 kPa.'))}`;

X['5.2.2']=`
<h2>Predicting the sign of ΔS without data</h2>
<p>Look for changes in the number of gas molecules first: it dominates.</p>
<ul>
<li>2H₂(g) + O₂(g) → 2H₂O(l): 3 mol gas → 0: ΔS strongly <strong>negative</strong>.</li>
<li>NH₄Cl(s) → NH₃(g) + HCl(g): ΔS strongly <strong>positive</strong>.</li>
<li>H₂O(l) → H₂O(g): ΔS positive (boiling).</li>
<li>N₂(g) + 3H₂(g) → 2NH₃(g): 4 → 2 mol gas: ΔS negative.</li>
</ul>
<h2>Why exothermic reactions are usually feasible</h2>
<p>ΔG = ΔH − TΔS can be understood in terms of total entropy: −ΔG/T is the total entropy change of system plus surroundings. A negative ΔH releases energy to the surroundings, increasing their entropy (by −ΔH/T). So an exothermic reaction can be feasible even if the system's entropy falls, provided the temperature is low enough that −TΔS doesn't outweigh ΔH.</p>
<div class="wex"><p><strong>Worked example.</strong> N₂(g) + 3H₂(g) → 2NH₃(g): ΔH = −92 kJ mol⁻¹, ΔS = −198 J K⁻¹ mol⁻¹. Above what temperature is the reaction no longer feasible?</p>
$$\\Delta G=0\\ \\text{when}\\ T=\\dfrac{\\Delta H}{\\Delta S}=\\dfrac{-92}{-0.198}=\\mathbf{465}\\ \\text{K}$$<p>Below 465 K it is feasible; above it ΔG becomes positive. (The Haber process runs at about 720 K anyway, accepting a lower yield for a faster rate.)</p></div>
<div class="wex"><p><strong>Worked example (graph).</strong> A plot of ΔG against T for a reaction is a straight line with gradient −0.150 kJ K⁻¹ mol⁻¹ and intercept +60 kJ mol⁻¹. Find ΔH, ΔS and the minimum temperature for feasibility.</p>
<p>Intercept = ΔH = <strong>+60 kJ mol⁻¹</strong>. Gradient = −ΔS, so ΔS = <strong>+150 J K⁻¹ mol⁻¹</strong>.</p>$$T=\\dfrac{\\Delta H}{\\Delta S}=\\dfrac{60}{0.150}=\\mathbf{400}\\ \\text{K}$$</div>
${CY(Q('A reaction has ΔH positive and ΔS negative. When is it feasible?','Never: ΔG = ΔH − TΔS is always positive.'),Q('Why might a reaction with negative ΔG not happen?','The activation energy may be so high that the rate is negligibly slow (kinetic stability).'),Q('Which has more entropy: 1 mol of steam or 1 mol of ice at 0 °C? Why?','Steam: gas particles move freely and are much more disordered, so energy is more dispersed.'))}`;

X['5.3.2']=`
<h2>Why the precipitates form</h2>
<p>In water, a transition metal ion exists as an aqua complex, e.g. [Cu(H₂O)₆]²⁺. Hydroxide ions (from NaOH, or from the reaction NH₃ + H₂O ⇌ NH₄⁺ + OH⁻) remove H⁺ from the water ligands, giving a neutral complex that is insoluble:</p>
<div class="rxn">[Cu(H₂O)₆]²⁺ + 2OH⁻ → [Cu(OH)₂(H₂O)₄] + 2H₂O &nbsp;&nbsp;(simplified: Cu²⁺ + 2OH⁻ → Cu(OH)₂)</div>
<p>In <strong>excess ammonia</strong>, ammonia ligands replace water and hydroxide in copper(II) and chromium(III), forming soluble complex ions, so the precipitate dissolves. In <strong>excess NaOH</strong>, only Cr(OH)₃ dissolves (forming [Cr(OH)₆]³⁻), because it is amphoteric.</p>
<h2>Why Fe(OH)₂ turns brown</h2>
<p>Iron(II) is easily oxidised by oxygen in the air to iron(III): the green Fe(OH)₂ precipitate slowly becomes orange-brown Fe(OH)₃, starting at the surface where it meets the air. Mn(OH)₂ darkens for the same reason (oxidised to manganese(IV)).</p>
<h2>A full identification problem</h2>
<div class="wex"><p><strong>Worked example.</strong> Solid X is green. A solution of X with a few drops of NaOH(aq) gives a grey-green precipitate, which dissolves in excess to a dark green solution. Acidified with HNO₃ then tested with AgNO₃, it gives a white precipitate that dissolves in dilute ammonia. Identify X and write ionic equations.</p>
<p>Grey-green precipitate dissolving in excess NaOH: <strong>Cr³⁺</strong>. White precipitate soluble in dilute NH₃: <strong>Cl⁻</strong>. X is <strong>chromium(III) chloride, CrCl₃</strong>.</p>
<p>Cr³⁺(aq) + 3OH⁻(aq) → Cr(OH)₃(s); Cr(OH)₃(s) + 3OH⁻(aq) → [Cr(OH)₆]³⁻(aq); Ag⁺(aq) + Cl⁻(aq) → AgCl(s).</p></div>
${CY(Q('How could you distinguish Fe²⁺ from Fe³⁺ using NaOH(aq)?','Fe²⁺ gives a green precipitate (turning brown on standing); Fe³⁺ gives an orange-brown precipitate straight away.'),Q('A blue precipitate dissolves in excess ammonia to a dark blue solution. Which ion?','Cu²⁺ (forming [Cu(NH₃)₄(H₂O)₂]²⁺).'),Q('Which test distinguishes NH₄Cl from NaCl?','Warm with NaOH(aq): NH₄Cl gives ammonia, which turns damp red litmus blue; NaCl gives no gas.'))}`;

X['6.1.2']=`
<h2>Reactivity of the carbonyl group</h2>
<p>Unlike the C=C in alkenes, the C=O bond is polar. The oxygen pulls electron density toward itself, leaving the carbon δ+. So carbonyl compounds are attacked by <strong>nucleophiles</strong> (electron-pair donors) at carbon, not by electrophiles. That's why bromine water doesn't react with aldehydes and ketones in the way it does with alkenes.</p>
<h2>Reactions in summary</h2>
<div class="tbl"><table><tr><th>Reagent</th><th>Aldehyde</th><th>Ketone</th></tr>
<tr><td>K₂Cr₂O₇ / H₂SO₄, reflux</td><td>carboxylic acid (orange → green)</td><td>no reaction</td></tr>
<tr><td>Tollens' reagent, warm</td><td>silver mirror</td><td>no reaction</td></tr>
<tr><td>NaBH₄(aq)</td><td>primary alcohol</td><td>secondary alcohol</td></tr>
<tr><td>NaCN / H₂SO₄</td><td>hydroxynitrile</td><td>hydroxynitrile</td></tr>
<tr><td>2,4-DNP</td><td>orange precipitate</td><td>orange precipitate</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> Name the products when propanal and propanone each react with NaBH₄, and with HCN.</p>
<p>NaBH₄: propanal → <strong>propan-1-ol</strong>; propanone → <strong>propan-2-ol</strong>.</p>
<p>HCN: propanal → <strong>2-hydroxybutanenitrile</strong> CH₃CH₂CH(OH)CN; propanone → <strong>2-hydroxy-2-methylpropanenitrile</strong> (CH₃)₂C(OH)CN. Both gain a carbon.</p></div>
<h2>Writing the NaBH₄ equation</h2>
<p>Use [H] for the reducing agent: an aldehyde or ketone gains two hydrogens. CH₃COCH₂CH₃ + 2[H] → CH₃CH(OH)CH₂CH₃ (butanone → butan-2-ol).</p>
${CY(Q('Why is HCN generated in the flask from NaCN and H₂SO₄ rather than used directly?','HCN is an extremely toxic gas; making it in solution as needed reduces the risk (the reaction is done in a fume cupboard).'),Q('A compound gives an orange precipitate with 2,4-DNP but no silver mirror with Tollens’ reagent. What is it?','A ketone.'),Q('What does Tollens’ reagent contain, and what happens to it with an aldehyde?','Ag⁺ in aqueous ammonia; Ag⁺ is reduced to silver metal (Ag⁺ + e⁻ → Ag) while the aldehyde is oxidised.'))}`;

X['6.1.3']=`
<h2>Comparing acidity</h2>
<p>Order of acidity: <strong>carboxylic acids > phenols > water > alcohols</strong>. Only carboxylic acids are strong enough to react with carbonates. Phenols react with NaOH but not with carbonates. Alcohols don't react with either.</p>
<h2>Improving ester yield</h2>
<p>Esterification from an acid and alcohol is reversible with K<sub>c</sub> about 4, so the yield is limited. It can be improved by using an excess of the cheaper reactant, removing the ester by distillation as it forms, or using an acyl chloride or acid anhydride instead (not reversible).</p>
<div class="wex"><p><strong>Worked example.</strong> Name and give the formula of the ester made from propanoic acid and methanol, and write the equation.</p>
<p>CH₃CH₂COOH + CH₃OH ⇌ CH₃CH₂COOCH₃ + H₂O. <strong>Methyl propanoate</strong>.</p></div>
<div class="wex"><p><strong>Worked example.</strong> Give the products of hydrolysing ethyl butanoate with (a) dilute H₂SO₄, (b) NaOH(aq).</p>
<p>(a) <strong>Butanoic acid and ethanol</strong> (reversible). (b) <strong>Sodium butanoate and ethanol</strong> (goes to completion).</p></div>
<h2>Why acyl chlorides are so reactive</h2>
<p>The carbonyl carbon is attached to both O and Cl, both highly electronegative, so it carries a large δ+ charge and is attacked easily by nucleophiles (water, alcohols, ammonia, amines). Cl⁻ is a good leaving group. The reactions are fast at room temperature and give HCl as a by-product.</p>
${CY(Q('Name CH₃CH₂COOCH₂CH₃.','Ethyl propanoate.'),Q('Why can a phenyl ester not be made by heating phenol with a carboxylic acid?','Phenol’s lone pair is partly delocalised into the ring, so it is a poor nucleophile; an acyl chloride or anhydride is needed.'),Q('Write the equation for ethanoyl chloride with ethylamine.','CH₃COCl + 2CH₃CH₂NH₂ → CH₃CONHCH₂CH₃ + CH₃CH₂NH₃⁺Cl⁻ (N-ethylethanamide).'))}`;

X['6.2.1']=`
<h2>How basic are amines?</h2>
<p>All amines are bases because of the lone pair on nitrogen. Aliphatic amines are slightly stronger bases than ammonia: alkyl groups push electron density onto the nitrogen, making its lone pair more available to accept a proton. Phenylamine is a much weaker base: the nitrogen's lone pair is partly delocalised into the benzene ring, so it is less available.</p>
<h2>The mechanism with ammonia</h2>
<ol>
<li>The lone pair on NH₃ attacks the δ+ carbon of the haloalkane; the C–X bond breaks and X⁻ leaves.</li>
<li>This gives an ammonium ion, RNH₃⁺.</li>
<li>A second NH₃ molecule removes H⁺ from RNH₃⁺, giving the amine RNH₂ and NH₄⁺.</li>
</ol>
<p>Because the amine product also has a lone pair, it can react with more haloalkane: RNH₂ + RX → R₂NH + HX, and so on to R₃N and R₄N⁺X⁻ (a quaternary ammonium salt, used in fabric softeners and detergents). Excess ammonia makes it most likely that each haloalkane meets an NH₃ molecule rather than an amine.</p>
<div class="wex"><p><strong>Worked example.</strong> Suggest how to make propylamine from 1-bromopropane, and name one by-product that might form.</p>
<p>Heat 1-bromopropane with <strong>excess ammonia in ethanol</strong>: CH₃CH₂CH₂Br + 2NH₃ → CH₃CH₂CH₂NH₂ + NH₄Br.</p>
<p>By-product: dipropylamine, (CH₃CH₂CH₂)₂NH, from further substitution.</p></div>
<div class="wex"><p><strong>Worked example.</strong> Give a two-step route from benzene to phenylamine.</p>
<p>1. Conc. HNO₃ / conc. H₂SO₄, 50 °C → nitrobenzene. 2. Sn / conc. HCl, heat under reflux, then NaOH(aq) → <strong>phenylamine</strong>.</p></div>
${CY(Q('Why is ethanolic rather than aqueous ammonia used to make amines from haloalkanes?','In water, hydroxide ions (and water) would substitute instead, forming an alcohol.'),Q('Write the equation for methylamine reacting with hydrochloric acid.','CH₃NH₂ + HCl → CH₃NH₃⁺Cl⁻ (methylammonium chloride).'),Q('Classify (CH₃)₂NH.','A secondary amine (dimethylamine).'))}`;

X['6.2.2']=`
<h2>Amino acids in more depth</h2>
<p>In solution, amino acids can exist as <strong>zwitterions</strong>: the –COOH donates H⁺ to the –NH₂ in the same molecule, giving ⁺H₃N–CHR–COO⁻, with both a positive and a negative charge. This is why amino acids are crystalline solids with high melting points (ionic attractions between zwitterions). You may meet zwitterions in context.</p>
<p>Two amino acids join with an <strong>amide (peptide) link</strong>, –CONH–, losing water, to form a <strong>dipeptide</strong>. Two different amino acids can form two different dipeptides, depending on which –COOH reacts with which –NH₂.</p>
<div class="wex"><p><strong>Worked example.</strong> Glycine (H₂NCH₂COOH) and alanine (H₂NCH(CH₃)COOH) react. Give the two possible dipeptides.</p>
<p>H₂NCH₂CO–NHCH(CH₃)COOH and H₂NCH(CH₃)CO–NHCH₂COOH.</p></div>
<h2>Spotting chiral centres in bigger molecules</h2>
<p>Check each carbon in turn. Ignore CH₃, CH₂ and any C in a C=C or C=O (they can't have four different groups). For each remaining carbon, list its four groups, looking all the way along each chain if two groups start the same.</p>
<div class="wex"><p><strong>Worked example.</strong> How many chiral centres are in 2-hydroxypropanoic acid (lactic acid), CH₃CH(OH)COOH?</p>
<p>Carbon 2 has H, OH, CH₃ and COOH: four different groups. <strong>One chiral centre</strong>, two optical isomers.</p></div>
<h2>Racemic mixtures in synthesis</h2>
<p>When a nucleophile attacks a planar group (such as C=O in nucleophilic addition) it can approach equally from either side, making a 50 : 50 mixture of the two optical isomers: a <strong>racemic mixture</strong>, which is optically inactive. Pharmaceutical synthesis often needs extra steps to separate them, or chiral catalysts to make only one.</p>
${CY(Q('Why does glycine have no optical isomers?','Its central carbon has two H atoms, so it does not have four different groups.'),Q('What is a racemic mixture?','A 50 : 50 mixture of two optical isomers; it does not rotate plane-polarised light.'),Q('What does an amino acid form with NaOH(aq)?','A sodium carboxylate salt: H₂NCH(R)COO⁻Na⁺ (and water).'))}`;

X['6.2.3']=`
<h2>Recognising the type of polymer</h2>
<ul>
<li>Main chain of only carbon atoms (C–C–C), side groups hanging off: <strong>addition polymer</strong> (from alkenes).</li>
<li>–COO– links in the main chain: <strong>polyester</strong>.</li>
<li>–CONH– links in the main chain: <strong>polyamide</strong> (or a protein).</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Nylon-6,6 is made from hexanedioic acid, HOOC(CH₂)₄COOH, and 1,6-diaminohexane, H₂N(CH₂)₆NH₂. Draw the repeat unit.</p>
<p>Remove OH from each acid end and H from each amine end, then join: <strong>–[OC(CH₂)₄CO–NH(CH₂)₆NH]–</strong>. Water is lost at each link (2 per repeat unit).</p></div>
<div class="wex"><p><strong>Worked example.</strong> A polyester has the repeat unit –[OCH(CH₃)CO]–. Identify the monomer.</p>
<p>Add OH to the C=O end and H to the O end: <strong>HOCH(CH₃)COOH, 2-hydroxypropanoic acid (lactic acid)</strong>. The polymer is poly(lactic acid).</p></div>
<h2>Advantages of condensation polymers</h2>
<p>Because they can be hydrolysed, polyesters and polyamides can be broken down by microorganisms or chemically recycled back to monomers. Poly(lactic acid) is made from renewable starch (corn), is biodegradable and compostable, and is used for packaging and dissolvable stitches. Kevlar's rigid chains and hydrogen bonding between chains make it extremely strong.</p>
${CY(Q('What small molecule is lost when a diacyl dichloride reacts with a diamine?','HCl.'),Q('Give the products of acid hydrolysis of nylon-6,6.','Hexanedioic acid and the ammonium salt of 1,6-diaminohexane, ⁺H₃N(CH₂)₆NH₃⁺.'),Q('Why are poly(alkenes) not biodegradable but polyesters can be?','Poly(alkenes) have only strong, non-polar C–C and C–H bonds; polyesters have polar ester links that can be hydrolysed.'))}`;

X['6.2.4']=`
<h2>Why chain length matters</h2>
<p>Many useful molecules (drugs, flavours, polymers) need specific carbon skeletons. Most simple reactions keep the number of carbons the same. Cyanide is the key: CN⁻ is a carbon nucleophile, so the new bond formed is C–C.</p>
<h2>Naming nitriles and hydroxynitriles</h2>
<ul>
<li>The C of –C≡N is carbon 1: CH₃CN is ethanenitrile; CH₃CH₂CH₂CN is butanenitrile.</li>
<li>Hydroxynitriles: CH₃CH(OH)CN is 2-hydroxypropanenitrile (OH on carbon 2, next to the nitrile carbon).</li>
</ul>
<h2>Mechanism reminder</h2>
<p>With a haloalkane, CN⁻ reacts by <strong>nucleophilic substitution</strong> (the lone pair on the carbon of CN⁻ attacks the δ+ carbon; C–X breaks). With a carbonyl, CN⁻ reacts by <strong>nucleophilic addition</strong> (attacks the δ+ carbonyl carbon; then O⁻ takes H⁺ from HCN or H⁺).</p>
<div class="wex"><p><strong>Worked example.</strong> Suggest a route from ethanal to 2-hydroxypropanoic acid (lactic acid).</p>
<p>1. HCN (NaCN / H₂SO₄) → 2-hydroxypropanenitrile, CH₃CH(OH)CN.</p>
<p>2. Dilute HCl, heat under reflux → <strong>CH₃CH(OH)COOH</strong>. (The product is racemic.)</p></div>
<div class="wex"><p><strong>Worked example.</strong> Suggest a route from benzene to 1-phenylethanol, C₆H₅CH(OH)CH₃.</p>
<p>1. Ethanoyl chloride + AlCl₃ (Friedel–Crafts acylation) → phenylethanone, C₆H₅COCH₃.</p>
<p>2. NaBH₄ → <strong>1-phenylethanol</strong>.</p></div>
${CY(Q('Name the product of 1-bromobutane with NaCN in ethanol.','Pentanenitrile, CH₃CH₂CH₂CH₂CN.'),Q('What is formed when propanenitrile is reduced with H₂ and a nickel catalyst?','Propylamine, CH₃CH₂CH₂NH₂.'),Q('Why is acylation often preferred to alkylation in Friedel–Crafts reactions?','The alkylbenzene product is more reactive than benzene and can be alkylated again (multiple substitution); acylation stops after one substitution.'))}`;

X['6.2.5']=`
<h2>Example preparation: aspirin</h2>
<ol>
<li>Warm salicylic acid (2-hydroxybenzoic acid) with ethanoic anhydride and a few drops of concentrated sulfuric or phosphoric acid catalyst; the phenol –OH is esterified.</li>
<li>Add cold water to destroy excess anhydride and crystallise the product; cool in ice.</li>
<li><strong>Filter under reduced pressure</strong> and wash with ice-cold water.</li>
<li><strong>Recrystallise</strong> from a minimum of hot ethanol/water; cool; filter; dry.</li>
<li>Weigh to find the yield; measure the <strong>melting point</strong> (aspirin about 136 °C).</li>
</ol>
<h2>Interpreting melting point results</h2>
<div class="wex"><p><strong>Worked example.</strong> Two samples of a product melt at 132–135 °C and 135–136 °C. The literature value is 136 °C. Which is purer?</p>
<p>The second: it melts over a narrow range close to the literature value. The first melts lower and over a wider range, showing impurities.</p></div>
<h2>Multi-functional molecules</h2>
<div class="wex"><p><strong>Worked example.</strong> A molecule contains a phenol group, a primary alcohol group and an ester group. Predict what happens with (a) NaOH(aq), cold; (b) NaOH(aq), heated under reflux; (c) acidified dichromate, reflux.</p>
<p>(a) The phenol is neutralised (phenoxide). (b) As (a), and the ester is hydrolysed to a carboxylate and an alcohol. (c) The primary alcohol is oxidised to a carboxylic acid; the phenol and ester don't react.</p></div>
<h2>Strategy for longer syntheses</h2>
<ul>
<li>Write out the reaction map from memory before the exam.</li>
<li>For aromatic targets, decide the order of substitutions: directing effects matter (–NO₂ directs to 3; –OH and –NH₂ to 2 and 4).</li>
<li>Count carbons at every step.</li>
<li>Check each step only changes what you intend: e.g. NaBH₄ reduces C=O in aldehydes and ketones but not in carboxylic acids or esters.</li>
</ul>
${CY(Q('Why is the minimum volume of hot solvent used in recrystallisation?','So the solution is saturated and as much product as possible crystallises out when it cools, maximising the yield.'),Q('Why are the crystals washed with ice-cold solvent?','To remove soluble impurities left on the surface without dissolving much of the product.'),Q('Suggest a two-step route from propan-1-ol to propyl propanoate.','Oxidise some propan-1-ol with excess acidified dichromate under reflux to propanoic acid; then react the acid with more propan-1-ol and conc. H₂SO₄ catalyst.'))}`;

X['6.3.1']=`
<h2>Why components separate</h2>
<p>In TLC the silica stationary phase is polar (it has –OH groups on its surface). A polar compound adsorbs more strongly, spends more time stuck to the silica, and moves a shorter distance: low R<sub>f</sub>. A non-polar compound spends more time dissolved in a non-polar solvent and moves further: high R<sub>f</sub>. Changing the solvent changes all the R<sub>f</sub> values.</p>
<h2>Using TLC in practice</h2>
<ul>
<li><strong>Checking purity</strong>: a pure product gives one spot.</li>
<li><strong>Following a reaction</strong>: spot the starting material, the reaction mixture and a co-spot; when the starting-material spot disappears from the mixture lane, the reaction is complete.</li>
<li><strong>Identifying a compound</strong>: compare with a known sample run on the same plate (same R<sub>f</sub>).</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> In a TLC experiment the solvent front moved 8.0 cm. Spot A moved 2.4 cm and spot B 6.0 cm. Find their R<sub>f</sub> values and say which is more polar.</p>
$$R_f(\\mathrm{A})=\\dfrac{2.4}{8.0}=\\mathbf{0.30}$$$$ R_f(\\mathrm{B})=\\dfrac{6.0}{8.0}=\\mathbf{0.75}$$<p>A is more polar (more strongly adsorbed on silica).</p></div>
<h2>Gas chromatography: quantitative use</h2>
<div class="wex"><p><strong>Worked example.</strong> A GC of a mixture of ethanol, propan-1-ol and butan-1-ol shows peak areas 1.2, 2.4 and 0.4 cm². Find the percentage of propan-1-ol.</p>
$$\\%\\ \\text{propan-1-ol}=\\dfrac{2.4}{1.2+2.4+0.4}\\times 100=\\mathbf{60\\,\\%}$$
<p>To identify which peak is which, inject each pure compound separately under the same conditions and compare retention times (or use GC–MS).</p></div>
<p>Limitations: similar compounds may have very similar retention times; unknown compounds may have no reference to compare against. GC–MS solves this by giving a mass spectrum for each peak.</p>
${CY(Q('Why is the baseline drawn in pencil, not ink?','Ink would dissolve in the solvent and move up the plate, giving extra spots.'),Q('Name the stationary and mobile phases in gas chromatography.','Stationary: a high-boiling liquid on a solid support in the column. Mobile: an inert carrier gas such as helium or nitrogen.'),Q('Give the test for a carboxylic acid that phenols don’t pass.','Add sodium carbonate (or hydrogencarbonate) solution: carboxylic acids fizz (CO₂); phenols don’t react.'))}`;

window.SPEC.topics.forEach(t=>{ if(X[t.id]) t.notes+=X[t.id]; });
})();
