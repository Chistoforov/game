# DMEA Game Narrative Rewrite — English Version

## Goal

Rewrite the current game flow into a more reactive narrative while keeping the existing MVP architecture.

The player is newly appointed as the hospital's Digital Operations Lead.
They have 60 days until an external audit and a board review.
The game is structured as 8 weekly decision points.
Each answer affects metrics as already defined in the current logic, but it also changes the narrative setup of the next scene.

This means:
- the game flow remains linear from Q1 to Q8
- Formbox check still happens after Q4
- Aidbox check still happens after Q7
- metrics, pressure, fit counters, and outcomes can stay as they are
- only the narrative text and scene setup become conditionally reactive

The purpose of this rewrite is:
1. make the story feel coherent
2. make player choices feel acknowledged
3. create replay value without building a massive branching narrative tree

---

## Core Narrative Mechanic

Use a **conditional scene variant system**.

Each question keeps:
- one fixed question ID
- one fixed set of 3 answer options
- one fixed scoring logic
- one fixed position in the sequence

But questions Q2–Q8 should support multiple `sceneVariants`.
The variant shown depends on the answer selected in the previous question.

Example:
- Q2 has variants `a`, `b`, `c`
- if player picked answer `a` in Q1, show `Q2.sceneVariants.a`
- if player picked answer `b` in Q1, show `Q2.sceneVariants.b`
- if player picked answer `c` in Q1, show `Q2.sceneVariants.c`

This keeps implementation simple:
- branch only the scene title and scene text
- keep the answer buttons the same
- keep the scoring model the same
- keep the product checkpoint logic the same

---

## Timeline Mechanic

The game should show a visible countdown to the audit.

Use this sequence:
- Q1: 8 weeks until audit
- Q2: 7 weeks until audit
- Q3: 6 weeks until audit
- Q4: 5 weeks until audit
- Q5: 4 weeks until audit
- Q6: 3 weeks until audit
- Q7: 2 weeks until audit
- Q8: 1 week until audit
- Final result screen: Audit day

This countdown should be visible on every question screen as a small status label above or near the scene card.

Suggested label format:
- `8 weeks until audit`
- `7 weeks until audit`
- `6 weeks until audit`
- ...
- `1 week until audit`

---

## Start Screen Copy

### Title
The Patient Journey Simulator

### Body
You have just been appointed to lead digital operations at a struggling hospital.

In 60 days, an external audit and board review will expose every weak point in the patient journey:
delays at intake, repeated manual work, disconnected systems, and unreliable data between care steps.

Each decision you make changes what happens next.

### Status label
8 weeks until audit

### CTA
Start

---

## Question Structure Rules

Each question should contain:
- `id`
- `weekLabel`
- `title`
- `sceneVariants`
- `question`
- `answers`

For Q1, only one scene variant is needed because it is the first scene.
For Q2–Q8, use three variants:
- `a`
- `b`
- `c`

Each scene variant should contain:
- `title`
- `sceneText`

Each answer should contain:
- `id`
- `text`
- existing metric deltas already defined elsewhere

---

## Narrative Tone Rules

Write in plain business English.
This is not a trivia game and not a technical training simulator.
The player is not a developer; the player is a hospital decision-maker.

Every scene should:
- feel like an operational problem
- mention at least one stakeholder or team reaction
- show pressure, trade-offs, or consequences
- avoid technical jargon unless necessary
- stay concise enough for a mobile screen

Good tone:
- operational
- executive
- healthcare-adjacent
- calm but high-pressure

Avoid:
- overly technical platform language
- vague generic crisis wording
- obvious “correct answer” phrasing

---

## Questions and Conditional Scene Variants

### Scene 1
**Week label:** 8 weeks until audit

**Title:** Morning Bottleneck

**Scene text:**
It is Monday, 8:10 AM. The registration area is already backed up, several patients are late for diagnostics, and staff say the morning check-in process is too slow to handle volume.
The CFO messages you: “We cannot start every week like this.”

**Question:**
What do you do first?

**Answer A:**
Split the line into express check-in and full check-in.

