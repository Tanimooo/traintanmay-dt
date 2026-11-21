/* TrainTanmay Chemistry – core data (OCR A H432 / H032) */
(function(){
'use strict';
const PMT='https://pmt.physicsandmathstutor.com/download/Chemistry/A-level/';
const u = p => encodeURI(PMT+p);
window.SPEC = {
  u,
  modules:[
    {n:1,title:'Development of practical skills in chemistry',short:'Practical skills',papers:'All papers · PAG endorsement',as:true},
    {n:2,title:'Foundations in chemistry',short:'Foundations',papers:'AS P1 & P2 · A-level P1, P2 & P3',as:true},
    {n:3,title:'Periodic table and energy',short:'Periodic table & energy',papers:'AS P1 & P2 · A-level P1 & P3',as:true},
    {n:4,title:'Core organic chemistry',short:'Core organic',papers:'AS P1 & P2 · A-level P2 & P3',as:true},
    {n:5,title:'Physical chemistry and transition elements',short:'Physical & transition',papers:'A-level P1 & P3',as:false},
    {n:6,title:'Organic chemistry and analysis',short:'Organic & analysis',papers:'A-level P2 & P3',as:false}
  ],
  topics:[],
  /* values as printed on the OCR A Chemistry Data Sheet: check against the official sheet (linked on Past papers) */
  constants:[
    ['Avogadro constant','N<sub>A</sub>','6.02 × 10<sup>23</sup> mol<sup>−1</sup>'],
    ['gas constant','R','8.314 J mol<sup>−1</sup> K<sup>−1</sup>'],
    ['molar gas volume at RTP','—','24.0 dm<sup>3</sup> mol<sup>−1</sup>'],
    ['ionic product of water (298 K)','K<sub>w</sub>','1.00 × 10<sup>−14</sup> mol<sup>2</sup> dm<sup>−6</sup>'],
    ['specific heat capacity of water','c','4.18 J g<sup>−1</sup> K<sup>−1</sup>'],
    ['Planck constant','h','6.63 × 10<sup>−34</sup> J s'],
    ['speed of light in a vacuum','c','3.00 × 10<sup>8</sup> m s<sup>−1</sup>'],
    ['tonne','t','10<sup>6</sup> g']
  ],
  prefixes:[['kilo','k','10<sup>3</sup>'],['deci','d','10<sup>−1</sup>'],['centi','c','10<sup>−2</sup>'],['milli','m','10<sup>−3</sup>'],['micro','μ','10<sup>−6</sup>'],['nano','n','10<sup>−9</sup>']],
  /* PMT topic-question folders, one per module */
  folders:{2:'2-Foundations-in-Chemistry',3:'3-Periodic-Table-and-Energy',4:'4-Core-Organic-Chemistry',5:'5-Physical-Chemistry-Transition-Elements',6:'6-Organic-Chemistry-Analysis'}
};
/* PMT topic question pack helper: [label, path] -> {label,url,set} */
window.SPEC.pack = (set,label,path)=>({set,label,url:u('Topic-Qs/OCR-A/'+path)});
/* every OCR A topic on PMT has Set J (pmtG: a different Set G file name, where PMT uses one) (2022–24 papers) and Set G (2016–21 papers, with an MCQ pack), filed under the spec code and name */
window.SPEC.pk = (mod,name,gname)=>{ const P=window.SPEC.pack, f=window.SPEC.folders[mod]+'/', g=gname||name;
  return [P('Set J 2022–24',name+' QP',f+'Set-J/'+name+' QP.pdf'),P('Set J 2022–24',name+' MS',f+'Set-J/'+name+' MS.pdf'),
          P('Set G 2016–21',g+' QP',f+'Set-G/'+g+' QP.pdf'),P('Set G 2016–21',g+' MS',f+'Set-G/'+g+' MS.pdf'),P('Set G 2016–21',g+' MCQ',f+'Set-G/MCQ/'+g+' MCQ.pdf')]; };
const ul = a => '<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
window.SPEC.notes = secs => secs.map(([h,items])=>'<h3>'+h+'</h3>'+ul(items)).join('');
window.SPEC.addTopic = t => { const T=Object.assign({eqs:[],terms:[],mcq:[],exam:[],packs:[],labs:[],pags:[]},t);
  if(!T.packs.length&&T.pmt) T.packs=window.SPEC.pk(T.mod,T.pmt,T.pmtG); window.SPEC.topics.push(T); };
})();
