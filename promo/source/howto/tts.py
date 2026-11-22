import json, os, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
sys.path.insert(0, os.path.dirname(__file__)); from script import STEPS
M = os.path.join(os.path.dirname(__file__), '..', '..', 'tts')
k = Kokoro(os.path.join(M, 'kokoro-v1.0.onnx'), os.path.join(M, 'voices-v1.0.bin'))
os.makedirs('voice', exist_ok=True); durs = {}
for sid, ch, say, sub in STEPS:
    s, sr = k.create(say, voice='af_heart', speed=1.0, lang='en-us')
    # trim leading/trailing silence, keep 60 ms
    a = np.abs(s) > 0.01; i0 = max(0, np.argmax(a) - int(.06 * sr)); i1 = min(len(s), len(s) - np.argmax(a[::-1]) + int(.06 * sr))
    s = s[i0:i1]; sf.write(f'voice/{sid}.wav', s, sr); durs[sid] = round(len(s) / sr, 3)
json.dump(durs, open('voice/durations.json', 'w'), indent=1)
print(round(sum(durs.values()), 1), 'seconds of speech'); print(durs)
