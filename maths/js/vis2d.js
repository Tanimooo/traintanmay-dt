/* 2D visualisers for TrainTanmay Maths */
(function(){
'use strict';
const {makePlot, layout, slider, bindSlider, fx, compile} = window.PLOT;
const VIS = window.VIS;
const icon = p => `<svg viewBox="0 0 40 40" fill="none" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const q = (r, s) => r.querySelector(s);

/* =============================================================== 2D matrix transformations */
VIS.matrix2d = {
  name: '2D matrix transformations', group: 'Matrices & vectors',
  desc: 'Type a 2×2 matrix or drag the image of i and j. See the unit square, determinant (area scale factor), invariant lines and lines of invariant points.',
  topics: [['cp1', 'transf'], ['cp1', 'matrices'], ['fp2', 'matrix']],
  icon: icon('<path d="M6 34V6M6 34h28"/><rect x="6" y="20" width="14" height="14" fill="var(--brand-soft)"/><path d="M6 34l18-6 6-18-18 6z" stroke="var(--accent)"/>'),
  mount(root){
    const PRE = [['I', 'Identity', [1, 0, 0, 1]], ['rot', 'Rotate θ', null], ['rx', 'Reflect in x-axis', [1, 0, 0, -1]], ['ry', 'Reflect in y-axis', [-1, 0, 0, 1]], ['ryx', 'Reflect in y = x', [0, 1, 1, 0]],
      ['ryn', 'Reflect in y = −x', [0, -1, -1, 0]], ['refl', 'Reflect in y = x tan θ', null], ['en', 'Enlarge ×2', [2, 0, 0, 2]], ['sx', 'Stretch x ×2', [2, 0, 0, 1]], ['sy', 'Stretch y ×3', [1, 0, 0, 3]],
      ['shx', 'Shear x', [1, 1.5, 0, 1]], ['shy', 'Shear y', [1, 0, 1, 1]], ['sing', 'Singular', [1, 2, 0.5, 1]]];
    const {stage, panel} = layout(root, `
      <div><h4>Matrix M</h4><div class="mat" style="grid-template-columns:repeat(2,auto);margin-top:8px"><input id="a" aria-label="a"><input id="b" aria-label="b"><input id="c" aria-label="c"><input id="d" aria-label="d"></div></div>
      <div><h4>Presets</h4><div class="presets" style="margin-top:8px">${PRE.map(([k, l]) => `<button class="btn sm" data-p="${k}">${l}</button>`).join('')}</div></div>
      ${slider('th', 'θ (°)', -180, 180, 5, 45)}
      ${slider('t', 'Animate', 0, 1, 0.01, 1, v => Math.round(v * 100) + '%')}
      <div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="gridT" checked>Transformed grid</label><label class="tog"><input type="checkbox" id="shapeF" checked>Shape “F”</label><label class="tog"><input type="checkbox" id="snap" checked>Snap 0.5</label><button class="btn sm" id="play">Play</button></div>
      <div class="readout" id="out"></div>
      <p class="note">Drag the purple and blue arrow tips to change the matrix directly: the first column is where <b>i</b> goes, the second column is where <b>j</b> goes.</p>`, {hud: 'Drag arrow tips · drag background to pan · scroll to zoom'});
    let M = [2, 1, 1, 1.5], t = 1, th = 45, preset = null;
    const inputs = ['a', 'b', 'c', 'd'].map(k => q(panel, '#' + k));
    const setInputs = () => inputs.forEach((el, i) => { el.value = fx(M[i], 3); });
    const cur = () => { const [a, b, c, d] = M; return [1 + t * (a - 1), t * b, t * c, 1 + t * (d - 1)]; };
    const ap = (m, x, y) => [m[0] * x + m[1] * y, m[2] * x + m[3] * y];
    function eig(m){
      const [a, b, c, d] = m, tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
      if (disc < -1e-9) return [];
      const ls = disc < 1e-9 ? [tr / 2] : [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2];
      const out = [];
      for (const l of ls) {
        let v;
        if (Math.abs(b) > 1e-9) v = [b, l - a]; else if (Math.abs(c) > 1e-9) v = [l - d, c];
        else { // diagonal
          if (Math.abs(a - d) < 1e-9) { out.push({l, v: null, all: true}); continue; }
          v = Math.abs(l - a) < 1e-9 ? [1, 0] : [0, 1];
        }
        const n = Math.hypot(...v); out.push({l, v: [v[0] / n, v[1] / n]});
      }
      return out;
    }
    const P = makePlot(stage, {span: 9, cx: 1, cy: 1, draw(ctx, P){
      const C = P.C, m = cur(), b = P.bounds();
      if (q(panel, '#gridT').checked) {
        ctx.globalAlpha = .55;
        for (let k = Math.floor(Math.min(b.x0, b.y0)) - 6; k <= Math.ceil(Math.max(b.x1, b.y1)) + 6; k++) {
          P.line([ap(m, k, -40), ap(m, k, 40)], C.accSoft, 1); P.line([ap(m, -40, k), ap(m, 40, k)], C.accSoft, 1);
        }
        ctx.globalAlpha = 1;
      }
      // invariant lines
      const E = eig(m);
      E.forEach(e => { if (!e.v) return; const [vx, vy] = e.v; const pts = [[-50 * vx, -50 * vy], [50 * vx, 50 * vy]];
        if (Math.abs(e.l - 1) < 1e-6) P.line(pts, C.good, 3); else P.line(pts, C.warn, 2, [8, 6]); });
      const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
      P.poly(sq, C.soft, C.brand, 2);
      P.poly(sq.map(([x, y]) => ap(m, x, y)), 'color-mix(in srgb,' + C.accent + ' 22%,transparent)', C.accent, 2.5);
      if (q(panel, '#shapeF').checked) {
        const F = [[0.2, 0.15], [0.35, 0.15], [0.35, 0.45], [0.6, 0.45], [0.6, 0.58], [0.35, 0.58], [0.35, 0.72], [0.7, 0.72], [0.7, 0.85], [0.2, 0.85]];
        P.poly(F, C.brand, null); P.poly(F.map(([x, y]) => ap(m, x, y)), C.accent, null);
      }
      P.arrow(0, 0, m[0], m[2], C.accent, 3); P.arrow(0, 0, m[1], m[3], C.blue, 3);
      P.dot(m[0], m[2], 7, C.accent, C.bg); P.dot(m[1], m[3], 7, C.blue, C.bg);
      P.text('M i', m[0], m[2], C.accent, {dx: 9, dy: -8, font: '700 15px IBM Plex Sans, sans-serif'}); P.text('M j', m[1], m[3], C.blue, {dx: 9, dy: -8, font: '700 15px IBM Plex Sans, sans-serif'});
    }, onDown(w){
      const m = cur(); const hit = (x, y) => Math.hypot(w[0] - x, w[1] - y) < 12 / P.scale();
      if (hit(m[0], m[2])) { drag = 'i'; return true; } if (hit(m[1], m[3])) { drag = 'j'; return true; } return false;
    }, onMove(w){
      const s = q(panel, '#snap').checked ? v => Math.round(v * 2) / 2 : v => Math.round(v * 100) / 100;
      t = 1; q(panel, '#t').value = 1; q(panel, '#t-o').textContent = '100%';
      if (drag === 'i') { M[0] = s(w[0]); M[2] = s(w[1]); } else { M[1] = s(w[0]); M[3] = s(w[1]); }
      preset = null; setInputs(); update();
    }, onUp(){ drag = null; }});
    let drag = null;
    function update(){
      P.redraw();
      const m = M, det = m[0] * m[3] - m[1] * m[2], E = eig(m);
      const lines = E.map(e => e.all ? `every line through O is invariant (λ = ${fx(e.l)})` : `λ = ${fx(e.l)}: y = ${Math.abs(e.v[0]) < 1e-9 ? '∞·x (x = 0)' : fx(e.v[1] / e.v[0], 3) + 'x'}${Math.abs(e.l - 1) < 1e-6 ? ' – <b>line of invariant points</b>' : ''}`);
      const inv = Math.abs(det) > 1e-9 ? `[[${fx(m[3] / det, 3)}, ${fx(-m[1] / det, 3)}], [${fx(-m[2] / det, 3)}, ${fx(m[0] / det, 3)}]]` : 'none (det = 0)';
      q(panel, '#out').innerHTML = `det M = <b>${fx(det, 3)}</b> → areas ×${fx(Math.abs(det), 3)}${det < 0 ? ', orientation reversed (the F is mirrored)' : ''}${Math.abs(det) < 1e-9 ? ' – <b>singular</b>: the plane collapses onto a line' : ''}<br>
        M<sup>−1</sup> = ${inv}<br>Invariant lines through O:<br>${lines.length ? lines.join('<br>') : 'none (complex eigenvalues – e.g. a rotation)'}<br>
        <span style="color:var(--good)">━ line of invariant points</span> · <span style="color:var(--warn)">┅ invariant line</span>`;
    }
    inputs.forEach((el, i) => el.addEventListener('input', () => { const v = parseFloat(el.value); if (isFinite(v)) { M[i] = v; preset = null; update(); } }));
    function applyPreset(k){
      preset = k; const r = th * Math.PI / 180;
      if (k === 'rot') M = [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r)];
      else if (k === 'refl') M = [Math.cos(2 * r), Math.sin(2 * r), Math.sin(2 * r), -Math.cos(2 * r)];
      else M = PRE.find(p => p[0] === k)[2].slice();
      M = M.map(v => Math.round(v * 1e6) / 1e6); setInputs(); update();
    }
    panel.querySelectorAll('[data-p]').forEach(b => b.onclick = () => applyPreset(b.dataset.p));
    bindSlider(panel, 'th', v => { th = v; if (preset === 'rot' || preset === 'refl') applyPreset(preset); });
    bindSlider(panel, 't', v => { t = v; P.redraw(); }, v => Math.round(v * 100) + '%');
    ['gridT', 'shapeF'].forEach(id => q(panel, '#' + id).onchange = () => P.redraw());
    let raf = null;
    q(panel, '#play').onclick = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const step = now => { t = Math.min(1, (now - t0) / 1600); t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; q(panel, '#t').value = t; q(panel, '#t-o').textContent = Math.round(t * 100) + '%'; P.redraw(); if (now - t0 < 1600) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); };
    setInputs(); update();
    return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== Argand diagram */
VIS.argand = {
  name: 'Argand diagram & loci', group: 'Complex numbers',
  desc: 'Drag complex numbers to see sums, products, modulus and argument; draw loci and regions; plot the n-th roots of any complex number.',
  topics: [['cp1', 'complex'], ['cp1', 'argand'], ['cp2', 'complex'], ['fp2', 'complex']],
  icon: icon('<path d="M4 20h32M20 36V4"/><circle cx="26" cy="14" r="2.5" fill="var(--accent)" stroke="var(--accent)"/><path d="M20 20l6-6" stroke="var(--accent)"/><circle cx="20" cy="20" r="11" stroke-dasharray="3 3"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      <div class="seg" role="group" aria-label="Mode"><button data-m="ops" aria-pressed="true">Operations</button><button data-m="loci" aria-pressed="false">Loci</button><button data-m="roots" aria-pressed="false">Roots</button></div>
      <div id="opsP"><h4>Show</h4><div class="row" style="gap:10px;margin-top:8px"><label class="tog"><input type="checkbox" id="sum" checked>z₁ + z₂</label><label class="tog"><input type="checkbox" id="prod" checked>z₁z₂</label><label class="tog"><input type="checkbox" id="quot">z₁ / z₂</label><label class="tog"><input type="checkbox" id="conj">z₁*</label></div></div>
      <div id="lociP" hidden><h4>Locus</h4><select class="sel" id="ltype" style="display:block;width:100%;margin-top:8px"><option value="circle">|z − a| = r (circle)</option><option value="bis">|z − a| = |z − b| (perpendicular bisector)</option><option value="arg">arg(z − a) = θ (half-line)</option></select>
        <div style="margin-top:10px">${slider('lr', 'r', 0.5, 6, 0.1, 2)}${slider('lth', 'θ (°)', -180, 180, 5, 45)}</div>
        <select class="sel" id="ineq" style="display:block;width:100%;margin-top:8px"><option value="eq">= (just the locus)</option><option value="lt">&lt; (shade inside / nearer a / between)</option><option value="gt">&gt; (shade outside / nearer b)</option></select>
        <p class="muted" style="font-size:.84rem;margin-top:8px">Drag the points a and b.</p></div>
      <div id="rootsP" hidden>${slider('n', 'n', 2, 12, 1, 5)}<p class="muted" style="font-size:.84rem">Solves zⁿ = w. Drag w. Roots lie on a circle of radius |w|^(1/n), equally spaced by 2π/n.</p></div>
      <div class="readout" id="out"></div>`, {hud: 'Drag points · drag background to pan'});
    let mode = 'ops', z1 = [2, 1], z2 = [1, 2], a = [1, 1], b = [3, -1], w = [2, 2], drag = null;
    const mul = (p, r) => [p[0] * r[0] - p[1] * r[1], p[0] * r[1] + p[1] * r[0]];
    const div = (p, r) => { const d = r[0] ** 2 + r[1] ** 2; return [(p[0] * r[0] + p[1] * r[1]) / d, (p[1] * r[0] - p[0] * r[1]) / d]; };
    const mod = p => Math.hypot(p[0], p[1]), arg = p => Math.atan2(p[1], p[0]);
    const zs = p => `${fx(p[0])} ${p[1] < 0 ? '−' : '+'} ${fx(Math.abs(p[1]))}i`;
    const pa = p => `|z| = ${fx(mod(p), 3)}, arg z = ${fx(arg(p), 3)} rad (${fx(arg(p) * 180 / Math.PI, 1)}°)`;
    const P = makePlot(stage, {span: 12, cx: 1.5, cy: 1, xlabel: 'Re', ylabel: 'Im', draw(ctx, P){
      const C = P.C;
      if (mode === 'ops') {
        const show = id => q(panel, '#' + id).checked;
        if (show('sum')) { const s = [z1[0] + z2[0], z1[1] + z2[1]]; P.line([z1, s, z2], C.muted, 1.5, [5, 5]); P.arrow(0, 0, s[0], s[1], C.good); P.text('z₁+z₂', s[0], s[1], C.good, {dx: 6}); }
        if (show('prod')) { const p = mul(z1, z2); P.arrow(0, 0, p[0], p[1], C.warn); P.text('z₁z₂', p[0], p[1], C.warn, {dx: 6}); }
        if (show('quot')) { const p = div(z1, z2); P.arrow(0, 0, p[0], p[1], C.bad); P.text('z₁/z₂', p[0], p[1], C.bad, {dx: 6}); }
        if (show('conj')) { P.arrow(0, 0, z1[0], -z1[1], C.muted); P.text('z₁*', z1[0], -z1[1], C.muted, {dx: 6}); }
        [[z1, 'z₁', C.accent], [z2, 'z₂', C.blue]].forEach(([p, l, c]) => { P.arrow(0, 0, p[0], p[1], c, 3); P.dot(p[0], p[1], 7, c, C.bg); P.text(l, p[0], p[1], c, {dx: 8, dy: -6}); });
        // argument arc for z1
        const [ox, oy] = P.toS(0, 0); ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ox, oy, 26, 0, -arg(z1), arg(z1) > 0); ctx.stroke();
      } else if (mode === 'loci') {
        const ty = q(panel, '#ltype').value, iq = q(panel, '#ineq').value, r = +q(panel, '#lr').value, th = +q(panel, '#lth').value * Math.PI / 180;
        const shade = 'color-mix(in srgb,' + C.brand + ' 18%,transparent)';
        if (ty === 'circle') {
          const [cx, cy] = P.toS(a[0], a[1]), R = r * P.scale();
          if (iq !== 'eq') { ctx.fillStyle = shade; ctx.beginPath(); if (iq === 'lt') ctx.arc(cx, cy, R, 0, 7); else { ctx.rect(0, 0, P.w, P.h); ctx.arc(cx, cy, R, 0, 7, true); } ctx.fill(); }
          ctx.strokeStyle = C.brand; ctx.lineWidth = 2.5; ctx.setLineDash(iq === 'eq' ? [] : [7, 5]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        } else if (ty === 'bis') {
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = 80;
          const p1 = [mx - dy * L, my + dx * L], p2 = [mx + dy * L, my - dx * L];
          if (iq !== 'eq') { const side = iq === 'lt' ? -1 : 1; P.poly([p1, p2, [p2[0] + side * dx * L, p2[1] + side * dy * L], [p1[0] + side * dx * L, p1[1] + side * dy * L]], shade); }
          P.line([a, b], C.muted, 1.5, [4, 4]); P.line([p1, p2], C.brand, 2.5, iq === 'eq' ? [] : [7, 5]);
          P.dot(b[0], b[1], 7, C.blue, C.bg); P.text('b', b[0], b[1], C.blue, {dx: 8});
        } else {
          const end = [a[0] + 80 * Math.cos(th), a[1] + 80 * Math.sin(th)];
          if (iq !== 'eq') { const [ax, ay] = P.toS(a[0], a[1]); ctx.fillStyle = shade; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.arc(ax, ay, 4000, iq === 'lt' ? 0 : -th, iq === 'lt' ? -th : -Math.PI, iq === 'lt'); ctx.closePath(); ctx.fill(); }
          P.line([a, end], C.brand, 2.5, iq === 'eq' ? [] : [7, 5]);
          const [ax, ay] = P.toS(a[0], a[1]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ax, ay, 28, 0, -th, th > 0); ctx.stroke();
          P.line([a, [a[0] + 3, a[1]]], C.muted, 1, [3, 3]);
        }
        P.dot(a[0], a[1], 7, C.accent, C.bg); P.text('a', a[0], a[1], C.accent, {dx: 8});
      } else {
        const n = +q(panel, '#n').value, R = Math.pow(mod(w), 1 / n), t0 = arg(w) / n;
        const [ox, oy] = P.toS(0, 0); ctx.strokeStyle = C.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(ox, oy, R * P.scale(), 0, 7); ctx.stroke(); ctx.setLineDash([]);
        const pts = []; for (let k = 0; k < n; k++) pts.push([R * Math.cos(t0 + 2 * Math.PI * k / n), R * Math.sin(t0 + 2 * Math.PI * k / n)]);
        P.poly(pts, 'color-mix(in srgb,' + C.brand + ' 12%,transparent)', C.brand, 1.5);
        pts.forEach((p, k) => { P.line([[0, 0], p], C.grid, 1); P.dot(p[0], p[1], 6, C.brand); P.text('z' + k, p[0], p[1], C.brand, {dx: 6}); });
        P.arrow(0, 0, w[0], w[1], C.accent, 2.5); P.dot(w[0], w[1], 7, C.accent, C.bg); P.text('w', w[0], w[1], C.accent, {dx: 8});
      }
    }, onDown(p){
      const near = z => Math.hypot(p[0] - z[0], p[1] - z[1]) < 14 / P.scale();
      const cands = mode === 'ops' ? [['z1', z1], ['z2', z2]] : mode === 'loci' ? [['a', a], ['b', b]] : [['w', w]];
      for (const [k, z] of cands) if (near(z)) { drag = k; return true; } return false;
    }, onMove(p){ const s = [Math.round(p[0] * 4) / 4, Math.round(p[1] * 4) / 4]; ({z1: () => z1 = s, z2: () => z2 = s, a: () => a = s, b: () => b = s, w: () => w = s})[drag](); update(); }, onUp(){ drag = null; }});
    function update(){
      P.redraw();
      let o = '';
      if (mode === 'ops') { const p = mul(z1, z2); o = `z₁ = ${zs(z1)}<br>&nbsp;&nbsp;${pa(z1)}<br>z₂ = ${zs(z2)}<br>&nbsp;&nbsp;${pa(z2)}<br>z₁z₂ = ${zs(p)}<br>&nbsp;&nbsp;|z₁z₂| = |z₁||z₂| = ${fx(mod(p), 3)}<br>&nbsp;&nbsp;arg(z₁z₂) = arg z₁ + arg z₂ (± 2π)<br>z₁/z₂ = ${zs(div(z1, z2))}`; }
      else if (mode === 'loci') { const ty = q(panel, '#ltype').value, r = +q(panel, '#lr').value, th = +q(panel, '#lth').value;
        o = ty === 'circle' ? `|z − (${zs(a)})| = ${r}<br>Circle, centre (${fx(a[0])}, ${fx(a[1])}), radius ${r}<br>Cartesian: (x − ${fx(a[0])})² + (y − ${fx(a[1])})² = ${fx(r * r, 3)}` :
          ty === 'bis' ? `|z − (${zs(a)})| = |z − (${zs(b)})|<br>Perpendicular bisector of a and b<br>Midpoint (${fx((a[0] + b[0]) / 2)}, ${fx((a[1] + b[1]) / 2)}), gradient ${Math.abs(b[1] - a[1]) < 1e-9 ? '∞ (vertical)' : fx(-(b[0] - a[0]) / (b[1] - a[1]), 3)}` :
          `arg(z − (${zs(a)})) = ${th}° = ${fx(th * Math.PI / 180, 3)} rad<br>Half-line from a (a itself is not included)`; }
      else { const n = +q(panel, '#n').value, R = Math.pow(mod(w), 1 / n); o = `zⁿ = w with n = ${n}, w = ${zs(w)}<br>|z| = |w|^(1/${n}) = ${fx(R, 4)}<br>arg z = (arg w + 2kπ)/${n}, k = 0…${n - 1}<br>Sum of the roots = 0`; }
      q(panel, '#out').innerHTML = o;
    }
    panel.querySelectorAll('[data-m]').forEach(bt => bt.onclick = () => { mode = bt.dataset.m; panel.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === bt)); ['ops', 'loci', 'roots'].forEach(k => q(panel, '#' + k + 'P').hidden = k !== mode); update(); });
    panel.querySelectorAll('input[type=checkbox],select').forEach(el => el.onchange = update);
    ['lr', 'lth', 'n'].forEach(id => bindSlider(panel, id, update));
    update();
    return () => P.destroy();
  }
};

