/* Full past papers hosted by Physics & Maths Tutor (PMT). Links open PMT in a new tab.
   File names copied from PMT's OCR A Chemistry pages (Nov 2026). Note PMT writes "Nov 2020" for A level
   but "November 2020" for AS, and uses "AS-level" (lower-case l) for some AS sessions. */
(function(){
const S=window.SPEC, u=S.u;
const cur=['June 2025','June 2024','June 2023','June 2022','Nov 2021','Nov 2020','June 2019','June 2018','June 2017','Specimen'];
const asSess=['June 2025','June 2024','June 2023','June 2022','November 2021','November 2020','June 2019','June 2018','June 2017','June 2016','Specimen'];
const lowL=new Set(['June 2019','November 2020','November 2021']);
const A=(p)=>cur.map(s=>({s,qp:u(`Past-Papers/OCR-A/${p}/QP/${s} QP.pdf`),ms:u(`Past-Papers/OCR-A/${p}/MS/${s} MS.pdf`)}));
const AS=(n)=>asSess.map(s=>{ const lv=lowL.has(s)?'AS-level':'AS-Level'; return {s,qp:u(`Past-Papers/OCR-A/AS-Paper-${n}/${s} QP - Paper ${n} OCR (A) Chemistry ${lv}.pdf`),ms:u(`Past-Papers/OCR-A/AS-Paper-${n}/${s} MS - Paper ${n} OCR (A) Chemistry ${lv}.pdf`)}; });
S.papers=[
 {id:'h432-01',code:'H432/01',name:'Periodic table, elements and physical chemistry',level:'A level',time:'2 h 15 min',marks:100,weight:'37%',mods:'Modules 1, 2, 3 and 5',fmt:'Section A: 15 multiple choice (15 marks). Section B: structured and extended response (85 marks).',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-a-paper-1/',items:A('Paper-1')},
 {id:'h432-02',code:'H432/02',name:'Synthesis and analytical techniques',level:'A level',time:'2 h 15 min',marks:100,weight:'37%',mods:'Modules 1, 2, 4 and 6',fmt:'Section A: 15 multiple choice (15 marks). Section B: structured and extended response (85 marks).',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-a-paper-2/',items:A('Paper-2')},
 {id:'h432-03',code:'H432/03',name:'Unified chemistry',level:'A level',time:'1 h 30 min',marks:70,weight:'26%',mods:'All modules (synoptic, strong practical focus)',fmt:'Structured and extended response questions, including Level of Response (6-mark) questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-a-paper-3/',items:A('Paper-3')},
 {id:'h032-01',code:'H032/01',name:'Breadth in chemistry (AS)',level:'AS',time:'1 h 30 min',marks:70,weight:'50% of AS',mods:'Modules 1–4',fmt:'Section A: 20 multiple choice. Section B: structured questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-a-paper-1-as/',items:AS(1)},
 {id:'h032-02',code:'H032/02',name:'Depth in chemistry (AS)',level:'AS',time:'1 h 30 min',marks:70,weight:'50% of AS',mods:'Modules 1–4',fmt:'Structured and extended response questions, including a Level of Response question.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-a-paper-2-as/',items:AS(2)}
];
const L=(n,sess)=>sess.map(s=>({s,qp:u(`Past-Papers/OCR-Old/Unit-${n}/${s} QP - Unit ${n} OCR Chemistry A-level.pdf`),ms:u(`Past-Papers/OCR-Old/Unit-${n}/${s} MS - Unit ${n} OCR Chemistry A-level.pdf`)}));
const j=(y0,y1,jan)=>{const a=[];for(let y=y1;y>=y0;y--){a.push('June '+y);if(jan.includes(y))a.push('January '+y);}return a;};
S.legacy=[
 {id:'f321',code:'F321',name:'Atoms, Bonds and Groups (legacy Unit 1)',match:'Matches module 2 and the inorganic half of module 3 (2.1–2.2, 3.1): atomic structure, moles, acids, redox, electron configuration, bonding and shapes, periodicity, Group 2 and the halogens.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-unit-1/',items:L(1,j(2009,2016,[2009,2010,2011,2012,2013]))},
 {id:'f322',code:'F322',name:'Chains, Energy and Resources (legacy Unit 2)',match:'Matches modules 3.2 and 4: enthalpy, rates, equilibrium, alkanes, alkenes, alcohols, haloalkanes, IR and mass spectrometry. Skip questions on green chemistry case studies outside the current spec.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-unit-2/',items:L(2,j(2009,2016,[2010,2011,2012,2013]))},
 {id:'f324',code:'F324',name:'Rings, Polymers and Analysis (legacy Unit 4)',match:'Matches module 6: benzene and phenols, carbonyls, carboxylic acids and esters, amines, amino acids, polymers, synthesis, chromatography and NMR.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-unit-4/',items:L(4,j(2010,2016,[2010,2011,2012,2013]))},
 {id:'f325',code:'F325',name:'Equilibria, Energetics and Elements (legacy Unit 5)',match:'Matches module 5: rates, equilibrium (Kc; Kp was not on the old spec), acids, buffers and pH, lattice enthalpy, entropy and free energy, redox and electrode potentials, transition elements.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/ocr-unit-5/',items:L(5,j(2010,2016,[2011,2012,2013]))}
];
S.booklet=u('Past-Papers/OCR-A/Data Sheet.pdf');
S.pmtNotes=[{label:'PMT OCR A Chemistry revision',url:'https://www.physicsandmathstutor.com/chemistry-revision/a-level-ocr-a/'}];
})();
