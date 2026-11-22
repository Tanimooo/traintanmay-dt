"""Piano + synth instrumental for the Maths "flow" edit, on the edit's own 149 BPM grid.
Original chords and melody. Only a few effects: soft glide whooshes, a pause-and-chord for Madas, a final chord."""
import json, os, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__)); AD = os.path.dirname(HERE)
SR = 44100; BPM = 149; B = 60 / BPM
SH = json.load(open(os.path.join(AD, 'www', 'flow', 'shots.json')))
INTRO, GLIDE, OUTRO = 8, 2, 10
G = []; b = INTRO - GLIDE
for s in SH: G.append(b); b += GLIDE + s['hold']
END_HOLD = b; TOTAL_BEATS = b + OUTRO; TOTAL = TOTAL_BEATS * B
MADAS = None
for k, s in enumerate(SH):
    if s.get('madas'): MADAS = round((G[k] + (s['madas'] - s['at']) / s['speed'] / B) * 2) / 2
DROP, LOGO, OUT0 = INTRO, END_HOLD + 5.2, END_HOLD
PAUSE0, PAUSE1 = MADAS - .5, MADAS + 1.5
N = int((TOTAL + 2) * SR)
rng = np.random.default_rng(7)
bus = {k: np.zeros((N, 2)) for k in ('piano', 'synth', 'drums', 'fx')}
t_of = lambda beat: beat * B
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def note(m): return 440 * 2 ** ((m - 69) / 12)
def add(name, sig, beat, g=1., pan=0.):
    i = int(round(t_of(beat) * SR))
    if i >= N: return
    sig = sig[:N - i]; l, r = 1 - max(0, pan), 1 + min(0, pan)
    bus[name][i:i + len(sig), 0] += sig * g * l; bus[name][i:i + len(sig), 1] += sig * g * r
def silent(beat): return PAUSE0 <= beat < PAUSE1

# ---- a soft, slightly bright piano: inharmonic partials, hammer thump, per-partial decay ----
PCACHE = {}
def piano(m, vel=.8, length=1.6):
    key = (m, round(vel, 2), round(length, 2))
    if key in PCACHE: return PCACHE[key]
    f0 = note(m); n = int(length * SR); tt = np.arange(n) / SR; Bc = 0.00012 * (1 + (m - 60) / 40)
    x = np.zeros(n)
    for k in range(1, 14):
        fk = f0 * k * np.sqrt(1 + Bc * k * k)
        if fk > 12000: break
        amp = (1 / k ** 1.15) * (1 + .6 * vel) ** (k / 6)
        dec = (1.8 - m / 90) / (1 + .35 * k)
        x += amp * np.sin(2 * np.pi * fk * tt + rng.random() * 6) * np.exp(-tt / max(.08, dec))
    x += .35 * lp(rng.standard_normal(n), 2500) * np.exp(-tt * 90) * vel   # hammer
    x *= np.minimum(1, tt / .002) * np.minimum(1, (n - np.arange(n)) / SR / .08)
    x = lp(x, 2500 + 5000 * vel) * vel
    PCACHE[key] = x; return x
def pad(ch, d):
    n = int(d * SR); tt = np.arange(n) / SR
    x = sum(2 * ((note(m) * (1 + dd) * tt + rng.random()) % 1) - 1 for m in ch for dd in (-.004, 0, .004)) / (3 * len(ch))
    return lp(x, 1500) * np.minimum(1, tt / .35) * np.minimum(1, (n - np.arange(n)) / SR / .4)
def synth_bass(m, d):
    n = int(d * SR); tt = np.arange(n) / SR; f = note(m)
    x = np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) + .25 * lp(2 * ((f * tt) % 1) - 1, 700)
    return np.tanh(1.3 * x) * np.minimum(1, tt / .006) * np.exp(-tt / (d * .8))
