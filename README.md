# Agentic Learning Path

A 10-module learning curriculum on Claude and Claude Code, progressing from
single-Claude prompting to multi-agent orchestration. Primary audience is mixed technical staff (PMs, architects, engineers).

## Status

Work in progress.

## Repository layout

```
agentic-learning-path/
├── modules/        # concept posts, one per module
├── labs/           # hands-on labs, grouped by module
└── chat-history/   # Claude Chat transcripts from the authoring sessions
```

## Modules

Three tiers, 10 modules. The anchor project from Module 4 onward is a PR
Assistant. Modules 1-3 use throwaway examples.

| Tier | Module | Concept Post | Lab |
|------|--------|--------------|-----|
| 1 — Working with a single Claude | M1: Prompting as a design problem, not a phrasing trick | [post](modules/module-1-prompting-as-specification.md) | [lab](labs/module-1/) |
| 1 | M2: Context is the product | [post](modules/module-2-context-is-the-product.md) | [lab](labs/module-2/) |
| 1 | M3: From chat to Claude Code | — | — |
| 2 — Session management and single-agent discipline | M4: Writing a CLAUDE.md that earns its keep | — | — |
| 2 | M5: Sub-agents, one-session orchestration, and tool scoping | — | — |
| 2 | M6: The oracle problem | — | — |
| 3 — Orchestration and crews | M7: Headless mode and the Ralph loop | — | — |
| 3 | M8: Parallel workers, worktrees, and racing hypotheses | — | — |
| 3 | M9: Agent Teams and the manager-worker mental model | — | — |
| 3 | M10: Crews, MCP, and knowing when you've over-engineered | — | — |
