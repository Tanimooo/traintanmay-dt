"""Build one full-screen 3D solve video (v3.html + scenes3d/<id>.js).

usage: python3 make3.py videos3d/<id>.json <workdir> [--stage all|none|outro|frames|mux] [--preview 2,10,20]
env:   KOKORO (model dir), THREE_DIR (node_modules/three), PDFJS_DIR (only where cdnjs is blocked)
Needs the repo served on :8765 (python3 -m http.server 8765 from the repo root).
Output: promo/daily/<id>.mp4 + .jpg"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '../../..'))
spec_path = os.path.abspath(sys.argv[1]); W = os.path.abspath(sys.argv[2])
arg = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
stage = arg('--stage', 'all'); want = lambda s: stage in ('all', s)
spec = json.load(open(spec_path)); os.makedirs(W, exist_ok=True)
run = lambda *a: subprocess.run(list(a), check=True)

if not os.path.exists(f'{W}/voice/durations.json'):
    run('python3', f'{HERE}/tts.py', spec_path, f'{W}/voice', os.environ['KOKORO'])
durs = json.load(open(f'{W}/voice/durations.json'))

# schedule: {marker} times by character position; word timings for captions
t = 0.3; lines = []; words = []; T = {}; chunk = 0
for i, l in enumerate(spec['lines']):
    raw = l['say']; clean = re.sub(r'\{\w+\}', '', raw); d = durs[i]; pos = {}; acc = ''
    for part in re.split(r'(\{\w+\})', raw):
        m = re.fullmatch(r'\{(\w+)\}', part)
        if m: pos[m.group(1)] = len(acc)
        else: acc += part
    at = lambda c: round(t + d * c / max(1, len(clean)), 3)
    for k, c in pos.items(): T[k] = at(c)
    T[f'L{i}'] = round(t, 3); T[f'E{i}'] = round(t + d, 3)
    c = 0; n = 0
    for w in clean.split():
        i0 = clean.index(w, c); c = i0 + len(w)
        words.append({'w': w, 't0': at(i0), 'lineEnd': round(t + d, 3), 'chunk': chunk}); n += 1
        if n >= 4 or re.search(r'[.,!?:]$', w): chunk += 1; n = 0
    if n: chunk += 1
    lines.append({'i': i, 'start': round(t, 3), 'dur': d}); t += d + l.get('gap', 0.15)
total = round(t + 0.2, 2)
if 'o' in T: T['outro'] = T['o']   # the last line's {o} starts the website outro
sched = {'tag': spec['tag'], 'theme': spec['theme'], 'scene': spec['id'], 'lines': lines, 'words': words, 'total': total, 'T': T}
odur = round(total - T['outro'] + 0.1, 2) if 'outro' in T else 0
if odur and want('outro'):
    run('rm', '-rf', f'{W}/outro'); run('node', f'{HERE}/outro.js', spec_path, f'{W}/outro', str(odur))
if os.path.exists(f'{W}/outro/outro.json'):
    sched['outro'] = {**json.load(open(f'{W}/outro/outro.json')), 'dir': f'/__f{W}/outro'}
json.dump(sched, open(f'{W}/sched.json', 'w'), indent=1)
print(f"{spec['id']}: {total} s (outro {odur} s)")

def browser(body):
    run('node', '-e', """
