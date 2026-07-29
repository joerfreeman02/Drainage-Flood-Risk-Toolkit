import { BUILD, CRS, DATASET, VERSIONS } from './config.js';

export function diagnosticsSnapshot(state) {
  return {
    generatedAt: new Date().toISOString(),
    versions: VERSIONS,
    build: BUILD,
    endpoint: DATASET.serviceRoot,
    dataset: {
      title: DATASET.title, metadataId: DATASET.metadataId,
      revisionDate: DATASET.revisionDate, retrievalTimestamp: state.retrievedAt || null
    },
    crs: CRS,
    siteGeometryType: state.siteGeometry?.type || null,
    siteAreaSqM: state.result?.siteAreaSqM || null,
    sourceFeatureCount: state.result?.sourceFeatureCount ?? null,
    intersectingFeatureCount: state.result?.intersectingFeatureCount ?? null,
    percentageTotal: state.result?.percentageTotal ?? null,
    warnings: state.result?.warnings || [],
    latestError: state.latestError || null,
    browser: navigator.userAgent
  };
}
