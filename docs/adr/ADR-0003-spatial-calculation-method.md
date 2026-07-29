# ADR-0003 — Spatial calculation method

- Status: Accepted for Sprint 0 candidate
- Date: 2026-07-29

## Decision

Validate EPSG:4326 site/source GeoJSON, transform coordinates explicitly to EPSG:27700 using Proj4js, perform Boolean operations with maintained `polygon-clipping`, and calculate planar square-metre area using signed ring area with holes subtracted.

Clip each large source feature to the site before unioning the site-local fragments by class. Classify Flood Zone 3 first, remove it from Flood Zone 2, then calculate Flood Zone 1 as the residual. Use 0.01 m² geometry tolerance and 0.05 percentage-point total tolerance. Preserve internal unrounded values; display one decimal percentage and warn about hidden small intersections.

## Consequences

Areas are appropriate to the British National Grid rather than Web Mercator or spherical display coordinates. Polygon/MultiPolygon holes survive the pipeline. The engine remains independent of Leaflet and the Environment Agency response schema.
