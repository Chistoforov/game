# Final Results Copy Update for Cursor

## Goal

Update the final results screen copy for all ending variants so the page feels more celebratory, more shareable, and more emotionally rewarding.

The game flow is built around surviving and completing the audit.
Because of that, the final screen should feel like a meaningful completion moment, not only a dry status report.

---

## Core Copy Principle

Make **Congratulations!** the most emotionally noticeable line at the top of the page.

Do not make it a tiny helper line.
It should feel like the success/completion message the player sees first.

The hierarchy should be:
1. `Congratulations!`
2. `Audit complete`
3. `Your result:`
4. outcome title
5. outcome description

Important:
- `Congratulations!` should be visually stronger than `Audit complete`
- `Audit complete` should work as a supporting completion label
- `Your result:` should be smaller than the main result title
- the outcome title remains the main result badge/title

---

## Recommended Visual Hierarchy

### Top line
`Congratulations!`
- prominent
- bold
- celebratory
- larger than helper labels

### Second line
`Audit complete`
- smaller than Congratulations
- simple and calm
- supports the game narrative

### Third line
`Your result:`
- small label
- lighter than the title
- acts as a bridge to the result name

### Fourth line
Outcome title, for example:
- `Audit-Ready Hospital`
- `Digitally Stabilized Hospital`
- `Hospital Under Pressure`

This makes the page feel like:
- success / completion first
- formal result second

---

## Global Top Copy

Use this top structure for all ending variants:

```md
Congratulations!
Audit complete

Your result:
[Outcome title]
```

---

## Ending Variant 1 — Top Tier

### Outcome title
`Audit-Ready Hospital`

### Description
`You stabilized intake, improved team workflow, and connected the patient journey before audit review.`

### Full copy block

```md
Congratulations!
Audit complete

Your result:
Audit-Ready Hospital

You stabilized intake, improved team workflow, and connected the patient journey before audit review.
```

### Tone
- confident
- rewarding
- clearly winner-like
- suitable for sharing

---

## Ending Variant 2 — Middle Tier

### Outcome title
`Digitally Stabilized Hospital`

### Description
`You improved key parts of the hospital journey and made operations more stable before audit review.`

### Full copy block

```md
Congratulations!
Audit complete

Your result:
Digitally Stabilized Hospital

You improved key parts of the hospital journey and made operations more stable before audit review.
```

### Tone
- positive
- still shareable
- not overly critical
- should feel like a solid professional result

---

## Ending Variant 3 — Low Tier

### Outcome title
`Hospital Under Pressure`

### Description
`The hospital still needs stronger system-wide improvements to reduce friction and manual rework.`

### Full copy block

```md
Congratulations!
Audit complete

Your result:
Hospital Under Pressure

The hospital still needs stronger system-wide improvements to reduce friction and manual rework.
```

### Tone
- still respectful
- not humiliating
- the player completed the simulation, so the copy should not feel punishing
- should remain shareable

---

## Important Tone Rule

Do not make the low-tier ending sound harsh or embarrassing.
The user still completed the game and should still feel comfortable sharing the result.

So:
- avoid language like `failure`, `poor`, `bad`, `you did not manage`, or `you lost`
- keep the tone constructive
- reward completion even if the result is weaker

---

## Text Hierarchy Guidance for Design

Use these relative emphasis levels:

### Strongest emotional line
`Congratulations!`

### Strongest informational line
Outcome title

### Secondary supporting lines
- `Audit complete`
- `Your result:`
- short description

Recommended idea:
- `Congratulations!` should visually stand out as the emotional hook
- the outcome title should remain the main identity label for the result

That means `Congratulations!` can be large and bold, but the outcome title should still feel like the main badge/title of the page.

---

## Implementation Note

Update only the final result copy and text hierarchy in this task.
Do not redesign scoring logic here.
Do not change share button behavior in this task.
Do not change product links in this task.

This task is only about:
- final heading structure
- outcome titles
- outcome descriptions
- tone and hierarchy of the final screen

---

## Deliverable

Cursor should update the final result screen so that:
- `Congratulations!` becomes a prominent celebratory line
- `Audit complete` appears below it as a completion label
- `Your result:` introduces the final outcome title
- all 3 ending variants use the new structure
- the descriptions are updated to the exact copy in this document
- the final page feels more rewarding and share-friendly
