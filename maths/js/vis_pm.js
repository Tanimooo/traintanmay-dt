/* More 2D visualisers: Pure, Mechanics, Core Pure 2, Further Pure 1 & 2 */
(function(){
'use strict';
const {makePlot, layout, slider, bindSlider, fx, compile} = window.PLOT;
const VIS = window.VIS;
const q = (r, s) => r.querySelector(s);
const icon = p => `<svg viewBox="0 0 40 40" fill="none" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const fnInput = (id, val, label) => `<label class="field">${label || 'f(x)'}<input id="${id}" value="${val}" spellcheck="false" style="font-family:var(--f-mono)"></label>`;
function liveFn(panel, id, vars, onOk){ const el = q(panel, '#' + id); el.addEventListener('input', () => { try { const f = compile(el.value, vars); el.style.borderColor = ''; onOk(f); } catch(e) { el.style.borderColor = 'var(--bad)'; } }); return compile(el.value, vars); }
const segBtns = (name, opts, cur) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([v, l]) => `<button data-${name}="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
function bindSeg(panel, name, fn){ panel.querySelectorAll(`[data-${name}]`).forEach(b => b.onclick = () => { panel.querySelectorAll(`[data-${name}]`).forEach(x => x.setAttribute('aria-pressed', x === b)); fn(b.dataset[name]); }); }
const num = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const table = (head, rows) => `<table style="width:100%;border-collapse:collapse;font-size:.8rem">${head ? `<tr>${head.map(h => `<th style="text-align:left;padding:2px 4px;border-bottom:1px solid var(--line)">${h}</th>`).join('')}</tr>` : ''}${rows.map(r => `<tr>${r.map(c => `<td style="padding:2px 4px">${c}</td>`).join('')}</tr>`).join('')}</table>`;

/* =============================================================== tangents & first principles */
VIS.tangent = {
  name: 'Gradients, tangents & first principles', group: 'Pure',
  desc: 'Shrink the chord from x = a to x = a + h and watch its gradient approach f′(a). Shows the tangent, the normal and the gradient function.',
  topics: [['pure', 'diff']],
  icon: icon('<path d="M4 32c8 0 12-24 32-24" stroke="var(--line-strong)"/><path d="M6 30L34 14" stroke="var(--accent)"/><circle cx="17" cy="23.5" r="2.5" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${fnInput('f', 'x^3-3x')}
      ${slider('a', 'a', -4, 4, 0.05, 1.5)}${slider('h', 'h', -2, 2, 0.01, 1)}
      <div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="tan" checked>Tangent</label><label class="tog"><input type="checkbox" id="nor">Normal</label><label class="tog"><input type="checkbox" id="der">Gradient function f′(x)</label></div>
      <div class="row"><button class="btn sm" id="shrink">Let h → 0</button></div>
      <div class="readout" id="out"></div>`);
    let f; const v = id => +q(panel, '#' + id).value; let raf;
    const P = makePlot(stage, {span: 12, cy: 1, draw(ctx, P){ if (!f) return; const C = P.C, a = v('a'), h = v('h'), fa = f(a), m = num(f, a);
      if (q(panel, '#der').checked) P.fn(x => num(f, x), C.warn, 2);
      P.fn(f, C.accent, 3);
      if (q(panel, '#tan').checked) P.fn(x => fa + m * (x - a), C.brand, 2);
      if (q(panel, '#nor').checked && Math.abs(m) > 1e-9) P.fn(x => fa - (x - a) / m, C.blue, 2, undefined, undefined);
      if (Math.abs(h) > 1e-6) { const b = a + h, fb = f(b), mc = (fb - fa) / h; P.fn(x => fa + mc * (x - a), C.muted, 1.5); P.line([[a, fa], [b, fa], [b, fb]], C.bad, 1.5, [4, 4]); P.dot(b, fb, 5, C.bad); P.text('h', a + h / 2, fa, C.bad, {align: 'center', base: 'top', dy: 4}); }
      P.dot(a, fa, 7, C.brand, C.bg); }});
    function update(){ P.redraw(); const a = v('a'), h = v('h'), fa = f(a), m = num(f, a), c = fa - m * a;
      q(panel, '#out').innerHTML = `f(a) = ${fx(fa, 4)}<br>Chord gradient (f(a+h) − f(a))/h = ${Math.abs(h) > 1e-6 ? '<b>' + fx((f(a + h) - fa) / h, 5) + '</b>' : '—'}<br>f′(a) = lim<sub>h→0</sub> = <b>${fx(m, 5)}</b><br>Tangent: y = ${fx(m, 4)}x ${c < 0 ? '−' : '+'} ${fx(Math.abs(c), 4)}${Math.abs(m) > 1e-9 ? `<br>Normal gradient = −1/f′(a) = ${fx(-1 / m, 4)}` : '<br>Stationary point here!'}<br>${Math.abs(m) < 1e-3 ? '' : m > 0 ? 'f is increasing at a' : 'f is decreasing at a'}<br>f″(a) ≈ ${fx(num(x => num(f, x, 1e-4), a, 1e-3), 3)}`; }
    f = liveFn(panel, 'f', ['x'], g => { f = g; update(); });
    ['a', 'h'].forEach(id => bindSlider(panel, id, update)); ['tan', 'nor', 'der'].forEach(id => q(panel, '#' + id).onchange = update);
    q(panel, '#shrink').onclick = () => { cancelAnimationFrame(raf); const h0 = v('h') || 1, t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 2500); const h = h0 * Math.pow(1 - k, 2.5) || 0; q(panel, '#h').value = h; q(panel, '#h-o').textContent = fx(h, 3); update(); if (k < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); };
    update(); return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== areas & the trapezium rule */
VIS.area = {
  name: 'Area under a curve & the trapezium rule', group: 'Pure',
  desc: 'Approximate ∫f(x) dx with trapezia or rectangles, change the number of strips, and compare with the exact value. Areas below the x-axis count as negative.',
  topics: [['pure', 'integ'], ['pure', 'num']],
  icon: icon('<path d="M4 34h32"/><path d="M6 30L12 18 18 14 24 15 30 20 34 26" stroke="var(--accent)"/><path d="M6 34V30L12 18V34M12 18L18 14V34M18 14L24 15V34M24 15L30 20V34" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.4"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${fnInput('f', 'sqrt(x)+sin(x)')}
      <div class="row"><label class="field">a<input id="a" type="number" value="0" step="0.5" style="width:80px"></label><label class="field">b<input id="b" type="number" value="4" step="0.5" style="width:80px"></label></div>
      ${slider('n', 'strips n', 1, 40, 1, 4)}
      ${segBtns('m', [['trap', 'Trapezium'], ['mid', 'Midpoint'], ['left', 'Left'], ['right', 'Right']], 'trap')}
      <div class="readout" id="out"></div>
      <p class="note">Trapezium rule: ∫ ≈ ½h[y₀ + 2(y₁ + … + yₙ₋₁) + yₙ], with h = (b − a)/n. It over-estimates where the curve is convex and under-estimates where it is concave.</p>`);
    let f, m = 'trap'; const v = id => id === 'n' ? +q(panel, '#n').value : parseFloat(q(panel, '#' + id).value);
    function approx(){ const a = v('a'), b = v('b'), n = v('n'), h = (b - a) / n; let s = 0;
      for (let i = 0; i < n; i++) { const x0 = a + i * h, x1 = x0 + h; s += m === 'trap' ? (f(x0) + f(x1)) / 2 : m === 'mid' ? f((x0 + x1) / 2) : m === 'left' ? f(x0) : f(x1); } return s * h; }
    function exact(){ const a = v('a'), b = v('b'), n = 2000, h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return s * h / 3; }
    const P = makePlot(stage, {span: 9, cx: 2.5, cy: 1.5, draw(ctx, P){ if (!f) return; const C = P.C, a = v('a'), b = v('b'), n = v('n'), h = (b - a) / n;
      for (let i = 0; i < n; i++) { const x0 = a + i * h, x1 = x0 + h; let pts;
        if (m === 'trap') pts = [[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]];
        else { const y = m === 'mid' ? f((x0 + x1) / 2) : m === 'left' ? f(x0) : f(x1); pts = [[x0, 0], [x0, y], [x1, y], [x1, 0]]; }
        const neg = pts[1][1] + pts[2][1] < 0; P.poly(pts, neg ? 'color-mix(in srgb,' + C.bad + ' 22%,transparent)' : 'color-mix(in srgb,' + C.brand + ' 22%,transparent)', neg ? C.bad : C.brand, 1.2); }
      P.fn(f, C.accent, 3); }});
    function update(){ P.redraw(); const A = approx(), E = exact(), n = v('n'), h = (v('b') - v('a')) / n;
      const ys = [...Array(Math.min(n, 12) + 1)].map((_, i) => fx(f(v('a') + i * h), 4));
      q(panel, '#out').innerHTML = `h = ${fx(h, 4)}<br>${m === 'trap' && n <= 12 ? 'y-values: ' + ys.join(', ') + '<br>' : ''}Approximation = <b>${fx(A, 6)}</b><br>Exact (numerical) = ${fx(E, 6)}<br>Error = ${fx(A - E, 6)} (${fx(100 * (A - E) / E, 3)}%)`; }
    f = liveFn(panel, 'f', ['x'], g => { f = g; update(); });
    ['a', 'b'].forEach(id => q(panel, '#' + id).addEventListener('input', update)); bindSlider(panel, 'n', update); bindSeg(panel, 'm', k => { m = k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== numerical methods */
VIS.numerical = {
  name: 'Newton–Raphson & iteration', group: 'Pure',
  desc: 'Watch Newton–Raphson slide down tangents to a root, and see fixed-point iteration xₙ₊₁ = g(xₙ) as a staircase or cobweb that converges or diverges.',
  topics: [['pure', 'num'], ['fp1', 'num']],
  icon: icon('<path d="M4 34h32"/><path d="M6 6c4 10 10 24 28 26" stroke="var(--accent)"/><path d="M30 31L22 10V34M22 10L16 26" stroke="var(--brand)" stroke-dasharray="3 2"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${segBtns('m', [['nr', 'Newton–Raphson'], ['it', 'Iteration x = g(x)'], ['cs', 'Change of sign']], 'nr')}
      <div id="nrP">${fnInput('f', 'x^3-2x-5')}</div>
      <div id="itP" hidden>${fnInput('g', 'cbrt(2x+5)'.replace('cbrt(2x+5)', '(2x+5)^(1/3)'), 'g(x)')}</div>
      ${slider('x0', 'x₀', -5, 5, 0.05, 3)}${slider('st', 'steps', 1, 10, 1, 4)}
      <div class="readout" id="out"></div>`);
    let mode = 'nr', f, g; const v = id => +q(panel, '#' + id).value;
    const P = makePlot(stage, {span: 10, cx: 1.5, cy: 1, draw(ctx, P){ if (!f) return; const C = P.C, n = v('st'); let x = v('x0');
      if (mode === 'nr') { P.fn(f, C.accent, 3); for (let i = 0; i < n; i++) { const y = f(x), m = num(f, x); if (!isFinite(m) || Math.abs(m) < 1e-12) break; const x1 = x - y / m; P.line([[x, 0], [x, y]], C.muted, 1.2, [3, 3]); P.line([[x, y], [x1, 0]], C.brand, 2); P.dot(x, 0, 4, C.warn); P.text('x' + i, x, 0, C.warn, {dy: 16, base: 'top', align: 'center'}); x = x1; } P.dot(x, 0, 5, C.good); }
      else if (mode === 'it') { P.fn(x => x, C.muted, 1.5); P.fn(g, C.accent, 3); let pts = [[x, 0]]; for (let i = 0; i < n; i++) { const y = g(x); if (!isFinite(y)) break; pts.push([x, y], [y, y]); x = y; } P.line(pts, C.brand, 2); }
      else { P.fn(f, C.accent, 3); let a = v('x0') - 2, b = v('x0'); if (f(a) * f(b) > 0) { P.text('No sign change on [x₀ − 2, x₀]', a, 0, C.bad, {dy: -10}); return; }
        for (let i = 0; i < n; i++) { const c = (a + b) / 2; if (f(a) * f(c) <= 0) b = c; else a = c; }
        P.poly([[a, -50], [b, -50], [b, 50], [a, 50]], 'color-mix(in srgb,' + C.brand + ' 18%,transparent)'); P.dot(a, f(a), 5, C.bad); P.dot(b, f(b), 5, C.good); } }});
    function update(){ P.redraw(); const n = v('st'); let x = v('x0'), rows = [];
      if (mode === 'nr') { for (let i = 0; i <= n; i++) { rows.push([i, fx(x, 8), fx(f(x), 6)]); const m = num(f, x); if (!m) break; x = x - f(x) / m; } q(panel, '#out').innerHTML = 'xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)<br>' + table(['n', 'xₙ', 'f(xₙ)'], rows) + '<br>Fails if f′(xₙ) ≈ 0 (horizontal tangent).'; }
      else if (mode === 'it') { for (let i = 0; i <= n; i++) { rows.push([i, fx(x, 8)]); x = g(x); } const gp = num(g, x); q(panel, '#out').innerHTML = table(['n', 'xₙ'], rows) + `<br>|g′(x)| ≈ ${fx(Math.abs(gp), 3)} near the root → ${Math.abs(gp) < 1 ? 'converges' : 'diverges'}; ${gp > 0 ? 'staircase' : 'cobweb'} diagram.`; }
      else { let a = v('x0') - 2, b = v('x0'); if (f(a) * f(b) > 0) { q(panel, '#out').innerHTML = 'f(a) and f(b) have the same sign – no guaranteed root.'; return; }
        for (let i = 0; i < n; i++) { const c = (a + b) / 2; rows.push([fx(a, 5), fx(b, 5), fx(f(c), 4)]); if (f(a) * f(c) <= 0) b = c; else a = c; }
        q(panel, '#out').innerHTML = 'Interval bisection – f is continuous and changes sign, so a root lies between:<br>' + table(['a', 'b', 'f(mid)'], rows) + `<br>Root in [${fx(a, 6)}, ${fx(b, 6)}]`; } }
    f = liveFn(panel, 'f', ['x'], h => { f = h; update(); }); g = liveFn(panel, 'g', ['x'], h => { g = h; update(); });
    bindSeg(panel, 'm', k => { mode = k; q(panel, '#nrP').hidden = k === 'it'; q(panel, '#itP').hidden = k !== 'it'; update(); });
    ['x0', 'st'].forEach(id => bindSlider(panel, id, update)); update(); return () => P.destroy();
  }
};

/* =============================================================== unit circle & trig graphs */
VIS.unitcircle = {
  name: 'Unit circle & trig graphs', group: 'Pure',
  desc: 'Rotate the radius and watch sin θ, cos θ and tan θ trace out their graphs. Mark every solution of sin x = k, cos x = k or tan x = k in 0° ≤ x < 360°.',
  topics: [['pure', 'trig']],
  icon: icon('<circle cx="14" cy="20" r="10"/><path d="M14 20l7-7" stroke="var(--accent)"/><path d="M26 20c3-10 6-10 10 0" stroke="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('th', 'θ (°)', 0, 720, 1, 40)}
      ${segBtns('fn', [['sin', 'sin'], ['cos', 'cos'], ['tan', 'tan']], 'sin')}${slider('k', 'k', -2, 2, 0.01, 0.5)}
      <div class="readout" id="out"></div><p class="note">CAST: all positive in the 1st quadrant, Sin in the 2nd, Tan in the 3rd, Cos in the 4th.</p>`, {aspect: '16/9', hud: ''});
    let fn = 'sin'; const v = id => +q(panel, '#' + id).value; const R = Math.PI / 180;
    const F = {sin: Math.sin, cos: Math.cos, tan: Math.tan};
    const P = makePlot(stage, {span: 16, cx: 5.2, cy: 0, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, th = v('th'), k = v('k');
      // unit circle on the left (centre (-3,0), radius 2)
      const ox = -3, r = 2, c = Math.cos(th * R), s = Math.sin(th * R);
      const [cx, cy] = P.toS(ox, 0); ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - r * P.scale() - 10, cy); ctx.lineTo(cx + r * P.scale() + 10, cy); ctx.moveTo(cx, cy - r * P.scale() - 10); ctx.lineTo(cx, cy + r * P.scale() + 10); ctx.stroke();
      ctx.strokeStyle = C.muted; ctx.beginPath(); ctx.arc(cx, cy, r * P.scale(), 0, 7); ctx.stroke();
      [['S', -1, 1], ['A', 1, 1], ['T', -1, -1], ['C', 1, -1]].forEach(([l, a, b]) => P.text(l, ox + a * 1.5, b * 1.5, C.muted, {align: 'center', base: 'middle', font: '700 14px IBM Plex Sans, sans-serif'}));
      P.line([[ox, 0], [ox + r * c, r * s]], C.ink2, 2); P.line([[ox + r * c, 0], [ox + r * c, r * s]], C.accent, 3); P.line([[ox, 0], [ox + r * c, 0]], C.blue, 3);
      P.dot(ox + r * c, r * s, 6, C.brand, C.bg);
      // graph from x = 0 (0°) to x = 12 (720°)
      const sx = 12 / 720, gx = d => d * sx, gy = y => Math.max(-2.6, Math.min(2.6, y * 1.6));
      P.line([[0, 0], [12.2, 0]], C.muted, 1.2); P.line([[0, -2.7], [0, 2.7]], C.muted, 1.2);
      for (let d = 90; d <= 720; d += 90) { P.line([[gx(d), -0.08], [gx(d), 0.08]], C.muted, 1); P.text(d + '°', gx(d), 0, C.muted, {align: 'center', base: 'top', dy: 6, font: '11px IBM Plex Mono, monospace'}); }
      const curve = (f, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); let pen = false; for (let d = 0; d <= 720; d += 1) { const y = f(d * R); if (Math.abs(y) > 1.7) { pen = false; continue; } const [a, b] = P.toS(gx(d), gy(y)); pen ? ctx.lineTo(a, b) : ctx.moveTo(a, b); pen = true; } ctx.stroke(); };
      curve(Math.sin, fn === 'sin' ? C.accent : C.grid, fn === 'sin' ? 3 : 1.5); curve(Math.cos, fn === 'cos' ? C.blue : C.grid, fn === 'cos' ? 3 : 1.5); curve(Math.tan, fn === 'tan' ? C.warn : C.grid, fn === 'tan' ? 3 : 1.5);
      P.line([[0, gy(k)], [12, gy(k)]], C.bad, 1.5, [6, 4]);
      solutions(k).forEach(d => P.dot(gx(d), gy(k), 5, C.bad, C.bg));
      const yv = F[fn](th * R); if (Math.abs(yv) < 1.7) { P.dot(gx(th), gy(yv), 6, C.brand, C.bg); P.line([[gx(th), 0], [gx(th), gy(yv)]], C.brand, 1, [3, 3]); } }});
    function solutions(k){ const out = []; if (fn !== 'tan' && Math.abs(k) > 1) return out;
      const p = fn === 'sin' ? Math.asin(k) / R : fn === 'cos' ? Math.acos(k) / R : Math.atan(k) / R;
      const base = fn === 'sin' ? [p, 180 - p] : fn === 'cos' ? [p, 360 - p] : [p, p + 180];
      base.forEach(b => { for (let n = -2; n < 3; n++) { const d = b + 360 * n; if (d >= -1e-9 && d < 360 - 1e-9 && !out.some(o => Math.abs(o - d) < 1e-6)) out.push(d); } }); return out.sort((a, b) => a - b); }
    function update(){ P.redraw(); const th = v('th'), k = v('k'), s = solutions(k), p = fn === 'sin' ? Math.asin(k) / R : fn === 'cos' ? Math.acos(k) / R : Math.atan(k) / R;
      q(panel, '#out').innerHTML = `θ = ${th}° = ${fx(th * R / Math.PI, 3)}π rad<br>sin θ = ${fx(Math.sin(th * R), 4)}, cos θ = ${fx(Math.cos(th * R), 4)}, tan θ = ${Math.abs(Math.cos(th * R)) < 1e-9 ? 'undefined' : fx(Math.tan(th * R), 4)}<br><br>${fn} x = ${k}, 0 ≤ x < 360°:<br>${s.length ? `principal value ${fx(p, 2)}°<br>x = <b>${s.map(d => fx(d, 1) + '°').join(', ')}</b>` : 'no solutions (|k| > 1)'}`; }
    bindSlider(panel, 'th', update); bindSlider(panel, 'k', update); bindSeg(panel, 'fn', k => { fn = k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== inclined plane & connected particles */
VIS.slope = {
  name: 'Inclined planes, friction & pulleys', group: 'Mechanics',
  desc: 'A block on a rough slope, optionally pulled by a hanging mass over a smooth pulley. See the free-body diagram, whether friction is limiting, and the acceleration.',
  topics: [['mech', 'forces']],
  icon: icon('<path d="M4 34h32L4 14z" fill="var(--brand-soft)"/><rect x="11" y="16" width="8" height="6" transform="rotate(32 15 19)" fill="var(--accent-soft)" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('al', 'angle α (°)', 0, 60, 1, 30)}${slider('m', 'block m (kg)', 0.5, 10, 0.5, 4)}${slider('mu', 'μ', 0, 1, 0.01, 0.3)}${slider('M', 'hanging mass M (kg)', 0, 10, 0.5, 3)}
      <div class="readout" id="out"></div><p class="note">g = 9.8 m s⁻². With M = 0 there is no pulley. Friction opposes the motion (or the tendency to move) and F ≤ μR.</p>`, {hud: '', aspect: '16/10'});
    const g = 9.8, v = id => +q(panel, '#' + id).value;
    function solve(){ const al = v('al') * Math.PI / 180, m = v('m'), mu = v('mu'), M = v('M');
      const R = m * g * Math.cos(al), Fmax = mu * R, drive = M * g - m * g * Math.sin(al); // +ve = up the slope
      let a = 0, F, state, T = M * g;
      if (Math.abs(drive) <= Fmax + 1e-9) { F = -drive; state = Math.abs(Math.abs(drive) - Fmax) < 1e-6 && Fmax > 0 ? 'limiting equilibrium' : 'stays at rest'; }
      else { const dir = Math.sign(drive); F = -dir * Fmax; a = (drive + F) / (m + M); state = dir > 0 ? 'moves up the slope' : 'slides down the slope'; T = M * (g - a); }
      return {al, m, mu, M, R, Fmax, drive, a, F, state, T}; }
    const P = makePlot(stage, {span: 14, cx: 0, cy: 2.5, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, s = solve(), L = 9, c = Math.cos(s.al), sn = Math.sin(s.al);
      const A = [-5, 0], B = [-5 + L * c, 0], Tp = [-5 + L * c, L * sn];
      P.poly([A, B, Tp], C.soft, C.brand, 2);
      const u = [c, sn], nrm = [-sn, c], pos = 0.55 * L, bc = [A[0] + u[0] * pos + nrm[0] * .55, A[1] + u[1] * pos + nrm[1] * .55];
      const corner = (du, dn) => [bc[0] + u[0] * du + nrm[0] * dn, bc[1] + u[1] * du + nrm[1] * dn];
      P.poly([corner(-.7, -.55), corner(.7, -.55), corner(.7, .55), corner(-.7, .55)], C.accSoft, C.accent, 2);
      const sc = .045, arr = (vx, vy, col, lab) => { P.arrow(bc[0], bc[1], bc[0] + vx * sc, bc[1] + vy * sc, col, 2.5); P.text(lab, bc[0] + vx * sc, bc[1] + vy * sc, col, {dx: 4}); };
      arr(0, -s.m * g, C.warn, s.m + 'g'); arr(nrm[0] * s.R, nrm[1] * s.R, C.blue, 'R');
      if (Math.abs(s.F) > 1e-6) arr(u[0] * s.F, u[1] * s.F, C.bad, 'F');
      if (s.M > 0) { arr(u[0] * s.T, u[1] * s.T, C.good, 'T'); const top = Tp; P.dot(top[0], top[1], 6, C.ink2); P.line([corner(.7, 0), top], C.ink2, 1.5); P.line([top, [top[0] + .35, top[1] - .2], [top[0] + .35, top[1] - 3]], C.ink2, 1.5);
        P.poly([[top[0], top[1] - 3], [top[0] + .7, top[1] - 3], [top[0] + .7, top[1] - 4.1], [top[0], top[1] - 4.1]], C.accSoft, C.accent, 2); P.text('M', top[0] + .35, top[1] - 3.55, C.accent, {align: 'center', base: 'middle'}); }
      if (s.a) P.arrow(bc[0] - nrm[0] * 1.6 - u[0] * .6, bc[1] - nrm[1] * 1.6 - u[1] * .6, bc[0] - nrm[0] * 1.6 + u[0] * .6 * Math.sign(s.drive), bc[1] - nrm[1] * 1.6 + u[1] * .6 * Math.sign(s.drive), C.ink, 2);
      P.text('α', A[0] + 1.1, 0.12, C.ink2); }});
    function update(){ P.redraw(); const s = solve();
      q(panel, '#out').innerHTML = `Resolve ⟂ slope: R = mg cos α = <b>${fx(s.R, 3)} N</b><br>F<sub>max</sub> = μR = ${fx(s.Fmax, 3)} N<br>${s.M ? `Weight of M = ${fx(s.M * g, 3)} N, ` : ''}component of mg down slope = ${fx(s.m * g * Math.sin(s.al), 3)} N<br>Friction needed for equilibrium = ${fx(Math.abs(s.drive), 3)} N<br><br>The block <b>${s.state}</b>${s.a ? `<br>a = <b>${fx(Math.abs(s.a), 4)} m s⁻²</b>${s.M ? `, T = ${fx(s.T, 3)} N` : ''}` : ''}<br>tan α = ${fx(Math.tan(s.al), 3)} ${s.M ? '' : (Math.tan(s.al) > s.mu ? '> μ, so it slides on its own' : '≤ μ, so it rests on its own')}`; }
    ['al', 'm', 'mu', 'M'].forEach(id => bindSlider(panel, id, update)); update(); return () => P.destroy();
  }
};

/* =============================================================== beams & moments */
VIS.beam = {
  name: 'Moments: beams on supports', group: 'Mechanics',
  desc: 'A uniform beam on two supports with a point load. Take moments to find the reactions, and slide the load to see when the beam is about to tilt.',
  topics: [['mech', 'mom']],
  icon: icon('<rect x="4" y="16" width="32" height="4" fill="var(--brand-soft)"/><path d="M10 20l-3 8h6zM30 20l-3 8h6z" fill="var(--surface)"/><path d="M22 6v9" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('L', 'length (m)', 2, 10, 0.5, 6)}${slider('W', 'beam weight (N)', 0, 200, 5, 80)}${slider('A', 'support C at (m)', 0, 10, 0.1, 1)}${slider('B', 'support D at (m)', 0, 10, 0.1, 5)}
      ${slider('P', 'load (N)', 0, 300, 5, 120)}${slider('x', 'load at (m)', 0, 10, 0.05, 4)}
      <div class="readout" id="out"></div><p class="note">Equilibrium: resultant force = 0 and resultant moment about any point = 0. “About to tilt about D” means the reaction at C is 0.</p>`, {hud: '', aspect: '16/9'});
    const v = id => +q(panel, '#' + id).value;
    function solve(){ const L = v('L'), W = v('W'), a = Math.min(v('A'), L), b = Math.min(v('B'), L), P = v('P'), x = Math.min(v('x'), L);
      if (Math.abs(b - a) < 1e-9) return {L, W, a, b, P, x, bad: true};
      const RB = (W * (L / 2 - a) + P * (x - a)) / (b - a), RA = W + P - RB; return {L, W, a, b, P, x, RA, RB}; }
    const P = makePlot(stage, {span: 14, cx: 4, cy: 1, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, s = solve(), t = .3;
      let tilt = 0; if (!s.bad && (s.RA < -1e-9 || s.RB < -1e-9)) tilt = s.RA < 0 ? 1 : -1;
      const piv = tilt === 1 ? s.b : s.a, rot = tilt * 0.12;
      const tr = ([x, y]) => [piv + (x - piv) * Math.cos(rot) - y * Math.sin(rot), (x - piv) * Math.sin(rot) + y * Math.cos(rot)];
      P.poly([[0, 0], [s.L, 0], [s.L, t], [0, t]].map(tr), C.soft, C.brand, 2);
      [s.a, s.b].forEach((x, i) => { P.poly([[x, 0], [x - .3, -.7], [x + .3, -.7]], C.surface || C.bg, C.ink2, 2); P.text(i ? 'D' : 'C', x, -.7, C.ink2, {align: 'center', base: 'top', dy: 4}); });
      P.line([[-1, -.72], [s.L + 1, -.72]], C.muted, 1.5);
      const sc = .012;
      if (!s.bad) { [[s.a, s.RA, 'R_C'], [s.b, s.RB, 'R_D']].forEach(([x, R, l]) => { if (R > 1e-6) { const p = tr([x, 0]); P.arrow(p[0], p[1] - R * sc - .1, p[0], p[1], C.blue, 2.5); P.text(l + ' = ' + fx(R, 1), p[0], p[1] - R * sc - .1, C.blue, {align: 'center', base: 'top', dy: 4}); } }); }
      const g = tr([s.L / 2, t]); if (s.W) { P.arrow(g[0], g[1], g[0], g[1] - s.W * sc - .1, C.warn, 2.5); P.text('W', g[0], g[1] - s.W * sc, C.warn, {dx: 6}); }
      const lp = tr([s.x, t]); P.arrow(lp[0], lp[1] + s.P * sc + .3, lp[0], lp[1], C.accent, 3); P.text(fx(s.P) + ' N', lp[0], lp[1] + s.P * sc + .3, C.accent, {align: 'center'}); }});
    function update(){ P.redraw(); const s = solve(); if (s.bad) { q(panel, '#out').innerHTML = 'Move the supports apart.'; return; }
      let msg = `Moments about C: R_D(${fx(s.b - s.a)}) = W(${fx(s.L / 2 - s.a)}) + P(${fx(s.x - s.a)})<br>R_D = <b>${fx(s.RB, 3)} N</b><br>Resolving: R_C = W + P − R_D = <b>${fx(s.RA, 3)} N</b>`;
      if (s.RA < -1e-9) msg += '<br><br><b style="color:var(--bad)">R_C would be negative – the beam tilts about D.</b>';
      else if (s.RB < -1e-9) msg += '<br><br><b style="color:var(--bad)">R_D would be negative – the beam tilts about C.</b>';
      else if (Math.abs(s.RA) < 1e-6 || Math.abs(s.RB) < 1e-6) msg += '<br><br><b>On the point of tilting.</b>';
      const lo = s.a - (s.W * (s.L / 2 - s.a) - 0) / (s.P || 1e-9);
      const xC0 = s.P ? s.a + (-(s.W) * (s.L / 2 - s.b) - s.P * 0) / 1 : 0;
      const tiltC = s.P ? s.b + s.W * (s.b - s.L / 2) / s.P : null, tiltD = s.P ? s.a - s.W * (s.L / 2 - s.a) / s.P : null;
      if (s.P) msg += `<br><br>Load positions keeping equilibrium: ${fx(Math.max(0, Math.min(tiltD, tiltC)), 3)} m to ${fx(Math.min(s.L, Math.max(tiltD, tiltC)), 3)} m`;
      q(panel, '#out').innerHTML = msg; void lo; void xC0; }
    ['L', 'W', 'A', 'B', 'P', 'x'].forEach(id => bindSlider(panel, id, update)); update(); return () => P.destroy();
  }
};

/* =============================================================== velocity–time graphs */
VIS.vt = {
  name: 'Velocity–time & displacement graphs', group: 'Mechanics',
  desc: 'Drag the corners of a velocity–time graph. The gradient gives the acceleration and the signed area gives the displacement; the displacement–time curve is drawn alongside.',
  topics: [['mech', 'kin'], ['fm2', 'kin']],
  icon: icon('<path d="M4 34h32M4 34V4"/><path d="M4 30L12 12 24 12 34 34" stroke="var(--accent)"/><path d="M4 34L12 12 24 12 34 34z" fill="var(--brand-soft)" stroke="none"/>'),
  mount(root){
    const {stage, panel} = layout(root, `<div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="st" checked>Show s–t (dashed)</label><label class="tog"><input type="checkbox" id="snap" checked>Snap to 0.5</label></div>
      <div class="row"><button class="btn sm" id="add">Add a point</button><button class="btn sm" id="rem">Remove last</button></div>
      <div class="readout" id="out"></div><p class="note">Drag the dots. Displacement = signed area; distance travelled = total area (ignoring sign).</p>`, {hud: 'Drag points'});
    let pts = [[0, 0], [3, 6], [8, 6], [11, 0], [13, -3], [15, 0]], drag = -1;
    const P = makePlot(stage, {span: 18, cx: 7.5, cy: 2, xlabel: 't (s)', ylabel: 'v (m s⁻¹)', draw(ctx, P){ const C = P.C;
      for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; P.poly([[a[0], 0], a, b, [b[0], 0]], 'color-mix(in srgb,' + ((a[1] + b[1]) >= 0 ? C.brand : C.bad) + ' 20%,transparent)'); }
      P.line(pts, C.accent, 3);
      if (q(panel, '#st').checked) { let s = 0, curve = [[pts[0][0], 0]]; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; for (let k = 1; k <= 20; k++) { const t = a[0] + (b[0] - a[0]) * k / 20, vv = a[1] + (b[1] - a[1]) * k / 20; const t0 = a[0] + (b[0] - a[0]) * (k - 1) / 20, v0 = a[1] + (b[1] - a[1]) * (k - 1) / 20; s += (vv + v0) / 2 * (t - t0); curve.push([t, s * 0.2]); } } P.line(curve, C.blue, 2, [6, 4]); P.text('s/5', curve[curve.length - 1][0], curve[curve.length - 1][1], C.blue, {dx: 6}); }
      pts.forEach(p => P.dot(p[0], p[1], 7, C.brand, C.bg)); },
      onDown(w){ drag = pts.findIndex(p => Math.hypot(p[0] - w[0], p[1] - w[1]) < 14 / P.scale()); return drag >= 0; },
      onMove(w){ const sn = q(panel, '#snap').checked ? x => Math.round(x * 2) / 2 : x => Math.round(x * 100) / 100; let t = sn(w[0]); if (drag === 0) t = 0; else { t = Math.max(pts[drag - 1][0] + .5, t); if (drag < pts.length - 1) t = Math.min(pts[drag + 1][0] - .5, t); } pts[drag] = [t, sn(w[1])]; update(); }, onUp(){ drag = -1; }});
    function update(){ P.redraw(); let s = 0, d = 0; const rows = [];
      for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], dt = b[0] - a[0], acc = (b[1] - a[1]) / dt, area = (a[1] + b[1]) / 2 * dt;
        let dist; if (a[1] * b[1] >= 0) dist = Math.abs(area); else { const tz = dt * Math.abs(a[1]) / (Math.abs(a[1]) + Math.abs(b[1])); dist = Math.abs(a[1]) * tz / 2 + Math.abs(b[1]) * (dt - tz) / 2; }
        s += area; d += dist; rows.push([`${fx(a[0])}–${fx(b[0])}`, fx(acc, 3), fx(area, 3)]); }
      q(panel, '#out').innerHTML = table(['t', 'a (m s⁻²)', 'area'], rows) + `<br>Displacement = <b>${fx(s, 3)} m</b><br>Distance travelled = <b>${fx(d, 3)} m</b>`; }
    q(panel, '#st').onchange = update;
    q(panel, '#add').onclick = () => { const l = pts[pts.length - 1]; pts.push([l[0] + 2, 0]); update(); };
    q(panel, '#rem').onclick = () => { if (pts.length > 2) pts.pop(); update(); };
    update(); return () => P.destroy();
  }
};

