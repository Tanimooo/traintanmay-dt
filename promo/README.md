# TrainTanmay promo video

`TrainTanmay-ad.mp4`: a 67-second 1080p ad with music, sound effects and burned-in subtitles (`TrainTanmay-ad.srt` holds the same captions as a separate file).

Running order: animated intro → home page tour → **NEW Chemistry** (real recording of the app and the 3D shapes lab) → **NEW Sign in** (the real sign-in card, then a staged "synced" moment) → **NEW Leaderboards** (a mock-up, since leaderboards are not in the site yet) → accessibility slide (dyslexia-friendly font, English / Cymraeg / Gàidhlig, Auto / Light / Dark / Salmon colours) → end card.

The music and sound effects are synthesized by `build.py`, so there are no licensing issues.

## Rebuilding

```bash
python3 -m http.server 8765            # from the repo root
cd promo/source/www && python3 -m http.server 8766   # copy fonts/opendyslexic-latin-*-normal.woff2 in here first
cd promo/source && node scenes.js chem login board && node render.js && python3 build.py   # needs playwright, ffmpeg, numpy, scipy
```
