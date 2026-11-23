/* TrainTanmay live sources.
   No exam question is stored on this site. Every question is shown straight from the place that
   publishes it (the exam board, UAT-UK, PMT, Madas Maths, Mr Further Maths), fetched by your browser
   when you open it. This file draws that "live paper" card for every app.

   ttLive.card({url, page, ms, msPage, q, source, title, embed})  -> HTML string
     url      the official PDF                    page    page the question starts on (optional)
     ms       mark scheme / answers PDF (optional) msPage  page in the mark scheme (optional)
     q        question label, e.g. "3(b)"          source  who publishes it, e.g. "Pearson Edexcel"
     embed    false when the source does not allow being shown inside another site (Pearson)
     frame    false: never show the whole PDF inside the page (question pages, where a scrolling paper is no use)
     alt      {url, label} a second place the same paper lives, e.g. the exam board's official copy */
(function () {
  if (window.ttLive) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var at = function (url, page) { return url ? url.split('#')[0] + (page ? '#page=' + page : '') : ''; };
  var host = function (url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  /* phones and tablets can't show a PDF inside a page, so they get a big button instead */
  var canEmbed = function () { return !matchMedia('(pointer:coarse)').matches && innerWidth >= 760; };

  var css = document.createElement('style');
  css.textContent =
    '.ttl{border:1px solid var(--ttl-line,rgba(128,128,128,.28));border-radius:14px;overflow:hidden;background:var(--ttl-bg,transparent)}' +
    '.ttl-h{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;justify-content:space-between;padding:12px 14px}' +
    '.ttl-h b{font-size:1rem}.ttl-h small{display:block;opacity:.7;font-size:.8rem;margin-top:2px}' +
    '.ttl-b{display:flex;flex-wrap:wrap;gap:8px}' +
    '.ttl-b a{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:.88rem;font-weight:600;padding:8px 12px;border-radius:10px;text-decoration:none;border:1px solid rgba(128,128,128,.35);color:inherit;background:transparent}' +
    '.ttl-b a.p{background:var(--ttl-acc,#1f5fbf);border-color:var(--ttl-acc,#1f5fbf);color:#fff}' +
    '.ttl-b a:hover{filter:brightness(1.06)}.ttl-b a:focus-visible{outline:3px solid #5b9cff;outline-offset:2px}' +
    '.ttl iframe{display:block;width:100%;height:min(78vh,900px);border:0;border-top:1px solid rgba(128,128,128,.22);background:#fff}' +
    '.ttl-n{padding:10px 14px;border-top:1px solid rgba(128,128,128,.22);font-size:.82rem;opacity:.75}' +
    '.ttl-tap{display:block;margin:0 14px 14px;padding:16px;border-radius:12px;text-align:center;font-weight:700;text-decoration:none;background:var(--ttl-acc,#1f5fbf);color:#fff}';
  document.head.appendChild(css);

  function card(o) {
    o = o || {};
    if (!o.url) return '<div class="ttl"><div class="ttl-h"><span><b>' + (o.q ? 'Question ' + esc(o.q) + ' · ' : '') + 'no direct link to this paper</b><small>' + (o.home ? 'Find “' + esc(o.title || 'it') + '” on ' + esc(o.source || host(o.home)) + ', or ask your teacher for a copy.' : 'Ask your teacher for a copy.') + '</small></span>' +
      (o.home ? '<span class="ttl-b"><a class="p" href="' + esc(o.home) + '" target="_blank" rel="noopener">Go to ' + esc(o.source || host(o.home)) + ' ↗</a></span>' : '') + '</div></div>';
    var src = o.source || host(o.url), qp = at(o.url, o.page), ms = at(o.ms, o.msPage);
    var label = (o.q ? 'Question ' + esc(o.q) : esc(o.title || 'Paper')) + (o.page ? ' · page ' + o.page : '');
    var embed = o.embed !== false && o.frame !== false && canEmbed();
    var h = '<div class="ttl"><div class="ttl-h"><span><b>' + label + '</b><small>' + (o.q && o.title ? esc(o.title) + ' · ' : '') + 'Live from ' + esc(src) + '</small></span>' +
      '<span class="ttl-b"><a class="p" href="' + esc(qp) + '" target="_blank" rel="noopener" data-ttview="' + esc(o.title || 'Paper') + '" data-src="' + esc(src) + '">Open paper</a>' +
      (ms ? '<a href="' + esc(ms) + '" target="_blank" rel="noopener" data-ttview="' + esc((o.title || 'Paper') + ' · ' + (o.msLabel || 'mark scheme')) + '" data-src="' + esc(src) + '">' + esc(o.msLabel || 'Mark scheme') + '</a>' : '') +
      (o.alt ? '<a href="' + esc(at(o.alt.url, o.page)) + '" target="_blank" rel="noopener">' + esc(o.alt.label) + ' ↗</a>' : '') + '</span></div>';
    if (embed) h += '<iframe loading="lazy" src="' + esc(qp + (o.page ? '&' : '#') + 'navpanes=0&view=FitH') + '" title="' + esc(label) + ' from ' + esc(src) + '"></iframe>';
    else if (o.frame === false) h += '<div class="ttl-n">This question couldn\'t be cut out of the paper on its own, so open the paper' + (o.page ? ' (page ' + o.page + ')' : '') + ' and find question ' + esc(o.q || '') + '.</div><a class="ttl-tap" href="' + esc(qp) + '" target="_blank" rel="noopener" data-ttview="' + esc(o.title || 'Paper') + '" data-src="' + esc(src) + '">Open the paper</a>';
    else if (o.embed === false) h += '<div class="ttl-n">' + esc(src) + ' doesn\'t let other sites show its papers, so it opens in a new tab' + (o.page ? ' at page ' + o.page : '') + '.</div>';
    else h += '<a class="ttl-tap" href="' + esc(qp) + '" target="_blank" rel="noopener">Tap to open ' + (o.q ? 'question ' + esc(o.q) : 'the paper') + (o.page ? ' (page ' + o.page + ')' : '') + '</a>';
    return h + '</div>';
  }
  window.ttLive = { card: card, at: at, esc: esc };

  /* Back button = the pop-up's ×.
     Each pop-up (paper viewer, exam, worked solutions, data sheet, menu) adds one step to the browser
     history while it is open, with the same address. Pressing Back (phone back gesture, mouse back
     button, browser arrow) then only removes that step: the pop-up gets onBack() and closes itself
     (an exam asks "Leave the exam?" instead), and the page underneath doesn't change.
       h = ttBack.open(onBack)   when a pop-up opens
       ttBack.done(h, then)      when it closes some other way (×, Esc); `then` runs once the history step is gone */
  var stack = [], skips = [];
  function bOpen(onBack) {
    var h = { id: 'ov' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), onBack: onBack };
    try { history.pushState({ ttov: h.id }, ''); } catch (e) {}
    stack.push(h); return h;
  }
  function bDone(h, then) {
    var i = stack.indexOf(h); if (i >= 0) stack.splice(i, 1);
    if (h && i >= 0 && history.state && history.state.ttov === h.id) { skips.push(then || null); history.back(); }
    else if (then) then();
  }
  window.addEventListener('popstate', function (e) {
    if (skips.length) { var f = skips.shift(); if (f) f(); return; }
    var top = stack[stack.length - 1]; if (!top) return;
    if (e.state && e.state.ttov === top.id) return; // went forward onto this pop-up's own step
    stack.pop(); try { top.onBack(); } catch (er) {}
  });
  window.ttBack = { open: bOpen, done: bDone, isOpen: function () { return stack.length > 0; } };
})();
