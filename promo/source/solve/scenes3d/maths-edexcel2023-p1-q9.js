// Edexcel June 2023 P1 Q9 — 2D, everything moves (green).
// (12−3k)² = 144 − 72k + 9k²;  (3k+4)(k+16) = 3k² + 52k + 64;  ⇒ 6k² − 124k + 80 = 0 ⇒ 3k² − 62k + 40 = 0
// ⇒ (3k − 2)(k − 20) = 0.  k = 2/3 → 6, 10, 50/3 (r = 5/3, diverges);  k = 20 → 64, −48, 36 (r = −3/4).
// S∞ = 64 / (1 − (−3/4)) = 64 / (7/4) = 256/7.  Running totals 64, 16, 52, 25, 45.25, … → 36.571…
// Tokens are pieces of maths that fly between layouts ("magic move"): keys = [time, {x, y, s, a, c, text, box}].
export default (X) => {
  const { TH, E, on, tv, clamp } = X;
  const ctx = X.canvas(), G = TH.brand, RED = '#ff6b6b', W = '#ffffff';
  const lerp = (a, b, u) => a + (b - a) * u;
  const FONT = s => `700 ${s}px 'IBM Plex Sans'`;
  const meas = (s, size) => { ctx.font = FONT(size); return ctx.measureText(s).width; };
  // lay a row of strings out centred on cx, returns centre x of each
  const row = (strs, size, cx = 540, gap = .3) => { const ws = strs.map(s => meas(s, size)), g = size * gap, tot = ws.reduce((a, b) => a + b, 0) + g * (ws.length - 1);
    let x = cx - tot / 2; return ws.map(w => { const c = x + w / 2; x += w + g; return c; }); };

  // ---------- token engine ----------
  const T = {};   // id → keys
  const tok = (id, keys) => { T[id] = keys; };
  function state(keys, now) {
    let cur = null, prev = null;
    for (const [t, st] of keys) { const tt = tv(t); if (tt === undefined || tt > now) break; prev = cur ? cur.st : prev; cur = { t: tt, st: { ...(cur ? cur.st : {}), ...st }, from: cur ? cur.st : null, dur: st.dur ?? .7 }; }
    if (!cur) return null;
    if (!cur.from || cur.dur === 0) return cur.st;
    const u = E.io(clamp((now - cur.t) / cur.dur)), f = cur.from, s = cur.st;
    const o = {}; for (const kk of ['x', 'y', 's', 'a']) o[kk] = lerp(f[kk] ?? s[kk], s[kk] ?? f[kk], u);
    o.y -= Math.sin(Math.PI * u) * (s.arc ?? 40);
    o.text = u < .5 ? (f.text ?? s.text) : s.text; o.c = s.c ?? f.c; o.box = s.box ?? f.box; o.flip = (f.text !== s.text && s.text) ? Math.abs(Math.cos(Math.PI * u)) : 1;
    return o;
  }
  function drawTok(st) {
    if (!st || !(st.a > .01)) return;
    ctx.save(); ctx.globalAlpha = clamp(st.a); ctx.translate(st.x, st.y); ctx.scale(Math.max(.02, st.flip ?? 1), 1);
    ctx.font = FONT(st.s); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (st.box) { const w = ctx.measureText(st.text).width + st.s * .9, h = st.s * 1.7; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, st.s * .4); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = st.box === true ? (st.c || W) : st.box; ctx.stroke(); }
    ctx.fillStyle = st.c || W; ctx.fillText(st.text, 0, 2); ctx.restore();
  }
  const bar = (x, y, w, a, c = W) => { if (a <= .01) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x - w / 2, y - 3, w, 6); ctx.restore(); };
  const win = (a, b, fi = .4, fo = .4) => { const t = X.now(), ta = tv(a), tb = tv(b); if (ta === undefined || t < ta || (tb !== undefined && t > tb)) return 0; return Math.min(1, (t - ta) / fi, tb === undefined ? 1 : (tb - t) / fo); };

  // ---------- build the choreography (lazily, once fonts are ready) ----------
  let built = false;
  function build() {
    built = true;
    const CY = 470, CS = 58, CX = [190, 540, 890];
    // cards: expressions → numbers for k = 2/3 → numbers for k = 20
    const EXPR = ['3k + 4', '12 − 3k', 'k + 16'], N23 = ['6', '10', '16⅔'], N20 = ['64', '−48', '36'];
    const from = [[-300, CY], [540, -150], [1380, CY]];
    for (let i = 0; i < 3; i++) tok('card' + i, [
      [['c1', 'c2', 'c3'][i], { x: from[i][0], y: from[i][1], s: CS, a: 1, text: EXPR[i], box: true, c: W, dur: 0 }],
      [['c1', 'c2', 'c3'][i] + '+0.01', { x: CX[i], y: CY, dur: .5, arc: 0 }],
      ['exL', { y: 400, s: 46, arc: 0 }],
      ['k23+' + i * .15, { text: N23[i], c: RED, s: 54, arc: 0, dur: .45 }],
      ['k20+' + i * .15, { text: N20[i], c: G, arc: 0, dur: .45 }],
      ['trap', { a: .25, arc: 0 }],
    ]);
    // fraction: second/first = third/second
    const FY1 = 800, FY2 = 920, FS = 60;
    tok('n1', [['rat', { x: CX[1], y: CY, s: CS, a: 1, text: '12 − 3k', dur: 0 }], ['rat+0.01', { x: 290, y: FY1, s: FS }]]);
    tok('d1', [['rat', { x: CX[0], y: CY, s: CS, a: 1, text: '3k + 4', dur: 0 }], ['rat+0.15', { x: 290, y: FY2, s: FS, arc: 80 }]]);
    tok('n2', [['rat', { x: CX[2], y: CY, s: CS, a: 1, text: 'k + 16', dur: 0 }], ['rat+0.3', { x: 790, y: FY1, s: FS }]]);
    tok('d2', [['rat', { x: CX[1], y: CY, s: CS, a: 1, text: '12 − 3k', dur: 0 }], ['rat+0.45', { x: 790, y: FY2, s: FS, arc: 80 }]]);
    tok('eq1', [['rat+0.3', { x: 540, y: (FY1 + FY2) / 2, s: FS, a: 0, text: '=', dur: 0 }], ['rat+0.31', { a: 1, dur: .3 }]]);
    // cross-multiply → (12 − 3k)² = (3k + 4)(k + 16)
    const L1 = ['(12 − 3k)²', '=', '(3k + 4)', '(k + 16)'], LS = 56, P1 = row(L1, LS, 540, .25), LY = 860;
    T.n1.push(['sq', { x: P1[0], y: LY, s: LS, text: L1[0] }]); T.d2.push(['sq', { x: P1[0], y: LY, s: LS, a: 0 }]);
    T.eq1.push(['sq', { x: P1[1], y: LY, s: LS }]);
    T.d1.push(['cross', { x: P1[2], y: LY, s: LS, text: L1[2], arc: 160, dur: .9 }]); T.n2.push(['cross', { x: P1[3], y: LY, s: LS, text: L1[3], arc: -120, dur: .9 }]);
    // the whole line moves up for the expansion
    const LY2 = 560, LS2 = 48, P2 = row(L1, LS2, 540, .25);
    ['n1', 'eq1', 'd1', 'n2'].forEach((id, i) => T[id].push(['exL', { x: P2[i], y: LY2, s: LS2, arc: 0 }], ['fac', { a: 0, arc: 0, dur: .4 }]));
    // expand: terms burst out of each side
    const EY = 700, ES = 50, EL = ['144', '− 72k', '+ 9k²'], ER = ['3k²', '+ 52k', '+ 64'];
    const PL = row(EL, ES, 285, .25), PR = row(ER, ES, 800, .25);
    EL.forEach((s, i) => tok('el' + i, [['exL+' + i * .2, { x: P2[0], y: LY2, s: 20, a: 1, text: s, c: W, dur: 0 }], ['exL+' + (i * .2 + .01), { x: PL[i], y: EY, s: ES, c: '#bbf7d0', arc: 60 }]]));
    ER.forEach((s, i) => tok('er' + i, [['exR+' + i * .2, { x: (P2[2] + P2[3]) / 2, y: LY2, s: 20, a: 1, text: s, c: W, dur: 0 }], ['exR+' + (i * .2 + .01), { x: PR[i], y: EY, s: ES, c: '#bbf7d0', arc: 60 }]]));
    // collect like terms → 6k² − 124k + 80 = 0
    const CL = ['6k²', '− 124k', '+ 80', '= 0'], CYY = 850, CSZ = 60, PC = row(CL, CSZ, 540, .3);
    const meet = (ids, slot, text, t) => ids.forEach((id, j) => T[id].push([t, { x: PC[slot], y: CYY, s: CSZ, text: j === 0 ? text : T[id][0][1].text, a: j === 0 ? 1 : 0, c: W, arc: 90 }]));
    meet(['el2', 'er0'], 0, '6k²', 'col'); meet(['el1', 'er1'], 1, '− 124k', 'col+0.2'); meet(['el0', 'er2'], 2, '+ 80', 'col+0.4');
    tok('z0', [['col+0.6', { x: PC[3], y: CYY + 80, s: CSZ, a: 0, text: '= 0', dur: 0 }], ['col+0.61', { y: CYY, a: 1, dur: .35 }]]);
    // ÷ 2 → 3k² − 62k + 40 = 0 (boxed)
    const HL = ['3k²', '− 62k', '+ 40', '= 0'], HY = 1010, HS = 66, PH = row(HL, HS, 540, .3);
    [['el2', 0], ['el1', 1], ['el0', 2], ['z0', 3]].forEach(([id, i]) => T[id].push(['half+' + i * .12, { x: PH[i], y: HY, s: HS, text: HL[i], c: G, arc: 50 }], ['fac', { y: 600, s: 56, arc: 0 }], ['fac+1.6', { a: 0, dur: .4 }]));
    ['er0', 'er1', 'er2'].forEach(id => T[id].push(['half', { a: 0, dur: .2 }]));
    tok('half2', [['half', { x: 540, y: 1110, s: 44, a: 0, text: '÷ 2', c: G, box: true, dur: 0 }], ['half+0.01', { a: 1, dur: .3 }], ['half+1.6', { a: 0, dur: .3 }]]);
    // factorise: (3k − 2)(k − 20) = 0, roots drop out
    const FL = ['(3k − 2)', '(k − 20)', '= 0'], FY = 760, FSZ = 68, PF = row(FL, FSZ, 540, .2);
    FL.forEach((s, i) => tok('f' + i, [['fac+0.3', { x: 540, y: 600, s: 30, a: 0, text: s, c: W, dur: 0 }], ['fac+0.31', { x: PF[i], y: FY, s: FSZ, a: 1, arc: -40 }], ['rem2', { a: 0, dur: .3 }]]));
    tok('r1', [['roots', { x: PF[0], y: FY, s: 40, a: 0, text: 'k = ⅔', c: G, box: true, dur: 0 }], ['roots+0.01', { x: 290, y: 980, s: 70, a: 1, arc: -80 }], ['rem2', { a: 0, dur: .3 }]]);
    tok('r2', [['roots+0.2', { x: PF[1], y: FY, s: 40, a: 0, text: 'k = 20', c: G, box: true, dur: 0 }], ['roots+0.21', { x: 790, y: 980, s: 70, a: 1, arc: -80 }], ['rem2', { a: 0, dur: .3 }]]);
    // S∞ formula card, then substitution
    tok('sinf', [['rem3', { x: 330, y: 640, s: 74, a: 0, text: 'S∞ =', c: G, dur: 0 }], ['rem3+0.01', { a: 1, dur: .35 }], ['ans', { a: 0, dur: .3 }]]);
    tok('fa', [['rem3', { x: 640, y: 590, s: 74, a: 0, text: 'a', c: W, dur: 0 }], ['rem3+0.01', { a: 1, dur: .35 }], ['sub', { a: 0, dur: .2 }]]);
    tok('f64', [['sub', { x: CX[0], y: 400, s: 46, a: 1, text: '64', c: G, dur: 0 }], ['sub+0.01', { x: 640, y: 590, s: 74, arc: -60 }], ['ans', { a: 0, dur: .3 }]]);
    tok('fr', [['rem3', { x: 640, y: 700, s: 74, a: 0, text: '1 − r', c: W, dur: 0 }], ['rem3+0.01', { a: 1, dur: .35 }], ['sub+0.4', { text: '1 + ¾', c: G, dur: .5 }], ['sub+1.4', { text: '7/4', dur: .5 }], ['ans', { a: 0, dur: .3 }]]);
    tok('ansT', [['ans', { x: 540, y: 650, s: 40, a: 0, text: 'S∞ = 256/7', c: G, box: true, dur: 0 }], ['ans+0.01', { s: 104, a: 1, arc: 0, dur: .45 }]]);
    tok('trapT', [['trap', { x: 540, y: 790, s: 60, a: 0, text: '36.6  ✗  keep it exact', c: RED, box: true, dur: 0 }], ['trap+0.01', { a: 1, s: 62, dur: .3 }]]);
    // a little "why" under the needle phase
  }

  // ---------- overlays ----------
  X.big('k = ?&nbsp;&nbsp;&nbsp;S<sub>∞</sub> = ?', 'q', 'rem1', { y: 760, size: 120, color: G, box: true });
  X.ring('pz+0.9', 2.0);
  X.badge('🧠 REMEMBER', 'rem1', 'cross', { bg: G, fg: '#04210f', y: 230 });
  X.badge('🧠 REMEMBER', 'rem2', 'k23', { bg: G, fg: '#04210f', y: 230 });
  X.badge('🧠 REMEMBER', 'rem3', 'sub', { bg: G, fg: '#04210f', y: 480 });
  ['c1', 'c2', 'c3', 'rat', 'cross', 'fac', 'rem2', 'k23', 'k20', 'rem3', 'o'].forEach(m => X.cue('whoosh', m));
  ['exL', 'exR', 'col', 'half', 'roots', 'r20', 'sub'].forEach(m => X.cue('pop', m));
  X.cue('slam', 'q'); X.cue('buzz', 'r23'); X.cue('slam', 'boom'); X.cue('slam', 'ans'); X.cue('ding', 'ans'); X.cue('buzz', 'trap'); X.cue('riser', 'pz+0.8');
  for (let i = 1; i < 11; i++) X.cue('tick', `hop+${(i * .4).toFixed(2)}`);

  // ---------- extra drawn pieces ----------
  function arrows(t) {   // × r arcs between the cards
    const a = win('c2', 'rat', .5, .3) + win('k23', 'trap', .5, .3); if (a <= 0) return;
    const y = on('exL') ? 400 : 470, lbl = on('k20') ? '× (−¾)' : on('k23') ? '× 5/3' : '× r', col = on('k20') || !on('k23') ? G : RED;
    ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 6;
    [[190, 540], [540, 890]].forEach(([p, q]) => { const yy = y - 80, h = 80 + (on('rem1') && !on('rat') ? 15 * Math.sin(t * 9) : 0);
      ctx.beginPath(); ctx.moveTo(p + 50, yy); ctx.quadraticCurveTo((p + q) / 2, yy - h, q - 50, yy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(q - 50, yy); ctx.lineTo(q - 72, yy - 18); ctx.lineTo(q - 64, yy + 8); ctx.fill();
      ctx.font = FONT(40); ctx.textAlign = 'center'; ctx.fillText(lbl, (p + q) / 2, yy - h - 10); });
    ctx.restore();
  }
  function fracBars() { const a = win('rat+0.4', 'sq', .3, .3); bar(290, 860, 260, a); bar(790, 860, 260, a);
    const b = win('rem3', 'ans', .3, .3); bar(640, 645, 220, b); }
  function crossLines() { const a = win('cross', 'sq', .2, .2); if (!a) return; const p = E.out((X.now() - tv('cross')) / .5);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = G; ctx.lineWidth = 8; ctx.lineCap = 'round';
    [[[290, 760], [790, 960]], [[290, 960], [790, 760]]].forEach(([s, e]) => { ctx.beginPath(); ctx.moveTo(...s); ctx.lineTo(lerp(s[0], e[0], p), lerp(s[1], e[1], p)); ctx.stroke(); }); ctx.restore(); }
  function hlBox() { const a = win('half+0.5', 'fac'); if (!a) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = G; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(110, 1010 - 70, 860, 140, 30); ctx.stroke(); ctx.restore(); }
  // ratio gauge: r from −2 to 2; safe zone −1 < r < 1
  const GX = r => 540 + r * 210, GY = 880;
  function gauge(t) {
    const a = win('rem2', 'hop', .4, .4); if (!a) return;
    const r = on('k20') ? lerp(5 / 3, -.75, E.io((t - tv('r20') + .4) / .9)) : on('k23') ? lerp(0, 5 / 3, E.io((t - tv('r23') + .4) / .9)) : 0;
    const shake = on('r23') && !on('k20') && t - tv('r23') < .6 ? Math.sin(t * 80) * 10 * (1 - (t - tv('r23')) / .6) : 0;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(shake, 0);
    ctx.fillStyle = 'rgba(255,107,107,.25)'; ctx.fillRect(GX(-2), GY - 26, GX(2) - GX(-2), 52);
    ctx.fillStyle = 'rgba(74,222,128,.45)'; ctx.fillRect(GX(-1), GY - 26, GX(1) - GX(-1), 52);
    ctx.font = FONT(40); ctx.fillStyle = W; ctx.textAlign = 'center';
    [-2, -1, 0, 1, 2].forEach(v => { ctx.fillRect(GX(v) - 2, GY - 36, 4, 72); ctx.fillText(String(v).replace('-', '−'), GX(v), GY + 80); });
    ctx.font = FONT(64); ctx.fillStyle = G; ctx.fillText('−1 < r < 1  converges', 540, GY - 140);
    if (on('k23')) { const col = on('k20') ? (t > tv('r20') + .5 ? G : W) : RED, x = GX(r);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, GY - 34); ctx.lineTo(x - 26, GY - 80); ctx.lineTo(x + 26, GY - 80); ctx.fill();
      ctx.font = FONT(46); ctx.fillText(`r = ${on('k20') ? '−¾' : '5/3'}`, x, GY - 104 - 0); }
    ctx.restore();
  }
  // k = 2/3: the terms explode outwards, getting bigger
  function boom(t) {
    if (!on('boom') || on('k20')) return; const d = t - tv('boom');
    const v = [6, 10, 16.7, 27.8, 46.3, 77.2, 128.6, 214.3, 357.2, 595.4];
    v.forEach((x, i) => { const u = d - i * .14; if (u < 0) return; const side = i % 2 ? 1 : -1, dist = 60 + u * (320 + 80 * i);
      const s = 34 * Math.pow(1.22, i) * (1 + u * .5); ctx.save(); ctx.globalAlpha = clamp(1.4 - u * .7); ctx.font = FONT(s); ctx.fillStyle = RED; ctx.textAlign = 'center';
      ctx.fillText(String(x), 540 + side * dist, 1110 + (i % 3 - 1) * 40 + u * 30); ctx.restore(); });
    ctx.save(); ctx.font = FONT(110); ctx.fillStyle = RED; ctx.textAlign = 'center'; ctx.globalAlpha = clamp(d / .3); ctx.fillText('→ ∞  ✗', 540, 1240); ctx.restore();
  }
  // k = 20: the running total hops along a number line onto 256/7, then the line zooms in
  const S = n => 64 * (1 - Math.pow(-.75, n)) / 1.75, TARGET = 256 / 7, NY = 1110;
  function hops(t) {
    const a = win('hop', 'o', .4, .4); if (!a) return;
    const z = 1 + 4 * E.io((t - tv('sub')) / 2.4) * (on('sub') ? 1 : 0), XT = 60 + (TARGET + 60) * 6.86, map = v => XT + (60 + (v + 60) * 6.86 - XT) * z;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = W; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(30, NY); ctx.lineTo(1050, NY); ctx.stroke();
    ctx.font = FONT(34); ctx.fillStyle = W; ctx.textAlign = 'center';
    [-40, 0, 40, 80].forEach(v => { const x = map(v); if (x < 20 || x > 1060) return; ctx.fillRect(x - 2, NY - 16, 4, 32); ctx.fillText(String(v).replace('-', '−'), x, NY + 55); });
    ctx.setLineDash([16, 12]); ctx.strokeStyle = G; ctx.beginPath(); ctx.moveTo(XT, NY - 210); ctx.lineTo(XT, NY + 30); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = G; ctx.font = FONT(40); ctx.fillText('256/7 ≈ 36.57', XT, NY - 230);
    const T0 = tv('hop'), H = .4, n = Math.min(14, Math.floor((t - T0) / H)), u = clamp(((t - T0) % H) / H);
    for (let i = 1; i <= n; i++) { const x0 = map(i === 1 ? 0 : S(i - 1)), x1 = map(S(i)); ctx.strokeStyle = 'rgba(74,222,128,.45)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, NY); ctx.quadraticCurveTo((x0 + x1) / 2, NY - 300 / (i + 1), x1, NY); ctx.stroke(); }
    const done = n >= 14, x0 = map(n === 0 ? 0 : S(n)), x1 = map(S(n + 1)), px = done ? map(S(14)) : lerp(x0, x1, u), py = done ? NY : NY - Math.sin(Math.PI * u) * 300 / (n + 2);
    ctx.fillStyle = W; ctx.beginPath(); ctx.arc(px, py, 24, 0, 7); ctx.fill(); ctx.fillStyle = G; ctx.beginPath(); ctx.arc(px, py, 14, 0, 7); ctx.fill();
    ctx.font = FONT(50); ctx.fillStyle = W; ctx.fillText(`total = ${S(Math.max(1, Math.min(14, n + (u > .5 ? 1 : 0)))).toFixed(2)}`, 540, NY + 120);
    ctx.restore();
  }

  return (t) => {
    if (!built) build();
    ctx.clearRect(0, 0, 1080, 1920);
    const gx = 540 + 220 * Math.sin(t * .4), gy = 820 + 160 * Math.cos(t * .33), gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 720);
    gr.addColorStop(0, 'rgba(74,222,128,.14)'); gr.addColorStop(1, 'rgba(74,222,128,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, 1080, 1920);
    // shake on the big moments
    const sh = ['boom', 'ans'].map(m => on(m) && t - tv(m) < .4 ? (1 - (t - tv(m)) / .4) * 12 : 0).reduce((a, b) => a + b, 0);
    ctx.save(); ctx.translate(Math.sin(t * 90) * sh, Math.cos(t * 77) * sh);
    arrows(t); fracBars(); crossLines(); hlBox(); gauge(t); boom(t); hops(t);
    Object.values(T).forEach(keys => drawTok(state(keys, t)));
    ctx.restore();
  };
};
