# Data sources

## Flood Map for Planning - Flood Zones

| Field | Value |
|---|---|
| Publisher | Environment Agency |
| Metadata identifier | `04532375-a198-476e-985e-0579a0a11b47` |
| Dataset revision | 20 May 2026 |
| Creation / publication | 29 January 2025 / 25 March 2025 |
| Dataset CRS | EPSG:27700 |
| Update frequency | As needed |
| Licence | Open Government Licence |
| Attribution | © Environment Agency copyright and/or database right 2025. All rights reserved. |

Official metadata: `https://environment.data.gov.uk/dataset/04532375-a198-476e-985e-0579a0a11b47`

## Selected service

The prototype uses the official Environment Agency ArcGIS Feature Service:

`https://environment.data.gov.uk/KB6uNVj5ZcJr7jUP/ArcGIS/rest/services/Flood_Map_for_Planning/FeatureServer`

- layer 1: Flood Zone 3;
- layer 2: Flood Zone 2.

This is a proper vector feature service with polygon geometries, EPSG:27700 source reference, GeoJSON query output, server-side bounding-box intersection and paging. It was selected over WMS because analysis must never derive coverage from pixels. The dataset also publishes WFS and OGC API Features; the adapter boundary permits migration if operational testing demonstrates that service is more reliable.

Requests use the site BNG envelope plus 50 m, `inSR=27700`, `outSR=4326`, intersection filtering, 1,000-feature pages and a 20-second shared timeout. The adapter validates every FeatureCollection and Polygon/MultiPolygon before returning provider-neutral data.

## Meaning and limitations

- Flood Zone 1 is not a supplied layer; it is the residual outside Flood Zones 2 and 3.
- The dataset shows present-day river and sea Flood Zones for planning and ignores the benefits of flood defences.
- It indicates risk to an area and is not suitable for determining risk to an individual property.
- Flood Zones do not include climate change in this Sprint.
- Functional floodplain / Flood Zone 3b is not identified by this dataset.
- Users must decide whether the dataset is suitable for their intended use.
- Some source polygons are very large; a bounded query can return polygons extending beyond the request envelope.
- Live service, CORS and rate-limit availability are outside this static application's control.

## Base map and search

OpenStreetMap standard tiles provide context with © OpenStreetMap contributors attribution. Public Nominatim performs user-triggered UK location search. Search only centres the map and never creates the site boundary.
