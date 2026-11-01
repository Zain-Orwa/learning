"""Build a study kit page: engine.html + a day's data.js -> study-kit.html.

Usage:
  python3 build.py <day_folder>              # writes <day_folder>/study-kit.html (full page, open in a browser)
  python3 build.py <day_folder> --fragment   # prints the page without <!doctype>/<html> (for publishing as a claude.ai artifact)
"""
import json, pathlib, re, sys

here = pathlib.Path(__file__).parent
day = pathlib.Path(sys.argv[1])
engine = (here / "engine.html").read_text(encoding="utf-8")
data = (day / "data.js").read_text(encoding="utf-8")
if "</script" in data.lower():
    sys.exit("data.js must not contain </script>")
audio = day / "audio" / "index.json"  # written by tools/voice/make_audio.py
if audio.is_file():
    idx = json.loads(audio.read_text(encoding="utf-8"))
    amap = {b: {k: {s["key"]: "audio/" + s["file"] for s in segs} for k, segs in steps.items()}
            for b, steps in idx["segments"].items()}
    data += "\nwindow.STUDY.audio = " + json.dumps(amap).replace("</", "<\\/") + ";\n"
m = re.search(r'window\.STUDY\.title\s*=\s*"([^"]+)"', data)
title = (m.group(1) + " Study Kit") if m else "Study Kit"
page = engine.replace("__TITLE__", title).replace("/*DATA*/", data)
if "--fragment" in sys.argv:
    sys.stdout.write(page)
else:
    head = ('<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n')
    (day / "study-kit.html").write_text(head + page + "\n</body></html>\n", encoding="utf-8")
    print("wrote", day / "study-kit.html")
