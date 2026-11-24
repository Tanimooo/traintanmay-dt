// "What's new" update ad (23 Nov 2026): scenes recorded from the real site.
// LOCAL=1 [MODE=phone] node update/scenes.js u_prac u_pdf u_chem
const { startRecording, sleep, PHONE } = require('../rec');
const SITE = 'http://localhost:8765';
const QUIET = () => { try { sessionStorage.setItem('tt-cloud-nudge', '1'); localStorage.setItem('tt-cloud-nudge', String(Date.now() + 9e9)); localStorage.setItem('tt-intro-seen', '1'); } catch (e) {} };
// the yellow "still being tested" strip isn't part of what's new
const NOSTRIP = () => { const add = () => { if (!document.head) return requestAnimationFrame(add); const s = document.createElement('style'); s.textContent = '#xbar{display:none!important}'; document.head.appendChild(s); }; add(); };

const scenes = {
  /* Maths: the big Practice button → pick a topic → one question cut out of the paper → mark it */
  async u_prac() {
    const r = await startRecording('u_prac', { url: SITE + '/maths/#home', init: [QUIET, NOSTRIP], seed: { cursor: PHONE ? [200, 520] : [900, 560] }, prep: () => sleep(1500) });
    const { page } = r;
    await sleep(400);
    const tile = page.locator('.gtile.main').first();
    await r.reveal(tile); await r.click(tile, 800);
    await page.waitForSelector('.builder'); await sleep(700);
    const cp1 = page.locator('[data-c="cp1"]').first();
    await r.reveal(cp1); await r.click(cp1, 700); await sleep(600);
    const topic = page.locator('[data-t="cp1/argand"]').first();
    await r.reveal(topic); await r.click(topic, 700); await sleep(600);
    const seq = page.locator('[data-o="seq"]').first();
    await r.reveal(seq); await r.click(seq, 600); await sleep(500);
    await r.click('#pstart', 800);
    // the question, cut live out of the paper
    await page.waitForSelector('.ttcrop canvas', { timeout: 30000 }); await sleep(1800);
    await r.scrollBy(PHONE ? 160 : 140, 900); await sleep(1200);
    const ms = page.locator('#showms');
    await r.reveal(ms); await r.click(ms, 800);
    await page.waitForSelector('#msbox .ttcrop canvas', { timeout: 30000 }).catch(() => {}); await sleep(1400);
    await r.scrollBy(PHONE ? 260 : 300, 1100); await sleep(1300);
    const mk = page.locator('[data-m="8"]').first();
    if (await mk.count()) { await r.reveal(mk); await r.click(mk, 800); }
    await sleep(1400);
    await r.stop();
  },

  /* PDF tools: pen, highlighter, sticky note, zoom, save, then Back just closes the paper */
  async u_pdf() {
    const r = await startRecording('u_pdf', { url: SITE + '/maths/#cd-cp1', init: [QUIET, NOSTRIP], seed: { cursor: PHONE ? [220, 300] : [700, 300] }, prep: async p => { await sleep(1200); await p.evaluate(() => { const d = document.querySelector('details.group'); if (d) d.open = true; }); } });
    const { page } = r;
    const doc = page.locator('a.doc[data-open]').first();
    await r.reveal(doc); await r.click(doc, 800);
    await page.waitForSelector('.tta-pg canvas:not(.tta-ink)', { timeout: 30000 }); await sleep(1200);
    const box = async () => (await page.locator('.tta-pg').first().boundingBox());
    const P = async (fx, fy) => { const b = await box(); return [b.x + b.width * fx, b.y + b.height * fy]; };
    // pen: ring "Q1."
    await r.click('[data-tool="pen"]', 700); await sleep(200);
    let [cx, cy] = await P(0.136, 0.214); const rx = PHONE ? 22 : 46, ry = PHONE ? 12 : 24;
    await r.glide(cx + rx, cy, 500); await page.mouse.down();
    for (let i = 1; i <= 40; i++) { const a = i / 40 * Math.PI * 2.15; await page.mouse.move(cx + rx * Math.cos(a), cy - ry * Math.sin(a)); await sleep(14); }
    await page.mouse.up(); await sleep(400);
    // highlighter along the first line of the question
    await r.click('[data-tool="hl"]', 700); await sleep(150);
    const [hx0, hy] = await P(0.1, 0.252), [hx1] = await P(0.47, 0.252);
    await r.glide(hx0, hy, 500); await page.mouse.down(); await r.glide(hx1, hy, 700); await page.mouse.up(); await sleep(400);
    // sticky note
    await r.click('[data-tool="note"]', 700); await sleep(150);
    const [nx, ny] = await P(PHONE ? 0.42 : 0.6, PHONE ? 0.12 : 0.17);
    await r.glide(nx, ny, 600); await sleep(150); await page.mouse.down(); await sleep(80); await page.mouse.up(); await sleep(300);
    await r.type('Times top and bottom by 2 + 3i', 45); await sleep(600);
    // zoom in, then back to fit
    await r.click('[data-act="in"]', 700); await sleep(900); await r.click('[data-act="in"]', 350); await sleep(1100);
    await r.click('[data-act="fit"]', 600); await sleep(800);
    // save
    await r.click('[data-act="save"]', 700); await sleep(1300);
    // the phone's Back button now just closes the paper
    await page.evaluate(() => {
      const b = document.createElement('div'); b.id = 'ttback';
      b.style.cssText = 'position:fixed;left:50%;bottom:' + (window.__ttPhone ? 90 : 40) + 'px;transform:translateX(-50%) scale(.6);opacity:0;z-index:2147483640;padding:14px 26px;border-radius:999px;background:#ffc917;color:#07051a;font:800 26px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:transform .25s cubic-bezier(.2,.9,.25,1.4),opacity .2s';
      b.textContent = '← Back'; document.body.appendChild(b);
      requestAnimationFrame(() => { b.style.opacity = 1; b.style.transform = 'translateX(-50%) scale(1)'; });
    });
    await sleep(900);
    await page.evaluate(() => { document.getElementById('ttback').style.transform = 'translateX(-50%) scale(.9)'; history.back(); });
    await sleep(500);
    await page.evaluate(() => { const b = document.getElementById('ttback'); b.style.opacity = 0; });
    await sleep(1400);
    await r.stop();
  },

  /* Chemistry is AQA now */
  async u_chem() {
    const r = await startRecording('u_chem', { url: SITE + '/chemistry/', init: [QUIET, NOSTRIP], seed: { cursor: PHONE ? [200, 420] : [900, 420] }, prep: () => sleep(1500) });
    const { page } = r;
    await sleep(500);
    const eb = page.locator('.hero .eyebrow').first();
    if (await eb.count()) await r.moveTo(eb, 900);
    await sleep(900);
    await r.scrollBy(PHONE ? 420 : 380, 1100); await sleep(1300);
    await r.scrollBy(PHONE ? 420 : 320, 1000); await sleep(1300);
    await r.stop();
  },
};
(async () => { for (const n of process.argv.slice(2)) await scenes[n](); })().catch(e => { console.error(e); process.exit(1); });
