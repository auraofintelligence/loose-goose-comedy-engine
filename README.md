# Loose Goose Comedy Engine

A browser-first, local-first comedy mining and performance-scoring tool for turning real-life memories into editable stand-up material without quietly rewriting the underlying truth.

## Live Pages

**Open the app:** https://auraofintelligence.github.io/loose-goose-comedy-engine/

## Core idea

The engine separates the work into four layers:

1. **Memory Seed** — what actually happened, what you wanted, what obstructed it, vivid details, emotional truth, receipts and unknowns.
2. **Comedy Lenses** — observational, anecdotal, sketch, act-out, self-deprecation, character, edgy/forbidden, institutional put-down, music/visual, status reversal, scale mismatch and **crowd work / controlled risk**.
3. **Beat Score** — setup, turn, punch, tags, act-outs, crowd branches, callbacks, pauses and buttons, with timing against a 92 BPM performance pulse.
4. **Track Summary** — an editable Markdown view of the developing routine.

## Truth lock

Autobiographical claims are explicitly tagged as:

- `fact`
- `memory`
- `inference`
- `comic_exaggeration`
- `unknown`

The principle is simple: **unknown is not none**. Missing context does not become invented biography.

## Crowd work

Crowd work is treated as **controlled risk**, not sanitised audience participation. The engine asks what personal, sexual, social, status or moral question creates useful tension in the room, then maps the risk, first riff, escalation, clapback and return line.

## Local-first privacy

The current prototype stores work in the browser using local storage. Nothing is sent to a server by the app itself. You can export the current track as JSON and copy the summary as Markdown.

Private autobiographical archives, receipts, relationship history, health information and other sensitive material should remain outside the public repo unless intentionally published.

## Files

- `index.html` — browser interface
- `styles.css` — presentation
- `app.js` — state, comedy lenses, timing and exports
- `LICENCE.md` — Strange but True Public Source Licence, adapted specifically for the comedy engine

## Licence

This project is public source, not open source. Personal, educational, artistic, research, community and other non-commercial use is allowed under the terms in [`LICENCE.md`](LICENCE.md). Commercial, corporate, institutional, government, startup, agency, client and employer use requires written permission from Luke Nathan Hayes.

The licence adapter also makes explicit that **the engine does not acquire ownership of a user’s own jokes, routines, stories, crowd-work branches or other original comedy outputs**.

## Current status

Early working prototype. The next useful layers are likely to include a repertoire catalogue, callback graph, rehearsal/audience test logging, transcript and voice-note ingestion, visual receipts, track/show assembly, and AI adapters that preserve the truth lock rather than inventing connective tissue.

---

Built by Luke Nathan Hayes / Strange but True / Aura of Intelligence.
