/* Modules 1 and 2: Practical skills; Foundations in chemistry.
   Notes are short AI-written summaries to check against the spec and a textbook. */
(function(){
const S=window.SPEC, N=S.notes;

S.addTopic({id:'1.1',mod:1,title:'Practical skills in the written exams',short:'Planning, implementing, analysing and evaluating experiments.',
spec:['Planning: designing experiments, choosing apparatus and identifying variables','Implementing: using apparatus and techniques safely; recording results with correct precision','Analysis: processing data, plotting graphs, calculating gradients and intercepts','Evaluation: percentage uncertainty and percentage error, anomalies, limitations and improvements'],
notes:N([['Uncertainty',['Uncertainty of one reading = ± half the smallest division (e.g. a 0.1 °C thermometer: ±0.05 °C).','A burette titre is two readings, so its uncertainty is ±0.05 cm³ × 2 = ±0.10 cm³.','Percentage uncertainty = uncertainty ÷ measured value × 100. Reduce it by measuring a larger quantity.']],
 ['Accuracy and precision',['Accurate: close to the true value. Precise: repeat results close together.','Concordant titres agree within 0.10 cm³.','Systematic errors shift every result the same way; random errors scatter results.']],
 ['Graphs',['Independent variable on the x-axis; label axes with quantity and unit; use more than half the grid.','Draw a line of best fit; ignore anomalies, but say that you have.']]]),
terms:[['Accuracy','How close a measurement is to the true value.'],['Precision','How close repeated measurements are to each other.'],['Percentage uncertainty','Uncertainty ÷ measured value × 100%.'],['Anomaly','A result that does not fit the pattern of the others.']],
eqs:[['$\\%\\ \\text{uncertainty}=\\dfrac{\\text{uncertainty}}{\\text{measured value}}\\times 100$','Uncertainty'],['$\\%\\ \\text{error}=\\dfrac{|\\text{experimental}-\\text{accepted}|}{\\text{accepted}}\\times 100$','Comparing with a data-book value']]});

S.addTopic({id:'1.2',mod:1,title:'Practical endorsement',short:'The PAGs and CPAC: the pass/fail practical endorsement.',
spec:['Carry out the twelve Practical Activity Groups (PAGs)','Meet the Common Practical Assessment Criteria (CPAC): follow methods, use apparatus safely, make and record observations, research and reference'],
notes:N([['What it is',['The practical endorsement is reported separately as Pass or Not classified; it does not change your A level grade.','Your teacher assesses you across the PAGs against the CPAC criteria.','The written papers still test practical skills, especially Paper 3.']]]),
pags:['p1-1','p2-1','p3-1','p4-1','p5-1','p6-1','p7-1','p8-1','p9-1','p10-1','p11-1']});

S.addTopic({id:'2.1.1',mod:2,title:'Atomic structure and isotopes',short:'Protons, neutrons, electrons, isotopes and relative masses.',pmt:'2.1.1 Atomic Structure and Isotopes',pags:[],
spec:['Isotopes: atoms of the same element with different numbers of neutrons','Atomic structure in terms of numbers of protons, neutrons and electrons for atoms and ions','Relative isotopic mass, relative atomic mass Aᵣ, relative molecular mass and relative formula mass','Using mass spectra to find relative isotopic masses and abundances, and calculate Aᵣ'],
notes:N([['Key ideas',['Atomic number = number of protons; mass number = protons + neutrons.','Isotopes have the same chemical properties (same electron configuration) but different physical properties such as density.','Relative masses are measured against 1/12 of the mass of an atom of carbon-12.']],
 ['Mass spectrometry',['Each peak is an isotope: m/z gives the isotopic mass, peak height gives the abundance.','Aᵣ = Σ(isotopic mass × abundance) ÷ Σ(abundance).']]]),
terms:[['Isotopes','Atoms of the same element with different numbers of neutrons and different masses.'],['Relative isotopic mass','The mass of an atom of an isotope compared with 1/12 of the mass of an atom of carbon-12.'],['Relative atomic mass','The weighted mean mass of an atom of an element compared with 1/12 of the mass of an atom of carbon-12.']],
eqs:[['$A_r=\\dfrac{\\bigsum(m\\times\\text{abundance})}{\\bigsum\\text{abundance}}$','Relative atomic mass from a mass spectrum']],
mcq:[{q:'Chlorine is 75% ³⁵Cl and 25% ³⁷Cl. What is its relative atomic mass?',o:['35.0','35.5','36.0','36.5'],a:1,e:'(35 × 75 + 37 × 25) ÷ 100 = 35.5'}]});

S.addTopic({id:'2.1.2',mod:2,title:'Compounds, formulae and equations',short:'Ionic formulae, balanced equations and state symbols.',pmt:'2.1.2 Compounds, Formulae and Equations',
spec:['Formulae of ionic compounds from ionic charges, including NO₃⁻, CO₃²⁻, SO₄²⁻, OH⁻, NH₄⁺, Zn²⁺ and Ag⁺','Balanced equations, full and ionic, with state symbols'],
notes:N([['Writing formulae',['The charges in an ionic compound must add up to zero, e.g. Al³⁺ and SO₄²⁻ give Al₂(SO₄)₃.','Learn the common ions: nitrate NO₃⁻, carbonate CO₃²⁻, sulfate SO₄²⁻, hydroxide OH⁻, ammonium NH₄⁺.']],
 ['Equations',['Balance by changing the numbers in front of formulae, never the formulae themselves.','Ionic equations leave out spectator ions, e.g. H⁺(aq) + OH⁻(aq) → H₂O(l).']]])});

S.addTopic({id:'2.1.3',mod:2,title:'Amount of substance',short:'The mole, empirical formulae, gas volumes, concentration and yields.',pmt:'2.1.3 Amount of Substance',pags:['p1-1'],
spec:['The mole, Avogadro constant and molar mass','Empirical and molecular formulae; water of crystallisation','Calculations using mass, gas volume (molar gas volume and pV = nRT) and solution concentration','Stoichiometry from equations; percentage yield and atom economy'],
notes:N([['Three ways to get moles',['From mass: n = m ÷ M.','From a solution: n = c × V (V in dm³).','From a gas at RTP: n = V ÷ 24.0 (V in dm³), or use pV = nRT in SI units.']],
 ['Yield and atom economy',['Percentage yield compares the actual amount made with the theoretical amount.','Atom economy compares the mass of the desired product with the total mass of all products; addition reactions have 100% atom economy.']]]),
terms:[['Mole','The amount of substance containing 6.02 × 10²³ particles (the Avogadro constant).'],['Empirical formula','The simplest whole-number ratio of atoms of each element in a compound.'],['Molecular formula','The number and type of atoms of each element in a molecule.'],['Molar mass','The mass per mole of a substance, in g mol⁻¹.']],
eqs:[['$n=\\dfrac{m}{M}$','Amount from mass'],['$n=c\\times V$','Amount in solution (V in dm³)'],['$n=\\dfrac{V}{24.0}$','Gas at RTP (V in dm³)'],['$pV=nRT$','Ideal gas equation (Pa, m³, K)'],['$\\%\\ \\text{yield}=\\dfrac{\\text{actual}}{\\text{theoretical}}\\times 100$','Yield'],['$\\text{atom economy}=\\dfrac{M(\\text{desired product})}{\\bigsum M(\\text{all products})}\\times 100$','Atom economy']],
mcq:[{q:'How many moles are in 4.0 g of NaOH (M = 40.0 g mol⁻¹)?',o:['0.010','0.10','1.0','10'],a:1,e:'n = m ÷ M = 4.0 ÷ 40.0 = 0.10 mol'},{q:'What volume does 0.50 mol of gas occupy at RTP?',o:['6.0 dm³','12.0 dm³','24.0 dm³','48.0 dm³'],a:1,e:'V = n × 24.0 = 12.0 dm³'}]});

S.addTopic({id:'2.1.4',mod:2,title:'Acids',short:'Acids, bases, alkalis, neutralisation and titrations.',pmt:'2.1.4 Acids',pags:['p2-1'],
spec:['Formulae of common acids (HCl, H₂SO₄, HNO₃, CH₃COOH) and alkalis (NaOH, KOH, NH₃)','Acids release H⁺ ions in solution; alkalis release OH⁻ ions','Strong and weak acids: complete and partial dissociation','Neutralisation by carbonates, metal oxides and alkalis','Acid–base titrations and the calculations, including making a standard solution'],
notes:N([['Key ideas',['A strong acid fully dissociates in water; a weak acid only partially dissociates.','Acid + carbonate → salt + water + carbon dioxide.','In neutralisation, H⁺(aq) + OH⁻(aq) → H₂O(l).']],
 ['Titrations',['Rinse the burette with the solution it will hold; read the bottom of the meniscus at eye level.','Repeat until you have concordant titres (within 0.10 cm³) and average only those.']]]),
terms:[['Strong acid','An acid that completely dissociates in water.'],['Weak acid','An acid that partially dissociates in water.'],['Alkali','A base that dissolves in water, releasing OH⁻ ions.'],['Standard solution','A solution of known concentration.']]});

S.addTopic({id:'2.1.5',mod:2,title:'Redox',short:'Oxidation numbers and redox reactions.',pmt:'2.1.5 Redox',
spec:['Rules for assigning oxidation numbers, including Roman numerals in names','Oxidation and reduction in terms of electron transfer and changes in oxidation number','Redox reactions of metals with acids'],
notes:N([['Oxidation numbers',['Elements are 0; oxygen is usually −2 (−1 in peroxides); hydrogen is usually +1 (−1 in metal hydrides).','The oxidation numbers in a compound add up to zero, and in an ion they add up to the charge.']],
 ['Redox',['OIL RIG: oxidation is loss of electrons, reduction is gain.','A metal reacting with an acid is oxidised; the H⁺ ions are reduced to H₂.']]]),
terms:[['Oxidation','Loss of electrons, or an increase in oxidation number.'],['Reduction','Gain of electrons, or a decrease in oxidation number.'],['Oxidising agent','A species that accepts electrons and is itself reduced.'],['Reducing agent','A species that donates electrons and is itself oxidised.']]});

S.addTopic({id:'2.2.1',mod:2,title:'Electron structure',short:'Shells, sub-shells, orbitals and electron configurations.',pmt:'2.2.1 Electron Structure',
spec:['Shells and the number of electrons each holds','Atomic orbitals: s, p and d; shapes of s and p orbitals','Filling order of sub-shells up to 4p, and electron configurations of atoms and ions'],
notes:N([['Key ideas',['An orbital holds up to two electrons with opposite spins.','s sub-shells hold 2 electrons, p hold 6 and d hold 10.','4s fills before 3d, but 4s electrons are also lost first when forming ions.']]]),
terms:[['Atomic orbital','A region around the nucleus that can hold up to two electrons, with opposite spins.']]});

S.addTopic({id:'2.2.2',mod:2,title:'Bonding and structure',short:'Ionic, covalent and metallic bonding; shapes of molecules; intermolecular forces.',pmt:'2.2.2 Bonding and Structure',
spec:['Ionic bonding and giant ionic lattices','Covalent and dative covalent bonds; average bond enthalpy','Shapes of molecules and ions by electron-pair repulsion (VSEPR), with bond angles','Electronegativity and bond polarity; polar molecules','Intermolecular forces: induced dipole–dipole (London), permanent dipole–dipole and hydrogen bonding','Simple molecular lattices and their properties'],
notes:N([['Shapes',['Lone pairs repel more than bonding pairs, so each lone pair cuts the bond angle by about 2.5°.','Linear 180°, trigonal planar 120°, tetrahedral 109.5°, pyramidal 107°, non-linear 104.5°, octahedral 90°.']],
 ['Intermolecular forces',['London forces get stronger with more electrons.','Hydrogen bonds form between H on N, O or F and a lone pair on N, O or F.','Hydrogen bonding explains the high boiling point of water and why ice is less dense than liquid water.']]]),
terms:[['Ionic bond','Electrostatic attraction between positive and negative ions.'],['Covalent bond','A strong electrostatic attraction between a shared pair of electrons and the nuclei of the bonded atoms.'],['Dative covalent bond','A covalent bond in which the shared pair of electrons is supplied by one of the bonding atoms only.'],['Electronegativity','The ability of an atom to attract the bonding electrons in a covalent bond.']]});
})();
