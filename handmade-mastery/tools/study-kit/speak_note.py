"""Render one notes summary to mp3 with Kokoro. serve.py runs this with tools/voice's Python.

Usage: <tools/voice/.venv/bin/python> speak_note.py <out.mp3> <tools/voice folder>  < summary text
Uses the same voice as the study kit's Listen audio (tools/voice/make_audio.py).
"""
import sys

out, voice_dir = sys.argv[1], sys.argv[2]
sys.path.insert(0, voice_dir)
from speak import Voice  # noqa: E402  (needs the voice folder on the path first)

text = sys.stdin.read().strip()
if not text:
    sys.exit("no text")
Voice("am_michael").save_mp3(text, out)
