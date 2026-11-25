/* Captures the real TrainTanmay screens for the Focus ad at 1080x1920 (a 360x640 phone at 3x).
   Serves the repo straight from disk, so no web server is needed. Run: node cap.js  (writes shots/*.png) */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(__dirname, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webp': 'image/webp', '.mp4': 'video/mp4' };

function seed(opts) {
  const d = new Date(), iso = x => { const z = new Date(d); z.setDate(z.getDate() + x); return z.getFullYear() + '-' + String(z.getMonth() + 1).padStart(2, '0') + '-' + String(z.getDate()).padStart(2, '0'); };
  const S = (k, v) => localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  sessionStorage.setItem('tt-cloud-nudge', '1');
  if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1');
  S('tt-promo-off', '1'); S('tt-promo-seen', '1');
  S('tt-profile', { subjects: ['dt', 'physics', 'chemistry', 'maths'] });
  S('tt-focus-subjects', { done: true, items: {
    dt: { id: 'dt', name: 'D&T', color: '#1f5fbf', on: true, o: 0 }, physics: { id: 'physics', name: 'Physics', color: '#c81e66', on: true, o: 1 },
    chemistry: { id: 'chemistry', name: 'Chemistry', color: '#c2410c', on: true, o: 2 }, maths: { id: 'maths', name: 'Maths', color: '#1a7f45', on: true, o: 3 },
    esat: { id: 'esat', name: 'ESAT', color: '#d9a300', on: false, o: 4 },
    cbio: { id: 'cbio', name: 'Biology', color: '#17a273', on: true, o: 105 }, cspa: { id: 'cspa', name: 'Spanish', color: '#7a5af5', on: true, o: 106 } } });
  S('tt-focus-todos', { lists: { inbox: { id: 'inbox', name: 'Inbox', color: '#5aa9e6', order: 0 } }, items: {
    a: { id: 'a', list: 'inbox', text: 'Redo Q4 from the 2022 paper', done: false, due: iso(0), pri: 2, subj: 'physics', t: 1 },
    b: { id: 'b', list: 'inbox', text: 'Organic mechanisms flashcards', done: false, due: iso(0), pri: 0, subj: 'chemistry', t: 2 },
    c: { id: 'c', list: 'inbox', text: 'Spanish oral: practise 10 questions', done: false, due: iso(1), pri: 1, subj: 'cspa', t: 3 },
    e: { id: 'e', list: 'inbox', text: 'Integration by parts drill', done: false, due: iso(2), pri: 0, subj: 'maths', t: 4 },
    f: { id: 'f', list: 'inbox', text: 'NEA: finish design iterations', done: false, due: iso(5), pri: 3, subj: 'dt', t: 5 },
    g: { id: 'g', list: 'inbox', text: 'Cell biology summary sheet', done: false, due: null, pri: 0, subj: 'cbio', t: 6 } } });
  const ev = {}, add = (id, title, kind, day, start, end, subj) => ev[id] = { id, title, kind, date: iso(day), start: start || '', end: end || '', subj, t: 1 };
  add('e1', 'Physics mock', 'deadline', 4, '', '', 'physics'); add('e2', 'Chem revision', 'task', 0, '16:00', '17:30', 'chemistry');
  add('e3', 'Maths lesson', 'event', 1, '10:00', '11:00', 'maths'); add('e4', 'Spanish oral', 'deadline', 9, '', '', 'cspa');
  add('e5', 'Bio practical', 'task', 2, '14:00', '15:00', 'cbio'); add('e6', 'NEA check-in', 'event', 6, '09:00', '09:30', 'dt');
  add('e7', 'Maths homework', 'deadline', 3, '', '', 'maths'); add('e8', 'Physics revision', 'task', -2, '17:00', '18:00', 'physics');
  add('e9', 'Chem test', 'deadline', 12, '', '', 'chemistry'); add('e10', 'Bio flashcards', 'task', -5, '18:00', '19:00', 'cbio');
  add('e11', 'Spanish vocab', 'task', 7, '16:00', '16:45', 'cspa'); add('e12', 'D&T exam', 'deadline', 15, '', '', 'dt');
  S('tt-focus-cal', { events: ev });
  const log = {}, subs = ['physics', 'maths', 'chemistry', 'cbio', 'dt', 'cspa'];
  for (let i = 1; i < 26; i++) { const n = 1 + (i * 7) % 3; for (let k = 0; k < n; k++) { const t = new Date(d); t.setDate(t.getDate() - i); t.setHours(16 + k * 2, 10, 0, 0); const id = 'l' + i + k; log[id] = { id, kind: 'session', t: +t, end: +t + 50 * 6e4, studied: 1500 + ((i * 13 + k * 7) % 5) * 600, plan: 2700, label: 'Revision', subj: subs[(i + k) % 6], goal: '', result: 'y', note: '' }; } }
  S('tt-focus-log', log);
  S('tt-focus-goals', { weekly: 900, items: { g1: { id: 'g1', text: 'A* in Physics', due: iso(60), why: '', done: false, t: 1, steps: { s1: { id: 's1', text: 'Finish all 2019-2023 papers', done: true, o: 1 }, s2: { id: 's2', text: 'Redo every wrong answer', done: true, o: 2 }, s3: { id: 's3', text: 'Two full mocks under timed conditions', done: false, o: 3 } } } } });
  S('tt-focus-pos', { hidden: false, mini: false, tasks: false, x: 0.12, y: 0.62 });
  if (opts.prefs) S('tt-focus-prefs', opts.prefs);
  if (opts.run) S('tt-focus-run', opts.run(Date.now()));
}

async function shoot(b, name, url, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: opts.dark ? 'dark' : 'light' });
  await ctx.route('http://tt.test/**', r => {
    let u = new URL(r.request().url()).pathname; if (u.endsWith('/')) u += 'index.html';
    const f = path.join(ROOT, decodeURIComponent(u));
    if (!fs.existsSync(f)) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ status: 200, headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', date: new Date().toUTCString() }, body: r.request().method() === 'HEAD' ? '' : fs.readFileSync(f) });
  });
  await ctx.addInitScript(seed, { prefs: opts.prefs || null, run: null });
  if (opts.run) await ctx.addInitScript(opts.run);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://tt.test/' + url, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(opts.wait || 1800);
  if (opts.act) await opts.act(p);
  await p.waitForTimeout(700);
  await p.screenshot({ path: path.join(OUT, name + '.png') });
  if (errs.length) console.log(name, 'errors', errs);
  console.log('shot', name);
  await ctx.close();
}

