/* ============================================================
   TrainTanmay — router, views, question player, analytics.
   ============================================================ */
'use strict';

const LETTERS = 'ABCDEFGH';
const SUBJECTS = ['maths1', 'maths2', 'physics'];
const SUBJ_SHORT = { maths1: 'Maths 1', maths2: 'Maths 2', physics: 'Physics' };
const EXAMS = ['ENGAA', 'NSAA', 'TMUA'];

let META = null;
let QS = [];
let BYID = new Map();
const EXP = {}; // subject -> {qid: markdown}
const view = document.getElementById('view');

/* ---------------- utilities ---------------- */
const esc = (s) =>
  String(s == null ? '' : s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

function clock(ms) {
  const t = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(t / 60);
  const s = t % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
function secs(ms) {
  if (ms == null) return '—';
  return ms < 60000 ? `${(ms / 1000).toFixed(1)}s` : clock(ms);
}
function pct(a, b) {
  return b ? (100 * a) / b : 0;
}
function tone(p) {
  return p >= 75 ? 'ok' : p >= 50 ? 'warn' : 'bad';
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function when(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function renderMD(el, md) {
  if (!md) {
    el.innerHTML = '<p class="muted">No explanation available for this question.</p>';
    return;
  }
  const math = [];
  const stashed = md.replace(/\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+?\$|\\\([\s\S]+?\\\)/g, (m) => {
    math.push(m);
    return `@@MATH${math.length - 1}@@`;
  });
  let html = window.marked ? marked.parse(stashed, { breaks: false }) : `<p>${esc(stashed)}</p>`;
  html = html.replace(/@@MATH(\d+)@@/g, (_, i) => math[+i]);
  el.innerHTML = html;
  if (window.renderMathInElement) {
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      });
    } catch (e) {}
  }
}

/* ---------------- theme ----------------
   Same options as the D&T app: Auto (follows the device), Light, Dark, Salmon,
   plus the OpenDyslexic font toggle. */
function resolvedTheme() {
  const t = Store.settings().theme || 'system';
  if (t === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return t;
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', resolvedTheme());
  const sel = document.getElementById('theme');
  if (sel) sel.value = Store.settings().theme || 'system';
}
function applyDys() {
  const on = !!Store.settings().dys;
  document.documentElement.classList.toggle('dys', on);
  const b = document.getElementById('btnDys');
  if (b) b.setAttribute('aria-pressed', String(on));
}
document.getElementById('theme').addEventListener('change', (e) => {
  Store.setSetting('theme', e.target.value === 'system' ? null : e.target.value);
  applyTheme();
  window.dispatchEvent(new Event('themechange'));
  if (typeof applyDys === "function") applyDys();
});
document.getElementById('btnDys').addEventListener('click', () => {
  Store.setSetting('dys', !Store.settings().dys);
  applyDys();
});
applyDys();

/* ---------------- full screen ----------------
   The browser API names are assembled at runtime rather than written as
   literals, so a sandboxed frame that forbids the feature simply yields
   undefined and the button stays hidden instead of throwing. */
const FullScreen = (() => {
  const F = 'Fullscreen';
  const root = document.documentElement;
  const req =
    root['request' + F] ||
    root['webkitRequest' + F] ||
    root['msRequest' + F] ||
    null;
  const exit =
    document['exit' + F] || document['webkitExit' + F] || document['msExit' + F] || null;
  const supported = !!(req && exit);

  function current() {
    return (
      document[F.toLowerCase() + 'Element'] ||
      document['webkit' + F + 'Element'] ||
      document['ms' + F + 'Element'] ||
      null
    );
  }

  return {
    supported,
    get on() {
      return !!current();
    },
    async toggle() {
      if (!supported) return false;
      try {
        if (current()) await exit.call(document);
        else await req.call(root);
      } catch (e) {
        return false;
      }
      return true;
    },
    onChange(fn) {
      ['', 'webkit', 'moz', 'ms'].forEach((p) =>
        document.addEventListener(p + F.toLowerCase() + 'change', fn)
      );
    },
  };
})();

const fsBtn = document.getElementById('fullscreen');
if (fsBtn && FullScreen.supported) {
  fsBtn.hidden = false;
  const paintFS = () => {
    const on = FullScreen.on;
    document.body.classList.toggle('is-fullscreen', on);
    fsBtn.setAttribute('aria-pressed', String(on));
    fsBtn.setAttribute('aria-label', on ? 'Leave full screen' : 'Enter full screen');
    fsBtn.title = on ? 'Leave full screen (Esc)' : 'Full screen (Shift + F)';
    const icon = document.getElementById('fs-icon');
    if (icon) {
      icon.setAttribute(
        'd',
        on
          ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'
          : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'
      );
    }
  };
  fsBtn.addEventListener('click', () => FullScreen.toggle());
  FullScreen.onChange(paintFS);
  paintFS();
  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'F' || e.key === 'f')) {
      e.preventDefault();
      FullScreen.toggle();
    }
  });
}

/* ---------------- repeated questions ----------------
   ENGAA and NSAA reused some questions in the same year. Only the ENGAA copy is kept;
   META.aliases maps each removed NSAA id to it, so older history and backups still
   point at a real question. */
function migrateIds() {
  const AL = (META && META.aliases) || {};
  if (!Object.keys(AL).length) return;
  const st = Store.state;
  let changed = false;
  const fix = (id) => {
    if (AL[id]) {
      changed = true;
      return AL[id];
    }
    return id;
  };
  (st.attempts || []).forEach((a) => (a.qid = fix(a.qid)));
  const fixSet = (s) => {
    if (!s || !Array.isArray(s.order)) return;
    if (!s.order.some((q) => AL[q])) return;
    const here = typeof s.cursor === 'number' ? fix(s.order[s.cursor]) : null;
    const order = [];
    const answers = {};
    s.order.forEach((q) => {
      const n = fix(q);
      const a = (s.answers && s.answers[q]) || { chosen: null, ms: 0, flagged: false, revealed: false };
      if (answers[n]) {
        // both copies were in the same set: keep the answered one
        if (!answers[n].chosen && a.chosen) answers[n] = a;
        return;
      }
      order.push(n);
      answers[n] = a;
    });
    s.order = order;
    if (s.answers) s.answers = answers;
    if (here !== null) s.cursor = Math.max(0, order.indexOf(here));
  };
  (st.sessions || []).forEach(fixSet);
  fixSet(st.active);
  if (changed) Store.flushActive();
}

/* ---------------- pool + analytics ---------------- */
function pool() {
  return QS.filter((q) => q.onSpec);
}
const tkey = (q) => q.subject + '|' + q.topic;

function analyse() {
  const A = Store.state.attempts;
  const byQid = new Map();
  const byTopic = new Map();
  const byGroup = new Map();
  const byCode = new Map();
  const bySubject = new Map();
  const bump = (map, k, a) => {
    let o = map.get(k);
    if (!o) map.set(k, (o = { n: 0, correct: 0, ms: 0 }));
    o.n++;
    o.ms += a.ms || 0;
    if (a.correct) o.correct++;
  };
  A.forEach((a) => {
    const list = byQid.get(a.qid) || [];
    list.push(a);
    byQid.set(a.qid, list);
    bump(byTopic, a.subject + '|' + a.topic, a);
    bump(byGroup, a.subject + '|' + a.group, a);
    bump(bySubject, a.subject, a);
    (a.codes || []).forEach((c) => bump(byCode, a.subject + '|' + c, a));
  });
  const total = { n: A.length, correct: A.filter((a) => a.correct).length, ms: A.reduce((s, a) => s + (a.ms || 0), 0) };
  return { byQid, byTopic, byGroup, byCode, bySubject, total };
}

/** Streak of consecutive days with at least one answered question. */
function streak() {
  const days = new Set(Store.state.attempts.map((a) => new Date(a.ts).toDateString()));
  let n = 0;
  const d = new Date();
  for (;;) {
    if (days.has(d.toDateString())) {
      n++;
      d.setDate(d.getDate() - 1);
    } else if (n === 0 && days.size) {
      // allow today to be empty and still count yesterday's streak
      d.setDate(d.getDate() - 1);
      if (!days.has(d.toDateString())) return 0;
    } else return n;
  }
}

