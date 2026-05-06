---
title: Lab — Decompose PR Assistant into persona sub-agents and skills
description: Self-paced ~2-hour exercise for Module 6. Add two skills and three persona sub-agents to the PR Assistant, then run an orchestrated review.
sidebar_label: Lab
pagination_label: M6 Lab — Sub-agents and Skills
---

# Lab — Decompose PR Assistant into persona sub-agents and skills

[Module 6](../) lab. ~2 hours. Self-paced. No submission, no review.

The lab adds the on-demand and isolated layers to PR Assistant's existing rules structure. You'll build two skills for recurring tasks and three persona sub-agents for the review itself, then run the same PR through three states: rules-only (the M5 baseline), skills-added, and three-agent crew. The comparison is the artifact.

The `.claude/rules/` structure from [Module 5](../../m5-rules/lab/) is the starting point. This lab adds two skills and three persona sub-agents on top of it. [Module 7](../../m7-oracle/) inherits the three agents and builds the oracle exit signal on top of them.

## Before you start

- **Time:** ~2 hours total. The skills steps (Steps 2–4) go quickly; the sub-agent orchestration (Steps 6–8) is where most of the learning lives. Don't rush Steps 5 and 8.
- **Prerequisites:** [Module 5](../../m5-rules/) lab done, with `.claude/rules/api.md`, `.claude/rules/tests.md`, and `.claude/rules/markdown.md` in place. Claude Code installed and working.
- **What you'll work on:** The PR Assistant sample repo at [github.com/ramboz/pr-assistant-lab](https://github.com/ramboz/pr-assistant-lab). The M6 additions include a new `src/reviewer/` subsystem and a new mock PR branch.

## Setup

1. Pull the latest from the upstream repo to get the M6 additions:

   ```
   cd pr-assistant-lab
   git fetch origin
   git checkout main && git pull
   git checkout mock-pr/add-review-engine && git checkout main
   ```

   Verify `src/reviewer/` exists on `main` and `mock-pr/add-review-engine` is available locally. If either is missing, the upstream hasn't shipped them yet; file an issue.

2. Create the new directories:

   ```
   mkdir -p .claude/skills .claude/agents
   ```

3. Verify M5's rules are still in place:

   ```
   ls .claude/rules/
   ```

   You should see `api.md`, `tests.md`, and `markdown.md`. If they're missing, complete [Module 5](../../m5-rules/lab/) before continuing. This lab builds on that structure.

A note on the starting point: this lab assumes you finished [Module 5](../../m5-rules/lab/) including the calibration pass. If your `.claude/rules/` files exist but weren't tested against the M5 mock PRs, run a quick verification session before starting. Deploying agents on top of untested rules produces noise, not signal.

## The exercise

### Step 1: Run a review with just the rules (the baseline)

Check out `mock-pr/add-review-engine`. Fresh Claude Code session. Ask for a review of the diff against `main`. Note:

- What rules loaded? (Use context inspection to verify.)
- What did the review catch?
- What didn't it catch, or what felt shallow?

Don't help the model. The gaps are the data this baseline is here to show.

**Time:** ~15 minutes.

### Step 2: Add `/pr-summary`

Create `.claude/skills/pr-summary.md` with a body that gives a five-step procedure:

```markdown
---
description: Summarize a PR diff in a short structured block
---

# pr-summary

1. Read the diff against main.
2. Identify the primary change type: feature, bugfix, refactor, or docs.
3. Summarize in three sentences: what changed, what it enables, what might break.
4. List each changed file with a one-line note on why it changed.
5. Output as a labeled block: **Type**, **Summary**, **Files**.
```

Invoke `/pr-summary` in a fresh session on the same branch. Observe:

- The skill loaded only when invoked; the rules still loaded automatically for file matches.
- The skill ran visibly in the main conversation; you could watch each step.
- The rules and the skill didn't interfere with each other.

**Time:** ~15 minutes.

### Step 3: Add `/explain-code`

Create `.claude/skills/explain-code.md` with a body that walks through a named function or file:

```markdown
---
description: Explain what a function or file does, what it depends on, and what would break if it changed
---

# explain-code

The user will name a file or function. Do this:

1. Read the named target.
2. Describe what it does in two sentences.
3. List its direct dependencies (imports and callers).
4. Describe what would break if it were removed or its interface changed.
5. Output as: **What it does**, **Depends on**, **Breaks if changed**.
```

