# Information Architecture

## Intent

Define the structure, hierarchy, and relationships of content across the Instinct 13 website. This document ensures that information organization reflects the constitutional principle that the website is an implementation of the Constitution — not a source of new doctrine.

## Governing Constraints

- No page may introduce concepts not already defined by the Constitution, Canon, or approved documentation.
- Approved term: **Manifestation** (not Archetype).
- Nothing is official until documented.
- The fixed navigation is: Home, Philosophy, Manifesto, The Circle, The Mirror, Contact.

## Site Map

```
/ (Homepage)
├── States 0–3 Sequence (implementation specification)
│
├── /philosophy
│   ├── Organizational Identity
│   ├── Constitutional Philosophy
│   ├── Foundational Principles
│   └── Architectural Baseline
│
├── /manifesto
│   ├── Why Instinct 13 exists
│   ├── What Instinct 13 is not
│   ├── Organizational Identity
│   └── Manifesto
│
├── /the-circle
│   ├── Overview
│   ├── Constitutional role
│   ├── Relationship with Manifestations
│   ├── Collections
│   └── Symbolic language
│
├── /the-mirror
│   ├── Overview
│   ├── Relationship observations
│   ├── Symbol-independence
│   └── Intentional cultivation
│
├── /manifestations
│   ├── Manifestation directory
│   └── Individual Manifestation pages
│
└── /contact
    ├── Contact channels
    ├── Repository
    ├── Current roadmap status
    └── Documentation
```

## Content Hierarchy Principles

1. **Constitution First:** All content derives from constitutional documents.
2. **Progressive Disclosure:** High-level concepts surface before detailed frameworks.
3. **No Orphan Content:** Every page is reachable from navigation or a documented link.
4. **Single Source of Truth:** Each concept is defined in one canonical location; all other references link to it.

## Route Boundaries

| Route | Content Source | Allowed Content |
|-------|---------------|-----------------|
| `/` | Implementation Spec | States 0–3 sequence |
| `/philosophy` | ORGANIZATIONAL_IDENTITY.md, Constitution | Approved philosophy only |
| `/manifesto` | Approved Manifesto | Approved manifesto only |
| `/the-circle` | Constitution, approved framework docs | The Circle framework |
| `/the-mirror` | Constitution, approved framework docs | The Mirror framework |
| `/manifestations` | Approved Manifestation docs | Manifestation directory |
| `/contact` | Project management | Contact and status |

## Navigation Structure

### Primary Navigation (Fixed)

```
Home | Philosophy | Manifesto | The Circle | The Mirror | Contact
```

- Navigation is **not visible** during the homepage States 0–3 sequence.
- Navigation becomes **fixed and visible** after State 3 completion.
- Navigation reflects approved constitutional structure only.

### Internal Linking

- Manifestations may be referenced from framework pages.
- Philosophy and Manifesto may cross-reference.
- No page may link to undefined or undocumented concepts.

## Validation Criteria

1. All routes map to approved constitutional content.
2. No page introduces terms or concepts absent from the Constitution.
3. Navigation matches the six approved items exactly.
4. Every page is reachable within three clicks from the homepage.
5. No dead-end pages exist (every page has a return path to navigation).
