# Technical Specification: Patient Journey Game
**Browser-based, mobile-first. Built for Health Samurai / DMEA 2026.**

---

## 1. Overview

Single-player browser game. No installation, no login required to start. Optimized for mobile (375–430px width). The player acts as a Digital Operations Lead at a hospital and must guide a patient through a broken care journey. Decisions affect three live metrics. Two products — Formbox and Aidbox by Health Samurai — unlock during gameplay as consequences of good decisions and visually improve the system.

**Tech stack:**
- Pure HTML + CSS + JavaScript (Vanilla JS or lightweight framework like Svelte/Vue)
- No backend required for MVP
- Optional: form at the end to capture name + email before showing the final result
- Hosted as a static site (Netlify, Vercel or similar)
- No app store, no install

---

## 2. Game Flow Structure

```
START SCREEN
    ↓
QUESTION 1 → answer → metric update → micro-animation
QUESTION 2 → answer → metric update → micro-animation
QUESTION 3 → answer → metric update → micro-animation
QUESTION 4 → answer → metric update → micro-animation
    ↓
FORMBOX CHECK
    → if formbox_fit >= 2: FORMBOX ACTIVATION SCREEN (full-screen overlay)
    → if formbox_fit < 2: FORMBOX PAIN SCREEN (interstitial offer)
    ↓
QUESTION 5 → answer → metric update → micro-animation
QUESTION 6 → answer → metric update → micro-animation
QUESTION 7 → answer → metric update → micro-animation
    ↓
AIDBOX CHECK
    → if aidbox_fit >= 2: AIDBOX ACTIVATION SCREEN (full-screen overlay)
    → if aidbox_fit < 2: AIDBOX PAIN SCREEN (interstitial offer)
    ↓
QUESTION 8 → answer → metric update → micro-animation
    ↓
LEAD CAPTURE SCREEN (name + email + organization, optional but incentivized)
    ↓
FINAL OUTCOME SCREEN
```

---

## 3. Game State (JavaScript Object)

```js
const state = {
  metrics: {
    patientComfort: 50,     // 0–100
    staffEffectiveness: 50, // 0–100
    dataReadiness: 50       // 0–100
  },
  journeyPressure: 50,      // 0–100, shown as vertical fill meter
  formboxFit: 0,            // hidden counter, max 4
  aidboxFit: 0,             // hidden counter, max 3
  formboxActive: false,
  aidboxActive: false,
  currentQuestion: 0,
  answers: []               // log of chosen options per question
}
```

---

## 4. Metric Caps (Stage Gates)

This prevents metrics from reaching 100 too early and makes product activation feel meaningful.

| Stage | Max: patientComfort | Max: staffEffectiveness | Max: dataReadiness |
|---|---|---|---|
| Before Formbox | 70 | 70 | 70 |
| After Formbox only | 85 | 80 | 90 |
| After Aidbox (both active) | 100 | 100 | 100 |

Apply cap after every delta:
```js
function applyDelta(metric, delta) {
  const cap = getCurrentCap(metric)
  state.metrics[metric] = Math.min(cap, Math.max(0, state.metrics[metric] + delta))
}
```

---

## 5. Journey Pressure Meter

- Starts at 50.
- Increases (worsens) with bad decisions: each "worst" answer adds +8 to pressure.
- Decreases (improves) with good decisions: each "best" answer subtracts 6.
- Range: 0–100.
- Visual: vertical pill/bar filled from bottom to top, gradient from green (bottom) at 0% to red (top) at 100%.
- Label: **"Journey Pressure"**
- When Formbox activates: pressure -15.
- When Aidbox activates: pressure -10.
- No numeric countdown shown. No clock. Only the fill level.

---

## 6. Questions, Answers & Deltas

Each question has a scene (1–2 sentences), a title, and 3 answer options. Each option carries:
- metric deltas (patientComfort, staffEffectiveness, dataReadiness)
- journeyPressure delta
- formboxFit increment (hidden, 0 or 1)
- aidboxFit increment (hidden, 0 or 1)

**Legend:** PC = Patient Comfort | SE = Staff Effectiveness | DR = Data Readiness | JP = Journey Pressure | FB = Formbox Fit | AB = Aidbox Fit

---

### Q1 — Morning Bottleneck
**Scene:** *"It's 8am. The registration desk has a 20-minute queue. You can't add more staff today."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Split into express and full check-in lanes | +2 | +1 | -1 | -4 | 0 | 0 |
| B | Send patients a pre-visit form by link the evening before | +2 | +1 | +2 | -6 | +1 | 0 |
| C | Reduce registration to minimum fields, collect the rest later | +3 | +2 | -2 | -5 | 0 | 0 |

---

