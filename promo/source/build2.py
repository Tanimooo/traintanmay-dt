"""Assemble the TrainTanmay ad. MODE=phone python3 build2.py for the vertical cut."""
import json, os, re, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt

PHONE = os.environ.get('MODE') == 'phone'
SUF = '-phone' if PHONE else ''
HERE = os.path.dirname(os.path.abspath(__file__))
C = lambda n: os.path.join(HERE, 'clips', n)
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)
VW, VH = (1080, 1920) if PHONE else (1920, 1080)

# (key, clip, in, out, speed)
if PHONE:
    segs = [('intro', 'intro', 0, 3.4, 1), ('home', 'chem', 0.3, 4.55, 1), ('newchem', 'newchem', 0, 1.6, 1), ('chemB', 'chem', 5.9, 17.6, 1.35),
            ('newlogin', 'newlogin', 0, 1.6, 1), ('login', 'login', 0.4, 8.8, 1.25), ('newboard', 'newboard', 0, 1.6, 1), ('league', 'league', 0.5, 16.6, 1.45),
            ('dt', 'c_dt', 1.0, 4.0, 1.4), ('ph', 'c_ph', 1.2, 4.3, 1.45), ('ma', 'c_ma', 0.4, 3.7, 1.6), ('es', 'c_es', 0.8, 3.3, 1.2),
            ('access', 'access', 0, 5.0, 1), ('outro', 'outro', 0, 6.0, 1)]
    XF = 0.4
else:
    segs = [('intro', 'intro', 0, 3.75, 1), ('home', 'chem', 0.3, 9.18, 1), ('newchem', 'newchem', 0, 1.8, 1), ('chemB', 'chem', 9.8, 25.2, 1.25),
            ('newlogin', 'newlogin', 0, 1.8, 1), ('login', 'login', 0.5, 11.7, 1.2), ('newboard', 'newboard', 0, 1.8, 1), ('league', 'league', 0.5, 24.0, 1.5),
            ('dt', 'c_dt', 0.5, 3.5, 1.1), ('ph', 'c_ph', 0.5, 3.33, 1.0), ('ma', 'c_ma', 0.4, 3.8, 1.2), ('es', 'c_es', 1.0, 4.28, 1.1),
            ('access', 'access', 0, 5.6, 1), ('outro', 'outro', 0, 7.5, 1)]
    XF = 0.5
starts, t = [], 0.0
for i, s in enumerate(segs):
    if i == 1: t -= XF
    starts.append(t); t += (s[3] - s[2]) / s[4]
TOTAL = t
K = {s[0]: starts[i] for i, s in enumerate(segs)}
END = {s[0]: starts[i] + (s[3] - s[2]) / s[4] for i, s in enumerate(segs)}
IDX = {s[0]: i for i, s in enumerate(segs)}
def at(key, src_t):
    k, n, a, b, sp = segs[IDX[key]]; return K[key] + (src_t - a) / sp
def meta(clip): p = C(clip + SUF + '.json'); return json.load(open(p)) if os.path.exists(p) else {'clicks': []}
def clk(key, i): return at(key, meta(segs[IDX[key]][1])['clicks'][i])
clicks = []
for k, n, a, b, sp in segs:
    for c in meta(n)['clicks']:
        if a <= c <= b: clicks.append(at(k, c))
stingers = [K['newchem'], K['newlogin'], K['newboard']]
print('total %.2f' % TOTAL, {k: round(v, 2) for k, v in K.items()})

# ---------------- soundtrack ----------------
SR = 44100
N = int((TOTAL + 0.5) * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
BPM = 126.0; BEAT = 60 / BPM; BAR = 4 * BEAT
DROP = stingers[0]           # groove kicks in with the Chemistry stinger
T0 = DROP - 6 * BAR           # grid aligned so the drop lands on a downbeat
OUTRO = K['outro']; ACCESS = K['access']
END_HIT = OUTRO + 3.5         # "TrainTanmay" slams in on the end card

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, t, gain=1.0, pan=0.0):
    i = int(round(t * SR));
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[:N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan)); R[i:i + len(sig)] += sig * gain * (1 + min(0, pan))
def env(n, a=0.005, d=0.2):
    tt = np.arange(n) / SR; e = np.minimum(1, tt / a) * np.exp(-tt / d); return e
def note(m): return 440 * 2 ** ((m - 69) / 12)

