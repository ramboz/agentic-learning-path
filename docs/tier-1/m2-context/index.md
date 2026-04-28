---
title: M2 — Context is the product
description: Context window management, conversation degradation, and the "Claude forgot vs. Claude never had it" diagnostic.
---

# Module 2 — Context is the product

**Tier:** 1 (everyone)
**Audience:** Mixed (PMs, architects, engineers)
**Length target:** ~3000 words concept post + ~700 words lab
**Prerequisites:** Module 1 (Prompting as a design problem)
**Standalone publishable:** Yes
**Ends with bridge to:** Module 3 (From chat to Claude Code)

---

## Concept post

### Opening

About a year ago, when I started exploring vibe-coding on larger projects, I tried porting a 100K-line C# trading bot I hadn't written to Node.js, modernizing the stack along the way. I didn't know the project at all, so I wanted Claude to extract the architecture, reason about a more modern approach, and then port it to JS with high fidelity. This was before planning mode, before multi-step plans, before Claude Code was generally available.

I was already aware I needed new sessions for new tasks, to avoid hallucinations and context exhaustion. But I was splitting sessions by "feature" or "slice," and porting each slice was a 50+ turn discussion. By the end of every slice I was running into the same wall: reminding the model of decisions we'd made earlier, re-correcting the same mistakes, flagging self-contradictions. Every session had a pile of "I apologize for the oversight" messages stacked up.

My workaround at the time was to generate markdown files with intermediate status, decisions, and open threads, then use those to resume in a fresh session. It mostly worked. Projects didn't exist yet. Neither did any real shared memory. The markdown was load-bearing by necessity.

Looking back, I'd been thinking about this wrong. I was treating the session as where the work happened, and when the session got saturated, I blamed the model for not keeping up. The actual shift was realizing the session wasn't where the state belonged. It was one contribution to a larger thing I needed to manage deliberately, and my job was managing that larger thing, not writing better prompts inside an overfilled window.

### What this module covers

In a nutshell:

1. Why the context window, not the prompt, is the thing you're actually managing
2. The four layers of context and where each one comes from
3. How long conversations degrade, and why "longer" isn't the only failure mode
4. The "Claude forgot vs. Claude never had it" diagnostic and why the fix differs by case
5. The failure-mode table: symptom, diagnosis, single-move fix
6. Tools for managing context across conversations: projects, artifacts, attachments
7. Over-contextualizing as the mirror-image failure mode
8. When to close the conversation and start fresh

The lab is a 60-minute exercise on diagnosing a deliberately messy 50-turn conversation, fixing it three ways, and measuring which fix actually worked.

This module assumes [Module 1](../m1-prompting/). It extends the "prompts are specs" frame to "context is the product." If you skipped M1, the four-component diagnostic from there shows up here too.

### The reframe

[Module 1](../m1-prompting/) reframed prompt engineering from incantation to specification. That works at the scale of a single turn. Beyond that, the frame has to expand.

The thing you're managing across a real piece of work is not a prompt. It's everything the model can see when it generates the next response. That's the context window. Your prompt is one contribution to it, often a small one. The rest comes from the system prompt, the conversation history, any attached files, any project knowledge, any artifacts in scope.

When an output disappoints after turn 20, the prompt is rarely the problem. The context is.

A useful mental model: context is a workbench, not a memory. The model doesn't "know" anything about your project the way a teammate does. Between turns, nothing persists except what's literally in the context window for the next call. Whatever's on the workbench gets used. Whatever's off gets ignored, even if you put it there yourself an hour ago and still remember it.

That's the uncomfortable part. You, the human, are a stateful system. You remember what you said at turn 3. The model is stateless between calls. It reads the whole workbench fresh each time. If turn 3 is still on the bench, great. If it got shoved off, the model reads the next prompt without it and responds accordingly.

Most of the "Claude is being weird" moments are variations on this. The workbench doesn't match what you think is on it.

### The four layers of context

Any message to the model gets assembled from four layers. Useful to keep them distinct, because they come from different places and have different lifecycles.

