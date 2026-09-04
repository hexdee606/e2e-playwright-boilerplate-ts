/*
  ================================================================
  Playwright Configuration (`playwright.config.ts`)
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-14
  Description: This configuration file sets up Playwright for end-to-end
               testing with behavior-driven development (BDD) integration.
               It includes settings for test directories, timeouts, retries,
               reporting, logging, and parallel test execution.

  Notes:
    - The 'timeout' is set globally for all tests.
    - Retry count is set to 0 (no retries) for failed tests.
    - Video and screenshot capture options are enabled for better debugging.
    - Headless mode is configurable through the 'headless' setting.
    - Custom configurations for BDD are also integrated.
    - Parallel execution is enabled to speed up the tests.

  ================================================================
*/

import { defineConfig } from "@playwright/test"; // Import Playwright test configuration function
import { defineBddConfig } from "playwright-bdd"; // Import BDD configuration function for behavior-driven testing
import { platform, arch } from "node:os";
import config from "@ConfigSettings"; // Import project-specific configuration settings
import envConf from "@envConf";
import { installConsoleRedaction } from "@SecureDiagnostics";

installConsoleRedaction();

/**
 * BDD Configuration for Playwright-BDD Integration.
 * This includes paths to feature files, step definitions, and other BDD settings.
 */
defineBddConfig({
    features: config.bddPaths.feature, // Path to the BDD feature files
    steps: config.bddPaths.steps, // Path to the step definition files
    importTestFrom: {
        file: "./utilities/TestFixtures.ts",
        varName: "test",
    },
    disableWarnings: {
        importTestFrom: true,
    },
    statefulPoms: true, // Enables the use of stateful Page Object Models (POM)
    outputDir: config.dirPaths.testDir, // Directory where test results will be stored
    verbose: config.verbose, // Enable verbose logging if set to true
    aiFix: {
        promptAttachment: config.captureSensitiveArtifacts,
    },
});

/**
 * Playwright Test Configuration.
 * This includes general settings like timeout, retries, workers, and paths for tests and output.
 */
