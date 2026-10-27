# User Interface Contract: Manage Daily Tasks

This feature exposes a browser interface to a single user. It does not expose a server API or
cross-application integration.

## Application shell

- The application/window title and To-Do List header identify the application as
  **Curso-PSWE-07**.
- The app is usable in current evergreen desktop and mobile browsers.
- Use a light background, generous whitespace, one sans-serif family, and one accent color
  for primary actions and the active status filter.
- Maintain the specification's text contrast ratios, responsive behavior, and minimum
  44-by-44-pixel primary touch/click targets.
- Controls are keyboard-operable, have accessible names and form labels, and show visible
  keyboard focus. Status is not conveyed by color alone.

## To-Do List

- Show All, Pending, and Done filters; visibly distinguish the active option.
- Show each matching task's status and title. Done task titles use strikethrough and muted
  color.
- Selecting a task opens its details.
- **Add task** opens the shared title/description form.
- Show a short, friendly empty state when the collection is empty or the active filter has no
  matches.

## To-Do Detail

- Provide a back control, prominent title, description or muted **No description** text, and a
  visible Done or Pending status.
- Provide Edit, the status-dependent **Mark as done** / **Mark as not done** action, and a
  distinct warning-colored Delete action.
- Delete requires confirmation. Cancelling leaves the task unchanged.

## Add and edit form

- Provide a required title and optional description.
- Reject an empty or whitespace-only title with a visible validation message.
- For editing, provide Save and Cancel. Cancel discards unsaved changes.

## Persistence and failure behavior

- Successful changes remain available after reopening the app in the same browser profile and
  origin.
- A storage read/write failure or invalid saved collection is reported; the UI must not
  indicate a failed save succeeded or silently replace unreadable data with an empty list.
