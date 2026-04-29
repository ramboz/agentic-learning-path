---
title: M6 — The oracle problem
description: Conceptual hinge of the curriculum. Types of oracles, why composite objective oracles beat subjective ones, and noise handling. Coming soon.
pagination_label: M6 — Oracle problem
---

# Module 6 — The oracle problem

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

This module is the conceptual hinge of the curriculum. The question every long-running agent has to answer: how does it know whether what it just did was good? Subjective oracles (asking another LLM) collapse under iteration. Objective ones (CI, lint, tests, seeded-issue detection) compound.

The lab builds `./oracle.sh <pr-branch>` — a composite score from CI plus lint plus coverage plus seeded-issue detection. The artifact gets reused across every downstream module.

Strong candidate for publishing first, out of order. See the open structural questions in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).
