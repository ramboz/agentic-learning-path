# Conversation with Claude

## Human (Apr 23, 2026, 9:08 AM):

Draft Module 1 scaffolding

---

## Human:

Here's the Module 1 scaffolding. Drafted for public GitHub Pages — no internal refs, no anchor project (M1-3 use throwaway examples per the outline). I kept to ~2800 words on the concept post and ~650 on the lab.

---

# Module 1 — Prompting as a design problem, not a phrasing trick

**Tier:** 1 (everyone)
**Audience:** Mixed — PMs, architects, engineers
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** None. Frame-setter for the whole curriculum.
**Standalone publishable:** Yes
**Ends with bridge to:** Module 2 (Context is the product)

---

## Outline

1. **Opening** (200-300w) — [HARD PART 1]
2. **The frame shift: prompt engineering vs specification** (~450w) — draft
3. **What a spec-style prompt contains** (~550w) — draft, needs voice pass
4. **Common failure modes and the move that fixes each** (~400w) — draft with table
5. **Predict before you run** (~400w) — draft with [HARD PART 2] inline
6. **Iteration: prompts aren't one-shot** (~350w) — draft
7. **When you're over-specifying** (~300w) — draft with [HARD PART 4]
8. **Bridge to Module 2** (~200w) — draft
9. **Lab handoff** (~50w) — draft

---

## Concept post draft

### Opening

[HARD PART 1 — Julien writes]

### The frame shift

"Prompt engineering" became shorthand for magic phrases — tell the model it's an expert, ask it to take a deep breath, offer it a $200 tip. A lot of this folklore works, or used to. The problem is that recent models are trained on instruction data that already contains these patterns. Adding "you are an expert" to a modern model buys you maybe a single-digit percentage improvement on some tasks and zero on others.

The reframe that holds up better: prompts are specs. The skill isn't incantation; it's articulating what you want precisely enough that a competent stranger could produce it without needing to ask follow-up questions. If you've ever written a ticket that came back as the wrong thing, you already know this skill. The medium is different; the underlying problem is the same.

Phrasing still matters at the margin. "Make it shorter" and "reduce this to 150 words" produce different outputs, and the second one is better because it's specific. But the gap between a vague prompt and a specified one is roughly 10x larger than the gap between two well-specified prompts with different phrasing. The productive work is upstream of word choice.

One more concession: "prompt engineering" isn't a useless term. It's a fine category label. It becomes misleading when people read it as collecting tricks, because then they spend time bookmarking clever phrasings instead of building the habit that actually moves quality — writing clear specs.

### What a spec-style prompt contains

In a nutshell, a spec-style prompt has four components:

1. **Task.** What does done look like? "Write a blog post about AI" is a topic, not a task. "Write a 600-word blog post explaining, for a non-technical PM, why long conversations with Claude degrade over time" is a task.
2. **Constraints.** What must be true of the output? Length, format, tone, things to avoid. Constraints are what let you distinguish between "this is fine" and "this isn't" without a subjective judgment call.
3. **Context.** What does the model need to know that it can't assume? The audience, the project, the repo, the fact that the reader already knows what a token is. Context is the category where underspecification hides — you know it, so you forget to say it.
4. **Examples.** When the shape of what you want is easier shown than described. Two examples beat a paragraph of description for format-heavy outputs (tables, code style, consistent heading patterns).

Each has a one-line test you can run on a prompt before sending it:

- **Task test:** If I removed the model and gave this prompt to a competent stranger, would they know what to produce? If not, the task is underspecified.
- **Constraints test:** If I got back two different outputs, could I say which was better without a subjective call? If not, add constraints until I could.
- **Context test:** Does the prompt assume anything the model couldn't reasonably know? Either add it or acknowledge the gap.
- **Examples test:** Am I describing a format in words when a 3-line sample would be unambiguous? If yes, switch to the sample.

Not every prompt needs all four. "What's the capital of France" is a one-liner, and dressing it up is pure ceremony. The components matter when the task has enough degrees of freedom that the model could do several reasonable things and you only want one of them.

### Common failure modes and the move that fixes each

When an output disappoints, it usually fails along one of a small number of axes. The table is the diagnostic cheat sheet; the meta-move underneath it is the actual skill.

| Symptom | Diagnosis | Fix |
|---|---|---|
| Too long or too short | No length specified | Add a target (~300 words, 3 bullets, under a tweet) |
| Wrong format | Format described in words, not shown | Include a 2-3 line example of the desired output |
| Generic / bland | No audience, no constraints | Specify reader, purpose, and at least one thing to avoid |
| Misses the point | Task stated as a topic, not as "what done looks like" | Restate the task as a question whose answer is the output |
| Hallucinates | Asked to produce without recourse to uncertainty | Tell the model to flag uncertainty, cite, or say it doesn't know |
| Inconsistent across runs | Prompt leaves too many degrees of freedom | Tighten constraints until two valid outputs would look similar |

The meta-move is the skill: before blaming the model, check which of the four components you left out. Most disappointing outputs are diagnosable in 30 seconds this way. The ones that aren't usually come down to the task being ambiguous to you too — in which case you'd hand the same ambiguity to a human and get the same problem back.

### Predict before you run

The single habit that moves quality most in this module is also the one people skip: before you hit send, write one sentence about what you expect back. Length, shape, whether it'll get the point. Then run.

The value isn't the prediction itself; it's that writing the prediction surfaces the things you didn't specify. You sit down to predict and realize you don't actually know what length you want, or what tone, or whether you want bullets or prose. That gap is the prompt's gap.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once — how good the output is, and how clear your own thinking was.

