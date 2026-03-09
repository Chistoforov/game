/**
 * Game loop: start, answer handling, Formbox/Aidbox checks, outcome.
 */
(function () {
  function init() {
    bindOverlayListeners();
    document.getElementById('btn-start').addEventListener('click', startGame);
    var playAgain = document.getElementById('btn-play-again');
    if (playAgain) playAgain.addEventListener('click', startGame);
    if (typeof bindOutcomeActions === 'function') bindOutcomeActions();
  }

  function resetState() {
    state.metrics = { patientComfort: 25, staffEffectiveness: 25, dataReadiness: 25 };
    state.formboxFit = 0;
    state.aidboxFit = 0;
    state.formboxActive = false;
    state.aidboxActive = false;
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

      const deltas = { patientComfort: option.pc, staffEffectiveness: option.se, dataReadiness: option.dr };
      applyOptionDeltas(option);
      state.answers.push(index);

      showDeltaLabels(deltas);
      updateMetricBars();

      setTimeout(() => {
        state.currentQuestion++;
        updateFlowStripCurrent();

        if (state.currentQuestion === 4) {
          formboxCheck();
          return;
        }
        if (state.currentQuestion === 7) {
          aidboxCheck();
          return;
        }
        if (state.currentQuestion >= 8) {
          showScreen('outcome-screen');
          renderOutcome();
          return;
        }

        const prevAnswerIndex = state.currentQuestion > 0 ? state.answers[state.currentQuestion - 1] : undefined;
        renderQuestion(QUESTIONS[state.currentQuestion], prevAnswerIndex);
        bindAnswerButtons();
      }, 600);
    });
  }

  function formboxCheck() {
    if (state.formboxFit >= 2) {
      showFormboxActivation();
      updateMetricBars();
    } else {
      showFormboxPain();
    }
  }

  function aidboxCheck() {
    if (state.aidboxFit >= 2) {
      showAidboxActivation();
      updateMetricBars();
    } else {
      showAidboxPain();
    }
  }

  window.onAfterFormboxCheck = function () {
    hideOverlay(OVERLAY_IDS.formboxActivation);
    updateMetricBars();
    renderFlowStrip();
    const prevAnswerIndex = state.answers[3];
    renderQuestion(QUESTIONS[4], prevAnswerIndex);
    bindAnswerButtons();
  };

  window.onAfterAidboxCheck = function () {
    hideOverlay(OVERLAY_IDS.aidboxActivation);
    updateMetricBars();
    renderFlowStrip();
    const prevAnswerIndex = state.answers[6];
    renderQuestion(QUESTIONS[7], prevAnswerIndex);
    bindAnswerButtons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
