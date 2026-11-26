# Decision log

Newest at the bottom. Each entry: date, decision, why.

## 2026-10-30: Working agreement
- Work one step at a time. Never present the next step before the current one is done.
- Research online before recommending tools or methods.
- Stay inside what Casey covers at each timestamp. Park his "later" topics.
- The learner writes all practice code himself.

## 2026-10-30: Machines
- **Windows PC** for everything that compiles and runs. Why: Handmade Hero's
  platform layer is Win32, and Intro to C Day 2 reads x64 assembly. The M1 is ARM.
- **Mac M1** for study: watching, notes, Anki, Claude Code, Manim, LearnHarness.

## 2026-10-30: Editor
- Keep **VS Code + Neovim extension** on both machines. Why: he already uses it,
  and Vim motions are the keyboard-speed skill he wants. Casey uses Emacs, but
  switching would add a second learning curve with no payoff.
- **AI autocomplete off** in this repo, so every line comes from his own head.

## 2026-10-30: Build and debug
- Build like Casey: `build.bat` calling `cl` from a terminal (from Handmade Hero Day 1).
  Intro to C days use the Visual Studio project as Casey does.
- Debug in the Visual Studio debugger. Move to **RAD Debugger** (free, open source)
  once stepping through code is routine. RemedyBG was skipped (closed source, paid).

## 2026-10-30: Learning tools
- **Claude Code in Learning output style** is the code tutor (`TODO(human)` gaps).
- **Manim** via a Claude Code skill makes animations for hard ideas only.
- **Anki with FSRS** for memory. Cards are stored in the repo per day.
- **Blank-file rebuild drill** for speed. speedtyper.dev is an optional warm-up.
- **One HTML study kit per episode** (format set by Intro to C Day 1).
- Not chosen: codebase-to-course (made for people who don't write the code
  themselves; maybe for big review checkpoints later), LEAP and OpenMAIC (they
  need separate servers and other AI models, and duplicate Claude Code + Manim).

## 2026-10-30: LearnHarness added
- It's the "learn harness" tool the learner had in mind (he forked it:
  github.com/Zain-Orwa/learnharness). It's an open-source desktop app (macOS,
  Windows, Linux) that measures understanding, plans a path, teaches step by
  step, runs practice sessions and keeps a knowledge graph.
- Role: deep concept teaching and practice on the Mac, alongside the episode study kits.
- **Open question:** it uses Claude only through an `ANTHROPIC_API_KEY` (pay per
  use). Its only subscription login is for ChatGPT. Decide whether to buy API
  credit, use another provider, or skip it for now.

## 2026-10-30: One repo for all learning
- The GitHub repo is `learning`, meant to hold every subject Zain studies.
  This course lives in `handmade-mastery/`. General rules sit in the root
  `CLAUDE.md`; each subject folder has its own `CLAUDE.md`, `journey/STATE.md`
  and `journey/DECISIONS.md`.

## 2026-10-30: No Linux machine
- Only two machines: Windows PC (code) and Mac M1 (study). Linux isn't needed:
  Handmade Hero is Windows-only, and the Mac already covers all study tools.
  Fewer machines means less setup and less to keep in sync.

## 2026-10-30: Editor for now, review later
- Use **VS Code + Neovim extension** for *Intro to C on Windows*.
- Look at the editor again when Handmade Hero starts: watch what Casey uses
  there and decide then. Why: decide with real experience, not in advance.

## 2026-10-30: Guided study sessions (`/study`)
- Problem: while watching, he gets distracted, searches something, and loses his place.
- Fix: the `/study` command (`.claude/skills/study/SKILL.md`). Claude splits each
  episode into timed sections (Q&A included), gives one task at a time (watch,
  answer, explain gaps, do, cards), and saves the exact position in `STATE.md`
  after every step. "Where was I?" gives a 2-line recap and the timestamp.
- Builds on the study kit: its blocks are the sections. Claude works from the
  transcript and the guide's timestamps, because it can't watch video.

## 2026-10-30: The study page guides everything
- The study page is the main guide: it plays the video **inside the page**, one part
  at a time, and **stops by itself** at the end of each part. Future parts stay locked.
- Parking lot while watching (no leaving to search), Recall from memory after each part,
  breaks between parts (5 min; 15 after every 3 parts), "Welcome back" + card warm-up
  when he returns, and "Copy position" so `/study` can save the place in `STATE.md`.
