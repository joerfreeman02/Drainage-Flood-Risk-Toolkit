# Coverage baseline

Tool: c8 12.0.0  
Command: `pnpm test:coverage`  
Date: 29 July 2026

| Category | Covered | Total | Baseline |
|---|---:|---:|---:|
| Statements | 302 | 309 | 97.73% |
| Branches | 115 | 142 | 80.98% |
| Functions | 25 | 25 | 100.00% |
| Lines | 302 | 309 | 97.73% |

## Scope

The baseline covers `src/geometry.js`, `src/ea-adapter.js`, `src/report.js` and
`src/config.js`: the deterministic spatial engine, live-adapter boundary,
narrative generator and central configuration. UI/map modules require DOM and
Leaflet and are assessed by real-browser acceptance rather than being excluded to
inflate a whole-application claim.

Generated output is written to the ignored `coverage/` directory:

- terminal text summary;
- `coverage/lcov.info`;
- `coverage/coverage-summary.json`.

CI uploads the directory as `sprint-0-coverage`. This first baseline is
informational; no blocking threshold is configured.

## Codecov gate

The adoption gate is reached: meaningful spatial tests exist, recognised output
is generated in CI and a first baseline is recorded. Codecov is recommended as an
informational integration, but was not installed and is not a required check.

Minimal Product Owner steps:

1. In GitHub Marketplace, install the Codecov GitHub App for this private
   repository only.
2. Ask the Technical Director to approve adding an informational Codecov upload
   step to the existing CI workflow.
3. Keep patch/project checks informational and add no failing threshold until a
   later governed decision.
