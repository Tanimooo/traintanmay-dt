/* Module 3: Periodic table and energy.
   Notes are short AI-written summaries to check against the spec and a textbook. */
(function(){
const S=window.SPEC, N=S.notes;

S.addTopic({id:'3.1.1',mod:3,title:'Periodicity',short:'Periodic trends in ionisation energy, structure and melting point.',pmt:'3.1.1 Periodicity',
spec:['The periodic table arranged by atomic number; s, p and d blocks','First ionisation energy and successive ionisation energies','Trends in first ionisation energy down a group and across periods 2 and 3','Metallic bonding; giant covalent lattices (diamond, graphite, graphene, silicon)','Trend in melting point across periods 2 and 3 linked to structure and bonding'],
notes:N([['Ionisation energy',['Down a group, first ionisation energy falls: more shells, more shielding, outer electron further from the nucleus.','Across a period it generally rises: more protons, similar shielding, smaller atomic radius.','Dips: Group 3 (electron in a higher-energy p sub-shell) and Group 6 (paired electrons in a p orbital repel).']],
 ['Melting points across period 3',['Na to Al: giant metallic, rising as more delocalised electrons and smaller, more highly charged ions.','Si: giant covalent, highest.','P₄, S₈, Cl₂, Ar: simple molecular, low; S₈ is highest as it has the most electrons.']]]),
terms:[['First ionisation energy','The energy required to remove one electron from each atom in one mole of gaseous atoms of an element to form one mole of gaseous 1+ ions.'],['Metallic bonding','Strong electrostatic attraction between cations and delocalised electrons.']],
eqs:[['$\\mathrm{X(g)}\\longrightarrow\\mathrm{X^+(g)}+\\mathrm{e^-}$','First ionisation energy equation']]});

S.addTopic({id:'3.1.2',mod:3,title:'Group 2',short:'Redox reactions and uses of the alkaline earth metals.',pmt:'3.1.2 Group 2',
spec:['Group 2 elements lose two electrons in redox reactions to form 2+ ions','Reactivity increases down the group (falling ionisation energy)','Reactions of Group 2 metals with water, oxygen and dilute acids','Group 2 oxides with water and the increasing alkalinity of the hydroxides down the group','Uses: Ca(OH)₂ to neutralise acidic soil; Mg(OH)₂ and CaCO₃ as antacids'],
notes:N([['Key ideas',['Metal + water → hydroxide + hydrogen, e.g. Ca + 2H₂O → Ca(OH)₂ + H₂.','The hydroxides get more soluble down the group, so the solutions get more alkaline.']]])});

S.addTopic({id:'3.1.3',mod:3,title:'The halogens',short:'Halogen trends, displacement, disproportionation and halide tests.',pmt:'3.1.3 The Halogens',
spec:['Trend in boiling points of the halogens','Halogens gain one electron; reactivity decreases down the group','Displacement reactions of halogens with halide ions','Disproportionation: chlorine with water and with cold dilute sodium hydroxide; uses in water treatment','Tests for halide ions with silver nitrate and ammonia'],
notes:N([['Key ideas',['Boiling points rise down the group: more electrons, stronger London forces.','A more reactive halogen displaces a less reactive halide: Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂.','Cl₂ + H₂O → HCl + HClO: chlorine is both oxidised and reduced (disproportionation).']],
 ['Halide tests (add HNO₃, then AgNO₃)',['Cl⁻: white AgCl, dissolves in dilute NH₃.','Br⁻: cream AgBr, dissolves in concentrated NH₃.','I⁻: yellow AgI, insoluble in concentrated NH₃.']]]),
terms:[['Disproportionation','A redox reaction in which the same element is both oxidised and reduced.']]});

S.addTopic({id:'3.1.4',mod:3,title:'Qualitative analysis',short:'Test-tube tests for anions and ammonium ions.',pmt:'3.1.4 Qualitative Analysis',pags:['p4-1'],
spec:['Tests for carbonate, sulfate and halide ions, and the order to carry them out','Test for ammonium ions'],
notes:N([['Order of tests',['Carbonate first: add dilute HNO₃; effervescence; the gas turns limewater milky.','Sulfate next: add Ba(NO₃)₂ (aq); a white precipitate of BaSO₄.','Halides last: add AgNO₃ (aq).','The order matters because carbonate and sulfate also form precipitates with Ag⁺ and Ba²⁺.']],
 ['Ammonium',['Warm with NaOH (aq); NH₃ gas turns damp red litmus paper blue.']]])});

S.addTopic({id:'3.2.1',mod:3,title:'Enthalpy changes',short:'Enthalpy profile diagrams, calorimetry, bond enthalpies and Hess cycles.',pmt:'3.2.1 Enthalpy Changes',pags:['p3-1'],
spec:['Exothermic and endothermic reactions; enthalpy profile diagrams and activation energy','Standard conditions and standard enthalpy changes of reaction, formation, combustion and neutralisation','Measuring enthalpy changes with q = mcΔT','Average bond enthalpies: bond breaking is endothermic, bond making is exothermic','Hess’ law and enthalpy cycles using formation and combustion data'],
notes:N([['Calorimetry',['q = mcΔT, where m is the mass of the solution or water heated (not the fuel).','ΔH = −q ÷ n, in kJ mol⁻¹: watch the sign and convert J to kJ.','Heat loss to the surroundings is the main source of error.']],
 ['Bond enthalpies and Hess',['ΔH = Σ(bonds broken) − Σ(bonds made).','Using formation data: ΔH = ΣΔfH(products) − ΣΔfH(reactants).','Using combustion data: ΔH = ΣΔcH(reactants) − ΣΔcH(products).']]]),
terms:[['Standard enthalpy change of formation','The enthalpy change when one mole of a compound is formed from its elements under standard conditions, with all substances in their standard states.'],['Standard enthalpy change of combustion','The enthalpy change when one mole of a substance reacts completely with oxygen under standard conditions.'],['Standard enthalpy change of neutralisation','The enthalpy change when acid and base react to form one mole of water under standard conditions.'],['Average bond enthalpy','The mean energy needed to break one mole of a given type of gaseous bond, averaged over many compounds.'],['Hess’ law','The enthalpy change of a reaction is independent of the route taken.']],
eqs:[['$q=mc\\Delta T$','Energy transferred (J)'],['$\\Delta H=-\\dfrac{q}{n}$','Enthalpy change per mole'],['$\\Delta H=\\bigsum(\\text{bonds broken})-\\bigsum(\\text{bonds made})$','From bond enthalpies']],
mcq:[{q:'50.0 g of water warms by 10.0 K. How much energy was transferred? (c = 4.18 J g⁻¹ K⁻¹)',o:['209 J','418 J','2090 J','4180 J'],a:2,e:'q = mcΔT = 50.0 × 4.18 × 10.0 = 2090 J'}]});

S.addTopic({id:'3.2.2',mod:3,title:'Reaction rates',short:'Collision theory, the Boltzmann distribution and catalysts.',pmt:'3.2.2 Reaction Rates',
spec:['Effect of concentration, pressure, temperature and catalysts on rate, using collision theory','Measuring rate, e.g. gas volume or mass loss against time','Homogeneous and heterogeneous catalysts; economic and environmental benefits','The Boltzmann distribution and how temperature and catalysts affect it'],
notes:N([['Collision theory',['Higher concentration or pressure: more particles per unit volume, so more frequent collisions.','Higher temperature: particles have more energy, so a greater proportion of collisions exceed the activation energy.','A catalyst provides an alternative route with a lower activation energy.']],
 ['Boltzmann distribution',['Starts at the origin; the area under the curve is the number of molecules; it never touches the x-axis.','At a higher temperature the peak moves right and down, and more molecules have E ≥ Ea.']]]),
terms:[['Rate of reaction','The change in concentration of a reactant or product per unit time.'],['Activation energy','The minimum energy required for a reaction to take place.'],['Catalyst','A substance that increases the rate of a reaction without being used up, by providing an alternative route with a lower activation energy.']]});

S.addTopic({id:'3.2.3',mod:3,title:'Chemical equilibrium',short:'Dynamic equilibrium, Le Chatelier’s principle and Kc.',pmt:'3.2.3 Chemical Equilibrium',
spec:['Dynamic equilibrium in a closed system','Le Chatelier’s principle: effects of concentration, temperature and pressure','Catalysts do not change the position of equilibrium','Compromise conditions in industry','Writing expressions for Kc for homogeneous equilibria','Deducing the position of equilibrium from the size of Kc'],
notes:N([['Le Chatelier',['If a system at equilibrium is changed, the position of equilibrium shifts to counteract the change.','Raising the temperature shifts it in the endothermic direction.','Raising the pressure shifts it towards fewer moles of gas.']],
 ['Kc',['Kc = [products]^coefficients ÷ [reactants]^coefficients, using equilibrium concentrations.','Kc much greater than 1: equilibrium lies to the right.']]]),
terms:[['Dynamic equilibrium','The rate of the forward reaction equals the rate of the reverse reaction, and the concentrations of reactants and products stay constant.'],['Le Chatelier’s principle','When a system in dynamic equilibrium is subjected to a change, the position of equilibrium shifts to minimise the change.']],
eqs:[['for $a\\mathrm{A}+b\\mathrm{B}\\rightleftharpoons c\\mathrm{C}+d\\mathrm{D}$: $K_c=\\dfrac{[\\mathrm{C}]^c[\\mathrm{D}]^d}{[\\mathrm{A}]^a[\\mathrm{B}]^b}$','Equilibrium constant']]});
})();
