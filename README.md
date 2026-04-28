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

Three tiers, 10 modules.

- **Tier 1 (M1-3)** is for everyone — PMs, architects, engineers — and includes hands-on labs.
- **Tiers 2-3 (M4-10)** are engineer-only on the lab track. PMs and architects continue as concept-only readers through M6 (end of Tier 2).
- The **PR Assistant** anchor project picks up at M4 and runs through M10. Modules 1-3 use throwaway examples.

| Tier | Module | Concept Post | Lab |
|------|--------|--------------|-----|
| 1 — Working with a single Claude | M1: Prompting as a design problem, not a phrasing trick | [post](modules/module-1-prompting-as-specification.md) | [lab](labs/module-1/) |
| 1 — Working with a single Claude | M2: Context is the product | [post](modules/module-2-context-is-the-product.md) | [lab](labs/module-2/) |
| 1 — Working with a single Claude | M3: From chat to Claude Code | [post](modules/module-3-claude-code.md) | [lab](labs/module-3/) |
| 2 — Session management and single-agent discipline | M4: Writing a CLAUDE.md that earns its keep | — | — |
| 2 — Session management and single-agent discipline | M5: Sub-agents, one-session orchestration, and tool scoping | — | — |
| 2 — Session management and single-agent discipline | M6: The oracle problem | — | — |
| 3 — Orchestration and crews | M7: Headless mode and the Ralph loop | — | — |
| 3 — Orchestration and crews | M8: Parallel workers, worktrees, and racing hypotheses | — | — |
| 3 — Orchestration and crews | M9: Agent Teams and the manager-worker mental model | — | — |
| 3 — Orchestration and crews | M10: Crews, MCP, and knowing when you've over-engineered | — | — |
