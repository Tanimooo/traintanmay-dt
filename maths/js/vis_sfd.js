/* More 2D visualisers: Further Statistics, Further Mechanics, Decision */
(function(){
'use strict';
const {makePlot, layout, slider, bindSlider, fx, compile} = window.PLOT;
const VIS = window.VIS;
const q = (r, s) => r.querySelector(s);
const icon = p => `<svg viewBox="0 0 40 40" fill="none" stroke="var(--brand)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const segBtns = (name, opts, cur) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([v, l]) => `<button data-${name}="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
function bindSeg(panel, name, fn){ panel.querySelectorAll(`[data-${name}]`).forEach(b => b.onclick = () => { panel.querySelectorAll(`[data-${name}]`).forEach(x => x.setAttribute('aria-pressed', x === b)); fn(b.dataset[name]); }); }
const table = (head, rows) => `<table style="width:100%;border-collapse:collapse;font-size:.8rem">${head ? `<tr>${head.map(h => `<th style="text-align:left;padding:2px 4px;border-bottom:1px solid var(--line)">${h}</th>`).join('')}</tr>` : ''}${rows.map(r => `<tr>${r.map(c => `<td style="padding:2px 4px">${c}</td>`).join('')}</tr>`).join('')}</table>`;

/* ---- special functions ---- */
function lgamma(z){ const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z); z -= 1; let x = c[0]; for (let i = 1; i < 9; i++) x += c[i] / (z + i); const t = z + 7.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x); }
function gammaP(a, x){ if (x <= 0) return 0; if (x < a + 1) { let s = 1 / a, t = s; for (let n = 1; n < 300; n++) { t *= x / (a + n); s += t; if (t < s * 1e-12) break; } return s * Math.exp(-x + a * Math.log(x) - lgamma(a)); }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let i = 1; i < 300; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-12) break; }
  return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h; }
