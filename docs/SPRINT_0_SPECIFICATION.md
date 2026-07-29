# Sprint 0 specification

## Objective

Prove the reusable browser workflow: site boundary + authoritative vector dataset → spatial intersection → map → calculated result → report-ready wording.

## Accepted input

- One GeoJSON Polygon or MultiPolygon in EPSG:4326.
- Valid interior rings.
- One feature only when supplied as a FeatureCollection.
- A polygon created or edited with Leaflet.draw.

Malformed JSON, empty/unsupported geometry, invalid coordinate ranges, unclosed or negligible rings, obvious simple self-crossings and multiple unconfirmed features are rejected without producing percentages.

## Data and analysis

The adapter requests only Flood Zone 2 and 3 polygons intersecting the site EPSG:27700 bounding box plus a 50 m margin. Pages are requested until exhausted. Responses are validated and converted to a provider-neutral `{zone2, zone3, metadata, retrievedAt}` result.

All site and source coordinates are transformed from EPSG:4326 to EPSG:27700 before Boolean operations. Each potentially very large source feature is clipped to the site first; the site-local fragments are then unioned by class. Classification order is:

1. site ∩ Flood Zone 3;
2. (site ∩ Flood Zone 2) − classified Flood Zone 3;
3. site − union(Flood Zone 2, Flood Zone 3).

Planar polygon area preserves holes and MultiPolygons. Internal values remain unrounded. Display percentages use one decimal; a maximum 0.2-point display correction is assigned to the largest class to counter decimal rounding only. The unrounded total is separately exposed.

## User output

The application shows site area in m² and hectares, each exclusive class area and percentage, unrounded total check, feature totals, source/retrieval/method details, warnings, qualified narrative, diagnostics and an A4 landscape print map.

## Acceptance status

This specification describes a Sprint 0 candidate. Manual acceptance and the first professional golden result are outstanding.
