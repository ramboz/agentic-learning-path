---
title: Messy conversation (M2 lab artifact)
description: A 50-turn conversation depicting an early failed attempt at building a PR review tool. Source material for the Module 2 lab.
unlisted: true
---

# Messy conversation

*A 50-turn conversation. An early attempt to build a PR review tool in
chat-only mode. Read cold first, then diagnose.*

---

### Turn 1 — User

Hey, I want to build a PR reviewer that uses multiple Claude personas to
leave inline review comments on GitHub pull requests. Runs as a GitHub
Action, needs to stay under about 30 seconds per PR. Node and TypeScript.
Before I actually start coding, can you help me think through the
architecture?

### Turn 2 — Claude

Good project shape. A few things to settle before I sketch anything:

1. How many personas? Two to four is workable inside a 30s budget. More
   than that and you'll have to either batch or accept sequential latency
   you can't afford.
2. Are you running them in parallel against the same diff, or splitting
   the input per persona?
3. Just inline comments, or also a top-level PR summary?
4. Are you going to run this on every PR, or only when a label is
   applied? That changes the latency tolerance.

On auth — for a GitHub Action hitting the REST API, you'll want a
Personal Access Token with `repo` scope, stored as a secret and passed
into the action as a `github-token` input. That's the standard pattern.

The 30s budget is the binding constraint. Most of it gets eaten by the
slowest persona's Claude call, not by Octokit work. So persona count
matters more than any of the other choices.

### Turn 3 — User

Three personas: security, performance, readability. Parallel, same diff
to each. Inline comments plus a top-of-PR summary paragraph. Triggered
on every PR, at least for now. And yeah, secrets via Actions, standard
setup.

### Turn 4 — Claude

Got it. Initial structure:

[Claude sketches a ~20-line file tree: `src/personas/{security,
performance,readability}.ts`, `src/github/octokit-client.ts`, `src/claude/
anthropic-client.ts`, `src/index.ts`, `action.yml`, `package.json`.]

Two things worth flagging before we lock in three personas. First, if
your target repos include frontend code, an accessibility reviewer is
usually the second-highest-value addition after security. Second, if
test hygiene matters for your team, a test-coverage reviewer that flags
changes under `src/` without matching changes under `test/` is dead
simple to add and catches a real class of bugs.

Neither is mandatory at three. Just naming them now since the
architecture is open.

### Turn 5 — User

No, three. Security, performance, readability. Not accessibility, not
testing, not coverage. I want to keep scope tight for the prototype.
Three is already enough surface area to debug when something goes
sideways — I don't want to be chasing five agents through a failure and
trying to figure out which one is hallucinating. If it works at three,
I'll expand later. Right now the spec is three.

### Turn 6 — Claude

Fair. Three.

On the Claude API side, you have two options for structuring each
persona's output:

**Plain completion.** Send diff plus persona system prompt, get back
Markdown or JSON that you parse. Simple. But the model will occasionally
return malformed JSON, or wrap its JSON in prose, or include preambles
like "Here are my findings:" that break your parser. You end up writing
repair logic.

**Tool use.** Define a `leave_inline_comment` tool with a strict schema
(path, line, body, severity). The model invokes the tool once per
finding. Output is structured by construction; you never parse freeform
text.

For a reviewer that turns outputs into real GitHub API calls, tool use
is almost always worth it. The schema enforcement pays for itself the
first time the model decides to wrap a comment in backticks.

### Turn 7 — User

Tool use. I'd rather argue with a schema than write a JSON repair
function.

### Turn 8 — User

Quick question on the input side. What does each persona actually
receive? The full diff, or some filtered view?

### Turn 9 — User

Hang on, before you answer — I wrote a bunch of notes yesterday while
thinking about this. Let me paste them in so you have the full picture,
then you can factor them in.

[User pastes ~40 lines of brainstorm notes. Content is a loose dump: a
paragraph on severity levels (critical / warning / nit) and an idea for
auto-collapsing nit comments; a tangent on CI pipeline caching and
whether they should be caching `node_modules` between runs since the
build keeps hitting the 10-minute mark; a list of Slack notification
preferences — which channels should get pinged on what events, a note
about DMing the PR author on critical findings, and a subthought about
whether the bot should use a specific emoji in its Slack handle; and a
closing anecdote about a former teammate who blocked a PR for two weeks
over a brace-placement argument, with a half-formed idea about a
`/style-only` override mechanism that authors can invoke to dismiss
pedantic comments.]

