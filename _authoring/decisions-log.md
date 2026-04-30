# Decisions Log

Settled decisions for the curriculum. If reopening any of these, note the
reason.

## Scope and audience

- Primary audience: Adobe-internal mixed technical staff (PMs, architects,
  engineers).
- Publication: Adobe-internal primary. Each module gets a note on what
  would need swapping for external publication.
- Format: hands-on labs + concept posts per module, shipped together.
- Publication target: public GitHub Pages, not internal wiki.
- Two-repo structure under `github.com/ramboz`: curriculum repo
  (markdown + site generator, published to GitHub Pages) + separate
  pr-assistant-lab repo (sample codebase + seeded issues, clone-and-work).
- Static site generator: Docusaurus (chosen over MkDocs for post-
  publication versioning support).
- Voice samples remain internal-only calibration data. Customer names,
  JIRA IDs, internal URLs, unreleased timelines excluded from module
  prose.

## Structure

- 12 modules, 3 tiers.
- Tier 1 (M1-3) for everyone.
- Tier 2 (M4-7) engineers primary; PMs/architects get concept-post subset
  without labs.
- Tier 3 (M8-12) engineers only.
- Orchestration ceiling: goes all the way to 24h+ systems with oracles, CI
  integration, ambient agents, MCP crews.
- Two new modules inserted after harness-engineering verification pass
  (April 2026): M5 (Path-scoped instructions with Rules) and M9 (Hooks).
  Each module from old M5 onward shifted by one or two slots. Rationale
  in the "Curriculum updates" section below.

## Module structure

- Opening hook (personal moment, chat-register) → "What this module covers"
  scope-setting section (doc-register, bulleted preview) → concept
  sections → bridge to next module → TLDR → lab handoff.
- TLDR sits at the end, not the start. Ordered by importance (most
  load-bearing takeaway first), not by section order in the module.
  5-7 one-sentence takeaways.
- "What this module covers" provides a map before the content. Short
  bulleted preview of what the module teaches and what the lab asks the
  reader to do. Prevents readers from finishing the module before knowing
  what to expect from it.

## Anchor project

- PR Assistant, not CWV Workbench (CWV too niche for mixed audience).
- Not morning brief (subjective oracle; doesn't scale through modules).
- Anchor enters M4 onward as the working example. PR Assistant may appear in M1-3 labs as an illustrative failure case or negative example, but is not the module's primary teaching vehicle and is not built toward in those modules.
- End state: deployable GitHub Action that reviews PRs and iterates fixes.
- Sample codebase lives in a separate pr-assistant-lab repo.

## Recurring worked example

- cwv-agent (`github.com/ramboz/cwv-agent`) is the recurring worked
  example, not the anchor. One or two touchpoints per module maximum.
- Modules without a natural fit skip the cwv-agent reference entirely.
  No forced symmetry.
- Per-module PRs to cwv-agent applying the module's learnings are
  nice-to-have, not required. Link when they exist.
- Touchpoint purpose: grounds the module in real shipped code the reader
  can inspect, without letting cwv-agent take over from the teaching
  frame.

## Lab framing

- Labs are self-paced. No submission, no review.
- Lab documents frame exercises as "work through this to build the habit,"
  not "complete this exercise and submit."
- Optional worksheet templates for note-taking are fine. Not required
  artifacts.
- No answer keys for lab prompts. Would collapse the exercise — learners
  would anchor to the reference rather than produce their own rewrite.
  If learners bounce off without guidance in practice, revisit.

## Authorship model

- Spiral: Julien learns each module before writing it.
- 30-40% of prose stays with Julien, concentrated on authenticity-
  load-bearing parts (openings, hard parts, failure anecdotes, voice pass).
- 60-70% produced by Claude (scaffolding, commodity prose, references,
  examples, lab design).

## Meta-project

- Curriculum authoring tool itself becomes a dog-food artifact.
- First 4 modules hand-authored with no meta-crew. Crew introduced from M5
  onward.
- Meta-crew composition (working): reference librarian, lab validator,
  consistency checker, publishing agent, prose reviewer.
- Explicitly NOT included in meta-crew: module author. Authoring stays with
  Julien.
- Meta-crew becomes part of curriculum narrative ("this module's labs were
  validated by an agent built using M6's oracle pattern").
- Publishing agent replaces earlier wiki-MCP concept: GitHub Action on
  push-to-main builds Docusaurus site and pushes to gh-pages branch.

## Infrastructure staging

- Start in Claude Projects.
- Migrate to Claude Code + GitHub repo around M4 — itself becomes a
  teaching moment in M4.
- Voice calibration uses 5 wiki pages + 3 Slack threads. No further samples
  needed.

## Things explicitly dropped

- CWV Workbench as anchor (too niche for mixed audience; cwv-agent instead
  used as recurring worked example, not anchor)
- Morning brief as anchor (subjective oracle doesn't scale through modules)
- Starting in Claude Code before having content (procrastination risk)
- "Module author" role in meta-crew (preserves authorship authenticity)
- Additional voice samples beyond the 5+3 we have (sufficient signal)
- Internal wiki as publication target (replaced by public GitHub Pages)
- Per-module external-publication variants (write once for public, add
  internal sidebars where relevant)
- MkDocs Material (replaced by Docusaurus for versioning support)
- Answer keys for lab prompts (would collapse the exercise)
- Lab submission/review framing (labs are self-paced)
- TLDR at start of module (competes with opening hook for attention)
- Auto-memory (`~/.claude/projects/<project>/memory/`) as a taught primitive.
  Real Claude Code feature since v2.1.59 but stabilizing; coverage deferred.
  M2's memory paragraph narrowed to Claude.com chat memory specifically
  rather than rewritten to forward-point at a future module that isn't on
  the roadmap.

## Curriculum updates

### Harness-engineering verification pass (April 2026)

Cross-checked a colleague's "harness engineering" blog post against the
curriculum and `code.claude.com/docs/en/`. Two structural inserts and one
expansion came out of it:

- **New M5: Path-scoped instructions with Rules.** Covers `.claude/rules/`
  with `paths:` glob frontmatter. Sits right after M4 because it's the
  natural answer to "my CLAUDE.md is getting too big." Explicit contrast
  with M6 skills (always-on file-path scope vs on-demand invocation
  scope) is load-bearing pedagogy — the boundary is easy to mix up since
  both primitives can carry `paths:` frontmatter.
- **New M9: Hooks.** Lands after M8 Headless because hooks earn their keep
  when Claude runs unattended; teaching them earlier would land flat. The
  meta-judge pattern (Stop hook spawns reviewer that uses M7's oracle to
  grade, retries below threshold) presupposes both M7 and M8.
- **M6 (was M5) expanded** to cover skills alongside sub-agents. Skills
  and `.claude/commands/` were merged in the docs; the curriculum reflects
  that. Sub-agent vs skill is the key decision the module teaches.

Choices recorded so future-you can trace the why:

- The blog claimed "hooks fire shell commands at three lifecycle points" —
  there are 29. Curriculum coverage of hooks lists the real surface even
  if only a handful get taught in depth.
- Slash commands as a separate primitive: out of date. Curriculum teaches
  skills as the primary unit and notes `.claude/commands/` as compat shim.
- Plugins: not in scope. Packaging, not pedagogy. One-line callout in M12
  if multi-team distribution becomes a real case.