- `/study` stays as the Claude side (position, grading, parked questions, building kits)
  and as a chat-only fallback.
- Why: he gets distracted and loses his place. Short parts with questions after
  each one reduce mind wandering (Szpunar, Khan & Schacter, PNAS 2013).
- One shared engine (`tools/study-kit/engine.html`) + one `data.js` per episode,
  built with `tools/study-kit/build.py`.

## 2026-10-31: Learning method from the "learning machine" video
- Zain shared a video (Sintech channel, built on YouMind) on learning with AI.
  We adopted its method, adapted to our tools (written up in `docs/learning-method.md`):
  - **Five principles** (Dunlosky et al. 2013): guess before you know, test yourself,
    spaced repetition, apply immediately, explain in your own words.
  - **Strict grading in percent**: score, what's right, what's missing for 100% with %
    per piece, one guiding question instead of the answer.
  - **Mentor behavior**: review before new material, Socratic hints, a summary and review dates at the end.
  - **Lesson template** per part: guess first, one-sentence idea, real-life analogy,
    common beginner mistake, questions, apply, explain. Kits end with a self-check of
    what couldn't be verified.
  - **Scheduled review task** so he never forgets that a review is due.
- Not adopted: the YouMind platform itself. Claude Code + this repo + scheduled
  tasks already do the same, and keep everything in his own GitHub.

## 2026-10-31: Review schedule
- 1 day → 3 days → 1 week → 2 weeks → 1 month → 3 months → 6 months → every 6 months.
  (He asked for 1d, 1w, 1m, 3m, 6m; we added 3d and 2w as the video and memory research do.)
- Pass = 80%+. Below 80%: short re-teach, back to 1 day.
- Log: `journey/REVIEWS.md`, only edited with `tools/reviews.py` (dates computed, not guessed).
- Daily review task at ~13:00 Europe/Berlin (Zain's choice: midday, Central Europe).

## 2026-10-31: Flexible schedule
- **Study days: Saturday and Sunday.** No fixed hours. Zain says "start" plus how much time
  he has; Claude and the study page plan what fits (reviews first, about 15% of the time;
  a part ≈ 1.3 × video minutes + 30 min), with a countdown and a 10-minute warning.
- **Monday to Friday: review days.** The daily task asks due reviews + 2 interview questions.

## 2026-10-31: Interview preparation
- Goal: be ready for real game/systems interviews when the course ends.
- Researched what game and systems interviews actually ask (build pipeline, memory,
  CPU/caches, data structures, vector math, debugging); sources in `docs/interview-prep.md`.
- Questions come only from studied material: an `interview` list per part in `data.js`
  (as asked, follow-ups, strong-answer checklist with %, red flags, source).
- They become spaced-review units (`iv-…`) and feed weekday drills, mini mocks (area has 8+),
  area mocks (15+ and 60%+ average), and full interview days at course milestones.
- `/interview` runs them as a real interviewer (no hints, follow-ups) with a strict debrief and
  a hiring-style verdict; history in `journey/INTERVIEWS.md`; readiness via `tools/reviews.py areas`.

## 2026-10-31: Automated study sessions (`./study`)
- Zain doesn't want to copy and paste. `./study` starts a local helper (`serve.py`,
  Python standard library only, listens on 127.0.0.1) that serves the page, plays the
  video from `~/learning-videos`, grades with Claude Code headless (`claude -p`, his
  subscription login), writes progress/STATE/REVIEWS into the repo, and pushes on Stop.
- Why a browser: the page is a local file; the browser is only the window and video player.
- `courses/playlist.json` orders the videos; the page points to the next one when a video is done.

## 2026-10-31: Debugging mastery track
- Goal: master debugger, interview-ready. Method: David Agans' 9 rules; interview style:
  Stripe-like bug squash, Amazon-like planted bugs (sources in `docs/debugging-track.md`).
- Rubric: reproduce 15, evidence 20, hypothesis 20, narrowing 15, root cause 15, fix+verify 15; speed tracked.
- Levels unlock with the course (Day 1 = build errors). Only studied material.
- Challenges: a `debug` list per part in `data.js` (Day 1 has 8), shown in the Experiment step with
  a start-to-solve clock; finished parts add `dbg-` review units. `/debug` any time.
