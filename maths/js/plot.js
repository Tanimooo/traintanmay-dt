/* Shared helpers for the 2D visualisers: a pannable, zoomable coordinate plane + small UI builders. */
(function(){
'use strict';
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function colors(){
  return {bg: css('--surface'), grid: css('--line'), axis: css('--muted'), ink: css('--ink'), ink2: css('--ink-2'), brand: css('--brand'), accent: css('--accent'),
          blue: css('--blue'), warn: css('--warn'), bad: css('--bad'), good: css('--good'), soft: css('--brand-soft'), accSoft: css('--accent-soft'), muted: css('--muted')};
}
function niceStep(range){ const raw = range / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; }

function makePlot(stage, opt = {}){
  const cv = document.createElement('canvas'); stage.appendChild(cv);
  const ctx = cv.getContext('2d');
  const P = {cx: opt.cx || 0, cy: opt.cy || 0, span: opt.span || 10, ctx, cv, w: 0, h: 0, dpr: 1, C: colors(), opt, equal: opt.equal !== false, yspan: opt.yspan || null};
  P.scale = () => P.w / P.span;
  P.sy = () => P.yspan ? P.h / P.yspan : P.scale();
  P.toS = (x, y) => [P.w / 2 + (x - P.cx) * P.scale(), P.h / 2 - (y - P.cy) * P.sy()];
  P.toW = (px, py) => [P.cx + (px - P.w / 2) / P.scale(), P.cy - (py - P.h / 2) / P.sy()];
  P.bounds = () => { const [x0, y1] = P.toW(0, 0), [x1, y0] = P.toW(P.w, P.h); return {x0, x1, y0, y1}; };
  function resize(){ const r = stage.getBoundingClientRect(); P.dpr = Math.min(window.devicePixelRatio || 1, 2); P.w = r.width; P.h = r.height; cv.width = r.width * P.dpr; cv.height = r.height * P.dpr; draw(); }
  function grid(){
    const {x0, x1, y0, y1} = P.bounds(), C = P.C;
    const st = niceStep(P.span), sty = P.yspan ? niceStep(P.yspan) : st;
    ctx.lineWidth = 1; ctx.strokeStyle = C.grid; ctx.beginPath();
    for (let x = Math.ceil(x0 / st) * st; x <= x1; x += st) { const [px] = P.toS(x, 0); ctx.moveTo(Math.round(px) + .5, 0); ctx.lineTo(Math.round(px) + .5, P.h); }
    for (let y = Math.ceil(y0 / sty) * sty; y <= y1; y += sty) { const [, py] = P.toS(0, y); ctx.moveTo(0, Math.round(py) + .5); ctx.lineTo(P.w, Math.round(py) + .5); }
    ctx.stroke();
    ctx.strokeStyle = C.axis; ctx.lineWidth = 1.5; ctx.beginPath();
    const [ox, oy] = P.toS(0, 0);
    ctx.moveTo(0, oy); ctx.lineTo(P.w, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, P.h); ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = '11px IBM Plex Mono, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const lab = v => Math.abs(v) < 1e-9 ? '0' : (Math.abs(v) >= 1000 || Math.abs(v) < .01 ? v.toExponential(0) : +v.toFixed(4) + '');
    for (let x = Math.ceil(x0 / st) * st; x <= x1; x += st) { if (Math.abs(x) < st / 2) continue; const [px] = P.toS(x, 0); ctx.fillText(lab(x), px, Math.min(Math.max(oy + 4, 2), P.h - 14)); }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let y = Math.ceil(y0 / sty) * sty; y <= y1; y += sty) { if (Math.abs(y) < sty / 2) continue; const [, py] = P.toS(0, y); ctx.fillText(lab(y), Math.min(Math.max(ox - 5, 28), P.w - 4), py); }
    if (opt.xlabel || opt.ylabel) { ctx.fillStyle = C.ink2; ctx.font = 'italic 13px STIX Two Text, serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(opt.xlabel || '', P.w - 6, oy - 4); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(opt.ylabel || '', ox + 6, 6); }
  }
  function draw(){
    if (!P.w) return;
    ctx.setTransform(P.dpr, 0, 0, P.dpr, 0, 0);
    ctx.fillStyle = P.C.bg; ctx.fillRect(0, 0, P.w, P.h);
    if (opt.grid !== false) grid();
    opt.draw && opt.draw(ctx, P);
  }
  P.redraw = draw;
  // helpers
  P.line = (pts, color, width = 2, dash) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach(([x, y], i) => { const [a, b] = P.toS(x, y); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.stroke(); ctx.setLineDash([]); };
  P.poly = (pts, fill, stroke, width = 2) => { ctx.beginPath(); pts.forEach(([x, y], i) => { const [a, b] = P.toS(x, y); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); } };
  P.dot = (x, y, r = 5, color, ring) => { const [a, b] = P.toS(x, y); ctx.beginPath(); ctx.arc(a, b, r, 0, 7); ctx.fillStyle = color; ctx.fill(); if (ring) { ctx.strokeStyle = ring; ctx.lineWidth = 2; ctx.stroke(); } };
  P.text = (s, x, y, color, opts = {}) => { const [a, b] = P.toS(x, y); ctx.fillStyle = color || P.C.ink; ctx.font = opts.font || '600 13px IBM Plex Sans, sans-serif'; ctx.textAlign = opts.align || 'left'; ctx.textBaseline = opts.base || 'bottom'; ctx.fillText(s, a + (opts.dx || 0), b + (opts.dy || 0)); };
  P.arrow = (x0, y0, x1, y1, color, width = 2.5) => { const [a, b] = P.toS(x0, y0), [c, d] = P.toS(x1, y1); const ang = Math.atan2(d - b, c - a), L = Math.hypot(c - a, d - b); if (L < 2) return;
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c - 9 * Math.cos(ang), d - 9 * Math.sin(ang)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c, d); ctx.lineTo(c - 12 * Math.cos(ang - .4), d - 12 * Math.sin(ang - .4)); ctx.lineTo(c - 12 * Math.cos(ang + .4), d - 12 * Math.sin(ang + .4)); ctx.closePath(); ctx.fill(); };
  P.fn = (f, color, width = 2.5, x0, x1) => { const b = P.bounds(); x0 = x0 ?? b.x0; x1 = x1 ?? b.x1; const n = Math.max(200, Math.round(P.w)); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); let pen = false;
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; let y; try { y = f(x); } catch(e) { y = NaN; } if (!isFinite(y) || Math.abs(y - P.cy) > P.span * 50) { pen = false; continue; } const [a, c] = P.toS(x, y); if (pen) ctx.lineTo(a, c); else { ctx.moveTo(a, c); pen = true; } } ctx.stroke(); };
  // interaction: pan + zoom unless a drag handler claims the pointer
  let drag = null; const ptrs = new Map(); let pinch = null;
  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => {
    cv.setPointerCapture(e.pointerId); const [px, py] = local(e); ptrs.set(e.pointerId, [px, py]);
    if (ptrs.size === 2) { const [p1, p2] = [...ptrs.values()]; pinch = {d: Math.hypot(p1[0] - p2[0], p1[1] - p2[1]), span: P.span}; drag = null; return; }
    const w = P.toW(px, py);
    if (opt.onDown && opt.onDown(w, px, py) === true) { drag = {own: true}; return; }
    if (opt.pan !== false) drag = {px, py, cx: P.cx, cy: P.cy};
  });
  cv.addEventListener('pointermove', e => {
    const [px, py] = local(e); if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [px, py]);
    if (pinch && ptrs.size === 2) { const [p1, p2] = [...ptrs.values()]; const d = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]); P.span = Math.min(400, Math.max(.5, pinch.span * pinch.d / d)); draw(); return; }
    if (!drag) { opt.onHover && opt.onHover(P.toW(px, py)); return; }
    if (drag.own) { opt.onMove && opt.onMove(P.toW(px, py)); return; }
    P.cx = drag.cx - (px - drag.px) / P.scale(); P.cy = drag.cy + (py - drag.py) / P.sy(); draw();
  });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (drag && drag.own) opt.onUp && opt.onUp(); drag = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { if (opt.zoom === false) return; e.preventDefault(); const [px, py] = local(e); const [wx, wy] = P.toW(px, py); const k = Math.exp(e.deltaY * .0012);
    P.span = Math.min(400, Math.max(.5, P.span * k)); if (P.yspan) P.yspan = Math.max(.01, P.yspan * k); const [nx, ny] = P.toW(px, py); P.cx += wx - nx; P.cy += wy - ny; draw(); }, {passive: false});
  const ro = new ResizeObserver(resize); ro.observe(stage);
  const onTheme = () => { P.C = colors(); draw(); }; window.addEventListener('themechange', onTheme);
  const mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener && mq.addEventListener('change', onTheme);
  P.destroy = () => { ro.disconnect(); window.removeEventListener('themechange', onTheme); };
  resize();
  return P;
}

