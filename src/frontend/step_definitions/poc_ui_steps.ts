import {createBdd} from "playwright-bdd";
import playwrightActions from "@PlaywrightActions";
import pocUiPage from "../pages/poc_ui_page";

const {Given, When, Then} = createBdd();

Given(/^the user navigates to the Selenium Playground website$/, async function ({page}) {
    await page.goto('', {waitUntil: "domcontentloaded", timeout: 60000});
    await playwrightActions.setPage(page);
    // await page.locator("//button[text()='dipen]").click();
});

When(/^the user selects the "([^"]*)" option from the navigation list$/, async function ({}, option: string) {
    await pocUiPage.selectUiOption(option);
});

Then(/^the user sets the "([^"]*)" date to "([^"]*)"$/, async function ({}, labelText: string, date: string) {
    await pocUiPage.selectDate(date, labelText);
});

Then(/^the user fills the text area inside the iframe with "([^"]*)"$/, async function ({}, text: string) {
    await pocUiPage.switchFrame("iFrame1");
    await pocUiPage.enterTextInIFrameTextArea(text);
});

Then(/^the user validates that the entered text matches the expected value$/, async function ({}) {
    await pocUiPage.verifyTextInIFrameTextArea();
});

When(/^the user clicks the Playwright Automation button in the web automation section inside the iframe$/, async function ({}) {
    await pocUiPage.switchFrame("iFrame2");
    await pocUiPage.navigateToPlaywrightTesting();
});

When(/^the user validates that they have successfully navigated to the Playwright Automation page$/, async function ({}) {
    await pocUiPage.validateUserNavigatedToPlaywrightTesting();
});