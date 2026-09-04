# Memory Article: Reliable UI Actions

## Identity

- **id**: `reliable-ui-actions`
- **scope**: Playwright page objects, frames, and synchronization

## Context

`PlaywrightActions` owns page and frame context. Page objects own selectors and
workflow semantics, while BDD steps describe behavior. The exported action and
page-object instances are singletons, so scenario setup must establish the page
and frame context deliberately.

## When to use

- Adding UI interactions
- Working with iframes, waits, downloads, or uploads

## Guidance

- Set the page before using shared actions.
- Switch frame context explicitly.
- Keep selectors and date/iframe workflow logic in the page object, not in steps.
- Prefer accessible and stable locators over brittle CSS.
- Use `waitAndFillSensitiveInput` or `waitAndFillSensitiveInputFromEnv` for passwords, tokens, OTPs, personal data, and other critical values.

## Constraints

- Do not use arbitrary sleeps to mask synchronization problems.
- Preserve contextual errors and rethrow failures.
- Do not assume frame context is reset automatically between scenarios; reset or explicitly replace it during setup when needed.
- Never put real credentials in features, source, test names, screenshots, or committed fixtures.

## Verification

Run `npm run test:generate-bdd`, then `npx playwright test --project=suit1|suit2` and confirm the generated report contains the expected step and assertion results.
