# Known limitations

- This is a controlled Sprint 0 candidate, not an accepted production baseline.
- Live calculations require browser access and CORS support from the Environment Agency vector service. Failures produce no percentages.
- The ArcGIS feature service is currently selected; WFS/OGC API Features migration remains possible behind the adapter.
- Public Nominatim search availability and usage policy are external dependencies. It centres the map only.
- Leaflet.draw creates a single simple polygon; MultiPolygons and holes are supported through import.
- Multiple GeoJSON features are rejected rather than combined; selection/preparation must occur outside the prototype.
- Validation detects invalid coordinate ranges, closure, zero area and obvious non-adjacent segment crossings. It is not a full OGC validity repair engine.
- Polygon clipping and projection have floating-point tolerances. Very small sites and sub-display-precision intersections are warned.
- Environment Agency source detail can make large/complex sites slow or exceed practical browser limits despite paging.
- Flood Zone 1 is calculated as residual and is not retrieved as a source feature.
- No climate change, functional floodplain/FZ3b or non-river/sea risk source is assessed.
- Browser printing depends on the selected browser/printer PDF engine; direct PNG export is deliberately omitted.
- No offline mode or service worker is provided.
- Colney Heath is not verified because its red line and expected result have not been supplied.