/* ---- tiny UI helpers ---- */
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
function layout(root, panelHTML, opts = {}){
  root.innerHTML = `<div class="vis"><div><div class="stage" style="${opts.aspect ? 'aspect-ratio:' + opts.aspect : ''}"><div class="hud">${opts.hud || 'Drag to pan · scroll or pinch to zoom'}</div></div>${opts.below || ''}</div><div class="panel">${panelHTML}</div></div>`;
  return {stage: root.querySelector('.stage'), panel: root.querySelector('.panel')};
}
function slider(id, label, min, max, step, val, fmt){ return `<label class="slider" for="${id}"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}-o">${fmt ? fmt(val) : val}</output></label>`; }
function bindSlider(root, id, fn, fmt){ const el = root.querySelector('#' + id), o = root.querySelector('#' + id + '-o'); const f = () => { o.textContent = fmt ? fmt(+el.value) : el.value; fn(+el.value); }; el.addEventListener('input', f); return el; }
const fx = (v, d = 2) => { if (!isFinite(v)) return '∞'; const r = +v.toFixed(d); return (Object.is(r, -0) ? 0 : r) + ''; };
/* parse a simple maths expression in one or more variables into a JS function */
function compile(expr, vars = ['x']){
  let s = String(expr).toLowerCase().replace(/\s+/g, '');
  if (!/^[0-9a-z+\-*/^().,π]*$/.test(s)) throw new Error('bad');
  s = s.replace(/π/g, 'pi').replace(/\*\*/g, '^');
  const fns = ['asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'sec', 'cosec', 'csc', 'cot', 'sqrt', 'ln', 'log', 'exp', 'abs'];
  // implicit multiplication: 2x, 2(, )(, x(, )x
  const vre = vars.join('|');
  s = s.replace(new RegExp(`(\\d)(${vre}|pi|e(?![x])|\\(|${fns.join('|')})`, 'g'), '$1*$2');
  s = s.replace(/\)(\(|\d|[a-z])/g, ')*$1');
  vars.forEach(v => { s = s.replace(new RegExp(`\\b${v}\\b(?=\\(|\\d)`, 'g'), v + '*'); });
  let js = s.replace(/\^/g, '**');
  const tokens = js.match(/[a-z]+/g) || [];
  for (const tk of tokens) if (![...fns, ...vars, 'pi', 'e'].includes(tk)) throw new Error('unknown ' + tk);
  js = js.replace(/\b(asin|acos|atan|sinh|cosh|tanh|sin|cos|tan|sqrt|exp|abs)\b/g, 'Math.$1').replace(/\bln\b|\blog\b/g, 'Math.log')
         .replace(/\bsec\b/g, '1/Math.cos').replace(/\bcosec\b|\bcsc\b/g, '1/Math.sin').replace(/\bcot\b/g, '1/Math.tan').replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E');
  // eslint-disable-next-line no-new-func
  const f = new Function(...vars, '"use strict";return (' + js + ');');
  f(...vars.map(() => 0.37));
  return f;
}
window.PLOT = {makePlot, colors, layout, slider, bindSlider, fx, h, compile, niceStep};
window.VIS = window.VIS || {};
})();
