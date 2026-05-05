# Voice rules

Load-bearing summary. This file is the recall card for the rules; the
*calibration* lives in three places:

- `_authoring/voice-notes.md` — the rules in long form, with reasoning.
  Read this the first time you draft for the curriculum.
- `_authoring/voice-samples-wiki.md` — five Adobe-internal wiki pages by
  Julien. Pattern-match against these when drafting **doc-register**
  content (concept sections, failure-mode tables, step-by-step labs).
- `_authoring/voice-samples-slack.md` — three Adobe-internal Slack
  threads where Julien was active. Pattern-match against these when
  drafting **chat-register** content (openings, transitions, "what bit
  me" anecdotes, bridges).

The samples are not rules; they're examples. When the rules below are
ambiguous, the samples settle the question.

## The hard rules (don't break)

1. **No em dashes.** The single most common voice violation. Source
   samples use them 3-4 times in 6000 words, almost always for genuine
   parentheticals. Default: comma, period, or parentheses. If a dash
   feels necessary, the sentence usually wants to be two sentences.
2. **One idea per sentence.** Many readers have English as a second
   language. Writerly moves that require rereading are actively hostile
   to that audience. Plain verbs over elegant constructions.
3. **No Capitalized Concept Names.** "the four-component spec frame"
   not "the Four-Component Spec Frame."
4. **No motivational framing.** No "best practices," no "leverage,"
   no exhortations.
5. **No hedging phrases.** No "it seems," "I believe," "perhaps."
   Replace with a number, a specific observation, or a direct claim.
6. **Reader-facing, not author-facing.** Audit for anything that
   describes the curriculum's structure from the author's point of view:
   "frame-setter for the whole curriculum," "each module is publishable
   on its own," "entering here." A reader who arrived at this page cold
   has no use for those phrases. If it belongs anywhere, it belongs in
   `_authoring/`, not in `docs/`.

## The watch-list (max one per paragraph)

Julien overuses these in source samples. Strip aggressively:

- `essentially`
- `typically`
- `basically`
- `actually` (especially when conceding a point)

Compound forms ("essentially typically used for...") stack the tics.
Catch them.

## Register split

Two registers exist; the curriculum mixes them deliberately.

**Doc-register** (wiki voice): structured, terse, precise, third-person
"we," tables doing structural work. Use for:

- Pattern summaries and "what this section covers"
- Tradeoff sections and decision frames
- Step-by-step instructions and lab exercises
- Failure-mode tables

**Chat-register** (Slack voice): contractions, first-person, hedged
scoping, direct acknowledgment of the reader. Use for:

- Module openings (almost always chat-register)
- Transitions between sections
- "What bit me" anecdotes
- The bridge to the next module

When in doubt for connective tissue, drift toward chat-register. When
in doubt for structured content, drift toward doc-register.

## Sentence and structure habits

- **Quantitative over hedged.** `~600ms`, `<10ms`, `20-40 points`.
  Specific numbers beat vague modifiers.
- **Scare-quotes for loaded terms.** *"ideal" performant solution*,
  *"simple" library*. Signals "this word is doing more work than usual."
- **Concession-then-point openings.** Signature move: "While it is
  technically feasible... this typically involves..." or "Good point —
  I was thinking about X, but this is Y." (Note: that em dash example
  is a chat-register exception. Don't carry into doc-register.)
- **Scope-setting section after the opening.** Every module has a "What
  this module covers" section before the body. Bulleted preview. Maps
  the territory before paragraph three. Required through Tier 1;
  revisit by M5.
- **Tables for >3 comparable items.** H2 headers generously, H3 sparingly.
  Don't over-nest.
- **"You'd need to..." for walkthroughs.** Second-person conditional,
  not imperative, not passive.
- **Open with one of: "Context," "Use Case," "Problem Statement."** No
  throat-clearing.
- **First-person consistency in anecdotes.** If the voice is
  first-person for an anecdote, stay first-person throughout. Don't
  switch to "most people I've watched" when the observation is really
  about the author's own experience. "I'd been treating..." beats
  "Most people treat..." unless the claim genuinely extends past one
  person's experience.
- **Paired examples use the same format.** When showing a bad version
  and a good version of something (prompt, config, code), both go in
  the same visual container. Both prose, or both in a fenced code
  block. Inconsistent formatting creates a reading snag exactly where
  clarity matters most.
- **Word precision in loaded choices.** Prefer the plain word over the
  elevated one. "Opposite" not "inverse." Prefer the neutral word over
  the judgmental one. "Better phrasing" not "clever phrasing." The
  existing "plain verbs" rule applies to nouns and adjectives too.

## Example and audience scope

- **No forward references in examples.** If an example requires
  knowledge of a concept, tool, or system introduced in a later module,
  replace it. The test: could a reader who has only completed the
  listed prerequisites follow this example without Googling a term?
  For Tier 1 modules (audience: everyone), that means everyday
  non-engineering examples where possible. Technical examples that
  require knowing what a HAR file is, how a sub-agent works, or what
  cwv-agent does belong in Tier 2+, where those prerequisites exist.
- **Examples match the audience of the module, not the author's
  current work.** The author's own codebase is a good source of real
  examples, but only when the audience has the context to follow it.
  An example from cwv-agent is appropriate in M5 (Tier 2, engineers
  who've been through M4). It is not appropriate in M1 (Tier 1,
  everyone).

## Things to actively avoid

- Lyrical flourishes, metaphors extended past a sentence
- Narrative anecdotes in doc-register sections (fine in chat-register)
- Ritual apologies ("sorry for the long message...")
- Writerly rhetorical moves: "The reframe that holds up better:",
  "The mirror image of X is worth naming," "worth noting that..."
- "Recommendations" (use "Wishlist" or "Suggested Solutions")
- Smileys in published prose (fine sparingly in chat)

## Voice-pass checklist

Before any module ships, run this pass:

1. Search for `—` (em dash). Replace with comma, period, or parentheses.
   Each remaining em dash needs a justification.
2. Count occurrences of `essentially`, `typically`, `basically`,
   `actually`. Cap at one per paragraph; cut the rest.
3. Find any `it seems`, `I believe`, `perhaps`. Replace with a specific
   observation or a direct claim.
4. Find any Capitalized Concept Name. Lowercase it.
5. Read the opening aloud. If it sounds like a wiki, rewrite in
   chat-register.
6. Read the failure-mode table. If it sounds like a story, rewrite in
   doc-register.
7. Scan for author-facing phrases ("frame-setter," "publishable on its
   own," "entering here"). Remove or move to `_authoring/`.
8. Check every worked example against the module's prerequisites. If
   the example requires knowledge from a later module, replace it.
9. Find any before/after paired examples. Confirm both use the same
   visual format (both prose or both fenced code blocks).
10. Find any anecdote that switches from first-person to "most people."
    If the observation is from the author's own experience, rewrite
    in first-person.
