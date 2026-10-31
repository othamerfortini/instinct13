# Instinct 13 — Architecture Gap Audit
**Date:** 2026-10-31  
**Baseline:** `main` at `8ab3290cdad3a3548533c8587dfb6fcf895c338c`  
**Status:** Non-normative audit; this document does not amend the Constitution, Canon, or any approved framework.

## 1. Executive finding

The public website and its implementation documentation are materially more developed than the canonical conceptual source set. The repository currently does not contain enough authoritative material to safely implement a complete I13 ontology, DQD mapping, or Cognitive Testing Engine without importing assumptions that have not been approved.

The immediate priority is therefore source-of-truth integrity and conceptual traceability, not additional website features.

## 2. Evidence reviewed

The audit reviewed the complete recursive Git tree of `main` (not truncated), the constitutional and project-status files, the website content map and navigation, the website architecture/experience/implementation documents, the web package manifest, and the Web CI workflow.

### 2.1 Constitutional source set

The `00_CONSTITUTION/` directory contains only:

- `ORGANIZATIONAL_IDENTITY.md`
- `DECISION_LOG.md`
- `OPERATIONAL_LAW_001.md`

Findings:

- `ORGANIZATIONAL_IDENTITY.md` defines the purpose: understand human behavior, observe what is manifesting, understand why it may be emerging, and consciously decide what to cultivate. It explicitly rejects classifying people and states: **Principles are permanent. Manifestations are not.**
- `DECISION_LOG.md` records approval of the term **Manifestation** replacing **Archetype**, and approval of Operational Law 001.
- `OPERATIONAL_LAW_001.md` is still a placeholder. Its content does not express the law that the Decision Log says was approved. This is a direct source-of-truth integrity gap.
- The repository references **Architectural Baseline v1.0** and **AR-001**, but no corresponding canonical baseline/decision record is present in the current tree.

### 2.2 Missing canonical conceptual artifacts

No canonical documents were found in the current `main` tree for:

- A complete I13 ontology or authoritative inventory of the claimed 13 elements.
- A Canon or a consolidated set of approved framework definitions.
- Formal definitions, boundaries, and relationships for The Circle and The Mirror beyond short website descriptions.
- A DQD construct model or an approved mapping between I13 aspects and DQD constructs.
- A Cognitive Testing Engine protocol.
- An Item Review Matrix, item lifecycle, or evidence/decision criteria.

This is a finding about the current repository tree, not a claim that these materials do not exist elsewhere.

### 2.3 Website and governance alignment

- The website content map lists six published content pages and correctly marks **The Code** as planned, not published.
- The fixed navigation is Home, Philosophy, Manifesto, The Circle, The Mirror, Contact.
- Website information architecture also describes a `/manifestations` route, but this route is not one of the six navigation items. This is not necessarily a defect; the route boundary and navigation distinction should remain explicit.
- Website documentation defines a Manifestation as a pattern of behavior, thought, or energy active at a given moment. The constitutional source currently approves the term but does not contain that full canonical definition. The definition should be reviewed and promoted only through an explicit approval process.
- Website documents consistently state that the website implements approved doctrine and must not create new doctrine. That governance constraint should be retained.

### 2.4 Project status and engineering traceability

- `PROJECT_STATUS.md` still lists website documentation deliverables as next milestones even though the corresponding website documents and implementation are present. The status record is stale and does not identify the next conceptual validation milestone.
- Web CI runs type-check, lint, intent-engine tests, and a production build. It does not currently validate documentation structure, canonical terminology, or traceability from public claims to approved source documents.
- The current web package pins Next.js 15.5.28 while `eslint-config-next` is 15.3.5. This version alignment should be checked as a separate engineering maintenance task; it is not a reason to change dependencies in this documentation branch.

## 3. Risk assessment

| Risk | Severity | Reason |
|---|---|---|
| Approved Operational Law is represented by a placeholder | Critical | The recorded approval cannot be verified from its canonical document |
| Referenced Architectural Baseline / AR-001 is absent from current tree | High | Later decisions and validation cannot be traced to the authoritative baseline |
| No canonical ontology / 13-element inventory in current tree | High | Downstream methodology and product work could invent or conflate concepts |
| No authoritative DQD mapping or testing protocol in current tree | High | Construct validity and item decisions would lack a traceable approved model |
| Website-level definitions exceed the current constitutional source detail | Medium | Public copy may be treated as doctrine without a canonical approval record |
| Project status and milestone list are stale | Medium | Work sequencing and progress reporting are unreliable |
| No documentation-governance checks in CI | Medium | Terminology and source traceability regressions can pass technical CI |

## 4. Recommended work sequence

### P0 — Restore canonical source integrity
1. Recover the approved text of Operational Law 001 from an authoritative prior record; do not reconstruct it from memory or paraphrase.
2. Locate and restore Architectural Baseline v1.0 and AR-001, or explicitly record their status if they were superseded.
3. Reconcile the Decision Log with the actual canonical documents.

### P1 — Establish the conceptual source map
1. Inventory all approved I13 concepts and their authoritative source locations.
2. Establish the canonical ontology and element inventory only from approved source material.
3. Record definitions, exclusions, relationships, and unresolved questions separately.
4. Keep proposed concepts visibly marked as proposals until approved.

### P2 — Specify DQD and cognitive testing
1. Define DQD constructs only after the I13 ontology and construct boundaries are approved.
2. Define the traceability chain: construct → item → response/evidence → review decision.
3. Specify the Cognitive Testing Engine, including consent, administration, probes, data handling, review, and human decision authority.
4. Define the Item Review Matrix and KEEP / REVISE / REMOVE criteria only after the measurement model is approved.

### P3 — Product and engineering
1. Translate approved methods into product requirements and a scoped MVP.
2. Define data minimization, privacy, retention, access control, and deletion requirements before collecting participant data.
3. Add documentation validation and terminology checks to CI after canonical terms and source locations are stable.
4. Keep all implementation work on isolated branches and require review before merge or production deployment.

## 5. Guardrails for follow-on work

- Do not invent or infer the contents of the 13 elements.
- Do not equate I13 aspects with DQD constructs without an approved mapping.
- Do not treat website copy, UI labels, or implementation behavior as constitutional authority.
- Do not classify people or present a manifestation as a permanent identity.
- Do not turn exploratory or unvalidated items into diagnostic claims.
- Keep human review and approval explicit for conceptual and measurement decisions.
- Preserve privacy by collecting only data required for an approved validation purpose.

## 6. Acceptance criteria for closing this audit

- [ ] Operational Law 001 is restored from an authoritative source and its approval is traceable.
- [ ] Architectural Baseline v1.0 / AR-001 are located, restored, or formally dispositioned.
- [ ] A canonical source map distinguishes approved, proposed, deprecated, and unresolved concepts.
- [ ] The 13-element inventory is either sourced from approved material or explicitly recorded as unavailable pending owner input.
- [ ] DQD and Cognitive Testing work is blocked from making normative claims until its dependencies are approved.
- [ ] Project status and next milestones reflect the actual repository state.

---
**Audit limitation:** This audit assesses the current GitHub `main` tree and documents retrievable through the connected repository. It cannot establish whether approved source material exists in private files, offline archives, other repositories, or prior conversations. Where provenance is missing, owner confirmation is required.
