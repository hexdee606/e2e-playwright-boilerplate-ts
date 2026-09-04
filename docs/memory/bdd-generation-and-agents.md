# Memory Article: BDD Generation and Agent Integration

## Identity

- **id**: `bdd-generation-and-agents`
- **scope**: Agent planning, source edits, generated tests, and validation

## Context

This repository is an ESM TypeScript Playwright project using `playwright-bdd`.
Gherkin feature files and TypeScript source are the test source of truth.
`bddgen` generates executable tests under `out/tests`; Playwright runs those
generated files with Chromium and the configured `suit1`, `suit2`, and `suit3`
projects.

## When to use

- Planning or generating a new UI, REST, or GraphQL scenario
- Debugging a BDD test failure
- Updating a custom Copilot Playwright agent

## Guidance

- Store plans in `specs/*.md` and include feature path, tag, scenario, steps, expected results, and source ownership.
- Store Gherkin under `src/**/features/*.feature` and matching step definitions under `src/**/step_definitions/*_steps.ts`.
- Put UI selectors and workflows in page objects; use `@PlaywrightActions` for shared browser operations.
- Put REST and GraphQL transport behind `@ApiHelper` and `@GraphQLHelper`; keep GraphQL operations, models, and Zod contracts in backend service/common modules.
- Select the environment through `E2E`; resolve URLs from `@envConf`.
- Run `npm run test:generate-bdd` after source changes, then run the narrowest suite or tag.
- Use generated files under `out/` for diagnosis and reports only; repair source files instead.

## Constraints

- Do not generate standalone `tests/*.spec.ts` files for a BDD scenario unless the user explicitly requests a separate non-BDD test.
- Do not hand-edit `out/tests` or hide a persistent failure with `test.fixme()`.
- Do not invent `@smoke` or `@debug` coverage: the configured projects use `@suit1`, `@suit2`, and `@suit3`.
- Keep scenarios independent and avoid module-level response state when parallel execution could cause leakage.

## Verification

Run `npm run test:generate-bdd`, then use `npx playwright test --project=suitN` or `npx playwright test --grep @suitN` for the affected suite. Use `npm run test:e2e` for full validation.