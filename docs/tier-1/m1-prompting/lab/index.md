---
title: Lab 1 — Rewrite 5 bad prompts, three ways each
description: Self-paced 90-minute exercise for Module 1. Diagnose and fix five deliberately bad prompts along three axes, predict before running, compare.
sidebar_label: Lab
pagination_label: M1 Lab — Prompting
---

# Lab 1 — Rewrite 5 bad prompts, three ways each

[Module 1](../) lab. ~90 minutes. Self-paced. No submission, no review.

The point of this lab is to build the diagnostic move from the concept post. You take five deliberately bad prompts, rewrite each three ways along three fixed axes, predict which version wins before running, then run and compare. The prediction step is most of the value: it surfaces what you didn't specify.

## Before you start

- **Time:** ~90 minutes total. ~15-20 minutes per prompt. If you're at three hours, you're polishing rather than practicing. Stop and move on.
- **Prerequisites:** Module 1 concept post finished, especially the "What a spec-style prompt contains," "Common failure modes," and "Predict before you run" sections.
- **What you'll work on:** Five deliberately bad prompts at [the bad-prompts page](./bad-prompts). Each is a real shape that shows up in practice: vague topic, missing format, no audience, underspecified task, over-broad help request.

## Setup

1. Open [the bad-prompts page](./bad-prompts) in one tab.
2. Open a Claude chat in another tab. Any plan, no special setup.
3. Optional: copy [the worksheet](./worksheet) into a scratch file if you want a template for capturing your rewrites and predictions. Use it or don't. The structure is a suggestion.

## The exercise

For each of the 5 prompts, work through the four steps below before moving to the next prompt.

### Step 1: Rewrite three ways

Produce three rewrites along three fixed axes:

1. **Specification rewrite.** Add constraints, audience, length, format. The four components from the concept post. Don't add examples or restructure the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2 examples of what good output looks like. The "show don't tell" variant.
3. **Decomposition rewrite.** Break the task into steps. Ask the model to plan first, then execute. Good for anything where the task has dependencies (i.e. "summarize then rank" rather than "give me the top 3").

### Step 2: Predict before running

For each prompt, write down:

- Which rewrite you expect to produce the best output
- One sentence describing what "best" means for that prompt
- What you expect the other two rewrites to get wrong

### Step 3: Run each rewrite twice

All three rewrites, each one twice. The same prompt run twice produces different outputs; you need the spread to know whether a "winning" rewrite actually won or whether you saw run-to-run variance. The noise-floor discussion in the concept post is why two runs, not one.

### Step 4: Compare against your prediction

Note where your prediction held and where it didn't. The mismatches are where the diagnostic skill grows fastest.

## What you'll have at the end

For each of the 5 prompts:

- Three rewrites
- Your prediction
- Actual outputs (two runs each)
- A sense of whether your prediction held

Keep the notes somewhere you can come back to. You'll want to compare against yourself in [Module 2](../../m2-context/), where the same prompts get longer conversations around them.

## Common traps

- **Making the "specification rewrite" so long it's actually three rewrites in one.** Keep it to the one axis.
- **Running each rewrite once.** The noise-floor discussion in the post is why you run each twice.
- **Skipping the prediction step because it feels silly.** The prediction is most of the value.

## When you're done

You should have notes you can reread in a month and recognize the pattern. The point isn't the rewrites; it's noticing the gap between what you specified and what you got, before you hit send.

That noticing carries directly into [Module 2](../../m2-context/), where the same diagnostic move applies at the scale of a multi-turn conversation rather than a single prompt.

## Extension, optional

Take the winning rewrite from each of the 5 and see if you can shorten it by 30% without degrading the output. That's the over-specification test from the concept post, applied.
