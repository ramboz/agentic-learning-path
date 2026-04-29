---
title: M4 — Writing a CLAUDE.md that earns its keep
description: File-based state as a design principle. Progress files, the .claude/ pattern, and pruning entries that don't earn their place.
pagination_label: M4 — CLAUDE.md
---

# Module 4 — Writing a CLAUDE.md that earns its keep

**Tier 2** — engineers primary; PMs/architects can read the concept post but the lab is engineer-track.
**Prerequisites:** [Module 1](../../tier-1/m1-prompting/) (Prompting as a design problem), [Module 2](../../tier-1/m2-context/) (Context is the product), [Module 3](../../tier-1/m3-claude-code/) (From chat to Claude Code).

Note: this is the first module on the engineer-only lab track. The concept post stays useful for PMs and architects who want the mental model without building it.

---

## Concept post

### Opening

The first CLAUDE.md I wrote tried to do too much. I treated it like a README: project description, install steps, conventions, file layout, a section on what not to touch, a section on running tests, every gotcha I'd hit during onboarding. Two screens of content, all in one file. The model didn't seem to use it well. Responses would either ignore the conventions I'd written down or quote them at me when they weren't relevant.

The second one I let Claude write. I pointed it at the codebase and asked it to produce a CLAUDE.md that would help future sessions orient themselves. What came back wasn't bigger. It was structurally different. The root file was short on prose and heavy on tables: links to detailed docs in a `.claude/` subdirectory, a quick "common tasks" section, a few load-bearing conventions. The detail had moved into referenced files, loaded only when the situation called for them.

That structure has held up. The CLAUDE.md in cwv-agent today still follows roughly that shape, and it's stayed maintainable largely because Claude itself has done most of the maintenance whenever I asked it to.

Which leaves a question worth asking up front. If Claude can write a useful CLAUDE.md mostly on its own, why is this module here? Because evaluating "is this entry earning its place" is a skill, and the file is loaded into every session whether it earns the cost or not. The mechanics matter even when the writing is mostly delegated. You're going to be reading what Claude produces and deciding what to keep, what to prune, and what to split out. That's the work.

### What this module covers

In a nutshell:

1. Why state belongs in files, not in conversations or in your memory
2. What CLAUDE.md does mechanically, beyond the [M3](../../tier-1/m3-claude-code/) sketch
3. The five categories of content that earn a place, with the test for each
4. What does not earn a place, and the cost of getting that wrong
5. Progress files: keeping multi-session work durable across sessions
6. Anti-knowledge: documenting what didn't work, at whatever layer fits
7. The failure-mode table for CLAUDE.md and progress files
8. The graveyard problem, and how to evolve a file without becoming it

