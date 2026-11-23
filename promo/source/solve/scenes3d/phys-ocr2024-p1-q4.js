// OCR A June 2024 P1 Q4 — g from a light gate, in 3D.
// Units: 1 = 10 cm. Ball diameter 5.0 cm (r = 0.25). g = 1.25 / 0.12 exactly as the data give it, so the ball's
// bottom reaches the beam at τ = 0.10 s and its top clears it at τ = 0.14 s (it falls exactly its 5.0 cm width).
export default (X) => {
  const { THREE, scene, TH, E, k, on, win, tv, clamp } = X;
  const g = 1.25 / 0.12, R = 0.25, YB0 = 3.6;                  // ball bottom starts at y = 3.6
  const fall = tau => 10 * 0.5 * g * tau * tau;                // in scene units
  const BEAM = YB0 - fall(0.10);
  const brand = new THREE.Color(TH.brand);

  // ---------- set ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), X.mat('#1a0811', { roughness: .9 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(60, 120, TH.brand, TH.deep); grid.material.opacity = .18; grid.material.transparent = true; grid.position.y = .002; scene.add(grid);
  const metal = X.mat('#d9d4df', { metalness: .8, roughness: .25 }), dark = X.mat('#2b2230', { roughness: .5 });
  const stand = new THREE.Group(); scene.add(stand);
  const base = new THREE.Mesh(new X.RoundedBoxGeometry(1.6, .12, 1.1, 3, .04), dark); base.position.set(-1.25, .06, 0); stand.add(base);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 4.6, 16), metal); rod.position.set(-1.25, 2.3, -.2); stand.add(rod);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 1.3, 12), metal); arm.rotation.z = Math.PI / 2; arm.position.set(-.6, 4.4, -.2); stand.add(arm);
  const magnet = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .32, 32), dark); magnet.position.set(0, 4.22, 0); stand.add(magnet);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.2, .025, 8, 40), X.glow(TH.brand)); ring.rotation.x = Math.PI / 2; ring.position.set(0, 4.08, 0); stand.add(ring);
  stand.traverse(o => { if (o.isMesh) o.castShadow = true; });
  // light gate: two arms on a bar behind the ball's path
  const gateMat = X.mat(TH.deep, { roughness: .35 });
  const gate = new THREE.Group(); scene.add(gate);
  [-1, 1].forEach(s => { const a = new THREE.Mesh(new X.RoundedBoxGeometry(.24, .5, .75, 3, .05), gateMat); a.position.set(s * .62, BEAM, -.18); a.castShadow = true; gate.add(a); });
  const bar = new THREE.Mesh(new X.RoundedBoxGeometry(1.5, .16, .18, 3, .04), gateMat); bar.position.set(0, BEAM - .2, -.5); gate.add(bar);
  const emitter = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 16), X.glow(TH.brand)); emitter.position.set(-.49, BEAM, 0); gate.add(emitter);
  const rx = new THREE.Mesh(new THREE.SphereGeometry(.06, 16, 16), X.glow(TH.brand)); rx.position.set(.49, BEAM, 0); gate.add(rx);
  const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 8), X.glow('#ffffff', { opacity: .95 }));
  const beamHalo = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 16), X.glow(TH.brand, { opacity: .45 }));
  [beamCore, beamHalo].forEach(b => { b.rotation.z = Math.PI / 2; scene.add(b); });
  const setBeam = (x1) => { const x0 = -.49, L = Math.max(.001, x1 - x0); [beamCore, beamHalo].forEach(b => { b.scale.y = L; b.position.set(x0 + L / 2, BEAM, 0); }); };
  // the ball + ghosts
  const ball = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), X.mat('#ffffff', { metalness: 1, roughness: .12 })); ball.castShadow = true; scene.add(ball);
  const ghostMat = X.mat(TH.brand, { transparent: true, opacity: .25, depthWrite: false });
  const ghosts = [0.10, 0.14].map(tau => { const m = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 24), ghostMat); m.position.set(0, YB0 - fall(tau) + R, 0); scene.add(m); return m; });
  // 5.0 cm bracket (bottom at 0.10 → bottom at 0.14)
  const yA = YB0 - fall(0.10), yB = YB0 - fall(0.14);
  const brk = new THREE.Group(); scene.add(brk);
  const bm = X.mat('#ffffff', { emissive: '#ffffff', emissiveIntensity: .6 });
  const seg = (h, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.02, h, .02), bm); m.position.set(.42, y, .1); brk.add(m); };
  seg(yA - yB, (yA + yB) / 2); [yA, yB].forEach(y => { const m = new THREE.Mesh(new THREE.BoxGeometry(.14, .02, .02), bm); m.position.set(.42, y, .1); brk.add(m); });

  // ---------- v–t graph on a floating panel (canvas texture) ----------
  const cv = document.createElement('canvas'); cv.width = 900; cv.height = 1300; const cx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  panel.position.set(3.4, 3.0, 0); panel.rotation.y = -.12; scene.add(panel);
  const GX = tau => 120 + tau / 0.17 * 700, GY = v => 1120 - v / 1.9 * 900;
  function drawGraph(t) {
    cx.clearRect(0, 0 , 900, 1300);
    cx.fillStyle = 'rgba(20,5,12,.82)'; cx.strokeStyle = TH.brand; cx.lineWidth = 6; cx.beginPath(); cx.roundRect(8, 8, 884, 1284, 40); cx.fill(); cx.stroke();
    cx.strokeStyle = '#fff'; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(120, 160); cx.lineTo(120, 1120); cx.lineTo(850, 1120); cx.stroke();
    cx.fillStyle = '#fff'; cx.font = 'italic 700 64px IBM Plex Sans'; cx.fillText('v', 60, 200); cx.font = '700 46px IBM Plex Sans'; cx.fillText('t / s', 760, 1268);
    const p = k('vt', 1.4, E.io);
    // shaded strip 0.10–0.14 under the line = the 5.0 cm moved
    if (p > .6) { cx.globalAlpha = clamp((p - .6) / .4) * .45; cx.fillStyle = TH.brand; cx.beginPath(); cx.moveTo(GX(.10), 1120); cx.lineTo(GX(.10), GY(g * .10)); cx.lineTo(GX(.14), GY(g * .14)); cx.lineTo(GX(.14), 1120); cx.fill(); cx.globalAlpha = 1; }
    cx.strokeStyle = TH.brand; cx.lineWidth = 12; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(GX(0), GY(0)); cx.lineTo(GX(.17 * p), GY(g * .17 * p)); cx.stroke();
    cx.fillStyle = '#fff'; cx.font = '700 40px IBM Plex Sans'; ['0.10', '0.14'].forEach((s, i) => { if (p > .6) cx.fillText(s, GX([.10, .14][i]) - 40, 1175); });
    const m = k('mid', .6);
    if (m > 0) {
      cx.globalAlpha = m; cx.setLineDash([16, 12]); cx.strokeStyle = '#fff'; cx.lineWidth = 6;
      cx.beginPath(); cx.moveTo(GX(.10), GY(1.25)); cx.lineTo(GX(.14), GY(1.25)); cx.stroke();
      cx.beginPath(); cx.moveTo(GX(.12), GY(1.25)); cx.lineTo(GX(.12), 1120); cx.stroke(); cx.setLineDash([]);
      cx.fillStyle = '#4ade80'; cx.beginPath(); cx.arc(GX(.12), GY(1.25), 18 + 8 * Math.sin(t * 8), 0, 7); cx.fill();
      cx.fillStyle = '#fff'; cx.font = '800 50px IBM Plex Sans'; cx.fillText('1.25 m/s', GX(.12) - 330, GY(1.25) - 10); cx.fillText('0.12 s', GX(.12) - 70, 1250);
      cx.globalAlpha = 1;
    }
    if (on('g')) { cx.globalAlpha = k('g', .5); cx.fillStyle = '#fff'; cx.font = '800 54px IBM Plex Sans'; cx.fillText('gradient = g', 170, 300); cx.globalAlpha = 1; }
    tex.needsUpdate = true;
  }

  // ---------- time: what τ (seconds of real fall) is on screen ----------
  function tauAt(t) {
    const D = tv('drop'), RW = tv('rw'), SM = tv('sm'), B1 = tv('b1'), B2 = tv('b2');
    if (t < D) return 0;
    if (t < RW) { // hook drop: normal-ish speed, slowing right at the beam (slow-mo), freeze at the end
      let tau = 0, s = D; const dt = 1 / 60;
      for (; s < t; s += dt) { const r = tau > .085 && tau < .155 ? .018 : .09; tau = Math.min(.17, tau + r * dt); }
      return tau;
    }
    if (t < SM) return .17 * (1 - E.io((t - RW) / Math.max(.3, SM - RW)));      // rewind to the top
    if (t < B1) return .10 * E.out((t - SM) / Math.max(.3, B1 - SM));          // to the beam
    if (t < B1 + .5) return .10;                                                   // freeze: 0.100 s
    if (t < B2) return .10 + .04 * clamp((t - B1 - .5) / Math.max(.2, B2 - B1 - .5)); // slow-mo through the beam
    return .14;                                                                    // freeze: 0.140 s
  }

  // ---------- overlays ----------
  X.live(t => `<span style="font-family:JetBrains Mono;font-size:70px">t = ${tauAt(t).toFixed(3)} s</span>`, 'drop', 'trap', { top: '400px' });
  X.label('⌀ 5.0 cm', () => ball.position.clone().add(new THREE.Vector3(-.55, 0, 0)), 'drop', 'blk', { size: 34 });
  X.label('light gate', new THREE.Vector3(.95, BEAM - .45, 0), 'blk', 'q');
  X.big('g = ?', 'q', 'pz', { y: 1050, size: 200, color: TH.brand });
  X.ring('pz+1.2', 2.0);
  X.badge('◀◀ REWIND', 'rw', 'sm', { bg: '#fff', fg: '#000' });
  X.badge('SLOW-MO', 'sm', 'dt', { bg: TH.brand, fg: '#fff' });
  X.badge('BLOCKED ■ 0.100 s', 'b1', 'b2', { bg: '#000', fg: TH.brand, y: 500 });
  X.badge('CLEAR ■ 0.140 s', 'b2', 'd', { bg: '#000', fg: '#fff', y: 500 });
  X.eq('\\Delta t = 0.14 - 0.10 = 0.04\\ \\text{s}', 'dt', 'd', { y: 1120, size: 66 });
  X.label('5.0 cm', new THREE.Vector3(.72, (yA + yB) / 2, .1), 'd', 'trap', { size: 34, bg: '#fff', fg: '#000' });
  X.eq('\\bar v = \\frac{0.050}{0.04} = 1.25\\ \\text{m s}^{-1}', 'v', 'trap', { y: 1120, size: 66 });
  X.big('careful!', 'trap', 'vt', { y: 820, size: 150, color: TH.brand, from: 'drop' });
  X.eq('g = \\frac{1.25}{0.12}', 'g', 'ans', { y: 250, size: 84 });
  X.big('10.4 m s<sup>−2</sup>', 'ans', 'w1', { y: 240, size: 130, color: '#4ade80' });
  X.big('÷ 0.14 → 8.93 ✗', 'w1', 'o', { y: 1010, size: 84, color: '#ff8fa3', from: 'left', box: true });
  X.big('÷ 0.10 → 12.5 ✗', 'w2', 'o', { y: 1130, size: 84, color: '#ff8fa3', from: 'right', box: true });
  X.big('only the middle works', 'w3', 'o', { y: 250, size: 70, color: '#4ade80', from: 'zoom', box: true });
  // sound
  ['drop', 'rw', 'sm', 'vt', 'w1', 'w2', 'o'].forEach(m => X.cue(m === 'rw' ? 'rewind' : 'whoosh', m));
  ['b1', 'b2', 'dt', 'd', 'v', 'mid', 'g'].forEach(m => X.cue('pop', m));
  X.cue('slam', 'q'); X.cue('slam', 'ans'); X.cue('ding', 'ans'); X.cue('buzz', 'w1'); X.cue('buzz', 'w2'); X.cue('riser', 'pz+1');

  // ---------- camera ----------
  X.cam([
    { t: 0, p: [2.4, 2.4, 5.6], l: [0, 3.2, 0], fov: 40 },
    { t: 'blk', p: [1.3, 3.0, 3.6], l: [0, 3.1, 0], fov: 38 },
    { t: 'q', p: [.2, 3.6, 6.4], l: [.1, 3.1, 0], fov: 40, shake: true },
    { t: 'sm', p: [1.0, 3.35, 2.9], l: [0, 3.05, 0], fov: 34 },
    { t: 'b2+0.4', p: [.8, 3.25, 2.9], l: [0, 3.0, 0], fov: 34 },
    { t: 'd', p: [1.9, 3.0, 3.7], l: [.25, 2.95, 0], fov: 38 },
    { t: 'trap', p: [1.4, 3.3, 5.0], l: [1.4, 3.0, 0], fov: 40 },
    { t: 'vt', p: [3.3, 3.0, 5.4], l: [3.3, 3.0, 0], fov: 38, ease: E.out },
    { t: 'g', p: [3.3, 3.1, 5.0], l: [3.3, 3.05, 0], fov: 38 },
    { t: 'ans', p: [3.2, 3.0, 5.3], l: [3.3, 3.0, 0], fov: 38, shake: true },
    { t: 'w1+0.9', p: [.6, 3.3, 4.6], l: [.2, 3.0, 0], fov: 40 },
    { t: 'o', p: [.4, 3.5, 5.2], l: [.2, 3.0, 0], fov: 40 },
  ]);

  return (t) => {
    const tau = tauAt(t);
    const yb = YB0 - fall(tau); ball.position.set(0, yb + R, 0);
    // beam is cut where the ball crosses it
    const dy = BEAM - (yb + R), blocked = Math.abs(dy) < R;
    setBeam(blocked ? -Math.sqrt(R * R - dy * dy) : .49);
    rx.material.opacity = blocked ? .15 : 1; ring.material.opacity = tau > 0 ? .25 : 1;
    ghosts.forEach(m => { m.visible = on('d') && !on('trap'); m.material.opacity = .28 * k('d', .4); });
    brk.visible = on('d') && !on('trap');
    panel.visible = on('trap'); panel.scale.setScalar(.6 + .4 * k('trap', .6, E.back));
    if (panel.visible) drawGraph(t);
  };
};
