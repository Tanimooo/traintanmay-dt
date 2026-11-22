# TrainTanmay: 5 videos a day, real exam questions solved step by step

**Decision (22 Nov 2026):** no edits. No beat-cut montages, motion-graphic ads, loops or trend
edits. Every video is **one real past-paper question, solved step by step**, and it ends on the
same question inside TrainTanmay.

---

## 1. The format (one template for all 5 daily videos)

| Time | What's on screen | Voice |
|---|---|---|
| 0:00 | The **real question**, cropped from the official paper, with the source on a tag: *"ENGAA 2019 · Q16"* | "This is one of the hardest questions on the 2019 ENGAA. Pause and try it." |
| 0:03 | The same question plus a thin 3 s timer bar | (silence) |
| 0:06 | **Working appears line by line**, whiteboard style, in the site's fonts and maths typesetting. The current line is highlighted; nothing else moves | Explains each line: *why* you'd do this step, not only *what* it is |
| ~mid | **The trap:** the wrong option most people pick is crossed out | "Most people pick B because they forget the sign flip…" |
| (optional, 5–10 s) | The site's matching **lab or visualiser** confirming the result (circuit sandbox reading, graph plot, molecule shape), used only when it actually adds something | "And you can see it here: …" |
| end | **Answer** boxed in green, then 3 s of TrainTanmay: the same ESAT question with its worked solution open, or for A-level the paper + mark scheme links on that topic | ESAT: "Every ESAT question since 2016, with worked solutions, free on TrainTanmay." A-level: "Every past paper and mark scheme, sorted by topic, free on TrainTanmay." |

- **Length:** 45–90 s. A long multi-part A-level question is split into Part 1 / Part 2 (series hook).
- **Audio:** voice only (Kokoro TTS, calm pace, ~150 wpm). No music, sound effects or transitions.
- **Captions:** big word-by-word captions in the safe zone. Working sits in the middle third.
- **Accuracy:** every answer is checked against the official answer key or mark scheme, and the arithmetic
  is checked numerically by script before rendering. Wrong maths in a "solved" video would kill trust.
- **Sourcing:** show only the one question, always with the paper and question number cited. Never the
  whole paper. (Same approach the site uses: it shows ESAT questions live from the official
  paper rather than re-hosting them.)

## 2. The 5 daily slots

| Slot (UK) | Series | Source |
|---|---|---|
| 07:30 | **ESAT Maths in 60 s** | TMUA / ENGAA / NSAA maths: 424 real questions in the site's bank, all with worked solutions + traps |
| 12:30 | **A-level Physics: hardest question** | OCR A H556 past papers (the site's Physics app) |
| 16:30 | **A-level Maths / Further Maths** | Edexcel past papers (the site's Maths app) |
| 18:30 | **A-level Chemistry** | OCR A H432 past papers (the site's Chemistry app) |
| 20:30 | **ESAT Physics in 60 s** | ENGAA / NSAA physics: 149 real questions in the bank |

Mock season is now (Nov–Jan), so A-level gets 3 of the 5 daily slots. Questions are picked
for: high difficulty, a clear trap, a solution that fits in 90 s, and a topic that has a lab on the site.

**Platforms:** TikTok + YouTube Shorts get all 5. Instagram gets the best 1–2 a day.
YouTube title pattern: *"ENGAA 2019 Q16: the circuits question everyone gets wrong"*.

## 3. Week 1: ESAT picks (real questions, all difficulty 4–5 in the bank)

| Day | 07:30 ESAT Maths | 20:30 ESAT Physics |
|---|---|---|
| 1 | TMUA 2020 Q20: quadratic roots & discriminant | ENGAA 2019 Q16: series-parallel resistors (+ *Circuit sandbox*) |
| 2 | ENGAA 2020 Q29: perpendicular lines & triangle area | ENGAA 2022 Q16: EM induction voltage (+ *EM induction* lab) |
| 3 | TMUA 2019 Q11: simultaneous log equations | ENGAA 2018 Q22: terminal velocity & drag (+ *Terminal velocity* lab) |
| 4 | TMUA 2016 Q15: minimising the gradient of a curve | ENGAA 2020 Q18: spring energy & conservation (+ *Springs* lab) |
| 5 | ENGAA 2022 Q39: exponential equation by substitution | NSAA 2021 Q39: hydrostatic pressure in layers |
| 6 | TMUA 2019 Q18: shortest distance, curve to line (+ graph plot) | ENGAA 2022 Q20: ideal gas pressure & density (+ *Ideal gas* lab) |
| 7 | TMUA 2023 Q05: rectangle in a square, area optimisation | NSAA 2023 Q37: motor effect on a current loop (hardest in the bank) |

## 4. Week 1: A-level topics (the exact question per slot is picked from the linked papers when scripting)

| Day | 12:30 Physics (OCR A) | 16:30 Maths / FM (Edexcel) | 18:30 Chemistry (OCR A) |
|---|---|---|---|
| 1 | Capacitor discharge: time constant / half-life | Integration by parts (the loop trick) | Kp from equilibrium moles |
| 2 | Circular motion: vertical circle / banked track | Parametric curves: area or tangent | Buffer pH calculation |
| 3 | Gravitational fields: orbit / escape speed | Vectors: shortest distance | Born–Haber cycle |
| 4 | SHM: energy & max speed | Mechanics: ladder against a wall (moments + friction) | Rate equation from initial-rates data |
| 5 | Photoelectric effect: work function from a graph | Hypothesis test (binomial), wording for full marks | NMR / IR structure deduction |
| 6 | Stationary waves: harmonics in a pipe | Proof by contradiction / induction | Electrode potentials & cell EMF |
| 7 | Internal resistance from a graph | Projectiles with a vector or calculus twist | Organic synthesis route (multi-step) |

## 5. Production pipeline (per video)

1. **Pick** the question; pull the answer key/mark scheme and the site's worked solution (ESAT bank
   `esat/data/exp_*.json` already has a step-by-step solution and the trap for every question).
2. **Script** (`promo/daily/<date>/<slot>.json`): hook, one line of narration per working step, the trap,
   an optional lab moment, and the outro. Check the numbers with a quick script.
3. **Render:** an HTML template draws the cropped question + KaTeX working line by line and is
   stepped frame by frame → ffmpeg (1080×1920, 30 fps; no fancy motion, so 30 is plenty).
4. **Lab moment / outro:** Playwright recording of the live site (phone size), with the question open in the app.
5. **Voice + captions:** Kokoro TTS, word timings → captions; mix to −14 LUFS.
6. **Deliver:** MP4 + cover frame + `post.md` (YT title, caption, 3–5 hashtags, pinned comment
   "What did you get? 👇") → committed and dropped into a dated Google Drive folder for Buffer.

**Build order:** one template, then a **pilot of 2** (one ESAT, one A-level) for review before the daily
5 start. That way style problems are fixed once, not 35 times.

## 6. Access needed

TrainTanmay already links every past paper + mark scheme (A-level → Physics & Maths Tutor) and has a
worked solution for every ESAT question, so all source material comes *through the site*. The video
shows viewers exactly where to find it.


- **ESAT/TMUA papers** (esat-tmua.ac.uk downloads): ✅ reachable from the session.
- **A-level papers + mark schemes:** ✅ reachable via the site's own Physics & Maths Tutor links
  (cloud environment `traintanmay-dt` allows pmt./www.physicsandmathstutor.com).

## 7. Review after 14 days
3-second hold, average % watched, comments ("I got C 😭"), saves, link clicks per series.
Give more slots to the series that wins; re-test hooks on the weakest.