### Q2 — Incomplete Intake
**Scene:** *"Several patients arrive with missing or inconsistent information. Staff are stopping the flow to chase details."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Make more fields optional and validate them later in the visit | +2 | +1 | -2 | -3 | 0 | 0 |
| B | Break intake into short adaptive steps that adjust based on answers | +3 | +1 | +3 | -6 | +1 | 0 |
| C | Have registration staff fill gaps manually at the desk | 0 | -2 | +2 | +5 | 0 | 0 |

---

### Q3 — Repeated Questions
**Scene:** *"A patient complains: 'I already filled this in.' The next care step is asking for data already collected at intake."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Reuse shared answers across steps, keep forms structurally linked | +2 | +2 | +2 | -5 | +1 | 0 |
| B | Let staff manually copy relevant answers to the next form | 0 | -2 | +1 | +6 | 0 | 0 |
| C | Remove questions from step 2 even if some data will be missing | +2 | +1 | -2 | -2 | 0 | 0 |

---

### Q4 — Last-minute Change
**Scene:** *"A clinic needs an updated intake form live tomorrow. IT says the next release is in 3 weeks."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Use a paper addendum for one day, then integrate it later | -1 | 0 | -2 | +7 | 0 | 0 |
| B | Let the operations team publish a new form version without IT | +2 | +2 | +2 | -6 | +1 | 0 |
| C | Freeze the change until the next scheduled IT cycle | -1 | +1 | 0 | +4 | 0 | 0 |

---

### ⚡ FORMBOX CHECK (after Q4)

```
if (state.formboxFit >= 2):
    → show FORMBOX ACTIVATION OVERLAY
    → apply activation bonus: PC+6, SE+2, DR+10, JP-15
    → state.formboxActive = true

else:
    → show FORMBOX PAIN SCREEN
    → if player clicks "Activate Now":
        → apply reduced bonus: PC+4, SE+1, DR+7, JP-10
        → state.formboxActive = true
    → if player clicks "Continue without":
        → no bonus, formboxActive stays false
```

---

### Q5 — Handoff Gap
**Scene:** *"The next care team doesn't have visibility into what was already collected at intake. They're starting from scratch."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Send a summary document ahead of the patient's arrival | +1 | 0 | -1 | -2 | 0 | 0 |
| B | Let the next team re-collect the context they need | -1 | -1 | 0 | +7 | 0 | 0 |
| C | Route patient data through a shared layer accessible to all care steps | +2 | +2 | +3 | -6 | 0 | +1 |

---

### Q6 — One-Team Quick Fix
**Scene:** *"One department builds its own local solution for passing patient data. Three others want the same next week."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Build a local handoff just for this department for now | +1 | +1 | -2 | +4 | 0 | 0 |
| B | Design a reusable data routing layer all departments can use | +2 | +1 | +3 | -6 | 0 | +1 |
| C | Keep things as-is and review at end of quarter | 0 | 0 | -1 | +5 | 0 | 0 |

---

### Q7 — Inconsistent Patient View
**Scene:** *"A clinician opens a patient record and sees conflicting data from different steps. She's not sure which is current."*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Trust the most recent record and flag it for review later | 0 | +1 | -2 | +4 | 0 | 0 |
| B | Pull current patient data from a shared, always-updated layer | +1 | +1 | +3 | -6 | 0 | +1 |
| C | Ask registration to reconcile records manually by phone | -1 | -2 | +1 | +8 | 0 | 0 |

---

### ⚡ AIDBOX CHECK (after Q7)

```
if (state.aidboxFit >= 2):
    → show AIDBOX ACTIVATION OVERLAY
    → apply activation bonus: PC+4, SE+6, DR+8, JP-10
    → state.aidboxActive = true

else:
    → show AIDBOX PAIN SCREEN
    → if player clicks "Activate Now":
        → apply reduced bonus: PC+3, SE+4, DR+6, JP-8
        → state.aidboxActive = true
    → if player clicks "Continue without":
        → no bonus, aidboxActive stays false
```

---

### Q8 — Leadership Pressure
**Scene:** *"Leadership asks: what one change will reduce delays and rework most in the next quarter?"*

| Option | Text | PC | SE | DR | JP | FB | AB |
|---|---|---|---|---|---|---|---|
| A | Optimize one high-volume care pathway end-to-end | +3 | +2 | +2 | -5 | 0 | 0 |
| B | Let each department improve their own processes independently | +1 | +1 | -1 | +3 | 0 | 0 |
| C | Focus on final documentation quality, not on data reuse | 0 | 0 | -2 | +5 | 0 | 0 |

---

## 7. Product Activation Overlay

Triggered when a product is activated — either automatically or via pain screen. This is a **full-screen modal** that appears over everything.

