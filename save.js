/* TrainTanmay: one save for every app.
   Backs up D&T, Physics, Chemistry, Maths (incl. SketchGuessr) and ESAT progress together as one file or one
   copy-and-paste save code, and restores it on any device. Also reads the older one-app backups.
   Open it with window.ttSave.open() (the logo menu, the start screen and each Progress page do). */
(function () {
  if (window.ttSave) return;
  var VERSION = 1;
  var APPS = [
    { id: 'dt', name: 'Design & Technology', col: '#1f5fbf', keys: [/^tt-dt-/] },
    { id: 'physics', name: 'Physics', col: '#c81e66', keys: [/^tt-phys-/, /^tt-mockcfg$/] },
    { id: 'chemistry', name: 'Chemistry', col: '#c2410c', keys: [/^tt-chem-/] },
    { id: 'maths', name: 'Maths', col: '#1a7f45', keys: [/^tt-maths-/, /^sketchguessr-/] },
    { id: 'esat', name: 'ESAT', col: '#d9a300', keys: [/^esat\./] }
  ];
  var INCLUDE = /^(tt-|esat\.|sketchguessr-)/;
  var EXCLUDE = /^(tt-keep:|tt-probe|tt-restore-undo|tt-cloud|tt-league|tt-lastbackup$|tt-exam-active$|esat\..*\.probe$)/; // tt-exam-active: a running exam's clock belongs to its own device
  var LAST = 'tt-lastbackup', UNDO = 'tt-restore-undo';
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/save\.js[^/]*$/, '');

  function ls() { try { var s = window.localStorage; s.getItem('x'); return s; } catch (e) { return null; } }
  function appOf(k) { for (var i = 0; i < APPS.length; i++) for (var j = 0; j < APPS[i].keys.length; j++) if (APPS[i].keys[j].test(k)) return APPS[i].id; return 'shared'; }

  function collect() {
    var s = ls(), data = {};
    if (!s) return data;
    for (var i = 0; i < s.length; i++) { var k = s.key(i); if (INCLUDE.test(k) && !EXCLUDE.test(k)) data[k] = s.getItem(k); }
    return data;
  }
  function pack() { return { app: 'TrainTanmay', kind: 'all-apps', version: VERSION, saved: new Date().toISOString(), data: collect() }; }

  /* what an app's saved data amounts to, in words */
  function describe(id, data) {
    function j(k) { try { return JSON.parse(data[k] || 'null'); } catch (e) { return null; } }
    function n(o) { return o && typeof o === 'object' ? Object.keys(o).length : 0; }
    var has = Object.keys(data).some(function (k) { return appOf(k) === id; });
    if (!has) return '';
    if (id === 'esat') {
      var e = j('esat.trainer.v1') || {}, x = j('esat.trainer.extras.v1') || {}, bits = [];
      var a = (e.attempts || []).length; if (a) bits.push(a + ' answer' + (a === 1 ? '' : 's'));
      if (e.active) bits.push('1 unfinished test');
      var mm = x.mm || {}; if (n(mm.pairs) + n(mm.sq) + n(mm.tri) + n(mm.flash) + (mm.sessions || []).length + n((x.hub || {}).learned)) bits.push('mental maths');
      return bits.length ? bits.join(' · ') : 'progress saved';
    }
    return 'progress saved';
  }

  /* ---- save code: compressed, so it fits in a message or note ---- */
  function b64u(bytes) { var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
  function streamBytes(bytes, ts) { return new Response(new Blob([bytes]).stream().pipeThrough(ts)).arrayBuffer().then(function (ab) { return new Uint8Array(ab); }); }
  function toCode(obj) {
    var raw = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === 'undefined') return Promise.resolve('TT0.' + b64u(raw));
    return streamBytes(raw, new CompressionStream('deflate-raw')).then(function (z) { return 'TT1.' + b64u(z); }).catch(function () { return 'TT0.' + b64u(raw); });
  }
  function fromCode(t) {
    var m = /TT([01])\.([A-Za-z0-9_-]+)/.exec(t.replace(/\s+/g, ''));
    if (!m) return Promise.reject(new Error('code'));
    var bytes = unb64u(m[2]);
    var p = m[1] === '1' ? streamBytes(bytes, new DecompressionStream('deflate-raw')) : Promise.resolve(bytes);
    return p.then(function (b) { return JSON.parse(new TextDecoder().decode(b)); });
  }

  /* ---- turn anything we're given into { key: value } ---- */
  function normalise(o) {
    if (!o || typeof o !== 'object') return null;
    var str = function (v) { return JSON.stringify(v); };
    if (o.kind === 'all-apps' && o.data && typeof o.data === 'object') return { data: o.data, saved: o.saved, from: 'All apps backup' };
    if (o.app === 'TrainTanmay Physics' && o.progress) return { data: { 'tt-phys-progress-v1': str(o.progress) }, saved: o.exported, from: 'Physics backup' };
    if (o.app === 'TrainTanmay Chemistry' && o.progress) return { data: { 'tt-chem-progress-v1': str(o.progress) }, saved: o.exported, from: 'Chemistry backup' };
    if (o.S && typeof o.S === 'object') { var d = { 'tt-maths-v1': str(o.S) }; if (o.D) d['tt-maths-drills-v1'] = str(o.D); return { data: d, from: 'Maths backup' }; }
    if (Array.isArray(o.attempts) && Array.isArray(o.sessions)) return { data: { 'esat.trainer.v1': str(o) }, from: 'ESAT backup' };
    if ('flash' in o) return { data: { 'tt-dt-progress-v1': str(o) }, from: 'D&T backup' };
    return null;
  }
  function parseAny(text) {
    text = String(text || '').trim();
    if (!text) return Promise.reject(new Error('empty'));
    if (/TT[01]\./.test(text) && text[0] !== '{') return fromCode(text).then(normalise);
    try { return Promise.resolve(normalise(JSON.parse(text))); } catch (e) { return Promise.reject(e); }
  }

  /* ---- add-only merge ----
     Loading a save never takes anything away: lists gain the entries they were missing, records gain
     the keys they were missing, counts keep the bigger number, ticks stay ticked. Your settings stay as
     they are. Loading the same save twice changes nothing the second time. */
  var TS = ['t', 'at', 'ts', 'time', 'date', 'when'];
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function tsOf(v) { if (!isObj(v)) return null; for (var i = 0; i < TS.length; i++) { var x = v[TS[i]]; if (typeof x === 'number') return x; if (typeof x === 'string' && !isNaN(Date.parse(x))) return Date.parse(x); } return null; }
  function sortedAsc(a) { for (var i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return false; return true; }
  function mergeArr(a, b) {
    var out = a.slice(), seen = {}, ids = {};
    a.forEach(function (x) { seen[JSON.stringify(x)] = 1; if (isObj(x) && x.id != null) ids[x.id] = 1; });
    b.forEach(function (x) {
      var j = JSON.stringify(x);
      if (seen[j]) return;
      if (isObj(x) && x.id != null) { if (ids[x.id]) return; ids[x.id] = 1; }
      seen[j] = 1; out.push(x);
    });
    if (out.length === a.length) return a;
    // keep logs in time order, and sorted lists (like study days) sorted
    if (out.every(function (x) { return tsOf(x) !== null; })) out.sort(function (p, q) { return tsOf(p) - tsOf(q); });
    else if (out.every(function (x) { return typeof x === 'string' || typeof x === 'number'; }) && sortedAsc(a) && sortedAsc(b)) out.sort();
    return out;
  }
  function mergeVal(a, b, key) {
    if (a === undefined || a === null) return b;
    if (b === undefined || b === null) return a;
    if (key === 'settings') return a; // your current settings win
    if (Array.isArray(a) && Array.isArray(b)) return mergeArr(a, b);
    if (isObj(a) && isObj(b)) { var o = {}; Object.keys(a).forEach(function (k) { o[k] = a[k]; }); Object.keys(b).forEach(function (k) { o[k] = mergeVal(a[k], b[k], k); }); return o; }
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    if (typeof a === 'boolean' && typeof b === 'boolean') return a || b;
    return a; // text and anything mismatched: keep what is here
  }
  function mergeStr(cur, inc) {
    if (cur === null || cur === undefined) return inc;
    var a, b; try { a = JSON.parse(cur); b = JSON.parse(inc); } catch (e) { return cur; }
    return JSON.stringify(mergeVal(a, b));
  }

  function restore(data) {
    var s = ls(); if (!s) throw new Error('storage');
    var before = {};
    Object.keys(data).forEach(function (k) { before[k] = s.getItem(k); });
    try { s.setItem(UNDO, JSON.stringify({ at: Date.now(), before: before })); } catch (e) {}
    Object.keys(data).forEach(function (k) { if (INCLUDE.test(k) && !EXCLUDE.test(k) && typeof data[k] === 'string') s.setItem(k, mergeStr(s.getItem(k), data[k])); });
  }

  /* ---- clearing progress: three separate "are you sure?" boxes, each somewhere different ---- */
  var SURE = [
    { h: 'Are you sure?', p: 'This deletes WHAT from this browser.', yes: 'Yes, I’m sure', pos: 'top:24px;left:24px' },
    { h: 'Are you double sure?', p: 'It cannot be undone unless you have a save file or save code.', yes: 'Yes, double sure', pos: 'bottom:24px;right:24px' },
    { h: 'Are you triple sure?', p: 'Last chance. Press the button below and WHAT is gone.', yes: 'Yes, delete it', pos: 'top:24px;right:24px' }
  ];
  /* clearing progress in an app: if synced, the cloud copy is replaced too, instead of being merged back in */
  function confirm3(what, onYes) { confirmRaw(what, function () { cloudClearing(); return onYes.apply(this, arguments); }); }
  function confirmRaw(what, onYes, note) {
    what = what || 'all your progress';
    var step = 0, prev = document.activeElement;
    function show() {
      var c = SURE[step], w = document.createElement('div');
      w.className = 'tts-sure-back';
      w.innerHTML = '<div class="tts tts-sure" role="alertdialog" aria-modal="true" aria-labelledby="tts-sh" aria-describedby="tts-sp" style="' + c.pos + '">' +
        '<p class="mu" style="margin:0 0 2px">Step ' + (step + 1) + ' of 3</p><h2 id="tts-sh">' + c.h + '</h2><p id="tts-sp">' + (step === 1 && note ? note : c.p.replace('WHAT', what)) + '</p>' +
        '<div class="row" style="margin:0"><button type="button" class="pr" data-no>No, keep it</button><button type="button" class="danger" data-yes>' + c.yes + '</button></div></div>';
      document.body.appendChild(w);
      var no = w.querySelector('[data-no]'), yes = w.querySelector('[data-yes]');
      function done(ok) {
        document.removeEventListener('keydown', key, true); w.remove();
        if (!ok) { prev && prev.focus && prev.focus(); return; }
        step++; if (step < SURE.length) show(); else onYes();
      }
      function key(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); }
        if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === no ? yes : no).focus(); }
      }
      document.addEventListener('keydown', key, true);
      no.onclick = function () { done(false); }; yes.onclick = function () { done(true); };
      w.addEventListener('click', function (e) { if (e.target === w) done(false); });
      no.focus();
    }
    show();
  }
  function undo() {
    var s = ls(); if (!s) return false;
    var u = null; try { u = JSON.parse(s.getItem(UNDO) || 'null'); } catch (e) {}
    if (!u) return false;
    Object.keys(u.before).forEach(function (k) { if (u.before[k] === null) s.removeItem(k); else s.setItem(k, u.before[k]); });
    s.removeItem(UNDO); return true;
  }

  /* ---- automatic safety copies ----
     Once a day, a copy of every app's progress goes into this browser's IndexedDB (separate from
     the progress itself). If an update or a bad load ever spoils your progress, the save panel can
     put back any of the last 7 days. Nothing leaves your device. */
  var SAFE_DB = 'tt-safety', SAFE_KEEP = 7;
  function safeDb() {
    return new Promise(function (ok, no) {
      try { var r = indexedDB.open(SAFE_DB, 1); } catch (e) { return no(e); }
      r.onupgradeneeded = function () { r.result.createObjectStore('snaps', { keyPath: 'day' }); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); };
    });
  }
  function safeList() {
    return safeDb().then(function (db) { return new Promise(function (ok) {
      var q = db.transaction('snaps').objectStore('snaps').getAll();
      q.onsuccess = function () { ok((q.result || []).sort(function (a, b) { return b.at - a.at; })); }; q.onerror = function () { ok([]); };
    }); }).catch(function () { return []; });
  }
  function safeSnap() {
    var data = collect(), n = Object.keys(data).filter(function (k) { return appOf(k) !== 'shared'; }).length;
    if (!n) return Promise.resolve();
    var day = new Date().toISOString().slice(0, 10);
    return safeDb().then(function (db) { return new Promise(function (ok) {
      var st = db.transaction('snaps', 'readwrite').objectStore('snaps');
      st.put({ day: day, at: Date.now(), data: data });
      var all = st.getAll();
      all.onsuccess = function () { (all.result || []).sort(function (a, b) { return b.at - a.at; }).slice(SAFE_KEEP).forEach(function (s) { st.delete(s.day); }); ok(); };
      all.onerror = function () { ok(); };
    }); }).catch(function () {});
  }
  // a few seconds after the page opens, so it never slows anything down
  setTimeout(safeSnap, 4000);

  function ago(t) {
    if (!t) return 'never';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 2) return 'just now'; if (m < 60) return m + ' minutes ago';
    var h = Math.round(m / 60); if (h < 24) return h + ' hour' + (h === 1 ? '' : 's') + ' ago';
    var d = Math.round(h / 24); return d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }
  function stamp() { var s = ls(); try { s && s.setItem(LAST, String(Date.now())); } catch (e) {} }
  function lastTime() { var s = ls(); return s ? +(s.getItem(LAST) || 0) : 0; }

  /* ---- sync with Google (optional) ----
     Sign in once and every app's progress is kept in one record in the cloud (Firebase), tied to your
     Google account. Each sync compares both sides with what they were at the last sync, so additions AND
     deletions (unticking, unflagging, clearing marks) carry across; the very first sync only adds. This device's progress goes up,
     progress from your other devices comes down. Signed out, nothing is sent. */
  var FB = {
    apiKey: 'AIzaSyBNfifatWZKZgy1zlhV46LoOw1V5_Jz4eA',
    authDomain: 'traintanmay26.firebaseapp.com',
    projectId: 'traintanmay26',
    storageBucket: 'traintanmay26.firebasestorage.app',
    messagingSenderId: '157913586959',
    appId: '1:157913586959:web:357b108d0677c5cd55327a'
  };
  var CLOUD_ON = 'tt-cloud-on', CLOUD_CLEAR = 'tt-cloud-replace', CLOUD_UID = 'tt-cloud-uid', CLOUD_HASH = 'tt-cloud-hash', CLOUD_MAX = 900000;
  var cloud = { user: null, ready: false, busy: false, again: false, last: 0, err: '', seen: '' };
  var sdkP = null, loadedAt = Date.now(), touched = false;
  ['pointerdown', 'keydown'].forEach(function (t) { document.addEventListener(t, function () { touched = true; }, { capture: true, once: true }); });

  function flag(k, v) { var s = ls(); if (!s) return null; try { if (v === undefined) return s.getItem(k); if (v === null) s.removeItem(k); else s.setItem(k, v); } catch (e) {} return null; }
  function sdk() {
    if (sdkP) return sdkP;
    sdkP = new Promise(function (ok, no) {
      if (window.ttCloudSDK) return ok();
      var sc = document.createElement('script'); sc.src = BASE + 'cloud/firebase.js?v=20261122b'; sc.async = true;
      sc.onload = ok; sc.onerror = function () { no(new Error('load')); };
      document.head.appendChild(sc);
    }).then(function () {
      ttCloudSDK.init(FB);
      ttCloudSDK.onUser(function (u) {
        var was = cloud.user && cloud.user.uid;
        cloud.user = u; cloud.ready = true;
        if (u && u.uid !== was) {
          var fresh = flag(CLOUD_ON) === 'pending', prev = flag(CLOUD_UID);
          flag(CLOUD_ON, '1');
          // just signed in with a different account from the one this device last synced with: ask first
          if (fresh && prev && prev !== u.uid && hasProgress()) { cloud.choice = true; cloud.fresh = false; if (!back) open(); }
          else sync();
        }
        if (!u) { flag(CLOUD_ON, null); cloud.choice = false; cloud.out = false; }
        drawCloud();
      });
      return ttCloudSDK;
    }).catch(function (e) { sdkP = null; cloud.err = 'Sync could not load. Check your connection, or your school network may block it.'; drawCloud(); throw e; });
    return sdkP;
  }

  /* ---- what both sides looked like at the last sync (the "base") ----
     Kept in IndexedDB per Google account. With it, a sync can tell "added on the other device" from
     "deleted on this one", so unticking, unflagging or clearing something syncs too, instead of it
     coming back from the cloud every time (the old merge could only ever add). */
  var BASE_DB = 'tt-sync-base';
  function baseDb() {
    return new Promise(function (ok, no) {
      try { var r = indexedDB.open(BASE_DB, 1); } catch (e) { return no(e); }
      r.onupgradeneeded = function () { r.result.createObjectStore('b'); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); };
    });
  }
  function baseGet(uid) { return baseDb().then(function (db) { return new Promise(function (ok) { var q = db.transaction('b').objectStore('b').get(uid); q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { ok(null); }; }); }).catch(function () { return null; }); }
  function basePut(uid, data) { return baseDb().then(function (db) { return new Promise(function (ok) { var t = db.transaction('b', 'readwrite'); t.objectStore('b').put(data, uid); t.oncomplete = ok; t.onerror = ok; }); }).catch(function () {}); }

  function canon(v) { return JSON.stringify(v, function (k, x) { if (!isObj(x)) return x; var o = {}; Object.keys(x).sort().forEach(function (y) { o[y] = x[y]; }); return o; }); }
  function eq(x, y) { return x === y || canon(x) === canon(y); }
  var NONE = {}; // "there was no last sync": fall back to add-only
  /* merge one value: base = at the last sync, a = here, b = the other devices (the cloud) */
  function merge3(base, a, b, key) {
    if (eq(a, b)) return a;
    if (base === NONE) return a === undefined ? b : b === undefined ? a : mergeVal(a, b, key);
    if (eq(a, base)) return b;          // only the other side changed it (that includes deleting it)
    if (eq(b, base)) return a;          // only this side changed it
    if (a === undefined) return b;      // deleted here but changed there: keep the work
    if (b === undefined) return a;
    if (key === 'settings') return a;   // your settings on this device win
    if (Array.isArray(a) && Array.isArray(b)) {
      var J = function (x) { return canon(x); }, inA = {}, inB = {}, inBase = {};
      a.forEach(function (x) { inA[J(x)] = 1; }); b.forEach(function (x) { inB[J(x)] = 1; }); (Array.isArray(base) ? base : []).forEach(function (x) { inBase[J(x)] = 1; });
      var out = a.filter(function (x) { var j = J(x); return !(inBase[j] && !inB[j]); }); // drop what the other side removed
      b.forEach(function (x) { var j = J(x); if (!inBase[j] && !inA[j]) { out.push(x); inA[j] = 1; } }); // add what it added
      if (out.length && out.every(function (x) { return tsOf(x) !== null; })) out.sort(function (p, q) { return tsOf(p) - tsOf(q); });
      return out;
    }
    if (isObj(a) && isObj(b)) {
      var bo = isObj(base) ? base : {}, o = {}, ks = {};
      Object.keys(a).concat(Object.keys(b)).forEach(function (k) { ks[k] = 1; });
      Object.keys(ks).forEach(function (k) { var r = merge3(k in bo ? bo[k] : undefined, a[k], b[k], k); if (r !== undefined) o[k] = r; });
      return o;
    }
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    if (typeof a === 'boolean' && typeof b === 'boolean') return a || b;
    return a;
  }
  // localStorage holds text: JSON where it can, plain text otherwise
  function dec(t) { if (t === null || t === undefined) return undefined; try { return { j: JSON.parse(t) }; } catch (e) { return { r: t }; } }
  function val(d) { return d === undefined ? undefined : 'j' in d ? d.j : d.r; }
  function mergeText(baseT, aT, bT, noBase) {
    if (aT === bT) return aT;
    var A = dec(aT), Bv = dec(bT), raw = (A && 'r' in A) || (Bv && 'r' in Bv);
    var r = merge3(noBase ? NONE : val(dec(baseT)), val(A), val(Bv));
    if (r === undefined) return null;
    return raw && typeof r === 'string' ? r : JSON.stringify(r);
  }

  /* add another device's changes into this one, against the last synced copy (base, or null for none).
     Returns the keys that changed here, as {key: text before}. */
  function mergeIn(data, base) {
    var s = ls(), changed = {}; if (!s) return changed;
    var mine = collect(), ks = {};
    Object.keys(data).concat(Object.keys(mine), base ? Object.keys(base) : []).forEach(function (k) { ks[k] = 1; });
    Object.keys(ks).forEach(function (k) {
      if (!INCLUDE.test(k) || EXCLUDE.test(k)) return;
      var cur = k in mine ? mine[k] : null, inc = typeof data[k] === 'string' ? data[k] : null;
      if (!base && inc === null) return; // no last sync: only ever add, as before
      var nv = mergeText(base && typeof base[k] === 'string' ? base[k] : null, cur, inc, !base);
      if (nv === cur) return;
      try { if (nv === null) s.removeItem(k); else rawSet.call(s, k, nv); changed[k] = cur; } catch (e) {}
    });
    return changed;
  }
  function hasProgress() { return Object.keys(collect()).some(function (k) { return appOf(k) !== 'shared'; }); }
  function hash(t) { var h = 5381; for (var i = 0; i < t.length; i++) h = (h * 33 + t.charCodeAt(i)) | 0; return t.length + '.' + (h >>> 0).toString(36); }
  /* take this device's progress off it (settings like theme and language stay). Also drops the daily safety copies. */
  function wipeLocal() {
    var s = ls(); if (!s) return;
    Object.keys(collect()).forEach(function (k) { if (appOf(k) !== 'shared') s.removeItem(k); });
    s.removeItem(UNDO); s.removeItem(CLOUD_HASH);
    try { indexedDB.deleteDatabase(SAFE_DB); } catch (e) {}
  }
  /* wait for any sync in progress, run one more, and say whether it worked */
  function settle() { return cloud.busy ? new Promise(function (r) { setTimeout(r, 250); }).then(settle) : sync().then(function () { return cloud.ok; }); }
  function same(a, b) { var ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every(function (k) { return a[k] === b[k]; }); }

  function sync() {
    if (!cloud.user || !window.ttCloudSDK || cloud.choice) { cloud.ok = false; return Promise.resolve(); }
    if (cloud.busy) { cloud.again = true; return Promise.resolve(); }
    cloud.busy = true; cloud.err = ''; drawCloud();
    var clearing = !!flag(CLOUD_CLEAR), pulled = null, uid = cloud.user.uid, base = null;
    return baseGet(uid).then(function (b) { base = b && b.data || null; return ttCloudSDK.update(uid, function (remote) {
      var get = remote && remote.code && !clearing ? fromCode(remote.code).then(normalise) : Promise.resolve(null);
      return get.then(function (r) {
        var theirs = (r && r.data) || {};
        var ch = mergeIn(theirs, remote && remote.code ? base : null);
        if (Object.keys(ch).length) pulled = Object.assign({}, ch, pulled || {}); // keep the oldest "before" if the save retries
        var mine = collect();
        if (!clearing && remote && same(mine, theirs)) return null; // the cloud already has all of it
        return toCode(pack()).then(function (code) {
          if (code.length > CLOUD_MAX) throw new Error('big');
          return { code: code, v: VERSION, bytes: code.length };
        });
      });
    }); }).then(function () {
      if (clearing) flag(CLOUD_CLEAR, null);
      cloud.last = Date.now(); var now = collect(); cloud.seen = JSON.stringify(now); cloud.ok = true; stamp();
      flag(CLOUD_UID, uid); flag(CLOUD_HASH, hash(cloud.seen));
      basePut(uid, { at: Date.now(), data: now }); // what the cloud now holds: the base for next time
      if (pulled) arrived(pulled);
    }).catch(function (e) {
      var c = (e && (e.code || e.message)) || '';
      cloud.ok = false;
      cloud.err = c === 'big' ? 'Your progress is too big to sync in one go. Use a save file instead, and tell us via "Report a bug".'
        : /permission/.test(c) ? 'The sync database refused this. Its rules may not be set up yet.'
        : /unavailable|network|offline|load/.test(c) ? 'Offline: it will sync when you are back online.'
        : 'Sync failed (' + c + '). It will try again.';
    }).then(function () {
      cloud.busy = false; cloud.fresh = false; drawCloud();
      if (cloud.again) { cloud.again = false; return sync(); }
    });
  }
  /* sync when progress has changed, without sending anything when nothing has */
  function syncIfChanged() { if (cloud.user && !cloud.busy && JSON.stringify(collect()) !== cloud.seen) sync(); }
  setInterval(syncIfChanged, 120000);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') syncIfChanged();
    else if (cloud.user && Date.now() - cloud.last > 60000) sync(); // back on this tab: fetch other devices' progress
  });
  window.addEventListener('pagehide', syncIfChanged);

  /* ---- progress came in from another device ----
     The open app still has the old progress in memory and would save it straight back over what just
     arrived. So until the page reloads, anything it saves to one of those keys is merged with what
     arrived (its own new changes are kept). The page then reloads by itself at a quiet moment: when you
     move to another page in the app, come back to the tab, or leave it alone for a bit. Never while a
     paper, exam, dialog or the save panel is open, or while you're typing. No message to click. */
  var pend = null, RL = 'tt-cloud-rl', NOTE = 'tt-cloud-note';
  var rawSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (pend && this === window.localStorage && Object.prototype.hasOwnProperty.call(pend, k)) {
      var p = pend[k]; // p.app = what the app last saw, p.now = what's stored with the other devices' changes
      var nv = mergeText(p.app, String(v), p.now, false);
      p.app = String(v); p.now = nv;
      return nv === null ? this.removeItem(k) : rawSet.call(this, k, nv);
    }
    return rawSet.call(this, k, v);
  };
  function ss() { try { return window.sessionStorage; } catch (e) { return null; } }
  function busyNow() {
    if (back || [].some.call(document.querySelectorAll('.tte,.tta-dlg,.tts-sure-back,.ttc-pop,.tte-res,[role=dialog]:not([hidden])'), function (e) { return e.offsetParent || getComputedStyle(e).position === 'fixed'; })) return true;
    if (window.ttBack && ttBack.isOpen && ttBack.isOpen()) return true;
    var a = document.activeElement; if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT' && /^(text|search|number|email|url|tel|password)$/.test(a.type) || a.isContentEditable) && a.value !== '') return true; // typing
    return document.visibilityState !== 'visible';
  }
  function quietReload(force) {
    if (!pend || (!force && busyNow())) return;
    var s2 = ss(), last = s2 ? +(s2.getItem(RL) || 0) : 0;
    if (Date.now() - last < 20000) return; // never reload in a loop
    try { s2 && s2.setItem(RL, String(Date.now())); s2 && s2.setItem(NOTE, '1'); } catch (e) {}
    setTimeout(function () { location.reload(); }, 250); // let the app's own save finish first
  }
  var idleT = null;
  function idleWatch() { clearTimeout(idleT); if (pend) idleT = setTimeout(function () { quietReload(); idleWatch(); }, 15000); }
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { document.addEventListener(t, function () { if (pend) idleWatch(); }, { capture: true, passive: true }); });
  window.addEventListener('hashchange', function () { quietReload(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') quietReload(); });

  function arrived(changed) {
    if (cloud.fresh) { cloud.fresh = false; if (back) msg('Signed in. Adding progress from your other devices… reloading.', 'ok'); setTimeout(function () { location.reload(); }, 900); return; }
    var s2 = ls(); pend = pend || {};
    Object.keys(changed || {}).forEach(function (k) { if (!pend[k]) pend[k] = { app: changed[k], now: s2 && s2.getItem(k) }; else pend[k].now = s2 && s2.getItem(k); });
    // just opened and not touched yet: reload straight away, nothing is lost
    if (!touched && !back && Date.now() - loadedAt < 10000) return quietReload(true);
    idleWatch();
  }
  // after a quiet reload: a small note, gone by itself
  (function () {
    var s2 = ss(); if (!s2 || !s2.getItem(NOTE)) return; s2.removeItem(NOTE);
    var show = function () {
      var t = document.createElement('div'); t.className = 'tts-toast'; t.setAttribute('role', 'status');
      t.innerHTML = '<span>Updated with progress from your other devices</span>';
      document.body.appendChild(t); setTimeout(function () { t.remove(); }, 4000);
    };
    if (document.body) setTimeout(show, 600); else document.addEventListener('DOMContentLoaded', function () { setTimeout(show, 600); });
  })();
  /* clearing progress on purpose: the cloud copy is replaced by what is left, instead of being merged back in */
  function cloudClearing() { if (flag(CLOUD_ON)) { flag(CLOUD_CLEAR, '1'); setTimeout(sync, 1500); } }

  var GLOGO = '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  /* start Google sign-in. Call it straight from a tap, so the Google window is allowed to open. */
  function signIn() {
    if (!cloud.ready || !window.ttCloudSDK) { open(); return; } // still loading: the panel shows progress and the button
    cloud.err = ''; cloud.fresh = true; flag(CLOUD_ON, 'pending'); // so the page picks the sign-in up if Google sends us back here
    nudgeClose();
    ttCloudSDK.signIn().catch(function (e) {
      var c = (e && e.code) || '';
      if (/popup-closed|cancelled-popup/.test(c)) { if (!cloud.user) flag(CLOUD_ON, null); return; }
      cloud.err = /unauthorized-domain/.test(c) ? 'Sign-in is not switched on for this web address yet.'
        : /network/.test(c) ? 'Could not reach Google. Check your connection.'
        : 'Sign-in did not work (' + c + ').';
      if (!back) open(); else drawCloud();
    });
  }

  /* account buttons: any element with data-tt-account shows "Sign in with Google", or your picture once signed in */
  function drawAccount() {
    var u = cloud.user, on = flag(CLOUD_ON) === '1';
    [].forEach.call(document.querySelectorAll('[data-tt-account]'), function (b) {
      if (u) {
        var first = (u.name || u.email || '').split(/[\s@]/)[0];
        b.innerHTML = (u.photo ? '<img src="' + esc(u.photo) + '" alt="" referrerpolicy="no-referrer" style="width:24px;height:24px;border-radius:50%;margin-left:-6px">' : '') + '<span>' + esc(first) + '</span><span class="txt"> · synced</span>';
        b.title = 'Syncing as ' + (u.email || u.name) + '. Open to sign out or sync now.';
      } else if (on && !cloud.ready) {
        b.innerHTML = '<span>Syncing…</span>'; b.title = 'Connecting to your Google account';
      } else {
        b.innerHTML = GLOGO.replace('width="18" height="18"', 'width="18" height="18" style="background:#fff;border-radius:50%;padding:2px;box-sizing:content-box"') + '<span style="white-space:nowrap">Sign in<span class="txt"> with Google</span></span>';
        b.title = 'Sign in with Google to sync your progress across devices';
      }
      b.hidden = false;
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tt-account],[data-tt-signin]'); if (!b) return;
    e.preventDefault();
    if (cloud.user || b.hasAttribute('data-tt-account') && cloud.err) open(); else signIn();
  });

  /* every time TrainTanmay is opened signed out, a small card asks you to sign in. "Not now" or × hides it until the next visit. */
  var NUDGE = 'tt-cloud-nudge', nudge = null;
  function nudgeClose() { if (nudge) { nudge.remove(); nudge = null; } }
  function nudgeShow() {
    var ss = null; try { ss = window.sessionStorage; } catch (e) {}
    if (cloud.user || flag(CLOUD_ON) || back || nudge || !cloud.ready || window.top !== window) return;
    if (ss && ss.getItem(NUDGE)) return; // already answered on this visit
    nudge = document.createElement('div'); nudge.className = 'tts tts-nudge'; nudge.setAttribute('role', 'dialog'); nudge.setAttribute('aria-labelledby', 'tts-nh');
    nudge.innerHTML = '<button class="x" type="button" aria-label="Close" data-nx>&times;</button><h2 id="tts-nh">Keep your progress on every device</h2>' +
      '<p class="mu">Sign in with Google once, and everything you do here follows you to your phone, laptop and school computer. You can keep using TrainTanmay without signing in.</p>' +
      '<div class="row" style="margin:0"><button type="button" class="pr" data-tt-signin>' + GLOGO + 'Sign in with Google</button><button type="button" data-nn>Not now</button></div>';
    document.body.appendChild(nudge);
    var later = function () { try { ss && ss.setItem(NUDGE, '1'); } catch (e) {} nudgeClose(); };
    nudge.querySelector('[data-nx]').onclick = later;
    nudge.querySelector('[data-nn]').onclick = later;
  }

  function drawCloud() {
    drawAccount();
    if (!back) return;
    var box = back.querySelector('#tts-cloud'); if (!box) return;
    var u = cloud.user, h;
    if (u && cloud.choice) {
      var unsynced = flag(CLOUD_HASH) !== hash(JSON.stringify(collect()));
      h = '<b>Signed in as ' + esc(u.email || u.name) + '</b><p class="mu" style="margin:4px 0 10px">The progress on this device came from a <b>different Google account</b>.' +
        (unsynced ? ' Some of it was never synced to that account.' : ' It is safe in that account.') + ' What should happen to it?</p>' +
        '<div class="row" style="margin:0"><button type="button" class="pr" id="tts-add">Add it to this account</button><button type="button" id="tts-fresh">Start fresh with this account</button></div>' +
        '<p class="mu" style="margin:8px 0 0">Add it if both accounts are yours. Start fresh if someone else used this device: their progress is removed from it' + (unsynced ? ', and the unsynced part is lost' : '') + '.</p>';
    } else if (u && cloud.out) {
      h = '<b>Sign out of ' + esc(u.email || u.name) + '?</b><p class="mu" style="margin:4px 0 10px">Your progress is synced to your Google account first. What should happen to the copy on this device?</p>' +
        '<div class="row" style="margin:0"><button type="button" class="pr" id="tts-keep">Keep it on this device</button><button type="button" class="danger" id="tts-rm">Remove it from this device</button><button type="button" id="tts-back">Cancel</button></div>' +
        '<p class="mu" style="margin:8px 0 0">Remove it on a shared or school computer. Signing in again brings it all back.</p>';
    } else if (u) {
      h = '<div class="cl-h">' + (u.photo ? '<img src="' + esc(u.photo) + '" alt="" referrerpolicy="no-referrer">' : '') + '<span><b>Syncing as ' + esc(u.name || u.email) + '</b><small>' + esc(u.email) + '</small></span></div>' +
        '<p class="mu" style="margin:8px 0">' + (cloud.busy ? 'Syncing…' : cloud.last ? 'Last synced ' + ago(cloud.last) + '. Your progress syncs by itself while you work.' : 'Your progress syncs by itself while you work.') + '</p>' +
        '<div class="row" style="margin:0"><button type="button" id="tts-sync"' + (cloud.busy ? ' disabled' : '') + '>Sync now</button><button type="button" id="tts-out">Sign out</button></div>';
    } else {
      h = '<b>Sync with Google</b><p class="mu" style="margin:4px 0 10px">Sign in once on each device and your progress follows you automatically. We keep your progress and your Google name and email, nothing else.</p>' +
        '<div class="row" style="margin:0"><button type="button" class="pr" id="tts-in-g"' + (cloud.ready ? '' : ' disabled') + '>' + GLOGO + '' + (cloud.ready ? 'Sign in with Google' : 'Loading…') + '</button></div>';
    }
    if (cloud.err) h += '<p class="msg bad" style="margin:8px 0 0">' + esc(cloud.err) + '</p>';
    box.innerHTML = h;
    var g = box.querySelector('#tts-in-g');
    if (g) g.onclick = signIn;
    var sn = box.querySelector('#tts-sync'); if (sn) sn.onclick = function () { sync(); };
    function on(id, fn) { var b = box.querySelector(id); if (b) b.onclick = fn; }
    on('#tts-out', function () { cloud.out = true; drawCloud(); });
    on('#tts-back', function () { cloud.out = false; drawCloud(); });
    function signedOut() { cloud.last = 0; cloud.seen = ''; cloud.err = ''; cloud.out = false; }
    on('#tts-keep', function () {
      box.innerHTML = '<p class="mu" style="margin:0">Syncing, then signing out…</p>';
      settle().then(function () { return ttCloudSDK.signOut(); }).then(function () { signedOut(); if (back) msg('Signed out. Your progress stays on this device, and is no longer synced.', 'ok'); });
    });
    on('#tts-rm', function () {
      confirmRaw('your progress in every app', function () {
        box.innerHTML = '<p class="mu" style="margin:0">Syncing, then signing out…</p>';
        settle().then(function (ok) {
          if (!ok) { cloud.out = false; cloud.err = 'Could not reach your Google account, so nothing was removed. Try again when you are online.'; drawCloud(); return; }
          return ttCloudSDK.signOut().then(function () { signedOut(); wipeLocal(); if (back) msg('Signed out and removed from this device. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 700); });
        });
      }, 'It stays safe in your Google account: signing in again on any device brings it back.');
    });
    on('#tts-add', function () { cloud.choice = false; cloud.fresh = true; sync(); });
    on('#tts-fresh', function () {
      confirmRaw('the other account’s progress', function () {
        cloud.choice = false; cloud.fresh = false; wipeLocal();
        box.innerHTML = '<p class="mu" style="margin:0">Fetching this account’s progress…</p>';
        sync().then(function () { if (back) msg('Done. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 600); });
      }, 'Use this if someone else used this device. Their progress stays in their own Google account if it was synced.');
    });
  }
  // connect a moment after the page opens: straight away if signed in before, otherwise so the sign-in card and buttons work
  drawAccount();
  setTimeout(function () { sdk().then(function () { setTimeout(nudgeShow, 1200); }, function () {}); }, flag(CLOUD_ON) ? 1200 : 1800);

  /* ---- the panel ---- */
  var css = document.createElement('style');
  css.textContent =
    '.tts-back{position:fixed;inset:0;z-index:100000;background:rgba(8,10,20,.45);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:grid;place-items:center;padding:16px;animation:ttsF .2s ease both}' +
    '@keyframes ttsF{from{opacity:0}}@keyframes ttsU{from{opacity:0;transform:translateY(10px) scale(.98)}}' +
    '.tts{width:min(520px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#fff;color:#14161b;border-radius:18px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45);padding:22px;font-size:15px;line-height:1.45;animation:ttsU .28s cubic-bezier(.2,.9,.25,1.1) both}' +
    '.tts h2{margin:0 0 4px;font-size:1.3rem}.tts p{margin:0 0 12px}.tts .mu{opacity:.7;font-size:.9rem}' +
    '.tts .apps{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0 16px}' +
    '.tts .ap{display:flex;gap:9px;align-items:center;padding:9px 10px;border:1px solid #e1e4ea;border-radius:12px}.tts .ap i{width:10px;height:10px;border-radius:50%;flex:none}.tts .ap b{display:block;font-size:.88rem}.tts .ap small{opacity:.65;font-size:.78rem}' +
    '.tts .row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.tts h3{margin:18px 0 2px;font-size:1rem}' +
    '.tts button,.tts label.b{font:inherit;font-size:.92rem;font-weight:600;padding:9px 14px;border-radius:10px;border:1px solid #c9ced8;background:#f6f7f9;color:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px}' +
    '.tts button:hover,.tts label.b:hover{background:#eceef2}.tts button.pr{background:#14161b;color:#fff;border-color:#14161b}.tts button.pr:hover{background:#2b2f38}' +
    '.tts button:focus-visible,.tts label.b:focus-within{outline:3px solid #5b9cff;outline-offset:2px}' +
    '.tts textarea{width:100%;box-sizing:border-box;min-height:74px;font:12px/1.35 ui-monospace,Menlo,Consolas,monospace;padding:8px;border-radius:10px;border:1px solid #c9ced8;background:#fafbfc;color:inherit;resize:vertical}' +
    '.tts .msg{min-height:1.2em;font-size:.9rem;margin-top:6px}.tts .msg.ok{color:#16794a}.tts .msg.bad{color:#b23a33}' +
    '.tts .x{float:right;border:0!important;background:none!important;font-size:1.4rem!important;padding:0 4px!important;line-height:1}' +
    '.tts .cf{border:1px solid #e1e4ea;border-radius:12px;padding:12px;margin-top:10px;background:#fbfbfd}' +
    '.tts .drop{outline:2px dashed #5b9cff;outline-offset:4px}' +
    '.tts-sure-back{position:fixed;inset:0;z-index:100001;background:rgba(8,10,20,.35);animation:ttsF .2s ease both}' +
    '.tts.tts-sure{position:fixed;width:min(360px,calc(100vw - 48px));border-top:5px solid #b23a33}' +
    '.tts button.danger{background:none;color:#b23a33;border-color:#b23a33}.tts button.danger:hover{background:#b23a3314}' +
    '@media (prefers-color-scheme:dark){.tts button.danger{color:#ff8a80;border-color:#ff8a80}}' +
    '@media (prefers-color-scheme:dark){.tts{background:#1c1e24;color:#eceef2}.tts .ap,.tts .cf{border-color:#363a44}.tts .cf{background:#22252c}.tts button,.tts label.b{background:#2a2d35;border-color:#424754}.tts button:hover,.tts label.b:hover{background:#333743}.tts button.pr{background:#eceef2;color:#14161b;border-color:#eceef2}.tts textarea{background:#15171b;border-color:#424754}.tts .msg.ok{color:#5fd39a}.tts .msg.bad{color:#ff8a80}}' +
    '.tts .cl-h{display:flex;gap:10px;align-items:center}.tts .cl-h img{width:34px;height:34px;border-radius:50%}.tts .cl-h small{display:block;opacity:.65;font-size:.8rem}' +
    '.tts-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:99999;display:flex;gap:10px;align-items:center;max-width:calc(100vw - 24px);background:#14161b;color:#fff;padding:10px 12px 10px 16px;border-radius:12px;box-shadow:0 14px 40px -10px rgba(0,0,0,.5);font-size:.92rem;animation:ttsU .28s ease both}' +
    '.tts-toast button{font:inherit;font-weight:600;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;background:#fff;color:#14161b}.tts-toast button[data-c]{background:none;color:#aaa;font-size:1.2rem;padding:2px 6px}' +
    '.tts.tts-nudge{position:fixed;right:16px;bottom:16px;z-index:99998;width:min(380px,calc(100vw - 24px));padding:18px 18px 16px;border-top:5px solid #5b9cff}.tts-nudge h2{font-size:1.1rem;padding-right:24px}.tts-nudge p{font-size:.92rem}' +
    '@media (max-width:460px){.tts.tts-nudge{right:12px;bottom:12px}}' +
    '@media (max-width:460px){.tts .apps{grid-template-columns:1fr}}' +
    '@media (prefers-reduced-motion:reduce){.tts-back,.tts{animation:none}}';
  document.head.appendChild(css);

  var back = null, lastFocus = null;
  function close() { if (back) { back.remove(); back = null; lastFocus && lastFocus.focus && lastFocus.focus(); } }
  function el(sel) { return back.querySelector(sel); }
  function msg(t, kind) { var m = el('#tts-msg'); m.textContent = t; m.className = 'msg' + (kind ? ' ' + kind : ''); }

  function open() {
    close(); nudgeClose(); lastFocus = document.activeElement;
    var data = collect(), any = Object.keys(data).some(function (k) { return appOf(k) !== 'shared'; });
    var hasUndo = false; try { hasUndo = !!(ls() && ls().getItem(UNDO)); } catch (e) {}
    back = document.createElement('div'); back.className = 'tts-back';
    back.innerHTML =
      '<div class="tts" role="dialog" aria-modal="true" aria-labelledby="tts-h">' +
      '<button class="x" type="button" aria-label="Close" data-x>&times;</button>' +
      '<h2 id="tts-h">Save your progress</h2>' +
      '<p class="mu">One save covers every TrainTanmay app. Progress lives in this browser, so sync it with Google or save it before you switch device or clear your history. Last saved: <b>' + ago(lastTime()) + '</b>.</p>' +
      '<div id="tts-cloud" class="cf" style="margin:12px 0 4px"></div>' +
      '<div class="apps">' + APPS.map(function (a) { var d = describe(a.id, data); return '<div class="ap"><i style="background:' + a.col + '"></i><span><b>' + a.name + '</b><small>' + (d || 'nothing yet') + '</small></span></div>'; }).join('') + '</div>' +
      '<h3>Save</h3><div class="row"><button class="pr" type="button" id="tts-file"' + (any ? '' : ' disabled') + '>Download save file</button><button type="button" id="tts-copy"' + (any ? '' : ' disabled') + '>Copy save code</button></div>' +
      '<p class="mu">The save code is text you can email to yourself or paste into a note. Use it if downloads are blocked (e.g. on school computers).</p>' +
      '<h3>Load</h3><p class="mu">Choose a save file, or paste a save code. Loading only <b>adds</b> to what you have: nothing here is removed or overwritten. Older one-app backups work too.</p>' +
      '<div class="row"><label class="b" tabindex="0" id="tts-pick">Choose save file<input type="file" id="tts-in" accept=".json,application/json,text/plain" hidden></label></div>' +
      '<textarea id="tts-paste" placeholder="…or paste a save code here" aria-label="Paste a save code"></textarea>' +
      '<div id="tts-cf"></div><div id="tts-msg" class="msg" role="status" aria-live="polite"></div>' +
      (hasUndo ? '<div class="row"><button type="button" id="tts-undo">Undo the last load</button></div>' : '') +
      '<div id="tts-safe"></div>' +
      '</div>';
    document.body.appendChild(back);
    drawCloud(); sdk().catch(function () {});
    back.addEventListener('click', function (e) { if (e.target === back || e.target.hasAttribute('data-x')) close(); });
    el('#tts-file').focus();

    el('#tts-file').onclick = function () {
      var txt = JSON.stringify(pack());
      try {
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' }));
        a.download = 'traintanmay-save-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        stamp(); msg('Save file downloaded. Keep it somewhere safe, like your school OneDrive or email.', 'ok');
      } catch (e) { msg('Downloads are blocked here. Use "Copy save code" instead.', 'bad'); }
    };
    el('#tts-copy').onclick = function () {
      toCode(pack()).then(function (code) {
        var ta = el('#tts-paste'); ta.value = code;
        var done = function () { stamp(); msg('Save code copied (' + Math.ceil(code.length / 1024) + ' KB). Paste it into an email or note to yourself.', 'ok'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, function () { ta.select(); stamp(); msg('Copying is blocked: the code is selected in the box, so press Ctrl+C.', 'ok'); });
        else { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { msg('Press Ctrl+C to copy the selected code.', 'ok'); } }
      });
    };

    function offer(text) {
      el('#tts-cf').innerHTML = '';
      parseAny(text).then(function (r) {
        if (!r || !Object.keys(r.data).length) throw 0;
        var names = APPS.filter(function (a) { return Object.keys(r.data).some(function (k) { return appOf(k) === a.id; }); }).map(function (a) { return a.name; });
        var when = r.saved ? new Date(r.saved).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
        el('#tts-cf').innerHTML = '<div class="cf"><b>' + r.from + (when ? ' from ' + when : '') + '</b><p class="mu" style="margin:4px 0 10px">Contains: ' + (names.join(', ') || 'settings only') + '. It is added to what this device already has: anything missing is filled in, and nothing here is removed.</p><div class="row" style="margin:0"><button class="pr" type="button" id="tts-go">Load it</button><button type="button" id="tts-no">Cancel</button></div></div>';
        msg('');
        el('#tts-go').focus();
        el('#tts-no').onclick = function () { el('#tts-cf').innerHTML = ''; };
        el('#tts-go').onclick = function () {
          try { restore(r.data); msg('Added to your progress. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 500); }
          catch (e) { msg('Could not save to this browser (storage may be full or blocked).', 'bad'); }
        };
      }).catch(function () { msg('That is not a TrainTanmay save. Check you copied the whole code, starting with TT1.', 'bad'); });
    }
    el('#tts-pick').onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el('#tts-in').click(); } };
    el('#tts-in').onchange = function (e) { var f = e.target.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { offer(rd.result); }; rd.readAsText(f); e.target.value = ''; };
    el('#tts-paste').addEventListener('input', function (e) { var v = e.target.value.trim(); if (v.length > 20) offer(v); });
    var box = el('.tts');
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('drop'); });
    box.addEventListener('dragleave', function () { box.classList.remove('drop'); });
    box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('drop'); var f = e.dataTransfer.files[0]; if (f) { var rd = new FileReader(); rd.onload = function () { offer(rd.result); }; rd.readAsText(f); } });
    safeList().then(function (snaps) {
      if (!back || !snaps.length) return;
      el('#tts-safe').innerHTML = '<h3>Automatic copies</h3><p class="mu">This browser keeps a copy of your progress from each of the last ' + SAFE_KEEP + ' days you used TrainTanmay. If something ever looks wrong, put one back.</p><div class="row">' +
        snaps.map(function (s, i) { return '<button type="button" data-snap="' + i + '">' + new Date(s.at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }) + '</button>'; }).join('') + '</div>';
      [].forEach.call(back.querySelectorAll('[data-snap]'), function (b) {
        b.onclick = function () { var s = snaps[+b.getAttribute('data-snap')]; offer(JSON.stringify({ kind: 'all-apps', saved: new Date(s.at).toISOString(), data: s.data })); };
      });
    });
    var u = el('#tts-undo'); if (u) u.onclick = function () { if (undo()) { msg('Put back what was here before. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 500); } };
  }
  document.addEventListener('keydown', function (e) {
    if (!back) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { var f = [].filter.call(back.querySelectorAll('button:not([disabled]),textarea,label.b'), function (x) { return x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  /* any element with data-tt-save opens the panel */
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-tt-save]'); if (t) { e.preventDefault(); open(); } });

  window.ttSave = { open: open, sync: sync, collect: collect, parse: parseAny, merge: mergeVal, confirm3: confirm3, _normalise: normalise, _toCode: toCode,
    /* for the study leaderboards (league.js): the signed-in Google account, and the loaded Firebase SDK */
    cloud: { sdk: sdk, signIn: signIn, user: function () { return cloud.user; }, ready: function () { return cloud.ready; } } };
})();
