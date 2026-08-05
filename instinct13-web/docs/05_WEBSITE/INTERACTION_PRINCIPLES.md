# Interaction Principles

## Intent

Establish the behavioral rules governing how users interact with the Instinct 13 website. These principles ensure that interaction patterns reinforce the organizational philosophy — observation, not classification.

## Governing Constraints

- The website is an implementation of the Constitution.
- Instinct 13 is an operating system for understanding human behavior, not a brand.
- Principles are permanent; manifestations are not.
- No page may introduce undefined concepts.

## Core Interaction Principles

### 1. Observation Over Collection

The interface invites the visitor to observe — it does not collect, categorize, or profile. Interactions are reflective, not extractive.

### 2. Intentional Pacing

Transitions and animations serve comprehension, not decoration. Timing is deliberate: each state receives sufficient dwell time before transition.

### 3. User Sovereignty

The visitor controls progression through the experience. Auto-advance timers must be accompanied by user-initiated controls (tap, click, key). The visitor may always pause, revisit, or skip.

### 4. Minimal Disclosure

Only the information required for the current state is presented. No premature reveals, no information overload, no distraction.

### 5. Consistent Mental Model

Navigation, layout, and interaction patterns remain consistent across all pages. Once navigation is revealed (after the homepage sequence), it remains fixed and predictable.

## State Transitions

| From | Trigger | To | Behavior |
|------|---------|----|----------|
| State 0 | Timer / User | State 1 | Fade transition |
| State 1 | Timer / User | State 2 | Fade transition |
| State 2 | Timer / User | State 3 | Logo reveal animation |
| State 3 | "Begin Observation" CTA | `/manifestations` | Route navigation |

## Component Boundaries

- **Homepage Sequence Component:** Encapsulates States 0–3; owns all transition logic.
- **Navigation Component:** Renders only when `state >= 3`; receives visibility flag from Homepage Sequence.
- **Page Components:** Standard content pages; render within the navigation shell.

## Accessibility

- All interactive elements must have visible focus indicators.
- Animations respect `prefers-reduced-motion`.
- Touch targets meet WCAG 2.1 minimum (44×44px).
- All state changes are announced to assistive technologies.

## Validation Criteria

1. Auto-advance timers can be interrupted by user action.
2. No interaction collects personal data without explicit consent.
3. Navigation visibility is gated on State 3 completion.
4. All transitions are performant (no layout shift, < 100ms input delay).
5. Keyboard-only users can complete the full sequence.
