/* TrainTanmay Chemistry – core data (AQA A-level Chemistry 7405 / AS 7404) */
(function(){
'use strict';
const PMT='https://pmt.physicsandmathstutor.com/download/Chemistry/A-level/';
const u = p => encodeURI(PMT+p);
window.SPEC = {
  u,
  board:'AQA', code:'7405', asCode:'7404',
  /* AQA groups the subject content into three sections, plus the practical skills assessed across every paper */
  modules:[
    {n:1,code:'3.1',title:'Physical chemistry',short:'Physical',papers:'Paper 1 · Paper 2 (3.1.2–3.1.6, 3.1.9) · Paper 3',as:true},
    {n:2,code:'3.2',title:'Inorganic chemistry',short:'Inorganic',papers:'Paper 1 · Paper 3',as:true},
    {n:3,code:'3.3',title:'Organic chemistry',short:'Organic',papers:'Paper 2 · Paper 3',as:true},
    {n:4,code:'P',title:'Practical skills',short:'Practical',papers:'All papers (mainly Paper 3) · practical endorsement',as:true}
  ],
  topics:[],
  /* The AQA Data Booklet has the IR and NMR tables, the DNA bases, some amino acids and the periodic table.
     Constants such as these are given in the question when you need them. */
  constants:[
    ['Avogadro constant','L or N<sub>A</sub>','6.022 × 10<sup>23</sup> mol<sup>−1</sup>'],
    ['gas constant','R','8.31 J K<sup>−1</sup> mol<sup>−1</sup>'],
    ['ionic product of water (298 K)','K<sub>w</sub>','1.00 × 10<sup>−14</sup> mol<sup>2</sup> dm<sup>−6</sup>'],
    ['specific heat capacity of water','c','4.18 J K<sup>−1</sup> g<sup>−1</sup>'],
    ['Planck constant','h','6.63 × 10<sup>−34</sup> J s'],
    ['speed of light in a vacuum','c','3.00 × 10<sup>8</sup> m s<sup>−1</sup>'],
    ['standard pressure','p⦵','100 kPa'],
    ['0 °C','—','273 K']
  ],
  prefixes:[['kilo','k','10<sup>3</sup>'],['deci','d','10<sup>−1</sup>'],['centi','c','10<sup>−2</sup>'],['milli','m','10<sup>−3</sup>'],['micro','μ','10<sup>−6</sup>'],['nano','n','10<sup>−9</sup>']]
};
/* the module (section) label used across the app: "3.1 Physical chemistry", "Practical skills" */
window.SPEC.modLabel = m => m.code==='P' ? m.title : m.code+' '+m.title;
const ul = a => '<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
window.SPEC.notes = secs => secs.map(([h,items])=>'<h3>'+h+'</h3>'+ul(items)).join('');
window.SPEC.addTopic = t => { const T=Object.assign({eqs:[],terms:[],qa:[],mcq:[],exam:[],packs:[],labs:[],pags:[]},t); window.SPEC.topics.push(T); };
/* extra flashcards and key terms (used by any later file that wants to add some) */
window.SPEC.addCards = D => Object.keys(D).forEach(id=>{ const t=window.SPEC.topics.find(x=>x.id===id); if(!t) return; const d=D[id];
  if(d.t) t.terms=(t.terms||[]).concat(d.t); if(d.q) t.qa=(t.qa||[]).concat(d.q); });
})();
