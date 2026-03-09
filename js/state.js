/**
 * Game state — single source of truth
 */
const state = {
  metrics: {
    patientComfort: 25,
    staffEffectiveness: 25,
    dataReadiness: 25
  },
  formboxFit: 0,
  aidboxFit: 0,
  formboxActive: false,
  aidboxActive: false,
  currentQuestion: 0,
  answers: [],
  lead: { name: '', organization: '', email: '' }
};
