# Agentic Learning Path

A 12-module curriculum on Claude and Claude Code, from prompts to crews.
Concept posts and hands-on labs ship together. Published as a Docusaurus
site to GitHub Pages.

**Read it at:** https://ramboz.github.io/agentic-learning-path/

## Status

Work in progress. M1-M3 drafted; M4 in draft; M5-M10 stubbed with the
canonical outline.

## Audience

Mixed technical staff (PMs, architects, engineers). Tier 1 (M1-M3) is
for everyone. Tier 2 (M4-M6) is engineer-track for labs, concept-only
for PMs and architects. Tier 3 (M7-M10) is engineer-only.

The anchor project from M4 onward is **PR Assistant**, a code-review
crew that grows into a GitHub Action with a Ralph loop and MCP
integration. The sample codebase lives in a separate repo:
[ramboz/pr-assistant-lab](https://github.com/ramboz/pr-assistant-lab).
M1-M3 use throwaway examples; the M3 sample (a tiny `md2html` CLI)
lives in [`samples/m3-claude-code/`](samples/m3-claude-code/) here.

## Modules

| Tier | Module |
|---|---|
| 1 — Working with a single Claude | [M1: Prompting as a design problem](docs/tier-1/m1-prompting/index.md) |
| 1 | [M2: Context is the product](docs/tier-1/m2-context/index.md) |
| 1 | [M3: From chat to Claude Code](docs/tier-1/m3-claude-code/index.md) |
| 2 — Persistence, decomposition, and quality signal | [M4: Writing a CLAUDE.md that earns its keep](docs/tier-2/m4-claude-md/index.md) |
| 2 | [M5: Path-scoped instructions with Rules](docs/tier-2/m5-rules/index.md) (stub) |
| 2 | [M6: Sub-agents and Skills](docs/tier-2/m6-subagents-skills/index.md) (stub) |
| 2 | [M7: The oracle problem](docs/tier-2/m7-oracle/index.md) (stub) |
| 3 — Orchestration & crews | [M8: Headless mode and the Ralph loop](docs/tier-3/m8-headless/index.md) (stub) |
| 3 | [M9: Hooks](docs/tier-3/m9-hooks/index.md) (stub) |
| 3 | [M10: Parallel workers, worktrees, and racing hypotheses](docs/tier-3/m10-parallel/index.md) (stub) |
| 3 | [M11: Agent Teams and the manager-worker mental model](docs/tier-3/m11-teams/index.md) (stub) |
| 3 | [M12: Crews, MCP, and knowing when you've over-engineered](docs/tier-3/m12-crews/index.md) (stub) |

## Run the site locally

Requires Node.js (version pinned in `.nvmrc`).

```
npm install
npm start
```

Opens the site at http://localhost:3000/agentic-learning-path/.

To build the static site:

```
npm run build
```

Output lands in `build/`. The deploy workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs the
same build on push to `main` and publishes to the `gh-pages` branch.

## Repository layout

```
agentic-learning-path/
├── docs/                     # published curriculum source (Docusaurus reads here)
│   ├── intro.md              # site landing page
│   ├── tier-1/m{1,2,3}-*/    # foundations modules + labs
│   ├── tier-2/m{4,5,6}-*/    # session-management modules
│   └── tier-3/m{7..10}-*/    # orchestration modules
├── samples/m3-claude-code/   # M3 lab sample (tiny md2html CLI)
├── _authoring/               # authoring source material (voice notes, decisions, outline) — not published
├── .claude/                  # working instructions for Claude sessions — not published
├── docusaurus.config.ts      # site config (title, URL, presets)
├── sidebars.ts               # explicit sidebar grouping by tier
├── CLAUDE.md                 # navigation index for authoring agents
└── .github/workflows/        # deploy on push to main
```

## Authoring this curriculum

If you're contributing as an author or as a Claude agent helping the
author, start at [`CLAUDE.md`](CLAUDE.md). It's the navigation index
for the authoring side of the repo and points to the detailed working
instructions in `.claude/` and the source material in `_authoring/`.

## License

To be decided before first publish.