Invoke it on `src/reviewer/index.ts`. The skill should give you a clear picture of the new subsystem's entry point before you write any agents.

**Time:** ~10 minutes.

### Step 4: Compare skills against the rules-only baseline

Run `/pr-summary` and `/explain-code` on the `mock-pr/add-review-engine` branch. Note:

- Did the skills surface anything the rules-only review missed?
- Did either skill do something that should have been a rule instead (convention enforcement vs deliberate workflow)?
- Was there anything you wanted as a skill but invoking it felt like more overhead than it was worth?

These notes are inputs to the reflection at the end.

**Time:** ~10 minutes.

### Step 5: Design the three persona agents

Before writing files, write the scope boundary for each agent in one sentence. Also decide the return format for all three before you write any of them.

For each agent, answer:

- What class of issues is this agent responsible for? (Be specific enough to exclude two-thirds of what a general reviewer would flag.)
- What is out of scope for this agent? (Name it explicitly; it goes in the instructions.)
- What is the return format? Numbered list, JSON, or markdown sections. Decide before building.

Standardizing the return format across all three agents is the structured output contract. It's easier to agree on it now than to reconcile three different shapes after the first run.

A starting structure:

```
Security reviewer:
  In scope: [...]
  Out of scope: [...]
  Return format: [...]

Performance reviewer:
  In scope: [...]
  Out of scope: [...]
  Return format: [...]

Readability reviewer:
  In scope: [...]
  Out of scope: [...]
  Return format: [...]
```

**Time:** ~15 minutes.

### Step 6: Create the security reviewer

Create `.claude/agents/security-reviewer.md`:

```markdown
---
name: security-reviewer
description: Reviews PR diffs for security issues. Read-only. Returns a numbered list of findings with file, line, and severity.
tools: [Read, Glob, Grep]
---

You are a security reviewer. Your job is to find security vulnerabilities in the code changes you're given.

Scope: authentication issues, injection risks, token handling, insecure defaults, missing input validation.
Out of scope: performance, readability, style.

For each finding, report: (1) file and line number, (2) issue class, (3) severity (high/medium/low), (4) one sentence on the risk. Return a numbered list. No commentary outside the list.
```

Keep `tools:` to `[Read, Glob, Grep]`. A reviewer that can only read cannot accidentally edit.

**Time:** ~15 minutes.

### Step 7: Create the performance and readability reviewers

Same structure as Step 6. Two files:

`.claude/agents/perf-reviewer.md`: scope to algorithmic complexity, unnecessary repeated work, caching gaps, and operations that scale poorly with input size. Out of scope: security, readability.

`.claude/agents/readability-reviewer.md`: scope to naming clarity, function length and single-responsibility, dead code, and structural issues that make the code hard to change. Out of scope: security, performance.

Both should use `tools: [Read, Glob, Grep]` and the same return format you chose in Step 5.

**Time:** ~15 minutes.

### Step 8: Run the orchestrated review

Fresh Claude Code session, on `mock-pr/add-review-engine`. Prompt the orchestrator:

```
Run the security-reviewer, perf-reviewer, and readability-reviewer agents on the diff at src/reviewer/.
For each agent, brief it: the diff adds a new PR review engine subsystem. Scope each agent to src/reviewer/ only.
Aggregate the results. If a finding appears in more than one review, mark it as cross-cutting.
```

Observe:

- Each sub-agent works in its own context; the main session receives summaries, not a replay of each agent's tool calls.
- The aggregation is the orchestrator's job, not any single agent's.
- The rules from `.claude/rules/` still load for the file changes, alongside the sub-agent results.

Note: the agents run sequentially here. Running them in parallel (separate worktrees, separate processes) is covered in [Module 10](../../../tier-3/m10-parallel/). Sequential is fine for now; the orchestration pattern is the same.

**Time:** ~20 minutes.

### Step 9: Compare across the three states

Re-read the outputs from Steps 1, 4, and 8 side by side.

