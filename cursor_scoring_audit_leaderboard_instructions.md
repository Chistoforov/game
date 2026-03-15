# Cursor Instruction — Scoring, Audit, and Leaderboard Logic

## Goal
Implement the full scoring mechanic for the healthcare conference game.

This document defines:
- metric initialization;
- how hidden answer deltas work for the 8 main scenario questions;
- how product-fit questions affect score;
- how the final round is calculated;
- how audit status is determined;
- how the final leaderboard score is calculated;
- how tie-breakers work.

The game is **not** trivia-based.
The player should win or lose based on trade-offs across 3 visible metrics:
- Patient Comfort
- Staff Comfort
- Data Readiness

## Core Design Rules
1. Product-fit questions must **not** decide the winner by themselves.
2. The 8 main scenario questions are the main source of meaningful score movement.
3. The final round must be stronger and more dangerous than a normal question.
4. Audit outcome matters for leaderboard ranking.
5. Leaderboard logic must stay understandable to players.
6. Product choices should affect narrative fit and final-round context, but should not secretly dominate score.

---

## 1. Metrics

### Visible metrics
There are 3 visible metrics:
- `patientComfort`
- `staffComfort`
- `dataReadiness`

### Value range
Each metric is always clamped to:
- minimum: `0`
- maximum: `100`

### Starting values
At the beginning of the game:
- `patientComfort = 25`
- `staffComfort = 25`
- `dataReadiness = 25`

### Helper values
For final ranking and audit logic also compute:
- `totalVisibleScore = patientComfort + staffComfort + dataReadiness`
- `lowestMetric = min(patientComfort, staffComfort, dataReadiness)`
- `highestMetric = max(patientComfort, staffComfort, dataReadiness)`

---

## 2. Answer Color Logic

Every non-product answer shows 3 colored icons:
- Patient
- Staff
- Data

Color meaning:
- `green` = improves the metric
- `yellow` = limited or partial effect
- `red` = worsens the metric

### Numeric mapping for regular questions
Use this default mapping for the 8 main scenario questions:
- `green = +6`
- `yellow = +2`
- `red = -4`

This means each normal answer usually has one green, one yellow, and one red impact.
Default total impact of a regular answer:
- `+6 +2 -4 = +4`

This keeps the game moving upward overall, while still forcing trade-offs.

### Numeric mapping for final round
The final round must feel heavier.
Use stronger values:
- `green = +10`
- `yellow = +3`
- `red = -12`

Important:
- final-round options do **not** need identical total value;
- one final option can be strategically stronger but riskier;
- one final option can be safer for audit survival but weaker for leaderboard outcome.

Recommended rule:
- regular questions use the fixed default mapping above;
- final question uses per-option custom deltas authored by design.

---

## 3. Main Question Scoring

There are 8 main scenario questions:
- Q1–Q4 lead to FHIR Server unlock
- Q5–Q8 lead to Adaptive Forms unlock

Each answer stores hidden metric deltas:

```ts
{
  patient: number,
  staff: number,
  data: number
}
```

### Example regular answer
If an answer shows:
- Patient = green
- Staff = red
- Data = yellow

Then apply:
```ts
patientComfort += 6
staffComfort += -4
dataReadiness += 2
```

After each answer:
1. apply deltas;
2. clamp each metric to `0..100`;
3. save the answer history;
4. update UI bars;
5. continue to next scene.

---

## 4. Product-Fit Question Scoring

There are 2 product-fit questions:
- after Q4: FHIR server choice
- after Q8: adaptive forms choice

### Key rule
The chosen product must **not** create a score advantage over other products.

### FHIR product-fit rule
All 4 FHIR server choices grant the same metric bonus.
Use:
- `patientComfort += 10`
- `staffComfort += 10`
- `dataReadiness += 10`

This applies equally to:
- HAPI
- Medplum
- Aidbox
- Firely

