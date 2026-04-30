---
title: M5 — Path-scoped instructions with Rules
description: When CLAUDE.md gets too big, you scope it. .claude/rules/ with paths glob frontmatter, and the contrast with skills (always-on file-path scope vs on-demand invocation scope). Coming soon.
pagination_label: M5 — Path-scoped Rules
---

# Module 5 — Path-scoped instructions with Rules

**Status:** Coming soon. Outline in [`_authoring/curriculum-outline.md`](https://github.com/ramboz/agentic-learning-path/blob/main/_authoring/curriculum-outline.md).

When CLAUDE.md grows past the point where loading it into every session feels free, you scope it. `.claude/rules/` holds smaller markdown files, each with an optional `paths:` glob frontmatter that loads the rule only when Claude reads matching files. Same file-based state principle as CLAUDE.md, with surgical scoping. The module also draws an explicit contrast with M6 skills (always-on file-path scope vs on-demand invocation scope) since the boundary is easy to mix up: both primitives can carry `paths:` frontmatter, but they trigger differently.

The lab refactors the M4 CLAUDE.md into `.claude/rules/` files. Path-scoped rules for `src/api`, tests, and docs show how a `paths:` rule loads only when Claude touches matching files.
