"""Build a study kit page: engine.html + a day's data.js -> study-kit.html.

Usage:
  python3 build.py <day_folder>              # writes <day_folder>/study-kit.html (full page, open in a browser)
  python3 build.py <day_folder> --fragment   # prints the page without <!doctype>/<html> (for publishing as a claude.ai artifact)
"""
import json, pathlib, re, sys

here = pathlib.Path(__file__).parent
day = pathlib.Path(sys.argv[1])
engine = (here / "engine.html").read_text(encoding="utf-8")
engine = engine.replace("/*WINTER_STYLE*/", (here / "winter.css").read_text(encoding="utf-8"))
engine = engine.replace("/*WINTER_APP*/", (here / "winter.js").read_text(encoding="utf-8"))
engine = engine.replace("/*EXPLAIN_STYLE*/", (here / "explanation.css").read_text(encoding="utf-8"))
engine = engine.replace("/*EXPLAIN_APP*/", (here / "explanation.js").read_text(encoding="utf-8"))
engine = engine.replace("/*EXPERIMENT_APP*/", (here / "experiment.js").read_text(encoding="utf-8"))
engine = engine.replace("/*GAME_THEME*/", (here / "game-theme.css").read_text(encoding="utf-8"))
engine = engine.replace("/*EXPERIMENT_STYLE*/", (here / "experiment.css").read_text(encoding="utf-8"))
data = (day / "data.js").read_text(encoding="utf-8")
if "</script" in data.lower():
    sys.exit("data.js must not contain </script>")
audio = day / "audio" / "index.json"  # written by tools/voice/make_audio.py
if audio.is_file():
    idx = json.loads(audio.read_text(encoding="utf-8"))
    amap = {b: {k: {s["key"]: "audio/" + s["file"] for s in segs} for k, segs in steps.items()}
            for b, steps in idx["segments"].items()}
    data += "\nwindow.STUDY.audio = " + json.dumps(amap).replace("</", "<\\/") + ";\n"
summaries = {p.stem: "audio/summaries/" + p.name for p in sorted((day / "audio" / "summaries").glob("*.mp3"))}
data += "\nwindow.STUDY.summaryAudio = " + json.dumps(summaries) + ";\n"
transcript = day / "transcript.txt"
captions = ""
if transcript.is_file():
    entries = []
    for stamp, text in re.findall(r"^\[(\d+:\d+:\d+)\]\s*(.+)$", transcript.read_text(encoding="utf-8"), re.M):
        h, m, s = map(int, stamp.split(":"))
        entries.append((h * 3600 + m * 60 + s, text))
    def vtt_time(seconds):
        return f"{seconds // 3600:02d}:{seconds // 60 % 60:02d}:{seconds % 60:02d}.000"
    cues = []
    for i, (start, text) in enumerate(entries):
        end = max(start + 1, entries[i + 1][0]) if i + 1 < len(entries) else start + 5
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        cues.append(f"{vtt_time(start)} --> {vtt_time(end)}\n{text}")
    if cues:
        captions = "WEBVTT\n\n" + "\n\n".join(cues) + "\n"
        data += '\nwindow.STUDY.captions = "captions.vtt";\n'
m = re.search(r'window\.STUDY\.title\s*=\s*"([^"]+)"', data)
title = (m.group(1) + " Study Kit") if m else "Study Kit"
page = engine.replace("__TITLE__", title).replace("/*DATA*/", data)
if "--fragment" in sys.argv:
    sys.stdout.write(page)
else:
    if captions:
        (day / "captions.vtt").write_text(captions, encoding="utf-8")
    head = ('<!doctype html>\n<html lang="en" data-theme="light"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n')
    (day / "study-kit.html").write_text(head + page + "\n</body></html>\n", encoding="utf-8")
    print("wrote", day / "study-kit.html")
