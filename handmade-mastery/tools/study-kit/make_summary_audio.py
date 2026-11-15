"""Join the first three existing Kokoro explanation clips into a short summary.

Usage: python3 handmade-mastery/tools/study-kit/make_summary_audio.py <day>
Requires ffmpeg. No model calls or new narration; original clips stay intact.
"""
import json
import pathlib
import subprocess
import sys
import tempfile

day = pathlib.Path(sys.argv[1]).resolve()
audio = day / "audio"
index = json.loads((audio / "index.json").read_text(encoding="utf-8"))
destination = audio / "summaries"
destination.mkdir(exist_ok=True)
for block, steps in index["segments"].items():
    clips = steps.get("explain", [])[:3]
    if not clips:
        continue
    with tempfile.TemporaryDirectory() as temp:
        playlist = pathlib.Path(temp) / "clips.txt"
        playlist.write_text("".join("file '" + str(audio / clip["file"]).replace("'", "'\\''") + "'\n" for clip in clips))
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(playlist), "-af", "asetpts=N/SR/TB", "-c:a", "libmp3lame", "-q:a", "4", str(destination / f"{block}.mp3")], check=True)
print(f"Wrote summaries to {destination}")
