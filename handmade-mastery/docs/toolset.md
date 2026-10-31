# Toolset

Every tool we use, what it's for, which machine it runs on, and how to set it up.
**Status** is updated as each tool gets installed. `[ ]` = not yet, `[x]` = done.

## Windows PC (compiles and runs all course code)

### [x] Visual Studio Community: compiler, linker, debugger
- **For:** `cl.exe` (compiler), `link.exe` (linker) and the debugger: the same tools Casey uses.
- **Install:** https://visualstudio.microsoft.com/vs/community/ → in the installer,
  tick the workload **Desktop development with C++**.
- **Check:** Start menu → **x64 Native Tools Command Prompt for VS** → type `cl`.
  It prints "Microsoft (R) C/C++ Optimizing Compiler … for x64".
- **Installed:** C++ workload is present; x64 compiler verified on 2026-10-30.
- **Note:** Casey shows VS Express 2013 and VS 2008. Menus differ today, but the ideas are the same.

### [x] Git for Windows
- **For:** cloning this repo; Claude Code also uses its Git Bash.
- **Install:** https://git-scm.com/downloads/win

### [x] VS Code + Neovim extension
- **Install:** VS Code from https://code.visualstudio.com, Neovim 0.10+
  (`winget install Neovim.Neovim`), then the extension **vscode-neovim**
  (`asvetliakov.vscode-neovim`) and **C/C++** (`ms-vscode.cpptools`).
- **If the extension can't find Neovim:** set
  `vscode-neovim.neovimExecutablePaths.win32` to the path of `nvim.exe`.
- **Installed:** Neovim 0.12.6 and both extensions are present (2026-10-30).
  Restart the terminal and VS Code to refresh the PATH and extension environment.
- **Repo settings:** `.vscode/settings.json` turns AI autocomplete off.

### [x] Claude Code (Windows)
- **Install (PowerShell):** `winget install --id Anthropic.ClaudeCode --exact`
- **Check:** open a new terminal → `claude --version`.
- **Use:** in the repo folder run `claude`. It reads `CLAUDE.md` automatically.
- **Installed:** 2.1.302 via the Anthropic-published winget package (2026-10-30).
  Restart the terminal to refresh the PATH.

### [x] Terminal: colors, icons, git info (Windows)
- **For:** a readable terminal: colored prompt with folder and git branch,
  colored `ls` with icons, colors while typing.
- **Pieces:**
  - PowerShell 7 (`winget install Microsoft.PowerShell`), the default shell in
    Windows Terminal and in the VS Code terminal.
  - Starship prompt (`winget install Starship.Starship`). Config:
    `~/.config/starship.toml`. Why Starship: the same config works in zsh/bash
    on the Mac, so both machines look the same.
  - JetBrainsMono Nerd Font (`winget install DEVCOM.JetBrainsMonoNerdFont`),
    set in Windows Terminal and VS Code. Without it, icons show as boxes.
  - Terminal-Icons and PSReadLine 2.4 (PowerShell Gallery), loaded in `$PROFILE`
    (`Documents\PowerShell\Microsoft.PowerShell_profile.ps1`).
  - Git Bash gets the same prompt from `~/.bashrc`.
- **VS Code terminal fix (2026-10-31):** PowerShell 7 here is the Microsoft
  Store version (in `WindowsApps`). VS Code didn't find it and opened the old
  Windows PowerShell 5.1, which has a different profile file, so there were no
  colors. Fix in VS Code user `settings.json`: a profile `"PowerShell 7"` with
  `"path": "C:\\Users\\orwaz\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe"`,
  set as `terminal.integrated.defaultProfile.windows`. Check: `$PSVersionTable.PSVersion` shows 7.x.
- **Not set up on purpose:** loading the compiler (`cl`) in every terminal.
  Casey writes `shell.bat` for that in Handmade Hero Day 1; the learner writes it then.
- **Installed:** 2026-10-30. Windows Terminal settings backup:
  `settings.json.bak-2026-10-30` next to the original.

### [ ] RAD Debugger (later)
- **For:** a faster debugger, once stepping through code feels routine.
- **Get:** releases at https://github.com/EpicGamesExt/raddebugger (free, open source).

