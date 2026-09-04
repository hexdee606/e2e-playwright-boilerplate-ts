# Memory Article: Framework Architecture

## Identity

- **id**: `framework-architecture`
- **scope**: Playwright-BDD project layout and execution

## Context

Features live under `src/**/features`; generated tests consume matching step
definitions under `src/**/step_definitions`. `defineBddConfig` writes generated
tests to `out/tests`, and Playwright executes that generated directory. `ConfigSettings`
and `envConf` provide execution paths, timeouts, reporters, and environment URLs.

## When to use

- Adding a feature or step definition
- Changing execution, reporting, or environment behavior

## Guidance

- Put workflow semantics in page objects and reusable utilities; keep Gherkin and steps readable.
- Keep environment URLs out of scenarios and page objects.
- Run `npm run test:generate-bdd` before inspecting generated test output.
- Use TypeScript path aliases such as `@ConfigSettings`, `@envConf`, and `@GraphQLHelper`.
- Use `@suit1`, `@suit2`, or `@suit3` to select the configured Playwright project.

## Constraints

- Preserve the BDD glob configuration.
- Do not hardcode environment-specific behavior.
- Never hand-edit files under `out/tests`; change the feature or TypeScript source and regenerate.

## Verification

Run `npm run test:generate-bdd`, then `npx playwright test --project=suit1|suit2|suit3` or a matching `--grep @suitN` command.
