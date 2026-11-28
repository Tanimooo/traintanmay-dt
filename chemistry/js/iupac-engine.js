/* TrainTanmay Chemistry: IUPAC naming engine.
   parse(name)  -> molecule (atoms + bonds) built from a typed name, with the parent chain the name used
   name(mol)    -> the IUPAC name, worked out from the structure (longest chain, lowest locants, alphabetical order)
   check(name)  -> parse + name + "is the typed name the right IUPAC name, and if not, why not"
   whyNot(mol)  -> plausible wrong names for a molecule, each with the rule it breaks
   random(opts) -> a random molecule for the quiz
   Covers the A-level families: alkanes, alkenes (with E/Z), halogenoalkanes, alcohols, ethers, aldehydes, ketones,
   carboxylic acids, esters (and diesters), salts, acyl chlorides, anhydrides, amides, nitriles, amines, nitro compounds,
   cycloalkanes and benzene rings. Runs in the browser and in node. */
(function(root){
'use strict';
const STEM=['','meth','eth','prop','but','pent','hex','hept','oct','non','dec','undec','dodec'];
const STEM_RE='(undec|dodec|meth|eth|prop|but|pent|hex|hept|oct|non|dec)';
const MULT=['','','di','tri','tetra','penta','hexa','hepta','octa'];
const CMULT=['','','bis','tris','tetrakis','pentakis','hexakis'];
const MULTN={di:2,tri:3,tetra:4,penta:5,hexa:6,hepta:7,octa:8,bis:2,tris:3,tetrakis:4,pentakis:5,hexakis:6};
const VAL={C:4,N:3,O:2,F:1,Cl:1,Br:1,I:1,NO2:1};
const ZN={C:6,N:7,O:8,F:9,Cl:17,Br:35,I:53,NO2:7};
const HALO={fluoro:'F',chloro:'Cl',bromo:'Br',iodo:'I'};
const HALON={F:'fluoro',Cl:'chloro',Br:'bromo',I:'iodo'};
const METAL={sodium:'Na',potassium:'K',lithium:'Li'}, METALN={Na:'sodium',K:'potassium',Li:'lithium'};
const HALIDE={chloride:'Cl',bromide:'Br',iodide:'I'}, HALIDEN={Cl:'chloride',Br:'bromide',I:'iodide'};
const TERM={al:1,acid:1,anhyd:1,ester:1,acyl:1,amide:1,nitrile:1};
const PRI=['acid','anhyd','ester','acyl','amide','nitrile','al','one','ol','amine'];
const SUFW={acid:'oic acid',ester:'oate',acyl:'oyl chloride',amide:'amide',nitrile:'nitrile',al:'al',one:'one',ol:'ol',amine:'amine'};
const SUFX={acid:'carboxylic acid',ester:'carboxylate',acyl:'carbonyl chloride',amide:'carboxamide',nitrile:'carbonitrile',al:'carbaldehyde'};
const BENZ={'':'benzene',ol:'phenol',amine:'phenylamine',acid:'benzoic acid',al:'benzaldehyde',nitrile:'benzonitrile',amide:'benzamide',acyl:'benzoyl chloride',ester:'benzoate'};
const GROUPWORD={acid:'carboxylic acid group (COOH)',anhyd:'anhydride group',ester:'ester group (COO)',acyl:'acyl chloride group (COCl)',amide:'amide group (CONH₂)',nitrile:'nitrile group (C≡N)',al:'aldehyde group (CHO)',one:'ketone C=O',ol:'OH group',amine:'amine group (NH₂)'};
const E=msg=>{ const e=new Error(msg); e.iu=true; return e; };
const UNSUP='This one is beyond the A-level naming rules this lab knows.';

/* ---------------- molecules ---------------- */
const mk=()=>({atoms:[],bonds:[]});
const addA=(m,el)=>{ m.atoms.push({el}); return m.atoms.length-1; };
const addB=(m,a,b,o,ar)=>{ m.bonds.push({a,b,o:o||1,ar:!!ar}); };
function adj(m){ const A=m.atoms.map(()=>[]); m.bonds.forEach((b,i)=>{ A[b.a].push({j:b.b,o:b.o,ar:b.ar,i}); A[b.b].push({j:b.a,o:b.o,ar:b.ar,i}); }); return A; }
const bsum=(A,i)=>A[i].reduce((s,x)=>s+x.o,0);
const valOf=a=>VAL[a.el]+(a.ch||0);
const hcount=(m,A,i)=>valOf(m.atoms[i])-bsum(A,i);
const bondBetween=(m,a,b)=>m.bonds.find(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a));
function subMol(m,keep){ const map=new Map(), out=mk(); keep.forEach(i=>{ map.set(i,out.atoms.length); out.atoms.push(Object.assign({},m.atoms[i])); });
  m.bonds.forEach(b=>{ if(map.has(b.a)&&map.has(b.b)) out.bonds.push(Object.assign({},b,{a:map.get(b.a),b:map.get(b.b)})); }); return {mol:out,map,inv:keep.slice()}; }
function removeAtoms(m,del){ const D=new Set(del); return subMol(m,m.atoms.map((_,i)=>i).filter(i=>!D.has(i))); }
const clone=m=>JSON.parse(JSON.stringify(m));

function findRings(m,A){
  const N=m.atoms.length, st=new Array(N).fill(0), par=new Array(N).fill(-1), depth=new Array(N).fill(0), rings=[];
  const dfs=(u)=>{ st[u]=1; for(const x of A[u]){ const v=x.j; if(v===par[u]) continue; if(st[v]===0){ par[v]=u; depth[v]=depth[u]+1; dfs(v); } else if(st[v]===1&&depth[v]<depth[u]){ const r=[]; let w=u; while(w!==v){ r.push(w); w=par[w]; } r.push(v); rings.push(r.reverse()); } } st[u]=2; };
  for(let i=0;i<N;i++) if(!st[i]) dfs(i);
  return rings;
}
function isArom(m,r){ if(r.length!==6) return false; const bs=r.map((a,i)=>bondBetween(m,a,r[(i+1)%6])); if(bs.every(b=>b.ar)) return true; const s=bs.map(b=>b.o).join(''); return s==='121212'||s==='212121'; }

/* ---------------- E/Z: CIP priorities ---------------- */
function cmpDesc(a,b){ for(let i=0;i<Math.max(a.length,b.length);i++){ const x=a[i], y=b[i]; if(x===undefined) return -1; if(y===undefined) return 1; if(x!==y) return x-y; } return 0; }
function cipKey(m,A,rt,from){
  const Z=i=>ZN[m.atoms[i].el]||0;
  let front=[{i:rt,from}]; const key=[[Z(rt)]];
  for(let d=0;d<12&&front.length;d++){
    const sets=front.map(f=>{ const k=[];
      if(f.i<0){ if(f.dup) for(let t=0;t<3;t++) k.push({i:-1,z:0}); }
      else if(m.atoms[f.i].el==='NO2') k.push({i:-1,z:8},{i:-1,z:8},{i:-1,z:8,dup:1});
      else { A[f.i].forEach(x=>{ if(x.j!==f.from) k.push({i:x.j,from:f.i,z:Z(x.j)}); for(let t=1;t<x.o;t++) k.push({i:-1,z:Z(x.j),dup:1}); }); const h=hcount(m,A,f.i); for(let t=0;t<h;t++) k.push({i:-1,z:1}); }
      k.sort((p,q)=>q.z-p.z); return {l:k.map(p=>p.z),k}; });
    sets.sort((p,q)=>cmpDesc(q.l,p.l));
    const flat=[].concat(...sets.map(s=>s.l)); if(!flat.length) break; key.push(flat);
    front=[].concat(...sets.map(s=>s.k.filter(p=>p.i>=0||p.dup)));
  }
  return key;
}
function cmpCip(a,b){ for(let i=0;i<Math.max(a.length,b.length);i++){ const c=cmpDesc(a[i]||[],b[i]||[]); if(c) return c; } return 0; }
/* C=C bonds that have E/Z isomers, with the higher-priority group on each end */
function stereoBonds(m,A,rings){
  A=A||adj(m); rings=rings||findRings(m,A);
  const rb=new Set(); rings.forEach(r=>r.forEach((a,i)=>{ const b=r[(i+1)%r.length]; rb.add(a+'-'+b); rb.add(b+'-'+a); }));
  const out=[];
  m.bonds.forEach((bd,bi)=>{ if(bd.o!==2||bd.ar||m.atoms[bd.a].el!=='C'||m.atoms[bd.b].el!=='C'||rb.has(bd.a+'-'+bd.b)) return;
    const side=(p,q)=>{ const s=A[p].filter(x=>x.j!==q).map(x=>({j:x.j,k:cipKey(m,A,x.j,p)})); for(let t=0;t<hcount(m,A,p);t++) s.push({j:-1,k:[[1]]});
      if(s.length!==2) return null; const c=cmpCip(s[0].k,s[1].k); if(!c) return null; return c>0?{hi:s[0].j,lo:s[1].j}:{hi:s[1].j,lo:s[0].j}; };
    const sa=side(bd.a,bd.b), sb=side(bd.b,bd.a); if(!sa||!sb) return;
    out.push({bi,a:bd.a,b:bd.b,d:bd.ez||null,A:sa,B:sb}); });
  return out;
}

/* canonical fingerprint (colour refinement; exact for trees and for the single-ring molecules used here) */
function canon(m){
  const A=adj(m), N=m.atoms.length; if(!N) return '';
  const rs=findRings(m,A); const ar=new Set(); rs.forEach(r=>{ if(isArom(m,r)) r.forEach((a,i)=>{ ar.add(a+'-'+r[(i+1)%6]); ar.add(r[(i+1)%6]+'-'+a); }); });
  const st=new Map(); stereoBonds(m,A,rs).forEach(s=>{ if(s.d) st.set(s.bi,s.d); });
  const bo=(i,x)=>ar.has(i+'-'+x.j)?'a':String(x.o)+(st.get(x.i)||'');
  let lab=m.atoms.map((a,i)=>a.el+(a.ch?(a.ch>0?'+':'-'):'')+(a.ion||'')+'|'+hcount(m,A,i)+'|'+A[i].map(x=>bo(i,x)).sort().join(''));
  const comp=L=>{ const u=[...new Set(L)].sort(); const ix=new Map(u.map((s,k)=>[s,k])); return L.map(s=>ix.get(s)); };
  let c=comp(lab);
  for(let r=0;r<N+1;r++){ const nl=c.map((v,i)=>v+':'+A[i].map(x=>bo(i,x)+c[x.j]).sort().join(',')); const nc=comp(nl); const same=new Set(nc).size===new Set(c).size; lab=nl; c=nc; if(same&&r>2) break; }
  return lab.slice().sort().join(';');
}

/* ---------------- reading a name ---------------- */
const COMMON={'acetone':'propanone','acetic acid':'ethanoic acid','formic acid':'methanoic acid','formaldehyde':'methanal','acetaldehyde':'ethanal','ethylene':'ethene','propylene':'propene','acetylene':'ethyne','toluene':'methylbenzene','aniline':'phenylamine','benzenamine':'phenylamine','chloroform':'trichloromethane','glycerol':'propane-1,2,3-triol','glycerine':'propane-1,2,3-triol','isopropanol':'propan-2-ol','isopropyl alcohol':'propan-2-ol','ethylene glycol':'ethane-1,2-diol','methyl alcohol':'methanol','ethyl alcohol':'ethanol','isobutane':'2-methylpropane','isopentane':'2-methylbutane','neopentane':'2,2-dimethylpropane','isooctane':'2,2,4-trimethylpentane','lactic acid':'2-hydroxypropanoic acid','glycine':'aminoethanoic acid','alanine':'2-aminopropanoic acid','acrylic acid':'propenoic acid','styrene':'phenylethene','ethenylbenzene':'phenylethene','vinyl chloride':'chloroethene','dimethylamine':'N-methylmethanamine','trimethylamine':'N,N-dimethylmethanamine','diethylamine':'N-ethylethanamine','triethylamine':'N,N-diethylethanamine','acetonitrile':'ethanenitrile','acetyl chloride':'ethanoyl chloride','ethyl acetate':'ethyl ethanoate','methyl acetate':'methyl ethanoate','acetamide':'ethanamide','acrylonitrile':'propenenitrile','oxalic acid':'ethanedioic acid','methyl methacrylate':'methyl 2-methylpropenoate','xylene':'1,2-dimethylbenzene','carbon tetrachloride':'tetrachloromethane','freon':'dichlorodifluoromethane','methylamine':'methanamine','ethylamine':'ethanamine','diethyl ether':'ethoxyethane','ether':'ethoxyethane','dimethyl ether':'methoxymethane','anisole':'methoxybenzene','acetic anhydride':'ethanoic anhydride','sodium acetate':'sodium ethanoate','acetophenone':'phenylethanone','benzyl alcohol':'phenylmethanol','adipic acid':'hexanedioic acid','terephthalic acid':'benzene-1,4-dicarboxylic acid','tnt':'2-methyl-1,3,5-trinitrobenzene','putrescine':'butane-1,4-diamine','malonic acid':'propanedioic acid','oxalate':'ethanedioate'};
function norm(s){ return String(s||'').toLowerCase().replace(/[‐-―−]/g,'-').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim()
  .replace(/\s*-\s*/g,'-').replace(/\s*,\s*/g,',').replace(/\(\s+/g,'(').replace(/\s+\)/g,')').replace(/\[/g,'(').replace(/\]/g,')'); }
const locList=s=>s.split(',').map(x=>x==='n'||x==="n'"?'N':+x);

function simpleSub(t){
  let mm;
  const fixed=[['fluoro',{k:'halo',el:'F'}],['chloro',{k:'halo',el:'Cl'}],['bromo',{k:'halo',el:'Br'}],['iodo',{k:'halo',el:'I'}],['hydroxy',{k:'oh'}],['oxo',{k:'oxo'}],['amino',{k:'nh2'}],['nitro',{k:'no2'}],['cyano',{k:'cn'}],
    ['phenoxy',{k:'alkoxy',g:{k:'alkyl',ben:1,n:6,attach:1,prefixes:[]}}],
    ['phenyl',{k:'alkyl',ben:1,n:6,attach:1,prefixes:[]}],['isopropyl',{k:'alkyl',n:3,attach:2,prefixes:[]}],['isobutyl',{k:'alkyl',n:3,attach:1,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],
    ['sec-butyl',{k:'alkyl',n:4,attach:2,prefixes:[]}],['tert-butyl',{k:'alkyl',n:3,attach:2,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],['t-butyl',{k:'alkyl',n:3,attach:2,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],
    ['vinyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:2}],prefixes:[]}],['ethenyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:2}],prefixes:[]}],['ethynyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:3}],prefixes:[]}]];
  for(const [w,d] of fixed) if(t.startsWith(w)) return {len:w.length,sub:JSON.parse(JSON.stringify(d)),raw:w};
  if((mm=t.match(/^(meth|eth|prop|but)oxy/))) return {len:mm[0].length,sub:{k:'alkoxy',g:{k:'alkyl',n:STEM.indexOf(mm[1]),attach:1,prefixes:[]}},raw:mm[0]};
  if((mm=t.match(new RegExp('^(cyclo)?'+STEM_RE+'yloxy')))) return {len:mm[0].length,sub:{k:'alkoxy',g:{k:'alkyl',cyc:!!mm[1],n:STEM.indexOf(mm[2]),attach:1,prefixes:[]}},raw:mm[0]};
  if((mm=t.match(new RegExp('^'+STEM_RE+'an-(\\d+)-yl')))) return {len:mm[0].length,sub:{k:'alkyl',n:STEM.indexOf(mm[1]),attach:+mm[2],prefixes:[]},raw:mm[0]};
  if((mm=t.match(new RegExp('^'+STEM_RE+'-(\\d+)-en(?:-1-)?yl')))) return {len:mm[0].length,sub:{k:'alkyl',n:STEM.indexOf(mm[1]),attach:1,unsat:[{loc:+mm[2],o:2}],prefixes:[]},raw:mm[0]};
  if((mm=t.match(new RegExp('^(cyclo)?'+STEM_RE+'yl')))) return {len:mm[0].length,sub:{k:'alkyl',cyc:!!mm[1],n:STEM.indexOf(mm[2]),attach:1,prefixes:[]},raw:mm[0]};
  return null;
}
function closeParen(s,p){ let d=0; for(let i=p;i<s.length;i++){ if(s[i]==='(') d++; else if(s[i]===')'){ d--; if(!d) return i; } } return -1; }
function parsePrefixes(s){
  const out=[]; let p=0;
  while(p<s.length){
    if(s[p]==='-'){ p++; continue; }
    let locs=null, mult='', mm, t=s.slice(p);
    if((mm=t.match(/^((?:\d+|n'?)(?:,(?:\d+|n'?))*)-/))){ locs=locList(mm[1]); p+=mm[0].length; t=s.slice(p); }
    else if((mm=t.match(/^\d+(?=[a-z])/))) throw E(`Put a hyphen between a number and a letter: “${mm[0]}-${t.slice(mm[0].length).replace(/[^a-z].*$/,'')}”.`);
    else if((mm=t.match(/^\d+(?:[-.]\d+)+-/))) throw E(`Separate numbers with commas, not hyphens or dots: “${mm[0].slice(0,-1).replace(/[-.]/g,',')}-”.`);
    if((mm=t.match(/^(tetrakis|pentakis|hexakis|tris|bis|di|tri|tetra|penta|hexa)(?=[a-z(])/))&&!/^(tri|di)(?=yl)/.test(t)){ mult=mm[1]; p+=mm[0].length; t=s.slice(p); }
    let sub, raw;
    if(t[0]==='('){ const q=closeParen(s,p); if(q<0) throw E('A bracket is not closed.'); raw=s.slice(p+1,q); sub=parseGroup(raw); p=q+1; }
    else { const r=simpleSub(t); if(!r) throw E(`I don't recognise “${t.replace(/-.*$/,'')}” as a substituent. Prefixes look like methyl, ethyl, chloro, bromo, hydroxy, amino, methoxy…`); sub=r.sub; raw=r.raw; p+=r.len; }
    const cnt=mult?MULTN[mult]:1;
    if(locs&&locs.length!==cnt){ const nm=raw; if(cnt===1) throw E(`“${locs.join(',')}-${nm}” has ${locs.length} numbers, so it needs a multiplier: ${locs.join(',')}-${MULT[locs.length]}${nm}.`); throw E(`“${mult}” means ${cnt} groups, but ${locs.length} number${locs.length>1?'s are':' is'} given (${locs.join(',')}).`); }
    out.push({locs,cnt,sub,raw,key:raw.replace(/^(sec|tert|t)-/,'').replace(/[^a-z]/g,'')});
  }
  return out;
}
/* a substituent group such as "1-methylethyl", "2-chloroethyl", "propan-2-yl", "4-methylphenyl" */
function parseGroup(s){
  const whole=simpleSub(s); if(whole&&whole.len===s.length) return whole.sub;
  for(let j=1;j<s.length;j++){
    const r=simpleSub(s.slice(j)); if(!r||j+r.len!==s.length||(r.sub.k!=='alkyl'&&r.sub.k!=='alkoxy')) continue;
    let pre; try{ pre=parsePrefixes(s.slice(0,j)); }catch(e){ continue; }
    const tgt=r.sub.k==='alkoxy'?r.sub.g:r.sub; tgt.prefixes=(tgt.prefixes||[]).concat(pre); return r.sub;
  }
  throw E(`I can't read the group “${s}”.`);
}
const SUFS=[['carboxylic acid','acid',1],['carbaldehyde','al',1],['carbonitrile','nitrile',1],['carboxamide','amide',1],['carbonyl chloride','acyl',1],['carboxylate','ester',1],
  ['oic acid','acid'],['oyl chloride','acyl'],['oate','ester'],['amine','amine'],['amide','amide'],['nitrile','nitrile'],['one','one'],['al','al'],['ol','ol']];
function parseParent(r){
  let mm;
  // benzene family
  const bz=Object.entries(BENZ).find(([,w])=>w===r); if(bz) return {kind:'benzene',n:6,unsat:[],suffix:bz[0]?{t:bz[0],locs:[1],exo:!!TERM[bz[0]]}:null,amb:[]};
  if((mm=r.match(/^benzene-(\d+(?:,\d+)+)-(di|tri)(ol|amine|carboxylic acid|carboxylate|carbonitrile|carbaldehyde)$/))){ const t={ol:'ol',amine:'amine','carboxylic acid':'acid',carboxylate:'ester',carbonitrile:'nitrile',carbaldehyde:'al'}[mm[3]]; const locs=locList(mm[1]); if(locs.length!==MULTN[mm[2]]) throw E('The number of locants does not match '+mm[2]+'.'); return {kind:'benzene',n:6,unsat:[],suffix:{t,locs,exo:!!TERM[t]},amb:[]}; }
  if(!(mm=r.match(new RegExp('^(cyclo)?'+STEM_RE)))) return null;
  const ring=!!mm[1], n=STEM.indexOf(mm[2]); let rest=r.slice(mm[0].length);
  const unsat=[], amb=[]; let noLocU=null;
  if(rest.startsWith('an')) rest=rest.slice(2);
  else { let any=false;
    while(true){
      if((mm=rest.match(/^a?-(\d+(?:,\d+)*)-(di|tri|tetra)?(en|yn)/))){ const locs=locList(mm[1]); const c=mm[2]?MULTN[mm[2]]:1; if(locs.length!==c) throw E(c===1?`${locs.length} locants for one ${mm[3]==='en'?'double':'triple'} bond: did you mean “-${locs.join(',')}-${MULT[locs.length]}${mm[3]}e”?`:`“${mm[2]}${mm[3]}e” needs ${c} locants.`); locs.forEach(l=>unsat.push({loc:l,o:mm[3]==='en'?2:3})); rest=rest.slice(mm[0].length); any=true; continue; }
      if(!any&&(mm=rest.match(/^a?(di|tri)?(en|yn)/))){ if(mm[1]) throw E(`“${mm[1]}${mm[2]}e” needs locants to show where the multiple bonds are, e.g. buta-1,3-diene.`); noLocU={o:mm[2]==='en'?2:3}; rest=rest.slice(mm[0].length); any=true; }
      break; }
    if(!any) return null; }
  if(rest.startsWith('e')) rest=rest.slice(1);
  let sl=null, smult='';
  if((mm=rest.match(/^-(\d+(?:,\d+)*)-/))){ sl=locList(mm[1]); rest=rest.slice(mm[0].length); }
  if((mm=rest.match(/^(di|tri|tetra)/))){ smult=mm[1]; rest=rest.slice(mm[0].length); }
  let suffix=null;
  if(rest===''){ if(sl||smult) return null; }
  else { const f=SUFS.find(x=>x[0]===rest); if(!f) return null;
    const exo=!!f[2], t=f[1], cnt=smult?MULTN[smult]:1;
    if(exo&&!ring) throw E(`“-${f[0]}” is for rings. For a chain, the carbon is part of the chain: use “-${SUFW[t]}”.`);
    if(!exo&&TERM[t]&&ring) throw E(`A ring can't end in “-${SUFW[t]}”: the carbon of that group isn't in the ring. Use cyclo…${SUFX[t]}, e.g. cyclohexane${SUFX[t]}.`);
    if(sl&&sl.length!==cnt) throw E(cnt===1?`${sl.length} locants for one ${SUFW[t]} group: use “${MULT[sl.length]}${SUFW[t]}”.`:`“${smult}${SUFW[t]}” needs ${cnt} locants.`);
    let locs=sl;
    if(!locs){
      if(TERM[t]&&!ring){ if(cnt===1) locs=[1]; else if(cnt===2) locs=[1,n]; else throw E('A chain only has two ends.'); }
      else if(ring&&cnt===1) locs=[1];
      else if(!ring&&n<=2&&cnt===1) locs=[1];
      else if(!ring&&n<=2&&cnt===2&&t!=='one') locs=[1,2];
      else if(t==='one'&&!ring&&(n===3||n===4)&&cnt===1) locs=[2];
      else { locs=Array.from({length:cnt},(_,k)=>Math.min(n,(t==='one'?2:1)+k)); amb.push(`Which carbon is the ${SUFW[t]} group on? Add a locant, e.g. ${STEM[n]}an-${locs.join(',')}-${smult}${SUFW[t]}.`); }
    } else if(TERM[t]&&!ring&&n>1){ sl.forEach(l=>{ if(l!==1&&l!==n) throw E(`The ${GROUPWORD[t]} is always at the end of the chain, so it can't be on carbon ${l}.`); }); }
    suffix={t,locs,exo};
  }
  if(noLocU){ let loc;
    if(ring){ loc=1; if(suffix) { loc=2; if(!(suffix.locs.length===1&&suffix.locs[0]===1)) amb.push('Which carbon is the double bond on? Add a locant.'); } }
    else if(n<=2) loc=1;
    else if(n===3) loc=suffix&&TERM[suffix.t]?2:(suffix?1:1);
    else { loc=suffix&&TERM[suffix.t]?2:1; amb.push(`Where is the ${noLocU.o===2?'double':'triple'} bond? “${STEM[n]}${noLocU.o===2?'ene':'yne'}” could be ${STEM[n]}-1-${noLocU.o===2?'ene':'yne'} or ${STEM[n]}-2-${noLocU.o===2?'ene':'yne'}: add a locant.`); }
    if(n===3&&suffix&&!TERM[suffix.t]) amb.push('Where is the double bond? Add a locant, e.g. prop-2-en-1-ol.');
    unsat.push({loc,o:noLocU.o}); }
  return {kind:ring?'ring':'chain',n,unsat,suffix,amb};
}
function parseMain(s){
  let lastErr=null;
  for(let i=0;i<=s.length;i++){
    if(i>0&&!/[a-z)]/.test(s[i-1])) continue;
    let par; try{ par=parseParent(s.slice(i)); }catch(e){ lastErr=e; continue; }
    if(!par) continue;
    let pre; try{ pre=i?parsePrefixes(s.slice(0,i)):[]; }catch(e){ lastErr=e; continue; }
    par.prefixes=pre; par.prefixText=s.slice(0,i); return par;
  }
  if(lastErr) throw lastErr;
  if(/(ane|ene|yne|ol|al|one|oic acid|amine|amide|nitrile)$/.test(s)) throw E(`I couldn't find the parent chain in “${s}”. Check the spelling of the stem (meth, eth, prop, but, pent, hex, hept, oct, non, dec).`);
  throw E(`I can't read “${s}” as a name. It should end in something like -ane, -ene, -ol, -al, -one, -oic acid, -amine or -nitrile.`);
}
/* the first word(s) of an ester or carboxylate salt: "methyl", "dimethyl", "ethyl methyl", "sodium", "disodium" */
function parseEsterWords(words){
  const out=[], keys=[];
  words.forEach(w0=>{ const w=w0.replace(/^\((.*)\)$/,'$1'); let mm;
    if((mm=w.match(/^(di|tri)?(sodium|potassium|lithium)$/))){ const n=mm[1]?MULTN[mm[1]]:1; for(let k=0;k<n;k++) out.push({k:'metal',el:METAL[mm[2]]}); keys.push(mm[2]); return; }
    try{ const g=parseGroup(w); if(g.k!=='alkyl') throw E(''); out.push(g); keys.push(w.replace(/[^a-z]/g,'')); return; }catch(e){}
    if((mm=w.match(/^(di|tri|tetra|bis|tris)\(?(.+?)\)?$/))){ let g; try{ g=parseGroup(mm[2]); }catch(e){ g=null; }
      if(g&&g.k==='alkyl'){ for(let k=0;k<MULTN[mm[1]];k++) out.push(JSON.parse(JSON.stringify(g))); keys.push(mm[2].replace(/[^a-z]/g,'')); return; } }
    throw E(`I can't read “${w0}” as the first part of an ester or salt name. It should be an alkyl group (methyl, ethyl…) or a metal (sodium, potassium).`); });
  const bad=keys.some((k,i)=>i&&k<keys[i-1]);
  return {list:out,bad,keys};
}
function parseName(input){
  let s=norm(input); const notes=[];
  if(!s) throw E('Type a name.');
  if(COMMON[s]){ notes.push(`“${s}” is a common name. Its IUPAC name is ${COMMON[s]}.`); s=norm(COMMON[s]); }
  let mm=s.match(new RegExp('^(\\d+-(?:methyl|ethyl)|)'+STEM_RE+'ylamine$'));
  if(mm){ const nn=mm[1]+mm[2]+'an-1-amine'; notes.push(`“${s}” is an older style of name. IUPAC: ${mm[2]==='meth'||mm[2]==='eth'?nn.replace('an-1-','an'):nn}.`); s=nn; }
  if((mm=s.match(/^(.+)amine hydro(chloride|bromide|iodide)$/))) throw E(`“…amine hydro${mm[2]}” is an older way to name the salt. The IUPAC name is …ammonium ${mm[2]}, e.g. ${/yl$/.test(mm[1])?mm[1]:mm[1].replace(/an(-\d+-)?$/,'yl')}ammonium ${mm[2]}.`);
  // ammonium salts: groups on the N, then "ammonium", then the halide ion
  if((mm=s.match(/^(.*)ammonium (chloride|bromide|iodide)$/))){
    if(!mm[1]) throw E('Ammonium chloride, NH₄Cl, has no carbon, so it is not an organic compound.');
    const pre=parsePrefixes(mm[1]);
    pre.forEach(p=>{ if(p.locs&&p.locs.some(l=>l!=='N')) throw E('In an ammonium salt every group is on the N, so no numbers are needed, e.g. ethylammonium chloride.'); if(p.sub.k!=='alkyl') throw E('Only carbon groups (methyl, ethyl, phenyl…) go on the N⁺ of an ammonium salt.'); });
    const keys=pre.map(p=>p.key); const bad=keys.some((k,i)=>i&&k<keys[i-1]);
    return {kind:'ammonium',prefixes:pre,halide:HALIDE[mm[2]],notes,n:0,unsat:[],amb:bad?['Name the groups on the N in alphabetical order (ignore di-, tri-…).']:[]}; }
  if(/ammonium$/.test(s)) throw E('An ammonium salt name ends with the negative ion, e.g. ethylammonium chloride.');
  // anhydrides
  if((mm=s.match(/^([a-z0-9,()-]+?ic)(?: ([a-z0-9,()-]+?ic))? anhydride$/))){
    const ws=[mm[1],mm[2]||mm[1]]; const acids=ws.map(w=>{ const P=parseName(w+' acid'); if(!(P.suffix&&P.suffix.t==='acid'&&P.suffix.locs.length===1)||P.kind==='anhydride') throw E('Each half of an anhydride comes from a carboxylic acid with one COOH group, e.g. ethanoic anhydride.'); return P; });
    const amb=[]; if(mm[2]&&mm[2]<mm[1]) amb.push('Name the two acids in alphabetical order.'); if(mm[2]&&mm[2]===mm[1]) amb.push(`When both halves are the same, name the acid once: ${mm[1]} anhydride.`);
    return {kind:'anhydride',acids,notes,amb,n:0,unsat:[]}; }
  if(/ acid anhydride$/.test(s)) throw E('Leave out “acid”: an anhydride is named like “ethanoic anhydride”.');
  let main=s, words=null;
  const parts=s.split(' '), nMain=/ (acid|chloride)$/.test(s)?2:1;
  if(parts.length>nMain){
    const al=parts.slice(0,parts.length-nMain), rest=parts.slice(-nMain).join(' ');
    if(!/(oate|carboxylate)$/.test(rest)){ const a1=al.join(' ');
      if(/(oate|carboxylate)$/.test(a1)&&/^(sodium|potassium|lithium)$/.test(rest)) throw E(`Name the positive ion first, then the negative ion: “${rest} ${a1}”.`);
      if(/yl$/.test(a1)&&/oic acid$/.test(rest)) throw E(`Esters are named alkyl …oate, e.g. “${a1} ${rest.replace(/oic acid$/,'oate')}”.`);
      if(/^(sodium|potassium|lithium)$/.test(a1)&&/oic acid$/.test(rest)) throw E(`In the salt the acid has lost H⁺, so “-oic acid” becomes “-oate”: “${a1} ${rest.replace(/oic acid$/,'oate')}”.`);
      throw E(`I can't read “${s}”. Only esters (ethyl ethanoate), salts (sodium ethanoate), acids, acyl chlorides and anhydrides have a space.`); }
    words=parseEsterWords(al); main=rest;
  }
  // E/Z (and cis/trans) at the front of the main part
  let ez=[], ct=null;
  main=main.replace(/^\(((?:\d*[ezrs])(?:,\d*[ezrs])*)\)-/,(w,inner)=>{ inner.split(',').forEach(x=>{ const m2=x.match(/^(\d*)([ezrs])$/); if(/[rs]/.test(m2[2])){ if(!notes.some(n=>/R\/S/.test(n))) notes.push('R/S labels are ignored here: the drawing shows the structure, not the 3D arrangement.'); return; } ez.push({loc:m2[1]?+m2[1]:null,d:m2[2].toUpperCase()}); }); return ''; })
    .replace(/^([ez])-(?=[a-z\d(])/,(w,d)=>{ ez.push({loc:null,d:d.toUpperCase()}); return ''; })
    .replace(/^(cis|trans)-(?=[a-z\d(])/,(w,d)=>{ ct=d; return ''; });
  const P=parseMain(main); P.esterWords=words?words.list:null; P.esterWordsBad=words?words.bad:false; P.ez=ez; P.cistrans=ct; P.notes=notes; return P;
}
function parseNameLenient(input){
  try{ return parseName(input); }
  catch(e){ const s=norm(input); if(!e.iu||!/ /.test(s)||/ (acid|chloride|bromide|iodide|anhydride)$/.test(s)||/(oate|carboxylate)$/.test(s)) throw e;
    let P; try{ P=parseName(s.replace(/ /g,'')); }catch(e2){ throw e; }
    P.spaced=true; return P; }
}

/* ---------------- building a molecule from a reading ---------------- */
function attach(m,at,sub,amb){
  switch(sub.k){
    case 'halo': addB(m,at,addA(m,sub.el)); break;
    case 'oh': addB(m,at,addA(m,'O')); break;
    case 'oxo': addB(m,at,addA(m,'O'),2); break;
    case 'nh2': addB(m,at,addA(m,'N')); break;
    case 'no2': addB(m,at,addA(m,'NO2')); break;
    case 'cn': { const c=addA(m,'C'); addB(m,at,c); addB(m,c,addA(m,'N'),3); break; }
    case 'alkoxy': { const o=addA(m,'O'); addB(m,at,o); addB(m,o,buildSub(m,sub.g,amb)); break; }
    case 'alkyl': addB(m,at,buildSub(m,sub,amb)); break;
  }
}
function placePrefixes(m,ids,n,kind,prefixes,amb,isSub,hasSuffix,Nat){
  const T=prefixes.reduce((s,p)=>s+p.cnt,0);
  prefixes.forEach(pr=>{
    let locs=pr.locs;
    if(!locs){
      if(n===1) locs=Array(pr.cnt).fill(1);
      else if(!isSub&&kind==='chain'&&n===2&&hasSuffix==='term') locs=Array(pr.cnt).fill(2);
      else if(!isSub&&kind==='chain'&&n===2&&hasSuffix==='one'&&T===1) locs=[1];
      else if(!isSub&&T===1&&!hasSuffix) locs=[1];
      else { locs=Array.from({length:pr.cnt},(_,k)=>Math.min(n,(isSub?2:1)+k)); amb.push(`“${MULT[pr.cnt]||''}${pr.raw}” needs ${pr.cnt>1?'numbers':'a number'} (locant${pr.cnt>1?'s':''}) to show which carbon${pr.cnt>1?'s':''} ${pr.cnt>1?'they are':'it is'} on.`); }
    }
    locs.forEach(l=>{
      if(l==='N'){ if(Nat==null) throw E('“N-” is only used for amines and amides, to show a group on the nitrogen.'); attach(m,Nat,pr.sub,amb); return; }
      if(!(l>=1&&l<=n)) throw E(`There's no carbon ${l}: the ${kind==='chain'?'chain':'ring'} only has ${n}.`);
      attach(m,ids[l-1],pr.sub,amb); });
  });
}
function buildSub(m,d,amb){
  const ids=[];
  if(d.ben){ for(let i=0;i<6;i++) ids.push(addA(m,'C')); for(let i=0;i<6;i++) addB(m,ids[i],ids[(i+1)%6],i%2?1:2,true); }
  else { for(let i=0;i<d.n;i++) ids.push(addA(m,'C')); for(let i=0;i<d.n-1;i++) addB(m,ids[i],ids[i+1]); if(d.cyc){ if(d.n<3) throw E('A ring needs at least 3 carbons.'); addB(m,ids[d.n-1],ids[0]); } }
  (d.unsat||[]).forEach(u=>{ const b=bondBetween(m,ids[u.loc-1],ids[u.loc]); if(!b) throw E('That double bond is off the end of the group.'); b.o=u.o; });
  const at=d.attach||1; if(at>ids.length) throw E(`A ${STEM[d.n]}yl group doesn't have a carbon ${at}.`);
  placePrefixes(m,ids,ids.length,d.cyc||d.ben?'ring':'chain',d.prefixes||[],amb,true,false,null);
  return ids[at-1];
}
function acidSite(m){ const A=adj(m); for(let c=0;c<m.atoms.length;c++){ if(m.atoms[c].el!=='C') continue; const dO=A[c].some(x=>m.atoms[x.j].el==='O'&&x.o===2); const oh=A[c].find(x=>m.atoms[x.j].el==='O'&&x.o===1&&A[x.j].length===1&&!m.atoms[x.j].ch); if(dO&&oh) return {c,o:oh.j}; } return null; }
function build(P){
  const amb=(P.amb||[]).slice();
  if(P.kind==='ammonium'){ const m=mk(); const N=addA(m,'N'); m.atoms[N].ch=1; m.atoms[N].ion=P.halide;
    P.prefixes.forEach(pr=>{ for(let k=0;k<pr.cnt;k++) attach(m,N,pr.sub,amb); });
    const A=adj(m); if(hcount(m,A,N)<0) throw E('N⁺ can only hold four groups.');
    return {mol:m,order:[],ring:false,amb}; }
  if(P.kind==='anhydride'){ const b1=build(P.acids[0]), b2=build(P.acids[1]); const m=b1.mol, off=m.atoms.length;
    const p1=acidSite(b1.mol), p2=acidSite(b2.mol); if(!p1||!p2) throw E(UNSUP);
    b2.mol.atoms.forEach(a=>m.atoms.push(Object.assign({},a))); b2.mol.bonds.forEach(b=>m.bonds.push(Object.assign({},b,{a:b.a+off,b:b.b+off})));
    addB(m,p1.o,p2.c+off); const r=removeAtoms(m,[p2.o+off]);
    return {mol:r.mol,order:b1.order,ring:b1.ring,amb:amb.concat(b1.amb,b2.amb)}; }
  const m=mk(), order=[], n=P.n;
  if(P.kind==='benzene'){ for(let i=0;i<6;i++) order.push(addA(m,'C')); for(let i=0;i<6;i++) addB(m,order[i],order[(i+1)%6],i%2?1:2,true); }
  else { if(P.kind==='ring'&&n<3) throw E('A ring needs at least 3 carbons.'); for(let i=0;i<n;i++) order.push(addA(m,'C')); for(let i=0;i<n-1;i++) addB(m,order[i],order[i+1]); if(P.kind==='ring') addB(m,order[n-1],order[0]); }
  const L=i=>{ if(!(i>=1&&i<=n)) throw E(`There's no carbon ${i}: the ${P.kind==='chain'?'chain':'ring'} only has ${n}.`); return order[i-1]; };
  P.unsat.forEach(u=>{ const a=L(u.loc); let b;
    if(P.kind==='chain'){ if(u.loc>=n) throw E(n===1?'One carbon can\'t have a C=C double bond: the smallest alkene is ethene.':`A ${u.o===2?'double':'triple'} bond at carbon ${u.loc} needs carbon ${u.loc+1}, but the chain stops at ${n}.`); b=order[u.loc]; }
    else b=order[u.loc%n];
    const bd=bondBetween(m,a,b); if(bd.o>1) throw E(`Two multiple bonds can't both be at position ${u.loc}.`); bd.o=u.o; });
  let Nat=null; const S=P.suffix, ketEnds=[], words=P.esterWords||[]; let wi=0;
  if(S){
    if(S.t==='ester'){ if(!words.length) throw E('An ester name needs the alkyl part first, e.g. “methyl ethanoate”, and a salt needs the metal first, e.g. “sodium ethanoate”.');
      if(words.length!==S.locs.length){ if(words.length===1&&S.locs.length>1) throw E(`There are ${S.locs.length} ester groups, so the first word needs a multiplier, e.g. “${MULT[S.locs.length]}${words[0].k==='metal'?METALN[words[0].el]:'methyl'} …”.`); throw E(`There ${words.length>1?'are':'is'} ${words.length} alkyl group${words.length>1?'s':''} but ${S.locs.length} ester group${S.locs.length>1?'s':''}.`); } }
    S.locs.forEach(loc=>{ let c=L(loc);
    if(S.exo){ const x=addA(m,'C'); addB(m,c,x); c=x; }
    switch(S.t){
      case 'ol': addB(m,c,addA(m,'O')); break;
      case 'one': addB(m,c,addA(m,'O'),2); if(P.kind==='chain'&&(loc===1||loc===n)) ketEnds.push([c,loc]); break;
      case 'al': addB(m,c,addA(m,'O'),2); break;
      case 'acid': addB(m,c,addA(m,'O'),2); addB(m,c,addA(m,'O')); break;
      case 'ester': { addB(m,c,addA(m,'O'),2); const o=addA(m,'O'); addB(m,c,o); const w=words[wi++]; if(w.k==='metal'){ m.atoms[o].ch=-1; m.atoms[o].ion=w.el; } else addB(m,o,buildSub(m,w,amb)); break; }
      case 'acyl': addB(m,c,addA(m,'O'),2); addB(m,c,addA(m,'Cl')); break;
      case 'amide': { addB(m,c,addA(m,'O'),2); const x=addA(m,'N'); addB(m,c,x); if(Nat==null) Nat=x; break; }
      case 'nitrile': addB(m,c,addA(m,'N'),3); break;
      case 'amine': { const x=addA(m,'N'); addB(m,c,x); if(Nat==null) Nat=x; break; }
    } }); }
  else if(words.length) throw E('The second word of an ester name ends in -oate, e.g. ethyl propanoate.');
  if(P.esterWordsBad) amb.push('When the two alkyl groups are different, write them as separate words in alphabetical order, e.g. ethyl methyl propanedioate.');
  placePrefixes(m,order,n,P.kind,P.prefixes||[],amb,false,S?(TERM[S.t]?'term':(S.t==='one'&&n===2&&P.kind==='chain'?'one':'yes')):false,Nat);
  const A=adj(m);
  ketEnds.forEach(([c,loc])=>{ if(A[c].filter(x=>m.atoms[x.j].el==='C').length<2) throw E(n===1?'With one carbon, C=O is methanal (an aldehyde), not a ketone.':`A C=O on the end carbon (${loc}) is an aldehyde, so the name would end in -al, not -one. Ketone C=O groups are never on the end of the chain.`); });
  for(let i=0;i<m.atoms.length;i++){ const h=hcount(m,A,i); if(h<0){ const el=m.atoms[i].el; const k=order.indexOf(i);
    throw E(el==='C'?`${k>=0?'Carbon '+(k+1):'A carbon'} would have ${bsum(A,i)} bonds, but carbon can only make 4. Check the locants.`:`The ${el==='N'?'nitrogen':el==='O'?'oxygen':el} would have too many bonds.`); } }
  if(P.kind==='chain'&&n===1&&P.unsat.length) throw E('The smallest alkene is ethene.');
  // E/Z and cis/trans
  if((P.ez&&P.ez.length)||P.cistrans){
    const st=stereoBonds(m,A);
    const isCC=b=>b.o===2&&!b.ar&&m.atoms[b.a].el==='C'&&m.atoms[b.b].el==='C';
    const target=loc=>{ if(loc!=null){ if(P.kind!=='chain') throw E('E/Z locants refer to the parent chain.'); const b=loc>=1&&loc<n?bondBetween(m,order[loc-1],order[loc]):null; if(!b||b.o!==2) throw E(`(${loc}…) says there is a C=C starting at carbon ${loc}, but there isn't one.`); return b; }
      const dbs=m.bonds.filter(isCC); if(!dbs.length) throw E('E/Z (and cis/trans) only apply to a C=C double bond, and there isn\'t one.'); const sdb=dbs.filter(b=>st.some(s=>s.bi===m.bonds.indexOf(b)));
      if(dbs.length>1&&sdb.length!==1) throw E('With more than one C=C, give each E/Z label a locant, e.g. (2E,4Z)-hexa-2,4-diene.'); return sdb[0]||dbs[0]; };
    const set=(b,d,lab)=>{ const s=st.find(x=>x.bi===m.bonds.indexOf(b)); if(!s){ amb.push(`This C=C has no E/Z isomers: one of its carbons has two identical groups (e.g. two H), so leave out “${lab}”.`); return; } b.ez=d; };
    (P.ez||[]).forEach(z=>set(target(z.loc),z.d,`(${z.loc||''}${z.d})`));
    if(P.cistrans){ const b=target(null); const one=[b.a,b.b].every(x=>hcount(m,A,x)===1); set(b,P.cistrans==='cis'?'Z':'E',P.cistrans+'-');
      if(!one&&b.ez) amb.push('cis/trans only works when each carbon of the C=C has one H. Use E/Z here.');
      else if(b.ez) (P.notes||[]).push(`${P.cistrans}- means the same as (${P.cistrans==='cis'?'Z':'E'})- here, because each carbon of the C=C has one H. E/Z is the IUPAC way.`); }
  }
  return {mol:m,order,ring:P.kind!=='chain',amb};
}

/* ---------------- naming a molecule ---------------- */
function cmpKey(a,b){
  for(let i=0;i<Math.max(a.length,b.length);i++){
    const x=a[i], y=b[i];
    if(x===undefined) return -1; if(y===undefined) return 1;
    if(Array.isArray(x)){ const c=cmpKey(x,y); if(c) return c; }
    else if(x!==y) return x<y?-1:1;
  }
  return 0;
}
const firstDiff=(a,b)=>{ let i=0; while(i<b.length&&cmpKey([a[i]],[b[i]])===0) i++; return i; };
const locNum=l=>l==='N'?0:l;
const sortL=a=>a.slice().sort((x,y)=>locNum(x)-locNum(y));
function groupPrefixes(pre){
  const g=new Map();
  pre.forEach(p=>{ if(!g.has(p.name)) g.set(p.name,{name:p.name,key:p.key,cx:p.cx,locs:[],items:[]}); g.get(p.name).items.push(p); });
  return [...g.values()].map(x=>{ x.items.sort((a,b)=>locNum(a.loc)-locNum(b.loc)); x.locs=x.items.map(i=>i.loc); return x; }).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:(a.name<b.name?-1:1));
}
function heteroPrefix(m,A,j,o){
  const el=m.atoms[j].el;
  if(m.atoms[j].ch) return null;
  if(el==='O'){ if(o===2) return 'oxo'; if(A[j].length===1) return 'hydroxy'; return null; }
  if(el==='N'){ if(o===1&&A[j].length===1) return 'amino'; return null; }
  if(HALON[el]) return HALON[el];
  if(el==='NO2') return 'nitro';
  return null;
}
function alkoxyName(s){ const base=s.name.replace(/^\((.*)\)$/,'$1'); let nm; const mm=base.match(/^(meth|eth|prop|but)yl$/);
  if(mm) nm=mm[1]+'oxy'; else if(base==='phenyl') nm='phenoxy'; else if(s.cx) nm=base.replace(/yl$/,'oxy'); else nm=base+'oxy';
  const cx=!!s.cx; return {name:cx?'('+nm+')':nm,key:nm.replace(/[^a-z]/g,''),cx}; }
function esterWord(ws){ const g=new Map(); ws.forEach(w=>{ if(!g.has(w.name)) g.set(w.name,{w,n:0}); g.get(w.name).n++; });
  return [...g.values()].sort((a,b)=>a.w.key<b.w.key?-1:1).map(({w,n})=>n===1?w.name.replace(/^\((.*)\)$/,'$1'):(w.cx?CMULT[n]:MULT[n])+w.name).join(' '); }
function analyse(m,force){
  const A=adj(m), N=m.atoms.length;
  if(!N) throw E('Nothing to name.');
  for(const a of m.atoms) if(!(a.el in VAL)) throw E(UNSUP);
  for(let i=0;i<N;i++) if(hcount(m,A,i)<0) throw E('An atom has too many bonds.');
  { const seen=new Set([0]), q=[0]; while(q.length){ const u=q.pop(); A[u].forEach(x=>{ if(!seen.has(x.j)){ seen.add(x.j); q.push(x.j); } }); } if(seen.size!==N) throw E('That is more than one molecule.'); }
  const isC=i=>m.atoms[i].el==='C';
  if(!m.atoms.some((a,i)=>isC(i))) throw E('There is no carbon, so it is not an organic compound.');
  const rings=findRings(m,A), ringOf=new Array(N).fill(-1);
  rings.forEach((r,k)=>r.forEach(a=>{ if(ringOf[a]>=0) throw E('Fused or bridged rings are beyond A-level naming.'); if(!isC(a)) throw E('Rings containing O or N (heterocycles) are beyond A-level naming.'); ringOf[a]=k; }));
  const arom=rings.map(r=>isArom(m,r));
  rings.forEach((r,k)=>{ if(arom[k]) return; if(r.length<3) throw E(UNSUP); });
  /* functional groups */
  const groups=[], used=new Set();
  for(let c=0;c<N;c++){ if(!isC(c)) continue;
    const H=A[c].filter(x=>!isC(x.j)); if(!H.length) continue;
    const dO=H.filter(x=>m.atoms[x.j].el==='O'&&x.o===2), tN=H.filter(x=>m.atoms[x.j].el==='N'&&x.o===3);
    if(H.some(x=>x.o===2&&m.atoms[x.j].el!=='O')||H.some(x=>x.o===3&&m.atoms[x.j].el!=='N')) throw E(UNSUP);
    if(tN.length){ if(dO.length||H.length>1||A[tN[0].j].length>1) throw E(UNSUP); groups.push({t:'nitrile',c,atoms:[tN[0].j]}); continue; }
    if(!dO.length) continue; if(dO.length>1) throw E(UNSUP);
    const O=dO[0].j; if(A[O].length>1) throw E(UNSUP);
    const others=H.filter(x=>x.j!==O);
    if(others.length>1) throw E(UNSUP);
    if(!others.length){ groups.push({t:hcount(m,A,c)>=1?'al':'one',c,atoms:[O]}); continue; }
    const x=others[0].j, el=m.atoms[x].el;
    if(el==='O'){ const on=A[x].filter(y=>y.j!==c), ax=m.atoms[x];
      if(!on.length){ if(ax.ch===-1){ if(!ax.ion) throw E('A carboxylate ion needs its metal ion (Na⁺ or K⁺) to be named as a salt.'); groups.push({t:'ester',c,atoms:[O,x],salt:ax.ion,O:x}); } else groups.push({t:'acid',c,atoms:[O,x]}); }
      else if(on.length===1&&isC(on[0].j)&&on[0].o===1){ const c2=on[0].j, acyl2=A[c2].some(y=>!isC(y.j)&&y.o===2);
        if(acyl2){ const g=groups.find(g=>g.t==='anhyd'&&g.O===x); if(g){ g.atoms.push(O); g.c2=c; } else groups.push({t:'anhyd',c,atoms:[O,x],O:x}); }
        else groups.push({t:'ester',c,atoms:[O,x],alk:c2,O:x}); }
      else throw E(UNSUP); }
    else if(el==='Cl') groups.push({t:'acyl',c,atoms:[O,x]});
    else if(el==='N'){ const nn=A[x].filter(y=>y.j!==c); if(m.atoms[x].ch||nn.some(y=>!isC(y.j)||y.o!==1||A[y.j].some(z=>!isC(z.j)&&z.o===2))) throw E(UNSUP); groups.push({t:'amide',c,atoms:[O,x],N:x}); }
    else throw E(UNSUP);
  }
  groups.forEach(g=>g.atoms.forEach(a=>used.add(a)));
  for(let h=0;h<N;h++){ if(isC(h)||used.has(h)) continue; const el=m.atoms[h].el, nb=A[h], at=m.atoms[h];
    if(el==='O'){ if(at.ch) throw E('Alkoxide ions (O⁻ on a carbon chain) are beyond this lab.');
      if(nb.length===1) groups.push({t:'ol',c:nb[0].j,atoms:[h]});
      else if(nb.length===2&&nb.every(y=>isC(y.j)&&y.o===1)) groups.push({t:'ether',O:h,c:nb[0].j,c2:nb[1].j,atoms:[h]});
      else throw E(UNSUP); }
    else if(el==='N'){ if(nb.some(y=>!isC(y.j)||y.o!==1)) throw E(UNSUP);
      if(at.ch>0){ if(!at.ion) throw E('An ammonium ion needs its negative ion (Cl⁻, Br⁻…) to be named as a salt.'); groups.push({t:'ammonium',N:h,carbs:nb.map(y=>y.j),atoms:[h],c:nb[0].j}); }
      else groups.push({t:'amine',N:h,carbs:nb.map(y=>y.j),atoms:[h],c:nb[0].j}); }
    else if(HALON[el]) groups.push({t:'halo',c:nb[0].j,atoms:[h],el});
    else if(el==='NO2') groups.push({t:'nitro',c:nb[0].j,atoms:[h]});
  }
  const principal=PRI.find(t=>groups.some(g=>g.t===t))||null;
  const stereo=stereoBonds(m,A,rings);
  const PG=groups.filter(g=>g.t===principal);
  const excl=new Set();
  const amm=groups.filter(g=>g.t==='ammonium');
  if(amm.length&&(amm.length>1||principal)) throw E('This lab names ammonium salts that have only carbon groups (and halogens) on them.');
  if(!amm.length){
    groups.forEach(g=>{ if(g.t===principal) return; if(TERM[g.t]&&g.t!=='al') throw E('This has two different main functional groups, which is beyond A-level naming.'); if(g.t==='amine'&&g.carbs.length>1) throw E(UNSUP); });
    if(principal==='anhyd'&&PG.length>1) throw E('Molecules with two anhydride groups are beyond A-level naming.');
  }
  if(principal==='ester'){ PG.forEach(eg=>{ if(eg.alk==null) return; const q=[eg.alk]; excl.add(eg.alk); while(q.length){ const u=q.pop(); A[u].forEach(x=>{ if(x.j!==eg.O&&!excl.has(x.j)){ excl.add(x.j); q.push(x.j); } }); } }); }
  const acidC=new Set(groups.filter(g=>TERM[g.t]&&g.t!=='al').map(g=>g.c));
  const memo=new Map();
  /* prefix name for a non-carbon atom j bonded to atom `from` (hydroxy, chloro, methoxy…) */
  function hetName(j,from,o){
    if(m.atoms[j].el==='O'&&o===1&&A[j].length===2&&!m.atoms[j].ch){ const other=A[j].find(x=>x.j!==from); if(!isC(other.j)||other.o!==1||acidC.has(other.j)) return null; const s=subName(other.j,j); if(!s) return null; return alkoxyName(s); }
    const nm=heteroPrefix(m,A,j,o); return nm?{name:nm,key:nm,cx:false}:null;
  }
  /* substituent name for the branch that starts at root (bonded to from) */
  function subName(rt,from){
    const mk_=rt+'>'+from; if(memo.has(mk_)) return memo.get(mk_);
    let res=null; memo.set(mk_,null);
    const bf=bondBetween(m,rt,from); if(bf&&bf.o>1){ return null; }
    if(acidC.has(rt)){ return null; }
    if(ringOf[rt]>=0){ const r=rings[ringOf[rt]], L=r.length, i0=r.indexOf(rt); let best=null;
      if(!arom[ringOf[rt]]&&r.some((a,i)=>bondBetween(m,a,r[(i+1)%L]).o>1)) return null;
      for(const d of [1,-1]){ const ord=[]; for(let t=0;t<L;t++) ord.push(r[((i0+d*t)%L+L)%L]); const inS=new Set(ord), pre=[]; let ok=true;
        ord.forEach((a,i)=>A[a].forEach(x=>{ if(inS.has(x.j)||(a===rt&&x.j===from)||!ok) return; if(isC(x.j)){ if(x.o>1){ ok=false; return; } const s=subName(x.j,a); if(!s){ ok=false; return; } pre.push({loc:i+1,name:s.name,key:s.key,cx:s.cx}); } else { const h=hetName(x.j,a,x.o); if(!h){ ok=false; return; } pre.push({loc:i+1,name:h.name,key:h.key,cx:h.cx}); } }));
        if(!ok) continue; const gp=groupPrefixes(pre); const key=[sortL(pre.map(p=>p.loc)),gp.map(g=>g.locs)];
        if(!best||cmpKey(key,best.key)<0) best={key,gp}; }
      if(!best) return null;
      const base=prefixString(best.gp,false)+(arom[ringOf[rt]]?'phenyl':'cyclo'+STEM[L]+'yl');
      res={name:best.gp.length?'('+base+')':base,key:base.replace(/[^a-z]/g,''),cx:best.gp.length>0};
      memo.set(mk_,res); return res; }
    // acyclic branch: every path from rt
    const prev=new Map([[rt,-1]]), q=[rt], ends=[];
    while(q.length){ const u=q.shift(); ends.push(u); A[u].forEach(x=>{ if(x.j===from||!isC(x.j)||ringOf[x.j]>=0||prev.has(x.j)||acidC.has(x.j)) return; prev.set(x.j,u); q.push(x.j); }); }
    let best=null;
    for(const v of ends){ const ord=[]; let w=v; while(w!==-1){ ord.push(w); w=prev.get(w); } ord.reverse();
      const inS=new Set(ord), L=ord.length, mb=[], db=[], pre=[]; let ok=true;
      for(let i=0;i<L-1;i++){ const b=bondBetween(m,ord[i],ord[i+1]); if(b.o>1){ mb.push(i+1); if(b.o===2) db.push(i+1); } }
      ord.forEach((a,i)=>A[a].forEach(x=>{ if(!ok||inS.has(x.j)||(a===rt&&x.j===from)) return; if(isC(x.j)){ if(x.o>1){ ok=false; return; } const s=subName(x.j,a); if(!s){ ok=false; return; } pre.push({loc:i+1,name:s.name,key:s.key,cx:s.cx}); } else { const h=hetName(x.j,a,x.o); if(!h){ ok=false; return; } pre.push({loc:i+1,name:h.name,key:h.key,cx:h.cx}); } }));
      if(!ok) continue; const gp=groupPrefixes(pre);
      const key=[-mb.length,-L,-db.length,-pre.length,mb,db,sortL(pre.map(p=>p.loc)),gp.map(g=>g.locs)];
      if(!best||cmpKey(key,best.key)<0) best={key,gp,L,mb,db,ord}; }
    if(!best) return null;
    let us=''; if(best.mb.length){ const en=best.mb.filter(l=>bondBetween(m,best.ord[l-1],best.ord[l]).o===2), yn=best.mb.filter(l=>!en.includes(l)); const multi=en.length>1||yn.length>1;
      if(multi) us='a'; if(en.length) us+=(best.L===2?'':'-'+en.join(',')+'-')+MULT[en.length>1?en.length:0]+'en'; if(yn.length) us+=(best.L===2?'':'-'+yn.join(',')+'-')+MULT[yn.length>1?yn.length:0]+'yn'; }
    const base=prefixString(best.gp,best.L===1)+STEM[best.L]+us+'yl';
    const cx=best.gp.length>0||/\d/.test(base);
    res={name:cx?'('+base+')':base,key:base.replace(/[^a-z]/g,''),cx};
    memo.set(mk_,res); return res;
  }
  /* ammonium salts: every carbon group on the N⁺ is a prefix */
  if(amm.length){ const g=amm[0];
    const subs=A[g.N].map(x=>{ const s=subName(x.j,g.N); if(!s) throw E(UNSUP); return {loc:'N',name:s.name,key:s.key,cx:s.cx,at:g.N,root:x.j}; });
    const gp=groupPrefixes(subs);
    const best={ord:[],cd:{ring:false},pl:[],key:[],gp,anchors:[{g,an:g.N}],mb:[],db:[],loc:new Map(),exo:false};
    const spec={kind:'ammonium',prefixes:gp,halide:m.atoms[g.N].ion,n:0,unsat:[],suffix:null,ester:null,ez:[]};
    return {best,forced:force?best:null,spec,groups,principal:'ammonium',rings,ringOf,arom,A,all:[best],stereo}; }
  /* anhydrides: name each half as its acid */
  if(principal==='anhyd'){ const g=PG[0];
    const half=c=>{ const seen=new Set([c]), q=[c]; while(q.length){ const u=q.pop(); A[u].forEach(x=>{ if(x.j!==g.O&&!seen.has(x.j)){ seen.add(x.j); q.push(x.j); } }); }
      const r=subMol(m,[...seen].sort((a,b)=>a-b)); const oh=addA(r.mol,'O'); addB(r.mol,r.map.get(c),oh); const nm=nameOf(r.mol);
      return {word:nm.name.replace(/ acid$/,''),nm,inv:r.inv}; };
    const h1=half(g.c), h2=half(g.c2);
    const big=h2.nm.a.best.ord.length>h1.nm.a.best.ord.length?h2:h1;
    const ord=big.nm.a.best.ord.map(i=>big.inv[i]);
    const best={ord,cd:{ring:big.nm.a.best.cd.ring,arom:big.nm.a.best.cd.arom},pl:[],key:[],gp:[],anchors:[{g,an:g.c}],mb:[],db:[],loc:new Map(ord.map((a,i)=>[a,i+1])),exo:false};
    const spec={kind:'anhydride',words:h1.word===h2.word?[h1.word]:[h1.word,h2.word].sort(),n:0,unsat:[],suffix:null,prefixes:[],ester:null,ez:[]};
    return {best,forced:force?best:null,spec,groups,principal,rings,ringOf,arom,A,all:[best],stereo}; }
  /* evaluate one parent (chain or ring, in numbering order) */
  function evalCand(cd){
    const ord=cd.order, Ln=ord.length, inS=new Set(ord), loc=new Map(ord.map((a,i)=>[a,i+1]));
    if(ord.some(a=>excl.has(a)||!isC(a))) return null;
    const pl=[], suf=new Set(), anchors=[]; let exo=false;
    for(const g of PG){
      let an=null, isExo=false;
      if(g.t==='amine') an=g.carbs.find(x=>inS.has(x));
      else if(inS.has(g.c)) an=g.c;
      else if(cd.ring&&TERM[g.t]){ const cn=A[g.c].filter(x=>isC(x.j)); if(cn.length===1&&inS.has(cn[0].j)){ an=cn[0].j; isExo=true; } }
      if(an==null||an===undefined){ if(TERM[g.t]&&g.t!=='al') return null; continue; }
      pl.push(loc.get(an)); anchors.push({g,an}); if(isExo){ exo=true; suf.add(g.c); } g.atoms.forEach(x=>suf.add(x));
    }
    if(anchors.some(a=>TERM[a.g.t]&&!suf.has(a.g.c))&&exo) return null;
    const mb=[], db=[];
    if(!cd.arom){ for(let i=0;i<Ln-(cd.ring?0:1);i++){ if(Ln<2) break; const b=bondBetween(m,ord[i],ord[(i+1)%Ln]); if(b&&b.o>1){ mb.push(i+1); if(b.o===2) db.push(i+1); } } }
    const pre=[];
    for(const a of ord){ for(const x of A[a]){ const j=x.j; if(inS.has(j)||suf.has(j)) continue;
      if(isC(j)){ if(x.o>1) return null; const s=subName(j,a); if(!s) return null; pre.push({loc:loc.get(a),name:s.name,key:s.key,cx:s.cx,at:a,root:j}); }
      else { const h=hetName(j,a,x.o); if(!h) return null; pre.push({loc:loc.get(a),name:h.name,key:h.key,cx:h.cx,at:a,root:j}); } } }
    for(const {g,an} of anchors){ if(g.t!=='amine'&&g.t!=='amide') continue;
      for(const y of A[g.N]){ if(y.j===an||y.j===g.c||!isC(y.j)) continue; const s=subName(y.j,g.N); if(!s) return null; pre.push({loc:'N',name:s.name,key:s.key,cx:s.cx,at:g.N,root:y.j}); } }
    const gp=groupPrefixes(pre);
    const rp=cd.ring?1:(mb.length?0:2);
    const key=[-pl.length,rp,-mb.length,-Ln,-db.length,-pre.length,sortL(pl),mb,db,sortL(pre.map(p=>p.loc)),gp.map(g=>g.locs.map(locNum))];
    return {key,cd,pl:sortL(pl),mb,db,gp,exo,anchors,ord,loc};
  }
  /* every possible parent */
  const cands=[];
  const acyc=i=>isC(i)&&!excl.has(i)&&ringOf[i]<0;
  for(let u=0;u<N;u++){ if(!acyc(u)) continue;
    const prev=new Map([[u,-1]]), q=[u];
    while(q.length){ const v=q.shift(); let ord=[]; let w=v; while(w!==-1){ ord.push(w); w=prev.get(w); } cands.push({order:ord.reverse(),ring:false});
      A[v].forEach(x=>{ if(acyc(x.j)&&!prev.has(x.j)){ prev.set(x.j,v); q.push(x.j); } }); } }
  rings.forEach((r,k)=>{ if(r.some(a=>excl.has(a))) return; const L=r.length; for(let s=0;s<L;s++) for(const d of [1,-1]){ const o=[]; for(let t=0;t<L;t++) o.push(r[((s+d*t)%L+L)%L]); cands.push({order:o,ring:true,arom:arom[k]}); } });
  let best=null; const all=[];
  for(const cd of cands){ const ev=evalCand(cd); if(!ev) continue; all.push(ev); if(!best||cmpKey(ev.key,best.key)<0) best=ev; }
  if(!best) throw E(UNSUP);
  let forced;
  if(force){ const k=rings.findIndex(r=>r.length===force.order.length&&force.order.every(a=>r.includes(a))); forced=evalCand({order:force.order,ring:force.ring,arom:force.ring&&k>=0&&arom[k]}); }
  let esterName=null;
  if(principal==='ester'){ const ws=best.anchors.filter(a=>a.g.t==='ester').map(({g})=>{ if(g.salt){ const w=METALN[g.salt]; return {name:w,key:w,cx:false}; } const s=subName(g.alk,g.O); if(!s) throw E(UNSUP); return s; }); esterName=esterWord(ws); }
  const specOf=ev=>({kind:ev.cd.ring?(ev.cd.arom?'benzene':'ring'):'chain',n:ev.ord.length,
    unsat:ev.mb.map(l=>({loc:l,o:bondBetween(m,ev.ord[l-1],ev.ord[l%ev.ord.length]).o})),
    suffix:ev.pl.length?{t:principal,locs:ev.pl,exo:ev.exo}:null,prefixes:ev.gp,ester:esterName,
    ez:stereo.map(s=>({bi:s.bi,d:s.d,loc:ev.loc.has(s.a)&&ev.loc.has(s.b)?Math.min(ev.loc.get(s.a),ev.loc.get(s.b)):null}))});
  const spec=specOf(best);
  return {best,forced,spec,specOf,groups,principal,rings,ringOf,arom,A,all,stereo};
}

/* omit locants where IUPAC (and A-level) leaves them out */
function omissions(sp){
  const T=sp.prefixes.reduce((s,g)=>s+g.locs.length,0), hasN=sp.prefixes.some(g=>g.locs.includes('N'));
  const S=sp.suffix, n=sp.n, ch=sp.kind==='chain';
  const o={pre:false,suf:false,uns:false};
  if(!hasN){
    if(ch&&n===1) o.pre=true;
    else if(ch&&n===2&&S&&TERM[S.t]&&S.locs.length===1) o.pre=true;
    else if(ch&&n===2&&!S&&T===1) o.pre=true;
    else if(ch&&n===2&&S&&S.t==='one'&&T===1) o.pre=true;
    else if(!ch&&T===1&&!S&&!sp.unsat.length) o.pre=true; }
  if(S&&!TERM[S.t]){
    if(ch&&n<=2&&S.locs.length===1) o.suf=true;
    else if(ch&&S.t==='one'&&(n===3||n===4)&&S.locs.length===1&&!T&&!sp.unsat.length) o.suf=true;
    else if(!ch&&S.locs.length===1&&!sp.unsat.length) o.suf=true; }
  if(sp.unsat.length===1){
    if(ch&&n===2) o.uns=true;
    else if(ch&&n===3&&!T&&(!S||TERM[S.t])) o.uns=true;
    else if(!ch&&!S) o.uns=true; }
  return o;
}
function prefixString(groups,omit){
  return groups.map(g=>{ const k=g.locs.length; const mult=k>1?(g.cx?CMULT[k]:MULT[k]):''; const body=mult+g.name;
    return omit?body:g.locs.join(',')+'-'+body; }).join(omit?'':'-');
}
/* the name as labelled pieces: ester word, E/Z, locants, prefixes, stem, bonds, suffix (for hover and click) */
function nameParts(sp,full){
  const out=[]; const push=(t,k,r)=>{ if(t) out.push({t,k,r}); };
  if(sp.kind==='ammonium'){ sp.prefixes.forEach((g,i)=>{ const k=g.locs.length; push((k>1?(g.cx?CMULT[k]:MULT[k]):'')+g.name,'pre',i); }); push('ammonium','stem'); push(' ','p'); push(HALIDEN[sp.halide],'ion'); return out; }
  if(sp.kind==='anhydride'){ sp.words.forEach((w,i)=>{ push(w,'stem',i); push(' ','p'); }); push('anhydride','suf'); return out; }
  if(sp.ester!=null){ push(sp.ester,'ester'); push(' ','p'); }
  const ez=(sp.ez||[]).filter(z=>z.d);
  if(ez.length){ const lab=ez.length===1?ez[0].d:ez.filter(z=>z.loc!=null).sort((a,b)=>a.loc-b.loc).map(z=>z.loc+z.d).join(','); if(lab) push('('+lab+')-','ez'); }
  const om=full?{}:omissions(sp);
  sp.prefixes.forEach((g,i)=>{ const k=g.locs.length; const mult=k>1?(g.cx?CMULT[k]:MULT[k]):'';
    if(!om.pre){ if(i) push('-','p'); push(g.locs.join(','),'loc',i); push('-','p'); }
    push(mult+g.name,'pre',i); });
  const S=sp.suffix;
  if(sp.kind==='benzene'){
    if(!S) push('benzene','stem');
    else if(S.locs.length===1){ const w=BENZ[S.t]; const mm=w.match(/^(benz|phen)(.*)$/); if(mm&&S.t){ push(mm[1],'stem'); push(mm[2],'suf'); } else push(w,'stem'); }
    else { push('benzene','stem'); push('-','p'); push(S.locs.join(','),'sloc'); push('-','p'); push(MULT[S.locs.length]+(S.exo?SUFX[S.t]:SUFW[S.t]),'suf'); }
    return out; }
  push((sp.kind==='ring'?'cyclo':'')+STEM[sp.n],'stem');
  const en=sp.unsat.filter(u=>u.o===2).map(u=>u.loc), yn=sp.unsat.filter(u=>u.o===3).map(u=>u.loc);
  let us;
  if(!en.length&&!yn.length) us='an';
  else { us=(en.length>1||yn.length>1)?'a':'';
    if(en.length) us+=(om.uns?'':'-'+en.join(',')+'-')+(en.length>1?MULT[en.length]:'')+'en';
    if(yn.length) us+=(om.uns?'':'-'+yn.join(',')+'-')+(yn.length>1?MULT[yn.length]:'')+'yn'; }
  if(!S){ push(us+'e','uns'); return out; }
  const word=S.exo?SUFX[S.t]:SUFW[S.t], k=S.locs.length, mult=k>1?MULT[k]:'';
  const needE=!!mult||/^[^aeiou]/.test(word);
  const showLoc=!om.suf&&!(TERM[S.t]&&!S.exo)&&!(S.exo&&k===1);
  push(us+(needE?'e':''),'uns');
  if(showLoc){ push('-','p'); push(S.locs.join(','),'sloc'); push('-','p'); }
  push(mult+word,'suf');
  return out;
}
const fixN=s=>s.replace(/(^|[-(,\s])n(?=[,-])/g,'$1N').replace(/(^|[-(,\s])n(?=[,-])/g,'$1N');
function stringify(sp,full){ return fixN(nameParts(sp,full).map(p=>p.t).join('')); }
function nameOf(m){ const a=analyse(m); return {name:stringify(a.spec,false),full:stringify(a.spec,true),parts:nameParts(a.spec,false),a}; }

/* ---------------- facts ---------------- */
const AR={C:12.0,H:1.0,N:14.0,O:16.0,F:19.0,Cl:35.5,Br:79.9,I:126.9,Na:23.0,K:39.1,Li:6.9};
function formula(m){
  const A=adj(m), c={};
  m.atoms.forEach((a,i)=>{ const h=hcount(m,A,i); if(a.el==='NO2'){ c.N=(c.N||0)+1; c.O=(c.O||0)+2; } else c[a.el]=(c[a.el]||0)+1; if(h>0) c.H=(c.H||0)+h; if(a.ion) c[a.ion]=(c[a.ion]||0)+1; });
  const order=['C','H',...Object.keys(c).filter(k=>k!=='C'&&k!=='H').sort()];
  const sub=n=>String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
  const f=order.filter(k=>c[k]).map(k=>k+(c[k]>1?sub(c[k]):'')).join('');
  const mr=Object.entries(c).reduce((s,[k,v])=>s+AR[k]*v,0);
  return {f,mr,counts:c};
}
const SERIES={acid:'Carboxylic acid',anhyd:'Acid anhydride',ester:'Ester',acyl:'Acyl chloride',amide:'Amide',nitrile:'Nitrile',al:'Aldehyde',one:'Ketone',ol:'Alcohol',amine:'Amine',ether:'Ether'};
function classify(m,an){
  const A=an.A, out=[]; const isC=i=>m.atoms[i].el==='C';
  const deg=c=>A[c].filter(x=>isC(x.j)).length;
  const cls=k=>k<=1?'primary':k===2?'secondary':'tertiary';
  const seen={};
  an.groups.forEach(g=>{ let s;
    if(g.t==='ol'){ s=an.ringOf[g.c]>=0&&an.arom[an.ringOf[g.c]]?'Phenol':cls(deg(g.c))+' alcohol'; if(an.groups.some(h=>h.t==='nitrile'&&(h.c===g.c||A[g.c].some(x=>x.j===h.c)))) seen.Hydroxynitrile=1; }
    else if(g.t==='halo') s=an.ringOf[g.c]>=0&&an.arom[an.ringOf[g.c]]?'Halogenoarene':cls(deg(g.c))+' halogenoalkane';
    else if(g.t==='amine') s=(g.carbs.some(c=>an.ringOf[c]>=0&&an.arom[an.ringOf[c]])?'aromatic ':'')+cls(g.carbs.length)+' amine';
    else if(g.t==='ammonium') s=g.carbs.length===4?'Quaternary ammonium salt':'Ammonium salt';
    else if(g.t==='amide'){ const k=A[g.N].filter(x=>isC(x.j)).length; s=k===1?'Amide':(k===2?'N-substituted amide':'N,N-disubstituted amide'); }
    else if(g.t==='ester'&&g.salt) s='Carboxylate salt';
    else if(g.t==='nitro') s='Nitro compound';
    else s=SERIES[g.t];
    s=s[0].toUpperCase()+s.slice(1); seen[s]=1; });
  const hasCC=m.bonds.some(b=>b.o===2&&!b.ar&&isC(b.a)&&isC(b.b)), hasCt=m.bonds.some(b=>b.o===3&&isC(b.a)&&isC(b.b));
  if(hasCC) seen['Alkene (C=C)']=1; if(hasCt) seen['Alkyne (C≡C)']=1;
  if(an.stereo&&an.stereo.length) seen['Has E/Z isomers']=1;
  if(an.arom.some(x=>x)) seen['Arene (benzene ring)']=1;
  Object.keys(seen).forEach(k=>out.push(k));
  if(!out.length) out.push(an.rings.length?'Cycloalkane':'Alkane');
  return out;
}

/* ---------------- checking a typed name ---------------- */
const REASON=[
  (an)=>`The parent ${an.spec.kind==='chain'?'chain':'ring'} has to include ${an.best.pl.length>1?'every':'the'} ${GROUPWORD[an.principal]}, so it can go in the suffix.`,
  (an)=>an.spec.kind==='chain'?(an.best.mb.length?'A chain with a C=C is the parent, and the ring becomes a prefix (A-level convention, e.g. phenylethene).':'Here the chain is the parent, not the ring.'):`The ring is the parent here, so name it as a substituted ${an.spec.kind==='benzene'?'benzene':'cycloalkane'}.`,
  ()=>`The parent chain must include the C=C (or C≡C) bond.`,
  (an,f)=>`That isn't the longest carbon chain: the longest here has ${an.spec.n} carbons (${STEM[an.spec.n]}-), not ${f.ord.length}. The chain can bend: follow it round corners.`,
  ()=>`The parent chain must include the double bond.`,
  ()=>`Two chains are equally long, so choose the one with more branches (substituents).`,
  (an)=>`Numbered the wrong way: the ${GROUPWORD[an.principal]} must get the lowest possible number.`,
  ()=>`Numbered the wrong way: the double bond must get the lowest possible number.`,
  ()=>`Numbered the wrong way: the double bond must get the lowest possible number.`,
  ()=>`Numbered the wrong way: the prefix groups must get the lowest set of numbers. Compare the sets number by number; the first difference decides.`,
  ()=>`It's a tie on numbers, so the prefix that comes first in the alphabet gets the lower number.`];
function check(input){
  const P=parseNameLenient(input);
  const B=build(P);
  let an; try{ an=analyse(B.mol,B.order.length?{order:B.order,ring:B.ring}:null); }catch(e){ if(!e.iu) throw e; return {ok:false,mol:B.mol,order:B.order,notes:P.notes,amb:B.amb,unnamed:e.message,valid:false,parsed:P}; }
  const name=stringify(an.spec,false), full=stringify(an.spec,true);
  const issues=B.amb.slice(); if(P.spaced) issues.push('Prefixes, the stem and the suffix join up with no spaces. A space only goes before a separate word, such as “acid” in ethanoic acid or “ethanoate” in ethyl ethanoate.'); let reason=null;
  const flat=s=>norm(s).replace(/\s/g,'');
  if(an.spec.kind==='ammonium'||an.spec.kind==='anhydride'){ if(!issues.length&&![name,full].some(x=>flat(x)===flat(input))) reason=an.spec.kind==='ammonium'?`Name the groups on the N in alphabetical order, combining repeats with di-, tri-, tetra-: ${name}.`:`Name the acid(s) in alphabetical order, then “anhydride”: ${name}.`; }
  else if(!an.forced) reason='That numbering doesn’t work for this molecule.';
  else { const c=cmpKey(an.forced.key,an.best.key); if(c!==0){ const i=firstDiff(an.forced.key,an.best.key); reason=(REASON[i]||REASON[9])(an,an.forced); } }
  // alphabetical order and repeated prefixes
  const keys=(P.prefixes||[]).map(p=>p.key);
  for(let i=1;i<keys.length;i++){ if(keys[i]<keys[i-1]&&P.kind!=='ammonium'){ issues.push(`Put the prefixes in alphabetical order (ignore di-, tri-…): ${keys.slice().sort().filter((v,k,a)=>a.indexOf(v)===k).join(', ')}.`); break; } }
  const dup=keys.find((k,i)=>keys.indexOf(k)!==i); if(dup) issues.push(`Combine the ${dup} groups into one prefix with di-/tri-, e.g. 2,3-di${dup}.`);
  const notes=P.notes.slice();
  const miss=(an.spec.ez||[]).filter(z=>!z.d);
  if(miss.length) notes.push(`${miss.length>1?'These C=C bonds have':'This C=C has'} E/Z isomers, so the full name starts with ${miss.length>1?'(2E,4Z)-style labels':'(E)- or (Z)-'}.`);
  const valid=!reason&&!issues.length;
  return {ok:true,mol:B.mol,order:B.order,ring:B.ring,name,full,an,valid,reason,issues,notes,parsed:P,ezMissing:miss.length>0,
    exact:valid&&flat(input)===flat(name)};
}

/* ---------------- "why not…?": plausible wrong names, each with the rule it breaks ---------------- */
function whyNot(m){
  const a=analyse(m), sp=a.spec;
  const right=stringify(sp,false), rightF=stringify(sp,true);
  const out=[], seen=new Set([right,rightF]);
  const add=(name,why,kind)=>{ if(!name||seen.has(name)) return; seen.add(name); out.push({name,why,kind}); };
  const str=s=>{ try{ return stringify(s,false); }catch(e){ return null; } };
  if(sp.kind==='ammonium'){
    if(sp.prefixes.length>1) add(str(Object.assign({},sp,{prefixes:sp.prefixes.slice().reverse()})),'The groups on the N go in alphabetical order, ignoring di-, tri-, tetra-.','order');
    const g=sp.prefixes.find(g=>g.locs.length>1&&g.locs.length<4); if(g) add(sp.prefixes.map(h=>h===g?h.locs.map(()=>h.name).join(''):h.name).join('')+'ammonium '+HALIDEN[sp.halide],`Combine repeated groups with a multiplier: ${MULT[g.locs.length]}${g.name}.`,'mult');
    add(right.replace(/ammonium (\w+)$/,(w,x)=>'amine hydro'+x),'That is an older name. The salt is named as an ion pair: the positive ion (…ammonium) then the negative ion (chloride).','format');
    add(HALIDEN[sp.halide]+' '+right.replace(/ \w+$/,''),'Name the positive ion first, then the negative ion.','order');
    return out.slice(0,6); }
  if(sp.kind==='anhydride'){
    if(sp.words.length===2) add(sp.words.slice().reverse().join(' ')+' anhydride','Name the two acids in alphabetical order.','order');
    else add(sp.words[0]+' '+sp.words[0]+' anhydride','When both halves come from the same acid, name it once.','format');
    add(sp.words.join(' ')+' acid anhydride','Leave out “acid”: the name is the acid name with “anhydride” in place of “acid”.','format');
    add(sp.words.map(w=>w.replace(/oic$/,'oyl')).join(' ')+' anhydride','The halves are named like the acids (-oic), not like acyl groups (-oyl).','format');
    return out.slice(0,6); }
  // other parents and numberings
  const bestSet=new Set(a.best.ord);
  const alts=a.all.filter(ev=>ev!==a.best).sort((x,y)=>cmpKey(x.key,y.key));
  let nC=0, nN=0; const usedSets=new Set();
  for(const ev of alts){ if(nC>=2&&nN>=1) break;
    const same=ev.ord.length===a.best.ord.length&&ev.ord.every(x=>bestSet.has(x));
    if(same?nN>=1:nC>=2) continue; const sk=ev.ord.slice().sort((x,y)=>x-y).join(','); if(!same&&usedSets.has(sk)) continue;
    const nm=str(a.specOf(ev)); if(!nm||seen.has(nm)) continue;
    const i=firstDiff(ev.key,a.best.key); if(i>=ev.key.length) continue;
    add(nm,(REASON[i]||REASON[9])(a,ev),same?'number':'chain'); usedSets.add(sk); same?nN++:nC++; }
  // alphabetical order
  if(sp.prefixes.length>=2&&new Set(sp.prefixes.map(g=>g.key)).size>1) add(str(Object.assign({},sp,{prefixes:sp.prefixes.slice().reverse()})),`Prefixes go in alphabetical order, ignoring di-, tri-…: ${sp.prefixes.map(g=>g.key.replace(/^\d+/,'')).join(' before ')}.`,'order');
  // multiplier
  const gm=sp.prefixes.find(g=>g.locs.length>1);
  if(gm){ const sp2=Object.assign({},sp,{prefixes:[].concat(...sp.prefixes.map(h=>h===gm?h.locs.map(l=>Object.assign({},h,{locs:[l]})):[h]))}); add(stringify(sp2,true),`Combine repeated groups into one prefix with a multiplier: ${gm.locs.join(',')}-${MULT[gm.locs.length]}${gm.name}.`,'mult');
    add(right.replace(MULT[gm.locs.length]+gm.name,gm.name),`“${gm.locs.join(',')}” is ${gm.locs.length} numbers, so there are ${gm.locs.length} groups: it needs “${MULT[gm.locs.length]}”.`,'mult'); }
  // missing locant on the suffix
  if(sp.suffix&&!TERM[sp.suffix.t]){ const w=SUFW[sp.suffix.t]; const mm=right.match(new RegExp('-([\\d,]+)-((?:di|tri)?'+w+')$'));
    if(mm){ add(right.replace(mm[0],mm[2]),`Without a number you can't tell which carbon the ${GROUPWORD[sp.suffix.t]} is on. Write ${mm[1]} in front of “${mm[2]}”.`,'format');
      if(/an$/.test(right.slice(0,right.length-mm[0].length))&&/^[aeiou]/.test(mm[2])) add(right.replace(/an(-[\d,]+-)/,'ane$1'),'Drop the “e” of -ane when the next part starts with a vowel (-ol, -one, -amine): '+right+'.','format'); } }
  // keep the e before a consonant
  if(/anenitrile$|anedi|anetri/.test(right)) add(right.replace(/ane(nitrile|di|tri)/,'an$1'),'Keep the “e” of -ane when the next part starts with a consonant (nitrile, diol…).','format');
  // punctuation
  if(/\d-[a-z]/.test(right)) add(right.replace(/(\d)-([a-z])/,'$1$2'),'Put a hyphen between a number and a letter.','format');
  if(/\d,\d/.test(right)) add(right.replace(/(\d),(\d)/,'$1-$2'),'Use commas between numbers (and hyphens between numbers and letters).','format');
  if(sp.prefixes.length&&sp.ester==null){ const parts=nameParts(sp,false); const k=parts.findIndex(p=>p.k==='stem'); if(k>0) add(fixN(parts.slice(0,k).map(p=>p.t).join('')+' '+parts.slice(k).map(p=>p.t).join('')),`A prefix joins straight onto the parent name, with no space: ${right}. Spaces only ever separate whole words, such as “acid” in ethanoic acid.`,'format'); }
  // E/Z flipped
  const ezs=(sp.ez||[]).filter(z=>z.d);
  if(ezs.length){ const sp2=Object.assign({},sp,{ez:sp.ez.map(z=>z.d?Object.assign({},z,{d:z.d==='E'?'Z':'E'}):z)}); const d=ezs[0].d;
    add(str(sp2),`That's the other isomer. On each carbon of the C=C the higher-priority group is the one whose first atom has the higher atomic number. Here those two groups are on ${d==='E'?'opposite sides, so it is E (entgegen)':'the same side, so it is Z (zusammen)'}.`,'ez'); }
  // ester the other way round
  if(sp.ester!=null&&/^(meth|eth|prop|but|pent)yl$/.test(sp.ester)&&sp.kind==='chain'&&!sp.prefixes.length&&!sp.unsat.length&&sp.suffix.locs.length===1){
    add(STEM[sp.n]+'yl '+sp.ester.replace(/yl$/,'')+'anoate','That is an isomer. The first word is the alkyl group on the single-bonded O (from the alcohol); the second word is the acid part, and it includes the C=O carbon.','isomer'); }
  if(sp.ester!=null&&/^(sodium|potassium|lithium)$/.test(sp.ester)) { add(right.replace(/^(\w+) (.*)oate$/,'$2oate $1'),'Name the positive ion (the metal) first, then the negative ion.','order'); add(right.replace(/oate$/,'oic acid'),'In the salt the acid has lost H⁺ from its OH, so “-oic acid” becomes “-oate”.','format'); }
  return out.slice(0,7);
}

/* ---------------- random molecules for the quiz ---------------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const SUBS={me:()=>({k:'alkyl',n:1,attach:1,prefixes:[]}),et:()=>({k:'alkyl',n:2,attach:1,prefixes:[]}),pr:()=>({k:'alkyl',n:3,attach:1,prefixes:[]}),ipr:()=>({k:'alkyl',n:3,attach:2,prefixes:[]}),
  cl:()=>({k:'halo',el:'Cl'}),br:()=>({k:'halo',el:'Br'}),f:()=>({k:'halo',el:'F'}),i:()=>({k:'halo',el:'I'}),oh:()=>({k:'oh'}),nh2:()=>({k:'nh2'}),no2:()=>({k:'no2'}),ph:()=>({k:'alkyl',ben:1,n:6,attach:1,prefixes:[]}),
  ome:()=>({k:'alkoxy',g:{k:'alkyl',n:1,attach:1,prefixes:[]}}),oet:()=>({k:'alkoxy',g:{k:'alkyl',n:2,attach:1,prefixes:[]}})};
function addSubs(P,list,lo,hi){ list.forEach(s=>P.prefixes.push({locs:[R(lo,hi)],cnt:1,sub:SUBS[s]()})); }
const chainP=(n,suffix)=>({kind:'chain',n,unsat:[],suffix:suffix||null,prefixes:[]});
const FAMILIES={
  alkane:{label:'Alkanes',make:L=>{ const n=R(3,[6,8,9][L]); const P=chainP(n); const k=[R(1,1),R(1,2),R(2,3)][L]; for(let i=0;i<k;i++) addSubs(P,[L===2&&n>=5&&Math.random()<.3?pick(['et','ipr']):(Math.random()<.8?'me':'et')],2,n-1); return P; }},
  alkene:{label:'Alkenes',make:L=>{ const n=R(L?3:2,[5,7,8][L]); const P=chainP(n); P.unsat=[{loc:R(1,n-1),o:2}]; if(L===2&&n>=4&&Math.random()<.4){ const l2=P.unsat[0].loc+2; if(l2<n) P.unsat.push({loc:l2,o:2}); } const k=[0,R(0,1),R(1,2)][L]; for(let i=0;i<k;i++) addSubs(P,[Math.random()<.75?'me':'et'],1,n); if(L>=1&&Math.random()<.15) P.unsat[0].o=3; return P; }},
  ez:{label:'E/Z isomers',make:L=>{ const n=R(4,[5,6,7][L]); const P=chainP(n); const l=R(2,n-2); P.unsat=[{loc:l,o:2}]; if(L>=1&&Math.random()<.5) addSubs(P,[pick(['me','cl','br','me'])],l,l+1); if(L===2&&Math.random()<.4) P.suffix=pick([{t:'ol',locs:[1]},{t:'acid',locs:[1]}]); P.ez=[{loc:null,d:pick(['E','Z'])}]; return P; }},
  halo:{label:'Halogenoalkanes',make:L=>{ const n=R(1,[4,6,6][L]); const P=chainP(n); const k=[1,R(1,2),R(2,3)][L]; for(let i=0;i<k;i++) addSubs(P,[pick(L?['cl','br','f','i','cl','br']:['cl','br'])],1,n); if(L>=1&&n>=3&&Math.random()<.5) addSubs(P,['me'],2,n-1); return P; }},
  alcohol:{label:'Alcohols',make:L=>{ const n=R(1,[5,6,7][L]); const P=chainP(n,{t:'ol',locs:[R(1,n)]}); if(L===2&&n>=2&&Math.random()<.35){ let b=R(1,n); if(b!==P.suffix.locs[0]) P.suffix.locs=[P.suffix.locs[0],b].sort((x,y)=>x-y); } if(L>=1&&n>=3) addSubs(P,[pick(['me','me','et','cl'])],1,n); if(L===2&&n>=3&&Math.random()<.5) addSubs(P,[pick(['me','cl','br'])],1,n); return P; }},
  ether:{label:'Ethers',make:L=>{ const n=R(1,[3,5,6][L]); const P=chainP(n); if(L>=1&&n>=2&&Math.random()<.4) P.suffix={t:'ol',locs:[1]}; P.prefixes.push({locs:[R(1,n)],cnt:1,sub:{k:'alkoxy',g:{k:'alkyl',n:R(1,Math.max(1,Math.min(n,[1,2,3][L]))),attach:1,prefixes:[]}}}); if(L===2&&n>=3&&Math.random()<.5) addSubs(P,[pick(['me','cl'])],1,n); return P; }},
  carbonyl:{label:'Aldehydes & ketones',make:L=>{ const ket=Math.random()<.5; const n=ket?R(3,[5,6,7][L]):R(1,[5,6,7][L]); const P=chainP(n,ket?{t:'one',locs:[R(2,n-1)]}:{t:'al',locs:[1]}); if(L>=1&&n>=3) addSubs(P,[pick(['me','me','et','cl'])],2,n); if(L===2&&n>=3) addSubs(P,[pick(['me','oh','br'])],2,n); return P; }},
  acid:{label:'Carboxylic acids & esters',make:L=>{ const r=Math.random(), est=r<.5, di=L===2&&r<.7&&r>=.5; const n=R(di?2:1,[4,6,6][L]); const P=chainP(n,{t:est?'ester':'acid',locs:di?[1,n]:[1]});
    if(est){ const al=L===2?['me','et','pr','ipr','ph']:['me','et','pr']; P.esterWords=[SUBS[pick(al)]()]; if(L===2&&Math.random()<.3&&n>=2){ P.suffix.locs=[1,n]; const w=pick(['me','et']); P.esterWords=[SUBS[w](),SUBS[Math.random()<.6?w:(w==='me'?'et':'me')]()]; } }
    if(L>=1&&n>=2&&!di&&!(est&&P.esterWords.length>1)) addSubs(P,[pick(['me','me','cl','et'])],2,n); if(L===2&&n>=2&&!di&&!(P.suffix.locs.length>1)) addSubs(P,[pick(['oh','nh2','cl','me'])],2,n); return P; }},
  salt:{label:'Salts',make:L=>{ if(Math.random()<.55){ const n=R(1,[3,5,6][L]); const P=chainP(n,{t:'ester',locs:[1]}); P.esterWords=[{k:'metal',el:pick(['Na','K'])}]; if(L>=1&&n>=3&&Math.random()<.5) addSubs(P,[pick(['me','cl','oh'])],2,n); return P; }
    const k=L===0?1:R(1,4); const groups=[]; for(let i=0;i<k;i++) groups.push(pick(L===0?['me','et','pr']:['me','me','et','pr','ph'])); if(groups.filter(g=>g==='ph').length>1) groups.length=1;
    const cnt={}; groups.forEach(g=>{ cnt[g]=(cnt[g]||0)+1; }); return {kind:'ammonium',halide:pick(['Cl','Cl','Br']),prefixes:Object.entries(cnt).map(([g,c])=>({locs:null,cnt:c,sub:SUBS[g](),raw:g})),n:0,unsat:[]}; }},
  deriv:{label:'Acyl chlorides, anhydrides, amides, nitriles',make:L=>{ const t=pick(L===2?['acyl','amide','nitrile','anhyd','hcn']:['acyl','amide','nitrile']);
    if(t==='anhyd'){ const a=R(1,4), b=Math.random()<.6?a:R(1,4); return {kind:'anhydride',acids:[chainP(a,{t:'acid',locs:[1]}),chainP(b,{t:'acid',locs:[1]})].map(x=>(x.amb=[],x)),n:0,unsat:[]}; }
    if(t==='hcn'){ const n=R(3,5); const P=chainP(n,{t:'nitrile',locs:[1]}); P.prefixes.push({locs:[2],cnt:1,sub:{k:'oh'}}); if(Math.random()<.5) addSubs(P,['me'],2,2); return P; }
    const n=R(t==='amide'?1:2,[4,5,6][L]); const P=chainP(n,{t,locs:[1]}); if(L>=1&&n>=3) addSubs(P,[pick(['me','cl','me'])],2,n); if(L===2&&t==='amide'&&Math.random()<.6) P.prefixes.push({locs:['N'],cnt:1,sub:SUBS[pick(['me','et'])]()}); return P; }},
  amine:{label:'Amines',make:L=>{ const n=R(1,[4,6,6][L]); const P=chainP(n,{t:'amine',locs:[R(1,n)]}); if(L>=1&&n>=3&&Math.random()<.6) addSubs(P,['me'],1,n); if(L===2&&Math.random()<.6) P.prefixes.push({locs:['N'],cnt:1,sub:SUBS.me()}); if(L===2&&n>=4&&!P.prefixes.some(p=>p.locs[0]==='N')&&Math.random()<.25) P.suffix.locs=[1,n]; return P; }},
  ring:{label:'Rings, benzene & nitro',make:L=>{ const r=Math.random();
    if(r<.4){ const P={kind:'benzene',n:6,unsat:[],suffix:null,prefixes:[]}; const s=Math.random(); if(L>=1&&s<.5) P.suffix={t:pick(['ol','acid','amine','al']),locs:[1],exo:false}; if(P.suffix) P.suffix.exo=!!TERM[P.suffix.t]; const k=[1,R(1,2),R(2,3)][L]-(P.suffix?1:0); for(let i=0;i<Math.max(k,P.suffix?0:1);i++) addSubs(P,[pick(['me','cl','br','no2','et','me','no2','ome'])],P.suffix?2:1,6); return P; }
    if(r<.75){ const n=R(4,6); const P={kind:'ring',n,unsat:[],suffix:null,prefixes:[]}; if(L>=1&&Math.random()<.5) P.suffix={t:pick(['ol','one']),locs:[1]}; if(!P.suffix&&L>=1&&Math.random()<.3) P.unsat.push({loc:1,o:2}); const k=[1,R(1,2),R(1,3)][L]-(P.suffix?1:0); for(let i=0;i<Math.max(k,P.suffix?0:1);i++) addSubs(P,[pick(['me','me','cl','et','br'])],P.suffix?2:1,n); return P; }
    const n=R(1,[3,4,5][L]); const P=chainP(n,L&&Math.random()<.6?{t:pick(['ol','one','acid']),locs:[1]}:null); if(P.suffix&&P.suffix.t==='one'){ if(n<3) P.suffix=null; else P.suffix.locs=[2]; } if(!P.suffix&&n>=2&&L&&Math.random()<.4) P.unsat=[{loc:1,o:2}]; addSubs(P,['ph'],1,n); if(L>=1&&!P.suffix&&!P.unsat.length&&Math.random()<.4) addSubs(P,['no2'],1,n); return P; }}
};
/* skip structures a chemist would never meet, e.g. an OH and a Cl on the same carbon */
function odd(m){ const A=adj(m); return m.atoms.some((a,i)=>{ if(a.el!=='C') return false; const h=A[i].filter(x=>m.atoms[x.j].el!=='C'&&x.o===1&&A[x.j].length===1).map(x=>m.atoms[x.j].el); const dO=A[i].some(x=>m.atoms[x.j].el==='O'&&x.o===2); const eth=A[i].filter(x=>m.atoms[x.j].el==='O'&&A[x.j].length===2).length; return (h.includes('O')&&h.length>1)||(h.includes('N')&&h.length>1)||(dO&&h.some(e=>e!=='O'&&e!=='N'&&e!=='Cl'))||(eth&&(h.length||dO)&&!(dO&&eth===1&&!h.length))||eth>1||((h.includes('O')||h.includes('N'))&&A[i].some(x=>x.o===2&&m.atoms[x.j].el==='C'&&!x.ar)); }); }
function extra(P){ if(P.esterWords&&P.esterWords.length>1) return; if(P.kind!=='chain'&&P.kind!=='ring'&&P.kind!=='benzene') return; const n=P.n; if(n<2) return; addSubs(P,[pick(['me','cl','br','et','oh','f'])],1,n); }
function random(opts){
  opts=opts||{}; const fam=(opts.families&&opts.families.length?opts.families:Object.keys(FAMILIES)); const L=opts.level==null?1:opts.level; const Lc=Math.min(2,L); const avoid=opts.avoid||[];
  for(let t=0;t<500;t++){
    const f=pick(fam); let P; try{ P=FAMILIES[f].make(Lc); P.amb=[]; if(L===3&&Math.random()<.7) extra(P); if(P.ez&&P.ez.length){ P.notes=[]; } const B=build(P); if(B.amb.length) continue; if(odd(B.mol)) continue; const nm=nameOf(B.mol); if(nm.name.length>[22,32,44,58][L]) continue; if(L===3&&nm.name.length<14&&Math.random()<.8) continue; if(avoid.includes(nm.name)) continue; if(nm.a.spec.n>6&&!opts.long) continue; if((nm.a.spec.ez||[]).some(z=>!z.d)) continue; return {mol:B.mol,name:nm.name,full:nm.full,an:nm.a,family:f}; }catch(e){ if(!e.iu) throw e; }
  }
  const B=build({kind:'chain',n:4,unsat:[],suffix:null,prefixes:[],amb:[]}); const nm=nameOf(B.mol); return {mol:B.mol,name:nm.name,full:nm.full,an:nm.a,family:'alkane'};
}
const fromName=s=>{ const P=parseName(s); return build(P).mol; };

/* ---------------- reading a structural formula: CH3CH(OH)CH3, (CH3)2CHCOOH, CH3COOCH2CH3, C6H5CH3 … ---------------- */
const subDig=s=>String(s).replace(/[₀-₉]/g,c=>String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
function looksLikeFormula(s){ s=subDig(String(s||'').trim()); if(!s||!/[CH]/.test(s)) return false;
  if(!/^[A-Za-z0-9()=≡#+\-–⁺⁻\s{}·]+$/.test(s)) return false;
  return !/[a-z]{2,}/.test(s.replace(/Cl|Br|Na|Li/g,'')); }
const FSPEC=['C6H5','COOH','COO','CONH2','CONH','COCl','CHO','OHC','CN','CO','NO2','NH3','NH2','NH','H2N','HO','OH'];
function tokFormula(s){
  const T=[]; let i=0;
  while(i<s.length){ const c=s[i], t=s.slice(i); let mm;
    if(/[\s\-–·]/.test(c)){ i++; continue; }
    if(c==='='){ T.push({t:'bond',o:2}); i++; continue; }
    if(c==='≡'||c==='#'){ T.push({t:'bond',o:3}); i++; continue; }
    if(c==='{'){ const q=s.indexOf('}',i); T.push({t:'ion',v:s.slice(i+1,q)}); i=q+1; continue; }
    if(c==='('){ let d=0,q=i; for(;q<s.length;q++){ if(s[q]==='(') d++; else if(s[q]===')'){ d--; if(!d) break; } } if(q>=s.length) throw E('A bracket in the formula is not closed.');
      const inner=s.slice(i+1,q); i=q+1; mm=s.slice(i).match(/^\d+/); let n=1; if(mm){ n=+mm[0]; i+=mm[0].length; } if(!inner) throw E('Empty brackets in the formula.'); T.push({t:'paren',inner,n}); continue; }
    if(c===')') throw E('There is a “)” without a matching “(”.');
    const atStart=!T.length||T[T.length-1].t==='bond';
    const sp=FSPEC.find(x=>t.startsWith(x)&&(atStart||!['HO','H2N','OHC'].includes(x)));
    if(sp&&!(sp==='CO'&&/^CO\d/.test(t))&&!(sp==='CN'&&/^CNH/.test(t))&&!(sp==='HO'&&/^HOOC/.test(t))&&!(sp==='CHO'&&/^CHOH/.test(t))){ T.push({t:'sp',v:sp}); i+=sp.length; continue; }
    if(atStart&&(mm=t.match(/^HOOC/))){ T.push({t:'sp',v:'HOOC'}); i+=4; continue; }
    if((mm=t.match(/^(Cl|Br|C|N|O|F|I|H)(\d*)/))){ T.push({t:'el',v:mm[1],n:mm[2]?+mm[2]:1}); i+=mm[0].length; continue; }
    throw E(`I can't read “${t.slice(0,6)}” in that formula. Use groups like CH3, CH2, OH, COOH, CHO, NH2, Cl, C6H5 and brackets for branches.`);
  }
  return T;
}
function fromFormula(input){
  let s=subDig(String(input).trim());
  s=s.replace(/COO[-⁻]?\s*(Na|K|Li)[+⁺]?/g,'COO{$1}').replace(/(N(?:H\d?)?)[+⁺]?\s*(Cl|Br|I)[-⁻]?(?![a-z])/g,(w,n,x)=>/\+|⁺/.test(w)||/^NH3$/.test(n)||/^N$/.test(n)?n+'{'+x+'}':w).replace(/[+⁺⁻]/g,'');
  const m=mk(), stated=new Map(), label=new Map(); let nC=0;
  const ord=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
  const newAtom=(el)=>{ const j=addA(m,el); if(el==='C'){ label.set(j,`the ${ord[nC]||(nC+1)+'th'} carbon`); nC++; } else label.set(j,`the ${el==='O'?'oxygen':el==='N'?'nitrogen':el}`); return j; };
  function run(T,attach){
    let prev=attach, pend=1, last=null, pendB=[], leadH=0;
    const back=(el,h)=>{ const j=newAtom(el); if(prev!=null) addB(m,prev,j,pend); else if(pend>1) throw E('A double or triple bond needs an atom on each side.'); pend=1; if(h!=null) stated.set(j,h+(prev==null&&attach==null?leadH:0)); leadH=0; pendB.splice(0).forEach(f=>f(j)); prev=j; last=j; return j; };
    const term=(fn)=>{ if(prev==null){ pendB.push(fn); } else fn(prev); };
    const leaf=(at,el,o)=>{ const j=newAtom(el); addB(m,at,j,o||1); return j; };
    for(let k=0;k<T.length;k++){ const tk=T[k];
      if(tk.t==='bond'){ if(prev==null) throw E('A formula can’t start with a bond.'); pend=tk.o; continue; }
      if(tk.t==='ion'){ if(last==null) throw E('Put the ion after the group it belongs to, e.g. CH3COO⁻Na⁺.'); const a=m.atoms[last]; if(a.el==='O'){ a.ch=-1; a.ion=tk.v; } else if(a.el==='N'){ a.ch=1; a.ion=tk.v; } continue; }
      if(tk.t==='paren'){ const sub=tokFormula(tk.inner); const isCH2=tk.inner==='CH2';
        if(isCH2){ for(let r=0;r<tk.n;r++) back('C',2); continue; }
        for(let r=0;r<tk.n;r++){ if(prev==null) pendB.push(at=>run(sub,at)); else run(sub,prev); } continue; }
      if(tk.t==='el'){ const {v,n}=tk;
        if(v==='H'){ if(last==null) leadH+=n; else stated.set(last,(stated.get(last)||0)+n); continue; }
        if(v==='C'&&n>1){ let H=null; if(T[k+1]&&T[k+1].t==='el'&&T[k+1].v==='H'){ H=T[k+1].n; k++; } for(let r=0;r<n;r++) back('C',null); continue; }
        if(v==='C'||v==='N'||v==='O'){ if(n>1) throw E(`“${v}${n}” isn’t a group I can place. Write each atom with its H, e.g. CH3CH2…`); back(v,0); continue; }
        for(let r=0;r<n;r++) term(at=>{ last=leaf(at,v); }); continue; }
      switch(tk.v){
        case 'C6H5': { const ids=[]; for(let r=0;r<6;r++) ids.push(newAtom('C')); for(let r=0;r<6;r++) addB(m,ids[r],ids[(r+1)%6],r%2?1:2,true); if(prev!=null) addB(m,prev,ids[0],1); pendB.splice(0).forEach(f=>f(ids[0])); pend=1; prev=ids[0]; last=ids[0]; break; }
        case 'COOH': { const c=back('C',null); leaf(c,'O',2); last=leaf(c,'O'); stated.set(last,1); prev=c; break; }
        case 'HOOC': { const c=back('C',null); leaf(c,'O',2); leaf(c,'O'); break; }
        case 'COO': { const c=back('C',null); leaf(c,'O',2); const o=leaf(c,'O'); stated.set(o,0); prev=o; last=o; break; }
        case 'CONH2': { const c=back('C',null); leaf(c,'O',2); last=leaf(c,'N'); stated.set(last,2); prev=c; break; }
        case 'CONH': { const c=back('C',null); leaf(c,'O',2); const n=leaf(c,'N'); stated.set(n,1); prev=n; last=n; break; }
        case 'COCl': { const c=back('C',null); leaf(c,'O',2); leaf(c,'Cl'); stated.set(c,0); break; }
        case 'CHO': { const c=back('C',1); leaf(c,'O',2); break; }
        case 'OHC': { const c=back('C',1); leaf(c,'O',2); break; }
        case 'CN': { const c=back('C',0); leaf(c,'N',3); break; }
        case 'CO': { const c=back('C',0); leaf(c,'O',2); break; }
        case 'NO2': term(at=>{ last=leaf(at,'NO2'); }); break;
        case 'OH': if(prev==null) back('O',1); else { last=leaf(prev,'O'); stated.set(last,1); } break;
        case 'HO': back('O',1); break;
        case 'NH2': if(prev==null) back('N',2); else { last=leaf(prev,'N'); stated.set(last,2); } break;
        case 'H2N': back('N',2); break;
        case 'NH': back('N',1); break;
        case 'NH3': if(prev==null) back('N',3); else { last=leaf(prev,'N'); stated.set(last,3); } break;
      }
    }
    if(pendB.length) throw E('There’s a group at the start with nothing after it to attach to.');
    if(pend>1) throw E('A double or triple bond at the end has nothing on the other side.');
  }
  run(tokFormula(s),null);
  if(!m.atoms.length) throw E('Type a formula, e.g. CH3CH2OH.');
  const A=adj(m);
  for(let i=0;i<m.atoms.length;i++){ const h=hcount(m,A,i), st=stated.get(i), L=label.get(i);
    if(h<0) throw E(`${L[0].toUpperCase()+L.slice(1)} would have too many bonds. Check the formula.`);
    if(st!=null&&st!==h&&m.atoms[i].el!=='NO2') throw E(`${L[0].toUpperCase()+L.slice(1)} is written with ${st} H, but with its bonds it needs ${h}. Each C makes 4 bonds, N 3 and O 2.`); }
  return m;
}

root.IUPAC={parse:parseName,build,check,nameOf,analyse,canon,formula,classify,random,whyNot,nameParts,stringify,fromName,fromFormula,looksLikeFormula,FAMILIES,adj,hcount,findRings,isArom,stereoBonds,cipKey,cmpCip,subMol,removeAtoms,clone,norm,
  STEM,MULT,GROUPWORD,SUFW,TERM,PRI,METALN,HALIDEN,HALON,SERIES,valOf};
if(typeof module!=='undefined'&&module.exports) module.exports=root.IUPAC;
})(typeof window!=='undefined'?window:globalThis);
