---
title: M7 — The oracle problem
description: How an autonomous agent knows whether what it just did was good. Subjective oracles collapse under iteration; composite objective oracles compound.
pagination_label: M7 — Oracle problem
---

# Module 7 — The oracle problem

**Tier 2** — engineers primary; PMs and architects can read the concept post but the lab is engineer-track. This is the last Tier 2 module; the concept-only track for non-engineers ends here.
**Prerequisites:** [Module 1](../../tier-1/m1-prompting/) (Prompting as a design problem), [Module 2](../../tier-1/m2-context/) (Context is the product), [Module 3](../../tier-1/m3-claude-code/) (From chat to Claude Code), [Module 4](../m4-claude-md/) (Writing a CLAUDE.md that earns its keep), [Module 5](../m5-rules/) (Path-scoped instructions with Rules), [Module 6](../m6-subagents-skills/) (Sub-agents and Skills).

This module sits at the hinge of the curriculum. Everything before it has been about making one Claude session produce better work. Everything after assumes a Claude that can run without you watching.

---

<!-- TODO(Julien): opening hook. Personal moment, chat-register.
2-4 paragraphs. The recurring pattern (not a single anecdote, since
it keeps happening): Claude Code reports a spec as fully implemented.
When I explicitly ask "are all the acceptance criteria covered? is
everything done?" it does a second pass and finds gaps. Same code,
same model, different verdict. Unless I ask, the gap stays silent
and only surfaces later when follow-up work relies on the
implementation.

Beats the hook should hit:
  - The pattern is recurring, not a one-off. "This kept happening."
  - The asymmetry: the model's self-report is the easy answer; the
    real answer needs a second pass I had to think to trigger.
  - Asking again was itself a fix I couldn't automate. I happened to
    follow up. An unattended loop doesn't follow up.
  - The question the rest of the module exists to answer: if I can't
    trust the verdict on one PR in one session, what would I trust
    overnight?

Chat-register. Specific over generic. Don't generalize past "this
keeps happening to me." -->

## What this module covers

In a nutshell:

1. Why the question shifts from "is this work good?" to "what signal would tell us it's good enough to stop?"
2. Three classes of oracle, and why only one of them holds up under iteration
3. The single move that turns a brittle oracle into a durable one: composition
4. Failure modes for oracles that look reasonable but mislead

The lab is a ~2-hour exercise. You build `./oracle.sh <pr-branch>`: a shell script that scores a PR branch on CI status, lint count, coverage delta, and seeded-issue detection. The script is the artifact every downstream module reuses. [Module 8](../../tier-3/m8-headless/) plugs it in as a Ralph-loop exit signal. [Module 9](../../tier-3/m9-hooks/) wraps it in a `Stop` hook that retries below threshold. [Module 10](../../tier-3/m10-parallel/) uses it to pick winners across parallel worktrees.

This is the last module that's genuinely standalone. From [Module 8](../../tier-3/m8-headless/) onward, the oracle is presupposed.

## The reframe: the question shifts when the human stops watching

Modules 1 through 6 all assumed a human in the loop. You ran a session, you read the output, you decided what to keep. The implicit oracle was you.

That works while you're watching. It stops working the moment the agent runs unattended. A loop that says "do work until you're done" needs a `done` signal that doesn't depend on you reading the output.

The question stops being "is this good?" The question becomes: what observable signal would tell us this work is good enough to stop, and reliable enough that we'd trust it overnight?

That's the oracle problem. Most failures of agentic systems in the wild trace back to a weak or absent oracle, not to a weak model.

The core move is to separate two things that often get conflated:

- **The goal.** What we want the work to accomplish. ("This PR fixes the bug without breaking anything else.")
- **The oracle.** The observable signal we use to check whether the goal has been met. ("CI is green, lint count didn't grow, coverage didn't drop, the seeded issues we know about were caught.")

The oracle is a proxy for the goal, not the goal itself. The whole module is about picking proxies that hold up under the kind of pressure an agent puts on them.

## Three kinds of oracle

