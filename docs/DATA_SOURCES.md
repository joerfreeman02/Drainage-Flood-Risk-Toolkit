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

The prototype uses the current official Environment Agency OGC API - Features
collection:

`https://environment.data.gov.uk/geoservices/datasets/04532375-a198-476e-985e-0579a0a11b47/ogc/features/v1/collections/Flood_Zones_2_3_Rivers_and_Sea/items`

The unified collection classifies polygons through `flood_zone` (`FZ2` or
`FZ3`) and retains `origin` and `flood_source`. Its storage CRS is EPSG:27700;
the browser requests bounded CRS84 GeoJSON and transforms professional
calculations back to EPSG:27700.

The dataset's WFS 2.0 service returned identical feature IDs, attributes and
geometry for the golden-site extract and is retained as an independent vector
check/fallback candidate. WMS is used only for visual corroboration because
analysis must never derive coverage from pixels. The national GeoPackage and
GeoJSON ZIPs remain the archival download baseline but are too large for
routine browser operation.

Requests use the site BNG envelope plus 50 m transformed to an enclosing CRS84
bbox, 1,000-feature pages and a 20-second timeout. The adapter follows explicit
same-origin `next` links, de-duplicates stable IDs and validates every
FeatureCollection, Polygon/MultiPolygon and `flood_zone` value before returning
provider-neutral data.

The previously configured ArcGIS FeatureServer exposes separate June 2024
source layers and is not used for production calculations. The complete
selection evidence is in
`docs/acceptance/sprint-0/FLOOD_DATA_SOURCE_RECONCILIATION.md`.

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
