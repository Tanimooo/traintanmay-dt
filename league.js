/* TrainTanmay study leagues: small weekly leaderboards for friends.
   Anyone signed in with Google can start a league (it gets a 6-letter code and a name) or join one with a code.
   Leagues have no size limit; you can be in up to 5 of them.
   Every app page counts your active revision minutes while the tab is on screen. Time with no clicks, typing,
   scrolling or taps is held back after a short while (SOFT); if it goes on (ASK), a "Still revising?" card asks,
   with 30 seconds to answer. Answer (or touch anything) and the held time counts; otherwise half of it counts and the
   clock waits for you to come back. This covers embedded papers too, whose own clicks the page cannot see.
   A running Focus session (focusbar.js) counts its focus time instead, and page activity is not counted twice.
   The exact limits are not shown to users. Minutes reset every Monday at 00:00 UK time. Each device keeps its own
   count; the leaderboard adds your devices together.
   Open the board with window.ttLeague.open(), or any element with data-tt-league.
   Firestore layout (rules in cloud/firestore.rules):
     leagues/{CODE}                 { name, owner, members: [uid], names: {uid: nickname}, edited: uid last renamed, created }
     leagues/{CODE}/scores/{uid}    { dev: {deviceId: {w, s, pw, ps}}, updated }   w = week (Monday date), s = seconds */
