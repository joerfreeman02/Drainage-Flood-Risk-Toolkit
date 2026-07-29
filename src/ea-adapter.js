import { ANALYSIS, DATASET } from './config.js';
import { bngBoundingBox } from './geometry.js';

export class EnvironmentAgencyFloodZoneAdapter {
  constructor({ fetchImpl = globalThis.fetch, config = DATASET } = {}) {
    this.fetch = fetchImpl.bind(globalThis);
    this.config = config;
  }

  metadata() {
    return { ...this.config };
  }

  async fetchLayer(layerId, bbox, signal) {
    const features = [];
    let offset = 0;
    while (true) {
      const parameters = new URLSearchParams({
        where: '1=1',
        geometry: bbox.join(','),
        geometryType: 'esriGeometryEnvelope',
        inSR: '27700',
        outSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        returnGeometry: 'true',
        resultOffset: String(offset),
        resultRecordCount: String(this.config.pageSize),
        f: 'geojson'
      });
      const url = `${this.config.serviceRoot}/${layerId}/query?${parameters}`;
      const response = await this.fetch(url, { signal, headers: { Accept: 'application/geo+json, application/json' } });
      if (response.status === 429) throw new Error('The Environment Agency service is rate limiting requests. Wait and retry.');
      if (!response.ok) throw new Error(`The Environment Agency service returned HTTP ${response.status}.`);
      let payload;
      try { payload = await response.json(); } catch { throw new Error('The Environment Agency service returned invalid JSON.'); }
      if (payload?.error) throw new Error(`The Environment Agency service reported: ${payload.error.message || 'unknown error'}.`);
      if (payload?.type !== 'FeatureCollection' || !Array.isArray(payload.features)) {
        throw new Error('The Environment Agency response was not a valid GeoJSON FeatureCollection.');
      }
      for (const feature of payload.features) {
        if (!feature?.geometry || !['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
          throw new Error('The Environment Agency response contained an unsupported geometry.');
        }
        features.push(feature);
      }
      if (payload.features.length < this.config.pageSize || payload.exceededTransferLimit === false) break;
      offset += payload.features.length;
      if (!payload.features.length) break;
    }
    return features;
  }

  async retrieve(siteGeometry) {
    const bbox = bngBoundingBox(siteGeometry, ANALYSIS.requestMarginMetres);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const retrievedAt = new Date().toISOString();
    try {
      const [zone3, zone2] = await Promise.all([
        this.fetchLayer(this.config.layerIds.floodZone3, bbox, controller.signal),
        this.fetchLayer(this.config.layerIds.floodZone2, bbox, controller.signal)
      ]);
      return { zone2, zone3, bbox, retrievedAt, metadata: this.metadata() };
    } catch (error) {
      if (error.name === 'AbortError') throw new Error(`The Environment Agency request timed out after ${this.config.timeoutMs / 1000} seconds.`);
      if (error instanceof TypeError || error.message === 'Failed to fetch') {
        throw new Error('The Environment Agency service could not be reached. Check network access and browser CORS, then retry.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
