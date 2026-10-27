# Implementation Plan: Manage Daily Tasks

**Branch**: `001-manage-tasks` | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-manage-tasks/spec.md`

## Summary

Deliver the two-screen, responsive task application specified in `spec.md` as a small
browser-native web app. Use HTML, CSS, and JavaScript modules; keep task operations separate
from the UI and hide browser storage behind a small persistence interface. Store tasks in
the current browser origin's local storage so they survive ordinary browser restarts without
accounts, a backend, synchronization, or third-party runtime dependencies.

## Technical Context

**Language/Version**: HTML5, CSS, and browser JavaScript ES modules

**Primary Dependencies**: No runtime dependencies; Playwright and ESLint as development-only test and lint tools

**Storage**: Browser `localStorage`, scoped to the current origin and browser profile

**Testing**: Node.js built-in `node:test` and `node:assert/strict` for unit tests; Playwright
with Chromium for browser acceptance tests executed by `node --test`; ESLint for the required
lint gate; manual checks for responsive layouts and visual criteria

**Target Platform**: Current evergreen desktop and mobile browsers

**Project Type**: Static browser web application

**Performance Goals**: List, detail, and form interactions respond immediately for a
personal task list; no server or network request is required for task operations

**Constraints**: No third-party runtime dependencies, accounts, remote storage, or sync.
Playwright and ESLint are dev-only dependencies; they enable the constitution-required
test-first browser acceptance and lint gates. Storage errors and invalid saved data must be
surfaced; the UI must not report an unsaved change as successful. Browser storage is not a
backup and does not guarantee recovery after site data is cleared or the browser evicts data.

**Scale/Scope**: One user's task collection in one browser profile; two screens and a shared
add/edit form, with no specified high-volume or multi-user requirement

## Constitution Check

*Gate: Must pass before implementation begins; re-check after design.*

| Principle | Pre-design check |
|---|---|
| I. SIMPLICITY FIRST (YAGNI) | PASS — only specified task flows are planned; Playwright and ESLint are justified as dev-only tools for constitution-required acceptance tests and linting. |
| II. SIMPLE, CLEAR DESIGN | PASS — keep UI, task operations, and persistence small and separately responsible; avoid one-use abstractions beyond the required storage boundary. |
| III. STRUCTURED ARCHITECTURE | PASS — dependency direction is UI -> logic -> persistence; UI will not access browser storage directly. |
| IV. TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE) | PASS — write failing unit and Playwright browser acceptance tests before production code for each story, implement the minimum to pass, then refactor. |
| V. SPEC IS THE SOURCE OF TRUTH | PASS — scope and acceptance behavior trace to `spec.md`; no extra task features are planned. |
| VI. DEPENDENCIES AND QUALITY | PASS — use browser platform features and Node's built-in unit runner; Playwright and ESLint are justified dev-only test and lint tools. |

**Gate result**: PASS. The Playwright and ESLint development dependencies are justified in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-manage-tasks/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
src/
├── app.mjs
├── task-service.mjs
├── task-storage.mjs
└── styles.css
package.json
eslint.config.js
tests/
├── acceptance.test.mjs
├── task-service.test.mjs
├── task-storage.test.mjs
└── helpers/
    ├── fake-storage.mjs
    └── test-server.mjs
```

**Structure Decision**: Use one static web project with no backend. `app.mjs` owns DOM
interaction and view state; `task-service.mjs` owns task validation, filtering, and state
transitions; `task-storage.mjs` implements the small persistence interface with browser
storage. Node's built-in test runner exercises task operations and persistence; Playwright
acceptance tests exercise the real browser UI and storage before each story's production UI
changes. `package.json` exposes test and lint scripts. Playwright and ESLint are the only
third-party dependencies and are development-only because the constitution requires
test-first acceptance coverage and a lint gate; they add no runtime dependency.

## Complexity Tracking

| Addition | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Playwright (development only) | Runs each story's acceptance scenarios against the browser UI before production UI code, as required by the constitution. | Manual-only browser checks cannot provide an automated failing acceptance test before implementation; it adds no runtime dependency. |
| ESLint (development only) | Provides a repeatable JavaScript lint gate required by the constitution. | Manual style review is not a consistent or testable lint gate; no runtime package is added. |

## Constitution Check (Post-Design)

| Principle | Design check |
|---|---|
| I. SIMPLICITY FIRST (YAGNI) | PASS — one static app, one local persistence adapter, and only the specified user journeys; dev-only tools are justified by constitution-required acceptance tests and linting. |
| II. SIMPLE, CLEAR DESIGN | PASS — responsibilities are separated at the required UI/logic/persistence boundaries without a framework or general-purpose layer. |
| III. STRUCTURED ARCHITECTURE | PASS — UI -> logic -> persistence; a fake persistence implementation can isolate logic tests. |
| IV. TEST-DRIVEN DEVELOPMENT (NON-NEGOTIABLE) | PASS — each story's failing Playwright acceptance tests and unit tests precede its production changes; browser tests mirror the spec's acceptance scenarios. |
| V. SPEC IS THE SOURCE OF TRUTH | PASS — screens, states, validation, persistence, and exclusions map to requirements in `spec.md`. |
| VI. DEPENDENCIES AND QUALITY | PASS — browser platform APIs avoid runtime dependencies; dev-only Playwright and ESLint provide the required acceptance-test and lint gates, alongside built-in unit tests. |

**Post-design gate result**: PASS. The planned design complies with the constitution.
