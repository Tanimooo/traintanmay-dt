"""Original soundtrack for the Maths "flow" edit, written on the edit's own beat grid (149 BPM).
Every whoosh, paper rip, tap and hit lands on the matching moment in flow.html."""
import json, os, wave
import numpy as np
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__)); AD = os.path.dirname(HERE)
SR = 44100; BPM = 149; B = 60 / BPM
SH = json.load(open(os.path.join(AD, 'www', 'flow', 'shots.json')))
INTRO, GLIDE, OUTRO = 8, 2, 10
G = []; b = INTRO - GLIDE
for s in SH: G.append(b); b += GLIDE + s['hold']
END_HOLD = b; TOTAL_BEATS = b + OUTRO; TOTAL = TOTAL_BEATS * B
N = int((TOTAL + 1.5) * SR)
L = np.zeros(N); R = np.zeros(N); duck = np.ones(N)
rng = np.random.default_rng(149)
t_of = lambda beat: beat * B

def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def env(n, a=.004, d=.2): tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt / d)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, beat, g=1., pan=0.):
    i = int(round(t_of(beat) * SR))
    if i >= N: return
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[:N - i]; L[i:i + len(sig)] += sig * g * (1 - max(0, pan)); R[i:i + len(sig)] += sig * g * (1 + min(0, pan))
def saw(f, n, det=0.): tt = np.arange(n) / SR; return 2 * ((f * (1 + det) * tt + rng.random()) % 1) - 1
def sq(f, n, pw=.5): tt = np.arange(n) / SR; return np.where((f * tt) % 1 < pw, 1., -1.)

# ---- instruments ----
def kick():
    n = int(.38 * SR); tt = np.arange(n) / SR; f = 48 + 140 * np.exp(-tt * 32)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 8)) + .3 * hp(rng.standard_normal(n), 3000) * np.exp(-tt * 400)
def clap():
    n = int(.22 * SR); x = np.zeros(n); nz = bp(rng.standard_normal(n), 1000, 5000)
    for k, o in enumerate([0, .009, .018, .027]): i = int(o * SR); x[i:] += nz[:n - i] * np.exp(-np.arange(n - i) / SR / (.008 if k < 3 else .09))
    return x
def hat(d=.035): n = int(.12 * SR); return hp(rng.standard_normal(n), 8000) * env(n, .001, d)
def snap():  # finger-snap flavoured percussion
    n = int(.08 * SR); tt = np.arange(n) / SR; return bp(rng.standard_normal(n), 1800, 4200) * np.exp(-tt * 60) + .4 * np.sin(2 * np.pi * 1200 * tt) * np.exp(-tt * 90)
KICK, CLAP, HAT, OHAT, SNAP = kick(), clap(), hat(), hat(.12), snap()
def pluck(m, d=.22, bright=3800, g=1.):
    n = int(d * 1.6 * SR); f = note(m)
    x = .55 * sq(f, n, .35) + .45 * saw(f, n, .004)
    return lp(x, bright) * env(n, .002, d * .45) * g
def bass(m, d):
    n = int(d * SR); f = note(m); tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt) + .45 * lp(saw(f, n), 900)
    return np.tanh(1.6 * x) * env(n, .004, d * .7)
def stab(ch, d=.18, bright=2600):
    n = int(d * 1.8 * SR); x = sum(saw(note(m), n, dd) for m in ch for dd in (-.006, .006)) / (2 * len(ch))
    return lp(x, bright) * env(n, .003, d * .5)
def lead(m, d):
    n = int(d * SR * 1.15); tt = np.arange(n) / SR; f = note(m) * (1 + .003 * np.sin(2 * np.pi * 5.5 * tt) * np.minimum(1, tt / .12))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = .6 * np.sign(np.sin(ph)) * .5 + .5 * np.sin(ph) + .25 * np.sin(2 * ph)
    return lp(x, 5200) * np.minimum(1, tt / .006) * np.exp(-tt / (d * .9))

# chords: Am - F - C - G (vi IV I V), one per bar
PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55, 60], [55, 59, 62]]
ROOT = [33, 29, 36, 31]
# original 2-bar hook, in 16ths: (step, midi, length in 16ths)
HOOK = [(0, 76, 2), (3, 76, 1), (4, 79, 2), (6, 76, 2), (8, 74, 2), (10, 72, 3), (14, 74, 2),
        (16, 72, 2), (19, 72, 1), (20, 76, 2), (22, 74, 2), (24, 72, 2), (26, 69, 4), (30, 71, 2)]
S16 = B / 4

MADAS = None
for k, s in enumerate(SH):
    if s.get('madas'): MADAS = round((G[k] + (s['madas'] - s['at']) / s['speed'] / B) * 2) / 2
