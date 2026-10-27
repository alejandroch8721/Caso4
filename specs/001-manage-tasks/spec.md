# Feature Specification: Manage Daily Tasks

**Feature Branch**: `not created`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "Build a simple to-do list application named "Curso-PSWE-07" that helps users organize and track their daily tasks. SCREENS 1. To-Do List: shows the user's tasks and lets them add a new task, open an existing task, and filter tasks by completion status (All, Pending, Done). 2. To-Do Detail: shows the details of a selected task and lets the user edit it, mark it as done or not done, and delete it. TASK Each task has a title (required), an optional description, and a completion status (done / not done). PERSISTENCE Tasks must still be there after the application is closed and reopened. VISUAL DESIGN - The name "Curso-PSWE-07" appears in the header of the To-Do List screen and as the application/window title. - Clean, minimal look: light background, generous white space, a single accent color for primary actions and the active filter, one sans-serif font family. Titles are larger and bolder than descriptions. - Sufficient text contrast; touch/click targets of at least 44x44 px; responsive layout for mobile and desktop. - To-Do List screen: header with the app name; a three-option filter (All, Pending, Done) with the active option highlighted; each row shows a status indicator and the title, and completed tasks appear with strikethrough and muted color; tapping a row opens the detail screen; a clearly visible "Add task" button opens a form with title and description fields; a short friendly empty state when there are no tasks or none match the active filter. - To-Do Detail screen: a back control; prominent title with the description below it (muted "No description" if empty); a visible status label (Done / Pending); three actions: Edit, Mark as done / Mark as not done (label changes with the current status), and Delete. Delete uses a distinct warning color and asks for confirmation first. - Edit mode reuses the add-task form with Save and Cancel buttons; an empty title shows a validation message. OUT OF SCOPE Keep the application simple and easy to use. Do not include anything not described above: no accounts, categories, due dates, priorities, search, or sync."

## Clarifications

### Session 2026-10-26

- Q: Should Curso-PSWE-07 run in a web browser, as an installed application, or both? → A: Web application used in a browser on mobile and desktop.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and review tasks (Priority: P1)

A user adds a task with a required title and optional description, sees it in the task list, and can open it to review its details. Tasks remain available after the application is closed and reopened.

**Why this priority**: Creating and finding persistent tasks is the core value of the application.

**Independent Test**: Add a titled task with and without a description, open each from the list, close and reopen the application, and confirm the tasks are still present.

**Acceptance Scenarios**:

1. **Given** the task list is open, **When** the user selects "Add task", enters a title and optional description, and saves, **Then** the new Pending task appears with a status indicator and title, and its details can be opened.
2. **Given** the add or edit form has no title, **When** the user attempts to save, **Then** a title validation message is shown and no task with an empty title is saved.
3. **Given** a task has no description, **When** the user opens its details, **Then** the title and a muted "No description" message are shown.
4. **Given** one or more tasks have been saved, **When** the user closes and reopens the application, **Then** those tasks and their saved details remain available.
5. **Given** the user opens the application, **When** the To-Do List is displayed on mobile or desktop, **Then** "Curso-PSWE-07" appears in the list header and application/window title, and the list has a light background, generous whitespace, one sans-serif font family, and a visible "Add task" action.
6. **Given** the list contains a Done task, **When** it is displayed, **Then** its title is struck through and muted, and primary touch and click targets are at least 44 by 44 pixels.
7. **Given** the task list is empty, **When** the list is displayed, **Then** it shows a short, friendly empty state.
8. **Given** the list and a status filter are displayed, **When** the user views the active filter and primary actions, **Then** they use the same single accent color.

---

### User Story 2 - Filter tasks by status (Priority: P2)

A user switches among All, Pending, and Done to focus on tasks with a chosen completion status.

**Why this priority**: Filtering makes task lists easier to scan while retaining the simple scope of the application.

**Independent Test**: Create pending and completed tasks, select each filter, and verify that the list and active-filter styling match the selected status.

**Acceptance Scenarios**:

1. **Given** the list contains pending and completed tasks, **When** the user selects "All", **Then** both statuses are shown and "All" is highlighted as active.
2. **Given** the list contains pending and completed tasks, **When** the user selects "Pending", **Then** only pending tasks are shown and "Pending" is highlighted as active.
3. **Given** the list contains pending and completed tasks, **When** the user selects "Done", **Then** only completed tasks are shown and "Done" is highlighted as active.
4. **Given** no tasks match the selected filter, **When** the list is displayed, **Then** a short, friendly empty state is shown.

---

### User Story 3 - Update, complete, and remove tasks (Priority: P3)

A user opens a task, edits or cancels changes, changes its completion status, or deletes it after confirming the action.

**Why this priority**: These actions let users maintain an accurate list after tasks have been created.

**Independent Test**: Open a saved task, edit and save it, try an edit and cancel it, toggle its completion status in both directions, and test both confirming and cancelling deletion.

