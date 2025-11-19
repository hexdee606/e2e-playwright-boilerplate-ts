**Project Overview**
- **Repo Type**: Playwright + TypeScript end-to-end (BDD) boilerplate using `playwright-bdd` and custom helpers.
- **Primary Areas**: `src/frontend` (UI features), `src/backend` (API/GraphQL features), `utilities` (helpers: `GraphQLHelper.ts`, `ApiHelper.ts`, `PlaywrightActions.ts`).

**How Tests Are Structured**
- **BDD-first**: Feature files live under `./src/**/features/*.feature` and are executed via `playwright-bdd` (see `playwright.config.ts` and `settings/ConfigSettings.ts`).
- **Step defs**: Step definitions are under `./src/**/step_definitions/*_steps.ts` (backend and frontend).
- **POM / stateful POMs**: `playwright-bdd` is configured with `statefulPoms: true` in `playwright.config.ts`.

**Important Files & Where to Look**
- **Test runner config**: `playwright.config.ts` — timeouts, reporters, BDD integration, and `use` context options.
- **Environment mapping**: `configs/envConf.ts` — environment keys (e.g., `int`) and service URLs for `backend.api`, `backend.gql`, and `frontend`.
- **Global settings**: `settings/ConfigSettings.ts` — `bddPaths`, `dirPaths`, `testTimeout`, `generalTimeout`, `headless`, HAR/log helpers.
- **GraphQL & REST helpers**: `utilities/GraphQLHelper.ts`, `utilities/ApiHelper.ts` — prefer these helpers for HTTP operations (use `envConf` base URLs).

**Common Commands**
- **Setup**: `npm run setup` — installs dependencies and Playwright browsers (`playwright install --with-deps`).
- **Generate BDD + Run all tests**: `npm run test:e2e` (runs `bddgen && playwright test`).
- **Run debug tests**: `npm run test:debug` (uses `--debug` and `--grep @debug`).
- **Run tagged tests**: `npm run test:smoke` (filters tests with `@smoke`).
- **Reports**: `npm run report:allure-serve`, `npm run report:monocart-serve` to view generated reports in `./out/test-results`.

**Project Conventions & Patterns (specific)**
- **Aliases**: code uses module aliases like `@envConf` and `@ConfigSettings` — resolve imports from `tsconfig.json` paths. Edit those config singletons to change runtime defaults.
- **Env selection**: runtime environment is selected by `process.env.E2E` (defaults to `'int'`) in `configs/envConf.ts`.
- **Request helpers**: Use the exported singletons `GraphQLHelper` and `ApiHelper` rather than calling Playwright `request` directly — they centralize headers, base URLs, timeouts and error handling.
- **HAR logging**: HAR files are generated via functions in `ConfigSettings.ts` (`generateHarLogFilePath`) and are enabled when `config.verbose` is true.

**Integration Points & External Dependencies**
- **Playwright Test**: `@playwright/test` and `playwright-bdd` are primary execution libraries.
- **Reporters**: `allure-playwright`, `monocart-reporter`, and `@hexdee606/playwright-logger` are configured in `playwright.config.ts`.
- **External APIs**: Default `int` environment points to `https://fakestoreapi.com/` (REST) and `https://graphqlzero.almansi.me/api` (GraphQL). Alter `configs/envConf.ts` for other endpoints.

**When editing tests or adding features**
- Add feature files to `./src/<area>/features/` and step definitions to the corresponding `step_definitions` folder. The `bddPaths` patterns in `ConfigSettings.ts` determine discovery.
- Prefer reusing `utilities` helpers for network calls to keep headers and error handling consistent.
- For browser-level actions, prefer `utilities/PlaywrightActions.ts` so actions and waits remain consistent across tests.

**Debugging Tips**
- Use `npm run test:debug` to open Playwright inspector and attach breakpoints.
- Check `out/test-results` and `out/tests` (configured via `ConfigSettings.ts`) for traces, screenshots, HARs, and report artifacts.
- If requests fail, verify `envConf.env` selection and inspect `envConf.configs[env]` for the `backend.api` / `backend.gql` `url` and `headers`.

**Environment / Engine Requirements**
- Node >= `20.19.0`, npm >= `11.2.0` (see `package.json` `engines`). Use the project's `npm run setup` on a clean machine.

**Examples (copy-paste)**
- Run the full suite: `npm run test:e2e`
- Run a smoke subset: `npm run test:smoke`
- Run single test with Playwright verbose: `bddgen && npx playwright test tests/mytest.spec.ts --project=suit1 --trace=on` (project names and grep patterns are defined in `playwright.config.ts`).

**What I could not infer (ask the owner)**
- Any CI-specific environment variables for secrets or alternative `env` values beyond `int`.
- Any preferred branching/commit message rules for automated agents.

If any section needs more detail or you'd like me to include CI/CD, contributor, or commit guidelines, tell me what you want added and I'll iterate.
