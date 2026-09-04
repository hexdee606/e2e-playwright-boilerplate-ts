/**
 * Thin BDD steps for browser-intercepted REST success and failure behavior.
 */
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import MockRestPage from "../pages/MockRest_page";
import { mockedProductResponseSchema } from "../contracts/mock_product_contract";

const { Given, When, Then } = createBdd();

Given(/^the mocked REST product endpoint is ready$/, async function ({ page }) {
    await MockRestPage.mockProduct(page);
});

Given(
    /^the mocked REST product endpoint returns a server error$/,
    async function ({ page }) {
        await MockRestPage.mockProduct(page, 500);
    },
);

When(/^I request the mocked REST product$/, async function ({ page }) {
    this.response = await MockRestPage.getProduct(page);
});

Then(
    /^the mocked REST response status should be (\d+)$/,
    async function ({}, status: number) {
        expect(this.response.status).toBe(Number(status));
    },
);

Then(
    /^the mocked REST product should match its contract$/,
    async function ({}) {
        mockedProductResponseSchema.parse(this.response.data);
    },
);

Then(
    /^the mocked REST response should contain an error message$/,
    async function ({}) {
        expect(this.response.data.message).toBeTruthy();
    },
);