def kick():
    n = int(.42 * SR); tt = np.arange(n) / SR
    f = 46 + 110 * np.exp(-tt * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(1.6 * np.sin(ph) * np.exp(-tt * 7.5)) + 0.25 * rng.standard_normal(n) * np.exp(-tt * 300)
KICK = kick()
def clap():
    n = int(.25 * SR); x = np.zeros(n); nz = bp(rng.standard_normal(n), 900, 4200)
    for k, o in enumerate([0, .011, .022]):
        i = int(o * SR); x[i:] += nz[:n - i] * np.exp(-np.arange(n - i) / SR / (0.012 if k < 2 else 0.11))
    return x * 0.9
CLAP = clap()
HAT = hp(rng.standard_normal(int(.06 * SR)), 7000) * env(int(.06 * SR), .001, .018)
OHAT = hp(rng.standard_normal(int(.2 * SR)), 6500) * env(int(.2 * SR), .001, .07)

def saw(f, n, det=0):
    tt = np.arange(n) / SR; ph = (f * (1 + det) * tt + rng.random()) % 1.0; return 2 * ph - 1
def supersaw(f, n, voices=5, spread=0.012):
    return sum(saw(f, n, spread * (v - (voices - 1) / 2) / ((voices - 1) / 2)) for v in range(voices)) / voices
def pluck(f, dur, bright=4000):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + supersaw(f, n, 3, 0.006) * 0.6
    return lp(x, bright) * env(n, .002, .12)

# C - G - Am - F  (I V vi IV), bright and catchy
PROG = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64], [53, 57, 60, 65]]
ROOT = [36, 43, 45, 41]
# 2-bar hook over the progression (16ths: (step, midi, len16))
HOOK = [(0, 72, 2), (2, 76, 2), (4, 79, 3), (8, 76, 1), (9, 74, 1), (10, 72, 2), (12, 74, 4),
        (16, 71, 2), (18, 74, 2), (20, 79, 3), (24, 77, 1), (25, 76, 1), (26, 74, 2), (28, 76, 4)]
S16 = BEAT / 4

bars = int((TOTAL - T0) / BAR) + 2
side = np.ones(N)  # sidechain envelope for pads/bass
for bi in range(bars):
    bt = T0 + bi * BAR
    if bt > TOTAL: break
    chord = PROG[bi % 4]; root = ROOT[bi % 4]
    intro = bt < DROP - 1e-6
    outro_tail = bt >= END_HIT + BAR - 1e-6
    build = intro and bt >= DROP - 4 * BAR
    brk = abs(bt - (stingers[2] - BAR)) < BAR / 2   # breakdown bar right before the leaderboard reveal
    # pad (always), filtered darker in the intro
    n = int(BAR * SR)
    pad = sum(supersaw(note(m), n) for m in chord) / len(chord)
    pad = lp(pad, 900 if intro else 2600) * np.minimum(1, np.arange(n) / SR / 0.05) * np.minimum(1, (n - np.arange(n)) / SR / 0.05)
    if bt >= 0: add(pad, bt, 0.16 if not outro_tail else 0.12, 0)
    # arp: 16ths over chord tones, octave up
    tones = [m + 12 for m in chord] + [chord[0] + 24]
    for s in range(16):
        if intro and not build and s % 2: continue
        m = tones[[0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 1, 2][s] % len(tones)]
        add(pluck(note(m), S16 * 1.6, 1800 if intro else 3800), bt + s * S16, 0.07, -0.35 if s % 2 else 0.35)
    if outro_tail: continue
    if intro and not build: continue
    # drums
    for b4 in range(4):
        tb = bt + b4 * BEAT
        if not brk or b4 == 0:
            add(KICK, tb, 0.8)
            i = int(tb * SR); k = int(0.22 * SR)
            if 0 <= i < N: side[i:i + k] = np.minimum(side[i:i + k], 0.35 + 0.65 * np.linspace(0, 1, len(side[i:i + k])) ** 0.6)
        if not intro and b4 in (1, 3) and not brk: add(CLAP, tb, 0.45)
        if not brk:
            add(HAT, tb + BEAT / 2, 0.22, 0.25); add(HAT, tb + BEAT / 4, 0.08, -0.2); add(HAT, tb + 3 * BEAT / 4, 0.08, -0.2)
        if not intro and b4 == 3 and bi % 2: add(OHAT, tb + BEAT / 2, 0.15, 0.3)
    if intro: continue
    # bass: offbeat 8ths, octave pumping
    for e in range(8):
        f = note(root + (12 if e % 4 == 3 else 0)); n8 = int(BEAT / 2 * SR * 0.9)
        b = lp(supersaw(f, n8, 2, 0.004) + 0.6 * np.sin(2 * np.pi * f * np.arange(n8) / SR), 700) * env(n8, .004, .16)
        add(b, bt + e * BEAT / 2 + (BEAT / 4 if e % 2 == 0 else 0), 0.42 if not brk else 0.2)
    # hook lead (every other 2-bar phrase after the drop, always in the outro)
    if (bi % 4 in (0, 1)) and (bt >= K['chemB'] or bt >= OUTRO - BAR):
        off = 0 if bi % 4 == 0 else 16
        for st, m, ln in HOOK:
            if off <= st < off + 16:
                d = ln * S16; n2 = int(d * SR * 1.3); tt = np.arange(n2) / SR
                vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * tt) * np.minimum(1, tt / 0.15)
                ph = 2 * np.pi * np.cumsum(note(m) * vib) / SR
                x = (np.sin(ph) + 0.35 * np.sign(np.sin(ph)) + 0.2 * np.sin(2 * ph)) * env(n2, .006, d * 0.9)
                add(lp(x, 5000), bt + (st - off) * S16, 0.11, 0.1)

