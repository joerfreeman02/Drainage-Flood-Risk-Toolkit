import test from 'node:test';
import assert from 'node:assert/strict';
import { generateNarrative } from '../src/report.js';

const result = percentages => ({
  zones: Object.fromEntries([1, 2, 3].map(zone => [zone, {
    percentage: percentages[zone - 1],
    displayPercentage: percentages[zone - 1]
  }]))
});

test('report wording describes a wholly Flood Zone 1 site', () => {
  const text = generateNarrative(result([100, 0, 0]), '2026-07-29T10:00:00Z');
  assert.match(text, /wholly within Flood Zone 1/);
  assert.match(text, /not intended to determine flood risk to an individual property/);
  assert.doesNotMatch(text, /acceptable|safe|exempt/);
});

test('report wording describes a multi-zone site deterministically', () => {
  const text = generateNarrative(result([25, 50, 25]), '2026-07-29T10:00:00Z');
  assert.match(text, /25\.0%.*Flood Zone 3, 50\.0%.*Flood Zone 2.*25\.0%.*Flood Zone 1/);
  assert.match(text, /ignoring the benefits of flood defences/);
});
