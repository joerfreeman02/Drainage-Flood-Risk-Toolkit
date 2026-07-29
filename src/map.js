import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

const defaultView = [52.4, -1.5];
const styles = {
  site: { pane: 'siteBoundary', color: '#e31a1c', weight: 4, opacity: 1, fillColor: '#ffffff', fillOpacity: 0.04 },
  zone2: { pane: 'floodZone2', color: '#1875a8', weight: 1.5, opacity: 1, fillColor: '#72c7e7', fillOpacity: 0.68 },
  zone3: { pane: 'floodZone3', color: '#24176f', weight: 1.5, opacity: 1, fillColor: '#332288', fillOpacity: 0.78 }
};

export function createMap({ onBoundaryChanged, onBoundaryDeleted }) {
  const map = L.map('map', { zoomControl: true }).setView(defaultView, 6);
  const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, crossOrigin: true, opacity: 0.58, attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  map.createPane('floodZone2').style.zIndex = '410';
  map.createPane('floodZone3').style.zIndex = '420';
  map.createPane('siteBoundary').style.zIndex = '430';
  const siteLayer = new L.FeatureGroup([], { pane: 'siteBoundary' }).addTo(map);
  const zone2Layer = new L.GeoJSON(null, { style: styles.zone2 });
  const zone3Layer = new L.GeoJSON(null, { style: styles.zone3 });
  L.control.layers({ OpenStreetMap: base }, { 'Flood Zone 2': zone2Layer, 'Flood Zone 3': zone3Layer }, { collapsed: false }).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  const north = L.control({ position: 'topright' });
  north.onAdd = () => {
    const element = L.DomUtil.create('div', 'north-arrow');
    element.innerHTML = '<span aria-hidden="true">▲</span><strong>N</strong>';
    element.setAttribute('aria-label', 'North arrow');
    return element;
  };
  north.addTo(map);
  const drawControl = new L.Control.Draw({
    draw: { polygon: { allowIntersection: false, showArea: false, shapeOptions: styles.site }, polyline: false, rectangle: false, circle: false, circlemarker: false, marker: false },
    edit: { featureGroup: siteLayer, remove: true }
  });
  map.addControl(drawControl);
  map.on(L.Draw.Event.CREATED, event => {
    siteLayer.clearLayers();
    event.layer.setStyle(styles.site).addTo(siteLayer);
    onBoundaryChanged(event.layer.toGeoJSON().geometry);
  });
  map.on(L.Draw.Event.EDITED, event => event.layers.eachLayer(layer => onBoundaryChanged(layer.toGeoJSON().geometry)));
  map.on(L.Draw.Event.DELETED, () => onBoundaryDeleted());

  return {
    map,
    setSite(geometry) {
      siteLayer.clearLayers();
      const layer = L.geoJSON({ type: 'Feature', properties: {}, geometry }, { style: styles.site });
      layer.eachLayer(item => siteLayer.addLayer(item));
      map.fitBounds(siteLayer.getBounds(), { padding: [30, 30], maxZoom: 17 });
    },
    showResults(result) {
      zone2Layer.clearLayers().addData({ type: 'Feature', properties: {}, geometry: result.zones[2].geometry }).addTo(map);
      zone3Layer.clearLayers().addData({ type: 'Feature', properties: {}, geometry: result.zones[3].geometry }).addTo(map);
      if (siteLayer.getBounds().isValid()) map.fitBounds(siteLayer.getBounds(), { padding: [40, 40], maxZoom: 17 });
    },
    clearResults() { zone2Layer.clearLayers(); zone3Layer.clearLayers(); },
    reset() {
      siteLayer.clearLayers(); zone2Layer.clearLayers(); zone3Layer.clearLayers();
      map.setView(defaultView, 6);
    },
    fitSite() { if (siteLayer.getBounds().isValid()) map.fitBounds(siteLayer.getBounds(), { padding: [30, 30], maxZoom: 17 }); },
    setView(lat, lon) { map.setView([lat, lon], 16); },
    invalidate() { map.invalidateSize(); }
  };
}
