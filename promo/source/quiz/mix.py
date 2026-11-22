"""Audio for the Physics quiz Short: narration + a soft original bed + a few small cues, all from schedule.json."""
import json, wave, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
S = json.load(open('www/quiz/schedule.json')); L = {l['id']: l for l in S['lines']}
SR = 44100; N = int((S['total'] + 1) * SR); rng = np.random.default_rng(4)
voice = np.zeros(N); bed = np.zeros(N); fx = np.zeros(N)
def put(buf, sig, t, g=1.):
    i = int(t * SR); sig = sig[:max(0, N - i)]; buf[i:i + len(sig)] += sig * g
lp = lambda x, f: sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
for l in S['lines']:
    v, vsr = sf.read(f"quiz/voice/{l['id']}.wav"); put(voice, resample_poly(v, 441, 240), l['start'])
voice /= np.abs(voice).max() / .9
# bed: 100 BPM, soft plucked chords + pad + light kick/shaker (original)
B = .6; prog = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]
def pluck(m, d=.5):
    n = int(d * SR); tt = np.arange(n) / SR; f = note(m)
    return lp(np.sign(np.sin(2 * np.pi * f * tt)) * .3 + np.sin(2 * np.pi * f * tt) * .7, 2600) * np.exp(-tt * 7)
def pad(ch, d):
    n = int(d * SR); tt = np.arange(n) / SR
    x = sum(2 * ((note(m) * (1 + dd) * tt + rng.random()) % 1) - 1 for m in ch for dd in (-.004, .004)) / (2 * len(ch))
    return lp(x, 1100) * np.minimum(1, tt / .5) * np.minimum(1, (n - np.arange(n)) / SR / .5)
kick = (lambda n=int(.25 * SR): np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-np.arange(n) / SR * 30)) / SR) * np.exp(-np.arange(n) / SR * 10))()
shk = (lambda n=int(.06 * SR): sosfilt(butter(2, 7000, 'high', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-np.arange(n) / SR * 50))()
bar = 0; t = 0
while t < S['total']:
    ch = prog[bar % 4]; put(bed, pad([m - 12 for m in ch], 4 * B + .5), t, .5)
    for k in range(8):
        tk = t + k * B / 2
        put(bed, pluck(ch[[0, 2, 1, 3, 2, 1, 3, 2][k]] + 12), tk, .16)
        if k % 2 == 0: put(bed, kick, tk, .35 if k in (0, 4) else 0)
        put(bed, shk, tk, .05)
    bar += 1; t += 4 * B
# duck the bed under the voice
env = np.convolve(np.abs(voice), np.ones(int(.2 * SR)) / int(.2 * SR), 'same'); env = np.clip(env / .04, 0, 1)
bed *= (.42 - .22 * env)
# small cues
def pop(f=900):
    n = int(.09 * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * (f + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 45)
def tick(): n = int(.05 * SR); tt = np.arange(n) / SR; return np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt * 120)
def whoosh(d=.45):
    n = int(d * SR); nz = rng.standard_normal(n); out = np.zeros(n); s = int(.02 * SR)
    for i in range(0, n, s): f = 400 + 4000 * np.sin(np.pi * i / n) ** 2; out[i:i + s] = bp(nz[max(0, i - s):i + s], f, f * 1.8)[-len(out[i:i + s]):]
    return out * np.sin(np.pi * np.arange(n) / n) ** 2
def ding():
    n = int(1.4 * SR); tt = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, a, d in [(1568, .6, 3), (2349, .35, 4), (3136, .2, 6), (784, .3, 3.5)])
def skid():
    n = int(1.1 * SR); tt = np.arange(n) / SR; return bp(rng.standard_normal(n), 1800, 3800) * np.minimum(1, tt / .05) * np.exp(-tt * 2.5) * (1 + .3 * np.sin(2 * np.pi * 28 * tt))
for i in range(4): put(fx, pop(700 + 120 * i), .9 + i * .12, .35)
p0, p1 = L['pause']['start'], L['trap']['start']
for k in range(3): put(fx, tick(), p0 + k * (p1 - p0) / 3, .3)
put(fx, whoosh(.35), L['trap']['start'] + .95, .5); put(fx, pop(300), L['trap']['start'] + 1.3, .4)
put(fx, skid(), L['ke']['start'] + .6, .18)
for tt_ in [L['form']['start'] + .3, L['four']['start'] + .5, L['four']['start'] + 2.0, L['dist']['start'] + .2]: put(fx, pop(1000), tt_, .3)
put(fx, skid(), L['dist']['start'] + 1.2, .12)
put(fx, ding(), L['ans']['start'] + .35, .45)
put(fx, whoosh(.9), L['share']['start'] + .1, .35); put(fx, pop(800), L['share']['start'] + .3, .3); put(fx, pop(900), L['share']['start'] + 2.6, .3)
put(fx, whoosh(.5), L['share']['start'] + 1.2, .25)
mix = voice + bed + fx
tt = np.arange(N) / SR; mix *= np.clip((S['total'] + .3 - tt) / .4, 0, 1)   # tiny tail so the loop is clean
mix = np.tanh(mix * 1.05); mix = mix[:int(S['total'] * SR)]; mix = mix / np.abs(mix).max() * .92
with wave.open('out/quiz-audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio', round(len(mix) / SR, 2))
