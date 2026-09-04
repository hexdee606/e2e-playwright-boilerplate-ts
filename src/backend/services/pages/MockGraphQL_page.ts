/**
 * Browser-backed service wrapper for offline GraphQL route mocking scenarios.
 */
import { Page } from "@playwright/test";
import PlaywrightMockingAddon, { JsonValue } from "@PlaywrightMockingAddon";

export interface BrowserGraphQLResponse<T extends JsonValue = JsonValue> {
    status: number;
    data: T;
}

class MockGraphQLPage {
    async mockPostQuery(page: Page): Promise<void> {
        const mocking = new PlaywrightMockingAddon(page);
        await mocking.mockGraphQLOperation("**/mock-graphql", {
            operationName: "GetMockPost",
            body: {
                data: { post: { id: "mock-1", title: "Offline GraphQL Post" } },
            },
        });
    }

    async mockPostQueryError(page: Page): Promise<void> {
        const mocking = new PlaywrightMockingAddon(page);
        await mocking.mockGraphQLError("**/mock-graphql", "GetMockPost", [
            { message: "Mock GraphQL failure" },
        ]);
    }

    async queryPost(page: Page): Promise<BrowserGraphQLResponse> {
        return await this.send(page, "query GetMockPost { post { id title } }");
    }

    private async send(
        page: Page,
        query: string,
    ): Promise<BrowserGraphQLResponse> {
        return await page.evaluate(async (requestQuery) => {
            const response = await fetch("https://mock.test/mock-graphql", {
                method: "POST",
                headers: { "content-type": "text/plain" },
                body: JSON.stringify({
                    operationName: "GetMockPost",
                    query: requestQuery,
                }),
            });
            return { status: response.status, data: await response.json() };
        }, query);
    }
}

export default new MockGraphQLPage();
