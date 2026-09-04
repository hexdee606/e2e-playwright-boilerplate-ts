# Memory Article: Framework Architecture

## Identity

- **id**: `framework-architecture`
- **scope**: Playwright-BDD project layout and execution

## Context

Features live under `src/**/features`; generated tests consume matching step
definitions under `src/**/step_definitions`. `ConfigSettings` and `envConf`
provide execution paths, timeouts, reporters, and environment URLs.

## When to use

- Adding a feature or step definition
- Changing execution, reporting, or environment behavior

## Guidance

- Put workflow semantics in page objects and reusable utilities.
- Keep environment URLs out of scenarios and page objects.
- Run `npm run test:generate-bdd` before inspecting generated test output.

## Constraints

- Preserve the BDD glob configuration.
- Do not hardcode environment-specific behavior.

## Verification

Run `npm run test:generate-bdd`, then the targeted Playwright test command.