/* =============================================================== polar curves */
VIS.polar = {
  name: 'Polar curves & areas', group: 'Further calculus',
  desc: 'Plot r = f(θ), trace the curve as θ sweeps, and shade the area ½∫r² dθ between any two angles.',
  topics: [['cp2', 'polar']],
  icon: icon('<path d="M20 20m-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0" stroke="var(--line-strong)"/><path d="M20 20c0-8 12-12 12-2s-12 14-12 2c0-6-10-6-10 0s10 8 10 0" stroke="var(--accent)"/>'),
  mount(root){
    const PRE = [['3(1+cos(t))', 'Cardioid'], ['2+cos(t)', 'Limaçon'], ['1+2cos(t)', 'Limaçon (inner loop)'], ['3cos(3t)', 'Rose (3 petals)'], ['3sin(2t)', 'Rose (4 petals)'], ['0.5t', 'Spiral r = θ/2'], ['3sqrt(cos(2t))', 'Lemniscate'], ['4sec(t)', 'Line x = 4']];
    const {stage, panel} = layout(root, `
      <label class="field">r = f(θ) – use t for θ<input id="f" value="3(1+cos(t))" spellcheck="false" style="font-family:var(--f-mono)"></label>
      <div class="presets">${PRE.map(([f, l]) => `<button class="btn sm" data-f="${f}">${l}</button>`).join('')}</div>
      ${slider('a', 'α', 0, 6.28, 0.01, 0, v => fx(v / Math.PI, 2) + 'π')}${slider('b', 'β', 0, 6.28, 0.01, 1.57, v => fx(v / Math.PI, 2) + 'π')}
      <div class="row"><button class="btn sm" id="trace">Trace θ from 0 to 2π</button><label class="tog"><input type="checkbox" id="neg">Show r &lt; 0 parts</label></div>
      <div class="readout" id="out"></div>
      <p class="note">On Edexcel, r ≥ 0 – parts of the curve where r would be negative are not drawn (tick the box to see them dashed).</p>`);
    let f = compile('3(1+cos(t))', ['t']), tr = null, raf = null;
    const P = makePlot(stage, {span: 14, draw(ctx, P){
      const C = P.C, A = +q(panel, '#a').value, B = +q(panel, '#b').value, N = 900, neg = q(panel, '#neg').checked;
      // radial guides
      ctx.save(); ctx.globalAlpha = .6; for (let k = 0; k < 12; k++) { const t = k * Math.PI / 6; P.line([[0, 0], [30 * Math.cos(t), 30 * Math.sin(t)]], C.grid, 1); } ctx.restore();
      // area
      const lo = Math.min(A, B), hi = Math.max(A, B);
      ctx.beginPath(); const [ox, oy] = P.toS(0, 0); ctx.moveTo(ox, oy);
      for (let i = 0; i <= 300; i++) { const t = lo + (hi - lo) * i / 300; let r = f(t); if (!isFinite(r) || r < 0) r = 0; const [x, y] = P.toS(r * Math.cos(t), r * Math.sin(t)); ctx.lineTo(x, y); }
      ctx.closePath(); ctx.fillStyle = 'color-mix(in srgb,' + C.brand + ' 25%,transparent)'; ctx.fill();
      const seg = (cond, color, dash) => { ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false;
        for (let i = 0; i <= N; i++) { const t = 2 * Math.PI * i / N; const r = f(t); if (!isFinite(r) || !cond(r) || Math.abs(r) > 200) { pen = false; continue; } const [x, y] = P.toS(r * Math.cos(t), r * Math.sin(t)); pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; }
        ctx.stroke(); ctx.setLineDash([]); };
      seg(r => r >= 0, C.accent); if (neg) seg(r => r < 0, C.muted, [5, 5]);
      [A, B].forEach((t, i) => { P.line([[0, 0], [20 * Math.cos(t), 20 * Math.sin(t)]], i ? C.warn : C.blue, 1.5, [6, 4]); P.text(i ? 'β' : 'α', 4.5 * Math.cos(t), 4.5 * Math.sin(t), i ? C.warn : C.blue); });
      if (tr != null) { const r = f(tr); if (isFinite(r)) { const p = [r * Math.cos(tr), r * Math.sin(tr)]; P.line([[0, 0], p], C.ink2, 1.5); P.dot(p[0], p[1], 6, r >= 0 ? C.accent : C.muted, C.bg); } }
    }});
    function area(){ const A = +q(panel, '#a').value, B = +q(panel, '#b').value, lo = Math.min(A, B), hi = Math.max(A, B), n = 2000; let s = 0;
      for (let i = 0; i < n; i++) { const t = lo + (hi - lo) * (i + .5) / n; let r = f(t); if (!isFinite(r) || r < 0) r = 0; s += .5 * r * r; } return s * (hi - lo) / n; }
    function update(){ P.redraw(); const A = +q(panel, '#a').value, B = +q(panel, '#b').value; q(panel, '#out').innerHTML = `Area = ½∫ r² dθ from ${fx(Math.min(A, B) / Math.PI, 3)}π to ${fx(Math.max(A, B) / Math.PI, 3)}π<br>≈ <b>${fx(area(), 5)}</b> (numerical, r &lt; 0 treated as 0)`; }
    q(panel, '#f').addEventListener('input', e => { try { f = compile(e.target.value, ['t', 'θ']); e.target.style.borderColor = ''; update(); } catch(err) { e.target.style.borderColor = 'var(--bad)'; } });
    panel.querySelectorAll('[data-f]').forEach(bt => bt.onclick = () => { q(panel, '#f').value = bt.dataset.f; f = compile(bt.dataset.f, ['t']); update(); });
    ['a', 'b'].forEach(id => bindSlider(panel, id, update, v => fx(v / Math.PI, 2) + 'π'));
    q(panel, '#neg').onchange = update;
    q(panel, '#trace').onclick = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const step = now => { tr = Math.min(1, (now - t0) / 4000) * 2 * Math.PI; P.redraw(); if (tr < 2 * Math.PI) raf = requestAnimationFrame(step); else { tr = null; P.redraw(); } }; raf = requestAnimationFrame(step); };
    update();
    return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== conic sections */
VIS.conics = {
  name: 'Conic sections', group: 'Further Pure',
  desc: 'Parabola, ellipse, hyperbola and rectangular hyperbola with foci, directrices and eccentricity. Drag P to check that PS = e × PM.',
  topics: [['fp1', 'conic1'], ['fp1', 'conic2']],
  icon: icon('<ellipse cx="20" cy="20" rx="15" ry="9" stroke="var(--accent)"/><circle cx="9" cy="20" r="1.8" fill="var(--brand)"/><circle cx="31" cy="20" r="1.8" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      <div class="seg" role="group" aria-label="Conic"><button data-c="par" aria-pressed="true">Parabola</button><button data-c="ell" aria-pressed="false">Ellipse</button><button data-c="hyp" aria-pressed="false">Hyperbola</button><button data-c="rect" aria-pressed="false">xy = c²</button></div>
      ${slider('a', 'a', 0.5, 6, 0.1, 2)}${slider('b', 'b', 0.5, 6, 0.1, 1.5)}${slider('tp', 'Point P (parameter)', -3, 3, 0.01, 0.8)}
      <div class="readout" id="out"></div>`, {hud: 'Drag to pan · scroll to zoom'});
    let type = 'par';
    const P = makePlot(stage, {span: 16, draw(ctx, P){
      const C = P.C, a = +q(panel, '#a').value, b = +q(panel, '#b').value, tp = +q(panel, '#tp').value;
      let pt, S, dirX = null, e;
      if (type === 'par') { ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = -200; i <= 200; i++) { const t = i / 20; const [x, y] = P.toS(a * t * t, 2 * a * t); i === -200 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
        pt = [a * tp * tp, 2 * a * tp]; S = [a, 0]; dirX = -a; e = 1; }
      else if (type === 'ell') { ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 300; i++) { const t = 2 * Math.PI * i / 300; const [x, y] = P.toS(a * Math.cos(t), b * Math.sin(t)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        const A = Math.max(a, b); e = Math.sqrt(1 - Math.min(a, b) ** 2 / A ** 2); pt = [a * Math.cos(tp), b * Math.sin(tp)];
        if (a >= b) { S = [a * e, 0]; dirX = e > 1e-6 ? a / e : null; P.dot(-a * e, 0, 5, C.brand); } else { S = [0, b * e]; dirX = null; P.dot(0, -b * e, 5, C.brand); if (e > 1e-6) P.line([[-40, b / e], [40, b / e]], C.warn, 2, [7, 5]); } }
      else if (type === 'hyp') { e = Math.sqrt(1 + b * b / a / a); ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; [1, -1].forEach(s => { ctx.beginPath(); for (let i = -150; i <= 150; i++) { const t = i / 40; const [x, y] = P.toS(s * a * Math.cosh(t), b * Math.sinh(t)); i === -150 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); });
        P.line([[-40, -40 * b / a], [40, 40 * b / a]], C.muted, 1.5, [4, 4]); P.line([[-40, 40 * b / a], [40, -40 * b / a]], C.muted, 1.5, [4, 4]);
        pt = [a * Math.cosh(tp), b * Math.sinh(tp)]; S = [a * e, 0]; dirX = a / e; P.dot(-a * e, 0, 5, C.brand); }
      else { const c = a; e = Math.SQRT2; ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; [1, -1].forEach(s => { ctx.beginPath(); for (let i = 1; i <= 300; i++) { const t = s * i / 20; const [x, y] = P.toS(c * t, c / t); i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); });
        const tt = Math.abs(tp) < .05 ? .05 : tp; pt = [c * tt, c / tt]; S = [c * Math.SQRT2, c * Math.SQRT2]; P.dot(-S[0], -S[1], 5, C.brand);
        P.line([[-40, 40 - c * Math.SQRT2], [40, -40 - c * Math.SQRT2]], C.warn, 2, [7, 5]); P.line([[-40, 40 + c * Math.SQRT2], [40, -40 + c * Math.SQRT2]], C.warn, 2, [7, 5]); }
      P.dot(S[0], S[1], 6, C.brand); P.text('S', S[0], S[1], C.brand, {dx: 6, dy: -4});
      if (dirX != null) { P.line([[dirX, -40], [dirX, 40]], C.warn, 2, [7, 5]); P.text('directrix', dirX, P.bounds().y1, C.warn, {dx: 4, base: 'top', dy: 4});
        if (type !== 'ell' || a >= b) { P.line([[-dirX, -40], [-dirX, 40]], C.warn, 1.2, [3, 6]); } }
      P.line([pt, S], C.brand, 2); if (dirX != null) P.line([pt, [dirX, pt[1]]], C.warn, 2);
      P.dot(pt[0], pt[1], 7, C.accent, C.bg); P.text('P', pt[0], pt[1], C.accent, {dx: 8, dy: -4});
      const PS = Math.hypot(pt[0] - S[0], pt[1] - S[1]), PM = dirX != null ? Math.abs(pt[0] - dirX) : null;
      out(e, PS, PM, a, b, pt);
    }});
    function out(e, PS, PM, a, b, pt){
      const eqs = {par: `y² = 4ax = ${fx(4 * a)}x<br>Focus S(${fx(a)}, 0), directrix x = −${fx(a)}<br>P(at², 2at)`, ell: `x²/${fx(a * a)} + y²/${fx(b * b)} = 1<br>b² = a²(1 − e²)<br>Foci (±ae, 0), directrices x = ±a/e`,
        hyp: `x²/${fx(a * a)} − y²/${fx(b * b)} = 1<br>b² = a²(e² − 1)<br>Foci (±ae, 0), directrices x = ±a/e, asymptotes y = ±(b/a)x`, rect: `xy = c² with c = ${fx(a)}<br>P(ct, c/t), foci (±√2c, ±√2c), e = √2<br>Directrices x + y = ±√2c`};
      q(panel, '#out').innerHTML = `${eqs[type]}<br>e = <b>${fx(e, 4)}</b><br>P = (${fx(pt[0])}, ${fx(pt[1])})<br>PS = ${fx(PS, 3)}${PM != null ? `, PM = ${fx(PM, 3)}, PS/PM = <b>${fx(PS / PM, 3)}</b>` : ''}`;
    }
    panel.querySelectorAll('[data-c]').forEach(bt => bt.onclick = () => { type = bt.dataset.c; panel.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', x === bt)); q(panel, '#b').closest('.slider').style.display = (type === 'ell' || type === 'hyp') ? '' : 'none'; P.redraw(); });
    q(panel, '#b').closest('.slider').style.display = 'none';
    ['a', 'b', 'tp'].forEach(id => bindSlider(panel, id, () => P.redraw()));
    return () => P.destroy();
  }
};

/* =============================================================== graph transformations */
VIS.graphs = {
  name: 'Graph transformations', group: 'Pure',
  desc: 'See how y = a·f(b(x + c)) + d stretches, reflects and translates a graph – and the order the transformations happen in.',
  topics: [['pure', 'alg'], ['pure', 'trig'], ['pure', 'exp']],
  icon: icon('<path d="M4 30c6 0 8-20 16-20s10 20 16 20" stroke="var(--line-strong)"/><path d="M4 24c6 0 8-14 16-14s10 14 16 14" stroke="var(--accent)"/>'),
  mount(root){
    const BASE = [['x^2', 'x²'], ['x^3', 'x³'], ['1/x', '1/x'], ['abs(x)', '|x|'], ['sin(x)', 'sin x'], ['cos(x)', 'cos x'], ['e^x', 'eˣ'], ['ln(x)', 'ln x'], ['sqrt(x)', '√x']];
    const {stage, panel} = layout(root, `
      <label class="field">f(x)<select class="sel" id="base" style="display:block;width:100%">${BASE.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
      ${slider('a', 'a', -3, 3, 0.1, 1)}${slider('b', 'b', -3, 3, 0.1, 1)}${slider('c', 'c', -5, 5, 0.1, 0)}${slider('d', 'd', -5, 5, 0.1, 0)}
      <button class="btn sm" id="reset">Reset</button>
      <div class="readout" id="out"></div>`);
    let f = compile('x^2');
    const val = id => +q(panel, '#' + id).value;
    const P = makePlot(stage, {span: 16, draw(ctx, P){ const C = P.C, a = val('a'), b = val('b'), c = val('c'), d = val('d');
      P.fn(f, C.muted, 2); P.fn(x => a * f(b * (x + c)) + d, C.accent, 3); }});
    function update(){ P.redraw(); const a = val('a'), b = val('b'), c = val('c'), d = val('d'), s = [];
      if (c) s.push(`translate by (${fx(-c)}, 0) – f(x + c) moves ${c > 0 ? 'left' : 'right'} by ${fx(Math.abs(c))}`);
      if (b !== 1 && b) s.push(b < 0 ? `reflect in the y-axis${b !== -1 ? ' and ' : ''}${b !== -1 ? `stretch parallel to x-axis, scale factor ${fx(1 / Math.abs(b), 3)}` : ''}` : `stretch parallel to x-axis, scale factor 1/${fx(b)} = ${fx(1 / b, 3)}`);
      if (a !== 1) s.push(a < 0 ? `reflect in the x-axis${a !== -1 ? ` and stretch parallel to y-axis, scale factor ${fx(Math.abs(a))}` : ''}` : `stretch parallel to y-axis, scale factor ${fx(a)}`);
      if (d) s.push(`translate by (0, ${fx(d)})`);
      q(panel, '#out').innerHTML = `y = ${fx(val('a'))}·f(${fx(b)}(x ${c < 0 ? '−' : '+'} ${fx(Math.abs(c))})) ${d < 0 ? '−' : '+'} ${fx(Math.abs(d))}<br><br>${s.length ? 'In order:<br>' + s.map((x, i) => `${i + 1}. ${x}`).join('<br>') : 'No transformation'}<br><br><span style="color:var(--muted)">grey: y = f(x)</span>`; }
    q(panel, '#base').onchange = e => { f = compile(e.target.value); update(); };
    ['a', 'b', 'c', 'd'].forEach(id => bindSlider(panel, id, update));
    q(panel, '#reset').onclick = () => { [['a', 1], ['b', 1], ['c', 0], ['d', 0]].forEach(([k, v]) => { q(panel, '#' + k).value = v; q(panel, '#' + k + '-o').textContent = v; }); update(); };
    update();
    return () => P.destroy();
  }
};

/* =============================================================== probability distributions */
function lgamma(z){ const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z); z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x); }
const lnC = (n, k) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
function erf(x){ const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
VIS.dist = {
  name: 'Probability distributions', group: 'Statistics',
  desc: 'Binomial, Poisson, geometric and normal distributions: change the parameters and shade any probability, with mean and variance.',
  topics: [['stats', 'dist'], ['stats', 'hyp'], ['fs1', 'poisson'], ['fs1', 'geomnb'], ['fs1', 'drv'], ['fs1', 'hyp']],
  icon: icon('<path d="M4 34h32"/><rect x="8" y="22" width="5" height="12" fill="var(--brand-soft)"/><rect x="15" y="12" width="5" height="22" fill="var(--brand)"/><rect x="22" y="16" width="5" height="18" fill="var(--brand)"/><rect x="29" y="27" width="5" height="7" fill="var(--brand-soft)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      <div class="seg" role="group" aria-label="Distribution"><button data-d="bin" aria-pressed="true">Binomial</button><button data-d="poi" aria-pressed="false">Poisson</button><button data-d="geo" aria-pressed="false">Geometric</button><button data-d="nor" aria-pressed="false">Normal</button></div>
      <div id="pars"></div>
      <div><h4>Shade</h4><div class="row" style="margin-top:8px"><select class="sel" id="op"><option value="le">P(X ≤ k)</option><option value="lt">P(X &lt; k)</option><option value="ge">P(X ≥ k)</option><option value="gt">P(X &gt; k)</option><option value="eq">P(X = k)</option><option value="bt">P(k ≤ X ≤ k₂)</option></select></div>
      <div style="margin-top:8px">${slider('k', 'k', 0, 40, 1, 5)}${slider('k2', 'k₂', 0, 40, 1, 9)}</div></div>
      <div class="readout" id="out"></div>`, {hud: 'Drag to pan · scroll to zoom'});
    let dist = 'bin';
    const PAR = {bin: [['n', 'n', 1, 60, 1, 20], ['p', 'p', 0.01, 0.99, 0.01, 0.3]], poi: [['l', 'λ', 0.2, 25, 0.1, 4]], geo: [['p', 'p', 0.02, 0.95, 0.01, 0.25]], nor: [['mu', 'μ', -20, 120, 0.5, 50], ['sd', 'σ', 0.5, 30, 0.1, 10]]};
    let par = {};
    const pmf = k => dist === 'bin' ? (k < 0 || k > par.n ? 0 : Math.exp(lnC(par.n, k) + k * Math.log(par.p) + (par.n - k) * Math.log(1 - par.p))) :
      dist === 'poi' ? (k < 0 ? 0 : Math.exp(-par.l + k * Math.log(par.l) - lgamma(k + 1))) : (k < 1 ? 0 : Math.pow(1 - par.p, k - 1) * par.p);
    function range(){ return dist === 'bin' ? [0, par.n] : dist === 'poi' ? [0, Math.ceil(par.l + 5 * Math.sqrt(par.l) + 5)] : dist === 'geo' ? [1, Math.ceil(Math.log(0.001) / Math.log(1 - par.p)) + 1] : [par.mu - 4 * par.sd, par.mu + 4 * par.sd]; }
    const inSet = x => { const k = +q(panel, '#k').value, k2 = +q(panel, '#k2').value, op = q(panel, '#op').value;
      return op === 'le' ? x <= k : op === 'lt' ? x < k : op === 'ge' ? x >= k : op === 'gt' ? x > k : op === 'eq' ? x === k : x >= Math.min(k, k2) && x <= Math.max(k, k2); };
    const P = makePlot(stage, {span: 30, equal: false, yspan: 0.3, cx: 10, cy: 0.1, draw(ctx, P){
      const C = P.C, [lo, hi] = range();
      if (dist === 'nor') { const pdf = x => Math.exp(-((x - par.mu) ** 2) / (2 * par.sd ** 2)) / (par.sd * Math.sqrt(2 * Math.PI));
        const k = +q(panel, '#k').value, k2 = +q(panel, '#k2').value, op = q(panel, '#op').value;
        const [a, b] = op === 'le' || op === 'lt' ? [lo - 50, k] : op === 'ge' || op === 'gt' ? [k, hi + 50] : op === 'bt' ? [Math.min(k, k2), Math.max(k, k2)] : [k, k];
        const pts = [[a, 0]]; for (let i = 0; i <= 200; i++) { const x = a + (b - a) * i / 200; pts.push([x, pdf(x)]); } pts.push([b, 0]);
        P.poly(pts, 'color-mix(in srgb,' + C.brand + ' 35%,transparent)'); P.fn(pdf, C.accent, 2.5); return; }
      const wbar = 0.8;
      for (let x = lo; x <= hi; x++) { const p = pmf(x); P.poly([[x - wbar / 2, 0], [x + wbar / 2, 0], [x + wbar / 2, p], [x - wbar / 2, p]], inSet(x) ? C.brand : C.soft, null); }
    }});
    function fitView(){ const [lo, hi] = range(); P.cx = (lo + hi) / 2; P.span = (hi - lo) * 1.25 + 2;
      let mx = 0; if (dist === 'nor') mx = 1 / (par.sd * Math.sqrt(2 * Math.PI)); else for (let x = lo; x <= hi; x++) mx = Math.max(mx, pmf(x));
      P.yspan = mx * 1.5; P.cy = mx * 0.6;
      ['k', 'k2'].forEach(id => { const el = q(panel, '#' + id); el.min = Math.floor(lo); el.max = Math.ceil(hi); el.step = dist === 'nor' ? 0.5 : 1; }); }
    function prob(){ const k = +q(panel, '#k').value, k2 = +q(panel, '#k2').value, op = q(panel, '#op').value;
      if (dist === 'nor') { const F = x => Phi((x - par.mu) / par.sd); return op === 'le' || op === 'lt' ? F(k) : op === 'ge' || op === 'gt' ? 1 - F(k) : op === 'eq' ? 0 : F(Math.max(k, k2)) - F(Math.min(k, k2)); }
      const [lo, hi] = range(); let s = 0; for (let x = lo; x <= hi + 400; x++) { if (x > hi && dist === 'bin') break; if (inSet(x)) s += pmf(x); if (x > hi + 5 && pmf(x) < 1e-12) break; } return s; }
    function update(){ P.redraw(); const op = q(panel, '#op').value, k = +q(panel, '#k').value, k2 = +q(panel, '#k2').value;
      const lab = {le: `P(X ≤ ${k})`, lt: `P(X < ${k})`, ge: `P(X ≥ ${k})`, gt: `P(X > ${k})`, eq: `P(X = ${k})`, bt: `P(${Math.min(k, k2)} ≤ X ≤ ${Math.max(k, k2)})`}[op];
      const mv = dist === 'bin' ? [`B(${par.n}, ${par.p})`, par.n * par.p, par.n * par.p * (1 - par.p)] : dist === 'poi' ? [`Po(${par.l})`, par.l, par.l] : dist === 'geo' ? [`Geo(${par.p})`, 1 / par.p, (1 - par.p) / par.p ** 2] : [`N(${par.mu}, ${fx(par.sd ** 2)})`, par.mu, par.sd ** 2];
      q(panel, '#out').innerHTML = `X ~ ${mv[0]}<br>${lab} = <b>${fx(prob(), 5)}</b><br>E(X) = ${fx(mv[1], 4)}, Var(X) = ${fx(mv[2], 4)}${dist === 'nor' && op === 'eq' ? '<br>(continuous: P(X = k) = 0)' : ''}${dist === 'nor' ? '<br>z = (k − μ)/σ = ' + fx((k - par.mu) / par.sd, 3) : ''}`; }
    function setDist(d){ dist = d; panel.querySelectorAll('[data-d]').forEach(x => x.setAttribute('aria-pressed', x.dataset.d === d));
      q(panel, '#pars').innerHTML = PAR[d].map(([id, l, mn, mx, st, v]) => slider('p_' + id, l, mn, mx, st, v)).join('');
      par = {}; PAR[d].forEach(([id, , , , , v]) => { par[id] = v; bindSlider(panel, 'p_' + id, x => { par[id] = x; fitView(); update(); }); });
      fitView(); const [lo, hi] = range(); q(panel, '#k').value = Math.round((lo + hi) / 2 - (hi - lo) / 8); q(panel, '#k-o').textContent = q(panel, '#k').value; update(); }
    panel.querySelectorAll('[data-d]').forEach(bt => bt.onclick = () => setDist(bt.dataset.d));
    ['k', 'k2'].forEach(id => bindSlider(panel, id, update)); q(panel, '#op').onchange = update;
    setDist('bin');
    return () => P.destroy();
  }
};

/* =============================================================== projectiles */
VIS.projectile = {
  name: 'Projectiles', group: 'Mechanics',
  desc: 'Launch a particle with speed u at angle θ from height h. See the path, velocity components, time of flight, greatest height and range, the envelope of all possible paths, and what air resistance does to the parabola.',
  topics: [['mech', 'kin']],
  icon: icon('<path d="M4 34h32"/><path d="M6 32c6-22 18-22 26 2" stroke="var(--accent)" stroke-dasharray="3 3"/><circle cx="19" cy="15" r="2.5" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('u', 'u (m s⁻¹)', 1, 40, 0.5, 20)}${slider('th', 'θ (°)', -60, 90, 1, 40)}${slider('h', 'h (m)', 0, 50, 0.5, 0)}${slider('g', 'g', 9.8, 9.8, 0, 9.8)}
      <div class="row"><button class="btn primary sm" id="go">Launch</button><label class="tog"><input type="checkbox" id="vec" checked>Velocity vector</label><label class="tog"><input type="checkbox" id="ghost">Compare 90° − θ</label><label class="tog"><input type="checkbox" id="env">Envelope (all angles)</label></div>
      ${slider('k', 'air resistance k (a = −kv)', 0, 1, 0.01, 0)}
      <div class="readout" id="out"></div><p class="note">With k = 0 this is the A level model (no air resistance, g = 9.8 m s⁻²). Raising k adds a resistance proportional to velocity: the path (solid) becomes lopsided – it falls more steeply than it rises – and the range shrinks compared with the ideal parabola (dashed). The envelope y = h + u²/(2g) − gx²/(2u²) bounds every possible path at this speed.</p>`, {aspect: '16/10'});
    q(panel, '#g').closest('.slider').style.display = 'none';
    let tnow = null, raf = null;
    const g = 9.8, v = id => +q(panel, '#' + id).value;
    const drag = (u, th, h, k) => { let x = 0, y = h, vx = u * Math.cos(th), vy = u * Math.sin(th), t = 0, ymax = h; const pts = [[0, h]], dt = .002;
      for (let i = 0; i < 200000; i++) { vx += -k * vx * dt; vy += (-g - k * vy) * dt; x += vx * dt; y += vy * dt; t += dt; ymax = Math.max(ymax, y); if (i % 10 === 0) pts.push([x, y]); if (y < 0) break; } pts.push([x, Math.max(0, y)]); return {pts, R: x, T: t, ymax}; };
    const flight = (u, th, h) => { const uy = u * Math.sin(th); return (uy + Math.sqrt(uy * uy + 2 * g * h)) / g; };
    const P = makePlot(stage, {span: 60, cx: 25, cy: 12, xlabel: 'x (m)', ylabel: 'y (m)', draw(ctx, P){
      const C = P.C, u = v('u'), th = v('th') * Math.PI / 180, h = v('h'), T = flight(u, th, h);
      const path = (thh, col, dash) => { const TT = flight(u, thh, h), pts = []; for (let i = 0; i <= 120; i++) { const t = TT * i / 120; pts.push([u * Math.cos(thh) * t, h + u * Math.sin(thh) * t - g * t * t / 2]); } P.line(pts, col, 2.5, dash); };
      if (q(panel, '#ghost').checked) path(Math.PI / 2 - th, C.muted, [6, 5]);
      path(th, C.accent, [7, 5]);
      if (q(panel, '#env').checked) { const pts = []; const xm = u / g * Math.sqrt(u * u + 2 * g * h); for (let i = 0; i <= 120; i++) { const x = -xm + 2 * xm * i / 120; pts.push([x, h + u * u / (2 * g) - g * x * x / (2 * u * u)]); } P.line(pts.filter(p => p[1] >= 0 && p[0] >= 0), C.bad, 1.8, [3, 4]); }
      const kk = v('k'); if (kk > 0) { const D = drag(u, th, h, kk); P.line(D.pts, C.brand, 3); }
      if (h) P.poly([[-4, 0], [0, 0], [0, h], [-4, h]], C.soft, C.brand, 1.5);
      const t = tnow == null ? T : Math.min(tnow, T);
      const x = u * Math.cos(th) * t, y = h + u * Math.sin(th) * t - g * t * t / 2, vx = u * Math.cos(th), vy = u * Math.sin(th) - g * t;
      if (q(panel, '#vec').checked) { const s = .25; P.arrow(x, y, x + vx * s, y, C.blue, 2); P.arrow(x, y, x, y + vy * s, C.warn, 2); P.arrow(x, y, x + vx * s, y + vy * s, C.bad, 2.5); }
      if (u * Math.sin(th) > 0) { const tm = u * Math.sin(th) / g; const xm = u * Math.cos(th) * tm, ym = h + (u * Math.sin(th)) ** 2 / (2 * g); P.dot(xm, ym, 4, C.warn); P.line([[xm, 0], [xm, ym]], C.warn, 1, [3, 4]); }
      P.dot(x, y, 8, C.brand, C.bg);
    }});
    function update(){ P.redraw(); const u = v('u'), th = v('th') * Math.PI / 180, h = v('h'), T = flight(u, th, h), uy = u * Math.sin(th);
      q(panel, '#out').innerHTML = `uₓ = u cos θ = ${fx(u * Math.cos(th), 3)} m s⁻¹<br>u_y = u sin θ = ${fx(uy, 3)} m s⁻¹<br>Time of flight T = <b>${fx(T, 3)} s</b><br>Range R = <b>${fx(u * Math.cos(th) * T, 3)} m</b><br>Greatest height = <b>${fx(h + (uy > 0 ? uy * uy / (2 * g) : 0), 3)} m</b>${uy > 0 ? ` at t = ${fx(uy / g, 3)} s` : ''}<br>Impact speed = ${fx(Math.hypot(u * Math.cos(th), uy - g * T), 3)} m s⁻¹${v('k') > 0 ? (() => { const D = drag(u, th, h, v('k')); return `<br><br><b>With air resistance</b> (k = ${fx(v('k'))}): range ${fx(D.R, 3)} m, time ${fx(D.T, 3)} s, greatest height ${fx(D.ymax, 3)} m`; })() : ''}<br><span style="color:var(--bad)">→ velocity</span> · <span style="color:var(--blue)">→ horizontal</span> · <span style="color:var(--warn)">→ vertical</span>`; }
    ['u', 'th', 'h', 'k'].forEach(id => bindSlider(panel, id, () => { tnow = null; update(); }));
    ['vec', 'ghost', 'env'].forEach(id => q(panel, '#' + id).onchange = update);
    q(panel, '#go').onclick = () => { cancelAnimationFrame(raf); const T = flight(v('u'), v('th') * Math.PI / 180, v('h')), t0 = performance.now(); const step = now => { tnow = (now - t0) / 1000; P.redraw(); if (tnow < T) raf = requestAnimationFrame(step); else { tnow = null; update(); } }; raf = requestAnimationFrame(step); };
    update();
    return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== collisions */
VIS.collide = {
  name: 'Collisions & restitution', group: 'Further Mechanics',
  desc: 'Direct impact of two spheres, and a sphere bouncing obliquely off a wall. Change masses, speeds and e to see the velocities after, the impulse and the kinetic energy lost.',
  topics: [['fm1', 'coll1d'], ['fm1', 'coll2d'], ['fm1', 'momentum']],
  icon: icon('<circle cx="12" cy="20" r="7" fill="var(--brand-soft)"/><circle cx="29" cy="20" r="5" stroke="var(--accent)" fill="var(--accent-soft)"/><path d="M2 20h3M35 20h3"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      <div class="seg" role="group" aria-label="Mode"><button data-m="d" aria-pressed="true">Direct impact</button><button data-m="w" aria-pressed="false">Oblique (wall)</button></div>
      <div id="dP">${slider('m1', 'm₁ (kg)', 0.5, 10, 0.5, 3)}${slider('m2', 'm₂ (kg)', 0.5, 10, 0.5, 2)}${slider('u1', 'u₁ (m s⁻¹)', -10, 10, 0.5, 6)}${slider('u2', 'u₂ (m s⁻¹)', -10, 10, 0.5, -2)}</div>
      <div id="wP" hidden>${slider('U', 'u (m s⁻¹)', 1, 12, 0.5, 8)}${slider('al', 'α to wall (°)', 5, 90, 1, 40)}</div>
      ${slider('e', 'e', 0, 1, 0.05, 0.5)}
      <div class="row"><button class="btn primary sm" id="go">Play</button></div>
      <div class="readout" id="out"></div>`, {hud: '', aspect: '16/9'});
    let mode = 'd', tt = null, raf = null; const v = id => +q(panel, '#' + id).value;
    function solve(){ const m1 = v('m1'), m2 = v('m2'), u1 = v('u1'), u2 = v('u2'), e = v('e');
      const v1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / (m1 + m2), v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / (m1 + m2); return {m1, m2, u1, u2, e, v1, v2}; }
    const P = makePlot(stage, {span: 24, cy: 2, pan: false, zoom: false, grid: false, draw(ctx, P){
      const C = P.C;
      if (mode === 'd') { const s = solve(); const r1 = 0.5 + Math.cbrt(s.m1) * 0.45, r2 = 0.5 + Math.cbrt(s.m2) * 0.45;
        P.line([[-30, 0], [30, 0]], C.line || C.grid, 2);
        const approach = s.u1 - s.u2; const T0 = 1.6; let x1, x2;
        const t = tt == null ? 0 : tt;
        if (approach <= 0) { x1 = -4 + s.u1 * t * .5; x2 = 4 + s.u2 * t * .5; }
        else { const gap = 8 - r1 - r2, tc = gap / (approach * .5); const xc1 = -4 + s.u1 * tc * .5;
          if (t < tc) { x1 = -4 + s.u1 * t * .5; x2 = 4 + s.u2 * t * .5; } else { x1 = xc1 + s.v1 * (t - tc) * .5; x2 = xc1 + r1 + r2 + s.v2 * (t - tc) * .5; } }
        const ball = (x, r, col, lab) => { const [a, b] = P.toS(x, r); ctx.beginPath(); ctx.arc(a, b, r * P.scale(), 0, 7); ctx.fillStyle = col; ctx.fill(); ctx.fillStyle = C.bg; ctx.font = '700 13px IBM Plex Sans'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lab, a, b); };
        ball(x1, r1, C.brand, 'A'); ball(x2, r2, C.accent, 'B');
        const after = tt != null && approach > 0 && t >= (8 - r1 - r2) / (approach * .5);
        const va = after ? s.v1 : s.u1, vb = after ? s.v2 : s.u2;
        P.arrow(x1, 2 * r1 + .6, x1 + va * .4, 2 * r1 + .6, C.brand); P.arrow(x2, 2 * r2 + .6, x2 + vb * .4, 2 * r2 + .6, C.accent);
        P.text((after ? 'v₁ = ' : 'u₁ = ') + fx(va), x1, 2 * r1 + 1.1, C.brand, {align: 'center'}); P.text((after ? 'v₂ = ' : 'u₂ = ') + fx(vb), x2, 2 * r2 + 1.1, C.accent, {align: 'center'});
      } else { const U = v('U'), al = v('al') * Math.PI / 180, e = v('e');
        P.poly([[0, -10], [1, -10], [1, 10], [0, 10]], C.soft, C.brand, 2);
        const T = 1.4, t = tt == null ? T : tt; const s = .45;
        const pIn = tt == null ? null : (t < T ? [-(T - t) * U * Math.sin(al) * s, (T - t) * U * Math.cos(al) * s * -1] : [-(t - T) * e * U * Math.sin(al) * s, (t - T) * U * Math.cos(al) * s]);
        const a0 = [-T * U * Math.sin(al) * s, -T * U * Math.cos(al) * s], b0 = [-T * e * U * Math.sin(al) * s, T * U * Math.cos(al) * s];
        P.line([a0, [0, 0]], C.brand, 2.5, [6, 4]); P.line([[0, 0], b0], C.accent, 2.5, [6, 4]);
        P.line([[0, 0], [-6, 0]], C.muted, 1, [3, 4]);
        P.text('α', -1.6, -0.8, C.brand); P.text('β', -1.6, 0.9, C.accent);
        const pt = pIn || b0; P.dot(pt[0], pt[1], 9, (tt != null && t < T) ? C.brand : C.accent, C.bg);
      } }});
    function update(){ P.redraw(); let o;
      if (mode === 'd') { const s = solve(); const keB = .5 * s.m1 * s.u1 ** 2 + .5 * s.m2 * s.u2 ** 2, keA = .5 * s.m1 * s.v1 ** 2 + .5 * s.m2 * s.v2 ** 2;
        o = s.u1 - s.u2 <= 0 ? 'The spheres are not approaching – no collision.' :
          `Momentum: ${s.m1}(${s.u1}) + ${s.m2}(${s.u2}) = ${s.m1}v₁ + ${s.m2}v₂<br>NEL: v₂ − v₁ = e(u₁ − u₂) = ${fx(s.e * (s.u1 - s.u2), 3)}<br>v₁ = <b>${fx(s.v1, 3)}</b>, v₂ = <b>${fx(s.v2, 3)}</b> m s⁻¹<br>Impulse on B = m₂(v₂ − u₂) = <b>${fx(s.m2 * (s.v2 - s.u2), 3)} N s</b><br>KE before ${fx(keB, 3)} J, after ${fx(keA, 3)} J<br>KE lost = <b>${fx(keB - keA, 3)} J</b>${s.e === 1 ? ' (perfectly elastic)' : s.e === 0 ? ' (coalesce)' : ''}`; }
      else { const U = v('U'), al = v('al') * Math.PI / 180, e = v('e'); const par = U * Math.cos(al), per = U * Math.sin(al), V = Math.hypot(par, e * per), be = Math.atan2(e * per, par);
        o = `Component parallel to wall unchanged: ${fx(par, 3)}<br>Perpendicular component × e: ${fx(per, 3)} → ${fx(e * per, 3)}<br>Speed after = <b>${fx(V, 3)} m s⁻¹</b><br>Angle with wall β = <b>${fx(be * 180 / Math.PI, 2)}°</b><br>tan β = e tan α<br>Fraction of KE lost = ${fx(1 - V * V / U / U, 4)}`; }
      q(panel, '#out').innerHTML = o; }
    panel.querySelectorAll('[data-m]').forEach(bt => bt.onclick = () => { mode = bt.dataset.m; tt = null; panel.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === bt)); q(panel, '#dP').hidden = mode !== 'd'; q(panel, '#wP').hidden = mode !== 'w'; P.cx = mode === 'w' ? -3 : 0; P.span = mode === 'w' ? 16 : 24; update(); });
    ['m1', 'm2', 'u1', 'u2', 'e', 'U', 'al'].forEach(id => bindSlider(panel, id, () => { tt = null; update(); }));
    q(panel, '#go').onclick = () => { cancelAnimationFrame(raf); const t0 = performance.now(), D = mode === 'd' ? 5 : 2.8; const step = now => { tt = (now - t0) / 1000; P.redraw(); if (tt < D) raf = requestAnimationFrame(step); else { tt = null; update(); } }; raf = requestAnimationFrame(step); };
    update();
    return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== vertical circular motion */
