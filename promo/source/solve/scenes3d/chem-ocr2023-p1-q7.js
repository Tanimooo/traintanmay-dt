// OCR A June 2023 P1 Q7 — first-order half-life, as two flasks in a time-lapse.
// Each molecule's reaction time is an exact first-order quantile: τ_i = −(16/ln2)·ln(1 − (i+½)/N), so the number left
// at m minutes is N·2^(−m/16) (rounded), and both flasks halve at 16 and 32 min. The right flask has twice the
// molecules, so it reacts twice as fast (twice the sparks per minute) yet halves in the same time.
export default (X) => {
  const { THREE, scene, TH, E, k, on, win, tv, clamp } = X;
  const HL = 16, kk = Math.LN2 / HL;
  // ---------- floor ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), X.mat('#160a03', { roughness: .95 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(80, 160, TH.brand, TH.deep); grid.material.transparent = true; grid.material.opacity = .14; grid.position.y = .002; scene.add(grid);
  // ---------- conical flasks (lathe) ----------
  const prof = [[0, 0], [.62, 0], [.66, .04], [.66, .08], [.24, 1.15], [.2, 1.25], [.2, 1.7], [.24, 1.74]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: .05, metalness: 0, transparent: true, opacity: .22, side: THREE.DoubleSide, clearcoat: 1 });
  const liqProf = [[0, .03], [.61, .03], [.62, .08], [.38, .72], [0, .72]].map(([x, y]) => new THREE.Vector2(x, y));
  const flask = (x) => {
    const g = new THREE.Group(); g.position.set(x, 0, 0); scene.add(g);
    g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 64), glass));
    const liq = new THREE.Mesh(new THREE.LatheGeometry(liqProf, 64), new THREE.MeshStandardMaterial({ color: TH.deep, transparent: true, opacity: .32, roughness: .2, depthWrite: false })); g.add(liq);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.62, .015, 8, 64), X.glow(TH.brand, { opacity: .8 })); ring.rotation.x = Math.PI / 2; ring.position.y = .02; g.add(ring);
    return g;
  };
  const L = flask(-.85), R = flask(.85);
  // ---------- molecules ----------
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const molGeo = new THREE.SphereGeometry(.045, 16, 12), molMat = X.mat(TH.brand, { emissive: TH.deep, emissiveIntensity: .35, roughness: .35 });
  const sparkGeo = new THREE.SphereGeometry(.09, 12, 8);
  const fill = (g, N) => {
    const ms = [];
    // lifetimes: exact quantiles, shuffled so the reacting molecules are scattered through the flask
    const life = Array.from({ length: N }, (_, i) => -Math.log(1 - (i + .5) / N) / kk); for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [life[i], life[j]] = [life[j], life[i]]; }
    for (let i = 0; i < N; i++) {
      const y = .1 + rnd() * .55, rmax = .58 - (y - .08) * .36, a = rnd() * 6.283, r = Math.sqrt(rnd()) * rmax * .9;
      const m = new THREE.Mesh(molGeo, molMat); const sp = new THREE.Mesh(sparkGeo, X.glow('#fff3b0', { opacity: 0 }));
      m.userData = { p: new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), ph: rnd() * 6.28, life: life[i] };
      g.add(m); g.add(sp); ms.push([m, sp]);
    }
    return ms;
  };
  const molL = fill(L, 40), molR = fill(R, 80);
  // ---------- time-lapse clock: minutes of reaction shown at video time t ----------
  const minAt = t => {
    if (!on('tl')) return 0;
    const a = tv('tl'), b = tv('m16'), c = tv('m32');
    if (t < b) return 15.2 * clamp((t - a) / (b - a));                     // time-lapse to just before 16
    if (t < b + .6) return 15.2 + .8 * clamp((t - b) / .6);                 // land on 16
    if (t < c) return 16;                                                   // freeze: compare
    if (t < c + 1.4) return 16 + 16 * E.io((t - c) / 1.4);                  // fast forward to 32
    if (t < tv('ans')) return 32;
    return 32 + 16 * E.io((t - tv('ans')) / 3);                            // and on to 48
  };
  const TAB = []; for (let t = 0; t <= 120; t += 1 / 60) TAB.push(minAt(t));
  const tWhen = m => { for (let i = 0; i < TAB.length; i++) if (TAB[i] >= m) return i / 60; return 1e9; };
  [molL, molR].forEach(ms => ms.forEach(([m]) => { m.userData.tr = m.userData.life < 48.5 ? tWhen(m.userData.life) : 1e9; }));
  const left = (ms, mins) => ms.filter(([m]) => m.userData.life > mins).length;

  // ---------- graph panel (canvas texture) ----------
  const cv = document.createElement('canvas'); cv.width = 1100; cv.height = 900; const cx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.45), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); panel.position.set(0, 3.3, -.6); scene.add(panel);
  const GX = m => 130 + m / 64 * 900, GY = c => 760 - c / 2.1 * 640;
  const curve = (c0, sh = 0, col, w, dash) => { cx.strokeStyle = col; cx.lineWidth = w; cx.setLineDash(dash || []); cx.beginPath();
    for (let m = 0; m <= 64 - sh; m += .5) { const x = GX(m + sh), y = GY(c0 * Math.exp(-kk * m)); m ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke(); cx.setLineDash([]); };
  function drawGraph(t) {
    cx.clearRect(0, 0, 1100, 900);
    cx.fillStyle = 'rgba(25,10,3,.85)'; cx.strokeStyle = TH.brand; cx.lineWidth = 6; cx.beginPath(); cx.roundRect(6, 6, 1088, 888, 36); cx.fill(); cx.stroke();
    cx.strokeStyle = '#fff'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(130, 90); cx.lineTo(130, 760); cx.lineTo(1050, 760); cx.stroke();
    cx.fillStyle = '#fff'; cx.font = '700 40px IBM Plex Sans'; cx.fillText('[X]', 40, 110); cx.fillText('time / min', 820, 840);
    [16, 32, 48].forEach(m => { cx.fillText(String(m), GX(m) - 20, 805); cx.strokeStyle = 'rgba(255,255,255,.15)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(GX(m), 90); cx.lineTo(GX(m), 760); cx.stroke(); });
    [['2.0', 2], ['1.0', 1], ['0.5', .5]].forEach(([s, c]) => cx.fillText(s, 50, GY(c) + 12));
    const p = k('graph', 1.2, E.io);
    cx.save(); cx.beginPath(); cx.rect(0, 0, GX(64 * p) + 4, 900); cx.clip();
    curve(1, 0, '#ffffff', 9); curve(2, 0, TH.brand, 11); cx.restore();
    if (on('shift')) { const u = E.io((t - tv('shift')) / 1.6); curve(1, 16 * u, '#fff3b0', 8, [22, 16]);
      if (u >= 1) { cx.fillStyle = '#fff3b0'; cx.font = '800 48px IBM Plex Sans'; cx.fillText('same curve →', GX(20), GY(1.25)); } }
    tex.needsUpdate = true;
  }
  // ---------- overlays ----------
  const top = (g) => () => g.position.clone().add(new THREE.Vector3(0, 2.05, 0));
  X.label(t => `<b style="font-size:44px">${left(molL, minAt(t))}</b> left`, top(L), 'f1', 'graph', { size: 30, bg: '#fff', fg: '#000' });
  X.label(t => `<b style="font-size:44px">${left(molR, minAt(t))}</b> left`, top(R), 'f2', 'graph', { size: 30, bg: '#fff', fg: '#000' });
  X.label('1.0 mol dm⁻³', new THREE.Vector3(-.85, -.18, .7), 'f1', 'graph', { size: 28, bg: TH.deep });
  X.label('2.0 mol dm⁻³', new THREE.Vector3(.85, -.18, .7), 'f2', 'graph', { size: 28, bg: TH.brand });
  X.label('t½ = 16 min', new THREE.Vector3(-.85, 2.6, 0), 'q', 'pz', { size: 30, bg: TH.deep });
  X.label('t½ = ?', new THREE.Vector3(.85, 2.6, 0), 'q', 'pz', { size: 44, bg: TH.brand });
  X.badge('⏩ TIME-LAPSE', 'tl', 'graph', { bg: TH.brand, fg: '#fff', y: 250 });
  X.live(t => `<span style="font-family:JetBrains Mono;font-size:76px">${minAt(t).toFixed(0).padStart(2, '0')} min</span>`, 'tl', 'graph', { top: '340px' });
  X.label('rate ×2 ⚡', new THREE.Vector3(.85, 1.55, .5), 'fast', 'm16', { size: 32, bg: TH.brand });
  X.big('½', 'h1', 'm32', { y: 1080, size: 150, color: '#fff' }).style.left = '-270px';
  X.big('½', 'h2', 'm32', { y: 1080, size: 150, color: TH.brand }).style.left = '270px';
  X.big('t½ = 16 min', 'ans', 'trap', { y: 1010, size: 130, color: '#fff', box: true });
  X.big('doesn’t depend on [X]', 'rule', 'trap', { y: 1170, size: 60, color: TH.brand, box: true });
  X.big('8 min? ✗', 'trap', 'o', { y: 300, size: 140, color: '#ffb4a2', from: 'left', box: true });
  X.big('faster rate… but 2× as much to react', 'trap+1', 'o', { y: 1060, size: 52, color: '#fff', box: true });
  ['f1', 'f2', 'tl', 'graph', 'trap', 'o'].forEach(m => X.cue('whoosh', m));
  ['h1', 'h2', 'm32', 'shift'].forEach(m => X.cue('pop', m)); X.cue('slam', 'q'); X.cue('ding', 'ans'); X.cue('buzz', 'trap'); X.cue('riser', 'pz+1');
  // a tick for every 4 reactions on screen would be noise; tick on the clock instead
  for (let m = 4; m <= 32; m += 4) X.cue('tick', tWhen(m));
  // ---------- camera ----------
  X.cam([
    { t: 0, p: [-1.6, 1.4, 2.6], l: [-.85, .5, 0], fov: 40 },
    { t: 'f2', p: [1.4, 1.5, 3.0], l: [.85, .6, 0], fov: 40 },
    { t: 'q', p: [0, 1.9, 6.4], l: [0, 1.0, 0], fov: 40, shake: true },
    { t: 'tl', p: [0, 1.3, 5.0], l: [0, .75, 0], fov: 40 },
    { t: 'fast', p: [1.0, 1.2, 3.4], l: [.6, .5, 0], fov: 40 },
    { t: 'm16', p: [0, 1.4, 5.0], l: [0, .8, 0], fov: 40 },
    { t: 'graph', p: [0, 3.2, 6.6], l: [0, 3.0, -.6], fov: 40, ease: E.out },
    { t: 'ans', p: [0, 3.0, 7.4], l: [0, 2.6, -.3], fov: 40 },
    { t: 'trap', p: [.6, 1.6, 5.6], l: [.3, 1.0, 0], fov: 40 },
    { t: 'o', p: [0, 2.0, 7.4], l: [0, 1.6, 0], fov: 40 },
  ]);
  return (t) => {
    [[molL, L], [molR, R]].forEach(([ms, g], gi) => {
      const vis = gi === 0 ? on('f1') : on('f2'); g.visible = vis; g.scale.setScalar(Math.max(.001, k(gi === 0 ? 'f1' : 'f2', .5, E.back)));
      ms.forEach(([m, sp], i) => {
        const u = m.userData, gone = t >= u.tr;
        m.visible = !gone; if (!gone) m.position.copy(u.p).add(new THREE.Vector3(Math.sin(t * 2.1 + u.ph) * .03, Math.sin(t * 2.7 + u.ph * 2) * .025, Math.cos(t * 1.9 + u.ph) * .03));
        const d = t - u.tr; sp.visible = d >= 0 && d < .45; if (sp.visible) { sp.position.copy(u.p); sp.scale.setScalar(.5 + 2.2 * d); sp.material.opacity = 1 - d / .45; }
      });
    });
    panel.visible = on('graph') && !on('trap'); panel.scale.setScalar(.5 + .5 * k('graph', .6, E.back)); if (panel.visible) drawGraph(t);
  };
};
