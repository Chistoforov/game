# Healthcare Conference Game Script

## Block 1 — FHIR Server

**Block intro:**  
You have inherited a hospital environment where patient information moves inconsistently across registration, departments, and partner workflows. Some teams have created local fixes that help in the moment, but they do not always scale well across the full care journey. Over the next few weeks, you need to improve reliability without losing momentum on day-to-day operations.

### Question 1
**Scene:**  
Monday, 8:10 AM. The registration area is already backed up. Several patients are late for diagnostics, the front desk is juggling phone calls, and a line is starting to form near the self-check-in kiosk. A message from the CFO appears on your screen: “We cannot start every week like this. Fix the bottleneck before it hits revenue and patient satisfaction again.” Any near-term change has to fit the current operational setup rather than depend on a major redesign.

**Decision:**  
How do you reduce the morning registration bottleneck?

**Options:**
- **A:** Open a fast lane for returning patients and temporarily move one nurse from triage to support check-in.
- **B:** Cut registration to the minimum required questions and ask departments to collect missing details later.
- **C:** Prepare a daily pre-filled registration list from scheduled appointments so staff type less at the desk.
- **D:** Prioritize patients heading to diagnostics first and move routine follow-ups into a slower secondary lane.

### Question 2
**Scene:**  
By noon, complaints shift from waiting time to repetition. One patient says she has now given her contact details, medication list, and insurance information three times in one visit. The outpatient lead pings you: “We are moving people through the building, but not their information.” The team needs a practical way to reduce repetition without introducing another workaround that staff will have to maintain manually.

**Decision:**  
How do you reduce repeated questions across departments?

**Options:**
- **A:** Print a short intake summary at registration and ask patients to carry it from one department to the next.
- **B:** Tell departments to skip repeated questions unless staff notice a clear inconsistency.
- **C:** Add a patient-flow coordinator who reconciles mismatched answers before the next appointment starts.
- **D:** Introduce one shared core intake block for all departments, while specialty questions stay local.

### Question 3
**Scene:**  
A patient completes diagnostics, but the specialist still cannot see the updated medication note and calls the department directly. Another case is held for ten minutes because the receiving team is not sure which prep instructions were already given. A message from the medical director lands: “Why are clinicians still chasing information in chats and calls?” Whatever you improve here has to work in real clinical conditions, not just on paper.

**Decision:**  
How do you improve data handoff between care steps?

**Options:**
- **A:** Require the sending team to email a short patient summary before every internal transfer.
- **B:** Let the receiving team confirm missing details directly with the patient at the next step.
- **C:** Make transfer completion depend on a mandatory handoff checklist filled out by the sending team.
- **D:** Use a shared hourly handoff board so departments see the latest status in one place before calling each other.

### Question 4
**Scene:**  
The hospital is preparing to launch a new pre-op testing workflow with an external lab partner. Commercially, the timing matters: leadership wants it live this month. The partnerships manager sends a blunt note: “Every new workflow feels like a new integration project. We cannot keep rebuilding the hospital from scratch.” Leadership wants an approach that helps with this launch and does not make future partner onboarding harder.

**Decision:**  
How do you launch the new partner workflow?

**Options:**
- **A:** Start immediately with PDF results by email and let staff upload them into existing records manually.
- **B:** Build a custom one-off connection only for this lab so the workflow can go live quickly.
- **C:** Reduce scope and launch only one high-priority test package while keeping the rest on the current process.
- **D:** Define a standard partner data template and onboarding pattern before connecting any new external service.

### Product-Fit Question — FHIR Server
**Scene:**  
You improved parts of the journey, but the hospital still depends on a mix of local fixes, departmental workarounds, and partner-specific processes. Some improvements helped immediately, yet the underlying operating model still makes information flow harder to manage than it should be. The next step is to choose a FHIR server path that fits how your hospital needs to move forward.

**Decision:**  
What kind of FHIR server path best fits your hospital right now?

**Options:**
- **A:** We need maximum control and a self-managed path our technical team can shape over time.
- **B:** We need a platform-oriented path for building new workflows and digital applications around care delivery.
- **C:** We need a path that supports faster rollout and dependable operations without unnecessary infrastructure burden.
- **D:** We need a standards-led enterprise path with strong interoperability and governance.

**Hidden mapping:**
- A → HAPI
- B → Medplum
- C → Aidbox
- D → Firely


## Block 2 — Adaptive Medical Forms

