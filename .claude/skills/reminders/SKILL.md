---
name: reminders
description: Create or update Zain's phone reminders (scheduled tasks) on the current Claude account from the definitions stored in the repo: the daily review and the debug challenge. Use when he says /reminders, switches to another Claude account, or wants to change reminder times.
---

# /reminders: set up the scheduled tasks on this account

Definitions live in `docs/scheduled-tasks.md`; the exact prompts are the
`.txt` files next to this skill. Scheduled tasks belong to one account, so:

1. List this account's scheduled tasks (list_triggers). If "Daily review" or
   "Debug challenge" already exist, **update** them (update_trigger) with the
   prompt and schedule from the files instead of creating duplicates.
2. Otherwise create them (create_trigger, cloud, no computer needed,
   notifications push on, initiation human_request):
   - **Daily review**: `CRON_TZ=Europe/Berlin 48 12 * * *`, prompt = `daily-review.txt`.
   - **Debug challenge**: `CRON_TZ=Europe/Berlin 45 18 * * 0,1,3,5`, prompt = `debug-challenge.txt`.
3. Tell him in one line each which approval setting each task got.
4. Remind him: turn the same tasks **off on any other account** (only one
   account should run them), and make sure his phone's Claude app is logged
   into **this** account.
5. Write the new task ids into the subject's `journey/STATE.md` and
   `docs/scheduled-tasks.md`, commit and push.
