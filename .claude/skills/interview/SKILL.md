---
name: interview
description: Interview practice built only from studied material. Runs drills, mini mocks, area mocks or a full interview day, with Claude acting as a real interviewer (follow-ups, no hints during the interview), then a strict debrief in percent and a hiring-style verdict. Use when the learner says /interview, "mock interview", "interview me", or when tools/reviews.py areas says a mock is due.
---

# /interview: mock interviews

Follow the root `CLAUDE.md`, `docs/learning-method.md` (strict % grading) and
`docs/interview-prep.md` (levels, areas, rhythm).

## 1. Choose the level
1. `git pull --rebase`, then `python3 tools/reviews.py areas`.
2. Read the subject's `journey/INTERVIEWS.md` (mock history). A mini mock is
   due for an area with 8+ questions and 8+ new since its last mock; an area
   mock at 15+ questions and 60%+ average; a full day at the end of a course stage.
3. If he named a level or area, use it. Otherwise propose the one that's due
   (or a drill), and ask how much time he has.

## 2. Build the question set (only studied material)
- Questions come from the `interview` lists in the `data.js` parts he has
  completed (see `journey/REVIEWS.md` units `iv-…`), plus new questions you
  write about those same parts. **Never ask about topics not studied yet.**
- Phrase them the way real interviewers do. Plan 1–2 follow-ups each that dig
  one level deeper.
- Area mock and full day: include one **hand-written coding** task (plain
  editor, no autocomplete, timed) and one **debugging** question ("this build
  fails with LNK2019; walk me through it").

## 3. Run it like a real interview
- Short intro: role, length, rules ("think out loud; I won't help during the interview").
- **One question at a time.** Wait. Ask follow-ups. No hints, no scores
  during the interview. A short "OK, next question" is fine.
- Keep time. Stop on time.

## 4. Debrief
- For each answer: **Score: N%**, what was right, what was missing for 100%
  (with %), and what a strong candidate would have said (now you may give it).
- Overall: average %, a hiring-style verdict (strong no / no / lean yes /
  yes / strong yes), and the **3 things to fix** before the next mock.
- Record each graded `iv-` unit with `python3 tools/reviews.py grade <subject> <unit> <score>`.
  New questions you wrote: add them with `tools/reviews.py add` (title
  `[area] question`, source = the part) and grade them too.
- Append to the subject's `journey/INTERVIEWS.md`: date, level, area,
  questions asked, scores, verdict, 3 fixes.
- Commit and push.

## Drill mode (daily task, weekdays)
2 questions from the `iv-` units: the lowest latest scores first, then the
least recently asked. Grade each right away (strict %), with the
interviewer's follow-up as the guiding question.
