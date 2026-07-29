# Sprint 0 technical acceptance report

Status: Sprint 0.3 authoritative source reconciliation implemented and
validated; formal Product Owner and Technical Director decisions remain open.

## Candidate assessed

- Toolkit `DFT-0.1.2`
- Flood Zone module `FZ-0.1.1`
- Spatial engine `GEO-0.1.1`
- Branch `sprint-0/flood-zone-spatial-prototype`
- Golden site `East Herts DC, Bishop's Stortford, Aynsworth Avenue, 5351`

## Retained Sprint 0.2 corrections

- Strong, distinct blue Flood Zone colours remain below the red-line boundary.
- The compact legend remains part of the fixed A4-landscape map figure.
- EPSG:27700 continues to apply the OSGB36 datum shift.
- Polygon/MultiPolygon interior rings and exclusive FZ3 → FZ2 → residual FZ1
  calculation remain unchanged.

## Sprint 0.3 source reconciliation

The current Environment Agency dataset record, product description, OGC API -
Features, WFS 2.0, downloadable-vector metadata and WMS 1.3.0 were checked.
The selected analytical source is the unified current OGC collection
`Flood_Zones_2_3_Rivers_and_Sea`.

The previous ArcGIS service exposes separate layer source names dated 13 June
2024. It is superseded for production calculations. The OGC and WFS bounded
extracts returned the same 11 IDs, properties and geometries. WMS visually
corroborated the current FZ3/FZ2 pattern; no calculation used pixels.

See [Flood-data source reconciliation](FLOOD_DATA_SOURCE_RECONCILIATION.md) for
the hierarchy, endpoints, schema, exact query envelopes and forensic findings.

## Aynsworth Avenue golden comparison

The exact approved 19-vertex polygon was used without redrawing. Its professional
EPSG:27700 area is 4,949.9582 m². The current authoritative result is:

| Classification | Toolkit area (m²) | Toolkit site % | Company reference area (m²) | Reference site % | Area difference (m²) | Percentage-point difference |
|---|---:|---:|---:|---:|---:|---:|
| Total site | 4,949.9582 | 100.0000% | 4,950.0 | 100.0% | -0.0418 | 0.0000 |
| Flood Zone 3 | 1,823.1995 | 36.8326% | 1,594.8 | 32.2% | +228.3995 | +4.6326 |
| Flood Zone 2 | 2,678.4460 | 54.1105% | 2,663.4 | 53.8% | +15.0460 | +0.3105 |
| Flood Zone 1 | 448.3127 | 9.0569% | 691.8 | 14.0% | -243.4873 | -4.9431 |

Against the Sprint 0.2 comparison tolerance (the larger of 1% or 10 m², plus
1 percentage point), total site and Flood Zone 2 pass; Flood Zones 3 and 1 do
not. The company figures remain recorded as a historical benchmark. They were
not treated as authoritative current geometry or used to force the output.

## Executed evidence

- Deterministic tests cover OGC classification, mixed FZ2/FZ3 responses,
  next-link pagination, duplicate IDs, empty responses, HTTP/network/timeout
  failures, malformed schema, unsafe/repeated pagination, overlap precedence,
  fragments, interior rings and the committed authoritative golden extract.
- A live OGC service smoke test exercises the configured source.
- Browser acceptance imports the exact golden boundary and retrieves 11 current
  features, four intersecting, producing 36.8% FZ3, 54.1% FZ2 and 9.1% FZ1.
- The populated map, layer order, controls, diagnostics and print-preview DOM
  are inspected in a real browser.
- A single-page A4-landscape PDF evidence artifact was generated from the
  inspected preview, rendered with Poppler and visually checked for the title,
  site, map, red line, zones, legend, north arrow, scale, attribution, date and
  versions.
- Lint, deterministic tests, coverage, build and aggregate check are required
  before the candidate is pushed.

## Evidence index

- [Flood-data source reconciliation](FLOOD_DATA_SOURCE_RECONCILIATION.md)
- [Automated browser results](AUTOMATED_BROWSER_TEST_RESULTS.md)
- [CI verification](CI_VERIFICATION.md)
- [Coverage baseline](COVERAGE_BASELINE.md)
- [Dependabot status](DEPENDABOT_STATUS.md)
- [Known acceptance limitations](KNOWN_ACCEPTANCE_LIMITATIONS.md)
- [Fixture descriptions](TEST_FIXTURES.md)
- [Sanitised live diagnostic summary](diagnostics/live-browser-summary.json)
- [Screenshots](screenshots/)

## Documentation and boundary review

The changelog, data sources, known limitations, acceptance evidence, repository
instructions, reuse register and Sprint 0 ADR boundaries were reviewed. No
Sprint 1 data or professional planning conclusion was added. Live-data code
remains isolated from geometry and UI. The shared boundaries did not materially
change, so no ADR or reuse-register entry was required.

## Engineering conclusion

The current authoritative source is reproducible across the distinct OGC API,
WFS and WMS roles. The adapter migration and golden regression are suitable for
draft-PR technical review. Formal governance acceptance remains outstanding.
