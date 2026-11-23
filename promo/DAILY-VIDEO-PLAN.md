# TrainTanmay: 5 videos a day, real exam questions solved step by step

**Format (updated 23 Nov 2026, v3):** one real past-paper question per video, explained with **full-screen 3D animation**
(three.js): no question card on screen, the camera moves around the scene, things get built, fall, spin, spark and
flip; slow motion, freeze-frames, rewinds and time-lapses where they help. The real question is shown at the end, on the website.

## Feedback on day 1 (23 Nov) — follow this from day 2
- **Worked well:** D&T (flexography press) and Physics (light gate). 3D is right when it shows a *real physical thing*:
  a machine, a mechanism, an experiment, a process.
- **3D only when it helps visualisation.** Otherwise use clean, punchy **2D** animation.
- **Maths:** no 3D needed. 2D: equations that build and transform, graphs that draw, and quick
  "remember this formula?" moments (e.g. pop up S∞ = a/(1−r) and ask if they knew it) before using it.
- **Chemistry:** an animated 2D graph carrying the whole explanation would have been better than the 3D flasks
  (which didn't look good). Use 2D graphs/diagrams by default; 3D only if it clearly looks good and adds something
  (e.g. molecule shapes).
- Keep: subject colours, snappy cuts, slow-mo/time-lapse where useful, ESAT-only options, D&T theory explained in full,
  question shown on the site at the end, one TrainTanmay mention.

## Rules for every video
- **Show, don't tell:** the question itself is animated (the ball drops through the laser, the flasks fill, the towers
  grow). Words on screen are short kinetic headlines, not paragraphs.
- **Snappy:** about 40–65 s, narrator a bit quicker (×1.12), camera holds a shot then whips to the next in ~1 s,
  quiet original music + whooshes/pops under the voice.
- **Colours = the app's colours:** Physics pink, Chemistry orange, Maths green, D&T blue, ESAT yellow (only ESAT is yellow).
- **Multiple-choice options only for ESAT**, shown at the start and again at the answer.
- **D&T theory / long-answer questions:** no "answer", explain the whole idea (process, why, comparison, what to sketch).
- **TrainTanmay said once**, at the end: *"Try this question and more at TrainTanmay. Link in bio!"* over the website showing that question.
- **Before anything is final, check:** answer vs official mark scheme; every number by script; the animation's own
  physics/maths (e.g. the ball blocks the beam exactly 0.10–0.14 s, molecule counts halve exactly at 16 min, current dots
  3 : 2 : 1); the explanation itself; then preview stills and the final frames.

## The 5 daily slots, one per subject (UK times)
| Slot | Subject | Source papers (linked in the site) | Outro shows |
|---|---|---|---|
| 07:30 | **ESAT** (maths & physics alternate) | ENGAA / NSAA / TMUA, official UAT-UK papers | the question in the ESAT app → tap the answer → worked solution |
| 12:30 | **A-level Physics** | OCR A H556 | Physics › Past papers → paper opens in TrainTanmay at the question |
| 16:30 | **A-level Maths** | Edexcel 9MA0 (+ Further Maths) | Maths › Pure › Papers & tests → paper opens at the question |
| 18:30 | **A-level Chemistry** | OCR A H432 | Chemistry › Past papers → paper opens at the question |
| 20:30 | **A-level D&T** | Edexcel 9DT0 Product Design (theory + calculation questions) | D&T › Past papers → paper opens at the question |

TikTok + YouTube Shorts get all 5; Instagram gets the best 1–2 a day.

**Picking questions:** a clear trap answer, something that *moves* well (a graph, a mechanism, a circuit, a process),
and a solve that fits in about a minute. Mock season (Nov–Jan): favour the topics that come up most.

## Day 1 (made, 3D)
| Subject | Question | 3D idea |
|---|---|---|
| ESAT | ENGAA 2019 Q16: five identical resistors → E, 8.0 V | circuit board builds itself, analogue voltmeter, glowing current splitting 2 : 1 in a slow-mo dive |
| Physics | OCR A 2024 P1 Q4: g from a light gate → 10.4 m s⁻² | chrome ball drops through a real laser beam; freeze at 0.100 / 0.140 s, rewind, slow-mo; whip-pan to a v–t graph |
| Chemistry | OCR A 2023 P1 Q7: first-order half-life → 16 min | two flasks of molecules in a time-lapse; right one sparks twice as fast but both halve together |
| Maths | Edexcel 2023 P1 Q9: geometric series → k = 20, S∞ = 256/7 | towers that change with k; k = ⅔ skyscrapers explode upward; k = 20 shrinks and flips; total column zig-zags onto 256/7 |
| D&T | Edexcel 2019 Q3(b)(c): flexography (theory) | the 4-roller press built roller by roller, anilox cells close-up, slow-mo at the nip, flexo vs gravure, soft plate on corrugated board |

## Next days (candidates already checked for a good trap)
- **ESAT:** TMUA 2020 Q20 (discriminant), ENGAA 2022 Q16 (EM induction), TMUA 2019 Q18 (shortest distance), NSAA 2021 Q39 (pressure layers)
- **Physics (OCR A 2024 P1):** Q6 beam on two supports (moments), Q7 braking v–t graph, Q11 car over a bridge (apparent weightlessness)
- **Chemistry (OCR A 2023 P1):** Q4 mixing HCl + NaOH (excess), Q10 % dissociation of a weak acid, Q9 entropy change sign
- **Maths (Edexcel 2023 P1):** Q8 the stage (sector + triangles), Q10 circle + line (range of k), Q5 trapezium rule
- **D&T (Edexcel 2019):** Q2(b) roof-truss rafter length (Pythagoras), Q4(c) varnish for 2400 seat pieces

## How a video is made
`promo/source/solve/`: `videos3d/<id>.json` (theme, narration with `{markers}`, outro) + `scenes3d/<id>.js` (the 3D scene)
→ `python3 make3.py videos3d/<id>.json <workdir>` → `promo/daily/<id>.mp4`.
See `promo/source/solve/README.md`.

## Review after 14 days
3-second hold, average % watched, comments, saves, link clicks, per subject. Re-hook the weakest subject's videos.
