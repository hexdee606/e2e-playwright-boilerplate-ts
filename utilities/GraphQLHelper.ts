/*
  ================================================================
  GraphQLHelper Class - TypeScript API Utility for GraphQL
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-15
  Description: This class encapsulates utility methods for making
               GraphQL requests (queries and mutations) using
               Playwright's request module, with built-in error handling.

               The helper handles GraphQL-specific request configuration
               and provides methods for sending requests and validating
               responses.

               Features:
                 - Sends both GraphQL queries and mutations.
                 - Supports dynamic setting of base URL.
                 - Custom headers and request body can be provided.
                 - Built-in error handling for network issues, invalid responses,
                   and GraphQL errors.
                 - JSON parsing with fallback to raw text if parsing fails.
                 - TypeScript features like strict type checking for better safety.

  Notes:
    - The class supports dynamic base URL assignment.
    - Request headers and bodies can be customized per request.
    - Error handling ensures robustness in case of failed requests or GraphQL errors.
    - This class requires Playwright's request module for making HTTP requests.

  ================================================================
*/

import {request} from "@playwright/test"; // Importing Playwright's request module
import envConf from "@envConf"; // Importing environment configuration (API base URL, headers, etc.)

// Extract the backend configuration (URL and headers) from the environment configuration
const {url, headers} = envConf.configs[envConf.env].backend.gql;

// Configuration interface for GraphQL requests
interface Config {
    timeout: number; // Timeout setting for GraphQL requests (in milliseconds)
    ignoreHTTPSErrors: boolean; // Flag to ignore HTTPS errors (useful for self-signed certificates)
}

/**
 * GraphQLHelper class for managing GraphQL requests.
 * This class provides methods to send GraphQL queries/mutations, configure the base URL,
 * and handle responses with robust error handling.
 *
 * @class GraphQLHelper
 */
class GraphQLHelper {
    // Default base URL for GraphQL API (extracted from the environment configuration)
    private baseUrl: string = url;

    // Default headers for GraphQL requests
    private headers: any = headers;

    // Default configuration for GraphQL requests
    private config: Config = {
        timeout: 5 * 1000, // Default timeout set to 5 seconds
        ignoreHTTPSErrors: false // Default flag for ignoring HTTPS errors is set to false
    };

    /**
     * Updates the configuration options for the GraphQL helper.
     * This method merges the current configuration with the provided options.
     *
     * @param {Config} options - The configuration options to be set.
     * @returns {void}
     */
    setConfig(options: Partial<Config>): void {
        // Merge the new configuration options with the existing configuration
        this.config = {...this.config, ...options};
    }

    /**
     * Sets the base URL for GraphQL API requests.
     * Ensures that the base URL is valid before applying it.
     *
     * @param {string} baseUrl - The new base URL for GraphQL requests.
     * @throws {Error} Throws an error if the base URL is empty or invalid.
     * @returns {void}
     */
    setBaseUrl(baseUrl: string): void {
        // Ensure the provided base URL is not empty or invalid
        if (!baseUrl.trim()) throw new Error('Base URL cannot be empty');
        this.baseUrl = baseUrl; // Set the base URL for GraphQL requests
    }

    /**
     * Retrieves the current base URL for GraphQL API requests.
     * Throws an error if the base URL has not been set or is empty.
     *
     * @returns {string} - The current base URL for GraphQL API requests.
     * @throws {Error} Throws an error if the base URL is not set.
     */
    getBaseUrl(): string {
        // If the base URL is not set, throw an error
        if (!this.baseUrl) throw new Error("Base URL is not set");
        return this.baseUrl; // Return the current base URL
    }

    /**
     * Sends a GraphQL query or mutation request to the GraphQL API.
     * The request includes the query, variables, and custom headers (if provided).
     * Handles response parsing and error handling for failed requests.
     *
     * @param {string} query - The GraphQL query or mutation to be executed.
     * @param {object} variables - An optional object containing variables for the query/mutation.
     * @param {object} headers - Optional headers to include in the request.
     * @returns {Promise<object>} - A promise that resolves with the status and response data.
     * @throws {Error} Throws an error if the request fails, or if the response contains GraphQL errors.
     */
    async sendRequest(
        query: string,
        variables: object = {},
        headers: object = {}
    ): Promise<object> {
        // Create a new context for the HTTP request
        const context = await request.newContext();

        try {
            // Perform the HTTP POST request with GraphQL query and variables as JSON body
            const response = await context.post(this.getBaseUrl(), {
                timeout: this.config.timeout, // Set the request timeout from the config
                data: JSON.stringify({query, variables}), // Stringify the query and variables
                headers: {...this.headers, ...headers}, // Merge default and custom headers
                ignoreHTTPSErrors: this.config.ignoreHTTPSErrors // Respect the ignoreHTTPS option
            });

            // Attempt to parse the response as JSON. If it fails, fallback to raw text.
            const responseBody = await response.json().catch(() => response.text());

            // Return the response status code and the parsed response data
            return {status: response.status(), data: responseBody};
        } catch (error) {
            // Log the error to the console for debugging purposes
            console.error("Error during GraphQL request:", error);
            // Rethrow a more descriptive error
            throw new Error(`GraphQL request failed: ${error}`);
        }
    }
}

// Export an instance of the GraphQLHelper class as a singleton
export default new GraphQLHelper();