**Answer B:**
Send patients a pre-visit form so part of the intake is completed before arrival.

**Answer C:**
Cut registration to the minimum and collect the rest later.

---

### Scene 2(a)
**Week label:** 7 weeks until audit

**Title:** Uneven Intake

**Scene text:**
The queue is shorter, but now the express lane captures too little while the full lane captures too much.
The head nurse says intake quality now depends on which line a patient happened to enter.

### Scene 2(b)
**Week label:** 7 weeks until audit

**Title:** Abandoned Forms

**Scene text:**
Some patients arrive with data already completed, but many open the form on their phone and abandon it halfway through.
The front desk is calmer, but triage is now dealing with inconsistent and incomplete intake.

### Scene 2(c)
**Week label:** 7 weeks until audit

**Title:** Deferred Work

**Scene text:**
Registration moves faster, but missing details now surface later in the journey.
Nurses say they are manually recovering information that was intentionally postponed at the front desk.

**Question:**
How do you improve intake quality without bringing back the morning bottleneck?

**Answer A:**
Make more fields optional and validate them later during the visit.

**Answer B:**
Break intake into short adaptive steps so each patient sees only relevant questions.

**Answer C:**
Have registration staff fill the gaps manually at the desk.

---

### Scene 3(a)
**Week label:** 6 weeks until audit

**Title:** Too Many Exceptions

**Scene text:**
You reduced intake friction, but each department now has its own idea of what can be clarified later.
A patient complains that the same information is being collected again during the next care step.

### Scene 3(b)
**Week label:** 6 weeks until audit

**Title:** Good Intake, Poor Reuse

**Scene text:**
The intake flow is cleaner, but the next team still does not use the answers already collected.
A patient says, “I already filled this in,” and the department lead asks why data is not being reused across steps.

### Scene 3(c)
**Week label:** 6 weeks until audit

**Title:** Manual Transfer

**Scene text:**
Front-desk staff started filling gaps by hand, but this slowed down the process and introduced new errors.
Now teams are copying information between screens and complaining about duplicate work.

**Question:**
How do you stop the same patient data from being collected again later in the journey?

**Answer A:**
Reuse previously captured answers across steps and keep forms structurally connected.

**Answer B:**
Keep forms separate and let staff manually transfer relevant answers when needed.

**Answer C:**
Remove questions from the second step, even if some data will be missing later.

---

### Scene 4(a)
**Week label:** 5 weeks until audit

**Title:** A New Version Is Needed Tomorrow

**Scene text:**
Cross-step reuse is starting to work, and one clinic immediately asks for an updated intake flow for a new patient stream tomorrow morning.
IT says the next release window is in three weeks.

### Scene 4(b)
**Week label:** 5 weeks until audit

**Title:** The Process Depends on People

**Scene text:**
Manual transfer kept things moving for a while, but any change now breaks the chain.
The chief physician asks for an urgent intake update, and the team says it will become another manual workaround unless something changes.

### Scene 4(c)
**Week label:** 5 weeks until audit

**Title:** Simplified Too Far

**Scene text:**
Complaints about repeated questions are down, but several clinics now say critical data is missing later in the journey.
One department demands that a missing intake section be restored by tomorrow.

**Question:**
How do you handle the urgent change?

**Answer A:**
Use a paper addendum for one day and integrate it later.

**Answer B:**
Let the operations team publish a new form version without waiting for a release cycle.

**Answer C:**
Freeze the change until the next scheduled IT cycle.

---

## Formbox Check

After Scene 4, keep the existing Formbox checkpoint.

Do not change the existing scoring logic.
Only update the surrounding narrative so the checkpoint feels like the result of the player's decisions in the first half of the game.

Narrative intent:
- the first four weeks are about intake, structure, and adaptability
- Formbox should feel like the natural unlock for solving intake friction and structured capture problems

---

### Scene 5(a)
**Week label:** 4 weeks until audit

**Title:** Paper Is Back in the Process

**Scene text:**
The paper addendum saved one day, but now someone has to manually transfer that information into the system.
The next care team says they still do not have a full picture and are starting from scratch again.

