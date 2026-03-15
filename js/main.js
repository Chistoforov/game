/**
 * Game loop: start, answer handling, product reveals after FHIR and Forms product-fit questions.
 */
(function () {
  const TOTAL_QUESTIONS = 11;
  const FHIR_PRODUCT_FIT_INDEX = 4;
  const FORMS_PRODUCT_FIT_INDEX = 9;
  const LAST_QUESTION_INDEX = 10;

  function init() {
    bindOverlayListeners();
    document.getElementById('btn-start').addEventListener('click', startGame);
    var playAgain = document.getElementById('btn-play-again');
    if (playAgain) playAgain.addEventListener('click', startGame);
    if (typeof bindOutcomeActions === 'function') bindOutcomeActions();
  }

  function resetState() {
    state.metrics = { patientComfort: 25, staffEffectiveness: 25, dataReadiness: 25 };
    state.selectedFhirProduct = null;
    state.selectedFormsProduct = null;
    state.currentQuestion = 0;
    state.answers = [];
    state.lead = { name: '', organization: '', email: '' };
  }

  function startGame() {
    resetState();
    showScreen('game-screen');
    updateMetricBars();
    state.currentQuestion = 0;
    renderQuestion(QUESTIONS[0], undefined);
    renderFlowStrip();
    bindAnswerButtons();
  }

  function bindAnswerButtons() {
    document.getElementById('answers').addEventListener('click', function (e) {
      const btn = e.target.closest('.answer-btn');
      if (!btn || btn.disabled) return;
      const index = parseInt(btn.getAttribute('data-option-index'), 10);
      const q = QUESTIONS[state.currentQuestion];
      const option = q.options[index];
      if (!option) return;

      btn.disabled = true;
      btn.classList.add('tapped');

      if (option.productId != null) {
        if (state.currentQuestion === FHIR_PRODUCT_FIT_INDEX) {
          state.selectedFhirProduct = option.productId;
          showProductReveal('fhir', option.productId);
        } else if (state.currentQuestion === FORMS_PRODUCT_FIT_INDEX) {
          state.selectedFormsProduct = option.productId;
          showProductReveal('forms', option.productId);
        }
      } else {
        applyOptionDeltas(option);
        if (state.currentQuestion !== LAST_QUESTION_INDEX) {
          updateMetricBars();
        }
      }

      state.answers.push(index);

      if (state.currentQuestion === FHIR_PRODUCT_FIT_INDEX || state.currentQuestion === FORMS_PRODUCT_FIT_INDEX) {
        return;
      }

      if (state.currentQuestion === LAST_QUESTION_INDEX) {
        // Следующий кадр: отрисовываем новые метрики, чтобы transition от старого к новому значению успел проиграть
        requestAnimationFrame(function () {
          updateMetricBars();
          // Время на анимацию полос (0.5s в CSS) + пауза, затем финальный экран
          var metricAnimationMs = 600;
          var pauseAfterAnimationMs = 500;
          setTimeout(function () {
            showScreen('outcome-screen');
            renderOutcome();
          }, metricAnimationMs + pauseAfterAnimationMs);
        });
        return;
      }

      const nextIndex = state.currentQuestion + 1;
      setTimeout(() => {
        state.currentQuestion = nextIndex;
        updateFlowStripCurrent();
        const prevAnswerIndex = state.answers[nextIndex - 1];
        renderQuestion(QUESTIONS[nextIndex], prevAnswerIndex);
        bindAnswerButtons();
      }, 600);
    });
  }

  window.onAfterFhirReveal = function () {
    hideOverlay(OVERLAY_IDS.fhirReveal);
    applyProductSelectionBonus();
    updateMetricBars();
    state.currentQuestion = FHIR_PRODUCT_FIT_INDEX + 1;
    updateFlowStripCurrent();
    const prevAnswerIndex = state.answers[FHIR_PRODUCT_FIT_INDEX];
    renderQuestion(QUESTIONS[state.currentQuestion], prevAnswerIndex);
    bindAnswerButtons();
  };

  window.onAfterFormsReveal = function () {
    hideOverlay(OVERLAY_IDS.formsReveal);
    applyProductSelectionBonus();
    updateMetricBars();
    state.currentQuestion = FORMS_PRODUCT_FIT_INDEX + 1;
    updateFlowStripCurrent();
    const prevAnswerIndex = state.answers[FORMS_PRODUCT_FIT_INDEX];
    renderQuestion(QUESTIONS[state.currentQuestion], prevAnswerIndex);
    bindAnswerButtons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
