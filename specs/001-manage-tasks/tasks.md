---
description: "Implementation tasks for Manage Daily Tasks"
---

# Tasks: Manage Daily Tasks

**Input**: Design documents from `/specs/001-manage-tasks/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui.md`

**Tests**: Required by the project constitution. Follow Red-Green-Refactor: write each
story's tests first, verify they fail for the expected reason, implement the minimum
behavior, then refactor.

**Organization**: Tasks are grouped by the prioritized user stories in `spec.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks touch different files and can run in parallel after their stated prerequisites.
- **[Story]**: Identifies the user story a task implements.
- Every task names its target file path.

## Phase 1: Setup

**Purpose**: Establish the minimal static web project and required quality commands.

- [X] T001 Create `package.json` with JavaScript ES modules, explicit `*.test.mjs` discovery for `node --test`, `npm run start`, `npm run lint`, and development-only Playwright and ESLint dependencies.
- [X] T002 Configure `eslint.config.js` for the planned browser and Node ES modules and lint the planned application and test files.

## Phase 2: Foundational

**Purpose**: Provide isolated browser-storage behavior for fast, independent story tests.

- [X] T003 Create `tests/helpers/fake-storage.mjs` with a minimal `getItem`/`setItem`/`removeItem` test double that can simulate unavailable storage and write failures, and create `tests/helpers/test-server.mjs` to serve the repository over HTTP both for Playwright tests and `npm run start`.

**Checkpoint**: Complete setup and the storage test helper before starting user-story tests.

## Phase 3: User Story 1 - Create and review tasks (Priority: P1) - MVP

**Goal**: Create titled tasks with optional descriptions, display and open them, and preserve saved task data across browser restarts.

**Independent Test**: Add tasks with and without descriptions, open their details, reject a blank title, and confirm tasks retain their title, description, and initial Pending status after loading them again from the same storage.

### Tests for User Story 1

> Write these tests first and verify each fails for the expected missing behavior.

- [X] T004 [P] [US1] Write and run failing Playwright browser acceptance tests covering every User Story 1 acceptance scenario, including task creation, invalid titles, details, persistence after reload, app/list identity, and empty state; assert specified title styling, contrast, responsive behavior, and 44-by-44-pixel targets in `tests/acceptance.test.mjs` before creating production UI files.
- [X] T005 [P] [US1] Write unit tests for required/whitespace-only title validation, initial Pending status, and task lookup in `tests/task-service.test.mjs`.
- [X] T006 [P] [US1] Write storage tests for task serialization, reload, malformed saved data, and surfaced read/write failures in `tests/task-storage.test.mjs`.

### Implementation for User Story 1

- [X] T007 [US1] Implement task creation, required-title validation, stable unique identifiers, initial Pending status, and task lookup in `src/task-service.mjs` to pass `tests/task-service.test.mjs`.
- [X] T008 [US1] Implement the persistence interface with same-origin browser `localStorage`; surface malformed data and storage failures instead of silently returning an empty collection in `src/task-storage.mjs` to pass `tests/task-storage.test.mjs`.
- [X] T009 [US1] Create `index.html` with the `Curso-PSWE-07` document title, semantic app root, and module entry point for `src/app.mjs`.
- [X] T010 [US1] Create `src/styles.css` with the responsive light layout, one sans-serif family and accent color, readable contrast, 44-by-44-pixel primary targets, title/description hierarchy, and completed-task strikethrough styling.
- [X] T011 [US1] Implement the task list, friendly empty state, Add task form, title validation feedback, task selection/detail view, and storage-error feedback in `src/app.mjs`, connecting `src/task-service.mjs` to `src/task-storage.mjs`.

**Checkpoint**: User Story 1 works independently: tasks can be created, reviewed, and reloaded from browser storage.

## Phase 4: User Story 2 - Filter tasks by status (Priority: P2)

**Goal**: Show All, Pending, or Done tasks and make the active filter clear.

**Independent Test**: With Pending and Done tasks, select each filter and confirm the exact matching tasks are shown; confirm a filter with no matches shows a friendly empty state.

### Tests for User Story 2

> Add these tests before changing filter behavior and verify they fail first.

- [X] T012 [P] [US2] Add and run failing Playwright browser acceptance tests covering every User Story 2 acceptance scenario for All, Pending, Done, active-filter indication, and no-match empty state in `tests/acceptance.test.mjs` before implementing filter behavior.
- [X] T013 [P] [US2] Add unit tests for exact All/Pending/Done filtering in `tests/task-service.test.mjs`.

### Implementation for User Story 2

- [X] T014 [US2] Implement All, Pending, and Done filtering in `src/task-service.mjs` to pass the new filter unit tests.
- [X] T015 [US2] Add the three-option filter controls, active-filter state, filtered task rendering, and filtered empty state in `src/app.mjs` to pass the new acceptance tests.
- [X] T016 [US2] Style active and inactive filter controls with the single accent color in `src/styles.css`.

**Checkpoint**: User Story 2 works with the saved task list and all three filter states.

## Phase 5: User Story 3 - Update, complete, and remove tasks (Priority: P3)

**Goal**: Edit saved tasks, change their completion state, or delete them only after confirmation.

**Independent Test**: Edit and save a task, cancel another edit, toggle Pending/Done in both directions, cancel deletion, then confirm deletion and reload storage to verify it stays deleted.

### Tests for User Story 3

> Add these tests before changing edit, status, or deletion behavior and verify they fail first.

- [X] T017 [P] [US3] Add and run failing Playwright browser acceptance tests covering every User Story 3 acceptance scenario for editing/saving/cancelling, both status transitions and labels, and cancelling/confirming deletion in `tests/acceptance.test.mjs` before implementing edit, status, or deletion behavior.
- [X] T018 [P] [US3] Add unit tests for updating validated task fields, toggling Pending/Done, and deleting a task in `tests/task-service.test.mjs`.

### Implementation for User Story 3

- [X] T019 [US3] Implement validated task updates, Pending/Done transitions, and task deletion in `src/task-service.mjs` to pass the new service tests.
- [X] T020 [US3] Add Edit/Save/Cancel behavior, status-dependent action labels, persistence after each successful change, and a distinct warning-colored Delete action with confirmation in `src/app.mjs`.

**Checkpoint**: User Story 3 passes its acceptance tests and reloads with edits/status changes retained and confirmed deletions absent.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete specification and quality gates across all stories.

- [X] T021 Verify `specs/001-manage-tasks/quickstart.md` matches the implemented controls and documented local run commands.
- [X] T022 Run `npm test` and `npm run lint` from the repository root; fix any failures in the relevant `tests/`, `src/`, `index.html`, `eslint.config.js`, or `package.json` files.
- [X] T023 Verify visual and responsive requirements in the browser at mobile and desktop sizes and correct any layout, contrast, target-size, or browser-specific failures in `src/styles.css` and `src/app.mjs`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002 follows T001 because lint scripts and dependencies are declared in `package.json`.
- **Foundational (Phase 2)**: Depends on Setup; fake storage and HTTP test-server helpers are required before story tests.
- **User Stories (Phase 3+)**: Depend on Setup and Foundational tasks.
- **Polish (Phase 6)**: Depends on all three user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after the Foundational phase; independently delivers create/review/persistence value and is the MVP.
- **User Story 2 (P2)**: Starts after User Story 1 because it filters and styles the existing task list; it does not require User Story 3.
- **User Story 3 (P3)**: Starts after User Story 1 because it edits the existing detail view and persists changes; it can proceed independently of User Story 2.

### Within Each User Story

- Write and run the relevant tests before implementing production behavior.
- User Story 1 browser acceptance, unit, and persistence tests (T004-T006) are authored and run before production code; T005-T006 can be authored in parallel with T004.
- User Story 2's browser acceptance and service tests (T012-T013) can run in parallel and must fail before service logic (T014), list integration (T015), and filter styling (T016).
- User Story 3's browser acceptance and service tests (T017-T018) can run in parallel and must fail before service changes (T019) and detail UI integration (T020).

### Dependency Graph

```text
T001 -> T002
  \       \
   \       -> T003
    \          |
     +---------+-> US1: T004-T006 -> T007/T008 -> T009-T011
                                      |
                                      +-> US2: T012-T013 -> T014 -> T015 -> T016
                                      |
                                      +-> US3: T017-T018 -> T019 -> T020
