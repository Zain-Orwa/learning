# Current state

_Last updated: 2026-10-31_

## Setup
- Step 1, choose the toolset: **done**.
- Step 2, create the repo and handoff files: **done** (2026-10-30).
  - [x] Repo renamed to `learning` (for every subject); this course lives in `handmade-mastery/`
  - [x] Repo structure, CLAUDE.md, toolset doc, decision log
  - [x] Day 1 study kit, transcript and cards moved into `courses/intro-to-c/day01/`
  - [x] Pushed to GitHub: https://github.com/Zain-Orwa/learning (private)
  - [x] Cloned on the Windows PC at `C:\Users\orwaz\learning`
  - [x] Cloned on the Mac (learner says it is there; run `git pull --rebase` on the Mac to get today's commits)
- Step 3, the study routine: **built** (2026-10-30).
  - [x] Study page: video player that plays one part and stops, locked parts, parking lot, recall, breaks, welcome back, Copy position
  - [x] `/study` updated: the page guides; Claude saves position, grades, answers parked questions, builds kits
  - [x] Learning method from Zain's "learning machine" video: `docs/learning-method.md`
  - [x] Strict % grading, guess-first, graded Recall, one-sentence idea / analogy / common mistake in the page
  - [x] Spaced reviews: `journey/REVIEWS.md` + `tools/reviews.py` + `/review`; `/study` adds finished parts
  - [x] Daily review scheduled task "Daily review", every day 12:48 Europe/Berlin (weekdays: reviews + 2 interview questions; weekends: reviews + study-day reminder), cloud, automatic approval, push notification (id `trig_015H7qGd7zXdGP9ACCUadnzw`, lives on the Claude account that created it on 2026-10-31)
  - [x] Flexible schedule: weekends = study ("start" + time, page planner with countdown); weekdays = reviews + interview drill
  - [x] Interview track: interview corner per part, Interview tab, `/interview`, `journey/INTERVIEWS.md`, `tools/reviews.py areas`; Day 1 has 9 interview questions
  - [x] Automation: `./study` helper (auto video, grading in the page via Claude Code, progress + reviews + STATE saved to the repo, push on Stop), playlist for the next videos
  - [x] Debugging track: `docs/debugging-track.md`, `/debug`, 8 Day 1 challenges (timed) in the page, `dbg-` review units
  - [x] Phone reminders stored in the repo (`docs/scheduled-tasks.md`, `/reminders` for other accounts)
  - [x] "Debug challenge" scheduled task: Mon/Wed/Fri/Sun 18:45 Europe/Berlin, cloud, automatic approval, push (id `trig_013u5WqvEma6ksmyvTh6PDjA`, same account as the daily review)
  - [x] Guess step (2026-10-31): Guess is now the first step of every part (look back at the previous part + 2–3 guesses; the video stays covered until they're locked in). Fixed: the end-of-part screen no longer covers the video
  - [x] Manim installed and tested on the Mac (2026-10-31): Manim 0.22.1 in `tools/animate/.venv`, uv, cairo + pkg-config; test video `tools/animate/example.mp4` rendered
  - [ ] Learner tries Day 1 Part 1 with `./study` on the Mac

## Windows tools: all installed and verified (2026-10-30)
- Visual Studio Community 2026 with the C++ workload (MSVC 14.51). Test: a
  small C file built with `cl` (x64) and ran. `vcvars64.bat` prints a harmless
  "vswhere.exe is not recognized" warning; ignore it.
- Git 2.55, VS Code 1.144 with vscode-neovim and C/C++ extensions, Neovim 0.12.6.
- Claude Code 2.1.302 (winget). New terminals find `claude` on PATH.
- DebugView and Coreinfo in `%USERPROFILE%\Tools\Sysinternals`.
- Terminal: PowerShell 7.6 + Starship 1.27 + JetBrainsMono Nerd Font +
  Terminal-Icons + PSReadLine 2.4, tested and working. Details in `docs/toolset.md`.
  VS Code terminal now opens PowerShell 7 too (fixed 2026-10-31, see toolset.md).
- RAD Debugger: later, on purpose.
- Editor: VS Code for Intro to C. Revisit at the start of Handmade Hero (see DECISIONS.md).

## Mac tools: not installed yet
Needed for the first session: Claude Code (logged in), the videos folder
`~/learning-videos/` with the Day 1 video, and `./study`. See `docs/toolset.md`, section "Mac M1".

## Study position
- Course: intro-to-c, Day 01
- Section: 1 of 12 ("Why this series, and getting a compiler", 0:00-5:21)
- Step: Explain (video at 5:21 into the part, episode time 5:21)
- Parts done: 0
- Completed (part id, date): none
- Updated: 2026-11-01

## Debugging log
_(one line per challenge: date, bug class, score, time)_

## Course progress
- Intro to C, Day 1: study kit ready, **not started**.

## Open decisions
- LearnHarness needs an Anthropic API key (pay per use). Use it with Claude
  via an API key, or with another provider, or skip it for now?

## Next action
On the Mac: `git pull --rebase`, put the Day 1 video in `~/learning-videos/`,
open `handmade-mastery/courses/intro-to-c/day01/study-kit.html` in Chrome or Safari,
load the video, and do Part 1. Then tell Claude how it went.