### Scene 5(b)
**Week label:** 4 weeks until audit

**Title:** Better Intake, Broken Handoff

**Scene text:**
Forms can now change faster, and intake finally feels more manageable, but the data still gets stuck at the point of entry.
A physician asks, “Why can’t we see what was already collected before the patient reached us?”

### Scene 5(c)
**Week label:** 4 weeks until audit

**Title:** The Cost of Waiting

**Scene text:**
You delayed the change, and departments started building workarounds of their own.
As a result, the next team no longer trusts intake data and prefers to collect context again at every handoff.

**Question:**
How do you fix the gap between care steps?

**Answer A:**
Send the next team a short summary before the patient arrives.

**Answer B:**
Let each team re-collect only the context they need.

**Answer C:**
Route patient data through a shared layer accessible across the whole journey.

---

### Scene 6(a)
**Week label:** 3 weeks until audit

**Title:** Summaries Go Stale

**Scene text:**
Short summaries helped for a few days, but now different teams are working from different versions of the same information.
One department has already built its own local handoff solution, and three more want the same.

### Scene 6(b)
**Week label:** 3 weeks until audit

**Title:** Every Team Lives Separately

**Scene text:**
Repeated re-collection is becoming the new normal, and every department is optimizing around itself.
The CIO warns that the hospital is drifting toward another set of disconnected local solutions.

### Scene 6(c)
**Week label:** 3 weeks until audit

**Title:** Everyone Wants In

**Scene text:**
The idea of a shared layer is gaining traction, and multiple departments now want to connect to it.
But without a common architecture, a promising direction could quickly turn into a patchwork of special cases.

**Question:**
What do you do next?

**Answer A:**
Allow a local handoff solution for one department to relieve pressure quickly.

**Answer B:**
Build a reusable routing layer that all departments can use.

**Answer C:**
Do nothing for now and revisit the issue at the end of the quarter.

---

### Scene 7(a)
**Week label:** 2 weeks until audit

**Title:** Patchwork Hospital

**Scene text:**
The local solution worked for one department, but now the hospital has several different ways of passing patient data between steps.
During audit preparation, a clinician opens a patient record and sees conflicting data from different parts of the journey.

### Scene 7(b)
**Week label:** 2 weeks until audit

**Title:** A Single Patient View Is Still Missing

**Scene text:**
The reusable routing layer is stabilizing handoffs, but auditors now ask how the hospital knows which patient record is current at each moment in the journey.
The team realizes that routing alone is not enough; trust in the data still depends on a reliable shared view.

### Scene 7(c)
**Week label:** 2 weeks until audit

**Title:** The Price of Inaction

**Scene text:**
You postponed the architecture decision, and departments continued to operate in separate process islands.
Now conflicting patient data is visible in the record, and no one can quickly explain which version is correct.

**Question:**
How do you establish a reliable current patient view?

**Answer A:**
Treat the most recent entry as the main one and resolve discrepancies later.

**Answer B:**
Pull current patient data from a shared, continuously updated layer.

**Answer C:**
Ask registration staff to reconcile discrepancies manually by phone.

---

## Aidbox Check

After Scene 7, keep the existing Aidbox checkpoint.

Do not change the existing scoring logic.
Only update the surrounding narrative so the checkpoint feels like the result of solving data flow, reuse, routing, and patient view problems.

Narrative intent:
- the second half of the game is about data movement, trust, reuse, and cross-team continuity
- Aidbox should feel like the natural unlock for solving shared data and interoperability problems

---

### Scene 8(a)
**Week label:** 1 week until audit

**Title:** Temporary Confidence

**Scene text:**
The team agreed to rely on the latest record, but the auditors immediately ask how the hospital prevents the same inconsistency from happening again.
The board does not want another workaround; it wants a clear operational priority for the next quarter.

### Scene 8(b)
**Week label:** 1 week until audit

**Title:** A Foundation Finally Appears

**Scene text:**
The hospital finally has a more reliable current patient view, and pressure has started to ease.
Now the board asks you to name the one priority that will reduce delays and rework most in the next quarter.

