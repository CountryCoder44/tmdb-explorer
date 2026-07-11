# TMDB Explorer

A small webapp that fetches movies from [The Movie Database](https://www.themoviedb.org/) and displays them in a filterable, sortable, animated grid.

Built as a take-home assignment. See [DEVLOG.md](./DEVLOG.md) for a running log of how it was built and what it was built with.

## Setup

```bash
npm i
npm start
```

Opens at `http://localhost:5173`. A working TMDB API key is already committed in `.env` — no extra setup needed (this is a deliberate choice, not an oversight — happy to walk through the reasoning).

## Features

- Fetches the first page of `/discover/movie`, filtered server-side via the **Filters** panel: multiple genres (any-of/OR), a release-year range, and a minimum rating — none applied by default, all combinable. Active filters show as removable chips below the controls.
- Client-side sort by rating, title, release date, or popularity, ascending or descending, via the **Sort by** controls.
- Grid and line (list) layout, toggled via the **Grid / Line** buttons, with an animated reflow between them.
- Click any card for a detail view — cast, runtime, and tagline load in on demand, with the poster sliding in from the left.
- Each card shows poster, title, rating, and (on hover, keyboard focus, or click) the overview and genre tags.
- Responsive grid, scroll-triggered card entrance, and an ambient animated background — all built with [Motion](https://motion.dev/), respecting `prefers-reduced-motion`.

## Scripts

- `npm start` / `npm run dev` — dev server
- `npm run build` — type-check and production build
- `npm run test` — Vitest unit tests
- `npm run preview` — preview the production build
