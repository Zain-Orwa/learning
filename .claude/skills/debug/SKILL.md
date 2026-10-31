---
name: debug
description: Debugging practice from studied material only. Gives a debugging challenge (read the error, spot the bug, "it runs but…", hands-on broken project on Windows, or a bug-squash mock), times it, and grades strictly with the debugging rubric. Use when the learner says /debug, "debug challenge", "give me a bug", or when the Debug challenge scheduled task fires.
---

# /debug: debugging challenges

Follow the root `CLAUDE.md`, `docs/learning-method.md` (strict % grading) and
**`docs/debugging-track.md`** (Agans' 9 rules, rubric, levels, formats).

## 1. Pick the challenge
1. `git pull --rebase`.
2. Find his current level: the highest level whose unlocking material he has
   finished (completed parts in `journey/REVIEWS.md` / `journey/STATE.md`).
   **Never use bug classes from material he hasn't studied.**
3. Prefer a **due** `dbg-` unit (`python3 tools/reviews.py due`); its source
   points to a `debug` entry in a part's `data.js`. Rewrite it a little (other
   names, other line, same bug class) so he can't just remember the answer.
4. Otherwise write a **new** challenge at his level. Rotate formats:
   read-the-error → spot-the-bug → "it runs but…" → (Windows days) hands-on.
   Use realistic, exact-looking compiler, linker or debugger output.

## 2. Run it
- Post the scenario, the task, and the **target time**. Say the clock starts now.
- One challenge at a time. Wait for his answer. No hints unless he asks.
- **Hands-on:** create `handmade-mastery/code/debug-challenges/<date>-<slug>/`
  with the broken files, a `build.bat`, and a README holding only the symptom
  and the task (never the cause). Commit and push. He builds and fixes it on the
  Windows PC, writes `NOTES.md` (what he saw, hypothesis, fix, how he verified),
  and pushes. Then you check his fix and notes.

## 3. Grade (debugging rubric, 100%)
Reproduce/observe 15 · read the evidence 20 · hypothesis 20 · narrowing 15 ·
root cause 15 · fix + verify 15. Give **Score: N%**, what's right, what's
missing for 100% (with %), the time taken vs. the target, and one guiding
question if below 100%. Name the Agans rule he skipped, if any.

## 4. Record
- Due unit: `python3 tools/reviews.py grade handmade-mastery <dbg-unit> <score>`.
- New challenge worth keeping: `python3 tools/reviews.py add handmade-mastery dbg-new-<date>-<slug> "[debugging] L<level> <title>" "debug/<date>" ` then grade it.
- Add one line to the subject's `journey/STATE.md` → **Debugging log**
  (date, bug class, score, time). Commit and push.
