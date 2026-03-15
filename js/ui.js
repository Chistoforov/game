/**
 * DOM updates: metrics, scene, answers, flow strip, screens.
 */
const METRIC_KEYS = ['patientComfort', 'staffEffectiveness', 'dataReadiness'];
const METRIC_LABELS = { patientComfort: 'Patient Comfort', staffEffectiveness: 'Staff Comfort', dataReadiness: 'Data Readiness' };
const TOTAL_STEPS = 11;

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
}

/** Open contour path length (no closing segment 14,0→50,0): red→yellow→green along path. */
const METRIC_CONTOUR_PERIMETER = 252 + 28 * Math.PI;

/** Icon color by metric value (0–100), aligned with progress bar: red → yellow → green. */
function metricValueToColor(val) {
  if (val < 40) return 'red';
  if (val < 70) return 'yellow';
  return 'green';
}

function updateMetricBars() {
  METRIC_KEYS.forEach(function (key) {
    var block = document.getElementById('metric-block-' + key);
    if (!block) return;
    var fillEl = block.querySelector('.metric-contour-fill');
    var iconWrap = block.querySelector('.metric-block-icon');
    var val = state.metrics[key];
    block.setAttribute('aria-valuenow', val);
    if (fillEl) {
      var filled = (val / 100) * METRIC_CONTOUR_PERIMETER;
      fillEl.style.strokeDasharray = filled + ' ' + METRIC_CONTOUR_PERIMETER;
      fillEl.style.strokeDashoffset = '0';
    }
    if (iconWrap) {
      var stateColor = metricValueToColor(val);
      iconWrap.classList.remove('metric-icon-state-red', 'metric-icon-state-yellow', 'metric-icon-state-green');
      iconWrap.classList.add('metric-icon-state-' + stateColor);
    }
  });
}

const COUNTDOWN_RING_CIRCUMFERENCE = 2 * Math.PI * 28;

function updateCountdown(stepsLeft) {
  const block = document.getElementById('countdown-block');
  const numberEl = document.getElementById('countdown-number');
  const textEl = document.getElementById('countdown-text');
  const fillEl = document.querySelector('.countdown-ring-fill');
  if (!block || !numberEl || !textEl || !fillEl) return;
  numberEl.textContent = stepsLeft;
  textEl.textContent = stepsLeft === 1 ? 'step left' : 'steps left';
  const offset = COUNTDOWN_RING_CIRCUMFERENCE * (1 - stepsLeft / TOTAL_STEPS);
  fillEl.style.strokeDasharray = COUNTDOWN_RING_CIRCUMFERENCE;
  fillEl.style.strokeDashoffset = offset;
}

/** Hidden scoring: Green = +8, Yellow = +3, Red = -1. Only these deltas are used for scenario answers. */
function metricColor(delta) {
  if (delta == null) return 'yellow';
  if (delta === 8) return 'green';
  if (delta === 3) return 'yellow';
  if (delta === -1) return 'red';
  return 'yellow';
}

var METRIC_ICONS = {
  patient: '<svg class="metric-icon metric-icon-person" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 6.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 8c-3.5 0-6.5 1.6-6.5 3.2v2.3h13v-2.3c0-1.6-3-3.2-6.5-3.2z"/></svg>',
  staff: '<svg class="metric-icon metric-icon-cross" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/></svg>',
  data: '<svg class="metric-icon metric-icon-doc" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h11l2 2v14l-2 2H6l-2-2V6l2-2z" fill-opacity="0.22"/><path d="M7 7.5h10v1.2H7zm0 3.2h7v1.2H7zm0 3.2h10v1.2H7zm0 3.2h5v1.2H7z"/></svg>'
};

function renderMetricIndicators(opt) {
  if (opt.productId != null) return '';
  const pc = metricColor(opt.pc);
  const se = metricColor(opt.se);
  const dr = metricColor(opt.dr);
  return '<span class="answer-metrics" aria-hidden="true">' +
    '<span class="answer-metric answer-metric-' + pc + '" title="Patient Comfort">' + METRIC_ICONS.patient + '</span>' +
    '<span class="answer-metric answer-metric-' + se + '" title="Staff Comfort">' + METRIC_ICONS.staff + '</span>' +
    '<span class="answer-metric answer-metric-' + dr + '" title="Data Readiness">' + METRIC_ICONS.data + '</span>' +
    '</span>';
}

