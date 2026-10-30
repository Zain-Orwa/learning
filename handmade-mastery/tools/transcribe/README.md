# Transcribing an episode

Each episode's `transcript.txt` has one line per spoken segment:
`[h:mm:ss] text`. Study kits use it for exact timestamps.

## How Day 1 was made
- Engine: **faster-whisper** with the Whisper **small** model (int8), on CPU.
- `transcribe.py` reads a 16 kHz mono WAV and writes the timestamped lines.
- A 72-minute episode took about 30 minutes on 2 CPU cores.

## Run it on the Mac
```sh
pip install faster-whisper numpy
ffmpeg -i episode.mp4 -ac 1 -ar 16000 audio.wav
python3 transcribe.py small.en audio.wav transcript.txt
```
The first argument is a model name (downloaded automatically) or a local model folder.

## Run it in a Claude cloud session (where Hugging Face is blocked)
The Whisper small model is mirrored on npm in four parts:
```sh
for i in 0 1 2 3; do npm pack @skillninja/shortmovie-telop-model-p$i; done
# extract each .tgz, copy the *.json files from part 0,
# concatenate model.bin.part0..3 into model.bin, and check it against model.sha256
python3 transcribe.py ./model audio.wav transcript.txt
```

## Cross-check the topics
Compare the transcript with the episode's topic list on
https://guide.handmadehero.org. Block boundaries in each study kit follow those timestamps.
