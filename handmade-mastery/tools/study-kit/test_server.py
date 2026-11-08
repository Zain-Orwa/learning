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
                finally:
                    server.shutdown()
                    server.server_close()
                    thread.join()


if __name__ == "__main__":
    unittest.main()
