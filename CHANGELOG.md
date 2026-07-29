# Changelog

All notable changes are recorded here.

## [Unreleased]

### Reconciled

- `DFT-0.1.2` / `FZ-0.1.1` replace the separate June 2024 ArcGIS Flood Zone
  layers with the Environment Agency's current unified OGC API - Features
  collection.
- OGC API and WFS now reproduce the same Aynsworth Avenue source vectors:
  FZ3 1,823.1995 m² (36.8326%), FZ2 2,678.4460 m² (54.1105%) and residual FZ1
  448.3127 m² (9.0569%). The company reference remains recorded without forcing
  the current output.
- The adapter classifies `flood_zone`, preserves source attributes, follows
  same-origin pagination, de-duplicates feature IDs and rejects unknown schema
  values and unsafe/repeated links.

### Corrected

- `DFT-0.1.1` presents stronger, unambiguous Flood Zone colours beneath the
  red-line boundary and a fixed A4-landscape, single-page map figure.
- `GEO-0.1.1` applies the OSGB36 datum transformation for EPSG:27700 rather
  than an ellipsoid-only conversion; the approved Aynsworth Avenue boundary
  and a published coordinate control are retained as regressions.
- Aynsworth Avenue replaces Colney Heath as the approved Sprint 0 golden case.
  Current live vector outputs are recorded against, but do not reproduce, the
  supplied reference flood-zone values.

### Added

- Sprint 0 candidate `DFT-0.1.0`.
- Leaflet map, location search, drawing/editing/deletion and single-geometry GeoJSON import.
- Environment Agency vector adapter with bounded queries, pagination, response validation, timeout and error handling.
- EPSG:27700 transformation and exclusive Flood Zone 3, 2 and residual 1 calculations.
- Result table, deterministic qualified narrative, clipboard support and consultant diagnostics.
- Browser-printable A4 landscape map layout.
- Synthetic deterministic regression suite and mocked service tests.
- Colney Heath golden-test placeholder without fabricated geometry or expected values.
- CI and controlled GitHub Pages workflow.
- Informational c8 coverage reporting with text, LCOV and JSON-summary output.
- CI coverage artifact upload and manual-only Pages deployment trigger.
- Weekly grouped Dependabot checks for npm and GitHub Actions dependencies.
- Localhost-only synthetic browser-acceptance fixtures and a committed Sprint 0
  technical evidence pack.
