/* ============================================================
   ESAT home hero: typed maths/physics puns + a projectile
   launcher mini-game on graph paper. Aim with the pointer,
   click (or tap) to launch, hit the yellow target.
   Hero.mount(el) returns a stop() function.
   ============================================================ */
const Hero = (() => {
  const PUNS = [
    'Keep calm and differentiate.',
    'You’ve got potential. Let’s make it kinetic.',
    'I’m having a moment… of inertia.',
    'Integrate revision into your day. It all adds up.',
    'Never trust an atom. They make up everything.',
    'Stay positive – you’re on the right vector.',
    'Be rational. Get real.',
    'Resistance is futile (unless it’s under 1 Ω).',
    'My sine-ificant other is cos.',
    'Tangent? Let’s stay on topic.',
    'Friction is a drag. Revision doesn’t have to be.',
    '27 questions, 40 minutes. Let’s get the ball rolling.',
    'Don’t be mean – find the median.',
    'Feeling dense? Divide your mass by your volume.',
  ];

  const SYMBOLS = ['π', 'Σ', '∫', '√', 'Δ', 'λ', 'Ω', '∞', 'θ', 'dy/dx', 'F = ma', 'E = mc²', 'v = fλ', 'e^iπ', 'sin θ', 'ln x'];

  function css(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* ---------- typed puns ---------- */
  function puns(h1, onStop) {
    const P = PUNS.slice().sort(() => Math.random() - 0.5);
    let i = 0, tm = null, alive = true;
    const later = (f, ms) => { tm = setTimeout(() => alive && f(), ms); };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function type(str, n = 0) {
      h1.classList.add('typing');
      h1.textContent = str.slice(0, n);
      if (n < str.length) later(() => type(str, n + 1), 34 + Math.random() * 50);
      else later(() => erase(str, str.length), 4200);
    }
    function erase(str, n) {
      h1.textContent = str.slice(0, n);
      if (n > 0) later(() => erase(str, n - 1), 16);
      else { i = (i + 1) % P.length; later(() => type(P[i]), 280); }
    }
    h1.title = 'Click for another pun';
    if (reduce) {
      h1.textContent = P[0];
      h1.onclick = () => { i = (i + 1) % P.length; h1.textContent = P[i]; };
    } else {
      type(P[0]);
      h1.onclick = () => { clearTimeout(tm); erase(h1.textContent, h1.textContent.length); };
    }
    onStop(() => { alive = false; clearTimeout(tm); });
  }

  /* ---------- projectile launcher ---------- */
  function launcher(box, onStop) {
    const cv = document.createElement('canvas');
    cv.setAttribute('aria-label', 'Projectile launcher game: aim with the pointer and click to launch at the target');
    cv.setAttribute('role', 'img');
    box.prepend(cv);
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const G = 9.81;
    let W = 0, H = 0, S = 1; // px size + px per metre
    let dpr = Math.min(2, devicePixelRatio || 1);
    const pad = { l: 34, b: 30 };
    const WORLD_W = 34; // metres across

    let aim = { th: (50 * Math.PI) / 180, u: 15 }; // launch angle + speed
    let userAiming = false;
    let ball = null; // {x,y,vx,vy,t,trail,bounces}
    let target = { x: 22, w: 2.4 };
    let hits = 0, shots = 0;
    let burst = null; // {x,y,t}
    let symbols = [];
    let last = performance.now();
    let idle = 0;
    let colours = {};
    let frameN = 0;
    let raf = 0, alive = true;

    function readColours() {
      colours = {
        ink: css('--color-text', '#1c1a12'),
        muted: css('--color-text-muted', '#5f5a4a'),
        faint: css('--color-text-faint', '#9a9482'),
        line: css('--color-divider', '#e2ded0'),
        fill: css('--brand-fill', '#ffc917'),
        brand: css('--color-primary', '#855700'),
        good: css('--color-success', '#1f7a50'),
        surface: css('--color-surface', '#ffffff'),
      };
    }

    function size() {
      const r = box.getBoundingClientRect();
      W = Math.max(200, r.width);
      H = Math.max(180, r.height);
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      S = (W - pad.l - 16) / WORLD_W;
      if (!symbols.length) {
        const n = Math.round(W / 70);
        for (let k = 0; k < n; k++) {
          symbols.push({
            s: SYMBOLS[k % SYMBOLS.length],
            x: Math.random() * W, y: Math.random() * H,
            vy: -(0.06 + Math.random() * 0.12), vx: (Math.random() - 0.5) * 0.05,
            sz: 13 + Math.random() * 14, rot: (Math.random() - 0.5) * 0.5,
          });
        }
      }
    }

    const X = (m) => pad.l + m * S;
    const Y = (m) => H - pad.b - m * S;
    const worldTop = () => (H - pad.b - 12) / S;

    function newTarget() {
      const maxR = Math.min(WORLD_W - 3, (20 * 20) / G);
      target.x = 8 + Math.random() * (maxR - 10);
    }

    function launch() {
      const { th, u } = aim;
      ball = { x: 0, y: 0, vx: u * Math.cos(th), vy: u * Math.sin(th), t: 0, trail: [[0, 0]], bounces: 0, fade: 1, scored: false };
      shots++;
    }

    function autoAim() {
      // pick an angle and solve for the speed that lands on (or near) the target
      const th = ((30 + Math.random() * 40) * Math.PI) / 180;
      const miss = Math.random() < 0.35 ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.8;
      const R = Math.max(4, target.x + miss);
      const u = Math.sqrt((R * G) / Math.sin(2 * th));
      aim = { th, u: Math.min(22, u) };
    }

    function setAimFrom(px, py) {
      const dx = (px - X(0)) / S, dy = (Y(0) - py) / S;
      const th = Math.max(0.12, Math.min(1.45, Math.atan2(Math.max(0.2, dy), Math.max(0.2, dx))));
      const dist = Math.hypot(dx, dy);
      aim = { th, u: Math.max(6, Math.min(22, 5 + dist * 0.75)) };
    }

    /* predicted landing point for the current aim */
    function rangeOf(a) { return (a.u * a.u * Math.sin(2 * a.th)) / G; }
    function flightTime(a) { return (2 * a.u * Math.sin(a.th)) / G; }
    function apex(a) { return (a.u * a.u * Math.sin(a.th) ** 2) / (2 * G); }

    function step(dt) {
      // drifting symbols
      for (const s of symbols) {
        s.y += s.vy * dt * 0.06; s.x += s.vx * dt * 0.06;
        if (s.y < -30) { s.y = H + 20; s.x = Math.random() * W; }
      }
      if (ball) {
        const h = dt / 1000 * 1.25; // a little faster than real time
        ball.t += h;
        ball.vy -= G * h;
        ball.x += ball.vx * h;
        ball.y += ball.vy * h;
        if (ball.y <= 0) {
          ball.y = 0;
          if (!ball.scored && ball.bounces === 0) {
            ball.scored = true;
            if (Math.abs(ball.x - target.x) <= target.w / 2 + 0.35) {
              hits++;
              burst = { x: target.x, y: 0, t: 0 };
              setTimeout(() => alive && newTarget(), 900);
            }
          }
          ball.vy = -ball.vy * 0.45;
          ball.vx *= 0.7;
          ball.bounces++;
          if (ball.bounces > 3 || Math.abs(ball.vy) < 0.6) ball.vy = 0;
        }
        ball.trail.push([ball.x, ball.y]);
        if (ball.trail.length > 400) ball.trail.shift();
        if ((ball.bounces > 3 || ball.vy === 0) && ball.y === 0) ball.fade -= dt / 900;
        if (ball.x > WORLD_W + 2 || ball.fade <= 0) ball = null;
      } else if (!userAiming) {
        idle += dt;
        if (idle > 1600) { idle = 0; autoAim(); launch(); }
      }
      if (burst) { burst.t += dt; if (burst.t > 1100) burst = null; }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // floating symbols
      ctx.save();
      ctx.fillStyle = colours.faint;
      ctx.globalAlpha = 0.28;
      for (const s of symbols) {
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
        ctx.font = `600 ${s.sz}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.fillText(s.s, 0, 0); ctx.restore();
      }
      ctx.restore();

      // axes + ticks
      ctx.strokeStyle = colours.muted; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(X(0), 10); ctx.lineTo(X(0), Y(0)); ctx.lineTo(W - 8, Y(0)); ctx.stroke();
      ctx.fillStyle = colours.muted; ctx.font = '500 10px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      for (let m = 5; m < WORLD_W; m += 5) {
        ctx.beginPath(); ctx.moveTo(X(m), Y(0)); ctx.lineTo(X(m), Y(0) + 4); ctx.stroke();
        ctx.fillText(m + ' m', X(m), Y(0) + 16);
      }
      ctx.textAlign = 'right';
      for (let m = 5; m < worldTop(); m += 5) {
        ctx.beginPath(); ctx.moveTo(X(0) - 4, Y(m)); ctx.lineTo(X(0), Y(m)); ctx.stroke();
        ctx.fillText(String(m), X(0) - 7, Y(m) + 3);
      }
      ctx.textAlign = 'left';

      // target
      const tx0 = X(target.x - target.w / 2), tx1 = X(target.x + target.w / 2);
      ctx.fillStyle = colours.fill;
      ctx.fillRect(tx0, Y(0) - 7, tx1 - tx0, 7);
      ctx.strokeStyle = colours.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(X(target.x), Y(0) - 7); ctx.lineTo(X(target.x), Y(0) - 40); ctx.stroke();
      ctx.fillStyle = colours.fill;
      ctx.beginPath(); ctx.moveTo(X(target.x), Y(0) - 40); ctx.lineTo(X(target.x) + 18, Y(0) - 34); ctx.lineTo(X(target.x), Y(0) - 28); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = colours.ink; ctx.lineWidth = 1; ctx.stroke();

      // predicted path (dashed) for the current aim
      ctx.setLineDash([4, 6]); ctx.strokeStyle = colours.faint; ctx.lineWidth = 1.4;
      ctx.beginPath();
      const T = flightTime(aim);
      for (let k = 0; k <= 60; k++) {
        const t = (T * k) / 60;
        const x = aim.u * Math.cos(aim.th) * t, y = aim.u * Math.sin(aim.th) * t - 0.5 * G * t * t;
        k ? ctx.lineTo(X(x), Y(Math.max(0, y))) : ctx.moveTo(X(x), Y(y));
      }
      ctx.stroke(); ctx.setLineDash([]);

      // launcher barrel + angle arc
      const bl = 34;
      ctx.lineCap = 'round';
      ctx.strokeStyle = colours.ink; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0) + Math.cos(aim.th) * bl, Y(0) - Math.sin(aim.th) * bl); ctx.stroke();
      ctx.strokeStyle = colours.fill; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0) + Math.cos(aim.th) * (bl - 2), Y(0) - Math.sin(aim.th) * (bl - 2)); ctx.stroke();
      ctx.lineCap = 'butt';
      ctx.fillStyle = colours.ink;
      ctx.beginPath(); ctx.arc(X(0), Y(0), 8, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = colours.brand; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(X(0), Y(0), 52, -aim.th, 0); ctx.stroke();
      ctx.fillStyle = colours.brand; ctx.font = '600 12px "IBM Plex Mono", ui-monospace, monospace';
      ctx.fillText('θ', X(0) + 56 * Math.cos(aim.th / 2), Y(0) - 56 * Math.sin(aim.th / 2) + 4);

      // ball + trail
      if (ball) {
        ctx.globalAlpha = Math.max(0, ball.fade);
        ctx.fillStyle = colours.brand;
        for (let k = 0; k < ball.trail.length; k += 3) {
          const [x, y] = ball.trail[k];
          ctx.globalAlpha = Math.max(0, ball.fade) * (0.15 + 0.6 * (k / ball.trail.length));
          ctx.beginPath(); ctx.arc(X(x), Y(y), 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = Math.max(0, ball.fade);
        ctx.fillStyle = colours.fill; ctx.strokeStyle = colours.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(X(ball.x), Y(ball.y) - 6, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // velocity arrow while flying
        if (ball.bounces === 0) {
          const k = 2.2;
          const ex = X(ball.x) + ball.vx * k, ey = Y(ball.y) - 6 - ball.vy * k;
          ctx.strokeStyle = colours.ink; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(X(ball.x), Y(ball.y) - 6); ctx.lineTo(ex, ey); ctx.stroke();
          const a = Math.atan2(ey - (Y(ball.y) - 6), ex - X(ball.x));
          ctx.beginPath(); ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 7 * Math.cos(a - 0.4), ey - 7 * Math.sin(a - 0.4));
          ctx.lineTo(ex - 7 * Math.cos(a + 0.4), ey - 7 * Math.sin(a + 0.4));
          ctx.closePath(); ctx.fillStyle = colours.ink; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // hit burst
      if (burst) {
        const p = burst.t / 1100;
        ctx.save();
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = colours.fill; ctx.lineWidth = 3;
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
          const r0 = 10 + p * 20, r1 = 18 + p * 46;
          ctx.beginPath();
          ctx.moveTo(X(burst.x) + Math.cos(a) * r0, Y(0) - 20 + Math.sin(a) * r0);
          ctx.lineTo(X(burst.x) + Math.cos(a) * r1, Y(0) - 20 + Math.sin(a) * r1);
          ctx.stroke();
        }
        ctx.fillStyle = colours.ink;
        ctx.font = '800 20px "Barlow Semi Condensed", "Arial Narrow", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bullseye!', X(burst.x), Y(0) - 62 - p * 18);
        ctx.restore();
        ctx.textAlign = 'left';
      }
    }

    function readout() {
      const el = box.querySelector('.hero-readout');
      if (!el) return;
      const deg = Math.round((aim.th * 180) / Math.PI);
      el.innerHTML =
        `<span>θ <b>${deg}°</b></span><span>u <b>${aim.u.toFixed(1)} m/s</b></span>` +
        `<span>range <b>${rangeOf(aim).toFixed(1)} m</b></span><span>max height <b>${apex(aim).toFixed(1)} m</b></span>` +
        `<span class="hits">hits <b>${hits}/${shots}</b></span>`;
    }

    function frame(now) {
      if (!alive) return;
      const dt = Math.min(48, now - last); last = now;
      if (frameN++ % 60 === 0) readColours();
      step(dt);
      draw();
      if (frameN % 6 === 0) readout();
      raf = requestAnimationFrame(frame);
    }

    // input
    function local(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function onMove(e) { userAiming = true; idle = 0; setAimFrom(...local(e)); if (reduce) { draw(); readout(); } }
    function onLeave() { userAiming = false; }
    function onDown(e) {
      userAiming = true; idle = 0;
      setAimFrom(...local(e));
      if (!ball || ball.bounces > 0) launch();
      if (reduce) {
        // no animation: resolve the shot instantly
        ball = null;
        const hit = Math.abs(rangeOf(aim) - target.x) <= target.w / 2 + 0.35;
        if (hit) { hits++; burst = { x: target.x, y: 0, t: 450 }; }
        draw(); readout(); burst = null;
        if (hit) setTimeout(() => { if (alive) { newTarget(); draw(); } }, 1200);
      }
    }
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    cv.addEventListener('pointerdown', onDown);
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(box);
    const onTheme = () => { readColours(); draw(); };
    window.addEventListener('themechange', onTheme);

    readColours();
    size();
    newTarget();
    if (reduce) { autoAim(); draw(); readout(); }
    else raf = requestAnimationFrame((t) => { last = t; frame(t); });

    onStop(() => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('themechange', onTheme);
    });
  }

  function mount(root) {
    const stops = [];
    const onStop = (f) => stops.push(f);
    const h1 = root.querySelector('#pun');
    if (h1) puns(h1, onStop);
    const box = root.querySelector('#hero-play');
    if (box) launcher(box, onStop);
    return () => stops.splice(0).forEach((f) => { try { f(); } catch (e) {} });
  }

  return { mount };
})();
