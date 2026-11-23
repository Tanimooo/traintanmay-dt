/* TrainTanmay PDF tools: zoom, pen, highlighter, eraser and sticky notes on any PDF the site shows.

   ctl = ttAnnot.mount(box, doc, o)   draws every page of a PDF.js doc into box, with a toolbar on top
     o.url     the PDF (marks are kept per paper)
     o.save    true: a Save button, and closing with unsaved marks asks first. false (data booklets):
               the tools work, nothing is ever saved
     o.scroll  the element that scrolls (default: box)
     o.pages   only these pages (default: all)     o.turn  {page: degrees} extra rotation
     o.page    start at this page                  o.maxW  widest a page is drawn at 100% (default 900)
   ctl.confirmClose(cb)  cb(true) once it's fine to close (saved, thrown away, or nothing to save);
                         cb(false) if they chose to keep editing
   ctl.destroy()         stop (unsaved marks stay in memory for this paper until the tab closes)

   Saved marks live in localStorage 'tt-annot-v1', so they are in "Save progress" and Google sync too.
   Points are stored as fractions of the page (×10000), so zoom never moves them. */
(function () {
  if (window.ttAnnot) return;
  var KEY = 'tt-annot-v1';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var PEN = ['#111827', '#dc2626', '#2563eb', '#16a34a'], HL = ['#facc15', '#4ade80', '#f472b6', '#60a5fa'];
  var ICON = {
    move: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5v-8a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8.5a6.5 6.5 0 0 1-6.5 6.5H10a6 6 0 0 1-4.6-2.2L2.8 15.6a1.6 1.6 0 0 1 2.4-2.1L8 16"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    hl: '<path d="M9 15l-4 4h6l2-2"/><path d="M9 15l7-11 4 4-11 7z"/><path d="M3 21h18" stroke-opacity=".5"/>',
    note: '<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/><path d="M8 9h8M8 12.5h5"/>',
    erase: '<path d="M8 20h12"/><path d="M4.5 15.5l9-9a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L12 18H7z"/><path d="M9 11l5 5"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    clear: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    out: '<circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-4-4"/>',
    in: '<circle cx="11" cy="11" r="7"/><path d="M8 11h6M11 8v6M20 20l-4-4"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    save: '<path d="M5 3h11l4 4v14H4V3z"/><path d="M8 3v5h8V3M7 21v-7h10v7"/>'
  };
  var ic = function (k) { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>'; };

  var css = document.createElement('style');
  css.textContent =
    '.tta-bar{position:sticky;top:0;left:0;z-index:5;box-sizing:border-box;user-select:none;-webkit-user-select:none;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding:8px 10px;margin:0 0 12px;' +
    'background:rgba(22,24,29,.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#eceef2;border:1px solid #333743;border-radius:12px;box-shadow:0 8px 24px -10px rgba(0,0,0,.5);font:600 13px "IBM Plex Sans",system-ui,sans-serif}' +
    '.tta-g{display:flex;gap:3px;align-items:center}.tta-g+.tta-g{padding-left:10px;border-left:1px solid #3a3e48}' +
    '.tta-bar button{display:inline-flex;align-items:center;gap:5px;font:inherit;padding:6px 9px;border-radius:8px;border:1px solid transparent;background:transparent;color:inherit;cursor:pointer;min-height:34px}' +
    '.tta-bar button:hover{background:#2b2f38}.tta-bar button[aria-pressed=true]{background:#eceef2;color:#14161b}' +
    '.tta-bar button:focus-visible{outline:3px solid #5b9cff;outline-offset:1px}.tta-bar button:disabled{opacity:.4;cursor:default;background:transparent}' +
    '.tta-sw{width:22px!important;height:22px;min-height:0!important;padding:0!important;border-radius:50%!important;border:2px solid #555!important}' +
    '.tta-sw[aria-pressed=true]{outline:2px solid #eceef2;outline-offset:2px;background:inherit}' +
    '.tta-z{min-width:44px;text-align:center;font-variant-numeric:tabular-nums}' +
    '.tta-save{margin-left:auto;background:#4ade80!important;color:#052e14!important}.tta-save.ok{background:transparent!important;color:#9ca3af!important;border-color:#3a3e48!important}' +
    '.tta-hint{flex-basis:100%;font-weight:500;font-size:12px;opacity:.7}' +
    '@media (max-width:640px){.tta-bar{gap:4px 6px;padding:6px}.tta-bar .tta-l{display:none}.tta-g+.tta-g{padding-left:0;border-left:0}.tta-bar button{padding:5px 7px;min-height:32px}.tta-z{min-width:38px}.tta-save .tta-sl{display:inline}.tta-hint{display:none}}' +
    /* pages sit centred, but a zoomed-in page starts at the left edge so all of it can be scrolled to */
    '.tta-pages{display:flex;flex-direction:column;align-items:flex-start;align-self:stretch;width:100%;gap:12px;padding-bottom:30px}' +
    '.tta-pg{position:relative;margin:0 auto;background:#fff;border-radius:4px;box-shadow:0 4px 24px rgba(0,0,0,.35);flex:none;aspect-ratio:1/1.414;max-width:none!important}' +
    '.tta-pg>canvas{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;display:block;border-radius:4px;box-shadow:none!important}' +
    '.tta-pg>canvas.tta-ink{background:transparent!important}' + // the drawing layer must never hide the page under it
    '.tta-wrap{width:max-content;min-width:100%;box-sizing:border-box}' +
    '.tta-ink{touch-action:auto;pointer-events:none}.tta-pg.draw .tta-ink{pointer-events:auto;touch-action:none;cursor:crosshair}' +
    '.tta-pg.noting .tta-ink{pointer-events:auto;cursor:copy}.tta-pg.erasing .tta-ink{cursor:cell}' +
    '.tta-notes{position:absolute;inset:0;pointer-events:none}' +
    '.tta-note{position:absolute;pointer-events:auto;width:190px;background:#fef08a;color:#1c1917;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.3);font:14px/1.35 "IBM Plex Sans",system-ui,sans-serif;transform:translate(-8px,-8px)}' +
    '.tta-nh{display:flex;align-items:center;justify-content:space-between;padding:3px 4px 3px 8px;cursor:move;touch-action:none;background:#fde047;border-radius:6px 6px 0 0;font-size:11px;font-weight:700;color:#713f12;user-select:none}' +
    '.tta-nh button{font:inherit!important;font-size:16px!important;line-height:1!important;width:24px;height:24px;min-height:0!important;padding:0!important;border:0!important;border-radius:5px!important;background:transparent!important;color:inherit!important;box-shadow:none!important;cursor:pointer}.tta-nh button:hover{background:rgba(0,0,0,.08)}' +
    '.tta-note textarea{display:block;width:100%;min-height:70px;resize:vertical;border:0;background:transparent;padding:6px 8px 8px;font:inherit;color:inherit;box-sizing:border-box;outline:none}' +
    '.tta-dlg{position:fixed;inset:0;z-index:100020;display:grid;place-items:center;background:rgba(0,0,0,.6)}' +
    '.tta-dlg>div{width:min(420px,calc(100% - 32px));background:#1b1d22;color:#eceef2;border:1px solid #3a3e48;border-radius:16px;padding:22px;font:15px "IBM Plex Sans",system-ui,sans-serif}' +
    '.tta-dlg h3{margin:0 0 6px;font-size:1.15rem}.tta-dlg p{margin:0 0 16px;opacity:.8}.tta-dlg .r{display:flex;gap:8px;flex-wrap:wrap}' +
    '.tta-dlg button{font:inherit;font-weight:600;padding:10px 14px;border-radius:10px;border:1px solid #3a3e48;background:#22252c;color:inherit;cursor:pointer}' +
    '.tta-dlg button.pr{background:#4ade80;color:#052e14;border-color:#4ade80}.tta-dlg button.dz{background:#dc2626;border-color:#dc2626;color:#fff}' +
    '.tta-dlg button:focus-visible{outline:3px solid #5b9cff;outline-offset:2px}';
  document.head.appendChild(css);

  /* ---------- storage ---------- */
  function readAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writeAll(all) { try { localStorage.setItem(KEY, JSON.stringify(all)); return true; } catch (e) { return false; } }
  var drafts = {}; // url -> {data, dirty}: unsaved marks survive the exam → paper hand-over and reopening in the same tab
  function blank() { return { p: {} }; }
  function isEmpty(d) { return !Object.keys(d.p).some(function (k) { return (d.p[k].s || []).length || (d.p[k].n || []).length; }); }

  /* a small dialog: buttons [{label, kind:'pr'|'dz'|'', fn}], Esc = the last button */
  function dialog(title, text, buttons) {
    var d = document.createElement('div'); d.className = 'tta-dlg';
    d.innerHTML = '<div role="alertdialog" aria-modal="true" aria-label="' + esc(title) + '"><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p><div class="r"></div></div>';
    var row = d.querySelector('.r'), done = function (fn) { d.remove(); document.removeEventListener('keydown', key, true); if (fn) fn(); };
    buttons.forEach(function (b) { var x = document.createElement('button'); x.type = 'button'; x.textContent = b.label; if (b.kind) x.className = b.kind; x.onclick = function () { done(b.fn); }; row.appendChild(x); });
    var key = function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(buttons[buttons.length - 1].fn); } };
    document.addEventListener('keydown', key, true);
    d.onclick = function (e) { if (e.target === d) done(buttons[buttons.length - 1].fn); };
    document.body.appendChild(d); row.firstChild.focus();
    return d;
  }
  function toast(m) {
    var t = document.createElement('div'); t.textContent = m; t.setAttribute('role', 'status');
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100030;padding:10px 16px;border-radius:10px;background:#14161b;color:#fff;font:600 14px "IBM Plex Sans",system-ui,sans-serif;box-shadow:0 10px 30px -10px rgba(0,0,0,.5)';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }

  function mount(box, doc, o) {
    o = o || {};
    var url = String(o.url || '').split('#')[0], canSave = o.save !== false, scroller = o.scroll || box, maxW = o.maxW || 900;
    var dr = drafts[url];
    var data = dr ? dr.data : (canSave && readAll()[url]) || blank(), dirty = dr ? dr.dirty : false;
    if (!data.p) data = blank();
    var undo = [], tool = 'move', col = { pen: PEN[0], hl: HL[0] }, zoom = 1, dead = false;
    var keep = function () { drafts[url] = { data: data, dirty: dirty }; };
    var touched = function () { dirty = true; keep(); syncBar(); };
    var snap = function () { undo.push(JSON.stringify(data)); if (undo.length > 60) undo.shift(); };
    var pg = function (n) { return data.p[n] || (data.p[n] = { s: [], n: [] }); };

    box.innerHTML = '';
    var bar = document.createElement('div'); bar.className = 'tta-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'PDF tools');
    var list = document.createElement('div'); list.className = 'tta-pages';
    // everything sits in one wrapper as wide as the widest (zoomed) page, so the toolbar can stay put while you scroll sideways
    var wrap = document.createElement('div'); wrap.className = 'tta-wrap';
    wrap.appendChild(bar); wrap.appendChild(list); box.appendChild(wrap);
    var B = function (k, label, attrs) { return '<button type="button" ' + attrs + ' title="' + esc(label) + '" aria-label="' + esc(label) + '">' + ic(k) + '<span class="tta-l">' + esc(label.split(' (')[0]) + '</span></button>'; };
    bar.innerHTML =
      '<div class="tta-g" role="group" aria-label="Tool">' + B('move', 'Scroll', 'data-tool="move"') + B('pen', 'Pen', 'data-tool="pen"') + B('hl', 'Highlight', 'data-tool="hl"') + B('note', 'Sticky note', 'data-tool="note"') + B('erase', 'Eraser', 'data-tool="erase"') + '</div>' +
      '<div class="tta-g tta-cols" role="group" aria-label="Colour"></div>' +
      '<div class="tta-g">' + B('undo', 'Undo (Ctrl+Z)', 'data-act="undo"') + B('clear', 'Clear', 'data-act="clear"') + '</div>' +
      '<div class="tta-g" role="group" aria-label="Zoom"><button type="button" data-act="out" title="Zoom out (Ctrl −)" aria-label="Zoom out">' + ic('out') + '</button><span class="tta-z" aria-live="polite">100%</span><button type="button" data-act="in" title="Zoom in (Ctrl +)" aria-label="Zoom in">' + ic('in') + '</button><button type="button" data-act="fit" title="Fit to width" aria-label="Fit to width">' + ic('fit') + '</button></div>' +
      (canSave ? '<button type="button" class="tta-save" data-act="save" title="Save your marks on this paper (in this browser and in Save progress)">' + ic('save') + '<span class="tta-sl">Save</span></button>' : '<span class="tta-hint" style="flex-basis:auto;margin-left:auto">Marks on data sheets aren\'t saved</span>');
    var $ = function (s) { return bar.querySelector(s); };

    function syncBar() {
      [].forEach.call(bar.querySelectorAll('[data-tool]'), function (b) { b.setAttribute('aria-pressed', b.dataset.tool === tool ? 'true' : 'false'); });
      var cols = $('.tta-cols'), set = tool === 'pen' ? PEN : tool === 'hl' ? HL : null;
      cols.style.display = set ? '' : 'none';
      if (set) cols.innerHTML = set.map(function (c) { return '<button type="button" class="tta-sw" data-col="' + c + '" style="background:' + c + '" aria-label="Colour ' + c + '" aria-pressed="' + (col[tool] === c) + '"></button>'; }).join('');
      $('[data-act="undo"]').disabled = !undo.length;
      $('[data-act="clear"]').disabled = isEmpty(data);
      $('.tta-z').textContent = Math.round(zoom * 100) + '%';
      var sv = $('[data-act="save"]');
      if (sv) { sv.classList.toggle('ok', !dirty); sv.querySelector('.tta-sl').textContent = dirty ? 'Save' : 'Saved'; sv.disabled = !dirty; }
      pages.forEach(function (w) { w.el.classList.toggle('draw', tool === 'pen' || tool === 'hl' || tool === 'erase'); w.el.classList.toggle('erasing', tool === 'erase'); w.el.classList.toggle('noting', tool === 'note'); });
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.tool) { tool = b.dataset.tool; syncBar(); return; }
      if (b.dataset.col) { col[tool] = b.dataset.col; syncBar(); return; }
      var a = b.dataset.act;
      if (a === 'undo') doUndo();
      else if (a === 'clear') dialog('Clear everything?', 'This removes every drawing, highlight and sticky note on this paper. You can still press Undo straight after.', [
        { label: 'Clear all', kind: 'dz', fn: function () { snap(); data.p = {}; touched(); redrawAll(); } }, { label: 'Cancel' }]);
      else if (a === 'in') setZoom(zoom * 1.25); else if (a === 'out') setZoom(zoom / 1.25); else if (a === 'fit') setZoom(1);
      else if (a === 'save') save();
    });
    function doUndo() { if (!undo.length) return; data = JSON.parse(undo.pop()); dirty = true; keep(); redrawAll(); syncBar(); }
    function save() {
      if (!canSave) return true;
      var all = readAll(); if (isEmpty(data)) delete all[url]; else { data.at = Date.now(); all[url] = data; }
      if (!writeAll(all)) { toast('Couldn\'t save: this browser\'s storage is full'); return false; }
      dirty = false; delete drafts[url]; syncBar(); toast('Saved'); return true;
    }

    /* ---------- pages ---------- */
    var nums = (o.pages && o.pages.length ? o.pages : Array.apply(null, Array(doc.numPages)).map(function (_, i) { return i + 1; })).filter(function (p) { return p >= 1 && p <= doc.numPages; });
    var pages = nums.map(function (p) {
      var el = document.createElement('div'); el.className = 'tta-pg'; el.dataset.p = p;
      var ink = document.createElement('canvas'); ink.className = 'tta-ink';
      var notes = document.createElement('div'); notes.className = 'tta-notes';
      el.appendChild(ink); el.appendChild(notes); list.appendChild(el);
      var w = { el: el, p: p, ink: ink, notes: notes, pdf: null, rw: 0, busy: false, again: false, ratio: 1.414 };
      el.ttw = w; bindInk(w); return w;
    });
    var baseW = function () { return Math.max(240, Math.min((scroller.clientWidth || box.clientWidth || 800) - 24, maxW)); };
    function sizeAll() {
      var bw = baseW() * zoom; pages.forEach(function (w) { w.el.style.width = Math.round(bw) + 'px'; });
      var cs = getComputedStyle(scroller), pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0), mr = parseFloat(getComputedStyle(bar).marginRight) || 0;
      bar.style.width = Math.max(220, scroller.clientWidth - pad - mr) + 'px';
    }
    function render(w) {
      if (dead) return;
      var need = w.el.clientWidth; if (!need) return;
      if (w.busy) { w.again = true; return; }
      if (w.pdf && Math.abs(w.rw - need) / need < 0.08) { sizeInk(w); return; }
      w.busy = true;
      doc.getPage(w.p).then(function (page) {
        var rot = ((page.rotate || 0) + ((o.turn || {})[w.p] || 0)) % 360, vp0 = page.getViewport({ scale: 1, rotation: rot });
        w.ratio = vp0.height / vp0.width; w.el.style.aspectRatio = vp0.width + ' / ' + vp0.height;
        var dpr = Math.min(window.devicePixelRatio || 1, 2), px = Math.min(w.el.clientWidth * dpr, 3000); // big zooms stay sharp without huge canvases
        var vp = page.getViewport({ scale: px / vp0.width, rotation: rot });
        var c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
        c.setAttribute('aria-label', 'Page ' + w.p);
        return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
          if (w.pdf) w.pdf.replaceWith(c); else w.el.insertBefore(c, w.el.firstChild);
          w.pdf = c; w.rw = w.el.clientWidth; sizeInk(w);
        });
      }).catch(function () {}).then(function () { w.busy = false; if (w.again) { w.again = false; render(w); } });
    }
    var vis = new Set();
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { var w = en.target.ttw; if (en.isIntersecting) { vis.add(w); render(w); } else vis.delete(w); });
    }, { root: scroller === document.documentElement ? null : scroller, rootMargin: '900px 0px' });
    pages.forEach(function (w) { io.observe(w.el); renderNotes(w); });

    var zt = null;
    function setZoom(z) {
      z = Math.max(0.5, Math.min(3, z)); if (Math.abs(z - zoom) < 0.001) return;
      var fy = scroller.scrollHeight ? (scroller.scrollTop + scroller.clientHeight / 2) / scroller.scrollHeight : 0;
      var fx = scroller.scrollWidth ? (scroller.scrollLeft + scroller.clientWidth / 2) / scroller.scrollWidth : 0.5;
      zoom = z; sizeAll(); syncBar();
      scroller.scrollTop = fy * scroller.scrollHeight - scroller.clientHeight / 2;
      scroller.scrollLeft = fx * scroller.scrollWidth - scroller.clientWidth / 2;
      pages.forEach(sizeInk);
      clearTimeout(zt); zt = setTimeout(function () { vis.forEach(render); }, 220);
    }
    // Ctrl + wheel / trackpad pinch, and Ctrl + − 0 inside the viewer
    var wheel = function (e) { if (!e.ctrlKey) return; e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); };
    scroller.addEventListener('wheel', wheel, { passive: false });
    var keys = function (e) {
      if (!box.isConnected || e.target.closest && e.target.closest('textarea,input')) return;
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) { e.preventDefault(); setZoom(zoom * 1.25); }
      else if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); setZoom(zoom / 1.25); }
      else if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); setZoom(1); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); doUndo(); }
    };
    document.addEventListener('keydown', keys);
    var rs = function () { sizeAll(); pages.forEach(sizeInk); clearTimeout(zt); zt = setTimeout(function () { vis.forEach(render); }, 220); };
    window.addEventListener('resize', rs);

    /* ---------- ink ---------- */
    function sizeInk(w) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.round(w.el.clientWidth * dpr), H = Math.round(w.el.clientHeight * dpr);
      if (!W || !H) return;
      if (w.ink.width !== W || w.ink.height !== H) { w.ink.width = W; w.ink.height = H; }
      drawInk(w);
    }
    function stroke(g, s, W, H) {
      var d = s.d; if (!d || d.length < 2) return;
      g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = s.c; g.lineWidth = Math.max(1, s.w * W);
      if (s.t === 'h') g.globalAlpha = 0.38;
      g.beginPath(); g.moveTo(d[0] / 1e4 * W, d[1] / 1e4 * H);
      if (d.length === 2) g.lineTo(d[0] / 1e4 * W + 0.1, d[1] / 1e4 * H);
      for (var i = 2; i < d.length; i += 2) g.lineTo(d[i] / 1e4 * W, d[i + 1] / 1e4 * H);
      g.stroke(); g.restore();
    }
    function drawInk(w, live) {
      var g = w.ink.getContext('2d'), W = w.ink.width, H = w.ink.height; g.clearRect(0, 0, W, H);
      var s = (data.p[w.p] || {}).s || [];
      s.forEach(function (x) { if (x.t === 'h') stroke(g, x, W, H); }); // highlights underneath the pen
      if (live && live.t === 'h') stroke(g, live, W, H);
      s.forEach(function (x) { if (x.t !== 'h') stroke(g, x, W, H); });
      if (live && live.t !== 'h') stroke(g, live, W, H);
    }
    function redrawAll() { pages.forEach(function (w) { drawInk(w); renderNotes(w); }); }
    function bindInk(w) {
      var cur = null, raf = 0, at = function (e) { var r = w.ink.getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))]; };
      var erase = function (pt) {
        var s = (data.p[w.p] || {}).s; if (!s || !s.length) return false;
        var R = 0.014, hit = false;
        for (var i = s.length - 1; i >= 0; i--) {
          var d = s[i].d, rr = R + s[i].w / 2;
          for (var j = 0; j < d.length; j += 2) { var dx = d[j] / 1e4 - pt[0], dy = (d[j + 1] / 1e4 - pt[1]) * w.ratio; if (dx * dx + dy * dy < rr * rr) { if (!hit) snap(); hit = true; s.splice(i, 1); break; } }
        }
        if (hit) { touched(); drawInk(w); } return hit;
      };
      w.ink.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        var pt = at(e);
        if (tool === 'note') { e.preventDefault(); snap(); pg(w.p).n.push({ x: +pt[0].toFixed(4), y: +pt[1].toFixed(4), t: '' }); touched(); renderNotes(w, true); return; }
        if (tool !== 'pen' && tool !== 'hl' && tool !== 'erase') return;
        e.preventDefault(); w.ink.setPointerCapture(e.pointerId);
        if (tool === 'erase') { cur = { erase: true }; erase(pt); return; }
        cur = { t: tool === 'hl' ? 'h' : 'p', c: col[tool], w: tool === 'hl' ? 0.016 : 0.0025, d: [Math.round(pt[0] * 1e4), Math.round(pt[1] * 1e4)] };
        drawInk(w, cur);
      });
      w.ink.addEventListener('pointermove', function (e) {
        if (!cur) return; var pt = at(e);
        if (cur.erase) { erase(pt); return; }
        var d = cur.d, lx = d[d.length - 2] / 1e4, ly = d[d.length - 1] / 1e4;
        if (Math.abs(pt[0] - lx) + Math.abs(pt[1] - ly) * w.ratio < 0.0018) return; // skip tiny moves: smaller saves, same look
        d.push(Math.round(pt[0] * 1e4), Math.round(pt[1] * 1e4));
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; if (cur) drawInk(w, cur); });
      });
      var end = function () {
        if (!cur) return; var c = cur; cur = null;
        if (c.erase) return;
        snap(); pg(w.p).s.push(c); touched(); drawInk(w);
      };
      w.ink.addEventListener('pointerup', end); w.ink.addEventListener('pointercancel', end);
    }

    /* ---------- sticky notes ---------- */
    function renderNotes(w, focusLast) {
      w.notes.innerHTML = '';
      var ns = (data.p[w.p] || {}).n || [];
      ns.forEach(function (n, i) {
        var el = document.createElement('div'); el.className = 'tta-note'; el.style.left = n.x * 100 + '%'; el.style.top = n.y * 100 + '%';
        el.innerHTML = '<div class="tta-nh"><span>Note · drag to move</span><button type="button" aria-label="Delete note" title="Delete note">×</button></div><textarea aria-label="Sticky note" placeholder="Type a note…"></textarea>';
        var ta = el.querySelector('textarea'); ta.value = n.t || '';
        var typed = false;
        ta.addEventListener('focus', function () { typed = false; });
        ta.addEventListener('input', function () { if (!typed) { snap(); typed = true; } n.t = ta.value; touched(); });
        el.querySelector('button').onclick = function () { snap(); ns.splice(i, 1); touched(); renderNotes(w); };
        var h = el.querySelector('.tta-nh'), drag = null;
        h.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; e.preventDefault(); h.setPointerCapture(e.pointerId); drag = { moved: false }; });
        h.addEventListener('pointermove', function (e) {
          if (!drag) return; var r = w.el.getBoundingClientRect();
          if (!drag.moved) { snap(); drag.moved = true; }
          n.x = +Math.max(0, Math.min(0.98, (e.clientX - r.left) / r.width)).toFixed(4); n.y = +Math.max(0, Math.min(0.98, (e.clientY - r.top) / r.height)).toFixed(4);
          el.style.left = n.x * 100 + '%'; el.style.top = n.y * 100 + '%';
        });
        var stop = function () { if (drag && drag.moved) touched(); drag = null; };
        h.addEventListener('pointerup', stop); h.addEventListener('pointercancel', stop);
        w.notes.appendChild(el);
        if (focusLast && i === ns.length - 1) setTimeout(function () { ta.focus(); }, 0);
      });
    }

    sizeAll(); syncBar();
    if (o.page) { var start = pages.filter(function (w) { return w.p === o.page; })[0]; if (start) setTimeout(function () { start.el.scrollIntoView({ block: 'start' }); }, 80); }

    return {
      el: bar,
      dirty: function () { return canSave && dirty; },
      save: save,
      /* closing: ask only when there are unsaved marks on a paper that can be saved */
      confirmClose: function (cb) {
        if (!canSave || !dirty) return cb(true);
        dialog('Save your marks?', 'You\'ve drawn, highlighted or written notes on this paper since you last saved.', [
          { label: 'Save', kind: 'pr', fn: function () { cb(save()); } },
          { label: 'Don\'t save', fn: function () { dirty = false; delete drafts[url]; cb(true); } },
          { label: 'Keep editing', fn: function () { cb(false); } }]);
      },
      destroy: function () {
        dead = true; io.disconnect(); clearTimeout(zt);
        scroller.removeEventListener('wheel', wheel); document.removeEventListener('keydown', keys); window.removeEventListener('resize', rs);
      }
    };
  }

  // data booklets: their marks are only kept while the sheet is open
  window.ttAnnot = { mount: mount, forget: function (url) { delete drafts[String(url || '').split('#')[0]]; } };
})();
