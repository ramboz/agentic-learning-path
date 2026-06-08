---
title: M1 — Prompting as a design problem
description: Frame-setter. Why "prompt engineering" is misleading; the real skill is specification.
pagination_label: M1 — Prompting
---

# Module 1 — Prompting as a design problem, not a phrasing trick

**Tier 1** — for everyone (PMs, architects, engineers).  
**Prerequisites:** None.

---

During a recent workshop, my colleague [Lucian](https://github.com/lucianfelix) was telling me about his migration of a vibe-coded project to a new version, and that this time around he was doing it differently. He was doing spec-driven development. I nodded along, not really sure what he meant, and asked him to walk me through it.

What he described, roughly, was this: he wasn't writing code anymore. He was writing markdown files. Specs, design docs, constraints, examples of what the output should look like. The agent wrote the code. His job was to write the specs well enough that the code came out right.

I'd been vibe-coding for 2 years at that point. My version of it was a chat window next to my editor. I'd describe what I wanted, the agent would produce something, I'd read it, fix what was off, ask for changes. The markdown files in my repos were README, CHANGELOG, maybe a CONTRIBUTING if I felt organized. Nothing load-bearing. The actual thinking lived in the chat.

His version was the opposite. The markdown was load-bearing. The chat was transient.

That reframe is what this module is about, at the smallest possible scale. A single prompt is a spec too. I'd been treating my prompts the way I was treating my chat: a place to think out loud, iterate toward what I wanted, correct the model when it drifted. That works. It's also the reason I kept hitting a ceiling and blaming the model.

The alternative isn't better phrasing. It's treating the prompt itself as the artifact worth getting right.

## What this module covers

By the end of this module, you'll be able to:

1. Move past "better phrasing" and treat prompts as clear specifications
2. Write prompts using the four components that make a spec: task, constraints, context, examples
3. Diagnose disappointing outputs and fix them with a single targeted change
4. Build the predict-before-run habit to surface gaps before you send
5. Iterate without fooling yourself with run-to-run noise
6. Recognize when you've over-specified and pull back

The lab at the end is a 90-minute self-paced exercise. You take 5 bad prompts, rewrite each three ways, predict which version wins, then run and compare.

The rest of the curriculum assumes you think about prompts as specs. Skipping this one makes Modules 2 through 12 feel like a pile of tools with no handle.

## The reframe: prompts as specs

"Prompt engineering" became shorthand for magic phrases. Tell the model it's an expert. Ask it to take a deep breath. Offer it a tip. A lot of this folklore works, or used to. Modern models are trained on instruction data that already contains these patterns, so adding "you are an expert" to a recent model buys you a few points on some tasks and zero on others.

The reframe that holds up better: prompts are specs. The skill is not incantation. It's articulating what you want clearly enough that a competent stranger could produce it without asking follow-up questions. If you've ever written a ticket that came back as the wrong thing, you know the skill. The medium is different. The problem is the same.

Phrasing still matters at the margin. "Make it shorter" and "reduce this to 150 words" produce different outputs, and the second one wins because it's specific. But the gap between a vague prompt and a specified one is roughly 10x larger than the gap between two well-specified prompts phrased differently. The real work happens before you pick the words.

One concession: "prompt engineering" isn't a useless term. It's a fine category label. It becomes misleading when people read it as a tricks collection. They then spend their time bookmarking clever phrasings instead of building the one habit that actually moves quality, which is writing clear specs.

## What a spec-style prompt contains

In a nutshell, a spec-style prompt has four components.

### Task

What does done look like? "Write a blog post about AI" is a topic, not a task. "Write a 600-word blog post explaining to a non-technical PM why long conversations with Claude degrade over time" is a task.

Quick check: if I removed the model and handed this prompt to a competent stranger, would they know what to produce? If not, the task is underspecified.

### Constraints

What must be true of the output? Length, format, tone, things to avoid. Constraints let you tell "this is fine" from "this isn't" without a subjective call.

Quick check: if I got back two different outputs, could I say which was better without a subjective call? If not, add constraints until I could.

### Context

What does the model need to know that it can't assume? The audience, the project, the repo, the fact that the reader already knows what a token is. Context is where underspecification hides. You know it, so you forget to say it.

Quick check: does the prompt assume anything the model couldn't reasonably know? If yes, either add it or acknowledge the gap.

### Examples

When the shape of what you want is easier shown than described. Two examples beat a paragraph of description for format-heavy outputs (i.e. tables, code style, consistent heading patterns).

Quick check: am I describing a format in words when a 3-line sample would be unambiguous? If yes, switch to the sample.

Not every prompt needs all four. "What's the capital of France" is a one-liner, and dressing it up is ceremony. The components matter when the task has enough degrees of freedom that the model could reasonably do several things and you only want one of them.

**A worked example.** Here's a prompt I wrote early on when I needed a weekly project update:

:::example

```
Here is everything we shipped this sprint:

[list of features and fixes]

Write an update.
```

:::

Run the task check on that. If you handed this to a competent stranger, would they know what to produce? No. The prompt ships a list of raw changes with no task attached. "Write an update" isn't a task — it's an invitation to guess. Who's the audience? What format? A Slack post, a slide, an email? What should the reader feel or do after reading it?

The actual answers lived in my head: a short Slack message for a non-technical stakeholder, focused on impact rather than activity. None of that was in the prompt.

The fix:

:::example

```
Write a two-paragraph Slack update for a non-technical stakeholder. Focus on
impact, not activity. Tone is direct and low-hype. Here are the items shipped
this sprint:

[list of features and fixes]
```

:::

Same inputs, task now specified. The output lands on the first try.

## Failure modes and the move that fixes each

When an output disappoints, it usually fails along one of a small number of axes. The table below is the diagnostic cheat sheet. The meta-move underneath the table is the actual skill.

| Symptom | Diagnosis | Fix |
|---|---|---|
| Too long or too short | No length specified | Add a target (~300 words, 3 bullets, under a tweet) |
| Wrong format | Format described in words, not shown | Include a 2-3 line example of the desired output |
| Generic or bland | No audience, no constraints | Specify reader, purpose, and at least one thing to avoid |
| Misses the point | Task stated as a topic, not as "what done looks like" | Restate the task as a question whose answer is the output |
| Hallucinates | No room for uncertainty in the prompt | Tell the model to flag uncertainty, cite sources, or say it doesn't know |
| Inconsistent across runs | Prompt leaves too many degrees of freedom | Tighten constraints until two valid outputs would look similar |

The meta-move: before blaming the model, check which of the four components you left out. Most disappointing outputs can be diagnosed in 30 seconds this way. The ones that can't usually come down to the task being ambiguous to you too. In that case, you'd hand the same ambiguity to a human and get the same problem back.

## Predict before you run

One habit that moves quality, especially early on: before you hit send, write one sentence about what you expect back. Length, shape, whether the model will get the point. Then run.

The value is not the prediction itself. The value is that writing the prediction surfaces the things you didn't specify. You sit down to predict, and you realize you don't know what length you want. Or what tone. Or whether you want bullets or prose. That gap is what your prompt is missing.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once: how good the output is, and how clear your own thinking was.

A rough quantitative rule to go with the habit. If your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse also holds. If you can't predict the output at all, you haven't specified enough for the output to be judged.

Honest caveat. I've been prompting for roughly two years and I've never done this explicitly, with a scratch doc and a written-down expectation. What I do have is a running sense of what I expect before I run, and a quick "that wasn't it" reaction when the output lands, which sends me back to the prompt rather than to a retry. That's the same loop, just internalized. If you've been at this for a while and the explicit version feels like overhead, you may already be doing the intuitive version. If you're newer to it, I'd actually recommend the explicit version for the first few weeks. The scratch doc forces the gap-finding that intuition eventually handles for you.

## Iteration: prompts aren't one-shot

The loop is simple:

1. Run the prompt
2. Diagnose what's off using the failure-mode table
3. Change one thing
4. Rerun

One thing at a time is the discipline that looks optional but isn't. If you add an example, and tighten the length spec, and add a role, and the output improves, you don't know which change helped. Next time you face a similar problem, you're back to guessing. Single-variable changes compound. Multi-variable changes don't.

Two specific rules inside the loop.

### Know your noise floor

The same prompt, run three times, will not produce identical outputs. Sometimes the variance is small (a few word choices). Sometimes it's a structurally different answer. Before you celebrate that your rewrite "worked," run it twice more. If the spread on the old prompt is wider than the gap between old and new, you moved nothing.

### Stop when diminishing returns kick in

The first three iterations of a serious prompt usually produce big improvements. Iterations four through ten produce smaller ones. After that, you're polishing. If an iteration moves the needle by less than the between-run noise, you're done. Ship the current version and move on.

## When you're over-specifying

The mirror image of underspecification is worth naming. People who internalize the "prompts are specs" frame tend to end up here. If the prompt is longer than the output, you're probably writing the output yourself with extra steps. The model isn't adding much.

Symptoms:

- Every detail pinned down, and outputs feel robotic or formulaic
- So many examples that the model is pattern-matching on your template
- Adding another constraint would contradict an existing one
- You're specifying things the model would reliably get right anyway (i.e. basic grammar, punctuation, standard vocabulary)

The test: remove one constraint and rerun. If the output is the same or better, the constraint was dead weight. If it's worse, keep it. Do this until removing any one constraint makes things worse. That's the minimal spec for this task.

**Over-specifying at the context level.** The same trap exists at the context level, not just the constraint level. I ran into this while building a multi-step automated workflow for a project. The system had several stages, each handling a different part of the analysis. Every stage was receiving the same large block of background context — project history, technical conventions, a set of guidelines. Useful for some stages. Pure noise for others. One stage that only needed high-level summary data was receiving detailed implementation notes it never touched.

Honest admission: I didn't notice this until I was writing this module. My working assumption had been that more context was fine as long as I stayed within the token budget. It isn't. Routing the full context to a stage that only needs a fraction of it is roughly like giving someone a Stack Overflow question and the entire MDN documentation, then asking them to answer. They'll still answer it. They'll just be slower, and the answer may cite something that wasn't actually relevant.

The fix was scope-matched context: each stage gets only what its job requires. The shared baseline stays small. If you want to see what this looks like in a real codebase, [PR #68 in the cwv-agent repo](https://github.com/ramboz/cwv-agent/pull/68) has the diff.


## Bridge to Module 2

Specification gets you a good single-turn result. This module assumed one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem. The spec is fine. It's a context problem. [Module 2](../m2-context/) picks up there.

## TL;DR

:::tldr

1. **Prompts are specs, not incantations.** The gap between a vague prompt and a specified one dwarfs the gap between two well-specified prompts phrased differently. Work on the spec first, the phrasing last.
2. **Four components make a spec: task, constraints, context, examples.** Most disappointing outputs are missing one of these. Check which before blaming the model.
3. **Predict before you run.** Writing a one-sentence prediction surfaces what you didn't specify. The prediction itself doesn't matter. The gap-finding does.
4. **Change one thing per iteration.** Multi-variable changes don't teach you anything. If you changed three things and the output improved, you don't know why.
5. **Know your noise floor.** The same prompt run three times produces different outputs. If your "improvement" is smaller than the run-to-run spread, you moved nothing.
6. **Over-specifying is a real failure mode.** If the prompt is longer than the output, you're writing the output yourself. The test: remove a constraint, rerun, see if it matters.
7. **Stop when iterations stop paying.** The first three usually matter a lot. After five or six, you're polishing. Ship and move on.

:::

## Lab handoff

The lab takes 5 deliberately bad prompts and asks you to rewrite each three ways, predict which version wins before running, then run and compare. The prediction is what builds the diagnostic reflex. The lab is at [./lab/](./lab/).

---

## References

- [**Anthropic prompting docs**](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview). Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame. Less useful for building the frame itself.
- [**"Hallucinations in code are the least dangerous form of LLM mistakes" (Willison)**](https://simonwillison.net/2025/Mar/2/hallucinations-in-code/). Reframes prompting around tight feedback loops where the compiler and tests catch errors before you do. Pairs with this module's "specification, not phrasing" frame.
- [**"Prompt report" (Schulhoff et al., 2024)**](https://arxiv.org/abs/2406.06608). A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy. The useful finding for this module is that most "clever" techniques produce small gains compared to basic specification.
- [**Shreya Shankar et al. on prompt evaluation**](https://arxiv.org/abs/2404.12272). Applied work on evaluating prompt quality systematically. Matters more for production systems. Worth reading if [Module 7](../../tier-2/m7-oracle/) (oracles) catches your attention.
- [**cwv-agent PR #68**](https://github.com/ramboz/cwv-agent/pull/68). A real example of scope-matched context: different stages of a multi-step workflow get different subsets of context instead of the full payload. Referenced in the over-specifying section.
