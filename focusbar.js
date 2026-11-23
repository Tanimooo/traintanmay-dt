/* TrainTanmay Focus: the session clock every app shares, and the floating timer that follows you round.
   A session started on the Focus page (focus/) keeps running as you move between apps, tabs and pages.
   The floating timer is light blue glass: drag it anywhere, pause, stop, add time, tick off tasks, shrink it to
   a pill or hide it. Where the browser allows it (Chrome and Edge on a computer) it can pop out into its own
   always-on-top window, so it stays with you when you leave the browser to study on paper.
   Focus time counts towards your study league (league.js); breaks do not.
   Storage (device only): tt-focus-run (the running session), tt-focus-pos, tt-focus-beat.
   Storage (synced by save.js): tt-focus-todos, tt-focus-log and the Focus page's own keys. */
(function () {
  if (window.ttFocus || window.top !== window) return;
  /* real-world time (ttclock.js), falling back to the device clock until it loads */
  var T0 = Date.now();
  function NOW() { return window.ttClock ? window.ttClock.now() : Date.now(); }
  function clockOK() { return window.ttClock ? window.ttClock.ready : Date.now() - T0 > 6000; }

  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/focusbar\.js.*$/, '');
  var K_RUN = 'tt-focus-run', K_POS = 'tt-focus-pos', K_BEAT = 'tt-focus-beat', K_TODO = 'tt-focus-todos', K_LOG = 'tt-focus-log';
  var ONPAGE = /\/focus\/(index\.html)?$/.test(location.pathname);

  function ls() { try { var s = window.localStorage; s.getItem('x'); return s; } catch (e) { return null; } }
  function get(k) { var s = ls(); try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function put(k, v) { var s = ls(); try { if (s) { if (v == null) s.removeItem(k); else s.setItem(k, v); } } catch (e) {} }
  function getJ(k, d) { try { var v = JSON.parse(get(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function putJ(k, v) { put(k, v == null ? null : JSON.stringify(v)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function uid() { return NOW().toString(36) + Math.random().toString(36).slice(2, 7); }
  var TAB = uid();
  function emit() { try { window.dispatchEvent(new CustomEvent('tt-focus')); } catch (e) {} }

  /* ---- the session ----
     run = { id, t0, seg: [{k:'w'|'b', d:ms}], paused: ms, pausedAt, label, subj, goal, todo, credited: s, ended, lastSeg } */
  function run() { var r = getJ(K_RUN, null); return r && r.t0 && r.seg ? r : null; }
  function upd(fn) { var r = run(); if (!r) return null; var o = fn(r) || r; putJ(K_RUN, o); emit(); return o; }
  function plan(r) { return r.seg.reduce(function (t, s) { return t + s.d; }, 0); }
  function elapsed(r, now) { return Math.max(0, Math.min(plan(r), ((r.pausedAt || now || NOW()) - r.t0 - (r.paused || 0)))); }
  function studiedMs(r, el) { var t = 0, a = 0; r.seg.forEach(function (s) { if (s.k === 'w') t += Math.max(0, Math.min(s.d, el - a)); a += s.d; }); return t; }
  function phase(r, now) {
    var el = elapsed(r, now), a = 0, works = r.seg.filter(function (s) { return s.k === 'w'; }).length, wi = 0;
    for (var i = 0; i < r.seg.length; i++) {
      var s = r.seg[i]; if (s.k === 'w') wi++;
      if (el < a + s.d) return { k: s.k, i: i, n: wi, of: works, left: a + s.d - el, segLeft: a + s.d - el, total: plan(r) - el, el: el, d: s.d };
      a += s.d;
    }
    return { k: 'done', i: r.seg.length, n: works, of: works, left: 0, total: 0, el: el, d: 0 };
  }
  function counting() { var r = run(); if (!r || r.pausedAt) return false; return phase(r).k === 'w'; }

  function start(o) {
    o = o || {};
    var seg = [];
    if (o.pomo) {
      var n = Math.max(1, Math.min(12, o.pomo.n | 0)), w = o.pomo.w * 60000, b = o.pomo.b * 60000, L = (o.pomo.l || o.pomo.b) * 60000;
      for (var i = 0; i < n; i++) { seg.push({ k: 'w', d: w }); if (i < n - 1) seg.push({ k: 'b', d: (i + 1) % 4 === 0 ? L : b }); }
    } else seg.push({ k: 'w', d: Math.max(1, Math.min(240, o.min || 25)) * 60000 });
    var old = run(); if (old) stop(true);
    var r = { id: uid(), t0: NOW(), seg: seg, paused: 0, pausedAt: null, label: (o.label || '').slice(0, 80), subj: o.subj || '', goal: (o.goal || '').slice(0, 300), todo: o.todo || null, credited: 0, ended: null, lastSeg: 0, pomo: !!o.pomo };
    putJ(K_RUN, r); unlockAudio(); askNotify(); hidden = false; mini = 'mini' in getJ(K_POS, {}) ? mini : phone(); savePos();
    emit(); paint(true);
    return r;
  }
  function pause() { upd(function (r) { if (!r.pausedAt && phase(r).k !== 'done') r.pausedAt = NOW(); }); paint(); }
  function resume() { upd(function (r) { if (r.pausedAt) { r.paused += NOW() - r.pausedAt; r.pausedAt = null; } }); paint(); }
  function toggle() { var r = run(); if (!r) return; if (r.pausedAt) resume(); else pause(); }
  function extend(min) {
    upd(function (r) {
      var now = NOW(), wasDone = phase(r, now).k === 'done';
      if (wasDone && !r.pausedAt) { r.pausedAt = null; r.paused = (now - r.t0) - plan(r); } // carry on from the end, not from when it ended
      r.seg.push({ k: 'w', d: min * 60000 }); r.ended = null;
      if (wasDone) r.lastSeg = r.seg.length - 1;
    });
    paint(true);
  }
  function credit(r, force) {
    var st = Math.floor(studiedMs(r, elapsed(r)) / 1000), d = st - (r.credited || 0);
    if (d > 0 && (force || d >= 5) && window.ttLeague && window.ttLeague.addFocus) { window.ttLeague.addFocus(d); r.credited = st; return true; }
    return false;
  }
  /* finish: log it (if any real time was spent) and clear the clock. Returns the log entry. */
  function stop(quiet) {
    var r = run(); if (!r) return null;
    var now = NOW();
    if (r.pausedAt) { r.paused += now - r.pausedAt; r.pausedAt = null; }
    credit(r, true);
    var el = elapsed(r, now), st = Math.round(studiedMs(r, el) / 1000), entry = null;
    if (st >= 60) {
      entry = { id: r.id, kind: 'session', t: r.t0, end: now, studied: st, plan: Math.round(plan(r) / 1000), label: r.label, subj: r.subj, goal: r.goal, todo: r.todo, result: null, note: '' };
      var log = getJ(K_LOG, {}); log[r.id] = entry; putJ(K_LOG, log);
    }
    put(K_RUN, null); closePip();
    if (!quiet) { emit(); paint(); }
    return entry;
  }

  /* ---- todos, shared by every app ---- */
  function todos() { var d = getJ(K_TODO, {}); d.lists = d.lists || {}; d.items = d.items || {}; if (!d.lists.inbox) d.lists.inbox = { id: 'inbox', name: 'Inbox', color: '#5aa9e6', order: 0 }; return d; }
  function saveTodos(d) { putJ(K_TODO, d); emit(); }
  function addTodo(text, extra) {
    text = String(text || '').trim().slice(0, 200); if (!text) return null;
    var d = todos(), id = uid(), it = Object.assign({ id: id, list: 'inbox', text: text, done: false, due: null, pri: 0, subj: '', t: NOW() }, extra || {});
    d.items[id] = it; saveTodos(d); return it;
  }
  function setTodo(id, ch) { var d = todos(); if (!d.items[id]) return; Object.keys(ch).forEach(function (k) { if (ch[k] === undefined) delete d.items[id][k]; else d.items[id][k] = ch[k]; }); if ('done' in ch) d.items[id].doneAt = ch.done ? NOW() : null; saveTodos(d); }
  function todayISO() { var d = new Date(NOW()); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  /* the few tasks worth showing in a small space: the session's own task, then overdue, today, soonest, newest */
  function topTodos(n) {
    var d = todos(), t = todayISO(), r = run(), all = Object.keys(d.items).map(function (k) { return d.items[k]; }).filter(function (x) { return !x.done || (x.doneAt && NOW() - x.doneAt < 6e4); });
    function rank(x) { if (r && r.todo === x.id) return -1e15; if (x.due && x.due <= t) return -1e14 + Date.parse(x.due); if (x.due) return -1e13 + Date.parse(x.due); return -x.t - (x.pri || 0) * 1e12; }
    return all.sort(function (a, b) { return rank(a) - rank(b); }).slice(0, n || 6);
  }

  /* ---- sound and notifications ---- */
  var actx = null;
  function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {} }
  function chime(kind) {
    try {
      if (!actx) return; var t = actx.currentTime, notes = kind === 'b' ? [784, 659] : kind === 'done' ? [523, 659, 784, 1047] : [659, 880];
      notes.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t + i * 0.16); g.gain.linearRampToValueAtTime(0.22, t + i * 0.16 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.16 + 1.1);
        o.connect(g); g.connect(actx.destination); o.start(t + i * 0.16); o.stop(t + i * 0.16 + 1.2);
      });
    } catch (e) {}
  }
  function askNotify() { try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {} }
  function notify(title, body) {
    try { if ('Notification' in window && Notification.permission === 'granted' && (document.hidden || pip)) new Notification(title, { body: body, icon: BASE + 'icons/icon-192.png', tag: 'tt-focus', silent: false }); } catch (e) {}
  }

  /* ---- the clock tick: one tab leads (credits the league, chimes, notifies); every tab paints ---- */
  function leader() {
    var now = NOW(), b = (get(K_BEAT) || '').split(':');
    if (b[1] && b[1] !== TAB && now - (+b[0] || 0) < 2500) return false; // hidden tabs tick slowly, so a visible one soon takes over
    put(K_BEAT, now + ':' + TAB); return true;
  }
  function tick() {
    var r = run();
    if (r && clockOK() && leader()) { // credit and chime only on checked, real time
      var ph = phase(r), changed = false;
      if (ph.i !== (r.lastSeg || 0)) {
        r.lastSeg = ph.i; changed = true;
        if (ph.k === 'b') { chime('b'); notify('Break time', 'Nice work. Stand up, stretch, look away from the screen.'); }
        else if (ph.k === 'w') { chime('w'); notify('Back to it', 'Focus block ' + ph.n + ' of ' + ph.of + (r.label ? ': ' + r.label : '') + '.'); }
        else if (ph.k === 'done') { r.ended = NOW(); chime('done'); notify('Session complete', 'You focused for ' + fmtMin(studiedMs(r, ph.el)) + '. Log how it went on the Focus page.'); }
      }
      if (credit(r) || changed) { var cur = run(); if (cur && cur.id === r.id) { cur.credited = r.credited; cur.lastSeg = r.lastSeg; cur.ended = r.ended; putJ(K_RUN, cur); if (changed) emit(); } }
    }
    paint();
  }

  /* ---- formatting ---- */
  function clock(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; s %= 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); }
  function fmtMin(ms) { var m = Math.round(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h ' + (m % 60 ? m % 60 + 'm' : ''); }

  /* ---- the floating timer ---- */
  var CSS =
    '.ttf{position:fixed;z-index:9990;width:268px;color:#0b2a45;font:14px/1.3 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '.ttf .g{position:relative;border-radius:22px;padding:12px 14px 13px;background:linear-gradient(150deg,rgba(214,238,255,.72),rgba(160,212,250,.5));-webkit-backdrop-filter:blur(20px) saturate(1.7);backdrop-filter:blur(20px) saturate(1.7);' +
    'border:1px solid rgba(255,255,255,.7);box-shadow:0 22px 50px -18px rgba(20,70,120,.55),0 2px 8px rgba(20,70,120,.15),inset 0 1px 0 rgba(255,255,255,.8);cursor:grab;overflow:hidden}' +
    '.ttf.drag .g{cursor:grabbing}.ttf .g::before{content:"";position:absolute;inset:-40% -20% auto auto;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.55),transparent 70%);pointer-events:none}' +
    '.ttf.in{animation:ttfIn .65s cubic-bezier(.2,.9,.25,1.25) both}@keyframes ttfIn{0%{opacity:0;transform:translate(120px,60px) rotate(8deg) scale(.7)}60%{opacity:1}100%{transform:none}}' +
    '.ttf .top{display:flex;align-items:center;gap:6px;margin-bottom:2px}.ttf .lb{flex:1;min-width:0;font-weight:600;font-size:12.5px;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#164a74}' +
    '.ttf .dot{width:8px;height:8px;border-radius:50%;background:#1d8fe0;box-shadow:0 0 0 0 rgba(29,143,224,.6);animation:ttfP 2s infinite;flex:none}.ttf.brk .dot{background:#22b07d;box-shadow:0 0 0 0 rgba(34,176,125,.6)}.ttf.pz .dot{animation:none;background:#9bb3c7}' +
    '@keyframes ttfP{70%{box-shadow:0 0 0 7px rgba(29,143,224,0)}100%{box-shadow:0 0 0 0 rgba(29,143,224,0)}}' +
    '.ttf button{font:inherit;color:inherit;border:0;background:rgba(255,255,255,.45);border-radius:10px;cursor:pointer;display:inline-grid;place-items:center;transition:background .15s,transform .15s}' +
    '.ttf button:hover{background:rgba(255,255,255,.8)}.ttf button:active{transform:scale(.94)}.ttf button:focus-visible{outline:2px solid #0b5fa5;outline-offset:2px}' +
    '.ttf .ic{width:28px;height:28px}.ttf .ic svg{width:16px;height:16px}' +
    '.ttf .tm{font:700 44px/1.05 "Bricolage Grotesque","IBM Plex Sans",system-ui,sans-serif;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin:4px 0 2px;color:#06233d}' +
    '.ttf .nm{font-weight:600;font-size:13px;color:#164a74;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:-2px 0 4px}' +
    '.ttf .sub{font-size:12px;color:#33617f;display:flex;justify-content:space-between;gap:8px}' +
    '.ttf .bar{height:5px;border-radius:5px;background:rgba(11,42,69,.12);margin:9px 0 11px;overflow:hidden}.ttf .bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#3aa0f0,#6fd0ff);transition:width 1s linear}.ttf.brk .bar i{background:linear-gradient(90deg,#22b07d,#7fe3b9)}' +
    '.ttf .ctl{display:flex;gap:7px}.ttf .ctl button{height:38px;flex:1;font-weight:600;font-size:13px;gap:6px;display:inline-flex;align-items:center;justify-content:center}.ttf .ctl button svg{width:16px;height:16px}' +
    '.ttf .ctl .pr{background:#0b2a45;color:#e8f5ff;flex:1.6}.ttf .ctl .pr:hover{background:#12406a}' +
    '.ttf .tk{margin-top:10px;border-top:1px solid rgba(11,42,69,.12);padding-top:8px;max-height:230px;overflow:auto;touch-action:pan-y}' +
    '.ttf .tk label{display:flex;gap:8px;align-items:flex-start;padding:5px 4px;border-radius:8px;cursor:pointer;font-size:13px}.ttf .tk label:hover{background:rgba(255,255,255,.4)}' +
    '.ttf .tk input[type=checkbox]{margin:2px 0 0;width:16px;height:16px;accent-color:#0b5fa5;flex:none}.ttf .tk .dn{text-decoration:line-through;opacity:.55}.ttf .tk .due{font-size:11px;color:#a23b2a;margin-left:auto;white-space:nowrap}' +
    '.ttf .tk form{display:flex;gap:6px;margin-top:6px}.ttf .tk input[type=text]{flex:1;min-width:0;font:inherit;font-size:13px;padding:7px 9px;border-radius:9px;border:1px solid rgba(11,42,69,.18);background:rgba(255,255,255,.65);color:#0b2a45;outline:none;user-select:text}' +
    '.ttf .tk .none{font-size:12.5px;color:#33617f;padding:4px}.ttf a{color:#0b5fa5;font-weight:600;text-decoration:none}' +
    '.ttf .tip{margin-top:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.55);font-size:12px;line-height:1.35;display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center}.ttf .tip>span:first-child{flex:1 1 150px}.ttf .tip .tb{display:flex;gap:5px}.ttf .tip .tb button[data-a=install]{padding:5px 10px;font-weight:700;background:#0b2a45;color:#e8f5ff}.ttf .tip small{flex-basis:100%;color:#33617f}' +
    '.ttf .done{font-size:13px;color:#164a74;margin:2px 0 10px}' +
    /* the shrunk pill */
    '.ttf.mini{width:auto}.ttf.mini .g{padding:7px 8px 7px 12px;border-radius:999px;display:flex;align-items:center;gap:8px}.ttf.mini .g::before{display:none}' +
    '.ttf.mini .tm{font-size:17px;margin:0}.ttf.mini .ic{width:26px;height:26px;border-radius:999px}' +
    '@media (max-width:600px){.ttf{width:min(268px,calc(100vw - 24px))}.ttf .tk input[type=text]{font-size:16px}}' +
    '@media (prefers-reduced-motion:reduce){.ttf.in{animation:none}.ttf .dot{animation:none}.ttf .bar i{transition:none}}' +
    '@media print{.ttf{display:none!important}}';
  var I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.2" height="14" rx="1.3"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.3"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>',
    min: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 12h12"/></svg>',
    max: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l2 2 3-3.5M4 15l2 2 3-3.5M12 8h8M12 16h8"/></svg>',
    pop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><rect x="12" y="11" width="7" height="6" rx="1.2" fill="currentColor"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.3 1.6M9.5 2.5h5"/></svg>'
  };
  var el = null, hidden = false, mini = false, showTasks = false, inlineVisible = false, pip = null, wasIn = false;
  // on phones the timer starts as a small pill (tap the arrows to open it), unless you've chosen otherwise
  function phone() { try { return matchMedia('(max-width: 600px)').matches; } catch (e) { return false; } }
  (function () { var p = getJ(K_POS, {}); hidden = !!p.hidden; mini = 'mini' in p ? !!p.mini : phone(); showTasks = !!p.tasks; })();
  function savePos() { var p = getJ(K_POS, {}); p.hidden = hidden; p.mini = mini; p.tasks = showTasks; putJ(K_POS, p); }
  function host() { return document.fullscreenElement || document.body; }
  function ensureCss(doc) { if (doc.getElementById('ttf-css')) return; var s = doc.createElement('style'); s.id = 'ttf-css'; s.textContent = CSS; (doc.head || doc.documentElement).appendChild(s); }

  function html(r) {
    var now = NOW(), ph = phase(r, now), pz = !!r.pausedAt, done = ph.k === 'done';
    var studied = studiedMs(r, ph.el), segPct = done ? 100 : Math.min(100, 100 * (1 - ph.segLeft / ph.d));
    var lbl = done ? 'Done' : pz ? 'Paused' : (ph.k === 'b' ? 'Break' : 'Focus') + (r.pomo ? ' ' + ph.n + '/' + ph.of : '');
    var big = done ? clock(studied) : clock(ph.segLeft);
    if (mini && !pip) {
      return '<div class="g" title="Drag to move"><span class="dot"></span><span class="tm" data-d="tm">' + big + '</span>' +
        '<button type="button" class="ic" data-a="toggle" aria-label="' + (pz ? 'Resume' : 'Pause') + '">' + (done ? I.stop : pz ? I.play : I.pause) + '</button>' +
        '<button type="button" class="ic" data-a="max" aria-label="Show the full timer">' + I.max + '</button></div>';
    }
    var h = '<div class="g"><div class="top"><span class="dot"></span><span class="lb" title="' + esc(lbl) + '">' + esc(lbl) + '</span>' +
      '<button type="button" class="ic" data-a="tasks" aria-label="Tasks" aria-pressed="' + showTasks + '" title="Tasks">' + I.list + '</button>' +
      (!pip && window.documentPictureInPicture ? '<button type="button" class="ic" data-a="pip" aria-label="Pop out: keep the timer on top of every window" title="Pop out: stays on top of every window">' + I.pop + '</button>' : '') +
      (!ONPAGE ? '<a class="ic" style="display:inline-grid;place-items:center;width:28px;height:28px;border-radius:10px;background:rgba(255,255,255,.45)" href="' + BASE + 'focus/" ' + (pip ? 'target="_blank" ' : '') + 'aria-label="Open the Focus page" title="Open the Focus page">' + I.open + '</a>' : '') +
      (!pip ? '<button type="button" class="ic" data-a="min" aria-label="Shrink" title="Shrink">' + I.min + '</button><button type="button" class="ic" data-a="hide" aria-label="Hide the timer" title="Hide (it keeps running; show it again from the Focus page)">' + I.x + '</button>' : '') +
      '</div><div class="tm" data-d="tm" role="timer" aria-live="off">' + big + '</div>' +
      (r.label && !done ? '<div class="nm" title="' + esc(r.label) + '">' + esc(r.label) + '</div>' : '');
    if (done) h += '<div class="done">Nice work — ' + fmtMin(studied) + ' of focus.' + (r.goal ? '<br>Goal: <b>' + esc(r.goal) + '</b>' : '') + '</div>' +
      '<div class="ctl"><button type="button" data-a="ext10">' + I.plus + '10 min</button><button type="button" class="pr" data-a="finish">Finish &amp; log</button></div>';
    else h += '<div class="sub"><span data-d="s1">' + sub1(ph, studied) + '</span><span data-d="s2">' + clock(ph.total) + ' left</span></div>' +
      '<div class="bar"><i data-d="bar" style="width:' + segPct.toFixed(2) + '%"></i></div>' +
      '<div class="ctl"><button type="button" class="pr" data-a="toggle">' + (pz ? I.play + 'Resume' : I.pause + 'Pause') + '</button><button type="button" data-a="ext5" aria-label="Add 5 minutes">' + I.plus + '5</button><button type="button" data-a="stop" aria-label="Stop the session">' + I.stop + 'Stop</button></div>';
    if (pip && showTip()) h += '<div class="tip"><span>Install TrainTanmay as an app, so this timer isn\u2019t tied to a browser tab.</span><span class="tb">' + (installEv ? '<button type="button" data-a="install">Install</button>' : '') + '<button type="button" class="ic" data-a="tipx" aria-label="Hide this tip">' + I.x + '</button></span>' + (installEv ? '' : '<small>' + HOWTO + '</small>') + '</div>';
    if (showTasks) {
      var list = topTodos(6);
      h += '<div class="tk">' + (list.length ? list.map(function (t) {
        var od = t.due && t.due < todayISO();
        return '<label><input type="checkbox" data-t="' + esc(t.id) + '"' + (t.done ? ' checked' : '') + '><span class="' + (t.done ? 'dn' : '') + '">' + esc(t.text) + '</span>' + (t.due ? '<span class="due"' + (od ? '' : ' style="color:#33617f"') + '>' + (od ? 'overdue' : t.due === todayISO() ? 'today' : t.due.slice(5).split('-').reverse().join('/')) + '</span>' : '') + '</label>';
      }).join('') : '<div class="none">Nothing to do yet. Add a task:</div>') +
        '<form data-f="add"><input type="text" name="t" placeholder="Add a task…" aria-label="New task" maxlength="200"><button type="submit" class="ic" aria-label="Add">' + I.plus + '</button></form></div>';
    }
    return h + '</div>';
  }
  function sub1(ph, studied) { return ph.k === 'b' ? 'back to it in ' + clock(ph.segLeft) : fmtMin(studied) + ' focused'; }
  /* what decides the timer's layout; while it stays the same only the numbers change, so buttons are never swapped mid-click */
  function shape(r) { var ph = phase(r); return [mini && !pip, !!pip, !!r.pausedAt, ph.k, ph.n, r.label, r.goal, showTasks, showTasks ? get(K_TODO) : '', ONPAGE, pip && showTip(), !!installEv].join('|'); }
  function numbers(root, r) {
    var ph = phase(r), studied = studiedMs(r, ph.el), q = function (k) { return root.querySelector('[data-d="' + k + '"]'); };
    var t = q('tm'); if (t) t.textContent = ph.k === 'done' ? clock(studied) : clock(ph.segLeft);
    var a = q('s1'); if (a) a.textContent = sub1(ph, studied);
    var b = q('s2'); if (b) b.textContent = clock(ph.total) + ' left';
    var c = q('bar'); if (c) c.style.width = (ph.k === 'done' ? 100 : Math.min(100, 100 * (1 - ph.segLeft / ph.d))).toFixed(2) + '%';
  }
  function wire(root, doc) {
    root.onclick = function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a'), r = run(); unlockAudio();
      if (a === 'toggle') { var ph = r && phase(r); if (ph && ph.k === 'done') finish(); else toggle(); }
      else if (a === 'stop') { if (confirm('Stop this session? Your focus time so far is kept.')) finish(); }
      else if (a === 'finish') finish();
      else if (a === 'ext5') extend(5);
      else if (a === 'ext10') extend(10);
      else if (a === 'min') { mini = true; savePos(); paint(true); }
      else if (a === 'max') { mini = false; savePos(); paint(true); }
      else if (a === 'hide') { hidden = true; savePos(); paint(); }
      else if (a === 'tasks') { showTasks = !showTasks; savePos(); paint(true); }
      else if (a === 'pip') openPip();
      else if (a === 'tipx') hideTip();
      else if (a === 'install') install().then(function (shown) { if (!shown) { var t = root.querySelector('.tip small'); if (!t) { t = doc.createElement('small'); root.querySelector('.tip').appendChild(t); } t.textContent = HOWTO; } });
    };
    root.onchange = function (e) { var c = e.target; if (c.matches && c.matches('input[data-t]')) setTodo(c.getAttribute('data-t'), { done: c.checked }); };
    root.onsubmit = function (e) { e.preventDefault(); var i = e.target.querySelector('input[name=t]'); if (i && addTodo(i.value)) { i.value = ''; paint(true); var j = (pip ? pip.document : doc).querySelector('.ttf input[name=t]'); if (j) j.focus(); } };
  }
  /* finishing from anywhere: off the Focus page, go there so you can log how it went */
  function finish() {
    var entry = stop();
    if (entry && ONPAGE) { try { window.dispatchEvent(new CustomEvent('tt-focus-finished', { detail: entry.id })); } catch (e) {} }
    else if (entry) { try { sessionStorage.setItem('tt-focus-reflect', entry.id); } catch (e) {} if (!pip) location.href = BASE + 'focus/#reflect'; }
  }

  var lastHtml = '';
  function paint(force) {
    var r = run();
    if (pip) {
      if (!r) { closePip(); }
      else { var pr = pip.document.getElementById('ttf-pip'); if (pr) { var k2 = shape(r); if (force || k2 !== pr.getAttribute('data-k')) { var keep = keepInput(pip.document); pr.innerHTML = html(r); pr.setAttribute('data-k', k2); restoreInput(pip.document, keep); } else numbers(pr, r); pr.classList.toggle('brk', phase(r).k === 'b'); pr.classList.toggle('pz', !!r.pausedAt); } }
    }
    var want = r && !hidden && !pip && !(ONPAGE && inlineVisible) && document.body;
    if (!want) { if (el) { el.remove(); el = null; } wasIn = false; return; }
    if (!el) {
      ensureCss(document);
      el = document.createElement('div'); el.className = 'ttf'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Focus timer');
      wire(el, document); drag(el);
      if (!wasIn) { el.classList.add('in'); wasIn = true; setTimeout(function () { if (el) el.classList.remove('in'); }, 700); }
      lastHtml = '';
    }
    if (el.parentNode !== host()) host().appendChild(el);
    var ph = phase(r);
    el.classList.toggle('brk', ph.k === 'b'); el.classList.toggle('pz', !!r.pausedAt); el.classList.toggle('mini', mini);
    var k = shape(r);
    if (force || k !== lastHtml) {
      // keep a half-typed task while the timer redraws
      var keep = keepInput(document); el.innerHTML = html(r); lastHtml = k; restoreInput(document, keep);
    } else numbers(el, r);
    place(el);
  }
  function keepInput(doc) { var i = doc.querySelector('.ttf input[name=t]'); return i ? { v: i.value, f: doc.activeElement === i, s: i.selectionStart } : null; }
  function restoreInput(doc, k) { if (!k) return; var i = doc.querySelector('.ttf input[name=t]'); if (!i) return; i.value = k.v; if (k.f) { i.focus(); try { i.setSelectionRange(k.s, k.s); } catch (e) {} } }

  /* position: kept as a fraction of the window, so it stays put through resizes and on every page */
  /* the lowest the timer may sit: above a tab bar fixed along the bottom (the Focus page on phones has one) */
  function floor() {
    var H = window.innerHeight, nav = document.querySelector('.tabs');
    if (nav && getComputedStyle(nav).position === 'fixed') { var t = nav.getBoundingClientRect().top; if (t > H / 2) return t - 8; }
    return H - 8;
  }
  function place(n) {
    var p = getJ(K_POS, {}), w = n.offsetWidth || 268, h = n.offsetHeight || 150, W = window.innerWidth, F0 = floor();
    var x = typeof p.x === 'number' ? p.x * W : W - w - 20, y = typeof p.y === 'number' ? p.y * window.innerHeight : F0 - h - 16;
    n.style.left = Math.max(8, Math.min(W - w - 8, x)) + 'px'; n.style.top = Math.max(8, Math.min(F0 - h, y)) + 'px';
  }
  function drag(n) {
    var sx, sy, ox, oy, moved = false, id = null;
    n.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('button,a,input,label,form')) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; ox = n.offsetLeft; oy = n.offsetTop; moved = false;
      try { n.setPointerCapture(id); } catch (x) {}
    });
    n.addEventListener('pointermove', function (e) {
      if (id !== e.pointerId) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      moved = true; n.classList.add('drag');
      var W = window.innerWidth, H = window.innerHeight;
      n.style.left = Math.max(8, Math.min(W - n.offsetWidth - 8, ox + dx)) + 'px'; n.style.top = Math.max(8, Math.min(floor() - n.offsetHeight, oy + dy)) + 'px';
    });
    function up(e) {
      if (id !== e.pointerId) return; id = null; n.classList.remove('drag');
      if (moved) { var p = getJ(K_POS, {}); p.x = n.offsetLeft / window.innerWidth; p.y = n.offsetTop / window.innerHeight; putJ(K_POS, p); }
    }
    n.addEventListener('pointerup', up); n.addEventListener('pointercancel', up);
  }

  /* ---- installing the site as an app: then the pop-out timer isn't tied to a browser tab ---- */
  var installEv = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEv = e; });
  window.addEventListener('appinstalled', function () { installEv = null; paint(true); });
  function installed() { try { return matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: window-controls-overlay)').matches || navigator.standalone === true; } catch (e) { return false; } }
  function tipOff() { return !!getJ(K_POS, {}).tipOff; }
  function hideTip() { var p = getJ(K_POS, {}); p.tipOff = true; putJ(K_POS, p); paint(true); emit(); }
  function showTip() { return !installed() && !tipOff(); }
  /* returns a promise: true if the browser's install prompt was shown */
  function install() {
    if (!installEv) return Promise.resolve(false);
    var ev = installEv;
    try { return Promise.resolve(ev.prompt()).then(function () { return ev.userChoice; }).then(function (c) { if (c && c.outcome === 'accepted') { installEv = null; hideTip(); } return true; }, function () { return false; }); }
    catch (e) { return Promise.resolve(false); }
  }
  var HOWTO = 'To install: click the install icon at the right of the address bar, or open the browser menu and choose Install TrainTanmay.';

  /* ---- pop out: an always-on-top window (Document Picture-in-Picture, Chrome and Edge on computers) ---- */
  function openPip() {
    if (!window.documentPictureInPicture || pip) return;
    var wasMini = mini; mini = false;
    documentPictureInPicture.requestWindow({ width: 300, height: (showTasks ? 420 : 210) + (showTip() ? 84 : 0) }).then(function (w) {
      pip = w; var d = w.document;
      d.title = 'Focus timer';
      ensureCss(d);
      var st = d.createElement('style'); st.textContent = 'html,body{margin:0;height:100%;background:#cfe9fb}body{display:block}.ttf{position:static;width:auto;touch-action:auto}.ttf .g{border-radius:0;min-height:100vh;box-sizing:border-box;cursor:default;border:0;box-shadow:none;background:linear-gradient(150deg,#e2f2ff,#a9d6f7)}';
      d.head.appendChild(st);
      var wrap = d.createElement('div'); wrap.className = 'ttf'; wrap.id = 'ttf-pip'; d.body.appendChild(wrap); wire(wrap, d);
      w.addEventListener('pagehide', function () { pip = null; mini = wasMini; paint(true); });
      paint(true);
    }).catch(function () { mini = wasMini; });
  }
  function closePip() { if (pip) { try { pip.close(); } catch (e) {} pip = null; } }

  /* ---- keep every tab in step ---- */
  window.addEventListener('storage', function (e) {
    if (e.key === K_RUN || e.key === K_TODO) { if (e.key === K_RUN && e.newValue && !e.oldValue) { hidden = false; mini = getJ(K_POS, {}).mini; } paint(true); emit(); }
    if (e.key === K_POS) { var p = getJ(K_POS, {}); hidden = !!p.hidden; mini = !!p.mini; showTasks = !!p.tasks; paint(true); }
  });
  window.addEventListener('resize', function () { if (el) place(el); });
  document.addEventListener('fullscreenchange', function () { paint(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
  setInterval(tick, 1000);
  if (document.body) tick(); else document.addEventListener('DOMContentLoaded', tick);

  window.ttFocus = {
    run: run, start: start, pause: pause, resume: resume, toggle: toggle, stop: stop, finish: finish, extend: extend,
    phase: phase, elapsed: elapsed, studiedMs: studiedMs, plan: plan, counting: counting, clock: clock,
    show: function () { hidden = false; mini = false; savePos(); paint(true); },
    isHidden: function () { return hidden; },
    setInline: function (v) { inlineVisible = !!v; paint(); },
    popOut: openPip, canPopOut: function () { return !!window.documentPictureInPicture; },
    installed: installed, canInstall: function () { return !!installEv; }, install: install, showInstallTip: showTip, hideInstallTip: hideTip, installHowTo: HOWTO,
    todos: todos, saveTodos: saveTodos, addTodo: addTodo, setTodo: setTodo, topTodos: topTodos,
    chime: chime, unlockAudio: unlockAudio, uid: uid, today: todayISO, base: BASE
  };
})();
