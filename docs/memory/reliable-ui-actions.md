# Memory Article: Reliable UI Actions

## Identity

- **id**: `reliable-ui-actions`
- **scope**: Playwright page objects, frames, and synchronization

## Context

`PlaywrightActions` owns page and frame context. Page objects own selectors and
workflow semantics, while BDD steps describe behavior.

## When to use

- Adding UI interactions
- Working with iframes, waits, downloads, or uploads

## Guidance

- Set the page before using shared actions.
- Switch frame context explicitly.
- Prefer accessible and stable locators over brittle CSS.

## Constraints

- Do not use arbitrary sleeps to mask synchronization problems.
- Preserve contextual errors and rethrow failures.

## Verification

Run the targeted UI feature and confirm the generated report contains the
expected step and assertion results.
