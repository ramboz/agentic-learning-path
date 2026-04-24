# Lab — Module 2: Diagnose and fix a messy conversation

**Module:** 2 — Context is the product
**Time budget:** ~60 minutes
**Prerequisites:** Finished reading Module 2 (at least through the "Claude forgot vs. Claude never had it" section)
**Submission:** None. This is self-paced.

---

## What this lab is

You're handed a deliberately messy 50-turn conversation. Your job is to diagnose what went wrong at specific points, pick three issues you think are fixable with a single move each, and test whether your fixes actually work.

The conversation is an early, failed attempt at building a PR review tool. The same project shows up properly in Module 4 onward. This version is what that attempt looks like when someone tries to do it in a single long chat with no CLAUDE.md, no project files, no discipline.

The failures in the conversation are planted. They include:

- Two "Claude forgot" cases (information established early in the conversation, then ignored later)
- One "Claude never had it" case (the user references a file they never actually pasted)
- One correction-loop case (the same mistake repeats despite an explicit correction)
- One over-contextualization case (an early document paste warps the conversation's baseline)

You won't be told which turns contain which failures. That's the point.

## What you need

- `messy-conversation.md` — the 50-turn conversation to diagnose
- A Claude chat open in a browser tab (any plan, no special setup)
- `worksheet.md` in this folder, if you want a template for notes (optional)

## The exercise

### Step 1: Read cold

Read the full conversation without trying to diagnose anything. Just get the shape. What's the developer trying to build? How does the conversation feel as it progresses?

Time: ~10 minutes.

### Step 2: Diagnose

Second pass. For each turn where the model's response feels off, stop and ask yourself:

- Is this Claude forgetting something that was said earlier? (Look for it in the conversation. If you find it, forgot.)
- Is this Claude confidently answering something it doesn't have the grounding for? (Look for the source. If there's nothing to find, never had it.)
- Is this something else — bad prompting, honest ambiguity, or a response that's actually fine?

Note the turn number and your initial diagnosis for each off-sounding turn. Some responses will look off on first read but turn out to be fine given the context. Don't force every odd-looking response into one of the failure buckets.

Time: ~20 minutes.

### Step 3: Pick three to fix

Not all of them. Three that you think are fixable with a single move. Prefer a mix of failure types over three instances of the same type.

For each of the three, write down:

- **Turn number** and a one-line description of what's wrong
- **Failure type** (Claude forgot, Claude never had it, correction loop, over-contextualization)
- **Single-move fix** (restate, attach, start fresh with a summary, etc.)
- **Prediction**: one sentence describing what the output should look like after the fix

Time: ~10 minutes.

### Step 4: Run the fixes

For each of the three:

1. Open a new Claude conversation.
2. Paste enough of the messy conversation to set up the context for your fix. Typically this means the first few turns of setup plus the turn where the failure shows up. You don't need to paste all 50 turns.
3. Apply your fix (restated decision, added file, distilled summary, whatever your diagnosis called for).
4. Ask the question that originally failed.
5. Compare the response against your prediction.

Time: ~15 minutes.

### Step 5: Calibration check

Look back at your diagnosis notes from Step 2. Were there any turns you initially flagged as off that you now think were actually fine given the context? Note those. That's your red-herring calibration.

Time: ~5 minutes.

## What you'll have at the end

- Three diagnoses, with the failure type for each
- Three fixes, with predictions
- Three comparisons: did the fix produce roughly what you predicted?
- A list of any off-sounding turns you decided were actually fine

No submission. The artifact is for you.

## Common traps

- **Treating every off-sounding response as a context problem.** Some are fine. Some are just bad prompts. Some are honest ambiguity that the model handles reasonably.
- **Conflating "forgot" and "never had it."** The fixes are opposite. If your fix for a "never had it" case is to restate something that's in the conversation, you didn't diagnose it.
- **Fixing everything with "start fresh."** Sometimes that's right. If it's your answer for all three of your fixes, you're not practicing the specific moves the diagnostic is meant to build.
- **Missing "never had it" by scrolling the conversation and finding nothing.** That's what "never had it" looks like. The absence is the signal. The fix is to add the missing information, not to reword anything.
- **Polishing fix prompts.** The point is the single diagnostic move, not a maximally clever rewrite. If you're spending 15+ minutes on one fix, you're over-engineering.

## Extension, optional

Take one of the "Claude forgot" cases and try three different fixes:

1. In-turn restatement (restate the forgotten information in the same prompt that asks the next question)
2. Summary-then-ask (one turn that summarizes all relevant decisions, followed by a separate turn with the question)
3. Fresh conversation with distilled context (new conversation, seeded with a concise summary of what's been established)

Compare which works best for that specific failure. Previews the iteration discipline Module 6 will formalize.

## When you're done

Close the lab. Move to Module 3. No checkpoint, no submission, nothing blocking.

If a diagnosis feels wrong or a fix doesn't work the way you expected, that's useful information, not a failure. Long conversations are genuinely hard to diagnose. The point of this lab is to build the reflex, not to nail every case on the first pass.