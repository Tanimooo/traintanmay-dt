/* TrainTanmay Focus: the budget builder for planner projects (optional, one per project).
   What you buy, what it cost, how much of it ends up in the product, and what's left over to use elsewhere.
   Kept in localStorage as tt-focus-budget, synced with the rest of Focus by save.js:
     { projects: {projectId: {on, budget, cur}},
       cats:  {id: {id, proj, name, color, o}},
       items: {id: {id, proj, cat, name, supplier, link, qty, used, est, paid, reuse, gave, note, o, t}} }
   qty = how many you bought (or will buy), used = how many go into the product, est = the price per item you
   expected, paid = the price per item you actually paid (empty until you buy it), reuse = the spares can be
   used elsewhere, gave = how many spares you have already passed to another project.
   Loaded before planner.js, which calls window.ttBudget(api) and draws the Budget view with it. */
window.ttBudget = function (A) {
  'use strict';
  var $ = A.$, $$ = A.$$, esc = A.esc, uid = A.uid, toast = A.toast, modal = A.modal, IC = A.IC, ic = A.ic;
  var KEY = 'tt-focus-budget';
  var CCOLS = ['#1f5fbf', '#c2410c', '#1a7f45', '#7a5af5', '#c81e66', '#0f9fb0', '#d9a300', '#6b7a90', '#5b8c1a', '#e0457b'];
  var DEFCATS = { nea: ['Materials', 'Electronics', 'Fixings', 'Finishes', 'Tools and consumables', 'Delivery'], epq: ['Materials', 'Printing', 'Software', 'Books and sources', 'Delivery'], other: ['Materials', 'Parts', 'Delivery'] };
  var I = {
    pound: ic('<path d="M16 6.5A4 4 0 0 0 9 9v9M6 13h8M6 19h12"/>'),
    csv: ic('<path d="M6 3h9l4 4v14H6z"/><path d="M9 13h7M9 17h7M9 9h3"/>'), print: ic('<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>'),
    box: ic('<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>'), share: ic('<path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5"/>'),
    tag: ic('<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.4" fill="currentColor"/>')
  };

  /* ---------- data ---------- */
  function data() { var d = A.getJ(KEY, {}); d.projects = d.projects || {}; d.cats = d.cats || {}; d.items = d.items || {}; return d; }
  function save(d) { A.putJ(KEY, d); }
  function vals(o) { return Object.keys(o || {}).map(function (k) { return o[k]; }); }
  function byO(a, b) { return (a.o || 0) - (b.o || 0) || (a.t || 0) - (b.t || 0); }
  function cfg(d, pid) { return d.projects[pid] || null; }
  function on(pid) { var c = cfg(data(), pid); return !!(c && c.on); }
  function cats(d, pid) { return vals(d.cats).filter(function (c) { return c.proj === pid; }).sort(byO); }
  function items(d, pid) { return vals(d.items).filter(function (x) { return x.proj === pid; }).sort(byO); }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^\d.\-]/g, '')); return isFinite(n) ? n : 0; }
  function has(v) { return v !== '' && v != null && isFinite(parseFloat(v)); }
  function money(n, cur) { n = Math.round((n || 0) * 100) / 100; return (n < 0 ? '−' : '') + (cur || '£') + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function bought(x) { return has(x.paid); }
  function price(x) { return bought(x) ? num(x.paid) : num(x.est); }
  /* the sums: spent is real money out; in product is what the finished thing contains; left over is the rest */
  function line(x) {
    var q = Math.max(0, num(x.qty)), u = Math.min(q, Math.max(0, num(x.used))), p = price(x), spare = q - u, gave = Math.min(spare, Math.max(0, num(x.gave)));
    return { q: q, u: u, p: p, est: q * num(x.est), spent: bought(x) ? q * num(x.paid) : 0, todo: bought(x) ? 0 : q * num(x.est), product: u * p, spare: spare, spareVal: spare * p, reusable: x.reuse ? (spare - gave) * p : 0, wasted: x.reuse ? 0 : spare * p, gave: gave, gaveVal: gave * p };
  }
  function totals(d, pid) {
    var t = { est: 0, spent: 0, todo: 0, product: 0, spareVal: 0, reusable: 0, wasted: 0, gaveVal: 0, n: 0, nb: 0 };
    items(d, pid).forEach(function (x) { var l = line(x); ['est', 'spent', 'todo', 'product', 'spareVal', 'reusable', 'wasted', 'gaveVal'].forEach(function (k) { t[k] += l[k]; }); t.n++; if (bought(x)) t.nb++; });
    t.forecast = t.spent + t.todo; return t;
  }
  /* the dot: green while you've spent under 70% of the budget, amber up to 90%, red after that */
  function state(pid) {
    var d = data(), c = cfg(d, pid); if (!c || !c.on) return null;
    var t = totals(d, pid), b = num(c.budget), pct = b > 0 ? t.spent / b * 100 : 0, fpct = b > 0 ? t.forecast / b * 100 : 0;
    return { on: true, budget: b, cur: c.cur || '£', spent: t.spent, forecast: t.forecast, pct: pct, fpct: fpct, col: !b ? 'none' : pct > 90 ? 'bad' : pct >= 70 ? 'warn' : 'ok', t: t };
  }
  function dotTitle(s) { return !s.budget ? 'No budget set yet' : Math.round(s.pct) + '% of your ' + money(s.budget, s.cur) + ' budget spent' + (s.pct > 100 ? ' (over budget)' : s.pct > 90 ? ' (nearly all of it)' : s.pct >= 70 ? ' (getting close)' : ''); }
  function dot(pid, cls) { var s = state(pid); if (!s || (cls === 'corner' && s.col === 'none')) return ''; return '<i class="bdot ' + s.col + (cls ? ' ' + cls : '') + '" title="' + esc(dotTitle(s)) + '" aria-label="' + esc(dotTitle(s)) + '"></i>'; }
  function enable(pid, type, amount, cur, own) {
    var d = data(), c = d.projects[pid] || {}, now = Date.now(), first = !c.seeded;
    c.on = true; if (amount != null) c.budget = amount; c.cur = cur || c.cur || '£'; c.seeded = true; d.projects[pid] = c;
    if (first && !own && !cats(d, pid).length) (DEFCATS[type] || DEFCATS.other).forEach(function (n, i) { var id = 'c' + uid() + i; d.cats[id] = { id: id, proj: pid, name: n, color: CCOLS[i % CCOLS.length], o: i, t: now }; });
    save(d);
  }
  function disable(pid) { var d = data(); if (d.projects[pid]) { d.projects[pid].on = false; save(d); } }

  /* ---------- the Budget view ---------- */
  var sortBy = 'cat', keepFocus = null, lastCat = null; // lastCat: the category you last added an item to, so the next one starts there
  function html(pid, others) {
    var d = data(), c = cfg(d, pid), cur = c.cur || '£', s = state(pid), t = s.t, cs = cats(d, pid), list = items(d, pid), b = s.budget;
    var h = '<div class="bview">';
    // headline figures
    var left = b - t.spent;
    h += '<div class="bstats">' +
      '<div class="bstat big"><label class="f" for="bBudget">Your budget</label><div class="bmoney"><span>' + esc(cur) + '</span><input type="number" id="bBudget" min="0" step="1" inputmode="decimal" value="' + (b || '') + '" placeholder="e.g. 60"></div></div>' +
      '<div class="bstat"><span class="bl">Spent so far ' + dot(pid) + '</span><b>' + money(t.spent, cur) + '</b><span class="small muted">' + (b ? Math.round(s.pct) + '% of your budget' : 'Set a budget to see how you\'re doing') + '</span></div>' +
      '<div class="bstat"><span class="bl">' + (left >= 0 ? 'Left to spend' : 'Over budget by') + '</span><b class="' + (b && left < 0 ? 'neg' : '') + '">' + (b ? money(Math.abs(left), cur) : '–') + '</b><span class="small muted">' + (t.todo ? money(t.todo, cur) + ' still to buy' : 'Nothing left on your list') + '</span></div>' +
      '<div class="bstat"><span class="bl">Cost of the product</span><b>' + money(t.product, cur) + '</b><span class="small muted">Just the parts it uses</span></div>' +
      '<div class="bstat"><span class="bl">Left over</span><b>' + money(t.spareVal, cur) + '</b><span class="small muted">' + (t.reusable ? money(t.reusable, cur) + ' you can use elsewhere' : 'Spares you bought but didn\'t use') + '</span></div></div>';
    // the budget bar: spent, then still to buy, against the budget
    var scale = Math.max(b, t.forecast, 1), w1 = t.spent / scale * 100, w2 = t.todo / scale * 100;
    h += '<div class="card bbar"><div class="bbar-t"><b>Budget</b><span class="small muted">' + (b ? 'If you buy everything on your list you\'ll spend <b>' + money(t.forecast, cur) + '</b>, ' + (t.forecast <= b ? money(b - t.forecast, cur) + ' under' : money(t.forecast - b, cur) + ' over') + ' your budget.' : 'Type your budget on the left to track it.') + '</span></div>' +
      '<div class="btrack"><i class="sp ' + s.col + '" style="width:' + w1 + '%"></i><i class="td" style="width:' + w2 + '%"></i>' + (b ? '<em style="left:' + Math.min(100, b / scale * 100) + '%"><span>Budget ' + money(b, cur) + '</span></em>' : '') + '</div>' +
      '<div class="blg"><span><i class="sp ' + s.col + '"></i>Spent</span><span><i class="td"></i>Still to buy (estimated)</span>' + (b ? '<span><i class="bm"></i>Your budget</span>' : '') + '</div></div>';
    // the parts list
    h += '<div class="card blist"><div class="blist-h"><h3>Parts and materials <span class="muted small">' + list.length + ' item' + (list.length === 1 ? '' : 's') + '</span></h3>' +
      '<div class="row"><div class="seg" role="group" aria-label="Sort"><button type="button" data-sort="cat" aria-pressed="' + (sortBy === 'cat') + '">By category</button><button type="button" data-sort="cost" aria-pressed="' + (sortBy === 'cost') + '">By cost</button></div>' +
      '<button type="button" class="btn sm" data-cats>' + I.tag + 'Categories</button><button type="button" class="btn sm" data-csv>' + I.csv + 'BOM (spreadsheet)</button><button type="button" class="btn sm pr" data-bprint>' + I.print + 'Print or save as PDF</button></div></div>';
    h += '<div class="bscroll"><table class="btab"><thead><tr><th class="bn">Item</th><th>Category</th><th class="r" title="How many you bought, or will buy">Bought</th><th class="r" title="How many go into the finished product">Used</th><th class="r" title="The price per item you expected">Est. each</th><th class="r" title="What you actually paid per item. Leave it empty until you buy it">Paid each</th><th class="r">Spent</th><th class="r" title="The cost of the ones that go into the product">In product</th><th title="Tick if the spares can be used for something else">Spares reusable</th><th></th></tr></thead><tbody>';
    var rows = list.slice();
    if (sortBy === 'cost') rows.sort(function (a, b2) { var la = line(a), lb = line(b2); return (lb.spent + lb.todo) - (la.spent + la.todo); });
    var groups = sortBy === 'cat' ? cs.map(function (c2) { return { c: c2, xs: rows.filter(function (x) { return x.cat === c2.id; }) }; }).concat([{ c: null, xs: rows.filter(function (x) { return !d.cats[x.cat]; }) }]) : [{ c: null, xs: rows, flat: true }];
    groups.forEach(function (g) {
      if (!g.xs.length) return;
      if (!g.flat) { var gt = g.xs.reduce(function (a2, x) { var l = line(x); return a2 + l.spent + l.todo; }, 0); h += '<tr class="bgrp"><td colspan="10"><i style="background:' + (g.c ? g.c.color : '#6b7a90') + '"></i>' + esc(g.c ? g.c.name : 'No category') + '<span>' + money(gt, cur) + '</span></td></tr>'; }
      g.xs.forEach(function (x) {
        var l = line(x), b2 = bought(x);
        h += '<tr data-bid="' + x.id + '" class="' + (b2 ? 'isb' : 'notb') + '">' +
          '<td class="bn"><input data-f="name" value="' + esc(x.name) + '" maxlength="80" aria-label="Item">' + (x.supplier || x.link ? '<span class="bsup">' + esc(x.supplier || '') + (x.link ? ' <a href="' + esc(safeUrl(x.link)) + '" target="_blank" rel="noopener">link</a>' : '') + '</span>' : '') + '</td>' +
          '<td><select data-f="cat" aria-label="Category"><option value="">–</option>' + cs.map(function (c2) { return '<option value="' + c2.id + '"' + (x.cat === c2.id ? ' selected' : '') + '>' + esc(c2.name) + '</option>'; }).join('') + '<option value="__new">+ New category…</option></select></td>' +
          '<td class="r"><input data-f="qty" type="number" min="0" step="1" value="' + esc(x.qty) + '" aria-label="Bought"></td>' +
          '<td class="r"><input data-f="used" type="number" min="0" step="1" value="' + esc(x.used) + '" aria-label="Used"' + (num(x.used) > num(x.qty) ? ' class="warn" title="You\'re using more than you bought"' : '') + '></td>' +
          '<td class="r"><input data-f="est" type="number" min="0" step="0.01" value="' + esc(x.est) + '" aria-label="Estimated price each"></td>' +
          '<td class="r"><input data-f="paid" type="number" min="0" step="0.01" value="' + esc(x.paid == null ? '' : x.paid) + '" placeholder="not yet" aria-label="Paid each"></td>' +
          '<td class="r mono">' + (b2 ? money(l.spent, cur) : '<span class="muted" title="Estimated">~' + money(l.todo, cur) + '</span>') + '</td>' +
          '<td class="r mono">' + money(l.product, cur) + (l.spare ? '<span class="bspare">' + l.spare + ' spare' + (l.gave ? ', ' + l.gave + ' used elsewhere' : '') + '</span>' : '') + '</td>' +
          '<td class="c"><input type="checkbox" class="check" data-f="reuse"' + (x.reuse ? ' checked' : '') + ' aria-label="Spares can be used elsewhere"' + (l.spare ? '' : ' disabled title="No spares"') + '></td>' +
          '<td class="c"><button type="button" class="gmore" data-bopen aria-label="More about ' + esc(x.name) + '">' + IC.edit.replace(/width="18" height="18"/, 'width="15" height="15"') + '</button></td></tr>';
      });
    });
    h += '<tr class="badd"><td class="bn"><input id="bNew" maxlength="80" placeholder="Add an item, e.g. Rotary encoder" aria-label="New item"></td><td><select id="bNewC" aria-label="Category"><option value="">' + (cs.length ? 'No category' : 'Category…') + '</option>' + cs.map(function (c2, i) { return '<option value="' + c2.id + '"' + (i === 0 && lastCat !== '' && (!lastCat || lastCat === c2.id) || lastCat === c2.id ? ' selected' : '') + '>' + esc(c2.name) + '</option>'; }).join('') + '<option value="__new">+ New category…</option></select></td>' +
      '<td class="r"><input id="bNewQ" type="number" min="0" step="1" value="1" aria-label="How many"></td><td class="r"><input id="bNewU" type="number" min="0" step="1" value="1" aria-label="How many used"></td><td class="r"><input id="bNewP" type="number" min="0" step="0.01" placeholder="0.00" aria-label="Price each"></td>' +
      '<td colspan="5"><label class="row small" style="gap:6px;display:inline-flex"><input type="checkbox" class="check" id="bNewB">Already bought</label> <button type="button" class="btn sm pr" data-badd>' + IC.plus + 'Add</button></td></tr>';
    h += '</tbody><tfoot><tr><td class="bn"><b>Total</b></td><td></td><td></td><td></td><td class="r mono">' + money(t.est, cur) + '</td><td></td><td class="r mono"><b>' + money(t.spent, cur) + '</b>' + (t.todo ? '<span class="bspare">+ ~' + money(t.todo, cur) + ' to buy</span>' : '') + '</td><td class="r mono"><b>' + money(t.product, cur) + '</b></td><td colspan="2"></td></tr></tfoot></table></div>' +
      (list.length ? '' : '<p class="small muted" style="margin:10px 4px 0">Type the first thing you need above and press Enter. Put in what you expect it to cost; when you buy it, type what you actually paid. Need your own category? Pick “+ New category…” in the category box.</p>') + '</div>';
    // charts
    h += '<div class="bcharts">' + chartsHTML(d, pid, cur) + '</div>';
    // leftovers you can use elsewhere
    var spare = list.filter(function (x) { var l = line(x); return x.reuse && l.spare - l.gave > 0; });
    if (spare.length) h += '<div class="card bleft"><h3>' + I.box + 'Spares to use elsewhere</h3><p class="small muted" style="margin:-4px 0 10px">You bought more of these than this project needs. Use them for something else, or another project.</p><ul>' +
      spare.map(function (x) { var l = line(x), n = l.spare - l.gave; return '<li data-bid="' + x.id + '"><b>' + n + ' × ' + esc(x.name) + '</b><span class="muted small">worth ' + money(n * l.p, cur) + '</span>' + (others.length ? '<button type="button" class="btn sm" data-give>' + I.share + 'Use in another project</button>' : '') + '<button type="button" class="btn sm ghost" data-usedup>Used them up</button></li>'; }).join('') + '</ul></div>';
    h += '<div class="bopts"><label class="row small" style="gap:8px"><span class="muted">Currency</span><select id="bCur" style="width:auto">' + ['£', '€', '$', '₹', '¥'].map(function (k) { return '<option' + (k === cur ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label><button type="button" class="btn ghost sm danger" data-boff>Turn off the budget for this project</button></div>';
    return h + '</div>';
  }
  function safeUrl(u) { u = String(u || '').trim(); return /^https?:\/\//i.test(u) ? u : u ? 'https://' + u : ''; }

  /* ---------- charts: spend by category, estimate vs actual, and where the money went ---------- */
  function byCat(d, pid) {
    var out = cats(d, pid).map(function (c) { return { c: c, est: 0, spent: 0, todo: 0, product: 0, reusable: 0, wasted: 0 }; }), none = { c: { name: 'No category', color: '#6b7a90' }, est: 0, spent: 0, todo: 0, product: 0, reusable: 0, wasted: 0 };
    items(d, pid).forEach(function (x) { var r = out.filter(function (o) { return o.c.id === x.cat; })[0] || none, l = line(x); ['est', 'spent', 'todo', 'product', 'reusable', 'wasted'].forEach(function (k) { r[k] += l[k]; }); });
    return out.concat([none]).filter(function (r) { return r.est || r.spent || r.todo; });
  }
  function donut(rows, key, cur, label) {
    var tot = rows.reduce(function (a, r) { return a + r[key]; }, 0);
    if (!tot) return '<div class="bempty">Nothing to show yet.</div>';
    var R = 70, C = 2 * Math.PI * R, off = 0, segs = rows.filter(function (r) { return r[key] > 0; }).map(function (r) { var f = r[key] / tot, s = '<circle r="' + R + '" cx="90" cy="90" fill="none" stroke="' + r.c.color + '" stroke-width="30" stroke-dasharray="' + (f * C) + ' ' + C + '" stroke-dashoffset="' + (-off * C) + '" transform="rotate(-90 90 90)"><title>' + esc(r.c.name + ': ' + money(r[key], cur) + ' (' + Math.round(f * 100) + '%)') + '</title></circle>'; off += f; return s; }).join('');
    return '<div class="bdonut"><svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="' + esc(label) + '">' + segs + '<text x="90" y="86" text-anchor="middle" class="dt">' + esc(money(tot, cur)) + '</text><text x="90" y="106" text-anchor="middle" class="ds">' + esc(label) + '</text></svg>' +
      '<ul>' + rows.filter(function (r) { return r[key] > 0; }).sort(function (a, b) { return b[key] - a[key]; }).map(function (r) { return '<li><i style="background:' + r.c.color + '"></i><span>' + esc(r.c.name) + '</span><b>' + money(r[key], cur) + '</b><small>' + Math.round(r[key] / tot * 100) + '%</small></li>'; }).join('') + '</ul></div>';
  }
  function chartsHTML(d, pid, cur) {
    var rows = byCat(d, pid), anyB = rows.some(function (r) { return r.spent; });
    var mx = rows.reduce(function (m, r) { return Math.max(m, r.est, r.spent + r.todo); }, 1);
    var cmp = rows.length ? rows.map(function (r) {
      var act = r.spent + r.todo, diff = act - r.est;
      return '<div class="bcmp"><span class="bcn"><i style="background:' + r.c.color + '"></i>' + esc(r.c.name) + '</span><div class="bcb"><div><i class="e" style="width:' + (r.est / mx * 100) + '%"></i><span>' + money(r.est, cur) + '</span></div><div><i class="a" style="width:' + (r.spent / mx * 100) + '%;background:' + r.c.color + '"></i><i class="t" style="width:' + (r.todo / mx * 100) + '%;--c:' + r.c.color + '"></i><span>' + money(act, cur) + '</span></div></div>' +
        '<span class="bdiff ' + (diff > 0.004 ? 'up' : diff < -0.004 ? 'down' : '') + '">' + (Math.abs(diff) < 0.005 ? 'as planned' : (diff > 0 ? '+' : '−') + money(Math.abs(diff), cur).replace(/^−/, '')) + '</span></div>';
    }).join('') : '<div class="bempty">Add some items to compare.</div>';
    var tp = rows.reduce(function (m, r) { return Math.max(m, r.product + r.reusable + r.wasted); }, 1);
    var where = rows.length ? rows.map(function (r) {
      var all = r.product + r.reusable + r.wasted; if (!all) return '';
      return '<div class="bcmp"><span class="bcn"><i style="background:' + r.c.color + '"></i>' + esc(r.c.name) + '</span><div class="bcb one"><div><i class="p" style="width:' + (r.product / tp * 100) + '%;background:' + r.c.color + '"></i><i class="ru" style="width:' + (r.reusable / tp * 100) + '%;--c:' + r.c.color + '"></i><i class="w" style="width:' + (r.wasted / tp * 100) + '%"></i><span>' + money(all, cur) + '</span></div></div></div>';
    }).join('') : '<div class="bempty">Add some items first.</div>';
    return '<div class="card bchart"><h3>' + (anyB ? 'Where the money went' : 'Where the money will go') + '</h3>' + donut(rows, anyB ? 'spent' : 'est', cur, anyB ? 'spent' : 'estimated') + '</div>' +
      '<div class="card bchart"><h3>Estimated vs actual</h3><p class="small muted">Top bar: what you planned to spend. Bottom bar: what it really cost (faded = not bought yet, so still the estimate).</p>' + cmp + '</div>' +
      '<div class="card bchart"><h3>In the product vs spares</h3><p class="small muted">Solid: in the product. Striped: spares you can reuse. Grey: spares you can\'t.</p>' + where + '</div>';
  }

  /* ---------- wiring ---------- */
  function wire(v, pid, ctx) {
    var d0 = data();
    function rerender() { A.render(); }
    function setItem(id, f, val) { var d = data(), x = d.items[id]; if (!x) return; x[f] = val; save(d); }
    var bb = $('#bBudget', v); bb.onchange = function () { var d = data(); d.projects[pid].budget = Math.max(0, num(bb.value)); save(d); rerender(); };
    $('#bCur', v).onchange = function () { var d = data(); d.projects[pid].cur = this.value; save(d); rerender(); };
    $$('[data-sort]', v).forEach(function (b) { b.onclick = function () { sortBy = b.getAttribute('data-sort'); rerender(); }; });
    $('[data-cats]', v).onclick = function () { catsDlg(pid); };
    $('[data-csv]', v).onclick = function () { exportCSV(pid, ctx.name()); };
    $('[data-bprint]', v).onclick = function () { printBOM(pid, ctx.name()); };
    $('[data-boff]', v).onclick = function () { disable(pid); ctx.leave(); toast('Budget turned off. Your items are kept if you turn it on again.'); };
    // edit cells in place; after a change, redraw and put you back in the box you moved to
    $$('tr[data-bid]', v).forEach(function (tr) {
      var id = tr.getAttribute('data-bid');
      $$('[data-f]', tr).forEach(function (inp) {
        var f = inp.getAttribute('data-f');
        if (f === 'cat') inp.dataset.was = inp.value;
        inp.addEventListener('change', function () {
          var val = inp.type === 'checkbox' ? inp.checked : inp.value;
          if (f === 'cat' && val === '__new') { inp.value = inp.dataset.was || ''; newCatDlg(pid, function (cid) { setItem(id, 'cat', cid); rerender(); }); return; }
          if (f === 'name') { val = String(val).trim().slice(0, 80); if (!val) { inp.value = data().items[id].name; return; } }
          if (f === 'qty' || f === 'used') val = val === '' ? 0 : Math.max(0, Math.round(num(val)));
          if (f === 'est') val = val === '' ? 0 : Math.max(0, num(val));
          if (f === 'paid') val = val === '' ? null : Math.max(0, num(val));
          setItem(id, f, val);
          setTimeout(function () { var a = document.activeElement, tr2 = a && a.closest && a.closest('tr[data-bid]'); keepFocus = tr2 ? { id: tr2.getAttribute('data-bid'), sel: a.getAttribute('data-f') ? '[data-f="' + a.getAttribute('data-f') + '"]' : a.hasAttribute('data-bopen') ? '[data-bopen]' : '' } : a && a.id ? { el: a.id } : null; rerender(); }, 0);
        });
        if (inp.tagName === 'INPUT' && inp.type !== 'checkbox') inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') inp.blur(); });
      });
      tr.querySelector('[data-bopen]').onclick = function () { itemDlg(pid, id); };
    });
    if (keepFocus) { var kf = keepFocus; keepFocus = null; var el = kf.el ? document.getElementById(kf.el) : (kf.sel ? v.querySelector('tr[data-bid="' + kf.id + '"] ' + kf.sel) : null); if (el) { el.focus(); if (el.select) try { el.select(); } catch (e) {} } }
    // quick add
    var nb = $('#bNew', v);
    function add() {
      var n = nb.value.trim(); if (!n) return nb.focus();
      var d = data(), id = 'b' + uid(), q = Math.max(0, Math.round(num($('#bNewQ', v).value) || 1)), u = $('#bNewU', v).value === '' ? q : Math.min(q, Math.max(0, Math.round(num($('#bNewU', v).value)))), p = Math.max(0, num($('#bNewP', v).value));
      d.items[id] = { id: id, proj: pid, cat: $('#bNewC', v).value, name: n.slice(0, 80), supplier: '', link: '', qty: q, used: u, est: p, paid: $('#bNewB', v).checked ? p : null, reuse: q > u, gave: 0, note: '', o: items(d, pid).length, t: Date.now() };
      lastCat = $('#bNewC', v).value; save(d); keepFocus = { el: 'bNew' }; rerender();
      if (q > u) toast('Bought ' + q + ', using ' + u + ': ' + (q - u === 1 ? 'the spare one is' : 'the ' + (q - u) + ' spares are') + ' counted as left over.');
    }
    $('[data-badd]', v).onclick = add;
    ['#bNew', '#bNewQ', '#bNewU', '#bNewP'].forEach(function (s) { $(s, v).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } }); });
    $('#bNewC', v).addEventListener('change', function () {
      var sel = this; if (sel.value !== '__new') { lastCat = sel.value; return; }
      sel.value = lastCat && data().cats[lastCat] ? lastCat : '';
      newCatDlg(pid, function (cid, c) {
        // add it to every dropdown without redrawing, so what you've typed in the add row stays
        $$('select[data-f="cat"], #bNewC', v).forEach(function (s2) { var o = document.createElement('option'); o.value = cid; o.textContent = c.name; s2.insertBefore(o, s2.querySelector('option[value="__new"]')); });
        sel.value = cid; lastCat = cid; $('#bNew', v).focus();
      });
    });
    $('#bNewQ', v).addEventListener('input', function () { var u = $('#bNewU', v); if (num(u.value) > num(this.value) || u.dataset.touched !== '1') u.value = this.value; });
    $('#bNewU', v).addEventListener('input', function () { this.dataset.touched = '1'; });
    // spares
    $$('.bleft [data-bid]', v).forEach(function (li) {
      var id = li.getAttribute('data-bid'), g = li.querySelector('[data-give]');
      if (g) g.onclick = function () { giveDlg(pid, id, ctx.others()); };
      li.querySelector('[data-usedup]').onclick = function () { var d = data(), x = d.items[id]; if (!x) return; var l = line(x); x.gave = l.spare; save(d); rerender(); toast('Marked as used up.'); };
    });
  }

  function itemDlg(pid, id) {
    var d = data(), x = d.items[id]; if (!x) return; var cur = (cfg(d, pid) || {}).cur || '£';
    var m = modal('<h2>' + esc(x.name) + '</h2><div class="fields">' +
      '<div><label class="f" for="iN">Item</label><input type="text" id="iN" maxlength="80" value="' + esc(x.name) + '"></div>' +
      '<div class="row"><div class="grow"><label class="f" for="iS">Where from (shop or website)</label><input type="text" id="iS" maxlength="60" value="' + esc(x.supplier || '') + '" placeholder="e.g. Rapid Electronics"></div><div class="grow"><label class="f" for="iL">Link</label><input type="text" id="iL" maxlength="400" value="' + esc(x.link || '') + '" placeholder="https://…"></div></div>' +
      '<div class="row"><div class="grow"><label class="f" for="iQ">How many bought</label><input type="number" id="iQ" min="0" step="1" value="' + esc(x.qty) + '"></div><div class="grow"><label class="f" for="iU">How many in the product</label><input type="number" id="iU" min="0" step="1" value="' + esc(x.used) + '"></div></div>' +
      '<div class="row"><div class="grow"><label class="f" for="iE">Price each you expected (' + esc(cur) + ')</label><input type="number" id="iE" min="0" step="0.01" value="' + esc(x.est) + '"></div><div class="grow"><label class="f" for="iP">Price each you paid (' + esc(cur) + ')</label><input type="number" id="iP" min="0" step="0.01" value="' + esc(x.paid == null ? '' : x.paid) + '" placeholder="Leave empty until you buy it"></div></div>' +
      '<label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" class="check" id="iR"' + (x.reuse ? ' checked' : '') + '>The spares can be used for something else</label>' +
      '<div><label class="f" for="iNo">Notes</label><textarea id="iNo" maxlength="1000" style="min-height:60px" placeholder="Size, colour, part number…">' + esc(x.note || '') + '</textarea></div>' +
      '</div><div class="foot"><button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete</button><button type="button" class="btn pr" data-s>Save</button></div>');
    var B = m.box;
    B.querySelector('[data-s]').onclick = function () {
      var dd = data(), y = dd.items[id]; if (!y) return m.close();
      var n = $('#iN', B).value.trim(); if (!n) return $('#iN', B).focus();
      var q = Math.max(0, Math.round(num($('#iQ', B).value))), pv = $('#iP', B).value;
      Object.assign(y, { name: n.slice(0, 80), supplier: $('#iS', B).value.trim(), link: $('#iL', B).value.trim(), qty: q, used: Math.max(0, Math.round(num($('#iU', B).value))), est: Math.max(0, num($('#iE', B).value)), paid: pv === '' ? null : Math.max(0, num(pv)), reuse: $('#iR', B).checked, note: $('#iNo', B).value.trim() });
      save(dd); m.close(); A.render();
    };
    B.querySelector('[data-del]').onclick = function () { var dd = data(), old = dd.items[id]; delete dd.items[id]; save(dd); m.close(); A.render(); toast('Deleted.', 'Undo', function () { var d3 = data(); d3.items[id] = old; save(d3); A.render(); }); };
  }
  function giveDlg(pid, id, others) {
    var d = data(), x = d.items[id]; if (!x) return; var l = line(x), n = l.spare - l.gave;
    var m = modal('<h2>Use spares in another project</h2><p class="muted">You have <b>' + n + ' × ' + esc(x.name) + '</b> left over. They go into the other project\'s budget at no cost, because this project already paid for them.</p><div class="fields">' +
      '<div class="row"><div class="grow"><label class="f" for="gP">Project</label><select id="gP">' + others.map(function (o) { return '<option value="' + o.id + '">' + esc(o.name) + '</option>'; }).join('') + '</select></div><div><label class="f" for="gN">How many</label><input type="number" id="gN" min="1" max="' + n + '" step="1" value="' + n + '" style="width:100px"></div></div></div>' +
      '<div class="foot"><button type="button" class="btn pr" data-s>Move them</button></div>');
    var B = m.box;
    B.querySelector('[data-s]').onclick = function () {
      var k = Math.max(1, Math.min(n, Math.round(num($('#gN', B).value)))), to = $('#gP', B).value, dd = data(), y = dd.items[id]; if (!y) return m.close();
      var other = others.filter(function (o) { return o.id === to; })[0];
      if (!cfg(dd, to) || !dd.projects[to].on) { save(dd); enable(to, other && other.type, null); dd = data(); y = dd.items[id]; }
      var src = (A.projectName && A.projectName(pid)) || 'another project', cat = cats(dd, to).filter(function (c) { var mine = dd.cats[y.cat]; return mine && c.name.toLowerCase() === mine.name.toLowerCase(); })[0];
      var nid = 'b' + uid(); dd.items[nid] = { id: nid, proj: to, cat: cat ? cat.id : '', name: y.name, supplier: y.supplier || '', link: y.link || '', qty: k, used: k, est: 0, paid: 0, reuse: false, gave: 0, note: 'Spares from ' + src + ' (already paid for there).', o: items(dd, to).length, t: Date.now() };
      y.gave = num(y.gave) + k; save(dd); m.close(); A.render(); toast(k + ' × ' + y.name + ' moved to ' + (other ? other.name : 'the other project') + '.');
    };
  }
  /* make up a category: a name and a colour */
  function newCatDlg(pid, done) {
    var d = data(), used = cats(d, pid).map(function (c) { return c.color; }), col = CCOLS.filter(function (c) { return used.indexOf(c) < 0; })[0] || CCOLS[cats(d, pid).length % CCOLS.length];
    var m = modal('<h2>New category</h2><div class="fields"><div><label class="f" for="ncN">Name</label><input type="text" id="ncN" maxlength="40" autofocus placeholder="e.g. 3D printing, Fabric, Sensors"></div>' +
      '<div><div class="f lbl">Colour</div><div class="pcols">' + CCOLS.map(function (c) { return '<button type="button" data-col="' + c + '" style="--c:' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + (c === col) + '"></button>'; }).join('') + '</div></div></div>' +
      '<div class="foot"><button type="button" class="btn pr" data-s>' + IC.plus + 'Add category</button></div>');
    var B = m.box;
    $$('[data-col]', B).forEach(function (b) { b.onclick = function () { col = b.getAttribute('data-col'); $$('[data-col]', B).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }; });
    B.querySelector('[data-s]').onclick = function () {
      var n = $('#ncN', B).value.trim(); if (!n) return $('#ncN', B).focus();
      var dd = data(), same = cats(dd, pid).filter(function (c) { return c.name.toLowerCase() === n.toLowerCase(); })[0];
      if (same) { m.close(); done(same.id, same); return; }
      var id = 'c' + uid(); dd.cats[id] = { id: id, proj: pid, name: n.slice(0, 40), color: col, o: cats(dd, pid).length, t: Date.now() };
      save(dd); m.close(); done(id, dd.cats[id]);
    };
    $('#ncN', B).onkeydown = function (e) { if (e.key === 'Enter') B.querySelector('[data-s]').click(); };
  }
  function catsDlg(pid) {
    var d = data(), cs = cats(d, pid);
    function rowH(c) { return '<div class="krow" data-cid="' + (c.id || '') + '"><input type="color" value="' + (c.color || '#6b7a90') + '" aria-label="Colour"><input type="text" maxlength="40" value="' + esc(c.name || '') + '" placeholder="e.g. Electronics"><button type="button" class="iconbtn" data-rm aria-label="Remove">' + IC.trash + '</button></div>'; }
    var m = modal('<h2>Categories</h2><p class="small muted" style="margin:-6px 0 12px">Sort your spending into groups. The charts and the BOM use them.</p><div class="klist">' + cs.map(rowH).join('') + '</div><button type="button" class="btn sm" data-addc style="margin-top:8px">' + IC.plus + 'Add a category</button><div class="foot"><button type="button" class="btn pr" data-s>Save</button></div>');
    var B = m.box;
    function wireRm() { $$('[data-rm]', B).forEach(function (b) { b.onclick = function () { b.parentNode.parentNode.removeChild(b.parentNode); }; }); }
    wireRm();
    B.querySelector('[data-addc]').onclick = function () { var used = $$('.krow input[type=color]', B).map(function (i) { return i.value; }); var div = document.createElement('div'); div.innerHTML = rowH({ color: CCOLS.filter(function (c) { return used.indexOf(c) < 0; })[0] || '#6b7a90' }); $('.klist', B).appendChild(div.firstChild); wireRm(); $$('.krow input[type=text]', B).pop().focus(); };
    B.querySelector('[data-s]').onclick = function () {
      var dd = data(), keep = {};
      $$('.krow', B).forEach(function (r, i) { var n = r.querySelector('input[type=text]').value.trim(); if (!n) return; var id = r.getAttribute('data-cid') || 'c' + uid() + i; keep[id] = 1; dd.cats[id] = Object.assign(dd.cats[id] || { id: id, proj: pid, t: Date.now() }, { name: n.slice(0, 40), color: r.querySelector('input[type=color]').value, o: i }); });
      cats(dd, pid).forEach(function (c) { if (!keep[c.id]) { delete dd.cats[c.id]; items(dd, pid).forEach(function (x) { if (x.cat === c.id) x.cat = ''; }); } });
      save(dd); m.close(); A.render();
    };
  }

  /* ---------- exports: the BOM as a spreadsheet, and a printable BOM with the charts ---------- */
  function bomRows(pid) {
    var d = data(), cs = cats(d, pid), list = items(d, pid).slice().sort(function (a, b) { var ca = d.cats[a.cat], cb = d.cats[b.cat]; return ((ca ? ca.o : 99) - (cb ? cb.o : 99)) || byO(a, b); });
    return list.map(function (x, i) { var l = line(x), c = d.cats[x.cat]; return { n: i + 1, x: x, l: l, cat: c ? c.name : '' }; });
  }
  function exportCSV(pid, name) {
    var d = data(), s = state(pid), cur = s.cur, t = s.t;
    function q(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    function m2(n) { return (Math.round(n * 100) / 100).toFixed(2); }
    var out = [['Bill of materials: ' + name], ['Currency', cur], [], ['#', 'Item', 'Category', 'Supplier', 'Link', 'Qty bought', 'Qty used', 'Estimated each', 'Paid each', 'Spent', 'Cost in product', 'Spares', 'Spares reusable', 'Notes']];
    bomRows(pid).forEach(function (r) { out.push([r.n, r.x.name, r.cat, r.x.supplier || '', r.x.link || '', r.l.q, r.l.u, m2(num(r.x.est)), bought(r.x) ? m2(num(r.x.paid)) : '', bought(r.x) ? m2(r.l.spent) : '', m2(r.l.product), r.l.spare, r.l.spare ? (r.x.reuse ? 'yes' : 'no') : '', r.x.note || '']); });
    out.push([], ['', 'Total estimated', '', '', '', '', '', '', '', m2(t.est)], ['', 'Total spent', '', '', '', '', '', '', '', m2(t.spent)], ['', 'Still to buy (estimated)', '', '', '', '', '', '', '', m2(t.todo)], ['', 'Cost of the product', '', '', '', '', '', '', '', '', m2(t.product)], ['', 'Left over (spares)', '', '', '', '', '', '', '', m2(t.spareVal)]);
    if (s.budget) out.push(['', 'Budget', '', '', '', '', '', '', '', m2(s.budget)], ['', 'Budget left', '', '', '', '', '', '', '', m2(s.budget - t.spent)]);
    var csv = '﻿' + out.map(function (r) { return r.map(q).join(','); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = (name || 'project').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '-bom.csv';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 500);
    toast('BOM saved. It opens in Excel, Google Sheets or Numbers.');
  }
  function printBOM(pid, name) {
    var d = data(), s = state(pid), cur = s.cur, t = s.t;
    function m(n) { return money(n, cur); }
    var rows = bomRows(pid).map(function (r) { return '<tr><td>' + r.n + '</td><td><b>' + esc(r.x.name) + '</b>' + (r.x.supplier ? '<br><small>' + esc(r.x.supplier) + '</small>' : '') + '</td><td>' + esc(r.cat) + '</td><td class="r">' + r.l.q + '</td><td class="r">' + r.l.u + '</td><td class="r">' + m(num(r.x.est)) + '</td><td class="r">' + (bought(r.x) ? m(num(r.x.paid)) : '–') + '</td><td class="r">' + (bought(r.x) ? m(r.l.spent) : '<i>~' + m(r.l.todo) + '</i>') + '</td><td class="r">' + m(r.l.product) + '</td><td>' + (r.l.spare ? r.l.spare + (r.x.reuse ? ' (reusable)' : '') : '') + '</td></tr>'; }).join('');
    var css = 'body{font:12px/1.45 Helvetica,Arial,sans-serif;color:#0b2236;margin:0}h1{font-size:22px;margin:0 0 2px}h3{font-size:14px;margin:0 0 8px}.sub{color:#4a6178;margin-bottom:14px}' +
      'table{width:100%;border-collapse:collapse;margin-bottom:14px}th{background:#eef3f8;text-align:left;font-size:11px;padding:6px}td{padding:5px 6px;border-bottom:1px solid #e3e9ef;vertical-align:top}.r{text-align:right;white-space:nowrap}small{color:#6b7f93}tfoot td{font-weight:700;border-top:2px solid #9fb1c3}' +
      '.stats{display:flex;gap:10px;margin-bottom:14px}.stats div{flex:1;border:1px solid #d5dee7;border-radius:8px;padding:8px 10px}.stats b{display:block;font-size:17px}.stats span{font-size:10.5px;color:#4a6178}' +
      '.charts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}.card{border:1px solid #d5dee7;border-radius:8px;padding:10px;break-inside:avoid}.muted{color:#6b7f93}.small{font-size:10.5px}' + chartCSS() + '@page{size:A4 landscape;margin:10mm}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}';
    var body = '<h1>' + esc(name) + ': bill of materials and budget</h1><div class="sub">Printed ' + esc(A.niceDate(A.today(), true)) + (s.budget ? ' · Budget ' + m(s.budget) : '') + '</div>' +
      '<div class="stats">' + (s.budget ? '<div><span>Budget</span><b>' + m(s.budget) + '</b></div>' : '') + '<div><span>Spent</span><b>' + m(t.spent) + '</b></div><div><span>Still to buy (est.)</span><b>' + m(t.todo) + '</b></div><div><span>Cost of the product</span><b>' + m(t.product) + '</b></div><div><span>Left over</span><b>' + m(t.spareVal) + '</b></div>' + (s.budget ? '<div><span>Budget left</span><b>' + m(s.budget - t.spent) + '</b></div>' : '') + '</div>' +
      '<table><thead><tr><th>#</th><th>Item</th><th>Category</th><th class="r">Bought</th><th class="r">Used</th><th class="r">Est. each</th><th class="r">Paid each</th><th class="r">Spent</th><th class="r">In product</th><th>Spares</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td></td><td>Total</td><td></td><td></td><td></td><td class="r">' + m(t.est) + '</td><td></td><td class="r">' + m(t.spent) + '</td><td class="r">' + m(t.product) + '</td><td></td></tr></tfoot></table>' +
      '<div class="charts">' + chartsHTML(d, pid, cur) + '</div>';
    var f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
    var doc = f.contentWindow.document; doc.open(); doc.write('<!DOCTYPE html><html><head><title>' + esc(name) + ' BOM</title><style>' + css + '</style></head><body>' + body + '</body></html>'); doc.close();
    setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 2000); }, 250);
  }
  /* the chart styles, shared by the page (budget.css has the rest) and the printout */
  function chartCSS() {
    return '.bdonut{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.bdonut svg{flex:none}.bdonut .dt{font:800 17px Helvetica,Arial,sans-serif;fill:#0b2236}.bdonut .ds{font:11px Helvetica,Arial,sans-serif;fill:#6b7f93}' +
      '.bdonut ul{list-style:none;margin:0;padding:0;display:grid;gap:4px;flex:1;min-width:150px}.bdonut li{display:flex;align-items:center;gap:7px;font-size:12px}.bdonut li i{width:10px;height:10px;border-radius:3px;flex:none}.bdonut li span{flex:1}.bdonut li small{width:34px;text-align:right;color:#6b7f93}' +
      '.bcmp{display:grid;grid-template-columns:110px minmax(0,1fr) 72px;gap:8px;align-items:center;margin:8px 0;font-size:12px}.bcn{display:flex;align-items:center;gap:6px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.bcn i{width:9px;height:9px;border-radius:3px;flex:none}' +
      '.bcb{display:grid;gap:3px}.bcb>div{display:flex;align-items:center;gap:6px;height:12px}.bcb>div span{font-size:10.5px;color:#6b7f93;white-space:nowrap}.bcb.one>div{height:16px}' +
      '.bcb i{display:block;height:100%;border-radius:3px}.bcb i.e{background:#c6d2de}.bcb i.t{background:repeating-linear-gradient(135deg,var(--c) 0 3px,transparent 3px 6px);opacity:.55;border-radius:0 3px 3px 0}' +
      '.bcb i.ru{background:repeating-linear-gradient(135deg,var(--c) 0 4px,transparent 4px 7px);opacity:.7}.bcb i.w{background:#b4bfca}.bcb.one i{border-radius:0}.bcb.one i:first-child{border-radius:3px 0 0 3px}' +
      '.bdiff{font-size:11px;font-weight:700;text-align:right;color:#6b7f93}.bdiff.up{color:#d6453d}.bdiff.down{color:#17803d}.bempty{color:#6b7f93;font-size:12px;padding:16px 0}';
  }

  /* the first time: switch the budget on for a project */
  function setupDlg(pid, type, after) {
    var c = cfg(data(), pid) || {};
    var m = modal('<h2>Budget builder</h2><p class="muted" style="margin-top:-4px">Keep track of what you buy for this project: what it cost, what ends up in the product, and what\'s left over. The dot by your project goes <span class="bdot ok"></span> green, <span class="bdot warn"></span> amber at 70% of your budget and <span class="bdot bad"></span> red past 90%.</p><div class="fields">' +
      '<div class="row"><div><label class="f" for="sCur">Currency</label><select id="sCur" style="width:auto">' + ['£', '€', '$', '₹', '¥'].map(function (k) { return '<option' + (k === (c.cur || '£') ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></div>' +
      '<div class="grow"><label class="f" for="sAmt">Your budget (you can leave it empty and add it later)</label><input type="number" id="sAmt" min="0" step="1" inputmode="decimal" autofocus value="' + (c.budget || '') + '" placeholder="e.g. 60"></div></div>' +
      (c.seeded ? '' : '<div><div class="f lbl">Categories for your spending</div><div class="seg" role="group" aria-label="Categories"><button type="button" data-own="0" aria-pressed="true">Suggest some for me</button><button type="button" data-own="1" aria-pressed="false">I\'ll make my own</button></div><p class="small muted" id="sOwnHint" style="margin:6px 0 0">' + esc((DEFCATS[type] || DEFCATS.other).join(', ')) + '. You can rename, add or remove them any time.</p></div>') + '</div>' +
      '<div class="foot"><button type="button" class="btn pr" data-s>' + I.pound + 'Start my budget</button></div>');
    var B = m.box;
    var own = false;
    $$('[data-own]', B).forEach(function (b) { b.onclick = function () { own = b.getAttribute('data-own') === '1'; $$('[data-own]', B).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); $('#sOwnHint', B).textContent = own ? 'Start with none. Pick "+ New category…" in any category box to make one up as you go.' : (DEFCATS[type] || DEFCATS.other).join(', ') + '. You can rename, add or remove them any time.'; }; });
    B.querySelector('[data-s]').onclick = function () { var v = $('#sAmt', B).value; enable(pid, type, v === '' ? (c.budget || 0) : Math.max(0, num(v)), $('#sCur', B).value, own); m.close(); if (after) after(); };
    $('#sAmt', B).onkeydown = function (e) { if (e.key === 'Enter') B.querySelector('[data-s]').click(); };
  }

  try { var st = document.createElement('style'); st.textContent = chartCSS(); document.head.appendChild(st); } catch (e) {}
  return { on: on, state: state, dot: dot, html: html, wire: wire, setupDlg: setupDlg, enable: enable, disable: disable, chartCSS: chartCSS };
};
