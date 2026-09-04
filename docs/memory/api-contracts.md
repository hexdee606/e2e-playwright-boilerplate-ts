# Memory Article: API Contracts

## Identity

- **id**: `api-contracts`
- **scope**: REST, GraphQL, and response validation

## Context

`ApiHelper` and `GraphQLHelper` centralize transport configuration. The current
backend feature demonstrates GraphQL through `src/backend/services`; `ApiHelper`
is available for REST coverage but is not itself a feature. Operations and models
belong under `src/backend/services`; Zod contracts protect response shape at the
BDD boundary.

## When to use

- Adding REST or GraphQL coverage
- Diagnosing request parsing or contract failures

## Guidance

- Reuse environment headers and configured timeouts.
- Keep transport code in helpers and operation code in service modules.
- Validate important response shapes with a Zod contract.
- Assert the returned HTTP status in the step definition.
- Inspect GraphQL response errors explicitly when a scenario requires error coverage.

## Constraints

- Helpers return `{status, data}` and do not automatically fail non-2xx or GraphQL-error payloads; steps must assert those conditions.
- Do not introduce silent success-shaped fallbacks.

## Verification

Run `npm run test:generate-bdd`, then the backend suite with `npx playwright test --project=suit3` or `--grep @suit3`.
