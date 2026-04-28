---
title: M1 — Prompting as a design problem
description: Frame-setter. Why "prompt engineering" is misleading; the real skill is specification.
---

# Module 1 — Prompting as a design problem, not a phrasing trick

**Tier:** 1 (everyone)
**Audience:** Mixed (PMs, architects, engineers)
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** None. Frame-setter for the whole curriculum.
**Standalone publishable:** Yes
**Ends with bridge to:** Module 2 (Context is the product)

---

## Concept post

### Opening

During a recent workshop, my colleague [Lucian](https://github.com/lucianfelix) was telling me about his migration of a vibe-coded project to a new version, and that this time around he was doing it differently. He was doing spec-driven development. I nodded along, not really sure what he meant, and asked him to walk me through it.

What he described, roughly, was this: he wasn't writing code anymore. He was writing markdown files. Specs, design docs, constraints, examples of what the output should look like. The agent wrote the code. His job was to write the specs well enough that the code came out right.

I'd been vibe-coding for 2 years at that point. My version of it was a chat window next to my editor. I'd describe what I wanted, the agent would produce something, I'd read it, fix what was off, ask for changes. The markdown files in my repos were README, CHANGELOG, maybe a CONTRIBUTING if I felt organized. Nothing load-bearing. The actual thinking lived in the chat.

His version was the inverse. The markdown was load-bearing. The chat was transient.

That reframe is what this module is about, at the smallest possible scale. A single prompt is a spec too. Most people I've watched write prompts treat them the way I was treating my chat: a place to think out loud, iterate toward what they want, correct the model when it drifts. That works. It's also the reason the same people hit a ceiling and blame the model.

The alternative isn't more clever phrasing. It's treating the prompt itself as the artifact worth getting right.

### What this module covers

In a nutshell:

1. Why treating prompts as phrasing tricks caps your quality ceiling
2. The four components of a prompt-as-spec (task, constraints, context, examples)
3. A failure-mode table that maps common bad outputs to a single-move fix
4. The predict-before-run habit, and what it tells you
5. How to iterate without fooling yourself with run-to-run noise
6. How to recognize over-specifying and pull back

The lab at the end is a 90-minute self-paced exercise. You take 5 bad prompts, rewrite each three ways, predict which version wins, then run and compare.

This module is the frame-setter for the curriculum. The rest of it assumes you think about prompts as specs. Skipping this one makes Modules 2 through 10 feel like a pile of tools with no handle.

### The frame shift

"Prompt engineering" became shorthand for magic phrases. Tell the model it's an expert. Ask it to take a deep breath. Offer it a tip. A lot of this folklore works, or used to. Modern models are trained on instruction data that already contains these patterns, so adding "you are an expert" to a recent model buys you a few points on some tasks and zero on others.

The reframe that holds up better: prompts are specs. The skill is not incantation. It's articulating what you want clearly enough that a competent stranger could produce it without asking follow-up questions. If you've ever written a ticket that came back as the wrong thing, you know the skill. The medium is different. The problem is the same.

Phrasing still matters at the margin. "Make it shorter" and "reduce this to 150 words" produce different outputs, and the second one wins because it's specific. But the gap between a vague prompt and a specified one is roughly 10x larger than the gap between two well-specified prompts phrased differently. The real work happens before you pick the words.

One concession: "prompt engineering" isn't a useless term. It's a fine category label. It becomes misleading when people read it as a tricks collection. They then spend their time bookmarking clever phrasings instead of building the one habit that actually moves quality, which is writing clear specs.

### What a spec-style prompt contains

In a nutshell, a spec-style prompt has four components:

1. **Task.** What does done look like? "Write a blog post about AI" is a topic, not a task. "Write a 600-word blog post explaining to a non-technical PM why long conversations with Claude degrade over time" is a task.
2. **Constraints.** What must be true of the output? Length, format, tone, things to avoid. Constraints let you tell "this is fine" from "this isn't" without a subjective call.
3. **Context.** What does the model need to know that it can't assume? The audience, the project, the repo, the fact that the reader already knows what a token is. Context is where underspecification hides. You know it, so you forget to say it.
4. **Examples.** When the shape of what you want is easier shown than described. Two examples beat a paragraph of description for format-heavy outputs (i.e. tables, code style, consistent heading patterns).

Each component has a one-line test you can run on a prompt before sending it:

- **Task test:** If I removed the model and handed this prompt to a competent stranger, would they know what to produce? If not, the task is underspecified.
- **Constraints test:** If I got back two different outputs, could I say which was better without a subjective call? If not, add constraints until I could.
- **Context test:** Does the prompt assume anything the model couldn't reasonably know? If yes, either add it or acknowledge the gap.
- **Examples test:** Am I describing a format in words when a 3-line sample would be unambiguous? If yes, switch to the sample.

Not every prompt needs all four. "What's the capital of France" is a one-liner, and dressing it up is ceremony. The components matter when the task has enough degrees of freedom that the model could reasonably do several things and you only want one of them.

**A worked example from my own repo.** Here's a step prompt from an agent I wrote for Core Web Vitals analysis (`github.com/ramboz/cwv-agent`):

```js
export const harStep = (har) => `
${stepVerbose()} here is the HAR JSON object for the page:

${JSON.stringify(har, null, 2)}
`;
```

Run the task test on that. If you handed this to a competent stranger, would they know what to produce? No. The prompt ships a HAR file with no task attached. The actual task ("analyze network waterfall, identify render-blocking resources, pinpoint third-party delays, ...") lives in a different file and gets stitched in by an orchestrator. The stitching works, but the prompt itself fails the first test. I'll come back to this in the over-specifying section below, because the context story is worse.

### Common failure modes and the move that fixes each

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

### Predict before you run

One habit that moves quality, especially early on: before you hit send, write one sentence about what you expect back. Length, shape, whether the model will get the point. Then run.

The value is not the prediction itself. The value is that writing the prediction surfaces the things you didn't specify. You sit down to predict, and you realize you don't know what length you want. Or what tone. Or whether you want bullets or prose. That gap is what your prompt is missing.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once: how good the output is, and how clear your own thinking was.

A rough quantitative rule to go with the habit. If your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse also holds. If you can't predict the output at all, you haven't specified enough for the output to be judged.

Honest caveat. I've been prompting for roughly two years and I've never done this explicitly, with a scratch doc and a written-down expectation. What I do have is a running sense of what I expect before I run, and a quick "that wasn't it" reaction when the output lands, which sends me back to the prompt rather than to a retry. That's the same loop, just internalized. If you've been at this for a while and the explicit version feels like overhead, you may already be doing the intuitive version. If you're newer to it, I'd actually recommend the explicit version for the first few weeks. The scratch doc forces the gap-finding that intuition eventually handles for you.

### Iteration: prompts aren't one-shot

The loop is simple:

1. Run the prompt
2. Diagnose what's off using the failure-mode table
3. Change one thing
4. Rerun

One thing at a time is the discipline that looks optional but isn't. If you add an example, and tighten the length spec, and add a role, and the output improves, you don't know which change helped. Next time you face a similar problem, you're back to guessing. Single-variable changes compound. Multi-variable changes don't.

Two specific rules inside the loop.

**Know your noise floor.** The same prompt, run three times, will not produce identical outputs. Sometimes the variance is small (a few word choices). Sometimes it's a structurally different answer. Before you celebrate that your rewrite "worked," run it twice more. If the spread on the old prompt is wider than the gap between old and new, you moved nothing.

**Stop when diminishing returns kick in.** The first three iterations of a serious prompt usually produce big improvements. Iterations four through ten produce smaller ones. After that, you're polishing. If an iteration moves the needle by less than the between-run noise, you're done. Ship the current version and move on.

### When you're over-specifying

The mirror image of underspecification is worth naming. People who internalize the "prompts are specs" frame tend to end up here. If the prompt is longer than the output, you're probably writing the output yourself with extra steps. The model isn't adding much.

Symptoms:

- Every detail pinned down, and outputs feel robotic or formulaic
- So many examples that the model is pattern-matching on your template
- Adding another constraint would contradict an existing one
- You're specifying things the model would reliably get right anyway (i.e. basic grammar, punctuation, standard vocabulary)

The test: remove one constraint and rerun. If the output is the same or better, the constraint was dead weight. If it's worse, keep it. Do this until removing any one constraint makes things worse. That's the minimal spec for this task.

**Back to cwv-agent.** Over-specifying also happens at the context level, not just the constraint level. The agent I mentioned earlier analyzes performance data across 8 different phases (field data, lab data, network waterfall, markup, code review, and so on), each handled by a different sub-agent. Every one of those sub-agents gets the same `getTechnicalContext(cms)` payload: roughly 60 bullets covering CMS characteristics, common optimizations for each Core Web Vital, and anti-patterns to avoid. The CrUX agent, which analyzes field data trends and doesn't look at code at all, receives the full section on "scripts.js has a decorateMain method that patches HTML markup before rendering starts." Useful for the code-review agent. Pure noise for the CrUX one.

Honest admission: I didn't notice this about my own code until I was writing this module. My working assumption had been that more context is better as long as you're within the context window and token budget. It isn't. Shipping the full EDS context to the CrUX agent is roughly like giving someone a stack overflow question and also the entire MDN web docs, then asking them to answer the question. They'll still answer it. They'll just be slower, and the odds go up that the answer cites something from MDN that wasn't actually relevant.

The fix I shipped back to that repo is phase-scoped context. CrUX agent gets the field-data-relevant subset. Code review agent gets the code-level idioms. The shared baseline stays small. [PR #68](https://github.com/ramboz/cwv-agent/pull/68) has the diff.


### Bridge to Module 2

Specification gets you a good single-turn result. This module assumed one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem. The spec is fine. It's a context problem. [Module 2](../m2-context/) picks up there.

### TLDR

1. **Prompts are specs, not incantations.** The gap between a vague prompt and a specified one dwarfs the gap between two well-specified prompts phrased differently. Work on the spec first, the phrasing last.
2. **Four components make a spec: task, constraints, context, examples.** Most disappointing outputs are missing one of these. Check which before blaming the model.
3. **Predict before you run.** Writing a one-sentence prediction surfaces what you didn't specify. The prediction itself doesn't matter. The gap-finding does.
4. **Change one thing per iteration.** Multi-variable changes don't teach you anything. If you changed three things and the output improved, you don't know why.
5. **Know your noise floor.** The same prompt run three times produces different outputs. If your "improvement" is smaller than the run-to-run spread, you moved nothing.
6. **Over-specifying is a real failure mode.** If the prompt is longer than the output, you're writing the output yourself. The test: remove a constraint, rerun, see if it matters.
7. **Stop when iterations stop paying.** The first three usually matter a lot. After five or six, you're polishing. Ship and move on.

### Lab handoff

The lab for this module is a 90-minute self-paced exercise in the diagnostic move. Take 5 bad prompts, rewrite each three ways, predict which will work best, then run. Instructions in [the lab](./lab/).

---

## Lab design

### Lab: Rewrite 5 bad prompts, three ways each

**Goal.** Build the habit of diagnosing and fixing prompts along three specific axes before running them. This is self-paced. There's no submission, no review. You're doing it for yourself.

**Setup.** You'll find 5 deliberately bad prompts at [the bad-prompts page](./lab/bad-prompts). Each one is a real shape of prompt that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

**Exercise.** For each prompt, produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format. The four components from the concept post. Don't add examples or restructure the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. This is the "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies (i.e. "summarize then rank" rather than "give me the top 3").

Before running any of the rewrites, **predict**. For each of the 5 prompts, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

Only then run them. All three rewrites, each one twice (for the noise floor).

**What you'll have at the end.** For each of the 5 prompts: three rewrites, your prediction, actual outputs (two runs each), and a sense of whether your prediction held. Keep the notes somewhere you can go back to. You'll want to compare against yourself in [Module 2](../m2-context/) when the same prompts get longer conversations around them.

**Time budget.** ~90 minutes. If it's taking three hours, you're polishing the rewrites rather than practicing the diagnostic move. Stop and move on.

**Common traps:**

- Making the "specification rewrite" so long it's actually three rewrites in one. Keep it to the one axis.
- Running each rewrite once. The noise-floor discussion in the post is why you run each twice.
- Skipping the prediction step because it feels silly. The prediction is most of the value.

**Extension, optional.** Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. That's the over-specification test from the concept post, applied.

---

## References

- **Anthropic prompting docs.** Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame. Less useful for building the frame itself. `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`
- **Simon Willison's weblog.** Ongoing practitioner notes on prompting, with honest reporting of what works and what doesn't. Good counterweight to hype. `https://simonwillison.net/`
- **"Prompt report" (Schulhoff et al., 2024).** A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy. The useful finding for this module is that most "clever" techniques produce small gains compared to basic specification. `https://arxiv.org/abs/2406.06608`
- **Shreya Shankar et al. on prompt evaluation.** Applied work on evaluating prompt quality systematically. Matters more for production systems. Worth reading if Module 6 (oracles) catches your attention. `https://arxiv.org/abs/2404.12272`
- **cwv-agent PR #68**. The concrete PR referenced in the over-specifying section. If you want to see what phase-scoped context looks like in practice rather than in the abstract, this is the diff. `https://github.com/ramboz/cwv-agent/pull/68`

---

## Remaining blanks to fill before publication

1. **Opening, paragraph 1.** "last [month/quarter]" — pick the actual timeframe.
2. **Opening, paragraph 3.** "vibe-coding for [months / however long]" — pick the actual duration.
3. **Opening, paragraph 1.** Decide whether to name the colleague. If yes and they're okay with it, replace "A colleague" with the name.
4. **Over-specifying section, final paragraph.** "I'll link the PR when it's up" — either land the PR and link it before publishing, or replace with a shipped-date commitment when the PR is merged.
