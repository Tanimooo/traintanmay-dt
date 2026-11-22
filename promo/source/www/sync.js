// Staged "sign in & sync" moment for the ad. Intercepts the real sign-in buttons so no Google window opens.
(() => {
  const S = ms => new Promise(r => setTimeout(r, ms));
  const ico = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="#07051a" stroke-width="1.8"><rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="#ff4f96"/><circle cx="12" cy="18.3" r="1" fill="#07051a"/></svg>',
    laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="#07051a" stroke-width="1.8"><rect x="4" y="5" width="16" height="11" rx="1.5" fill="#4a8dff"/><path d="M2 19h20"/></svg>',
    school: '<svg viewBox="0 0 24 24" fill="none" stroke="#07051a" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="1.5" fill="#3ddc84"/><path d="M9 20h6M12 16v4"/></svg>',
  };
  async function run() {
    document.querySelector('.tts-nudge')?.remove();
    const o = document.createElement('div'); o.id = 'tt-sync';
    o.innerHTML = `<div class="card"><h3 id="tth"><span class="spin"></span>Signing in…</h3><p class="sub" id="tts">Connecting to your Google account</p>
      <div class="who" id="ttw"><div class="av">A</div><div><b>Hi, Alex!</b><span>Signed in · progress is syncing</span></div></div>
      <div class="devs">${[['phone', 'Your phone'], ['laptop', 'Your laptop'], ['school', 'School computer']].map(([k, n]) =>
        `<div class="dev" data-d="${k}">${ico[k]}<div class="n">${n}</div><div class="bar"><i></i></div><div class="ok">✓ Synced</div></div>`).join('')}</div>
      <button id="tt-sync-ok" type="button">Let's go →</button></div>`;
    document.body.appendChild(o);
    await S(30); o.classList.add('on');
    await S(1300);
    document.getElementById('tth').textContent = 'You\'re signed in ✓';
    document.getElementById('tts').textContent = 'Everything you do now follows you everywhere.';
    document.getElementById('ttw').classList.add('on');
    for (const d of o.querySelectorAll('.dev')) { await S(450); d.classList.add('on'); await S(150); d.classList.add('done'); }
    await S(900); o.querySelector('button').classList.add('on');
    o.querySelector('button').onclick = () => {
      o.classList.remove('on'); setTimeout(() => o.remove(), 400);
      document.querySelectorAll('[data-tt-account]').forEach(b => { b.classList.add('tt-avbtn'); b.innerHTML = '<i>A</i><span>Synced</span>'; });
    };
  }
  addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('[data-tt-signin],[data-tt-account]');
    if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); run();
  }, true);
})();
