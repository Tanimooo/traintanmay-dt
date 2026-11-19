/* TrainTanmay offline support, written to go easy on mobile data.
   Pages and code: ask the network first so updates show straight away, but as a "has it changed?" check,
   so files that haven't changed don't download again. Offline, use the saved copy.
   Pictures, fonts, PDFs and question packs: use the saved copy. Only check for a newer version about once a week.
   Saved files are kept through updates to the site: an update only downloads the files that changed. */
var CORE = ['./', 'index.html', 'dt.html', 'help.html', 'physics/', 'maths/', 'esat/', 'switcher.js', 'save.js', 'polish.css', 'restyle.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
var PAGES = 'tt-pages', FILES = 'tt-files';
var WEEK = 7 * 24 * 3600 * 1000;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(PAGES).then(function (c) {
    // 'no-cache' = ask the server whether each file changed; unchanged files cost almost nothing
    return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: 'no-cache' })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  // only clear out caches from older versions of this file (named tt-2026-…); keep tt-pages and tt-files
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== PAGES && k !== FILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

var BIG = /\.(pdf|png|jpe?g|webp|gif|svg|woff2?|ttf|mp4|webm)$|\/(imgpack|qbank|thumbs|img)\//i;
function keep(cacheName, req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    var copy = res.clone();
    caches.open(cacheName).then(function (c) { c.put(req, copy); });
  }
  return res;
}
function fromCache(req) {
  return caches.match(req).then(function (r) { return r || caches.match(req, { ignoreSearch: true }); });
}
function old(res) { var d = Date.parse(res.headers.get('date') || ''); return !d || Date.now() - d > WEEK; }

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // Google fonts, translator, videos: leave to the browser
  if (BIG.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function (hit) {
      if (hit) {
        if (old(hit) && navigator.onLine) e.waitUntil(fetch(req, { cache: 'no-cache' }).then(function (res) { keep(FILES, req, res); }).catch(function () {}));
        return hit;
      }
      return fetch(req).then(function (res) { return keep(FILES, req, res); });
    }));
    return;
  }
  e.respondWith(fetch(req, { cache: 'no-cache' }).then(function (res) { return keep(PAGES, req, res); }).catch(function () {
    return fromCache(req).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./').then(function (r) { return r || Response.error(); });
      return Response.error();
    });
  }));
});