| Class | Example | Holds up under iteration? |
|---|---|---|
| Subjective | Ask another model: is this good? | No |
| Single-signal objective | CI is green | Partially |
| Composite objective | CI + lint + coverage + targeted detection, scored together | Yes |

**Subjective oracles** ask a model to judge another model's output. They sound right ("is this PR ready?") and they're cheap to build. They have one structural problem: a model's verdict is noisy, drifts as its context fills, and an agent in a loop learns the judge's blind spots faster than you'd expect. Useful as a co-signal in a single review (the persona reviewers from [Module 6](../m6-subagents-skills/) are exactly that). Not useful as the exit signal for an unattended loop.

**Single-signal objective oracles** lean on one observable measurement, usually CI status. CI is deterministic and hard to fake by accident. The problem is that a single bit gives an agent a single thing to optimize, and the path of least resistance to "CI green" sometimes runs through "tests no longer assert anything meaningful." Coverage thresholds fail the same way: tests that don't assert. Lint counts: rules disabled. Each individual signal is gameable in a known way.

**Composite objective oracles** combine several signals into one score. The trick is picking signals whose gameable paths don't overlap. An agent optimizing for CI alone hits the coverage signal; one optimizing for coverage alone hits the seeded-issue detection. The composite isn't magic. It's just hard enough to game accidentally that the bottleneck shifts from "the oracle gave the wrong answer" to "we picked the wrong signals," which is a tractable problem.

## What `oracle.sh` looks like

The lab artifact is a shell script. Four signals, each a function returning 0-100, combined with explicit weights, with a threshold gating the exit code:

:::example

```
ci_score      * 0.40
seeded_score  * 0.30
lint_score    * 0.15
coverage_score* 0.15
              -------
              composite (0-100), threshold 70
```

:::

A few choices that earn their place:

- **One script, one job.** The oracle's only output is a score and a verdict. It does not fix problems, generate suggestions, or call agents. Mixing scoring with remediation makes the score harder to trust.
- **Each signal is a function, replaceable on its own.** If `check_lint` is too strict, you tune it without touching the rest.
- **The verdict is the exit code.** Loops, hooks, and CI integrations all consume exit codes natively. A script that prints a verdict but exits 0 either way passes every PR.
- **The breakdown is the report.** When the score is low, the breakdown tells you which signal failed.

The full script lives in the lab. Everything from here on assumes you can call `./oracle.sh <branch>` and read an exit code.

## Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Score is high but the PR is obviously bad | A signal isn't measuring what it claims to (e.g., coverage is rising because tests don't assert) | Run the oracle on a known-bad PR and check which signal failed to fail. The composite is only as honest as its weakest signal |
| Loop never exits | Threshold is unreachable, or signals are flapping run-to-run | Inspect the breakdown across runs. Stable signals with score below threshold means threshold is too tight; flapping signals mean noise (use deltas, raise the retry cap, or drop the noisy signal) |
| Agent learns to game one signal | Composite isn't composite enough; some path satisfies all current signals without satisfying the goal | Add a signal whose gameable path is disjoint from the existing ones. Rotating seeded issues per run is usually the first move |
| A subjective signal sneaked back in | An "LLM-as-judge" component got added "just for one signal" | Replace it with an observable measurement, or downgrade the oracle's role to advisory |
| Threshold tuned by gut, not by data | "70 sounds reasonable" | Run the oracle on five known-good PRs and five known-bad. The threshold should cleanly separate them. If it doesn't, the signals aren't right yet |

The meta-move stays the same as previous modules: before blaming the model, check what's in the file. For oracles, the file is `oracle.sh`, and the failure usually traces to one signal, not the composite.

## Honest caveat: where I haven't lived this yet

<!-- TODO(Julien): voice-pass and lived-experience pass. The honest
position is that I haven't built a composite objective oracle and
run it unattended against my own work for long enough to feel its
sharp edges. I've sketched the shape, watched the failure modes hit
other people's loops, but haven't lived through the long tail myself.

