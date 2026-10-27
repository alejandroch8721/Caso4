# Quickstart: Manage Daily Tasks

This guide validates the task flows in a browser. It does not prescribe an implementation
layout beyond the plan's documented project structure.

## Prerequisites

- A current evergreen desktop or mobile browser with browser storage enabled.
- Node.js and npm to run unit tests, Playwright browser acceptance tests, and the JavaScript
  linter.
- Chromium installed for Playwright.

## Start the application

From the repository root, start a local static server:

```powershell
npm run start
```

Open the local URL printed by the command in the browser. Keep the same host and port when reopening the
app so it uses the same browser origin and saved task collection.

## Run automated tests and lint

Install project dependencies and the Playwright Chromium browser:

```powershell
npm install
npx playwright install chromium
```

Run the unit tests and automated browser acceptance tests:

```powershell
npm test
npm run lint
```

Expected result: unit and browser acceptance tests pass, and the JavaScript lint command
reports no errors.

During test-first implementation, run the relevant browser acceptance test after writing it
and before implementing its story. Confirm it fails because the specified behavior is
missing, then implement the minimum behavior and rerun it to green before refactoring.

## Additional manual visual checks

1. Review the app at mobile and desktop viewport sizes and confirm the layout remains usable.
2. Verify normal text contrast is at least 4.5:1, large text contrast is at least 3:1, and
   primary touch/click targets are at least 44 by 44 pixels.
3. Confirm the light background, generous whitespace, single sans-serif font, and single
   accent color match the visual requirements.

The functional user-story flows, task persistence, and storage-error behavior are covered by
the automated Playwright acceptance tests and must be run before implementing each story.
