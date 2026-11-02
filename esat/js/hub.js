/* ============================================================
   Revision hub — "Know Before You Sit".
   Tabs, search, one-tap "learned", cram mode, printable cheat sheet.
   Progress lives in Extras (its own storage key).
   ============================================================ */
'use strict';

let SPEC = null; // data/spec.json, loaded on first visit

async function loadSpec() {
  if (SPEC) return SPEC;
  try {
    SPEC = await (await fetch('data/spec.json')).json();
  } catch (e) {
    SPEC = {};
  }
  return SPEC;
}

function specItems() {
  const out = [];
  if (!SPEC) return out;
  const names = { maths1: 'Maths 1', maths2: 'Maths 2', physics: 'Physics' };
  Object.keys(SPEC).forEach((s) => {
    (SPEC[s].groups || []).forEach((g) => {
      g.items.forEach((it) => {
        out.push({
          id: 'sp:' + it.code,
          tab: 'sp',
          subj: s,
          sec: `${names[s] || s} · ${g.code} ${g.name}`,
          t: it.code,
          text: it.text,
        });
      });
    });
  });
  return out;
}

const HUB_PRINT = [
  ['m1', 'Maths 1'],
  ['m2', 'Maths 2'],
  ['ph', 'Physics & units'],
  ['all', 'Everything'],
];

async function viewHub(sub, extra) {
  await loadSpec();
  const H = Extras.hub();
  const el = document.getElementById('view');
  const isPrint = sub === 'print';
  const tab = HUB_TABS.some(([id]) => id === sub) ? sub : isPrint ? 'print' : HUB_TABS.some(([id]) => id === H.tab) ? H.tab : 'm1';
  if (!isPrint) Extras.setHub('tab', tab);

  const all = HUB_ITEMS.concat(specItems());
  const inTab = (t) => all.filter((i) => (t === 'ph' ? i.tab === 'ph' : i.tab === t));
  const counts = (items) => {
    const l = items.filter((i) => Extras.isLearned(i.id)).length;
    return { l, n: items.length };
  };

  if (isPrint) return printSheet(el, all, extra);

  const tot = counts(all);
  const bar = (c) =>
    `<div class="meter hub-meter" role="img" aria-label="${c.l} of ${c.n} learned"><span style="width:${c.n ? (100 * c.l) / c.n : 0}%"></span></div>`;

  el.innerHTML = `
    <div class="page-head">
      <h1>Know before you sit</h1>
      <p>Everything worth having in your head on the day: formulas, units, constants and the official content list. Tick things off as you learn them.</p>
    </div>
    ${Extras.memoryOnly ? '<div class="banner">Storage is unavailable in this frame, so your ticks will not be kept after a reload.</div>' : ''}
    <div class="card hub-top">
      <div class="hub-prog">
        <div class="row" style="justify-content:space-between"><b>${tot.l} of ${tot.n} learned</b>
          <span class="muted mono">${tot.n ? Math.round((100 * tot.l) / tot.n) : 0}%</span></div>
        ${bar(tot)}
      </div>
      <div class="row hub-tools">
        <input id="hub-q" class="search" type="search" placeholder="Search formulas, e.g. discriminant, half-life, F = BIL" aria-label="Search the revision hub" />
        <label class="switch"><input type="checkbox" id="hub-cram" ${H.cram ? 'checked' : ''}/><span>Cram mode <small class="muted">(unlearned only)</small></span></label>
        <a class="btn btn-sm" href="#/hub/print">Printable cheat sheet</a>
      </div>
    </div>
    <nav class="sub-tabs" aria-label="Hub sections">
      ${HUB_TABS.map(([id, l]) => {
        const c = counts(inTab(id));
        return `<a href="#/hub/${id}" ${id === tab ? 'aria-current="page"' : ''}>${l} <span class="tab-n mono">${c.l}/${c.n}</span></a>`;
      }).join('')}
    </nav>
    <div id="hub-list" class="hub-list"></div>`;

  const list = el.querySelector('#hub-list');
  const q = el.querySelector('#hub-q');
  const cram = el.querySelector('#hub-cram');

  function card(it, showTab) {
    const done = Extras.isLearned(it.id);
    const tabName = (HUB_TABS.find((t) => t[0] === it.tab) || [])[1];
    const d = document.createElement('article');
    d.className = 'hub-card' + (done ? ' is-done' : '');
    d.dataset.id = it.id;
    d.innerHTML = `
      <header>
        <div>
          ${showTab ? `<span class="badge badge-primary">${tabName}</span> ` : ''}<span class="hub-sec">${esc(it.sec)}</span>
          <h3>${esc(it.t)}</h3>
        </div>
        <button class="learn-btn" aria-pressed="${done}" aria-label="${done ? 'Marked as learned. Tap to undo' : 'Mark as learned'}: ${esc(it.t)}">
          <span class="tick" aria-hidden="true">${done ? '✓' : ''}</span><span class="lbl">${done ? 'Learned' : 'Mark learned'}</span>
        </button>
      </header>
      <div class="hub-body"></div>`;
    const body = d.querySelector('.hub-body');
    if (it.md) renderMD(body, it.md);
    else {
      const full = it.text || '';
      const long = full.length > 260;
      body.innerHTML = `<p class="spec-text">${esc(long ? full.slice(0, 260).replace(/\s+\S*$/, '') + ' …' : full)}</p>${long ? '<button class="linkish more">Show full text</button>' : ''}`;
      if (long) {
        body.querySelector('.more').onclick = (e) => {
          body.querySelector('.spec-text').textContent = full;
          e.target.remove();
        };
      }
    }
    d.querySelector('.learn-btn').onclick = () => {
      Extras.setLearned(it.id, !Extras.isLearned(it.id));
      refresh(false);
    };
    return d;
  }

  function refresh(rebuildAll) {
    const query = q.value.trim().toLowerCase();
    const crammed = cram.checked;
    let items = query ? all : inTab(tab);
    if (query) {
      const terms = query.split(/\s+/);
      items = items.filter((i) => {
        const hay = (i.t + ' ' + i.sec + ' ' + (i.md || i.text || '')).toLowerCase().replace(/[\\${}]/g, '');
        return terms.every((t) => hay.includes(t));
      });
    }
    if (crammed) items = items.filter((i) => !Extras.isLearned(i.id));
    // update progress bar + tab counters without losing focus on the search box
    const c = counts(all);
    el.querySelector('.hub-prog').innerHTML = `<div class="row" style="justify-content:space-between"><b>${c.l} of ${c.n} learned</b>
      <span class="muted mono">${c.n ? Math.round((100 * c.l) / c.n) : 0}%</span></div>${bar(c)}`;
    el.querySelectorAll('.sub-tabs a').forEach((a, i) => {
      const cc = counts(inTab(HUB_TABS[i][0]));
      a.querySelector('.tab-n').textContent = `${cc.l}/${cc.n}`;
    });

    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = `<div class="empty"><h3>${crammed && !query ? 'Everything here is learned' : 'Nothing found'}</h3>
        <p>${crammed && !query ? 'Switch cram mode off to review it again, or pick another tab.' : 'Try a different word, or clear the search.'}</p></div>`;
      return;
    }
    let lastSec = null;
    const frag = document.createDocumentFragment();
    items.forEach((it) => {
      if (!query && it.sec !== lastSec) {
        lastSec = it.sec;
        const sec = items.filter((x) => x.sec === it.sec);
        const sc = counts(sec);
        const h = document.createElement('div');
        h.className = 'hub-secwrap';
        h.innerHTML = `<h2 class="hub-sech">${esc(it.sec)}</h2>
          <span class="muted mono" style="font-size:var(--text-xs)">${sc.l}/${sc.n}</span>
          <button class="linkish sec-all">${sc.l === sc.n ? 'Clear section' : 'Mark section learned'}</button>`;
        h.querySelector('.sec-all').onclick = () => {
          const everyone = sc.l === sc.n;
          sec.forEach((x) => Extras.setLearned(x.id, !everyone));
          refresh(false);
        };
        frag.appendChild(h);
      }
      frag.appendChild(card(it, !!query));
    });
    list.appendChild(frag);
  }

  q.oninput = () => refresh(true);
  cram.onchange = () => {
    Extras.setHub('cram', cram.checked);
    refresh(false);
  };
  refresh(true);
}

