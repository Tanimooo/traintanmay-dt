/* Full topic notes, Module 4: Core organic chemistry. Replace the short notes in m4.js (loaded after it). */
(function(){
const N={};

/* curly-arrow mechanism diagrams, reused below */
const MECH_EA=`<svg class="diagram" viewBox="0 0 600 190" role="img" aria-label="Electrophilic addition of bromine to ethene: the pi bond attacks the delta plus bromine, the Br-Br bond breaks heterolytically, then bromide attacks the carbocation">
<text x="20" y="95">H₂C</text><line class="wire" x1="58" y1="86" x2="90" y2="86"/><line class="wire" x1="58" y1="93" x2="90" y2="93"/><text x="94" y="95">CH₂</text>
<text x="70" y="160">Br</text><text x="62" y="148" class="small lbl1">δ+</text><line class="wire" x1="80" y1="125" x2="80" y2="140"/><text x="70" y="120">Br</text><text x="96" y="112" class="small lbl1">δ−</text>
<path class="c1" d="M74 82 Q40 120 72 148" marker-end="url(#ahb)"/><path class="c1" d="M86 133 Q115 128 108 116" marker-end="url(#ahb)"/>
<text x="140" y="95">→</text>
<text x="180" y="95">H₂C</text><line class="wire" x1="216" y1="90" x2="240" y2="90"/><text x="244" y="95">CH₂</text><text x="276" y="84" class="small">+</text><line class="wire" x1="196" y1="100" x2="196" y2="122"/><text x="186" y="138">Br</text>
<text x="300" y="140">:Br⁻</text><path class="c1" d="M306 126 Q300 100 278 96" marker-end="url(#ahb)"/>
<text x="350" y="95">→</text>
<text x="390" y="95">H₂C</text><line class="wire" x1="426" y1="90" x2="450" y2="90"/><text x="454" y="95">CH₂</text><line class="wire" x1="406" y1="100" x2="406" y2="122"/><text x="396" y="138">Br</text><line class="wire" x1="470" y1="100" x2="470" y2="122"/><text x="460" y="138">Br</text>
<text x="20" y="182" class="small">alkene + Br₂ → carbocation intermediate + Br⁻ → 1,2-dibromoethane</text>
</svg>`;
const MECH_NS=`<svg class="diagram" viewBox="0 0 520 150" role="img" aria-label="Nucleophilic substitution: hydroxide lone pair attacks the delta plus carbon and the C-Br bond breaks, giving the alcohol and bromide">
<text x="20" y="85">HO:⁻</text><path class="c1" d="M42 70 Q70 45 100 70" marker-end="url(#ahb)"/>
<text x="100" y="85">C</text><text x="96" y="68" class="small lbl1">δ+</text><text x="70" y="115" class="small">H₃C</text><text x="105" y="50" class="small">H H</text>
<line class="wire" x1="114" y1="80" x2="160" y2="80"/><text x="164" y="85">Br</text><text x="172" y="68" class="small lbl1">δ−</text>
<path class="c1" d="M136 74 Q150 50 172 66" marker-end="url(#ahb)"/>
<text x="230" y="85">→</text>
<text x="280" y="85">CH₃CH₂OH  +  Br⁻</text>
<text x="20" y="140" class="small">bromoethane + OH⁻ → ethanol + Br⁻ (heat under reflux with NaOH(aq))</text>
</svg>`;

N['4.1.1']=`
<h2>What organic chemistry is</h2>
<p>Organic chemistry is the chemistry of carbon compounds. Carbon forms four covalent bonds and can bond to itself in chains and rings, so there are millions of organic compounds. To make sense of them, we group compounds into <strong>homologous series</strong>.</p>
<ul>
<li>A <strong>homologous series</strong> is a series of organic compounds with the same functional group and the same general formula, in which each member differs from the next by a <strong>CH₂</strong> group. Members have similar chemical properties and a gradual trend in physical properties (boiling point rises with chain length).</li>
<li>A <strong>functional group</strong> is the part of a molecule (an atom or group of atoms) responsible for its characteristic chemical reactions.</li>
<li>Hydrocarbons are <strong>saturated</strong> (only single C–C bonds, like alkanes) or <strong>unsaturated</strong> (containing C=C double bonds, like alkenes).</li>
<li><strong>Aliphatic</strong>: carbon atoms joined in straight or branched chains, or non-aromatic rings. <strong>Alicyclic</strong>: aliphatic atoms arranged in a ring (cyclohexane). <strong>Aromatic</strong>: containing a benzene ring.</li>
<li>An <strong>alkyl group</strong> (R) is an alkane with one hydrogen removed: methyl CH₃–, ethyl C₂H₅–, propyl C₃H₇–.</li>
</ul>
<h3>Functional groups to recognise</h3>
<div class="tbl"><table><tr><th>Series</th><th>Group</th><th>Prefix / suffix</th><th>Example</th></tr>
<tr><td>alkane</td><td>C–C only</td><td>-ane</td><td>propane</td></tr>
<tr><td>alkene</td><td>C=C</td><td>-ene</td><td>but-2-ene</td></tr>
<tr><td>alcohol</td><td>–OH</td><td>-ol (hydroxy-)</td><td>propan-1-ol</td></tr>
<tr><td>haloalkane</td><td>–F, –Cl, –Br, –I</td><td>fluoro-, chloro-, bromo-, iodo-</td><td>2-bromopropane</td></tr>
<tr><td>aldehyde</td><td>–CHO</td><td>-al</td><td>ethanal</td></tr>
<tr><td>ketone</td><td>C–CO–C</td><td>-one</td><td>propanone</td></tr>
<tr><td>carboxylic acid</td><td>–COOH</td><td>-oic acid</td><td>ethanoic acid</td></tr>
<tr><td>ester</td><td>–COO–</td><td>-yl -oate</td><td>methyl ethanoate</td></tr>
<tr><td>acyl chloride</td><td>–COCl</td><td>-oyl chloride</td><td>ethanoyl chloride</td></tr>
<tr><td>amine</td><td>–NH₂</td><td>-amine (amino-)</td><td>methylamine</td></tr>
<tr><td>nitrile</td><td>–C≡N</td><td>-nitrile</td><td>propanenitrile</td></tr>
<tr><td>amide</td><td>–CONH₂</td><td>-amide</td><td>ethanamide</td></tr>
<tr><td>arene</td><td>benzene ring</td><td>phenyl-, -benzene</td><td>methylbenzene</td></tr></table></div>

<h2>Naming (IUPAC nomenclature)</h2>
<p>Stems give the number of carbons in the longest chain: meth (1), eth (2), prop (3), but (4), pent (5), hex (6), hept (7), oct (8), non (9), dec (10).</p>
<ol>
<li>Find the <strong>longest carbon chain</strong> containing the functional group; it gives the stem.</li>
<li>Number the chain from the end that gives the functional group (or the first branch) the <strong>lowest number</strong>.</li>
<li>Name the side chains and halogens as prefixes, in <strong>alphabetical order</strong>, each with its position number. Use di-, tri-, tetra- for repeats (these don't count for alphabetical order).</li>
<li>Numbers are separated by commas; numbers and words by hyphens.</li>
</ol>
<div class="wex"><p><strong>Worked examples.</strong></p>
<p>CH₃CH(CH₃)CH₂CH₃: longest chain 4 C, methyl on carbon 2: <strong>2-methylbutane</strong>.</p>
<p>CH₃CHBrCH(CH₃)CH₃: 4 C chain, Br on C2, methyl on C3: <strong>2-bromo-3-methylbutane</strong>.</p>
<p>CH₂=CHCH₂CH₃: <strong>but-1-ene</strong>. CH₃CH(OH)CH₃: <strong>propan-2-ol</strong>.</p></div>

<h2>Types of formula</h2>
<ul>
<li><strong>General formula</strong>: the simplest algebraic formula for a series, e.g. alkanes C<sub>n</sub>H<sub>2n+2</sub>, alkenes C<sub>n</sub>H<sub>2n</sub>, alcohols C<sub>n</sub>H<sub>2n+1</sub>OH.</li>
<li><strong>Molecular formula</strong>: the actual number of atoms of each element, e.g. C₄H₁₀.</li>
<li><strong>Empirical formula</strong>: the simplest whole-number ratio, e.g. C₂H₅.</li>
<li><strong>Structural formula</strong>: the minimum detail showing the arrangement of atoms, e.g. CH₃CH₂CH₂CH₃.</li>
<li><strong>Displayed formula</strong>: every atom and every bond drawn.</li>
<li><strong>Skeletal formula</strong>: carbon chains drawn as zigzag lines with each corner and end a carbon; hydrogens on carbon are not shown, but functional groups are. Benzene is a hexagon with a circle.</li>
</ul>

<h2>Isomerism</h2>
<p><strong>Structural isomers</strong> are compounds with the same molecular formula but different structural formulae. Three kinds:</p>
<ul>
<li><strong>Chain</strong> isomers: different carbon skeleton (butane and 2-methylpropane, both C₄H₁₀).</li>
<li><strong>Position</strong> isomers: functional group in a different place (propan-1-ol and propan-2-ol).</li>
<li><strong>Functional group</strong> isomers: different functional group (propanal and propanone, both C₃H₆O).</li>
</ul>
<p>Stereoisomers (same structural formula, different arrangement in space) are in 4.1.3 (E/Z) and 6.2.2 (optical).</p>

<h2>Breaking bonds and drawing mechanisms</h2>
<ul>
<li><strong>Homolytic fission</strong>: each bonding atom receives <strong>one electron</strong> from the bonded pair, forming two <strong>radicals</strong>. A <strong>radical</strong> is a species with an <strong>unpaired electron</strong>, shown with a dot: Cl•.</li>
<li><strong>Heterolytic fission</strong>: one bonding atom receives <strong>both electrons</strong>, forming a cation and an anion.</li>
</ul>
<p>A <strong>curly arrow</strong> shows the movement of an <strong>electron pair</strong>. It starts at a lone pair or at the middle of a covalent bond, and its head points to where the pair ends up (an atom, forming a new bond, or between two atoms). Getting the start and end exactly right is where mechanism marks are won and lost.</p>
<h3>Types of reaction</h3>
<ul>
<li><strong>Addition</strong>: two reactants join to make one product (alkenes).</li>
<li><strong>Substitution</strong>: an atom or group is replaced by another (haloalkanes, alkanes).</li>
<li><strong>Elimination</strong>: a small molecule (H₂O, HX) is removed from a molecule, forming a double bond (dehydration of alcohols).</li>
</ul>
<p>Mechanisms are also classified by the attacking species: <strong>nucleophile</strong> (electron-pair donor), <strong>electrophile</strong> (electron-pair acceptor) or <strong>radical</strong>.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> in skeletal formulae, every line end and every corner is a carbon. Count them carefully, and remember that a skeletal formula doesn't show the H atoms on carbon, but does show H on O or N (–OH, –NH₂).</p></blockquote>
`;

N['4.1.2']=`
<h2>Alkanes</h2>
<p>Alkanes are <strong>saturated hydrocarbons</strong>, general formula C<sub>n</sub>H<sub>2n+2</sub>. Cycloalkanes are C<sub>n</sub>H<sub>2n</sub>. Each carbon forms four <strong>σ-bonds</strong> (sigma bonds): a σ-bond is formed by the <strong>direct, head-on overlap</strong> of orbitals between the bonding atoms. Free rotation is possible about a σ-bond. Each carbon has four bonding pairs, so the shape around it is <strong>tetrahedral</strong>, bond angle <strong>109.5°</strong>.</p>
<h3>Boiling points</h3>
<ul>
<li><strong>Chain length</strong>: longer chains have more electrons and more surface contact between molecules, so stronger <strong>London forces</strong> and higher boiling points.</li>
<li><strong>Branching</strong>: branched isomers have lower boiling points. Branches stop molecules packing closely, so there are fewer points of surface contact and weaker London forces. Pentane boils at 36 °C, 2,2-dimethylpropane at 10 °C.</li>
</ul>
<h3>Reactivity</h3>
<p>Alkanes are fairly unreactive: C–C and C–H bonds are strong (high bond enthalpy) and essentially <strong>non-polar</strong>, so they don't attract nucleophiles or electrophiles.</p>

<h2>Combustion</h2>
<p>Alkanes are used as fuels because their combustion is very exothermic.</p>
<div class="rxn">Complete: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O<br>Incomplete: C₃H₈ + 3½O₂ → 3CO + 4H₂O (or C, soot)</div>
<p>Incomplete combustion happens when the oxygen supply is limited. It produces <strong>carbon monoxide</strong>, a toxic gas that binds to haemoglobin and stops blood carrying oxygen, and soot (carbon particulates), which can cause respiratory problems.</p>

<h2>Radical substitution with halogens</h2>
<p>In the presence of <strong>ultraviolet light</strong>, alkanes react with chlorine or bromine. A hydrogen atom is substituted by a halogen atom.</p>
<div class="rxn">CH₄ + Br₂ → CH₃Br + HBr &nbsp;&nbsp;(UV light)</div>
<p>The mechanism is <strong>radical substitution</strong>, in three stages:</p>
<ol>
<li><strong>Initiation</strong>: UV light breaks the Br–Br bond by homolytic fission, forming two radicals.<div class="rxn">Br₂ → 2Br•</div></li>
<li><strong>Propagation</strong>: a radical reacts with a molecule to make a new radical. The two steps repeat as a chain reaction.<div class="rxn">CH₄ + Br• → •CH₃ + HBr<br>•CH₃ + Br₂ → CH₃Br + Br•</div></li>
<li><strong>Termination</strong>: two radicals join, removing radicals and stopping the chain.<div class="rxn">Br• + Br• → Br₂<br>•CH₃ + Br• → CH₃Br<br>•CH₃ + •CH₃ → C₂H₆</div></li>
</ol>
<h3>Limitations in synthesis</h3>
<ul>
<li><strong>Further substitution</strong>: the product CH₃Br can react with another Br•, giving CH₂Br₂, CHBr₃ and CBr₄. Using excess alkane makes mono-substitution more likely.</li>
<li><strong>Substitution at different positions</strong> in longer chains: propane gives a mixture of 1-bromopropane and 2-bromopropane.</li>
<li>Termination can give longer-chain products (like C₂H₆ above).</li>
</ul>
<p>So radical substitution gives a <strong>mixture of products</strong>, which have to be separated, and the yield of any one product is low.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> in propagation equations, check each step has one radical on each side, and that the two steps add up to the overall equation. Draw the radical dot on the atom that has the unpaired electron (•CH₃, not CH₃•, is the clearest).</p></blockquote>
`;

N['4.1.3']=`
<h2>The C=C double bond</h2>
<p>Alkenes are <strong>unsaturated hydrocarbons</strong> with at least one C=C double bond; general formula C<sub>n</sub>H<sub>2n</sub>. The double bond is made of one <strong>σ-bond</strong> and one <strong>π-bond</strong>.</p>
<ul>
<li>A <strong>π-bond</strong> forms by the <strong>sideways overlap of adjacent p orbitals</strong>, above and below the plane of the bonding carbon atoms.</li>
<li>The π-bond <strong>prevents rotation</strong> about the double bond.</li>
<li>Each carbon of the C=C has three regions of electron density (two single bonds and the double bond), so the shape around it is <strong>trigonal planar</strong>, bond angle <strong>120°</strong>.</li>
</ul>
<p>The π-electrons are more exposed than σ-electrons and the π-bond is weaker, so alkenes are much more reactive than alkanes. The C=C is a region of <strong>high electron density</strong> that attracts electrophiles.</p>

<h2>Stereoisomerism: E/Z and cis–trans</h2>
<p><strong>Stereoisomers</strong> have the same structural formula but a different arrangement of atoms in space. E/Z isomerism needs two things:</p>
<ol>
<li>a C=C double bond, so there is <strong>restricted rotation</strong>;</li>
<li><strong>two different groups</strong> attached to <strong>each</strong> carbon of the double bond.</li>
</ol>
<p>But-1-ene (CH₂=CHCH₂CH₃) has no E/Z isomers because one carbon carries two H atoms. But-2-ene has two:</p>
<svg class="diagram" viewBox="0 0 460 140" role="img" aria-label="Z-but-2-ene with both methyl groups on the same side and E-but-2-ene with methyl groups on opposite sides">
<g><text x="30" y="35">H₃C</text><text x="130" y="35">CH₃</text><line class="wire" x1="62" y1="44" x2="80" y2="64"/><line class="wire" x1="130" y1="44" x2="112" y2="64"/><line class="wire" x1="82" y1="68" x2="110" y2="68"/><line class="wire" x1="82" y1="74" x2="110" y2="74"/><line class="wire" x1="80" y1="78" x2="62" y2="98"/><line class="wire" x1="112" y1="78" x2="130" y2="98"/><text x="50" y="114">H</text><text x="132" y="114">H</text><text x="40" y="136" class="small lbl1">Z (cis)-but-2-ene</text></g>
<g transform="translate(240 0)"><text x="30" y="35">H₃C</text><text x="132" y="35">H</text><line class="wire" x1="62" y1="44" x2="80" y2="64"/><line class="wire" x1="130" y1="44" x2="112" y2="64"/><line class="wire" x1="82" y1="68" x2="110" y2="68"/><line class="wire" x1="82" y1="74" x2="110" y2="74"/><line class="wire" x1="80" y1="78" x2="62" y2="98"/><line class="wire" x1="112" y1="78" x2="130" y2="98"/><text x="50" y="114">H</text><text x="130" y="114">CH₃</text><text x="40" y="136" class="small lbl1">E (trans)-but-2-ene</text></g>
</svg>
<h3>The CIP priority rules</h3>
<ol>
<li>On each carbon of the C=C, give the attached atom with the <strong>higher atomic number</strong> the higher priority.</li>
<li>If the attached atoms are the same, move outward along each group to the first point of difference.</li>
<li>If the two higher-priority groups are on the <strong>same side</strong>: <strong>Z</strong> (zusammen, together). On <strong>opposite sides</strong>: <strong>E</strong> (entgegen, opposite).</li>
</ol>
<p><strong>Cis–trans</strong> is a special case used only when each carbon has the <em>same</em> group as one of its two (usually H): cis = same side, trans = opposite. Where it applies, cis usually corresponds to Z, but not always: in 1-bromo-1-chloropropene the CIP rule can give an answer that differs from a "cis/trans" reading, which is why E/Z is the general system.</p>
<div class="wex"><p><strong>Worked example.</strong> Name the isomer of CHBr=CHCl with Br and Cl on the same side.</p>
<p>Carbon 1: Br (Z = 35) beats H. Carbon 2: Cl (17) beats H. The high-priority groups Br and Cl are on the same side: <strong>(Z)-1-bromo-2-chloroethene</strong>.</p></div>

<h2>Addition reactions</h2>
<div class="tbl"><table><tr><th>Reagent</th><th>Conditions</th><th>Product</th><th>Example</th></tr>
<tr><td>H₂ (hydrogenation)</td><td>nickel catalyst, 150 °C</td><td>alkane</td><td>CH₂=CH₂ + H₂ → CH₃CH₃</td></tr>
<tr><td>Halogen (X₂)</td><td>room temperature</td><td>dihaloalkane</td><td>CH₂=CH₂ + Br₂ → CH₂BrCH₂Br</td></tr>
<tr><td>Hydrogen halide (HX)</td><td>room temperature (gas)</td><td>haloalkane</td><td>CH₂=CH₂ + HBr → CH₃CH₂Br</td></tr>
<tr><td>Steam (H₂O(g))</td><td>H₃PO₄ catalyst, ~300 °C, 6–7 MPa</td><td>alcohol</td><td>CH₂=CH₂ + H₂O → CH₃CH₂OH</td></tr></table></div>
<p>Hydrogenation is used to harden vegetable oils into margarine. Hydration of ethene is the industrial route to ethanol (100% atom economy).</p>
<h3>Test for unsaturation</h3>
<p>Shake with <strong>bromine water</strong>. An alkene <strong>decolourises</strong> it (orange → colourless) because bromine adds across the C=C. Alkanes give no change.</p>

<h2>Electrophilic addition: the mechanism</h2>
<p>An <strong>electrophile</strong> is an <strong>electron-pair acceptor</strong>. The C=C's high electron density attracts it.</p>
${MECH_EA}
<ol>
<li>As Br₂ approaches the C=C, the π-electrons repel the electrons in Br–Br, inducing a dipole: the nearer Br becomes δ+.</li>
<li>A curly arrow goes from the <strong>π-bond</strong> to the δ+ Br. A second arrow goes from the <strong>Br–Br bond</strong> to the δ− Br, which leaves as Br⁻ (heterolytic fission).</li>
<li>This forms a <strong>carbocation</strong> intermediate (a carbon with a positive charge, only three bonds).</li>
<li>A curly arrow from a <strong>lone pair</strong> on Br⁻ to the C⁺ forms the second C–Br bond.</li>
</ol>
<p>With HBr the mechanism is the same, but the H–Br bond is already polar (H<sup>δ+</sup>): the arrow goes from the π-bond to H, and from the H–Br bond to Br.</p>
<h3>Markownikoff's rule</h3>
<p>When HBr adds to an <strong>unsymmetrical alkene</strong> like propene, two products are possible: 1-bromopropane and 2-bromopropane. The major product is the one formed via the <strong>more stable carbocation</strong>.</p>
<ul>
<li>Carbocation stability: <strong>tertiary &gt; secondary &gt; primary</strong>. Alkyl groups push electron density toward the positive carbon (they are electron-donating), spreading out the charge. More alkyl groups, more stable.</li>
<li>Propene + HBr: H adds to the end CH₂, giving the secondary carbocation CH₃C⁺HCH₃, which gives <strong>2-bromopropane</strong> as the major product.</li>
<li>Markownikoff's rule in words: the H atom adds to the carbon of the C=C that already has more H atoms.</li>
</ul>

<h2>Addition polymers</h2>
<p>Alkenes join together in <strong>addition polymerisation</strong>: the double bonds open and monomers link into a long saturated chain. No other product forms.</p>
<div class="rxn">n CH₂=CHCl → –[CH₂–CHCl]ₙ– &nbsp;&nbsp; (chloroethene → poly(chloroethene), PVC)</div>
<ul>
<li>To draw the <strong>repeat unit</strong>, take the two carbons of the C=C, make the double bond single, put the side groups on, and draw extension bonds through square brackets.</li>
<li>To find the <strong>monomer</strong> from a repeat unit, take the two main-chain carbons and put a double bond between them.</li>
</ul>
<h3>Dealing with waste polymers</h3>
<p>Addition polymers are unreactive and <strong>non-biodegradable</strong>, so they persist in landfill and the environment.</p>
<ul>
<li><strong>Recycling</strong>: sorting, melting and remoulding. Conserves finite crude oil and reduces landfill, but sorting by type is expensive.</li>
<li><strong>PVC</strong> recycling is hazardous because of its chlorine content: burning releases HCl and toxic chlorinated compounds. Solvents can dissolve and recover it.</li>
<li><strong>Energy from waste</strong>: burning polymers to generate electricity.</li>
<li><strong>Feedstock recycling</strong>: chemical or thermal processes that break polymers down into monomers or other useful chemicals for new materials.</li>
<li>Toxic gases such as HCl from burning are removed by <strong>neutralising</strong> them with a base in the chimney.</li>
</ul>
<p><strong>Biodegradable</strong> polymers (made from starch, cellulose, or polymers like poly(lactic acid)) are broken down by microorganisms. <strong>Photodegradable</strong> polymers contain bonds that break when they absorb light. Both reduce pollution, but need suitable conditions to break down.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> the electrophilic addition mechanism needs four things: the dipole on Br–Br (or H–Br), the arrow from the C=C to the δ+ atom, the arrow from the bond to the δ− atom, and the lone pair on Br⁻ attacking the carbocation (with the + charge shown on carbon).</p></blockquote>
`;

N['4.2.1']=`
<h2>Properties of alcohols</h2>
<p>Alcohols contain the <strong>hydroxyl</strong> group, –OH; general formula C<sub>n</sub>H<sub>2n+1</sub>OH. The O–H bond is polar, so alcohols can form <strong>hydrogen bonds</strong>.</p>
<ul>
<li><strong>Low volatility / higher boiling points</strong> than alkanes of similar M<sub>r</sub>: extra energy is needed to break hydrogen bonds between alcohol molecules. Ethanol (M<sub>r</sub> 46) boils at 78 °C; propane (M<sub>r</sub> 44) at −42 °C.</li>
<li><strong>Soluble in water</strong>: alcohol molecules form hydrogen bonds with water. Solubility falls as the chain gets longer, because the non-polar hydrocarbon part becomes more important.</li>
</ul>
<h3>Classifying alcohols</h3>
<ul>
<li><strong>Primary (1°)</strong>: the C bonded to –OH is attached to <strong>one</strong> other carbon (or none): ethanol, propan-1-ol.</li>
<li><strong>Secondary (2°)</strong>: the C–OH carbon is attached to <strong>two</strong> carbons: propan-2-ol.</li>
<li><strong>Tertiary (3°)</strong>: the C–OH carbon is attached to <strong>three</strong> carbons: 2-methylpropan-2-ol.</li>
</ul>

<h2>Combustion</h2>
<div class="rxn">C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O</div>
<p>Ethanol made by fermenting sugars is used as a biofuel.</p>

<h2>Oxidation</h2>
<p>The oxidising agent is <strong>acidified potassium dichromate(VI)</strong>, K₂Cr₂O₇ / H₂SO₄. In equations, oxygen from the oxidising agent is written as <strong>[O]</strong>. When the alcohol is oxidised, the orange Cr₂O₇²⁻ is reduced to green Cr³⁺: <strong>orange → green</strong>.</p>
<h3>Primary alcohols</h3>
<p>A primary alcohol is oxidised first to an <strong>aldehyde</strong>, then further to a <strong>carboxylic acid</strong>. Which you get depends on the apparatus:</p>
<ul>
<li><strong>Aldehyde</strong>: gently heat with dichromate and <strong>distil</strong> the aldehyde off as soon as it forms (aldehydes have lower boiling points than alcohols, because they can't hydrogen bond to each other). This removes it before it is oxidised further.<div class="rxn">CH₃CH₂OH + [O] → CH₃CHO + H₂O</div></li>
<li><strong>Carboxylic acid</strong>: use <strong>excess</strong> oxidising agent and <strong>heat under reflux</strong>, so any aldehyde formed stays in the flask and is oxidised fully.<div class="rxn">CH₃CH₂OH + 2[O] → CH₃COOH + H₂O</div></li>
</ul>
<h3>Secondary alcohols</h3>
<p>Oxidised to a <strong>ketone</strong>, under reflux. Ketones can't be oxidised further.</p>
<div class="rxn">CH₃CH(OH)CH₃ + [O] → CH₃COCH₃ + H₂O</div>
<h3>Tertiary alcohols</h3>
<p><strong>Not oxidised</strong>: the carbon with the –OH has no hydrogen atom to lose. The dichromate stays <strong>orange</strong>. This is a way of telling tertiary alcohols apart.</p>
<h3>Reflux and distillation</h3>
<p><strong>Reflux</strong> means heating with a vertical condenser fitted to the flask: vapours condense and run back into the flask, so the mixture can be heated for a long time without losing volatile reactants or products. Use anti-bumping granules, and never seal the top. <strong>Distillation</strong> uses a sloping condenser to collect liquid that boils off at a particular temperature.</p>

<h2>Elimination: dehydration to alkenes</h2>
<p>Heating an alcohol with an <strong>acid catalyst</strong> (concentrated H₃PO₄ or concentrated H₂SO₄) removes a water molecule, forming an alkene.</p>
<div class="rxn">CH₃CH₂OH → CH₂=CH₂ + H₂O</div>
<p>Unsymmetrical alcohols can give more than one alkene: butan-2-ol gives but-1-ene and both E- and Z-but-2-ene.</p>

<h2>Substitution with halide ions</h2>
<p>Alcohols react with halide ions in the presence of an acid to form haloalkanes. To make a bromoalkane, heat the alcohol with <strong>sodium bromide and concentrated sulfuric acid</strong>, which react to make HBr in the flask:</p>
<div class="rxn">NaBr + H₂SO₄ → NaHSO₄ + HBr<br>CH₃CH₂OH + HBr → CH₃CH₂Br + H₂O</div>
<blockquote class="tip"><p><strong>Exam tip:</strong> a classic question: "how would you make ethanal rather than ethanoic acid from ethanol?" Answer: distil the product off as it forms, and don't use excess dichromate. For the acid: excess dichromate, heat under reflux.</p></blockquote>
`;

N['4.2.2']=`
<h2>Haloalkanes</h2>
<p>A <strong>haloalkane</strong> has a halogen atom in place of a hydrogen of an alkane. Like alcohols, they are classified as primary, secondary or tertiary by how many carbons are attached to the C–X carbon.</p>
<p>The C–X bond is <strong>polar</strong>: the halogen is more electronegative, so the carbon is <strong>δ+</strong>. This δ+ carbon is attacked by <strong>nucleophiles</strong>.</p>
<ul>
<li>A <strong>nucleophile</strong> is an <strong>electron-pair donor</strong>: a species with a lone pair that it can use to form a new covalent bond. Examples: OH⁻, H₂O, NH₃, CN⁻.</li>
</ul>

<h2>Hydrolysis: nucleophilic substitution</h2>
<p><strong>Hydrolysis</strong> is a reaction with water or hydroxide ions that breaks a chemical bond. Heating a haloalkane with <strong>aqueous sodium hydroxide under reflux</strong> substitutes the halogen with –OH, forming an alcohol.</p>
<div class="rxn">CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻</div>
${MECH_NS}
<ol>
<li>A curly arrow from a <strong>lone pair on the O of OH⁻</strong> to the δ+ carbon.</li>
<li>A curly arrow from the <strong>C–Br bond</strong> to the Br, which leaves as Br⁻ (heterolytic fission).</li>
</ol>
<p>The nucleophile attacks from the side <em>opposite</em> the halogen. The aqueous solvent is important: in ethanol, hot NaOH causes elimination instead.</p>

<h2>Rate of hydrolysis and bond enthalpy</h2>
<p>For primary haloalkanes, the rate of hydrolysis depends on the <strong>strength of the C–X bond</strong>, not on its polarity.</p>
<div class="tbl"><table><tr><th>Bond</th><th>Bond enthalpy / kJ mol⁻¹</th><th>Rate of hydrolysis</th></tr>
<tr><td>C–F</td><td>467</td><td>slowest (effectively none)</td></tr>
<tr><td>C–Cl</td><td>346</td><td>slow</td></tr>
<tr><td>C–Br</td><td>290</td><td>faster</td></tr>
<tr><td>C–I</td><td>228</td><td>fastest</td></tr></table></div>
<p>The C–I bond is the weakest, so it breaks most easily: <strong>iodoalkanes hydrolyse fastest</strong>. Polarity would predict the opposite (C–F is the most polar), which shows that bond enthalpy is the deciding factor.</p>
<h3>Comparing rates experimentally</h3>
<p>Warm each haloalkane with <strong>aqueous silver nitrate and ethanol</strong> in a water bath at the same temperature (ethanol is a common solvent so the haloalkane and water mix). Water acts as the nucleophile; as each halide ion is released, it forms a silver halide precipitate:</p>
<div class="rxn">R–X + H₂O → R–OH + H⁺ + X⁻<br>Ag⁺(aq) + X⁻(aq) → AgX(s)</div>
<p>Time how long the precipitate takes to appear. The <strong>iodoalkane</strong> forms a yellow precipitate first, then the bromoalkane (cream), then the chloroalkane (white), slowest. Use the same volume, the same carbon skeleton and the same number of moles to make it a fair test.</p>

<h2>Organohalogen compounds and the ozone layer</h2>
<p>The <strong>ozone layer</strong> in the stratosphere absorbs harmful <strong>UV radiation</strong>, which would otherwise cause skin cancer and cataracts. Ozone forms and breaks down naturally in a balance: O₂ + UV → 2O, then O + O₂ ⇌ O₃.</p>
<p><strong>CFCs</strong> (chlorofluorocarbons, such as CF₂Cl₂) were used as refrigerants, aerosol propellants and solvents because they are unreactive and non-toxic. In the stratosphere, UV breaks the weakest bond, C–Cl, by homolytic fission, releasing chlorine radicals:</p>
<div class="rxn">CF₂Cl₂ → •CF₂Cl + Cl•</div>
<p>The chlorine radicals catalyse ozone breakdown in a chain reaction:</p>
<div class="rxn">Cl• + O₃ → ClO• + O₂<br>ClO• + O → Cl• + O₂<br>overall: O₃ + O → 2O₂</div>
<p>Cl• is regenerated, so a single chlorine radical can destroy thousands of ozone molecules. <strong>Nitrogen monoxide radicals (•NO)</strong>, from aircraft and lightning, catalyse ozone breakdown in the same way: •NO + O₃ → •NO₂ + O₂, then •NO₂ + O → •NO + O₂.</p>
<p>The Montreal Protocol (1987) banned CFCs. They have been replaced by HCFCs and HFCs, which break down lower in the atmosphere or contain no chlorine; C–F bonds are too strong to break in UV. The ozone layer is slowly recovering.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> "Explain why iodoalkanes hydrolyse fastest" needs: C–I has the lowest bond enthalpy, so it is the weakest bond and needs least energy to break. Don't mention polarity except to say it isn't the deciding factor.</p></blockquote>
`;

N['4.2.3']=`
<h2>Practical techniques in organic synthesis</h2>
<h3>Heating under reflux</h3>
<p>Organic reactions are often slow, and organic liquids are volatile and flammable. <strong>Reflux</strong> lets you heat a reaction mixture for a long time without boiling it dry or losing product.</p>
<ul>
<li>Pear-shaped or round-bottomed flask, no more than half full, with <strong>anti-bumping granules</strong> (smooth boiling).</li>
<li>A <strong>Liebig condenser</strong> fitted vertically; water goes in at the <strong>bottom</strong> and out at the top so the condenser stays full of cold water.</li>
<li>Heat with an electric heating mantle or water bath (no naked flame). The top of the condenser is <strong>open</strong>: a sealed system would build up pressure.</li>
</ul>
<h3>Distillation</h3>
<p>Separates a liquid from a mixture by its boiling point. The flask is fitted with a still head and thermometer (bulb level with the side arm, so it reads the temperature of the vapour leaving), and a sloping condenser leading to a collecting flask. Collect the liquid that distils within a degree or two of the product's boiling point.</p>

<h2>Purifying an organic liquid</h2>
<p>A crude product usually contains unreacted reactants, by-products, water and acid. A typical sequence:</p>
<ol>
<li><strong>Separating funnel</strong>: add the crude product and an aqueous solution, shake (releasing pressure through the tap), let the layers separate, and run off the bottom layer. Keep the organic layer. Which layer is which depends on density: most organic liquids float, but halogenated ones sink. Adding water and checking which layer gets bigger tells you.</li>
<li><strong>Washing</strong>: shake with <strong>sodium hydrogencarbonate solution</strong> to remove acid impurities (CO₂ is released, so vent the funnel often), then with water.</li>
<li><strong>Drying</strong>: add an anhydrous salt (<strong>anhydrous MgSO₄ or CaCl₂</strong>), swirl, and leave. The liquid is dry when it goes from cloudy to <strong>clear</strong> and fresh solid no longer clumps. Decant or filter off the solid.</li>
<li><strong>Redistillation</strong>: distil again and collect the fraction at the product's boiling point. A narrow boiling range shows a pure product.</li>
</ol>

<h2>Identifying functional groups from reactions</h2>
<p>You need to be able to work out a functional group from the reagents it reacts with and the products formed, using everything in modules 4.1–4.2: an orange-to-green dichromate colour change means a primary or secondary alcohol (or aldehyde); decolourising bromine water means C=C; a precipitate with AgNO₃ in ethanol means a haloalkane.</p>

<h2>Synthetic routes</h2>
<p>Synthesis questions ask how to turn one compound into another in two steps. Learn the reactions as a <strong>map</strong>:</p>
<div class="tbl"><table><tr><th>From</th><th>To</th><th>Reagents and conditions</th></tr>
<tr><td>alkane</td><td>haloalkane</td><td>X₂, UV light (radical substitution)</td></tr>
<tr><td>alkene</td><td>alkane</td><td>H₂, Ni catalyst, 150 °C</td></tr>
<tr><td>alkene</td><td>dihaloalkane</td><td>X₂, room temperature</td></tr>
<tr><td>alkene</td><td>haloalkane</td><td>HX, room temperature</td></tr>
<tr><td>alkene</td><td>alcohol</td><td>H₂O(g), H₃PO₄ catalyst</td></tr>
<tr><td>alcohol</td><td>alkene</td><td>conc. H₃PO₄ or H₂SO₄, heat (elimination)</td></tr>
<tr><td>alcohol</td><td>haloalkane</td><td>NaX + conc. H₂SO₄, heat</td></tr>
<tr><td>haloalkane</td><td>alcohol</td><td>NaOH(aq), heat under reflux</td></tr>
<tr><td>1° alcohol</td><td>aldehyde</td><td>K₂Cr₂O₇ / H₂SO₄, distil</td></tr>
<tr><td>1° alcohol</td><td>carboxylic acid</td><td>excess K₂Cr₂O₇ / H₂SO₄, reflux</td></tr>
<tr><td>2° alcohol</td><td>ketone</td><td>K₂Cr₂O₇ / H₂SO₄, reflux</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> Suggest a two-step synthesis of propanone from propene.</p>
<p>Step 1: propene + steam with an H₃PO₄ catalyst → propan-2-ol (Markownikoff: OH goes on the middle carbon as the major product).</p>
<p>Step 2: propan-2-ol + acidified K₂Cr₂O₇, heat under reflux → <strong>propanone</strong>.</p></div>
<p>The full interactive version is on the <a href="#rxmap">Reaction map</a> page.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> always give the reagent, the conditions and, where it matters, the type of reaction. "NaOH" alone is not enough: "NaOH(aq), heat under reflux, nucleophilic substitution".</p></blockquote>
`;

N['4.2.4']=`
<h2>Infrared spectroscopy</h2>
<p>Covalent bonds vibrate (stretch and bend). Each bond absorbs infrared radiation at particular frequencies that make it vibrate more. An IR spectrum shows how much radiation is absorbed (as % transmittance) at each <strong>wavenumber</strong> (cm⁻¹). Absorptions show up as <strong>dips</strong>, pointing downward.</p>
<h3>IR and the atmosphere</h3>
<p>Molecules such as CO₂, H₂O and CH₄ absorb IR radiation emitted from the Earth's surface, then re-emit it in all directions, keeping heat in the lower atmosphere: the <strong>greenhouse effect</strong>. Increased levels of these gases from human activity are linked to <strong>global warming</strong>. Scientists monitor greenhouse gases using IR spectroscopy.</p>
<h3>Breathalysers</h3>
<p>Modern breathalysers measure the absorption of the C–H bonds (and the O–H/C–O bonds) of ethanol in breath. The intensity of absorption shows the ethanol concentration.</p>
<h3>Reading an IR spectrum</h3>
<p>The Data Sheet lists the absorption ranges. The three to know well:</p>
<div class="tbl"><table><tr><th>Bond</th><th>Compound</th><th>Wavenumber / cm⁻¹</th><th>Appearance</th></tr>
<tr><td>O–H</td><td>alcohol</td><td>3200–3600</td><td>broad</td></tr>
<tr><td>O–H</td><td>carboxylic acid</td><td>2500–3300</td><td>very broad</td></tr>
<tr><td>C=O</td><td>aldehyde, ketone, acid, ester</td><td>1630–1820</td><td>strong, sharp</td></tr>
<tr><td>C–O</td><td>alcohol, ester, acid</td><td>1000–1300</td><td>strong</td></tr>
<tr><td>N–H</td><td>amine, amide</td><td>3300–3500</td><td>medium</td></tr>
<tr><td>C–H</td><td>most organics</td><td>2850–3100</td><td>present almost always</td></tr></table></div>
<ul>
<li><strong>Alcohol</strong>: broad O–H (3200–3600) and C–O, no C=O.</li>
<li><strong>Aldehyde or ketone</strong>: C=O (about 1700), no O–H.</li>
<li><strong>Carboxylic acid</strong>: very broad O–H (2500–3300) <em>and</em> C=O.</li>
<li><strong>Ester</strong>: C=O and C–O, no O–H.</li>
</ul>
<p>The region below about 1500 cm⁻¹ (the <strong>fingerprint region</strong>) is unique to each compound and can be matched against a database.</p>
<div class="wex"><p><strong>Worked example.</strong> Ethanol is oxidised. The product's spectrum shows a strong absorption at 1720 cm⁻¹ and a very broad one at 2500–3300 cm⁻¹. What is it?</p>
<p>C=O and the very broad carboxylic acid O–H: the product is <strong>ethanoic acid</strong>, so the alcohol was fully oxidised.</p></div>

<h2>Mass spectrometry of organic compounds</h2>
<p>In the mass spectrometer, an organic molecule loses an electron to form a <strong>molecular ion</strong>, M⁺. The peak with the <strong>highest m/z</strong> (ignoring the small M+1 peak caused by ¹³C) is the molecular ion peak, and its m/z is the <strong>relative molecular mass</strong>.</p>
<h3>Fragmentation</h3>
<p>Some molecular ions break into a positive <strong>fragment ion</strong> and a radical. Only the ion is detected.</p>
<div class="rxn">[CH₃CH₂CH₃]⁺ → CH₃CH₂⁺ + •CH₃ &nbsp;&nbsp; (peak at m/z 29)</div>
<div class="tbl"><table><tr><th>m/z</th><th>Likely fragment</th></tr>
<tr><td>15</td><td>CH₃⁺</td></tr><tr><td>29</td><td>C₂H₅⁺ or CHO⁺</td></tr><tr><td>31</td><td>CH₂OH⁺ (primary alcohol)</td></tr><tr><td>43</td><td>C₃H₇⁺ or CH₃CO⁺</td></tr><tr><td>45</td><td>COOH⁺</td></tr></table></div>
<p>Fragments help tell isomers apart: propan-1-ol gives a peak at 31 (CH₂OH⁺); propan-2-ol gives a peak at 45 (CH₃CHOH⁺) instead.</p>

<h2>Putting it together</h2>
<p>Combine evidence to identify a compound:</p>
<ol>
<li><strong>Elemental analysis</strong> (percentage composition) gives the empirical formula (2.1.3).</li>
<li>The <strong>molecular ion peak</strong> gives M<sub>r</sub>, so the molecular formula.</li>
<li><strong>IR</strong> identifies the functional groups.</li>
<li><strong>Fragment peaks</strong> help decide the structure.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> A compound is 66.7% C, 11.1% H, 22.2% O. Its molecular ion is at m/z 72. The IR shows a strong peak at 1715 cm⁻¹ and no broad O–H. The mass spectrum has a peak at m/z 43. Identify it.</p>
$$\\mathrm{C}:\\ \\dfrac{66.7}{12.0}=5.56$$$$\\mathrm{H}:\\ \\dfrac{11.1}{1.0}=11.1$$$$\\mathrm{O}:\\ \\dfrac{22.2}{16.0}=1.39$$<p>Dividing by 1.39 gives 4 : 8 : 1, so the empirical formula is C₄H₈O (M = 72), which is also the molecular formula.</p>
<p>C=O, no O–H: aldehyde or ketone. m/z 43 = CH₃CO⁺. The compound is <strong>butanone, CH₃COCH₂CH₃</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> when you use a spectrum, quote the wavenumber (or m/z) <em>and</em> the bond or fragment it shows. "Peak at 1720 cm⁻¹ shows C=O" earns the mark; "there is a C=O" does not.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
