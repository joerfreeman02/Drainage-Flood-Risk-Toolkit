# Flood-data source reconciliation

Date: 29 July 2026
Decision scope: Sprint 0 Flood Zone 1/2/3 prototype only
Golden boundary: East Herts DC, Bishop's Stortford, Aynsworth Avenue, 5351

## Decision

The production adapter now uses the Environment Agency's current unified OGC
API - Features collection, `Flood_Zones_2_3_Rivers_and_Sea`, from dataset
metadata identifier `04532375-a198-476e-985e-0579a0a11b47`.

The previously configured ArcGIS FeatureServer is rejected as the production
source. Its two separate Flood Zone layers identify their source tables as
`FLOOD_MAP_FOR_PLANNING_20240613_FLOOD_ZONE_2` and
`FLOOD_MAP_FOR_PLANNING_20240613_FLOOD_ZONE_3`, with June 2024 edit timestamps.
That is not the 20 May 2026 dataset revision represented by the current
authoritative dataset record and services.

No source was selected because it was closest to the company reference. The
selection follows publisher authority, revision currency, schema consistency,
vector suitability and reproducibility.

## Authoritative hierarchy

1. The Environment Agency dataset record and product description establish
   meaning, lineage, revision, schema and available distributions.
2. The current downloadable GeoPackage/GeoJSON distribution is the archival
   vector baseline. The national files published on the dataset page were
   approximately 969 MB and 4.49 GB respectively, so a full download was not
   proportionate for this browser-prototype reconciliation.
3. OGC API - Features is the selected live analytical vector source. It is
   web-native GeoJSON, exposes a single current collection, supports bounded
   requests and supplies explicit `next` links for pagination.
4. WFS 2.0 is an independent current-vector check and operational fallback
   candidate. It returned byte-equivalent feature geometry and properties for
   the bounded golden-site extract.
5. WMS is visual corroboration only. No area or classification is calculated
   from pixels.
6. The legacy ArcGIS FeatureServer is retained only as forensic evidence of the
   previous result; it is not an authoritative current production source.

## Published metadata and schema

| Item | Finding |
|---|---|
| Publisher | Environment Agency |
| Metadata identifier | `04532375-a198-476e-985e-0579a0a11b47` |
| Creation / publication | 29 January 2025 / 25 March 2025 |
| Dataset revision | 20 May 2026 |
| Update frequency | As needed |
| Dataset CRS | EPSG:27700 |
| Selected service | OGC API - Features |
| Selected collection | `Flood_Zones_2_3_Rivers_and_Sea` |
| OGC storage CRS | EPSG:27700 |
| OGC response CRS used | CRS84 / longitude-latitude GeoJSON |
| WFS version / feature type | 2.0.0 / `dataset-04532375-a198-476e-985e-0579a0a11b47:Flood_Zones_2_3_Rivers_and_Sea` |
| WFS/WMS capabilities sequence | `83900` |
| WMS analytical layer | `Flood_Zones_2_3_Rivers_and_Sea` |
| Attributes used | `flood_zone` for FZ2/FZ3 classification |
| Attributes retained | `origin`, `flood_source` for traceability |

The 30 June 2026 product description names the unified collection and the
fields `Origin`, `Flood_zone` and `Flood_source`. The live GeoJSON exposes their
lower-case equivalents. On this extract `flood_zone` contained only `FZ2` and
`FZ3`; `flood_source` was `river`; and `origin` included `modelled`,
`recorded`, `modelled and recorded`, and `direct rainfall model`.

## Exact-site query

The approved 19-vertex site boundary was used without redrawing. The analysis
envelope was the site BNG envelope plus the configured 50 m margin:

`549363.907493491,222472.49633800273,549512.7268099056,222713.9009014308`

For OGC API - Features this was transformed to the enclosing CRS84 envelope:

`0.1686082052496192,51.88077592660735,0.17087313412670305,51.88298465667291`

The OGC request returned 11 of 11 matched features. Four intersected the exact
site after client-side clipping. The bounded WFS request returned the same 11
feature IDs, properties and geometries. The deterministic committed extract is
`tests/fixtures/golden/aynsworth-avenue/authoritative-flood-zones.geojson`.