### Scene 8(c)
**Week label:** 1 week until audit

**Title:** The System Runs on Calls

**Scene text:**
The team is keeping the hospital together through manual coordination, but it looks like crisis management rather than a sustainable operating model.
The board wants to hear how you will move the organization out of constant reconciliation mode.

**Question:**
What should the hospital focus on next?

**Answer A:**
Optimize one high-volume care pathway end to end, from intake to outcome.

**Answer B:**
Let each department improve its own process independently.

**Answer C:**
Focus only on final documentation quality, not on data reuse across the journey.

---

## Final Screen Narrative Rule

After Scene 8, change the status label to:
`Audit day`

Then show the existing final outcome logic.

Narrative framing:
- the result screen should feel like the outcome of 8 weeks of leadership decisions
- not just a score summary
- the player should feel they either stabilized the journey, partially improved it, or left it fragmented

---

## Implementation Notes for Cursor

### 1. Keep the current logic structure
Do not rebuild the game as a full branching tree.
Keep the current sequence:
Q1 -> Q2 -> Q3 -> Q4 -> Formbox check -> Q5 -> Q6 -> Q7 -> Aidbox check -> Q8 -> lead capture -> final result

### 2. Add `sceneVariants`
For Q1:
- use a single default scene

For Q2 to Q8:
- add `sceneVariants: { a: {...}, b: {...}, c: {...} }`

### 3. Variant selection rule
When rendering question N:
- read the answer selected in question N-1
- if previous answer was `a`, render variant `a`
- if previous answer was `b`, render variant `b`
- if previous answer was `c`, render variant `c`

### 4. Keep answer sets fixed
Do not vary answer buttons by branch in this MVP.
Only the narrative setup should vary.

### 5. Keep metrics and checkpoints unchanged
Do not change:
- metric deltas
- journey pressure logic
- Formbox fit logic
- Aidbox fit logic
- activation overlays
- final outcome thresholds

### 6. Add week labels
Add a `weekLabel` or `countdownLabel` field to each question.
Render it consistently in the UI.

Suggested values:
- Q1: `8 weeks until audit`
- Q2: `7 weeks until audit`
- Q3: `6 weeks until audit`
- Q4: `5 weeks until audit`
- Q5: `4 weeks until audit`
- Q6: `3 weeks until audit`
- Q7: `2 weeks until audit`
- Q8: `1 week until audit`

### 7. Preserve replay value
Because only the scene text changes, the same player can replay the game and notice different narrative consequences even when the overall product flow remains stable.

### 8. Keep text length mobile-friendly
Scene title:
- ideally under 5 words

Scene text:
- ideally 2 short paragraphs or 2 concise sentences
- avoid overflow on mobile
- avoid long technical explanations

---

## Suggested Data Shape

```js
const questions = [
  {
    id: "q1",
    weekLabel: "8 weeks until audit",
    title: "Morning Bottleneck",
    sceneText: "It is Monday, 8:10 AM...",
    question: "What do you do first?",
    answers: [
      { id: "a", text: "Split the line into express check-in and full check-in." },
      { id: "b", text: "Send patients a pre-visit form so part of the intake is completed before arrival." },
      { id: "c", text: "Cut registration to the minimum and collect the rest later." }
    ]
  },
  {
    id: "q2",
    weekLabel: "7 weeks until audit",
    sceneVariants: {
      a: {
        title: "Uneven Intake",
        sceneText: "The queue is shorter, but now the express lane captures too little..."
      },
      b: {
        title: "Abandoned Forms",
        sceneText: "Some patients arrive with data already completed..."
      },
      c: {
        title: "Deferred Work",
        sceneText: "Registration moves faster, but missing details now surface later..."
      }
    },
    question: "How do you improve intake quality without bringing back the morning bottleneck?",
    answers: [
      { id: "a", text: "Make more fields optional and validate them later during the visit." },
      { id: "b", text: "Break intake into short adaptive steps so each patient sees only relevant questions." },
      { id: "c", text: "Have registration staff fill the gaps manually at the desk." }
    ]
  }
]
