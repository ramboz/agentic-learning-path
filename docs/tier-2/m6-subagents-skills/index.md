---
title: M6 — Sub-agents and Skills
description: Skills load workflows on demand into the main conversation. Sub-agents do isolated work in their own context and return a summary. The trigger model is the difference.
pagination_label: M6 — Sub-agents and Skills
---

# Module 6 — Sub-agents and Skills

**Tier 2** — engineers primary; PMs and architects can read the concept post but the lab is engineer-track.
**Prerequisites:** [Module 1](../../tier-1/m1-prompting/) (Prompting as a design problem), [Module 2](../../tier-1/m2-context/) (Context is the product), [Module 3](../../tier-1/m3-claude-code/) (From chat to Claude Code), [Module 4](../m4-claude-md/) (Writing a CLAUDE.md that earns its keep), [Module 5](../m5-rules/) (Path-scoped instructions with Rules).

This module picks up from [Module 5](../m5-rules/)'s rules (always-on when matching paths come into scope) and adds the two on-demand primitives.

---

Last September I was planning a road trip with a multi-profile prompt: SF up to Portland, then Seattle, then Yellowstone, returning through Craters of the Moon, Boise, and Klamath Falls. The setup was four travelers with competing priorities. A dog parent who needed to plan water and supply stops for the dogs. A photographer who structured days around golden hours. Someone who wanted to hit specific national park POIs. And someone who wouldn't drive more than four hours in a day. I'd describe each profile's constraints, give them a rough priority ranking, and ask them to debate the routing until they reached a consensus.

It worked well early on. The real tension was between the photographer and the national park enthusiast. The photographer worked golden hours: morning shoots, then evening. Mid-day was downtime, waiting for the next shoot. Detours to hit a POI mid-day meant burning driving time on a stop the photographer wouldn't care about, under harsh vertical light with too much contrast to shoot anyway. Add the four-hour daily limit and the long stretch from Yellowstone to Klamath Falls with almost no services, and every routing decision was a genuine negotiation.

Then, somewhere around session four or five, the profiles went shallow. The debates got shorter. The photographer started agreeing with the national park enthusiast before the conflict even landed. The dog parent's concerns were acknowledged and resolved in the same sentence. Every round ended the same way: everyone happy, no real trade-off surfaced.

I blamed the model at first. Or I blamed myself for running out of good angles to push on. The real cause was simpler. The context had filled up with the debates I'd explicitly asked for. Every follow-up question spun up another four-way exchange among the profiles, and the transcripts stacked up fast. By session four the "photographer" wasn't a rich persona anymore. It was a shadow of itself, a few scraps of the original description still visible, competing for attention with everything accumulated since. The model wasn't being shallow. It was being accurate about what was left.

## What this module covers

In a nutshell:

1. Why the always-on model from [Module 5](../m5-rules/) isn't the right trigger for every instruction
2. Skills: the `.claude/skills/` format, invocation model, and lifetime in context
3. Built-in sub-agents: Explore, Plan, and General-Purpose (what Claude Code uses internally)
4. Custom sub-agents: the `.claude/agents/` format, context isolation, and tool scoping
5. The sub-agent vs skill decision (the load-bearing disambiguation)
6. Failure modes for both primitives

The lab is a ~2-hour exercise. You inherit the `.claude/rules/` structure from [Module 5](../m5-rules/lab/), add two skills (`/pr-summary`, `/explain-code`), and decompose PR Assistant's review into three persona sub-agents (security, performance, readability). The output is a three-agent review crew you run against a new mock PR, with a direct comparison against the Module 5 rules-only baseline. [Module 7](../m7-oracle/) inherits these agents and adds the oracle exit signal. Prerequisites: Modules [1](../../tier-1/m1-prompting/) through [5](../m5-rules/) with the M5 lab done.

## The reframe: from always-on loading to deliberate delegation

[Module 4](../m4-claude-md/) gave you CLAUDE.md: project-level state loaded every session, every turn. [Module 5](../m5-rules/) refined the loading rule: path-scoped, still always-on when matching paths come into scope. Both primitives share the same property: the context they produce lives in the main conversation and the main session does all the work.

This module adds two new trigger models:

