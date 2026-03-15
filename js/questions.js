/**
 * Game script: Block 1 (FHIR Server) — Q1–Q4 + product-fit → HAPI/Medplum/Aidbox/Firely.
 * Block 2 (Adaptive Forms) — Q5–Q8 + product-fit → Formstack/form.io/Formbox/Luma Health.
 * PC = Patient Comfort, SE = Staff Effectiveness, DR = Data Readiness.
 * Metric indicators: green = improves, yellow = partial, red = worsens (no numeric display).
 */
const BLOCK_INTROS = {
  fhir: 'You have inherited a hospital environment where patient information moves inconsistently across registration, departments, and partner workflows. Some teams have created local fixes that help in the moment, but they do not always scale well across the full care journey. Over the next few weeks, you need to improve reliability without losing momentum on day-to-day operations.',
  forms: 'Your hospital has already moved some intake steps into digital channels, but the experience is still uneven across clinics and patient types. Some forms are easier to launch than to maintain, and some collect information that is not easy to reuse later in the journey. The next set of decisions is about making intake more adaptable without adding complexity for staff or patients.'
};

const QUESTIONS = [
  // —— Block 1: FHIR Server ——
  {
    id: 'q1',
    blockIntro: BLOCK_INTROS.fhir,
    title: 'Monday, 8:10 AM',
    sceneText: 'The registration area is already backed up. Several patients are late for diagnostics, the front desk is juggling phone calls, and a line is starting to form near the self-check-in kiosk. A message from the CFO appears on your screen: "We cannot start every week like this. Fix the bottleneck before it hits revenue and patient satisfaction again." Any near-term change has to fit the current operational setup rather than depend on a major redesign.',
    question: 'How do you reduce the morning registration bottleneck?',
    options: [
      { id: 'a', text: 'Open a fast lane for returning patients and temporarily move one nurse from triage to support check-in.', pc: 8, se: -1, dr: 3 },
      { id: 'b', text: 'Cut registration to the minimum required questions and ask departments to collect missing details later.', pc: 8, se: 3, dr: -1 },
      { id: 'c', text: 'Prepare a daily pre-filled registration list from scheduled appointments so staff type less at the desk.', pc: 3, se: 8, dr: -1 },
      { id: 'd', text: 'Prioritize patients heading to diagnostics first and move routine follow-ups into a slower secondary lane.', pc: -1, se: 8, dr: 3 }
    ]
  },
  {
    id: 'q2',
    title: 'By noon',
    sceneText: 'Complaints shift from waiting time to repetition. One patient says she has now given her contact details, medication list, and insurance information three times in one visit. The outpatient lead pings you: "We are moving people through the building, but not their information." The team needs a practical way to reduce repetition without introducing another workaround that staff will have to maintain manually.',
    question: 'How do you reduce repeated questions across departments?',
    options: [
      { id: 'a', text: 'Print a short intake summary at registration and ask patients to carry it from one department to the next.', pc: 3, se: 8, dr: -1 },
      { id: 'b', text: 'Tell departments to skip repeated questions unless staff notice a clear inconsistency.', pc: 8, se: 3, dr: -1 },
      { id: 'c', text: 'Add a patient-flow coordinator who reconciles mismatched answers before the next appointment starts.', pc: 3, se: -1, dr: 8 },
      { id: 'd', text: 'Introduce one shared core intake block for all departments, while specialty questions stay local.', pc: 8, se: -1, dr: 3 }
    ]
  },
  {
    id: 'q3',
    title: 'Data handoff',
    sceneText: 'A patient completes diagnostics, but the specialist still cannot see the updated medication note and calls the department directly. Another case is held for ten minutes because the receiving team is not sure which prep instructions were already given. A message from the medical director lands: "Why are clinicians still chasing information in chats and calls?" Whatever you improve here has to work in real clinical conditions, not just on paper.',
    question: 'How do you improve data handoff between care steps?',
    options: [
      { id: 'a', text: 'Require the sending team to email a short patient summary before every internal transfer.', pc: 8, se: -1, dr: 3 },
      { id: 'b', text: 'Let the receiving team confirm missing details directly with the patient at the next step.', pc: -1, se: 8, dr: 3 },
      { id: 'c', text: 'Make transfer completion depend on a mandatory handoff checklist filled out by the sending team.', pc: 3, se: -1, dr: 8 },
      { id: 'd', text: 'Use a shared hourly handoff board so departments see the latest status in one place before calling each other.', pc: -1, se: 3, dr: 8 }
    ]
  },
  {
    id: 'q4',
    title: 'New partner workflow',
    sceneText: 'The hospital is preparing to launch a new pre-op testing workflow with an external lab partner. Commercially, the timing matters: leadership wants it live this month. The partnerships manager sends a blunt note: "Every new workflow feels like a new integration project. We cannot keep rebuilding the hospital from scratch." Leadership wants an approach that helps with this launch and does not make future partner onboarding harder.',
    question: 'How do you launch the new partner workflow?',
    options: [
      { id: 'a', text: 'Start immediately with PDF results by email and let staff upload them into existing records manually.', pc: 8, se: -1, dr: 3 },
      { id: 'b', text: 'Build a custom one-off connection only for this lab so the workflow can go live quickly.', pc: 8, se: 3, dr: -1 },
      { id: 'c', text: 'Reduce scope and launch only one high-priority test package while keeping the rest on the current process.', pc: -1, se: 8, dr: 3 },
      { id: 'd', text: 'Define a standard partner data template and onboarding pattern before connecting any new external service.', pc: 3, se: -1, dr: 8 }
    ]
  },
  // Product-fit: FHIR Server (no metric icons, no numeric impact)
  {
    id: 'q5-fhir-fit',
    isProductFit: true,
    productBlock: 'fhir',
    title: 'FHIR server path',
    sceneText: 'You improved parts of the journey, but the hospital still depends on a mix of local fixes, departmental workarounds, and partner-specific processes. Some improvements helped immediately, yet the underlying operating model still makes information flow harder to manage than it should be. The next step is to choose a FHIR server path that fits how your hospital needs to move forward.',
    question: 'What kind of FHIR server path best fits your hospital right now?',
    options: [
      { id: 'a', text: 'We need maximum control and a self-managed path our technical team can shape over time.', productId: 'HAPI' },
      { id: 'b', text: 'We need a platform-oriented path for building new workflows and digital applications around care delivery.', productId: 'Medplum' },
      { id: 'c', text: 'We need a path that supports faster rollout and dependable operations without unnecessary infrastructure burden.', productId: 'Aidbox' },
      { id: 'd', text: 'We need a standards-led enterprise path with strong interoperability and governance.', productId: 'Firely' }
    ]
  },
  // —— Block 2: Adaptive Medical Forms ——
  {
    id: 'q6',
    blockIntro: BLOCK_INTROS.forms,
    title: 'Tuesday, 7:40 AM',
    sceneText: 'Your outpatient clinics are no longer struggling only with queues — now they are struggling with drop-off before the visit even starts. Many patients receive a long pre-visit form, open it once, and leave it unfinished. By the time they arrive, registration still has to chase missing details at the front desk. A message from the ambulatory care lead pops up: "We moved intake earlier, but we did not actually make it easier." The team wants a simpler intake experience without fragmenting the process even more.',
    question: 'How do you improve pre-visit intake completion?',
    options: [
      { id: 'a', text: 'Send one short universal intake form before the visit and collect specialty details on-site.', pc: 8, se: 3, dr: -1 },
      { id: 'b', text: 'Keep the full intake form, but have the call center help patients complete it before arrival.', pc: 3, se: -1, dr: 8 },
      { id: 'c', text: 'Ask patients to arrive 20 minutes early and complete digital intake at kiosks in the waiting area.', pc: -1, se: 8, dr: 3 },
      { id: 'd', text: 'Split intake into a basic pre-visit form and a second follow-up form for selected visit types.', pc: 8, se: -1, dr: 3 }
    ]
  },
  {
    id: 'q7',
    title: 'By midday',
    sceneText: 'Registration is no longer drowning in paper packets, but scanned PDFs, email attachments, and half-completed digital forms still have to be reviewed and re-entered manually into downstream systems. Staff keep opening the same patient record in multiple screens just to copy data across. The front-desk supervisor writes: "We digitized the form, but not the work." The issue is no longer just form completion — it is what happens to the answers after they are submitted.',
    question: 'How do you reduce re-entry and fragmented intake handling?',
    options: [
      { id: 'a', text: 'Let staff scan submitted forms into the patient record and re-enter missing details only when they become necessary.', pc: 8, se: -1, dr: 3 },
      { id: 'b', text: 'Replace the long intake packet with a short digital check-in and keep the remaining paperwork in separate follow-up steps.', pc: 8, se: 3, dr: -1 },
      { id: 'c', text: 'Add one intake coordinator to review incomplete submissions before patients reach the desk.', pc: 3, se: -1, dr: 8 },
      { id: 'd', text: 'Standardize one digital intake packet for the top three clinics first and leave the rest on current processes.', pc: 3, se: 8, dr: -1 }
    ]
  },
  {
    id: 'q8',
    title: 'Compliance update',
    sceneText: 'A new compliance update lands on your desk, and every department reacts differently. Cardiology has its own form version, orthopedics has another, and surgery still uses a PDF that no one wants to touch because "it mostly works." What should be a simple change now requires multiple edits, approvals, and follow-up emails. The quality manager messages you: "We do not have one form system — we have a collection of local exceptions." The larger challenge is keeping forms aligned without forcing every clinic into exactly the same workflow.',
    question: 'How do you make form updates easier across departments?',
    options: [
      { id: 'a', text: 'Let each department keep its own forms and add only one shared cover sheet for basic patient details.', pc: 3, se: 8, dr: -1 },
      { id: 'b', text: 'Route every form change through a central governance group before anything goes live.', pc: -1, se: 3, dr: 8 },
      { id: 'c', text: 'Freeze non-critical form changes until the next quarterly review cycle.', pc: -1, se: 8, dr: 3 },
      { id: 'd', text: 'Create a shared question library for repeated fields, while departments keep local versions of specialty sections.', pc: 3, se: -1, dr: 8 }
    ]
  },
  {
    id: 'q9',
    title: 'Pre-op workflow',
    sceneText: 'The final pressure point appears in a new pre-op workflow. Low-risk patients are still asked the same long checklist as complex cases, while some higher-risk cases trigger follow-up calls because staff need clarification after the form is submitted. Nurses say the process is too rigid for patients and too manual for the team. A note from the operations director appears: "Why are our digital forms still behaving like static PDFs?" The team needs a more adaptive approach, but it also needs consistency in how answers are handled across workflows.',
    question: 'How do you make intake smarter for different patient scenarios?',
    options: [
      { id: 'a', text: 'Use one fixed intake form for everyone and ask nurses to follow up by phone when answers need clarification.', pc: -1, se: 3, dr: 8 },
      { id: 'b', text: 'Shorten the form by removing less common questions and let clinicians ask the rest during the visit.', pc: 8, se: -1, dr: 3 },
      { id: 'c', text: 'Add branching logic only to one high-volume workflow first and keep all other clinics on static forms.', pc: 3, se: 8, dr: -1 },
      { id: 'd', text: 'Route patients to different follow-up forms based on earlier answers, with operations managing the routing rules manually.', pc: 3, se: -1, dr: 8 }
    ]
  },
  // Product-fit: Adaptive Forms
  {
    id: 'q10-forms-fit',
    isProductFit: true,
    productBlock: 'forms',
    title: 'Adaptive forms path',
    sceneText: 'You reduced some friction, but the hospital still relies on a patchwork of form versions, routing decisions, and manual follow-up. Different services need flexibility, but the system also needs a more consistent way to handle changing questions, repeated fields, and patient-specific paths. The next step is to choose an adaptive forms approach that fits how your hospital wants to operate.',
    question: 'What kind of adaptive forms path best fits your hospital right now?',
    options: [
      { id: 'a', text: 'We need a path focused on intake simplicity and business workflow efficiency.', productId: 'Formstack' },
      { id: 'b', text: 'We need a developer-led path with strong control and extensibility for forms and integrations.', productId: 'form.io' },
      { id: 'c', text: 'We need a healthcare-specific path for adaptive forms and more structured clinical data capture.', productId: 'Formbox' },
      { id: 'd', text: 'We need an intake path tightly connected to patient communication, readiness, and pre-visit coordination.', productId: 'Luma Health' }
    ]
  },
  // Final scenario: operationalize FHIR + forms before audit (scoring)
  {
    id: 'q11-final-audit',
    title: 'Before audit review',
    sceneText: 'You have chosen your FHIR server path and your adaptive forms approach. The audit is days away. Leadership wants to see that the hospital is not only technically ready but operationally ready: how data flows from intake through to the systems that auditors will review, and how staff and patients experience the new setup.',
    question: 'How do you operationalize the chosen FHIR and forms approach before the audit?',
    options: [
      { id: 'a', text: 'Run a short pilot with one high-volume clinic, document lessons, then roll out to the rest before audit.', pc: 3, se: 8, dr: -1 },
      { id: 'b', text: 'Align data flows between FHIR and forms first, then run targeted staff training and a patient-communication push.', pc: -1, se: 3, dr: 8 },
      { id: 'c', text: 'Freeze further changes, run end-to-end checks on key journeys, and prepare a single audit-ready evidence pack.', pc: 8, se: 3, dr: -1 },
      { id: 'd', text: 'Map every touchpoint where forms feed FHIR, fix gaps, and add a lightweight dashboard for audit visibility.', pc: 3, se: -1, dr: 8 }
    ]
  }
];

const PRODUCT_REVEAL_SUBTITLES = {
  HAPI: 'Your team chose a self-managed path with strong control.',
  Medplum: 'Your team chose a platform-oriented path for new workflows and apps.',
  Aidbox: 'Your team chose a path optimized for faster rollout and dependable operations.',
  Firely: 'Your team chose a standards-led enterprise path with stronger governance.',
  Formstack: 'Your team chose a path focused on intake simplicity and workflow efficiency.',
  'form.io': 'Your team chose a developer-led forms path with strong control and extensibility.',
  Formbox: 'Your team chose a healthcare-specific adaptive forms path for structured clinical data.',
  'Luma Health': 'Your team chose an intake path centered on communication and patient readiness.'
};