const chiCdf = (x, k) => gammaP(k / 2, x / 2);
const chiPdf = (x, k) => x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - lgamma(k / 2));
function chiInv(p, k){ let lo = 0, hi = 200; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (chiCdf(m, k) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
function erf(x){ const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); }
const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
function zInv(p){ let lo = -10, hi = 10; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
function tInv(p, nu){ const z = zInv(p); return z + (z ** 3 + z) / (4 * nu) + (5 * z ** 5 + 16 * z ** 3 + 3 * z) / (96 * nu * nu) + (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / (384 * nu ** 3); }
const randn = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

/* =============================================================== chi-squared tests */
VIS.chisq = {
  name: 'χ² goodness-of-fit tests', group: 'Further Statistics',
  desc: 'Type observed frequencies, choose the model (uniform, binomial or Poisson), and see the (O − E)²/E table, the merged cells, the degrees of freedom and whether the result lands in the critical region.',
  topics: [['fs1', 'chi'], ['fs1', 'hyp']],
  icon: icon('<path d="M4 34h32"/><path d="M4 34C8 6 14 8 20 22s10 12 16 12" stroke="var(--accent)"/><path d="M26 30v4M30 32v2" stroke="var(--bad)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `<label class="field">Observed frequencies (comma separated, starting at x = 0 for binomial/Poisson)<input id="obs" value="12, 25, 30, 18, 10, 5" style="font-family:var(--f-mono)"></label>
      ${segBtns('mod', [['uni', 'Uniform'], ['bin', 'Binomial'], ['poi', 'Poisson']], 'poi')}
      <div class="row"><label class="tog"><input type="checkbox" id="est" checked>Estimate parameter from data</label></div>
      <div class="row"><label class="field">p (binomial)<input id="pp" type="number" value="0.4" step="0.05" style="width:90px"></label><label class="field">λ (Poisson)<input id="lam" type="number" value="2" step="0.1" style="width:90px"></label></div>
      ${segBtns('sig', [['0.1', '10%'], ['0.05', '5%'], ['0.01', '1%']], '0.05')}
      <div class="readout" id="out"></div>`, {hud: '', aspect: '16/10'});
    let mod = 'poi', sig = 0.05, res = null;
    const lfact = n => lgamma(n + 1);
    function calc(){ const O = q(panel, '#obs').value.split(/[ ,]+/).map(Number).filter(x => isFinite(x)); const k = O.length, N = O.reduce((a, b) => a + b, 0); if (k < 2 || !N) return null;
      let probs, est = q(panel, '#est').checked, par = null, lost = 1;
      const mean = O.reduce((s, o, i) => s + i * o, 0) / N;
      if (mod === 'uni') { probs = O.map(() => 1 / k); lost = 1; }
      else if (mod === 'bin') { const n = k - 1; const p = est ? mean / n : +q(panel, '#pp').value; par = 'p = ' + fx(p, 4); probs = O.map((_, x) => Math.exp(lfact(n) - lfact(x) - lfact(n - x) + x * Math.log(p) + (n - x) * Math.log(1 - p))); lost = est ? 2 : 1; }
      else { const l = est ? mean : +q(panel, '#lam').value; par = 'λ = ' + fx(l, 4); probs = O.map((_, x) => Math.exp(-l + x * Math.log(l) - lfact(x))); const tail = 1 - probs.slice(0, -1).reduce((a, b) => a + b, 0); probs[k - 1] = tail; lost = est ? 2 : 1; }
      let cells = O.map((o, i) => ({lab: (mod === 'poi' && i === k - 1) ? `≥${i}` : String(i), o, e: N * probs[i]}));
      // merge cells with E < 5 (from the ends inward)
      const merged = []; let cur = null;
      for (const c of cells) { cur = cur ? {lab: cur.lab.split('–')[0] + '–' + c.lab, o: cur.o + c.o, e: cur.e + c.e} : {...c}; if (cur.e >= 5) { merged.push(cur); cur = null; } }
      if (cur) { if (merged.length) { const l = merged.pop(); merged.push({lab: l.lab.split('–')[0] + '–' + cur.lab.split('–').pop(), o: l.o + cur.o, e: l.e + cur.e}); } else merged.push(cur); }
      const X2 = merged.reduce((s, c) => s + (c.o - c.e) ** 2 / c.e, 0), nu = merged.length - lost;
      return {O, N, merged, X2, nu, par, lost, crit: nu > 0 ? chiInv(1 - sig, nu) : NaN, pval: nu > 0 ? 1 - chiCdf(X2, nu) : NaN}; }
    const P = makePlot(stage, {span: 20, cx: 8, cy: 0.1, equal: false, yspan: 0.3, pan: false, zoom: false, xlabel: 'χ²', draw(ctx, P){ const C = P.C; if (!res || res.nu < 1) return; const k = res.nu;
      const pts = [[res.crit, 0]]; for (let x = res.crit; x < res.crit + 40; x += .1) pts.push([x, chiPdf(x, k)]); pts.push([res.crit + 40, 0]); P.poly(pts, 'color-mix(in srgb,' + C.bad + ' 30%,transparent)');
      P.fn(x => chiPdf(x, k), C.accent, 2.5, 0.01); P.line([[res.X2, 0], [res.X2, P.yspan * .8]], C.brand, 2.5); P.text('X² = ' + fx(res.X2, 3), res.X2, P.yspan * .8, C.brand, {align: 'center'}); P.text('critical ' + fx(res.crit, 3), res.crit, 0, C.bad, {dy: 16, base: 'top', align: 'center'}); }});
    function update(){ res = calc(); if (!res) { q(panel, '#out').textContent = 'Enter at least two frequencies.'; P.redraw(); return; }
      let mx = 0; for (let x = 0.2; x < 60; x += .2) mx = Math.max(mx, chiPdf(x, Math.max(1, res.nu))); P.yspan = Math.min(1.2, mx * 1.4); P.cy = P.yspan * .4; P.span = Math.max(12, res.crit * 1.8, res.X2 * 1.3); P.cx = P.span / 2 - 1; P.redraw();
      const rows = res.merged.map(c => [c.lab, c.o, fx(c.e, 3), fx((c.o - c.e) ** 2 / c.e, 4)]);
      q(panel, '#out').innerHTML = `H₀: the data fit the ${{uni: 'uniform', bin: 'binomial', poi: 'Poisson'}[mod]} model${res.par ? ' (' + res.par + ')' : ''}<br>${table(['x', 'O', 'E', '(O−E)²/E'], rows)}<br>Cells with E &lt; 5 are merged. ν = cells − ${res.lost} = <b>${res.nu}</b><br>X² = <b>${fx(res.X2, 4)}</b>, critical value χ²<sub>${res.nu}</sub>(${sig * 100}%) = ${fx(res.crit, 3)}<br>p-value ≈ ${fx(res.pval, 4)}<br><b>${res.X2 > res.crit ? 'Reject H₀' : 'Do not reject H₀'}</b>: ${res.X2 > res.crit ? 'evidence the model is not a good fit' : 'insufficient evidence that the model is a poor fit'}.`; }
    q(panel, '#obs').addEventListener('input', update); ['pp', 'lam'].forEach(id => q(panel, '#' + id).addEventListener('input', update)); q(panel, '#est').onchange = update;
    bindSeg(panel, 'mod', k => { mod = k; update(); }); bindSeg(panel, 'sig', k => { sig = +k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== central limit theorem */
VIS.clt = {
  name: 'Central limit theorem', group: 'Further Statistics',
  desc: 'Draw thousands of samples from a skewed or flat population and watch the distribution of the sample mean become normal, with variance σ²/n.',
  topics: [['fs1', 'clt'], ['fs2', 'combo'], ['fs2', 'estim']],
  icon: icon('<path d="M4 34h32"/><rect x="7" y="26" width="5" height="8" fill="var(--brand-soft)"/><rect x="13" y="16" width="5" height="18" fill="var(--brand-soft)"/><rect x="19" y="10" width="5" height="24" fill="var(--brand-soft)"/><rect x="25" y="18" width="5" height="16" fill="var(--brand-soft)"/><path d="M4 33c8 0 10-24 16-24s8 24 16 24" stroke="var(--accent)"/>'),
  mount(root){
    const POP = {uni: {n: 'Uniform U[0, 1]', mu: .5, v: 1 / 12, r: () => Math.random()}, exp: {n: 'Exponential (mean 1)', mu: 1, v: 1, r: () => -Math.log(1 - Math.random())},
      die: {n: 'Fair die', mu: 3.5, v: 35 / 12, r: () => 1 + Math.floor(Math.random() * 6)}, ber: {n: 'Bernoulli p = 0.2', mu: .2, v: .16, r: () => Math.random() < .2 ? 1 : 0},
      skew: {n: 'Skewed: X = 0, 1, 10 with P = 0.6, 0.3, 0.1', mu: 1.3, v: 0.6 * 1.69 + 0.3 * .09 + 0.1 * 75.69, r: () => { const u = Math.random(); return u < .6 ? 0 : u < .9 ? 1 : 10; }}};
    const {stage, panel} = layout(root, `<label class="field">Population<select class="sel" id="pop" style="display:block;width:100%">${Object.entries(POP).map(([k, o]) => `<option value="${k}">${o.n}</option>`).join('')}</select></label>
      ${slider('n', 'sample size n', 1, 100, 1, 5)}<div class="row"><button class="btn primary sm" id="go">Take 2,000 samples</button><button class="btn sm" id="clr">Clear</button></div>
      <div class="readout" id="out"></div><p class="note">X̄ ~ N(μ, σ²/n) approximately for large n, whatever the shape of the population.</p>`, {hud: '', aspect: '16/10'});
    let key = 'exp', means = [];
    const P = makePlot(stage, {span: 4, cx: 1, cy: 1, equal: false, yspan: 3, pan: false, zoom: false, draw(ctx, P){ const C = P.C, p = POP[key], n = +q(panel, '#n').value, sd = Math.sqrt(p.v / n);
      const lo = p.mu - 4.5 * sd, hi = p.mu + 4.5 * sd; P.cx = p.mu; P.span = hi - lo; const pk = 1 / (sd * Math.sqrt(2 * Math.PI)); P.yspan = pk * 1.6; P.cy = pk * .6;
      if (means.length) { const B = 40, w = (hi - lo) / B, cnt = new Array(B).fill(0); means.forEach(m => { const i = Math.floor((m - lo) / w); if (i >= 0 && i < B) cnt[i]++; });
        cnt.forEach((c, i) => { const h = c / (means.length * w); P.poly([[lo + i * w, 0], [lo + (i + 1) * w, 0], [lo + (i + 1) * w, h], [lo + i * w, h]], C.soft, C.brand, 1); }); }
      P.fn(x => Math.exp(-((x - p.mu) ** 2) / (2 * sd * sd)) * pk, C.accent, 2.5); }});
    function update(){ P.redraw(); const p = POP[key], n = +q(panel, '#n').value, m = means.length ? means.reduce((a, b) => a + b, 0) / means.length : null, s2 = means.length > 1 ? means.reduce((a, b) => a + (b - m) ** 2, 0) / (means.length - 1) : null;
      q(panel, '#out').innerHTML = `Population: μ = ${fx(p.mu, 4)}, σ² = ${fx(p.v, 4)}<br>Theory: X̄ ~ N(${fx(p.mu, 4)}, ${fx(p.v / n, 5)})<br>${means.length ? `Simulated ${means.length} means: mean ${fx(m, 4)}, variance ${fx(s2, 5)}` : 'Press the button to simulate.'}`; }
    q(panel, '#go').onclick = () => { const p = POP[key], n = +q(panel, '#n').value; for (let i = 0; i < 2000; i++) { let s = 0; for (let j = 0; j < n; j++) s += p.r(); means.push(s / n); } update(); };
    q(panel, '#clr').onclick = () => { means = []; update(); };
    q(panel, '#pop').onchange = e => { key = e.target.value; means = []; update(); }; bindSlider(panel, 'n', () => { means = []; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== continuous random variables */
VIS.contdist = {
  name: 'Continuous random variables', group: 'Further Statistics',
  desc: 'Enter a probability density function f(x) on [a, b]. Check it integrates to 1, see the CDF, mean, variance, median and mode, and shade P(c < X < d).',
  topics: [['fs2', 'cont']],
  icon: icon('<path d="M4 34h32"/><path d="M6 34C10 34 12 8 20 8s12 26 14 26" stroke="var(--accent)"/><path d="M16 34V12c2-3 6-3 8 0v22z" fill="var(--brand-soft)" stroke="none"/>'),
  mount(root){
    const PRE = [['3x^2/8', 0, 2, 'k x²'], ['x/2', 0, 2, 'linear'], ['1/4', 1, 5, 'uniform U[1, 5]'], ['2e^(-2x)', 0, 6, 'exponential λ = 2'], ['3/4(1-(x-1)^2)', 0, 2, 'parabolic']];
    const {stage, panel} = layout(root, `<label class="field">f(x)<input id="f" value="3x^2/8" style="font-family:var(--f-mono)"></label><div class="presets">${PRE.map((p, i) => `<button class="btn sm" data-i="${i}">${p[3]}</button>`).join('')}</div>
      <div class="row"><label class="field">a<input id="a" type="number" value="0" step="0.5" style="width:70px"></label><label class="field">b<input id="b" type="number" value="2" step="0.5" style="width:70px"></label></div>
      ${slider('c', 'c', 0, 1, 0.01, 0.25, v => Math.round(v * 100) + '%')}${slider('d', 'd', 0, 1, 0.01, 0.75, v => Math.round(v * 100) + '%')}
      <label class="tog"><input type="checkbox" id="cdf" checked>Show the CDF F(x)</label><div class="readout" id="out"></div>`);
    let f = compile('3x^2/8'); const g = id => parseFloat(q(panel, '#' + id).value);
    const integ = (h, a, b, n = 2000) => { const w = (b - a) / n; let s = h(a) + h(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * h(a + i * w); return s * w / 3; };
    const at = id => g('a') + (+q(panel, '#' + id).value) * (g('b') - g('a'));
    const P = makePlot(stage, {span: 5, cx: 1, cy: .5, draw(ctx, P){ const C = P.C, a = g('a'), b = g('b'), c = at('c'), d = at('d');
      const pts = [[Math.min(c, d), 0]]; for (let i = 0; i <= 100; i++) { const x = Math.min(c, d) + Math.abs(d - c) * i / 100; pts.push([x, f(x)]); } pts.push([Math.max(c, d), 0]); P.poly(pts, 'color-mix(in srgb,' + C.brand + ' 28%,transparent)');
      P.fn(f, C.accent, 3, a, b); P.line([[P.bounds().x0, 0], [a, 0]], C.accent, 3); P.line([[b, 0], [P.bounds().x1, 0]], C.accent, 3);
      if (q(panel, '#cdf').checked) { const cp = []; for (let i = 0; i <= 80; i++) { const x = a + (b - a) * i / 80; cp.push([x, integ(f, a, x, 200)]); } P.line([[P.bounds().x0, 0], [a, 0]], C.blue, 2, [5, 4]); P.line(cp, C.blue, 2, [5, 4]); P.line([[b, cp[cp.length - 1][1]], [P.bounds().x1, cp[cp.length - 1][1]]], C.blue, 2, [5, 4]); } }});
    function update(){ const a = g('a'), b = g('b'); if (!(b > a)) { q(panel, '#out').textContent = 'Need b > a'; return; } P.cx = (a + b) / 2; P.span = (b - a) * 1.8; P.redraw();
      const tot = integ(f, a, b), mu = integ(x => x * f(x), a, b), ex2 = integ(x => x * x * f(x), a, b);
      let lo = a, hi = b; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (integ(f, a, m, 400) < tot / 2) lo = m; else hi = m; }
      let mode = a, best = -Infinity; for (let i = 0; i <= 400; i++) { const x = a + (b - a) * i / 400, y = f(x); if (y > best) { best = y; mode = x; } }
      const c = at('c'), d = at('d'); let neg = false; for (let i = 0; i <= 100; i++) if (f(a + (b - a) * i / 100) < -1e-9) neg = true;
      q(panel, '#out').innerHTML = `∫ f(x) dx over [${fx(a)}, ${fx(b)}] = <b>${fx(tot, 5)}</b> ${Math.abs(tot - 1) < 1e-3 && !neg ? '✓ valid pdf' : '✗ not a valid pdf' + (neg ? ' (f < 0 somewhere)' : '')}<br>E(X) = ∫x f(x) dx = ${fx(mu, 4)}<br>Var(X) = E(X²) − E(X)² = ${fx(ex2 - mu * mu, 4)}<br>Median m: F(m) = 0.5 → m = ${fx((lo + hi) / 2, 4)}<br>Mode ≈ ${fx(mode, 4)}<br>P(${fx(Math.min(c, d), 3)} < X < ${fx(Math.max(c, d), 3)}) = <b>${fx(integ(f, Math.min(c, d), Math.max(c, d)), 4)}</b>`; }
    q(panel, '#f').addEventListener('input', e => { try { f = compile(e.target.value); e.target.style.borderColor = ''; update(); } catch(er) { e.target.style.borderColor = 'var(--bad)'; } });
    ['a', 'b'].forEach(id => q(panel, '#' + id).addEventListener('input', update)); ['c', 'd'].forEach(id => bindSlider(panel, id, update, v => Math.round(v * 100) + '%')); q(panel, '#cdf').onchange = update;
    panel.querySelectorAll('[data-i]').forEach(bt => bt.onclick = () => { const p = PRE[+bt.dataset.i]; q(panel, '#f').value = p[0]; f = compile(p[0]); q(panel, '#a').value = p[1]; q(panel, '#b').value = p[2]; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== confidence intervals */
VIS.ci = {
  name: 'Confidence intervals', group: 'Further Statistics',
  desc: 'Simulate 50 samples and their confidence intervals for μ. About the stated percentage capture the true mean. Switch between σ known (z) and σ unknown (t-distribution).',
  topics: [['fs2', 'estim'], ['fs2', 'tdist']],
  icon: icon('<path d="M20 4v32" stroke="var(--accent)" stroke-dasharray="3 2"/><path d="M8 8h18M12 14h16M6 20h12M14 26h18M10 32h16" stroke="var(--brand)"/><path d="M6 20h12" stroke="var(--bad)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('mu', 'true μ', 0, 100, 1, 50)}${slider('sd', 'σ', 1, 30, 1, 10)}${slider('n', 'sample size n', 2, 60, 1, 8)}
      ${segBtns('cl', [['0.9', '90%'], ['0.95', '95%'], ['0.99', '99%']], '0.95')}${segBtns('k', [['z', 'σ known (z)'], ['t', 'σ unknown (t)']], 't')}
      <div class="row"><button class="btn primary sm" id="go">New 50 samples</button></div><div class="readout" id="out"></div>`, {hud: '', aspect: '4/5'});
    let cl = .95, kind = 't', ints = [];
    const v = id => +q(panel, '#' + id).value;
    function sim(){ const mu = v('mu'), sd = v('sd'), n = v('n'); ints = [];
      const crit = kind === 'z' ? zInv(1 - (1 - cl) / 2) : tInv(1 - (1 - cl) / 2, n - 1);
      for (let i = 0; i < 50; i++) { const xs = [...Array(n)].map(() => mu + sd * randn()); const m = xs.reduce((a, b) => a + b, 0) / n; const s = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)); const e = crit * (kind === 'z' ? sd : s) / Math.sqrt(n); ints.push([m - e, m + e, m]); }
      return crit; }
    let crit = 0;
    const P = makePlot(stage, {span: 80, cx: 50, cy: 25, equal: false, yspan: 54, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, mu = v('mu'); P.cx = mu; P.span = Math.max(20, v('sd') * 6);
      P.line([[mu, -2], [mu, 52]], C.accent, 2, [6, 4]);
      ints.forEach(([a, b, m], i) => { const hit = a <= mu && mu <= b; P.line([[a, i + 1], [b, i + 1]], hit ? C.brand : C.bad, 2.5); P.dot(m, i + 1, 2.5, hit ? C.brand : C.bad); }); }});
    function update(){ crit = sim(); P.redraw(); const hit = ints.filter(([a, b]) => a <= v('mu') && v('mu') <= b).length;
      q(panel, '#out').innerHTML = `Interval: x̄ ± ${kind === 'z' ? 'z' : 't<sub>' + (v('n') - 1) + '</sub>'} × ${kind === 'z' ? 'σ' : 's'}/√n<br>Critical value = ${fx(crit, 4)}${kind === 't' ? ` (z would be ${fx(zInv(1 - (1 - cl) / 2), 4)})` : ''}<br><b>${hit}/50</b> intervals contain μ (expected ≈ ${fx(50 * cl, 1)})<br><span style="color:var(--bad)">red</span> = misses μ`; }
    ['mu', 'sd', 'n'].forEach(id => bindSlider(panel, id, update)); bindSeg(panel, 'cl', k => { cl = +k; update(); }); bindSeg(panel, 'k', k => { kind = k; update(); });
    q(panel, '#go').onclick = update; update(); return () => P.destroy();
  }
};