[HARD PART 2 — Julien writes: a specific moment where predicting-before-running caught a problem you'd otherwise have blamed on the model. Ideally a prompt you thought was fine, where the prediction exercise exposed the actual ambiguity.]

A rough quantitative rule: if your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse is also true — if you can't predict the output at all, you haven't specified enough for the output to be judged.

### Iteration: prompts aren't one-shot

The loop is:

1. Run the prompt
2. Diagnose what's off using the failure-mode table
3. Change one thing
4. Rerun

One thing at a time is the discipline that looks optional but isn't. If you add an example *and* tighten the length spec *and* add a role and the output improves, you don't know which change helped. Next time you face a similar problem, you're back to guessing. Single-variable changes compound; multi-variable changes don't.

Two specific rules inside the loop:

**Know your noise floor.** The same prompt, run three times, will not produce identical outputs. Sometimes the variance is small (a few word choices); sometimes it's a structurally different answer. Before you celebrate that your rewrite "worked," run it twice more. If the spread on the old prompt is wider than the gap between old and new, you moved nothing.

**Stop when diminishing returns kick in.** The first three iterations of a serious prompt usually produce big improvements. Iterations four through ten produce smaller ones. After that, you're polishing. If an iteration moves the needle by less than the between-run noise, you're done. Ship the current version and move on.

### When you're over-specifying

The mirror image of underspecification is worth naming, because it's where people who've internalized the frame tend to end up. If the prompt is longer than the output, you're probably writing the output yourself with extra steps. The model isn't adding much.

Symptoms:

- Every detail pinned down, and outputs feel robotic or formulaic
- So many examples that the model is pattern-matching on your template
- Adding another constraint would contradict an existing one
- You're specifying things the model would reliably get right anyway (basic grammar, punctuation, standard vocabulary)

The test: remove one constraint and rerun. If the output is the same or better, the constraint was dead weight. If it's worse, keep it. Do this until removing any one constraint makes things worse — that's the minimal spec for this task.

[HARD PART 4 — Julien writes: a short anecdote of over-specifying where the output got worse. Voice samples show you're strongest grounding tradeoffs in a concrete case.]

### Bridge to Module 2

Specification gets you a good single-turn result. Most of this module assumes one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem — the spec is fine — it's a context problem. Module 2 picks up there.

### Lab handoff

The lab for this module is a 90-minute exercise in the diagnostic move: take 5 bad prompts, rewrite each along three specific axes, predict which will work best before running. Instructions in `/labs/m1-specification/`.

---

## Lab design

### Lab: Rewrite 5 bad prompts, three ways each

**Goal:** Build the habit of diagnosing and fixing prompts along three specific axes before running them.

**Setup:** You'll find 5 deliberately bad prompts in the lab repo at `/labs/m1-specification/bad-prompts.md`. Each one is a real shape of prompt that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

**Exercise.** For each prompt, produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format — the four components from the concept post. Don't add examples or restructure the task; just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. This is the "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies ("summarize then rank" rather than "give me the top 3").

Before running any of the rewrites, **predict**. For each of the 5 prompts, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

Only then run them. All three rewrites, each one twice (for the noise floor).

**What to submit.** A markdown file with, for each of the 5 prompts:

- The three rewrites
- Your prediction
- The actual outputs (two runs each)
- A one-line reflection: did your prediction hold? What surprised you?

**Time budget:** ~90 minutes. If it's taking three hours, you're polishing the rewrites rather than practicing the diagnostic move. Stop.

**Common traps:**

- Making the "specification rewrite" so long it's actually three rewrites in one. Keep it to the one axis.
- Running each rewrite once. The noise-floor discussion in the post is why you run each twice.
- Skipping the prediction step because it feels silly. The prediction is most of the value.

**Extension, optional.** Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. This is the over-specification test from the concept post, applied.

---

## References

- **Anthropic prompting docs** — Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame; less useful for building the frame itself. `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`
- **Simon Willison's weblog** — Ongoing practitioner notes on prompting, with honest reporting of what works and what doesn't. Good counterweight against hype.
- **"Prompt report" (Schulhoff et al., 2024)** — A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy; the useful finding for this module is that most "clever" techniques produce small gains compared to basic specification.
- **Shreya Shankar et al. on prompt eval** — Applied work on evaluating prompt quality systematically. Matters more for production systems; worth reading if Module 6 (oracles) catches your attention.

---

## Hard parts checklist

**1. Opening hook (~200-300 words).** A specific moment where you went from treating prompting as tricks to treating it as specification. The first module sets the tone for the whole curriculum; readers decide in the first 200 words whether this feels like yet-another-prompting-guide. The voice samples show you consistently ground abstract claims in specific numbers or cases (the ~600ms DNS+TLS figure, a named customer situation, a specific JIRA link). A synthesized opening from me would land generic. What I need from you: one specific prompt or task where the shift clicked, with enough detail that the reader can picture it.

**2. Failure anecdote in "Predict before you run" (~150-250 words).** A case where predicting-before-running caught a problem you'd have blamed on the model. This section otherwise stays abstract, and the Slack samples show you're strongest when a principle is attached to a specific thing that broke. If you don't have one that fits, say so and I'll draft a plausible generic — but a real one will land harder. Good test: does the story end with "so the problem wasn't the model, it was that I hadn't specified X"?

**3. Voice pass over "What a spec-style prompt contains" (~550 words).** The four-component structure is the most didactic section in the module, which is where generic LLM cadences creep in — phrasings like "these four elements work together to..." or "by following this framework...". Two specific things to check: (a) the one-line tests for each component are mine, and I suspect at least two of them are more abstract than you'd phrase them; (b) the numbered list for the four components may want a "in a nutshell:" lead-in — I used one once in the section but you may want a different signature opener. Also worth checking: does any of it sound like a textbook? That's my tell that I over-drafted.

**4. Over-specifying anecdote (~100-150 words).** Concrete case of over-engineering a prompt until the output got worse. This pairs with the underspecification opening and closes the frame — the voice samples are explicit about you being opinionated about tradeoffs ("we estimate 20~40pts hit"), so an anecdote here about a specific tradeoff you personally got wrong is high-authenticity-per-word. If you've got a "I added a fifth example and things fell apart" moment, it'd fit here.

---

One pushback, unprompted: M1 currently has no link back to anything you've personally shipped. The voice calibration works partly because your samples cite specific customers, specific repos, specific numbers. For a public GitHub Pages audience, you can't cite the customers. But you *could* cite open source work or a public post — if there's something in the `adobe-rnd/aem-martech` neighborhood or a public talk you've given on prompting or specification, even a tangential one, a single anchor in the opening or the over-specifying section would do a lot to make this feel like your curriculum rather than a generic guide. Worth thinking about before the voice pass.

---

## Human (Apr 23, 2026, 9:29 AM):

Some feedback on this:

* you consistently rely on "—" which most humans wouldn't… except maybe in literature, and even then, you use them way too much. I personally almost never rely on them, and I'm betting my "voice" samples didn't include many, so I see a misalignment here
* overall I feel the prose too heavy. Reading what you wrote required me to re-read sentences several times to fully understand the idea you conveyed. Again, it feels more like literature than a conversational tone. And with many of my audience having English as a foreign language, it's likely going to discourage them from finishing just the reading part
* I feel we maybe lacked an introductory section that conveys what the module will cover. I was reading this and didn't know what to expect until I was done. I feel I get the scope at the end, but I'm not sure it was clear enough when I started… so I feel expectations are not clear. maybe something I'd need to cover in my opening. not sure
* Also, what would you think about a "TLDR" at the end or something like that to quickly recap at a glance the main elements covered?

---

## Human:

All fair. Let me respond to each before re-drafting.

**Em dashes.** You're right, and I should have caught this. I checked the wiki sample — in ~6000 words of your prose there, you use em dashes maybe 3-4 times, all for genuine parentheticals. I used them 20+ times in the draft, often as a stylistic tic rather than for structure. My fault. The fix is mostly mechanical: commas, periods, or parentheses do the job. I'll cut them hard in the rewrite.

**Prose weight.** Also fair. Re-reading my draft, I'm doing things like "The reframe that holds up better:" and "The mirror image of underspecification is worth naming, because..." — those are writerly moves that sound clever and make the reader work. Your samples are denser with information but lighter to read because the sentences carry one idea each and move on. I was reaching for elegance; you want clarity. For an audience where many readers have English as a second language, my draft is actively hostile. I'll rewrite for shorter sentences, plainer verbs, fewer rhetorical flourishes.

**Missing intro section.** Good call, and this is a structural gap, not a prose one. The outline jumps straight from the opening hook into "The frame shift," which assumes the reader already knows the module's shape. The wiki samples start with "Context" or "Use Case" or "Problem Statement" sections that set up what's coming. A "What this module covers" section after your opening hook would give readers a map before the content. I'd suggest ~150-200 words, doc-register, probably a short bulleted list of what they'll learn and what they'll do in the lab.

**TLDR at the end.** Yes, and I'd argue for it specifically at the end rather than the start. A start-of-module TLDR competes with your opening hook for attention. An end-of-module recap lets readers check they got the main points and gives them something to scan when they come back to the module later. The wiki samples often have a "Summary observations" block or a wishlist table that plays this role. I'd suggest a numbered list of 5-7 takeaways, each one sentence, written so that if someone only read the TLDR they'd still have the core frame.

One related question before I redraft: do you want the TLDR to match the module's section order, or be organized by importance (most load-bearing takeaway first, regardless of where it appeared)? The wiki samples lean toward structural ordering. My instinct is importance-first for a teaching context, but it's your call.

Should I redraft the whole module with all four changes, or just share the new intro section and TLDR plus a rewritten sample section so you can sanity-check the prose-weight fix before I redo everything?

---

## Human (Apr 23, 2026, 10:01 AM):

I'd organize by importance, and I think I'd prefer the whole module rewritten so I can get a good feel of the whole flow

---

## Human:

Here's the full rewrite. Em dashes gone (I found 2 I kept as genuine asides in your voice, using parentheses elsewhere). Lighter sentences, plainer verbs. New "What this module covers" section up front. TLDR at the end, ordered by importance.

---

# Module 1 — Prompting as a design problem, not a phrasing trick

**Tier:** 1 (everyone)
**Audience:** Mixed (PMs, architects, engineers)
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** None. Frame-setter for the whole curriculum.
**Standalone publishable:** Yes
**Ends with bridge to:** Module 2 (Context is the product)

---

## Outline

1. **Opening** (~250w) — [HARD PART 1]
2. **What this module covers** (~150w) — draft
3. **The frame shift: prompt engineering vs specification** (~300w) — draft
4. **What a spec-style prompt contains** (~450w) — draft, needs voice pass
5. **Common failure modes and the move that fixes each** (~250w) — draft with table
6. **Predict before you run** (~350w) — draft with [HARD PART 2] inline
7. **Iteration: prompts aren't one-shot** (~300w) — draft
8. **When you're over-specifying** (~250w) — draft with [HARD PART 3] inline
9. **Bridge to Module 2** (~100w) — draft
10. **TLDR** (~250w) — draft
11. **Lab handoff** (~50w) — draft

---

## Concept post draft

### Opening

[HARD PART 1 — Julien writes]

### What this module covers

In a nutshell:

1. Why treating prompts as phrasing tricks caps your quality ceiling
2. The four components of a prompt-as-spec (task, constraints, context, examples)
3. A failure-mode table that maps common bad outputs to a single-move fix
4. The predict-before-run habit, and what it tells you
5. How to iterate without fooling yourself with run-to-run noise
6. How to recognize over-specifying and pull back

The lab at the end is a 90-minute exercise. You take 5 bad prompts, rewrite each three ways, predict which version wins, then run and compare.

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

The single habit that moves quality most in this module is also the one people skip. Before you hit send, write one sentence about what you expect back. Length, shape, whether the model will get the point. Then run.

The value is not the prediction itself. The value is that writing the prediction surfaces the things you didn't specify. You sit down to predict, and you realize you don't know what length you want. Or what tone. Or whether you want bullets or prose. That gap is what your prompt is missing.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once: how good the output is, and how clear your own thinking was.

[HARD PART 2 — Julien writes: a specific moment where predicting-before-running caught a problem you'd otherwise have blamed on the model. Ideally a prompt you thought was fine, where the prediction exercise exposed the real ambiguity.]

A rough quantitative rule. If your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse also holds. If you can't predict the output at all, you haven't specified enough for the output to be judged.

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

[HARD PART 3 — Julien writes: a short anecdote of over-specifying where the output got worse. Voice samples show you're strongest grounding tradeoffs in a concrete case.]

### Bridge to Module 2

Specification gets you a good single-turn result. This module assumed one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem. The spec is fine. It's a context problem. Module 2 picks up there.

### TLDR

1. **Prompts are specs, not incantations.** The gap between a vague prompt and a specified one dwarfs the gap between two well-specified prompts phrased differently. Work on the spec first, the phrasing last.
2. **Four components make a spec: task, constraints, context, examples.** Most disappointing outputs are missing one of these. Check which before blaming the model.
3. **Predict before you run.** Writing a one-sentence prediction surfaces what you didn't specify. The prediction itself doesn't matter. The gap-finding does.
4. **Change one thing per iteration.** Multi-variable changes don't teach you anything. If you changed three things and the output improved, you don't know why.
5. **Know your noise floor.** The same prompt run three times produces different outputs. If your "improvement" is smaller than the run-to-run spread, you moved nothing.
6. **Over-specifying is a real failure mode.** If the prompt is longer than the output, you're writing the output yourself. The test: remove a constraint, rerun, see if it matters.
7. **Stop when iterations stop paying.** The first three usually matter a lot. After five or six, you're polishing. Ship and move on.

### Lab handoff

The lab for this module is a 90-minute exercise in the diagnostic move. Take 5 bad prompts, rewrite each three ways, predict which will work best, then run. Instructions in `/labs/m1-specification/`.

---

## Lab design

### Lab: Rewrite 5 bad prompts, three ways each

**Goal.** Build the habit of diagnosing and fixing prompts along three specific axes before running them.

**Setup.** You'll find 5 deliberately bad prompts in the lab repo at `/labs/m1-specification/bad-prompts.md`. Each one is a real shape of prompt that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

**Exercise.** For each prompt, produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format. The four components from the concept post. Don't add examples or restructure the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. This is the "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies (i.e. "summarize then rank" rather than "give me the top 3").

Before running any of the rewrites, **predict**. For each of the 5 prompts, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

Only then run them. All three rewrites, each one twice (for the noise floor).

**What to submit.** A markdown file with, for each of the 5 prompts:

- The three rewrites
- Your prediction
- The actual outputs (two runs each)
- A one-line reflection: did your prediction hold? What surprised you?

**Time budget.** ~90 minutes. If it's taking three hours, you're polishing the rewrites rather than practicing the diagnostic move. Stop.

**Common traps:**

- Making the "specification rewrite" so long it's actually three rewrites in one. Keep it to the one axis.
- Running each rewrite once. The noise-floor discussion in the post is why you run each twice.
- Skipping the prediction step because it feels silly. The prediction is most of the value.

**Extension, optional.** Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. That's the over-specification test from the concept post, applied.

---

## References

- **Anthropic prompting docs.** Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame. Less useful for building the frame itself. `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`
- **Simon Willison's weblog.** Ongoing practitioner notes on prompting, with honest reporting of what works and what doesn't. Good counterweight to hype.
- **"Prompt report" (Schulhoff et al., 2024).** A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy. The useful finding for this module is that most "clever" techniques produce small gains compared to basic specification.
- **Shreya Shankar et al. on prompt evaluation.** Applied work on evaluating prompt quality systematically. Matters more for production systems. Worth reading if Module 6 (oracles) catches your attention.

---

## Hard parts checklist

**1. Opening hook (~250 words).** A specific moment where you went from treating prompting as tricks to treating it as specification. First impressions decide whether this reads as yet-another-prompting-guide. Your voice samples consistently ground abstract claims in specific numbers or cases (the ~600ms DNS+TLS figure, a named project situation, a specific repo). A synthesized opening from me would land generic. What I need from you: one specific prompt or task where the shift clicked, with enough detail that the reader can picture it.

Since "What this module covers" now handles scope-setting separately, the opening doesn't need to preview the module. It can stay focused on the personal moment. If anything, the cleaner split lets the opening breathe.

**2. Failure anecdote in "Predict before you run" (~150-250 words).** A case where predicting-before-running caught a problem you'd have blamed on the model. This section otherwise stays abstract, and the Slack samples show you're strongest when a principle is attached to a specific thing that broke. If you don't have one that fits, say so and I'll draft a plausible generic. But a real one will land harder. Good test: does the story end with "so the problem wasn't the model, it was that I hadn't specified X"?

**3. Over-specifying anecdote (~100-150 words).** Concrete case of over-engineering a prompt until the output got worse. This pairs with the underspecification frame and closes the loop. Your voice samples are explicit about you being opinionated on tradeoffs ("we estimate 20~40pts hit"), so an anecdote here about a specific tradeoff you got wrong is high-authenticity-per-word. If you've got an "I added a fifth example and things fell apart" moment, it fits here.

**4. Voice pass on the four-component section (~450 words).** That section is the most didactic in the module, which is where generic cadences creep in. Specifically check: (a) the one-line tests for each component are mine, and I suspect at least two are more abstract than you'd phrase them; (b) the transitions between components are smooth but possibly too smooth, reading more like a textbook than like you explaining it. If a sentence feels like it could come from any prompting guide on the internet, it probably should change.

---

One carry-over from last round: this module still has no link to anything you've personally shipped. For a public GitHub Pages audience, a single anchor (open-source work, a public talk, a blog post) in the opening or the over-specifying anecdote would do a lot to make this feel like your curriculum rather than a generic guide. Worth thinking about as you draft the hard parts.

---

## Human (Apr 23, 2026, 10:25 AM):

I definitely like the tone better now. Definitely easier to read.
Also, assume the lab is self-paced and not actually submitted. it's more for folks to do the work and try it out. I won't have bandwidth to actually review any of this for them.

For the "no link to anything you've personally shipped", I think reading this makes me wonder about the prompts I'm using in https://github.com/ramboz/cwv-agent/ (/Users/ramboz/Projects/spacecat/cwv-agent/src/prompts). I'm definitely not following those spec structures as I should, I think

---

## Human:

Two things to address: the lab framing, and the cwv-agent angle.

**Lab reframe.** Easy fix. I'll strip the submission framing and rewrite it as a self-paced exercise. The "what to submit" section goes. The traps section stays because it's useful regardless. The time budget stays for the same reason. I'll shift the framing from "complete this exercise" to "work through this to build the habit."

**cwv-agent as the personal anchor.** This is interesting, and I want to push on it before you commit. Let me think out loud.

The good version: you open the module (or the over-specifying section) with "I'm writing this module partly because I went to look at the prompts in my own CWV agent and realized I'm doing exactly what this module warns against." That's high-authenticity. It's also genuinely useful for readers because it says "even the person teaching this does it wrong in his own repo." And the link is public, so readers can go look.

The risk: if you use it as the opening anecdote, it sets up an implicit promise that the module will fix those prompts, or at least diagnose what's wrong with them specifically. That's a different module. Your opening then has to do two jobs (hook and set up the frame) and one of them gets short-changed.

My suggestion: use it in the over-specifying section, not the opening. That section is currently marked as needing a concrete tradeoff anecdote, and the cwv-agent prompts are probably a mix of under-specifying and over-specifying, which is realistic and more interesting than a clean "I over-specified once" story. The opening stays free for a different moment. The over-specifying section gets a real link to real code, which is exactly the grounding the module currently lacks.

**One thing to check before you draft.** Can you look at the prompts in `/src/prompts` and tell me, in one sentence each, what's off about two or three of them? I want to know if the pattern you're seeing is mostly missing constraints (task/context underspecified), mostly over-specified (too many examples, too many rules), or mixed. That'll tell me whether the cwv-agent anchor fits cleanly in over-specifying or wants its own small callout box.

If it's mostly underspecified, it fits better as a running example across the four-component section ("here's what's missing in a real prompt from my own repo"). If it's mostly over-specified, it fits in the over-specifying section. If it's mixed, I'd make it a separate short section called something like "A worked example from my own repo" placed after the failure-mode table, where you walk through 2-3 concrete prompts and diagnose them out loud. That third option is the strongest structurally but costs you the most to write, because it needs you to actually diagnose the prompts in the module rather than just referencing them.

What do you see when you look at them?

---

## Human (Apr 23, 2026, 10:26 AM):

Check for yourself

---

## Human:

Read through all eight files. The pattern is mixed, which is actually more useful for the module than a clean "I over-specified once" would have been.

**What's well done, honestly.** The `getCriticalFilteringCriteria()` block is a clean example of constraint discipline. "LCP > 2.5s by at least 300ms (i.e., LCP > 2.8s)", "improvements of at least 300ms", "recommendations must address bottlenecks >500ms" — that's exactly the "tighten constraints until two valid outputs would look similar" move from the module. You're doing the work there. If anything, it's the module's best concrete example of the constraints component.

The split between `initializeSystem` (single-shot, all 8 phases upfront) and `initializeSystemAgents` (just context + filtering, phases injected per-agent) is also a real piece of prompt design, not an accident.

**What's off, and it clusters into three things.**

1. **Task is under-specified at the step level.** Each step prompt (`cruxStep`, `psiStep`, `harStep`) is almost purely data delivery: "here is the HAR JSON object for the page: [JSON]." The actual task for that phase lives two files away in `PHASE_FOCUS.HAR`, and the binding between them is a silent counter (`stepVerbose()`) that increments whether or not the prompts were called in the right order. The model has to infer "oh, this is phase 4 so I should be doing HAR analysis" from the counter saying "Continuing with phase 4." If someone resets the counter wrong, or the orchestrator sends phases out of order, the prompts would still look fine but the labels would be wrong. That's exactly the "task stated as a topic, not as what done looks like" failure mode from the table.

2. **Context is over-shipped.** The EDS context is ~60 bullets across characteristics, optimizations, and anti-patterns. Same for AEMCS and AMS. Every agent in every phase gets the full context. For the CrUX agent analyzing field data trends, most of the code-level EDS idioms ("scripts.js has a decorateMain method...") are noise. For the code-review agent, they're essential. You're paying context-window and attention cost on every call to ship information that's only relevant to 2 of the 8 phases. This is the "specifying things the model would get right anyway" antipattern, but in context form rather than constraint form.

3. **Zero examples, especially in the deliverable spec.** `getDeliverableFormat()` describes both a markdown report structure and a JSON schema entirely in prose. The JSON has nine nested fields with specific enum values ("good|needs-improvement|poor", "High|Medium|Low", "Easy|Medium|Hard"), and you're asking the model to produce it right from a prose description. One complete worked example — a paragraph of report plus a filled-in JSON — would probably eliminate most of the schema drift you've likely seen in outputs. This is the "describing a format in words when a 3-line sample would be unambiguous" move, at scale.

**Recommendation for the module.** The mix is the interesting part, so I'd thread this through rather than make it a single anecdote.

- **In "What a spec-style prompt contains,"** use the step prompts as the example of task under-specification: "here's a step prompt from a real agent I shipped; the task is implicit and lives two files away." It makes the task component concrete.
- **In "When you're over-specifying,"** use the context bundling as the example: "all 60 bullets on every call, regardless of phase relevance." That's the constraint-equivalent for context, and it grounds the section in actual shipped code.
- **Opening hook** (your call): "I went to write this module and realized I'm doing exactly what it warns about in my own repo" is a strong opener because it sets up genuine accountability. The risk I flagged last round (the opening promising a module-long fix) is lower if you frame it as "I found a mix" rather than "I found a disaster." The mix is true.

One thing you should know. Writing this way commits you to linking the repo publicly, which you already do. But it also commits you to *either fixing those prompts eventually, or being fine with the repo staying as a "here's what real code with these issues looks like" example indefinitely.* Voice samples suggest you'd be fine with the latter, but worth flagging before you wire it into the opening.

And I'll fold the lab reframe (strip the submission scaffolding, keep it self-paced) into the next full rewrite. Do you want me to do that rewrite now with the cwv-agent threading woven in, or wait until you've drafted the hard parts?

---

## Human (Apr 23, 2026, 10:38 AM):

I'd actually want to improve the cwv-agent based on the learnings I'm seeing here.
I'd be even fine to attach a PR of the changes in the modules based on the learnings in each module. I'm ultimately doing this work to learn how to better prompt myself and improve on the overall quality of my cwv-agent.
The story is kinda, I build the cwv-agent as a POC, I tested it at scale at our Summit event with customers (not the cwv-agent directly, but the internal productized version we have). Obviously we don't have the ideal outcome we wanted, so I'm going back to my POC to see how to improve this. I'm pretty sure the overall flow is sane, but the gap we see is most likely due to me not having optimized prompts. And I also want to scale my vibe coding workflow so I can get better results overall for all the fixes I'm doing, and move from handholding a session throughout the day, to me triggering something in the morning and having the results by EOD or the next morning and the agents autonomously fixing/implementing what I need without my constant reviews, path corrections, etc.

---

## Human:

This reframes the curriculum in a way I want to push back on and build on, in that order.

**Pushback first.** What you just described is not the curriculum in the outline. It's a better one, for you specifically, but it's a different shape.

The curriculum in the outline is a teaching artifact. Mixed audience, public GitHub Pages, PMs and architects get off at Module 3, engineers continue to orchestration. Modules are shipped with labs for readers to do. The anchor project (PR Assistant) exists because it's a cleaner teaching vehicle than CWV Workbench, which was explicitly dropped as too niche for mixed audience (per the decisions log).

What you just described is: "I'm learning prompting and orchestration in order to fix cwv-agent, and I want to document what I learn so others benefit." That's a working journal with teaching value, not a curriculum with a learner journey. The audience becomes narrower (engineers working on similar agents), the anchor becomes cwv-agent itself, and the labs become "here's the PR I shipped to my own repo after this module's learnings, and here's what you'd do on yours."

Both are valid. They're not the same. Some specific things that change if you commit to the working-journal shape:

- **The anchor project decision flips.** CWV Workbench (basically cwv-agent) was dropped precisely because it was too niche. If your actual goal is improving cwv-agent, you should reopen that decision, not layer cwv-agent PRs on top of a PR Assistant anchor. Two anchors means neither gets the cumulative reinforcement the curriculum was designed to provide.
- **Tier 1 (M1-3) gets awkward.** Those modules are written for everyone, including PMs. A PM reading "here's the PR I shipped to cwv-agent after M1" gets nothing from the PR because they don't work in that code. The teaching still works for them, but the anchor doesn't. Which is fine, but worth naming.
- **The orchestration ceiling changes meaning.** M7-10 in the outline are about learning Ralph loops, parallel workers, crews. If the real goal is "move from handholding to overnight runs on cwv-agent," then M7-10 become the actual target and M1-6 become setup. That's different pacing. M1-6 get compressed or repositioned as "here's what I relearned before getting to the part I actually needed."
- **The meta-crew story gets noisier.** The curriculum already has a meta-project (curriculum authoring tool becomes dog-food artifact from M5 onward). Adding cwv-agent as a second running system means two meta-narratives competing for attention in each module. Readers track one; authors track both.

**Now the build-on.** None of the above means drop the cwv-agent angle. It means pick a shape and commit.

Three options, in order of how much they change the plan.

1. **cwv-agent as recurring worked example, PR Assistant as anchor.** Each module has a "From my own repo" callout box where you diagnose or fix something in cwv-agent using the module's frame. It's not the anchor; it's the running concrete case. This is the least-change option and it's close to what I already suggested for M1. Works if the PR Assistant lab is still the thing readers do. Weakness: you'd likely drift toward cwv-agent taking over because it's the system you actually care about.

2. **Dual anchor, labeled honestly.** PR Assistant is the lab anchor (clone-and-work, readers execute it). cwv-agent is the author's anchor (Julien's working journal, readers read it). Each module has both. You'd write an intro somewhere explaining why. The risk is that cwv-agent sections become more substantive than the PR Assistant sections because they're real, and readers notice the imbalance.

3. **Reopen the anchor decision.** cwv-agent becomes the sole anchor, PR Assistant gets dropped. This changes the audience of the curriculum (engineers working on performance or similar agents, not "mixed Adobe staff"), which changes several upstream decisions in the log. It's the most honest match to what you just told me. It's also the biggest rewrite.

**My guess at what you actually want.** Option 2, but with the understanding that option 3 is where it's heading by M5 or M6. Tier 1 stays teaching-first because the audience is genuinely mixed for the frame-setting modules. Tier 2 onward, when the orchestration content starts, cwv-agent naturally becomes the primary anchor because it's the thing you're actually trying to get to overnight autonomy on. The curriculum could just name this transition instead of pretending the anchor stays constant.

**Before I redraft anything,** two questions that need answers.

1. Is the curriculum a teaching artifact for mixed audience, or a working journal shipped publicly? If working journal, several decisions in the log need reopening, and I'd rather do that once than drift. The decisions log specifically says CWV Workbench was dropped as anchor — that's a locked decision you'd be revisiting.
2. The "trigger something in the morning, results by EOD" goal is specifically M7-10 territory (headless mode, Ralph loop, overnight runs, crews). If that's the real target, should M1-6 be shorter than currently scoped? They're currently the bulk of the curriculum by word count.

I don't think this needs answers in this session. But I'd answer them before the next module draft, because the shape changes depending on what you pick.

---

## Human (Apr 23, 2026, 10:40 AM):

I want to stick to the curriculum. I need to spread those best practices across the organization and document this publicly. I gave you those details to share some of the motivation behind it and also how I'm planning on applying what I learn from those modules, but that's not the main driver. The curriculum, mentoring, is the main goal. The improvements to the cwv-agent are a nice side-effect for myself

---

## Human:

Got it. Curriculum stays as-is, cwv-agent is the running worked example, not the anchor. That's option 1 from my list. PR Assistant remains the lab anchor from M4 onward.

Two small implications worth confirming before the next rewrite:

- **Per-module PRs to cwv-agent are fine, but optional and separate from the curriculum deliverable.** A reader doesn't need to read the PRs to complete the module. The PRs are evidence that you walked the path yourself, linked from a "From my own repo" section. If a module's learnings don't produce a meaningful PR, that module doesn't get one. No forced symmetry.
- **The PR link belongs in the module, the PR review doesn't.** You can reference "here's what I changed and why" in a paragraph. You don't need to walk through the diff. That keeps the module focused on the frame, not on cwv-agent internals.

For M1 specifically, here's what I'd thread in on the next rewrite:

**In "What a spec-style prompt contains,"** one concrete example in the task component showing the step prompts from cwv-agent, where the task is implicit and lives in a different file. One or two sentences, a short code snippet or a link. Enough to ground the abstraction.

**In "When you're over-specifying,"** the context-bundling example. 60 bullets of EDS idioms shipped to every agent regardless of phase. This becomes your concrete tradeoff anecdote (hard part 3), replacing the generic "I added a fifth example" story I was originally going to ask you to provide.

**Optionally, a single line in the opening** acknowledging that you went to look at your own prompts and found work to do. Not a full frame for the module, just a sentence that signals authenticity. Something like "I wrote this module partly because I went to look at the prompts in a side project of mine and realized I'm not following most of what's below." One line, then you move into the personal moment that's the actual hook.

I wouldn't put the cwv-agent reference in more than those three places in M1. Once in the four-component section as a task example, once in the over-specifying section as the anecdote, optionally once in the opening as a framing beat. More than that and the module starts feeling like it's about cwv-agent instead of about specification.

Ready to do the full rewrite with this threaded in whenever you want. Or if you'd rather draft the opening and the two hard-part sections first and have me do a voice pass instead of another full rewrite, that works too. Your call on sequencing.

---

## Human (Apr 23, 2026, 10:43 AM):

Great, do the full rewrite and weave in what we discussed.

---

## Human:

# Module 1 — Prompting as a design problem, not a phrasing trick

**Tier:** 1 (everyone)
**Audience:** Mixed (PMs, architects, engineers)
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** None. Frame-setter for the whole curriculum.
**Standalone publishable:** Yes
**Ends with bridge to:** Module 2 (Context is the product)

---

## Outline

1. **Opening** (~250w) — [HARD PART 1]
2. **What this module covers** (~150w) — draft
3. **The frame shift: prompt engineering vs specification** (~300w) — draft
4. **What a spec-style prompt contains** (~500w) — draft with cwv-agent worked example, needs voice pass
5. **Common failure modes and the move that fixes each** (~250w) — draft with table
6. **Predict before you run** (~350w) — draft with [HARD PART 2] inline
7. **Iteration: prompts aren't one-shot** (~300w) — draft
8. **When you're over-specifying** (~350w) — draft with [HARD PART 3] as cwv-agent anecdote
9. **Bridge to Module 2** (~100w) — draft
10. **TLDR** (~250w) — draft
11. **Lab handoff** (~50w) — draft

---

## Concept post draft

### Opening

[HARD PART 1 — Julien writes. See hard-parts checklist for the optional one-line nod to cwv-agent.]

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

The single habit that moves quality most in this module is also the one people skip. Before you hit send, write one sentence about what you expect back. Length, shape, whether the model will get the point. Then run.

The value is not the prediction itself. The value is that writing the prediction surfaces the things you didn't specify. You sit down to predict, and you realize you don't know what length you want. Or what tone. Or whether you want bullets or prose. That gap is what your prompt is missing.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once: how good the output is, and how clear your own thinking was.

[HARD PART 2 — Julien writes: a specific moment where predicting-before-running caught a problem you'd otherwise have blamed on the model. Ideally a prompt you thought was fine, where the prediction exercise exposed the real ambiguity.]

A rough quantitative rule. If your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse also holds. If you can't predict the output at all, you haven't specified enough for the output to be judged.

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

[HARD PART 3 — Julien writes: the specific moment you realized this, and either what it cost you, or what you saw when you looked at the outputs with the over-broad context shipped. Good test: the voice samples are strongest when an observation has a number or a link attached. If you have a token count or a concrete example of the CrUX agent citing code-level idioms it shouldn't have known about, that's the grounding to lean on.]

### Bridge to Module 2

Specification gets you a good single-turn result. This module assumed one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem. The spec is fine. It's a context problem. Module 2 picks up there.

### TLDR

1. **Prompts are specs, not incantations.** The gap between a vague prompt and a specified one dwarfs the gap between two well-specified prompts phrased differently. Work on the spec first, the phrasing last.
2. **Four components make a spec: task, constraints, context, examples.** Most disappointing outputs are missing one of these. Check which before blaming the model.
3. **Predict before you run.** Writing a one-sentence prediction surfaces what you didn't specify. The prediction itself doesn't matter. The gap-finding does.
4. **Change one thing per iteration.** Multi-variable changes don't teach you anything. If you changed three things and the output improved, you don't know why.
5. **Know your noise floor.** The same prompt run three times produces different outputs. If your "improvement" is smaller than the run-to-run spread, you moved nothing.
6. **Over-specifying is a real failure mode.** If the prompt is longer than the output, you're writing the output yourself. The test: remove a constraint, rerun, see if it matters.
7. **Stop when iterations stop paying.** The first three usually matter a lot. After five or six, you're polishing. Ship and move on.

### Lab handoff

The lab for this module is a 90-minute self-paced exercise in the diagnostic move. Take 5 bad prompts, rewrite each three ways, predict which will work best, then run. Instructions in `/labs/m1-specification/`.

---

## Lab design

### Lab: Rewrite 5 bad prompts, three ways each

**Goal.** Build the habit of diagnosing and fixing prompts along three specific axes before running them. This is self-paced. There's no submission, no review. You're doing it for yourself.

**Setup.** You'll find 5 deliberately bad prompts in the lab repo at `/labs/m1-specification/bad-prompts.md`. Each one is a real shape of prompt that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

**Exercise.** For each prompt, produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format. The four components from the concept post. Don't add examples or restructure the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. This is the "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies (i.e. "summarize then rank" rather than "give me the top 3").

Before running any of the rewrites, **predict**. For each of the 5 prompts, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

Only then run them. All three rewrites, each one twice (for the noise floor).

**What you'll have at the end.** For each of the 5 prompts: three rewrites, your prediction, actual outputs (two runs each), and a sense of whether your prediction held. Keep the notes somewhere you can go back to. You'll want to compare against yourself in Module 2 when the same prompts get longer conversations around them.

**Time budget.** ~90 minutes. If it's taking three hours, you're polishing the rewrites rather than practicing the diagnostic move. Stop and move on.

**Common traps:**

- Making the "specification rewrite" so long it's actually three rewrites in one. Keep it to the one axis.
- Running each rewrite once. The noise-floor discussion in the post is why you run each twice.
- Skipping the prediction step because it feels silly. The prediction is most of the value.

**Extension, optional.** Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. That's the over-specification test from the concept post, applied.

---

## References

- **Anthropic prompting docs.** Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame. Less useful for building the frame itself. `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`
- **Simon Willison's weblog.** Ongoing practitioner notes on prompting, with honest reporting of what works and what doesn't. Good counterweight to hype.
- **"Prompt report" (Schulhoff et al., 2024).** A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy. The useful finding for this module is that most "clever" techniques produce small gains compared to basic specification.
- **Shreya Shankar et al. on prompt evaluation.** Applied work on evaluating prompt quality systematically. Matters more for production systems. Worth reading if Module 6 (oracles) catches your attention.

---

## Hard parts checklist

**1. Opening hook (~250 words).** A specific moment where you went from treating prompting as tricks to treating it as specification. First impressions decide whether this reads as yet-another-prompting-guide. Your voice samples consistently ground abstract claims in specific numbers or cases (the ~600ms DNS+TLS figure, a named project situation, a specific repo). A synthesized opening from me would land generic. What I need from you: one specific prompt or task where the shift clicked, with enough detail that the reader can picture it.

*Optional one-line cwv-agent nod.* If you want to signal authenticity early, a single sentence near the end of the opening along the lines of "I partly wrote this because I went to look at my own prompts in cwv-agent and realized I'm not following most of what follows" works well. Don't let it take over the hook. The opening is about the personal moment when the frame clicked, not about cwv-agent.

**2. Failure anecdote in "Predict before you run" (~150-250 words).** A case where predicting-before-running caught a problem you'd have blamed on the model. This section otherwise stays abstract, and the Slack samples show you're strongest when a principle is attached to a specific thing that broke. If you don't have one that fits, say so and I'll draft a plausible generic. But a real one will land harder. Good test: does the story end with "so the problem wasn't the model, it was that I hadn't specified X"?

**3. Over-specifying anecdote (~150-250 words, now cwv-agent-grounded).** I've set up the context-bundling observation in the prose above. What's missing is your voice and a concrete moment. Two ways this can go:

- *If you remember the moment you noticed this.* Write the before/after: what you saw in the outputs that tipped you off, or what made you look at the prompts again after the Summit. Two or three sentences of scene-setting, then the specific thing you noticed.
- *If you noticed it just now, looking at the files with me.* That's also fine and possibly more honest. "Writing this module, I went to look at my own prompts and saw that every sub-agent gets every bullet, regardless of whether it'll look at code." Either framing works.

Good test: does the anecdote end with either a specific number (tokens, bullets, something you can count), a specific link to the file, or a one-sentence admission of what you'd change? The voice samples are explicit on tradeoffs ("we estimate 20~40pts hit"); this section should have the same texture.

**4. Voice pass on the four-component section (~500 words, now including the first cwv-agent worked example).** That section is the most didactic in the module, which is where generic cadences creep in. Specifically check: (a) the one-line tests for each component are mine, and I suspect at least two are more abstract than you'd phrase them; (b) the transitions between components are smooth but possibly too smooth, reading more like a textbook than like you explaining it; (c) the cwv-agent worked example I inserted uses "I'll come back to this in the over-specifying section below" as a pointer — voice-check whether that self-reference sounds like you or like me.

---

One note on cwv-agent integration going forward. I've woven it into M1 in two places (task example in the four-component section, over-specifying anecdote). If this feels right, I'd suggest we aim for roughly one or two cwv-agent touchpoints per module, not more. Modules where there's no natural fit (M9 on Agent Teams, for instance, if you're not running cwv-agent as a team) can skip it entirely. A forced reference in every module would turn the curriculum into a cwv-agent case study, which is the failure mode we talked about earlier. I'll flag these fits or non-fits as we go.

---

## Human (Apr 23, 2026, 1:37 PM):

Let's try to draft something for the "opening hook".
I think the 2 major events that triggered all of this was:

1. A colleague was telling me about the migration of his vibe-coded project to a new version they were fully developing following Spec-Driven Development. I had never looked at this closely, and as he was explaining that he was basically just coding "MD" files, and the agent was doing all the rest… it was kinda eye opening to me. until then I was still considering vibe coding as a chat sitting next to the coding files I was still involved in, and not having MD being the primary "coding" artifacts I produce
2. The 2nd was when a colleague told me about him running 24h+ sessions with claude, unsupervised and essentially reviewing on a Wednesday a task he had started on a Monday. 2 days, unsupervised, and code was working. I was mind blown… in my experience, if I had claude code spawing maybe 1 or 2 sub agents and running for 10~15mins, that was already a stretch and I still had to correct path often. The gap between his level and mine was just mind boggling. 

On the "Predict before you run"… I'm actually not sure I've really ever done it. At least not consciously like you described. I've definitely had to iterate on prompts to ultimately clarify the things I hadn't spec'd properly upfront, but didn't use your approach for this

On "Over-specifying anecdote", I just noticed it now with you. until now, I always kinda assumed more context is better as long as I stick to the context window size and token limits… but reviewing the CMS context prompts with you made me realize the issue

---

## Human:

Good material, and honest answers on the other two. Let me address each.

**Opening hook.** Both moments are the right kind of raw material. They're specific, they have a person attached, and they locate a "before and after" in your own understanding. What they don't do yet is land on the module's frame. Right now they're "I realized I was way behind on how far this could go" — which is true and interesting, but it's a motivation story, not a specification story. The module is about prompts-as-specs. The opening should point at that, not at orchestration (which is M7-10).

The good news is that moment 1 is basically already there. "Coding MD files" *is* the specification frame, stated as a practice rather than a principle. Your colleague telling you "I mostly write markdown and the agent does the rest" is the same insight as this module's thesis, just from the production-code side rather than the single-prompt side. That's the thread to pull.

Moment 2 is interesting but it fits better as the motivation for the whole curriculum than as M1's opening specifically. It's the "why learn this at all" story. I'd hold it for a curriculum intro or for M7 where it actually pays off, rather than front-loading it in M1 where it promises something the module doesn't deliver.

Here's a draft opening pulling on thread 1. I've kept it loose so you can voice-pass it, and I've marked two places where you'd want to fill in specifics.

---

*Draft:*

A colleague told me last [month/quarter — whatever the actual time is] that he was migrating a vibe-coded project to a new version, and that this time around he was doing it differently. He was doing spec-driven development. I nodded along, not really sure what he meant, and asked him to walk me through it.

What he described, roughly, was this: he wasn't writing code anymore. He was writing markdown files. Specs, design docs, constraints, examples of what the output should look like. The agent wrote the code. His job was to write the specs well enough that the code came out right.

I'd been vibe-coding for [months / however long] at that point. My version of it was a chat window next to my editor. I'd describe what I wanted, the agent would produce something, I'd read it, fix what was off, ask for changes. The markdown files in my repos were README, CHANGELOG, maybe a CONTRIBUTING if I felt organized. Nothing load-bearing. The actual thinking lived in the chat.

His version was the inverse. The markdown was load-bearing. The chat was transient.

That reframe is what this module is about, at the smallest possible scale. A single prompt is a spec too. Most people I've watched write prompts treat them the way I was treating my chat — a place to think out loud, iterate toward what they want, correct the model when it drifts. That works. It's also the reason the same people hit a ceiling and blame the model.

The alternative isn't more clever phrasing. It's treating the prompt itself as the artifact worth getting right.

---

That's ~280 words. Slightly over the 250 target but the structure earns it.

Notes on the draft:

- The two `[bracketed]` bits are where you'd plug in specifics. If you can name the colleague (and they're okay with being named publicly), do. Voice samples show you're comfortable naming people directly. If not, "a colleague" is fine.
- I kept the reveal deliberately small. The colleague did something ordinary (wrote markdown), you saw why it mattered. No dramatic framing, no "mind blown." Your voice samples are consistent in not overselling moments like this.
- The last two paragraphs do the work of pointing at the module. I'd treat those as the most editable part — if the tone feels too essay-y, cut them to one paragraph. Something like "A single prompt is a spec too. That's what this module is about."

**Predict before you run.** If you haven't done it consciously, don't pretend you have. Two options:

1. **Cut the section.** The module stands without it. The frame-shift, four components, failure table, iteration discipline, and over-specifying all do the teaching. "Predict before you run" is a nice-to-have technique, not load-bearing.
2. **Demote it from a section to a paragraph.** Mention it briefly inside "Iteration: prompts aren't one-shot" as one way to close the loop. Something like: "One habit some practitioners use is to write down what they expect before running. I haven't made it a consistent practice myself, but the theory is sound — and the couple of times I've tried, writing down my expectations surfaced what I hadn't specified clearly." That's honest and still gives the reader the idea.

I lean toward option 2 because the underlying insight is real and the section is otherwise a gap. But if the demotion feels forced, option 1 is fine. The module loses ~350 words and roughly 3 minutes of read time, neither of which hurts.

What this means for the hard-parts checklist: HARD PART 2 goes away. You don't need to write a predict-before-run anecdote you don't have. If you take option 2, I'll draft the short paragraph and you voice-pass it.

**Over-specifying.** Perfect. Write it exactly like you just said it to me. Your literal framing — "I just noticed it now with you. until now, I always kinda assumed more context is better as long as I stick to the context window size and token limits… but reviewing the CMS context prompts with you made me realize the issue" — is the anecdote. It's honest, it's specific, it lands in the right place (the over-specifying section), and it matches the voice samples' pattern of direct acknowledgment when something clicks ("Good catch, I learned something").

A draft of that as module prose, for voice-passing:

---

*Draft:*

Honest admission: I didn't notice this about my own code until I was writing this module. My working assumption had been that more context is better as long as you're within the context window and token budget. It isn't. Shipping the full EDS context — ~60 bullets covering characteristics, optimizations for each Core Web Vital, and anti-patterns — to the CrUX agent that only looks at field data is roughly like giving someone a stack overflow question and also the entire MDN web docs, then asking them to answer the question. They'll still answer it. They'll just be slower, and the odds go up that the answer cites something from MDN that wasn't actually relevant.

The fix I'll ship back to that repo is phase-scoped context. CrUX agent gets the field-data-relevant subset. Code review agent gets the code-level idioms. The shared baseline stays small. I'll link the PR when it's up.

---

That's ~150 words, with room to grow if you want to add a specific observation you saw in the outputs. The "I'll link the PR" line makes the cwv-agent touchpoint real without committing you to a specific timeline.

**Updated hard-parts checklist,** assuming you go with option 2 on predict-before-run:

- Hard part 1: voice-pass the opening draft above, fill in the bracketed specifics
- Hard part 2: *dropped* (predict-before-run becomes a paragraph I'll draft)
- Hard part 3: voice-pass the over-specifying draft above
- Hard part 4 (four-component section voice pass): unchanged from last round

Want me to produce the demoted predict-before-run paragraph now, or wait until you've voice-passed the opening and the over-specifying drafts?

---

## Human (Apr 23, 2026, 1:45 PM):

I like the both drafts! Let's use this, and I'll fill in the blanks later. For the predict before you run, I'd keep the section and probably "demote" like you suggested. We could rephrase to doing it explicitly initially, and then more intuitively as we go. and I've mostly realized I've been doing it intuitively now after prompting for 2 years or so, but never really did it explicitly.

---

## Human:

Good call on keeping the section. The "explicit → intuitive" arc is actually a stronger version of the technique than the one I originally drafted, because it names a real stage transition rather than prescribing a forever-habit. Most techniques people teach are like this: you do them deliberately until they become reflex, and then the deliberate version feels like training wheels. Saying that out loud makes the section honest.

Here's a redraft of the section with the explicit → intuitive framing woven in. I've kept the overall structure (why it works, a simple version, the quantitative rule at the end) and repositioned your anecdote as the closer rather than as a mid-section inset, because the admission lands better once the reader has the full technique in front of them.

---

### Predict before you run

One habit that moves quality, especially early on: before you hit send, write one sentence about what you expect back. Length, shape, whether the model will get the point. Then run.

The value is not the prediction itself. The value is that writing the prediction surfaces the things you didn't specify. You sit down to predict, and you realize you don't know what length you want. Or what tone. Or whether you want bullets or prose. That gap is what your prompt is missing.

A simple version: open a scratch doc, write "I expect ~200 words, three bullets, conversational tone, and it'll probably miss the point about X." Run. Compare. The comparison tells you two things at once: how good the output is, and how clear your own thinking was.

A rough quantitative rule to go with the habit. If your prediction and the output diverge on three runs in a row with the same prompt, the problem is the prompt, not the model. Rewrite, don't retry. The inverse also holds. If you can't predict the output at all, you haven't specified enough for the output to be judged.

Honest caveat. I've been prompting for roughly two years and I've never done this explicitly, with a scratch doc and a written-down expectation. What I do have is a running sense of what I expect before I run, and a quick "that wasn't it" reaction when the output lands, which sends me back to the prompt rather than to a retry. That's the same loop, just internalized. If you've been at this for a while and the explicit version feels like overhead, you may already be doing the intuitive version. If you're newer to it, I'd actually recommend the explicit version for the first few weeks. The scratch doc forces the gap-finding that intuition eventually handles for you.

---

That's ~320 words, close to the original target for the section. A few notes on the draft:

- I softened "the single habit that moves quality most" to "one habit that moves quality, especially early on" because the stronger claim doesn't survive your admission at the end. The weaker phrasing is also more accurate — the frame-shift is the habit that moves quality most in this module, not prediction.
- I moved the quantitative rule up, before the caveat. The caveat works better as a closer because it reframes the whole section. Putting the rule after the caveat would dilute the admission.
- The phrasing "I've never done this explicitly, with a scratch doc and a written-down expectation" is mine but should voice-pass cleanly. Your samples have this shape when you concede a point ("Good point — I was thinking about X, but this is Y"). The admission follows that template.
- The last sentence gives the explicit version back to the reader as a recommendation rather than leaving it undercut. This matters because otherwise the section reads as "here's a thing that works, by the way I don't do it, anyway moving on." The recommendation rescues the technique for the reader who needs it.

**Updated hard-parts checklist:**

- Hard part 1: voice-pass the opening draft, fill in bracketed specifics
- Hard part 2: voice-pass this predict-before-run section, especially the final caveat paragraph — the rest is fairly mechanical but the admission needs to sound like you, not like me
- Hard part 3: voice-pass the over-specifying draft
- Hard part 4: voice-pass the four-component section

Three of the four hard parts are now voice passes on drafts rather than generative writing from scratch. That's a smaller ask than where we started, and it matches the original collaboration model (you do the authenticity-load-bearing parts, I do scaffolding and commodity prose).

Want me to assemble the full module with all three drafts stitched in, so you can do the voice passes against a single document? Or would you rather voice-pass each section in place and then I reassemble?

---

## Human (Apr 23, 2026, 1:53 PM):

I've voice passed the sections individually and it feels right to me. You can assemble the final version. I'll fill in the blanks before we publish this later.

---

## Human:

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

A colleague told me last [month/quarter] that he was migrating a vibe-coded project to a new version, and that this time around he was doing it differently. He was doing spec-driven development. I nodded along, not really sure what he meant, and asked him to walk me through it.

What he described, roughly, was this: he wasn't writing code anymore. He was writing markdown files. Specs, design docs, constraints, examples of what the output should look like. The agent wrote the code. His job was to write the specs well enough that the code came out right.

I'd been vibe-coding for [months / however long] at that point. My version of it was a chat window next to my editor. I'd describe what I wanted, the agent would produce something, I'd read it, fix what was off, ask for changes. The markdown files in my repos were README, CHANGELOG, maybe a CONTRIBUTING if I felt organized. Nothing load-bearing. The actual thinking lived in the chat.

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

The fix I'll ship back to that repo is phase-scoped context. CrUX agent gets the field-data-relevant subset. Code review agent gets the code-level idioms. The shared baseline stays small. I'll link the PR when it's up.

### Bridge to Module 2

Specification gets you a good single-turn result. This module assumed one prompt, one output, done.

Real work runs longer. You ask a follow-up, then another. You paste in a document. You come back tomorrow with more questions about the same project. At some point the conversation is 40 turns deep and the model is contradicting something it said at turn 3. That's not a prompting problem. The spec is fine. It's a context problem. Module 2 picks up there.

### TLDR

1. **Prompts are specs, not incantations.** The gap between a vague prompt and a specified one dwarfs the gap between two well-specified prompts phrased differently. Work on the spec first, the phrasing last.
2. **Four components make a spec: task, constraints, context, examples.** Most disappointing outputs are missing one of these. Check which before blaming the model.
3. **Predict before you run.** Writing a one-sentence prediction surfaces what you didn't specify. The prediction itself doesn't matter. The gap-finding does.
4. **Change one thing per iteration.** Multi-variable changes don't teach you anything. If you changed three things and the output improved, you don't know why.
5. **Know your noise floor.** The same prompt run three times produces different outputs. If your "improvement" is smaller than the run-to-run spread, you moved nothing.
6. **Over-specifying is a real failure mode.** If the prompt is longer than the output, you're writing the output yourself. The test: remove a constraint, rerun, see if it matters.
7. **Stop when iterations stop paying.** The first three usually matter a lot. After five or six, you're polishing. Ship and move on.

### Lab handoff

The lab for this module is a 90-minute self-paced exercise in the diagnostic move. Take 5 bad prompts, rewrite each three ways, predict which will work best, then run. Instructions in `/labs/m1-specification/`.

---

## Lab design

### Lab: Rewrite 5 bad prompts, three ways each

**Goal.** Build the habit of diagnosing and fixing prompts along three specific axes before running them. This is self-paced. There's no submission, no review. You're doing it for yourself.

**Setup.** You'll find 5 deliberately bad prompts in the lab repo at `/labs/m1-specification/bad-prompts.md`. Each one is a real shape of prompt that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

**Exercise.** For each prompt, produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format. The four components from the concept post. Don't add examples or restructure the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. This is the "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies (i.e. "summarize then rank" rather than "give me the top 3").

Before running any of the rewrites, **predict**. For each of the 5 prompts, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

Only then run them. All three rewrites, each one twice (for the noise floor).

**What you'll have at the end.** For each of the 5 prompts: three rewrites, your prediction, actual outputs (two runs each), and a sense of whether your prediction held. Keep the notes somewhere you can go back to. You'll want to compare against yourself in Module 2 when the same prompts get longer conversations around them.

**Time budget.** ~90 minutes. If it's taking three hours, you're polishing the rewrites rather than practicing the diagnostic move. Stop and move on.

**Common traps:**

- Making the "specification rewrite" so long it's actually three rewrites in one. Keep it to the one axis.
- Running each rewrite once. The noise-floor discussion in the post is why you run each twice.
- Skipping the prediction step because it feels silly. The prediction is most of the value.

**Extension, optional.** Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. That's the over-specification test from the concept post, applied.

---

## References

- **Anthropic prompting docs.** Official guide covering mechanics (system prompts, few-shot, XML tags) with examples. Useful as a reference once you have the frame. Less useful for building the frame itself. `https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview`
- **Simon Willison's weblog.** Ongoing practitioner notes on prompting, with honest reporting of what works and what doesn't. Good counterweight to hype.
- **"Prompt report" (Schulhoff et al., 2024).** A systematic survey of prompting techniques with empirical evaluations. Skim it for the taxonomy. The useful finding for this module is that most "clever" techniques produce small gains compared to basic specification.
- **Shreya Shankar et al. on prompt evaluation.** Applied work on evaluating prompt quality systematically. Matters more for production systems. Worth reading if Module 6 (oracles) catches your attention.

---

## Remaining blanks to fill before publication

1. **Opening, paragraph 1.** "last [month/quarter]" — pick the actual timeframe.
2. **Opening, paragraph 3.** "vibe-coding for [months / however long]" — pick the actual duration.
3. **Opening, paragraph 1.** Decide whether to name the colleague. If yes and they're okay with it, replace "A colleague" with the name. Same question for the colleague referenced at the start (spec-driven development story).
4. **Over-specifying section, final paragraph.** "I'll link the PR when it's up" — either land the PR and link it before publishing, or leave the line as a commitment-with-timestamp ("shipped MM-DD-YYYY") when you ship the repo.

Module 1 is ready for voice-pass verification and then publication once those blanks are filled. Want to move to Module 2 in the next session, or draft anything else for M1 first (the 5 bad prompts for the lab, the README for the lab repo)?

---

## Human (Apr 23, 2026, 2:01 PM):

Can you create an artifact for this that I can later refer to and easily copy/paste?

---

## Human:

Done. The file has the concept post, lab design, references, and the blanks-to-fill list at the bottom. Ready for voice-pass and the four specifics whenever you come back to it.

---

## Human (Apr 23, 2026, 2:04 PM):

I also need the lab documents

---

## Human:

I'll create three files for the lab: the prompts themselves, a README for the lab directory, and an optional worksheet template.Three files, all ready to drop into `/labs/m1-specification/`.

A note on the 5 prompts I picked. Each one exhibits one of the failure modes from the module's table as its dominant issue, and each one has a different rewrite axis that wins most cleanly:

1. **Write something interesting about ML** — vague topic. Specification wins.
2. **Summarize the attached quarterly report** — missing format. Example wins (format is easier shown than described).
3. **Look at my essay and make it better** — underspecified task. Decomposition wins (diagnose → prioritize → rewrite).
4. **Explain how OAuth 2.0 works** — no audience. Specification wins.
5. **Help me plan my week** — over-broad. Decomposition wins.

Coverage across axes: specification wins twice, example once, decomposition twice. Each axis wins at least once, which matters because otherwise learners might conclude one axis is always right.

I deliberately didn't include the winners anywhere in the files. That's the thing the learner discovers by running the exercise. If you want a separate instructor-facing "answer key" for your own reference (or for anyone who teaches this live later), I can draft one as a fourth file. Otherwise it stays in this conversation.

---

## Human (Apr 23, 2026, 2:09 PM):

Should we also offer examples of good prompts for those? or we leave that up in the air?

---

## Human:

I'd leave it up in the air, and I want to explain why before you decide.

The module teaches a diagnostic move, not a template. The whole frame is "there's no magic phrasing, there's a spec that fits your situation." If I ship "here's the good version of prompt 3," I'm undercutting that frame in two ways:

**First, it turns the axes into a multiple-choice test.** Right now the learner has to write their own specification rewrite, their own example rewrite, their own decomposition rewrite. That's where the learning happens. If there's a reference "good prompt" to compare against, they'll anchor to it. Their rewrite stops being "what do I need to specify here" and becomes "how close did I get to the answer." The prediction exercise also collapses, because once they've seen the reference, they can't un-see which axis it used.

**Second, "good" is context-dependent in a way the module is explicit about.** The "write something about machine learning" prompt has no single good rewrite. It depends on who's asking, what they'll do with the output, what they already know. A reference answer implies there is one, which contradicts the module's position that a spec fits a situation.

That said, there are two middle grounds worth considering:

**One worked example in the module itself, not in the lab.** Not an answer key, but a walkthrough of one prompt to show the thinking. Something like "here's how I'd approach prompt 3, briefly: I'd name the task as 'identify the three biggest clarity issues and rewrite the passages that have them,' which is decomposition flavored with specification..." Short, shown once, not tied to the 5 lab prompts. This teaches the move by example without giving answers.

**A reflection prompt at the end of the lab, not a reference.** Something like "after you've run all 15 rewrites, look at which one won each time and write one sentence about the pattern you see." That makes the learner produce the generalization rather than consume it.

My recommendation: skip the answer key. If you want to add teaching scaffolding, do the second option (a reflection prompt in the worksheet or lab instructions). It reinforces the diagnostic skill without collapsing the exercise.

One reason to reconsider: if your experience running this internally shows learners bounce off without guidance and give up. If that happens, you can always add examples in a follow-up version. Going from "no examples" to "here are some" is easy; going the other way requires retracting something you already published.

If you do want examples, I'd suggest a single worked walk-through inside the concept post (under "What a spec-style prompt contains" or as a new "Walking through one" subsection), using a prompt that is *not* one of the 5 lab prompts. Keeps the lab clean, shows the move once.

Want me to draft that single walk-through, or leave it as-is?

---

## Human (Apr 23, 2026, 2:11 PM):

Let's leave it as-is

---

## Human:

Sounds good. Module 1 is complete then: concept post, lab design, and three lab files, all in artifacts ready to copy/paste when you're ready to publish.

Remaining to-dos on your side before publication:

1. Voice pass (you said this already feels right)
2. The four blanks in the module (timeframes, colleague naming, PR link)
3. The cwv-agent PR with phase-scoped context, whenever you get to it

Ready to move on to Module 2 whenever you start the next session. The bridge at the end of M1 already sets it up: specification holds for one turn, context problems start at turn 40.

---