- Phone: "Debug challenge" scheduled task Mon/Wed/Fri/Sun 18:45 Berlin.
- Multi-account: tasks belong to one account; definitions + prompts are stored in the repo
  (`docs/scheduled-tasks.md`, `.claude/skills/reminders/`); `/reminders` recreates them on another account.

## 2026-10-31: Guess step before every part
- Zain's request: guessing comes first, as its own step, with more than one question, and a
  short look back at the previous part before starting a new one.
- Step order: Guess → Watch → Recall → Answer → Explain → Experiment → Read code → Flashcards →
  Why it matters.
- Guess = look back at the previous part (1–2 sentences, then compare with its one-sentence idea)
  + the main guess + 1–2 key questions (`pre` in `data.js`). The video stays covered until the
  guesses are locked in; after that they can't change. Answer shows each guess next to its question.
- Why: prequestions improve learning from video, also on questions not asked (Carpenter & Toftness,
  2017); recalling earlier material improves learning of new material (Pastötter & Bäuml, 2014).
- Fixed the same day: the end-of-part screen covered the video, because its CSS `display:flex` beat
  the `hidden` attribute. The engine now has `[hidden]{display:none!important}`.

## 2026-10-31: Animations ready to use (Manim, `/animate`)
- Zain wants animations available whenever he asks, without setting anything up at that moment.
- The setup lives in the repo: `tools/animate/` (Manim 0.22 via uv; `setup-mac.sh` once;
  `render.sh`) and the `/animate` skill. A repo skill instead of the third-party one: it travels
  with the repo to every Claude account and follows our style and rules.
- Renders on the Mac only: cloud sessions can't reach PyPI. Still pictures are drawn in the chat.
- Lesson animations live in `courses/<course>/dayNN/anim/` and are committed (small mp4s);
  the Explain step shows a part's `anim`.

## 2026-11-01: Listen button and "In words" pseudocode
- Zain wants to listen to the explanations as well as read them, including code and diagrams.
- Explain and Read code have a Listen button (browser speech: no setup, offline, works in the
  pinned claude.ai page): play/pause, stop, speed 0.75–1.5×, and it highlights what it's reading.
  It picks the best English voice on the machine (a downloaded Premium voice wins).
- Code isn't read symbol by symbol. Every code block, diagram and table has an "In words" version
  (`say` in `data.js`): specific pseudocode in plain English, shown under it and read aloud instead.
- Fixed in Day 1, part 9: the tokenized line has five tokens, not six.

## 2026-11-01: Natural voice (Kokoro) and teaching pseudocode
- The browser voice sounded robotic. Listen now plays audio made offline on the Mac with
  Kokoro-82M (open source, runs on the M1, no API key). Zain picked the voice `am_michael` over
  `af_heart` from two samples. Setup: `tools/voice/` (uv, Python 3.12); audio per day in
  `courses/<course>/dayNN/audio/` (mp3 + `index.json`), committed while a day stays under ~30 MB
  (Day 1: about 20 MB). Pieces without an mp3 fall back to the browser voice, one piece at a time.
- Code is never read as code. The "In words" pseudocode now teaches the logic: goal, numbered steps
  in execution order (what, inputs and outputs, why), the pattern (declare before use, call and
  return, define once and use many times), and a "Try it in your head" question. Symbols in the
  normal text are said as words ("double slash", "backslash n", "C plus plus", video times as minutes).

## 2026-11-01: Grading checks meaning, not wording
- 2026-11-01: Grading checks meaning, not wording (synonyms, own words and simple English count fully when the idea is right).

## 2026-11-01: Kokoro is the only voice; ./study clears a stuck helper
- Zain wants only the Kokoro voice. The browser/Mac voice (speechSynthesis) was removed from the page:
  Listen plays only the mp3s, a piece without one is skipped, and a step with no audio shows no Listen
  button. So make_audio.py must run after every text change.
- The page didn't open twice because a helper paused with Ctrl+Z kept port 8765. serve.py now checks
  that the running helper answers; if it doesn't, it stops the stuck study helper and starts fresh.