/* =============================================================== hyperbolic functions */
VIS.hyperbolic = {
  name: 'Hyperbolic functions', group: 'Further calculus',
  desc: 'Graphs of sinh, cosh, tanh, their reciprocals and inverses, plus the point (cosh t, sinh t) on the unit hyperbola – where t is twice the shaded area.',
  topics: [['cp2', 'hyper']],
  icon: icon('<path d="M4 4c8 14 8 18 0 32" stroke="var(--line-strong)"/><path d="M8 6c10 8 18 10 28 10M8 34c10-8 18-10 28-10" stroke="var(--accent)"/>'),
  mount(root){
    const FN = [['sinh', Math.sinh, 'var(--accent)'], ['cosh', Math.cosh, 'var(--blue)'], ['tanh', Math.tanh, 'var(--warn)'], ['sech', x => 1 / Math.cosh(x), 'var(--good)'], ['cosech', x => 1 / Math.sinh(x), 'var(--bad)'], ['coth', x => 1 / Math.tanh(x), 'var(--muted)'],
      ['arsinh', Math.asinh, 'var(--accent)'], ['arcosh', x => x >= 1 ? Math.acosh(x) : NaN, 'var(--blue)'], ['artanh', x => Math.abs(x) < 1 ? Math.atanh(x) : NaN, 'var(--warn)']];
    const {stage, panel} = layout(root, `${segBtns('m', [['g', 'Graphs'], ['h', 'Unit hyperbola']], 'g')}
      <div id="gP"><div class="row" style="gap:10px;margin-top:4px">${FN.map(([n], i) => `<label class="tog"><input type="checkbox" data-i="${i}" ${i < 3 ? 'checked' : ''}>${n}</label>`).join('')}</div></div>
      ${slider('t', 't', -2.5, 2.5, 0.01, 1)}<div class="readout" id="out"></div>`);
    let mode = 'g'; const t = () => +q(panel, '#t').value;
    const css = s => getComputedStyle(document.documentElement).getPropertyValue(s.slice(4, -1)).trim();
    const P = makePlot(stage, {span: 10, draw(ctx, P){ const C = P.C, T = t();
      if (mode === 'g') { panel.querySelectorAll('[data-i]').forEach(cb => { if (cb.checked) { const [n, f, col] = FN[+cb.dataset.i]; P.fn(f, css(col), 2.5); } });
        if (q(panel, '[data-i="1"]').checked) P.dot(T, Math.cosh(T), 5, C.blue); if (q(panel, '[data-i="0"]').checked) P.dot(T, Math.sinh(T), 5, C.accent);
        P.fn(x => x, C.grid, 1); }
      else { [1, -1].forEach(s => { const pts = []; for (let u = -3; u <= 3; u += .02) pts.push([s * Math.cosh(u), Math.sinh(u)]); P.line(pts, C.accent, 2.5); });
        P.line([[-6, -6], [6, 6]], C.muted, 1, [4, 4]); P.line([[-6, 6], [6, -6]], C.muted, 1, [4, 4]);
        const pts = [[0, 0]]; for (let i = 0; i <= 60; i++) { const u = T * i / 60; pts.push([Math.cosh(u), Math.sinh(u)]); } P.poly(pts, 'color-mix(in srgb,' + C.brand + ' 25%,transparent)', C.brand, 1.5);
        const X = Math.cosh(T), Y = Math.sinh(T); P.line([[X, 0], [X, Y]], C.accent, 2, [4, 3]); P.line([[0, 0], [X, 0]], C.blue, 2, [4, 3]); P.dot(X, Y, 6, C.brand, C.bg); P.text('(cosh t, sinh t)', X, Y, C.ink2, {dx: 8}); } }});
    function update(){ P.redraw(); const T = t();
      q(panel, '#out').innerHTML = `sinh t = (eᵗ − e⁻ᵗ)/2 = ${fx(Math.sinh(T), 4)}<br>cosh t = (eᵗ + e⁻ᵗ)/2 = ${fx(Math.cosh(T), 4)}<br>tanh t = ${fx(Math.tanh(T), 4)}<br>cosh²t − sinh²t = ${fx(Math.cosh(T) ** 2 - Math.sinh(T) ** 2, 6)}<br>${mode === 'h' ? `Shaded area = t/2 = ${fx(T / 2, 4)}<br>` : ''}arsinh x = ln(x + √(x² + 1)), arcosh x = ln(x + √(x² − 1)), artanh x = ½ ln((1 + x)/(1 − x))`; }
    panel.querySelectorAll('[data-i]').forEach(cb => cb.onchange = update); bindSlider(panel, 't', update);
    bindSeg(panel, 'm', k => { mode = k; q(panel, '#gP').hidden = k !== 'g'; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== Maclaurin & Taylor series */
VIS.maclaurin = {
  name: 'Maclaurin & Taylor series', group: 'Further calculus',
  desc: 'Add terms one at a time and watch the polynomial hug the curve. Move the centre to get a Taylor series about x = a, and see the interval where it works.',
  topics: [['cp2', 'series'], ['fp1', 'taylor']],
  icon: icon('<path d="M4 30c8 0 10-22 16-22s8 22 16 22" stroke="var(--line-strong)"/><path d="M8 34c4-14 6-26 12-26s8 12 12 26" stroke="var(--accent)" stroke-dasharray="3 2"/>'),
  mount(root){
    // derivative k at a, for each function
    const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
    const F = {
      exp: {n: 'eˣ', f: Math.exp, d: (k, a) => Math.exp(a)},
      sin: {n: 'sin x', f: Math.sin, d: (k, a) => Math.sin(a + k * Math.PI / 2)},
      cos: {n: 'cos x', f: Math.cos, d: (k, a) => Math.cos(a + k * Math.PI / 2)},
      ln: {n: 'ln(1 + x)', f: x => Math.log(1 + x), d: (k, a) => k === 0 ? Math.log(1 + a) : Math.pow(-1, k - 1) * fact(k - 1) / Math.pow(1 + a, k)},
      inv: {n: '1/(1 − x)', f: x => 1 / (1 - x), d: (k, a) => fact(k) / Math.pow(1 - a, k + 1)},
      sqrt: {n: '√(1 + x)', f: x => Math.sqrt(1 + x), d: (k, a) => { let c = 1; for (let i = 0; i < k; i++) c *= (0.5 - i); return c * Math.pow(1 + a, 0.5 - k); }},
      sinh: {n: 'sinh x', f: Math.sinh, d: (k, a) => k % 2 ? Math.cosh(a) : Math.sinh(a)},
      cosh: {n: 'cosh x', f: Math.cosh, d: (k, a) => k % 2 ? Math.sinh(a) : Math.cosh(a)}};
    const {stage, panel} = layout(root, `<label class="field">f(x)<select class="sel" id="fn" style="display:block;width:100%">${Object.entries(F).map(([k, o]) => `<option value="${k}">${o.n}</option>`).join('')}</select></label>
      ${slider('n', 'degree n', 0, 15, 1, 3)}${slider('a', 'centre a', -2, 2, 0.1, 0)}${slider('x', 'evaluate at x', -4, 4, 0.05, 1)}
      <div class="readout" id="out"></div><p class="note">Maclaurin is the special case a = 0: f(x) = f(0) + f′(0)x + f″(0)x²/2! + …</p>`);
    let key = 'exp'; const v = id => +q(panel, '#' + id).value;
    const poly = (x, n, a) => { let s = 0; for (let k = 0; k <= n; k++) s += F[key].d(k, a) / fact(k) * Math.pow(x - a, k); return s; };
    const P = makePlot(stage, {span: 10, cy: 1, draw(ctx, P){ const C = P.C, n = v('n'), a = v('a'), x = v('x');
      P.fn(F[key].f, C.accent, 3); P.fn(t => poly(t, n, a), C.brand, 2.5); P.line([[a, -50], [a, 50]], C.muted, 1, [3, 4]);
      const y = F[key].f(x), yp = poly(x, n, a); P.line([[x, y], [x, yp]], C.bad, 2); P.dot(x, y, 5, C.accent); P.dot(x, yp, 5, C.brand); }});
    function update(){ P.redraw(); const n = v('n'), a = v('a'), x = v('x');
      const terms = []; for (let k = 0; k <= Math.min(n, 6); k++) { const c = F[key].d(k, a) / fact(k); if (Math.abs(c) < 1e-12) continue; terms.push(`${fx(c, 4)}${k ? (a ? `(x ${a < 0 ? '+' : '−'} ${fx(Math.abs(a))})` : 'x') + (k > 1 ? `<sup>${k}</sup>` : '') : ''}`); }
      const y = F[key].f(x), yp = poly(x, n, a);
      q(panel, '#out').innerHTML = `${F[key].n} ≈ ${terms.join(' + ').replace(/\+ -/g, '− ') || '0'}${n > 6 ? ' + …' : ''}<br><br>At x = ${fx(x)}: f = ${fx(y, 6)}, polynomial = ${fx(yp, 6)}<br>Error = <b>${fx(yp - y, 6)}</b>${['ln', 'inv', 'sqrt'].includes(key) ? `<br>Converges only for |x − a| < ${fx(key === 'inv' ? Math.abs(1 - a) : Math.abs(1 + a), 3)}` : '<br>Valid for all x'}`; }
    q(panel, '#fn').onchange = e => { key = e.target.value; update(); };
    ['n', 'a', 'x'].forEach(id => bindSlider(panel, id, update)); update(); return () => P.destroy();
  }
};

/* =============================================================== second-order differential equations */
VIS.ode2 = {
  name: 'Second-order ODEs, SHM & damping', group: 'Further calculus',
  desc: 'Solve a·d²x/dt² + b·dx/dt + c·x = f(t). See the auxiliary equation, whether the motion is SHM, light, critical or heavy damping, and the effect of a forcing term.',
  topics: [['cp2', 'de'], ['cp2', 'model'], ['fm2', 'dyn']],
  icon: icon('<path d="M4 20h32"/><path d="M4 20c3-14 6-14 9 0s6 9 9 0 5-5 7 0 4 3 6 0" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('a', 'a', 0.2, 5, 0.1, 1)}${slider('b', 'b', 0, 10, 0.1, 0.6)}${slider('c', 'c', 0, 20, 0.1, 4)}
      ${segBtns('fo', [['0', 'f(t) = 0'], ['k', 'f(t) = k'], ['cos', 'f(t) = k cos pt']], '0')}${slider('k', 'k', -10, 10, 0.5, 3)}${slider('p', 'p', 0.1, 6, 0.1, 2)}
      ${slider('x0', 'x(0)', -5, 5, 0.1, 2)}${slider('v0', 'ẋ(0)', -10, 10, 0.1, 0)}
      <div class="readout" id="out"></div>`, {aspect: '16/9'});
    let fo = '0'; const v = id => +q(panel, '#' + id).value;
    function sol(){ const a = v('a'), b = v('b'), c = v('c'), k = v('k'), p = v('p'); const f = t => fo === '0' ? 0 : fo === 'k' ? k : k * Math.cos(p * t);
      let x = v('x0'), y = v('v0'), t = 0; const h = .01, out = [[0, x]];
      const acc = (t, x, y) => (f(t) - b * y - c * x) / a;
      for (let i = 0; i < 2000; i++) { const k1x = y, k1y = acc(t, x, y), k2x = y + h / 2 * k1y, k2y = acc(t + h / 2, x + h / 2 * k1x, y + h / 2 * k1y), k3x = y + h / 2 * k2y, k3y = acc(t + h / 2, x + h / 2 * k2x, y + h / 2 * k2y), k4x = y + h * k3y, k4y = acc(t + h, x + h * k3x, y + h * k3y);
        x += h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); y += h / 6 * (k1y + 2 * k2y + 2 * k3y + k4y); t += h; if (i % 4 === 3) out.push([t, x]); if (!isFinite(x)) break; } return out; }
    const P = makePlot(stage, {span: 20, cx: 9, cy: 0, equal: false, yspan: 10, xlabel: 't', ylabel: 'x', draw(ctx, P){ const C = P.C; P.line(sol(), C.accent, 2.5); if (fo === 'k' && v('c')) P.line([[0, v('k') / v('c')], [40, v('k') / v('c')]], C.muted, 1, [4, 4]); }});
    function update(){ P.redraw(); const a = v('a'), b = v('b'), c = v('c'), D = b * b - 4 * a * c; let cls, cf;
      if (D > 1e-9) { const m1 = (-b + Math.sqrt(D)) / (2 * a), m2 = (-b - Math.sqrt(D)) / (2 * a); cls = c ? 'heavy damping (two real roots)' : 'real roots'; cf = `x = Ae^{${fx(m1, 3)}t} + Be^{${fx(m2, 3)}t}`; }
      else if (Math.abs(D) <= 1e-9) { const m = -b / (2 * a); cls = 'critical damping (repeated root)'; cf = `x = (A + Bt)e^{${fx(m, 3)}t}`; }
      else { const re = -b / (2 * a), im = Math.sqrt(-D) / (2 * a); cls = b ? 'light damping (complex roots) – oscillations decay' : '<b>simple harmonic motion</b> (pure imaginary roots)'; cf = re ? `x = e^{${fx(re, 3)}t}(A cos ${fx(im, 3)}t + B sin ${fx(im, 3)}t)` : `x = A cos ${fx(im, 3)}t + B sin ${fx(im, 3)}t, period ${fx(2 * Math.PI / im, 3)}`; }
      const pi = fo === '0' ? 'none' : fo === 'k' ? (c ? `x = ${fx(v('k') / c, 3)}` : 'try x = λt') : (Math.abs(c - a * v('p') ** 2) < 1e-6 && !b ? '<b>resonance</b>: try x = t(λ cos pt + μ sin pt)' : 'try x = λ cos pt + μ sin pt');
      q(panel, '#out').innerHTML = `Auxiliary equation: ${fx(a)}m² + ${fx(b)}m + ${fx(c)} = 0<br>Discriminant b² − 4ac = ${fx(D, 3)} → ${cls}<br>Complementary function: ${cf}<br>Particular integral: ${pi}<br>General solution = CF + PI; use x(0), ẋ(0) for A and B.`; }
    ['a', 'b', 'c', 'k', 'p', 'x0', 'v0'].forEach(id => bindSlider(panel, id, update)); bindSeg(panel, 'fo', k => { fo = k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== numerical solutions of ODEs */
VIS.euler = {
  name: 'Step-by-step methods for ODEs', group: 'Further Pure',
  desc: 'Slope field for dy/dx = f(x, y): click anywhere to drop a particle and trace the solution curve through that point. Compare Euler’s method and the midpoint formula with the true solution as you change the step size h.',
  topics: [['fp1', 'num'], ['fp1', 'rde']],
  icon: icon('<path d="M4 34h32M4 34V4"/><path d="M6 30l6-4 6-5 6-6 6-8" stroke="var(--brand)"/><path d="M6 30c8-3 16-9 26-24" stroke="var(--accent)" stroke-dasharray="3 2"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${fnInput('f', 'x+y', 'dy/dx = f(x, y)')}
      <div class="row"><label class="field">x₀<input id="x0" type="number" value="0" step="0.5" style="width:70px"></label><label class="field">y₀<input id="y0" type="number" value="1" step="0.5" style="width:70px"></label></div>
      ${slider('h', 'step h', 0.05, 1, 0.05, 0.25)}${slider('n', 'steps', 1, 30, 1, 8)}
      <div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="eu" checked>Euler</label><label class="tog"><input type="checkbox" id="mid" checked>Midpoint</label></div>
      <div class="row" style="gap:10px"><label class="tog"><input type="checkbox" id="drop" checked>Click the field to drop a particle</label><button class="btn sm" id="clr">Clear curves</button></div>
      <div class="readout" id="out"></div><p class="note">Click anywhere on the slope field to trace the particular solution through that point (the integral curve follows the little tangent segments). Euler: yᵣ₊₁ = yᵣ + h(dy/dx)ᵣ. Midpoint: yᵣ₊₁ = yᵣ₋₁ + 2h(dy/dx)ᵣ (needs y₁ first – found here with one Euler step).</p>`);
    let f; const v = id => ['h', 'n'].includes(id) ? +q(panel, '#' + id).value : parseFloat(q(panel, '#' + id).value) || 0;
    function runs(){ const h = v('h'), n = v('n'), x0 = v('x0'), y0 = v('y0'); const E = [[x0, y0]]; for (let i = 0; i < n; i++) { const [x, y] = E[i]; E.push([x + h, y + h * f(x, y)]); }
      const M = [[x0, y0], [x0 + h, y0 + h * f(x0, y0)]]; for (let i = 1; i < n; i++) { const [x, y] = M[i]; M.push([x + h, M[i - 1][1] + 2 * h * f(x, y)]); }
      const T = [[x0, y0]]; let x = x0, y = y0; const hh = h / 50; for (let i = 0; i < n * 50; i++) { const k1 = f(x, y), k2 = f(x + hh / 2, y + hh / 2 * k1), k3 = f(x + hh / 2, y + hh / 2 * k2), k4 = f(x + hh, y + hh * k3); y += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4); x += hh; if (i % 50 === 49) T.push([x, y]); }
      return {E, M: M.slice(0, n + 1), T}; }
    const P = makePlot(stage, {span: 8, cx: 1.5, cy: 2, draw(ctx, P){ if (!f) return; const C = P.C, b = P.bounds(), st = P.span / 22;
      for (let x = Math.ceil(b.x0 / st) * st; x < b.x1; x += st) for (let y = Math.ceil(b.y0 / st) * st; y < b.y1; y += st) { const m = f(x, y); if (!isFinite(m)) continue; const L = st * .38 / Math.hypot(1, m); P.line([[x - L, y - L * m], [x + L, y + L * m]], C.grid, 1.3); }
      const r = runs();
      const fine = []; { let x = v('x0'), y = v('y0'); const hh = .01; fine.push([x, y]); for (let i = 0; i < 2000; i++) { const k1 = f(x, y), k2 = f(x + hh / 2, y + hh / 2 * k1), k3 = f(x + hh / 2, y + hh / 2 * k2), k4 = f(x + hh, y + hh * k3); y += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4); x += hh; if (!isFinite(y) || Math.abs(y) > 1e4) break; fine.push([x, y]); } }
      P.line(fine, C.accent, 2.5);
      if (q(panel, '#eu').checked) { P.line(r.E, C.brand, 2); r.E.forEach(p => P.dot(p[0], p[1], 4, C.brand)); }
      if (q(panel, '#mid').checked) { P.line(r.M, C.blue, 2, [5, 4]); r.M.forEach(p => P.dot(p[0], p[1], 4, C.blue)); }
      traces.forEach(([x0, y0]) => { [1, -1].forEach(dir => { let x = x0, y = y0; const hh = dir * P.span / 600, pts = [[x, y]]; for (let i = 0; i < 1500; i++) { const k1 = f(x, y), k2 = f(x + hh / 2, y + hh / 2 * k1), k3 = f(x + hh / 2, y + hh / 2 * k2), k4 = f(x + hh, y + hh * k3); y += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4); x += hh; if (!isFinite(y) || Math.abs(y - P.cy) > P.span * 3 || x < b.x0 - 1 || x > b.x1 + 1) break; pts.push([x, y]); } P.line(pts, C.warn, 2.2); }); P.dot(x0, y0, 5, C.warn, C.bg); }); },
      onDown(w){ if (!q(panel, '#drop').checked) return false; traces.push(w); P.redraw(); q(panel, '#tr').textContent = `Curve through (${fx(w[0], 2)}, ${fx(w[1], 2)})`; return true; }});
    const traces = [];
    function update(){ P.redraw(); const r = runs(), rows = r.E.slice(0, 11).map((p, i) => [fx(p[0], 3), fx(p[1], 5), fx(r.M[i]?.[1], 5), fx(r.T[i]?.[1], 5)]);
      q(panel, '#out').innerHTML = table(['x', 'Euler', 'Midpoint', 'Accurate'], rows) + (r.E.length > 11 ? '<span class="muted">(first 10 steps shown)</span>' : '') + '<br><span style="color:var(--warn)" id="tr"></span>'; }
    q(panel, '#clr').onclick = () => { traces.length = 0; P.redraw(); };
    f = liveFn(panel, 'f', ['x', 'y'], g => { f = g; update(); });
    ['x0', 'y0'].forEach(id => q(panel, '#' + id).addEventListener('input', update)); ['h', 'n'].forEach(id => bindSlider(panel, id, update)); ['eu', 'mid'].forEach(id => q(panel, '#' + id).onchange = update);
    update(); return () => P.destroy();
  }
};

