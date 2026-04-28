# Authoring context

Internal-only authoring artifacts. In version control, but outside the
Docusaurus build (this directory lives at the repo root, peer to `docs/`,
so the published site never sees it).

The split between this directory and `.claude/` is deliberate:

- `_authoring/` holds the **source** material: full voice notes, the
  complete decisions log, the canonical 10-module outline, raw
  scaffolding chats.
- `.claude/` holds **working instructions** Claude reads at session
  start: tighter summaries that point back here for detail.

If a Claude session needs the load-bearing rule, it reads `.claude/`.
If it needs the reasoning behind the rule, it reads here.

## What's in this directory

| File | Purpose |
|---|---|
| `voice-notes.md` | Full voice calibration. Structural habits, sentence shape, register split, vocabulary tics, what to avoid. The `.claude/voice-rules.md` summary points here for detail. |
| `voice-samples-wiki.md` | Five Adobe-internal wiki pages authored by Julien. Source material for **doc-register** pattern-matching when drafting structured curriculum content (concept sections, failure-mode tables, step-by-step labs). |
| `voice-samples-slack.md` | Three Adobe-internal Slack threads where Julien was active. Source material for **chat-register** pattern-matching when drafting openings, transitions, "what bit me" anecdotes, and bridges. |
| `decisions-log.md` | Every settled curriculum decision. Anchor project, tier shape, authorship model, infrastructure staging, things explicitly dropped. Reopen any decision only with a noted reason. |
| `curriculum-outline.md` | The canonical 10-module outline. Module titles, lab descriptions, recommended slice ordering. Open structural questions live at the bottom. Stub modules in `docs/` link here. |
| `chat-history/` | Raw scaffolding conversations. `project-scaffolding.md` covers overall structure; `module-{1,2,3,4}-scaffolding.md` cover per-module drafting. Useful for tracing back to *why* a decision landed where it did. |

## What does NOT belong here

- Anything published to learners (that's `docs/`)
- Anything Claude needs at session start (that's `.claude/`)
- Anything code-related, including the M3 sample (that's `samples/`)
- Drafts of modules in progress (those go in `docs/` with `draft: true`
  or as stubs)
