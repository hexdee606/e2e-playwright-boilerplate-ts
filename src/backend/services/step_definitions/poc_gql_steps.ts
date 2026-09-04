/*
  ==============================================================================
  poc_gql_steps.ts - Playwright-BDD Step Definitions for GraphQL API Testing
  ==============================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description:
    This file contains Playwright-BDD step definitions to interact with a GraphQL
    backend for performing operations like fetching a post by ID and creating a new post.
    Each step is decorated with regular expressions to match feature file steps, using
    Playwright's `expect` assertions for validation.

  Features:
    - Query a post by ID and validate response attributes such as title and user ID.
    - Create a post using GraphQL mutation, validate the response's ID and title.
    - Contract validation for `createPost` mutation response using Zod schema.
    - The steps are designed to be reusable in different scenarios within your tests.

  Notes:
    - Make sure `PocGqlPage` class is properly initialized and contains necessary GraphQL methods.
    - This test suite assumes GraphQL helper functions and response structure are defined elsewhere.

  ==============================================================================
*/

import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import PocGqlPage from "../pages/Poc_gql_page";
import { createPostResponseSchema } from "../../common/contracts/createPost_contract";
import { postResponseSchema } from "../../common/contracts/post_contract";

const { When, Then } = createBdd();

/**
 * Sends a GraphQL query to fetch a post by its ID.
 *
 * @step I send a GraphQL query to get a post with ID "<postId>"
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 * @param {string | number} postId - The ID of the post to fetch.
 */
When(
    /^I send a GraphQL query to get a post with ID "([^"]*)"$/,
    async function ({}, postId: string | number) {
        this.response = await PocGqlPage.GetAPostById(postId);
    },
);

/**
 * Asserts that the response HTTP status matches the expected status code.
 *
 * @step the response status should be <status>
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 * @param {number} status - The expected HTTP status code.
 */
Then(
    /^the response status should be (\d+)$/,
    async function ({}, status: number) {
        expect(this.response).toBeDefined();
        expect(this.response.status).toBe(Number(status));
    },
);

/**
 * Validates that the post title in the response is not empty.
 *
 * @step the post title should not be empty
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 */
Then(/^the post title should not be empty$/, async function ({}) {
    const body = await this.response.data;
    const title = body.data?.post?.title;
    expect(title, "Post title should not be empty").toBeTruthy();
    expect(title.trim().length).toBeGreaterThan(0);
});

/**
 * Verifies that the user associated with the post has a valid ID.
 *
 * @step the user of the post should have a valid ID
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 */
Then(/^the user of the post should have a valid ID$/, async function ({}) {
    const body = await this.response.data;
    const userId = body.data?.post?.user?.id;
    expect(userId, "User ID should exist").toBeTruthy();
});

When(
    /^I send a GraphQL query to get post contract data for ID "([^"]*)"$/,
    async function ({}, postId: string) {
        this.response = await PocGqlPage.GetAPostById(postId);
    },
);

Then(/^the post response should match the contract$/, async function ({}) {
    const body = await this.response.data;
    postResponseSchema.parse(body.data);
});

/**
 * Sends a GraphQL mutation to create a post with the specified title and body.
 *
 * @step I send a GraphQL mutation to create a post with title "<title>" and body "<bodyText>"
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 * @param {string} title - Title of the new post.
 * @param {string} bodyText - Body content of the new post.
 */
When(
    /^I send a GraphQL mutation to create a post with title "([^"]*)" and body "([^"]*)"$/,
    async function ({}, title: string, bodyText: string) {
        this.response = await PocGqlPage.CreateAPost(title, bodyText);
    },
);

/**
 * Validates that the newly created post has a valid ID.
 *
 * @step the created post should have a ID
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 */
Then(/^the created post should have a ID$/, async function ({}) {
    const body = await this.response.data;
    const id = body.data?.createPost?.id;
    expect(id, "Created post should have an ID").toBeTruthy();
});

/**
 * Checks that the title of the created post matches the expected value.
 *
 * @step the title should be "<expectedTitle>"
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 * @param {string} expectedTitle - The expected title of the post.
 */
Then(
    /^the title should be "([^"]*)"$/,
    async function ({}, expectedTitle: string) {
        const body = await this.response.data;
        const actualTitle = body.data?.createPost?.title;
        expect(actualTitle).toBe(expectedTitle);
    },
);

/**
 * Validates the GraphQL response structure using the Zod contract for `createPost`.
 *
 * @step the createPost response should match the contract
 * @param {} - The Playwright fixtures. Example use: {page, request, context, browserName, browserVersion, customFixture}
 */
Then(
    /^the createPost response should match the contract$/,
    async function ({}) {
        // Validate using Zod
        await createPostResponseSchema.parse(this.response.data.data);
    },
);
