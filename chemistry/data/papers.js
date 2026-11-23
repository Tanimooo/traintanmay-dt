/* Full past papers hosted by Physics & Maths Tutor (PMT). Links open PMT in a new tab.
   File names copied from PMT's AQA Chemistry pages (Nov 2026). PMT files the November 2020 and 2021 series
   under "June 2020" and "June 2021". */
(function(){
const S=window.SPEC, u=S.u;
const cur=['June 2025','June 2024','June 2023','June 2022','June 2021','June 2020','June 2019','June 2018','June 2017','Specimen'];
const asSess=['June 2025','June 2024','June 2023','June 2022','June 2021','June 2020','June 2019','June 2018','June 2017','June 2016','Specimen'];
const A=(p)=>cur.map(s=>({s,qp:u(`Past-Papers/AQA/${p}/QP/${s} QP.pdf`),ms:u(`Past-Papers/AQA/${p}/MS/${s} MS.pdf`)}));
const AS=(n)=>asSess.map(s=>({s,qp:u(`Past-Papers/AQA/AS-Paper-${n}/${s} QP - Paper ${n} AQA Chemistry AS-level.pdf`),ms:u(`Past-Papers/AQA/AS-Paper-${n}/${s} MS - Paper ${n} AQA Chemistry AS-level.pdf`)}));
S.papers=[
 {id:'7405-1',code:'7405/1',name:'Paper 1: Inorganic and physical chemistry',level:'A level',time:'2 h',marks:105,weight:'35%',mods:'Physical 3.1.1–3.1.4, 3.1.6–3.1.8, 3.1.10–3.1.12 · all of inorganic 3.2 · practical skills',fmt:'105 marks of short and long answer questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1/',items:A('Paper-1')},
 {id:'7405-2',code:'7405/2',name:'Paper 2: Organic and physical chemistry',level:'A level',time:'2 h',marks:105,weight:'35%',mods:'Physical 3.1.2–3.1.6 and 3.1.9 · all of organic 3.3 · practical skills',fmt:'105 marks of short and long answer questions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2/',items:A('Paper-2')},
 {id:'7405-3',code:'7405/3',name:'Paper 3: Any content and practical skills',level:'A level',time:'2 h',marks:90,weight:'30%',mods:'Any content · any practical skills',fmt:'40 marks on practical techniques and data analysis; 20 marks of questions across the specification; 30 marks of multiple choice.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-3/',items:A('Paper-3')},
 {id:'7404-1',code:'7404/1',name:'AS Paper 1: Inorganic and physical chemistry',level:'AS',time:'1 h 30 min',marks:80,weight:'50% of AS',mods:'Physical 3.1.1–3.1.7 · inorganic 3.2.1–3.2.3 · practical skills',fmt:'65 marks of short and long answer questions; 15 marks of multiple choice.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1-as/',items:AS(1)},
 {id:'7404-2',code:'7404/2',name:'AS Paper 2: Organic and physical chemistry',level:'AS',time:'1 h 30 min',marks:80,weight:'50% of AS',mods:'Physical 3.1.2–3.1.6 · organic 3.3.1–3.3.6 · practical skills',fmt:'65 marks of short and long answer questions; 15 marks of multiple choice.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2-as/',items:AS(2)}
];
const L=(n,sess)=>sess.map(s=>({s,qp:u(`Past-Papers/AQA-Old/Unit-${n}/${s} QP - Unit ${n} AQA Chemistry A-level.pdf`),ms:u(`Past-Papers/AQA-Old/Unit-${n}/${s} MS - Unit ${n} AQA Chemistry A-level.pdf`)}));
const j=(y0,y1,jan)=>{const a=[];for(let y=y1;y>=y0;y--){a.push('June '+y);if(jan.includes(y))a.push('January '+y);}return a;};
const SESS=j(2010,2016,[2010,2011,2012,2013]);
S.legacy=[
 {id:'chem1',code:'CHEM1',name:'Foundation Chemistry (legacy Unit 1)',match:'Matches AS physical and inorganic topics 3.1.1–3.1.3, 3.1.7 and 3.2.1: atomic structure and mass spectrometry, amount of substance, bonding, periodicity; plus alkanes and crude oil (3.3.1–3.3.2). The old mass spectrometer was a magnetic-deflection design, not time-of-flight.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-unit-1/',items:L(1,SESS)},
 {id:'chem2',code:'CHEM2',name:'Chemistry in Action (legacy Unit 2)',match:'Matches 3.1.4–3.1.7, 3.2.2–3.2.3 and 3.3.3–3.3.6: energetics, kinetics, equilibria, redox, Group 2, the halogens, halogenoalkanes, alkenes, alcohols and analysis. Skip extraction-of-metals questions, which are no longer on the spec.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-unit-2/',items:L(2,SESS)},
 {id:'chem4',code:'CHEM4',name:'Kinetics, Equilibria and Organic Chemistry (legacy Unit 4)',match:'Matches 3.1.9, 3.1.10 (Kc only) and 3.1.12, and organic 3.3.7–3.3.16: rate equations, acids, bases and buffers, isomerism, carbonyls, acids and derivatives, aromatics, amines, polymers, amino acids, synthesis, NMR and chromatography.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-unit-4/',items:L(4,SESS)},
 {id:'chem5',code:'CHEM5',name:'Energetics, Redox and Inorganic Chemistry (legacy Unit 5)',match:'Matches 3.1.8, 3.1.11 and 3.2.4–3.2.6: thermodynamics, electrode potentials and cells, Period 3, transition metals and aqua ions.',page:'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-unit-5/',items:L(5,SESS)}
];
S.booklet=u('Past-Papers/AQA/Data Sheet.pdf');
S.pmtNotes=[{label:'PMT AQA Chemistry revision',url:'https://www.physicsandmathstutor.com/chemistry-revision/a-level-aqa/'}];
})();