### Adaptive forms product-fit rule
All 4 adaptive-form choices also grant the same metric bonus.
Use:
- `patientComfort += 10`
- `staffComfort += 10`
- `dataReadiness += 10`

This applies equally to:
- Formstack
- form.io
- Formbox
- Luma Health

### Why
This ensures:
- the player is not rewarded for picking the “right brand”;
- the player chooses based on operating model fit;
- product-fit screens still feel rewarding.

### Product storage
Store the selected products in state:
```ts
selectedFhirProduct: 'hapi' | 'medplum' | 'aidbox' | 'firely'
selectedFormsProduct: 'formstack' | 'formio' | 'formbox' | 'luma'
```

These values are later used for:
- dynamic narrative text;
- final-round strategic alignment;
- result screen explanation.

After each product bonus, clamp metrics to `0..100`.

---

## 5. Final Round Logic

### Purpose
The final round is the capstone.
It should test whether the player can:
- stay above audit thresholds;
- make a strong final hospital decision;
- avoid ruining a weak metric;
- convert earlier strategic choices into a coherent final move.

### Important rule
Do **not** use a visible alignment label.
Do **not** show a hidden coefficient.
Do **not** show product-specific score multipliers.

Instead:
- use product choices to change scene framing and consequence text;
- use metric deltas to create real risk;
- let the player decide between a bold option and a safer compromise.

### Recommended final answer archetypes
The final round should include 4 answer types:
1. **Strategic rollout** — best long-term path, but risky for one weak metric.
2. **Balanced rollout** — safest chance to preserve audit pass.
3. **Fast local workaround** — short-term relief, weaker long-term data quality.
4. **Manual bridge** — operational survival through people effort, risk to staff comfort.

### Final-round scoring rule
Each final answer must have custom hidden deltas, for example:

```ts
finalOptionA = { patient: -12, staff: +3, data: +10 } // strategic but risky
finalOptionB = { patient: +6,  staff: -6, data: +3  } // balanced compromise
finalOptionC = { patient: +10, staff: +3, data: -12 } // fast workaround
finalOptionD = { patient: +3,  staff: -12, data: +10 } // manual bridge
```

These are example shapes, not mandatory exact values.

### Final-round alignment
The chosen products should define which final answer is considered the most strategically aligned.
This alignment affects:
- narrative consequence text;
- result title;
- explanation on the final screen.

This alignment should **not** directly add secret points.
The score effect already comes from the chosen final answer deltas.

### Suggested alignment map
This map can be adjusted by design later.

```ts
const alignedFinalOptionByStack = {
  'aidbox+formbox': 'A',
  'aidbox+luma': 'B',
  'hapi+formio': 'A',
  'firely+formstack': 'B',
  'medplum+formio': 'A',
  'aidbox+formstack': 'B',
  'firely+formbox': 'A',
}
```

Implementation note:
- the game may keep a full 16-combination mapping;
- if no special mapping is provided, default to one balanced answer.

---

## 6. Audit Result

### Goal
The audit is a status layer, not just a flavor label.
It must affect leaderboard ranking.

### Audit thresholds
Use these final thresholds after the final round:

#### Pass
All 3 metrics are at least 70:
```ts
patientComfort >= 70 && staffComfort >= 70 && dataReadiness >= 70
```

#### Conditional Pass
Not all 3 metrics are 70+, but the hospital is still close enough to avoid total failure.
Use:
```ts
lowestMetric >= 60
```

This means:
- at least one metric is below 70;
- but no metric is below 60.

#### Fail
Any metric below 60:
```ts
lowestMetric < 60
```

### Audit bonus
Add an audit bonus to the final leaderboard score:
- `Pass = +30`
- `Conditional Pass = +15`
- `Fail = +0`

Store:
```ts
 auditResult: 'pass' | 'conditional' | 'fail'
 auditBonus: 30 | 15 | 0
```

---

## 7. Final Score Formula

### Public score
Use a public score that is simple enough to explain.

