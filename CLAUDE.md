# Agentic Learning Path — Authoring Context

This repo is a curriculum on Claude and Claude Code: ten modules across
three tiers, published via Docusaurus. The author (Julien) writes each
module on a spiral schedule — learning the material, drafting in
collaboration with Claude, keeping 30-40% of the prose authentic to his
own voice on the load-bearing parts (openings, hard parts, failure
anecdotes), letting Claude scaffold the rest.

This file is the navigation index for Claude sessions. Detailed
instructions live in `.claude/`. Source material lives in `_authoring/`.

## How to pick up work

| If you're... | Read first |
|---|---|
| Drafting a new module | `.claude/authoring-workflow.md`, then `_authoring/curriculum-outline.md` for what the module covers |
| Editing prose voice | `.claude/voice-rules.md`, then `_authoring/voice-notes.md` for the full source |
| Structuring a module | `.claude/module-structure.md` |
| Looking up a settled decision | `_authoring/decisions-log.md` |
| Tracing the why behind a decision | `_authoring/chat-history/` |

## Where things live

| Concept | Path |
|---|---|
| Published site source | `docs/` |
| Site landing page | `docs/intro.md` (renders at site root) |
| Tier 1 (everyone, M1-M3) | `docs/tier-1/m{1,2,3}-*/` |
| Tier 2 (engineers + concept-only PMs/architects, M4-M6) | `docs/tier-2/m{4,5,6}-*/` |
| Tier 3 (engineers, M7-M10) | `docs/tier-3/m{7,8,9,10}-*/` |
| Concept page per module | `docs/.../<slug>/index.md` |
| Lab handoff per module | `docs/.../<slug>/lab/index.md` |
| Lab artifacts (worksheets, etc.) | `docs/.../<slug>/lab/*.md` with `unlisted: true` |
| Code samples paired with labs | `samples/<slug>/` (peer to `docs/`, outside the published build) |
| Authoring source material | `_authoring/` |
| Working instructions for Claude | `.claude/` |
| Site config | `docusaurus.config.ts`, `sidebars.ts` |
| Deploy workflow | `.github/workflows/deploy.yml` (push to main → gh-pages branch) |

## Conventions

- Module slug pattern: `m<N>-<short-keyword>` (e.g., `m1-prompting`, `m4-claude-md`).
- Each module has a flat `index.md` for the concept and a nested `lab/index.md` for the lab handoff. Lab artifacts sit in `lab/` with `unlisted: true` so they're URL-accessible but absent from the sidebar.
- Front-matter on every page: `title` (sidebar/breadcrumb label) and `description` (search/social preview). `unlisted: true` on lab artifacts.
- Cross-module links use Docusaurus relative paths (`../m2-context/`, `../../tier-2/m4-claude-md/`), never the legacy `module-N-...md` form.
- `_authoring/` is internal-only. Nothing in it gets published. If something needs to reach learners, it goes in `docs/`.
- Voice rules are non-optional. Read `.claude/voice-rules.md` before drafting. The hardest one to internalize: no em dashes.

## See also

- [README.md](README.md) — public-facing repo doc (how to run locally, where modules live)
- [.claude/authoring-workflow.md](.claude/authoring-workflow.md) — the spiral pattern, what stays Julien's, what Claude scaffolds
- [.claude/voice-rules.md](.claude/voice-rules.md) — load-bearing voice rules summary
- [.claude/module-structure.md](.claude/module-structure.md) — the canonical module shape
- [_authoring/README.md](_authoring/README.md) — index of source material
