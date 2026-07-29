import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analyseFloodZones, bngBoundingBox, extractSiteGeometry, fromBngMultiPolygon, multiPolygonArea, toBngMultiPolygon, transformGeometry } from '../src/geometry.js';

function ring(x1, y1, x2, y2) {
  return [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]];
}

function bngPolygon(x1, y1, x2, y2, holes = []) {
  return fromBngMultiPolygon([[ring(x1, y1, x2, y2), ...holes]]).coordinates[0];
}

function polygon(coordinates) {
  return { type: 'Polygon', coordinates };
}

function feature(geometry) {
  return { type: 'Feature', properties: {}, geometry };
}

const site = polygon(bngPolygon(500000, 200000, 500100, 200100));
const zone = (x1, y1, x2, y2) => feature(polygon(bngPolygon(x1, y1, x2, y2)));
const near = (actual, expected, tolerance = 0.01) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);

test('site entirely outside Flood Zones 2 and 3', () => {
  const result = analyseFloodZones(site, [], []);
  near(result.zones[1].percentage, 100);
  near(result.zones[2].percentage, 0);
  near(result.zones[3].percentage, 0);
});

test('site entirely within Flood Zone 2', () => {
  const result = analyseFloodZones(site, [zone(499900, 199900, 500200, 200200)], []);
  near(result.zones[2].percentage, 100);
});

test('site entirely within Flood Zone 3', () => {
  const result = analyseFloodZones(site, [], [zone(499900, 199900, 500200, 200200)]);
  near(result.zones[3].percentage, 100);
});

test('site split between Flood Zones 1 and 2', () => {
  const result = analyseFloodZones(site, [zone(500000, 200000, 500050, 200100)], []);
  near(result.zones[1].percentage, 50);
  near(result.zones[2].percentage, 50);
});

test('site split between all three zones', () => {
  const result = analyseFloodZones(site,
    [zone(500025, 200000, 500075, 200100)],
    [zone(500075, 200000, 500100, 200100)]);
  near(result.zones[1].percentage, 25);
  near(result.zones[2].percentage, 50);
  near(result.zones[3].percentage, 25);
});

test('overlapping Flood Zone 2 source geometries do not double count', () => {
  const result = analyseFloodZones(site,
    [zone(500000, 200000, 500075, 200100), zone(500025, 200000, 500100, 200100)], []);
  near(result.zones[2].percentage, 100);
  near(result.percentageTotal, 100);
});

test('Flood Zone 3 takes precedence over overlapping Flood Zone 2', () => {
  const result = analyseFloodZones(site,
    [zone(500000, 200000, 500100, 200100)],
    [zone(500050, 200000, 500100, 200100)]);
  near(result.zones[2].percentage, 50);
  near(result.zones[3].percentage, 50);
});

test('exclusive percentages total approximately 100%', () => {
  const result = analyseFloodZones(site,
    [zone(500033, 200000, 500067, 200100)],
    [zone(500067, 200000, 500100, 200100)]);
  near(result.percentageTotal, 100, 0.0001);
  assert.equal(Object.values(result.zones).reduce((sum, item) => sum + item.displayPercentage, 0), 100);
});

test('polygon containing a hole preserves hole area', () => {
  const holeBng = ring(500025, 200025, 500075, 200075);
  const holeWgs = fromBngMultiPolygon([[[...holeBng]]]).coordinates[0][0];
  const holedSite = polygon([bngPolygon(500000, 200000, 500100, 200100)[0], holeWgs]);
  const result = analyseFloodZones(holedSite, [], []);
  near(result.siteAreaSqM, 7500, 0.1);
});

test('multipolygon site boundary is supported', () => {
  const multi = { type: 'MultiPolygon', coordinates: [
    bngPolygon(500000, 200000, 500050, 200050),
    bngPolygon(500100, 200000, 500150, 200050)
  ] };
  const result = analyseFloodZones(multi, [], []);
  near(result.siteAreaSqM, 5000, 0.1);
});

test('multipolygon Flood Zone response is supported', () => {
  const multiZone = feature({ type: 'MultiPolygon', coordinates: [
    bngPolygon(500000, 200000, 500025, 200100),
    bngPolygon(500075, 200000, 500100, 200100)
  ] });
  const result = analyseFloodZones(site, [multiZone], []);
  near(result.zones[2].percentage, 50);
});

test('malformed imported GeoJSON is rejected', () => {
  assert.throws(() => extractSiteGeometry({ type: 'FeatureCollection', features: [] }), /empty/);
  assert.throws(() => extractSiteGeometry({ type: 'Point', coordinates: [0, 0] }), /Polygon/);
});

test('multiple imported features require explicit selection', () => {
  assert.throws(() => extractSiteGeometry({ type: 'FeatureCollection', features: [feature(site), feature(site)] }), /multiple features/);
});

test('zero-area geometry is rejected', () => {
  const lineRing = [[-0.1, 51.5], [-0.09, 51.5], [-0.08, 51.5], [-0.1, 51.5]];
  assert.throws(() => extractSiteGeometry(polygon([lineRing])), /zero or negligible/);
});

test('obvious self-intersection is rejected', () => {
  const bowTie = [[-0.1, 51.5], [-0.09, 51.51], [-0.1, 51.51], [-0.09, 51.5], [-0.1, 51.5]];
  assert.throws(() => extractSiteGeometry(polygon([bowTie])), /self-intersect/);
});

test('coordinate transformation round trip is accurate', () => {
  const bng = transformGeometry({ type: 'Point', coordinates: [-0.1276, 51.5072] }, 'EPSG:4326', 'EPSG:27700');
  assert.ok(bng.coordinates[0] > 529000 && bng.coordinates[0] < 531000);
  assert.ok(bng.coordinates[1] > 179000 && bng.coordinates[1] < 182000);
  const roundTrip = transformGeometry(bng, 'EPSG:27700', 'EPSG:4326');
  near(roundTrip.coordinates[0], -0.1276, 0.000001);
  near(roundTrip.coordinates[1], 51.5072, 0.000001);
});

test('EPSG:27700 transformation applies the OSGB36 datum shift', () => {
  const wgs84 = transformGeometry({ type: 'Point', coordinates: [651409.903, 313177.270] }, 'EPSG:27700', 'EPSG:4326');
  near(wgs84.coordinates[0], 1.716052, 0.000002);
  near(wgs84.coordinates[1], 52.657979, 0.000002);
});

test('approved Aynsworth Avenue boundary preserves the authoritative BNG area', () => {
  const fixture = JSON.parse(readFileSync(new URL('./fixtures/golden/aynsworth-avenue/site-boundary.geojson', import.meta.url)));
  const result = analyseFloodZones(fixture, [], []);
  near(result.siteAreaSqM, 4949.9582, 0.01);
});

test('area calculation matches a known synthetic 100 m square', () => {
  const projected = toBngMultiPolygon(site);
  near(multiPolygonArea(projected), 10000, 0.1);
});

test('request bounding box contains finite BNG coordinates and margin', () => {
  const bbox = bngBoundingBox(site, 50);
  assert.ok(bbox.every(Number.isFinite));
  near(bbox[0], 499950, 0.1);
  near(bbox[1], 199950, 0.1);
  near(bbox[2], 500150, 0.1);
  near(bbox[3], 200150, 0.1);
});
