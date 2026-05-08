---
title: Lab — Refactor PR Assistant's CLAUDE.md into path-scoped Rules
description: Self-paced 2-hour exercise for Module 5. Decompose the M4 CLAUDE.md into .claude/rules/, run the same review, observe which rules actually loaded.
sidebar_label: Lab
pagination_label: M5 Lab — Rules
---

# Lab — Refactor PR Assistant's CLAUDE.md into path-scoped Rules

[Module 5](../) lab. ~2 hours. Self-paced. No submission, no review.

The point of this lab is to feel the difference between always-loaded and path-loaded by splitting your [Module 4](../../m4-claude-md/lab/) CLAUDE.md and watching which rules show up for which file changes. The Module 4 CLAUDE.md is the input. The output is a thinner CLAUDE.md plus a `.claude/rules/` directory, validated by reviewing two mock PRs scoped to different subtrees.

This is the second slice of the PR Assistant arc. [Module 6](../../m6-subagents-skills/) inherits the rules structure and adds skills and persona sub-agents on top.

## Before you start

- **Time:** ~2 hours total. Steps 1 (split plan) and 8 (comparison) are where most of the learning lives. Don't rush either. The mechanical steps in the middle (creating the rules files) go quickly once the plan is right.
- **Prerequisites:** [Module 4](../../m4-claude-md/) finished, with the CLAUDE.md you wrote in the lab still in place. Claude Code installed and working. The plan/edit/exec loop should feel familiar.
- **What you'll work on:** The PR Assistant sample repo at [github.com/ramboz/pr-assistant-lab](https://github.com/ramboz/pr-assistant-lab), continuing from where Module 4 left it. The repo grew at M5: it now has a `src/api/` subsystem (GitHub REST client) and two new mock PR branches scoped to disjoint subtrees: `mock-pr/api-rate-limiting` (changes confined to `src/api/`) and `mock-pr/tests-fixture-overhaul` (changes confined to test files). Pull the latest before starting.

## Setup

1. Pull the latest from the upstream repo to get the Module 5 structure (`src/api/` plus the two new mock PR branches):

   ```
   cd pr-assistant-lab
   git fetch origin
   git checkout main && git pull
   git checkout mock-pr/api-rate-limiting && git checkout mock-pr/tests-fixture-overhaul && git checkout main
   ```

   Verify both branches exist locally and `src/api/` is present on `main`. If either branch is missing, the upstream hasn't shipped them yet; file an issue.

2. Snapshot your Module 4 CLAUDE.md so you can compare against it later:

   ```
   cp CLAUDE.md CLAUDE.md.m4-baseline
   ```

   Don't commit the snapshot. It's a personal reference for the comparison step.

3. Verify Claude Code still works in the repo. Open a session and confirm the snapshot CLAUDE.md still loads at session start.

A note on which CLAUDE.md is the starting point: this lab assumes you finished [Module 4](../../m4-claude-md/lab/) end-to-end, including the calibration pass. If your CLAUDE.md is still the first draft, run the calibration step before starting Module 5. Splitting an unpruned file produces unpruned rules.

## The exercise

### Step 1: Identify split candidates

Open the snapshot CLAUDE.md. For each entry, ask: does this apply to one subtree of the codebase, or to everything?

- _Apply everywhere_ entries: operations (run/test/lint commands), top-level layout, never-touch lists, standing decisions. These stay in CLAUDE.md.
- _Apply to one place_ entries: conventions for API code, test conventions, doc style, anything keyed to a directory. These are split candidates.

Write down the split plan in plain text. Three columns: entry, target file, glob. Don't create files yet. The plan is the thinking; the files are the typing.

**Time:** ~15 minutes.

### Step 2: Create `.claude/rules/api.md`

Create the directory if it doesn't exist (`mkdir -p .claude/rules`). Add a file with frontmatter and the API-only entries from your split plan:

:::example

```markdown
---
paths: src/api/**
---

# API conventions

[entries from your split plan, e.g. error handling, token handling via auth.ts, never inline GITHUB_TOKEN, always pass a fetchImpl in tests]
```

:::

Keep the body short. The same "earns its place" discipline from [Module 4](../../m4-claude-md/) applies; a rule body that's too long is the same failure mode as a bloated CLAUDE.md.

**Time:** ~10 minutes.

