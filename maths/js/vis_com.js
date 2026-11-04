/* Centre of mass: composite laminas, frameworks (uniform wire) and folded laminas */
(function(){
'use strict';
const {makePlot, layout, slider, fx} = window.PLOT;
const q = (r, s) => r.querySelector(s);
const icon = p => `<svg viewBox="0 0 40 40" fill="none" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const segBtns = (name, opts, cur) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([v, l]) => `<button data-${name}="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
const circ = (cx, cy, r, a0 = 0, a1 = 2 * Math.PI, n = 72) => [...Array(n + 1)].map((_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const ang = (u, v) => Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
const PI = Math.PI;

VIS.com = {
  name: 'Centre of mass: laminas, frameworks & folding', group: 'Further Mechanics',
  desc: 'Composite laminas (with holes, semicircles and triangles), frameworks made of uniform wire with an attached particle, and laminas folded along a line. Build the table, find G, then hang the shape freely from any vertex.',
  topics: [['fm2', 'com1'], ['fm2', 'com2'], ['mech', 'mom']],
  icon: icon('<rect x="6" y="8" width="28" height="24" fill="var(--brand-soft)"/><circle cx="25" cy="16" r="5" fill="var(--surface)"/><circle cx="17" cy="22" r="2" fill="var(--accent)" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `
      ${segBtns('mode', [['lam', 'Lamina'], ['fw', 'Framework'], ['fold', 'Folded lamina']], 'lam')}
      ${slider('W', 'width OA', 2, 12, 0.5, 8)}${slider('H', 'height OC', 2, 10, 0.5, 6)}
      <div data-for="lam" style="display:grid;gap:10px">
        <div><div class="eyebrow" style="margin-bottom:4px">Add to the top edge</div>${segBtns('add', [['n', 'Nothing'], ['semi', 'Semicircle'], ['tri', 'Triangle']], 'n')}</div>
        <div data-addtri>${slider('t', 'triangle height', 0.5, 8, 0.25, 3)}</div>
        <div><div class="eyebrow" style="margin-bottom:4px">Cut out a hole</div>${segBtns('hole', [['n', 'None'], ['c', 'Circle'], ['r', 'Rectangle']], 'c')}</div>
        <div data-hole style="display:grid;gap:10px">${slider('hr', 'hole radius / half-width', 0.25, 4, 0.25, 1.5)}${slider('hx', 'hole centre x', 0, 12, 0.25, 5.5)}${slider('hy', 'hole centre y', 0, 10, 0.25, 3)}</div>
      </div>
      <div data-for="fw" hidden style="display:grid;gap:10px">
        ${segBtns('fr', [['rect', 'Rectangle frame'], ['tri', 'Triangle frame'], ['arc', 'Semicircular arc']], 'rect')}
        <div><div class="eyebrow" style="margin-bottom:4px">Rods included (uniform wire)</div><div id="rods" class="row" style="gap:10px"></div></div>
        <label class="field">Particle attached at<select class="sel" id="pat" style="display:block;width:100%"></select></label>
        ${slider('pm', 'particle mass', 0, 20, 0.5, 4)}
      </div>
      <div data-for="fold" hidden style="display:grid;gap:10px">
        ${segBtns('fk', [['corner', 'Fold corner B over'], ['strip', 'Fold a strip over']], 'corner')}
        <div data-fkp="corner" style="display:grid;gap:10px">${slider('fp', 'BP (P on AB)', 0.5, 10, 0.25, 3)}${slider('fq', 'BQ (Q on CB)', 0.5, 12, 0.25, 4)}</div>
        <div data-fkp="strip" hidden>${slider('fd', 'strip width d', 0.25, 6, 0.25, 2)}</div>
      </div>
      <label class="field">Hang freely from<select class="sel" id="hang" style="display:block;width:100%"></select></label>
      <div class="readout" id="out"></div>`, {hud: 'Drag to pan · scroll or pinch to zoom'});

    const st = {mode: 'lam', add: 'n', hole: 'c', fr: 'rect', fk: 'corner', rods: {}};
    const el = id => q(panel, '#' + id), v = id => +el(id).value;
    function setR(id, min, max){ const e = el(id); max = Math.max(min, max); e.min = min; e.max = max; let x = +e.value; if (x < min) x = min; if (x > max) x = max; e.value = x; q(panel, '#' + id + '-o').textContent = fx(+e.value); }

    /* ---- slider limits so every shape stays physically sensible ---- */
    function limits(){ const W = v('W'), H = v('H');
      if (st.hole !== 'n') { const k = st.hole === 'c' ? 1 : 0.7; setR('hr', 0.25, Math.min(W / 2, H / (2 * k)) - 0.25); const s = v('hr');
        setR('hx', s, W - s); setR('hy', k * s, H - k * s); }
      setR('fp', 0.25, H); setR('fq', 0.25, W); setR('fd', 0.25, W / 2); }

    /* ---- build the current body: shapes, rods, particles, table, pivots ---- */
    function build(){ const W = v('W'), H = v('H'), O = [0, 0], A = [W, 0], B = [W, H], C = [0, H];
      const b = {shapes: [], rods: [], parts: [], rows: [], pivots: [], labels: [], note: ''};
      const piv = (l, p, nb) => b.pivots.push({l, p, nb});
      if (st.mode === 'lam') {
        const outline = [O, A, B]; let rows = [['Rectangle', W * H, W / 2, H / 2]];
        if (st.add === 'semi') { const r = W / 2; outline.push(...circ(W / 2, H, r, 0, PI).slice(1, -1)); rows.push(['Semicircle (r = ' + fx(r) + ')', PI * r * r / 2, W / 2, H + 4 * r / (3 * PI)]); }
        if (st.add === 'tri') { const t = v('t'), Pp = [W / 2, H + t]; outline.push(Pp); rows.push(['Triangle', W * t / 2, W / 2, H + t / 3]); b.labels.push(['P', Pp]); }
        outline.push(C); const holes = [];
        if (st.hole !== 'n') { const s = v('hr'), hx = v('hx'), hy = v('hy');
          if (st.hole === 'c') { holes.push(circ(hx, hy, s)); rows.push(['Circular hole', -PI * s * s, hx, hy]); }
          else { holes.push([[hx - s, hy - .7 * s], [hx + s, hy - .7 * s], [hx + s, hy + .7 * s], [hx - s, hy + .7 * s]]); rows.push(['Rectangular hole', -2 * s * 1.4 * s, hx, hy]); } }
        b.shapes.push({pts: outline, holes}); b.rows = rows; b.unit = 'Area';
        piv('O', O, [['A', A], ['C', C]]); piv('A', A, [['O', O], ['B', B]]);
        if (st.add === 'tri') { const Pp = [W / 2, H + v('t')]; piv('B', B, [['A', A], ['P', Pp]]); piv('P', Pp, [['B', B], ['C', C]]); piv('C', C, [['P', Pp], ['O', O]]); }
        else { piv('B', B, [['A', A], ['C', C]]); piv('C', C, [['B', B], ['O', O]]); }
        if (st.add === 'semi') b.note = 'Semicircle: ȳ = 4r/(3π) above the diameter.';
        if (st.add === 'tri') b.note = 'Triangle: G is 1/3 of the height above the base (the mean of the vertices).';
      } else if (st.mode === 'fw') {
        let R = {}, pts = {};
        if (st.fr === 'rect') { pts = {O, A, B, C}; R = {OA: [O, A], AB: [A, B], BC: [B, C], CO: [C, O], OB: [O, B], AC: [A, C]}; }
        else if (st.fr === 'tri') { pts = {O, A, C}; R = {OA: [O, A], AC: [A, C], CO: [C, O]}; }
        else { const r = W / 2; pts = {O, A, T: [r, r]}; R = {arc: 'arc', OA: [O, A]}; }
        const rows = [];
        Object.entries(R).forEach(([k, seg]) => { if (st.rods[k] === false) return;
          if (seg === 'arc') { const r = W / 2; b.rods.push(circ(r, 0, r, 0, PI)); rows.push(['Arc (r = ' + fx(r) + ')', PI * r, r, 2 * r / PI]); }
          else { const L = Math.hypot(...sub(seg[1], seg[0])); b.rods.push(seg); rows.push(['Rod ' + k, L, (seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2]); } });
        const pa = el('pat').value, m = v('pm'); if (pa && m > 0) { b.parts.push([pts[pa], m]); rows.push(['Particle at ' + pa, m, pts[pa][0], pts[pa][1]]); }
        b.rows = rows; b.unit = 'Mass';
        const names = Object.keys(pts), cyc = st.fr === 'arc' ? {O: ['A', 'T'], A: ['O', 'T'], T: ['O', 'A']} : st.fr === 'tri' ? {O: ['A', 'C'], A: ['O', 'C'], C: ['A', 'O']} : {O: ['A', 'C'], A: ['O', 'B'], B: ['A', 'C'], C: ['B', 'O']};
        names.forEach(n => piv(n, pts[n], cyc[n].map(x => [x, pts[x]])));
        if (st.fr === 'arc') b.note = 'Arc of radius r: G is 2r/π from the centre (r sin α/α with α = π/2). Uniform wire of mass 1 per unit length, so each piece’s mass = its length.';
        else b.note = 'Uniform wire of mass 1 per unit length: each rod acts like a particle of mass = its length at its midpoint.';
        if (st.fr === 'arc') b.labels.push(['T', [W / 2, W / 2]]);
      } else {
        if (st.fk === 'corner') { const p = v('fp'), qq = v('fq'), L2 = p * p + qq * qq, Pp = [W, H - p], Qq = [W - qq, H], B2 = [W - 2 * p * p * qq / L2, H - 2 * p * qq * qq / L2], T = p * qq / 2;
          b.shapes.push({pts: [O, A, Pp, Qq, C], holes: []}); b.shapes.push({pts: [Pp, Qq, B2], holes: [], dbl: true}); b.ghost = [Pp, B, Qq]; b.fold = [Pp, Qq];
          const gt = [(Pp[0] + Qq[0] + W) / 3, (Pp[1] + Qq[1] + H) / 3], gt2 = [(Pp[0] + Qq[0] + B2[0]) / 3, (Pp[1] + Qq[1] + B2[1]) / 3];
          b.rows = [['Rectangle OABC', W * H, W / 2, H / 2], ['Remove triangle PBQ', -T, gt[0], gt[1]], ["Add folded triangle PB′Q", T, gt2[0], gt2[1]]];
          b.labels.push(['P', Pp], ['Q', Qq], ['B′', B2]);
          piv('O', O, [['A', A], ['C', C]]); piv('A', A, [['O', O], ['P', Pp]]); piv('P', Pp, [['A', A], ['Q', Qq]]); piv('Q', Qq, [['P', Pp], ['C', C]]); piv('C', C, [['Q', Qq], ['O', O]]);
          b.note = 'Folding does not change the mass – the triangle just moves to its mirror image in the fold line PQ (B′ is the reflection of B), so its centre moves by (B′ − B)/3.' + (B2[0] < -1e-9 || B2[1] < -1e-9 ? ' <b>Here the flap overhangs the edge.</b>' : '');
        } else { const d = v('fd'), D = [W - d, 0], E = [W - d, H];
          b.shapes.push({pts: [O, D, E, C], holes: []}); b.shapes.push({pts: [[W - 2 * d, 0], D, E, [W - 2 * d, H]], holes: [], dbl: true}); b.ghost = [D, A, B, E]; b.fold = [D, E];
          b.rows = [['Rectangle OABC', W * H, W / 2, H / 2], ['Remove strip', -d * H, W - d / 2, H / 2], ['Add folded strip', d * H, W - 3 * d / 2, H / 2]];
          b.labels.push(['D', D], ['E', E]);
          piv('O', O, [['D', D], ['C', C]]); piv('D', D, [['O', O], ['E', E]]); piv('E', E, [['D', D], ['C', C]]); piv('C', C, [['E', E], ['O', O]]);
          b.note = 'Fold line DE is x = W − d. The folded strip’s centre moves from x = W − d/2 to x = W − 3d/2, so x̄ = W/2 − d²/W.'; }
        b.unit = 'Area';
      }
      ['O', 'A', 'B', 'C'].forEach(l => { const pp = {O, A, B, C}[l]; if (b.pivots.some(x => x.l === l) || (st.mode === 'fold' && (l === 'A' || l === 'B'))) b.labels.push([l, pp]); });
      const M = b.rows.reduce((s, r) => s + r[1], 0); b.M = M; b.G = M > 1e-9 ? [b.rows.reduce((s, r) => s + r[1] * r[2], 0) / M, b.rows.reduce((s, r) => s + r[1] * r[3], 0) / M] : null;
      return b; }

    let body = null, view = null;
    function transform(){ const h = el('hang').value, pv = body.pivots.find(x => x.l === h); let rot = 0, c = [0, 0];
      if (pv && body.G) { const g = sub(body.G, pv.p); if (Math.hypot(...g) > 1e-9) { rot = -PI / 2 - Math.atan2(g[1], g[0]); c = pv.p; } }
      return {rot, c, pv, tr: ([x, y]) => { const dx = x - c[0], dy = y - c[1]; return [c[0] + dx * Math.cos(rot) - dy * Math.sin(rot), c[1] + dx * Math.sin(rot) + dy * Math.cos(rot)]; }}; }
    function fit(){ const T = transform(), all = [...body.shapes.flatMap(s => s.pts), ...body.rods.flat(), ...(body.ghost || [])].map(T.tr);
      if (!all.length) return; const xs = all.map(p => p[0]), ys = all.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const asp = P.w && P.h ? P.w / P.h : 1.6; P.cx = (x0 + x1) / 2; P.cy = (y0 + y1) / 2 - (T.pv ? 0.5 : 0); P.span = Math.max(x1 - x0 + 3, (y1 - y0 + 3) * asp) * 1.15; }

    const P = makePlot(stage, {span: 16, cx: 4, cy: 3, draw(ctx, P){ if (!body) return; const C = P.C, T = transform(), tr = T.tr;
      const path = pts => pts.forEach((p, i) => { const [a, b2] = P.toS(...tr(p)); i ? ctx.lineTo(a, b2) : ctx.moveTo(a, b2); });
      if (body.ghost) { ctx.beginPath(); path(body.ghost); ctx.strokeStyle = C.muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
      body.shapes.forEach(s => { ctx.beginPath(); path(s.pts); ctx.closePath(); s.holes.forEach(hp => { path(hp); ctx.closePath(); });
        ctx.fillStyle = s.dbl ? 'color-mix(in srgb,' + C.brand + ' 42%,transparent)' : C.soft; ctx.fill('evenodd'); ctx.strokeStyle = C.brand; ctx.lineWidth = 2; ctx.stroke(); });
      if (body.fold) P.line(body.fold.map(tr), C.warn, 2, [7, 5]);
      body.rods.forEach(r => P.line(r.map(tr), C.brand, 4.5));
      body.parts.forEach(([p, m]) => { const t = tr(p); P.dot(t[0], t[1], 6 + Math.min(8, m / 2), C.ink2, C.bg); });
      body.labels.forEach(([l, p]) => { const t = tr(p); P.text(l, t[0], t[1], C.ink2, {dx: 6, dy: -4}); });
      if (T.pv) { const p = T.pv.p; P.line([[p[0], p[1] + 2], [p[0], p[1] - 60]], C.warn, 1.5, [6, 5]); P.dot(p[0], p[1], 5, C.ink2); }
      if (body.G) { const g = tr(body.G); P.dot(g[0], g[1], 7, C.accent, C.bg); P.text('G', g[0], g[1], C.accent, {dx: 9, dy: 2, font: '700 14px IBM Plex Sans, sans-serif'}); } }});

    function hangOptions(){ const cur = el('hang').value; el('hang').innerHTML = '<option value="">Lying flat</option>' + body.pivots.map(x => `<option value="${x.l}">${x.l}</option>`).join(''); el('hang').value = body.pivots.some(x => x.l === cur) ? cur : ''; }
    function rodsUI(){ const list = st.fr === 'rect' ? ['OA', 'AB', 'BC', 'CO', 'OB', 'AC'] : st.fr === 'tri' ? ['OA', 'AC', 'CO'] : ['arc', 'OA'];
      const defOff = {OB: true, AC: st.fr === 'rect'}; st.rods = {}; list.forEach(k => st.rods[k] = !defOff[k]);
      el('rods').innerHTML = list.map(k => `<label class="tog"><input type="checkbox" data-rod="${k}" ${st.rods[k] ? 'checked' : ''}>${k === 'arc' ? 'Arc' : k}</label>`).join('');
      el('rods').querySelectorAll('[data-rod]').forEach(c => c.onchange = () => { st.rods[c.dataset.rod] = c.checked; update(true); });
      const pts = st.fr === 'arc' ? ['O', 'A', 'T'] : st.fr === 'tri' ? ['O', 'A', 'C'] : ['O', 'A', 'B', 'C'];
      el('pat').innerHTML = '<option value="">No particle</option>' + pts.map(x => `<option value="${x}">${x}</option>`).join(''); el('pat').value = pts.includes('B') ? 'B' : 'A'; }

    function update(refit){ limits(); body = build(); hangOptions(); if (refit !== false) fit(); P.redraw();
      const b = body, T = transform();
      if (!b.G) { el('out').innerHTML = 'Nothing left – add some pieces.'; return; }
      let o = `<table style="width:100%;font-size:.8rem;border-collapse:collapse"><tr style="text-align:left"><th>Piece</th><th>${b.unit}</th><th>x̄</th><th>ȳ</th></tr>${b.rows.map(r => `<tr><td>${r[0]}</td><td>${fx(r[1], 3)}</td><td>${fx(r[2], 3)}</td><td>${fx(r[3], 3)}</td></tr>`).join('')}<tr style="border-top:1px solid var(--line)"><td><b>Whole body</b></td><td><b>${fx(b.M, 3)}</b></td><td><b>${fx(b.G[0], 4)}</b></td><td><b>${fx(b.G[1], 4)}</b></td></tr></table>`;
      o += `<br>x̄ = Σmx/Σm, ȳ = Σmy/Σm${b.unit === 'Area' ? ' (mass ∝ area for a uniform lamina; holes count as negative)' : ''}`;
      if (b.note) o += `<br><br>${b.note}`;
      if (T.pv) { const g = sub(b.G, T.pv.p); o += `<br><br><b>Hanging from ${T.pv.l}:</b> ${T.pv.l}G is vertical.` + T.pv.nb.map(([n, pt]) => `<br>Angle between ${T.pv.l}${n} and the vertical = <b>${fx(ang(sub(pt, T.pv.p), g), 2)}°</b>`).join(''); }
      el('out').innerHTML = o; }

    function showModes(){ panel.querySelectorAll('[data-for]').forEach(d => d.hidden = d.dataset.for !== st.mode);
      q(panel, '[data-addtri]').hidden = st.add !== 'tri'; q(panel, '[data-hole]').hidden = st.hole === 'n';
      panel.querySelectorAll('[data-fkp]').forEach(d => d.hidden = d.dataset.fkp !== st.fk);
      el('H').closest('label').style.display = st.mode === 'fw' && st.fr === 'arc' ? 'none' : ''; }
    ['mode', 'add', 'hole', 'fr', 'fk'].forEach(name => panel.querySelectorAll(`.seg [data-${name}]`).forEach(bt => bt.onclick = () => {
      st[name] = bt.dataset[name]; panel.querySelectorAll(`.seg [data-${name}]`).forEach(x => x.setAttribute('aria-pressed', x === bt));
      if (name === 'fr') rodsUI(); if (name === 'mode') el('hang').value = ''; showModes(); update(); }));
    panel.querySelectorAll('input[type=range]').forEach(r => r.addEventListener('input', () => { q(panel, '#' + r.id + '-o').textContent = r.value; update(); }));
    el('pat').onchange = () => update(); el('hang').onchange = () => update();
    const ro = new ResizeObserver(() => { if (body) { fit(); P.redraw(); } }); ro.observe(stage);
    rodsUI(); showModes(); update();
    return () => { ro.disconnect(); P.destroy(); };
  }
};
})();