/* ---------------- printable one-page cheat sheet ---------------- */
function printSheet(el, all, which) {
  const H = Extras.hub();
  const sel = HUB_PRINT.some(([id]) => id === which) ? which : 'm1';
  const only = !!H.printUnlearned;
  const tabsFor = sel === 'all' ? ['m1', 'm2', 'ph', 'un'] : sel === 'ph' ? ['ph', 'un'] : [sel];
  const names = { m1: 'Maths 1', m2: 'Maths 2', ph: 'Physics', un: 'Units & constants' };

  el.innerHTML = `
    <div class="no-print">
      <div class="page-head"><h1>Cheat sheet</h1>
        <p>A compact, print-ready summary. Choose a module, then press Print (or save as PDF). Each module fits on one A4 page.</p></div>
      <div class="card row" style="margin-bottom:var(--space-5)">
        ${HUB_PRINT.map(([id, l]) => `<a class="btn btn-sm ${id === sel ? 'btn-primary' : ''}" href="#/hub/print/${id}">${l}</a>`).join('')}
        <label class="switch"><input type="checkbox" id="pr-un" ${only ? 'checked' : ''}/><span>Only items I have not learned</span></label>
        <button class="btn btn-primary" id="pr-go">Print</button>
        <a class="btn btn-ghost btn-sm" href="#/hub/${sel === 'all' ? 'm1' : sel}">Back to the hub</a>
      </div>
    </div>
    <div class="sheet" id="sheet"></div>`;
  const sheet = el.querySelector('#sheet');
  tabsFor.forEach((t, idx) => {
    let items = all.filter((i) => i.tab === t);
    if (only) items = items.filter((i) => !Extras.isLearned(i.id));
    const page = document.createElement('section');
    page.className = 'sheet-page';
    page.innerHTML = `<h2 class="sheet-h">${names[t]} <span>Know before you sit · TrainTanmay</span></h2><div class="sheet-cols"></div>`;
    const cols = page.querySelector('.sheet-cols');
    let lastSec = null;
    items.forEach((it) => {
      if (it.sec !== lastSec) {
        lastSec = it.sec;
        const h = document.createElement('div');
        h.className = 'sheet-sec';
        h.textContent = it.sec;
        cols.appendChild(h);
      }
      const b = document.createElement('div');
      b.className = 'sheet-item';
      b.innerHTML = `<b>${esc(it.t)}</b><div class="sheet-md"></div>`;
      renderMD(b.querySelector('.sheet-md'), it.md);
      cols.appendChild(b);
    });
    if (!items.length) cols.innerHTML = '<p>Nothing left to show — everything here is marked learned.</p>';
    sheet.appendChild(page);
  });
  el.querySelector('#pr-un').onchange = (e) => {
    Extras.setHub('printUnlearned', e.target.checked);
    viewHub('print', sel);
  };
  el.querySelector('#pr-go').onclick = () => window.print();
}
