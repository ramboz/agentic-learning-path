---
title: M9 — Hooks
description: Guardrails for unattended runs. The full hook surface, then deep dive on PreToolUse, PostToolUse, SubagentStop, and InstructionsLoaded. Meta-judge pattern as the worked example. Coming soon.
pagination_label: M9 — Hooks
---

# Module 9 — Hooks

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

Hooks earn their keep when Claude runs unattended; they're tedious overhead while you're watching every action. This module covers the full hook surface (29+ events at the time of writing), then drills into the load-bearing four for most users: `PreToolUse`, `PostToolUse`, `SubagentStop`, and `InstructionsLoaded`. The worked example is the meta-judge pattern: a Stop hook spawns a reviewer that uses M7's oracle to grade the previous turn, and triggers a retry below threshold. It presupposes both M7 and M8.

The lab adds hooks to make the M8 Ralph loop safe. `PreToolUse(Bash)` validates commands; `Stop` spawns the meta-judge.