- **Skills** load when you (or the model) decide they're needed, then free up after.
- **Sub-agents** work in their own isolated context and return a summary. The main conversation sees the result, not the work.

The question shifts from "what should always be loaded?" to "what should the main conversation do, and what should it delegate?"

| Primitive | Where it lives | When it loads | Which context |
|---|---|---|---|
| CLAUDE.md | project root | every session | main |
| Rules | `.claude/rules/` | paths match | main |
| Skills | `.claude/skills/` | explicit invocation | main |
| Sub-agents | `.claude/agents/` | spawned by orchestrator | own |

The principle from [Modules 1](../../tier-1/m1-prompting/) through [5](../m5-rules/) doesn't change: load what the situation calls for; don't pay the full cost on every turn. This module adds two new ways to act on that principle.

## Skills

### Format, invocation, and lifetime

A skill is a markdown file in `.claude/skills/`. Claude Code loads it into the main conversation when invoked. The work unfolds visibly in the current session. After the skill finishes, the loaded instructions are freed.

The format: optional YAML frontmatter plus a markdown body. The body is the workflow the model follows.

:::example

```markdown
---
description: Summarize a PR diff in a short structured block
---

# pr-summary

1. Read the diff.
2. Identify the primary change type: feature, bugfix, refactor, or docs.
3. Summarize in three sentences: what changed, what it enables, what might break.
4. List each changed file with a one-line note on why it changed.
5. Output as a labeled block: **Type**, **Summary**, **Files**.
```

:::

Invocation: type `/pr-summary` in a Claude Code session. The model loads the skill's body as instructions and follows them. The model can also invoke skills it determines are relevant, without a slash command from you.

Lifetime: active for the current invocation, then freed. Contrast with rules, which load whenever matching paths come into scope and stay loaded while those paths remain in scope.

### Skills vs CLAUDE.md

If multi-step "how to do X" instructions are accumulating in CLAUDE.md, that's a signal they belong in a skill. CLAUDE.md should state rules, not procedures. A five-step review workflow you'd invoke only when you want a formal summary does not belong loaded on every session start.

## Sub-agents

## Built-in sub-agents: Explore, Plan, General-Purpose

Claude Code ships with three sub-agents it uses internally during agentic tasks. You can also invoke them explicitly.

**Explore** is read-only. It can read files, search, and map the codebase; it cannot write or edit. Claude Code routes file-discovery work through Explore before starting modifications. Use it the same way when you design your own orchestration: route discovery first, writes after.

**Plan** can design and propose changes without executing them. Claude Code uses it when it wants to reason about a change before committing. You can invoke it explicitly: "Use the Plan sub-agent to design the refactor before we touch any files."

**General-Purpose** is the default. Claude Code spawns it when the work doesn't fit Explore's read-only constraint or Plan's design-only scope.

You can invoke any of these in a prompt directly: "Use the Explore sub-agent to map everything under `src/reviewer/` before you write any code." The built-in agents are available in every session; they don't need a file in `.claude/agents/`.

The read-only constraint on Explore earns its keep as a trust boundary. Routing all discovery through it first means write-capable agents aren't doing exploratory reads mixed with writes.

## Custom sub-agents: isolated context, scoped tools

A custom sub-agent is a markdown file in `.claude/agents/`. The format is YAML frontmatter plus a markdown body that serves as the agent's persistent instructions.

:::example

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

:::

**Context isolation.** When the orchestrating session spawns a sub-agent, the agent starts a fresh context. It does not inherit the main conversation's history. The orchestrator must brief it explicitly in the delegation prompt: attach the diff, name the files, provide whatever context the agent needs to work correctly. Context isolation is both the benefit (no noise from the main session's history) and the cost (the agent only knows what you give it).

**Tool scoping.** The `tools:` frontmatter field restricts which tools the agent can call. A security reviewer that can only `Read`, `Glob`, and `Grep` cannot accidentally edit files. Set tool lists to the minimum the agent needs; don't leave `tools:` empty unless the agent genuinely requires full access.

**The return path.** The sub-agent returns a summary to the orchestrating session. The main conversation sees the summary (and any structured output the agent was instructed to produce); it does not replay every tool call the agent made. The orchestrator aggregates results without needing to know the details of how each agent worked.

