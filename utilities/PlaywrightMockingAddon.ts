/**
 * Typed, Page-based Playwright route mocking for UI, REST, and GraphQL tests.
 * Mock handlers only fulfill responses and never inspect or log request bodies.
 */
import {Page, Route} from "@playwright/test";

export type MockUrl = string | RegExp | ((url: URL) => boolean);

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {[key: string]: JsonValue};

export interface JsonMockResponse<T extends JsonValue = JsonValue> {
    body: T;
    status?: number;
    headers?: Record<string, string>;
}

export interface RestMockResponse<T extends JsonValue = JsonValue> extends JsonMockResponse<T> {
    method?: string;
}

export interface GraphQLMockResponse<T extends JsonValue = JsonValue> extends JsonMockResponse<T> {
    operationName: string;
}

interface RegisteredRoute {
    url: MockUrl;
    handler: (route: Route) => Promise<void>;
}

class PlaywrightMockingAddon {
    private readonly page: Page;
    private readonly registeredRoutes: RegisteredRoute[] = [];

    constructor(page: Page) {
        this.page = page;
    }

    async mockJson<T extends JsonValue>(url: MockUrl, response: JsonMockResponse<T>): Promise<void> {
        await this.register(url, async route => this.fulfillJson(route, response));
    }

    async mockRestEndpoint<T extends JsonValue>(url: MockUrl, response: RestMockResponse<T>): Promise<void> {
        await this.register(url, async route => {
            if (response.method && route.request().method() !== response.method.toUpperCase()) {
                await route.continue();
                return;
            }
            await this.fulfillJson(route, response);
        });
    }

    async mockGraphQLOperation<T extends JsonValue>(url: MockUrl, response: GraphQLMockResponse<T>): Promise<void> {
        await this.register(url, async route => {
            const requestBody = route.request().postDataJSON() as {operationName?: string; query?: string} | null;
            const operationName = requestBody?.operationName ?? this.operationNameFromQuery(requestBody?.query);
            if (operationName !== response.operationName) {
                await route.continue();
                return;
            }
            await this.fulfillJson(route, response);
        });
    }

    async mockGraphQLError(
        url: MockUrl,
        operationName: string,
        errors: Array<{message: string}>,
        status = 200
    ): Promise<void> {
        await this.mockGraphQLOperation(url, {operationName, status, body: {data: null, errors}});
    }

    async clearMocks(): Promise<void> {
        await Promise.all(this.registeredRoutes.map(({url, handler}) => this.page.unroute(url, handler)));
        this.registeredRoutes.length = 0;
    }

    private async register(url: MockUrl, handler: (route: Route) => Promise<void>): Promise<void> {
        await this.page.route(url, handler);
        this.registeredRoutes.push({url, handler});
    }

    private async fulfillJson<T extends JsonValue>(route: Route, response: JsonMockResponse<T>): Promise<void> {
        await route.fulfill({
            status: response.status ?? 200,
            contentType: "application/json",
            headers: {"access-control-allow-origin": "*", ...response.headers},
            body: JSON.stringify(response.body)
        });
    }

    private operationNameFromQuery(query?: string): string | undefined {
        return query?.match(/\b(?:query|mutation|subscription)\s+([A-Za-z_][A-Za-z0-9_]*)/)?.[1];
    }
}

export default PlaywrightMockingAddon;