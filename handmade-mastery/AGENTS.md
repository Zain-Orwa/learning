# Handmade Mastery: shared subject handoff

Follow the root `AGENTS.md`, then read `journey/STATE.md`.
The complete study routine is `../docs/learning-method.md`.

## Goal and boundaries

Study Casey Muratori's Intro to C on Windows, then Handmade Hero. Build skill
in writing code, diagnosing bugs, and explaining how the system works.
Use the episode guide at https://guide.handmadehero.org for topic timestamps;
the transcript and Zain's code are the sources for the current lesson.

- Zain writes the code Casey teaches. Pause after a small coherent change;
  predict its result, implement it, build and verify on Windows. This is the
  required practice, not an extra exercise after copying the whole episode.
- Teach the reason for the change. Do not require identical variable names,
  memorized boilerplate or Casey's exact wording. Compare with Casey's code
  after an attempt when needed; the tutor does not complete the exercise.
- Keep later topics parked. Teach a prerequisite briefly when needed now.
- All course C/C++ is written, built and run on **Windows**. The **Mac** is
  for the video, study page, notes, voice and visuals. A deferred Windows task
  stays pending; watching or a quiz score cannot stand in for running it.
- AI autocomplete stays off. Use VS Code + Neovim and the existing compiler
  and debugger. Full setup details are in `docs/toolset.md`.

## Tools and records

`./study` from the repo root starts the local page. The page uses Claude Code
for grading; chat can use Codex or Claude with the same rules. Do not claim
the helper's grader was switched to Codex.

- `journey/STATE.md`: position, pending work, next action; update after practice.
- `journey/DECISIONS.md`: dated decisions and reasons; keep history.
- `journey/REVIEWS.md`: the only review schedule; edit with `../tools/reviews.py`.
- `journey/INTERVIEWS.md`: optional interview history.
- `courses/playlist.json`: episode order and whether each kit is built.
- `courses/<course>/dayNN/data.js`: lesson content; `progress.json`: answers
  and page position. Preserve historical work and dates.
- `code/`: Zain's handwritten code, owned by the Windows machine.

Use a small diagram for a hard idea; use the repo's `/animate` skill and
Manim for motion that helps. Keep faster-whisper mic input in editable boxes
and existing optional Kokoro audio. LearnHarness and Anki are parked optional
tools, not required installations or parallel practice/review queues.

## Side trips (go understand, then come back)

A side trip is one outside video studied the same way (Watch → Check →
Practice) to understand something the course touches but does not explain.
It is not part of the course order.

- Kits live in `courses/side-trips/<name>/` and have a `playlist.json` entry
  with `"sideTrip": true` and `"returnTo": "<course kit>"`.
- `./study` never opens a side trip by itself. Open one with `./study <word>`
  (for example `./study cpu`). Its last screen links back to the course.
- A side trip saves `## Side trip position` in `journey/STATE.md`; the course's
  `## Study position` is left alone. Its reviews join the normal `REVIEWS.md`.
- In `data.js` set `teacher`, `lessonLabel`, `watchNote`, `pendingNote`,
  `micContext` and `positionHeading: "Side trip position"`. Tasks are small Mac
  tasks; there is no Windows code. Skip sponsor and channel chapters.
- Use the video's own frames as the part's graphics: `frames/bNN-MMmSSs.jpg`,
  listed in order in `visual` with the time and what to notice.
- Current: `side-trips/how-cpus-work` (Branch Education, "How do CPUs Work?"),
  left from Intro to C Day 1 Part 4.

## Building the next kit

Build only the next needed episode, not hundreds of speculative kits. Group
the transcript by useful ideas or meaningful code changes, not each click or
repeated edit. Keep the default Watch → Check → Practice flow.

Each block has `focus`, `check: {q, rubric: [[idea, weight], ...]}`, `practice`,
`practiceMinutes` and `reviewQuestion`. The 2–3 rubric weights total 100 and
cover only ideas requested in the question. `practiceMinutes` estimates the
actual work, including coding; a large implementation can exceed 8 minutes.
Use the lesson's implementation as the task; avoid assigning the same work twice.
Optional `visual` HTML can show a small model without adding a required step.
Give each block `lab`: the tool shown beside its Practice task. `"code"` is the
Code Lab (write, build and run C on the Mac), `"cpu"` is Task Manager's CPU page
(cores, logical processors, live load), `"none"` shows no tool. Pick the one the
task actually uses; leaving it out shows Code Lab only when the task builds code.

Build from this subject with:
`python3 tools/study-kit/build.py courses/<course>/dayNN`.
Never hand-edit the generated `study-kit.html`. If changing existing spoken
notes, update `say` and regenerate their Kokoro audio with the root
`tools/voice/make_audio.py`. Transcript instructions: `tools/transcribe/README.md`.

`finished` means an answer and result/pending note were recorded. `checked`
requires 80%+ on the new check and the learner's confirmation of actual
practice. Neither proves retention. Do not reset old progress or make Zain
redo old parts just to populate new fields.
