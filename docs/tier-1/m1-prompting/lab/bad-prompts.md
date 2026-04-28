---
title: Bad prompts (M1 lab artifact)
description: Five deliberately bad prompts to rewrite as part of the Module 1 lab.
unlisted: true
---

# Five bad prompts

Five deliberately bad prompts for Module 1's lab. Each one is a real shape
of prompt that shows up in practice. Your job is to rewrite each along
three axes, predict which rewrite wins, then run and compare. Full
instructions are in the module concept post.

Some prompts are bad in more than one way, but there's usually a dominant
failure mode. Before rewriting, it helps to name what's missing.

The five failure modes from the module's table:

- **Vague topic** (stated as a subject, not as "what done looks like")
- **Missing format** (task is clear, output shape isn't)
- **No audience** (depth and tone are underspecified)
- **Underspecified task** (action is clear, goal isn't)
- **Over-broad help request** (scope is wide open)

Each of the 5 prompts below maps to one of these, roughly. Try to name
which before you start rewriting.

---

## Prompt 1

> Write something interesting about machine learning.

## Prompt 2

> Give me a summary of the attached quarterly report.
>
> *[pretend a report PDF is attached]*

## Prompt 3

> Look at my essay below and make it better.
>
> *[pretend an essay is pasted in here. Use any ~500-word piece you've
> written recently: an email, a wiki page, a design doc]*

## Prompt 4

> Explain how OAuth 2.0 works.

## Prompt 5

> Help me plan my week.

---

## How to work through these

For each prompt, the three rewrite axes are:

1. **Specification rewrite.** Add constraints, audience, length, format.
   The four components from the module. Don't add examples or restructure
   the task. Just specify what was missing.
2. **Example rewrite.** Keep the original mostly intact, but include 1-2
   examples of what good output looks like.
3. **Decomposition rewrite.** Break the task into ordered steps. Ask the
   model to plan first, then execute.

Predict which axis wins for each prompt before running. Run each rewrite
twice (for the noise floor). Compare outputs. Note where your prediction
held and where it didn't.

Full lab instructions are in the Module 1 concept post under "Lab design."
The `worksheet.md` file in this directory has an optional template if you
want a structure for your notes.
