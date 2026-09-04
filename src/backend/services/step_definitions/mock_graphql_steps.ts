/**
 * Thin BDD steps for browser-intercepted GraphQL success and error behavior.
 */
import {createBdd} from "playwright-bdd";
import {expect} from "@playwright/test";
import MockGraphQLPage from "../pages/MockGraphQL_page";
import {mockedGraphQLErrorResponseSchema, mockedGraphQLPostResponseSchema} from "../contracts/mock_graphql_contract";

const {Given, When, Then} = createBdd();

Given(/^the mocked GraphQL post query is ready$/, async function ({page}) {
    await MockGraphQLPage.mockPostQuery(page);
});

Given(/^the mocked GraphQL post query returns an error$/, async function ({page}) {
    await MockGraphQLPage.mockPostQueryError(page);
});

When(/^I send the mocked GraphQL post query$/, async function ({page}) {
    this.response = await MockGraphQLPage.queryPost(page);
});

Then(/^the mocked GraphQL response status should be (\d+)$/, async function ({}, status: number) {
    expect(this.response.status).toBe(Number(status));
});

Then(/^the mocked GraphQL response should match its contract$/, async function ({}) {
    mockedGraphQLPostResponseSchema.parse(this.response.data);
});

Then(/^the mocked GraphQL response should contain errors$/, async function ({}) {
    mockedGraphQLErrorResponseSchema.parse(this.response.data);
});