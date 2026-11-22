// "How to use TrainTanmay" recordings. Each step starts its narration line, runs its actions, then waits until the line has finished.
// MODE=phone node howto/scenes.js <names>
const path = require('path'), fs = require('fs');
const { startRecording, sleep, PHONE } = require('../rec');
const SITE = 'http://localhost:8765', AD = 'http://localhost:8766';
const DUR = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice', 'durations.json')));
const QUIET = () => { try { sessionStorage.setItem('tt-cloud-nudge', '1'); sessionStorage.setItem('tt-promo-seen', '1'); } catch (e) {} };
const FAKE = { path: path.join(__dirname, '..', 'www', 'fakecloud.js') };
const NOBLUR = () => { const add = () => { if (!document.head) return requestAnimationFrame(add); const s = document.createElement('style'); s.textContent = '.ttlg-back{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:rgba(5,6,14,.84)!important}'; document.head.appendChild(s); }; add(); };
const SUF = PHONE ? '-phone' : '';

async function rec(name, opts, body) {
  const r = await startRecording(name, opts);
  const marks = [];
  r.step = async (id, fn, gap = 0.6) => {
    const t0 = r.now(); marks.push([id, t0]);
    if (fn) await fn();
    const left = DUR[id] + gap - (r.now() - t0); if (left > 0) await sleep(left * 1000);
  };
  await sleep(400);
  await body(r, r.page);
  await r.stop();
  fs.writeFileSync(path.join(__dirname, '..', 'clips', name + SUF + '.marks.json'), JSON.stringify(marks));
}
const molBtn = (page, m) => page.locator('button').filter({ hasText: new RegExp('^\\s*' + m.replace(/\d/g, '\\s*$&') + '\\s*$') }).first();
const visibleFirst = (page, sel, opts) => page.locator(sel, opts).filter({ visible: true }).first();

