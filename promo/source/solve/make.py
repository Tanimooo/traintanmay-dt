"""Build one 'real exam question, solved step by step' video.
usage: python3 make.py videos/<id>.json <workdir> [--stage all|tts|sched|outro|frames|mux] [--preview t1,t2,...]
Needs: repo served on :8765 (python3 -m http.server 8765 from the repo root), Kokoro model dir in $KOKORO,
pdf.js build dir in $PDFJS_DIR (only in sandboxes where cdnjs is blocked)."""
import json, os, re, subprocess, sys, urllib.request
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '../../..'))
spec_path = sys.argv[1]; W = sys.argv[2]; stage = sys.argv[sys.argv.index('--stage') + 1] if '--stage' in sys.argv else 'all'
spec = json.load(open(spec_path)); os.makedirs(W, exist_ok=True)
run = lambda *a, **k: subprocess.run(list(a), check=True, **k)
def want(s): return stage in ('all', s)

if want('tts') and not os.path.exists(f'{W}/voice/durations.json'):
    run('python3', f'{HERE}/tts.py', spec_path, f'{W}/voice', os.environ['KOKORO'])

# --- question crop from the official paper (rendered at 300 dpi; box is in 110-dpi pixels) ---
pdf = f'{W}/paper.pdf'
if not os.path.exists(pdf): urllib.request.urlretrieve(spec['pdf'], pdf)
if not os.path.exists(f'{W}/crop.png'):
    from PIL import Image
    run('pdftoppm', '-r', '300', '-f', str(spec['page']), '-l', str(spec['page']), '-png', '-singlefile', pdf, f'{W}/page')
    k = 300 / 110; x0, y0, x1, y1 = spec['box']
    Image.open(f'{W}/page.png').crop((int(x0 * k), int(y0 * k), int(x1 * k), int(y1 * k))).save(f'{W}/crop.png')

# --- schedule: line starts, marker times (by character position), word timings for captions ---
durs = json.load(open(f'{W}/voice/durations.json')); t = 0.3; lines = []; events = []; words = []; chunk = 0
for i, l in enumerate(spec['lines']):
    raw = l['say']; clean = re.sub(r'\{\w+\}', '', raw); d = durs[i]
    pos = {}; acc = ''
    for part in re.split(r'(\{\w+\})', raw):
        m = re.fullmatch(r'\{(\w+)\}', part)
        if m: pos[m.group(1)] = len(acc)
        else: acc += part
    T = lambda c: t + d * c / max(1, len(clean))
    for e in l.get('ev', []):
        e = dict(e); e['t'] = round(t + d if e['at'] == 'end' else T(pos[e['at']]), 3); events.append(e)
    # words: character-proportional timing; chunks of ≤ 5 words, broken at punctuation
    c = 0; n = 0
    for w in clean.split():
        i0 = clean.index(w, c); c = i0 + len(w)
        words.append({'w': w, 't0': round(T(i0), 3), 'lineEnd': round(t + d, 3), 'chunk': chunk}); n += 1
        if n >= 5 or re.search(r'[.,!?:]$', w): chunk += 1; n = 0
    if n: chunk += 1
    lines.append({'i': i, 'start': round(t, 3), 'dur': d}); t += d + l.get('gap', 0.35)
total = round(t + 0.2, 2)
o = next((e for e in events if e['do'] == 'outro'), None)
sched = {k: spec[k] for k in ('tag', 'series', 'options', 'answer', 'marks', 'box')}
from PIL import Image
cw, ch = Image.open(f'{W}/crop.png').size
sched.update(lines=lines, events=events, words=words, total=total,
             crop={'src': f'/__f{W}/crop.png', 'w': cw, 'h': ch})
if 'compact' in spec: sched['compact'] = {'t': lines[spec['compact']['line']]['start'], 'h': spec['compact']['h']}
odur = round(total - o['t'] + 0.2, 2) if o else 0
if o and want('outro'):
    run('node', f'{HERE}/outro.js', spec_path, f'{W}/outro', str(odur))
if o: sched['outro'] = {**json.load(open(f'{W}/outro/outro.json')), 'dir': f'/__f{W}/outro'} if os.path.exists(f'{W}/outro/outro.json') else {}
json.dump(sched, open(f'{W}/sched.json', 'w'), indent=1)
print('total', total, 's · outro', odur, 's')

if '--preview' in sys.argv:   # a few stills for checking layout
    ts = sys.argv[sys.argv.index('--preview') + 1]
    run('node', '-e', f"""
const {{chromium}}=require('playwright');const S=require('{W}/sched.json');
(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1080,height:1920}}}});
await p.route('**/__f/**',r=>r.fulfill({{path:decodeURIComponent(new URL(r.request().url()).pathname.slice(4))}}));
await p.addInitScript(s=>{{window.SCHED=s}},S);p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/promo/source/solve/render.html');await p.evaluate(()=>window.READY);
for(const t of [{ts}]){{await p.evaluate(t=>window.setT(t),t);await p.screenshot({{path:'{W}/prev_'+t+'.png'}});}}
await b.close();}})();""")
    sys.exit()

if want('frames'):
    run('rm', '-rf', f'{W}/frames'); run('node', f'{HERE}/render.js', f'{W}/sched.json', f'{W}/frames')

if want('mux'):
    SR = 48000; N = int(total * SR); mix = np.zeros(N)
    for L in lines:
        v, vsr = sf.read(f"{W}/voice/{L['i']:02d}.wav"); v = resample_poly(v, SR // 1000, vsr // 1000)
        a = int(L['start'] * SR); v = v[:N - a]; mix[a:a + len(v)] += v
    sf.write(f'{W}/voice.wav', mix / max(1e-9, np.abs(mix).max()) * .9, SR)
    out = os.path.join(REPO, 'promo', 'daily', spec['id'] + '.mp4'); os.makedirs(os.path.dirname(out), exist_ok=True)
    run('ffmpeg', '-loglevel', 'error', '-y', '-framerate', '30', '-i', f'{W}/frames/f_%05d.jpg', '-i', f'{W}/voice.wav',
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', '-shortest', out)
    run('ffmpeg', '-loglevel', 'error', '-y', '-i', f'{W}/frames/f_00045.jpg', '-q:v', '3', out.replace('.mp4', '.jpg'))
    print('wrote', out)
