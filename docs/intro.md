---
slug: /
sidebar_position: 1
title: Welcome
---

# Agentic Learning Path

A curriculum for working with Claude and Claude Code, from prompts to crews.

During a recent workshop, my colleague [Lars Trieloff](https://github.com/trieloff) suddenly broke off mid-conversation to say his agents were finally done. It was Wednesday. He'd kicked the run off on Monday morning, and the agents had been working on their own the whole time.

I was floored. At my level of agentic work, I'm happy with 15 minutes of unsupervised runtime, and most of that time goes into course-correcting the output. Lars had a finished result. He was using droids, a term I hadn't heard before. He was operating on a completely different level.

That gap is real, and it isn't just mine. Most of the organization sits somewhere between chatting with Claude once and having agents ship work overnight. I wanted to learn what fills that gap, walk the path myself, and document what I pick up along the way. That gives the team a shared baseline to start from, instead of each of us figuring it out alone.

## What this curriculum covers

Ten modules across three tiers. Concept posts and hands-on labs ship together. Each module is publishable on its own; later modules build on the earlier ones.

The curriculum is being written on a spiral schedule, one module at a time. Right now, M1 to M4 are published. M5 to M10 are stubs that link to outline notes while I draft them.

- **Tier 1 (everyone).** M1 to M3. Prompting as a specification problem, context as the product, the move from chat to Claude Code.
- **Tier 2 (engineers, with concept-post subset for PMs and architects).** M4 to M6. CLAUDE.md as a state file, sub-agents and tool scoping, the oracle problem.
- **Tier 3 (engineers only).** M7 to M10. Headless mode and the Ralph loop, parallel workers and worktrees, Agent Teams, multi-tool crews and MCP.

## How to read it

The published module pages are the curriculum. Each module starts with a personal opening, then a "What this module covers" map, then concept sections, a bridge to the next module, a TLDR, and a lab handoff. If you only have ten minutes, scroll to the TLDR.

The labs are designed for self-paced practice. No submission, no review. Some labs reference a sample codebase shipped alongside the curriculum (in `samples/` for M3, in the separate `pr-assistant-lab` repo from M4 onward).

## How to navigate

The sidebar groups modules by tier. Use the previous/next buttons at the bottom of each page to walk through in order, or jump straight to whichever module solves the problem you're stuck on. Tier 1 is foundational; Tier 2 and 3 assume those frames are in place.
