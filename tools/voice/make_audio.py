"""Make the natural-voice audio for one study-kit day (the Listen button in Explain and Read code).

Usage (from the repo root):
  uv run --project tools/voice python tools/voice/make_audio.py handmade-mastery/courses/<course>/dayNN [--only b08] [--dry-run]

For each part and each step (explain, code) it builds the same reading order as the page (headings,
paragraphs, list items, callouts, and the "In words" pseudocode in place of every code block, diagram
and table), renders each piece with Kokoro and saves <day>/audio/<part>-<step>-<n>.mp3. It writes
<day>/audio/index.json (which text goes with which file) and rebuilds study-kit.html, so the page finds
the files. Only pieces whose text changed are rendered again. Needs node (to read data.js).
"""
import hashlib, html, json, pathlib, re, subprocess, sys
from html.parser import HTMLParser

from speak import spoken

VOICE, SPEED = "am_michael", 1.0
ROOT = pathlib.Path(__file__).resolve().parents[2]
BUILD = ROOT / "handmade-mastery" / "tools" / "study-kit" / "build.py"

# ---- the page's HTML for a step: keep in step with renderStepRaw / withWords / inWords in engine.html ----
esc = lambda s: html.escape(str(s), quote=True).replace("&#x27;", "&#39;")
md = lambda s: re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", re.sub(r"`([^`]+)`", r"<code>\1</code>", esc(s)))


def in_words(s):
    if isinstance(s, (list, str)):
        lines = s if isinstance(s, list) else str(s).split("\n")
        return '<div class="inwords"><div class="k">In words</div><ol>' + "".join(f'<li class="ln">{md(l)}</li>' for l in lines) + "</ol></div>"
    out = '<div class="inwords"><div class="k">In words</div>'
    if s.get("goal"): out += f'<p class="ln iw"><b>Goal:</b> {md(s["goal"])}</p>'
    out += "<ol>" + "".join(f'<li class="ln"><span class="vh">Step {i + 1}. </span>{md(l)}</li>' for i, l in enumerate(s.get("steps", []))) + "</ol>"
    if s.get("pattern"): out += f'<p class="ln iw"><b>Pattern:</b> {md(s["pattern"])}</p>'
    if s.get("tryit"): out += f'<p class="ln iw try"><b>Try it in your head:</b> {md(s["tryit"])}</p>'
    return out + "</div>"


def step_html(b, k):
    if k == "explain":
        h = (f'<div class="callout"><b>The idea in one sentence:</b> {md(b["oneLiner"])}</div>' if b.get("oneLiner") else "")
        h += (f'<p><b>Real-life picture:</b> {md(b["analogy"])}</p>' if b.get("analogy") else "")
        h += b.get("explain", "")
        h += (f'<div class="callout"><b>Prerequisite, explained now:</b> {b["prereq"]}</div>' if b.get("prereq") else "")
        h += (f'<div class="callout later"><b>Common beginner mistake:</b> {md(b["mistake"])}</div>' if b.get("mistake") else "")
    else:
        h = b.get("code", "")
    say = (b.get("say") or {}).get(k) or []
    n = iter(range(10**6))
    def add(m):
        i = next(n)
        return m.group(0) + in_words(say[i]) if i < len(say) and say[i] else m.group(0)
    return re.sub(r"</pre>|</table>", add, h) if say else h


# ---- the page's reading order: keep in step with ttsSegments in engine.html ----
VOID = {"br", "img", "input", "hr", "meta", "source", "wbr", "link", "col"}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.parent, self.kids = tag, parent, []
        self.cls = set((dict(attrs).get("class") or "").split())

    def text(self):
        return "".join(k if isinstance(k, str) else k.text() for k in self.kids)

    def up(self):  # self and ancestors
        n = self
        while n: yield n; n = n.parent


class Tree(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=True)
        self.root = self.cur = Node("root", [], None); self.all = []
        self.feed(src); self.close()

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur); self.cur.kids.append(n); self.all.append(n)
        if tag not in VOID: self.cur = n

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag: n = n.parent
        if n is not self.root: self.cur = n.parent

    def handle_data(self, d):
        self.cur.kids.append(d)


def segments(src):
    t = Tree(src)
    def wanted(n):
        return n.tag in ("h3", "p", "li") or "callout" in n.cls or ("ln" in n.cls and any("inwords" in a.cls for a in n.up()))
    def blocked(n):
        return any(a.tag in ("pre", "table", "details") or "listen" in a.cls for a in n.up())
    els = [n for n in t.all if wanted(n) and not blocked(n)]
    chosen = set(map(id, els))
    out = []
    for n in els:
        if any(id(a) in chosen for a in list(n.up())[1:]): continue
        key = re.sub(r"\s+", " ", n.text()).strip()
        if spoken(key): out.append(key)
    return out


def load_blocks(day):
    js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.STUDY.blocks))"
    return json.loads(subprocess.run(["node", "-e", js, str((day / "data.js").resolve())], check=True, capture_output=True, text=True).stdout)


def main():
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    day = pathlib.Path(args[0])
    if not (day / "data.js").is_file():
        days = sorted(p.parent.as_posix() for p in pathlib.Path("handmade-mastery/courses").glob("*/day*/data.js"))
        sys.exit(f"No data.js in {day}. Give a real day folder" + (": " + ", ".join(days) if days else "."))
    only = args[args.index("--only") + 1] if "--only" in args else None
    dry = "--dry-run" in args
    adir = day / "audio"; idx_path = adir / "index.json"
    old = json.loads(idx_path.read_text(encoding="utf-8")) if idx_path.is_file() else {"segments": {}}
    old_by_hash = {s["hash"]: adir / s["file"] for steps in old["segments"].values() for segs in steps.values() for s in segs}

    plan, words = {}, 0
    for b in load_blocks(day):
        if only and b["id"] != only:
            if b["id"] in old["segments"]: plan[b["id"]] = old["segments"][b["id"]]  # keep other parts as they are
            continue
        for k in ("explain", "code"):
            for n, key in enumerate(segments(step_html(b, k)), 1):
                say = spoken(key); words += len(say.split())
                h = hashlib.sha1(f"{VOICE}|{SPEED}|{say}".encode()).hexdigest()[:16]
                plan.setdefault(b["id"], {}).setdefault(k, []).append({"file": f'{b["id"]}-{k}-{n}.mp3', "key": key, "spoken": say, "hash": h})

    todo = [s for steps in plan.values() for segs in steps.values() for s in segs
            if not ((adir / s["file"]).is_file() and old_by_hash.get(s["hash"]) == adir / s["file"])]
    print(f"{sum(len(g) for st in plan.values() for g in st.values())} pieces, about {words} words "
          f"(about {words / 150:.0f} min of speech), {len(todo)} to render")
    if dry:
        for s in todo: print(" ", s["file"], "|", s["spoken"][:90])
        return

    adir.mkdir(exist_ok=True)
    reuse = {s["hash"]: old_by_hash[s["hash"]].read_bytes() for s in todo if s["hash"] in old_by_hash and old_by_hash[s["hash"]].is_file()}
    pending = {s["file"] for s in todo}

    def save():  # index only the pieces that are ready, then rebuild: finished parts play right away
        ready = {b: {k: [s for s in segs if s["file"] not in pending] for k, segs in st.items()} for b, st in plan.items()}
        idx_path.write_text(json.dumps({"voice": VOICE, "speed": SPEED, "segments": ready}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        subprocess.run([sys.executable, str(BUILD), str(day)], check=True, stdout=subprocess.DEVNULL)

    voice = None
    for i, s in enumerate(todo, 1):
        out = adir / s["file"]
        if s["hash"] in reuse:  # same text, it only moved: copy instead of rendering
            out.write_bytes(reuse[s["hash"]])
        else:
            if voice is None:
                from speak import Voice
                voice = Voice(VOICE, SPEED)
            voice.save_mp3(s["spoken"], out)
        pending.discard(s["file"])
        print(f"  [{i}/{len(todo)}] {s['file']}")
        if i == len(todo) or todo[i]["file"].split("-")[0] != s["file"].split("-")[0]:
            save()  # a part is finished

    keep = {s["file"] for steps in plan.values() for segs in steps.values() for s in segs}
    for f in adir.glob("*.mp3"):
        if f.name not in keep: f.unlink()  # pieces that no longer exist
    save()
    size = sum(f.stat().st_size for f in adir.glob("*.mp3"))
    print(f"audio: {len(keep)} files, {size / 1e6:.1f} MB in {adir}")
    print("rebuilt", day / "study-kit.html", "(reload the page to hear the new audio)")


if __name__ == "__main__":
    main()