1. **System prompt.** Instructions about who the model is, what it's for, what it should avoid. In the Claude app, this is set by Anthropic and mostly invisible. In the API, it's something you write. In Claude Code, it's Anthropic's system prompt plus your CLAUDE.md. This layer doesn't change within a conversation.

2. **Persistent context.** Things in scope for the whole conversation by default: project files, CLAUDE.md, any memory features enabled. Set once, referenced implicitly.

3. **Conversation history.** Every prior turn in the current conversation. Your prompts and the model's responses, in order, all the way back. This is the layer that grows.

4. **Just-in-time context.** Attachments, pasted documents, images, anything added specifically for the current turn. Technically part of the user message, but worth thinking of separately because it's the layer you control directly, right now, every turn.

When a response goes wrong, it's worth asking which layer was responsible. The failure modes differ by layer, and so do the fixes.

### How long conversations degrade

"Context window is full" is the obvious failure mode. It's also not the most common one.

Well before you hit the context limit, longer conversations degrade in ways that are subtler:

- **Attention dilutes.** The model's ability to attend to specific details doesn't stay constant as the conversation grows. Facts stated at turn 3 get less weight at turn 40 than facts stated at turn 38, even if both are technically in context.
- **Contradictions accumulate.** Correct the model at turn 12 ("we're on Vue, not React"), and ten turns later it'll often default back to the first version. The correction is in context, but it's one line competing with surrounding discussion that kept referencing the wrong thing.
- **Recency bias dominates.** The last few turns exert disproportionate influence on the next response. A detailed setup at the start gets outweighed by a tangential exchange at the end.
- **Signal-to-noise drops.** Exploratory dead ends, false starts, retries, all of it stays in context. By turn 30, a conversation that started focused might be mostly noise with the signal buried.

None of this is a hard failure. The model doesn't throw an error. It just silently becomes less useful. That's what makes it hard to diagnose in the moment. The response looks plausible. You only notice something's off if you're paying close attention to whether it reflects what you established earlier.

A rough rule, not a law: past roughly 20-30 turns on a single topic, start watching for these patterns. Past 50, assume at least one of them is happening and plan accordingly.

### Claude forgot vs. Claude never had it

The single most useful diagnostic move in this module. When the model produces an output that misses something you thought was established, there are two very different things that could be happening, and they have opposite fixes.

**Claude forgot.** The information was in the conversation. Somewhere up there, you said it. The model isn't pulling it forward into the current response. This is a context-management problem: the information is present but not weighted enough to surface. The fix is to make it more present. Restate, summarize, or pull the key points into the current turn.

**Claude never had it.** The information was never actually in this conversation. You're thinking of a different chat, or a doc you have open but didn't paste, or something you know from your own work. The model has no access to it. This is an underspecification problem, same shape as M1's context test. The fix is to add the information, not restate it (there's nothing to restate).

What happens when the model notices the gap matters here. The default is to answer, not to stop and ask. When the context doesn't contain what it needs, the model falls back to training data, plausible-sounding defaults, or whatever it can piece together from adjacent context. You get a confident answer that's partly or entirely invented, delivered in the same tone as a correct one.

This happens at turn 1 as often as at turn 30. A question asked without enough context (your stack, your constraints, your conventions) gets answered against the model's best guess at what a typical version of your situation looks like. Sometimes that's right. Often it's close enough that you don't notice until later. Session boundaries make it worse. You summarized a prior conversation into a markdown file, started fresh with the summary, and the summary silently dropped a decision. The model has partial context, no way to know what's missing, and will cheerfully invent plausible fill for the gap. You won't notice unless you happen to check the answer against the original source.

This is where "never had it" gets harder to detect than "forgot." When the model forgets, it often contradicts something you can see earlier in the chat. The contradiction is the signal. When the model never had it, there's no contradiction. Just plausible fiction, presented with the same confidence as correct answers.

One countermeasure worth building into your default prompting: explicitly tell the model to ask clarifying questions before proceeding, rather than filling gaps itself. Something like "if any part of the scope is ambiguous or missing context you'd need, ask before you start." It won't catch everything. It catches the cases where the gap is obvious enough that the model would notice if it were looking for gaps instead of trying to be helpful.