- Did the three-agent crew catch more seeded issues than the rules-only run?
- Did any two agents flag the same issue with different labels? (This is expected; it's what "cross-cutting" is for.)
- Was there a finding that surprised you: something no rule would have caught automatically?
- Was there a finding in the rules-only run that no agent caught? (That's a gap worth noting.)

Check against `SEEDED-ISSUES.md` in the repo to see what was planted. The three agents have different scopes, so not all issues should appear in all reviews.

**Time:** ~15 minutes.

### Step 10: Reflection

Three sentences:

- One skill that earned its place as a skill (and why it belongs there rather than as a rule)
- One sub-agent scope boundary that was hard to draw (and what you settled on)
- One thing that would make the three-agent crew sharper without adding a fourth agent

**Time:** ~10 minutes.

## What you'll have at the end

- `.claude/skills/pr-summary.md` and `.claude/skills/explain-code.md`
- `.claude/agents/security-reviewer.md`, `.claude/agents/perf-reviewer.md`, `.claude/agents/readability-reviewer.md` with `tools:` restricted to `[Read, Glob, Grep]`
- A recorded rules-only review (Step 1), a skills-added review (Steps 2–4), and an orchestrated three-agent review (Step 8)
- A direct comparison across all three states, with notes on what each approach caught and missed

Keep all of these. [Module 7](../../m7-oracle/) picks up the three agents and builds the oracle exit signal on top of them.

## Common traps

- **Forgetting to brief the sub-agent in the delegation prompt.** Context isolation means each agent starts fresh. If you don't name the files and scope in the delegation, the agent has nothing grounded to work against. "Review the PR" is not a brief.
- **No structured output contract.** Agents that return whatever seems useful are hard to aggregate. Write the return format in the agent's instructions, not only in the delegation prompt. The delegation prompt may vary by session; the agent's instructions are stable.
- **Skill that does what a rule already does.** If the skill enforces a convention that should apply automatically whenever Claude is in the relevant code, it belongs in a rule. Skills are for workflows you invoke deliberately.
- **Tool list too permissive.** A reviewer with `Edit` access can modify files, not just report. Restrict to `Read`, `Glob`, `Grep` for analysis-only agents.
- **Overlapping agent scopes without stated boundaries.** Both the security reviewer and the readability reviewer might flag a 60-line function. That's not a problem if each agent's instructions say what it should and shouldn't flag. It is a problem if neither agent's instructions say anything about scope.
- **Treating Step 9 as optional.** The comparison is the main artifact of the lab. Skipping it means you've run three agents without learning what they added over the rules-only baseline.

## Optional worksheet

If notes inline help, copy this template into a scratch file. Not required.

```
STEP 1: Rules-only baseline
  Branch: mock-pr/add-review-engine
  Rules that loaded: ___
  Issues caught: ___
  Gaps noticed: ___

STEP 5: Agent scope design
  Security in scope: ___
  Security out of scope: ___
  Performance in scope: ___
  Performance out of scope: ___
  Readability in scope: ___
  Readability out of scope: ___
  Return format (all three): ___

STEP 8: Orchestrated review
  Security findings: ___
  Performance findings: ___
  Readability findings: ___
  Cross-cutting findings: ___

STEP 9: Comparison
  Caught by agents but not rules-only: ___
  Caught by rules-only but not agents: ___
  Cross-cutting (appeared in 2+ agents): ___
  Issues from SEEDED-ISSUES.md caught: ___ / ___

STEP 10: Reflection
  Skill that earned its place: ___
  Hard scope boundary: ___
  One improvement without a fourth agent: ___
```

## When you're done

Three states of PR Assistant are observable: rules-only (Module 5), skills-added, and three-agent crew. [Module 7](../../m7-oracle/) asks how you know when the review is good enough. The agents you built here are what the oracle will grade.

## Extension, optional

Add a fourth sub-agent: a "CLAUDE.md reviewer" that checks whether the PR should have updated any conventions or rules files and didn't. Scope it to `**/*.md` and `CLAUDE.md`. Use `tools: [Read, Glob]`. Observe whether it produces useful findings on `mock-pr/add-review-engine` (which adds new source files) vs. a code-only PR that doesn't touch docs.

This is the meta-reviewer pattern. [Module 9](../../../tier-3/m9-hooks/) formalizes it as a stop-hook that runs this agent before any PR can close.
