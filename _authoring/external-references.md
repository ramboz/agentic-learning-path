# External references — Huntley + Willison link bank

Curated deep links to articles by Geoffrey Huntley (ghuntley.com) and Simon
Willison (simonwillison.net), per module. Internal-only; this file is **not**
published.

The five published-module References sections (M1-M5) already pull from this
list. M6-M12 are stubs; when each gets drafted, this is the raw material to
draw from. The point is to keep the per-module link choices precise: not
"Simon's blog," but the specific post that earns its place in that module's
bibliography.

Conventions:

- One to three links per author per module. Quality over coverage.
- Each entry includes a one-sentence reason for *why this post for this module*.
- Modules with no strong fit say so. A missing link is honest; a tag-page
  link is noise.
- Exclude full and partial paywalls.

Verification dates: agent research run 2026-05-01.

---

## Internal depth and destination targets

The curriculum hands depth off to the team's own material instead of
competing with it. Visibility checked 2026-06-08: the AI-First Development
Guidelines, jig, and servo are public and safe to link from the published
site. experience-success-skills is PRIVATE: link it with an "Adobe-internal"
annotation (audience is internal-primary, most readers have access; decided
2026-06-08, a deliberate exception to the internal-URL rule).

**Depth target (introduce the concept, then link out for the deep version):**

