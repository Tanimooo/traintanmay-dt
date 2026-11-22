import json, os, sys, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from script import LINES
from kokoro_onnx import Kokoro
M = '/tmp/claude-0/-home-user-traintanmay-dt/afdff4eb-83ab-5873-81ff-700f33069c18/scratchpad/tts'
k = Kokoro(f'{M}/kokoro-v1.0.onnx', f'{M}/voices-v1.0.bin')
out = {}
for sid, say, cap, gap in LINES:
    ph = k.tokenizer.phonemize(say, 'en-us')
    s, sr = k.create(ph, voice='af_heart', speed=1.1, lang='en-us', is_phonemes=True)
    a = np.abs(s) > .01; i0 = max(0, np.argmax(a) - int(.04 * sr)); i1 = min(len(s), len(s) - np.argmax(a[::-1]) + int(.06 * sr))
    s = s[i0:i1]; sf.write(f'voice/{sid}.wav', s, sr); out[sid] = round(len(s) / sr, 3)
    print(sid, out[sid], ph[:70])
json.dump(out, open('voice/durations.json', 'w'))
print('speech total', round(sum(out.values()), 1), 'with gaps', round(sum(out.values()) + sum(l[3] for l in LINES), 1))
