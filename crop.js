/* TrainTanmay live question cropper.
   Shows just one question, cut out of the real paper, the way the old site did, but without storing
   anything: your browser fetches the source PDF live, PDF.js finds where the question starts and where
   the next one begins, and only that strip is drawn. Works for sources that let other sites load their
   PDFs (PMT, Mr Further Maths, DesignAndTechBase). For anything else, or if the question can't be
   found, it falls back to the live paper card from live.js.

   ttCrop.mount(el, {url, q, page, kind, card})
     url   PDF address                q     question label: "4", "4(c)", "12"
     page  page to start looking (optional)   kind  'qp' or 'ms'
     card  options for ttLive.card, used as the fallback and for the "open paper" links */
(function () {
  if (window.ttCrop) return;
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var CORS_OK = /(^|\.)(physicsandmathstutor\.com|supabase\.co|designandtechbase\.com)$/;
  // Madas Maths and UAT-UK block other sites from loading their PDFs, so those go through our own
  // Cloudflare Worker, which fetches the file live from the source and passes it straight on (it stores nothing).
  var PROXY = 'https://traintanmay.halkblackgamer.workers.dev/?url=';
  var PROXIED = /(^|\.)(madasmaths\.com|uat-wp\.s3\.eu-west-2\.amazonaws\.com)$/;
  function src(u) { try { return PROXIED.test(new URL(u).hostname) ? PROXY + encodeURIComponent(u) : u; } catch (e) { return u; } }
  var libP = null, docs = {};

  function lib() {
    if (window.pdfjsLib) { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; return Promise.resolve(window.pdfjsLib); }
    return libP || (libP = new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js';
      s.onload = function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; ok(window.pdfjsLib); };
      s.onerror = no; document.head.appendChild(s);
    }));
  }
  function open(url) {
    return docs[url] || (docs[url] = lib().then(function (L) { return L.getDocument({ url: src(url), disableAutoFetch: true }).promise; })
      .catch(function (e) { delete docs[url]; throw e; }));
  }
  var textCache = {};
  /* some papers (e.g. older UAT-UK TMUA ones) use a maths font whose digits come out as U+0372–U+037B
     ("ͳ" for 1, "͵" for 3…) and whose spaces come out as U+0003: read them as the digits and spaces they are */
  function fixGlyphs(t) { return String(t || '').replace(/[\u0372-\u037B]/g, function (c) { return String(c.charCodeAt(0) - 0x372); }).replace(/\u0003/g, ' '); }
  /* every text item on a page, as {s, x, y (from top), h} in PDF points */
  function pageText(doc, url, n) {
    var k = url + '#' + n;
    return textCache[k] || (textCache[k] = doc.getPage(n).then(function (pg) {
      var vp = pg.getViewport({ scale: 1 });
      return pg.getTextContent().then(function (tc) {
        // viewport coordinates, so rotated (landscape) pages such as mark schemes read the right way up
        var items = tc.items.map(function (i) { return Object.assign({}, i, { str: fixGlyphs(i.str) }); }).filter(function (i) { return i.str && i.str.trim(); }).map(function (i) {
          var pt = vp.convertToViewportPoint(i.transform[4], i.transform[5]);
          return { s: i.str.trim(), x: pt[0], y: pt[1], h: Math.hypot(i.transform[2], i.transform[3]) || i.height || 10, w: i.width || 0 };
        });
        // pieces on the same line, joined, so "4" "(c)" or "Question" "4" read as one
        items.sort(function (a, b) { return Math.abs(a.y - b.y) < 2 ? a.x - b.x : a.y - b.y; });
        // labels are sometimes split into single glyphs ("6" "(b" ")"): join short touching pieces back up
        var LBL = /^[\d()a-z.]{1,4}$/i, merged = [];
        items.forEach(function (it) {
          var p = merged[merged.length - 1], gap = p ? it.x - (p.x + (p.w || 0)) : 0;
          if (p && Math.abs(p.y - it.y) < 2 && LBL.test(it.s) && /^[\d()a-z.]{1,6}$/i.test(p.s) && gap < 3.5 && gap > -1) {
            p.s += it.s; p.w = it.x + (it.w || 0) - p.x;
          } else merged.push(Object.assign({}, it)); // overlapping numbers (a renumbered pack) stay separate
        });
        // the usual text size on the page, so small superscripts ("sin² t") aren't read as question numbers
        var hs = merged.map(function (i) { return i.h; }).sort(function (a, b) { return a - b; });
        return { w: vp.width, h: vp.height, items: merged, page: n, mh: hs.length ? hs[hs.length >> 1] : 0, ts: url in typeset };
      });
    }));
  }

  /* --- where do questions start? --- */
  function parseLabel(q) { var m = /^\s*(\d+)\s*(?:\(?\s*([a-z]{1,2})\s*\)?)?/i.exec(String(q)); return m ? { n: +m[1], part: m[2] ? m[2].toLowerCase() : '' } : null; }
  var romans = /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/;
  // the item just after this one on the same line, if any
  function nextOnLine(it, P) {
    var best = null;
    for (var i = 0; i < P.items.length; i++) { var o = P.items[i]; if (o !== it && Math.abs(o.y - it.y) < 3 && o.x > it.x && (!best || o.x < best.x)) best = o; }
    return best;
  }
  var DOTS = /^[.…_\s]{5,}$/;
  // exam-paper furniture around the answer space: not part of any question
  var FURNITURE = /^(Leave|blank|Leave blank|Question \d{1,2} continued|DO NOT WRITE IN THIS AREA|Turn over)$/i;
  var HEADER = /^(Q|Qu|Question( Number)?|Answers?|Expected Answers|Marks?|Guidance|Additional [Gg]uidance|Scheme|Notes|AOs?|Acceptable answers|Mark scheme)$/i;
  // a question number at the left margin: "4", "4.", "Q4", "Question 4", "4 (a)"; returns n or null.
  // Numbered answer lines ("1 ........") sit in the same column, so a number only counts if words follow it.
  function numAt(it, P, kind) {
    if (it.x > P.w * (kind === 'ms' ? 0.3 : 0.2)) return null;
    var m = /^(?:Q(?:uestion)?|M)?\.?\s*(\d{1,2})(?:[.)]|\.?\s*\(\s*[a-z]{1,2}\s*\)\.?(?:\s*\(\s*[ivx]{1,4}\s*\))?|[a-h])?$/i.exec(it.s) || /^(?:Question|Q)\s*(\d{1,2})\b/i.exec(it.s) || /^(\d{1,2})\s+[A-Z(]/.exec(it.s);
    if (!m) return null;
    if (P.mh && it.h < P.mh * 0.75) return null; // a superscript or index, not a label
    // in a mark scheme table the numbers sit in the first column: a number further in is part of the working
    if (kind === 'ms') {
      if (P.left == null) P.left = Math.min.apply(null, P.items.filter(function (o) { return !isChrome(o, P); }).map(function (o) { return o.x; }).concat([P.w]));
      if (it.x > P.left + 50) return null;
    }
    // a question number is the first thing on its line: a bare "5" after "A" is an answer option ("A  5 μA"), not question 5
    if (!/^(?:Q|Question|M)/i.test(it.s) && P.items.some(function (o) { return o !== it && Math.abs(o.y - it.y) < Math.max(3, Math.min(o.h, it.h) * 0.8) && o.x < it.x - 2 && !isChrome(o, P); })) return null; // (a fraction's numerator or denominator sits a little off the line)
    if (/^\d{1,2}\.?$/.test(it.s)) {
      var nx = nextOnLine(it, P);
      // typeset multiple-choice papers (ESAT) have no answer lines, and a question can open with a diagram,
      // leaving its number alone on the line: there a bare number at the far left still counts
      var alone = P.ts && kind !== 'ms' && it.x < P.w * 0.12 && (!P.mh || it.h >= P.mh * 0.9);
      if (nx ? DOTS.test(nx.s) : !(kind === 'ms' || /\.$/.test(it.s) || alone)) return null;
    }
    return +m[1];
  }
  function partAt(it, P) {
    if (it.x > P.w * 0.3) return null;
    var m = /^(?:\d{1,2}\.?\s*)?\(\s*([a-z]{1,2})\s*\)\.?(?:\s|$|\()/i.exec(it.s) || /^\d{1,2}\s*\(?([a-h])\)?$/i.exec(it.s);
    if (!m) return null;
    var p = m[1].toLowerCase();
    return romans.test(p) && p !== 'i' && p !== 'v' && p !== 'x' ? null : p; // (ii), (iii)… are sub-parts, not parts
  }
  function isChrome(it, P) { return it.y < 36 || it.y > P.h - 40; } // page header / footer band

  /* find {start:{page,y}, end:{page,y}} for a label, scanning from a hint page */
  /* Reads the pages in order. A whole question (or part a, which keeps the question's intro) starts at its
     number; a later part like 4(c) starts at its "(c)" label, found on the stored page or the one after.
     It ends at the next part, the next question, or "(Total for Question …)", and never runs past 3 pages.
     from: ignore everything before this page (used to skip the questions in a combined question+mark scheme PDF). */
  /* scanned PDFs (e.g. handwritten worked solutions) have no real text, only scanning noise:
     a "match" there would be a guess, so they aren't cropped at all */
  var scanned = {};
  /* papers the app knows are typeset (ttCrop.html({typeset: true, ...})), e.g. UAT-UK's ESAT papers, whose
     cover, blank pages and maths-heavy first questions can hold too few words for the check below */
  var typeset = {};
  function isScanned(doc, url) {
    if (url in scanned) return Promise.resolve(scanned[url]);
    if (url in typeset) return Promise.resolve(scanned[url] = false);
    var n = Math.min(4, doc.numPages), ps = []; for (var p = 1; p <= n; p++) ps.push(pageText(doc, url, p));
    return Promise.all(ps).then(function (all) {
      // count real words, not text pieces: a page of multiple-choice questions is mostly short pieces ("A", "C m", "–1")
      // with a few long lines, which once made a typed paper look like a scan
      var words = 0; all.forEach(function (P) { P.items.forEach(function (i) { words += (i.s.match(/\b[a-z]{4,}\b/gi) || []).length; }); });
      return (scanned[url] = words < 12 * n);
    });
  }
  function locate(doc, url, label, hint, kind, from) {
    return isScanned(doc, url).then(function (sc) {
      if (sc) return null;
      if (kind !== 'ms' || (from || 1) > 1) return locate2(doc, url, label, hint, kind, from);
      return tableStart(doc, url).then(function (f) { return locate2(doc, url, label, hint, kind, f); });
    });
  }
  /* Mark schemes often open with pages of general marking guidance whose numbered points ("1. The total number
     of marks…", "2. …") look just like question numbers. The marking itself is a table headed "Question | Scheme |
     Marks" (or "Answer", "Guidance"…): start looking at the first page that has that header. None found: page 1. */
  var tStart = {};
  function tableStart(doc, url) {
    if (url in tStart) return Promise.resolve(tStart[url]);
    var last = Math.min(doc.numPages, 12);
    return (function look(p) {
      if (p > last) return Promise.resolve(1);
      return pageText(doc, url, p).then(function (P) {
        // Header cells are whole words on their own ("Question" / "Number" on two lines, "Scheme" and "Marks"
        // centred between them), so match exact pieces near each other, never words inside a sentence
        // like "question to obtain this mark". "Question" can also come in pieces: "Q" "uestion".
        var hit = P.items.some(function (a) {
          // (some schemes put the question's own number in that first header cell: "1 | Expected Answers | Marks")
          if (!/^(Q\.?|Qu|Question)(\s*Number)?$/i.test(a.s) && !/^\d{1,2}$/.test(a.s)) return false;
          return P.items.some(function (b) { return b.x > a.x + 30 && Math.abs(b.y - a.y) < 16 && /^(Scheme|Marks?|Answers?|Expected Answers|Guidance|Mark scheme)$/i.test(b.s); });
        });
        // or the scheme's own title page, where question 1 starts straight under the title without column headers
        if (!hit && P.items.some(function (i) { return /^Mark Scheme$/i.test(i.s); }))
          hit = P.items.some(function (i) { return i.x < P.w * 0.2 && !isChrome(i, P) && /^1\.?(\s*\(a\))?$/.test(i.s); });
        if (!hit) return look(p + 1);
        if (p === 1) return p;
        // the table can begin a page earlier without its header row: take that page if question 1's first part
        // ("1a", "1 (a)", "1. (a)") is already in its margin. Guidance lists number their points "1.", which doesn't count.
        return pageText(doc, url, p - 1).then(function (Q) {
          return Q.items.some(function (i) { return i.x < Q.w * 0.2 && !isChrome(i, Q) && /^1\.?\s*(\(\s*a\s*\)|a)(\s*\(\s*i\s*\))?$/i.test(i.s); }) ? p - 1 : p;
        });
      });
    })(1).then(function (f) { return (tStart[url] = f); });
  }
  function locate2(doc, url, label, hint, kind, from) {
    var L = parseLabel(label); if (!L) return Promise.resolve(null);
    var total = doc.numPages, wantPart = L.part && L.part !== 'a';
    var s = Math.max(from || 1, hint ? hint - (wantPart ? 0 : 1) : 1);
    var start = null, end = null, seenNum = false, gaveUp = false;
    function page(pn) {
      if (pn > total || end || gaveUp) return Promise.resolve();
      if (!start && hint && pn > hint + 1) { gaveUp = true; return Promise.resolve(); }
      if (start && pn - start.page >= 3) { end = { page: pn - 1, y: -1 }; return Promise.resolve(); }
      return pageText(doc, url, pn).then(function (P) {
        for (var k = 0; k < P.items.length && !end; k++) {
          var it = P.items[k]; if (isChrome(it, P)) continue;
          var n = numAt(it, P, kind), pt = partAt(it, P), top = it.y - it.h - 4;
          if (!start) {
            if (n === L.n) seenNum = true;
            if (!wantPart && n === L.n) start = { page: pn, y: top };
            else if (wantPart && pt === L.part && (hint || seenNum)) start = { page: pn, y: top };
          } else if ((n !== null && n > L.n && n <= L.n + 3) || (L.part && pt && pt > L.part && pt.length === 1) ||
                     /^\(?Total for Question/i.test(it.s) || /^(TOTAL FOR|END OF QUESTION PAPER)/i.test(it.s)) {
            if (pn === start.page && top <= start.y + 2) continue;
            end = { page: pn, y: top };
          }
        }
        return page(pn + 1);
      });
    }
    return page(s).then(function () {
      if (!start) return null;
      end = end || { page: Math.min(total, start.page), y: -1 };
      if (end.page <= start.page || kind === 'ms') return { start: start, end: end };
      // a part (4(c)) stays on its own page unless it starts low down and has to carry on
      if (L.part && L.part !== 'a') return pageText(doc, url, start.page).then(function (P0) {
        if (start.y < P0.h - 160) end = { page: start.page, y: -1 };
        return { start: start, end: end };
      });
      // If the page the question "ends" on holds no answer lines before the end, what's there is the
      // intro to the next part, not this question: stop at the bottom of the page before.
      return pageText(doc, url, end.page).then(function (P) {
        var lines = P.items.some(function (i) { return DOTS.test(i.s) && (end.y < 0 || i.y < end.y) && !isChrome(i, P); });
        if (!lines && end.y > 60) end = { page: end.page - 1, y: -1 };
        return { start: start, end: end };
      });
    });
  }

  /* where the pictures are on a page (top-based PDF points), so empty-looking gaps that hold a figure are kept */
  var imgCache = {};
  function pageImages(doc, url, n) {
    var k = url + '#' + n;
    return imgCache[k] || (imgCache[k] = Promise.all([doc.getPage(n), lib()]).then(function (r) {
      var pg = r[0], O = r[1].OPS, vp = pg.getViewport({ scale: 1 });
      return pg.getOperatorList().then(function (ol) {
        var ctm = [1, 0, 0, 1, 0, 0], stack = [], boxes = [];
        var mul = function (a, b) { return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]]; };
        for (var i = 0; i < ol.fnArray.length; i++) {
          var f = ol.fnArray[i], a = ol.argsArray[i];
          if (f === O.save) stack.push(ctm.slice());
          else if (f === O.restore) ctm = stack.pop() || ctm;
          else if (f === O.transform) ctm = mul(ctm, a);
          else if (f === O.paintImageXObject || f === O.paintInlineImageXObject || f === O.paintJpegXObject || f === O.paintImageMaskXObject) {
            var ys = [[0, 0], [1, 0], [0, 1], [1, 1]].map(function (u) { return vp.convertToViewportPoint(ctm[0] * u[0] + ctm[2] * u[1] + ctm[4], ctm[1] * u[0] + ctm[3] * u[1] + ctm[5])[1]; });
            var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
            if (y1 - y0 > 12) boxes.push([y0, y1]);
          }
        }
        return boxes;
      });
    }).catch(function () { return []; }));
  }

  /* --- draw the strip(s) --- */
  function render(doc, url, loc, box) {
    var pages = []; for (var p = loc.start.page; p <= loc.end.page; p++) pages.push(p);
    var width = Math.min(box.clientWidth || 700, 900), dpr = Math.min(window.devicePixelRatio || 1, 2);
    return Promise.all(pages.map(function (pn) {
      return Promise.all([doc.getPage(pn), pageText(doc, url, pn), pageImages(doc, url, pn)]).then(function (r) {
        var pg = r[0], P = r[1], imgs = r[2];
        var top = pn === loc.start.page ? Math.max(0, loc.start.y) : 36;
        var bot = pn === loc.end.page ? (loc.end.y < 0 ? P.h - 40 : loc.end.y) : P.h - 40;
        // carrying on to another page: skip that page's repeated table header ("Question  Answer  Marks …")
        if (pn !== loc.start.page) {
          var hdr = P.items.filter(function (i) { return i.y < 110 && HEADER.test(i.s); });
          if (hdr.length >= 2) top = Math.max(top, Math.max.apply(null, hdr.map(function (i) { return i.y; })) + 6);
        }
        if (bot - top < 12) return null;
        var inside = P.items.filter(function (i) { return i.y > top && i.y < bot + 4 && !isChrome(i, P) && !FURNITURE.test(i.s); });
        // trim to the text actually there, left and right, so the strip isn't mostly margin
        // Keep the question, drop the answer space: bands of dotted answer lines are cut out, and so is the
        // empty space after the last words (figures always have a caption or labels, so they stay).
        var words = inside.filter(function (i) { return !DOTS.test(i.s) && !/^\d{1,2}$/.test(i.s) && !HEADER.test(i.s); });
        if (!words.length && pn !== loc.start.page) return null;
        var xs = inside.map(function (i) { return i.x; });
        var left = Math.max(0, (xs.length ? Math.min.apply(null, xs) : 40) - 12);
        // right edge: the widest line of text (dotted answer lines included), not the page edge with its margin bar
        var rights = inside.filter(function (i) { return i.w; }).map(function (i) { return i.x + i.w; });
        var right = Math.min(P.w, rights.length ? Math.max(Math.max.apply(null, rights) + 14, left + P.w * 0.5) : P.w - left);
        var dots = inside.filter(function (i) { return DOTS.test(i.s); }).map(function (i) { return i.y; }).sort(function (a, b) { return a - b; });
        if (words.length) bot = Math.min(bot, Math.max.apply(null, words.map(function (i) { return i.y; })) + 10);
        var cuts = [];
        dots.forEach(function (y) { var last = cuts[cuts.length - 1]; if (last && y - last[1] < 40) last[1] = y; else cuts.push([y, y]); });
        // big empty gaps between lines of words (boxes for working) go too, unless a picture is in them
        var ys = words.map(function (i) { return i.y; }).concat([top + 14]).sort(function (a, b) { return a - b; });
        for (var g = 1; g < ys.length; g++) {
          var a0 = ys[g - 1] + 14, b0 = ys[g] - 26;
          if (b0 - a0 > 60 && !imgs.some(function (bx) { return bx[1] > a0 && bx[0] < b0; })) cuts.push([a0 + 16, b0 - 8]);
        }
        cuts.sort(function (p, q) { return p[0] - q[0]; });
        var keep = [], from = top;
        cuts.forEach(function (c) {
          var a = c[0] - 16, b = c[1] + 8;
          var wordsIn = words.some(function (i) { return i.y > a && i.y < b; });
          if (wordsIn || b <= from || a >= bot) return;
          if (a - from > 4) keep.push([from, a]); from = b;
        });
        if (bot - from > 4) keep.push([from, bot]);
        if (!keep.length) return null;
        var scale = width / (right - left), vp = pg.getViewport({ scale: scale * dpr });
        var full = document.createElement('canvas'); full.width = Math.ceil(vp.width); full.height = Math.ceil(vp.height);
        return pg.render({ canvasContext: full.getContext('2d'), viewport: vp }).promise.then(function () {
          var k = scale * dpr, c = document.createElement('canvas'), x = c.getContext('2d');
          c.width = Math.ceil((right - left) * k);
          c.height = Math.ceil(keep.reduce(function (s, r) { return s + (r[1] - r[0]); }, 0) * k + (keep.length - 1) * 6 * dpr);
          x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
          var at = 0;
          keep.forEach(function (r, i) {
            var h = Math.ceil((r[1] - r[0]) * k);
            x.drawImage(full, left * k, r[0] * k, c.width, h, 0, at, c.width, h); at += h;
            if (i < keep.length - 1) { x.fillStyle = '#e4e6eb'; x.fillRect(0, at + 2 * dpr, c.width, dpr); at += 6 * dpr; }
          });
          c.style.width = '100%'; c.style.display = 'block';
          return c;
        });
      });
    })).then(function (cs) { return cs.filter(Boolean); });
  }

  var css = document.createElement('style');
  css.textContent = '.ttc{border:1px solid rgba(128,128,128,.28);border-radius:14px;overflow:hidden}' +
    '.ttc-strip{background:#fff;padding:10px 6px}.ttc-strip canvas+canvas{border-top:1px dashed #d5d8de;margin-top:6px;padding-top:6px}' +
    '.ttc-wait{padding:30px;text-align:center;opacity:.7;font-size:.9rem}' +
    '.ttc-all{display:flex;flex-direction:column;gap:10px}.ttc-all canvas+canvas{border-top:0;margin-top:0;padding-top:0}.ttc-all canvas{border-bottom:1px solid #e4e6eb}' +
    '.ttc-ph{aspect-ratio:1/1.3;background:#f4f5f7}' +
    '.ttc-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(128,128,128,.22)}' +
    '.ttc-bar button{font:inherit;font-size:.85rem;font-weight:600;padding:7px 12px;border-radius:9px;border:1px solid rgba(128,128,128,.4);background:transparent;color:inherit;cursor:pointer}' +
    '.ttc-bar button.pr{background:#14161b;color:#fff;border-color:#14161b}.ttc-hint{flex-basis:100%;font-size:.85rem;opacity:.8}' +
    '@media (prefers-color-scheme:dark){.ttc-bar button.pr{background:#eceef2;color:#14161b;border-color:#eceef2}}' +
    '.ttc-ov{position:absolute;inset:0;cursor:crosshair;touch-action:none;z-index:1}' +
    /* the pop-up uses each app's own theme colours (green in Maths) */
    '.ttc-pop{position:fixed;inset:0;z-index:100002;background:rgba(4,10,7,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:grid;place-items:center;padding:16px}' +
    '.ttc-pbox{width:min(980px,100%);height:min(92vh,100%);display:flex;flex-direction:column;background:var(--surface,#0f1f16);color:var(--ink,#eaf7ee);border:1px solid var(--brand,#4ade80);border-radius:18px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.6)}' +
    '.ttc-phead{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;padding:12px 16px;background:var(--brand-soft,rgba(74,222,128,.14));border-bottom:1px solid var(--line,rgba(128,128,128,.3))}' +
    '.ttc-phead b{font-size:1.05rem}.ttc-phead span{opacity:.75;font-size:.85rem;flex:1}' +
    '.ttc-px{font:inherit;font-size:1.5rem;line-height:1;width:38px;height:38px;border-radius:10px;border:1px solid var(--line,rgba(128,128,128,.4));background:transparent;color:inherit;cursor:pointer}' +
    '.ttc-pbody{flex:1;overflow:auto;padding:12px}.ttc-pbody .ttc{border-color:var(--line,rgba(128,128,128,.3))}' +
    '.ttc-pbox .ttc-bar button.pr{background:var(--brand,#4ade80);color:var(--brand-ink,#052e14);border-color:var(--brand,#4ade80)}' +
    '.ttc-box{position:absolute;z-index:2;border:2px solid #2563eb;background:rgba(37,99,235,.12);border-radius:4px;cursor:pointer}.ttc-box.live{pointer-events:none;border-style:dashed}' +
    '.ttc-pg{position:relative;border-bottom:1px solid #e4e6eb}.ttc-rot{position:absolute;top:6px;right:6px;font:600 12px system-ui,sans-serif;padding:5px 9px;border-radius:8px;border:1px solid #c9ced8;background:rgba(255,255,255,.92);color:#14161b;cursor:pointer;opacity:.75}.ttc-rot:hover,.ttc-rot:focus-visible{opacity:1}' +
    '.ttc-f{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;justify-content:space-between;padding:8px 12px;font-size:.8rem;border-top:1px solid rgba(128,128,128,.22)}' +
    '.ttc-f span{opacity:.7}.ttc-f a{font-weight:600;color:inherit}';
  document.head.appendChild(css);

  /* Scanned PDFs (handwritten worked solutions): every page, one after another in the page itself,
     each zoomed in by trimming the white margins off the scan. Pages draw as you scroll to them. */
  function trim(c) {
    var x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data, st = Math.max(1, Math.round(W / 400));
    var x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (var y = 0; y < H; y += st) for (var i = 0; i < W; i += st) {
      // ink = dark pen or coloured highlighter; the grey grid of the graph paper doesn't count
      var p = (y * W + i) * 4, lo = Math.min(d[p], d[p + 1], d[p + 2]), hi = Math.max(d[p], d[p + 1], d[p + 2]);
      // and the scanner's corner marks near the very edge of the page don't either
      if (i < W * 0.05 || i > W * 0.95 || y < H * 0.035 || y > H * 0.965) continue;
      if (lo < 110 || hi - lo > 70) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 <= x0 || y1 <= y0) return null; // blank page
    var pad = Math.round(W * 0.015); x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(W, x1 + pad); y1 = Math.min(H, y1 + pad);
    var o = document.createElement('canvas'), w = x1 - x0, h = y1 - y0;
    o.width = w; o.height = h; o.getContext('2d').drawImage(c, x0, y0, w, h, 0, 0, w, h);
    o.style.width = '100%'; o.style.display = 'block';
    return o;
  }
  /* turn a canvas by quarter turns (some scans are sideways; the reader fixes them with the ⟳ button) */
  function turned(c, q) {
    q = ((q % 4) + 4) % 4; if (!q) return c;
    var o = document.createElement('canvas'), side = q % 2; o.width = side ? c.height : c.width; o.height = side ? c.width : c.height;
    var g = o.getContext('2d'); g.translate(o.width / 2, o.height / 2); g.rotate(q * Math.PI / 2); g.drawImage(c, -c.width / 2, -c.height / 2);
    o.style.width = '100%'; o.style.display = 'block'; return o;
  }
  var ROT = 'tt-scan-rotation'; // remembered per PDF page, and kept in "Save progress"
  function rotGet(k) { try { return (JSON.parse(localStorage.getItem(ROT) || '{}'))[k] || 0; } catch (e) { return 0; } }
  function rotSet(k, v) { try { var m = JSON.parse(localStorage.getItem(ROT) || '{}'); if (v) m[k] = v; else delete m[k]; localStorage.setItem(ROT, JSON.stringify(m)); } catch (e) {} }
  /* ---- "mark it once, keep it forever" ----
     For a scanned solutions PDF, the reader draws a box (or a few) round one question's answer. Only the
     box positions are kept (fractions of the page as shown, with its rotation), in this browser and in
     "Save progress"; from then on that question shows just those bits. Nothing from the PDF is stored. */
  var MARKS = 'tt-solution-marks';
  function marksGet(k) { try { return (JSON.parse(localStorage.getItem(MARKS) || '{}'))[k] || []; } catch (e) { return []; } }
  function marksSet(k, v) { try { var m = JSON.parse(localStorage.getItem(MARKS) || '{}'); if (v && v.length) m[k] = v; else delete m[k]; localStorage.setItem(MARKS, JSON.stringify(m)); } catch (e) {} }

  var scanCache = {};
  function scanPage(doc, url, p, width) {
    var k = url + '#' + p + '@' + width;
    return scanCache[k] || (scanCache[k] = doc.getPage(p).then(function (pg) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: width / vp0.width * 1.6 * dpr });
      var c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      return pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () { return trim(c); });
    }));
  }
  function cut(c, b) {
    var x0 = Math.round(b.x0 * c.width), y0 = Math.round(b.y0 * c.height), w = Math.max(1, Math.round((b.x1 - b.x0) * c.width)), h = Math.max(1, Math.round((b.y1 - b.y0) * c.height));
    var o = document.createElement('canvas'); o.width = w; o.height = h; o.getContext('2d').drawImage(c, x0, y0, w, h, 0, 0, w, h);
    o.style.width = '100%'; o.style.display = 'block'; return o;
  }

  /* Under the question: your marked bit of the worked solutions, or a button to go and find it. */
  function inline(doc, el, o, card) {
    var E = window.ttLive.esc, url = o.url.split('#')[0], key = url + '|' + o.q, marks = marksGet(key);
    var width = Math.min(el.clientWidth || 800, 1000);
    el.innerHTML = '<div class="ttc"><div class="ttc-bar"></div><div class="ttc-strip ttc-all"></div><div class="ttc-f"></div></div>';
    var bar = el.querySelector('.ttc-bar'), strip = el.querySelector('.ttc-strip'), foot = el.querySelector('.ttc-f');
    var btn = function (label, fn, pr) { var b = document.createElement('button'); b.type = 'button'; b.textContent = label; if (pr) b.className = 'pr'; b.onclick = fn; bar.appendChild(b); return b; };
    var refresh = function () { inline(doc, el, o, card); };
    if (!marks.length) {
      bar.insertAdjacentHTML('beforeend', '<span class="ttc-hint">These worked solutions are handwritten scans. Open them, find question ' + E(o.q) + ' and mark it once: from then on just that bit shows here.</span>');
      btn('Open worked solutions', function () { popup(doc, o, card, 'all', refresh); }, true);
      strip.remove();
    } else {
      btn('Open worked solutions', function () { popup(doc, o, card, 'all', refresh); });
      btn('Re-mark', function () { popup(doc, o, card, 'mark', refresh); });
      marks.forEach(function (m) {
        var ph = document.createElement('div'); ph.className = 'ttc-ph'; ph.style.aspectRatio = 'auto'; ph.style.height = '160px'; strip.appendChild(ph);
        scanPage(doc, url, m.p, width).then(function (t) { if (t) ph.replaceWith(cut(turned(t, m.r || 0), m)); else ph.remove(); });
      });
    }
    foot.innerHTML = '<span>' + (marks.length ? 'Your marked answer for question ' + E(o.q) + ' · ' : '') + 'live from ' + E(card.source || host(url)) + '</span>';
  }

  /* The pop-up: every page, zoomed, in a panel themed like the app. Rotate pages; mark the answer. */
  function popup(doc, o, card, mode, after) {
    var E = window.ttLive.esc;
    var back = document.createElement('div'); back.className = 'ttc-pop';
    back.innerHTML = '<div class="ttc-pbox" role="dialog" aria-modal="true" aria-label="Worked solutions"><div class="ttc-phead"><b>' + E(card.title || 'Worked solutions') + '</b><span>Question ' + E(o.q) + ' · live from ' + E(card.source || host(o.url)) + '</span><button type="button" class="ttc-px" aria-label="Close">×</button></div><div class="ttc-pbody"></div></div>';
    document.body.appendChild(back); document.documentElement.style.overflow = 'hidden';
    var close = function () { back.remove(); document.documentElement.style.overflow = ''; document.removeEventListener('keydown', key); };
    var key = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', key);
    back.onclick = function (e) { if (e.target === back) close(); };
    back.querySelector('.ttc-px').onclick = close;
    back.querySelector('.ttc-px').focus();
    renderAll(doc, back.querySelector('.ttc-pbody'), o, card, mode, { saved: function () { close(); if (after) after(); } });
  }

  function renderAll(doc, el, o, card, mode, opts) {
    var E = window.ttLive.esc, url = o.url.split('#')[0], key = url + '|' + o.q, marks = marksGet(key);
    opts = opts || {}; mode = mode || 'all';
    var width = Math.min(el.clientWidth || 800, 1000);
    el.innerHTML = '<div class="ttc"><div class="ttc-bar"></div><div class="ttc-strip ttc-all"></div></div>';
    var bar = el.querySelector('.ttc-bar'), strip = el.querySelector('.ttc-strip');
    var btn = function (label, fn, pr) { var b = document.createElement('button'); b.type = 'button'; b.textContent = label; if (pr) b.className = 'pr'; b.onclick = fn; bar.appendChild(b); return b; };
    var again = function (m) { renderAll(doc, el, o, card, m, opts); };

    var pending = mode === 'mark' ? marks.map(function (m) { return Object.assign({}, m); }) : [];
    if (mode === 'mark') {
      bar.insertAdjacentHTML('beforeend', '<span class="ttc-hint">Drag a box round question ' + E(o.q) + '\'s answer. Use more boxes if it carries on. Tap a box to remove it.</span>');
      btn('Save', function () { marksSet(key, pending); if (opts.saved) opts.saved(); else again('all'); }, true);
      btn('Cancel', function () { again('all'); });
    } else {
      btn('Mark the answer for question ' + o.q, function () { again('mark'); }, true);
      if (marks.length) bar.insertAdjacentHTML('beforeend', '<span class="ttc-hint">Already marked: your boxes show below the question.</span>');
    }

    var drawBoxes = function (wrap) {
      [].slice.call(wrap.querySelectorAll('.ttc-box')).forEach(function (b) { b.remove(); });
      pending.forEach(function (m, i) {
        if (m.p !== +wrap.dataset.p || (m.r || 0) !== wrap.ttRot) return;
        var b = document.createElement('div'); b.className = 'ttc-box'; b.title = 'Tap to remove';
        b.style.left = m.x0 * 100 + '%'; b.style.top = m.y0 * 100 + '%'; b.style.width = (m.x1 - m.x0) * 100 + '%'; b.style.height = (m.y1 - m.y0) * 100 + '%';
        b.onclick = function (e) { e.stopPropagation(); pending.splice(i, 1); [].forEach.call(strip.querySelectorAll('.ttc-pg'), drawBoxes); };
        wrap.appendChild(b);
      });
    };
    var markable = function (wrap) {
      var ov = document.createElement('div'); ov.className = 'ttc-ov'; wrap.appendChild(ov);
      var start = null, live = null;
      var pos = function (e) { var r = wrap.firstChild.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) }; };
      ov.onpointerdown = function (e) { e.preventDefault(); ov.setPointerCapture(e.pointerId); start = pos(e); live = document.createElement('div'); live.className = 'ttc-box live'; wrap.appendChild(live); };
      ov.onpointermove = function (e) { if (!start) return; var p = pos(e); live.style.left = Math.min(start.x, p.x) * 100 + '%'; live.style.top = Math.min(start.y, p.y) * 100 + '%'; live.style.width = Math.abs(p.x - start.x) * 100 + '%'; live.style.height = Math.abs(p.y - start.y) * 100 + '%'; };
      ov.onpointerup = function (e) {
        if (!start) return; var p = pos(e); live.remove();
        if (Math.abs(p.x - start.x) > 0.03 && Math.abs(p.y - start.y) > 0.02) pending.push({ p: +wrap.dataset.p, r: wrap.ttRot, x0: Math.min(start.x, p.x), y0: Math.min(start.y, p.y), x1: Math.max(start.x, p.x), y1: Math.max(start.y, p.y) });
        start = null; drawBoxes(wrap);
      };
    };

    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting || en.target.dataset.done) return; en.target.dataset.done = 1;
        var pn = +en.target.dataset.p;
        scanPage(doc, url, pn, width).then(function (t) {
          if (!t) { en.target.remove(); return; }
          var rk = url + '#' + pn, q = rotGet(rk);
          var wrap = document.createElement('div'); wrap.className = 'ttc-pg'; wrap.dataset.p = pn; wrap.ttRot = q;
          wrap.appendChild(turned(t, q));
          var b = document.createElement('button'); b.type = 'button'; b.className = 'ttc-rot'; b.title = 'Turn this page'; b.setAttribute('aria-label', 'Turn page ' + pn); b.textContent = '⟳ Rotate';
          b.onclick = function () { q = (q + 1) % 4; rotSet(rk, q); wrap.ttRot = q; wrap.replaceChild(turned(t, q), wrap.firstChild); drawBoxes(wrap); };
          wrap.appendChild(b);
          if (mode === 'mark') { markable(wrap); drawBoxes(wrap); }
          en.target.replaceWith(wrap);
        });
      });
    }, { rootMargin: '1200px' });
    for (var i = 1; i <= doc.numPages; i++) { var ph = document.createElement('div'); ph.className = 'ttc-ph'; ph.dataset.p = i; strip.appendChild(ph); io.observe(ph); }
  }

  function host(u) { try { return new URL(u).hostname; } catch (e) { return ''; } }
  function mount(el, o) {
    var card = Object.assign({}, o.card || {}, { url: o.url, page: o.page, q: o.card && o.card.q || o.q });
    var fallback = function () { el.innerHTML = window.ttLive.card(card); };
    if (!o.url || !(CORS_OK.test(host(o.url)) || PROXIED.test(host(o.url)))) return fallback();
    el.innerHTML = '<div class="ttc"><div class="ttc-strip"><div class="ttc-wait">Fetching ' + (o.kind === 'ms' ? 'the mark scheme' : 'question ' + window.ttLive.esc(o.q)) + ' live from ' + window.ttLive.esc(card.source || host(o.url)) + '…</div></div></div>';
    if (o.typeset) typeset[o.url] = 1;
    var token = el.ttcToken = {};
    open(o.url).then(function (doc) {
      return isScanned(doc, o.url).then(function (sc) {
        if (!sc) return doc;
        if (el.ttcToken === token) inline(doc, el, o, card);
        return null;
      });
    }).then(function (doc) {
      if (!doc) return;
      // a mark scheme at the back of the question PDF: start looking where the mark scheme starts
      var from = !o.combined ? Promise.resolve(o.from || 1) : (function find(p) {
        if (p > doc.numPages) return Promise.resolve(doc.numPages + 1);
        return pageText(doc, o.url, p).then(function (P) { return P.items.some(function (i) { return /^(Mark\s*Scheme|Question\s+Number|Qu(estion)?\s+Scheme\s+Marks)/i.test(i.s) || /^Scheme$/i.test(i.s); }) ? p : find(p + 1); });
      })(2);
      return from.then(function (f) { return locate(doc, o.url, o.q, o.page, o.kind, f); }).then(function (loc) {
        if (!loc) throw new Error('not found');
        return render(doc, o.url, loc, el).then(function (canvases) {
          if (el.ttcToken !== token) return;
          if (!canvases.length) throw new Error('empty');
          var strip = el.querySelector('.ttc-strip'); strip.innerHTML = ''; canvases.forEach(function (c) { strip.appendChild(c); });
          var link = window.ttLive.at(o.url, loc.start.page);
          strip.insertAdjacentHTML('afterend', '<div class="ttc-f"><span>' + (o.kind === 'ms' ? 'Mark scheme' : 'Question ' + window.ttLive.esc(o.q)) + ' · page ' + loc.start.page + ' · live from ' + window.ttLive.esc(card.source || host(o.url)) + '</span><span class="ttc-l"><a href="' + window.ttLive.esc(link) + '" target="_blank" rel="noopener" data-ttview="' + window.ttLive.esc(card.title || 'Paper') + '" data-src="' + window.ttLive.esc(card.source || '') + '">Whole paper</a>' +
            (card.alt ? ' · <a href="' + window.ttLive.esc(window.ttLive.at(card.alt.url, loc.start.page)) + '" target="_blank" rel="noopener">' + window.ttLive.esc(card.alt.label) + ' ↗</a>' : '') + '</span></div>');
        });
      });
    }).catch(function () { if (el.ttcToken === token) fallback(); });
  }
  /* Apps just write ttCrop.html({...}); anything like that added to the page is filled in automatically. */
  function html(o) { return '<div class="ttcrop" data-ttcrop="' + window.ttLive.esc(JSON.stringify(o)) + '"></div>'; }
  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    var list = root.matches && root.matches('[data-ttcrop]') ? [root] : [].slice.call(root.querySelectorAll ? root.querySelectorAll('[data-ttcrop]') : []);
    list.forEach(function (el) { if (el.ttcDone) return; el.ttcDone = 1; try { mount(el, JSON.parse(el.getAttribute('data-ttcrop'))); } catch (e) {} });
  }
  new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(scan); }); }).observe(document.documentElement, { childList: true, subtree: true });
  window.ttCrop = { mount: mount, html: html, scan: scan, _locate: locate, _open: open };
})();
