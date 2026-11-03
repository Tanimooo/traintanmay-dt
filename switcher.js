/* TrainTanmay app switcher: click the logo (top left) to pick D&T, Physics or ESAT. */
(function () {
  var me = document.currentScript && document.currentScript.src || '';
  var base = me.replace(/switcher\.js.*$/, '');
  var here = /help\.html$/.test(location.pathname) ? 'help' : /\/physics\//.test(location.pathname) ? 'physics' : /\/esat\//.test(location.pathname) ? 'esat' : 'dt';
  var APPS = [
    { id: 'dt', name: 'Design & Technology', sub: 'Edexcel 9DT0', tile: '#1f5fbf', ink: '#fff', t: '#bcd4ff', href: base },
    { id: 'physics', name: 'Physics', sub: 'OCR A H556', tile: '#c81e66', ink: '#fff', t: '#ffd0e4', href: base + 'physics/' },
    { id: 'esat', name: 'ESAT', sub: 'ENGAA · NSAA · TMUA', tile: '#ffc917', ink: '#1d1600', t: '#9a6200', href: base + 'esat/' },
    { id: 'help', name: 'How to use TrainTanmay', sub: 'What each app is for · tips', tile: '#3b3f48', ink: '#fff', t: '#c9ccd3', href: base + 'help.html' }
  ];
  function logo(a) {
    return '<svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="11" fill="' + a.tile + '"/><path d="M8 10h22v6h-7.6v24h-6.8V16H8z" fill="' + a.ink + '"/><path d="M33.2 19.5h5.2v4.6h4.2v4.3h-4.2v6.4c0 1.4.6 1.9 1.9 1.9.8 0 1.6-.1 2.3-.3v4.3c-1 .3-2.3.5-3.6.5-3.9 0-5.8-1.9-5.8-5.6v-7.2H30.6v-4.3h2.6z" fill="' + a.t + '"/></svg>';
  }
  var css = document.createElement('style');
  css.textContent =
    '.tt-sw{position:fixed;z-index:99999;min-width:250px;background:#fff;color:#111;border:1px solid #d0d4dc;border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.18);padding:6px;font:14px system-ui,-apple-system,sans-serif}' +
    '.tt-sw a{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:8px;color:inherit;text-decoration:none}' +
    '.tt-sw a:hover,.tt-sw a:focus-visible{background:#f0f2f6}.tt-sw a[aria-current]{background:#eef3fc}' +
    '.tt-sw b{display:block}.tt-sw small{opacity:.65;font-size:12px}.tt-sw .h{padding:6px 10px 4px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.6}' +
    '.tt-sw .home{justify-content:center;border-top:1px solid #e6e8ec;margin-top:4px;border-radius:0 0 8px 8px;font-size:13px}' +
    '@media (prefers-color-scheme:dark){.tt-sw{background:#1b1d22;color:#eee;border-color:#3a3d45}.tt-sw a:hover{background:#2a2d34}.tt-sw a[aria-current]{background:#262b36}.tt-sw .home{border-color:#3a3d45}}';
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
    menu.innerHTML = '<div class="h">Switch app</div>' + APPS.map(function (a) {
      return '<a role="menuitem" href="' + a.href + '"' + (a.id === here ? ' aria-current="page"' : '') + '>' + logo(a) + '<span><b>' + a.name + '</b><small>' + a.sub + '</small></span></a>';
    }).join('').replace('<a role="menuitem" href="' + base + 'help.html"', '<div style="border-top:1px solid rgba(128,128,128,.25);margin:4px 0"></div><a role="menuitem" href="' + base + 'help.html"') + '<a role="menuitem" href="https://forms.gle/4aoQFUo7EExBa8et5" target="_blank" rel="noopener" style="gap:10px"><span style="width:34px;height:34px;border-radius:9px;background:#b23a33;color:#fff;display:grid;place-items:center;font-weight:700;flex:none">!</span><span><b>Report a bug or mistake</b><small>Opens a short Google Form</small></span></a>' + (here === 'help' ? '' : '<a class="home" role="menuitem" href="#" data-home>Go to ' + cur.name + ' home</a>');
    menu.style.left = Math.max(8, r.left) + 'px';
    menu.style.top = (r.bottom + 6) + 'px';
    document.body.appendChild(menu);
    var hm = menu.querySelector('[data-home]'); if (hm) hm.onclick = function (e) {
      e.preventDefault(); close();
      var h = brand.getAttribute('href') || '#';
      if (location.hash === h) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = h;
    };
    var first = menu.querySelector('a'); first && first.focus();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.brand');
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