### Visual structure:
```
[ Darkened overlay — entire screen ]
        ↓
[ Centered card, animated entrance from below ]

  🎁  (gift icon, animated bounce-in)

  "You unlocked:"
  [ FORMBOX by Health Samurai ]   ← large, brand-colored text

  Metric boost animation:
  ┌──────────────────────────────┐
  │  Patient Comfort    +6  ✅   │
  │  Staff Effectiveness +2  ✅  │
  │  Data Readiness    +10  ✅   │
  └──────────────────────────────┘
  (each row animates in one-by-one with number counting up)

  "Digital forms are now live across the patient journey."
  (1 sentence, plain language, no technical jargon)

  [ Continue → ]
```

### Animation sequence:
1. Overlay fades in (200ms).
2. Card slides up from bottom (300ms).
3. Gift icon bounces (400ms).
4. Product name fades in (200ms).
5. Metric rows appear one-by-one (300ms each), numbers count up from 0 to delta.
6. After all rows shown, Continue button fades in.

### Content per product:

**Formbox:**
- Title: "You unlocked: Formbox by Health Samurai"
- Bonuses (auto): PC +6, SE +2, DR +10
- Bonuses (manual install): PC +4, SE +1, DR +7
- Journey Pressure (auto): -15
- Journey Pressure (manual): -10
- Tagline: *"Digital forms are now live across the patient journey."*

**Aidbox:**
- Title: "You unlocked: Aidbox by Health Samurai"
- Bonuses (auto): PC +4, SE +6, DR +8
- Bonuses (manual install): PC +3, SE +4, DR +6
- Journey Pressure (auto): -10
- Journey Pressure (manual): -8
- Tagline: *"Patient data now flows between every step of care."*

---

## 8. Pain Screen (Interstitial)

Shown when a product's fit counter didn't reach threshold. Not a punishment — just an offer.

**Formbox pain screen:**
```
"Your intake still creates friction."

Patients repeat information.
Staff fills gaps manually.
Structured data isn't stable yet.

[ Activate Formbox — fix this now ]
[ Continue without it ]
```

**Aidbox pain screen:**
```
"Your patient flow still breaks between steps."

Data is collected, but not reused across the journey.
Each handoff starts from scratch.

[ Activate Aidbox — connect the flow ]
[ Continue without it ]
```

---

## 9. UI Layout (Mobile-First)

**Screen dimensions:** designed for 375–430px wide viewport.

```
┌─────────────────────────────────┐
│  HEADER (sticky, ~72px)         │
│  [■■■■■□] Patient Comfort       │
│  [■■■□□□] Staff Effectiveness   │
│  [■■□□□□] Data Readiness        │
├─────────────────────────────────┤
│                         [│] JP  │ ← Journey Pressure: vertical pill, right edge
│                                 │
│  SCENE CARD                     │
│  [Scene illustration – SVG]     │
│  "Scene text..."                │
│                                 │
│  QUESTION                       │
│  "What do you do?"              │
│                                 │
│  [Answer A                    ] │
│  [Answer B                    ] │
│  [Answer C                    ] │
│                                 │
├─────────────────────────────────┤
│  FLOW STRIP (footer, ~44px)     │
│  ● ● ● ◉ ○ ○ ○ ○               │
│  (past=filled, current=pulse,   │
│   future=empty, module=colored) │
└─────────────────────────────────┘
```

### Header metrics:
- Three horizontal bars, each labeled.
- Color gradient: red (0%) → yellow (50%) → green (100%).
- Animate smoothly on every change (CSS transition 400ms).
- Thin bars (~8px height), full width, with label text above or inline.

### Journey Pressure meter:
- Vertical pill in the right edge of the screen, ~16px wide, ~120px tall.
- Fill from bottom to top.
- 0% = green (no pressure). 100% = red (crisis).
- Label: "Journey Pressure" rotated 90° or placed below.
- Animate on every change (transition 400ms).

### Scene card:
- Simple flat SVG illustration per scene.
- 1–2 sentence scene text, max 25 words.
- Bold question text, max 15 words.

### Answer buttons:
- Large tap targets (min 56px height).
- Full width, rounded corners.
- On tap: brief highlight animation before processing.
- After tap: show +/- delta labels on the header metrics (small counters animate, fade out after 1200ms).

### Flow strip:
- 8 dots in a row representing the 8 questions.
- Past steps: filled circle (gray).
- Current step: pulsing circle (brand color).
- Future steps: empty circle (light gray).
- After Formbox activates: small "F" badge appears between steps 4 and 5.
- After Aidbox activates: small "A" badge appears between steps 7 and 8.

---

## 10. Start Screen

