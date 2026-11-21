/* Module 6: Organic chemistry and analysis.
   Notes are short AI-written summaries to check against the spec and a textbook. */
(function(){
const S=window.SPEC, N=S.notes;

S.addTopic({id:'6.1.1',mod:6,title:'Aromatic compounds',short:'Benzene’s structure, electrophilic substitution and phenols.',pmt:'6.1.1 Aromatic Compounds',
spec:['The Kekulé model and the delocalised model of benzene, and the evidence for delocalisation','Electrophilic substitution: nitration and halogenation, with halogen carriers','Friedel–Crafts alkylation and acylation','Why benzene resists addition and does not decolourise bromine','Phenol: weak acidity and reaction with bromine; directing effects of substituents'],
notes:N([['Key ideas',['Evidence for delocalisation: all C–C bonds are the same length, hydrogenation is less exothermic than predicted, and benzene resists addition.','Nitration: conc. HNO₃ and conc. H₂SO₄ make the NO₂⁺ electrophile.','Phenol reacts with bromine water at room temperature (white precipitate): an O lone pair is partly delocalised into the ring, raising its electron density.']]]),
terms:[['Electrophilic substitution','A reaction in which an electrophile replaces an atom (usually H) on an aromatic ring.']]});

S.addTopic({id:'6.1.2',mod:6,title:'Carbonyl compounds',short:'Aldehydes and ketones: oxidation, nucleophilic addition and tests.',pmt:'6.1.2 Carbonyl Compounds',
spec:['Oxidation of aldehydes to carboxylic acids','Nucleophilic addition with NaBH₄ and with HCN (NaCN/H⁺)','The nucleophilic addition mechanism','2,4-DNP test for carbonyl groups; Tollens’ reagent to tell aldehydes from ketones'],
notes:N([['Tests',['2,4-DNP: orange precipitate with any aldehyde or ketone.','Tollens’ reagent: silver mirror with an aldehyde only (the aldehyde is oxidised).']],
 ['Reactions',['NaBH₄ reduces aldehydes to primary alcohols and ketones to secondary alcohols.','HCN adds across C=O to make a hydroxynitrile, lengthening the carbon chain.']]])});

S.addTopic({id:'6.1.3',mod:6,title:'Carboxylic acids and esters',short:'Acidity, esterification, acyl chlorides and hydrolysis.',pmt:'6.1.3 Carboxylic Acids and Esters',
spec:['Solubility and acidity of carboxylic acids; reactions with metals, carbonates and bases','Esterification with alcohols and with acid anhydrides','Hydrolysis of esters in acid and in alkali','Acyl chlorides: preparation and reactions with water, alcohols, phenols and amines'],
notes:N([['Key ideas',['Carboxylic acid + alcohol ⇌ ester + water (concentrated H₂SO₄ catalyst, heat).','Alkaline hydrolysis of an ester is not reversible and gives the carboxylate salt.','Acyl chlorides are more reactive than carboxylic acids and react in one direction only.']]])});

S.addTopic({id:'6.2.1',mod:6,title:'Amines',short:'Basicity and preparation of amines.',pmt:'6.2.1 Amines',
spec:['Basicity of amines; forming salts with acids','Preparing aliphatic amines from haloalkanes and ammonia','Preparing aromatic amines by reducing nitroarenes with tin and concentrated HCl'],
notes:N([['Key ideas',['The lone pair on the nitrogen accepts a proton, so amines are bases.','Haloalkane + excess ethanolic ammonia gives a primary amine; further substitution gives secondary and tertiary amines.']]])});

S.addTopic({id:'6.2.2',mod:6,title:'Amino acids, amides and chirality',short:'Amino acids, amides and optical isomers.',pmt:'6.2.2 Amino Acids, Amides and Chirality',
spec:['The general formula of α-amino acids and their reactions with acids, alkalis and alcohols','Structures of primary and secondary amides','Optical isomerism: chiral centres and drawing enantiomers in 3D'],
notes:N([['Chirality',['A chiral centre is a carbon atom attached to four different groups.','Optical isomers are non-superimposable mirror images.']]]),
terms:[['Chiral centre','A carbon atom attached to four different atoms or groups of atoms.'],['Optical isomers','Stereoisomers that are non-superimposable mirror images of each other.']]});

S.addTopic({id:'6.2.3',mod:6,title:'Polyesters and polyamides',short:'Condensation polymerisation and hydrolysis of polymers.',pmt:'6.2.3 Polyesters and Polyamides',
spec:['Condensation polymerisation to make polyesters and polyamides','Drawing repeat units and identifying monomers','Acid and base hydrolysis of polyesters and polyamides'],
notes:N([['Key ideas',['Condensation polymers lose a small molecule (usually H₂O, or HCl from an acyl chloride) at each link.','Polyesters form from a diol and a dicarboxylic acid; polyamides from a diamine and a dicarboxylic acid.']]])});

S.addTopic({id:'6.2.4',mod:6,title:'Carbon–carbon bond formation',short:'Lengthening carbon chains with nitriles and Friedel–Crafts.',pmt:'6.2.4 Carbon-Carbon Bond Formation',
spec:['Forming nitriles from haloalkanes (cyanide ions in ethanol) and hydroxynitriles from carbonyls (HCN)','Reducing nitriles to amines and hydrolysing them to carboxylic acids','Friedel–Crafts alkylation and acylation of benzene'],
notes:N([['Key ideas',['A nitrile adds one carbon to the chain.','Reduce a nitrile with H₂ and a nickel catalyst to make an amine; hydrolyse it with dilute acid to make a carboxylic acid.']]])});

S.addTopic({id:'6.2.5',mod:6,title:'Organic synthesis',short:'Practical techniques and multi-stage synthetic routes.',pmt:'6.2.5 Organic Synthesis',pags:['p6-1'],
spec:['Techniques for preparing and purifying organic solids: filtration under reduced pressure, recrystallisation and melting point','Identifying functional groups in multi-functional molecules','Multi-stage synthetic routes for aliphatic and aromatic compounds'],
notes:N([['Purifying a solid',['Recrystallise: dissolve in the minimum volume of hot solvent, cool to crystallise, filter under reduced pressure and wash with cold solvent.','A pure solid melts sharply at its literature melting point; impurities lower it and widen the range.']]])});

S.addTopic({id:'6.3.1',mod:6,title:'Chromatography and qualitative analysis',short:'TLC and gas chromatography, and tests for functional groups.',pmt:'6.3.1 Chromatography and Qualitative Analysis',pags:['p7-1'],
spec:['Thin-layer chromatography and Rf values','Gas chromatography: retention times and peak areas','Tests for organic functional groups'],
notes:N([['Key ideas',['Rf = distance moved by the spot ÷ distance moved by the solvent front.','In GC, retention time identifies a compound and peak area shows its relative amount.']],
 ['Functional group tests',['Alkene: bromine water, orange to colourless.','Haloalkane: warm with AgNO₃ in ethanol; precipitate.','Carbonyl: 2,4-DNP, orange precipitate. Aldehyde: Tollens’, silver mirror.','Primary or secondary alcohol, or aldehyde: acidified dichromate, orange to green.','Carboxylic acid: Na₂CO₃, effervescence.']]]),
eqs:[['$R_f=\\dfrac{\\text{distance moved by spot}}{\\text{distance moved by solvent front}}$','Thin-layer chromatography']]});

S.addTopic({id:'6.3.2',mod:6,title:'Spectroscopy',short:'¹³C and ¹H NMR, combined with IR and mass spectra.',pmt:'6.3.2 Spectroscopy',
spec:['¹³C NMR: number of carbon environments and chemical shift','¹H NMR: environments, chemical shift, relative peak areas and spin–spin splitting (n + 1 rule)','TMS as the standard; deuterated solvents; D₂O to identify O–H and N–H protons','Combining NMR, IR and mass spectra and elemental analysis to deduce structures'],
notes:N([['¹H NMR',['The number of peaks is the number of proton environments; relative peak areas give the ratio of protons.','Splitting: a peak with n neighbouring H on adjacent carbons splits into n + 1.','O–H and N–H peaks disappear when D₂O is added.']],
 ['¹³C NMR',['The number of peaks is the number of carbon environments; chemical shifts are on the Data Sheet.']]]),
eqs:[['n neighbouring H → n + 1 peaks','Spin–spin splitting rule']]});
})();