/* ---------------- question selection ---------------- */
function selectQuestions(cfg) {
  if (cfg.fixed && cfg.fixed.length) return cfg.fixed.filter((id) => BYID.has(id));
  const st = analyse();
  let cand = pool().filter((q) => cfg.subjects.includes(q.subject));
  if (cfg.exams && cfg.exams.length) cand = cand.filter((q) => cfg.exams.includes(q.exam));
  if (cfg.topics && cfg.topics.length) cand = cand.filter((q) => cfg.topics.includes(tkey(q)));
  if (cfg.groups && cfg.groups.length)
    cand = cand.filter((q) => cfg.groups.includes(q.subject + '|' + q.group));
  if (cfg.difficulty && cfg.difficulty.length) cand = cand.filter((q) => cfg.difficulty.includes(q.difficulty));

  const last = (qid) => {
    const l = st.byQid.get(qid);
    return l ? l[l.length - 1] : null;
  };
  if (cfg.mode === 'unseen') cand = cand.filter((q) => !st.byQid.has(q.id));
  if (cfg.mode === 'incorrect') cand = cand.filter((q) => last(q.id) && !last(q.id).correct);

  if (cfg.mode === 'weak') {
    const scored = cand.map((q) => {
      const t = st.byTopic.get(tkey(q));
      const acc = t && t.n ? t.correct / t.n : null;
      let s = acc === null ? 0.45 : 1 - acc;
      const l = last(q.id);
      if (l && !l.correct) s += 0.55;
      else if (!l) s += 0.18;
      else s -= 0.3;
      const g = st.byGroup.get(q.subject + '|' + q.group);
      if (g && g.n >= 3) s += (1 - g.correct / g.n) * 0.4;
      return { q, s: s + Math.random() * 0.22 };
    });
    scored.sort((a, b) => b.s - a.s);
    return shuffle(scored.slice(0, cfg.count).map((x) => x.q)).map((q) => q.id);
  }

  // random / topic / paper: prefer unseen first so coverage grows, then the rest
  const unseen = shuffle(cand.filter((q) => !st.byQid.has(q.id)));
  const seen = shuffle(cand.filter((q) => st.byQid.has(q.id)));
  return unseen.concat(seen).slice(0, cfg.count).map((q) => q.id);
}

/* ---------------- session lifecycle ---------------- */
function startSession(cfg) {
  const order = selectQuestions(cfg);
  if (!order.length) {
    alert('No questions match those filters. Try widening the subjects, sources or mode.');
    return;
  }
  const count = order.length;
  const s = {
    id: uid(),
    title: cfg.title || 'Practice set',
    mode: cfg.mode,
    cfg,
    order,
    answers: {},
    cursor: 0,
    reveal: cfg.reveal, // 'instant' | 'end'
    timed: !!cfg.timed,
    limitMs: cfg.timed ? cfg.limitMin * 60000 : 0,
    pausable: !!(cfg.timed && cfg.pausable),
    startedAt: Date.now(),
    finishedAt: null,
    elapsedMs: 0,
  };
  order.forEach((q) => (s.answers[q] = { chosen: null, ms: 0, flagged: false, revealed: false }));
  Store.setActive(s);
  location.hash = '#/run';
  if (count < cfg.count)
    setTimeout(
      () => Toast(`Only ${count} question${count === 1 ? '' : 's'} matched — the set is shorter than requested.`),
      400
    );
}

function finishSession() {
  const s = Store.state.active;
  if (!s) return;
  Player.stop();
  s.finishedAt = Date.now();
  s.elapsedMs = s.order.reduce((t, q) => t + s.answers[q].ms, 0);
  const attempts = [];
  s.order.forEach((qid) => {
    const a = s.answers[qid];
    if (!a.chosen) return; // skipped questions are not scored attempts
    const q = BYID.get(qid);
    attempts.push({
      qid,
      subject: q.subject,
      group: q.group,
      topic: q.topic,
      codes: q.codes,
      chosen: a.chosen,
      correct: a.chosen === q.answer,
      ms: a.ms,
      ts: Date.now(),
      session: s.id,
    });
  });
  Store.addAttempts(attempts);
  Store.addSession(s);
  Store.setActive(null);
  location.hash = '#/results/' + s.id;
}

function scoreOf(s) {
  let right = 0,
    answered = 0;
  s.order.forEach((qid) => {
    const a = s.answers[qid];
    if (a.chosen) {
      answered++;
      if (a.chosen === BYID.get(qid).answer) right++;
    }
  });
  return { right, answered, total: s.order.length, pct: pct(right, s.order.length) };
}

/* ---------------- toast ---------------- */
function Toast(msg) {
  const d = document.createElement('div');
  d.textContent = msg;
  d.style.cssText =
    'position:fixed;left:50%;top:88px;transform:translateX(-50%);z-index:200;' +
    'background:var(--color-text);color:var(--color-bg);padding:10px 18px;border-radius:9999px;' +
    'font-size:var(--text-sm);font-weight:600;box-shadow:var(--shadow-lg);max-width:90vw;text-align:center';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3600);
}

/* ============================================================
   VIEWS
   ============================================================ */

function storageBanner() {
  if (!Store.memoryOnly) return '';
  return `<div class="banner"><span>⚠</span><span><strong>Preview mode:</strong> this frame blocks
    browser storage, so your progress will vanish on reload. Open the published link
    in a normal tab and everything is saved automatically.</span></div>`;
}

let heroStop = null;
function viewOverview() {
  const st = analyse();
  const P = pool();
  const attempted = new Set(Store.state.attempts.map((a) => a.qid)).size;
  const acc = pct(st.total.correct, st.total.n);
  const sessions = Store.state.sessions;
  const active = Store.state.active;
  const sk = streak();

  const weak = [...st.byTopic.entries()]
    .filter(([, v]) => v.n >= 2)
    .map(([k, v]) => ({ k, ...v, a: pct(v.correct, v.n) }))
    .sort((a, b) => a.a - b.a || b.n - a.n)
    .slice(0, 5);

  const subjRows = SUBJECTS.map((s) => {
    const v = st.bySubject.get(s) || { n: 0, correct: 0, ms: 0 };
    const a = pct(v.correct, v.n);
    return {
      label: SUBJ_SHORT[s],
      value: v.n ? a : 0,
      sub: v.n ? `${v.correct}/${v.n}` : 'no attempts',
      tone: v.n ? tone(a) : '',
    };
  });

  view.innerHTML = `
    ${storageBanner()}
    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow">ESAT · Maths 1 · Maths 2 · Physics</span>
        <h1 id="pun" class="pun" aria-live="polite"></h1>
        <p>${P.length} real ENGAA, NSAA and TMUA questions from ${META.papers.length} past papers, sorted
        into the current ESAT topics. Drill a topic, sit a timed 27-in-40 test, or sharpen your
        mental maths.</p>
        <div class="row">
          <a class="btn btn-primary" href="#/build">Start a test</a>
          <a class="btn" href="#/topics">Practise a topic</a>
          <a class="btn btn-ghost" href="#/mental">Mental maths →</a>
        </div>
      </div>
      <div class="hero-play" id="hero-play">
        <div class="hero-hint"><span class="hl">Aim with your mouse · click to launch · hit the flag</span><span class="hs">Tap to aim and launch · hit the flag</span></div>
        <div class="hero-readout" aria-live="off"></div>
        <div class="titleblock"><span>PAPER</span><span>TrainTanmay</span><span>SPEC</span><span>ESAT</span></div>
      </div>
    </section>

    ${
      active
        ? `<div class="card" style="border-color:var(--color-primary);margin-bottom:var(--space-6)">
        <div class="row" style="justify-content:space-between">
          <div>
            <h2>Unfinished ${esc(active.title)}</h2>
            <p class="muted" style="margin:var(--space-1) 0 0;font-size:var(--text-sm)">
              ${Object.values(active.answers).filter((a) => a.chosen).length} of ${active.order.length}
              answered · started ${when(active.startedAt)}</p>
          </div>
          <div class="row">
            <button class="btn btn-ghost" id="drop-active">Discard</button>
            <a class="btn btn-primary" href="#/run">Resume</a>
          </div>
        </div>
      </div>`
        : ''
    }

    <div class="grid cols-4">
      <div class="stat"><div class="k">Accuracy</div>
        <div class="v">${st.total.n ? Math.round(acc) + '%' : '—'}</div>
        <div class="s">${st.total.correct} correct of ${st.total.n} answered</div></div>
      <div class="stat"><div class="k">Coverage</div>
        <div class="v">${Math.round(pct(attempted, P.length))}%</div>
        <div class="s">${attempted} of ${P.length} questions seen</div></div>
      <div class="stat"><div class="k">Median pace</div>
        <div class="v">${medianPace(st)}</div>
        <div class="s">per question answered</div></div>
      <div class="stat"><div class="k">Day streak</div>
        <div class="v">${sk}</div>
        <div class="s">${sessions.length} test${sessions.length === 1 ? '' : 's'} completed</div></div>
    </div>

    <div class="grid cols-2" style="margin-top:var(--space-6)">
      <div class="card">
        <h2 style="margin-bottom:var(--space-5)">By subject</h2>
        ${Chart.hbars(subjRows)}
      </div>
      <div class="card">
        <h2 style="margin-bottom:var(--space-5)">Weakest topics</h2>
        ${
          weak.length
            ? Chart.hbars(
                weak.map((w) => ({
                  label: w.k.split('|')[1],
                  value: w.a,
                  sub: `${w.correct}/${w.n} · ${secs(w.ms / w.n)}`,
                  tone: tone(w.a),
                }))
              ) +
              `<div class="row" style="margin-top:var(--space-5)">
                 <button class="btn btn-sm" id="weak-now">Drill these now</button></div>`
            : `<div class="empty" style="padding:var(--space-10)">Answer at least two questions in a
                 topic and it will show up here.</div>`
        }
      </div>
    </div>

    <div class="card" style="margin-top:var(--space-6)">
      <div class="row" style="justify-content:space-between;margin-bottom:var(--space-5)">
        <h2>Accuracy over time</h2>
        <a href="#/stats" class="btn btn-sm btn-ghost">Full analytics →</a>
      </div>
      ${Chart.trend(
        sessions.slice(-14).map((s) => ({ label: s.title + ' · ' + when(s.startedAt), value: scoreOf(s).pct }))
      )}
    </div>

    <div class="grid cols-3" style="margin-top:var(--space-6)">
      ${quickCard('Full mock — Maths 1', '27 questions, 40 minutes, exam conditions.', 'mock-m1')}
      ${quickCard('Full mock — Maths 2', '27 questions, 40 minutes, exam conditions.', 'mock-m2')}
      ${quickCard('Full mock — Physics', '27 questions, 40 minutes, exam conditions.', 'mock-ph')}
    </div>`;

  heroStop = Hero.mount(view);
  const drop = document.getElementById('drop-active');
  if (drop)
    drop.onclick = () => {
      if (confirm('Discard the unfinished set? Its answers will not be saved.')) {
        Store.setActive(null);
        render();
      }
    };
  const wn = document.getElementById('weak-now');
  if (wn)
    wn.onclick = () =>
      startSession({
        title: 'Weak-point drill',
        mode: 'weak',
        subjects: SUBJECTS,
        count: 12,
        reveal: 'instant',
        timed: false,
      });
  [['mock-m1', 'maths1'], ['mock-m2', 'maths2'], ['mock-ph', 'physics']].forEach(([id, s]) => {
    const b = document.getElementById(id);
    if (b)
      b.onclick = () =>
        startSession({
          title: 'Mock — ' + SUBJ_SHORT[s],
          mode: 'random',
          subjects: [s],
          count: 27,
          reveal: 'end',
          timed: true,
          limitMin: 40,
        });
  });
}
function quickCard(title, sub, id) {
  return `<button class="card" id="${id}" style="text-align:left;cursor:pointer">
    <h3>${esc(title)}</h3>
    <p class="muted" style="margin:var(--space-2) 0 0;font-size:var(--text-sm)">${esc(sub)}</p>
  </button>`;
}
function medianPace(st) {
  const ms = Store.state.attempts.map((a) => a.ms).filter((x) => x > 0).sort((a, b) => a - b);
  if (!ms.length) return '—';
  const m = ms[Math.floor(ms.length / 2)];
  return `${(m / 1000).toFixed(0)}s`;
}

