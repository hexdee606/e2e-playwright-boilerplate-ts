# Changelog - End-to-End Playwright Automation Testing Boilerplate

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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