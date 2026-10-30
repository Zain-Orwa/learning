---
name: review
description: Spaced-review session. Quizzes the learner on every unit due in the subjects' journey/REVIEWS.md (1d, 3d, 1w, 2w, 1m, 3m, 6m, then every 6 months), grades strictly in percent, re-teaches gaps, and reschedules with tools/reviews.py. Use when the learner says /review, "my reviews", at the start of every study session, or when the daily review task fires.
---

# /review: spaced-review session

Follow the root `CLAUDE.md` (plain English, short replies) and the strict
grading rules in `docs/learning-method.md`.

## 1. Find what's due
1. `git pull --rebase`
2. `python3 tools/reviews.py due` (from the repo root). It lists every due
   unit in every subject, with its source (e.g. `courses/intro-to-c/day01#b03`
   = part `b03` of that day's `data.js`).
3. Nothing due: on a weekday run as the daily task, go on to the interview
   drill (see the last section). Otherwise say "No reviews due today", show
   the next due date (`python3 tools/reviews.py list <subject>`), and stop.

Units whose id starts with `iv-` are **interview questions** (source points
to the part's `interview` list in `data.js`). Ask them the way an interviewer
would, grade against their `strong` checklist (weights = the %), and use one
of their `followups` as the guiding question.

## 2. Prepare
For each due unit, read its source in `data.js`: summary, explain, questions,
cards, oneLiner. Write **2 to 3 fresh questions per unit**:
- Ask in **new words**, not the exact kit question, so he recalls the idea,
  not the sentence.
- Mix types: "explain in your own words", "why", "what happens if…", and,
  where the unit has code, "write or fix this small piece" (he writes it).
- Higher stages (1m, 3m, 6m) get **harder, connecting questions**: link the
  unit to later material he has learned since.
- Mix units together (interleaving) instead of doing them one by one.

## 3. Ask, one question at a time
- Show **only one question**, then stop and wait.
- Grade strictly (see `docs/learning-method.md`): **Score: N%**, what's
  right, what's missing or wrong for 100% with % per piece, and one guiding
  question if below 100%. Don't give the answer unless he asks or misses twice.
- After the guiding question, let him try once more, then move on.

## 4. Record and reschedule
- Unit score = the average of its question scores (use the final attempt).
- `python3 tools/reviews.py grade <subject> <unit> <score>` for each unit.
  80%+ passes to the next interval; below 80% goes back to 1 day.
- For any unit under 80%: a **short re-teach** (3 to 5 lines) of exactly the
  missed ideas, with the timestamp to rewatch.

## 5. Close
- Summary: units reviewed, scores, next review dates (from the script output).
- Note weak spots in the subject's `journey/STATE.md` under **Weak spots** (create it if missing).
- Commit and push: `git add -A && git commit -m "Review <date>" && git push`.

## When it runs as the daily scheduled task
The task fires at 12:48 Europe/Berlin in a fresh session.
- **Monday to Friday (review days):** the due units **plus a 2-question
  interview drill** (`/interview` drill mode) from the `iv-` units, even when
  no review is due. If there are no `iv-` units yet, ask 2 fresh recall
  questions on the most recently studied parts instead.
- **Saturday and Sunday (study days):** only the due units, then remind him:
  "Study day: open the study page or say *start* with your time."
Do steps 1 and 2, then post a short greeting (how many questions, about how
long) with the **first question only**, and wait. Zain opens the session from
the notification and answers there. If he has studied nothing yet, end with
one line: "Nothing studied yet. Study day: Saturday or Sunday." and stop.