- [**AI-First Development Guidelines**](https://github.com/adobe/mysticat-ai-native-guidelines)
  (public). The operating playbook. Per-module hooks:
  - M3 chat-to-Claude-Code → `01-foundations/workspace-setup.md`,
    `01-foundations/tools-checklist.md`, `presentations/getting-started.md`,
    `04-configuration/ai-tools/claude-code.md`, `04-configuration/ai-tools/permissions.md`.
  - M4 CLAUDE.md → `examples/` (workspace + project CLAUDE.md),
    `04-configuration/ai-tools/claude-code.md`.
  - M5 rules, M9 hooks → `05-guardrails/` (must-rules, should-rules,
    mechanical-enforcement, anti-patterns).
  - M6 sub-agents/skills → `04-configuration/skills/`,
    `01-foundations/skill-distribution.md`.
  - M7 oracle → `02-lifecycle/` evaluation-driven-development section
    (eval-driven-development, llm-powered-evals, prompt-optimization,
    self-improving-agents). Deepest overlap. Keep M7 conceptual; point
    here for the machinery.
  - M12 MCP/crews → `04-configuration/mcp/`.

**Destination artifacts (name as what the foundations build toward):**

- [**jig**](https://github.com/ramboz/jig). Supervised spec-driven
  workflow. Already referenced in M9/M10/M12.
- [**servo**](https://github.com/ramboz/servo). The unattended sibling:
  oracle, agent loop, hooks, worktree races. Mirrors the M7-M10 arc; name
  in M8/M10 as the shipped version of the hand-built loop.
- [**experience-success-skills**](https://github.com/adobe/experience-success-skills)
  (PRIVATE, annotate as Adobe-internal when linking). Shipped team skill
  packs. Name in M6/M12 as packaged, distributed skills.

---

## Tier 1

### M1 — Prompting as design/specification

**Willison**
- [**"Hallucinations in code are the least dangerous form of LLM mistakes"**](https://simonwillison.net/2025/Mar/2/hallucinations-in-code/). Reframes prompting around tight feedback loops where the compiler and tests catch errors before you do. Pairs with the "specs over phrasing" frame.
- [**"An LLM TDD loop"**](https://simonwillison.net/2024/Oct/13/an-llm-tdd-loop/). Tests as the executable specification. Canonical worked example.

**Huntley**
- [**"LLMs are mirrors of operator skill"**](https://ghuntley.com/mirrors/). Output quality tracks operator specification skill, not the model.

### M2 — Context engineering

**Willison**
- [**"Context engineering"**](https://simonwillison.net/2025/jun/27/context-engineering/). The defining post on the term.
- [**"How to Fix Your Context"**](https://simonwillison.net/2025/Jun/29/how-to-fix-your-context/). Four context-rot failure modes (poisoning, distraction, confusion, clash). Maps to "Claude forgot vs. never had it."

**Huntley**
- [**"if you are redlining the LLM, you aren't headlining"**](https://ghuntley.com/redlining/). Concrete numbers: quality drops at 147-152k of the advertised 200k window.
- [**"autoregressive queens of failure"**](https://ghuntley.com/gutter/). The "bowling ball in the gutter" metaphor for unrecoverable context.

### M3 — From chat to Claude Code

**Willison**
- [**"How I Use Every Claude Code Feature"**](https://simonwillison.net/2025/Nov/2/how-i-use-every-claude-code-feature/). Heavy-user tour of plan/edit/exec, permissions, and smaller features.
- [**"Claude Code: Best practices for agentic coding"**](https://simonwillison.net/2025/Apr/19/claude-code-best-practices/). Anthropic's foundational guide, with Simon's commentary.

**Huntley**
- [**"AI coding tools are perhaps our new terminal emulators"**](https://ghuntley.com/vt100/). Claude Code as the new shell. On-the-nose for the chat-to-terminal frame.
- [**"how to build a coding agent: free workshop"**](https://ghuntley.com/agent/). Demystifies Claude Code as a 300-line loop with five tool primitives. Useful for shedding the "magic IDE" framing.

---

## Tier 2

### M4 — Writing a CLAUDE.md that earns its keep

**Willison**
- [**"claude_code_docs_map.md"**](https://simonwillison.net/2025/Oct/24/claude-code-docs-map/). Markdown map as on-demand context. Pattern transfers directly to file-based state.
- [**"Just Talk To It—the no-bs Way of Agentic Engineering"**](https://simonwillison.net/2025/Oct/14/agentic-engineering/). Optional second link.

**Huntley**
- No strong match. /stdlib/ is Cursor-flavored prior art, not CLAUDE.md
  authoring. Better to omit than force.

### M5 — Path-scoped instructions with `.claude/rules/`

**Willison**
- No strong match. Simon hasn't covered glob-frontmatter path scoping as a
  distinct topic.

### M6 — Sub-agents, Skills, slash commands

**Willison**
- [**"Claude Code sub-agents"**](https://simonwillison.net/2025/Oct/11/sub-agents/). Defines the fresh-context-window dispatch model. Core sub-agent vs. skill distinction.
- [**"Claude Skills are awesome, maybe a bigger deal than MCP"**](https://simonwillison.net/2025/Oct/16/claude-skills/). Skills as filesystem-loaded capabilities in the main conversation.
- [**"Agent Skills"**](https://simonwillison.net/2025/Dec/19/agent-skills/). Optional third link on the open-standard angle.

**Huntley**
- [**"I dream about AI subagents; they whisper to me while I'm asleep"**](https://ghuntley.com/subagents/). Sub-agent mental model: child clones context, parent pauses, child exhausts its own RAM.
- [**"I dream of roombas"**](https://ghuntley.com/ktlo/). Extends sub-agent thinking to fleets of KTLO workers.
- No direct Huntley post on Skills or slash commands as named features.

### M7 — The oracle problem

**Willison**
- [**"Your AI Product Needs Evals" (Hamel Husain, hosted by Simon)**](https://simonwillison.net/2024/Mar/31/your-ai-product-needs-evals/). Argument for binary expert oracles over 1-5 scales. Supports composite-objective vs. subjective.
- [**"Building a SNAP LLM eval: part 1"**](https://simonwillison.net/2025/Feb/12/building-a-snap-llm/). Worked example of building an oracle for a real domain.

**Huntley**
- [**"Ralph Wiggum as a 'software engineer'"**](https://ghuntley.com/ralph/). Where Huntley introduces the oracle/fix_plan concept and tests-as-backpressure. Not just an M8 link.

---

## Tier 3

### M8 — Headless mode and the Ralph loop

**Willison**
- [**"Designing agentic loops"**](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/). Brute-force tools + clear goal + while loop framing.
- [**"Codex CLI 0.128.0 adds /goal"**](https://simonwillison.net/2026/Apr/30/codex-goals/). Explicitly cites "their own version of the Ralph loop." Useful as a named-pattern citation.
- [**"Scaling long-running autonomous coding"**](https://simonwillison.net/2026/jan/19/scaling-long-running-autonomous-coding/). For the overnight-runs angle.

**Huntley**
- [**"Ralph Wiggum as a 'software engineer'"**](https://ghuntley.com/ralph/). The canonical Ralph post: `while :; do cat PROMPT.md | claude-code ; done`. Mandatory.
- [**"i ran Claude in a loop for three months, and it created a genz programming language called cursed"**](https://ghuntley.com/cursed/). Proof Ralph actually shipped a working compiler. Concrete agentic-laziness payoff.
- [**"everything is a ralph loop"**](https://ghuntley.com/loop/). Generalizes Ralph from coding trick to orchestration mindset.

### M9 — Hooks

**Willison**
- No precise match on PreToolUse/PostToolUse/Stop. Closest thematic
  complement: [**"Living dangerously with Claude"**](https://simonwillison.net/2025/Oct/22/living-dangerously-with-claude/). Permissions, sandboxing, unattended runs. Use only if thematic fit is acceptable.

**Huntley**
- No strong match. Hooks as a Claude Code feature don't appear in Huntley's
  public posts. Tests-as-backpressure in /ralph/ is conceptually adjacent to
  PostToolUse meta-judges but not a hooks post.

### M10 — Parallel workers, worktrees

**Willison**
- [**"Embracing the parallel coding agent lifestyle"**](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/). Headline post.
- [**"How I use git worktrees"**](https://simonwillison.net/2024/Mar/6/how-i-use-git-worktrees/). Worktrees primer.

**Huntley**
- [**"Multi Boxing LLMs"**](https://ghuntley.com/multi-boxing/). WoW multi-boxing analogy. Argues for the worktree pattern without naming it.

### M11 — Agent Teams, manager-worker

**Willison**
- [**"Anthropic: How we built our multi-agent research system"**](https://simonwillison.net/2025/Jun/14/multi-agent-research-system/). Canonical lead-orchestrator / sub-researcher reference.
- [**"First impressions of Claude Cowork, Anthropic's general agent"**](https://simonwillison.net/2026/Jan/12/claude-cowork/). Hands-on team-of-agents UX.

**Huntley**
- [**"I dream about AI subagents"**](https://ghuntley.com/subagents/). Simplest manager-worker pattern: parent as orchestrator, children as workers with cloned context.
- [**"I dream of roombas"**](https://ghuntley.com/ktlo/). Fleet-of-agents framing, closer to "teams of teammates" than dyadic sub-agents.

### M12 — Crews, MCP, when complexity isn't worth it

**Willison**
- [**"too many model context protocol servers and LLM allocations on the dance floor"**](https://simonwillison.net/2025/Aug/22/too-many-mcps/). Definitive "MCP eats your context budget, use gh CLI" piece. Likely commentary on Huntley's /allocations/; the two pair.
- [**"Introducing the Model Context Protocol"**](https://simonwillison.net/2024/Nov/25/model-context-protocol/). Orienting first link for readers new to MCP.
- [**"Model Context Protocol has prompt injection security problems"**](https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/). Adds the security cost-side argument.

**Huntley**
- [**"A Model Context Protocol Server (MCP) for Microsoft Paint"**](https://ghuntley.com/mcp/). Deliberately absurd MCP. Illustrates how trivial it is to add one, and by extension how easy it is to over-add.

---

## Maintenance

When updating:

1. Refresh links if posts get renamed or moved.
2. When a referenced module gets drafted, port the relevant entries into that
   module's `## References` section in `docs/`. Keep the full bank here.
3. Both authors keep writing. Re-survey their feeds every 6-12 months for
   posts that supersede the current picks (especially for M9 hooks and M5
   rules, where coverage is currently weak).
