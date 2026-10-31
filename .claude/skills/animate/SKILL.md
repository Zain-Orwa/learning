---
name: animate
description: Make an animated or drawn explanation of a hard idea (memory, the stack, pointers, pixels, vectors, collisions, the build pipeline). Use when Zain says /animate, "draw it", "animate this", "show me with motion", or when a study-kit part is hard enough to need one. Renders Manim videos on the Mac; simple ideas get a quick drawing in the chat instead.
---

# Animate an idea

Only for hard ideas, not every part. Stay inside the lesson: animate only what
Casey has covered so far. Plain, simple English in every label.

## 1. Pick the kind of picture
- **Something that moves, step by step** (data moving through memory, the stack
  growing and shrinking, a loop over pixels, compile → link → load): a **Manim**
  video, 20–90 seconds.
- **A still picture** (boxes and arrows, a table, a memory layout at one moment):
  draw it directly in the chat (an inline diagram or a small HTML/SVG page). No
  setup, and it works on every Claude account.

## 2. Write the scene
- File: `<subject>/courses/<course>/dayNN/anim/<name>.py` for a lesson part, or
  `<subject>/anim/<name>.py` for anything else. One idea per file, one `Scene` class.
- Start from `tools/animate/example.py`: it has the study page's colors and the
  basic pattern. Colors: background `#0f1317`, text `#e3e7ea`, muted `#9aa4ad`,
  highlight `#f2c230` (the yellow instruction pointer), good `#6cc48f`, bad `#ec7f7f`.
- Use `Text` (no LaTeX needed). Short labels. Slow: one change at a time, with
  `self.wait(1)` after each important step. Use the lesson's real names and
  numbers (`test.cpp`, `WinMain`, `rsp`, real addresses).

## 3. Render it (on the Mac)
```sh
tools/animate/render.sh <path/to/name.py> <SceneName> [l|m|h]
```
`m` (720p) is the default; use `l` while drafting. The mp4 is saved next to the `.py`.
- If `uv` or Manim is missing, run `./tools/animate/setup-mac.sh` once (ask Zain
  first: it installs uv, cairo and Manim).
- Cloud sessions usually can't install Manim (PyPI is blocked there). Then write
  the scene file, commit and push it, and tell Zain to render it on the Mac with
  the command above. If a still picture is enough, draw it in the chat instead.

## 4. Put it in the study page
For a lesson part, add `anim: "anim/<name>.mp4"` to that block in `data.js` and
rebuild (`python3 tools/study-kit/build.py courses/<course>/dayNN`). The Explain
step shows the video first. Videos under `anim/` are committed (an exception in
`.gitignore`), so keep them small: 720p, under about 10 MB.

## 5. Check it, then show it
Watch the whole video once before showing it: labels readable, nothing
overlapping, and it matches what Casey says. Then give it to Zain with one
sentence on what to watch for.
