// Render every frame of a solve video: node render.js <sched.json> <outdir>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const S = JSON.parse(fs.readFileSync(process.argv[2])); const out = process.argv[3]; const FPS = 30;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.route('**/__f/**', r => r.fulfill({ path: decodeURIComponent(new URL(r.request().url()).pathname.slice(4)) }));
  await p.addInitScript(s => { window.SCHED = s; }, S);
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/promo/source/solve/render.html'); await p.evaluate(() => window.READY);
  const N = Math.ceil(S.total * FPS);
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.setT(t), i / FPS);
    await p.screenshot({ path: path.join(out, `f_${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
    if (i % 300 === 0) console.log('frame', i, '/', N);
  }
  await b.close();
})();
