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
- **Every place Zain can type (study pages, new tools, future subjects) also has a mic button that
  transcribes speech with the local helper.** On the study page this is automatic: `attachMics()` in
  `engine.html` adds a mic to every `<textarea>` and text `<input>`, so a new box needs no code.

## Setup progress

| Step | What | Status |
|---|---|---|
| 1 | Choose the toolset | **Done** (2026-10-30). See `docs/toolset.md` |
| 2 | Create the repo and the handoff files | **Done** (2026-10-30). Cloned on both machines |
| 3 | The study routine | **Built** (2026-10-30/31): study page with video player, strict % grading, `/study`, `/review`, daily review task. Learner has finished Day 1 Parts 1–2 |
| 4+ | Not decided yet | Decide together, one step at a time |

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
| Visual explanations | Manim through the repo skill `/animate` (renders on the Mac; one-time setup `tools/animate/setup-mac.sh`), only for hard ideas |
| Listening | Kokoro-82M (offline, voice `am_michael`) through `tools/voice/make_audio.py`: the study page's Listen button and the interviewer's voice play it (one-time setup `tools/voice/setup-mac.sh`) |
| Speaking | faster-whisper `small.en` (offline, int8, CPU) in `tools/transcribe/`: the mic button in every text box (one-time setup `tools/transcribe/setup-mac.sh`) |
| Memory | Shared review log in `journey/REVIEWS.md`; optional Anki export |
| Speed | Optional blank-file rebuild drill when useful |
| Episode lesson format | One HTML study kit per episode (see below) |

## Folder map (inside `handmade-mastery/`)

```
CLAUDE.md                 this file: subject handoff (root CLAUDE.md = general rules)
README.md                 human overview of this subject
journey/STATE.md          where we are now and the next action  ← update every session
journey/DECISIONS.md      dated log of every decision and why
journey/REVIEWS.md        spaced-review log (edit only with ../tools/reviews.py)
docs/toolset.md           each tool: purpose, machine, install, config, status
courses/<course>/dayNN/   materials per episode
    data.js                 the lesson content (source)
    study-kit.html          built page (served by ./study), plays the video part by part
    progress.json           his progress on this kit, written by the helper (committed)
courses/playlist.json     the order of videos (kit, title, video file, built yes/no)
    transcript.txt          timestamped transcript of the episode
    cards.tsv               Anki cards (tab-separated: front, back, tags)
code/                     the learner's own handwritten code (Windows)
tools/transcribe/         how transcripts are made
tools/study-kit/          page engine, build script, serve.py (the ./study helper)
../.claude/settings.json  repo root: Claude Code settings (Learning style)
../.vscode/settings.json  repo root: editor settings (AI autocomplete off)
```

## The study-kit page (reference: `courses/intro-to-c/day01/`)

One page per episode. The default is **Watch → Check → Practice**:
one short video part, one core question, one practical task. Notes, code
references, interview drills and debugging challenges are optional.

**Start:** `./study` from the repo root. The helper loads the video from
`~/learning-videos`, grades answers, saves progress and updates `STATE.md`.
The Review tab and chat share `journey/REVIEWS.md`. Finished parts add one
review unit, not every possible drill. On Stop for today it saves and pushes.
Without the helper, local browser progress and Copy position still work;
use `/review` in chat for the shared review schedule.

**Content:** edit `courses/<course>/dayNN/data.js`, then run
`python3 tools/study-kit/build.py courses/<course>/dayNN` from this subject.
Never hand-edit the built page. Each block needs:
- `focus`: one thing to notice while watching.
- `check: {q, rubric: [[idea, weight], ...]}`: one core question, 2–3 ideas,
  weights total 100. Every graded idea must be requested by the question.
- `practice`: one short task in HTML, and `practiceMinutes` (usually 2–7).
- `reviewQuestion`: fresh wording testing the same rubric.
- The existing summary, explain, code, cards and optional drills can remain
  reference material. Avoid editor trivia and obsolete installer names.

`finished` records the steps visited. `checked` requires a new check at 80%+
and the learner's confirmation that the practical task was tried. Preserve
old progress, guesses, answers and grades; do not infer mastery from them.
When a saved step is removed, resume at the next useful Watch/Check/Practice
step without resetting completed parts.

Mic buttons are attached automatically to text boxes. The helper uses the
local faster-whisper worker; special names can go in `terms`. Optional audio
uses existing Kokoro segments, keyed by their text. If changing spoken notes,
update `say` (one plain-English object per code block/table) and regenerate:
`uv run --project tools/voice python tools/voice/make_audio.py handmade-mastery/courses/<course>/dayNN`
from the repo root. See the scripts in `tools/voice/` for audio details.

For a new kit, use the same three-step flow and concise checks. Do not restore
the former nine required steps. Follow `docs/learning-method.md` at repo root.

## Making a transcript

See `tools/transcribe/README.md`. Line format: `[h:mm:ss] text`. The faster-whisper environment
is shared with the mic buttons: `../tools/transcribe/` (repo root).