# sidechain pump on everything tonal (rough but effective): apply to whole bed, drums re-added below aren't needed
L *= side; R *= side
# re-add kicks un-ducked for punch
for bi in range(bars):
    bt = T0 + bi * BAR
    if bt < DROP - 4 * BAR or bt >= END_HIT + BAR or bt > TOTAL: continue
    brk = abs(bt - (stingers[2] - BAR)) < BAR / 2
    for b4 in range(4):
        if not brk or b4 == 0: add(KICK, bt + b4 * BEAT, 0.35)

# riser into the drop
def riser(d):
    n = int(d * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n); out = np.zeros(n)
    seg = int(0.05 * SR)
    for i in range(0, n, seg):
        f = 400 + 7000 * (i / n) ** 2; out[i:i + seg] = bp(nz[max(0, i - seg):i + seg], f, f * 1.6 + 200)[-len(out[i:i + seg]):]
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / d) ** 2) / SR) * 0.25
    return (out + tone) * (tt / d) ** 2
add(riser(2 * BAR), DROP - 2 * BAR, 0.35)
add(riser(BAR), OUTRO - BAR, 0.25)
# whoosh + impact on every stinger
def whoosh(d=0.6):
    n = int(d * SR); nz = rng.standard_normal(n); out = np.zeros(n); seg = int(0.02 * SR)
    for i in range(0, n, seg):
        p = i / n; f = 300 + 5000 * np.sin(np.pi * p); out[i:i + seg] = bp(nz[max(0, i - seg):i + seg], f, f * 1.8)[-len(out[i:i + seg]):]
    return out * np.sin(np.pi * np.arange(n) / n) ** 2
def impact():
    n = int(1.2 * SR); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-tt * 20)) / SR) * np.exp(-tt * 3.5)
    crash = hp(rng.standard_normal(n), 3000) * np.exp(-tt * 2.8) * 0.35
    return np.tanh(boom * 1.4) + crash
for s in stingers + [ACCESS + 0.15, OUTRO + 3.45]:
    add(whoosh(), s - 0.45, 0.5); add(impact(), s, 0.55)
# second-stinger wipe swish out
for s in stingers: add(whoosh(0.45), s + 1.35, 0.3)
# end chord hit
n = int(3.0 * SR)
hit = sum(supersaw(note(m), n) for m in [48, 60, 64, 67, 72, 76]) / 6
add(lp(hit, 3000) * env(n, .005, 1.1), END_HIT, 0.45)
# UI click SFX (tick + soft pop)
def tick():
    n = int(0.05 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 180) + 0.6 * np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 90) +
            0.3 * hp(rng.standard_normal(n), 4000) * np.exp(-tt * 400))
for c in clicks: add(tick(), c, 0.55)
# confetti sparkle on leaderboard win (finish click + ~1.6s)
fin = clk('league', 3)  # the tab click where Alex takes first place
for k in range(10):
    m = [84, 88, 91, 96][k % 4]; d = .25; nn = int(d * SR); tt = np.arange(nn) / SR
    add(np.sin(2 * np.pi * note(m) * tt) * env(nn, .002, .08), fin + 0.25 + k * 0.06, 0.1, (k % 3 - 1) * 0.5)
