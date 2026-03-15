/**
 * Product reveal overlays: FHIR and Forms. Blind choice → banner with product name + subtitle.
 */
const OVERLAY_IDS = {
  fhirReveal: 'overlay-fhir-reveal',
  formsReveal: 'overlay-forms-reveal'
};

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

function showProductReveal(block, productId) {
  const subtitle = typeof PRODUCT_REVEAL_SUBTITLES !== 'undefined' ? PRODUCT_REVEAL_SUBTITLES[productId] : '';
  const overlayId = block === 'fhir' ? OVERLAY_IDS.fhirReveal : OVERLAY_IDS.formsReveal;
  const titleEl = document.querySelector(`#${overlayId} .overlay-product-name`);
  const subtitleEl = document.querySelector(`#${overlayId} .overlay-product-subtitle`);
  if (titleEl) titleEl.textContent = 'You implemented ' + productId;
  if (subtitleEl) subtitleEl.textContent = subtitle || '';
  showOverlay(overlayId);
}

function bindOverlayListeners() {
  document.querySelectorAll('[data-overlay]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.getAttribute('data-overlay');
      if (overlay === 'fhir-reveal') {
        hideOverlay(OVERLAY_IDS.fhirReveal);
        if (typeof window.onAfterFhirReveal === 'function') window.onAfterFhirReveal();
      } else if (overlay === 'forms-reveal') {
        hideOverlay(OVERLAY_IDS.formsReveal);
        if (typeof window.onAfterFormsReveal === 'function') window.onAfterFormsReveal();
      }
    });
  });
}
