import { ANALYSIS, DATASET } from './config.js';
import { bngBoundingBox, transformGeometry } from './geometry.js';

function crs84BoundingBox(bngBbox) {
  const [minX, minY, maxX, maxY] = bngBbox;
  const corners = transformGeometry({
    type: 'Polygon',
    coordinates: [[
      [minX, minY], [maxX, minY], [maxX, maxY],
      [minX, maxY], [minX, minY]
    ]]
  }, 'EPSG:27700', 'EPSG:4326').coordinates[0];
  return [
    Math.min(...corners.map(point => point[0])),
    Math.min(...corners.map(point => point[1])),
    Math.max(...corners.map(point => point[0])),
    Math.max(...corners.map(point => point[1]))
  ];
}

function floodZone(feature) {
  const value = feature?.properties?.flood_zone;
  if (value === 'FZ2' || value === '2' || value === 2) return 2;
  if (value === 'FZ3' || value === '3' || value === 3) return 3;
  throw new Error('The Environment Agency response contained an unrecognised flood_zone value.');
}

export class EnvironmentAgencyFloodZoneAdapter {
  constructor({ fetchImpl = globalThis.fetch, config = DATASET } = {}) {
    this.fetch = fetchImpl.bind(globalThis);
    this.config = config;
  }

  metadata() {
    return { ...this.config };
  }

  async fetchCollection(bbox, signal) {
    const zone2 = [], zone3 = [], seenIds = new Set(), visitedPages = new Set();
    const initialUrl = new URL(
      `${this.config.serviceRoot.replace(/\/$/, '')}/collections/${encodeURIComponent(this.config.collection)}/items`
    );
    initialUrl.searchParams.set('bbox', crs84BoundingBox(bbox).join(','));
    initialUrl.searchParams.set('limit', String(this.config.pageSize));
    initialUrl.searchParams.set('f', 'application/geo+json');
    let url = initialUrl;
    while (url) {
      if (visitedPages.has(String(url))) throw new Error('The Environment Agency service returned a repeated pagination link.');
      visitedPages.add(String(url));
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
        const zone = floodZone(feature);
        if (feature.id !== undefined && seenIds.has(String(feature.id))) continue;
        if (feature.id !== undefined) seenIds.add(String(feature.id));
        (zone === 2 ? zone2 : zone3).push(feature);
      }
      const next = payload.links?.find(link => link?.rel === 'next' && link.href);
      if (!next) {
        url = null;
        continue;
      }
      const nextUrl = new URL(next.href, url);
      if (nextUrl.origin !== initialUrl.origin) {
        throw new Error('The Environment Agency service returned an unsafe pagination link.');
      }
      url = nextUrl;
    }
    return { zone2, zone3 };
  }

  async retrieve(siteGeometry) {
    const bbox = bngBoundingBox(siteGeometry, ANALYSIS.requestMarginMetres);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const retrievedAt = new Date().toISOString();
    try {
      const { zone2, zone3 } = await this.fetchCollection(bbox, controller.signal);
      const features = [...zone2, ...zone3];
      return {
        zone2, zone3, bbox, retrievedAt, metadata: this.metadata(),
        sourceSummary: {
          origins: [...new Set(features.map(feature => feature.properties.origin).filter(Boolean))].sort(),
          floodSources: [...new Set(features.map(feature => feature.properties.flood_source).filter(Boolean))].sort()
        }
      };
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
