/**
 * Metric caps and applyDelta logic. All metrics 0–100.
 * Scenario answers apply deltas; product-fit choices add +10 to each metric (20 total per metric for 2 products).
 */
const METRIC_CAP = 100;
const PRODUCT_SELECTION_BONUS = 10;

function getCurrentCap() {
  return METRIC_CAP;
}

function applyDelta(metric, delta) {
  if (delta == null) return;
  const cap = getCurrentCap();
  state.metrics[metric] = Math.min(cap, Math.max(0, state.metrics[metric] + delta));
}

/** Add +10 to each metric when the player selects a product (FHIR or Forms). Called twice per game. */
function applyProductSelectionBonus() {
  applyDelta('patientComfort', PRODUCT_SELECTION_BONUS);
  applyDelta('staffEffectiveness', PRODUCT_SELECTION_BONUS);
  applyDelta('dataReadiness', PRODUCT_SELECTION_BONUS);
}

function applyOptionDeltas(option) {
  if (option.productId != null) return;
  applyDelta('patientComfort', option.pc);
  applyDelta('staffEffectiveness', option.se);
  applyDelta('dataReadiness', option.dr);
}
