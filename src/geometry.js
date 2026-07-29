import proj4 from 'proj4';
import polygonClipping from 'polygon-clipping';
import { ANALYSIS } from './config.js';

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs');

const isFinitePair = value => Array.isArray(value) && value.length >= 2 &&
  Number.isFinite(value[0]) && Number.isFinite(value[1]);

function ringArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    sum += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return sum / 2;
}

export function multiPolygonArea(multiPolygon) {
  return multiPolygon.reduce((total, polygon) => {
    if (!polygon.length) return total;
    const outer = Math.abs(ringArea(polygon[0]));
    const holes = polygon.slice(1).reduce((sum, ring) => sum + Math.abs(ringArea(ring)), 0);
    return total + Math.max(0, outer - holes);
  }, 0);
}

function orientation(a, b, c) {
  const value = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
  return Math.abs(value) < 1e-12 ? 0 : value > 0 ? 1 : 2;
}

function segmentsIntersect(a, b, c, d) {
  return orientation(a, b, c) !== orientation(a, b, d) &&
    orientation(c, d, a) !== orientation(c, d, b);
}

function hasObviousSelfIntersection(ring) {
  const segmentCount = ring.length - 1;
  for (let i = 0; i < segmentCount; i += 1) {
    for (let j = i + 1; j < segmentCount; j += 1) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === segmentCount - 1)) continue;
      if (segmentsIntersect(ring[i], ring[i + 1], ring[j], ring[j + 1])) return true;
    }
  }
  return false;
}

function validateRing(ring) {
  if (!Array.isArray(ring) || ring.length < 4) throw new Error('Each polygon ring must contain at least four coordinate positions.');
  if (!ring.every(isFinitePair)) throw new Error('The boundary contains an invalid coordinate.');
  if (!ring.every(([x, y]) => x >= -180 && x <= 180 && y >= -90 && y <= 90)) {
    throw new Error('Imported coordinates must be longitude/latitude values in EPSG:4326.');
  }
  const first = ring[0], last = ring.at(-1);
  if (first[0] !== last[0] || first[1] !== last[1]) throw new Error('Every polygon ring must be closed.');
  if (hasObviousSelfIntersection(ring)) throw new Error('The boundary appears to self-intersect.');
  if (Math.abs(ringArea(ring)) < 1e-14) throw new Error('The site boundary has zero or negligible area.');
}

export function extractSiteGeometry(input) {
  if (!input || typeof input !== 'object') throw new Error('The selected file is not valid GeoJSON.');
  let geometry;
  if (input.type === 'FeatureCollection') {
    if (!Array.isArray(input.features) || input.features.length === 0) throw new Error('The GeoJSON feature collection is empty.');
    if (input.features.length > 1) throw new Error('The file contains multiple features. Supply or confirm one intended site geometry before import.');
    geometry = input.features[0]?.geometry;
  } else if (input.type === 'Feature') {
    geometry = input.geometry;
  } else {
    geometry = input;
  }
  if (!geometry || !['Polygon', 'MultiPolygon'].includes(geometry.type)) {
    throw new Error('The site boundary must be a GeoJSON Polygon or MultiPolygon.');
  }
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  if (!Array.isArray(polygons) || !polygons.length) throw new Error('The site geometry is empty.');
  polygons.forEach(polygon => {
    if (!Array.isArray(polygon) || !polygon.length) throw new Error('A polygon has no rings.');
    polygon.forEach(validateRing);
  });
  const projected = toBngMultiPolygon(geometry);
  if (multiPolygonArea(projected) <= ANALYSIS.areaToleranceSqM) throw new Error('The site boundary has zero or negligible area.');
  return { type: geometry.type, coordinates: geometry.coordinates };
}

function mapCoordinates(value, transform) {
  return isFinitePair(value) ? transform(value) : value.map(item => mapCoordinates(item, transform));
}

export function transformGeometry(geometry, from, to) {
  return {
    type: geometry.type,
    coordinates: mapCoordinates(geometry.coordinates, coordinate => proj4(from, to, coordinate.slice(0, 2)))
  };
}

export function toBngMultiPolygon(geometry) {
  const projected = transformGeometry(geometry, 'EPSG:4326', 'EPSG:27700');
  return projected.type === 'Polygon' ? [projected.coordinates] : projected.coordinates;
}

