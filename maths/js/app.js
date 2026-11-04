/* TrainTanmay Maths – Edexcel 9MA0 / 9FM0 revision app */
(function(){
'use strict';
const CAT = window.CAT, DR = window.DRILLS || [], VIS = window.VIS || {};
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const app = $('#app');

/* ---------------- data indexes ---------------- */
const COURSES = CAT.courses, CBY = Object.fromEntries(COURSES.map(c => [c.id, c]));
const TOP = CAT.topics;
const url = u => { const i = u.indexOf('|'); return i > 0 && CAT.pfx[u.slice(0, i)] ? CAT.pfx[u.slice(0, i)] + u.slice(i + 1) : u; };
const ITEMS = CAT.items, IBY = Object.fromEntries(ITEMS.map(it => [it.i, it]));
const byC = {}, byT = {};
ITEMS.forEach(it => { (byC[it.c] = byC[it.c] || []).push(it); if (it.t) (byT[it.c + '/' + it.t] = byT[it.c + '/' + it.t] || []).push(it); });
const tname = (c, t) => (TOP[c] || []).find(x => x[0] === t)?.[1] || t;
const DRILL_TOPIC = {chain:'diff', product:'diff', quotient:'diff', implicit:'diff', parametric:'diff', revchain:'integ', parts:'integ', subst:'integ', pfint:'integ', pf:'alg', binomial:'seq', harmonic:'trig', trigeq:'trig', explog:'exp'};
const DBY = Object.fromEntries(DR.map(d => [d.key, d]));

/* ---------------- storage ---------------- */
const KEY = 'tt-maths-v1', DKEY = 'tt-maths-drills-v1';
let S = {done:{}, conf:{}, scores:{}, recent:[], days:[], settings:{theme:'system', dys:false, paperSpec:'cur'}};
try { const r = localStorage.getItem(KEY); if (r) { const p = JSON.parse(r); S = Object.assign(S, p); S.settings = Object.assign({theme:'system', dys:false, paperSpec:'cur'}, p.settings || {}); } } catch(e) {}
let D = {res:{}, pos:{}};
try { const r = localStorage.getItem(DKEY); if (r) D = Object.assign(D, JSON.parse(r)); } catch(e) {}
let st = null;
const save = () => { clearTimeout(st); st = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem(DKEY, JSON.stringify(D)); } catch(e) {} }, 120); };
const touchDay = () => { const d = new Date().toISOString().slice(0, 10); if (!S.days.includes(d)) { S.days.push(d); if (S.days.length > 500) S.days = S.days.slice(-500); } };
const toast = m => { const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = m; document.body.appendChild(el); setTimeout(() => el.remove(), 2400); };
function applyTheme(){ const t = S.settings.theme; if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); $('#theme').value = t; window.dispatchEvent(new Event('themechange')); }
function applyDys(){ document.documentElement.classList.toggle('dys', !!S.settings.dys); $('#dys').setAttribute('aria-pressed', S.settings.dys ? 'true' : 'false'); }
$('#theme').onchange = e => { S.settings.theme = e.target.value; save(); applyTheme(); };
$('#dys').onclick = () => { S.settings.dys = !S.settings.dys; save(); applyDys(); };
applyTheme(); applyDys();
const math = el => { try { renderMathInElement(el, {delimiters:[{left:'$', right:'$', display:false}], throwOnError:false}); } catch(e) {} };

