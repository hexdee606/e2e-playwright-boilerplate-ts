/*
  ================================================================
  PocUiPage Class - Playwright Automation UI Interaction Utility
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-05-20
  Description: This class provides a set of utility functions for automating interactions
               with UI components on a web page. The methods include interacting with date pickers,
               input fields, iframes, and various UI elements. It is designed to be used in a Playwright-based
               test automation framework and contains methods for selecting dates, filling text areas, and
               switching between iframe contexts.

               Features:
                 - Select UI options by text (buttons, links, etc.).
                 - Interact with date picker components.
                 - Switch to and interact with iframes.
                 - Handle dynamic elements such as text input and validation.
                 - Built-in error handling and type safety for better automation reliability.

  Notes:
    - This class utilizes Playwright's action methods, such as waitAndClick, waitAndSelectOption, and waitAndGetInnerText.
    - It supports multiple date formats and provides strict error handling for invalid formats.
    - The class assumes Playwright's API for browser automation is available.

  ================================================================
*/

import playwrightActions from "@PlaywrightActions";
import moment from "moment";
import {expect} from "@playwright/test";

/**
 * Represents a UI page with utility methods for interacting with web elements.
 * This class encapsulates common actions like selecting UI options, working with date pickers, and parsing date strings.
 */
class PocUiPage {

    /**
     * Generates an XPath selector for a given UI option text (e.g., a button or a link).
     *
     * @param option - The text of the UI option to locate.
     * @returns A string representing the XPath selector for the UI option.
     *
     * @example
     * const selector = getUiOptionXPath('Submit');
     * console.log(selector); // Output: //a[contains(text(), "Submit")]
     */
    private readonly getUiOptionXPath: (option: string) => string;

    /**
     * Generates an XPath selector for a calendar input field based on its label text.
     *
     * @param labelText - The label text associated with the calendar input field.
     * @returns A string representing the XPath selector for the calendar input field.
     *
     * @example
     * const calendarXPath = getCalendarIconXPath('Start Date');
     * console.log(calendarXPath); // Output: //input[@id='Start Date']
     */
    private readonly getCalendarIconXPath: (labelText: string) => string;

    /**
     * XPath selector for the month dropdown in the date picker.
     */
    private readonly getDatePickerMonthXPath: string;

    /**
     * XPath selector for the year display element in the calendar.
     */
    private readonly getActualCalenderDateYearXPath: string;

    /**
     * XPath selector for the input text box in the UI.
     */
    private readonly getInputTextBoxXPath: string;

    /**
     * Generates an XPath selector for an iframe based on the provided iframe ID.
     *
     * @param iFrameId - The ID of the iframe to be located.
     * @returns A string representing the XPath selector for the iframe.
     */
    private readonly getIFrameXPath: (iFrameId: string) => string;

    /**
     * Stores the text that has been filled into an input text box.
     */
    private filledInputText: string;

    /**
     * XPath selector for the Playwright Testing link or button.
     */
    private readonly getPlaywrightTestingXPath: string;

    /**
     * XPath selector for the page heading element.
     */
    private readonly getPageHeadingXPath: string;

    constructor() {
        this.getUiOptionXPath = (option: string): string => `//a[contains(text(), "${option}")]`;
        this.getCalendarIconXPath = (labelText: string): string => `//input[@id='${labelText}']`;
        this.getDatePickerMonthXPath = "//select[@class='ui-datepicker-month']";
        this.getActualCalenderDateYearXPath = `//span[@class='ui-datepicker-year']`;
        this.getIFrameXPath = (iFrameId: string) => `//iframe[@id="${iFrameId}"]`;
        this.getInputTextBoxXPath = `//div[@class='rsw-ce']`;
        this.filledInputText = "";
        this.getPlaywrightTestingXPath = `//a/p[text()="Playwright Testing"]`;
        this.getPageHeadingXPath = `//div[contains(@class, "theme-doc-markdown")]//h1`;
    }

    /**
     * Selects a specific UI option (e.g., a button or link) by its text.
     *
     * @param option - The text of the UI option to select (e.g., 'Submit' or 'Cancel').
     * @returns {Promise<void>} Resolves once the option has been clicked.
     */
    async selectUiOption(option: string): Promise<void> {
        const optionXPath = this.getUiOptionXPath(option);
        await playwrightActions.waitAndClick(optionXPath);
    }

