---
title: M10 — Parallel workers, worktrees, and racing hypotheses
description: Multiple Claude Code processes, git worktrees, one-agent-one-file discipline, and when parallelism hurts. Coming soon.
pagination_label: M10 — Parallel workers
---

# Module 10 — Parallel workers, worktrees, and racing hypotheses

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

When one agent's progress isn't enough, run several. Git worktrees keep parallel attempts from stepping on each other's edits. The one-agent-one-file discipline keeps merges sane. The honest counterpoint: parallelism often hurts more than it helps when the bottleneck isn't compute but specification quality.

The lab races four fix strategies in separate worktrees, scores each with M7's oracle, and keeps the highest-scoring branch.
