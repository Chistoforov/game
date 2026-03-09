/**
 * DOM updates: metrics, scene, answers, flow strip, screens.
 */
const METRIC_KEYS = ['patientComfort', 'staffEffectiveness', 'dataReadiness'];
const METRIC_LABELS = { patientComfort: 'Patient Comfort', staffEffectiveness: 'Staff Effectiveness', dataReadiness: 'Data Readiness' };

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
}

function updateMetricBars() {
  METRIC_KEYS.forEach(key => {
    const bar = document.querySelector(`.metric[data-metric="${key}"] .metric-bar`);
    const val = state.metrics[key];
    if (bar) {
      bar.style.width = val + '%';
      bar.setAttribute('aria-valuenow', val);
    }
  });
}

function showDeltaLabels(deltas) {
  METRIC_KEYS.forEach(key => {
    const wrap = document.querySelector(`.metric[data-metric="${key}"] .metric-delta`);
    if (!wrap) return;
    const d = deltas[key];
    if (d === undefined || d === 0) {
      wrap.textContent = '';
      wrap.className = 'metric-delta';
      return;
    }
    wrap.textContent = (d > 0 ? '+' : '') + d;
    wrap.className = 'metric-delta visible ' + (d > 0 ? 'positive' : 'negative');
    setTimeout(() => {
      wrap.classList.remove('visible');
      setTimeout(() => { wrap.textContent = ''; }, 400);
    }, 1200);
  });
}

const COUNTDOWN_RING_CIRCUMFERENCE = 2 * Math.PI * 28;

function updateCountdown(weeksLeft) {
  const block = document.getElementById('countdown-block');
  const numberEl = document.getElementById('countdown-number');
  const textEl = document.getElementById('countdown-text');
  const fillEl = document.querySelector('.countdown-ring-fill');
  if (!block || !numberEl || !textEl || !fillEl) return;
  numberEl.textContent = weeksLeft;
  textEl.textContent = weeksLeft === 1 ? 'week until audit' : 'weeks until audit';
  const offset = COUNTDOWN_RING_CIRCUMFERENCE * (1 - weeksLeft / 8);
  fillEl.style.strokeDasharray = COUNTDOWN_RING_CIRCUMFERENCE;
  fillEl.style.strokeDashoffset = offset;
}

/**
 * Resolves title and sceneText for the current question.
 * For Q1: uses q.title and q.sceneText.
 * For Q2–Q8: uses sceneVariants based on previousAnswerIndex (0→a, 1→b, 2→c).
 */
function getSceneForQuestion(q, previousAnswerIndex) {
  if (q.sceneVariants != null && previousAnswerIndex != null && previousAnswerIndex >= 0) {
    const key = ['a', 'b', 'c'][previousAnswerIndex];
    const variant = q.sceneVariants[key];
    if (variant) return { title: variant.title, sceneText: variant.sceneText };
  }
  return { title: q.title, sceneText: q.sceneText || q.scene || '' };
}

function renderQuestion(q, previousAnswerIndex) {
  const weeksLeft = 8 - state.currentQuestion;
  updateCountdown(weeksLeft);

  const scene = getSceneForQuestion(q, previousAnswerIndex);
  const sceneTitleEl = document.getElementById('scene-title');
  if (sceneTitleEl) sceneTitleEl.textContent = scene.title || '';

  document.getElementById('scene-text').textContent = scene.sceneText;
  document.getElementById('question-title').textContent = q.question || q.title;

  const answersEl = document.getElementById('answers');
  answersEl.innerHTML = q.options.map((opt, i) =>
    `<button type="button" class="answer-btn" data-option-index="${i}" data-pc="${opt.pc}" data-se="${opt.se}" data-dr="${opt.dr}">
      ${opt.text}
    </button>`
  ).join('');
}

function renderFlowStrip() {
  const container = document.getElementById('flow-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4 && state.formboxActive) {
      const badgeF = document.createElement('span');
      badgeF.className = 'flow-badge flow-badge-formbox';
      badgeF.textContent = 'F';
      badgeF.setAttribute('aria-hidden', 'true');
      container.appendChild(badgeF);
    }
    if (i === 7 && state.aidboxActive) {
      const badgeA = document.createElement('span');
      badgeA.className = 'flow-badge flow-badge-aidbox';
      badgeA.textContent = 'A';
      badgeA.setAttribute('aria-hidden', 'true');
      container.appendChild(badgeA);
    }
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

  // Copy per spec: top-tier positive, mid-tier respectful, low-tier concise and shareable.
  if (state.formboxActive && state.aidboxActive) {
    if (avg >= 80 && minMetric >= 72) {
      outcomeKey = 'smooth';
      title = 'Audit-Ready Hospital';
      subtitle = 'You stabilized intake, improved team workflow, and connected the patient journey before audit review.';
    } else {
      outcomeKey = 'partial';
      title = 'Digitally Stabilized Hospital';
      subtitle = 'You improved key parts of the hospital journey and made operations more stable before audit review.';
    }
  } else if (avg >= 58 || state.formboxActive || state.aidboxActive) {
    outcomeKey = 'partial';
    title = 'Digitally Stabilized Hospital';
    subtitle = 'You improved key parts of the hospital journey and made operations more stable before audit review.';
  } else {
    outcomeKey = 'fragmented';
    title = 'Hospital Under Pressure';
    subtitle = 'The hospital still needs stronger system-wide improvements to reduce friction and manual rework.';
  }

  metricsHtml = METRIC_KEYS.map(key => {
    const v = state.metrics[key];
    const pct = Math.round(v);
    return `<div class="outcome-metric"><span class="outcome-metric-label">${METRIC_LABELS[key]}</span><div class="outcome-metric-bar"><div class="outcome-metric-fill" style="width:${pct}%"></div></div><span class="outcome-metric-pct">${pct}%</span></div>`;
  }).join('');

  const showInvite = !!(state.lead.name || state.lead.email);
  const inviteHtml = (outcomeKey === 'smooth' && showInvite) ? `
    <div class="outcome-invite">
      <p>You're invited.</p>
      <p>Join our side event at Charité, Berlin during DMEA 2026 — April 22, 6pm.</p>
      <a href="#" class="btn-secondary">Register your spot</a>
    </div>` : '';

  // Hierarchy: Congratulations! → Audit complete → Your result: → outcome title → description
  document.getElementById('outcome-content').innerHTML = `
    <div id="outcome-card-export" class="outcome-card-export">
      <p class="outcome-congratulations">Congratulations!</p>
      <p class="outcome-audit-complete">Audit complete</p>
      <p class="outcome-your-result-label">Your result:</p>
      <h2 class="outcome-title">${title}</h2>
      <p class="outcome-subtitle">${subtitle}</p>
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
