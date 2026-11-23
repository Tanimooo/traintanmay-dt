// Edexcel June 2023 P1 Q9. k = 2/3 → 6, 10, 50/3 (r = 5/3, diverges); k = 20 → 64, −48, 36 (r = −3/4), S∞ = 256/7.
window.SCENES['maths-edexcel2023-p1-q9'] = (t, T, H) => {
  const { C } = H; let s = '';
  const show = H.k(T.L0, .5);
  // three term cards
  const k20 = H.on(T.k20), k23 = H.on(T.k23) && !k20;
  const lab = k20 ? ['64', '−48', '36'] : k23 ? ['6', '10', '16⅔'] : ['3k + 4', '12 − 3k', 'k + 16'];
  const swap = k20 ? H.pop(T.k20) : k23 ? H.pop(T.k23) : 1;
  const col = k20 ? '#dbeafe' : k23 ? '#fde3e7' : '#fff';
  [170, 500, 830].forEach((x, i) => {
    const o = H.k(T.L0 + .25 * i, .4);
    s += H.g(o * show, `<g transform="translate(${x},80) scale(${swap})"><rect x="-130" y="-48" width="260" height="96" rx="20" fill="${col}" stroke="${C.ink}" stroke-width="5"/>` +
      H.tx(0, 2, lab[i], { fontSize: 42, fontWeight: 700, fontStyle: k20 || k23 ? 'normal' : 'italic' }) + '</g>');
  });
  // × r arrows
  if (H.on(T.r)) { const o = H.k(T.r), rl = k20 ? '× (−¾)' : k23 ? '× 5/3' : '× r';
    [[300, 370], [630, 700]].forEach(([a, b]) => s += H.g(o, `<path d="M${a},140 Q${(a + b) / 2},185 ${b},140" fill="none" stroke="${C.ink}" stroke-width="4"/>` +
      `<polygon points="${b},140 ${b - 16},136 ${b - 6},150" fill="${C.ink}"/>` + H.tx((a + b) / 2, 205, rl, { fontSize: 28, fontWeight: 700 }))); }
  // middle² = product
  if (H.on(T.r) && !H.on(T.k23)) s += H.g(H.k(T.r + .6), H.tx(500, 300, '(middle)² = first × third', { fontSize: 40, fontWeight: 700 }));
  if (H.on(T.roots) && !H.on(T.k23)) s += H.pill(330, 420, 'k = 20', { size: 40, scale: H.pop(T.roots) }) + H.pill(670, 420, 'k = ⅔', { size: 40, scale: H.pop(T.roots) });
  // bar charts of the terms: baseline y = 470, 3.2 px per unit; clipped at the top of the stage
  const base = 470, sc = 3.2, bx = i => 150 + i * 92;
  const bars = (vals, t0, fill) => { let r = '';
    vals.forEach((v, i) => { const tt = t0 + i * .28; if (!H.on(tt)) return; const p = H.k(tt, .35), h = v * sc * p;
      const top = Math.max(250, base - Math.max(h, 0)), bot = base - Math.min(h, 0);
      r += `<rect x="${bx(i) - 28}" y="${top}" width="56" height="${Math.max(2, bot - top)}" rx="6" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>`;
      if (base - h < 250) r += H.tx(bx(i), 236, '↑', { fontSize: 34, fill: C.bad, fontWeight: 700 }); });
    return r; };
  if (H.on(T.k23) || k20) s += H.g(H.k(T.k23), H.ln(100, base, 960, base, 1, { strokeWidth: 3 }) + H.tx(80, base, '0', { fontSize: 22, textAnchor: 'end' }));
  if (k23) { s += bars([6, 10, 50 / 3, 250 / 9, 1250 / 27, 6250 / 81, 31250 / 243, 156250 / 729, 781250 / 2187], T.k23, '#fca5a5');
    if (H.on(T.r23)) s += H.pill(700, 600, 'r = 5/3 > 1 · blows up ✗', { size: 28, bg: C.bad, scale: H.pop(T.r23) }); }
  if (k20) {
    const v = [64]; for (let i = 1; i < 9; i++) v.push(v[i - 1] * -0.75);
    s += bars(v, T.k20, '#93c5fd');
    if (H.on(T.r20) && !H.on(T.trap)) s += H.pill(720, 640, '|r| = ¾ < 1 · converges ✓', { size: 26, bg: C.ok, scale: H.pop(T.r20) });
    // partial sums zig-zag onto S∞
    if (H.on(T.s)) {
      const S = []; let acc = 0; v.forEach(x => { acc += x; S.push([bx(S.length), base - acc * sc]); });
      const yInf = base - 256 / 7 * sc;
      s += H.g(H.k(T.s), H.ln(100, yInf, 960, yInf, 1, { stroke: C.ok, strokeWidth: 4, strokeDasharray: '12 8' }));
      s += H.pl(S, H.lin(T.s, 2), { stroke: C.ink, strokeWidth: 4 });
      S.forEach(([x, y], i) => { if (H.lin(T.s, 2) * (S.length - 1) >= i) s += H.ci(x, y, 8, { fill: C.pop, strokeWidth: 3 }); });
      if (H.on(T.ans)) s += H.pill(860, yInf - 42, 'S∞ = 256/7', { size: 30, bg: C.ok, scale: H.pop(T.ans) });
    }
  }
  if (H.on(T.trap)) s += H.pill(640, 640, '≈ 36.57… but write 256/7', { size: 28, bg: C.bad, scale: H.pop(T.trap) });
  return s;
};
