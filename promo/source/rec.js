// Screen-recording helpers: a visible, smoothly gliding cursor plus CDP screencast capture.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PHONE = process.env.MODE === 'phone';
const W = PHONE ? 360 : 1280, H = PHONE ? 640 : 720, SCALE = PHONE ? 3 : 1.5; // 1080x1920 or 1920x1080
const OW = W * SCALE, OH = H * SCALE, SUF = PHONE ? '-phone' : '';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const CURSOR_JS = `window.__ttPhone=${PHONE};
(() => {
  if (window.__ttCursor) return; window.__ttCursor = 1;
  const add = () => {
    if (!document.body) return requestAnimationFrame(add);
    const st = document.createElement('style');
    st.textContent = \`
      #ttc{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;
           transform:translate(var(--x,-100px),var(--y,-100px));filter:drop-shadow(0 3px 5px rgba(0,0,0,.45));transition:scale .12s}
      #ttc.down{scale:.82}
      .ttr{position:fixed;z-index:2147483646;pointer-events:none;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;
           border:3px solid #ffc917;box-shadow:0 0 18px #ffc917;animation:ttr .55s ease-out forwards}
      @keyframes ttr{from{transform:scale(.6);opacity:1}to{transform:scale(4.2);opacity:0}}
      #tthalo{position:fixed;left:0;top:0;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;pointer-events:none;z-index:2147483645;
           background:radial-gradient(circle,rgba(255,201,23,.38),rgba(255,201,23,0) 70%);transform:translate(var(--x,-100px),var(--y,-100px))}\`;
    document.head.appendChild(st);
    const halo = document.createElement('div'); halo.id = 'tthalo'; document.body.appendChild(halo);
    const c = document.createElement('div'); c.id = 'ttc';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M3 2 L3 19.5 L7.6 15.4 L10.6 22 L13.6 20.7 L10.7 14.2 L17 14.2 Z" fill="#fff" stroke="#0e0b22" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    if (window.__ttPhone) { c.innerHTML = ''; c.style.cssText = 'width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(255,255,255,.55);border:3px solid rgba(14,11,34,.75);box-shadow:0 0 0 2px rgba(255,255,255,.5)'; halo.style.display = 'none'; }
    document.body.appendChild(c);
    const set = (x, y) => { for (const el of [c, halo]) { el.style.setProperty('--x', x + 'px'); el.style.setProperty('--y', y + 'px'); } };
    const p = window.__ttPos || [-100, -100]; set(p[0], p[1]);
    addEventListener('mousemove', e => { window.__ttPos = [e.clientX, e.clientY]; set(e.clientX, e.clientY); }, true);
    addEventListener('mousedown', e => { c.classList.add('down');
      const r = document.createElement('div'); r.className = 'ttr'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      document.body.appendChild(r); setTimeout(() => r.remove(), 700); }, true);
    addEventListener('mouseup', () => c.classList.remove('down'), true);
  };
  add();
})();`;

async function startRecording(name, { url, seed = {}, prep, init = [] } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  await ctx.addInitScript(CURSOR_JS);
  for (const s of init) await ctx.addInitScript(s);
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  if (seed.cursor) await ctx.addInitScript(`window.__ttPos=${JSON.stringify(seed.cursor)}`);
  const page = await ctx.newPage();
  let mouse = seed.cursor ? [...seed.cursor] : [W * 0.55, H * 0.6];
  if (url) await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
  if (prep) await prep(page);
  await page.mouse.move(mouse[0], mouse[1]);

  name += SUF; const dir = path.join(__dirname, 'frames', name);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = []; let t0 = null;
  cdp.on('Page.screencastFrame', async f => {
    const ts = f.metadata.timestamp; if (t0 === null) t0 = ts;
    const file = path.join(dir, String(frames.length).padStart(5, '0') + '.jpg');
    fs.writeFileSync(file, Buffer.from(f.data, 'base64'));
    frames.push({ file, t: ts - t0 });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: OW, maxHeight: OH, everyNthFrame: 1 });
  const wall0 = Date.now();
  const clicks = [];
  const now = () => (Date.now() - wall0) / 1000;

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  async function glide(x, y, ms = 900) {
    const [sx, sy] = mouse; const dx = x - sx, dy = y - sy;
    // slight arc, like a real hand
    const nx = -dy, ny = dx, len = Math.hypot(nx, ny) || 1, bend = Math.min(60, Math.hypot(dx, dy) * 0.12);
    const steps = Math.max(12, Math.round(ms / 16)); const start = Date.now();
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps), arc = Math.sin(Math.PI * t) * bend;
      await page.mouse.move(sx + dx * t + nx / len * arc, sy + dy * t + ny / len * arc);
      const due = start + ms * i / steps - Date.now(); if (due > 0) await sleep(due);
    }
    mouse = [x, y];
  }
  async function centre(target) {
    const loc = typeof target === 'string' ? page.locator(target).first() : target;
    const b = await loc.boundingBox(); if (!b) throw new Error('no box for ' + target);
    return [b.x + b.width / 2, b.y + b.height / 2];
  }
  async function moveTo(target, ms) { const [x, y] = await centre(target); await glide(x, y, ms); }
  async function click(target, ms = 900, opts = {}) {
    if (target) await moveTo(target, ms);
    await sleep(opts.hover ?? 180);
    clicks.push(now());
    await page.mouse.down(); await sleep(90); await page.mouse.up();
  }
  async function scrollBy(dy, ms = 900) {
    await page.evaluate(([dy, ms]) => new Promise(res => {
      const s = scrollY, t0 = performance.now();
      const f = n => { const t = Math.min(1, (n - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        scrollTo(0, s + dy * e); t < 1 ? requestAnimationFrame(f) : res(); };
      requestAnimationFrame(f);
    }), [dy, ms]);
  }
  async function type(text, ms = 70) { for (const ch of text) { await page.keyboard.type(ch); await sleep(ms); } }
  async function reveal(target, ms = 850) {
    const loc = typeof target === 'string' ? page.locator(target).first() : target;
    const off = await loc.evaluate(el => { const b = el.getBoundingClientRect(); return b.top < 70 || b.bottom > innerHeight - 40; });
    if (!off) return;
    await loc.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })); await sleep(ms);
  }
  async function stop() {
    const end = now();
    await sleep(200);
    await cdp.send('Page.stopScreencast').catch(() => {});
    await browser.close();
    // concat list with real frame durations, then resample to a steady 30 fps
    const list = path.join(dir, 'list.txt'); let s = '';
    frames.forEach((f, i) => { const next = i + 1 < frames.length ? frames[i + 1].t : end; s += `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`; });
    s += `file '${frames[frames.length - 1].file}'\n`;
    fs.writeFileSync(list, s);
    const out = path.join(__dirname, 'clips', name + '.mp4'); fs.mkdirSync(path.dirname(out), { recursive: true });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
      '-vf', `fps=30,scale=${OW}:${OH}:flags=lanczos,format=yuv420p`, '-t', end.toFixed(3), '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', out]);
    fs.writeFileSync(path.join(__dirname, 'clips', name + '.json'), JSON.stringify({ duration: end, clicks, frames: frames.length }));
    console.log(name, 'duration', end.toFixed(2), 'frames', frames.length, 'fps~', (frames.length / end).toFixed(1), 'clicks', clicks.map(c => c.toFixed(2)).join(','));
  }
  return { page, glide, moveTo, click, scrollBy, stop, sleep, now, centre, type, reveal };
}

module.exports = { startRecording, sleep, W, H, PHONE };
