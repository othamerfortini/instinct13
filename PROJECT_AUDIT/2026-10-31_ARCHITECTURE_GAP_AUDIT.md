# Instinct 13 — Architecture Gap Audit
**Date:** 2026-10-31  
**Baseline:** `main` at `8ab3290cdad3a3548533c8587dfb6fcf895c338c`  
**Status:** Non-normative audit; this document does not amend the Constitution, Canon, or any approved framework.

## 1. Executive finding

The repository's website and implementation are more mature than the canonical conceptual source set committed to GitHub. However, a search of the user's Library found important authoritative and working documents that are not yet version-controlled in the repository.

The correct next step is not to invent a new ontology or rebuild existing DQD work. It is to reconcile the GitHub repository with the source documents, preserve their status/provenance, and close the few genuine conceptual gaps before further product work.

## 2. Evidence reviewed

The audit reviewed:
- The complete recursive Git tree of `main` (not truncated).
- Constitutional, project-status, website, package-manifest, and CI files in GitHub.
- Relevant prior project records and files in the user's Library, including the canonical I13 correction, the founding-constitution draft, the DQD questionnaire testing protocol, and the Item Review Matrix work.

## 3. Findings

### 3.1 Constitutional source integrity in GitHub

The `00_CONSTITUTION/` directory contains only:
- `ORGANIZATIONAL_IDENTITY.md`
- `DECISION_LOG.md`
- `OPERATIONAL_LAW_001.md`

Findings:
- `ORGANIZATIONAL_IDENTITY.md` states that I13 exists to help people observe what is manifesting, understand why it may be emerging, and consciously decide what to cultivate. It rejects classifying people and states: **Principles are permanent. Manifestations are not.**
- `DECISION_LOG.md` records approval of the term **Manifestation** replacing **Archetype**, and approval of Operational Law 001.
- `OPERATIONAL_LAW_001.md` is a placeholder. Prior project history confirms the approved operative wording: **“Nothing is official until it is documented.”** No expanded authoritative wording was located. The canonical file can therefore be restored with this exact sentence only; no additional interpretation should be invented.
- `PROJECT_STATUS.md` references **Architectural Baseline v1.0** and **AR-001**, but those records were not found in the current GitHub tree or the Library search completed for this audit. Their status remains unresolved and must not be reconstructed from memory.

### 3.2 I13 concepts: distinguish the two different “13” structures

The Library contains:
- `INSTINCT_13_CANONICAL_CORRECTION.md` (created 2026-10-31), marked **Authoritative correction / supersedes conflicting legacy descriptions**.
- `INSTINCT_13_CANONICAL_PRINCIPLE_THE_13.md` (created 2026-10-31), marked **Canonical clarification**.
- `Instinct_13_Constituicao_Fundadora_v1.docx` (created 2026-08-05), explicitly marked **Constituição Fundadora (Rascunho v1.0)**.

The current canonical correction establishes:
- Twelve animal archetypes, arranged as six opposing pairs.
- The 13th is not an archetype, animal, character, identity, or named entity; it is formless and belongs to neither side.
- Five pairings are identifiable in the legacy Circle reference.
- The sixth pair is explicitly unresolved because legacy artwork incorrectly pairs The Performer with “The Awakened” and depicts the latter as a butterfly.
- The 13th must not be renamed, personified, or used to fill the missing archetype slot.

The separate founding-constitution draft lists thirteen philosophical principles (Lucidez, Autonomia, Impermanência, Manifestação, Ambiguidade, Contexto, Não Hierarquia, Escolha Consciente, The Mirror, Investigação, Relação, Humildade Epistemológica, Evolução). It is explicitly a draft and must not be conflated with the twelve animal archetypes plus the formless 13th principle.

The two canonical 2026-10-31 documents are not in GitHub. They should be imported with provenance, with one designated as the detailed governing correction and the other treated as a concise supporting clarification only if their wording is reconciled. The older founding-constitution draft must remain visibly marked as draft unless separately approved.

### 3.3 DQD and cognitive testing: existing work found outside GitHub

Prior project files establish that **DQD means Decision Quality Diagnostic**. It is an instrument within the broader project, not a synonym for the I13 animal-archetype system.

Existing DQD work found in the Library:
- Eight dimensions: **Clarity, Discipline, Action, Impartiality, Fortitude, Acceptance, Wisdom, Transcendence**.
- Forty questionnaire items: five per dimension.
- A **Questionnaire Testing Protocol v0.1**, recorded as approved for quality control.
- An **Item Review Matrix v0.1**, defined with 40 items, Evidence Prompts, overlap checks, context codes, and KEEP / REVISE / REMOVE criteria.
- A two-layer review structure: 200 individual item-by-participant observations and a 40-row aggregated item matrix.
- Five individual cognitive interviews are pending; no participant results or 200 observations should be fabricated.
- Questionnaire v0.1 is an engineering draft; Questionnaire v0.2 is blocked until cognitive testing and review.
- Cognitive testing is for comprehension, observability, and usability; it does **not** establish reliability, construct validity, predictive validity, criterion validity, psychometric validity, or industry benchmarks.
- The intended sequence is Scoring Sheet v1.0 → Decision Case Template v0.1 → Questionnaire v0.1 → Cognitive Testing → Questionnaire v0.2 → External Paid Pilot → later report/proposal refinement and validation.

No approved mapping between the eight DQD dimensions and the twelve I13 archetypes (or the 13th principle) was found. Do not assume equivalence or create such a mapping without explicit conceptual rationale and approval.

### 3.4 Website and governance alignment