const S = {
  // start screen -> Chemistry: welcome, getting around, inside an app
  async h_main() {
    await rec('h_main', { url: SITE + '/', init: [QUIET], seed: { cursor: PHONE ? [180, 420] : [640, 420] }, prep: () => sleep(1500) }, async (r, page) => {
      await r.step('hi', async () => { await r.glide(PHONE ? 200 : 700, PHONE ? 200 : 170, 1800); });
      await r.step('what', async () => { await r.glide(PHONE ? 150 : 560, PHONE ? 300 : 280, 1500); });
      await r.step('worlds', async () => {
        for (const w of ['dt', 'physics', 'chemistry', 'maths', 'esat']) {
          const el = page.locator(`.world[data-go="${w}"]`).first();
          if (PHONE) await r.reveal(el, 600);
          await r.moveTo(el, PHONE ? 500 : 900);
          await sleep(PHONE ? 250 : 350);
        }
      });
      await r.step('pick', async () => {
        const c = page.locator('.world[data-go="chemistry"]').first();
        if (PHONE) await r.reveal(c, 700);
        await r.moveTo(c, 800); await sleep(900); await r.click(null);
      }, 0.2);
      await page.waitForURL(/chemistry/); await page.waitForLoadState('networkidle').catch(() => {}); await sleep(400);
      await r.step('apphome', async () => {
        await sleep(1200);
        if (PHONE) { await r.scrollBy(380, 1200); await sleep(1500); await r.scrollBy(-380, 1000); }
        else { await r.moveTo(page.locator('text=course progress').first(), 1000); await sleep(800); await r.moveTo(page.locator('text=flashcards due').first(), 900); await sleep(600);
               await r.moveTo(page.locator('text=Continue with').first(), 900); }
      });
      await r.step('topbar', async () => {
        if (PHONE) { await r.click('#menu', 700); await sleep(2200); await page.keyboard.press('Escape'); await sleep(200);
                     if (await page.locator('.drawer-panel').filter({ visible: true }).count()) await r.click(visibleFirst(page, '.drawer-panel button[aria-label*="lose"], .drawer-close'), 500).catch(() => {}); }
        else for (const t of ['Learn', 'Practise', 'Past papers', 'Data sheet']) { await r.moveTo(visibleFirst(page, 'nav a, nav button, header a, header button', { hasText: t }), 600); await sleep(300); }
      });
      await r.step('logo', async () => { await r.click('#brand, .brand', 800); await sleep(3500); await page.keyboard.press('Escape'); });
      await r.step('jump', async () => {
        const j = visibleFirst(page, 'button', { hasText: /Jump to/ }); await j.waitFor({ timeout: 5000 }).catch(async () => { await page.screenshot({ path: '/tmp/claude-0/-home-user-traintanmay-dt/afdff4eb-83ab-5873-81ff-700f33069c18/scratchpad/shots/dbg_jump.png' }); }); await r.click(j, 800); await sleep(500); await r.type('titration', 90); await sleep(1600); await page.keyboard.press('Escape');
      });
      await r.step('topic', async () => {
        await r.click(page.locator('text=Continue with').first(), 800);
        await page.waitForURL(/#t-/); await sleep(1300);
        for (const t of ['Key terms', 'Notes']) { const tb = visibleFirst(page, 'button, a', { hasText: new RegExp('^\\s*' + t) }); await r.reveal(tb, 500); await r.click(tb, 600); await sleep(900); }
      });
      await r.step('ai', async () => { await r.scrollBy(PHONE ? 500 : 380, 1600); await sleep(1500); await r.scrollBy(PHONE ? 400 : 300, 1400); });
      await r.step('drill', async () => {
        await page.evaluate(() => { location.hash = '#drill-moles'; }); await sleep(1100);
        const ans = await page.evaluate(() => {
          const t = document.body.innerText.replace(/\s+/g, ' ');
          const M = t.match(/M\s*=\s*([\d.]+)/), g = t.match(/in ([\d.]+) g of/), n = t.match(/mass of ([\d.]+) mol/);
          if (M && g) return Number((parseFloat(g[1]) / parseFloat(M[1])).toPrecision(3)).toString();
          if (M && n) return Number((parseFloat(n[1]) * parseFloat(M[1])).toPrecision(3)).toString();
          return '0.2';
        });
        await r.click('#dans', 700); await r.type(ans, 140); await sleep(300);
        await r.click(visibleFirst(page, 'button', { hasText: 'Check' }), 500); await sleep(1500);
      });
      await r.step('lab', async () => {
        await page.evaluate(() => { location.hash = '#lab-shapes'; }); await page.waitForSelector('text=3D shapes of molecules'); await sleep(500);
        if (!PHONE) {
          await r.scrollBy(300, 800);
          for (const m of ['CH4', 'SF6']) { await r.click(molBtn(page, m), 600); await sleep(1100); }
          await r.click(visibleFirst(page, 'button', { hasText: 'Exam drawing' }), 600); await sleep(1300);
        } else {
          await page.evaluate(() => { const c = [...document.querySelectorAll('canvas')].filter(c => c.offsetParent).sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0]; if (c) c.id = 'molcv'; });
          const t = molBtn(page, 'H2O'); await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find(x => /CO\s*2/.test(x.textContent)); window.scrollBy({ top: t.getBoundingClientRect().top - 110, behavior: 'smooth' }); }); await sleep(700);
          await t.evaluate(el => el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })); await sleep(300);
          await r.click(t, 500); await sleep(200);
          await page.evaluate(() => { const b = document.getElementById('molcv').getBoundingClientRect(); window.scrollBy({ top: b.top + b.height / 2 - innerHeight * 0.58, behavior: 'smooth' }); }); await sleep(1600);
          await r.click(visibleFirst(page, 'button', { hasText: 'Exam drawing' }), 600); await sleep(1300);
        }
      }, 0.9);
    });
  },

  async h_dt() {
    await rec('h_dt', { url: SITE + '/dt.html#flashcards', init: [QUIET], seed: { cursor: PHONE ? [300, 560] : [900, 560] }, prep: () => sleep(1200) }, async (r, page) => {
      await r.step('dt', async () => {
        await sleep(1500);
        const flip = visibleFirst(page, 'button', { hasText: /^\s*Flip\s*$/ }); await r.reveal(flip); await r.click(flip, 800); await sleep(2200);
        await r.click(visibleFirst(page, 'button', { hasText: 'Knew it' }), 700); await sleep(1500);
        await r.click(visibleFirst(page, 'button', { hasText: /^\s*Flip\s*$/ }), 700);
      });
    });
  },
  async h_ph() {
    await rec('h_ph', { url: SITE + '/physics/#labs', init: [QUIET], seed: { cursor: PHONE ? [200, 500] : [900, 500] }, prep: () => sleep(1000) }, async (r, page) => {
      await r.step('ph', async () => {
        await sleep(600); const ex = page.locator('.featlab').first(); await r.reveal(ex); await r.click(ex, 800); await sleep(PHONE ? 700 : 1200);
        if (PHONE) { await page.evaluate(() => { const c = [...document.querySelectorAll('canvas')].filter(c => c.offsetParent).sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0]; window.scrollBy({ top: c.getBoundingClientRect().top - 120, behavior: 'smooth' }); }); }
      });
    });
  },
  async h_ma() {
    await rec('h_ma', { url: SITE + '/maths/', init: [QUIET], seed: { cursor: PHONE ? [250, 500] : [700, 500] }, prep: () => sleep(1000) }, async (r, page) => {
      await r.step('ma', async () => {
        const inp = page.locator('input[placeholder^="Try"]').first();
        await r.click(inp, 700); await r.type('vectors', 110); await sleep(300);
        await r.click(page.locator('button:right-of(input[placeholder^="Try"])', { hasText: 'Search' }).first(), 500); await sleep(1500);
        await r.scrollBy(PHONE ? 350 : 250, 1200);
      });
    });
  },
  async h_es() {
    await rec('h_es', { url: SITE + '/esat/', init: [QUIET], seed: { cursor: PHONE ? [150, 300] : [700, 400] }, prep: () => sleep(1200) }, async (r, page) => {
      await r.step('es', async () => {
        for (const t of PHONE ? ['Topics', 'New test'] : ['Topics', 'New test', 'Analytics']) { await r.moveTo(visibleFirst(page, 'nav a, nav button, header a, header button', { hasText: t }), 700); await sleep(500); }
        const cv = page.locator('canvas').first(); const b = await cv.boundingBox();
        await r.glide(b.x + b.width * 0.55, b.y + b.height * 0.3, 900); await r.glide(b.x + b.width * 0.62, b.y + b.height * 0.22, 500);
        await r.click(null); await sleep(2200);
      });
    });
  },

  async h_save() {
    await rec('h_save', { url: SITE + '/', init: [QUIET], seed: { cursor: PHONE ? [180, 300] : [640, 300] },
      prep: async p => { await sleep(1500); await p.addStyleTag({ url: AD + '/sync.css' }); await p.addScriptTag({ url: AD + '/sync.js' }); } }, async (r, page) => {
      await r.step('local', async () => { const s = page.locator('.dock [data-tt-save]').first(); await r.reveal(s); await r.click(s, 900); await sleep(1000); });
      await r.step('backup', async () => { const d = visibleFirst(page, 'button', { hasText: 'Download save file' }); await r.reveal(d, 600); await r.moveTo(d, 800); await sleep(1500); });
      await r.step('google', async () => { const g = page.locator('#tts-in-g').first(); await r.reveal(g, 600); await r.click(g, 800); });
      await r.step('adds', async () => { await sleep(Math.max(0, 4300 - 0)); await r.click('#tt-sync-ok', 700); }, 0.4);
    });
  },

  async h_league() {
    await rec('h_league', { url: SITE + '/', init: [QUIET, FAKE, NOBLUR], seed: { cursor: PHONE ? [180, 260] : [640, 300] }, prep: () => sleep(2500) }, async (r, page) => {
      await r.step('lg1', async () => { const pill = page.locator('.dock [data-tt-league]').first(); await r.reveal(pill); await r.click(pill, 800); await page.waitForSelector('.ttlg li'); });
      await r.step('lg2', async () => { await r.moveTo('.ttlg li.me', 900); await sleep(700); await r.moveTo('.ttlg li.me .tm', 900); });
      await r.step('lg3', async () => { await r.click('.ttlg [data-copy]', 700); await sleep(1300); await r.click('.ttlg [data-tab="CHEM42"]', 700); });
      await r.step('lg4', async () => { await page.evaluate(() => window.__ttBump(6.9)); await r.click('.ttlg [data-tab="K7QX3M"]', 700); });
      await r.step('lg5', async () => { await r.click('.ttlg [data-add]', 700); await sleep(400); await r.click('#ttlg-c', 600); await r.type('B4RN3Y', 110); }, 0.8);
    });
  },

  async h_access() {
    await rec('h_access', { url: SITE + '/dt.html', init: [QUIET], seed: { cursor: PHONE ? [200, 400] : [700, 400] }, prep: () => sleep(1500) }, async (r, page) => {
      await r.step('dys', async () => { await sleep(1200); await r.click('#btnDys', 900); await sleep(1500); });
      await r.step('theme', async () => {
        await r.click('#theme', 800); await page.selectOption('#theme', 'dark'); await sleep(1700);
        await r.click('#theme', 400); await page.selectOption('#theme', 'salmon'); await sleep(1300);
      });
      await r.step('lang', async () => {
        await r.click('#brand, .brand', 800); await sleep(500);
        for (const t of ['Cymraeg', 'Gàidhlig']) { await r.moveTo(visibleFirst(page, '.tt-sw button', { hasText: t }), 600); await sleep(600); }
      }, 0.8);
    });
  },

  async h_end() {
    await rec('h_end', { url: SITE + '/', init: [QUIET], seed: { cursor: PHONE ? [180, 300] : [640, 300] }, prep: () => sleep(1500) }, async (r, page) => {
      await r.step('bug', async () => { const b = visibleFirst(page, 'a', { hasText: 'Report a bug' }); await r.reveal(b, 900); await r.moveTo(b, 900); await sleep(1500); });
      await r.step('bye', async () => { if (PHONE) await r.scrollBy(-2000, 1200); await r.moveTo('.world[data-go="chemistry"]', 1200); }, 0.4);
    });
  },
};
(async () => { for (const n of process.argv.slice(2)) await S[n](); })().catch(e => { console.error(e); process.exit(1); });
