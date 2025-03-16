/*
  ================================================================
  ApiHelper Class - TypeScript API Utility
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-15
  Description: This class encapsulates utility methods for making
               API requests (GET, POST, PUT, PATCH, DELETE) using
               Playwright's request module, with built-in error handling.

               The API helper handles various HTTP methods and includes
               automatic base URL normalization, request configuration,
               and response validation.
  ================================================================
*/

import {request} from "@playwright/test";
import envConf from "@envConf";

// Enum for HTTP methods (GET, POST, PUT, PATCH, DELETE)
enum Methods {
    GET = "GET",    // HTTP GET method
    POST = "POST",  // HTTP POST method
    PUT = "PUT",    // HTTP PUT method
    PATCH = "PATCH",// HTTP PATCH method
    DELETE = "DELETE" // HTTP DELETE method
}

// Extracting backend configuration from environment configuration
const {url: baseUrl, headers} = envConf.configs[envConf.env].backend.api;

// Configuration interface to define timeout and ignoreHTTPS errors
interface Config {
    timeout: number; // Timeout for API requests in milliseconds
    ignoreHTTPSErrors: boolean; // Flag to ignore HTTPS errors (useful for self-signed certificates)
}

/**
 * ApiHelper class to manage and send API requests for various HTTP methods.
 * This class encapsulates methods to send GET, POST, PUT, PATCH, DELETE requests
 * with configurable options like headers, body, parameters, and error handling.
 */
class ApiHelper {
    private baseUrl = baseUrl; // Base URL for API requests
    private headers = headers; // Default headers for API requests
    private config: Config = {timeout: 5000, ignoreHTTPSErrors: false}; // Default configuration for requests

    /**
     * Update the configuration for the API helper.
     * Allows partial updates to the current configuration.
     *
     * @param {Partial<Config>} options - The configuration options to be updated.
     */
    setConfig(options: Partial<Config>): void {
        // Merging the new configuration options with the existing ones
        this.config = {...this.config, ...options};
    }

    /**
     * Set a custom base URL for the API requests.
     *
     * @param {string} baseUrl - The base URL to be set.
     */
    setBaseUrl(baseUrl: string): void {
        this.baseUrl = baseUrl; // Assign the new base URL
    }

    /**
     * Retrieve the current base URL for API requests.
     *
     * @returns {string} The current base URL.
     * @throws {Error} Throws an error if the base URL is not set.
     */
    getBaseUrl(): string {
        // If base URL is not set, throw an error
        if (!this.baseUrl) throw new Error("Base URL is not set.");
        return this.baseUrl; // Return the base URL
    }

