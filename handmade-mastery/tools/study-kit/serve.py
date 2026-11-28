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
import hashlib
import http.server
import json
import mimetypes
import os
import pathlib
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
import urllib.parse
import urllib.request
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
TRANSCRIBE = REPO / "tools" / "transcribe"                # faster-whisper env (setup: tools/transcribe/setup-mac.sh)
MAX_AUDIO = 30 * 1024 * 1024
VOICE_DIR = REPO / "tools" / "voice"                            # Kokoro env (setup: tools/voice/setup-mac.sh)
VOICE_PY = VOICE_DIR / ".venv" / "bin" / "python"
VOICE_LOCK = threading.Lock()                                    # one Kokoro render at a time
NOTE_ID = re.compile(r"^(?:b\d{2}|episode)$")
MAX_NOTES_MD = 300_000
sys.path.insert(0, str(REPO / "tools"))
import reviews as review_log
sys.path.insert(0, str(HERE))
import cpuinfo

TUTOR = ("You are a concise, helpful programming tutor for Zain, whose English is not his first "
         "language. Use plain, simple English. Follow the instructions in the message exactly. "
         "Do not use any tools. Reply with text only.")


def playlist():
    try:
        return json.loads(PLAYLIST.read_text(encoding="utf-8"))
    except Exception:
        return []


def kit_dir(kit):
    p = (SUBJECT / "courses" / kit).resolve()
    if not p.is_relative_to((SUBJECT / "courses").resolve()):
        raise ValueError("bad kit path")
    return p


def progress_done(kit):
    try:
        st = json.loads((kit_dir(kit) / "progress.json").read_text(encoding="utf-8"))
        return bool(st.get("finished"))
    except Exception:
        return False


def current_kit():
    """The course video to study now. Side trips ("sideTrip": true) never take over ./study."""
    course = [i for i in playlist() if not i.get("sideTrip")]
    for item in course:
        if item.get("built") and not progress_done(item["kit"]):
            return item
    built = [i for i in course if i.get("built")]
    return built[-1] if built else None


def next_item(kit):
    items = playlist()
    for i, item in enumerate(items):
        if item["kit"] == kit:
            if item.get("sideTrip"):               # a side trip ends where it started: back on the course
                home = next((x for x in items if x["kit"] == item.get("returnTo")), None) or current_kit()
                return dict(home, back=True) if home else None
            rest = [x for x in items[i + 1:] if not x.get("sideTrip")]
            return rest[0] if rest else None
    return None


def find_kit(words):
    """./study cpu → the first built kit whose path or title contains the words (used for side trips)."""
    want = " ".join(words).strip().lower()
    if not want:
        return None
    for item in playlist():
        if item.get("built") and want in (item["kit"] + " " + item.get("title", "")).lower():
            return item
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


def kit_page_dir(kit):
    """A built study kit's folder, or ValueError: notes and voice files are only written next to a real kit."""
    if not isinstance(kit, str):
        raise ValueError("bad kit path")
    d = kit_dir(kit)
    if not (d / "study-kit.html").is_file():
        raise ValueError("unknown kit")
    return d


def voice_available():
    return VOICE_PY.is_file() and shutil.which("ffmpeg") is not None


def speak_note(kit, note_id, text):
    """Render a notes summary with Kokoro to <kit>/audio/notes/<id>.mp3 and return its page-relative URL."""
    if not voice_available():
        return {"error": "Voice (Kokoro) isn't set up on this computer."}
    if not isinstance(note_id, str) or not NOTE_ID.fullmatch(note_id):
        return {"error": "Unknown note."}
    text = text.strip() if isinstance(text, str) else ""
    if not text or len(text) > 6000:
        return {"error": "The summary is empty or too long."}
    try:
        out_dir = kit_page_dir(kit) / "audio" / "notes"
    except ValueError:
        return {"error": "Unknown study kit."}
    error = _kokoro_mp3(out_dir, note_id, text)
    if error:
        return {"error": error}
    return {"file": f"audio/notes/{note_id}.mp3?v={int(time.time())}"}


