"""Assemble "How to use TrainTanmay". MODE=phone python3 howto/build.py for the vertical cut."""
import json, os, re, subprocess, sys, wave
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__)); AD = os.path.dirname(HERE)
sys.path.insert(0, HERE); from script import STEPS, CHAPTERS
PHONE = os.environ.get('MODE') == 'phone'; SUF = '-phone' if PHONE else ''
VW, VH = (1080, 1920) if PHONE else (1920, 1080)
C = lambda n: os.path.join(AD, 'clips', n)
OUT = os.path.join(AD, 'out'); os.makedirs(OUT, exist_ok=True)
SAY = {s[0]: s for s in STEPS}
XF = 0.3

def dur(path): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]))
# (clip, in, out)
segs = [('intro', 0, 3.7)]
for n in ['h_main', 'h_dt', 'h_ph', 'h_ma', 'h_es', 'h_save', 'h_league', 'h_access', 'h_end']:
    segs.append((n, 0.15, dur(C(n + SUF + '.mp4')) - 0.05))
segs.append(('outro', 3.2, 7.5))
starts, t = [], 0.0
for i, (n, a, b) in enumerate(segs):
    if i: t -= XF
    starts.append(t); t += b - a
TOTAL = t
lines = []  # (id, start)
for i, (n, a, b) in enumerate(segs):
    p = C(n + SUF + '.marks.json')
    if os.path.exists(p):
        for sid, mt in json.load(open(p)): lines.append((sid, starts[i] + mt - a))
clicks = []
for i, (n, a, b) in enumerate(segs):
    p = C(n + SUF + '.json')
    if os.path.exists(p):
        for c in json.load(open(p))['clicks']:
            if a <= c <= b: clicks.append(starts[i] + c - a)
VD = json.load(open(os.path.join(HERE, 'voice', 'durations.json')))
print('total %.1f s, %d lines' % (TOTAL, len(lines)))

# ---------------- audio ----------------
SR = 44100; N = int((TOTAL + 1) * SR)
voice = np.zeros(N)
for sid, st in lines:
    v, vsr = sf.read(os.path.join(HERE, 'voice', sid + '.wav'))
    v = resample_poly(v, 441, 240)
    i = int(st * SR); voice[i:i + len(v)] += v[:N - i]
voice = voice / (np.max(np.abs(voice)) + 1e-9) * 0.9
# gentle de-ess-ish high shelf cut and a touch of warmth
voice = sosfilt(butter(1, 9000, 'low', fs=SR, output='sos'), voice) * 0.92 + voice * 0.08

rng = np.random.default_rng(3)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, n): tt = np.arange(n) / SR; return 2 * ((f * tt + rng.random()) % 1.0) - 1
def pad(fs_, n):
    x = sum(saw(f * (1 + d), n) for f in fs_ for d in (-0.006, 0, 0.006)) / (3 * len(fs_))
    e = np.minimum(1, np.arange(n) / SR / 0.6) * np.minimum(1, (n - np.arange(n)) / SR / 0.6)
    return lp(x, 1400) * e
BPM = 92; BEAT = 60 / BPM; BAR = 4 * BEAT
PROG = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67]]  # Cmaj7 Am7 Fmaj7 G
music = np.zeros(N)
bi = 0; tb = 0.0
while tb < TOTAL + BAR:
    ch = PROG[bi % 4]; n = int(BAR * 1.15 * SR); i = int(tb * SR)
    seg = pad([note(m) for m in ch], n) * 0.5 + pad([note(ch[0] - 24)], n) * 0.5
    music[i:i + n] += seg[:max(0, N - i)]
    for s in range(8):  # soft plucked arpeggio
        m = ch[[0, 2, 1, 3, 2, 1, 3, 2][s]] + 12; nn = int(0.6 * SR); tt = np.arange(nn) / SR
        pl = np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 6) * 0.25 + np.sin(4 * np.pi * note(m) * tt) * np.exp(-tt * 9) * 0.06
        j = int((tb + s * BEAT / 2) * SR); music[j:j + nn] += pl[:max(0, N - j)]
    bi += 1; tb += BAR
music = music / (np.max(np.abs(music)) + 1e-9)
# duck under the voice
env = np.abs(voice); k = int(0.25 * SR)
env = np.convolve(env, np.ones(k) / k, mode='same'); env = np.clip(env / 0.05, 0, 1)
env = np.convolve(env, np.ones(int(0.4 * SR)) / int(0.4 * SR), mode='same')
gain = 0.16 - 0.10 * env
tt = np.arange(N) / SR
gain *= np.clip(tt / 1.5, 0, 1) * np.clip((TOTAL - tt) / 2.5, 0, 1)
gain[tt < 3.7] *= 1.9; gain[tt > TOTAL - 4.3] *= 1.9   # louder over the title and end cards
sfx = np.zeros(N)
for c in clicks:
    nn = int(0.04 * SR); x = np.arange(nn) / SR
    tick = np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 220) + 0.5 * np.sin(2 * np.pi * 700 * x) * np.exp(-x * 120)
    i = int(c * SR); sfx[i:i + nn] += tick[:max(0, N - i)] * 0.12