/* =============================================================== groups (Cayley tables) */
VIS.groups = {
  name: 'Groups & Cayley tables', group: 'Further Pure',
  desc: 'Build the Cayley table for integers modulo n under addition or multiplication. Check the group axioms, find the identity, inverses, element orders, generators and subgroups.',
  topics: [['fp2', 'groups'], ['fp2', 'numth']],
  icon: icon('<rect x="6" y="6" width="28" height="28"/><path d="M6 13h28M6 20h28M6 27h28M13 6v28M20 6v28M27 6v28" stroke="var(--line-strong)" stroke-width="1.4"/><rect x="13" y="13" width="7" height="7" fill="var(--accent-soft)" stroke="var(--accent)"/>'),
  mount(root){
    root.innerHTML = `<div class="vis"><div class="card" style="overflow:auto"><div id="tbl"></div></div><div class="panel">
      ${segBtns('op', [['add', 'Addition mod n'], ['mul', 'Multiplication mod n']], 'add')}${slider('n', 'n', 2, 16, 1, 6)}
      <label class="tog"><input type="checkbox" id="unit" checked>Multiplication: use only numbers coprime to n</label>
      <div class="readout" id="out"></div><p class="note">Click an element to highlight its powers (the cyclic subgroup it generates).</p></div></div>`;
    const panel = root.querySelector('.panel'); let op = 'add', sel = null;
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    function build(){ const n = +q(panel, '#n').value; let S = [...Array(n).keys()]; if (op === 'mul') S = q(panel, '#unit').checked ? S.filter(x => x && gcd(x, n) === 1) : S.filter(x => x);
      const o = (a, b) => op === 'add' ? (a + b) % n : (a * b) % n;
      const closed = S.every(a => S.every(b => S.includes(o(a, b))));
      const e = S.find(x => S.every(a => o(x, a) === a && o(a, x) === a));
      const inv = e === undefined ? {} : Object.fromEntries(S.map(a => [a, S.find(b => o(a, b) === e)]));
      const isGroup = closed && e !== undefined && S.every(a => inv[a] !== undefined);
      const order = a => { if (!isGroup) return null; let k = 1, x = a; while (x !== e && k <= S.length) { x = o(x, a); k++; } return k; };
      const gen = isGroup ? S.filter(a => order(a) === S.length) : [];
      const pw = sel != null && isGroup ? (() => { const L = [sel]; let x = sel; while (true) { x = o(x, sel); if (L.includes(x)) break; L.push(x); } return L; })() : [];
      const colors = ['#dcf2e3', '#e1ecfb', '#f8ecd2', '#ebe5fa', '#f8e0dd', '#ddf1e7', '#fde2ee', '#e8f3eb'];
      q(root, '#tbl').innerHTML = `<table style="border-collapse:collapse;font-family:var(--f-mono);margin:auto"><tr><th style="padding:6px 10px;color:var(--muted)">${op === 'add' ? '+' : '×'}<sub>${n}</sub></th>${S.map(b => `<th style="padding:6px 10px;cursor:pointer;color:${b === sel ? 'var(--brand)' : 'var(--ink)'}" data-s="${b}">${b}</th>`).join('')}</tr>${S.map(a => `<tr><th style="padding:6px 10px;cursor:pointer;color:${a === sel ? 'var(--brand)' : 'var(--ink)'}" data-s="${a}">${a}</th>${S.map(b => { const r = o(a, b); const hl = pw.includes(a) && pw.includes(b); return `<td style="padding:6px 10px;text-align:center;border:1px solid var(--line);background:${hl ? 'var(--brand-soft)' : S.includes(r) ? colors[S.indexOf(r) % colors.length] + '55' : 'var(--bad-soft)'};font-weight:${r === e ? 700 : 400}">${r}</td>`; }).join('')}</tr>`).join('')}</table>`;
      root.querySelectorAll('[data-s]').forEach(t => t.onclick = () => { sel = +t.dataset.s === sel ? null : +t.dataset.s; build(); });
      const subs = isGroup ? [...new Set(S.map(a => { const L = [a]; let x = a; while (true) { x = o(x, a); if (L.includes(x)) break; L.push(x); } return L.sort((p, q2) => p - q2).join(','); }))].sort((p, q2) => p.split(',').length - q2.split(',').length) : [];
      q(panel, '#out').innerHTML = `Set: {${S.join(', ')}}, order ${S.length}<br>Closed: ${closed ? '✓' : '✗'} · Identity: ${e !== undefined ? e : 'none'} · Inverses: ${isGroup ? '✓' : '✗'} · Associative: ✓ (modular arithmetic)<br><b>${isGroup ? 'This is a group' : 'Not a group'}</b>${isGroup ? `<br><br>Orders: ${S.map(a => `${a}→${order(a)}`).join(', ')}<br>${gen.length ? `Cyclic, generators: ${gen.join(', ')}` : 'Not cyclic'}<br>Cyclic subgroups: ${subs.map(s => '{' + s + '}').join(', ')}<br>Lagrange: every subgroup order divides ${S.length}${sel != null ? `<br><br>⟨${sel}⟩ = {${pw.join(', ')}}` : ''}` : ''}`; }
    bindSeg(panel, 'op', k => { op = k; sel = null; build(); }); bindSlider(panel, 'n', () => { sel = null; build(); }); q(panel, '#unit').onchange = build;
    build(); return () => {};
  }
};

