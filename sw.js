/* TrainTanmay offline support.
   Pages and code: try the network first (so updates show straight away), fall back to the saved copy offline.
   Pictures, fonts, PDFs and question packs: use the saved copy if there is one, otherwise download and keep it.
   Everything you open while online is kept, so it works offline next time. */
var VERSION = 'tt-2026-11-18';
var CORE = ['./', 'index.html', 'dt.html', 'help.html', 'physics/', 'maths/', 'esat/', 'switcher.js', 'save.js', 'polish.css', 'restyle.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
var PAGES = VERSION + '-pages', FILES = VERSION + '-files';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(PAGES).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf(VERSION) !== 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

var BIG = /\.(pdf|png|jpe?g|webp|gif|svg|woff2?|ttf|mp4|webm)$|\/(imgpack|qbank|thumbs|img)\//i;
function keep(cacheName, req, res) {
  if (res && res.status === 200 && res.type === 'basic') { var copy = res.clone(); caches.open(cacheName).then(function (c) { c.put(req, copy); }); }
  return res;
}
function fromCache(req) {
  return caches.match(req).then(function (r) { return r || caches.match(req, { ignoreSearch: true }); });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // fonts.google, translator, videos: leave to the browser
  if (BIG.test(url.pathname)) {
    e.respondWith(fromCache(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { return keep(FILES, req, res); });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function (res) { return keep(PAGES, req, res); }).catch(function () {
    return fromCache(req).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('./') .then(function (r) { return r || Response.error(); });
      return Response.error();
    });
  }));
});