mix = voice + music * gain + sfx
mix = np.tanh(mix * 1.05) / np.tanh(1.05)
mix = mix / np.max(np.abs(mix)) * 0.92
st = np.stack([mix, mix], 1)
with wave.open(os.path.join(OUT, 'howto' + SUF + '.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())

# ---------------- subtitles ----------------
MAXC = 64 if PHONE else 92
def chunks(text, d):
    if len(text) <= MAXC: return [(0, d, text)]
    parts = re.split(r'(?<=[.!?,:])\s+', text); out, cur = [], ''
    for p in parts:
        if cur and len(cur) + 1 + len(p) > MAXC: out.append(cur); cur = p
        else: cur = (cur + ' ' + p).strip()
    if cur: out.append(cur)
    total = sum(len(c) for c in out); res, t0 = [], 0.0
    for c in out: dd = d * len(c) / total; res.append((t0, t0 + dd, c)); t0 += dd
    return res
def ts(x, ass=True):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}" if ass else f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
fs_, mv, ml = (58, 230, 70) if PHONE else (54, 56, 160)
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {VW}
PlayResY: {VH}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Display Black,{fs_},&H00FFFFFF,&H000000FF,&H00220B0E,&H8C220B0E,0,0,0,0,100,100,0,0,1,5,2,2,{ml},{ml},{mv},1
Style: Chap,Inter Display Black,{44 if PHONE else 38},&H00220B0E,&H000000FF,&H0017C9FF,&H00000000,0,0,0,0,100,100,1,0,3,14,0,{8 if PHONE else 7},40,40,{262 if PHONE else 120},1
Style: Big,Inter Display Black,{64 if PHONE else 58},&H00220B0E,&H000000FF,&H0017C9FF,&H00000000,0,0,0,0,100,100,2,0,3,22,0,2,40,40,{560 if PHONE else 150},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ass += f"Dialogue: 2,{ts(2.0)},{ts(3.6)},Big,,0,0,0,,{{\\fad(150,150)}}HOW TO USE · A QUICK TOUR\n"
srt, k = '', 0
ends = {}
for sid, st in lines:
    text = SAY[sid][3] or SAY[sid][2]
    for a, b, c in chunks(text, VD[sid]):
        ass += f"Dialogue: 0,{ts(st + a)},{ts(st + b + 0.05)},Cap,,0,0,0,,{{\\fad(80,60)}}{c}\n"
        k += 1; srt += f"{k}\n{ts(st + a, False)} --> {ts(st + b + 0.05, False)}\n{c}\n\n"
    ends[sid] = st + VD[sid]
# chapter labels: from the chapter's first line to just before the next chapter
order = []
for sid, st in lines:
    ch = SAY[sid][1]
    if not order or order[-1][0] != ch: order.append([ch, st, ends[sid]])
    else: order[-1][2] = ends[sid]
for i, (ch, a, b) in enumerate(order):
    b = order[i + 1][1] - 0.2 if i + 1 < len(order) else b + 0.4
    ass += f"Dialogue: 1,{ts(a)},{ts(b)},Chap,,0,0,0,,{{\\fad(200,200)}}{i + 1}  {CHAPTERS[ch].upper()}\n"
open(os.path.join(OUT, 'howto' + SUF + '.ass'), 'w').write(ass)
open(os.path.join(OUT, 'howto' + SUF + '.srt'), 'w').write(srt)
# a WebVTT copy too, for players that want separate captions
open(os.path.join(OUT, 'howto' + SUF + '.vtt'), 'w').write('WEBVTT\n\n' + re.sub(r'(\d\d:\d\d:\d\d),(\d\d\d)', r'\1.\2', re.sub(r'^\d+\n', '', srt, flags=re.M)))

# ---------------- video ----------------
inputs, fc = [], []
for i, (n, a, b) in enumerate(segs):
    inputs += ['-i', C(n + SUF + '.mp4')]
    fc.append(f"[{i}:v]trim={a}:{b},setpts=PTS-STARTPTS,fps=30,scale={VW}:{VH},setsar=1,format=yuv420p[v{i}]")
prev, acc = 'v0', segs[0][2] - segs[0][1]
for i in range(1, len(segs)):
    off = acc - XF; lab = f'x{i}'
    fc.append(f"[{prev}][v{i}]xfade=transition=fade:duration={XF}:offset={off:.3f}[{lab}]")
    prev = lab; acc = off + (segs[i][2] - segs[i][1])
assp = os.path.join(OUT, 'howto' + SUF + '.ass').replace(':', '\\:')
fc.append(f"[{prev}]ass='{assp}'[vout]")
dst = os.path.join(OUT, 'howto' + SUF + '.mp4')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-i', os.path.join(OUT, 'howto' + SUF + '.wav'), '-filter_complex', ';'.join(fc),
                '-map', '[vout]', '-map', f'{len(segs)}:a', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-t', f'{TOTAL:.3f}', dst], check=True)
print('done', dst, round(TOTAL, 1))
