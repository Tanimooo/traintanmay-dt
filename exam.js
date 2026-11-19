/* TrainTanmay paper viewer and exam mode.
   ttExam.view({url, title})                        shows a PDF inside the site (close with × or Esc)
   ttExam.exam({url, title, mins, onEnd(seconds)})  exam conditions: full screen, everything blacked out
                                                    except the paper and a timer at the side. Esc asks
                                                    before leaving; leaving stops the clock and drops back
                                                    to the normal viewer.
   The PDF is fetched live from its source each time (through ttCrop, so the proxy is used where needed). */
(function () {
  if (window.ttExam) return;
  var esc = function (s) { return window.ttLive ? window.ttLive.esc(s) : String(s); };

  var css = document.createElement('style');
  css.textContent =
    '.tte{position:fixed;inset:0;z-index:100001;display:flex;background:#1b1d22;color:#eceef2;font:15px "IBM Plex Sans",system-ui,sans-serif}' +
    '.tte.ex{background:#000}' +
    '.tte-main{flex:1;min-width:0;overflow:auto;padding:16px 12px 40px;scroll-behavior:smooth}' +
    '.tte-pages{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:12px}' +
    '.tte-pages canvas{width:100%;display:block;background:#fff;border-radius:4px;box-shadow:0 4px 24px rgba(0,0,0,.4)}' +
    '.tte-ph{aspect-ratio:1/1.414;background:#2a2d34;border-radius:4px}' +
    '.tte-side{width:240px;flex:none;display:flex;flex-direction:column;gap:14px;padding:20px 18px;border-left:1px solid #2c2f37;background:#121418}' +
    '.tte.ex .tte-side{background:#000;border-color:#1c1c1c}' +
    '.tte-side h2{margin:0;font-size:1rem;line-height:1.3}.tte-side small{opacity:.6}' +
    '.tte-clock{font:700 2.6rem/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.02em;font-variant-numeric:tabular-nums}' +
    '.tte-clock.over{color:#ff6b6b}.tte-clock.low{color:#ffc04d}' +
    '.tte-bar{height:6px;border-radius:6px;background:#2a2d34;overflow:hidden}.tte-bar i{display:block;height:100%;background:#4ade80;transition:width 1s linear}' +
    '.tte button,.tte a.b{font:inherit;font-weight:600;padding:10px 14px;border-radius:10px;border:1px solid #3a3e48;background:#22252c;color:inherit;cursor:pointer;text-align:center;text-decoration:none}' +
    '.tte button:hover,.tte a.b:hover{background:#2b2f38}.tte button.pr{background:#eceef2;color:#14161b;border-color:#eceef2}' +
    '.tte button:focus-visible,.tte a.b:focus-visible{outline:3px solid #5b9cff;outline-offset:2px}' +
    '.tte-x{position:absolute;top:10px;right:14px;z-index:2;width:40px;height:40px;padding:0!important;font-size:1.4rem!important;line-height:1}' +
    '.tte-q{position:absolute;inset:0;z-index:3;display:grid;place-items:center;background:rgba(0,0,0,.82)}' +
    '.tte-q div{width:min(420px,calc(100% - 32px));background:#1b1d22;border:1px solid #3a3e48;border-radius:16px;padding:22px}' +
    '.tte-q h3{margin:0 0 6px;font-size:1.2rem}.tte-q p{margin:0 0 16px;opacity:.8}.tte-q .r{display:flex;gap:8px;flex-wrap:wrap}' +
    '.tte-msg{padding:30px;text-align:center;opacity:.75}' +
    '@media (max-width:760px){.tte{flex-direction:column}.tte-side{width:auto;flex-direction:row;flex-wrap:wrap;align-items:center;border-left:0;border-top:1px solid #2c2f37;order:2;padding:10px 12px;gap:10px}.tte-clock{font-size:1.8rem}.tte-side .tall{display:none}}';
  document.head.appendChild(css);

  var root = null, cleanup = [];
  function close() { cleanup.forEach(function (f) { try { f(); } catch (e) {} }); cleanup = []; if (root) { root.remove(); root = null; } document.documentElement.style.overflow = ''; }

  /* draw every page, lazily as you scroll */
  function pages(box, url) {
    box.innerHTML = '<div class="tte-msg">Fetching the paper live…</div>';
    var fallback = function () { box.innerHTML = '<iframe src="' + esc(url) + '#navpanes=0&view=FitH" style="width:100%;height:calc(100vh - 60px);border:0;background:#fff;border-radius:4px" title="Paper"></iframe>'; };
    if (!window.ttCrop) return fallback();
    window.ttCrop._open(url).then(function (doc) {
      box.innerHTML = '';
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting || en.target.dataset.done) return; en.target.dataset.done = 1;
          var n = +en.target.dataset.p;
          doc.getPage(n).then(function (pg) {
            var w = Math.min(box.clientWidth || 800, 900), dpr = Math.min(window.devicePixelRatio || 1, 2);
            var vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: w / vp0.width * dpr });
            var c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
            return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () { en.target.replaceWith(c); });
          });
        });
      }, { root: box.parentNode, rootMargin: '800px' });
      for (var i = 1; i <= doc.numPages; i++) { var ph = document.createElement('div'); ph.className = 'tte-ph'; ph.dataset.p = i; box.appendChild(ph); io.observe(ph); }
      cleanup.push(function () { io.disconnect(); });
    }).catch(fallback);
  }

  function shell(o, exam) {
    close();
    root = document.createElement('div'); root.className = 'tte' + (exam ? ' ex' : ''); root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', o.title || 'Paper');
    root.innerHTML = '<div class="tte-main"><div class="tte-pages"></div></div><aside class="tte-side"></aside>';
    document.body.appendChild(root); document.documentElement.style.overflow = 'hidden';
    pages(root.querySelector('.tte-pages'), o.url);
    return root;
  }

  function view(o) {
    var r = shell(o, false);
    r.querySelector('.tte-side').innerHTML = '<h2>' + esc(o.title || 'Paper') + '<br><small>Live from ' + esc(o.source || '') + '</small></h2>' +
      (o.note ? '<p style="margin:0;opacity:.8">' + esc(o.note) + '</p>' : '') +
      '<a class="b" href="' + esc(o.url) + '" target="_blank" rel="noopener">Open in new tab ↗</a><button type="button" data-close>Close</button>';
    r.insertAdjacentHTML('beforeend', '<button class="tte-x" type="button" aria-label="Close" data-close>×</button>');
    [].forEach.call(r.querySelectorAll('[data-close]'), function (b) { b.onclick = close; });
    var key = function (e) { if (e.key === 'Escape' && root === r) close(); };
    document.addEventListener('keydown', key); cleanup.push(function () { document.removeEventListener('keydown', key); });
    r.querySelector('[data-close]').focus();
  }

  /* ---- timing is never lost ----
     The running exam is saved every 2 seconds (tt-exam-active, so it's also in "Save progress"). A reload,
     crash or closed tab can be resumed from exactly where the clock was. A finished time stays in
     tt-exam-times until a score is logged with it. */
  var ACTIVE = 'tt-exam-active', TIMES = 'tt-exam-times';
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function active() { return lsGet(ACTIVE); }
  function lastTime(key) { var t = lsGet(TIMES) || {}; return t[key] || null; }
  function clearTime(key) { var t = lsGet(TIMES) || {}; delete t[key]; lsSet(TIMES, t); }

  function exam(o) {
    var r = shell(o, true), total = (o.mins || 90) * 60, used = o.resumeUsed || 0, last = Date.now(), running = true, asking = false, done = false;
    var persist = function () { if (o.key && !done) lsSet(ACTIVE, { key: o.key, url: o.url, title: o.title, source: o.source, mins: o.mins, used: Math.round(used), at: Date.now(), app: appId() }); };
    persist();
    var pv = setInterval(persist, 2000); cleanup.push(function () { clearInterval(pv); });
    var hide = function () { persist(); }; window.addEventListener('pagehide', hide); document.addEventListener('visibilitychange', hide);
    cleanup.push(function () { window.removeEventListener('pagehide', hide); document.removeEventListener('visibilitychange', hide); });
    var fmt = function (s) { var neg = s < 0; s = Math.abs(Math.round(s)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (neg ? '+' : '') + (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
    r.querySelector('.tte-side').innerHTML = '<h2>' + esc(o.title || 'Exam') + '<br><small>' + (o.mins || 90) + ' minutes</small></h2>' +
      '<div class="tte-clock" aria-live="off"></div><div class="tte-bar"><i></i></div>' +
      '<p class="tall" style="margin:0;opacity:.6;font-size:.85rem">Answer on paper. Press Esc to stop.</p>' +
      '<button type="button" data-finish class="pr">Finish</button>';
    var clock = r.querySelector('.tte-clock'), bar = r.querySelector('.tte-bar i');
    var draw = function () { var left = total - used; clock.textContent = fmt(left); clock.classList.toggle('over', left < 0); clock.classList.toggle('low', left >= 0 && left < 300); bar.style.width = Math.max(0, Math.min(100, 100 * used / total)) + '%'; };
    var iv = setInterval(function () { var now = Date.now(); if (running) used += (now - last) / 1000; last = now; draw(); }, 250);
    draw(); cleanup.push(function () { clearInterval(iv); });

    var full = function () { var el = document.documentElement; var f = el.requestFullscreen || el.webkitRequestFullscreen; if (f && !document.fullscreenElement) { try { var p = f.call(el); if (p && p.catch) p.catch(function () {}); } catch (e) {} } };
    var unfull = function () { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {}); };
    var finish = function () {
      if (done) return; running = false; clearInterval(iv);
      var secs = Math.round(used);
      if (o.key) { var t = lsGet(TIMES) || {}; t[o.key] = { secs: secs, at: Date.now(), mins: o.mins }; lsSet(TIMES, t); }
      done = true; lsSet(ACTIVE, null); unfull();
      if (o.onEnd) try { o.onEnd(secs); } catch (e) {}
      view({ url: o.url, title: o.title, source: o.source, note: 'Time used: ' + fmt(secs).replace(/^\+/, '') + '. Mark it now: open the mark scheme from the paper list.' });
    };
    var ask = function () {
      if (asking || done) return; asking = true;
      var q = document.createElement('div'); q.className = 'tte-q';
      q.innerHTML = '<div role="alertdialog" aria-label="Leave the exam?"><h3>Leave the exam?</h3><p>You\'ve used ' + fmt(used).replace(/^\+/, '') + '. Leaving stops the clock and shows the paper normally.</p><div class="r"><button type="button" class="pr" data-k>Keep going</button><button type="button" data-l>Leave</button></div></div>';
      r.appendChild(q); q.querySelector('[data-k]').focus();
      q.querySelector('[data-k]').onclick = function () { q.remove(); asking = false; full(); };
      q.querySelector('[data-l]').onclick = function () { q.remove(); asking = false; finish(); };
    };
    r.querySelector('[data-finish]').onclick = ask;
    // Esc: the browser leaves full screen by itself, so we ask as soon as it does
    var fsc = function () { if (!document.fullscreenElement && !done) ask(); };
    var key = function (e) { if (e.key === 'Escape' && !done && !document.fullscreenElement) { e.preventDefault(); ask(); } };
    document.addEventListener('fullscreenchange', fsc); document.addEventListener('keydown', key);
    cleanup.push(function () { document.removeEventListener('fullscreenchange', fsc); document.removeEventListener('keydown', key); unfull(); });
    full();
  }

  /* An exam that was still running when the page went away: offer to carry on with the same clock. */
  function appId() { return /\/physics\//.test(location.pathname) ? 'physics' : /\/maths\//.test(location.pathname) ? 'maths' : /\/esat\//.test(location.pathname) ? 'esat' : 'dt'; }
  function offerResume(start) {
    var a = active(); if (!a || document.querySelector('.tte-res') || root) return;
    if (a.app && a.app !== appId()) return; // it belongs to another app: that app will offer it
    var mins = Math.floor((a.used || 0) / 60);
    var bar = document.createElement('div'); bar.className = 'tte-res'; bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 12px 10px 16px;border-radius:12px;background:#14161b;color:#fff;font:14px "IBM Plex Sans",system-ui,sans-serif;box-shadow:0 12px 30px -10px rgba(0,0,0,.5);max-width:calc(100vw - 24px)';
    bar.innerHTML = '<span>Unfinished exam: <b>' + esc(a.title || 'paper') + '</b> · ' + mins + ' min used</span><button type="button" data-go>Carry on</button><button type="button" data-stop>Stop and keep the time</button>';
    [].forEach.call(bar.querySelectorAll('button'), function (b) { b.style.cssText = 'font:inherit;font-weight:600;border:0;border-radius:8px;padding:6px 12px;cursor:pointer;background:' + (b.hasAttribute('data-go') ? '#fff;color:#14161b' : '#2b2f38;color:#fff'); });
    bar.querySelector('[data-go]').onclick = function () { bar.remove(); (start || exam)({ key: a.key, url: a.url, title: a.title, source: a.source, mins: a.mins, resumeUsed: a.used || 0 }); };
    bar.querySelector('[data-stop]').onclick = function () { var t = lsGet(TIMES) || {}; t[a.key] = { secs: a.used || 0, at: Date.now(), mins: a.mins }; lsSet(TIMES, t); lsSet(ACTIVE, null); bar.remove(); };
    document.body.appendChild(bar);
  }

  window.ttExam = { view: view, exam: exam, close: close, active: active, lastTime: lastTime, clearTime: clearTime, offerResume: offerResume };
  // any link marked data-ttview (live paper cards, "Whole paper" under crops) opens here in the site
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-ttview]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); view({ url: a.href.split('#')[0], title: a.getAttribute('data-ttview') || 'Paper', source: a.getAttribute('data-src') || '' });
  });
  // every app: if an exam was cut off, offer to carry on (an app with its own handler gets in first)
  setTimeout(function () { offerResume(); }, 1500);
})();
