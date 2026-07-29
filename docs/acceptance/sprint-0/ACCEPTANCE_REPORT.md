# Sprint 0 technical acceptance report

Status: engineering evidence complete locally; not Product Owner acceptance and
not a frozen production baseline.

## Candidate assessed

- Toolkit `DFT-0.1.0`
- Flood Zone module `FZ-0.1.0`
- Spatial engine `GEO-0.1.0`
- Branch `sprint-0/flood-zone-spatial-prototype`
- Starting engineering commit `2f16a449476d9292df83f5a62e139274d9e33bd2`

## Executed evidence

- 28 deterministic tests passed, covering the 20 required spatial, adapter and
  narrative scenarios.
- c8 produced text, LCOV and JSON-summary coverage.
- A live Environment Agency smoke test passed.
- A real Chromium browser completed a live central-London synthetic analysis:
  16,000,000 m²; Flood Zone 3 52.1%; Flood Zone 2 1.3%; Flood Zone 1 46.6%;
  raw total 100.000000%; 3 intersecting of 3 retrieved features.
- UK location search returned a location and did not create a boundary.
- Polygon, MultiPolygon and polygon-with-hole acceptance paths were exercised
  through localhost-only synthetic fixtures.
- Unsupported geometry and multiple unrelated features were rejected without a
  percentage result.
- Copy, rerun, clear, layer-toggle, edit activation and delete controls were
  exercised.
- The map-layout preview was visually inspected with the generic project details,
  red line, Flood Zone layers, legend, north arrow, scale, attribution, date and
  versions visible.

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
20 May 2026 dataset revision remains recorded only as verified metadata. Colney
Heath remains explicitly unverified.

## Engineering conclusion

The candidate remains suitable for draft-PR technical review. GitHub-only status
and security settings must be read from an authenticated repository session; see
the CI and Dependabot records. Formal Product Owner and Technical Director
decisions remain outstanding.
