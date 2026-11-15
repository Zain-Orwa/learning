---
name: study
description: Short guided study sessions with Watch, Check and Practice; resume saved progress and save after each task.
---

# /study

Read the root and subject `AGENTS.md`, `docs/learning-method.md` and the
subject's `journey/STATE.md`. Keep replies short. Zain writes his practice code.
Use `docs/learning-method.md` for the coding cycle, milestone tasks and visuals;
do not replace it with a second lesson plan.

1. Check the time budget. Read due units with `python3 tools/reviews.py due`.
   Spend at most five minutes on reviews, then resume the saved study position.
2. On the Mac start `./study`. The page runs the session. Help with questions
   and keep the repo instructions consistent. Without the page, follow the
   same three steps in chat, one task at a time:
   - **Watch:** give the timestamp range and one focus point.
   - **Check:** ask the part's `check.q`. Grade with its fixed `check.rubric`
     only. 80% passes. One short hint/correction and one retry for a gap, then
     explain directly. No repeated recall + quiz + explanation sequence.
   - **Practice:** he implements Casey's meaningful code change on Windows,
     predicts the result, builds/runs and checks it. This counts as the task;
     do not assign the implementation again afterward. For concept-only parts,
     use the part's one useful inspection or experiment. If his prediction
     already answered the core check, do not ask it twice. Record one result.
     Keep Mac-only deferred code pending and finish it before dependent code.
3. At a finished part, add ONE unit with `tools/reviews.py add`. Keep the
   part/source ID stable. Do not add all interviews, debug challenges or cards.
4. Stop on time, including mid-part. Keep two minutes to save `STATE.md` and
   actual review results. Keep pending coding, course progress and next action accurate.
   Commit and push session work under the repo agreement.

## Building a kit

Use the transcript and the source's topic timestamps. One block per useful
idea or coherent code change, not every repeated edit. Write `focus`,
`check: {q, rubric}`, one useful `practice`, realistic
`practiceMinutes` and a `reviewQuestion` that asks for the same core ideas in
new words. Each rubric has 2–3 items totaling 100. Do not quiz editor colors,
old product editions or details the question never requested.

Budget actual implementation time; 3–8 extra minutes is only a small-task
default. At a feature boundary, use one independent change or debugging task
in the normal practice slot. Use a small visual for a specific confusion;
Manim only when motion helps. Build only the next needed kit.

Optional notes and code references explain gaps; they are not more required
steps. Keep voice input and optional Kokoro listening. Preserve the existing
`say` and audio format; regenerate audio if its spoken text changes.
Build with `python3 tools/study-kit/build.py courses/<course>/dayNN` from the
subject folder, and update the playlist. Never edit `study-kit.html` by hand.
