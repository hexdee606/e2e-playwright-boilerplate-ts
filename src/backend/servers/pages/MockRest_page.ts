/**
 * Browser-backed service wrapper for offline REST route mocking scenarios.
 */
import {Page} from "@playwright/test";
import PlaywrightMockingAddon, {JsonValue} from "@PlaywrightMockingAddon";

export interface BrowserJsonResponse<T extends JsonValue = JsonValue> {
    status: number;
    data: T;
}

class MockRestPage {
    async mockProduct(page: Page, status = 200): Promise<void> {
        const mocking = new PlaywrightMockingAddon(page);
        await mocking.mockRestEndpoint("**/mock-api/products/42", {
            method: "GET",
            status,
            body: status === 200
                ? {id: 42, title: "Offline Mock Product", price: 19.99, category: "testing"}
                : {message: "Mock REST service unavailable"}
        });
    }

    async getProduct(page: Page): Promise<BrowserJsonResponse> {
        return await this.fetchJson(page, "https://mock.test/mock-api/products/42");
    }

    private async fetchJson(page: Page, url: string): Promise<BrowserJsonResponse> {
        return await page.evaluate(async requestUrl => {
            const response = await fetch(requestUrl);
            return {status: response.status, data: await response.json()};
        }, url);
    }
}

export default new MockRestPage();