---
name: study
description: Guided video study session. Claude splits an episode into timed sections, sends the learner to watch one section at a time, gives tasks after each section, then the Q&A part, and saves the exact position so a distraction or a new account can resume. Use when the learner says /study, "next section", "where was I?", or wants to start or continue an episode.
---

# /study: guided episode session

Goal: the learner never gets lost in a video. Claude holds the plan, gives
**one task at a time**, and saves the position after every step.

Follow the root `CLAUDE.md` working agreement (plain English, short replies,
questions first, he writes the code) and the subject's `CLAUDE.md`.

## 0. Find the position
1. `git pull --rebase`.
2. Read the subject's `journey/STATE.md`, section **Study position**
   (course, day, section number, step). If it is missing, ask which episode.
3. If the learner says "where was I?" or comes back after a break: give a
   2-line recap of the current section and the exact timestamp to resume
   from. Then continue from the saved step. Nothing else.

## 1. Prepare the episode (only once per episode)
Claude can't watch video. It works from text:
- **Transcript:** `courses/<course>/dayNN/transcript.txt` (`[h:mm:ss] text`).
  If missing, ask for the video link or file and make one with
  `tools/transcribe/README.md`.
- **Topic timestamps:** https://guide.handmadehero.org for that episode.
- **Sections:** split at topic changes so each section is about one idea,
  usually 4 to 10 minutes. The **Q&A** at the end of the episode gets its own
  sections (group related questions together). Short questions can share a section.
- Build `study-kit.html` from the previous day's kit (replace `window.STUDY`)
  and `cards.tsv`. If the kit already exists, use its blocks as the sections.
- Show the learner the section list (number, time range, title) once. Save it.

## 2. The loop, one section at a time
Give each step, then **stop and wait** for the learner. Never give two steps
in one message.

1. **Watch.** "Watch `start`–`end`: <title>." Add 1 to 2 things to watch for
   and the pause point (`pauseAt` in the kit) with what to think about there.
   Tell him: if he gets distracted, come back and type `/study`.
2. **Predict/answer.** After he says done: 2 to 3 questions from the kit's
   Answer step. He answers first. Grade each one: right / partly / wrong, with the timestamp to rewatch if wrong.
3. **Explain gaps.** Explain only what his answers show he missed. Short.
   Use the kit's Explain notes. Park anything Casey says comes later.
4. **Do.** One hands-on task from the kit's Experiment step. Code tasks are
   for the Windows PC; he writes the code. Review it, don't rewrite it.
5. **Cards.** Point to this section's cards in `cards.tsv` (or add missing ones).
6. **Save and move on.** Update **Study position** in `STATE.md`
   (next section, step = Watch). Then go back to step 1 for the next section.

## 3. After the last section
1. **Q&A sections** run through the same loop.
2. **Whole-video review:** 5 mixed questions across all sections, then the
   kit's Review tab.
3. **Close:** mark the day done in `STATE.md` (Course progress), list the
   parked topics, commit and push. Only *name* the next episode.

## Study position format (in `journey/STATE.md`)
```
## Study position
- Course: intro-to-c, Day 01
- Section: 3 of 14 ("Building: what compiling actually means", 12:13–16:55)
- Step: Watch
- Updated: YYYY-MM-DD
```
Save it after every finished step, so a break or an account switch loses nothing.
Commit when the session ends.