## 2026-11-02: Voice everywhere: speak in every text box, the interviewer speaks
- Zain wants to speak instead of type. Every text box on the study page now has a mic button
  (added automatically to every textarea and text input, so new boxes need no code). The page records
  with MediaRecorder; the helper converts with ffmpeg and transcribes with faster-whisper `small.en`
  (int8, CPU, offline) in `tools/transcribe/`, loaded once and kept in memory (about 1 s per short
  answer). The Whisper prompt holds the part's key terms, so names like WinMain come out right.
  The text lands at the cursor and can be edited; nothing is graded or sent by itself.
  Why faster-whisper: it already made the Day 1 transcript on this Mac, runs offline, and small.en is
  fast enough on the M1 CPU. No helper (claude.ai page) = no mic buttons, typing only.
- The Interview corner's interviewer speaks with Kokoro (same voice as Listen): make_audio.py renders
  every question, follow-up and a short intro. "Ask me", a play button per follow-up, and Auto-ask
  (off by default).
- Graders ignore filler words and small transcription mistakes; they still judge only the ideas.
- Rule for the whole repo (root CLAUDE.md): every place Zain can type also gets a mic button.

## 2026-11-08: Shorter study sessions
- Zain requested fewer repetitions, fewer editor details and shorter sessions.
- Required flow: Watch → Check → Practice. One core question and one task.
  Notes, code references and interview/debug drills remain optional.
- Fixed grading checklist; only requested ideas count. 80% is a practical
  pass, with a short correction instead of repeatedly chasing 100%.
- Planner: video length plus roughly 3–8 minutes, two minutes to save.
- One shared review schedule in REVIEWS.md for page and chat. No automatic
  duplicate flashcard/interview/debug queues. Preserve existing progress and
  review history. Cloud reminders still need their local prompts applied.


## 2026-11-15: Coding-led routine for a long course
- Zain clarified that he must write the code Casey teaches, with understanding.
  Pause after a meaningful change, predict, implement on Windows, build/run
  and compare. That is the practice; no duplicate implementation afterward.
- Keep Watch → Check → Practice, brief reviews and fair grading. Use actual
  coding time in estimates. At a feature boundary, use one normal practice
  slot for a small independent change or diagnostic task; avoid another queue.
- System understanding is checked through behavior, data flow and observed
  values. Use small diagrams first and existing Manim for useful motion.
  Keep dictation and Kokoro. Park LearnHarness and Anki unless a specific gap
  warrants them; no model key or extra app is required to resume.
- Root and subject AGENTS.md are canonical. CLAUDE.md and .claude skills
  point to shared rules/skills in .agents, reducing drift across accounts.
- Page checks now persist attempts: one retry, then direct correction;
  passing ends regrading. Reviews retain the first score across reloads.
  Failed/invalid/stale requests do not consume learner attempts. Deferred
  practice is visible and saved, without assigning old completed parts again.
- Added optional small visuals to Day 1 Parts 3, 5 and 8. Preserved old spoken
  notes/audio, answers, completion dates and review history. Built only the
  existing kit; future kits use the same routine when needed.
- Local reminder prompts now use one canonical copy and make debugging an
  invitation. Existing Claude tasks were not accessible through this session's
  tools; no live update or migration is claimed. Owner-account handoff is in
  docs/scheduled-tasks.md. Live verification remains the only external follow-up.
- Learning-research sources and limits are in docs/learning-method.md. The
  exact workflow is a practical starting point, not a proven optimum. Adapt
  from independent coding, debugging and later recall, not video count.
- Verification: JavaScript regression checks and disposable-file HTTP tests
  pass. An isolated Chrome preview exercised review retries and saving,
  the optional visual, and returning to pending practice with fake responses.
  No real learner results were generated. Also corrected a missing-asset
  logging error found in that preview. Windows compilation was not needed
  for this study-tool change; learner code was not edited.

## 2026-11-15: Explanation panel as a visual learning card
- The Explain view's Explanation panel is now a reusable, data-driven card
  (`tools/study-kit/explanation.js` + `explanation.css`), built to Zain's
  reference image: wooden title plate, amber "idea in one sentence", signpost
  "Real-life picture", short concept rows with yellow key-term pills, a
  parchment clarification, and "Read the full explanation" opening the full
  notes (with Listen and "In words") in the dialog.
- Content per part lives in `data.js` as `explainCard` (concept rows +
  clarification), drawn only from each part's existing explain notes and
  reviewed for accuracy. Parts without a card fall back to the first paragraph.
- The separate "Key Takeaway" box is hidden when the card already shows the
  same one-sentence idea, so it is not read twice.
