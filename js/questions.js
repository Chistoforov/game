/**
 * All 8 questions with scene variants, week labels, options, and deltas.
 * PC = Patient Comfort, SE = Staff Effectiveness, DR = Data Readiness
 * FB = Formbox Fit, AB = Aidbox Fit
 * Deltas tuned with step boosts: positive pc/se +2 or +3, positive dr +1 (see scoring_tuning_update_step_boosts.md).
 */
const QUESTIONS = [
  {
    id: "q1",
    weekLabel: "8 weeks until audit",
    title: "Morning Bottleneck",
    sceneText: "It is Monday, 8:10 AM. The registration area is already backed up, several patients are late for diagnostics, and staff say the morning check-in process is too slow to handle volume. The CFO messages you: \"We cannot start every week like this.\"",
    question: "What do you do first?",
    options: [
      { id: "a", text: "Split the line into express check-in and full check-in.", pc: 3, se: 3, dr: 0, fb: 0, ab: 0 },
      { id: "b", text: "Send patients a pre-visit form so part of the intake is completed before arrival.", pc: 6, se: 4, dr: 4, fb: 1, ab: 0 },
      { id: "c", text: "Cut registration to the minimum and collect the rest later.", pc: 4, se: 0, dr: -1, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q2",
    weekLabel: "7 weeks until audit",
    sceneVariants: {
      a: {
        title: "Uneven Intake",
        sceneText: "The queue is shorter, but now the express lane captures too little while the full lane captures too much. The head nurse says intake quality now depends on which line a patient happened to enter."
      },
      b: {
        title: "Abandoned Forms",
        sceneText: "Some patients arrive with data already completed, but many open the form on their phone and abandon it halfway through. The front desk is calmer, but triage is now dealing with inconsistent and incomplete intake."
      },
      c: {
        title: "Deferred Work",
        sceneText: "Registration moves faster, but missing details now surface later in the journey. Nurses say they are manually recovering information that was intentionally postponed at the front desk."
      }
    },
    question: "How do you improve intake quality without bringing back the morning bottleneck?",
    options: [
      { id: "a", text: "Make more fields optional and validate them later during the visit.", pc: 3, se: 4, dr: -1, fb: 0, ab: 0 },
      { id: "b", text: "Break intake into short adaptive steps so each patient sees only relevant questions.", pc: 6, se: 4, dr: 4, fb: 1, ab: 0 },
      { id: "c", text: "Have registration staff fill the gaps manually at the desk.", pc: 3, se: 3, dr: 0, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q3",
    weekLabel: "6 weeks until audit",
    sceneVariants: {
      a: {
        title: "Too Many Exceptions",
        sceneText: "You reduced intake friction, but each department now has its own idea of what can be clarified later. A patient complains that the same information is being collected again during the next care step."
      },
      b: {
        title: "Good Intake, Poor Reuse",
        sceneText: "The intake flow is cleaner, but the next team still does not use the answers already collected. A patient says, \"I already filled this in,\" and the department lead asks why data is not being reused across steps."
      },
      c: {
        title: "Manual Transfer",
        sceneText: "Front-desk staff started filling gaps by hand, but this slowed down the process and introduced new errors. Now teams are copying information between screens and complaining about duplicate work."
      }
    },
    question: "How do you stop the same patient data from being collected again later in the journey?",
    options: [
      { id: "a", text: "Reuse previously captured answers across steps and keep forms structurally connected.", pc: 4, se: 4, dr: 3, fb: 1, ab: 0 },
      { id: "b", text: "Keep forms separate and let staff manually transfer relevant answers when needed.", pc: 3, se: 0, dr: -1, fb: 0, ab: 0 },
      { id: "c", text: "Remove questions from the second step, even if some data will be missing later.", pc: 3, se: 4, dr: -1, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q4",
    weekLabel: "5 weeks until audit",
    sceneVariants: {
      a: {
        title: "A New Version Is Needed Tomorrow",
        sceneText: "Cross-step reuse is starting to work, and one clinic immediately asks for an updated intake flow for a new patient stream tomorrow morning. IT says the next release window is in three weeks."
      },
      b: {
        title: "The Process Depends on People",
        sceneText: "Manual transfer kept things moving for a while, but any change now breaks the chain. The chief physician asks for an urgent intake update, and the team says it will become another manual workaround unless something changes."
      },
      c: {
        title: "Simplified Too Far",
        sceneText: "Complaints about repeated questions are down, but several clinics now say critical data is missing later in the journey. One department demands that a missing intake section be restored by tomorrow."
      }
    },
    question: "How do you handle the urgent change?",
    options: [
      { id: "a", text: "Use a paper addendum for one day and integrate it later.", pc: 3, se: 0, dr: -2, fb: 0, ab: 0 },
      { id: "b", text: "Let the operations team publish a new form version without waiting for a release cycle.", pc: 6, se: 4, dr: 4, fb: 1, ab: 0 },
      { id: "c", text: "Freeze the change until the next scheduled IT cycle.", pc: 3, se: 3, dr: -1, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q5",
    weekLabel: "4 weeks until audit",
    sceneVariants: {
      a: {
        title: "Paper Is Back in the Process",
        sceneText: "The paper addendum saved one day, but now someone has to manually transfer that information into the system. The next care team says they still do not have a full picture and are starting from scratch again."
      },
      b: {
        title: "Better Intake, Broken Handoff",
        sceneText: "Forms can now change faster, and intake finally feels more manageable, but the data still gets stuck at the point of entry. A physician asks, \"Why can't we see what was already collected before the patient reached us?\""
      },
      c: {
        title: "The Cost of Waiting",
        sceneText: "You delayed the change, and departments started building workarounds of their own. As a result, the next team no longer trusts intake data and prefers to collect context again at every handoff."
      }
    },
    question: "How do you fix the gap between care steps?",
    options: [
      { id: "a", text: "Send the next team a short summary before the patient arrives.", pc: 3, se: 3, dr: 0, fb: 0, ab: 0 },
      { id: "b", text: "Let each team re-collect only the context they need.", pc: 4, se: 3, dr: -1, fb: 0, ab: 0 },
      { id: "c", text: "Route patient data through a shared layer accessible across the whole journey.", pc: 4, se: 4, dr: 4, fb: 0, ab: 1 }
    ]
  },
  {
    id: "q6",
    weekLabel: "3 weeks until audit",
    sceneVariants: {
      a: {
        title: "Summaries Go Stale",
        sceneText: "Short summaries helped for a few days, but now different teams are working from different versions of the same information. One department has already built its own local handoff solution, and three more want the same."
      },
      b: {
        title: "Every Team Lives Separately",
        sceneText: "Repeated re-collection is becoming the new normal, and every department is optimizing around itself. The CIO warns that the hospital is drifting toward another set of disconnected local solutions."
      },
      c: {
        title: "Everyone Wants In",
        sceneText: "The idea of a shared layer is gaining traction, and multiple departments now want to connect to it. But without a common architecture, a promising direction could quickly turn into a patchwork of special cases."
      }
    },
    question: "What do you do next?",
    options: [
      { id: "a", text: "Allow a local handoff solution for one department to relieve pressure quickly.", pc: 3, se: 3, dr: -2, fb: 0, ab: 0 },
      { id: "b", text: "Build a reusable routing layer that all departments can use.", pc: 4, se: 6, dr: 4, fb: 0, ab: 1 },
      { id: "c", text: "Do nothing for now and revisit the issue at the end of the quarter.", pc: 3, se: 0, dr: -1, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q7",
    weekLabel: "2 weeks until audit",
    sceneVariants: {
      a: {
        title: "Patchwork Hospital",
        sceneText: "The local solution worked for one department, but now the hospital has several different ways of passing patient data between steps. During audit preparation, a clinician opens a patient record and sees conflicting data from different parts of the journey."
      },
      b: {
        title: "A Single Patient View Is Still Missing",
        sceneText: "The reusable routing layer is stabilizing handoffs, but auditors now ask how the hospital knows which patient record is current at each moment in the journey. The team realizes that routing alone is not enough; trust in the data still depends on a reliable shared view."
      },
      c: {
        title: "The Price of Inaction",
        sceneText: "You postponed the architecture decision, and departments continued to operate in separate process islands. Now conflicting patient data is visible in the record, and no one can quickly explain which version is correct."
      }
    },
    question: "How do you establish a reliable current patient view?",
    options: [
      { id: "a", text: "Treat the most recent entry as the main one and resolve discrepancies later.", pc: 3, se: 3, dr: -1, fb: 0, ab: 0 },
      { id: "b", text: "Pull current patient data from a shared, continuously updated layer.", pc: 4, se: 4, dr: 4, fb: 0, ab: 1 },
      { id: "c", text: "Ask registration staff to reconcile discrepancies manually by phone.", pc: 0, se: 0, dr: -1, fb: 0, ab: 0 }
    ]
  },
  {
    id: "q8",
    weekLabel: "1 week until audit",
    sceneVariants: {
      a: {
        title: "Temporary Confidence",
        sceneText: "The team agreed to rely on the latest record, but the auditors immediately ask how the hospital prevents the same inconsistency from happening again. The board does not want another workaround; it wants a clear operational priority for the next quarter."
      },
      b: {
        title: "A Foundation Finally Appears",
        sceneText: "The hospital finally has a more reliable current patient view, and pressure has started to ease. Now the board asks you to name the one priority that will reduce delays and rework most in the next quarter."
      },
      c: {
        title: "The System Runs on Calls",
        sceneText: "The team is keeping the hospital together through manual coordination, but it looks like crisis management rather than a sustainable operating model. The board wants to hear how you will move the organization out of constant reconciliation mode."
      }
    },
    question: "What should the hospital focus on next?",
    options: [
      { id: "a", text: "Optimize one high-volume care pathway end to end, from intake to outcome.", pc: 6, se: 4, dr: 4, fb: 0, ab: 0 },
      { id: "b", text: "Let each department improve its own process independently.", pc: 4, se: 3, dr: -1, fb: 0, ab: 0 },
      { id: "c", text: "Focus only on final documentation quality, not on data reuse across the journey.", pc: 3, se: 3, dr: -2, fb: 0, ab: 0 }
    ]
  }
];