def speak_answer(kit, text):
    """A model answer read aloud with Kokoro. Cached by its text: the same answer is made only once."""
    if not voice_available():
        return {"error": "Voice (Kokoro) isn't set up on this computer."}
    text = text.strip() if isinstance(text, str) else ""
    if not text or len(text) > 3000:
        return {"error": "The answer is empty or too long."}
    try:
        out_dir = kit_page_dir(kit) / "audio" / "answers"
    except ValueError:
        return {"error": "Unknown study kit."}
    name = hashlib.sha1(text.encode("utf-8")).hexdigest()[:16]
    if not (out_dir / f"{name}.mp3").is_file():
        error = _kokoro_mp3(out_dir, name, text)
        if error:
            return {"error": error}
    return {"file": f"audio/answers/{name}.mp3"}


def _kokoro_mp3(out_dir, name, text):
    """Render text to <out_dir>/<name>.mp3 with the study voice. Returns an error message, or None."""
    out, tmp = out_dir / f"{name}.mp3", out_dir / f".{name}.tmp.mp3"
    if not VOICE_LOCK.acquire(blocking=False):
        return "Another voice is being made. Try again in a minute."
    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        p = subprocess.run([str(VOICE_PY), str(HERE / "speak_note.py"), str(tmp), str(VOICE_DIR)],
                           input=text, capture_output=True, text=True, cwd=VOICE_DIR, timeout=300)
        if p.returncode or not tmp.is_file():
            sys.stderr.write("  voice failed:\n" + (p.stderr or "")[-1200:] + "\n")
            return "Could not make the voice. The terminal running the helper shows why."
        tmp.replace(out)
    except subprocess.TimeoutExpired:
        return "Making the voice took too long. Try again."
    except (OSError, ValueError) as e:
        sys.stderr.write(f"  voice failed: {e}\n")
        return "Could not make the voice."
    finally:
        tmp.unlink(missing_ok=True)
        VOICE_LOCK.release()
    return None


def save_notes_file(kit, markdown):
    if not isinstance(markdown, str) or len(markdown) > MAX_NOTES_MD:
        return {"error": "Notes are missing or too long."}, 400
    try:
        d = kit_page_dir(kit)
    except ValueError:
        return {"error": "Unknown study kit."}, 404
    try:
        with LOCK:
            (d / "notes.md").write_text(markdown, encoding="utf-8")
    except (OSError, UnicodeError):
        return {"error": "Could not write notes.md."}, 500
    return {"ok": True}, 200


class Whisper:
    """The mic buttons' speech to text: tools/transcribe/worker.py, started once, keeps the model in memory."""

    def __init__(self):
        self.proc, self.lock = None, threading.Lock()

    def available(self):
        return (TRANSCRIBE / ".venv").is_dir() and bool(shutil.which("ffmpeg"))

    def _start(self):
        if self.proc and self.proc.poll() is None:
            return
        py = TRANSCRIBE / ".venv" / "bin" / "python"
        self.proc = subprocess.Popen([str(py), str(TRANSCRIBE / "worker.py")], stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, bufsize=1)
        if not json.loads(self.proc.stdout.readline() or "{}").get("ready"):
            self.proc = None
            raise RuntimeError("the speech model didn't load (run tools/transcribe/setup-mac.sh)")

    def preload(self):
        try:
            with self.lock:
                self._start()
        except Exception as e:
            print("Speech to text: not ready:", e)

    def transcribe(self, audio, prompt, beam=5):
        with tempfile.TemporaryDirectory() as tmp:
            src, wav = pathlib.Path(tmp) / "in", pathlib.Path(tmp) / "in.wav"
            src.write_bytes(audio)
            code, out = run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-ac", "1", "-ar", "16000", str(wav)], timeout=60)
            if code != 0:
                return {"error": "Couldn't read the recording."}
            with self.lock:                   # one request at a time; the worker answers in order
                try:
                    self._start()
                    self.proc.stdin.write(json.dumps({"wav": str(wav), "prompt": prompt, "beam": beam}) + "\n")
                    return json.loads(self.proc.stdout.readline() or '{"error": "The speech worker stopped."}')
                except Exception as e:
                    self.proc = None
                    return {"error": str(e)[:200]}


