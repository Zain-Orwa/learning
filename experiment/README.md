# Experiment: simpler study flow

An independent application copy for comparing changes before adopting them.
The main page continues to run with `./study` on port 8765.

Start this version from the repository root:

```sh
./experiment/study
```

It opens at http://localhost:8876. Use `./experiment/study --no-browser`
to start the helper without opening a browser.

What changed here:

- Three main steps: Watch → Check → Practice.
- Check contains the question, your answer and feedback together.
- Prediction is optional within Practice.
- Explanation and listening share one supporting panel.
- Code/pseudocode and flashcards remain optional tools.
- No repeated takeaway or separate required ticks for supporting notes.
- **Code Lab** (`/code`, linked from Watch and Practice): write, build and run
  course C/C++ on the Mac with clang. A small `windows.h` stand-in
  (`tools/study-kit/winshim/`) runs `WinMain` and shows `OutputDebugStringA` in
  an Output panel; Disassembly shows Windows x64 assembly. Files save to
  `handmade-mastery/code/<course>/dayNN/`.

All lesson content, winter assets, existing audio, helper sources and a
snapshot of progress are copied here. Answers and review changes made here
stay in this directory. Browser storage uses an experiment key and separate
port. Stop saves this copy only; it never commits, pushes or promotes changes.

The downloaded videos and installed speech environment are reused from their
existing locations. Python environments, caches and model downloads are not
duplicated. `source-snapshot.json` records the main app source at creation.

This experiment is **pending Zain's review**. Nothing is promoted automatically.
For later experiments, work here or create a sibling snapshot rather than
editing the main application. Keep user decisions and next actions here.

Verified on 2026-11-16: three-step engine checks, disposable HTTP/review tests,
Stop-without-Git isolation, and browser navigation/media/support-panel checks.
The main app's source and built page still match the creation snapshot.

Palette refinement, 2026-11-16: game-theme.css uses the supplied
channels4_banner.jpg (copied as assets/game-banner.jpg) as its color reference.
Flashcards has one title and a shorter popup. These changes remain experimental.

Video, sidebar and support refinement, 2026-11-16 (colors unchanged):
- Click the middle of the video to pause or continue; the gear is a clear
  filled icon; the speed menu shows 0.75×–2× as readable buttons, with the
  chosen speed in gold and a small badge on the gear when it is not 1×.
- The parts list is narrower: one line per part (tick, number or gold
  current marker). Click a row to open the part; no expandable panels.
- Study support adds Analogy and Graphics. Graphics shows the part's drawing
  or an `/animate` video when one exists, and says so when there is none yet.
- Layout-only styles live in `experiment.css`; the palette stays in
  `game-theme.css`.

Ask Claude, My notes and scrolling, 2026-11-16:
- Study support has Ask Claude and My notes. Explanation, Analogy, Graphics
  and Code popups each end with an "Ask Claude about this" box (quick
  questions, typing or the mic). Answers stay with the part (S.notes, the
  same thread as the Check step's chat) and can be saved to notes.
- My notes: per-part notes, a Claude summary and a Kokoro voice summary,
  plus a notes path over all parts and a whole-episode summary. Saved in
  progress.json and, with the helper running, in `<day>/notes.md`; voice
  files go to `<day>/audio/notes/`.
- The support rail and the popups scroll by themselves; the page behind a
  popup stays still.
- Helper: new `/api/speak` (speak_note.py) and `/api/notes`; all POSTs now
  refuse requests from other websites.

Review first and full screen, 2026-11-16:
- On arrival, due part reviews open in a popup that can't be skipped
  (Escape and the page behind are blocked). Answer from memory, Claude grades
  with the usual checklist (one retry), the first score is saved, then
  "Continue to Part N". It keeps the five-minute budget: when time is up the
  rest stays due. Interview/debug rows are not forced. Once finished it does
  not return that day. It needs the helper and Claude; otherwise nothing is forced.
- Full-screen video now shows the whole picture with the controls at the
  bottom (the inline player's 50vh cap and cropping no longer apply).

Adopted into the main app, 2026-11-16: Zain approved this version. Its
study-kit files were copied to `handmade-mastery/tools/study-kit/` (main keeps
port 8765, its own records and Stop → commit + push). This folder stays as the
workbench: try the next idea here, then copy the study-kit files across.
