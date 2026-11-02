/* TrainTanmay Physics – core data (OCR A H556 / H156) */
(function(){
'use strict';
const PMT='https://pmt.physicsandmathstutor.com/download/Physics/A-level/';
const u = p => encodeURI(PMT+p);
window.SPEC = {
  u,
  modules:[
    {n:1,title:'Development of practical skills',short:'Practical skills',papers:'All papers · PAG endorsement',as:true},
    {n:2,title:'Foundations of physics',short:'Foundations',papers:'All papers',as:true},
    {n:3,title:'Forces and motion',short:'Forces & motion',papers:'AS P1 · A-level P1 & P3',as:true},
    {n:4,title:'Electrons, waves and photons',short:'Electrons, waves & photons',papers:'AS P2 · A-level P2 & P3',as:true},
    {n:5,title:'Newtonian world and astrophysics',short:'Newtonian world & astro',papers:'A-level P1 & P3',as:false},
    {n:6,title:'Particles and medical physics',short:'Particles & medical',papers:'A-level P2 & P3',as:false}
  ],
  topics:[],
  constants:[
    ['acceleration of free fall','g','9.81 m s<sup>−2</sup>'],
    ['elementary charge','e','1.60 × 10<sup>−19</sup> C'],
    ['speed of light in a vacuum','c','3.00 × 10<sup>8</sup> m s<sup>−1</sup>'],
    ['Planck constant','h','6.63 × 10<sup>−34</sup> J s'],
    ['Avogadro constant','N<sub>A</sub>','6.02 × 10<sup>23</sup> mol<sup>−1</sup>'],
    ['molar gas constant','R','8.31 J mol<sup>−1</sup> K<sup>−1</sup>'],
    ['Boltzmann constant','k','1.38 × 10<sup>−23</sup> J K<sup>−1</sup>'],
    ['gravitational constant','G','6.67 × 10<sup>−11</sup> N m<sup>2</sup> kg<sup>−2</sup>'],
    ['permittivity of free space','ε<sub>0</sub>','8.85 × 10<sup>−12</sup> C<sup>2</sup> N<sup>−1</sup> m<sup>−2</sup> (F m<sup>−1</sup>)'],
    ['electron rest mass','m<sub>e</sub>','9.11 × 10<sup>−31</sup> kg'],
    ['proton rest mass','m<sub>p</sub>','1.673 × 10<sup>−27</sup> kg'],
    ['neutron rest mass','m<sub>n</sub>','1.675 × 10<sup>−27</sup> kg'],
    ['alpha particle rest mass','m<sub>α</sub>','6.646 × 10<sup>−27</sup> kg'],
    ['Stefan constant','σ','5.67 × 10<sup>−8</sup> W m<sup>−2</sup> K<sup>−4</sup>'],
    ['atomic mass unit','u','1.661 × 10<sup>−27</sup> kg'],
    ['electronvolt','eV','1.60 × 10<sup>−19</sup> J'],
    ['astronomical unit','AU','1.50 × 10<sup>11</sup> m'],
    ['parsec','pc','3.10 × 10<sup>16</sup> m'],
    ['light-year','ly','9.46 × 10<sup>15</sup> m'],
    ['Hubble constant','H<sub>0</sub>','≈ 2.2 × 10<sup>−18</sup> s<sup>−1</sup>'],
    ['speed of sound in air (typical)','—','≈ 340 m s<sup>−1</sup>']
  ],
  prefixes:[['tera','T','10<sup>12</sup>'],['giga','G','10<sup>9</sup>'],['mega','M','10<sup>6</sup>'],['kilo','k','10<sup>3</sup>'],['centi','c','10<sup>−2</sup>'],['milli','m','10<sup>−3</sup>'],['micro','μ','10<sup>−6</sup>'],['nano','n','10<sup>−9</sup>'],['pico','p','10<sup>−12</sup>'],['femto','f','10<sup>−15</sup>']]
};
/* PMT topic question pack helper: [label, path] -> {label,url,set} */
window.SPEC.pack = (set,label,path)=>({set,label,url:u('Topic-Qs/OCR-A/'+path)});
window.SPEC.addTopic = t => window.SPEC.topics.push(t);
})();
