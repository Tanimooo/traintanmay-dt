/* TrainTanmay live data sheet.
   A round button in the bottom-right corner while you are doing questions. It opens the sheet you get in
   the exam: on a wide screen it takes the right half, so the question stays usable on the left; on a phone
   it takes the whole screen. Official booklets are PMT PDFs, drawn live with PDF.js (through ttCrop);
   anything else is HTML the app provides.

   Each app sets window.TT_DS_CFG = {
     match(hash)  -> true on pages with questions (the button also shows whenever a paper is open in exam mode)
     sheets(hash) -> [{label, url, pages}  (a PDF; optional pages: [4] shows just those pages, turn: {4: 90} rotates a sideways page clockwise)  |  {label, render(el)}  (HTML)], first one opens by default
   } */
(function () {
  if (window.ttSheet) return;
  var css = document.createElement('style');
  css.textContent =
    '.ttds-fab{position:fixed;right:18px;bottom:18px;z-index:100002;display:flex;align-items:center;gap:8px;height:52px;padding:0 18px 0 14px;border-radius:99px;border:0;cursor:pointer;' +
    'background:var(--brand,#1f5fbf);color:var(--brand-ink,#fff);font:600 15px "IBM Plex Sans",system-ui,sans-serif;box-shadow:0 10px 28px -8px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.18);transition:transform .2s cubic-bezier(.2,.9,.25,1.35),box-shadow .2s}' +
    '.ttds-fab:hover{transform:translateY(-2px)}.ttds-fab:active{transform:scale(.96)}.ttds-fab svg{width:22px;height:22px;flex:none}.ttds-fab[hidden]{display:none}' +
    '.ttds-fab:focus-visible{outline:3px solid #5b9cff;outline-offset:3px}' +
    '@media (max-width:760px){.ttds-fab{right:14px;bottom:14px;height:50px;padding:0 15px 0 12px;font-size:14px}}' +
    '.ttds{position:fixed;top:0;right:0;bottom:0;width:50vw;z-index:100003;display:flex;flex-direction:column;background:#f4f5f7;color:#14161b;border-left:1px solid rgba(120,128,140,.35);' +
    'box-shadow:-18px 0 40px -18px rgba(0,0,0,.35);font:15px "IBM Plex Sans",system-ui,sans-serif;animation:ttdsIn .28s cubic-bezier(.2,.8,.2,1)}' +
    '@keyframes ttdsIn{from{transform:translateX(40px);opacity:0}}' +
    '@media (max-width:760px){.ttds{width:100vw;border-left:0}}' +
    '.ttds-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(120,128,140,.3);background:#fff;flex-wrap:wrap}' +
    '.ttds-head b{font-size:16px;margin-right:auto}' +
    '.ttds-tabs{display:flex;gap:4px;flex-wrap:wrap;order:3;width:100%}' +
    '.ttds-tabs button{font:inherit;font-size:13px;font-weight:600;padding:6px 11px;border-radius:99px;border:1px solid rgba(120,128,140,.4);background:transparent;color:inherit;cursor:pointer}' +
    '.ttds-tabs button[aria-selected=true]{background:#14161b;border-color:#14161b;color:#fff}' +
    '.ttds-head a,.ttds-head .x{font:inherit;font-size:13px;font-weight:600;padding:7px 12px;border-radius:9px;border:1px solid rgba(120,128,140,.4);background:transparent;color:inherit;cursor:pointer;text-decoration:none}' +
    '.ttds-head .x{font-size:18px;line-height:1;padding:6px 11px}' +
    '.ttds-body{flex:1;overflow:auto;padding:14px;overscroll-behavior:contain}' +
    '.ttds-body canvas{display:block;width:100%;background:#fff;border-radius:4px;box-shadow:0 2px 12px rgba(0,0,0,.18);margin:0 auto 12px}' +
    '.ttds-ph{aspect-ratio:1/1.414;background:#e4e6ea;border-radius:4px;margin-bottom:12px}' +
    '.ttds-msg{padding:30px 10px;text-align:center;opacity:.7}' +
    'html.ttds-on body{margin-right:50vw}html.ttds-on .tte{right:50vw}' +
    '@media (max-width:760px){html.ttds-on body{margin-right:0;overflow:hidden}html.ttds-on .tte{right:0}}' +
    '@media (prefers-color-scheme:dark){.ttds{background:#15171c;color:#eceef2}.ttds-head{background:#1b1d22}.ttds-tabs button[aria-selected=true]{background:#eceef2;border-color:#eceef2;color:#14161b}.ttds-ph{background:#262930}}' +
    '@media print{.ttds-fab,.ttds{display:none!important}}';
  document.head.appendChild(css);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h6M8 11h6M8 15h3"/></svg>';
  var fab = null, panel = null, cur = 0, docs = {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function cfg() { return window.TT_DS_CFG || null; }
  function hash() { return location.hash.slice(1); }
  function examOpen() { return !!document.querySelector('.tte'); }
  function wanted() { var c = cfg(); return !!c && (examOpen() || (c.match && c.match(hash()))); }
  function sheets() { var c = cfg(); try { return (c && c.sheets && c.sheets(hash())) || []; } catch (e) { return []; } }

  function sync() {
    if (!document.body) return;
    if (!fab) {
      fab = document.createElement('button'); fab.type = 'button'; fab.className = 'ttds-fab notranslate';
      fab.setAttribute('aria-haspopup', 'dialog'); fab.title = 'Open the exam data sheet';
      fab.innerHTML = ICON + '<span>Data sheet</span>';
      fab.onclick = function () { panel ? close() : open(); };
      document.body.appendChild(fab);
    }
    var on = wanted();
    fab.hidden = !on || !!panel;
    if (!on && panel) close();
  }

  function drawPdf(box, url, noFrame, pages, turn) {
    box.innerHTML = '<div class="ttds-msg">Fetching the official sheet…</div>';
    var fallback = noFrame ? function () {
      box.innerHTML = '<div class="ttds-msg" style="opacity:1"><p style="margin:0 0 12px">This booklet’s website doesn’t let it be shown inside TrainTanmay.</p><a href="' + esc(url) + '" target="_blank" rel="noopener" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#14161b;color:#fff;font-weight:600;text-decoration:none">Open the official booklet ↗</a></div>';
    } : function () { box.innerHTML = '<iframe src="' + esc(url) + '#navpanes=0&view=FitH" title="Data sheet" style="width:100%;height:calc(100% - 4px);min-height:70vh;border:0;background:#fff;border-radius:4px"></iframe>'; };
    var get = docs[url] || (window.ttCrop && window.ttCrop._open ? (docs[url] = window.ttCrop._open(url)) : null);
    if (!get) return fallback();
    get.then(function (doc) {
      if (!box.isConnected) return;
      box.innerHTML = '';
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting || en.target.dataset.done) return; en.target.dataset.done = 1;
          doc.getPage(+en.target.dataset.p).then(function (pg) {
            var w = Math.max(280, box.clientWidth - 28), dpr = Math.min(window.devicePixelRatio || 1, 2.5);
            var rot = ((pg.rotate || 0) + ((turn || {})[en.target.dataset.p] || 0)) % 360;
            var vp0 = pg.getViewport({ scale: 1, rotation: rot }), vp = pg.getViewport({ scale: w / vp0.width * dpr, rotation: rot });
            var c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
            c.setAttribute('aria-label', 'Data sheet page ' + en.target.dataset.p);
            return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () { en.target.replaceWith(c); });
          });
        });
      }, { root: box, rootMargin: '1200px' });
      var want = (pages || []).filter(function (p) { return p >= 1 && p <= doc.numPages; });
      if (!want.length) for (var i = 1; i <= doc.numPages; i++) want.push(i);
      want.forEach(function (p) { var ph = document.createElement('div'); ph.className = 'ttds-ph'; ph.dataset.p = p; box.appendChild(ph); io.observe(ph); });
    }).catch(function () { delete docs[url]; fallback(); });
  }

  function show(i) {
    var list = sheets(); if (!list.length || !panel) return;
    cur = Math.max(0, Math.min(i, list.length - 1));
    var s = list[cur], body = panel.querySelector('.ttds-body'), ext = panel.querySelector('[data-ext]');
    [].forEach.call(panel.querySelectorAll('.ttds-tabs button'), function (b, j) { b.setAttribute('aria-selected', j === cur ? 'true' : 'false'); });
    if (ext) { ext.hidden = !s.url; if (s.url) ext.href = s.url; }
    body.scrollTop = 0;
    if (s.url) drawPdf(body, s.url, s.noFrame, s.pages, s.turn);
    else { body.innerHTML = ''; try { s.render(body); } catch (e) { body.innerHTML = '<div class="ttds-msg">This sheet could not be shown.</div>'; } }
  }

  function open() {
    var list = sheets(); if (!list.length) return;
    close();
    panel = document.createElement('aside'); panel.className = 'ttds'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Data sheet');
    panel.innerHTML = '<div class="ttds-head"><b>Data sheet</b>' +
      (list.length > 1 ? '<div class="ttds-tabs" role="tablist">' + list.map(function (s, j) { return '<button type="button" role="tab" data-i="' + j + '">' + esc(s.label) + '</button>'; }).join('') + '</div>' : '') +
      '<a data-ext target="_blank" rel="noopener" hidden>Open PDF ↗</a><button type="button" class="x" aria-label="Close data sheet" title="Close (Esc)">×</button></div><div class="ttds-body"></div>';
    document.body.appendChild(panel);
    document.documentElement.classList.add('ttds-on');
    [].forEach.call(panel.querySelectorAll('.ttds-tabs button'), function (b) { b.onclick = function () { show(+b.dataset.i); }; });
    panel.querySelector('.x').onclick = close;
    show(Math.min(cur, list.length - 1));
    panel.querySelector('.x').focus({ preventScroll: true });
    sync();
  }
  function close() {
    if (!panel) return;
    panel.remove(); panel = null; document.documentElement.classList.remove('ttds-on');
    sync(); if (fab && !fab.hidden) fab.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel) { e.stopPropagation(); close(); }
  }, true);
  window.addEventListener('hashchange', function () { cur = 0; if (panel && wanted()) show(0); sync(); });
  var start = function () { sync(); new MutationObserver(sync).observe(document.body, { childList: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  window.ttSheet = { open: open, close: close, sync: sync };
})();
