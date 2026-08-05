# Implementation Specification

## Intent

Provide the technical implementation requirements for the Instinct 13 website, including component specifications, route definitions, state management, and validation criteria. This document translates the experience architecture, interaction principles, information architecture, and visual language into actionable engineering constraints.

## Governing Constraints

- The website is an implementation of the Constitution.
- No page may introduce concepts not defined by the Constitution or approved documentation.
- Nothing is official until documented.
- Fixed navigation: Home, Philosophy, Manifesto, The Circle, The Mirror, Contact.
- Approved term: **Manifestation** (not Archetype).

## Homepage Sequence — Implementation Specification

> **Classification: Website Implementation Specification / Validation Constraint**
>
> The following four-state homepage sequence is a website-level implementation specification. It defines how the homepage experience is built and validated. It is not a constitutional claim — it is a requirement for the website implementation.

### State Definitions

```
State 0: "You Are Not a Type."
State 1: "What is manifesting now?"
State 2: "Reality is always greater than the framework used to observe it."
State 3: Logo reveal (subtle animation) → "Begin Observation" CTA
```

### State Machine

```
[State 0] ──timer/user──▶ [State 1] ──timer/user──▶ [State 2] ──timer/user──▶ [State 3]
                                                                              │
                                                                    "Begin Observation"
                                                                              │
                                                                              ▼
                                                                    [/manifestations]
```

### Implementation Requirements

| Requirement | Specification |
|-------------|---------------|
| State order | 0 → 1 → 2 → 3 (enforced) |
| Navigation visibility | Hidden until State 3 reached |
| Logo visibility | Hidden until State 3 reached |
| CTA text | "Begin Observation" |
| CTA target | `/manifestations` |
| Timer behavior | Configurable; interruptible by user |
| Skip mechanism | Optional; respects returning visitors |

### Accessibility Requirements

- All states operable via keyboard.
- Screen reader announcements for each state.
- `prefers-reduced-motion` disables animations.
- Skip link available (optional but recommended).
- Focus management between states.

### Responsive Requirements

- Text scales fluidly across all breakpoints.
- Touch targets minimum 44×44px.
- No horizontal scroll at any breakpoint.
- Tested at 320px, 375px, 768px, 1024px, 1280px widths.

## Component Specifications

### HomepageSequence

```
Props: none
State: currentStep (0 | 1 | 2 | 3)
Behavior:
  - Renders current state content
  - Manages timer and user-initiated transitions
  - Exposes navigationVisibility flag
  - Renders logo and CTA only in State 3
```

### Navigation

```
Props: visible (boolean from HomepageSequence)
Behavior:
  - Renders fixed top navigation bar
  - Links: Home, Philosophy, Manifesto, The Circle, The Mirror, Contact
  - Hidden when visible=false
  - Accessible with keyboard navigation and ARIA labels
```

### PageShell

```
Props: children (page content)
Behavior:
  - Renders navigation (conditionally visible)
  - Renders page content area
  - Manages global layout (header, main, footer)
```

## Route Definitions

| Route | Component | Content Source |
|-------|-----------|---------------|
| `/` | HomepageSequence | States 0–3 |
| `/philosophy` | PhilosophyPage | ORGANIZATIONAL_IDENTITY.md, Constitution |
| `/manifesto` | ManifestoPage | Approved Manifesto |
| `/the-circle` | TheCirclePage | Constitution, framework docs |
| `/the-mirror` | TheMirrorPage | Constitution, framework docs |
| `/manifestations` | ManifestationsPage | Approved Manifestation docs |
| `/contact` | ContactPage | Project management |

## Validation Criteria

### Homepage Sequence

1. States appear in order: 0 → 1 → 2 → 3.
2. Navigation is not visible before State 3.
3. Logo is not visible before State 3.
4. "Begin Observation" navigates to `/manifestations`.
5. Auto-advance timers are interruptible.
6. All states are keyboard-accessible.
7. Animations respect `prefers-reduced-motion`.

### Navigation

1. Contains exactly six items: Home, Philosophy, Manifesto, The Circle, The Mirror, Contact.
2. Is fixed position after State 3.
3. Active state is visually indicated.
4. All links are keyboard-focusable.

### Content Pages

1. No page introduces undefined concepts.
2. All content derives from approved constitutional documents.
3. Pages render within the PageShell.
4. Pages are responsive across all breakpoints.

### Performance

1. First Contentful Paint < 1.5s on 3G.
2. Largest Contentful Paint < 2.5s on 3G.
3. Cumulative Layout Shift < 0.1.
4. First Input Delay < 100ms.

## File Structure (Suggested)

```
instinct13-web/
├── app/
│   ├── page.tsx                  # Homepage (States 0–3)
│   ├── philosophy/page.tsx
│   ├── manifesto/page.tsx
│   ├── the-circle/page.tsx
│   ├── the-mirror/page.tsx
│   ├── manifestations/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── HomepageSequence/
│   ├── Navigation/
│   └── PageShell/
├── docs/
│   └── 05_WEBSITE/               # This document set
└── styles/
    └── tokens.css                # Design tokens
```

## Validation Checklist

- [ ] Homepage sequence enforces State 0→1→2→3 order
- [ ] Navigation hidden until State 3
- [ ] Logo hidden until State 3
- [ ] "Begin Observation" navigates to /manifestations
- [ ] All six navigation items present and correct
- [ ] No page introduces undefined concepts
- [ ] WCAG 2.1 AA compliance
- [ ] Responsive at all breakpoints
- [ ] Performance targets met
- [ ] No constitutional content modified or invented
