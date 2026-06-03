# F1 Pulse

F1 Pulse is a Next.js App Router web experience for Formula 1 fans, featuring:

- Neon dark-mode motorsport visual language
- Live data cards (latest GP and next race countdown)
- Driver standings + head-to-head comparison tool
- Visual car builder with a 360-degree 3D F1 car viewer, local persistence, and simulation stats
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

## 3D Model Credit

- Builder model source: [F1 2026 Car 3D Model on FetchCFD](https://fetchcfd.com/view-project/4846-f1-2026-car-3d-model)
- Listed license: Creative Commons Attribution 4.0
- Model credit: Nimaxo, via FetchCFD project by Alges Mann
