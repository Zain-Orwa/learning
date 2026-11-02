"""Speech to text worker for the study helper's mic buttons (serve.py starts it once and keeps it running).

It loads Whisper small.en (int8, CPU) once, then answers one JSON line per request on stdin:
  {"wav": "/path/to/16k-mono.wav", "prompt": "key terms of the current part"}
with one JSON line on stdout: {"text": "..."} or {"error": "..."}.
The model lives in tools/transcribe/models/small.en (setup-mac.sh downloads it).
"""
import json, pathlib, sys, wave

import numpy as np
from faster_whisper import WhisperModel

HERE = pathlib.Path(__file__).resolve().parent
local = HERE / "models" / "small.en"
model = WhisperModel(str(local) if (local / "model.bin").is_file() else "small.en", device="cpu",
                     compute_type="int8", download_root=str(HERE / "models"))


def reply(obj):
    sys.stdout.write(json.dumps(obj) + "\n"); sys.stdout.flush()


reply({"ready": True})
for line in sys.stdin:
    try:
        req = json.loads(line)
        w = wave.open(req["wav"])
        audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        segs, _ = model.transcribe(audio, language="en", beam_size=5, vad_filter=True,
                                   condition_on_previous_text=False, initial_prompt=req.get("prompt") or None)
        reply({"text": " ".join(s.text.strip() for s in segs).strip()})
    except Exception as e:
        reply({"error": str(e)[:300]})
