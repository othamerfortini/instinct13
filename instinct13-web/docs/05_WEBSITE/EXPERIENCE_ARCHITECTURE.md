# Experience Architecture

## Intent

Define the cognitive and emotional journey a visitor undergoes when engaging with the Instinct 13 website. This document establishes the experience as a deliberate sequence of awareness states, not a conventional marketing funnel.

## Governing Constraints

- The website is an implementation of the Constitution — it may not introduce undefined concepts.
- Instinct 13 does not classify people; it creates frameworks to observe what is manifesting, understand why it may be emerging, and consciously decide what to cultivate next.
- Approved term: **Manifestation** (not Archetype).
- Nothing is official until documented.

## Experience States

The homepage presents a mandatory four-state cognitive sequence before revealing site navigation. This sequence is a **website implementation specification** (validation constraint), not a constitutional claim.

### State 0 — "You Are Not a Type."

- **Purpose:** Disrupt the visitor's expectation of classification.
- **Constraint:** Full-screen text only. No navigation, no branding, no supplementary content.
- **Transition:** Auto-advances after a timed interval or on user interaction (scroll / tap / key).

### State 1 — "What is manifesting now?"

- **Purpose:** Shift attention from classification to observation.
- **Constraint:** Full-screen text only. No navigation.
- **Transition:** Auto-advances or user-initiated.

### State 2 — "Reality is always greater than the framework used to observe it."

- **Purpose:** Introduce epistemic humility — the framework observes; it does not define.
- **Constraint:** Full-screen text only. No navigation.
- **Transition:** Auto-advances or user-initiated.

### State 3 — Logo Reveal

- **Purpose:** Reveal the Instinct 13 identity after the cognitive priming sequence.
- **Behavior:** The Instinct 13 logo appears with a subtle animation. After the animation completes, a single call-to-action appears: **"Begin Observation"**.
- **Navigation:** Site navigation becomes visible only after State 3 is reached.
- **Transition:** Clicking "Begin Observation" navigates to the Manifestations page.

## Accessibility

- All states must be perceivable without animation (reduced-motion preference).
- Text must meet WCAG 2.1 AA contrast requirements.
- State transitions must be operable via keyboard.
- Screen readers must announce each state in sequence.
- A skip mechanism may be offered to bypass the sequence for returning visitors.

## Responsive Behavior

- States 0–2: Text scales fluidly across breakpoints; minimum 16px base font.
- State 3: Logo and CTA scale proportionally; touch target minimum 44×44px.
- Landscape / portrait orientations must be supported.

## Route Boundaries

| Route | Content |
|-------|---------|
| `/` | States 0–3 sequence |
| `/manifestations` | Target of "Begin Observation" CTA |
| `/philosophy`, `/manifesto`, `/the-circle`, `/the-mirror`, `/contact` | Standard pages (navigation visible only after State 3) |

## Validation Criteria

1. No navigation element is visible before State 3 is reached.
2. The four states appear in the specified order: 0 → 1 → 2 → 3.
3. The Instinct 13 logo does not appear before State 3.
4. "Begin Observation" navigates to `/manifestations`.
5. No content on any state introduces concepts absent from the Constitution.
6. All states are accessible and responsive.