/* ---------------- icons ---------------- */
const IC = {
 practice:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
 courses:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M8 7h7"/>',
 papers:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
 drills:'<path d="M4 20l6-6"/><path d="M14 4l6 6-8 8-6-6z"/><path d="M14 10l-2 2"/>',
 vis:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
 progress:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', videos:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
 check:'<path d="M5 12l5 5 9-10"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
 play:'<path d="M7 4l13 8-13 8z"/>'
};
const ic = (k, w = 1.9) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ''}</svg>`;
const NAV = [['home', 'Home'], ['courses', 'Courses'], ['papers', 'Papers'], ['practice', 'Practice'], ['drills', 'Skill drills'], ['vis', 'Visualisers'], ['progress', 'Progress']];
function renderNav(active){
  $('#nav').innerHTML = NAV.map(([k, l]) => `<a href="#${k}" ${k === active ? 'aria-current="page"' : ''}>${ic(k)}<span>${l}</span></a>`).join('');
  $('#drawerpanel').innerHTML = `<input type="search" id="dsearch" placeholder="Search everything…" aria-label="Search">` + NAV.map(([k, l]) => `<a href="#${k}" ${k === active ? 'aria-current="page"' : ''}>${l}</a>`).join('') +
    '<hr style="border:0;border-top:1px solid var(--line);width:100%">' + COURSES.map(c => `<a href="#c-${c.id}">${esc(c.name)}</a>`).join('');
  const ds = $('#dsearch'); if (ds) ds.addEventListener('keydown', e => { if (e.key === 'Enter') { Q.q = ds.value; closeDrawer(); location.hash = 'search'; if (location.hash === '#search') route(); } });
}
const closeDrawer = () => { $('#drawer').hidden = true; };
$('#menubtn').onclick = () => { $('#drawer').hidden = false; };
$('#drawer').addEventListener('click', e => { if (e.target.id === 'drawer' || e.target.closest('a')) closeDrawer(); });

/* ---------------- item rendering ---------------- */
const DOCN = {QP:'Questions', QPMS:'Questions + MS', MS:'Mark scheme', MA:'Model answers', SOL:'Solutions', AB:'Answer book', WS:'Worksheet', ANS:'Answers', PDF:'Open PDF'};
const DOCC = {QP:'qp', QPMS:'qp', WS:'qp', PDF:'qp', MS:'ms', ANS:'ms', MA:'ma', SOL:'ma', AB:''};
const best = id => { const h = S.scores[id]; if (!h || !h.length) return null; return h.reduce((a, b) => (b.s / b.m > a.s / a.m ? b : a)); };
function itemRow(it, opts = {}){
  const done = !!S.done[it.i];
  const b = best(it.i);
  const sub = opts.sub ? `<small>${opts.sub}</small>` : '';
  return `<div class="item${done ? ' done' : ''}" data-id="${it.i}">
    <button class="chk" data-done="${it.i}" aria-pressed="${done}" aria-label="Mark ${esc(it.n)} as done" title="Mark as done">${ic('check', 3)}</button>
    <div class="nm">${esc(it.n)}${sub}</div>
    ${b ? `<span class="score" title="Best score">${b.s}/${b.m} · ${Math.round(100 * b.s / b.m)}%</span>` : ''}
    <div class="docs">${it.d.map(([k, u]) => `<a class="doc ${DOCC[k] || ''}" href="${esc(url(u))}" target="_blank" rel="noopener" data-open="${it.i}">${DOCN[k] || k}</a>`).join('')}
    ${it.s === 'test' ? `<a class="doc" href="#run-${it.i}" title="Timed attempt">${ic('clock')}Time it</a>` : ''}</div>
  </div>`;
}
function groupBlocks(list, opts = {}){
  const groups = new Map();
  list.forEach(it => { const g = opts.groupBy ? opts.groupBy(it) : it.g; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(it); });
  let out = '', k = 0;
  for (const [g, arr] of groups) {
    const done = arr.filter(it => S.done[it.i]).length;
    out += `<details class="group" ${opts.open === 'all' || (opts.open !== 'none' && k < (opts.openN ?? 2)) ? 'open' : ''}><summary>${esc(g)}<span class="cnt">${done}/${arr.length} done</span></summary><div class="items">${arr.map(it => itemRow(it, {sub: opts.sub ? opts.sub(it) : ''})).join('')}</div></details>`;
    k++;
  }
  return out || '<div class="empty">Nothing here yet.</div>';
}
function bindItems(root){
  $$('[data-done]', root).forEach(b => b.onclick = () => {
    const id = b.dataset.done; if (S.done[id]) delete S.done[id]; else { S.done[id] = Date.now(); touchDay(); }
    save(); b.setAttribute('aria-pressed', S.done[id] ? 'true' : 'false'); b.closest('.item').classList.toggle('done', !!S.done[id]);
    const grp = b.closest('.group'); if (grp) { const ids = $$('[data-done]', grp); grp.querySelector('.cnt').textContent = `${ids.filter(x => S.done[x.dataset.done]).length}/${ids.length} done`; }
  });
  $$('[data-open]', root).forEach(a => a.addEventListener('click', () => { const id = a.dataset.open; S.recent = [id, ...S.recent.filter(x => x !== id)].slice(0, 12); touchDay(); save(); }));
}

/* ---------------- pages ---------------- */
const counts = c => { const L = byC[c] || []; return {exam: L.filter(i => i.s === 'exam').length, prac: L.filter(i => i.s === 'prac').length, test: L.filter(i => i.s === 'test').length}; };
const confTally = c => { const t = TOP[c] || []; let g = 0, a = 0, r = 0; t.forEach(([id]) => { const v = S.conf[c + '/' + id]; if (v === 'g') g++; else if (v === 'a') a++; else if (v === 'r') r++; }); return {g, a, r, n: t.length}; };
function courseCard(c){
  const n = counts(c.id), cf = confTally(c.id);
  return `<a class="ccard" href="#c-${c.id}"><span class="code">${esc(c.code)}</span><h3>${esc(c.name)}</h3>
    <div class="bar" title="Topics rated green"><i style="width:${cf.n ? Math.round(100 * cf.g / cf.n) : 0}%"></i></div>
    <div class="meta"><span>${cf.n} topics</span>·<span>${n.test} papers</span>·<span>${n.exam + n.prac} packs</span></div></a>`;
}
const HEROART = `<svg class="heroart" id="heroart" viewBox="0 0 240 200" role="img" aria-label="A unit square being transformed by a matrix – click to open the matrix visualiser">
 <defs><pattern id="hg" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="var(--line)" stroke-width="1"/></pattern></defs>
 <rect width="240" height="200" rx="16" fill="var(--surface-2)"/><rect width="240" height="200" rx="16" fill="url(#hg)"/>
 <line x1="20" y1="140" x2="225" y2="140" stroke="var(--muted)" stroke-width="1.5"/><line x1="60" y1="185" x2="60" y2="15" stroke="var(--muted)" stroke-width="1.5"/>
 <rect x="60" y="100" width="40" height="40" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="2"/>
 <polygon id="hpoly" points="60,140 140,120 160,40 80,60" fill="color-mix(in srgb,var(--accent) 22%,transparent)" stroke="var(--accent)" stroke-width="2.5"><animate attributeName="points" dur="5s" repeatCount="indefinite" values="60,140 100,140 100,100 60,100;60,140 140,120 160,40 80,60;60,140 140,120 160,40 80,60;60,140 100,140 100,100 60,100" keyTimes="0;.4;.7;1"/></polygon>
 <text x="150" y="182" font-family="IBM Plex Mono,monospace" font-size="12" fill="var(--ink-2)">det = 4.4</text></svg>`;
function pageHome(){
  const total = ITEMS.reduce((a, it) => a + it.d.length, 0);
  const doneN = Object.keys(S.done).length;
  const att = Object.values(S.scores).reduce((a, h) => a + h.length, 0);
  const rec = S.recent.map(id => IBY[id]).filter(Boolean).slice(0, 6);
  const maths = COURSES.filter(c => c.q === 'maths'), fm = COURSES.filter(c => c.q === 'further');
  app.innerHTML = `
  <div class="hero">
    <div>
      <p class="eyebrow">Edexcel A level · 9MA0 & 9FM0</p>
      <h1>Every maths question, in one place.</h1>
      <p>${total.toLocaleString()} past papers, mark schemes, topic packs and worksheets from PMT, Madas Maths and Mr Further Maths, sorted by course and topic. There are timed papers, auto-checked skill drills and 3D visualisers too.</p>
      <form class="bigsearch" id="bigsearch" role="search"><input type="search" id="bsq" placeholder="Try “invariant lines”, “June 2023 FM1”, “partial fractions”" aria-label="Search everything"><button class="btn primary">${ic('search')}Search</button></form>
    </div>
    ${HEROART}
  </div>
  <div class="stats">
    <div class="stat"><b>${doneN}</b><span>packs & papers done</span></div>
    <div class="stat"><b>${att}</b><span>timed attempts</span></div>
    <div class="stat"><b>${Object.values(D.res).filter(v => v === 'g').length}</b><span>drill questions correct</span></div>
    <div class="stat"><b>${streak()}</b><span>day streak</span></div>
  </div>
  ${rec.length ? `<section><div class="sec-head"><h2>Pick up where you left off</h2></div><div class="group"><div class="items" style="border:0">${rec.map(it => itemRow(it, {sub: esc((CBY[it.c]?.name || 'Extension') + ' · ' + it.g)})).join('')}</div></div></section>` : ''}
  <section><div class="quick">
    <a class="qtile" href="#papers"><span class="ic">${ic('papers')}</span><span><b>Past papers</b><span>Timed, with score log</span></span></a>
    <a class="qtile" href="#practice"><span class="ic">${ic('practice')}</span><span><b>Practice questions</b><span>${PQ.length.toLocaleString()} exam Qs, self-marked</span></span></a>
    <a class="qtile" href="#drills"><span class="ic">${ic('drills')}</span><span><b>Skill drills</b><span>700 worked questions</span></span></a>
    <a class="qtile" href="#vis"><span class="ic">${ic('vis')}</span><span><b>Visualisers</b><span>Matrices, 3D vectors, polar…</span></span></a>
    <a class="qtile" href="#videos"><span class="ic">${ic('videos')}</span><span><b>Videos</b><span>Topic videos & revision</span></span></a>
    <a class="qtile" href="#progress"><span class="ic">${ic('progress')}</span><span><b>Progress</b><span>Scores & weak topics</span></span></a>
  </div></section>
  <section><div class="sec-head"><h2>A level Maths</h2><span class="muted">9MA0</span></div><div class="grid g3">${maths.map(courseCard).join('')}</div></section>
  <section><div class="sec-head"><h2>Further Maths</h2><span class="muted">9FM0 · all modules</span></div><div class="grid g4">${fm.map(courseCard).join('')}</div></section>`;
  $('#bigsearch').onsubmit = e => { e.preventDefault(); Q.q = $('#bsq').value; location.hash = 'search'; };
  $('#heroart').onclick = () => location.hash = 'vis-matrix2d';
  bindItems(app);
}
function streak(){ const set = new Set(S.days); let n = 0; const d = new Date(); if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1); while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); } return n; }

function pageCourses(){
  app.innerHTML = `<p class="eyebrow">Choose a course</p><h1>Courses</h1>
  <section><h2>A level Maths (9MA0)</h2><div class="grid g3">${COURSES.filter(c => c.q === 'maths').map(courseCard).join('')}</div></section>
  <section><h2>Further Maths (9FM0)</h2><p class="lead" style="margin:-4px 0 12px">Core Pure 1 & 2 are compulsory; the options are Further Pure, Further Statistics, Further Mechanics and Decision.</p><div class="grid g4">${COURSES.filter(c => c.q === 'further').map(courseCard).join('')}</div></section>
  <section><h2>Beyond A level</h2><div class="grid g3"><a class="ccard" href="#c-ext"><span class="code">Madas Maths</span><h3>University-style booklets</h3><div class="meta">${(byC.ext || []).length} booklets for stretch and challenge</div></a></div></section>`;
}

const SPECS = [['cur', 'Current spec'], ['as', 'AS papers'], ['extra', 'Practice papers'], ['ial', 'International A level'], ['old', 'Old spec (pre-2017)']];
function visFor(c, t){ return Object.entries(VIS).filter(([, v]) => (v.topics || []).some(([vc, vt]) => vc === c && (!t || vt === t || vt === '*'))); }
function visCard([id, v]){ return `<a class="viscard" href="#vis-${id}"><span class="ic">${v.icon || ''}</span><span><b>${esc(v.name)}</b><span>${esc(v.desc)}</span></span></a>`; }
const VID = Object.assign({by: {}, whole: {}, fun: [], res: [], full: {}}, window.VIDEOS || {});
const ytId = u => (String(u).match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([\w-]{11})/) || [])[1];
const vidCard = v => { const id = ytId(v.u);
  if (!id) return `<a class="vid" href="${esc(v.u)}" target="_blank" rel="noopener"><span class="yt" aria-hidden="true"></span><span><b>${esc(v.l || v.n)}</b><span>${esc(v.l ? v.n : (v.w || ''))}</span></span></a>`;
  return `<a class="vidt" href="${esc(v.u)}" target="_blank" rel="noopener"><span class="th"${(window.THUMBS || {})[id] ? ` style="background:url(ts/t${THUMBS[id][0]}.webp) ${THUMBS[id][1] % 8 / 7 * 100}% ${Math.floor(THUMBS[id][1] / 8) / 7 * 100}% / 800% 800%"` : ''}><span class="yt" aria-hidden="true"></span>${v.f ? '<span class="chip acc fun">Fun</span>' : ''}</span><span class="tx"><b>${esc(v.l || v.n)}</b>${v.l ? `<span>${esc(v.n)}</span>` : ''}</span></a>`; };
function topicVids(c, t){ return (VID.by[c] || []).filter(v => v.t === t && !v.x); }
function furtherVids(c, t){ return (VID.by[c] || []).filter(v => v.x && (t == null || v.t === t)).filter((v, i, a) => a.findIndex(w => w.u === v.u) === i); }
const furtherBlock = (L, top) => L.length ? `<h3 style="margin:${top || 20}px 0 4px;font-size:1rem">Taking it further</h3><p class="muted" style="margin:0 0 10px;font-size:.88rem">Intuition and the bigger picture – not exam technique.</p><div class="vids tv">${L.map(vidCard).join('')}</div>` : '';
function courseVids(c){ const L = (VID.by[c] || []).filter(v => !v.x), w = VID.whole[c], F = VID.full[c] || []; if (!L.length && !w && !F.length) return '';
  const groups = (TOP[c] || []).map(([t, n]) => [n, L.filter(v => v.t === t)]).filter(g => g[1].length); const other = L.filter(v => !v.t || !(TOP[c] || []).some(x => x[0] === v.t));
  return `${w ? `<div class="vids tv" style="margin-bottom:14px">${vidCard({l: 'Whole-course revision', n: w.n, u: w.u})}</div>` : ''}${F.length ? `<h3 style="margin:16px 0 8px;font-size:1rem">Full-course playlists</h3><div class="vids">${F.map(vidCard).join('')}</div>` : ''}${groups.concat(other.length ? [['More', other]] : []).map(([n, vs]) => `<h3 style="margin:16px 0 8px;font-size:1rem">${esc(n)}</h3><div class="vids tv">${vs.map(vidCard).join('')}</div>`).join('')}${furtherBlock(furtherVids(c), 28)}`; }
function pageVideos(){
  app.innerHTML = `<p class="eyebrow">Watch</p><h1>Videos</h1><p class="lead">Hand-picked topic videos live on each topic page and in every course’s “Formulae & videos” tab. Start with whole-course revision, or pick a course and topic below.</p>
    <section><h2>Revise</h2><div class="row" style="gap:10px;margin:4px 0 14px"><label class="field" style="min-width:220px">Course<select class="sel" id="vc" style="display:block;width:100%"><option value="">Whole-course revision (all courses)</option>${COURSES.filter(c => (VID.by[c.id] || []).length || VID.whole[c.id] || (VID.full[c.id] || []).length).map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label><label class="field" style="min-width:220px">Topic<select class="sel" id="vt" style="display:block;width:100%" disabled><option value="">All topics</option></select></label></div><div id="vres"></div></section>
    ${VID.fun.length ? `<section><h2>Fun & challenge</h2><div class="vids tv">${VID.fun.map(v => vidCard({...v, f: 0})).join('')}</div></section>` : ''}
    ${VID.res.length ? `<section><h2>Other practice sites</h2><div class="vids">${VID.res.map(r => `<a class="vid" href="${esc(r.u)}" target="_blank" rel="noopener"><span class="ic" aria-hidden="true" style="width:24px;color:var(--brand)">${ic('ext')}</span><span><b>${esc(r.n)}</b><span>${esc(r.w || '')}</span></span></a>`).join('')}</div></section>` : ''}
    <section><h2>YouTube channels</h2><div class="vids">${Object.entries(CAT.videos.ch).map(([k, [n, u, w]]) => { const cs = COURSES.filter(c => (CAT.videos.by[c.id] || []).includes(k)); return `<a class="vid" href="${esc(u)}" target="_blank" rel="noopener"><span class="yt" aria-hidden="true"></span><span><b>${esc(n)}</b><span>${esc(w)}</span><span style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">${cs.map(c => `<span class="chip">${esc(c.id.toUpperCase().replace('PURE', 'Pure').replace('STATS', 'Stats').replace('MECH', 'Mech'))}</span>`).join('')}</span></span></a>`; }).join('')}</div></section>`;
  const vc = $('#vc'), vt = $('#vt'), out = $('#vres');
  const render = () => { const c = vc.value, t = vt.value;
    if (!c) { out.innerHTML = `<div class="vids tv">${Object.entries(VID.whole).map(([k, w]) => vidCard({l: CBY[k] ? CBY[k].name : k, n: w.n, u: w.u})).join('')}</div>${COURSES.some(x => (VID.full[x.id] || []).length) ? `<h3 style="margin:22px 0 4px;font-size:1.05rem">Full-course playlists</h3>${COURSES.filter(x => (VID.full[x.id] || []).length).map(x => `<h3 style="margin:14px 0 8px;font-size:.95rem">${esc(x.name)}</h3><div class="vids">${VID.full[x.id].map(vidCard).join('')}</div>`).join('')}` : ''}`; return; }
    if (!t) { out.innerHTML = courseVids(c) || '<div class="empty">No videos picked for this course yet – try the channels below.</div>'; return; }
    const L = topicVids(c, t), X = furtherVids(c, t); out.innerHTML = L.length || X.length ? `${L.length ? `<div class="vids tv">${L.map(vidCard).join('')}</div>` : ''}${furtherBlock(X, L.length ? 20 : 0)}` : '<div class="empty">No videos picked for this topic yet – try the channels below.</div>'; };
  vc.onchange = () => { const c = vc.value; const ts = c ? (TOP[c] || []).filter(([t]) => topicVids(c, t).length || furtherVids(c, t).length) : [];
    vt.innerHTML = '<option value="">All topics</option>' + ts.map(([t, n]) => `<option value="${t}">${esc(n)}</option>`).join(''); vt.disabled = !c; render(); };
  vt.onchange = render; render();
}
function vidList(c){ const L = (CAT.videos.by[c] || []).map(k => CAT.videos.ch[k]); return `<div class="vids">${L.map(([n, u, w]) => `<a class="vid" href="${esc(u)}" target="_blank" rel="noopener"><span class="yt" aria-hidden="true"></span><span><b>${esc(n)}</b><span>${esc(w)}</span></span></a>`).join('')}</div>`; }

function pageCourse(cid, tab){
  if (cid === 'ext') {
    app.innerHTML = `<div class="crumbs"><a href="#courses">Courses</a>›<span>Beyond A level</span></div><h1>University-style booklets</h1><p class="lead">Madas Maths booklets that go beyond the A level spec. They're useful for stretch, STEP/MAT style thinking, or curiosity.</p><section>${groupBlocks(byC.ext || [], {open: 'all'})}</section>`;
    bindItems(app); return;
  }
  const c = CBY[cid]; if (!c) return pageHome();
  tab = tab || 'topics';
  const L = byC[cid] || [], n = counts(cid);
  const tabs = [['topics', 'Topics', (TOP[cid] || []).length], ['papers', 'Papers & tests', n.test], ['practice', 'Practice', n.prac + (cid === 'pure' ? DR.length : 0)], ['resources', 'Formulae & videos', '']];
  let body = '';
  if (tab === 'topics') {
    const vis = visFor(cid);
    body = `<div class="grid g3">${(TOP[cid] || []).map(([tid, tn], i) => {
      const list = byT[cid + '/' + tid] || [], v = S.conf[cid + '/' + tid] || '';
      const ex = list.filter(x => x.s === 'exam').length, pr = list.filter(x => x.s === 'prac').length, dn = list.filter(x => S.done[x.i]).length;
      const hasVis = visFor(cid, tid).length;
      return `<a class="tcard" href="#t-${cid}-${tid}"><div class="top"><span class="num">${i + 1}</span><h4>${esc(tn)}</h4><span class="rag ${v}" title="Confidence"></span></div>
        <div class="row" style="gap:6px">${ex ? `<span class="chip brand">${ex} exam packs</span>` : ''}${pr ? `<span class="chip">${pr} practice</span>` : ''}${hasVis ? `<span class="chip acc">Visualiser</span>` : ''}${!ex && !pr ? '<span class="chip">Use the papers tab</span>' : ''}</div>
        ${list.length ? `<div class="bar"><i style="width:${Math.round(100 * dn / list.length)}%"></i></div>` : ''}</a>`;
    }).join('')}</div>
    ${vis.length ? `<section><h2>Visualisers for this course</h2><div class="grid g2">${vis.map(visCard).join('')}</div></section>` : ''}
    ${cid === 'd1' || cid === 'd2' ? '<p class="note" style="margin-top:18px">There are no topic packs for Decision Maths in the collection, so the Papers & tests tab has everything: current papers, AS papers, the International A level D1 and old-spec D1/D2.</p>' : ''}`;
  } else if (tab === 'papers') {
    const tests = L.filter(x => x.s === 'test');
    const have = SPECS.filter(([k]) => tests.some(x => (x.x.spec || 'extra') === k));
    let spec = S.settings.paperSpec; if (!have.some(([k]) => k === spec)) spec = have[0]?.[0];
    const list = tests.filter(x => (x.x.spec || 'extra') === spec).sort((a, b) => (a.g < b.g ? -1 : a.g > b.g ? 1 : (b.x.sk || 0) - (a.x.sk || 0) || (a.x.ord || 0) - (b.x.ord || 0)));
    body = `<div class="filters"><div class="seg" role="group" aria-label="Paper type">${have.map(([k, l]) => `<button data-spec="${k}" aria-pressed="${k === spec}">${l} <span class="muted">${tests.filter(x => (x.x.spec || 'extra') === k).length}</span></button>`).join('')}</div></div>
      ${spec === 'old' ? '<p class="note" style="margin-bottom:14px">Old-spec modules overlap with the new course: some questions use content that has moved or been dropped, so skip anything unfamiliar.</p>' : ''}
      ${spec === 'ial' ? '<p class="note" style="margin-bottom:14px">International A level units are a great source of extra Edexcel-style questions on the same content.</p>' : ''}
      ${groupBlocks(list, {openN: 2})}`;
  } else if (tab === 'practice') {
    const prac = L.filter(x => x.s === 'prac' && !x.t), topical = L.filter(x => x.s === 'prac' && x.t);
    body = (pcount(cid) ? `<section style="margin-top:0"><h2>Practice questions</h2><div class="grid g4">${(TOP[cid] || []).filter(([t]) => pcount(cid, t)).map(([t, n]) => `<a class="tcard" href="#px-${cid}-${t}"><div class="top"><h4>${esc(n)}</h4></div><span class="muted" style="font-size:.8rem">${pcount(cid, t)} questions</span></a>`).join('')}</div></section>` : '') + (cid === 'pure' ? `<section style="margin-top:0"><h2>Skill drills</h2><div class="grid g4">${DR.map(d => drillCard(d)).join('')}</div></section>` : '') +
      (prac.length ? `<section><h2>Mixed practice</h2>${groupBlocks(prac)}</section>` : '') +
      (topical.length ? `<section><h2>Practice by topic</h2>${groupBlocks(topical, {groupBy: it => tname(cid, it.t), openN: 0, sub: it => esc(it.src + ' · ' + it.g)})}</section>` : '') +
      (!prac.length && !topical.length && cid !== 'pure' ? '<div class="empty">No separate practice sheets for this module – use the exam packs in each topic and the papers tab.</div>' : '');
  } else {
    const ref = CAT.ref.filter(r => r.c === cid);
    body = `<section style="margin-top:0"><h2>Formula sheets</h2>${ref.length ? `<div class="docs">${ref.map(r => `<a class="doc qp" href="${esc(url(r.u))}" target="_blank" rel="noopener">${ic('ext')}${esc(r.n)}</a>`).join('')}</div>` : `<p class="muted">The A level Maths formula booklet is the same for Papers 1–3; the PMT topic pages link the official Pearson booklet.</p>`}</section>
      ${courseVids(cid) ? `<section><h2>Videos by topic</h2>${courseVids(cid)}</section>` : ''}
      <section><h2>Video channels</h2>${vidList(cid)}</section>`;
  }
  app.innerHTML = `<div class="crumbs"><a href="#courses">Courses</a>›<span>${esc(c.name)}</span></div>
    <p class="eyebrow">${esc(c.code)}</p><h1>${esc(c.name)}</h1>
    <nav class="tabs" aria-label="Course sections">${tabs.map(([k, l, nn]) => `<a href="#${k === 'topics' ? 'c' : k === 'papers' ? 'cp' : k === 'practice' ? 'cx' : 'cr'}-${cid}" ${k === tab ? 'aria-current="page"' : ''}>${l}${nn !== '' ? `<span class="n">${nn}</span>` : ''}</a>`).join('')}</nav>
    ${body}`;
  $$('[data-spec]').forEach(b => b.onclick = () => { S.settings.paperSpec = b.dataset.spec; save(); pageCourse(cid, 'papers'); });
  bindItems(app);
}

