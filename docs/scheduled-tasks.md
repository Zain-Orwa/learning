# Phone reminders

The existing reminders belong to the **Claude account that created them on
2026-10-31**. Changing Codex accounts does not move them. Notifications go to
the phone logged into that owning account. Do not create duplicate tasks on
other accounts unless Zain requests a migration.

## Desired settings

| Existing task | Schedule | Existing id | Canonical prompt |
|---|---|---|---|
| Daily review | Daily, 12:48 Europe/Berlin | `trig_015H7qGd7zXdGP9ACCUadnzw` | `.agents/skills/reminders/daily-review.txt` |
| Debug challenge | Mon/Wed/Fri/Sun, 18:45 Europe/Berlin | `trig_013u5WqvEma6ksmyvTh6PDjA` | `.agents/skills/reminders/debug-challenge.txt` |

The daily prompt caps review at five minutes and adds no automatic interview
or debugging work. The debug prompt invites optional practice; real debugging
in the lesson already counts. Schedules are preserved, not newly verified.

## Live status and remaining action

Local prompts were updated on **2026-11-15**. This Codex session has no tool
for the original Claude tasks; plugin discovery did not find a Claude task
connector. Their live prompts, schedules, enabled state and notification
settings have **not been inspected or changed here**. Earlier saved records
say the November 8 prompt update was still pending.

On the **original Claude account**, run `/reminders` from the updated repo.
It should update the two existing tasks with the canonical prompts above,
then verify the returned settings. Record the verification date and actual
results here and in `handmade-mastery/journey/STATE.md`. Until then, keep this
item pending. Do not describe local prompt edits as completed cloud updates.
