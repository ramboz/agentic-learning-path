---
title: M3 — From chat to Claude Code
description: The transition from browser chat to terminal-based agent. Plan/edit/exec loop, permissions, and CLAUDE.md as a teaser.
pagination_label: M3 — Claude Code
---

# Module 3 — From chat to Claude Code

**Tier 1** — for everyone (PMs, architects, engineers).  
**Prerequisites:** [Module 1](../m1-prompting/) (Prompting as a design problem), [Module 2](../m2-context/) (Context is the product).

Note: from M4 on, the labs are engineer-only. PMs and architects continue with concept posts through M4-6.

---

Early on with a performance monitoring project, one of the first things I needed was to gather field data — usage metrics, PageSpeed scores, web vitals exports. Each one needed a small script. In the early days I wrote them in chat, iterating toward a working artifact one turn at a time, answering the model's questions as we both discovered edge cases neither of us had planned for. The scripts worked. Getting there was a slog. Most of the turns were me ferrying details between the model and the code: paste the error, paste the next attempt, paste the next error.

When I moved the same work to Claude Code, the shape changed. The brainstorming and the edge-case discovery still happened, but they happened in a plan I could review before any code was written. Once the plan was right, execution mostly ran on its own. My job stopped being "type every change" and became "approve the ones that mattered." The total amount of attention was probably similar. The places it was now spent were the ones where my judgement was actually doing work.

## What this module covers

By the end of this module, you'll be able to:

1. Recognize when the chat interface starts to strain under codebase work, and know why Claude Code changes things
2. Understand the shift from "Claude as advisor" to "Claude as operator," and what it means for your job
3. Know what Claude Code actually does — what it reads, edits, and runs
4. Work with the plan/edit/exec loop and apply the brakes in the right places
5. Set up a first CLAUDE.md (Module 4 goes deep; this is the preview)
6. Configure permissions, and understand why they're the most important setting in the tool
7. Recognize failure modes specific to the operator role
8. Know when to reach for chat instead

The lab is a 90-minute setup-and-explore exercise. You install Claude Code on a small repo, run tasks of increasing autonomy, and watch where the loop strains.

From Module 4 on, the labs are engineer-only. PMs and architects get concept posts for Modules 4 through 6.

## The reframe: advisor vs. operator

In chat, Claude is your advisor. You bring it the problem, it suggests an approach, you do the work. The conversation is the medium and you are the bridge between any answer and any change in the world. If the suggestion is wrong, the cost is a few minutes of your time and a fresh prompt.

In Claude Code, Claude is your operator. It reads files directly. It edits them in place. It runs commands. The conversation still exists, but it's running alongside actions taken on your filesystem. If the suggestion is wrong, the cost can be that something is now broken on disk.

This shift is small to describe and large to live with. Three things change.

**The inputs change.** In chat, context is whatever you paste. In Claude Code, the filesystem is part of the context. The model can read any file in scope, follow imports, look at git history, run a command and read its output. Most of what would have been a paste is now a tool call.