/* =============================================================== recurrence relations */
VIS.recurrence = {
  name: 'Recurrence relations', group: 'Further Pure',
  desc: 'First- and second-order linear recurrences: plot the terms, find the auxiliary equation and the closed form, and see when the sequence converges, oscillates or diverges.',
  topics: [['fp2', 'recur'], ['pure', 'seq']],
  icon: icon('<path d="M4 34h32"/><circle cx="8" cy="30" r="2" fill="var(--brand)"/><circle cx="14" cy="24" r="2" fill="var(--brand)"/><circle cx="20" cy="26" r="2" fill="var(--brand)"/><circle cx="26" cy="18" r="2" fill="var(--brand)"/><circle cx="32" cy="10" r="2" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${segBtns('o', [['1', 'uₙ₊₁ = a uₙ + b'], ['2', 'uₙ₊₂ = p uₙ₊₁ + q uₙ']], '2')}
      <div id="o1" hidden>${slider('a', 'a', -2, 2, 0.05, 0.5)}${slider('b', 'b', -5, 5, 0.1, 3)}</div>
      <div id="o2">${slider('p', 'p', -3, 3, 0.1, 1)}${slider('q', 'q', -3, 3, 0.1, 1)}</div>
      ${slider('u0', 'u₀ (or u₁)', -5, 5, 0.1, 1)}${slider('u1', 'u₁ (or u₂)', -5, 5, 0.1, 1)}${slider('N', 'terms', 5, 40, 1, 12)}
      <div class="readout" id="out"></div>`);
    let o = '2'; const v = id => +q(panel, '#' + id).value;
    function seq(){ const N = v('N'), u = [v('u0')]; if (o === '1') for (let i = 0; i < N; i++) u.push(v('a') * u[i] + v('b')); else { u.push(v('u1')); for (let i = 1; i < N; i++) u.push(v('p') * u[i] + v('q') * u[i - 1]); } return u; }
    const P = makePlot(stage, {span: 16, cx: 6, cy: 4, equal: false, yspan: 20, xlabel: 'n', ylabel: 'uₙ', draw(ctx, P){ const C = P.C, u = seq(); P.line(u.map((y, i) => [i, y]), C.grid, 1.5); u.forEach((y, i) => P.dot(i, y, 5, C.brand)); if (o === '1' && Math.abs(1 - v('a')) > 1e-9) { const L = v('b') / (1 - v('a')); P.line([[0, L], [60, L]], C.warn, 1.5, [5, 4]); } }});
    function update(){ const u = seq(); const mx = Math.max(...u.map(Math.abs).filter(isFinite), 1); P.yspan = Math.min(1e6, mx * 2.6); P.cy = 0; P.span = v('N') + 4; P.cx = v('N') / 2; P.redraw();
      let s;
      if (o === '1') { const a = v('a'), b = v('b'); s = Math.abs(a - 1) < 1e-9 ? `a = 1: arithmetic, uₙ = u₀ + ${fx(b)}n` : `Fixed point L = b/(1 − a) = ${fx(b / (1 - a), 4)}<br>uₙ = (u₀ − L)·${fx(a)}ⁿ + L<br>${Math.abs(a) < 1 ? 'Converges to L' : Math.abs(a) === 1 ? 'Oscillates' : 'Diverges'}${a < 0 ? ' (alternating)' : ''}`; }
      else { const p = v('p'), qq = v('q'), D = p * p + 4 * qq;
        if (D > 1e-9) { const r1 = (p + Math.sqrt(D)) / 2, r2 = (p - Math.sqrt(D)) / 2; s = `Auxiliary equation: r² − ${fx(p)}r − ${fx(qq)} = 0<br>Roots r = ${fx(r1, 4)}, ${fx(r2, 4)}<br>uₙ = A(${fx(r1, 4)})ⁿ + B(${fx(r2, 4)})ⁿ`; }
        else if (Math.abs(D) <= 1e-9) { s = `Repeated root r = ${fx(p / 2, 4)}<br>uₙ = (A + Bn)(${fx(p / 2, 4)})ⁿ`; }
        else { const R = Math.sqrt(-qq), th = Math.atan2(Math.sqrt(-D) / 2, p / 2); s = `Complex roots ${fx(p / 2, 3)} ± ${fx(Math.sqrt(-D) / 2, 3)}i<br>uₙ = ${fx(R, 3)}ⁿ(A cos ${fx(th, 3)}n + B sin ${fx(th, 3)}n)`; }
        const big = Math.max(...[(p + Math.sqrt(Math.abs(D))) / 2, (p - Math.sqrt(Math.abs(D))) / 2].map(Math.abs), D < 0 ? Math.sqrt(-qq) : 0); s += `<br>${big < 1 ? 'Terms → 0' : big === 1 ? 'Bounded / periodic' : 'Grows without bound'}`; }
      q(panel, '#out').innerHTML = s + '<br><br>First terms: ' + u.slice(0, 10).map(x => fx(x, 3)).join(', '); }
    bindSeg(panel, 'o', k => { o = k; q(panel, '#o1').hidden = k !== '1'; q(panel, '#o2').hidden = k !== '2'; update(); });
    ['a', 'b', 'p', 'q', 'u0', 'u1', 'N'].forEach(id => bindSlider(panel, id, update)); update(); return () => P.destroy();
  }
};
})();
