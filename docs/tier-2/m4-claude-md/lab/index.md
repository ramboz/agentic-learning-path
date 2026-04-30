---
title: Lab — Build a CLAUDE.md for PR Assistant
description: Self-paced 2-hour exercise for Module 4. Run Claude Code on the PR Assistant repo with and without a CLAUDE.md, and feel the difference.
sidebar_label: Lab
pagination_label: M4 Lab — CLAUDE.md
---

# Lab — Build a CLAUDE.md for PR Assistant

[Module 4](../) lab. ~2 hours. Self-paced. No submission, no review.

The point of this lab is to feel the difference a good CLAUDE.md makes by experiencing both states. You'll run Claude Code on a repo without one, watch the friction, write the file, and run again. The before-and-after is what you keep.

This is the curriculum's anchor project entering for the first time. PR Assistant grows over Modules 4 through 12, so the CLAUDE.md you write here is what Module 5 refactors into path-scoped rules and what Module 6 inherits when it decomposes review into sub-agents.

## Before you start

- **Time:** ~2 hours total. Step 1 (running without a CLAUDE.md) and Step 4 (calibration and pruning) are where most of the learning lives. Don't rush either.
- **Prerequisites:** [Module 3](../../../tier-1/m3-claude-code/) finished. Claude Code installed and working. The plan/edit/exec loop should feel familiar.
- **What you'll work on:** The PR Assistant sample repo at [github.com/ramboz/pr-assistant-lab](https://github.com/ramboz/pr-assistant-lab). It's a small TypeScript project with seeded issues planted across the codebase: bugs, style violations, and design problems for Claude Code to find.

## Setup

1. Clone the repo:

   ```
   git clone https://github.com/ramboz/pr-assistant-lab.git
   cd pr-assistant-lab
   ```

2. Verify the project builds:

   ```
   npm install
   npm run build
   npm test
   ```

3. Read `STARTER-NOTES.md` at the repo root for project scope. **Do not read `SEEDED-ISSUES.md` yet.** That file is the answer key for Step 4; reading it now spoils the calibration.

4. Verify your Claude Code install from Module 3 still works. Confirm you're on the latest version.

A note on the missing `CLAUDE.md`: the repo intentionally ships without one. Writing it is the lab. If you find a `CLAUDE.md` at the root, file an issue against the upstream repo.

## The exercise

### Step 1: Run without a CLAUDE.md

Open Claude Code in the repo. Ask it to review one of the mock PRs (the repo includes a `MOCK-PRS/` directory with three sample PRs as branches; pick whichever). Watch carefully. Note specifically:

- How many turns does it spend orienting itself before getting to the review?
- Does it run the test command? Does it know how to?
- Does it make assumptions about conventions that don't match the codebase?
- Does it edit any files it shouldn't?

Don't help it. The friction is the data.

**Time:** ~25 minutes.

### Step 2: Write a CLAUDE.md

Based on what you learned in Step 1, write a CLAUDE.md for the repo. Use the five categories from [the concept post](../) as a checklist:

1. How to operate the project
2. Project layout
3. Conventions and idioms
4. Things to never touch
5. Standing decisions

**Constraint:** keep the prose under 80 lines. If you're going over, you're documenting things that don't earn their place. Real projects, especially ones using the navigation-index pattern with referenced detail docs, will reasonably run longer. The constraint is a teaching constraint on a small repo, not a rule you'll carry forward.

**Time:** ~30 minutes.

### Step 3: Run with the CLAUDE.md

Open a fresh Claude Code session. Ask it to review the same mock PR from Step 1. Note the same observations. Compare directly:

- Did the orientation turns disappear?
- Did it run the test command without being told?
- Did it follow the conventions you wrote down?
- Where did your CLAUDE.md help, and where did it not?

**Time:** ~25 minutes.

### Step 4: Calibration pass

Now read `SEEDED-ISSUES.md`. For each seeded issue, check whether the run with CLAUDE.md caught it. Some issues are designed to be caught only with proper convention awareness; others should be catchable either way. Note which ones your CLAUDE.md helped with and which it didn't.

Then prune. Open your CLAUDE.md and ask: which lines did the model use in Step 3? Which lines were ignored? Delete the ignored ones and shrink the file.

**Time:** ~20 minutes.

### Step 5: Reflection

Write three sentences:

- One thing your CLAUDE.md helped with that you didn't expect
- One thing it didn't help with that you thought it would
- One entry you'd add or remove if you ran the lab again tomorrow

**Time:** ~10 minutes.

## What you'll have at the end

- Two recorded review sessions for direct comparison
- A working CLAUDE.md sized for the project
- A personal calibration of where the file's leverage came from

Keep all of these. Module 5 builds on this CLAUDE.md when it refactors into path-scoped rules; Module 6 picks up from there to decompose PR Assistant into sub-agents.

## Common traps

- **Writing the CLAUDE.md before running Step 1.** The friction is the data. Without it, you'll write a generic CLAUDE.md template that doesn't reflect this project.
- **Going over the 80-line constraint.** The constraint forces choices. If you can't fit everything you want, that's the lab teaching you which entries earn their place.
- **Treating Step 4 as optional.** The pruning step is most of the learning. The first draft is rarely the right size.
- **Documenting things "in case the model needs them."** If you didn't see the model need it in Step 1, it's speculation. Leave it out.

## Optional worksheet

If taking notes inline helps, copy this template into a scratch file and fill it as you go. Not required.

```
STEP 1: Run without CLAUDE.md
  Mock PR picked: ___
  Turns spent orienting: ___
  Ran test command on its own: ___
  Wrong-convention assumptions: ___
  Files edited that shouldn't have been: ___

STEP 2: Write CLAUDE.md
  Final line count: ___
  Categories used (1-5): ___
  Hardest category to write: ___

STEP 3: Run with CLAUDE.md
  Orientation turns this time: ___
  Ran test command on its own: ___
  Conventions followed: ___
  Where CLAUDE.md didn't help: ___

STEP 4: Calibration
  Seeded issues caught: ___ / ___
  Lines the model clearly used: ___
  Lines the model ignored: ___
  After pruning, line count: ___

STEP 5: Reflection
  Unexpected help: ___
  Expected but didn't help: ___
  Add/remove if I ran it again: ___
```

## When you're done

You should have a working CLAUDE.md, two review sessions for comparison, and a feel for which entries earned their place. The pruning step is where most learners discover their first draft was longer than it needed to be; if that happened, the file did its job.

That last calibration is the bridge into [Module 5](../../m5-rules/), which takes the CLAUDE.md you just wrote and refactors it into path-scoped rules. The decomposition into persona reviewers as sub-agents lands in [Module 6](../../m6-subagents-skills/) once you've seen what scope-by-path can do.

## Extension, optional

Add a `progress.md` file before running Step 3. Pretend the PR review is a multi-session task and write down the goal, status, and one rejected approach. See whether the model uses it. The pattern matters more than getting it right; you'll formalize it more in Module 8 when work spans real overnight runs.
