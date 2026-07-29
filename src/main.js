import './styles.css';
import { BUILD, CRS, DATASET, VERSIONS } from './config.js';
import { EnvironmentAgencyFloodZoneAdapter } from './ea-adapter.js';
import { analyseFloodZones, extractSiteGeometry } from './geometry.js';
import { generateNarrative } from './report.js';
import { clearProject, loadProject, saveProject } from './project-context.js';
import { diagnosticsSnapshot } from './diagnostics.js';
import { createMap } from './map.js';

const byId = id => document.getElementById(id);
const state = { siteGeometry: null, result: null, retrievedAt: null, latestError: null, source: null };
const adapter = new EnvironmentAgencyFloodZoneAdapter();

function status(message, kind = '') {
  const element = byId('status');
  element.textContent = message;
  element.className = `status-message ${kind}`;
}

function setBusy(busy) {
  byId('analyse').disabled = busy || !state.siteGeometry;
  byId('rerun').disabled = busy || !state.siteGeometry;
  byId('loading').hidden = !busy;
}

function formatArea(value) {
  return value >= 1000 ? `${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })} m²` : `${value.toLocaleString('en-GB', { maximumFractionDigits: 2 })} m²`;
}

function renderDiagnostics() {
  byId('diagnosticsText').textContent = JSON.stringify(diagnosticsSnapshot(state), null, 2);
}

function renderResults() {
  const result = state.result;
  byId('resultsEmpty').hidden = true;
  byId('resultsContent').hidden = false;
  byId('siteArea').textContent = `${formatArea(result.siteAreaSqM)} (${result.siteAreaHa.toFixed(4)} ha)`;
  for (const zone of [1, 2, 3]) {
    byId(`z${zone}Area`).textContent = formatArea(result.zones[zone].areaSqM);
    byId(`z${zone}Pct`).textContent = `${result.zones[zone].displayPercentage.toFixed(1)}%`;
  }
  byId('percentageCheck').textContent = `${result.percentageTotal.toFixed(6)}%`;
  byId('featureCount').textContent = `${result.intersectingFeatureCount} intersecting / ${result.sourceFeatureCount} retrieved`;
  byId('retrievalDate').textContent = new Date(state.retrievedAt).toLocaleString('en-GB');
  const warningList = byId('warnings');
  warningList.replaceChildren();
  if (!result.warnings.length) warningList.innerHTML = '<li>No calculation warnings.</li>';
  result.warnings.forEach(warning => {
    const item = document.createElement('li'); item.textContent = warning; warningList.append(item);
  });
  byId('narrative').value = generateNarrative(result, state.retrievedAt);
  mapUi.showResults(result);
  renderDiagnostics();
}

function acceptBoundary(geometry, origin = 'Boundary') {
  try {
    state.siteGeometry = extractSiteGeometry(geometry);
    state.result = null; state.latestError = null;
    mapUi.setSite(state.siteGeometry);
    mapUi.clearResults();
    byId('resultsEmpty').hidden = false; byId('resultsContent').hidden = true;
    setBusy(false);
    status(`${origin} accepted. Run the Flood Zone analysis.`, 'success');
    renderDiagnostics();
  } catch (error) {
    state.latestError = error.message;
    status(error.message, 'error');
    renderDiagnostics();
  }
}

const mapUi = createMap({
  onBoundaryChanged: geometry => acceptBoundary(geometry, 'Drawn boundary'),
  onBoundaryDeleted: () => clearBoundary()
});

async function runAnalysis() {
  if (!state.siteGeometry) return status('Draw or import a site boundary first.', 'error');
  setBusy(true);
  state.latestError = null;
  status('Retrieving authoritative Flood Zone polygons…');
  try {
    state.source = await adapter.retrieve(state.siteGeometry);
    state.retrievedAt = state.source.retrievedAt;
    state.result = analyseFloodZones(state.siteGeometry, state.source.zone2, state.source.zone3);
    renderResults();
    status('Analysis complete. Exclusive percentages have been checked.', 'success');
  } catch (error) {
    state.latestError = error.message;
    status(`${error.message} No percentage result has been produced.`, 'error');
    renderDiagnostics();
  } finally {
    setBusy(false);
  }
}

function clearAnalysis() {
  state.result = null; state.retrievedAt = null; state.source = null;
  mapUi.clearResults();
  byId('resultsEmpty').hidden = false; byId('resultsContent').hidden = true;
  status(state.siteGeometry ? 'Analysis cleared; site boundary retained.' : 'Ready.');
  renderDiagnostics();
}