Specifically flag, in the voice of M5/M6's caveats:
  - Weights aren't tuned from data on this project yet
  - Threshold of 70 is a guess, not a measurement
  - Goodhart's law (the oracle becomes the spec; agents optimize the
    score, not the goal) is read, not lived. The two moves I know
    about are rotating what can be memorized, and sample-verifying
    high scores against a human read. Both are upkeep, not
    automation. If your loop runs hard enough to make Goodhart bite,
    your experience will outpace mine.

Where this module is principled vs battle-tested: principled. The
battle-testing is what M8-M10 produce. -->

## Bridge to Module 8

The oracle is the missing piece for unattended runs. With it, a loop can decide on its own when to stop. Without it, a loop is a coin flip you can't unflip.

[Module 8](../../tier-3/m8-headless/) is the first module where the human steps out of the loop. It covers `claude -p`, headless mode flags, and the Ralph loop pattern, with `oracle.sh` as the exit signal. [Module 9](../../tier-3/m9-hooks/) builds on both: a `Stop` hook spawns a meta-judge that calls `oracle.sh` and decides whether to retry. The full agent gets safer to run overnight precisely because the oracle gates the unattended path.

This is also where the concept-only track ends. Tier 3 is engineer-track only. The oracle is the last idea every reader needs.

## TL;DR

:::tldr

1. **The oracle is the signal that tells an unattended agent it's done.** Without one, you don't have an autonomous loop; you have a coin flip.
2. **Subjective oracles collapse under iteration.** Noise, drift, and adversarial pressure stack across runs.
3. **Single-signal objective oracles are brittle.** A bit of optimization pressure finds the gameable path.
4. **Composite objective oracles compound.** Multiple signals with disjoint gameable paths force the agent to satisfy the goal instead of one signal.
5. **The oracle is a proxy for the goal.** Picking signals well is most of the work; the bash is mechanical.
6. **One oracle per project.** Modules 8 through 10 all call the same `oracle.sh`. Drift kills the composability.

:::

## Lab handoff

The lab builds `./oracle.sh <pr-branch>` against the PR Assistant repo. You wire four signals (CI, lint, coverage, seeded-issue detection), tune the weights and threshold against known-good and known-bad PRs, and end with a script every downstream module reuses. ~2 hours, self-paced. The lab is at [./lab/](./lab/).

---

## References

- [**Anthropic's Claude Code documentation**](https://docs.claude.com/en/docs/claude-code/overview). The canonical reference for the agent harness and how exit codes from external scripts compose with sessions, hooks, and headless runs.
- [**Goodhart's law**](https://en.wikipedia.org/wiki/Goodhart%27s_law). One-page background on why "when a measure becomes a target, it ceases to be a good measure." Relevant once an agent runs against the oracle long enough to push on it.
- [**The Ralph Wiggum loop**](https://ghuntley.com/ralph/). Geoffrey Huntley's writeup of the Ralph loop pattern. The exit-signal question this module answers is the one Ralph loops force you to take seriously.
- [**The cwv-agent repo**](https://github.com/ramboz/cwv-agent). The recurring example. Skim `src/core/multi-agents/eval/` for the shape of an internal scoring system on a real codebase, and note where it falls short of being a real oracle.
- [**jig (separate side project)**](https://github.com/ramboz/jig). Optional further reading if you want another battle-tested reference. Its `independent-review` sub-agent runs against a finished slice with no chat history — an LLM-as-judge oracle in production, with the structural caveat (subjective signal, useful for diff-level review, not as the exit signal for an unattended loop) that this module argues for. Skim [`skills/independent-review/SKILL.md`](https://github.com/ramboz/jig/tree/main/skills/independent-review) and an example spec under [`docs/specs/`](https://github.com/ramboz/jig/tree/main/docs/specs) to see acceptance criteria driving the verdict.
- [**PR Assistant sample repo**](https://github.com/ramboz/pr-assistant-lab). The lab's working repo. The M7 lab uses two mock branches with explicit seeded issues: `mock-pr/oracle-good` and `mock-pr/oracle-bad`. Pull the latest before starting.