**The outputs change.** Chat produces text. You decide what to do with it. Claude Code produces text and actions. Some of the actions are reversible (a file edit you can revert). Some are not (a command that mutates state in a service you don't control). Your job is no longer "did the answer help" but "should that action have been taken."

**Your job changes.** In chat, your job is to specify well and judge the response. In Claude Code, your job is to specify well, judge the planned actions, watch what's executed, and intervene when the agent drifts. The judging-actions part is new. It's also where most of the early mistakes happen. If you treat Claude Code like fast chat, you'll approve actions you wouldn't have endorsed if you'd read them first.

The advisor frame caps the damage from a bad turn. The operator frame doesn't, on its own. The discipline of permissions and the plan/edit/exec loop is what brings the cap back.

## How Claude Code works

### What Claude Code actually is

Mechanical introduction, kept brief because the documentation covers it well and any specific command will outlive this paragraph by a quarter at most.

Claude Code is a command-line tool. You install it (currently via npm), you cd into a repo, you start a session. From inside that session, the model has access to a set of tools: read files, edit files, run shell commands, search the codebase. Each tool call is mediated by a permissions system you configure (more on that below).

The session is interactive by default. You type a request, the model responds, sometimes by talking, sometimes by proposing an action. When it proposes an action you haven't pre-approved, it pauses and asks. You allow or deny. The conversation continues.

Two configuration files matter from the start:

- **CLAUDE.md** at the repo root. A markdown file the model reads at the start of every session. Persistent context: project conventions, where things live, what the test command is, what to never touch. Module 4 goes deep on this.
- **Settings file** controlling permissions. Which tools require approval, which are pre-approved, which directories are off-limits. This is the layer between the agent's intentions and your filesystem.

Everything else in this section is detail you can pick up in an afternoon. The conceptual surface area is small. The discipline of using it well is where the module spends its time.

### The plan/edit/exec loop

The loop has three phases worth naming because the failure modes differ across them.

**Plan.** The model describes what it intends to do. For small changes, this is a sentence. For larger ones, a proper plan with a sequence of steps, files to touch, and what success looks like. Plan mode in Claude Code makes this explicit (the model proposes, you review, no edits happen until you approve).

**Edit.** The model makes file changes. Each edit is visible. You can see the diff before it lands, after it lands, or both depending on configuration. The edits are local until you commit them, so even an edit you accepted is recoverable via git.

**Exec.** The model runs commands. Tests, builds, installs, scripts. Output comes back into the context and feeds the next turn. This is where actions can leave the local sandbox (a network call, a deploy, a destructive script) so it's the phase that earns the most caution.

The loop is iterative. Plan, edit, exec, observe, plan again, edit again. A non-trivial task often goes around it five or ten times before it lands.

The brakes you have inside the loop:

- **Reject the plan.** Cheapest place to intervene. If the plan is wrong, fix it before any edits happen. A bad plan with the right edits applied to it is still a wrong outcome.
- **Reject an edit.** Once the model has edited a file, you can still reject the change before continuing. Cheap, but slightly more annoying because you've already let the loop iterate once.
- **Reject a command.** Most important place to be alert. Commands can have effects beyond the current directory. A command you wave through because it "looks fine" is the one that surprises you.
- **Stop the loop.** The model is going around in circles, or has misunderstood something foundational? Stop the session, fix the context (often by editing CLAUDE.md or starting a new session with a corrected prompt), restart.

The single most useful habit inside the loop: read the plan before approving the first edit. If the plan is vague or wrong, the edits won't fix it, and you'll spend the rest of the loop nudging the model toward the goal you should have specified at the planning step.

## Configuration

### CLAUDE.md, briefly

A short tease, because Module 4 is the deep dive.

CLAUDE.md is a markdown file at the root of your repo (or in a subdirectory, scoped to that subtree). The model reads it at session start and treats it as part of the persistent context. Functionally, it's the project-files concept from [Module 2](../m2-context/), applied to a codebase.

What goes in a useful CLAUDE.md, at a sketch level:

- How to run the project: install command, dev command, test command
- Project layout: where things live, what's generated vs. authored
- Conventions: style preferences, framework idioms, anything that distinguishes this codebase
- Things to never touch: generated files, vendor directories, secrets
- Standing decisions: choices the project has already made and is not reopening

What does not belong in a useful CLAUDE.md: anything that changes per task, anything you'd expect a senior engineer to read once and not need again, anything that's obvious from a quick file read.

The over-context pattern from [Module 2](../m2-context/) applies directly here. A bloated CLAUDE.md costs attention on every turn. The pattern I've landed on is to keep CLAUDE.md itself short and reference other files for anything conditionally relevant, letting the model pull them in when the situation calls for it. [Module 4](../../tier-2/m4-claude-md/) covers what to put in the root file, what to split out, and how to evolve the structure as the project grows.

### Permissions

The permissions model is the most important configuration in Claude Code. It controls what the model can do without asking, what it has to ask for, and what it can never do at all.

The default posture, sensibly, is paranoid. File reads are usually fine. File writes need approval. Commands need approval. Network access needs approval. You can loosen this as you build trust with a specific project, and you can tighten it if you've been burned.

Three configurations worth considering deliberately:

**Strict.** Every action needs approval. Slow but safe. Right when you're new, when you're working on a codebase you don't know well, or when the cost of a mistake is high. The friction is real. It's also the friction that catches the action you would have regretted approving on autopilot.

**Calibrated.** Common safe actions pre-approved, anything that can mutate state outside the working directory still needs approval. The intended productive middle. Reading files, running tests, editing files within the project: pre-approved. Anything that touches a network, a database, or a filesystem path outside the repo: gated.

**Loose.** Most actions pre-approved. Productive when you trust the agent and the task is contained. Dangerous when either assumption is wrong. Reasonable for throwaway scripts. Not reasonable for production codebases, especially shared ones.

Honest disclosure: I haven't worked out a clean answer here yet. My current setup leans loose, mostly because the friction of approving every step wore me down before I built a proper workflow for managing permissions deliberately.

The specific shape of the drift, in my experience: you write a permission pattern to pre-approve a class of safe commands. The model finds a variant the pattern doesn't match, so you approve it once, then add a slightly broader regex. A few iterations of this and the patterns are mostly wildcards. Each step felt reasonable at the time. The result is a config that pre-approves more than you'd have written in one sitting if you'd started from scratch.

I don't have a clean fix to recommend. What I'd suggest, tentatively: when you find yourself adding the third wildcard to a pattern, that's the signal to stop and reconsider whether the underlying class of commands should be pre-approved at all, rather than pre-approve a broader version of it. The discipline I'm reaching for is "treat each broadening as a deliberate choice, not a maintenance task." I'm not consistently doing it yet.

## Failure modes and the move that fixes each

Most of the failure modes from chat carry over. Underspecified prompts, context gaps, attention dilution, all of it still applies. A few are new or sharpened by the operator role.

| Symptom | Diagnosis | Fix |
|---|---|---|
| Edited a file you didn't expect | Plan was vague, model resolved the ambiguity differently than you would have | Read the plan before approving the first edit; reject vague plans |
| Tests pass but the wrong thing changed | Acceptance criterion was "make tests pass," not "fix the underlying bug" | Specify the success condition in terms of behavior, not test status |
| Command did something destructive | Permissions were too loose, or you approved on autopilot | Tighten permissions; treat command approvals as the most attention-worthy step |
| Model loops on the same fix that doesn't work | Context insufficient to diagnose; model is guessing | Stop the loop. Read the failure yourself. Add the missing context, restart |
| Ignores CLAUDE.md conventions | File too long, or the conventions are buried | Tighten CLAUDE.md; put load-bearing conventions near the top |
| Edits a generated file as if it were source | "Do not touch" entries missing from CLAUDE.md or unclear | Add explicit "never edit X" entries; flag generated paths |
| Quality drops sharply mid-session | Context filled with command output and stale plans | Start a new session with a distilled summary; this is the [M2](../m2-context/) move applied to Claude Code |
| Spends most of the loop reading files | Codebase navigation is slow without orientation | Add a short layout section to CLAUDE.md; the model spending three turns to find a file is a context problem |

The meta-move stays the same as [M1](../m1-prompting/) and [M2](../m2-context/): before blaming the agent, check what you gave it. Permissions, plan quality, CLAUDE.md, the prompt itself. The list got longer. The discipline didn't change.

## When NOT to use Claude Code

A draft list to react against:

**Course-correcting mid-execution.** You're partway through running a plan, a question surfaces, and you start exploring it in the same session. Some of those questions are worth following. Some aren't. Either way, the conversation now holds the original plan, your brainstorming on the new direction, the half-formed alternative you're sketching, and the execution that was still in flight when you started thinking. Claude has all of it, undifferentiated.

The specific failure I've hit a few times: I think I'm brainstorming, but Claude is in execution mode, and starts applying my brainstorming as if I were updating the plan. By the time I notice, the agent has monkey-patched the original plan with whatever I happened to think out loud about. Not the agent's fault. My brain context-switched, and I didn't tell it.

The fix is to make the switch explicit. When a real question comes up mid-execution, step back to chat. Sketch the new direction there, decide which parts are worth keeping, formalize the updated plan, then bring it back to Claude Code and execute.

**Exploratory thinking.** When you're not sure what you want yet, chat is better. Claude Code's structure (plan, edit, exec) presumes you have a direction. If you don't, you'll spend the loop doing planning theater on a goal you're still figuring out. Use chat, work out what you want, then move to Claude Code with a clear specification.

**Architectural decisions.** Choosing between approaches, trading off frameworks, sketching a design. The output of this work is a decision and a justification, not code. Claude Code wants to write code. If the right outcome is a paragraph of reasoning, chat is the right interface.

**Reading-heavy work.** "Walk me through this codebase" is a chat task. The agent can do it in Claude Code, but you're paying for context and tools you don't need, and the answer is just text either way. If the only thing you'll do with the answer is read it, save the friction.

**Anything where the cost of a mistake is unbounded.** Shared production codebases, infra repos, anything where a wrong edit affects other people, deploy pipelines that touch real users. Claude Code can do this work, but the calibration of permissions and review needs to be tighter than the default, and most people aren't going to do that work every session. If the blast radius of a mistake is large, either pair-program with the agent in a much stricter mode, or do the work in chat and apply the changes yourself.

## Bridge to Module 4

The transition from chat to Claude Code surfaces one persistent file you'll touch repeatedly: CLAUDE.md. This module gave it a sketch. Module 4 makes it the subject.

A good CLAUDE.md is the difference between a Claude Code session that orients itself in 30 seconds and one that spends three turns figuring out where the test command lives. It's also the place where over-context bites hardest, because it's loaded into every session in the directory whether you remember it or not. Module 4 covers what earns a place in the file, what doesn't, and how to evolve it without it turning into a graveyard of every constraint you ever had to clarify once.

Past CLAUDE.md, `.claude/` grows. Tier 2 covers path-scoped rules (instructions that load only when Claude reads matching files), sub-agents (separate contexts that handle side tasks and return summaries), skills (reusable prompts and workflows that load on demand), and oracles (composite quality signals you can run as a script). Tier 3 adds hooks for unattended runs and MCP servers for external tools. You don't need any of it to start. The modules ahead introduce each piece roughly in the order most users find they need it.

For PMs and architects, this is where the hands-on labs end. The remaining concept posts (M4-7) are still worth reading; CLAUDE.md, scoping rules, sub-agents and skills, and oracles are mental models that come up in any conversation about how engineering teams use these tools. The labs are how engineers internalize them. The concepts apply more broadly.

## TL;DR

:::tldr

1. **Claude Code shifts the model from advisor to operator.** It has hands. The inputs, outputs, and your job all change. Treating it like fast chat is the most common early mistake.
2. **The plan/edit/exec loop is where the work happens, and the brakes live inside it.** Reject bad plans before approving any edits. Treat command approvals as the most attention-worthy step.
3. **Permissions are the most important configuration in the tool, and the hardest to keep honest over time.** Calibrated is the intended middle. Drift toward loose is easy and not always recoverable from on autopilot.
4. **CLAUDE.md is project-level persistent context.** Useful when tight, costly when bloated. Module 4 covers what earns a place.
5. **Most chat failure modes carry over.** A few are sharpened by the operator role: edits to unexpected files, destructive commands, loops the model can't escape without your intervention.
6. **Not every task wants Claude Code.** Course-correcting mid-execution, exploratory thinking, architecture decisions, reading-heavy work. Chat is often better. The interface should match the shape of the work.
7. **The discipline didn't change. The list got longer.** Specify well, manage context, watch the failure modes. Same job; more places to apply it.

:::

## Lab handoff

The lab is a setup-and-explore exercise. You install Claude Code, point it at a small sample repo, and run four tasks at increasing autonomy levels. The point isn't to ship anything; it's to feel where the plan/edit/exec loop strains and to calibrate your own sense of when to intervene. The lab is at [./lab/](./lab/).

---

## References

- [**Claude Code documentation**](https://docs.claude.com/en/docs/claude-code/overview). Official docs covering installation, configuration, permissions, and the plan/edit/exec mechanics. The single best reference for current syntax. Mechanical details change quarter to quarter; defer to docs over anything specific in this module.
- [**Anthropic's CLAUDE.md guidance**](https://docs.claude.com/en/docs/claude-code/memory). Official notes on what makes a useful CLAUDE.md and what to avoid. Pairs with [Module 4](../../tier-2/m4-claude-md/)'s deeper treatment.
- [**"How I Use Every Claude Code Feature" (Willison)**](https://simonwillison.net/2025/Nov/2/how-i-use-every-claude-code-feature/). Heavy-user tour of plan/edit/exec, permissions, and the smaller features the docs gloss over. Concrete examples to anchor the mechanics this module introduces.