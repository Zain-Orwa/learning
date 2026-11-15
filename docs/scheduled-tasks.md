# Phone reminders

The existing reminders belong to the **Claude account that created them on
2026-10-31**. Changing Codex accounts does not move them. Notifications go to
the phone logged into that owning account. Do not create duplicate tasks on
other accounts unless Zain requests a migration.

## Desired settings

| Existing task | Schedule | Existing id | Canonical prompt |
|---|---|---|---|
| Daily review | Daily, 12:48 Europe/Berlin | `trig_01LaGmv4hWn3FBSPhof4G13y` (new account; old: `trig_015H7qGd7zXdGP9ACCUadnzw`) | `.agents/skills/reminders/daily-review.txt` |
| Debug challenge | Mon/Wed/Fri/Sun, 18:45 Europe/Berlin | `trig_01Up8nKs72sre7b9sSxpivaq` (new account; old: `trig_013u5WqvEma6ksmyvTh6PDjA`) | `.agents/skills/reminders/debug-challenge.txt` |

The daily prompt caps review at five minutes and adds no automatic interview
or debugging work. The debug prompt invites optional practice; real debugging
in the lesson already counts. Schedules are preserved, not newly verified.

## Live status and remaining action

Local prompts were updated on **2026-11-15**. This Codex session has no tool
for the original Claude tasks; plugin discovery did not find a Claude task
connector. Their live prompts, schedules, enabled state and notification
settings have **not been inspected or changed here**. Earlier saved records
say the November 8 prompt update was still pending.

**2026-11-15, Claude session:** `RemoteTrigger list` on the Claude account
used here returned no tasks, and `get` for both ids above returned 404
"Trigger not found". So this account is **not** the owner. Nothing was
created or changed, and the live tasks are still unverified.

On the **original Claude account**, run `/reminders` from the updated repo.
It should update the two existing tasks with the canonical prompts above,
then verify the returned settings. Record the verification date and actual
results here and in `handmade-mastery/journey/STATE.md`. Until then, keep this
item pending. Do not describe local prompt edits as completed cloud updates.

**2026-11-15, migration (Zain asked for it):** the original owner account could not be found, so
both reminders were created fresh on the Claude account Zain uses for claude.ai chat, with the
canonical prompts above. Verified from the create results: Daily review `trig_01LaGmv4hWn3FBSPhof4G13y`
(`CRON_TZ=Europe/Berlin 48 12 * * *`, first run 2026-11-16 12:48 Berlin) and Debug challenge
`trig_01Up8nKs72sre7b9sSxpivaq` (`CRON_TZ=Europe/Berlin 45 18 * * 0,1,3,5`, first run 2026-11-15
18:45 Berlin). Both enabled, cloud-only, push notifications on, email off, auto approval.
The old tasks (`trig_015H…`, `trig_013u…`) may still run on the old account: if a reminder comes
twice, open the Claude app logged into the old account and turn the old ones off.
