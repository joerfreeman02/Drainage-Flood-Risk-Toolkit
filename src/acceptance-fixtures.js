const polygon = coordinates => ({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates } });

export const ACCEPTANCE_FIXTURES = Object.freeze({
  polygon: polygon([[
    [-0.1562763337, 51.4859609178],
    [-0.0986935681, 51.4850412639],
    [-0.0971963860, 51.5209914351],
    [-0.1548244314, 51.5219122667],
    [-0.1562763337, 51.4859609178]
  ]]),
  hole: polygon([
    [
      [-0.145, 51.492],
      [-0.112, 51.492],
      [-0.112, 51.514],
      [-0.145, 51.514],
      [-0.145, 51.492]
    ],
    [
      [-0.134, 51.499],
      [-0.134, 51.507],
      [-0.123, 51.507],
      [-0.123, 51.499],
      [-0.134, 51.499]
    ]
  ]),
  multipolygon: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[
          [-0.151, 51.493],
          [-0.135, 51.493],
          [-0.135, 51.507],
          [-0.151, 51.507],
          [-0.151, 51.493]
        ]],
        [[
          [-0.121, 51.498],
          [-0.105, 51.498],
          [-0.105, 51.512],
          [-0.121, 51.512],
          [-0.121, 51.498]
        ]]
      ]
    }
  },
  multiple: {
    type: 'FeatureCollection',
    features: [
      polygon([[[-0.14, 51.5], [-0.13, 51.5], [-0.13, 51.51], [-0.14, 51.51], [-0.14, 51.5]]]),
      polygon([[[-0.12, 51.5], [-0.11, 51.5], [-0.11, 51.51], [-0.12, 51.51], [-0.12, 51.5]]])
    ]
  },
  unsupported: {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [-0.1276, 51.5072] }
  }
});
