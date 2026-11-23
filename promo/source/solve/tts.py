"""Narration for a solve video: one wav per line + durations, from videos/<id>.json.
Voice: Kokoro af_heart (warm, friendly). Markers like {a} are stripped for speech."""
import json, os, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
spec = json.load(open(sys.argv[1])); out = sys.argv[2]; M = sys.argv[3]
k = Kokoro(f'{M}/kokoro-v1.0.onnx', f'{M}/voices-v1.0.bin')
FIX = [('tˈænmeɪ', 'tˈʌnmˌeɪ'),   # TrainTanmay: TUN-may, the Hindi way
       ('ˈɛsæt', 'ˈiːsˌæt'),       # ESAT: ee-sat
       ('ˌoʊsˌiːˈɑːɹ ɐ ', 'ˌoʊsˌiːˈɑːɹ ˈeɪ '),   # OCR A: the letter A, not "uh"
       ('ɡɹˈævjʊɹ', 'ɡɹəvjˈʊɹ')]              # gravure: gruh-VYOOR
os.makedirs(out, exist_ok=True); d = []
for i, l in enumerate(spec['lines']):
    say = re.sub(r'\{\w+\}', '', l['say'])
    ph = k.tokenizer.phonemize(say, 'en-us')
    for a, b in FIX: ph = ph.replace(a, b)
    s, sr = k.create(ph, voice='af_heart', speed=l.get('speed', spec.get('speed', 1.04)), lang='en-us', is_phonemes=True)
    a = np.abs(s) > .01; i0 = max(0, np.argmax(a) - int(.05 * sr)); i1 = min(len(s), len(s) - np.argmax(a[::-1]) + int(.08 * sr))
    s = s[i0:i1]; sf.write(f'{out}/{i:02d}.wav', s, sr); d.append(round(len(s) / sr, 3))
    print(i, d[-1], ph[:90])
json.dump(d, open(f'{out}/durations.json', 'w'))
