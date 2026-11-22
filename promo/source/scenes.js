const { startRecording, sleep } = require('./rec');
const SITE = 'http://localhost:8765';
const AD = 'http://localhost:8766';
const noNudge = async page => { await page.evaluate(() => { try { sessionStorage.setItem('tt-cloud-nudge', '1'); document.querySelector('.tts-nudge')?.remove(); } catch (e) {} }); };

const scenes = {
  // Home: tour the five worlds, then pick Chemistry and ride into the app and its 3D lab
  async chem() {
    const r = await startRecording('chem', {
      url: SITE + '/', seed: { cursor: [640, 250] },
      prep: async p => { await p.context().addInitScript(() => { try { sessionStorage.setItem('tt-cloud-nudge', '1'); } catch (e) {} }); await noNudge(p); await sleep(1200); }
    });
    const { page } = r;
    await sleep(500);
    for (const w of ['dt', 'physics', 'maths', 'esat']) await r.moveTo(`.world[data-go="${w}"]`, 520);
    await r.moveTo('.world[data-go="chemistry"]', 750);
    await sleep(450);
    await r.click(null);
    await page.waitForURL(/chemistry/); await page.waitForLoadState('networkidle').catch(() => {});
    await noNudge(page);
    await sleep(900);
    await r.moveTo('.hero-scope', 1000);
    await sleep(900);
    await r.click('.hero-scope .sh-cta', 500);
    await page.waitForSelector('text=3D shapes of molecules'); await sleep(500);
    await r.scrollBy(300, 1000);
    await sleep(300);
    for (const m of ['CH4', 'H2O', 'SF6']) {
      const btn = page.locator('button').filter({ hasText: new RegExp('^\\s*' + m.replace(/\d/g, '\\s*$&') + '\\s*$') }).first();
      await r.click(btn, 750); await sleep(1100);
    }
    await r.click(page.locator('button', { hasText: 'Exam drawing' }).first(), 800);
    await sleep(1500);
    await r.click(page.locator('button', { hasText: '3D model' }).first(), 600);
    await sleep(900);
    await r.stop();
  },

  // Sign-in: the real nudge card, then a TrainTanmay-styled "synced" moment (no real Google popup)
  async login() {
    const r = await startRecording('login', {
      url: SITE + '/', seed: { cursor: [700, 330] },
      prep: async p => {
        await p.waitForSelector('.tts-nudge', { timeout: 8000 }).catch(() => {});
        await p.addStyleTag({ url: AD + '/sync.css' });
        await p.addScriptTag({ url: AD + '/sync.js' });
      }
    });
    const { page } = r;
    await sleep(700);
    await r.moveTo('.tts-nudge h2', 1000);
    await sleep(900);
    await r.click('.tts-nudge [data-tt-signin]', 700);
    await sleep(5200);
    await r.moveTo('#tt-sync-ok', 900);
    await sleep(500);
    await r.click('#tt-sync-ok', 300);
    await sleep(1000);
    await r.stop();
  },

  async board() {
    const r = await startRecording('board', { url: AD + '/leaderboard.html', seed: { cursor: [900, 600] } });
    const { page } = r;
    await sleep(900);
    await r.click('[data-tab="friends"]', 900);
    await sleep(1600);
    await r.moveTo('.row.me', 900);
    await sleep(700);
    await r.click('#finish', 900);
    await sleep(3200);
    await r.click('[data-tab="subject"]', 800);
    await sleep(1200);
    await r.click('#add', 900);
    await sleep(1800);
    await r.stop();
  },
};

(async () => {
  for (const n of process.argv.slice(2)) await scenes[n]();
})().catch(e => { console.error(e); process.exit(1); });