    /**
     * Normalize the base URL and endpoint by ensuring that there is no trailing slash
     * in the base URL and no leading slash in the endpoint.
     *
     * @param {string} endpoint - The API endpoint to be appended to the base URL.
     * @returns {string} The normalized URL formed by combining base URL and endpoint.
     */
    private normalizeUrl(endpoint: string): string {
        // Remove trailing slash from base URL if present
        return `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
    }

    /**
     * Generic method to send a request to the API.
     * Handles various HTTP methods (GET, POST, PUT, PATCH, DELETE) based on the provided parameters.
     *
     * @param {string} endpoint - The endpoint to be hit.
     * @param {Methods} method - The HTTP method to be used (GET, POST, PUT, etc.).
     * @param {object} [body={}] - Optional body to be sent with the request (e.g., for POST, PUT).
     * @param {any} [params=null] - Optional query parameters for the request.
     * @param {object} [headers={}] - Additional headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     * @throws {Error} Throws an error if the request fails or if parsing fails.
     */
    private async sendRequest(
        endpoint: string, method: Methods, body: object = {}, params: any = null, headers: object = {}
    ): Promise<object> {
        const context = await request.newContext({}); // Create a new context for the request
        const url = this.normalizeUrl(endpoint); // Normalize the URL (base URL + endpoint)

        // Construct the request options object
        const options = {
            timeout: this.config.timeout, // Set timeout based on the configuration
            method, // Set the HTTP method (GET, POST, PUT, etc.)
            headers: {...this.headers, ...headers}, // Merge default and custom headers
            data: body && Object.keys(body).length ? JSON.stringify(body) : undefined, // Add body if provided
            params: params && Object.keys(params).length ? params : undefined, // Add query parameters if provided
            ignoreHTTPSErrors: this.config.ignoreHTTPSErrors // Configure HTTPS error handling
        };

        try {
            // Send the request to the API and get the response
            const response = await context.fetch(url, options);

            // Attempt to parse the response body as JSON
            const responseBody = await response.json().catch(() => response.text());
            return {status: response.status(), data: responseBody}; // Return status and parsed response data
        } catch (error) {
            // Catch any errors and log them
            console.error(`API request failed: ${error}`);
            throw new Error(`API request failed: ${error}`); // Rethrow the error
        }
    }

    /**
     * Send a GET request to the API.
     *
     * @param {string} endpoint - The API endpoint to be hit.
     * @param {object} [body={}] - Optional body for the GET request.
     * @param {any} [params=null] - Optional query parameters for the GET request.
     * @param {object} [headers={}] - Optional custom headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     */
    sendGetRequest(endpoint: string, body: object = {}, params: any = null, headers: object = {}): Promise<object> {
        return this.sendRequest(endpoint, Methods.GET, body, params, headers); // Call the generic sendRequest method with GET method
    }

    /**
     * Send a POST request to the API.
     *
     * @param {string} endpoint - The API endpoint to be hit.
     * @param {object} [body={}] - The body to be sent with the POST request.
     * @param {any} [params=null] - Optional query parameters for the POST request.
     * @param {object} [headers={}] - Optional custom headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     */
    sendPostRequest(endpoint: string, body: object = {}, params: any = null, headers: object = {}): Promise<object> {
        return this.sendRequest(endpoint, Methods.POST, body, params, headers); // Call the generic sendRequest method with POST method
    }

    /**
     * Send a PUT request to the API.
     *
     * @param {string} endpoint - The API endpoint to be hit.
     * @param {object} [body={}] - The body to be sent with the PUT request.
     * @param {any} [params=null] - Optional query parameters for the PUT request.
     * @param {object} [headers={}] - Optional custom headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     */
    sendPutRequest(endpoint: string, body: object = {}, params: any = null, headers: object = {}): Promise<object> {
        return this.sendRequest(endpoint, Methods.PUT, body, params, headers); // Call the generic sendRequest method with PUT method
    }

    /**
     * Send a PATCH request to the API.
     *
     * @param {string} endpoint - The API endpoint to be hit.
     * @param {object} [body={}] - The body to be sent with the PATCH request.
     * @param {any} [params=null] - Optional query parameters for the PATCH request.
     * @param {object} [headers={}] - Optional custom headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     */
    sendPatchRequest(endpoint: string, body: object = {}, params: any = null, headers: object = {}): Promise<object> {
        return this.sendRequest(endpoint, Methods.PATCH, body, params, headers); // Call the generic sendRequest method with PATCH method
    }

    /**
     * Send a DELETE request to the API.
     *
     * @param {string} endpoint - The API endpoint to be hit.
     * @param {object} [body={}] - The body to be sent with the DELETE request.
     * @param {any} [params=null] - Optional query parameters for the DELETE request.
     * @param {object} [headers={}] - Optional custom headers for the request.
     * @returns {Promise<object>} A promise that resolves to the response status and data.
     */
    sendDeleteRequest(endpoint: string, body: object = {}, params: any = null, headers: object = {}): Promise<object> {
        return this.sendRequest(endpoint, Methods.DELETE, body, params, headers); // Call the generic sendRequest method with DELETE method
    }
}

// Export a singleton instance of ApiHelper to use in other parts of the application
export default new ApiHelper();
