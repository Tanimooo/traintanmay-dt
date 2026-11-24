/* TrainTanmay real-world clock.
   Study time (league.js) and Focus sessions (focusbar.js, focus/) run on real time, not the device clock, so a
   wrong or changed clock can't add or lose study time, or move the weekly reset.
   How: a tiny HEAD request to this site (cache-busted, and skipped by the service worker, which only handles GET)
   returns the server's Date header. The gap between that and the device clock is the offset; now() = device + offset.
   The offset is kept (tt-clock) so pages start with it, and re-checked on load, every 15 minutes, when a tab comes
   back, when the network returns, and whenever the device clock jumps (compared against the monotonic clock).
   Offline, it keeps the last offset it had. ready turns true after the first check (or 5 seconds if offline);
   anything that credits time waits for it. */
(function () {
  if (window.ttClock) return;
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/ttclock\.js.*$/, '');
  var K = 'tt-clock';
  var saved = null; try { saved = JSON.parse(localStorage.getItem(K) || 'null'); } catch (e) {}
  var off = saved && typeof saved.off === 'number' ? saved.off : 0;
  var synced = false, ready = false, inflight = null, lastSync = 0, waiters = [];
  var lastW = Date.now(), lastM = performance.now();

  function markReady() { if (ready) return; ready = true; var w = waiters; waiters = []; w.forEach(function (f) { try { f(); } catch (e) {} }); }
  function sync() {
    if (inflight) return inflight;
    var t0 = Date.now(), m0 = performance.now();
    inflight = fetch(BASE + 'manifest.webmanifest?clock=' + Math.random().toString(36).slice(2), { method: 'HEAD', cache: 'no-store' })
      .then(function (r) {
        var d = Date.parse(r.headers.get('date') || ''); if (!d) throw new Error('no date');
        var rtt = performance.now() - m0; if (rtt > 8000) throw new Error('too slow');
        // the header is whole seconds, so the server's moment is on average half a second later
        var nOff = d + 500 - (t0 + rtt / 2);
        if (!synced || Math.abs(nOff - off) > 1200) off = nOff; // ignore sub-second wobble between checks
        synced = true; lastSync = Date.now();
        try { localStorage.setItem(K, JSON.stringify({ off: off, at: lastSync })); } catch (e) {}
      })
      .catch(function () {})
      .then(function () { inflight = null; markReady(); });
    return inflight;
  }
  /* the device clock was changed (or the device slept): check again */
  function watch() {
    var w = Date.now(), m = performance.now(), drift = (w - lastW) - (m - lastM);
    lastW = w; lastM = m;
    // cancel the jump at once, so nothing can count the jumped time, then ask the server. (If the jump was really
    // the device sleeping, the server check puts it right; until then time runs short, never long.)
    if (Math.abs(drift) > 3000) { off -= drift; sync(); }
  }
  function now() { watch(); return Date.now() + off; }

  sync(); setTimeout(markReady, 5000);
  setInterval(function () { watch(); if (Date.now() - lastSync > 15 * 60000) sync(); }, 5000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && Date.now() - lastSync > 60000) sync(); });
  window.addEventListener('online', sync);

  window.ttClock = {
    now: now,
    date: function () { return new Date(now()); },
    get ready() { return ready; },
    get synced() { return synced; },
    offset: function () { return off; },
    whenReady: function (f) { if (ready) f(); else waiters.push(f); },
    sync: sync
  };
})();
