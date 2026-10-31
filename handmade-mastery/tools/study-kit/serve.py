#!/usr/bin/env python3
"""Study helper: runs on the Mac while you study. Start it with ./study from the repo root.

It serves the study pages at http://localhost:8765, plays videos straight from your
videos folder (default ~/learning-videos), saves your progress into the repo, adds
finished parts to the review log, grades your answers with Claude Code (`claude -p`,
your normal Claude login), and commits + pushes when you press "Stop for today".

Only Python's standard library is used. Nothing is reachable from other computers
(it listens on 127.0.0.1 only).
"""
import datetime as dt
import http.server
import json
import mimetypes
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import urllib.parse
import webbrowser

HERE = pathlib.Path(__file__).resolve().parent          # handmade-mastery/tools/study-kit
SUBJECT = HERE.parent.parent                             # handmade-mastery
REPO = SUBJECT.parent                                    # learning
SUBJECT_NAME = SUBJECT.name
VIDEOS = pathlib.Path(os.environ.get("LEARNING_VIDEOS", "~/learning-videos")).expanduser()
PORT = int(os.environ.get("STUDY_PORT", "8765"))
CLAUDE = os.environ.get("STUDY_CLAUDE", "claude")
MODEL = os.environ.get("STUDY_MODEL", "")               # empty = your account's default model
PLAYLIST = SUBJECT / "courses" / "playlist.json"
LOCK = threading.Lock()

TUTOR = ("You are a strict but kind programming tutor for Zain, whose English is not his first "
         "language. Use plain, simple English. Follow the instructions in the message exactly. "
         "Do not use any tools. Reply with text only.")


def playlist():
    try:
        return json.loads(PLAYLIST.read_text(encoding="utf-8"))
    except Exception:
        return []


def kit_dir(kit):
    p = (SUBJECT / "courses" / kit).resolve()
    if not str(p).startswith(str((SUBJECT / "courses").resolve())):
        raise ValueError("bad kit path")
    return p


def progress_done(kit):
    try:
        st = json.loads((kit_dir(kit) / "progress.json").read_text(encoding="utf-8"))
        return bool(st.get("finished"))
    except Exception:
        return False


def current_kit():
    for item in playlist():
        if item.get("built") and not progress_done(item["kit"]):
            return item
    built = [i for i in playlist() if i.get("built")]
    return built[-1] if built else None


def next_item(kit):
    items = playlist()
    for i, item in enumerate(items):
        if item["kit"] == kit:
            return items[i + 1] if i + 1 < len(items) else None
    return None


def run(cmd, cwd=REPO, timeout=120):
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    return p.returncode, (p.stdout + p.stderr).strip()


def ask_claude(prompt, want_json):
    if not shutil.which(CLAUDE):
        return {"error": "Claude Code isn't installed on this computer (the `claude` command was not found)."}
    cmd = [CLAUDE, "-p", "--output-format", "json", "--permission-mode", "dontAsk", "--system-prompt", TUTOR]
    if MODEL:
        cmd += ["--model", MODEL]
    with tempfile.TemporaryDirectory() as tmp:     # neutral folder: don't load the repo's hooks or CLAUDE.md
        try:
            p = subprocess.run(cmd, input=prompt, capture_output=True, text=True, cwd=tmp, timeout=300)
        except subprocess.TimeoutExpired:
            return {"error": "Claude took too long. Try again."}
    try:
        out = json.loads(p.stdout)
        text = out.get("result", "") if isinstance(out, dict) else str(out)
        if isinstance(out, dict) and out.get("is_error"):
            return {"error": text or "Claude Code returned an error."}
    except Exception:
        text = p.stdout.strip()
        if p.returncode != 0:
            return {"error": (p.stderr or text or "Claude Code failed.").strip()[:400]}
    if not want_json:
        return {"text": text}
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.S)
    raw = m.group(1) if m else text[text.find("{"): text.rfind("}") + 1]
    try:
        return {"data": json.loads(raw)}
    except Exception:
        return {"error": "Claude's answer wasn't in the expected format. Try again.", "text": text}


def update_state_position(block):
    """Replace the '## Study position' section of journey/STATE.md with the page's block."""
    p = SUBJECT / "journey" / "STATE.md"
    s = p.read_text(encoding="utf-8")
    block = block.strip() + "\n"
    if "## Study position" in s:
        s = re.sub(r"## Study position\n.*?(?=\n## |\Z)", block, s, count=1, flags=re.S)
    else:
        s = s.rstrip() + "\n\n" + block
    p.write_text(s, encoding="utf-8")


