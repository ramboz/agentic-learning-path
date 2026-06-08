---
title: M5 — Path-scoped instructions with Rules
description: When CLAUDE.md grows past the point where loading it every session feels free, you scope it. .claude/rules/ with paths globs, and the contrast with skills.
pagination_label: M5 — Rules
---

# Module 5 — Path-scoped instructions with Rules

**Tier 2** — engineers primary; PMs and architects can read the concept post but the lab is engineer-track.
**Prerequisites:** [Module 1](../../tier-1/m1-prompting/) (Prompting as a design problem), [Module 2](../../tier-1/m2-context/) (Context is the product), [Module 3](../../tier-1/m3-claude-code/) (From chat to Claude Code), [Module 4](../m4-claude-md/) (Writing a CLAUDE.md that earns its keep).

This module picks up from Module 4. The CLAUDE.md you wrote there is the starting point.

---

When I started writing this module, I hadn't written a rule yet. The order is honest about where my experience is: I read the playbook, then I tried it.

So I opened cwv-agent (the same repo from [Module 1](../../tier-1/m1-prompting/)'s PR #68) and asked Claude to look at the CLAUDE.md and tell me whether anything earned a path-scoped split. It came back with three candidates. The one I was most confident about was the rule for the `src/rules/` directory. Each module there follows an opinionated API with no formal interface, and it's the kind of place a fresh session would land on a plausible-looking shape that's wrong in ways tests don't catch. The other two, for prompts and for schemas, felt right too. [PR #69](https://github.com/ramboz/cwv-agent/pull/69) is the result of that review.

If you read the rest of this post and notice it leans on principle rather than war stories, that's why. The principle — load less when you can, scope rules to where they earn their keep — is one I was still working out when I started. The war stories are coming.

## What this module covers

By the end of this module, you'll be able to:

1. Recognize when a well-pruned CLAUDE.md is still loading too much for a given turn
2. Set up `.claude/rules/` with `paths:` frontmatter to scope instructions to matching files
3. Split a working CLAUDE.md without losing the conventions that should stay global
4. Tell rules from skills — the two primitives most likely to be confused
5. Walk through a real refactor: three path-scoped rules and a tightened CLAUDE.md from cwv-agent ([PR #69](https://github.com/ramboz/cwv-agent/pull/69))
6. Use the failure-mode table to debug rules that miss, split wrong, or over-fire
7. Calibrate when scoping costs more than it saves

The lab is a 2-hour exercise. You take the CLAUDE.md you wrote in [Module 4](../m4-claude-md/lab/), split the entries that earn path scoping into `.claude/rules/`, run the same review against two mock PRs, and inspect which rules actually loaded for which file changes. The before-and-after is the lab's main artifact, same shape as Module 4.

This module assumes [Modules 1](../../tier-1/m1-prompting/) through [4](../m4-claude-md/). [Module 4](../m4-claude-md/)'s "state in files, not in your head" is the foundation; this module is about giving that state a finer-grained loading rule.

## The reframe: scope is the next move after pruning

[Module 4](../m4-claude-md/) treated CLAUDE.md as a budget. Every line is loaded every session, every turn, regardless of what the turn is doing. The discipline was pruning: an entry earns its place or it doesn't. The graveyard problem was about entries that stopped earning their place but stayed.

Scoping is what comes after pruning, not instead of it. You've already cut the entries that don't earn the cost. What remains are entries that earn the cost _sometimes_. The convention for how you write API endpoints is load-bearing when Claude is reading or editing API code. It is noise when Claude is touching CSS. With one CLAUDE.md, the entry pays its full cost on every turn whether the turn is using it or not.

The principle from [Module 4](../m4-claude-md/) doesn't change. State belongs in files, loaded at session start, evolved as the project evolves. What changes is the granularity. Instead of one file loaded uniformly, you keep a thin core in CLAUDE.md and split the path-specific parts into separate files that load only when matching paths come into scope.

Same idea as the phase-scoped context fix from [Module 1](../../tier-1/m1-prompting/), applied at a different scope. Don't load everything every time. Load what the situation calls for.

## The mechanics

### How rules work, mechanically

The directory is `.claude/rules/`. Each file inside is a markdown document with optional YAML frontmatter. The frontmatter field that matters here is `paths:`, a glob (or list of globs) that controls when the rule loads.

A minimal example:

:::example

```markdown
---
paths: src/api/**
---

# API conventions

- Routes are defined in `src/api/routes/`. One file per resource.
- Validation uses Zod schemas in `src/api/schemas/`. Don't validate inline.
- Errors are thrown as `ApiError` (see `src/api/errors.ts`); never return error objects.
- Response shape is always `{ data, error }`. Never bare arrays.
```

:::

Loading rule: when Claude reads or edits a file matching `src/api/**`, this rule's body is added to the working context. When Claude is operating elsewhere, the rule sits dormant. The frontmatter is metadata; only the body counts toward the per-turn cost when it loads.

A few mechanical points to call out:

- **Multiple matching rules compose.** If you have one rule for `src/api/**` and another for `**/*.test.ts`, both load when Claude touches a file like `src/api/users.test.ts`. They stack rather than overriding.
- **A rule with no `paths:` frontmatter is always-on.** That makes it the same shape as content in CLAUDE.md, just stored under `.claude/rules/`. Use this only when you're using `.claude/rules/` as filing infrastructure for a CLAUDE.md that was getting hard to maintain.
- **The root CLAUDE.md is still loaded every session.** Rules are additive. Scoping moves things _out_ of CLAUDE.md into rules; it doesn't replace CLAUDE.md.
- **Globs are the same syntax as `.gitignore` patterns.** `src/api/**` matches anything under `src/api/`. `**/*.test.ts` matches test files anywhere in the tree. `src/api/*.ts` matches only the top level of `src/api/`, which is rarely what you want.

What rules don't change:

- They're still markdown read at file-load time, not code that runs.
- They're still subject to the same "earns its place" discipline as CLAUDE.md. Putting a vague convention in a rule doesn't make it less vague.
- They still cost attention when they load. The savings come from loading less often, not from the loaded content being free.

### Rules vs skills: the easy mix-up

[Module 6](../m6-subagents-skills/) introduces skills, the other markdown-instruction primitive in `.claude/`. Both are markdown files with frontmatter. Both can be authored by the same hand. The boundary is easy to miss because the artifacts look similar.

The difference is the trigger.

| | Rule | Skill |
|---|---|---|
| Where it lives | `.claude/rules/<name>.md` | `.claude/skills/<name>.md` |
| When it loads | Automatically, when a matching file comes into scope | When you (or the model) explicitly invokes it |
| Who decides | The `paths:` frontmatter, evaluated by Claude Code | The user typing a slash command, or the model deciding to use the skill |
| Lifetime in context | While files matching the rule are in scope | While the skill is being used; freed after |
| Typical content | Conventions, never-touch lists, things-that-apply-here | Reusable workflows, multi-step procedures, on-demand reference |
| Example | "API endpoints use Zod schemas" | `/pr-summary`, `/explain-code`, `/migrate-to-vitest` |

Same instruction, two homes:

:::example

```markdown
# As a rule (paths: tests/**)
Use `vitest` not `jest`. Mock with `vi.fn()`, not `jest.fn()`. Coverage threshold is 80% per file; failing it blocks merge.
```

:::

:::example

```markdown
# As a skill (/migrate-to-vitest)
Walk the test file the user provides. Replace `jest` imports with `vitest`. Replace `jest.fn()` with `vi.fn()`. Run the file under `npx vitest run` and report failures.
```

:::

The rule applies whenever Claude touches a test file, even if the turn isn't about testing. The skill applies only when the user explicitly asks for a migration. Same domain knowledge, different trigger model.

The decision rule, in one sentence: if it should apply automatically whenever Claude is in the relevant code, it's a rule; if it's a workflow you'd invoke deliberately, it's a skill.

[Module 6](../m6-subagents-skills/) covers skills properly, including the SKILL.md format and the further question of when a skill should become a sub-agent (its own context, its own tools). For now, the only thing that matters is keeping the trigger model straight: rules are about _where_ Claude is working; skills are about _what_ Claude is being asked to do.

### Worked example from cwv-agent: PR #69

The cwv-agent CLAUDE.md from [Module 4](../m4-claude-md/) had been growing. Three things in particular kept loading every session and earning their cost only sometimes: the contract for rule modules under `src/rules/`, the prompt-construction conventions under `src/prompts/`, and the schema-shape rules for the multi-agent system under `src/core/multi-agents/`. Each was load-bearing inside its own subtree and pure noise outside it. [PR #69](https://github.com/ramboz/cwv-agent/pull/69) is the refactor: three path-scoped rules plus a tightened CLAUDE.md.

The three rules:

| Rule | Paths | What it enforces |
|---|---|---|
| `rule-modules.md` | `src/rules/**` | The `evaluate()` contract, return shape, no hardcoded thresholds, imports from `shared.js` |
| `prompt-construction.md` | `src/prompts/**` | Use `createAgentPrompt()`, examples in named consts, shared fragments in `shared.js`, CMS context lives in `contexts/` |
| `schemas.md` | `src/core/multi-agents/**` | No shared Zod constants (`$ref`), no union types (`anyOf`), `method: 'jsonSchema'` (not the v0.3 `'json_schema'`) |

The schemas rule is the one to pull out. The "use `jsonSchema` not `json_schema`" line was already in CLAUDE.md as anti-knowledge from [Module 4](../m4-claude-md/) (the LangChain v0.3 trap). Keeping it there meant every session paid for the reminder, even when the turn had nothing to do with schemas. Moving it into the schemas rule means the trap warning fires only when Claude is touching the directory where the trap can actually bite. Same intent; finer trigger.

What came out of CLAUDE.md and what stayed: the conventions sections for rule modules, prompts, and schemas all left. What stayed was the durable architecture (the orchestration model, the data-collection layers, the cross-cutting "don't extend deprecated paths" decisions) and a new "Path-Scoped Rules" table near the top that points readers at the three rule files. The CLAUDE.md also picked up an explicit "Do Not Edit" list, separating "what's generated" from "what's path-scoped guidance" so the two never get confused. The before-and-after, on a real repo I keep coming back to, is the cleanest demonstration I have of where rules earn their keep.

The decision rule, simplified: conventions about a place go in rules; conventions about the project stay in CLAUDE.md.

## Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Rule never loads even when Claude is editing matching files | Glob is too narrow, or doesn't match the actual layout (e.g., `src/api/*.ts` when files are at `src/api/routes/users.ts`) | Use `**` to recurse: `src/api/**`. Test by reading any file under the path and checking whether the rule appears in context |
| Rule loads on turns where it has nothing to say | Glob is too broad, or the rule belongs in a different file | Tighten the glob, or move the entry back to CLAUDE.md if it's actually project-wide |
| Same convention appears in both CLAUDE.md and a rule | You split entries into rules but didn't remove the originals from CLAUDE.md, so the cost doubled instead of halving | Delete the moved entries from CLAUDE.md. Splitting means moving, not copying. The rule's existence doesn't reduce CLAUDE.md's cost on its own |
| Two rules with overlapping globs disagree | Drift; both rules edited at different times without checking the other | Pick one as authoritative, reference it from the other. Don't try to use rule precedence to resolve disagreements |
| Rule's body is one line of guidance and three paragraphs of motivation | Authored as a doc, not a rule; the model needs the imperative, not the explanation | Strip the motivation. Keep the rule short. If the explanation matters, link to a longer doc; the rule body should be scannable |
| Same instruction in both a rule and a skill | Confusion between "applies whenever I'm here" and "do this when I ask" | Decide which trigger model fits and remove from the other. Both is almost never right |
| Cross-cutting convention duplicated across three rules | Tried to be helpful by repeating; now four files to maintain when the convention changes | Promote to CLAUDE.md. Duplication across rules is a signal the convention isn't path-scoped |
| Rule loads when expected but model ignores it | Same failure mode as the bloated CLAUDE.md from [Module 4](../m4-claude-md/): rule is too long, written as suggestions not rules, or buried | Treat the rule's body the same way you'd treat CLAUDE.md content. Short, imperative, load-bearing only |
| You can't tell whether a rule loaded for a given turn | Not inspecting the working context | Use Claude Code's context inspection (`/context` or equivalent) to verify. Writing rules without verifying loading is the same mistake as writing tests without running them |

The meta-move stays the same as [Module 4](../m4-claude-md/): before blaming the model, check what's in the file. The new check is one level deeper, since rules can fail by not loading as well as by being wrong.

## Honest caveat: when rules don't earn their keep

Honest pull-back: I haven't had time to feel the difference. I shipped PR #69, ran cwv-agent a few times, didn't make any substantial changes to the codebase. The runtime experience hasn't shifted noticeably. I can picture how the rules would help the next time I extend the tool, especially in `src/rules/` where the opinionated API is easy to get wrong, but that's a forecast, not a measurement.

So take the rest of this module as principled, not battle-tested. If you have one CLAUDE.md and it's working, leave it alone. The threshold for splitting probably exists, but I haven't lived through enough sessions on the rules-version of cwv-agent to tell you where it sits, and the cost of three small markdown files plus a thinner CLAUDE.md is small enough that I don't want to manufacture one. If your CLAUDE.md is loud and you can name the entries that load every session for no reason, scope them. Otherwise wait until the friction is real.

## Bridge to Module 6

Rules are the always-on half of the scoping picture. They load when their paths match, automatically, whether you asked for them or not. The other half is on-demand: instructions that load when you (or the model) decide they're relevant, not when a path comes into scope. [Module 6](../m6-subagents-skills/) covers skills (reusable workflows invoked deliberately) and sub-agents (specialists that work in their own context and return summaries). The rules-vs-skills table above is a preview; the full treatment lands there.

The PR Assistant arc continues. [Module 4](../m4-claude-md/lab/) gave you one Claude Code session reviewing PRs with a CLAUDE.md. This module's lab refactors that CLAUDE.md into rules. [Module 6](../m6-subagents-skills/)'s lab decomposes the review itself into three persona reviewers (security, performance, readability) as sub-agents, with a couple of skills (`/pr-summary`, `/explain-code`) for the recurring patterns. Each lab builds on the previous one — you're not starting over, just adding a layer.

## TL;DR

:::tldr

1. **Scoping is the move after pruning, not instead of it.** [Module 4](../m4-claude-md/) made CLAUDE.md tight. This module makes the loading rule finer. Same principle, finer granularity.
2. **Conventions about a place go in rules; conventions about the project stay in CLAUDE.md.** That's the decision rule for what splits and what doesn't. Cross-cutting things stay global.
3. **Rules load automatically when their `paths:` glob matches; skills load only when invoked.** The trigger model is the difference, not the file format. Mixing them is the most common early mistake.
4. **A rule body has the same discipline as CLAUDE.md content.** Short, imperative, load-bearing only. A bloated rule that loads correctly is still a bloated rule.
5. **Verify rules load before trusting them.** Inspect the working context. Globs that look right but don't match are the most common silent failure.
6. **Duplication across rules signals a project-wide convention.** If three rules say the same thing, the convention belongs in CLAUDE.md.
7. **The discipline transfers from [Modules 1](../../tier-1/m1-prompting/) through [4](../m4-claude-md/).** Specify well, manage context, scope tightly, prune what doesn't earn its place. The medium gets one more layer; the job is the same.

:::

## Lab handoff

The lab refactors the CLAUDE.md you wrote in [Module 4](../m4-claude-md/lab/) into a `.claude/rules/` directory plus a trimmed root file. You'll run the same review task against two mock PRs, inspect which rules loaded for each, and compare the result against the Module 4 baseline. The lab is at [./lab/](./lab/).

---

## References

- [**Anthropic's Claude Code rules documentation**](https://docs.claude.com/en/docs/claude-code/memory). The canonical reference on `.claude/rules/`, frontmatter shape, and loading semantics. Read alongside the CLAUDE.md guidance from Module 4.
- [**Claude Code documentation overview**](https://docs.claude.com/en/docs/claude-code/overview). Broader doc set covering context inspection (`/context`), settings, and the `.claude/` directory layout that rules sit inside.
- [**AI-First Development Guidelines**](https://github.com/adobe/mysticat-ai-native-guidelines). The team's operating playbook, in more depth than a module carries. For the production version of rule-writing, see its guardrails section (MUST/SHOULD rules, mechanical enforcement, anti-patterns). This module is the scoping mechanic; the guidelines are which rules a team actually encodes.
- [**The cwv-agent repo**](https://github.com/ramboz/cwv-agent). The recurring example from earlier modules. Skim for the shape of the `.claude/` directory, not the content.
- [**cwv-agent PR #69**](https://github.com/ramboz/cwv-agent/pull/69). The real refactor referenced in the worked-example section. Three path-scoped rules and a tightened CLAUDE.md, on the same repo Module 1's PR #68 came from. Skim for what got moved out of CLAUDE.md and what stayed.
- [**PR Assistant sample repo**](https://github.com/ramboz/pr-assistant-lab). The lab's working repo. The M5 lab uses two mock PR branches: `mock-pr/api-rate-limiting` (scoped to `src/api/**`) and `mock-pr/tests-fixture-overhaul` (scoped to test files). Pull the latest before starting; both branches were added at M5 alongside the new `src/api/` subsystem.