The baseline diagnosis is still cheap: a 30-second scroll-back.

- If you find the information in the current conversation: Claude forgot. Restate it.
- If you can't find it: Claude never had it. Add it and move on.

The trap: you're sure you said it. So sure that you skip the scroll-back. Roughly half the time you'll be right. The other half, you're thinking of a parallel conversation, a doc, or a message from yesterday. The scroll-back is cheap. Skipping it wastes an hour.

### Failure modes and the move that fixes each

| Symptom | Diagnosis | Fix |
|---|---|---|
| Contradicts something established earlier in the conversation | Claude forgot (attention dilution) | Summarize the key decisions in the current turn, then ask the question |
| Ignores a specific constraint you established | Forgot or never had it. Scroll back to check | If in chat: restate. If not: add it |
| Feels "generic," less informed than earlier responses | Signal-to-noise dropped | Start a new conversation with a distilled summary |
| Loops back to an approach you already rejected | Recency bias, correction buried | Lead the next prompt with the rejected approaches, explicitly out of scope |
| Defaults to the wrong language, framework, or convention | Correction stated once, not reinforced | Put the correct version in a project file or at the top of the conversation |
| Can't reference a file you "shared" | Never had it. You pasted in a different chat | Attach or paste again in this conversation |
| Confidently answers, but the answer is subtly wrong or invented | Never had the grounding. Context didn't cover it, model filled the gap from training data | Ask the model to flag gaps before answering; check against the original source |
| Quality drops sharply after a long document paste | Attachment displaced earlier context | Summarize the attachment's relevance explicitly, or move it to a project file |
| Model apologizes, retries, produces the same wrong thing | Context problem, not prompt problem | Stop rewording the prompt. Fix the context or start fresh |

The meta-move is the same as [M1](../m1-prompting/)'s: before blaming the prompt, check the context. The failure-mode table front-loads the checks you'd otherwise spend minutes rediscovering live.

### Tools for managing context across conversations

A single conversation is one unit of context. Real work spans many. The tools below manage context at that larger scale, where conversations come and go but the underlying project persists.

**Projects (Claude app).** A shared context bundle (project instructions plus project files) automatically in scope for every conversation inside the project. Useful when you have stable knowledge relevant across many conversations: a repo structure, a style guide, standing decisions about a codebase. Put things here when the answer to "should this be in every chat on this topic" is yes.

**Artifacts (Claude app).** A workspace for canonical versions of outputs the model is iterating on. The artifact is the stable thing; the conversation around it is scaffolding. If the model produces a document you'll keep refining, the artifact is where it lives. The advantage over copy-pasting is that subsequent turns can reference "the artifact" without you re-pasting its contents.

**Attachments.** Documents, images, code files added to a specific message. Scoped to that message and onward in the same conversation. Good for one-off context that isn't worth promoting to project level.

**CLAUDE.md (Claude Code).** Covered in depth in M4. Functionally parallel to project instructions: persistent context loaded into every Claude Code session in a given directory. Teased here because the mental model carries over.

**Memory features.** Some interfaces support remembering facts across sessions. Useful in limited ways; not a substitute for explicit project files. If something is load-bearing for a project, put it in project files, not memory. Memory is for preferences, not for specs.

The progression when something starts to matter: paste it into the current turn, then attach it as a file, then promote it to project files, then codify it in CLAUDE.md if it's code-level. Each step makes it more durably available, at the cost of a little more setup.

### Over-contextualizing

There's an opposite failure mode to the one we've been discussing. If the context is bloated with things the current turn doesn't need, the model's attention is spent parsing noise. Scale [M1](../m1-prompting/)'s over-specifying pattern up from prompt to context, and this is what you get.

Symptoms:

- Project files grow past the point where you can skim them in one sitting
- Attachments pasted into every conversation "just in case"
- Conversations carrying 20 turns of setup before the first real question
- Quality drops noticeably after adding a large document, even though the document is relevant
- You find yourself scrolling back through 50 turns to find the one useful exchange

