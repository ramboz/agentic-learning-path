# Authoring workflow

How modules get drafted in this repo. Source: `_authoring/decisions-log.md`
("Authorship model" section).

## The spiral

Julien learns each module's material before writing it. The curriculum
is not a survey of what he already knows; it's a deliberate sequence
that requires fresh learning at each step. Drafting comes after the
learning, not as a substitute for it.

This means: when picking up a new module, expect the source materials
in `_authoring/curriculum-outline.md` to outline the topic, but not to
contain the full answer. The drafting process is partly Julien's
absorption of the topic, captured on the page.

## Prose split: 30-40% Julien, 60-70% Claude

The split isn't even, and it isn't supposed to be. Specific parts stay
Julien's voice and authorship; the rest is delegated.

**Julien writes (or rewrites for voice):**

- The opening hook of every module. Personal moment, chat-register,
  signals tone.
- The hard parts — wherever the explanation requires lived experience
  or a judgment call the model can't fake.
- Failure anecdotes. Specific: which repo, which decision, what bit.
- The final voice pass on everything else. Even when Claude wrote the
  paragraph, the voice has to sound like Julien before it ships.

**Claude scaffolds:**

- Section structure and outlines.
- Commodity prose: definitions, mechanical descriptions, reference
  notes, transitions.
- Reference lists, citations, links to source material.
- Lab designs: exercises, worksheets, common-traps lists.
- Tables of failure modes and fixes.
- TLDR sections (Julien edits to taste).

## Drafting protocol per module

1. Read `_authoring/curriculum-outline.md` for the module's intended
   scope. Note the lab description.
2. Read the existing module-N-scaffolding.md in `_authoring/chat-history/`
   if it exists. That's the raw thinking that fed the outline.
3. Stub the module's section structure following
   `.claude/module-structure.md`.
4. Draft section-by-section. Junior parts (definitions, references)
   first; load-bearing parts (opening, anecdotes) last so Julien can
   sit down to a partial draft and add the parts only he can write.
5. Voice-pass everything against `.claude/voice-rules.md`. Most drafts
   need at least one sweep for em dashes, hedging phrases, and the
   four overused tics (essentially, typically, basically, actually).
6. Cross-link to other modules using the conventions in `CLAUDE.md`
   ("Conventions" section).

## Things to actively avoid

- Writing the opening hook for Julien. He fills these in. Stub a
  placeholder if structure requires one.
- Inventing failure stories. If you don't have a real one, leave the
  section flagged for Julien to fill.
- Capitalized Concept Names. The voice doesn't use them.
- Polishing past 80% in one pass. Module quality compounds across
  multiple sittings; over-polish in one session is wasted effort.

## When the module is "done"

The DoD lives in the curriculum norms, not here. Rough version:

- All sections drafted, no `[TBD]` markers
- TLDR is 5-7 entries, ordered by importance
- Cross-module links resolve to real Docusaurus pages
- Voice-pass complete (Julien)
- Lab handoff present at the end of the concept page; lab page lives
  at `docs/.../<slug>/lab/index.md`

If the lab is still in progress, flag the lab section in the concept
page and ship the concept post separately. Each module is publishable
standalone (per the decisions log).
