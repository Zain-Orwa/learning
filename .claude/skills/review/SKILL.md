---
name: review
description: Brief spaced reviews from the shared journey/REVIEWS.md schedule, with one core question per due unit.
---

# /review

Read `CLAUDE.md` and `docs/learning-method.md`. Run
`python3 tools/reviews.py due` from the repo root. The page uses this same log.

- At the start of study, review for at most five minutes. For a standalone
  review, use 5–10 minutes unless Zain requests longer.
- Ask ONE short question at a time. Use the part's `reviewQuestion` and
  `check.rubric`, or fresh wording that requests exactly those same ideas.
  Old `iv-` / `dbg-` units use their own question and fixed checklist.
- Grade the first unaided answer by meaning, using only the fixed rubric.
  Reply with score, one short sentence on what is right and the main gap.
  Below 80%, give one short hint/correction; one retry is enough, then explain
  directly. Keep the unaided score for scheduling; do not replace it with a
  score earned after seeing the answer.
- Record only answered units:
  `python3 tools/reviews.py grade <subject> <unit> <score>`.
  80%+ advances; below 80% returns to one day.
- Stop at the time budget. Leave untouched units due. Summarize only the main
  weak spot and next due date. Update the study state; save, commit and push.

## Daily reminder

Ask due reviews within the same short budget. Do not append a mandatory
interview drill or mock. With nothing due, say so and stop. Weekends may add
one line reminding Zain that he can study. Live cloud reminders must be
updated separately from these local instruction files.
