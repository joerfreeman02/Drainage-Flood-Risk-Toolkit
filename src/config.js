export const VERSIONS = Object.freeze({
  toolkit: 'DFT-0.1.2',
  floodZone: 'FZ-0.1.1',
  spatialEngine: 'GEO-0.1.1',
  status: 'Sprint 0 candidate'
});

export const BUILD = Object.freeze({
  timestamp: typeof __BUILD_TIME__ === 'undefined' ? 'development' : __BUILD_TIME__,
  commit: typeof __BUILD_COMMIT__ === 'undefined' ? 'development' : __BUILD_COMMIT__
});

export const CRS = Object.freeze({
  map: 'EPSG:4326 / Web Mercator display',
  analysis: 'EPSG:27700 (British National Grid)'
});

export const DATASET = Object.freeze({
  title: 'Flood Map for Planning - Flood Zones',
  publisher: 'Environment Agency',
  metadataId: '04532375-a198-476e-985e-0579a0a11b47',
  revisionDate: '2026-05-20',
  crs: 'EPSG:27700',
  licence: 'Open Government Licence',
  attribution: '© Environment Agency copyright and/or database right 2025. All rights reserved.',
  serviceType: 'OGC API - Features (vector)',
  serviceRoot: 'https://environment.data.gov.uk/geoservices/datasets/04532375-a198-476e-985e-0579a0a11b47/ogc/features/v1',
  collection: 'Flood_Zones_2_3_Rivers_and_Sea',
  serviceSchemaUpdate: '83900',
  pageSize: 1000,
  timeoutMs: 20000
});

export const ANALYSIS = Object.freeze({
  areaToleranceSqM: 0.01,
  percentageTolerance: 0.05,
  smallSiteWarningSqM: 10,
  requestMarginMetres: 50
});