WHISPER = Whisper()


POSITION_HEADINGS = ("## Study position", "## Side trip position")


def update_state_position(block):
    """Replace the page's position section of journey/STATE.md with the page's block.

    The course writes '## Study position'. A side trip writes '## Side trip position',
    so leaving the course for a while never erases the place to come back to."""
    p = SUBJECT / "journey" / "STATE.md"
    s = p.read_text(encoding="utf-8")
    block = block.strip() + "\n"
    heading = block.split("\n", 1)[0].strip()
    if heading not in POSITION_HEADINGS:
        heading = POSITION_HEADINGS[0]
    section = lambda h: re.escape(h) + r"\n.*?(?=\n## |\Z)"
    if heading in s:
        s = re.sub(section(heading), lambda m: block, s, count=1, flags=re.S)
    elif POSITION_HEADINGS[0] in s:                 # a new side-trip section goes right after the course position
        s = re.sub(section(POSITION_HEADINGS[0]), lambda m: m.group(0).rstrip("\n") + "\n\n" + block, s, count=1, flags=re.S)
    else:
        s = s.rstrip() + "\n\n" + block
    p.write_text(s, encoding="utf-8")


def add_reviews(meta):
    """Add one core review per finished part; optional drills are scheduled separately."""
    added = []
    tool = REPO / "tools" / "reviews.py"
    for part in meta.get("completedParts", []):
        unit = f"{meta['unitPrefix']}-p{part['n']:02d}"
        title = f"{meta['unitLabel']} · {part['title']}"
        src = f"courses/{meta['kit']}#{part['id']}"
        code, out = run([sys.executable, str(tool), "add", SUBJECT_NAME, unit, title, src, "--date", part["date"]])
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


# ---------- Code Lab: write, build and run course code on the Mac ----------
CODE_ROOT = SUBJECT / "code"
WINSHIM = HERE / "winshim"
CODE_KIT = re.compile(r"^[a-z0-9-]+/(?:day\d{2}|[a-z0-9]+(?:-[a-z0-9]+)*)$")   # course/dayNN, or side-trips/<name>
CODE_FILE = re.compile(r"^[A-Za-z0-9_][A-Za-z0-9_-]{0,60}\.(?:c|cpp|h)$")
MAX_SOURCE = 200_000
RUN_SECONDS = 5
MAX_OUTPUT = 64_000
MAX_LOG = 20_000
CODE_LOCK = threading.Lock()                     # one save at a time: no half-written files
SHIM_LOCK = threading.Lock()
SHIM_CACHE = {}                                  # (with WinMain?, shim mtimes) -> compiled startup object
SIGNALS = {signal.SIGSEGV: "Access violation: the program read or wrote memory it does not own.",
           signal.SIGBUS: "Access violation: the program read or wrote memory it does not own.",
           signal.SIGTRAP: "Breakpoint hit (__debugbreak).",
           signal.SIGABRT: "The program aborted (abort or a failed assert).",
           signal.SIGFPE: "Arithmetic error (for example an integer divided by zero).",
           signal.SIGILL: "Illegal instruction."}


def build_flags():
    """Extra compiler flags for Build/Run, like Visual Studio's Debug build (/Od /Zi)."""
    return ["-O0", "-g"]


def code_dir(kit):
    if not isinstance(kit, str) or not CODE_KIT.match(kit):
        raise ValueError("bad kit")
    kit_dir(kit)                                   # must be a real course folder path
    return CODE_ROOT / kit


def code_files(kit):
    d = code_dir(kit)
    files = sorted(p for p in d.glob("*") if p.is_file() and CODE_FILE.match(p.name)) if d.is_dir() else []
    return [{"name": p.name, "source": p.read_text(encoding="utf-8", errors="replace").replace("\r\n", "\n")}
            for p in files]


