# Handmade Mastery: handoff for Claude

Subject folder inside the `learning` repo. The repo root `CLAUDE.md` holds
the learner profile and the working agreement for all subjects: follow it.
This file adds what is specific to this subject. Then read
`journey/STATE.md` for where we are right now.

## Goal and course

- **Goal:** finish Casey Muratori's *Intro to C on Windows* (5 days) and then
  *Handmade Hero* with real mastery. That means being able to build anything
  from scratch with only a text editor, a compiler, a debugger and a keyboard:
  fast handwritten code, strong debugging, and deep understanding of the CPU,
  memory, math and the platform.
- **Background:** his GitHub shows 42-school C projects (`c-42`, `42_Common_Core`).
  Check his real level with questions. Don't assume.
- **Course facts:** Handmade Hero is retired (finished). All episodes are on
  YouTube, with timestamped topic lists at https://guide.handmadehero.org.
  Casey's daily source archives are sold via https://mollyrocket.com. The learner
  writes his own code, and Casey's source is only for comparing. Next course
  after this: Casey's Computer Enhance (https://www.computerenhance.com).

## Subject-specific rules (on top of the root working agreement)

- **Stay inside the episode.** When Casey says "we'll cover this later", park
  it (each study kit has a *Parked for later* list) and teach it when Casey does.
- **Never compile course code on the Mac.** Course code is written and run on Windows.

## Setup progress

| Step | What | Status |
|---|---|---|
| 1 | Choose the toolset | **Done** (2026-10-30). See `docs/toolset.md` |
| 2 | Create the repo and the handoff files | **In progress.** Built as the `learning` repo (this is its first subject); needs pushing to GitHub |
| 3+ | Not decided yet | Decide together, one step at a time |

## Machines

- **Windows PC:** all C that gets compiled and run (Visual Studio Community,
  `cl`, `build.bat`, debugger). Handmade Hero's platform layer is Win32, and
  Intro to C Day 2 reads x64 assembly.
- **Mac M1:** study station (watching, notes, Anki, Claude Code, Manim,
  LearnHarness). Never compile course code here: the M1 is ARM, not x64.
- **Editor on both:** VS Code with the Neovim extension. AI autocomplete is
  off in this repo (`.vscode/settings.json` at the repo root).

## Toolset (short form; full details and install steps in `docs/toolset.md`)

| Job | Tool |
|---|---|
| Compile, run | Visual Studio Community (C++ desktop workload): `cl` + `link`, built from `build.bat` like Casey |
| Debug | Visual Studio debugger now; RAD Debugger (open source) later |
| Code tutor | Claude Code, Learning output style; a custom "Casey tutor" style may follow |
| Concept teaching, practice, knowledge graph | LearnHarness (open source; the learner forked it). **Open:** needs an Anthropic API key (pay per use); a Claude subscription doesn't cover it |
| Visual explanations | Manim via Claude Code's Manim skill (Mac), only for hard ideas |
| Memory | Anki with FSRS. Cards live in the repo as `cards.tsv` per day |
| Speed | Daily blank-file rebuild drill; speedtyper.dev as optional warm-up |
| Episode lesson format | One HTML study kit per episode (see below) |

## Folder map (inside `handmade-mastery/`)

```
CLAUDE.md                 this file: subject handoff (root CLAUDE.md = general rules)
README.md                 human overview of this subject
journey/STATE.md          where we are now and the next action  ← update every session
journey/DECISIONS.md      dated log of every decision and why
docs/toolset.md           each tool: purpose, machine, install, config, status
courses/<course>/dayNN/   materials per episode
    study-kit.html          interactive lesson (blocks × 7 steps), open in a browser
    transcript.txt          timestamped transcript of the episode
    cards.tsv               Anki cards (tab-separated: front, back, tags)
code/                     the learner's own handwritten code (Windows)
tools/transcribe/         how transcripts are made
../.claude/settings.json  repo root: Claude Code settings (Learning style)
../.vscode/settings.json  repo root: editor settings (AI autocomplete off)
```

## The study-kit format (reference: `courses/intro-to-c/day01/study-kit.html`)

Each episode is split at the guide's topic timestamps into blocks. Each block
has 7 steps: **Watch** (time range, what to watch for, pause point) →
**Explain** (notes that follow Casey; prerequisites explained in place; fixes
for anything out of date) → **Experiment** (hands-on) → **Answer** (questions
tied to timestamps, graded) → **Flashcards** → **Read code** (annotated) →
**Why it matters** (CPU, Handmade Hero, career). Plus tabs: Review (spaced
repetition), Parked for later, Toolbox, How to study.
The page's data is the `window.STUDY` object inside the HTML. To make the next
day's kit, copy the file and replace that object.
Published copy of Day 1: https://claude.ai/artifact/DzvNGPZQUXzLUzdLSy2Txc
(private to the learner's account that made it).

## Making a transcript

See `tools/transcribe/README.md`. Line format: `[h:mm:ss] text`.