/**
 * Resolves title and sceneText. Optional blockIntro is prepended for block-start questions.
 */
function getSceneForQuestion(q, previousAnswerIndex) {
  if (q.sceneVariants != null && previousAnswerIndex != null && previousAnswerIndex >= 0) {
    const key = ['a', 'b', 'c', 'd'][previousAnswerIndex];
    const variant = q.sceneVariants[key];
    if (variant) return { title: variant.title, sceneText: variant.sceneText, blockIntro: q.blockIntro };
  }
  return { title: q.title, sceneText: q.sceneText || q.scene || '', blockIntro: q.blockIntro };
}

function renderQuestion(q, previousAnswerIndex) {
  const stepsLeft = TOTAL_STEPS - state.currentQuestion;
  updateCountdown(stepsLeft);

  const scene = getSceneForQuestion(q, previousAnswerIndex);
  const sceneTitleEl = document.getElementById('scene-title');
  if (sceneTitleEl) sceneTitleEl.textContent = scene.title || '';

  const sceneTextEl = document.getElementById('scene-text');
  const fullText = scene.blockIntro ? scene.blockIntro + '\n\n' + scene.sceneText : scene.sceneText;
  sceneTextEl.textContent = fullText;

  document.getElementById('question-title').textContent = q.question || q.title;

  const isProductFit = q.isProductFit === true;
  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = q.options.map((opt, i) => {
    const metricsHtml = isProductFit ? '' : renderMetricIndicators(opt);
    return `<button type="button" class="answer-btn" data-option-index="${i}">
      <span class="answer-btn-text">${opt.text}</span>${metricsHtml}
    </button>`;
  }).join('');
}

function renderFlowStrip() {
  const container = document.getElementById('flow-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const dot = document.createElement('span');
    dot.className = 'flow-dot';
    dot.setAttribute('data-step', i);
    if (i < state.currentQuestion) dot.classList.add('past');
    else if (i === state.currentQuestion) dot.classList.add('current');
    else dot.classList.add('future');
    container.appendChild(dot);
  }
}

function updateFlowStripCurrent() {
  document.querySelectorAll('.flow-dot').forEach((dot, i) => {
    dot.classList.remove('past', 'current', 'future');
    if (i < state.currentQuestion) dot.classList.add('past');
    else if (i === state.currentQuestion) dot.classList.add('current');
    else dot.classList.add('future');
  });
}

function renderOutcome() {
  const avg = (
    state.metrics.patientComfort +
    state.metrics.staffEffectiveness +
    state.metrics.dataReadiness
  ) / 3;
  const minMetric = Math.min(
    state.metrics.patientComfort,
    state.metrics.staffEffectiveness,
    state.metrics.dataReadiness
  );

  let outcomeKey, title, subtitle, metricsHtml;

  if (avg >= 72 && minMetric >= 65) {
    outcomeKey = 'smooth';
    title = 'Audit-Ready Hospital';
    subtitle = 'You stabilized intake, improved team workflow, and connected the patient journey before audit review.';
  } else if (avg >= 50 || minMetric >= 40) {
    outcomeKey = 'partial';
    title = 'Digitally Stabilized Hospital';
    subtitle = 'You improved key parts of the hospital journey and made operations more stable before audit review.';
  } else {
    outcomeKey = 'fragmented';
    title = 'Hospital Under Pressure';
    subtitle = 'The hospital still needs stronger system-wide improvements to reduce friction and manual rework.';
  }

  const productsHtml = [state.selectedFhirProduct, state.selectedFormsProduct].filter(Boolean).length
    ? `<p class="outcome-products">Your FHIR path: ${state.selectedFhirProduct || '—'}. Your forms path: ${state.selectedFormsProduct || '—'}.</p>`
    : '';

  metricsHtml = METRIC_KEYS.map(key => {
    const v = state.metrics[key];
    const pct = Math.round(v);
    const fillStyle = pct > 0
      ? `width:${pct}%; background-size:${(100 / pct) * 100}% 100%; background-position:0 0`
      : 'width:0%';
    return `<div class="outcome-metric"><span class="outcome-metric-label">${METRIC_LABELS[key]}</span><div class="outcome-metric-bar"><div class="outcome-metric-fill" style="${fillStyle}"></div></div><span class="outcome-metric-pct">${pct}%</span></div>`;
  }).join('');

  const showInvite = !!(state.lead.name || state.lead.email);
  const inviteHtml = (outcomeKey === 'smooth' && showInvite) ? `
    <div class="outcome-invite">
      <p>You're invited.</p>
      <p>Join our side event at Charité, Berlin during DMEA 2026 — April 22, 6pm.</p>
      <a href="#" class="btn-secondary">Register your spot</a>
    </div>` : '';

  document.getElementById('outcome-content').innerHTML = `
    <div id="outcome-card-export" class="outcome-card-export">
      <p class="outcome-congratulations">Congratulations!</p>
      <p class="outcome-audit-complete">Audit complete</p>
      <p class="outcome-your-result-label">Your result:</p>
      <h2 class="outcome-title">${title}</h2>
      <p class="outcome-subtitle">${subtitle}</p>
      ${productsHtml}
      <div class="outcome-metrics">${metricsHtml}</div>
    </div>
    ${inviteHtml}
  `;
}

