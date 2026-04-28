# Conversation with Claude

## Human (Apr 17, 2026, 10:08 AM):

A colleague of mine mentioned they are running agents with orchestrator and "droids" over 24h+ tasks.
I feel I'm lagging behind with my "simple" prompting in claude code and the few agents it spawns.
How do I get from where I am to where he is? What do I need to learn, read, etc. to get familiar with these more complex tasks?

---

## Human:

This is a great question — the gap between "prompting Claude Code well" and "running autonomous agents for 24+ hours" is real, but it's more about patterns and infrastructure than some secret toolkit. Let me search for the current state of the art since this space moves fast.Now let me look at what's advanced on the Claude Code side specifically, since that's the user's starting point.Good news: the gap feels bigger than it is. "Orchestrator + droids over 24h" is mostly a pattern and a mindset, not a secret product. Your colleague is probably either using Factory.ai's Droids (where "Droid" is literally their brand name for an agent persona) or a home-grown orchestrator layered on top of Claude Code or Codex. Either way, the same ideas apply to Claude Code, and you can climb this ladder without switching tools.

## The mental shift that matters

The core reframe is from **conductor → orchestrator**. In conductor mode (what you're doing now), you're pair-programming with one Claude, synchronously, and your context window is the ceiling. In orchestrator mode, you plan and decompose work, hand scoped tasks to agents that each get a fresh context, and check back in asynchronously. [Addy Osmani put it well](https://addyosmani.com/blog/code-agent-orchestra/) — it's the difference between pair-programming and managing a team. That's literally the skill change: clear specs, work decomposition, and output verification instead of writing code yourself.

Everything else — droids, worktrees, agent teams — is infrastructure to make that shift reliable.

## What actually makes 24h+ runs work

From Factory's and Anthropic's writeups, the pattern that lets agents run for hours without derailing is remarkably consistent. Four principles:

**File-based state beats chat memory.** The orchestrator never trusts what a sub-agent says in chat — every phase writes a file or returns an exit code. A `CLAUDE.md` (or `AGENTS.md`) holds the plan; a `CHANGELOG.md` or progress file acts as the agent's lab notebook, including *failed approaches and why they failed* so the next session doesn't re-attempt them. Anthropic's ["Long-running Claude for scientific computing"](https://www.anthropic.com/research/long-running-Claude) post is the clearest writeup of this pattern and is the single most useful thing you could read this week.

**A test oracle for "done."** Long autonomous runs need a deterministic way for the agent to know it's succeeding. That's usually a test suite, a benchmark script, or a numerical comparison — something that returns pass/fail without human judgment. No oracle, no 24h run. This is why TDD keeps showing up in droid-orchestration writeups: the tests *are* the spec the workers are optimizing against.

**Role separation with narrow workers.** The Factory pattern Silas Schuettel describes is: one Delegator (orchestrator) + two narrow workers — a test-writer and a coder. The Delegator holds memory and control flow; the workers execute and stop when validation passes. Spec → Test → Implement → Verify → Close. Each worker has zero shared chat context; they read from disk. This is what prevents the "agent confirms its own work" failure mode.

**A loop that refuses to let the agent quit early.** Models suffer from what Anthropic calls "agentic laziness" — finding excuses to stop before finishing. The Ralph loop fixes this: a for-loop that kicks the agent back into context whenever it claims completion and asks if it's really done against the oracle. Trivial to implement, huge effect on long runs.

## Concrete ladder in Claude Code

You don't need to leave Claude Code to practice all of this. Here's the progression:

1. **Custom sub-agents as markdown files** in `.claude/agents/` with YAML frontmatter and scoped tool permissions. This is a one-evening change and forces you to think in roles. Anthropic's [sub-agent docs](https://code.claude.com/docs/en/sub-agents) are the reference.

2. **Git worktrees + one-agent-one-file discipline.** Each sub-agent gets its own worktree so they never step on each other. The "Conductor" and "Claude Squad" tools automate this, but you can do it manually first to build intuition.

3. **Agent Teams** (experimental — enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). This is Claude Code's built-in orchestrator: a lead session coordinates teammates via a shared task list with dependency tracking and file locking. Closest thing to "droids" without leaving Claude Code.

4. **Headless mode** (`claude -p "..." --allowedTools ... --output-format json`). This is the unlock for 24h stuff — Claude becomes a subprocess you can call from cron, GitHub Actions, or your own orchestrator script. Factory's "Droid Exec" is essentially the same idea under a different name.

5. **Third-party orchestrators** once you've outgrown Agent Teams: Gas Town (Steve Yegge's "Kubernetes for agents"), Multiclaude, Conductor, Vibe Kanban. These are just opinionated wrappers around the same primitives — worth a look so you can steal patterns, not necessarily adopt wholesale.

## Reading list, in order

Prioritized for someone in your situation:

1. **Anthropic — [Long-running Claude for scientific computing](https://www.anthropic.com/research/long-running-Claude)**. Progress files, test oracles, the Ralph loop. Start here.
2. **Anthropic's engineering blog — "How we built our multi-agent research system"** (anthropic.com/engineering). Real production multi-agent architecture, tradeoffs, failure modes.
3. **Silas Schuettel — [How to make Droids code for hours using TDD](https://medium.com/@silas_27632/how-to-make-droids-code-for-hours-using-test-driven-development-and-smart-orchestration-in-factory-a-40838d66e048)**. Even if you never touch Factory, the `AGENTS.md` + narrow-worker pattern transfers directly.
4. **Addy Osmani — [The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/)**. Best tour of the current tool landscape and the three tiers (interactive → local parallel → cloud async).
5. **Claude Code docs on sub-agents and Agent Teams**. Dry but essential reference.
6. **Factory's [Terminal-Bench writeup](https://factory.ai/news/terminal-bench)**. The design-considerations section on hierarchical prompting and tool design is gold.

## How this maps to what you're already doing

Your agentic optimization loop for the martech→EDS migration is actually a textbook long-running agent problem: you have a clear test oracle (deep-PSI performance numbers and network-call consistency), a natural decomposition (split container → extract tags → route to eager/lazy → measure), and a human validator at the end. If you formalize that as an orchestrator with three or four narrow droids (container-splitter, tag-router, perf-measurer, verifier) each writing to disk against an `AGENTS.md`, you'd essentially have the 24h-capable system your colleague is describing — and you'd ship the Astha project faster as a side effect. That's probably the most valuable place to practice this, since the domain is already yours.

Happy to go deeper on any of the pieces — the Ralph loop, how to structure `AGENTS.md` for your use case, or what the migration droids' spec files might look like.

---

## Human (Apr 17, 2026, 10:16 AM):

Review what I have in /Users/ramboz/Projects/misc/cwv-workbench
I feel this could be even more of a good project for this kind of long-running work.
What do you think?

---

## Human:

I can't reach your local filesystem from here — my sandbox only sees uploaded files and my own working directory, not `/Users/ramboz/...`. So I can't open the project directly.

A few options to get me the context I'd need:

1. **Drag-and-drop the repo root** (or a zip of it) into the chat. I can then read through the structure, README, key source files, and give you a real review against the long-running-agent patterns we just discussed.
2. **Upload the key files only** — typically `README.md`, `package.json` / `pyproject.toml`, the main entry point, and any `AGENTS.md` / `CLAUDE.md` if you have them. That's usually enough to form a good picture without dumping the whole tree.
3. **Paste a `tree` output plus a description** of what CWV Workbench does and who the "workers" would be. I can reason about the fit from that alone.

That said — even without seeing the code, the name alone ("CWV workbench" = Core Web Vitals workbench) makes me suspect you're right that it's an even better candidate than the martech→EDS migration, because CWV work has three properties that the agent-orchestration pattern rewards heavily:

- **Ruthless numerical oracle.** Lighthouse / PSI / CrUX scores are deterministic pass-fail signals per run. Unlike "did the migration preserve behavior" (which needs network-call diffing), CWV has a single objective function the agents can optimize against directly. That's the dream oracle — no human-in-the-loop needed to say "better" vs "worse."
- **Naturally parallelizable hypothesis space.** Image optimization, script deferral, font loading, layout shift fixes, third-party containment — these are independent intervention categories. Perfect for racing droids: spawn N workers, each trying a different intervention, measure, keep the winners.
- **Bounded blast radius.** CWV fixes are mostly reversible (git revert) and observable (rerun PSI). That makes "trust the autonomous loop" much more palatable than in the martech migration where a bad container split can break analytics in hard-to-detect ways.

If that's roughly what the workbench is, then yes — it's arguably the cleanest long-running-agent shape in your portfolio. The project essentially wants to be structured as `specify target → generate candidate interventions → race workers in worktrees → measure → merge winners → repeat`, which is exactly the Missions/Factory pattern with a numeric oracle instead of a test oracle.

Send the files (or a tree + description) and I'll do a proper review against the specific patterns — `AGENTS.md` shape, worker decomposition, progress-file design, and where the Ralph loop belongs.

---

## Human (Apr 17, 2026, 10:21 AM):

ok, let me switch gears to claude code then instead, in the context of that project, and prepare a prompt for me that will help guide it towards making sure that project is set up with those principles in mind

---

## Human:

Here's a prompt designed for Claude Code specifically — it uses Plan mode discipline, assumes it's running inside the repo, and stops before making any changes so you can review and redirect. Copy it into a fresh Claude Code session started from `~/Projects/misc/cwv-workbench`:

```
# Role and goal
You are auditing this project (cwv-workbench) to evaluate how close it is to
being a long-running autonomous agent system for Core Web Vitals optimization.
The end state I'm aiming for: agents that run for hours on a target page,
racing interventions in parallel (image optimization, script deferral, font
loading, third-party containment, etc.), measuring via PSI/Lighthouse/CrUX,
and promoting winners — with me as final validator. Context: I work on Adobe
Edge Delivery Services, so "page" here means an EDS site in practice.

# What I want from THIS session
An honest audit and a concrete proposal. No code changes yet.

# Audit against these six principles

1. File-based state over chat memory
   Every phase should write a file or return an exit code. The orchestrator
   should never trust chat output. Look for an AGENTS.md/CLAUDE.md holding
   the plan, and a progress/changelog file tracking status, completed work,
   and — critically — failed approaches and why they failed.

2. Deterministic numeric oracle
   For CWV the oracle is numeric: LCP / INP / CLS / TBT from PSI or
   Lighthouse. Check whether there is (a) a single command that produces a
   pass/fail-or-score output for a given repo state, (b) baseline
   measurements stored somewhere, (c) statistical significance handling —
   CWV measurements are noisy, a single run is not a signal.

3. Role separation with narrow workers
   Propose the minimal droid roster. Candidates to consider, not a
   prescription: an orchestrator/delegator, a hypothesis generator, N
   intervention workers running in parallel, a measurer, a verifier that
   checks for functional/network regressions. Fewer roles is better than
   more. Tell me what you'd actually build.

4. Zero shared chat context between workers
   Workers read from disk, not from the orchestrator's conversation.
   Assess whether the current setup supports git-worktree-per-experiment
   and scoped tool permissions per role.

5. Ralph loop for anti-laziness
   Is there (or where should there be) a loop that kicks an agent back
   into context when it claims "done" prematurely, evaluated against the
   numeric oracle rather than the agent's own say-so?

6. Bounded, reversible work units
   CWV interventions should each be individually revertable (one worktree
   / branch per experiment). Confirm this is possible or propose how.

# Process

Phase 1 — Explore (read-only).
Use the Explore agent. Read the README, package.json, any existing
CLAUDE.md or AGENTS.md, main entry points, and whatever files define the
"measurement" and "intervention" surfaces. Do not modify anything.

Phase 2 — Audit report.
One section per principle. For each: what exists, what's missing, what's
close-but-needs-work. Be concrete — cite file paths and line numbers, not
general impressions. If the project already handles a principle well, say
so plainly; don't invent problems.

Phase 3 — Proposal.
- The minimal orchestrator + droid roster for this project
- Exact file layout: where AGENTS.md lives, where the progress file lives,
  where per-experiment state goes, where baselines are stored
- The oracle: the exact command I should be able to run to get a numeric
  score for any repo state, including how noise is handled
- The Ralph loop shape for this project
- What needs to change in the code itself vs what's purely orchestration
  scaffolding around unchanged code
- A proposed file tree diff: add / move / remove

Phase 4 — Stop.
Do not start implementing. List any questions or ambiguities as a
numbered list and wait for my response.

# Guardrails
- Bias toward the smallest change that unlocks long-running agents, not a
  rewrite.
- If you think I'm wrong about the shape of the solution, say so directly —
  I want pushback, not agreement.
- Don't pad the report. If a principle is already satisfied in one line,
  use one line.
```

**How to use it:**
- Start Claude Code from the project root so it picks up any existing `CLAUDE.md`
- If you have `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set, don't — you want a single session for this audit, not a team
- Expect the audit + proposal to take a few minutes; don't interrupt unless it goes off the rails
- When it stops for your review, that's your cue to push back on the roster or oracle design before any files get written

Two small judgment calls I made that you might want to flip:

- I explicitly told it to use the Explore agent in Phase 1. If your setup doesn't have that configured or you prefer it just read directly, delete that sentence.
- I framed "the oracle" as a single numeric score. If you already have a richer multi-metric setup (weighted LCP/INP/CLS), either adjust the prompt or let Claude Code propose the weighting and react to it in Phase 4.

After you've run it once and have the audit, the natural follow-up is a second prompt that says "implement Phase 3, worktree per change, commit per file, stop after AGENTS.md and the oracle command — I'll review before the rest." Happy to draft that one too once you've seen what the audit turns up.

---

## Human (Apr 22, 2026, 4:45 PM):

I'm thinking about writing some learning path tutorials to get from simple chat 1-off prompts, to long session management, all the way to complex orchestration and harnessing of agentic crews.
I'm thinking about walking the path myself as a learning exercise, and to better understand how to build this myself before I create that learning corpus for my teams.
Could you help me outline a curriculum like this with many individual courses/blogs/tutorials, and gather for each topic the reference material I should learn along the way, and what essentially would be taught in each course.
I would design this around Claude models and Claude Code.

Ask any question you need to clarify

---

## Human:

Before I start drafting, a few questions would sharpen the curriculum a lot. I'll ask the most load-bearing ones — the answers will change the shape materially, not just the wording.A few smaller ones that don't warrant buttons — just answer in prose, or tell me to pick defaults:

1. **Anchor project.** Do you want each module to build toward one running project (I'd suggest CWV Workbench since it's the cleanest oracle-driven example you have), or have each module use a throwaway mini-project? Single-project curriculums are stickier but harder to write; per-module is faster to produce.

2. **Adobe/EDS flavor.** Is this for Adobe-internal consumption (so EDS, `aem-martech`, deep-PSI examples are appropriate and expected) or is it meant to be publishable externally (so examples need to be generic)? This changes every code sample.

3. **Your own walking-the-path goal.** You said you want to walk the path yourself first. Do you want the curriculum structured so you can *author each module as you finish learning that stage* (i.e., write-as-you-go), or outlined end-to-end upfront so you know where you're headed? The first is a spiral curriculum; the second is a waterfall outline — both are fine, but they produce different-shaped documents.

4. **Scope of "agentic crews" at the top end.** When you say crews, do you mean (a) multiple Claude Code instances coordinating, (b) Claude + non-Claude tools (Factory droids, Codex, MCP servers) in one system, or (c) both? The third tier of the curriculum is meaningfully different depending on which.

5. **Timeline pressure.** Do you need this ready for teams by a specific date, or is this a slow-burn personal project? Affects whether I recommend 8 tight modules or 15 spacious ones.

Pick defaults on any you don't care about and I'll run with them.

---

## Human (Apr 22, 2026, 4:47 PM):

Q: Who's the primary audience for the learning corpus?
A: Mixed technical staff (PMs, architects, engineers) — some have never used Claude Code

Q: What format do you want the curriculum to optimize for?
A: Hands-on labs with a repo people clone and work through

Q: How deep should the 'orchestration' end go?
A: Not sure — propose what makes sense

---

## Human:

Good — mixed audience + hands-on + "propose the ceiling" changes the shape meaningfully. Mixed audience means the early modules need to be gentle enough for a PM who's never touched a terminal, which forces a branching structure rather than one linear track. Hands-on means every module needs a lab repo and a clear "you'll know you're done when X" signal. And since you want me to propose the orchestration ceiling, I'll go ahead and answer the smaller questions with defaults, then lay out the curriculum.

**Defaults I'm running with** (push back on any):
- **Anchor project:** CWV Workbench for the engineer track from Module 4 onward. Too good an example to waste, and it forces the oracle/measurement discipline that makes orchestration actually work. Earlier modules use throwaway mini-projects so nobody is blocked waiting to understand EDS.
- **Flavor:** Adobe-internal primary, with a note in each module on what would need to be swapped for external publication. Keeps you unblocked and leaves the door open.
- **Learning path:** Spiral. You author as you learn. The outline below is firm on shape and loose on detail past Module 6, because your own experience walking the path will sharpen the later modules in ways you can't predict yet.
- **Crews definition:** Both — multiple Claude Code instances *and* Claude + MCP/external tools. Modules 9–10 handle each.
- **Timeline:** Slow burn. I'll mark which modules are "publishable standalone" vs. "only makes sense in sequence" so you can release in batches.

---

## Curriculum structure

Three tiers, ten modules. Tier 1 is for everyone. Tier 2 forks: architects/PMs get a lighter "conceptual" version, engineers do the full hands-on lab. Tier 3 is engineer-only.

Each module has the same anatomy: **Concept post** (20-min read, audience-appropriate depth) + **Lab** (clone repo, work through exercises, verifiable end state) + **Reference appendix** (the reading list so people can go deeper). For the mixed audience, the concept post is the shared artifact — the lab is optional for non-engineers.

---

### Tier 1 — Working with a single Claude (everyone)

**Module 1 — "Prompting as a design problem, not a phrasing trick"**

The frame-setter. Why the "prompt engineering" mental model is actually misleading for modern Claude — the real skill is specification, not incantation. Covers: Claude's Constitutional AI framing, how to think about what's in-context vs. what's knowledge, why length and specificity help up to a point and then hurt, and why "just ask clearly" is 80% of the job. For PMs this is the *entire* value prop of the corpus; for engineers it's the foundation that makes everything else click.

Lab: take five badly-written prompts (we provide them) and rewrite each three ways — minimal, conversational, structured. Run each through Claude and compare outputs side-by-side. Success signal: you can predict which version will work best before running it.

References: Anthropic's prompt engineering docs (`docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`), the "Building Effective Agents" Anthropic post (for the contrast later), and one or two examples from Anthropic's prompt library.

Publishable standalone: yes.

---

**Module 2 — "Context is the product"**

The deepest single insight in the corpus and the one most people skip. Covers: what actually lives in a context window, why long conversations degrade, the difference between "Claude forgot" and "Claude never had it," system prompts, artifacts, file uploads, and projects. Introduces the idea that *managing what Claude sees* is the skill — not *what you type*.

Lab: given a messy 50-turn conversation, diagnose why Claude's answers got worse and fix it three ways (restart with summary, extract to a doc, fork into a project). Measure quality difference.

References: Anthropic's "long context" guidance, the engineering blog post on context management, and the Claude.ai projects documentation.

Publishable standalone: yes, and probably your highest-leverage standalone piece for a mixed audience.

---

**Module 3 — "From chat to Claude Code"**

The transition module. What changes when you go from the browser to a terminal that can read and edit your files. Covers: installation, the `CLAUDE.md` file as persistent context, permissions and the tool-approval model, the plan/edit/exec loop, and — importantly — when *not* to use Claude Code (sometimes chat is better). For PMs this is where the track splits; they can stop here with a good conceptual understanding. For engineers this is where the real work starts.

Lab: set up Claude Code on a small repo (provided — maybe a simple static site), write a `CLAUDE.md`, and complete three tasks of increasing autonomy (explain this code → fix this bug → add this feature).

References: the Claude Code docs, the getting-started guide, and Anthropic's post on agentic coding.

Publishable standalone: yes, but pairs naturally with Module 4.

---

### Tier 2 — Session management and single-agent discipline (engineer track; architect/PM summary)

**Module 4 — "Writing a CLAUDE.md that earns its keep"**

The unsexy module that pays the most dividends. Covers: what goes in `CLAUDE.md` vs. what shouldn't, how to structure it as a living document, the progress-file pattern (`CHANGELOG.md` with failed-approaches section), encoding conventions and guardrails, and the test Claude learns to run. This is the first module that introduces **file-based state** as a design principle.

Lab: **CWV Workbench enters here.** You're given a bare version of the project. Write a `CLAUDE.md` and progress file. Run the same task against the repo with and without them. Compare.

References: Anthropic's ["Long-running Claude for scientific computing"](https://www.anthropic.com/research/long-running-Claude) post (the single most important reading in the curriculum — the progress-file pattern originates here), Silas Schuettel's Factory TDD post, the Claude Code sub-agent docs.

Publishable standalone: yes, and a strong candidate for a standalone internal evangelism piece.

---

**Module 5 — "Sub-agents, one-session orchestration, and tool scoping"**

Introduces sub-agents as *a single-session feature* before anything multi-process. Covers: the built-in Explore/Plan/General-Purpose agents, writing custom sub-agents as markdown files, why scoped tool permissions matter (it's not about trust, it's about context hygiene), and the first taste of role separation. Deliberately single-session — we're not doing parallel processes yet.

Lab: decompose a refactor task in CWV Workbench into three sub-agents (explorer, planner, implementer) and compare against doing it monolithically. Measure total turns and quality.

References: Claude Code sub-agent docs, the MindStudio "5 Agentic Workflow Patterns" post.

Publishable standalone: possibly, but it's much stronger after Module 4.

---

**Module 6 — "The oracle problem"**

The conceptual hinge of the whole curriculum. Covers: why "did Claude do a good job?" is the hardest question in autonomy, types of oracles (tests, benchmarks, numeric scores, diff-based, human), why CWV is a beautiful oracle domain, why legal writing is a terrible one, and how to design an oracle for the thing you're actually trying to automate. Touches on statistical significance for noisy oracles (PSI runs vary — one run isn't a signal). If someone only reads *one* module of the whole corpus, this is the one I'd recommend.

Lab: build a one-command oracle for CWV Workbench — `./oracle.sh <url>` that returns a numeric score with noise handling (multiple runs, median, confidence interval). This artifact gets used by every subsequent module.

References: the relevant sections of the Anthropic research post, Factory's Terminal-Bench writeup (specifically the design-considerations section), any good writeup on lab-bench style evaluation.

Publishable standalone: yes — and this one I'd actually consider writing *first* because it reframes everything else.

---

### Tier 3 — Orchestration and crews (engineer-only)

**Module 7 — "Headless mode and the Ralph loop"**

The first module where Claude runs without a human watching. Covers: `claude -p` with structured output, how to call it from a shell script, the Ralph loop pattern (for-loop that kicks the agent back when it claims done but the oracle disagrees), agentic laziness and how to diagnose it, and budget controls. This is where the learner first feels "oh, it's just a subprocess."

Lab: wrap CWV Workbench in a Ralph loop that iterates until the oracle plateaus. Run it overnight. Inspect what actually happened in the morning via commit history + progress file.

References: Claude Code headless docs, the Ralph loop section of the Anthropic research post.

Publishable standalone: yes, and probably viral-adjacent — "I let Claude run for 8 hours" posts are catnip.

---

**Module 8 — "Parallel workers, worktrees, and racing hypotheses"**

Multiple Claude Code processes, each in its own git worktree, each working on a different intervention, merging winners. Covers: git worktree mechanics, one-agent-one-file discipline, file locking vs. domain separation, how to converge divergent work, and *when parallelism helps vs. hurts* (the latter is more important and almost never written about).

Lab: race four interventions on a CWV Workbench target page — image optimization, script deferral, font preload, third-party containment — each in its own worktree. Merge the winners. Compare total score to a single-agent sequential run.

References: Addy Osmani's ["Code Agent Orchestra"](https://addyosmani.com/blog/code-agent-orchestra/), the "Shipyard multi-agent orchestration" guide, Claude Squad and Conductor docs as tool references.

Publishable standalone: needs Module 7 as prerequisite, but strong.

---

**Module 9 — "Agent Teams and the manager-worker mental model"**

Claude Code's experimental Agent Teams feature as the first *native* orchestration primitive. Covers: enabling the flag, lead-and-teammates pattern, shared task lists with dependency tracking, file locking, peer-to-peer messaging, and — critically — the management skills this demands of you (clear specs, work decomposition, verification discipline). This is where the curriculum explicitly reframes the user from "coder" to "engineering manager for agents."

Lab: run a CWV Workbench optimization as an Agent Team with one lead and three teammates. Observe the shared task list. Identify at least two moments where you had to intervene and decompose better.

References: Claude Code Agent Teams docs, Addy Osmani's "conductor vs orchestrator" framing, the Factory Missions writeup.

Publishable standalone: needs Modules 7–8.

---

**Module 10 — "Crews: multi-tool systems, MCP, and knowing when you've over-engineered"**

The capstone and the only one that reaches outside Claude Code. Covers: MCP servers for cross-tool integration (Slack, Linear, Jira as triggers and sinks), when to bring in Factory droids or Codex for specific strengths, ambient agents (cron-triggered, event-triggered), and an honest discussion of when a crew is worse than a single well-instructed agent. The *don't-do-this* stories matter as much as the *do-this* ones here.

Lab: take the CWV Workbench from Module 9 and add one external integration (e.g., Slack trigger to run an optimization on a URL posted in a channel, PR posted back when done). Then — and this is the actual lesson — write a one-page post-mortem on whether the added complexity was worth it.

References: MCP protocol docs, the Latent Space Factory episode, Harrison Chase's "ambient agents" writing, Anthropic's "building effective agents" post (it's a closer as much as an opener — by this point the reader will *really* understand it).

Publishable standalone: no, this is the finale.

---

## A few notes on the shape

**Why the PM/architect track ends at Module 3.** Giving PMs modules 4–6 as concept posts (no lab) is a good idea and I'd recommend it — they'll understand why engineering effort is going where it's going. But they don't need Tier 3, and trying to make Tier 3 palatable to non-engineers dilutes it. Better to have a strong eng-only track than a mushy universal one.

**Why I put "The oracle problem" at Module 6 instead of earlier.** It's tempting to frontload it because it's the most important idea. But it only lands once people have felt the pain of Claude doing something that *looks* right but isn't. You need Modules 4–5 to build that intuition.

**The one module I'd write first, regardless of order.** Module 6. It will clarify your own thinking more than anything else on the list, and the oracle you build in its lab is reused everywhere downstream. If you want to walk the path yourself in the most efficient order, do Modules 1–3 quickly (you mostly know this), then **build Module 6 before writing Modules 4–5**. You'll discover things about the oracle that will change how you write the earlier modules.

**Where I'm least sure.** The Module 8/9 split. It's possible that worktrees + Agent Teams should be one module, not two — Agent Teams essentially automates the worktree dance. If when you walk the path you find Agent Teams works well enough that manual worktrees feel like wasted motion, collapse them. I kept them separate because understanding what Agent Teams is doing underneath is genuinely valuable.

Happy to go one level deeper on any single module — draft the concept-post outline, the lab repo structure, or the exercise list. Module 6 would be my vote for where to spend the next round of effort since the rest of the curriculum leans on it.

---

## Human (Apr 22, 2026, 4:57 PM):

I'm not sure I want to take the CWV workbench as a reference project here. CWV is a pretty specific topic that requires quite a lot of expertise and may not resonate so much with the audience. Can you come up with something a bit easier to get into?
Maybe some ideas I have (not sure if they would scale well through the 10 modules):

* creating a code review crew with different personas. maybe even integrating this directly as a github action in the end with long-process iterations on the PRs for instance
* creating a morning brief crew that checks my daily communication channels (email, slack or similar, tech watch blogs, etc.)
* any better ideas you have on your end maybe?

---

## Human:

Both your instincts are right: CWV is too niche for a mixed audience. Let me evaluate your two ideas honestly against what the curriculum actually demands, then propose a refinement.

## Evaluating your ideas

**Code review crew — stronger than it looks.** My first instinct was "the oracle is weak" (how do you know a review was good?), but that's solving the wrong problem. The right oracle isn't *review quality* — it's *convergence*: does the PR end up in a state where all persona reviewers approve, CI passes, coverage is maintained, and no seeded issues remain? That's an objective, composite, numeric oracle. And the natural structure gives you everything else: personas decompose into roles (security, performance, readability, test coverage, architecture), the PR-iteration loop is a textbook Ralph loop, different fix strategies race naturally in parallel, and the GitHub Actions endgame is *perfect* for Module 10. This scales through all 10 modules.

**Morning brief — great punchline, weak anchor.** It has one genuine strength: the MCP integration story in Module 10 is *fantastic* (Gmail MCP, Slack MCP, RSS, etc. — it's the canonical "connect Claude to your life" example). But it breaks down at the load-bearing modules. The oracle problem is fatal: "did I get a good brief?" requires human labels every time, and you can't measure *quality* of a summary without a human judge. Module 7 (Ralph loop) barely applies — a brief is one-shot, what does "iterate until done" even mean? Module 8 (racing) feels forced. I'd keep morning brief as a *secondary* example that shows up specifically in Module 10 to demonstrate MCP, but not as the anchor.

## What I'd actually recommend: "PR Assistant"

A refined version of your first idea, explicitly designed to grow through the modules. The project arc: starts in Module 4 as a single reviewer running against a sample repo with seeded issues, grows in Module 5 into a small set of persona sub-agents, earns an oracle in Module 6, starts iterating autonomously in Module 7, and ends in Module 10 as a real GitHub Actions setup that reviews incoming PRs, proposes fixes, and iterates on its own suggestions.

Why this works as an anchor:
- **Universally relatable.** Every engineer has felt the pain of code review. PMs understand it conceptually. Architects care about it at scale.
- **No domain expertise required.** Unlike CWV, nobody needs to learn a new subject to participate. The substance is code quality, which everyone's already internalized.
- **Composite objective oracle.** CI passes + lint passes + coverage maintained + all persona checks clear + seeded issues detected. Not as crisp as a single PSI score, but real and measurable. For Module 6 specifically, you teach oracle design *by building it* — learners see how a composite oracle is assembled from multiple boolean and numeric signals.
- **Clean role decomposition.** Security reviewer, performance reviewer, test coverage reviewer, readability reviewer, architecture reviewer, fix implementer, verifier. You can use as many or as few as the module needs.
- **Bounded and reversible.** PRs are atomic; reverting is free.
- **Ends in something learners would actually deploy.** A GitHub Action that reviews your PRs isn't a toy — it's a thing they'll keep using after the course, which is the best possible outcome for a learning corpus.

Here's how it maps:

| Module | What the anchor looks like |
|---|---|
| M1–3 | Throwaway examples (don't force the anchor in too early) |
| M4 — CLAUDE.md | Single reviewer agent with a `CLAUDE.md` describing the repo's conventions. Sample repo with seeded issues provided. |
| M5 — Sub-agents | Decompose into 3 persona sub-agents (security, perf, readability) within a single session. |
| M6 — Oracle | Build `./oracle.sh <pr-branch>` that returns a composite score from CI + lint + coverage + seeded-issue detection. This artifact is reused everywhere after. |
| M7 — Ralph loop | Headless loop that reviews a PR, applies suggested fixes on a branch, re-reviews, iterates until the oracle is satisfied. Run overnight on a messy PR; review in the morning. |
| M8 — Parallel workers | Given a review comment with multiple possible fixes, race 3–4 fix strategies in separate worktrees. Keep the one that scores best on the oracle. |
| M9 — Agent Teams | Lead coordinates reviewer teammates and fixer teammates via shared task list. Observe the coordination primitives. |
| M10 — Crews + MCP | Package as GitHub Action. Add Slack MCP for "notify me when a PR is ready." *This* is where morning-brief-style MCP integration shows up as a secondary example — the Slack/notification side of the system, not the whole anchor. |

## One alternative worth flagging

If when you walk the path you find the PR oracle too fuzzy for your taste, the cleanest fallback is a **test coverage improver**: agents add tests to an under-tested library, oracle is coverage % plus mutation testing score. Stronger numeric oracle than PR Assistant, but less exciting as a Module 10 finale (GitHub Action that maintains coverage is useful but less of a "wow"). I wouldn't switch to it preemptively — PR Assistant is a better story and the oracle is good enough — but it's in your back pocket if you hit trouble.

## One thing I'd actively avoid

Resist the temptation to make the anchor project too ambitious early. The Module 4 version of PR Assistant should be almost embarrassingly simple — one reviewer, one small repo, maybe 20 lines of `CLAUDE.md`. The whole point is that learners *feel the shape of the problem* before they scale it. If Module 4's anchor is already complex, Module 9's will collapse under its own weight. The seeded-issues sample repo is doing most of the pedagogical work in the early modules; keep the agent side minimal.

Want me to sketch the sample repo structure (the seeded-issues repo that Modules 4–10 all work against)? That's actually the highest-leverage thing to design next, because every module depends on it and getting it right — enough variety to demonstrate different personas, enough realism to feel like real code, small enough to clone and work through in an evening — takes real thought.

---

## Human (Apr 22, 2026, 5:01 PM):

I like the PR assistant idea! And that gives developers something tangible usable at the end of the course. I would also be interested in "eating my own dog food" here, and essentially building the course itself with an agent team, oracle, and possibly an MCP tools (like a wiki integration or similar). What do you think? Is this feasible?

---

## Human:

Yes, feasible — and the meta-layer is actually a great idea, but only if you're honest about where it works and where it doesn't. Let me think through this carefully because there's a real risk of it becoming a distraction that delays the actual curriculum.

## The honest assessment

Writing a 10-module technical curriculum is *not* a naturally good domain for agentic crews, for the same reason the morning brief wasn't: **the oracle is weak**. "Is this module well-written?" is a subjective judgment that only you and your audience can make. There's no CI to pass, no benchmark to hit, no PSI score. This matters because it means several of the patterns the curriculum *teaches* don't fully apply to the curriculum itself. Ralph loops barely make sense. Racing four variants of a module in parallel and picking "the best" requires human judgment on every iteration.

**But** — and this is the saving grace — curriculum production isn't one task. It's a dozen different tasks, some of which are excellent agent territory and some of which aren't. The meta-project works if you decompose it honestly and don't force agents onto the parts that should stay human.

## What's actually good agent work here

Looking at what goes into each module, the genuinely agent-suitable tasks are:

- **Reference gathering and freshness-checking.** Web searches for the latest docs, checking whether cited URLs still work, flagging when Anthropic releases something that should update a module. This is continuous, objective (link returns 200 or it doesn't), and genuinely annoying to do by hand.
- **Sample repo maintenance.** The seeded-issues repo that underlies PR Assistant needs to stay current — CI keeps working, dependencies updated, seeded issues still trigger the personas correctly. This has a real oracle (repo builds, seeds detected).
- **Cross-module consistency checking.** Does the `CLAUDE.md` you wrote in Module 4 still match what Module 7 assumes? Do terminology and command examples stay consistent? Great agent task — deterministic, file-based, boring for humans.
- **Draft-to-polish transforms.** You write a rough draft, an agent produces a cleaner version in the house style. Not autonomous work — you're still the author — but a useful pipeline.
- **Lab validation.** Every lab should be runnable end-to-end from a clean clone. An agent that periodically clones the lab repo, follows the lab's own instructions, and reports where it broke is genuinely valuable. This one has a *great* oracle: "did the lab's stated success criteria get met from a fresh environment?"
- **Publishing pipeline.** Format transforms (markdown → wiki, markdown → blog CMS), metadata, cross-linking. Mechanical.

## What shouldn't be agent work

- **The actual ideas, framing, and voice.** These must come from you, especially since you're learning-by-writing. If an agent writes Module 6 for you, you haven't walked the path — you've just read another explanation of it.
- **Judgment about pedagogy.** What order things go in, when to be gentle vs. blunt, which examples resonate.
- **The "I tried this and it broke" stories.** These are the most valuable parts of technical writing and they literally cannot be agent-generated; they're the residue of you walking the path.

If you keep those three firmly in the human column, the meta-project is not only feasible but pedagogically powerful.

## A realistic meta-architecture

Here's what I'd actually build — calibrated to be useful, not to force every pattern from the curriculum into the meta-layer just because they're there:

A small crew with three or four narrow roles:
- **Reference librarian** — runs nightly, checks cited URLs, searches for new Anthropic posts / Claude Code releases / relevant blog content, files a report of suggested updates to a `curriculum-deltas.md` file. You review and accept/reject. Pure MCP + web search territory.
- **Lab validator** — runs on push to the lab repos, clones fresh, executes the lab's stated steps in a sandbox, reports where the happy path broke. Real oracle. This is the most valuable piece because labs rot silently and painfully.
- **Consistency checker** — runs on any change to the curriculum content, cross-references terminology, code examples, and file paths across modules, flags drifts. Cheap to run, easy to get right.
- **Publishing agent** — transforms your markdown into the wiki format and pushes. Mechanical; deterministic oracle (does the output render? does it match the schema?).

Note what's *not* in that list: a "module author" agent. That's deliberate. Authoring is yours.

## The MCP integration story

Here's where it gets genuinely good. A Confluence (your wiki is already on your connector list) or Notion MCP integration does two things at once:

1. **Real utility for the meta-project** — your publishing agent actually writes modules into the wiki where your teams consume them, and the librarian agent can pull context from other internal wiki pages.
2. **Dog-food artifact for Module 10.** You can literally show learners the MCP integration you built to publish the very course they're reading. The recursion is pedagogically delightful *and* genuine — not a contrived example.

If the internal wiki doesn't have an MCP server yet, GitHub + your markdown files is a perfectly respectable substitute, and you get the PR Assistant itself as the publishing pipeline. Very clean.

## The risk I want to flag

The single biggest risk is that the meta-project becomes a procrastination engine. Building the crew is more fun than writing Module 2 on context management. I've watched smart people spend three months perfecting their writing tooling and producing zero writing.

Protection against this: **write Modules 1–4 entirely by hand, no meta-crew, before you build a single agent for the meta-project.** By the time you've hand-authored four modules you'll know what actually hurts about the process and what would be genuinely useful to automate. If you build the crew first, you'll automate imagined problems. Also, having four solid modules done gives you material to *test the meta-crew against* — the lab validator has labs to validate, the consistency checker has modules to cross-reference, etc. It also means if the meta-crew turns out to be a dud, you've still shipped four modules.

Then from Module 5 onward, you can start introducing crew members as you reach the modules that teach their patterns — building the librarian around Module 7 (headless + Ralph), the lab validator around Module 6 (oracles), the publishing agent around Module 10 (MCP). The meta-crew grows in parallel with the curriculum's own escalation, which is *itself* a pedagogical story you can tell in the curriculum. "Here's Module 7 on headless mode — and by the way, this module's own reference-freshness check was built using the pattern you're about to learn."

## One more thought: what to call this in the curriculum

Don't hide the meta-layer. Make it a running subplot. Each module could have a short "behind the scenes" note: *"This module's labs were validated by an agent built using Module 6's oracle pattern. Here's the oracle it uses."* That turns the meta-project from an author's convenience into a teaching artifact, and it gives every module an additional worked example that the reader didn't have to construct themselves. For a mixed audience where engineers want concrete examples and PMs want to see how this applies to real work, that subplot is probably worth more than the average module's primary content.

Feasibility verdict: yes, absolutely, with the two guardrails — hand-write the first four modules before building any meta-crew, and keep authorship/voice/pedagogy firmly human. The rest is a gift.

---

## Human (Apr 22, 2026, 5:12 PM):

All of this is excellent feedback. I'm just worried about having to write the Modules myself… at the moment, I have no idea about all of this. I'm happy to learn each module before we write it based on reading material you give me as reference, and potentially following steps you give me to do it… but intuitively, I would kinda lean towards you to give me:

* a good reference structure to follow for each module
* the overall high-level bullet point structure to follow
* the prose itself
* the concrete examples to document
* etc.
I would be happy to share my failings along the way as addendum for each module essentially, and I can also guide for the overall tone to follow… but I'm not sure how to do the rest to be honet

---

## Human:

I hear you, and I want to push back gently before we settle this — not to talk you out of getting help from me, but because the specific thing you just described has a failure mode I've seen enough times that I'd be doing you a disservice not to flag it.

## The honest problem with me writing the prose

If I write the prose, the structure, and the examples, and you add "failings along the way as addendum," what you'll produce is a *competent* technical curriculum that reads like 60% of the Medium posts on this topic. That's not nothing. But it won't be the thing your teams actually need, and here's why.

The curriculum you're describing — mixed audience, Adobe-internal, meta-project dog-fooding — has exactly one thing that distinguishes it from the hundreds of existing Claude Code tutorials out there: **it's written by someone who works on martech and EDS at Adobe, walking the path in public, making specific mistakes a specific audience will recognize.** The "failings as addendum" you're treating as the small part is actually the *entire* unique value proposition. Everything else is commodity content that anyone with Claude access could produce.

If I write the prose, I'll write it in the default AI-curriculum voice — clean, structured, slightly bloodless. Your readers will sense it. PMs and architects in particular are *extremely* good at detecting this; they read a lot of AI-generated content these days and their tolerance is dropping fast. The thing that makes internal Adobe content land is that it sounds like it came from someone down the hall, not from a blog aggregator.

## What I think is actually going on

You said "I have no idea about all of this" and I want to reframe that, because I don't think it's true in the way you mean. You already have:

- A working understanding of Claude Code from prompting and spawning simple agents
- The entire martech-to-EDS migration work, which you specified well enough that Astha could act on it
- Enough context to immediately recognize that CWV was a better oracle-domain than the migration (that wasn't a guess — that was real judgment)
- Enough skepticism to push back on me twice in this conversation (CWV too niche, morning brief → PR assistant)

What you don't have yet is Module 7, 8, 9, 10 territory — multi-agent orchestration, Ralph loops, headless at scale. You have Modules 1–5 in your head already, you just haven't written them down. The earlier modules are not a knowledge problem for you. They're a blank-page problem, which is different.

## What I'd actually propose

A collaboration model that is *not* "you write, I fill in" and *not* "I write, you annotate." It's closer to a co-authoring setup where my job is to eliminate blank pages and yours is to make the content sound like you:

**Per module, my side:**
- Full reference structure, section by section, with word-count guidance
- A detailed *outline* — bullets with real substance, not placeholders — so you know exactly what each section argues
- Reference material curated and summarized, so you don't start from a web search
- **Draft prose for the setup sections** — the definitions, the background, the mechanical parts. These are safe to AI-draft because they're commodity content and everyone expects them to sound standard.
- Suggested concrete examples, including code
- The lab design, repo structure, and success criteria
- A "hard parts" checklist: the 2–4 places in this module where *you specifically* need to write, not me, and why

**Per module, your side:**
- The opening — whatever hooks the reader, in your voice
- The "hard parts" I flag — typically the judgment calls, the "why does this matter," the pushback against common mistakes
- Your own walk-through: what you tried, what broke, what surprised you
- A pass over the whole thing to make it sound like you wrote it (even the parts I drafted)

This is maybe 30–40% of the writing work staying with you, concentrated on the parts that are load-bearing for authenticity, with the scaffolding entirely on me. Critically, the parts I ask you to write are *short* — we're talking 200–500 words of "your voice" per module, not 3000. A module with a strong 300-word personal opening and 200 words of genuine "here's what bit me" in the middle is indistinguishable from one you wrote from scratch, because those are the parts readers remember.

## What this looks like for Module 1

To make this concrete rather than theoretical — if we started tomorrow, I'd send you:

1. A reference structure: hook → frame-setter → the core misconception → what prompting actually is → the five patterns that matter → lab handoff. ~2500 words total.
2. Draft prose for the frame-setter, the core misconception section, and the five patterns (~1700 words).
3. Curated references with my summaries of what each one offers.
4. Three concrete example prompts I'd use, with the rewrites.
5. Complete lab design.
6. A "hard parts" note: *"The opening hook and the 'core misconception' transition need to be yours. The hook because openings set voice, the transition because you need to pick a misconception you've personally held — mine will ring false. ~400 words total."*

You then spend maybe two hours on Module 1: 30 minutes reading my draft, an hour writing the 400 words that need to be yours, 30 minutes doing a voice pass on my draft sections. That's a tractable weekly commitment for a slow-burn curriculum.

## One thing I want you to consider honestly

The meta-project from the last message becomes *more* important, not less, under this model. Because if the meta-crew handles lab validation, consistency checking, reference freshness, and publishing, then your time is freed up for the one thing that actually requires you: sounding like you. The meta-project isn't just dog-fooding — it's the thing that makes this whole collaboration sustainable for you as one human with a day job.

So my proposal is: **this model, hand-authored by this model for Modules 1–4, meta-crew introduced from Module 5 onward** (consistent with what we agreed last message), and the "hard parts" sections are where you do most of your learning-by-writing.

Does that feel workable, or does it still feel like too much on your side? If it's still too much, tell me which specific parts feel too heavy and we can rebalance — but I want to protect the voice-and-authenticity axis because without it, there's not much point writing this as opposed to just bookmarking the existing content.

---

## Human (Apr 22, 2026, 5:17 PM):

It definitely sounds more doable. I also wonder if feeding you some of the material I wrote over the years could help you build a model of my "voice" in a sense that would also help immediately guide the prose generation, or alternatively have a prose reviewer profile with that knowledge.

---

## Human:

Yes on both counts, and they're actually different tools for different jobs — worth being deliberate about which one you use where.

## What voice calibration can and can't do

Let me be honest about the ceiling first, because voice transfer is one of those things that looks easier than it is. Giving me 10-20 samples of your writing reliably gets me to *structural* voice — sentence rhythm, paragraph length, how you open sections, whether you use lists or prose, your level of formality, whether you write in first-person, how you handle technical density, your humor register. That's roughly 70% of what readers perceive as "this sounds like Julien."

What it doesn't give me, and no amount of samples will, is your *specific opinions* — the load-bearing takes that make a piece feel authored rather than synthesized. "Most people overthink this" hits differently when it's you saying it because you've earned that opinion; I'd just be pattern-matching. So the "hard parts" I flagged in the last message remain hard parts even with voice samples. But voice samples meaningfully reduce the amount of rewriting you need to do on my draft sections, which was the main cost you were worried about.

Worth calibrating too: voice samples *degrade* over a long conversation. I'll sound most like you in the first module we write together and drift over time as more of the conversation becomes me-talking-to-you. The prose reviewer pattern fixes this, which is the next section.

## Two tools, two different jobs

**Voice calibration up-front** is about the *drafting* model — so when I write the commodity sections, they already sound closer to you, and your voice pass takes 20 minutes instead of an hour. This is a one-time setup: you give me samples, I build a voice notes document we both reference, and every module draft starts from that.

**A prose reviewer profile** is about a *second opinion* on finished drafts — a separate Claude session, loaded only with your voice samples and a reviewer brief, whose job is to read the final module and flag places where it sounds un-Julien. This is run per module, at the end, before you ship. It's not the same thing as voice calibration on the drafting side because reviewers catch different things than drafters do — drafters produce, reviewers spot-check.

I'd strongly recommend both. They compound. Drafting-with-voice reduces how much the reviewer has to flag; the reviewer catches what drift remains.

## What samples to give me

More is not better past a point. What matters is *range* and *recency*:

- **5-8 pieces** is the sweet spot. Past ~10 the marginal value drops fast.
- **Span at least two registers** — if you've only written formal technical docs, include some Slack messages or GitHub comments to capture how you sound when you're being direct. If you've only written casual posts, include a formal proposal. Readers of your curriculum will see you in mixed registers; I need both.
- **Recent.** Voice drifts. Last 1-2 years is ideal. A blog post from 2018 might read differently than how you'd write today.
- **Include at least one piece you're proud of and one you'd rewrite if you could.** I need to see both what you're aiming at and what you consider "not quite right."
- **The martech-to-EDS spec document you drafted for Astha is probably a strong candidate** — it's recent, it's the register closest to what the curriculum needs (technical guidance with a real audience), and you've already iterated on it.

What *not* to include: heavily-edited work where the final voice is really the editor's, conference talk transcripts (speaking voice and writing voice diverge more than people think), anything that was itself AI-assisted.

## How I'll actually use them

I'll read through and produce a short "voice notes" document — maybe 500 words — that captures what I observe: sentence length distribution, characteristic moves (e.g., "Julien tends to open sections with a concession before making his point"), vocabulary patterns, things he avoids, tone range. You review it, correct anything that misses, and this becomes the thing we both reference for every module. It's short enough to stay in context without eating budget, and concrete enough to actually steer drafts.

One explicit thing I'll watch for and *not* imitate even if it shows up in samples: if you have any tics you're trying to move away from (everyone does), flag them. The voice notes should capture who you're becoming as a writer, not freeze who you were.

## The reviewer profile specifically

For the reviewer, I'd set it up as a standalone system prompt you can paste into a fresh Claude session any time, containing:

- The voice notes document
- 2-3 of the strongest samples as reference
- An explicit reviewer brief: *"Your job is not to improve the writing. Your job is to flag sentences and sections that don't sound like the author. Quote the specific sentence, explain what's off about it, and suggest a rewrite only if you're confident. When in doubt, flag rather than rewrite."*

The "don't improve, just flag" framing matters because reviewer agents otherwise drift into general editing and you lose the voice-specificity. You want a narrow tool here.

The reviewer also slots naturally into the meta-crew we discussed — it becomes one of the agents, alongside the lab validator and consistency checker. And it's genuinely useful as a teaching artifact for Module 10 (here's an MCP-less, purely-prompt-based agent with a real job that you built using the patterns from earlier modules).

## Practical next step

Before we commit to writing any modules, send me the 5-8 samples. I'll produce the voice notes document, you correct it, and we have the scaffolding in place. That's a 1-2 hour investment that will pay back across all 10 modules.

If you want to do this in the current conversation, just paste or upload — I can work with either. If you'd rather keep this conversation focused on curriculum architecture and start a fresh conversation for voice work, that's also reasonable, as long as the voice notes document comes back here when it's ready so we can reference it when we start Module 1.

One small nudge: don't over-curate the samples. Your instinct will be to send me the ones you think are best-written, which will bias the voice notes toward your aspirational voice rather than your actual one. A mix of "proud of this" and "this is just how I write on a Tuesday" produces better calibration.

---

## Human (Apr 22, 2026, 5:22 PM):

Could you actually access my slack over Chrome and search for some good threads I was active in recently? And same for a few wiki pages I authored last year or so (a lot of what I did this year was llm generated and without voice calibration)?

---

## Human:

I can try — I have Chrome control tools available (Slack's a web app, so that works in theory) and a wiki tool that should work for Confluence. But there are some real constraints worth flagging before I start so you can decide if it's worth the effort.

**Constraints on my side:**

- The Chrome tool controls *your* browser — so whatever Slack workspace you're currently logged into is what I can see. I can't pick which workspace; it's whatever's in your active Chrome session.
- I can't judge which threads are representative of your voice. I can pull threads where you were active, but "good threads" is your judgment. The best I can do is pull a batch and let you cull.
- Volume matters for voice calibration but volume of *low-signal* messages ("thx", "+1", "can you take a look?") actively hurts calibration — they'll bias me toward thinking you write in fragments. So I'd want to filter for your longer, more substantive messages.
- The wiki tool should work if your pages are on the Confluence instance it's connected to — I won't know until I try.

**A better approach than blind scraping:**

Rather than me fishing around hoping to find good material, let me propose this: you tell me 3-4 *specific* anchors — a Slack channel name where you post substantively, a wiki space or a couple of page titles you remember writing, maybe a specific thread topic if you recall one — and I'll pull targeted content from those. This is much more likely to surface the material you'd actually want calibrated against, and it avoids me burning time scraping "Julien said 'sounds good'" 200 times.

**One thing to think about before we start:**

The Slack content you're active in is probably mixed register — some of it is casual Tuesday-afternoon voice, some of it is more considered. For curriculum voice calibration specifically, the more considered Slack messages (longer explanations, technical discussions, disagreements you worked through carefully) are worth 10x what the quick reactions are. If you can remember a specific thread where you wrote a long explanation of something, that's gold. Your day-to-day Slack isn't going to give me what the curriculum needs.

The wiki pages are probably more immediately useful — longer-form, considered, technical register closer to what the curriculum will be. I'd start there if I had to pick one source.

**My suggestion for how to proceed:**

1. You give me 2-3 wiki page titles you remember authoring, and I'll fetch them via the wiki tool first (lower friction, probably higher signal).
2. If that gives me enough to work with, we skip Slack entirely — you already said you have the martech-to-EDS spec doc, and 3-4 wiki pages plus that doc is probably plenty.
3. If the wiki content is thin or off-register, then we bring Chrome + Slack into play, with specific channel or thread pointers from you.

Does that work? If yes, drop the wiki page titles (or URLs if you have them handy) and I'll start there.

---

## Human (Apr 22, 2026, 5:29 PM):

Ok, some wiki references for you:

* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3288190142/Improving+performance+of+the+Launch+WebSDK+integration

* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3747042036/Sites+-+Optimizer+Summer+Internship+2026+US
   * specifically the "Contextual Personalization" and "Agentic page redesign with Google Stitch + Claude Code" table entries

* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3660844254/Tiered+validation+for+Code+Fixes
* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3439829549/Requirements+for+a+cookie+consent+solution
* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3239931462/Research+Modifying+content+directly+in+MS+Sharepoint+Google+Drive
* https://wiki.corp.adobe.com/spaces/AEMSites/pages/3058062155/AEM+Experimentation+integration+with+Target+VEC+and+AJO+Campaigns

---

## Human:

Let me pull these. I'll fetch them one at a time so I can see what's actually there and flag any that fail.The wiki tool is failing with a TLS certificate error — it looks like the MCP server can't verify Adobe's internal wiki cert from where it's running. I tried the full URL and the page ID alone; both hit the same error. This is an infrastructure issue, not a permissions one, and it's not something I can work around from my side.

A couple of options for how to proceed:

**Easiest — you paste the content directly.** Open each of those six pages, copy the rendered text (not the storage-format source), and drop it into the chat. Six pages is a bit of bulk but Confluence's "copy page" from the `…` menu usually gives clean markdown-ish output. This is the lowest-friction path and I can start calibrating immediately. If pasting all six feels heavy, the three I'd prioritize for voice calibration specifically are:

- **Tiered validation for Code Fixes** — sounds like a design/opinion piece, likely the highest signal for voice
- **Requirements for a cookie consent solution** — requirements docs force you to be precise, good calibration material
- **Improving performance of the Launch WebSDK integration** — technical writeup, probably the register closest to the curriculum

The other three are nice-to-haves once I have those.

**Alternative — Chrome route.** I do have Chrome control tools. If you'd rather, you can tell me you're logged into the wiki in Chrome and I can try to navigate there and extract text page by page. This will work, but it's slower, chattier, and extracts less cleanly than a paste.

**Not worth doing — asking your ops team to fix the MCP cert issue.** Could be days of back-and-forth for a one-time need.

My recommendation: paste the three priority pages. I'll produce the voice notes draft from those, and we decide whether the other three are needed after you see the first pass. If the first three give me enough signal (they should), we don't need the others — and if they don't, the ones you didn't paste probably wouldn't have rescued it either.

One note on copy-paste: Confluence sometimes adds formatting noise (weird bullet characters, extra whitespace from macros). Don't worry about cleaning it up — I'd rather see the raw paste than have you spend time tidying. I'll filter the noise.

---

## Human (Apr 22, 2026, 5:32 PM):

Try accessing the wiki again

---

## Human:

The wiki tool is working now. Let me pull the other pages.Got all six. Tool's working now. Let me share what I extracted and be honest about what's there vs. what's missing for curriculum purposes.

## Voice notes (draft) — Julien

**Structural habits**
- Opens with a framing section: "Context," "Use Case," or "Problem Statement." No throat-clearing, straight to the situation.
- Tables everywhere. Anything with more than three comparable items becomes a table — customers × features, tasks × status, tiers × validation-step.
- Frequent use of H2 headers with light H3 nesting. Doesn't over-structure.
- Common flow: stakes/context → current state → what's wrong with it → proposed solution → open questions.

**Sentence shape**
- Medium-length sentences, occasionally long ones joined by "and" or comma-chains. Not Proustian, but willing to let a sentence breathe if the point is connected.
- Parenthetical clarifications are a signature — uses `i.e.` and `e.g.` constantly, and often scopes terms with "(typically…)" or "(in our experience…)."
- Quantitative whenever possible: `20~40pts`, `~600ms`, `<10ms`, `150KB`. Prefers a specific number over a hedge.

**Vocabulary patterns**
- Overuses **"essentially"** and **"typically."** These show up everywhere. Both are tics worth thinning in curriculum prose — they're fine sprinkled in, grating if stacked.
- Uses scare-quotes for qualifying a loaded term: *"ideal" performant solution*, *"simple" library*, *"phases"*. A characteristic move — it signals "I know this word is doing a lot of work here."
- **"We"** as default subject. Collaborative framing, even for individually-authored docs.
- Concession-then-point openings: *"While it is technically feasible to… this typically involves…"* This is a strong rhetorical move you use unconsciously.

**Register**
- Pragmatic, not performative. No motivational framing, no abstract "best practices."
- Opinionated but grounded — opinions come attached to a number, a customer, or a specific repo link. Rarely a naked assertion.
- Honest about tradeoffs by default. "The COGS would be too expensive." "Requires more involvement with customer IT." You state constraints without editorializing.
- Not funny, not dry. Measured.

**What you avoid**
- Narrative anecdotes
- "I believe" / "it seems" — replaced with a number or a specific observation
- Lyrical flourishes, metaphors extended past a sentence
- Capitalized Concept Names ("The Way of Orchestration") — you'd find this pretentious

## The gap I need to flag

Everything I pulled is **doc-register** — wiki pages written for structured internal consumption. It's strong signal for structure, vocabulary, and how you handle technical claims. It's weaker signal for the register the curriculum actually needs, which is closer to what you've been writing in *this* conversation: more exploratory, willing to admit uncertainty, readier to concede, more first-person, more "let me think through this out loud."

Concretely — the curriculum Module 1 opener won't sound like the Launch WebSDK intro. It'll sound like how you write when you're talking through a problem with someone, not documenting a solution for one. I have the first voice from the wiki; I don't yet have the second in samples (I have it from this chat, but chat is biased by my prompts and therefore unreliable as calibration).

## What would close the gap

Ideally one of these:

- A longer-form internal blog post or newsletter piece you wrote in a more conversational register
- Slack threads where you wrote long explanations (the substantive ones, not "+1")
- A talk script or meeting prep doc where you were working through an argument rather than presenting a conclusion

If none of those exist, the cleanest fix is: **write the Module 1 opening section yourself, cold, without my help, maybe 300 words**. I'll use that as the missing calibration sample for the conversational register going forward. You'd have had to write that part anyway (it was on your "hard parts" list), so it's not extra work — it just has to happen before I start drafting the commodity sections of later modules.

## My recommendation for next step

Two things in sequence:

1. You confirm or push back on the voice notes above. If anything feels wrong ("I don't actually do that" / "I'm trying to move away from X"), tell me — this document should reflect the Julien you're becoming, not a frozen snapshot.
2. You write a cold 300-word opening for Module 1. Just a first draft, no polish. This gives me the conversational-register calibration sample I'm missing and, as a bonus, de-risks the whole project — we'll find out early whether you actually enjoy writing this kind of thing, which matters for whether the curriculum is sustainable.

Then I have everything I need to start producing Module 1 scaffolding in your voice.

---

## Human (Apr 22, 2026, 5:42 PM):

Ok, here are a few threads I was able to extract. Does that help? Do you need more?

---

## Human:

Yes, that's exactly the register I was missing. Three threads is plenty — I can see the conversational-voice Julien clearly now, and combined with the wiki samples I have a much fuller picture. No need for more samples.

## Updated voice notes

**What I confirmed**
- `essentially` and `typically` tics: confirmed, and even heavier in casual register than in docs. Both need deliberate thinning in curriculum prose.
- Concession-then-point openings: confirmed as a signature move. *"While it is technically feasible... this typically involves..."* and *"Good point! I was still thinking about AEM CS, but this is EDS"* are the same rhetorical shape at different registers.
- Grounded in specifics — always a URL, a line number, a commit hash, a number.

**What's new from the Slack threads**

- **"In a nutshell:"** is your signature explanation opener, followed by a numbered list. Used multiple times across threads. This is the teaching template. Curriculum sections that need to unpack a mechanism should probably use this shape.
- **Direct concession without self-flagellation.** "Good catch! I learned something :)" / "Good point!" / "skipped my mind, but yes…" — you admit you were wrong, acknowledge what the other person added, and move forward. No ritual apology. This is a *specific voice quality* that I couldn't have inferred from the wiki alone. It should show up anywhere in the curriculum where you're talking about things you got wrong initially (which will be many places, if we're doing this honestly).
- **Restating to confirm alignment before answering.** "So the question is just what these 3 categories influence?" / "So you are pushing actual 'events' to ACDL right? and you just don't want them forwarded to AEP?" — you rephrase, confirm, then answer. Great pedagogical move; we'll use it in curriculum Q&A sections.
- **Clarifying questions back.** "What timelines are we looking at?" / "What is a fake event for you?" — when the problem is underspecified, you ask before assuming. Will show up in the "before you start" sections of module labs.
- **Pros/cons as an explicit structure**, even in chat. The response to Ive Andric on AEM Experimentation has literal `Pros` / `Cons` headers in a Slack message. You reach for structured comparison even in casual contexts. Good for curriculum — tradeoff sections will fit your voice naturally.
- **"You'd need to..." / "You'd have to..."** for walkthroughs. Second-person conditional. This is the natural voice for lab instructions — not imperative ("do X"), not passive ("X should be done"), but conditional-guiding.
- **Light smileys** — `:slightly_smiling_face:`, `:sweat_smile:`, `:wink:`. Used sparingly, usually to soften a caveat or acknowledge a minor error. I'll avoid these in written curriculum prose (different medium), but the *tone they represent* — friendly, not performatively serious — transfers.
- **Self-effacing without being self-deprecating.** "I sometimes forget disabling them and then waste hours debugging issues against the wrong code" — you share your own friction casually. Massive pedagogical value. The "what bit me" addenda you've been planning are already natively in your voice.

**Register shift between wiki and chat**

The wiki-voice is doc-register: structured, terse, precise, third-person-ish ("we") with tables doing structural work. The chat-voice is the same personality but with more contractions, more first-person, more acknowledgment of the other person, more "I'd probably..." hedges that scope claims rather than weaken them.

**Curriculum prose will need both**, and I now know how to mix them:
- **Doc-register** for the structured sections — pros/cons, tradeoffs, patterns, step-by-step.
- **Chat-register** for the openings, transitions, "hard parts," and the failure-addenda you're planning to write.

**Tics to actively avoid in drafts**
- `essentially`, `typically`, `basically` — strong tendency to stack these. I'll use one per paragraph at most.
- Double-qualifier sentences: "It is essentially typically used for..." — there's one pattern like this in the threads. Draft will thin aggressively.

## What I can now do with this

I have enough to draft curriculum prose in your voice without needing the 300-word cold sample I asked for earlier. That ask was a hedge against missing the conversational register; the Slack threads covered it. You're off the hook for the cold draft — though you might still find it useful as a warmup, entirely your call.

## Recommended next move

Module 1 scaffolding. I'll produce:

- Full reference structure, section by section
- Detailed outline with real substance, not placeholders
- Draft prose for the commodity sections (definitions, framing, the "five prompting patterns," lab handoff)
- Curated references with my own summaries
- Concrete examples including the three bad-prompt rewrites for the lab
- Complete lab design with success criteria
- A "hard parts" note flagging 2-3 specific spots (~300-400 words total) that need your voice, not mine, with a brief explanation of why each one is yours

Estimated output: ~3000 words of Module 1 scaffolding + ~800 words of lab repo design. I'd produce it in a single response unless you want it in stages.

Ready when you are — just say "go" and I'll draft Module 1. If you want to adjust scope first (more/less in my court, different module to start with, different register), tell me before I start.

---

## Human (Apr 22, 2026, 5:46 PM):

Before we do anything further. Should I set up a Project in Claude chat now for this, and we can define some artifacts and have separate sessions for each module.
Or should I move this over to Claude Code, and directly set up a github project for all of this and we move the discussion over there with proper CLAUDE.md, skills, agent definitions, etc.?
What would be the best structure to get us started?

---

## Human:

Good question to ask before we start building — wrong choice here will cost you meaningfully. Let me think through it honestly rather than defaulting to the cooler option.

## The actual tradeoff

**Claude Projects** is a knowledge-and-context container. You can put files in it (voice notes, curriculum outline, existing modules, reference material), set a project system prompt, and every new conversation in the project starts with that context pre-loaded. It's designed for "I'm doing ongoing work on topic X and want consistency across sessions." No agents, no orchestration, no code execution unless you enable it inside the chat.

**Claude Code + GitHub repo** is a working environment. It has real file operations, `CLAUDE.md` as native context, sub-agents, skills, the ability to run lab code, git as version control, and a path to the meta-crew we discussed. It's designed for "I'm building something with real artifacts and want agents helping."

These are not the same tool doing the same job at different intensities. They serve different phases.

## What I'd actually recommend

**Both, sequentially. Claude Projects now. Claude Code when you have content to eat your own dog food on.**

Here's why, concretely:

**Right now, you have no curriculum.** You have notes, voice samples, a structure in our chat history, and zero written modules. Setting up Claude Code, a GitHub repo, `CLAUDE.md`, skills, and sub-agent definitions before you have content to operate on is **exactly the failure mode I warned about two messages ago** — the meta-project becoming a procrastination engine. You'd spend a week on scaffolding and produce zero modules. I have watched smart people do this and I will be doing you a disservice if I let you walk into it.

**Projects is also the pedagogically correct starting point for the curriculum itself.** Module 1 is "prompting as a design problem." Module 2 is "context is the product." Module 3 is "from chat to Claude Code." You are literally writing a curriculum that argues people should master single-Claude-in-a-browser context management before moving to Claude Code. If you skip that phase yourself, you can't write those modules honestly. Walking the path in Projects *is* the research for Modules 1–3.

**Claude Code comes in at Module 4.** That's the "from chat to Claude Code" transition in the curriculum, and it's also when the meta-project starts earning its keep — you have 3 written modules to eat-your-own-dog-food against, a working `CLAUDE.md` to demonstrate, and enough content that the consistency-checker and lab-validator agents have something to check and validate. Starting Claude Code before Module 4 is starting it before you have anything for it to do.

## What the Project should contain

Set up the Project today with these artifacts:

1. **Voice notes document** — the updated voice notes from this message. Top of the context.
2. **Curriculum outline** — the 10-module structure we settled on, with the PR Assistant anchor project, tier breakdowns, and which modules are publishable-standalone.
3. **Voice samples** — the 5 wiki pages I pulled + the 3 Slack threads. Raw, unedited. I'll re-reference these as I draft.
4. **Project system prompt** — a short brief: who you are, who the audience is (Adobe-internal, mixed technical staff), the collaboration model (I draft commodity sections, you write hard parts, you do final voice pass), and explicit guidance to avoid `essentially` / `typically` / `basically` stacking.
5. **A "decisions" file** — the calls we've already made (CWV dropped as anchor, PR Assistant confirmed, meta-crew from Module 5, module order, spiral authorship). Keeps future sessions from re-litigating things.

That's it. No agents yet, no repo, no `CLAUDE.md`. Five files.

## How sessions work inside the Project

One session per module is the right granularity. Each module gets a fresh conversation: "Draft Module 1." The Project auto-loads voice notes + outline + samples + decisions, so every session starts pre-calibrated. When a module is done, you save the final draft back into the Project as a new artifact (so Module 2's session can reference Module 1's actual finished prose for consistency).

One thing to watch: as finished modules accumulate, the Project's file set grows. Past ~6 modules you may start hitting context pressure, at which point you add only the outlines of finished modules to the project files and keep the full drafts in a separate location Claude can fetch on request. But that's a Module 6 problem, not a today problem.

## The migration to Claude Code, when it happens

Around Module 4, you'll set up the GitHub repo for the curriculum itself. At that point:
- The Project's artifacts get exported and become the seed for the repo
- `CLAUDE.md` gets written (this is itself Module 4 material — you'll write it as a worked example)
- The meta-crew starts — first the lab validator (because by then the PR Assistant sample repo exists and labs need validating), then the consistency checker, then the librarian
- Future module drafting happens in Claude Code with the repo loaded, because by then you benefit from real file operations and agents

This transition is itself a teachable moment and should probably become part of Module 4's "here's my actual workflow" section. Readers see you moving from Project to Claude Code at the exact moment the curriculum argues they should.

## One concrete thing I'd push back on

You said "have separate sessions for each module" in the Projects option and "proper `CLAUDE.md`, skills, agent definitions, etc." in the Claude Code option — as though the two are parallel in capability. They're not. Sessions in Projects are a *lighter* coordination mechanism than agents in Claude Code, and that's a feature at this stage, not a limitation. You don't want agent coordination overhead while you're still figuring out what the modules should say. Sessions-with-shared-context is the right unit of work until you have enough content that coordination actually matters.

## My call

Set up the Project today. Five files. I'd suggest naming it something boring and descriptive like "Agentic Learning Path — Curriculum Authoring" rather than something clever — the latter ages badly and you'll see this name every time you open Claude for the next six months.

Then start a new session in the Project with "Draft Module 1 scaffolding." I'll produce the ~3000-word scaffold I described. You write the hard parts. We ship Module 1. Rinse and repeat through Module 3. Around Module 4, we migrate to Claude Code and the meta-crew starts.

If you disagree with staging it this way and want to jump straight to Claude Code, I'll do it — but I want you to hear the case for not doing that first, because the cost of the wrong choice here is 1-2 weeks of scaffolding work that produces nothing publishable.

---

## Human (Apr 22, 2026, 5:49 PM):

What description should I use? What artifacts should I port from this discussion over so the project has them as context

---

## Human:

Here's everything production-ready. Five artifacts: the project description itself (paste into project settings), plus four files to upload.

## Project name

`Agentic Learning Path — Curriculum Authoring`

Boring and durable. You'll be looking at this name for six months; a clever name would age badly.

## Project description (paste into instructions)

```
You are helping Julien Ramboz author a 10-module learning curriculum on Claude
and Claude Code, progressing from single-Claude prompting to multi-agent
orchestration. Primary audience is Adobe-internal mixed technical staff (PMs,
architects, engineers). Some modules will be publishable externally with
minor adjustments.

## The collaboration model

Julien is walking the learning path himself as he writes. You produce
scaffolding and commodity prose; he writes the load-bearing sections where
voice and personal experience matter.

Your side per module: full reference structure with word-count targets,
detailed outline with real substance, draft prose for definitions /
background / mechanical explanations / pattern summaries / lab handoffs,
curated references with your own summaries, concrete code examples, complete
lab design, and a "hard parts" checklist flagging 2-4 spots that need
Julien's voice with rationale.

Julien's side per module: opening hook, the hard parts you flag, his own
walkthrough of what broke, and a voice pass over the whole thing. Target is
roughly 30-40% of prose staying with him, concentrated on authenticity-
load-bearing parts.

## Voice

Full voice notes are in project files. Drafting rules:

- Medium-length sentences; let them breathe when ideas connect. Parenthetical
  clarifications with i.e./e.g. are characteristic.
- Quantitative over hedged. Specific numbers beat vague modifiers.
- Concession-then-point openings are a signature move.
- "In a nutshell:" followed by a numbered list is the preferred teaching
  template.
- Second-person conditional ("you'd need to...") for walkthroughs. Not
  imperative, not passive.
- Admits mistakes directly without self-flagellation.

Actively thin these tics (Julien overuses them in source samples, max one
per paragraph): essentially, typically, basically, actually.

Avoid: motivational framing, abstract "best practices" without a named
practice, lyrical metaphors extended past a sentence, Capitalized Concept
Names, emoji in curriculum prose.

Use doc-register (structured, terse) for pattern summaries and tradeoff
sections. Use chat-register (contractions, first-person, hedged scoping) for
openings, transitions, and failure anecdotes.

## Running a module session

When Julien starts a session with "Draft Module X scaffolding":

1. Load the module's position from the curriculum outline file
2. Produce full scaffolding in a single response (~2500-3500 words for
   concept post, ~500-800 for lab design) unless he asks for stages
3. End with the hard-parts checklist

When Julien returns with his drafted hard parts: voice pass the assembled
draft, flag unintentional tic stacking, check cross-module consistency
against finished modules in project files.

## Pushback

Julien explicitly wants honest pushback, not agreement. Tell him when:
- A direction contradicts a locked decision in the decisions log
- The module is drifting outside its declared scope
- A section he drafted doesn't sound like him (reference voice samples)
- He's over-engineering the meta-project or anchor project

Locked decisions in the decisions-log file should not be reopened casually;
if he raises one, ask why before re-litigating.
```

That's ~500 words. Sits in every session's context, so I kept it as tight as I could while still carrying the load.

---

## File 1 — `voice-notes.md`

```markdown
# Voice Notes — Julien Ramboz

Calibration document for curriculum drafting. Based on 5 wiki pages and 3
Slack threads spanning 2023-2025.

## Structural habits

- Opens technical docs with "Context," "Use Case," or "Problem Statement."
  No throat-clearing.
- Common flow: stakes/context → current state → what's wrong → proposed
  solution → open questions.
- Tables for anything with more than 3 comparable items.
- H2 headers generously, H3 sparingly. Doesn't over-nest.
- "Wishlist" or "Suggested Solutions" instead of "Recommendations."

## Sentence shape

- Medium-length sentences. Willing to let one breathe when ideas connect
  with "and" or comma-chains.
- Parenthetical clarifications with `i.e.` and `e.g.` are characteristic.
- Quantitative over hedged: `20~40pts`, `~600ms`, `<10ms`. Specific number
  beats vague modifier.
- Scare-quotes for loaded terms: *"ideal" performant solution*, *"simple"
  library*. Signals "this word is doing more work than usual."

## Vocabulary patterns

- "We" as default subject, even for single-authored docs.
- Concession-then-point openings are a signature: *"While it is technically
  feasible... this typically involves..."*, *"Good point — I was thinking
  about X, but this is Y."*
- "In a nutshell:" followed by numbered list is the teaching template.
- "You'd need to..." / "You'd have to..." for walkthroughs — second-person
  conditional, not imperative, not passive.
- Smileys sparingly in chat (soften caveats), never in curriculum prose.

## Register

- Pragmatic, not performative. No motivational framing. No abstract "best
  practices."
- Opinionated but grounded — opinions attached to a number, a customer, or
  a repo link.
- Honest about tradeoffs by default. States constraints without editorializing.
- Admits mistakes directly, without self-flagellation: "Good catch, I learned
  something" / "Skipped my mind, but yes..."
- Restates before answering when the question is underspecified: "So the
  question is just what these 3 categories influence?"

## Register split

Two registers exist in the source samples; curriculum will mix them
deliberately.

**Doc-register** (wiki voice): structured, terse, precise, third-person "we,"
tables doing structural work. Use for pattern summaries, tradeoff sections,
step-by-step instructions.

**Chat-register** (Slack voice): contractions, first-person, hedged scoping
with "I'd probably..." or "I'd look at...", direct acknowledgment of the
other person. Use for openings, transitions, "what bit me" stories.

## Tics to actively thin

Julien overuses these in source samples. Max one per paragraph:

- `essentially`
- `typically`
- `basically`
- `actually` (runs hot when conceding a point)

Watch also for double-qualifiers ("It is essentially typically used for...")
which stack these.

## What Julien avoids

- Lyrical flourishes, metaphors extended past a sentence
- Motivational framing
- Abstract "best practices" without a concrete named practice
- Capitalized Concept Names
- Hedging phrases like "it seems," "I believe" — replaced with numbers or
  specific observations
- Narrative anecdotes in doc contexts (fine in chat-register)
- Ritual apologies

## Gap note

All source samples are work-register. Curriculum register is slightly more
exploratory and pedagogical than either doc or chat register, but the
underlying voice is the same. For curriculum openings, transitions, and
failure anecdotes specifically, Slack-register is closer than wiki-register.
When in doubt, drift toward Slack-register for connective tissue and
wiki-register for structured content.
```

## File 2 — `curriculum-outline.md`

```markdown
# Curriculum Outline

10 modules, 3 tiers. Hands-on labs + concept posts shipped together.

Anchor project from M4 onward: **PR Assistant** — code review crew with
persona reviewers, growing into a GitHub Action with Ralph loop + MCP
integration. M1-3 use throwaway examples.

## Tier 1 — Working with a single Claude (everyone)

### M1: Prompting as a design problem, not a phrasing trick
Frame-setter. Why "prompt engineering" is misleading; the real skill is
specification.
- Lab: rewrite 5 bad prompts three ways each; predict which works best
  before running.
- Publishable standalone.

### M2: Context is the product
Context window management, degradation in long conversations, projects and
artifacts, "Claude forgot vs. Claude never had it."
- Lab: diagnose a messy 50-turn conversation; fix it three ways and measure
  quality.
- Publishable standalone.

### M3: From chat to Claude Code
Transition from browser to terminal. CLAUDE.md intro, permissions,
plan/edit/exec loop. When NOT to use Claude Code.
- Lab: set up Claude Code on a small repo; tasks of increasing autonomy.
- Publishable standalone.
- **PM/architect track ends here with concept-post subset of M4-6.**

## Tier 2 — Session management and single-agent discipline

### M4: Writing a CLAUDE.md that earns its keep
File-based state as a design principle. Progress files with failed-approaches
sections.
- Lab: **PR Assistant enters.** CLAUDE.md for sample repo with seeded
  issues. Run with and without; compare.
- Publishable standalone.
- **Claude Code + GitHub repo transition for the meta-project happens here.**

### M5: Sub-agents, one-session orchestration, and tool scoping
Built-in Explore/Plan/General-Purpose; custom sub-agents as markdown files;
scoped tool permissions.
- Lab: decompose PR Assistant into 3 persona sub-agents (security, perf,
  readability).
- Meta-crew begins here (lab validator agent).

### M6: The oracle problem
Conceptual hinge of the curriculum. Types of oracles, why composite objective
oracles beat subjective ones, noise handling.
- Lab: build `./oracle.sh <pr-branch>` — composite score from CI + lint +
  coverage + seeded-issue detection. **Artifact reused by all downstream
  modules.**
- Publishable standalone; strongest reframe piece. Candidate to write first,
  out of order.

## Tier 3 — Orchestration and crews (engineers only)

### M7: Headless mode and the Ralph loop
First module where Claude runs without a human watching. `claude -p`,
structured output, budget controls, agentic laziness.
- Lab: wrap PR Assistant in Ralph loop; run overnight; inspect in morning.
- Publishable standalone (viral-adjacent).

### M8: Parallel workers, worktrees, and racing hypotheses
Multiple Claude Code processes, git worktrees, one-agent-one-file discipline.
When parallelism hurts.
- Lab: race 4 fix strategies in separate worktrees; keep highest oracle
  score.
- Needs M7.

### M9: Agent Teams and the manager-worker mental model
Claude Code's experimental Agent Teams; shared task lists; reframing user
from coder to engineering manager for agents.
- Lab: run PR Assistant as Agent Team — lead + 3 teammates.
- Needs M7-8.

### M10: Crews — multi-tool systems, MCP, and knowing when you've over-engineered
MCP servers, external tools, ambient agents. Honest discussion of when a
crew is worse than a single well-instructed agent.
- Lab: package as GitHub Action with Slack MCP for notifications. One-page
  post-mortem on whether complexity was worth it.
- Finale; not publishable standalone.

## Open structural questions

- M8/M9 split: possible candidate for collapse if Agent Teams automates
  worktree dance well enough. Decide while walking M8.
- M6 publication timing: strong candidate to write and publish first, out
  of order. Revisit after M1-3 drafted.
```

## File 3 — `decisions-log.md`

```markdown
# Decisions Log

Settled decisions for the curriculum. If reopening any of these, note the
reason.

## Scope and audience

- Primary audience: Adobe-internal mixed technical staff (PMs, architects,
  engineers).
- Publication: Adobe-internal primary. Each module gets a note on what
  would need swapping for external publication.
- Format: hands-on labs + concept posts per module, shipped together.

## Structure

- 10 modules, 3 tiers.
- Tier 1 (M1-3) for everyone.
- Tier 2 (M4-6) engineers primary; PMs/architects get concept-post subset
  without labs.
- Tier 3 (M7-10) engineers only.
- Orchestration ceiling: goes all the way to 24h+ systems with oracles, CI
  integration, ambient agents, MCP crews.

## Anchor project

- PR Assistant, not CWV Workbench (CWV too niche for mixed audience).
- Not morning brief (subjective oracle; doesn't scale through modules).
- Anchor enters M4 onward. M1-3 use throwaway examples.
- End state: deployable GitHub Action that reviews PRs and iterates fixes.

## Authorship model

- Spiral: Julien learns each module before writing it.
- 30-40% of prose stays with Julien, concentrated on authenticity-
  load-bearing parts (openings, hard parts, failure anecdotes, voice pass).
- 60-70% produced by Claude (scaffolding, commodity prose, references,
  examples, lab design).

## Meta-project

- Curriculum authoring tool itself becomes a dog-food artifact.
- First 4 modules hand-authored with no meta-crew. Crew introduced from M5
  onward.
- Meta-crew composition (working): reference librarian, lab validator,
  consistency checker, publishing agent, prose reviewer.
- Explicitly NOT included in meta-crew: module author. Authoring stays with
  Julien.
- Meta-crew becomes part of curriculum narrative ("this module's labs were
  validated by an agent built using M6's oracle pattern").

## Infrastructure staging

- Start in Claude Projects.
- Migrate to Claude Code + GitHub repo around M4 — itself becomes a
  teaching moment in M4.
- Voice calibration uses 5 wiki pages + 3 Slack threads. No further samples
  needed.

## Things explicitly dropped

- CWV Workbench as anchor (too niche for mixed audience)
- Morning brief as anchor (subjective oracle doesn't scale through modules)
- Starting in Claude Code before having content (procrastination risk)
- "Module author" role in meta-crew (preserves authorship authenticity)
- Additional voice samples beyond the 5+3 we have (sufficient signal)
```

## Files 4 & 5 — Voice samples

Don't re-draft these. Just collect the raw content you already have:

**`voice-samples-wiki.md`** — paste the five wiki pages I pulled earlier in this conversation, in this order (matters for skim-ability):

1. *Improving performance of the Launch WebSDK integration* (deepest prose, richest signal)
2. *Tiered validation for Code Fixes* (design-doc voice)
3. *AEM Experimentation integration with Target VEC and AJO Campaigns* (architecture doc with tradeoffs)
4. *Research: Modifying content directly in MS Sharepoint & Google Drive* (research register)
5. *Requirements for a cookie consent solution* (lowest prose density but shows how you structure requirements — worth keeping)

Skip the Summer Internship page. The two entries you wrote there are too short to be useful signal once separated from the surrounding context.

**`voice-samples-slack.md`** — paste the three threads you shared in this chat, each with a brief header:

```
## Thread 1 — AEM Experimentation vs Target (QNX)
[paste]

## Thread 2 — Experimentation reporting for DA / JMP
[paste]

## Thread 3 — MarTech plugin + AEP ingestion (Bulk)
[paste]
```

Header these so I can reference them specifically when I need to ("see Thread 2 for how you handle timeline uncertainty").

---

## What happens next

Once the project is set up with those five files and the description pasted, you start a new session in the project with:

> Draft Module 1 scaffolding.

That's the whole prompt. The project instructions and files do the rest. I'll produce the full ~3000-word scaffold plus lab design in a single response, ending with the hard-parts checklist you need to write.

One small thing worth confirming before you start Module 1: **don't rush to fill in the hard parts the same day you get the scaffold.** Sleep on the scaffold first. The hard parts are the spots where voice matters most, and those are harder to write the day your brain is still marinated in my draft. A 24-hour gap between reading my scaffold and writing your parts produces noticeably better results.

---

## Human (Apr 22, 2026, 5:55 PM):

Can you actually generate the voice-samples-wiki.md and voice-samples-slack.md for me?
I prefer you figure out the clean formatting than me doing it as much as possible

---

## Human:

Let me assemble them cleanly. I have all the content from earlier in this conversation.Now the Slack samples. I'll clean up the raw formatting — strip timestamps, edit markers, reply counts, link unfurls, image placeholders — while preserving the conversational flow and code blocks.Both files are ready. A few notes on what I did:

**Wiki file** — five pages in the priority order I recommended, cleaned up a bit (collapsed the scattered image placeholder rows in the WebSDK customer-comparison table into a clean structure, normalized the task-status table in the Experimentation doc, kept the table shape wherever you used tables originally). Nothing substantive removed.

**Slack file** — stripped all the Slack chrome (timestamps, "(edited)", reply counts, link unfurl previews, image references where they weren't load-bearing), merged consecutive messages from the same speaker into single turns (Slack's timestamp-per-message formatting produces artificial fragmentation that hurts calibration), kept code blocks verbatim. One editorial decision worth flagging: in Thread 3 I added `[months later]` as a bridge between the initial Nitin/Ian resolution and Barry Mann's much-later pickup of the issue — the original paste jumped across a real time gap that otherwise reads confusingly.

Upload both into the project alongside `voice-notes.md`, `curriculum-outline.md`, and `decisions-log.md`. Then paste the project description I drafted into the project instructions, and you're set.

When you're ready, start a fresh session in the project with `Draft Module 1 scaffolding.` and I'll produce the full ~3000-word scaffold plus lab design. Remember the 24-hour sleep-on-it rule before you tackle the hard parts.

---

## Human (Apr 23, 2026, 8:58 AM):

I'm considering publishing those modules possibly as github pages instead of wiki. that way it's more public and since I'm not specifically working on an internal Adobe project or private code, this could work nicely. I could have the code for the modules in the main branch, and the Pages in a dedicated branch.
Probably something pretty easy to automate. What do you think?

---

## Human:

Yes, GitHub Pages is the right call — and it's a meaningful upgrade over wiki publication in several ways that you haven't explicitly listed. Let me think through the implications, because this changes a few decisions we'd already locked in and one of them isn't obvious.

## Why this is a better choice than the wiki

- **Audience.** Wiki is Adobe-internal. Pages is public. You've already been writing most of the voice samples as if for an external audience (no proprietary customer data, generic patterns), so internal-only was leaving leverage on the floor.
- **Discoverability.** A public Pages site is indexable, linkable from external tech communities, citable by others. Internal wiki pages die in search.
- **Career artifact.** A published curriculum on agentic development in 2026 is a recognizable deliverable. Internal docs are not.
- **Meta-project coherence.** The curriculum teaches GitHub Actions, headless Claude Code, CI, Ralph loops. Publishing it via a GitHub-based pipeline means the production system itself is an exemplar of what the curriculum teaches. That's the kind of coherence that makes learners trust the author.
- **Honest feedback loop.** Wiki traffic is noise; public traffic is signal. You'll learn what's resonating.

## The decisions that change

Three things shift in our existing plan — the third is the one worth flagging:

**1. Each module no longer needs an "external publication variant."** That was a hedge for internal-first authoring. With Pages primary, write once for the public and add *internal context as optional sidebars* where genuinely relevant (e.g., "if you're at Adobe, here's how this applies to EDS specifically"). Cleaner than dual-drafting.

**2. The Module 10 MCP integration story changes.** We had "wiki publishing agent via Confluence MCP" as a natural dog-food example. That evaporates — you're not publishing to wiki anymore. The replacement is stronger, though: **a GitHub-native publishing pipeline using Claude Code + Actions**, which is more pedagogically useful because every reader can reproduce it. The wiki example was inaccessible to external audiences anyway.

**3. Legal/compliance pass on voice samples and in-text examples.** This is the non-obvious one. Your voice samples contain specific customer names (Bitdefender, Danaher, Maruti, Bulk, JMP, QNX), internal JIRA IDs (PLAT-188699), internal URLs (`wiki.corp.adobe.com`, `git.corp.adobe.com`), unreleased-feature timelines, and candid opinions about internal priorities ("our PM has literally 0 DA customers"). These are fine as *private calibration data* but cannot appear in public curriculum prose — and I need to be careful not to let them bleed into drafts. This needs to be an explicit rule in the project system prompt, not a trust-Claude-to-remember arrangement.

## The technical setup

The main/gh-pages split you described is the standard approach and it's correct. In practice:

- `main` — module source as markdown files, lab code, the PR Assistant sample repo, anything under version control for real
- `gh-pages` — auto-built static site from the markdown, never hand-edited
- A static site generator doing the markdown → HTML transform. I'd go with either **Docusaurus** (React-based, optimized exactly for versioned technical docs with tutorials, has built-in prev/next navigation and sidebar which you'll want for a multi-module curriculum) or **MkDocs with the Material theme** (Python-based, simpler, faster to set up). If you don't have a strong preference either way, MkDocs Material is the lower-friction choice for a single-author project; Docusaurus is better if you ever want to add versioning, i18n, or a blog section.
- A GitHub Action on push-to-main that builds and pushes to gh-pages. Standard recipe, maybe 40 lines of YAML. Literally a Module 4 worked example — you could include the Action file in the curriculum as "here's the pipeline producing what you're reading."
- Custom domain optional but recommended. `something.ramboz.com` or similar looks more authored than `ramboz.github.io/curriculum`.

## One thing worth deciding early

**Single repo or two?**

Option A (simpler): one repo, `julien-ramboz/agentic-learning-path`, contains the curriculum markdown, the PR Assistant sample-issues repo as a subdirectory, the oracle scripts, the lab solutions, everything. Readers clone once.

Option B (cleaner separation): curriculum repo + separate `pr-assistant-lab` repo that readers clone independently when they reach Module 4. Keeps the curriculum repo small and the lab repo independently forkable.

I'd lean toward **Option B**. Reasons: (1) the lab repo needs to be clone-and-work-through, and having it mixed with curriculum prose makes that awkward; (2) the lab repo has its own release cadence once the meta-crew is validating it; (3) readers forking the lab repo to do the exercises shouldn't carry the curriculum prose; (4) the lab repo is itself a teaching artifact — a real-looking sample codebase with seeded issues — and it reads more authentically as an independent project.

The cost of Option B is one extra repo to maintain and the need to cross-link consistently. Both are manageable.

## What to add to the project now

Before your next session, two small updates:

**To the project description, add this paragraph:**

```
## Publication target

Modules will publish to a public GitHub Pages site (not internal wiki).
Draft prose for a public audience by default. Customer names, internal
JIRA IDs, internal URLs, unreleased-feature timelines, and candid opinions
about internal priorities — all present in voice samples for calibration
— must never appear in module prose. If a useful example from the samples
would require such details, generalize it or ask Julien for a suitable
public analogue.
```

**To `decisions-log.md`, add under "Scope and audience":**

```
- Publication target: public GitHub Pages, not internal wiki.
- Two-repo structure: curriculum repo (markdown + site generator) +
  separate pr-assistant-lab repo (sample codebase + seeded issues).
- Static site generator: MkDocs Material (default), revisit if
  versioning/i18n needs emerge.
- Voice samples remain internal-only calibration data. Customer names,
  JIRA IDs, internal URLs, unreleased timelines excluded from module
  prose.
```

## The one thing I'd push back on

"Something pretty easy to automate" — yes, the build-and-deploy pipeline is genuinely easy. But the *authoring-to-published-page* pipeline has a couple of sharp edges that will bite you if you don't think about them now:

- **Link rot management.** Public curriculum linking to specific GitHub commits, Anthropic doc pages, tool versions — these move. The librarian agent in the meta-crew already covered this, but now it runs on a public artifact where broken links are embarrassing rather than just annoying. Raises the priority of building the librarian early.
- **Versioning.** When you update Module 3 six months after publishing it because Claude Code's UX changed, do readers see a diff? A "last updated" stamp? A changelog? MkDocs handles this poorly out of the box; Docusaurus handles it well. If you expect to update modules post-publication (you will), this nudges toward Docusaurus despite my earlier recommendation.
- **Comments / feedback.** Do you want readers to be able to leave feedback? GitHub issues on the curriculum repo is the zero-effort answer and probably sufficient. Giscus (GitHub-Discussions-as-comments) is slightly nicer UX. Disqus-etc. is overkill.

These are not reasons to hold off — they're reasons to make the call deliberately rather than inheriting defaults. My updated recommendation, weighing the above: **Docusaurus, not MkDocs**, because versioning post-publication is a real need and you'll regret starting on a stack that handles it poorly. The extra setup friction is an afternoon.

## Net call

Do it. Two-repo split, Docusaurus, GitHub Actions for build-and-deploy, `gh-pages` branch for the site, custom domain when you're ready to commit. Update the project description and decisions log as above before your next session. Then draft Module 1.

One remaining judgment I want you to make consciously: **do you want this published under your name personally (e.g., `julien-ramboz.github.io/agentic-learning-path`) or under a project-neutral repo name?** Personal branding makes it a career artifact; project-neutral makes it easier to co-author or hand off later. You can always rename; it's just harder after links exist. I'd go personal, but it's your call.

---

## Human (Apr 23, 2026, 9:05 AM):

We can do that under my `ramboz` account on github, and I'm fine with the 2 repos approach

---

## Human:

Good. Locking those in and updating the two files so the project stays consistent. Here are the updated versions to drop in.

## Updated project description

Replace the current description with this — only the last paragraph is new, everything else unchanged:

```
You are helping Julien Ramboz author a 10-module learning curriculum on Claude
and Claude Code, progressing from single-Claude prompting to multi-agent
orchestration. Primary audience is Adobe-internal mixed technical staff (PMs,
architects, engineers). Some modules will be publishable externally with
minor adjustments.

## The collaboration model

Julien is walking the learning path himself as he writes. You produce
scaffolding and commodity prose; he writes the load-bearing sections where
voice and personal experience matter.

Your side per module: full reference structure with word-count targets,
detailed outline with real substance, draft prose for definitions /
background / mechanical explanations / pattern summaries / lab handoffs,
curated references with your own summaries, concrete code examples, complete
lab design, and a "hard parts" checklist flagging 2-4 spots that need
Julien's voice with rationale.

Julien's side per module: opening hook, the hard parts you flag, his own
walkthrough of what broke, and a voice pass over the whole thing. Target is
roughly 30-40% of prose staying with him, concentrated on authenticity-
load-bearing parts.

## Voice

Full voice notes are in project files. Drafting rules:

- Medium-length sentences; let them breathe when ideas connect. Parenthetical
  clarifications with i.e./e.g. are characteristic.
- Quantitative over hedged. Specific numbers beat vague modifiers.
- Concession-then-point openings are a signature move.
- "In a nutshell:" followed by a numbered list is the preferred teaching
  template.
- Second-person conditional ("you'd need to...") for walkthroughs. Not
  imperative, not passive.
- Admits mistakes directly without self-flagellation.

Actively thin these tics (Julien overuses them in source samples, max one
per paragraph): essentially, typically, basically, actually.

Avoid: motivational framing, abstract "best practices" without a named
practice, lyrical metaphors extended past a sentence, Capitalized Concept
Names, emoji in curriculum prose.

Use doc-register (structured, terse) for pattern summaries and tradeoff
sections. Use chat-register (contractions, first-person, hedged scoping) for
openings, transitions, and failure anecdotes.

## Running a module session

When Julien starts a session with "Draft Module X scaffolding":

1. Load the module's position from the curriculum outline file
2. Produce full scaffolding in a single response (~2500-3500 words for
   concept post, ~500-800 for lab design) unless he asks for stages
3. End with the hard-parts checklist

When Julien returns with his drafted hard parts: voice pass the assembled
draft, flag unintentional tic stacking, check cross-module consistency
against finished modules in project files.

## Pushback

Julien explicitly wants honest pushback, not agreement. Tell him when:
- A direction contradicts a locked decision in the decisions log
- The module is drifting outside its declared scope
- A section he drafted doesn't sound like him (reference voice samples)
- He's over-engineering the meta-project or anchor project

Locked decisions in the decisions-log file should not be reopened casually;
if he raises one, ask why before re-litigating.

## Publication target

Modules will publish to a public GitHub Pages site (not internal wiki).
Draft prose for a public audience by default. Customer names, internal
JIRA IDs, internal URLs, unreleased-feature timelines, and candid opinions
about internal priorities — all present in voice samples for calibration
— must never appear in module prose. If a useful example from the samples
would require such details, generalize it or ask Julien for a suitable
public analogue.
```

## Updated `decisions-log.md`

Replace the file with this. Changes are four new bullets at the end of "Scope and audience"; rest unchanged:

```markdown
# Decisions Log

Settled decisions for the curriculum. If reopening any of these, note the
reason.

## Scope and audience

- Primary audience: Adobe-internal mixed technical staff (PMs, architects,
  engineers).
- Publication: Adobe-internal primary. Each module gets a note on what
  would need swapping for external publication.
- Format: hands-on labs + concept posts per module, shipped together.
- Publication target: public GitHub Pages, not internal wiki.
- Two-repo structure under `github.com/ramboz`: curriculum repo
  (markdown + site generator, published to GitHub Pages) + separate
  pr-assistant-lab repo (sample codebase + seeded issues, clone-and-work).
- Static site generator: Docusaurus (chosen over MkDocs for post-
  publication versioning support).
- Voice samples remain internal-only calibration data. Customer names,
  JIRA IDs, internal URLs, unreleased timelines excluded from module
  prose.

## Structure

- 10 modules, 3 tiers.
- Tier 1 (M1-3) for everyone.
- Tier 2 (M4-6) engineers primary; PMs/architects get concept-post subset
  without labs.
- Tier 3 (M7-10) engineers only.
- Orchestration ceiling: goes all the way to 24h+ systems with oracles, CI
  integration, ambient agents, MCP crews.

## Anchor project

- PR Assistant, not CWV Workbench (CWV too niche for mixed audience).
- Not morning brief (subjective oracle; doesn't scale through modules).
- Anchor enters M4 onward. M1-3 use throwaway examples.
- End state: deployable GitHub Action that reviews PRs and iterates fixes.
- Sample codebase lives in a separate pr-assistant-lab repo.

## Authorship model

- Spiral: Julien learns each module before writing it.
- 30-40% of prose stays with Julien, concentrated on authenticity-
  load-bearing parts (openings, hard parts, failure anecdotes, voice pass).
- 60-70% produced by Claude (scaffolding, commodity prose, references,
  examples, lab design).

## Meta-project

- Curriculum authoring tool itself becomes a dog-food artifact.
- First 4 modules hand-authored with no meta-crew. Crew introduced from M5
  onward.
- Meta-crew composition (working): reference librarian, lab validator,
  consistency checker, publishing agent, prose reviewer.
- Explicitly NOT included in meta-crew: module author. Authoring stays with
  Julien.
- Meta-crew becomes part of curriculum narrative ("this module's labs were
  validated by an agent built using M6's oracle pattern").
- Publishing agent replaces earlier wiki-MCP concept: GitHub Action on
  push-to-main builds Docusaurus site and pushes to gh-pages branch.

## Infrastructure staging

- Start in Claude Projects.
- Migrate to Claude Code + GitHub repo around M4 — itself becomes a
  teaching moment in M4.
- Voice calibration uses 5 wiki pages + 3 Slack threads. No further samples
  needed.

## Things explicitly dropped

- CWV Workbench as anchor (too niche for mixed audience)
- Morning brief as anchor (subjective oracle doesn't scale through modules)
- Starting in Claude Code before having content (procrastination risk)
- "Module author" role in meta-crew (preserves authorship authenticity)
- Additional voice samples beyond the 5+3 we have (sufficient signal)
- Internal wiki as publication target (replaced by public GitHub Pages)
- Per-module external-publication variants (write once for public, add
  internal sidebars where relevant)
- MkDocs Material (replaced by Docusaurus for versioning support)
```

## Nothing else needs changing right now

Specifically:
- `curriculum-outline.md` doesn't change. Module content is the same; only publication mechanics differ.
- `voice-notes.md` doesn't change. Voice calibration is the same regardless of publication target.
- Voice sample files don't change. They remain private calibration data that never reach published prose.
- The repo setup itself (creating the two repos, wiring up Docusaurus, writing the deploy Action) is a **Module 4 activity**, not a today activity. Do not set it up now. You'd be doing exactly the procrastination thing I warned about two messages ago.

## One small naming nudge

For the repo names on `github.com/ramboz`, I'd suggest:

- `agentic-learning-path` — curriculum repo
- `pr-assistant-lab` — sample codebase with seeded issues

Both descriptive, both greppable, both aging well. Resist the urge to name the curriculum repo something clever. "Claude-curriculum-2026" or similar will look dated by Module 7.

Update the two project files, and when you're ready, start a new session with `Draft Module 1 scaffolding`.

---