### Step 3: Create `.claude/rules/tests.md`

Same shape, different glob. PR Assistant keeps tests co-located, so the glob targets `*.test.ts` files anywhere in the tree:

:::example

```markdown
---
paths: "**/*.test.ts"
---

# Test conventions

[entries from your split plan, e.g. Vitest not Jest, fixtures via factories not shared mutables, mock fetch via fetchImpl option, no real network calls]
```

:::

If you ever add a top-level `tests/` tree later, you can extend this to a list (`["tests/**", "**/*.test.ts"]`) without touching the rule body.

**Time:** ~10 minutes.

### Step 4: Create `.claude/rules/markdown.md`

The rendering subsystem (`src/markdown.ts`, `src/toc.ts`, etc.) has its own conventions: how the inline renderer composes, what gets escaped where, the relationship between the line scanner and TOC generation. These don't apply to the API or to tests, so they earn a path-scoped rule:

:::example

```markdown
---
paths:
  - src/markdown*.ts
  - src/toc*.ts
---

# Markdown rendering conventions

[entries from your split plan, e.g. always run inline content through escapeHtml before pattern replacements, headings beyond h3 need explicit handling, never bypass sanitizeHtml in renderPost]
```

:::

The PR Assistant repo has no `docs/` tree, so a docs-style rule has nothing to scope against; the markdown rule fills the same slot in the api/tests/markdown trio. If your version of the M4 CLAUDE.md had documentation conventions in it, those entries are project-wide noise here; consider promoting them back to CLAUDE.md or dropping them.

**Time:** ~10 minutes.

### Step 5: Trim the root CLAUDE.md

Open CLAUDE.md and remove the entries that just moved into rules. What should remain:

- Operations (test, build, lint commands)
- Top-level layout (one-line directory map)
- Never-touch list
- Standing decisions
- A short navigation pointer to `.claude/rules/` so a reader of CLAUDE.md knows the rules exist

The trimmed file should be visibly shorter than the snapshot. If it isn't, you've either kept entries that should have moved or you've duplicated entries into both rules and CLAUDE.md.

**Time:** ~10 minutes.

### Step 6: Run review on `mock-pr/api-rate-limiting`

Check out the API mock PR branch and ask Claude Code to review it. Fresh session, no carryover from earlier turns.

```
git checkout mock-pr/api-rate-limiting
```

Then in Claude Code: ask for a review of the diff against `main`. While the review runs, inspect the working context (`/context` or whatever the current Claude Code surface exposes for inspecting loaded files) and note:

- Did `rules/api.md` load?
- Did `rules/tests.md` load? (It should, since the diff includes `src/api/rate-limiter.test.ts` and `src/api/github.test.ts`.)
- Did `rules/markdown.md` stay dormant?
- Were any conventions from the rules visibly applied in the review? Did the review catch the seeded issues in the rate limiter?

Don't help the model. The friction (or lack of it) is the data.

**Time:** ~20 minutes.

### Step 7: Run review on `mock-pr/tests-fixture-overhaul`

Switch branches and repeat:

```
git checkout mock-pr/tests-fixture-overhaul
```

Fresh Claude Code session. Same review prompt. Same context inspection. Same notes:

- Did `rules/tests.md` load?
- Did `rules/api.md` stay dormant?
- Did `rules/markdown.md` stay dormant?
- Were the test conventions visibly applied? Did the review catch that the fixture file ships under `src/` and imports from production code?

The expectation is asymmetric: in Step 6 the API and tests rules both load (diff touches both subtrees); in Step 7 only the tests rule loads. That asymmetry is the path-scoping working as designed. If the API rule loads in Step 7, the diff drifted (verify with `git log main..HEAD --stat`) or the API glob is too broad.

**Time:** ~20 minutes.

### Step 8: Compare against the Module 4 baseline

Re-read the two reviews from Steps 6 and 7. Then re-read your Module 4 review notes (or rerun against the Module 4 baseline if you didn't keep notes).

- Did review quality hold up with the slimmer CLAUDE.md? Anything missed in Module 5 that Module 4 caught?
- Anything caught in Module 5 that Module 4 missed (because the rule made the convention sharper)?
- Was the always-loaded part of CLAUDE.md still doing its job? Did Claude still know how to run the tests, where the layout was, what not to touch?
- Anything _over-loaded_? Conventions appearing in the working context that didn't apply to the turn?

**Time:** ~15 minutes.

### Step 9: Reflection

Write three sentences:

- One rule that earned its split (and why)
- One rule that probably shouldn't have been split (and where you'd put the entries instead)
- One entry that surprised you in which file it ended up in (rule, CLAUDE.md, or unchanged)