/* =============================================================== regression & correlation */
VIS.regression = {
  name: 'Regression, residuals & correlation', group: 'Further Statistics',
  desc: 'Drag data points to see the least-squares regression line of y on x, the residuals, the PMCC r and Spearman’s rank correlation coefficient.',
  topics: [['fs2', 'linreg'], ['fs2', 'corr'], ['stats', 'data']],
  icon: icon('<path d="M4 34h32M4 34V4"/><path d="M6 30L34 10" stroke="var(--accent)"/><circle cx="10" cy="24" r="2" fill="var(--brand)"/><circle cx="16" cy="25" r="2" fill="var(--brand)"/><circle cx="22" cy="17" r="2" fill="var(--brand)"/><circle cx="29" cy="14" r="2" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `<div class="row" style="gap:12px"><label class="tog"><input type="checkbox" id="res" checked>Residuals</label><label class="tog"><input type="checkbox" id="xy">x on y line too</label></div>
      <div class="row"><button class="btn sm" id="rnd">Random data</button><button class="btn sm" id="add">Add point</button><button class="btn sm" id="rem">Remove point</button></div>
      <div class="readout" id="out"></div><p class="note">Drag the points. Least squares minimises the sum of squared residuals (vertical distances).</p>`, {hud: 'Drag points'});
    let pts = [[1, 2.2], [2, 2.9], [3, 4.1], [4, 4.4], [5, 5.8], [6, 6.1], [7, 7.6], [8, 7.9]], drag = -1;
    const stats = () => { const n = pts.length, sx = pts.reduce((a, p) => a + p[0], 0), sy = pts.reduce((a, p) => a + p[1], 0), Sxx = pts.reduce((a, p) => a + p[0] ** 2, 0) - sx * sx / n, Syy = pts.reduce((a, p) => a + p[1] ** 2, 0) - sy * sy / n, Sxy = pts.reduce((a, p) => a + p[0] * p[1], 0) - sx * sy / n;
      const b = Sxy / Sxx, a = sy / n - b * sx / n; return {n, Sxx, Syy, Sxy, b, a, r: Sxy / Math.sqrt(Sxx * Syy), mx: sx / n, my: sy / n}; };
    const rank = arr => { const s = arr.map((v, i) => [v, i]).sort((p, q2) => p[0] - q2[0]); const r = new Array(arr.length); for (let i = 0; i < s.length;) { let j = i; while (j + 1 < s.length && s[j + 1][0] === s[i][0]) j++; for (let k = i; k <= j; k++) r[s[k][1]] = (i + j) / 2 + 1; i = j + 1; } return r; };
    const P = makePlot(stage, {span: 12, cx: 4.5, cy: 4.5, draw(ctx, P){ const C = P.C, s = stats();
      if (q(panel, '#res').checked) pts.forEach(([x, y]) => P.line([[x, y], [x, s.a + s.b * x]], C.bad, 1.5, [3, 3]));
      P.fn(x => s.a + s.b * x, C.accent, 2.5); if (q(panel, '#xy').checked) { const b2 = s.Sxy / s.Syy; P.fn(x => s.my + (x - s.mx) / b2, C.blue, 2, undefined, undefined); }
      P.dot(s.mx, s.my, 5, C.warn); pts.forEach(p => P.dot(p[0], p[1], 7, C.brand, C.bg)); },
      onDown(w){ drag = pts.findIndex(p => Math.hypot(p[0] - w[0], p[1] - w[1]) < 14 / P.scale()); return drag >= 0; }, onMove(w){ pts[drag] = [Math.round(w[0] * 10) / 10, Math.round(w[1] * 10) / 10]; update(); }, onUp(){ drag = -1; }});
    function update(){ P.redraw(); const s = stats(), rx = rank(pts.map(p => p[0])), ry = rank(pts.map(p => p[1])), d2 = rx.reduce((a, r, i) => a + (r - ry[i]) ** 2, 0), rs = 1 - 6 * d2 / (s.n * (s.n * s.n - 1));
      const rss = pts.reduce((a, [x, y]) => a + (y - s.a - s.b * x) ** 2, 0);
      q(panel, '#out').innerHTML = `n = ${s.n}, S<sub>xx</sub> = ${fx(s.Sxx, 3)}, S<sub>yy</sub> = ${fx(s.Syy, 3)}, S<sub>xy</sub> = ${fx(s.Sxy, 3)}<br>y = a + bx: b = S<sub>xy</sub>/S<sub>xx</sub> = <b>${fx(s.b, 4)}</b>, a = ȳ − bx̄ = <b>${fx(s.a, 4)}</b><br>Line passes through (x̄, ȳ) = (${fx(s.mx, 3)}, ${fx(s.my, 3)})<br>Residual sum of squares = ${fx(rss, 4)}<br>PMCC r = <b>${fx(s.r, 4)}</b><br>Spearman r<sub>s</sub> = 1 − 6Σd²/(n(n² − 1)) = <b>${fx(rs, 4)}</b>`; }
    ['res', 'xy'].forEach(id => q(panel, '#' + id).onchange = update);
    q(panel, '#rnd').onclick = () => { const b = Math.random() * 2 - .5; pts = [...Array(8)].map((_, i) => [i + 1, Math.round((2 + b * (i + 1) + randn() * 1.2) * 10) / 10]); update(); };
    q(panel, '#add').onclick = () => { pts.push([Math.round(Math.random() * 80) / 10 + 1, Math.round(Math.random() * 80) / 10 + 1]); update(); };
    q(panel, '#rem').onclick = () => { if (pts.length > 3) pts.pop(); update(); };
    update(); return () => P.destroy();
  }
};

/* =============================================================== elastic strings & springs */
VIS.spring = {
  name: 'Elastic strings & springs: energy', group: 'Further Mechanics',
  desc: 'A particle hangs on an elastic string or spring. Pull it down and let go: watch kinetic, gravitational and elastic potential energy trade off, and the string go slack.',
  topics: [['fm1', 'elastic'], ['fm1', 'wep']],
  icon: icon('<path d="M10 4h20"/><path d="M20 4v4l-5 2 10 3-10 3 10 3-10 3 5 2v3" stroke="var(--accent)"/><circle cx="20" cy="32" r="4" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${segBtns('k', [['str', 'Elastic string'], ['spr', 'Spring']], 'str')}
      ${slider('l', 'natural length l (m)', 0.5, 3, 0.1, 1.5)}${slider('lam', 'modulus λ (N)', 5, 200, 1, 40)}${slider('m', 'mass m (kg)', 0.1, 5, 0.1, 1)}${slider('d', 'pull down below equilibrium (m)', 0, 3, 0.05, 1.2)}
      <div class="row"><button class="btn primary sm" id="go">Release</button></div><div class="readout" id="out"></div>
      <p class="note">Hooke: T = λx/l. Elastic PE = λx²/(2l). A string only pulls (slack when x ≤ 0); a spring can push.</p>`, {hud: '', aspect: '1/1'});
    let kind = 'str', st = null, raf; const g = 9.8, v = id => +q(panel, '#' + id).value;
    const eqx = () => v('m') * g * v('l') / v('lam');
    const fit = () => { const Lt = v('l') + eqx() + v('d'); P.span = (Lt + 1) * 1.3; P.cy = -Lt / 2 - .1; P.cx = P.span * .25; };
    const P = makePlot(stage, {span: 8, cx: 1.5, cy: -2.6, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, l = v('l'), S = P.span, ft = '12px IBM Plex Sans, sans-serif';
      const y = st ? st.y : -(l + eqx() + v('d')), B = P.bounds(), H = B.y1 - B.y0;
      P.line([[-.12 * S, 0], [.12 * S, 0]], C.ink2, 4);
      P.line([[-.2 * S, -l], [.2 * S, -l]], C.muted, 1, [3, 3]); P.text('natural length', -.2 * S, -l, C.muted, {base: 'bottom', dy: -2, font: ft});
      P.line([[-.2 * S, -(l + eqx())], [.2 * S, -(l + eqx())]], C.good, 1, [3, 3]); P.text('equilibrium', -.2 * S, -(l + eqx()), C.good, {base: 'top', dy: 2, font: ft});
      const ext = -y - l, slack = kind === 'str' && ext < 0, coils = 16, wd = .03 * S, pts = [[0, 0]];
      if (slack) pts.push([wd * 2, y / 3], [-wd * 2, 2 * y / 3], [0, y]); else { for (let i = 1; i < coils; i++) pts.push([(i % 2 ? wd : -wd), y * i / coils]); pts.push([0, y]); }
      P.line(pts, slack ? C.muted : C.accent, 2.5); P.dot(0, y, 13, C.brand, C.bg);
      const E = energies(y), tot = E.ke + E.gpe + E.epe, base = B.y0 + H * .1, sc = H * .55 / Math.max(1e-9, tot), bw = .07 * S, bx = .32 * S;
      P.text('Energy (J)', bx, base + H * .62, C.ink2, {font: '600 13px IBM Plex Sans, sans-serif'});
      [['KE', E.ke, C.warn], ['GPE', E.gpe, C.blue], ['EPE', E.epe, C.accent], ['Total', tot, C.ink2]].forEach(([n, val, col], i) => { const x = bx + i * bw * 1.4; P.poly([[x, base], [x + bw, base], [x + bw, base + val * sc], [x, base + val * sc]], col); P.text(n, x + bw / 2, base, C.ink2, {align: 'center', base: 'top', dy: 4, font: ft}); P.text(fx(val, 1), x + bw / 2, base + val * sc, C.ink2, {align: 'center', dy: -3, font: '11px IBM Plex Mono, monospace'}); }); }});
    function energies(y){ const l = v('l'), lam = v('lam'), m = v('m'), ext = -y - l, x = kind === 'str' ? Math.max(0, ext) : ext;
      const y0 = -(l + eqx() + v('d')); const epe = lam * x * x / (2 * l), gpe = m * g * (y - y0), E0 = lam * Math.pow(kind === 'str' ? Math.max(0, -y0 - l) : -y0 - l, 2) / (2 * l);
      return {ke: Math.max(0, E0 - epe - gpe), gpe, epe}; }
    function analysis(){ const l = v('l'), lam = v('lam'), m = v('m'), d = v('d'), e = eqx(), k = lam / l, w = Math.sqrt(k / m);
      const slackTop = kind === 'str' && d > e;
      q(panel, '#out').innerHTML = `Equilibrium extension e = mgl/λ = <b>${fx(e, 4)} m</b><br>Stiffness λ/l = ${fx(k, 3)} N m⁻¹<br>While taut, the motion is SHM with ω = √(λ/(ml)) = ${fx(w, 3)} s⁻¹, period ${fx(2 * Math.PI / w, 3)} s<br>Max speed (at equilibrium) = ${fx(Math.min(d, kind === 'str' ? Infinity : Infinity) * w, 3)} m s⁻¹${slackTop ? `<br><b>String goes slack</b> (amplitude ${fx(d, 3)} > e) – then it moves freely under gravity.` : ''}${st ? `<br><br>Now: speed ${fx(Math.abs(st.v), 3)} m s⁻¹, extension ${fx(-st.y - l, 3)} m` : ''}`; }
    function run(){ cancelAnimationFrame(raf); const l = v('l'), lam = v('lam'), m = v('m'); let y = -(l + eqx() + v('d')), vel = 0, t = 0, last = performance.now();
      const step = now => { const dt = Math.min(.03, (now - last) / 1000); last = now; for (let i = 0; i < 30; i++) { const h = dt / 30, ext = -y - l, T = kind === 'str' ? (ext > 0 ? lam * ext / l : 0) : lam * ext / l, a = T / m - g; vel += a * h; y += vel * h; t += h; } st = {y, v: vel}; P.redraw(); analysis(); if (t < 15) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
    bindSeg(panel, 'k', k => { kind = k; cancelAnimationFrame(raf); st = null; P.redraw(); analysis(); });
    ['l', 'lam', 'm', 'd'].forEach(id => bindSlider(panel, id, () => { cancelAnimationFrame(raf); st = null; fit(); P.redraw(); analysis(); }));
    q(panel, '#go').onclick = run; fit(); P.redraw(); analysis(); return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== power & resistance */
VIS.power = {
  name: 'Power, driving force & top speed', group: 'Further Mechanics',
  desc: 'A vehicle working at constant power P against resistance. Driving force = P/v, so acceleration falls as speed rises – watch the speed–time graph level off at the maximum speed.',
  topics: [['fm1', 'wep']],
  icon: icon('<path d="M4 34h32M4 34V4"/><path d="M4 34C10 14 18 10 34 9" stroke="var(--accent)"/><path d="M4 9h32" stroke="var(--bad)" stroke-dasharray="3 2"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('P', 'power P (kW)', 5, 150, 1, 30)}${slider('m', 'mass m (kg)', 200, 3000, 50, 1200)}${slider('R', 'resistance (N)', 100, 3000, 10, 800)}${slider('al', 'slope sin α', -0.1, 0.2, 0.01, 0)}
      ${segBtns('rk', [['c', 'Constant resistance'], ['kv', 'Resistance ∝ v']], 'c')}${slider('v', 'speed v (m s⁻¹)', 1, 80, 0.5, 15)}
      <div class="readout" id="out"></div>`, {aspect: '16/10'});
    let rk = 'c'; const g = 9.8, v = id => +q(panel, '#' + id).value;
    const res = s => rk === 'c' ? v('R') : v('R') * s / 20; // R is resistance at 20 m/s in proportional mode
    const accel = s => (v('P') * 1000 / s - res(s) - v('m') * g * v('al')) / v('m');
    function vmax(){ let lo = 0.01, hi = 500; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (accel(mid) > 0) lo = mid; else hi = mid; } return lo; }
    const P = makePlot(stage, {span: 80, cx: 36, cy: 20, equal: false, yspan: 50, xlabel: 't (s)', ylabel: 'v (m s⁻¹)', draw(ctx, P){ const C = P.C, V = vmax();
      P.cy = V * .55; P.yspan = V * 1.35;
      let s = 1, t = 0; const pts = [[0, s]]; for (let i = 0; i < 4000; i++) { s += accel(s) * .05; t += .05; if (i % 10 === 9) pts.push([t, s]); }
      P.span = Math.min(400, Math.max(30, pts.find(p => p[1] > .98 * V)?.[0] * 1.6 || 200)); P.cx = P.span / 2 - 2;
      P.line([[0, V], [1000, V]], C.bad, 1.5, [6, 4]); P.text('v_max = ' + fx(V, 2), P.span * .7, V, C.bad, {dy: -4}); P.line(pts, C.accent, 3);
      const tv = pts.find(p => p[1] >= v('v')); if (tv) P.dot(tv[0], tv[1], 6, C.brand, C.bg); }});
    function update(){ P.redraw(); const s = v('v'), D = v('P') * 1000 / s, V = vmax();
      q(panel, '#out').innerHTML = `Driving force D = P/v = ${fx(v('P') * 1000, 0)}/${fx(s)} = <b>${fx(D, 1)} N</b><br>Resistance = ${fx(res(s), 1)} N${v('al') ? `, weight component = ${fx(v('m') * g * v('al'), 1)} N` : ''}<br>Newton II: a = (D − R${v('al') ? ' − mg sin α' : ''})/m = <b>${fx(accel(s), 4)} m s⁻²</b><br>Max speed when a = 0: D = R${v('al') ? ' + mg sin α' : ''} → <b>v<sub>max</sub> = ${fx(V, 3)} m s⁻¹</b>${rk === 'kv' ? '<br>(resistance shown is its value at 20 m s⁻¹)' : ''}`; }
    ['P', 'm', 'R', 'al', 'v'].forEach(id => bindSlider(panel, id, update)); bindSeg(panel, 'rk', k => { rk = k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== horizontal circles */
VIS.conical = {
  name: 'Conical pendulum & banked tracks', group: 'Further Mechanics',
  desc: 'Horizontal circular motion: a conical pendulum (find the angle from ω), and a car on a banked track (find the speed range so it neither slides up nor down).',
  topics: [['fm2', 'circ']],
  icon: icon('<path d="M20 4L10 30M20 4l10 26"/><ellipse cx="20" cy="30" rx="10" ry="3" stroke="var(--accent)"/><circle cx="30" cy="30" r="2.5" fill="var(--brand)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${segBtns('mo', [['cp', 'Conical pendulum'], ['bank', 'Banked track']], 'cp')}
      <div id="cpP">${slider('L', 'string length l (m)', 0.2, 3, 0.05, 1)}${slider('w', 'angular speed ω (rad s⁻¹)', 1, 12, 0.05, 4.5)}${slider('m', 'mass (kg)', 0.1, 5, 0.1, 0.5)}</div>
      <div id="bkP" hidden>${slider('th', 'bank angle θ (°)', 0, 45, 1, 20)}${slider('r', 'radius r (m)', 10, 200, 5, 60)}${slider('mu', 'μ', 0, 0.8, 0.01, 0.3)}${slider('v', 'speed v (m s⁻¹)', 0, 50, 0.5, 18)}</div>
      <div class="readout" id="out"></div>`, {hud: '', aspect: '4/3'});
    let mo = 'cp', ang = 0, raf; const g = 9.8, v = id => +q(panel, '#' + id).value;
    const P = makePlot(stage, {span: 8, cy: -1.2, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C;
      if (mo === 'cp') { const L = v('L'), w = v('w'), c = g / (L * w * w); const th = c >= 1 ? 0 : Math.acos(c), r = L * Math.sin(th), h = L * Math.cos(th), s = 3 / L;
        P.line([[-1.5, 0], [1.5, 0]], C.ink2, 4); const x = r * s * Math.cos(ang), depth = Math.sin(ang);
        ctx.strokeStyle = C.muted; ctx.setLineDash([4, 4]); const [ex, ey] = P.toS(0, -h * s); ctx.beginPath(); ctx.ellipse(ex, ey, r * s * P.scale(), r * s * P.scale() * .25, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        P.line([[0, 0], [0, -h * s]], C.muted, 1, [3, 3]); P.line([[0, 0], [x, -h * s + depth * r * s * .25]], C.ink2, 2);
        P.dot(x, -h * s + depth * r * s * .25, 9, C.brand, C.bg); P.text('θ', .15, -.6, C.warn); }
      else { const th = v('th') * Math.PI / 180; P.poly([[-4, -3], [4, -3], [4, -3 + 8 * Math.tan(th)]], C.soft, C.brand, 2);
        const cx = 0.5, cy = -3 + 4.5 * Math.tan(th); const u = [Math.cos(th), Math.sin(th)], n = [-Math.sin(th), Math.cos(th)];
        const car = [[-.6, 0], [.6, 0], [.6, .5], [-.6, .5]].map(([a, b]) => [cx + u[0] * a + n[0] * b, cy + u[1] * a + n[1] * b]); P.poly(car, C.accSoft, C.accent, 2);
        const s = solveBank(), sc = .25; const c0 = [cx + n[0] * .25, cy + n[1] * .25];
        P.arrow(c0[0], c0[1], c0[0], c0[1] - g * sc, C.warn, 2); P.arrow(c0[0], c0[1], c0[0] + n[0] * s.R * sc, c0[1] + n[1] * s.R * sc, C.blue, 2);
        if (Math.abs(s.F) > 1e-3) P.arrow(c0[0], c0[1], c0[0] + u[0] * s.F * sc, c0[1] + u[1] * s.F * sc, C.bad, 2);
        P.arrow(c0[0] + 1.2, c0[1] - 1.8, c0[0] - 1.2, c0[1] - 1.8, C.ink2, 1.5); P.text('towards centre', c0[0], c0[1] - 1.8, C.ink2, {align: 'center', base: 'top', dy: 4, font: '11px IBM Plex Sans, sans-serif'}); } }});
    function solveBank(){ const th = v('th') * Math.PI / 180, r = v('r'), mu = v('mu'), V = v('v'), a = V * V / r; // per unit mass
      // R sinθ + F cosθ = a (towards centre, F up the slope positive → its horizontal component is towards… F along slope upward has horizontal component −cos away? use F down-slope positive toward centre)
      const R = g * Math.cos(th) + a * Math.sin(th), F = a * Math.cos(th) - g * Math.sin(th); // F > 0 means friction acts down the slope
      return {R, F: -F, need: F, lim: mu * R, th, r, mu, V}; }
    function update(){ P.redraw(); let o;
      if (mo === 'cp') { const L = v('L'), w = v('w'), m = v('m'), c = g / (L * w * w);
        o = c >= 1 ? `ω² ≤ g/l = ${fx(g / L, 3)}: the string cannot rise from the vertical (needs ω > ${fx(Math.sqrt(g / L), 3)})` : `Resolve ↑: T cos θ = mg; towards centre: T sin θ = m(l sin θ)ω²<br>⇒ T = mlω² = <b>${fx(m * L * w * w, 3)} N</b><br>cos θ = g/(lω²) = ${fx(c, 4)} → θ = <b>${fx(Math.acos(c) * 180 / Math.PI, 2)}°</b><br>Radius = l sin θ = ${fx(L * Math.sin(Math.acos(c)), 3)} m, depth below O = g/ω² = ${fx(g / w / w, 3)} m`; }
      else { const s = solveBank(), t = Math.tan(s.th), vmin2 = s.r * g * (t - s.mu) / (1 + s.mu * t), vmax2 = s.mu * t >= 1 ? Infinity : s.r * g * (t + s.mu) / (1 - s.mu * t);
        const ok = Math.abs(s.need) <= s.lim + 1e-9;
        o = `No friction needed at v = √(rg tan θ) = <b>${fx(Math.sqrt(s.r * g * t), 3)} m s⁻¹</b><br>Safe speeds: ${vmin2 > 0 ? fx(Math.sqrt(vmin2), 3) : '0'} ≤ v ≤ ${isFinite(vmax2) ? fx(Math.sqrt(vmax2), 3) : '∞'} m s⁻¹<br>At v = ${fx(s.V)}: friction needed ${fx(Math.abs(s.need), 3)} N/kg ${s.need > 0 ? 'down' : 'up'} the slope, limit μR = ${fx(s.lim, 3)} N/kg<br><b>${ok ? 'Car holds the track' : s.need > 0 ? 'Car slides up the bank' : 'Car slides down the bank'}</b>`; }
      q(panel, '#out').innerHTML = o; }
    bindSeg(panel, 'mo', k => { mo = k; q(panel, '#cpP').hidden = k !== 'cp'; q(panel, '#bkP').hidden = k === 'cp'; update(); });
    ['L', 'w', 'm', 'th', 'r', 'mu', 'v'].forEach(id => bindSlider(panel, id, update));
    const spin = () => { ang += .03 * v('w') / 3; if (mo === 'cp') P.redraw(); raf = requestAnimationFrame(spin); }; raf = requestAnimationFrame(spin);
    update(); return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};

/* =============================================================== graph algorithms */
VIS.graphalgo = {
  name: 'Network algorithms', group: 'Decision',
  desc: 'Step through Kruskal’s and Prim’s algorithms for a minimum spanning tree, Dijkstra’s shortest path, and the route inspection (Chinese postman) problem on a network.',
  topics: [['d1', 'algraph'], ['d1', 'graphs'], ['d1', 'route']],
  icon: icon('<circle cx="8" cy="10" r="3"/><circle cx="32" cy="8" r="3"/><circle cx="12" cy="32" r="3"/><circle cx="30" cy="30" r="3"/><path d="M10 12l2 17M11 10l18-2M14 31l13-1" stroke="var(--accent)"/><path d="M31 11v16" stroke="var(--line-strong)"/>'),
  mount(root){
    const N = [['A', 0, 4], ['B', 3, 6], ['C', 3, 2], ['D', 6, 7], ['E', 6, 4], ['F', 6, 1], ['G', 9, 5], ['H', 10, 1.5]];
    const E0 = [[0, 1, 7], [0, 2, 5], [1, 2, 4], [1, 3, 8], [1, 4, 6], [2, 4, 9], [2, 5, 6], [3, 4, 5], [3, 6, 7], [4, 6, 3], [4, 5, 8], [5, 7, 7], [6, 7, 9], [4, 7, 11]];
    const {stage, panel} = layout(root, `${segBtns('al', [['k', 'Kruskal'], ['p', 'Prim'], ['d', 'Dijkstra'], ['r', 'Route inspection']], 'k')}
      <div class="row"><button class="btn primary sm" id="step">Step</button><button class="btn sm" id="all">Finish</button><button class="btn sm" id="reset">Reset</button><button class="btn sm" id="rnd">New weights</button></div>
      <div class="readout" id="out"></div>`, {hud: '', aspect: '16/10'});
    let E = E0.map(e => e.slice()), al = 'k', k = 0, steps = [];
    function kruskal(){ const par = N.map((_, i) => i), f = x => par[x] === x ? x : (par[x] = f(par[x])); const S = []; E.map((e, i) => [e, i]).sort((a, b) => a[0][2] - b[0][2]).forEach(([e, i]) => { const a = f(e[0]), b = f(e[1]); if (a !== b) { par[a] = b; S.push({e: i, ok: true}); } else S.push({e: i, ok: false}); }); return S; }
    function prim(){ const inT = [0], S = []; while (inT.length < N.length) { let best = null; E.forEach((e, i) => { const a = inT.includes(e[0]), b = inT.includes(e[1]); if (a !== b && (!best || e[2] < E[best][2])) best = i; }); if (best == null) break; const e = E[best]; inT.push(inT.includes(e[0]) ? e[1] : e[0]); S.push({e: best, ok: true, v: inT[inT.length - 1]}); } return S; }
    function dijkstra(){ const n = N.length, d = new Array(n).fill(Infinity), done = new Array(n).fill(false), prev = new Array(n).fill(-1), S = []; d[0] = 0; let order = 0;
      for (let it = 0; it < n; it++) { let u = -1; for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || d[i] < d[u])) u = i; if (d[u] === Infinity) break; done[u] = true; order++;
        E.forEach(([a, b, w]) => { const vv = a === u ? b : b === u ? a : -1; if (vv >= 0 && !done[vv] && d[u] + w < d[vv]) { d[vv] = d[u] + w; prev[vv] = u; } });
        S.push({u, order, d: d.slice(), prev: prev.slice(), done: done.slice()}); } return S; }
    function route(){ const deg = N.map((_, i) => E.filter(e => e[0] === i || e[1] === i).length), odd = deg.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0);
      const n = N.length, D = [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => i === j ? 0 : Infinity)); E.forEach(([a, b, w]) => { D[a][b] = Math.min(D[a][b], w); D[b][a] = Math.min(D[b][a], w); });
      for (let m = 0; m < n; m++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (D[i][m] + D[m][j] < D[i][j]) D[i][j] = D[i][m] + D[m][j];
      const pairings = []; const rec = (left, acc) => { if (!left.length) { pairings.push(acc); return; } const [a, ...rest] = left; rest.forEach((b, i) => rec(rest.filter((_, j) => j !== i), [...acc, [a, b]])); }; rec(odd, []);
      const scored = pairings.map(p => ({p, c: p.reduce((s, [a, b]) => s + D[a][b], 0)})).sort((a, b) => a.c - b.c); return {deg, odd, scored, total: E.reduce((s, e) => s + e[2], 0)}; }
    function compute(){ steps = al === 'k' ? kruskal() : al === 'p' ? prim() : al === 'd' ? dijkstra() : []; }
    const P = makePlot(stage, {span: 12.5, cx: 5, cy: 4, pan: false, zoom: false, grid: false, draw(ctx, P){ const C = P.C, chosen = new Set(), rejected = new Set(); let dState = null;
      if (al === 'k' || al === 'p') steps.slice(0, k).forEach(s => (s.ok ? chosen : rejected).add(s.e));
      if (al === 'd' && k) dState = steps[k - 1];
      E.forEach(([a, b, w], i) => { const pa = N[a], pb = N[b]; let col = C.line || C.grid, wd = 2;
        if (chosen.has(i)) { col = C.brand; wd = 5; } else if (rejected.has(i)) { col = C.bad; wd = 1.5; }
        if (dState && k === steps.length) { let t = N.length - 1; while (t > 0 && dState.prev[t] >= 0) { const p = dState.prev[t]; if ((a === p && b === t) || (b === p && a === t)) { col = C.brand; wd = 5; } t = p; } }
        P.line([[pa[1], pa[2]], [pb[1], pb[2]]], col === (C.line || C.grid) ? C.muted : col, wd, rejected.has(i) ? [5, 4] : []);
        const mx = (pa[1] + pb[1]) / 2, my = (pa[2] + pb[2]) / 2; const [sx, sy] = P.toS(mx, my); ctx.fillStyle = C.bg; ctx.fillRect(sx - 10, sy - 9, 20, 18); P.text(String(w), mx, my, C.ink, {align: 'center', base: 'middle', font: '700 13px IBM Plex Mono, monospace'}); });
      const R = route();
      N.forEach(([l, x, y], i) => { const done = dState ? dState.done[i] : false; P.dot(x, y, 16, done ? C.brand : (al === 'r' && R.odd.includes(i) ? C.warn : C.bg), C.ink2); P.text(l, x, y, done ? C.bg : C.ink, {align: 'center', base: 'middle', font: '700 14px IBM Plex Sans, sans-serif'});
        if (dState && isFinite(dState.d[i])) P.text(String(dState.d[i]), x, y + .55, C.accent, {align: 'center', base: 'bottom', font: '700 12px IBM Plex Mono, monospace'}); }); }});
    function update(){ P.redraw(); let o = '';
      if (al === 'k' || al === 'p') { const S = steps.slice(0, k); o = `${al === 'k' ? 'Kruskal: take arcs in order of weight, rejecting any that make a cycle.' : 'Prim (from A): add the shortest arc joining a new vertex to the tree.'}<br><br>${S.map(s => { const e = E[s.e]; return `${s.ok ? '✓' : '✗'} ${N[e[0]][0]}${N[e[1]][0]} (${e[2]})`; }).join(', ') || 'Press Step.'}<br><br>Tree weight so far = <b>${S.filter(s => s.ok).reduce((a, s) => a + E[s.e][2], 0)}</b>${k >= steps.length ? ' – minimum spanning tree complete' : ''}`; }
      else if (al === 'd') { const s = steps[k - 1]; o = `Dijkstra from A to H. Each step makes the smallest temporary label permanent, then updates its neighbours.<br><br>${s ? N.map(([l], i) => `${l}: ${isFinite(s.d[i]) ? s.d[i] : '∞'}${s.done[i] ? '✓' : ''}`).join(', ') : 'Press Step.'}${k >= steps.length ? `<br><br>Shortest A→H = <b>${steps[steps.length - 1].d[N.length - 1]}</b>` : ''}`; }
      else { const R = route(), best = R.scored[0]; o = `Orders: ${N.map(([l], i) => l + '=' + R.deg[i]).join(', ')}<br>Odd vertices: ${R.odd.map(i => N[i][0]).join(', ') || 'none – Eulerian!'}<br>${R.scored.slice(0, 4).map(s => s.p.map(([a, b]) => N[a][0] + N[b][0]).join(' + ') + ' = ' + s.c).join('<br>')}<br><br>Total of all arcs = ${R.total}<br>Repeat the cheapest pairing: route length = ${R.total} + ${best ? best.c : 0} = <b>${R.total + (best ? best.c : 0)}</b>`; }
      q(panel, '#out').innerHTML = o; }
    bindSeg(panel, 'al', a => { al = a; k = 0; compute(); update(); });
    q(panel, '#step').onclick = () => { if (k < steps.length) k++; update(); }; q(panel, '#all').onclick = () => { k = steps.length; update(); }; q(panel, '#reset').onclick = () => { k = 0; update(); };
    q(panel, '#rnd').onclick = () => { E = E0.map(([a, b]) => [a, b, 2 + Math.floor(Math.random() * 12)]); k = 0; compute(); update(); };
    compute(); update(); return () => P.destroy();
  }
};

