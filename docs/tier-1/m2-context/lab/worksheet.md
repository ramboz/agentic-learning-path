---
title: Worksheet (M2 lab artifact)
description: Optional note-taking template for the Module 2 lab.
unlisted: true
---

# Worksheet — Module 2 lab

Optional. Copy this file, rename it (e.g., `worksheet-2026-04-24.md`), and fill it in as you work through the lab. If you'd rather use your own notes format, ignore this.

---

## Step 1: Cold read

**Date/time:** _____

**First impressions after reading the conversation without diagnosing:**

- What's the developer trying to build?
  _____

- How does the conversation feel as it progresses? Where (roughly) does it start to feel off?
  _____

- Any initial gut calls on what's going wrong? (Don't verify yet — just record the instinct.)
  _____

---

## Step 2: Diagnostic pass

For each turn where the model's response feels off, note the turn number, what you think is wrong, and an initial failure-type guess. Don't limit yourself to a specific count. Some off-sounding turns will turn out to be fine.

| Turn | What looks off | Initial diagnosis | Evidence (scroll-back result) |
|---|---|---|---|
|   |   |   |   |
|   |   |   |   |
|   |   |   |   |
|   |   |   |   |
|   |   |   |   |
|   |   |   |   |

Diagnosis key: `forgot` | `never had it` | `correction loop` | `over-contextualization` | `actually fine` | `unsure`

---

## Step 3: Pick three to fix

Pick a mix of failure types rather than three of the same kind.

### Fix 1

- **Turn:** _____
- **What's wrong (one line):** _____
- **Failure type:** _____
- **Single-move fix:** _____
- **Prediction (one sentence — what should the output look like after the fix?):**
  _____

### Fix 2

- **Turn:** _____
- **What's wrong (one line):** _____
- **Failure type:** _____
- **Single-move fix:** _____
- **Prediction:**
  _____

### Fix 3

- **Turn:** _____
- **What's wrong (one line):** _____
- **Failure type:** _____
- **Single-move fix:** _____
- **Prediction:**
  _____

---

## Step 4: Run the fixes

For each fix, run it in a new Claude conversation and compare against your prediction.

### Fix 1 — result

- **Prediction held?** yes / partially / no
- **What the output actually did:**
  _____
- **If the prediction missed: what did you miss about the diagnosis?**
  _____

### Fix 2 — result

- **Prediction held?** yes / partially / no
- **What the output actually did:**
  _____
- **If the prediction missed: what did you miss about the diagnosis?**
  _____

### Fix 3 — result

- **Prediction held?** yes / partially / no
- **What the output actually did:**
  _____
- **If the prediction missed: what did you miss about the diagnosis?**
  _____

---

## Step 5: Calibration check

Looking back at your Step 2 notes: which turns did you initially flag as off that you now think were actually fine given the context?

- Turn _____: actually fine because _____
- Turn _____: actually fine because _____

Any turns you didn't flag initially but now think were off?

- Turn _____: missed because _____

---

## Takeaways

Two or three sentences on what you noticed. Examples of useful observations:

- The failure type you found hardest to diagnose and why
- A fix that worked better than you expected, or worse
- A pattern from this lab you expect to see in your own real conversations

_____

---

## If you did the extension

Three fixes for a single "Claude forgot" case:

| Approach | How it performed | When you'd reach for it |
|---|---|---|
| In-turn restatement |   |   |
| Summary-then-ask |   |   |
| Fresh conversation with distilled context |   |   |

Which one worked best for this specific failure, and what does that suggest about when each approach is the right move?

_____