VIS.circular = {
  name: 'Motion in a vertical circle', group: 'Further Mechanics',
  desc: 'A particle on a string or a rod, projected from the bottom with speed u. Watch the tension and speed change with the angle, and find when the string goes slack.',
  topics: [['fm2', 'circ']],
  icon: icon('<circle cx="20" cy="20" r="13" stroke-dasharray="3 3"/><path d="M20 20l9 9" stroke="var(--accent)"/><circle cx="29" cy="29" r="3" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      <div class="seg" role="group" aria-label="Connection"><button data-k="s" aria-pressed="true">String / inside a sphere</button><button data-k="r" aria-pressed="false">Rod / inside a tube</button></div>
      ${slider('u', 'u at bottom (m s⁻¹)', 1, 12, 0.1, 6.5)}${slider('r', 'radius a (m)', 0.5, 3, 0.1, 1)}${slider('m', 'mass m (kg)', 0.1, 5, 0.1, 0.5)}
      <div class="row"><button class="btn primary sm" id="go">Release</button></div>
      <div class="readout" id="out"></div>
      <p class="note">θ is measured from the lowest point. Energy: v² = u² − 2ga(1 − cos θ). Radially: T − mg cos θ = mv²/a. Inside a smooth sphere the normal reaction R plays the role of T (it can push but not pull), so it leaves the surface exactly where a string would go slack.</p><p class="note"><span style="color:var(--blue)">blue</span> tension/reaction, <span style="color:var(--warn)">orange</span> weight, <span style="color:var(--accent)">purple</span> mv²/a needed towards the centre.</p>`, {hud: '', aspect: '1/1'});
    let kind = 's', state = null, raf = null; const g = 9.8, v = id => +q(panel, '#' + id).value;
    const P = makePlot(stage, {span: 9, pan: false, zoom: false, draw(ctx, P){
      const C = P.C, a = v('r');
      const [cx, cy] = P.toS(0, 0); ctx.strokeStyle = C.muted; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, a * P.scale(), 0, 7); ctx.stroke(); ctx.setLineDash([]);
      P.dot(0, 0, 4, C.ink2);
      const s = state || {x: 0, y: -a, attached: true, trail: []};
      if (s.trail.length > 1) P.line(s.trail, C.accent, 2, [4, 4]);
      if (s.attached) P.line([[0, 0], [s.x, s.y]], kind === 's' ? C.ink2 : C.warn, kind === 's' ? 2 : 4);
      P.dot(s.x, s.y, 10, C.brand, C.bg);
      if (s.T != null && s.attached) { const k = Math.min(2.5, Math.abs(s.T) * .04 + .2), d = Math.hypot(s.x, s.y); P.arrow(s.x, s.y, s.x - s.x / d * k * Math.sign(s.T || 1), s.y - s.y / d * k * Math.sign(s.T || 1), s.T >= 0 ? C.blue : C.bad, 2.5); }
      P.arrow(s.x, s.y, s.x, s.y - .9, C.warn, 2); P.text('mg', s.x, s.y - .9, C.warn, {dx: 6, base: 'middle'});
      if (s.T != null && s.attached) { const d = Math.hypot(s.x, s.y), k = Math.min(2.5, Math.abs(s.T) * .04 + .2), sg = Math.sign(s.T || 1); P.text(kind === 's' ? 'T (or R)' : (s.T >= 0 ? 'T' : 'thrust'), s.x - s.x / d * k * sg, s.y - s.y / d * k * sg, s.T >= 0 ? C.blue : C.bad, {dx: 6, base: 'middle'});
        const ca = Math.min(2.2, (s.v * s.v / a) * .06 + .15); const ox = -s.y / d * .3, oy = s.x / d * .3; P.arrow(s.x + ox, s.y + oy, s.x + ox - s.x / d * ca, s.y + oy - s.y / d * ca, C.accent, 1.8); }
    }});
    function analysis(){ const u = v('u'), a = v('r'), m = v('m');
      // string: slack when T = 0: m(u² − 2ga(1−c))/a + mg c = 0 → u² − 2ga + 2ga c + ga c = 0 → c = (2ga − u²)/(3ga)
      const vtop2 = u * u - 4 * g * a; let msg;
      if (kind === 's') {
        const c = (2 * g * a - u * u) / (3 * g * a);
        if (u * u <= 2 * g * a) msg = `u² ≤ 2ga: the particle oscillates and never rises above the level of the centre (string stays taut).`;
        else if (u * u >= 5 * g * a) msg = `u² ≥ 5ga = ${fx(5 * g * a, 3)}: complete circles. At the top v² = ${fx(vtop2, 3)}, T = ${fx(m * vtop2 / a - m * g, 3)} N.`;
        else { const th = Math.acos(c); msg = `String goes slack when T = 0: cos θ = (2ga − u²)/(3ga) = ${fx(c, 4)} → θ = <b>${fx(th * 180 / Math.PI, 2)}°</b> from the bottom, speed then √(ga·(−cos θ)) = ${fx(Math.sqrt(-g * a * c), 3)} m s⁻¹. Afterwards it moves as a projectile.`; }
      } else msg = u * u >= 4 * g * a ? `u² ≥ 4ga = ${fx(4 * g * a, 3)}: completes the circle (a rod can push as well as pull). Speed at top = ${fx(Math.sqrt(Math.max(0, vtop2)), 3)} m s⁻¹.` : `u² < 4ga: comes to rest at cos θ = 1 − u²/(2ga) = ${fx(1 - u * u / (2 * g * a), 4)} (θ = ${fx(Math.acos(1 - u * u / (2 * g * a)) * 180 / Math.PI, 2)}°) and swings back.`;
      const Tb = m * u * u / a + m * g;
      q(panel, '#out').innerHTML = `Tension at bottom = mu²/a + mg = <b>${fx(Tb, 3)} N</b><br>Critical: string u² = 5ga = ${fx(5 * g * a, 3)}, rod u² = 4ga = ${fx(4 * g * a, 3)}<br>${msg}${state && state.T != null ? `<br><br>Now: θ = ${fx(state.th * 180 / Math.PI, 1)}°, v = ${fx(state.v, 3)} m s⁻¹, ${kind === 's' ? 'T' : 'Force from rod'} = ${fx(state.T, 3)} N` : ''}`; }
    function run(){ cancelAnimationFrame(raf); const u = v('u'), a = v('r'), m = v('m');
      let th = 0, w = u / a, x = 0, y = -a, vx = u, vy = 0, attached = true, trail = [], t = 0, last = performance.now();
      const step = now => { let dt = Math.min(.03, (now - last) / 1000); last = now; const sub = 20;
        for (let i = 0; i < sub; i++) { const h = dt / sub; t += h;
          if (attached) { const alpha = -g / a * Math.sin(th); w += alpha * h; th += w * h; x = a * Math.sin(th); y = -a * Math.cos(th);
            const vv = Math.abs(w) * a, T = m * vv * vv / a + m * g * Math.cos(th);
            state = {x, y, attached, trail, T, v: vv, th: ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)};
            if (kind === 's' && T < 0) { attached = false; vx = w * a * Math.cos(th); vy = w * a * Math.sin(th); state.T = 0; } }
          else { vy -= g * h; x += vx * h; y += vy * h; state = {x, y, attached, trail, T: null, v: Math.hypot(vx, vy), th: 0}; if (Math.hypot(x, y) >= a) { attached = true; th = Math.atan2(x, -y); w = (vx * Math.cos(th) + vy * Math.sin(th)) / a; } }
        }
        trail.push([x, y]); if (trail.length > 400) trail.shift();
        P.redraw(); analysis(); if (t < 12) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step); }
    panel.querySelectorAll('[data-k]').forEach(bt => bt.onclick = () => { kind = bt.dataset.k; panel.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-pressed', x === bt)); cancelAnimationFrame(raf); state = null; P.redraw(); analysis(); });
    ['u', 'r', 'm'].forEach(id => bindSlider(panel, id, () => { cancelAnimationFrame(raf); state = null; P.span = Math.max(6, v('r') * 4.5); P.redraw(); analysis(); }));
    q(panel, '#go').onclick = run;
    P.redraw(); analysis();
    return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== centre of mass of a lamina */
/* centre of mass visualiser lives in js/vis_com.js */
})();
