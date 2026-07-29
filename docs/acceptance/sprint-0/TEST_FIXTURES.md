# Acceptance fixture descriptions

All fixtures are synthetic and carry no client or personal information.

- `tests/fixtures/browser-site.geojson`: generic central-London Polygon used for
  live service and map evidence.
- `src/acceptance-fixtures.js`: localhost-only, `acceptance-test` query fixtures
  for Polygon, MultiPolygon, Polygon with an interior ring, multiple unrelated
  features and unsupported Point geometry. The module is inactive on deployed
  hosts and in ordinary local use.
- `tests/fixtures/malformed.geojson`: malformed import rejection.
- `tests/fixtures/multiple-features.geojson`: explicit-selection rejection.
- deterministic geometry objects in `tests/geometry.test.js`: synthetic
  known-area, hole, MultiPolygon, overlap, precedence and zone-split cases.
- `tests/fixtures/golden/colney-heath/`: inactive placeholder only; it contains no
  fabricated boundary or expected professional result.
