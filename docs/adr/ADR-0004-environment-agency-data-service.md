# ADR-0004 — Environment Agency data service

- Status: Accepted for Sprint 0 candidate
- Date: 2026-07-29

## Context

The official metadata exposes WMS, WFS and OGC API Features. The official ArcGIS FeatureServer also exposes the current Flood Zone 2 and 3 polygon layers in EPSG:27700 with GeoJSON output, server-side envelope filtering and paging.

## Decision

Use the official ArcGIS Feature Service layers 1 and 2 behind an isolated adapter. Request only the BNG site envelope plus 50 m; return provider-neutral GeoJSON collections; validate responses; page at 1,000 features; apply a 20-second timeout; and distinguish empty responses from errors.

WMS is rejected for calculation because pixel colours are not authoritative polygon geometry. The OGC API remains the preferred open-standard migration target if live operational tests show compatible CORS, performance and paging.

## Consequences

Service URLs and layer IDs exist only in central configuration. A future BGS adapter can implement a similar interface without changing the geometry or map engines.
