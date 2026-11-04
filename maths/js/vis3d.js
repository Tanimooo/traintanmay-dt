/* 3D visualisers (three.js, loaded only when needed) */
(function(){
'use strict';
const {layout, slider, bindSlider, fx, compile, colors} = window.PLOT;
const VIS = window.VIS;
const q = (r, s) => r.querySelector(s);
const icon = p => `<svg viewBox="0 0 40 40" fill="none" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

let threeP = null;
function loadThree(){
  if (window.THREE && window.THREE.OrbitControls) return Promise.resolve(window.THREE);
  if (threeP) return threeP;
  const add = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  threeP = add('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
    .then(() => add('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js')).then(() => window.THREE);
  return threeP;
}

function make3D(stage, opts = {}){
  const T = window.THREE;
  const C = colors();
  const renderer = new T.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 500);
  camera.up.set(0, 0, 1);
  const d = opts.dist || 9;
  camera.position.set(d * 0.9, d * 0.75, d * 0.6);
  const controls = new T.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.target.set(...(opts.target || [0, 0, 0]));
  scene.add(new T.AmbientLight(0xffffff, 0.75));
  const dl = new T.DirectionalLight(0xffffff, 0.6); dl.position.set(5, 3, 8); scene.add(dl);
  const group = new T.Group(); scene.add(group);
  const col = c => new T.Color(c || '#888');
  function label(text, pos, color, size = 0.42){
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d'); const fs = 64;
    ctx.font = `600 ${fs}px IBM Plex Sans, sans-serif`; const w = Math.ceil(ctx.measureText(text).width) + 16; cv.width = w; cv.height = fs + 16;
    ctx.font = `600 ${fs}px IBM Plex Sans, sans-serif`; ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, 8, cv.height / 2);
    const tex = new T.CanvasTexture(cv); const sp = new T.Sprite(new T.SpriteMaterial({map: tex, depthTest: false, transparent: true}));
    sp.scale.set(size * w / cv.height, size, 1); sp.position.set(...pos); sp.renderOrder = 10; return sp;
  }
  function axes(len = 4, parent){
    const g = new T.Group(); const cc = colors();
    [[1, 0, 0, 'x'], [0, 1, 0, 'y'], [0, 0, 1, 'z']].forEach(([x, y, z, l]) => {
      const geo = new T.BufferGeometry().setFromPoints([new T.Vector3(-len * x, -len * y, -len * z), new T.Vector3(len * x, len * y, len * z)]);
      g.add(new T.Line(geo, new T.LineBasicMaterial({color: col(cc.muted)})));
      g.add(label(l, [len * x * 1.06, len * y * 1.06, len * z * 1.06], cc.ink2));
    });
    const grid = new T.GridHelper(2 * len, 2 * len, col(cc.grid), col(cc.grid)); grid.rotation.x = Math.PI / 2; grid.material.transparent = true; grid.material.opacity = .7; g.add(grid);
    (parent || scene).add(g); return g;
  }
  function arrow(from, to, color, head = 0.25){
    const dir = new T.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]); const L = dir.length(); if (L < 1e-6) return new T.Group();
    const a = new T.ArrowHelper(dir.clone().normalize(), new T.Vector3(...from), L, col(color), Math.min(head * 1.6, L * .35), Math.min(head, L * .2));
    a.line.material.linewidth = 2; return a;
  }
  function line(pts, color, dashed){
    const geo = new T.BufferGeometry().setFromPoints(pts.map(p => new T.Vector3(...p)));
    const m = dashed ? new T.LineDashedMaterial({color: col(color), dashSize: .25, gapSize: .15}) : new T.LineBasicMaterial({color: col(color)});
    const L = new T.Line(geo, m); if (dashed) L.computeLineDistances(); return L;
  }
  function resize(){ const r = stage.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'; camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();
  let alive = true, onFrame = null;
  (function loop(){ if (!alive) return; controls.update(); onFrame && onFrame(); renderer.render(scene, camera); requestAnimationFrame(loop); })();
  const clear = () => { while (group.children.length) { const o = group.children.pop(); o.traverse && o.traverse(x => { x.geometry && x.geometry.dispose(); if (x.material) { (Array.isArray(x.material) ? x.material : [x.material]).forEach(m => { m.map && m.map.dispose(); m.dispose(); }); } }); } };
  return {T, scene, camera, renderer, controls, group, label, axes, arrow, line, col, clear, set onFrame(f){ onFrame = f; },
    destroy(){ alive = false; ro.disconnect(); clear(); renderer.dispose(); renderer.domElement.remove(); controls.dispose(); }};
}
function boot(root, panelHTML, build, opts = {}){
  const {stage, panel} = layout(root, panelHTML, {hud: 'Drag to rotate · right-drag or two fingers to pan · scroll or pinch to zoom', aspect: opts.aspect});
  let api = null, dead = false;
  const loading = document.createElement('div'); loading.className = 'hud'; loading.style.cssText = 'top:12px;bottom:auto'; loading.textContent = 'Loading 3D engine…'; stage.appendChild(loading);
  loadThree().then(() => { if (dead) return; loading.remove(); api = build(stage, panel); })
    .catch(() => { loading.textContent = 'Could not load the 3D engine – check your connection.'; });
  return () => { dead = true; api && api.destroy && api.destroy(); };
}

/* ---------- 3×3 linear algebra ---------- */
const det3 = m => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
const mv = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = a => Math.hypot(...a), unit = a => { const n = norm(a); return n < 1e-12 ? [0, 0, 0] : a.map(x => x / n); };
function realRoots3(a, b, c, d){ // a x³ + b x² + c x + d
  b /= a; c /= a; d /= a; const p = c - b * b / 3, qq = 2 * b * b * b / 27 - b * c / 3 + d, D = qq * qq / 4 + p * p * p / 27, s = -b / 3;
  if (Math.abs(D) < 1e-10) { const u = Math.cbrt(-qq / 2); return Math.abs(u) < 1e-9 ? [s] : [s + 2 * u, s - u]; }
  if (D > 0) { const u = Math.cbrt(-qq / 2 + Math.sqrt(D)), v = Math.cbrt(-qq / 2 - Math.sqrt(D)); return [s + u + v]; }
  const r = Math.sqrt(-p * p * p / 27), phi = Math.acos(Math.max(-1, Math.min(1, -qq / (2 * r)))), m = 2 * Math.cbrt(r);
  return [s + m * Math.cos(phi / 3), s + m * Math.cos((phi + 2 * Math.PI) / 3), s + m * Math.cos((phi + 4 * Math.PI) / 3)];
}
function eigen3(m){
  const tr = m[0] + m[4] + m[8];
  const c2 = (m[0] * m[4] - m[1] * m[3]) + (m[0] * m[8] - m[2] * m[6]) + (m[4] * m[8] - m[5] * m[7]);
  const roots = realRoots3(1, -tr, c2, -det3(m));
  const uniq = []; roots.forEach(r => { r = Math.round(r * 1e6) / 1e6; if (!uniq.some(u => Math.abs(u - r) < 1e-5)) uniq.push(r); });
  return uniq.map(l => {
    const A = [m[0] - l, m[1], m[2], m[3], m[4] - l, m[5], m[6], m[7], m[8] - l];
    const r = [[A[0], A[1], A[2]], [A[3], A[4], A[5]], [A[6], A[7], A[8]]];
    const cs = [cross(r[0], r[1]), cross(r[0], r[2]), cross(r[1], r[2])].sort((a, b) => norm(b) - norm(a));
    if (norm(cs[0]) > 1e-6) return {l, dim: 1, v: unit(cs[0])};
    // rank ≤ 1: eigenspace is a plane (or everything)
    const row = r.slice().sort((a, b) => norm(b) - norm(a))[0];
    if (norm(row) < 1e-9) return {l, dim: 3};
    return {l, dim: 2, n: unit(row)};
  });
}

/* =============================================================== 3D matrix transformations */
VIS.matrix3d = {
  name: '3D matrix transformations', group: 'Matrices & vectors',
  desc: 'Apply any 3×3 matrix to the unit cube in 3D. Rotate the view, animate the transformation, and see the determinant as a volume scale factor along with invariant lines and planes.',
  topics: [['cp1', 'transf'], ['cp1', 'matrices'], ['fp2', 'matrix']],
  icon: icon('<path d="M8 14l10-6 14 6v14l-10 6-14-6z" stroke="var(--line-strong)"/><path d="M8 14l14 6 10-6M22 20v14" stroke="var(--line-strong)"/><path d="M6 18l14-8 14 8-6 14-16-2z" stroke="var(--accent)"/>'),
  mount(root){
    const PRE = [['I', 'Identity'], ['rz', 'Rotate about z'], ['rx', 'Rotate about x'], ['ry', 'Rotate about y'], ['mz', 'Reflect in z = 0'], ['mx', 'Reflect in x = 0'], ['mxy', 'Reflect in x = y'],
      ['en', 'Enlarge ×1.5'], ['st', 'Stretch'], ['sh', 'Shear'], ['pr', 'Project onto z = 0'], ['sg', 'Singular (rank 2)']];
    return boot(root, `
      <div><h4>Matrix M</h4><div class="mat" style="grid-template-columns:repeat(3,auto);margin-top:8px">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<input id="m${i}" aria-label="entry ${i + 1}">`).join('')}</div></div>
      <div><h4>Presets</h4><div class="presets" style="margin-top:8px">${PRE.map(([k, l]) => `<button class="btn sm" data-p="${k}">${l}</button>`).join('')}</div></div>
      ${slider('th', 'θ (°)', -180, 180, 5, 90)}${slider('t', 'Animate', 0, 1, 0.01, 1, v => Math.round(v * 100) + '%')}
      <div class="row" style="gap:12px"><button class="btn sm" id="play">Play</button><label class="tog"><input type="checkbox" id="orig" checked>Original cube</label><label class="tog"><input type="checkbox" id="inv" checked>Invariant lines/planes</label></div>
      <div class="readout" id="out"></div>`, (stage, panel) => {
      const G = make3D(stage, {dist: 8, target: [0.5, 0.5, 0.5]}); const T = G.T;
      G.axes(3.5);
      let M = [1, 0.5, 0, 0, 1, 0, 0.5, 0, 1.5], t = 1, th = 90, preset = null;
      const inputs = [...Array(9)].map((_, i) => q(panel, '#m' + i));
      const setInputs = () => inputs.forEach((el, i) => { el.value = fx(M[i], 3); });
      const cur = () => M.map((v, i) => (i % 4 === 0 ? 1 : 0) + t * (v - (i % 4 === 0 ? 1 : 0)));
      const V = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
      const F = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
      const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      function box(m, color, opacity, edgeColor){
        const g = new T.Group(); const P = V.map(v => mv(m, v));
        const geo = new T.BufferGeometry(); const pos = [];
        F.forEach(f => { [[0, 1, 2], [0, 2, 3]].forEach(tri => tri.forEach(k => pos.push(...P[f[k]]))); });
        geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
        g.add(new T.Mesh(geo, new T.MeshLambertMaterial({color: G.col(color), transparent: true, opacity, side: T.DoubleSide, depthWrite: false})));
        E.forEach(([a, b]) => g.add(G.line([P[a], P[b]], edgeColor)));
        return g;
      }
      function build(){
        G.clear(); const C = colors(), m = cur();
        if (q(panel, '#orig').checked) G.group.add(box([1, 0, 0, 0, 1, 0, 0, 0, 1], C.brand, .12, C.brand));
        G.group.add(box(m, C.accent, .28, C.accent));
        [[[m[0], m[3], m[6]], C.bad, 'Mi'], [[m[1], m[4], m[7]], C.good, 'Mj'], [[m[2], m[5], m[8]], C.blue, 'Mk']].forEach(([v, c, l]) => { G.group.add(G.arrow([0, 0, 0], v, c)); G.group.add(G.label(l, v.map(x => x * 1.08 + .08), c, .34)); });
        if (q(panel, '#inv').checked && t === 1) {
          eigen3(M).forEach(e => {
            if (e.dim === 1) { const v = e.v.map(x => x * 6); G.group.add(G.line([v.map(x => -x), v], Math.abs(e.l - 1) < 1e-6 ? C.good : C.warn, Math.abs(e.l - 1) >= 1e-6)); }
            else if (e.dim === 2) { const n = e.n, a = unit(Math.abs(n[0]) < .9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0])), b = cross(n, a), s = 3.2;
              const geo = new T.PlaneGeometry(2 * s, 2 * s); const mesh = new T.Mesh(geo, new T.MeshBasicMaterial({color: G.col(Math.abs(e.l - 1) < 1e-6 ? C.good : C.warn), transparent: true, opacity: .14, side: T.DoubleSide, depthWrite: false}));
              const basis = new T.Matrix4().makeBasis(new T.Vector3(...a), new T.Vector3(...b), new T.Vector3(...n)); mesh.setRotationFromMatrix(basis); G.group.add(mesh); }
          });
        }
        readout();
      }
      function readout(){
        const d = det3(M), es = eigen3(M);
        const ev = es.map(e => e.dim === 1 ? `λ = ${fx(e.l, 3)}: line through O in direction (${e.v.map(x => fx(x, 3)).join(', ')})${Math.abs(e.l - 1) < 1e-6 ? ' – <b>invariant points</b>' : ''}` :
          e.dim === 2 ? `λ = ${fx(e.l, 3)}: <b>plane</b> ${fx(e.n[0], 3)}x + ${fx(e.n[1], 3)}y + ${fx(e.n[2], 3)}z = 0${Math.abs(e.l - 1) < 1e-6 ? ' of invariant points' : ' (every line through O in it is invariant)'}` : `λ = ${fx(e.l, 3)}: every vector`);
        q(panel, '#out').innerHTML = `det M = <b>${fx(d, 4)}</b> → volumes ×${fx(Math.abs(d), 4)}${d < 0 ? ', orientation reversed' : ''}${Math.abs(d) < 1e-9 ? '<br><b>Singular</b>: space is squashed onto a plane, line or point – no inverse.' : ''}<br>Real eigenvalues / invariant directions:<br>${ev.join('<br>') || 'none'}<br><span style="color:var(--bad)">Mi</span>, <span style="color:var(--good)">Mj</span>, <span style="color:var(--blue)">Mk</span> are the columns of M.`;
      }
      inputs.forEach((el, i) => el.addEventListener('input', () => { const v = parseFloat(el.value); if (isFinite(v)) { M[i] = v; preset = null; build(); } }));
      function applyPreset(k){ preset = k; const r = th * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
        M = {I: [1, 0, 0, 0, 1, 0, 0, 0, 1], rz: [c, -s, 0, s, c, 0, 0, 0, 1], rx: [1, 0, 0, 0, c, -s, 0, s, c], ry: [c, 0, s, 0, 1, 0, -s, 0, c], mz: [1, 0, 0, 0, 1, 0, 0, 0, -1], mx: [-1, 0, 0, 0, 1, 0, 0, 0, 1],
          mxy: [0, 1, 0, 1, 0, 0, 0, 0, 1], en: [1.5, 0, 0, 0, 1.5, 0, 0, 0, 1.5], st: [2, 0, 0, 0, 1, 0, 0, 0, 0.5], sh: [1, 0, 1, 0, 1, 0.5, 0, 0, 1], pr: [1, 0, 0, 0, 1, 0, 0, 0, 0], sg: [1, 0, 1, 0, 1, 1, 1, 1, 2]}[k].map(v => Math.round(v * 1e6) / 1e6);
        setInputs(); build(); }
      panel.querySelectorAll('[data-p]').forEach(b => b.onclick = () => applyPreset(b.dataset.p));
      bindSlider(panel, 'th', v => { th = v; if (['rz', 'rx', 'ry'].includes(preset)) applyPreset(preset); });
      bindSlider(panel, 't', v => { t = v; build(); }, v => Math.round(v * 100) + '%');
      ['orig', 'inv'].forEach(id => q(panel, '#' + id).onchange = build);
      let raf; q(panel, '#play').onclick = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const step = now => { let x = Math.min(1, (now - t0) / 1800); t = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; q(panel, '#t').value = t; q(panel, '#t-o').textContent = Math.round(t * 100) + '%'; build(); if (x < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); };
      const onTheme = () => build(); window.addEventListener('themechange', onTheme);
      setInputs(); build();
      return {destroy(){ cancelAnimationFrame(raf); window.removeEventListener('themechange', onTheme); G.destroy(); }};
    });
  }
};

