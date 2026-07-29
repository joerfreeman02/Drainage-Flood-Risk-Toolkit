# Sprint 0 technical acceptance report

Status: Sprint 0.2 correction validated locally; golden flood-zone comparison is
not within tolerance and requires Product Owner dataset reconciliation.

## Candidate assessed

- Toolkit `DFT-0.1.1`
- Flood Zone module `FZ-0.1.0`
- Spatial engine `GEO-0.1.1`
- Branch `sprint-0/flood-zone-spatial-prototype`
- Golden site `East Herts DC, Bishop’s Stortford, Aynsworth Avenue, 5351`

## Sprint 0.2 corrections

- The flood layers use stronger, distinct blue values over a subdued base map.
  Dedicated panes keep the red-line boundary above both flood layers.
- The compact legend is part of the map figure and uses the exact layer colours.
- Print output is constrained to one fixed A4-landscape figure containing title,
  project/site fields, map, red line, flood zones, legend, north arrow, scale,
  attribution, date and all module versions.
- EPSG:27700 now applies the OSGB36 datum shift. The earlier ellipsoid-only
  definition displaced live WGS84 features by approximately 100 metres.

## Aynsworth Avenue golden comparison

The exact 19-vertex polygon from `2026.07_GIS/ATLAS Files/SiteBoundary.shp` was
converted from OSGB36/British National Grid to WGS84 without redrawing it. Its
direct BNG area is 4,949.9582 m². Live data were retrieved on 29 July 2026 from
the configured Environment Agency Flood Map for Planning Feature Service
(configured revision 20 May 2026).

Tolerance: the larger of 1.0% of the reference value or 10 m² for areas, and
1.0 percentage point for percentages. This is a proportionate engineering
comparison tolerance for a 0.495 ha site; it is not a survey-accuracy statement.

| Classification | Toolkit area (m²) | Reference area (m²) | Absolute difference (m²) | Difference (%) | Toolkit site (%) | Reference site (%) | Absolute percentage-point difference |
|---|---:|---:|---:|---:|---:|---:|---:|
| Total site | 4,949.9582 | 4,950.0 | 0.0418 | 0.0008% | 100.0% | 100.0% | 0.0 |
| Flood Zone 3 | 0.0000 | 1,594.8 | 1,594.8000 | 100.0000% | 0.0% | 32.2% | 32.2 |
| Flood Zone 2 | 4,311.4079 | 2,663.4 | 1,648.0079 | 61.8770% | 87.1% | 53.8% | 33.3 |
| Flood Zone 1 | 638.5503 | 691.8 | 53.2497 | 7.6978% | 12.9% | 14.0% | 1.1 |

The site area is within tolerance. The flood classifications are not. Geometry
and CRS handling were checked: correcting the omitted OSGB36 datum shift fixed
the positional error and produced the authoritative site area. The remaining
material discrepancy is consistent with a data-source/revision difference: the
supplied example is pixelated and shows Flood Zone 3 extending across the site,
whereas the current live vector feature geometry does not intersect the site.
The spatial precedence logic was not altered speculatively.

## Executed evidence

- All 30 deterministic tests passed, including published-coordinate OSGB36
  transformation and authoritative Aynsworth boundary-area regressions.
- c8 produced text, LCOV and JSON-summary coverage.
- A live Environment Agency smoke test passed.
- The browser imported the exact converted Aynsworth geometry and completed a
  live analysis: 4,949.9582 m²; Flood Zone 3 0.0%; Flood Zone 2 87.1%; Flood
  Zone 1 12.9%; raw total 100.000000%; 3 intersecting of 13 retrieved features.
- UK location search returned a location and did not create a boundary.
- Polygon, MultiPolygon and polygon-with-hole acceptance paths were exercised
  through localhost-only synthetic fixtures.
- Unsupported geometry and multiple unrelated features were rejected without a
  percentage result.
- Copy, rerun, clear, layer-toggle, edit activation and delete controls were
  exercised.
- The populated fixed A4-landscape map-layout preview was visually inspected.
  A browser-generated PDF was confirmed as one page, rendered back to PNG and
  visually inspected with project/site details, red line, Flood Zone layers,
  compact legend, north arrow, scale, attribution, date and versions visible.
  Interactive editing/layer controls were absent and no browser console errors
  or warnings were reported.

## Evidence index

- [Automated browser results](AUTOMATED_BROWSER_TEST_RESULTS.md)
- [CI verification](CI_VERIFICATION.md)
- [Coverage baseline](COVERAGE_BASELINE.md)
- [Dependabot status](DEPENDABOT_STATUS.md)
- [Known acceptance limitations](KNOWN_ACCEPTANCE_LIMITATIONS.md)
- [Fixture descriptions](TEST_FIXTURES.md)
- [Sanitised live diagnostic summary](diagnostics/live-browser-summary.json)
- [Screenshots](screenshots/)

## Documentation review

The README, changelog, release notes, Sprint 0 specification, test plan, data
sources, reuse register, known limitations, repository instructions and all four
Sprint 0 ADRs were reviewed. No Sprint 1 data or conclusions were added. The
20 May 2026 dataset revision remains recorded as configured metadata. Aynsworth
Avenue supersedes Colney Heath as the primary Sprint 0 golden case.

## Engineering conclusion

The presentation and CRS corrections are suitable for draft-PR technical review,
but the live flood-zone result is not acceptable against the supplied reference
within the stated tolerance. Product Owner confirmation of the authoritative
flood dataset/revision is required before golden acceptance. Formal Product Owner
and Technical Director decisions remain outstanding.
