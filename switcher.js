/* TrainTanmay app switcher: click the logo (top left) to pick an app or go back to the start screen. */
(function () {
  var me = document.currentScript && document.currentScript.src || '';
  var base = me.replace(/switcher\.js.*$/, '');
  var here = /help\.html$/.test(location.pathname) ? 'help' : /\/physics\//.test(location.pathname) ? 'physics' : /\/chemistry\//.test(location.pathname) ? 'chemistry' : /\/esat\//.test(location.pathname) ? 'esat' : /\/maths\//.test(location.pathname) ? 'maths' : 'dt';
  var APPS = [
    { id: 'dt', name: 'Design & Technology', sub: 'Edexcel 9DT0', tile: '#1f5fbf', ink: '#fff', t: '#bcd4ff', href: base + 'dt.html' },
    { id: 'physics', name: 'Physics', sub: 'OCR A H556', tile: '#c81e66', ink: '#fff', t: '#ffd0e4', href: base + 'physics/' },
    { id: 'chemistry', name: 'Chemistry', sub: 'OCR A H432', tile: '#c2410c', ink: '#fff', t: '#ffd3b5', href: base + 'chemistry/' },
    { id: 'maths', name: 'Maths', sub: 'Edexcel 9MA0 · 9FM0', tile: '#1a7f45', ink: '#fff', t: '#c4f0d4', href: base + 'maths/' },
    { id: 'esat', name: 'ESAT', sub: 'ENGAA · NSAA · TMUA', tile: '#ffc917', ink: '#1d1600', t: '#9a6200', href: base + 'esat/' },
    { id: 'help', name: 'How to use TrainTanmay', sub: 'What each app is for · tips', tile: '#3b3f48', ink: '#fff', t: '#c9ccd3', href: base + 'help.html' }
  ];
  try { if (here !== 'help') localStorage.setItem('tt-last', here); } catch (e) {}
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) { try { navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () {}); } catch (e) {} }
  if (!window.ttSave) { var sj = document.createElement('script'); sj.src = base + 'save.js?v=20261119b'; document.head.appendChild(sj); }
  /* feature switches (features.js): pages that do not load it themselves get it here */
  if (!window.TT_FEATURES) { var fj = document.createElement('script'); fj.src = base + 'features.js?v=20261121'; document.head.appendChild(fj); }
  function logo(a) {
    return '<svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="11" fill="' + a.tile + '"/><path d="M8 10h22v6h-7.6v24h-6.8V16H8z" fill="' + a.ink + '"/><path d="M33.2 19.5h5.2v4.6h4.2v4.3h-4.2v6.4c0 1.4.6 1.9 1.9 1.9.8 0 1.6-.1 2.3-.3v4.3c-1 .3-2.3.5-3.6.5-3.9 0-5.8-1.9-5.8-5.6v-7.2H30.6v-4.3h2.6z" fill="' + a.t + '"/></svg>';
  }
  /* ---- language: English / Welsh / Scottish Gaelic via Google's in-page translator ---- */
  var LANGS = [['en', 'English'], ['cy', 'Cymraeg'], ['gd', 'Gàidhlig']];
  function curLang() { var m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z-]+)/); return m && m[1] !== 'en' ? m[1] : 'en'; }
  function setCookie(v, exp) {
    var host = location.hostname, parts = host.split('.');
    var doms = ['', host]; if (parts.length > 2) doms.push('.' + parts.slice(-2).join('.')); doms.push('.' + host);
    doms.forEach(function (d) { document.cookie = 'googtrans=' + v + '; path=/' + (d ? '; domain=' + d : '') + (exp ? '; expires=' + exp : ''); });
  }
  function setLang(l) {
    try { localStorage.setItem('tt-lang', l); } catch (e) {}
    if (l === 'en') setCookie('', 'Thu, 01 Jan 1970 00:00:00 GMT'); else setCookie('/en/' + l);
    location.reload();
  }
  // keep things that must not be translated (maths, code, the name) as they are
  function protect(root) {
    if (!root.querySelectorAll) return;
    [].forEach.call(root.querySelectorAll('.katex,.m,code,pre,kbd,.mono,.brand b,.brand>span,.eq b,[data-fx]'), function (el) { el.classList.add('notranslate'); el.setAttribute('translate', 'no'); });
  }
  try { var saved = localStorage.getItem('tt-lang'); if (saved && saved !== 'en' && curLang() === 'en') setCookie('/en/' + saved); } catch (e) {}
  if (curLang() !== 'en') {
    document.documentElement.setAttribute('lang', curLang());
    var go = function () {
      protect(document.body);
      new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) protect(n.parentNode || n); }); }); }).observe(document.body, { childList: true, subtree: true });
      var holder = document.createElement('div'); holder.id = 'tt-gt'; document.body.appendChild(holder);
      window.ttGTinit = function () { try { new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'cy,gd', autoDisplay: false }, 'tt-gt'); } catch (e) {} };
      var s = document.createElement('script'); s.src = 'https://translate.google.com/translate_a/element.js?cb=ttGTinit'; s.async = true;
      s.onerror = function () { console.warn('Translator could not load'); };
      document.body.appendChild(s);
    };
    if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
  }

  var css = document.createElement('style');
  css.textContent =
    '.tt-sw{position:fixed;z-index:99999;min-width:262px;max-height:calc(100vh - 80px);overflow:auto;background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);color:#111;border:1px solid #d0d4dc;border-radius:16px;box-shadow:0 24px 60px -12px rgba(10,15,30,.32),0 2px 6px rgba(10,15,30,.08);padding:7px;font:14px "IBM Plex Sans",system-ui,-apple-system,sans-serif;transform-origin:18px 0;animation:ttSwIn .26s cubic-bezier(.2,.9,.25,1.15) both}' +
    '@keyframes ttSwIn{from{opacity:0;transform:translateY(-6px) scale(.96)}to{opacity:1;transform:none}}' +
    '.tt-sw a{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;color:inherit;text-decoration:none;transition:background .18s ease,transform .18s ease}' +
    '.tt-sw a svg{transition:transform .25s cubic-bezier(.2,.9,.25,1.4)}.tt-sw a:hover svg{transform:scale(1.08) rotate(-4deg)}.tt-sw a:active{transform:scale(.98)}' +
    '.tt-all{margin-bottom:2px}.tt-orb{width:34px;height:34px;flex:none;border-radius:10px;background:#14122b;display:grid;place-items:center}.tt-orb svg{width:26px;height:26px;transition:transform .5s cubic-bezier(.2,.9,.25,1.4)}.tt-sw a:hover .tt-orb svg{transform:rotate(72deg)}' +
    '@media (prefers-reduced-motion:reduce){.tt-sw{animation:none}.tt-sw a,.tt-sw a svg{transition:none}}' +
    '.tt-sw a:hover,.tt-sw a:focus-visible{background:#f0f2f6}.tt-sw a[aria-current]{background:#eef3fc}' +
    '.tt-sw b{display:block}.tt-sw small{opacity:.65;font-size:12px}.tt-sw .h{padding:6px 10px 4px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.6}' +
    '.tt-lang{display:flex;gap:4px;padding:0 6px 6px}.tt-lang button{flex:1;font:inherit;font-size:13px;padding:6px 4px;border-radius:7px;border:1px solid rgba(128,128,128,.35);background:transparent;color:inherit;cursor:pointer}.tt-lang button[aria-pressed=true]{background:#1f5fbf;border-color:#1f5fbf;color:#fff}' +
    '.goog-te-banner-frame,.skiptranslate>iframe,#goog-gt-tt,.goog-te-balloon-frame,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-aZ2wEe-wOHMyf{display:none!important}body{top:0!important}.goog-text-highlight{background:none!important;box-shadow:none!important}#tt-gt{display:none}' +
    '.tt-sw .home{justify-content:center;border-top:1px solid #e6e8ec;margin-top:4px;border-radius:0 0 8px 8px;font-size:13px}' +
    '@media (prefers-color-scheme:dark){.tt-sw{background:rgba(27,29,34,.94);color:#eee;border-color:#3a3d45}.tt-sw a:hover{background:#2a2d34}.tt-sw a[aria-current]{background:#262b36}.tt-sw .home{border-color:#3a3d45}}';
  document.head.appendChild(css);
  var menu = null;
  function close() { if (menu) { menu.remove(); menu = null; } }
  function open(brand) {
    close();
    var r = brand.getBoundingClientRect();
    menu = document.createElement('div');
    menu.className = 'tt-sw';
    menu.setAttribute('role', 'menu');
    var cur = APPS.filter(function (a) { return a.id === here; })[0] || APPS[0];
    menu.innerHTML = '<div class="h">Language</div><div class="tt-lang">' + LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l[0] + '"' + (l[0] === curLang() ? ' aria-pressed="true"' : '') + ' lang="' + l[0] + '">' + l[1] + '</button>';
    }).join('') + '</div><a class="tt-all" role="menuitem" href="' + base + '"><span class="tt-orb" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="6" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/><circle cx="10" cy="4" r="2.4" fill="#5b9cff"/><circle cx="15.71" cy="8.15" r="2.4" fill="#ff5c9e"/><circle cx="13.53" cy="14.85" r="2.4" fill="#ff8a4c"/><circle cx="6.47" cy="14.85" r="2.4" fill="#4ade80"/><circle cx="4.29" cy="8.15" r="2.4" fill="#ffc917"/></svg></span><span><b>All apps</b><small>Back to the start screen</small></span></a><div class="h">Your subjects</div>' + mySubjects().concat(APPS.filter(function (a) { return a.id === 'help'; })).map(function (a) {
      return '<a role="menuitem" href="' + a.href + '"' + (a.id === here ? ' aria-current="page"' : '') + '>' + logo(a) + '<span><b>' + a.name + '</b><small>' + a.sub + '</small></span></a>';
    }).join('').replace('<a role="menuitem" href="' + base + 'help.html"', '<div style="border-top:1px solid rgba(128,128,128,.25);margin:4px 0"></div><a role="menuitem" href="' + base + 'help.html"') + '<a role="menuitem" href="#" data-tt-save><span style="width:34px;height:34px;border-radius:9px;background:#14122b;color:#fff;display:grid;place-items:center;flex:none"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></svg></span><span><b>Save or load progress</b><small>Every app at once, any device</small></span></a>' + '<a role="menuitem" href="https://revisedesk.com" data-feature="revisedesk" target="_blank" rel="noopener"><span style="width:34px;height:34px;border-radius:9px;background:#14161b;color:#fff;display:grid;place-items:center;flex:none"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg></span><span><b>Plan your revision</b><small>revisedesk.com · opens in a new tab</small></span></a>' + '<a role="menuitem" href="https://forms.gle/4aoQFUo7EExBa8et5" target="_blank" rel="noopener" style="gap:10px"><span style="width:34px;height:34px;border-radius:9px;background:#b23a33;color:#fff;display:grid;place-items:center;font-weight:700;flex:none">!</span><span><b>Report a bug or mistake</b><small>Opens a short Google Form</small></span></a>' + (here === 'help' ? '' : '<a class="home" role="menuitem" href="#" data-home>Go to ' + cur.name + ' home</a>');
    menu.style.left = Math.max(8, r.left) + 'px';
    menu.style.top = (r.bottom + 6) + 'px';
    document.body.appendChild(menu);
    [].forEach.call(menu.querySelectorAll('[data-lang]'), function (b) { b.onclick = function () { setLang(b.getAttribute('data-lang')); }; });
    var sv = menu.querySelector('[data-tt-save]'); if (sv) sv.addEventListener('click', function () { setTimeout(close, 0); });
    var hm = menu.querySelector('[data-home]'); if (hm) hm.onclick = function (e) {
      e.preventDefault(); close();
      var h = brand.getAttribute('href') || '#';
      if (location.hash === h) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = h;
    };
    var first = menu.querySelector('a'); first && first.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.brand:not(.chip)');
    if (b && !(menu && menu.contains(b))) {
      if (b.closest('.drawer-panel')) return; // mobile menu logo keeps its normal link
      e.preventDefault(); e.stopPropagation();
      menu ? close() : open(b);
      return;
    }
    if (menu && !menu.contains(e.target)) close();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);

  /* ---- your subjects: the apps you picked on the start screen (all of them until you pick) ---- */
  function mySubjects() {
    var p = null; try { p = JSON.parse(localStorage.getItem('tt-profile') || 'null'); } catch (e) {}
    var ids = p && p.subjects && p.subjects.length ? p.subjects : ['dt', 'physics', 'chemistry', 'maths', 'esat'];
    return APPS.filter(function (a) { return ids.indexOf(a.id) >= 0; });
  }

  /* ---- subject rail: one way round every app, always in the same place ----
     Wide screens: a slim bar on the left edge. Phones: a row along the bottom of the logo menu does the job. */
  if (here !== 'help') {
    var railCss = document.createElement('style');
    railCss.textContent =
      '.tt-rail{position:fixed;left:10px;top:50%;transform:translate(calc(-100% - 16px),-50%);transition:transform .28s cubic-bezier(.2,.8,.2,1) .35s,box-shadow .28s;z-index:9000;display:none;flex-direction:column;gap:6px;padding:7px;border-radius:16px;background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(120,128,140,.25);box-shadow:0 10px 30px -12px rgba(10,15,30,.25);font:13px "IBM Plex Sans",system-ui,sans-serif}' +
      '@media (min-width:1280px) and (pointer:fine){.tt-rail{display:flex}}' +
      /* hidden off the left edge until you point at that edge, so it never covers the page */
      '.tt-rail-hot{display:none;position:fixed;left:0;top:0;bottom:0;width:14px;z-index:8999}' +
      '.tt-rail-hot::after{content:"";position:absolute;left:3px;top:50%;width:4px;height:56px;margin-top:-28px;border-radius:4px;background:rgba(120,128,140,.45);transition:opacity .2s}' +
      '.tt-rail-hot:hover~.tt-rail,.tt-rail:hover,.tt-rail:focus-within{transform:translate(0,-50%);transition-delay:0s;box-shadow:0 16px 40px -12px rgba(10,15,30,.35)}' +
      '.tt-rail-hot:hover::after{opacity:0}@media (min-width:1280px) and (pointer:fine){.tt-rail-hot{display:block}}' +
      '@media (prefers-reduced-motion:reduce){.tt-rail{transition:none}}' +
      '.tt-rail a{position:relative;display:grid;place-items:center;width:38px;height:38px;border-radius:11px;text-decoration:none;color:#111;outline-offset:2px}' +
      '.tt-rail a:hover{background:rgba(120,128,140,.14)}.tt-rail a[aria-current]::before{content:"";position:absolute;left:-7px;top:9px;bottom:9px;width:3px;border-radius:3px;background:currentColor}' +
      '.tt-rail a span{position:absolute;left:46px;white-space:nowrap;padding:5px 9px;border-radius:8px;background:#14161b;color:#fff;font-size:12px;opacity:0;pointer-events:none;transform:translateX(-4px);transition:opacity .15s,transform .15s}' +
      '.tt-rail a:hover span,.tt-rail a:focus-visible span{opacity:1;transform:none}' +
      '.tt-rail hr{border:0;border-top:1px solid rgba(120,128,140,.25);margin:2px 4px;width:auto}' +
      '.tt-rail .ic{width:20px;height:20px}' +
      '@media (prefers-color-scheme:dark){.tt-rail{background:rgba(27,29,34,.9);border-color:#3a3d45}.tt-rail a{color:#eee}}' +
      '@media print{.tt-rail{display:none!important}}';
    document.head.appendChild(railCss);
    var ico = function (d) { return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
    var buildRail = function () {
      if (document.querySelector('.tt-rail')) return;
      var hot = document.createElement('div'); hot.className = 'tt-rail-hot'; hot.setAttribute('aria-hidden', 'true'); document.body.appendChild(hot);
      var nav = document.createElement('nav'); nav.className = 'tt-rail'; nav.setAttribute('aria-label', 'Your subjects');
      nav.innerHTML = '<a href="' + base + '">' + ico('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>') + '<span>Start screen</span></a>' +
        (here !== 'esat' ? '<a href="#" data-tt-jump>' + ico('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>') + '<span>Jump to anything (Ctrl K)</span></a>' : '') + '<hr>' +
        mySubjects().map(function (a) { return '<a href="' + a.href + '"' + (a.id === here ? ' aria-current="page"' : '') + '>' + logo(a).replace('width="34" height="34"', 'width="28" height="28"') + '<span>' + a.name + '</span></a>'; }).join('') +
        '<hr><a href="#" data-tt-save>' + ico('<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>') + '<span>Save or load progress</span></a>' +
        '<a href="https://revisedesk.com" data-feature="revisedesk" target="_blank" rel="noopener">' + ico('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h4M7 17h7"/>') + '<span>Plan your revision on revisedesk ↗</span></a>' +
        '<a href="' + base + 'help.html">' + ico('<circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 1 1 4.3 2.7c-.9.5-1.5 1.1-1.5 2.3M12 17.5v.1"/>') + '<span>How to use TrainTanmay</span></a>';
      document.body.appendChild(nav);
      var jb = nav.querySelector('[data-tt-jump]'); if (jb) jb.onclick = function (e) { e.preventDefault(); if (window.ttJump) window.ttJump.open(); };
    };
    if (document.body) buildRail(); else document.addEventListener('DOMContentLoaded', buildRail);
  }

  /* ---- "updated" bar: when a new version of the site is ready, say so quietly instead of jumping ---- */
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (document.querySelector('.tt-upd')) return;
      var bar = document.createElement('div'); bar.className = 'tt-upd'; bar.setAttribute('role', 'status');
      bar.innerHTML = '<span>TrainTanmay has been updated. Your progress is safe.</span><button type="button">Reload</button><button type="button" aria-label="Dismiss">✕</button>';
      bar.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99998;display:flex;gap:10px;align-items:center;padding:9px 10px 9px 16px;border-radius:12px;background:#14161b;color:#fff;font:14px "IBM Plex Sans",system-ui,sans-serif;box-shadow:0 12px 30px -10px rgba(0,0,0,.5);max-width:calc(100vw - 24px)';
      [].forEach.call(bar.querySelectorAll('button'), function (b, i) { b.style.cssText = 'font:inherit;font-weight:600;border:0;border-radius:8px;padding:6px 12px;cursor:pointer;' + (i ? 'background:transparent;color:#aaa' : 'background:#fff;color:#14161b'); b.onclick = function () { if (i) bar.remove(); else location.reload(); }; });
      document.body.appendChild(bar);
    });
  }

  /* ---- gentle page-change fade for apps without one of their own (styles in polish.css) ---- */
  if (here === 'maths') {
    var lastTok = location.hash;
    window.addEventListener('hashchange', function () {
      var a = lastTok.split('?')[0], b = location.hash.split('?')[0]; lastTok = location.hash;
      if (a === b) return;
      var el = document.getElementById('app'); if (!el) return;
      enter(el);
    });
    var enterT = null;
    var enter = function (el) { clearTimeout(enterT); el.classList.remove('tt-enter'); void el.offsetWidth; el.classList.add('tt-enter'); enterT = setTimeout(function () { el.classList.remove('tt-enter'); }, 1100); };
    var el0 = document.getElementById('app'); if (el0) enter(el0);
  }

  /* ---- keep your place through a reload: scroll position + anything half-typed ---- */
  var KEY = 'tt-keep:' + location.pathname;
  var ss = null; try { ss = window.sessionStorage; ss.setItem('tt-probe', '1'); } catch (e) { ss = null; }
  function fieldKey(el) {
    if (el.id) return '#' + el.id;
    var list = [].slice.call(document.querySelectorAll('textarea,input[type=text],input[type=number],input:not([type])'));
    return '@' + list.indexOf(el);
  }
  function load() { try { return JSON.parse(ss.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(d) { try { ss.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  if (ss) {
    var t = null;
    document.addEventListener('input', function (e) {
      var el = e.target; if (!el.matches || !el.matches('textarea,input[type=text],input[type=number],input:not([type])')) return;
      var d = load(); d.hash = location.hash; d.f = d.f || {}; d.f[location.hash + '|' + fieldKey(el)] = el.value; save(d);
    }, true);
    window.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(function () { var d = load(); d.hash = location.hash; d.y = window.scrollY; save(d); }, 200); }, { passive: true });
    window.addEventListener('pagehide', function () { var d = load(); d.hash = location.hash; d.y = window.scrollY; save(d); });
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') {
      var d0 = load(), tries = 0;
      (function restore() {
        tries++;
        if (d0.hash === location.hash) {
          var f = d0.f || {}, ok = true;
          Object.keys(f).forEach(function (k) {
            var i = k.indexOf('|'); if (k.slice(0, i) !== location.hash) return;
            var fk = k.slice(i + 1), el = null;
            if (fk[0] === '#') el = document.getElementById(fk.slice(1));
            else el = document.querySelectorAll('textarea,input[type=text],input[type=number],input:not([type])')[+fk.slice(1)];
            if (!el) { ok = false; return; }
            if (!el.value && f[k]) { el.value = f[k]; el.dispatchEvent(new Event('input', { bubbles: true })); }
          });
          if (d0.y && document.documentElement.scrollHeight > d0.y + 100) { window.scrollTo(0, d0.y); d0.y = 0; }
          else if (d0.y) ok = false;
          if (ok || tries > 20) return;
        } else if (tries > 20) return;
        setTimeout(restore, 250);
      })();
    }
  }
})();
