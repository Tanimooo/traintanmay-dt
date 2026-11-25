/* TrainTanmay Focus: the project planner (NEA, EPQ or any project), drawn as a Gantt chart.
   Steps go down the left; you draw when each one happens straight onto the timeline, like notes on a piano roll.
   Kept in localStorage as tt-focus-plan, synced with everything else in Focus by save.js:
     { projects: {id: {id, name, type, color, start, end, notes, o, t}},
       keys:     {id: {id, proj, name, color, o}}           colour key (what each colour means)
       layers:   {id: {id, proj, name, hidden, o}}          groups of steps (e.g. Practical, Portfolio) you can show, hide or overlay
       steps:    {id: {id, proj, layer, key, kind: step|milestone|note, title, start, end, pct, note, cal, as, ae, o, t,
                       log: {id: {d, pct, text}}}} }
   Loaded before focus.js, which calls window.ttPlanner(api) with its helpers and the calendar hooks. */
window.ttPlanner = function (A) {
  'use strict';
  var $ = A.$, $$ = A.$$, esc = A.esc, iso = A.iso, parseISO = A.parseISO, today = A.today, addDays = A.addDays, monday = A.monday,
    daysBetween = A.daysBetween, niceDate = A.niceDate, MON = A.MON, IC = A.IC, ic = A.ic, modal = A.modal, toast = A.toast, uid = A.uid;
  var KEY = 'tt-focus-plan';
  var PCOLS = ['#1f5fbf', '#c81e66', '#c2410c', '#1a7f45', '#7a5af5', '#0f9fb0', '#d9a300', '#e0457b', '#5b8c1a', '#6b7a90'];
  var I = {
    grip: ic('<circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="15" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="18" r="1.2" fill="currentColor"/><circle cx="15" cy="18" r="1.2" fill="currentColor"/>', 16),
    more: ic('<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>', 16),
    diamond: ic('<path d="M12 3l9 9-9 9-9-9z"/>'), note: ic('<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/>'),
    layers: ic('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'), key: ic('<circle cx="7" cy="8" r="2.5" fill="currentColor"/><circle cx="7" cy="16" r="2.5"/><path d="M12 8h8M12 16h8"/>'),
    download: ic('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'), print: ic('<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>'),
    overlay: ic('<rect x="3" y="6" width="12" height="5" rx="2"/><rect x="9" y="13" width="12" height="5" rx="2"/>'),
    chart: ic('<path d="M4 6h8M7 11h10M10 16h9"/><path d="M3 3v18"/>'), up: ic('<path d="M6 15l6-6 6 6"/>'), down: ic('<path d="M6 9l6 6 6-6"/>'),
    cam: ic('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    copy: ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
    eye: ic('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'), log: ic('<path d="M4 19h16M6 15l4-4 3 3 6-7"/>')
  };

  /* ---------- data ---------- */
  function data() { var d = A.getJ(KEY, {}); d.projects = d.projects || {}; d.keys = d.keys || {}; d.layers = d.layers || {}; d.steps = d.steps || {}; return d; }
  function save(d) { A.putJ(KEY, d); }
  function vals(o) { return Object.keys(o || {}).map(function (k) { return o[k]; }); }
  function byO(a, b) { return (a.o || 0) - (b.o || 0) || (a.t || 0) - (b.t || 0); }
  function projects(d) { return vals(d.projects).sort(byO); }
  function keysOf(d, pid) { return vals(d.keys).filter(function (k) { return k.proj === pid; }).sort(byO); }
  function layersOf(d, pid) { var l = vals(d.layers).filter(function (k) { return k.proj === pid; }).sort(byO); return l; }
  function stepsOf(d, pid) { return vals(d.steps).filter(function (s) { return s.proj === pid; }).sort(byO); }
  function okCol(c) { return /^#[0-9a-f]{6}$/i.test(c || '') ? c : null; }
  function stepCol(d, s) { var k = s.key && d.keys[s.key]; return (k && okCol(k.color)) || (d.projects[s.proj] && okCol(d.projects[s.proj].color)) || '#2186d8'; }
  function firstLayer(d, pid) { var l = layersOf(d, pid)[0]; if (l) return l.id; var id = 'l' + uid(); d.layers[id] = { id: id, proj: pid, name: 'Steps', o: 0, t: Date.now() }; return id; }
  function maxO(list) { return list.reduce(function (m, x) { return Math.max(m, x.o || 0); }, 0); }
  function pp() { var p = A.prefs().plan || {}; return { cur: p.cur || '', zoom: p.zoom || 'week', overlay: !!p.overlay, actual: p.actual !== false, hint: p.hint !== false, ai: p.ai !== false }; }
  function setPP(k, v) { var p = A.prefs().plan || {}; p[k] = v; A.setPref('plan', p); }
  function curProj(d) { var c = pp().cur, ps = projects(d); if (c === 'all' && ps.length > 1) return 'all'; return d.projects[c] ? c : ps.length ? ps[0].id : ''; }
  function days(a, b) { return daysBetween(a, b); }
  function len(s) { return s.start && s.end ? days(s.start, s.end) + 1 : 0; }
  function lenText(n) { return n + ' day' + (n === 1 ? '' : 's') + (n >= 14 ? ' (about ' + Math.round(n / 7) + ' weeks)' : ''); }
  function projPct(d, pid) {
    var ss = stepsOf(d, pid).filter(function (s) { return s.kind !== 'note' && (s.kind === 'milestone' || len(s)); }), tot = 0, got = 0;
    ss.forEach(function (s) { var w = s.kind === 'milestone' ? 1 : len(s); tot += w; got += w * (s.pct || 0) / 100; });
    return tot ? Math.round(got / tot * 100) : 0;
  }
  function late(s) { var t = today(); return s.kind !== 'note' && (s.pct || 0) < 100 && (s.kind === 'milestone' ? s.start : s.end) && (s.kind === 'milestone' ? s.start : s.end) < t; }

  /* ---------- templates: the usual steps, spread across the time you have ---------- */
  var TPL = {
    nea: {
      name: 'DT NEA', keys: [['Research', '#1f5fbf'], ['Designing', '#7a5af5'], ['Making', '#c2410c'], ['Testing', '#1a7f45'], ['Write-up', '#6b7a90']],
      layers: ['Portfolio', 'Practical'],
      steps: [
        // title, key, layer, from, to (fractions of the time you have), kind
        ['A: Identify and investigate the problem', 0, 0, 0, .1], ['Client and user research', 0, 0, .03, .12], ['Research existing products', 0, 0, .06, .14],
        ['B: Design brief and specification', 1, 0, .13, .18], ['Brief and spec signed off', 1, 0, .18, .18, 'milestone'],
        ['C: Initial design ideas', 1, 0, .18, .3], ['D: Develop the design', 1, 0, .28, .45], ['Models and prototypes', 2, 1, .32, .48],
        ['Final design and drawings', 1, 0, .45, .52], ['Plan the making (cutting lists, sequence)', 2, 0, .5, .54],
        ['E: Make the final prototype', 2, 1, .54, .82], ['Prototype finished', 2, 1, .82, .82, 'milestone'],
        ['F: Test with the client and users', 3, 1, .8, .88], ['Evaluate and suggest improvements', 3, 0, .86, .94],
        ['Keep the portfolio up to date', 4, 0, .02, .9], ['Final check of the portfolio', 4, 0, .93, .99]
      ]
    },
    epq: {
      name: 'EPQ', keys: [['Planning', '#1f5fbf'], ['Research', '#0f9fb0'], ['Producing', '#c2410c'], ['Reviewing', '#1a7f45'], ['Presenting', '#c81e66']],
      layers: ['Project', 'Production log'],
      steps: [
        ['Choose a topic and a question', 0, 0, 0, .06], ['Project proposal form', 0, 0, .05, .1], ['Proposal approved', 0, 0, .1, .1, 'milestone'],
        ['Find and check sources', 1, 0, .1, .3], ['Literature review', 1, 0, .25, .4], ['Mid-project review', 3, 1, .45, .45, 'milestone'],
        ['Write the report or make the artefact', 2, 0, .4, .75], ['Draft finished', 2, 0, .75, .75, 'milestone'],
        ['Redraft and reference properly', 3, 0, .75, .85], ['Evaluate the project', 3, 0, .84, .9],
        ['Prepare the presentation', 4, 0, .88, .95], ['Give the presentation', 4, 0, .96, .96, 'milestone'],
        ['Keep the production log', 3, 1, .02, .97]
      ]
    },
    other: { name: 'Project', keys: [['Planning', '#1f5fbf'], ['Doing', '#c2410c'], ['Checking', '#1a7f45']], layers: ['Steps'], steps: [] }
  };
  function defaultEnd() { var t = parseISO(today()), y = t.getFullYear() + (t.getMonth() >= 3 ? 1 : 0); return y + '-05-08'; }
  function makeProject(o) {
    var d = data(), pid = 'p' + uid(), tp = TPL[o.type] || TPL.other, now = Date.now(), used = projects(d).map(function (p) { return p.color; });
    d.projects[pid] = { id: pid, name: o.name, type: o.type, color: o.color || PCOLS.filter(function (c) { return used.indexOf(c) < 0; })[0] || PCOLS[0], start: o.start, end: o.end, notes: '', o: maxO(projects(d)) + 1, t: now };
    var kids = tp.keys.map(function (k, i) { var id = 'k' + uid() + i; d.keys[id] = { id: id, proj: pid, name: k[0], color: k[1], o: i, t: now }; return id; });
    var lids = tp.layers.map(function (n, i) { var id = 'l' + uid() + i; d.layers[id] = { id: id, proj: pid, name: n, o: i, t: now }; return id; });
    if (o.fill) {
      var span = Math.max(7, days(o.start, o.end));
      tp.steps.forEach(function (s, i) {
        var id = 's' + uid() + i, a = addDays(o.start, Math.round(s[3] * span)), b = addDays(o.start, Math.max(Math.round(s[3] * span), Math.round(s[4] * span) - (s[5] ? 0 : 1)));
        d.steps[id] = { id: id, proj: pid, layer: lids[s[2]] || lids[0], key: kids[s[1]] || '', kind: s[5] || 'step', title: s[0], start: a, end: s[5] ? a : b, pct: 0, note: '', cal: true, o: i, t: now };
      });
    }
    save(d); setPP('cur', pid); return pid;
  }

  /* ---------- view state ---------- */
  var ZOOM = { day: 34, week: 13, month: 3.6 };
  var RH = 38, scrollKeep = null, focusDate = null, openNext = null;
  function lwNow() { return matchMedia('(max-width: 700px)').matches ? 150 : 270; }
  function range(d, pids) {
    var t = today(), lo = t, hi = t;
    pids.forEach(function (pid) {
      var p = d.projects[pid]; if (!p) return;
      [p.start, p.end].forEach(function (x) { if (x) { if (x < lo) lo = x; if (x > hi) hi = x; } });
      stepsOf(d, pid).forEach(function (s) { [s.start, s.end].forEach(function (x) { if (x) { if (x < lo) lo = x; if (x > hi) hi = x; } }); });
    });
    var z = pp().zoom, a, b;
    if (z === 'day') { a = addDays(monday(lo), -7); b = addDays(hi, 21); }
    else if (z === 'week') { a = addDays(monday(lo), -14); b = addDays(hi, 56); }
    else { var l = parseISO(lo); a = iso(new Date(l.getFullYear(), l.getMonth() - 1, 1)); var h = parseISO(hi); b = iso(new Date(h.getFullYear(), h.getMonth() + 3, 0)); }
    var ppd = ZOOM[z], minW = 1500, n = days(a, b) + 1;
    if (n * ppd < minW) b = addDays(a, Math.ceil(minW / ppd));
    return { a: a, b: b, n: days(a, b) + 1, ppd: ppd, z: z };
  }

  /* ---------- the Planner tab ---------- */
  A.RENDER.planner = function (v) {
    var d = data(), ps = projects(d), cur = curProj(d), P = pp();
    if (openNext) { var on = openNext; openNext = null; setTimeout(on, 30); }
    if (!ps.length) { v.innerHTML = welcomeHTML(); wireWelcome(v); return; }
    var pids = cur === 'all' ? ps.map(function (p) { return p.id; }) : [cur], one = cur !== 'all' ? d.projects[cur] : null;
    var R = range(d, pids), W = Math.round(R.n * R.ppd);
    var h = '<div class="pbar"><h1>Project planner</h1><div class="pchips" role="group" aria-label="Projects">' +
      ps.map(function (p) { return '<button type="button" class="chip" data-proj="' + p.id + '" aria-pressed="' + (cur === p.id) + '" style="--c:' + p.color + '"><i></i>' + esc(p.name) + '</button>'; }).join('') +
      (ps.length > 1 ? '<button type="button" class="chip" data-proj="all" aria-pressed="' + (cur === 'all') + '">' + I.layers + 'All together</button>' : '') +
      '<button type="button" class="chip chip-edit" data-newproj>' + IC.plus + 'New project</button></div></div>';
    // summary
    if (one) {
      var pc = projPct(d, one.id), left = one.end ? days(today(), one.end) : null, lateN = stepsOf(d, one.id).filter(late).length;
      h += '<div class="psum card"><div class="psum-t"><span class="ptype" style="--c:' + one.color + '">' + esc((TPL[one.type] || TPL.other).name) + '</span><b>' + esc(one.name) + '</b>' +
        '<button type="button" class="btn ghost sm" data-editproj>' + IC.edit + 'Edit project</button></div>' +
        '<div class="psum-s"><div class="pmeter" title="' + pc + '% done"><i style="width:' + pc + '%"></i></div><span><b>' + pc + '%</b> done</span>' +
        (left != null ? '<span class="' + (left < 0 ? 'bad' : left <= 14 ? 'warn' : '') + '">' + IC.flag.replace(/width="18" height="18"/, 'width="15" height="15"') + (left > 0 ? '<b>' + left + '</b> days to hand-in (' + esc(niceDate(one.end)) + ')' : left === 0 ? '<b>Hand-in is today</b>' : 'Hand-in was ' + esc(niceDate(one.end))) + '</span>' : '') +
        (lateN ? '<span class="bad"><b>' + lateN + '</b> behind</span>' : '') + '</div></div>';
    }
    // toolbar
    h += '<div class="ptools"><div class="seg" role="group" aria-label="Zoom">' + [['day', 'Days'], ['week', 'Weeks'], ['month', 'Months']].map(function (z) { return '<button type="button" data-zoom="' + z[0] + '" aria-pressed="' + (P.zoom === z[0]) + '">' + z[1] + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="btn sm" data-today>Today</button>' +
      '<span class="psep"></span>' +
      '<button type="button" class="btn sm" data-add="step">' + IC.plus + 'Step</button><button type="button" class="btn sm" data-add="milestone">' + I.diamond + 'Milestone</button><button type="button" class="btn sm" data-add="note">' + I.note + 'Note</button>' +
      (P.ai ? '<button type="button" class="btn sm" data-ai title="Turn a photo of your deadlines into a plan, using any AI">' + I.cam + 'From a photo</button>' : '') +
      '<span class="psep"></span>' +
      '<button type="button" class="btn sm" data-keys' + (one ? '' : ' disabled title="Pick one project first"') + '>' + I.key + 'Colour key</button>' +
      '<button type="button" class="btn sm" data-layers' + (one ? '' : ' disabled title="Pick one project first"') + '>' + I.layers + 'Layers</button>' +
      '<button type="button" class="btn sm" data-overlay aria-pressed="' + P.overlay + '" title="Put each layer on one line, so you can see them side by side">' + I.overlay + 'Overlay layers</button>' +
      '<button type="button" class="btn sm" data-actual aria-pressed="' + P.actual + '" title="Show when you actually did each step, under the plan">' + I.log + 'Plan vs actual</button>' +
      '<button type="button" class="btn pr sm" data-export style="margin-left:auto">' + I.chart + 'Gantt chart</button></div>';
    if (P.hint) h += '<div class="phint"><b>How to use it:</b><span><i>1</i>Type your steps on the left.</span><span><i>2</i>Drag across the grid to draw when each one happens.</span><span><i>3</i>Drag a bar to move it, or its ends to change how long it takes.</span><span><i>4</i>Tap a bar to add notes and log your progress.</span><button type="button" class="iconbtn" data-hidehint aria-label="Hide these tips">' + IC.x + '</button></div>';
    h += chartHTML(d, pids, R, W, P);
    // legend + notes
    h += '<div class="pfoot"><div class="plegend">' + legendHTML(d, pids) + '</div>';
    if (one) h += '<div class="card pnotes"><label class="f" for="pNotes">Project notes</label><textarea id="pNotes" maxlength="5000" placeholder="Anything to remember: what your teacher said, materials to order, questions for your client…">' + esc(one.notes || '') + '</textarea></div>';
    h += '</div>';
    v.innerHTML = h;
    wire(v, d, pids, R, one);
  };

  function welcomeHTML() {
    return '<div class="pwelcome"><h1>Project planner</h1><p class="muted">Plan your coursework as a Gantt chart: list the steps, draw how long each takes, and tick off your progress. Your deadlines show up in the Calendar too.</p>' +
      '<div class="pstart">' +
      '<button type="button" class="pcard" data-start="nea"><span class="pic" style="--c:#1f5fbf">' + I.chart + '</span><b>DT NEA</b><span>Sections A to F already filled in: research, brief, ideas, development, making, testing and evaluation.</span></button>' +
      '<button type="button" class="pcard" data-start="epq"><span class="pic" style="--c:#c81e66">' + I.note + '</span><b>EPQ</b><span>Proposal, research, production log, writing, review and presentation.</span></button>' +
      '<button type="button" class="pcard" data-start="other"><span class="pic" style="--c:#1a7f45">' + IC.plus + '</span><b>Something else</b><span>Start with an empty plan and add your own steps.</span></button>' +
      '</div>' + (pp().ai ? '<button type="button" class="pcard pwide" data-ai><span class="pic" style="--c:#7a5af5">' + I.cam + '</span><b>From a photo of your deadlines</b><span>Take a picture of your deadline sheet, give it to any AI with our prompt, and paste its answer here.</span></button>' : '') + '</div>';
  }
  function wireWelcome(v) { $$('[data-start]', v).forEach(function (b) { b.onclick = function () { projDlg(null, b.getAttribute('data-start')); }; }); var ai = $('[data-ai]', v); if (ai) ai.onclick = function () { aiDlg(); }; }

  /* ---------- chart ---------- */
  function x(R, s) { return days(R.a, s) * R.ppd; }
  function headHTML(R, W) {
    var top = '', bot = '', a = parseISO(R.a), t = today();
    if (R.z !== 'month') { // months on top
      var m = new Date(a.getFullYear(), a.getMonth(), 1);
      while (iso(m) <= R.b) { var s = iso(m) < R.a ? R.a : iso(m), nx = new Date(m.getFullYear(), m.getMonth() + 1, 1), e = iso(nx) > R.b ? addDays(R.b, 1) : iso(nx); top += '<div style="left:' + x(R, s) + 'px;width:' + (days(s, e) * R.ppd) + 'px"><span>' + MON[m.getMonth()] + ' ' + m.getFullYear() + '</span></div>'; m = nx; }
    } else {
      for (var y = a.getFullYear(); iso(new Date(y, 0, 1)) <= R.b; y++) { var ys = iso(new Date(y, 0, 1)) < R.a ? R.a : iso(new Date(y, 0, 1)), ye = iso(new Date(y + 1, 0, 1)) > R.b ? addDays(R.b, 1) : iso(new Date(y + 1, 0, 1)); top += '<div style="left:' + x(R, ys) + 'px;width:' + (days(ys, ye) * R.ppd) + 'px"><span>' + y + '</span></div>'; }
    }
    if (R.z === 'day') for (var i = 0; i < R.n; i++) { var dd = addDays(R.a, i), dt = parseISO(dd), wd = dt.getDay(); bot += '<div class="' + (wd === 0 || wd === 6 ? 'we' : '') + (dd === t ? ' tod' : '') + '" style="left:' + i * R.ppd + 'px;width:' + R.ppd + 'px"><small>' + 'SMTWTFS'[wd] + '</small>' + dt.getDate() + '</div>'; }
    else if (R.z === 'week') for (var w = monday(R.a); w <= R.b; w = addDays(w, 7)) { if (w < R.a) continue; var wt = parseISO(w); bot += '<div class="' + (w === monday(t) ? 'tod' : '') + '" style="left:' + x(R, w) + 'px;width:' + 7 * R.ppd + 'px">' + wt.getDate() + ' ' + MON[wt.getMonth()].slice(0, 3) + '</div>'; }
    else { var mm = new Date(a.getFullYear(), a.getMonth(), 1); while (iso(mm) <= R.b) { var ms = iso(mm), mn = new Date(mm.getFullYear(), mm.getMonth() + 1, 1); bot += '<div class="' + (ms.slice(0, 7) === t.slice(0, 7) ? 'tod' : '') + '" style="left:' + x(R, ms) + 'px;width:' + days(ms, iso(mn)) * R.ppd + 'px">' + MON[mm.getMonth()].slice(0, 3) + '</div>'; mm = mn; } }
    return '<div class="gtier top">' + top + '</div><div class="gtier bot ' + R.z + '">' + bot + '</div>';
  }
  function colsHTML(d, pids, R, W) {
    var h = '', t = today();
    if (R.z === 'day') for (var i = 0; i < R.n; i++) { var wd = parseISO(addDays(R.a, i)).getDay(); h += '<i class="' + (wd === 0 || wd === 6 ? 'we' : wd === 1 ? 'mo' : '') + '" style="left:' + i * R.ppd + 'px;width:' + R.ppd + 'px"></i>'; }
    else if (R.z === 'week') for (var w = monday(R.a); w <= R.b; w = addDays(w, 7)) { if (w >= R.a) h += '<i class="ln' + (parseISO(w).getDate() <= 7 ? ' mo' : '') + '" style="left:' + x(R, w) + 'px"></i>'; }
    else { var a = parseISO(R.a), mm = new Date(a.getFullYear(), a.getMonth(), 1); while (iso(mm) <= R.b) { h += '<i class="ln' + (mm.getMonth() === 0 ? ' mo' : '') + '" style="left:' + x(R, iso(mm)) + 'px"></i>'; mm = new Date(mm.getFullYear(), mm.getMonth() + 1, 1); } }
    if (t >= R.a && t <= R.b) h += '<b class="gtoday" style="left:' + (x(R, t) + R.ppd / 2) + 'px"><span>Today</span></b>';
    handins(d, pids).forEach(function (g) { if (g.date >= R.a && g.date <= R.b) h += '<b class="gdead" style="left:' + (x(R, g.date) + R.ppd) + 'px"><span>' + esc(pids.length > 1 ? g.names.join(' + ') + ' hand-in' : 'Hand-in') + '</span></b>'; });
    return h;
  }
  /* hand-in dates, with projects due on the same day sharing one line and one label */
  function handins(d, pids) {
    var by = {};
    pids.forEach(function (pid) { var p = d.projects[pid]; if (p && p.end) (by[p.end] = by[p.end] || []).push(p.name); });
    return Object.keys(by).sort().map(function (k) { return { date: k, names: by[k] }; });
  }
  function barHTML(d, s, R, label) {
    var c = stepCol(d, s), lt = late(s) ? ' late' : '', pct = s.pct || 0;
    if (s.kind === 'milestone') {
      if (!s.start) return '';
      return '<div class="gms' + lt + (pct >= 100 ? ' done' : '') + '" data-step="' + s.id + '" tabindex="0" style="left:' + (x(R, s.start) + R.ppd / 2) + 'px;--c:' + c + '" title="' + esc(s.title + ' · ' + niceDate(s.start, true)) + '"><i></i><span>' + esc(s.title) + '</span></div>';
    }
    if (s.kind === 'note') {
      if (!s.start) return '';
      return '<div class="gnote" data-step="' + s.id + '" tabindex="0" style="left:' + x(R, s.start) + 'px;--c:' + c + '" title="' + esc(s.note || s.title) + '">' + I.note + '<span>' + esc(s.title) + '</span></div>';
    }
    if (!s.start || !s.end) return '';
    var w = len(s) * R.ppd, act = '';
    if (pp().actual && s.as) { var ae = s.ae || (s.as <= today() ? today() : s.as); act = '<div class="gact" style="left:' + x(R, s.as) + 'px;width:' + Math.max(R.ppd, (days(s.as, ae) + 1) * R.ppd) + 'px;--c:' + c + '" title="Actually: ' + esc(niceDate(s.as) + ' – ' + (s.ae ? niceDate(s.ae) : 'still going')) + '"></div>'; }
    var inside = w > 90, txt = (label ? esc(s.title) : '') + (pct ? (label ? ' · ' : '') + pct + '%' : '');
    return '<div class="gbar' + lt + (pct >= 100 ? ' done' : '') + '" data-step="' + s.id + '" tabindex="0" role="button" aria-label="' + esc(s.title + ', ' + niceDate(s.start) + ' to ' + niceDate(s.end) + ', ' + pct + '% done') + '" style="left:' + x(R, s.start) + 'px;width:' + w + 'px;--c:' + c + '">' +
      '<i class="gp" style="width:' + pct + '%"></i>' + (inside && txt ? '<span class="gt">' + txt + '</span>' : '') + (s.note ? '<em class="gn" title="Has notes">' + I.note + '</em>' : '') + '<b class="h l" data-h="l"></b><b class="h r" data-h="r"></b></div>' +
      (!inside && txt ? '<span class="gout" style="left:' + (x(R, s.start) + w + 6) + 'px">' + txt + '</span>' : '') + act;
  }
  function stepRow(d, s, R, W) {
    var c = stepCol(d, s), pct = s.pct || 0;
    var kindIc = s.kind === 'milestone' ? '<span class="gk" title="Milestone">' + I.diamond + '</span>' : s.kind === 'note' ? '<span class="gk" title="Note">' + I.note + '</span>' : '';
    var empty = s.kind === 'step' ? !(s.start && s.end) : !s.start;
    return '<div class="gro step' + (late(s) ? ' late' : '') + (pct >= 100 ? ' done' : '') + '" data-step="' + s.id + '"><div class="gl">' +
      '<span class="grip" data-grip title="Drag up or down to reorder">' + I.grip + '</span>' +
      '<button type="button" class="gdot" data-dot style="--c:' + c + '" title="Colour" aria-label="Colour for ' + esc(s.title) + '"></button>' + kindIc +
      '<input class="gname" value="' + esc(s.title) + '" maxlength="120" aria-label="Step name" spellcheck="true">' +
      (s.kind === 'note' ? '' : '<button type="button" class="gpct" data-pct title="Log progress" style="--p:' + pct + '%">' + (pct >= 100 ? IC.check.replace(/width="18" height="18"/, 'width="14" height="14"') : pct + '%') + '</button>') +
      '<button type="button" class="gmore" data-open aria-label="Details for ' + esc(s.title) + '" title="Details, notes and progress">' + I.more + '</button></div>' +
      '<div class="gr" style="width:' + W + 'px">' + barHTML(d, s, R, false) + (empty ? '<span class="gempty">' + (s.kind === 'step' ? 'Drag here to draw when you will do this →' : 'Tap a day to place it') + '</span>' : '') + '</div></div>';
  }
  function addRow(pid, lid, W, overlay) {
    return '<div class="gro add"><div class="gl"><span class="gplus">' + IC.plus + '</span><input class="gadd" data-proj="' + pid + '" data-layer="' + (lid || '') + '" maxlength="120" placeholder="Add a step…" aria-label="Add a step"></div><div class="gr" style="width:' + W + 'px">' + (overlay ? '' : '') + '</div></div>';
  }
  /* overlay: each layer is one line, and its steps sit side by side on it (stacked when they overlap) */
  function lanes(list) {
    var ends = [], out = {};
    list.slice().sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; }).forEach(function (s) {
      var e = s.kind === 'step' ? s.end : s.start, i = 0; while (ends[i] && ends[i] >= s.start) i++; ends[i] = addDays(e, s.kind === 'step' ? 0 : 6); out[s.id] = i;
    });
    return { at: out, n: Math.max(1, ends.length) };
  }
  function chartHTML(d, pids, R, W, P) {
    var body = '', all = pids.length > 1;
    pids.forEach(function (pid) {
      var p = d.projects[pid], ls = layersOf(d, pid), ss = stepsOf(d, pid), multi = ls.length > 1;
      if (!ls.length) ls = [{ id: '', name: 'Steps' }];
      if (all) {
        var pc = projPct(d, pid), ok = p.start && p.end, w = ok ? (days(p.start, p.end) + 1) * R.ppd : 0;
        body += '<div class="gro proj" data-projrow="' + pid + '"><div class="gl"><button type="button" class="gpname" data-proj="' + pid + '" style="--c:' + p.color + '"><i></i>' + esc(p.name) + '</button><span class="gpp">' + pc + '%</span></div><div class="gr" style="width:' + W + 'px">' +
          (ok ? '<div class="gsum" style="left:' + x(R, p.start) + 'px;width:' + w + 'px;--c:' + p.color + '"><i style="width:' + pc + '%"></i></div>' : '') + '</div></div>';
      }
      ls.forEach(function (l, li) {
        if (l.hidden) { if (multi) body += '<div class="gro layer off"><div class="gl"><button type="button" class="glay" data-togglelayer="' + l.id + '" title="Show this layer">' + I.eye + '</button><span>' + esc(l.name) + ' (hidden)</span></div><div class="gr" style="width:' + W + 'px"></div></div>'; return; }
        var mine = ss.filter(function (s) { return (s.layer === l.id) || (!d.layers[s.layer] && li === 0); });
        if (P.overlay) {
          var placed = mine.filter(function (s) { return s.kind === 'step' ? s.start && s.end : s.start; }), L = lanes(placed), hgt = Math.max(RH, L.n * 30 + 10);
          body += '<div class="gro layerline" data-layerrow="' + l.id + '" data-proj="' + pid + '" style="height:' + hgt + 'px"><div class="gl"><button type="button" class="glay" data-togglelayer="' + l.id + '" title="Hide this layer">' + I.eye + '</button><b>' + esc(l.name) + '</b><span class="muted small">' + placed.length + '</span></div><div class="gr" style="width:' + W + 'px">' +
            placed.map(function (s) { return '<div class="glane" style="top:' + (6 + L.at[s.id] * 30) + 'px">' + barHTML(d, s, R, true) + '</div>'; }).join('') +
            (placed.length ? '' : '<span class="gempty">Drag here to add a step to ' + esc(l.name) + ' →</span>') + '</div></div>';
          return;
        }
        if (multi) body += '<div class="gro layer"><div class="gl"><button type="button" class="glay" data-togglelayer="' + l.id + '" title="Hide this layer">' + I.eye + '</button><b>' + esc(l.name) + '</b></div><div class="gr" style="width:' + W + 'px"></div></div>';
        mine.forEach(function (s) { body += stepRow(d, s, R, W); });
        body += addRow(pid, l.id, W);
      });
    });
    var LW = lwNow();
    return '<div class="gwrap" id="gwrap" style="--lw:' + LW + 'px;--rh:' + RH + 'px"><div class="gin" style="width:' + (LW + W) + 'px">' +
      '<div class="ghead"><div class="gl"><b>' + (P.overlay ? 'Layers' : 'Steps') + '</b><span class="muted small">' + (R.z === 'day' ? 'days' : R.z === 'week' ? 'weeks starting' : 'months') + '</span></div><div class="gr" style="width:' + W + 'px">' + headHTML(R, W) + '</div></div>' +
      '<div class="gbody"><div class="gcols" style="width:' + W + 'px">' + colsHTML(d, pids, R, W) + '</div>' + body + '</div></div></div>';
  }
  function legendHTML(d, pids) {
    var h = '';
    pids.forEach(function (pid) {
      var ks = keysOf(d, pid); if (!ks.length) return;
      h += (pids.length > 1 ? '<b class="small">' + esc(d.projects[pid].name) + ':</b>' : '<b class="small">Colour key:</b>') + ks.map(function (k) { return '<span class="tag" style="--c:' + k.color + '"><i></i>' + esc(k.name) + '</span>'; }).join('');
    });
    h += '<span class="lgx"><span class="lg-bar"><i></i></span>Done so far</span><span class="lgx"><span class="lg-ms"></span>Milestone</span><span class="lgx"><span class="lg-late"></span>Behind</span>' + (pp().actual ? '<span class="lgx"><span class="lg-act"></span>What you actually did</span>' : '');
    return h;
  }

  /* ---------- wiring ---------- */
  function wire(v, d, pids, R, one) {
    var LW = lwNow();
    var gw = $('#gwrap', v);
    // keep where you were looking; first time, show today (or the start of the plan)
    if (focusDate) { gw.scrollLeft = Math.max(0, x(R, focusDate) - (gw.clientWidth - LW) / 2); focusDate = null; }
    else if (scrollKeep && scrollKeep.k === pids.join() + R.z) { gw.scrollLeft = scrollKeep.l; gw.scrollTop = scrollKeep.t; }
    else gw.scrollLeft = Math.max(0, x(R, today()) - (gw.clientWidth - LW) * 0.3);
    gw.onscroll = function () { scrollKeep = { k: pids.join() + R.z, l: gw.scrollLeft, t: gw.scrollTop }; };
    function midDate() { return addDays(R.a, Math.round((gw.scrollLeft + (gw.clientWidth - LW) / 2) / R.ppd)); }

    $$('[data-proj]', v).forEach(function (b) { if (b.classList.contains('gadd')) return; b.onclick = function () { setPP('cur', b.getAttribute('data-proj')); scrollKeep = null; A.render(); }; });
    $('[data-newproj]', v).onclick = function () { projDlg(null); };
    var ep = $('[data-editproj]', v); if (ep) ep.onclick = function () { projDlg(one.id); };
    $$('[data-zoom]', v).forEach(function (b) { b.onclick = function () { focusDate = midDate(); setPP('zoom', b.getAttribute('data-zoom')); A.render(); }; });
    $('[data-today]', v).onclick = function () { focusDate = today(); A.render(); };
    $$('[data-add]', v).forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-add'); stepDlg(null, { kind: k, proj: one ? one.id : pids[0], start: midDate() }); }; });
    var kb = $('[data-keys]', v); if (kb && one) kb.onclick = function () { keysDlg(one.id); };
    var lb = $('[data-layers]', v); if (lb && one) lb.onclick = function () { layersDlg(one.id); };
    $('[data-overlay]', v).onclick = function () { setPP('overlay', !pp().overlay); A.render(); };
    $('[data-actual]', v).onclick = function () { setPP('actual', !pp().actual); A.render(); };
    $('[data-export]', v).onclick = function () { exportDlg(pids); };
    var aib = $('[data-ai]', v); if (aib) aib.onclick = function () { aiDlg(one ? one.id : ''); };
    var hh = $('[data-hidehint]', v); if (hh) hh.onclick = function () { setPP('hint', false); A.render(); };
    $$('[data-togglelayer]', v).forEach(function (b) { b.onclick = function () { var dd = data(), l = dd.layers[b.getAttribute('data-togglelayer')]; if (!l) return; l.hidden = !l.hidden; save(dd); A.render(); }; });
    var pn = $('#pNotes', v); if (pn) pn.onchange = function () { var dd = data(); if (dd.projects[one.id]) { dd.projects[one.id].notes = pn.value; save(dd); toast('Notes saved.'); } };

    // left column: rename, colour, progress, details, reorder
    $$('.gro.step', v).forEach(function (row) {
      var id = row.getAttribute('data-step'), nm = row.querySelector('.gname');
      nm.onchange = function () { var t = nm.value.trim(); if (!t) { nm.value = data().steps[id].title; return; } upd(id, { title: t.slice(0, 120) }, true); };
      nm.onkeydown = function (e) { if (e.key === 'Enter') nm.blur(); if (e.key === 'Escape') { nm.value = data().steps[id].title; nm.blur(); } };
      row.querySelector('[data-dot]').onclick = function (e) { keyPick(id, e.currentTarget); };
      var pc = row.querySelector('[data-pct]'); if (pc) pc.onclick = function (e) { pctPick(id, e.currentTarget); };
      row.querySelector('[data-open]').onclick = function () { stepDlg(id); };
      gripDrag(row, id, v);
    });
    $$('.gadd', v).forEach(function (inp) {
      inp.onkeydown = function (e) {
        if (e.key !== 'Enter') return; var t = inp.value.trim(); if (!t) return;
        var dd = data(), pid = inp.getAttribute('data-proj'), lid = inp.getAttribute('data-layer') || firstLayer(dd, pid), id = 's' + uid();
        dd.steps[id] = { id: id, proj: pid, layer: lid, key: '', kind: 'step', title: t.slice(0, 120), start: '', end: '', pct: 0, note: '', cal: true, o: maxO(stepsOf(dd, pid)) + 1, t: Date.now() };
        save(dd); A.render();
        var again = $('.gadd[data-layer="' + lid + '"]'); if (again) again.focus();
      };
    });
    // timeline: draw, move, stretch
    $$('.gro.step .gr, .gro.layerline .gr', v).forEach(function (gr) { drawOn(gr, R, v); });
    $$('.gbar, .gms, .gnote', v).forEach(function (b) { barDrag(b, R, v); });
  }

  function upd(id, ch, quiet) {
    var d = data(), s = d.steps[id]; if (!s) return;
    Object.keys(ch).forEach(function (k) { s[k] = ch[k]; });
    if (s.kind === 'step' && s.start && s.end && s.end < s.start) { var t = s.start; s.start = s.end; s.end = t; }
    save(d); if (!quiet) A.render();
  }
  function setPct(id, pct) {
    var d = data(), s = d.steps[id]; if (!s) return; var t = today(), was = s.pct || 0;
    s.pct = Math.max(0, Math.min(100, Math.round(pct)));
    if (s.pct > 0 && !s.as) s.as = t;
    if (s.pct >= 100) s.ae = s.ae || t; else delete s.ae;
    if (s.pct === 0 && was > 0 && !vals(s.log).length) delete s.as;
    save(d);
    if (s.pct >= 100 && was < 100) { A.toast('Step done: ' + s.title + '. Nice work!'); var r = $('.gro[data-step="' + id + '"] .gpct'); if (r) { var b = r.getBoundingClientRect(); A.confetti(b.left + b.width / 2, b.top); } }
    A.render();
  }

  /* draw a bar by dragging along a row (like drawing a note on a piano roll) */
  function dayAt(gr, R, clientX) { var r = gr.getBoundingClientRect(); return addDays(R.a, Math.max(0, Math.min(R.n - 1, Math.floor((clientX - r.left) / R.ppd)))); }
  function unitAround(R, dd) {
    if (R.z === 'day') return [dd, dd];
    if (R.z === 'week') { var m = monday(dd); return [m, addDays(m, 4)]; }
    var a = parseISO(dd); return [iso(new Date(a.getFullYear(), a.getMonth(), 1)), iso(new Date(a.getFullYear(), a.getMonth() + 1, 0))];
  }
  function drawOn(gr, R, v) {
    var row = gr.parentNode, sid = row.getAttribute('data-step'), lid = row.getAttribute('data-layerrow');
    function commit(a, b) {
      if (a > b) { var t = a; a = b; b = t; }
      if (sid) {
        var d = data(), s = d.steps[sid]; if (!s) return; var old = { start: s.start, end: s.end };
        if (s.kind === 'step') upd(sid, { start: a, end: b }); else upd(sid, { start: a, end: a });
        if (old.start) toast('Dates changed.', 'Undo', function () { upd(sid, old); });
      } else if (lid) stepDlg(null, { kind: 'step', proj: row.getAttribute('data-proj'), layer: lid, start: a, end: b });
    }
    var lastPT = '';
    gr.addEventListener('pointerdown', function (e) {
      lastPT = e.pointerType;
      if (e.button !== 0 || e.target !== gr && !e.target.classList.contains('gempty') && !e.target.classList.contains('glane')) return;
      if (e.pointerType === 'touch' || e.pointerType === 'pen') return; // on touch screens a tap places it (below), so you can still scroll the chart
      e.preventDefault(); A.setDragging(true);
      var a = dayAt(gr, R, e.clientX), b = a, moved = false, nb = document.createElement('div'), tip = tipEl();
      nb.className = 'gbar draw'; gr.appendChild(nb);
      var s0 = sid && data().steps[sid], single = s0 && s0.kind !== 'step';
      function paint() { var lo = a < b ? a : b, hi = a < b ? b : a; if (single) hi = lo; nb.style.left = x(R, lo) + 'px'; nb.style.width = (days(lo, hi) + 1) * R.ppd + 'px'; showTip(tip, nb, single ? niceDate(lo) : niceDate(lo) + ' → ' + niceDate(hi) + '  ·  ' + (days(lo, hi) + 1) + ' day' + (lo === hi ? '' : 's')); }
      paint(); try { gr.setPointerCapture(e.pointerId); } catch (er) {}
      function mv(ev) { var nbd = dayAt(gr, R, ev.clientX); if (nbd !== b) { b = nbd; moved = true; paint(); } }
      function up() {
        gr.removeEventListener('pointermove', mv); gr.removeEventListener('pointerup', up); gr.removeEventListener('pointercancel', up);
        A.setDragging(false); nb.parentNode && nb.parentNode.removeChild(nb); tip.parentNode && tip.parentNode.removeChild(tip);
        if (!moved) { var u = unitAround(R, a); commit(u[0], u[1]); } else commit(a, b);
      }
      gr.addEventListener('pointermove', mv); gr.addEventListener('pointerup', up); gr.addEventListener('pointercancel', up);
    });
    gr.addEventListener('click', function (e) {
      if (lastPT !== 'touch' && lastPT !== 'pen') return; // mouse clicks are handled by drawing (above)
      if (e.target !== gr && !e.target.classList.contains('gempty')) return;
      var u = unitAround(R, dayAt(gr, R, e.clientX)); commit(u[0], u[1]);
    });
  }
  function tipEl() { var t = document.createElement('div'); t.className = 'gtip'; document.body.appendChild(t); return t; }
  function showTip(t, el, txt) { var r = el.getBoundingClientRect(); t.textContent = txt; t.style.left = Math.max(8, Math.min(innerWidth - t.offsetWidth - 8, r.left)) + 'px'; t.style.top = (r.top - 34) + 'px'; }

  /* move a bar, or stretch it from either end; keys: arrows move a day, Shift+arrows change the length */
  function barDrag(b, R, v) {
    var id = b.getAttribute('data-step');
    b.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return; e.stopPropagation(); e.preventDefault();
      var s = data().steps[id]; if (!s) return;
      var hnd = e.target.getAttribute && e.target.getAttribute('data-h'), sx = e.clientX, moved = false, a0 = s.start, b0 = s.kind === 'step' ? s.end : s.start, na = a0, nb = b0, tip = null;
      try { b.setPointerCapture(e.pointerId); } catch (er) {}
      function mv(ev) {
        var dd = Math.round((ev.clientX - sx) / R.ppd);
        if (!moved && Math.abs(ev.clientX - sx) < 5) return;
        if (!moved) { moved = true; A.setDragging(true); b.classList.add('sel'); tip = tipEl(); }
        if (hnd === 'l') { na = addDays(a0, dd); if (na > b0) na = b0; }
        else if (hnd === 'r') { nb = addDays(b0, dd); if (nb < a0) nb = a0; }
        else { na = addDays(a0, dd); nb = addDays(b0, dd); }
        if (b.classList.contains('gbar')) { b.style.left = x(R, na) + 'px'; b.style.width = (days(na, nb) + 1) * R.ppd + 'px'; }
        else b.style.left = (x(R, na) + (b.classList.contains('gms') ? R.ppd / 2 : 0)) + 'px';
        var nx = b.nextElementSibling; if (nx && nx.classList.contains('gout')) nx.style.visibility = 'hidden';
        showTip(tip, b, s.kind === 'step' ? niceDate(na) + ' → ' + niceDate(nb) + '  ·  ' + (days(na, nb) + 1) + ' days' : niceDate(na));
      }
      function up() {
        b.removeEventListener('pointermove', mv); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
        if (tip && tip.parentNode) tip.parentNode.removeChild(tip);
        if (!moved) { stepDlg(id); return; }
        A.setDragging(false);
        var old = { start: s.start, end: s.end };
        upd(id, s.kind === 'step' ? { start: na, end: nb } : { start: na, end: na });
        toast(hnd ? 'Now ' + (days(na, nb) + 1) + ' days.' : 'Moved to ' + niceDate(na) + '.', 'Undo', function () { upd(id, old); });
      }
      b.addEventListener('pointermove', mv); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
    });
    b.addEventListener('keydown', function (e) {
      var s = data().steps[id]; if (!s) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stepDlg(id); return; }
      var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!n) return; e.preventDefault();
      if (e.shiftKey && s.kind === 'step') { var ne = addDays(s.end, n); if (ne >= s.start) upd(id, { end: ne }); }
      else upd(id, { start: addDays(s.start, n), end: addDays(s.kind === 'step' ? s.end : s.start, n) });
      setTimeout(function () { var nb = document.querySelector('[data-step="' + id + '"].gbar, [data-step="' + id + '"].gms, [data-step="' + id + '"].gnote'); if (nb) nb.focus(); }, 0);
    });
  }

  /* reorder steps by dragging the grip; dropping onto another layer moves it there */
  function gripDrag(row, id, v) {
    var g = row.querySelector('[data-grip]');
    g.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return; e.preventDefault(); A.setDragging(true);
      var line = document.createElement('div'), target = null, after = false; line.className = 'gdrop'; row.classList.add('lift');
      try { g.setPointerCapture(e.pointerId); } catch (er) {}
      function mv(ev) {
        var el = document.elementFromPoint(ev.clientX, ev.clientY), r = el && el.closest('.gro.step, .gro.add');
        if (!r || r === row) return; target = r; var bb = r.getBoundingClientRect(); after = r.classList.contains('add') ? false : ev.clientY > bb.top + bb.height / 2;
        r.parentNode.insertBefore(line, after ? r.nextSibling : r);
      }
      function up() {
        g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up);
        A.setDragging(false); row.classList.remove('lift'); if (line.parentNode) line.parentNode.removeChild(line);
        if (!target) return;
        var d = data(), s = d.steps[id], lid, pid, ref = null;
        if (target.classList.contains('add')) { var inp = target.querySelector('.gadd'); lid = inp.getAttribute('data-layer'); pid = inp.getAttribute('data-proj'); }
        else { ref = d.steps[target.getAttribute('data-step')]; if (!ref) return; lid = ref.layer; pid = ref.proj; }
        s.proj = pid; s.layer = lid;
        var list = stepsOf(d, pid).filter(function (x) { return x.layer === lid && x.id !== id; });
        var at = ref ? list.indexOf(ref) + (after ? 1 : 0) : list.length; list.splice(at, 0, s);
        list.forEach(function (x, i) { x.o = i; });
        save(d); A.render();
      }
      g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
    });
  }

  /* small pop-up menus next to a button */
  function popover(anchor, html) {
    var old = $('.gpop'); if (old) old.parentNode.removeChild(old);
    var p = document.createElement('div'); p.className = 'gpop'; p.innerHTML = html; document.body.appendChild(p);
    var r = anchor.getBoundingClientRect(); p.style.left = Math.min(innerWidth - p.offsetWidth - 8, r.left) + 'px';
    p.style.top = (r.bottom + p.offsetHeight + 8 > innerHeight ? r.top - p.offsetHeight - 6 : r.bottom + 6) + 'px';
    function close(e) { if (e && p.contains(e.target)) return; if (p.parentNode) p.parentNode.removeChild(p); document.removeEventListener('pointerdown', close, true); document.removeEventListener('keydown', esc1, true); }
    function esc1(e) { if (e.key === 'Escape') close(); }
    setTimeout(function () { document.addEventListener('pointerdown', close, true); document.addEventListener('keydown', esc1, true); }, 0);
    var f = p.querySelector('button'); if (f) f.focus();
    return { el: p, close: function () { close(); } };
  }
  function keyPick(id, anchor) {
    var d = data(), s = d.steps[id], ks = keysOf(d, s.proj);
    var pop = popover(anchor, '<div class="gpt">Colour</div>' + ks.map(function (k) { return '<button type="button" data-k="' + k.id + '" aria-pressed="' + (s.key === k.id) + '"><i style="background:' + k.color + '"></i>' + esc(k.name) + '</button>'; }).join('') +
      '<button type="button" data-k="" aria-pressed="' + !s.key + '"><i style="background:' + d.projects[s.proj].color + '"></i>Project colour</button><hr><button type="button" data-editkeys>' + IC.edit + 'Edit the colour key…</button>');
    $$('[data-k]', pop.el).forEach(function (b) { b.onclick = function () { pop.close(); upd(id, { key: b.getAttribute('data-k') }); }; });
    pop.el.querySelector('[data-editkeys]').onclick = function () { pop.close(); keysDlg(s.proj); };
  }
  function pctPick(id, anchor) {
    var s = data().steps[id];
    var pop = popover(anchor, '<div class="gpt">How much is done?</div><div class="gpcts">' + [0, 25, 50, 75, 100].map(function (n) { return '<button type="button" data-p="' + n + '" aria-pressed="' + ((s.pct || 0) === n) + '">' + (n === 100 ? 'Done!' : n + '%') + '</button>'; }).join('') + '</div><hr><button type="button" data-logit>' + I.log + 'Log what I did…</button>');
    $$('[data-p]', pop.el).forEach(function (b) { b.onclick = function () { pop.close(); setPct(id, +b.getAttribute('data-p')); }; });
    pop.el.querySelector('[data-logit]').onclick = function () { pop.close(); stepDlg(id, null, true); };
  }

  /* ---------- dialogs ---------- */
  function stepDlg(id, preset, toLog) {
    var d = data(), s = id ? d.steps[id] : null;
    if (id && !s) return;
    var ps = projects(d); if (!ps.length) return;
    s = s || Object.assign({ kind: 'step', title: '', proj: curProj(d) === 'all' ? ps[0].id : curProj(d), start: today(), end: '', pct: 0, note: '', cal: true, key: '', layer: '' }, preset || {});
    if (!s.end && s.kind === 'step' && s.start) s.end = addDays(s.start, 6);
    var pid = s.proj, kind = s.kind, logs = vals(s.log).sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
    function keyChips(p, cur) { return '<div class="chips" data-keychips>' + keysOf(data(), p).map(function (k) { return '<button type="button" class="chip" data-v="' + k.id + '" aria-pressed="' + (cur === k.id) + '" style="--c:' + k.color + '"><i></i>' + esc(k.name) + '</button>'; }).join('') + '<button type="button" class="chip" data-v="" aria-pressed="' + !cur + '" style="--c:' + data().projects[p].color + '"><i></i>Project colour</button><button type="button" class="chip chip-edit" data-editkeys>' + IC.edit + 'Edit key</button></div>'; }
    function layerOpts(p, cur) { return layersOf(data(), p).map(function (l) { return '<option value="' + l.id + '"' + (cur === l.id ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join(''); }
    var m = modal('<h2>' + (id ? 'Edit' : kind === 'milestone' ? 'Add a milestone' : kind === 'note' ? 'Add a note to the chart' : 'Add a step') + '</h2><div class="fields">' +
      '<div class="seg" role="group" aria-label="Type" style="justify-self:start">' + [['step', 'Step'], ['milestone', 'Milestone'], ['note', 'Note']].map(function (k) { return '<button type="button" data-kind="' + k[0] + '" aria-pressed="' + (kind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div>' +
      '<div><label class="f" for="sT">What is it?</label><input type="text" id="sT" maxlength="120" autofocus value="' + esc(s.title) + '" placeholder="e.g. Make the final prototype"></div>' +
      '<div class="row"><div class="grow"><label class="f" for="sA" id="sAl">' + (kind === 'step' ? 'Start' : 'Date') + '</label><input type="date" id="sA" value="' + esc(s.start || '') + '"></div>' +
      '<div class="grow" id="sBw"' + (kind !== 'step' ? ' hidden' : '') + '><label class="f" for="sB">Deadline (finish by)</label><input type="date" id="sB" value="' + esc(s.end || '') + '"></div></div>' +
      '<div class="small muted" id="sLen"></div>' +
      (ps.length > 1 ? '<div><label class="f" for="sP">Project</label><select id="sP">' + ps.map(function (p) { return '<option value="' + p.id + '"' + (p.id === pid ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select></div>' : '') +
      '<div><div class="f lbl">Colour</div><div id="sKeys">' + keyChips(pid, s.key) + '</div></div>' +
      '<div><label class="f" for="sL">Layer</label><select id="sL">' + layerOpts(pid, s.layer) + '</select></div>' +
      '<div id="sPw"' + (kind === 'note' ? ' hidden' : '') + '><div class="f lbl">How much is done? <b id="sPv">' + (s.pct || 0) + '%</b></div><div class="row"><input type="range" id="sPct" min="0" max="100" step="5" value="' + (s.pct || 0) + '" class="grow" aria-label="Percent done">' +
      '<div class="seg">' + [0, 50, 100].map(function (n) { return '<button type="button" data-qp="' + n + '">' + (n === 100 ? 'Done' : n + '%') + '</button>'; }).join('') + '</div></div></div>' +
      (id && kind !== 'note' ? '<div class="plog"><div class="f lbl">Progress log</div><div class="row"><input type="text" id="sLog" maxlength="300" placeholder="What did you do? e.g. Cut and sanded the base"><button type="button" class="btn" data-addlog>' + IC.plus + 'Log it</button></div>' +
        (logs.length ? '<ul>' + logs.map(function (l) { return '<li><span class="small muted">' + esc(niceDate(l.d)) + ' · ' + l.pct + '%</span> ' + esc(l.text) + '<button type="button" class="iconbtn" data-dellog="' + l.id + '" aria-label="Remove">' + IC.x + '</button></li>'; }).join('') + '</ul>' : '<p class="small muted" style="margin:6px 0 0">Nothing logged yet. Logging shows your teacher how the project went.</p>') + '</div>' : '') +
      '<div><label class="f" for="sN">Notes</label><textarea id="sN" maxlength="3000" style="min-height:70px" placeholder="' + (kind === 'note' ? 'The note to show on the chart' : 'Materials, things to remember, feedback…') + '">' + esc(s.note || '') + '</textarea></div>' +
      '<label class="row" style="gap:10px;cursor:pointer" id="sCw"' + (kind === 'note' ? ' hidden' : '') + '><input type="checkbox" class="check" id="sC"' + (s.cal !== false ? ' checked' : '') + '>Show the deadline on my calendar</label>' +
      '</div><div class="foot">' + (id ? '<button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete</button>' : '') + '<button type="button" class="btn pr" data-s>' + (id ? 'Save' : 'Add') + '</button></div>', 'wide');
    var B = m.box;
    function lenNote() { var a = $('#sA', B).value, b = $('#sB', B).value; $('#sLen', B).textContent = kind === 'step' && a && b ? (b < a ? 'The deadline is before the start.' : 'Takes ' + lenText(days(a, b) + 1) + '.') : ''; }
    lenNote(); $('#sA', B).oninput = function () { var a = this.value, b = $('#sB', B).value; if (a && b && b < a) $('#sB', B).value = a; lenNote(); }; $('#sB', B).oninput = lenNote;
    $$('[data-kind]', B).forEach(function (b) { b.onclick = function () { kind = b.getAttribute('data-kind'); $$('[data-kind]', B).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); $('#sBw', B).hidden = kind !== 'step'; $('#sPw', B).hidden = $('#sCw', B).hidden = kind === 'note'; $('#sAl', B).textContent = kind === 'step' ? 'Start' : 'Date'; if (kind === 'step' && !$('#sB', B).value && $('#sA', B).value) $('#sB', B).value = addDays($('#sA', B).value, 6); lenNote(); }; });
    var curKey = s.key || '';
    function wireKeys() { var g = $('[data-keychips]', B); g.onclick = function (e) { if (e.target.closest('[data-editkeys]')) { keysDlg(pid, function () { $('#sKeys', B).innerHTML = keyChips(pid, curKey); wireKeys(); }); return; } var c = e.target.closest('.chip'); if (!c) return; curKey = c.getAttribute('data-v'); $$('.chip:not(.chip-edit)', g).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); }); }; }
    wireKeys();
    var sp = $('#sP', B); if (sp) sp.onchange = function () { pid = sp.value; curKey = ''; $('#sKeys', B).innerHTML = keyChips(pid, ''); wireKeys(); $('#sL', B).innerHTML = layerOpts(pid, ''); };
    var rg = $('#sPct', B); rg.oninput = function () { $('#sPv', B).textContent = rg.value + '%'; };
    $$('[data-qp]', B).forEach(function (b) { b.onclick = function () { rg.value = b.getAttribute('data-qp'); rg.oninput(); }; });
    function collect() {
      var t = $('#sT', B).value.trim(); if (!t) { $('#sT', B).focus(); return null; }
      var a = $('#sA', B).value || '', b = kind === 'step' ? ($('#sB', B).value || '') : a;
      if (kind === 'step' && a && b && b < a) { var tt = a; a = b; b = tt; }
      return { title: t.slice(0, 120), kind: kind, proj: pid, start: a, end: b, key: curKey, layer: $('#sL', B).value, note: $('#sN', B).value.trim(), cal: $('#sC', B).checked };
    }
    B.querySelector('[data-s]').onclick = function () {
      var o = collect(); if (!o) return;
      var dd = data(), pct = +rg.value;
      if (!o.layer || !dd.layers[o.layer]) o.layer = firstLayer(dd, o.proj);
      if (id) { if (!dd.steps[id]) return m.close(); Object.assign(dd.steps[id], o); }
      else { var nid = 's' + uid(); dd.steps[nid] = Object.assign({ id: nid, pct: 0, o: maxO(stepsOf(dd, o.proj)) + 1, t: Date.now() }, o); id = nid; }
      save(dd); m.close();
      if (pct !== (dd.steps[id].pct || 0)) setPct(id, pct); else A.render();
      if (A.tab() !== 'planner') location.hash = '#planner';
      toast(preset || !id ? 'Added to your plan.' : 'Saved.');
    };
    $('#sT', B).onkeydown = function (e) { if (e.key === 'Enter') B.querySelector('[data-s]').click(); };
    var al = B.querySelector('[data-addlog]');
    if (al) {
      var li = $('#sLog', B);
      al.onclick = function () {
        var t = li.value.trim(); if (!t) return li.focus();
        var dd = data(), st = dd.steps[id]; if (!st) return; st.log = st.log || {}; var lid = 'g' + uid(), pct = +rg.value;
        st.log[lid] = { id: lid, d: today(), t: Date.now(), pct: pct, text: t.slice(0, 300) }; if (!st.as) st.as = today();
        save(dd); m.close(); setPct(id, pct); toast('Logged. Keep going!'); stepDlg(id);
      };
      li.onkeydown = function (e) { if (e.key === 'Enter') al.click(); };
      if (toLog) setTimeout(function () { li.focus(); }, 60);
    }
    $$('[data-dellog]', B).forEach(function (b) { b.onclick = function () { var dd = data(), st = dd.steps[id]; if (st && st.log) { delete st.log[b.getAttribute('data-dellog')]; save(dd); } m.close(); stepDlg(id); }; });
    var del = B.querySelector('[data-del]'); if (del) del.onclick = function () { var dd = data(), old = dd.steps[id]; delete dd.steps[id]; save(dd); m.close(); A.render(); toast('Deleted.', 'Undo', function () { var d3 = data(); d3.steps[id] = old; save(d3); A.render(); }); };
  }

  function projDlg(id, type) {
    var d = data(), p = id ? d.projects[id] : null, ty = p ? p.type : type || 'nea';
    var m = modal('<h2>' + (p ? 'Edit project' : 'New project') + '</h2><div class="fields">' +
      '<div><div class="f lbl">What kind of project?</div><div class="seg" role="group" aria-label="Kind">' + [['nea', 'DT NEA'], ['epq', 'EPQ'], ['other', 'Other']].map(function (k) { return '<button type="button" data-ty="' + k[0] + '" aria-pressed="' + (ty === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div></div>' +
      '<div><label class="f" for="pN">Name</label><input type="text" id="pN" maxlength="60" autofocus value="' + esc(p ? p.name : ty === 'nea' ? 'DT NEA' : ty === 'epq' ? 'EPQ' : '') + '" placeholder="e.g. My lamp project"></div>' +
      '<div class="row"><div class="grow"><label class="f" for="pS">Start</label><input type="date" id="pS" value="' + esc(p ? p.start || '' : today()) + '"></div>' +
      '<div class="grow"><label class="f" for="pE">Final hand-in date</label><input type="date" id="pE" value="' + esc(p ? p.end || '' : defaultEnd()) + '"></div></div>' +
      '<div><div class="f lbl">Colour</div><div class="pcols">' + PCOLS.map(function (c) { return '<button type="button" data-col="' + c + '" style="--c:' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + ((p ? p.color : '') === c) + '"></button>'; }).join('') + '</div></div>' +
      (p ? '' : '<label class="row" style="gap:10px;cursor:pointer" id="pFw"' + (ty === 'other' ? ' hidden' : '') + '><input type="checkbox" class="check" id="pF" checked>Fill in the usual steps for me, spread across the time I have (you can change them all)</label>') +
      (p ? '<p class="small muted" style="margin:0">Changing the dates here doesn\'t move your steps. To move everything, use the button below.</p><button type="button" class="btn sm" data-shift style="justify-self:start">Move every step to fit the new dates</button>' : '') +
      '</div><div class="foot">' + (p ? '<button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete project</button>' : '') + '<button type="button" class="btn pr" data-s>' + (p ? 'Save' : 'Make my plan') + '</button></div>');
    var B = m.box, col = p ? p.color : '';
    $$('[data-ty]', B).forEach(function (b) { b.onclick = function () { var was = ty; ty = b.getAttribute('data-ty'); $$('[data-ty]', B).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); var n = $('#pN', B); if (!p && (!n.value || n.value === (TPL[was] || {}).name)) n.value = ty === 'other' ? '' : TPL[ty].name; var fw = $('#pFw', B); if (fw) fw.hidden = ty === 'other'; }; });
    $$('[data-col]', B).forEach(function (b) { b.onclick = function () { col = b.getAttribute('data-col'); $$('[data-col]', B).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }; });
    function vals2() { var n = $('#pN', B).value.trim(), s = $('#pS', B).value, e = $('#pE', B).value; if (!n) { $('#pN', B).focus(); return null; } if (s && e && e < s) { toast('The hand-in date is before the start.'); return null; } return { name: n.slice(0, 60), start: s || today(), end: e }; }
    B.querySelector('[data-s]').onclick = function () {
      var o = vals2(); if (!o) return;
      if (p) { var dd = data(), q = dd.projects[id]; if (!q) return m.close(); Object.assign(q, o, { type: ty, color: col || q.color }); save(dd); m.close(); A.render(); toast('Saved.'); return; }
      var fill = $('#pF', B) && $('#pF', B).checked && ty !== 'other';
      if (!o.end) o.end = addDays(o.start, 120);
      makeProject({ name: o.name, type: ty, start: o.start, end: o.end, color: col, fill: fill });
      m.close(); scrollKeep = null; focusDate = null;
      if (A.tab() !== 'planner') location.hash = '#planner'; else A.render();
      toast(fill ? 'Your plan is ready. Drag the bars to fit how you work.' : 'Project made. Add your first step on the left.');
    };
    var sh = B.querySelector('[data-shift]'); if (sh) sh.onclick = function () {
      var o = vals2(); if (!o || !o.end || !p.start || !p.end) return;
      var dd = data(), os = days(p.start, p.end) || 1, ns = days(o.start, o.end) || 1;
      stepsOf(dd, id).forEach(function (s) { if (!s.start) return; var f = function (q) { return addDays(o.start, Math.round(days(p.start, q) * ns / os)); }; var a = f(s.start); s.end = s.end ? (s.kind === 'step' ? f(s.end) : a) : s.end; s.start = a; if (s.end && s.end < s.start) s.end = s.start; });
      Object.assign(dd.projects[id], o); save(dd); m.close(); A.render(); toast('Every step moved to fit ' + niceDate(o.start) + ' – ' + niceDate(o.end) + '.');
    };
    var del = B.querySelector('[data-del]'); if (del) del.onclick = function () {
      if (!confirm('Delete "' + p.name + '" and all of its steps?')) return;
      var dd = data(), snap = JSON.stringify(dd);
      delete dd.projects[id];['keys', 'layers', 'steps'].forEach(function (k) { Object.keys(dd[k]).forEach(function (x) { if (dd[k][x].proj === id) delete dd[k][x]; }); });
      save(dd); m.close(); A.render(); toast('Project deleted.', 'Undo', function () { save(JSON.parse(snap)); A.render(); });
    };
  }

  function keysDlg(pid, after) {
    var d = data(), ks = keysOf(d, pid);
    function rowH(k) { return '<div class="krow" data-kid="' + (k.id || '') + '"><input type="color" value="' + (okCol(k.color) || '#2186d8') + '" aria-label="Colour"><input type="text" maxlength="40" value="' + esc(k.name || '') + '" placeholder="What this colour means, e.g. Making"><button type="button" class="iconbtn" data-rm aria-label="Remove">' + IC.trash + '</button></div>'; }
    var m = modal('<h2>Colour key</h2><p class="small muted" style="margin:-6px 0 12px">Give each colour a meaning, then colour your steps with them. The key is printed on your Gantt chart.</p><div class="klist">' + ks.map(rowH).join('') + '</div>' +
      '<button type="button" class="btn sm" data-addk style="margin-top:8px">' + IC.plus + 'Add a colour</button><div class="foot"><button type="button" class="btn pr" data-s>Save</button></div>', '', after);
    var B = m.box;
    function wireRm() { $$('[data-rm]', B).forEach(function (b) { b.onclick = function () { b.parentNode.parentNode.removeChild(b.parentNode); }; }); }
    wireRm();
    B.querySelector('[data-addk]').onclick = function () { var used = $$('.krow input[type=color]', B).map(function (i) { return i.value; }); var div = document.createElement('div'); div.innerHTML = rowH({ color: PCOLS.filter(function (c) { return used.indexOf(c) < 0; })[0] || '#6b7a90' }); $('.klist', B).appendChild(div.firstChild); wireRm(); $$('.krow input[type=text]', B).pop().focus(); };
    B.querySelector('[data-s]').onclick = function () {
      var dd = data(), keep = {};
      $$('.krow', B).forEach(function (r, i) {
        var n = r.querySelector('input[type=text]').value.trim(), c = r.querySelector('input[type=color]').value, kid = r.getAttribute('data-kid');
        if (!n) return; if (!kid) kid = 'k' + uid() + i; keep[kid] = 1;
        dd.keys[kid] = Object.assign(dd.keys[kid] || { id: kid, proj: pid, t: Date.now() }, { name: n.slice(0, 40), color: c, o: i });
      });
      keysOf(dd, pid).forEach(function (k) { if (!keep[k.id]) { delete dd.keys[k.id]; stepsOf(dd, pid).forEach(function (s) { if (s.key === k.id) s.key = ''; }); } });
      save(dd); m.close(); A.render();
    };
  }

  function layersDlg(pid) {
    var d = data(), ls = layersOf(d, pid);
    function rowH(l) { return '<div class="krow" data-lid="' + (l.id || '') + '"><label class="row" style="gap:6px" title="Show"><input type="checkbox" class="check"' + (l.hidden ? '' : ' checked') + ' aria-label="Show"></label><input type="text" maxlength="40" value="' + esc(l.name || '') + '" placeholder="e.g. Practical, Portfolio, Research"><button type="button" class="iconbtn" data-up aria-label="Move up">' + I.up + '</button><button type="button" class="iconbtn" data-rm aria-label="Remove">' + IC.trash + '</button></div>'; }
    var m = modal('<h2>Layers</h2><p class="small muted" style="margin:-6px 0 12px">Layers group your steps, like Practical work and Portfolio. Untick one to hide it. Turn on <b>Overlay layers</b> to see each layer on one line, side by side.</p><div class="klist">' + ls.map(rowH).join('') + '</div>' +
      '<button type="button" class="btn sm" data-addl style="margin-top:8px">' + IC.plus + 'Add a layer</button><div class="foot"><button type="button" class="btn pr" data-s>Save</button></div>');
    var B = m.box;
    function wireRows() {
      $$('[data-rm]', B).forEach(function (b) { b.onclick = function () { if ($$('.krow', B).length <= 1) return toast('Keep at least one layer.'); b.parentNode.parentNode.removeChild(b.parentNode); }; });
      $$('[data-up]', B).forEach(function (b) { b.onclick = function () { var r = b.parentNode, p = r.previousElementSibling; if (p) r.parentNode.insertBefore(r, p); }; });
    }
    wireRows();
    B.querySelector('[data-addl]').onclick = function () { var div = document.createElement('div'); div.innerHTML = rowH({}); $('.klist', B).appendChild(div.firstChild); wireRows(); $$('.krow input[type=text]', B).pop().focus(); };
    B.querySelector('[data-s]').onclick = function () {
      var dd = data(), keep = {}, first = null;
      $$('.krow', B).forEach(function (r, i) {
        var n = r.querySelector('input[type=text]').value.trim() || 'Layer ' + (i + 1), lid = r.getAttribute('data-lid');
        if (!lid) lid = 'l' + uid() + i; keep[lid] = 1; if (!first) first = lid;
        dd.layers[lid] = Object.assign(dd.layers[lid] || { id: lid, proj: pid, t: Date.now() }, { name: n.slice(0, 40), hidden: !r.querySelector('.check').checked, o: i });
      });
      if (!first) return;
      layersOf(dd, pid).forEach(function (l) { if (!keep[l.id]) { delete dd.layers[l.id]; stepsOf(dd, pid).forEach(function (s) { if (s.layer === l.id) s.layer = first; }); } });
      save(dd); m.close(); A.render();
    };
  }

  /* ---------- the Gantt chart to hand in: a clean SVG, saved as a picture, SVG or PDF ---------- */
  function xmlEsc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); }
  function clip(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function fmt(s) { if (!s) return ''; var d = parseISO(s); return d.getDate() + ' ' + MON[d.getMonth()].slice(0, 3) + ' ' + String(d.getFullYear()).slice(2); }
  function buildSVG(pids, opt) {
    var d = data(), FONT = 'Helvetica, Arial, sans-serif', rows = [], lo = null, hi = null, t = today();
    function ext(s) { if (!s) return; if (!lo || s < lo) lo = s; if (!hi || s > hi) hi = s; }
    pids.forEach(function (pid) {
      var p = d.projects[pid], ls = layersOf(d, pid).filter(function (l) { return !l.hidden; }), ss = stepsOf(d, pid), multi = ls.length > 1;
      ext(p.start); ext(p.end);
      if (pids.length > 1) rows.push({ t: 'proj', p: p });
      (ls.length ? ls : [{ id: '' }]).forEach(function (l, li) {
        var mine = ss.filter(function (s) { return (s.layer === l.id || (!d.layers[s.layer] && li === 0)) && (s.kind !== 'note' || opt.notes); });
        if (!mine.length) return;
        if (multi) rows.push({ t: 'layer', name: l.name });
        mine.forEach(function (s) { ext(s.start); ext(s.end); rows.push({ t: 'step', s: s }); });
      });
    });
    if (!lo) { lo = t; hi = addDays(t, 30); }
    var a0 = parseISO(lo), A0 = iso(new Date(a0.getFullYear(), a0.getMonth(), 1)), h0 = parseISO(hi), B0 = iso(new Date(h0.getFullYear(), h0.getMonth() + 1, 0));
    var span = days(A0, B0) + 1, TW = Math.max(760, Math.min(1500, span * 6)), ppd = TW / span, unit = ppd >= 16 ? 'day' : ppd >= 2.2 ? 'week' : 'month';
    var cols = [['#', 26], ['Task', 250], ['Start', 70], ['Deadline', 70], ['Days', 44], ['Done', 46]], TBW = cols.reduce(function (s, c) { return s + c[1]; }, 0);
    var M = 28, TOP = 92, HH = 44, RH = 24, X0 = M + TBW + 12, W = X0 + TW + M, bodyH = rows.length * RH, legH = 58, H = TOP + HH + bodyH + legH + M;
    var one = pids.length === 1 ? d.projects[pids[0]] : null, o = [];
    function X(s) { return X0 + days(A0, s) * ppd; }
    o.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + FONT + '">');
    o.push('<rect width="100%" height="100%" fill="#fff"/>');
    // title block
    var title = opt.title || (one ? one.name : 'Project plan'), sub = one ? ((TPL[one.type] || TPL.other).name + ' · ' + fmt(one.start) + ' to ' + fmt(one.end) + ' · ' + projPct(d, one.id) + '% complete') : pids.map(function (pid) { return d.projects[pid].name + ' ' + projPct(d, pid) + '%'; }).join('  ·  ');
    o.push('<text x="' + M + '" y="' + (M + 20) + '" font-size="22" font-weight="700" fill="#0b2236">' + xmlEsc(clip(title, 80)) + '</text>');
    o.push('<text x="' + M + '" y="' + (M + 42) + '" font-size="12.5" fill="#4a6178">' + xmlEsc(sub) + '</text>');
    o.push('<text x="' + (W - M) + '" y="' + (M + 20) + '" font-size="11" fill="#6b7f93" text-anchor="end">Gantt chart' + (opt.name ? ' · ' + xmlEsc(opt.name) : '') + '</text>');
    o.push('<text x="' + (W - M) + '" y="' + (M + 38) + '" font-size="11" fill="#6b7f93" text-anchor="end">Updated ' + xmlEsc(niceDate(t, true) + ' ' + parseISO(t).getFullYear()) + '</text>');
    var yH = TOP, yB = TOP + HH;
    // table header
    o.push('<rect x="' + M + '" y="' + yH + '" width="' + (W - 2 * M) + '" height="' + HH + '" fill="#eef3f8"/>');
    var cx = M; cols.forEach(function (c, i) { o.push('<text x="' + (cx + (i >= 2 ? c[1] / 2 : 6)) + '" y="' + (yH + HH - 10) + '" font-size="11" font-weight="700" fill="#33485c"' + (i >= 2 ? ' text-anchor="middle"' : '') + '>' + c[0] + '</text>'); cx += c[1]; });
    // timeline header: two tiers
    var m = new Date(a0.getFullYear(), a0.getMonth(), 1);
    if (unit === 'month') {
      for (var y = a0.getFullYear(); iso(new Date(y, 0, 1)) <= B0; y++) { var ys = iso(new Date(y, 0, 1)) < A0 ? A0 : iso(new Date(y, 0, 1)); o.push('<text x="' + (X(ys) + 4) + '" y="' + (yH + 16) + '" font-size="11" font-weight="700" fill="#33485c">' + y + '</text>'); }
    }
    while (iso(m) <= B0) {
      var ms = iso(m), nx = new Date(m.getFullYear(), m.getMonth() + 1, 1), mw = days(ms, iso(nx)) * ppd;
      o.push('<line x1="' + X(ms) + '" y1="' + yH + '" x2="' + X(ms) + '" y2="' + (yB + bodyH) + '" stroke="#c9d5e1" stroke-width="1"/>');
      if (unit !== 'month') o.push('<text x="' + (X(ms) + 4) + '" y="' + (yH + 16) + '" font-size="11" font-weight="700" fill="#33485c">' + MON[m.getMonth()] + ' ' + m.getFullYear() + '</text>');
      else o.push('<text x="' + (X(ms) + mw / 2) + '" y="' + (yH + HH - 10) + '" font-size="10.5" fill="#4a6178" text-anchor="middle">' + MON[m.getMonth()].slice(0, 3) + '</text>');
      m = nx;
    }
    if (unit === 'week') for (var w = monday(A0); w <= B0; w = addDays(w, 7)) { if (w < A0) continue; o.push('<line x1="' + X(w) + '" y1="' + (yH + 24) + '" x2="' + X(w) + '" y2="' + (yB + bodyH) + '" stroke="#e6ecf2" stroke-width="1"/>'); if (7 * ppd >= 22) o.push('<text x="' + (X(w) + 3) + '" y="' + (yH + HH - 10) + '" font-size="9.5" fill="#6b7f93">' + parseISO(w).getDate() + '</text>'); }
    if (unit === 'day') for (var i = 0; i < span; i++) { var dd = addDays(A0, i), wd = parseISO(dd).getDay(); if (wd === 0 || wd === 6) o.push('<rect x="' + X(dd) + '" y="' + yB + '" width="' + ppd + '" height="' + bodyH + '" fill="#f4f6f9"/>'); o.push('<text x="' + (X(dd) + ppd / 2) + '" y="' + (yH + HH - 10) + '" font-size="9.5" fill="#6b7f93" text-anchor="middle">' + parseISO(dd).getDate() + '</text>'); }
    o.push('<line x1="' + M + '" y1="' + yB + '" x2="' + (W - M) + '" y2="' + yB + '" stroke="#9fb1c3" stroke-width="1"/>');
    // rows
    var n = 0;
    rows.forEach(function (r, ri) {
      var y = yB + ri * RH, cy = y + RH / 2 + 4;
      if (r.t === 'proj') { o.push('<rect x="' + M + '" y="' + y + '" width="' + (W - 2 * M) + '" height="' + RH + '" fill="#e3ebf4"/><rect x="' + M + '" y="' + y + '" width="4" height="' + RH + '" fill="' + r.p.color + '"/><text x="' + (M + 10) + '" y="' + cy + '" font-size="12" font-weight="700" fill="#0b2236">' + xmlEsc(clip(r.p.name, 40)) + '</text>'); if (r.p.start && r.p.end) { o.push('<rect x="' + X(r.p.start) + '" y="' + (y + 8) + '" width="' + (days(r.p.start, r.p.end) + 1) * ppd + '" height="8" rx="2" fill="' + r.p.color + '" opacity=".35"/>'); } return; }
      if (r.t === 'layer') { o.push('<rect x="' + M + '" y="' + y + '" width="' + (W - 2 * M) + '" height="' + RH + '" fill="#f6f8fb"/><text x="' + (M + 8) + '" y="' + cy + '" font-size="10.5" font-weight="700" fill="#5a6f84" letter-spacing=".6">' + xmlEsc(String(r.name).toUpperCase()) + '</text>'); return; }
      var s = r.s, c = stepCol(d, s), pct = s.pct || 0, L = s.kind === 'step' ? len(s) : '', lateS = late(s);
      n++; if (n % 2 === 0) o.push('<rect x="' + M + '" y="' + y + '" width="' + (W - 2 * M) + '" height="' + RH + '" fill="#fafbfd"/>');
      var cells = [String(n), clip(s.title, 40), fmt(s.start), s.kind === 'step' ? fmt(s.end) : s.kind === 'milestone' ? '◆' : '', L ? String(L) : '', s.kind === 'note' ? '' : pct + '%'];
      cx = M; cells.forEach(function (v, i) { o.push('<text x="' + (cx + (i >= 2 ? cols[i][1] / 2 : 6)) + '" y="' + cy + '" font-size="11"' + (i >= 2 ? ' text-anchor="middle"' : '') + ' fill="' + (i === 5 && pct >= 100 ? '#17803d' : i === 1 && s.kind === 'milestone' ? '#0b2236' : '#24384c') + '"' + (i === 1 && s.kind !== 'step' ? ' font-style="italic"' : '') + (i === 1 && s.kind === 'milestone' ? ' font-weight="700"' : '') + '>' + xmlEsc(v) + '</text>'); cx += cols[i][1]; });
      o.push('<line x1="' + M + '" y1="' + (y + RH) + '" x2="' + (W - M) + '" y2="' + (y + RH) + '" stroke="#eef2f6"/>');
      if (s.kind === 'milestone' && s.start) { var mx = X(s.start) + ppd / 2; o.push('<path d="M' + mx + ' ' + (y + 4) + 'l8 8-8 8-8-8z" fill="' + (pct >= 100 ? c : '#fff') + '" stroke="' + c + '" stroke-width="2"/>'); o.push('<text x="' + (mx + 12) + '" y="' + cy + '" font-size="10.5" font-weight="700" fill="#24384c">' + xmlEsc(clip(s.title, 34)) + '</text>'); return; }
      if (s.kind === 'note' && s.start) { var nx2 = X(s.start); o.push('<rect x="' + nx2 + '" y="' + (y + 4) + '" width="' + Math.min(220, 14 + clip(s.title, 34).length * 5.8) + '" height="' + (RH - 8) + '" rx="3" fill="#fff6cf" stroke="#e3c45a"/><text x="' + (nx2 + 6) + '" y="' + (cy - 1) + '" font-size="10" font-style="italic" fill="#5c4a00">' + xmlEsc(clip(s.title, 34)) + '</text>'); return; }
      if (!s.start || !s.end) return;
      var bx = X(s.start), bw = Math.max(2, len(s) * ppd), by = y + 5, bh = RH - 10;
      if (opt.actual && s.as) { var ae = s.ae || (s.as <= t ? t : s.as); o.push('<rect x="' + X(s.as) + '" y="' + (y + RH - 5) + '" width="' + Math.max(ppd, (days(s.as, ae) + 1) * ppd) + '" height="3" fill="' + c + '" opacity=".8"/>'); bh -= 3; }
      o.push('<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="3" fill="' + c + '" fill-opacity=".28" stroke="' + (lateS ? '#d6453d' : c) + '" stroke-width="' + (lateS ? 1.6 : 1) + '"/>');
      if (pct) o.push('<rect x="' + bx + '" y="' + by + '" width="' + bw * pct / 100 + '" height="' + bh + '" rx="3" fill="' + c + '"/>');
      if (opt.labels) { var lbl = clip(s.title, 40) + (pct ? '  ' + pct + '%' : ''); o.push('<text x="' + (bx + bw + 5) + '" y="' + (by + bh / 2 + 3.5) + '" font-size="9.5" fill="#4a6178">' + xmlEsc(lbl) + '</text>'); }
    });
    // today and hand-in lines
    if (t >= A0 && t <= B0) { var tx = X(t) + ppd / 2; o.push('<line x1="' + tx + '" y1="' + yH + '" x2="' + tx + '" y2="' + (yB + bodyH) + '" stroke="#2186d8" stroke-width="1.6"/><rect x="' + (tx - 19) + '" y="' + (yB + bodyH + 2) + '" width="38" height="14" rx="3" fill="#2186d8"/><text x="' + tx + '" y="' + (yB + bodyH + 12.5) + '" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">TODAY</text>'); }
    handins(d, pids).forEach(function (g, gi) { var ex = X(g.date) + ppd; o.push('<line x1="' + ex + '" y1="' + yH + '" x2="' + ex + '" y2="' + (yB + bodyH) + '" stroke="#d6453d" stroke-width="1.6" stroke-dasharray="5 3"/><text x="' + (ex - 4) + '" y="' + (yH - 4 - (gi % 2) * 12) + '" font-size="10" font-weight="700" fill="#d6453d" text-anchor="end">' + xmlEsc((pids.length > 1 ? g.names.join(' + ') + ' ' : '') + 'Hand-in ' + fmt(g.date)) + '</text>'); });
    o.push('<rect x="' + M + '" y="' + yH + '" width="' + (W - 2 * M) + '" height="' + (HH + bodyH) + '" fill="none" stroke="#9fb1c3"/>');
    o.push('<line x1="' + (X0 - 6) + '" y1="' + yH + '" x2="' + (X0 - 6) + '" y2="' + (yB + bodyH) + '" stroke="#9fb1c3"/>');
    // legend
    var ly = yB + bodyH + 34, lx = M;
    o.push('<text x="' + lx + '" y="' + ly + '" font-size="11" font-weight="700" fill="#33485c">Key</text>'); lx += 34;
    pids.forEach(function (pid) { keysOf(d, pid).forEach(function (k) { o.push('<rect x="' + lx + '" y="' + (ly - 9) + '" width="16" height="10" rx="2" fill="' + k.color + '"/><text x="' + (lx + 21) + '" y="' + ly + '" font-size="10.5" fill="#33485c">' + xmlEsc(k.name) + '</text>'); lx += 34 + k.name.length * 6; }); });
    lx += 10;
    o.push('<rect x="' + lx + '" y="' + (ly - 9) + '" width="30" height="10" rx="2" fill="#7b8da0" fill-opacity=".28" stroke="#7b8da0"/><rect x="' + lx + '" y="' + (ly - 9) + '" width="14" height="10" rx="2" fill="#7b8da0"/><text x="' + (lx + 36) + '" y="' + ly + '" font-size="10.5" fill="#33485c">Planned / done so far</text>'); lx += 160;
    o.push('<path d="M' + (lx + 6) + ' ' + (ly - 11) + 'l6 6-6 6-6-6z" fill="#fff" stroke="#33485c" stroke-width="1.6"/><text x="' + (lx + 17) + '" y="' + ly + '" font-size="10.5" fill="#33485c">Milestone</text>'); lx += 82;
    o.push('<rect x="' + lx + '" y="' + (ly - 9) + '" width="16" height="10" rx="2" fill="none" stroke="#d6453d" stroke-width="1.6"/><text x="' + (lx + 21) + '" y="' + ly + '" font-size="10.5" fill="#33485c">Behind schedule</text>'); lx += 120;
    if (opt.actual) { o.push('<rect x="' + lx + '" y="' + (ly - 5) + '" width="20" height="3" fill="#33485c"/><text x="' + (lx + 25) + '" y="' + ly + '" font-size="10.5" fill="#33485c">Actual time spent</text>'); lx += 130; }
    o.push('<line x1="' + lx + '" y1="' + (ly - 11) + '" x2="' + lx + '" y2="' + (ly + 1) + '" stroke="#d6453d" stroke-width="1.6" stroke-dasharray="4 2"/><text x="' + (lx + 6) + '" y="' + ly + '" font-size="10.5" fill="#33485c">Final hand-in</text>');
    o.push('</svg>');
    return { svg: o.join(''), w: W, h: H };
  }
  function exportDlg(pids) {
    var d = data(), opt = { notes: true, actual: pp().actual, labels: true, name: '', title: '' };
    try { opt.name = localStorage.getItem('tt-plan-name') || ''; } catch (e) {}
    var m = modal('<h2>Your Gantt chart</h2><div class="row" style="margin-bottom:10px"><div class="grow"><label class="f" for="xT">Title</label><input type="text" id="xT" maxlength="80" value="' + esc(pids.length === 1 ? d.projects[pids[0]].name : 'My projects') + '"></div><div class="grow"><label class="f" for="xN">Your name (optional)</label><input type="text" id="xN" maxlength="60" value="' + esc(opt.name) + '"></div></div>' +
      '<div class="row small" style="gap:16px;margin-bottom:10px"><label class="row" style="gap:6px"><input type="checkbox" class="check" id="xL" checked>Labels next to bars</label><label class="row" style="gap:6px"><input type="checkbox" class="check" id="xA"' + (opt.actual ? ' checked' : '') + '>What I actually did</label><label class="row" style="gap:6px"><input type="checkbox" class="check" id="xO" checked>Notes</label></div>' +
      '<div class="xprev" id="xPrev"></div><div class="foot"><button type="button" class="btn" data-svg>' + I.download + 'SVG</button><button type="button" class="btn" data-png>' + I.download + 'Picture (PNG)</button><button type="button" class="btn pr" data-pdf>' + I.print + 'Print or save as PDF</button></div>', 'xwide');
    var B = m.box, cur = null;
    function draw() {
      opt.title = $('#xT', B).value.trim(); opt.name = $('#xN', B).value.trim(); opt.labels = $('#xL', B).checked; opt.actual = $('#xA', B).checked; opt.notes = $('#xO', B).checked;
      try { localStorage.setItem('tt-plan-name', opt.name); } catch (e) {}
      cur = buildSVG(pids, opt); $('#xPrev', B).innerHTML = cur.svg;
    }
    draw(); $$('input', B).forEach(function (i) { i.addEventListener(i.type === 'checkbox' ? 'change' : 'input', draw); });
    function fname(ext) { return (opt.title || 'gantt-chart').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '-gantt.' + ext; }
    function dl(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 500); }
    B.querySelector('[data-svg]').onclick = function () { dl(new Blob([cur.svg], { type: 'image/svg+xml' }), fname('svg')); };
    B.querySelector('[data-png]').onclick = function () {
      var img = new Image(), url = URL.createObjectURL(new Blob([cur.svg], { type: 'image/svg+xml' }));
      img.onload = function () { var c = document.createElement('canvas'), k = 2; c.width = cur.w * k; c.height = cur.h * k; var g = c.getContext('2d'); g.scale(k, k); g.drawImage(img, 0, 0); URL.revokeObjectURL(url); c.toBlob(function (b) { dl(b, fname('png')); toast('Saved the picture. Put it in your portfolio!'); }); };
      img.src = url;
    };
    B.querySelector('[data-pdf]').onclick = function () {
      var f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
      var doc = f.contentWindow.document; doc.open();
      doc.write('<!DOCTYPE html><html><head><title>' + esc(opt.title || 'Gantt chart') + '</title><style>@page{size:A4 landscape;margin:8mm}html,body{margin:0}svg{width:100%;height:auto;display:block}</style></head><body>' + cur.svg + '</body></html>');
      doc.close();
      setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 2000); }, 250);
    };
  }

  /* ---------- from a photo: any AI reads your deadline sheet and writes a plan you paste in ----------
     The app never sends anything anywhere: you copy our prompt into your own AI with your photo, then paste its reply back. */
  function aiPrompt() {
    var t = today();
    return [
      'You are helping a student turn a photo of their coursework deadlines into a simple project plan for the TrainTanmay planner app.',
      '',
      'Look at the photo (or photos) I have attached. It shows the deadlines for a school project, such as an A level DT NEA, an EPQ or other coursework.',
      '',
      "Today's date is " + t + '. Dates in the photo are written the UK way (day/month/year). If a date has no year, use the next time that date comes after today.',
      '',
      'Do this:',
      '1. Find every deadline, hand-in, milestone and checkpoint in the photo. Use the name as it is written, shortened to under 60 characters if needed.',
      '2. Give each one a "start" and an "end" date, written YYYY-MM-DD. The "end" is the deadline. If no start date is shown, start it the day after the previous deadline (the first one starts today, ' + t + ').',
      '3. Anything that happens on a single day (a hand-in, an assessment, a review meeting, an exam) is a milestone: set "type" to "milestone" and give it the same start and end. Everything else has "type": "step".',
      '4. If the photo groups the deadlines (for example by section, by term, or Portfolio and Practical), put the group name in "group". Otherwise leave "group" out.',
      '5. Put the steps in date order. "project" is the name of the project. The top-level "end" is the final hand-in date (the latest deadline).',
      '6. If you cannot read something clearly, make your best guess and add "check": true to that step. Do not add deadlines that are not in the photo.',
      '',
      'Reply with ONLY the plan in one code block, exactly in this format, and nothing else:',
      '',
      '{"tt_plan":1,"project":"DT NEA","end":"2027-05-07","steps":[',
      '{"title":"Section A: research","start":"2026-11-25","end":"2026-12-11","type":"step","group":"Portfolio"},',
      '{"title":"Design brief hand-in","start":"2026-12-11","end":"2026-12-11","type":"milestone","group":"Portfolio"}',
      ']}'
    ].join('\n');
  }
  function normDate(v) {
    v = String(v == null ? '' : v).trim(); var m;
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(v))) return okDate(+m[1], +m[2], +m[3]);
    if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(v))) return okDate(m[3].length === 2 ? 2000 + +m[3] : +m[3], +m[2], +m[1]);
    return '';
  }
  function okDate(y, mo, da) { var d = new Date(y, mo - 1, da); return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da && y > 2000 && y < 2100 ? iso(d) : ''; }
  /* read what the AI wrote: forgiving about code fences, curly quotes, trailing commas and UK dates */
  function parsePlan(text) {
    var t = String(text || '').replace(/[“”„″]/g, '"').replace(/[‘’]/g, "'");
    var a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b < a) return { err: "That doesn't look like the AI's plan. Copy its whole reply, from the first { to the last }." };
    var raw = t.slice(a, b + 1).replace(/,\s*([\]}])/g, '$1'), j;
    try { j = JSON.parse(raw); } catch (e) { return { err: "Couldn't read that. Make sure you copied the AI's whole reply. If it's cut off, ask the AI: \"Give me the whole plan again in one code block.\"" }; }
    var list = Array.isArray(j) ? j : j.steps || j.tasks || j.deadlines;
    if (!Array.isArray(list) || !list.length) return { err: 'The plan has no deadlines in it. Ask the AI to try again with a clearer photo.' };
    var steps = [], bad = 0;
    list.slice(0, 200).forEach(function (x) {
      if (!x || typeof x !== 'object') { bad++; return; }
      var title = String(x.title || x.name || x.task || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      var st = normDate(x.start), en = normDate(x.end || x.deadline || x.due || x.date);
      if (!en) en = st; if (!st) st = en;
      if (!title || !en) { bad++; return; }
      if (st > en) { var q = st; st = en; en = q; }
      var ms = /milestone/i.test(x.type || '');
      steps.push({ title: title, start: ms ? en : st, end: en, kind: ms ? 'milestone' : 'step', group: String(x.group || '').trim().slice(0, 40), check: !!x.check });
    });
    if (!steps.length) return { err: "None of the deadlines had a name and a date I could read. Ask the AI to try again." };
    steps.sort(function (p, q) { return p.end < q.end ? -1 : p.end > q.end ? 1 : 0; });
    var lo = steps.reduce(function (m, s) { return s.start < m ? s.start : m; }, steps[0].start), hi = steps.reduce(function (m, s) { return s.end > m ? s.end : m; }, steps[0].end);
    var end = normDate(j.end) || hi; if (end < hi) end = hi;
    var start = normDate(j.start) || lo; if (start > lo) start = lo; if (today() < start && today() > addDays(start, -60)) start = today();
    return { name: String(j.project || j.name || 'My project').trim().slice(0, 60) || 'My project', start: start, end: end, steps: steps, bad: bad };
  }
  function importPlan(pl, into) {
    var d = data(), now = Date.now(), pid = into && d.projects[into] ? into : '';
    if (!pid) {
      pid = 'p' + uid(); var used = projects(d).map(function (p) { return p.color; });
      d.projects[pid] = { id: pid, name: pl.name, type: /\bNEA\b/i.test(pl.name) ? 'nea' : /\bEPQ\b/i.test(pl.name) ? 'epq' : 'other', color: PCOLS.filter(function (c) { return used.indexOf(c) < 0; })[0] || PCOLS[0], start: pl.start, end: pl.end, notes: '', o: maxO(projects(d)) + 1, t: now };
    } else { var pr = d.projects[pid]; if (!pr.end || pl.end > pr.end) pr.end = pl.end; if (!pr.start || pl.start < pr.start) pr.start = pl.start; }
    // each group becomes a layer and a colour in the key, so the chart comes out coloured and grouped
    var lay = {}, key = {}, ki = keysOf(d, pid).length;
    layersOf(d, pid).forEach(function (l) { lay[l.name.toLowerCase()] = l.id; });
    keysOf(d, pid).forEach(function (k) { key[k.name.toLowerCase()] = k.id; });
    var base = maxO(stepsOf(d, pid)) + 1, grouped = pl.steps.some(function (s) { return s.group; });
    pl.steps.forEach(function (s, i) {
      var g = s.group || (grouped ? 'Deadlines' : ''), gl = g.toLowerCase(), lid = '', kid = '';
      if (g) {
        if (!lay[gl]) { lid = 'l' + uid() + i; d.layers[lid] = { id: lid, proj: pid, name: g, o: layersOf(d, pid).length, t: now }; lay[gl] = lid; }
        if (!key[gl]) { kid = 'k' + uid() + i; d.keys[kid] = { id: kid, proj: pid, name: g, color: PCOLS[ki++ % PCOLS.length], o: ki, t: now }; key[gl] = kid; }
      }
      var id = 's' + uid() + i;
      d.steps[id] = { id: id, proj: pid, layer: g ? lay[gl] : '', key: g ? key[gl] : '', kind: s.kind, title: s.title, start: s.start, end: s.end, pct: 0, note: s.check ? 'The AI was not sure about this one: check it against your sheet.' : '', cal: true, o: base + i, t: now };
    });
    var fl = firstLayer(d, pid); stepsOf(d, pid).forEach(function (s) { if (!s.layer || !d.layers[s.layer]) s.layer = fl; });
    save(d); setPP('cur', pid); return pid;
  }
  function aiDlg(intoId) {
    var d = data(), into = intoId && d.projects[intoId] ? d.projects[intoId] : null, pl = null;
    var m = modal('<h2>Make a plan from a photo</h2>' +
      '<p class="small muted" style="margin:-6px 0 14px">Works with any AI that can read pictures: ChatGPT, Claude, Gemini, Copilot… Nothing is sent from this app. You use your own AI, then paste its answer here.</p>' +
      '<ol class="aisteps">' +
      '<li><b>Take a photo</b> of your deadlines (the sheet from your teacher, the board, your planner). Make sure the dates are sharp and readable.</li>' +
      '<li><b>Copy this prompt</b> and paste it into your AI along with the photo.' +
      '<textarea id="aiP" readonly class="aiprompt" aria-label="Prompt for your AI">' + esc(aiPrompt()) + '</textarea>' +
      '<button type="button" class="btn pr" data-copy>' + I.copy + 'Copy the prompt</button></li>' +
      '<li><b>Paste the AI\'s answer</b> here (all of it is fine).' +
      '<textarea id="aiR" class="aireply" placeholder=\'{"tt_plan":1,"project":"…","steps":[ … ]}\' aria-label="The AI\'s answer"></textarea>' +
      '<div id="aiOut"></div></li></ol>' +
      '<div class="foot"><button type="button" class="btn ghost left small" data-aioff title="You can turn it back on in Settings">Hide this feature</button><button type="button" class="btn pr" data-go disabled>' + I.chart + 'Make my Gantt chart</button></div>', 'wide');
    var B = m.box, out = $('#aiOut', B), go = B.querySelector('[data-go]');
    B.querySelector('[data-copy]').onclick = function () {
      var ta = $('#aiP', B), done = function () { toast('Prompt copied. Now paste it into your AI with your photo.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Select the prompt and copy it.'); } });
      else { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Select the prompt and copy it.'); } }
    };
    function check() {
      var txt = $('#aiR', B).value; if (!txt.trim()) { out.innerHTML = ''; go.disabled = true; pl = null; return; }
      var r = parsePlan(txt);
      if (r.err) { out.innerHTML = '<p class="aierr">' + esc(r.err) + '</p>'; go.disabled = true; pl = null; return; }
      pl = r; go.disabled = false;
      var unsure = r.steps.filter(function (s) { return s.check; }).length;
      out.innerHTML = '<div class="aiprev"><div class="row" style="justify-content:space-between"><b>Found ' + r.steps.length + ' deadline' + (r.steps.length > 1 ? 's' : '') + '</b><span class="small muted">Final hand-in ' + esc(niceDate(r.end, true)) + '</span></div>' +
        (r.bad ? '<p class="small" style="color:#a06f00;margin:4px 0">' + r.bad + ' line' + (r.bad > 1 ? 's were' : ' was') + ' missing a name or date and left out.</p>' : '') +
        (unsure ? '<p class="small" style="color:#a06f00;margin:4px 0">The AI wasn\'t sure about ' + unsure + ' (marked ?). Check them against your sheet.</p>' : '') +
        '<ul>' + r.steps.map(function (s) { return '<li>' + (s.kind === 'milestone' ? I.diamond : '<i class="aibar"></i>') + '<span class="tt">' + esc(s.title) + (s.check ? ' <b class="aiq" title="Check this one">?</b>' : '') + '</span><span class="small muted">' + esc(s.kind === 'milestone' ? niceDate(s.end) : niceDate(s.start) + ' → ' + niceDate(s.end)) + '</span>' + (s.group ? '<span class="tag">' + esc(s.group) + '</span>' : '') + '</li>'; }).join('') + '</ul>' +
        '<div class="fields" style="margin-top:10px">' +
        (into ? '<div class="seg" role="group" aria-label="Where"><button type="button" data-where="new" aria-pressed="false">New project</button><button type="button" data-where="into" aria-pressed="true">Add to ' + esc(into.name) + '</button></div>' : '') +
        '<div id="aiNameW"' + (into ? ' hidden' : '') + '><label class="f" for="aiName">Project name</label><input type="text" id="aiName" maxlength="60" value="' + esc(r.name) + '"></div></div></div>';
      $$('[data-where]', out).forEach(function (b) { b.onclick = function () { $$('[data-where]', out).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); $('#aiNameW', out).hidden = b.getAttribute('data-where') !== 'new'; }; });
    }
    $('#aiR', B).addEventListener('input', check);
    go.onclick = function () {
      if (!pl) return;
      var w = $('[data-where][aria-pressed=true]', out), toNew = !w || w.getAttribute('data-where') === 'new';
      if (toNew) { var nm = ($('#aiName', out).value || '').trim(); if (nm) pl.name = nm.slice(0, 60); }
      importPlan(pl, toNew ? '' : into.id); m.close(); scrollKeep = null; focusDate = null;
      if (A.tab() !== 'planner') location.hash = '#planner'; else A.render();
      toast('Your Gantt chart is ready. Drag the bars to fit how you work.');
    };
    B.querySelector('[data-aioff]').onclick = function () { setPP('ai', false); m.close(); A.render(); toast('Photo plans are hidden. Turn them back on in Settings.'); };
  }

  /* ---------- the calendar: hand-in dates, milestones and step deadlines ---------- */
  function calItems(date) {
    var d = data(), out = [];
    projects(d).forEach(function (p) {
      if (p.end === date) out.push({ src: 'plan', e: { id: 'P:' + p.id, title: p.name + ' hand-in', kind: 'deadline', date: date, color: p.color } });
      stepsOf(d, p.id).forEach(function (s) {
        if (s.cal === false || s.kind === 'note' || (d.layers[s.layer] && d.layers[s.layer].hidden)) return;
        if (s.kind === 'milestone' && s.start === date) out.push({ src: 'plan', e: { id: s.id, title: s.title, kind: 'deadline', date: date, color: stepCol(d, s), done: (s.pct || 0) >= 100 } });
        else if (s.kind === 'step' && s.end === date) out.push({ src: 'plan', e: { id: s.id, title: s.title + ' (' + p.name + ')', kind: 'task', date: date, color: stepCol(d, s), done: (s.pct || 0) >= 100 } });
      });
    });
    return out;
  }
  function upcoming(t) {
    var d = data(), out = [];
    projects(d).forEach(function (p) {
      if (p.end && p.end >= t) out.push({ id: 'P:' + p.id, plan: 1, title: p.name + ' hand-in', date: p.end });
      stepsOf(d, p.id).forEach(function (s) { if (s.kind === 'milestone' && s.cal !== false && s.start >= t && (s.pct || 0) < 100) out.push({ id: s.id, plan: 1, title: s.title, date: s.start }); });
    });
    return out;
  }
  function open(id) {
    var d = data();
    if (id.indexOf('P:') === 0) { var pid = id.slice(2); if (!d.projects[pid]) return; setPP('cur', pid); focusDate = d.projects[pid].end; location.hash = '#planner'; return; }
    var s = d.steps[id]; if (!s) return;
    setPP('cur', s.proj); focusDate = s.start || null;
    if (A.tab() === 'planner') { A.render(); stepDlg(id); } else { openNext = function () { stepDlg(id); }; location.hash = '#planner'; }
  }
  function moveTo(id, date) {
    var d = data();
    if (id.indexOf('P:') === 0) { var p = d.projects[id.slice(2)]; if (p) { p.end = date; save(d); } return; }
    var s = d.steps[id]; if (!s) return;
    if (s.kind === 'step') { var n = s.start && s.end ? days(s.start, s.end) : 0; s.end = date; s.start = addDays(date, -n); } else { s.start = s.end = date; }
    save(d);
  }
  /* links from other pages: #planner:nea opens your NEA (or starts one), #planner:epq the same for an EPQ */
  function arg(a) {
    var d = data(), ty = a === 'nea' || a === 'epq' ? a : null; if (!ty) return;
    var p = projects(d).filter(function (x) { return x.type === ty; })[0];
    if (p) { setPP('cur', p.id); scrollKeep = null; }
    else setTimeout(function () { if (!$('.modal-back')) projDlg(null, ty); }, 120);
  }
  return { calItems: calItems, upcoming: upcoming, open: open, moveTo: moveTo, arg: arg, aiOn: function () { return pp().ai; }, setAi: function (on) { setPP('ai', !!on); }, parsePlan: parsePlan };
};
