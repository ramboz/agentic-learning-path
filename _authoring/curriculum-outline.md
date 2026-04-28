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