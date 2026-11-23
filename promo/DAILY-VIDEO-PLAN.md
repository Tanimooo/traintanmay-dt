# TrainTanmay: 5 videos a day, real exam questions solved step by step

**Format (updated 23 Nov 2026):** one real past-paper question per video, solved step by step with
**our own animated drawings** (circuits that draw themselves, balls that fall, graphs that plot, packs that stack),
friendly narration, and the website at the end. No montage-style "edits".

## Rules for every video
- **Length:** aim for under 60 s. Up to ~90 s is fine when the question needs it; never more than 3 min.
- **Hook in the first second:** the question on screen and something already drawing itself.
- **Narrator:** warm and friendly ("Okay!", "Pause and have a go!", "Classic trap!"). Says *TrainTanmay* **once only**,
  in the last line: *"Try this question and more at TrainTanmay. Link in bio!"* while the website shows that question.
- **Structure:** question + options → 3 s "Pause & try it" → step-by-step solve on the drawing, working
  typed line by line → answer in green → the trap answer crossed out in red, with *why* people pick it → website outro.
- **Before anything is final, check:** the answer matches the official answer key or mark scheme; every number is
  re-computed by script; the drawing is physically/mathematically right (e.g. the light-gate ball really does block the
  beam from 0.10 to 0.14 s, current dots move in a 3 : 2 : 1 ratio); the explanation is correct, not just the answer;
  then frame-by-frame review of the render.

## The 5 daily slots, one per subject (UK times)
| Slot | Subject | Source papers (linked in the site) | Outro shows |
|---|---|---|---|
| 07:30 | **ESAT** (maths & physics alternate) | ENGAA / NSAA / TMUA, official UAT-UK papers | the question in the ESAT app → tap the answer → worked solution |
| 12:30 | **A-level Physics** | OCR A H556 | Physics › Past papers → paper opens in TrainTanmay at the question |
| 16:30 | **A-level Maths** | Edexcel 9MA0 (+ Further Maths) | Maths › Pure › Papers & tests → paper opens at the question |
| 18:30 | **A-level Chemistry** | OCR A H432 | Chemistry › Past papers → paper opens at the question |
| 20:30 | **A-level D&T** | Edexcel 9DT0 Product Design | D&T › Past papers → paper opens at the question |

TikTok + YouTube Shorts get all 5; Instagram gets the best 1–2 a day.

**Picking questions:** a clear trap answer, something that *moves* well (a graph, a mechanism, a circuit, a process),
and a solve that fits in about a minute. Mock season (Nov–Jan): favour the topics that come up most.

## Day 1 (made)
| Subject | Question | Answer | Animation |
|---|---|---|---|
| ESAT | ENGAA 2019 Q16: five identical resistors | E, 8.0 V | circuit draws itself, current dots split 2 : 1, voltages pop on |
| Physics | OCR A June 2024 P1 Q4: g from a light gate | C, 10.4 m s⁻² | ball falls through the beam (real kinematics), gate trace, then v–t graph showing why the mid-time matters |
| Chemistry | OCR A June 2023 P1 Q7: first-order half-life | D, 16 min | decay curves from 1.0 and 2.0; the old curve slides 16 min and lands exactly on the new one |
| Maths | Edexcel June 2023 P1 Q9: geometric series | k = 20, S∞ = 256/7 | k = ⅔ bars blow up, k = 20 bars alternate, partial sums zig-zag onto 256/7 |
| D&T | Edexcel 9DT0 2019 Q5(e): packaging cost | £922.00 | A2 sheet, 50 sheets stack into a pack, 24.85 packs → buy 25 |

## Next days (candidates already checked for a good trap)
- **ESAT:** TMUA 2020 Q20 (discriminant), ENGAA 2022 Q16 (EM induction), TMUA 2019 Q18 (shortest distance), NSAA 2021 Q39 (pressure layers)
- **Physics (OCR A 2024 P1):** Q6 beam on two supports (moments), Q7 braking v–t graph, Q11 car over a bridge (apparent weightlessness)
- **Chemistry (OCR A 2023 P1):** Q4 mixing HCl + NaOH (excess), Q10 % dissociation of a weak acid, Q9 entropy change sign
- **Maths (Edexcel 2023 P1):** Q8 the stage (sector + triangles), Q10 circle + line (range of k), Q5 trapezium rule
- **D&T (Edexcel 2019):** Q2(b) roof-truss rafter length (Pythagoras), Q4(c) varnish for 2400 seat pieces

## How a video is made
`promo/source/solve/`: `videos/<id>.json` (question, options, narration with `{markers}`, working lines, outro)
+ `scenes/<id>.js` (the animated drawing) → `python3 make.py videos/<id>.json <workdir>` → `promo/daily/<id>.mp4`.
See `promo/source/solve/README.md`.

## Review after 14 days
3-second hold, average % watched, comments, saves, link clicks, per subject. Re-hook the weakest subject's videos.
