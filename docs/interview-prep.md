# Interview preparation (all subjects)

Goal: when a course is finished, Zain can walk into a real technical interview
(game studios, systems / C / C++ roles) and do very well. The preparation
grows **only from what he has studied**: no questions on topics not covered yet.

## What real interviews ask (research, 2026-10-31)

Game and systems programming interviews keep returning to the same areas:
- **Build pipeline and C/C++ basics:** debug vs. release, declaration vs.
  definition, compile vs. link errors, what `#include` does, what happens when
  a program runs.
- **Memory:** stack vs. heap, pointers, struct packing / alignment, endianness,
  object pools, avoiding dangling pointers.
- **CPU and performance:** cache lines and L1/L2 caches ("What's the size of
  a cache line?" is a real gameplay-programmer question), data-oriented
  design, SIMD, bit manipulation, mutex vs. atomic.
- **Data structures and algorithms:** big-O of containers, choosing a
  container, hash maps inside, trees, DFS/BFS.
- **Vector and matrix math:** dot and cross product (and when to use each in
  gameplay), ray/sphere and ray/plane intersection, reflection, 4×4 matrices,
  world/camera/screen space.
- **Debugging and optimization:** bugs you can't reproduce, memory
  breakpoints, a black screen, spreading work across frames.
- **Formats:** whiteboard or plain-editor coding, 2–4 hour take-home tests,
  follow-up questions that dig deeper, and "tell me about your project".

Sources: [18 months of game programming interviews (r/gamedev)](https://www.reddit.com/r/gamedev/comments/9n847g/18_months_of_game_programming_interviews),
[Interview checklist for junior graphics programmers (Eric Arnebäck)](https://erkaman.github.io/posts/junior_graphics_programmer_interview.html),
[Glassdoor: gameplay programmer interview questions](https://www.glassdoor.com/Interview/gameplay-programmer-interview-questions-SRCH_KO0,19.htm),
[GameDev.net: interview questions in the industry](https://gamedev.net/forums/topic/584168-interview-questions-in-the-industry/).

## Areas (handmade-mastery)

`c-language`, `toolchain`, `memory`, `cpu` (caches, assembly, SIMD),
`os-windows` (processes, threads, DLLs, Win32), `concurrency`, `dsa`
(data structures and algorithms), `math` (vectors, matrices, intersections),
`graphics`, `engine` (game loop, input, audio, assets, architecture),
`debugging`. Other subjects add their own areas (e.g. `databases`).
Debug challenges (`dbg-…` units) count toward the `debugging` area; the
**bug-squash** mock (a broken project, 30–45 min, thinking out loud) follows
`docs/debugging-track.md`.

## How questions are born

Each study-kit part can have an `interview` list in its `data.js`:
- `q`: the question **as an interviewer would ask it**
- `area`, `level` (junior / mid / senior)
- `followups`: what the interviewer asks next
- `strong`: the strong-answer checklist with % weights (adds up to 100)
- `redflags`: answers that hurt a candidate
- `source`: why this is a real interview question
- `grows` (optional): the answer gets bigger later in the course

The page shows them in the part's **Interview corner** and in the **Interview** tab.
When a part is finished, `/study` adds its interview questions to the review
log as units named `iv-<course><day>-<part>-<n>`, titled `[area] question`.
They then come back on the normal spaced schedule (1d, 3d, 1w, 2w, 1m, 3m, 6m…).

## The weekly rhythm

- **Saturday and Sunday: study days.** New material on the study page. He says
  "start" plus how much time he has; the page and Claude plan to fit.
- **Monday to Friday: review days.** The daily task (12:48 Berlin) asks the
  due reviews **plus 2 interview questions** every weekday, even when no
  review is due, so there is always a short practice.
- He can still study on any day: "start" works every day.

## Mock interviews (`/interview`)

Readiness per area: `python3 tools/reviews.py areas` (question count and
average latest score). Mock history: the subject's `journey/INTERVIEWS.md`.

| Level | When | Length | Format |
|---|---|---|---|
| **Drill** | Every weekday (daily task) | 5–10 min | 2 interview questions, graded in %, with the interviewer's follow-up |
| **Mini mock** | An area has 8+ questions (and 8+ new since its last mock) | 25 min | One area, 5–6 questions with follow-ups, no hints during the interview |
| **Area mock** | An area has 15+ questions and averages 60%+ | 60 min | One area in depth, including writing a small piece of C by hand |
| **Full interview day** | End of each course stage (end of Intro to C, then every big Handmade Hero arc) | 2–3 rounds | Fundamentals, hand-written coding, debugging/optimization, and "walk me through your project" (his own Handmade Hero code) |

During a mock, Claude plays a real interviewer: one question at a time,
realistic follow-ups, **no hints and no grading until the end**. Then a
debrief: score per answer (strict %), the strong-answer checklist, a
hiring-style verdict (strong no / no / lean yes / yes / strong yes), and the
three things to fix before the next mock.
