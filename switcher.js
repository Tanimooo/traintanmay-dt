/* TrainTanmay app switcher: click the logo (top left) to pick D&T, Physics or ESAT. */
(function () {
  var me = document.currentScript && document.currentScript.src || '';
  var base = me.replace(/switcher\.js.*$/, '');
  var here = /\/physics\//.test(location.pathname) ? 'physics' : /\/esat\//.test(location.pathname) ? 'esat' : 'dt';
  var APPS = [
    { id: 'dt', name: 'Design & Technology', sub: 'Edexcel 9DT0', tile: '#1f5fbf', ink: '#fff', t: '#bcd4ff', href: base },
    { id: 'physics', name: 'Physics', sub: 'OCR A H556', tile: '#c81e66', ink: '#fff', t: '#ffd0e4', href: base + 'physics/' },
    { id: 'esat', name: 'ESAT', sub: 'ENGAA · NSAA · TMUA', tile: '#ffc917', ink: '#1d1600', t: '#9a6200', href: base + 'esat/' }
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
    var cur = APPS.filter(function (a) { return a.id === here; })[0];
    menu.innerHTML = '<div class="h">Switch app</div>' + APPS.map(function (a) {
      return '<a role="menuitem" href="' + a.href + '"' + (a.id === here ? ' aria-current="page"' : '') + '>' + logo(a) + '<span><b>' + a.name + '</b><small>' + a.sub + '</small></span></a>';
    }).join('') + '<a class="home" role="menuitem" href="#" data-home>Go to ' + cur.name + ' home</a>';
    menu.style.left = Math.max(8, r.left) + 'px';
    menu.style.top = (r.bottom + 6) + 'px';
    document.body.appendChild(menu);
    menu.querySelector('[data-home]').onclick = function (e) {
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
})();
