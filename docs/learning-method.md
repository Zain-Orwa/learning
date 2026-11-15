# Short, practical study sessions

The default is **Watch → Check → Practice**. Keep explanations short and use
only the details needed to understand the code or complete the task.

## One part

1. **Watch** one topic. Give one focus point. No mandatory guesses or recap
   of the previous part before every video.
2. **Check** one core question from memory, in a few sentences. This replaces
   the separate recall, answer, explain and flashcard steps.
3. **Practice** one useful task. Predict, try it, observe the result. Zain
   writes his own code. Record one line about the result or what is still to do.

Explanations, code references, flashcard export, interviews and extra debug
challenges are optional. Use them for a gap or when Zain asks. Do not make
him repeat an idea he has already shown he understands.

## Write the code, with understanding

When Casey codes, Zain also codes. Work one small, meaningful change at a
time, rather than watching a whole episode before trying to recreate it.

1. Watch enough to understand the goal and the change. Pause at a natural
   boundary, often a few minutes; do not interrupt every line.
2. State briefly what should happen and why. During coding, that prediction
   can answer the part's core check; do not ask the same thing again afterward.
3. Write the change himself on Windows. Try from understanding with the video
   paused; consult the relevant lines when needed. Exact boilerplate is a
   reference, not a memory test. No AI-completed implementation.
4. Build and run. Compare the actual output or debugger values with the
   prediction. If it fails, investigate the real failure before moving on.

This implementation is the part's practice. Record its result once; do not
then assign the same program again as a separate exercise. For a concept-only
part, use one useful prediction, trace, tool inspection or small experiment.
If the check reveals a gap, choose practice that tests that gap.

On a Mac-only study day, watch and check if useful, but mark the Windows
implementation pending. At the next Windows session, finish pending code
before adding code that depends on it. Do not accumulate unwritten features.

## Make practice transfer

The continuing course project is the main practice. Avoid rebuilding the
whole engine or starting a parallel project for each episode.

At a natural milestone (a small feature works, or roughly 3–5 substantive
coding sessions), use the next normal practice slot for one small task with
the tutorial closed: change a behavior, implement a small piece, or diagnose
a fault using already-studied ideas. Give the goal and expected behavior,
not the solution. Choose one task; it replaces that slot's usual exercise.
Compare and repair after an attempt. This cadence is a starting point,
not another mandatory queue or a scientific optimum.

For system understanding, ask where data lives, what changes it and in what
order, or why an observed result follows. Select the question relevant to
this change; do not append a full systems quiz to every part.

Debug real errors while coding: reproduce → inspect evidence → form one
testable hypothesis → make a small change → verify. Once the debugger has
been taught, use its breakpoints, stepping and watched values when useful.
If recent sessions offer no diagnostic practice, a small bug task can fill
the milestone slot. Record a useful bug lesson in one line in the existing
state log; do not create a separate report for every typo.

## Choose useful content

- Prioritize how code works, what the tools do, predicting behavior, reading
  errors and verifying results.
- Explain editor controls only when needed to perform the current task.
  Do not quiz editor colors, menu locations, historical version names or
  naming trivia. The learner can look these up.
- Stay inside the lesson. Explain a necessary prerequisite briefly; park
  advanced topics. No new tool installation unless needed now.
- Write simple English. A direct answer is usually 2–5 sentences. No repeated
  summary, analogy or motivation unless it helps with a specific confusion.

## Fair checks

Each check has a question and a fixed checklist of 2–3 core ideas whose
weights total 100. Show the checklist on request. The question must ask for
all the ideas being graded. Background notes are not extra requirements.

- Grade meaning, not wording, grammar, spelling or minor voice-transcription
  errors. Correct ideas in Zain's own words receive full credit.
- Award points only within that checklist. An incorrect claim affects its
  relevant criterion; never add arbitrary deductions or new criteria.
- Reply with the score, one short sentence on what is right, and the main
  gap. Below 80%, give one short hint or correction. Allow one retry, then
  explain the gap directly. Do not keep asking until he reproduces a model answer.