The same test from M1 applies, adapted: remove a piece of context and see if it matters. Pull one file out of the project. Delete a redundant section. Start a fresh conversation without the accumulated history. If the quality is the same or better without it, it was noise.

Everything in context costs attention, even when it's free in tokens. "It fit in the window" is not the same as "it helped." Attention is a budget too, and the budget is finite even when the token count isn't.

The same failure mode shows up at the sub-agent level, which is where I hit it first. In cwv-agent (the recurring example from M1), every phase-specific sub-agent was receiving the full `getTechnicalContext(cms)` payload: around 60 bullets covering CMS quirks, performance optimizations, and anti-patterns across every Core Web Vital. Useful for the code-review agent. Pure noise for the CrUX agent, which analyzes field data and never touches code. My working assumption had been that more context was fine as long as I was under the token limit. It wasn't. The fix was phase-scoped context per sub-agent ([PR #68 in the cwv-agent repo](https://github.com/ramboz/cwv-agent/pull/68) has the diff). The chat equivalent is pulling files out of project context once they're no longer pulling their weight, even if they felt essential the day you added them.

### When to close the conversation and start fresh

Starting a new conversation feels like losing context. In long-running work, it's usually a net gain.

Heuristics:

- **New topic, long conversation.** Pivoting to something substantially different and the conversation is past 20 turns? Start fresh. The old context is more likely to mislead than to help.
- **Repeated correction loops.** Corrected the same misunderstanding more than twice? Context is working against you. Start fresh with the correction baked into the first message.
- **You'd need to scroll back to summarize it.** If you couldn't tell a new person what this conversation has established without re-reading it, the context isn't serving you. Distill the established facts, put them in a fresh conversation.
- **You want to preserve progress.** Starting fresh doesn't mean losing work. Summarize what matters, paste into a new chat or add to project files.

The transition cost is real but small. A distilled summary of a 40-turn conversation is typically three paragraphs. Three paragraphs of fresh signal usually beats 40 turns of accumulated noise.

One caveat the opening showed: the summary is only as good as what you remember to put in it. The "never had it" failure mode described above often starts as a fresh-conversation move that dropped a decision. If you're going to distill, distill against the original, not against what you remember of the original. Scroll back to the key turns. Quote them into the summary verbatim where it matters. The extra minute saves the hour you'd spend hunting a decision that silently fell out two sessions back.

### Bridge to Module 3

So far, everything here has assumed the chat interface: conversations, projects, artifacts, attachments. That's where most people start and where many stay. It's also not where Claude does its most interesting work.

When the work shifts from "help me think through this" to "go do this thing in my codebase," the chat interface starts to strain. File paths get pasted in and out. Diffs get copied, edited, copied back. The context window fills with ceremony: here's the file, here's what I changed, here's what broke. [Module 3](../m3-claude-code/) is about the transition from chat to Claude Code, and what happens when the terminal becomes the interface and the filesystem becomes part of the context.

The context principles from this module carry over directly. What changes is the mechanics.

### TLDR

1. **Context is the product, not the prompt.** What you're managing across real work is the whole context window, not just the latest message.
2. **Four layers of context: system prompt, persistent, conversation history, just-in-time.** Different failure modes per layer, different fixes.
3. **Long conversations degrade before they overflow.** Attention dilutes, contradictions accumulate, recency bias dominates, signal-to-noise drops. Expect it past 20-30 turns.
4. **"Claude forgot vs. Claude never had it" is the key diagnostic.** Same symptom, opposite fixes. Scroll-back decides which. The tricky version is when the model fills a gap it didn't flag, most often at turn 1 with underspecified scope, or at session boundaries where a handoff silently dropped context. Detect it by asking the model to flag gaps before answering.
5. **Project files, artifacts, and attachments are tiers of durable context.** Promote things up the tiers as they start to matter across conversations.
6. **Over-contextualizing is the other failure mode.** Everything in context costs attention, even when it's free in tokens.
7. **Start fresh when the conversation is more noise than signal.** Distill against the original, not against what you remember. The summary is only as good as what you put in it.

### Lab handoff

