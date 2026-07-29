# Transport Planner Toolkit reuse register

The local governing checkout at `Transport Planner Toolkit/source` was inspected read-only. Its pre-existing local changes were not touched. No transport-specific logic, data, wording or frozen module was copied.

| TPT source | Purpose observed | Treatment | Drainage modifications / ownership | Future shared-platform suitability |
|---|---|---|---|---|
| `index.html`, `assets/css/eas-theme.css` | Dashboard hierarchy, EAS blue/lime focus treatment, visible build string | Adapted design tokens and reimplemented layout | New drainage-specific responsive workspace and print map; owned by DFT | High: basic theme tokens and accessibility focus style |
| `assets/js/shell.js` | Browser-local project name/address context | Reimplemented | Smaller DFT project contract in `src/project-context.js`; no admin/library logic | High: provider-neutral project context after schema alignment |
| `assets/js/map.js` | Leaflet setup, OSM attribution, map fit/invalidate pattern | Reimplemented | Polygon red line, edit/delete, Flood Zone layers, scale and north arrow in `src/map.js` | High: map lifecycle and base-map contract |
| `assets/js/platform/mapping-framework.js` | Provider-neutral mapping boundary | Adapted concept | DFT map owns site/result layers and exposes small UI methods | High after both products accept a shared geometry contract |
| `assets/js/platform/diagnostics.js` | Structured, non-secret consultant diagnostics | Adapted concept | DFT JSON snapshot includes endpoint, CRS and spatial result details | High: diagnostics schema and copy/export boundary |
| `docs/SYSTEM_ARCHITECTURE.md` | Engine/UI separation, timeouts, failure not equal to empty, professional review | Adopted engineering controls | Applied to EA adapter, geometry and narrative modules | High: cross-product governance |
| `docs/adr/ADR-005-shared-mapping.md` | Frozen modules are not migrated without browser evidence | Adopted governance | DFT is independent; no frozen TPT module changed | High: platform migration control |
| `tests/run-tests.mjs` and test structure | Deterministic Node regression gate | Adapted approach | Node test runner with geometry and mocked service fixtures | High: test command conventions |
| `DEPLOYMENT_GUIDE.md`, README deployment note | Static GitHub Pages, no service worker during development | Reimplemented | Vite relative-base build and least-privilege workflows | High: static hosting control |

## Inspection scope

Dashboard/navigation, project context, Leaflet mapping, search and controls, styles, diagnostics, version display, tests, deployment, documentation, ADRs and mapping/export boundaries were inspected. TPT remains independently governed and unchanged by this work.
