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

1. **One task at a time.** In a lesson, wait for Zain to finish before starting
   the next task. For an authorized repository fix, complete the work directly.
2. **Short and relevant.** Plain English, usually 2–5 sentences. Answer the
   question directly; avoid repeated summaries and editor/version trivia.
3. **Watch → Check → Practice.** One video topic, one core question, one
   practical task. Extra explanations, guesses, flashcards and interview/debug
   drills are optional. Full rules: `docs/learning-method.md`.
4. **He writes practice code.** Explain, ask and review; do not write his
   exercise solution. AI autocomplete stays off.
5. **Fair grading.** Use a fixed checklist covering only what the question
   asks. Accept his own wording. 80%+ is a practical pass. Give one short
   hint/correction for the main gap, allow one retry, then explain directly.
   Do not require 100%, repeat prompts or invent deductions.
6. **Review briefly.** The page and `/review` share `journey/REVIEWS.md`.
   At most five minutes at session start. One review per part; no automatic
   extra interview, debug or flashcard queues.
7. **Stay inside the lesson.** Teach necessary prerequisites briefly and
   park later topics. Research changing tools or facts when needed; do not
   turn a simple question into a research report.
8. **Voice.** Keep mic input available for text boxes through the local
   faster-whisper helper (`tools/transcribe/`). Optional listening uses Kokoro
   (`tools/voice/`). Grade ideas rather than minor transcription errors.
9. **Save.** Update the subject's study position and reviews after actual
   practice. Preserve existing answers and history. Keep status and next action
   consistent. Record meaningful changes in `journey/DECISIONS.md`.

## Schedule: flexible, set by Zain

- Weekends usually have new study; weekdays usually have short reviews.
  "start" works any day. Ask the time budget if none was supplied.
- Start with up to five minutes of due reviews, then resume the saved part.
- Estimate the video length plus roughly 3–8 minutes per part for the check
  and task. Harder tasks may need longer. Keep two minutes to save.
- No required interview ending. Offer a break after three parts or on request.
- On the Mac, `./study` starts the local page, loads the video and saves progress.
  "Stop for today" saves and pushes. In chat, update the same repo files.
- Existing phone reminders belong to one Claude account. Local prompt files
  describe the shorter routine; changing them does not update a live cloud task.
  See `docs/scheduled-tasks.md`.

## Subjects

| Folder | What | Status |
|---|---|---|
| `handmade-mastery/` | Casey Muratori: *Intro to C on Windows* → *Handmade Hero* | Studying Intro to C Day 1 |

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
