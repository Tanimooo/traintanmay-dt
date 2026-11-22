// Recording-only stand-in for cloud/firebase.js: a signed-in demo user and an in-memory league,
// so the real league.js board can be filmed without touching the real database.
(() => {
  const iso = x => new Date(x).toISOString().slice(0, 10);
  const p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).forEach(x => { p[x.type] = x.value; });
  const day = Date.UTC(+p.year, +p.month - 1, +p.day), wd = (new Date(day).getUTCDay() + 6) % 7;
  const WEEK = iso(day - wd * 864e5), PREV = iso(day - wd * 864e5 - 7 * 864e5);
  const ME = 'u-alex', CODE = 'K7QX3M', CODE2 = 'CHEM42';
  const H = h => Math.round(h * 3600);
  const sc = (s, last) => ({ dev: { d1: { w: WEEK, s, pw: PREV, ps: last || 0 } } });
  const db = {
    ['leagues/' + CODE]: { name: 'Year 13 Squad', owner: 'u-priya', members: ['u-priya', ME, 'u-jamal', 'u-sophie', 'u-ben', 'u-ollie'],
      names: { 'u-priya': 'Priya', [ME]: 'Alex', 'u-jamal': 'Jamal', 'u-sophie': 'Sophie', 'u-ben': 'Ben', 'u-ollie': 'Ollie' }, created: { seconds: 1 } },
    ['leagues/' + CODE + '/scores/u-priya']: sc(H(6.4), H(9.1)),
    ['leagues/' + CODE + '/scores/u-jamal']: sc(H(5.1)),
    ['leagues/' + CODE + '/scores/u-sophie']: sc(H(4.6)),
    ['leagues/' + CODE + '/scores/u-ben']: sc(H(3.2)),
    ['leagues/' + CODE + '/scores/u-ollie']: sc(H(1.9)),
    ['leagues/' + CODE2]: { name: 'Chem Crew', owner: ME, members: [ME, 'u-dev', 'u-ruby'], names: { [ME]: 'Alex', 'u-dev': 'Dev', 'u-ruby': 'Ruby' }, created: { seconds: 2 } },
    ['leagues/' + CODE2 + '/scores/u-dev']: sc(H(2.3)),
    ['leagues/' + CODE2 + '/scores/u-ruby']: sc(H(4.9)),
    ['memberships/' + ME]: { codes: [CODE, CODE2] },
  };
  try {
    localStorage.setItem('tt-league-mine', JSON.stringify([CODE, CODE2]));
    localStorage.setItem('tt-league-sel', CODE);
    localStorage.setItem('tt-league-time', JSON.stringify({ w: WEEK, s: H(window.__ttAlexHours || 5.8), pw: PREV, ps: H(6.2) }));
    localStorage.setItem('tt-cloud-on', '1'); sessionStorage.setItem('tt-cloud-nudge', '1');
  } catch (e) {}
  const clone = x => x == null ? null : JSON.parse(JSON.stringify(x));
  const later = v => new Promise(r => setTimeout(() => r(v), 40));
  const fs = {
    get: path => later(clone(db[path])),
    del: path => { delete db[path]; return later(); },
    set: (path, data, merge) => { db[path] = merge ? Object.assign(db[path] || {}, data) : clone(data); return later(); },
    list: path => later(Object.keys(db).filter(k => k.startsWith(path + '/') && !k.slice(path.length + 1).includes('/')).map(k => ({ id: k.slice(path.length + 1), data: clone(db[k]) }))),
    mine: (path, field, v) => later(Object.keys(db).filter(k => k.startsWith(path + '/') && k.split('/').length === 2 && (db[k][field] || []).includes(v)).map(k => ({ id: k.split('/')[1], data: clone(db[k]) }))),
    tx: async (path, change) => { const n = await change(clone(db[path])); if (n) db[path] = clone(n); return n; },
    txMany: async (paths, change) => { const n = await change(paths.map(x => clone(db[x]))); n.forEach((v, i) => { if (v) db[paths[i]] = clone(v); }); return n; },
    now: () => ({ seconds: Date.now() / 1000 }),
  };
  const user = { uid: ME, name: 'Alex Smith', email: 'alex@example.com', photo: '' };
  window.ttCloudSDK = { init() {}, signIn: () => Promise.resolve(), signOut: () => Promise.resolve(), onUser(cb) { setTimeout(() => cb(user), 0); return () => {}; },
    update: (uid, change) => Promise.resolve(change(null)).then(() => null), fs, uid: () => ME };
  // used by the recording: bump Alex's minutes and redraw
  window.__ttBump = h => { const st = JSON.parse(localStorage.getItem('tt-league-time')); st.s = H(h); localStorage.setItem('tt-league-time', JSON.stringify(st)); };
})();