function drillCard(d){
  const g = d.items.filter(it => D.res[it.id] === 'g').length;
  return `<a class="tcard" href="#drill-${d.key}"><div class="top"><h4>${esc(d.name)}</h4></div><div class="bar"><i style="width:${Math.round(100 * g / d.items.length)}%"></i></div><span class="muted" style="font-size:.8rem">${g}/${d.items.length} correct</span></a>`;
}

function pageTopic(cid, tid){
  const c = CBY[cid]; if (!c) return pageHome();
  const list = byT[cid + '/' + tid] || [];
  const exam = list.filter(x => x.s === 'exam'), prac = list.filter(x => x.s === 'prac');
  const v = S.conf[cid + '/' + tid] || '';
  const vis = visFor(cid, tid);
  const drills = cid === 'pure' ? DR.filter(d => DRILL_TOPIC[d.key] === tid) : [];
  const idx = (TOP[cid] || []).findIndex(x => x[0] === tid);
  const prev = TOP[cid][idx - 1], next = TOP[cid][idx + 1];
  const order = g => /2021/.test(g) ? 0 : /2018/.test(g) ? 1 : /Mr Further/.test(g) ? 2 : /chapter/.test(g) ? 0 : /Older/.test(g) ? 4 : 3;
  const examS = exam.slice().sort((a, b) => order(a.g) - order(b.g));
  app.innerHTML = `<div class="crumbs"><a href="#courses">Courses</a>›<a href="#c-${cid}">${esc(c.name)}</a>›<span>${esc(tname(cid, tid))}</span></div>
   <div class="tp-head"><div><p class="eyebrow">${esc(c.code)} · Topic ${idx + 1}</p><h1>${esc(tname(cid, tid))}</h1></div>
     <div><div class="eyebrow" style="margin-bottom:6px">How confident are you?</div><div class="conf" role="group" aria-label="Confidence">${[['r', 'Not yet'], ['a', 'Getting there'], ['g', 'Confident']].map(([k, l]) => `<button class="${k}" data-conf="${k}" aria-pressed="${v === k}">${l}</button>`).join('')}</div></div></div>
   <div class="jump">${examS.length ? '<a class="btn sm" href="#" data-jump="sx">Exam questions</a>' : ''}${prac.length || drills.length ? '<a class="btn sm" href="#" data-jump="sp">Practice</a>' : ''}${vis.length ? '<a class="btn sm" href="#" data-jump="sv">Visualise</a>' : ''}<a class="btn sm" href="#" data-jump="sw">Videos</a></div>
   ${pcount(cid, tid) ? `<section><a class="pbanner" href="#px-${cid}-${tid}"><span class="ic">${ic('practice')}</span><span><b>${pcount(cid, tid)} practice questions</b><span>Whole exam questions with their mark schemes – mark yourself</span></span><span class="go">Start →</span></a></section>` : ''}
   ${vis.length ? `<section id="sv"><h2>Visualise it</h2><div class="grid g2">${vis.map(visCard).join('')}</div></section>` : ''}
   ${examS.length ? `<section id="sx"><div class="sec-head"><h2>Exam questions</h2><span class="muted">Real past-paper questions grouped by topic</span></div>${groupBlocks(examS, {openN: 2, sub: it => it.x?.yr ? esc(it.x.yr) : (it.x?.cat ? esc(it.x.cat) : '')})}</section>` : ''}
   ${drills.length || prac.length ? `<section id="sp"><h2>Practice</h2>${drills.length ? `<div class="grid g4" style="margin-bottom:14px">${drills.map(drillCard).join('')}</div>` : ''}${prac.length ? groupBlocks(prac, {openN: 1}) : ''}</section>` : ''}
   ${!examS.length && !prac.length ? `<div class="empty" style="margin-top:20px">No topic packs for this one – head to <a href="#cp-${cid}">${esc(c.name)} papers</a> for full papers.</div>` : ''}
   <section id="sw"><h2>Videos</h2>${topicVids(cid, tid).length ? `<div class="vids tv" style="margin-bottom:16px">${topicVids(cid, tid).map(vidCard).join('')}</div>` : ''}${furtherVids(cid, tid).length ? `<div style="margin-bottom:16px">${furtherBlock(furtherVids(cid, tid), topicVids(cid, tid).length ? 4 : 0)}</div>` : ''}${topicVids(cid, tid).length || furtherVids(cid, tid).length ? '<h3 style="margin:4px 0 8px;font-size:1rem">Full channels</h3>' : ''}${vidList(cid)}</section>
   <div class="row" style="justify-content:space-between;margin-top:28px">${prev ? `<a class="btn" href="#t-${cid}-${prev[0]}">← ${esc(prev[1])}</a>` : '<span></span>'}${next ? `<a class="btn" href="#t-${cid}-${next[0]}">${esc(next[1])} →</a>` : ''}</div>`;
  $$('[data-conf]').forEach(b => b.onclick = () => { const k = cid + '/' + tid; S.conf[k] = S.conf[k] === b.dataset.conf ? '' : b.dataset.conf; save(); $$('[data-conf]').forEach(x => x.setAttribute('aria-pressed', S.conf[k] === x.dataset.conf)); });
  $$('[data-jump]').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.jump)?.scrollIntoView({behavior: 'smooth'}); });
  bindItems(app);
}