DROP = INTRO
BREAK0, BREAK1 = MADAS - .5, MADAS + 1.5            # music stops for the "dun dun DUN"
OUT0 = END_HOLD; LOGO = END_HOLD + 5.2

bars = int(TOTAL_BEATS // 4) + 1
for bi in range(bars):
    b0 = bi * 4; ch = PROG[bi % 4]; rt = ROOT[bi % 4]
    intro = b0 < DROP; outro = b0 >= OUT0
    for st in range(16):
        bt = b0 + st / 4
        if bt >= TOTAL_BEATS: break
        if BREAK0 <= bt < BREAK1 + .01: continue
        inz = bt < DROP
        # plucked arpeggio (the bounce) everywhere
        if st % 2 == 0 or not inz:
            m = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24][[0, 1, 2, 1, 3, 1, 2, 1][(st // 2) % 8]]
            add(pluck(m, .2, 1800 if inz else 3600), bt, .09 if inz else .075, -.3 if st % 4 else .3)
        if intro:
            if st % 4 == 2 and bt >= 2: add(SNAP, bt, .35)
            continue
        if outro and bt >= OUT0 and bt < LOGO - .01:     # breakdown under the zoom-out: no kick, filtered
            if st % 4 == 0: add(stab(ch, .3, 900), bt, .25)
            if st % 8 == 4: add(SNAP, bt, .3)
            continue
        if bt >= LOGO + 4: continue
        if st % 4 == 0:
            add(KICK, bt, .85); i = int(t_of(bt) * SR); k = int(.2 * SR)
            if i < N: duck[i:i + k] = np.minimum(duck[i:i + k], .45 + .55 * np.linspace(0, 1, len(duck[i:i + k])) ** .5)
        if st in (4, 12): add(CLAP, bt, .5)
        if st % 4 == 2: add(HAT, bt, .28, .2)
        if st % 2 == 1: add(HAT, bt, .09, -.2)
        if st == 14 and bi % 2: add(OHAT, bt, .16, .3)
        if st in (0, 3, 6, 8, 11, 14): add(bass(rt + (12 if st in (6, 14) else 0), S16 * 2.2), bt, .5)
        if st in (2, 6, 10, 14): add(stab(ch), bt, .17)
    # the hook: from the drop, every other 2-bar phrase, and always after the Madas break and over the logo
    if not intro and not (OUT0 <= b0 < LOGO - 1) and (bi % 4 in (2, 3) or b0 >= BREAK1 and bi % 4 in (0, 1) or b0 >= LOGO - 1):
        off = 0 if bi % 2 == 0 else 16
        for st, m, ln in HOOK:
            if off <= st < off + 16:
                bt = b0 + (st - off) / 4
                if not (BREAK0 <= bt < BREAK1) and bt < LOGO + 4: add(lead(m, ln * S16), bt, .12, .1)

# ---- sound design, synced to the picture ----
def whoosh(d, lo=300, hi=6000):
    n = int(d * SR); nz = rng.standard_normal(n); out = np.zeros(n); seg = int(.02 * SR)
    for i in range(0, n, seg):
        p = i / n; f = lo + (hi - lo) * np.sin(np.pi * p) ** 2; out[i:i + seg] = bp(nz[max(0, i - seg):i + seg], f, min(f * 1.9, 18000))[-len(out[i:i + seg]):]
    return out * np.sin(np.pi * np.arange(n) / n) ** 1.5
def riser(d):
    n = int(d * SR); tt = np.arange(n) / SR; nz = rng.standard_normal(n); out = np.zeros(n); seg = int(.03 * SR)
    for i in range(0, n, seg):
        f = 300 + 8000 * (i / n) ** 2; out[i:i + seg] = bp(nz[max(0, i - seg):i + seg], f, f * 1.5 + 100)[-len(out[i:i + seg]):]
    return (out + .3 * np.sin(2 * np.pi * np.cumsum(220 + 1100 * (tt / d) ** 2) / SR)) * (tt / d) ** 2
def rip():  # tearing paper: crackly band-passed noise
    n = int(.13 * SR); tt = np.arange(n) / SR
    crackle = (rng.random(n) < .25).astype(float) * rng.standard_normal(n)
    return bp(crackle + .4 * rng.standard_normal(n), 1500, 7000) * np.exp(-tt * 22) * (1 - np.exp(-tt * 400))
def slap():  # the scrap landing
    n = int(.09 * SR); tt = np.arange(n) / SR
    return .7 * lp(rng.standard_normal(n), 900) * np.exp(-tt * 45) + .5 * np.sin(2 * np.pi * 160 * tt) * np.exp(-tt * 40)
def tick():
    n = int(.04 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 200) + .5 * np.sin(2 * np.pi * 800 * tt) * np.exp(-tt * 100)
def impact(g=1.):
    n = int(1.4 * SR); tt = np.arange(n) / SR
    boom = np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-tt * 18)) / SR) * np.exp(-tt * 3))
    return (boom + .35 * hp(rng.standard_normal(n), 2500) * np.exp(-tt * 2.5)) * g
