// Edexcel 9DT0 2019 Q3(b)/(c): flexography — the four-roller unit, built roller by roller, then flexo vs gravure.
// Rollers turn about z; neighbours counter-rotate; every surface moves at the board's speed s'(t).
// The plate prints on the UNDERSIDE of the board (impression cylinder above presses board down onto the plate).
export default (X) => {
  const { THREE, scene, TH, E, k, on, win, tv, clamp } = X;
  const INK = '#2f7dff', LEN = 2.2;
  const steel = X.mat('#c9d2de', { metalness: .9, roughness: .25 }), rubber = X.mat('#2a2f38', { roughness: .8 });
  const amber = X.mat('#e8b04a', { roughness: .4, side: THREE.DoubleSide }), inkM = X.mat(INK, { roughness: .2, metalness: .1, transparent: true, opacity: .9 });
  // ---------- layout (y up; contact distances add up) ----------
  const F = { c: [0, .62], r: .45 }, A = { c: [.45, 1.33], r: .38 };
  const PR = .55, PS = .58, PF = .63;                                   // plate core, photopolymer sleeve, raised image
  const P = { c: [0, A.c[1] + Math.sqrt((A.r + PF) ** 2 - .45 ** 2)] };  // raised image touches the anilox
  const WEB0 = P.c[1] + PF, WEBT = .05, IR = .5, I = { c: [0, WEB0 + WEBT + IR] };
  // ---------- floor ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), X.mat('#07101e', { roughness: .95 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.25; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(80, 160, TH.brand, TH.deep); grid.material.transparent = true; grid.material.opacity = .15; grid.position.y = -.248; scene.add(grid);
  // ---------- parts ----------
  const part = (obj, at) => { scene.add(obj); obj.userData.at = at; obj.userData.home = obj.position.clone(); obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return obj; };
  const capM = X.mat('#9aa6b5', { metalness: .7, roughness: .35 });
  // closed rollers get plain end caps; ink films and the plate sleeve are open tubes (no caps to fight over)
  const cyl = (r, m, open = false) => { const g = new THREE.Mesh(new THREE.CylinderGeometry(r, r, LEN, 64, 1, open), open ? m : [m, capM, capM]); g.rotation.x = Math.PI / 2; return g; };
  // ink pan
  const pan = new THREE.Group(); pan.position.set(0, .05, 0);
  const panM = X.mat('#3b4656', { metalness: .6, roughness: .4 });
  [[1.5, .06, LEN + .3, 0, -.18, 0], [.06, .5, LEN + .3, -.75, .05, 0], [.06, .5, LEN + .3, .75, .05, 0], [1.5, .5, .06, 0, .05, -(LEN + .3) / 2], [1.5, .5, .06, 0, .05, (LEN + .3) / 2]].forEach(([w, h, d, x, y, z]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), panM); m.position.set(x, y, z); pan.add(m); });
  const inkPool = new THREE.Mesh(new THREE.BoxGeometry(1.44, .02, LEN + .24), X.mat(INK, { roughness: .1 })); inkPool.position.set(0, .22, 0); pan.add(inkPool);
  part(pan, 'pan');
  // 1 fountain roller (rubber) + ink film
  const fr = new THREE.Group(); fr.position.set(...F.c, 0); fr.add(cyl(F.r, rubber)); const frInk = cyl(F.r + .012, inkM.clone(), true); fr.add(frInk); part(fr, 'fr');
  // 2 anilox roller: engraved cells (canvas texture)
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 256; const g2 = cv.getContext('2d');
  g2.fillStyle = '#b8c3d1'; g2.fillRect(0, 0, 1024, 256);
  for (let y = 0; y < 256; y += 14) for (let x = (y / 14) % 2 * 8; x < 1024; x += 16) { g2.fillStyle = '#5d6b7d'; g2.beginPath(); g2.arc(x, y, 5.5, 0, 7); g2.fill(); }
  const cellTex = new THREE.CanvasTexture(cv); cellTex.wrapS = cellTex.wrapT = THREE.RepeatWrapping; cellTex.repeat.set(3, 3); cellTex.colorSpace = THREE.SRGBColorSpace;
  const an = new THREE.Group(); an.position.set(...A.c, 0); an.add(cyl(A.r, X.mat('#ffffff', { map: cellTex, metalness: .85, roughness: .3 })));
  const anInk = cyl(A.r + .02, inkM.clone(), true); an.add(anInk); part(an, 'an');
  // doctor blade, touching the anilox on its right, angled down-right
  const blade = new THREE.Group(); const ang = -.35, cpt = [A.c[0] + A.r * Math.cos(ang), A.c[1] + A.r * Math.sin(ang)];
  const bl = new THREE.Mesh(new THREE.BoxGeometry(.7, .025, LEN + .1), X.mat('#e5e9ef', { metalness: .95, roughness: .2 })); bl.position.set(.35, 0, 0); blade.add(bl);
  blade.position.set(cpt[0], cpt[1], 0); blade.rotation.z = -.5; part(blade, 'db');
  const drips = Array.from({ length: 10 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 12), X.mat(INK)); scene.add(m); return m; });
  // 3 plate cylinder with photopolymer sleeve and raised image
  const pc = new THREE.Group(); pc.position.set(...P.c, 0); pc.add(cyl(PR, steel)); part(pc, 'pc');
  const sleeve = cyl(PS, amber, true); pc.add(sleeve); sleeve.visible = false;
  const FEAT = [[0, -.55], [0, .55], [.9, 0], [1.9, -.55], [1.9, .55], [2.9, 0], [3.9, -.3], [3.9, .3], [4.9, 0], [5.6, -.55], [5.6, .55]];   // (angle from top, z)
  const featM = amber.clone(), featInk = X.mat(INK, { roughness: .25 });
  const feats = FEAT.map(([a, z]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.3, PF - PS + .02, .42), featM); m.position.set(-Math.sin(a) * (PS + PF) / 2, Math.cos(a) * (PS + PF) / 2, z); m.rotation.z = a; m.castShadow = true; pc.add(m); return m; });
  // 4 impression cylinder
  const ic = new THREE.Group(); ic.position.set(...I.c, 0); ic.add(cyl(IR, steel)); part(ic, 'ic');
  // the board (web), moving +x
  const boardM = X.mat('#c9a27a', { roughness: .85 });
  const web = new THREE.Mesh(new THREE.BoxGeometry(10, WEBT, 1.9), boardM); web.position.set(2, WEB0 + WEBT / 2, 0); part(web, 'ic');
  const marks = Array.from({ length: 80 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.3, .006, .42), X.mat(INK, { roughness: .3 })); m.visible = false; scene.add(m); return m; });

  // ---------- gravure vs flexo, and the corrugated board, off to the left ----------
  const GX = -7;
  // gravure cylinder shown side-on (axis along x) so its engraved copper surface faces the camera
  const copper = X.mat('#c87533', { metalness: .9, roughness: .3 });
  const grav = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, 1.5, 64), [copper, X.mat('#b06a2e', { metalness: .9, roughness: .3 }), X.mat('#b06a2e', { metalness: .9, roughness: .3 })]);
  grav.rotation.z = Math.PI / 2; grav.position.set(GX, 2.7, 0); part(grav, 'a1');
  const gcv = document.createElement('canvas'); gcv.width = 512; gcv.height = 256; const gg = gcv.getContext('2d'); gg.fillStyle = '#d8894a'; gg.fillRect(0, 0, 512, 256);
  for (let y = 10; y < 256; y += 12) for (let x = 10; x < 512; x += 12) { gg.fillStyle = 'rgba(60,25,5,.85)'; gg.fillRect(x, y, 7, 7); }
  const gtex = new THREE.CanvasTexture(gcv); gtex.wrapS = gtex.wrapT = THREE.RepeatWrapping; gtex.repeat.set(2, 2); gtex.colorSpace = THREE.SRGBColorSpace;
  copper.map = gtex; copper.needsUpdate = true;
  const flat = new THREE.Group(); flat.position.set(GX, 1.35, 0); part(flat, 'a1b');
  flat.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, .04, 1.3), amber));
  [[-.4, -.3], [-.4, .3], [0, 0], [.4, -.3], [.4, .3]].forEach(([x, z]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.3, .06, .4), amber); m.position.set(x, .05, z); flat.add(m); });
  // corrugated board cross-section (liners + fluted middle) and a soft plate pressing on it
  const corr = new THREE.Group(); corr.position.set(GX, .05, 0); part(corr, 'a3');
  const kraft = X.mat('#c9a27a', { roughness: .9 });
  const pts = []; for (let i = 0; i <= 64; i++) { const x = -.8 + 1.6 * i / 64; pts.push(new THREE.Vector3(x, .12 + .08 * Math.sin(i / 64 * Math.PI * 12), 0)); }
  const flute = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, .012, 6), kraft); corr.add(flute);
  // flute ribbon along z
  for (let zz = -.5; zz <= .5; zz += .1) { const f2 = flute.clone(); f2.position.z = zz; corr.add(f2); }
  const liner1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, .02, 1.1), kraft); liner1.position.y = .03; corr.add(liner1);
  const liner2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, .02, 1.1), kraft); liner2.position.y = .21; corr.add(liner2);
  const soft = new THREE.Mesh(new X.RoundedBoxGeometry(1.2, .14, .9, 3, .03), amber.clone()); soft.position.set(GX, .7, 0); part(soft, 'a3');

  // ---------- time: how far the board has moved ----------
  const speed = t => t < tv('pan') ? 1.6 : t < tv('sm') ? .28 : t < tv('pr') + .6 ? .035 : t < tv('vs') ? 1.3 : .25;
  const TAB = []; { let s = 0; for (let t = 0; t <= 200; t += 1 / 60) { TAB.push(s); s += speed(t) / 60; } }
  const sAt = t => { const i = Math.max(0, Math.min(TAB.length - 2, Math.floor(t * 60))), u = t * 60 - i; return TAB[i] + (TAB[i + 1] - TAB[i]) * u; };
  const tAtS = s => { let lo = 0, hi = TAB.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (TAB[m] < s) lo = m; else hi = m; } return lo / 60; };
  // in the hook everything is already running; from 'pan' the machine is built up part by part
  const built = (at, t) => t < tv('pan') ? 1 : at === undefined ? 0 : E.back((t - tv(at)) / .6);
  const inkOn = (at, t) => t < tv('pan') || (at !== undefined && t >= tv(at));

  // ---------- overlays ----------
  X.big('How?', 'hook', 'q', { y: 300, size: 170, color: TH.brand, from: 'drop' });
  X.big('FLEXOGRAPHY', 'q', 'pan', { y: 300, size: 118, color: '#fff', from: 'zoom', box: true });
  const lab = (txt, at, tA, tB, o = {}) => X.label(txt, at, tA, tB, { size: 34, ...o });
  lab('ink pan', new THREE.Vector3(0, .05, 1.45), 'pan', 'an');
  lab('① fountain roller', new THREE.Vector3(0, .62, 1.3), 'fr', 'pc');
  lab('② anilox roller', new THREE.Vector3(.45, 1.33, 1.3), 'an', 'pc');
  lab('doctor blade', new THREE.Vector3(1.05, .95, 1.3), 'db', 'cells', { bg: '#fff', fg: '#000' });
  X.badge('tiny cells = exact amount of ink', 'cells', 'pc', { bg: TH.brand, fg: '#fff', y: 420 });
  lab('③ plate cylinder', new THREE.Vector3(0, P.c[1], 1.3), 'pc', 'sm');
  lab('raised image', () => new THREE.Vector3(.15, P.c[1] + .75, 1.0), 'plate', 'ic', { bg: '#e8b04a', fg: '#000' });
  lab('④ impression cylinder', new THREE.Vector3(0, I.c[1], 1.3), 'ic', 'sm');
  lab('board', new THREE.Vector3(1.9, WEB0 + .2, 1.0), 'ic', 'sm', { bg: '#c9a27a', fg: '#000' });
  X.badge('SLOW-MO', 'sm', 'run', { bg: TH.brand, fg: '#fff', y: 300 });
  X.label('pressure → ink transfers', new THREE.Vector3(0, WEB0 - .35, 1.0), 'pr', 'run', { size: 32, bg: '#fff', fg: '#000' });
  X.big('PRINTED ✓', 'run', 'vs', { y: 300, size: 120, color: '#fff', box: true });
  X.big('FLEXO vs GRAVURE', 'vs', 'a1', { y: 300, size: 92, color: '#fff', box: true });
  lab('gravure: engraved copper', new THREE.Vector3(GX, 3.35, .6), 'a1', 'a2', { bg: '#c87533' });
  lab('££ · slow to make', new THREE.Vector3(GX, 2.05, .6), 'a1+1.4', 'a2', { bg: '#000', fg: '#ff9b6b' });
  lab('flexo: photopolymer', new THREE.Vector3(GX, 1.75, .6), 'a1b', 'a2', { bg: '#e8b04a', fg: '#000' });
  lab('cheaper · quicker set-up ✓', new THREE.Vector3(GX, .95, .6), 'a1b+1.2', 'a2', { bg: TH.brand });
  X.big('short runs ✓<br>quick changes ✓', 'a2', 'a3', { y: 1020, size: 84, color: '#fff', box: true });
  lab('soft plate', () => soft.position.clone().add(new THREE.Vector3(0, .25, .4)), 'a3', 'tip', { bg: '#e8b04a', fg: '#000' });
  lab('corrugated board', new THREE.Vector3(GX + .3, -.1, .6), 'a3', 'tip', { bg: '#c9a27a', fg: '#000' });
  X.big('<span style="white-space:nowrap">① → ② → ③ → ④</span>', 'tip', 'o', { y: 300, size: 92, color: '#fff', box: true });
  X.big('sketch · label · explain', 'tip+1.2', 'o', { y: 1060, size: 66, color: TH.brand, box: true });
  ['q', 'pan', 'fr', 'an', 'pc', 'ic', 'vs', 'a3', 'tip', 'o'].forEach(m => X.cue('whoosh', m));
  ['db', 'cells', 'plate', 'ink', 'pr', 'a1', 'a1b', 'a2'].forEach(m => X.cue('pop', m));
  X.cue('slam', 'hook'); X.cue('slam', 'q'); X.cue('ding', 'run'); X.cue('riser', 'sm');

  // ---------- camera ----------
  X.cam([
    { t: 0, p: [3.2, 2.1, 4.2], l: [1.4, 2.8, 0], fov: 40 },
    { t: 'q', p: [.4, 2.1, 9.2], l: [.1, 1.9, 0], fov: 40, ease: E.out },
    { t: 'pan', p: [2.0, 1.3, 5.2], l: [0, .5, 0], fov: 38 },
    { t: 'fr', p: [2.2, 1.5, 5.4], l: [.1, .8, 0], fov: 38 },
    { t: 'an', p: [2.6, 2.0, 5.4], l: [.3, 1.1, 0], fov: 38 },
    { t: 'db', p: [3.4, 1.6, 4.4], l: [.8, 1.1, 0], fov: 38 },
    { t: 'cells', p: [1.55, 1.45, 1.5], l: [.83, 1.3, .55], fov: 30 },
    { t: 'pc', p: [2.4, 2.6, 6.0], l: [.1, 2.0, 0], fov: 38 },
    { t: 'plate', p: [1.7, 2.8, 4.4], l: [0, 2.3, 0], fov: 36 },
    { t: 'ic', p: [2.6, 3.2, 6.8], l: [.2, 2.4, 0], fov: 38 },
    { t: 'sm', p: [1.0, WEB0 - .45, 3.3], l: [.35, WEB0, 0], fov: 32 },
    { t: 'run', p: [3.6, 1.9, 4.6], l: [1.8, WEB0, 0], fov: 40, ease: E.out },
    { t: 'vs', p: [GX, 2.1, 6.6], l: [GX, 2.0, 0], fov: 40 },
    { t: 'a2', p: [GX + .3, 2.0, 7.0], l: [GX, 1.9, 0], fov: 40 },
    { t: 'a3', p: [GX + 1.2, 1.2, 3.8], l: [GX, .35, 0], fov: 38 },
    { t: 'tip', p: [.4, 2.1, 9.4], l: [.1, 1.9, 0], fov: 40 },
    { t: 'o', p: [.4, 2.3, 9.8], l: [.1, 1.9, 0], fov: 40 },
  ]);

  return (t) => {
    const s = sAt(t);
    // fly each part in from the right as it is introduced
    scene.children.forEach(o => { const at = o.userData.at; if (!at) return;
      const pre = ['a1', 'a1b', 'a3'].includes(at);   // the comparison props only exist after they're introduced
      const b = pre ? (on(at) ? E.back((t - tv(at)) / .6) : 0) : built(at, t);
      o.visible = b > 0.001; o.scale.setScalar(Math.max(.001, b)); o.position.x = o.userData.home.x + (1 - clamp(b)) * 3; });
    fr.rotation.z = -s / F.r; an.rotation.z = s / A.r; pc.rotation.z = -s / PF; ic.rotation.z = s / IR;
    frInk.visible = inkOn('fr', t); anInk.visible = inkOn('an', t);
    anInk.scale.set(1, 1, 1); const metered = t < tv('pan') || on('db'); anInk.material.opacity = metered ? .55 : .95;
    anInk.scale.setScalar(metered ? .985 : 1.03); anInk.rotation.x = Math.PI / 2;
    sleeve.visible = t < tv('pan') || on('plate');
    feats.forEach(m => { m.visible = t < tv('pan') || on('plate'); m.material = inkOn('ink', t) ? featInk : featM; });
    // excess ink dripping off the doctor blade
    drips.forEach((d, i) => { const t0 = tv('db') + .3 + i * .22, u = t - t0; d.visible = on('db') && u > 0 && u < 1.1 && t < tv('pc');
      if (d.visible) d.position.set(cpt[0] + .62 * Math.cos(-.5), cpt[1] + .62 * Math.sin(-.5) - 4.9 * u * u * .35, (i % 5 - 2) * .4); });
    // prints on the underside of the board: a raised feature at angle a reaches the board (top of the plate cylinder)
    // when s = PF·(a + 2πn); from then on it travels with the board
    let mi = 0; const printing = tt => tt < tv('pan') || tt >= tv('pr');
    for (const [a, z] of FEAT) for (let n = 0; n < 40 && mi < marks.length; n++) {
      const sc = PF * (a + 2 * Math.PI * n); if (sc > s) break; const x = s - sc; if (x > 6.5) continue;
      if (!printing(tAtS(sc))) continue;
      const m = marks[mi++]; m.visible = true; m.position.set(x, WEB0 - .004, z); }
    for (; mi < marks.length; mi++) marks[mi].visible = false;
    // soft plate pressing onto the corrugated board
    grav.rotation.x = t * .8;   // keep it turning
    if (on('a3')) { const pz = .5 + .5 * Math.sin((t - tv('a3')) * 2.2 - Math.PI / 2); soft.position.y = .55 - .2 * pz; soft.scale.y = 1 - .35 * pz; }
  };
};
