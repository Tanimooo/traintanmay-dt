/* Full past papers hosted by Physics & Maths Tutor (PMT). Links open PMT in a new tab. */
(function(){
const S=window.SPEC, u=S.u;
const cur=['June 2025','June 2024','June 2023','June 2022','November 2021','November 2020','June 2019','June 2018','June 2017','Specimen'];
const asSess=['June 2025','June 2024','June 2023','June 2022','November 2021','November 2020','June 2019','June 2018','June 2017','June 2016','Specimen'];
const A=(p)=>cur.map(s=>({s,qp:u(`Past-Papers/OCR-A/${p}/QP/${s} QP.pdf`),ms:u(`Past-Papers/OCR-A/${p}/MS/${s} MS.pdf`)}));
const AS=(n)=>asSess.map(s=>({s,qp:u(`Past-Papers/OCR-A/AS-Paper-${n}/${s} QP - Paper ${n} OCR (A) Physics AS-level${s==='June 2018'&&n===1?' ':''}.pdf`),ms:u(`Past-Papers/OCR-A/AS-Paper-${n}/${s} MS - Paper ${n} OCR (A) Physics AS-level.pdf`)}));
const L=(n,sess)=>sess.map(s=>({s,qp:u(`Past-Papers/OCR-Old/Unit-${n}/${s} QP - Unit ${n} OCR Physics A-level.pdf`),ms:u(`Past-Papers/OCR-Old/Unit-${n}/${s} MS - Unit ${n} OCR Physics A-level.pdf`)}));
const j=(y0,y1,jan)=>{const a=[];for(let y=y1;y>=y0;y--){a.push('June '+y);if(jan.includes(y))a.push('January '+y);}return a;};
S.papers=[
 {id:'h556-01',code:'H556/01',name:'Modelling physics',level:'A level',time:'2 h 15 min',marks:100,weight:'37%',mods:'Modules 1, 2, 3 and 5',fmt:'Section A: 15 multiple choice (15 marks). Section B: structured and extended response (85 marks).',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-a-paper-1/',items:A('Paper-1')},
 {id:'h556-02',code:'H556/02',name:'Exploring physics',level:'A level',time:'2 h 15 min',marks:100,weight:'37%',mods:'Modules 1, 2, 4 and 6',fmt:'Section A: 15 multiple choice (15 marks). Section B: structured and extended response (85 marks).',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-a-paper-2/',items:A('Paper-2')},
 {id:'h556-03',code:'H556/03',name:'Unified physics',level:'A level',time:'1 h 30 min',marks:70,weight:'26%',mods:'All modules (synoptic, strong practical focus)',fmt:'Structured and extended response questions, including Level of Response (6-mark) questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-a-paper-3/',items:A('Paper-3')},
 {id:'h156-01',code:'H156/01',name:'Breadth in physics (AS)',level:'AS',time:'1 h 30 min',marks:70,weight:'50% of AS',mods:'Modules 1–4',fmt:'Section A: 20 multiple choice. Section B: structured questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-a-paper-1-as/',items:AS(1)},
 {id:'h156-02',code:'H156/02',name:'Depth in physics (AS)',level:'AS',time:'1 h 30 min',marks:70,weight:'50% of AS',mods:'Modules 1–4',fmt:'Structured and extended response questions, including a Level of Response question.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-a-paper-2-as/',items:AS(2)}
];
S.legacy=[
 {id:'g481',code:'G481',name:'Mechanics (legacy Unit 1)',match:'Matches modules 2 and 3: units, kinematics, projectiles, forces, moments, density, work, energy, power, materials. Car safety questions still fit 3.1 and 3.5.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-unit-1/',items:L(1,j(2009,2016,[2009,2010,2011,2012,2013]))},
 {id:'g482',code:'G482',name:'Electrons, Waves and Photons (legacy Unit 2)',match:'Matches module 4 closely: charge, resistance, circuits, potential dividers, waves, quantum physics. A few older questions on fuses or the "kilowatt-hour bill" still fit 4.2.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-unit-2/',items:L(2,j(2009,2016,[2010,2011,2012,2013]))},
 {id:'g484',code:'G484',name:'The Newtonian World (legacy Unit 4)',match:'Matches module 3.5 (momentum) and module 5.1–5.4: thermal physics, circular motion, oscillations, gravitation.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-unit-4/',items:L(4,j(2010,2016,[2010,2011,2012,2013]))},
 {id:'g485',code:'G485',name:'Fields, Particles and Frontiers (legacy Unit 5)',match:'Matches modules 6 and 5.5: electric and magnetic fields, capacitors, nuclear, medical imaging, cosmology. Older questions on detailed particle zoo or "frontiers" topics outside the spec can be skipped.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-physics/ocr-unit-5/',items:L(5,j(2010,2016,[2011,2012,2013]))}
];
S.booklet=u('Past-Papers/OCR-A/AS-Paper-1/Data, Formulae and Relationships Booklet - OCR (A) Physics AS-level.pdf');
S.pmtNotes=[
 ['Module 1 definitions','Notes/OCR-A/1-Practical-Skills-in-Physics/Definitions.pdf'],
 ['Module 3 definitions','Notes/OCR-A/3-Forces-and-Motion/Definitions.pdf'],
 ['Module 4 definitions','Notes/OCR-A/4-Electrons-Waves-Photons/Definitions.pdf'],
 ['Module 5 definitions','Notes/OCR-A/5-Newtonian-World-and-Astrophysics/Definitions.pdf'],
 ['Module 6 definitions','Notes/OCR-A/6-Particles-and-Medical-Physics/Definitions.pdf']
].map(([l,p])=>({label:l,url:u(p)}));
})();