```ts
totalVisibleScore = patientComfort + staffComfort + dataReadiness
finalLeaderboardScore = totalVisibleScore + auditBonus
```

### Why this formula
This keeps the ranking understandable:
- players can see the 3 end metrics;
- players can understand the audit bonus;
- the score is not based on opaque hidden math.

### Example
If a player finishes with:
- Patient = 72
- Staff = 81
- Data = 77

Then:
```ts
totalVisibleScore = 72 + 81 + 77 = 230
```

If audit result is `Pass`, then:
```ts
finalLeaderboardScore = 230 + 30 = 260
```

---

## 8. Tie-Breakers for Leaderboard Sorting

The leaderboard must remain deterministic.
Two players can still end with the same score.

### Sort priority
Sort leaderboard rows in this order:

1. `auditResultRank`
2. `finalLeaderboardScore`
3. `lowestMetric`
4. `completionTimeMs`
5. `createdAt`

### Exact priority definition
Use numeric rank values:
- `pass = 3`
- `conditional = 2`
- `fail = 1`

Then sort by:

```ts
1. higher auditResultRank first
2. higher finalLeaderboardScore first
3. higher lowestMetric first
4. lower completionTimeMs first
5. earlier createdAt first
```

### Why
This gives a clean ranking rule:
- better audit tier always wins;
- then higher score wins;
- if score is tied, the more balanced hospital wins;
- if still tied, the faster completion time wins;
- if still tied, earlier completion wins.

### Important note
Time is only a late tie-breaker.
Do **not** make time a core score input.
The game should reward hospital management quality, not speed-clicking.

---

## 9. What the Player Sees

### During gameplay
Visible:
- 3 bars: Patient / Staff / Data
- colored icons under answers for non-product questions
- no numbers shown per answer

Hidden:
- exact deltas
- alignment logic
- tie-break calculation

### On final screen
Show:
- Patient final value
- Staff final value
- Data final value
- Total visible score
- Audit result
- Audit bonus
- Final leaderboard score
- Completion time
- Chosen stack
- Result title
- short narrative explanation

### On public leaderboard
Show columns:
- Rank
- Player name
- Company (optional)
- Audit result
- Final leaderboard score
- Patient
- Staff
- Data
- Time
- Chosen stack

Optional helper text under leaderboard:

> Ranking is based on audit result first, then final score. Ties are broken by strongest lowest metric, then fastest completion time.

---

## 10. State Model

Recommended game state shape:

```ts
type AuditResult = 'pass' | 'conditional' | 'fail';
type FhirProduct = 'hapi' | 'medplum' | 'aidbox' | 'firely';
type FormsProduct = 'formstack' | 'formio' | 'formbox' | 'luma';

type MetricDeltas = {
  patient: number;
  staff: number;
  data: number;
};

type GameState = {
  patientComfort: number;
  staffComfort: number;
  dataReadiness: number;
  selectedFhirProduct: FhirProduct | null;
  selectedFormsProduct: FormsProduct | null;
  answers: Array<{
    questionId: string;
    optionId: string;
    deltas?: MetricDeltas;
  }>;
  totalVisibleScore: number;
  auditResult: AuditResult | null;
  auditBonus: number;
  finalLeaderboardScore: number;
  completionTimeMs: number;
  createdAt: number;
};
```

---

## 11. Helper Functions

### Clamp helper
```ts
function clampMetric(value: number): number {
  return Math.max(0, Math.min(100, value));
}
```

### Apply deltas
```ts
function applyMetricDeltas(state: GameState, deltas: MetricDeltas): GameState {
  return {
    ...state,
    patientComfort: clampMetric(state.patientComfort + deltas.patient),
    staffComfort: clampMetric(state.staffComfort + deltas.staff),
    dataReadiness: clampMetric(state.dataReadiness + deltas.data),
  };
}
```

### Product bonus
```ts
const PRODUCT_BONUS: MetricDeltas = {
  patient: 10,
  staff: 10,
  data: 10,
};
```

