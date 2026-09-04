/*
  ================================================================
  BDD Step Definitions - Selenium Playground Workflow
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description: Step definitions using Playwright and playwright-bdd for automating
               common interactions on the Selenium Playground UI. These steps include
               navigation, date selection, iframe interaction, and validation.

  Dependencies:
    - PlaywrightActions: Utility class for interacting with Playwright elements.
    - PocUiPage: Page Object class encapsulating Selenium Playground UI operations.
    - playwright-bdd: BDD support for Playwright tests.

  ================================================================
*/

import {createBdd} from "playwright-bdd";
import playwrightActions from "@PlaywrightActions";
import pocUiPage from "../pages/poc_ui_page";

const {Given, When, Then} = createBdd();

/**
 * Navigates to the Selenium Playground homepage.
 *
 * @param page - Playwright Page instance injected by the test context.
 */
Given(/^the user navigates to the Selenium Playground website$/, async function ({page}) {
    await page.goto('', {waitUntil: "domcontentloaded", timeout: 60000});
    await playwrightActions.setPage(page);
});

/**
 * Selects a UI option by visible text from the navigation list.
 *
 * @param option - Visible text of the navigation item to click.
 */
When(/^the user selects the "([^"]*)" option from the navigation list$/, async function ({}, option: string) {
    await pocUiPage.selectUiOption(option);
});

Then(/^the user should see the "([^"]*)" page heading$/, async function ({}, heading: string) {
    await pocUiPage.validatePageHeading(heading);
});

/**
 * Sets a specific date in a labeled date picker input.
 *
 * @param labelText - Label corresponding to the date input field (e.g., "from", "to").
 * @param date - Date string in a supported format (e.g., "01 Feb 2025").
 */
Then(/^the user sets the "([^"]*)" date to "([^"]*)"$/, async function ({}, labelText: string, date: string) {
    await pocUiPage.selectDate(date, labelText);
});

/**
 * Fills text inside a specific iframe text area.
 *
 * @param text - Text to enter into the iframe text editor.
 */
Then(/^the user fills the text area inside the iframe with "([^"]*)"$/, async function ({}, text: string) {
    await pocUiPage.switchFrame("iFrame1");
    await pocUiPage.enterTextInIFrameTextArea(text);
});

/**
 * Verifies that the iframe text area contains the previously entered text.
 */
Then(/^the user validates that the entered text matches the expected value$/, async function ({}) {
    await pocUiPage.verifyTextInIFrameTextArea();
});

/**
 * Clicks the "Playwright Automation" link or button inside the iframe.
 */
When(/^the user clicks the Playwright Automation button in the web automation section inside the iframe$/, async function ({}) {
    await pocUiPage.switchFrame("iFrame2");
    await pocUiPage.navigateToPlaywrightTesting();
});

/**
 * Validates successful navigation to the Playwright Automation page.
 */
When(/^the user validates that they have successfully navigated to the Playwright Automation page$/, async function ({}) {
    await pocUiPage.validateUserNavigatedToPlaywrightTesting();
});