function clearBoundary() {
  clearAnalysis(); state.siteGeometry = null; state.latestError = null;
  mapUi.reset(); setBusy(false); status('Site boundary cleared.');
  renderDiagnostics();
}

async function searchLocation() {
  const query = byId('search').value.trim();
  if (!query) return status('Enter a postcode, address or place to search.', 'error');
  status('Searching for the location…');
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2'); url.searchParams.set('countrycodes', 'gb');
    url.searchParams.set('limit', '1'); url.searchParams.set('q', query);
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Location search returned HTTP ${response.status}.`);
    const locations = await response.json();
    if (!locations.length) throw new Error('No matching UK location was found.');
    mapUi.setView(Number(locations[0].lat), Number(locations[0].lon));
    status('Location found. Draw the actual red-line site boundary.', 'success');
  } catch (error) {
    state.latestError = error.message; status(error.message, 'error'); renderDiagnostics();
  }
}

async function copyText(text, label) {
  try { await navigator.clipboard.writeText(text); status(`${label} copied to the clipboard.`, 'success'); }
  catch { status(`Could not copy ${label.toLowerCase()}; select the text and copy it manually.`, 'error'); }
}

const saved = loadProject();
byId('projectName').value = saved.name || '';
byId('siteAddress').value = saved.address || '';
function updatePrintDetails() {
  byId('printProjectName').textContent = `Project: ${byId('projectName').value.trim() || 'Not specified'}`;
  byId('printSiteAddress').textContent = `Site: ${byId('siteAddress').value.trim() || 'Not specified'}`;
}
updatePrintDetails();
byId('producedDate').textContent = new Date().toLocaleDateString('en-GB');
byId('version').textContent = `${VERSIONS.toolkit} · ${VERSIONS.floodZone} · ${VERSIONS.spatialEngine}`;
byId('buildInfo').textContent = `${VERSIONS.status} · ${BUILD.commit} · ${BUILD.timestamp}`;
byId('datasetTitle').textContent = DATASET.title;
byId('datasetMeta').textContent = `${DATASET.publisher} · revision ${DATASET.revisionDate} · ${DATASET.crs}`;
byId('calculationMethod').textContent = `${CRS.analysis}; polygon clipping, exclusive precedence FZ3 → FZ2 → residual FZ1`;

byId('saveProject').onclick = () => { saveProject({ name: byId('projectName').value, address: byId('siteAddress').value }); updatePrintDetails(); status('Project details saved in this browser.', 'success'); };
byId('clearProject').onclick = () => { clearProject(); byId('projectName').value = ''; byId('siteAddress').value = ''; updatePrintDetails(); status('Project details cleared.'); };
byId('searchButton').onclick = searchLocation;
byId('search').addEventListener('keydown', event => { if (event.key === 'Enter') searchLocation(); });
byId('importButton').onclick = () => byId('boundaryFile').click();
byId('boundaryFile').onchange = async event => {
  try {
    const text = await event.target.files[0].text();
    acceptBoundary(JSON.parse(text), 'Imported boundary');
  } catch (error) {
    state.latestError = error instanceof SyntaxError ? 'The selected file contains malformed JSON.' : error.message;
    status(state.latestError, 'error'); renderDiagnostics();
  } finally { event.target.value = ''; }
};
byId('analyse').onclick = runAnalysis;
byId('rerun').onclick = runAnalysis;
byId('clearAnalysis').onclick = clearAnalysis;
byId('clearBoundary').onclick = clearBoundary;
byId('fitBoundary').onclick = () => mapUi.fitSite();
byId('copyNarrative').onclick = () => copyText(byId('narrative').value, 'Narrative');
byId('copyDiagnostics').onclick = () => copyText(byId('diagnosticsText').textContent, 'Diagnostics');
byId('previewPrint').onclick = () => {
  updatePrintDetails();
  document.body.classList.add('print-preview');
  byId('exitPrintPreview').hidden = false;
  mapUi.invalidate();
};
byId('exitPrintPreview').onclick = () => {
  document.body.classList.remove('print-preview');
  byId('exitPrintPreview').hidden = true;
  mapUi.invalidate();
};
byId('printMap').onclick = () => { updatePrintDetails(); mapUi.invalidate(); setTimeout(() => window.print(), 150); };

setBusy(false);
renderDiagnostics();
status('Locate the site, then draw or import its red-line boundary.');
