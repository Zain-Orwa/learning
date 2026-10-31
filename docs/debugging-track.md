# Debugging track (all subjects)

Goal: Zain becomes a **master debugger**: finds the real cause fast, fixes it
with the smallest change, proves it's fixed, and can explain his process out
loud in an interview. Challenges come **only from material he has studied**,
and they get harder as the course goes on.

## The method (taught and graded every time)

David Agans' **9 indispensable rules** of debugging:
1. **Understand the system:** know what *should* happen (read the docs, know the tools).
2. **Make it fail:** reproduce the bug on demand before changing anything.
3. **Quit thinking and look:** read the real error, the real values, the real
   output. Don't guess.
4. **Divide and conquer:** narrow it down (which stage? compile, link, load,
   run? which half of the code?).
5. **Change one thing at a time,** and predict the result before you run it.
6. **Keep an audit trail:** write down what you tried and what happened.
7. **Check the plug:** question the obvious (wrong file saved? wrong
   configuration? old build running?).
8. **Get a fresh view:** explain it to someone else (rubber duck, or Claude).
9. **If you didn't fix it, it ain't fixed:** prove the fix and know *why* it works.

How interviews test it (Stripe's "bug squash", Amazon's planted-bug
snippets, Retool's live repo): **reproduce first, read the actual error or
stack trace, state a specific hypothesis before editing, narrow down with
breakpoints / printed state / bisecting, make the smallest fix, confirm it,
and explain why it works.** The classic mistakes are editing on a hunch,
skimming past the error message, and rewriting a whole function instead of
finding the fault.

Sources: [Agans' 9 rules (David A. Wheeler's review)](https://dwheeler.com/essays/debugging-agans.html),
[Bug squash: an underrated interview question (Jake Zimmerman)](https://blog.jez.io/bugsquash/),
[The debugging interview and how not to freeze in it](https://www.techinterview.org/post/3233476091/debugging-interview-format/),
[Andreas Zeller, *Why Programs Fail* (the scientific method for debugging)](https://shop.elsevier.com/books/why-programs-fail/zeller/978-0-12-374515-6).
Casey teaches the debugger hands-on from Intro to C Day 2 onward (breakpoints,
watch window, stepping, assembly, memory window), and Handmade Hero debugs live
on stream constantly.

## Grading rubric (100%)

| Part | % | What earns it |
|---|---|---|
| Reproduce / observe | 15 | Says how to see the failure; reads what's actually there |
| Read the evidence | 20 | Uses the exact error code, message, line, or value |
| Hypothesis | 20 | A specific, testable guess, stated before the fix |
| Narrowing | 15 | Picks the right stage or place; doesn't edit at random |
| Root cause | 15 | Names the real cause, not a symptom |
| Fix + verify | 15 | Smallest correct fix, and how he'd prove it's fixed |

**Speed is tracked too:** the clock starts when the challenge is shown. The
target time shrinks as the same bug class comes back in reviews.

## Levels (unlocked by the course)

| Level | Bug classes | Unlocked by |
|---|---|---|
| 1 | Build errors: compile vs. link vs. subsystem/entry point, missing declaration or `#include`, typos in names, missing `;`, missing return | Intro to C Day 1 |
| 2 | Debugger basics: breakpoints, stepping, watch window, wrong values, uninitialized variables, overflow | Intro to C Day 2 |
| 3 | Memory: pointers, stack, the memory window, writing past an array, endianness, struct padding | Intro to C Days 3–4 |
| 4 | Control flow and operators: off-by-one, precedence, `=` vs `==`, wrong loop bounds | Intro to C Day 5 |
| 5+ | Platform, crashes (access violations), memory corruption, data breakpoints, optimized-build bugs, timing, multithreading, performance | Handmade Hero, as each topic is covered |

## Challenge formats

- **Read the error:** a build log or crash message → the root cause and fix.
- **Spot the bug:** a short snippet (Amazon-style) → the bug, why, the fix.
- **"It runs but…":** wrong or missing output → list the possible causes and
  how to check each one, in order.
- **Hands-on (Windows):** Claude puts a broken mini-project in
  `handmade-mastery/code/debug-challenges/<id>/`; he builds it, debugs it in the
  debugger, fixes it, and pushes. Claude checks the fix and his notes.
- **Bug squash (mock interview):** a bigger broken project, 30–45 minutes,
  thinking out loud, graded with the rubric (part of `/interview`).

## Where challenges live

- Each study-kit part can have a `debug` list in its `data.js` (title, level,
  scenario, task, hint, solution checklist with %, root cause). The page shows
  them in the **Experiment** step and in the **Interview** tab.
- Finished parts add their challenges to the review log as `dbg-…` units
  (`[debugging] title`), on the normal spaced schedule.
- `/debug` runs a challenge session any time.
- The **Debug challenge** scheduled task (Mon, Wed, Fri, Sun at 18:45 Berlin)
  sends one challenge to his phone. See `docs/scheduled-tasks.md`.