export default defineConfig({
    /**
     * Directories for test files and output.
     * Defines where Playwright will look for test files and where to store the results.
     */
    testDir: config.dirPaths.testDir, // Directory path for test files
    outputDir: config.dirPaths.outputDir, // Directory path to store test artifacts (logs, screenshots, reports)
    tsconfig: "tsconfig.json", // Path to the TypeScript configuration file

    /**
     * Timeout and retry settings for tests.
     * Defines how long to wait before timing out a test and the retry behavior.
     */
    timeout: config.generalTimeout, // Global test timeout (max test duration)
    retries: 0, // Number of retries for failed tests (set to 0 for no retries)
    workers: 4, // Number of parallel workers to run tests concurrently
    fullyParallel: true, // Enable full parallel test execution

    /**
     * Snapshot and reporting settings.
     * Defines how snapshots and test reports are handled.
     */
    updateSnapshots: "missing", // Only update snapshots if they're missing or outdated
    reportSlowTests: null, // Set a threshold to report slow tests (can be a number of milliseconds)
    reporter: [
        [
            "allure-playwright",
            {
                // Allure reporter settings
                details: config.captureSensitiveArtifacts, // Detailed steps can include action metadata
                suiteTitle: true, // Enable suite title in reports
                resultsDir: config.dirPaths.allureDir, // Directory for Allure results
                outputFolder: config.dirPaths.allureDir, // Output folder for Allure reports
                environmentInfo: {
                    Framework: "Playwright", // Framework used for testing
                    OS: platform(), // Operating system of the test execution environment
                    Architecture: arch(), // Architecture of the test execution environment
                    Node_Version: process.version, // Node.js version being used
                },
            },
        ],
        [
            "monocart-reporter",
            {
                name: "Playwright",
                clean: true,
                outputFile: config.dirPaths.monocartDir,
            },
        ],
        [
            "@hexdee606/playwright-logger",
            {
                verbosity: config.verbose ? 2 : 0, // 0 | 1 | 2; diagnostics are opt-in
                timezone: "Asia/Kolkata",
                printErrorsImmediate: config.verbose,
            },
        ],
    ],

    /**
     * Expectation timeout settings.
     * Defines the timeout for each assertion in tests.
     */
    expect: {
        timeout: config.testTimeout, // Timeout for each individual expectation
    },

    /**
     * Logging settings.
     * Controls the verbosity of the output (e.g., quiet mode vs. detailed logging).
     */
    quiet: !config.verbose, // If 'true', suppress verbose logs; otherwise, show detailed logs

    use: {
        browserName: "chromium", // The browser to use for the tests
        defaultBrowserType: "chromium", // The default browser type to use
        headless: config.headless, // Run tests in headless mode (true or false)
        trace: config.captureSensitiveArtifacts
            ? "retain-on-first-failure"
            : "off",
        video: config.captureSensitiveArtifacts ? "retain-on-failure" : "off",
        screenshot: config.captureSensitiveArtifacts
            ? "on-first-failure"
            : "off",
        baseURL: envConf.configs[envConf.env].frontend.url, // Base URL for the tests
        acceptDownloads: true, // Allow file downloads during tests
        navigationTimeout: config.navigationTimeout, // Timeout for navigation actions

        // Configure viewport based on headless mode
        viewport: config.headless ? { width: 1280, height: 720 } : null,

        // Configure context options such as HAR logging
        contextOptions: {
            recordHar: config.captureSensitiveArtifacts
                ? {
                      path: config.generateHarLogFilePath("test"), // Path to store the HAR (HTTP Archive) logs
                      mode: "minimal", // Specifies the level of data to capture: 'minimal' or 'full'
                  }
                : undefined,
            // feature deprecated
            // logger: {
            //     isEnabled: (name: string, severity: string): boolean => ['verbose', 'info', 'warning', 'error'].includes(severity),
            //     log: (name: string, severity: string, message: string, args: any[]): void => {
            //         config.consoleLogs(name, severity, message, args);
            //     }
            // },  // Use centralized logger function
        },

        launchOptions: {
            // Additional launch options
            args: [
                "--start-maximized",
                "--disable-infobars",
                "--disable-popup-blocking",
                "--disable-extensions",
                "--incognito",
                "--enable-automation",
                "--disable-gpu",
                ...(config.allowUnsafeChromium
                    ? [
                          "--no-sandbox",
                          "--disable-dev-shm-usage",
                          "--allow-file-access-from-files",
                      ]
                    : []),
                ...(config.verbose ? ["--enable-logging", "--v=1"] : []),
            ],
            chromiumSandbox: !config.allowUnsafeChromium,
            downloadsPath: config.downloadPath, // Path to store downloaded files
            slowMo: config.slowMo, // Delay between actions for debugging
        },
    },

    /**
     * Project configuration (used for running tests across different browsers or environments).
     * This allows the configuration to be customized for different projects or setups.
     */
    projects: [
        {
            name: "suit1", // Name of the test suite
            grep: /@suit1/, // Filter tests based on the @suit1 tag
            outputDir: `${config.dirPaths.outputDir}/suit1/`, // Directory to store results for this suite
            fullyParallel: false, // Do not run tests in this suite fully in parallel
        },
        {
            name: "suit2", // Name of the test suite
            grep: /@suit2/, // Filter tests based on the @suit2 tag
            outputDir: `${config.dirPaths.outputDir}/suit2/`, // Directory to store results for this suite
            fullyParallel: false, // Do not run tests in this suite fully in parallel
        },
        {
            name: "suit3", // Name of the test suite
            grep: /@suit3/, // Filter tests based on the @suit3 tag
            outputDir: `${config.dirPaths.outputDir}/suit3/`, // Directory to store results for this suite
            fullyParallel: false, // Do not run tests in this suite fully in parallel
        },
    ],
});
