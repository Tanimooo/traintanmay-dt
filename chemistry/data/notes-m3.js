/* Full topic notes, Module 3: Periodic table and energy. Replace the short notes in m3.js (loaded after it). */
(function(){
const N={};

N['3.1.1']=`
<h2>The periodic table</h2>
<p>Elements are arranged in order of increasing <strong>atomic number</strong>. Elements in the same <strong>group</strong> (column) have the same outer-shell electron configuration, so they have similar chemical properties. Each <strong>period</strong> (row) is a new shell being filled. Mendeleev arranged elements by properties and left gaps for undiscovered elements, predicting their properties; this is why the table "works".</p>
<p>Elements are also classified by <strong>block</strong>: s, p or d, depending on the sub-shell their highest-energy electron is in (see 2.2.1). <strong>Periodicity</strong> is the repeating pattern of physical and chemical properties across each period.</p>

<h2>Ionisation energy</h2>
<p>The <strong>first ionisation energy</strong> is the energy required to remove one electron from each atom in one mole of gaseous atoms of an element, to form one mole of gaseous 1+ ions.</p>
<div class="rxn">Na(g) → Na⁺(g) + e⁻ &nbsp;&nbsp; ΔH = +496 kJ mol⁻¹</div>
<p>It is always endothermic (positive): energy is needed to pull an electron away from the nucleus. Three factors decide its size:</p>
<ul>
<li><strong>Nuclear charge</strong>: more protons, stronger attraction, higher ionisation energy.</li>
<li><strong>Atomic radius</strong>: an outer electron further from the nucleus is attracted less strongly.</li>
<li><strong>Shielding</strong>: inner shells of electrons repel the outer electron and reduce the nuclear attraction it feels.</li>
</ul>
<h3>Successive ionisation energies</h3>
<p>The second ionisation energy removes an electron from a 1+ ion: Na⁺(g) → Na²⁺(g) + e⁻. Each successive ionisation energy is larger, because the electron is removed from an increasingly positive ion, which is also smaller. A <strong>big jump</strong> shows that the next electron comes from a shell closer to the nucleus.</p>
<div class="wex"><p><strong>Worked example.</strong> The first five ionisation energies of an element (kJ mol⁻¹) are 578, 1817, 2745, 11 577, 14 842. Which group is it in?</p>
<p>The big jump is between the 3rd and 4th: three electrons are in the outer shell. It is in <strong>Group 13</strong> (it's aluminium).</p></div>

<h3>Trends in first ionisation energy</h3>
<p><strong>Down a group: decreases.</strong> The atomic radius increases and there are more inner shells shielding, so the outer electron is held less strongly. This outweighs the increase in nuclear charge.</p>
<p><strong>Across a period: generally increases.</strong> Nuclear charge increases, the electrons are added to the same shell so shielding is similar, and the atomic radius decreases. The outer electrons are held more tightly.</p>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="First ionisation energies across periods 2 and 3, rising with dips at groups 13 and 16">
<line class="ax" x1="40" y1="190" x2="510" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="15" marker-end="url(#ah)"/>
<polyline class="c1" points="60,175 85,140 110,150 135,110 160,85 185,95 210,60 235,30"/>
<polyline class="c2" points="275,180 300,155 325,170 350,145 375,130 400,135 425,108 450,85"/>
<g class="small"><text x="55" y="205">Li</text><text x="80" y="205">Be</text><text x="105" y="205">B</text><text x="130" y="205">C</text><text x="155" y="205">N</text><text x="180" y="205">O</text><text x="205" y="205">F</text><text x="228" y="205">Ne</text>
<text x="268" y="205">Na</text><text x="293" y="205">Mg</text><text x="320" y="205">Al</text><text x="345" y="205">Si</text><text x="372" y="205">P</text><text x="397" y="205">S</text><text x="420" y="205">Cl</text><text x="445" y="205">Ar</text>
<text x="48" y="25">1st IE</text><text x="100" y="145" class="lbl1">B dip</text><text x="180" y="110" class="lbl1">O dip</text></g>
</svg>
<p>There is a big drop from the noble gas at the end of one period to the Group 1 element at the start of the next: the outer electron is now in a new shell, further out and more shielded. Within a period there are two small dips:</p>
<ul>
<li><strong>Group 2 → Group 13</strong> (Be → B, Mg → Al): the outer electron of B is in a 2p sub-shell, which is higher in energy than 2s (and slightly further out, more shielded), so it is easier to remove.</li>
<li><strong>Group 15 → Group 16</strong> (N → O, P → S): in oxygen, the fourth 2p electron has to <strong>pair up</strong> in an orbital that already has an electron. The repulsion between the paired electrons makes one of them easier to remove.</li>
</ul>

<h2>Structure and bonding across a period</h2>
<h3>Metallic bonding</h3>
<p><strong>Metallic bonding</strong> is the strong electrostatic attraction between positive metal ions (cations) and <strong>delocalised electrons</strong>. The metal is a giant metallic lattice: a regular arrangement of cations in a "sea" of electrons that can move through the whole structure.</p>
<ul>
<li><strong>High melting points</strong>: strong attraction between cations and delocalised electrons throughout the lattice.</li>
<li><strong>Good electrical conductors</strong> (solid and liquid): the delocalised electrons can move and carry charge.</li>
<li><strong>Malleable and ductile</strong>: layers of ions can slide over each other while the delocalised electrons still hold them together.</li>
<li>Insoluble (except by reacting with water, as Group 1 metals do).</li>
</ul>
<h3>Giant covalent lattices</h3>
<p>Many atoms joined by strong covalent bonds in a continuous network. Diamond, graphite, graphene (carbon) and silicon.</p>
<ul>
<li><strong>Diamond</strong> and <strong>silicon</strong>: each atom covalently bonded to four others in a tetrahedral network. Very high melting point (many strong covalent bonds must break), very hard, no free electrons so no conduction (silicon is a semiconductor).</li>
<li><strong>Graphite</strong>: each carbon bonded to three others in flat hexagonal layers; the fourth electron is delocalised across the layer. Layers are held by weak London forces. Very high melting point; conducts electricity along the layers; soft and slippery because layers slide.</li>
<li><strong>Graphene</strong>: a single layer of graphite, one atom thick. Very strong, conducts electricity extremely well, transparent and light.</li>
</ul>
<p>Giant covalent substances are insoluble in all solvents: the covalent bonds are too strong to be broken by solvent interactions.</p>
<h3>Melting points across periods 2 and 3</h3>
<div class="tbl"><table><tr><th>Period 3</th><th>Na</th><th>Mg</th><th>Al</th><th>Si</th><th>P₄</th><th>S₈</th><th>Cl₂</th><th>Ar</th></tr>
<tr><td>Structure</td><td colspan="3">giant metallic</td><td>giant covalent</td><td colspan="4">simple molecular</td></tr>
<tr><td>m.p. / °C</td><td>98</td><td>650</td><td>660</td><td>1410</td><td>44</td><td>113</td><td>−101</td><td>−189</td></tr></table></div>
<ul>
<li><strong>Na → Al</strong>: rises. The ions have increasing charge (+1, +2, +3) and decreasing size, and there are more delocalised electrons per atom, so the metallic bonding gets stronger.</li>
<li><strong>Si</strong>: highest, because melting means breaking many strong covalent bonds in a giant lattice.</li>
<li><strong>P₄, S₈, Cl₂, Ar</strong>: low, because only weak London forces between molecules are overcome. S₈ is highest of these because it has the most electrons (strongest London forces), then P₄, Cl₂ and Ar.</li>
</ul>
<p>Period 2 follows the same pattern: Li and Be (giant metallic), B and C (giant covalent, very high), N₂, O₂, F₂, Ne (simple molecular, very low).</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> explaining ionisation energy trends always needs the three factors: nuclear charge, distance (atomic radius), shielding. For the dips, name the sub-shell (2p is higher in energy than 2s) or say "paired electrons in the same orbital repel".</p></blockquote>
`;

N['3.1.2']=`
<h2>Group 2: the alkaline earth metals</h2>
<p>Be, Mg, Ca, Sr, Ba. Each has two electrons in its outer s sub-shell (ns²). In reactions they lose those two electrons to form <strong>2+ ions</strong>, so they are <strong>reducing agents</strong>: they are oxidised from 0 to +2.</p>
<h3>Reactivity increases down the group</h3>
<p>Going down, atoms get bigger and the outer electrons are more shielded, so the <strong>first and second ionisation energies decrease</strong>. The outer electrons are lost more easily, so the elements react more vigorously.</p>

<h2>Redox reactions</h2>
<h3>With oxygen</h3>
<div class="rxn">2Mg(s) + O₂(g) → 2MgO(s)</div>
<p>Burning magnesium gives a brilliant white flame. Oxidation numbers: Mg 0 → +2 (oxidised), O 0 → −2 (reduced).</p>
<h3>With water</h3>
<p>Group 2 metals react with water to form a <strong>hydroxide</strong> and <strong>hydrogen</strong>. Reactivity increases down the group: Mg reacts only very slowly with cold water; Ca, Sr and Ba react increasingly vigorously.</p>
<div class="rxn">Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)</div>
<p>Magnesium reacts with steam to form the oxide: Mg(s) + H₂O(g) → MgO(s) + H₂(g).</p>
<h3>With dilute acids</h3>
<div class="rxn">Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)</div>
<p>With sulfuric acid, the reaction slows and stops for Ca, Sr and Ba because their sulfates are insoluble and coat the metal.</p>

<h2>Oxides and hydroxides</h2>
<p>Group 2 oxides react with water to form hydroxides, releasing OH⁻ ions:</p>
<div class="rxn">CaO(s) + H₂O(l) → Ca(OH)₂(aq) → Ca²⁺(aq) + 2OH⁻(aq)</div>
<p>The <strong>solubility of the hydroxides increases down the group</strong>: Mg(OH)₂ is only slightly soluble, Ba(OH)₂ dissolves well. So the solutions are <strong>more alkaline</strong> further down: a saturated Mg(OH)₂ solution has pH about 10, Ba(OH)₂ about 13.</p>
<h2>Uses of Group 2 compounds as bases</h2>
<ul>
<li><strong>Calcium hydroxide</strong> (slaked lime) is used in agriculture to <strong>neutralise acidic soils</strong>: Ca(OH)₂ + 2H⁺ → Ca²⁺ + 2H₂O.</li>
<li><strong>Magnesium hydroxide</strong> (milk of magnesia) and <strong>calcium carbonate</strong> are used as <strong>antacids</strong> to neutralise excess stomach acid (HCl):<br>Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O<br>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> when you explain why reactivity increases down Group 2, link it to ionisation energy: atomic radius and shielding increase, so less energy is needed to remove the outer electrons. Then say that the metal loses electrons more easily.</p></blockquote>
`;

N['3.1.3']=`
<h2>Group 17: the halogens</h2>
<p>F₂, Cl₂, Br₂, I₂ exist as <strong>diatomic molecules</strong>. Each atom has seven outer electrons (ns² np⁵) and needs one more, so the halogens are <strong>oxidising agents</strong>: they gain one electron to form 1− halide ions, and are themselves reduced.</p>
<div class="tbl"><table><tr><th>Halogen</th><th>State at RTP</th><th>Colour of element</th><th>In water</th><th>In cyclohexane</th></tr>
<tr><td>Cl₂</td><td>gas</td><td>pale green</td><td>pale green</td><td>pale green</td></tr>
<tr><td>Br₂</td><td>liquid</td><td>red-brown</td><td>orange</td><td>orange</td></tr>
<tr><td>I₂</td><td>solid</td><td>shiny grey-black</td><td>brown</td><td>violet</td></tr></table></div>
<h3>Boiling points increase down the group</h3>
<p>Down the group the molecules have <strong>more electrons</strong>, so the <strong>London forces</strong> between molecules are stronger, and more energy is needed to overcome them. That's why the state changes from gas to liquid to solid.</p>

<h2>Reactivity decreases down the group</h2>
<p>Down the group, atomic radius and shielding increase, so the nucleus attracts an incoming electron less strongly. The halogen gains an electron less easily: <strong>oxidising power decreases</strong> down the group.</p>
<h3>Displacement reactions</h3>
<p>A more reactive halogen oxidises the halide ions of a less reactive halogen, displacing it. Add a few drops of the halogen solution to the halide solution; then add cyclohexane and shake to see the colour more clearly in the organic (top) layer.</p>
<div class="tbl"><table><tr><th>Add →</th><th>KCl(aq)</th><th>KBr(aq)</th><th>KI(aq)</th></tr>
<tr><td>Cl₂(aq)</td><td>no reaction</td><td>orange (Br₂)</td><td>brown; violet in cyclohexane (I₂)</td></tr>
<tr><td>Br₂(aq)</td><td>no reaction</td><td>no reaction</td><td>brown; violet in cyclohexane (I₂)</td></tr>
<tr><td>I₂(aq)</td><td>no reaction</td><td>no reaction</td><td>no reaction</td></tr></table></div>
<div class="rxn">Cl₂(aq) + 2Br⁻(aq) → 2Cl⁻(aq) + Br₂(aq)</div>
<p>Chlorine is reduced (0 → −1); bromide is oxidised (−1 → 0).</p>

<h2>Disproportionation</h2>
<p><strong>Disproportionation</strong> is a redox reaction in which the <strong>same element is both oxidised and reduced</strong>.</p>
<h3>Chlorine and water</h3>
<div class="rxn">Cl₂(aq) + H₂O(l) ⇌ HCl(aq) + HClO(aq)</div>
<p>Chlorine goes from 0 to −1 in HCl (reduced) and from 0 to +1 in HClO, chloric(I) acid (oxidised). In sunlight a different reaction happens: 2Cl₂ + 2H₂O → 4HCl + O₂.</p>
<p><strong>Water treatment:</strong> chlorine is added to drinking water to kill bacteria (HClO and ClO⁻ are the active agents). Benefits: it prevents water-borne diseases such as cholera, and a residual amount keeps working through the pipes. Risks: chlorine is toxic, and it can react with organic matter in water to form chlorinated hydrocarbons, some of which may cause cancer. The public-health benefit is judged to far outweigh the risk.</p>
<h3>Chlorine and cold, dilute sodium hydroxide</h3>
<div class="rxn">Cl₂(aq) + 2NaOH(aq) → NaCl(aq) + NaClO(aq) + H₂O(l)</div>
<p>Chlorine goes from 0 to −1 (NaCl) and 0 to +1 (NaClO). The solution of sodium chlorate(I), NaClO, is <strong>bleach</strong>.</p>

<h2>Testing for halide ions</h2>
<p>Add <strong>dilute nitric acid</strong> first (to remove carbonate ions, which would also give a precipitate), then <strong>silver nitrate solution</strong>:</p>
<div class="rxn">Ag⁺(aq) + X⁻(aq) → AgX(s)</div>
<div class="tbl"><table><tr><th>Halide</th><th>Precipitate</th><th>Dilute NH₃(aq)</th><th>Concentrated NH₃(aq)</th></tr>
<tr><td>Cl⁻</td><td>white AgCl</td><td>dissolves</td><td>dissolves</td></tr>
<tr><td>Br⁻</td><td>cream AgBr</td><td>does not dissolve</td><td>dissolves</td></tr>
<tr><td>I⁻</td><td>yellow AgI</td><td>does not dissolve</td><td>does not dissolve</td></tr></table></div>
<p>The ammonia step confirms the identity, because the white, cream and yellow colours can be hard to tell apart. Don't acidify with HCl: it adds chloride ions.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> for disproportionation, give the oxidation numbers of the element in every species: "chlorine is oxidised from 0 to +1 in HClO and reduced from 0 to −1 in HCl".</p></blockquote>
`;

N['3.1.4']=`
<h2>Qualitative analysis: identifying ions</h2>
<p>Qualitative analysis means finding out <em>what</em> is present, rather than how much. At AS you need tests for four anions and one cation; transition metal cations are added in 5.3.2.</p>
<h3>Carbonate ions, CO₃²⁻</h3>
<p>Add a dilute acid (dilute nitric acid). <strong>Effervescence</strong> (fizzing); bubble the gas through <strong>limewater</strong>, which turns <strong>milky</strong> (cloudy white) because CO₂ forms a precipitate of CaCO₃.</p>
<div class="rxn">CO₃²⁻(aq) + 2H⁺(aq) → CO₂(g) + H₂O(l)<br>Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) + H₂O(l)</div>
<h3>Sulfate ions, SO₄²⁻</h3>
<p>Add <strong>barium chloride</strong> or <strong>barium nitrate</strong> solution: a <strong>white precipitate</strong> of barium sulfate.</p>
<div class="rxn">Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)</div>
<h3>Halide ions, Cl⁻, Br⁻, I⁻</h3>
<p>Add dilute nitric acid, then <strong>silver nitrate</strong>: white AgCl, cream AgBr, yellow AgI, confirmed with ammonia solution (see 3.1.3).</p>
<h3>Ammonium ions, NH₄⁺</h3>
<p>Add <strong>sodium hydroxide</strong> solution and <strong>warm</strong> gently. Ammonia gas is released, which turns <strong>damp red litmus paper blue</strong>.</p>
<div class="rxn">NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)</div>

<h2>The correct order</h2>
<p>When a solution might contain several anions, the tests must be done in this order: <strong>carbonate → sulfate → halide</strong>.</p>
<ul>
<li>Carbonate ions form a white precipitate with barium ions (BaCO₃) and with silver ions (Ag₂CO₃), so they would give a false positive in the sulfate and halide tests. Test for carbonate first by adding dilute HNO₃ until there's no more fizzing; this also removes the carbonate.</li>
<li>Sulfate ions form a slightly soluble precipitate with silver ions (Ag₂SO₄), so test for sulfate before halides. If sulfate is present, add excess Ba(NO₃)₂, filter off the BaSO₄, then test the filtrate for halides.</li>
<li>Use <strong>nitric acid</strong> and <strong>barium nitrate</strong>, not HCl or BaCl₂, if you will later test for halides, so you don't add chloride ions yourself.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A white solid dissolves in water. With dilute HNO₃ there is no effervescence; with Ba(NO₃)₂(aq) a white precipitate forms; with NaOH(aq) on warming, a gas turns damp red litmus blue. Identify the solid.</p>
<p>No carbonate. Sulfate present. Ammonium present. The solid is <strong>ammonium sulfate, (NH₄)₂SO₄</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> give observations, not conclusions, when asked what you would see: "a white precipitate", "effervescence; the gas turns limewater milky", not "sulfate is present".</p></blockquote>
`;

N['3.2.1']=`
<h2>Enthalpy and enthalpy changes</h2>
<p><strong>Enthalpy, H</strong>, is the heat energy stored in a chemical system. We can't measure H itself, only the <strong>enthalpy change ΔH</strong> when a reaction happens at constant pressure.</p>
<ul>
<li><strong>Exothermic</strong>: energy is transferred <em>to</em> the surroundings; the temperature of the surroundings rises; <strong>ΔH is negative</strong>. Combustion, neutralisation, respiration.</li>
<li><strong>Endothermic</strong>: energy is taken <em>in</em> from the surroundings; the surroundings cool; <strong>ΔH is positive</strong>. Thermal decomposition, photosynthesis, dissolving ammonium nitrate.</li>
</ul>
<h3>Enthalpy profile diagrams</h3>
<svg class="diagram" viewBox="0 0 560 220" role="img" aria-label="Enthalpy profile diagrams for an exothermic and an endothermic reaction with activation energy marked">
<g><line class="ax" x1="30" y1="190" x2="250" y2="190" marker-end="url(#ah)"/><line class="ax" x1="30" y1="190" x2="30" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 90 H90 Q140 20 190 150 H240"/><line class="dimline dash" x1="90" y1="90" x2="250" y2="90"/>
<line class="dimline" x1="230" y1="92" x2="230" y2="148" marker-end="url(#ahs)"/><text x="190" y="125" class="small">ΔH −</text>
<line class="dimline" x1="110" y1="88" x2="110" y2="48" marker-end="url(#ahs)"/><text x="115" y="70" class="small">Ea</text>
<text x="40" y="82" class="small">reactants</text><text x="185" y="168" class="small">products</text><text x="34" y="30" class="small">H</text><text x="80" y="210" class="small">exothermic</text></g>
<g transform="translate(290 0)"><line class="ax" x1="30" y1="190" x2="250" y2="190" marker-end="url(#ah)"/><line class="ax" x1="30" y1="190" x2="30" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 150 H90 Q140 20 190 90 H240"/><line class="dimline dash" x1="90" y1="150" x2="250" y2="150"/>
<line class="dimline" x1="230" y1="148" x2="230" y2="92" marker-end="url(#ahs)"/><text x="195" y="125" class="small">ΔH +</text>
<line class="dimline" x1="110" y1="148" x2="110" y2="50" marker-end="url(#ahs)"/><text x="115" y="100" class="small">Ea</text>
<text x="40" y="142" class="small">reactants</text><text x="185" y="82" class="small">products</text><text x="34" y="30" class="small">H</text><text x="80" y="210" class="small">endothermic</text></g>
</svg>
<p>The <strong>activation energy, E<sub>a</sub></strong>, is the minimum energy required for a reaction to take place: the energy needed to start breaking bonds. It is shown as the height of the hump above the reactants.</p>

<h2>Standard enthalpy changes</h2>
<p>Enthalpy changes depend on conditions, so they are quoted under <strong>standard conditions</strong>: <strong>100 kPa</strong> pressure, a stated temperature (usually <strong>298 K</strong>), solutions at <strong>1 mol dm⁻³</strong>, and every substance in its <strong>standard state</strong> (its physical state under those conditions). The symbol is ΔH<sup>⦵</sup>.</p>
<ul>
<li><strong>Standard enthalpy change of reaction, Δ<sub>r</sub>H<sup>⦵</sup></strong>: the enthalpy change when the reaction occurs in the molar quantities shown in the equation, under standard conditions.</li>
<li><strong>Standard enthalpy change of formation, Δ<sub>f</sub>H<sup>⦵</sup></strong>: the enthalpy change when <strong>one mole</strong> of a compound is formed <strong>from its elements</strong> under standard conditions, all in their standard states. e.g. 2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l). Δ<sub>f</sub>H of an element in its standard state is zero by definition.</li>
<li><strong>Standard enthalpy change of combustion, Δ<sub>c</sub>H<sup>⦵</sup></strong>: the enthalpy change when <strong>one mole</strong> of a substance reacts completely with oxygen under standard conditions. e.g. CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l). Always negative.</li>
<li><strong>Standard enthalpy change of neutralisation, Δ<sub>neut</sub>H<sup>⦵</sup></strong>: the enthalpy change when an acid and a base react to form <strong>one mole of water</strong> under standard conditions. About −57 kJ mol⁻¹ for any strong acid with a strong base.</li>
</ul>

<h2>Measuring enthalpy changes: calorimetry</h2>
<p>The energy transferred is calculated from the temperature change of a known mass of water or solution:</p>
<div class="eqgrid"><div>$$q=mc\\Delta T$$</div><div>$$\\Delta H=-\\dfrac{q}{n}$$</div></div>
<ul>
<li>q = energy transferred (J); m = mass of the <strong>water or solution</strong> being heated (g), taking 1 cm³ = 1 g; c = 4.18 J g⁻¹ K⁻¹; ΔT = temperature change (K, same size as °C).</li>
<li>Divide by moles of the limiting reactant (or of water formed, for neutralisation), convert J to kJ, and add the sign: <strong>negative if the temperature rose</strong>.</li>
</ul>
<div class="wex"><p><strong>Worked example (combustion).</strong> Burning 0.460 g of ethanol (M = 46.0) heats 200 g of water from 20.0 °C to 34.5 °C. Calculate Δ<sub>c</sub>H.</p>
$$q=mc\\Delta T=200\\times 4.18\\times 14.5=12\\,122\\ \\text{J}=12.1\\ \\text{kJ}$$$$n(\\text{ethanol})=\\dfrac{0.460}{46.0}=0.0100\\ \\text{mol}$$
$$\\Delta_c H=-\\dfrac{q}{n}=-\\dfrac{12.1}{0.0100}=\\mathbf{-1210}\\ \\text{kJ mol}^{-1}$$<p>The data-book value is −1367 kJ mol⁻¹: the experimental value is less exothermic because heat is lost to the surroundings, combustion is incomplete, and the calorimeter itself is heated.</p></div>
<div class="wex"><p><strong>Worked example (in solution).</strong> 50.0 cm³ of 1.00 mol dm⁻³ HCl is mixed with 50.0 cm³ of 1.00 mol dm⁻³ NaOH. The temperature rises by 6.8 K. Calculate Δ<sub>neut</sub>H.</p>
<p>The mass heated is the total volume of solution, 100 g.</p>$$q=mc\\Delta T=100\\times 4.18\\times 6.8=2842\\ \\text{J}$$$$ n(\\mathrm{H_2O})=0.0500\\ \\text{mol}$$
$$\\Delta_{neut}H=-\\dfrac{q}{n}=-\\dfrac{2.842}{0.0500}=\\mathbf{-56.8}\\ \\text{kJ mol}^{-1}$$</div>
<p>For reactions in solution, use a polystyrene cup with a lid. To correct for heat loss, record the temperature for a few minutes before mixing and for several minutes after, plot temperature against time, and <strong>extrapolate</strong> the cooling line back to the time of mixing to find the true maximum ΔT.</p>

<h2>Bond enthalpies</h2>
<p><strong>Average bond enthalpy</strong> is the energy required to break one mole of a specified type of bond in a gaseous molecule, averaged over many different compounds. Breaking bonds is <strong>endothermic</strong>; making bonds is <strong>exothermic</strong>. A reaction is exothermic overall if more energy is released making new bonds than is needed to break the old ones.</p>
<div class="eqgrid"><div>$$\\Delta H=\\bigsum(\\text{bonds broken})-\\bigsum(\\text{bonds made})$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> Use bond enthalpies to find ΔH for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g). C–H 413, O=O 498, C=O 805, O–H 464 kJ mol⁻¹.</p>
<p>Bonds broken:</p>$$4(\\mathrm{C{-}H})+2(\\mathrm{O{=}O})=4(413)+2(498)=1652+996=2648\\ \\text{kJ}$$
<p>Bonds made:</p>$$2(\\mathrm{C{=}O})+4(\\mathrm{O{-}H})=2(805)+4(464)=1610+1856=3466\\ \\text{kJ}$$
$$\\Delta H=\\bigsum(\\text{broken})-\\bigsum(\\text{made})=2648-3466=\\mathbf{-818}\\ \\text{kJ mol}^{-1}$$</div>
<p>Values from bond enthalpies differ from data-book values because they are <strong>averages</strong>: the actual strength of a bond depends on its environment in a particular molecule. Also, bond enthalpies apply only to gases, so they can't account for a product being a liquid (like water).</p>

<h2>Hess' law</h2>
<p><strong>Hess' law</strong>: the enthalpy change of a reaction is <strong>independent of the route</strong> taken (as long as the start and finish are the same). So we can calculate enthalpy changes that can't be measured directly, by going round a cycle.</p>
<h3>Using enthalpy changes of formation</h3>
<p>Build a cycle with the <strong>elements at the bottom</strong>, both arrows pointing up to reactants and products.</p>
<div class="eqgrid"><div>$$\\Delta_r H=\\bigsum\\Delta_f H(\\text{products})-\\bigsum\\Delta_f H(\\text{reactants})$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> Find Δ<sub>r</sub>H for C₂H₄(g) + H₂O(g) → C₂H₅OH(g). Δ<sub>f</sub>H: C₂H₄ +52, H₂O(g) −242, C₂H₅OH(g) −235 kJ mol⁻¹.</p>
$$\\Delta_r H=\\bigsum\\Delta_f H(\\text{products})-\\bigsum\\Delta_f H(\\text{reactants})$$$$=(-235)-\\big[52+(-242)\\big]=-235-(-190)=\\mathbf{-45}\\ \\text{kJ mol}^{-1}$$</div>
<h3>Using enthalpy changes of combustion</h3>
<p>Build a cycle with the <strong>combustion products (CO₂ and H₂O) at the bottom</strong>, both arrows pointing down.</p>
<div class="eqgrid"><div>$$\\Delta_r H=\\bigsum\\Delta_c H(\\text{reactants})-\\bigsum\\Delta_c H(\\text{products})$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> Find Δ<sub>f</sub>H of methane, C(s) + 2H₂(g) → CH₄(g). Δ<sub>c</sub>H: C −394, H₂ −286, CH₄ −890 kJ mol⁻¹.</p>
$$\\Delta_f H=\\bigsum\\Delta_c H(\\text{reactants})-\\bigsum\\Delta_c H(\\text{products})$$$$=\\big[-394+2(-286)\\big]-(-890)=-966+890=\\mathbf{-76}\\ \\text{kJ mol}^{-1}$$
<p>This can't be measured directly: carbon and hydrogen don't react cleanly to form only methane.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> the most common calorimetry errors are: using the mass of the fuel for m (it must be the water), forgetting the negative sign for an exothermic change, and not converting J to kJ. Write all three steps out.</p></blockquote>
`;

N['3.2.2']=`
<h2>Rate of reaction</h2>
<p>The <strong>rate of reaction</strong> is the change in concentration (or amount) of a reactant or product per unit time, in mol dm⁻³ s⁻¹. On a graph of amount of product against time, the rate is the <strong>gradient</strong>; it is fastest at the start and falls to zero as reactants are used up. To find the rate at a particular time, draw a <strong>tangent</strong> to the curve and measure its gradient.</p>
<h3>Measuring rate</h3>
<ul>
<li><strong>Volume of gas</strong> with a gas syringe or by collecting over water, at regular time intervals.</li>
<li><strong>Loss of mass</strong> on a balance as a gas escapes (works best with a dense gas like CO₂).</li>
<li><strong>Colour change</strong> or precipitate (timing how long until a cross under the flask disappears), or with a colorimeter.</li>
</ul>

<h2>Collision theory</h2>
<p>For particles to react they must <strong>collide</strong>, with the correct <strong>orientation</strong>, and with at least the <strong>activation energy</strong>. Most collisions don't result in a reaction. Anything that increases the frequency of <em>successful</em> collisions increases the rate.</p>
<ul>
<li><strong>Concentration</strong> (or pressure for gases): more particles in the same volume, so <strong>more frequent collisions</strong>. More collisions per second exceed E<sub>a</sub>.</li>
<li><strong>Surface area</strong> of a solid: more particles exposed, so more frequent collisions.</li>
<li><strong>Temperature</strong>: see the Boltzmann distribution below. This is the most important effect.</li>
<li><strong>Catalyst</strong>: provides a route with lower E<sub>a</sub>.</li>
</ul>

<h2>Catalysts</h2>
<p>A <strong>catalyst</strong> increases the rate of a reaction without being used up, by providing an <strong>alternative reaction pathway with a lower activation energy</strong>. More particles then have energy ≥ E<sub>a</sub>.</p>
<ul>
<li><strong>Homogeneous</strong>: the catalyst is in the <strong>same phase</strong> as the reactants. It reacts to form an intermediate, which then breaks down to give the product and regenerate the catalyst. Example: H₂SO₄ in esterification; Cl• radicals in ozone depletion.</li>
<li><strong>Heterogeneous</strong>: the catalyst is in a <strong>different phase</strong> (usually a solid with gases). Reactants adsorb onto its surface, react, and the products desorb. Examples: iron in the Haber process; nickel in hydrogenating alkenes; platinum, palladium and rhodium in catalytic converters.</li>
</ul>
<h3>Why catalysts matter</h3>
<p>Catalysts let industrial reactions run at lower temperatures, so they use less energy and burn less fossil fuel, which cuts costs and CO₂ emissions. They can make a reaction more selective, increasing atom economy and reducing waste. Catalytic converters remove toxic CO, NO<sub>x</sub> and unburnt hydrocarbons from car exhausts. Catalysts can be "poisoned" by impurities that bind to their surface.</p>

<h2>The Boltzmann distribution</h2>
<p>In a gas, molecules have a range of energies. The <strong>Boltzmann distribution</strong> shows how many molecules have each energy.</p>
<svg class="diagram" viewBox="0 0 460 230" role="img" aria-label="Boltzmann distribution at two temperatures; the higher temperature curve is flatter, peaks further right and has more molecules above the activation energy">
<line class="ax" x1="40" y1="190" x2="440" y2="190" marker-end="url(#ah)"/><line class="ax" x1="40" y1="190" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="fillsoft" d="M300 190 L300 170 Q350 178 430 184 L430 190 Z"/>
<path class="c1" d="M40 190 Q90 30 150 60 Q230 110 300 160 Q360 182 430 186"/>
<path class="c2 dash" d="M40 190 Q120 70 190 90 Q260 115 300 140 Q360 170 430 180"/>
<line class="dimline dash" x1="300" y1="200" x2="300" y2="40"/><text x="292" y="35" class="small">Ea</text>
<line class="dimline dash" x1="230" y1="190" x2="230" y2="60"/><text x="214" y="56" class="small">Ea(cat)</text>
<text x="120" y="50" class="small lbl1">T₁</text><text x="200" y="85" class="small lbl2">T₂ (higher)</text>
<text x="360" y="208" class="small">energy</text><text x="46" y="30" class="small">number of molecules</text>
</svg>
<ul>
<li>The curve starts at the <strong>origin</strong>: no molecules have zero energy.</li>
<li>The area under the curve is the <strong>total number of molecules</strong>.</li>
<li>The curve <strong>never touches the x-axis</strong> at high energy: there is no maximum energy.</li>
<li>Only the molecules to the right of E<sub>a</sub> (shaded) have enough energy to react.</li>
</ul>
<h3>Effect of temperature</h3>
<p>At a higher temperature, the peak moves to the <strong>right</strong> (higher energy) and is <strong>lower</strong>; the area stays the same because the number of molecules hasn't changed. A <strong>much greater proportion</strong> of molecules now have energy ≥ E<sub>a</sub>, so many more collisions are successful. (Molecules also move faster and collide more often, but that is a much smaller effect.) A 10 °C rise often roughly doubles the rate.</p>
<h3>Effect of a catalyst</h3>
<p>A catalyst does <strong>not</strong> change the shape of the distribution. It moves the E<sub>a</sub> line to the <strong>left</strong>, so a greater proportion of molecules have energy ≥ the new, lower E<sub>a</sub>.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when drawing a second Boltzmann curve for a higher temperature, make sure it starts at the origin, has a lower peak to the right, crosses the first curve once, and stays above it at high energy without touching the axis.</p></blockquote>
`;

N['3.2.3']=`
<h2>Dynamic equilibrium</h2>
<p>Many reactions are <strong>reversible</strong> (⇌): the products can react to re-form the reactants. In a <strong>closed system</strong> (nothing can enter or leave), a reversible reaction reaches <strong>dynamic equilibrium</strong>:</p>
<ul>
<li>the rate of the forward reaction <strong>equals</strong> the rate of the reverse reaction;</li>
<li>the <strong>concentrations</strong> of reactants and products stay <strong>constant</strong> (but are usually not equal).</li>
</ul>
<p>"Dynamic" because both reactions are still happening; it only looks as if nothing is changing.</p>

<h2>Le Chatelier's principle</h2>
<p><strong>When a system in dynamic equilibrium is subjected to a change, the position of equilibrium shifts to minimise (oppose) that change.</strong></p>
<h3>Concentration</h3>
<p>Adding more of a reactant shifts the equilibrium to the <strong>right</strong> to use it up, making more product. Removing a product also shifts it to the right.</p>
<h3>Pressure (gases only)</h3>
<p>Increasing the pressure shifts the equilibrium towards the side with <strong>fewer moles of gas</strong>, which reduces the pressure. If both sides have the same number of gas moles, pressure has no effect on the position.</p>
<h3>Temperature</h3>
<p>Increasing the temperature shifts the equilibrium in the <strong>endothermic</strong> direction, which absorbs the extra heat. Decreasing the temperature shifts it in the exothermic direction. The sign of ΔH given is always for the <em>forward</em> reaction.</p>
<h3>Catalysts</h3>
<p>A catalyst speeds up the forward and reverse reactions <strong>equally</strong>. It has <strong>no effect on the position</strong> of equilibrium, but equilibrium is reached faster.</p>
<div class="wex"><p><strong>Worked example.</strong> N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = −92 kJ mol⁻¹. What conditions give the highest yield of ammonia?</p>
<p>Pressure: 4 mol of gas on the left, 2 on the right. High pressure shifts the equilibrium right: <strong>high pressure</strong>.</p>
<p>Temperature: the forward reaction is exothermic. Low temperature shifts the equilibrium right: <strong>low temperature</strong>.</p></div>

<h2>Compromise conditions in industry</h2>
<p>The Haber process actually uses about <strong>450 °C</strong>, <strong>20 MPa</strong> (200 atm) and an <strong>iron catalyst</strong>. These are compromises:</p>
<ul>
<li>A low temperature would give a high equilibrium yield, but the rate would be far too slow. 450 °C gives a reasonable rate with an acceptable yield, and the catalyst works at this temperature.</li>
<li>A very high pressure would give a high yield, but it is expensive: it needs strong pipes and lots of energy for compressors, and is more dangerous. 20 MPa balances yield against cost and safety.</li>
<li>Unreacted N₂ and H₂ are recycled, so the overall conversion is high even though each pass only converts about 15%.</li>
</ul>
<p>The same reasoning applies to the production of methanol (CO + 2H₂ ⇌ CH₃OH) and ethanol from ethene and steam.</p>
<p>Le Chatelier also explains everyday observations: in [Co(H₂O)₆]²⁺ (pink) + 4Cl⁻ ⇌ [CoCl₄]²⁻ (blue) + 6H₂O, adding concentrated HCl turns the solution blue, and heating it (the forward reaction is endothermic) also turns it blue.</p>

<h2>The equilibrium constant, K<sub>c</sub></h2>
<p>For a homogeneous equilibrium (all species in the same phase) aA + bB ⇌ cC + dD:</p>
<div class="eqgrid"><div>$$K_c=\\dfrac{[\\mathrm{C}]^c[\\mathrm{D}]^d}{[\\mathrm{A}]^a[\\mathrm{B}]^b}$$</div></div>
<p>Square brackets mean concentration in mol dm⁻³ <strong>at equilibrium</strong>. Products go on top, reactants on the bottom, each raised to the power of its coefficient in the equation.</p>
<div class="wex"><p><strong>Worked example.</strong> Write K<sub>c</sub> for 2SO₂(g) + O₂(g) ⇌ 2SO₃(g).</p>
$$K_c=\\dfrac{[\\mathrm{SO_3}]^2}{[\\mathrm{SO_2}]^2[\\mathrm{O_2}]}$$</div>
<h3>What the size of K<sub>c</sub> tells you</h3>
<ul>
<li>K<sub>c</sub> ≫ 1: the equilibrium lies well to the <strong>right</strong> (mostly products).</li>
<li>K<sub>c</sub> ≈ 1: similar amounts of reactants and products.</li>
<li>K<sub>c</sub> ≪ 1: the equilibrium lies well to the <strong>left</strong> (mostly reactants).</li>
</ul>
<p>At AS you write expressions and use K<sub>c</sub> to judge the position of equilibrium. Calculating K<sub>c</sub> from data, its units, K<sub>p</sub> and how temperature changes K are in 5.1.2.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> Le Chatelier answers need three parts: the change, the direction the equilibrium shifts, and why (e.g. "fewer moles of gas on the right, so the equilibrium shifts right to reduce the pressure").</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
