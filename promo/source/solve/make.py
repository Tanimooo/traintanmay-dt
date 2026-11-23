"""Build one animated 'real exam question, solved step by step' video.

usage: python3 make.py videos/<id>.json <workdir> [--stage all|sched|outro|frames|mux] [--preview 3,20,40]
Needs: the repo served on :8765 (python3 -m http.server 8765 from the repo root), the Kokoro model dir in
$KOKORO, and in sandboxes where cdnjs is blocked, a pdfjs-dist@3.11.174 build dir in $PDFJS_DIR.
Output: promo/daily/<id>.mp4 (+ .jpg cover)."""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '../../..'))
spec_path = os.path.abspath(sys.argv[1]); W = os.path.abspath(sys.argv[2])
arg = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
stage = arg('--stage', 'all'); want = lambda s: stage in ('all', s)
spec = json.load(open(spec_path)); os.makedirs(W, exist_ok=True)
run = lambda *a: subprocess.run(list(a), check=True)

# --- narration (cached: delete <workdir>/voice to redo it) ---
if not os.path.exists(f'{W}/voice/durations.json'):
    run('python3', f'{HERE}/tts.py', spec_path, f'{W}/voice', os.environ['KOKORO'])
durs = json.load(open(f'{W}/voice/durations.json'))

# --- schedule: line starts, {marker} times (by character position in the line), word timings for captions ---
t = 0.25; lines = []; events = []; words = []; T = {}; chunk = 0
for i, l in enumerate(spec['lines']):
    raw = l['say']; clean = re.sub(r'\{\w+\}', '', raw); d = durs[i]; pos = {}; acc = ''
    for part in re.split(r'(\{\w+\})', raw):
        m = re.fullmatch(r'\{(\w+)\}', part)
        if m: pos[m.group(1)] = len(acc)
        else: acc += part
    at = lambda c: round(t + d * c / max(1, len(clean)), 3)
    for k, c in pos.items(): T[k] = at(c)
    T[f'L{i}'] = round(t, 3); T[f'E{i}'] = round(t + d, 3)
    for e in l.get('ev', []):
        e = dict(e); e['t'] = round(t + d, 3) if e['at'] == 'end' else T[e['at']] if e['at'] in T else at(pos[e['at']])
        events.append(e)
        if e['do'] == 'outro': T['outro'] = e['t']
    c = 0; n = 0
    for w in clean.split():
        i0 = clean.index(w, c); c = i0 + len(w)
        words.append({'w': w, 't0': at(i0), 'lineEnd': round(t + d, 3), 'chunk': chunk}); n += 1
        if n >= 5 or re.search(r'[.,!?:]$', w): chunk += 1; n = 0
    if n: chunk += 1
    lines.append({'i': i, 'start': round(t, 3), 'dur': d}); t += d + l.get('gap', 0.3)
total = round(t + 0.3, 2)
if 'compact' in spec: T['compact'] = T[f"L{spec['compact']}"]
sched = {k: spec.get(k) for k in ('tag', 'series', 'q', 'qShort', 'options', 'answer')}
sched.update(scene=spec['id'], lines=lines, events=events, words=words, total=total, T=T)
odur = round(total - T['outro'] + 0.1, 2) if 'outro' in T else 0
if odur and want('outro'):
    run('rm', '-rf', f'{W}/outro'); run('node', f'{HERE}/outro.js', spec_path, f'{W}/outro', str(odur))
if os.path.exists(f'{W}/outro/outro.json'):
    sched['outro'] = {**json.load(open(f'{W}/outro/outro.json')), 'dir': f'/__f{W}/outro'}
json.dump(sched, open(f'{W}/sched.json', 'w'), indent=1)
print(f"{spec['id']}: {total} s (outro {odur} s)")

scene_js = os.path.join(HERE, 'scenes', spec['id'] + '.js')
def browser(js_body):
    run('node', '-e', """
const {chromium}=require('playwright');const fs=require('fs');const S=JSON.parse(fs.readFileSync('%s'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.route('**/__f/**',r=>r.fulfill({path:decodeURIComponent(new URL(r.request().url()).pathname.slice(4))}));
await p.addInitScript(s=>{window.SCHED=s;window.SCENES={};},S);
await p.addInitScript({content:fs.readFileSync('%s','utf8')});
p.on('pageerror',e=>{console.log('ERR',e.message);process.exitCode=1});
await p.goto('http://localhost:8765/promo/source/solve/anim.html');await p.evaluate(()=>window.READY);
%s
await b.close();})();""" % (f'{W}/sched.json', scene_js, js_body))

if arg('--preview'):
    browser("for(const t of [%s]){await p.evaluate(t=>window.setT(t),t);await p.screenshot({path:'%s/prev_'+t+'.png'});}" % (arg('--preview'), W))
    sys.exit()

if want('frames'):
    run('rm', '-rf', f'{W}/frames'); os.makedirs(f'{W}/frames')
    browser("const N=Math.ceil(S.total*30);for(let i=0;i<N;i++){await p.evaluate(t=>window.setT(t),i/30);"
            "await p.screenshot({path:'%s/frames/f_'+String(i).padStart(5,'0')+'.jpg',type:'jpeg',quality:93});}" % W)

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
    run('ffmpeg', '-loglevel', 'error', '-y', '-i', f'{W}/frames/f_{int(spec.get("cover", T.get("ans", 3) + 1.2) * 30):05d}.jpg', '-q:v', '3', out.replace('.mp4', '.jpg'))
    print('wrote', out)