Okay. With all that in mind — what should each persona see?

### Turn 10 — Claude

A lot to pull from in there. Let me tag the pieces and come back to input
scoping.

**Severity with auto-collapse.** Good call. I'd add a `severity` field to
the tool schema (`critical` | `warning` | `nit`). Critical comments
block merge via a check run, warnings surface in the summary, nits
auto-collapse by default.

**CI caching.** Orthogonal to the reviewer itself, but yes — cache
`node_modules` keyed on the `package-lock.json` hash. Saves 15-30s per
run and doesn't affect the 30s review budget since that's measured from
the reviewer's own start time.

**Slack routing.** Three routes based on your notes: team channel for
all reviews, critical-only channel for escalations, DM to PR author on
critical. Implement as a post-review hook that fires after the GitHub
comments land.

**Style-only override.** The teammate-blocking-PRs anecdote is worth
taking seriously. Concrete mechanism: authors can reply to any comment
with `/style-only` and the bot records that pattern in
`.pr-assistant-overrides.json` so future runs skip re-flagging it.

Back to the input question after you confirm those fit where you're
headed.

### Turn 11 — User

Yeah, take all that under advisement, but let's actually start building.
Octokit integration first.

### Turn 12 — Claude

Starting with the client setup:

[Claude writes ~8 lines initializing the Octokit REST client with an auth
token read from the action's `github-token` input (the PAT from earlier).]

For fetching the PR's changed files:

```ts
const files = await octokit.pulls.getFiles({
  owner,
  repo,
  number: prNumber,
});
```

[Claude continues with ~6 lines mapping the response to an internal
`Diff` type and handling pagination for PRs over 30 files.]

Pagination is implicit — the method follows `Link` headers automatically.
You only need manual batching if you're expecting PRs over a few hundred
files, which is unusual.

### Turn 13 — User

Small thing — the parameter is `pull_number`, not `number`. They renamed
it a few versions back. Straight from their docs:

```ts
octokit.pulls.getFiles({
  owner,
  repo,
  pull_number,
})
```

`pull_number` everywhere. Fix that call and keep going.

### Turn 14 — Claude

You're right, `pull_number` — I had the old parameter name. Updated:

[Claude shows the corrected `getFiles` call with `pull_number`, then
finishes the diff-shaping code.]

### Turn 15 — Claude

For very large PRs where you hit real pagination, the async-iterator
pattern is cleaner than accumulating results manually:

```ts
for await (const response of octokit.paginate.iterator(
  octokit.rest.pulls.listFiles,
  { owner, repo, pull_number }
)) {
  for (const file of response.data) {
    // process each file
  }
}
```

That streams each page as it arrives instead of waiting on the whole
set, which matters when you're trying to stay inside 30s on a 500-file
PR. For the common case (PRs under ~30 files) it's overkill and the
plain `getFiles` call is fine.

### Turn 16 — User

Okay, makes sense — keep the plain call as the default path and fall
back to the iterator when we know the PR is big.

### Turn 17 — Claude

For diff handling on each file: the `patch` field in the Octokit response
is the unified diff for that file. For most PRs you hand each persona
the full array of file patches and let them reason over it.

For very large PRs, two knobs worth having:

1. A per-file cap. Files with more than ~500 lines of diff get a
   summary-only review rather than inline comments.
2. A total-diff cap. If the total diff exceeds some threshold (~5000
   lines is my default), the reviewer posts a single comment saying the
   PR is too large for automated review and skips the personas entirely.

Both are guardrails against blowing the 30s budget on a mega-PR.

### Turn 18 — User

Good, those thresholds sound fine. Don't need to tune them yet.

### Turn 19 — Claude

One more thing before prompts — rate limits. GitHub's REST API limits
authenticated requests to 5000 per hour per token. For a reviewer that
does a handful of reads and a handful of writes per PR, you're nowhere
near that on normal volume. If you ever hit it, the response includes
`X-RateLimit-Remaining` and `X-RateLimit-Reset` headers you can use to
back off gracefully.

Worth mentioning because if the reviewer ever goes into a retry loop
against the GitHub API, you want to exit on 403 with a rate-limit header
rather than burning the budget.

### Turn 20 — Claude

For persona prompts, I'd structure each as a system prompt in three
sections:

1. **Role.** Who this reviewer is, what they care about, what's out of
   scope for them.
2. **Criteria.** Specific things to look for. Security: injection
   patterns, auth flows, secret handling, input validation. Performance:
   N+1 queries, unnecessary allocations, blocking I/O in hot paths.
   Readability: naming, function length, magic numbers.
3. **Output.** Use the `leave_inline_comment` tool. Keep comment bodies
   under 150 words. Always include severity. Don't leave comments on
   lines you didn't personally observe a problem on.

That last rule in the output section matters more than it looks —
without it, you get personas leaving "looks fine!" comments everywhere,
which is noise.

### Turn 21 — User

Makes sense. Let me ask something before you draft the prompts though.

Should each persona only see files that match their interest area? Like,
does security just see auth/middleware stuff, or does it see the whole
diff? I can see arguments either way.

### Turn 22 — Claude

Worth settling before the prompts. Two defensible positions:

**Scoped visibility.** Each persona only sees files matching heuristic
patterns. Security: files touching auth, middleware, input handlers.
Performance: files on hot paths, data-layer code, anything over a size
threshold. Readability: everything. Pro: cheaper, faster, each persona
stays focused on its turf. Con: you miss cross-cutting issues. A perf
problem inside an auth file falls through the cracks — nobody looks at
it.

**Full diff for all.** Every persona receives the complete diff on every
run and decides what's relevant to their role. Pro: no cross-cutting
misses, simpler architecture, no routing logic to maintain and get
wrong. Con: more tokens, potential for personas to wander into each
other's areas and produce duplicate comments.

At three personas with a 30s budget, I'd lean full diff for all. Token
cost at three parallel calls is manageable. And the whole reason to have
three different perspectives rather than one generalist reviewer is the
cross-cutting catches. If you scope by file you're basically running
three narrow linters in parallel, which is a different (and less
interesting) architecture.

Your call.

### Turn 23 — User

Full diff for all three. Your point about cross-cutting is exactly right
— readability might catch something in an auth file that security
missed, and vice versa. Pre-filtering at the input layer loses
information we can't recover later. Every persona gets the whole diff
every time. If noise becomes a problem I'll tune the prompts to make
personas more conservative about commenting outside their primary focus,
but I'm not going to filter input. Locked.

### Turn 24 — Claude

Locked — all three personas receive the complete diff on every run. No
per-persona file filtering at the input layer. I'll keep that as the
architectural commitment.

Now, drafting the security prompt first since it has the strictest
criteria:

[Claude drafts a ~30-line system prompt for the security persona. Role
section, criteria section enumerating injection classes and auth
patterns, output section describing the tool-use schema and
comment-length rule.]

For the posting side, here's the review-comment helper:

[Claude writes ~8 lines of the `postReviewComments` helper.]

```ts
await octokit.pulls.listReviewComments({
  owner,
  repo,
  number: prNumber,
});
```

[Claude continues with ~10 lines looping through persona results and
calling `createReviewComment` for each inline finding.]

That closes the loop: diff in, personas run in parallel, comments posted
back.

### Turn 25 — User

Same thing again — it's `pull_number`, not `number`. Second time now,
also check the create call if you used it there.

### Turn 26 — Claude

I apologize for the oversight — you're right, same parameter. I had it
correct in the `getFiles` call after your correction but reverted on the
comment endpoints. Fixed:

[Claude shows corrected `listReviewComments` and `createReviewComment`
calls with `pull_number` throughout.]

I'll be more careful across the rest of the Octokit surface.

### Turn 27 — Claude

On the comment schema — I'd add a `notify_author` boolean that defaults
to `true` for critical severity, so the bot can route a DM to the PR
author on critical findings without having to parse the comment body.
We could also add a `channel_override` field for cases where specific
findings should go to a dedicated channel regardless of the PR's repo —
security criticals to a security channel, for instance.

### Turn 28 — User

We're not on Slack yet. Park it. Just focus on the personas for now.

### Turn 29 — Claude

Right, Slack is parked. Back to persona prompts.

### Turn 30 — Claude

Drafting the performance reviewer next:

[Claude drafts the performance persona prompt, ~25 lines. Role
definition flagging hot-path concerns, criteria listing N+1 queries,
synchronous filesystem calls in request paths, large allocations in
loops, and blocking I/O patterns.]

One implementation note: the performance and accessibility reviewers
have a lot of overlap on frontend render-path work, so when you have
both running you'll want the performance prompt to explicitly defer to
accessibility on anything that looks A11y-adjacent. Otherwise you get
duplicate comments on the same line, which is worse than one persona
missing the issue.

Readability next:

[Claude drafts the readability persona prompt, ~25 lines. Criteria
covers naming, function length, magic numbers, dead code, unclear
control flow.]

### Turn 31 — User

Good, those look reasonable. Keep going.

### Turn 32 — Claude

With three drafts done, the orchestration layer is the next piece. The
parallel call pattern:

[Claude writes ~15 lines using `Promise.allSettled` to call all three
personas against the same diff, collecting results and errors
separately.]

Using `allSettled` rather than `all` means a single persona failure
doesn't blow up the whole review — you get partial output, which is
better than no output. The accessibility reviewer falling over would
still let security and performance report in, for instance.

### Turn 33 — User

Yeah partial success is the right default. What about error handling
inside the personas themselves? Like, Anthropic API timeouts or
rate-limit errors?

### Turn 34 — Claude

Three layers of error handling, from tightest to broadest:

1. **Inside each persona call:** wrap the Anthropic SDK invocation with
   a retry for transient errors (5xx, rate-limit 429s). Use exponential
   backoff with jitter, cap at 3 retries.
2. **At the `allSettled` boundary:** persona failures surface as
   rejected promises. Log with enough context to debug, but don't throw.
3. **At the action boundary:** if fewer than half the personas succeed,
   post a single "review unavailable" comment instead of partial
   results. Otherwise post whatever succeeded and flag the misses in the
   summary.

The third one matters because a review that only includes the
readability persona's output could give a misleading impression of
safety on a risky PR.

### Turn 35 — User

Good.

### Turn 36 — User

Actually — can you write the persona-loading logic using the schema we
defined in `persona-schema.md` earlier? I want to see how that looks in
code.

### Turn 37 — Claude

Sure, using the schema we established:

```yaml
name: security
systemPrompt: <string>
focus: [<list of strings>]
outputFormat: tool_use
```

[Claude writes ~20 lines of TypeScript. A `loadPersona` function that
reads a YAML file from `src/personas/*.yaml`, parses it, validates
against a Zod schema import from `../persona-schema`, returns a typed
`Persona` object. A `loadAllPersonas` that walks the directory.]

```ts
import { PersonaSchema } from "../persona-schema";

export function loadPersona(path: string): Persona {
  const raw = readFileSync(path, "utf8");
  const parsed = yaml.parse(raw);
  return PersonaSchema.parse(parsed);
}

export function loadAllPersonas(dir: string): Persona[] {
  return readdirSync(dir)
    .filter(f => f.endsWith(".yaml"))
    .map(f => loadPersona(join(dir, f)));
}
```

Keeping personas as declarative YAML with a strict shape means adding a
fourth or fifth is just a new YAML file, no code changes. The
`outputFormat` field lets us switch a persona between tool use and plain
completion in the future — all three are on `tool_use` right now, but
you could imagine a future `summary` persona using plain completion for
the top-of-PR paragraph.

### Turn 38 — User

Right, that looks clean. Back to the summary — how should it be
structured?

### Turn 39 — Claude

The summary is the only non-inline artifact, so it has to earn its real
estate. My suggested shape:

1. One-line verdict. "2 critical, 3 warnings, 7 nits across 3
   reviewers."
2. Per-reviewer line. "Security: 1 critical on input validation.
   Performance: clean. Readability: 3 nits on naming."
3. A deep-link into the Files Changed tab.

The `outputFormat` field we defined in the schema gives us a clean hook
to render summary-type findings differently from inline ones if we add
a dedicated summary persona later.

### Turn 40 — User

Do those deep-links actually work on GitHub?

### Turn 41 — Claude

Partially — GitHub supports some path-based filters on the Files Changed
tab, but there's no clean severity filter out of the box. A more
pragmatic approach is emoji-prefixing comment bodies based on severity
(🔴 critical, 🟡 warning, ⚪ nit) so PR authors can visually scan. Less
powerful than a filter, but it doesn't depend on URL undocumented
behavior.

### Turn 42 — Claude

One other thing on the summary: the `focus` field from the persona
schema can drive a better grouping. Rather than grouping findings by
persona, group by focus area — so if both security and performance
flagged something under `input_validation`, they collapse into one
summary line even though the inline comments stay separate.

That turns the summary into a "here are the top concerns across
perspectives" view rather than "here's what each reviewer said
independently," which is more useful for the PR author trying to figure
out what to fix first.

### Turn 43 — User

Alright, I think we have enough to actually start writing this. Can you
draft the file routing logic for me? Like which files each reviewer
sees?

### Turn 44 — Claude

Sure, here's the routing layer:

[Claude writes ~22 lines of TypeScript. A `routeFiles` function that
takes the full diff and a persona name, returns a filtered subset.
Security gets files matching `/auth|middleware|session|input/i`.
Performance gets files matching `/api\/|db\/|query|cache/i` or files
over 200 lines of change. Readability gets the full diff as fallback.]

```ts
// per our architecture: scoped file visibility per persona
function routeFiles(diff: Diff, persona: string): Diff {
  switch (persona) {
    case "security":
      return diff.filter(f => /auth|middleware|session|input/i.test(f.path));
    case "performance":
      return diff.filter(f => /api\/|db\/|query|cache/i.test(f.path) || f.changedLines > 200);
    case "readability":
      return diff;
    default:
      return diff;
  }
}
```

Each persona gets a focused view, token spend stays tight, and
readability falls back to the full diff since naming and complexity
concerns really do apply everywhere.

### Turn 45 — User

No, stop. We literally just settled this. I'm scrolling up right now to
find where — turn 23, I said full diff for all three. Turn 24, you
called it "the architectural commitment." And now twenty turns later
you're writing exactly the scoped version I said no to. What happened?

### Turn 46 — Claude

I apologize for the oversight — you're completely right, this is a
direct contradiction of what we agreed. Full-diff-for-all was the
correct and explicit decision. Rewriting with that commitment front and
center:

```ts
// all three personas receive the full diff — no per-persona filtering
// at the input layer. architectural decision, do not change without
// revisiting the cross-cutting-catches trade-off.
function routeFiles(diff: Diff, _persona: string): Diff {
  return diff;
}
```

I've added the comment as a tripwire so future changes to this function
surface the decision history immediately. The routing layer is retained
purely as an extension point if we ever decide to add filtering, but
right now it is, and should remain, a passthrough. Locking to
full-for-all across every persona for the rest of this architecture.

### Turn 47 — User

Okay. How should I handle the Anthropic API key at runtime? Obviously
GitHub secrets for storage, but how does it flow into the code?

### Turn 48 — Claude

Standard pattern:

1. Declare `ANTHROPIC_API_KEY` as a secret in repo or org settings.
2. Reference it in `action.yml` as an input, with a default of
   `${{ secrets.ANTHROPIC_API_KEY }}`.
3. Read it via `@actions/core`'s `getInput` in the action code.

[Claude writes ~10 lines showing the `action.yml` input declaration.
The inputs include `anthropic-api-key` (required, secret) and
`github-token` (required, described as "Personal Access Token with
`repo` scope"), with both wired through to `process.env` reads in the
action code.]

GitHub injects the secrets at runtime and scrubs them from logs
automatically — you don't need to do anything defensive beyond not
logging them yourself.

### Turn 49 — User

What other action inputs should I expose?

### Turn 50 — User

Actually hold on, I'll figure out inputs as I go. I think I have enough
to start building. Some of this still feels fuzzy but I'll work it out
as I go.