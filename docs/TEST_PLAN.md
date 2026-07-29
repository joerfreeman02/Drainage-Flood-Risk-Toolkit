# Sprint 0 test plan

## Automated deterministic gate

Run `pnpm test`. The Node test runner covers:

- wholly Flood Zone 1, 2 and 3;
- two-zone and three-zone splits;
- overlapping source features and Flood Zone 3 precedence;
- percentage total and display rounding;
- polygon holes;
- MultiPolygon site and source geometry;
- malformed, multiple, zero-area and self-crossing import rejection;
- EPSG:4326 ↔ EPSG:27700 transformation;
- known 100 m × 100 m synthetic area;
- mocked response normalisation and pagination;
- service failure, timeout, invalid geometry and valid empty response;
- wholly Flood Zone 1 and mixed-zone wording.

Fixtures are synthetic or mocked. Default tests do not require network access.

Run `pnpm test:coverage` for the same deterministic suite with text, LCOV and
JSON-summary coverage output. The informational scope covers the deterministic
spatial engine, Environment Agency adapter, narrative generator and central
configuration. Browser-only UI modules are assessed separately in the real-browser
matrix; no blocking threshold is applied.

## Optional external check

Run `pnpm test:live`. This makes a bounded request to the configured Environment Agency service. Failure does not invalidate deterministic engine results but must be reported accurately.

## Manual browser matrix

At minimum:

1. Load at desktop width and confirm no console errors.
2. Repeat at approximately 1024 px laptop width.
3. Search a UK postcode/address; confirm the map centres and no boundary is invented.
4. Draw, edit and delete a polygon.
5. Import a valid Polygon, a MultiPolygon and a polygon with a hole.
6. Attempt malformed JSON and multiple features; confirm no percentage appears.
7. Run a live successful analysis where the service permits.
8. Confirm loading state, red line, layer toggle, legend, north arrow, scale bar and attribution.
9. Confirm site area, three exclusive classes and total check.
10. Confirm the no-intersection response via a valid empty mocked/browser test environment if live geography cannot guarantee it.
11. Copy narrative and diagnostics.
12. Clear analysis, rerun, and reset the boundary.
13. Simulate network failure and confirm it is not presented as no intersection.
14. Open browser print preview and inspect A4 landscape extent, title, map, legend, scale, north arrow, attribution, date and versions.

The executed Sprint 0 automation and any remaining manual items are recorded in
`acceptance/sprint-0/AUTOMATED_BROWSER_TEST_RESULTS.md`.

## Golden test

`tests/fixtures/golden/colney-heath/` is inactive until the Drainage Director supplies the authoritative red-line GeoJSON and expected manual result.
