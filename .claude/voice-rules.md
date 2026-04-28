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