- The component loads through its own build slots (`/*EXPLAIN_STYLE*/`,
  `/*EXPLAIN_APP*/`) and is committed separately from the unfinished winter
  lesson layout. That layout (`winter.js`) is what places the card on the
  Explain view and opens the full-explanation dialog; the Takeaway rule and
  dialog wiring live there and ship with it.


## 2026-11-15: Match the final winter lesson reference
- Use the final Part 3 reference: dark teal lesson surface, warm headings,
  video/takeaway/audio in the left stack, tall Explanation beside it, and
  the code/pseudocode panel underneath. Keep the three learning-tools cards.
- Explanation remains reusable and structured: wooden title, amber summary,
  blue analogy, highlighted technical rows, parchment clarification and full
  explanation dialog. Compact typography and icy borders match the reference.
- Retain real course content and saved progress. Extra reference tabs remain
  supporting views; they do not add required study work.
- Regression tests passed. A disposable browser preview verified Part 3,
  four explanation rows, the left media stack and no horizontal overflow at
  1440 pixels. The cabin poster appears until a local video is selected.


## 2026-11-15: Use the sidebar height for course sections
- Course navigation uses all available sidebar height before its outer
  scrollbar appears. Decorative scenery sits behind the list and no longer
  reserves empty space below it. Expanded lesson lists keep their own scroll.
- Rebuilt the page and passed the engine regression checks. Learning position
  and answers were not changed by this layout adjustment.


## 2026-11-15: Show all real lesson parts in the sidebar
- Removed seven illustrative chapter placeholders. The sidebar now lists all
  12 actual Day 1 parts from the lesson data, matching the progress counter.
- Parts expand to show their video range and lesson action. Navigation uses
  the available height and scrolls when needed; longer expanded content may
  also scroll. Future parts retain their existing learning prerequisites.


## 2026-11-15: Consistent lesson navigation
- Every horizontal item now selects one inline content view and highlights
  exactly that tab. Flashcards in the bar no longer open an unrelated popup.
  Right-hand tool buttons can still open explicit dialogs.
- Browsing a view never changes the saved learning step or completion history.
  Core progress advances only through the view's explicit action when its
  prerequisites are satisfied. All supporting views remain available.
- Added keyboard arrow/Home/End navigation and matching tab/panel labels.
  Regression checks cover every tab, one selected state and preserved progress.


## 2026-11-15: Clear sidebar interaction and completion states
- Hover and keyboard focus highlight each part heading. Finished parts use
  a muted pine-green tint across the whole card, a checkmark and their
  existing Finished/Checked label. The current part uses an amber border
  and heading tint. No completion state is inferred from merely opening it.


## 2026-11-15: Persist completed and selected study tabs
- Completed tabs show a tick and muted green treatment; the selected tab
  stays amber. Required steps save and advance through the existing flow.
- Supporting views have an explicit Mark finished action, recorded separately
  from required progress. Merely browsing never counts as completion.
- Selected views are saved per part and restored when reloading the helper.


## 2026-11-16: Tidy technical concept rows
- Separate icons, amber concept labels and reading text into aligned columns.
  Put each concept in a lightly separated row; keep selective keyword marks.
  Narrow cards stack the label above its text without shrinking readability.
- Part 3 configuration is now a named row alongside PARSE, UNDERSTAND and
  EMIT. Existing full explanations and narration remain unchanged.


## 2026-11-16: Review changes in a separate experiment first
- Zain requested a full application copy to compare the proposed reductions
  before confirming them. Created `experiment/` with lesson materials,
  artwork/audio, tools, and copied study records, excluding installed virtual
  environments and model caches. Existing downloaded videos are reused.
- Changes only in the experiment: three main steps; combined Check and
  feedback; prediction inside Practice; one Explanation/Listen panel; code
  and flashcards remain optional. The winter design and lesson content remain.
- Separate port 8876 and browser storage key. Saves/reviews target copied files.
  Experimental Stop never commits, pushes or promotes anything. Main app source
  hashes are recorded in `experiment/source-snapshot.json`.
- Use the experiment space for future proposed changes. Await explicit
  confirmation before adopting changes in the main application.

## 2026-11-16: Adopt the experiment's study page as the main page
- **Decision:** Zain approved the experiment, so its study-kit files now run the
  main page (`./study`). The experiment folder stays as the workbench for later ideas.
