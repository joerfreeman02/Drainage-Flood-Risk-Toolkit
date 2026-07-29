# Automated browser test results

Date: 29 July 2026  
Browser: Chromium 150 through the controlled in-app browser test surface  
Site: `Synthetic Sprint 0 Acceptance Site` / `Generic central London test extent`

## Passed

| Area | Executed result |
|---|---|
| Startup | Application, candidate versions and build identifier displayed; no visible startup error. |
| Project context | Name/address saved; `AL4 0NP` search succeeded; analysis remained disabled until a boundary existed. |
| Boundary | Synthetic Polygon, MultiPolygon and polygon-with-hole accepted; edit mode activated; delete cleared the site; unsupported Point and multiple features rejected with no result. |
| Live analysis | Loading state appeared; official EA request completed; FZ3 → FZ2 → residual FZ1 result totalled 100.000000%. |
| Result metadata | Dataset title, revision `2026-05-20`, retrieval date, feature counts, EPSG:27700 method and narrative displayed. |
| Controls | Narrative and diagnostics copied; FZ2 layer toggled off/on; rerun completed; clear analysis retained the boundary; delete cleared it. |
| Diagnostics | Versions, endpoint, dataset, retrieval, CRS, geometry type, raw area/total, feature counts and empty error were displayed without a raw payload or secret. |
| Print preview | Generic project/address, red line, both Flood Zone layers, legend, north arrow, scale, attribution, date and versions were visible; map was not blank or clipped. |
| Error state | Unsupported geometry displayed a clear error and produced no percentages; latest error appeared in diagnostics. |

The live result was 16,000,000 m²: FZ3 52.1%, FZ2 1.3%, FZ1 46.6%;
3 intersecting of 3 retrieved features.

## Deterministic error automation

The Node suite separately passed simulated service failure, browser-network
failure, timeout, invalid geometry and valid empty-response cases. Every failure
case asserts that failure is not converted into an empty/no-intersection result.

## Browser-surface constraints

- The controller cannot populate a native file chooser. Localhost-only,
  query-gated synthetic fixtures call the same boundary acceptance function used
  after file parsing. Malformed JSON parsing at the native chooser boundary remains
  covered deterministically and available for a short manual check.
- The controlled browser window has a fixed desktop viewport. The committed
  desktop evidence was inspected; 1024 px and narrower-window visual checks remain
  in the Product Owner checklist.
- The surface does not expose console/network event logs. Successful awaited
  Nominatim and EA operations, page state and visible errors were recorded instead.
- Native print/save dialogs and programmatic PDF export are not exposed.

Screenshots:

1. [Initial interface](screenshots/01-initial-interface.png)
2. [Red-line boundary](screenshots/02-red-line-boundary.png)
3. [Completed results](screenshots/03-completed-results.png)
4. [Diagnostics](screenshots/04-diagnostics.png)
5. [Print-layout preview](screenshots/05-print-layout-preview.png)
6. [Error handling](screenshots/06-error-handling.png)
