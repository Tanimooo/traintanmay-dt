// ENGAA 2019 Q16: five identical resistors, voltmeter across one of the bottom pair.
// Battery + is the long plate (left): conventional current leaves on the left, splits 2:1 between the top resistor
// and the bottom pair, and returns on the right. Dots move at a speed proportional to the current.
window.SCENES['esat-engaa2019-q16'] = (t, T, H) => {
  const { C } = H; let s = '';
  // wires, in the order they draw themselves
  const W = [
    [[470, 80], [120, 80], [120, 330], [170, 330]], [[270, 330], [330, 330]],
    [[330, 330], [330, 210], [450, 210]], [[550, 210], [670, 210], [670, 330]],
    [[330, 330], [330, 450], [360, 450]], [[460, 450], [530, 450]], [[630, 450], [670, 450], [670, 330]],
    [[670, 330], [730, 330]], [[830, 330], [880, 330], [880, 80], [530, 80]],
    [[495, 450], [495, 560], [546, 560]], [[614, 560], [650, 560], [650, 450]],
  ];
  const draw = H.lin(T.L0 - .2, 1.0);
  W.forEach((w, i) => { s += H.pl(w, H.clamp(draw * W.length - i)); });
  // battery: long (+) and short (−) plates, two cells
  const bo = H.clamp(draw * 3 - 1.5);
  s += H.g(bo, H.ln(470, 45, 470, 115) + H.ln(484, 62, 484, 98, 1, { strokeWidth: 9 }) + H.ln(492, 80, 508, 80, 1, { strokeDasharray: '5 5' }) +
    H.ln(516, 45, 516, 115) + H.ln(530, 62, 530, 98, 1, { strokeWidth: 9 }));
  // current: dots move at speed ∝ current (outer 3, top 2, bottom 1)
  if (H.on(T.cur)) {
    const fade = H.k(T.cur, .5), v = 34, gap = 44, tt = t - T.cur;
    const flow = (pts, sp, col) => { const L = H.len(pts); let d = '';
      for (let x = (tt * v * sp) % gap; x < L; x += gap) { const [px, py] = H.along(pts, x / L); d += `<circle cx="${px}" cy="${py}" r="7" fill="${col}"/>`; }
      return H.g(fade, d); };
    s += flow([[470, 80], [120, 80], [120, 330], [330, 330]], 3, C.blue);
    s += flow([[670, 330], [880, 330], [880, 80], [530, 80]], 3, C.blue);
    s += flow([[330, 330], [330, 210], [670, 210], [670, 330]], 2, C.blue);
    s += flow([[330, 330], [330, 450], [670, 450], [670, 330]], 1, C.blue);
  }
  // resistors (boxes) with highlight
  const hl = (on) => on ? { fill: '#ffe680', stroke: C.ink } : {};
  const R = { L: [170, 312], TOP: [450, 192], BL: [360, 432], BR: [530, 432], RR: [730, 312] };
  const lit = {
    BR: H.on(T.vm) && !H.on(T.top), BL: H.on(T.bl) && !H.on(T.top), TOP: H.on(T.top) && !H.on(T.cur),
    L: H.on(T.out) && !H.on(T.sum), RR: H.on(T.out) && !H.on(T.sum),
  };
  const ro = H.clamp(draw * 2 - .6);
  Object.entries(R).forEach(([k, [x, y]]) => { s += H.g(ro, H.re(x, y, 100, 36, { rx: 4, ...hl(lit[k]) })); });
  // nodes
  [[330, 330], [670, 330], [495, 450], [650, 450]].forEach(([x, y]) => s += H.g(ro, H.ci(x, y, 7, { fill: C.ink, strokeWidth: 0 })));
  // voltmeter
  s += H.g(ro, H.ci(580, 560, 34, hl(H.on(T.vm) && !H.on(T.top))) + H.tx(580, 562, 'V', { fontSize: 34, fontWeight: 700 }));
  // labels
  const P = (k, x, y, txt, o = {}) => H.on(T[k]) ? H.pill(x, y, txt, { scale: H.pop(T[k]), ...o }) : '';
  s += P('vm', 715, 560, '1.0 V');
  s += P('bl', 410, 400, '1.0 V');
  if (H.on(T.br)) s += H.g(H.k(T.br), H.ln(340, 625, 660, 625, 1, { strokeWidth: 4 }) + H.ln(340, 612, 340, 638, 1, { strokeWidth: 4 }) + H.ln(660, 612, 660, 638, 1, { strokeWidth: 4 })) + P('br', 500, 665, '2.0 V across the bottom');
  s += P('top', 500, 155, '2.0 V');
  s += P('cur', 610, 176, 'I = 2/R', { bg: C.blue, size: 26 });
  s += P('cur2', 410, 485, 'I = 1/R', { bg: C.blue, size: 26 });
  s += P('cur3', 220, 268, 'I = 3/R', { bg: C.blue, size: 26 }) + P('cur3', 780, 268, 'I = 3/R', { bg: C.blue, size: 26 });
  s += P('out', 220, 385, '3.0 V') + P('out', 780, 385, '3.0 V');
  s += P('ans', 680, 34, 'Battery: 8.0 V', { bg: C.ok, size: 32 });
  return s;
};
