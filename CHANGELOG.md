# Changelog - End-to-End Playwright Automation Testing Boilerplate

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2025-05-20

| **Build**         | **Status** | **Date**    | **Commit**                                  |
|-------------------|------------|-------------|---------------------------------------------|
| P20052025P125500R | Alpha      | 20 May 2025 | Enhanced test framework, reporting, and POC |

### Added

* **New Feature**: `poc_ui.feature` — handles advanced UI interactions like date picker and iframe navigation.
* **New Step Definitions**: `poc_ui_steps.ts` mapped to the new feature for structured BDD support.
* **Enhanced Reporters in `playwright.config.ts`**:

    * `allure-playwright`: Added rich metadata (OS, architecture, Node version, etc.).
    * `monocart-reporter`: Configured output and cleanup.
    * `@hexdee606/playwright-logger`: Introduced structured logging with verbosity and timezone.
* **New Paths in `ConfigSettings.ts`** for:

    * `allureDir`
    * `monocartDir`
* Introduced helper methods in PlaywrightActions for better error handling and navigation control.

### Removed

* Obsolete POC assets:

    * `01-test.feature`
    * `01-test_steps.ts`
* Placeholder `.gitkeep` files in:

    * `pages/`
    * `step_definitions/`

### Changed

* **package.json**:
    * Updated dependencies:

        * `@types/node` to `^22.15.19`
        * `allure-commandline` to `^2.34.0`
        * `allure-playwright` to `^3.2.2`
        * `monocart-reporter` to `^2.9.19`
        * `@hexdee606/playwright-logger` to `^0.0.4`
    * Updated `node` and `npm` versions in `peerDependencies` and `optionalDependencies`
* **envConf.ts**: Updated `int` environment frontend URL to `https://www.lambdatest.com/selenium-playground`.
* **ConfigSettings.ts**:

    * Disabled verbose logging by default (`true` → `false`)
    * Increased `navigationTimeout` from `5000`ms → `10000`ms
    * Set `slowMo` delay to `10`ms for better debugging
* **playwright.config.ts**:

    * Reporter stack overhauled with full multi-reporter setup.
* **PlaywrightActions.ts**:

    * Rewrote navigation logic with `waitUntil: "load"` and explicit timeout.
    * Improved error messaging across utility functions.
    * Removed unused `selector` param from `goto`.

## [0.0.4] - 2025-03-17

| **Build**         | **Status** | **Date**               | **Commit**                                                         |
|-------------------|------------|------------------------|--------------------------------------------------------------------|
| P17032025A121000R | Alpha      | 17 March 2025 12:10 AM | Added utility functions for element interaction and error handling |

### Added

- **New Utility Functions** for enhanced element interaction:
    - `waitAndGetInnerHTML(selector: string): Promise<string>`
    - `waitAndGetInnerText(selector: string): Promise<string>`
    - `waitAndGetInputValue(selector: string): Promise<string>`
    - `waitAndGetAllInnerText(selector: string): Promise<string[]>`
    - `isChecked(selector: string): Promise<boolean>`
    - `isDisabled(selector: string): Promise<boolean>`
    - `isEditable(selector: string): Promise<boolean>`
    - `isEnabled(selector: string): Promise<boolean>`
    - `isHidden(selector: string): Promise<boolean>`
    - `isVisible(selector: string): Promise<boolean>`
    - `waitAndKeyboardShortcuts(selector: string, shortcut: keyboardShortcuts): Promise<void>`
    - `waitAndPressKey(selector: string, keys: string | string[]): Promise<void>`
    - `waitAndSelectOption(selector: string, option: any): Promise<void>`
    - `waitAndDownloadFile(selector: string, downloadPath: string): Promise<string>`
    - `waitAndUploadFile(selector: string, filePath: string | string[]): Promise<void>`

### Changed

- **Error Handling**: Enhanced error messages for better debugging with specific context on what failed.

## [0.0.3] - 2025-03-16

| **Build**         | **Status** | **Date**               | **Commit**                              |
|-------------------|------------|------------------------|-----------------------------------------|
| P16032025P035000R | Alpha      | 16 March 2025 01:00 PM | updated configuration files and imports |

### Changed

- **package.json**: Removed deprecated `exports` and `jest` configuration for `ConfigSettings` and updated import to
  `@ConfigSettings`.
- **playwright.config.ts**: Updated the `baseURL` for tests to use `envConf.configs[envConf.env].frontend.url` instead
  of hardcoding `https://www.google.com`.
- **settings/ConfigSettings.ts**: Fixed color logic in `consoleLogs` method for severity levels to ensure proper color
  coding for `verbose`, `info`, `warning`, and `error` logs.
- **tsconfig.json**:
    - Updated TypeScript `Version` to `0.0.2`.
    - Added new paths for environment configuration and utility functions (e.g., `@envConf`, `@ApiHelper`,
      `@PlaywrightActions`).
    - Updated `include` paths to include new directories (`configs`, `src`, `utilities`).
    - Added `outDir` and `baseUrl` for better module resolution.

### Removed

- **configs/.gitkeep**: Deleted unused file.

### Fixed

- **01-test_steps.ts**: Fixed test step (removed the placeholder `await page.goto("https://www.google.com/");`).

## [0.0.2] - 2025-03-15

| **Build**         | **Status** | **Date**               | **Commit**                   |
|-------------------|------------|------------------------|------------------------------|
| P15032025A124000R | Alpha      | 15 March 2025 12:40 AM | customised playwright config |

### Renamed

- `changelog.md` → `CHANGELOG.md`: Renamed to match proper case convention.
- `readme.md` → `README.md`: Renamed to match proper case convention.

### Deleted

- `settings/.gitkeep`: Deleted `.gitkeep` file that was used to keep an empty directory.

### Modified

- **package.json**: Updated project dependencies or configurations.
- **playwright.config.ts**: Adjusted Playwright configuration.

### Added

- `settings/`: Added a new directory for configuration or other settings.
- `src/frontend/features/01-test.feature`: New feature file for Playwright/Cucumber tests.
- `src/frontend/step_definitions/01-test_steps.ts`: New step definition file for Playwright/Cucumber tests.
- **tsconfig.json**: Added a TypeScript configuration file.

## [0.0.1] - 2025-03-14

| **Build**         | **Status** | **Date**               | **Commit**                                                |
|-------------------|------------|------------------------|-----------------------------------------------------------|
| P14032025P040000R | Alpha      | 14 March 2025 04:00 PM | initial commit with Playwright framework structure design |

### Added

- `README.md`: Project overview and setup instructions.
- `playwright.config.ts`: Configuration for Playwright testing.
- `package.json`: Dependencies and project metadata.
- Designed the folder and file structure for the framework.