function getGameShareUrl() {
  return typeof window !== 'undefined' && window.location ? window.location.href : '';
}

function shareOnLinkedIn() {
  var url = encodeURIComponent(getGameShareUrl());
  window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'width=600,height=600');
}

function shareOnFacebook() {
  var url = encodeURIComponent(getGameShareUrl());
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
  var url = encodeURIComponent(getGameShareUrl());
  window.open('https://wa.me/?text=' + url, '_blank');
}

function copyResultLink() {
  var url = getGameShareUrl();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      showCopyFeedback();
    }).catch(function () { fallbackCopy(url); });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showCopyFeedback();
  } catch (e) {}
  document.body.removeChild(ta);
}

function showCopyFeedback() {
  var feedbackEl = document.getElementById('outcome-copy-feedback');
  if (feedbackEl) {
    feedbackEl.textContent = 'Link copied!';
    setTimeout(function () {
      feedbackEl.textContent = '';
    }, 2000);
  }
}

function downloadResultImage() {
  var el = document.getElementById('outcome-card-export');
  if (!el) {
    showDownloadFeedback('Card not found', true);
    return;
  }
  if (typeof html2canvas === 'undefined') {
    showDownloadFeedback('Export not loaded', true);
    return;
  }
  var opts = {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false
  };
  var w = el.offsetWidth;
  var h = el.offsetHeight;
  if (w > 0 && h > 0) {
    opts.width = w;
    opts.height = h;
  }
  html2canvas(el, opts).then(function (canvas) {
    var filename = 'patient-journey-result.png';
    try {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) {
          if (!blob) {
            fallbackDataURLDownload(canvas, filename);
            return;
          }
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showDownloadFeedback('Download started');
        }, 'image/png');
      } else {
        fallbackDataURLDownload(canvas, filename);
        showDownloadFeedback('Download started');
      }
    } catch (err) {
      showDownloadFeedback('Download failed', true);
      console.error('Download image error:', err);
    }
  }).catch(function (err) {
    showDownloadFeedback('Export failed', true);
    console.error('html2canvas error:', err);
  });
}

function fallbackDataURLDownload(canvas, filename) {
  var dataUrl = canvas.toDataURL('image/png');
  var a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function showDownloadFeedback(message, isError) {
  var btn = document.getElementById('btn-download-image');
  var feedback = document.getElementById('outcome-copy-feedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.style.color = isError ? '#c0392b' : '';
  if (btn) btn.setAttribute('aria-label', message);
  setTimeout(function () {
    feedback.textContent = '';
    if (btn) btn.setAttribute('aria-label', 'Download image');
  }, 3000);
}

function bindOutcomeActions() {
  var lin = document.getElementById('btn-share-linkedin');
  var fb = document.getElementById('btn-share-facebook');
  var wa = document.getElementById('btn-share-whatsapp');
  var copyBtn = document.getElementById('btn-copy-link');
  var downloadBtn = document.getElementById('btn-download-image');

  if (lin) lin.addEventListener('click', shareOnLinkedIn);
  if (fb) fb.addEventListener('click', function (e) { e.preventDefault(); shareOnFacebook(); });
  if (wa) wa.addEventListener('click', function (e) { e.preventDefault(); shareOnWhatsApp(); });
  if (copyBtn) copyBtn.addEventListener('click', copyResultLink);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadResultImage);
}
