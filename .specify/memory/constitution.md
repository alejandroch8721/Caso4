<!--
Sync Impact Report
Version change: Unversioned -> 1.0.0 (initial constitution)
Modified principles: None; six principles added.
Added sections: Architecture Boundaries; Development Workflow.
Removed sections: None.
Follow-up TODO: Confirm the original ratification date.
-->
# Curso-PSWE-07 Constitution

## Core Principles

### I. SIMPLICITY FIRST (YAGNI)
Implement only what the spec requires. Choose the simplest working solution. Do not add
features, abstractions, configuration options, or dependencies "just in case". Any added
complexity MUST be justified in writing in the plan. This keeps the solution focused and
maintainable.

### II. SIMPLE, CLEAR DESIGN
Functions and modules MUST be small and have a single responsibility. Names MUST clearly
express intent. Abstractions MUST NOT be introduced for a single use; duplication MUST be
removed only when it is real. Implementations MUST NOT add premature optimization. These
rules keep code understandable without creating needless indirection.

### III. STRUCTURED ARCHITECTURE
Code MUST separate UI, application logic, and persistence into clear layers, with dependencies
flowing only UI -> logic -> persistence. UI code MUST NOT access storage directly. Persistence
MUST be hidden behind a small interface that can be replaced or faked in tests. This boundary
keeps responsibilities clear and makes logic testable.

### IV. TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE)
Production code MUST follow Red-Green-Refactor: write a failing test, make it pass with the
minimum code, then refactor. No production code may be written without a test that required it.
Business logic MUST have unit tests, and every user story MUST have at least one acceptance
test mirroring its acceptance scenarios. Tests MUST be fast and independent. This makes
behavior verifiable while limiting feedback time.

### V. SPEC IS THE SOURCE OF TRUTH
Every implementation task MUST trace to a requirement in the spec; anything not specified is
out of scope. Ambiguous requirements MUST be clarified before implementation. This prevents
unrequested behavior and aligns delivery with agreed needs.

### VI. DEPENDENCIES AND QUALITY
The standard library and platform features MUST be preferred. A third-party dependency may be
added only when it clearly removes more complexity than it adds. Code MUST pass linting and all
tests before it is considered done. This limits maintenance burden and establishes a verifiable
quality gate.

## Architecture Boundaries

The required dependency direction is UI -> logic -> persistence. Storage access MUST remain
behind the persistence interface; tests MUST be able to replace or fake that interface.

## Development Workflow

Plans MUST include a Constitution Check that verifies compliance before implementation begins.
Implementation MUST follow the test-first workflow in Principle IV; completion requires
successful linting and all tests.

## Governance

This constitution overrides conflicting project practices. Amendments MUST include a written
rationale and a semantic-version increment: MAJOR for backward-incompatible governance
changes, MINOR for new principles or materially expanded guidance, and PATCH for
non-semantic clarifications. Plans and reviews MUST verify compliance with this constitution
before implementation and before work is considered complete.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unavailable | **Last Amended**: 2026-10-26
