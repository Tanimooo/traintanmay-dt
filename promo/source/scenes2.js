// Scenes for both formats. MODE=phone node scenes2.js <names>  (default: desktop)
const path = require('path');
const { startRecording, sleep, PHONE, W, H } = require('./rec');
const SITE = 'http://localhost:8765';
const AD = 'http://localhost:8766';
const NO_NUDGE = () => { try { sessionStorage.setItem('tt-cloud-nudge', '1'); } catch (e) {} };
const FAKE = { path: path.join(__dirname, 'www', 'fakecloud.js') };
const NOBLUR = () => { const add = () => { if (!document.head) return requestAnimationFrame(add); const s = document.createElement('style'); s.textContent = '.ttlg-back{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:rgba(5,6,14,.84)!important}'; document.head.appendChild(s); }; add(); };
const molBtn = (page, m) => page.locator('button').filter({ hasText: new RegExp('^\\s*' + m.replace(/\d/g, '\\s*$&') + '\\s*$') }).first();
const visible = async loc => (await loc.count()) && await loc.first().isVisible();

const scenes = {
  async chem() {
    const r = await startRecording('chem', { url: SITE + '/', init: [NO_NUDGE], seed: { cursor: PHONE ? [180, 300] : [640, 250] }, prep: () => sleep(1200) });
    const { page } = r;
    await sleep(PHONE ? 300 : 500);
    if (PHONE) {
      await r.moveTo('.world[data-go="dt"]', 450); await r.moveTo('.world[data-go="physics"]', 450);
      await r.reveal('.world[data-go="chemistry"]');
    } else {
      for (const w of ['dt', 'physics', 'maths', 'esat']) await r.moveTo(`.world[data-go="${w}"]`, 480);
    }
    await r.moveTo('.world[data-go="chemistry"] svg, .world[data-go="chemistry"]', 650);
    await sleep(300); await r.click(null);
    await page.waitForURL(/chemistry/); await page.waitForLoadState('networkidle').catch(() => {});
    await sleep(700);
    const hero = page.locator('.hero-scope');
    if (await visible(hero)) {
      if (PHONE) { await r.reveal(hero); await sleep(300); }
      await r.moveTo(hero, 800); await sleep(500); await r.click(hero, 300);
    } else { await page.evaluate(() => { location.hash = '#lab-shapes'; }); }
    await page.waitForSelector('text=3D shapes of molecules'); await sleep(400);
    if (!PHONE) {
      await r.scrollBy(300, 900);
      for (const m of ['CH4', 'H2O', 'SF6']) { const b = molBtn(page, m); await r.click(b, 650); await sleep(1000); }
      await r.click(page.locator('button', { hasText: 'Exam drawing' }).first(), 650); await sleep(1400);
    } else {
      // phone: the molecule sits below the tray, so scroll down to watch it after each tap
      await page.evaluate(() => { const c = [...document.querySelectorAll('canvas')].filter(c => c.offsetParent).sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0]; if (c) c.id = 'molcv'; });
      const showMol = async () => { await page.evaluate(() => { const c = document.getElementById('molcv'), b = c.getBoundingClientRect(); window.scrollBy({ top: b.top + b.height / 2 - innerHeight * 0.58, behavior: 'smooth' }); }); await sleep(800); };
      for (const m of ['H2O', 'SF6']) {
        const b = molBtn(page, m);
        await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find(x => /CO\s*2/.test(x.textContent)); const y = t.getBoundingClientRect().top; window.scrollBy({ top: y - 110, behavior: 'smooth' }); }); await sleep(750);
        await b.evaluate(el => el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })); await sleep(300);
        await r.click(b, 550); await sleep(250); await showMol(); await sleep(1100);
      }
      const ex = page.locator('button', { hasText: 'Exam drawing' }).first();
      await r.click(ex, 550); await sleep(1400);
    }
    await r.stop();
  },

  async login() {
    const r = await startRecording('login', {
      url: SITE + '/', seed: { cursor: PHONE ? [200, 300] : [700, 330] },
      prep: async p => {
        await p.waitForSelector('.tts-nudge', { timeout: 8000 }).catch(() => {});
        await p.addStyleTag({ url: AD + '/sync.css' }); await p.addScriptTag({ url: AD + '/sync.js' });
      }
    });
    await sleep(500);
    await r.moveTo('.tts-nudge h2', 800); await sleep(500);
    await r.click('.tts-nudge [data-tt-signin]', 600);
    await sleep(4300);
    await r.click('#tt-sync-ok', 700);
    await sleep(800);
    await r.stop();
  },

  // the real study-league board (league.js) with a stand-in signed-in user and sample friends
  async league() {
    const r = await startRecording('league', { url: SITE + '/', init: [FAKE, NOBLUR], seed: { cursor: PHONE ? [180, 260] : [640, 300] }, prep: () => sleep(2500) });
    const { page } = r;
    await sleep(300);
    const pill = page.locator('.dock [data-tt-league]').first();
    await r.reveal(pill);
    await r.click(pill, 800);
    await page.waitForSelector('.ttlg li'); await sleep(1500);
    await r.moveTo('.ttlg li.me', 700); await sleep(500);
    await r.click('.ttlg [data-copy]', 700); await sleep(900);
    await r.click('.ttlg [data-tab="CHEM42"]', 700); await sleep(1300);
    await page.evaluate(() => window.__ttBump(6.9));
    await r.click('.ttlg [data-tab="K7QX3M"]', 700); await sleep(2000);
    await r.click('.ttlg [data-add]', 800); await sleep(500);
    await r.click('#ttlg-c', 600); await r.type('B4RN3Y', 90); await sleep(700);
    await r.stop();
  },

  async c_dt() {
    const r = await startRecording('c_dt', { url: SITE + '/dt.html#flashcards', init: [NO_NUDGE], seed: { cursor: PHONE ? [300, 560] : [900, 560] }, prep: () => sleep(1200) });
    const flip = r.page.locator('button', { hasText: /^\s*Flip\s*$/ }).first();
    await r.reveal(flip); await r.click(flip, 550); await sleep(900);
    await r.click(r.page.locator('button', { hasText: 'Knew it' }).first(), 450); await sleep(700);
    await r.stop();
  },
  async c_ph() {
    const r = await startRecording('c_ph', { url: SITE + '/physics/#labs', init: [NO_NUDGE], seed: { cursor: PHONE ? [200, 500] : [900, 500] }, prep: () => sleep(1000) });
    const page = r.page; const ex = page.locator('.featlab').first();
    await r.reveal(ex); await r.click(ex, 650); await sleep(PHONE ? 700 : 2200);
    if (PHONE) { await page.evaluate(() => { const c = [...document.querySelectorAll('canvas')].filter(c => c.offsetParent).sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0]; const b = c.getBoundingClientRect(); window.scrollBy({ top: b.top - 120, behavior: 'smooth' }); }); await sleep(1800); }
    await r.stop();
  },
  async c_ma() {
    const r = await startRecording('c_ma', { url: SITE + '/maths/', init: [NO_NUDGE], seed: { cursor: PHONE ? [250, 500] : [700, 500] }, prep: () => sleep(1000) });
    const inp = r.page.locator('input[placeholder^="Try"]').first();
    await r.click(inp, 550); await r.type('invariant lines', 45); await sleep(150);
    await r.click(r.page.locator('button:right-of(input[placeholder^="Try"])', { hasText: 'Search' }).first(), 400); await sleep(1300);
    await r.stop();
  },
  async c_es() {
    const r = await startRecording('c_es', { url: SITE + '/esat/', init: [NO_NUDGE], seed: { cursor: PHONE ? [150, 300] : [1000, 300] }, prep: () => sleep(1200) });
    const cv = r.page.locator('canvas').first(); const b = await cv.boundingBox();
    await r.glide(b.x + b.width * 0.55, b.y + b.height * 0.3, 600); await r.glide(b.x + b.width * 0.62, b.y + b.height * 0.22, 400);
    await r.click(null); await sleep(2000);
    await r.stop();
  },
};
(async () => { for (const n of process.argv.slice(2)) await scenes[n](); })().catch(e => { console.error(e); process.exit(1); });
