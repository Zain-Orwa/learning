# Decision log

Newest at the bottom. Each entry: date, decision, why.

## 2026-10-30: Working agreement
- Work one step at a time. Never present the next step before the current one is done.
- Research online before recommending tools or methods.
- Stay inside what Casey covers at each timestamp. Park his "later" topics.
- The learner writes all practice code himself.

## 2026-10-30: Machines
- **Windows PC** for everything that compiles and runs. Why: Handmade Hero's
  platform layer is Win32, and Intro to C Day 2 reads x64 assembly. The M1 is ARM.
- **Mac M1** for study: watching, notes, Anki, Claude Code, Manim, LearnHarness.

## 2026-10-30: Editor
- Keep **VS Code + Neovim extension** on both machines. Why: he already uses it,
  and Vim motions are the keyboard-speed skill he wants. Casey uses Emacs, but
  switching would add a second learning curve with no payoff.
- **AI autocomplete off** in this repo, so every line comes from his own head.

## 2026-10-30: Build and debug
- Build like Casey: `build.bat` calling `cl` from a terminal (from Handmade Hero Day 1).
  Intro to C days use the Visual Studio project as Casey does.
- Debug in the Visual Studio debugger. Move to **RAD Debugger** (free, open source)
  once stepping through code is routine. RemedyBG was skipped (closed source, paid).

## 2026-10-30: Learning tools
- **Claude Code in Learning output style** is the code tutor (`TODO(human)` gaps).
- **Manim** via a Claude Code skill makes animations for hard ideas only.
- **Anki with FSRS** for memory. Cards are stored in the repo per day.
- **Blank-file rebuild drill** for speed. speedtyper.dev is an optional warm-up.
- **One HTML study kit per episode** (format set by Intro to C Day 1).
- Not chosen: codebase-to-course (made for people who don't write the code
  themselves; maybe for big review checkpoints later), LEAP and OpenMAIC (they
  need separate servers and other AI models, and duplicate Claude Code + Manim).

## 2026-10-30: LearnHarness added
- It's the "learn harness" tool the learner had in mind (he forked it:
  github.com/Zain-Orwa/learnharness). It's an open-source desktop app (macOS,
  Windows, Linux) that measures understanding, plans a path, teaches step by
  step, runs practice sessions and keeps a knowledge graph.
- Role: deep concept teaching and practice on the Mac, alongside the episode study kits.
- **Open question:** it uses Claude only through an `ANTHROPIC_API_KEY` (pay per
  use). Its only subscription login is for ChatGPT. Decide whether to buy API
  credit, use another provider, or skip it for now.

## 2026-10-30: One repo for all learning
- The GitHub repo is `learning`, meant to hold every subject Zain studies.
  This course lives in `handmade-mastery/`. General rules sit in the root
  `CLAUDE.md`; each subject folder has its own `CLAUDE.md`, `journey/STATE.md`
  and `journey/DECISIONS.md`.

## 2026-10-30: No Linux machine
- Only two machines: Windows PC (code) and Mac M1 (study). Linux isn't needed:
  Handmade Hero is Windows-only, and the Mac already covers all study tools.
  Fewer machines means less setup and less to keep in sync.

## 2026-10-30: Editor for now, review later
- Use **VS Code + Neovim extension** for *Intro to C on Windows*.
- Look at the editor again when Handmade Hero starts: watch what Casey uses
  there and decide then. Why: decide with real experience, not in advance.

## 2026-10-30: Guided study sessions (`/study`)
- Problem: while watching, he gets distracted, searches something, and loses his place.
- Fix: the `/study` command (`.claude/skills/study/SKILL.md`). Claude splits each
  episode into timed sections (Q&A included), gives one task at a time (watch,
  answer, explain gaps, do, cards), and saves the exact position in `STATE.md`
  after every step. "Where was I?" gives a 2-line recap and the timestamp.
- Builds on the study kit: its blocks are the sections. Claude works from the
  transcript and the guide's timestamps, because it can't watch video.

## 2026-10-30: The study page guides everything
- The study page is the main guide: it plays the video **inside the page**, one part
  at a time, and **stops by itself** at the end of each part. Future parts stay locked.
- Parking lot while watching (no leaving to search), Recall from memory after each part,
  breaks between parts (5 min; 15 after every 3 parts), "Welcome back" + card warm-up
  when he returns, and "Copy position" so `/study` can save the place in `STATE.md`.
- `/study` stays as the Claude side (position, grading, parked questions, building kits)
  and as a chat-only fallback.
- Why: he gets distracted and loses his place. Short parts with questions after
  each one reduce mind wandering (Szpunar, Khan & Schacter, PNAS 2013).
- One shared engine (`tools/study-kit/engine.html`) + one `data.js` per episode,
  built with `tools/study-kit/build.py`.

## 2026-10-31: Learning method from the "learning machine" video
- Zain shared a video (Sintech channel, built on YouMind) on learning with AI.
  We adopted its method, adapted to our tools (written up in `docs/learning-method.md`):
  - **Five principles** (Dunlosky et al. 2013): guess before you know, test yourself,
    spaced repetition, apply immediately, explain in your own words.
  - **Strict grading in percent**: score, what's right, what's missing for 100% with %
    per piece, one guiding question instead of the answer.
  - **Mentor behavior**: review before new material, Socratic hints, a summary and review dates at the end.
  - **Lesson template** per part: guess first, one-sentence idea, real-life analogy,
    common beginner mistake, questions, apply, explain. Kits end with a self-check of
    what couldn't be verified.
  - **Scheduled review task** so he never forgets that a review is due.
- Not adopted: the YouMind platform itself. Claude Code + this repo + scheduled
  tasks already do the same, and keep everything in his own GitHub.

## 2026-10-31: Review schedule
- 1 day → 3 days → 1 week → 2 weeks → 1 month → 3 months → 6 months → every 6 months.
  (He asked for 1d, 1w, 1m, 3m, 6m; we added 3d and 2w as the video and memory research do.)
- Pass = 80%+. Below 80%: short re-teach, back to 1 day.
- Log: `journey/REVIEWS.md`, only edited with `tools/reviews.py` (dates computed, not guessed).
- Daily review task at ~13:00 Europe/Berlin (Zain's choice: midday, Central Europe).
