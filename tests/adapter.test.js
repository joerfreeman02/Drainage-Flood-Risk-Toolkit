import test from 'node:test';
import assert from 'node:assert/strict';
import { EnvironmentAgencyFloodZoneAdapter } from '../src/ea-adapter.js';
import { fromBngMultiPolygon } from '../src/geometry.js';

const ring = [[500000, 200000], [500100, 200000], [500100, 200100], [500000, 200100], [500000, 200000]];
const site = { type: 'Polygon', coordinates: fromBngMultiPolygon([[[...ring]]]).coordinates[0] };
const serviceFeature = { type: 'Feature', properties: { objectid: 1 }, geometry: site };

function response(payload, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => payload };
}

test('live-service responses are normalised into zone collections', async () => {
  const calls = [];
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    fetchImpl: async url => { calls.push(String(url)); return response({ type: 'FeatureCollection', features: [serviceFeature], exceededTransferLimit: false }); }
  });
  const result = await adapter.retrieve(site);
  assert.equal(result.zone2.length, 1);
  assert.equal(result.zone3.length, 1);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(url => url.includes('inSR=27700') && url.includes('outSR=4326')));
  assert.ok(calls.every(url => !url.includes('NaN')));
});

test('native-style fetch implementations retain their required receiver', async () => {
  const requiredReceiver = globalThis;
  async function receiverSensitiveFetch() {
    assert.equal(this, requiredReceiver);
    return response({ type: 'FeatureCollection', features: [], exceededTransferLimit: false });
  }
  const adapter = new EnvironmentAgencyFloodZoneAdapter({ fetchImpl: receiverSensitiveFetch });
  const result = await adapter.retrieve(site);
  assert.deepEqual(result.zone2, []);
});

test('pagination continues until a short page', async () => {
  let calls = 0;
  const config = {
    serviceRoot: 'https://example.test/FeatureServer', layerIds: { floodZone3: 1, floodZone2: 2 },
    pageSize: 1, timeoutMs: 1000
  };
  const adapter = new EnvironmentAgencyFloodZoneAdapter({
    config,
    fetchImpl: async url => {
      calls += 1;
      const offset = new URL(url).searchParams.get('resultOffset');
      return response({ type: 'FeatureCollection', features: offset === '0' ? [serviceFeature] : [] });
    }
  });
  const result = await adapter.retrieve(site);
  assert.equal(result.zone2.length + result.zone3.length, 2);
  assert.equal(calls, 4);
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
    serviceRoot: 'https://example.test', layerIds: { floodZone3: 1, floodZone2: 2 },
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
    fetchImpl: async () => response({ type: 'FeatureCollection', features: [], exceededTransferLimit: false })
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
