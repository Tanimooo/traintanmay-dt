/* Typesets formulae across the site: italic variables, upright numbers, units and words, a maths font.
   Whole equations (.eq b, [data-fx]) are formatted directly; prose is scanned for "x = …" spans. */
(function(){
'use strict';
const FUNCS=new Set(['sin','cos','tan','ln','log','lg','exp','max','min','rms','esc','sinh','cosh','arcsin','arccos','arctan']);
const VARRUNS=new Set(['Anev','Ane','eV','hf','mgh','mv','mc','BIL','BQv','BAN','BANω','NkT','nRT','GMm','GM','Fx','Fv','Fd','VI','VQ','It','IR','Ir','RA','kT','kx','bc','ut','at','as','mL','hc','LIV']);
const UNIT=/^(?:k|M|G|T|m|n|p|c|d|μ)?(?:m|s|g|N|J|W|V|A|C|Ω|Pa|Hz|K|mol|eV|T|Wb|F|H|h|min|rad|sr|AU|ly|pc|Bq|Gy|Sv|dB|l|L|u|y|yr|day|days|km|kg|kW)$/;
const GREEK_UP=/[ΔΣΩΦΓΘΛΠΨ]/; const GREEK_LOW=/[α-ωϑϕϵ]/;
const isWord=r=>r.length>=3&&/[aeiouyAEIOUY]/.test(r)&&/^[A-Za-z][a-z]+$/.test(r)&&!VARRUNS.has(r);
const esc=s=>s.replace(/&(?!(?:[a-z]+|#\d+);)/g,'&amp;');

/* format a fragment of HTML that is known to be maths */
function fmath(html){
  const parts=html.split(/(<[^>]+>)/); let out='', last='op'; const stack=[]; let sub=0;
  for(const p of parts){ if(!p) continue;
    if(p[0]==='<'){ out+=p; if(/^<su[bp]\b/i.test(p)){ stack.push(last); last='op'; if(/^<sub/i.test(p)) sub++; } else if(/^<\/su[bp]/i.test(p)){ last=stack.pop()||'var'; if(/^<\/sub/i.test(p)) sub=Math.max(0,sub-1); } continue; }
    const re=/([A-Za-z]+)|([α-ωϑϕϵ])|([ΔΣΩΦΓΘΛΠΨ])|(\d+(?:[.,]\d+)*)|(&[a-z]+;|&#\d+;)|(\s+)|([⁰¹²³⁴⁵⁶⁷⁸⁹⁻₀-₉]+)|(.)/g; let m;
    while((m=re.exec(p))){
      if(m[1]){ const r=m[1];
        if(sub&&!/^[xyzni]$/.test(r)){ out+=`<span class="u">${r}</span>`; }
        else if(FUNCS.has(r)){ out+=`<span class="fn">${r}</span>`; last='fn'; }
        else if((last==='num'||last==='unit')&&UNIT.test(r)){ out+=`<span class="u">${r}</span>`; last='unit'; }
        else if(isWord(r)){ out+=`<span class="w">${r}</span>`; last='word'; }
        else { out+=r.split('').map(ch=>`<i>${ch}</i>`).join(''); last='var'; } }
      else if(m[2]){ const g=m[2]; if(g==='π'){ out+=g; last='var'; } else if(g==='μ'&&(last==='num'||last==='unit')){ out+=g; last='unit'; } else { out+=`<i>${g}</i>`; last='var'; } }
      else if(m[3]){ out+=m[3]; last=(m[3]==='Ω'&&(last==='num'||last==='unit'))?'unit':'var'; }
      else if(m[4]){ out+=m[4]; last='num'; }
      else if(m[5]){ out+=m[5]; }
      else if(m[6]){ out+=m[6]; }
      else if(m[7]){ out+=m[7]; }
      else { const ch=m[8]; out+=ch==='-'?'−':ch; if('=+−-×÷/·≈∝→±<>≤≥'.includes(ch)) last='op'; else if(ch==='°'||ch==='%') last='unit'; else if(ch==='('||ch===')'||ch==='|') {} } }
  }
  return out;
}
/* radicals: √(…) gets an overline when the bracket closes in the same run of text */
function radicals(html){ return html.replace(/√\(([^()<>]{1,60})\)/g,(s,a)=>`√<span class="rad">${a}</span>`); }

/* find formula spans in prose HTML. Tags other than sub/sup are boundaries. */
const SS='(?:<su[bp]>[^<]{0,20}</su[bp]>)';
const TOK=`(?:[^\\s<>=,;:!?…]|${SS})+`;
const OP='(?:=|≈|∝|→|\\+|−|×|÷|·|±|/)';
const FORM=new RegExp(`((?:(?:ln|log|lg|sin|cos|tan) )?${TOK})(\\s*(?:=|≈|∝)\\s*)((?:${TOK})(?:\\s*${OP}\\s*(?:${TOK})|\\s(?:${TOK}))*)`,'g');
const WORDLHS=new Set(['gradient','intercept','uncertainty','density','pressure','speed','velocity','momentum','power','efficiency','work','energy','force','weight','stress','strain','moment','torque','current','charge','resistance','wavelength','frequency','period','intensity','upthrust','total','area','volume','mass','ratio','distance','displacement','time','range','impulse','diff','activity','luminosity','capacitance','emf','gain','magnification']);
const plain=s=>s.replace(/<[^>]+>/g,'');
function mathyTok(t){ if(/<su[bp]>/.test(t)) return 'sym'; const p=plain(t).replace(/^[(\[|]+|[)\]|.,]+$/g,''); if(/^[a-z]{2,}$/.test(p)&&!VARRUNS.has(p)&&!FUNCS.has(p)) return 'word'; if(/^[\d.,]+[⁰-⁹⁻²³]*%?°?$/.test(p)) return 'num'; if(FUNCS.has(p)) return 'fn'; if(/^[A-Za-zα-ωΔΣΩθλ][₀-₉⁰-⁹⁻²³]*$/.test(p)) return 'sym'; if(UNIT.test(p)) return 'unit'; if(/^[A-Za-z]{2,}$/.test(p)&&!VARRUNS.has(p)) return 'word'; if(/[a-z]{3,}/i.test(p)&&isWord((p.match(/[A-Za-z]+/)||[''])[0])&&!/[=/×²³√½]/.test(p)) return 'word'; return 'expr'; }
function trimRHS(rhs){ // cut the RHS at the first space-joined token that reads like English
  const bits=rhs.split(/(\s+)/); let keep=''; let prevType='expr';
  for(let i=0;i<bits.length;i++){ const b=bits[i]; if(/^\s+$/.test(b)){ continue; }
    const prevSpace=i>0&&/^\s+$/.test(bits[i-1]); const prevTok=keep.trim().split(/\s+/).pop()||''; const opJoin=/^[=≈∝→+−×÷·±/]/.test(b)||/[=≈∝→+−×÷·±/]$/.test(prevTok);
    const ty=mathyTok(b);
    if(prevSpace&&!opJoin){ if(!(ty==='fn'||ty==='sym'||ty==='num'||(ty==='unit'&&(prevType==='num'||prevType==='unit'))||(ty==='expr'&&!/[a-z]{3,}/.test(plain(b))))) break; }
    if(ty==='word'&&!opJoin&&i>0) break;
    keep+=(prevSpace&&keep?bits[i-1]:'')+b; prevType=ty; if(/\.$/.test(plain(b))&&i<bits.length-1) break; }
  let k=keep.replace(/[.,;:]+$/,''); const opens=(k.match(/\(/g)||[]).length, closes=(k.match(/\)/g)||[]).length; if(closes>opens) k=k.replace(/\)+$/,m=>m.slice(0,Math.max(0,m.length-(closes-opens))));
  return k.replace(/\s*[=≈∝→+−×÷·±/]\s*$/,''); }
function proseSeg(seg){ FORM.lastIndex=0;
    return seg.replace(FORM,(all,lhs,eq,rhs)=>{ const r=trimRHS(rhs); if(!r||!/[A-Za-zα-ωΔ\d]/.test(plain(r))) return all; const pr=plain(r);
      if((pr.match(/\(/g)||[]).length!==(pr.match(/\)/g)||[]).length) return all;
      const toks=pr.split(/\s+/).filter(Boolean); const lastTok=toks[toks.length-1].replace(/[^A-Za-z]/g,'');
      if(/^[a-z]{3,}$/.test(lastTok)&&/^\s+[A-Za-z(]/.test(rhs.slice(r.length))) return all;
      if(toks.every(t=>/^[±]?[a-z]{3,}[.,]?$/.test(t))) return all;
      const lp=plain(lhs); let L=lhs, pre=''; const lt=mathyTok(lhs);
      if(lt==='word'&&!WORDLHS.has(lp.toLowerCase().replace(/^%/,''))){ pre=lhs; L=''; }
      if(/[a-z]{4,}/.test(lp)&&lt!=='word'&&!/^[A-Za-z]+$/.test(lp)&&!WORDLHS.has(lp.toLowerCase())) { pre=lhs; L=''; }
      const rest=rhs.slice(r.length); const body=L+eq+r;
      if(!L) return pre+eq+`<span class="m">${fmath(radicals(r))}</span>`+proseSeg(rest);
      return `${pre}<span class="m">${fmath(radicals(body))}</span>${proseSeg(rest)}`; }); }
function proseMath(html){ return html.split(/(<(?!\/?su[bp]>)[^>]+>)/).map(seg=>(!seg||seg[0]==='<')?seg:proseSeg(seg)).join(''); }
window.TTMATH={fmath:h=>fmath(radicals(h)),prose:proseMath};

/* apply to the page as it renders */
const SEL='.specbox li,.notes p,.notes li,.notes td,.term p,.fc-face .a,.fc-face .q,.qz-q,.qz-exp,.qz-opts button>span:not(.l),.lab-note,.mcap,.steptext,.pagcap,.paper p,.ms td,.ms p,.minfo li,.minfo p,.examtip,.card p,.tcard p,.eq span';
function run(root){ (root||document).querySelectorAll('.eq b:not([data-m]),[data-fx]:not([data-m])').forEach(el=>{ el.dataset.m=1; el.classList.add('m','mb'); el.innerHTML=fmath(radicals(el.innerHTML)); });
  (root||document).querySelectorAll(SEL).forEach(el=>{ if(el.dataset.m||el.closest('[data-nomath],.qpaper,.bk-list,header,nav,.m')) return; el.dataset.m=1; if(el.querySelector('button,input,select,textarea,canvas,svg,img,.m')) return; if(!/(=|≈|∝)/.test(el.textContent)) return; const h=el.innerHTML; const n=proseMath(h); if(n!==h) el.innerHTML=n; }); }
let pend=false; const sched=()=>{ if(pend) return; pend=true; requestAnimationFrame(()=>{ pend=false; try{ run(document.getElementById('view')||document); }catch(e){ console.warn(e); } }); };
const start=()=>{ sched(); new MutationObserver(sched).observe(document.body,{childList:true,subtree:true}); };
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