/* =============================================================== lines & planes */
VIS.vectors3d = {
  name: 'Lines & planes in 3D', group: 'Matrices & vectors',
  desc: 'Two lines r = a + λb and a plane r·n = d. Find out whether the lines meet, are parallel or skew, then get angles, intersections and shortest distances.',
  topics: [['cp1', 'vectors'], ['pure', 'vec'], ['fp1', 'vectors']],
  icon: icon('<path d="M6 30l14-8 14 8-14 8z" fill="var(--brand-soft)"/><path d="M8 8l22 26" stroke="var(--accent)"/><path d="M32 6L12 30" stroke="var(--blue)"/>'),
  mount(root){
    const vin = (id, v) => `<div class="row" style="gap:6px;flex-wrap:nowrap">${v.map((x, i) => `<input id="${id}${i}" value="${x}" aria-label="${id} ${'xyz'[i]}" style="width:58px;height:34px;text-align:center;border:1px solid var(--line);border-radius:7px;background:var(--surface-2);font-family:var(--f-mono)">`).join('')}</div>`;
    return boot(root, `
      <div><h4 style="color:var(--accent)">Line 1: r = a + λb</h4><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">a</span>${vin('a1', [1, 0, 2])}</div><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">b</span>${vin('b1', [1, 2, -1])}</div></div>
      <div><h4 style="color:var(--blue)">Line 2: r = c + μd</h4><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">c</span>${vin('a2', [0, 3, 0])}</div><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">d</span>${vin('b2', [2, -1, 1])}</div></div>
      <div><h4 style="color:var(--brand)">Plane: r·n = k</h4><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">n</span>${vin('n', [1, 1, 2])}</div><div class="row" style="margin-top:6px"><span class="muted" style="width:1.2em">k</span><input id="k" value="4" style="width:58px;height:34px;text-align:center;border:1px solid var(--line);border-radius:7px;background:var(--surface-2);font-family:var(--f-mono)"></div></div>
      <div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="showP" checked>Plane</label><label class="tog"><input type="checkbox" id="showL2" checked>Line 2</label></div>
      <div class="readout" id="out"></div>`, (stage, panel) => {
      const G = make3D(stage, {dist: 14}); const T = G.T; G.axes(5);
      const rv = id => [0, 1, 2].map(i => parseFloat(q(panel, '#' + id + i).value) || 0);
      function build(){
        G.clear(); const C = colors();
        const a = rv('a1'), b = rv('b1'), c = rv('a2'), d = rv('b2'), n = rv('n'), k = parseFloat(q(panel, '#k').value) || 0;
        const L = (p, u) => [p.map((x, i) => x - 8 * u[i]), p.map((x, i) => x + 8 * u[i])];
        G.group.add(G.line(L(a, unit(b)), C.accent)); G.group.add(G.arrow(a, a.map((x, i) => x + b[i]), C.accent, .2)); G.group.add(G.label('A', a, C.accent, .35));
        const show2 = q(panel, '#showL2').checked, showP = q(panel, '#showP').checked;
        if (show2) { G.group.add(G.line(L(c, unit(d)), C.blue)); G.group.add(G.arrow(c, c.map((x, i) => x + d[i]), C.blue, .2)); G.group.add(G.label('C', c, C.blue, .35)); }
        const out = [];
        if (showP && norm(n) > 1e-9) {
          const nu = unit(n), p0 = nu.map(x => x * k / norm(n)), e1 = unit(Math.abs(nu[0]) < .9 ? cross(nu, [1, 0, 0]) : cross(nu, [0, 1, 0])), e2 = cross(nu, e1);
          const mesh = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshBasicMaterial({color: G.col(C.brand), transparent: true, opacity: .16, side: T.DoubleSide, depthWrite: false}));
          mesh.setRotationFromMatrix(new T.Matrix4().makeBasis(new T.Vector3(...e1), new T.Vector3(...e2), new T.Vector3(...nu))); mesh.position.set(...p0); G.group.add(mesh);
          G.group.add(G.arrow(p0, p0.map((x, i) => x + nu[i] * 1.5), C.brand, .2));
          // line 1 and plane
          const bn = dot(b, n);
          if (Math.abs(bn) < 1e-9) out.push(Math.abs(dot(a, n) - k) < 1e-9 ? 'Line 1 lies in the plane.' : 'Line 1 is parallel to the plane (no intersection). Distance = ' + fx(Math.abs(dot(a, n) - k) / norm(n), 4));
          else { const lam = (k - dot(a, n)) / bn, X = a.map((x, i) => x + lam * b[i]); G.group.add(sphere(X, C.warn));
            const ang = Math.asin(Math.min(1, Math.abs(bn) / (norm(b) * norm(n)))) * 180 / Math.PI;
            out.push(`Line 1 meets plane at λ = ${fx(lam, 4)}: (${X.map(v => fx(v, 3)).join(', ')})<br>Angle between line 1 and plane = <b>${fx(ang, 2)}°</b> (sin θ = |b·n|/|b||n|)`); }
          out.push(`Distance from O to plane = |k|/|n| = ${fx(Math.abs(k) / norm(n), 4)}`);
        }
        if (show2) {
          const cr = cross(b, d), w = c.map((x, i) => x - a[i]);
          const angL = Math.acos(Math.min(1, Math.abs(dot(b, d)) / (norm(b) * norm(d)))) * 180 / Math.PI;
          if (norm(cr) < 1e-9) { const dist = norm(cross(w, b)) / norm(b); out.push(dist < 1e-9 ? 'The lines are the same line.' : `Lines are <b>parallel</b>, distance apart = ${fx(dist, 4)}`); }
          else {
            const dist = Math.abs(dot(w, cr)) / norm(cr);
            // closest points
            const bb = dot(b, b), dd = dot(d, d), bd = dot(b, d), wb = dot(w, b), wd = dot(w, d), den = bb * dd - bd * bd;
            const lam = (wb * dd - wd * bd) / den, mu = (wb * bd - wd * bb) / den;
            const P1 = a.map((x, i) => x + lam * b[i]), P2 = c.map((x, i) => x + mu * d[i]);
            if (dist < 1e-6) { G.group.add(sphere(P1, C.good)); out.push(`Lines <b>intersect</b> at (${P1.map(v => fx(v, 3)).join(', ')}) with λ = ${fx(lam, 3)}, μ = ${fx(mu, 3)}`); }
            else { G.group.add(G.line([P1, P2], C.bad, true)); G.group.add(sphere(P1, C.bad, .09)); G.group.add(sphere(P2, C.bad, .09));
              out.push(`Lines are <b>skew</b>. Shortest distance = |(c − a)·(b × d)| / |b × d| = <b>${fx(dist, 4)}</b><br>Common perpendicular direction b × d = (${cr.map(v => fx(v, 3)).join(', ')})`); }
            out.push(`Acute angle between the lines = <b>${fx(angL, 2)}°</b> (cos θ = |b·d|/|b||d|)`);
          }
        }
        q(panel, '#out').innerHTML = out.join('<br><br>') || 'Turn on line 2 or the plane.';
      }
      function sphere(p, c, r = .13){ const m = new T.Mesh(new T.SphereGeometry(r, 18, 12), new T.MeshLambertMaterial({color: G.col(c)})); m.position.set(...p); return m; }
      panel.querySelectorAll('input').forEach(el => el.addEventListener('input', build));
      const onTheme = () => build(); window.addEventListener('themechange', onTheme);
      build();
      return {destroy(){ window.removeEventListener('themechange', onTheme); G.destroy(); }};
    });
  }
};