def arp(m, d=.15):
    n = int(d * 2 * SR); tt = np.arange(n) / SR; f = note(m)
    x = np.sign(np.sin(2 * np.pi * f * tt)) * .4 + np.sin(2 * np.pi * f * tt) * .6
    return lp(x, 3200) * np.minimum(1, tt / .003) * np.exp(-tt / (d * .5))
def kick():
    n = int(.32 * SR); tt = np.arange(n) / SR; f = 50 + 110 * np.exp(-tt * 30)
    return np.tanh(1.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9))
def snap():
    n = int(.12 * SR); tt = np.arange(n) / SR
    return bp(rng.standard_normal(n), 1500, 6000) * np.exp(-tt * 38) * .8 + .3 * np.sin(2 * np.pi * 1100 * tt) * np.exp(-tt * 70)
def shaker(): n = int(.08 * SR); tt = np.arange(n) / SR; return hp(rng.standard_normal(n), 7000) * np.minimum(1, tt / .008) * np.exp(-tt * 45)
KICK, SNAP, SHK = kick(), snap(), shaker()

# chords (one per bar): Fmaj7 - G6 - Em7 - Am9, then a lift to Dm9 - G13 in the last bar of every 8
PROG = [[53, 57, 60, 64], [55, 59, 62, 64], [52, 55, 59, 62], [57, 60, 64, 71],
        [53, 57, 60, 64], [55, 59, 62, 64], [52, 55, 59, 62], [50, 53, 57, 60, 64]]
ROOT = [41, 43, 40, 45, 41, 43, 40, 38]
# original right-hand melody over 2 bars (8th-note steps: step, midi, length in 8ths)
MEL = [(0, 76, 1), (1, 77, 1), (2, 79, 2), (4, 76, 1), (5, 74, 1), (6, 72, 2),
       (8, 74, 1), (9, 76, 1), (10, 77, 1), (11, 76, 1), (12, 74, 3), (15, 71, 1)]
MEL2 = [(0, 72, 1), (1, 74, 1), (2, 76, 2), (4, 79, 2), (6, 81, 1), (7, 79, 1),
        (8, 77, 2), (10, 76, 1), (11, 74, 1), (12, 72, 4)]
E8 = B / 2