**Acceptance Scenarios**:

1. **Given** a task's details are open, **When** the user selects "Edit", changes its title or description, and saves, **Then** the updated details appear in the detail view and task list.
2. **Given** a task is being edited, **When** the user selects "Cancel", **Then** the unsaved changes are discarded and the saved task remains unchanged.
3. **Given** a task is Pending, **When** the user selects "Mark as done", **Then** its status becomes Done, its action label changes to "Mark as not done", and the list shows its completed styling.
4. **Given** a task is Done, **When** the user selects "Mark as not done", **Then** its status becomes Pending, its action label changes to "Mark as done", and the list shows its pending styling.
5. **Given** a task's details are open, **When** the user selects "Delete" and cancels the confirmation, **Then** the task remains unchanged.
6. **Given** a task's details are open, **When** the user selects "Delete" and confirms, **Then** the task is removed from the list and does not return after reopening the application.

### Edge Cases

- The list contains no tasks, or the selected status filter has no matches.
- A user attempts to save a task with a blank title, including one containing only whitespace.
- A task has an empty description.
- A user cancels editing after changing fields; previously saved values remain unchanged.
- A user cancels the delete confirmation; the selected task remains available.
- A user changes a task's status while a status filter is active; the list reflects the new status, and the task is shown only when it matches the filter.
- The list is viewed at mobile and desktop viewport sizes; primary actions and task content remain usable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST be named "Curso-PSWE-07" in the To-Do List header and application/window title.
- **FR-002**: The To-Do List MUST show saved tasks, each with a status indicator and title; a task's title MUST be required.
- **FR-003**: Users MUST be able to add a task with a title and optional description. The initial completion status MUST be Pending.
- **FR-004**: The add and edit forms MUST reject a blank or whitespace-only title, show a validation message, and not save the invalid task or changes.
- **FR-005**: Selecting a task in the list MUST open its To-Do Detail view.
- **FR-006**: The detail view MUST show the task title, its description or muted "No description" text when empty, and a visible Done or Pending status label. It MUST provide a back control.
- **FR-007**: Users MUST be able to enter edit mode, update a task's title and description, save changes, or cancel and discard unsaved changes. Edit mode MUST reuse the title and description form used to add a task and provide Save and Cancel actions.
- **FR-008**: Users MUST be able to change a task between Done and Pending. The action label MUST reflect the current status ("Mark as done" for Pending and "Mark as not done" for Done).
- **FR-009**: Users MUST be able to delete a task only after confirming the deletion. The delete action MUST use a distinct warning color; cancelling confirmation MUST leave the task unchanged.
- **FR-010**: The task list MUST provide All, Pending, and Done filters, indicate the active filter, and show only tasks matching the selected filter.
- **FR-011**: Completed task titles in the list MUST use strikethrough and muted color. Titles MUST be visually larger and bolder than descriptions.
- **FR-012**: The list MUST show a short, friendly empty state when there are no tasks or no tasks matching the active filter.
- **FR-013**: Saved tasks, including their titles, descriptions, and completion statuses, MUST remain available after the application is closed and reopened. Confirmed deletions MUST remain deleted after reopening.
- **FR-014**: The interface MUST use a light background, generous whitespace, one sans-serif font family, and a single accent color for primary actions and the active filter. Normal text MUST have a contrast ratio of at least 4.5:1 and large text MUST have a contrast ratio of at least 3:1 against its background.
- **FR-015**: The interface MUST be responsive for mobile and desktop. Primary touch and click targets MUST be at least 44 by 44 pixels.
- **FR-016**: The application MUST NOT include accounts, categories, due dates, priorities, search, synchronization, or features outside this specification.
- **FR-017**: The application MUST be usable in a web browser on mobile and desktop.

### Key Entities

- **Task**: A user-organized item with a required title, optional description, and completion status of Done or Pending.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can add a titled task and see it in the list within 60 seconds, without assistance.
- **SC-002**: In all tested task states, selecting All, Pending, or Done shows exactly the tasks matching that filter.
- **SC-003**: 100% of saved tasks retain their title, description, and completion status after the application is closed and reopened; confirmed deletions remain absent.
- **SC-004**: Every primary task action is operable with a touch or click target at least 44 by 44 pixels on tested mobile and desktop layouts.
- **SC-005**: All acceptance scenarios in this specification pass, including empty states, invalid-title validation, cancelling edits, and cancelling deletion.

## Assumptions

- A task is Pending when first created and remains in its current state unless the user changes it.
- The task list is for one user of the current application installation; accounts and cross-device synchronization are out of scope.
- An empty description is permitted and displayed as "No description" in task details.
- "Closed and reopened" means reopening the application in the same browser profile; tasks are not required to transfer to another browser profile or device.
- Sufficient text contrast is evaluated using WCAG AA minimum contrast ratios: 4.5:1 for normal text and 3:1 for large text.
