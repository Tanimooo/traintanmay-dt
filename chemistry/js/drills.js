/* TrainTanmay Chemistry: calculation drills. Each drill makes a fresh question with new numbers,
   checks the answer and shows a full worked solution, typeset like handwritten maths ($…$ and $$…$$ are
   rendered by js/tex.js with KaTeX). Progress is kept by js/extras.js. */
(function(){
'use strict';
const T=String.raw;
const P=a=>a[Math.floor(Math.random()*a.length)];
const R=(a,b,dp)=>+(a+Math.random()*(b-a)).toFixed(dp);
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sup=n=>String(n).split('').map(c=>SUP[c]).join('');
/* plain-text answer, n significant figures (used in the "the answer is" line) */
const sf=(x,n=3)=>{ if(!isFinite(x)) return String(x); if(x===0) return '0'; const a=Math.abs(x);
  if(a>=1e5||a<1e-3){ let e=Math.floor(Math.log10(a)), m=+(x/Math.pow(10,e)).toPrecision(n); if(Math.abs(m)>=10){ m=m/10; e++; } return m.toFixed(n-1)+' × 10'+sup(e); }
  if(a>=Math.pow(10,n)) return String(Math.round(x));
  return x.toPrecision(n); };
/* the same number as TeX: 1.23 \times 10^{-3} */
const N=(x,n=3)=>{ if(!isFinite(x)) return T`\text{?}`; if(x===0) return '0'; const a=Math.abs(x);
  if(a>=1e5||a<1e-3){ let e=Math.floor(Math.log10(a)), m=+(x/Math.pow(10,e)).toPrecision(n); if(Math.abs(m)>=10){ m=m/10; e++; } return m.toFixed(n-1)+T`\times 10^{${e}}`; }
  if(a>=Math.pow(10,n)) return String(Math.round(x));
  return x.toPrecision(n); };
const f2=x=>x.toFixed(2), f1=x=>x.toFixed(1);
const sg=x=>(x>0?'+':'')+x;
const par=x=>x<0?'('+x+')':String(x);
/* chemistry in TeX: 'C₂H₅OH(l)' → \mathrm{C_{2}H_{5}OH(l)}; 'SO₄²⁻' → \mathrm{SO_{4}^{2-}} */
const UNSUP={'⁻':'-','⁺':'+','⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const ch=s=>T`\mathrm{`+String(s).replace(/[₀-₉]+/g,m=>'_{'+[...m].map(c=>c.charCodeAt(0)-8320).join('')+'}').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]/g,m=>'^{'+[...m].map(c=>UNSUP[c]).join('')+'}').replace(/ /g,'\\ ')+'}';
const B=s=>T`\mathbf{${s}}`;
const u=s=>T`\ \text{${s}}`;
const MOLDM=T`\ \text{mol dm}^{-3}`, KJ=T`\ \text{kJ mol}^{-1}`;
/* read whatever a student types: 1.2e-3, 1.2x10^-3, 1.2 × 10⁻³, −0.5 */
const parseNum=s=>{ s=String(s||'').trim().replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>UNSUP[c]).replace(/[−–]/g,'-').replace(/,/g,'').replace(/\s+/g,'');
  s=s.replace(/[x×*]10\^?\(?(-?\d+)\)?/i,'e$1'); const v=parseFloat(s); return isFinite(v)?v:null; };
const parseFormula=s=>{ s=String(s||'').replace(/[₀-₉]/g,c=>String(c.charCodeAt(0)-8320)).replace(/\s/g,''); const o={}; const re=/([A-Z][a-z]?)(\d*)/g; let m, seen=''; while((m=re.exec(s))){ seen+=m[0]; o[m[1]]=(o[m[1]]||0)+(m[2]?+m[2]:1); } return seen===s&&seen?o:null; };
const sub=s=>s.replace(/(\d+)/g,d=>d.split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[+c]).join(''));
const tbl=(head,rows)=>`<div class="tbl"><table><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---------- data ---------- */
const CMP=[['NaOH',40.0],['CaCO₃',100.1],['H₂SO₄',98.1],['NaCl',58.5],['CO₂',44.0],['MgSO₄',120.4],['C₆H₁₂O₆',180.0],['KMnO₄',158.0],['Na₂CO₃',106.0],['CuSO₄',159.6],['NH₃',17.0],['C₂H₅OH',46.0]];
const DF={'CH₄(g)':-75,'CO₂(g)':-394,'H₂O(l)':-286,'H₂O(g)':-242,'C₂H₅OH(l)':-277,'C₂H₄(g)':52,'C₂H₆(g)':-85,'C₃H₈(g)':-105,'NH₃(g)':-46,'NO(g)':90,'CaCO₃(s)':-1207,'CaO(s)':-635,'Fe₂O₃(s)':-824,'Al₂O₃(s)':-1676,'SO₂(g)':-297,'SO₃(g)':-396,'O₂(g)':0,'H₂(g)':0,'Al(s)':0,'Fe(s)':0};
const HF=[
 {r:[[1,'CH₄(g)'],[2,'O₂(g)']],p:[[1,'CO₂(g)'],[2,'H₂O(l)']]},
 {r:[[1,'C₂H₅OH(l)'],[3,'O₂(g)']],p:[[2,'CO₂(g)'],[3,'H₂O(l)']]},
 {r:[[1,'CaCO₃(s)']],p:[[1,'CaO(s)'],[1,'CO₂(g)']]},
 {r:[[2,'SO₂(g)'],[1,'O₂(g)']],p:[[2,'SO₃(g)']]},
 {r:[[1,'Fe₂O₃(s)'],[2,'Al(s)']],p:[[1,'Al₂O₃(s)'],[2,'Fe(s)']]},
 {r:[[4,'NH₃(g)'],[5,'O₂(g)']],p:[[4,'NO(g)'],[6,'H₂O(g)']]},
 {r:[[1,'C₂H₄(g)'],[1,'H₂(g)']],p:[[1,'C₂H₆(g)']]},
 {r:[[1,'C₃H₈(g)'],[5,'O₂(g)']],p:[[3,'CO₂(g)'],[4,'H₂O(l)']]},
 {r:[[1,'C₂H₄(g)'],[1,'H₂O(g)']],p:[[1,'C₂H₅OH(l)']]}];
const DC={'C(s)':-394,'H₂(g)':-286,'CH₄(g)':-890,'C₂H₆(g)':-1560,'C₂H₄(g)':-1411,'C₂H₅OH(l)':-1367,'C₃H₈(g)':-2219,'C₆H₁₂O₆(s)':-2803,'CO₂(g)':0,'O₂(g)':0};
const HC=[
 {r:[[1,'C(s)'],[2,'H₂(g)']],p:[[1,'CH₄(g)']],name:'Δ<sub>f</sub>H of methane'},
 {r:[[2,'C(s)'],[3,'H₂(g)']],p:[[1,'C₂H₆(g)']],name:'Δ<sub>f</sub>H of ethane'},
 {r:[[3,'C(s)'],[4,'H₂(g)']],p:[[1,'C₃H₈(g)']],name:'Δ<sub>f</sub>H of propane'},
 {r:[[1,'C₂H₄(g)'],[1,'H₂(g)']],p:[[1,'C₂H₆(g)']],name:'Δ<sub>r</sub>H for hydrogenating ethene'},
 {r:[[1,'C₆H₁₂O₆(s)']],p:[[2,'C₂H₅OH(l)'],[2,'CO₂(g)']],name:'Δ<sub>r</sub>H for fermentation'}];
const BE={'C–H':413,'O=O':498,'C=O':805,'O–H':464,'H–H':436,'Cl–Cl':243,'H–Cl':432,'C=C':612,'C–C':347,'N≡N':945,'N–H':391,'Br–Br':193,'C–Br':290,'H–Br':366,'C–Cl':346};
const bond=k=>T`\mathrm{`+k.replace('–','{-}').replace('=','{=}').replace('≡',T`{\equiv}`)+'}';
const BR=[
 {eq:[[[1,'CH₄(g)'],[2,'O₂(g)']],[[1,'CO₂(g)'],[2,'H₂O(g)']]],b:{'C–H':4,'O=O':2},m:{'C=O':2,'O–H':4}},
 {eq:[[[1,'H₂(g)'],[1,'Cl₂(g)']],[[2,'HCl(g)']]],b:{'H–H':1,'Cl–Cl':1},m:{'H–Cl':2}},
 {eq:[[[1,'C₂H₄(g)'],[1,'H₂(g)']],[[1,'C₂H₆(g)']]],b:{'C=C':1,'C–H':4,'H–H':1},m:{'C–C':1,'C–H':6}},
 {eq:[[[1,'N₂(g)'],[3,'H₂(g)']],[[2,'NH₃(g)']]],b:{'N≡N':1,'H–H':3},m:{'N–H':6}},
 {eq:[[[1,'C₂H₄(g)'],[1,'Br₂(g)']],[[1,'C₂H₄Br₂(g)']]],b:{'C=C':1,'Br–Br':1},m:{'C–C':1,'C–Br':2}},
 {eq:[[[1,'CH₄(g)'],[1,'Cl₂(g)']],[[1,'CH₃Cl(g)'],[1,'HCl(g)']]],b:{'C–H':1,'Cl–Cl':1},m:{'C–Cl':1,'H–Cl':1}},
 {eq:[[[2,'H₂(g)'],[1,'O₂(g)']],[[2,'H₂O(g)']]],b:{'H–H':2,'O=O':1},m:{'O–H':4}}];
const EO=[['Mg²⁺ + 2e⁻ ⇌ Mg',-2.37],['Al³⁺ + 3e⁻ ⇌ Al',-1.66],['Zn²⁺ + 2e⁻ ⇌ Zn',-0.76],['Fe²⁺ + 2e⁻ ⇌ Fe',-0.44],['Ni²⁺ + 2e⁻ ⇌ Ni',-0.25],['Pb²⁺ + 2e⁻ ⇌ Pb',-0.13],['2H⁺ + 2e⁻ ⇌ H₂',0.00],['Cu²⁺ + 2e⁻ ⇌ Cu',0.34],['I₂ + 2e⁻ ⇌ 2I⁻',0.54],['Fe³⁺ + e⁻ ⇌ Fe²⁺',0.77],['Ag⁺ + e⁻ ⇌ Ag',0.80],['Br₂ + 2e⁻ ⇌ 2Br⁻',1.09],['Cl₂ + 2e⁻ ⇌ 2Cl⁻',1.36]];
const half=s=>s.split(' ').map(w=>w==='+'?'+':w==='⇌'?T`\rightleftharpoons`:ch(w)).join(' ');
const BH={ M:{Li:[159,520],Na:[107,496],K:[89,419],Mg:[148,738,1451],Ca:[178,590,1145]},
 X:{F:[79,-328],Cl:[122,-349],Br:[112,-325],I:[107,-295],O:[249,-141,798]},
 F:{'LiF':-616,'LiCl':-409,'NaF':-574,'NaCl':-411,'NaBr':-361,'KCl':-437,'KBr':-394,'KI':-328,'MgCl₂':-641,'MgO':-602,'CaCl₂':-796,'CaO':-635}};
const HYD={'Li⁺':-519,'Na⁺':-406,'K⁺':-322,'Mg²⁺':-1920,'Ca²⁺':-1650,'F⁻':-506,'Cl⁻':-364,'Br⁻':-335,'I⁻':-293};
const LE={'NaCl':[-787,'Na⁺','Cl⁻'],'KCl':[-711,'K⁺','Cl⁻'],'NaBr':[-751,'Na⁺','Br⁻'],'KBr':[-679,'K⁺','Br⁻'],'LiCl':[-853,'Li⁺','Cl⁻'],'KI':[-651,'K⁺','I⁻'],'NaF':[-918,'Na⁺','F⁻']};
const SS={'CaCO₃(s)':93,'CaO(s)':40,'CO₂(g)':214,'N₂(g)':192,'H₂(g)':131,'NH₃(g)':193,'O₂(g)':205,'H₂O(l)':70,'H₂O(g)':189,'C(s)':5.7,'CH₄(g)':186,'NH₄Cl(s)':95,'HCl(g)':187,'Mg(s)':33,'MgO(s)':27};
const SR=[
 {r:[[1,'CaCO₃(s)']],p:[[1,'CaO(s)'],[1,'CO₂(g)']]},
 {r:[[1,'N₂(g)'],[3,'H₂(g)']],p:[[2,'NH₃(g)']]},
 {r:[[2,'H₂(g)'],[1,'O₂(g)']],p:[[2,'H₂O(l)']]},
 {r:[[1,'C(s)'],[1,'O₂(g)']],p:[[1,'CO₂(g)']]},
 {r:[[1,'NH₃(g)'],[1,'HCl(g)']],p:[[1,'NH₄Cl(s)']]},
 {r:[[1,'CH₄(g)'],[2,'O₂(g)']],p:[[1,'CO₂(g)'],[2,'H₂O(l)']]},
 {r:[[2,'Mg(s)'],[1,'O₂(g)']],p:[[2,'MgO(s)']]}];
const side=a=>a.map(([c,s])=>(c===1?'':c)+ch(s)).join(' + ');
const eqn=(r,p)=>'$$'+side(r)+T` \longrightarrow `+side(p)+'$$';
const sumD=(a,D)=>a.reduce((t,[c,s])=>t+c*D[s],0);
const termsD=(a,D)=>a.map(([c,s])=>(c===1?'':c)+'('+D[s]+')').join(' + ');
const dataList=(syms,D,sym)=>'<p>'+syms.map(s=>'$'+sym+'('+ch(s)+') = '+D[s]+'$').join(', &nbsp; ')+'</p>';
const RX=s=>'$$'+s+'$$';

/* ---------- the drills ---------- */
const D=[
{id:'moles',topic:'2.1.3',title:'Moles from mass',desc:'$n=\\dfrac{m}{M}$, and back again.',gen(){ const [f,M]=P(CMP);
  if(Math.random()<.5){ const m=R(0.5,25,2), n=m/M; return {q:`How many moles are in ${f2(m)} g of ${f}? ($M = ${f1(M)}\\ \\text{g mol}^{-1}$)`,ans:n,unit:'mol',steps:[RX(T`n=\dfrac{m}{M}=\dfrac{${f2(m)}}{${f1(M)}}=`+B(N(n))+u('mol'))]}; }
  const n=R(0.010,0.500,3), m=n*M; return {q:`What is the mass of ${n.toFixed(3)} mol of ${f}? ($M = ${f1(M)}\\ \\text{g mol}^{-1}$)`,ans:m,unit:'g',steps:[RX(T`m=n\times M=${n.toFixed(3)}\times ${f1(M)}=`+B(N(m))+u('g'))]}; }},
{id:'gas',topic:'2.1.3',title:'Gas volumes at RTP',desc:'Molar gas volume, 24.0 dm³ mol⁻¹.',gen(){ if(Math.random()<.5){ const n=R(0.020,0.800,3), V=n*24.0; return {q:`What volume, in dm³, does ${n.toFixed(3)} mol of a gas occupy at RTP?`,ans:V,unit:'dm³',steps:[RX(T`V=n\times 24.0=${n.toFixed(3)}\times 24.0=`+B(N(V))+T`\ \text{dm}^3`)]}; }
  const V=R(60,960,0), n=V/24000; return {q:`How many moles of gas are in ${V} cm³ at RTP?`,ans:n,unit:'mol',steps:[`One mole of gas occupies 24 000 cm³ at RTP.`,RX(T`n=\dfrac{V}{24\,000}=\dfrac{${V}}{24\,000}=`+B(N(n))+u('mol'))]}; }},
{id:'idealgas',topic:'2.1.3',title:'Ideal gas equation: find Mᵣ',desc:'$pV=nRT$ with unit conversions.',gen(){ const [,M]=P([['propanone',58.0],['ethanol',46.0],['hexane',86.0],['methanol',32.0],['butan-1-ol',74.0],['ethyl ethanoate',88.0]]);
  const Tk=R(80,130,0)+273, p=R(98,104,0), V=R(40,120,1), m=+(((p*1e3*V*1e-6)/(8.314*Tk))*M).toFixed(3), nn=(p*1e3*V*1e-6)/(8.314*Tk), Mr=m/nn;
  return {q:`A ${m.toFixed(3)} g sample of a volatile liquid vaporises to give ${f1(V)} cm³ of gas at ${Tk-273} °C and ${p} kPa. Calculate its relative molecular mass. ($R = 8.314\\ \\text{J mol}^{-1}\\ \\text{K}^{-1}$)`,ans:Mr,unit:'',steps:[
   `Convert to SI units: $p = ${p}\\times10^{3}\\ \\text{Pa}$, $V = ${f1(V)}\\times10^{-6}\\ \\text{m}^3$, $T = ${Tk}\\ \\text{K}$.`,
   RX(T`n=\dfrac{pV}{RT}=\dfrac{${p}\times10^{3}\times ${f1(V)}\times10^{-6}}{8.314\times ${Tk}}=${N(nn,4)}\ \text{mol}`),
   RX(T`M_r=\dfrac{m}{n}=\dfrac{${m.toFixed(3)}}{${N(nn,4)}}=`+B(N(Mr)))]}; }},
{id:'empirical',topic:'2.1.3',title:'Empirical formula',desc:'From percentage composition by mass.',text:true,gen(){ const f=P(['CH2O','C2H6O','C3H6O','C2H4O','CH4O','C4H10O','C3H8O','C2H5','CH2','C3H4','C4H8O','C5H12O','C3H8O3','CH3O','C2H3O','CHO2']);
  const at={C:12.0,H:1.0,O:16.0}, o=parseFormula(f); const M=Object.entries(o).reduce((t,[e,c])=>t+at[e]*c,0); const pc=Object.entries(o).map(([e,c])=>[e,+(at[e]*c/M*100).toFixed(1)]);
  const mol=pc.map(([e,p])=>[e,p,p/at[e]]), mn=Math.min(...mol.map(x=>x[2]));
  return {q:`A compound contains ${pc.map(([e,p])=>`${p}% ${e}`).join(', ')} by mass. Find its empirical formula. Type it like C2H6O.`,ans:o,show:sub(f),unit:'',steps:[
   tbl(['Element','% by mass','Moles $= \\dfrac{\\%}{A_r}$','Ratio $\\left(\\div\\ \\text{smallest}\\right)$'],mol.map(([e,p,n])=>[e,String(p),`$\\dfrac{${p}}{${f1(at[e])}} = ${n.toFixed(3)}$`,`$${(n/mn).toFixed(2)}$`])),
   `If any ratio isn't a whole number (e.g. 1.5 or 1.33), multiply them all by 2 or 3. Empirical formula: <b>${sub(f)}</b>`]}; }},
{id:'titration',topic:'2.1.4',title:'Acid–base titration',desc:'Concentration from a titre and the reacting ratio.',gen(){ const rx=P([{eq:[[[2,'NaOH'],[1,'H₂SO₄']],[[1,'Na₂SO₄'],[2,'H₂O']]],k:'H₂SO₄',u:'NaOH',r:2,rt:'2 : 1'},{eq:[[[1,'NaOH'],[1,'HCl']],[[1,'NaCl'],[1,'H₂O']]],k:'HCl',u:'NaOH',r:1,rt:'1 : 1'},{eq:[[[1,'Na₂CO₃'],[2,'HCl']],[[2,'NaCl'],[1,'H₂O'],[1,'CO₂']]],k:'HCl',u:'Na₂CO₃',r:0.5,rt:'1 : 2'},{eq:[[[1,'KOH'],[1,'HNO₃']],[[1,'KNO₃'],[1,'H₂O']]],k:'HNO₃',u:'KOH',r:1,rt:'1 : 1'}]);
  const c=R(0.0500,0.200,3), t=Math.round(R(15,30,2)*20)/20, nk=c*t/1000, nu=nk*rx.r, cu=nu/0.0250;
  return {q:`25.0 cm³ of ${rx.u} solution is titrated with ${c.toFixed(3)} mol dm⁻³ ${rx.k}. The mean titre is ${t.toFixed(2)} cm³. Calculate the concentration of the ${rx.u}.${eqn(...rx.eq)}`,ans:cu,unit:'mol dm⁻³',steps:[
   RX(T`n(${ch(rx.k)})=c\times V=${c.toFixed(3)}\times\dfrac{${t.toFixed(2)}}{1000}=${N(nk,4)}\ \text{mol}`),
   `The ratio ${rx.u} : ${rx.k} is ${rx.rt}, so`+RX(T`n(${ch(rx.u)})=${N(nu,4)}\ \text{mol}`),
   RX(T`c(${ch(rx.u)})=\dfrac{n}{V}=\dfrac{${N(nu,4)}}{0.0250}=`+B(N(cu))+MOLDM)]}; }},
{id:'yield',topic:'2.1.3',title:'Percentage yield',desc:'Theoretical yield from the equation, then %.',gen(){ const rx=P([{eq:[[[1,'CaCO₃']],[[1,'CaO'],[1,'CO₂']]],r:['CaCO₃',100.1],p:['CaO',56.1]},{eq:[[[2,'Mg'],[1,'O₂']],[[2,'MgO']]],r:['Mg',24.3],p:['MgO',40.3]},{eq:[[[1,'CH₃COOH'],[1,'C₂H₅OH']],[[1,'CH₃COOC₂H₅'],[1,'H₂O']]],r:['CH₃COOH',60.0],p:['CH₃COOC₂H₅',88.0]},{eq:[[[1,'C₆H₁₁OH']],[[1,'C₆H₁₀'],[1,'H₂O']]],r:['C₆H₁₁OH',100.0],p:['C₆H₁₀',82.0]},{eq:[[[1,'C₆H₆'],[1,'HNO₃']],[[1,'C₆H₅NO₂'],[1,'H₂O']]],r:['C₆H₆',78.0],p:['C₆H₅NO₂',123.0]}]);
  const m=R(2,20,2), n=m/rx.r[1], th=n*rx.p[1], act=+(th*R(0.45,0.92,2)).toFixed(2), y=act/th*100;
  return {q:`${f2(m)} g of ${rx.r[0]} reacts completely and ${f2(act)} g of ${rx.p[0]} is collected. Calculate the percentage yield. (Mᵣ: ${rx.r[0]} ${f1(rx.r[1])}, ${rx.p[0]} ${f1(rx.p[1])})${eqn(...rx.eq)}`,ans:y,unit:'%',steps:[
   RX(T`n(${ch(rx.r[0])})=\dfrac{${f2(m)}}{${f1(rx.r[1])}}=${N(n,4)}\ \text{mol}`),
   `The ratio is 1 : 1, so the theoretical mass of ${rx.p[0]} is`+RX(T`${N(n,4)}\times ${f1(rx.p[1])}=${N(th,4)}\ \text{g}`),
   RX(T`\%\ \text{yield}=\dfrac{\text{actual}}{\text{theoretical}}\times 100=\dfrac{${f2(act)}}{${N(th,4)}}\times 100=`+B(N(y))+T`\,\%`)]}; }},
{id:'atomecon',topic:'2.1.3',title:'Atom economy',desc:'$\\dfrac{\\text{mass of desired product}}{\\bigsum\\text{mass of products}}\\times 100$',gen(){ const rx=P([{eq:[[[1,'C₆H₁₂O₆']],[[2,'C₂H₅OH'],[2,'CO₂']]],d:[2,46.0,'C₂H₅OH'],o:[[2,44.0,'CO₂']]},{eq:[[[1,'CaCO₃']],[[1,'CaO'],[1,'CO₂']]],d:[1,56.1,'CaO'],o:[[1,44.0,'CO₂']]},{eq:[[[1,'C₂H₅Br'],[1,'NaOH']],[[1,'C₂H₅OH'],[1,'NaBr']]],d:[1,46.0,'C₂H₅OH'],o:[[1,102.9,'NaBr']]},{eq:[[[1,'CH₄'],[1,'H₂O']],[[1,'CO'],[3,'H₂']]],d:[3,2.0,'H₂'],o:[[1,28.0,'CO']]},{eq:[[[1,'Fe₂O₃'],[3,'CO']],[[2,'Fe'],[3,'CO₂']]],d:[2,55.8,'Fe'],o:[[3,44.0,'CO₂']]},{eq:[[[1,'C₂H₅OH']],[[1,'C₂H₄'],[1,'H₂O']]],d:[1,28.0,'C₂H₄'],o:[[1,18.0,'H₂O']]}]);
  const md=rx.d[0]*rx.d[1], tot=md+rx.o.reduce((t,[c,m])=>t+c*m,0), ae=md/tot*100;
  const term=(c,m)=>(c===1?'':c+T`\times `)+f1(m);
  return {q:`Calculate the atom economy for making ${rx.d[2]} by this reaction. (Mᵣ: ${[[rx.d[1],rx.d[2]],...rx.o.map(x=>[x[1],x[2]])].map(([m,n])=>n+' '+f1(m)).join(', ')})${eqn(...rx.eq)}`,ans:ae,unit:'%',steps:[
   RX(T`\text{atom economy}=\dfrac{\text{mass of desired product}}{\bigsum\text{mass of all products}}\times 100`),
   RX(T`=\dfrac{${term(rx.d[0],rx.d[1])}}{${[term(rx.d[0],rx.d[1]),...rx.o.map(([c,m])=>term(c,m))].join(' + ')}}\times 100=\dfrac{${f1(md)}}{${f1(tot)}}\times 100=`+B(N(ae))+T`\,\%`)]}; }},
{id:'calorimetry',topic:'3.2.1',title:'Calorimetry: q = mcΔT',desc:'Enthalpy of combustion or neutralisation from a temperature change.',gen(){
  if(Math.random()<.5){ const [nm,M,dh]=P([['methanol',32.0,-726],['ethanol',46.0,-1367],['propan-1-ol',60.0,-2021],['butan-1-ol',74.0,-2676]]); const mw=P([100,150,200,250]), m=R(0.30,1.20,3), q=-dh*R(0.45,0.75,2)*(m/M)*1000, dT=+(q/(mw*4.18)).toFixed(1), Q=mw*4.18*dT, n=m/M, H=-Q/n/1000;
    return {q:`Burning ${m.toFixed(3)} g of ${nm} ($M = ${f1(M)}$) heats ${mw} g of water by ${f1(dT)} °C. Calculate the enthalpy change of combustion of ${nm}. ($c = 4.18\\ \\text{J g}^{-1}\\ \\text{K}^{-1}$)`,ans:H,unit:'kJ mol⁻¹',steps:[
     `Energy transferred to the water (m is the mass of <b>water</b>, not fuel):`+RX(T`q=mc\Delta T=${mw}\times 4.18\times ${f1(dT)}=${N(Q,4)}\ \text{J}=${N(Q/1000,4)}\ \text{kJ}`),
     RX(T`n(\text{${nm}})=\dfrac{${m.toFixed(3)}}{${f1(M)}}=${N(n,4)}\ \text{mol}`),
     `The temperature rose, so ΔH is negative:`+RX(T`\Delta_c H=-\dfrac{q}{n}=-\dfrac{${N(Q/1000,4)}}{${N(n,4)}}=`+B(N(H))+KJ)]}; }
  const V=P([25.0,50.0]), c=P([1.00,2.00]), dT=+(57.1*R(0.92,1.02,3)*c*1000/(2*4.18)).toFixed(1), Q=2*V*4.18*dT, n=c*V/1000, H=-Q/n/1000;
  return {q:`${f1(V)} cm³ of ${f2(c)} mol dm⁻³ HCl is mixed with ${f1(V)} cm³ of ${f2(c)} mol dm⁻³ NaOH. The temperature rises by ${f1(dT)} °C. Calculate the enthalpy change of neutralisation. (Assume 1 cm³ = 1 g; $c = 4.18\\ \\text{J g}^{-1}\\ \\text{K}^{-1}$)`,ans:H,unit:'kJ mol⁻¹',steps:[
   `The mass heated is the total volume of solution, ${f1(2*V)} g:`+RX(T`q=mc\Delta T=${f1(2*V)}\times 4.18\times ${f1(dT)}=${N(Q,4)}\ \text{J}`),
   RX(T`n(\mathrm{H_2O})=n(\mathrm{HCl})=${f2(c)}\times\dfrac{${f1(V)}}{1000}=${N(n,3)}\ \text{mol}`),
   RX(T`\Delta_{neut}H=-\dfrac{q}{n}=-\dfrac{${N(Q/1000,4)}}{${N(n,3)}}=`+B(N(H))+KJ)]}; }},
{id:'hessf',topic:'3.2.1',title:'Hess cycle: formation data',desc:'$\\Delta H=\\bigsum\\Delta_f H_{\\text{products}}-\\bigsum\\Delta_f H_{\\text{reactants}}$',gen(){ const x=P(HF), H=sumD(x.p,DF)-sumD(x.r,DF), used=[...new Set([...x.r,...x.p].map(a=>a[1]))];
  return {q:`Use the enthalpy changes of formation (kJ mol⁻¹) to calculate $\\Delta_r H$ for:${eqn(x.r,x.p)}${dataList(used,DF,T`\Delta_f H`)}`,ans:H,unit:'kJ mol⁻¹',steps:[
   RX(T`\Delta_r H=\bigsum\Delta_f H(\text{products})-\bigsum\Delta_f H(\text{reactants})`),
   RX(T`\bigsum\Delta_f H(\text{products})=${termsD(x.p,DF)}=${sumD(x.p,DF)}`),
   RX(T`\bigsum\Delta_f H(\text{reactants})=${termsD(x.r,DF)}=${sumD(x.r,DF)}`),
   RX(T`\Delta_r H=${sumD(x.p,DF)}-${par(sumD(x.r,DF))}=`+B(H)+KJ)]}; }},
{id:'hessc',topic:'3.2.1',title:'Hess cycle: combustion data',desc:'$\\Delta H=\\bigsum\\Delta_c H_{\\text{reactants}}-\\bigsum\\Delta_c H_{\\text{products}}$',gen(){ const x=P(HC), H=sumD(x.r,DC)-sumD(x.p,DC), used=[...new Set([...x.r,...x.p].map(a=>a[1]))].filter(s=>DC[s]!==0);
  return {q:`Use the enthalpy changes of combustion (kJ mol⁻¹) to calculate ${x.name}:${eqn(x.r,x.p)}${dataList(used,DC,T`\Delta_c H`)}`,ans:H,unit:'kJ mol⁻¹',steps:[
   RX(T`\Delta H=\bigsum\Delta_c H(\text{reactants})-\bigsum\Delta_c H(\text{products})`),
   RX(T`\bigsum\Delta_c H(\text{reactants})=${termsD(x.r,DC)}=${sumD(x.r,DC)}`),
   RX(T`\bigsum\Delta_c H(\text{products})=${termsD(x.p,DC)}=${sumD(x.p,DC)}`),
   RX(T`\Delta H=${sumD(x.r,DC)}-${par(sumD(x.p,DC))}=`+B(H)+KJ)]}; }},
{id:'bonds',topic:'3.2.1',title:'Bond enthalpies',desc:'$\\Delta H=\\bigsum\\text{broken}-\\bigsum\\text{made}$',gen(){ const x=P(BR), b=Object.entries(x.b).reduce((t,[k,n])=>t+n*BE[k],0), m=Object.entries(x.m).reduce((t,[k,n])=>t+n*BE[k],0), keys=[...new Set([...Object.keys(x.b),...Object.keys(x.m)])];
  const list=o=>Object.entries(o).map(([k,n])=>(n===1?'':n)+bond(k)).join(' + '), nums=o=>Object.entries(o).map(([k,n])=>(n===1?'':n)+'('+BE[k]+')').join(' + ');
  return {q:`Use average bond enthalpies (kJ mol⁻¹) to calculate ΔH for:${eqn(...x.eq)}<p>${keys.map(k=>'$'+bond(k)+' = '+BE[k]+'$').join(', &nbsp; ')}</p>`,ans:b-m,unit:'kJ mol⁻¹',steps:[
   RX(T`\Delta H=\bigsum(\text{bonds broken})-\bigsum(\text{bonds made})`),
   `Bonds broken (endothermic):`+RX(list(x.b)+'='+nums(x.b)+'='+b+T`\ \text{kJ}`),
   `Bonds made (exothermic):`+RX(list(x.m)+'='+nums(x.m)+'='+m+T`\ \text{kJ}`),
   RX(T`\Delta H=${b}-${m}=`+B(b-m)+KJ)]}; }},
{id:'kc',topic:'5.1.2',title:'Kc from equilibrium amounts',desc:'Initial / change / equilibrium tables.',gen(){ const t=P(['ester','hi','n2o4']);
  if(t==='ester'){ const a=R(0.50,2.00,2), b=R(0.50,2.00,2), x=+(Math.min(a,b)*R(0.4,0.8,2)).toFixed(3), K=x*x/((a-x)*(b-x));
    return {q:`${f2(a)} mol of ethanoic acid and ${f2(b)} mol of ethanol are mixed and reach equilibrium. ${x.toFixed(3)} mol of ethyl ethanoate is present. Calculate $K_c$.${RX(ch('CH₃COOH')+' + '+ch('C₂H₅OH')+T` \rightleftharpoons `+ch('CH₃COOC₂H₅')+' + '+ch('H₂O'))}`,ans:K,unit:'(no units)',steps:[
     tbl(['','CH₃COOH','C₂H₅OH','ester','H₂O'],[['Initial / mol',f2(a),f2(b),'0','0'],['Change / mol','−'+x.toFixed(3),'−'+x.toFixed(3),'+'+x.toFixed(3),'+'+x.toFixed(3)],['Equilibrium / mol',(a-x).toFixed(3),(b-x).toFixed(3),x.toFixed(3),x.toFixed(3)]]),
     `There are equal numbers of moles on top and bottom, so the volume cancels and you can use moles:`,
     RX(T`K_c=\dfrac{[${ch('CH₃COOC₂H₅')}][${ch('H₂O')}]}{[${ch('CH₃COOH')}][${ch('C₂H₅OH')}]}=\dfrac{${x.toFixed(3)}\times ${x.toFixed(3)}}{${(a-x).toFixed(3)}\times ${(b-x).toFixed(3)}}=`+B(N(K)))]}; }
  if(t==='hi'){ const a=R(0.50,1.50,2), b=R(0.50,1.50,2), y=+(2*Math.min(a,b)*R(0.5,0.85,2)).toFixed(3), K=y*y/((a-y/2)*(b-y/2));
    return {q:`${f2(a)} mol of H₂ and ${f2(b)} mol of I₂ are heated in a sealed flask. At equilibrium ${y.toFixed(3)} mol of HI is present. Calculate $K_c$.${RX(T`\mathrm{H_2(g)} + \mathrm{I_2(g)} \rightleftharpoons 2\,\mathrm{HI(g)}`)}`,ans:K,unit:'(no units)',steps:[
     tbl(['','H₂','I₂','HI'],[['Initial / mol',f2(a),f2(b),'0'],['Change / mol','−'+(y/2).toFixed(4),'−'+(y/2).toFixed(4),'+'+y.toFixed(3)],['Equilibrium / mol',(a-y/2).toFixed(4),(b-y/2).toFixed(4),y.toFixed(3)]]),
     `2 mol of gas on each side, so the volume cancels:`,
     RX(T`K_c=\dfrac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]}=\dfrac{(${y.toFixed(3)})^2}{${(a-y/2).toFixed(4)}\times ${(b-y/2).toFixed(4)}}=`+B(N(K)))]}; }
  const a=R(0.20,1.00,2), V=P([1.00,2.00,0.500]), y=+(2*a*R(0.2,0.6,2)).toFixed(3), cN=(a-y/2)/V, cO=y/V, K=cO*cO/cN;
  return {q:`${f2(a)} mol of N₂O₄ is placed in a ${V.toFixed(V<1?3:2)} dm³ container. At equilibrium ${y.toFixed(3)} mol of NO₂ is present. Calculate $K_c$.${RX(T`\mathrm{N_2O_4(g)} \rightleftharpoons 2\,\mathrm{NO_2(g)}`)}`,ans:K,unit:'mol dm⁻³',steps:[
   tbl(['','N₂O₄','NO₂'],[['Initial / mol',f2(a),'0'],['Change / mol','−'+(y/2).toFixed(4),'+'+y.toFixed(3)],['Equilibrium / mol',(a-y/2).toFixed(4),y.toFixed(3)],['Concentration / mol dm⁻³',N(cN,4).includes('times')?sf(cN,4):N(cN,4),sf(cO,4)]]),
   `The moles top and bottom differ, so you must use concentrations (moles ÷ ${V.toFixed(V<1?3:2)} dm³):`,
   RX(T`K_c=\dfrac{[\mathrm{NO_2}]^2}{[\mathrm{N_2O_4}]}=\dfrac{(${N(cO,4)})^2}{${N(cN,4)}}=`+B(N(K))+MOLDM)]}; }},
{id:'kp',topic:'5.1.2',title:'Kp from partial pressures',desc:'Mole fractions × total pressure.',gen(){ if(Math.random()<.5){ const a=R(0.20,1.20,2), b=R(0.20,1.20,2), Pt=P([100,150,200,250]), xa=a/(a+b), xb=b/(a+b), pa=xa*Pt, pb=xb*Pt, K=pb*pb/pa;
    return {q:`An equilibrium mixture contains ${f2(a)} mol N₂O₄ and ${f2(b)} mol NO₂ at a total pressure of ${Pt} kPa. Calculate $K_p$.${RX(T`\mathrm{N_2O_4(g)} \rightleftharpoons 2\,\mathrm{NO_2(g)}`)}`,ans:K,unit:'kPa',steps:[
     RX(T`x(\mathrm{N_2O_4})=\dfrac{${f2(a)}}{${f2(a+b)}}=${xa.toFixed(3)}$$$$ x(\mathrm{NO_2})=\dfrac{${f2(b)}}{${f2(a+b)}}=${xb.toFixed(3)}`),
     RX(T`p=x\times P_{\text{total}}:\quad p(\mathrm{N_2O_4})=${N(pa,4)}\ \text{kPa},\quad p(\mathrm{NO_2})=${N(pb,4)}\ \text{kPa}`),
     RX(T`K_p=\dfrac{p(\mathrm{NO_2})^2}{p(\mathrm{N_2O_4})}=\dfrac{(${N(pb,4)})^2}{${N(pa,4)}}=`+B(N(K))+T`\ \text{kPa}`)]}; }
  const s=R(0.10,0.80,2), o=R(0.10,0.60,2), t=R(0.20,1.50,2), Pt=P([200,300,500]), n=s+o+t, ps=s/n*Pt, po=o/n*Pt, pt=t/n*Pt, K=pt*pt/(ps*ps*po);
  return {q:`At equilibrium a mixture contains ${f2(s)} mol SO₂, ${f2(o)} mol O₂ and ${f2(t)} mol SO₃ at a total pressure of ${Pt} kPa. Calculate $K_p$.${RX(T`2\,\mathrm{SO_2(g)} + \mathrm{O_2(g)} \rightleftharpoons 2\,\mathrm{SO_3(g)}`)}`,ans:K,unit:'kPa⁻¹',steps:[
   `Total moles = ${f2(n)}. Partial pressure = mole fraction × total pressure:`,
   RX(T`p(\mathrm{SO_2})=\dfrac{${f2(s)}}{${f2(n)}}\times ${Pt}=${N(ps,4)}\quad p(\mathrm{O_2})=${N(po,4)}\quad p(\mathrm{SO_3})=${N(pt,4)}\ \text{kPa}`),
   RX(T`K_p=\dfrac{p(\mathrm{SO_3})^2}{p(\mathrm{SO_2})^2\,p(\mathrm{O_2})}=\dfrac{(${N(pt,4)})^2}{(${N(ps,4)})^2\times ${N(po,4)}}=`+B(N(K))+T`\ \text{kPa}^{-1}`)]}; }},
{id:'phstrong',topic:'5.1.3',title:'pH of strong acids and bases',desc:'$\\mathrm{pH}=-\\log[\\mathrm{H^+}]$, and $K_w$ for bases.',ph:true,gen(){ const t=P(['a','a','r','b','b2']);
  if(t==='a'){ const c=+(R(0.001,0.5,4)).toPrecision(3), pH=-Math.log10(c); return {q:`Calculate the pH of ${c} mol dm⁻³ hydrochloric acid.`,ans:pH,unit:'',steps:[`HCl is a strong acid, so it fully dissociates: $[\\mathrm{H^+}] = ${c}$ mol dm⁻³.`,RX(T`\mathrm{pH}=-\log[\mathrm{H^+}]=-\log(${c})=`+B(pH.toFixed(2)))]}; }
  if(t==='r'){ const pH=R(0.5,3.5,2), c=Math.pow(10,-pH); return {q:`A solution of nitric acid has a pH of ${pH.toFixed(2)}. What is its concentration?`,ans:c,unit:'mol dm⁻³',tol:0.02,steps:[RX(T`[\mathrm{H^+}]=10^{-\mathrm{pH}}=10^{-${pH.toFixed(2)}}=`+B(N(c))+MOLDM),`HNO₃ is strong and monobasic, so this is also the concentration of the acid.`]}; }
  const two=t==='b2', c=+(R(0.002,0.2,4)).toPrecision(3), oh=two?2*c:c, h=1e-14/oh, pH=-Math.log10(h);
  return {q:`Calculate the pH of ${c} mol dm⁻³ ${two?'barium hydroxide, Ba(OH)₂':'sodium hydroxide'}. ($K_w = 1.00\\times10^{-14}\\ \\text{mol}^2\\ \\text{dm}^{-6}$)`,ans:pH,unit:'',steps:[
   RX(T`[\mathrm{OH^-}]=${two?T`2\times ${c}=`:''}${N(oh)}`+MOLDM),
   RX(T`[\mathrm{H^+}]=\dfrac{K_w}{[\mathrm{OH^-}]}=\dfrac{1.00\times 10^{-14}}{${N(oh)}}=${N(h)}`+MOLDM),
   RX(T`\mathrm{pH}=-\log(${N(h)})=`+B(pH.toFixed(2)))]}; }},
{id:'phweak',topic:'5.1.3',title:'pH of weak acids',desc:'$[\\mathrm{H^+}]=\\sqrt{K_a[\\mathrm{HA}]}$',ph:true,gen(){ const [nm,Ka]=P([['ethanoic acid',1.74e-5],['methanoic acid',1.78e-4],['propanoic acid',1.35e-5],['benzoic acid',6.31e-5]]); const c=+(R(0.010,0.500,3)).toPrecision(3);
  if(Math.random()<.7){ const h=Math.sqrt(Ka*c), pH=-Math.log10(h); return {q:`Calculate the pH of ${c} mol dm⁻³ ${nm}. ($K_a = ${N(Ka)}\\ \\text{mol dm}^{-3}$)`,ans:pH,unit:'',steps:[
     `Assume $[\\mathrm{H^+}] = [\\mathrm{A^-}]$ and $[\\mathrm{HA}]_{\\text{eqm}} \\approx ${c}$, so $K_a = \\dfrac{[\\mathrm{H^+}]^2}{[\\mathrm{HA}]}$:`,
     RX(T`[\mathrm{H^+}]=\sqrt{K_a\times[\mathrm{HA}]}=\sqrt{${N(Ka)}\times ${c}}=${N(h)}`+MOLDM),
     RX(T`\mathrm{pH}=-\log(${N(h)})=`+B(pH.toFixed(2)))]}; }
  const pH=+(-Math.log10(Math.sqrt(Ka*c))).toFixed(2), h=Math.pow(10,-pH), K=h*h/c;
  return {q:`A ${c} mol dm⁻³ solution of a weak monobasic acid has pH ${pH.toFixed(2)}. Calculate $K_a$.`,ans:K,unit:'mol dm⁻³',tol:0.03,steps:[
   RX(T`[\mathrm{H^+}]=10^{-${pH.toFixed(2)}}=${N(h)}`+MOLDM),
   RX(T`K_a=\dfrac{[\mathrm{H^+}]^2}{[\mathrm{HA}]}=\dfrac{(${N(h)})^2}{${c}}=`+B(N(K))+MOLDM)]}; }},
{id:'buffer',topic:'5.1.3',title:'Buffer pH',desc:'$[\\mathrm{H^+}]=K_a\\dfrac{[\\mathrm{HA}]}{[\\mathrm{A^-}]}$',ph:true,gen(){ const Ka=P([1.74e-5,1.35e-5,1.78e-4,6.31e-5]);
  if(Math.random()<.5){ const a=+R(0.050,0.500,3).toFixed(3), b=+R(0.050,0.500,3).toFixed(3), h=Ka*a/b, pH=-Math.log10(h);
    return {q:`A buffer contains ${a.toFixed(3)} mol dm⁻³ of a weak acid HA and ${b.toFixed(3)} mol dm⁻³ of its sodium salt. $K_a = ${N(Ka)}$ mol dm⁻³. Calculate the pH.`,ans:pH,unit:'',steps:[
     RX(T`[\mathrm{H^+}]=K_a\times\dfrac{[\mathrm{HA}]}{[\mathrm{A^-}]}=${N(Ka)}\times\dfrac{${a.toFixed(3)}}{${b.toFixed(3)}}=${N(h)}`+MOLDM),
     RX(T`\mathrm{pH}=-\log(${N(h)})=`+B(pH.toFixed(2)))]}; }
  const Va=P([25.0,50.0]), c=P([0.100,0.200]), Vb=+(Va*R(0.15,0.85,2)).toFixed(1), na=c*Va/1000, nb=c*Vb/1000, ha=na-nb, h=Ka*ha/nb, pH=-Math.log10(h);
  return {q:`${f1(Vb)} cm³ of ${c.toFixed(3)} mol dm⁻³ NaOH is added to ${f1(Va)} cm³ of ${c.toFixed(3)} mol dm⁻³ of a weak acid HA ($K_a = ${N(Ka)}$ mol dm⁻³). Calculate the pH of the buffer formed.`,ans:pH,unit:'',steps:[
   RX(T`n(\mathrm{HA})_{\text{start}}=${c.toFixed(3)}\times\dfrac{${f1(Va)}}{1000}=${N(na,3)}$$$$ n(\mathrm{OH^-})=${c.toFixed(3)}\times\dfrac{${f1(Vb)}}{1000}=${N(nb,3)}`),
   `The OH⁻ turns that much HA into A⁻:`+RX(T`n(\mathrm{HA})=${N(na,3)}-${N(nb,3)}=${N(ha,3)}$$$$ n(\mathrm{A^-})=${N(nb,3)}`),
   `Both are in the same volume, so use moles directly:`+RX(T`[\mathrm{H^+}]=K_a\times\dfrac{n(\mathrm{HA})}{n(\mathrm{A^-})}=${N(Ka)}\times\dfrac{${N(ha,3)}}{${N(nb,3)}}=${N(h)}`),
   RX(T`\mathrm{pH}=-\log(${N(h)})=`+B(pH.toFixed(2)))]}; }},
{id:'orders',topic:'5.1.1',title:'Orders from initial rates',desc:'Read the orders and k from a rates table.',gen(){ const a=P([0,1,2]), b=P([0,1,2,1]), k=+R(0.5,9.5,1), A0=0.010, B0=P([0.010,0.020]), fa=P([2,3]), fb=P([2,3]);
  const rate=(x,y)=>k*Math.pow(x,a)*Math.pow(y,b); const rows=[[A0,B0],[A0*fa,B0],[A0*fa,B0*fb]].map(([x,y])=>[x,y,rate(x,y)]);
  const table=tbl(['Run','[A] / mol dm⁻³','[B] / mol dm⁻³','Initial rate / mol dm⁻³ s⁻¹'],rows.map((r,i)=>[i+1,sf(r[0],2),sf(r[1],2),`$${N(r[2],3)}$`]));
  const why=[`Runs 1 → 2: [A] × ${fa} with [B] constant, and the rate × ${sf(rows[1][2]/rows[0][2],3)}. Since $${fa}^{${a}} = ${Math.pow(fa,a)}$, the order in A is <b>${a}</b>.`,`Runs 2 → 3: [B] × ${fb} with [A] constant, and the rate × ${sf(rows[2][2]/rows[1][2],3)}. Since $${fb}^{${b}} = ${Math.pow(fb,b)}$, the order in B is <b>${b}</b>.`];
  const which=P(['A','B','overall','k']); const units=['s⁻¹','dm³ mol⁻¹ s⁻¹','dm⁶ mol⁻² s⁻¹','dm⁹ mol⁻³ s⁻¹'];
  if(which==='k'){ const ov=a+b; return {q:`For the reaction A + B → products:${table}Find the orders, then calculate the rate constant $k$ (give the number; units ${ov===0?'mol dm⁻³ s⁻¹':units[ov-1]}).`,ans:k,unit:ov===0?'mol dm⁻³ s⁻¹':units[ov-1],steps:[...why,RX(T`\text{rate}=k[\mathrm{A}]^{${a}}[\mathrm{B}]^{${b}}\ \Rightarrow\ k=\dfrac{\text{rate}}{[\mathrm{A}]^{${a}}[\mathrm{B}]^{${b}}}=\dfrac{${N(rows[0][2],3)}}{(${A0})^{${a}}(${B0})^{${b}}}=`+B(N(k)))]}; }
  const ans=which==='A'?a:which==='B'?b:a+b; return {q:`For the reaction A + B → products:${table}What is the ${which==='overall'?'overall order':'order with respect to '+which}?`,ans,int:true,unit:'',steps:[...why,RX(T`\text{rate}=k[\mathrm{A}]^{${a}}[\mathrm{B}]^{${b}}`),`Answer: <b>${ans}</b>`]}; }},
{id:'halflife',topic:'5.1.1',title:'Half-life and k',desc:'First order: $k=\\dfrac{\\ln 2}{t_{1/2}}$',gen(){ if(Math.random()<.5){ const t=R(10,600,0), k=Math.LN2/t; return {q:`A first-order reaction has a half-life of ${t} s. Calculate the rate constant.`,ans:k,unit:'s⁻¹',steps:[RX(T`k=\dfrac{\ln 2}{t_{1/2}}=\dfrac{0.693}{${t}}=`+B(N(k))+T`\ \text{s}^{-1}`)]}; }
  const k=+(R(0.001,0.08,4)).toPrecision(3), t=Math.LN2/k; return {q:`A first-order reaction has $k = ${N(k)}\\ \\text{s}^{-1}$. Calculate its half-life.`,ans:t,unit:'s',steps:[RX(T`t_{1/2}=\dfrac{\ln 2}{k}=\dfrac{0.693}{${N(k)}}=`+B(N(t))+T`\ \text{s}`)]}; }},
{id:'arrhenius',topic:'5.1.1',title:'Arrhenius equation',desc:'$E_a$ from a gradient; $k$ from $A$, $E_a$ and $T$.',gen(){ if(Math.random()<.5){ const g=R(3000,15000,0), Ea=g*8.314/1000; return {q:`A graph of $\\ln k$ against $\\dfrac{1}{T}$ is a straight line with gradient $-${g}$ K. Calculate the activation energy in kJ mol⁻¹. ($R = 8.314\\ \\text{J mol}^{-1}\\ \\text{K}^{-1}$)`,ans:Ea,unit:'kJ mol⁻¹',steps:[
    `The straight-line form of the Arrhenius equation is`+RX(T`\ln k=-\dfrac{E_a}{R}\cdot\dfrac{1}{T}+\ln A`)+`so the gradient is $-\\dfrac{E_a}{R}$.`,
    RX(T`E_a=${g}\times 8.314=${N(g*8.314,4)}\ \text{J mol}^{-1}=`+B(N(Ea))+KJ)]}; }
  const A=+(Math.pow(10,R(9,13,1))).toPrecision(2), Ea=R(40,110,0), Tk=R(290,420,0), x=Ea*1000/(8.314*Tk), k=A*Math.exp(-x);
  return {q:`Calculate $k$ at ${Tk} K for a reaction with $A = ${N(A,2)}\\ \\text{s}^{-1}$ and $E_a = ${Ea}\\ \\text{kJ mol}^{-1}$. ($R = 8.314\\ \\text{J mol}^{-1}\\ \\text{K}^{-1}$)`,ans:k,unit:'s⁻¹',tol:0.02,steps:[
   `Convert $E_a$ to J mol⁻¹ first:`+RX(T`\dfrac{E_a}{RT}=\dfrac{${Ea*1000}}{8.314\times ${Tk}}=${x.toFixed(3)}`),
   RX(T`k=Ae^{-E_a/RT}=${N(A,2)}\times e^{-${x.toFixed(3)}}=`+B(N(k))+T`\ \text{s}^{-1}`)]}; }},
{id:'bornhaber',topic:'5.2.1',title:'Born–Haber cycles',desc:'Lattice enthalpy from the other steps.',gen(){ const c=P(Object.keys(BH.F)); const m=c.match(/^(Li|Na|K|Mg|Ca)/)[1], x=c.replace(m,'').replace('₂',''), two=c.includes('₂'), M=BH.M[m], X=BH.X[x], ox=x==='O', fH=BH.F[c];
  const steps=[[T`\Delta_{at}H(\mathrm{${m}})`,M[0],1],[T`\text{IE}_1(\mathrm{${m}})`,M[1],1]]; if(M[2]&&(two||ox)) steps.push([T`\text{IE}_2(\mathrm{${m}})`,M[2],1]);
  const nx=two?2:1; steps.push([T`\Delta_{at}H(\mathrm{${x}})`,X[0],nx],[T`\text{EA}_1(\mathrm{${x}})`,X[1],nx]); if(ox) steps.push([T`\text{EA}_2(\mathrm{O})`,X[2],1]);
  const sum=steps.reduce((t,s)=>t+s[1]*s[2],0), L=fH-sum;
  return {q:`Calculate the lattice enthalpy of ${c}, using these values in kJ mol⁻¹:$$\\Delta_f H(${ch(c)}) = ${fH},\\quad ${steps.map(s=>s[0]+' = '+sg(s[1])).join(',\\quad ')}$$`,ans:L,unit:'kJ mol⁻¹',steps:[
   `Going round the cycle, the formation of the solid equals all the steps to the gaseous ions plus the lattice enthalpy:`,
   RX(T`\Delta_f H=${steps.map(s=>(s[2]>1?s[2]:'')+s[0]).join('+')}+\Delta_{LE}H`),
   RX(T`\text{sum of steps}=${steps.map(s=>(s[2]>1?s[2]:'')+'('+s[1]+')').join('+')}=${sum}`),
   RX(T`\Delta_{LE}H=${fH}-${par(sum)}=`+B(L)+KJ)]}; }},
{id:'solution',topic:'5.2.1',title:'Enthalpy of solution',desc:'$\\Delta_{sol}H=-\\Delta_{LE}H+\\bigsum\\Delta_{hyd}H$',gen(){ const c=P(Object.keys(LE)), [l,cat,an]=LE[c], s=-l+HYD[cat]+HYD[an];
  return {q:`Calculate the enthalpy change of solution of ${c}. Values in kJ mol⁻¹:$$\\Delta_{LE}H(${ch(c)}) = ${l},\\quad \\Delta_{hyd}H(${ch(cat)}) = ${HYD[cat]},\\quad \\Delta_{hyd}H(${ch(an)}) = ${HYD[an]}$$`,ans:s,unit:'kJ mol⁻¹',steps:[
   `Dissolving = breaking up the lattice (the reverse of lattice enthalpy) + hydrating each ion:`,
   RX(T`\Delta_{sol}H=-\Delta_{LE}H+\Delta_{hyd}H(${ch(cat)})+\Delta_{hyd}H(${ch(an)})`),
   RX(T`=${-l}+(${HYD[cat]})+(${HYD[an]})=`+B(sg(s))+KJ)]}; }},
{id:'entropy',topic:'5.2.2',title:'Entropy changes',desc:'$\\Delta S=\\bigsum S_{\\text{products}}-\\bigsum S_{\\text{reactants}}$',gen(){ const x=P(SR), sp=sumD(x.p,SS), sr=sumD(x.r,SS), S=sp-sr, used=[...new Set([...x.r,...x.p].map(a=>a[1]))];
  return {q:`Calculate $\\Delta S$ for the reaction below. Standard entropies in J K⁻¹ mol⁻¹:${eqn(x.r,x.p)}${dataList(used,SS,'S')}`,ans:S,unit:'J K⁻¹ mol⁻¹',steps:[
   RX(T`\Delta S=\bigsum S(\text{products})-\bigsum S(\text{reactants})`),
   RX(T`=\big[${termsD(x.p,SS)}\big]-\big[${termsD(x.r,SS)}\big]`),
   RX(T`=${N(sp,4)}-${N(sr,4)}=`+B(N(S,4))+T`\ \text{J K}^{-1}\,\text{mol}^{-1}`)]}; }},
{id:'gibbs',topic:'5.2.2',title:'Gibbs free energy',desc:'$\\Delta G=\\Delta H-T\\Delta S$ and the feasibility temperature.',gen(){ const H=R(-250,250,0)||50, S=R(-300,300,0)||80;
  if(Math.random()<.55||Math.sign(H)!==Math.sign(S)){ const Tk=R(250,1200,0), G=H-Tk*S/1000; return {q:`For a reaction, $\\Delta H = ${sg(H)}\\ \\text{kJ mol}^{-1}$ and $\\Delta S = ${sg(S)}\\ \\text{J K}^{-1}\\ \\text{mol}^{-1}$. Calculate $\\Delta G$ at ${Tk} K.`,ans:G,unit:'kJ mol⁻¹',steps:[
     `Convert ΔS to kJ: $\\Delta S = ${sg(S)}\\ \\text{J K}^{-1}\\ \\text{mol}^{-1} = ${sg(S/1000)}\\ \\text{kJ K}^{-1}\\ \\text{mol}^{-1}$`,
     RX(T`\Delta G=\Delta H-T\Delta S=${H}-(${Tk}\times ${par(S/1000)})=`+B(N(G))+KJ),
     `ΔG is ${G<=0?'negative or zero, so the reaction is <b>feasible</b>':'positive, so the reaction is <b>not feasible</b>'} at this temperature.`]}; }
  const Tk=H/(S/1000); return {q:`For a reaction, $\\Delta H = ${sg(H)}\\ \\text{kJ mol}^{-1}$ and $\\Delta S = ${sg(S)}\\ \\text{J K}^{-1}\\ \\text{mol}^{-1}$. Calculate the temperature at which $\\Delta G = 0$.`,ans:Tk,unit:'K',steps:[
   RX(T`\Delta G=0\ \Rightarrow\ \Delta H=T\Delta S\ \Rightarrow\ T=\dfrac{\Delta H}{\Delta S}=\dfrac{${H}}{${S/1000}}=`+B(N(Tk))+T`\ \text{K}`),
   `The reaction is feasible ${H>0?'above':'below'} this temperature.`]}; }},
{id:'ecell',topic:'5.2.3',title:'Cell potentials',desc:'$E^{\\ominus}_{\\text{cell}}=E^{\\ominus}_{+}-E^{\\ominus}_{-}$',gen(){ let a=P(EO), b=P(EO); while(b===a) b=P(EO); const [hi,lo]=a[1]>b[1]?[a,b]:[b,a], E=hi[1]-lo[1];
  return {q:`Calculate the standard cell potential for a cell made from these two half-cells:$$\\begin{aligned}${half(a[0])}&\\qquad E^{\\ominus}=${a[1].toFixed(2)}\\ \\text{V}\\\\${half(b[0])}&\\qquad E^{\\ominus}=${b[1].toFixed(2)}\\ \\text{V}\\end{aligned}$$`,ans:E,unit:'V',steps:[
   `The more positive half-cell, $${half(hi[0])}$, is the positive electrode and is reduced.`,
   RX(T`E^{\ominus}_{\text{cell}}=E^{\ominus}_{\text{positive}}-E^{\ominus}_{\text{negative}}=${hi[1].toFixed(2)}-${par(+lo[1].toFixed(2))}=`+B(E.toFixed(2))+T`\ \text{V}`)]}; }},
{id:'redoxtit',topic:'5.2.3',title:'Redox titrations',desc:'Manganate(VII) and iodine–thiosulfate.',gen(){ if(Math.random()<.5){ const c=P([0.0100,0.0200,0.0150]), t=Math.round(R(10,28,2)*20)/20, n=c*t/1000, fe=5*n*10, m=fe*55.8;
    return {q:`An iron tablet is dissolved in acid and made up to 250.0 cm³. 25.0 cm³ portions need ${t.toFixed(2)} cm³ of ${c.toFixed(4)} mol dm⁻³ KMnO₄. Calculate the mass of iron in the tablet. ($A_r$ Fe = 55.8)${RX(T`\mathrm{MnO_4^-} + 8\,\mathrm{H^+} + 5\,\mathrm{Fe^{2+}} \longrightarrow \mathrm{Mn^{2+}} + 4\,\mathrm{H_2O} + 5\,\mathrm{Fe^{3+}}`)}`,ans:m,unit:'g',steps:[
     RX(T`n(\mathrm{MnO_4^-})=${c.toFixed(4)}\times\dfrac{${t.toFixed(2)}}{1000}=${N(n,4)}\ \text{mol}`),
     `The ratio MnO₄⁻ : Fe²⁺ is 1 : 5:`+RX(T`n(\mathrm{Fe^{2+}})\ \text{in}\ 25.0\ \text{cm}^3=5\times ${N(n,4)}=${N(5*n,4)}\ \text{mol}`),
     `Scale up to the whole 250.0 cm³ (× 10):`+RX(T`n(\mathrm{Fe})=${N(fe,4)}\ \text{mol}$$$$ m=${N(fe,4)}\times 55.8=`+B(N(m))+T`\ \text{g}`)]}; }
  const c=P([0.100,0.0500]), t=Math.round(R(12,30,2)*20)/20, n=c*t/1000, cu=n/0.025;
  return {q:`Excess KI is added to 25.0 cm³ of a Cu²⁺ solution. The iodine released needs ${t.toFixed(2)} cm³ of ${c.toFixed(3)} mol dm⁻³ Na₂S₂O₃. Calculate [Cu²⁺].$$\\begin{aligned}2\\,\\mathrm{Cu^{2+}} + 4\\,\\mathrm{I^-} &\\longrightarrow 2\\,\\mathrm{CuI} + \\mathrm{I_2}\\\\ \\mathrm{I_2} + 2\\,\\mathrm{S_2O_3^{2-}} &\\longrightarrow 2\\,\\mathrm{I^-} + \\mathrm{S_4O_6^{2-}}\\end{aligned}$$`,ans:cu,unit:'mol dm⁻³',steps:[
   RX(T`n(\mathrm{S_2O_3^{2-}})=${c.toFixed(3)}\times\dfrac{${t.toFixed(2)}}{1000}=${N(n,4)}\ \text{mol}`),
   RX(T`2\,\mathrm{Cu^{2+}}\equiv\mathrm{I_2}\equiv 2\,\mathrm{S_2O_3^{2-}}\ \Rightarrow\ n(\mathrm{Cu^{2+}})=n(\mathrm{S_2O_3^{2-}})=${N(n,4)}\ \text{mol}`),
   RX(T`[\mathrm{Cu^{2+}}]=\dfrac{${N(n,4)}}{0.0250}=`+B(N(cu))+MOLDM)]}; }},
{id:'rf',topic:'6.3.1',title:'Rf values',desc:'$R_f=\\dfrac{\\text{spot distance}}{\\text{solvent front distance}}$',gen(){ const f=R(5.0,9.5,1), s=R(0.8,f-0.3,1), r=s/f; return {q:`On a TLC plate the solvent front moved ${f1(f)} cm from the baseline and a spot moved ${f1(s)} cm. Calculate $R_f$.`,ans:r,unit:'',steps:[RX(T`R_f=\dfrac{\text{distance moved by spot}}{\text{distance moved by solvent front}}=\dfrac{${f1(s)}}{${f1(f)}}=`+B(r.toFixed(2)))]}; }}
];
const BYID=Object.fromEntries(D.map(d=>[d.id,d]));

/* ---------- checking ---------- */
const check=(d,Q,raw)=>{ if(d.text){ const o=parseFormula(raw); if(!o) return null; const a=Q.ans; const ks=new Set([...Object.keys(o),...Object.keys(a)]); return [...ks].every(k=>o[k]===a[k]); }
  const v=parseNum(raw); if(v==null) return null; if(Q.int) return v===Q.ans; if(d.ph&&!Q.tol) return Math.abs(v-Q.ans)<=0.021;
  const tol=Q.tol||0.01; return Math.abs(v-Q.ans)<=Math.abs(Q.ans)*tol+1e-12 || (Math.abs(Q.ans)>=10&&Math.abs(v-Q.ans)<=0.5&&Math.abs(Q.ans)<1000); };
const showAns=(d,Q)=>d.text?Q.show:Q.int?String(Q.ans):d.ph&&!Q.tol?Q.ans.toFixed(2):sf(Q.ans);

window.CHEMDRILLS={list:D,byId:BYID,check,showAns,parseNum,sf,ch};
})();
