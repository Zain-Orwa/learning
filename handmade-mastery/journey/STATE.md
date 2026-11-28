# Current state

_Last updated: 2026-11-16_

## Setup
- Repo is shared between the Mac study station and Windows coding machine.
- Shared handoffs: root and subject `AGENTS.md`; Claude entry points use the
  same files. Canonical skills: `.agents/skills/`.
- Study helper, voice input, Kokoro listening and Manim are available in the
  repo. Detailed setup and installation history: `docs/toolset.md`.
- The local page grades through Claude Code. Chat may use Codex or Claude.
- Earlier nine-step lessons, mandatory weekday interviews and extra automatic
  drill queues were retired. Decision history is preserved in `DECISIONS.md`.

## Current routine
- Watch → Check → Practice. When Casey codes, pause at a meaningful change,
  write it yourself on Windows, predict, build/run and compare. This counts
  as the practice; do not do the implementation twice.
- Up to five minutes of due reviews, a brief fixed-rubric check (80% passes),
  at most one retry, then a direct correction. Preserve the unaided review score.
- At a feature boundary, use a normal practice slot for a small independent
  change or bug. No new recurring queue; judge skill from actual work.
- Use a small diagram for confusion; Manim for helpful motion. LearnHarness
  and Anki are parked optional tools, not required setup.
- Plan actual coding time, and keep two minutes to save. Full routine:
  `../../docs/learning-method.md`.

## Study position
- Course: intro-to-c, Day 01
- Section: 5 of 12 ("Errors, object files and the linker", 23:10-32:17)
- Step: Watch
- Parts done: 4
- Completed (part id, date): b01 2026-11-01, b02 2026-11-02, b03 2026-11-23, b04 2026-11-26
- Practice still to try: b03, b04
- Updated: 2026-11-28

## Side trip position
- Course: side trip: How CPUs Work (Branch Education)
- Section: 1 of 20 ("The CPU Inside Your Computer", 0:00-1:45)
- Step: Watch (video at 0:02 into the part, episode time 0:02)
- Parts done: 0
- Completed (part id, date): none
- Updated: 2026-11-28

## Debugging log
_(one line per challenge: date, bug class, score, time)_


## Course progress
- Intro to C, Day 1: **in progress**, 2 of 12 parts finished.
- Historical answers, completion dates and grades are retained. No new
  learner practice or review was graded during the workflow update.
- Page tests used disposable records and fake grader responses.

## Side trip: How CPUs Work (added 2026-11-28)
- Branch Education's "How do CPUs Work?" (36 min) is built as a side trip:
  `courses/side-trips/how-cpus-work`, 20 parts (the video's chapters; sponsor,
  About and thank-you chapters skipped). Not started: 0 of 20 parts.
- Open it with `./study cpu`. `./study` alone still opens Intro to C Day 1.
- Each part's Graphics panel shows the video's own frames in order.
- Parts 8, 11 and 12 also have the video's desk redrawn so it moves (Anatomy
  figure `anatomy/fde.html`): one click is one clock tick of fetch, decode,
  execute, with the video's instructions 1 to 5 and its numbers 42, 68, 110.
- The video file is `~/learning-videos/How_CPU_Works.mp4` (Mac only, not in git).
- It was left from Day 1 Part 4 (cores). The last screen links back to Day 1.

## Pending work
- No new coding task was assigned or attempted in this maintenance session.
  Future deferred practice stays visible in the page and saved position.
- LearnHarness is parked; no API-key decision is needed to resume.
- Live phone reminders remain unverified on the original Claude account.
  Local prompts are ready. See `../../docs/scheduled-tasks.md`.

## Next action
Start `./study`. Spend up to five minutes on overdue reviews, then resume
at the saved Study position above. Write and verify Casey's code on Windows;
leave any untried Windows work pending on a Mac-only day.

## Follow-up
On the original Claude account, run `/reminders` from the updated repo to
update the two existing cloud tasks. Their live prompts, schedules and
notification settings have not been inspected or changed in this session.
On 2026-11-15 a Claude account was checked: it has no tasks and both ids
return 404, so it is not the owning account.

- 2026-11-15: Reminders re-created on the claude.ai chat account (Daily review `trig_01LaGmv4hWn3FBSPhof4G13y`, Debug challenge `trig_01Up8nKs72sre7b9sSxpivaq`). Old account's tasks may still run; turn them off if reminders come twice. Details: docs/scheduled-tasks.md.

## Study page appearance
- 2026-11-16: the experiment's page was adopted as the main page (`./study`).
  Winter look with the game-banner palette, Watch → Check → Practice tabs,
  a narrow one-line parts list, and click-to-pause video with a clear speed menu.
- Study support: Explanation & Listen, Analogy, Graphics, Code & Pseudocode,
  Flashcards, **Ask Claude** (answers stay with the part) and **My notes**
  (per-part notes, Claude summary, Kokoro voice summary, notes path; also
  written to `courses/<course>/dayNN/notes.md`).
- On arrival, due part reviews open in a "Review first" popup that can't be
  skipped (five-minute budget; the rest stays due). Interview/debug rows are
  not forced.
- Saved lesson position and learning history were not changed by this UI work.

## UI experiments
- `./experiment/study` (port 8876) is the workbench for the next UI ideas.
  Try changes there first, then copy the study-kit files here when Zain approves.
  Experiment answers and reviews stay inside `experiment/`.