**Time:** ~10 minutes.

## What you'll have at the end

- `.claude/rules/api.md`, `.claude/rules/tests.md`, `.claude/rules/markdown.md`, each with `paths:` frontmatter and a short, imperative body
- A trimmed root CLAUDE.md, visibly shorter than the Module 4 snapshot
- Two recorded review sessions (`mock-pr/api-rate-limiting` and `mock-pr/tests-fixture-overhaul`) with notes on what loaded
- A direct comparison against the Module 4 baseline

Keep all of these. [Module 6](../../m6-subagents-skills/) inherits this rules structure and adds skills and persona sub-agents on top.

## Common traps

- **Glob syntax errors that look correct.** `src/api/*.ts` matches only the top level of `src/api/`, not the routes underneath. Use `src/api/**`. The same trap shows up with `tests/*.test.ts` (only top-level tests) versus `tests/**/*.test.ts` (recurses).
- **One rule per file.** Over-splitting fragments the rules into noise. Group by concern, not by file. If two rules would have the same body, they should probably be one rule.
- **Cross-cutting conventions duplicated across three rules.** The duplication is a signal: the convention isn't path-scoped, it belongs in CLAUDE.md. The maintenance cost of three copies is real.
- **Writing rules without running to verify they load.** A rule that doesn't load is invisible to Claude. Inspect the working context after the first review; don't assume the glob does what it looks like it does.
- **Negative rules in the wrong place.** "Never extend the deprecated module" is a standing decision (project-wide), not a path-scoped rule. It belongs in CLAUDE.md, not in a rules file with a glob that only matches the directory you don't want touched.
- **Stripping CLAUDE.md too aggressively.** Operations, layout, never-touch, and standing decisions stay global. If your trimmed CLAUDE.md doesn't have a test command in it, you stripped too much.

## Optional worksheet

If taking notes inline helps, copy this template into a scratch file and fill it as you go. Not required.

:::example

```
STEP 1: Split plan
  Entry → target file → glob
  ____________________________
  ____________________________
  ____________________________
  Entries that stayed in CLAUDE.md: ___

STEP 5: Trimmed CLAUDE.md
  Line count before: ___
  Line count after: ___
  What stayed: ___

STEP 6: mock-pr/api-rate-limiting review
  Rules that loaded: ___
  Rules dormant: ___
  Conventions visibly applied: ___
  Seeded issues caught: ___

STEP 7: mock-pr/tests-fixture-overhaul review
  Rules that loaded: ___
  Rules dormant: ___
  Conventions visibly applied: ___
  Seeded issues caught: ___

STEP 8: Comparison
  Quality vs M4 baseline: ___
  Anything missed: ___
  Anything caught that M4 missed: ___
  Any over-loading: ___

STEP 9: Reflection
  Rule that earned its split: ___
  Rule that shouldn't have been split: ___
  Surprising placement: ___
```

:::

## When you're done

You should have a thinner CLAUDE.md, three rules files, and direct evidence (from the two reviews) that path-scoping changed which conventions loaded for which turns. If the two reviews looked the same and the same rules loaded for both, the globs are probably too broad; check the diffs.

That sets up [Module 6](../../m6-subagents-skills/), which picks up the on-demand half of the scoping picture: skills for reusable workflows you invoke deliberately, and sub-agents for specialists that work in their own context. The rules you wrote here stay; nothing gets thrown away.

## Extension, optional

Add a single skill to feel the on-demand contrast. The shape is roughly:

```
.claude/skills/pr-summary.md
```

with a body that captures the steps you'd take to produce a one-paragraph summary of a PR. Don't worry about getting the SKILL.md format exactly right; [Module 6](../../m6-subagents-skills/) covers that properly. The point of the extension is to feel the difference: the skill _doesn't_ load until you invoke it (e.g., `/pr-summary`), even though the file is right next to the rules. That's the trigger model the next module formalizes.

If you don't want to add the skill yet, leave it for Module 6. The lab's required path is rules-only.
