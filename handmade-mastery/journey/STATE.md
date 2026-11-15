# Current state

_Last updated: 2026-11-15_

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
- Section: 3 of 12 ("Building: what compiling actually means", 12:13-16:55)
- Step: Watch (video at 0:05 into the part, episode time 12:18)
- Parts done: 2
- Completed (part id, date): b01 2026-11-01, b02 2026-11-02
- Updated: 2026-11-15

## Debugging log
_(one line per challenge: date, bug class, score, time)_


## Course progress
- Intro to C, Day 1: **in progress**, 2 of 12 parts finished.
- Historical answers, completion dates and grades are retained. No new
  learner practice or review was graded during the workflow update.
- Page tests used disposable records and fake grader responses.

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
- Final winter reference applied: dark teal shell, compact frosted cards,
  left video/takeaway/audio stack and structured Explanation alongside it.
- Saved lesson position and learning history remain unchanged by this UI work.

- Sidebar refinement: course sections use the full available height;
  expanded lesson lists scroll internally when long.

- Sidebar now lists all 12 actual episode parts, replacing the seven sample
  chapter names. Scroll the part list to reach the later parts.

- Horizontal navigation now selects one highlighted inline view consistently;
  browsing tabs does not advance the saved lesson or complete study work.

- Sidebar states: finished parts have a green-teal tint/checkmark; the current
  part has amber accents. Part headings highlight on hover and keyboard focus.

- Completed study tabs retain ticks and green coloring; selected views are
  saved per part. Optional-view completion stays separate from core progress.

- Technical explanation rows now separate icons, amber labels and descriptions
  into aligned columns, with a stacked layout for narrow cards.

## Pending UI experiment
- A separate copy runs with `./experiment/study` on port 8876. It tries
  Watch → Check → Practice with supporting tools kept optional.
- Main application behavior is unchanged. Await Zain's review before promotion;
  experiment answers and review results stay inside `experiment/`.
