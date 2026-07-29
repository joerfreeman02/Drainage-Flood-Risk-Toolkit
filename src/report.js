export function generateNarrative(result, retrievalDate) {
  const z1 = result.zones[1].displayPercentage;
  const z2 = result.zones[2].displayPercentage;
  const z3 = result.zones[3].displayPercentage;
  const withinTolerance = value => value >= 99.95;
  let finding;
  if (withinTolerance(result.zones[1].percentage)) {
    finding = 'The site is located wholly within Flood Zone 1 and is therefore shown as having a low probability of flooding from rivers and the sea on the Environment Agency Flood Map for Planning.';
  } else if (withinTolerance(result.zones[2].percentage)) {
    finding = 'The site is located wholly within Flood Zone 2 on the Environment Agency Flood Map for Planning.';
  } else if (withinTolerance(result.zones[3].percentage)) {
    finding = 'The site is located wholly within Flood Zone 3 on the Environment Agency Flood Map for Planning.';
  } else {
    finding = `The Environment Agency Flood Map for Planning indicates that approximately ${z3.toFixed(1)}% of the site is located within Flood Zone 3, ${z2.toFixed(1)}% within Flood Zone 2 and the remaining ${z1.toFixed(1)}% within Flood Zone 1.`;
  }
  const qualification = 'The Flood Map for Planning provides an indication of present-day flood risk from rivers and the sea for planning purposes, ignoring the benefits of flood defences. Flood Zone 1 is the residual area outside Flood Zones 2 and 3. The mapping is not intended to determine flood risk to an individual property, and its suitability for the intended professional use must be confirmed.';
  const retrieval = retrievalDate ? ` The dataset was retrieved on ${new Date(retrievalDate).toLocaleDateString('en-GB')}.` : '';
  return `${finding} ${qualification}${retrieval}`;
}