**Structured output contracts.** A delegation prompt like "review the diff and report anything interesting" produces whatever the agent decides is interesting. That's hard to aggregate across three agents with different perspectives. Write the return format in the agent's instructions before the first run: numbered findings, severity labels, specific line references. The orchestrator reads the contract; the agent follows it.

A delegation prompt that uses the contract:

:::example

```
Run the security-reviewer agent on the diff at src/reviewer/.
Scope: src/reviewer/auth.ts only.
Expect: a numbered list of findings with file, line, severity, and one sentence per finding.
Aggregate with the performance and readability reports when done.
```

:::

## The sub-agent vs skill decision

The load-bearing question is the trigger model, not the file format. Both are markdown files with frontmatter. The difference is where the work happens and who sees it.

| | Skill | Sub-agent |
|---|---|---|
| Where it lives | `.claude/skills/<name>.md` | `.claude/agents/<name>.md` |
| Trigger | Explicit invocation (slash command or model) | Spawned by the orchestrating session |
| Context | Runs in the main conversation | Own context; main sees summary only |
| Work visible to user | Yes, unfolds in the current session | No (only the returned summary) |
| Tool scope | Inherits the session's tool permissions | Restricted per agent via `tools:` frontmatter |
| Best for | Reusable workflows, on-demand reference | Specialized deep work, parallel execution |
| Example | `/pr-summary`, `/explain-code` | security reviewer, performance reviewer |

Decision rule: if you want to watch and steer the work, use a skill. If you want isolated specialized execution with a clean handoff, use a sub-agent.

Contrast with rules from [Module 5](../m5-rules/): rules apply automatically whenever Claude is in the relevant code. Skills apply when you (or the model) decide they're needed. Sub-agents apply when the work earns its own context. Three trigger models, three homes.

The same domain knowledge can live in any of the three depending on how it should activate. A worked side-by-side on API conventions:

:::example

```markdown
# As a rule (paths: src/api/**)
API endpoints use Zod schemas. Errors go through ApiError. Response shape is { data, error }.
```

:::

:::example

```markdown
# As a skill (/api-audit)
Walk each exported function in the file the user names.
Check: (1) Zod schema for all inputs, (2) ApiError for all throws, (3) response shape { data, error }.
List violations with file and line numbers.
```

:::

:::example

```markdown
# As a sub-agent (api-security-reviewer)
tools: [Read, Glob, Grep]
Review the diff for API security issues: missing input validation, unguarded error leakage,
direct token use. Return a numbered list with file, line, and severity.
```

:::

The rule applies automatically when Claude touches `src/api/**`. The skill runs in the main conversation when invoked. The sub-agent does isolated analysis and returns a summary. Same domain, different trigger.

## Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Sub-agent returns vague output ("looks fine", "no issues found") | Delegation prompt didn't specify a return format | Add a structured output contract to the delegation prompt: numbered findings, severity, file and line. Put the contract in the agent's instructions as well |
| Sub-agent reviews the wrong files | Context isolation: the agent didn't inherit the main session's knowledge of scope | Brief the agent explicitly in the delegation prompt. Name the files, attach the diff, state the scope boundary |
| Skill doesn't load when you type the slash command | File path or name doesn't match the invocation | Verify the file is at `.claude/skills/<name>.md`; the command is `/<name>` (filename without extension) |
| A rule and a skill both carry the same convention | Trigger confusion between "applies automatically here" and "invoke deliberately" | Pick one. If it should load when Claude touches the relevant code, it's a rule. If you'd invoke it as a discrete action, it's a skill |
| Three persona agents return overlapping findings | Agent scopes are too broad; no stated boundary in their instructions | Add explicit scope constraints: "report only security-class issues; flag nothing else" |
| Skill grows to 30 steps and runs for many turns | The workflow outgrew the shared-context model | Promote to a sub-agent. Long workflows with clear handoffs fit isolation better than shared context |
| Orchestrator can't synthesize three agent reports | Return schemas differ across agents | Standardize the return schema before writing the agents, not after the first run shows mismatched output |
| Built-in Explore agent appears to modify a file | Shouldn't happen; Explore is read-only | A different tool call (not Explore) is making the write. Investigate which session issued it |

