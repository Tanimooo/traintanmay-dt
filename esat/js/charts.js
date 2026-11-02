/* ============================================================
   Small hand-rolled SVG charts. No chart library — these are
   simple, themable and keep the bundle light.
   ============================================================ */
const Chart = (() => {
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );

  /** Vertical bars, one per question, height = time taken. */
  function timePerQuestion(items, opts = {}) {
    if (!items.length) return '';
    const W = 100,
      H = opts.height || 34,
      pad = 6;
    const max = Math.max(...items.map((d) => d.ms), 1);
    const n = items.length;
    const gap = n > 60 ? 0.18 : 0.32;
    const bw = (W - pad * 2) / n;
    const bars = items
      .map((d, i) => {
        const h = Math.max(0.9, ((H - 9) * d.ms) / max);
        const x = pad + i * bw + (bw * gap) / 2;
        const fill =
          d.skipped
            ? 'var(--color-text-faint)'
            : d.correct
              ? 'var(--color-success)'
              : 'var(--color-error)';
        return `<rect x="${x.toFixed(2)}" y="${(H - 9 - h).toFixed(2)}" width="${(bw * (1 - gap)).toFixed(2)}" height="${h.toFixed(2)}" rx="${Math.min(0.7, bw / 3).toFixed(2)}" fill="${fill}"><title>Q${i + 1} · ${(d.ms / 1000).toFixed(1)}s · ${d.skipped ? 'skipped' : d.correct ? 'correct' : 'incorrect'}</title></rect>`;
      })
      .join('');
    const avg = items.reduce((s, d) => s + d.ms, 0) / n;
    const ay = H - 9 - ((H - 9) * avg) / max;
    // labels live in HTML, not the SVG: preserveAspectRatio="none" would stretch text
    const every = n <= 12 ? 1 : n <= 30 ? 5 : 10;
    const labels = items
      .map((d, i) => {
        const q = i + 1;
        const show = q === 1 || q === n || q % every === 0;
        return `<span${show ? '' : ' aria-hidden="true"'}>${show ? q : ''}</span>`;
      })
      .join('');
    return `<div class="tpq">
      <svg class="chart" viewBox="0 0 ${W} ${H - 9}" preserveAspectRatio="none" role="img"
        aria-label="Time spent on each question">
        <line x1="${pad}" x2="${W - pad}" y1="${H - 9.15}" y2="${H - 9.15}" stroke="var(--color-divider)" stroke-width="0.3"/>
        <line x1="${pad}" x2="${W - pad}" y1="${ay.toFixed(2)}" y2="${ay.toFixed(2)}"
          stroke="var(--color-text-faint)" stroke-width="0.3" stroke-dasharray="1.2 1.2"/>
        ${bars}
      </svg>
      <div class="tpq-x" style="padding:0 ${pad}%">${labels}</div>
    </div>`;
  }

  /** Horizontal labelled bars. rows: [{label, sub, value, max, tone}] */
  function hbars(rows, opts = {}) {
    if (!rows.length) return '';
    const fmt = opts.format || ((v) => `${Math.round(v)}%`);
    return `<div class="grid" style="gap:var(--space-4)">${rows
      .map((r) => {
        const pct = Math.max(0, Math.min(100, (r.value / (r.max || 100)) * 100));
        return `<div>
        <div class="row" style="justify-content:space-between;gap:var(--space-2);margin-bottom:var(--space-2)">
          <span style="font-size:var(--text-sm);font-weight:600;min-width:0;overflow-wrap:anywhere">${esc(r.label)}</span>
          <span class="mono muted" style="font-size:var(--text-xs);white-space:nowrap">${esc(fmt(r.value))}${r.sub ? ` · ${esc(r.sub)}` : ''}</span>
        </div>
        <div class="meter ${r.tone || ''}"><span style="width:${pct.toFixed(1)}%"></span></div>
      </div>`;
      })
      .join('')}</div>`;
  }

  /** Accuracy trend across sessions. points: [{label, value}] 0-100 */
  function trend(points) {
    if (points.length < 2)
      return `<div class="empty" style="padding:var(--space-10)">Finish at least two tests to see a trend.</div>`;
    const W = 100,
      H = 40,
      pl = 8,
      pr = 3,
      pt = 4,
      pb = 8;
    const n = points.length;
    const x = (i) => pl + ((W - pl - pr) * i) / (n - 1);
    const y = (v) => pt + (H - pt - pb) * (1 - v / 100);
    const line = points.map((p, i) => `${x(i).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
    const area = `${pl},${y(0)} ${line} ${x(n - 1).toFixed(2)},${y(0)}`;
    const grid = [0, 50, 100]
      .map(
        (v) =>
          `<line x1="${pl}" x2="${W - pr}" y1="${y(v).toFixed(2)}" y2="${y(v).toFixed(2)}" stroke="var(--color-divider)" stroke-width="0.25"/>
           <text x="0" y="${(y(v) + 1.4).toFixed(2)}" style="font-size:3px">${v}%</text>`
      )
      .join('');
    const dots = points
      .map(
        (p, i) =>
          `<circle cx="${x(i).toFixed(2)}" cy="${y(p.value).toFixed(2)}" r="0.9" fill="var(--color-primary)"><title>${esc(p.label)}: ${Math.round(p.value)}%</title></circle>`
      )
      .join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Accuracy by test over time">
      ${grid}
      <polygon points="${area}" fill="var(--color-primary)" opacity="0.10"/>
      <polyline points="${line}" fill="none" stroke="var(--color-primary)" stroke-width="0.7"
        stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
    </svg>`;
  }

  /** Donut ring showing a percentage. */
  function ring(pct, label, sub) {
    const r = 56,
      c = 2 * Math.PI * r;
    const tone =
      pct >= 75 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-error)';
    return `<div class="ring">
      <svg viewBox="0 0 132 132" aria-hidden="true">
        <circle cx="66" cy="66" r="${r}" fill="none" stroke="var(--color-surface-offset-2)" stroke-width="11"/>
        <circle cx="66" cy="66" r="${r}" fill="none" stroke="${tone}" stroke-width="11"
          stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}"
          stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}"/>
      </svg>
      <div class="mid"><b>${esc(label)}</b><span>${esc(sub || '')}</span></div>
    </div>`;
  }

  /** Mastery grid: one cell per spec item. cells: [{code, pct, n}] */
  function heat(cells) {
    return `<div class="hm">${cells
      .map((c) => {
        let bg = 'var(--color-surface-offset-2)';
        let title = `${c.code} — not attempted`;
        if (c.n) {
          const t =
            c.pct >= 80
              ? 'var(--color-success)'
              : c.pct >= 55
                ? 'var(--color-warning)'
                : 'var(--color-error)';
          const op = 0.35 + 0.65 * Math.min(1, c.n / 4);
          bg = `color-mix(in srgb, ${t} ${Math.round(op * 100)}%, var(--color-surface-offset))`;
          title = `${c.code} — ${Math.round(c.pct)}% of ${c.n} attempt${c.n === 1 ? '' : 's'}`;
        }
        return `<i style="background:${bg}" title="${esc(title)}"></i>`;
      })
      .join('')}</div>`;
  }

  return { timePerQuestion, hbars, trend, ring, heat };
})();
