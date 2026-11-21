/* TrainTanmay Chemistry: typeset maths the way it is written by hand.
   Anything between $…$ (inline) or $$…$$ (on its own line) is rendered with KaTeX (from ../maths/katex).
   Pages are drawn by JS, so a MutationObserver re-renders whenever the page changes.
   If a line of working is too wide for the screen, it is re-set as aligned steps:
       A = B          A = B
         = C    →       = C
   with one "= …" per line, lined up on the equals signs, like a worked answer on paper. */
(function(){
'use strict';
const MACROS={'\\bigsum':'\\mathop{\\Large\\sum}'};
const OPTS={delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false,macros:MACROS,
  ignoredTags:['script','noscript','style','textarea','pre','code','option','input','select']};

/* split TeX at top-level "=" and "\Rightarrow" (not inside {…}), e.g. \mathrm{C{=}O} is left alone */
function splitTex(tex){
  const cuts=[]; let d=0;
  for(let i=0;i<tex.length;i++){ const c=tex[i];
    if(c==='{') d++; else if(c==='}') d--;
    else if(c==='\\'){ const m=/^\\([a-zA-Z]+|.)/.exec(tex.slice(i)); if(m){ if(d===0&&m[1]==='Rightarrow') cuts.push([i,m[0].length,'\\Rightarrow']); i+=m[0].length-1; } }
    else if(c==='='&&d===0) cuts.push([i,1,'=']); }
  if(!cuts.length) return null;
  let out='', last=0;
  cuts.forEach(([i,len,op],k)=>{ out+=tex.slice(last,i)+(k?'\\\\ ':'')+'&'+op+' '; last=i+len; });
  out+=tex.slice(last);
  return '\\begin{aligned}'+out+'\\end{aligned}';
}
/* last resort for a line that still doesn't fit (a long fraction, or an equation with no "="): shrink it a little */
function shrink(d){ const k=d.querySelector('.katex'); if(!k) return; k.style.fontSize='';
  if(d.scrollWidth<=d.clientWidth+2) return; const r=d.clientWidth/d.scrollWidth; k.style.fontSize=Math.max(0.62,r*0.98).toFixed(3)+'em'; }
function fit(root){
  if(!window.katex) return;
  (root||document).querySelectorAll('.katex-display').forEach(d=>{
    if(!d.clientWidth) return;                       /* hidden (closed details, other tab): try again when shown */
    if(d.hasAttribute('data-fit')){ shrink(d); return; }
    if(d.scrollWidth<=d.clientWidth+2){ return; }
    const a=d.querySelector('annotation[encoding="application/x-tex"]'); if(!a) return;
    const tex=splitTex(a.textContent.trim()); if(!tex) { d.setAttribute('data-fit','1'); shrink(d); return; }
    const s=document.createElement('span');
    try{ katex.render(tex,s,{displayMode:true,throwOnError:false,macros:MACROS}); }catch(e){ return; }
    const nd=s.firstElementChild; if(!nd) return; nd.setAttribute('data-fit','1'); d.replaceWith(nd); shrink(nd);
  });
}
let timer=null;
const obs=new MutationObserver(muts=>{ if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===3?n.data.includes('$'):(n.textContent||'').includes('$')||(n.querySelector&&n.querySelector('.katex-display'))))){ clearTimeout(timer); timer=setTimeout(run,15); } });
function run(){ if(!window.renderMathInElement) return; obs.disconnect();
  try{ renderMathInElement(document.body,OPTS); fit(document); }catch(e){ console.warn(e); }
  obs.observe(document.body,{childList:true,subtree:true}); }
/* lines inside a <details> or a tab only get a width once they're shown */
document.addEventListener('toggle',e=>{ if(e.target.open){ obs.disconnect(); fit(e.target); obs.observe(document.body,{childList:true,subtree:true}); } },true);
let rt=null; window.addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>{ obs.disconnect(); fit(document); obs.observe(document.body,{childList:true,subtree:true}); },150); });
window.TTTEX={run,fit,splitTex};
const start=()=>{ run(); };
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
