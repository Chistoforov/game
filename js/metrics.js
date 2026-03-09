/**
 * Metric caps per stage and applyDelta logic.
 * Before Formbox: 58/58/58
 * After Formbox, before Aidbox: 80/78/86
 * After Aidbox: 100/100/100
 */
function getCurrentCap(metric) {
  if (state.aidboxActive) return 100;
  if (state.formboxActive) {
    if (metric === 'patientComfort') return 80;
    if (metric === 'staffEffectiveness') return 78;
    if (metric === 'dataReadiness') return 86;
  }
  return 58;
}

function applyDelta(metric, delta) {
  const cap = getCurrentCap(metric);
  state.metrics[metric] = Math.min(cap, Math.max(0, state.metrics[metric] + delta));
}

function applyOptionDeltas(option) {
  applyDelta('patientComfort', option.pc);
  applyDelta('staffEffectiveness', option.se);
  applyDelta('dataReadiness', option.dr);
  state.formboxFit = Math.min(4, state.formboxFit + (option.fb || 0));
  state.aidboxFit = Math.min(3, state.aidboxFit + (option.ab || 0));
}

function applyFormboxActivationBonus(isAuto) {
  if (isAuto) {
    applyDelta('patientComfort', 14);
    applyDelta('staffEffectiveness', 10);
    applyDelta('dataReadiness', 18);
  } else {
    applyDelta('patientComfort', 10);
    applyDelta('staffEffectiveness', 7);
    applyDelta('dataReadiness', 14);
  }
  state.formboxActive = true;
}

function applyAidboxActivationBonus(isAuto) {
  if (isAuto) {
    applyDelta('patientComfort', 10);
    applyDelta('staffEffectiveness', 15);
    applyDelta('dataReadiness', 18);
  } else {
    applyDelta('patientComfort', 8);
    applyDelta('staffEffectiveness', 11);
    applyDelta('dataReadiness', 14);
  }
  state.aidboxActive = true;
}