The meta-check stays the same as [Modules 1](../../tier-1/m1-prompting/) through [5](../m5-rules/): before blaming the model, check what's in the file. For sub-agents, add one layer: before blaming the agent, verify the delegation prompt gave it the context it needed.

## Honest caveat: when the overhead doesn't earn its keep

Honest admission: I haven't hit the case where the sub-agent overhead clearly didn't pay off. My experience with custom sub-agents is still limited. What I do have is a heuristic for when I bother spinning one up.

If the agent's instructions would run under twenty lines or so, I'll usually just do the work in the main context. The overhead of writing the output contract, briefing the agent in the delegation prompt, and aggregating its summary isn't worth it for something I could finish in two or three turns inline. Same for one-shot tasks where the sub-agent would run once and be done. Spinning a fresh context for work that doesn't need its own context is ceremony.

Where I do reach for one: longer tasks that take several turns to land, or work involving research I don't need to see all of. The summary is what I want; the path to it is noise I'd rather isolate.

Two risks I haven't yet paid:

- Three reviewers flagging the same thing in three voices.
- Five files (two skills, three agents) drifting out of sync with the codebase faster than they pay for themselves.

Worth flagging if you hit either one, especially in a small repo where one Claude session with tight rules might carry you further than a crew.

## Bridge to Module 7

The three persona reviewers produce findings. What they don't produce is a verdict. You can run security, performance, and readability reviews and still have no clear answer to "is this PR ready?"

That's the oracle question. [Module 7](../m7-oracle/) builds `./oracle.sh`: a composite score from CI, lint, coverage, and seeded-issue detection. The sub-agents you built here are what the oracle will grade. The exit signal (run the crew until the score clears a threshold) presupposes both the crew (this module) and the scoring system (M7). The loop that uses both comes in [Module 8](../../tier-3/m8-headless/).

## TL;DR

:::tldr

1. **Skills load into the main conversation on demand; sub-agents work in their own context.** The trigger model is the difference, not the file format.
2. **Use a skill when you want to watch and steer the work.** Use a sub-agent when you want isolated execution and a clean handoff.
3. **Brief sub-agents explicitly.** Context isolation means the agent starts fresh. It needs everything relevant in the delegation prompt; it can't read the main session's history.
4. **Restrict sub-agent tools to the minimum.** A reviewer that can only read cannot accidentally edit.
5. **Write a structured output contract before writing the agent, not after.** Agents that return whatever seems useful are hard to aggregate across three reviewers.
6. **Rules, skills, and sub-agents compose.** Rules load automatically when paths match; skills invoke on demand; sub-agents isolate. The orchestrator picks which trigger the situation calls for.
7. **The M5 decision rule extends to a third option.** Rule if it applies wherever Claude is in the relevant code. Skill if it's a workflow you'd invoke deliberately. Sub-agent if the work earns its own context.

:::

## Lab handoff

The lab picks up the `.claude/rules/` structure from [Module 5](../m5-rules/lab/) and adds two skills and three persona sub-agents on top. You run the same PR through three states: rules-only, skills-added, and three-agent crew. ~2 hours, self-paced. The lab is at [./lab/](./lab/).

---

## References

- [**Anthropic's Claude Code sub-agents documentation**](https://docs.claude.com/en/docs/claude-code/sub-agents). Canonical reference on the `.claude/agents/` format, `tools:` frontmatter, context isolation, and the built-in sub-agent types.
- [**Anthropic's Claude Code memory and instructions documentation**](https://docs.claude.com/en/docs/claude-code/memory). Covers `.claude/skills/` and the invocation model.
- [**The cwv-agent repo**](https://github.com/ramboz/cwv-agent). Multi-agent orchestration as shipped code. Skim `src/core/multi-agents/` for the shape of real sub-agent coordination.
- [**PR Assistant sample repo**](https://github.com/ramboz/pr-assistant-lab). The lab's working repo. The M6 lab uses `mock-pr/add-review-engine`; pull latest before starting. The `src/reviewer/` subsystem was added at M6.
