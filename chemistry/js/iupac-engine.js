/* TrainTanmay Chemistry: IUPAC naming engine.
   parse(name)  -> molecule (atoms + bonds) built from a typed name, with the parent chain the name used
   name(mol)    -> the IUPAC name, worked out from the structure (longest chain, lowest locants, alphabetical order)
   check(name)  -> parse + name + "is the typed name the right IUPAC name, and if not, why not"
   random(opts) -> a random molecule for the quiz
   Covers the AQA A-level families: alkanes, alkenes, halogenoalkanes, alcohols, aldehydes, ketones, carboxylic acids,
   esters, acyl chlorides, amides, nitriles, amines, cycloalkanes and benzene rings. Runs in the browser and in node. */
(function(root){
'use strict';
const STEM=['','meth','eth','prop','but','pent','hex','hept','oct','non','dec','undec','dodec'];
const STEM_RE='(undec|dodec|meth|eth|prop|but|pent|hex|hept|oct|non|dec)';
const MULT=['','','di','tri','tetra','penta','hexa','hepta','octa'];
const CMULT=['','','bis','tris','tetrakis','pentakis','hexakis'];
const MULTN={di:2,tri:3,tetra:4,penta:5,hexa:6,hepta:7,octa:8,bis:2,tris:3,tetrakis:4,pentakis:5,hexakis:6};
const VAL={C:4,N:3,O:2,F:1,Cl:1,Br:1,I:1,NO2:1};
const HALO={fluoro:'F',chloro:'Cl',bromo:'Br',iodo:'I'};
const HALON={F:'fluoro',Cl:'chloro',Br:'bromo',I:'iodo'};
const TERM={al:1,acid:1,ester:1,acyl:1,amide:1,nitrile:1};
const PRI=['acid','ester','acyl','amide','nitrile','al','one','ol','amine'];
const SUFW={acid:'oic acid',ester:'oate',acyl:'oyl chloride',amide:'amide',nitrile:'nitrile',al:'al',one:'one',ol:'ol',amine:'amine'};
const SUFX={acid:'carboxylic acid',ester:'carboxylate',acyl:'carbonyl chloride',amide:'carboxamide',nitrile:'carbonitrile',al:'carbaldehyde'};
const BENZ={'':'benzene',ol:'phenol',amine:'phenylamine',acid:'benzoic acid',al:'benzaldehyde',nitrile:'benzonitrile',amide:'benzamide',acyl:'benzoyl chloride',ester:'benzoate'};
const GROUPWORD={acid:'carboxylic acid group (COOH)',ester:'ester group (COO)',acyl:'acyl chloride group (COCl)',amide:'amide group (CONH₂)',nitrile:'nitrile group (C≡N)',al:'aldehyde group (CHO)',one:'ketone C=O',ol:'OH group',amine:'amine group (NH₂)'};
const E=msg=>{ const e=new Error(msg); e.iu=true; return e; };
const UNSUP='This one is beyond the A-level naming rules this lab knows.';

/* ---------------- molecules ---------------- */
const mk=()=>({atoms:[],bonds:[]});
const addA=(m,el)=>{ m.atoms.push({el}); return m.atoms.length-1; };
const addB=(m,a,b,o,ar)=>{ m.bonds.push({a,b,o:o||1,ar:!!ar}); };
function adj(m){ const A=m.atoms.map(()=>[]); m.bonds.forEach((b,i)=>{ A[b.a].push({j:b.b,o:b.o,ar:b.ar,i}); A[b.b].push({j:b.a,o:b.o,ar:b.ar,i}); }); return A; }
const bsum=(A,i)=>A[i].reduce((s,x)=>s+x.o,0);
const hcount=(m,A,i)=>VAL[m.atoms[i].el]-bsum(A,i);
const bondBetween=(m,a,b)=>m.bonds.find(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a));

function findRings(m,A){
  const N=m.atoms.length, st=new Array(N).fill(0), par=new Array(N).fill(-1), depth=new Array(N).fill(0), rings=[];
  const dfs=(u)=>{ st[u]=1; for(const x of A[u]){ const v=x.j; if(v===par[u]) continue; if(st[v]===0){ par[v]=u; depth[v]=depth[u]+1; dfs(v); } else if(st[v]===1&&depth[v]<depth[u]){ const r=[]; let w=u; while(w!==v){ r.push(w); w=par[w]; } r.push(v); rings.push(r.reverse()); } } st[u]=2; };
  for(let i=0;i<N;i++) if(!st[i]) dfs(i);
  return rings;
}
function isArom(m,r){ if(r.length!==6) return false; const bs=r.map((a,i)=>bondBetween(m,a,r[(i+1)%6])); if(bs.every(b=>b.ar)) return true; const s=bs.map(b=>b.o).join(''); return s==='121212'||s==='212121'; }

/* canonical fingerprint (colour refinement; exact for trees and for the single-ring molecules used here) */
function canon(m){
  const A=adj(m), N=m.atoms.length; if(!N) return '';
  const rs=findRings(m,A); const ar=new Set(); rs.forEach(r=>{ if(isArom(m,r)) r.forEach((a,i)=>{ ar.add(a+'-'+r[(i+1)%6]); ar.add(r[(i+1)%6]+'-'+a); }); });
  const bo=(i,x)=>ar.has(i+'-'+x.j)?'a':String(x.o);
  let lab=m.atoms.map((a,i)=>a.el+'|'+hcount(m,A,i)+'|'+A[i].map(x=>bo(i,x)).sort().join(''));
  const comp=L=>{ const u=[...new Set(L)].sort(); const ix=new Map(u.map((s,k)=>[s,k])); return L.map(s=>ix.get(s)); };
  let c=comp(lab);
  for(let r=0;r<N+1;r++){ const nl=c.map((v,i)=>v+':'+A[i].map(x=>bo(i,x)+c[x.j]).sort().join(',')); const nc=comp(nl); const same=new Set(nc).size===new Set(c).size; lab=nl; c=nc; if(same&&r>2) break; }
  return lab.slice().sort().join(';');
}

/* ---------------- reading a name ---------------- */
const COMMON={'acetone':'propanone','acetic acid':'ethanoic acid','formic acid':'methanoic acid','formaldehyde':'methanal','acetaldehyde':'ethanal','ethylene':'ethene','propylene':'propene','acetylene':'ethyne','toluene':'methylbenzene','aniline':'phenylamine','benzenamine':'phenylamine','chloroform':'trichloromethane','glycerol':'propane-1,2,3-triol','glycerine':'propane-1,2,3-triol','isopropanol':'propan-2-ol','isopropyl alcohol':'propan-2-ol','ethylene glycol':'ethane-1,2-diol','methyl alcohol':'methanol','ethyl alcohol':'ethanol','isobutane':'2-methylpropane','isopentane':'2-methylbutane','neopentane':'2,2-dimethylpropane','isooctane':'2,2,4-trimethylpentane','lactic acid':'2-hydroxypropanoic acid','glycine':'aminoethanoic acid','alanine':'2-aminopropanoic acid','acrylic acid':'propenoic acid','styrene':'ethenylbenzene','vinyl chloride':'chloroethene','dimethylamine':'N-methylmethanamine','trimethylamine':'N,N-dimethylmethanamine','diethylamine':'N-ethylethanamine','triethylamine':'N,N-diethylethanamine','acetonitrile':'ethanenitrile','acetyl chloride':'ethanoyl chloride','ethyl acetate':'ethyl ethanoate','methyl acetate':'methyl ethanoate','acetamide':'ethanamide','acrylonitrile':'propenenitrile','oxalic acid':'ethanedioic acid','methyl methacrylate':'methyl 2-methylpropenoate','phenylethene':'ethenylbenzene','xylene':'1,2-dimethylbenzene','carbon tetrachloride':'tetrachloromethane','freon':'dichlorodifluoromethane','methylamine':'methanamine','ethylamine':'ethanamine'};
function norm(s){ return String(s||'').toLowerCase().replace(/[‐-―−]/g,'-').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim()
  .replace(/\s*-\s*/g,'-').replace(/\s*,\s*/g,',').replace(/\(\s+/g,'(').replace(/\s+\)/g,')').replace(/\[/g,'(').replace(/\]/g,')'); }
const locList=s=>s.split(',').map(x=>x==='n'||x==="n'"?'N':+x);

function simpleSub(t){
  let mm;
  const fixed=[['fluoro',{k:'halo',el:'F'}],['chloro',{k:'halo',el:'Cl'}],['bromo',{k:'halo',el:'Br'}],['iodo',{k:'halo',el:'I'}],['hydroxy',{k:'oh'}],['oxo',{k:'oxo'}],['amino',{k:'nh2'}],['nitro',{k:'no2'}],
    ['phenyl',{k:'alkyl',ben:1,n:6,attach:1,prefixes:[]}],['isopropyl',{k:'alkyl',n:3,attach:2,prefixes:[]}],['isobutyl',{k:'alkyl',n:3,attach:1,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],
    ['sec-butyl',{k:'alkyl',n:4,attach:2,prefixes:[]}],['tert-butyl',{k:'alkyl',n:3,attach:2,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],['t-butyl',{k:'alkyl',n:3,attach:2,prefixes:[{locs:[2],cnt:1,sub:{k:'alkyl',n:1,attach:1,prefixes:[]}}]}],
    ['vinyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:2}],prefixes:[]}],['ethenyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:2}],prefixes:[]}],['ethynyl',{k:'alkyl',n:2,attach:1,unsat:[{loc:1,o:3}],prefixes:[]}]];
  for(const [w,d] of fixed) if(t.startsWith(w)) return {len:w.length,sub:JSON.parse(JSON.stringify(d)),raw:w};
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
    if((mm=t.match(/^(tetrakis|pentakis|hexakis|tris|bis|di|tri|tetra|penta|hexa)(?=[a-z(])/))&&!/^(tri|di)(?=yl)/.test(t)){ mult=mm[1]; p+=mm[0].length; t=s.slice(p); }
    let sub, raw;
    if(t[0]==='('){ const q=closeParen(s,p); if(q<0) throw E('A bracket is not closed.'); raw=s.slice(p+1,q); sub=parseGroup(raw); p=q+1; }
    else { const r=simpleSub(t); if(!r) throw E(`I don't recognise “${t.replace(/-.*$/,'')}” as a substituent. Prefixes look like methyl, ethyl, chloro, bromo, hydroxy, amino…`); sub=r.sub; raw=r.raw; p+=r.len; }
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
    const r=simpleSub(s.slice(j)); if(!r||j+r.len!==s.length||r.sub.k!=='alkyl') continue;
    let pre; try{ pre=parsePrefixes(s.slice(0,j)); }catch(e){ continue; }
    r.sub.prefixes=(r.sub.prefixes||[]).concat(pre); return r.sub;
  }
  throw E(`I can't read the group “${s}”.`);
}
const SUFS=[['carboxylic acid','acid',1],['carbaldehyde','al',1],['carbonitrile','nitrile',1],['carboxamide','amide',1],['carbonyl chloride','acyl',1],['carboxylate','ester',1],
  ['oic acid','acid'],['oyl chloride','acyl'],['oate','ester'],['amine','amine'],['amide','amide'],['nitrile','nitrile'],['one','one'],['al','al'],['ol','ol']];