/* =============================================================== volumes of revolution */
VIS.volrev = {
  name: 'Volumes of revolution', group: 'Further calculus',
  desc: 'Spin y = f(x) about the x-axis (or x = g(y) about the y-axis) and watch the solid form. Volume = π∫y² dx, worked out numerically.',
  topics: [['cp1', 'volrev'], ['cp2', 'volrev'], ['pure', 'integ']],
  icon: icon('<ellipse cx="10" cy="20" rx="3" ry="9"/><ellipse cx="30" cy="20" rx="3" ry="13" stroke="var(--accent)"/><path d="M10 11c8-2 14-4 20-4M10 29c8 2 14 4 20 4"/>'),
  mount(root){
    const PRE = [['sqrt(x)', 0, 4, 'Paraboloid'], ['x', 0, 3, 'Cone'], ['sqrt(9-x^2)', -3, 3, 'Sphere'], ['1/x', 1, 4, "Gabriel's horn"], ['sin(x)', 0, 3.14159, 'sin x'], ['e^(x/2)', 0, 2, 'eˣᐟ²'], ['cosh(x)', -1.5, 1.5, 'cosh x']];
    return boot(root, `
      <label class="field">y = f(x)<input id="f" value="sqrt(x)" spellcheck="false" style="font-family:var(--f-mono)"></label>
      <div class="presets">${PRE.map((p, i) => `<button class="btn sm" data-i="${i}">${p[3]}</button>`).join('')}</div>
      <div class="row"><label class="field">a<input id="a" type="number" value="0" step="0.5" style="width:80px"></label><label class="field">b<input id="b" type="number" value="4" step="0.5" style="width:80px"></label></div>
      <div class="seg" role="group" aria-label="Axis"><button data-ax="x" aria-pressed="true">About x-axis</button><button data-ax="y" aria-pressed="false">About y-axis</button></div>
      ${slider('sw', 'Sweep', 0, 360, 1, 300, v => v + '°')}
      <div class="row"><button class="btn sm" id="play">Spin</button><label class="tog"><input type="checkbox" id="disc" checked>Show a disc</label></div>
      ${slider('dx', 'Disc at x', 0, 1, 0.01, 0.6, v => Math.round(v * 100) + '%')}
      <div class="readout" id="out"></div>`, (stage, panel) => {
      const G = make3D(stage, {dist: 13, target: [2, 0, 0]}); const T = G.T; G.axes(5);
      let f = compile('sqrt(x)'), ax = 'x';
      const num = id => parseFloat(q(panel, '#' + id).value);
      function vol(){ const a = num('a'), b = num('b'), n = 4000; let s = 0;
        for (let i = 0; i < n; i++) { const x = a + (b - a) * (i + .5) / n; const y = f(x); if (isFinite(y)) s += (ax === 'x' ? y * y : 2 * Math.abs(x) * Math.abs(y)); }
        return (ax === 'x' ? Math.PI : Math.PI) * s * (b - a) / n; }
      function build(){
        G.clear(); const C = colors(), a = num('a'), b = num('b'), sw = +q(panel, '#sw').value * Math.PI / 180;
        if (!(b > a)) { q(panel, '#out').textContent = 'Need b > a.'; return; }
        const NX = 80, NT = 64, pos = [], idx = [];
        if (ax === 'x') {
          for (let i = 0; i <= NX; i++) { const x = a + (b - a) * i / NX; let y = f(x); if (!isFinite(y)) y = 0; y = Math.min(Math.abs(y), 50);
            for (let j = 0; j <= NT; j++) { const t = sw * j / NT; pos.push(x, y * Math.cos(t), y * Math.sin(t)); } }
        } else { // rotate region between curve and x-axis about the y-axis → shell surface: points (x cos t, x sin t, y) with vertical axis z = y
          for (let i = 0; i <= NX; i++) { const x = a + (b - a) * i / NX; let y = f(x); if (!isFinite(y)) y = 0; y = Math.max(-50, Math.min(50, y));
            for (let j = 0; j <= NT; j++) { const t = sw * j / NT; pos.push(x * Math.cos(t), x * Math.sin(t), y); } } }
        for (let i = 0; i < NX; i++) for (let j = 0; j < NT; j++) { const p = i * (NT + 1) + j; idx.push(p, p + NT + 1, p + 1, p + 1, p + NT + 1, p + NT + 2); }
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
        G.group.add(new T.Mesh(geo, new T.MeshPhongMaterial({color: G.col(C.accent), transparent: true, opacity: .55, side: T.DoubleSide, shininess: 40, depthWrite: false})));
        // generating curve
        const cur = []; for (let i = 0; i <= NX; i++) { const x = a + (b - a) * i / NX, y = f(x); if (isFinite(y)) cur.push(ax === 'x' ? [x, 0, Math.min(Math.abs(y), 50) * 0 + y] : [x, 0, y]); }
        // show the curve in the xz-plane (z plays y)
        G.group.add(G.line(cur.map(p => [p[0], 0, p[2]]), C.brand));
        if (q(panel, '#disc').checked && ax === 'x') { const x = a + (b - a) * (+q(panel, '#dx').value), y = Math.abs(f(x)); if (isFinite(y)) {
          const disc = new T.Mesh(new T.CylinderGeometry(y, y, (b - a) / 60, 48), new T.MeshLambertMaterial({color: G.col(C.warn), transparent: true, opacity: .85})); disc.rotation.z = Math.PI / 2; disc.position.set(x, 0, 0); G.group.add(disc); } }
        const V = vol();
        q(panel, '#out').innerHTML = ax === 'x' ? `V = π ∫<sub>${fx(a)}</sub><sup>${fx(b)}</sup> y² dx ≈ <b>${fx(V, 5)}</b><br>= ${fx(V / Math.PI, 5)}π<br>Each thin disc has volume ≈ πy²δx.` :
          `Rotating the region under the curve about the y-axis (shell method):<br>V = 2π ∫ x·y dx ≈ <b>${fx(V, 5)}</b> = ${fx(V / Math.PI, 5)}π<br>Edexcel usually writes this as π∫x² dy.`;
      }
      q(panel, '#f').addEventListener('input', e => { try { f = compile(e.target.value); e.target.style.borderColor = ''; build(); } catch(err) { e.target.style.borderColor = 'var(--bad)'; } });
      ['a', 'b'].forEach(id => q(panel, '#' + id).addEventListener('input', build));
      panel.querySelectorAll('[data-i]').forEach(bt => bt.onclick = () => { const p = PRE[+bt.dataset.i]; q(panel, '#f').value = p[0]; f = compile(p[0]); q(panel, '#a').value = p[1]; q(panel, '#b').value = p[2]; build(); });
      panel.querySelectorAll('[data-ax]').forEach(bt => bt.onclick = () => { ax = bt.dataset.ax; panel.querySelectorAll('[data-ax]').forEach(x => x.setAttribute('aria-pressed', x === bt)); build(); });
      bindSlider(panel, 'sw', build, v => v + '°'); bindSlider(panel, 'dx', build, v => Math.round(v * 100) + '%'); q(panel, '#disc').onchange = build;
      let raf; q(panel, '#play').onclick = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const step = now => { const x = Math.min(1, (now - t0) / 2200); q(panel, '#sw').value = Math.round(360 * x); q(panel, '#sw-o').textContent = Math.round(360 * x) + '°'; build(); if (x < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); };
      const onTheme = () => build(); window.addEventListener('themechange', onTheme);
      build();
      return {destroy(){ cancelAnimationFrame(raf); window.removeEventListener('themechange', onTheme); G.destroy(); }};
    });
  }
};
/* =============================================================== three planes */
VIS.planes3 = {
  name: 'Three planes & 3×3 systems', group: 'Matrices & vectors',
  desc: 'Three equations in x, y, z as three planes. See when they meet at a single point (det ≠ 0), form a sheaf, a prism or have no common point – the geometric meaning of a singular matrix.',
  topics: [['cp1', 'matrices'], ['cp1', 'vectors'], ['fp2', 'matrix']],
  icon: icon('<path d="M4 26l16-8 16 8-16 8z" fill="var(--brand-soft)"/><path d="M8 6l8 28M32 6l-8 28" stroke="var(--accent)"/><circle cx="20" cy="24" r="2.5" fill="var(--bad)" stroke="none"/>'),
  mount(root){
    const PRE = {pt: [[1, 1, 1, 6], [1, -1, 2, 5], [2, 1, -1, 1]], sheaf: [[1, 1, 1, 3], [1, -1, 0, 0], [2, 0, 1, 3]], prism: [[1, 1, 1, 3], [1, -1, 0, 0], [2, 0, 1, 5]], par: [[1, 1, 1, 3], [2, 2, 2, 1], [1, -1, 2, 2]], same: [[1, 1, 1, 3], [2, 2, 2, 6], [1, -1, 2, 2]]};
    const row = i => `<div class="row" style="gap:3px;flex-wrap:nowrap;font-family:var(--f-mono);font-size:.84rem">${['x +', 'y +', 'z =', ''].map((l, j) => `<input id="m${i}${j}" style="width:44px;height:32px;text-align:center;border:1px solid var(--line);border-radius:7px;background:var(--surface-2);font-family:var(--f-mono)">${l}`).join('')}</div>`;
    return boot(root, `<div style="display:grid;gap:6px">${[0, 1, 2].map(row).join('')}</div>
      <div class="presets">${[['pt', 'Unique point'], ['sheaf', 'Sheaf'], ['prism', 'Prism'], ['par', 'Parallel planes'], ['same', 'Repeated plane']].map(([k, l]) => `<button class="btn sm" data-p="${k}">${l}</button>`).join('')}</div>
      <div class="readout" id="out"></div>`, (stage, panel) => {
      const G = make3D(stage, {dist: 16}); const T = G.T; G.axes(5);
      const val = (i, j) => parseFloat(q(panel, `#m${i}${j}`).value) || 0;
      const set = k => PRE[k].forEach((r, i) => r.forEach((v, j) => q(panel, `#m${i}${j}`).value = v));
      function plane(n, d, col){ const nn = norm(n); if (nn < 1e-9) return; const nu = unit(n), p0 = nu.map(x => x * d / nn), e1 = unit(Math.abs(nu[0]) < .9 ? cross(nu, [1, 0, 0]) : cross(nu, [0, 1, 0])), e2 = cross(nu, e1);
        const m = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshBasicMaterial({color: G.col(col), transparent: true, opacity: .22, side: T.DoubleSide, depthWrite: false}));
        m.setRotationFromMatrix(new T.Matrix4().makeBasis(new T.Vector3(...e1), new T.Vector3(...e2), new T.Vector3(...nu))); m.position.set(...p0); G.group.add(m); }
      function build(){
        G.clear(); const C = colors(), cols = [C.accent, C.blue, C.brand];
        const N = [0, 1, 2].map(i => [val(i, 0), val(i, 1), val(i, 2)]), D = [0, 1, 2].map(i => val(i, 3));
        N.forEach((n, i) => plane(n, D[i], cols[i]));
        const M = N.flat(), det = det3(M); let o = `det M = <b>${fx(det, 4)}</b><br>`;
        if (Math.abs(det) > 1e-9) { // Cramer
          const sol = [0, 1, 2].map(k => det3(N.map((r, i) => r.map((v, j) => j === k ? D[i] : v)).flat()) / det);
          const s = new T.Mesh(new T.SphereGeometry(.16, 18, 12), new T.MeshLambertMaterial({color: G.col(C.bad)})); s.position.set(...sol); G.group.add(s);
          o += `M is non-singular, so the planes meet at a <b>single point</b><br>(x, y, z) = (${sol.map(v => fx(v, 4)).join(', ')})<br>x = M⁻¹b`;
        } else {
          const par = (a, b) => norm(cross(a, b)) < 1e-9;
          const same = (i, j) => { if (!par(N[i], N[j])) return false; const k = Math.abs(N[i][0]) > 1e-9 ? N[j][0] / N[i][0] : Math.abs(N[i][1]) > 1e-9 ? N[j][1] / N[i][1] : N[j][2] / N[i][2]; return Math.abs(D[j] - k * D[i]) < 1e-9; };
          const pairs = [[0, 1], [0, 2], [1, 2]], parPairs = pairs.filter(([i, j]) => par(N[i], N[j]));
          if (parPairs.length) { const sm = parPairs.filter(([i, j]) => same(i, j));
            o += sm.length === parPairs.length && parPairs.length === 3 ? 'All three equations describe the <b>same plane</b>: infinitely many solutions.' : sm.length && parPairs.length === 1 ? 'Two equations are the <b>same plane</b>; the third cuts it in a line: infinitely many solutions.' : 'At least two planes are <b>parallel</b> (normals are multiples) and distinct: no solutions, inconsistent.'; }
          else { // check consistency: is there a common line? use rank of augmented matrix via 2 planes' line
            const dir = cross(N[0], N[1]); let p; { const a = N[0], b = N[1], n = dir, nn = dot(n, n); p = cross(n, b).map((v, i) => (D[0] * v + D[1] * cross(a, n)[i]) / nn); }
            const r = dot(N[2], p) - D[2];
            if (Math.abs(r) < 1e-7) { o += 'The three planes share a common line: a <b>sheaf</b>. Consistent with infinitely many solutions.'; G.group.add(G.line([p.map((v, i) => v - 6 * unit(dir)[i]), p.map((v, i) => v + 6 * unit(dir)[i])], C.bad)); }
            else o += 'Each pair of planes meets in a line, and the three lines are parallel: a <b>triangular prism</b>. Inconsistent, so no solutions.'; }
        }
        q(panel, '#out').innerHTML = o + '<br><br>Drag to rotate. Colours: equation 1 purple, 2 blue, 3 green.';
      }
      panel.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { set(b.dataset.p); build(); });
      panel.querySelectorAll('input').forEach(el => el.addEventListener('input', build));
      const onTheme = () => build(); window.addEventListener('themechange', onTheme);
      set('pt'); build();
      return {destroy(){ window.removeEventListener('themechange', onTheme); G.destroy(); }};
    });
  }
};
})();