/* a session already running: leftSec seconds left of it (for Pomodoro, of the whole plan) */
const RUN = (label, subj, mins, leftSec, pomo) => `(function () {
  if (sessionStorage.getItem('runseeded')) return; sessionStorage.setItem('runseeded', '1');
  var now = Date.now(), seg = ${pomo ? "[{k:'w',d:25*6e4},{k:'b',d:5*6e4},{k:'w',d:25*6e4},{k:'b',d:5*6e4},{k:'w',d:25*6e4}]" : `[{k:'w',d:${mins}*6e4}]`};
  var plan = seg.reduce(function (t, s) { return t + s.d; }, 0);
  localStorage.setItem('tt-focus-run', JSON.stringify({ id: 'r1', t0: now - (plan - ${leftSec} * 1000), seg: seg, paused: 0, pausedAt: null, label: ${JSON.stringify(label)}, subj: ${JSON.stringify(subj)}, goal: 'Finish questions 1-6', todo: null, credited: 0, ended: null, lastSeg: 0, pomo: ${!!pomo} }));
})();`;

(async () => {
  const b = await chromium.launch();
  const only = process.argv.slice(2);
  const jobs = [
    ['home', '', { act: async p => { await p.evaluate(() => document.querySelector('.world[data-go=focus]').scrollIntoView({ block: 'center' })); } }],
    ['setup', 'focus/', {}],
    ['running', 'focus/', { run: RUN('Electric fields paper', 'physics', 45, 18 * 60 + 42) }],
    ['break', 'focus/', { run: RUN('Maths drills', 'maths', 0, 3 * 60 + 12 + 25 * 60 + 25 * 60, true) }],
    ['app-physics', 'physics/', { run: RUN('Electric fields paper', 'physics', 45, 17 * 60 + 5) }],
    ['app-dt', 'dt.html', { run: RUN('Electric fields paper', 'physics', 45, 16 * 60 + 51) }],
    ['app-maths', 'maths/', { run: RUN('Electric fields paper', 'physics', 45, 16 * 60 + 38) }],
    ['app-chem', 'chemistry/', { run: RUN('Electric fields paper', 'physics', 45, 16 * 60 + 20) }],
    ['tasks', 'focus/#tasks', {}],
    ['tasks-done', 'focus/#tasks', { act: async p => { await p.locator('.titem .check').first().check(); await p.waitForTimeout(250); } }],
    ['calendar', 'focus/#calendar', { act: async p => { await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 4); const s = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); const c = document.querySelector('.mcell[data-date="' + s + '"]'); c && c.click(); }); } }],
    ['week', 'focus/#calendar', { prefs: { calView: 'week' } }],
    ['subjects', 'focus/', { act: async p => { await p.click('#btnSettings'); await p.waitForTimeout(300); await p.click('.modal [data-editsubj]'); } }],
    ['settings', 'focus/', { act: async p => { await p.click('#btnSettings'); await p.waitForTimeout(200); await p.evaluate(() => { const h = [...document.querySelectorAll('.modal .sh')][1]; h && h.scrollIntoView({ block: 'start' }); }); } }],
    ['bg-mountains', 'focus/', { prefs: { bg: { k: 'img', v: 'mountains' } } }],
    ['bg-night', 'focus/', { prefs: { bg: { k: 'img', v: 'night' } }, run: RUN('Spanish oral prep', 'cspa', 30, 12 * 60 + 3) }],
    ['bg-aurora', 'focus/#tasks', { prefs: { bg: { k: 'img', v: 'aurora' } } }],
    ['bg-dunes', 'focus/', { prefs: { bg: { k: 'img', v: 'dunes' } }, run: RUN('Organic mechanisms', 'chemistry', 25, 9 * 60 + 47) }],
    ['goals', 'focus/#goals', {}],
    ['progress', 'focus/#progress', {}],
    ['zen', 'focus/', { run: RUN('Electric fields paper', 'physics', 45, 14 * 60 + 9), act: async p => { await p.evaluate(() => document.body.classList.add('zen')); } }],
  ].filter(j => !only.length || only.includes(j[0]));
  for (const [n, u, o] of jobs) await shoot(b, n, u, o);
  await b.close();
})();