### [x] DebugView, Coreinfo (Sysinternals, small helpers used in Day 1 experiments)
- https://learn.microsoft.com/en-us/sysinternals/downloads/debugview
- https://learn.microsoft.com/en-us/sysinternals/downloads/coreinfo
- **Installed:** `%USERPROFILE%\Tools\Sysinternals` (2026-10-30).

## Mac M1 (study station; never compiles course code)

### [ ] The study helper (`./study`): needs only Claude Code + Python 3
- Python 3 comes with Apple's command line tools (`xcode-select --install` if `python3` is missing).
- Put the episode videos in `~/learning-videos/` with the names in
  `handmade-mastery/courses/playlist.json` (e.g. `Intro_to_C_on_Windows_-_Day_1.mp4`).
- Start a session: `cd ~/learning && ./study`. The page opens by itself. Leave the
  Terminal window open while you study.
- Git must be able to push from the Mac (it asks for your GitHub login the first time).

### [ ] Claude Code (Mac)
- **Install:** `curl -fsSL https://claude.ai/install.sh | bash`
  (or `brew install --cask claude-code`).
- **Log in:** run `claude` and follow the browser prompt. Requires a Pro, Max,
  Team, Enterprise or Console account. To switch Claude accounts, run `/logout`
  then `/login`.
- **Style:** this repo's `.claude/settings.json` sets the **Learning** output
  style: Claude explains and leaves `TODO(human)` gaps for you.

### [ ] VS Code + Neovim extension (Mac)
- Neovim: `brew install neovim`. Same extensions as on Windows.

### [ ] Anki (FSRS)
- **Install:** https://apps.ankiweb.net (desktop; AnkiDroid is free on Android,
  AnkiMobile is paid on iOS).
- **Turn on FSRS:** deck options → FSRS (built in since Anki 23.10).
- **Import a day's cards:** File → Import → `courses/<course>/dayNN/cards.tsv`.
  The file's header sets tab separator and tags.

### [ ] LearnHarness: concept teaching, practice, knowledge graph
- **Get:** https://learnharness.ai (signed macOS Apple Silicon DMG).
  Source: https://github.com/amosblomqvist/learnharness (your fork: Zain-Orwa/learnharness).
- **Models:** add a provider key in Settings. For Claude, it needs
  `ANTHROPIC_API_KEY` (pay per use from https://console.anthropic.com).
  A Claude Pro/Max subscription doesn't work here.
  **Decision still open**, see `journey/STATE.md`.
- **Claude Code skill (optional):** copy `skills/learnharness/` from the
  LearnHarness repo into `~/.claude/skills/`. Claude Code can then read your
  LearnHarness learning history (read-only).

### [ ] Manim: animated explanations
- **One-time setup (Mac), from the repo root:** `./tools/animate/setup-mac.sh`
  It installs uv (if missing), cairo + pkg-config (Homebrew) and Manim 0.22 into
  `tools/animate/.venv`, then renders a short test video (`tools/animate/example.mp4`).
  Tick this box when the test video plays.
- **Making one:** the repo skill `/animate` (`.claude/skills/animate/SKILL.md`) writes the
  scene, renders it with `tools/animate/render.sh`, and adds it to the study page's Explain
  step. It replaces the third-party Manim skill planned before, so every Claude account
  gets it from the repo.
- **Where it renders:** only on the Mac. Cloud sessions can't install Manim (PyPI is blocked
  there); they write the scene and the Mac renders it. Still pictures are drawn in the chat.
- LaTeX (MacTeX) is optional; only needed for math formulas.
- **Rule:** only for hard ideas (memory, the stack, pixels, vectors, collisions), not every episode.

### [ ] Optional: speedtyper.dev
- Type-racing with real code, as a 5-minute warm-up: https://speedtyper.dev

## Both machines

- **This repo**, cloned on both. The Mac is for study files; the Windows PC
  for code in `code/`. Commit and push from whichever machine you used.
- **Episode guide:** https://guide.handmadehero.org (timestamps for every episode).