def scratch():
    n = int(.42 * SR); tt = np.arange(n) / SR
    speed = np.sin(2 * np.pi * 2.4 * tt) * (1 - tt / .42)
    ph = np.cumsum(np.abs(speed) * 900 + 60) / SR
    return bp(np.sin(2 * np.pi * ph) * 0.4 + rng.standard_normal(n) * np.abs(speed), 400, 5000) * np.minimum(1, (n - np.arange(n)) / SR / .04)
def brass(m, d):
    n = int(d * SR); tt = np.arange(n) / SR
    x = sum(saw(note(mm), n, dd) for mm in (m, m + 7, m + 12) for dd in (-.004, .004)) / 6
    cut = 600 + 2800 * np.minimum(1, tt / .06) * np.exp(-tt * 2)
    y = np.zeros(n); seg = int(.02 * SR)
    for i in range(0, n, seg): y[i:i + seg] = lp(x[max(0, i - seg):i + seg], cut[i])[-len(y[i:i + seg]):]
    return y * np.minimum(1, tt / .01) * np.minimum(1, (n - np.arange(n)) / SR / .05)

def words(lines): return sum(len(l) for l in lines)
# intro: the curve plots itself, captions tear on, riser into the dive, drop on the first shot
for i in range(words([['maths'], ['revision?']])): add(rip(), .5 + i * .5, .55, .25); add(slap(), .5 + i * .5 + .03, .5)
for i in range(3): add(rip(), 4 + i * .5, .55, -.25); add(slap(), 4 + i * .5 + .03, .5)
add(riser(t_of(2.5)), 5.5, .32); add(whoosh(t_of(2.5)), 5.5, .45)
add(impact(.75), DROP)
# glides between shots
for k in range(1, len(SH)): add(whoosh(t_of(GLIDE), 250, 7000), G[k], .42, (-1) ** k * .3)
# hold captions, the Madas moment and on-screen taps
for k, s in enumerate(SH):
    h0 = G[k] + GLIDE
    t0 = (MADAS + 4.3) if s.get('madas') else h0 + .1
    for i in range(words(s['words'])): add(rip(), t0 + i * .5, .5, (-1) ** i * .3); add(slap(), t0 + i * .5 + .03, .45)
    cj = os.path.join(AD, 'clips', f"m_{s['id']}-phone.json")
    if os.path.exists(cj):
        for c in json.load(open(cj))['clicks']:
            bt = G[k] + (c - s['at']) / s['speed'] / B
            if G[k] <= bt <= G[k] + GLIDE + s['hold']: add(tick(), bt, .3)
# OH NO. MADAS MATHS!  scratch, then dun dun DUN, then (the hard ones)
add(scratch(), MADAS - .5, .8); add(impact(1.4), MADAS)
for j, m in enumerate([50, 49, 45]): add(brass(m, t_of(.42 if j < 2 else .9)), MADAS + j * .5, .55)
for i in range(3): add(rip(), MADAS + .6 + i * .5, .4); add(slap(), MADAS + .63 + i * .5, .4)
# outro: zoom out, captions, final hit on the logo
add(whoosh(t_of(3), 200, 5000), OUT0, .4)
for i in range(4): add(rip(), OUT0 + 2.8 + i * .5, .5, (-1) ** i * .3); add(slap(), OUT0 + 2.83 + i * .5, .45)
add(riser(t_of(2)), LOGO - 2, .25); add(impact(1.), LOGO)
n = int(3.2 * SR); add(lp(sum(saw(note(m), n, d) for m in (45, 57, 60, 64, 69) for d in (-.005, .005)) / 10, 3000) * env(n, .005, 1.3), LOGO, .45)
for i in range(6): add(rip(), LOGO + .8 + i * .5, .35); add(slap(), LOGO + .83 + i * .5, .3)

# ---- master ----
tt = np.arange(N) / SR

mix = np.stack([L, R], 1)
fade = np.clip(tt / .05, 0, 1) * np.clip((TOTAL + .4 - tt) / 1.2, 0, 1)
mix *= fade[:, None]
mix = np.tanh(mix * 1.25) / np.tanh(1.25)
mix = mix / np.max(np.abs(mix)) * .93
mix = mix[:int(TOTAL * SR)]
os.makedirs(os.path.join(AD, 'out'), exist_ok=True)
with wave.open(os.path.join(AD, 'out', 'maths-soundtrack.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('total %.2f s, madas beat %.1f, drop %.2f s, logo %.2f s' % (TOTAL, MADAS, t_of(DROP), t_of(LOGO)))
