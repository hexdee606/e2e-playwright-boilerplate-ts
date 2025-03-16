/*
  ================================================================
  Configuration Settings (`ConfigSettings.ts`)
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-14
  Description: This configuration file contains the settings for
               managing paths, timeouts, and other parameters used
               in test execution. It defines the directory paths for
               feature and step files, as well as for test results.
               It also manages global settings like timeouts, headless
               mode, and verbose logging.

  Notes:
    - `verbose`: Flag to enable or disable verbose logging.
    - `bddPaths`: Holds paths to BDD feature and step definition files.
    - `dirPaths`: Holds paths to directories for test files and results.
    - `testTimeout`: The timeout for individual assertions.
    - `generalTimeout`: The general timeout for the entire test execution.
    - `headless`: Whether the browser should run in headless mode.
    - `generateHarLogFilePath`: Dynamically generates a HAR log file name with timestamp.

  ================================================================
*/

import path from 'path';
import chalk, {Chalk} from "chalk"

/**
 * Interface to define BDD feature and step file paths.
 */
interface BddPaths {
    feature: string[]; // Paths to the BDD feature files
    steps: string[];   // Paths to the BDD step definition files
}

/**
 * Interface to define the directory paths for test results and other related files.
 */
interface DirPaths {
    testDir: string;  // Path to the directory for test files
    outputDir: string; // Path to the directory for storing test results
}

/**
 * Configuration settings class to manage the paths and timeout for test execution.
 * It holds settings for BDD feature files, step definition files, and directories for test results.
 */
class ConfigSettings {
    public verbose: boolean;           // Flag to enable or disable verbose logging
    public bddPaths: BddPaths;         // Object holding paths for BDD feature and step files
    public dirPaths: DirPaths;         // Object holding paths for test and result directories
    public testTimeout: number;        // Timeout for assertions (in milliseconds)
    public generalTimeout: number;     // General timeout (in milliseconds)
    public headless: boolean;          // Flag for headless browser mode
    public navigationTimeout: number;  // Timeout for navigation actions
    public harLogs: string;            // Default static HAR log path
    public downloadPath: string;       // Path to store downloaded files
    public slowMo: number;             // Slow motion time between actions for debugging

    /**
     * Constructor to initialize configuration settings with default values.
     * The constructor sets default paths for feature and step files, as well as default directory paths.
     */
    constructor() {
        this.verbose = true; // Enable verbose logging by default

        // Default paths for BDD feature and step definition files
        this.bddPaths = {
            feature: [
                "./src/frontend/features/*.feature",  // Frontend feature files
                "./src/backend/**/features/*.feature" // Backend feature files
            ],
            steps: [
                "./src/frontend/step_definitions/*_steps.ts",  // Frontend step definition files
                "./src/backend/**/step_definitions/*_steps.ts" // Backend step definition files
            ]
        };

        // Default directory paths for test results
        this.dirPaths = {
            testDir: "./out/tests",                 // Directory for test files
            outputDir: "./out/test-results"         // Directory for saving test results
        };

        this.testTimeout = 5000;                  // Default timeout for assertions (5 seconds)
        this.generalTimeout = 5 * 60 * 1000;      // Default general timeout (5 minutes)
        this.headless = false;                    // Default headless setting (false)
        this.navigationTimeout = 5 * 1000;        // Default navigation timeout (5 seconds)
        this.harLogs = "./out/logs/harLogs/";     // Static path where all HAR logs are saved
        this.downloadPath = "./out/downloads/";   // Path to store downloaded files
        this.slowMo = 0;                          // Slow motion time between actions (0 for no delay)
    }

    /**
     * Method to generate a dynamic HAR log file name based on test name or step name.
     * This generates a log file with a timestamp in the filename for unique identification.
     * @param name - Name of the test or step.
     * @returns {string} - The full path to the HAR log file.
     */
    generateHarLogFilePath(name: string): string {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');  // Format timestamp for the filename
        // Dynamically generate the HAR log file path with the name and timestamp
        return path.join(this.harLogs, `${name}-${timestamp}.zip`);
    }


    /**
     * Logs the message to the console with a timestamp and formatted output.
     * Uses chalk to colorize the log based on severity level and prints a table for easy readability.
     * @param name - The name or identifier for the log (e.g., function name or context).
     * @param severity - The severity level of the log message (e.g., 'error', 'info', 'warning').
     * @param message - The log message content.
     * @param args - Additional arguments (e.g., objects) to be logged with the message.
     */
    consoleLogs(name: string, severity: string, message: string, args: any[]) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');  // Format timestamp for the filename

        let color;

        if (severity === 'verbose') {
            color = chalk.green;
        } else if (severity === 'info') {
            color = chalk.blue;
        } else if (severity === 'warning') {
            color = chalk.yellow;
        } else if (severity === 'error') {
            color = chalk.red;
        } else {
            color = chalk.white;
        }

        if (args.length <= 0) {
            console.info(color(`[${timestamp}]-[${name}]-[${severity}]-[${message}]`.toUpperCase()));
        } else {
            console.info(color(`[${timestamp}]-[${name}]-[${severity}]-[${message}]-[${JSON.stringify(args, null, 2)}]`));
        }
    };
}

// Export an instance of the configuration settings class as a singleton
export default new ConfigSettings();
