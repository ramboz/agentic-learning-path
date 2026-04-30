---
title: M6 — Sub-agents and Skills
description: Built-in Explore/Plan/General-Purpose sub-agents, custom sub-agents and skills as markdown files, scoped tool permissions, and the sub-agent vs skill decision. Coming soon.
pagination_label: M6 — Sub-agents and Skills
---

# Module 6 — Sub-agents and Skills

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

When this module lands, it covers the move from a single Claude doing everything to a single Claude orchestrating sub-agents and reaching for skills. Built-in sub-agents (Explore, Plan, General-Purpose), custom sub-agents written as markdown files, skills (`.claude/skills/SKILL.md`) for reusable workflows and on-demand knowledge, and the sub-agent vs skill decision: skill = prompt loaded on demand into the main conversation; sub-agent = work in its own context, returns a summary. Slash commands covered as the compatibility shim that's been merged into skills.

The lab decomposes the curriculum's anchor project — PR Assistant — into three persona sub-agents (security, performance, readability) coordinated from one session, and pulls recurring patterns into skills (`/pr-summary`, `/explain-code`).

Until then, the [`_authoring/`](https://github.com/ramboz/agentic-learning-path/tree/main/_authoring) directory has the in-progress thinking.
