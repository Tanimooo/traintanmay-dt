# Solve videos: real exam questions, solved step by step

One JSON file per video in `videos/`. Each says which paper and page the question is on, the crop box,
the options, the answer, where to draw highlights on the diagram, and the narration line by line.
`{a}` / `{b}` markers in a line time that line's events (highlight, label, working line, chip) to the word.

```
python3 -m http.server 8765            # from the repo root, keep running
KOKORO=<dir with kokoro-v1.0.onnx + voices-v1.0.bin> \
PDFJS_DIR=<pdfjs-dist@3.11.174/build>  # only where cdnjs is blocked (cloud sandbox)
python3 make.py videos/<id>.json <workdir>                 # → promo/daily/<id>.mp4 + .jpg cover
python3 make.py videos/<id>.json <workdir> --stage sched --preview 3,20,40   # layout stills only
```

- `tts.py`: Kokoro `af_heart` voice, slightly quicker than normal, with pronunciation fixes
  (TrainTanmay = TUN-may, ESAT = ee-sat, OCR A = the letter A).
- `render.html`: the frame: real question crop (300 dpi from the official PDF), A–H answer chips,
  working typeset with KaTeX line by line, word-by-word captions. Tall questions shrink (`compact`) once solving starts.
- `outro.js` + `site.js`: films the outro on the real site. ESAT (`site.qid`): the question opens in the ESAT app,
  the right answer is tapped, then it scrolls to the worked solution. A-level (`site.kind: "papers"`): the app's
  Past papers page, open the paper, tap *Question paper*, and it opens inside TrainTanmay.
- Box and mark coordinates are in pixels of the page rendered at 110 dpi (`pdftoppm -r 110`), relative to the box.
- Always check the answer against the official key / mark scheme, and the arithmetic with a quick script.