/* =============================================================== linear programming */
VIS.lp = {
  name: 'Linear programming: graphical method', group: 'Decision',
  desc: 'Shade the feasible region from up to four constraints, drag the objective line across it, and read off the optimal vertex (with an integer solution option).',
  topics: [['d1', 'lp'], ['d1', 'simplex']],
  icon: icon('<path d="M4 34h32M4 34V4"/><path d="M4 34V12l12-4 14 10 4 16z" fill="var(--brand-soft)"/><path d="M8 4l26 26" stroke="var(--accent)" stroke-dasharray="3 2"/>'),
  mount(root){
    const row = (i, a, b, c) => `<div class="row" style="gap:4px;flex-wrap:nowrap;font-family:var(--f-mono);font-size:.86rem"><input id="a${i}" value="${a}" style="width:46px;height:32px;text-align:center">x +<input id="b${i}" value="${b}" style="width:46px;height:32px;text-align:center">y ≤<input id="c${i}" value="${c}" style="width:56px;height:32px;text-align:center"></div>`;
    const {stage, panel} = layout(root, `<div><h4>Constraints (x, y ≥ 0)</h4><div style="display:grid;gap:6px;margin-top:6px">${row(0, 1, 1, 10)}${row(1, 2, 1, 16)}${row(2, 1, 3, 24)}${row(3, 0, 0, 0)}</div></div>
      <div><h4>Objective</h4><div class="row" style="gap:4px;font-family:var(--f-mono);font-size:.86rem;margin-top:6px">P =<input id="p" value="3" style="width:46px;height:32px;text-align:center">x +<input id="qq" value="2" style="width:46px;height:32px;text-align:center">y</div></div>
      ${segBtns('mm', [['max', 'Maximise'], ['min', 'Minimise']], 'max')}${slider('obj', 'objective line value', 0, 60, 0.5, 12)}
      <label class="tog"><input type="checkbox" id="int">Integer solutions only</label><div class="readout" id="out"></div>`);
    let mm = 'max'; const val = id => parseFloat(q(panel, '#' + id).value) || 0;
    const cons = () => [0, 1, 2, 3].map(i => [val('a' + i), val('b' + i), val('c' + i)]).filter(([a, b]) => a || b).concat([[-1, 0, 0], [0, -1, 0]]);
    function vertices(){ const L = cons(), V = []; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const [a1, b1, c1] = L[i], [a2, b2, c2] = L[j], D = a1 * b2 - a2 * b1; if (Math.abs(D) < 1e-12) continue; const x = (c1 * b2 - c2 * b1) / D, y = (a1 * c2 - a2 * c1) / D; if (L.every(([a, b, c]) => a * x + b * y <= c + 1e-9) && !V.some(p => Math.hypot(p[0] - x, p[1] - y) < 1e-9)) V.push([x, y]); }
      const cx = V.reduce((s, p) => s + p[0], 0) / V.length, cy = V.reduce((s, p) => s + p[1], 0) / V.length; return V.sort((p, q2) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q2[1] - cy, q2[0] - cx)); }
    const P = makePlot(stage, {span: 22, cx: 9, cy: 7, xlabel: 'x', ylabel: 'y', draw(ctx, P){ const C = P.C, V = vertices();
      cons().slice(0, -2).forEach(([a, b, c]) => { if (Math.abs(b) > 1e-12) P.fn(x => (c - a * x) / b, C.muted, 1.5); else P.line([[c / a, -100], [c / a, 100]], C.muted, 1.5); });
      if (V.length > 2) P.poly(V, 'color-mix(in srgb,' + C.brand + ' 22%,transparent)', C.brand, 2);
      const p = val('p'), qq = val('qq'), k = +q(panel, '#obj').value; if (Math.abs(qq) > 1e-12) P.fn(x => (k - p * x) / qq, C.accent, 2.5); else if (p) P.line([[k / p, -100], [k / p, 100]], C.accent, 2.5);
      if (q(panel, '#int').checked) { const L = cons(); for (let x = 0; x <= 40; x++) for (let y = 0; y <= 40; y++) if (L.every(([a, b, c]) => a * x + b * y <= c + 1e-9)) P.dot(x, y, 2.5, C.ink2); }
      const b = best(V); if (b) P.dot(b[0], b[1], 7, C.bad, C.bg);
      V.forEach(([x, y]) => P.dot(x, y, 4, C.brand)); },
      onDown(w){ const p = val('p'), qq = val('qq'), n = Math.hypot(p, qq); if (!n) return false; const d = Math.abs(p * w[0] + qq * w[1] - +q(panel, '#obj').value) / n; return d * P.scale() < 16; },
      onMove(w){ const e = q(panel, '#obj'), k = Math.max(+e.min, Math.min(+e.max, val('p') * w[0] + val('qq') * w[1])); e.value = k; q(panel, '#obj-o').textContent = fx(+e.value, 2); P.redraw(); }});
    function best(V){ const p = val('p'), qq = val('qq'); let pts = V; if (q(panel, '#int').checked) { const L = cons(); pts = []; for (let x = 0; x <= 60; x++) for (let y = 0; y <= 60; y++) if (L.every(([a, b, c]) => a * x + b * y <= c + 1e-9)) pts.push([x, y]); }
      if (!pts.length) return null; return pts.reduce((a, c) => { const fa = p * a[0] + qq * a[1], fc = p * c[0] + qq * c[1]; return (mm === 'max' ? fc > fa : fc < fa) ? c : a; }); }
    function update(){ P.redraw(); const V = vertices(), p = val('p'), qq = val('qq'), b = best(V);
      q(panel, '#out').innerHTML = V.length ? `Vertex method:<br>${table(['vertex', 'P'], V.map(([x, y]) => [`(${fx(x, 3)}, ${fx(y, 3)})`, fx(p * x + qq * y, 3)]))}<br>${mm === 'max' ? 'Maximum' : 'Minimum'} P = <b>${fx(p * b[0] + qq * b[1], 4)}</b> at (${fx(b[0], 3)}, ${fx(b[1], 3)})${q(panel, '#int').checked ? ' (integer point)' : ''}<br>Drag the purple objective line (or use the slider): the last point of the region it touches is optimal.` : 'The feasible region is empty.'; }
    panel.querySelectorAll('input[id]').forEach(el => { if (el.type !== 'range' && el.type !== 'checkbox') el.addEventListener('input', update); });
    bindSlider(panel, 'obj', update); q(panel, '#int').onchange = update; bindSeg(panel, 'mm', k => { mm = k; update(); });
    update(); return () => P.destroy();
  }
};

