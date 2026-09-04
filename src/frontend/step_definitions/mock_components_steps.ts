/**
 * BDD steps for deterministic select, checkbox, and dialog component coverage.
 */
import { createBdd } from "playwright-bdd";
import mockComponentsPage from "../pages/mock_components_page";

const { Given, When, Then } = createBdd();

Given(/^a mocked UI component page is ready$/, async function ({ page }) {
    await mockComponentsPage.open(page);
});

When(
    /^the user selects country "([^"]*)"$/,
    async function ({}, country: string) {
        await mockComponentsPage.selectCountry(country);
    },
);

When(/^the user accepts the terms checkbox$/, async function ({}) {
    await mockComponentsPage.acceptTerms();
});

When(/^the user opens the component dialog$/, async function ({}) {
    await mockComponentsPage.openDialog();
});

Then(
    /^the mocked UI components should be handled correctly for country "([^"]*)"$/,
    async function ({ page }, country: string) {
        await mockComponentsPage.verifyComponents(page, country);
    },
);
