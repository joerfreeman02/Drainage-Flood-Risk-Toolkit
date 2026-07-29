import test from 'node:test';
import assert from 'node:assert/strict';
import { EnvironmentAgencyFloodZoneAdapter } from '../src/ea-adapter.js';
import { fromBngMultiPolygon } from '../src/geometry.js';

test('optional live Environment Agency service smoke test', async () => {
  const ring = [[528000, 178000], [532000, 178000], [532000, 182000], [528000, 182000], [528000, 178000]];
  const site = { type: 'Polygon', coordinates: fromBngMultiPolygon([[[...ring]]]).coordinates[0] };
  const result = await new EnvironmentAgencyFloodZoneAdapter().retrieve(site);
  assert.ok(Array.isArray(result.zone2));
  assert.ok(Array.isArray(result.zone3));
  assert.ok(result.zone2.length + result.zone3.length > 0, 'Expected the bounded central-London envelope to retrieve Flood Zone polygons.');
  assert.match(result.retrievedAt, /^\d{4}-/);
});