function parseParent(r){
  let mm;
  // benzene family
  const bz=Object.entries(BENZ).find(([,w])=>w===r); if(bz) return {kind:'benzene',n:6,unsat:[],suffix:bz[0]?{t:bz[0],locs:[1],exo:!!TERM[bz[0]]}:null,amb:[]};
  if((mm=r.match(/^benzene-(\d+(?:,\d+)+)-(di|tri)(ol|amine|carboxylic acid)$/))){ const t={ol:'ol',amine:'amine','carboxylic acid':'acid'}[mm[3]]; const locs=locList(mm[1]); if(locs.length!==MULTN[mm[2]]) throw E('The number of locants does not match '+mm[2]+'.'); return {kind:'benzene',n:6,unsat:[],suffix:{t,locs,exo:t==='acid'},amb:[]}; }
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
function parseName(input){
  let s=norm(input); const notes=[];
  if(!s) throw E('Type a name.');
  s=s.replace(/^\((?:[ezrs\d,]+)\)-/,()=>{ notes.push('E/Z and R/S labels are ignored here: the drawing shows the structure, not the 3D arrangement.'); return ''; }).replace(/^(?:cis|trans|[ez])-(?=[a-z\d])/,()=>{ notes.push('cis/trans and E/Z labels are ignored here.'); return ''; });
  if(COMMON[s]){ notes.push(`“${s}” is a common name. Its IUPAC name is ${COMMON[s]}.`); s=norm(COMMON[s]); }
  let mm=s.match(new RegExp('^(\\d+-(?:methyl|ethyl)|)'+STEM_RE+'ylamine$'));
  if(mm){ const nn=mm[1]+mm[2]+'an-1-amine'; notes.push(`“${s}” is an older style of name. IUPAC: ${mm[2]==='meth'||mm[2]==='eth'?nn.replace('an-1-','an'):nn}.`); s=nn; }
  let main=s, alkyl=null;
  const parts=s.split(' '), nMain=/ (acid|chloride)$/.test(s)?2:1;
  if(parts.length>nMain){
    const al=parts.slice(0,parts.length-nMain).join(' '), rest=parts.slice(-nMain).join(' ');
    if(!/(oate|carboxylate)$/.test(rest)){ if(/yl$/.test(al)&&/oic acid$/.test(rest)) throw E(`Esters are named alkyl …oate, e.g. “${al} ${rest.replace(/oic acid$/,'oate')}”.`); throw E(`I can't read “${s}”. Only ester names (like “ethyl ethanoate”) and acids or acyl chlorides have a space.`); }
    alkyl=parseGroup(al.replace(/^\((.*)\)$/,'$1')); main=rest;
  }
  const P=parseMain(main); P.esterAlkyl=alkyl; P.notes=notes; return P;
}
function parseNameLenient(input){
  try{ return parseName(input); }
  catch(e){ const s=norm(input); if(!e.iu||!/ /.test(s)||/ (acid|chloride)$/.test(s)) throw e;
    let P; try{ P=parseName(s.replace(/ /g,'')); }catch(e2){ throw e2; }
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
function build(P){
  const m=mk(), order=[], amb=(P.amb||[]).slice(), n=P.n;
  if(P.kind==='benzene'){ for(let i=0;i<6;i++) order.push(addA(m,'C')); for(let i=0;i<6;i++) addB(m,order[i],order[(i+1)%6],i%2?1:2,true); }
  else { if(P.kind==='ring'&&n<3) throw E('A ring needs at least 3 carbons.'); for(let i=0;i<n;i++) order.push(addA(m,'C')); for(let i=0;i<n-1;i++) addB(m,order[i],order[i+1]); if(P.kind==='ring') addB(m,order[n-1],order[0]); }
  const L=i=>{ if(!(i>=1&&i<=n)) throw E(`There's no carbon ${i}: the ${P.kind==='chain'?'chain':'ring'} only has ${n}.`); return order[i-1]; };
  P.unsat.forEach(u=>{ const a=L(u.loc); let b;
    if(P.kind==='chain'){ if(u.loc>=n) throw E(n===1?'One carbon can\'t have a C=C double bond: the smallest alkene is ethene.':`A ${u.o===2?'double':'triple'} bond at carbon ${u.loc} needs carbon ${u.loc+1}, but the chain stops at ${n}.`); b=order[u.loc]; }
    else b=order[u.loc%n];
    const bd=bondBetween(m,a,b); if(bd.o>1) throw E(`Two multiple bonds can't both be at position ${u.loc}.`); bd.o=u.o; });
  let Nat=null; const S=P.suffix, ketEnds=[];
  if(S){ S.locs.forEach(loc=>{ let c=L(loc);
    if(S.exo){ const x=addA(m,'C'); addB(m,c,x); c=x; }
    switch(S.t){
      case 'ol': addB(m,c,addA(m,'O')); break;
      case 'one': addB(m,c,addA(m,'O'),2); if(P.kind==='chain'&&(loc===1||loc===n)) ketEnds.push([c,loc]); break;
      case 'al': addB(m,c,addA(m,'O'),2); break;
      case 'acid': addB(m,c,addA(m,'O'),2); addB(m,c,addA(m,'O')); break;
      case 'ester': { addB(m,c,addA(m,'O'),2); const o=addA(m,'O'); addB(m,c,o); if(!P.esterAlkyl) throw E('An ester name needs the alkyl part first, e.g. “methyl ethanoate”.'); addB(m,o,buildSub(m,P.esterAlkyl,amb)); break; }
      case 'acyl': addB(m,c,addA(m,'O'),2); addB(m,c,addA(m,'Cl')); break;
      case 'amide': { addB(m,c,addA(m,'O'),2); const x=addA(m,'N'); addB(m,c,x); if(Nat==null) Nat=x; break; }
      case 'nitrile': addB(m,c,addA(m,'N'),3); break;
      case 'amine': { const x=addA(m,'N'); addB(m,c,x); if(Nat==null) Nat=x; break; }
    } }); }
  else if(P.esterAlkyl) throw E('The second word of an ester name ends in -oate, e.g. ethyl propanoate.');
  placePrefixes(m,order,n,P.kind,P.prefixes||[],amb,false,S?(TERM[S.t]?'term':'yes'):false,Nat);
  const A=adj(m);
  ketEnds.forEach(([c,loc])=>{ if(A[c].filter(x=>m.atoms[x.j].el==='C').length<2) throw E(n===1?'With one carbon, C=O is methanal (an aldehyde), not a ketone.':`A C=O on the end carbon (${loc}) is an aldehyde, so the name would end in -al, not -one. Ketone C=O groups are never on the end of the chain.`); });
  for(let i=0;i<m.atoms.length;i++){ const h=hcount(m,A,i); if(h<0){ const el=m.atoms[i].el; const k=order.indexOf(i);
    throw E(el==='C'?`${k>=0?'Carbon '+(k+1):'A carbon'} would have ${bsum(A,i)} bonds, but carbon can only make 4. Check the locants.`:`The ${el==='N'?'nitrogen':el==='O'?'oxygen':el} would have too many bonds.`); } }
  if(P.kind==='chain'&&n===1&&P.unsat.length) throw E('The smallest alkene is ethene.');
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
const locNum=l=>l==='N'?0:l;
const sortL=a=>a.slice().sort((x,y)=>locNum(x)-locNum(y));
function groupPrefixes(pre){
  const g=new Map();
  pre.forEach(p=>{ if(!g.has(p.name)) g.set(p.name,{name:p.name,key:p.key,cx:p.cx,locs:[]}); g.get(p.name).locs.push(p.loc); });
  return [...g.values()].map(x=>(x.locs=sortL(x.locs),x)).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:(a.name<b.name?-1:1));
}
function prefixString(groups,omit){
  return groups.map((g,i)=>{ const k=g.locs.length; const mult=k>1?(g.cx?CMULT[k]:MULT[k]):''; const body=mult+g.name;
    return omit?body:g.locs.join(',')+'-'+body; }).join(omit?'':'-');
}
function heteroPrefix(m,A,j,o){
  const el=m.atoms[j].el;
  if(el==='O'){ if(o===2) return 'oxo'; if(A[j].length===1) return 'hydroxy'; return null; }
  if(el==='N'){ if(o===1&&A[j].length===1) return 'amino'; return null; }
  if(HALON[el]) return HALON[el];
  if(el==='NO2') return 'nitro';
  return null;
}
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
    if(el==='O'){ const on=A[x].filter(y=>y.j!==c); if(!on.length) groups.push({t:'acid',c,atoms:[O,x]}); else if(on.length===1&&isC(on[0].j)&&!A[on[0].j].some(y=>!isC(y.j)&&y.o===2)) groups.push({t:'ester',c,atoms:[O,x],alk:on[0].j,O:x}); else throw E(UNSUP); }
    else if(el==='Cl') groups.push({t:'acyl',c,atoms:[O,x]});
    else if(el==='N'){ const nn=A[x].filter(y=>y.j!==c); if(nn.some(y=>!isC(y.j)||y.o!==1||A[y.j].some(z=>!isC(z.j)&&z.o===2))) throw E(UNSUP); groups.push({t:'amide',c,atoms:[O,x],N:x}); }
    else throw E(UNSUP);
  }
  groups.forEach(g=>g.atoms.forEach(a=>used.add(a)));
  for(let h=0;h<N;h++){ if(isC(h)||used.has(h)) continue; const el=m.atoms[h].el, nb=A[h];
    if(el==='O'){ if(nb.length===1) groups.push({t:'ol',c:nb[0].j,atoms:[h]}); else throw E('This has an ether (C–O–C). Ethers aren’t in the A-level naming rules, so this lab doesn’t name them.'); }
    else if(el==='N'){ if(nb.some(y=>!isC(y.j)||y.o!==1)) throw E(UNSUP); groups.push({t:'amine',N:h,carbs:nb.map(y=>y.j),atoms:[h],c:nb[0].j}); }
    else if(HALON[el]) groups.push({t:'halo',c:nb[0].j,atoms:[h],el});
    else if(el==='NO2') groups.push({t:'nitro',c:nb[0].j,atoms:[h]});
  }
  const principal=PRI.find(t=>groups.some(g=>g.t===t))||null;
  groups.forEach(g=>{ if(g.t===principal) return; if(TERM[g.t]&&g.t!=='al') throw E('This has two different main functional groups, which is beyond A-level naming.'); if(g.t==='amine'&&g.carbs.length>1) throw E(UNSUP); });
  const PG=groups.filter(g=>g.t===principal);
  const excl=new Set(); let esterG=null;
  if(principal==='ester'){ if(PG.length>1) throw E('Molecules with two ester groups are beyond A-level naming.'); esterG=PG[0];
    const q=[esterG.alk]; excl.add(esterG.alk); while(q.length){ const u=q.pop(); A[u].forEach(x=>{ if(x.j!==esterG.O&&!excl.has(x.j)){ excl.add(x.j); q.push(x.j); } }); } }
  const acidC=new Set(groups.filter(g=>TERM[g.t]&&g.t!=='al').map(g=>g.c));
  const memo=new Map();
  /* substituent name for the branch that starts at root (bonded to from) */
  function subName(rt,from){
    const mk_=rt+'>'+from; if(memo.has(mk_)) return memo.get(mk_);
    let res=null; memo.set(mk_,null);
    const bf=bondBetween(m,rt,from); if(bf&&bf.o>1){ return null; }
    if(acidC.has(rt)){ return null; }
    if(ringOf[rt]>=0){ const r=rings[ringOf[rt]], L=r.length, i0=r.indexOf(rt); let best=null;
      if(!arom[ringOf[rt]]&&r.some((a,i)=>bondBetween(m,a,r[(i+1)%L]).o>1)) return null;
      for(const d of [1,-1]){ const ord=[]; for(let t=0;t<L;t++) ord.push(r[((i0+d*t)%L+L)%L]); const inS=new Set(ord), pre=[]; let ok=true;
        ord.forEach((a,i)=>A[a].forEach(x=>{ if(inS.has(x.j)||(a===rt&&x.j===from)||!ok) return; if(isC(x.j)){ if(x.o>1){ ok=false; return; } const s=subName(x.j,a); if(!s){ ok=false; return; } pre.push({loc:i+1,name:s.name,key:s.key,cx:s.cx}); } else { const nm=heteroPrefix(m,A,x.j,x.o); if(!nm){ ok=false; return; } pre.push({loc:i+1,name:nm,key:nm}); } }));
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
      ord.forEach((a,i)=>A[a].forEach(x=>{ if(!ok||inS.has(x.j)||(a===rt&&x.j===from)) return; if(isC(x.j)){ if(x.o>1){ ok=false; return; } const s=subName(x.j,a); if(!s){ ok=false; return; } pre.push({loc:i+1,name:s.name,key:s.key,cx:s.cx}); } else { const nm=heteroPrefix(m,A,x.j,x.o); if(!nm){ ok=false; return; } pre.push({loc:i+1,name:nm,key:nm}); } }));
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
      if(isC(j)){ if(x.o>1) return null; const s=subName(j,a); if(!s) return null; pre.push({loc:loc.get(a),name:s.name,key:s.key,cx:s.cx}); }
      else { const nm=heteroPrefix(m,A,j,x.o); if(!nm) return null; pre.push({loc:loc.get(a),name:nm,key:nm}); } } }
    for(const {g,an} of anchors){ if(g.t!=='amine'&&g.t!=='amide') continue;
      for(const y of A[g.N]){ if(y.j===an||y.j===g.c||!isC(y.j)) continue; const s=subName(y.j,g.N); if(!s) return null; pre.push({loc:'N',name:s.name,key:s.key,cx:s.cx}); } }
    const gp=groupPrefixes(pre);
    const key=[-pl.length,cd.ring?0:1,-mb.length,-Ln,-db.length,-pre.length,sortL(pl),mb,db,sortL(pre.map(p=>p.loc)),gp.map(g=>g.locs.map(locNum))];
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
  let best=null;
  for(const cd of cands){ const ev=evalCand(cd); if(ev&&(!best||cmpKey(ev.key,best.key)<0)) best=ev; }
  if(!best) throw E(UNSUP);
  let forced;
  if(force){ const k=rings.findIndex(r=>r.length===force.order.length&&force.order.every(a=>r.includes(a))); forced=evalCand({order:force.order,ring:force.ring,arom:force.ring&&k>=0&&arom[k]}); }
  const spec={kind:best.cd.ring?(best.cd.arom?'benzene':'ring'):'chain',n:best.ord.length,
    unsat:best.mb.map(l=>({loc:l,o:bondBetween(m,best.ord[l-1],best.ord[l%best.ord.length]).o})),
    suffix:best.pl.length?{t:principal,locs:best.pl,exo:best.exo}:null,prefixes:best.gp,ester:null};
  if(esterG){ const s=subName(esterG.alk,esterG.O); if(!s) throw E(UNSUP); spec.ester=s.name.replace(/^\((.*)\)$/,'$1'); }
  return {best,forced,spec,groups,principal,rings,ringOf,arom,A};
}

/* omit locants where IUPAC (and AQA) leaves them out */
function omissions(sp){
  const T=sp.prefixes.reduce((s,g)=>s+g.locs.length,0), hasN=sp.prefixes.some(g=>g.locs.includes('N'));
  const S=sp.suffix, n=sp.n, ch=sp.kind==='chain';
  const o={pre:false,suf:false,uns:false};
  if(!hasN){
    if(ch&&n===1) o.pre=true;
    else if(ch&&n===2&&S&&TERM[S.t]&&S.locs.length===1) o.pre=true;
    else if(ch&&n===2&&!S&&T===1) o.pre=true;
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
function stringify(sp,full){
  const om=full?{}:omissions(sp);
  const pre=prefixString(sp.prefixes,om.pre);
  const S=sp.suffix;
  let parent;
  if(sp.kind==='benzene'){
    if(!S) parent='benzene';
    else if(S.locs.length===1) parent=BENZ[S.t];
    else parent='benzene-'+S.locs.join(',')+'-'+MULT[S.locs.length]+(S.exo?SUFX[S.t]:SUFW[S.t]);
  } else {
    let stem=(sp.kind==='ring'?'cyclo':'')+STEM[sp.n];
    const en=sp.unsat.filter(u=>u.o===2).map(u=>u.loc), yn=sp.unsat.filter(u=>u.o===3).map(u=>u.loc);
    let us;
    if(!en.length&&!yn.length) us='an';
    else { us=(en.length>1||yn.length>1)?'a':'';
      if(en.length) us+=(om.uns?'':'-'+en.join(',')+'-')+(en.length>1?MULT[en.length]:'')+'en';
      if(yn.length) us+=(om.uns?'':'-'+yn.join(',')+'-')+(yn.length>1?MULT[yn.length]:'')+'yn'; }
    if(!S) parent=stem+us+'e';
    else { const word=S.exo?SUFX[S.t]:SUFW[S.t], k=S.locs.length, mult=k>1?MULT[k]:'';
      const needE=!!mult||/^[^aeiou]/.test(word);
      const showLoc=!om.suf&&!(TERM[S.t]&&!S.exo)&&!(S.exo&&k===1);
      parent=stem+us+(needE?'e':'')+(showLoc?'-'+S.locs.join(',')+'-':'')+mult+word; }
  }
  if(sp.ester!=null) parent=parent.replace(/(oate|carboxylate|benzoate)$/,'$1');
  const nm=pre+parent;
  return sp.ester!=null?sp.ester+' '+nm:nm;
}
const fixN=s=>s.replace(/(^|[-(,\s])n(?=[,-])/g,'$1N').replace(/(^|[-(,\s])n(?=[,-])/g,'$1N');
function nameOf(m){ const a=analyse(m); return {name:fixN(stringify(a.spec,false)),full:fixN(stringify(a.spec,true)),a}; }

/* ---------------- facts ---------------- */
const AR={C:12.0,H:1.0,N:14.0,O:16.0,F:19.0,Cl:35.5,Br:79.9,I:126.9};
function formula(m){
  const A=adj(m), c={};
  m.atoms.forEach((a,i)=>{ const h=hcount(m,A,i); if(a.el==='NO2'){ c.N=(c.N||0)+1; c.O=(c.O||0)+2; } else c[a.el]=(c[a.el]||0)+1; if(h>0) c.H=(c.H||0)+h; });
  const order=['C','H',...Object.keys(c).filter(k=>k!=='C'&&k!=='H').sort()];
  const sub=n=>String(n).split('').map(d=>'₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
  const f=order.filter(k=>c[k]).map(k=>k+(c[k]>1?sub(c[k]):'')).join('');
  const mr=Object.entries(c).reduce((s,[k,v])=>s+AR[k]*v,0);
  return {f,mr,counts:c};
}
const SERIES={acid:'Carboxylic acid',ester:'Ester',acyl:'Acyl chloride',amide:'Amide',nitrile:'Nitrile',al:'Aldehyde',one:'Ketone',ol:'Alcohol',amine:'Amine'};
function classify(m,an){
  const A=an.A, out=[]; const isC=i=>m.atoms[i].el==='C';
  const deg=c=>A[c].filter(x=>isC(x.j)).length;
  const cls=k=>k<=1?'primary':k===2?'secondary':'tertiary';
  const seen={};
  an.groups.forEach(g=>{ let s;
    if(g.t==='ol'){ s=an.ringOf[g.c]>=0&&an.arom[an.ringOf[g.c]]?'Phenol':cls(deg(g.c))+' alcohol'; }
    else if(g.t==='halo') s=an.ringOf[g.c]>=0&&an.arom[an.ringOf[g.c]]?'Halogenoarene':cls(deg(g.c))+' halogenoalkane';
    else if(g.t==='amine') s=(g.carbs.some(c=>an.ringOf[c]>=0&&an.arom[an.ringOf[c]])?'aromatic ':'')+cls(g.carbs.length)+' amine';
    else if(g.t==='amide'){ const k=A[g.N].filter(x=>isC(x.j)).length; s=k===1?'Amide':(k===2?'N-substituted amide':'N,N-disubstituted amide'); }
    else if(g.t==='nitro') s='Nitro compound';
    else s=SERIES[g.t];
    s=s[0].toUpperCase()+s.slice(1); seen[s]=1; });
  const hasCC=m.bonds.some(b=>b.o===2&&!b.ar&&isC(b.a)&&isC(b.b)), hasCt=m.bonds.some(b=>b.o===3&&isC(b.a)&&isC(b.b));
  if(hasCC) seen['Alkene (C=C)']=1; if(hasCt) seen['Alkyne (C≡C)']=1;
  if(an.arom.some(x=>x)) seen['Arene (benzene ring)']=1;
  Object.keys(seen).forEach(k=>out.push(k));
  if(!out.length) out.push(an.rings.length?'Cycloalkane':'Alkane');
  return out;
}

/* ---------------- checking a typed name ---------------- */
const REASON=[
  (an)=>`The parent ${an.spec.kind==='chain'?'chain':'ring'} has to include ${an.best.pl.length>1?'every':'the'} ${GROUPWORD[an.principal]}, so it can go in the suffix.`,
  (an)=>an.spec.kind==='chain'?`Here the chain is the parent, not the ring.`:`The ring is the parent here, so name it as a substituted ${an.spec.kind==='benzene'?'benzene':'cycloalkane'}.`,
  ()=>`The parent chain must include the C=C (or C≡C) bond.`,
  (an,f)=>`There's a longer chain: ${an.spec.n} carbons, not ${f.ord.length}. The longest chain doesn't have to run in a straight line across the drawing: follow it round the bends.`,
  ()=>`The parent chain must include the double bond.`,
  ()=>`Two chains are equally long, so choose the one with more branches (substituents).`,
  (an)=>`Number from the other end, so the ${GROUPWORD[an.principal]} gets the lowest possible number.`,
  ()=>`Number from the other end, so the double bond gets the lowest possible number.`,
  ()=>`Number from the other end, so the double bond gets the lowest possible number.`,
  ()=>`Number from the end that gives the substituents the lowest numbers. Compare the locants one by one: the first difference decides.`,
  ()=>`It's a tie on numbers, so the substituent that comes first in the alphabet gets the lower number.`];
function check(input){
  const P=parseNameLenient(input);
  const B=build(P);
  let an; try{ an=analyse(B.mol,{order:B.order,ring:B.ring}); }catch(e){ return {ok:false,mol:B.mol,order:B.order,notes:P.notes,amb:B.amb,unnamed:e.message,valid:false,parsed:P}; }
  const name=fixN(stringify(an.spec,false)), full=fixN(stringify(an.spec,true));
  const issues=B.amb.slice(); if(P.spaced) issues.push('Apart from esters, acids and acyl chlorides, IUPAC names are one word: no spaces.'); let reason=null;
  if(!an.forced) reason='That numbering doesn’t work for this molecule.';
  else { const c=cmpKey(an.forced.key,an.best.key); if(c!==0){ let i=0; while(i<an.best.key.length&&cmpKey([an.forced.key[i]],[an.best.key[i]])===0) i++; reason=(REASON[i]||REASON[9])(an,an.forced); } }
  // alphabetical order and repeated prefixes
  const keys=(P.prefixes||[]).map(p=>p.key);
  for(let i=1;i<keys.length;i++){ if(keys[i]<keys[i-1]){ issues.push(`Put the prefixes in alphabetical order (ignore di-, tri-…): ${keys.slice().sort().filter((v,k,a)=>a.indexOf(v)===k).join(', ')}.`); break; } }
  const dup=keys.find((k,i)=>keys.indexOf(k)!==i); if(dup) issues.push(`Combine the ${dup} groups into one prefix with di-/tri-, e.g. 2,3-di${dup}.`);
  if(P.esterAlkyl==null&&an.spec.ester!=null) {}
  const valid=!reason&&!issues.length;
  return {ok:true,mol:B.mol,order:B.order,ring:B.ring,name,full,an,valid,reason,issues,notes:P.notes,parsed:P,
    exact:valid&&norm(input).replace(/\s/g,'')===norm(name).replace(/\s/g,'')};
}

/* ---------------- random molecules for the quiz ---------------- */
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const SUBS={me:()=>({k:'alkyl',n:1,attach:1,prefixes:[]}),et:()=>({k:'alkyl',n:2,attach:1,prefixes:[]}),pr:()=>({k:'alkyl',n:3,attach:1,prefixes:[]}),ipr:()=>({k:'alkyl',n:3,attach:2,prefixes:[]}),
  cl:()=>({k:'halo',el:'Cl'}),br:()=>({k:'halo',el:'Br'}),f:()=>({k:'halo',el:'F'}),i:()=>({k:'halo',el:'I'}),oh:()=>({k:'oh'}),nh2:()=>({k:'nh2'}),no2:()=>({k:'no2'}),ph:()=>({k:'alkyl',ben:1,n:6,attach:1,prefixes:[]})};
function addSubs(P,list,lo,hi){ list.forEach(s=>P.prefixes.push({locs:[R(lo,hi)],cnt:1,sub:SUBS[s]()})); }
const FAMILIES={
  alkane:{label:'Alkanes',make:L=>{ const n=R(3,[6,8,9][L]); const P={kind:'chain',n,unsat:[],suffix:null,prefixes:[]}; const k=[R(1,1),R(1,2),R(2,3)][L]; for(let i=0;i<k;i++) addSubs(P,[L===2&&n>=5&&Math.random()<.3?pick(['et','ipr']):(Math.random()<.8?'me':'et')],2,n-1); return P; }},
  alkene:{label:'Alkenes',make:L=>{ const n=R(L?3:2,[5,7,8][L]); const P={kind:'chain',n,unsat:[{loc:R(1,n-1),o:2}],suffix:null,prefixes:[]}; if(L===2&&n>=4&&Math.random()<.4){ const l2=P.unsat[0].loc+2; if(l2<n) P.unsat.push({loc:l2,o:2}); } const k=[0,R(0,1),R(1,2)][L]; for(let i=0;i<k;i++) addSubs(P,[Math.random()<.75?'me':'et'],1,n); if(L>=1&&Math.random()<.15) P.unsat[0].o=3; return P; }},
  halo:{label:'Halogenoalkanes',make:L=>{ const n=R(1,[4,6,6][L]); const P={kind:'chain',n,unsat:[],suffix:null,prefixes:[]}; const k=[1,R(1,2),R(2,3)][L]; for(let i=0;i<k;i++) addSubs(P,[pick(L?['cl','br','f','i','cl','br']:['cl','br'])],1,n); if(L>=1&&n>=3&&Math.random()<.5) addSubs(P,['me'],2,n-1); return P; }},
  alcohol:{label:'Alcohols',make:L=>{ const n=R(1,[5,6,7][L]); const P={kind:'chain',n,unsat:[],suffix:{t:'ol',locs:[R(1,n)]},prefixes:[]}; if(L===2&&n>=2&&Math.random()<.35){ let b=R(1,n); if(b!==P.suffix.locs[0]) P.suffix.locs=[P.suffix.locs[0],b].sort((x,y)=>x-y); } if(L>=1&&n>=3) addSubs(P,[pick(['me','me','et','cl'])],1,n); if(L===2&&n>=3&&Math.random()<.5) addSubs(P,[pick(['me','cl','br'])],1,n); return P; }},
  carbonyl:{label:'Aldehydes & ketones',make:L=>{ const ket=Math.random()<.5; const n=ket?R(3,[5,6,7][L]):R(1,[5,6,7][L]); const P={kind:'chain',n,unsat:[],suffix:ket?{t:'one',locs:[R(2,n-1)]}:{t:'al',locs:[1]},prefixes:[]}; if(L>=1&&n>=3) addSubs(P,[pick(['me','me','et','cl'])],2,n); if(L===2&&n>=3) addSubs(P,[pick(['me','oh','br'])],2,n); return P; }},
  acid:{label:'Carboxylic acids & esters',make:L=>{ const est=Math.random()<.45; const n=R(1,[4,6,6][L]); const P={kind:'chain',n,unsat:[],suffix:{t:est?'ester':'acid',locs:[1]},prefixes:[]}; if(est) P.esterAlkyl=SUBS[pick(L===2?['me','et','pr','ipr']:['me','et','pr'])](); if(L>=1&&n>=2) addSubs(P,[pick(['me','me','cl','et'])],2,n); if(L===2&&n>=2) addSubs(P,[pick(['oh','nh2','cl','me'])],2,n); return P; }},
  deriv:{label:'Acyl chlorides, amides, nitriles',make:L=>{ const t=pick(['acyl','amide','nitrile']); const n=R(t==='amide'?1:2,[4,5,6][L]); const P={kind:'chain',n,unsat:[],suffix:{t,locs:[1]},prefixes:[]}; if(L>=1&&n>=3) addSubs(P,[pick(['me','cl','me'])],2,n); if(L===2&&t==='amide'&&Math.random()<.6) P.prefixes.push({locs:['N'],cnt:1,sub:SUBS[pick(['me','et'])]()}); return P; }},
  amine:{label:'Amines',make:L=>{ const n=R(1,[4,6,6][L]); const P={kind:'chain',n,unsat:[],suffix:{t:'amine',locs:[R(1,n)]},prefixes:[]}; if(L>=1&&n>=3&&Math.random()<.6) addSubs(P,['me'],1,n); if(L===2&&Math.random()<.6) P.prefixes.push({locs:['N'],cnt:1,sub:SUBS.me()}); if(L===2&&n>=4&&!P.prefixes.some(p=>p.locs[0]==='N')&&Math.random()<.25) P.suffix.locs=[1,n]; return P; }},
  ring:{label:'Rings & benzene',make:L=>{ const r=Math.random();
    if(r<.4){ const P={kind:'benzene',n:6,unsat:[],suffix:null,prefixes:[]}; const s=Math.random(); if(L>=1&&s<.5) P.suffix={t:pick(['ol','acid','amine','al']),locs:[1],exo:false}; if(P.suffix) P.suffix.exo=!!TERM[P.suffix.t]; const k=[1,R(1,2),R(2,3)][L]-(P.suffix?1:0); for(let i=0;i<Math.max(k,P.suffix?0:1);i++) addSubs(P,[pick(['me','cl','br','no2','et','me'])],P.suffix?2:1,6); return P; }
    if(r<.75){ const n=R(4,6); const P={kind:'ring',n,unsat:[],suffix:null,prefixes:[]}; if(L>=1&&Math.random()<.5) P.suffix={t:pick(['ol','one']),locs:[1]}; if(!P.suffix&&L>=1&&Math.random()<.3) P.unsat.push({loc:1,o:2}); const k=[1,R(1,2),R(1,3)][L]-(P.suffix?1:0); for(let i=0;i<Math.max(k,P.suffix?0:1);i++) addSubs(P,[pick(['me','me','cl','et','br'])],P.suffix?2:1,n); return P; }
    const n=R(1,[3,4,5][L]); const P={kind:'chain',n,unsat:[],suffix:L&&Math.random()<.6?{t:pick(['ol','one','acid']),locs:[1]}:null,prefixes:[]}; if(P.suffix&&P.suffix.t==='one'){ if(n<3) P.suffix=null; else P.suffix.locs=[2]; } addSubs(P,['ph'],1,n); return P; }}
};
/* skip structures a chemist would never meet, e.g. an OH and a Cl on the same carbon */
function odd(m){ const A=adj(m); return m.atoms.some((a,i)=>{ if(a.el!=='C') return false; const h=A[i].filter(x=>m.atoms[x.j].el!=='C'&&x.o===1&&A[x.j].length===1).map(x=>m.atoms[x.j].el); const dO=A[i].some(x=>m.atoms[x.j].el==='O'&&x.o===2); return (h.includes('O')&&h.length>1)||(h.includes('N')&&h.length>1)||(dO&&h.some(e=>e!=='O'&&e!=='N'&&e!=='Cl')); }); }
function random(opts){
  opts=opts||{}; const fam=(opts.families&&opts.families.length?opts.families:Object.keys(FAMILIES)); const L=opts.level==null?1:opts.level; const avoid=opts.avoid||[];
  for(let t=0;t<400;t++){
    const f=pick(fam); let P; try{ P=FAMILIES[f].make(L); P.amb=[]; const B=build(P); if(odd(B.mol)) continue; const nm=nameOf(B.mol); if(nm.name.length>(L===0?22:L===1?32:44)) continue; if(avoid.includes(nm.name)) continue; return {mol:B.mol,name:nm.name,full:nm.full,an:nm.a,family:f}; }catch(e){ if(!e.iu) throw e; }
  }
  const B=build({kind:'chain',n:4,unsat:[],suffix:null,prefixes:[],amb:[]}); const nm=nameOf(B.mol); return {mol:B.mol,name:nm.name,full:nm.full,an:nm.a,family:'alkane'};
}

root.IUPAC={parse:parseName,build,check,nameOf,analyse,canon,formula,classify,random,FAMILIES,adj,hcount,findRings,isArom,norm,STEM,GROUPWORD,SUFW,TERM};
if(typeof module!=='undefined'&&module.exports) module.exports=root.IUPAC;
})(typeof window!=='undefined'?window:globalThis);
