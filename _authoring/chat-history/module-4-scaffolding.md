# Conversation with Claude

## Human (Apr 27, 2026, 4:42 PM):

Draft Module 4 scaffolding

We have done module 1-3 (which you have in the project context). Make sure to follow a similar structure and tone.

---

## Human:

# Module 4 — Writing a CLAUDE.md that earns its keep

**Tier:** 2 (engineers primary; PMs/architects continue with concept post only)
**Audience:** Engineers (PMs/architects can read concept post)
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** Module 1 (Prompting as a design problem), Module 2 (Context is the product), Module 3 (From chat to Claude Code)
**Standalone publishable:** Yes
**Ends with bridge to:** Module 5 (Sub-agents, one-session orchestration, and tool scoping)

Note: this is the first module on the engineer-only lab track. The concept post stays useful for PMs and architects who want the mental model without building it.

---

## Concept post

### Opening

[PLACEHOLDER — see hard parts #1] About six months into a project where I'd been using Claude Code daily, I went to debug something and realized I hadn't read my own CLAUDE.md in months. I opened it. Six hundred lines.

About a third was conventions I'd added when I was new to the codebase and no longer needed. Another third was "do not do this" entries from one-off corrections I'd added in frustration and forgotten about. The last third was actually load-bearing. Buried.

The model had been reading the whole thing every session. By the time the parts that mattered came up in attention, the rest of the file had eaten the budget. I'd been working around degraded responses for weeks, blaming my prompts, and the cause was sitting in a file I'd written myself.

The fix was a 90-minute prune. The lesson took longer to land. CLAUDE.md isn't a place to record everything you've ever had to clarify. It's a project-level spec, with all the discipline that implies: only what's still earning its place, organized so the load-bearing parts come first, kept short enough that you can read it without losing the thread.

This module is about writing one that earns its keep. And about the wider pattern underneath it: file-based state as a design principle, applied to a codebase you'll be working on for longer than a single session.

### What this module covers

In a nutshell:

1. Why state belongs in files, not in conversations or in your memory
2. What CLAUDE.md does mechanically, beyond the M3 sketch
3. The five categories of content that earn a place, with the test for each
4. What does not earn a place, and the cost of getting that wrong
5. Progress files: keeping multi-session work durable across sessions
6. The failed-approaches pattern, and why models specifically need anti-knowledge
7. The failure-mode table for CLAUDE.md and progress files
8. The graveyard problem, and how to evolve a file without becoming it

The lab is a 2-hour exercise. You take the PR Assistant sample repo (the curriculum's anchor project, entering here), run Claude Code on it without a CLAUDE.md, watch the friction, write one, and run again. The before-and-after is the lab's main artifact.

This module assumes Modules 1 through 3. Module 2's "context as workbench" is the foundation; this module is about the workbench tools that persist between sessions.

### The reframe: state belongs in files

Module 2 framed the context window as a workbench: stateless between calls, reset every turn except for what's literally in scope. That's the per-turn picture. Zoom out one level: every stable thing about your project is also state. Project conventions, where things live, what you've already decided not to do. None of it persists by default.

The lazy answer is to put it in your prompt. Re-paste it every session. Re-explain conventions when they come up. This works for an afternoon. It stops working the day you have to do it three times in a row. The friction is small, but it accumulates, and the part that eventually breaks is your willingness to keep doing it. You quietly stop pasting the conventions, and the model quietly stops following them.

The reframe: durable state belongs in files, not in your head and not in fresh prompts. CLAUDE.md is the simplest expression of this for project-level conventions. Progress files are the version for task-level state across multiple sessions. Failed-approaches files are the version for anti-knowledge — things the model would otherwise rediscover and repeat.

This isn't a Claude Code idea. It's a design principle that Claude Code's CLAUDE.md happens to make easy. The principle generalizes: anything that matters across sessions belongs in a file. The file is read at session start. The model treats it as established context. You update it as the project evolves.

A useful frame: the session is a process. The files are the database. If you wouldn't store user data in process memory and expect it to survive a restart, you shouldn't store project decisions there either.

The corollary, which trips people up: a file is not free. Every line in CLAUDE.md is loaded into every session in the directory. The cost is attention, not tokens, and the budget is finite even when the token count is not. The reframe is "state in files, not heads." It is not "everything in files." Module 2's over-context warning applies here, just at a different scale.

### CLAUDE.md, mechanically

Module 3 introduced CLAUDE.md as project-level persistent context. Quick mechanical recap before going deeper.

CLAUDE.md is a markdown file, conventionally at the repo root. Claude Code reads it automatically at session start. You can have multiple CLAUDE.md files scoped to subdirectories, in which case the model loads the ones relevant to the path you're working in. You can also reference other markdown files from CLAUDE.md (using `@filename.md` or just inline links), and the model will read those when the conversation calls for them.

The semantics matter. Content directly in CLAUDE.md is loaded every session, every turn. Content in referenced files is loaded when the model reaches for it, which is most of what you want for situational guidance.

A useful default structure:

- A short root CLAUDE.md, kept under a screen of text, with the things every session needs
- A `docs/` directory with longer files for things sometimes needed
- References from CLAUDE.md to those files, so the model knows they exist and when to read them

This is the same shape as the over-specifying section in Module 1 and the over-contextualizing section in Module 2, applied at the project level. Default to small. Promote things in only when they earn it.

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

A worked example for shape, drawn from cwv-agent (the recurring example from earlier modules). The repo is a Claude Code agent that analyzes Core Web Vitals data. Its CLAUDE.md root file fits on a screen and covers (roughly): the project's purpose in two sentences, how to run the agent locally, where the sub-agents live, the convention that sub-agents are markdown files with a specific frontmatter shape, a "never touch the cached test fixtures" entry, and a standing decision that the agent is single-user (no multi-tenancy considerations needed).

What's not in the root file: the long technical context about CMS-specific performance patterns. That lives in `docs/cms-context/`, split by CMS, and referenced from CLAUDE.md as "for CMS-specific guidance, see docs/cms-context/{cms}.md." The phase-scoped context fix from Module 1's PR #68 is the same pattern: don't load everything every time; load what the situation calls for.

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

The relationship to CLAUDE.md is worth being explicit about. CLAUDE.md is global and durable — true across all tasks, evolves slowly. The progress file is local and ephemeral — true for this task, archived or deleted when the task is done. Mixing them is a common early mistake. You add task-specific status to CLAUDE.md, the file accumulates, and three months later it's the 600-line graveyard from the opening.

Honest scoping: progress files pay back when the work spans several days and several sessions. For a one-afternoon task, the overhead doesn't earn its keep. The threshold I use, roughly: if I expect to come back to this tomorrow, I write a progress file. If I expect to finish today, I don't bother.

### The failed-approaches pattern

The single highest-leverage section in a progress file, and a pattern worth its own treatment.

Models repeat mistakes. Specifically, they gravitate toward the same wrong fix to a given problem. The reasons are mechanical. Training data over-represents some patterns. "Obvious" first-pass solutions are obvious because they're common, not because they're correct here. Partial results that look right reinforce the wrong direction. Across sessions, none of this is remembered.

You correct the model in session one. Session two, fresh context, same starting state, same first-pass solution. You correct it again. Session three. Same thing. The fix you keep proposing isn't getting through because the channel through which it could persist — your memory and the file system — isn't being used.

The failed-approaches pattern: a section in the progress file that lists rejected approaches, the reason each was rejected, and what was tried instead. Format I find useful:

```markdown
## Failed approaches

### Tried: caching responses in a global Map
**Why we tried it:** Looked simpler than the per-request store.
**Why it didn't work:** Memory leaks under concurrent requests; entries
  never expired. Reproduced in test/concurrency.test.js.
**Replaced with:** Per-request cache passed through middleware.

### Tried: regex-based markdown parsing
**Why we tried it:** Faster than pulling in a parser.
**Why it didn't work:** Edge cases in nested lists; gave up after fixing
  the third one. The parser dependency cost is fine.
**Replaced with:** unified + remark-parse.
```

[PLACEHOLDER — see hard parts #2] Replace these examples with real ones from a shipped project.

The format itself doesn't matter much. The discipline does. Three things make this work:

- **Specificity.** "Tried regex parsing, didn't work" is too vague to override the model's instinct to reach for regex. Name the actual edge case that broke it.
- **Reasoning.** Without the why, the model can't tell if a similar case is in scope. With the why, it can decide.
- **The replacement.** Naming what was used instead is the positive signal that paired with the negative one closes the loop.

The cost of maintaining this is low — a paragraph, written in the moment when the failure is fresh. The cost of not maintaining it is high. Every fresh session restarts the same dead ends, and you spend the first half of every morning recreating yesterday afternoon's debugging.

A specific note on attention: the failed-approaches section often works best near the top of the progress file, not the bottom. The model attends most strongly to the start and end of long contexts (the recency-and-primacy effect from Module 2). Failed approaches buried in the middle of a 200-line progress file are the lines most likely to be glossed over. Pull them up.

### Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Model ignores a convention you wrote into CLAUDE.md | Buried mid-file, or stated as a suggestion not a rule | Move toward the top; restate as imperative |
| Model edits a generated file as if it were source | "Never touch" entry missing or unclear | Add explicit "never edit X" with the path |
| Model repeats the same wrong fix across sessions | No failed-approaches file; correction lives in your memory | Write the rejected approach down with its reason |
| Model spends three turns finding the test command | Layout or operations section missing | Add a short "how to run" near the top of CLAUDE.md |
| Quality drops compared to a chat that knows less | CLAUDE.md is bloated; signal lost in noise | Prune entries that don't earn their keep; split into referenced files |
| The model "forgets" the task across a fresh session | No progress file; state lived only in conversation | Create a progress file; reference it from CLAUDE.md |
| Different sub-trees need different conventions but everything is in the root file | Single CLAUDE.md doing too much | Split with directory-scoped CLAUDE.md files |
| Stale entries you keep meaning to clean up | No deletion discipline; the file accumulates | Treat CLAUDE.md as code; prune as part of normal work |
| Model ignores a "do not do X" rule you added last week | Rule stated negatively without context | Add the reason; the model needs the why to apply the rule to similar cases |

The meta-move stays the same as the previous modules: before blaming the prompt or the model, check what's in the file. Most disappointing Claude Code outputs in a long-running project come from a CLAUDE.md or progress file that's stale, bloated, or missing the load-bearing entry. The check is cheap. The fix is usually a five-minute edit.

### The graveyard problem

The mirror-image failure mode. Module 1 had over-specifying. Module 2 had over-contextualizing. The CLAUDE.md version is the graveyard: a file that has accumulated every constraint you ever needed to clarify once, with no deletion discipline.

Symptoms:

- File past a screen of text
- Sections labeled "old," "deprecated," or "TODO clean up"
- Entries you can't remember why you added
- The same point stated three times in slightly different words
- Conventions that contradict each other, with no resolution
- A "tips and tricks" section that grew over time

The fix is the same shape as the over-context fix from Module 2. Treat the file as code. Prune entries that don't earn their keep. The test: if you removed this entry, would the next session degrade? Run it on a session-by-session basis as you work. When you find an entry the model is reliably ignoring or that hasn't been relevant for a month, delete it.

A specific habit that helps: when you correct the model in a session and you're tempted to add the correction to CLAUDE.md, pause. Most one-off corrections are not conventions. They're context the model lacked in that specific moment. The test: would the same correction apply in three other sessions you can imagine? If yes, codify. If you can't think of three, leave it out.

The reverse habit also helps: schedule a fifteen-minute prune every few weeks. Open CLAUDE.md, read it from the top, and delete anything that doesn't pass the "is this still earning its place" test. The mechanics matter less than the rhythm. A file that's never pruned will grow until it stops working, no matter how careful you were when you wrote each entry.

[PLACEHOLDER — see hard parts #3] Honest pull-back. I haven't been consistently doing the prune-rhythm thing. The rhythm I actually have is "prune when the model starts behaving badly, by which point it's already a week of bad sessions." The fifteen-minute scheduled prune is what I'd recommend; the "wait for things to break" trigger is what I'd describe.

### Bridge to Module 5

CLAUDE.md and progress files give you durable, project-level state. They're the simplest application of file-based state: one project, one CLAUDE.md, one task, one progress file. Read at session start, updated as work proceeds.

The next step up is when the work itself is too large for a single Claude session to hold without losing the thread. You start wanting specialized agents — one to plan, one to write, one to review, one to run tests — each with its own scoped instructions and its own scoped tool access. The same file-based state principle applies, but now the files are scoped per agent. Sub-agents are markdown files with their own task descriptions and their own permissions. Module 5 picks up there: how to decompose work into sub-agents within a single session, when to do it, and when to leave the work to a single Claude.

This is also where the curriculum's anchor project, PR Assistant, gets decomposed for the first time. The lab in this module gets you to one Claude Code session with a CLAUDE.md reviewing PRs. Module 5's lab splits that into three persona reviewers — security, performance, readability — each as a sub-agent.

### TLDR

1. **State belongs in files, not in your head or in fresh prompts.** CLAUDE.md is the simplest expression for project conventions; progress files extend the principle to multi-session work; failed-approaches sections extend it to anti-knowledge.
2. **CLAUDE.md is loaded every session. Every line costs attention.** Default to small. Promote content in only when it clears the recurring cost, not the one-time cost of writing.
3. **Five categories earn a place: operations, layout, conventions, never-touch, standing decisions.** Each has a one-line test. Most candidate entries fail at least one.
4. **Progress files handle task-state across sessions.** CLAUDE.md is durable and global; progress files are ephemeral and local. Mixing them is the most common early mistake.
5. **Failed-approaches sections are the highest-leverage pattern in long-running work.** Models repeat the same wrong fix; without anti-knowledge written down, every session restarts the same dead ends.
6. **The graveyard is the mirror-image failure.** Files grow until they stop working. Treat CLAUDE.md as code. Prune as part of normal work.
7. **The discipline transfers from Modules 1 through 3.** Specify well, manage context, scope tightly. The medium changed; the job didn't.

### Lab handoff

The lab for this module introduces the curriculum's anchor project: PR Assistant. You'll clone the sample repo, run Claude Code on it without a CLAUDE.md, watch the friction, write one, and run again. The before-and-after comparison is the artifact you keep. Instructions in `/labs/m4-claude-md/`.

---

## Lab design

### Lab: Build a CLAUDE.md for PR Assistant

**Goal.** Feel the difference a good CLAUDE.md makes by experiencing both states. Build the habit of writing one that earns its keep, not one that documents everything.

**Setup.** Clone the PR Assistant sample repo from `github.com/ramboz/pr-assistant-lab` (the curriculum's anchor project, entering here for the first time). The repo is a small TypeScript project that wraps GitHub's PR API and contains seeded issues — bugs, style violations, and design problems planted across the codebase to give Claude Code something concrete to find and fix.

The repo intentionally ships without a CLAUDE.md. There's a `STARTER-NOTES.md` describing what the project is and a `SEEDED-ISSUES.md` listing what's been planted (don't read this until the calibration step).

Verify your Claude Code install from Module 3 still works. Confirm you're on the latest version.

**Exercise.**

**Step 1: Run without a CLAUDE.md (~25 minutes).** Open Claude Code in the repo. Ask it to review one of the open PRs (the repo includes a `MOCK-PRS/` directory with three sample PRs as branches). Watch carefully. Note specifically:

- How many turns does it spend orienting itself before getting to the review?
- Does it run the test command? Does it know how to?
- Does it make assumptions about conventions that don't match the codebase?
- Does it edit any files it shouldn't?

Don't help it. The friction is the data.

**Step 2: Write a CLAUDE.md (~30 minutes).** Based on what you learned in Step 1, write a CLAUDE.md for the repo. Use the five categories from the concept post as a checklist:

1. How to operate the project
2. Project layout
3. Conventions and idioms
4. Things to never touch
5. Standing decisions

Constraint: keep it under 80 lines. If you're going over, you're documenting things that don't earn their place. The constraint is the lab. Larger CLAUDE.md files exist in real projects; the discipline of writing a tight one is the skill being practiced.

**Step 3: Run with the CLAUDE.md (~25 minutes).** Open a fresh Claude Code session. Ask it to review the same PR from Step 1. Note the same observations. Compare directly:

- Did the orientation turns disappear?
- Did it run the test command without being told?
- Did it follow the conventions you wrote down?
- Where did your CLAUDE.md help, and where did it not?

**Step 4: Calibration pass (~20 minutes).** Now read `SEEDED-ISSUES.md`. For each seeded issue, check whether the run with CLAUDE.md caught it. Some issues are designed to be caught only with proper convention awareness; others should be catchable either way. Note which ones your CLAUDE.md helped with and which it didn't.

Then prune. Open your CLAUDE.md and ask: which lines did the model use in Step 3? Which lines were ignored? Delete the ignored ones and shrink the file.

**Step 5: Reflection (~10 minutes).** Write three sentences:

- One thing your CLAUDE.md helped with that you didn't expect
- One thing it didn't help with that you thought it would
- One entry you'd add or remove if you ran the lab again tomorrow

**What you'll have at the end.** Two recorded review sessions for direct comparison, a working CLAUDE.md sized for the project, and a personal calibration of where the file's leverage came from. Keep all of these — Module 5 builds on this CLAUDE.md when you decompose PR Assistant into sub-agents.

**Time budget.** ~2 hours. The setup-and-friction-watching in Step 1 takes longer than feels comfortable; that's the point. The pruning in Step 4 is where most learners discover their CLAUDE.md was longer than it needed to be.

**Common traps:**

- Writing the CLAUDE.md before running Step 1. The friction is the data; without it, you'll write a generic CLAUDE.md template that doesn't reflect this project.
- Going over the 80-line constraint. The constraint forces choices. If you can't fit everything you want, that's the lab teaching you which entries earn their place.
- Treating Step 4 as optional. The pruning step is most of the learning. The first draft is rarely the right size.
- Documenting things "in case the model needs them." If you didn't see the model need it in Step 1, it's speculation. Leave it out.

**Extension, optional.** Add a `progress.md` file before running Step 3 — pretend the PR review is a multi-session task and write down the goal, status, and one rejected approach. See whether the model uses it. The pattern matters more than getting it right; you'll formalize it more in Module 7 when work spans real overnight runs.

---

## References

- **Anthropic's CLAUDE.md guidance.** Official notes on the file's mechanics, scoping, and recommended structure. The closest thing to canonical reference. `https://docs.claude.com/en/docs/claude-code/memory`
- **Claude Code documentation overview.** Broader doc set covering settings, permissions, and the `@filename.md` reference syntax used in CLAUDE.md. `https://docs.claude.com/en/docs/claude-code/overview`
- **Geoffrey Huntley on CLAUDE.md patterns.** Practitioner notes on what's worked and what hasn't in real Claude Code projects. Concrete examples; useful counterweight to vendor docs. `https://ghuntley.com/`
- **Simon Willison on agentic coding workflows.** Ongoing notes that include CLAUDE.md examples and progress-file patterns from real projects. `https://simonwillison.net/tags/claude-code/`
- **The cwv-agent repo.** Real CLAUDE.md and the phase-scoped context structure referenced in the concept post. Skim it for shape, not content. `https://github.com/ramboz/cwv-agent`
- **PR Assistant sample repo.** The lab's working repo, with seeded issues and the starting state intentionally missing a CLAUDE.md. `https://github.com/ramboz/pr-assistant-lab`

---

## Hard parts checklist (for Julien)

These are the spots where voice and personal experience are load-bearing. Draft prose is in place but should be replaced or rewritten.

1. **Opening anecdote (the 600-line CLAUDE.md story).** Drafted as a placeholder with realistic-feeling specifics. Replace with the actual moment from your work where a CLAUDE.md stopped earning its keep, or where you realized state should live in a file. The numbers (600 lines, three months, etc.) are made up; swap in real ones if you have them, otherwise rewrite the moment from scratch. This is the single most important rewrite — the rest of the module trades on the opening landing as lived.

2. **Failed-approaches example block.** The two examples (caching in a global Map, regex-based markdown parsing) are plausible but fabricated. Replace with one or two real failures from cwv-agent or another shipped project. The format itself is fine; the content needs to be from your actual debugging history. The point of the section depends on the examples sounding lived-in, which generic ones don't.

3. **The pull-back at the end of "the graveyard problem."** I drafted a brief honest disclosure ("I haven't been consistently doing the prune-rhythm thing"). Confirm or rewrite — your actual rhythm may be different. If you do prune on a schedule, replace with the real cadence and what triggered it. If you're more on the "prune when things break" side, the current version is roughly right; tighten the specifics.

4. **The cwv-agent worked example in "What earns a place."** I sketched the shape from what I could infer from earlier modules' references (single-user assumption, sub-agent markdown files with frontmatter, `docs/cms-context/` structure). Confirm whether this matches the actual repo. If the structure is different, rewrite the example to match — its credibility depends on a reader being able to clone the repo and see what's described.

5. **Voice pass over the whole thing.** Standard. Particular spots to watch:
   - "What does not earn a place" runs the closest to imperative/scolding register. Check it doesn't tip over.
   - The graveyard section may be running heavy on the "every line costs" point. Trim if it feels redundant against the reframe section, which already makes that point.
   - The bridge to M5 commits to PR Assistant being decomposed into three persona reviewers (security, performance, readability). Check this matches what you're planning to write for M5 before publishing M4.
   - I deliberately routed the concept-post worked example through cwv-agent and the lab through PR Assistant, to keep cwv-agent as the "recurring example" pattern from M1-3 and let PR Assistant enter cleanly in the lab as decided in the decisions log. If you'd prefer to introduce PR Assistant earlier in the concept post (e.g., as a brief tease alongside or instead of the cwv-agent example), that's a structural call worth making before the voice pass rather than after.

---

## Remaining blanks to fill before publication

1. **Opening, all paragraphs.** Replace placeholder anecdote with real one (see hard parts #1).
2. **Failed-approaches section, both example blocks.** Replace with real examples (see hard parts #2).
3. **Graveyard section, final paragraph.** Confirm or rewrite the honest disclosure (see hard parts #3).
4. **Worked example in "What earns a place."** Verify cwv-agent details match the actual repo (see hard parts #4).
5. **Lab setup, Step 1.** Confirm `MOCK-PRS/` directory structure matches the actual pr-assistant-lab repo when it ships. Filename and structure may need updating.
6. **Lab setup, Step 4.** Confirm `SEEDED-ISSUES.md` is the right filename when the lab repo ships.
7. **References, PR Assistant repo URL.** Verify the URL once the repo is public.

---

## Human (Apr 28, 2026, 9:53 AM):

1. I don't think I have good examples here. I haven't used many [Claude.md](http://Claude.md) files so far, and I mostly got them auto-generated by Claude itself and they were pretty clean. You can review /Users/ramboz/Projects/spacecat/cwv-agent/[Claude.md](http://Claude.md) for an example. not sure if you do see something we should change in there. It would likely make a good PR example for the module if you do, but we need it to be realistic, not forced
2. I don't really have those sections in my [Claude.md](http://Claude.md) as far as I can tell. I do have "anti-patterns" documented in the prompts for the various CMS in /Users/ramboz/Projects/spacecat/cwv-agent/src/prompts/contexts, not sure if that is the good example you look for
3. I haven't really managed my [Claude.md](http://Claude.md) files that much. I feel Claude has done a good work for me keeping those clean, so I didn't end up with the graveyard issue. I might have started with good references to begin with and Claude helping avoid it becoming too much messy. Not sure.
4. Not exactly. You can refer to the real repo in /Users/ramboz/Projects/spacecat/cwv-agent/
5. Let's defer this for now and fix the remaining issues

---

## Human:

Read the actual `Claude.md`. Useful reality check — what's there is structurally different from what I'd guessed, and your feedback shifts a few things in the module beyond just swapping examples. Calling out the structural change explicitly: the graveyard section needs to come down significantly, not just have its pull-back rewritten. If you've been letting Claude maintain the file and haven't hit the graveyard hard, the section as drafted is over-claiming.

Below are the four affected sections rewritten, plus a small note at the end about what I noticed in your actual file.

---

### Revised opening

> The first CLAUDE.md I wrote tried to do too much. I treated it like a README: project description, install steps, conventions, file layout, a section on what not to touch, a section on running tests, every gotcha I'd hit during onboarding. Two screens, all in one file. The model didn't seem to use it well. Responses would either ignore the conventions I'd written down or quote them at me when they weren't relevant.
>
> The second one I let Claude write. I pointed it at the codebase and asked it to produce a CLAUDE.md that would help future sessions orient themselves. What came back wasn't bigger. It was structurally different. The root file was short and mostly tables: links to detailed docs in a `.claude/` subdirectory, a quick "common tasks" section, a few load-bearing conventions in the conventions section. The detail had moved into referenced files, loaded only when the situation called for them.
>
> That structure has held up. The CLAUDE.md in cwv-agent today still follows roughly that shape, and it's stayed maintainable largely because Claude itself has done most of the maintenance whenever I asked it to.
>
> Which leaves a question worth asking up front. If Claude can write a useful CLAUDE.md mostly on its own, why is this module here? Because evaluating "is this entry earning its place" is a skill, and the file is loaded into every session whether it earns the cost or not. The mechanics matter even when the writing is mostly delegated. You're going to be reading what Claude produces and deciding what to keep, what to prune, and what to split out. That's the work.

---

### Revised worked example in "What earns a place"

(Replaces the two paragraphs starting "A worked example for shape...")

> A worked example for shape, drawn from cwv-agent (the recurring example from earlier modules). The repo is a Claude Code agent that analyzes Core Web Vitals data. Its CLAUDE.md is structured as a navigation index. The root file is mostly tables pointing to detailed docs in a `.claude/` subdirectory, with a few sections of direct content for things every session needs.
>
> The direct content covers, roughly: a "Quick Start" reading order for new contributors, "Code & Configuration" with key source file paths grouped by subsystem (orchestration, analysis, data collection, prompts), a short "Code Quality Standards" section with conventions and a few load-bearing guardrails, and a "Common Tasks" section with run commands.
>
> The referenced content — full architecture, individual design decisions, research notes — lives in `.claude/architecture.md`, `.claude/design-*.md`, `.claude/research-*.md`. Loaded on demand when the conversation calls for them. Not in scope every session. The shape mirrors the phase-scoped context fix from Module 1's PR #68: don't load everything every time; load what the situation calls for. Same principle, different scope (project-level instead of sub-agent-level).
>
> One specific entry in the conventions section is worth pulling out as a real example of anti-knowledge compressed into a guardrail:
>
> ```
> USE withStructuredOutput() with Zod schemas for guaranteed JSON
>   CRITICAL: Use method: 'jsonSchema' (camelCase), NOT 'json_schema' (v0.3 syntax)
> ```
>
> The CRITICAL line is there because at some point we tried the v0.3 syntax, it failed, and we lost time figuring out why. Future sessions don't need to relearn this. That's the failed-approaches pattern at its smallest scale: one line, enough specificity to override the model's instinct, in a file that's loaded every session.

---

### Replacement section: anti-knowledge

(Replaces the entire "The failed-approaches pattern" section. Title changes too — the pattern is broader than progress files in your actual practice.)

> ### Anti-knowledge: documenting what didn't work
>
> Models repeat mistakes. Specifically, they gravitate toward the same wrong fix to a given problem. The reasons are mechanical. Training data over-represents some patterns. "Obvious" first-pass solutions are obvious because they're common, not because they're correct here. Across sessions, none of this is remembered.
>
> You correct the model in session one. Session two, fresh context, same starting state, same first-pass solution. You correct it again. Session three. Same thing. The fix you keep proposing isn't getting through because the channel through which it could persist — your memory and the file system — isn't being used.
>
> The pattern: write the rejected approach down, in a file loaded when the relevant work is in scope. The shape varies by where the anti-knowledge lives.
>
> **As a guardrail in CLAUDE.md.** Short and imperative, in the conventions section. The cwv-agent LangChain example from above ("CRITICAL: Use camelCase, NOT v0.3 syntax") is one of these. Single line, enough specificity to override the model's instinct to reach for the wrong syntax. Use this when the rejected approach is a recurring trap likely to come up in many tasks.
>
> **In agent-specific prompt context.** When the anti-knowledge is scoped to a particular domain or sub-agent, it belongs with that agent's context, not in the global CLAUDE.md. cwv-agent does this for CMS-specific patterns: each CMS has a context file under `src/prompts/contexts/` with its own anti-patterns documented. The agents that work in a given CMS load the relevant one. Agents working in a different domain don't carry the noise. Same idea as the phase-scoped context fix from Module 1, applied to anti-knowledge specifically.
>
> **In a progress file's failed-approaches section.** When the anti-knowledge is scoped to a specific in-flight task rather than a project-wide convention. Rough template:
>
> ```markdown
> ## Failed approaches
>
> ### Tried: [approach name]
> Why we tried it: [the reasoning at the time]
> Why it didn't work: [specific failure, ideally reproducible]
> Replaced with: [what's in scope now]
> ```
>
> Three things make this work regardless of where it lives:
>
> - **Specificity.** "Tried regex parsing, didn't work" is too vague to override the model's instinct to reach for regex. Name the actual edge case that broke it.
> - **Reasoning.** Without the why, the model can't tell if a similar case is in scope. With the why, it can decide.
> - **The replacement.** Naming what was used instead is the positive signal that paired with the negative one closes the loop.
>
> One small note on attention: when anti-knowledge lives in a progress file, put it near the top, not the bottom. The model attends most strongly to the start and end of long contexts (the recency-and-primacy effect from Module 2). A failed-approaches list buried in the middle of a 200-line progress file is the section most likely to be glossed over.
>
> The cost of maintaining anti-knowledge is low — a paragraph or a bullet, written in the moment when the failure is fresh. The cost of not maintaining it is high. Every fresh session restarts the same dead ends.

---

### Revised graveyard section (significantly cut)

> ### The graveyard problem
>
> The mirror-image failure mode. Module 1 had over-specifying. Module 2 had over-contextualizing. The CLAUDE.md version is the graveyard: a file that has accumulated every constraint you ever needed to clarify once, with no deletion discipline.
>
> Symptoms: file past a screen of text, sections labeled "old" or "deprecated," entries you can't remember why you added, the same point stated three times in different words, conventions that contradict each other. The fix is the same shape as the over-context fix from Module 2. Treat the file as code. Prune entries that don't earn their keep. The test: if you removed this entry, would the next session degrade?
>
> Honest pull-back: I haven't hit the graveyard hard in my own work, and I think the reason is that Claude has done most of the maintenance. When I let it author or restructure CLAUDE.md, it tends to produce something tighter than what I'd leave to grow on its own. The navigation-index structure from the opening helps too, since most of the volume can never accumulate in the root file in the first place — it's in referenced files that only load when needed.
>
> Both of those are mitigations, not guarantees. If you write CLAUDE.md by hand and never let Claude prune it, the graveyard is the default end state. Two habits prevent it. First, ask Claude to review and tighten the file periodically, especially after a stretch of additions. Second, when you're tempted to add a one-off correction as a permanent rule, pause and ask whether the same correction would apply in three other sessions you can imagine. If you can't think of three, leave it out.

---

### What I noticed in your actual CLAUDE.md

You asked whether anything in there should change. Quick scan turned up two small things — neither is module-grade material on its own, but flagging in case you want to clean them up:

- **Placeholder dates in the design decisions table.** Several rows have `2026-01-XX` or `2025-XX-XX` instead of real dates. Minor drift; could be filled in or replaced with a single "see git log of the corresponding doc" note.
- **Line 12, dangling forward reference.** The Quick Start reads as "Architecture (after creating from SYSTEM-OVERVIEW.md)" — looks like a step that didn't get completed. Either land that file or rephrase to point at the existing `.claude/architecture.md` directly.

Both are real but small. I considered using them as the opening anecdote ("even a clean CLAUDE.md drifts in small ways") and decided against it — feels forced, and your actual experience is closer to "the file stays clean because Claude maintains it." The opening I drafted above leans into that instead.

---

### Updated hard parts checklist

1. ~~Opening anecdote~~ → drafted above based on your actual experience (let-Claude-write-it pattern, navigation-index discovery). Voice pass and confirm the framing matches what you'd say.
2. ~~Failed-approaches examples~~ → restructured into the broader "anti-knowledge" section above, using the real LangChain CRITICAL line and the `src/prompts/contexts/` CMS pattern. Voice pass; confirm the CMS context description ("each CMS has a context file ... agents that work in a given CMS load the relevant one") matches the actual loading mechanism.
3. ~~Graveyard pull-back~~ → integrated as honest disclosure inside a much shorter section. Confirm the framing ("Claude has done most of the maintenance ... navigation-index structure helps") matches your view.
4. ~~cwv-agent worked example~~ → rewritten from the actual repo. Spot-check the description against the real file structure; I worked from the root `Claude.md` and inferred the rest.
5. **Voice pass over the whole thing** — still standing.
6. **(New)** The bridge to M5 still commits to splitting PR Assistant into three persona reviewers (security, performance, readability). Worth confirming this matches what you're planning for M5 before we publish M4.

---

## Human (Apr 28, 2026, 10:33 AM):

"when anti-knowledge lives in a progress file, put it near the top, not the bottom. The model attends most strongly to the start and end of long contexts (the recency-and-primacy effect from Module 2)", feels a bit like a contradiction.don't put it near the bottom, but the model looks at start and end more strongly…

---

## Human:

Good catch — you're right, that's contradictory as written. If the model attends to both start *and* end, "put it near the top, not the bottom" doesn't follow from the recency-and-primacy point.

The fix depends on what I actually meant. Two options:

**Option A — drop the placement tip entirely.** It's a small detail and the rest of the section stands without it. Cleanest move.

**Option B — keep the tip but ground it correctly.** The real risk isn't middle-vs-end; it's that progress files tend to grow chronologically, with the most recent work at the bottom. If failed-approaches sits in a section that gets pushed into the middle as the file grows, that's where it gets glossed. The fix is "keep it pinned in a stable position that won't drift to the middle as the file grows" — top works, but so does a dedicated trailing section if you're disciplined about not burying it.

I'd go with A. The recency-and-primacy point is real but I was reaching for it to justify a tip that's mostly about file layout discipline, and the result is a sentence that argues against itself. If you want to keep some version of the layout point, here's a cleaner one:

> One small note on layout: progress files tend to grow chronologically, which means whatever you put in the middle of the file when you wrote it will stay in the middle as the file grows. Pin failed-approaches at the top or in a dedicated section that won't drift, so it doesn't end up buried under three weeks of status updates.

No appeal to attention mechanics. Just file hygiene.

Your call which way to go.

---

## Human (Apr 28, 2026, 10:34 AM):

"Symptoms: file past a screen of text," We keep referring to 1 screen of text as a good threshold, but looking at my [Claude.md](http://Claude.md) in the cwv, we definitely have more. So either it's a bad example, or our rule of thumb isn't appropriate

---

## Human:

You're right, and the fix is bigger than just rewording one line. The "one screen" rule of thumb is in two places in the draft (the mechanical structure section and the graveyard symptoms), and both are tying the diagnosis to the wrong thing — total file length — when what actually matters is how much load-bearing prose the model has to hold and attend to.

Your cwv-agent file is ~175 lines, but the breakdown is roughly: 4-5 navigation tables, a code-and-config section (file paths grouped by subsystem), a Common Tasks section (run commands), and the Code Quality Standards section. Of all that, the only part that's really dense prose conventions the model needs to absorb is Code Quality Standards, which is around 20 lines. Everything else is reference scaffolding that's cheap to skim past.

So the real heuristic is something like: the directly-loaded *prose conventions* should be tight. Navigation tables and code/config listings are nearly free. Total line count is a misleading proxy.

**Two fixes.**

In the mechanical section, replace:

> A useful default structure:
> - A short root CLAUDE.md, kept under a screen of text, with the things every session needs
> - A `docs/` directory with longer files for things sometimes needed
> - References from CLAUDE.md to those files, so the model knows they exist and when to read them

With:

> A useful default structure:
> - A root CLAUDE.md where the dense prose stays tight, navigation and reference tables are free to expand, and longer-form content lives in referenced files
> - A `.claude/` or `docs/` directory with detailed docs for things sometimes needed
> - References from the root file to those docs, so the model knows they exist and when to reach for them
>
> "Tight prose" is fuzzy on purpose. The cwv-agent CLAUDE.md is around 175 lines, but most of that is navigation tables and code-path references; the dense conventions section is closer to 20 lines. The cost is in the prose the model has to read and attend to, not in the file's total line count. A 200-line file that's 80% tables and references is fine. A 60-line file that's all conventions stacked end-to-end might already be too much.

In the graveyard symptoms, replace:

> Symptoms: file past a screen of text, sections labeled "old" or "deprecated," entries you can't remember why you added, the same point stated three times in different words, conventions that contradict each other.

With:

> Symptoms: a dense prose section you can't skim in under a minute, sections labeled "old" or "deprecated," entries you can't remember why you added, the same point stated three times in different words, conventions that contradict each other.

The lab's 80-line constraint for PR Assistant I'd leave alone — that's a teaching constraint on a small sample repo, and the discipline it forces (which entries earn a place) is the point. But I'd add one sentence in the lab so readers don't generalize the number to real projects:

> Constraint: keep it under 80 lines. If you're going over, you're documenting things that don't earn their place. The constraint is the lab. Real projects, especially ones using the navigation-index pattern with referenced detail docs, will reasonably run longer; what matters is that the directly-loaded prose stays tight.

---

## Human (Apr 28, 2026, 10:39 AM):

Let's do Option A for the placement tip issue.
The rest looks good to me.
Update the draft with all these changes, and do a voice pass on it

---

## Human:

Updated draft is in the file. Summary of what changed in this pass beyond integrating the four prior revisions:

**Voice pass changes worth flagging:**

- Removed em dashes throughout (replaced with colons, parentheses, periods, or commas). Source samples avoid them and modules 1-3 mostly do too; my earlier draft had drifted.
- Removed the "put it near the top" placement tip from the anti-knowledge section per your call. Section closes cleanly on the cost-of-not-maintaining sentence now.
- Updated the "useful default structure" bullets and added a paragraph on why total line count is a misleading proxy. Cwv-agent gets cited as the example of a 175-line file that's still tight where it matters.
- Updated the graveyard symptoms from "file past a screen of text" to "a dense prose section you can't skim in under a minute." Same shift applied to TLDR item 2.
- TLDR item 5 rewritten to cover the multi-layer anti-knowledge pattern (CLAUDE.md / agent prompts / progress files) instead of progress-file-only.
- The "What this module covers" preview bullet 6 updated to match the renamed section.
- Mixing-them-into-graveyard sentence in progress-files section reworded since the opening no longer features a 600-line file.
- Hard parts checklist trimmed to what actually remains: voice spot-checks, the cwv-agent prompts/contexts factual confirmation, the M5 bridge commitment, and the two drift items I noticed in your real CLAUDE.md.

**Things I deliberately didn't touch:**

- The five-categories framework in "What earns a place." Stable across the prior rounds and matches what's actually in the real file.
- The progress files section (mostly). Sentence about the 600-line graveyard got rewritten; everything else stayed.
- The failure-mode table. One row updated to reflect the broader anti-knowledge framing; rest unchanged.
- The lab structure. Only the 80-line constraint paragraph got the "real projects will reasonably run longer" caveat added.
