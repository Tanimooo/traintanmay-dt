/* Module 4: Core organic chemistry.
   Notes are short AI-written summaries to check against the spec and a textbook. */
(function(){
const S=window.SPEC, N=S.notes;

S.addTopic({id:'4.1.1',mod:4,title:'Basic concepts of organic chemistry',short:'Naming, formulae, functional groups, isomers and curly arrows.',pmt:'4.1.1 Basic Concepts of Organic Chemistry',
spec:['IUPAC naming of organic compounds','General, structural, displayed and skeletal formulae','Homologous series and functional groups; aliphatic, alicyclic and aromatic','Structural isomers','Homolytic and heterolytic fission; radicals','Curly arrows to show the movement of electron pairs','Types of reaction: addition, substitution and elimination'],
notes:N([['Key ideas',['A homologous series has the same functional group and general formula; each member differs by CH₂.','Structural isomers have the same molecular formula but a different structural formula.','Homolytic fission gives two radicals; heterolytic fission gives a cation and an anion.','A curly arrow starts at a lone pair or a bond and ends where the electron pair goes.']]]),
terms:[['Homologous series','A series of organic compounds with the same functional group and general formula, each member differing by CH₂.'],['Functional group','The part of an organic molecule responsible for its chemical reactions.'],['Structural isomers','Compounds with the same molecular formula but different structural formulae.'],['Radical','A species with an unpaired electron.'],['Homolytic fission','Bond breaking in which each bonding atom receives one electron from the bonded pair, forming two radicals.'],['Heterolytic fission','Bond breaking in which one bonding atom receives both electrons from the bonded pair.']]});

S.addTopic({id:'4.1.2',mod:4,title:'Alkanes',short:'Properties, combustion and radical substitution.',pmt:'4.1.2 Alkanes',
spec:['Alkanes are saturated; σ bonds and tetrahedral shape','Boiling points: effect of chain length and branching','Complete and incomplete combustion','Radical substitution with halogens in UV light: initiation, propagation and termination','Limitations of radical substitution in synthesis'],
notes:N([['Key ideas',['Longer chains have more surface contact and stronger London forces, so higher boiling points; branching lowers them.','Incomplete combustion makes toxic carbon monoxide.']],
 ['Radical substitution (CH₄ + Cl₂)',['Initiation: Cl₂ → 2Cl• (UV light).','Propagation: CH₄ + Cl• → •CH₃ + HCl, then •CH₃ + Cl₂ → CH₃Cl + Cl•.','Termination: two radicals join, e.g. •CH₃ + Cl• → CH₃Cl.','It gives a mixture of products, from further substitution and from substitution at different positions.']]])});

S.addTopic({id:'4.1.3',mod:4,title:'Alkenes',short:'The C=C bond, E/Z isomerism, electrophilic addition and polymers.',pmt:'4.1.3 Alkenes',
spec:['The C=C bond: a σ bond and a π bond; trigonal planar shape','Stereoisomerism: E/Z and cis–trans isomerism, using CIP priority rules','Addition reactions with H₂, halogens, hydrogen halides and steam','Test for C=C with bromine water','Electrophilic addition mechanism; Markownikoff’s rule and carbocation stability','Addition polymers; processing waste polymers and biodegradable polymers'],
notes:N([['Key ideas',['The π bond has high electron density, so it attracts electrophiles.','E/Z isomerism needs restricted rotation about C=C and two different groups on each carbon.','Bromine water turns from orange to colourless with an alkene.']],
 ['Mechanism',['Electrophilic addition goes through a carbocation intermediate.','Tertiary carbocations are more stable than secondary, which are more stable than primary, so the major product comes from the more stable carbocation (Markownikoff).']]]),
terms:[['Stereoisomers','Compounds with the same structural formula but a different arrangement of atoms in space.'],['Electrophile','An electron-pair acceptor.']]});

S.addTopic({id:'4.2.1',mod:4,title:'Alcohols',short:'Properties, oxidation, dehydration and substitution of alcohols.',pmt:'4.2.1 Alcohols',
spec:['Polarity and hydrogen bonding: volatility and solubility','Primary, secondary and tertiary alcohols','Combustion','Oxidation with acidified dichromate: aldehydes, carboxylic acids and ketones; distillation and reflux','Elimination of water to form alkenes','Substitution with halide ions to form haloalkanes'],
notes:N([['Oxidation (K₂Cr₂O₇ / H₂SO₄, orange to green)',['Primary → aldehyde (distil it off) → carboxylic acid (heat under reflux).','Secondary → ketone.','Tertiary: not oxidised, so the solution stays orange.']],
 ['Other reactions',['Dehydration: heat with a concentrated H₃PO₄ or H₂SO₄ catalyst to make an alkene.','Substitution: NaBr and H₂SO₄ make HBr, which turns the alcohol into a bromoalkane.']]])});

S.addTopic({id:'4.2.2',mod:4,title:'Haloalkanes',short:'Nucleophilic substitution, bond enthalpy and the ozone layer.',pmt:'4.2.2 Haloalkanes',
spec:['Hydrolysis of haloalkanes by aqueous alkali: nucleophilic substitution','Rates of hydrolysis of primary haloalkanes linked to C–X bond enthalpy','Comparing rates using silver nitrate in ethanol','Environmental effects: CFCs and radical depletion of ozone'],
notes:N([['Key ideas',['The C–X bond is polar, so the δ+ carbon is attacked by nucleophiles such as OH⁻.','Rate: iodoalkane > bromoalkane > chloroalkane, because the C–I bond is the weakest (lowest bond enthalpy).','With AgNO₃ in ethanol, the faster the precipitate appears, the faster the hydrolysis.','Cl• radicals from CFCs catalyse the breakdown of ozone: Cl• + O₃ → ClO• + O₂, then ClO• + O → Cl• + O₂.']]]),
terms:[['Nucleophile','An electron-pair donor.'],['Hydrolysis','A reaction with water or aqueous hydroxide ions that breaks a chemical bond.']]});

S.addTopic({id:'4.2.3',mod:4,title:'Organic synthesis',short:'Practical techniques and two-stage synthetic routes.',pmt:'4.2.3 Organic Synthesis Practical Skills',pmtG:'4.2.3 Organic Synthesis',pags:['p5-1'],
spec:['Techniques: heating under reflux, distillation, separating funnel, drying with an anhydrous salt, redistillation','Identifying functional groups from given reactions','Two-stage synthetic routes for aliphatic compounds'],
notes:N([['Techniques',['Reflux heats volatile liquids without losing them, so a reaction can go to completion.','Purifying a liquid: separating funnel to remove aqueous impurities, dry with anhydrous MgSO₄ or CaCl₂, then redistil and collect at the boiling point.']]])});

S.addTopic({id:'4.2.4',mod:4,title:'Analytical techniques',short:'Infrared spectroscopy and mass spectrometry.',pmt:'4.2.4 Analytical Techniques',
spec:['Infrared radiation and the greenhouse effect; IR used in breathalysers','Identifying functional groups from IR absorptions: O–H, C=O, C–O','Mass spectrometry: the molecular ion peak and fragmentation','Combining elemental analysis, mass spectra and IR spectra to identify compounds'],
notes:N([['IR absorptions (given on the Data Sheet)',['O–H in an alcohol: broad, around 3200–3600 cm⁻¹.','O–H in a carboxylic acid: very broad, around 2500–3300 cm⁻¹.','C=O: strong and sharp, around 1630–1820 cm⁻¹.']],
 ['Mass spectra',['The M⁺ peak with the highest m/z gives the relative molecular mass (ignore the small M+1 peak).','Fragment peaks show parts of the molecule, e.g. m/z 29 for C₂H₅⁺ and m/z 43 for C₃H₇⁺ or CH₃CO⁺.']]])});
})();
