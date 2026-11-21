/* Full topic notes, Module 6: Organic chemistry and analysis. Replace the short notes in m6.js (loaded after it). */
(function(){
const N={};

N['6.1.1']=`
<h2>The structure of benzene</h2>
<p>Benzene, C₆H₆, is a planar hexagonal ring of six carbon atoms, each bonded to one hydrogen. Two models have been used to describe it.</p>
<h3>The Kekulé model</h3>
<p>Kekulé (1865) proposed a ring of alternating single and double C=C bonds (cyclohexa-1,3,5-triene). Three pieces of evidence show this is wrong:</p>
<ul>
<li><strong>Bond lengths</strong>: X-ray diffraction shows all six C–C bonds are the <strong>same length</strong> (0.139 nm), between a single C–C (0.153 nm) and a double C=C (0.134 nm). Kekulé's model predicts two different lengths.</li>
<li><strong>Enthalpy of hydrogenation</strong>: hydrogenating cyclohexene (one C=C) releases −120 kJ mol⁻¹, so Kekulé's structure should release 3 × −120 = −360 kJ mol⁻¹. Benzene actually releases only <strong>−208 kJ mol⁻¹</strong>: it is about 150 kJ mol⁻¹ <strong>more stable</strong> than predicted.</li>
<li><strong>Resistance to reaction</strong>: benzene does <strong>not decolourise bromine water</strong> and doesn't easily undergo addition, unlike alkenes.</li>
</ul>
<h3>The delocalised model</h3>
<ul>
<li>Each carbon uses three electrons in σ-bonds (two to neighbouring carbons, one to H), forming a planar ring with 120° bond angles.</li>
<li>Each carbon has one electron left in a <strong>p orbital</strong> above and below the plane.</li>
<li>The p orbitals <strong>overlap sideways</strong> with both neighbours, forming a ring of <strong>delocalised π-electrons</strong> above and below the plane of the ring (six electrons, spread over all six carbons).</li>
<li>So all C–C bonds are identical, and the delocalisation makes benzene unusually stable.</li>
</ul>
<p>Draw benzene as a hexagon with a circle inside. In naming, benzene is the parent (chlorobenzene, nitrobenzene, methylbenzene); with some groups it becomes a substituent called <strong>phenyl</strong> (phenylamine C₆H₅NH₂, phenol C₆H₅OH; benzoic acid is C₆H₅COOH).</p>

<h2>Electrophilic substitution</h2>
<p>Benzene's delocalised π-electrons attract electrophiles, but addition would destroy the stable delocalised system. So benzene reacts by <strong>electrophilic substitution</strong>: an H atom is replaced, and the delocalised ring is restored.</p>
<h3>The general mechanism</h3>
<ol>
<li>The electrophile (E⁺) is generated.</li>
<li>A curly arrow from the <strong>delocalised ring</strong> to E⁺: a new C–E bond forms, giving an intermediate with a broken ring (drawn as a horseshoe with a + inside, opening toward the sp³ carbon).</li>
<li>A curly arrow from the <strong>C–H bond</strong> back into the ring: H⁺ is lost and the delocalised ring is restored.</li>
</ol>
<h3>Nitration</h3>
<p>Benzene + <strong>concentrated nitric acid</strong> with <strong>concentrated sulfuric acid</strong> catalyst, at <strong>50 °C</strong> (or below, to avoid further nitration):</p>
<div class="rxn">C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O</div>
<p>The electrophile is the <strong>nitronium ion, NO₂⁺</strong>: HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻ + H₂O. Then H⁺ + HSO₄⁻ → H₂SO₄ regenerates the catalyst. Nitrobenzene is used to make dyes (via phenylamine) and explosives.</p>
<h3>Halogenation</h3>
<p>Benzene doesn't react with Br₂ alone. It needs a <strong>halogen carrier</strong> catalyst such as AlCl₃, FeCl₃, AlBr₃ or FeBr₃ (or iron filings, which react with the halogen to form one), at room temperature:</p>
<div class="rxn">C₆H₆ + Br₂ → C₆H₅Br + HBr</div>
<p>The halogen carrier makes the electrophile: Br₂ + FeBr₃ → <strong>Br⁺</strong> + FeBr₄⁻. After substitution: H⁺ + FeBr₄⁻ → FeBr₃ + HBr.</p>
<h3>Friedel–Crafts reactions</h3>
<p>These form <strong>C–C bonds</strong> to a benzene ring, using a halogen carrier (AlCl₃) catalyst:</p>
<ul>
<li><strong>Alkylation</strong>: with a haloalkane. C₆H₆ + CH₃CH₂Cl → C₆H₅CH₂CH₃ + HCl. Electrophile: CH₃CH₂⁺ (from RCl + AlCl₃ → R⁺ + AlCl₄⁻).</li>
<li><strong>Acylation</strong>: with an <strong>acyl chloride</strong>, forming an aromatic ketone. C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl. Electrophile: CH₃CO⁺ (acylium ion).</li>
</ul>
<h3>Why benzene resists bromine where alkenes don't</h3>
<p>In an alkene the π-electrons are <strong>localised</strong> between two carbons: a region of high electron density that polarises Br₂ enough to react. In benzene the π-electrons are <strong>delocalised</strong> over six carbons, so the electron density at any one bond is lower: it can't polarise Br₂ enough. A halogen carrier is needed to make a stronger electrophile.</p>

<h2>Phenols</h2>
<p>A <strong>phenol</strong> has an –OH group bonded <strong>directly to a benzene ring</strong>.</p>
<h3>Acidity</h3>
<p>Phenol is a <strong>weak acid</strong>: C₆H₅OH ⇌ C₆H₅O⁻ + H⁺. It is more acidic than alcohols but less acidic than carboxylic acids.</p>
<ul>
<li>Phenol reacts with <strong>sodium hydroxide</strong>: C₆H₅OH + NaOH → C₆H₅ONa + H₂O (sodium phenoxide).</li>
<li>Phenol does <strong>not</strong> react with <strong>sodium carbonate</strong> (not acidic enough), but carboxylic acids do (effervescence). This distinguishes them.</li>
</ul>
<h3>Bromination of phenol</h3>
<p>Phenol reacts with <strong>bromine water at room temperature, without a catalyst</strong>, decolourising it and forming a <strong>white precipitate</strong> of 2,4,6-tribromophenol:</p>
<div class="rxn">C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr</div>
<p>Phenol nitrates with dilute nitric acid at room temperature too (giving 2- and 4-nitrophenol). Why is phenol so much more reactive than benzene? A <strong>lone pair on the oxygen</strong> is partially <strong>delocalised into the ring</strong>, increasing its electron density. The ring is <strong>activated</strong>: it can polarise Br₂ and attract electrophiles more strongly.</p>
<h3>Directing groups</h3>
<p>A group already on the ring decides where the next substituent goes:</p>
<ul>
<li><strong>2- and 4-directing</strong> (activating): –OH, –NH₂.</li>
<li><strong>3-directing</strong> (deactivating): –NO₂.</li>
</ul>
<p>You'll be given this information, and need to apply it to predict products of multi-step syntheses.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> the benzene evidence question needs data: "all C–C bonds are 0.139 nm", "Δ<sub>hydrogenation</sub> is −208, not the −360 kJ mol⁻¹ predicted", "doesn't decolourise bromine water". Quote the numbers when they are given.</p></blockquote>
`;

N['6.1.2']=`
<h2>Aldehydes and ketones</h2>
<p>Both contain the <strong>carbonyl group</strong>, C=O.</p>
<ul>
<li><strong>Aldehydes</strong>: the C=O is at the <strong>end</strong> of the chain, –CHO. Named -al: methanal HCHO, ethanal CH₃CHO, propanal.</li>
<li><strong>Ketones</strong>: the C=O is <strong>within</strong> the chain, bonded to two carbons. Named -one: propanone CH₃COCH₃, butanone, pentan-2-one.</li>
</ul>
<p>The C=O bond is polar (O is δ−, C is δ+). Unlike C=C, it is attacked by <strong>nucleophiles</strong> at the δ+ carbon.</p>

<h2>Oxidation of aldehydes</h2>
<p>Aldehydes are oxidised to <strong>carboxylic acids</strong> by heating under reflux with acidified dichromate (orange → green):</p>
<div class="rxn">CH₃CHO + [O] → CH₃COOH</div>
<p>Ketones are <strong>not</strong> oxidised: there's no H on the carbonyl carbon to remove.</p>

<h2>Nucleophilic addition</h2>
<h3>Reduction with NaBH₄</h3>
<p><strong>Sodium tetrahydridoborate(III), NaBH₄</strong>, in aqueous solution, reduces carbonyls to alcohols. The reducing agent is written as <strong>[H]</strong>.</p>
<div class="rxn">aldehyde → primary alcohol: CH₃CHO + 2[H] → CH₃CH₂OH<br>ketone → secondary alcohol: CH₃COCH₃ + 2[H] → CH₃CH(OH)CH₃</div>
<h3>Addition of HCN</h3>
<p>Using <strong>NaCN and H₂SO₄</strong> (which make HCN in the flask; HCN itself is a very toxic gas), carbonyls form <strong>hydroxynitriles</strong>. This adds a carbon to the chain (see 6.2.4).</p>
<div class="rxn">CH₃CHO + HCN → CH₃CH(OH)CN &nbsp;&nbsp;(2-hydroxypropanenitrile)</div>
<h3>The mechanism</h3>
<p>The nucleophile is the <strong>hydride ion, H⁻</strong> (from NaBH₄) or the <strong>cyanide ion, CN⁻</strong>.</p>
<ol>
<li>A curly arrow from the <strong>lone pair</strong> on the nucleophile (H⁻ or the carbon of :CN⁻) to the <strong>δ+ carbon</strong> of C=O.</li>
<li>At the same time a curly arrow from the <strong>C=O π-bond</strong> to the oxygen, giving an <strong>intermediate</strong> with O⁻.</li>
<li>A curly arrow from a <strong>lone pair on O⁻</strong> to an H of water (or H⁺), forming the –OH; with water, OH⁻ is released.</li>
</ol>
<p>When CN⁻ adds to an aldehyde (other than methanal) or an unsymmetrical ketone, the planar C=O can be attacked from either side equally, so a <strong>racemic mixture</strong> of optical isomers forms (6.2.2).</p>

<h2>Tests</h2>
<h3>2,4-DNP: any carbonyl</h3>
<p>Add <strong>2,4-dinitrophenylhydrazine</strong> (Brady's reagent). An <strong>orange precipitate</strong> shows an aldehyde or ketone. Carboxylic acids and esters don't react. The precipitate can be <strong>recrystallised</strong> and its <strong>melting point</strong> measured and compared with known values to identify exactly which carbonyl compound it came from.</p>
<h3>Tollens' reagent: aldehydes only</h3>
<p><strong>Tollens' reagent</strong> is ammoniacal silver nitrate (Ag⁺ in aqueous ammonia). Warm it with the compound in a water bath. An <strong>aldehyde</strong> gives a <strong>silver mirror</strong> (Ag⁺ is reduced to Ag while the aldehyde is oxidised to a carboxylic acid). A ketone gives no change.</p>
<div class="rxn">Ag⁺ + e⁻ → Ag</div>
<blockquote class="tip"><p><strong>Exam tip:</strong> in the nucleophilic addition mechanism, the dipole on C=O must be shown, the first arrow must start from the lone pair (on the C of CN⁻ or on H⁻), and the intermediate must carry a negative charge on oxygen.</p></blockquote>
`;

N['6.1.3']=`
<h2>Carboxylic acids</h2>
<p>Carboxylic acids contain the <strong>carboxyl group, –COOH</strong>. Named -oic acid: methanoic acid HCOOH, ethanoic acid CH₃COOH, benzoic acid C₆H₅COOH. Dicarboxylic acids: ethanedioic acid HOOC–COOH.</p>
<h3>Solubility</h3>
<p>The C=O and O–H groups both form <strong>hydrogen bonds</strong> with water, so small carboxylic acids are very soluble. Solubility falls as the non-polar chain gets longer.</p>
<h3>Acidity</h3>
<p>Carboxylic acids are <strong>weak acids</strong>: CH₃COOH ⇌ CH₃COO⁻ + H⁺. They show all the typical acid reactions (redox with metals, neutralisation with bases):</p>
<div class="rxn">2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂<br>CH₃COOH + NaOH → CH₃COONa + H₂O<br>2CH₃COOH + CaO → (CH₃COO)₂Ca + H₂O<br>2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂</div>
<p>The reaction with carbonates (<strong>effervescence</strong>) is the test for a carboxylic acid: phenols and alcohols don't react with carbonates. Salts are named -oate: sodium ethanoate.</p>

<h2>Esters</h2>
<p>Esters contain the group –COO–. They are named from the alcohol (as an alkyl group) then the acid (-oate): CH₃COOCH₂CH₃ is <strong>ethyl ethanoate</strong> (from ethanol and ethanoic acid). Esters have sweet, fruity smells and are used in perfumes, flavourings and as solvents.</p>
<h3>Making esters (esterification)</h3>
<ul>
<li><strong>Carboxylic acid + alcohol</strong>, with a <strong>concentrated sulfuric acid</strong> catalyst, warmed. Reversible, so the yield is limited:<div class="rxn">CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O</div></li>
<li><strong>Acid anhydride + alcohol</strong>, warmed. Not reversible, so a better yield:<div class="rxn">(CH₃CO)₂O + CH₃OH → CH₃COOCH₃ + CH₃COOH</div>An acid anhydride is two carboxylic acid molecules joined with the loss of water.</li>
</ul>
<h3>Hydrolysis of esters</h3>
<ul>
<li><strong>Acid hydrolysis</strong>: heat under reflux with dilute acid. The reverse of esterification, so it's <strong>reversible</strong>: products are the carboxylic acid and alcohol.</li>
<li><strong>Alkaline hydrolysis</strong>: heat under reflux with aqueous NaOH. <strong>Not reversible</strong>; products are the <strong>carboxylate salt</strong> and the alcohol. This is how soap is made from fats.<div class="rxn">CH₃COOCH₂CH₃ + NaOH → CH₃COONa + CH₃CH₂OH</div></li>
</ul>

<h2>Acyl chlorides</h2>
<p><strong>Acyl chlorides</strong> contain –COCl, named -oyl chloride: ethanoyl chloride CH₃COCl. They are made from carboxylic acids with <strong>thionyl chloride, SOCl₂</strong>:</p>
<div class="rxn">CH₃COOH + SOCl₂ → CH₃COCl + SO₂ + HCl</div>
<p>Both by-products are gases, which makes the acyl chloride easy to purify. Acyl chlorides are <strong>very reactive</strong> (the carbonyl carbon is bonded to two electronegative atoms, O and Cl, so it's strongly δ+). They react vigorously and irreversibly, giving misty fumes of HCl:</p>
<div class="tbl"><table><tr><th>Reacts with</th><th>Product</th><th>Equation</th></tr>
<tr><td>water</td><td>carboxylic acid</td><td>CH₃COCl + H₂O → CH₃COOH + HCl</td></tr>
<tr><td>alcohol</td><td>ester</td><td>CH₃COCl + CH₃OH → CH₃COOCH₃ + HCl</td></tr>
<tr><td>phenol</td><td>ester (phenols don't esterify with acids)</td><td>CH₃COCl + C₆H₅OH → CH₃COOC₆H₅ + HCl</td></tr>
<tr><td>ammonia</td><td>primary amide</td><td>CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl</td></tr>
<tr><td>primary amine</td><td>secondary amide</td><td>CH₃COCl + 2CH₃NH₂ → CH₃CONHCH₃ + CH₃NH₃Cl</td></tr></table></div>
<p>With ammonia and amines, two moles are used: the second neutralises the HCl formed.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> an ester's name comes from the alcohol first, but its formula usually puts the acid part first: methyl propanoate is CH₃CH₂COOCH₃. Find the C=O: the side with the C=O came from the acid.</p></blockquote>
`;

N['6.2.1']=`
<h2>Amines</h2>
<p>Amines are derivatives of ammonia in which one or more H atoms are replaced by carbon chains or rings.</p>
<ul>
<li><strong>Primary</strong> amines: one carbon attached to N, –NH₂ (methylamine CH₃NH₂, ethylamine).</li>
<li><strong>Secondary</strong>: two carbons on N (dimethylamine (CH₃)₂NH).</li>
<li><strong>Tertiary</strong>: three carbons on N (trimethylamine (CH₃)₃N).</li>
<li><strong>Aromatic</strong> amines: N attached to a benzene ring (<strong>phenylamine</strong>, C₆H₅NH₂).</li>
</ul>
<h3>Basicity</h3>
<p>The nitrogen has a <strong>lone pair</strong> that can accept a proton, so amines are <strong>bases</strong> (Brønsted–Lowry proton acceptors), like ammonia.</p>
<div class="rxn">CH₃NH₂ + H₂O ⇌ CH₃NH₃⁺ + OH⁻</div>
<p>Amines react with acids to form <strong>salts</strong>:</p>
<div class="rxn">CH₃CH₂NH₂ + HCl → CH₃CH₂NH₃⁺Cl⁻ &nbsp;&nbsp;(ethylammonium chloride)<br>2CH₃NH₂ + H₂SO₄ → (CH₃NH₃⁺)₂SO₄²⁻</div>

<h2>Making aliphatic amines</h2>
<p>Heat a haloalkane with <strong>excess ethanolic ammonia</strong> (ammonia dissolved in ethanol; water would cause hydrolysis to an alcohol instead). Ammonia is the nucleophile:</p>
<div class="rxn">CH₃CH₂Br + 2NH₃ → CH₃CH₂NH₂ + NH₄Br</div>
<p>The second NH₃ removes the H⁺ (as NH₄Br). The product amine also has a lone pair and can attack more haloalkane, forming secondary and tertiary amines and quaternary ammonium salts. <strong>Excess ammonia</strong> makes the primary amine the main product. Using a primary amine instead of ammonia gives a secondary amine.</p>

<h2>Making aromatic amines</h2>
<p>Phenylamine is made by reducing <strong>nitrobenzene</strong> with <strong>tin and concentrated hydrochloric acid</strong>, heated under reflux, followed by excess NaOH (the acidic conditions first give the salt, C₆H₅NH₃⁺; the alkali releases the amine):</p>
<div class="rxn">C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O</div>
<p>Phenylamine is used to make dyes. So benzene → nitrobenzene → phenylamine is a two-step route to aromatic amines.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> when an amine reacts with an acid, the product is a salt, not a covalent compound. Draw the N with four bonds and a + charge, and the anion separately.</p></blockquote>
`;

N['6.2.2']=`
<h2>Amino acids</h2>
<p>An <strong>α-amino acid</strong> has an amine group and a carboxylic acid group attached to the <strong>same carbon atom</strong>. General formula: <strong>RCH(NH₂)COOH</strong>, where R is a side chain that differs between amino acids (R = H in glycine, CH₃ in alanine).</p>
<p>Because it has both a basic and an acidic group, an amino acid reacts with acids and with bases:</p>
<ul>
<li><strong>With an acid</strong>: the –NH₂ group is protonated. HOOCCH(R)NH₂ + HCl → HOOCCH(R)NH₃⁺Cl⁻.</li>
<li><strong>With an alkali</strong>: the –COOH is neutralised. HOOCCH(R)NH₂ + NaOH → Na⁺⁻OOCCH(R)NH₂ + H₂O.</li>
<li><strong>Esterification</strong>: with an alcohol and concentrated H₂SO₄ catalyst, the –COOH forms an ester (and in the acid, –NH₂ is protonated).</li>
</ul>

<h2>Amides</h2>
<p>Amides contain –CONH–. <strong>Primary</strong> amides have –CONH₂ (ethanamide CH₃CONH₂). <strong>Secondary</strong> amides have one carbon on N (N-methylethanamide CH₃CONHCH₃). They are made from acyl chlorides and ammonia or amines (6.1.3). Amide links join amino acids in proteins and monomers in polyamides (6.2.3).</p>

<h2>Optical isomerism (chirality)</h2>
<p>A <strong>chiral centre</strong> is a carbon atom attached to <strong>four different atoms or groups</strong>. Mark it with an asterisk *. A molecule with one chiral centre exists as two <strong>optical isomers</strong> (enantiomers): stereoisomers that are <strong>non-superimposable mirror images</strong> of each other, like left and right hands.</p>
<h3>Drawing optical isomers</h3>
<p>Draw the chiral carbon with two bonds in the plane of the paper (plain lines), one coming <strong>towards</strong> you (wedge) and one going <strong>away</strong> (dashed wedge), arranged tetrahedrally. Then draw the mirror image with a mirror line between them.</p>
<svg class="diagram" viewBox="0 0 460 170" role="img" aria-label="Two optical isomers of alanine drawn as 3D mirror images either side of a dashed mirror line">
<g><text x="90" y="85">C</text><line class="wire" x1="98" y1="72" x2="98" y2="44"/><text x="78" y="38">COOH</text><line class="wire" x1="90" y1="88" x2="56" y2="110"/><text x="20" y="124">H₃C</text>
<path class="fill1" d="M104 88 L140 110 L134 116 Z"/><text x="138" y="130">NH₂</text><line class="wire dash" x1="108" y1="78" x2="140" y2="64"/><text x="144" y="64">H</text></g>
<line class="dimline dash" x1="230" y1="20" x2="230" y2="150"/><text x="212" y="166" class="small">mirror</text>
<g><text x="354" y="85">C</text><line class="wire" x1="362" y1="72" x2="362" y2="44"/><text x="342" y="38">COOH</text><line class="wire" x1="370" y1="88" x2="404" y2="110"/><text x="406" y="124">CH₃</text>
<path class="fill1" d="M356 88 L320 110 L326 116 Z"/><text x="292" y="130">H₂N</text><line class="wire dash" x1="352" y1="78" x2="320" y2="64"/><text x="306" y="64">H</text></g>
</svg>
<ul>
<li>All α-amino acids except glycine (where R = H, so the carbon has two H atoms) are chiral.</li>
<li>Optical isomers have identical chemical reactions (except with other chiral molecules) and physical properties, but rotate plane-polarised light in opposite directions. A 50 : 50 mixture is a <strong>racemic mixture</strong> and doesn't rotate the light.</li>
<li>In drugs, often only one enantiomer is active; the other may be inactive or harmful. Synthesising a single enantiomer (using chiral catalysts, enzymes or natural chiral starting materials) avoids this, though it can be costly.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Does butan-2-ol, CH₃CH(OH)CH₂CH₃, have optical isomers?</p>
<p>Carbon 2 is bonded to H, OH, CH₃ and C₂H₅: four different groups, so it is a chiral centre. <strong>Yes</strong>: two optical isomers.</p>
<p>Butan-1-ol has no carbon with four different groups, so no optical isomers.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> when you draw optical isomers, make sure the four groups are the same in both and that the second really is the mirror image: the easiest way is to swap the positions of any two groups.</p></blockquote>
`;

N['6.2.3']=`
<h2>Condensation polymerisation</h2>
<p>In <strong>condensation polymerisation</strong>, monomers with <strong>two functional groups</strong> each react together, and a <strong>small molecule</strong> (usually H₂O, or HCl if an acyl chloride is used) is lost each time a link forms. This contrasts with addition polymerisation (4.1.3), where alkenes join and nothing is lost.</p>
<h3>Polyesters</h3>
<p>Formed by joining monomers with <strong>ester links</strong>, –COO–:</p>
<ul>
<li>a <strong>dicarboxylic acid</strong> + a <strong>diol</strong>, e.g. benzene-1,4-dicarboxylic acid + ethane-1,2-diol → <strong>PET (Terylene)</strong>, used in drinks bottles and clothing fibres;</li>
<li>or a single monomer with <strong>both groups</strong> (a hydroxycarboxylic acid), e.g. lactic acid (2-hydroxypropanoic acid) → <strong>poly(lactic acid)</strong>, a biodegradable polymer.</li>
</ul>
<div class="rxn">n HOOC–C₆H₄–COOH + n HO–CH₂CH₂–OH → –[OC–C₆H₄–COO–CH₂CH₂–O]ₙ– + 2n H₂O</div>
<h3>Polyamides</h3>
<p>Formed by joining monomers with <strong>amide links</strong>, –CONH–:</p>
<ul>
<li>a <strong>dicarboxylic acid</strong> (or diacyl dichloride) + a <strong>diamine</strong>, e.g. hexanedioic acid + 1,6-diaminohexane → <strong>nylon-6,6</strong>;</li>
<li>benzene-1,4-dicarboxylic acid + benzene-1,4-diamine → <strong>Kevlar</strong> (very strong, used in body armour);</li>
<li>or <strong>amino acids</strong>, which have both groups: they join by amide (peptide) links to make <strong>proteins</strong>.</li>
</ul>
<h3>Drawing repeat units</h3>
<ol>
<li>Draw the two monomers side by side.</li>
<li>Remove –OH from the acid end and –H from the alcohol or amine end (these make H₂O).</li>
<li>Join them with the ester or amide link and put square brackets with extension bonds around one unit of each monomer.</li>
</ol>
<p>To find monomers from a polymer, break each ester or amide link and add back –OH to the C=O side and –H to the O or N side.</p>

<h2>Hydrolysis of condensation polymers</h2>
<p>Ester and amide links can be broken by hydrolysis, so condensation polymers are generally <strong>biodegradable</strong> (unlike addition polymers).</p>
<ul>
<li><strong>Polyesters</strong>: <strong>acid</strong> hydrolysis gives the dicarboxylic acid and diol; <strong>alkaline</strong> hydrolysis (NaOH) gives the <strong>carboxylate salt</strong> and diol.</li>
<li><strong>Polyamides</strong>: <strong>acid</strong> hydrolysis gives the dicarboxylic acid and the <strong>ammonium salt</strong> of the diamine (the –NH₂ is protonated); <strong>alkaline</strong> hydrolysis gives the <strong>carboxylate salt</strong> and the diamine.</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> the products of hydrolysis depend on the conditions. In acid, amines come out as –NH₃⁺ salts; in alkali, acids come out as –COO⁻ salts. Check you've drawn the right form for the reagent given.</p></blockquote>
`;

N['6.2.4']=`
<h2>Why form C–C bonds?</h2>
<p>Many syntheses need a longer carbon chain than the starting material. Forming a new C–C bond is the way to <strong>increase the length of the carbon chain</strong>.</p>
<h2>Nitriles</h2>
<p>Nitriles contain the –C≡N group. Two ways to make them, each adding <strong>one carbon</strong>:</p>
<ul>
<li><strong>From a haloalkane</strong>: heat with <strong>sodium cyanide (or potassium cyanide) in ethanol</strong>. Nucleophilic substitution, with CN⁻ as the nucleophile:<div class="rxn">CH₃CH₂Br + CN⁻ → CH₃CH₂CN + Br⁻ &nbsp;&nbsp;(propanenitrile)</div></li>
<li><strong>From a carbonyl compound</strong>: <strong>HCN</strong> (made from NaCN and H₂SO₄) adds by nucleophilic addition, giving a hydroxynitrile:<div class="rxn">CH₃CHO + HCN → CH₃CH(OH)CN</div></li>
</ul>
<p>The nitrile carbon counts in the name: CH₃CH₂CN is propanenitrile (3 carbons).</p>
<h3>Reactions of nitriles</h3>
<ul>
<li><strong>Reduction to amines</strong>: H₂ with a <strong>nickel catalyst</strong> (or LiAlH₄): CH₃CH₂CN + 2H₂ → CH₃CH₂CH₂NH₂ (propylamine).</li>
<li><strong>Hydrolysis to carboxylic acids</strong>: heat under reflux with <strong>dilute aqueous acid</strong> (e.g. HCl): CH₃CH₂CN + 2H₂O + H⁺ → CH₃CH₂COOH + NH₄⁺.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Suggest a two-step synthesis of propanoic acid from bromoethane.</p>
<p>Step 1: bromoethane + NaCN in ethanol, heat → propanenitrile (adds one carbon).</p>
<p>Step 2: propanenitrile + dilute HCl, heat under reflux → <strong>propanoic acid</strong>.</p></div>

<h2>Friedel–Crafts reactions</h2>
<p>On aromatic rings, C–C bonds are formed by <strong>Friedel–Crafts alkylation</strong> (with a haloalkane) and <strong>acylation</strong> (with an acyl chloride), both with a <strong>halogen carrier</strong> such as AlCl₃ (see 6.1.1).</p>
<div class="rxn">C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl<br>C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl</div>
<p>Acylation is often preferred, because alkylation can continue to give several alkyl groups on the ring.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> the solvent matters for cyanide reactions: NaCN in <strong>ethanol</strong> for haloalkanes (water would give the alcohol). Don't confuse it with HCN for carbonyls.</p></blockquote>
`;

N['6.2.5']=`
<h2>Practical techniques for organic solids</h2>
<h3>Filtration under reduced pressure</h3>
<p>Used to separate a solid product from a liquid quickly. A <strong>Büchner funnel</strong> with a filter paper fits into a side-arm (Büchner) flask connected to a water pump. Wet the paper with solvent first so it seals; pour in the mixture; the suction pulls the liquid through, leaving a fairly dry solid. Wash with a little cold solvent.</p>
<h3>Recrystallisation</h3>
<p>Purifies an impure solid. It relies on the product being <strong>much more soluble in the hot solvent than in the cold</strong>, while impurities either stay dissolved or don't dissolve at all.</p>
<ol>
<li>Dissolve the impure solid in the <strong>minimum volume of hot solvent</strong> (so the solution is saturated and as much as possible crystallises on cooling).</li>
<li>If there are insoluble impurities, filter the hot solution (using a pre-heated funnel).</li>
<li>Let the solution <strong>cool slowly</strong>, then in ice. Crystals of the product form; soluble impurities stay in solution.</li>
<li>Filter under reduced pressure, wash with a little <strong>ice-cold solvent</strong> (to remove the impure solution without dissolving much product).</li>
<li>Dry the crystals (in air, in a warm oven, or a desiccator).</li>
</ol>
<h3>Melting point determination</h3>
<p>Pack a little solid into a sealed capillary tube and heat slowly in a melting-point apparatus (or a Thiele tube of oil). A <strong>pure</strong> compound melts <strong>sharply</strong> at its literature value. <strong>Impurities lower the melting point and make it melt over a wider range.</strong> Compare with a data-book value to check identity and purity.</p>

<h2>Recognising functional groups</h2>
<p>Molecules in A level questions often have several functional groups (for example a drug molecule with an amine, an ester, an alcohol and a benzene ring). You need to identify each one and predict how the molecule reacts with a given reagent: each group reacts independently. A reagent such as NaOH(aq) might hydrolyse an ester and neutralise a phenol and a carboxylic acid in the same molecule.</p>

<h2>Multi-stage synthesis</h2>
<p>Synthesis questions give a starting compound and a target and ask for a route, with reagents and conditions for each step. Work <strong>forwards</strong> from the starting material and <strong>backwards</strong> from the target until they meet. Look at what has changed:</p>
<ul>
<li>Has the <strong>carbon chain got longer</strong>? You need a C–C bond: a nitrile (from a haloalkane or carbonyl), or Friedel–Crafts on a ring.</li>
<li>Has a <strong>functional group changed</strong>? Find a sequence on the reaction map (e.g. alcohol → haloalkane → nitrile → amine).</li>
<li>Is a <strong>group on a benzene ring</strong> involved? Use nitration, reduction to phenylamine, halogenation, Friedel–Crafts, and consider directing effects.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Suggest a three-step route from ethanol to propylamine (CH₃CH₂CH₂NH₂).</p>
<p>The chain goes from 2 to 3 carbons, and ends with an amine: think "nitrile, then reduce".</p>
<p>1. Ethanol + NaBr and conc. H₂SO₄, heat → bromoethane.</p>
<p>2. Bromoethane + NaCN in ethanol, heat → propanenitrile.</p>
<p>3. Propanenitrile + H₂, Ni catalyst → <strong>propylamine</strong>.</p></div>
<p>The full map of reactions, with reagents and conditions for every step, is on the <a href="#rxmap">Reaction map</a> page.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> for each step, give reagent(s), conditions (heat, reflux, catalyst, solvent) and the structure of the intermediate. Marks are often lost for a missing "conc." or "under reflux".</p></blockquote>
`;

N['6.3.1']=`
<h2>Chromatography</h2>
<p>Chromatography separates the components of a mixture. Every method has a <strong>stationary phase</strong> (which stays still) and a <strong>mobile phase</strong> (which moves through it). Components separate because they have different affinities for the two phases: each spends a different amount of time <strong>adsorbed</strong> onto the stationary phase versus dissolved in the mobile phase, so they travel at different speeds.</p>
<h3>Thin-layer chromatography (TLC)</h3>
<ul>
<li><strong>Stationary phase</strong>: a thin layer of silica (SiO₂) or alumina (Al₂O₃) on a glass or plastic plate.</li>
<li><strong>Mobile phase</strong>: a solvent (or mixture).</li>
</ul>
<ol>
<li>Draw a pencil baseline (pencil doesn't dissolve) and spot the samples on it.</li>
<li>Stand the plate in a little solvent in a covered beaker, with the solvent below the baseline (so the samples don't dissolve into the pool).</li>
<li>Remove the plate when the solvent is near the top; mark the <strong>solvent front</strong> immediately.</li>
<li>Locate colourless spots under <strong>UV light</strong> or with <strong>iodine vapour</strong>.</li>
</ol>
<div class="eqgrid"><div>$$R_f=\\dfrac{\\text{distance moved by spot}}{\\text{distance moved by solvent front}}$$</div></div>
<p>A substance's R<sub>f</sub> is fixed for a given stationary phase and solvent, so it can be compared with known substances run on the same plate. A pure substance gives a single spot. More polar compounds are adsorbed more strongly onto polar silica, so they move less and have lower R<sub>f</sub>.</p>
<h3>Gas chromatography (GC)</h3>
<ul>
<li><strong>Stationary phase</strong>: a high-boiling liquid coated on a solid support, inside a long coiled column in an oven.</li>
<li><strong>Mobile phase</strong>: an unreactive carrier gas (helium or nitrogen).</li>
</ul>
<p>The <strong>retention time</strong> is the time from injection to detection: each compound has its own, so it identifies the compound (by comparison with a known sample under the same conditions). The <strong>area under each peak</strong> is proportional to the amount of that component, so GC also gives the relative composition. GC can be linked to a mass spectrometer (GC–MS) to identify each component, used in forensics, airport security and drug testing.</p>
<div class="wex"><p><strong>Worked example.</strong> A GC trace has two peaks with areas 30 and 90 units. What is the percentage composition?</p>
$$\\text{first component}=\\dfrac{30}{120}\\times 100=\\mathbf{25\\,\\%}$$$$\\text{second}=\\dfrac{90}{120}\\times 100=\\mathbf{75\\,\\%}$$</div>

<h2>Tests for organic functional groups</h2>
<div class="tbl"><table><tr><th>Group</th><th>Test</th><th>Positive result</th></tr>
<tr><td>alkene C=C</td><td>bromine water, shake</td><td>orange → colourless</td></tr>
<tr><td>haloalkane</td><td>warm with AgNO₃(aq) in ethanol</td><td>precipitate: white (Cl), cream (Br), yellow (I)</td></tr>
<tr><td>carbonyl (aldehyde or ketone)</td><td>2,4-DNP</td><td>orange precipitate</td></tr>
<tr><td>aldehyde</td><td>Tollens' reagent, warm</td><td>silver mirror</td></tr>
<tr><td>primary or secondary alcohol, aldehyde</td><td>acidified K₂Cr₂O₇, warm</td><td>orange → green</td></tr>
<tr><td>carboxylic acid</td><td>Na₂CO₃(aq) or NaHCO₃(aq)</td><td>effervescence; CO₂ turns limewater milky</td></tr>
<tr><td>phenol</td><td>bromine water</td><td>decolourised, white precipitate (and no fizz with carbonate)</td></tr></table></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> R<sub>f</sub> values have no units and are always less than 1. Measure both distances from the <strong>baseline</strong>, to the centre of the spot.</p></blockquote>
`;

N['6.3.2']=`
<h2>NMR spectroscopy</h2>
<p>Nuclear magnetic resonance (NMR) detects nuclei such as ¹H and ¹³C in a strong magnetic field. Atoms in different <strong>chemical environments</strong> (bonded to different groups) absorb at different frequencies, recorded as the <strong>chemical shift, δ</strong>, in <strong>ppm</strong> (parts per million).</p>
<h3>Practical points</h3>
<ul>
<li><strong>TMS</strong>, tetramethylsilane Si(CH₃)₄, is the <strong>reference standard</strong>, δ = 0. It is used because all 12 H (and 4 C) are in the same environment (one sharp peak), it absorbs outside the range of most organic compounds, and it is inert, non-toxic and volatile (easy to remove).</li>
<li>Samples are dissolved in a <strong>deuterated solvent</strong> such as CDCl₃. Deuterium (²H) doesn't produce a ¹H NMR signal, so the solvent doesn't add peaks.</li>
<li>Peaks from <strong>O–H and N–H</strong> protons can be identified with <strong>D₂O</strong>: shake the sample with D₂O; the H on O or N exchanges with D (–OH → –OD), and that peak <strong>disappears</strong> from the spectrum.</li>
</ul>

<h2>¹³C NMR</h2>
<ul>
<li>The <strong>number of peaks</strong> = the number of different <strong>carbon environments</strong>.</li>
<li>The <strong>chemical shift</strong> of each peak tells you the type of environment (look it up on the Data Sheet): C–C about 5–55, C–O and C–N 30–70 (C–O about 50–70), C=C and aromatic 100–150, C=O 160–220 ppm.</li>
<li>Peaks aren't split and peak heights don't matter at A level.</li>
</ul>
<p>Symmetry reduces the number of environments: propanone CH₃COCH₃ has 2 carbon environments (two equivalent CH₃ and one C=O); benzene has 1; methylbenzene has 5 (CH₃ and four ring environments).</p>
<div class="wex"><p><strong>Worked example.</strong> How many peaks in the ¹³C NMR spectra of propan-1-ol and propan-2-ol?</p>
<p>Propan-1-ol CH₃CH₂CH₂OH: all three carbons different → <strong>3 peaks</strong>.</p>
<p>Propan-2-ol CH₃CH(OH)CH₃: the two CH₃ are equivalent → <strong>2 peaks</strong>. So ¹³C NMR tells these isomers apart.</p></div>

<h2>¹H (proton) NMR</h2>
<p>A ¹H spectrum gives four pieces of information:</p>
<ol>
<li><strong>Number of peaks</strong> = number of different proton environments.</li>
<li><strong>Chemical shift</strong> = type of environment (Data Sheet): R–CH 0.5–2.0; H–C–C=O 2.0–3.0; H–C–O and H–C–N 3.0–4.3; aromatic H 6.5–8.0; aldehyde CHO 9.5–10.0; carboxylic acid COOH 10–12; alcohol O–H 0.5–5 (variable).</li>
<li><strong>Relative peak area</strong> (shown by an integration trace or ratio numbers) = <strong>relative number of protons</strong> in each environment.</li>
<li><strong>Splitting pattern</strong> = number of protons on <strong>adjacent carbons</strong>.</li>
</ol>
<h3>Spin–spin splitting: the n + 1 rule</h3>
<p>The signal for a set of protons is split by the protons on the <strong>neighbouring carbon(s)</strong>. If there are <strong>n</strong> equivalent H on adjacent carbons, the peak splits into <strong>n + 1</strong> lines.</p>
<div class="tbl"><table><tr><th>Neighbouring H (n)</th><th>Peaks (n + 1)</th><th>Name</th></tr>
<tr><td>0</td><td>1</td><td>singlet</td></tr><tr><td>1</td><td>2</td><td>doublet</td></tr><tr><td>2</td><td>3</td><td>triplet</td></tr><tr><td>3</td><td>4</td><td>quartet</td></tr></table></div>
<p>Protons on O or N usually appear as <strong>singlets</strong> and don't split their neighbours (they exchange rapidly). Equivalent protons don't split each other.</p>
<div class="wex"><p><strong>Worked example.</strong> Predict the ¹H NMR spectrum of ethanol, CH₃CH₂OH.</p>
<p>Three environments: CH₃, CH₂, OH, in the ratio <strong>3 : 2 : 1</strong>.</p>
<p>CH₃ (δ ≈ 1.2): next to CH₂ (2 H) → <strong>triplet</strong>. CH₂ (δ ≈ 3.7, next to O): next to CH₃ (3 H) → <strong>quartet</strong>. OH (δ ≈ 2–5): <strong>singlet</strong>, which disappears with D₂O.</p>
<p>A triplet plus quartet pattern is the signature of an <strong>ethyl group</strong>, CH₃CH₂–.</p></div>

<h2>Combining techniques</h2>
<p>Structure-determination questions give several pieces of evidence. Work through them in a fixed order and write down what each one shows:</p>
<ol>
<li><strong>Elemental analysis</strong> → empirical formula.</li>
<li><strong>Mass spectrum</strong>: molecular ion peak → M<sub>r</sub> → molecular formula; fragments → parts of the molecule.</li>
<li><strong>IR</strong> → functional groups (O–H, C=O, etc.).</li>
<li><strong>¹³C NMR</strong> → number and types of carbon environment.</li>
<li><strong>¹H NMR</strong> → proton environments, their ratio, neighbours (splitting), and which are O–H/N–H (D₂O).</li>
<li>Propose a structure and check it against <strong>every</strong> piece of data.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> A compound C₄H₈O₂ has an IR peak at 1740 cm⁻¹ and no broad O–H. Its ¹H NMR shows: δ 1.2 (3H, triplet), δ 2.0 (3H, singlet), δ 4.1 (2H, quartet). Identify it.</p>
<p>C=O, no O–H, two oxygens: an <strong>ester</strong>. Triplet (3H) + quartet (2H): an ethyl group; the quartet at δ 4.1 means the CH₂ is bonded to O (–O–CH₂CH₃).</p>
<p>Singlet (3H) at δ 2.0: a CH₃ next to C=O with no neighbouring H.</p>
<p>The compound is <strong>ethyl ethanoate, CH₃COOCH₂CH₃</strong>.</p></div>
<p>Practise with the problems on the <a href="#spec">Spectroscopy practice</a> page.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> for each ¹H peak, write a line: "δ 4.1, 2H, quartet: CH₂ bonded to O, next to a CH₃". Examiners award marks for each piece of evidence linked to a feature of the structure.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
