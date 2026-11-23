// Film the outro on the real TrainTanmay site, phone-sized (360×640 @3 = 1080×1920), one frame at a time.
// usage: node outro.js <spec.json> <outdir> <seconds>   → outdir/o_0000.jpg … + outdir/outro.json
//  site.kind "esat":  the question opens in the ESAT app, the right answer is tapped, then it scrolls to the worked solution
//  site.kind "paper": an app page that lists the paper → open its section → tap the paper → it opens inside
//                     TrainTanmay's viewer, already at the question's page
const { chromium } = require('playwright'); const fs = require('fs'); const site = require('./site.js');
const spec = JSON.parse(fs.readFileSync(process.argv[2])); const out = process.argv[3]; const D = +process.argv[4]; const FPS = 30;
const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
const N = Math.round(D * FPS);
const shot = async (p, i) => {
  await p.evaluate(() => { const c = document.getElementById('clockw'); if (c) c.parentElement.style.visibility = 'hidden'; });
  await p.screenshot({ path: `${out}/o_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
};
const done = (taps) => fs.writeFileSync(`${out}/outro.json`, JSON.stringify({ taps, frames: N, fps: FPS }));

async function esat(p) {
  await site.openQ(p, spec.site.qid, spec.site.title);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.waitForTimeout(6000);
  const pos = await p.evaluate(() => {
    const T = el => el.getBoundingClientRect().top + scrollY;
    const card = [...document.querySelectorAll('#view *')].find(e => /^Question \d+/.test(e.textContent.trim()) && e.children.length < 3);
    return { q: T(card) - 150, o: T(document.querySelector('button.opt')) - 330 };
  });
  const tE = 2.8, s1 = [1.3, 2.3], s2 = [3.6, 5.0], s3 = [5.6, Math.max(7, D - 1.5)];
  let clicked = false, yEnd = null, yAns = null, tap = null;
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    if (!clicked && t >= tE) {
      const btn = p.locator('button.opt', { hasText: spec.answer }).first(); const bb = await btn.boundingBox();
      tap = { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, t: tE };
      await btn.click(); clicked = true; await p.waitForTimeout(1200);
      [yEnd, yAns] = await p.evaluate(() => {
        const T = e => e.getBoundingClientRect().top + scrollY, st = [...document.querySelectorAll('#view strong')];
        const a = st.find(e => /method/i.test(e.textContent)), b = st.find(e => /^Answer:/.test(e.textContent.trim()));
        return [a ? T(a) - 190 : scrollY + 500, b ? T(b) - 330 : scrollY + 800];
      });
    }
    let y = pos.q + (pos.o - pos.q) * ease((t - s1[0]) / (s1[1] - s1[0]));
    if (yEnd !== null) y = pos.o + (yEnd - pos.o) * ease((t - s2[0]) / (s2[1] - s2[0]));
    if (yAns !== null && t > s3[0]) y = yEnd + (Math.max(yEnd, yAns) - yEnd) * ease((t - s3[0]) / (s3[1] - s3[0]));
    await p.evaluate(y => window.scrollTo(0, y), y);
    await shot(p, i);
  }
  done([tap]);
}

async function paper(p) {
  const S = spec.site;
  await p.goto('http://localhost:8765/' + S.page); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}.tte-main{scroll-behavior:auto!important}' });
  const link = p.locator(`a[href="${S.url}"]`).first();
  const det = await link.evaluate(a => { const d = a.closest('details'); if (!d || d.open) return null; d.dataset.vid = '1'; return true; });
  const sum = det ? p.locator('details[data-vid] > summary').first() : null;
  const Y = async (loc, off) => loc.evaluate((e, off) => e.getBoundingClientRect().top + scrollY - off, off);
  const y0 = 0, yS = sum ? await Y(sum, 260) : await Y(link, 330);
  let yL = sum ? null : yS, opened = !sum, clicked = false; const taps = [];
  const tOpen = 2.2, tTap = sum ? 4.2 : 2.6;
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    if (!opened && t >= tOpen) { const bb = await sum.boundingBox(); taps.push({ x: Math.min(300, bb.x + bb.width * .35), y: bb.y + bb.height / 2, t: tOpen });
      await sum.click(); opened = true; await p.waitForTimeout(400); yL = await Y(link, 330); }
    if (!clicked && t >= tTap) {
      const bb = await link.boundingBox(); taps.push({ x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, t: tTap });
      await link.click(); clicked = true; await p.waitForTimeout(1200);
      if (!(await p.locator('.tte-main').count())) await p.evaluate(S => window.ttExam && ttExam.view({ url: S.url, title: S.title, source: 'Physics & Maths Tutor' }), S);
      await p.waitForSelector('.tte-pages > *', { timeout: 30000 });
      // go straight to the question's page and let it draw (the video doesn't wait: time is frozen while we do this)
      await p.evaluate(n => { const m = document.querySelector('.tte-main'), pg = document.querySelectorAll('.tte-pages > *')[n - 1]; m.scrollTop = pg.offsetTop - 8; }, S.pdfPage);
      await p.waitForTimeout(5000);
      await p.evaluate(n => { const m = document.querySelector('.tte-main'), pg = document.querySelectorAll('.tte-pages > *')[n - 1]; m.scrollTop = pg.offsetTop - 8; window.__vy = m.scrollTop; }, S.pdfPage);
      await p.waitForTimeout(1500);
    }
    if (!clicked) {
      let y = y0 + (yS - y0) * ease((t - 0.6) / 1.2);
      if (yL !== null && sum) y = yS + (yL - yS) * ease((t - (tOpen + .4)) / 1.0);
      await p.evaluate(y => window.scrollTo(0, y), y);
    } else {   // drift slowly down the question
      const dy = (S.drift || 0) * ease((t - tTap - .4) / Math.max(1, D - tTap - 1));
      await p.evaluate(dy => { const m = document.querySelector('.tte-main'); m.scrollTop = window.__vy + dy; }, dy);
    }
    await shot(p, i);
  }
  done(taps);
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await site.prep(p);
  await (spec.site.kind === 'esat' ? esat(p) : paper(p));
  await b.close();
})();
