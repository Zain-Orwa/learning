#!/bin/sh
# One-time setup for animations (Manim) on the Mac. Run it once from the repo root:
#   ./tools/animate/setup-mac.sh
# It installs uv (if missing) and cairo + pkg-config (Homebrew), then Manim into
# tools/animate/.venv, and renders a short test video.
set -e
here="$(cd "$(dirname "$0")" && pwd)"
if ! command -v uv >/dev/null 2>&1; then
  echo "Installing uv (Python package manager)..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  PATH="$HOME/.local/bin:$PATH"; export PATH
fi
if command -v brew >/dev/null 2>&1; then
  brew install cairo pkg-config
else
  echo "Homebrew was not found. Install it from https://brew.sh, open a new terminal, and run this again."
  exit 1
fi
cd "$here"
uv sync
"$here/render.sh" "$here/example.py" Pipeline l
echo
echo "Manim is ready. Test video: tools/animate/example.mp4"
echo "Ask Claude Code (in this repo) to /animate an idea, and it renders it here."
