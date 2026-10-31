# Scheduled tasks (phone notifications)

Scheduled tasks run in Claude's cloud on a timer and send a **push
notification to the Claude app on his phone**. He taps it, the questions are
waiting, and he answers right there.

**Important:** a scheduled task belongs to **one Claude account**. Its
notifications go only to phones logged into that account.
- Keep the tasks on **one account**: the one logged in on his phone.
- If he moves to another account: run `/reminders` there (it creates these
  tasks from this file), and turn the old account's tasks off. Two accounts
  running the same tasks would send double notifications and write the review
  log twice.

Current owner: the Claude account that created them on 2026-10-31 (ids below).

## 1. Daily review
- **When:** every day, 12:48 Europe/Berlin (`CRON_TZ=Europe/Berlin 48 12 * * *`)
- **Id on the current account:** `trig_015H7qGd7zXdGP9ACCUadnzw`
- **Does:** due spaced reviews. Weekdays add a 2-question interview drill;
  weekends add a study-day reminder. Grades strictly, reschedules, pushes.
- **Prompt:** see `.claude/skills/reminders/daily-review.txt`

## 2. Debug challenge
- **When:** Monday, Wednesday, Friday and Sunday at 18:45 Europe/Berlin
  (`CRON_TZ=Europe/Berlin 45 18 * * 0,1,3,5`)
- **Id on the current account:** `trig_013u5WqvEma6ksmyvTh6PDjA`
- **Does:** one debugging challenge from studied material (`/debug`), timed,
  graded with the debugging rubric, recorded, pushed.
- **Prompt:** see `.claude/skills/reminders/debug-challenge.txt`

Both run in the cloud (no computer needed), with push notifications on and
automatic approval, so they can save his results without asking.