add(impact(), fin + 1.6, 0.25)

# master: fades, gentle saturation, normalise
tt = np.arange(N) / SR
fade = np.clip(tt / 0.3, 0, 1) * np.clip((TOTAL - tt) / 2.0, 0, 1)
L *= fade; R *= fade
mx = np.tanh(np.stack([L, R], 1) * 1.2)
mx = mx / np.max(np.abs(mx)) * 0.89
with wave.open(os.path.join(OUT, 'soundtrack' + SUF + '.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mx * 32767).astype('<i2').tobytes())

# ---------------- subtitles ----------------

# ---------------- subtitles ----------------
Y = '{\\c&H17C9FF&}'; O = '{\\c&H3D8AFF&}'; B = '{\\c&HFF8D4A&}'; G = '{\\c&H84DC3D&}'; W = '{\\c&HE7F1F6&}'
lgc = meta('league')['clicks']; L = lambda i: at('league', lgc[i])
if PHONE:
    cb = meta('chem')['clicks']
    subs = [
        (0.3, K['home'] + 0.3, f"Meet {Y}TrainTanmay{W}."),
        (K['home'] + 0.3, K['newchem'] - 0.05, f"Free A level revision... with loads that's {Y}new{W}."),
        (K['chemB'] + 0.1, at('chemB', cb[2]) - 0.05, f"{O}Chemistry{W}: 3D labs, notes and 1,459 exam questions."),
        (at('chemB', cb[2]), at('chemB', cb[3]) - 0.05, "Spin molecules, see every bond angle."),
        (at('chemB', cb[3]), K['newlogin'] - 0.05, "Then flip it into an exam drawing."),
        (K['login'] + 0.1, clk('login', 0) + 0.1, f"{B}Sign in with Google{W}..."),
        (clk('login', 0) + 0.15, K['newboard'] - 0.05, "...and your progress follows you to every device."),
        (K['league'] + 0.1, L(1) - 0.05, f"{Y}Study leagues{W}: a weekly leaderboard with friends."),
        (L(1), L(3) - 0.05, "Share your code. Join up to 5 leagues."),
        (L(3), L(4) - 0.05, f"Every revision minute counts. {Y}Take the crown!{W}"),
        (L(4), K['dt'] - 0.05, "Start a league or join with a code."),
        (K['dt'] + 0.1, K['ma'] - 0.05, "And the classics are still here..."),
        (K['ma'], K['access'] - 0.05, "...D&T, Physics, Maths and the ESAT."),
        (K['access'] + 0.3, K['outro'] - 0.05, f"Built for {G}every learner{W}: dyslexia font, Welsh & Gaelic, colour themes."),
        (K['outro'] + 0.2, K['outro'] + 3.2, "All new. All free."),
        (K['outro'] + 3.4, TOTAL - 0.15, f"{Y}TrainTanmay{W}. Start training today."),
    ]
else:
    cb = meta('chem')['clicks']
    subs = [
        (0.35, 3.5, f"Revising for A levels? Meet {Y}TrainTanmay{W}."),
        (3.7, 7.6, "Five free revision apps, all in one place."),
        (7.6, K['newchem'] - 0.1, f"And there's loads that's {Y}new{W}..."),
        (K['chemB'] + 0.1, at('chemB', cb[1]) - 0.05, f"{O}Chemistry{W}: every topic, notes, past papers and 1,459 exam questions."),
        (at('chemB', cb[1]), at('chemB', cb[4]) - 0.05, "Jump into the labs and spin real 3D molecules."),
        (at('chemB', cb[4]), at('chemB', cb[5]) - 0.05, "Lone pairs, bond angles, every shape you need."),
        (at('chemB', cb[5]), K['newlogin'] - 0.05, "Then flip it into an exam-style drawing."),
        (K['login'] + 0.1, clk('login', 0) + 0.1, f"Now you can {B}sign in with Google{W}."),
        (clk('login', 0) + 0.15, clk('login', 0) + 3.5, "Your progress syncs automatically..."),
        (clk('login', 0) + 3.55, K['newboard'] - 0.05, "...so phone, laptop or school computer, you pick up right where you left off."),
        (K['league'] + 0.1, L(0) + 0.6, f"And the big one: {Y}study leagues{W}."),
        (L(0) + 0.65, L(1) - 0.05, "A weekly leaderboard for you and your friends."),
        (L(1), L(2) - 0.05, "Share your league code to invite them."),
        (L(2), L(3) - 0.05, "Be in up to 5 leagues at once..."),
        (L(3), L(4) - 0.05, f"Every active revision minute counts, so put the hours in and {Y}take the crown{W}!"),
        (L(4), K['dt'] - 0.05, "Start your own league, or join one with a code."),
        (K['dt'] + 0.1, K['ma'] - 0.05, "And the classics are all still here..."),
        (K['ma'], K['access'] - 0.05, "...Design & Technology, Physics, Maths and the ESAT."),
        (K['access'] + 0.3, K['access'] + 2.4, f"And it's built for {G}every learner{W}:"),
        (K['access'] + 2.4, K['outro'] - 0.05, "Dyslexia-friendly font, Welsh and Gaelic, and colour themes."),
        (K['outro'] + 0.2, K['outro'] + 3.3, f"{O}Chemistry{W}. {B}Sign in{W}. {Y}Leaderboards{W}. All new, all free."),
        (K['outro'] + 3.5, TOTAL - 0.2, f"{Y}TrainTanmay{W}. Start training today."),
    ]
labels = [('dt', 'Design & Technology', '&HFF8D4A&'), ('ph', 'Physics', '&H964FFF&'), ('ma', 'Maths', '&H84DC3D&'), ('es', 'ESAT', '&H17C9FF&')]
def ts(x, ass=True):
    h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}" if ass else f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
fs_, mv, ml = (60, 300, 70) if PHONE else (62, 64, 140)
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {VW}
PlayResY: {VH}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter Display Black,{fs_},&H00E7F1F6,&H000000FF,&H00220B0E,&H8C220B0E,0,0,0,0,100,100,0,0,1,5,3,2,{ml},{ml},{mv},1
Style: Lab,Inter Display Black,{64 if PHONE else 58},&H00220B0E,&H000000FF,&H00FFFFFF,&H00000000,0,0,0,0,100,100,0,0,3,16,0,8,40,40,{250 if PHONE else 150},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
for a, b, txt in subs:
    ass += f"Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{{\\fad(120,100)\\t(0,140,\\fscx104\\fscy104)\\t(140,260,\\fscx100\\fscy100)}}{txt}\n"
for k, name, col in labels:
    ass += f"Dialogue: 1,{ts(K[k] + 0.05)},{ts(END[k] - 0.05)},Lab,,0,0,0,,{{\\3c{col}\\fad(80,80)\\t(0,160,\\fscx108\\fscy108)\\t(160,280,\\fscx100\\fscy100)}}{name}\n"
open(os.path.join(OUT, 'subtitles' + SUF + '.ass'), 'w').write(ass)
srt = ''.join(f"{i+1}\n{ts(a, False)} --> {ts(b, False)}\n{re.sub(r'{[^}]*}', '', txt)}\n\n" for i, (a, b, txt) in enumerate(subs))
open(os.path.join(OUT, 'TrainTanmay-ad' + SUF + '.srt'), 'w').write(srt)

# ---------------- render ----------------
inputs, fc = [], []
for i, (k, n, a, b, s) in enumerate(segs):
    inputs += ['-i', C(n + SUF + '.mp4')]
    fc.append(f"[{i}:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{s},fps=30,scale={VW}:{VH},setsar=1,format=yuv420p[v{i}]")
fc.append(f"[v0][v1]xfade=transition=circleopen:duration={XF}:offset={segs[0][3] - XF}[x01]")
fc.append('[x01]' + ''.join(f'[v{i}]' for i in range(2, len(segs))) + f"concat=n={len(segs) - 1}:v=1:a=0[cat]")
assp = os.path.join(OUT, 'subtitles' + SUF + '.ass').replace(':', '\\:')
fc.append(f"[cat]ass='{assp}'[vout]")
dst = os.path.join(OUT, 'TrainTanmay-ad' + SUF + '.mp4')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-i', os.path.join(OUT, 'soundtrack' + SUF + '.wav'), '-filter_complex', ';'.join(fc),
       '-map', '[vout]', '-map', f'{len(segs)}:a', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-t', f'{TOTAL:.3f}', dst], check=True)
print('done', dst, round(TOTAL, 2))
