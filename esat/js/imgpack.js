/* Question images are packed per paper (imgpack/<paper>.json) so the whole
   app fits in one artifact. Any <img data-qimg="img/X.webp"> gets its source
   filled in from the right pack, which is fetched once and cached. */
(function () {
  const packs = {};
  function packFor(path) {
    const m = /^img\/(ENGAA_\d{4}|NSAA_\d{4}|TMUA-[^_]+)_/.exec(path);
    return m ? m[1] : null;
  }
  function load(name) {
    if (!packs[name]) {
      packs[name] = fetch('imgpack/' + name + '.json')
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({}));
    }
    return packs[name];
  }
  function fill(img) {
    const path = img.getAttribute('data-qimg');
    if (!path || img.dataset.qimgDone) return;
    img.dataset.qimgDone = '1';
    const name = packFor(path);
    if (!name) { img.src = path; return; }
    load(name).then((p) => {
      img.src = p[path] || path; // fall back to a loose img/ file when running locally
    });
  }
  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('img[data-qimg]')) fill(root);
    root.querySelectorAll && root.querySelectorAll('img[data-qimg]').forEach(fill);
  }
  new MutationObserver((muts) => {
    for (const m of muts) m.addedNodes.forEach(scan);
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => scan(document.body));
})();
