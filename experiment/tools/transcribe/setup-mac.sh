#!/bin/sh
# One-time setup for speech to text (the study pages' mic buttons) on a Mac. Run it once from the repo root:
#   ./tools/transcribe/setup-mac.sh
# It installs uv (if missing) and ffmpeg (Homebrew), then faster-whisper into tools/transcribe/.venv
# (Python 3.12, about 190 MB) and the Whisper small.en model into tools/transcribe/models/ (about 480 MB, once).
set -e
here="$(cd "$(dirname "$0")" && pwd)"
if ! command -v uv >/dev/null 2>&1; then
  echo "Installing uv (Python package manager)..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  PATH="$HOME/.local/bin:$PATH"; export PATH
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install ffmpeg
  else
    echo "Homebrew was not found. Install it from https://brew.sh, open a new terminal, and run this again."
    exit 1
  fi
fi
cd "$here"
uv sync --python 3.12
mkdir -p models/small.en
for f in config.json tokenizer.json vocabulary.txt model.bin; do
  [ -s "models/small.en/$f" ] || curl -fL --progress-bar -o "models/small.en/$f" \
    "https://huggingface.co/Systran/faster-whisper-small.en/resolve/main/$f"
done
.venv/bin/python -c "from faster_whisper import WhisperModel; WhisperModel('models/small.en', device='cpu', compute_type='int8')"
echo
echo "Speech to text is ready. Start ./study: every text box on the study page now has a mic button."
