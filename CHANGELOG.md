# Changelog – End-to-End Playwright Automation Testing Boilerplate

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Added a local framework knowledge base with scaffold-standard memory articles.
- Added deterministic DNA/RNA memory retrieval for AI agents through
  `utilities/MemoryKnowledgeBase.ts`.

## [0.1.0] - 2026-09-04

### Added

- Deterministic mocked login scenarios for secure credential entry, server failures, and transient failure recovery.
- Mocked UI component coverage for select, checkbox, dialog, and assertion handling.
- REST Fake Store product coverage with a Zod response contract.
- GraphQL post response contract coverage.
- Typed Page-based UI, REST, and GraphQL route mocking with offline success and failure coverage.
- Open-source release documentation, security guidance, and AI-readable `llms.txt` metadata.

### Changed

- Updated UI selectors and assertions for current Selenium Playground behavior.
- Added secure sensitive-input APIs and kept secret values out of scenario data and failure messages.
- Updated project version to `0.1.0` in `package.json` and `package-lock.json`.

## [0.0.6] – 2025-05-20

| **Build**         | **Status** | **Date**    | **Commit**                                    |
| ----------------- | ---------- | ----------- | --------------------------------------------- |
| P20052025P133000R | Alpha      | 20 May 2025 | UI POC refactor, extended config, and cleanup |

### Added

- **New Dependency**: Added `zod` package in `package.json`.
- **New Test Suite**: `suit3` added in `playwright.config.ts` with `@suit3` tag and dedicated output directory.

### Removed

- Deleted placeholder `.gitkeep` files from:
    - `src/backend/common/contracts/`
    - `src/backend/services/features/`
    - `src/backend/services/pages/`
    - `src/backend/services/step_definitions/`

### Changed

- **package.json**:
    - Version bump from `0.0.5` to `0.0.6`
    - Added new dependency: `zod`

- **playwright.config.ts**:
    - Added new suite configuration: `suit3`

- **ConfigSettings.ts**:
    - Set `headless` mode to `true` (was previously `false`)

- **poc_ui.feature**:
    - Improved scenario documentation and formatting
    - Added structured descriptions and tags

- **poc_ui_page.ts**:
    - Enhanced inline documentation for all major methods
    - Cleaned up unnecessary comments and improved readability
    - Updated heading check text to `"Getting Started"`

- **poc_ui_steps.ts**:
    - Added inline documentation to all BDD steps

- **tsconfig.json**:
    - Updated version to `0.0.3`
    - Included `playwright.config.ts` in compilation scope

---

## [0.0.5] – 2025-05-20

| **Build**         | **Status** | **Date**    | **Commit**                                  |
| ----------------- | ---------- | ----------- | ------------------------------------------- |
| P20052025P125500R | Alpha      | 20 May 2025 | Enhanced test framework, reporting, and POC |

### Added

- **Feature File**: `poc_ui.feature` – handles advanced UI interactions like date picker and iframe navigation
- **Step Definitions**: `poc_ui_steps.ts` for mapped BDD execution
- **Reporters in `playwright.config.ts`**:
    - `allure-playwright`: rich metadata (OS, architecture, Node version)
    - `monocart-reporter`: cleanup and output management
    - `@hexdee606/playwright-logger`: structured logging with verbosity and timezone
- **New Paths in `ConfigSettings.ts`**:
    - `allureDir`
    - `monocartDir`
- **PlaywrightActions.ts**: added utility methods for error handling and navigation

### Removed

- **Obsolete Assets**:
    - `01-test.feature`
    - `01-test_steps.ts`
- **Deleted `.gitkeep`**:
    - `pages/`
    - `step_definitions/`

### Changed

- **package.json**: Updated dependencies:
    - `@types/node` → `^22.15.19`
    - `allure-commandline` → `^2.34.0`
    - `allure-playwright` → `^3.2.2`
    - `monocart-reporter` → `^2.9.19`
    - `@hexdee606/playwright-logger` → `^0.0.4`
- **envConf.ts**: Updated frontend URL for `int` environment
- **ConfigSettings.ts**:
    - `verbose` logging default set to `false`
    - `navigationTimeout` increased from 5000 → 10000ms
    - `slowMo` set to `10`ms
- **PlaywrightActions.ts**: improved wait and navigation behavior

---

## [0.0.4] – 2025-03-17

| **Build**         | **Status** | **Date**               | **Commit**                                                         |
| ----------------- | ---------- | ---------------------- | ------------------------------------------------------------------ |
| P17032025A121000R | Alpha      | 17 March 2025 12:10 AM | Added utility functions for element interaction and error handling |

### Added

- Utility functions for DOM interactions like:
    - `waitAndGetInnerHTML`, `isChecked`, `waitAndUploadFile`, and more

### Changed

- Enhanced error messages in utilities for clearer debugging

---

## [0.0.3] – 2025-03-16

| **Build**         | **Status** | **Date**               | **Commit**                              |
| ----------------- | ---------- | ---------------------- | --------------------------------------- |
| P16032025P035000R | Alpha      | 16 March 2025 01:00 PM | Updated configuration files and imports |

### Changed

- **package.json**: Removed deprecated `exports` and `jest`
- **playwright.config.ts**: Now uses dynamic frontend URL from config
- **ConfigSettings.ts**: Fixed console log color logic
- **tsconfig.json**:
    - Version `0.0.2`
    - Added path aliases (`@envConf`, `@ApiHelper`, `@PlaywrightActions`)
    - Updated `include` to add configs, src, and utilities

### Removed

- `.gitkeep` file from `configs/`

### Fixed

- `01-test_steps.ts`: Removed hardcoded Google URL

---

## [0.0.2] – 2025-03-15

| **Build**         | **Status** | **Date**               | **Commit**                   |
| ----------------- | ---------- | ---------------------- | ---------------------------- |
| P15032025A124000R | Alpha      | 15 March 2025 12:40 AM | Customized Playwright config |

### Renamed

- `changelog.md` → `CHANGELOG.md`
- `readme.md` → `README.md`

### Deleted

- `.gitkeep` from `settings/`

### Added

- New project structure:
    - `settings/`
    - `src/frontend/features/01-test.feature`
    - `src/frontend/step_definitions/01-test_steps.ts`
- `tsconfig.json` for TypeScript setup

---

## [0.0.1] – 2025-03-14

| **Build**         | **Status** | **Date**               | **Commit**                                                |
| ----------------- | ---------- | ---------------------- | --------------------------------------------------------- |
| P14032025P040000R | Alpha      | 14 March 2025 04:00 PM | Initial commit with Playwright framework structure design |

### Added

- `README.md`: Setup instructions
- `playwright.config.ts`: Base configuration
- `package.json`: Project dependencies
- Project folder and file structure
