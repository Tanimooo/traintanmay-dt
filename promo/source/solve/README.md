# Solve videos: real exam questions, explained in full-screen 3D

Each video is two files:
- `videos3d/<id>.json`: subject `theme` (physics / chemistry / maths / dt / esat), narration line by line with
  `{marker}`s that time the animation to the word, and the website outro (`site`).
- `scenes3d/<id>.js`: a three.js scene. `export default (X) => update(t)`; build meshes with `X.THREE`, place overlays
  with `X.big` (kinetic headline), `X.eq` (KaTeX), `X.label` (pill pinned to a 3D point), `X.badge` (SLOW-MO etc.),
  `X.live` (text that changes every frame), `X.chips` (ESAT options only), `X.ring` (pause countdown), camera keys with
  `X.cam([...])` (each key holds, then whips to the next in ~1 s), and sounds with `X.cue('whoosh' | 'pop' | 'slam' | ...)`.
  Everything must be a pure function of time t.

```
python3 -m http.server 8765                       # repo root, keep running
export KOKORO=<dir with kokoro-v1.0.onnx + voices-v1.0.bin>
export THREE_DIR=<node_modules/three (three@0.170)>
export PDFJS_DIR=<pdfjs-dist@3.11.174/build>      # only where cdnjs is blocked (cloud sandbox)
python3 make3.py videos3d/<id>.json <workdir> --stage none --preview 2,20,40   # stills
python3 make3.py videos3d/<id>.json <workdir>                                 # → promo/daily/<id>.mp4 + .jpg
```

- `v3.html`: the frame engine (renderer, subject themes, overlays, captions, camera, website outro).
- `make3.py`: narration (`tts.py`, Kokoro af_heart, ×1.12), schedule, outro filming (`outro.js`/`site.js`), frames,
  audio mix (voice + quiet original music bed + effects), ffmpeg.
- Check before rendering: the answer vs the official mark scheme, every number by script, the animation's own maths
  and physics, then the preview stills; after rendering, sample frames.
