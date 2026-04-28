---
title: M7 — Headless mode and the Ralph loop
description: First module where Claude runs without a human watching. claude -p, structured output, budget controls, agentic laziness. Coming soon.
---

# Module 7 — Headless mode and the Ralph loop

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

The first module where Claude runs without a human watching. `claude -p` for one-shot scripted invocations, structured output for downstream parsing, budget controls so a runaway loop doesn't run up the bill, and the Ralph loop pattern itself: a dumb outer loop that calls a smart agent until an oracle says "done."

The lab wraps PR Assistant in a Ralph loop, runs it overnight, and inspects the result in the morning. Builds directly on M6's oracle.
