# Learning repo: handoff for Claude

This repo holds everything Zain is learning. Each subject has its own folder
with its own `CLAUDE.md`. **Read this file, then the subject's `CLAUDE.md` and
its `journey/STATE.md`, before doing anything.**

## The learner

- Zain (GitHub: Zain-Orwa). English is not his first language, so write in
  plain, simple English. Keep replies short unless he asks for detail.
- Machines: **Mac M1** (study) and a **Windows PC** (when a subject needs
  Windows). Editor: VS Code with the Neovim extension.
- He switches between several Claude accounts. Everything needed to continue
  must live in this repo, never only in a chat.

## Two machines, one GitHub repo

Both machines clone this repo and push to it. Each machine owns different
folders, so they rarely touch the same file:

| Machine | Creates and edits |
|---|---|
| **Windows PC** | Code that must compile and run on Windows: `*/code/**` (`.c`, `.cpp`, `.h`, `build.bat`). Build output stays local and is never committed (`.gitignore`). |
| **Mac (study)** | Study material: `*/courses/**` (study kits, transcripts, `cards.tsv`), notes, animations, `*/docs/**`, `*/tools/**` |
| **Either** | `*/journey/STATE.md` and `*/journey/DECISIONS.md`, from whichever machine the session ran on |

**Git routine on every machine:**
1. Start of session: `git pull --rebase`
2. End of session: update `journey/STATE.md`, then `git add -A`, `git commit`, `git push`
3. If a push is rejected: `git pull --rebase`, fix any conflict, push again.

Line endings are fixed by `.gitattributes` (CRLF for Windows code, LF for
everything else), so both machines can edit safely.

## Working agreement (all subjects)

1. **One step at a time.** Never present or start the next step until the
   current one is finished and he says so. Only *name* the next step.
2. **Research before recommending.** Search online for the current best tool
   or method, give sources, and say why it fits him.
3. **Stay inside the lesson.** Teach what the source covers at that point.
   Park topics the source postpones and teach them when it gets there.
   Exception: a prerequisite needed right now is explained right away.
4. **He writes the code.** Claude explains, asks, reviews and leaves
   `TODO(human)` gaps, but never writes his practice code. (Output style for
   this repo: **Learning**, set in `.claude/settings.json`.)
5. **Questions first.** Ask him to predict and answer before showing explanations.
6. **Grade strictly, in percent.** Every answer, explanation or piece of code
   gets a **Score: N%**, what's right, and what's missing or wrong for 100%
   (with the % each piece is worth). Below 100%: ask one guiding question
   instead of giving the answer. Full rules: `docs/learning-method.md`.
7. **Review before new.** Every study session starts with any reviews due in
   the subject's `journey/REVIEWS.md` (`/review`), then new material.
8. **Keep the repo current.** At the end of every session, update the subject's
   `journey/STATE.md` and `journey/REVIEWS.md`, add new decisions to its
   `journey/DECISIONS.md`, then commit and push.

**The learning method** (five principles, strict grading, mentor behavior,
lesson template, review schedule) is in `docs/learning-method.md`. Read it
once per session. **Interview preparation** (areas, drills, mock interviews)
is in `docs/interview-prep.md`. **Debugging mastery** (Agans' 9 rules, rubric,
levels, challenge formats) is in `docs/debugging-track.md`. **Phone reminders**
(scheduled tasks, one account only) are in `docs/scheduled-tasks.md`.

## Schedule: flexible, set by Zain

- **Study days: Saturday and Sunday** (new material). No fixed hours.
- **Review days: Monday to Friday.** The daily task (12:48 Europe/Berlin)
  asks due reviews plus 2 interview questions.
- **Debug challenges:** Monday, Wednesday, Friday and Sunday at 18:45 Berlin
  (scheduled task), plus one in the Experiment step of many parts.
- **"start"** (any day): Zain says *start*, usually with how much time he has
  ("start, 1h30"). If he gives no time, ask. Then:
  1. Reviews due first (keep them to about 15% of the time).
  2. Continue exactly where he stopped (`journey/STATE.md` → Study position,
     or the study page).
  3. Plan only what fits the time; say the plan in 2–3 lines. A part takes
     about 1.3 × its video minutes + 30 minutes (the page shows estimates).
  4. Last 10 minutes: interview corner, save the position, commit and push.
  The study page has the same planner ("How much time do you have today?").
  **On the Mac, "start" means:** run `./study` from the repo root in the
  background (it pulls, starts the helper and opens the page). The page then
  plays the video, grades, saves and pushes by itself. Claude stays available
  in the chat for questions.

## Subjects

| Folder | What | Status |
|---|---|---|
| `handmade-mastery/` | Casey Muratori: *Intro to C on Windows* → *Handmade Hero* | Setting up |

To add a subject: create a folder with its own `CLAUDE.md`, `README.md`,
`journey/STATE.md`, `journey/DECISIONS.md`, `journey/REVIEWS.md` and
`journey/INTERVIEWS.md`, and add a row to this table. The daily review task checks every subject's `REVIEWS.md`.

## Commands (skills in `.claude/skills/`)

| Command | What it does |
|---|---|
| `/study` | Study session: saves the page position, grades, parked questions, builds kits |
| `/review` | Spaced-review session: asks about everything due in `REVIEWS.md`, grades in %, reschedules |
| `/interview` | Interview practice: drill, mini mock, area mock or full interview day; real-interviewer style, strict debrief |
| `/debug` | Debugging challenge from studied material: timed, graded with the debugging rubric |
| `/reminders` | Create/update the phone reminders (daily review, debug challenge) on the current Claude account |
| `/animate` | Animated explanation of a hard idea (Manim video, rendered on the Mac) or a quick drawing |