/* =============================================================== bin packing & sorting */
VIS.binpack = {
  name: 'Bin packing & sorting', group: 'Decision',
  desc: 'First-fit, first-fit decreasing and full-bin packing compared with the lower bound, plus a pass-by-pass bubble sort.',
  topics: [['d1', 'algo']],
  icon: icon('<rect x="4" y="8" width="9" height="26"/><rect x="16" y="8" width="9" height="26"/><rect x="28" y="8" width="9" height="26"/><rect x="4" y="20" width="9" height="14" fill="var(--brand-soft)"/><rect x="16" y="14" width="9" height="20" fill="var(--accent-soft)"/><rect x="28" y="26" width="9" height="8" fill="var(--brand-soft)"/>'),
  mount(root){
    root.innerHTML = `<div class="vis"><div class="card"><div id="bins" style="display:flex;gap:10px;align-items:flex-end;min-height:280px;flex-wrap:wrap"></div><div id="sort" style="margin-top:16px;font-family:var(--f-mono);font-size:.86rem;overflow-x:auto"></div></div><div class="panel">
      <label class="field">Items<input id="items" value="8, 7, 14, 9, 6, 9, 5, 15, 6, 7, 8" style="font-family:var(--f-mono)"></label>
      <label class="field">Bin size<input id="cap" type="number" value="20" style="width:90px"></label>
      ${segBtns('al', [['ff', 'First-fit'], ['ffd', 'First-fit decreasing'], ['fb', 'Full bins']], 'ffd')}
      <div class="readout" id="out"></div></div></div>`;
    const panel = root.querySelector('.panel'); let al = 'ffd';
    const cols = ['var(--brand)', 'var(--accent)', 'var(--blue)', 'var(--warn)', 'var(--good)', 'var(--bad)'];
    function pack(items, cap){ let L = items.slice(); if (al === 'ffd') L.sort((a, b) => b - a);
      if (al === 'fb') { // find subsets summing exactly to cap greedily (small n)
        const bins = [], left = L.slice(); const find = (arr, target) => { const n = arr.length; for (let m = 1; m < (1 << Math.min(n, 16)); m++) { let s = 0; const ids = []; for (let i = 0; i < n; i++) if (m & (1 << i)) { s += arr[i]; ids.push(i); } if (s === target) return ids; } return null; };
        let ids; while ((ids = find(left, cap))) { bins.push(ids.map(i => left[i])); ids.sort((a, b) => b - a).forEach(i => left.splice(i, 1)); }
        const rest = []; left.sort((a, b) => b - a).forEach(x => { const b = rest.find(bb => bb.reduce((s, y) => s + y, 0) + x <= cap); b ? b.push(x) : rest.push([x]); }); return bins.concat(rest); }
      const bins = []; L.forEach(x => { const b = bins.find(bb => bb.reduce((s, y) => s + y, 0) + x <= cap); b ? b.push(x) : bins.push([x]); }); return bins; }
    function update(){ const items = q(panel, '#items').value.split(/[ ,]+/).map(Number).filter(x => x > 0), cap = +q(panel, '#cap').value || 1;
      if (items.some(x => x > cap)) { q(panel, '#out').textContent = 'An item is bigger than the bin.'; return; }
      const bins = pack(items, cap), lb = Math.ceil(items.reduce((a, b) => a + b, 0) / cap);
      q(root, '#bins').innerHTML = bins.map((b, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><div style="width:58px;height:${cap * 12}px;border:2px solid var(--ink-2);border-top:0;border-radius:0 0 6px 6px;display:flex;flex-direction:column-reverse;overflow:hidden">${b.map((x, j) => `<div style="height:${x * 12}px;background:color-mix(in srgb,${cols[j % cols.length]} 35%,transparent);border-top:1px solid var(--surface);display:grid;place-items:center;font-weight:700;font-size:.8rem">${x}</div>`).join('')}</div><span class="muted" style="font-size:.78rem">Bin ${i + 1}</span></div>`).join('');
      // bubble sort (descending) passes
      const a = items.slice(), passes = [a.join(' ')]; for (let p = 0; p < a.length - 1; p++) { let sw = false; for (let i = 0; i < a.length - 1 - p; i++) if (a[i] < a[i + 1]) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; sw = true; } passes.push(a.join(' ')); if (!sw) break; }
      q(root, '#sort').innerHTML = '<b>Bubble sort (descending):</b><br>' + passes.map((s, i) => `${i ? 'Pass ' + i : 'Start '}: ${s}`).join('<br>');
      q(panel, '#out').innerHTML = `Lower bound = ⌈Σ/size⌉ = ⌈${items.reduce((x, y) => x + y, 0)}/${cap}⌉ = <b>${lb}</b> bins<br>${{ff: 'First-fit', ffd: 'First-fit decreasing', fb: 'Full-bin'}[al]} uses <b>${bins.length}</b> bins${bins.length === lb ? ' – optimal' : ''}<br>Wasted space: ${bins.map(b => cap - b.reduce((s, y) => s + y, 0)).join(', ')}`; }
    q(panel, '#items').addEventListener('input', update); q(panel, '#cap').addEventListener('input', update); bindSeg(panel, 'al', k => { al = k; update(); });
    update(); return () => {};
  }
};

/* =============================================================== game theory */
VIS.game = {
  name: 'Zero-sum games', group: 'Decision',
  desc: 'Edit a pay-off matrix for player A. Find play-safe strategies, check for a stable solution (saddle point), remove dominated strategies and solve a 2 × n game graphically for the optimal mixed strategy.',
  topics: [['d2', 'game']],
  icon: icon('<rect x="6" y="6" width="28" height="28"/><path d="M6 15h28M6 24h28M15 6v28M24 6v28" stroke="var(--line-strong)" stroke-width="1.4"/><path d="M15 24h9v-9" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `<div><h4>Pay-off to A (rows = A, columns = B)</h4><div class="mat" id="mat" style="grid-template-columns:repeat(3,auto);margin-top:8px"></div></div>
      <div class="row"><button class="btn sm" id="ac">+ column</button><button class="btn sm" id="rc">− column</button><button class="btn sm" id="rnd">Random</button></div>
      <div class="readout" id="out"></div><p class="note">The graph shows A’s expected gain against each of B’s pure strategies when A plays row 1 with probability p. A picks the p that maximises the lowest line.</p>`, {hud: '', aspect: '4/3'});
    let M = [[3, -2, 4], [-1, 4, 1]];
    function render(){ const mat = q(panel, '#mat'); mat.style.gridTemplateColumns = `repeat(${M[0].length},auto)`; mat.innerHTML = M.map((r, i) => r.map((x, j) => `<input data-r="${i}" data-c="${j}" value="${x}">`).join('')).join('');
      mat.querySelectorAll('input').forEach(el => el.addEventListener('input', () => { const v = parseFloat(el.value); if (isFinite(v)) { M[+el.dataset.r][+el.dataset.c] = v; update(); } })); }
    function mixed(){ // 2 rows: maximise min_j (p a1j + (1-p) a2j)
      let bestP = 0, bestV = -Infinity; for (let i = 0; i <= 2000; i++) { const p = i / 2000, v = Math.min(...M[0].map((a, j) => p * a + (1 - p) * M[1][j])); if (v > bestV + 1e-12) { bestV = v; bestP = p; } } return [bestP, bestV]; }
    const P = makePlot(stage, {span: 1.6, cx: .5, cy: 1, equal: false, yspan: 12, pan: false, zoom: false, xlabel: 'p', draw(ctx, P){ const C = P.C, cols = [C.accent, C.blue, C.warn, C.good, C.bad];
      const all = M.flat(); P.cy = (Math.max(...all) + Math.min(...all)) / 2; P.yspan = (Math.max(...all) - Math.min(...all)) * 1.5 + 2;
      P.line([[1, -100], [1, 100]], C.muted, 1.2);
      M[0].forEach((a, j) => { P.line([[0, M[1][j]], [1, a]], cols[j % cols.length], 2.5); P.text('B' + (j + 1), 1, a, cols[j % cols.length], {dx: 6, base: 'middle'}); });
      const env = []; for (let i = 0; i <= 200; i++) { const p = i / 200; env.push([p, Math.min(...M[0].map((a, j) => p * a + (1 - p) * M[1][j]))]); } P.line(env, C.ink, 3.5);
      const [bp, bv] = mixed(); P.dot(bp, bv, 7, C.brand, C.bg); }});
    function update(){ P.redraw(); const rows = M.map(r => Math.min(...r)), colsMax = M[0].map((_, j) => Math.max(...M.map(r => r[j]))), maximin = Math.max(...rows), minimax = Math.min(...colsMax);
      const rdom = M[0].every((a, j) => a >= M[1][j]) ? 'Row 1 dominates row 2' : M[1].every((a, j) => a >= M[0][j]) ? 'Row 2 dominates row 1' : 'No row dominance';
      const cdom = []; M[0].forEach((_, j) => M[0].forEach((_, k) => { if (j !== k && M.every(r => r[j] <= r[k]) && M.some(r => r[j] < r[k])) cdom.push(`B${j + 1} dominates B${k + 1}`); }));
      const [bp, bv] = mixed();
      q(panel, '#out').innerHTML = `Row minima: ${rows.join(', ')} → A plays safe with row ${rows.indexOf(maximin) + 1} (maximin ${maximin})<br>Column maxima: ${colsMax.join(', ')} → B plays safe with column ${colsMax.indexOf(minimax) + 1} (minimax ${minimax})<br>${maximin === minimax ? `<b>Stable solution</b> (saddle point), value ${maximin}` : 'No stable solution: maximin ≠ minimax, so use a mixed strategy'}<br>${rdom}; ${cdom.join(', ') || 'no column dominance'} (B wants small pay-offs)<br><br>A’s optimal mix: row 1 with p = <b>${fx(bp, 4)}</b>, row 2 with ${fx(1 - bp, 4)}<br>Value of the game to A = <b>${fx(bv, 4)}</b>`; }
    q(panel, '#ac').onclick = () => { if (M[0].length < 5) { M.forEach(r => r.push(0)); render(); update(); } };
    q(panel, '#rc').onclick = () => { if (M[0].length > 2) { M.forEach(r => r.pop()); render(); update(); } };
    q(panel, '#rnd').onclick = () => { M = M.map(r => r.map(() => Math.floor(Math.random() * 11) - 5)); render(); update(); };
    render(); update(); return () => P.destroy();
  }
};
/* =============================================================== Type I & II errors */
VIS.errors = {
  name: 'Critical regions, Type I & Type II errors', group: 'Statistics',
  desc: 'Move the significance level and the true parameter: the critical region (Type I error, α) is shaded under H₀, and the Type II error β is shaded under the true distribution. See power = 1 − β grow as the alternative moves away.',
  topics: [['stats', 'hyp'], ['fs1', 'quality'], ['fs1', 'hyp'], ['fs2', 'furtherhyp']],
  icon: icon('<path d="M4 34h32"/><path d="M4 33c5 0 7-24 11-24s6 24 11 24" stroke="var(--brand)"/><path d="M14 33c5 0 7-24 11-24s6 24 11 24" stroke="var(--accent)"/><path d="M22 10v24" stroke="var(--bad)" stroke-dasharray="3 2"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${segBtns('k', [['bin', 'Binomial'], ['norm', 'Normal mean']], 'bin')}
      <div id="binP">${slider('n', 'n', 5, 60, 1, 20)}${slider('p0', 'H₀: p =', 0.05, 0.95, 0.05, 0.3)}${slider('p1', 'true p', 0.05, 0.95, 0.01, 0.5)}</div>
      <div id="normP" hidden>${slider('m0', 'H₀: μ =', 0, 20, 0.5, 10)}${slider('m1', 'true μ', 0, 20, 0.1, 12)}${slider('sd', 'σ', 1, 10, 0.5, 4)}${slider('nn', 'sample size n', 1, 50, 1, 9)}</div>
      ${segBtns('tail', [['up', 'H₁: upper tail'], ['lo', 'H₁: lower tail'], ['two', 'Two-tailed']], 'up')}
      ${slider('al', 'significance level α', 0.01, 0.2, 0.005, 0.05, v => (v * 100).toFixed(1) + '%')}
      <div class="readout" id="out"></div><p class="note"><span style="color:var(--bad)">Red</span>: reject H₀ when it is true (Type I). <span style="color:var(--blue)">Blue</span>: accept H₀ when the true value is different (Type II).</p>`, {hud: '', aspect: '16/10'});
    let k = 'bin', tail = 'up'; const v = id => +q(panel, '#' + id).value;
    const lf = n => lgamma(n + 1), bp = (n, p, x) => Math.exp(lf(n) - lf(x) - lf(n - x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
    function binCR(){ const n = v('n'), p0 = v('p0'), a = v('al'), pm = [...Array(n + 1)].map((_, x) => bp(n, p0, x)); const cum = []; pm.reduce((s, x, i) => (cum[i] = s + x), 0);
      let lo = -1, hi = n + 1; const aa = tail === 'two' ? a / 2 : a;
      if (tail !== 'up') { while (lo + 1 <= n && cum[lo + 1] <= aa) lo++; }
      if (tail !== 'lo') { while (hi - 1 >= 0 && 1 - (hi - 1 > 0 ? cum[hi - 2] : 0) <= aa) hi--; }
      return {lo, hi, inCR: x => x <= lo || x >= hi}; }
    const P = makePlot(stage, {span: 22, cx: 10, cy: .1, equal: false, yspan: .3, pan: false, zoom: false, draw(ctx, P){ const C = P.C;
      if (k === 'bin') { const n = v('n'), p0 = v('p0'), p1 = v('p1'), cr = binCR(); let mx = 0;
        for (let x = 0; x <= n; x++) mx = Math.max(mx, bp(n, p0, x), bp(n, p1, x)); P.span = n + 3; P.cx = n / 2; P.yspan = mx * 1.35; P.cy = mx * .55;
        for (let x = 0; x <= n; x++) { const a = bp(n, p0, x), b = bp(n, p1, x), inc = cr.inCR(x);
          P.poly([[x - .42, 0], [x - .02, 0], [x - .02, a], [x - .42, a]], inc ? C.bad : C.soft, inc ? C.bad : C.brand, 1);
          P.poly([[x + .02, 0], [x + .42, 0], [x + .42, b], [x + .02, b]], inc ? 'transparent' : 'color-mix(in srgb,' + C.blue + ' 55%,transparent)', C.blue, 1); }
        if (cr.hi <= n) P.line([[cr.hi - .5, 0], [cr.hi - .5, mx * 1.2]], C.bad, 1.5, [5, 4]); if (cr.lo >= 0) P.line([[cr.lo + .5, 0], [cr.lo + .5, mx * 1.2]], C.bad, 1.5, [5, 4]);
        P.text('■ under H₀', P.cx + P.span * .28, mx * 1.18, C.brand); P.text('■ under true p', P.cx + P.span * .28, mx * 1.06, C.blue);
      } else { const m0 = v('m0'), m1 = v('m1'), se = v('sd') / Math.sqrt(v('nn')), a = v('al'), z = zInv(1 - (tail === 'two' ? a / 2 : a));
        const pdf = (x, m) => Math.exp(-((x - m) ** 2) / (2 * se * se)) / (se * Math.sqrt(2 * Math.PI)), pk = pdf(m0, m0);
        P.cx = (m0 + m1) / 2; P.span = Math.abs(m1 - m0) + 9 * se; P.yspan = pk * 1.4; P.cy = pk * .6;
        const cU = m0 + z * se, cL = m0 - z * se, x0 = P.bounds().x0, x1 = P.bounds().x1;
        const shade = (f, a2, b2, col) => { const pts = [[a2, 0]]; for (let i = 0; i <= 120; i++) { const x = a2 + (b2 - a2) * i / 120; pts.push([x, f(x)]); } pts.push([b2, 0]); P.poly(pts, col); };
        if (tail !== 'lo') shade(x => pdf(x, m0), cU, x1, 'color-mix(in srgb,' + C.bad + ' 55%,transparent)');
        if (tail !== 'up') shade(x => pdf(x, m0), x0, cL, 'color-mix(in srgb,' + C.bad + ' 55%,transparent)');
        shade(x => pdf(x, m1), tail === 'up' ? x0 : cL, tail === 'lo' ? x1 : cU, 'color-mix(in srgb,' + C.blue + ' 35%,transparent)');
        P.fn(x => pdf(x, m0), C.brand, 2.5); P.fn(x => pdf(x, m1), C.blue, 2.5, undefined, undefined);
        if (tail !== 'lo') P.line([[cU, 0], [cU, pk * 1.15]], C.bad, 1.5, [5, 4]); if (tail !== 'up') P.line([[cL, 0], [cL, pk * 1.15]], C.bad, 1.5, [5, 4]); } }});
    function update(){ P.redraw(); let o;
      if (k === 'bin') { const n = v('n'), p0 = v('p0'), p1 = v('p1'), cr = binCR(); let t1 = 0, t2 = 0; for (let x = 0; x <= n; x++) { if (cr.inCR(x)) t1 += bp(n, p0, x); else t2 += bp(n, p1, x); }
        const reg = [cr.lo >= 0 ? `X ≤ ${cr.lo}` : '', cr.hi <= n ? `X ≥ ${cr.hi}` : ''].filter(Boolean).join(' or ') || 'empty (no result is significant)';
        o = `X ~ B(${n}, p). H₀: p = ${p0}, H₁: p ${tail === 'up' ? '>' : tail === 'lo' ? '<' : '≠'} ${p0}<br>Critical region: <b>${reg}</b><br>Actual significance level = P(Type I) = <b>${fx(t1, 4)}</b> (≤ ${fx(v('al') * 100, 1)}%)<br>If really p = ${fx(p1)}: P(Type II) = β = <b>${fx(t2, 4)}</b>, power = 1 − β = <b>${fx(1 - t2, 4)}</b>`; }
      else { const m0 = v('m0'), m1 = v('m1'), se = v('sd') / Math.sqrt(v('nn')), a = v('al'), z = zInv(1 - (tail === 'two' ? a / 2 : a)), cU = m0 + z * se, cL = m0 - z * se;
        const beta = tail === 'up' ? Phi((cU - m1) / se) : tail === 'lo' ? 1 - Phi((cL - m1) / se) : Phi((cU - m1) / se) - Phi((cL - m1) / se);
        o = `X̄ ~ N(μ, σ²/n), standard error = ${fx(se, 4)}<br>H₀: μ = ${m0}, H₁: μ ${tail === 'up' ? '>' : tail === 'lo' ? '<' : '≠'} ${m0}<br>Critical value${tail === 'two' ? 's' : ''}: ${tail !== 'up' ? 'X̄ < ' + fx(cL, 4) : ''}${tail === 'two' ? ' or ' : ''}${tail !== 'lo' ? 'X̄ > ' + fx(cU, 4) : ''} (z = ${fx(z, 4)})<br>P(Type I) = α = <b>${fx(a, 4)}</b><br>If really μ = ${fx(m1)}: β = <b>${fx(beta, 4)}</b>, power = <b>${fx(1 - beta, 4)}</b><br>Bigger n → narrower curves → smaller β.`; }
      q(panel, '#out').innerHTML = o; }
    bindSeg(panel, 'k', x => { k = x; q(panel, '#binP').hidden = x !== 'bin'; q(panel, '#normP').hidden = x === 'bin'; update(); }); bindSeg(panel, 'tail', x => { tail = x; update(); });
    ['n', 'p0', 'p1', 'm0', 'm1', 'sd', 'nn'].forEach(id => bindSlider(panel, id, update)); bindSlider(panel, 'al', update, v => (v * 100).toFixed(1) + '%');
    update(); return () => P.destroy();
  }
};

/* =============================================================== Poisson approximation to binomial */
VIS.poissonapprox = {
  name: 'Poisson approximation to the binomial', group: 'Statistics',
  desc: 'Keep λ = np fixed and let n grow while p shrinks: watch the binomial bars B(n, p) morph into the Poisson distribution Po(λ).',
  topics: [['stats', 'dist'], ['fs1', 'poisson']],
  icon: icon('<path d="M4 34h32"/><rect x="7" y="20" width="4" height="14" fill="var(--brand-soft)"/><rect x="13" y="10" width="4" height="24" fill="var(--brand-soft)"/><rect x="19" y="12" width="4" height="22" fill="var(--brand-soft)"/><rect x="25" y="22" width="4" height="12" fill="var(--brand-soft)"/><path d="M9 20l6-10 6 2 6 10 6 8" stroke="var(--accent)"/>'),
  mount(root){
    const {stage, panel} = layout(root, `${slider('lam', 'λ = np', 0.5, 10, 0.1, 3)}${slider('ln', 'n', 0, 3, 0.01, 0.9, v => String(Math.round(Math.pow(10, v) + 4)))}
      <div class="row"><button class="btn primary sm" id="go">Animate n → large</button></div><div class="readout" id="out"></div>
      <p class="note">B(n, p) ≈ Po(np) when n is large and p is small (rule of thumb: n &gt; 50, np &lt; 5). Bars = binomial, dots = Poisson.</p>`, {hud: '', aspect: '16/10'});
    const v = id => +q(panel, '#' + id).value, N = () => Math.round(Math.pow(10, v('ln')) + 4); let raf;
    const lf = n => lgamma(n + 1);
    const bin = (n, p, x) => x > n ? 0 : Math.exp(lf(n) - lf(x) - lf(n - x) + x * Math.log(p) + (n - x) * Math.log(1 - p)), poi = (l, x) => Math.exp(-l + x * Math.log(l) - lf(x));
    const P = makePlot(stage, {span: 16, cx: 6, cy: .15, equal: false, yspan: .4, pan: false, zoom: false, xlabel: 'x', draw(ctx, P){ const C = P.C, l = v('lam'), n = N(), p = l / n, X = Math.ceil(l + 4 * Math.sqrt(l) + 3);
      let mx = 0; for (let x = 0; x <= X; x++) mx = Math.max(mx, poi(l, x), bin(n, p, x)); P.span = X + 2; P.cx = X / 2; P.yspan = mx * 1.3; P.cy = mx * .55;
      for (let x = 0; x <= X; x++) { const b = bin(n, p, x); P.poly([[x - .35, 0], [x + .35, 0], [x + .35, b], [x - .35, b]], C.soft, C.brand, 1.2); }
      const pts = []; for (let x = 0; x <= X; x++) pts.push([x, poi(l, x)]); P.line(pts, C.accent, 1.5, [4, 4]); pts.forEach(([x, y]) => P.dot(x, y, 5, C.accent, C.bg)); }});
    function update(){ q(panel, '#ln-o').textContent = N(); P.redraw(); const l = v('lam'), n = N(), p = l / n; let md = 0, at = 0; for (let x = 0; x <= n && x < 60; x++) { const d = Math.abs(bin(n, p, x) - poi(l, x)); if (d > md) { md = d; at = x; } }
      q(panel, '#out').innerHTML = `n = <b>${n}</b>, p = λ/n = <b>${fx(p, 5)}</b><br>Binomial: mean ${fx(n * p, 4)}, variance np(1 − p) = ${fx(n * p * (1 - p), 4)}<br>Poisson: mean = variance = ${fx(l, 4)}<br>P(X = 2): B = ${fx(bin(n, p, 2), 5)}, Po = ${fx(poi(l, 2), 5)}<br>Largest gap between the two: <b>${fx(md, 5)}</b> at x = ${at}<br>${n > 50 && l < 5 ? 'Approximation is good here.' : 'Approximation is rough here – increase n.'}`; }
    bindSlider(panel, 'lam', update); bindSlider(panel, 'ln', update, v => String(Math.round(Math.pow(10, v) + 4)));
    q(panel, '#go').onclick = () => { cancelAnimationFrame(raf); const e = q(panel, '#ln'); e.value = 0; const step = () => { e.value = +e.value + .02; update(); if (+e.value < 3) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); };
    update(); return () => { cancelAnimationFrame(raf); P.destroy(); };
  }
};
})();
