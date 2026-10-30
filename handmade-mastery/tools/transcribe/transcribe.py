import sys
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[1],device="cpu",compute_type="int8",cpu_threads=2)
import wave,numpy as np
w=wave.open(sys.argv[2]);a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
segs,_=m.transcribe(a,language="en",beam_size=1,vad_filter=True,condition_on_previous_text=False,
  initial_prompt="Casey Muratori, Handmade Hero, Visual Studio, C programming, debugger, OutputDebugStringA, WinMain, CPU, memory, bytes, hexadecimal.")
with open(sys.argv[3],"w") as f:
  for s in segs:
    t=int(s.start); f.write(f"[{t//3600}:{t%3600//60:02d}:{t%60:02d}] {s.text.strip()}\n"); f.flush()
