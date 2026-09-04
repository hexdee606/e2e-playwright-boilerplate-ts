# Contributing

Thank you for contributing to the End-to-End Playwright Automation Testing Boilerplate.

## Before opening a change

1. Read [README.md](README.md), [docs/KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md), and the applicable article under `docs/memory/`.
2. Keep Gherkin and TypeScript under `src/` as the source of truth. Do not edit `out/tests`.
3. Never commit credentials, tokens, cookies, private URLs, or generated reports.
4. For a new scenario, create a plan under `specs/` and choose `@suit1`, `@suit2`, or `@suit3`.

## Development workflow

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm run test:generate-bdd
npm run test:e2e
npm audit --audit-level=high
```

Use the narrowest project while iterating:

```bash
npx playwright test --project=suit1
npx playwright test --project=suit2
npx playwright test --project=suit3
```

## Code conventions

- Use strict TypeScript and existing path aliases.
- Keep steps thin; put selectors and workflow logic in page objects.
- Use `@ApiHelper` and `@GraphQLHelper` for backend transport.
- Use secure input methods for credentials and sensitive data.
- Add or update both Markdown memory guidance and `MemoryKnowledgeBase.ts` when framework behavior changes.

## Pull requests

Explain the behavior change, files changed, validation commands, and any external-service dependency. Keep unrelated refactors out of the change. A maintainer may request tests or documentation before merging.
