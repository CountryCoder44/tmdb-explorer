# Devlog

This assignment was built with Claude Code. This doc is the honest account of that: what I used it for, and what I actually decided versus what I delegated. It's about process and decisions, not a technical deep-dive into the implementation itself.

## Process

I worked in rounds: describe what I wanted → review what came back, either as a plan I approved before any code was written, or by running the app in my own browser → give specific feedback → repeat. Nothing shipped without me looking at it running first. One thing I asked for up front, specifically so this record would be trustworthy rather than reconstructed afterward: this devlog was updated live, as decisions happened, not written after the fact at the end.

## Decisions I made

**Scope and stack**, set at the start:
- React + TypeScript + Vite, Tailwind CSS, and an animation library for the scrolling/animated-background/slide-transition effects I wanted — landed on Motion (the current name for what was Framer Motion).
- Genre as the assignment's required filter.
- Of the optional extras, build all of them except rating-based element sizing — swapped that for a grid/line layout toggle instead.
- Explicitly prioritized functional completeness over visual polish: "let's focus on getting all features implemented first," polish to follow on my own.
- Styling kept inline/co-located with markup rather than split into separate CSS files, so an element and its styling stay in one place.

**Filtering**, in two rounds:
- First round: genre only, matching the base assignment.
- Second round, after the base build was done: asked for filtering to go deeper. Decided multi-genre selection should be OR (any-of), not AND — confirmed explicitly ("should show action, comedy, and action + comedy") rather than leaving it ambiguous. Chose a collapsible "Filters" panel over cramming more controls into the always-visible bar. Decided against adding a minimum-vote-count control, to keep the added scope contained.
- Third round: caught that the genre filter still defaulted to Action on load and asked for that removed — no filter pre-applied.

**Visual direction:**
- Specified the animated-background concept (drifting ember particles, orange and purple, layered behind a softer blur layer) and iterated on it across several rounds of feedback after seeing it running: too clustered in the bottom third → spread across the full screen; too infrequent → increase the appearance rate; positions felt hand-placed → randomize the horizontal start point; still mostly hidden behind the poster grid → bias positions toward the screen margins.
- Caught two real bugs by using the app myself, not by inspecting code: filter/sort dropdown text was unreadable (light text on a light native popup), and the grid↔line layout toggle felt like a confused stutter rather than a clean transition. Described the symptoms; the root cause and fix were diagnosed during implementation.

**New feature, beyond the original brief:**
- Asked for movie cards to be clickable, with a specific interaction spec: the poster slides in from the left, and additional detail (cast, etc.) shows if the data is available.

**Process:**
- Asked to run in a mode where routine implementation steps (file edits, installs, test runs) don't need one-by-one approval, reserving actual check-ins for real decisions.
- Asked for this cleanup pass — rewriting this file for clarity and a dead-code/unused-file audit before calling it done.

## What I used Claude Code for

- **All implementation.** Every component, hook, API call, type definition, and test in this repo was written by Claude Code, not typed by hand.
- **Environment setup** — Vite/React/TypeScript/Tailwind v4/Motion/Vitest scaffolding, including diagnosing a local TLS/proxy issue that was blocking `npm install` entirely.
- **API research before building against it**, not guessing from memory: confirming exact TMDB `/discover/movie` param behavior (that `with_genres` OR/AND modes can't be mixed in one request, that `primary_release_date.gte/lte` — not `release_date` — is correct when no region filter is involved, that a zero-result filter combination returns a normal `200` rather than an error) before the filtering feature was built around those assumptions.
- **Verification.** After each change, Claude Code drove a real headless browser against the running app and checked screenshots and console output before calling something done, rather than asserting it worked because the code looked right. That process is what caught things like the background layer being invisible behind an opaque wrapper, and a test suite failing because jsdom has no `IntersectionObserver`.
- **Self-caught implementation bugs** I never had to notice myself: a sort-direction edge case where descending order silently inverted an "undated movies sort last" rule, and a `useEffect` dependency gotcha where a new filter object on every render would have caused refetch loops if not handled with a derived stable key.

## What I reviewed myself

Everything above that's phrased as "caught," "asked for," or "decided" came from actually running the app, not from reading a diff. The dropdown contrast, the transition stutter, the embers being clustered/hidden, and the decision to drop the default filter were all things I noticed by using it.

## Cleanup pass — 2026-07-10

Rewrote this file for clarity, then audited the repo for dead code and unnecessary files:

- `npm run lint` (oxlint) and `npm run build` (`tsc` with `noUnusedLocals`/`noUnusedParameters` already on) were both already clean — neither flags unused *exports* across files, though, so those needed a manual pass.
- Found and removed three genuinely unused type fields, all in `src/types/tmdb.ts`: `Movie.vote_count` (fetched and typed, never read anywhere — consistent with the deliberate decision not to build a vote-count filter, so its presence was leftover rather than intentional) and six fields on `MovieDetail` (`id`, `title`, `poster_path`, `overview`, `vote_average`, `release_date`, `genres`) that the detail overlay never reads, since it deliberately renders those from the `Movie` summary already in hand instead (render what's already fetched immediately, stream in the rest). Trimmed `MovieDetail` down to the three fields actually consumed: `runtime`, `tagline`, `credits.cast`. Removed the matching `vote_count` values from the two test fixtures.
- Deliberately *kept* `DiscoverMovieResponse.page`/`total_pages`/`total_results`, even though only `.results` is read today — unlike the fields above, these have a specific planned future use (pagination past page 1), so typing them accurately now avoids re-adding them later for no reason.
- Checked file tree, `.gitignore`, and `package.json` for orphaned files or unused dependencies — none found. Every installed package is actually imported somewhere (including non-obvious ones like `@testing-library/jest-dom`, which is a side-effect import in `src/test/setup.ts` and won't show up in a plain `import ... from` grep).
- Tests and build reconfirmed clean after the type trims (14/14 tests, no type errors).