const {chromium}=require('playwright');const fs=require('fs');const S=JSON.parse(fs.readFileSync('%s'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.route('**/__f/**',r=>r.fulfill({path:decodeURIComponent(new URL(r.request().url()).pathname.slice(4))}));
await p.route('**/__three/**',r=>r.fulfill({path:'%s/'+decodeURIComponent(new URL(r.request().url()).pathname.slice(9)),contentType:'application/javascript'}));
await p.route('**/__scene/**',r=>r.fulfill({path:'%s/scenes3d/'+new URL(r.request().url()).pathname.slice(9),contentType:'application/javascript'}));
await p.addInitScript(s=>{window.SCHED=s;},S);
p.on('pageerror',e=>{console.log('ERR',e.message);process.exitCode=1});p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await p.goto('http://localhost:8765/promo/source/solve/v3.html');await p.waitForFunction(()=>window.setT&&window.READY,null,{timeout:60000});await p.evaluate(()=>window.READY);
%s
await b.close();})();""" % (f'{W}/sched.json', os.environ['THREE_DIR'], HERE, body))

if arg('--preview'):
    browser("for(const t of [%s]){await p.evaluate(t=>window.setT(t),t);await p.screenshot({path:'%s/p_'+t+'.png'});}" % (arg('--preview'), W))
    sys.exit()

if want('frames'):
    run('rm', '-rf', f'{W}/frames'); os.makedirs(f'{W}/frames')
    browser("fs.writeFileSync('%s/sfx.json',JSON.stringify(await p.evaluate(()=>window.SFX())));"
            "const N=Math.ceil(S.total*30);for(let i=0;i<N;i++){await p.evaluate(t=>window.setT(t),i/30);"
            "await p.screenshot({path:'%s/frames/f_'+String(i).padStart(5,'0')+'.jpg',type:'jpeg',quality:92});if(i%%300==0)console.log('frame',i,'/',N);}" % (W, W))

# ---------- audio: voice + original music bed + sound effects ----------
SR = 48000
def bed(N, seed=3):
    rng = np.random.default_rng(seed); out = np.zeros(N); B = 60 / 116
    lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
    note = lambda m: 440 * 2 ** ((m - 69) / 12)
    prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G
    def put(sig, t, g):
        i = int(t * SR); sig = sig[:max(0, N - i)]; out[i:i + len(sig)] += sig * g
    n = int(.22 * SR); tt = np.arange(n) / SR
    kick = np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-tt * 28)) / SR) * np.exp(-tt * 9)
    hat = sosfilt(butter(2, 8000, 'high', fs=SR, output='sos'), rng.standard_normal(int(.05 * SR))) * np.exp(-np.arange(int(.05 * SR)) / SR * 60)
    def pluck(m, d=.4):
        n = int(d * SR); x = np.arange(n) / SR; f = note(m)
        return lp(np.sin(2 * np.pi * f * x) + .4 * np.sign(np.sin(2 * np.pi * f * x)), 3000) * np.exp(-x * 9)
    def bass(m, d):
        n = int(d * SR); x = np.arange(n) / SR; return lp(np.sin(2 * np.pi * note(m) * x) + .3 * np.sin(4 * np.pi * note(m) * x), 400) * np.minimum(1, x / .01) * np.exp(-x * 1.5)
    bar = 0; t = 0
    while t < N / SR:
        ch = prog[bar % 4]
        put(bass(ch[0] - 24, 4 * B), t, .5)
        for k in range(8):
            tk = t + k * B / 2
            if k % 2 == 0: put(kick, tk, .55 if k in (0, 4) else .25)
            put(hat, tk + B / 4, .12)
            put(pluck(ch[[0, 1, 2, 1, 2, 0, 1, 2][k]] + 12), tk, .14)
        bar += 1; t += 4 * B
    return out
def sfx(kind, rng):
    if kind == 'whoosh':
        n = int(.5 * SR); x = np.arange(n) / SR; nz = rng.standard_normal(n); out = np.zeros(n); s = int(.01 * SR)
        for i in range(0, n, s):
            f = 300 + 5000 * np.sin(np.pi * i / n) ** 2; seg = sosfilt(butter(2, [f, min(f * 1.8, 20000)], 'band', fs=SR, output='sos'), nz[max(0, i - 4 * s):i + s])
            out[i:i + s] = seg[-len(out[i:i + s]):]
        return out * np.sin(np.pi * x / x[-1]) ** 2 * .9
    if kind == 'pop':
        n = int(.1 * SR); x = np.arange(n) / SR; return np.sin(2 * np.pi * (700 + 1100 * np.exp(-x * 45)) * x) * np.exp(-x * 40) * .6
    if kind == 'tick':
        n = int(.05 * SR); x = np.arange(n) / SR; return np.sin(2 * np.pi * 2300 * x) * np.exp(-x * 110) * .5
    if kind == 'ding':
        n = int(1.3 * SR); x = np.arange(n) / SR
        return sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(1046, .5, 3), (1568, .35, 4), (2093, .2, 6)])
    if kind == 'slam':
        n = int(.6 * SR); x = np.arange(n) / SR
        return (np.sin(2 * np.pi * np.cumsum(40 + 90 * np.exp(-x * 20)) / SR) * np.exp(-x * 6) + .3 * rng.standard_normal(n) * np.exp(-x * 30)) * .9
    if kind == 'buzz':
        n = int(.35 * SR); x = np.arange(n) / SR; return np.sign(np.sin(2 * np.pi * 110 * x)) * np.exp(-x * 7) * .25
    if kind == 'rewind':
        n = int(.8 * SR); x = np.arange(n) / SR; f = 1200 - 900 * x / x[-1]
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * (.5 + .5 * np.sin(2 * np.pi * 18 * x)) * .25
    if kind == 'riser':
        n = int(1.2 * SR); x = np.arange(n) / SR
        return sosfilt(butter(2, 2000, 'high', fs=SR, output='sos'), rng.standard_normal(n)) * (x / x[-1]) ** 2 * .35
    return np.zeros(10)

if want('mux'):
    N = int(total * SR); voice = np.zeros(N)
    for L in lines:
        v, vsr = sf.read(f"{W}/voice/{L['i']:02d}.wav"); v = resample_poly(v, SR // 1000, vsr // 1000)
        a = int(L['start'] * SR); v = v[:N - a]; voice[a:a + len(v)] += v
    voice /= max(1e-9, np.abs(voice).max())
    fx = np.zeros(N); rng = np.random.default_rng(1)
    for c in json.load(open(f'{W}/sfx.json')):
        if c['t'] is None: continue
        s = sfx(c['kind'], rng); i = int(c['t'] * SR); s = s[:max(0, N - i)]; fx[i:i + len(s)] += s
    end = int(T.get('outro', total) * SR)
    m = bed(N); env = np.convolve(np.abs(voice), np.ones(int(.25 * SR)) / int(.25 * SR), 'same'); env = np.clip(env / .05, 0, 1)
    m *= (.30 - .16 * env); m[end:] *= np.linspace(1, .55, N - end) if N > end else 1
    mix = voice * .9 + fx * .35 + m * .55
    sf.write(f'{W}/mix.wav', mix / np.abs(mix).max() * .95, SR)
    out = os.path.join(REPO, 'promo', 'daily', spec['id'] + '.mp4')
    run('ffmpeg', '-loglevel', 'error', '-y', '-framerate', '30', '-i', f'{W}/frames/f_%05d.jpg', '-i', f'{W}/mix.wav',
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out)
    cov = spec.get('cover', 1.0)
    run('ffmpeg', '-loglevel', 'error', '-y', '-i', f'{W}/frames/f_{int((T[cov] if isinstance(cov, str) else cov) * 30):05d}.jpg', '-q:v', '3', out.replace('.mp4', '.jpg'))
    print('wrote', out)
