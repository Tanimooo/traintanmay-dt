/* TrainTanmay Focus page: timer, tasks, calendar, goals, notes and progress.
   The session clock and the floating timer live in ../focusbar.js (window.ttFocus), shared by every app.
   Everything here is kept in localStorage under tt-focus-* and synced between devices by save.js:
     tt-focus-todos  { lists: {id: list}, items: {id: task} }          (shared with the floating timer)
     tt-focus-cal    { events: {id: event} }
     tt-focus-goals  { weekly: minutes, items: {id: goal with steps: {id: step}} }
     tt-focus-notes  { items: {id: note} }
     tt-focus-log    { id: session or development }
     tt-focus-prefs  timer and sound choices, theme
   Objects are keyed by id (never arrays) so a change on one device merges cleanly with a change on another. */
(function () {
  'use strict';
  var F = window.ttFocus;
  if (!F) return;
  var K = { cal: 'tt-focus-cal', goals: 'tt-focus-goals', notes: 'tt-focus-notes', log: 'tt-focus-log', prefs: 'tt-focus-prefs' };

  /* ---------- small helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function getJ(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function putJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Could not save — storage is full or blocked.'); } }
  function vals(o) { return Object.keys(o || {}).map(function (k) { return o[k]; }); }
  var uid = F.uid;
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today() { return iso(new Date()); }
  function addDays(s, n) { var d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); }
  function monday(s) { var d = parseISO(s), wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return iso(d); }
  function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 864e5); }
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  function niceDate(s, long) { var d = parseISO(s); return (long ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()] + ' ' : DOW[(d.getDay() + 6) % 7] + ' ') + d.getDate() + ' ' + MON[d.getMonth()].slice(0, long ? 99 : 3); }
  function rel(s) {
    var n = daysBetween(today(), s);
    if (n === 0) return 'Today'; if (n === 1) return 'Tomorrow'; if (n === -1) return 'Yesterday';
    if (n < 0) return -n + ' days ago'; if (n < 7) return niceDate(s).split(' ')[0]; return niceDate(s);
  }
  function mins(sec) { var m = Math.round(sec / 60); return m < 60 ? m + 'm' : Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + m % 60 + 'm' : ''); }
  function hm(t) { var d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function toMin(t) { if (!t) return null; var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function fromMin(m) { m = Math.max(0, Math.min(1439, Math.round(m))); return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function ic(d, w) { return '<svg viewBox="0 0 24 24" width="' + (w || 18) + '" height="' + (w || 18) + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var IC = {
    play: ic('<path d="M7 5v14l12-7z" fill="currentColor"/>'), pause: ic('<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>'),
    stop: ic('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>'), plus: ic('<path d="M12 5v14M5 12h14"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'), trash: ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/>'), focus: ic('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'),
    left: ic('<path d="M15 5l-7 7 7 7"/>'), right: ic('<path d="M9 5l7 7-7 7"/>'), pop: ic('<rect x="3" y="5" width="18" height="14" rx="2.5"/><rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor"/>'),
    flag: ic('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'), cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    inbox: ic('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/>'), sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    list: ic('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'), check: ic('<path d="M5 12l5 5L20 7"/>'),
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3l6 6-3 1-4 4 1 5-2 2-4-5-5 5-1-1 5-5-5-4 2-2 5 1 4-4z"/></svg>',
    show: ic('<rect x="3" y="4" width="18" height="16" rx="3"/><rect x="11" y="12" width="7" height="5" rx="1.2" fill="currentColor"/>'),
    upcoming: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'), done: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>')
  };

  /* subjects: the apps you picked on the start screen, plus "Other" */
  var ALLSUBJ = [['dt', 'D&T'], ['physics', 'Physics'], ['chemistry', 'Chemistry'], ['maths', 'Maths'], ['esat', 'ESAT']];
  var SUBJ = (function () { var p = getJ('tt-profile', null), ids = p && p.subjects && p.subjects.length ? p.subjects : null; return ALLSUBJ.filter(function (s) { return !ids || ids.indexOf(s[0]) >= 0; }).concat([['other', 'Other']]); })();
  function subjName(id) { var s = ALLSUBJ.concat([['other', 'Other']]).filter(function (x) { return x[0] === id; })[0]; return s ? s[1] : ''; }
  function subjCol(id) { return id ? 'var(--' + (/^(dt|physics|chemistry|maths|esat|other)$/.test(id) ? id : 'other') + ')' : 'var(--acc)'; }
  var COLS = ['#2186d8', '#7a5af5', '#e0457b', '#f08a24', '#e0b100', '#17a273', '#14a3b8', '#6b7a90'];

  /* ---------- data ---------- */
  function prefs() { return Object.assign({ mode: 'timer', min: 45, pomo: { w: 25, b: 5, l: 15, n: 4 }, subj: '', sound: 'off', vol: 0.4, theme: '', calView: 'month', noteTab: 'notes' }, getJ(K.prefs, {})); }
  function setPref(k, v) { var p = getJ(K.prefs, {}); p[k] = v; putJ(K.prefs, p); }
  function cal() { var c = getJ(K.cal, {}); c.events = c.events || {}; return c; }
  function goals() { var g = getJ(K.goals, {}); g.items = g.items || {}; if (typeof g.weekly !== 'number') g.weekly = 600; return g; }
  function notes() { var n = getJ(K.notes, {}); n.items = n.items || {}; return n; }
  function log() { return getJ(K.log, {}); }
  function sessions() { return vals(log()).filter(function (e) { return e.kind === 'session'; }).sort(function (a, b) { return a.t - b.t; }); }
  /* seconds focused per local day, including the session running now */
  function perDay() {
    var m = {};
    sessions().forEach(function (s) { var d = iso(new Date(s.t)); m[d] = (m[d] || 0) + (s.studied || 0); });
    var r = F.run(); if (r) { var d = iso(new Date(r.t0)); m[d] = (m[d] || 0) + Math.round(F.studiedMs(r, F.elapsed(r)) / 1000); }
    return m;
  }
  function weekSec(startISO) { var pd = perDay(), t = 0; for (var i = 0; i < 7; i++) t += pd[addDays(startISO, i)] || 0; return t; }
  function streak() { var pd = perDay(), d = today(), n = 0; if (!(pd[d] >= 600)) d = addDays(d, -1); while (pd[d] >= 600) { n++; d = addDays(d, -1); } return n; }

  /* ---------- toasts, dialogs, confetti ---------- */
  function toast(msg, action, fn) {
    var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button">' + esc(action) + '</button>' : '');
    $('#toasts').appendChild(t);
    if (action) t.querySelector('button').onclick = function () { fn(); t.remove(); };
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 320); }, action ? 6000 : 3200);
  }
  function modal(html, cls, onClose) {
    var last = document.activeElement, back = document.createElement('div'); back.className = 'modal-back';
    back.innerHTML = '<div class="modal ' + (cls || '') + '" role="dialog" aria-modal="true"><button type="button" class="iconbtn x" aria-label="Close">' + IC.x + '</button>' + html + '</div>';
    document.body.appendChild(back);
    var box = back.firstChild;
    function close() { if (!back.parentNode) return; back.remove(); document.removeEventListener('keydown', key, true); if (onClose) onClose(); if (last && last.focus) last.focus(); }
    function key(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      if (e.key === 'Tab') { var f = $$('button,input,select,textarea,a[href],[tabindex="0"]', box).filter(function (x) { return !x.disabled && x.offsetParent; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    }
    document.addEventListener('keydown', key, true);
    back.addEventListener('pointerdown', function (e) { if (e.target === back) close(); });
    box.querySelector('.x').onclick = close;
    setTimeout(function () { var f = box.querySelector('[autofocus]') || box.querySelector('input,textarea,select'); if (f) f.focus(); }, 30);
    return { box: box, close: close };
  }
  function confetti(x, y) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (var i = 0; i < 28; i++) {
      var c = document.createElement('i'); c.className = 'confetti';
      c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.background = COLS[i % COLS.length];
      c.style.setProperty('--dx', (Math.random() * 260 - 130) + 'px'); c.style.setProperty('--dy', (Math.random() * -220 - 40) + 'px'); c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      document.body.appendChild(c); setTimeout(c.remove.bind(c), 1500);
    }
  }
  function subjChips(name, cur, allowNone) {
    return '<div class="chips" role="group" data-chips="' + name + '">' + (allowNone ? '<button type="button" class="chip" data-v="" aria-pressed="' + !cur + '">None</button>' : '') +
      SUBJ.map(function (s) { return '<button type="button" class="chip" data-v="' + s[0] + '" aria-pressed="' + (cur === s[0]) + '" style="--c:' + subjCol(s[0]) + '"><i></i>' + esc(s[1]) + '</button>'; }).join('') + '</div>';
  }
  function wireChips(root, name, fn) {
    var g = root.querySelector('[data-chips="' + name + '"]'); if (!g) return;
    g.onclick = function (e) { var b = e.target.closest('.chip'); if (!b) return; $$('.chip', g).forEach(function (c) { c.setAttribute('aria-pressed', String(c === b)); }); fn(b.getAttribute('data-v')); };
  }
  function chipVal(root, name) { var b = root.querySelector('[data-chips="' + name + '"] .chip[aria-pressed=true]'); return b ? b.getAttribute('data-v') : ''; }

  /* ---------- router ---------- */
  var TABS = ['focus', 'tasks', 'calendar', 'goals', 'notes', 'progress'], cur = null;
  var RENDER = {};
  function route() {
    var h = location.hash.replace('#', ''), reflect = h === 'reflect';
    var t = TABS.indexOf(h) >= 0 ? h : 'focus';
    if (t !== cur) {
      cur = t;
      $$('.view').forEach(function (v) { v.hidden = v.getAttribute('data-view') !== t; });
      $$('.tabs a').forEach(function (a) { if (a.getAttribute('data-tab') === t) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
      document.title = (t === 'focus' ? 'Focus' : t[0].toUpperCase() + t.slice(1)) + ' · TrainTanmay Focus';
    }
    render();
    if (reflect) { history.replaceState(null, '', '#focus'); var id = null; try { id = sessionStorage.getItem('tt-focus-reflect'); sessionStorage.removeItem('tt-focus-reflect'); } catch (e) {} if (id) reflectDlg(id); }
  }
  function render() { var v = $('#v-' + cur); if (v && RENDER[cur]) RENDER[cur](v); if (cur !== 'focus') F.setInline(false); }
  /* other tabs and devices change things: redraw, but never under someone's typing */
  var pendingRender = false;
  function soft() {
    var a = document.activeElement;
    if (a && a.closest && a.closest('main') && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || (a && a.isContentEditable) || $('.modal-back') || dragging) { pendingRender = true; return; }
    pendingRender = false; render();
  }
  document.addEventListener('focusout', function () { if (pendingRender) setTimeout(soft, 50); });
  window.addEventListener('hashchange', route);
  var lastRunId = (F.run() || {}).id || null;
  window.addEventListener('tt-focus', function () {
    var r = F.run(), id = r ? r.id : null;
    if (id !== lastRunId) { lastRunId = id; if (!id) sound.stop(); if (cur === 'focus') render(); else soft(); }
    else soft();
  });
  window.addEventListener('tt-focus-finished', function (e) { if (e.detail) setTimeout(function () { reflectDlg(e.detail); }, 50); });
  window.addEventListener('storage', function (e) { if (e.key && /^tt-focus-(cal|goals|notes|log|prefs)$/.test(e.key)) soft(); });

  /* ======================================================================
     FOCUS
     ====================================================================== */
  var QUOTES = ['One question at a time.', 'Slow is smooth, and smooth is fast.', 'You do not have to feel like it. You just have to start.', 'Deep work now, free time later.', 'Small steps, every day.', 'Phone away. You have got this.', 'Future you says thanks.'];
  var parked = [];
  RENDER.focus = function (v) {
    var r = F.run(), p = prefs();
    var h = '<div class="fgrid"><div class="card hero" id="hero">';
    h += '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#2186d8"/></linearGradient></defs></svg>';
    h += '<div class="ring" id="ring"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="trk" cx="100" cy="100" r="88"/><circle class="arc" id="arc" cx="100" cy="100" r="88" stroke-dasharray="552.9" stroke-dashoffset="552.9"/></svg><span class="orb" id="orb"></span>' +
      '<div class="in"><span class="ph" id="ph">Ready</span><span class="t" id="tt" role="timer">' + (p.mode === 'pomo' ? p.pomo.w : p.min) + ':00</span><span class="s" id="ts"></span></div></div>';
    if (!r) {
      h += '<div class="setup">' +
        '<div class="row" style="justify-content:center"><div class="seg" role="group" aria-label="Timer type"><button type="button" data-mode="timer" aria-pressed="' + (p.mode !== 'pomo') + '">Timer</button><button type="button" data-mode="pomo" aria-pressed="' + (p.mode === 'pomo') + '">Pomodoro</button></div></div>' +
        '<div id="modeBox"></div>' +
        '<div class="setup-extra"><div class="lbl">Subject</div>' + subjChips('subj', p.subj, true) + '</div>' +
        '<div class="setup-extra"><label class="lbl" for="fLabel">What are you working on?</label><input type="text" id="fLabel" maxlength="80" placeholder="e.g. Electric fields past paper" value=""></div>' +
        '<div class="setup-extra"><label class="lbl" for="fGoal">Goal for this session</label><input type="text" id="fGoal" maxlength="300" placeholder="By the end I will have…"></div>' +
        '<div class="setup-extra"><label class="lbl" for="fTodo">Link a task <span class="muted" style="text-transform:none;letter-spacing:0;font-weight:500">(optional)</span></label><select id="fTodo"><option value="">No task</option>' +
        F.topTodos(40).filter(function (t) { return !t.done; }).map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.text) + (t.due ? ' · ' + rel(t.due) : '') + '</option>'; }).join('') + '</select></div>' +
        '<div class="ctl"><button type="button" class="btn pr big" id="btnStart">' + IC.play + 'Start focusing</button></div>' +
        '<p class="muted small" style="text-align:center;margin:0">A floating timer follows you round every TrainTanmay app. Space starts and pauses.</p>' +
        '</div>';
    } else {
      h += '<div class="dots" id="dots"></div>' +
        '<div class="ctl"><button type="button" class="btn pr big" id="btnPause"></button><button type="button" class="btn big" id="btnAdd">' + IC.plus + '5 min</button><button type="button" class="btn big" id="btnStop">' + IC.stop + 'Stop</button></div>' +
        '<div class="row" style="justify-content:center;margin-top:12px">' +
        (F.canPopOut() ? '<button type="button" class="btn sm ghost" id="btnPop">' + IC.pop + 'Pop out timer</button>' : '') +
        (F.isHidden() ? '<button type="button" class="btn sm ghost" id="btnShow">' + IC.show + 'Show floating timer</button>' : '') +
        '<button type="button" class="btn sm ghost zen-exit" id="btnZenX">' + IC.x + 'Leave full screen</button></div>';
      if (r.goal || r.todo) {
        var td = r.todo && F.todos().items[r.todo];
        h += '<div class="goalbox">' + (r.goal ? '<div class="small muted">Goal</div><b>' + esc(r.goal) + '</b>' : '') +
          (td ? '<label class="row" style="margin-top:' + (r.goal ? 10 : 0) + 'px;gap:10px;cursor:pointer"><input type="checkbox" class="check pop" id="runTodo"' + (td.done ? ' checked' : '') + '><span>' + esc(td.text) + '</span></label>' : '') + '</div>';
      }
      h += '<div class="park"><form id="parkF"><input type="text" id="parkI" maxlength="200" placeholder="Distracting thought? Park it here and get back to work" aria-label="Park a thought"><button class="btn" type="submit">Park</button></form>' +
        (parked.length ? '<ul>' + parked.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><p class="small muted" style="margin:6px 0 0">Parked thoughts wait for you in Tasks.</p>' : '') + '</div>' +
        '<p class="zen-quote">' + esc(QUOTES[Math.floor((r.t0 / 6e5)) % QUOTES.length]) + '</p>';
    }
    h += '</div><div class="side">' + todayCard() + soundCard() + '</div></div>';
    v.innerHTML = h;

    if (!r) {
      var mode = p.mode;
      var box = $('#modeBox', v);
      var drawMode = function () {
        var q = prefs();
        box.innerHTML = mode === 'pomo'
          ? '<div class="pomo">' + [['w', 'Focus', 5, 90], ['b', 'Break', 1, 30], ['l', 'Long break', 5, 45], ['n', 'Rounds', 1, 12]].map(function (f) {
            return '<div><label for="pp-' + f[0] + '">' + f[1] + (f[0] === 'n' ? '' : ' (min)') + '</label><span class="stepper"><button type="button" data-st="-1" data-k="' + f[0] + '" aria-label="Less">−</button><input type="number" id="pp-' + f[0] + '" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" value="' + q.pomo[f[0]] + '"><button type="button" data-st="1" data-k="' + f[0] + '" aria-label="More">+</button></span></div>';
          }).join('') + '</div><p class="small muted" id="pomoSum" style="margin:8px 0 0"></p>'
          : '<div class="lbl">How long?</div><div class="chips" data-chips="min">' + [15, 25, 45, 60, 90, 120].map(function (m) { return '<button type="button" class="chip" data-v="' + m + '" aria-pressed="' + (q.min === m) + '">' + (m < 60 ? m + ' min' : m / 60 + (m === 60 ? ' hour' : ' hours')) + '</button>'; }).join('') +
            '<span class="stepper" title="Your own length, in minutes"><button type="button" data-st="-5" aria-label="5 minutes less">−</button><input type="number" id="fMin" min="1" max="240" value="' + q.min + '" aria-label="Minutes"><button type="button" data-st="5" aria-label="5 minutes more">+</button></span></div>';
        if (mode === 'pomo') {
          var sum = function () { var x = prefs().pomo, tot = x.n * x.w + Math.max(0, x.n - 1) * x.b + Math.floor((x.n - 1) / 4) * (x.l - x.b); $('#pomoSum', v).textContent = x.n + ' × ' + x.w + ' min focus with breaks · ' + mins(tot * 60) + ' in all · ' + mins(x.n * x.w * 60) + ' of focus'; $('#tt', v).textContent = x.w + ':00'; };
          var setP = function (k, val) { var x = prefs().pomo, lim = { w: [5, 90], b: [1, 30], l: [5, 45], n: [1, 12] }[k]; x[k] = Math.max(lim[0], Math.min(lim[1], Math.round(val) || lim[0])); setPref('pomo', x); var i = $('#pp-' + k, v); if (i) i.value = x[k]; sum(); };
          box.onclick = function (e) { var b = e.target.closest('[data-st]'); if (b) setP(b.getAttribute('data-k'), prefs().pomo[b.getAttribute('data-k')] + +b.getAttribute('data-st')); };
          box.onchange = function (e) { var i = e.target.closest('input[data-k]'); if (i) setP(i.getAttribute('data-k'), +i.value); };
          sum();
        } else {
          var setM = function (m) { m = Math.max(1, Math.min(240, Math.round(m) || 25)); setPref('min', m); $('#fMin', v).value = m; $$('[data-chips=min] .chip', v).forEach(function (c) { c.setAttribute('aria-pressed', String(+c.getAttribute('data-v') === m)); }); $('#tt', v).textContent = F.clock(m * 60000); };
          box.onclick = function (e) { var c = e.target.closest('.chip'); if (c) setM(+c.getAttribute('data-v')); var b = e.target.closest('[data-st]'); if (b) setM(prefs().min + +b.getAttribute('data-st')); };
          box.onchange = function (e) { if (e.target.id === 'fMin') setM(+e.target.value); };
          $('#tt', v).textContent = F.clock(q.min * 60000);
        }
      };
      drawMode();
      $$('[data-mode]', v).forEach(function (b) { b.onclick = function () { mode = b.getAttribute('data-mode'); setPref('mode', mode); $$('[data-mode]', v).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); drawMode(); }; });
      wireChips(v, 'subj', function (s) { setPref('subj', s); });
      var sel = $('#fTodo', v); sel.onchange = function () { if (sel.value && !$('#fLabel', v).value) { var t = F.todos().items[sel.value]; if (t) { $('#fLabel', v).value = t.text.slice(0, 80); if (t.subj) { setPref('subj', t.subj); $$('[data-chips=subj] .chip', v).forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-v') === t.subj)); }); } } } };
      if (pendingTodo) { sel.value = pendingTodo; sel.onchange(); pendingTodo = null; }
      $('#btnStart', v).onclick = startNow;
      $('#fGoal', v).onkeydown = $('#fLabel', v).onkeydown = function (e) { if (e.key === 'Enter') startNow(); };
      $('#ring', v).classList.remove('brk', 'pz'); $('#arc', v).style.strokeDashoffset = '0'; $('#orb', v).style.display = 'none';
      F.setInline(false);
    } else {
      $('#btnPause', v).onclick = function () { F.toggle(); paintRing(); };
      $('#btnAdd', v).onclick = function () { F.extend(5); toast('5 more minutes added.'); paintRing(); };
      $('#btnStop', v).onclick = function () { var ph = F.phase(F.run()); if (ph.k === 'done' || confirm('Stop this session now? Your focus time so far is kept.')) stopNow(); };
      var pb = $('#btnPop', v); if (pb) pb.onclick = function () { F.popOut(); };
      var sb = $('#btnShow', v); if (sb) sb.onclick = function () { F.show(); render(); toast('The floating timer is back.'); };
      $('#btnZenX', v).onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); };
      var rt = $('#runTodo', v); if (rt) rt.onchange = function () { F.setTodo(r.todo, { done: rt.checked }); if (rt.checked) { var b = rt.getBoundingClientRect(); confetti(b.left + 10, b.top); } };
      $('#parkF', v).onsubmit = function (e) { e.preventDefault(); var i = $('#parkI', v), t = i.value.trim(); if (!t) return; F.addTodo(t, { parked: true, subj: r.subj || '' }); parked.push(t); i.value = ''; render(); setTimeout(function () { var j = $('#parkI'); if (j) j.focus(); }, 0); };
      observeHero(v);
      paintRing();
    }
    wireToday(v); wireSound(v);
  };
  var pendingTodo = null;
  function startNow() {
    var v = $('#v-focus'), p = prefs();
    var o = { label: $('#fLabel', v).value.trim(), goal: $('#fGoal', v).value.trim(), subj: chipVal(v, 'subj'), todo: $('#fTodo', v).value || null };
    if (p.mode === 'pomo') o.pomo = p.pomo; else o.min = p.min;
    parked = [];
    F.setInline(true); // the big ring is on screen: no need for the floating one yet
    F.start(o); lastRunId = F.run().id;
    if (p.sound !== 'off') sound.play(p.sound, p.vol);
    render();
    toast('Focus started. The timer follows you to every app.');
  }
  function stopNow() {
    var entry = F.stop(); lastRunId = null; sound.stop(); render();
    if (entry) reflectDlg(entry.id); else toast('Session stopped. Under a minute, so it was not logged.');
  }
  var heroObs = null;
  function observeHero(v) {
    if (heroObs) heroObs.disconnect();
    var ring = $('#ring', v); if (!ring || !window.IntersectionObserver) { F.setInline(true); return; }
    heroObs = new IntersectionObserver(function (es) { F.setInline(es[0].isIntersecting && cur === 'focus'); }, { threshold: 0.35 });
    heroObs.observe(ring);
  }
  var lastPhaseK = null;
  function paintRing() {
    var r = F.run(), ring = $('#ring'); if (!ring || !r) return;
    var ph = F.phase(r), pz = !!r.pausedAt, done = ph.k === 'done', studied = F.studiedMs(r, ph.el);
    var frac = done ? 1 : 1 - ph.segLeft / ph.d;
    ring.classList.toggle('brk', ph.k === 'b'); ring.classList.toggle('pz', pz);
    var arc = $('#arc'), orb = $('#orb'), ang = frac * 2 * Math.PI - Math.PI / 2, R = ring.offsetWidth / 2 * 0.88, first = !ring.dataset.on;
    if (first) { arc.style.transition = orb.style.transition = 'none'; } // straight to the right place after a redraw, then glide
    arc.style.strokeDashoffset = String(552.9 * (1 - frac));
    orb.style.display = done ? 'none' : ''; orb.style.transform = 'translate(' + (Math.cos(ang) * R).toFixed(1) + 'px,' + (Math.sin(ang) * R).toFixed(1) + 'px)';
    if (first) { ring.dataset.on = '1'; void ring.offsetWidth; arc.style.transition = orb.style.transition = ''; }
    $('#ph').textContent = done ? 'Complete' : pz ? 'Paused' : ph.k === 'b' ? 'Break' + (r.pomo ? ' · ' + ph.n + '/' + ph.of : '') : 'Focus' + (r.pomo ? ' · ' + ph.n + '/' + ph.of : '');
    $('#tt').textContent = done ? F.clock(studied) : F.clock(ph.segLeft);
    $('#ts').textContent = done ? 'of focus — nice work' : (r.label ? r.label + ' · ' : '') + mins(studied / 1000) + ' focused · ' + F.clock(ph.total) + ' left';
    var pb = $('#btnPause'); if (pb) { pb.innerHTML = done ? IC.check + 'Finish & log' : pz ? IC.play + 'Resume' : IC.pause + 'Pause'; pb.onclick = done ? stopNow : function () { F.toggle(); paintRing(); }; }
    var dots = $('#dots');
    if (dots) {
      var a = 0;
      dots.innerHTML = r.seg.length > 1 ? r.seg.map(function (s, i) { var st = i < ph.i ? ' done' : i === ph.i ? ' cur' : ''; var pct = i === ph.i ? (100 * (ph.el - a) / s.d).toFixed(1) : 0; a += s.d; return '<i class="' + s.k + st + '" style="--p:' + pct + '%" title="' + (s.k === 'w' ? 'Focus' : 'Break') + ' ' + Math.round(s.d / 60000) + ' min"></i>'; }).join('') : '';
    }
    if (lastPhaseK && lastPhaseK !== ph.k && document.visibilityState === 'visible') { if (ph.k === 'b') toast('Break time — stand up and stretch.'); else if (ph.k === 'w') toast('Back to it.'); else if (ph.k === 'done') { toast('Session complete!'); var b = ring.getBoundingClientRect(); confetti(b.left + b.width / 2, b.top + b.height / 2); } }
    lastPhaseK = ph.k;
    document.title = (done ? 'Done' : F.clock(ph.segLeft)) + ' · ' + (ph.k === 'b' ? 'Break' : 'Focus');
  }
  setInterval(function () {
    if (cur === 'focus' && F.run()) paintRing();
    else if (!F.run() && /^\d|^Done/.test(document.title)) document.title = 'Focus · TrainTanmay Focus';
  }, 1000);

  function todayCard() {
    var g = goals(), wk = weekSec(monday(today())), tgt = g.weekly * 60, pct = tgt ? Math.min(1, wk / tgt) : 0, pd = perDay();
    var t = today(), items = F.topTodos(60).filter(function (x) { return x.due && x.due <= t && !x.done || (x.done && x.doneAt && iso(new Date(x.doneAt)) === t && x.due && x.due <= t); });
    var evs = vals(cal().events).filter(function (e) { return e.date === t; }).sort(function (a, b) { return (toMin(a.start) || -1) - (toMin(b.start) || -1); });
    var dls = vals(cal().events).filter(function (e) { return e.kind === 'deadline' && !e.done && e.date > t; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 3);
    var h = '<div class="card today"><div class="ch"><h2>Today <span class="muted small" style="font-family:var(--f-body);font-weight:500">' + esc(niceDate(t, true)) + '</span></h2><a class="btn sm ghost" href="#calendar">' + IC.cal + '</a></div>' +
      '<div class="wk"><svg class="mini-ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="27"/><circle class="arc" cx="32" cy="32" r="27" stroke-dasharray="169.6" stroke-dashoffset="' + (169.6 * (1 - pct)).toFixed(1) + '"' + (pct ? '' : ' style="opacity:0"') + '/></svg>' +
      '<div><b>' + mins(pd[t] || 0) + '</b> <span class="muted">today</span><div class="small muted">' + mins(wk) + ' of your ' + mins(tgt) + ' weekly target' + (streak() > 1 ? ' · 🔥 ' + streak() + '-day streak' : '') + '</div></div></div>';
    h += '<div class="sublbl">Tasks due</div>' + (items.length ? '<ul class="list" data-todolist>' + items.map(todoLi).join('') + '</ul>' : '<p class="small muted" style="margin:2px 8px">Nothing due today. <a href="#tasks">Plan some tasks</a>.</p>');
    if (evs.length) h += '<div class="sublbl">On the calendar</div>' + evs.map(function (e) { return '<div class="ev" style="--c:' + evCol(e) + '"><span class="bar"></span><span class="when">' + (e.start ? esc(e.start) : e.kind === 'deadline' ? 'due' : 'all day') + '</span><span>' + esc(e.title) + '</span></div>'; }).join('');
    if (dls.length) h += '<div class="sublbl">Coming up</div>' + dls.map(function (e) { var n = daysBetween(t, e.date); return '<div class="ev" style="--c:var(--bad)"><span class="bar"></span><span class="when">' + n + 'd</span><span>' + esc(e.title) + '</span></div>'; }).join('');
    return h + '<form class="row" id="qAdd" style="margin-top:12px"><input type="text" class="grow" style="width:auto" maxlength="200" placeholder="Add a task for today" aria-label="Add a task for today"><button class="btn" type="submit" aria-label="Add">' + IC.plus + '</button></form></div>';
  }
  function todoLi(t) {
    return '<li class="li' + (t.done ? ' dn' : '') + '"><input type="checkbox" class="check pop" data-tid="' + esc(t.id) + '"' + (t.done ? ' checked' : '') + ' aria-label="Done"><span class="tx">' + esc(t.text) + '</span>' +
      '<span class="meta">' + (t.subj ? '<span class="tag" style="--c:' + subjCol(t.subj) + '"><i></i>' + esc(subjName(t.subj)) + '</span>' : '') + (t.due && t.due < today() ? '<span class="tag bad">overdue</span>' : '') + '</span></li>';
  }
  function wireToday(v) {
    $$('[data-tid]', v).forEach(function (c) { c.onchange = function () { F.setTodo(c.getAttribute('data-tid'), { done: c.checked }); if (c.checked) { var b = c.getBoundingClientRect(); confetti(b.left + 10, b.top); } }; });
    var f = $('#qAdd', v); if (f) f.onsubmit = function (e) { e.preventDefault(); var i = f.querySelector('input'); if (F.addTodo(i.value, { due: today() })) { i.value = ''; render(); setTimeout(function () { var j = $('#qAdd input'); if (j) j.focus(); }, 0); } };
  }

  /* ---------- ambient sound, made in the browser (no downloads) ---------- */
  var sound = (function () {
    var ctx = null, nodes = [], kind = 'off', master = null;
    function buf(type) {
      var len = ctx.sampleRate * 4, b = ctx.createBuffer(2, len, ctx.sampleRate);
      for (var ch = 0; ch < 2; ch++) {
        var d = b.getChannelData(ch), b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
        for (var i = 0; i < len; i++) {
          var w = Math.random() * 2 - 1;
          if (type === 'white') d[i] = w * 0.35;
          else if (type === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
          else { b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.09; b6 = w * 0.115926; }
        }
      }
      return b;
    }
    function src(type) { var s = ctx.createBufferSource(); s.buffer = buf(type); s.loop = true; return s; }
    function play(k, vol) {
      stop(); if (k === 'off') return;
      try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { return; }
      kind = k; master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1.2);
      if (k === 'rain') {
        var a = src('pink'), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500; var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000;
        var g1 = ctx.createGain(); g1.gain.value = 0.9; a.connect(hp); hp.connect(lp); lp.connect(g1); g1.connect(master);
        var b = src('brown'), g2 = ctx.createGain(); g2.gain.value = 0.5; b.connect(g2); g2.connect(master);
        // slow swell, like gusts of rain
        var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.25; lfo.connect(lg); lg.connect(g1.gain);
        a.start(); b.start(); lfo.start(); nodes = [a, b, lfo];
      } else if (k === 'cafe') {
        var c = src('pink'), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6; var gc = ctx.createGain(); gc.gain.value = 1.1;
        var lfo2 = ctx.createOscillator(), lg2 = ctx.createGain(); lfo2.frequency.value = 0.31; lg2.gain.value = 0.35; lfo2.connect(lg2); lg2.connect(gc.gain);
        c.connect(bp); bp.connect(gc); gc.connect(master); var d = src('brown'), gd = ctx.createGain(); gd.gain.value = 0.35; d.connect(gd); gd.connect(master);
        c.start(); d.start(); lfo2.start(); nodes = [c, d, lfo2];
      } else { var s = src(k), lp2 = ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = k === 'white' ? 9000 : 2500; s.connect(lp2); lp2.connect(master); s.start(); nodes = [s]; }
    }
    function stop() { if (master && ctx) { var m = master, ns = nodes; m.gain.cancelScheduledValues(ctx.currentTime); m.gain.setValueAtTime(m.gain.value, ctx.currentTime); m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4); setTimeout(function () { ns.forEach(function (n) { try { n.stop(); } catch (e) {} }); m.disconnect(); }, 450); } nodes = []; master = null; kind = 'off'; }
    function volume(v) { if (master && ctx) master.gain.setTargetAtTime(v, ctx.currentTime, 0.1); }
    return { play: play, stop: stop, volume: volume, kind: function () { return kind; } };
  })();
  function soundCard() {
    var p = prefs(), k = sound.kind();
    return '<div class="card sounds"><div class="ch"><h3>Background sound</h3><span class="small muted">plays while this page is open</span></div><div class="chips" data-chips="snd">' +
      [['off', 'Off'], ['rain', 'Rain'], ['cafe', 'Café murmur'], ['brown', 'Brown noise'], ['pink', 'Pink noise'], ['white', 'White noise']].map(function (s) { return '<button type="button" class="chip" data-v="' + s[0] + '" aria-pressed="' + (k === s[0]) + '">' + s[1] + '</button>'; }).join('') +
      '</div><label class="f" for="vol">Volume</label><input type="range" class="vol" id="vol" min="0" max="1" step="0.02" value="' + p.vol + '"></div>';
  }
  function wireSound(v) {
    wireChips(v, 'snd', function (k) { setPref('sound', k); sound.play(k, prefs().vol); });
    var vol = $('#vol', v); if (vol) vol.oninput = function () { setPref('vol', +vol.value); sound.volume(+vol.value); };
  }

  /* reflection after a session: how it went, and what you got done */
  function reflectDlg(id) {
    var e = log()[id]; if (!e) return;
    var td = e.todo && F.todos().items[e.todo];
    var m = modal('<h2>Session done — ' + mins(e.studied) + ' of focus 🎉</h2><div class="fields">' +
      (e.goal ? '<div class="goalbox" style="margin:0"><div class="small muted">Your goal</div><b>' + esc(e.goal) + '</b></div>' : '') +
      '<div><div class="f" style="font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px">How did it go?</div><div class="chips" data-chips="res">' +
      [['y', 'Nailed it'], ['p', 'Partly'], ['n', 'Not really']].map(function (r) { return '<button type="button" class="chip" data-v="' + r[0] + '" aria-pressed="false">' + r[1] + '</button>'; }).join('') + '</div></div>' +
      '<div><label class="f" for="rNote">What did you get done? Anything to come back to?</label><textarea id="rNote" maxlength="2000" placeholder="e.g. Finished Q1–6. Still shaky on capacitor discharge — redo Q4 tomorrow."></textarea></div>' +
      (td && !td.done ? '<label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" class="check" id="rTodo"><span>Mark “' + esc(td.text) + '” as done</span></label>' : '') +
      '<label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" class="check" id="rDev"><span>Also add this to my Developments</span></label>' +
      '</div><div class="foot"><button type="button" class="btn ghost" data-skip>Skip</button><button type="button" class="btn pr" data-save>Save</button></div>');
    wireChips(m.box, 'res', function () {});
    m.box.querySelector('[data-skip]').onclick = m.close;
    m.box.querySelector('[data-save]').onclick = function () {
      var L = log(), en = L[id]; if (!en) return m.close();
      en.result = chipVal(m.box, 'res') || null; en.note = $('#rNote', m.box).value.trim(); en.dev = $('#rDev', m.box).checked; L[id] = en; putJ(K.log, L);
      var rt = $('#rTodo', m.box); if (rt && rt.checked) F.setTodo(e.todo, { done: true });
      m.close(); toast('Saved to your progress log.'); render();
    };
  }

  /* ======================================================================
     TASKS
     ====================================================================== */
  var tView = 'all';
  RENDER.tasks = function (v) {
    var d = F.todos(), items = vals(d.items), lists = vals(d.lists).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var t = today(), open = items.filter(function (x) { return !x.done; });
    if (tView !== 'all' && tView !== 'today' && tView !== 'upcoming' && !d.lists[tView]) tView = 'all';
    function cnt(f) { var n = open.filter(f).length; return n ? '<span class="n">' + n + '</span>' : ''; }
    var h = '<div class="vhead"><div><h1>Tasks</h1><p>Your to-do list goes everywhere: tick things off from the floating timer in any app.</p></div></div><div class="tgrid"><aside class="card lists" aria-label="Lists"><div class="lwrap">' +
      '<button type="button" class="ln" data-l="all" aria-current="' + (tView === 'all') + '">' + IC.list + 'All tasks' + cnt(function () { return true; }) + '</button>' +
      '<button type="button" class="ln" data-l="today" aria-current="' + (tView === 'today') + '">' + IC.sun + 'Today' + cnt(function (x) { return x.due && x.due <= t; }) + '</button>' +
      '<button type="button" class="ln" data-l="upcoming" aria-current="' + (tView === 'upcoming') + '">' + IC.upcoming + 'Upcoming' + cnt(function (x) { return x.due && x.due > t; }) + '</button><hr>' +
      lists.map(function (l) { return '<button type="button" class="ln" data-l="' + esc(l.id) + '" aria-current="' + (tView === l.id) + '" style="--c:' + esc(l.color || '#2186d8') + '">' + (l.id === 'inbox' ? IC.inbox : '<i></i>') + esc(l.name) + cnt(function (x) { return (x.list || 'inbox') === l.id; }) + '</button>'; }).join('') +
      '<button type="button" class="ln" data-newlist>' + IC.plus + 'New list</button></div></aside><div>';
    var lst = d.lists[tView];
    h += '<div class="card">' + (lst ? '<div class="ch"><h2>' + esc(lst.name) + '</h2>' + (lst.id !== 'inbox' ? '<span><button type="button" class="btn sm ghost" data-editlist>' + IC.edit + 'Edit list</button></span>' : '') + '</div>' : '') +
      '<form class="addtask" id="addT"><input type="text" name="t" maxlength="200" placeholder="Add a task… e.g. Redo Q4 from the 2022 paper" aria-label="New task" autocomplete="off"><button class="btn pr" type="submit">' + IC.plus + 'Add</button>' +
      '<div class="more"><input type="date" name="due" aria-label="Due date" value="' + (tView === 'today' ? t : '') + '"><select name="pri" aria-label="Priority"><option value="0">No priority</option><option value="1">! Low</option><option value="2">!! Medium</option><option value="3">!!! High</option></select>' +
      '<select name="list" aria-label="List">' + lists.map(function (l) { return '<option value="' + esc(l.id) + '"' + (l.id === (lst ? lst.id : 'inbox') ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join('') + '</select>' +
      '<select name="subj" aria-label="Subject"><option value="">No subject</option>' + SUBJ.map(function (s) { return '<option value="' + s[0] + '">' + esc(s[1]) + '</option>'; }).join('') + '</select></div></form>';
    var shown = items.filter(function (x) {
      if (tView === 'today') return x.due && x.due <= t; if (tView === 'upcoming') return x.due && x.due > t; if (tView === 'all') return true; return (x.list || 'inbox') === tView;
    });
    var groups = [['Overdue', function (x) { return x.due && x.due < t; }], ['Today', function (x) { return x.due === t; }], ['Tomorrow', function (x) { return x.due === addDays(t, 1); }], ['This week', function (x) { return x.due && x.due > addDays(t, 1) && x.due <= addDays(t, 7); }], ['Later', function (x) { return x.due && x.due > addDays(t, 7); }], ['No date', function (x) { return !x.due; }]];
    var od = shown.filter(function (x) { return !x.done; }), dn = shown.filter(function (x) { return x.done; }).sort(function (a, b) { return (b.doneAt || 0) - (a.doneAt || 0); });
    var sortF = function (a, b) { return (a.due || '9') < (b.due || '9') ? -1 : (a.due || '9') > (b.due || '9') ? 1 : (b.pri || 0) - (a.pri || 0) || a.t - b.t; };
    if (!od.length && !dn.length) h += '<div class="empty">' + IC.check.replace('width="18" height="18"', '') + '<div>' + (tView === 'today' ? 'Nothing due today. Enjoy it, or get ahead.' : 'No tasks here yet. Add one above.') + '</div></div>';
    else if (!od.length) h += '<div class="empty"><div>All done here. 🎉</div></div>';
    groups.forEach(function (g) { var xs = od.filter(g[1]).sort(sortF); if (xs.length) h += '<div class="grp"><h3>' + g[0] + '<span class="n">' + xs.length + '</span></h3>' + xs.map(taskRow).join('') + '</div>'; });
    if (dn.length) h += '<details class="grp"' + (dn.length < 4 ? ' open' : '') + '><summary><h3>Done<span class="n">' + dn.length + '</span></h3></summary>' + dn.slice(0, 50).map(taskRow).join('') + (dn.length > 1 ? '<button type="button" class="btn sm ghost danger" data-cleardone style="margin:6px 8px">' + IC.trash + 'Clear done tasks</button>' : '') + '</details>';
    h += '</div></div></div>';
    v.innerHTML = h;

    $$('[data-l]', v).forEach(function (b) { b.onclick = function () { tView = b.getAttribute('data-l'); render(); }; });
    $('[data-newlist]', v).onclick = function () { listDlg(null); };
    var el = $('[data-editlist]', v); if (el) el.onclick = function () { listDlg(lst); };
    var f = $('#addT', v);
    f.onsubmit = function (e) {
      e.preventDefault(); var text = f.t.value.trim(); if (!text) return;
      // quick syntax: "!!" for priority, "today"/"tomorrow" at the end for a date
      var due = f.due.value || null, pri = +f.pri.value, m;
      if ((m = /\s+(today|tomorrow)$/i.exec(text))) { due = m[1].toLowerCase() === 'today' ? t : addDays(t, 1); text = text.slice(0, m.index); }
      if ((m = /\s+(!{1,3})$/.exec(text))) { pri = m[1].length; text = text.slice(0, m.index); }
      F.addTodo(text, { due: due, pri: pri, list: f.list.value, subj: f.subj.value });
      f.t.value = ''; render(); var i = $('#addT input[name=t]'); if (i) i.focus();
    };
    wireTaskRows(v);
    var cd = $('[data-cleardone]', v); if (cd) cd.onclick = function () {
      var d2 = F.todos(), gone = {}; vals(d2.items).forEach(function (x) { if (x.done && shown.some(function (s) { return s.id === x.id; })) { gone[x.id] = x; delete d2.items[x.id]; } });
      F.saveTodos(d2); render(); toast(Object.keys(gone).length + ' cleared.', 'Undo', function () { var d3 = F.todos(); Object.keys(gone).forEach(function (k) { d3.items[k] = gone[k]; }); F.saveTodos(d3); render(); });
    };
  };
  function taskRow(x) {
    var d = F.todos(), l = d.lists[x.list || 'inbox'], t = today();
    var dueTag = x.due ? '<span class="tag' + (!x.done && x.due < t ? ' bad' : !x.done && x.due === t ? ' warn' : '') + '">' + IC.cal.replace(/width="18" height="18"/, 'width="11" height="11"') + esc(rel(x.due)) + '</span>' : '';
    return '<div class="titem' + (x.done ? ' dn' : '') + '" data-id="' + esc(x.id) + '"><input type="checkbox" class="check pop" aria-label="Done"' + (x.done ? ' checked' : '') + '>' +
      '<div class="body"><div class="tx" tabindex="0" title="Click to edit">' + (x.pri ? '<span class="pri">' + '!!!'.slice(0, x.pri) + '</span> ' : '') + esc(x.text) + '</div><div class="meta">' + dueTag +
      (x.subj ? '<span class="tag" style="--c:' + subjCol(x.subj) + '"><i></i>' + esc(subjName(x.subj)) + '</span>' : '') +
      (tView === 'all' || tView === 'today' || tView === 'upcoming' ? (l && l.id !== 'inbox' ? '<span class="tag" style="--c:' + esc(l.color) + '"><i></i>' + esc(l.name) + '</span>' : '') : '') +
      (x.parked ? '<span class="tag">parked thought</span>' : '') + '</div></div>' +
      '<div class="acts">' + (!x.done ? '<button type="button" class="btn sm ghost" data-act="focus" title="Focus on this">' + IC.focus + '</button>' : '') +
      '<button type="button" class="btn sm ghost" data-act="edit" title="Edit">' + IC.edit + '</button><button type="button" class="btn sm ghost danger" data-act="del" title="Delete">' + IC.trash + '</button></div></div>';
  }
  function wireTaskRows(v) {
    $$('.titem', v).forEach(function (row) {
      var id = row.getAttribute('data-id');
      row.querySelector('.check').onchange = function (e) {
        var c = e.target; F.setTodo(id, { done: c.checked });
        if (c.checked) { var b = c.getBoundingClientRect(); confetti(b.left + 10, b.top); row.classList.add('dn'); setTimeout(render, 650); } else render();
      };
      var tx = row.querySelector('.tx');
      var startEdit = function () {
        if (tx.isContentEditable) return; var it = F.todos().items[id]; if (!it) return;
        tx.textContent = it.text; tx.contentEditable = 'true'; tx.focus(); document.getSelection().selectAllChildren(tx); document.getSelection().collapseToEnd();
        var done = function (save) { tx.onblur = null; tx.onkeydown = null; tx.contentEditable = 'false'; var nv = tx.textContent.trim().slice(0, 200); if (save && nv && nv !== it.text) F.setTodo(id, { text: nv }); render(); };
        tx.onblur = function () { done(true); }; tx.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); done(true); } if (e.key === 'Escape') done(false); };
      };
      tx.onclick = startEdit; tx.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); startEdit(); } };
      row.querySelector('.acts').onclick = function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return; var a = b.getAttribute('data-act');
        if (a === 'del') { var d = F.todos(), old = d.items[id]; delete d.items[id]; F.saveTodos(d); render(); toast('Task deleted.', 'Undo', function () { var d2 = F.todos(); d2.items[id] = old; F.saveTodos(d2); render(); }); }
        if (a === 'edit') taskDlg(id);
        if (a === 'focus') { if (F.run()) { toast('A session is already running. Stop it first to focus on this.'); return; } pendingTodo = id; location.hash = '#focus'; }
      };
    });
  }
  function taskDlg(id) {
    var d = F.todos(), x = d.items[id]; if (!x) return;
    var m = modal('<h2>Edit task</h2><div class="fields"><div><label class="f" for="eT">Task</label><input type="text" id="eT" maxlength="200" value="' + esc(x.text) + '"></div>' +
      '<div class="row"><div class="grow"><label class="f" for="eD">Due</label><input type="date" id="eD" value="' + esc(x.due || '') + '"></div><div class="grow"><label class="f" for="eP">Priority</label><select id="eP">' + ['None', '! Low', '!! Medium', '!!! High'].map(function (p, i) { return '<option value="' + i + '"' + ((x.pri || 0) === i ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></div></div>' +
      '<div><label class="f" for="eL">List</label><select id="eL">' + vals(d.lists).map(function (l) { return '<option value="' + esc(l.id) + '"' + ((x.list || 'inbox') === l.id ? ' selected' : '') + '>' + esc(l.name) + '</option>'; }).join('') + '</select></div>' +
      '<div><div class="f" style="font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px">Subject</div>' + subjChips('es', x.subj || '', true) + '</div>' +
      '<div><label class="f" for="eN">Notes</label><textarea id="eN" maxlength="2000">' + esc(x.note || '') + '</textarea></div></div>' +
      '<div class="foot"><button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete</button><button type="button" class="btn ghost" data-c>Cancel</button><button type="button" class="btn pr" data-s>Save</button></div>');
    wireChips(m.box, 'es', function () {});
    m.box.querySelector('[data-c]').onclick = m.close;
    m.box.querySelector('[data-del]').onclick = function () { var d2 = F.todos(); delete d2.items[id]; F.saveTodos(d2); m.close(); render(); };
    m.box.querySelector('[data-s]').onclick = function () {
      var t = $('#eT', m.box).value.trim(); if (!t) return $('#eT', m.box).focus();
      F.setTodo(id, { text: t.slice(0, 200), due: $('#eD', m.box).value || null, pri: +$('#eP', m.box).value, list: $('#eL', m.box).value, subj: chipVal(m.box, 'es'), note: $('#eN', m.box).value.trim() || undefined });
      m.close(); render();
    };
  }
  function listDlg(l) {
    var col = l ? l.color : COLS[Object.keys(F.todos().lists).length % COLS.length];
    var m = modal('<h2>' + (l ? 'Edit list' : 'New list') + '</h2><div class="fields"><div><label class="f" for="lN">Name</label><input type="text" id="lN" maxlength="40" placeholder="e.g. Physics revision" value="' + esc(l ? l.name : '') + '"></div>' +
      '<div><div class="f" style="font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px">Colour</div><div class="swatches">' + COLS.map(function (c) { return '<button type="button" style="--c:' + c + '" data-c="' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + (c === col) + '"></button>'; }).join('') + '</div></div></div>' +
      '<div class="foot">' + (l ? '<button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete list</button>' : '') + '<button type="button" class="btn pr" data-s>' + (l ? 'Save' : 'Create list') + '</button></div>');
    var sw = m.box.querySelector('.swatches'); sw.onclick = function (e) { var b = e.target.closest('[data-c]'); if (!b) return; col = b.getAttribute('data-c'); $$('[data-c]', sw).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); };
    m.box.querySelector('[data-s]').onclick = function () {
      var n = $('#lN', m.box).value.trim(); if (!n) return $('#lN', m.box).focus();
      var d = F.todos(); if (l) { d.lists[l.id].name = n; d.lists[l.id].color = col; } else { var id = uid(); d.lists[id] = { id: id, name: n.slice(0, 40), color: col, order: Object.keys(d.lists).length }; tView = id; }
      F.saveTodos(d); m.close(); render();
    };
    var del = m.box.querySelector('[data-del]'); if (del) del.onclick = function () {
      if (!confirm('Delete the list "' + l.name + '"? Its tasks move to your Inbox.')) return;
      var d = F.todos(); vals(d.items).forEach(function (x) { if (x.list === l.id) x.list = 'inbox'; }); delete d.lists[l.id]; F.saveTodos(d); tView = 'inbox'; m.close(); render();
    };
    $('#lN', m.box).onkeydown = function (e) { if (e.key === 'Enter') m.box.querySelector('[data-s]').click(); };
  }

  /* ======================================================================
     CALENDAR
     ====================================================================== */
  var cAnchor = today(), dragging = false, HH = 46;
  function evCol(e) { return e.color || (e.subj ? subjCol(e.subj) : e.kind === 'deadline' ? 'var(--bad)' : 'var(--acc)'); }
  /* everything on a date: calendar events, plus tasks with that due date */
  function itemsOn(date) {
    var evs = vals(cal().events).filter(function (e) { return e.date === date; }).map(function (e) { return { src: 'ev', e: e }; });
    var tds = vals(F.todos().items).filter(function (x) { return x.due === date; }).map(function (x) { return { src: 'todo', e: { id: x.id, title: x.text, kind: 'task', subj: x.subj, done: x.done, date: x.due } }; });
    return evs.concat(tds).sort(function (a, b) { var ka = a.e.kind === 'deadline' ? 0 : a.e.start ? 1 : 2, kb = b.e.kind === 'deadline' ? 0 : b.e.start ? 1 : 2; return ka - kb || (toMin(a.e.start) || 0) - (toMin(b.e.start) || 0); });
  }
  function pill(it) {
    var e = it.e, cls = 'pill' + (e.kind === 'deadline' ? ' dl' : '') + (it.src === 'todo' ? ' task' : '') + (e.done ? ' dnx' : '');
    return '<div class="' + cls + '" style="--c:' + evCol(e) + '" data-src="' + it.src + '" data-id="' + esc(e.id) + '" tabindex="0" title="' + esc(e.title) + '">' +
      (e.kind === 'deadline' ? IC.flag.replace(/width="18" height="18"/, '') : e.kind === 'task' ? (e.done ? IC.check.replace(/width="18" height="18"/, '') : '') : '') +
      (e.start ? '<span class="tm">' + esc(e.start) + '</span>' : '') + '<span class="tt">' + esc(e.title) + '</span></div>';
  }
  RENDER.calendar = function (v) {
    var p = prefs(), view = p.calView === 'week' ? 'week' : 'month', a = parseISO(cAnchor);
    var title = view === 'month' ? MON[a.getMonth()] + ' ' + a.getFullYear() : (function () { var m = monday(cAnchor), e = addDays(m, 6), d1 = parseISO(m), d2 = parseISO(e); return d1.getDate() + ' ' + MON[d1.getMonth()].slice(0, 3) + ' – ' + d2.getDate() + ' ' + MON[d2.getMonth()].slice(0, 3) + ' ' + d2.getFullYear(); })();
    var h = '<div class="cbar"><h1>' + esc(title) + '</h1><div class="row"><button type="button" class="iconbtn" data-nav="-1" aria-label="Previous">' + IC.left + '</button><button type="button" class="btn" data-nav="0">Today</button><button type="button" class="iconbtn" data-nav="1" aria-label="Next">' + IC.right + '</button></div>' +
      '<div class="seg" role="group" aria-label="Calendar view" style="margin-left:auto"><button type="button" data-cv="month" aria-pressed="' + (view === 'month') + '">Month</button><button type="button" data-cv="week" aria-pressed="' + (view === 'week') + '">Week</button></div>' +
      '<button type="button" class="btn pr" data-newev>' + IC.plus + 'New</button></div><div class="cgrid"><div>';
    h += view === 'month' ? monthHTML() : weekHTML();
    h += '<div class="legend"><span><span class="pill" style="display:inline-flex;cursor:default">Event</span></span><span><span class="pill task" style="display:inline-flex;cursor:default">Task due</span></span><span><span class="pill dl" style="display:inline-flex;cursor:default">' + IC.flag.replace(/width="18" height="18"/, '') + 'Deadline</span></span>' + (view === 'week' ? '<span><span class="blk log" style="position:static;display:inline-block;width:40px;height:16px"></span>Focus you did</span>' : '<span>Drag to move · click a day to add</span>') + '</div></div>';
    h += '<aside class="card upc"><div class="ch"><h3>Upcoming deadlines</h3></div>' + upcomingHTML() + '</aside></div>';
    v.innerHTML = h;
    $$('[data-nav]', v).forEach(function (b) { b.onclick = function () { var n = +b.getAttribute('data-nav'); if (!n) cAnchor = today(); else if (view === 'month') { var d = parseISO(cAnchor); d.setDate(1); d.setMonth(d.getMonth() + n); cAnchor = iso(d); } else cAnchor = addDays(cAnchor, 7 * n); render(); }; });
    $$('[data-cv]', v).forEach(function (b) { b.onclick = function () { setPref('calView', b.getAttribute('data-cv')); render(); }; });
    $('[data-newev]', v).onclick = function () { evDlg(null, { date: view === 'month' && cAnchor.slice(0, 7) !== today().slice(0, 7) ? cAnchor : today() }); };
    $$('.upc [data-open]', v).forEach(function (x) { x.onclick = function () { evDlg(x.getAttribute('data-open')); }; });
    if (view === 'month') wireMonth(v); else wireWeek(v);
  };
  function monthHTML() {
    var a = parseISO(cAnchor), first = iso(new Date(a.getFullYear(), a.getMonth(), 1)), start = monday(first), t = today(), pd = perDay();
    var h = '<div class="card month"><div class="mhead">' + DOW.map(function (d) { return '<div>' + d + '</div>'; }).join('') + '</div><div class="mbody">';
    for (var i = 0; i < 42; i++) {
      var d = addDays(start, i), dd = parseISO(d), out = dd.getMonth() !== a.getMonth(), its = itemsOn(d), focus = pd[d] || 0;
      if (i === 35 && out) break;
      h += '<div class="mcell' + (out ? ' out' : '') + (d === t ? ' today' : '') + '" data-date="' + d + '" role="button" tabindex="0" aria-label="' + esc(niceDate(d, true)) + (its.length ? ', ' + its.length + ' item' + (its.length > 1 ? 's' : '') : '') + '">' +
        '<span class="dn">' + dd.getDate() + '</span>' + (focus >= 60 ? '<span class="heat" style="width:' + Math.min(40, 6 + focus / 360).toFixed(0) + 'px" title="' + mins(focus) + ' focused"></span>' : '') +
        its.slice(0, 3).map(pill).join('') + (its.length > 3 ? '<span class="more">+' + (its.length - 3) + ' more</span>' : '') + '</div>';
    }
    return h + '</div></div>';
  }
  function upcomingHTML() {
    var t = today(), dls = vals(cal().events).filter(function (e) { return e.kind === 'deadline' && !e.done && e.date >= t; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 8);
    if (!dls.length) return '<div class="empty" style="padding:14px 4px">' + IC.flag.replace(/width="18" height="18"/, '') + '<div class="small">No deadlines yet. Add exams, coursework and mocks so you can count down to them.</div></div>';
    return dls.map(function (e) { var n = daysBetween(t, e.date); return '<div class="it" data-open="' + esc(e.id) + '" role="button" tabindex="0"><span class="cd' + (n <= 3 ? ' soon' : '') + '">' + (n === 0 ? '!' : n) + '<small>' + (n === 0 ? 'today' : n === 1 ? 'day' : 'days') + '</small></span><span><b>' + esc(e.title) + '</b><br><span class="small muted">' + esc(niceDate(e.date, true)) + (e.start ? ' · ' + esc(e.start) : '') + '</span></span></div>'; }).join('');
  }
  /* drag a pill to another day (works with mouse, pen and touch) */
  function pillDrag(v, onDrop, onClick) {
    $$('.pill[data-id]', v).forEach(function (pl) {
      var sx, sy, moved, ghost = null, over = null, pid = null;
      pl.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; e.stopPropagation(); pid = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; try { pl.setPointerCapture(pid); } catch (x) {} });
      pl.addEventListener('pointermove', function (e) {
        if (pid !== e.pointerId) return;
        if (!moved && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) < 6) return;
        if (!moved) { moved = true; dragging = true; ghost = pl.cloneNode(true); ghost.classList.add('dragghost'); ghost.style.width = pl.offsetWidth + 'px'; document.body.appendChild(ghost); pl.style.opacity = '.35'; }
        ghost.style.left = (e.clientX - 20) + 'px'; ghost.style.top = (e.clientY - 12) + 'px';
        ghost.style.display = 'none'; var under = document.elementFromPoint(e.clientX, e.clientY); ghost.style.display = '';
        var cell = under && under.closest('[data-date]'); if (over !== cell) { if (over) over.classList.remove('drop'); over = cell; if (over) over.classList.add('drop'); }
      });
      var end = function (e) {
        if (pid !== e.pointerId) return; pid = null;
        if (moved) { dragging = false; if (ghost) ghost.remove(); pl.style.opacity = ''; if (over) { over.classList.remove('drop'); onDrop(pl.getAttribute('data-src'), pl.getAttribute('data-id'), over.getAttribute('data-date')); } else render(); }
        else if (e.type === 'pointerup') onClick(pl.getAttribute('data-src'), pl.getAttribute('data-id'));
      };
      pl.addEventListener('pointerup', end); pl.addEventListener('pointercancel', end);
      pl.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.stopPropagation(); onClick(pl.getAttribute('data-src'), pl.getAttribute('data-id')); } });
    });
  }
  function moveItem(src, id, date) {
    if (src === 'todo') F.setTodo(id, { due: date });
    else { var c = cal(); if (c.events[id]) { c.events[id].date = date; putJ(K.cal, c); } }
    render(); toast('Moved to ' + niceDate(date) + '.');
  }
  function openItem(src, id) { if (src === 'todo') taskDlg(id); else evDlg(id); }
  function wireMonth(v) {
    pillDrag(v, moveItem, openItem);
    $$('.mcell', v).forEach(function (c) {
      var open = function (e) { if (e && e.target.closest('.pill')) return; var d = c.getAttribute('data-date'), its = itemsOn(d); if (its.length > 3 && e && e.target.closest('.more')) dayDlg(d); else evDlg(null, { date: d }); };
      c.onclick = open; c.onkeydown = function (e) { if (e.key === 'Enter' && e.target === c) open(); };
    });
  }
  function dayDlg(d) {
    var m = modal('<h2>' + esc(niceDate(d, true)) + '</h2><div style="display:grid;gap:6px">' + itemsOn(d).map(pill).join('') + '</div><div class="foot"><button type="button" class="btn pr" data-add>' + IC.plus + 'Add to this day</button></div>');
    $$('.pill', m.box).forEach(function (p) { p.style.cursor = 'pointer'; p.onclick = function () { m.close(); openItem(p.getAttribute('data-src'), p.getAttribute('data-id')); }; });
    m.box.querySelector('[data-add]').onclick = function () { m.close(); evDlg(null, { date: d }); };
  }
  function weekHTML() {
    var m = monday(cAnchor), t = today(), days = []; for (var i = 0; i < 7; i++) days.push(addDays(m, i));
    var h = '<div class="card week" style="--hh:' + HH + 'px"><div class="wtop"><div></div>' + days.map(function (d) { var dd = parseISO(d); return '<div class="d' + (d === t ? ' today' : '') + '"><small>' + DOW[(dd.getDay() + 6) % 7] + '</small><b>' + dd.getDate() + '</b></div>'; }).join('') + '</div>';
    h += '<div class="wall"><div>all day</div>' + days.map(function (d) { return '<div data-date="' + d + '">' + itemsOn(d).filter(function (x) { return !x.e.start; }).map(pill).join('') + '</div>'; }).join('') + '</div>';
    h += '<div class="wscroll" id="wscroll"><div class="wbody"><div class="hrs">' + Array.apply(null, Array(24)).map(function (_, i) { return '<div>' + (i ? pad(i) + ':00' : '') + '</div>'; }).join('') + '</div>';
    var logs = sessions();
    days.forEach(function (d) {
      h += '<div class="wcol' + (d === t ? ' today' : '') + '" data-day="' + d + '" style="height:' + 24 * HH + 'px">';
      // focus you actually did, shown faintly behind your plans
      logs.forEach(function (s) { if (iso(new Date(s.t)) !== d) return; var st = new Date(s.t), a = st.getHours() * 60 + st.getMinutes(), b = Math.min(1440, a + Math.max(15, (s.end - s.t) / 60000)); h += '<div class="blk log" style="top:' + (a * HH / 60) + 'px;height:' + ((b - a) * HH / 60) + 'px;--c:' + subjCol(s.subj) + '" title="Focus: ' + esc(s.label || subjName(s.subj) || 'session') + ' · ' + mins(s.studied) + '"><span class="tm">' + hm(s.t) + '</span>' + esc(s.label || 'Focus') + '</div>'; });
      var timed = itemsOn(d).filter(function (x) { return x.e.start; }), lanes = layout(timed.map(function (x) { return x.e; }));
      timed.forEach(function (x) {
        var e = x.e, a = toMin(e.start), b = Math.max(a + 15, toMin(e.end) || a + 60), L = lanes[e.id] || { i: 0, n: 1 };
        h += '<div class="blk" data-src="' + x.src + '" data-id="' + esc(e.id) + '" tabindex="0" style="top:' + (a * HH / 60) + 'px;height:' + ((b - a) * HH / 60 - 2) + 'px;left:calc(' + (100 * L.i / L.n) + '% + 3px);right:auto;width:calc(' + (100 / L.n) + '% - 6px);--c:' + evCol(e) + '"><span class="tm">' + esc(e.start) + (e.end ? '–' + esc(e.end) : '') + '</span>' + (e.kind === 'deadline' ? '⚑ ' : '') + esc(e.title) + '<span class="rz" data-rz></span></div>';
      });
      if (d === t) { var n = new Date(), nm = n.getHours() * 60 + n.getMinutes(); h += '<div class="now" style="top:' + (nm * HH / 60) + 'px"></div>'; }
      h += '</div>';
    });
    return h + '</div></div></div>';
  }
  /* side-by-side lanes for overlapping events */
  function layout(evs) {
    var out = {}, sorted = evs.slice().sort(function (a, b) { return toMin(a.start) - toMin(b.start); }), group = [], gEnd = -1;
    function flush() { var lanes = []; group.forEach(function (e) { var s = toMin(e.start), i = 0; while (lanes[i] > s) i++; lanes[i] = Math.max(s + 15, toMin(e.end) || s + 60); out[e.id] = { i: i }; }); group.forEach(function (e) { out[e.id].n = lanes.length; }); group = []; }
    sorted.forEach(function (e) { var s = toMin(e.start), en = Math.max(s + 15, toMin(e.end) || s + 60); if (s >= gEnd) { flush(); gEnd = en; } else gEnd = Math.max(gEnd, en); group.push(e); });
    flush(); return out;
  }
  var scrollKeep = null;
  function wireWeek(v) {
    var sc = $('#wscroll', v); sc.scrollTop = scrollKeep != null ? scrollKeep : 7.5 * HH; sc.onscroll = function () { scrollKeep = sc.scrollTop; };
    pillDrag(v, moveItem, openItem);
    var snap = function (y) { return Math.round(y / HH * 4) * 15; };
    // drag on empty space to make an event of that length
    $$('.wcol', v).forEach(function (col) {
      col.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || e.target !== col) return;
        if (e.pointerType === 'touch') return; // on touch, a tap adds (below) so the page can still scroll
        e.preventDefault(); dragging = true;
        var r0 = col.getBoundingClientRect(), a = snap(e.clientY - r0.top), b = a + 60, nb = document.createElement('div'); nb.className = 'blk new'; col.appendChild(nb);
        var paint = function () { var lo = Math.min(a, b), hi = Math.max(a, b); nb.style.top = lo * HH / 60 + 'px'; nb.style.height = Math.max(15, hi - lo) * HH / 60 + 'px'; nb.textContent = fromMin(lo) + '–' + fromMin(hi); };
        paint(); col.setPointerCapture(e.pointerId);
        var mv = function (ev) { var y = snap(ev.clientY - col.getBoundingClientRect().top); b = y === a ? a + 15 : y; paint(); };
        var up = function () { col.removeEventListener('pointermove', mv); col.removeEventListener('pointerup', up); dragging = false; nb.remove(); var lo = Math.min(a, b), hi = Math.max(a, b); if (hi - lo < 15) hi = lo + 60; evDlg(null, { date: col.getAttribute('data-day'), start: fromMin(lo), end: fromMin(Math.min(1439, hi)) }); };
        col.addEventListener('pointermove', mv); col.addEventListener('pointerup', up);
      });
      col.addEventListener('click', function (e) { var pt = e.pointerType; if (e.target !== col || (pt ? pt !== 'touch' : !matchMedia('(pointer:coarse)').matches)) return; var m = snap(e.clientY - col.getBoundingClientRect().top - HH / 2); evDlg(null, { date: col.getAttribute('data-day'), start: fromMin(m), end: fromMin(m + 60) }); });
    });
    // move a block (any day, any time) or stretch it from the bottom edge
    $$('.blk[data-id]', v).forEach(function (bk) {
      bk.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return; e.stopPropagation();
        var id = bk.getAttribute('data-id'), ev = cal().events[id]; if (!ev) return;
        var resize = !!e.target.closest('[data-rz]'), sx = e.clientX, sy = e.clientY, moved = false, a0 = toMin(ev.start), b0 = Math.max(a0 + 15, toMin(ev.end) || a0 + 60), day = ev.date, na = a0, nb2 = b0;
        try { bk.setPointerCapture(e.pointerId); } catch (x) {}
        var mv = function (m) {
          var dy = m.clientY - sy, dx = m.clientX - sx; if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
          if (!moved) { moved = true; dragging = true; bk.classList.add('sel'); }
          var dm = Math.round(dy / HH * 4) * 15;
          if (resize) { nb2 = Math.max(a0 + 15, Math.min(1440, b0 + dm)); bk.style.height = ((nb2 - a0) * HH / 60 - 2) + 'px'; bk.querySelector('.tm').textContent = fromMin(a0) + '–' + fromMin(nb2); return; }
          na = Math.max(0, Math.min(1440 - (b0 - a0), a0 + dm)); nb2 = na + (b0 - a0);
          bk.style.top = na * HH / 60 + 'px'; bk.querySelector('.tm').textContent = fromMin(na) + '–' + fromMin(nb2);
          bk.style.visibility = 'hidden'; var under = document.elementFromPoint(m.clientX, m.clientY); bk.style.visibility = '';
          var c2 = under && under.closest('.wcol'); if (c2 && c2.getAttribute('data-day') !== day) { day = c2.getAttribute('data-day'); c2.appendChild(bk); }
        };
        var up = function () {
          bk.removeEventListener('pointermove', mv); bk.removeEventListener('pointerup', up); bk.removeEventListener('pointercancel', up);
          if (!moved) { evDlg(id); return; }
          dragging = false; var c = cal(); if (c.events[id]) { c.events[id].date = day; c.events[id].start = fromMin(na); c.events[id].end = fromMin(Math.min(1439, nb2)); putJ(K.cal, c); } render();
        };
        bk.addEventListener('pointermove', mv); bk.addEventListener('pointerup', up); bk.addEventListener('pointercancel', up);
      });
      bk.addEventListener('keydown', function (e) { if (e.key === 'Enter') evDlg(bk.getAttribute('data-id')); });
    });
    // all-day row accepts dropped pills
    $$('.wall [data-date]', v).forEach(function (c) { c.addEventListener('click', function (e) { if (e.target === c) evDlg(null, { date: c.getAttribute('data-date') }); }); });
  }
  function evDlg(id, preset) {
    var c = cal(), e = id ? c.events[id] : Object.assign({ title: '', kind: 'event', date: today(), start: '', end: '', subj: '', color: '', note: '', done: false }, preset || {});
    if (!e) return;
    var allDay = !e.start;
    var m = modal('<h2>' + (id ? 'Edit' : 'Add to your calendar') + '</h2><div class="fields">' +
      '<div class="seg" role="group" aria-label="Type" style="justify-self:start">' + [['event', 'Event'], ['task', 'Study block'], ['deadline', 'Deadline']].map(function (k) { return '<button type="button" data-k="' + k[0] + '" aria-pressed="' + (e.kind === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div>' +
      '<div><label class="f" for="cT">Title</label><input type="text" id="cT" maxlength="120" autofocus value="' + esc(e.title) + '" placeholder="e.g. Physics Paper 2 mock"></div>' +
      '<div class="row"><div class="grow"><label class="f" for="cD">Date</label><input type="date" id="cD" value="' + esc(e.date) + '"></div>' +
      '<label class="row" style="gap:8px;margin-top:18px;cursor:pointer"><input type="checkbox" class="check" id="cAll"' + (allDay ? ' checked' : '') + '>All day</label></div>' +
      '<div class="row" id="cTimes"' + (allDay ? ' hidden' : '') + '><div class="grow"><label class="f" for="cS">Starts</label><input type="time" id="cS" step="300" value="' + esc(e.start || '16:00') + '"></div><div class="grow"><label class="f" for="cE">Ends</label><input type="time" id="cE" step="300" value="' + esc(e.end || (e.start ? fromMin(toMin(e.start) + 60) : '17:00')) + '"></div></div>' +
      '<div><div class="f" style="font-size:12.5px;font-weight:600;color:var(--muted);margin-bottom:6px">Subject</div>' + subjChips('cs', e.subj || '', true) + '</div>' +
      '<div><label class="f" for="cN">Notes</label><textarea id="cN" maxlength="2000" style="min-height:70px">' + esc(e.note || '') + '</textarea></div>' +
      (id ? '<label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" class="check" id="cDone"' + (e.done ? ' checked' : '') + '>Done</label>' : '') +
      (!id ? '<div class="row"><label class="f" for="cRep" style="margin:0">Repeat weekly for</label><select id="cRep" style="width:auto"><option value="0">no repeat</option>' + [2, 3, 4, 6, 8, 12].map(function (n) { return '<option value="' + n + '">' + n + ' weeks</option>'; }).join('') + '</select></div>' : '') +
      '</div><div class="foot">' + (id ? '<button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete</button>' + (e.kind !== 'deadline' && e.date === today() && !F.run() ? '<button type="button" class="btn" data-go>' + IC.focus + 'Focus now</button>' : '') : '') +
      '<button type="button" class="btn pr" data-s>' + (id ? 'Save' : 'Add') + '</button></div>');
    var kind = e.kind;
    $$('[data-k]', m.box).forEach(function (b) { b.onclick = function () { kind = b.getAttribute('data-k'); $$('[data-k]', m.box).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }; });
    $('#cAll', m.box).onchange = function () { $('#cTimes', m.box).hidden = this.checked; };
    $('#cS', m.box).onchange = function () { var s = toMin(this.value), en = toMin($('#cE', m.box).value); if (en <= s) $('#cE', m.box).value = fromMin(s + 60); };
    wireChips(m.box, 'cs', function () {});
    m.box.querySelector('[data-s]').onclick = function () {
      var t = $('#cT', m.box).value.trim(); if (!t) return $('#cT', m.box).focus();
      var d = $('#cD', m.box).value || today(), all = $('#cAll', m.box).checked, s = all ? '' : $('#cS', m.box).value, en = all ? '' : $('#cE', m.box).value;
      if (s && en && toMin(en) <= toMin(s)) en = fromMin(toMin(s) + 60);
      var c2 = cal(), base = { title: t.slice(0, 120), kind: kind, date: d, start: s, end: en, subj: chipVal(m.box, 'cs'), note: $('#cN', m.box).value.trim(), done: id ? $('#cDone', m.box).checked : false };
      if (id) { c2.events[id] = Object.assign(c2.events[id] || { id: id, t: Date.now() }, base); }
      else { var rep = +(($('#cRep', m.box) || {}).value || 0); for (var i = 0; i < Math.max(1, rep); i++) { var nid = uid() + i; c2.events[nid] = Object.assign({ id: nid, t: Date.now() }, base, { date: addDays(d, 7 * i) }); } }
      putJ(K.cal, c2); m.close(); render(); toast(id ? 'Saved.' : kind === 'deadline' ? 'Deadline added. The countdown is on.' : 'Added to your calendar.');
    };
    $('#cT', m.box).onkeydown = function (ev) { if (ev.key === 'Enter') m.box.querySelector('[data-s]').click(); };
    var del = m.box.querySelector('[data-del]'); if (del) del.onclick = function () { var c2 = cal(), old = c2.events[id]; delete c2.events[id]; putJ(K.cal, c2); m.close(); render(); toast('Deleted.', 'Undo', function () { var c3 = cal(); c3.events[id] = old; putJ(K.cal, c3); render(); }); };
    var go = m.box.querySelector('[data-go]'); if (go) go.onclick = function () {
      m.close(); var o = { label: e.title, subj: e.subj }; var len = e.start && e.end ? toMin(e.end) - toMin(e.start) : prefs().min; o.min = Math.max(5, Math.min(240, len));
      F.start(o); location.hash = '#focus'; render();
    };
  }

  /* ======================================================================
     GOALS
     ====================================================================== */
  RENDER.goals = function (v) {
    var g = goals(), mon = monday(today()), wk = weekSec(mon), tgt = g.weekly * 60, pd = perDay(), pct = tgt ? Math.min(1, wk / tgt) : 0;
    var items = vals(g.items).sort(function (a, b) { return (a.done ? 1 : 0) - (b.done ? 1 : 0) || (a.due || '9') .localeCompare(b.due || '9') || a.t - b.t; });
    var max = 1; for (var i = 0; i < 7; i++) max = Math.max(max, pd[addDays(mon, i)] || 0, tgt / 7);
    var h = '<div class="vhead"><div><h1>Goals</h1><p>Set a weekly focus target and the bigger things you are working towards.</p></div></div><div class="ggrid"><div class="card target">' +
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#2186d8"/></linearGradient></defs></svg>' +
      '<h2>This week</h2><div class="big-ring"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="trk" cx="100" cy="100" r="86"/><circle class="arc" cx="100" cy="100" r="86" stroke-dasharray="540.4" stroke-dashoffset="' + (540.4 * (1 - pct)).toFixed(1) + '"' + (pct ? '' : ' style="opacity:0"') + '/></svg><div class="in"><b>' + mins(wk) + '</b><span class="muted small">of ' + mins(tgt) + '</span></div></div>' +
      '<p class="small muted" style="margin:0">' + (pct >= 1 ? 'Target hit! 🎉 Anything more is a bonus.' : mins(Math.max(0, tgt - wk)) + ' to go · about ' + mins(Math.max(0, tgt - wk) / Math.max(1, 7 - (new Date().getDay() + 6) % 7)) + ' a day for the rest of the week') + '</p>' +
      '<div class="wbars">' + DOW.map(function (_, i) { var s = pd[addDays(mon, i)] || 0; return '<div style="height:100%" title="' + DOW[i] + ': ' + mins(s) + '"><i style="height:' + (100 * s / max).toFixed(1) + '%"></i></div>'; }).join('') + '</div><div class="wlab">' + DOW.map(function (d) { return '<span>' + d[0] + '</span>'; }).join('') + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:16px"><label class="f" for="wT" style="margin:0">Weekly target</label><span class="stepper"><button type="button" data-wt="-1" aria-label="One hour less">−</button><input type="number" id="wT" min="1" max="80" value="' + Math.round(g.weekly / 60) + '"><button type="button" data-wt="1" aria-label="One hour more">+</button></span><span class="muted small">hours</span></div></div>';
    h += '<div><div class="card" style="margin-bottom:16px"><form id="gAdd" class="row"><input type="text" name="t" class="grow" style="width:auto;flex:1 1 220px" maxlength="120" placeholder="New goal, e.g. Get an A* in Physics Paper 1" aria-label="New goal"><input type="date" name="due" style="width:auto" aria-label="Target date"><button class="btn pr" type="submit">' + IC.plus + 'Add goal</button></form></div>';
    if (!items.length) h += '<div class="card empty">' + IC.focus.replace(/width="18" height="18"/, '') + '<div>No goals yet. Big or small, write one down — goals you can see are goals you reach.</div></div>';
    items.forEach(function (x) {
      var st = vals(x.steps).sort(function (a, b) { return a.o - b.o; }), dn = st.filter(function (s) { return s.done; }).length, p = x.done ? 100 : st.length ? 100 * dn / st.length : 0, n = x.due ? daysBetween(today(), x.due) : null;
      h += '<div class="card goal' + (x.done ? ' ach' : '') + '" data-g="' + esc(x.id) + '"><div class="gt"><input type="checkbox" class="check pop" data-gdone aria-label="Achieved"' + (x.done ? ' checked' : '') + ' style="margin-top:3px"><h3>' + esc(x.text) + '</h3>' +
        (n != null && !x.done ? '<span class="tag' + (n < 0 ? ' bad' : n <= 7 ? ' warn' : '') + '">' + (n < 0 ? -n + 'd overdue' : n === 0 ? 'today' : n + ' days left') + '</span>' : '') + (x.done ? '<span class="tag ok">achieved</span>' : '') +
        '<button type="button" class="btn sm ghost" data-gedit aria-label="Edit">' + IC.edit + '</button></div>' +
        (x.why ? '<p class="small muted" style="margin:6px 0 0 32px;white-space:pre-wrap">' + esc(x.why) + '</p>' : '') +
        (st.length ? '<div class="prog"><i style="width:' + p.toFixed(0) + '%"></i></div><div class="small muted">' + dn + ' of ' + st.length + ' steps</div>' : '') +
        '<ul class="steps">' + st.map(function (s) { return '<li class="' + (s.done ? 'dn' : '') + '"><input type="checkbox" class="check pop" data-step="' + esc(s.id) + '"' + (s.done ? ' checked' : '') + ' aria-label="Step done"><span>' + esc(s.text) + '</span><button type="button" class="btn sm ghost x" data-sdel="' + esc(s.id) + '" aria-label="Remove step">' + IC.x + '</button></li>'; }).join('') + '</ul>' +
        (!x.done ? '<form class="row" data-sadd style="margin-top:6px"><input type="text" class="grow" style="width:auto" maxlength="120" placeholder="Add a step…" aria-label="Add a step"><button class="btn sm" type="submit">' + IC.plus + '</button></form>' : '') + '</div>';
    });
    v.innerHTML = h + '</div></div>';
    var setW = function (hrs) { var g2 = goals(); g2.weekly = Math.max(1, Math.min(80, Math.round(hrs) || 10)) * 60; putJ(K.goals, g2); render(); };
    $$('[data-wt]', v).forEach(function (b) { b.onclick = function () { setW(goals().weekly / 60 + +b.getAttribute('data-wt')); }; });
    $('#wT', v).onchange = function () { setW(+this.value); };
    var f = $('#gAdd', v); f.onsubmit = function (e) { e.preventDefault(); var t = f.t.value.trim(); if (!t) return; var g2 = goals(), id = uid(); g2.items[id] = { id: id, text: t, due: f.due.value || null, why: '', done: false, t: Date.now(), steps: {} }; putJ(K.goals, g2); render(); var j = $('#v-goals [data-g="' + id + '"] [data-sadd] input'); if (j) j.focus(); };
    $$('[data-g]', v).forEach(function (card) {
      var id = card.getAttribute('data-g');
      var upd = function (fn) { var g2 = goals(); if (!g2.items[id]) return; fn(g2.items[id]); putJ(K.goals, g2); };
      card.querySelector('[data-gdone]').onchange = function () { var c = this; upd(function (x) { x.done = c.checked; x.doneAt = c.checked ? Date.now() : null; }); if (c.checked) { var b = c.getBoundingClientRect(); confetti(b.left + 10, b.top); toast('Goal achieved. Proud of you!'); } setTimeout(render, c.checked ? 500 : 0); };
      $$('[data-step]', card).forEach(function (c) { c.onchange = function () { var sid = c.getAttribute('data-step'); upd(function (x) { if (x.steps[sid]) x.steps[sid].done = c.checked; }); render(); }; });
      $$('[data-sdel]', card).forEach(function (b) { b.onclick = function () { var sid = b.getAttribute('data-sdel'); upd(function (x) { delete x.steps[sid]; }); render(); }; });
      var sf = card.querySelector('[data-sadd]'); if (sf) sf.onsubmit = function (e) { e.preventDefault(); var i = sf.querySelector('input'), t = i.value.trim(); if (!t) return; var sid = uid(); upd(function (x) { x.steps = x.steps || {}; x.steps[sid] = { id: sid, text: t.slice(0, 120), done: false, o: Date.now() }; }); render(); var j = $('#v-goals [data-g="' + id + '"] [data-sadd] input'); if (j) j.focus(); };
      card.querySelector('[data-gedit]').onclick = function () { goalDlg(id); };
    });
  };
  function goalDlg(id) {
    var x = goals().items[id]; if (!x) return;
    var m = modal('<h2>Edit goal</h2><div class="fields"><div><label class="f" for="gT">Goal</label><input type="text" id="gT" maxlength="120" value="' + esc(x.text) + '"></div><div><label class="f" for="gD">Target date</label><input type="date" id="gD" value="' + esc(x.due || '') + '"></div>' +
      '<div><label class="f" for="gW">Why it matters to you</label><textarea id="gW" maxlength="1000" placeholder="Remind future you why this is worth it.">' + esc(x.why || '') + '</textarea></div></div>' +
      '<div class="foot"><button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete goal</button><button type="button" class="btn pr" data-s>Save</button></div>');
    m.box.querySelector('[data-s]').onclick = function () { var g = goals(), t = $('#gT', m.box).value.trim(); if (!t) return; Object.assign(g.items[id], { text: t, due: $('#gD', m.box).value || null, why: $('#gW', m.box).value.trim() }); putJ(K.goals, g); m.close(); render(); };
    m.box.querySelector('[data-del]').onclick = function () { if (!confirm('Delete this goal and its steps?')) return; var g = goals(); delete g.items[id]; putJ(K.goals, g); m.close(); render(); };
  }

  /* ======================================================================
     NOTES & DEVELOPMENTS
     ====================================================================== */
  var nQuery = '';
  RENDER.notes = function (v) {
    var tab = prefs().noteTab === 'dev' ? 'dev' : 'notes';
    var h = '<div class="vhead"><div><h1>Notes</h1><p>Jot ideas, keep reminders, and track how you are developing.</p></div><div class="seg" role="group" aria-label="Notes or developments"><button type="button" data-nt="notes" aria-pressed="' + (tab === 'notes') + '">Notes</button><button type="button" data-nt="dev" aria-pressed="' + (tab === 'dev') + '">Developments</button></div></div>';
    if (tab === 'notes') {
      var all = vals(notes().items), q = nQuery.toLowerCase(), list = all.filter(function (n) { return !q || (n.title + ' ' + n.body).toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.upd || 0) - (a.upd || 0); });
      h += '<div class="row" style="margin-bottom:16px"><input type="search" id="nQ" class="grow" style="width:auto;flex:1 1 200px" placeholder="Search notes" aria-label="Search notes" value="' + esc(nQuery) + '"><button type="button" class="btn pr" data-newnote>' + IC.plus + 'New note</button></div>';
      if (!list.length) h += '<div class="card empty">' + IC.edit.replace(/width="18" height="18"/, '') + '<div>' + (all.length ? 'No notes match.' : 'No notes yet. Use them for formulas you keep forgetting, plans, or anything on your mind.') + '</div></div>';
      else h += '<div class="ngrid">' + list.map(function (n) { return '<div class="card note" data-n="' + esc(n.id) + '" tabindex="0" role="button" style="--c:' + esc(n.color || 'transparent') + '">' + (n.pin ? '<span class="pin" title="Pinned">' + IC.pin + '</span>' : '') + '<h3>' + esc(n.title || 'Untitled') + '</h3><p>' + esc(n.body) + '</p><small>' + esc(rel(iso(new Date(n.upd || n.t)))) + '</small></div>'; }).join('') + '</div>';
    } else {
      var L = vals(log()).filter(function (e) { return e.kind === 'dev' || (e.kind === 'session' && (e.note || e.dev)); }).sort(function (a, b) { return b.t - a.t; });
      h += '<div class="card" style="margin-bottom:18px"><form id="dAdd"><label class="f" for="dT">Log a development</label><textarea id="dT" maxlength="2000" placeholder="A breakthrough, a struggle, feedback from a teacher, a mark you got… e.g. Finally get moments! 14/16 on the mechanics test." style="min-height:80px"></textarea>' +
        '<div class="row" style="margin-top:10px"><div class="chips" data-chips="dk">' + [['win', '🏆 Win'], ['struggle', '🧗 Struggle'], ['note', '📝 Note']].map(function (k, i) { return '<button type="button" class="chip" data-v="' + k[0] + '" aria-pressed="' + (i === 0) + '">' + k[1] + '</button>'; }).join('') + '</div>' +
        '<select id="dS" style="width:auto"><option value="">No subject</option>' + SUBJ.map(function (s) { return '<option value="' + s[0] + '">' + esc(s[1]) + '</option>'; }).join('') + '</select><button class="btn pr" type="submit" style="margin-left:auto">' + IC.plus + 'Add</button></div></form></div>';
      if (!L.length) h += '<div class="card empty"><div>Your journey shows up here: wins, struggles, and what you wrote after focus sessions.</div></div>';
      else {
        var day = '', html = '<div class="tl">';
        L.forEach(function (e) {
          var d = iso(new Date(e.t)); if (d !== day) { day = d; html += '<div class="day">' + esc(rel(d) === 'Today' || rel(d) === 'Yesterday' ? rel(d) : niceDate(d, true)) + '</div>'; }
          var col = e.kind === 'session' ? 'var(--acc)' : e.dk === 'win' ? 'var(--ok)' : e.dk === 'struggle' ? 'var(--warn)' : 'var(--faint)';
          html += '<div class="card ent" style="--c:' + col + '"><div class="eh">' + (e.kind === 'session' ? '<b>Focus · ' + mins(e.studied) + '</b>' + (e.label ? '<span class="muted">' + esc(e.label) + '</span>' : '') + (e.result ? '<span class="res ' + e.result + '">' + { y: 'Nailed it', p: 'Partly', n: 'Not really' }[e.result] + '</span>' : '') : '<b>' + { win: '🏆 Win', struggle: '🧗 Struggle', note: '📝 Note' }[e.dk || 'note'] + '</b>') +
            (e.subj ? '<span class="tag" style="--c:' + subjCol(e.subj) + '"><i></i>' + esc(subjName(e.subj)) + '</span>' : '') + '<span class="small muted">' + hm(e.t) + '</span>' +
            (e.kind === 'dev' ? '<button type="button" class="btn sm ghost danger del" data-ddel="' + esc(e.id) + '" aria-label="Delete">' + IC.trash + '</button>' : '') + '</div>' +
            (e.goal && e.kind === 'session' ? '<div class="small muted" style="margin-top:4px">Goal: ' + esc(e.goal) + '</div>' : '') + (e.note || e.text ? '<p>' + esc(e.note || e.text) + '</p>' : '') + '</div>';
        });
        h += html + '</div>';
      }
    }
    v.innerHTML = h;
    $$('[data-nt]', v).forEach(function (b) { b.onclick = function () { setPref('noteTab', b.getAttribute('data-nt')); render(); }; });
    if (tab === 'notes') {
      var qi = $('#nQ', v); qi.oninput = function () { nQuery = qi.value; var pos = qi.selectionStart; render(); var j = $('#nQ'); j.focus(); j.setSelectionRange(pos, pos); };
      $('[data-newnote]', v).onclick = function () { noteDlg(null); };
      $$('[data-n]', v).forEach(function (c) { c.onclick = function () { noteDlg(c.getAttribute('data-n')); }; c.onkeydown = function (e) { if (e.key === 'Enter') noteDlg(c.getAttribute('data-n')); }; });
    } else {
      wireChips(v, 'dk', function () {});
      $('#dAdd', v).onsubmit = function (e) { e.preventDefault(); var t = $('#dT', v).value.trim(); if (!t) return $('#dT', v).focus(); var L = log(), id = uid(); L[id] = { id: id, kind: 'dev', t: Date.now(), text: t, dk: chipVal(v, 'dk') || 'note', subj: $('#dS', v).value }; putJ(K.log, L); render(); toast('Logged. Keep going.'); };
      $$('[data-ddel]', v).forEach(function (b) { b.onclick = function () { var L = log(), id = b.getAttribute('data-ddel'), old = L[id]; delete L[id]; putJ(K.log, L); render(); toast('Deleted.', 'Undo', function () { var L2 = log(); L2[id] = old; putJ(K.log, L2); render(); }); }; });
    }
  };
  function noteDlg(id) {
    var n = id ? notes().items[id] : null, nid = id || uid(), color = n ? n.color || '' : '', pin = n ? !!n.pin : false, saved = !!n, tmr = null, gone = false, m = null;
    var save = function () {
      if (gone || !m) return;
      var t = $('#nT', m.box).value.trim(), b = $('#nB', m.box).value; if (!t && !b.trim() && !saved) return;
      var N = notes(), cur = N.items[nid] || { id: nid, t: Date.now() };
      if (saved && N.items[nid] && cur.title === t.slice(0, 120) && cur.body === b && (cur.color || '') === color && !!cur.pin === pin) return; // nothing changed
      N.items[nid] = Object.assign(cur, { title: t.slice(0, 120), body: b, color: color, pin: pin, upd: Date.now() }); putJ(K.notes, N); saved = true;
      var s2 = $('#nSaved', m.box); if (s2) s2.textContent = 'Saved';
    };
    m = modal('<div class="fields"><input type="text" id="nT" maxlength="120" placeholder="Title" value="' + esc(n ? n.title : '') + '" style="font:700 20px var(--f-display);border:0;padding:4px 0;background:transparent;box-shadow:none" aria-label="Title">' +
      '<textarea id="nB" class="bigtext" maxlength="20000" placeholder="Start writing…" aria-label="Note">' + esc(n ? n.body : '') + '</textarea>' +
      '<div class="row"><div class="swatches">' + ['', '#2186d8', '#7a5af5', '#e0457b', '#f08a24', '#e0b100', '#17a273'].map(function (c) { return '<button type="button" class="' + (c ? '' : 'none') + '" style="--c:' + (c || 'transparent') + '" data-c="' + c + '" aria-label="' + (c ? 'Colour' : 'No colour') + '" aria-pressed="' + (c === color) + '"></button>'; }).join('') + '</div>' +
      '<label class="row" style="gap:8px;margin-left:auto;cursor:pointer"><input type="checkbox" class="check" id="nP"' + (pin ? ' checked' : '') + '>Pin to top</label></div></div>' +
      '<div class="foot">' + (id ? '<button type="button" class="btn ghost danger left" data-del>' + IC.trash + 'Delete</button>' : '') + '<span class="small muted" id="nSaved" style="align-self:center">' + (id ? 'Saved' : '') + '</span><button type="button" class="btn pr" data-done>Done</button></div>', 'wide',
      function () { clearTimeout(tmr); save(); gone = true; render(); });
    var later = function () { var s2 = $('#nSaved', m.box); if (s2) s2.textContent = 'Saving…'; clearTimeout(tmr); tmr = setTimeout(save, 500); };
    $('#nT', m.box).oninput = later; $('#nB', m.box).oninput = later;
    var sw = m.box.querySelector('.swatches'); sw.onclick = function (e) { var b = e.target.closest('[data-c]'); if (!b) return; color = b.getAttribute('data-c'); $$('[data-c]', sw).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); save(); };
    $('#nP', m.box).onchange = function () { pin = this.checked; save(); };
    m.box.querySelector('[data-done]').onclick = m.close;
    var del = m.box.querySelector('[data-del]'); if (del) del.onclick = function () { if (!confirm('Delete this note?')) return; clearTimeout(tmr); gone = true; var N = notes(); delete N.items[nid]; putJ(K.notes, N); m.close(); };
    setTimeout(function () { (id ? $('#nB', m.box) : $('#nT', m.box)).focus(); }, 40);
  }

  /* ======================================================================
     PROGRESS
     ====================================================================== */
  RENDER.progress = function (v) {
    var S = sessions(), pd = perDay(), t = today(), mon = monday(t), wk = weekSec(mon), lastWk = weekSec(addDays(mon, -7));
    var total = S.reduce(function (a, s) { return a + (s.studied || 0); }, 0), best = 0, bestDay = null;
    Object.keys(pd).forEach(function (d) { if (pd[d] > best) { best = pd[d]; bestDay = d; } });
    var h = '<div class="vhead"><div><h1>Progress</h1><p>Every focus session you finish is counted here — and in your study league.</p></div></div>' +
      '<div class="stats">' + [
        ['Today', mins(pd[t] || 0), ''], ['This week', mins(wk), lastWk ? (wk >= lastWk ? '▲ ' : '▼ ') + mins(Math.abs(wk - lastWk)) + ' vs last' : ''],
        ['Streak', streak() + '<small> day' + (streak() === 1 ? '' : 's') + '</small>', '10+ min a day'], ['Sessions', String(S.length), mins(total) + ' in all'],
        ['Average', S.length ? mins(total / S.length) : '—', 'per session'], ['Best day', best ? mins(best) : '—', bestDay ? niceDate(bestDay) : '']
      ].map(function (s) { return '<div class="card stat"><div class="k">' + s[0] + '</div><div class="v">' + s[1] + '</div><div class="small muted">' + s[2] + '</div></div>'; }).join('') + '</div>';
    // last 28 days, stacked by subject
    var days = []; for (var i = 27; i >= 0; i--) days.push(addDays(t, -i));
    var by = {}; S.forEach(function (s) { var d = iso(new Date(s.t)); by[d] = by[d] || {}; var k = s.subj || 'none'; by[d][k] = (by[d][k] || 0) + s.studied; });
    var r = F.run(); if (r) { by[t] = by[t] || {}; var k0 = r.subj || 'none'; by[t][k0] = (by[t][k0] || 0) + Math.round(F.studiedMs(r, F.elapsed(r)) / 1000); }
    var mx = 3600; days.forEach(function (d) { var s = 0; for (var k in by[d] || {}) s += by[d][k]; mx = Math.max(mx, s); }); mx = Math.ceil(mx / 3600) * 3600;
    var W = 700, H = 220, bw = W / 28, svg = '<svg viewBox="0 -10 ' + W + ' ' + (H + 34) + '" role="img" aria-label="Focus per day over the last four weeks">';
    for (var gl = 0; gl <= mx; gl += mx / (mx / 3600 > 4 ? 4 : mx / 3600)) { var y = H - H * gl / mx; svg += '<line class="gl" x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="' + W + '" y="' + (y - 3) + '" text-anchor="end">' + (gl / 3600) + 'h</text>'; }
    days.forEach(function (d, i) {
      var y0 = H, parts = by[d] || {};
      Object.keys(parts).forEach(function (k) { var hh = H * parts[k] / mx; svg += '<rect x="' + (i * bw + 3) + '" y="' + (y0 - hh) + '" width="' + (bw - 6) + '" height="' + hh + '" rx="3" fill="' + (k === 'none' ? 'var(--acc)' : subjCol(k)) + '"><title>' + esc(niceDate(d)) + ': ' + mins(parts[k]) + (k !== 'none' ? ' ' + esc(subjName(k)) : '') + '</title></rect>'; y0 -= hh; });
      if (i % 7 === 0 || i === 27) svg += '<text class="ax" x="' + (i * bw + bw / 2) + '" y="' + (H + 18) + '" text-anchor="middle">' + esc(i === 27 ? 'Today' : niceDate(d).replace(/^\w+ /, '')) + '</text>';
    });
    svg += '</svg>';
    h += '<div class="pgrid"><div class="card chart"><div class="ch"><h2>Last 4 weeks</h2></div>' + (S.length || r ? svg : '<div class="empty">Finish a focus session to see your chart grow.</div>') + '</div>';
    // subjects this week
    var subT = {}, wsum = 0; S.forEach(function (s) { if (iso(new Date(s.t)) >= mon) { var k = s.subj || 'none'; subT[k] = (subT[k] || 0) + s.studied; wsum += s.studied; } });
    var hrs = Array(24).fill(0); S.forEach(function (s) { var hr = new Date(s.t).getHours(); hrs[hr] += s.studied; }); var hmx = Math.max.apply(null, hrs) || 1;
    h += '<div class="card"><h2 style="margin-bottom:10px">Subjects this week</h2>' + (wsum ? Object.keys(subT).sort(function (a, b) { return subT[b] - subT[a]; }).map(function (k) { return '<div class="sbar" style="--c:' + (k === 'none' ? 'var(--acc)' : subjCol(k)) + '"><span>' + esc(k === 'none' ? 'No subject' : subjName(k)) + '</span><span class="tr"><i style="width:' + (100 * subT[k] / wsum).toFixed(1) + '%"></i></span><b>' + mins(subT[k]) + '</b></div>'; }).join('') : '<p class="muted small">Nothing yet this week.</p>') +
      '<h3 style="margin:18px 0 0">When you focus best</h3><div class="hm">' + hrs.map(function (x, i) { return '<i style="--o:' + (0.06 + 0.94 * x / hmx).toFixed(2) + '" title="' + pad(i) + ':00 · ' + mins(x) + '"></i>'; }).join('') + '</div><div class="hml"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div></div></div>';
    // recent sessions
    var rec = S.slice(-12).reverse();
    h += '<div class="card" style="margin-top:20px"><h2 style="margin-bottom:8px">Recent sessions</h2>' + (rec.length ? '<div style="overflow-x:auto"><table class="sess"><thead><tr><th>When</th><th>What</th><th>Subject</th><th>Result</th><th style="text-align:right">Focus</th></tr></thead><tbody>' +
      rec.map(function (s) { return '<tr><td>' + esc(rel(iso(new Date(s.t)))) + ' · ' + hm(s.t) + '</td><td>' + esc(s.label || s.goal || '—') + '</td><td>' + (s.subj ? '<span class="tag" style="--c:' + subjCol(s.subj) + '"><i></i>' + esc(subjName(s.subj)) + '</span>' : '') + '</td><td>' + (s.result ? '<span class="res ' + s.result + '">' + { y: 'Nailed it', p: 'Partly', n: 'Not really' }[s.result] + '</span>' : '<button type="button" class="btn sm ghost" data-ref="' + esc(s.id) + '">Add</button>') + '</td><td class="n">' + mins(s.studied) + '</td></tr>'; }).join('') +
      '</tbody></table></div>' : '<p class="muted">No sessions yet.</p>') + '</div>';
    v.innerHTML = h;
    $$('[data-ref]', v).forEach(function (b) { b.onclick = function () { reflectDlg(b.getAttribute('data-ref')); }; });
  };

  /* ---------- theme, full screen, keys ---------- */
  function applyTheme() { var t = prefs().theme; if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme'); }
  $('#btnTheme').onclick = function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    setPref('theme', dark ? 'light' : 'dark'); applyTheme();
  };
  function full() {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    var el = document.documentElement; if (el.requestFullscreen) el.requestFullscreen().catch(function () { toast('Full screen is not available here.'); }); else document.body.classList.toggle('zen');
  }
  $('#btnFull').onclick = full;
  document.addEventListener('fullscreenchange', function () {
    var on = !!document.fullscreenElement; document.body.classList.toggle('zen', on && cur === 'focus');
    if (on && cur === 'focus') toast('Full screen. Press Esc to leave.');
    if (cur === 'focus' && F.run()) setTimeout(paintRing, 60);
  });
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || $('.modal-back')) return;
    var a = document.activeElement; if (a && (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(a.tagName) || a.isContentEditable)) return;
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); full(); }
    if (e.key === ' ' && cur === 'focus') { e.preventDefault(); var r = F.run(); if (!r) startNow(); else if (F.phase(r).k !== 'done') { F.toggle(); paintRing(); } }
  });
  window.addEventListener('beforeunload', function () { sound.stop(); });

  applyTheme();
  route();
})();
