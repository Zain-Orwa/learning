#!/bin/sh
# Render one Manim scene to an mp4 saved next to its .py file.
# Usage: tools/animate/render.sh path/to/name.py SceneName [l|m|h]
#   quality: l = 480p (drafts), m = 720p (default), h = 1080p
set -e
[ $# -ge 2 ] || { echo "usage: $0 path/to/name.py SceneName [l|m|h]"; exit 1; }
here="$(cd "$(dirname "$0")" && pwd)"
src="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
scene="$2"; q="${3:-m}"
name="$(basename "$src" .py)"
uv run --project "$here" manim "-q$q" --disable_caching --media_dir "$here/media" -o "$name.mp4" "$src" "$scene"
found="$(find "$here/media/videos/$name" -name "$name.mp4" | head -1)"
[ -n "$found" ] || { echo "Render finished but the video was not found under $here/media"; exit 1; }
cp "$found" "$(dirname "$src")/$name.mp4"
echo "Saved: $(dirname "$src")/$name.mp4"
