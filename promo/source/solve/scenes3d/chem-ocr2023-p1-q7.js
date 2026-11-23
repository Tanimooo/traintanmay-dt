// OCR A June 2023 P1 Q7 — first-order half-life, 2D (orange).
// First order: [X] = [X]₀·e^(−kt), k = ln2/16 min⁻¹, so t½ = ln2/k = 16 min for ANY starting [X].
// Starting at 2.0 the rate is twice as fast (rate = k[X]) but there is twice as much to lose → same half-life.
// Particles: each has an exact first-order quantile lifetime τ_i = −ln(1 − (i+½)/N)/k, so the count left is N·2^(−m/16).
export default (X) => {
  const { TH, E, on, tv, clamp } = X;
  const ctx = X.canvas(), O = TH.brand, W = '#ffffff', RED = '#ff6b6b', CREAM = '#ffe2cc';
  const kk = Math.LN2 / 16;
  const lerp = (a, b, u) => a + (b - a) * u;
  const FONT = s => `700 ${s}px 'IBM Plex Sans'`;
  const txt = (s, x, y, size, col = W, align = 'center') => { ctx.font = FONT(size); ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); };
  const win = (a, b, fi = .4, fo = .4) => { const t = X.now(), ta = tv(a), tb = tv(b); if (ta === undefined || t < ta || (tb !== undefined && t > tb)) return 0; return Math.min(1, (t - ta) / fi, tb === undefined ? 1 : (tb - t) / fo); };

  // ---------- reaction clocks (minutes of reaction shown at video time t) ----------
  // (pure functions of t: they're tabulated at setup, before the video clock runs, so no on())
  const clockL = t => { if (t < tv('go')) return 0; if (t < tv('m32')) return 16 * E.io((t - tv('c1')) / Math.max(.5, tv('dt1') + .6 - tv('c1'))); return clockBoth(t); };
  const clockR = t => { if (t < tv('c2')) return 0; if (t < tv('m32')) return 16 * E.io((t - tv('c2') - .3) / Math.max(.5, tv('h2') + .4 - tv('c2') - .3)); return clockBoth(t); };
  const clockBoth = t => t < tv('m48') ? 16 + 16 * E.io((t - tv('m32')) / 1.4) : 32 + 16 * E.io((t - tv('m48')) / 1.4);

  // ---------- particle boxes ----------
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const mk = (N, bx) => { const life = Array.from({ length: N }, (_, i) => -Math.log(1 - (i + .5) / N) / kk);
    for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [life[i], life[j]] = [life[j], life[i]]; }
    return life.map(l => ({ l, x: bx + 40 + rnd() * 360, y: 360 + rnd() * 170, ph: rnd() * 6.28 })); };
  const PL = mk(40, 70), PR = mk(80, 570);
  const TABL = [], TABR = []; for (let t = 0; t <= 140; t += 1 / 60) { TABL.push(clockL(t)); TABR.push(clockR(t)); }
  const when = (tab, m) => { for (let i = 0; i < tab.length; i++) if (tab[i] >= m) return i / 60; return 1e9; };
  PL.forEach(p => p.tr = p.l <= 48.5 ? when(TABL, p.l) : 1e9); PR.forEach(p => p.tr = p.l <= 48.5 ? when(TABR, p.l) : 1e9);
  function box(t, bx, P, mins, label, a, col) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.beginPath(); ctx.roundRect(bx, 330, 440, 230, 30); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = col; ctx.stroke();
    let left = 0;
    P.forEach(p => { const d = t - p.tr; if (d < 0) { left++; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x + 6 * Math.sin(t * 2.3 + p.ph), p.y + 5 * Math.cos(t * 2.9 + p.ph), 9, 0, 7); ctx.fill(); }
      else if (d < .4) { ctx.globalAlpha = a * (1 - d / .4); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(p.x, p.y, 9 + d * 50, 0, 7); ctx.fill(); ctx.globalAlpha = a; } });
    txt(label, bx + 220, 300, 34, col); txt(`${left} left`, bx + 220, 600, 40, W);
    if (on('go')) txt(`${Math.round(mins)} min`, bx + 365, 360, 30, CREAM);
    ctx.restore();
  }

  // ---------- the graph ----------
  const GX = m => 150 + m * 13.4, GY = c => 1180 - c * 230;
  const curve = (c0, m1, col, w, sh = 0, dash) => { if (m1 <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; if (dash) ctx.setLineDash(dash); ctx.beginPath();
    for (let m = 0; m <= m1 + 1e-6; m += .25) { const x = GX(m + sh), y = GY(c0 * Math.exp(-kk * m)); m ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); };
  function graph(t) {
    const a = win('go', 'o', .5, .4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2;
    [16, 32, 48, 64].forEach(m => { ctx.beginPath(); ctx.moveTo(GX(m), 680); ctx.lineTo(GX(m), 1180); ctx.stroke(); txt(String(m), GX(m), 1215, 32, W); });
    [[.5, '0.5'], [1, '1.0'], [2, '2.0']].forEach(([c, s]) => { ctx.beginPath(); ctx.moveTo(150, GY(c)); ctx.lineTo(1010, GY(c)); ctx.stroke(); txt(s, 105, GY(c), 32, W); });
    ctx.strokeStyle = W; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(150, 660); ctx.lineTo(150, 1180); ctx.lineTo(1020, 1180); ctx.stroke();
    txt('[X]', 150, 635, 34, W); txt('time / min', 930, 1255, 30, W);
    const mL = clockL(t), mR = clockR(t);
    // after the slide the first curve is a ghost; the second stays bold
    curve(1, mL, CREAM, 8); curve(2, mR, O, 10);
    // starting slopes (rate) — twice as steep for 2.0
    const ta = win('fast', 'm16', .3, .3); if (ta > 0) { ctx.save(); ctx.globalAlpha = a * ta; ctx.strokeStyle = RED; ctx.lineWidth = 7;
      [[1, 1], [2, 2]].forEach(([c0]) => { ctx.beginPath(); ctx.moveTo(GX(0), GY(c0)); ctx.lineTo(GX(9), GY(c0 - c0 * kk * 9)); ctx.stroke(); });
      txt('rate ×2', GX(14), GY(1.85), 44, RED); ctx.restore(); }
    // halving markers
    const mark = (c0, m, col, y) => { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(GX(m), GY(c0 * Math.pow(.5, m / 16))); ctx.lineTo(GX(m), 1180); ctx.stroke(); ctx.restore();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(GX(m), GY(c0 * Math.pow(.5, m / 16)), 12, 0, 7); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(GX(m - 16) + 6, y); ctx.lineTo(GX(m) - 6, y); ctx.stroke(); if (col === O) txt('16 min', (GX(m - 16) + GX(m)) / 2, y - 24, 28, col); };
    [16, 32, 48].forEach(m => { if (mL >= m - .01) mark(1, m, CREAM, 1160); if (mR >= m - .01) mark(2, m, O, 1135); });
    // the first curve slides 16 min along and lands on the second
    if (on('slide')) { const u = E.io((t - tv('slide')) / 1.5); curve(1, 48 - 16 * u, '#fff3b0', 7, 16 * u, [22, 14]); if (u >= 1) txt('same curve!', GX(38), GY(.95), 46, '#fff3b0'); }
    ctx.restore();
  }

  // ---------- overlays ----------
  X.big('t½ = 16 min', 'q', 'pz', { y: 640, size: 64, color: CREAM, box: true }).style.left = '-260px';
  X.big('t½ = ?', 'q', 'pz', { y: 640, size: 84, color: O, box: true }).style.left = '260px';
  X.ring('pz+0.9', 2.0);
  X.badge('🧠 REMEMBER', 'rem', 'go', { bg: O, fg: '#fff', y: 640 });
  X.eq('\\text{rate} = k[\\text{X}]', 'fo', 'go', { y: 780, size: 96, color: O });
  X.big('half-life = time to halve', 'hl', 'go', { y: 1080, size: 64, color: W, box: true });
  X.badge('⏩ TIME-LAPSE', 'go', 'why', { bg: O, fg: '#fff', y: 230 });
  X.big('2× the rate<br>but 2× as much to lose', 'why', 'm32', { y: 760, size: 62, color: W, box: true });
  X.eq('t_{1/2} = \\frac{\\ln 2}{k}', 'form', 'trap', { y: 215, size: 80, color: O });
  X.big('no [X] in it!', 'nox', 'ans', { y: 520, size: 60, color: W, box: true, from: 'right' });
  X.big('t½ = 16 min', 'ans', 'trap', { y: 510, size: 90, color: O, box: true });
  X.big('8 min ✗', 'trap', 'o', { y: 330, size: 120, color: RED, box: true, from: 'left' });
  X.big('only thinks about the faster rate', 'trap+0.6', 'o', { y: 500, size: 50, color: W, box: true });
  ['b1', 'b2', 'rem', 'go', 'c2', 'why', 'slide', 'form', 'o'].forEach(m => X.cue('whoosh', m));
  ['fo', 'hl', 'dt1', 'fast', 'h2', 'm32', 'm48', 'nox'].forEach(m => X.cue('pop', m));
  X.cue('slam', 'q'); X.cue('slam', 'ans'); X.cue('ding', 'ans'); X.cue('buzz', 'trap'); X.cue('riser', 'pz+0.8');
  for (let m = 4; m <= 48; m += 4) { X.cue('tick', when(TABL, m)); X.cue('tick', when(TABR, m)); }

  return (t) => {
    ctx.clearRect(0, 0, 1080, 1920);
    const gx = 540 + 220 * Math.sin(t * .4), gy = 820 + 160 * Math.cos(t * .33), gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 720);
    gr.addColorStop(0, 'rgba(255,138,76,.14)'); gr.addColorStop(1, 'rgba(255,138,76,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, 1080, 1920);
    const sh = ['ans'].map(m => on(m) && t - tv(m) < .4 ? (1 - (t - tv(m)) / .4) * 12 : 0)[0];
    ctx.save(); ctx.translate(Math.sin(t * 90) * sh, Math.cos(t * 77) * sh);
    const boxA = win('b1', 'form', .4, .4), boxB = win('b2', 'form', .4, .4);
    // boxes slide in from the sides
    ctx.save(); ctx.translate(-300 * (1 - E.back(clamp((t - tv('b1')) / .5))), 0); box(t, 70, PL, clockL(t), '1.0 mol dm⁻³', boxA, CREAM); ctx.restore();
    ctx.save(); ctx.translate(300 * (1 - E.back(clamp((t - tv('b2')) / .5))), 0); box(t, 570, PR, clockR(t), '2.0 mol dm⁻³', boxB, O); ctx.restore();
    graph(t);
    ctx.restore();
  };
};