The lab for this module is a 60-minute exercise in context diagnosis. You'll get a deliberately messy 50-turn conversation with several documented failure modes. Your job is to diagnose three of them, propose a single-move fix for each, and measure whether the fix worked. Instructions in [the lab](./lab/).

---

## Lab design

### Lab: Diagnose and fix a messy conversation

**Goal.** Practice the "Claude forgot vs. never had it" diagnostic on a real long conversation, then fix each issue with a single, specific move. Build the reflex to ask "is this a prompt problem or a context problem?"

**Setup.** [The messy conversation page](./lab/messy-conversation) contains a 50-turn conversation depicting an early attempt at building a PR review tool in chat-only mode (before the disciplined approach the curriculum's anchor project takes from M4 onward). It's been built to contain several documented failure modes:

- Two "Claude forgot" cases (information present earlier, ignored later)
- One "Claude never had it" case (user references a file that was never pasted)
- One correction-loop case (same mistake twice despite a correction)
- One over-contextualization case (early attachment dominates later responses)
- Red herrings may be added later (responses that look wrong but are actually fine given the context)

You won't be told which is which. That's the lab.

**Exercise.**

1. **Read the conversation cold.** No notes, no diagnosis. Get the shape.
2. **Second pass with the diagnostic.** For each turn where the response feels off, stop and ask: Claude forgot, Claude never had it, or something else? Note it.
3. **Pick three to fix.** Not all of them. Three that you think are fixable with a single move.
4. **For each of the three, write:**
   - Which failure mode it is
   - The single move to fix it (restate? attach? start fresh with a summary?)
   - A one-sentence prediction of what the output should look like after the fix
5. **Run the fixes.** Paste the relevant portion of the conversation plus your fix into a new Claude conversation. Compare against your prediction.
6. **Flag any red herrings.** At the end, note which turns you think were actually fine despite looking off.

**What you'll have at the end.** Three diagnoses, three fixes, three predictions, and a comparison. Plus a calibration check: did you correctly identify any red herrings, or did you "fix" something that wasn't broken?

**Time budget.** ~60 minutes. The first pass is fast. The diagnosis pass is where the time goes. If you're spending more than 15 minutes per fix, you're over-engineering the rewrite. The point is the single move, not a perfect prompt.

**Common traps:**

- Treating every off-sounding response as a context problem. Some are fine.
- Conflating "forgot" and "never had it" and reaching for the same fix for both. The fixes are different. If your fix for a "never had it" case is to restate what's in the conversation, you didn't diagnose it.
- Fixing everything with "start fresh." Sometimes it's right. If it's your answer for all three, you're not practicing the specific moves.
- Missing the "never had it" case by scrolling within the current conversation and finding nothing contradictory. That's the point. When the model never had it, there's nothing to find. The fix is to add it, not to reword anything.

**Extension, optional.** Take one of the "Claude forgot" cases and try three different fixes: in-turn restatement, summary-then-ask, and a fresh conversation with distilled context. Compare which works best for that specific failure. Previews the iteration discipline M6 will formalize.

---

## References

- **Anthropic's long-context guidance.** Practical notes from Anthropic on how Claude handles long conversations and documents, including when to use projects. Useful for mechanical details like effective context length and attachment handling. `https://docs.claude.com/en/docs/build-with-claude/long-context-tips`
- **"Lost in the Middle" (Liu et al., 2023).** The canonical paper on attention degradation in long contexts. Finding: models attend best to the start and end of a long context, worst to the middle. Helps explain why correction-loop failures look the way they do. `https://arxiv.org/abs/2307.03172`
- **Simon Willison on context engineering.** Ongoing practitioner notes on long-context work with examples. Good counterweight to the paper-only view. `https://simonwillison.net/tags/prompt-engineering/`
- **"Needle in a haystack" benchmarks.** A family of evaluations measuring how well models retrieve specific facts from long contexts. Useful intuition-builder; less useful as a direct predictor of real-conversation performance. `https://github.com/gkamradt/LLMTest_NeedleInAHaystack`
- **Anthropic docs on projects and memory.** Product docs for the tools referenced in the module. Lookup reference, not reading material. `https://support.claude.com/`
