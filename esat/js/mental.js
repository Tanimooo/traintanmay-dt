/* ============================================================
   Mental Maths trainer — times tables to 20x20, squares and cubes,
   Pascal's triangle, Pythagorean triples.
   Everything is stored under Extras (its own storage key).
   ============================================================ */
'use strict';

const MM = (() => {
  let cleanup = null; // stops any running timer when the user leaves the page
  function stop() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  }

  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const TABS = [
    ['tables', 'Times tables'],
    ['powers', 'Squares & cubes'],
    ['pascal', "Pascal's triangle"],
    ['triples', 'Pythagorean triples'],
  ];
  const CORE_TRIPLES = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
    [20, 21, 29],
  ];
  const MORE_TRIPLES = [
    [9, 40, 41],
    [12, 35, 37],
    [11, 60, 61],
    [28, 45, 53],
    [33, 56, 65],
  ];

  /* ---------- small helpers over stored stats ---------- */
  function acc(r) {
    return r && r.n ? r.ok / r.n : null;
  }
  function avg(r) {
    return r && r.n ? r.ms / r.n : null;
  }
  // "weak" = missed more than ~1 in 7, or slower than 6 seconds on average
  function isWeak(r) {
    if (!r || !r.n) return false;
    if (r.n === 1) return r.ok === 0;
    return r.ok / r.n < 0.86 || r.ms / r.n > 6000;
  }
  function weakKeys(map, prefix) {
    return Object.keys(map)
      .filter((k) => (prefix ? k.startsWith(prefix) : true) && isWeak(map[k]))
      .sort((a, b) => {
        const A = map[a],
          B = map[b];
        return A.ok / A.n - B.ok / B.n || B.ms / B.n - A.ms / A.n;
      });
  }

  /* ---------- the drill engine ---------- */
  /* cfg: { el, kind:'tables'|'powers'|'triples', mode:'untimed'|'timed', count, seconds,
            next():item, onDone() }
     item: { prompt (html), answer (number|string), key, bucket, hint?, choices?:[{label,ok}] } */
  function runDrill(cfg) {
    const el = cfg.el;
    const timed = cfg.mode === 'timed';
    const total = timed ? Infinity : cfg.count;
    const log = [];
    let n = 0,
      ok = 0,
      streak = 0,
      best = 0,
      item = null,
      t0 = 0,
      locked = false,
      endAt = 0,
      tick = null,
      ended = false;
    const startedAt = Date.now();

    el.innerHTML = `
      <div class="drill card" role="group" aria-label="Drill">
        <div class="drill-top">
          <span class="chip-stat"><b id="d-score">0</b> correct</span>
          <span class="chip-stat">streak <b id="d-streak">0</b></span>
          <span class="chip-stat" id="d-prog"></span>
          <span class="chip-stat mono grow" id="d-clock" style="${timed ? '' : 'display:none'}"></span>
          <button class="btn btn-ghost btn-sm" id="d-quit">End</button>
        </div>
        <div class="drill-stage" id="d-stage"></div>
        <div class="drill-msg" id="d-msg" aria-live="polite"></div>
      </div>`;
    const $ = (id) => el.querySelector('#' + id);
    const stage = $('d-stage');

    function head() {
      $('d-score').textContent = ok;
      $('d-streak').textContent = streak;
      $('d-prog').textContent = timed ? `${n} answered` : `${n} / ${total}`;
    }

    function ask() {
      if (ended) return;
      if (!timed && n >= total) return finish();
      item = cfg.next();
      locked = false;
      $('d-msg').textContent = '';
      $('d-msg').className = 'drill-msg';
      if (item.choices) {
        stage.innerHTML = `<div class="drill-q">${item.prompt}</div>
          <div class="drill-choices">${item.choices
            .map((c, i) => `<button class="btn drill-choice" data-i="${i}">${c.label}</button>`)
            .join('')}</div>`;
        stage.querySelectorAll('.drill-choice').forEach((b) => {
          b.onclick = () => submitChoice(+b.dataset.i, b);
        });
      } else {
        stage.innerHTML = `<div class="drill-q">${item.prompt}</div>
          <input class="drill-in mono" id="d-in" type="text" inputmode="numeric" pattern="[0-9]*"
            autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" />
          <div class="muted" style="font-size:var(--text-xs)">Type the answer, Enter to confirm wrong ones</div>`;
        const inp = $('d-in');
        inp.focus();
        inp.oninput = () => {
          if (inp.value.trim() === String(item.answer)) submitValue(inp.value.trim());
        };
        inp.onkeydown = (e) => {
          if (e.key === 'Enter' && inp.value.trim()) submitValue(inp.value.trim());
        };
      }
      head();
      t0 = performance.now();
    }

    function record(correct, given) {
      const ms = performance.now() - t0;
      n += 1;
      if (correct) {
        ok += 1;
        streak += 1;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
      Extras.record(item.bucket, item.key, correct, ms);
      log.push({ prompt: item.prompt, answer: item.answer, given, ok: correct, ms, key: item.key });
      head();
      return ms;
    }

    function submitValue(v) {
      if (locked || ended) return;
      const correct = v === String(item.answer);
      record(correct, v);
      if (correct) {
        stage.classList.add('flash-ok');
        setTimeout(() => stage.classList.remove('flash-ok'), 160);
        ask();
      } else {
        locked = true;
        const m = $('d-msg');
        m.className = 'drill-msg bad';
        m.innerHTML = `Not quite — ${item.prompt.replace(/<[^>]+>/g, '')} = <b class="mono">${esc(item.answer)}</b>${item.hint ? ` · ${item.hint}` : ''}`;
        setTimeout(ask, timed ? 900 : 1500);
      }
    }

    function submitChoice(i, btn) {
      if (locked || ended) return;
      locked = true;
      const correct = !!item.choices[i].ok;
      record(correct, item.choices[i].label);
      stage.querySelectorAll('.drill-choice').forEach((b, j) => {
        b.disabled = true;
        if (item.choices[j].ok) b.classList.add('is-right');
        else if (b === btn) b.classList.add('is-wrong');
      });
      const m = $('d-msg');
      if (!correct) {
        m.className = 'drill-msg bad';
        m.innerHTML = item.hint || 'Not that one.';
      }
      setTimeout(ask, correct ? 350 : 1400);
    }

    function finish() {
      if (ended) return;
      ended = true;
      clearInterval(tick);
      const ms = log.reduce((a, r) => a + r.ms, 0);
      Extras.bestStreak(cfg.kind, best);
      if (n) {
        Extras.addSession({
          kind: cfg.kind,
          mode: cfg.mode,
          label: cfg.label || '',
          ts: startedAt,
          n,
          ok,
          ms: Math.round(ms),
          best,
        });
      }
      const slow = log
        .filter((r) => r.ok)
        .sort((a, b) => b.ms - a.ms)
        .slice(0, 3);
      const miss = log.filter((r) => !r.ok);
      el.innerHTML = `
        <div class="card drill-end">
          <h3>${timed ? 'Time!' : 'Round complete'}</h3>
          <div class="grid cols-4" style="margin:var(--space-4) 0">
            <div class="stat"><div class="k">Score</div><div class="v">${ok}/${n}</div></div>
            <div class="stat"><div class="k">Accuracy</div><div class="v">${n ? Math.round((100 * ok) / n) : 0}%</div></div>
            <div class="stat"><div class="k">Avg per answer</div><div class="v">${n ? (ms / n / 1000).toFixed(1) + 's' : '—'}</div></div>
            <div class="stat"><div class="k">Best streak</div><div class="v">${best}</div></div>
          </div>
          ${
            miss.length
              ? `<p><b>Missed:</b> ${miss.map((r) => `<span class="chip">${r.prompt.replace(/<[^>]+>/g, '')} = ${esc(r.answer)}</span>`).join(' ')}</p>`
              : '<p class="muted">Clean sheet — nothing missed.</p>'
          }
          ${
            slow.length
              ? `<p><b>Slowest right answers:</b> ${slow.map((r) => `<span class="chip">${r.prompt.replace(/<[^>]+>/g, '')} · ${(r.ms / 1000).toFixed(1)}s</span>`).join(' ')}</p>`
              : ''
          }
          <div class="row" style="margin-top:var(--space-4)">
            <button class="btn btn-primary" id="d-again">Go again</button>
            <button class="btn" id="d-back">Back to settings</button>
          </div>
        </div>`;
      el.querySelector('#d-again').onclick = () => runDrill(cfg);
      el.querySelector('#d-back').onclick = () => cfg.onDone && cfg.onDone();
    }

    $('d-quit').onclick = finish;
    if (timed) {
      endAt = performance.now() + cfg.seconds * 1000;
      tick = setInterval(() => {
        if (!document.body.contains(el)) return clearInterval(tick);
        const left = Math.max(0, endAt - performance.now());
        const c = $('d-clock');
        if (c) {
          c.textContent = (left / 1000).toFixed(1) + 's';
          c.classList.toggle('alert', left < 10000);
        }
        if (left <= 0) finish();
      }, 100);
    }
    cleanup = () => {
      ended = true;
      clearInterval(tick);
    };
    ask();
  }

  /* ---------- shared UI bits ---------- */
  function seg(name, opts, cur) {
    return `<div class="seg" role="radiogroup" aria-label="${name}">${opts
      .map(
        ([v, l]) =>
          `<label class="seg-i"><input type="radio" name="${name}" value="${v}" ${String(v) === String(cur) ? 'checked' : ''}/><span>${l}</span></label>`
      )
      .join('')}</div>`;
  }
  const val = (root, name) => {
    const r = root.querySelector(`input[name="${name}"]:checked`);
    return r ? r.value : null;
  };

  function header(tab) {
    const m = Extras.mm();
    const sess = m.sessions;
    const tot = sess.reduce((a, s) => a + s.n, 0);
    const okc = sess.reduce((a, s) => a + s.ok, 0);
    const bs = m.bestStreak;
    return `
      <div class="page-head">
        <h1>Mental maths</h1>
        <p>Speed is half of the ESAT. These drills build the instant recall that frees up your time for the hard bit of each question.</p>
      </div>
      ${Extras.memoryOnly ? '<div class="banner">Storage is unavailable in this frame, so mental-maths progress will not be kept after a reload.</div>' : ''}
      <div class="grid cols-4 mm-stats" style="margin-bottom:var(--space-5)">
        <div class="stat"><div class="k">Answers drilled</div><div class="v">${tot}</div></div>
        <div class="stat"><div class="k">Accuracy</div><div class="v">${tot ? Math.round((100 * okc) / tot) + '%' : '—'}</div></div>
        <div class="stat"><div class="k">Best streak · tables</div><div class="v">${bs.tables || 0}</div></div>
        <div class="stat"><div class="k">Best streak · powers / triples</div><div class="v">${bs.powers || 0} / ${bs.triples || 0}</div></div>
      </div>
      <nav class="sub-tabs" aria-label="Mental maths sections">
        ${TABS.map(([id, l]) => `<a href="#/mental/${id}" ${id === tab ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
      </nav>
      <div id="mm-body"></div>`;
  }

  /* ================= TIMES TABLES ================= */
  function tablesTab(body) {
    const cfgS = JSON.parse(JSON.stringify(Extras.state.mm.cfgTables || {}));
    const S = Object.assign({ max: 12, mode: 'untimed', focus: 'all', div: false, secs: 60 }, cfgS);

    function pairs(max) {
      const out = [];
      for (let a = 2; a <= max; a++) for (let b = a; b <= max; b++) out.push([a, b]);
      return out;
    }

    function settings() {
      body.innerHTML = `
        <div class="grid cols-2">
          <div class="card">
            <h3>Start a round</h3>
            <div class="field-row"><label class="field">Tables up to</label>
              <select id="t-max" class="sel" aria-label="Tables up to">${[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                .map((v) => `<option value="${v}" ${v === S.max ? 'selected' : ''}>${v} × ${v}</option>`)
                .join('')}</select></div>
            <div class="field-row"><label class="field">Mode</label>
              ${seg('t-mode', [['untimed', 'Untimed · 20 questions'], ['timed', 'Timed sprint']], S.mode)}</div>
            <div class="field-row" id="t-secs-row" style="${S.mode === 'timed' ? '' : 'display:none'}"><label class="field">Sprint length</label>
              ${seg('t-secs', [[30, '30s'], [60, '60s'], [120, '2 min']], S.secs)}</div>
            <div class="field-row"><label class="field">Questions from</label>
              ${seg('t-focus', [['all', 'Everything'], ['weak', 'Weak spots only']], S.focus)}</div>
            <label class="switch"><input type="checkbox" id="t-div" ${S.div ? 'checked' : ''}/><span>Mix in division (e.g. 91 ÷ 7)</span></label>
            <div class="row" style="margin-top:var(--space-5)"><button class="btn btn-primary" id="t-go">Start</button>
              <span class="muted" id="t-note" style="font-size:var(--text-xs)"></span></div>
          </div>
          <div class="card">
            <h3>Your grid</h3>
            <p class="muted" style="font-size:var(--text-xs);margin-bottom:var(--space-3)">Each square is one pair, up to 20 × 20. Cyan is solid, amber is slow or shaky, red is a weak spot, grey is unseen.</p>
            <div id="t-heat"></div>
            <div class="legend heat-legend"><span><i class="hl hl0"></i>unseen</span><span><i class="hl hl1"></i>solid</span><span><i class="hl hl2"></i>shaky / slow</span><span><i class="hl hl3"></i>weak</span></div>
            <div id="t-weak"></div>
          </div>
        </div>
        <div id="t-run" style="margin-top:var(--space-5)"></div>`;
      heat();
      body.querySelectorAll('input[name="t-mode"]').forEach((r) => {
        r.onchange = () => {
          body.querySelector('#t-secs-row').style.display = val(body, 't-mode') === 'timed' ? '' : 'none';
        };
      });
      body.querySelector('#t-go').onclick = go;
    }

    function heat() {
      const P = Extras.mm().pairs;
      let h = '<div class="heat-wrap"><div class="heat" style="grid-template-columns:repeat(19,1fr)">';
      for (let a = 2; a <= 20; a++) {
        for (let b = 2; b <= 20; b++) {
          const r = P[Extras.pairKey(a, b)];
          const c = !r ? 0 : isWeak(r) ? 3 : avg(r) > 3500 ? 2 : 1;
          const t = r ? `${a} × ${b}: ${r.ok}/${r.n} right, avg ${(avg(r) / 1000).toFixed(1)}s` : `${a} × ${b}: unseen`;
          h += `<button class="hc hl${c}" data-t="${esc(t)}" aria-label="${esc(t)}"></button>`;
        }
      }
      h += '</div></div><div class="muted heat-read" id="t-read" aria-live="polite">Tap a square for details.</div>';
      body.querySelector('#t-heat').innerHTML = h;
      body.querySelectorAll('.hc').forEach((b) => {
        b.onclick = () => (body.querySelector('#t-read').textContent = b.dataset.t);
      });
      const wk = weakKeys(P);
      body.querySelector('#t-weak').innerHTML = wk.length
        ? `<p style="margin-top:var(--space-4)"><b>Weak spots</b> <span class="muted">(${wk.length})</span><br>${wk
            .slice(0, 14)
            .map((k) => `<span class="chip bad-chip">${esc(k.replace('×', ' × '))}</span>`)
            .join(' ')}</p>`
        : '<p class="muted" style="margin-top:var(--space-4)">No weak spots recorded yet. Play a round and they will appear here.</p>';
    }

    function go() {
      S.max = +body.querySelector('#t-max').value;
      S.mode = val(body, 't-mode');
      S.secs = +(val(body, 't-secs') || 60);
      S.focus = val(body, 't-focus');
      S.div = body.querySelector('#t-div').checked;
      Extras.mm().cfgTables = S;
      Extras.save();
      const P = Extras.mm().pairs;
      let pool = pairs(S.max);
      if (S.focus === 'weak') {
        const wk = new Set(weakKeys(P));
        const wp = pool.filter(([a, b]) => wk.has(Extras.pairKey(a, b)));
        if (!wp.length) {
          body.querySelector('#t-note').textContent =
            'No weak spots in that range yet, so play an "Everything" round first.';
          return;
        }
        pool = wp;
      }
      runDrill({
        el: body.querySelector('#t-run'),
        kind: 'tables',
        mode: S.mode,
        count: 20,
        seconds: S.secs,
        label: `up to ${S.max}${S.focus === 'weak' ? ' · weak' : ''}`,
        onDone: () => {
          stop();
          settings();
        },
        next() {
          let [a, b] = pick(pool);
          if (Math.random() < 0.5) [a, b] = [b, a];
          const key = Extras.pairKey(a, b);
          if (S.div && Math.random() < 0.3) {
            return { prompt: `${a * b} ÷ ${a}`, answer: b, key, bucket: 'pairs' };
          }
          return { prompt: `${a} × ${b}`, answer: a * b, key, bucket: 'pairs' };
        },
      });
      body.querySelector('#t-run').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    settings();
  }

  /* ================= SQUARES & CUBES ================= */
  const SUP = { 2: '²', 3: '³' };
  function powersTab(body) {
    const S = Object.assign({ deck: 'sq', quiz: 'mix', mode: 'untimed', secs: 60 }, Extras.mm().cfgPowers || {});

    function cards() {
      const out = [];
      if (S.deck !== 'cu') for (let i = 1; i <= 30; i++) out.push({ id: 'sq:' + i, f: `${i}${SUP[2]}`, b: i * i });
      if (S.deck !== 'sq') for (let i = 1; i <= 15; i++) out.push({ id: 'cu:' + i, f: `${i}${SUP[3]}`, b: i * i * i });
      return out;
    }

    function settings() {
      body.innerHTML = `
        <div class="grid cols-2">
          <div class="card" id="p-flash"></div>
          <div class="card">
            <h3>Quick-fire quiz</h3>
            <div class="field-row"><label class="field">Questions</label>
              ${seg('p-quiz', [['sq', 'Squares'], ['cu', 'Cubes'], ['rt', 'Roots'], ['mix', 'Everything']], S.quiz)}</div>
            <div class="field-row"><label class="field">Mode</label>
              ${seg('p-mode', [['untimed', 'Untimed · 20'], ['timed', 'Timed sprint']], S.mode)}</div>
            <div class="field-row" id="p-secs-row" style="${S.mode === 'timed' ? '' : 'display:none'}"><label class="field">Sprint length</label>
              ${seg('p-secs', [[30, '30s'], [60, '60s'], [120, '2 min']], S.secs)}</div>
            <div class="row" style="margin-top:var(--space-4)">
              <button class="btn btn-primary" id="p-go">Start</button>
              <button class="btn" id="p-weak">Weak spots only</button></div>
            <p class="muted" id="p-note" style="font-size:var(--text-xs);margin-top:var(--space-3)"></p>
            <h3 style="margin-top:var(--space-6)">Shortcuts worth knowing</h3>
            <ul class="tips">
              <li>Ending in 5: $n5^2$ = $n(n+1)$ then 25, so $35^2 = 3\\times4 = 12$, then 25 gives 1225.</li>
              <li>Near a round number: $29^2 = (30-1)^2 = 900-60+1 = 841$.</li>
              <li>Difference of two squares: $23\\times17 = 20^2-3^2 = 391$.</li>
              <li>$\\sqrt{2}\\approx1.41$, $\\sqrt{3}\\approx1.73$, $\\sqrt{5}\\approx2.24$, $\\pi\\approx3.14$.</li>
            </ul>
          </div>
        </div>
        <div id="p-run" style="margin-top:var(--space-5)"></div>
        <div class="card" style="margin-top:var(--space-5)">
          <h3>Reference tables</h3>
          <div class="grid cols-2">
            <div><div class="muted" style="font-size:var(--text-xs);margin-bottom:var(--space-2)">SQUARES 1–30</div>
              <div class="reftab">${Array.from({ length: 30 }, (_, i) => `<span class="mono"><b>${i + 1}</b>² = ${(i + 1) ** 2}</span>`).join('')}</div></div>
            <div><div class="muted" style="font-size:var(--text-xs);margin-bottom:var(--space-2)">CUBES 1–15</div>
              <div class="reftab">${Array.from({ length: 15 }, (_, i) => `<span class="mono"><b>${i + 1}</b>³ = ${(i + 1) ** 3}</span>`).join('')}</div></div>
          </div>
        </div>`;
      const tipsEl = body.querySelector('.tips');
      renderMD(tipsEl, Array.from(tipsEl.querySelectorAll('li')).map((l) => '- ' + l.textContent).join('\n'));
      flash();
      body.querySelectorAll('input[name="p-mode"]').forEach((r) => {
        r.onchange = () => (body.querySelector('#p-secs-row').style.display = val(body, 'p-mode') === 'timed' ? '' : 'none');
      });
      body.querySelector('#p-go').onclick = () => go(false);
      body.querySelector('#p-weak').onclick = () => go(true);
    }

    /* ---- flashcards ---- */
    function flash() {
      const host = body.querySelector('#p-flash');
      let deck = cards();
      let showUnknown = false;
      let idx = 0,
        flipped = false;
      const F = Extras.mm().flash;

      function order() {
        let d = cards();
        if (showUnknown) d = d.filter((c) => F[c.id] !== 'known');
        return shuffle(d);
      }
      deck = order();

      function draw() {
        if (!deck.length) {
          host.innerHTML = `<h3>Flashcards</h3><p>Every card in this deck is marked as known. Nice.</p>
            <button class="btn" id="f-reset">Reset this deck</button>`;
          host.querySelector('#f-reset').onclick = () => {
            cards().forEach((c) => delete F[c.id]);
            Extras.save();
            showUnknown = false;
            deck = order();
            idx = 0;
            draw();
          };
          return;
        }
        const c = deck[idx % deck.length];
        const known = cards().filter((x) => F[x.id] === 'known').length;
        host.innerHTML = `
          <div class="row" style="justify-content:space-between"><h3>Flashcards</h3>
            <span class="muted mono" style="font-size:var(--text-xs)">${known}/${cards().length} known</span></div>
          <div class="row" style="margin:var(--space-3) 0">
            ${seg('f-deck', [['sq', 'Squares'], ['cu', 'Cubes'], ['both', 'Both']], S.deck)}
            <label class="switch"><input type="checkbox" id="f-unk" ${showUnknown ? 'checked' : ''}/><span>Unknown only</span></label></div>
          <button class="flashcard ${flipped ? 'is-flipped' : ''}" id="f-card" aria-label="Flip card. ${flipped ? 'Answer ' + c.b : 'Question ' + c.f}">
            <span class="fc-face fc-front mono">${c.f}</span>
            <span class="fc-face fc-back mono">${c.b}</span>
          </button>
          <div class="row" style="justify-content:center;margin-top:var(--space-3)">
            <button class="btn" id="f-again">Again</button>
            <button class="btn btn-primary" id="f-known">Got it</button>
          </div>
          <p class="muted" style="font-size:var(--text-xs);text-align:center;margin-top:var(--space-2)">Tap the card or press Space to flip</p>`;
        const card = host.querySelector('#f-card');
        card.onclick = () => {
          flipped = !flipped;
          card.classList.toggle('is-flipped', flipped);
        };
        card.onkeydown = (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            card.click();
          }
        };
        const nxt = (st) => {
          F[c.id] = st;
          Extras.save();
          flipped = false;
          idx += 1;
          if (idx >= deck.length) {
            deck = order();
            idx = 0;
          }
          draw();
        };
        host.querySelector('#f-known').onclick = () => nxt('known');
        host.querySelector('#f-again').onclick = () => nxt('again');
        host.querySelector('#f-unk').onchange = (e) => {
          showUnknown = e.target.checked;
          deck = order();
          idx = 0;
          flipped = false;
          draw();
        };
        host.querySelectorAll('input[name="f-deck"]').forEach((r) => {
          r.onchange = () => {
            S.deck = val(host, 'f-deck');
            deck = order();
            idx = 0;
            flipped = false;
            draw();
          };
        });
      }
      draw();
    }

    /* ---- quiz ---- */
    function makeItem(kind, key) {
      const n = key ? +key.split(':')[1] : null;
      if (kind === 'rt') kind = Math.random() < 0.6 ? 'sr' : 'cr';
      if (kind === 'sq') {
        const v = n || 1 + rnd(30);
        return { prompt: `${v}²`, answer: v * v, key: 'sq:' + v, bucket: 'sq' };
      }
      if (kind === 'cu') {
        const v = n || 1 + rnd(15);
        return { prompt: `${v}³`, answer: v * v * v, key: 'cu:' + v, bucket: 'sq' };
      }
      if (kind === 'sr') {
        const v = n || 1 + rnd(30);
        return { prompt: `√${v * v}`, answer: v, key: 'rt:' + v, bucket: 'sq' };
      }
      const v = n || 1 + rnd(15);
      return { prompt: `∛${v * v * v}`, answer: v, key: 'cr:' + v, bucket: 'sq' };
    }
    function go(weakOnly) {
      S.quiz = val(body, 'p-quiz');
      S.mode = val(body, 'p-mode');
      S.secs = +(val(body, 'p-secs') || 60);
      Extras.mm().cfgPowers = S;
      Extras.save();
      const wk = weakKeys(Extras.mm().sq);
      if (weakOnly && !wk.length) {
        body.querySelector('#p-note').textContent = 'No weak spots recorded yet. Play a normal round first.';
        return;
      }
      const kinds = S.quiz === 'mix' ? ['sq', 'cu', 'rt'] : [S.quiz];
      runDrill({
        el: body.querySelector('#p-run'),
        kind: 'powers',
        mode: S.mode,
        count: 20,
        seconds: S.secs,
        label: weakOnly ? 'weak spots' : S.quiz,
        onDone: () => {
          stop();
          settings();
        },
        next() {
          if (weakOnly) {
            const k = pick(wk);
            const t = k.split(':')[0];
            return makeItem(t === 'rt' ? 'sr' : t, k);
          }
          return makeItem(pick(kinds));
        },
      });
      body.querySelector('#p-run').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    settings();
  }

  /* ================= PASCAL ================= */
  const nCr = (n, r) => {
    let x = 1n;
    for (let i = 1n; i <= BigInt(r); i++) x = (x * (BigInt(n) - i + 1n)) / i;
    return x;
  };
  function pascalTab(body) {
    const MAXR = 12;
    const S = { n: 5, k: null, a: 1, b: 1, sym: true, x: 'x' };
    body.innerHTML = `
      <div class="grid cols-2" style="align-items:start">
        <div class="card">
          <div class="row" style="justify-content:space-between"><h3>Pascal's triangle</h3>
            <label class="muted" style="font-size:var(--text-xs)">Rows shown
              <select id="pa-rows" class="sel">${[6, 8, 10, 12].map((v) => `<option value="${v}" ${v === 10 ? 'selected' : ''}>0–${v}</option>`).join('')}</select></label></div>
          <p class="muted" style="font-size:var(--text-xs)">Tap any number to see where it comes from. Tapping also sets the row used in the expansion on the right.</p>
          <div id="pa-tri" class="pascal" role="grid" aria-label="Pascal's triangle"></div>
          <div id="pa-info" class="pa-info" aria-live="polite"></div>
        </div>
        <div class="card">
          <h3>Binomial expansion</h3>
          <div class="field-row"><label class="field">Form</label>
            ${seg('pa-form', [['sym', '(a + b)ⁿ'], ['num', '(px + q)ⁿ']], 'sym')}</div>
          <div class="row" id="pa-pq" style="display:none;margin:var(--space-3) 0">
            <label class="muted">p <input class="num-in" id="pa-p" type="number" min="-9" max="9" value="2"></label>
            <label class="muted">q <input class="num-in" id="pa-q" type="number" min="-9" max="9" value="3"></label>
            <button class="btn btn-sm" id="pa-1x">(1 + x)ⁿ</button>
            <button class="btn btn-sm" id="pa-1mx">(1 − x)ⁿ</button></div>
          <div class="row" style="margin:var(--space-3) 0"><label class="muted">Power n
            <input class="num-in" id="pa-n" type="number" min="0" max="12" value="5"></label>
            <label class="muted">Find the term in <span id="pa-tl">b</span>ʳ, r =
            <select id="pa-r" class="sel"></select></label></div>
          <div id="pa-exp" class="pa-exp"></div>
          <div id="pa-term" class="pa-term"></div>
          <ul class="tips" id="pa-facts"></ul>
        </div>
      </div>`;
    let rows = 10;
    const tri = body.querySelector('#pa-tri');

    function drawTri() {
      tri.innerHTML = '';
      for (let n = 0; n <= rows; n++) {
        const r = document.createElement('div');
        r.className = 'pa-row';
        r.setAttribute('role', 'row');
        for (let k = 0; k <= n; k++) {
          const b = document.createElement('button');
          b.className = 'pa-c';
          b.textContent = nCr(n, k).toString();
          b.dataset.n = n;
          b.dataset.k = k;
          b.setAttribute('role', 'gridcell');
          b.setAttribute('aria-label', `row ${n}, position ${k}, value ${nCr(n, k)}`);
          b.onclick = () => select(n, k);
          r.appendChild(b);
        }
        tri.appendChild(r);
      }
      mark();
    }
    function mark() {
      tri.querySelectorAll('.pa-c').forEach((c) => {
        const n = +c.dataset.n,
          k = +c.dataset.k;
        c.classList.toggle('is-sel', S.k !== null && n === S.n && k === S.k);
        c.classList.toggle('is-parent', S.k !== null && n === S.n - 1 && (k === S.k - 1 || k === S.k));
        c.classList.toggle('in-row', n === S.n);
      });
    }
    function select(n, k) {
      S.n = n;
      S.k = k;
      body.querySelector('#pa-n').value = n;
      refreshR();
      body.querySelector('#pa-r').value = k;
      info();
      expansion();
      mark();
    }
    function info() {
      const el = body.querySelector('#pa-info');
      if (S.k === null) {
        el.textContent = '';
        return;
      }
      const { n, k } = S;
      const v = nCr(n, k);
      let s = `$\\binom{${n}}{${k}} = \\dfrac{${n}!}{${k}!\\,${n - k}!} = ${v}$`;
      if (n > 0 && k > 0 && k < n)
        s += ` &nbsp;and it is the sum of the two above: $${nCr(n - 1, k - 1)} + ${nCr(n - 1, k)} = ${v}$`;
      else s += ' &nbsp;(every edge number is 1)';
      renderMD(el, s);
    }
    function refreshR() {
      const sel = body.querySelector('#pa-r');
      sel.innerHTML = Array.from({ length: S.n + 1 }, (_, i) => `<option value="${i}">${i}</option>`).join('');
    }
    const sgn = (v) => (v < 0 ? '-' : '+');
    function coefTerm(n, k, p, q) {
      // coefficient of x^(n-k) in (px+q)^n  -> C(n,k) p^(n-k) q^k
      return nCr(n, k) * BigInt(p) ** BigInt(n - k) * BigInt(q) ** BigInt(k);
    }
    function expansion() {
      const n = Math.max(0, Math.min(12, +body.querySelector('#pa-n').value || 0));
      S.n = n;
      const sym = val(body, 'pa-form') === 'sym';
      const p = +body.querySelector('#pa-p').value || 0;
      const q = +body.querySelector('#pa-q').value || 0;
      const r = Math.min(n, +body.querySelector('#pa-r').value || 0);
      let tex = '';
      const parts = [];
      for (let k = 0; k <= n; k++) {
        let sign = '+',
          mag;
        if (sym) {
          const c = nCr(n, k);
          const A = n - k,
            B = k;
          mag = (c === 1n ? '' : c.toString()) + (A ? `a${A > 1 ? '^{' + A + '}' : ''}` : '') + (B ? `b${B > 1 ? '^{' + B + '}' : ''}` : '');
          if (!mag) mag = '1';
        } else {
          const c = coefTerm(n, k, p, q);
          const A = n - k;
          const abs = c < 0n ? -c : c;
          sign = c < 0n ? '-' : '+';
          mag = abs === 1n && A > 0 ? '' : abs.toString();
          if (A) mag += `x${A > 1 ? '^{' + A + '}' : ''}`;
          if (!mag) mag = '1';
        }
        if (k === r) mag = `\\boxed{${mag}}`;
        parts.push({ sign, mag });
      }
      const body_ = parts.map((t, i) => (i === 0 ? (t.sign === '-' ? '-' : '') : ` ${t.sign} `) + t.mag).join('');
      if (sym) tex = `(a+b)^{${n}} = ` + body_;
      else {
        const pp = p === 1 ? '' : p === -1 ? '-' : p;
        tex = `(${pp}x${q < 0 ? '-' : '+'}${Math.abs(q)})^{${n}} = ` + body_;
      }
      const exp = body.querySelector('#pa-exp');
      renderMD(exp, `$$${tex}$$`);
      const tEl = body.querySelector('#pa-term');
      if (sym) {
        renderMD(tEl, `Term ${r + 1} (r = ${r}): $\\binom{${n}}{${r}}a^{${n - r}}b^{${r}} = ${nCr(n, r)}\\,a^{${n - r}}b^{${r}}$`);
      } else {
        const c = coefTerm(n, r, p, q);
        renderMD(
          tEl,
          `Coefficient of $x^{${n - r}}$: $\\binom{${n}}{${r}}(${p})^{${n - r}}(${q})^{${r}} = ${nCr(n, r)}\\times${BigInt(p) ** BigInt(n - r)}\\times${BigInt(q) ** BigInt(r)} = \\mathbf{${c}}$`
        );
      }
      body.querySelector('#pa-tl').textContent = sym ? 'b' : 'q';
      const facts = [
        `Row ${n} adds up to $2^{${n}} = ${2 ** n}$ (put $a=b=1$).`,
        n <= 4 ? `Row ${n} read as digits is $11^{${n}} = ${11 ** n}$.` : `Rows 0–4 are the digits of the powers of 11: 1, 11, 121, 1331, 14641.`,
        `There are ${n + 1} terms and the coefficients are symmetric: $\\binom{n}{k}=\\binom{n}{n-k}$.`,
        `ESAT form: $(1+x)^n = 1 + nx + \\dfrac{n(n-1)}{2}x^2 + \\dots$ — the second and third coefficients are the quick ones to remember.`,
      ];
      const f = body.querySelector('#pa-facts');
      renderMD(f, facts.map((x) => '- ' + x).join('\n'));
      tri.querySelectorAll('.pa-c').forEach((c) => c.classList.toggle('in-row', +c.dataset.n === n));
    }
    body.querySelector('#pa-rows').onchange = (e) => {
      rows = +e.target.value;
      drawTri();
    };
    body.querySelector('#pa-n').oninput = () => {
      S.k = null;
      refreshR();
      info();
      expansion();
      mark();
    };
    ['pa-p', 'pa-q', 'pa-r'].forEach((id) => (body.querySelector('#' + id).oninput = expansion));
    body.querySelector('#pa-r').onchange = expansion;
    body.querySelectorAll('input[name="pa-form"]').forEach(
      (r) =>
        (r.onchange = () => {
          body.querySelector('#pa-pq').style.display = val(body, 'pa-form') === 'num' ? '' : 'none';
          expansion();
        })
    );
    body.querySelector('#pa-1x').onclick = () => {
      body.querySelector('#pa-p').value = 1;
      body.querySelector('#pa-q').value = 1;
      body.querySelector('input[name="pa-form"][value="num"]').checked = true;
      expansion();
    };
    body.querySelector('#pa-1mx').onclick = () => {
      body.querySelector('#pa-p').value = -1;
      body.querySelector('#pa-q').value = 1;
      body.querySelector('input[name="pa-form"][value="num"]').checked = true;
      expansion();
    };
    drawTri();
    refreshR();
    expansion();
  }

  /* ================= PYTHAGOREAN TRIPLES ================= */
  function triplesTab(body) {
    const S = { k: 1, secs: 60, mode: 'untimed', kind: 'mix', big: false };
    const stored = Extras.mm().cfgTriples;
    if (stored) Object.assign(S, stored);

    function triSVG(a, b, c, miss) {
      const lab = (v, i) => (i === miss ? '?' : v);
      return `<svg class="tri-svg" viewBox="0 0 220 130" aria-hidden="true">
        <path d="M20 110 H170 V25 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M158 110 v-12 h12" fill="none" stroke="currentColor" stroke-width="1.4"/>
        <text x="95" y="126" text-anchor="middle" class="tl">${lab(a, 0)}</text>
        <text x="186" y="72" text-anchor="start" class="tl">${lab(b, 1)}</text>
        <text x="84" y="58" text-anchor="end" class="tl">${lab(c, 2)}</text>
      </svg>`;
    }

    function allTriples() {
      const out = [];
      CORE_TRIPLES.forEach((t) => {
        for (let k = 1; k <= 5; k++) {
          if (t[2] * k <= 100) out.push(t.map((v) => v * k));
        }
      });
      if (S.big) MORE_TRIPLES.forEach((t) => out.push(t));
      return out;
    }
    function isTriple(a, b, c) {
      return a * a + b * b === c * c;
    }
    function fakeTriple(real) {
      for (let tries = 0; tries < 50; tries++) {
        let [a, b, c] = real.slice();
        const m = rnd(3);
        const d = pick([-2, -1, 1, 2, 3]);
        if (m === 0) a += d;
        else if (m === 1) b += d;
        else c += d;
        if (a > 0 && b > 0 && c > 0 && !isTriple(a, b, c) && !isTriple(b, a, c)) return [a, b, c];
      }
      return [real[0] + 1, real[1], real[2]];
    }

    function settings() {
      const rows = CORE_TRIPLES.concat(S.big ? MORE_TRIPLES : []);
      body.innerHTML = `
        <div class="grid cols-2" style="align-items:start">
          <div class="card">
            <h3>The ones to know</h3>
            <div class="row" style="margin:var(--space-3) 0">
              <label class="muted">Multiplier ${seg('tr-k', [[1, '×1'], [2, '×2'], [3, '×3'], [4, '×4'], [5, '×5']], S.k)}</label></div>
            <label class="switch"><input type="checkbox" id="tr-big" ${S.big ? 'checked' : ''}/><span>Also show rarer triples (9-40-41, 12-35-37…)</span></label>
            <div class="trip-grid" style="margin-top:var(--space-3)">
              ${rows
                .map(
                  (t) => `<div class="trip mono"><b>${t.map((v) => v * S.k).join(' · ')}</b>
                    <span class="muted">${t[0] * S.k}² + ${t[1] * S.k}² = ${(t[0] * S.k) ** 2 + (t[1] * S.k) ** 2} = ${t[2] * S.k}²</span></div>`
                )
                .join('')}
            </div>
            <p class="muted" style="font-size:var(--text-xs);margin-top:var(--space-3)">Spot a hidden multiple: 0.6, 0.8, 1 is 3-4-5 scaled; 9, 12, 15 is 3-4-5 × 3. A hypotenuse of 25 might be 7-24-25 or 15-20-25.</p>
          </div>
          <div class="card">
            <h3>Spot the triple</h3>
            <div class="field-row"><label class="field">Drill</label>
              ${seg('tr-kind', [['mix', 'Mixed'], ['spot', 'Pick the triple'], ['miss', 'Find the missing side']], S.kind)}</div>
            <div class="field-row"><label class="field">Mode</label>
              ${seg('tr-mode', [['untimed', 'Untimed · 15'], ['timed', 'Timed sprint']], S.mode)}</div>
            <div class="field-row" id="tr-secs-row" style="${S.mode === 'timed' ? '' : 'display:none'}"><label class="field">Sprint length</label>
              ${seg('tr-secs', [[30, '30s'], [60, '60s'], [120, '2 min']], S.secs)}</div>
            <div class="row" style="margin-top:var(--space-4)"><button class="btn btn-primary" id="tr-go">Start</button></div>
          </div>
        </div>
        <div id="tr-run" style="margin-top:var(--space-5)"></div>`;
      body.querySelectorAll('input[name="tr-k"]').forEach((r) => {
        r.onchange = () => {
          S.k = +val(body, 'tr-k');
          settings();
        };
      });
      body.querySelector('#tr-big').onchange = (e) => {
        S.big = e.target.checked;
        settings();
      };
      body.querySelectorAll('input[name="tr-mode"]').forEach((r) => {
        r.onchange = () => (body.querySelector('#tr-secs-row').style.display = val(body, 'tr-mode') === 'timed' ? '' : 'none');
      });
      body.querySelector('#tr-go').onclick = go;
    }

    function go() {
      S.kind = val(body, 'tr-kind');
      S.mode = val(body, 'tr-mode');
      S.secs = +(val(body, 'tr-secs') || 60);
      Extras.mm().cfgTriples = S;
      Extras.save();
      const pool = allTriples();
      runDrill({
        el: body.querySelector('#tr-run'),
        kind: 'triples',
        mode: S.mode,
        count: 15,
        seconds: S.secs,
        label: S.kind,
        onDone: () => {
          stop();
          settings();
        },
        next() {
          const real = pick(pool);
          const key = 'tri:' + CORE_TRIPLES.concat(MORE_TRIPLES).find((c) => real[2] % c[2] === 0 && real[0] / c[0] === real[2] / c[2] && real[1] / c[1] === real[2] / c[2])?.join('-');
          const kind = S.kind === 'mix' ? pick(['spot', 'miss']) : S.kind;
          if (kind === 'miss') {
            // randomly hide one side; legs in either order
            let [a, b, c] = real;
            if (Math.random() < 0.5) [a, b] = [b, a];
            const m = pick([0, 1, 2]);
            const ans = [a, b, c][m];
            const show = [a, b, c].map((v, i) => (i === m ? '?' : v));
            return {
              prompt: `${triSVG(a, b, c, m)}<div class="tri-cap">Right-angled triangle, hypotenuse on the slope. Find <b>?</b></div>`,
              answer: ans,
              key,
              bucket: 'tri',
              hint: `${a}² + ${b}² = ${c}²`,
            };
          }
          const fakes = new Set();
          while (fakes.size < 3) fakes.add(fakeTriple(real).join(', '));
          const real_s = real.join(', ');
          const choices = shuffle([{ label: real_s, ok: true }, ...[...fakes].map((f) => ({ label: f, ok: false }))]);
          return {
            prompt: `Which of these is the side lengths of a right-angled triangle?`,
            answer: real_s,
            key,
            bucket: 'tri',
            choices,
            hint: `It is ${real_s}: ${real[0]}² + ${real[1]}² = ${real[2]}².`,
          };
        },
      });
      body.querySelector('#tr-run').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    settings();
  }

  /* ---------- entry ---------- */
  function view(sub) {
    stop();
    const tab = TABS.some(([id]) => id === sub) ? sub : 'tables';
    window.view = window.view || document.getElementById('view');
    document.getElementById('view').innerHTML = header(tab);
    const body = document.getElementById('mm-body');
    ({ tables: tablesTab, powers: powersTab, pascal: pascalTab, triples: triplesTab })[tab](body);
  }

  return { view, stop };
})();

function viewMental(sub) {
  MM.view(sub);
}