    /**
     * Parses a given date string into day, month (both as number and text), and year components.
     *
     * @param inputDate - The date string to be parsed. Supports multiple formats like 'DD MMM YYYY', 'DD/MM/YYYY', etc.
     * @returns An object containing:
     *          - day: The numeric day of the month.
     *          - month: The abbreviated textual representation of the month (e.g., 'Mar' for March).
     *          - year: The year (e.g., 2025).
     * @throws {Error} Throws an error if the input date format is invalid, specifying the supported formats.
     */
    private async getDateParts(inputDate: string): Promise<{
        day: number;
        month: string;
        year: number;
    }> {
        const formats = [
            'DD MMM YYYY',
            'MMM DD YYYY',
            'DD/MM/YYYY',
            'DD MMMM YYYY',
            'DD MM YY',
            'YYYY-MM-DD',
            'YYYYMMDD'
        ];

        for (const format of formats) {
            const date = moment(inputDate, format, true);
            if (date.isValid()) {
                return {
                    day: date.date(),
                    month: date.format('MMM'),
                    year: date.year()
                };
            }
        }

        throw new Error(`Invalid date format: '${inputDate}'. Supported formats are: ${formats.join(', ')}`);
    }

    /**
     * Navigates the calendar UI to the specified year.
     *
     * @param expectedYear - The year that the calendar should navigate to.
     * @param allowFutureDate - Optional flag to allow future dates (default: false).
     * @throws {Error} Throws an error if trying to navigate to a future year when not allowed.
     */
    private async navigateToCalenderYear(expectedYear: string, allowFutureDate: boolean = false): Promise<void> {
        if (!allowFutureDate) {
            const currentYear = moment().year();
            if (Number(currentYear) < Number(expectedYear)) {
                throw new Error("You are trying to select a future date");
            }
        }

        let actualCalenderYear: string = await playwrightActions.waitAndGetInnerText(this.getActualCalenderDateYearXPath);
        const diff: number = Number(expectedYear) - Number(actualCalenderYear);

        if (diff !== 0) {
            const nextButtonXPath = `//a[@title="Next"]`;
            const prevButtonXPath = `//a[@title="Prev"]`;

            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    await playwrightActions.waitAndSelectOption(this.getDatePickerMonthXPath, "Dec");
                    await playwrightActions.waitAndClick(nextButtonXPath);
                }
            } else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff); i++) {
                    await playwrightActions.waitAndSelectOption(this.getDatePickerMonthXPath, "Jan");
                    await playwrightActions.waitAndClick(prevButtonXPath);
                }
            }
        }
    }

    /**
     * Selects a date from a date picker input on the UI by interacting with the calendar widget.
     *
     * @param date - The date to select. The date should be in a string format supported by the getDateParts method.
     * @param labelText - The label of the date picker input field that needs to be clicked to open the calendar.
     * @returns {Promise<void>} Resolves once the date has been successfully selected in the calendar widget.
     */
    async selectDate(date: string, labelText: string): Promise<void> {
        const {day, month, year} = await this.getDateParts(date);
        await playwrightActions.waitAndClick(this.getCalendarIconXPath(labelText));
        await this.navigateToCalenderYear(year.toString());
        await playwrightActions.waitAndSelectOption(this.getDatePickerMonthXPath, month);
        await playwrightActions.waitAndClick(`//a[text()="${day}"]`);
    }

    /**
     * Switches the context to a specific iframe by its ID.
     *
     * @param frameId - The ID of the iframe to switch to.
     * @returns {Promise<void>} Resolves once the context is switched to the iframe.
     */
    async switchFrame(frameId: string): Promise<void> {
        await playwrightActions.setFrameLocator(this.getIFrameXPath(frameId));
    }

    /**
     * Enters text into the text area inside an iframe.
     *
     * @param text - The text to be entered into the iframe's text area.
     * @returns {Promise<void>} Resolves once the text has been filled in the iframe's text area.
     */
    async enterTextInIFrameTextArea(text: string): Promise<void> {
        await playwrightActions.waitAndClearInputBox(this.getInputTextBoxXPath);
        await playwrightActions.waitAndFillInputBoxSequentially(this.getInputTextBoxXPath, text);
        this.filledInputText = text;
    }

    /**
     * Verifies that the filled text inside the iframe's text area matches the expected value.
     *
     * @returns {Promise<void>} Resolves once the verification is complete.
     */
    async verifyTextInIFrameTextArea(): Promise<void> {
        const actualText = await playwrightActions.waitAndGetInnerText(this.getInputTextBoxXPath);
        expect(actualText).toBe(this.filledInputText);
    }

    /**
     * Clicks on the Playwright Testing link or button in the iframe.
     *
     * @returns {Promise<void>} Resolves once the Playwright Testing link has been clicked.
     */
    async navigateToPlaywrightTesting(): Promise<void> {
        await playwrightActions.waitAndClick(this.getPlaywrightTestingXPath);
    }

    /**
     * Validates that the user has successfully navigated to the Playwright Testing page.
     *
     * @returns {Promise<void>} Resolves once the page heading is validated.
     */
    async validateUserNavigatedToPlaywrightTesting(): Promise<void> {
        const actual = await playwrightActions.waitAndGetInnerText(this.getPageHeadingXPath);
        expect(actual).toContain("Getting Started");
    }
}

export default new PocUiPage();