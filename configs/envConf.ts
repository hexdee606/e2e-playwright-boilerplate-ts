/*
  ================================================================
  Environment Configuration for API and Frontend
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-15
  Description: This file contains the configuration for both
               backend and frontend services, including URLs
               and headers for API requests.

               The environment configuration (envConf) dynamically
               handles multiple environments (e.g., 'int', 'prod')
               and loads the correct API and frontend URLs based
               on the environment.

  ================================================================
*/

interface Backend {
    api: {
        url: string;  // The base URL for REST API requests
        headers: any; // Default headers for API requests (e.g., Content-Type, Accept)
    };
    gql: {
        url: string;  // The base URL for GraphQL API requests
        headers: any; // Default headers for GraphQL requests (e.g., Content-Type, Accept)
    };
}

interface Config {
    frontend: {
        url: string; // The URL for the frontend application
    };
    backend: Backend; // Backend configuration that includes both REST and GraphQL API details
}

interface EnvConf {
    env: string; // The current environment (e.g., 'int', 'prod')
    configs: {
        [key: string]: Config; // A dictionary that maps environment names (e.g., 'int') to their respective configurations
    };
}

/**
 * Defining the environment configuration with the correct types.
 * The configuration is based on the environment variables or defaults.
 *
 * - `env`: Specifies the current environment (e.g., 'int', 'prod')
 * - `configs`: Contains configuration details for each environment (e.g., 'int', 'prod')
 */
const envConf: EnvConf = {
    // Current environment: The environment is set to 'int' if E2E is not provided
    env: process.env.E2E || 'int',  // Default to 'int' if process.env.E2E is undefined or falsy

    configs: {
        // Configuration for 'int' (integration/testing) environment
        'int': {
            frontend: {
                // The URL for the frontend application in the 'int' environment
                url: 'https://letcode.in'  // Frontend URL for 'int' environment
            },
            backend: {
                // Configuration for backend services (API and GraphQL) in the 'int' environment
                api: {
                    // The base URL for REST API in the 'int' environment
                    url: 'https://fakestoreapi.com/', // URL for the REST API in 'int' environment

                    // Headers to be used with REST API requests
                    headers: {
                        'Content-Type': 'application/json', // Ensures the request body is in JSON format
                        'Accept': 'application/json', // Ensures the server responds with JSON format
                    }
                },
                gql: {
                    // The base URL for GraphQL API in the 'int' environment
                    url: 'https://graphqlzero.almansi.me/api', // URL for the GraphQL API in 'int' environment

                    // Headers to be used with GraphQL API requests
                    headers: {
                        'Content-Type': 'application/json', // Ensures the request body is in JSON format
                        'Accept': 'application/json', // Ensures the server responds with JSON format
                    }
                }
            }
        },

        // You can add more environments here (e.g., 'prod', 'dev')
        // Example:
        /*
        'prod': {
            frontend: {
                url: 'https://yourfrontend.com'
            },
            backend: {
                api: {
                    url: 'https://yourprodapi.com/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                },
                gql: {
                    url: 'https://yourgraphqlapi.com/api',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            }
        }
        */
    }
};

export default envConf;
