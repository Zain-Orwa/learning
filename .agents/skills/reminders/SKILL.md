---
name: reminders
description: Update Zain's existing phone reminders on their owning Claude account when scheduling tools are available; keep local prompts and live status separate.
---

# /reminders

Read `docs/scheduled-tasks.md`. Existing ids belong to the Claude account
that created them, not automatically to the current Codex or Claude account.
Canonical prompts are the `.txt` files next to this skill.

1. Inspect the current account's scheduling capabilities and list its tasks
   if supported. Match the saved ids/names; do not create duplicates merely
   because this is another account. Do not invent tool names.
2. On the owning account, update Daily review with `daily-review.txt`, keeping
   12:48 Europe/Berlin daily. Update Debug challenge with `debug-challenge.txt`,
   keeping 18:45 Europe/Berlin on Mon/Wed/Fri/Sun. Debug invites optional
   practice; actual debugging in a lesson already counts.
3. Verify returned prompts, schedules and notification settings. Record only
   observed changes and ids in `docs/scheduled-tasks.md` and the subject's
   `journey/STATE.md`, then commit/push.
4. If access is unavailable, leave live status unverified. Keep ready prompts
   in the repo. Handoff: on the original Claude account, run `/reminders`
   from the updated repo to update the two existing tasks. Never report
   local edits as live updates.

Creating tasks on another account requires an explicit migration request;
then avoid duplicates and tell Zain to disable the old account's tasks.