- The website content map lists six published pages and correctly marks **The Code** as planned, not published.
- Fixed navigation is Home, Philosophy, Manifesto, The Circle, The Mirror, Contact.
- Website information architecture also describes a `/manifestations` route, but this is not one of the six navigation items. Keep route and navigation boundaries explicit.
- Website copy defines a Manifestation as a pattern of behavior, thought, or energy active at a given moment. The canonical correction should be used as the source for future wording; do not expand the definition beyond approved language.
- Website documentation consistently states that the website implements approved doctrine and must not create new doctrine. Retain this governance constraint.
- Existing visual assets include legacy depictions of “The Awakened” as a butterfly. The canonical correction explicitly supersedes those depictions for future work; preserve legacy assets only as historical material, not as current authority.

### 3.5 Project status and engineering traceability

- `PROJECT_STATUS.md` lists website documentation deliverables as next milestones even though the corresponding website documents and implementation are present. The status record is stale.
- Web CI runs type-check, lint, intent-engine tests, and production build. It does not validate documentation structure, approved terminology, or source traceability.
- The package pins Next.js 15.5.28 while `eslint-config-next` is 15.3.5. Check version alignment as a separate engineering maintenance task; do not mix it into conceptual documentation work.

## 4. Risk assessment

| Risk | Severity | Reason |
|---|---|---|
| Operational Law 001 is a placeholder despite an approved exact sentence | Critical | Canonical source does not reflect the recorded decision |
| Canonical I13 correction is outside GitHub | High | Repository and current conceptual source are inconsistent |
| Sixth archetype pairing remains unresolved | High | Legacy reference contradicts the canonical rule for the 13th |
| Architectural Baseline v1.0 / AR-001 not located | High | Referenced authority and decision trail are missing |
| DQD working artifacts are outside GitHub | High | Approved test protocol and matrix are not version-controlled |
| DQD-to-I13 mapping is not established | Medium | Forced equivalence would create construct-validity risk |
| Founding Constitution v1.0 is only a draft | Medium | Treating it as approved doctrine would overstate its status |
| Project status and milestones are stale | Medium | Work sequencing and progress reporting are unreliable |
| No documentation-governance checks in CI | Medium | Terminology and source-traceability regressions can pass technical CI |

## 5. Recommended work sequence

### P0 — Restore source integrity
1. Restore Operational Law 001 using only the approved sentence **“Nothing is official until it is documented.”**
2. Import the 2026-10-31 canonical I13 correction into GitHub with provenance.
3. Reconcile the concise canonical principle document with the detailed correction; avoid duplicate or contradictory authority.
4. Locate Architectural Baseline v1.0 and AR-001 or formally record their unresolved status.

### P1 — Resolve and document I13 ontology
1. Record the twelve known archetypes and five known pairings from the authoritative correction.
2. Keep the sixth pair explicitly unresolved until the project owner confirms the intended archetype.
3. Keep the 13th formless, nameless, neutral, and outside the twelve archetypes.
4. Keep the thirteen-principle founding constitution visibly marked as draft until separately approved.
5. Establish a source map that distinguishes approved, draft, deprecated, and unresolved concepts.

### P2 — Bring DQD work under version control
1. Import the existing approved Questionnaire Testing Protocol v0.1 and defined Item Review Matrix v0.1, preserving their existing status.
2. Import or recover Scoring Sheet v1.0, Decision Case Template v0.1, and Questionnaire v0.1 with their provenance and status.
3. Do not start interviews until participant consent, privacy, data handling, and the interview protocol are ready.
4. Run five individual cognitive interviews; retain raw records and the 200-row item-by-participant matrix.
5. Produce the 40-row aggregate, redundancy/context/evidence registers, scale decision, revision log, and only then Questionnaire v0.2.
6. Do not describe cognitive testing as psychometric validation.

### P3 — Product and engineering
1. Define the relationship, if any, between DQD and I13 only after the relevant constructs are explicitly distinguished and approved.
2. Update project status to reflect verified work.
3. Add documentation validation and terminology checks to CI after the canonical glossary/source map is stable.
4. Define data minimization, privacy, retention, access control, and deletion before collecting participant data.
5. Keep all implementation work on isolated branches and require review before merge or production deployment.

## 6. Guardrails

- Do not invent the sixth archetype or treat “The Awakened” as the 13th archetype.
- Do not conflate thirteen founding philosophical principles with twelve animal archetypes plus the formless 13th principle.
- Do not equate DQD dimensions with I13 archetypes without an approved mapping.
- Do not treat website copy, UI labels, or implementation behavior as constitutional authority.
- Do not classify people or present a manifestation as a permanent identity.
- Do not fabricate participant data or describe cognitive testing as psychometric validation.
- Keep human review and approval explicit for conceptual and measurement decisions.

## 7. Acceptance criteria for closing this audit

- [ ] Operational Law 001 reflects the exact approved sentence.
- [ ] Canonical I13 correction is version-controlled with provenance.
- [ ] The sixth archetype pairing remains unresolved until owner confirmation.
- [ ] Draft status of the founding constitution is preserved.
- [ ] Architectural Baseline v1.0 / AR-001 are located or formally dispositioned.
- [ ] DQD protocol and matrix are imported with their current status; no fake interview results are added.
- [ ] DQD-to-I13 relationship is either evidenced and approved or explicitly left undefined.
- [ ] Project status and next milestones reflect the verified repository state.

---
**Audit limitation:** The GitHub assessment covers the complete current `main` tree. Library records were also searched and are identified above by exact document title and status. This audit does not claim that missing Architectural Baseline / AR-001 records do not exist in another private source. Where provenance remains missing, owner confirmation is required.
