# Visual Language

## Intent

Define the visual principles, design tokens, and aesthetic boundaries for the Instinct 13 website. The visual language reinforces the organizational philosophy: observation over classification, clarity over decoration, permanence of principles over transience of manifestation.

## Governing Constraints

- The website is an implementation of the Constitution.
- Instinct 13 is an operating system for understanding human behavior.
- Principles are permanent; manifestations are not.
- No visual element may imply classification, ranking, or judgment of persons.

## Visual Principles

### 1. Clarity Over Ornament

Visual elements serve comprehension. Every pixel must earn its place. Decoration that does not aid understanding is removed.

### 2. Observational Distance

The visual language maintains a respectful distance — it does not intrude on the visitor's space. White space is generous. Typography is calm.

### 3. Principle Permanence

Structural visual elements (typography scale, spacing system, color foundation) are stable across the site. They do not change per page or context.

### 4. Manifestation Transience

Content-specific visual treatments (illustrations, symbolic imagery) may vary by Manifestation or framework. They are layered onto the permanent foundation.

## Design Tokens

### Color

| Token | Usage |
|-------|-------|
| `--color-bg-primary` | Page background |
| `--color-bg-secondary` | Card / section background |
| `--color-text-primary` | Body text |
| `--color-text-secondary` | Muted / supporting text |
| `--color-accent` | Interactive elements, CTAs |
| `--color-border` | Subtle structural dividers |

- Color palette is restrained: neutral foundation with selective accent.
- All color pairs must meet WCAG 2.1 AA contrast (4.5:1 for text).

### Typography

| Token | Usage |
|-------|-------|
| `--font-family-primary` | Body text |
| `--font-family-display` | Headlines, States 0–3 |
| `--font-size-base` | 16px minimum |
| `--font-weight-regular` | 400 |
| `--font-weight-semibold` | 600 |
| `--line-height-body` | 1.6 |

- Typography is the primary carrier of hierarchy.
- Font choices reflect clarity and quiet authority.

### Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 32px |
| `--space-xl` | 64px |
| `--space-2xl` | 128px |

- Spacing uses a consistent scale.
- Generous white space reinforces observational distance.

### Motion

| Token | Value |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 300ms |
| `--duration-slow` | 600ms |
| `--easing-default` | ease-in-out |

- Motion serves comprehension, not spectacle.
- All animations respect `prefers-reduced-motion: reduce`.

## Component Visual Rules

| Component | Rules |
|-----------|-------|
| Homepage States 0–2 | Full-screen, centered text, no UI chrome |
| State 3 (Logo Reveal) | Subtle animation; logo centered; CTA below |
| Navigation Bar | Fixed top; minimal; text-only links |
| Page Content | Single-column or constrained-width; generous margins |
| Cards / Sections | Subtle border or shadow; consistent padding |

## Accessibility

- All text meets WCAG 2.1 AA contrast.
- Focus indicators are visible on all interactive elements.
- Color is never the sole carrier of meaning.
- Animations are disabled when `prefers-reduced-motion: reduce`.

## Responsive Behavior

- All layouts are mobile-first.
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- Typography scales fluidly between breakpoints.
- Spacing adjusts proportionally.

## Validation Criteria

1. All color pairs meet WCAG 2.1 AA contrast.
2. Typography base size is never below 16px.
3. Animations respect reduced-motion preferences.
4. No visual element implies classification or judgment of persons.
5. Design tokens are used consistently across all components.
6. No layout shift occurs during page transitions.
