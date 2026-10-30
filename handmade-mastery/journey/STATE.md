# Current state

_Last updated: 2026-10-30_

## Setup
- Step 1, choose the toolset: **done**.
- Step 2, create the repo and handoff files: **in progress**.
  - [x] Repo renamed to `learning` (for every subject); this course lives in `handmade-mastery/`
  - [x] Repo structure, CLAUDE.md, toolset doc, decision log
  - [x] Day 1 study kit, transcript and cards moved into `courses/intro-to-c/day01/`
  - [x] Pushed to GitHub: https://github.com/Zain-Orwa/learning (private)
  - [x] Cloned on the Windows PC at `C:\Users\orwaz\learning`
  - [ ] Cloned on the Mac (`~/learning`)
- Step 3: not decided yet.

## Windows tools: all installed and verified (2026-10-30)
- Visual Studio Community 2026 with the C++ workload (MSVC 14.51). Test: a
  small C file built with `cl` (x64) and ran. `vcvars64.bat` prints a harmless
  "vswhere.exe is not recognized" warning; ignore it.
- Git 2.55, VS Code 1.144 with vscode-neovim and C/C++ extensions, Neovim 0.12.6.
- Claude Code 2.1.302 (winget). New terminals find `claude` on PATH.
- DebugView and Coreinfo in `%USERPROFILE%\Tools\Sysinternals`.
- RAD Debugger: later, on purpose.

## Mac tools: not installed yet
See `docs/toolset.md`, section "Mac M1".

## Course progress
- Intro to C, Day 1: study kit ready, **not started**.

## Open decisions
- LearnHarness needs an Anthropic API key (pay per use). Use it with Claude
  via an API key, or with another provider, or skip it for now?

## Next action
Finish Step 2: clone the repo on the Mac (`~/learning`).
