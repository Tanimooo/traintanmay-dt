/* TrainTanmay: one save for every app.
   Backs up D&T, Physics, Maths (incl. SketchGuessr) and ESAT progress together as one file or one
   copy-and-paste save code, and restores it on any device. Also reads the older one-app backups.
   Open it with window.ttSave.open() (the logo menu, the start screen and each Progress page do). */
(function () {
  if (window.ttSave) return;
  var VERSION = 1;
  var APPS = [
    { id: 'dt', name: 'Design & Technology', col: '#1f5fbf', keys: [/^tt-dt-/] },
    { id: 'physics', name: 'Physics', col: '#c81e66', keys: [/^tt-phys-/, /^tt-mockcfg$/] },
    { id: 'maths', name: 'Maths', col: '#1a7f45', keys: [/^tt-maths-/, /^sketchguessr-/] },
    { id: 'esat', name: 'ESAT', col: '#d9a300', keys: [/^esat\./] }
  ];
  var INCLUDE = /^(tt-|esat\.|sketchguessr-)/;
  var EXCLUDE = /^(tt-keep:|tt-probe|tt-restore-undo|esat\..*\.probe$)/;
  var LAST = 'tt-lastbackup', UNDO = 'tt-restore-undo';

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

  function restore(data) {
    var s = ls(); if (!s) throw new Error('storage');
    var before = {};
    Object.keys(data).forEach(function (k) { before[k] = s.getItem(k); });
    try { s.setItem(UNDO, JSON.stringify({ at: Date.now(), before: before })); } catch (e) {}
    Object.keys(data).forEach(function (k) { if (INCLUDE.test(k) && !EXCLUDE.test(k) && typeof data[k] === 'string') s.setItem(k, data[k]); });
  }
  function undo() {
    var s = ls(); if (!s) return false;
    var u = null; try { u = JSON.parse(s.getItem(UNDO) || 'null'); } catch (e) {}
    if (!u) return false;
    Object.keys(u.before).forEach(function (k) { if (u.before[k] === null) s.removeItem(k); else s.setItem(k, u.before[k]); });
    s.removeItem(UNDO); return true;
  }

  function ago(t) {
    if (!t) return 'never';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 2) return 'just now'; if (m < 60) return m + ' minutes ago';
    var h = Math.round(m / 60); if (h < 24) return h + ' hour' + (h === 1 ? '' : 's') + ' ago';
    var d = Math.round(h / 24); return d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }
  function stamp() { var s = ls(); try { s && s.setItem(LAST, String(Date.now())); } catch (e) {} }
  function lastTime() { var s = ls(); return s ? +(s.getItem(LAST) || 0) : 0; }

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
    '@media (prefers-color-scheme:dark){.tts{background:#1c1e24;color:#eceef2}.tts .ap,.tts .cf{border-color:#363a44}.tts .cf{background:#22252c}.tts button,.tts label.b{background:#2a2d35;border-color:#424754}.tts button:hover,.tts label.b:hover{background:#333743}.tts button.pr{background:#eceef2;color:#14161b;border-color:#eceef2}.tts textarea{background:#15171b;border-color:#424754}.tts .msg.ok{color:#5fd39a}.tts .msg.bad{color:#ff8a80}}' +
    '@media (max-width:460px){.tts .apps{grid-template-columns:1fr}}' +
    '@media (prefers-reduced-motion:reduce){.tts-back,.tts{animation:none}}';
  document.head.appendChild(css);

  var back = null, lastFocus = null;
  function close() { if (back) { back.remove(); back = null; lastFocus && lastFocus.focus && lastFocus.focus(); } }
  function el(sel) { return back.querySelector(sel); }
  function msg(t, kind) { var m = el('#tts-msg'); m.textContent = t; m.className = 'msg' + (kind ? ' ' + kind : ''); }

  function open() {
    close(); lastFocus = document.activeElement;
    var data = collect(), any = Object.keys(data).some(function (k) { return appOf(k) !== 'shared'; });
    var hasUndo = false; try { hasUndo = !!(ls() && ls().getItem(UNDO)); } catch (e) {}
    back = document.createElement('div'); back.className = 'tts-back';
    back.innerHTML =
      '<div class="tts" role="dialog" aria-modal="true" aria-labelledby="tts-h">' +
      '<button class="x" type="button" aria-label="Close" data-x>&times;</button>' +
      '<h2 id="tts-h">Save your progress</h2>' +
      '<p class="mu">One save covers every TrainTanmay app. Progress lives in this browser, so save it before you switch device or clear your history. Last saved: <b>' + ago(lastTime()) + '</b>.</p>' +
      '<div class="apps">' + APPS.map(function (a) { var d = describe(a.id, data); return '<div class="ap"><i style="background:' + a.col + '"></i><span><b>' + a.name + '</b><small>' + (d || 'nothing yet') + '</small></span></div>'; }).join('') + '</div>' +
      '<h3>Save</h3><div class="row"><button class="pr" type="button" id="tts-file"' + (any ? '' : ' disabled') + '>Download save file</button><button type="button" id="tts-copy"' + (any ? '' : ' disabled') + '>Copy save code</button></div>' +
      '<p class="mu">The save code is text you can email to yourself or paste into a note. Use it if downloads are blocked (e.g. on school computers).</p>' +
      '<h3>Load</h3><p class="mu">Choose a save file, or paste a save code. Older one-app backups work too.</p>' +
      '<div class="row"><label class="b" tabindex="0" id="tts-pick">Choose save file<input type="file" id="tts-in" accept=".json,application/json,text/plain" hidden></label></div>' +
      '<textarea id="tts-paste" placeholder="…or paste a save code here" aria-label="Paste a save code"></textarea>' +
      '<div id="tts-cf"></div><div id="tts-msg" class="msg" role="status" aria-live="polite"></div>' +
      (hasUndo ? '<div class="row"><button type="button" id="tts-undo">Undo the last load</button></div>' : '') +
      '</div>';
    document.body.appendChild(back);
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
        el('#tts-cf').innerHTML = '<div class="cf"><b>' + r.from + (when ? ' from ' + when : '') + '</b><p class="mu" style="margin:4px 0 10px">Contains: ' + (names.join(', ') || 'settings only') + '. This replaces the progress on this device for ' + (names.length === 1 ? 'that app' : 'those apps') + '. Other apps are left alone.</p><div class="row" style="margin:0"><button class="pr" type="button" id="tts-go">Load it</button><button type="button" id="tts-no">Cancel</button></div></div>';
        msg('');
        el('#tts-go').focus();
        el('#tts-no').onclick = function () { el('#tts-cf').innerHTML = ''; };
        el('#tts-go').onclick = function () {
          try { restore(r.data); msg('Loaded. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 500); }
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
    var u = el('#tts-undo'); if (u) u.onclick = function () { if (undo()) { msg('Put back what was here before. Reloading…', 'ok'); setTimeout(function () { location.reload(); }, 500); } };
  }
  document.addEventListener('keydown', function (e) {
    if (!back) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { var f = [].filter.call(back.querySelectorAll('button:not([disabled]),textarea,label.b'), function (x) { return x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  /* any element with data-tt-save opens the panel */
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-tt-save]'); if (t) { e.preventDefault(); open(); } });

  window.ttSave = { open: open, collect: collect, parse: parseAny, _normalise: normalise, _toCode: toCode };
})();
