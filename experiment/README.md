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
