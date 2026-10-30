---
name: study
description: Guided video study session. Claude splits an episode into timed sections, sends the learner to watch one section at a time, gives tasks after each section, then the Q&A part, and saves the exact position so a distraction or a new account can resume. Use when the learner says /study, "next section", "where was I?", or wants to start or continue an episode.
---

# /study: guided episode session

Goal: the learner never gets lost in a video. Claude holds the plan, gives
**one task at a time**, and saves the position after every step.

Follow the root `CLAUDE.md` working agreement (plain English, short replies,
questions first, he writes the code) and the subject's `CLAUDE.md`.

## The study page is the main guide
Each episode has a page: `courses/<course>/dayNN/study-kit.html` (open it in a
browser on the Mac). It plays the video **one part at a time**, stops by itself
at the end of each part, locks future parts, has a parking lot for questions,
breaks between parts, and remembers the exact place in the browser.
When the learner uses the page, Claude's jobs are:
- **Save the position.** When he pastes a "Save my study position" block,
  copy it into `journey/STATE.md` under **Study position**. For every part in
  its **Completed** list that isn't in `journey/REVIEWS.md` yet, add a review
  unit (run from the repo root), using the part's completion date:
  `python3 tools/reviews.py add handmade-mastery icd01-p03 "Intro C D1 · <part title>" courses/intro-to-c/day01#b03 --date <date>`
  (unit id: course short name + day + part number). Also add each of that
  part's interview questions (its `interview` list in `data.js`):
  `python3 tools/reviews.py add handmade-mastery iv-icd01-b05-0 "[toolchain] <question>" courses/intro-to-c/day01#b05/iv0 --date <date>`.
  Then commit and push.
- **"start" + time:** follow the root `CLAUDE.md` section *Schedule*: reviews
  first, continue from the saved position, plan what fits, last 10 minutes
  for the interview corner and saving.
- **Grade answers** he pastes from "Copy for Claude to check" (follow the text he pastes).
- **Answer parked questions** he pastes, inside the episode's scope.
- **Build kits:** new episodes and Q&A parts (section 1 below).
Use the chat loop in section 2 only when he studies without the page.

## 0. Reviews first, then the position
1. `git pull --rebase`.
1b. Run `python3 tools/reviews.py due`. If anything is due, run the
   `/review` session first (`.claude/skills/review/SKILL.md`), then continue here.
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
- Write `courses/<course>/dayNN/data.js` (same shape as Day 01's: `window.STUDY`
  with blocks, parked, tools, title, storageKey, course, video, qa), then build
  the page: `python3 tools/study-kit/build.py courses/<course>/dayNN`.
  Never hand-edit `study-kit.html`; edit `data.js` or `tools/study-kit/engine.html`
  and rebuild. Every block follows the lesson template in `docs/learning-method.md`:
  `guess` (question before watching), `oneLiner`, `analogy`, `mistake`, plus
  summary, watchFor, explain, experiment, questions, cards, code, why.
  End the kit build with a **self-check** for the learner: list what you could
  not verify (tool versions, claims not found in the transcript). Also write `cards.tsv`. If the kit already exists, use its blocks as the sections.
- Show the learner the section list (number, time range, title) once. Save it.

## 2. The chat loop (when he studies without the page), one section at a time
Give each step, then **stop and wait** for the learner. Never give two steps
in one message.

1. **Watch.** "Watch `start`–`end`: <title>." Add 1 to 2 things to watch for
   and the pause point (`pauseAt` in the kit) with what to think about there.
   Tell him: if he gets distracted, come back and type `/study`.
2. **Predict/answer.** After he says done: 2 to 3 questions from the kit's
   Answer step. He answers first. Grade each one strictly in percent (Score: N%,
   what's right, what's missing for 100% with % per piece, one guiding question;
   see `docs/learning-method.md`), with the timestamp to rewatch.
3. **Explain gaps.** Explain only what his answers show he missed. Short.
   Use the kit's Explain notes. Park anything Casey says comes later.
4. **Do.** One hands-on task from the kit's Experiment step. Code tasks are
   for the Windows PC; he writes the code. Review it, don't rewrite it.
5. **Cards.** Point to this section's cards in `cards.tsv` (or add missing ones).
6. **Save and move on.** Update **Study position** in `STATE.md`
   (next section, step = Watch) and add the finished section to `REVIEWS.md`
   with `tools/reviews.py add`. Then go back to step 1 for the next section.

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
