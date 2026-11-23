// OCR A June 2023 P1 Q7. First order: [X] = [X]0 · e^(−kt), k = ln2 / 16 min⁻¹. Same k for both starts.
window.SCENES['chem-ocr2023-p1-q7'] = (t, T, H) => {
  const { C } = H; let s = '';
  const k = Math.LN2 / 16, X = m => 130 + m * 12.8, Y = c => 600 - c * 250;   // 0–64 min, 0–2.0 mol dm⁻³
  const curve = (c0, m0 = 0, m1 = 64) => { const p = []; for (let m = m0; m <= m1 + 1e-9; m += 0.5) p.push([X(m), Y(c0 * Math.exp(-k * (m - m0 + 0)))]); return p; };
  const show = H.k(T.L0, .5);
  // axes + gridlines
  s += H.g(show, [0.25, 0.5, 1, 2].map(c => H.ln(X(0), Y(c), X(64), Y(c), 1, { stroke: '#e7e0d0', strokeWidth: 2 }) + H.tx(X(0) - 18, Y(c), String(c), { fontSize: 24, textAnchor: 'end' })).join('') +
    [16, 32, 48, 64].map(m => H.tx(X(m), 640, String(m), { fontSize: 24 })).join('') +
    H.ar(X(0), 600, X(66), 600, 1, { strokeWidth: 3 }) + H.ar(X(0), 600, X(0), 60, 1, { strokeWidth: 3 }) +
    H.tx(X(0) + 12, 50, '[X] / mol dm⁻³', { fontSize: 24, textAnchor: 'start', opacity: .75 }) + H.tx(X(60), 680, 'time / min', { fontSize: 24, opacity: .75 }));
  // hook: the two starting points
  s += H.g(show, H.ci(X(0), Y(1), 10, { fill: C.blue, strokeWidth: 0 }));
  if (H.on(T.dbl)) s += H.g(H.k(T.dbl), H.ci(X(0), Y(2), 10, { fill: C.ink, strokeWidth: 0 })) + H.pill(X(0) + 70, Y(2), '×2', { size: 26, scale: H.pop(T.dbl) }) +
    (H.on(T.c1) ? '' : H.g(H.k(T.dbl), H.tx(X(32), Y(1.6), 'half-life = ?', { fontSize: 44, fontWeight: 800 })));
  // curve from 1.0 (blue) and its half-lives
  if (H.on(T.c1) && !H.on(T.c2)) s += H.pl(curve(1), H.lin(T.c1, 1.6), { stroke: C.blue, strokeWidth: 6 });
  const halves = (c0, m0, t0, col, n) => { let r = '';
    for (let i = 0; i < n; i++) { const tt = t0 + i * .45; if (!H.on(tt)) break; const o = H.k(tt, .4), ma = m0 + 16 * i, mb = ma + 16, cb = c0 / Math.pow(2, i + 1);
      r += H.g(o, H.ln(X(mb), Y(cb), X(mb), 600, 1, { stroke: col, strokeWidth: 3, strokeDasharray: '6 6' }) + H.ci(X(mb), Y(cb), 8, { fill: col, strokeWidth: 0 }) +
        H.ln(X(ma) + 4, 582, X(mb) - 4, 582, 1, { stroke: col, strokeWidth: 3 })) + H.pill((X(ma) + X(mb)) / 2, 582, '16 min', { size: 20, bg: col, opacity: o }); }
    return r; };
  if (H.on(T.h1) && !H.on(T.c2)) s += halves(1, 0, T.h1, C.blue, 3);
  // curve from 2.0 (ink)
  if (H.on(T.c2)) {
    s += H.g(H.on(T.shift) ? .35 : 1, H.pl(curve(1), 1, { stroke: C.blue, strokeWidth: 6 }));
    s += H.pl(curve(2, 0, 16), H.lin(T.c2, 1.2), { stroke: C.ink, strokeWidth: 7 });
    if (H.on(T.c2 + 1.2)) s += H.ci(X(16), Y(1), 10, { fill: C.pop, strokeWidth: 3 }) + H.pill(X(16) + 95, Y(1) - 30, 'down to 1.0', { size: 22, scale: H.pop(T.c2 + 1.2) });
    // the old curve slides 16 min to the right and lands exactly on the new one
    if (H.on(T.shift)) { const sh = 16 * H.ezio((t - T.shift) / 1.6);
      s += `<g transform="translate(${sh * 12.8},0)">${H.pl(curve(1, 0, 48), 1, { stroke: C.blue, strokeWidth: 6, strokeDasharray: '14 10' })}</g>`;
      if (H.on(T.shift + 1.6)) s += H.pl(curve(2, 16, 64).map(([x, y], i) => [x, Y(1 * Math.exp(-k * (i * .5)))]), 1, { stroke: C.ink, strokeWidth: 7 }) +
        H.pill(X(44), Y(0.75), 'same curve!', { size: 26, bg: C.blue, scale: H.pop(T.shift + 1.6) }); }
    if (H.on(T.h)) s += halves(2, 0, T.h, C.ink, 3);
    // the trap: tangents at t = 0 show the rate doubling
    if (H.on(T.rate)) { const o = H.k(T.rate);
      s += H.g(o, H.ln(X(0), Y(2), X(10), Y(2 - 2 * k * 10), 1, { stroke: C.bad, strokeWidth: 5 }) + H.ln(X(0), Y(1), X(10), Y(1 - k * 10), 1, { stroke: C.bad, strokeWidth: 5 })) +
        H.pill(X(16) + 30, Y(1.95), 'rate ×2', { size: 24, bg: C.bad, scale: H.pop(T.rate) }); }
    if (H.on(T.amt)) s += H.pill(X(46), Y(1.55), 'but 2× as much to react', { size: 24, bg: C.bad, scale: H.pop(T.amt) });
  }
  return s;
};
