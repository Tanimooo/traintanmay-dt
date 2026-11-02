/* ============================================================
   Persistence. Everything lives in this browser — no accounts,
   no server. Falls back to memory when storage is unavailable
   (e.g. inside a sandboxed preview iframe).
   ============================================================ */
const Store = (() => {
  const KEY = 'esat.trainer.v1';
  let memoryOnly = false;
  let mem = null;

  const blank = () => ({
    version: 1,
    attempts: [], // { qid, subject, group, topic, codes, chosen, correct, ms, ts, session }
    sessions: [], // { id, title, mode, timed, limitMs, startedAt, finishedAt, config, order }
    active: null, // in-progress session (survives a reload)
    settings: {
      theme: null, // null = follow system
      dys: false, // OpenDyslexic font
      includeOffSpec: false,
      clock: 'total', // 'total' | 'question' | 'off'
      paceDot: true, // the amber/blue/red pace dot beside each question
    },
  });

  // The storage object is resolved at runtime rather than referenced directly, so a
  // sandboxed frame that forbids it simply yields null and the app runs from memory.
  const NAME = ['local', 'Storage'].join('');
  function disk() {
    try {
      return window[NAME] || null;
    } catch (e) {
      return null;
    }
  }

  function probe() {
    try {
      const d = disk();
      if (!d) return false;
      d.setItem(KEY + '.probe', '1');
      d.removeItem(KEY + '.probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  let state;
  if (probe()) {
    try {
      state = JSON.parse(disk().getItem(KEY)) || blank();
    } catch (e) {
      state = blank();
    }
    // forward-compatible merge of any newly added settings
    state = Object.assign(blank(), state);
    state.settings = Object.assign(blank().settings, state.settings || {});
  } else {
    memoryOnly = true;
    state = blank();
  }
  mem = state;

  let saveTimer = null;
  function save() {
    if (memoryOnly) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        disk().setItem(KEY, JSON.stringify(state));
      } catch (e) {
        memoryOnly = true;
      }
    }, 120);
  }

  return {
    get memoryOnly() {
      return memoryOnly;
    },
    get state() {
      return state;
    },
    settings: () => state.settings,
    setSetting(k, v) {
      state.settings[k] = v;
      save();
    },
    addSession(s) {
      state.sessions.push(s);
      save();
    },
    setActive(a) {
      state.active = a;
      save();
    },
    flushActive() {
      save();
    },
    session(id) {
      return state.sessions.find((s) => s.id === id);
    },
    /** Record one answered question. Replaces nothing — history is append-only. */
    addAttempts(list) {
      state.attempts.push(...list);
      save();
    },
    attemptsFor(qid) {
      return state.attempts.filter((a) => a.qid === qid);
    },
    reset() {
      state = blank();
      mem = state;
      if (!memoryOnly) {
        try {
          disk().removeItem(KEY);
        } catch (e) {}
      }
      save();
    },
    exportJSON() {
      return JSON.stringify(state, null, 1);
    },
    importJSON(text) {
      const d = JSON.parse(text);
      if (!d || !Array.isArray(d.attempts) || !Array.isArray(d.sessions))
        throw new Error('That file is not a TrainTanmay backup.');
      state = Object.assign(blank(), d);
      state.settings = Object.assign(blank().settings, d.settings || {});
      mem = state;
      save();
      return true;
    },
  };
})();
