---
slug: /
sidebar_position: 1
title: Welcome
---

# Agentic Learning Path

A curriculum for working with Claude and Claude Code, from prompts to crews.

During a recent workshop, my colleague [Lars Trieloff](https://github.com/trieloff) suddenly broke off mid-conversation to say his agents were finally done. It was Wednesday. He'd kicked the run off on Monday morning, and the agents had been working on their own the whole time.

I was floored. At my level of agentic work, I'm happy with 15 minutes of unsupervised runtime, and most of that time goes into course-correcting the output. Lars had a finished result. He had set up long-running autonomous agents to work through the whole project while he was doing other things. He was operating on a completely different level.

That gap is real, and it isn't just mine. Most of the organization sits somewhere between chatting with Claude once and having agents ship work overnight. I wanted to learn what fills that gap, walk the path myself, and document what I pick up along the way. That gives the team a shared baseline to start from, instead of each of us figuring it out alone.

## What this curriculum covers

Twelve modules across three tiers, each pairing a concept post with a hands-on lab. You can start with any module; later ones build on earlier frames.

Modules are published as they're finished, so some later ones may still be in progress.

- **Tier 1 — Everyone.** M1–M3. *M1–M2 work in Claude.ai chat. M3 is the move to the terminal.*
  - Prompting as a specification problem
  - Context as the product
  - The move from chat to Claude Code

- **Tier 2 — Engineers** (concept posts for PMs and architects). M4–M7.
  - CLAUDE.md as a state file
  - Path-scoped rules
  - Sub-agents and skills
  - The oracle problem

- **Tier 3 — Engineers only.** M8–M12.
  - Headless mode and the Ralph loop
  - Hooks for unattended runs
  - Parallel workers and worktrees
  - Agent Teams
  - Multi-tool crews and MCP

## What this is, and what it isn't

This curriculum teaches the foundations. The concepts you need to work well with AI coding agents, introduced one at a time, with a lab in each module to make them stick. It starts from zero and assumes no prior AI experience.

It is not a reference manual, and it is not a description of how any one team works. Two kinds of material already cover that ground, and this curriculum points to them instead of repeating them.

For how the team operates day to day, see the [AI-First Development Guidelines](https://github.com/adobe/mysticat-ai-native-guidelines). That is the operating playbook: the lifecycle, the templates, the guardrails, the per-tool setup, in far more depth than a single module should carry. The split is simple. Read here to understand why something matters. Read the guidelines to see how the team applies it.

For what gets built on these foundations, see [jig](https://github.com/ramboz/jig), [servo](https://github.com/ramboz/servo), and the [Experience Success skills](https://github.com/adobe/experience-success-skills) (private repo, Adobe-internal). These are real, shipped tools, and they are what the concepts here are for. servo, for one, automates the same overnight-agent loop that the later modules build up by hand.

The foundations are not here to be memorized as current practice. They are here so you can tell whether a given practice is sound, and build the next tool instead of only running the ones that already exist.

## How to read it

Each module follows the same shape:

- A personal opening
- A "What this module covers" overview
- Concept sections
- A bridge to the next module
- A TLDR
- A lab handoff
- References

If you only have ten minutes, scroll to the TLDR.

The labs are designed for self-paced practice. No submission, no review. Some labs reference a sample codebase shipped alongside the curriculum (in `samples/` for M3, in the separate `pr-assistant-lab` repo from M4 onward).

## How to navigate

The sidebar groups modules by tier. Use the previous/next buttons at the bottom of each page to walk through in order, or jump straight to whichever module solves the problem you're stuck on. Tier 1 is foundational; Tier 2 and 3 assume those frames are in place.