- **What came over:** three-step tabs, narrow parts list, video controls, Study
  support with Ask Claude and My notes (notes.md + Kokoro voice summary), support
  rail and popups that scroll by themselves, the "Review first" popup, full-screen fix.
- **What stayed main-only:** port 8765, the main review log and progress, and
  "Stop for today" commit + push. The experiment keeps its own storage key, port,
  records and no-git Stop. `experiment.js` reads the storage key to pick the
  start command it shows, so the same file works in both copies.
- **Records:** main progress and reviews were kept. The experiment's test progress
  was not copied.

## 2026-11-23: Code Lab experiment (Intro to C on the Mac)
- **Why:** Zain wants to practise the first playlist inside the study app,
  without switching to the Windows PC.
- **What:** experiment-only page `/code` with an editor (no autocomplete),
  Build / Run / Disassembly. clang compiles on the Mac; `winshim/windows.h` and
  `winmain_shim.c` supply `WinMain` startup and `OutputDebugStringA`.
  Disassembly targets `x86_64-pc-windows-msvc` (falls back to Mac x64 when C
  library headers are included).
- **Limits:** no step-through debugger, watch or memory window yet; real Win32
  windows (Handmade Hero) still need Windows. Run stops after 5 seconds.
- **VS Code debugger (same day):** `.vscode/launch.json` + `tasks.json` build the
  open file with `winshim/build.sh` (-g -O0) and debug it with LLDB DAP. The
  default is an x86-64 build run through Rosetta, so registers and disassembly
  show x64 (rax, rip, Intel syntax) like Casey's screen; an ARM option exists.
  Checked: breakpoint, step over, call stack, locals, registers, memory,
  disassembly, debug output.
- **Status:** waiting for Zain's confirmation before adopting it in the main app.

## 2026-11-23: Code Lab inside Practice; Continue goes to the next part; support dots
- **Why:** Zain asked to bring the Code Lab experiment into the main page, inside
  the Practice step, and for Continue at the end of Practice to open the next part.
- **What:** Practice embeds the Code Lab (editor, Build/Run/Disassembly, Visual
  Studio-style Output, a black console window); `/code` opens the same editor full
  window and Watch links to it. Shared files: `tools/study-kit/codelab.{js,css,html}`
  and `winshim/`. Files save to `code/<course>/dayNN/` (Mac-typed, by hand, no
  autocomplete). The helper compiles the startup shim once, saves atomically and
  stops a timed-out program with its child processes.
- **Continue:** the Practice button says "Finish part · Continue to Part N →".
  Finishing a part you had already completed now goes straight into the next part;
  before, it could show the break screen. New parts still offer a break after every
  three in a row.
- **Study support:** a gold dot marks each support item not opened yet; the heading
  and the course list count unopened items in the parts reached so far.
- **Still pending:** writing on Windows is still the real check; a Mac run is
  recorded in the practice note like any other result.

## 2026-11-23: Try again below 50% (optional practice after the answer)
- **Why:** Zain wants to fix a weak answer straight away: see the answer, hear it,
  say it again and check it until it reaches 50%.
- **What:** below 50% the Check step, Review tab, review popup, Interview and Debug
  offer "Try again with the answer": the full answer (checklist ideas), Listen
  (Kokoro, cached per answer in `<day>/audio/answers/`; the browser voice if Kokoro
  is unavailable), mic or typing, and "Check again" as often as wanted.
- **Rules kept:** the official check still has one retry, and the first score still
  sets the review date. Practice tries are stored separately (`again` in
  progress.json) and never change official scores. Check and Review offer it only
  after the official retry is used, so the retry stays unaided.

## 2026-11-24: Practice shows the tool the part uses
- **Why:** the CPU part asked Zain to read Task Manager, but Practice showed the
  code editor. The tool beside a task should match the task.
- **What:** each block names `lab` in data.js: `"code"` (Code Lab), `"cpu"` (Task
  Manager's Performance → CPU page) or `"none"`. The CPU lab shows this Mac's real
  sockets, cores, logical processors and live per-processor load (helper route
  `/api/cpu`, standard library only), plus a simulated Windows PC with
  Hyper-Threading for comparison, the "Logical processors" graph view, a numbers
  check (logical ÷ cores) and "Put it in my note". Both labs can be resized by
  dragging their bottom-right corner. Kits without `lab` show Code Lab only when the
  task builds code.
