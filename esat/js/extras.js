/* ============================================================
   Extras — storage for the Mental Maths trainer and Revision Hub.

   Backward compatibility rules:
   * Lives under its OWN key (esat.trainer.extras.v1). The original
     store (esat.trainer.v1) is never touched by anything in here.
   * Every field read goes through a default, so old data has no gaps.
   * Backups: exportJSON() gains ONE optional field, "extras". Old backup
     files (no such field) import exactly as before and leave the
     user's current extras untouched.
   ============================================================ */
const Extras = (() => {
  const KEY = 'esat.trainer.extras.v1';
  const NAME = ['local', 'Storage'].join('');
  let memoryOnly = false;

  const blank = () => ({
    version: 1,
    mm: {
      pairs: {}, // "a×b" (a<=b) -> { n, ok, ms, ts }
      sq: {}, // "sq:12" / "cu:7" / "rt:12" / "cr:7" -> { n, ok, ms, ts }
      tri: {}, // "tri:3-4-5" / "k:5-12-13" -> { n, ok, ms, ts }
      bestStreak: { tables: 0, powers: 0, triples: 0 },
      sessions: [], // { kind, mode, ts, n, ok, ms, best }
      flash: {}, // "sq:12" -> 'known' | 'again'
    },
    hub: { learned: {}, cram: false, tab: 'm1' },
  });

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

  // Merge with defaults so a partial / older object never produces an undefined.
  function normalise(raw) {
    const b = blank();
    const d = raw && typeof raw === 'object' ? raw : {};
    const out = Object.assign(b, d);
    out.mm = Object.assign(b.mm, d.mm || {});
    out.mm.bestStreak = Object.assign(blank().mm.bestStreak, (d.mm || {}).bestStreak || {});
    out.hub = Object.assign(blank().hub, d.hub || {});
    if (!out.hub.learned || typeof out.hub.learned !== 'object') out.hub.learned = {};
    ['pairs', 'sq', 'tri', 'flash'].forEach((k) => {
      if (!out.mm[k] || typeof out.mm[k] !== 'object') out.mm[k] = {};
    });
    if (!Array.isArray(out.mm.sessions)) out.mm.sessions = [];
    return out;
  }

  let state;
  if (probe()) {
    try {
      state = normalise(JSON.parse(disk().getItem(KEY)));
    } catch (e) {
      state = normalise(null);
    }
  } else {
    memoryOnly = true;
    state = normalise(null);
  }

  let timer = null;
  function save() {
    if (memoryOnly) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        disk().setItem(KEY, JSON.stringify(state));
      } catch (e) {
        memoryOnly = true;
      }
    }, 120);
  }

  /* ---- plug into the existing backup / erase flow without changing it ---- */
  const origExport = Store.exportJSON.bind(Store);
  const origImport = Store.importJSON.bind(Store);
  const origReset = Store.reset.bind(Store);

  Store.exportJSON = function () {
    const base = JSON.parse(origExport());
    base.extras = state; // optional, additive field
    return JSON.stringify(base, null, 1);
  };
  Store.importJSON = function (text) {
    const d = JSON.parse(text);
    const ok = origImport(text);
    // the core store keeps whatever extra keys the file had; drop the copy so it is not duplicated
    try {
      delete Store.state.extras;
    } catch (e) {}
    if (d && d.extras && typeof d.extras === 'object') {
      state = normalise(d.extras); // new-style backup: restore the practice data too
      save();
    } // old-style backup: leave current extras exactly as they are
    return ok;
  };
  Store.reset = function () {
    origReset();
    state = normalise(null);
    if (!memoryOnly) {
      try {
        disk().removeItem(KEY);
      } catch (e) {}
    }
    save();
  };

  /* ---- Mental maths helpers ---- */
  function bump(map, key, ok, ms) {
    const r = map[key] || { n: 0, ok: 0, ms: 0, ts: 0 };
    r.n += 1;
    if (ok) r.ok += 1;
    r.ms += Math.min(ms, 30000); // cap so a walk-away does not poison the average
    r.ts = Date.now();
    map[key] = r;
    save();
  }
  const pairKey = (a, b) => `${Math.min(a, b)}×${Math.max(a, b)}`;

  return {
    get state() {
      return state;
    },
    get memoryOnly() {
      return memoryOnly;
    },
    save,
    mm: () => state.mm,
    hub: () => state.hub,
    pairKey,
    record(bucket, key, ok, ms) {
      bump(state.mm[bucket], key, ok, ms);
    },
    bestStreak(kind, n) {
      if (n > (state.mm.bestStreak[kind] || 0)) {
        state.mm.bestStreak[kind] = n;
        save();
        return true;
      }
      return false;
    },
    addSession(s) {
      state.mm.sessions.push(s);
      if (state.mm.sessions.length > 300) state.mm.sessions.splice(0, state.mm.sessions.length - 300);
      save();
    },
    isLearned: (id) => !!state.hub.learned[id],
    setLearned(id, v) {
      if (v) state.hub.learned[id] = 1;
      else delete state.hub.learned[id];
      save();
    },
    setHub(k, v) {
      state.hub[k] = v;
      save();
    },
  };
})();