export function fromBngMultiPolygon(multiPolygon) {
  return {
    type: 'MultiPolygon',
    coordinates: mapCoordinates(multiPolygon, coordinate => proj4('EPSG:27700', 'EPSG:4326', coordinate))
  };
}

export function bngBoundingBox(geometry, margin = 0) {
  const points = toBngMultiPolygon(geometry).flat(2);
  const xs = points.map(point => point[0]), ys = points.map(point => point[1]);
  return [Math.min(...xs) - margin, Math.min(...ys) - margin, Math.max(...xs) + margin, Math.max(...ys) + margin];
}

function featureGeometries(features) {
  return features.map(feature => toBngMultiPolygon(feature.geometry));
}

function safeUnion(geometries) {
  if (!geometries.length) return [];
  return geometries.slice(1).reduce((union, geometry) => polygonClipping.union(union, geometry), geometries[0]);
}

function safeIntersection(a, b) {
  if (!a.length || !b.length) return [];
  return polygonClipping.intersection(a, b);
}

function safeDifference(a, b) {
  if (!a.length) return [];
  if (!b.length) return a;
  return polygonClipping.difference(a, b);
}

function displayPercentages(raw) {
  const rounded = raw.map(value => Math.round(value * 10) / 10);
  const delta = Math.round((100 - rounded.reduce((sum, value) => sum + value, 0)) * 10) / 10;
  if (Math.abs(delta) <= 0.2) {
    const largest = raw.indexOf(Math.max(...raw));
    rounded[largest] = Math.round((rounded[largest] + delta) * 10) / 10;
  }
  return rounded;
}

export function analyseFloodZones(siteGeometry, zone2Features = [], zone3Features = []) {
  const site = toBngMultiPolygon(extractSiteGeometry(siteGeometry));
  const siteArea = multiPolygonArea(site);
  const zone3Clips = featureGeometries(zone3Features).map(geometry => safeIntersection(site, geometry)).filter(geometry => geometry.length);
  const zone2Clips = featureGeometries(zone2Features).map(geometry => safeIntersection(site, geometry)).filter(geometry => geometry.length);
  const zone3 = safeUnion(zone3Clips);
  const zone2 = safeDifference(safeUnion(zone2Clips), zone3);
  const zone1 = safeDifference(site, safeUnion([zone2, zone3].filter(item => item.length)));
  const areas = [multiPolygonArea(zone1), multiPolygonArea(zone2), multiPolygonArea(zone3)];
  const rawPercentages = areas.map(area => area / siteArea * 100);
  const displayed = displayPercentages(rawPercentages);
  const calculatedTotal = areas.reduce((sum, area) => sum + area, 0);
  const percentageTotal = calculatedTotal / siteArea * 100;
  const warnings = [];
  if (siteArea < ANALYSIS.smallSiteWarningSqM) warnings.push('The site is very small; source geometry precision may materially affect the result.');
  rawPercentages.forEach((value, index) => {
    if (value > 0 && displayed[index] === 0) warnings.push(`A small Flood Zone ${index + 1} intersection is below the displayed 0.1% precision.`);
  });
  if (Math.abs(100 - percentageTotal) > ANALYSIS.percentageTolerance) warnings.push('The exclusive area total is outside the configured tolerance.');
  return {
    siteAreaSqM: siteArea,
    siteAreaHa: siteArea / 10000,
    zones: {
      1: { areaSqM: areas[0], percentage: rawPercentages[0], displayPercentage: displayed[0], geometry: fromBngMultiPolygon(zone1) },
      2: { areaSqM: areas[1], percentage: rawPercentages[1], displayPercentage: displayed[1], geometry: fromBngMultiPolygon(zone2) },
      3: { areaSqM: areas[2], percentage: rawPercentages[2], displayPercentage: displayed[2], geometry: fromBngMultiPolygon(zone3) }
    },
    percentageTotal,
    sourceFeatureCount: zone2Features.length + zone3Features.length,
    intersectingFeatureCount: [...zone2Clips, ...zone3Clips].filter(geometry => multiPolygonArea(geometry) > ANALYSIS.areaToleranceSqM).length,
    warnings
  };
}
