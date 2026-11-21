/* More extra teaching: worked examples and "check yourself" questions for the remaining topics,
   plus deeper sections for the shortest ones. Appended after notes-extra.js. */
(function(){
const X={};
const Q=(q,a)=>`<details class="fold"><summary>${q}</summary><div><p>${a}</p></div></details>`;
const CY=(...qs)=>`<h2>Check yourself</h2><p class="muted">Try each one before opening the answer.</p>${qs.join('')}`;
const MORE=(...qs)=>`<h2>More to try</h2>${qs.join('')}`;

X['2.1.3']=`
<h2>Common pitfalls in mole calculations</h2>
<ul>
<li>Using cm³ in n = cV. Divide by 1000 first.</li>
<li>Forgetting the ratio step. Always write "ratio A : B = x : y, so n(B) = …".</li>
<li>Rounding mid-calculation. Keep at least 4 significant figures until the end.</li>
<li>Mixing up M<sub>r</sub> of a diatomic element with A<sub>r</sub>: 1 mol of O₂ has mass 32.0 g, not 16.0 g.</li>
</ul>
<div class="wex"><p><strong>Worked example (limiting reagent).</strong> 2.43 g of magnesium is added to 50.0 cm³ of 2.00 mol dm⁻³ HCl. What volume of hydrogen forms at RTP?</p>
$$\\mathrm{Mg}+2\\,\\mathrm{HCl}\\longrightarrow\\mathrm{MgCl_2}+\\mathrm{H_2}$$$$n(\\mathrm{Mg})=\\dfrac{2.43}{24.3}=0.100\\ \\text{mol}$$$$ n(\\mathrm{HCl})=2.00\\times\\dfrac{50.0}{1000}=0.100\\ \\text{mol}$$
<p>Mg needs 2 × 0.100 = 0.200 mol HCl, but only 0.100 mol is present: <strong>HCl is limiting</strong>.</p>
$$n(\\mathrm{H_2})=\\dfrac{0.100}{2}=0.0500\\ \\text{mol}$$$$ V=0.0500\\times 24.0=\\mathbf{1.20}\\ \\text{dm}^3$$</div>
${CY(Q(`What mass of CaO forms when 25.0 g of CaCO₃ is heated? (M: CaCO₃ 100.1, CaO 56.1)`,`n(CaCO₃) = 0.250 mol; 1 : 1, so mass CaO = 0.250 × 56.1 = 14.0 g.`),Q(`What is the concentration of a solution made by dissolving 4.00 g of NaOH in water and making up to 250 cm³?`,`n = 4.00 ÷ 40.0 = 0.100 mol; c = 0.100 ÷ 0.250 = 0.400 mol dm⁻³.`),Q(`Find the atom economy for making hydrogen by C(s) + 2H₂O(g) → CO₂(g) + 2H₂(g).`,`Desired: 2 × 2.0 = 4.0. Total products: 44.0 + 4.0 = 48.0. Atom economy = 8.3%.`))}`;

X['2.1.4']=`
<h2>Acids and their salts: a quick reference</h2>
<div class="tbl"><table><tr><th>Acid</th><th>Salt name</th><th>Example salt</th></tr>
<tr><td>hydrochloric HCl</td><td>chloride</td><td>NaCl, CaCl₂</td></tr><tr><td>sulfuric H₂SO₄</td><td>sulfate (or hydrogensulfate)</td><td>Na₂SO₄, NaHSO₄</td></tr><tr><td>nitric HNO₃</td><td>nitrate</td><td>KNO₃, Cu(NO₃)₂</td></tr><tr><td>ethanoic CH₃COOH</td><td>ethanoate</td><td>CH₃COONa</td></tr><tr><td>phosphoric H₃PO₄</td><td>phosphate</td><td>Na₃PO₄</td></tr></table></div>
<h2>Back titration</h2>
<p>Some solids (like CaCO₃ in an indigestion tablet or limestone) don't dissolve, so they can't be titrated directly. Instead, react them with a known <strong>excess</strong> of acid, then titrate the acid left over with an alkali. The acid used = acid added − acid left over.</p>
<div class="wex"><p><strong>Worked example.</strong> 0.600 g of impure CaCO₃ is added to 50.0 cm³ of 0.250 mol dm⁻³ HCl (excess). The unreacted acid needs 15.0 cm³ of 0.100 mol dm⁻³ NaOH. Find the percentage of CaCO₃ in the sample.</p>
$$n(\\mathrm{HCl})_{\\text{added}}=0.250\\times 0.0500=0.0125\\ \\text{mol}$$$$ n(\\mathrm{HCl})_{\\text{left}}=n(\\mathrm{NaOH})=0.100\\times 0.0150=1.50\\times 10^{-3}\\ \\text{mol}$$$$n(\\mathrm{HCl})_{\\text{reacted}}=0.0125-0.0015=0.0110\\ \\text{mol}$$
$$\\mathrm{CaCO_3}+2\\,\\mathrm{HCl}\\longrightarrow\\mathrm{CaCl_2}+\\mathrm{H_2O}+\\mathrm{CO_2}$$$$n(\\mathrm{CaCO_3})=\\dfrac{0.0110}{2}=5.50\\times 10^{-3}\\ \\text{mol}$$$$ m=5.50\\times 10^{-3}\\times 100.1=0.551\\ \\text{g}$$
$$\\text{purity}=\\dfrac{0.551}{0.600}\\times 100=\\mathbf{91.8\\,\\%}$$<p>Always sense-check: a purity can never be over 100%.</p></div>
${CY(Q(`Why is a weak acid like ethanoic acid described as "weak" even when concentrated?`,`"Weak" refers to the extent of dissociation: it only partially dissociates into ions, whatever its concentration.`),Q(`Write the ionic equation for the reaction of an acid with an alkali.`,`H⁺(aq) + OH⁻(aq) → H₂O(l)`),Q(`What are concordant titres, and which titres are used for the mean?`,`Titres within 0.10 cm³ of each other; only concordant titres (not the rough titre) are averaged.`))}`;

X['2.2.2']=`
<h2>Comparing structures: a summary</h2>
<div class="tbl"><table><tr><th>Structure</th><th>Particles</th><th>Forces broken on melting</th><th>Melting point</th><th>Conducts?</th></tr>
<tr><td>giant ionic</td><td>ions</td><td>ionic bonds (electrostatic)</td><td>high</td><td>when molten or aqueous</td></tr>
<tr><td>giant covalent</td><td>atoms</td><td>covalent bonds</td><td>very high</td><td>no (except graphite)</td></tr>
<tr><td>giant metallic</td><td>cations + delocalised e⁻</td><td>metallic bonds</td><td>usually high</td><td>yes, solid and liquid</td></tr>
<tr><td>simple molecular</td><td>molecules</td><td>intermolecular forces</td><td>low</td><td>no</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> Explain why HF has a much higher boiling point (20 °C) than HCl (−85 °C), even though HCl has more electrons.</p>
<p>HF molecules form <strong>hydrogen bonds</strong> (H bonded to F, with lone pairs on F). HCl molecules have only permanent dipole–dipole and London forces, which are weaker. More energy is needed to overcome the hydrogen bonds in HF.</p></div>
${CY(Q(`Predict the shape and bond angle of the H₃O⁺ ion.`,`O has 3 bonding pairs and 1 lone pair: pyramidal, about 107°.`),Q(`Explain why CCl₄ is non-polar although each C–Cl bond is polar.`,`The molecule is symmetrical (tetrahedral), so the four bond dipoles cancel.`),Q(`Why does ice float on water?`,`In ice, hydrogen bonds hold molecules in an open lattice that is less dense than liquid water.`))}`;

X['3.1.1']=`
<div class="wex"><p><strong>Worked example.</strong> Explain why the first ionisation energy of sodium is much lower than that of neon.</p>
<p>Sodium's outer electron is in a <strong>new shell</strong> (3s), further from the nucleus, with more <strong>shielding</strong> from two inner shells. Despite the extra proton, it is held much less strongly than neon's 2p electrons, so less energy is needed to remove it.</p></div>
${CY(Q(`Write the equation for the second ionisation energy of calcium.`,`Ca⁺(g) → Ca²⁺(g) + e⁻`),Q(`Why does aluminium have a lower first ionisation energy than magnesium?`,`Al's outer electron is in a 3p sub-shell, higher in energy (and slightly more shielded) than Mg's 3s, so it is easier to remove.`),Q(`Why does graphite conduct electricity but diamond does not?`,`In graphite each carbon uses three electrons in bonds; the fourth is delocalised and can move along the layers. In diamond all four are used in covalent bonds.`))}`;

X['3.1.2']=`
${MORE(Q(`Write the equation for magnesium reacting with steam.`,`Mg(s) + H₂O(g) → MgO(s) + H₂(g)`),Q(`Explain why the second ionisation energy of Mg is larger than the first.`,`The second electron is removed from a positive ion (Mg⁺), which attracts it more strongly; the ion is also smaller.`))}`;

X['3.1.4']=`
${MORE(Q(`Describe what you would see when dilute HNO₃ is added to sodium carbonate solution and the gas is bubbled through limewater.`,`Effervescence (fizzing); the limewater turns milky (cloudy white).`),Q(`A solution gives a yellow precipitate with acidified AgNO₃ that does not dissolve in concentrated ammonia. Identify the anion.`,`Iodide, I⁻.`))}`;

X['3.2.1']=`
${CY(Q(`Define standard enthalpy change of formation.`,`The enthalpy change when one mole of a compound is formed from its elements under standard conditions, with all substances in their standard states.`),Q(`Why is the experimental value of Δ<sub>c</sub>H for a fuel usually less exothermic than the data-book value?`,`Heat is lost to the surroundings; combustion may be incomplete; the calorimeter is heated as well as the water; fuel evaporates from the wick.`),Q(`Use bond enthalpies to find ΔH for H₂ + Br₂ → 2HBr. (H–H 436, Br–Br 193, H–Br 366 kJ mol⁻¹)`,`Broken: 436 + 193 = 629. Made: 2 × 366 = 732. ΔH = 629 − 732 = −103 kJ mol⁻¹.`))}`;

X['4.1.1']=`
<div class="wex"><p><strong>Worked example.</strong> Draw and name all the structural isomers of C₅H₁₂.</p>
<p>Three chain isomers: <strong>pentane</strong> CH₃CH₂CH₂CH₂CH₃; <strong>2-methylbutane</strong> CH₃CH(CH₃)CH₂CH₃; <strong>2,2-dimethylpropane</strong> C(CH₃)₄.</p>
<p>(3-methylbutane is the same as 2-methylbutane numbered from the wrong end, and 2-ethylpropane is just pentane drawn differently.)</p></div>
${CY(Q(`Name CH₃CH₂CH(Cl)CH₃.`,`2-chlorobutane.`),Q(`What is the general formula of the alcohols?`,`C<sub>n</sub>H<sub>2n+1</sub>OH`),Q(`What type of fission forms radicals, and what is a radical?`,`Homolytic fission; a radical is a species with an unpaired electron.`))}`;

X['4.1.2']=`
${MORE(Q(`Write the termination step that forms butane during the chlorination of ethane.`,`•C₂H₅ + •C₂H₅ → C₄H₁₀`),Q(`Why is carbon monoxide toxic?`,`It binds to haemoglobin (more strongly than oxygen), so the blood carries less oxygen.`))}`;

X['4.1.3']=`
<div class="wex"><p><strong>Worked example.</strong> Explain why the major product of propene + HBr is 2-bromopropane.</p>
<p>The H can add to either carbon of the C=C. Adding to the end carbon gives a <strong>secondary</strong> carbocation, CH₃C⁺HCH₃; adding to the middle carbon gives a <strong>primary</strong> carbocation, CH₃CH₂CH₂⁺. The secondary carbocation is more stable (two electron-donating alkyl groups), so it forms more readily and Br⁻ adds to it, giving 2-bromopropane as the major product.</p></div>
${CY(Q(`Does pent-2-ene show E/Z isomerism? Explain.`,`Yes: each carbon of the C=C has two different groups (C1: H and CH₃; C2: H and C₂H₅), and rotation about C=C is restricted.`),Q(`Draw the repeat unit of poly(propene).`,`–[CH₂–CH(CH₃)]– with extension bonds.`),Q(`What are the conditions for hydrogenating an alkene?`,`H₂ with a nickel catalyst at about 150 °C.`))}`;

X['5.1.1']=`
${CY(Q(`If a reaction is zero order in A, what happens to the rate when [A] is tripled?`,`Nothing: the rate stays the same.`),Q(`Give the units of k for a second-order reaction.`,`dm³ mol⁻¹ s⁻¹`),Q(`A reaction has rate = k[X]. What does a graph of rate against [X] look like?`,`A straight line through the origin, with gradient k.`))}`;

X['5.1.3']=`
<div class="wex"><p><strong>Worked example.</strong> Calculate the pH of the solution formed when 30.0 cm³ of 0.100 mol dm⁻³ NaOH is added to 25.0 cm³ of 0.100 mol dm⁻³ HCl.</p>
$$n(\\mathrm{HCl})=2.50\\times 10^{-3}$$$$ n(\\mathrm{NaOH})=3.00\\times 10^{-3}$$$$\\text{excess}\\ \\mathrm{OH^-}=5.0\\times 10^{-4}\\ \\text{mol in}\\ 55.0\\ \\text{cm}^3$$
$$[\\mathrm{OH^-}]=\\dfrac{5.0\\times 10^{-4}}{0.0550}=9.09\\times 10^{-3}$$$$[\\mathrm{H^+}]=\\dfrac{1.00\\times 10^{-14}}{9.09\\times 10^{-3}}=1.10\\times 10^{-12}$$$$\\mathrm{pH}=\\mathbf{11.96}$$</div>
${CY(Q(`Identify the conjugate acid–base pairs in NH₃ + H₂O ⇌ NH₄⁺ + OH⁻.`,`NH₄⁺/NH₃ and H₂O/OH⁻.`),Q(`What is the pH of a buffer when [HA] = [A⁻]?`,`pH = pK<sub>a</sub>.`),Q(`Choose an indicator for titrating ethanoic acid with sodium hydroxide, and explain.`,`Phenolphthalein: its range (8.3–10) lies within the vertical section (about 7–11) of the weak acid / strong base curve.`))}`;

X['5.2.1']=`
<div class="wex"><p><strong>Worked example (MgO).</strong> Δ<sub>f</sub>H(MgO) = −602; Δ<sub>at</sub>H(Mg) = +148; IE₁ +738; IE₂ +1451; Δ<sub>at</sub>H(O) = +249; EA₁(O) = −141; EA₂(O) = +798 kJ mol⁻¹. Find Δ<sub>LE</sub>H.</p>
$$\\text{sum of steps}=148+738+1451+249+(-141)+798=3243$$
$$\\Delta_{LE}H=\\Delta_f H-\\text{sum}=-602-3243=\\mathbf{-3845}\\ \\text{kJ mol}^{-1}$$<p>Far more exothermic than NaCl because Mg²⁺ and O²⁻ have double charges and are small.</p></div>
${CY(Q(`Why is the second electron affinity of oxygen endothermic?`,`An electron is being added to a negative ion (O⁻), so energy is needed to overcome the repulsion.`),Q(`Which has the more exothermic lattice enthalpy, NaCl or KCl? Why?`,`NaCl: Na⁺ is smaller than K⁺, so the ions are closer and the attraction is stronger.`),Q(`Which atomisation step uses ½Cl₂ in a Born–Haber cycle for NaCl, and why only half?`,`½Cl₂(g) → Cl(g): only one mole of Cl atoms is needed for one mole of NaCl.`))}`;

X['5.2.3']=`
${CY(Q(`What is the potential of the standard hydrogen electrode, and what are its conditions?`,`0.00 V; H₂ at 100 kPa, 1.00 mol dm⁻³ H⁺, 298 K, platinum electrode.`),Q(`Predict whether Cu²⁺ will oxidise I⁻ to I₂, using E° values (Cu²⁺/Cu +0.34 V; I₂/I⁻ +0.54 V).`,`No: I₂/I⁻ is more positive, so I₂ would oxidise Cu rather than Cu²⁺ oxidising I⁻. (Cu²⁺ does react with I⁻ in practice, because CuI precipitates and conditions are non-standard: a limitation of E° predictions.)`),Q(`What is the role of the salt bridge?`,`It completes the circuit by letting ions move between the half-cells, without the solutions mixing.`))}`;

X['5.3.1']=`
${CY(Q(`Why is zinc not a transition element?`,`Its only ion, Zn²⁺, has a full 3d sub-shell (3d¹⁰), so no ion has an incomplete d sub-shell.`),Q(`What is the coordination number of [Co(en)₃]³⁺, and its shape?`,`6 (three bidentate ligands, each forming 2 bonds); octahedral.`),Q(`Describe what you see when excess aqueous ammonia is added to copper(II) sulfate solution.`,`A pale blue precipitate forms, then dissolves to give a dark blue solution.`))}`;

X['5.3.2']=`
<h2>Flame colours and other quick identifications</h2>
<p>You may meet these in Paper 3 contexts: lithium red, sodium yellow-orange, potassium lilac, calcium brick red, copper blue-green (flame tests are a GCSE technique you can still use). Hydrated copper(II) sulfate is blue and anhydrous copper(II) sulfate is white: adding water turns it blue, a test for water.</p>
${MORE(Q(`Which hydroxide precipitate is light brown and darkens on standing?`,`Mn(OH)₂, from Mn²⁺.`),Q(`Write the ionic equation for the precipitate formed when NaOH(aq) is added to iron(III) chloride solution.`,`Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)`))}`;

X['6.1.1']=`
${CY(Q(`Write an equation to show the formation of the nitronium ion.`,`HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O`),Q(`Why does phenol react with bromine water but benzene does not?`,`A lone pair on oxygen in phenol is partly delocalised into the ring, increasing its electron density so it can polarise Br₂.`),Q(`What is the role of FeBr₃ in the bromination of benzene?`,`A halogen carrier: it reacts with Br₂ to form the electrophile Br⁺ (and FeBr₄⁻), and is regenerated.`))}`;

X['6.1.2']=`
${MORE(Q(`Give the structure of the product of butanone with HCN.`,`CH₃C(OH)(CN)CH₂CH₃, 2-hydroxy-2-methylbutanenitrile.`),Q(`How could you use 2,4-DNP to identify which ketone you have?`,`Recrystallise the orange precipitate, measure its melting point and compare it with known values for 2,4-DNP derivatives.`))}`;

X['6.2.1']=`
<h2>Amines and amides: telling them apart</h2>
<p>An amine has N bonded only to C and H; an amide has N bonded to a C=O. Amides are <strong>not</strong> basic in the same way, because the lone pair on N is partly delocalised onto the C=O. In naming, the group on N in a secondary amide is shown with "N-": CH₃CONHCH₃ is N-methylethanamide.</p>
${MORE(Q(`Name (CH₃CH₂)₂NH and classify it.`,`Diethylamine; a secondary amine.`),Q(`Write the equation for the reduction of nitrobenzene, using [H].`,`C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O`))}`;

X['6.2.3']=`
${MORE(Q(`Is polyethene an addition or condensation polymer? How can you tell from its repeat unit?`,`Addition: the main chain contains only C–C bonds, with no ester or amide links.`),Q(`What are the monomers of PET (Terylene)?`,`Benzene-1,4-dicarboxylic acid and ethane-1,2-diol.`))}`;

X['6.2.4']=`
<h2>Choosing the right C–C method</h2>
<div class="tbl"><table><tr><th>Starting material</th><th>Reagent</th><th>Product</th><th>Then</th></tr>
<tr><td>haloalkane</td><td>NaCN in ethanol</td><td>nitrile (+1 C)</td><td>reduce → amine, or hydrolyse → acid</td></tr>
<tr><td>aldehyde or ketone</td><td>NaCN / H₂SO₄</td><td>hydroxynitrile (+1 C)</td><td>hydrolyse → 2-hydroxy acid</td></tr>
<tr><td>benzene</td><td>RCl / AlCl₃</td><td>alkylbenzene</td><td>—</td></tr>
<tr><td>benzene</td><td>RCOCl / AlCl₃</td><td>aromatic ketone</td><td>NaBH₄ → secondary alcohol</td></tr></table></div>
${MORE(Q(`Suggest a two-step route from chloromethane to ethylamine.`,`1. NaCN in ethanol, heat → ethanenitrile CH₃CN. 2. H₂ with a Ni catalyst → ethylamine CH₃CH₂NH₂.`))}`;

X['6.3.2']=`
${CY(Q(`How many peaks would you expect in the ¹H NMR spectrum of propanone, and what splitting?`,`One peak (6H), a singlet: both CH₃ groups are equivalent and have no neighbouring H.`),Q(`What splitting pattern does the CH₂ in CH₃CH₂Cl show?`,`A quartet (three H on the neighbouring CH₃).`),Q(`Why is CDCl₃ used as the solvent?`,`Deuterium does not give a ¹H NMR signal, so the solvent adds no peaks to the spectrum.`))}`;

window.SPEC.topics.forEach(t=>{ if(X[t.id]) t.notes+=X[t.id]; });
})();