/* ---------------- topics ---------------- */
let topicSubject = 'maths1';
function viewTopics() {
  const st = analyse();
  const P = pool().filter((q) => q.subject === topicSubject);
  const groups = META.groups.filter((g) => g.subject === topicSubject);
  const byGroup = new Map();
  P.forEach((q) => {
    const g = byGroup.get(q.group) || new Map();
    const list = g.get(q.topic) || [];
    list.push(q);
    g.set(q.topic, list);
    byGroup.set(q.group, g);
  });

  const blocks = groups
    .filter((g) => byGroup.has(g.name))
    .map((g) => {
      const topics = [...byGroup.get(g.name).entries()].sort((a, b) => b[1].length - a[1].length);
      const gs = st.byGroup.get(topicSubject + '|' + g.name);
      const ga = gs ? pct(gs.correct, gs.n) : null;
      const rows = topics
        .map(([t, list]) => {
          const v = st.byTopic.get(topicSubject + '|' + t);
          const a = v ? pct(v.correct, v.n) : null;
          const seen = list.filter((q) => st.byQid.has(q.id)).length;
          return `<button class="trow" data-topic="${esc(t)}">
        <span class="t"><strong>${esc(t)}</strong>
          <span>${list.length} question${list.length === 1 ? '' : 's'} · ${list
            .map((q) => q.codes[0])
            .filter((c, i, arr) => c && arr.indexOf(c) === i)
            .slice(0, 4)
            .join(', ')}</span></span>
        <span class="num">${seen}/${list.length}</span>
        <span class="hide-sm">${
          a === null
            ? '<span class="faint" style="font-size:var(--text-xs)">not attempted</span>'
            : `<span class="meter ${tone(a)}" style="display:block"><span style="width:${a.toFixed(0)}%"></span></span>`
        }</span>
        <span class="num">${a === null ? '—' : Math.round(a) + '%'}</span>
        <span class="num hide-sm">${v ? secs(v.ms / v.n) : '—'}</span>
      </button>`;
        })
        .join('');
      return `<div>
        <div class="group-head">
          <span class="code">${g.code}</span><h2>${esc(g.name)}</h2>
          <span class="muted" style="font-size:var(--text-xs)">${
            ga === null ? 'no attempts yet' : Math.round(ga) + '% across ' + gs.n + ' attempts'
          }</span>
          <button class="btn btn-sm btn-ghost" data-group="${esc(g.name)}" style="margin-left:auto">Practise group</button>
        </div>
        <div class="tlist">
          <div class="trow head"><span>Topic</span><span style="text-align:right">Seen</span>
            <span class="hide-sm">Accuracy</span><span style="text-align:right">%</span>
            <span class="hide-sm" style="text-align:right">Avg time</span></div>
          ${rows}
        </div>
      </div>`;
    })
    .join('');

  view.innerHTML = `
    ${storageBanner()}
    <div class="page-head">
      <div><h1>Topics</h1>
        <p>Every question is tagged with its official specification code and a plain-English topic.
        Click a topic to drill it — answers and explanations appear as you go.</p></div>
      <div class="sub-tabs" id="subtabs">
        ${SUBJECTS.map(
          (s) =>
            `<button data-s="${s}" aria-pressed="${s === topicSubject}">${SUBJ_SHORT[s]}
              <span class="faint" style="font-weight:500"> ${pool().filter((q) => q.subject === s).length}</span></button>`
        ).join('')}
      </div>
    </div>
    ${blocks || '<div class="empty">No questions in this subject.</div>'}`;

  document.getElementById('subtabs').onclick = (e) => {
    const b = e.target.closest('button[data-s]');
    if (!b) return;
    topicSubject = b.dataset.s;
    render();
  };
  view.querySelectorAll('.trow[data-topic]').forEach((b) => {
    b.onclick = () => {
      const t = b.dataset.topic;
      startSession({
        title: t,
        mode: 'topic',
        subjects: [topicSubject],
        topics: [topicSubject + '|' + t],
        count: 99,
        reveal: 'instant',
        timed: false,
      });
    };
  });
  view.querySelectorAll('button[data-group]').forEach((b) => {
    b.onclick = () =>
      startSession({
        title: b.dataset.group,
        mode: 'topic',
        subjects: [topicSubject],
        groups: [topicSubject + '|' + b.dataset.group],
        count: 20,
        reveal: 'instant',
        timed: false,
      });
  });
}