bars = int(TOTAL_BEATS // 4) + 1
for bi in range(bars):
    b0 = bi * 4; ch = PROG[bi % 8]; rt = ROOT[bi % 8]
    intro = b0 < DROP; out_break = OUT0 <= b0 < LOGO - .01; after = b0 >= LOGO + 4
    if after: break
    # pad under everything
    if not silent(b0): add('synth', pad([m + 12 for m in ch[:4]], 4 * B + .3), b0, .16 if not intro else .12)
    # piano left hand + bouncy right-hand chord stabs
    for e in range(8):
        bt = b0 + e / 2
        if silent(bt) or bt >= TOTAL_BEATS: continue
        if e in (0, 3, 6) or (intro and e == 4):
            add('piano', piano(rt + 12, .55, 1.2), bt, .55)
        if not intro and e in (1, 3, 5, 6) or intro and e in (2, 6):
            for j, m in enumerate(ch[1:]):
                add('piano', piano(m + 12, .42 + .05 * (e % 2), .8), bt + j * .004, .32, (-.2, 0, .2, .1)[j % 4])
    if intro:
        # sparse arpeggio while the curve plots itself
        for e in range(8):
            bt = b0 + e / 2
            if bt >= 2: add('synth', arp(ch[e % len(ch)] + 24, .18), bt, .1, (-1) ** e * .3)
        continue
    # melody (piano doubled softly by a synth) on alternating phrases
    phrase = (bi // 2) % 2
    mel = MEL if phrase == 0 else MEL2
    off = 0 if bi % 2 == 0 else 8
    if not out_break:
        for st, m, ln in mel:
            if off <= st < off + 8:
                bt = b0 + (st - off) / 2
                if silent(bt): continue
                add('piano', piano(m, .85, 1.4), bt, .5, .05)
                add('synth', arp(m + 12, ln * E8 * .9), bt, .05, -.1)
    # gentle groove: synth bass, kick on 1 and 3 (all four after the Madas pause), snaps on 2 and 4, shaker 8ths
    for e in range(8):
        bt = b0 + e / 2
        if silent(bt): continue
        if out_break:
            if e == 0: add('synth', synth_bass(rt, 4 * B), bt, .3)
            continue
        if e in (0, 3, 5): add('synth', synth_bass(rt + (12 if e == 5 else 0), E8 * 1.6), bt, .45)
        if e in (0, 4) or (b0 >= PAUSE1 and e in (2, 6)): add('drums', KICK, bt, .6)
        if e in (2, 6): add('drums', SNAP, bt, .32)
        add('drums', SHK, bt, .09 if e % 2 else .05, .3)

# ---- the few effects ----
def whoosh(d):
    n = int(d * SR); nz = rng.standard_normal(n); out = np.zeros(n); seg = int(.02 * SR)
    for i in range(0, n, seg):
        p = i / n; f = 300 + 4000 * np.sin(np.pi * p) ** 2; out[i:i + seg] = bp(nz[max(0, i - seg):i + seg], f, f * 1.8)[-len(out[i:i + seg]):]
    return out * np.sin(np.pi * np.arange(n) / n) ** 2
for k in range(1, len(SH)): add('fx', whoosh(t_of(GLIDE)), G[k], .16, (-1) ** k * .3)
add('fx', whoosh(t_of(2.5)), 5.5, .2)
# piano gliss up into the drop
for i, m in enumerate([60, 64, 67, 71, 72, 76, 79, 83, 84]): add('piano', piano(m, .5, .6), DROP - 1 + i / 9, .25)
# Madas: everything stops, then a big dark piano + pad chord, twice
gate = np.ones(N); i0, i1 = int(t_of(PAUSE0) * SR), int(t_of(PAUSE1) * SR); f = int(.03 * SR)
gate[i0:i1] = 0; gate[i0:i0 + f] = np.linspace(1, 0, f); gate[i1 - f:i1] = np.linspace(0, 1, f)
for k in bus: bus[k] *= gate[:, None]
for j, ch in enumerate([[38, 50, 53, 56, 62], [37, 49, 52, 55, 61]]):
    for m in ch: add('piano', piano(m, .95, 2.2), MADAS + j * .75, .5)
    add('synth', pad([m + 12 for m in ch[1:]], t_of(.75) + .2), MADAS + j * .75, .25)
# final chord on the logo
for m in [41, 53, 57, 60, 64, 67, 72]: add('piano', piano(m, .9, 3.5), LOGO, .45)
add('synth', pad([65, 69, 72, 76], 3.4), LOGO, .3)

# ---- mix: a little room reverb on piano and synth, gentle glue ----
def reverb(x, t60=1.6, wet=.22):
    n = int(t60 * SR); tt = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-6.9 * tt / t60)[:, None]; ir[:, 0] = lp(ir[:, 0], 5000); ir[:, 1] = lp(ir[:, 1], 5000)
    ir /= np.sqrt((ir ** 2).sum(0))
    wetsig = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + wetsig * wet * 3
mix = reverb(bus['piano'] + bus['synth'] * .9) + bus['drums'] + bus['fx']
tt = np.arange(N) / SR
mix *= (np.clip(tt / .05, 0, 1) * np.clip((TOTAL + .6 - tt) / 1.4, 0, 1))[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix = mix[:int(TOTAL * SR)]; mix = mix / np.max(np.abs(mix)) * .9
with wave.open(os.path.join(AD, 'out', 'maths-piano.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('total %.2f s, drop %.2f s, madas %.2f s, logo %.2f s' % (TOTAL, t_of(DROP), t_of(MADAS), t_of(LOGO)))
