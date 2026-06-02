# F1 Pulse

F1 Pulse is a Next.js App Router web experience for Formula 1 fans, featuring:

- Neon dark-mode motorsport visual language
- Live data cards (latest GP and next race countdown)
- Driver standings + head-to-head comparison tool
- Visual car builder with local persistence and simulation stats
- Season calendar + interactive team portals
- Resilient live data strategy with season fallback and mock data

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Vitest + Testing Library

## Scripts

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`

## Data Behavior

- Live source: Jolpi Ergast API (`2026` first, then `2025`, then `2024`)
- If live fetch fails, app automatically uses mock data
- UI status badge shows whether data is `live`, `stale`, or `fallback`