### Audit calculation
```ts
function getAuditResult(patient: number, staff: number, data: number): AuditResult {
  const lowest = Math.min(patient, staff, data);

  if (patient >= 70 && staff >= 70 && data >= 70) return 'pass';
  if (lowest >= 60) return 'conditional';
  return 'fail';
}
```

### Audit bonus calculation
```ts
function getAuditBonus(auditResult: AuditResult): number {
  switch (auditResult) {
    case 'pass':
      return 30;
    case 'conditional':
      return 15;
    case 'fail':
      return 0;
  }
}
```

### Final score calculation
```ts
function getFinalScores(state: GameState) {
  const totalVisibleScore = state.patientComfort + state.staffComfort + state.dataReadiness;
  const auditResult = getAuditResult(
    state.patientComfort,
    state.staffComfort,
    state.dataReadiness
  );
  const auditBonus = getAuditBonus(auditResult);
  const finalLeaderboardScore = totalVisibleScore + auditBonus;
  const lowestMetric = Math.min(
    state.patientComfort,
    state.staffComfort,
    state.dataReadiness
  );

  return {
    totalVisibleScore,
    auditResult,
    auditBonus,
    finalLeaderboardScore,
    lowestMetric,
  };
}
```

### Leaderboard sort helper
```ts
function auditRank(auditResult: AuditResult): number {
  switch (auditResult) {
    case 'pass':
      return 3;
    case 'conditional':
      return 2;
    case 'fail':
      return 1;
  }
}

function compareLeaderboardRows(a: GameState, b: GameState): number {
  const aScores = getFinalScores(a);
  const bScores = getFinalScores(b);

  if (auditRank(bScores.auditResult) !== auditRank(aScores.auditResult)) {
    return auditRank(bScores.auditResult) - auditRank(aScores.auditResult);
  }

  if (bScores.finalLeaderboardScore !== aScores.finalLeaderboardScore) {
    return bScores.finalLeaderboardScore - aScores.finalLeaderboardScore;
  }

  if (bScores.lowestMetric !== aScores.lowestMetric) {
    return bScores.lowestMetric - aScores.lowestMetric;
  }

  if (a.completionTimeMs !== b.completionTimeMs) {
    return a.completionTimeMs - b.completionTimeMs;
  }

  return a.createdAt - b.createdAt;
}
```

---

## 12. Implementation Notes for Cursor

Implement the mechanic with these exact principles:

1. Start all 3 metrics at `25`.
2. For all 8 non-product questions, apply hidden per-answer deltas.
3. Use the color convention as a UI abstraction only; do not show exact delta numbers to the player.
4. After the FHIR product choice, apply `+10 / +10 / +10` regardless of selected brand.
5. After the Adaptive Forms product choice, apply `+10 / +10 / +10` regardless of selected brand.
6. Use product choices only for narrative fit and final-round contextualization.
7. Do not give secret score multipliers for product alignment.
8. Make the final round stronger than normal questions with custom per-option deltas.
9. Compute audit result after the final round only.
10. Compute leaderboard score as `Patient + Staff + Data + audit bonus`.
11. Sort by audit tier first, then final leaderboard score, then highest lowest metric, then fastest time.
12. Show the score explanation clearly on the final screen and optionally below the public leaderboard.

---

## 13. Short Summary for Engineering

Use this as the minimal implementation contract:

```ts
START_METRICS = { patient: 25, staff: 25, data: 25 }
REGULAR_IMPACT = { green: +6, yellow: +2, red: -4 }
PRODUCT_BONUS = { patient: +10, staff: +10, data: +10 }
AUDIT_BONUS = { pass: 30, conditional: 15, fail: 0 }
FINAL_SCORE = patient + staff + data + auditBonus
TIEBREAKERS = [auditTier, finalScore, lowestMetric, fastestTime, earliestFinish]
```

This is the scoring system to implement unless explicitly overridden later.
