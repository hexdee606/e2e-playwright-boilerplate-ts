# End-to-End Playwright Automation Testing Boilerplate

An ESM TypeScript end-to-end testing framework built with Playwright, `playwright-bdd`, reusable page objects, REST/GraphQL helpers, contract validation, and diagnostic reporting.

**Current release:** `0.1.0`

The project is BDD-first: Gherkin feature files and TypeScript source under `src/` are the source of truth. `bddgen` converts those files into executable Playwright tests under `out/tests`; generated files are not hand-edited.

## Contents

- [What is included](#what-is-included)
- [Why this framework](#why-this-framework)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Commands](#commands)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Configuration](#configuration)
- [Writing tests](#writing-tests)
- [UI test flow](#ui-test-flow)
- [REST and GraphQL test flow](#rest-and-graphql-test-flow)
- [Reports and artifacts](#reports-and-artifacts)
- [Debugging and troubleshooting](#debugging-and-troubleshooting)
- [Knowledge base and Copilot agents](#knowledge-base-and-copilot-agents)
- [Development conventions](#development-conventions)
- [Enterprise readiness](#enterprise-readiness)
- [Known limitations](#known-limitations)
- [Open-source discoverability](#open-source-discoverability)

## What is included

- Playwright Test with Chromium execution.
- `playwright-bdd` for Gherkin features, step definitions, and stateful POM integration.
- TypeScript in strict mode with ESM and path aliases.
- UI page objects and shared browser actions, including iframe, download, upload, keyboard, and wait helpers.
- REST requests through `ApiHelper`.
- GraphQL queries and mutations through `GraphQLHelper`.
- Page-based typed route mocking for UI, REST, and GraphQL scenarios.
- Zod response contracts for backend validation.
- Environment-aware frontend, REST, and GraphQL configuration.
- Allure, Monocart, and console logging reporters.
- HAR, trace, video, screenshot, download, and test-result artifact support.
- A deterministic local knowledge base for maintainers and AI agents.

## Why this framework

This framework is intentionally more than a collection of Playwright specs. It
combines a readable BDD layer with a typed automation architecture, shared
transport utilities, contract validation, and a local knowledge system. That
combination gives teams a consistent path from a business scenario to an
executable test and its diagnostic artifacts.

### What makes it different

| Capability           | This framework                                                                                | Typical alternatives                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Test language        | Gherkin scenarios mapped to typed TypeScript steps                                            | Direct code-only specs or an unstructured mix of styles                    |
| Source of truth      | Features and TypeScript under `src/`; generated tests are disposable                          | Hand-maintained generated files or test code without a clear layering rule |
| UI design            | Page objects plus shared actions for waits, frames, files, and keyboard behavior              | Repeated selectors and synchronization logic inside individual tests       |
| API coverage         | First-class REST and GraphQL helpers with environment headers and configurable timeouts       | Separate ad hoc request clients or browser-only coverage                   |
| Response quality     | Zod contracts can validate important API response shapes                                      | Status-only assertions or duplicated object checks                         |
| Environment handling | One `E2E` switch and centralized frontend/API/GraphQL configuration                           | URLs and credentials scattered through test files                          |
| Failure evidence     | Trace, video, screenshot, HAR, Allure, Monocart, and logger integration                       | A single console log or a screenshot without request context               |
| Agent collaboration  | Repository-specific Planner, Generator, and Healer agents plus deterministic framework memory | Generic AI prompts that generate incompatible standalone specs             |
| Extensibility        | Strict TypeScript, ESM, aliases, and clear UI/backend ownership boundaries                    | Framework-specific conventions that are difficult to enforce across teams  |

### Why teams may choose it

1. **One workflow from requirement to evidence.** A scenario can be reviewed as
   Gherkin, implemented through typed layers, generated with `bddgen`, and
   diagnosed with the same configuration and reports.
2. **UI and API testing share one execution model.** Browser journeys,
   GraphQL operations, and REST requests can be organized into the same BDD
   suites while retaining their appropriate helpers and contracts.
3. **The architecture makes ownership visible.** Features describe behavior,
   steps translate intent, page/service objects own workflows, helpers own
   mechanics, and contracts own response shape.
4. **Failure analysis is designed in.** Retained traces, videos, screenshots,
   HAR files, structured reports, and immediate logging reduce the time between
   a failure and a useful diagnosis.
5. **The framework is friendly to both humans and coding agents.** The memory
   articles and custom agents encode local conventions, so generated changes
   are expected to follow this repository instead of generic Playwright habits.
6. **It stays portable.** It uses Playwright and TypeScript directly rather
   than requiring a hosted test platform or proprietary execution service.

### Is it objectively #1?

There is no honest universal ranking in which one test framework is #1 for
every project. The right choice depends on browser coverage, team skills, BDD
requirements, CI infrastructure, API needs, reporting, maintenance budget, and
the application under test. This repository does not claim independently
verified market leadership or benchmark superiority.

Its strongest claim is narrower and more useful: **for teams that want
Playwright's browser engine with Gherkin, strict TypeScript, UI/API coverage,
contract validation, rich failure artifacts, and repository-aware AI
assistance, this is a highly integrated starting point.**

### Tradeoffs and alternatives

- A small team may prefer plain Playwright specs because they have less ceremony.
- Teams already standardized on Java, C#, or Python may prefer the equivalent
  Playwright language binding rather than TypeScript.
- Teams needing a hosted cross-browser grid, visual testing platform, or deep
  enterprise integrations may need an external service in addition to this
  repository.
- Teams that do not use Gherkin may find the feature/step layer unnecessary.

The framework is strongest when its conventions are adopted consistently; its
additional layers are deliberate structure, not a claim that every project
needs the same amount of abstraction.

## Prerequisites

- Node.js `>=20.19.0`
- npm `>=11.2.0`
- Network access to install npm packages and Playwright browsers.
- Network access to the configured integration services when running tests:
    - Frontend: `https://www.lambdatest.com/selenium-playground`
    - REST API: `https://fakestoreapi.com/`
    - GraphQL API: `https://graphqlzero.almansi.me/api`

Check the local versions:

```bash
node --version
npm --version
```

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd e2e-playwright-boilerplate-v2
npm ci
```

Install the Playwright browser used by the configuration:

```bash
npx playwright install chromium
```

The combined setup command is:

```bash
npm run setup
```

`npm run setup` runs `npm ci` and `playwright install --with-deps`. On Windows, `npx playwright install chromium` is usually sufficient when operating system package installation is not needed.

## Quick start

Generate BDD tests and run the complete suite:

```bash
npm run test:e2e
```

The command performs two stages:

1. `bddgen` discovers feature and step files and writes generated tests to `out/tests`.
2. `playwright test` runs the generated tests with the configured reporters.

To only verify feature and step discovery:

```bash
npm run test:generate-bdd
```

## Commands

| Command                          | Purpose                                                               |
| -------------------------------- | --------------------------------------------------------------------- |
| `npm run setup`                  | Install npm packages and Playwright browsers.                         |
| `npm run test:generate-bdd`      | Generate tests from all configured feature files.                     |
| `npm run test:e2e`               | Generate BDD tests and run the full Playwright suite.                 |
| `npm run test:debug`             | Generate tests and open the `suit1` project in Playwright debug mode. |
| `npm run test:smoke`             | Generate tests and run scenarios tagged `@suit1`.                     |
| `npm run report:allure-serve`    | Generate and serve the Allure results directory.                      |
| `npm run report:allure-generate` | Build a static Allure report under `out/allure-results`.              |
| `npm run report:allure-open`     | Open the generated Allure report.                                     |
| `npm run report:monocart-serve`  | Serve the Monocart report.                                            |
| `npm run report:monocart-show`   | Open the Monocart report.                                             |

Run one configured suite:

```bash
npm run test:generate-bdd
npx playwright test --project=suit1
npx playwright test --project=suit2
npx playwright test --project=suit3
```

Run by tag:

```bash
npm run test:generate-bdd
npx playwright test --grep @suit1
npx playwright test --grep @suit2
npx playwright test --grep @suit3
```

Run one generated feature after generation:

```bash
npm run test:generate-bdd
npx playwright test out/tests/src/frontend/features/poc_ui.feature.spec.js --project=suit1
```

## Architecture

### Execution lifecycle

```text
Gherkin feature files
        |
        v
playwright-bdd (bddgen)
        |
        v
Generated Playwright tests in out/tests
        |
        v
Playwright projects and reporters
        |
        v
Reports, traces, screenshots, videos, HAR, and logs in out/
```

At runtime:

1. `ConfigSettings` supplies feature/step globs, output paths, timeouts, headless mode, downloads, and HAR settings.
2. `envConf` selects the environment from `process.env.E2E`, defaulting to `int`.
3. `defineBddConfig` discovers features and steps and enables `statefulPoms`.
4. `bddgen` writes JavaScript test files to `out/tests`.
5. Playwright runs Chromium with the configured base URL, timeouts, artifact capture, projects, and reporters.

### Layered test design

```text
Feature
  -> BDD step definition
      -> Page object or service page
          -> Shared browser action or transport helper
              -> Application or API
```

Keep each layer focused:

- **Feature**: business-readable behavior, tags, examples, and scenario intent.
- **Step definition**: translates Gherkin into a small call; avoid selectors and transport details here.
- **Page object**: owns UI selectors and workflow semantics.
- **Service page/operation**: owns reusable API operation composition.
- **Helper**: owns common Playwright browser actions or HTTP transport.
- **Contract**: owns reusable response-shape validation.

## Project structure

```text
configs/
  envConf.ts                 Environment URLs, headers, and E2E selection
settings/
  ConfigSettings.ts          BDD globs, paths, timeouts, artifacts, defaults
src/
  frontend/
    features/*.feature       UI Gherkin scenarios
    pages/*_page.ts          UI page objects
    step_definitions/*_steps.ts
  backend/
    common/contracts/        Zod response contracts
    common/data/             Shared backend data
    common/models/           Shared backend models
    services/
      features/*.feature     GraphQL/service Gherkin scenarios
      models/                Request models
      operations/            GraphQL queries and mutations
      pages/                 Service wrappers
      step_definitions/      Backend BDD steps
    servers/                 Additional backend feature area
utilities/
  ApiHelper.ts               REST transport singleton
  GraphQLHelper.ts           GraphQL transport singleton
  PlaywrightActions.ts       Shared UI actions and frame state
  PlaywrightMockingAddon.ts  Typed JSON, REST, and GraphQL route mocks
  BrowserStorageManager.ts   Cookies and web storage
  FileOperationsHelper.ts    Files, Gherkin tables, and formatting
  MemoryKnowledgeBase.ts     Deterministic agent context retrieval
docs/
  KNOWLEDGE_BASE.md          Knowledge-base rules and domains
  memory/                    Human-readable memory articles
specs/                       Test plans
out/
  tests/                     Generated BDD tests
  test-results/              Playwright and reporter output
  logs/                      HAR and other logs
  downloads/                 Downloaded files
playwright.config.ts         Playwright and playwright-bdd configuration
tsconfig.json                Strict TypeScript and alias configuration
package.json                 Dependencies and npm scripts
```

## Configuration

### Environment selection

The active environment is selected with `E2E`:

```bash
E2E=int npm run test:e2e
```

When `E2E` is omitted, the framework uses `int`. Add another environment in `configs/envConf.ts` with frontend, REST, and GraphQL settings, then select it with the same variable.

Enterprise deployments can override the default integration endpoints without
editing source files:

```bash
E2E=int \
E2E_FRONTEND_URL=https://frontend.example.test \
E2E_API_URL=https://api.example.test \
E2E_GQL_URL=https://graphql.example.test/api \
npm run test:e2e
```

An invalid `E2E` value fails immediately with the list of configured
environments instead of producing an opaque startup error.

Use the configured aliases in TypeScript:

```ts
import envConf from "@envConf";
import config from "@ConfigSettings";
import apiHelper from "@ApiHelper";
import graphQLHelper from "@GraphQLHelper";
```

Do not hardcode service URLs in features, page objects, steps, or operations.

### Runtime defaults

| Setting                       | Default                                                |
| ----------------------------- | ------------------------------------------------------ |
| Browser                       | Chromium                                               |
| Headless                      | `true`                                                 |
| Workers                       | `4`                                                    |
| Retries                       | `0`                                                    |
| General test timeout          | `5 minutes`                                            |
| Expect timeout                | `5 seconds`                                            |
| Navigation timeout            | `10 seconds`                                           |
| Slow motion                   | `10 ms`                                                |
| HAR, trace, video, screenshot | Disabled unless `E2E_CAPTURE_SENSITIVE_ARTIFACTS=true` |
| Downloads                     | `out/downloads/`                                       |

Verbose diagnostics are opt-in with `E2E_VERBOSE=true`. This controls verbose
logging and HAR capture because diagnostic artifacts can contain request data,
cookies, authorization headers, or application content.

Security-sensitive browser diagnostics are independently opt-in with
`E2E_CAPTURE_SENSITIVE_ARTIFACTS=true`. Until that flag is enabled, traces,
videos, screenshots, HAR archives, and BDD AI prompt attachments are disabled
so page fields cannot be copied into reports by default.

The browser keeps usability flags such as `--start-maximized` and
`--incognito`. The security-sensitive flags `--no-sandbox`,
`--allow-file-access-from-files`, and `--disable-dev-shm-usage` are only added
when `E2E_ALLOW_UNSAFE_CHROMIUM=true`, which should be limited to a controlled
container runtime. Chromium verbose logging flags are only enabled with
`E2E_VERBOSE=true`.

The framework logger redacts authorization, cookie, password, token, secret,
and API-key fields. Transport failures intentionally use generic messages so
credentials, request payloads, and URLs are not copied into exception reports.
No framework can guarantee that an application itself will never render a
secret in a screenshot or DOM trace, so sensitive artifact capture must remain
an explicit, access-controlled diagnostic decision.

Change framework-wide defaults in `settings/ConfigSettings.ts` and execution behavior in `playwright.config.ts`.

### Playwright projects and tags

The configuration defines three serial-per-project suites:

| Project | Tag      | Current examples                     |
| ------- | -------- | ------------------------------------ |
| `suit1` | `@suit1` | UI date-picker scenario              |
| `suit2` | `@suit2` | UI iframe scenario                   |
| `suit3` | `@suit3` | GraphQL query and mutation scenarios |

Apply the matching tag in a feature before selecting a project. Do not use an unconfigured tag and expect it to select a project.

## Writing tests

### Add a feature

Create a `.feature` file under the appropriate feature directory:

```gherkin
Feature: Product search

  @suit1
  Scenario: Search for an existing product
    Given the user navigates to the product page
    When the user searches for "phone"
    Then matching products are displayed
```

The feature must match the configured globs in `ConfigSettings.ts`.

### Add step definitions

Create or extend a matching `*_steps.ts` file and register steps with `createBdd()`:

```ts
import { createBdd } from "playwright-bdd";
import productPage from "../pages/product_page";

const { Given, When, Then } = createBdd();

When(/^the user searches for "([^"]*)"$/, async function ({}, query: string) {
    await productPage.search(query);
});
```

Keep step definitions thin. They should coordinate fixtures and call page or service methods rather than contain long selector or request implementations.

### Validate a change

```bash
npm run test:generate-bdd
npx playwright test --project=suit1
```

Generated files under `out/tests` can be inspected to diagnose mapping, but the fix belongs in the feature or TypeScript source.

## UI test flow

The current UI example is the Selenium Playground flow in `src/frontend/features/poc_ui.feature`.

The normal flow is:

1. A `Background` navigates to the frontend using Playwright's `baseURL`.
2. A step definition sets the current `Page` on the shared `PlaywrightActions` singleton.
3. The step calls `poc_ui_page.ts`.
4. The page object creates selectors and delegates interaction to `@PlaywrightActions`.
5. Frame actions explicitly switch to the required iframe before interacting.

Prefer accessible roles, labels, and stable attributes. Use the shared action methods for waits, clicks, input, selection, files, downloads, and frames. Do not add arbitrary sleeps or use `networkidle` to hide synchronization issues.

Because the current browser action object is shared, setup must establish the page and frame context deliberately for each scenario. Be careful with mutable module-level state when scenarios run in parallel.

### Secure credential and sensitive input

Use the sensitive-input methods in `@PlaywrightActions` for passwords, tokens,
one-time codes, recovery codes, account numbers, personal data, or other
critical values:

```ts
await playwrightActions.waitAndFillSensitiveInputFromEnv(
    this.passwordSelector,
    "E2E_LOGIN_PASSWORD",
);

await playwrightActions.waitAndFillSensitiveInput(
    this.otpSelector,
    oneTimeCode,
);
```

Available methods:

- `waitAndFillSensitiveInput(selector, value)` uses atomic Playwright filling.
- `waitAndFillSensitiveInputFromEnv(selector, variable)` reads a required environment variable without exposing its value.
- `waitAndTypeSensitiveInput(selector, value, delay)` is for controls that require key-by-key events; prefer atomic fill otherwise.
- `waitAndClearSensitiveInput(selector)` clears the field without reading it.

Never put real credentials in `.feature` files, TypeScript source, test names,
comments, screenshots, fixtures, or committed configuration. Supply them using
CI secret variables or a local secret manager. Do not print the environment
variable, assert its value, read a sensitive field with `inputValue()`, or attach
a page snapshot while the secret is visible.

## REST and GraphQL test flow

### REST

Use the singleton `ApiHelper` for REST requests. It obtains its default base URL and headers from `envConf` and exposes methods for GET, POST, PUT, PATCH, and DELETE.

```ts
import apiHelper from "@ApiHelper";

const response = await apiHelper.sendGetRequest("products/1");
expect(response.status).toBe(200);
```

Keep REST operations and response models in backend service modules. The current repository provides the helper, but its active backend feature example is GraphQL.

### GraphQL

Use `GraphQLHelper.sendRequest(query, variables, headers)` through a service page/wrapper. Keep reusable queries and mutations in `src/backend/services/operations`, request models in `models`, and response contracts in `src/backend/common/contracts`.

The current GraphQL flow is:

```text
poc_gql.feature
  -> poc_gql_steps.ts
      -> Poc_gql_page.ts
          -> GET_A_POST_Query.ts / CREATE_A_POST_Mutation.ts
              -> GraphQLHelper.ts
```

Assert the HTTP status and relevant response fields in the BDD steps. The helper returns `{status, data}`; it does not automatically fail every non-2xx response or GraphQL `errors` payload. Use Zod contracts for important response shapes:

```ts
await createPostResponseSchema.parse(response.data.data);
```

### Offline route mocking

Use `PlaywrightMockingAddon` when a scenario must exercise browser network
behavior without contacting a real service. It is constructed with the current
`Page` and provides `mockJson`, `mockRestEndpoint`, `mockGraphQLOperation`, and
`mockGraphQLError`. REST mocks can constrain the HTTP method; GraphQL mocks
match `operationName` (or the operation name in the query) and can return any
HTTP status or JSON error payload. Call `clearMocks()` when a page owns mocks
across multiple flows. The addon does not log request bodies, headers, or
credentials.

```ts
const mocking = new PlaywrightMockingAddon(page);
await mocking.mockRestEndpoint("**/mock-api/products/42", {
    method: "GET",
    status: 500,
    body: { message: "Mock service unavailable" },
});
```

Mock REST and GraphQL scenarios are tagged `@suit3`; existing deterministic UI
mock scenarios remain tagged `@suit1`.

## Reports and artifacts

The Playwright configuration enables:

- **Allure**: results under `out/test-results/allure-results`.
- **Monocart**: output under `out/test-results/monocart-results`.
- **Playwright logger**: verbose console diagnostics with Asia/Kolkata timezone.
- **Trace, video, screenshot, and HAR**: disabled by default; enabled with `E2E_CAPTURE_SENSITIVE_ARTIFACTS=true`.
- **Downloads**: written under `out/downloads/`.

Typical report workflow:

```bash
npm run test:e2e
npm run report:allure-serve
```

When secure artifact capture is explicitly enabled for an authorized diagnostic run, inspect the generated result directory, trace, screenshot, video, console output, and HAR before changing selectors or timeouts.

## Debugging and troubleshooting

### BDD generation finds no tests

Run:

```bash
npm run test:generate-bdd
```

Confirm that:

- The feature is under `src/frontend/features` or `src/backend/**/features`.
- The step file ends in `_steps.ts` and is under the matching step directory.
- Gherkin wording matches the step-definition regular expression.
- The feature has one of the configured suite tags when using a project.

### A project runs zero tests

Check the tag. The configured projects use only `@suit1`, `@suit2`, and `@suit3`. `@smoke` and `@debug` are referenced by the existing npm scripts but are not currently configured feature tags.

### A browser action fails

Inspect the trace and snapshot, then verify:

- `PlaywrightActions.setPage(page)` ran before shared actions.
- The expected iframe context is selected.
- The selector points to a stable, visible, enabled element.
- The page object owns the selector and uses Playwright's auto-waiting.
- The failure is not caused by stale singleton frame state.

### An API assertion fails

Log or inspect both `response.status` and `response.data`. Confirm `E2E`, the environment URL, headers, operation text, variables, and the expected response shape. Remember that helper transport errors and application-level GraphQL errors are separate concerns.

### TypeScript or alias errors occur

Run:

```bash
npx tsc --noEmit
```

Check that imports use aliases declared in `tsconfig.json` and that new files are included by the existing `include` globs.

## Knowledge base and Copilot agents

The repository includes a deterministic, local knowledge base for maintainers and AI agents:

- [docs/KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md) defines the article scaffold and retrieval rules.
- [docs/memory/](docs/memory/) contains framework, API, UI, and agent workflow articles.
- `utilities/MemoryKnowledgeBase.ts` mirrors those articles for runtime retrieval.

Retrieve focused context in TypeScript:

```ts
import memory from "@MemoryKnowledgeBase";

const context = memory.buildAgentContext("add GraphQL response validation");
```

The custom agents under `.github/agents/` follow the same boundaries:

- **Planner**: explores behavior and saves BDD-oriented plans under `specs/`.
- **Generator**: implements features, steps, page/service layers, operations, models, and contracts under `src/`.
- **Healer**: regenerates first, diagnoses generated output, repairs source, and reruns the focused suite.

Generated output under `out/` is diagnostic. Do not hand-edit it and do not hide persistent failures with `test.fixme()`.

## Development conventions

- Use TypeScript strict mode and the existing ESM style.
- Prefer the configured path aliases over long relative imports.
- Keep feature language business-readable and step definitions reusable.
- Keep selectors in page objects and shared interactions in `PlaywrightActions`.
- Reuse `ApiHelper` and `GraphQLHelper` instead of creating direct request contexts in steps.
- Validate important API response shapes with Zod contracts.
- Keep scenarios independent because Playwright is configured for parallel execution.
- Run the narrowest validation first, then the full suite when the change crosses shared framework boundaries.
- Update both a Markdown memory article and `MemoryKnowledgeBase.ts` when framework behavior changes.
- Do not commit generated `out/` artifacts unless the repository policy explicitly requires them.

## Pre-PR security checklist

Before opening a pull request:

1. Run `npm run typecheck` and `npm audit --audit-level=high`.
2. Run `npm run test:e2e` with default secure artifact settings.
3. Search the diff and workspace for passwords, tokens, API keys, cookies, private keys, and authorization headers.
4. Confirm no `.env` files, reports, traces, screenshots, videos, HAR files, or downloaded data are staged.
5. Keep real credentials in CI secret storage or a local secret manager; use the secure input APIs for sensitive fields.
6. Enable `E2E_VERBOSE`, `E2E_CAPTURE_SENSITIVE_ARTIFACTS`, or `E2E_ALLOW_UNSAFE_CHROMIUM` only for controlled diagnostics.

The framework provides redaction and secure defaults, but reviewers must still
inspect new fixtures, mock payloads, logs, and report attachments because an
application can render sensitive data into its own DOM.

## Enterprise readiness

The framework is materially more robust than the original proof-of-concept
baseline. The main limitations have been reduced as follows:

| Area             | Current status                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Installation     | Reproducible `npm ci` setup with a retained lockfile.                                                                          |
| Execution        | Correct suite tags and passing focused/full BDD runs.                                                                          |
| CI               | Typecheck, BDD generation, focused Playwright execution, caching, and bounded artifact upload are configured.                  |
| Environment      | Invalid `E2E` values fail clearly; endpoint overrides support enterprise environments.                                         |
| Browser security | Fullscreen/incognito remain available; sandbox bypass and file access require explicit opt-in.                                 |
| Secret handling  | Sensitive values have dedicated input methods, redacted logger output, generic transport errors, and secure artifact defaults. |
| API reliability  | Request contexts are disposed and GraphQL post IDs use variables rather than query interpolation.                              |
| UI resilience    | Current public date-picker/editor behavior is supported and the expanded suite passes.                                         |

Validation baseline:

```text
npm run typecheck                 passed
npm audit --audit-level=high     passed
npm run test:e2e                  17 scenarios passed
```

This means the boilerplate is a stronger enterprise-ready foundation, not a
claim of zero limitations. Large adopters should still provide controlled test
environments, secret management, retention policies, and organization-specific
security review.

## Open-source discoverability

The repository includes signals for both human and machine discovery:

- Accurate npm keywords and repository metadata in `package.json`.
- `llms.txt` with a concise architecture and usage summary for AI retrieval systems.
- A complete `LICENSE`, `NOTICE`, `CONTRIBUTING.md`, and `SECURITY.md`.
- Search-friendly documentation describing Playwright-BDD, TypeScript, UI, REST, GraphQL, contracts, security, and CI.

These files improve clarity for GitHub, npm, search crawlers, and AI tools, but
they cannot guarantee Google ranking or inclusion in a model's answers. Search
visibility also depends on a public GitHub repository, releases, backlinks,
accurate project descriptions, issue activity, documentation quality, and real
community adoption. Do not use keyword stuffing or misleading claims.

## Known limitations

- The default environment points to public integration/demo services and requires network access.
- REST helper support exists, but the committed backend feature examples currently exercise GraphQL.
- Smoke and debug commands currently target the available suite tags rather than separate `@smoke` and `@debug` taxonomies.
- Shared singleton page/action state requires deliberate setup and should be reviewed when adding parallel scenarios.
- `GraphQLHelper` and `ApiHelper` return status/data objects; scenario steps remain responsible for asserting application-level failures.
- UI action state is reset when a new page is assigned, but fully scenario-scoped page-object instances remain a roadmap item before increasing parallelism across suites.
- External public demo services are suitable for examples, not as the only enterprise CI dependency; production adopters should provide controlled environment endpoints or mocked service contracts.
- No framework can guarantee that an application will never render sensitive data in its own DOM; secure artifact capture must remain access-controlled.
- A larger unit-test suite is still needed for helpers, configuration, storage, and redaction behavior before claiming maximum assurance.

## License

This project is distributed under the Apache-2.0 license. See the repository license file or package metadata for details.
