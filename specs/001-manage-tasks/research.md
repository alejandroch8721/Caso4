# Research: Manage Daily Tasks

## Browser platform and persistence

**Decision**: Implement the app as a static browser application using HTML, CSS, JavaScript
ES modules, and `localStorage` for the task collection scoped to the current origin.

**Rationale**: The feature is for one user's task list and requires persistence across ordinary
application/browser restarts in the same browser profile. A small serialized collection fits
the browser's built-in key/value storage and avoids an account system, backend, network
dependency, and third-party packages.

**Alternatives considered**:

- IndexedDB: built in, but its asynchronous object-store and transaction model adds complexity
  not justified by this small collection.
- Remote persistence: would require a service and introduce accounts or synchronization that
  the specification excludes.
- In-memory state: does not satisfy persistence across restarts.

The app must be served from a stable web origin; `file://` storage behavior is not a
reliable persistence basis. Browser site-data clearing, private-session cleanup, eviction, or
storage restrictions may remove or prevent saved data. Storage access/write errors and
malformed stored data must be surfaced to the user rather than treated as successful saves or
silently replaced with an empty task list. Local storage is not a security boundary: do not
store sensitive information, and render task text as text rather than executable markup.

## Testing approach

**Decision**: Use Node.js built-in `node:test` and `node:assert/strict` for fast independent
task-logic and storage-adapter tests, with fake storage for isolated logic tests. Use
development-only Playwright with Chromium for automated browser acceptance tests launched by
the built-in test runner, and ESLint for the required lint gate. Write and run the acceptance
tests for each story before changing that story's production UI. Keep additional
visual/responsive checks in `quickstart.md`.

**Rationale**: The built-in test runner keeps unit tests dependency-free. Browser automation
is justified because the constitution requires each story to have an acceptance test that
mirrors its acceptance scenarios and requires tests before production code; an automated
browser test can fail against the missing behavior and then pass against the implementation.
Playwright and ESLint are development-only and add no runtime dependencies.

**Alternatives considered**:

- Manual-only browser acceptance checks: avoid a test dependency but cannot provide an
  executable failing acceptance test before implementing UI behavior.
- Using a browser automation test framework for unit tests: duplicates the fast built-in
  unit-testing capability without improving coverage of task logic.
- Skipping a linter: avoids a dev dependency but does not satisfy the constitution's explicit
  requirement that code pass linting.

## Accessibility and browser behavior

**Decision**: Treat task titles and descriptions as untrusted text; use semantic controls,
associated form labels, keyboard-operable actions, visible focus, and status text/icons in
addition to color. Meet the specification's 44-by-44-pixel targets and contrast thresholds.

**Rationale**: These constraints preserve the requested accessibility and prevent task content
from being interpreted as markup. Browser local storage is readable by scripts running at
the same origin and must not contain secrets.

**Alternatives considered**: Color-only status, unlabeled controls, or HTML interpretation of
task text are rejected because they reduce accessibility or create avoidable content-injection
risk.

## References

- [WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)
- [WHATWG Storage Standard](https://storage.spec.whatwg.org/)
- [W3C Indexed Database API](https://w3c.github.io/IndexedDB/)
- [Node.js test runner](https://nodejs.org/api/test.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [WCAG 2.2 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [WCAG 2.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