**Block intro:**  
Your hospital has already moved some intake steps into digital channels, but the experience is still uneven across clinics and patient types. Some forms are easier to launch than to maintain, and some collect information that is not easy to reuse later in the journey. The next set of decisions is about making intake more adaptable without adding complexity for staff or patients.

### Question 5
**Scene:**  
Tuesday, 7:40 AM. Your outpatient clinics are no longer struggling only with queues — now they are struggling with drop-off before the visit even starts. Many patients receive a long pre-visit form, open it once, and leave it unfinished. By the time they arrive, registration still has to chase missing details at the front desk. A message from the ambulatory care lead pops up: “We moved intake earlier, but we did not actually make it easier.” The team wants a simpler intake experience without fragmenting the process even more.

**Decision:**  
How do you improve pre-visit intake completion?

**Options:**
- **A:** Send one short universal intake form before the visit and collect specialty details on-site.
- **B:** Keep the full intake form, but have the call center help patients complete it before arrival.
- **C:** Ask patients to arrive 20 minutes early and complete digital intake at kiosks in the waiting area.
- **D:** Split intake into a basic pre-visit form and a second follow-up form for selected visit types.

### Question 6
**Scene:**  
By midday, a different problem appears. Registration is no longer drowning in paper packets, but scanned PDFs, email attachments, and half-completed digital forms still have to be reviewed and re-entered manually into downstream systems. Staff keep opening the same patient record in multiple screens just to copy data across. The front-desk supervisor writes: “We digitized the form, but not the work.” The issue is no longer just form completion — it is what happens to the answers after they are submitted.

**Decision:**  
How do you reduce re-entry and fragmented intake handling?

**Options:**
- **A:** Let staff scan submitted forms into the patient record and re-enter missing details only when they become necessary.
- **B:** Replace the long intake packet with a short digital check-in and keep the remaining paperwork in separate follow-up steps.
- **C:** Add one intake coordinator to review incomplete submissions before patients reach the desk.
- **D:** Standardize one digital intake packet for the top three clinics first and leave the rest on current processes.

### Question 7
**Scene:**  
A new compliance update lands on your desk, and every department reacts differently. Cardiology has its own form version, orthopedics has another, and surgery still uses a PDF that no one wants to touch because “it mostly works.” What should be a simple change now requires multiple edits, approvals, and follow-up emails. The quality manager messages you: “We do not have one form system — we have a collection of local exceptions.” The larger challenge is keeping forms aligned without forcing every clinic into exactly the same workflow.

**Decision:**  
How do you make form updates easier across departments?

**Options:**
- **A:** Let each department keep its own forms and add only one shared cover sheet for basic patient details.
- **B:** Route every form change through a central governance group before anything goes live.
- **C:** Freeze non-critical form changes until the next quarterly review cycle.
- **D:** Create a shared question library for repeated fields, while departments keep local versions of specialty sections.

### Question 8
**Scene:**  
The final pressure point appears in a new pre-op workflow. Low-risk patients are still asked the same long checklist as complex cases, while some higher-risk cases trigger follow-up calls because staff need clarification after the form is submitted. Nurses say the process is too rigid for patients and too manual for the team. A note from the operations director appears: “Why are our digital forms still behaving like static PDFs?” The team needs a more adaptive approach, but it also needs consistency in how answers are handled across workflows.

**Decision:**  
How do you make intake smarter for different patient scenarios?

**Options:**
- **A:** Use one fixed intake form for everyone and ask nurses to follow up by phone when answers need clarification.
- **B:** Shorten the form by removing less common questions and let clinicians ask the rest during the visit.
- **C:** Add branching logic only to one high-volume workflow first and keep all other clinics on static forms.
- **D:** Route patients to different follow-up forms based on earlier answers, with operations managing the routing rules manually.

### Product-Fit Question — Adaptive Medical Forms
**Scene:**  
You reduced some friction, but the hospital still relies on a patchwork of form versions, routing decisions, and manual follow-up. Different services need flexibility, but the system also needs a more consistent way to handle changing questions, repeated fields, and patient-specific paths. The next step is to choose an adaptive forms approach that fits how your hospital wants to operate.

**Decision:**  
What kind of adaptive forms path best fits your hospital right now?

**Options:**
- **A:** We need a path focused on intake simplicity and business workflow efficiency.
- **B:** We need a developer-led path with strong control and extensibility for forms and integrations.
- **C:** We need a healthcare-specific path for adaptive forms and more structured clinical data capture.
- **D:** We need an intake path tightly connected to patient communication, readiness, and pre-visit coordination.

**Hidden mapping:**
- A → Formstack
- B → form.io
- C → Formbox
- D → Luma Health
