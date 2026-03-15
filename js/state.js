/**
 * Game state — single source of truth
 */
const state = {
  metrics: {
    patientComfort: 25,
    staffEffectiveness: 25,
    dataReadiness: 25
  },
  selectedFhirProduct: null,
  selectedFormsProduct: null,
  currentQuestion: 0,
  answers: [],
  lead: { name: '', organization: '', email: '' }
};
