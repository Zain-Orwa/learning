#!/bin/sh
# One-time setup for natural voice audio (Kokoro) on the Mac. Run it once from the repo root:
#   ./tools/voice/setup-mac.sh
# It installs uv (if missing) and ffmpeg (Homebrew), then Kokoro into tools/voice/.venv
# (Python 3.12, about 1 GB), downloads the voice model (about 330 MB, once) and renders
# two short samples to tools/voice/samples/.
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
uv sync
uv run python sample.py
echo
echo "Kokoro is ready. Samples: tools/voice/samples/"
echo "Make a day's audio: uv run --project tools/voice python tools/voice/make_audio.py handmade-mastery/courses/<course>/dayNN"
