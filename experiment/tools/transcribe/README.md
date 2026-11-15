# Speech to text (faster-whisper)

Shared by every subject. Two jobs:

1. **Mic buttons** on the study pages: speak instead of typing. The study helper
   (`handmade-mastery/tools/study-kit/serve.py`) starts `worker.py` once; it keeps
   Whisper `small.en` (int8, CPU) in memory and answers each recording in about 1 second.
   Route: `POST /api/transcribe?prompt=<key terms>` with the raw recording as the body.
   serve.py converts it with ffmpeg to 16 kHz mono WAV first.
2. **Episode transcripts**: `handmade-mastery/tools/transcribe/transcribe.py` can run in
   this environment too: `tools/transcribe/.venv/bin/python handmade-mastery/tools/transcribe/transcribe.py tools/transcribe/models/small.en audio.wav transcript.txt`.

## Set up a Mac (once)
```sh
./tools/transcribe/setup-mac.sh
```
It installs uv and ffmpeg if missing, faster-whisper into `tools/transcribe/.venv`
(Python 3.12, about 190 MB) and the model into `tools/transcribe/models/small.en`
(about 480 MB). Both stay out of git. Then start `./study`: the helper says
"Speech to text: on" and every text box has a mic button.

## No setup, no mics
If `tools/transcribe/.venv` or ffmpeg is missing, or the page runs without the helper
(opened as a file, or as a claude.ai artifact), the page hides all mic buttons and
typing works as before.
