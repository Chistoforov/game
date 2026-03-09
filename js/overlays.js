/**
 * Activation overlay and pain screen logic.
 * Renders bonus rows and shows/hides overlays.
 */
const OVERLAY_IDS = {
  formboxActivation: 'overlay-formbox-activation',
  formboxPain: 'overlay-formbox-pain',
  aidboxActivation: 'overlay-aidbox-activation',
  aidboxPain: 'overlay-aidbox-pain'
};

// Must match applyFormboxActivationBonus / applyAidboxActivationBonus in metrics.js exactly.
const FORMBOX_BONUSES_AUTO = [
  { label: 'Patient Comfort', delta: 14 },
  { label: 'Staff Effectiveness', delta: 10 },
  { label: 'Data Readiness', delta: 18 }
];
const FORMBOX_BONUSES_MANUAL = [
  { label: 'Patient Comfort', delta: 10 },
  { label: 'Staff Effectiveness', delta: 7 },
  { label: 'Data Readiness', delta: 14 }
];
const AIDBOX_BONUSES_AUTO = [
  { label: 'Patient Comfort', delta: 10 },
  { label: 'Staff Effectiveness', delta: 15 },
  { label: 'Data Readiness', delta: 18 }
];
const AIDBOX_BONUSES_MANUAL = [
  { label: 'Patient Comfort', delta: 8 },
  { label: 'Staff Effectiveness', delta: 11 },
  { label: 'Data Readiness', delta: 14 }
];

function renderBonusRows(containerId, bonuses) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = bonuses.map((b, i) =>
    `<div class="bonus-row" data-index="${i}">
      <span class="bonus-label">${b.label}</span>
      <span class="bonus-value">+${b.delta}</span>
      <span class="bonus-check">✅</span>
    </div>`
  ).join('');
}

function showOverlay(id) {
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute('aria-hidden', 'false');
    el.classList.add('visible');
  }
}

function hideOverlay(id) {
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute('aria-hidden', 'true');
    el.classList.remove('visible');
  }
}

function showFormboxActivation() {
  renderBonusRows('formbox-activation-bonuses', FORMBOX_BONUSES_AUTO);
  showOverlay(OVERLAY_IDS.formboxActivation);
  // Bonus is applied when user clicks Continue, not when banner appears.
}

function showFormboxPain() {
  showOverlay(OVERLAY_IDS.formboxPain);
}

function showAidboxActivation() {
  renderBonusRows('aidbox-activation-bonuses', AIDBOX_BONUSES_AUTO);
  showOverlay(OVERLAY_IDS.aidboxActivation);
  // Bonus is applied when user clicks Continue, not when banner appears.
}

function showAidboxPain() {
  showOverlay(OVERLAY_IDS.aidboxPain);
}

function onFormboxActivateNow() {
  hideOverlay(OVERLAY_IDS.formboxPain);
  applyFormboxActivationBonus(false);
  renderBonusRows('formbox-activation-bonuses', FORMBOX_BONUSES_MANUAL);
  showOverlay(OVERLAY_IDS.formboxActivation);
}

function onFormboxContinueWithout() {
  hideOverlay(OVERLAY_IDS.formboxPain);
  if (typeof onAfterFormboxCheck === 'function') onAfterFormboxCheck();
}

function onAidboxActivateNow() {
  hideOverlay(OVERLAY_IDS.aidboxPain);
  applyAidboxActivationBonus(false);
  renderBonusRows('aidbox-activation-bonuses', AIDBOX_BONUSES_MANUAL);
  showOverlay(OVERLAY_IDS.aidboxActivation);
}

function onAidboxContinueWithout() {
  hideOverlay(OVERLAY_IDS.aidboxPain);
  if (typeof onAfterAidboxCheck === 'function') onAfterAidboxCheck();
}

function bindOverlayListeners() {
  document.querySelectorAll('[data-overlay]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.getAttribute('data-overlay');
      if (overlay === 'formbox-activation') {
        let formboxDeltas;
        if (!state.formboxActive) {
          applyFormboxActivationBonus(true);
          formboxDeltas = { patientComfort: 14, staffEffectiveness: 10, dataReadiness: 18 };
        } else {
          formboxDeltas = { patientComfort: 10, staffEffectiveness: 7, dataReadiness: 14 };
        }
        hideOverlay(OVERLAY_IDS.formboxActivation);
        if (typeof showDeltaLabels === 'function') showDeltaLabels(formboxDeltas);
        if (typeof onAfterFormboxCheck === 'function') onAfterFormboxCheck();
      } else if (overlay === 'aidbox-activation') {
        let aidboxDeltas;
        if (!state.aidboxActive) {
          applyAidboxActivationBonus(true);
          aidboxDeltas = { patientComfort: 10, staffEffectiveness: 15, dataReadiness: 18 };
        } else {
          aidboxDeltas = { patientComfort: 8, staffEffectiveness: 11, dataReadiness: 14 };
        }
        hideOverlay(OVERLAY_IDS.aidboxActivation);
        if (typeof showDeltaLabels === 'function') showDeltaLabels(aidboxDeltas);
        if (typeof onAfterAidboxCheck === 'function') onAfterAidboxCheck();
      }
    });
  });

  document.querySelectorAll('[data-pain]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-pain');
      if (action === 'formbox-activate') onFormboxActivateNow();
      else if (action === 'formbox-skip') onFormboxContinueWithout();
      else if (action === 'aidbox-activate') onAidboxActivateNow();
      else if (action === 'aidbox-skip') onAidboxContinueWithout();
    });
  });
}