## Reconciled results

All professional areas were calculated after transforming geometry to
EPSG:27700. Flood Zone 3 has precedence; Flood Zone 2 is its union with Flood
Zone 3 removed; Flood Zone 1 is the residual site area.

| Classification | Current authoritative area (m²) | Current site % | Company reference area (m²) | Reference site % | Area difference (m²) | Percentage-point difference |
|---|---:|---:|---:|---:|---:|---:|
| Total site | 4,949.9582 | 100.0000% | 4,950.0 | 100.0% | -0.0418 | 0.0000 |
| Flood Zone 3 | 1,823.1995 | 36.8326% | 1,594.8 | 32.2% | +228.3995 | +4.6326 |
| Flood Zone 2 | 2,678.4460 | 54.1105% | 2,663.4 | 53.8% | +15.0460 | +0.3105 |
| Flood Zone 1 | 448.3127 | 9.0569% | 691.8 | 14.0% | -243.4873 | -4.9431 |

Against the Sprint 0.2 tolerance (the larger of 1% or 10 m², plus 1 percentage
point), total site and Flood Zone 2 are within tolerance. Flood Zones 3 and 1
are not. The company reference therefore remains a useful historical benchmark,
but it is not a reproducible statement of the current authoritative revision.

For comparison, the superseded ArcGIS result recorded on 29 July 2026 was
FZ3 0.0000 m², FZ2 4,311.4079 m² and residual FZ1 638.5503 m², from 13 returned
features (three intersecting). The material change is explained by source
revision/schema, not by altering the accepted site or forcing spatial output.

## WMS visual corroboration

An official WMS 1.3.0 `GetMap` was requested for the same EPSG:27700 envelope
and the current unified layer. The rendered FZ3/FZ2 pattern visibly crosses the
site envelope and is consistent with the current vector result. This check is
qualitative only; WMS pixels were not measured, classified or vectorised.

## Runtime behaviour

- The adapter requests the bounded unified OGC collection and follows explicit
  same-origin `next` links.
- Polygon and MultiPolygon geometries, including interior rings, pass through
  unchanged.
- Stable feature IDs are de-duplicated across pages. Geometry unions remove
  fragment/overlap double counting, and FZ3 precedence makes outputs exclusive.
- Unknown or missing `flood_zone` values, malformed FeatureCollections,
  unsupported geometry, unsafe/repeated pagination, HTTP failures, timeouts and
  browser network/CORS failures are errors. None is interpreted as empty data.
- Valid empty FeatureCollections remain explicit zero-feature results.
- `origin` and `flood_source` are retained on features and summarised in
  consultant diagnostics; they do not override `flood_zone` classification.

## Evidence and residual limits

- OGC and WFS returned identical bounded source vectors during reconciliation.
- The committed authoritative extract reproduces the stated areas in the
  deterministic test suite.
- WFS/WMS availability and schema sequence are external service state and can
  change independently of this static application.
- National-download equivalence was checked through the current published
  schema and bounded WFS vector rather than downloading nearly 1-4.5 GB.
- Flood Zone 1 remains derived; climate change, FZ3b and other flood sources
  remain outside Sprint 0.

## Source references

- Dataset record:
  `https://environment.data.gov.uk/dataset/04532375-a198-476e-985e-0579a0a11b47`
- Product description:
  `https://environment.data.gov.uk/api/file/download?fileDataSetId=455d2eb3-3065-4d20-871b-c4d5dee23f67&fileName=Flood+Zones+Product+Description.pdf`
- OGC API root:
  `https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/ogc/features/v1`
- WFS:
  `https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/wfs`
- WMS:
  `https://environment.data.gov.uk/spatialdata/flood-map-for-planning-flood-zones/wms`
- Superseded ArcGIS service:
  `https://environment.data.gov.uk/KB6uNVj5ZcJr7jUP/ArcGIS/rest/services/Flood_Map_for_Planning/FeatureServer`
