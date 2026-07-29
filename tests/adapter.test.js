import test from 'node:test';
import assert from 'node:assert/strict';
import { EnvironmentAgencyFloodZoneAdapter } from '../src/ea-adapter.js';
import { fromBngMultiPolygon } from '../src/geometry.js';

const ring = [[500000, 200000], [500100, 200000], [500100, 200100], [500000, 200100], [500000, 200000]];
const site = { type: 'Polygon', coordinates: fromBngMultiPolygon([[[...ring]]]).coordinates[0] };
const serviceFeature = (id, floodZone = 'FZ2', properties = {}) => ({
  type: 'Feature',
  id,
  properties: { flood_zone: floodZone, origin: 'modelled', flood_source: 'river', ...properties },
  geometry: site
});

function response(payload, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => payload };
}

test('live-service responses are normalised into zone collections', async () => {
  const calls = [];
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async url => {
      calls.push(String(url));
      return response({
        type: 'FeatureCollection',
        features: [serviceFeature('a', 'FZ2'), serviceFeature('b', 'FZ3')]
      });
    }
  });
  const result = await adapter.retrieve(site);
  assert.equal(result.zone2.length, 1);
  assert.equal(result.zone3.length, 1);
  assert.equal(calls.length, 1);
  const url = new URL(calls[0]);
  assert.match(url.pathname, /collections\/Flood_Zones_2_3_Rivers_and_Sea\/items$/);
  assert.equal(url.searchParams.get('f'), 'application/geo+json');
  assert.equal(url.searchParams.get('limit'), '1000');
  assert.equal(url.searchParams.get('bbox').split(',').length, 4);
  assert.ok(!calls[0].includes('NaN'));
  assert.deepEqual(result.sourceSummary, { origins: ['modelled'], floodSources: ['river'] });
});

test('native-style fetch implementations retain their required receiver', async () => {
  const requiredReceiver = globalThis;
  async function receiverSensitiveFetch() {
    assert.equal(this, requiredReceiver);
    return response({ type: 'FeatureCollection', features: [] });
  }
  const adapter = new EnvironmentAgencyFloodZoneAdapter({ fetchImpl: receiverSensitiveFetch });
  const result = await adapter.retrieve(site);
  assert.deepEqual(result.zone2, []);
});

test('pagination follows the OGC next link and de-duplicates stable feature IDs', async () => {
  let calls = 0;
  const config = {
    serviceRoot: 'https://example.test/ogc/features/v1', collection: 'Flood_Zones_2_3_Rivers_and_Sea',
    pageSize: 1, timeoutMs: 1000
  };
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    config,
    fetchImpl: async url => {
      calls += 1;
      const page = new URL(url).searchParams.get('page');
      return response(page === '2'
        ? { type: 'FeatureCollection', features: [serviceFeature('a', 'FZ2'), serviceFeature('b', 'FZ3')] }
        : {
            type: 'FeatureCollection',
            features: [serviceFeature('a', 'FZ2')],
            links: [{ rel: 'next', href: 'https://example.test/ogc/features/v1/items?page=2' }]
          });
    }
  });
  const result = await adapter.retrieve(site);
  assert.equal(result.zone2.length, 1);
  assert.equal(result.zone3.length, 1);
  assert.equal(calls, 2);
});

test('service failure is not interpreted as no intersections', async () => {
  const adapter = new EnvironmentAgencyFloodZoneAdapter({ fetchImpl: async () => response({}, 503) });
  await assert.rejects(adapter.retrieve(site), /HTTP 503/);
});

test('browser network failures produce an intelligible service error', async () => {
  const adapter = new EnvironmentAgencyFloodZoneAdapter({ fetchImpl: async () => { throw new TypeError('Failed to fetch'); } });
  await assert.rejects(adapter.retrieve(site), /could not be reached.*CORS/);
});

test('service timeout produces an intelligible failure', async () => {
  const config = {
    serviceRoot: 'https://example.test', collection: 'Flood_Zones_2_3_Rivers_and_Sea',
    pageSize: 1000, timeoutMs: 5
  };
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    config,
    fetchImpl: async (url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    })
  });
  await assert.rejects(adapter.retrieve(site), /timed out/);
});

test('empty valid service responses remain explicit empty collections', async () => {
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async () => response({ type: 'FeatureCollection', features: [] })
  });
  const result = await adapter.retrieve(site);
  assert.deepEqual(result.zone2, []);
  assert.deepEqual(result.zone3, []);
});

test('invalid service geometry is rejected', async () => {
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async () => response({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }] })
  });
  await assert.rejects(adapter.retrieve(site), /unsupported geometry/);
});

test('malformed and unknown flood-zone attributes are rejected', async () => {
  const malformed = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async () => response({ type: 'FeatureCollection', features: [serviceFeature('a', 'Flood Zone 4')] })
  });
  await assert.rejects(malformed.retrieve(site), /unrecognised flood_zone/);

  const missing = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async () => response({ type: 'FeatureCollection', features: [{ ...serviceFeature('b'), properties: {} }] })
  });
  await assert.rejects(missing.retrieve(site), /unrecognised flood_zone/);
});

test('unsafe and repeated pagination links are rejected', async () => {
  const unsafe = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async () => response({
      type: 'FeatureCollection', features: [],
      links: [{ rel: 'next', href: 'https://unexpected.example/features' }]
    })
  });
  await assert.rejects(unsafe.retrieve(site), /unsafe pagination link/);

  const repeated = new EnvironmentAgencyFloodZoneAdapter({
    config: {
      serviceRoot: 'https://example.test', collection: 'zones',
      pageSize: 1, timeoutMs: 1000
    },
    fetchImpl: async url => response({
      type: 'FeatureCollection', features: [],
      links: [{ rel: 'next', href: String(url) }]
    })
  });
  await assert.rejects(repeated.retrieve(site), /repeated pagination link/);
});
