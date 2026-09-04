# Memory Article: API Contracts

## Identity

- **id**: `api-contracts`
- **scope**: REST, GraphQL, and response validation

## Context

`ApiHelper` and `GraphQLHelper` centralize transport configuration. Operations
and models belong under `src/backend/services`; Zod contracts protect response
shape at the BDD boundary.

## When to use

- Adding REST or GraphQL coverage
- Diagnosing request parsing or contract failures

## Guidance

- Reuse environment headers and configured timeouts.
- Keep transport code in helpers and operation code in service modules.
- Validate important response shapes with a Zod contract.

## Constraints

- Surface HTTP, GraphQL, and parsing failures.
- Do not introduce silent success-shaped fallbacks.

## Verification

Run the targeted backend feature with `npm run test:e2e -- --grep <tag>`.