/* ---------------- test builder ---------------- */
const builder = {
  subjects: ['maths1'],
  exams: [...EXAMS],
  mode: 'random',
  count: 20,
  timed: false,
  limitMin: 30,
  pausable: false,
  reveal: 'end',
};
function viewBuild() {
  const st = analyse();
  const avail = (cfg) => {
    let c = pool().filter((q) => cfg.subjects.includes(q.subject) && cfg.exams.includes(q.exam));
    if (cfg.mode === 'unseen') c = c.filter((q) => !st.byQid.has(q.id));
    if (cfg.mode === 'incorrect')
      c = c.filter((q) => {
        const l = st.byQid.get(q.id);
        return l && !l[l.length - 1].correct;
      });
    return c.length;
  };
  const n = avail(builder);

  view.innerHTML = `
    ${storageBanner()}
    <div class="page-head"><div><h1>New test</h1>
      <p>Build a set from any mix of subjects and source papers. Timed sets mirror the real thing:
      27 questions in 40 minutes per paper.</p></div></div>

    <div class="grid cols-2" style="align-items:start">
      <div class="grid" style="gap:var(--space-5)">
        <div class="card">
          <label class="field">Subjects</label>
          <div class="chips" id="b-subj">
            ${SUBJECTS.map(
              (s) =>
                `<button class="chip" data-v="${s}" aria-pressed="${builder.subjects.includes(s)}">${SUBJ_SHORT[s]}</button>`
            ).join('')}
          </div>
          <label class="field" style="margin-top:var(--space-5)">Source papers</label>
          <div class="chips" id="b-exam">
            ${EXAMS.map(
              (e) =>
                `<button class="chip" data-v="${e}" aria-pressed="${builder.exams.includes(e)}">${e}</button>`
            ).join('')}
          </div>
          <p class="muted" style="font-size:var(--text-xs);margin:var(--space-3) 0 0">
            Tap the subjects you want to practise, then the past papers to pull questions from.
            Pick more than one to mix them together.</p>
        </div>

        <div class="card">
          <label class="field">Question selection</label>
          <div class="chips" id="b-mode">
            ${[
              ['random', 'Randomised'],
              ['weak', 'Weak points'],
              ['unseen', 'Not yet seen'],
              ['incorrect', 'Got wrong before'],
            ]
              .map(
                ([v, l]) =>
                  `<button class="chip" data-v="${v}" aria-pressed="${builder.mode === v}">${l}</button>`
              )
              .join('')}
          </div>
          <p class="muted" style="font-size:var(--text-xs);margin:var(--space-3) 0 0" id="b-modehelp"></p>
        </div>
      </div>

      <div class="grid" style="gap:var(--space-5)">
        <div class="card">
          <label class="field" for="b-count">Length — <span class="mono" id="b-countv">${builder.count}</span> questions</label>
          <input type="range" id="b-count" min="5" max="60" step="1" value="${builder.count}" />
          <div class="chips" style="margin-top:var(--space-3)" id="b-quick">
            ${[10, 20, 27, 40].map((v) => `<button class="chip" data-v="${v}">${v}</button>`).join('')}
          </div>
          <p class="muted" style="font-size:var(--text-xs);margin:var(--space-4) 0 0" id="b-avail">
            ${n} question${n === 1 ? '' : 's'} available with these filters.</p>
        </div>

        <div class="card">
          <label class="switch" style="margin-bottom:var(--space-4)">
            <input type="checkbox" id="b-timed" ${builder.timed ? 'checked' : ''} />
            <span>Timed — countdown with auto-submit</span></label>
          <div id="b-limitwrap" style="${builder.timed ? '' : 'display:none'}">
            <label class="field" for="b-limit">Time limit (minutes)</label>
            <input type="number" id="b-limit" min="1" max="180" value="${builder.limitMin}" />
            <label class="switch" style="margin-top:var(--space-4)">
              <input type="checkbox" id="b-pause" ${builder.pausable ? 'checked' : ''} />
              <span>Allow pausing — adds a pause button that stops the clock during the test</span></label>
            <p class="muted" style="font-size:var(--text-xs);margin:var(--space-2) 0 0">
              Best left off: without it you complete the set in one go, under realistic exam conditions.</p>
          </div>
          <label class="field" style="margin-top:var(--space-5)">Show answers</label>
          <div class="chips" id="b-reveal">
            ${[
              ['instant', 'After each question'],
              ['end', 'At the end only'],
            ]
              .map(
                ([v, l]) =>
                  `<button class="chip" data-v="${v}" aria-pressed="${builder.reveal === v}">${l}</button>`
              )
              .join('')}
          </div>
          <p class="muted" style="font-size:var(--text-xs);margin:var(--space-3) 0 0">
            A stopwatch sits in the corner either way, and the time you spend on every single
            question is recorded.</p>
        </div>

        <button class="btn btn-primary" id="b-go" style="padding:var(--space-4)">Start test</button>
      </div>
    </div>`;

  const HELP = {
    random: 'Unseen questions come first so your coverage keeps growing.',
    weak: 'Prioritises topics where your accuracy is lowest, plus questions you got wrong before.',
    unseen: 'Only questions you have never answered.',
    incorrect: 'Only questions whose most recent attempt was wrong.',
  };
  const refresh = () => {
    const c = avail(builder);
    document.getElementById('b-avail').textContent =
      `${c} question${c === 1 ? '' : 's'} available with these filters.`;
    document.getElementById('b-modehelp').textContent = HELP[builder.mode];
    document.getElementById('b-go').disabled = c === 0 || !builder.subjects.length;
  };
  const chipGroup = (id, apply) => {
    document.getElementById(id).onclick = (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      apply(b.dataset.v, b);
      viewBuild();
    };
  };
  chipGroup('b-subj', (v) => {
    const i = builder.subjects.indexOf(v);
    if (i < 0) builder.subjects.push(v);
    else if (builder.subjects.length > 1) builder.subjects.splice(i, 1);
  });
  chipGroup('b-exam', (v) => {
    const i = builder.exams.indexOf(v);
    if (i < 0) builder.exams.push(v);
    else if (builder.exams.length > 1) builder.exams.splice(i, 1);
  });
  chipGroup('b-mode', (v) => (builder.mode = v));
  chipGroup('b-reveal', (v) => (builder.reveal = v));
  document.getElementById('b-quick').onclick = (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    builder.count = +b.dataset.v;
    if (builder.timed) builder.limitMin = Math.max(1, Math.round(builder.count * 1.48));
    viewBuild();
  };
  const range = document.getElementById('b-count');
  range.oninput = () => {
    builder.count = +range.value;
    document.getElementById('b-countv').textContent = builder.count;
    if (builder.timed) {
      builder.limitMin = Math.max(1, Math.round(builder.count * 1.48));
      document.getElementById('b-limit').value = builder.limitMin;
    }
  };
  document.getElementById('b-timed').onchange = (e) => {
    builder.timed = e.target.checked;
    if (builder.timed) builder.limitMin = Math.max(1, Math.round(builder.count * 1.48));
    viewBuild();
  };
  const pz = document.getElementById('b-pause');
  if (pz) pz.onchange = (e) => (builder.pausable = e.target.checked);
  const lim = document.getElementById('b-limit');
  if (lim) lim.onchange = () => (builder.limitMin = Math.max(1, +lim.value || 1));
  document.getElementById('b-go').onclick = () =>
    startSession({
      title:
        builder.mode === 'weak'
          ? 'Weak-point set'
          : builder.subjects.length === 1
            ? SUBJ_SHORT[builder.subjects[0]] + ' set'
            : 'Mixed set',
      ...builder,
      subjects: [...builder.subjects],
      exams: [...builder.exams],
    });
  refresh();
}

/* ============================================================
   PLAYER
   ============================================================ */