```
[Health Samurai logo]

"The Patient Journey Simulator"

Can you guide a patient through a broken care system?
Your decisions shape the outcome.

[  Start →  ]

No login required. Takes ~5 minutes.
```

---

## 11. Lead Capture Screen (before final result)

Shown after Q8, before outcome.

```
"You've completed the journey."

To see your full results and unlock your invitation
to the FHIR Health Summit side event at Charité, Berlin
— tell us who you are.

[ Name              ]
[ Organization      ]
[ Email             ]

[ See My Results → ]

[ Skip and see results ]  ← smaller link below
```

If skipped: show results anyway, but no invite offered.

---

## 12. Final Outcome Screen

Three possible outcomes based on final metric averages:

```js
const avg = (patientComfort + staffEffectiveness + dataReadiness) / 3

if (avg >= 75 && formboxActive && aidboxActive):
    outcome = "Smooth Patient Journey"
else if (avg >= 55 || formboxActive || aidboxActive):
    outcome = "Partially Digitized Journey"
else:
    outcome = "Fragmented Patient Journey"
```

**Smooth outcome:**
```
✅ Smooth Patient Journey

You digitized intake, connected the data flow,
and reduced manual rework across every step.

Patient Comfort:      [████████░░] 84%
Staff Effectiveness:  [███████░░░] 76%
Data Readiness:       [█████████░] 91%

Powered by:
[ Formbox ] [ Aidbox ] — Health Samurai

─────────────────────────────────────

🎟 You're invited.
Join our side event at Charité, Berlin
during DMEA 2026 — April 22, 6pm.
[Register your spot →]
```

**Partial outcome:**
```
⚠️ Partially Digitized Journey

Some steps improved, but data gaps remain.
Manual handoffs are still slowing your team down.

[metrics shown]

[ See how Formbox + Aidbox close the gap → ]
```

**Fragmented outcome:**
```
❌ Fragmented Patient Journey

Each step works in isolation.
Patients experience friction. Staff fill gaps manually.

[metrics shown]

[ See what a smooth journey looks like → ]
```

---

## 13. Micro-animation After Each Answer

When player taps an answer:

1. Button highlights (50ms).
2. Metric bars animate to new values (CSS transition 400ms).
3. Delta labels appear next to each bar: "+2" or "−1" in green/red, fade out after 1200ms.
4. Journey Pressure meter animates (400ms).
5. Flow strip advances to next dot (300ms).
6. Next question card slides in from right (250ms).

---

## 14. Scene Illustrations

Use simple flat SVG icons per scene. Keep illustrations abstract and non-clinical — no medical equipment, no patient conditions. Think workspace icons, not hospital imagery.

| Q | Scene suggestion |
|---|---|
| Q1 | Reception desk, queue of patient silhouettes |
| Q2 | Patient with a clipboard, staff looking confused |
| Q3 | Two identical forms side by side |
| Q4 | Clock on the wall + document icon |
| Q5 | Two department icons with a broken link between them |
| Q6 | One gear feeding into three others |
| Q7 | A record with conflicting timestamps |
| Q8 | Bar chart with a question mark |

---

## 15. Color Palette

| Role | Color |
|---|---|
| Brand primary | `#1A1A2E` (dark navy) |
| Brand accent | `#E94560` (red-pink) |
| Metric green | `#27AE60` |
| Metric red | `#E74C3C` |
| Metric yellow | `#F39C12` |
| Background | `#F5F7FA` |
| Card background | `#FFFFFF` |
| Answer button | `#FFFFFF` with border `#DDE1E7` |
| Answer hover/tap | `#F0F4FF` |
| Formbox badge | `#3498DB` |
| Aidbox badge | `#8E44AD` |

---

## 16. File Structure

```
/game
  index.html
  /css
    main.css
    animations.css
  /js
    state.js         ← game state object and logic
    questions.js     ← all 8 questions, options, deltas
    metrics.js       ← cap logic, applyDelta function
    overlays.js      ← activation overlay, pain screen logic
    ui.js            ← DOM updates, animations
    main.js          ← game loop and event listeners
  /assets
    /svg             ← scene illustrations (q1.svg ... q8.svg)
    logo.svg
    gift-icon.svg
  /data
    questions.json   ← optional: questions as data file
```

---

## 17. Out of Scope for MVP

- Backend / database
- Leaderboard
- Multiplayer
- Native app
- Authentication
- Analytics (can add Plausible or simple pixel post-launch)

---

## 18. Delivery Requirements

- Works on Safari iOS 16+, Chrome Android.
- No horizontal scroll.
- All tap targets ≥ 44px.
- First load under 200KB (no heavy frameworks).
- No external fonts that block rendering.
- Tested at 375px (iPhone SE) and 430px (iPhone Pro Max).