function pagePapers(){
  app.innerHTML = `<p class="eyebrow">Papers & tests</p><h1>Past papers</h1><p class="lead">Pick a course. Every paper has its question paper, mark scheme and model answers or solutions where they exist. Use “Time it” to sit it under exam conditions and log your score.</p>
   <section><h2>A level Maths</h2><div class="grid g3">${COURSES.filter(c => c.q === 'maths').map(c => paperCard(c)).join('')}</div></section>
   <section><h2>Further Maths</h2><div class="grid g4">${COURSES.filter(c => c.q === 'further').map(c => paperCard(c)).join('')}</div></section>`;
}
function paperCard(c){
  const tests = (byC[c.id] || []).filter(x => x.s === 'test'), cur = tests.filter(x => x.x.spec === 'cur');
  const tried = tests.filter(x => S.scores[x.i]?.length).length;
  return `<a class="ccard" href="#cp-${c.id}"><span class="code">${esc(c.code)}</span><h3>${esc(c.name)}</h3><div class="meta"><span>${cur.length} current-spec</span>·<span>${tests.length} total</span>${tried ? `·<span>${tried} attempted</span>` : ''}</div></a>`;
}

/* ---------------- timed runner ---------------- */
let TIMER = null;
function pageRun(id){
  const it = IBY[id]; if (!it) return pageHome();
  const c = CBY[it.c];
  const mins = it.x?.mins || 90, marks = it.x?.marks || 75;
  clearInterval(TIMER);
  let T = {left: mins * 60, running: false, started: null};
  const fmt = s => { const neg = s < 0; s = Math.abs(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (neg ? '+' : '') + (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const hist = (S.scores[id] || []).slice().reverse();
  app.innerHTML = `<div class="crumbs"><a href="#cp-${it.c}">${esc(c?.name || '')} papers</a>›<span>${esc(it.g)}</span></div>
   <p class="eyebrow">${esc(it.g)}</p><h1>${esc(it.n)}</h1>
   <div class="runner" style="margin-top:20px">
    <div class="card">
      <div class="row" style="justify-content:space-between"><span class="eyebrow">Time allowed · ${mins} min${it.x?.spec === 'old' || it.x?.spec === 'extra' || it.x?.spec === 'ial' ? ' (typical)' : ''}</span><span class="chip">${marks} marks</span></div>
      <div class="clock" id="clock" aria-live="off">${fmt(T.left)}</div>
      <div class="row" style="margin-top:16px"><button class="btn primary" id="go">${ic('play')}Start</button><button class="btn" id="reset">Reset</button>
        <label class="field" style="flex-direction:row;align-items:center;gap:6px">Minutes <input type="number" id="mins" value="${mins}" min="5" max="300" style="width:80px"></label></div>
      <div class="docs" style="margin-top:18px">${it.d.map(([k, u]) => `<a class="doc ${DOCC[k] || ''}" href="${esc(url(u))}" target="_blank" rel="noopener" data-open="${it.i}">${ic('ext')}${DOCN[k] || k}</a>`).join('')}</div>
      <p class="muted" style="font-size:.86rem;margin-top:14px">Open the question paper, start the clock, and only open the mark scheme when time is up. The timer keeps counting into overtime (shown in red) so you can see how far over you went.</p>
    </div>
    <div class="card">
      <h3>Log your score</h3>
      <form id="scoreform" class="row" style="margin-top:12px;align-items:end">
        <label class="field">Score<input type="number" id="sc" min="0" required style="width:90px"></label>
        <label class="field">Out of<input type="number" id="of" value="${marks}" min="1" style="width:90px"></label>
        <button class="btn primary">Save</button>
      </form>
      ${hist.length ? `<table class="hist" style="margin-top:14px"><thead><tr><th>Date</th><th>Score</th><th>%</th><th>Time</th></tr></thead><tbody>${hist.map(h => `<tr><td>${new Date(h.at).toLocaleDateString()}</td><td>${h.s}/${h.m}</td><td>${Math.round(100 * h.s / h.m)}%</td><td>${h.t ? Math.round(h.t / 60) + ' min' : '–'}</td></tr>`).join('')}</tbody></table>` : '<p class="muted" style="font-size:.88rem;margin-top:12px">No attempts yet.</p>'}
    </div>
   </div>`;
  const clock = $('#clock');
  const draw = () => { clock.textContent = fmt(Math.round(T.left)); clock.classList.toggle('over', T.left < 0); };
  let used = 0, last = 0;
  $('#go').onclick = () => {
    if (T.running) { T.running = false; clearInterval(TIMER); $('#go').innerHTML = ic('play') + 'Resume'; return; }
    T.running = true; last = Date.now(); $('#go').textContent = 'Pause';
    TIMER = setInterval(() => { const now = Date.now(); const dt = (now - last) / 1000; last = now; T.left -= dt; used += dt; draw(); if (!document.body.contains(clock)) clearInterval(TIMER); }, 250);
  };
  $('#reset').onclick = () => { clearInterval(TIMER); T.running = false; T.left = (+$('#mins').value || mins) * 60; used = 0; $('#go').innerHTML = ic('play') + 'Start'; draw(); };
  $('#mins').onchange = () => { if (!T.running && used === 0) { T.left = (+$('#mins').value || mins) * 60; draw(); } };
  $('#scoreform').onsubmit = e => { e.preventDefault(); const s = +$('#sc').value, m = +$('#of').value || marks; if (isNaN(s) || s < 0 || s > m) { toast('Score must be between 0 and ' + m); return; }
    (S.scores[id] = S.scores[id] || []).push({s, m, at: Date.now(), t: Math.round(used)}); S.done[id] = S.done[id] || Date.now(); touchDay(); save(); toast('Score saved'); pageRun(id); };
  bindItems(app);
}

/* ---------------- search ---------------- */
const Q = {q: ''};
const SIDX = ITEMS.map(it => (it.n + ' ' + it.g + ' ' + (CBY[it.c]?.name || 'beyond a level') + ' ' + (CBY[it.c]?.code || '') + ' ' + (it.t ? tname(it.c, it.t) : '') + ' ' + it.src + ' ' + (it.x?.cat || '')).toLowerCase());
const TIDX = []; COURSES.forEach(c => (TOP[c.id] || []).forEach(([t, n]) => TIDX.push({c: c.id, t, n, s: (n + ' ' + c.name).toLowerCase()})));
const SYN = {fm1: 'further mechanics 1', fm2: 'further mechanics 2', fp1: 'further pure 1', fp2: 'further pure 2', fs1: 'further statistics 1', fs2: 'further statistics 2', cp1: 'core pure 1', cp2: 'core pure 2', ms: 'mark scheme', qp: 'question', ial: 'international', nov: 'november', oct: 'october', jan: 'january'};
function search(q){
  const words = q.toLowerCase().split(/\s+/).filter(Boolean).map(w => SYN[w] || w);
  if (!words.length) return {items: [], topics: [], vis: [], drills: []};
  const m = s => words.every(w => w.split(' ').every(p => s.includes(p)));
  return {items: ITEMS.filter((it, i) => m(SIDX[i])).slice(0, 150), topics: TIDX.filter(t => m(t.s)).slice(0, 12), vis: Object.entries(VIS).filter(([, v]) => m((v.name + ' ' + v.desc).toLowerCase())),
          drills: DR.filter(d => m(d.name.toLowerCase()))};
}
function pageSearch(){
  app.innerHTML = `<h1>Search</h1><form class="bigsearch" id="sform" role="search" style="margin:14px 0 6px;max-width:720px"><input type="search" id="sq" value="${esc(Q.q)}" placeholder="Topic, paper, year or module…" aria-label="Search"><button class="btn primary">Search</button></form><div id="sres"></div>`;
  const run = () => {
    Q.q = $('#sq').value; const r = search(Q.q);
    const total = r.items.length + r.topics.length + r.vis.length + r.drills.length;
    $('#sres').innerHTML = !Q.q.trim() ? '<p class="muted">Search 3,400+ papers, packs and worksheets. Try a topic (“polar”), a paper (“June 2024 CP2”) or a source (“madas fm1”).</p>' :
      !total ? '<div class="empty">No matches. Try fewer words.</div>' :
      (r.topics.length ? `<section><h2>Topics</h2><div class="grid g3">${r.topics.map(t => `<a class="tcard" href="#t-${t.c}-${t.t}"><div class="top"><h4>${esc(t.n)}</h4><span class="chip">${esc(CBY[t.c].name)}</span></div></a>`).join('')}</div></section>` : '') +
      (r.vis.length ? `<section><h2>Visualisers</h2><div class="grid g2">${r.vis.map(visCard).join('')}</div></section>` : '') +
      (r.drills.length ? `<section><h2>Skill drills</h2><div class="grid g4">${r.drills.map(drillCard).join('')}</div></section>` : '') +
      (r.items.length ? `<section><h2>Papers & packs <span class="muted" style="font-size:1rem">${r.items.length === 150 ? '150+' : r.items.length}</span></h2><div class="group"><div class="items" style="border:0">${r.items.map(it => itemRow(it, {sub: esc((CBY[it.c]?.name || 'Beyond A level') + ' · ' + it.g + (it.t ? ' · ' + tname(it.c, it.t) : ''))})).join('')}</div></div></section>` : '');
    bindItems($('#sres'));
  };
  $('#sform').onsubmit = e => { e.preventDefault(); run(); };
  let deb; $('#sq').oninput = () => { clearTimeout(deb); deb = setTimeout(run, 180); };
  run(); $('#sq').focus();
}
$('#tsearch').addEventListener('keydown', e => { if (e.key === 'Enter') { Q.q = e.target.value; if (location.hash === '#search') pageSearch(); else location.hash = 'search'; } });

/* ---------------- drills ---------------- */
function pageDrills(){
  const areas = [...new Set(DR.map(d => d.area))];
  app.innerHTML = `<p class="eyebrow">Practice</p><h1>Skill drills</h1><p class="lead">${DR.length} core techniques, ${DR.reduce((a, d) => a + d.items.length, 0)} questions with full worked solutions (10% easy, 70% medium, 20% hard). Every answer was checked by computer algebra. Work on paper, reveal the solution a step at a time, then mark yourself.</p>
   ${areas.map(a => `<section><h2>${esc(a)}</h2><div class="grid g4">${DR.filter(d => d.area === a).map(drillCard).join('')}</div></section>`).join('')}`;
}
let V = null;
function pageDrill(key){
  const sk = DBY[key]; if (!sk) return pageDrills();
  const pos = D.pos[key] || {lvl: 'all', mode: 'order'};
  V = {sk, lvl: pos.lvl, mode: pos.mode, list: [], i: 0, shown: 0, full: false};
  buildDrill(); V.i = Math.min(pos.i || 0, Math.max(0, V.list.length - 1)); renderDrill();
}
function buildDrill(){
  let L = V.sk.items.filter(it => V.lvl === 'all' || it.d === V.lvl);
  if (V.mode === 'revisit') L = L.filter(it => D.res[it.id] === 'r');
  if (V.mode === 'new') L = L.filter(it => !D.res[it.id]);
  if (V.mode === 'shuffle') { L = L.slice(); for (let k = L.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [L[k], L[j]] = [L[j], L[k]]; } }
  V.list = L; V.i = 0; V.shown = 0; V.full = false;
}
function renderDrill(){
  const sk = V.sk, it = V.list[V.i], LV = {easy: 'Easy', medium: 'Medium', hard: 'Hard'}, CL = {easy: 'g', medium: 'a', hard: 'r'};
  const seg = (name, opts, cur) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([v, l]) => `<button data-${name}="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
  let body;
  if (!it) body = `<div class="empty">${V.mode === 'revisit' ? 'Nothing to revisit here – nice work.' : V.mode === 'new' ? 'You have tried every question in this set.' : 'No questions match this filter.'}</div>`;
  else {
    const steps = it.s.slice(0, V.full ? it.s.length : V.shown), done = V.full || V.shown >= it.s.length, m = D.res[it.id];
    body = `<article class="qcard"><div class="qhead"><span class="eyebrow">Q${V.i + 1} of ${V.list.length} · ${it.id}</span><span class="chip ${CL[it.d]}">${LV[it.d]}</span><span style="margin-left:auto;font-weight:600;font-size:.84rem;color:${m === 'g' ? 'var(--good)' : m === 'r' ? 'var(--bad)' : 'var(--muted)'}">${m === 'g' ? '✓ Got it' : m === 'r' ? '↻ To revisit' : ''}</span></div>
      <div class="qtext">${it.q}</div>${steps.length ? `<ol class="steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}${done ? `<div class="answer"><b>Answer:</b> ${it.a}</div>` : ''}
      <div class="row" style="margin-top:18px">${done ? '' : '<button class="btn primary" id="step">Next step</button><button class="btn" id="full">Full solution</button>'}<button class="btn" id="got" style="border-color:var(--good);color:var(--good)">✓ Got it</button><button class="btn" id="miss" style="border-color:var(--bad);color:var(--bad)">↻ Revisit later</button></div>
      <div class="row" style="justify-content:space-between;margin-top:14px"><button class="btn" id="prev" ${V.i ? '' : 'disabled'}>← Previous</button><button class="btn" id="next" ${V.i < V.list.length - 1 ? '' : 'disabled'}>Next →</button></div></article>
      <div class="dots">${V.list.map((q, k) => `<button data-go="${k}" class="${D.res[q.id] || ''}${k === V.i ? ' cur' : ''}" aria-label="Question ${k + 1}">${k + 1}</button>`).join('')}</div>`;
  }
  const g = sk.items.filter(x => D.res[x.id] === 'g').length;
  app.innerHTML = `<div class="crumbs"><a href="#drills">Skill drills</a>›<span>${esc(sk.name)}</span></div><p class="eyebrow">${esc(sk.area)} · ${g}/${sk.items.length} correct</p><h1>${esc(sk.name)}</h1>
    <div class="filters" style="margin-top:14px">${seg('lvl', [['all', 'All'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']], V.lvl)}${seg('mode', [['order', 'In order'], ['shuffle', 'Shuffle'], ['new', 'Not tried'], ['revisit', 'Revisit']], V.mode)}</div>${body}`;
  math(app);
  const on = (id, f) => { const el = document.getElementById(id); if (el) el.onclick = f; };
  on('step', () => { V.shown++; renderDrill(); }); on('full', () => { V.full = true; renderDrill(); });
  on('got', () => mark('g')); on('miss', () => mark('r')); on('prev', () => go(V.i - 1)); on('next', () => go(V.i + 1));
  $$('[data-go]').forEach(b => b.onclick = () => go(+b.dataset.go));
  $$('[data-lvl]').forEach(b => b.onclick = () => { V.lvl = b.dataset.lvl; buildDrill(); remember(); renderDrill(); });
  $$('[data-mode]').forEach(b => b.onclick = () => { V.mode = b.dataset.mode; buildDrill(); remember(); renderDrill(); });
}
const remember = () => { D.pos[V.sk.key] = {lvl: V.lvl, mode: V.mode, i: V.i}; save(); };
function go(k){ if (!V || k < 0 || k >= V.list.length) return; V.i = k; V.shown = 0; V.full = false; remember(); renderDrill(); window.scrollTo({top: 0}); }
function mark(v){ const it = V.list[V.i]; if (!it) return; D.res[it.id] = v; touchDay(); save();
  if ((V.mode === 'revisit' && v === 'g') || V.mode === 'new') { V.list.splice(V.i, 1); V.i = Math.min(V.i, V.list.length - 1); V.shown = 0; V.full = false; remember(); renderDrill(); return; }
  if (V.i < V.list.length - 1) go(V.i + 1); else renderDrill(); }
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#drill-') || !V || e.target.closest('input,select,textarea')) return;
  if (e.key === 'ArrowRight') go(V.i + 1); else if (e.key === 'ArrowLeft') go(V.i - 1);
  else if (e.key === ' ' && document.getElementById('step')) { e.preventDefault(); V.shown++; renderDrill(); }
});

/* ---------------- visualisers ---------------- */
let unmount = null;
const GORD = ['Pure', 'Matrices & vectors', 'Complex numbers', 'Further calculus', 'Further Pure', 'Statistics', 'Further Statistics', 'Mechanics', 'Further Mechanics', 'Decision'];
function pageVisGallery(){
  const groups = {};
  Object.entries(VIS).forEach(([id, v]) => (groups[v.group] = groups[v.group] || []).push([id, v]));
  app.innerHTML = `<p class="eyebrow">See the maths move</p><h1>Visualisers</h1><p class="lead">Interactive models for the topics that are hardest to picture. Drag, rotate and change the numbers. Each one also appears on its topic page.</p>
    ${Object.entries(groups).sort((a, b) => GORD.indexOf(a[0]) - GORD.indexOf(b[0])).map(([g, L]) => `<section><h2>${esc(g)}</h2><div class="vgal">${L.map(visCard).join('')}</div></section>`).join('')}`;
}
function pageVis(id){
  const v = VIS[id]; if (!v) return pageVisGallery();
  const links = (v.topics || []).filter(([c, t]) => CBY[c] && t !== '*').map(([c, t]) => `<a class="chip brand" href="#t-${c}-${t}" style="text-decoration:none">${esc(CBY[c].name)} · ${esc(tname(c, t))}</a>`).join('');
  app.innerHTML = `<div class="crumbs"><a href="#vis">Visualisers</a>›<span>${esc(v.name)}</span></div><h1>${esc(v.name)}</h1><p class="lead">${esc(v.desc)}</p>
    ${links ? `<div class="row" style="gap:6px;margin-top:10px">${links}</div>` : ''}<div id="visroot" style="margin-top:18px"></div>`;
  try { unmount = v.mount($('#visroot'), {math}) || null; } catch(err) { $('#visroot').innerHTML = '<div class="empty">This visualiser could not start in this browser.</div>'; console.error(err); }
}

/* ---------------- progress ---------------- */
function pageProgress(){
  const rows = COURSES.map(c => {
    const L = byC[c.id] || [], tests = L.filter(x => x.s === 'test'), att = tests.filter(x => S.scores[x.i]?.length);
    const pcts = att.map(x => { const b = best(x.i); return b.s / b.m; });
    const avg = pcts.length ? Math.round(100 * pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
    const cf = confTally(c.id), dn = L.filter(x => S.done[x.i]).length;
    return {c, dn, n: L.length, att: att.length, avg, cf};
  });
  const weak = []; COURSES.forEach(c => (TOP[c.id] || []).forEach(([t, n]) => { if (S.conf[c.id + '/' + t] === 'r') weak.push({c, t, n}); }));
  const recentScores = []; Object.entries(S.scores).forEach(([id, h]) => h.forEach(x => recentScores.push({id, ...x})));
  recentScores.sort((a, b) => b.at - a.at);
  app.innerHTML = `<p class="eyebrow">Your work</p><h1>Progress</h1><p class="lead">Saved in this browser on this device. Use “Copy backup” to move it to another device.</p>
   <section><h2>By course</h2><div class="group"><div class="items" style="border:0">${rows.map(r => `<div class="item"><div class="nm"><a href="#c-${r.c.id}" style="text-decoration:none;font-weight:700">${esc(r.c.name)}</a><small>${r.dn}/${r.n} packs & papers done · ${r.att} papers scored${r.avg != null ? ' · average best ' + r.avg + '%' : ''}</small></div>
     <span class="chip g">${r.cf.g} confident</span><span class="chip a">${r.cf.a} getting there</span><span class="chip r">${r.cf.r} not yet</span></div>`).join('')}</div></div></section>
   <section><h2>Topics to work on</h2>${weak.length ? `<div class="grid g3">${weak.map(w => `<a class="tcard" href="#t-${w.c.id}-${w.t}"><div class="top"><h4>${esc(w.n)}</h4><span class="rag r"></span></div><span class="muted" style="font-size:.82rem">${esc(w.c.name)}</span></a>`).join('')}</div>` : '<div class="empty">Rate topics “Not yet” on their topic page and they will show up here.</div>'}</section>
   <section><h2>Recent scores</h2>${recentScores.length ? `<div class="card"><table class="hist"><thead><tr><th>Paper</th><th>Date</th><th>Score</th><th>%</th></tr></thead><tbody>${recentScores.slice(0, 25).map(r => { const it = IBY[r.id]; return `<tr><td><a href="#run-${r.id}">${esc(it ? (CBY[it.c]?.name || '') + ' · ' + it.n : r.id)}</a><br><span class="muted" style="font-size:.78rem">${esc(it?.g || '')}</span></td><td>${new Date(r.at).toLocaleDateString()}</td><td>${r.s}/${r.m}</td><td>${Math.round(100 * r.s / r.m)}%</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty">No timed papers yet – open any paper and press “Time it”.</div>'}</section>
   <section><h2>Backup</h2><div class="card"><div class="row"><button class="btn" id="copyb">Copy backup</button><button class="btn" id="restb">Restore from backup</button></div><textarea id="bk" placeholder="Paste a backup here, then press Restore" style="margin-top:10px"></textarea></div></section>`;
  $('#copyb').onclick = async () => { const txt = JSON.stringify({v: 1, S, D}); $('#bk').value = txt; try { await navigator.clipboard.writeText(txt); toast('Backup copied'); } catch(e) { $('#bk').select(); toast('Select the text and copy it'); } };
  $('#restb').onclick = () => { try { const o = JSON.parse($('#bk').value); if (!o.S) throw 0; S = Object.assign(S, o.S); D = Object.assign(D, o.D || {}); save(); toast('Progress restored'); pageProgress(); } catch(e) { toast('That backup could not be read'); } };
}

/* ---------------- practice questions (whole exam questions + mark schemes, self-marked) ---------------- */
const QBASE = 'img/q/', QALT = 'https://tanimooo.github.io/trainTanmay-maths/q/';
const PR = window.PRACTICE || {packs: [], q: []};
const PQC = {};
const PQ = PR.q.map(([p, n, mk, qi, mi, qt, qc]) => { const pk = PR.packs[p]; PQC[p] = (PQC[p] || 0) + 1; return {id: pk[0] + '-' + PQC[p], pk: pk[0], c: qc || pk[1], t: qt || pk[2], pn: pk[3], src: pk[4], yr: pk[5], n, mk, qi, mi}; });
const CIDX = Object.fromEntries(COURSES.map((c, i) => [c.id, i])), PTIDX = q => (TOP[q.c] || []).findIndex(x => x[0] === q.t);
PQ.sort((a, b) => (CIDX[a.c] - CIDX[b.c]) || (PTIDX(a) - PTIDX(b)));
const PQBY = Object.fromEntries(PQ.map(q => [q.id, q]));
S.prac = S.prac || {};
const PF = () => { const f = S.settings.prac = Object.assign({cs: [], ts: [], srcs: [], st: 'all', n: 10, ord: 'rand'}, S.settings.prac || {}); ['cs', 'ts', 'srcs'].forEach(k => { if (!Array.isArray(f[k])) f[k] = []; }); return f; };
const pscore = q => { const r = S.prac[q.id]; return r && r.of ? r.m / r.of : null; };
function pfilter(f = PF()){
  return PQ.filter(q => (!f.cs.length || f.cs.includes(q.c)) && (!f.ts.length || f.ts.includes(q.c + '/' + q.t) || !f.ts.some(k => k.startsWith(q.c + '/'))) && (!f.srcs.length || f.srcs.includes(q.src)) && (
    f.st === 'all' || (f.st === 'new' && !S.prac[q.id]) || (f.st === 'weak' && pscore(q) != null && pscore(q) < .6) || (f.st === 'flag' && S.prac[q.id]?.f)));
}
const qimg = (p, cls = '') => p ? `<div class="qimg ${cls}" style="aspect-ratio:${p[3]}/${p[2]};max-width:${Math.round(p[3] / 1.6 * 1.3)}px"><img src="${QBASE}${esc(p[0])}" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${QALT}${esc(p[0])}'}" alt="" decoding="async" style="width:${(p[4] / p[3] * 100).toFixed(3)}%;margin-top:-${(p[1] / p[3] * 100).toFixed(4)}%"></div>` : '';
const pcount = (c, t) => PQ.filter(q => q.c === c && (!t || q.t === t)).length;
function pstatus(q){ const r = S.prac[q.id]; if (!r || r.m == null) return r?.f ? '<span class="chip acc">Flagged</span>' : '';
  const s = r.of ? r.m / r.of : 0; return `<span class="chip ${s >= .8 ? 'g' : s >= .5 ? 'a' : 'r'}">${r.m}/${r.of}</span>${r.f ? ' <span class="chip acc">Flagged</span>' : ''}`; }
let PSET = null; try { PSET = JSON.parse(sessionStorage.getItem('tt-pset') || 'null'); } catch(e) {}
const savePset = () => { try { sessionStorage.setItem('tt-pset', JSON.stringify(PSET)); } catch(e) {} };

function pagePractice(pc, pt){
  const f = PF();
  if (pc !== undefined) { f.cs = [pc]; f.ts = pt ? [pc + '/' + pt] : []; save(); }
  const L = pfilter(f), tried = L.filter(q => S.prac[q.id]?.m != null), got = tried.reduce((a, q) => a + S.prac[q.id].m, 0), of = tried.reduce((a, q) => a + S.prac[q.id].of, 0);
  const courses = COURSES.filter(c => pcount(c.id));
  const srcs = [...new Set(PQ.filter(q => !f.cs.length || f.cs.includes(q.c)).map(q => q.src))];
  const setN = f.n === 'all' ? L.length : Math.min(+f.n, L.length);
  const done = (c, t) => PQ.filter(q => q.c === c && (!t || q.t === t) && S.prac[q.id]?.m != null).length;
  const allDone = PQ.filter(q => S.prac[q.id]?.m != null).length, pc_ = Math.round(100 * allDone / (PQ.length || 1));
  app.innerHTML = `<p class="eyebrow">Question bank</p><h1>Practice questions</h1>
    <div class="pstat card"><div><b>${allDone.toLocaleString()}</b><span> / ${PQ.length.toLocaleString()} questions done</span></div><div class="pbar"><i style="width:${pc_}%"></i></div><p class="muted">Whole exam questions with mark schemes. Pick what to practise, answer on paper, then mark yourself.</p></div>
    ${PSET && PSET.i < PSET.ids.length ? `<a class="pbanner" style="margin-top:16px" href="#q-${PSET.ids[PSET.i]}"><span class="ic">${ic('practice')}</span><span><b>Continue your set</b><span>Question ${PSET.i + 1} of ${PSET.ids.length}</span></span><span class="go">Resume →</span></a>` : ''}
    <div class="builder card">
      <div class="bstep"><h3>1 · Courses</h3><div class="chips">${courses.map(c => `<button class="fchip" data-c="${c.id}" aria-pressed="${f.cs.includes(c.id)}">${esc(c.name)} <span>${done(c.id)}/${pcount(c.id)}</span></button>`).join('')}</div>
        <p class="muted hint">${f.cs.length ? '' : 'None picked = everything.'}</p></div>
      ${f.cs.length ? `<div class="bstep"><h3>2 · Topics <span class="muted">(leave a course empty for all its topics)</span></h3>${f.cs.map(c => `<div class="tgrp"><b>${esc(CBY[c].name)}</b><div class="chips">${(TOP[c] || []).filter(([t]) => pcount(c, t)).map(([t, n]) => `<button class="fchip sm" data-t="${c}/${t}" aria-pressed="${f.ts.includes(c + '/' + t)}">${esc(n)} <span>${done(c, t)}/${pcount(c, t)}</span></button>`).join('')}</div></div>`).join('')}</div>` : ''}
      <div class="bstep brow">
        <div><h3>Source</h3><div class="chips">${srcs.map(s => `<button class="fchip sm" data-s="${esc(s)}" aria-pressed="${f.srcs.includes(s)}">${esc(s)}</button>`).join('')}</div></div>
        <div><h3>Questions</h3><div class="seg">${[['all', 'All'], ['new', 'Not tried'], ['weak', 'Under 60%'], ['flag', 'Flagged']].map(([k, l]) => `<button data-st="${k}" aria-pressed="${f.st === k}">${l}</button>`).join('')}</div></div>
        <div><h3>Set size</h3><div class="seg">${[5, 10, 20, 'all'].map(k => `<button data-n="${k}" aria-pressed="${String(f.n) === String(k)}">${k === 'all' ? 'All' : k}</button>`).join('')}</div></div>
        <div><h3>Order</h3><div class="seg">${[['rand', 'Shuffled'], ['seq', 'In order']].map(([k, l]) => `<button data-o="${k}" aria-pressed="${f.ord === k}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="row bfoot"><p class="muted" style="margin:0"><b style="color:var(--ink)">${L.length}</b> questions match · ${tried.length} attempted${of ? ` · <b style="color:var(--ink)">${Math.round(100 * got / of)}%</b> of marks` : ''}</p>
        <button class="btn primary" id="pstart" ${setN ? '' : 'disabled'}>Start a set of ${setN} →</button></div>
    </div>
    ${L.length ? '' : '<div class="empty" style="margin-top:16px">Nothing matches these filters.</div>'}`;
  const tog = (arr, v) => { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); };
  const re = () => { save(); const y = scrollY; pagePractice(); scrollTo(0, y); };
  $$('[data-c]').forEach(b => b.onclick = () => { tog(f.cs, b.dataset.c); f.ts = f.ts.filter(k => f.cs.includes(k.split('/')[0])); re(); });
  $$('[data-t]').forEach(b => b.onclick = () => { tog(f.ts, b.dataset.t); re(); });
  $$('[data-s]').forEach(b => b.onclick = () => { tog(f.srcs, b.dataset.s); re(); });
  $$('[data-st]').forEach(b => b.onclick = () => { f.st = b.dataset.st; re(); });
  $$('[data-n]').forEach(b => b.onclick = () => { f.n = b.dataset.n === 'all' ? 'all' : +b.dataset.n; re(); });
  $$('[data-o]').forEach(b => b.onclick = () => { f.ord = b.dataset.o; re(); });
  $('#pstart').onclick = () => { let ids = L.map(q => q.id); if (f.ord === 'rand') for (let k = ids.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [ids[k], ids[j]] = [ids[j], ids[k]]; }
    PSET = {ids: ids.slice(0, setN), i: 0, start: Date.now()}; savePset(); location.hash = 'q-' + PSET.ids[0]; };
}

function pageSetDone(){
  if (!PSET) return pagePractice();
  const qs = PSET.ids.map(id => PQBY[id]).filter(Boolean), done = qs.filter(q => S.prac[q.id]?.m != null), got = done.reduce((a, q) => a + S.prac[q.id].m, 0), of = done.reduce((a, q) => a + S.prac[q.id].of, 0);
  app.innerHTML = `<p class="eyebrow">Set complete</p><h1>${of ? Math.round(100 * got / of) + '%' : 'Done!'}</h1>
    <p class="lead">${got}/${of} marks across ${done.length} of ${qs.length} questions${PSET.start ? ` · ${Math.round((Date.now() - PSET.start) / 60000)} minutes` : ''}.</p>
    <div class="prow" style="margin-top:16px">${qs.map((q, k) => `<a class="pq" href="#q-${q.id}"><b>${k + 1}</b><span class="muted">${esc(tname(q.c, q.t))}</span>${pstatus(q)}</a>`).join('')}</div>
    <div class="row" style="margin-top:24px"><a class="btn primary" href="#practice">Build another set</a></div>`;
}

function pageQ(id){
  const q = PQBY[id]; if (!q) return pagePractice();
  const inSet = PSET && PSET.ids.includes(q.id); if (inSet) { PSET.i = PSET.ids.indexOf(q.id); savePset(); }
  let L = inSet ? PSET.ids.map(x => PQBY[x]) : pfilter(); if (!L.includes(q)) L = PQ.filter(x => x.pk === q.pk);
  const i = L.indexOf(q), prev = L[i - 1], next = L[i + 1], r = S.prac[q.id] || null, it = IBY[q.pk];
  const pdf = it ? (it.d.find(d => /QP/.test(d[0])) || it.d[0]) : null, mspdf = it ? it.d.find(d => d[0] === 'MS') : null;
  const max = q.mk || (r && r.of) || 0;
  app.innerHTML = `<div class="crumbs"><a href="#practice">Practice</a>›<a href="#px-${q.c}">${esc(CBY[q.c]?.name || q.c)}</a>›<a href="#px-${q.c}-${q.t}">${esc(tname(q.c, q.t))}</a>›<span>Q${q.n}</span></div>
    <div class="qhead"><div><p class="eyebrow">${inSet ? `Set · question ${i + 1} of ${L.length}` : `${esc(q.src)} · ${i + 1} of ${L.length}`}</p>${inSet ? `<div class="bar" style="margin:6px 0 10px;max-width:320px"><i style="width:${Math.round(100 * (i + 1) / L.length)}%"></i></div>` : ''}<h1>${esc(q.pn)} – Q${q.n}</h1></div>
      <div class="row"><span class="chip brand">${max ? max + ' marks' : 'marks not listed'}</span>${pstatus(q)}</div></div>
    <div class="qcard card">${qimg(q.qi)}</div>
    <div class="qbar">
      ${q.mi ? `<button class="btn primary" id="showms" aria-expanded="false">Show mark scheme <kbd>M</kbd></button>` : `<span class="muted">No mark scheme could be cut for this one${mspdf || pdf ? ` – <a href="${esc(url((mspdf || pdf)[1]))}" target="_blank" rel="noopener">open the full PDF</a>` : ''}.</span>`}
      <button class="btn" id="flag" aria-pressed="${!!r?.f}">${r?.f ? '★ Flagged' : '☆ Flag for later'}</button>
      ${pdf ? `<a class="btn" href="${esc(url(pdf[1]))}" target="_blank" rel="noopener">Full pack PDF ${ic('ext')}</a>` : ''}
    </div>
    <div id="msbox" hidden>
      <h2 style="margin:22px 0 10px">Mark scheme</h2><div class="qcard card ms">${qimg(q.mi)}</div>
      <div class="markbox card"><h3 style="margin:0 0 10px">How many marks did you get?</h3>
        ${max && max <= 25 ? `<div class="marks" role="group" aria-label="Marks">${[...Array(max + 1)].map((_, k) => `<button data-m="${k}" aria-pressed="${r && r.m === k}">${k}</button>`).join('')}</div>`
          : `<div class="row"><input id="mgot" type="number" min="0" value="${r ? r.m : ''}" style="width:80px"> out of <input id="mof" type="number" min="1" value="${max || (r && r.of) || ''}" style="width:80px"><button class="btn primary sm" id="msave">Save</button></div>`}
        <p class="muted" style="margin:10px 0 0;font-size:.85rem">Marked by you against the official scheme – nothing is sent anywhere.</p></div>
    </div>
    <div class="row" style="justify-content:space-between;margin-top:24px">
      ${prev ? `<a class="btn" href="#q-${prev.id}">← Previous</a>` : '<span></span>'}
      <div class="row"><button class="btn" id="qrand">Random</button>${next ? `<a class="btn primary" href="#q-${next.id}">Next →</a>` : inSet ? `<a class="btn primary" href="#pset-done">Finish set →</a>` : `<a class="btn" href="#practice">Back to list</a>`}</div>
    </div>`;
  const box = $('#msbox'), sb = $('#showms');
  const toggle = () => { if (!sb) return; box.hidden = !box.hidden; sb.setAttribute('aria-expanded', !box.hidden); sb.innerHTML = (box.hidden ? 'Show' : 'Hide') + ' mark scheme <kbd>M</kbd>'; if (!box.hidden) box.scrollIntoView({behavior: 'smooth', block: 'start'}); };
  if (sb) sb.onclick = toggle;
  const rec = (m, of) => { S.prac[q.id] = Object.assign(S.prac[q.id] || {}, {m, of, t: Date.now()}); touchDay(); save(); toast(`Saved ${m}/${of}`); $$('[data-m]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.m === m)); };
  $$('[data-m]').forEach(b => b.onclick = () => rec(+b.dataset.m, max));
  const ms = $('#msave'); if (ms) ms.onclick = () => { const m = +$('#mgot').value, of = +$('#mof').value; if (of > 0 && m >= 0 && m <= of) rec(m, of); else toast('Enter marks between 0 and the total'); };
  $('#flag').onclick = () => { const x = S.prac[q.id] = S.prac[q.id] || {}; x.f = !x.f; if (!x.f && x.m == null) delete S.prac[q.id]; save(); pageQ(id); };
  $('#qrand').onclick = () => { location.hash = 'q-' + L[Math.floor(Math.random() * L.length)].id; };
  QK = e => { if (e.target.closest('input,select,textarea') || e.metaKey || e.ctrlKey) return; if (e.key === 'm' || e.key === 'M') toggle(); else if (e.key === 'ArrowRight' && next) location.hash = 'q-' + next.id; else if (e.key === 'ArrowLeft' && prev) location.hash = 'q-' + prev.id; };
}
let QK = null;
document.addEventListener('keydown', e => { if (location.hash.startsWith('#q-') && QK) QK(e); });

function practiceProgress(){
  const by = {}; Object.entries(S.prac).forEach(([id, r]) => { const q = PQBY[id]; if (!q || r.m == null) return; const b = by[q.c] = by[q.c] || {n: 0, m: 0, of: 0}; b.n++; b.m += r.m; b.of += r.of; });
  const rows = COURSES.filter(c => by[c.id]);
  return `<section><h2>Practice questions</h2>${rows.length ? `<div class="grid g4">${rows.map(c => { const b = by[c.id], p = Math.round(100 * b.m / b.of); return `<a class="tcard" href="#px-${c.id}"><div class="top"><h4>${esc(c.name)}</h4></div><div class="bar"><i style="width:${p}%"></i></div><span class="muted" style="font-size:.8rem">${b.n} questions · ${p}% of marks</span></a>`; }).join('')}</div>` : '<p class="muted">No practice questions marked yet. <a href="#practice">Start practising</a>.</p>'}</section>`;
}

/* ---------------- router ---------------- */
function route(){
  if (unmount) { try { unmount(); } catch(e) {} unmount = null; }
  clearInterval(TIMER);
  const h = location.hash.slice(1) || 'home';
  let m, nav = 'home';
  if (h === 'home') pageHome();
  else if (h === 'courses') { nav = 'courses'; pageCourses(); }
  else if ((m = h.match(/^(c|cp|cx|cr)-(\w+)$/))) { nav = m[1] === 'cp' ? 'papers' : 'courses'; pageCourse(m[2], {c: 'topics', cp: 'papers', cx: 'practice', cr: 'resources'}[m[1]]); }
  else if ((m = h.match(/^t-(\w+?)-(\w+)$/))) { nav = 'courses'; pageTopic(m[1], m[2]); }
  else if (h === 'papers') { nav = 'papers'; pagePapers(); }
  else if ((m = h.match(/^run-(\w+)$/))) { nav = 'papers'; pageRun(m[1]); }
  else if (h === 'drills') { nav = 'drills'; pageDrills(); }
  else if ((m = h.match(/^drill-(\w+)$/))) { nav = 'drills'; pageDrill(m[1]); }
  else if (h === 'vis') { nav = 'vis'; pageVisGallery(); }
  else if ((m = h.match(/^vis-([\w-]+)$/))) { nav = 'vis'; pageVis(m[1]); }
  else if (h === 'practice') { nav = 'practice'; pagePractice(); }
  else if (h === 'pset-done') { nav = 'practice'; pageSetDone(); }
  else if ((m = h.match(/^px-(\w+?)(?:-(\w+))?$/))) { nav = 'practice'; pagePractice(m[1], m[2]); }
  else if ((m = h.match(/^q-(\w+-\d+)$/))) { nav = 'practice'; pageQ(m[1]); }
  else if (h === 'videos') { nav = ''; pageVideos(); }
  else if (h === 'progress') { nav = 'progress'; pageProgress(); const h1 = $('h1', app); if (h1) h1.insertAdjacentHTML('afterend', practiceProgress()); }
  else if (h === 'search') { nav = ''; pageSearch(); }
  else pageHome();
  renderNav(nav);
  if (!h.startsWith('drill-') || !V) window.scrollTo({top: 0});
  const t = $('h1', app); document.title = (t && h !== 'home' ? t.textContent + ' – ' : '') + 'TrainTanmay Maths';
}
window.addEventListener('hashchange', route);
route();
})();
