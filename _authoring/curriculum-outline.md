# Curriculum Outline

12 modules, 3 tiers. Hands-on labs + concept posts shipped together.

Anchor project from M4 onward: **PR Assistant** — code review crew with
persona reviewers, growing into a GitHub Action with Ralph loop + MCP
integration. M1-3 use throwaway examples.

Each module after M3 adds exactly one new dimension to PR Assistant.
The artifact stack composes — CLAUDE.md → rules → sub-agents/skills →
oracle.sh → hooks — and nothing gets thrown away.

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
plan/edit/exec loop. When NOT to use Claude Code. Closes with a one-paragraph
preview of the `.claude/` ecosystem (rules, agents, skills, hooks) so curious
readers can peek into Tier 2 and 3.
- Lab: set up Claude Code on a small repo; tasks of increasing autonomy.
- Publishable standalone.
- **PM/architect track: continues into Tier 2 concept posts.**

## Tier 2 — Persistence, decomposition, and quality signal

### M4: Writing a CLAUDE.md that earns its keep
File-based state as a design principle. Progress files with failed-approaches
sections.
- Lab: **PR Assistant enters.** CLAUDE.md for sample repo with seeded
  issues. Run with and without; compare.
- Publishable standalone.
- **Claude Code + GitHub repo transition for the meta-project happens here.**

### M5: Path-scoped instructions with Rules
When CLAUDE.md gets too big, you scope it. `.claude/rules/` with `paths:`
glob frontmatter. Always-on instructions that load only when Claude reads
matching files. Explicit contrast with M6 skills (always-on vs on-demand)
to head off the easy mix-up.
- Lab: refactor the M4 CLAUDE.md into `.claude/rules/` files. Add path-scoped
  rules for src/api, tests, and docs. Show how a `paths:` rule loads only
  when Claude touches matching files.
- Publishable standalone.

### M6: Sub-agents, Skills, and tool scoping
Built-in Explore/Plan/General-Purpose; custom sub-agents as markdown files;
skills (`.claude/skills/SKILL.md`) for reusable workflows and on-demand
knowledge. The sub-agent vs skill decision: skill = prompt loaded on demand
into the main conversation; sub-agent = work in its own context, returns a
summary. Slash commands covered as the compatibility shim that's been
merged into skills.
- Lab: decompose PR Assistant into 3 persona sub-agents (security, perf,
  readability). Pull recurring patterns into skills (`/pr-summary`,
  `/explain-code`). Use `/agents` interactive command as the entry point.
- Meta-crew begins here (lab validator agent).

### M7: The oracle problem
Conceptual hinge of the curriculum. Types of oracles, why composite objective
oracles beat subjective ones, noise handling.
- Lab: build `./oracle.sh <pr-branch>` — composite score from CI + lint +
  coverage + seeded-issue detection. **Artifact reused by all downstream
  modules.**
- Publishable standalone; strongest reframe piece. Candidate to write first,
  out of order.
- **PM/architect track ends here with concept-post subset of M4-7.**

## Tier 3 — Orchestration and crews (engineers only)

### M8: Headless mode and the Ralph loop
First module where Claude runs without a human watching. `claude -p`,
structured output, budget controls, agentic laziness. Worked example with
the `--agents` JSON flag for inline sub-agent definitions.
- Lab: wrap PR Assistant in Ralph loop with M7's oracle as the exit signal;
  run overnight; inspect in morning.
- Publishable standalone (viral-adjacent).

### M9: Hooks
Guardrails for unattended runs. The full hook surface (29+ events), then
deep dive on the load-bearing four: `PreToolUse`, `PostToolUse`,
`SubagentStop`, `InstructionsLoaded`. The meta-judge pattern (Stop hook
spawns a reviewer that uses M7's oracle to grade and retries below
threshold) is the worked example — it presupposes M7 and M8.
- Lab: add hooks to make the M8 Ralph loop safe. `PreToolUse(Bash)`
  validates commands; `Stop` hook spawns the meta-judge.
- Publishable standalone.
- Reference to consider (battle-tested, side project): [jig](https://github.com/ramboz/jig)
  frames its design as "hooks are the spine; skills are the LLM layer" —
  five hooks total, each enforcing a deterministic gate the skills layer
  can't bypass. README "Design philosophy" section is the one-line quote;
  `hooks/scripts/` shows the actual implementations. Optional further
  reading; phrase as "another side project of mine if you want a more
  battle-tested reference."

### M10: Parallel workers, worktrees, and racing hypotheses
Multiple Claude Code processes, git worktrees, one-agent-one-file discipline.
When parallelism hurts.
- Lab: race 4 fix strategies in separate worktrees; oracle picks the highest
  score.
- Needs M8.
- Reference to consider (battle-tested, side project): [jig](https://github.com/ramboz/jig)'s
  spec 003-03 (`reserve-spec-on-main`) exists because parallel-worktree
  sessions kept colliding on spec numbers — a concrete real-world failure
  mode of the one-agent-one-file discipline (specifically: shared sequence
  state across worktrees) and the fix that was needed. Skim
  [`docs/specs/003-spec-workflow-promotion/`](https://github.com/ramboz/jig/tree/main/docs/specs)
  if you want to see the scar. Optional, framed as side-project reference.

### M11: Agent Teams and the manager-worker mental model
Claude Code's experimental Agent Teams; shared task lists; reframing user
from coder to engineering manager for agents. Explicit answer to "sub-agents
are flat" from M6.
- Lab: run PR Assistant as Agent Team — lead + 3 teammates.
- Needs M8-10.

### M12: Crews — multi-tool systems, MCP, and knowing when you've over-engineered
MCP servers, external tools, ambient agents. Honest discussion of when a
crew is worse than a single well-instructed agent.
- Lab: package as GitHub Action with Slack MCP for notifications. One-page
  post-mortem on whether complexity was worth it.
- Finale; not publishable standalone.
- Reference to consider (battle-tested, side project): [jig](https://github.com/ramboz/jig)'s
  "Design philosophy" — 5 Tier 0 skills (not 100+), 3 sub-agents (not 48
  like ECC), 8-12 skills total when complete — is *literally* the M12
  conclusion in one project's positioning. The product-vision.md
  "competitive landscape" table contrasts focused skill packs against
  maximalist ones and against hand-rolled CLAUDE.md baselines.
  Optional further reading; phrase as "another side project of mine if
  you want a more battle-tested reference."

## Open structural questions

- M10/M11 split: possible candidate for collapse if Agent Teams automates
  worktree dance well enough. Decide while walking M10.
- M7 publication timing: strong candidate to write and publish first, out
  of order. Revisit after M1-3 drafted.
- Plugins: not currently scoped. One-line callout in M12 if Adobe-internal
  multi-team distribution case justifies it.
