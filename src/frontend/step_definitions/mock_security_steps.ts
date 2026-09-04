/**
 * BDD steps for secure mocked login, server failure, and transient retry flows.
 * The steps intentionally expose status only, never credential values.
 */
import { createBdd } from "playwright-bdd";
import { expect, test } from "@TestFixtures";
import { MockLoginBehavior } from "../pages/mock_security_page";

const { Given, When, Then } = createBdd(test);

Given(
    /^a mocked login page configured for "([^"]*)"$/,
    async function ({ page, mockSecurityPage }, behavior: MockLoginBehavior) {
        await mockSecurityPage.open(page, behavior);
    },
);

When(
    /^the user enters credentials using secure input actions$/,
    async function ({ mockSecurityPage }) {
        await mockSecurityPage.enterCredentials();
    },
);

When(
    /^the user submits the mocked login form$/,
    async function ({ mockSecurityPage }) {
        await mockSecurityPage.submit();
    },
);

Then(
    /^the mocked login status should be "([^"]*)"$/,
    async function ({ page, mockSecurityPage }, expectedStatus: string) {
        await expect
            .poll(() => mockSecurityPage.status(page))
            .toBe(expectedStatus);
    },
);
