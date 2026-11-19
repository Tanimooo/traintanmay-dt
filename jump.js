/* TrainTanmay: get where you need to go, fast. Loaded by D&T, Physics and Maths.
   1. Jump search: Ctrl+K (or /) anywhere opens one box that finds any topic, paper, question, lab or page
      in this app, plus the other apps. Enter goes there.
   2. Continue strip: at the top of each app's home, your last few places and your weakest topic, one tap each.
      Places are remembered as you go (tt-recent-<app>, kept in "Save progress").
   3. Smaller headers: the big home banners and page titles are trimmed so content starts higher up. */
(function () {
  if (window.ttJump) return;
  var app = /\/physics\//.test(location.pathname) ? 'physics' : /\/maths\//.test(location.pathname) ? 'maths' : 'dt';
  var base = (document.currentScript && document.currentScript.src || '').replace(/jump\.js.*$/, '');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---------------- what can be jumped to ---------------- */
  var PAGES = {
    dt: [['home', 'Home'], ['topics', 'All topics'], ['exam', 'Exam questions'], ['papers', 'Past papers'], ['flashcards', 'Flashcards'], ['quiz', 'Quizzes'], ['labs', 'Labs'], ['videos', 'Videos'], ['downloads', 'Downloads'], ['progress', 'Progress'], ['search', 'Search the notes']],
    physics: [['home', 'Home'], ['topics', 'All topics'], ['bank', 'Practice questions'], ['mock', 'Practice tests'], ['papers', 'Past papers'], ['flash', 'Flashcards'], ['quiz', 'Quiz'], ['labs', 'Labs'], ['pags', 'Practicals (PAGs)'], ['videos', 'Videos'], ['sheet', 'Data sheet'], ['progress', 'Progress']],
    maths: [['home', 'Home'], ['courses', 'All courses'], ['papers', 'Past papers'], ['practice', 'Practice questions'], ['drills', 'Skill drills'], ['vis', 'Visualisers'], ['videos', 'Videos'], ['progress', 'Progress'], ['mycourses', 'My courses']]
  };
  var NAMES = { dt: 'Design & Technology', physics: 'Physics', maths: 'Maths' };
  var HOMES = { dt: 'dt.html', physics: 'physics/', maths: 'maths/' };
  function index() {
    var L = [], add = function (t, sub, h, kind) { L.push({ t: t, sub: sub, h: h, k: kind || '' }); };
    PAGES[app].forEach(function (p) { add(p[1], NAMES[app], '#' + p[0], 'page'); });
    try {
      if (app === 'dt' && window.DATA) {
        DATA.topics.forEach(function (t) { add(t.id + ' ' + t.title, 'Topic · ' + (DATA.groups[t.group] || ''), '#t-' + t.id, 'topic'); });
        var ys = {}; DATA.pp.forEach(function (q) { ys[q.year] = 1; add(q.year + ' Q' + q.q, 'Past paper question · ' + q.marks + ' marks', '#q-' + q.id.replace(/[()]/g, ''), 'question'); });
        Object.keys(ys).forEach(function (y) { add('Paper 1 · ' + y, 'Sit the whole paper', '#paper-' + y, 'paper'); });
      }
      if (app === 'physics' && window.SPEC) {
        SPEC.topics.forEach(function (t) { add(t.id + ' ' + t.title, 'Topic · Module ' + String(t.id).split('.')[0], '#t-' + t.id, 'topic'); });
        (SPEC.papers || []).forEach(function (p) { add(p.code + ' ' + p.name, 'Past papers · ' + (p.level || ''), '#papers', 'paper'); });
        if (window.PAGS && PAGS.list) PAGS.list.forEach(function (p) { add('PAG ' + p.pag + ': ' + p.title, 'Practical', '#pag-' + p.id, 'lab'); });
        if (window.BANK && BANK.q) BANK.q.forEach(function (q) { var pk = BANK.packs[q.p]; if (pk) add(pk.title + ' · Q' + q.n, 'Practice question · ' + (q.m || '?') + ' marks', '#pq-' + q.id, 'question'); });
      }
      if (app === 'maths' && window.CAT) {
        (CAT.courses || []).forEach(function (c) { add(c.name, c.code || 'Course', '#c-' + c.id, 'topic'); add(c.name + ' papers', 'Past papers', '#cp-' + c.id, 'paper'); });
        var byc = {}; (CAT.courses || []).forEach(function (c) { byc[c.id] = c.name; });
        Object.keys(CAT.topics || {}).forEach(function (c) { (CAT.topics[c] || []).forEach(function (t) { add(t[1], 'Topic · ' + (byc[c] || c), '#t-' + c + '-' + t[0], 'topic'); }); });
      }
      if (window.LABS) Object.keys(LABS).forEach(function (k) { if (LABS[k] && LABS[k].title) add(LABS[k].title, 'Lab', '#lab-' + k, 'lab'); });
    } catch (e) {}
    // the other apps and their main pages
    Object.keys(PAGES).forEach(function (a) {
      if (a === app) return;
      PAGES[a].forEach(function (p) { add(p[1], NAMES[a], base + HOMES[a] + (p[0] === 'home' ? '' : '#' + p[0]), 'app'); });
    });
    add('Start screen', 'All apps', base, 'app'); add('How to use TrainTanmay', 'Help', base + 'help.html', 'app');
    add('Plan your revision', 'revisedesk.com (new tab)', 'https://revisedesk.com', 'app');
    return L;
  }
  var IDX = null;
  function search(q) {
    IDX = IDX || index();
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return recent().map(function (r) { return { t: r.t, sub: 'Recent · ' + r.sub, h: r.h, k: 'recent' }; }).concat(IDX.filter(function (x) { return x.k === 'page'; }));
    var kindRank = { page: 0, topic: 1, paper: 2, lab: 3, question: 4, app: 5 };
    return IDX.map(function (x) {
      var T = x.t.toLowerCase(), S = (x.t + ' ' + x.sub).toLowerCase(), sc = 0;
      for (var i = 0; i < words.length; i++) { var w = words[i]; if (T.indexOf(w) === 0) sc += 6; else if (new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(T)) sc += 4; else if (S.indexOf(w) >= 0) sc += 1; else return null; }
      return [sc - (kindRank[x.k] || 0) * 0.1, x];
    }).filter(Boolean).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 40).map(function (p) { return p[1]; });
  }

  /* ---------------- the jump box ---------------- */
  var css = document.createElement('style');
  css.textContent =
    '.ttj-back{position:fixed;inset:0;z-index:100003;background:rgba(5,8,12,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:flex-start;padding:10vh 12px 12px}' +
    '.ttj{width:min(620px,100%);max-height:76vh;display:flex;flex-direction:column;background:var(--surface,var(--card,#1b1d22));color:var(--ink,#eceef2);border:1px solid var(--brand,#5b9cff);border-radius:16px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);font:15px "IBM Plex Sans",system-ui,sans-serif}' +
    '.ttj input{font:inherit;font-size:1.05rem;padding:15px 16px;border:0;border-bottom:1px solid var(--line,rgba(128,128,128,.3));background:transparent;color:inherit;outline:none}' +
    '.ttj ul{list-style:none;margin:0;padding:6px;overflow:auto}' +
    '.ttj li a{display:flex;flex-direction:column;gap:1px;padding:9px 12px;border-radius:10px;color:inherit;text-decoration:none}' +
    '.ttj li a small{opacity:.65;font-size:.8rem}.ttj li a[aria-selected=true]{background:var(--brand-soft,rgba(91,156,255,.16));outline:1px solid var(--brand,#5b9cff)}' +
    '.ttj .ft{padding:7px 14px;font-size:.75rem;opacity:.6;border-top:1px solid var(--line,rgba(128,128,128,.3))}' +
    '.ttj .none{padding:18px;opacity:.7;text-align:center}' +
    /* continue strip */
    /* one row: the label, then the places in a strip that scrolls sideways instead of wrapping */
    '.tt-cont{display:flex;align-items:center;gap:10px;margin:4px 0 14px;min-width:0}' +
    '.tt-cont>b{flex:none;font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.7}' +
    '.tt-cont .tt-row{display:flex;align-items:stretch;gap:8px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;min-width:0;padding:2px}.tt-cont .tt-row::-webkit-scrollbar{display:none}' +
    /* every chip the same height, same type: title then a quieter line under it */
    '.tt-cont a,.tt-cont button{flex:none;scroll-snap-align:start;display:inline-flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:2px;max-width:240px;padding:7px 12px;border-radius:12px;border:1px solid var(--line,rgba(128,128,128,.35));background:var(--surface,transparent);color:inherit;text-decoration:none;font-family:inherit;font-size:.86rem;line-height:1.25;cursor:pointer;text-align:left}' +
    '.tt-cont .tt-row>*{align-self:stretch!important;height:auto!important;min-height:0!important;margin:0!important;box-sizing:border-box}' +
    '.tt-cont a span,.tt-cont button span{font-weight:600;font-size:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}' +
    '.tt-cont small{opacity:.65;font-size:.84em;font-weight:400;white-space:nowrap}' +
    '.tt-cont a:hover,.tt-cont button:hover{border-color:var(--brand,#5b9cff)}.tt-cont .weak{border-color:#e0a030}.tt-cont .jump{border-style:dashed}' +
    /* thin screens: label on its own line, everything scaled with the screen */
    '@media (max-width:640px){.tt-cont{flex-direction:column;align-items:stretch;gap:5px;margin:2px 0 10px}.tt-cont>b{font-size:.66rem}' +
    '.tt-cont a,.tt-cont button{max-width:62vw;padding:6px 10px;border-radius:10px;font-size:clamp(.72rem,3.2vw,.84rem)}' +
    '.tt-cont .jump small{display:block}}' +
    /* smaller headers */
    '#app .hero{padding-top:clamp(14px,2.4vw,28px)!important;padding-bottom:clamp(14px,2.4vw,28px)!important;min-height:0!important;gap:clamp(12px,2vw,28px)!important}' +
    '#app .hero h1{font-size:clamp(1.55rem,3.4vw,2.5rem)!important;line-height:1.1!important;margin-top:4px!important;margin-bottom:6px!important}' +
    '#app .hero p{font-size:.95rem;margin-top:6px;margin-bottom:10px}' +
    '#app .hero p:not(.pun):not([id]){display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '#app .hero .hero-text{padding:clamp(14px,2.6vw,30px)!important}' +
    '#app .hero .hero-3d,#app .hero .hero-scopewrap,#app .hero .heroart{max-height:210px;overflow:hidden}' +
    '@media (max-width:820px){#app .hero .hero-3d,#app .hero .hero-scopewrap,#app .hero .heroart{display:none!important}}' +
    '#app>h1,#app>.wrap>h1,#app h1:not(.hero h1){font-size:clamp(1.45rem,2.8vw,2.1rem)}';
  document.head.appendChild(css);

  var back = null;
  function close() { if (back) { back.remove(); back = null; } }
  function open() {
    if (back) return; IDX = null;
    back = document.createElement('div'); back.className = 'ttj-back';
    back.innerHTML = '<div class="ttj" role="dialog" aria-modal="true" aria-label="Jump to"><input type="search" placeholder="Jump to a topic, paper, question, lab…" aria-label="Jump to" autocomplete="off"><ul role="listbox"></ul><div class="ft">↑ ↓ to move · Enter to go · Esc to close · Ctrl K any time</div></div>';
    document.body.appendChild(back);
    var inp = back.querySelector('input'), ul = back.querySelector('ul'), sel = 0, res = [];
    var draw = function () {
      res = search(inp.value); sel = Math.min(sel, Math.max(0, res.length - 1));
      ul.innerHTML = res.length ? res.map(function (r, i) { return '<li><a href="' + esc(r.h) + '" role="option" aria-selected="' + (i === sel) + '"' + (/^https?:/.test(r.h) && r.h.indexOf(location.origin) !== 0 ? ' target="_blank" rel="noopener"' : '') + '><span>' + esc(r.t) + '</span><small>' + esc(r.sub) + '</small></a></li>'; }).join('') : '<li class="none">Nothing matches. Try fewer words.</li>';
    };
    var go = function (i) { var a = ul.querySelectorAll('a')[i]; if (!a) return; close(); a.click(); };
    inp.oninput = function () { sel = 0; draw(); };
    inp.onkeydown = function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(res.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); [].forEach.call(ul.querySelectorAll('a'), function (a, i) { a.setAttribute('aria-selected', i === sel); if (i === sel) a.scrollIntoView({ block: 'nearest' }); }); }
      else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
      else if (e.key === 'Escape') close();
    };
    ul.addEventListener('click', function (e) { if (e.target.closest('a')) setTimeout(close, 0); });
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    draw(); inp.focus();
  }
  document.addEventListener('keydown', function (e) {
    var typing = e.target.closest && e.target.closest('input,textarea,select,[contenteditable=true]');
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); back ? close() : open(); }
    else if (e.key === '/' && !typing && !back && !document.querySelector('.tte,.ttc-pop')) { e.preventDefault(); open(); }
  });

  /* ---------------- where you've been ---------------- */
  var RK = 'tt-recent-' + app;
  function recent() { return (ls(RK) || []).slice(0, 8); }
  function kindOf(h) {
    if (/^#(q|pq)-/.test(h)) return 'Question'; if (/^#(paper|run|cp)-/.test(h)) return 'Paper'; if (/^#(lab|pag)-/.test(h)) return 'Lab';
    if (/^#(t|c)-/.test(h)) return 'Topic'; if (/^#(mockrun|mockres)-/.test(h)) return 'Practice test'; return 'Page';
  }
  function remember() {
    var h = location.hash; if (!h || h === '#home' || h === '#' || /^#(search|q-x)$/.test(h)) return;
    setTimeout(function () {
      if (location.hash !== h) return;
      // name it from the jump index when it's there (proper titles), else from the page's heading
      IDX = IDX || index();
      var hit = IDX.filter(function (x) { return x.h === h; })[0];
      var el = document.querySelector('#app h1'), t = hit ? hit.t : (el ? el.innerText : document.title.replace(/\s*[–-]\s*TrainTanmay.*$/, '')).replace(/\s+/g, ' ').trim().slice(0, 70);
      if (!t || /^TrainTanmay/.test(t)) return;
      var L = (ls(RK) || []).filter(function (r) { return r.h !== h; });
      L.unshift({ h: h, t: t, sub: hit && hit.k !== 'page' ? hit.sub : kindOf(h), at: Date.now() }); ls(RK, L.slice(0, 12));
    }, 900);
  }
  window.addEventListener('hashchange', remember); remember();

  /* your weakest topic: one you rated "not yet", else the topic with the lowest scores */
  function weakest() {
    try {
      if (app === 'dt' && window.DATA) { var S = ls('tt-dt-progress-v1') || {}, c = S.conf || {}; var t = DATA.topics.find(function (x) { return c[x.id] === 'r'; }); if (t) return { h: '#t-' + t.id, t: t.id + ' ' + t.title }; }
      if (app === 'physics' && window.SPEC) {
        var P = ls('tt-phys-progress-v1') || {}, pc = P.conf || {}; var pt = SPEC.topics.find(function (x) { return pc[x.id] === 'r'; }); if (pt) return { h: '#t-' + pt.id, t: pt.id + ' ' + pt.title };
        if (window.BANK && P.bank) { var by = {}; BANK.q.forEach(function (q) { var r = P.bank[q.id]; if (!r || r.got == null || !q.m) return; var k = q.t[0], x = by[k] || (by[k] = { g: 0, m: 0 }); x.g += r.got; x.m += q.m; });
          var w = Object.keys(by).filter(function (k) { return by[k].m >= 6; }).sort(function (a, b) { return by[a].g / by[a].m - by[b].g / by[b].m; })[0];
          var wt = w && SPEC.topics.find(function (x) { return x.id === w; }); if (wt) return { h: '#t-' + wt.id, t: wt.id + ' ' + wt.title + ' · ' + Math.round(100 * by[w].g / by[w].m) + '%' }; }
      }
      if (app === 'maths' && window.CAT) { var M = ls('tt-maths-v1') || {}, mc = M.conf || {}; var key = Object.keys(mc).find(function (k) { return mc[k] === 'r'; });
        if (key) { var cc = key.split('/')[0], tt = key.split('/')[1], nm = ((CAT.topics[cc] || []).find(function (x) { return x[0] === tt; }) || [])[1]; if (nm) return { h: '#t-' + cc + '-' + tt, t: nm }; } }
    } catch (e) {}
    return null;
  }

  /* the strip itself, put just under the home banner whenever the home page is shown */
  function strip() {
    var h = location.hash; if (h && h !== '#home') return;
    var hero = document.querySelector('#app .hero'); if (!hero || document.querySelector('#app .tt-cont')) return;
    var R = recent().slice(0, 3), W = weakest();
    var div = document.createElement('div'); div.className = 'tt-cont';
    var narrow = matchMedia('(max-width:640px)').matches;
    div.innerHTML = '<b>' + (R.length || W ? 'Continue' : 'Get going') + '</b><div class="tt-row">' +
      R.map(function (r) { return '<a href="' + esc(r.h) + '"><span>' + esc(r.t) + '</span><small>' + esc(r.sub) + '</small></a>'; }).join('') +
      (W ? '<a class="weak" href="' + esc(W.h) + '"><span>' + esc(W.t) + '</span><small>Your weakest topic</small></a>' : '') +
      '<button type="button" class="jump"><span>' + (narrow ? 'Jump to…' : 'Jump to anything') + '</span><small>' + (narrow ? 'Search' : 'Ctrl K or /') + '</small></button></div>';
    div.querySelector('.jump').onclick = open;
    hero.insertAdjacentElement('beforebegin', div);
  }
  var appEl = null;
  function watch() {
    appEl = document.getElementById('app'); if (!appEl) return setTimeout(watch, 300);
    var t = null; // pages are drawn a level or two inside #app, so watch all of it (cheaply: once per burst)
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(strip, 60); }).observe(appEl, { childList: true, subtree: true });
    strip();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();

  window.ttJump = { open: open, close: close, recent: recent };
})();
