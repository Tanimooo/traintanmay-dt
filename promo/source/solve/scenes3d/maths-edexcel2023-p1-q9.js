// Edexcel June 2023 P1 Q9 — geometric sequence 3k+4, 12−3k, k+16 that converges.
// (12−3k)² = (3k+4)(k+16) ⇒ 3k² − 62k + 40 = 0 ⇒ (k−20)(3k−2) = 0.
// k = 2/3 → 6, 10, 50/3 (r = 5/3, diverges); k = 20 → 64, −48, 36 (r = −3/4), S∞ = 64 / (7/4) = 256/7.
// Terms are towers (height ∝ value; negative terms hang below a glass floor). A running-total column zig-zags onto 256/7.
export default (X) => {
  const { THREE, scene, TH, E, k, on, win, tv, clamp } = X;
  const HS = .03;                                    // scene units per 1 of value
  const terms3 = kv => [3 * kv + 4, 12 - 3 * kv, kv + 16];
  // ---------- glass floor ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#0b2a17', transparent: true, opacity: .55, roughness: .2, metalness: .1, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(60, 60, TH.brand, TH.deep); grid.material.transparent = true; grid.material.opacity = .3; grid.position.y = .003; scene.add(grid);
  // ---------- towers ----------
  const N = 16;
  const pos = X.mat(TH.brand, { roughness: .35, emissive: TH.deep, emissiveIntensity: .25 }), neg = X.mat('#e7fbe9', { roughness: .35 }), red = X.mat('#ff6b6b', { roughness: .35, emissive: '#7f1d1d', emissiveIntensity: .3 });
  const towers = Array.from({ length: N }, () => { const m = new THREE.Mesh(new X.RoundedBoxGeometry(.7, 1, .7, 3, .06), pos); m.castShadow = true; scene.add(m); return m; });
  const setTower = (m, v, x, z, mat) => { const h = Math.max(.02, Math.abs(v) * HS); m.scale.set(1, h, 1); m.position.set(x, v >= 0 ? h / 2 : -h / 2, z); m.material = mat || (v >= 0 ? pos : neg); };
  // running total column + target ring at 256/7
  const sumCol = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, 1, 48), X.mat('#ffffff', { roughness: .2, metalness: .3, emissive: TH.brand, emissiveIntensity: .25 })); sumCol.castShadow = true; scene.add(sumCol);
  const SX = -1.9, target = 256 / 7 * HS;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.62, .045, 12, 64), X.glow(TH.brand)); ring.rotation.x = Math.PI / 2; ring.position.set(SX, target, 0); scene.add(ring);
  // ---------- which k is on screen ----------
  const kAt = t => {
    if (!on('sl')) return 10;
    if (t < tv('q')) return 10 + 12 * Math.sin((t - tv('sl')) * 1.6);   // sweep k back and forth
    if (t < tv('k23')) return 10 + 12 * Math.sin((tv('q') - tv('sl')) * 1.6) * (1 - k('q', .8));
    if (t < tv('k20')) return 2 / 3;
    return 20;
  };
  // positions: a row of three at the start, then a corridor running away from the camera
  const rowX = i => (i - 1) * 1.15, corZ = i => -i * 1.05;
  const corridor = t => on('k23') ? k('k23', .9, E.io) : 0;
  // the first three towers always show the three expressions; later towers continue with r = 2nd / 1st
  const seqVal = (kv, i) => { const tt = terms3(kv); if (i < 3) return tt[i]; return tt[0] * Math.pow(tt[1] / tt[0], i); };
  const shown = t => on('k20') ? Math.min(N, 3 + Math.floor((t - tv('k20') - .6) / .14)) : on('k23') ? Math.min(N, 3 + Math.floor((t - tv('k23') - .6) / .14)) : 3;
  const sumN = t => on('sum') ? Math.min(N, 1 + Math.floor((t - tv('sum')) / .32)) : 0;
  const S = n => 64 * (1 - Math.pow(-.75, n)) / 1.75;
  // ---------- overlays ----------
  const fmt = v => Math.abs(v - Math.round(v)) < .005 ? String(Math.round(v)) : Math.abs(v * 3 - Math.round(v * 3)) < .01 ? `${Math.floor(v)}⅔` : v.toFixed(1);
  ['3k + 4', '12 − 3k', 'k + 16'].forEach((ex, i) => {
    X.label(ex, () => new THREE.Vector3(rowX(i), Math.max(.1, terms3(kAt(X.now()))[i] * HS) + .35, 0), 't3', 'k23', { size: 34, bg: '#fff', fg: '#000' });
    X.label(t => fmt(seqVal(kAt(t), i)), () => { const tt = X.now(), c = corridor(tt), v = seqVal(kAt(tt), i); return new THREE.Vector3(rowX(i) * (1 - c), (v >= 0 ? v * HS + .35 : v * HS - .35), corZ(i) * c); }, 'k23', 'sum', { size: 34 });
  });
  X.live(t => `<span style="font-family:JetBrains Mono;font-size:68px">k = ${kAt(t).toFixed(1)}</span>`, 'sl', 'q+0.8', { top: '330px' });
  X.big('k = ?   S<sub>∞</sub> = ?', 'q', 'pz', { y: 330, size: 110, color: TH.brand, box: true });
  X.eq('(12-3k)^2 = (3k+4)(k+16)', 'sq', 'ex', { y: 340, size: 70 });
  X.eq('3k^2 - 62k + 40 = 0', 'ex', 'fa', { y: 340, size: 76 });
  X.eq('(k-20)(3k-2) = 0', 'fa', 'roots', { y: 340, size: 76 });
  X.big('k = 20  or  ⅔', 'roots', 'k23', { y: 360, size: 120, color: '#fff', box: true });
  X.big('k = ⅔ → r = 5/3', 'k23', 'k20', { y: 330, size: 84, color: '#fff', box: true });
  X.big('EXPLODES ✗', 'up', 'k20', { y: 1060, size: 120, color: '#ff8a8a', box: true });
  X.big('k = 20 → r = −¾', 'k20', 'sum', { y: 330, size: 84, color: '#fff', box: true });
  X.big('shrinks + flips ✓', 'fly', 'sum', { y: 1060, size: 90, color: TH.brand, box: true });
  X.label(t => `total: ${S(sumN(t)).toFixed(2)}`, () => new THREE.Vector3(SX, Math.max(.2, S(sumN(X.now())) * HS) + .45, 0), 'sum', 'trap', { size: 34, bg: '#fff', fg: '#000' });
  X.eq('S_\\infty = \\frac{a}{1-r} = \\frac{64}{1-(-\\frac{3}{4})}', 'lim', 'ans', { y: 330, size: 70 });
  X.big('S<sub>∞</sub> = 256⁄7', 'ans', 'o', { y: 320, size: 150, color: TH.brand, box: true });
  X.big('36.6 ✗  keep it exact', 'trap', 'o', { y: 1060, size: 84, color: '#ff8a8a', from: 'left', box: true });
  ['t3', 'q', 'k23', 'k20', 'sum', 'o'].forEach(m => X.cue('whoosh', m));
  ['sq', 'ex', 'fa', 'fly', 'lim'].forEach(m => X.cue('pop', m)); X.cue('slam', 'roots'); X.cue('slam', 'ans'); X.cue('ding', 'ans'); X.cue('buzz', 'up'); X.cue('buzz', 'trap'); X.cue('riser', 'up-0.8');
  for (let i = 1; i < 10; i++) X.cue('tick', `sum+${(i * .32).toFixed(2)}`);
  // ---------- camera ----------
  X.cam([
    { t: 0, p: [3.2, 2.6, 6.8], l: [0, .8, 0], fov: 40 },
    { t: 'q', p: [0, 2.6, 8.4], l: [0, .8, 0], fov: 40, shake: true },
    { t: 'r', p: [-3.4, 2.2, 7.0], l: [0, .7, 0], fov: 40 },
    { t: 'ex', p: [3.4, 2.0, 7.0], l: [0, .7, 0], fov: 40 },
    { t: 'roots', p: [0, 2.6, 8.2], l: [0, .8, 0], fov: 40, shake: true },
    { t: 'k23', p: [3.6, 2.8, 4.6], l: [0, 1.0, -4.5], fov: 42 },
    { t: 'up', p: [4.2, 1.2, 3.6], l: [0, 9, -10], fov: 56, dur: 1.6 },
    { t: 'k20', p: [3.8, 3.2, 4.8], l: [0, .1, -4.5], fov: 42 },
    { t: 'fly', p: [2.6, 1.6, -1.5], l: [0, 0, -10], fov: 46, dur: 2.2 },
    { t: 'sum', p: [-5.2, 2.6, 6.4], l: [-1.9, .9, -1], fov: 40 },
    { t: 'ans', p: [-4.4, 2.3, 5.6], l: [-1.9, 1.0, -.5], fov: 40, shake: true },
    { t: 'o', p: [-2.6, 3.0, 8.0], l: [-1, .8, -1.5], fov: 40 },
  ]);
  return (t) => {
    const kv = kAt(t), c = corridor(t), n = shown(t), red23 = on('k23') && !on('k20');
    towers.forEach((m, i) => {
      const vis = (i < 3 && on('t3')) || (i < n && on('k23'));
      m.visible = vis; if (!vis) return;
      const v = seqVal(kv, i), x = i < 3 ? rowX(i) * (1 - c) : 0, z = i < 3 ? corZ(i) * c : corZ(i);
      const grow = i < 3 ? k('t3+' + (i * .2), .5, E.back) : clamp((t - (on('k20') ? tv('k20') : tv('k23')) - .6 - (i - 3) * .14) / .3);
      setTower(m, v * grow, x, z, red23 && on('up') ? red : null);
    });
    const sn = sumN(t), prev = sn > 1 ? S(sn - 1) : 0, cur = S(sn), u = on('sum') ? E.out(((t - tv('sum')) % .32) / .25) : 0;
    const sv = sn ? prev + (cur - prev) * (sn >= N ? 1 : u) : 0;
    sumCol.visible = on('sum'); ring.visible = on('sum');
    sumCol.scale.set(1, Math.max(.01, sv * HS), 1); sumCol.position.set(SX, sv * HS / 2, 0);
    ring.material.opacity = .5 + .5 * Math.sin(t * 6);
  };
};
