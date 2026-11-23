// ENGAA 2019 Q16 — five identical resistors on a 3D circuit board. Voltmeter across one of the bottom pair reads 1.0 V.
// Bottom pair: 1 + 1 = 2 V; top (parallel): 2 V; currents 2/R (top) + 1/R (bottom) = 3/R through each outer resistor → 3 V each.
// Battery = 3 + 2 + 3 = 8 V (E). Current dots move at speeds 3 : 2 : 1 (outer : top : bottom).
// Board lies flat (y up); circuit drawn in x–z. Battery long plate (+) on the left.
export default (X) => {
  const { THREE, scene, TH, E, k, on, win, tv, clamp } = X;
  const Y = .07;
  // ---------- board ----------
  const board = new THREE.Mesh(new X.RoundedBoxGeometry(3.8, .12, 6.6, 4, .08), X.mat('#2a2408', { roughness: .6 })); board.position.set(0, -.06, -.2); board.receiveShadow = true; scene.add(board);
  const bgrid = new THREE.GridHelper(6.6, 33, '#6b5a10', '#3d3409'); bgrid.position.set(0, .002, -.2); bgrid.scale.x = 3.8 / 6.6; scene.add(bgrid);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), X.mat('#0c0a02', { roughness: .95 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.12; floor.receiveShadow = true; scene.add(floor);
  // ---------- layout (x, z) ----------
  const A = [-1.4, .4], B = [1.4, .4], M = [0, 1.6], Nn = [1.2, 1.6];
  const R = { L: [[-1.4, -1.25], [-1.4, -.35]], RR: [[1.4, -.35], [1.4, -1.25]], TOP: [[-.45, .4], [.45, .4]], BL: [[-1.0, 1.6], [-.25, 1.6]], BR: [[.25, 1.6], [1.0, 1.6]] };
  // wire paths (ordered the way current flows: + on the left)
  const WIRES = [
    [[-.35, -3], [-1.4, -3], [-1.4, -1.25]], [[-1.4, -.35], A],
    [A, [-.45, .4]], [[.45, .4], B],
    [A, [-1.4, 1.6], [-1.0, 1.6]], [[-.25, 1.6], [.25, 1.6]], [[1.0, 1.6], [1.4, 1.6], B],
    [B, [1.4, -.35]], [[1.4, -1.25], [1.4, -3], [.35, -3]],
    [M, [0, 2.45], [.25, 2.45]], [[.95, 2.45], [1.2, 2.45], Nn],
  ];
  const v3 = ([x, z], y = Y) => new THREE.Vector3(x, y, z);
  const wireM = X.mat('#d8d2bf', { metalness: .8, roughness: .3 });
  const tubes = WIRES.map(w => { const c = new THREE.CurvePath(); for (let i = 1; i < w.length; i++) c.add(new THREE.LineCurve3(v3(w[i - 1]), v3(w[i])));
    const m = new THREE.Mesh(new THREE.TubeGeometry(c, 64 * (w.length - 1), .035, 8, false), wireM); m.castShadow = true; scene.add(m); return m; });
  // resistors: beige body with brown-black-red-gold bands (1 kΩ, all identical)
  const resM = X.mat('#d9c39a', { roughness: .5 }), litM = X.mat('#ffc917', { emissive: '#ff9f00', emissiveIntensity: .55, roughness: .3 });
  const bandC = ['#6b3b12', '#111111', '#d92020', '#d4af37'];
  const res = {};
  Object.entries(R).forEach(([key, [p, q]]) => {
    const g = new THREE.Group(); const a = v3(p, .12), b = v3(q, .12), mid = a.clone().add(b).multiplyScalar(.5), len = a.distanceTo(b);
    g.position.copy(mid); g.lookAt(b); scene.add(g);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(.13, len - .26, 8, 24), resM); body.rotation.x = Math.PI / 2; body.castShadow = true; g.add(body);
    bandC.forEach((c, i) => { const bnd = new THREE.Mesh(new THREE.CylinderGeometry(.135, .135, .05, 24), X.mat(c, { roughness: .4 })); bnd.rotation.x = Math.PI / 2; bnd.position.z = -len * .28 + i * len * .14 + (i === 3 ? len * .1 : 0); g.add(bnd); });
    const lead = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, len, 8), wireM); lead.rotation.x = Math.PI / 2; lead.position.y = -.04; g.add(lead);
    const halo = new THREE.Mesh(new THREE.CapsuleGeometry(.24, len - .2, 8, 24), X.glow(TH.brand, { opacity: .55 })); halo.rotation.x = Math.PI / 2; halo.visible = false; g.add(halo);
    res[key] = { g, body, mid, halo };
  });
  // battery: cylinder cell lying along x
  const bat = new THREE.Group(); bat.position.set(0, .2, -3); scene.add(bat);
  const cell = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .7, 32), X.mat('#151515', { roughness: .4, metalness: .3 })); cell.rotation.z = Math.PI / 2; cell.castShadow = true; bat.add(cell);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.205, .205, .25, 32), X.mat(TH.brand, { roughness: .3 })); band.rotation.z = Math.PI / 2; band.position.x = -.2; bat.add(band);
  const nub = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .08, 16), X.mat('#cfcfcf', { metalness: .9, roughness: .2 })); nub.rotation.z = Math.PI / 2; nub.position.x = -.39; bat.add(nub);
  // voltmeter: box with an analogue dial (canvas)
  const dcv = document.createElement('canvas'); dcv.width = 512; dcv.height = 320; const dx = dcv.getContext('2d'); const dtex = new THREE.CanvasTexture(dcv); dtex.colorSpace = THREE.SRGBColorSpace;
  const drawDial = (v) => { dx.fillStyle = '#fffbe8'; dx.fillRect(0, 0, 512, 320); dx.strokeStyle = '#1b1604'; dx.lineWidth = 6; dx.beginPath(); dx.arc(256, 290, 220, Math.PI * 1.15, Math.PI * 1.85); dx.stroke();
    dx.font = '700 40px IBM Plex Sans'; dx.fillStyle = '#1b1604'; [0, 1, 2].forEach(n => { const a = Math.PI * (1.15 + .35 * n); dx.fillText(String(n), 256 + 250 * Math.cos(a) - 12, 290 + 250 * Math.sin(a) + 14); });
    const a = Math.PI * (1.15 + .7 * v / 2); dx.strokeStyle = '#d92020'; dx.lineWidth = 8; dx.beginPath(); dx.moveTo(256, 290); dx.lineTo(256 + 200 * Math.cos(a), 290 + 200 * Math.sin(a)); dx.stroke();
    dx.font = '800 64px IBM Plex Sans'; dx.fillText('V', 236, 200); dtex.needsUpdate = true; };
  const vmeter = new THREE.Group(); vmeter.position.set(.6, .18, 2.45); scene.add(vmeter);
  const vbox = new THREE.Mesh(new X.RoundedBoxGeometry(.8, .3, .55, 3, .05), X.mat('#3a3a3a', { roughness: .5 })); vbox.castShadow = true; vmeter.add(vbox);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(.66, .41), new THREE.MeshBasicMaterial({ map: dtex })); face.rotation.x = -Math.PI / 2; face.position.y = .152; vmeter.add(face);
  // nodes
  const nodes = [A, B, M, Nn].map(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(.06, 16, 12), wireM); s.position.copy(v3(p)); scene.add(s); return s; });
  // ---------- current ----------
  const FLOW = [
    { pts: [[-.35, -3], [-1.4, -3], [-1.4, .4]], sp: 3 }, { pts: [[1.4, .4], [1.4, -3], [.35, -3]], sp: 3 },
    { pts: [A, B], sp: 2 }, { pts: [A, [-1.4, 1.6], [1.4, 1.6], B], sp: 1 },
  ];
  const dotM = X.glow('#fff3a0', { opacity: 1 }), dotG = new THREE.SphereGeometry(.05, 12, 8);
  const flows = FLOW.map(f => { const c = new THREE.CurvePath(); for (let i = 1; i < f.pts.length; i++) c.add(new THREE.LineCurve3(v3(f.pts[i - 1], Y + .06), v3(f.pts[i], Y + .06)));
    const L = c.getLength(), n = Math.floor(L / .22); return { c, L, dots: Array.from({ length: n }, () => { const d = new THREE.Mesh(dotG, dotM); d.visible = false; scene.add(d); return d; }), sp: f.sp }; });
  // flow "time": slower during the slow-mo dive
  const rate = t => (t >= tv('cur') && t < tv('out')) ? .28 : 1;
  const FT = []; { let s = 0; for (let t = 0; t < 120; t += 1 / 60) { FT.push(s); s += rate(t) / 60; } }
  const flowT = t => FT[Math.min(FT.length - 1, Math.max(0, Math.floor(t * 60)))];

  // ---------- overlays ----------
  const opts = ['4.0 V', '5.0 V', '6.0 V', '7.0 V', '8.0 V', '9.0 V', '10 V'];
  X.chips(opts, 'q', 'a', null, null, [], 330);
  X.chips(opts, 'add', 'o', 'ans', 'E', [['A', 'trap']], 330);
  X.ring('pz+0.9', 2.0);
  const L = (txt, p, t0, t1, o) => X.label(txt, typeof p === 'function' ? p : v3(p, .45), t0, t1, { size: 34, ...o });
  L('1.0 V', [.6, 2.45], 'vm', 'add', { dy: 70 });
  L('1.0 V', [-.62, 1.6], 'b', 'add', { dy: -55 });
  L('2.0 V across the bottom', [0, 1.6], 'br', 'top', { dy: 60, bg: '#fff', fg: '#000' });
  L('2.0 V', [0, .4], 'top', 'add', { dy: -55 });
  L('2 units', [.2, .4], 'split', 'out', { dy: 50, bg: '#fff3a0', fg: '#000', size: 30 });
  L('1 unit', [-.4, 1.6], 'split', 'out', { dy: 50, bg: '#fff3a0', fg: '#000', size: 30 });
  L('3 units', [-1.4, -.8], 'sum3', 'out', { dx: -40, bg: '#fff3a0', fg: '#000', size: 30 });
  L('3 units', [1.4, -.8], 'sum3', 'out', { dx: 40, bg: '#fff3a0', fg: '#000', size: 30 });
  L('3.0 V', [-1.4, -.8], 'out', 'add', { dx: -30 });
  L('3.0 V', [1.4, -.8], 'out', 'add', { dx: 30 });
  X.badge('SLOW-MO', 'cur', 'out', { bg: TH.brand, fg: TH.ink, y: 250 });
  X.big('3 + 2 + 3', 'add', 'ans', { y: 1060, size: 130, color: '#fff', box: true });
  X.big('8.0 V', 'ans', 'trap', { y: 1040, size: 170, color: TH.brand, box: true });
  X.big('4.0 V ✗', 'trap', 'o', { y: 1040, size: 120, color: '#ff8a8a', from: 'left', box: true });
  ['c', 'q', 'a', 'top', 'cur', 'out', 'add', 'o'].forEach(m => X.cue('whoosh', m));
  ['vm', 'b', 'br', 'split', 'sum3'].forEach(m => X.cue('pop', m)); X.cue('slam', 'q'); X.cue('slam', 'ans'); X.cue('ding', 'ans'); X.cue('buzz', 'trap'); X.cue('riser', 'pz+0.8');
  // ---------- camera ----------
  X.cam([
    { t: 0, p: [2.6, 3.2, 5.6], l: [0, 0, -.4], fov: 42 },
    { t: 'q', p: [0, 7.4, 5.4], l: [0, 0, -.3], fov: 42, shake: true },
    { t: 'a', p: [1.6, 2.6, 4.6], l: [.5, 0, 1.6], fov: 40 },
    { t: 'br', p: [-.4, 3.0, 4.8], l: [0, 0, 1.4], fov: 40 },
    { t: 'top', p: [0, 2.6, 3.0], l: [0, 0, .4], fov: 40 },
    { t: 'cur', p: [-2.4, 1.1, 1.6], l: [-1.2, 0, .6], fov: 38, dur: 1.4 },
    { t: 'sum3', p: [-2.8, 3.2, 2.8], l: [-.6, 0, -.6], fov: 42 },
    { t: 'out', p: [0, 6.0, 3.6], l: [0, 0, -1.0], fov: 42 },
    { t: 'add', p: [0, 5.2, -.2], l: [0, 0, -3.0], fov: 42 },
    { t: 'ans', p: [0, 3.0, -1.0], l: [0, 0, -3.0], fov: 42, shake: true },
    { t: 'trap', p: [0, 7.6, 5.0], l: [0, 0, -.3], fov: 42 },
    { t: 'o', p: [0, 8.2, 5.4], l: [0, 0, -.3], fov: 42 },
  ]);
  return (t) => {
    const draw = clamp((t - tv('c') + .25) / .8); nodes.forEach(n => n.visible = draw > .6);
    tubes.forEach((m, i) => { const u = clamp(draw * tubes.length - i); m.visible = u > 0; m.geometry.setDrawRange(0, Math.floor(m.geometry.index.count * u / 3) * 3); });
    Object.values(res).forEach(r => { r.g.visible = draw > .3; r.g.scale.setScalar(E.back((t - tv('c') - .4) / .5) || .001); });
    bat.scale.setScalar(Math.max(.001, E.back((t - tv('c') - .2) / .5))); vmeter.scale.setScalar(Math.max(.001, E.back((t - tv('vm')) / .5)));
    drawDial(on('vm') ? Math.min(1, (t - tv('vm')) / .6) * (1 + .03 * Math.sin(t * 9)) : 0);
    const lit = { BR: on('a') && !on('top'), BL: on('b') && !on('top'), TOP: on('top') && !on('cur'), L: on('out') && !on('add'), RR: on('out') && !on('add') };
    Object.entries(res).forEach(([key, r]) => { r.body.material = lit[key] ? litM : resM; r.halo.visible = !!lit[key]; r.halo.material.opacity = .35 + .25 * Math.sin(t * 8);
      if (lit[key]) r.g.scale.setScalar(1.18 + .06 * Math.sin(t * 10)); });
    const ft = flowT(t), showFlow = on('cur') || t < tv('a');
    flows.forEach(f => f.dots.forEach((d, i) => { d.visible = showFlow && draw >= 1; if (!d.visible) return; const u = (((i * .22 + ft * .55 * f.sp) % f.L) + f.L) % f.L / f.L; d.position.copy(f.c.getPointAt(u)); }));
  };
};