The lab is a 2-hour exercise. You take the PR Assistant sample repo (the curriculum's anchor project, entering here), run Claude Code on it without a CLAUDE.md, watch the friction, write one, and run again. The before-and-after is the lab's main artifact.

This module assumes Modules [1](../../tier-1/m1-prompting/) through [3](../../tier-1/m3-claude-code/). [Module 2](../../tier-1/m2-context/)'s "context as workbench" is the foundation; this module is about the workbench tools that persist between sessions.

### The reframe: state belongs in files

[Module 2](../../tier-1/m2-context/) framed the context window as a workbench: stateless between calls, reset every turn except for what's literally in scope. That's the per-turn picture. Zoom out one level: every stable thing about your project is also state. Project conventions, where things live, what you've already decided not to do. None of it persists by default.

The lazy answer is to put it in your prompt. Re-paste it every session. Re-explain conventions when they come up. This works for an afternoon. It stops working the day you have to do it three times in a row. The friction is small, but it accumulates, and the part that eventually breaks is your willingness to keep doing it. You quietly stop pasting the conventions, and the model quietly stops following them.

The reframe: durable state belongs in files, not in your head and not in fresh prompts. CLAUDE.md is the simplest expression of this for project-level conventions. Progress files are the version for task-level state across multiple sessions. Anti-knowledge files are the version for things the model would otherwise rediscover and repeat.

This isn't a Claude Code idea. It's a design principle that Claude Code's CLAUDE.md happens to make easy. The principle generalizes: anything that matters across sessions belongs in a file. The file is read at session start. The model treats it as established context. You update it as the project evolves.

A useful frame: the session is a process. The files are the database. If you wouldn't store user data in process memory and expect it to survive a restart, you shouldn't store project decisions there either.

The corollary, which trips people up: a file is not free. Every line in CLAUDE.md is loaded into every session in the directory. The cost is attention, not tokens, and the budget is finite even when the token count is not. The reframe is "state in files, not heads." It is not "everything in files." [Module 2](../../tier-1/m2-context/)'s over-context warning applies here, just at a different scale.

### CLAUDE.md, mechanically

[Module 3](../../tier-1/m3-claude-code/) introduced CLAUDE.md as project-level persistent context. Quick mechanical recap before going deeper.

CLAUDE.md is a markdown file, conventionally at the repo root. Claude Code reads it automatically at session start. You can have multiple CLAUDE.md files scoped to subdirectories, in which case the model loads the ones relevant to the path you're working in. You can also reference other markdown files from CLAUDE.md (using `@filename.md` or just inline links), and the model will read those when the conversation calls for them.

The semantics matter. Content directly in CLAUDE.md is loaded every session, every turn. Content in referenced files is loaded when the model reaches for it, which is most of what you want for situational guidance.

A useful default structure:

- A root CLAUDE.md where the dense prose stays tight, navigation and reference tables are free to expand, and longer-form content lives in referenced files
- A `.claude/` or `docs/` directory with detailed docs for things sometimes needed
- References from the root file to those docs, so the model knows they exist and when to reach for them

"Tight prose" is fuzzy on purpose. The cwv-agent CLAUDE.md is around 175 lines, but most of that is navigation tables and code-path references; the dense conventions section is closer to 20 lines. The cost is in the prose the model has to read and attend to, not in the file's total line count. A 200-line file that's 80% tables and references is fine. A 60-line file that's all conventions stacked end-to-end might already be too much.

This is the same shape as the over-specifying section in [Module 1](../../tier-1/m1-prompting/) and the over-contextualizing section in [Module 2](../../tier-1/m2-context/), applied at the project level. Default to small for prose. Promote things in only when they earn it.

### What earns a place in CLAUDE.md

Five categories. Each has a one-line test you can run on a candidate entry.

**1. How to operate the project.** Install command, dev command, test command, lint command, build command. The mechanical "how do I run this" basics.

The test: would a new contributor need this on day one? If yes, it belongs.

**2. Project layout.** Where source lives, where tests live, what's authored vs. generated, the names of important top-level directories. Just enough that the model can navigate without three exploratory file reads.

The test: would the model need to grep for this otherwise? If yes, it belongs. Keep it to a sketch, not a full directory listing.

**3. Conventions and idioms.** Style preferences that aren't enforced by lint. Framework patterns specific to this codebase. The way error handling is done here. Things a senior engineer on this team would correct in code review.

The test: have you corrected the model on this more than once? If yes, codify it. If never, you don't yet know whether it's a real convention; wait until you do.

**4. Things to never touch.** Generated files, vendor directories, lock files, anything that looks editable but shouldn't be. Be specific with paths.

The test: if the model edited this file, would it cause a problem you'd have to clean up? If yes, name the path explicitly.

**5. Standing decisions.** Choices the project has already made and is not reopening. "We use X over Y because of Z." "We don't pull in new dependencies without discussion." "Module Z is being deprecated; don't extend it."

The test: have you, in a previous session, told the model "we're not doing that" about something it suggested? If yes, write the decision down. The model has no other way to know.

A worked example for shape, drawn from cwv-agent (the recurring example from earlier modules). The repo is a Claude Code agent that analyzes Core Web Vitals data. Its CLAUDE.md is structured as a navigation index. The root file is mostly tables pointing to detailed docs in a `.claude/` subdirectory, with a few sections of direct content for things every session needs.

The direct content covers, roughly: a "Quick Start" reading order for new contributors, a "Code & Configuration" section with key source file paths grouped by subsystem (orchestration, analysis, data collection, prompts), a short "Code Quality Standards" section with conventions and a few load-bearing guardrails, and a "Common Tasks" section with run commands.

The referenced content (full architecture, individual design decisions, research notes) lives in `.claude/architecture.md`, `.claude/design-*.md`, `.claude/research-*.md`. Loaded on demand when the conversation calls for them. Not in scope every session. The shape mirrors the phase-scoped context fix from [Module 1](../../tier-1/m1-prompting/)'s PR #68: don't load everything every time; load what the situation calls for. Same principle, different scope (project-level instead of sub-agent-level).

One specific entry in the conventions section is worth pulling out as a real example of anti-knowledge compressed into a guardrail:

```
USE withStructuredOutput() with Zod schemas for guaranteed JSON
  CRITICAL: Use method: 'jsonSchema' (camelCase), NOT 'json_schema' (v0.3 syntax)
```

The CRITICAL line is there because at some point we tried the v0.3 syntax, it failed, and we lost time figuring out why. Future sessions don't need to relearn this. That's the failed-approaches pattern at its smallest scale: one line, enough specificity to override the model's instinct, in a file that's loaded every session.

### What does not earn a place

Easier to enumerate by category, since the absence is the point.

- **Anything that changes per task.** This belongs in your prompt or a progress file, not CLAUDE.md.
- **Anything obvious from a thirty-second file read.** "This is a Node.js project" wastes lines if there's a `package.json` in the same directory.
- **Tutorials or explanations.** CLAUDE.md is not where the model learns the framework. If a convention needs explaining, the explanation lives somewhere else; CLAUDE.md states the rule and points there.
- **Things you said once in frustration.** Most one-off corrections aren't conventions. They're context the model lacked in that moment. Adding them as standing rules pollutes the file with cases that don't recur.
- **Anything aspirational.** "We should adopt X" is not a standing decision; it's a wish. The model will treat it as fact and act accordingly. Either commit to the rule or leave it out.

The principle underneath: CLAUDE.md is loaded every session. The cost of inclusion is paid every session. Include things whose value clears that cost, not things whose value clears the cost of writing them once.

### When CLAUDE.md isn't enough: progress files

CLAUDE.md handles the timeless. The current task is a different problem.

A typical mid-sized refactor takes more than one session. Maybe four. By session three, you need to remember: what's been done, what's pending, what's been tried and rejected, what open questions are still pending. Without a written record, that all lives in your memory and in scrollback. Both are unreliable, especially across days.

The progress file pattern is straightforward. A markdown file (often `progress.md`, `notebook.md`, or task-specific) that captures the state of a multi-session piece of work. Structure varies, but a useful template:

- **Goal.** One paragraph. What does done look like.
- **Status.** What's been completed, dated.
- **Pending.** What's next, in rough order.
- **Decisions made.** Choices you've already made along the way, brief.
- **Open questions.** Things you haven't decided yet, with whatever context you have.
- **Failed approaches.** Discussed at length below.

The model reads the file at session start (you ask it to, or you reference it from CLAUDE.md as "for current task state, see progress.md"). It updates the file as the work evolves, either at your request or as part of the workflow you've set up. You scan it when you come back the next morning and you know where you left off.

The relationship to CLAUDE.md is worth being explicit about. CLAUDE.md is global and durable: true across all tasks, evolves slowly. The progress file is local and ephemeral: true for this task, archived or deleted when the task is done. Mixing them is a common early mistake. You add task-specific status to CLAUDE.md, the file accumulates, and what should have been ephemeral gets baked into the durable layer.

Honest scoping: progress files pay back when the work spans several days and several sessions. For a one-afternoon task, the overhead doesn't earn its keep. The threshold I use, roughly: if I expect to come back to this tomorrow, I write a progress file. If I expect to finish today, I don't bother.

### Anti-knowledge: documenting what didn't work

Models repeat mistakes. Specifically, they gravitate toward the same wrong fix to a given problem. The reasons are mechanical. Training data over-represents some patterns. "Obvious" first-pass solutions are obvious because they're common, not because they're correct here. Across sessions, none of this is remembered.

You correct the model in session one. Session two, fresh context, same starting state, same first-pass solution. You correct it again. Session three. Same thing. The fix you keep proposing isn't getting through because the channel through which it could persist (your memory and the file system) isn't being used.

The pattern: write the rejected approach down, in a file loaded when the relevant work is in scope. The shape varies by where the anti-knowledge lives.

**As a guardrail in CLAUDE.md.** Short and imperative, in the conventions section. The cwv-agent LangChain example from above ("CRITICAL: Use camelCase, NOT v0.3 syntax") is one of these. Single line, enough specificity to override the model's instinct to reach for the wrong syntax. Use this when the rejected approach is a recurring trap likely to come up in many tasks.

**In agent-specific prompt context.** When the anti-knowledge is scoped to a particular domain or sub-agent, it belongs with that agent's context, not in the global CLAUDE.md. cwv-agent does this for CMS-specific patterns: each CMS has a context file under `src/prompts/contexts/` with its own anti-patterns documented. The agents that work in a given CMS load the relevant one. Agents working in a different domain don't carry the noise. Same idea as the phase-scoped context fix from [Module 1](../../tier-1/m1-prompting/), applied to anti-knowledge specifically.

**In a progress file's failed-approaches section.** When the anti-knowledge is scoped to a specific in-flight task rather than a project-wide convention. Rough template:

```markdown
## Failed approaches

### Tried: [approach name]
Why we tried it: [the reasoning at the time]
Why it didn't work: [specific failure, ideally reproducible]
Replaced with: [what's in scope now]
```

Three things make this work regardless of where it lives:

- **Specificity.** "Tried regex parsing, didn't work" is too vague to override the model's instinct to reach for regex. Name the actual edge case that broke it.
- **Reasoning.** Without the why, the model can't tell if a similar case is in scope. With the why, it can decide.
- **The replacement.** Naming what was used instead is the positive signal that paired with the negative one closes the loop.

The cost of maintaining anti-knowledge is low: a paragraph or a bullet, written in the moment when the failure is fresh. The cost of not maintaining it is high. Every fresh session restarts the same dead ends.

### Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Model ignores a convention you wrote into CLAUDE.md | Buried mid-file, or stated as a suggestion not a rule | Move toward the top; restate as imperative |
| Model edits a generated file as if it were source | "Never touch" entry missing or unclear | Add explicit "never edit X" with the path |
| Model repeats the same wrong fix across sessions | No anti-knowledge written down; correction lives in your memory | Encode the rejected approach at the right layer (CLAUDE.md, agent prompt, or progress file) |
| Model spends three turns finding the test command | Layout or operations section missing | Add a short "how to run" near the top of CLAUDE.md |
| Quality drops compared to a chat that knows less | CLAUDE.md prose is bloated; signal lost in noise | Prune entries that don't earn their keep; split into referenced files |
| The model "forgets" the task across a fresh session | No progress file; state lived only in conversation | Create a progress file; reference it from CLAUDE.md |
| Different sub-trees need different conventions but everything is in the root file | Single CLAUDE.md doing too much | Split with directory-scoped CLAUDE.md files |
| Stale entries you keep meaning to clean up | No deletion discipline; the file accumulates | Treat CLAUDE.md as code; prune as part of normal work |
| Model ignores a "do not do X" rule you added last week | Rule stated negatively without context | Add the reason; the model needs the why to apply the rule to similar cases |

The meta-move stays the same as the previous modules: before blaming the prompt or the model, check what's in the file. Most disappointing Claude Code outputs in a long-running project come from a CLAUDE.md or progress file that's stale, bloated, or missing the load-bearing entry. The check is cheap. The fix is usually a five-minute edit.

### The graveyard problem

The mirror-image failure mode. [Module 1](../../tier-1/m1-prompting/) had over-specifying. [Module 2](../../tier-1/m2-context/) had over-contextualizing. The CLAUDE.md version is the graveyard: a file that has accumulated every constraint you ever needed to clarify once, with no deletion discipline.

Symptoms: a dense prose section you can't skim in under a minute, sections labeled "old" or "deprecated," entries you can't remember why you added, the same point stated three times in different words, conventions that contradict each other. The fix is the same shape as the over-context fix from [Module 2](../../tier-1/m2-context/). Treat the file as code. Prune entries that don't earn their keep. The test: if you removed this entry, would the next session degrade?

Honest pull-back: I haven't hit the graveyard hard in my own work, and I think the reason is that Claude has done most of the maintenance. When I let it author or restructure CLAUDE.md, it tends to produce something tighter than what I'd leave to grow on its own. The navigation-index structure from the opening helps too, since most of the volume can never accumulate in the prose layer in the first place: it's in referenced files that only load when needed.

Both of those are mitigations, not guarantees. If you write CLAUDE.md by hand and never let Claude prune it, the graveyard is the default end state. Two habits prevent it. First, ask Claude to review and tighten the file periodically, especially after a stretch of additions. Second, when you're tempted to add a one-off correction as a permanent rule, pause and ask whether the same correction would apply in three other sessions you can imagine. If you can't think of three, leave it out.

### Bridge to Module 5

CLAUDE.md and progress files give you durable, project-level state. They're the simplest application of file-based state: one project, one CLAUDE.md, one task, one progress file. Read at session start, updated as work proceeds.

The next step up is when the work itself is too large for a single Claude session to hold without losing the thread. You start wanting specialized agents (one to plan, one to write, one to review, one to run tests), each with its own scoped instructions and its own scoped tool access. The same file-based state principle applies, but now the files are scoped per agent. Sub-agents are markdown files with their own task descriptions and their own permissions. [Module 5](../m5-subagents/) picks up there: how to decompose work into sub-agents within a single session, when to do it, and when to leave the work to a single Claude.

This is also where the curriculum's anchor project, PR Assistant, gets decomposed for the first time. The lab in this module gets you to one Claude Code session with a CLAUDE.md reviewing PRs. [Module 5](../m5-subagents/)'s lab splits that into three persona reviewers (security, performance, readability), each as a sub-agent.

### TLDR

1. **State belongs in files, not in your head or in fresh prompts.** CLAUDE.md is the simplest expression for project conventions; progress files extend the principle to multi-session work; anti-knowledge files extend it to things the model would otherwise rediscover.
2. **CLAUDE.md prose is loaded every session. Every line of it costs attention.** Default to small for prose. Tables and references are nearly free; what costs is the dense conventions section. Promote content into the prose layer only when it clears the recurring cost.
3. **Five categories earn a place: operations, layout, conventions, never-touch, standing decisions.** Each has a one-line test. Most candidate entries fail at least one.
4. **Progress files handle task-state across sessions.** CLAUDE.md is durable and global; progress files are ephemeral and local. Mixing them is the most common early mistake.
5. **Anti-knowledge belongs at whatever layer fits the scope.** A guardrail in CLAUDE.md for project-wide traps, agent-specific prompts for domain-scoped patterns, a failed-approaches section in progress files for in-flight tasks. Without it, every fresh session restarts the same dead ends.
6. **The graveyard is the mirror-image failure.** Letting Claude help maintain the file mitigates it; the navigation-index structure mitigates it further. Neither is a guarantee. Treat CLAUDE.md as code.
7. **The discipline transfers from Modules 1 through 3.** Specify well, manage context, scope tightly. The medium changed; the job didn't.

### Lab handoff

The lab for this module introduces the curriculum's anchor project: PR Assistant. You'll clone the sample repo, run Claude Code on it without a CLAUDE.md, watch the friction, write one, and run again. The before-and-after comparison is the artifact you keep. ~2 hours, self-paced. Lab spec at [./lab/](./lab/).

---

## References

- **Anthropic's CLAUDE.md guidance.** Official notes on the file's mechanics, scoping, and recommended structure. The closest thing to canonical reference. `https://docs.claude.com/en/docs/claude-code/memory`
- **Claude Code documentation overview.** Broader doc set covering settings, permissions, and the `@filename.md` reference syntax used in CLAUDE.md. `https://docs.claude.com/en/docs/claude-code/overview`
- **Geoffrey Huntley on CLAUDE.md patterns.** Practitioner notes on what's worked and what hasn't in real Claude Code projects. Concrete examples; useful counterweight to vendor docs. `https://ghuntley.com/`
- **Simon Willison on agentic coding workflows.** Ongoing notes that include CLAUDE.md examples and progress-file patterns from real projects. `https://simonwillison.net/tags/claude-code/`
- **The cwv-agent repo.** Real CLAUDE.md and the `.claude/` referenced-docs structure described in the concept post. Skim it for shape, not content. `https://github.com/ramboz/cwv-agent`
- **PR Assistant sample repo.** The lab's working repo, with seeded issues and the starting state intentionally missing a CLAUDE.md. `https://github.com/ramboz/pr-assistant-lab`
