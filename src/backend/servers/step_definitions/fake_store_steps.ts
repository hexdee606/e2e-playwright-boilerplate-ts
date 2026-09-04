/**
 * BDD steps for Fake Store REST status, field, and contract validation.
 * Response state is kept on the scenario world rather than module scope.
 */
import {createBdd} from "playwright-bdd";
import {expect} from "@playwright/test";
import FakeStorePage from "../pages/FakeStore_page";
import {productResponseSchema} from "../../common/contracts/product_contract";

const {When, Then} = createBdd();

When(/^I send a REST request to get product with ID "([^"]*)"$/, async function ({}, productId: string) {
    this.response = await FakeStorePage.getProductById(productId);
});

Then(/^the REST response status should be (\d+)$/, async function ({}, status: number) {
    expect(this.response).toBeDefined();
    expect(this.response.status).toBe(Number(status));
});

Then(/^the product title should not be empty$/, async function ({}) {
    const product = this.response.data;
    expect(product.title).toBeTruthy();
    expect(product.title.trim().length).toBeGreaterThan(0);
});

Then(/^the product response should match the contract$/, async function ({}) {
    productResponseSchema.parse(this.response.data);
});
