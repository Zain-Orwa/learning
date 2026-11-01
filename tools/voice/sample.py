"""Render one sentence with each candidate voice, to pick the voice for the study kits.

Usage (from the repo root):
  uv run --project tools/voice python tools/voice/sample.py [voice ...]
Writes tools/voice/samples/<voice>.mp3. Default voices: af_heart am_michael.
"""
import pathlib, sys

from speak import Voice

TEXT = ("WinMain calls foo. The CPU jumps into foo's body, and WinMain waits at that spot. "
        "Inside foo, call OutputDebugStringA. The text appears in the debugger's Output window.")

out = pathlib.Path(__file__).parent / "samples"
out.mkdir(exist_ok=True)
for name in sys.argv[1:] or ["af_heart", "am_michael"]:
    path = out / f"{name}.mp3"
    Voice(name).save_mp3(TEXT, path)
    print("wrote", path)