(function () {
  if (window.ttLeague || window.top !== window) return;
  /* real-world time (ttclock.js), falling back to the device clock until it loads */
  var T0 = Date.now();
  function NOW() { return window.ttClock ? window.ttClock.now() : Date.now(); }
  function clockOK() { return window.ttClock ? window.ttClock.ready : Date.now() - T0 > 6000; }

  var MAX_LEAGUES = 5; // leagues per person; a league has no size limit
  var me = document.currentScript;
  var TRACK = !(me && me.hasAttribute('data-notrack')) && !/help\.html$/.test(location.pathname);
  var K_TIME = 'tt-league-time', K_MINE = 'tt-league-mine', K_BEAT = 'tt-league-beat', K_SEL = 'tt-league-sel', K_DEV = 'tt-league-dev';

  function ls() { try { var s = window.localStorage; s.getItem('x'); return s; } catch (e) { return null; } }
  function get(k) { var s = ls(); try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function put(k, v) { var s = ls(); try { if (s) { if (v == null) s.removeItem(k); else s.setItem(k, v); } } catch (e) {} }
  function getJ(k, d) { try { var v = JSON.parse(get(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function rnd(n, abc) { var a = new Uint8Array(n), o = ''; (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < n; i++) o += abc[a[i] % abc.length]; return o; }

  /* ---- weeks: Monday 00:00 in the UK ---- */
  function uk(t) {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(t)).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
  }
  function weekInfo(t) {
    var u = uk(t || NOW()), day = Date.UTC(u.y, u.m - 1, u.d), wd = (new Date(day).getUTCDay() + 6) % 7; // 0 = Monday
    var mon = day - wd * 864e5, iso = function (x) { return new Date(x).toISOString().slice(0, 10); };
    var left = (7 - wd) * 1440 - (u.h * 60 + u.mi); // minutes until next Monday 00:00 UK
    return { week: iso(mon), prev: iso(mon - 7 * 864e5), left: left, mon: mon };
  }

  /* ---- this device's count ---- */
  var DEV = get(K_DEV); if (!DEV) { DEV = rnd(10, 'abcdefghijkmnpqrstuvwxyz23456789'); put(K_DEV, DEV); }
  function local() {
    var st = getJ(K_TIME, {}), w = weekInfo();
    if (st.w !== w.week) { // a new week: last week's count moves to pw/ps, this week starts at 0
      st = { w: w.week, s: 0, pw: st.w === w.prev ? st.w : (st.pw === w.prev ? st.pw : null), ps: st.w === w.prev ? (st.s || 0) : (st.pw === w.prev ? st.ps || 0 : 0) };
      if (!st.pw) { st.pw = null; st.ps = 0; }
      if (clockOK()) put(K_TIME, JSON.stringify(st)); // never start a new week on an unchecked clock
    }
    return st;
  }
  function addSeconds(n) { var st = local(); st.s = Math.min(7 * 86400, (st.s || 0) + n); put(K_TIME, JSON.stringify(st)); dirty = true; }

  var SOFT = 2 * 60000, ASK = 8 * 60000, ANSWER = 30000;
  var lastInput = NOW(), lastTick = NOW(), TAB = rnd(8, 'abcdefghijklmnopqrstuvwxyz'), dirty = false;
  var pending = 0, away = false, ask = null; // held seconds, gave no answer, the open "Still revising?" card
  function focusCounting() { try { return !!(window.ttFocus && window.ttFocus.counting()); } catch (e) { return false; } }
  function here() { // any sign of a person: held time counts, and the clock runs again
    lastInput = NOW(); away = false;
    if (pending) { addSeconds(pending); pending = 0; }
    if (ask) hideAsk();
  }
  function hideAsk() { if (!ask) return; clearTimeout(ask.t); clearInterval(ask.i); var el = ask.el; ask = null; el.classList.add('out'); setTimeout(function () { el.remove(); }, 220); }
  function giveUp() { if (pending) addSeconds(Math.floor(pending / 2)); pending = 0; away = true; hideAsk(); } // no answer: half the held time counts
  function showAsk() {
    if (ask || !document.body) return;
    if (!document.getElementById('ttlg-ask-css')) {
      var st = document.createElement('style'); st.id = 'ttlg-ask-css';
      st.textContent = '.ttlg-ask{position:fixed;left:50%;bottom:28px;z-index:2147483600;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:14px 16px 14px 14px;border-radius:18px;' +
        'background:rgba(16,18,34,.9);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);color:#fff;border:1px solid rgba(255,255,255,.14);' +
        'box-shadow:0 24px 60px -16px rgba(0,0,0,.6);font:15px/1.35 "IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;animation:ttlgAskIn .32s cubic-bezier(.2,.9,.25,1.3) both;max-width:calc(100vw - 24px)}' +
        '.ttlg-ask.out{animation:ttlgAskOut .2s ease both}@keyframes ttlgAskIn{from{opacity:0;transform:translate(-50%,24px) scale(.96)}}@keyframes ttlgAskOut{to{opacity:0;transform:translate(-50%,16px)}}' +
        '.ttlg-ask svg{width:46px;height:46px;flex:none;transform:rotate(-90deg)}.ttlg-ask .rg{fill:none;stroke:rgba(255,255,255,.15);stroke-width:4}.ttlg-ask .ar{fill:none;stroke:#8fd0ff;stroke-width:4;stroke-linecap:round;stroke-dasharray:119.4;transition:stroke-dashoffset 1s linear}' +
        '.ttlg-ask .n{position:absolute;left:14px;width:46px;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}.ttlg-ask b{display:block;font-size:16px}.ttlg-ask small{color:#b9bdd8}' +
        '.ttlg-ask button{font:inherit;font-weight:700;border:0;border-radius:12px;padding:10px 16px;background:#8fd0ff;color:#06203a;cursor:pointer;white-space:nowrap}.ttlg-ask button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
        '@media (prefers-reduced-motion:reduce){.ttlg-ask,.ttlg-ask.out{animation:none}}';
      document.head.appendChild(st);
    }
    var el = document.createElement('div'); el.className = 'ttlg-ask'; el.setAttribute('role', 'alertdialog'); el.setAttribute('aria-live', 'assertive'); el.setAttribute('aria-label', 'Still revising?');
    el.innerHTML = '<svg viewBox="0 0 46 46" aria-hidden="true"><circle class="rg" cx="23" cy="23" r="19"/><circle class="ar" cx="23" cy="23" r="19"/></svg><span class="n" aria-hidden="true">30</span>' +
      '<span><b>Still revising?</b><small>Tap to keep your study time counting.</small></span><button type="button">I’m here</button>';
    (document.fullscreenElement || document.body).appendChild(el);
    var end = NOW() + ANSWER, ar = el.querySelector('.ar'), n = el.querySelector('.n');
    var paint = function () { var left = Math.max(0, end - NOW()); n.textContent = Math.ceil(left / 1000); ar.style.strokeDashoffset = String(119.4 * (1 - left / ANSWER)); };
    ask = { el: el, t: setTimeout(giveUp, ANSWER), i: setInterval(paint, 1000) };
    requestAnimationFrame(paint);
    el.querySelector('button').onclick = here; // the click also counts as input, but say so plainly
  }
  if (TRACK) {
    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'input'].forEach(function (t) { document.addEventListener(t, here, { capture: true, passive: true }); });
    var mv = 0; document.addEventListener('pointermove', function () { var n = NOW(); if (n - mv > 3000) { mv = n; here(); } }, { capture: true, passive: true });
    window.addEventListener('scroll', here, { capture: true, passive: true });
    document.addEventListener('visibilitychange', function () {
      lastTick = NOW(); // time while the tab was hidden never counts, even in the first tick back
      if (document.visibilityState === 'visible' && pending && !ask && !focusCounting()) showAsk(); // held time from before you left: ask about it
    });
    setInterval(function () {
      var now = NOW(), dt = Math.max(0, Math.min(now - lastTick, 15000)); lastTick = now;
      if (!clockOK()) return;
      if (focusCounting()) { if (ask) hideAsk(); pending = 0; return; } // a Focus session is counting this time
      if (document.visibilityState !== 'visible' || away) return;
      // two tabs open at once only count once: whichever tab ticked last in the past few seconds owns the clock
      var beat = (get(K_BEAT) || '').split(':');
      if (beat[1] && beat[1] !== TAB && now - (+beat[0] || 0) < 6000) return;
      put(K_BEAT, now + ':' + TAB);
      var sec = Math.round(dt / 1000), idle = now - lastInput;
      if (idle <= SOFT) addSeconds(sec);
      else { pending = Math.min(pending + sec, (ASK - SOFT + ANSWER) / 1000); if (idle >= ASK) showAsk(); }
      if (box && !editing && view !== 'add') drawSoon();
    }, 5000);
  }

  /* ---- names: allowed characters, length, and no swearing ---- */
  /* STRONG: blocked anywhere in the name, even run together ("f u c k", "fuuuck", "fvck" aside). WORDS: blocked as a whole word only,
     because they hide inside ordinary words (class, document, therapist, Pakistan, raccoon, basement, title). */
  var STRONG = ['fuck', 'fuk', 'fck', 'fvck', 'fcuk', 'phuck', 'sloot', 'cvnt', 'shit', 'cunt', 'nigg', 'faggot', 'bitch', 'whore', 'slut', 'wank', 'twat', 'pussy', 'penis', 'vagina', 'porn', 'nazi', 'hitler', 'retard', 'bastard', 'bollock', 'asshole', 'arsehole', 'dildo', 'jizz', 'paedo', 'pedophile', 'blowjob', 'handjob', 'boner', 'horny', 'nonce', 'spastic', 'killyourself', 'motherf', 'bellend', 'knobhead', 'dickhead', 'tranny', 'chink', 'kike', 'gook', 'testicle', 'scrotum', 'clitoris', 'orgasm', 'boob', 'titties', 'nude', 'naked', 'sexy', 'milf', 'onlyfans', 'kkk', 'heil'];
  var WORDS = ['ass', 'arse', 'cum', 'tit', 'tits', 'dick', 'dicks', 'cock', 'cocks', 'prick', 'fag', 'fags', 'hoe', 'hoes', 'sex', 'piss', 'knob', 'nob', 'pedo', 'rape', 'raped', 'rapist', 'raping', 'slag', 'skank', 'thot', 'wtf', 'stfu', 'kys', 'homo', 'lesbo', 'pube', 'pubes', 'anal', 'anus', 'fanny', 'minge', 'tosser', 'paki', 'pakis', 'spic', 'coon', 'coons', 'negro', 'isis', 'semen', 'shag', 'clit', 'wanker'];
  var LEET = { '0': 'o', '1': 'i', '!': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '8': 'b', '9': 'g', '|': 'l' };
  function norm(t) { return String(t).toLowerCase().replace(/[01!34@5$789|]/g, function (c) { return LEET[c]; }).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function rude(t) {
    var n = norm(t), flat = n.replace(/[^a-z]/g, '').replace(/scunthorpe|penistone|swank|shiitake/g, ''), squeezed = flat.replace(/(.)\1+/g, '$1');
    if (STRONG.some(function (w) { var sq = w.replace(/(.)\1+/g, '$1'); return flat.indexOf(w) >= 0 || (sq.length >= 4 && squeezed.indexOf(sq) >= 0); })) return true;
    var toks = n.split(/[^a-z]+/).filter(Boolean);
    return toks.some(function (w) { return WORDS.indexOf(w) >= 0 || WORDS.indexOf(w.replace(/(.)\1+/g, '$1')) >= 0; });
  }
  /* returns an error message, or '' if the name is fine */
  function checkName(t, lo, hi, what) {
    t = String(t || '').trim();
    if (t.length < lo) return what + ' needs at least ' + lo + ' characters.';
    if (t.length > hi) return what + ' can be at most ' + hi + ' characters.';
    if (!/^[A-Za-z0-9 '._-]+$/.test(t)) return 'Use letters, numbers, spaces and . _ - \' only.';
    if (rude(t)) return 'Please pick a different ' + what.toLowerCase() + '. Keep it friendly.';
    return '';
  }
  function tidy(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }

  /* ---- the cloud ---- */
  var user = null, sdkOK = false, leagues = {}, scores = {}, err = '', busy = false, loadedOnce = false;
  function fs() { return window.ttCloudSDK && ttCloudSDK.fs; }
  function mine() { return getJ(K_MINE, []); }
  function setMine(a) { put(K_MINE, JSON.stringify(a)); }
  function connect() {
    if (!window.ttSave || !ttSave.cloud) { setTimeout(connect, 800); return; }
    ttSave.cloud.sdk().then(function () {
      sdkOK = true;
      ttCloudSDK.onUser(function (u) {
        var was = user && user.uid; user = u;
        if (!u) { leagues = {}; scores = {}; setMine([]); loadedOnce = false; }
        else if (u.uid !== was) refresh();
        drawSoon();
      });
    }, function () { err = 'Could not connect. Check your connection, or your school network may block it.'; drawSoon(); });
  }
  setTimeout(connect, 1500);

  function errText(e) {
    var c = (e && (e.code || e.message)) || String(e || '');
    return c === 'nocode' ? 'No league has that code. Check it and try again.'
      : c === 'many' ? 'You are already in ' + MAX_LEAGUES + ' leagues. Leave one first.'
      : /permission/.test(c) ? 'The leaderboard database refused this. Its rules may not be set up yet.'
      : /unavailable|network|offline/.test(c) ? 'You seem to be offline. Try again in a moment.'
      : 'Something went wrong (' + c + ').';
  }

  /* send this device's count to every league you're in */
  function push() {
    if (!user || !fs()) return Promise.resolve();
    var codes = mine(); if (!codes.length) return Promise.resolve();
    var st = local(), w = weekInfo(), uid = user.uid; dirty = false;
    return Promise.all(codes.map(function (c) {
      return fs().tx('leagues/' + c + '/scores/' + uid, function (cur) {
        var dev = {}, old = (cur && cur.dev) || {};
        Object.keys(old).forEach(function (k) { var e = old[k]; if (k !== DEV && e && (e.w === w.week || e.w === w.prev)) dev[k] = e; });
        dev[DEV] = { w: st.w, s: st.s || 0, pw: st.pw || null, ps: st.ps || 0 };
        var keys = Object.keys(dev); if (keys.length > 8) keys.sort(function (a, b) { return (dev[b].s || 0) - (dev[a].s || 0); }).slice(8).forEach(function (k) { delete dev[k]; });
        return { dev: dev, updated: fs().now() };
      }).catch(function () {});
    }));
  }
  setInterval(function () { if (dirty) push(); }, 180000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && dirty) push(); });

  /* find your leagues, then load each one's board */
  function refresh() {
    if (!user || !fs()) return Promise.resolve();
    busy = true; drawSoon();
    var uid = user.uid;
    return fs().mine('leagues', 'members', uid).then(function (list) {
      leagues = {}; list.forEach(function (d) { leagues[d.id] = d.data; });
      var codes = list.map(function (d) { return d.id; }).sort(function (a, b) { return ((leagues[a].created || {}).seconds || 0) - ((leagues[b].created || {}).seconds || 0); });
      setMine(codes);
      return tidySeats(codes).then(push).then(function () {
        return Promise.all(codes.map(function (c) {
          return fs().list('leagues/' + c + '/scores').then(function (rows) { var o = {}; rows.forEach(function (r) { o[r.id] = r.data; }); scores[c] = o; });
        }));
      });
    }).then(function () { err = ''; loadedOnce = true; }, function (e) { err = errText(e); })
      .then(function () { busy = false; drawSoon(); });
  }

  /* memberships/{uid} lists the leagues you are in, so the database can hold you to 5 */
  function seat() { return 'memberships/' + user.uid; }
  /* bring that list in line with the leagues you are really in, one change at a time (as the rules ask) */
  function tidySeats(codes) {
    var p = seat();
    return fs().get(p).then(function (m) {
      var have = (m && m.codes) || [], stale = have.filter(function (c) { return codes.indexOf(c) < 0; }), missing = codes.filter(function (c) { return have.indexOf(c) < 0; });
      var steps = stale.map(function (c) { return function (cur) { return cur.filter(function (x) { return x !== c; }); }; })
        .concat(missing.map(function (c) { return function (cur) { return cur.length < MAX_LEAGUES ? cur.concat([c]) : null; }; }));
      var chain = Promise.resolve(have);
      steps.forEach(function (step) { chain = chain.then(function (cur) { var next = step(cur); return next ? fs().set(p, { codes: next }).then(function () { return next; }) : cur; }); });
      return chain;
    }).catch(function () {});
  }

  function newCode() { return rnd(6, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'); }
  function create(name, nick) {
    if (mine().length >= MAX_LEAGUES) return Promise.reject(new Error('many'));
    var uid = user.uid, tries = 0;
    function attempt() {
      var code = newCode();
      return fs().txMany(['leagues/' + code, seat()], function (cur) {
        if (cur[0]) throw new Error('taken');
        var codes = (cur[1] && cur[1].codes) || [];
        if (codes.length >= MAX_LEAGUES) throw new Error('many');
        var names = {}; names[uid] = nick;
        return [{ name: name, owner: uid, members: [uid], names: names, created: fs().now() }, { codes: codes.concat([code]) }];
      }).then(function () { return code; }, function (e) { if (e && e.message === 'taken' && ++tries < 6) return attempt(); throw e; });
    }
    return attempt();
  }
  function join(code, nick) {
    if (mine().length >= MAX_LEAGUES && mine().indexOf(code) < 0) return Promise.reject(new Error('many'));
    var uid = user.uid;
    return fs().txMany(['leagues/' + code, seat()], function (cur) {
      var L = cur[0], codes = (cur[1] && cur[1].codes) || [];
      if (!L) throw new Error('nocode');
      if (L.members.indexOf(uid) >= 0) return [null, null];
      if (codes.length >= MAX_LEAGUES) throw new Error('many');
      var names = Object.assign({}, L.names); names[uid] = nick;
      return [Object.assign({}, L, { members: L.members.concat([uid]), names: names }), { codes: codes.concat([code]) }];
    }).then(function () { return code; });
  }
  /* set someone's name on the board: your own, or anyone's if you lead the league */
  function rename(code, who, nick) {
    return fs().tx('leagues/' + code, function (cur) {
      if (!cur || cur.members.indexOf(who) < 0) return null;
      var names = Object.assign({}, cur.names); names[who] = nick;
      return Object.assign({}, cur, { names: names, edited: who });
    });
  }
  /* the leader hands the league to another member */
  function makeLeader(code, who) {
    return fs().tx('leagues/' + code, function (cur) {
      if (!cur || cur.members.indexOf(who) < 0 || cur.owner !== user.uid) return null;
      return Object.assign({}, cur, { owner: who });
    });
  }
  /* take someone out of a league: yourself (leaving), or anyone if you lead it */
  function remove(code, who) {
    var uid = user.uid, self = who === uid;
    var first = self ? fs().del('leagues/' + code + '/scores/' + uid).catch(function () {}) : Promise.resolve();
    return first.then(function () {
      return fs().txMany(['leagues/' + code, seat()], function (both) {
        var cur = both[0];
        if (!cur || cur.members.indexOf(who) < 0) return [null, null];
        var members = cur.members.filter(function (m) { return m !== who; }), names = Object.assign({}, cur.names);
        delete names[who];
        var owner = cur.owner === who ? (members[0] || who) : cur.owner;
        // leaving frees one of your 5 places (someone you remove frees theirs the next time they open the board)
        var codes = (both[1] && both[1].codes) || [];
        var mineNext = self && codes.indexOf(code) >= 0 ? { codes: codes.filter(function (c) { return c !== code; }) } : null;
        return [Object.assign({}, cur, { members: members, names: names, owner: owner }), mineNext];
      });
    });
  }

  /* ---- totals ---- */
  function totals(code) {
    var w = weekInfo(), L = leagues[code], sc = scores[code] || {}, rows = [];
    if (!L) return rows;
    L.members.forEach(function (uid) {
      var dev = Object.assign({}, (sc[uid] && sc[uid].dev) || {});
      if (user && uid === user.uid) { var st = local(); dev[DEV] = st; }
      var now = 0, last = 0;
      Object.keys(dev).forEach(function (k) {
        var e = dev[k] || {};
        if (e.w === w.week) now += e.s || 0;
        if (e.w === w.prev) last += e.s || 0; else if (e.pw === w.prev) last += e.ps || 0;
      });
      rows.push({ uid: uid, name: (L.names || {})[uid] || 'Someone', s: now, last: last, me: !!(user && uid === user.uid), owner: uid === L.owner });
    });
    rows.sort(function (a, b) { return b.s - a.s || a.name.localeCompare(b.name); });
    return rows;
  }
  function hm(s) { var m = Math.floor((s || 0) / 60); if (m < 60) return m + 'm'; return Math.floor(m / 60) + 'h ' + (m % 60 < 10 ? '0' : '') + (m % 60) + 'm'; }
  function leftText(min) { var d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60; return d ? d + 'd ' + h + 'h' : h ? h + 'h ' + m + 'm' : m + 'm'; }

  /* ---- look ---- */
  function crown(kind) {
    var g = kind === 1 ? ['#fff3b0', '#ffcf3f', '#d99a00'] : ['#ffffff', '#dfe5ee', '#9aa6b6'];
    var id = 'ttlg' + kind;
    return '<svg class="crown c' + kind + '" viewBox="0 0 32 24" aria-label="' + (kind === 1 ? 'Gold crown, 1st place' : 'Silver crown, 2nd place') + '" role="img"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + g[0] + '"/><stop offset=".45" stop-color="' + g[1] + '"/><stop offset="1" stop-color="' + g[2] + '"/></linearGradient></defs>' +
      '<path d="M3 8l6.5 5.5L16 3l6.5 10.5L29 8l-2.6 12.5H5.6z" fill="url(#' + id + ')" stroke="' + g[2] + '" stroke-width="1.2" stroke-linejoin="round"/><rect x="5.4" y="19.4" width="21.2" height="3.2" rx="1.2" fill="url(#' + id + ')" stroke="' + g[2] + '" stroke-width="1"/>' +
      '<circle cx="3" cy="7.6" r="2" fill="' + g[1] + '"/><circle cx="16" cy="2.6" r="2.1" fill="' + g[1] + '"/><circle cx="29" cy="7.6" r="2" fill="' + g[1] + '"/><circle cx="16" cy="14.2" r="1.6" fill="' + (kind === 1 ? '#e0453a' : '#5b8cff') + '"/></svg>';
  }
  var HUES = [262, 199, 330, 152, 28, 48, 286, 8];
  function hue(uid) { var h = 0; for (var i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) | 0; return HUES[Math.abs(h) % HUES.length]; }

  var css = document.createElement('style');
  css.textContent =
    '.ttlg-back{position:fixed;inset:0;z-index:100000;background:rgba(5,6,14,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:grid;place-items:center;padding:14px;animation:ttlgF .2s ease both}' +
    '@keyframes ttlgF{from{opacity:0}}@keyframes ttlgU{from{opacity:0;transform:translateY(12px) scale(.98)}}@keyframes ttlgR{from{opacity:0;transform:translateX(-8px)}}' +
    '@keyframes ttlgShine{0%,70%{transform:translateX(-120%) rotate(20deg)}100%{transform:translateX(220%) rotate(20deg)}}' +
    '.ttlg{position:relative;width:min(540px,100%);max-height:calc(100vh - 28px);overflow:auto;color:#eef0ff;border-radius:22px;padding:22px 22px 18px;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
      'background:radial-gradient(120% 70% at 0% 0%,rgba(120,92,255,.28),transparent 60%),radial-gradient(90% 60% at 100% 0%,rgba(255,196,60,.14),transparent 60%),#0e0f1c;' +
      'border:1px solid rgba(255,255,255,.09);box-shadow:0 40px 100px -30px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.06);animation:ttlgU .3s cubic-bezier(.2,.9,.25,1.1) both}' +
    '.ttlg *{box-sizing:border-box}.ttlg h2{margin:0;font-size:1.35rem;letter-spacing:-.01em;display:flex;align-items:center;gap:10px}' +
    '.ttlg .sub{margin:4px 0 0;color:#a3a7c7;font-size:.86rem}.ttlg .sub b{color:#eef0ff;font-weight:600}' +
    '.ttlg .x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.07);color:#cfd2ec;font-size:1.3rem;line-height:1;cursor:pointer}.ttlg .x:hover{background:rgba(255,255,255,.14)}' +
    '.ttlg .tabs{display:flex;gap:6px;flex-wrap:wrap;margin:16px 0 12px}' +
    '.ttlg .tab{font:inherit;font-size:.85rem;font-weight:600;padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#c9cce8;cursor:pointer;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.ttlg .tab:hover{background:rgba(255,255,255,.09)}.ttlg .tab[aria-selected=true]{background:#eef0ff;color:#12132a;border-color:#eef0ff}' +
    '.ttlg .card{border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);padding:14px}' +
    '.ttlg .lh{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}.ttlg .lh h3{margin:0;font-size:1.08rem;word-break:break-word}.ttlg .lh small{color:#9a9ec0;font-size:.8rem}' +
    '.ttlg .code{display:inline-flex;align-items:center;gap:8px;font:700 .95rem/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.14em;padding:7px 8px 7px 11px;border-radius:10px;background:rgba(255,255,255,.07);border:1px dashed rgba(255,255,255,.22);white-space:nowrap}' +
    '.ttlg .code button{font:600 .72rem/1 system-ui,sans-serif;letter-spacing:0;padding:5px 8px;border-radius:7px;border:0;background:#eef0ff;color:#12132a;cursor:pointer}' +
    '.ttlg ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}' +
    '.ttlg li{position:relative;display:grid;grid-template-columns:28px 40px 1fr auto;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);overflow:hidden}.ttlg.anim li{animation:ttlgR .35s ease both}' +
    '.ttlg li.p1{background:linear-gradient(100deg,rgba(255,204,64,.22),rgba(255,204,64,.04) 70%);border-color:rgba(255,204,64,.45)}' +
    '.ttlg li.p2{background:linear-gradient(100deg,rgba(210,220,235,.18),rgba(210,220,235,.03) 70%);border-color:rgba(210,220,235,.35)}' +
    '.ttlg li.p1::after{content:"";position:absolute;top:-50%;left:0;width:40px;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);animation:ttlgShine 5s ease-in-out infinite;pointer-events:none}' +
    '.ttlg li.me{box-shadow:inset 3px 0 0 #8f7bff}' +
    '.ttlg .rk{font-weight:800;font-size:1rem;color:#8d91b5;text-align:center;font-variant-numeric:tabular-nums}' +
    '.ttlg .av{position:relative;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:1rem;color:#fff}' +
    '.ttlg .av .crown{position:absolute;top:-15px;left:50%;width:26px;height:20px;transform:translateX(-50%) rotate(-8deg);filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))}' +
    '.ttlg .nm{min-width:0}.ttlg .nm b{display:block;font-size:.98rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ttlg .nm small{color:#9a9ec0;font-size:.75rem}' +
    '.ttlg .bar{display:block;height:5px;border-radius:5px;background:rgba(255,255,255,.07);margin-top:6px;overflow:hidden}.ttlg .bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#7b61ff,#46c2ff);transition:width .6s ease}' +
    '.ttlg li.p1 .bar i{background:linear-gradient(90deg,#ffb800,#ffe27a)}.ttlg li.p2 .bar i{background:linear-gradient(90deg,#9aa6b6,#eef2f8)}' +
    '.ttlg .tm{font-weight:800;font-size:1.02rem;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}.ttlg .tm small{display:block;font-weight:500;color:#9a9ec0;font-size:.72rem}' +
    '.ttlg .kick{border:0;background:none;color:#8d91b5;font-size:.72rem;padding:0;margin-left:6px;cursor:pointer;text-decoration:underline}' +
    '.ttlg .lead{display:inline-block;vertical-align:1px;margin-right:6px;font-size:.62rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 6px;border-radius:6px;background:rgba(143,123,255,.25);color:#cfc6ff}' +
    '.ttlg .ed input{padding:6px 9px;font-size:.9rem}.ttlg .eb{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}' +
    '.ttlg .eb button{font:inherit;font-size:.75rem;font-weight:700;padding:5px 9px;border-radius:8px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#dfe1f7;cursor:pointer}' +
    '.ttlg .eb button:hover{background:rgba(255,255,255,.12)}.ttlg .eb .sv{background:#eef0ff;color:#12132a;border-color:#eef0ff}.ttlg .eb .rm{color:#ff9a90;border-color:rgba(255,154,144,.4)}' +
    '.ttlg .ed .msg{display:block;margin-top:4px;min-height:0}' +
    '.ttlg .empty{padding:10px 12px;border-radius:14px;border:1px dashed rgba(255,255,255,.14);color:#9a9ec0;font-size:.85rem;text-align:center}' +
    '.ttlg .champ{display:flex;align-items:center;gap:8px;margin-top:12px;padding:9px 12px;border-radius:12px;background:rgba(255,204,64,.08);color:#f3dc95;font-size:.85rem}.ttlg .champ svg{width:22px;height:17px;flex:none}' +
    '.ttlg .foot{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;margin-top:12px;color:#9a9ec0;font-size:.8rem}' +
    '.ttlg .lnk{font:inherit;font-size:.8rem;border:0;background:none;color:#b8bbdc;cursor:pointer;padding:4px 0;text-decoration:underline;text-underline-offset:3px}.ttlg .lnk:hover{color:#fff}.ttlg .lnk.bad{color:#ff9a90}' +
    '.ttlg .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}@media (max-width:520px){.ttlg .grid{grid-template-columns:1fr}.ttlg li{grid-template-columns:22px 36px 1fr auto;gap:8px;padding:9px 10px}.ttlg .av{width:36px;height:36px}}' +
    '.ttlg .grid h3{margin:0 0 4px;font-size:1rem}.ttlg .grid p{margin:0 0 10px;color:#a3a7c7;font-size:.82rem}' +
    '.ttlg label{display:block;font-size:.75rem;color:#a3a7c7;margin:8px 0 4px;font-weight:600}' +
    '.ttlg input{width:100%;font:inherit;font-size:.95rem;padding:9px 11px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.25);color:#fff;outline:none}.ttlg input:focus{border-color:#8f7bff;box-shadow:0 0 0 3px rgba(143,123,255,.3)}' +
    '.ttlg input.code-in{text-transform:uppercase;letter-spacing:.2em;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700}' +
    '.ttlg .btn{font:inherit;font-size:.9rem;font-weight:700;margin-top:12px;width:100%;padding:10px 14px;border-radius:11px;border:0;cursor:pointer;background:linear-gradient(135deg,#8f7bff,#5b8cff);color:#fff;box-shadow:0 8px 20px -8px rgba(110,100,255,.7)}' +
    '.ttlg .btn:hover{filter:brightness(1.08)}.ttlg .btn[disabled]{opacity:.55;cursor:default}.ttlg .btn.ghost{background:rgba(255,255,255,.08);box-shadow:none}' +
    '.ttlg .btn.g{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#fff;color:#1d1f2b}' +
    '.ttlg .msg{min-height:1.2em;margin-top:8px;font-size:.82rem;color:#ff9a90}.ttlg .msg.ok{color:#79e0a6}' +
    '.ttlg .how{margin-top:14px;color:#8d91b5;font-size:.76rem;line-height:1.4}' +
    '.ttlg button:focus-visible,.ttlg .tab:focus-visible{outline:3px solid #8f7bff;outline-offset:2px}' +
    '.ttlg .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:ttlgS .8s linear infinite;vertical-align:-2px}@keyframes ttlgS{to{transform:rotate(360deg)}}' +
    '@media (prefers-reduced-motion:reduce){.ttlg,.ttlg li,.ttlg-back{animation:none}.ttlg li.p1::after{display:none}}';
  document.head.appendChild(css);

  var box = null, back = null, lastFocus = null, sel = get(K_SEL), view = '', poll = null, drawT = null, editing = null, animKey = '';
  function drawSoon() { if (!box || drawT) return; drawT = setTimeout(function () { drawT = null; draw(); }, 30); }
  function close() {
    if (!back) return; back.remove(); back = box = null; clearInterval(poll); poll = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function open(code) {
    close(); lastFocus = document.activeElement;
    if (code) { sel = code; view = ''; }
    back = document.createElement('div'); back.className = 'ttlg-back';
    back.innerHTML = '<div class="ttlg" role="dialog" aria-modal="true" aria-labelledby="ttlg-h"></div>';
    box = back.firstChild; animKey = ''; document.body.appendChild(back);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    if (user) push().then(refresh); else if (!sdkOK) connect();
    poll = setInterval(function () { if (user && document.visibilityState === 'visible') refresh(); }, 60000);
    draw();
    var x = box.querySelector('.x'); if (x) x.focus();
  }

  function nickDefault() {
    var codes = mine();
    for (var i = 0; i < codes.length; i++) { var L = leagues[codes[i]]; if (L && L.names && user && L.names[user.uid]) return L.names[user.uid]; }
    var first = user ? tidy((user.name || '').split(' ')[0]).slice(0, 16).replace(/[^A-Za-z0-9 '._-]/g, '') : '';
    return checkName(first, 2, 16, 'Name') ? '' : first;
  }

  function header() {
    var w = weekInfo();
    return '<button class="x" type="button" aria-label="Close" data-x>&times;</button>' +
      '<h2 id="ttlg-h">' + crown(1).replace('class="crown c1"', 'class="crown c1" style="width:28px;height:21px"') + 'Study league</h2>' +
      '<p class="sub">Active revision minutes this week · resets <b>Monday</b> (in ' + leftText(w.left) + ')</p>';
  }
  function forms() {
    var nick = esc(nickDefault()), full = mine().length >= MAX_LEAGUES;
    return '<div class="grid">' +
      '<form class="card" data-f="new"><h3>Start a league</h3><p>You lead it, and get a code to share with your friends.</p>' +
        '<label for="ttlg-ln">League name</label><input id="ttlg-ln" name="lname" maxlength="24" placeholder="e.g. Physics Gang" autocomplete="off" required>' +
        '<label for="ttlg-n1">Your name on the board</label><input id="ttlg-n1" name="nick" maxlength="16" value="' + nick + '" autocomplete="off" required>' +
        '<button class="btn" type="submit"' + (full ? ' disabled' : '') + '>Create &amp; get code</button><div class="msg" role="status"></div></form>' +
      '<form class="card" data-f="join"><h3>Join with a code</h3><p>A friend shares their 6-letter league code.</p>' +
        '<label for="ttlg-c">League code</label><input id="ttlg-c" class="code-in" name="code" maxlength="6" placeholder="ABC234" autocomplete="off" spellcheck="false" required>' +
        '<label for="ttlg-n2">Your name on the board</label><input id="ttlg-n2" name="nick" maxlength="16" value="' + nick + '" autocomplete="off" required>' +
        '<button class="btn" type="submit"' + (full ? ' disabled' : '') + '>Join league</button><div class="msg" role="status"></div></form>' +
      '</div>' + (full ? '<p class="how">You are in ' + MAX_LEAGUES + ' leagues, the most allowed. Leave one to start or join another.</p>' : '');
  }

  function board(code) {
    var L = leagues[code]; if (!L) return '';
    var rows = totals(code), top = rows.length ? Math.max(rows[0].s, 60) : 60, w = weekInfo(), isOwner = user && L.owner === user.uid;
    var champ = rows.slice().sort(function (a, b) { return b.last - a.last; })[0];
    var h = '<div class="card"><div class="lh"><div><h3>' + esc(L.name) + '</h3><small>' + L.members.length + (L.members.length === 1 ? ' person' : ' people') + ' · share the code to invite' + '</small></div>' +
      '<span class="code" title="League code">' + esc(code) + '<button type="button" data-copy="' + esc(code) + '">Copy</button></span></div><ol>';
    rows.forEach(function (r, i) {
      var place = r.s > 0 ? i + 1 : 0, cls = (place === 1 ? 'p1' : place === 2 ? 'p2' : '') + (r.me ? ' me' : '');
      var hu = hue(r.uid);
      h += '<li class="' + cls + '" style="animation-delay:' + Math.min(i, 10) * 40 + 'ms">' +
        '<span class="rk">' + (i + 1) + '</span>' +
        '<span class="av" style="background:linear-gradient(135deg,hsl(' + hu + ' 80% 62%),hsl(' + (hu + 30) + ' 75% 45%))">' + esc(r.name.charAt(0).toUpperCase()) + (place === 1 ? crown(1) : place === 2 ? crown(2) : '') + '</span>' +
        (editing === r.uid ? editor(r, isOwner) :
        '<span class="nm"><b>' + esc(r.name) + '</b><small>' + (r.owner ? '<span class="lead">Leader</span>' : '') + (r.me ? 'You' : r.owner ? '' : 'Member') +
          (r.me || isOwner ? '<button class="kick" type="button" data-edit="' + esc(r.uid) + '">' + (r.me ? 'edit name' : 'edit') + '</button>' : '') + '</small>' +
          '<span class="bar"><i style="width:' + Math.round(100 * r.s / top) + '%"></i></span></span>') +
        '<span class="tm">' + (r.s >= 60 ? hm(r.s) : '0m') + '<small>this week</small></span></li>';
    });
    if (rows.length < 2) h += '<li class="empty" style="display:block">Share <b>' + esc(code) + '</b> so friends can join</li>';
    h += '</ol>';
    if (champ && champ.last >= 60) h += '<div class="champ">' + crown(1) + '<span>Last week’s champion: <b>' + esc(champ.name) + '</b> · ' + hm(champ.last) + '</span></div>';
    h += '<div class="foot"><span>Week of ' + new Date(w.mon).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) + (busy ? ' · <span class="spin" aria-label="Updating"></span>' : '') + '</span><span>' +
      '<button class="lnk bad" type="button" data-leave>Leave league</button></span></div>' +
      '<div class="msg" role="status" id="ttlg-msg"></div></div>';
    return h;
  }

  /* inline editor on a row: anyone can rename themselves; the leader can rename, remove or promote anyone */
  function editor(r, isOwner) {
    return '<span class="nm ed"><input id="ttlg-ed" maxlength="16" value="' + esc(r.name) + '" aria-label="Name on the board" autocomplete="off">' +
      '<span class="eb"><button type="button" class="sv" data-save="' + esc(r.uid) + '">Save</button><button type="button" data-cancel>Cancel</button>' +
      (isOwner && !r.me ? '<button type="button" data-lead="' + esc(r.uid) + '">Make leader</button><button type="button" class="rm" data-kick="' + esc(r.uid) + '" data-who="' + esc(r.name) + '">Remove</button>' : '') +
      '</span><span class="msg" id="ttlg-edmsg" role="status"></span></span>';
  }

  function draw() {
    if (!box) return;
    var focusId = document.activeElement && box.contains(document.activeElement) && document.activeElement.id;
    var keep = {}; [].forEach.call(box.querySelectorAll('input'), function (i) { keep[i.id] = i.value; });
    var notes = {}; [].forEach.call(box.querySelectorAll('.msg'), function (m, i) { if (m.textContent) notes[(m.id || m.closest('[data-f]') && m.closest('[data-f]').getAttribute('data-f') || i)] = [m.textContent, m.className]; });
    var h = header(), codes = mine().filter(function (c) { return leagues[c] || !loadedOnce; });
    if (!user) {
      h += '<div class="card" style="margin-top:16px"><h3 style="margin:0 0 6px">Race your friends</h3><p class="sub" style="margin:0 0 4px">Start a league or join one with a code (you can be in up to ' + MAX_LEAGUES + '). It counts the minutes everyone actively revises across every TrainTanmay app. Top two get the crowns.</p>' +
        '<button class="btn g" type="button" data-signin' + (sdkOK ? '' : ' disabled') + '>' + (sdkOK ? '<svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Sign in with Google to play' : '<span class="spin"></span> Loading…') + '</button>' +
        (err ? '<div class="msg">' + esc(err) + '</div>' : '') + '</div>' +
        '<p class="how">Your minutes this week on this device: <b>' + hm(local().s) + '</b>. They join the board once you sign in.</p>';
    } else if (!loadedOnce && busy) {
      h += '<div class="card" style="margin-top:16px;text-align:center;color:#a3a7c7"><span class="spin"></span> Loading your leagues…</div>';
    } else {
      if (codes.length && codes.indexOf(sel) < 0 && view !== 'add') sel = codes[0];
      if (!codes.length) view = 'add';
      h += '<div class="tabs" role="tablist">' + codes.map(function (c) { var L = leagues[c]; return '<button class="tab" role="tab" type="button" data-tab="' + esc(c) + '" aria-selected="' + (view !== 'add' && c === sel) + '">' + esc(L ? L.name : c) + '</button>'; }).join('') +
        '<button class="tab" role="tab" type="button" data-add aria-selected="' + (view === 'add') + '">+ ' + (codes.length ? 'New or join' : 'Get started') + '</button></div>';
      h += view === 'add' ? forms() : board(sel);
      if (err) h += '<div class="msg">' + esc(err) + '</div>';
      h += '<p class="how">Counts the time you actively revise in any TrainTanmay app, plus your Focus sessions. Your devices are added together.</p>';
    }
    var key = (user ? 'u' : 'o') + view + sel;
    box.classList.toggle('anim', key !== animKey); animKey = key;
    box.innerHTML = h;
    Object.keys(keep).forEach(function (id) { var i = box.querySelector('#' + id); if (i && keep[id]) i.value = keep[id]; });
    Object.keys(notes).forEach(function (k) { var m = box.querySelector('#' + k) || box.querySelector('[data-f="' + k + '"] .msg'); if (m && !m.textContent) { m.textContent = notes[k][0]; m.className = notes[k][1]; } });
    if (focusId) { var f = box.querySelector('#' + focusId); if (f) f.focus(); }
    wire();
  }

  function msg(el, t, ok) { if (el) { el.textContent = t; el.className = 'msg' + (ok ? ' ok' : ''); } }
  function wire() {
    var q = function (s) { return box.querySelector(s); };
    q('[data-x]').onclick = close;
    var si = q('[data-signin]'); if (si) si.onclick = function () { ttSave.cloud.signIn(); };
    [].forEach.call(box.querySelectorAll('[data-tab]'), function (b) { b.onclick = function () { sel = b.getAttribute('data-tab'); put(K_SEL, sel); view = ''; editing = null; draw(); }; });
    var add = q('[data-add]'); if (add) add.onclick = function () { view = 'add'; draw(); var i = q('#ttlg-ln'); if (i) i.focus(); };
    var cp = q('[data-copy]'); if (cp) cp.onclick = function () {
      var c = cp.getAttribute('data-copy'), text = 'Join my TrainTanmay study league! Code: ' + c;
      var ok = function () { cp.textContent = 'Copied'; setTimeout(function () { if (cp.isConnected) cp.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { msg(q('#ttlg-msg'), 'Copying is blocked here. The code is ' + c + '.'); }); else msg(q('#ttlg-msg'), 'The code is ' + c + '.');
    };
    var ci = q('#ttlg-c'); if (ci) ci.oninput = function () { var p = ci.selectionStart; ci.value = ci.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); try { ci.setSelectionRange(p, p); } catch (e) {} };
    [].forEach.call(box.querySelectorAll('form[data-f]'), function (f) {
      f.onsubmit = function (e) {
        e.preventDefault();
        var m = f.querySelector('.msg'), btn = f.querySelector('button[type=submit]');
        var nick = tidy(f.nick.value), bad = checkName(nick, 2, 16, 'Your name');
        if (bad) { msg(m, bad); f.nick.focus(); return; }
        var job;
        if (f.getAttribute('data-f') === 'new') {
          var name = tidy(f.lname.value); bad = checkName(name, 3, 24, 'League name');
          if (bad) { msg(m, bad); f.lname.focus(); return; }
          job = create(name, nick);
        } else {
          var code = String(f.code.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) { msg(m, 'Codes are 6 letters and numbers, like K7QX3M.'); f.code.focus(); return; }
          job = join(code, nick);
        }
        btn.disabled = true; msg(m, '');
        job.then(function (code) {
          var a = mine(); if (a.indexOf(code) < 0) a.push(code); setMine(a);
          sel = code; put(K_SEL, code); view = '';
          return refresh();
        }).catch(function (e2) { btn.disabled = false; msg(m, errText(e2)); });
      };
    });
    [].forEach.call(box.querySelectorAll('[data-edit]'), function (b) { b.onclick = function () { editing = b.getAttribute('data-edit'); draw(); var i = q('#ttlg-ed'); if (i) { i.focus(); i.select(); } }; });
    var cn = q('[data-cancel]'); if (cn) cn.onclick = function () { editing = null; draw(); };
    var ed = q('#ttlg-ed'); if (ed) ed.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); q('[data-save]').click(); } if (e.key === 'Escape') { e.stopPropagation(); editing = null; draw(); } };
    var sv = q('[data-save]'); if (sv) sv.onclick = function () {
      var who = sv.getAttribute('data-save'), nick = tidy(q('#ttlg-ed').value), m = q('#ttlg-edmsg');
      var bad = checkName(nick, 2, 16, 'Name'); if (bad) { msg(m, bad); q('#ttlg-ed').focus(); return; }
      sv.disabled = true;
      rename(sel, who, nick).then(function () { editing = null; return refresh(); }, function (e) { sv.disabled = false; msg(m, errText(e)); });
    };
    var ld = q('[data-lead]'); if (ld) ld.onclick = function () {
      var who = ld.getAttribute('data-lead'), nm = (leagues[sel].names || {})[who] || 'them';
      if (!confirm('Make ' + nm + ' the leader? They will be able to edit and remove people, and you won\'t.')) return;
      makeLeader(sel, who).then(function () { editing = null; return refresh(); }, function (e) { msg(q('#ttlg-edmsg'), errText(e)); });
    };
    var lv = q('[data-leave]'); if (lv) lv.onclick = function () {
      var L = leagues[sel]; if (!confirm('Leave "' + L.name + '"? Your minutes disappear from its board. You can join again with the code ' + sel + '.')) return;
      var c = sel;
      remove(c, user.uid).then(function () { setMine(mine().filter(function (x) { return x !== c; })); delete leagues[c]; sel = null; return refresh(); }, function (e) { msg(q('#ttlg-msg'), errText(e)); });
    };
    [].forEach.call(box.querySelectorAll('[data-kick]'), function (b) {
      b.onclick = function () {
        if (!confirm('Remove ' + b.getAttribute('data-who') + ' from this league?')) return;
        remove(sel, b.getAttribute('data-kick')).then(function () { editing = null; return refresh(); }, function (e) { msg(q('#ttlg-edmsg') || q('#ttlg-msg'), errText(e)); });
      };
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!back) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { var f = [].filter.call(box.querySelectorAll('button:not([disabled]),input'), function (x) { return x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-tt-league]'); if (t) { e.preventDefault(); open(); } });

  window.ttLeague = { open: open, close: close, addFocus: function (n) { if (n > 0) { addSeconds(Math.round(n)); if (box && !editing && view !== 'add') drawSoon(); } }, minutes: function () { return Math.floor((local().s || 0) / 60); }, _rude: rude, _checkName: checkName, _week: weekInfo };
})();
