/* Renders ad.html to video: node render.js [preview]   -> out/TrainTanmay-focus-ad.mp4 (1080x1920, 30fps, silent)
   preview: saves a few stills to out/preview-*.jpg instead. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, 'ad.html'));
  await p.evaluate(() => window.ready()); await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => window.TOTAL), B = await p.evaluate(() => window.BEAT);
  if (process.argv[2] === 'preview') {
    for (const beat of process.argv.slice(3).map(Number)) { await p.evaluate(t => window.render(t), beat * B); await p.screenshot({ path: path.join(OUT, 'preview-' + beat + '.jpg'), type: 'jpeg', quality: 85 }); }
    await b.close(); return;
  }
  const n = Math.round(total * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'TrainTanmay-focus-ad.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.render(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${n}\n`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('done', n, 'frames', total.toFixed(2) + 's');
  await b.close();
})();