- 80%+ is a practical pass, not a scientific boundary. Correct major
  misconceptions, but do not demand 100% or perfect phrasing.
- The page adds the awarded checklist points itself, so the score and missing
  points cannot contradict each other.

**Finished** means the part's steps were visited and an answer/result was
recorded. **Checked** means its new core check passed and Zain marked the
practical task tried. Neither proves long-term mastery. A later unaided
review is stronger evidence. Preserve historical answers and scores.

## Time

Ask how much time is available. Plan video time plus actual implementation
time and a brief check. Roughly 3–8 extra minutes fits small Intro to C parts;
building a feature can take much longer and is valuable practice.
Spend at most about five minutes on due reviews and keep two minutes to save.
Interview practice is not a required session ending. Offer a break after
three parts, or whenever needed. Stop mid-part when time is up.

For a 60-minute coding session, an initial budget is up to 5 minutes of
reviews, 53 minutes split between video and hands-on work, and 2 minutes to
save. Adjust the split to the task; do not force an episode per session or
treat time spent writing and debugging code as wasted time.

Build kits for the next episode only. Group repeated edits and setup under
one useful idea. Explanations, notes and optional Q&A are read when needed;
do not require rereading everything. Rewatch the relevant timestamp for a
gap, not the entire video. Slow down for unfamiliar code; use a comfortable
speed for familiar explanation. Never mark unwatched or untried work done.

## Visuals and tools

Use the smallest visual that resolves the current confusion: a memory
layout, data-flow diagram, call trace or table with concrete values. Explain
what it predicts, then test that prediction in the code or debugger. A
picture helps understanding; it does not count as hands-on implementation.
Use an interactive view when changing an input or stepping through state
helps. Use the existing Manim `/animate` tool when motion matters; reuse the
visual rather than making a new production for every explanation.

The local study page, tutor, compiler and debugger cover the core routine.
Kokoro listening and faster-whisper dictation stay available. LearnHarness
is parked for now: revisit only for a specific gap the current tools cannot
handle well. It is not the required visualization tool. No new app, paid
model key, knowledge graph or second review queue is needed to continue.

## Check whether the routine works

At the next feature boundary, briefly use actual results: can Zain make a
small change without the video, explain its behavior, and locate a fault
with evidence? A working build alone does not answer all three.
Save the main gap and next action in `STATE.md`, not a new dashboard.
If quizzes are easy but independent work is hard, spend the next practice
slot coding or debugging. If recall is weak, keep the short spaced reviews.
If the routine repeats proven knowledge, remove that repeated work. Change
one thing at a time; do not claim mastery from a percentage or video count.

## One review schedule

`journey/REVIEWS.md`, managed by `tools/reviews.py`, is the shared schedule
for the page and chat. One core review per finished part. Do not automatically
add all its interview questions, debug challenges and flashcards as more work.
Old units and their histories remain valid; don't delete or grade them without
an answer. Add a separate drill only when it is worth keeping after practice.

Ask one short question per due unit, using fresh wording and the same core
checklist. A pass (80%+) moves to the next interval; below 80% returns to one
day. Intervals: 1d → 3d → 1w → 2w → 1m → 3m → 6m, then every 6 months.
Record only units actually answered. Stop at the review time budget and leave
the remaining items due. There is no mandatory extra weekday interview drill.

The in-page flashcard scheduler is retired. Optional Anki export is available
for a learner who chooses it, not another required daily queue.

## Evidence behind the core

Practice testing and distributed practice have strong support in
[Dunlosky et al. (2013)](https://www.psychologicalscience.org/journals/pspi/1529100612453266/).
Short tests during video lectures improved learning and reduced mind wandering
in [Szpunar, Khan & Schacter (2013)](https://doi.org/10.1073/pnas.1221764110).
[Karpicke & Blunt (2011)](https://pubmed.ncbi.nlm.nih.gov/21252317/)
found benefits of retrieval over concept-map study for learning from texts;
that study does not establish a best programming workflow.
The code-pause cycle, milestone cadence and time budgets above are practical
design choices to evaluate through later recall and independent coding,
not experimentally proven optimums or a promise of mastery.
