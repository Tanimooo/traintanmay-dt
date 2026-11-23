# Solve videos: real exam questions, solved with our own animations

Each video is two files:
- `videos/<id>.json`: the question in our own words (`q`, plus `qShort` for after the solve starts), answer options,
  the narration line by line, and the outro. `{marker}`s inside a line time things to the word: working lines
  (`work`, with `box` for the answer and `trap` for the trap), answer chips (`chip`), the pause timer, the outro.
- `scenes/<id>.js`: the animated drawing, a pure function of time `SCENES[id] = (t, T, H) => svg` on a 1000 × 700
  stage. `T.<marker>` is when that word is said; `H` has helpers (lines that draw themselves, pills that pop,
  arrows, points along a path, easing).

```
python3 -m http.server 8765                       # repo root, keep running
export KOKORO=<dir with kokoro-v1.0.onnx + voices-v1.0.bin>
export PDFJS_DIR=<pdfjs-dist@3.11.174/build>      # only where cdnjs is blocked (cloud sandbox)
python3 make.py videos/<id>.json <workdir> --stage none --preview 2,20,40   # stills to check the layout
python3 make.py videos/<id>.json <workdir>                                 # → promo/daily/<id>.mp4 + .jpg
```

- `tts.py`: Kokoro `af_heart`, friendly and a touch quicker than normal; pronunciation fixes for TrainTanmay,
  ESAT and "OCR A". Say TrainTanmay once, in the last line only.
- `outro.js` + `site.js` film the website: `site.kind "esat"` opens the question in the ESAT app, taps the answer and
  scrolls to the worked solution; `"paper"` opens the app page that links the paper, taps it, and the paper opens in
  TrainTanmay's viewer at `pdfPage`.
- Check before rendering: the answer against the official key or mark scheme, every number by script, the drawing
  (physics/maths of the animation itself), then the preview stills and the final frames.
