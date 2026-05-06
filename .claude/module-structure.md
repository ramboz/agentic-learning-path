# Module structure

The canonical shape every module follows. Source:
`_authoring/decisions-log.md` ("Module structure" section), validated
against the M1-M4 drafts in `docs/tier-1/` and `docs/tier-2/`.

## The shape

In order:

1. **Opening** (chat-register)
2. **What this module covers** (doc-register, bulleted preview)
3. **Concept sections** (mixed register)
4. **Bridge to next module** (chat-register)
5. **TLDR** (doc-register, ordered by importance)
6. **Lab handoff** (one paragraph in the concept page)
7. **Lab design** (separate page at `lab/index.md`)
8. **References** (doc-register, end of concept page)

## Each section, in detail

### Opening

A personal moment. Chat-register. Specific: real project, real failure
or insight, named where possible. Sets tone for the rest of the module.
Does NOT explain what the module covers — that's the next section's job.

Length: 2-4 paragraphs typically. Long enough to establish stakes,
short enough that readers don't bounce before the map.

### What this module covers

Doc-register. Scope-setting section. Bulleted preview of what the
module teaches and what the lab asks. Prevents readers from finishing
the module before knowing what to expect from it.

Format: opens with "In a nutshell:" followed by a numbered list of
6-8 short items. Closes with one paragraph that names the lab and any
prerequisites or next-module pointers.

### Concept sections

The body. Mixed register. Each section is one of these shapes:

- **Reframe.** Establishes the mental model the rest of the section
  builds on. Doc-register.
- **Pattern walkthrough.** "You'd need to..." Step-by-step. Doc-register
  with chat-register asides for what bit Julien.
- **Failure-mode table.** Symptom → diagnosis → fix. Tables. Doc-register.
- **Worked example.** Real code, named repo, link to a real PR.
  Doc-register frame around chat-register narration.
- **Honest caveat.** Where Julien hasn't worked something out yet, or
  where the module's claim has limits. Chat-register.

A typical module has 3-6 concept sections.

### Bridge to next module

Chat-register. Ends the conceptual content with a one-paragraph
handoff to the next module. Not a summary of what was covered (that's
the TLDR's job); a forward pointer to what the reader is about to
need.

### TLDR

Doc-register. 5-7 single-sentence takeaways. Ordered by importance
(most load-bearing first), NOT by section order in the module.

The TLDR sits at the **end** of the module, not the start. (Decision
recorded in `_authoring/decisions-log.md`: TLDR at start would compete
with the opening hook for attention.)

### Lab handoff

One paragraph at the end of the concept page. Says what the lab does,
how long it takes, and where to find it. Links to `./lab/`.

### Lab design

Separate page at `docs/.../<slug>/lab/index.md`. Doc-register. Includes:

- Goal (one sentence)
- Setup (what the learner needs)
- Exercise (numbered steps, time estimates)
- What you'll have at the end (the artifact)
- Time budget (total)
- Common traps (specific things that catch learners)
- Extension, optional (one harder thing for learners who want it)

Lab artifacts (worksheets, source material) sit alongside `index.md`
inside the `lab/` folder with `unlisted: true` front-matter.

### References

End of concept page. Doc-register. Each reference is:

- **Bolded short label.** One sentence on what it is and what it's
  useful for. URL in backticks (not as a markdown link, since these
  are reference notes, not navigation).

3-6 references per module. Mix vendor docs, practitioner notes, and
academic where it earns its place. No "further reading" filler.

## Heading structure

The sidebar TOC is driven by H2 and H3 headings. The goal is a clear
two-level structure where structural beats stand out and content
sections sit visibly beneath them.

### Structural beats (always H2)

These headings appear in every module in this order:

- `What this module covers`
- `The reframe` (with an optional subtitle: `The reframe: <core concept>`)
- One or two **content group** H2s (see below)
- `Failure modes and the move that fixes each`
- `Bridge to Module N`
- `TLDR`
- `Lab handoff`
- `References`

Structural beats should use consistent names across modules. "The
reframe" is always "The reframe" (not "The frame shift," not "The
mental model"). "Failure modes and the move that fixes each" is always
that phrase, not a per-module variant.

### Content sections (H2s between reframe and failure modes)

The concept sections between the reframe and failure modes are H2s.
Two patterns are in use, both sanctioned:

**Umbrella H2 with H3 children.** When several sub-topics naturally
group under a single conceptual heading, use one H2 as the umbrella
and H3s for the sub-topics inside. M1-M5 use this pattern.

**Standalone H2s, one per topic.** When each major topic is distinct
enough to read as its own section, use sequential H2s and reach for
**bolded paragraph leads** for sub-points inside each. M6 uses this
pattern.

Pick whichever fits the material. Don't mix the two inside a single
module; pick one and stay with it.

Examples across published modules:

| Module | Pattern | H2(s) and children |
|---|---|---|
| M1 | umbrella | What a spec-style prompt contains → Task, Constraints, Context, Examples |
| M1 | umbrella | Iteration: prompts aren't one-shot → Know your noise floor, Stop when diminishing returns kick in |
| M2 | umbrella | How context works → The four layers, How long conversations degrade, Claude forgot vs. never had it |
| M2 | umbrella | Managing context → Tools, Over-contextualizing, When to start fresh |
| M3 | umbrella | How Claude Code works → What it actually is, The plan/edit/exec loop |
| M3 | umbrella | Configuration → CLAUDE.md briefly, Permissions |
| M4 | umbrella | Working with CLAUDE.md → CLAUDE.md mechanically, What earns a place, What doesn't, Progress files, Anti-knowledge |
| M5 | umbrella | The mechanics → How rules work, Rules vs skills, Worked example |
| M6 | standalone | Skills (own H2); Built-in sub-agents (own H2); Custom sub-agents (own H2); The sub-agent vs skill decision (own H2) |

A few sections stay as standalone H2s in either pattern when they're
a deliberate structural beat rather than a sub-topic: "The graveyard
problem" in M4, "Honest caveat" in M5 and M6, "When NOT to use Claude
Code" in M3.

### H3 within a section

Use H3 freely within a content section when the section has two or
more named sub-topics that the reader might want to navigate to
directly. Don't promote every bold label to H3 — only the ones where
a sub-heading meaningfully aids navigation.

## Front-matter requirements

Every module page needs:

```yaml
---
title: M<N> — <Short title>
description: <One sentence, used in browser tab and search snippet>
---
```

Lab `index.md` adds:

```yaml
sidebar_label: Lab
```

Lab artifact pages add:

```yaml
unlisted: true
```

## Standalone-publishable note

Per the decisions log, every Tier 1 and Tier 2 module is publishable
on its own. Tier 3 modules generally aren't (M10 is the explicit
finale; M8/M9 depend on M7).

What "publishable standalone" means in practice:

- The opening doesn't assume the reader read prior modules
- Cross-module references are linked, not assumed
- The frame established in earlier modules gets a one-line restatement
  where it matters

If a module reads as cliff-hanger to the next one, it's not yet standalone.
