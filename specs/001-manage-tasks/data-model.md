# Data Model: Manage Daily Tasks

## Task

Represents one item created and managed by the user.

| Field | Meaning | Rules |
|---|---|---|
| Identifier | Stable identity for selecting and updating a task | Required and unique within the saved task collection |
| Title | User-provided task name | Required; saving an empty or whitespace-only value is rejected |
| Description | Optional supporting detail | May be empty |
| Status | Completion state | Required; exactly `Pending` or `Done`; new tasks begin `Pending` |

## Relationships

- A browser profile's current application origin contains a collection of zero or more Tasks.
- Tasks do not have categories, due dates, priorities, owners, or relationships to other tasks.

## Lifecycle and validation

- Create: validate a non-blank title, then create the task in `Pending` state.
- Edit: update title and description only after title validation; cancelling discards unsaved edits.
- Complete: transition `Pending` -> `Done`.
- Reopen: transition `Done` -> `Pending`.
- Delete: remove a task only after the user confirms; cancelling leaves it unchanged.
- Filter: `All` includes both states; `Pending` and `Done` include only the matching state.

## Persistence boundary

Persist the task collection for the same application origin and browser profile so it survives
ordinary restarts. Storage errors or unreadable saved data must be surfaced; the application
must not claim an unsaved write succeeded or silently discard data by substituting an empty
collection.
