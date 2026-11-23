// Edexcel 9DT0 2019 Q5(e). A2 = 0.42 × 0.594 = 0.24948 m²; pack = 12.474 m²; 310 / 12.474 = 24.85 → 25 packs → £922.00.
window.SCENES['dt-edexcel2019-q5e'] = (t, T, H) => {
  const { C } = H; let s = '';
  const show = H.k(T.L0, .5);
  // the A2 sheet (landscape, 0.6 px per mm)
  const sx = 70, sy = 70, sw = 594 * .6, sh = 420 * .6;
  const draw = H.lin(T.L0, 1.2);
  s += H.pl([[sx, sy], [sx + sw, sy], [sx + sw, sy + sh], [sx, sy + sh], [sx, sy]], draw, { fill: H.on(T.a) ? '#fef3c7' : 'none', strokeWidth: 5 });
  s += H.g(show, H.tx(sx + sw / 2, sy + sh / 2, 'A2', { fontSize: 54, fontWeight: 800, opacity: .25 }));
  if (H.on(T.sheet) || H.on(T.m)) { const mm = !H.on(T.m), o = H.k(T.sheet);
    s += H.g(o, H.ln(sx, sy - 26, sx + sw, sy - 26, 1, { strokeWidth: 3 }) + H.ln(sx - 26, sy, sx - 26, sy + sh, 1, { strokeWidth: 3 }));
    s += H.pill(sx + sw / 2, sy - 26, mm ? '594 mm' : '0.594 m', { size: 24, scale: mm ? H.pop(T.sheet) : H.pop(T.m), bg: mm ? C.ink : C.blue });
    s += `<g transform="rotate(-90 ${sx - 26} ${sy + sh / 2})">${H.pill(sx - 26, sy + sh / 2, mm ? '420 mm' : '0.42 m', { size: 24, scale: mm ? H.pop(T.sheet) : H.pop(T.m), bg: mm ? C.ink : C.blue })}</g>`; }
  if (H.on(T.a)) s += H.pill(sx + sw / 2, sy + sh / 2 + 52, '0.24948 m²', { size: 30, bg: C.ok, scale: H.pop(T.a) });
  // the pack: 50 sheets stack up
  const px = 560, py = 90;
  if (H.on(T.pack) && !H.on(T.ans)) { const n = Math.round(50 * H.lin(T.pack, 1.4));
    for (let i = 0; i < n; i++) s += `<rect x="${px + i * .6}" y="${py + 190 - i * 2.4}" width="${sw * .7}" height="${sh * .45}" rx="4" fill="${i === n - 1 ? '#fef3c7' : '#fff'}" stroke="${C.ink}" stroke-width="2"/>`;
    s += H.tx(px + 150, py + 330, `${n} sheets`, { fontSize: 30, fontWeight: 700 });
    if (H.on(T.pack + 1.5)) s += H.pill(px + 160, py - 40, '1 pack = 12.474 m²', { size: 28, bg: C.ok, scale: H.pop(T.pack + 1.5) }); }
  // how many packs: 24 full + 0.85 of the 25th
  if (H.on(T.n)) {
    const cols = 13, w = 58, h = 70, gx = 70, gy = 470;
    for (let i = 0; i < 25; i++) { const tt = T.n + i * .06; if (!H.on(tt)) continue;
      const x = gx + (i % cols) * (w + 9), y = gy + Math.floor(i / cols) * (h + 14), full = i < 24 || H.on(T.up), f = full ? 1 : .85;
      s += H.g(H.k(tt, .25), `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${i === 24 ? (H.on(T.up) ? C.ok : C.bad) : C.ink}" stroke-width="${i === 24 ? 5 : 3}"/>` +
        `<rect x="${x + 4}" y="${y + 4 + (h - 8) * (1 - f)}" width="${w - 8}" height="${(h - 8) * f}" rx="5" fill="${i === 24 && !H.on(T.up) ? '#fca5a5' : '#93c5fd'}"/>`);
      if (i === 24 && !H.on(T.up) && H.on(T.n + 1.6)) s += H.pill(x + w / 2, y - 26, '0.85', { size: 22, bg: C.bad, scale: H.pop(T.n + 1.6) });
      if (i === 24 && H.on(T.up)) s += H.pill(x + w / 2 - 40, y + h + 28, 'buy a whole one', { size: 22, bg: C.ok, scale: H.pop(T.up) });
    }
    s += H.tx(300, 670, H.on(T.up) ? '25 packs' : '24.85 packs', { fontSize: 34, fontWeight: 800 });
  }
  if (H.on(T.ans)) s += H.pill(760, 200, '£922.00', { size: 56, bg: C.ok, scale: H.pop(T.ans) });
  if (H.on(T.trap)) s += H.pill(760, 320, '£916.53 ✗', { size: 36, bg: C.bad, scale: H.pop(T.trap) });
  return s;
};
