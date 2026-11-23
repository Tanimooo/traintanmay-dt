// OCR A June 2024 P1 Q4. Real kinematics: with g = 10.4 m s^-2 the ball's bottom reaches the beam at t = 0.10 s
// (0.052 m of fall) and its top leaves at t = 0.14 s (0.102 m of fall = 0.052 + the 0.050 m diameter).
window.SCENES['phys-ocr2024-p1-q4'] = (t, T, H) => {
  const { C } = H; let s = '';
  const g = 1.25 / 0.12, K = 2400, D = 0.05, cx = 190, b0 = 150;   // g exactly as the data give it; px per metre; ball bottom start
  const R = D * K / 2;                                     // 60 px
  const fall = tau => 0.5 * g * tau * tau;                 // metres
  const beam = b0 + fall(0.10) * K;                        // bottom reaches the beam at 0.10 s
  // slow-motion drops: tau runs 0 → 0.17 s
  const drop = (t0, dur) => t0 === undefined || t < t0 ? null : Math.min(0.17, 0.17 * (t - t0) / dur);
  const d1 = drop(T.drop, 3.2), d2 = drop(T.dt, 2.6);
  const tau = d2 !== null ? d2 : d1 !== null ? d1 : 0;
  const traceTo = d2 !== null ? 0.17 : d1 !== null ? d1 : 0;
  const yb = b0 + fall(tau) * K;                            // ball bottom
  const blocked = yb > beam && yb - 2 * R < beam;
  // --- gate + beam ---
  const show = H.k(T.L0, .5);
  s += H.g(show, H.re(70, beam - 22, 44, 44, { fill: '#ddd6c8' }) + H.re(266, beam - 22, 44, 44, { fill: '#ddd6c8' }) +
    H.ln(114, beam, 266, beam, 1, { stroke: blocked ? '#9ca3af' : C.bad, strokeWidth: blocked ? 3 : 5, strokeDasharray: '10 8' }) +
    (H.on(T.d) ? '' : H.tx(190, beam + 50, 'light gate', { fontSize: 24, opacity: .7 })));
  // ghosts at 0.10 s and 0.14 s, with the 5.0 cm the ball moves while blocking the beam
  if (H.on(T.d)) {
    const o = H.k(T.d) * .9, yA = b0 + fall(0.10) * K, yB = b0 + fall(0.14) * K;
    s += H.g(o * .45, H.ci(cx, yA - R, R, { fill: '#bfdbfe', strokeDasharray: '8 6' }) + H.ci(cx, yB - R, R, { fill: '#bfdbfe', strokeDasharray: '8 6' }));
    s += H.g(o, H.ln(318, yA, 318, yB, 1, { strokeWidth: 4 }) + H.ln(306, yA, 330, yA, 1, { strokeWidth: 4 }) + H.ln(306, yB, 330, yB, 1, { strokeWidth: 4 }));
    s += H.pill(372, (yA + yB) / 2, '5.0 cm', { size: 24, scale: H.pop(T.d), w: 80 });
  }
  // the ball
  s += H.g(show, H.ci(cx, yb - R, R, { fill: C.pop }));
  s += H.g(show, H.tx(cx, 670, `t = ${tau.toFixed(3)} s`, { fontSize: 28, fontWeight: 700 }) + H.tx(cx, 630, 'slow motion', { fontSize: 22, opacity: .55 }));
  // --- gate output graph (top right) ---
  const X = tau => 420 + tau * 2833, gy0 = 250, hi = 95, lo = 230;
  s += H.g(show, H.ar(420, gy0 + 6, 960, gy0 + 6, 1, { strokeWidth: 3 }) + H.ar(420, gy0 + 6, 420, 40, 1, { strokeWidth: 3 }) +
    H.tx(540, 30, 'gate output', { fontSize: 24, opacity: .7 }) + H.tx(905, 285, 'time / s', { fontSize: 22, opacity: .7 }));
  if (traceTo > 0) {
    const pts = [[X(0), hi]];
    const add = (a, y) => { if (traceTo > a) pts.push([X(a), pts[pts.length - 1][1]], [X(a), y]); };
    add(0.10, lo); add(0.14, hi); pts.push([X(traceTo), traceTo > 0.10 && traceTo < 0.14 ? lo : hi]);
    s += H.pl(pts, 1, { stroke: C.bad, strokeWidth: 5 });
  }
  if (traceTo > 0.14 || H.on(T.dt)) s += H.tx(X(0.10), 282, '0.10', { fontSize: 24 }) + H.tx(X(0.14), 282, '0.14', { fontSize: 24 });
  if (H.on(T.dt)) s += H.g(H.k(T.dt), `<rect x="${X(0.10)}" y="70" width="${X(0.14) - X(0.10)}" height="${gy0 - 64}" fill="${C.pop}" opacity=".35"/>`) +
    H.pill((X(0.10) + X(0.14)) / 2, 62, '0.04 s', { size: 24, scale: H.pop(T.dt) });
  // --- v–t graph (bottom right) ---
  if (H.on(T.vt)) {
    const o = H.k(T.vt), VY = v => 660 - v * 140;
    s += H.g(o, H.ar(420, 660, 960, 660, 1, { strokeWidth: 3 }) + H.ar(420, 660, 420, 350, 1, { strokeWidth: 3 }) +
      H.tx(450, 350, 'v', { fontSize: 28, fontStyle: 'italic', fontWeight: 700 }) + H.tx(905, 690, 't / s', { fontSize: 22, opacity: .7 }));
    // shaded strip 0.10 → 0.14 under the line = the 5.0 cm moved
    s += H.g(o * .5, `<polygon points="${X(.10)},660 ${X(.10)},${VY(g * .10)} ${X(.14)},${VY(g * .14)} ${X(.14)},660" fill="${C.pop}"/>`);
    s += H.ln(X(0), VY(0), X(0.17), VY(g * 0.17), H.lin(T.vt, 1.2), { stroke: C.blue, strokeWidth: 6 });
    if (H.on(T.mid)) {
      const m = H.k(T.mid);
      s += H.g(m, H.ln(X(.10), VY(1.25), X(.14), VY(1.25), 1, { strokeWidth: 4, strokeDasharray: '8 6' }) +
        H.ln(X(.12), 660, X(.12), VY(1.25), 1, { strokeWidth: 3, strokeDasharray: '6 6', stroke: C.ok }) +
        H.ci(X(.12), VY(1.25), 10, { fill: C.ok, strokeWidth: 0 }));
      s += H.pill(X(.12) - 150, VY(1.25) - 40, 'v̄ = 1.25 m/s', { size: 24, scale: H.pop(T.mid) }) + H.pill(X(.12), 630, 't = 0.12 s', { size: 24, bg: C.ok, scale: H.pop(T.mid) });
    }
    if (H.on(T.g)) s += H.pill(X(.06) - 10, VY(0.62) - 40, 'gradient = g', { size: 24, bg: C.blue, scale: H.pop(T.g) });
  }
  return s;
};