const Player = (() => {
  let tick = null,
    qStart = 0,
    paused = false,
    userPaused = false,
    live = false;

  function activeQ() {
    const s = Store.state.active;
    return BYID.get(s.order[s.cursor]);
  }
  function commit() {
    const s = Store.state.active;
    if (!s || paused || !live) return;
    const now = performance.now();
    const a = s.answers[s.order[s.cursor]];
    a.ms += Math.max(0, now - qStart);
    qStart = now;
    Store.flushActive();
  }
  function totalMs() {
    const s = Store.state.active;
    return s.order.reduce((t, q) => t + s.answers[q].ms, 0);
  }
  function stop() {
    clearInterval(tick);
    tick = null;
    live = false;
    document.getElementById('clock-slot').innerHTML = '';
    document.body.classList.remove('has-clock');
  }
  /* Amber while you decide whether to attempt the question, blue once you have
     committed to it, red past the ESAT pace. Purely a glance signal — it never
     interrupts and never submits anything. */
  const DECIDE_MS = 10000;
  const PACE_MS = 88800;
  function paintPaceDot(qms) {
    const dot = document.getElementById('pace-dot');
    if (!dot) return;
    const stage = qms < DECIDE_MS ? 'decide' : qms < PACE_MS ? 'work' : 'over';
    if (dot.dataset.stage !== stage) {
      dot.dataset.stage = stage;
      dot.title =
        stage === 'decide'
          ? 'Decide whether to attempt this one — first 10 seconds'
          : stage === 'work'
            ? 'Working — inside the 1:29 pace'
            : 'Over the 1:29 pace — consider moving on and coming back';
    }
  }

  function paint() {
    const s = Store.state.active;
    if (!s) return;
    const slot = document.getElementById('clock-slot');
    const mode = Store.settings().clock;
    const run = paused || !live ? 0 : performance.now() - qStart;
    const elapsed = totalMs() + run;
    const qms = s.answers[s.order[s.cursor]].ms + run;
    const left = s.timed ? s.limitMs - elapsed : 0;
    if (s.timed && left <= 0) {
      Toast('Time is up — the test was submitted automatically.');
      finishSession();
      return;
    }
    const main = s.timed ? clock(left) : clock(elapsed);
    const label = s.timed ? 'remaining' : 'elapsed';
    slot.innerHTML = `<div class="clock ${mode === 'off' ? 'hidden' : ''} ${
      s.timed && left < 60000 ? 'alert' : ''
    }" id="clockw" role="timer" title="Click to change what the clock shows">
        ${
          mode === 'off'
            ? '<span class="lbl">clock hidden</span>'
            : mode === 'question'
              ? `<div><div class="lbl">this question</div><div class="t mono">${clock(qms)}</div></div>`
              : `<div><div class="lbl">${label}</div><div class="t mono">${main}</div></div>
                 <div class="split"><div class="lbl">question</div><div class="t mono" style="font-size:1rem">${clock(qms)}</div></div>`
        }
      </div>`;
    document.body.classList.toggle('has-clock', mode !== 'off');
    paintPaceDot(qms);
    document.getElementById('clockw').onclick = () => {
      const order = ['total', 'question', 'off'];
      Store.setSetting('clock', order[(order.indexOf(mode) + 1) % 3]);
      paint();
    };
  }

  function pause() {
    if (userPaused) return;
    commit();
    paused = userPaused = true;
    draw();
  }
  function resume() {
    if (!userPaused) return;
    paused = userPaused = false;
    qStart = performance.now();
    draw();
  }

  function start() {
    stop();
    qStart = performance.now();
    paused = userPaused = false;
    live = true;
    tick = setInterval(paint, 250);
    paint();
  }

  function goto(i) {
    const s = Store.state.active;
    commit();
    s.cursor = Math.max(0, Math.min(s.order.length - 1, i));
    qStart = performance.now();
    Store.flushActive();
    draw();
  }

  function choose(letter) {
    const s = Store.state.active;
    const q = activeQ();
    const a = s.answers[q.id];
    if (s.reveal === 'instant' && a.revealed) return;
    commit();
    a.chosen = letter;
    if (s.reveal === 'instant') a.revealed = true;
    Store.flushActive();
    draw();
  }

  function draw() {
    const s = Store.state.active;
    if (!s) {
      location.hash = '#/';
      return;
    }
    const q = activeQ();
    const a = s.answers[q.id];
    const revealed = s.reveal === 'instant' && a.revealed;
    const answered = s.order.filter((x) => s.answers[x].chosen).length;

    if (userPaused) {
      view.innerHTML = `
      <div class="page-head" style="margin-bottom:var(--space-5)">
        <div><h1>${esc(s.title)}</h1>
          <p>Paused · ${answered} of ${s.order.length} answered</p></div>
      </div>
      <div class="card" style="max-width:520px;margin:var(--space-8) auto;text-align:center">
        <h2 style="margin-top:0">Test paused</h2>
        <p class="muted">The clock has stopped and the question is hidden until you resume.</p>
        <button class="btn btn-primary" id="p-resume">Resume test</button>
      </div>`;
      document.getElementById('p-resume').onclick = resume;
      paint();
      return;
    }

    view.innerHTML = `
      <div class="page-head" style="margin-bottom:var(--space-5)">
        <div><h1>${esc(s.title)}</h1>
          <p>Question ${s.cursor + 1} of ${s.order.length} · ${answered} answered${
            s.timed ? ` · ${s.limitMin || Math.round(s.limitMs / 60000)} minute limit` : ' · untimed'
          }</p></div>
        <div class="row">
          ${s.pausable ? '<button class="btn" id="p-pause">Pause</button>' : ''}
          <button class="btn btn-ghost" id="p-quit">Abandon</button>
          <button class="btn btn-primary" id="p-finish">Finish &amp; review</button>
        </div>
      </div>

      <div class="player">
        <div class="qcard">
          <header>
            ${
              Store.settings().paceDot
                ? `<span class="pace-dot" id="pace-dot" role="img" aria-hidden="true"></span>`
                : ''
            }
            <span class="badge badge-primary">${SUBJ_SHORT[q.subject]}</span>
            <span class="badge">${esc(q.topic)}</span>
            ${q.codes.length ? `<span class="badge" title="${esc(META.codes[q.codes[0]] || '')}">${q.codes[0]}</span>` : ''}
            <span class="badge" title="Difficulty ${q.difficulty} of 5">${'●'.repeat(q.difficulty)}${'○'.repeat(5 - q.difficulty)}</span>
            ${q.onSpec ? '' : `<span class="badge badge-warn" title="${esc(q.offSpecReason)}">off-spec</span>`}
            <span class="muted" style="margin-left:auto;font-size:var(--text-xs)">${q.exam} ${q.year} · Q${q.qno}</span>
          </header>
          <div class="qimg"><img data-qimg="${q.img}" alt="Question ${q.qno} from ${q.exam} ${q.year}" loading="eager" /></div>
          <div class="opts" id="p-opts">
            ${LETTERS.slice(0, q.options)
              .split('')
              .map((L) => {
                let cls = 'opt';
                if (revealed) {
                  if (L === q.answer) cls += ' correct';
                  else if (L === a.chosen) cls += ' wrong';
                }
                return `<button class="${cls}" data-l="${L}" aria-pressed="${a.chosen === L}"
                  ${revealed ? 'disabled' : ''}>${L}</button>`;
              })
              .join('')}
          </div>
          ${revealed ? `<div class="explain" id="p-explain"><div class="skel" style="height:80px"></div></div>` : ''}
        </div>

        <aside class="side">
          <div class="card">
            <div class="row" style="justify-content:space-between;margin-bottom:var(--space-3)">
              <span class="field" style="margin:0">Progress</span>
              <span class="mono muted" style="font-size:var(--text-xs)">${answered}/${s.order.length}</span>
            </div>
            <div class="qgrid" id="p-grid">
              ${s.order
                .map((qid, i) => {
                  const x = s.answers[qid];
                  let c = 'qdot';
                  if (i === s.cursor) c += ' current';
                  if (x.chosen) c += s.reveal === 'instant' && x.revealed
                    ? x.chosen === BYID.get(qid).answer
                      ? ' ok'
                      : ' bad'
                    : ' answered';
                  if (x.flagged) c += ' flagged';
                  return `<button class="${c}" data-i="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`;
                })
                .join('')}
            </div>
          </div>
          <div class="card">
            <div class="row" style="gap:var(--space-2)">
              <button class="btn btn-sm" id="p-prev" ${s.cursor === 0 ? 'disabled' : ''}>← Prev</button>
              <button class="btn btn-sm" id="p-next" ${s.cursor === s.order.length - 1 ? 'disabled' : ''}>Next →</button>
              <button class="btn btn-sm ${a.flagged ? 'btn-primary' : ''}" id="p-flag">${a.flagged ? 'Flagged' : 'Flag'}</button>
            </div>
            ${
              s.reveal === 'end'
                ? `<p class="muted" style="font-size:var(--text-xs);margin:var(--space-4) 0 0">
                     Answers and worked solutions unlock when you finish.</p>`
                : `<button class="btn btn-sm btn-ghost" id="p-reveal" style="margin-top:var(--space-3);width:100%"
                     ${revealed ? 'disabled' : ''}>Reveal answer &amp; method</button>`
            }
            <p class="muted" style="font-size:var(--text-xs);margin:var(--space-4) 0 0">
              Keys: <span class="mono">A–H</span> answer · <span class="mono">←/→</span> move ·
              <span class="mono">M</span> flag · <span class="mono">Shift+F</span> full screen</p>
          </div>
        </aside>
      </div>`;

    document.getElementById('p-opts').onclick = (e) => {
      const b = e.target.closest('.opt');
      if (b && !b.disabled) choose(b.dataset.l);
    };
    document.getElementById('p-grid').onclick = (e) => {
      const b = e.target.closest('.qdot');
      if (b) goto(+b.dataset.i);
    };
    document.getElementById('p-prev').onclick = () => goto(s.cursor - 1);
    document.getElementById('p-next').onclick = () => goto(s.cursor + 1);
    document.getElementById('p-flag').onclick = () => {
      a.flagged = !a.flagged;
      Store.flushActive();
      draw();
    };
    const rev = document.getElementById('p-reveal');
    if (rev)
      rev.onclick = () => {
        a.revealed = true;
        Store.flushActive();
        draw();
      };
    document.getElementById('p-finish').onclick = () => {
      const un = s.order.length - answered;
      if (un && !confirm(`${un} question${un === 1 ? ' is' : 's are'} unanswered. Finish anyway?`)) return;
      finishSession();
    };
    const pb = document.getElementById('p-pause');
    if (pb) pb.onclick = pause;
    document.getElementById('p-quit').onclick = () => {
      if (!confirm('Abandon this set? Nothing will be saved.')) return;
      Player.stop();
      Store.setActive(null);
      location.hash = '#/';
    };

    if (revealed) {
      loadExp(q.subject).then((map) => {
        const el = document.getElementById('p-explain');
        if (!el) return;
        el.innerHTML = `<div class="row" style="margin-bottom:var(--space-4)">
            <span class="badge ${a.chosen === q.answer ? 'badge-ok' : 'badge-bad'}">
              ${a.chosen === q.answer ? '✓ Correct' : `✗ You chose ${esc(a.chosen)}`}</span>
            <span class="badge">Answer ${esc(q.answer)}</span>
            <span class="badge">${secs(a.ms)}</span>
          </div><div id="p-md"></div>`;
        renderMD(document.getElementById('p-md'), map[q.id] ? styleTag(q.id) + map[q.id] : '');
      });
    }
    paint();
  }

  function keys(e) {
    const s = Store.state.active;
    if (!s || !location.hash.startsWith('#/run') || userPaused) return;
    if (e.target.matches('input,textarea,select')) return;
    // modified keys belong to the browser and to Shift+F for full screen
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    const q = activeQ();
    const L = e.key.toUpperCase();
    if (LETTERS.slice(0, q.options).includes(L)) {
      e.preventDefault();
      choose(L);
    } else if (e.key === 'ArrowRight') goto(s.cursor + 1);
    else if (e.key === 'ArrowLeft') goto(s.cursor - 1);
    else if (L === 'M') {
      // 'M' for mark: F, G and H are answer letters on the longer questions
      s.answers[q.id].flagged = !s.answers[q.id].flagged;
      Store.flushActive();
      draw();
    }
  }
  document.addEventListener('keydown', keys);
  document.addEventListener('visibilitychange', () => {
    if (!Store.state.active || !location.hash.startsWith('#/run')) return;
    if (document.hidden) {
      commit();
      paused = true;
    } else if (!userPaused) {
      paused = false;
      qStart = performance.now();
    }
  });
  window.addEventListener('beforeunload', () => {
    if (Store.state.active && location.hash.startsWith('#/run')) commit();
  });

  return { draw, start, stop, commit };
})();

function viewRun() {
  if (!Store.state.active) {
    location.hash = '#/';
    return;
  }
  Player.start();
  Player.draw();
}

/* ---------------- results ---------------- */
async function viewResults(id) {
  const s = Store.session(id);
  if (!s) {
    view.innerHTML = '<div class="empty">That test could not be found.</div>';
    return;
  }
  const sc = scoreOf(s);
  const items = s.order.map((qid) => {
    const q = BYID.get(qid);
    const a = s.answers[qid];
    return { q, a, ms: a.ms, correct: a.chosen === q.answer, skipped: !a.chosen };
  });
  const answered = items.filter((i) => !i.skipped);
  const slowest = [...answered].sort((x, y) => y.ms - x.ms)[0];
  const fastest = [...answered].sort((x, y) => x.ms - y.ms)[0];
  const avg = answered.length ? answered.reduce((t, i) => t + i.ms, 0) / answered.length : 0;
  const rightAvg = avgOf(answered.filter((i) => i.correct));
  const wrongAvg = avgOf(answered.filter((i) => !i.correct));

  const byTopic = new Map();
  items.forEach((i) => {
    const k = i.q.subject + '|' + i.q.topic;
    const o = byTopic.get(k) || { n: 0, c: 0, ms: 0 };
    o.n++;
    o.ms += i.ms;
    if (i.correct) o.c++;
    byTopic.set(k, o);
  });

  view.innerHTML = `
    <div class="page-head">
      <div><h1>${esc(s.title)}</h1>
        <p>${when(s.startedAt)} · ${s.timed ? 'timed' : 'untimed'} ·
        ${sc.answered} of ${sc.total} answered in ${clock(s.elapsedMs)}</p></div>
      <div class="row">
        <button class="btn" id="r-again">Same settings again</button>
        <button class="btn btn-primary" id="r-wrong" ${sc.answered === sc.right ? 'disabled' : ''}>
          Retry the ${sc.answered - sc.right} I got wrong</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns:auto minmax(0,1fr);gap:var(--space-8);align-items:center">
      ${Chart.ring(sc.pct, Math.round(sc.pct) + '%', `${sc.right} of ${sc.total}`)}
      <div class="grid cols-4" style="gap:var(--space-3)">
        <div class="stat"><div class="k">Total time</div><div class="v">${clock(s.elapsedMs)}</div>
          <div class="s">${s.timed ? `of ${Math.round(s.limitMs / 60000)} min allowed` : 'untimed'}</div></div>
        <div class="stat"><div class="k">Average</div><div class="v">${secs(avg)}</div>
          <div class="s">per answered question</div></div>
        <div class="stat"><div class="k">Correct vs wrong</div>
          <div class="v" style="font-size:1.4rem">${secs(rightAvg)} / ${secs(wrongAvg)}</div>
          <div class="s">avg time on right vs wrong</div></div>
        <div class="stat"><div class="k">Longest</div><div class="v">${slowest ? secs(slowest.ms) : '—'}</div>
          <div class="s">${slowest ? 'Q' + (s.order.indexOf(slowest.q.id) + 1) + ' · ' + esc(slowest.q.topic) : '—'}</div></div>
      </div>
    </div>

    <div class="card" style="margin-top:var(--space-6)">
      <div class="row" style="justify-content:space-between;margin-bottom:var(--space-4)">
        <h2>Time on each question</h2>
        <div class="legend">
          <span><i style="background:var(--color-success)"></i>correct</span>
          <span><i style="background:var(--color-error)"></i>incorrect</span>
          <span><i style="background:var(--color-text-faint)"></i>skipped</span>
          <span>dashed line = your average</span>
        </div>
      </div>
      <div class="chart-fit" style="height:190px">${Chart.timePerQuestion(items)}</div>
    </div>

    <div class="grid cols-2" style="margin-top:var(--space-6);align-items:start">
      <div class="card"><h2 style="margin-bottom:var(--space-5)">How each topic went</h2>
        ${Chart.hbars(
          [...byTopic.entries()]
            .sort((a, b) => pct(a[1].c, a[1].n) - pct(b[1].c, b[1].n))
            .map(([k, v]) => ({
              label: k.split('|')[1],
              value: pct(v.c, v.n),
              sub: `${v.c}/${v.n} · ${secs(v.ms / v.n)}`,
              tone: tone(pct(v.c, v.n)),
            }))
        )}
      </div>
      <div class="card"><h2 style="margin-bottom:var(--space-4)">Pace check</h2>
        <p class="muted" style="font-size:var(--text-sm)">${paceNote(items, s)}</p>
        ${Chart.hbars(
          [
            { label: 'Fastest question', value: fastest ? fastest.ms : 0, max: slowest ? slowest.ms : 1, sub: fastest ? 'Q' + (s.order.indexOf(fastest.q.id) + 1) : '' },
            { label: 'Your average', value: avg, max: slowest ? slowest.ms : 1 },
            { label: 'Slowest question', value: slowest ? slowest.ms : 0, max: slowest ? slowest.ms : 1, sub: slowest ? 'Q' + (s.order.indexOf(slowest.q.id) + 1) : '' },
            { label: 'ESAT target pace', value: 88800, max: Math.max(slowest ? slowest.ms : 1, 88800), tone: 'ok' },
          ],
          { format: (v) => secs(v) }
        )}
      </div>
    </div>

    <h2 style="margin:var(--space-10) 0 var(--space-4)">Every question</h2>
    <div class="scroll-x card" style="padding:0">
      <table class="tbl">
        <thead><tr><th>#</th><th>Question</th><th>Topic</th><th>Yours</th><th>Answer</th>
          <th class="num">Time</th><th></th></tr></thead>
        <tbody>
          ${items
            .map(
              (i, n) => `<tr>
            <td class="mono muted">${n + 1}</td>
            <td><span class="muted" style="font-size:var(--text-xs)">${i.q.exam} ${i.q.year} Q${i.q.qno}</span><br />
              <span class="badge">${SUBJ_SHORT[i.q.subject]}</span></td>
            <td>${esc(i.q.topic)}<br /><span class="faint mono" style="font-size:var(--text-xs)">${i.q.codes.join(' ')}</span></td>
            <td class="mono">${i.skipped ? '<span class="faint">—</span>' : `<span class="badge ${i.correct ? 'badge-ok' : 'badge-bad'}">${esc(i.a.chosen)}</span>`}</td>
            <td class="mono">${esc(i.q.answer)}</td>
            <td class="num">${secs(i.ms)}</td>
            <td><button class="btn btn-sm btn-ghost" data-rev="${i.q.id}">Method</button></td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div id="r-reviews" style="margin-top:var(--space-6)"></div>`;

  document.getElementById('r-again').onclick = () => startSession({ ...s.cfg });
  const rw = document.getElementById('r-wrong');
  if (rw && !rw.disabled)
    rw.onclick = () => {
      const wrong = items.filter((i) => !i.skipped && !i.correct).map((i) => i.q.id);
      startSession({
        title: 'Retry — ' + s.title,
        mode: 'fixed',
        subjects: SUBJECTS,
        count: wrong.length,
        reveal: 'instant',
        timed: false,
        fixed: wrong,
      });
    };
  view.querySelectorAll('button[data-rev]').forEach((b) => {
    b.onclick = () => openReview(b.dataset.rev, s);
  });
}
function avgOf(list) {
  return list.length ? list.reduce((t, i) => t + i.ms, 0) / list.length : null;
}
function paceNote(items, s) {
  const answered = items.filter((i) => !i.skipped);
  if (!answered.length) return 'No questions answered.';
  const avg = answered.reduce((t, i) => t + i.ms, 0) / answered.length;
  const target = 88800; // 40 minutes ÷ 27 questions
  const slow = answered.filter((i) => i.ms > target * 1.8 && !i.correct).length;
  let msg =
    avg <= target
      ? `You averaged ${secs(avg)} a question, inside the ESAT pace of ${secs(target)}.`
      : `You averaged ${secs(avg)} a question, over the ESAT pace of ${secs(target)} — ` +
        `in a real sitting you would run out of time.`;
  if (slow)
    msg += ` ${slow} question${slow === 1 ? '' : 's'} cost you well over the target and still came out wrong — those are the ones to abandon earlier and come back to.`;
  const rush = answered.filter((i) => i.ms < 20000 && !i.correct).length;
  if (rush) msg += ` ${rush} wrong answer${rush === 1 ? ' was' : 's were'} given in under 20 seconds, which usually means a misread.`;
  return msg;
}

async function openReview(qid, s) {
  const q = BYID.get(qid);
  const box = document.getElementById('r-reviews');
  const existing = document.getElementById('rev-' + qid);
  if (existing) {
    existing.open = true;
    existing.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const a = s ? s.answers[qid] : null;
  const d = document.createElement('details');
  d.className = 'acc';
  d.id = 'rev-' + qid;
  d.open = true;
  d.innerHTML = `<summary>${q.exam} ${q.year} Q${q.qno} · ${esc(q.topic)}
      ${a ? `<span class="badge ${a.chosen === q.answer ? 'badge-ok' : 'badge-bad'}" style="margin-left:auto">${a.chosen ? esc(a.chosen) : '—'} → ${esc(q.answer)}</span>` : ''}
      </summary>
    <div class="qimg" style="padding:var(--space-4)"><img data-qimg="${q.img}" alt=""
      style="width:100%;max-width:700px;display:block;margin:0 auto;filter:var(--question-filter);mix-blend-mode:var(--question-blend)" /></div>
    <div class="explain"><div class="skel" style="height:70px"></div></div>`;
  box.prepend(d);
  d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const map = await loadExp(q.subject);
  renderMD(d.querySelector('.explain'), map[qid] ? styleTag(qid) + map[qid] : '');
}

/* ---------------- stats ---------------- */
let statSubject = 'all';
function viewStats() {
  const st = analyse();
  const A = Store.state.attempts;
  const P = pool();
  const filt = (a) => statSubject === 'all' || a.subject === statSubject;
  const AA = A.filter(filt);
  const acc = pct(AA.filter((a) => a.correct).length, AA.length);
  const attempted = new Set(AA.map((a) => a.qid));
  const scope = statSubject === 'all' ? P : P.filter((q) => q.subject === statSubject);

  const topics = [...st.byTopic.entries()]
    .filter(([k]) => statSubject === 'all' || k.startsWith(statSubject + '|'))
    .map(([k, v]) => ({ k, ...v, a: pct(v.correct, v.n) }));
  const weak = topics.filter((t) => t.n >= 2).sort((a, b) => a.a - b.a).slice(0, 10);
  const strong = topics.filter((t) => t.n >= 2).sort((a, b) => b.a - a.a).slice(0, 6);
  const untouched = [...new Set(scope.map(tkey))].filter((k) => !st.byTopic.has(k));

  const groupBlocks = SUBJECTS.filter((s) => statSubject === 'all' || s === statSubject)
    .map((s) => {
      const gs = META.groups.filter((g) => g.subject === s && scope.some((q) => q.group === g.name));
      if (!gs.length) return '';
      return `<div style="margin-bottom:var(--space-6)">
        <h3 style="margin-bottom:var(--space-3)">${SUBJ_SHORT[s]}</h3>
        <div class="grid" style="gap:var(--space-4)">
          ${gs
            .map((g) => {
              const codes = [...new Set(scope.filter((q) => q.group === g.name).flatMap((q) => q.codes))].sort();
              const cells = codes.map((c) => {
                const v = st.byCode.get(s + '|' + c);
                return { code: c, n: v ? v.n : 0, pct: v ? pct(v.correct, v.n) : 0 };
              });
              // header must describe the same answers the squares are built from,
              // so count every answer of this subject that carries one of these codes
              const hits = A.filter(
                (a) => a.subject === s && (a.codes || []).some((c) => codes.includes(c))
              );
              const touched = cells.filter((c) => c.n).length;
              return `<div>
                <div class="row" style="justify-content:space-between;margin-bottom:var(--space-2)">
                  <span style="font-size:var(--text-sm);font-weight:600">
                    <span class="mono faint">${g.code}</span> ${esc(g.name)}</span>
                  <span class="mono muted" style="font-size:var(--text-xs)">${
                    hits.length
                      ? Math.round(pct(hits.filter((a) => a.correct).length, hits.length)) +
                        '% · ' +
                        touched +
                        '/' +
                        cells.length +
                        ' points'
                      : 'untouched'
                  }</span>
                </div>${Chart.heat(cells)}</div>`;
            })
            .join('')}
        </div></div>`;
    })
    .join('');

  view.innerHTML = `
    ${storageBanner()}
    <div class="page-head">
      <div><h1>Analytics</h1><p>Built from ${A.length} recorded answer${A.length === 1 ? '' : 's'}
        across ${Store.state.sessions.length} test${Store.state.sessions.length === 1 ? '' : 's'}.</p></div>
      <div class="sub-tabs" id="st-tabs">
        <button data-s="all" aria-pressed="${statSubject === 'all'}">All</button>
        ${SUBJECTS.map(
          (s) => `<button data-s="${s}" aria-pressed="${statSubject === s}">${SUBJ_SHORT[s]}</button>`
        ).join('')}
      </div>
    </div>

    ${
      !AA.length
        ? `<div class="empty"><h2>Nothing recorded yet</h2>
             <p>Answer some questions and this page fills up with accuracy, pace and
             specification coverage.</p><a class="btn btn-primary" href="#/build">Start a test</a></div>`
        : `
    <div class="grid cols-4">
      <div class="stat"><div class="k">Accuracy</div><div class="v">${Math.round(acc)}%</div>
        <div class="s">${AA.filter((a) => a.correct).length} of ${AA.length}</div></div>
      <div class="stat"><div class="k">Questions seen</div><div class="v">${attempted.size}</div>
        <div class="s">of ${scope.length} available</div></div>
      <div class="stat"><div class="k">Time practising</div>
        <div class="v">${clock(AA.reduce((t, a) => t + a.ms, 0))}</div>
        <div class="s">total across all sets</div></div>
      <div class="stat"><div class="k">Topics touched</div>
        <div class="v">${topics.length}</div>
        <div class="s">${untouched.length} still untouched</div></div>
    </div>

    <div class="card" style="margin-top:var(--space-6)">
      <h2 style="margin-bottom:var(--space-4)">Accuracy by test</h2>
      ${Chart.trend(
        Store.state.sessions.slice(-16).map((s) => ({ label: s.title, value: scoreOf(s).pct }))
      )}
    </div>

    <div class="grid cols-2" style="margin-top:var(--space-6);align-items:start">
      <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:var(--space-5)">
          <h2>Weakest topics</h2>
          <button class="btn btn-sm" id="st-drill">Drill top 12</button></div>
        ${
          weak.length
            ? Chart.hbars(
                weak.map((w) => ({
                  label: w.k.split('|')[1],
                  value: w.a,
                  sub: `${w.correct}/${w.n} · ${secs(w.ms / w.n)}`,
                  tone: tone(w.a),
                }))
              )
            : '<p class="muted">Answer at least two questions in a topic to rank it.</p>'
        }
      </div>
      <div class="card"><h2 style="margin-bottom:var(--space-5)">Strongest topics</h2>
        ${
          strong.length
            ? Chart.hbars(
                strong.map((w) => ({
                  label: w.k.split('|')[1],
                  value: w.a,
                  sub: `${w.correct}/${w.n}`,
                  tone: tone(w.a),
                }))
              )
            : '<p class="muted">Not enough data yet.</p>'
        }
      </div>
    </div>

    ${
      untouched.length
        ? `<div class="card" style="margin-top:var(--space-6)">
             <div class="row" style="justify-content:space-between;margin-bottom:var(--space-4)">
               <h2>Not touched yet</h2>
               <button class="btn btn-sm" id="st-fresh">Drill 12 of these</button></div>
             <p class="muted" style="margin-bottom:var(--space-4)">${untouched.length} topics you have not answered a
             single question from.</p>
             <div class="chips">${untouched
               .slice(0, 24)
               .map((k) => `<span class="chip" style="cursor:default">${esc(k.split('|')[1])}</span>`)
               .join('')}
             ${untouched.length > 24 ? `<span class="chip" style="cursor:default">+${untouched.length - 24} more</span>` : ''}</div>
           </div>`
        : ''
    }

    <div class="card" style="margin-top:var(--space-6)">
      <div class="row" style="justify-content:space-between;margin-bottom:var(--space-5)">
        <h2>Specification coverage</h2>
        <div class="legend">
          <span><i style="background:var(--color-surface-offset-2)"></i>not attempted</span>
          <span><i style="background:var(--color-error)"></i>under 55%</span>
          <span><i style="background:var(--color-warning)"></i>55–79%</span>
          <span><i style="background:var(--color-success)"></i>80%+</span>
        </div>
      </div>
      <p class="muted" style="font-size:var(--text-sm)">One square per specification point. Stronger
      colour means more attempts, so faint squares need more evidence before you trust them.</p>
      ${groupBlocks}
    </div>

    <div class="card" style="margin-top:var(--space-6)">
      <h2 style="margin-bottom:var(--space-4)">Pace</h2>
      ${Chart.hbars(
        [
          { label: 'Average on correct answers', value: avgOf(AA.filter((a) => a.correct).map((a) => ({ ms: a.ms }))) || 0 },
          { label: 'Average on wrong answers', value: avgOf(AA.filter((a) => !a.correct).map((a) => ({ ms: a.ms }))) || 0, tone: 'bad' },
          { label: 'ESAT target pace', value: 88800, tone: 'ok' },
        ].map((r) => ({ ...r, max: Math.max(88800, ...AA.map((a) => a.ms)) })),
        { format: (v) => secs(v) }
      )}
    </div>`
    }`;

  document.getElementById('st-tabs').onclick = (e) => {
    const b = e.target.closest('button[data-s]');
    if (!b) return;
    statSubject = b.dataset.s;
    render();
  };
  const dr = document.getElementById('st-drill');
  if (dr)
    dr.onclick = () =>
      startSession({
        title: 'Weak-point drill',
        mode: 'weak',
        subjects: statSubject === 'all' ? SUBJECTS : [statSubject],
        count: 12,
        reveal: 'instant',
        timed: false,
      });
  const fr = document.getElementById('st-fresh');
  if (fr)
    fr.onclick = () =>
      startSession({
        title: 'Fresh topics',
        mode: 'unseen',
        subjects: statSubject === 'all' ? SUBJECTS : [statSubject],
        topics: untouched.slice(0, 12),
        count: 12,
        reveal: 'instant',
        timed: false,
      });
}

/* ---------------- history ---------------- */
function viewHistory() {
  const S = [...Store.state.sessions].reverse();
  view.innerHTML = `
    ${storageBanner()}
    <div class="page-head"><div><h1>History</h1>
      <p>Every completed set, newest first. Open one to see the full per-question breakdown again.</p></div></div>
    ${
      !S.length
        ? `<div class="empty"><h2>No completed tests yet</h2>
             <a class="btn btn-primary" href="#/build">Build your first test</a></div>`
        : `<div class="scroll-x card" style="padding:0"><table class="tbl">
          <thead><tr><th>When</th><th>Set</th><th>Mode</th><th class="num">Score</th>
            <th class="num">Time</th><th class="num">Per question</th><th></th></tr></thead>
          <tbody>${S.map((s) => {
            const sc = scoreOf(s);
            return `<tr class="clickable" data-id="${esc(s.id)}">
              <td class="muted" style="font-size:var(--text-xs);white-space:nowrap">${when(s.startedAt)}</td>
              <td><strong>${esc(s.title)}</strong><br /><span class="faint" style="font-size:var(--text-xs)">
                ${sc.total} questions · ${s.timed ? 'timed' : 'untimed'}</span></td>
              <td><span class="badge">${esc(s.mode)}</span></td>
              <td class="num"><span class="badge ${tone(sc.pct) === 'ok' ? 'badge-ok' : tone(sc.pct) === 'warn' ? 'badge-warn' : 'badge-bad'}">
                ${sc.right}/${sc.total} · ${Math.round(sc.pct)}%</span></td>
              <td class="num">${clock(s.elapsedMs)}</td>
              <td class="num">${secs(sc.answered ? s.elapsedMs / sc.answered : 0)}</td>
              <td><span class="muted">→</span></td></tr>`;
          }).join('')}</tbody></table></div>`
    }`;
  view.querySelectorAll('tr[data-id]').forEach((tr) => {
    tr.onclick = () => (location.hash = '#/results/' + tr.dataset.id);
  });
}

/* ---------------- data ---------------- */
function viewData() {
  const s = Store.state;
  const P = pool();
  const byExam = EXAMS.map((e) => `${e} ${QS.filter((q) => q.exam === e).length}`).join(' · ');
  view.innerHTML = `
    ${storageBanner()}
    <div class="page-head"><div><h1>Data &amp; question bank</h1>
      <p>Your progress never leaves this browser. Export it if you want a backup or want to carry
      it to another device.</p></div></div>

    <div class="grid cols-2" style="align-items:start">
      <div class="card">
        <h2>Your data</h2>
        <div class="grid cols-2" style="margin:var(--space-5) 0">
          <div class="stat"><div class="k">Answers recorded</div><div class="v">${s.attempts.length}</div></div>
          <div class="stat"><div class="k">Tests completed</div><div class="v">${s.sessions.length}</div></div>
        </div>
        <div class="row">
          <button class="btn" id="d-export">Export backup</button>
          <label class="btn" style="cursor:pointer">Import backup
            <input type="file" id="d-import" accept="application/json" style="display:none" /></label>
          <button class="btn btn-ghost" id="d-reset" style="color:var(--color-error)">Erase everything</button>
        </div>
        <p class="muted" style="font-size:var(--text-xs);margin-top:var(--space-4)">
          Storage: ${Store.memoryOnly ? 'unavailable in this frame — using memory only' : 'browser localStorage on this device'}.</p>

        <label class="field" style="margin-top:var(--space-6)">During a test</label>
        <label class="switch"><input type="checkbox" id="d-pacedot" ${
          Store.settings().paceDot ? 'checked' : ''
        } />
          <span>Show the pace dot beside each question</span></label>
        <p class="muted" style="font-size:var(--text-xs);margin-top:var(--space-3)">
          A small dot that turns <strong style="color:var(--color-warning)">amber</strong> for the
          first 10 seconds — the window in which to decide whether to attempt the question — then
          <strong style="color:var(--color-primary)">yellow</strong> while you work, then
          <strong style="color:var(--color-error)">red</strong> once you pass 1:29, the ESAT pace.
          It never interrupts you.</p>

      </div>

      <div class="card">
        <h2>How the bank was built</h2>
        <ol class="muted" style="font-size:var(--text-sm);padding-left:var(--space-5);line-height:1.75">
          <li>Every question was cut out of the original PDFs as an image, so the diagrams and
            mathematical notation are exactly as printed.</li>
          <li>Questions Cambridge Assessment marked with a cross through the number — their own
            signal for “not in the ESAT specification” — were removed, along with all Advanced
            Physics sections.</li>
          <li>NSAA Chemistry and Biology were dropped, and only TMUA Paper 1 multiple-choice
            questions were kept.</li>
          <li>ENGAA and NSAA reused many questions in the same year. Those repeats were
            found by comparing the question text and images, and only the ENGAA copy of each was kept.</li>
          <li>What remained was checked against the April 2025 ESAT content specification, tagged
            with a specification code and topic, and given a worked solution.</li>
        </ol>
        <div class="grid cols-2" style="margin-top:var(--space-5);gap:var(--space-3)">
          <div class="stat"><div class="k">In the bank</div><div class="v">${P.length}</div>
            <div class="s">${byExam}</div></div>
          <div class="stat"><div class="k">Papers used</div><div class="v">${META.papers.length}</div>
            <div class="s">${META.papers.length ? META.papers[0] + ' – ' + META.papers[META.papers.length - 1] : ''}</div></div>
        </div>
        <p class="muted" style="font-size:var(--text-xs);margin-top:var(--space-4)">
          Past papers are © Cambridge Assessment Admissions Testing / University of Cambridge and are
          used here for personal revision. Worked solutions are generated and may contain errors —
          the option letters come from the official answer keys. Built ${esc(META.built)}.</p>
      </div>
    </div>`;

  document.getElementById('d-export').onclick = () => {
    const b = new Blob([Store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `esat-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    Toast('Backup downloaded.');
  };
  document.getElementById('d-import').onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        Store.importJSON(r.result);
        migrateIds();
        Toast('Backup restored.');
        applyTheme();
        if (typeof applyDys === "function") applyDys();
        render();
      } catch (err) {
        alert(err.message);
      }
    };
    r.readAsText(f);
  };
  document.getElementById('d-reset').onclick = () => {
    if (!confirm('Erase all answers, tests and settings on this device? This cannot be undone.')) return;
    Store.reset();
    applyTheme();
    if (typeof applyDys === "function") applyDys();
    Toast('All progress erased.');
    render();
  };
  document.getElementById('d-pacedot').onchange = (e) => {
    Store.setSetting('paceDot', e.target.checked);
    Toast(e.target.checked ? 'Pace dot shown.' : 'Pace dot hidden.');
  };
}

/* ---------------- loading + router ---------------- */
let ESTYLE = null; // qid -> { trick, s } for solutions rewritten in ESAT exam style
function styleTag(qid) {
  if (!ESTYLE) return '';
  const m = ESTYLE[qid];
  return m
    ? `<p><span class="badge badge-es">ESAT-style · ${esc(m.trick)}${m.s ? ' · ~' + m.s + 's by hand' : ''}</span></p>\n\n`
    : `<p><span class="badge">Long-form solution · ESAT-style version coming</span></p>\n\n`;
}
async function loadExp(subject) {
  if (!ESTYLE) {
    try {
      ESTYLE = await (await fetch('data/esatstyle.json')).json();
    } catch (e) {
      ESTYLE = {};
    }
  }
  if (EXP[subject]) return EXP[subject];
  const r = await fetch(`data/exp_${subject}.json`);
  EXP[subject] = await r.json();
  return EXP[subject];
}

function render() {
  const h = location.hash || '#/';
  const path = h.replace(/^#\//, '').split('/');
  document.querySelectorAll('#nav a').forEach((a) => {
    const match = a.getAttribute('href') === '#/' + (path[0] || '');
    if (match) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (heroStop) { heroStop(); heroStop = null; }
  if (typeof MM !== 'undefined') MM.stop();
  if (!path[0].startsWith('run')) {
    Player.commit();
    Player.stop();
  }
  window.scrollTo({ top: 0 });
  switch (path[0]) {
    case '':
      return viewOverview();
    case 'topics':
      return viewTopics();
    case 'build':
      return viewBuild();
    case 'run':
      return viewRun();
    case 'results':
      return viewResults(path[1]);
    case 'mental':
      return viewMental(path[1]);
    case 'hub':
      return viewHub(path[1], path[2]);
    case 'stats':
      return viewStats();
    case 'history':
      return viewHistory();
    case 'data':
      return viewData();
    default:
      location.hash = '#/';
  }
}

(async function boot() {
  applyTheme();
  if (typeof applyDys === "function") applyDys();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!Store.settings().theme) applyTheme();
  });
  try {
    const [m, q] = await Promise.all([
      fetch('data/meta.json').then((r) => r.json()),
      fetch('data/questions.json').then((r) => r.json()),
    ]);
    META = m;
    QS = q;
    BYID = new Map(q.map((x) => [x.id, x]));
    Object.entries(META.aliases || {}).forEach(([o, n]) => BYID.has(n) && !BYID.has(o) && BYID.set(o, BYID.get(n)));
    migrateIds();
  } catch (e) {
    view.innerHTML = `<div class="empty"><h2>Could not load the question bank</h2>
      <p>${esc(e.message)}</p></div>`;
    return;
  }
  window.addEventListener('hashchange', render);
  render();
})();
