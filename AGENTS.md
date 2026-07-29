# Repository working instructions

- Keep this repository independent from the Transport Planner Toolkit.
- Do not add Sprint 1 datasets or professional planning conclusions without explicit instruction.
- Keep live data adapters isolated from geometry and UI code.
- Perform professional area calculations in EPSG:27700.
- Preserve Polygon/MultiPolygon interior rings.
- Never interpret a failed service request as an empty result.
- Run `pnpm lint`, `pnpm test` and `pnpm build` before claiming completion.
- Do not create a service worker during active prototype development.
- Update the reuse register and ADRs when shared boundaries materially change.