US2 + US3 -> T021-T023
```

### Parallel Opportunities

- **Setup**: T002 touches a separate file from T001 but depends on the package scripts and dependency declared by T001, so complete them sequentially.
- **Foundational**: T003 follows setup and is required before story tests.
- **User Story 1 tests**: T004, T005, and T006 touch separate test files and can be authored and run in parallel after T003; confirm the Playwright acceptance tests fail before adding `index.html` or app UI.
- **User Story 1 implementation**: T007 and T008 touch separate logic and storage modules; after their tests are red, they can be implemented in parallel. T009 and T010 also touch separate files; finish the app shell and styles before integrating T011.
- **User Story 2 tests**: T012 and T013 touch separate files and can be authored in parallel after User Story 1.
- **User Story 3 tests**: T017 and T018 touch separate files and can be authored in parallel after User Story 1.
- User Stories 2 and 3 are functionally independent after User Story 1, but both change `src/app.mjs` and `src/task-service.mjs`; implement them sequentially to avoid same-file conflicts.

## Parallel Example: User Story 1

```text
After T003 is complete, author and run these independent failing test files in parallel:
Task: T004 - tests/acceptance.test.mjs
Task: T005 - tests/task-service.test.mjs
Task: T006 - tests/task-storage.test.mjs

T004 launches Chromium through Playwright and exercises the app over the local test server.
It must fail on the missing app behavior before implementing `index.html` or `src/app.mjs`.

After confirming the relevant tests fail, implement the separate modules in parallel:
Task: T007 - src/task-service.mjs
Task: T008 - src/task-storage.mjs
```

## Parallel Example: User Story 2

```text
After User Story 1 is complete, author both failing test files in parallel:
Task: T012 - tests/acceptance.test.mjs
Task: T013 - tests/task-service.test.mjs
Then implement filtering in src/task-service.mjs before integrating the controls in src/app.mjs.
```

## Parallel Example: User Story 3

```text
After User Story 1 is complete, author both failing test files in parallel:
Task: T017 - tests/acceptance.test.mjs
Task: T018 - tests/task-service.test.mjs
Then implement task transitions in src/task-service.mjs before integrating detail actions in src/app.mjs.
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete User Story 1 tests first, verify red, then implement the minimum code to pass.
3. Run automated tests and manually verify create/review/reopen behavior in the browser.
4. Stop and validate the create-and-review MVP before starting other stories.

### Incremental Delivery

1. Setup + Foundational -> test infrastructure ready.
2. User Story 1 -> create, review, and persist tasks; validate as MVP.
3. User Story 2 -> filter the saved task list.
4. User Story 3 -> edit, change status, and delete tasks.
5. Polish -> run all unit/acceptance tests, lint, and browser checks.

## Notes

- Every task starts with a checkbox and sequential ID; story tasks include their `[US#]` label.
- `[P]` appears only where tasks work on separate files and have no unmet dependency.
- Each task includes the exact target file path.
- Tests are required by the constitution and must fail before corresponding production code is written.
- Do not add accounts, categories, due dates, priorities, search, synchronization, or other unspecified features.
