# Drainage & Flood Toolkit

Professional browser-based toolkit for drainage and flood consultancy workflows.

## Sprint 0 status

This repository contains the controlled `DFT-0.1.0` candidate prototype for Flood Map for Planning spatial analysis. It proves:

> red-line site boundary + authoritative Flood Zone vectors → exclusive spatial analysis → interactive map → calculated results → report-ready wording.

The prototype draws, edits or imports a Polygon/MultiPolygon red line; requests the relevant Environment Agency Flood Zone 2 and 3 polygons; calculates exclusive areas in British National Grid; maps the result; generates qualified narrative; exposes consultant diagnostics; and prints an A4 landscape figure.

This is not an accepted production baseline. It requires Technical Director manual acceptance.

## Not included

No climate-change, surface-water, groundwater, reservoir, historic-flooding or geology dataset is included. There are no drainage calculations, SuDS sizing, FRA generation, accounts, cloud storage, database, backend or service worker.

## Install and run

Requirements: maintained Node.js and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL shown by Vite (normally `http://localhost:5173`).

## Use

1. Enter and optionally save the project name and site address.
2. Search for a postcode or address to centre the map.
3. Draw the actual site polygon with the map polygon control, or select **Import GeoJSON**.
4. Use the edit/delete controls to amend the red line.
5. Select **Retrieve data & analyse**.
6. Review site area, exclusive Flood Zone percentages, the 100% check, warnings, source details and narrative.
7. Copy the narrative or open consultant diagnostics.
8. Select **Print / Save Map** and save the browser print layout as PDF if required.

Imports support one GeoJSON `Polygon` or `MultiPolygon`, including valid holes, in EPSG:4326 longitude/latitude. A FeatureCollection must contain exactly one feature; multiple unrelated features are rejected for explicit consultant selection outside the prototype.

## Quality commands

```sh
pnpm lint
pnpm test
pnpm test:coverage
pnpm build
pnpm check
```

`pnpm test:coverage` writes text, LCOV and JSON-summary reports to the ignored
`coverage/` directory. CI uploads that directory as the `sprint-0-coverage`
artifact. The baseline and scope are recorded in
[`docs/acceptance/sprint-0/COVERAGE_BASELINE.md`](docs/acceptance/sprint-0/COVERAGE_BASELINE.md).

The optional live service check is intentionally excluded from the deterministic suite:

```sh
pnpm test:live
```

## Architecture

The application is framework-free, static and suitable for GitHub Pages. esbuild bundles modular browser code; Leaflet provides mapping; Leaflet.draw provides red-line editing; Proj4js converts WGS84 geometry to EPSG:27700; and `polygon-clipping` performs maintained polygon Boolean operations. Areas are calculated with a planar shoelace method in metres after clipping.

Versions are centralised in `src/config.js`. Network endpoints are isolated in `src/ea-adapter.js`. The map, project context, geometry engine, narrative and diagnostics do not depend directly on the live response schema.

## Data source and attribution

The source is the Environment Agency **Flood Map for Planning - Flood Zones**, metadata identifier `04532375-a198-476e-985e-0579a0a11b47`, revision 20 May 2026, published under the Open Government Licence.

Attribution: © Environment Agency copyright and/or database right 2025. All rights reserved.

Flood Zone 1 is the residual outside Flood Zones 2 and 3. The mapping represents present-day river and sea Flood Zones for planning, ignores the benefits of flood defences, is not property-specific and must be assessed for suitability for the intended professional use.

See `docs/DATA_SOURCES.md` for the endpoint and limitations.

## Deployment

`pnpm build` writes the static build to `dist/`. CI validates lint, deterministic
tests with coverage, and build. The Pages workflow is manual-only during active
prototype development; it does not deploy on a push.

## Versioning

- Toolkit: `DFT-0.1.0`
- Flood Zone module: `FZ-0.1.0`
- Spatial engine: `GEO-0.1.0`

All are Sprint 0 candidates, not approved production baselines.

## Known limitations

See `docs/KNOWN_LIMITATIONS.md`. In particular, live service availability and browser CORS remain external dependencies; search uses public Nominatim; self-intersection detection is deliberately limited to obvious simple-ring crossings; and the Colney Heath professional golden test awaits the Director-supplied boundary and expected manual result.

Sprint 0 technical acceptance evidence is indexed at
[`docs/acceptance/sprint-0/ACCEPTANCE_REPORT.md`](docs/acceptance/sprint-0/ACCEPTANCE_REPORT.md).