def add_reviews(meta):
    """Add finished parts, their interview questions and debug challenges to journey/REVIEWS.md (skips ones already there)."""
    added = []
    tool = REPO / "tools" / "reviews.py"
    for part in meta.get("completedParts", []):
        unit = f"{meta['unitPrefix']}-p{part['n']:02d}"
        title = f"{meta['unitLabel']} · {part['title']}"
        src = f"courses/{meta['kit']}#{part['id']}"
        code, out = run([sys.executable, str(tool), "add", SUBJECT_NAME, unit, title, src, "--date", part["date"]])
        if "Added" in out:
            added.append(unit)
        for i, iv in enumerate(part.get("interview", [])):
            unit = f"iv-{meta['unitPrefix']}-{part['id']}-{i}"
            code, out = run([sys.executable, str(tool), "add", SUBJECT_NAME, unit,
                             f"[{iv['area']}] {iv['q']}", f"{src}/iv{i}", "--date", part["date"]])
            if "Added" in out:
                added.append(unit)
        for i, dbg in enumerate(part.get("debug", [])):
            unit = f"dbg-{meta['unitPrefix']}-{part['id']}-{i}"
            code, out = run([sys.executable, str(tool), "add", SUBJECT_NAME, unit,
                             f"[debugging] L{dbg.get('level', 1)} {dbg['title']}", f"{src}/dbg{i}", "--date", part["date"]])
            if "Added" in out:
                added.append(unit)
    return added


def git_sync(message):
    steps = []
    for cmd in (["git", "add", "-A"], ["git", "commit", "-m", message],
                ["git", "pull", "--rebase"], ["git", "push"]):
        code, out = run(cmd, timeout=180)
        steps.append((cmd[1], code, out))
        if code != 0 and not (cmd[1] == "commit" and "nothing to commit" in out):
            return False, f"git {cmd[1]} failed: {out[-300:]}"
    return True, "Saved and pushed to GitHub."


class Handler(http.server.BaseHTTPRequestHandler):
    server_version = "StudyHelper/1"

    def log_message(self, fmt, *args):
        if "/api/" in (args[0] if args else ""):
            sys.stderr.write("  " + (fmt % args) + "\n")

    # ---------- helpers ----------
    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self):
        n = int(self.headers.get("Content-Length", "0"))
        return json.loads(self.rfile.read(n) or b"{}")

    def send_file(self, path, ranged=False):
        size = path.stat().st_size
        ctype = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        start, end = 0, size - 1
        rng = self.headers.get("Range") if ranged else None
        m = re.match(r"bytes=(\d*)-(\d*)$", rng or "")
        if m and (m.group(1) or m.group(2)):
            if m.group(1):
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else size - 1
            else:
                start = max(0, size - int(m.group(2)))
            end = min(end, size - 1)
            if start > end:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        else:
            self.send_response(200)
        length = end - start + 1
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(length))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        try:
            with open(path, "rb") as f:
                f.seek(start)
                left = length
                while left > 0:
                    chunk = f.read(min(256 * 1024, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass

    # ---------- routes ----------
    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        q = urllib.parse.parse_qs(url.query)
        path = urllib.parse.unquote(url.path)
        if path == "/":
            item = current_kit()
            if not item:
                return self.send_json({"error": "No study kit found in courses/playlist.json"}, 404)
            self.send_response(302)
            self.send_header("Location", f"/courses/{item['kit']}/study-kit.html")
            self.end_headers()
            return
        if path == "/api/ping":
            return self.send_json({"ok": True, "claude": bool(shutil.which(CLAUDE)), "videos": str(VIDEOS)})
        if path == "/api/progress":
            f = kit_dir(q["kit"][0]) / "progress.json"
            return self.send_json(json.loads(f.read_text(encoding="utf-8")) if f.exists() else {})
        if path == "/api/video":
            name = os.path.basename(q.get("file", [""])[0])
            return self.send_json({"exists": bool(name) and (VIDEOS / name).is_file(), "folder": str(VIDEOS)})
        if path == "/api/next":
            return self.send_json({"next": next_item(q["kit"][0])})
        if path.startswith("/video/"):
            f = VIDEOS / os.path.basename(path[len("/video/"):])
            return self.send_file(f, ranged=True) if f.is_file() else self.send_error(404)
        f = (SUBJECT / path.lstrip("/")).resolve()
        if str(f).startswith(str(SUBJECT.resolve())) and f.is_file() and "/.git/" not in str(f):
            return self.send_file(f)
        self.send_error(404)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        try:
            body = self.read_json()
        except Exception:
            return self.send_json({"error": "bad request"}, 400)
        if path == "/api/claude":
            return self.send_json(ask_claude(str(body.get("prompt", "")), bool(body.get("json"))))
        if path in ("/api/progress", "/api/finish"):
            meta, state = body.get("meta", {}), body.get("state", {})
            with LOCK:
                d = kit_dir(meta["kit"])
                (d / "progress.json").write_text(json.dumps(state, indent=1, ensure_ascii=False), encoding="utf-8")
                added = add_reviews(meta)
                if body.get("position"):
                    update_state_position(body["position"])
                result = {"ok": True, "addedReviews": added}
                if path == "/api/finish":
                    ok, msg = git_sync(body.get("message") or f"Study session {dt.date.today().isoformat()}")
                    result.update(ok=ok, message=msg)
            return self.send_json(result)
        self.send_error(404)


def main():
    url = f"http://localhost:{PORT}/"
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except OSError:
        print(f"The study helper is already running. Opening {url}")
        webbrowser.open(url)
        return
    VIDEOS.mkdir(parents=True, exist_ok=True)
    print(f"Study helper running at {url}")
    print(f"Videos folder: {VIDEOS}")
    print("Claude Code:", "found" if shutil.which(CLAUDE) else "NOT found (grading in the page won't work)")
    print("Leave this window open while you study. Press Ctrl+C to stop.")
    if "--no-browser" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
