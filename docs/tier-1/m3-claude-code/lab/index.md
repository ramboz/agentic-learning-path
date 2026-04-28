---
title: Lab — Set up Claude Code and run tasks of increasing autonomy
description: Self-paced 90-minute exercise for Module 3. Install Claude Code, work on a sample repo across four autonomy levels, calibrate your permissions posture.
sidebar_label: Lab
---

# Lab — Set up Claude Code and run tasks of increasing autonomy

[Module 3](../) lab. ~90 minutes. Self-paced. No submission, no review.

The point of this lab is not to ship anything. It's to feel where the
plan/edit/exec loop strains, and to build the reflex of intervening at the
right moment. By the end you should have a personal answer to "where do I
need to pay attention with this tool?" Calibrated against your own runs,
not someone else's.

## Before you start

- **Time:** ~90 minutes total. Setup is 10-15 minutes. Four tasks are
  60-70 minutes. The calibration pass at the end is 10 minutes and is
  most of the learning, so don't skip it.
- **Prerequisites:** [Module 1](../../m1-prompting/) and [Module 2](../../m2-context/) read. Claude Code account access.
  Node.js 18 or later installed.
- **What you'll work on:** A small Markdown-to-HTML CLI called `md2html`.
  The source lives in the curriculum repo at
  [`samples/m3-claude-code/`](https://github.com/ramboz/agentic-learning-path/tree/main/samples/m3-claude-code).
  From Module 4 onward, this same codebase is the target that PR
  Assistant reviews. For this lab, you're just learning Claude Code
  mechanics on it.

## Setup

1. Install Claude Code per the [current docs](https://docs.claude.com/en/docs/claude-code/overview).

2. Get the sample. Clone the curriculum repo (or copy the sample
   subdirectory elsewhere — it's self-contained):

   ```
   git clone https://github.com/ramboz/agentic-learning-path.git
   cd agentic-learning-path/samples/m3-claude-code
   npm install
   ```

3. Verify it works:

   ```
   npm test
   echo "# Hello" | node bin/md2html.js
   ```

   The tests should pass. The pipe should produce HTML containing
   `<h1>Hello</h1>`.

4. Start a Claude Code session inside the sample:

   ```
   claude
   ```

5. Sanity-check the install: ask Claude to describe the project. If the
   response makes sense, you're set up. If it's wildly off, check that
   you started Claude Code from inside `samples/m3-claude-code/` and that
   the starter `CLAUDE.md` is being picked up.

A note on `CLAUDE.md`: the one in `samples/m3-claude-code/` is deliberately minimal.
Resist the urge to expand it before doing the lab. Module 4 covers when
and how to grow it. Working with a thin one is part of the point. You're
about to feel where its absences cost you, which is the motivation for M4.

## The tasks

Four tasks, in order. Each one ratchets up the autonomy and the failure
surface. Try not to skip ahead. The early ones are calibration for the
later ones.

### Task 1: read-only

**Prompt to try, roughly:**

> Summarize the structure of this project. Then identify one piece of
> code that would benefit from a comment, and tell me what the comment
> should say.

**No edits.** If Claude proposes one, decline.

**What to notice:**

- How many file reads did Claude do? Did it navigate efficiently or read
  more than it needed to?
- Did the starter `CLAUDE.md` give it enough orientation, or did it have
  to reconstruct things from scratch?
- The function it picked for the comment suggestion: was it the one
  *you* would have picked? (Hint: there's at least one undocumented
  internal helper. If Claude found it, the file structure was clear.)

**Time:** 5-10 minutes. This is a warm-up. Don't get precious about it.

### Task 2: single-file edit

**Prompt to try, roughly:**

> Add a JSDoc comment to the `addRelNoopener` helper in `lib/sanitize.js`
> explaining what it does and why.

This is a small, contained change. Approve the plan, watch the edit,
then run `npm test` to confirm nothing broke.

**What to notice:**

- Did Claude's plan match what you wanted? If you'd waved through the
  plan without reading, would the edit have surprised you?
- Was the comment Claude wrote actually useful, or was it restating the
  function name in prose? (The latter is a thing Claude does. Calling it
  out is part of the M1 specification frame.)
- After the edit, run `git diff`. Did anything change beyond what you
  expected? (Whitespace, imports, unrelated lines.)

**Time:** 10-15 minutes.

### Task 3: multi-file change with planning

**Prompt to try, roughly:**

> Add a `--no-color` flag that suppresses any terminal coloring in error
> output. Use plan mode. Don't edit yet.

Note: there's no terminal coloring in the current code. Claude has to
either (a) introduce a coloring library so the flag has something to
turn off, (b) add a flag that's a no-op for now, or (c) push back and
say the flag isn't needed. All three are valid responses. The lab is
about how you handle the response, not about which one is "right."

Use plan mode. Read the plan carefully before approving anything. If the
plan is vague or makes a choice you don't like, **reject it** and ask
for a more specific one (or for a different approach).

**What to notice:**

- How often did you push back on the plan before approving?
- Did pushing back produce a tighter plan, or did Claude just reword the
  same thing? (The first means the original plan was vague. The second
  means the spec needed more from you.)
- Once you approved, were the edits cleaner because the plan was tight?
- Did `npm test` still pass? If a test changed, was that intended?

**Time:** 15-25 minutes. Most of that should be in the planning back-and-forth.

### Task 4: open-ended task with permissions awareness

**Prompt to try, roughly:**

> Clean up the dependencies in this project. Remove anything unused,
> update versions where it's safe, and let me know if anything is
> outdated.

This is open-ended on purpose. There are several reasonable directions
Claude can take, and at least one of them will propose a command that
mutates state in your repo (`npm uninstall`, `npm update`, `npm audit
fix`, edits to `package.json`, regenerating the lockfile, and so on).

**Watch the command approvals.** Don't autopilot. For each command
Claude proposes:

- What does it do? (If you don't know, ask Claude before approving. Or
  look it up.)
- Is it reversible? `npm uninstall <pkg>` is recoverable in the sense
  that you can reinstall, but the side effects on `package.json` and
  `package-lock.json` are state changes you'll have to revert via git.
- Does it touch anything outside this repo? (Most npm commands don't.
  Some, like `npm install -g`, do.)

**Optional step before you start:** run `git status` and `git diff` so
you have a clean baseline. After Task 4, run them again. Anything in the
diff that you didn't consciously approve is a calibration data point.

**What to notice:**

- Where did you intervene? Was it at the plan stage, on a specific edit,
  or on a command?
- Did you reject anything? If so, did Claude respond cleanly, or with
  pushback that suggested it had a context gap?
- Were any of the proposed actions surprising in retrospect, even ones
  you approved?

**Time:** 15-25 minutes.

## Calibration pass

10 minutes at the end. Don't skip this. The tasks were instrumentation;
this is the learning.

For each task, answer briefly:

1. What was the most attention-worthy moment? Plan, edit, or command?
2. Was your default permissions setting right for this task, too tight,
   or too loose?
3. If you ran the same task tomorrow with what you've learned, what's
   one thing you'd do differently?

Then for the lab as a whole:

4. Where did you catch yourself approving on autopilot, even briefly?
5. Where did you intervene that, in retrospect, was unnecessary?
6. What would you change about the starter `CLAUDE.md` based on what you
   saw the agent struggle with? Hold this thought; Module 4 picks it up.

## Common traps

The four mentioned in the module's lab section are worth re-stating here
because they're easy to fall into mid-flow:

- **Approving everything without reading.** The point of the lab is the
  noticing. If you're hitting "yes" without reading, slow down.
- **Spending too long on Task 1.** It's a warm-up. Five to ten minutes.
- **Skipping the calibration pass.** It's most of the learning.
- **Treating Task 4 as a "make it work" exercise.** It's a "watch
  carefully" exercise. A clean rejection is a good outcome.

## Optional worksheet

If taking notes inline helps, copy this template into a scratch file and
fill it as you go. Not required.

```
TASK 1: read-only
  File reads taken: ___
  Function picked for comment: ___
  Anything surprising: ___

TASK 2: single-file edit
  Plan matched intention? ___
  Comment quality (useful / restating the name): ___
  git diff after: ___

TASK 3: multi-file change with planning
  How many plan-rejections before approval: ___
  Did rejections tighten the plan: ___
  Tests still pass: ___

TASK 4: open-ended with permissions awareness
  Most attention-worthy moment: ___
  Did I reject anything: ___
  Anything in git status I didn't expect: ___

CALIBRATION
  Where I autopiloted: ___
  Where I over-intervened: ___
  Change to CLAUDE.md I'd make: ___
```

## When you're done

You should have:

- A working Claude Code setup
- A feel for the plan/edit/exec loop and where each phase needs your
  attention
- A personal answer to "is my permissions setting too tight, too loose,
  or about right for this kind of work?"
- One concrete thought about what's missing from the starter `CLAUDE.md`

That last item is the bridge into Module 4, which is about writing a
`CLAUDE.md` that earns its keep. The thing you wished was in this
lab's `CLAUDE.md` is, almost by definition, the kind of thing Module 4
will tell you to put there.

## Extension, optional

Run Task 4 again with a deliberately tighter permissions config (every
command needs approval, no exceptions). Then once with a deliberately
looser one. The point is calibration: you're not picking a permanent
posture, you're learning what each setting buys and costs. 15 minutes if
you do it.