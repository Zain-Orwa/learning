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
6. **Keep the repo current.** At the end of every session, update the subject's
   `journey/STATE.md` and add new decisions to its `journey/DECISIONS.md`.

## Subjects

| Folder | What | Status |
|---|---|---|
| `handmade-mastery/` | Casey Muratori: *Intro to C on Windows* → *Handmade Hero* | Setting up |

To add a subject: create a folder with its own `CLAUDE.md`, `README.md`,
`journey/STATE.md` and `journey/DECISIONS.md`, and add a row to this table.
