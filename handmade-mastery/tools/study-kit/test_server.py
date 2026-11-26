"""Run: python3 handmade-mastery/tools/study-kit/test_server.py

Exercises the real HTTP handlers and review CLI against disposable files.
No model calls, git operations or learner-progress changes.
"""
import importlib.util
import json
import pathlib
import shutil
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from unittest.mock import patch

REPO = pathlib.Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location("study_server", pathlib.Path(__file__).with_name("serve.py"))
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class ReviewsTest(unittest.TestCase):
    def test_shared_schedule(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            subject = root / "handmade-mastery"
            (subject / "journey").mkdir(parents=True)
            (root / "tools").mkdir()
            shutil.copy2(REPO / "tools/reviews.py", root / "tools/reviews.py")
            # run() has a bound cwd default, so adapt it to the disposable repo.
            original_run = helper.run
            with patch.multiple(helper, REPO=root, SUBJECT=subject), patch.object(helper.review_log, "ROOT", root), patch.object(helper, "run", side_effect=lambda cmd: original_run(cmd, cwd=root)):
                meta = {"kit": "intro-to-c/day01", "unitPrefix": "icd01", "unitLabel": "Intro C D1", "completedParts": [
                    {"id": "b01", "n": 1, "title": "Compiler", "date": "2020-01-01", "interview": [{"area": "toolchain", "q": "Extra"}], "debug": [{"title": "Extra", "level": 1}]}]}
                self.assertEqual(helper.add_reviews(meta), ["icd01-p01"])
                self.assertEqual(helper.add_reviews(meta), [])
                self.assertEqual(len(helper.review_log.load("handmade-mastery")), 1)
                server = ThreadingHTTPServer(("127.0.0.1", 0), helper.Handler)
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                origin = f"http://127.0.0.1:{server.server_port}"

                def request(path, body=None):
                    data = None if body is None else json.dumps(body).encode()
                    req = urllib.request.Request(origin + path, data=data, headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        return json.load(response)

                try:
                    # Missing assets should return 404, not crash the error logger.
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        request("/missing-preview-icon.ico")
                    self.assertEqual(error.exception.code, 404)
                    error.exception.close()
                    self.assertEqual(len(request("/api/reviews")["due"]), 1)
                    for score in [-1, 101, "80", True]:
                        with self.subTest(score=score), self.assertRaises(urllib.error.HTTPError) as error:
                            request("/api/review", {"unit": "icd01-p01", "score": score})
                        self.assertEqual(error.exception.code, 400)
                        error.exception.close()
                    self.assertTrue(request("/api/review", {"unit": "icd01-p01", "score": 80})["ok"])
                    self.assertEqual(request("/api/reviews")["due"], [])
                    row = helper.review_log.load("handmade-mastery")[0]
                    self.assertEqual(row["stage"], "3d")
                    self.assertEqual(row["last"], "80%")
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        request("/api/review", {"unit": "icd01-p01", "score": 80})
                    self.assertEqual(error.exception.code, 409)
                    error.exception.close()
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        request("/api/review", {"unit": "unknown", "score": 80})
                    self.assertEqual(error.exception.code, 404)
                    error.exception.close()
                    # "Skip this review": retired for good, never due, never graded, not re-added.
                    for body, code in [({}, 400), ({"unit": "unknown"}, 404)]:
                        with self.subTest(body=body), self.assertRaises(urllib.error.HTTPError) as error:
                            request("/api/review-skip", body)
                        self.assertEqual(error.exception.code, code)
                        error.exception.close()
                    self.assertTrue(request("/api/review-skip", {"unit": "icd01-p01"})["ok"])
                    row = helper.review_log.load("handmade-mastery")[0]
                    self.assertEqual(row["stage"], helper.review_log.SKIPPED)
                    self.assertIn("80%", row["history"])
                    row["next"] = "2000-01-01"  # even with an old date it must stay hidden
                    helper.review_log.store("handmade-mastery", [row])
                    self.assertEqual(request("/api/reviews")["due"], [])
                    with self.assertRaises(urllib.error.HTTPError) as error:
                        request("/api/review", {"unit": "icd01-p01", "score": 90})
                    self.assertEqual(error.exception.code, 409)
                    error.exception.close()
                    self.assertEqual(helper.add_reviews(meta), [])
                finally:
                    server.shutdown()
                    server.server_close()
                    thread.join()



class NotesTest(unittest.TestCase):
    """Notes file and voice endpoint: disposable kit folder, Kokoro replaced by a stub (no model load)."""

    def test_notes_and_voice(self):
        with tempfile.TemporaryDirectory() as tmp:
            subject = pathlib.Path(tmp) / "handmade-mastery"
            day = subject / "courses" / "intro-to-c" / "day01"
            day.mkdir(parents=True)
            (day / "study-kit.html").write_text("<p>kit</p>", encoding="utf-8")
            kit = "intro-to-c/day01"

            def fake_run(cmd, **kw):
                pathlib.Path(cmd[2]).write_bytes(b"ID3fake")      # speak_note.py <out> <voice dir>
                self.assertEqual(kw["input"], "Main idea.")
                return type("P", (), {"returncode": 0})()

            with patch.object(helper, "SUBJECT", subject):
                ok, code = helper.save_notes_file(kit, "# My notes\n")
                self.assertEqual((ok, code), ({"ok": True}, 200))
                self.assertEqual((day / "notes.md").read_text(encoding="utf-8"), "# My notes\n")
                for bad_kit in ["../../etc", "intro-to-c/day99", None, 7]:
                    with self.subTest(kit=bad_kit):
                        self.assertEqual(helper.save_notes_file(bad_kit, "x")[1], 404)
                self.assertEqual(helper.save_notes_file(kit, "x" * (helper.MAX_NOTES_MD + 1))[1], 400)
                self.assertEqual(helper.save_notes_file(kit, None)[1], 400)

                with patch.object(helper, "voice_available", return_value=True), \
                        patch.object(helper.subprocess, "run", side_effect=fake_run):
                    r = helper.speak_note(kit, "b03", "  Main idea.  ")
                    self.assertTrue(r["file"].startswith("audio/notes/b03.mp3?v="), r)
                    self.assertEqual((day / "audio" / "notes" / "b03.mp3").read_bytes(), b"ID3fake")
                    self.assertFalse(any(p.name.startswith(".") for p in (day / "audio" / "notes").iterdir()))
                    for note_id in ["../x", "b3", "B03", "", None, "episode/../x"]:
                        with self.subTest(note_id=note_id):
                            self.assertIn("error", helper.speak_note(kit, note_id, "Main idea."))
                    self.assertIn("error", helper.speak_note(kit, "b03", "   "))
                    self.assertIn("error", helper.speak_note(kit, "b03", "x" * 6001))
                    self.assertIn("error", helper.speak_note("../../etc", "b03", "Main idea."))
                with patch.object(helper, "voice_available", return_value=False):
                    self.assertIn("Kokoro", helper.speak_note(kit, "b03", "Main idea.")["error"])
                with patch.object(helper, "voice_available", return_value=True):
                    self.assertIn("error", helper.speak_note(kit, "b03\n", "Main idea."))
                    helper.VOICE_LOCK.acquire()
                    try:
                        self.assertIn("Another voice", helper.speak_note(kit, "b03", "Main idea.")["error"])
                    finally:
                        helper.VOICE_LOCK.release()

                server = ThreadingHTTPServer(("127.0.0.1", 0), helper.Handler)
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                origin = f"http://127.0.0.1:{server.server_port}"

                def post(path, body, headers=None):
                    req = urllib.request.Request(origin + path, data=json.dumps(body).encode(),
                                                 headers={"Content-Type": "application/json", **(headers or {})})
                    try:
                        with urllib.request.urlopen(req, timeout=5) as response:
                            return response.status, json.load(response)
                    except urllib.error.HTTPError as e:
                        with e:
                            return e.code, json.load(e)

                try:
                    self.assertEqual(post("/api/notes", {"kit": kit, "markdown": "same page"}, {"Origin": origin}), (200, {"ok": True}))
                    self.assertEqual((day / "notes.md").read_text(encoding="utf-8"), "same page")
                    for headers in [{"Origin": "https://evil.example"}, {"Origin": "null"}, {"Host": "evil.example"}]:
                        with self.subTest(headers=headers):
                            code, _ = post("/api/notes", {"kit": kit, "markdown": "attack"}, headers)
                            self.assertEqual(code, 403)
                    self.assertEqual((day / "notes.md").read_text(encoding="utf-8"), "same page")
                finally:
                    server.shutdown()
                    server.server_close()
                    thread.join()


DAY1 = """#include <windows.h>

int CALLBACK
WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    OutputDebugStringA("This is the first thing we have actually printed.\\n");
    return 0;
}
"""


@unittest.skipUnless(shutil.which("clang++"), "needs clang (Xcode Command Line Tools)")
class CodeLabTest(unittest.TestCase):
    """Code Lab: real clang builds in a disposable code folder."""

    def test_build_run_and_disassembly(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            subject = root / "handmade-mastery"
            (subject / "courses" / "intro-to-c" / "day01").mkdir(parents=True)
            kit = "intro-to-c/day01"
            with patch.multiple(helper, REPO=root, SUBJECT=subject, CODE_ROOT=subject / "code", RUN_SECONDS=1):
                build = lambda name, source, action: helper.build_code(kit, name, source, action)

                r, code = build("main.cpp", DAY1, "run")
                self.assertEqual(code, 200, r)
                self.assertTrue(r["built"], r["log"])
                self.assertEqual(r["exitCode"], 0)
                self.assertEqual(r["debug"], "This is the first thing we have actually printed.\n")
                saved = (subject / "code" / kit / "main.cpp").read_bytes()
                self.assertIn(b"\r\n", saved)
                self.assertEqual(helper.code_files(kit), [{"name": "main.cpp", "source": DAY1}])

                r, _ = build("main.cpp", DAY1, "asm")
                self.assertEqual(r["target"], "Windows x64")
                self.assertIn("call\tOutputDebugStringA", r["asm"])
                self.assertNotIn(".seh_", r["asm"])

                r, _ = build("empty.cpp", "", "run")      # Casey's empty file: compiles, fails to link
                self.assertFalse(r["built"])
                self.assertNotIn("ran", r)
                self.assertNotIn(tmp, r["log"])

                r, _ = build("typo.cpp", DAY1.replace("return 0;", "return 0"), "build")
                self.assertFalse(r["built"])
                self.assertIn("typo.cpp:7:", r["log"]); self.assertIn("error", r["log"])

                r, _ = build("hello.c", '#include <stdio.h>\nint main(void){ printf("hi\\n"); return 3; }\n', "run")
                self.assertEqual((r["console"], r["exitCode"]), ("hi\n", 3))
                r, _ = build("hello.c", '#include <stdio.h>\nint main(void){ return 0; }\n', "asm")
                self.assertTrue(r["built"])
                self.assertIn("Mac x64", r["target"])

                r, _ = build("crash.c", "int main(void){ int *p = 0; *p = 1; return 0; }\n", "run")
                self.assertIn("Access violation", r["note"])
                r, _ = build("loop.c", "int main(void){ for(;;){} }\n", "run")
                self.assertIn("Stopped after 1 seconds", r["note"])

                for name in ["../x.c", "a/b.c", "x.exe", ".hidden.c", "", None]:
                    with self.subTest(name=name):
                        self.assertEqual(helper.save_code(kit, name, "x")[1], 400)
                for bad_kit in ["../../etc", "intro-to-c", "intro-to-c/day01/..", None]:
                    with self.subTest(kit=bad_kit), self.assertRaises(ValueError):
                        helper.code_dir(bad_kit)
                self.assertEqual(build("main.cpp", DAY1, "rm -rf")[1], 400)
                self.assertEqual(build("main.h", "", "run")[1], 400)

                # The startup object is compiled once and reused; saving swaps whole files only.
                cached = len(helper.SHIM_CACHE)
                build("main.cpp", DAY1, "run")
                self.assertEqual(len(helper.SHIM_CACHE), cached)
                self.assertFalse(list((subject / "code" / kit).glob(".*.saving")))

                # An endless loop that starts a child process: the timeout stops both.
                r, _ = build("fork.c", "#include <unistd.h>\nint main(void){ fork(); for(;;){} }\n", "run")
                self.assertIn("Stopped after", r["note"])


class CpuInfoTest(unittest.TestCase):
    """Task Manager lab: the helper's /api/cpu numbers."""

    def test_topology_and_ticks(self):
        snap = helper.cpuinfo.snapshot()
        self.assertGreaterEqual(snap["logical"], 1)
        self.assertGreaterEqual(snap["sockets"], 1)
        if snap["cores"]:
            self.assertLessEqual(snap["cores"], snap["logical"])
            self.assertEqual(sum(g["cores"] for g in snap["groups"]) or snap["cores"], snap["cores"])
        json.dumps(snap)                                     # the route sends it as JSON
        a = helper.cpuinfo.ticks()
        if a is None:
            self.skipTest("no per-processor counters on this OS")
        self.assertEqual(len(a), snap["logical"])
        b = helper.cpuinfo.ticks()
        for (busy0, total0), (busy1, total1) in zip(a, b):   # counters only grow; busy never exceeds total
            self.assertLessEqual(busy0, total0)
            self.assertGreaterEqual(total1, total0)
            self.assertGreaterEqual(busy1, busy0)

    def test_topology_is_read_once(self):
        first = helper.cpuinfo.topology()
        first["cores"] = -1                                  # callers get a copy, not the cache
        self.assertNotEqual(helper.cpuinfo.topology()["cores"], -1)


if __name__ == "__main__":
    unittest.main()