def save_code(kit, name, source):
    if not isinstance(name, str) or not CODE_FILE.match(name):
        return {"error": "Use a simple file name ending in .c, .cpp or .h (for example main.cpp)."}, 400
    if not isinstance(source, str) or len(source) > MAX_SOURCE:
        return {"error": "The file is too large."}, 400
    d = code_dir(kit)
    target = d / name
    text = source.replace("\r\n", "\n").replace("\n", "\r\n")   # CRLF, like .gitattributes gives these files
    with CODE_LOCK:
        d.mkdir(parents=True, exist_ok=True)
        try:
            same = target.read_bytes() == text.encode("utf-8")
        except OSError:
            same = False
        if not same:                               # write a temporary file, then swap it in (never half a file)
            tmp = d / f".{name}.saving"
            tmp.write_bytes(text.encode("utf-8"))
            os.replace(tmp, target)
    return {"ok": True, "path": os.path.relpath(target, REPO)}, 200


def _shim_object(with_winmain):
    """The windows.h stand-in's startup code, compiled once and reused while the helper runs."""
    with SHIM_LOCK:
        return _shim_object_locked(with_winmain)


def _shim_object_locked(with_winmain):
    sources = [WINSHIM / "winmain_shim.c", WINSHIM / "windows.h"]
    key = (with_winmain, tuple(p.stat().st_mtime_ns for p in sources))
    obj = SHIM_CACHE.get(key)
    if obj and obj.is_file():
        return obj, ""
    cache = pathlib.Path(tempfile.gettempdir()) / f"study-codelab-{os.getuid()}"
    cache.mkdir(mode=0o700, exist_ok=True)
    obj = cache / f"shim-{'winmain' if with_winmain else 'plain'}-{key[1][0]}.o"
    cmd = ["clang", "-c", "-O0", "-I", str(WINSHIM), str(sources[0]), "-o", str(obj)]
    if with_winmain:
        cmd.insert(2, "-DCODELAB_WITH_WINMAIN")
    rc, out = run(cmd, cwd=cache, timeout=30)
    if rc:
        return None, out
    SHIM_CACHE[key] = obj
    return obj, ""


