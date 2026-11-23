// Film the outro: the same question open on TrainTanmay, tap the right answer, scroll to the worked solution.
// usage: node outro.js <spec.json> <outdir> <seconds>   → outdir/o_0000.jpg … + outdir/outro.json
const { chromium } = require('playwright'); const fs = require('fs'); const site = require('./site.js');
const spec = JSON.parse(fs.readFileSync(process.argv[2])); const out = process.argv[3]; const D = +process.argv[4]; const FPS = 30;
const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
const shot = (p, i) => p.screenshot({ path: `${out}/o_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
// A-level: the app's Past papers page → open the paper's list → tap "Question paper" → it opens inside TrainTanmay
async function papers(b, p) {
  const S = spec.site;
  await p.goto(`http://localhost:8765/${S.app}/index.html#papers`); await p.waitForTimeout(2500);
  await p.getByText('Not now').click({ timeout: 3000 }).catch(() => {});
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  const sum = p.locator('details.fold summary', { hasText: S.paper }).first();
  const y0 = 0, yS = await sum.evaluate(e => e.getBoundingClientRect().top + scrollY - 230);
  let opened = false, yR = null, tap = null, clicked = false;
  const tOpen = 2.4, tTap = 4.6;
  for (let i = 0; i < D * FPS; i++) {
    const t = i / FPS;
    if (!opened && t >= tOpen) { const bb = await sum.boundingBox(); tap = { x: bb.x + 60, y: bb.y + bb.height / 2, t: tOpen };
      await sum.click(); opened = true; await p.waitForTimeout(400);
      yR = await p.locator('details[open] .sess', { hasText: S.session }).first().evaluate(e => e.getBoundingClientRect().top + scrollY - 330); }
    if (!clicked && t >= tTap) { const a = p.locator('details[open] .sess', { hasText: S.session }).first().getByText('Question paper');
      const bb = await a.boundingBox(); tap2 = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, t: tTap };
      await a.click(); clicked = true; await p.waitForTimeout(6000); }
    if (!clicked) {
      let y = y0 + (yS - y0) * ease((t - 0.8) / 1.2);
      if (yR !== null) y = yS + (yR - yS) * ease((t - 3.0) / 1.0);
      await p.evaluate(y => window.scrollTo(0, y), y);
    }
    await shot(p, i);
  }
  fs.writeFileSync(`${out}/outro.json`, JSON.stringify({ taps: [tap, tap2], frames: Math.round(D * FPS), fps: FPS }));
  await b.close();
}
let tap2 = null;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await site.prep(p);
  if (spec.site.kind === 'papers') return papers(b, p);
  await site.openQ(p, spec.site.qid, spec.site.title);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.waitForFunction(() => document.querySelector('#view canvas, #view img'), null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(5000);
  const top = el => el.getBoundingClientRect().top + scrollY;
  const pos = await p.evaluate(() => {
    const T = el => el.getBoundingClientRect().top + scrollY;
    const card = [...document.querySelectorAll('#view *')].find(e => /^Question \d+/.test(e.textContent.trim()) && e.children.length < 3);
    const opts = document.querySelector('button.opt');
    return { q: T(card) - 150, o: T(opts) - 330 };
  });
  const tE = 3.4, s1 = [1.6, 2.8], s2 = [4.3, 5.9], s3 = [6.6, Math.max(8, D - 2)];
  let clicked = false, yEnd = null, yAns = null, tap = null;
  for (let i = 0; i < D * FPS; i++) {
    const t = i / FPS;
    if (!clicked && t >= tE) {
      const btn = p.locator('button.opt', { hasText: spec.answer }).first();
      const bb = await btn.boundingBox(); tap = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, t: tE };
      await btn.click(); clicked = true; await p.waitForTimeout(1200);
      [yEnd, yAns] = await p.evaluate(() => {
        const T = e => e.getBoundingClientRect().top + scrollY;
        const sol = [...document.querySelectorAll('#view strong')];
        const a = sol.find(e => /method/i.test(e.textContent)), b = sol.find(e => /^Answer:/.test(e.textContent.trim()));
        return [a ? T(a) - 190 : scrollY + 500, b ? T(b) - 330 : scrollY + 800];
      });
    }
    let y = pos.q + (pos.o - pos.q) * ease((t - s1[0]) / (s1[1] - s1[0]));
    if (yEnd !== null) y = pos.o + (yEnd - pos.o) * ease((t - s2[0]) / (s2[1] - s2[0]));
    if (yAns !== null && t > s3[0]) y = yEnd + (Math.max(yEnd, yAns) - yEnd) * ease((t - s3[0]) / (s3[1] - s3[0]));
    await p.evaluate(y => window.scrollTo(0, y), y);
    await p.evaluate(() => { const c = document.getElementById('clockw'); if (c) c.parentElement.style.visibility = 'hidden'; }); await shot(p, i);
  }
  fs.writeFileSync(`${out}/outro.json`, JSON.stringify({ taps: [tap], frames: Math.round(D * FPS), fps: FPS }));
  await b.close();
})();
