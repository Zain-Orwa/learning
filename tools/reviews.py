#!/usr/bin/env python3
"""Spaced-review log helper for every subject's journey/REVIEWS.md.

Schedule: 1d -> 3d -> 1w -> 2w -> 1m -> 3m -> 6m -> then every 6 months.
A review passes at 80% or more (move to the next interval).
Below 80%: back to 1 day (history is kept).

Usage (run from the repo root):
  python3 tools/reviews.py due [--date YYYY-MM-DD]
      List every unit due on/before the date, in all subjects.
  python3 tools/reviews.py add <subject> <unit-id> "<title>" <source> [--date YYYY-MM-DD]
      Add a learned unit (first review tomorrow). Skips it if it already exists.
  python3 tools/reviews.py grade <subject> <unit-id> <score 0-100> [--date YYYY-MM-DD]
      Record a review score and move the unit to its next date.
  python3 tools/reviews.py list <subject>
"""
import datetime as dt
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
STAGES = [("1d", 1), ("3d", 3), ("1w", 7), ("2w", 14), ("1m", 30), ("3m", 90), ("6m", 180)]
PASS = 80
HEADER = "| Unit | Title | Source | Learned | Stage | Next due | Last | History |"
SEP = "|---|---|---|---|---|---|---|---|"
INTRO = """# Spaced reviews

Every learned unit (one part of an episode) comes back for review after
**1 day → 3 days → 1 week → 2 weeks → 1 month → 3 months → 6 months → every 6 months**.
A review passes at **80%+** (next interval). Below 80% it goes back to 1 day.
Edit this file only with `python3 tools/reviews.py` (run from the repo root),
so the dates are always right. `/review` runs a review session.

"""


def today(args):
    if "--date" in args:
        return dt.date.fromisoformat(args[args.index("--date") + 1])
    return dt.date.today()


def path(subject):
    return ROOT / subject / "journey" / "REVIEWS.md"


def load(subject):
    p = path(subject)
    if not p.exists():
        return []
    rows = []
    for line in p.read_text(encoding="utf-8").splitlines():
        if line.startswith("| ") and not line.startswith("| Unit ") and not line.startswith("|---"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) == 8:
                rows.append(dict(zip(["unit", "title", "source", "learned", "stage", "next", "last", "history"], cells)))
    return rows


def store(subject, rows):
    rows.sort(key=lambda r: (r["next"], r["unit"]))
    lines = [INTRO + HEADER, SEP]
    for r in rows:
        lines.append("| " + " | ".join(r[k] for k in ["unit", "title", "source", "learned", "stage", "next", "last", "history"]) + " |")
    p = path(subject)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("\n".join(lines) + "\n", encoding="utf-8")


def subjects():
    return sorted(p.parent.parent.name for p in ROOT.glob("*/journey/REVIEWS.md"))


def stage_index(name):
    names = [s for s, _ in STAGES]
    return names.index(name) if name in names else len(STAGES) - 1


def main(argv):
    if len(argv) < 2:
        sys.exit(__doc__)
    cmd, args = argv[1], argv[2:]
    d = today(args)
    if cmd == "due":
        found = False
        for subj in subjects():
            for r in load(subj):
                if r["next"] <= d.isoformat():
                    found = True
                    print(f"{subj}\t{r['unit']}\t{r['title']}\tstage {r['stage']}\tdue {r['next']}\tsource {r['source']}")
        if not found:
            print(f"Nothing due on {d.isoformat()}.")
    elif cmd == "add":
        subj, unit, title, source = args[0], args[1], args[2].replace("|", "/"), args[3]
        rows = load(subj)
        if any(r["unit"] == unit for r in rows):
            print(f"{unit} already in the log; skipped.")
            return
        rows.append({"unit": unit, "title": title, "source": source, "learned": d.isoformat(),
                     "stage": STAGES[0][0], "next": (d + dt.timedelta(days=STAGES[0][1])).isoformat(),
                     "last": "–", "history": ""})
        store(subj, rows)
        print(f"Added {unit}; first review {(d + dt.timedelta(days=1)).isoformat()}.")
    elif cmd == "grade":
        subj, unit, score = args[0], args[1], int(args[2])
        rows = load(subj)
        r = next((r for r in rows if r["unit"] == unit), None)
        if not r:
            sys.exit(f"{unit} not found in {path(subj)}")
        i = stage_index(r["stage"])
        if score >= PASS:
            i = min(i + 1, len(STAGES) - 1)
        else:
            i = 0
        r["stage"], days = STAGES[i]
        r["next"] = (d + dt.timedelta(days=days)).isoformat()
        r["last"] = f"{score}%"
        r["history"] = (r["history"] + " " if r["history"] else "") + f"{d.isoformat()}:{score}%"
        store(subj, rows)
        print(f"{unit}: {score}% -> {'passed' if score >= PASS else 'back to 1 day'}; next review {r['next']} ({r['stage']}).")
    elif cmd == "list":
        for r in load(args[0]):
            print(f"{r['unit']}\t{r['stage']}\tnext {r['next']}\tlast {r['last']}\t{r['title']}")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv)