def _capped_run(cmd, cwd):
    """Run the learner's program with a time limit; keep only the first MAX_OUTPUT bytes of each stream."""
    p = subprocess.Popen(cmd, cwd=cwd, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                         start_new_session=True)          # own process group: a timeout also stops its children
    kept = {"out": bytearray(), "err": bytearray()}

    def drain(stream, buf):
        for chunk in iter(lambda: stream.read(4096), b""):
            if len(buf) < MAX_OUTPUT:
                buf += chunk[:MAX_OUTPUT - len(buf)]
    readers = [threading.Thread(target=drain, args=(p.stdout, kept["out"]), daemon=True),
               threading.Thread(target=drain, args=(p.stderr, kept["err"]), daemon=True)]
    for t in readers:
        t.start()
    timed_out = False
    try:
        p.wait(timeout=RUN_SECONDS)
    except subprocess.TimeoutExpired:
        timed_out = True
        try:
            os.killpg(p.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        p.wait()
    for t in readers:
        t.join(timeout=1)
    p.stdout.close()
    p.stderr.close()
    text = lambda b: b.decode("utf-8", errors="replace") + ("\n…(output cut)" if len(b) >= MAX_OUTPUT else "")
    return p.returncode, text(kept["out"]), text(kept["err"]), timed_out


def _asm_view(raw):
    """Keep what Visual Studio's Disassembly window shows: labels, instructions and strings."""
    keep = []
    for line in raw.splitlines():
        s = line.rstrip() if line.lstrip().startswith(".asciz") else line.split(" #", 1)[0].rstrip()
        t = s.strip()
        if not t or t.startswith("#") or t.startswith("@feat"):
            continue
        if t.startswith(".") and not t.startswith((".asciz", ".ascii")):
            continue
        keep.append(s)
    return "\n".join(keep)


def codelab_page():
    """The full-window Code Lab: the same editor the Practice step embeds."""
    page = (HERE / "codelab.html").read_text(encoding="utf-8")
    return (page.replace("/*CODELAB_STYLE*/", (HERE / "codelab.css").read_text(encoding="utf-8"))
                .replace("/*CODELAB_APP*/", (HERE / "codelab.js").read_text(encoding="utf-8")))


def build_code(kit, name, source, action):
    if action not in ("build", "run", "asm"):
        return {"error": "Unknown action."}, 400
    saved, code = save_code(kit, name, source)
    if code != 200:
        return saved, code
    if name.endswith(".h"):
        return {"error": "Open a .c or .cpp file to build. A header is built by the file that includes it."}, 400
    d = code_dir(kit)
    cc = "clang++" if name.endswith(".cpp") else "clang"
    if not shutil.which(cc):
        return {"error": f"`{cc}` was not found. Install the Xcode Command Line Tools: xcode-select --install"}, 503
    result = {"ok": True, "file": saved["path"], "action": action}
    with tempfile.TemporaryDirectory(prefix="codelab-") as tmp:
        tmp = pathlib.Path(tmp)
        clean = lambda text: text.replace(str(tmp) + "/", "").replace(str(d) + "/", "")[-MAX_LOG:]
        if action == "asm":
            base = [cc, "-S", "-masm=intel", "-O0", "-g0", "-fno-asynchronous-unwind-tables", "-I", str(WINSHIM)]
            rc, out = run(base + ["--target=x86_64-pc-windows-msvc", name, "-o", str(tmp / "out.s")], cwd=d, timeout=30)
            result["target"] = "Windows x64"
            if rc and "file not found" in out:
                # The Windows target has no C library headers here; fall back to Mac x64 (Intel).
                rc, out = run(base + ["--target=x86_64-apple-macos11", name, "-o", str(tmp / "out.s")], cwd=d, timeout=30)
                result["target"] = ("Mac x64: Windows passes the first arguments in rcx, rdx, r8, r9; "
                                    "this view uses rdi, rsi, rdx, rcx")
            result.update(built=rc == 0, log=clean(out))
            if rc == 0:
                result["asm"] = _asm_view((tmp / "out.s").read_text(encoding="utf-8", errors="replace"))
            return result, 200
        shim, out = _shim_object(bool(re.search(r"\bWinMain\b", source)))
        if not shim:
            return {"error": "The Code Lab helper did not compile: " + clean(out)[-400:]}, 500
        flags = build_flags()
        started = time.monotonic()
        rc, out = run([cc, *flags, "-I", str(WINSHIM), name, str(shim), "-o", str(tmp / "program")],
                      cwd=d, timeout=60)
        result.update(built=rc == 0, log=clean(out), command=" ".join([cc, *flags, name]),
                      buildMs=round((time.monotonic() - started) * 1000))
        if rc or action == "build":
            return result, 200
        exit_code, stdout, stderr, timed_out = _capped_run([str(tmp / "program")], cwd=d)
        if timed_out:
            note = f"Stopped after {RUN_SECONDS} seconds (an endless loop?)."
        elif exit_code < 0:
            note = SIGNALS.get(-exit_code, f"The program crashed (signal {-exit_code}).")
        else:
            note = ""
        result.update(ran=True, exitCode=exit_code, console=stdout, debug=stderr, note=note)
    return result, 200


class Handler(http.server.BaseHTTPRequestHandler):
    server_version = "StudyHelper/1"

    def log_message(self, fmt, *args):
        if "/api/" in str(args[0] if args else ""):
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

    def send_html(self, text):
        body = text.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
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
            return self.send_json({"ok": True, "claude": bool(shutil.which(CLAUDE)), "videos": str(VIDEOS),
                                   "transcribe": WHISPER.available(), "voice": voice_available()})
        if path == "/api/progress":
            f = kit_dir(q["kit"][0]) / "progress.json"
            return self.send_json(json.loads(f.read_text(encoding="utf-8")) if f.exists() else {})
        if path == "/api/reviews":
            with LOCK:
                rows = [r for r in review_log.load(SUBJECT_NAME)
                        if r["stage"] != review_log.SKIPPED and r["next"] <= dt.date.today().isoformat()]
            return self.send_json({"due": rows})
        if path == "/api/video":
            name = os.path.basename(q.get("file", [""])[0])
            return self.send_json({"exists": bool(name) and (VIDEOS / name).is_file(), "folder": str(VIDEOS)})
        if path == "/api/next":
            return self.send_json({"next": next_item(q["kit"][0])})
        if path == "/api/cpu":                    # Task Manager lab: cores, logical processors, live load
            return self.send_json(cpuinfo.snapshot())
        if path == "/code":
            return self.send_html(codelab_page())
        if path == "/api/code":
            kit = q.get("kit", [""])[0] or (current_kit() or {}).get("kit", "")
            try:
                return self.send_json({"kit": kit, "files": code_files(kit),
                                       "folder": os.path.relpath(code_dir(kit), REPO),
                                       "compiler": bool(shutil.which("clang"))})
            except ValueError:
                return self.send_json({"error": "Unknown course day."}, 400)
        if path.startswith("/video/"):
            f = VIDEOS / os.path.basename(path[len("/video/"):])
            return self.send_file(f, ranged=True) if f.is_file() else self.send_error(404)
        f = (SUBJECT / path.lstrip("/")).resolve()
        if str(f).startswith(str(SUBJECT.resolve())) and f.is_file() and "/.git/" not in str(f):
            return self.send_file(f)
        self.send_error(404)

    def same_origin(self):
        """Only this page may call the helper: a browser always sends Origin on cross-site POSTs."""
        host = self.headers.get("Host", "")
        if urllib.parse.urlsplit("//" + host).hostname not in ("localhost", "127.0.0.1"):
            return False
        origin = self.headers.get("Origin")
        return origin is None or origin == f"http://{host}"

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path
        if not self.same_origin():
            return self.send_json({"error": "Requests must come from the study page."}, 403)
        if path == "/api/transcribe":           # body: the raw recording (webm/mp4); ?prompt= key terms
            n = int(self.headers.get("Content-Length", "0"))
            if not WHISPER.available():
                return self.send_json({"error": "Speech to text isn't set up on this computer."}, 503)
            if not 0 < n <= MAX_AUDIO:
                return self.send_json({"error": "The recording is empty or too long."}, 400)
            q = urllib.parse.parse_qs(url.query)
            prompt = q.get("prompt", [""])[0][:800]
            live = q.get("live", [""])[0] == "1"      # live preview while speaking: fast pass; the final pass is careful
            return self.send_json(WHISPER.transcribe(self.rfile.read(n), prompt, beam=1 if live else 5))
        try:
            body = self.read_json()
        except Exception:
            return self.send_json({"error": "bad request"}, 400)
        if path == "/api/review":
            unit, score = body.get("unit"), body.get("score")
            if not isinstance(unit, str) or type(score) is not int or not 0 <= score <= 100:
                return self.send_json({"error": "A review needs a unit and score from 0 to 100."}, 400)
            with LOCK:
                rows = review_log.load(SUBJECT_NAME)
                row = next((r for r in rows if r["unit"] == unit), None)
                if row is None:
                    return self.send_json({"error": "Unknown review unit."}, 404)
                if row["stage"] == review_log.SKIPPED:
                    return self.send_json({"error": "This review was skipped for good."}, 409)
                if row["next"] > dt.date.today().isoformat():
                    return self.send_json({"error": "This review is already scheduled for later."}, 409)
                code, out = run([sys.executable, str(REPO / "tools" / "reviews.py"), "grade", SUBJECT_NAME, unit, str(score)])
            if code:
                return self.send_json({"error": "Could not save the review."}, 500)
            return self.send_json({"ok": True, "message": out})
        if path == "/api/review-skip":           # retire a review for good (the learner chose "Skip")
            unit = body.get("unit")
            if not isinstance(unit, str):
                return self.send_json({"error": "Skipping needs a review unit."}, 400)
            with LOCK:
                row = next((r for r in review_log.load(SUBJECT_NAME) if r["unit"] == unit), None)
                if row is None:
                    return self.send_json({"error": "Unknown review unit."}, 404)
                code, out = run([sys.executable, str(REPO / "tools" / "reviews.py"), "skip", SUBJECT_NAME, unit])
            if code:
                return self.send_json({"error": "Could not skip the review."}, 500)
            return self.send_json({"ok": True, "message": out})
        if path == "/api/speak":
            return self.send_json(speak_note(body.get("kit"), body.get("id"), body.get("text")))
        if path == "/api/speak-answer":
            return self.send_json(speak_answer(body.get("kit"), body.get("text")))
        if path == "/api/notes":
            result, code = save_notes_file(body.get("kit"), body.get("markdown"))
            return self.send_json(result, code)
        if path == "/api/claude":
            return self.send_json(ask_claude(str(body.get("prompt", "")), bool(body.get("json"))))
        if path in ("/api/code/save", "/api/code/build"):
            try:
                if path == "/api/code/save":
                    result, code = save_code(body.get("kit"), body.get("file"), body.get("source"))
                else:
                    result, code = build_code(body.get("kit"), body.get("file"), body.get("source"), body.get("action"))
            except ValueError:
                result, code = {"error": "Unknown course day."}, 400
            except subprocess.TimeoutExpired:
                result, code = {"error": "The compiler took too long."}, 504
            return self.send_json(result, code)
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


def answers(url):
    try:
        urllib.request.urlopen(url, timeout=3).close()
        return True
    except Exception:
        return False


def stuck_helpers():
    """PIDs of study helpers that hold the port (e.g. one paused with Ctrl+Z, which keeps the port but never answers)."""
    out = subprocess.run(["lsof", "-ti", f"tcp:{PORT}", "-sTCP:LISTEN"], capture_output=True, text=True).stdout
    pids = [int(p) for p in out.split() if p.isdigit() and int(p) != os.getpid()]
    cmd = lambda p: subprocess.run(["ps", "-o", "command=", "-p", str(p)], capture_output=True, text=True).stdout
    return [p for p in pids if "serve.py" in cmd(p)]


def main():
    url = f"http://localhost:{PORT}/"
    wanted = [a for a in sys.argv[1:] if not a.startswith("-")]      # ./study cpu → open that kit (a side trip)
    if wanted:
        item = find_kit(wanted)
        if not item:
            sys.exit(f"No built study kit matches \"{' '.join(wanted)}\". See courses/playlist.json.")
        url += f"courses/{item['kit']}/study-kit.html"
        print(f"Opening: {item['title']}")
    bind = lambda: http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    try:
        server = bind()
    except OSError:
        if answers(url):
            print(f"The study helper is already running. Opening {url}")
            webbrowser.open(url)
            return
        pids = stuck_helpers()
        if not pids:
            sys.exit(f"Port {PORT} is used by another program. Close it, or run: STUDY_PORT=8766 ./study")
        print(f"An old study helper is stuck (paused with Ctrl+Z?): stopping it (PID {', '.join(map(str, pids))}).")
        for p in pids:
            os.kill(p, signal.SIGKILL)  # SIGKILL also works on a paused process
        for _ in range(30):
            time.sleep(0.1)
            try:
                server = bind()
                break
            except OSError:
                pass
        else:
            sys.exit(f"Port {PORT} is still busy. Try again in a few seconds.")
    VIDEOS.mkdir(parents=True, exist_ok=True)
    print(f"Study helper running at {url}")
    print(f"Videos folder: {VIDEOS}")
    print("Claude Code:", "found" if shutil.which(CLAUDE) else "NOT found (grading in the page won't work)")
    print("Speech to text:", "on (mic buttons in every text box)" if WHISPER.available()
          else "off (run tools/transcribe/setup-mac.sh once to get mic buttons)")
    if WHISPER.available():
        threading.Thread(target=WHISPER.preload, daemon=True).start()   # load the model now: the first answer is fast
    print("Leave this window open while you study. Press Ctrl+C to stop (Ctrl+Z only pauses it and blocks the page).")
    if "--no-browser" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
