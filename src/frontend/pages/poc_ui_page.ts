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
     * This is used to locate the dropdown menu for selecting a month in the calendar widget.
     *
     * @example
     * console.log(getDatePickerMonthXPath); // Output: "//select[@class='ui-datepicker-month']"
     */
    private readonly getDatePickerMonthXPath: string;

    /**
     * XPath selector for the year display element in the calendar.
     * This is used to get the year displayed in the calendar, for example, when navigating to a specific year.
     *
     * @example
     * console.log(getActualCalenderDateYearXPath); // Output: "//span[@class='ui-datepicker-year']"
     */
    private readonly getActualCalenderDateYearXPath: string;

    /**
     * XPath selector for the input text box in the UI.
     * This is used to locate and interact with the input field inside a form or a text box for entering information.
     *
     * @example
     * console.log(getInputTextBoxXPath); // Output: "//div[@class='rsw-ce']"
     */
    private readonly getInputTextBoxXPath: string;

    /**
     * Generates an XPath selector for an iframe based on the provided iframe ID.
     * This is used to locate and interact with an iframe element on the page by its ID.
     *
     * @param iFrameId - The ID of the iframe to be located.
     * @returns A string representing the XPath selector for the iframe.
     *
     * @example
     * console.log(getIFrameXPath("frame123")); // Output: "//iframe[@id='frame123']"
     */
    private readonly getIFrameXPath: (iFrameId: string) => string;

    /**
     * Stores the text that has been filled into an input text box.
     * This value is used for verification and comparison after filling in the input field.
     *
     * @example
     * filledInputText = "Sample Text"; // The filled input text is stored here.
     */
    private filledInputText: string;

    /**
     * XPath selector for the Playwright Testing link or button.
     * This is used to locate the UI element that leads to the Playwright Testing section or page.
     *
     * @example
     * console.log(getPlaywrightTestingXPath); // Output: "//a/p[text()='Playwright Testing']"
     */
    private readonly getPlaywrightTestingXPath: string;

    /**
     * XPath selector for the page heading element.
     * This is used to locate the main heading of the page, often used for validation or verification of correct navigation.
     *
     * @example
     * console.log(getPageHeadingXPath); // Output: "//div[contains(@class, 'theme-doc-markdown')]/h1"
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
     *
     * @example
     * await selectUiOption('Submit'); // Clicks the button or link with text 'Submit'.
     */
    async selectUiOption(option: string): Promise<void> {
        const optionXPath = this.getUiOptionXPath(option);
        await playwrightActions.waitAndClick(optionXPath);
    }

    /**
     * Parses a given date string into day, month (both as number and text), and year components.
     * Supports various date formats like 'DD MMM YYYY', 'MMM DD YYYY', 'DD/MM/YYYY', etc.
     *
     * @param inputDate - The date string to be parsed. It can be in any of the following formats:
     *                    - 'DD MMM YYYY' (e.g., '03 Mar 2025')
     *                    - 'MMM DD YYYY' (e.g., 'Mar 29 2025')
     *                    - 'DD/MM/YYYY' (e.g., '21/02/2025')
     *                    - 'DD MMMM YYYY' (e.g., '21 March 2025')
     *                    - 'DD MM YY' (e.g., '21 03 25')
     *                    - 'YYYY-MM-DD' (ISO 8601 Extended Format, e.g., '2025-03-29')
     *                    - 'YYYYMMDD' (ISO 8601 Basic Format, e.g., '20250329')
     * @returns An object containing:
     *          - day: The numeric day of the month.
     *          - month: The abbreviated textual representation of the month (e.g., 'Mar' for March).
     *          - year: The year (e.g., 2025).
     * @throws {Error} Throws an error if the input date format is invalid, specifying the supported formats.
     *
     * @example
     * const result = await getDateParts('2025-03-29');
     * console.log(result); // Output: { day: 29, monthNumber: '03', monthText: 'Mar', year: 2025 }
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
            const date = moment(inputDate, format, true); // Strict parsing
            if (date.isValid()) {
                return {
                    day: date.date(),
                    month: date.format('MMM'), // Abbreviated month (e.g., 'Mar')
                    year: date.year()
                };
            }
        }

        // If no valid format was found, throw an error with details on the accepted formats.
        throw new Error(`Invalid date format: '${inputDate}'. Supported formats are: ${formats.join(', ')}`);
    }

    /**
     * Navigates the calendar UI to the specified year.
     * If the current year in the calendar is not the same as the expected year,
     * the method will click the "Next" or "Prev" buttons to navigate accordingly.
     *
     * @param expectedYear - The year that the calendar should navigate to.
     * @param allowFutureDate - Optional flag to allow future dates (default: false).
     * @throws {Error} Throws an error if trying to navigate to a future year when not allowed.
     *
     * @example
     * await navigateToCalenderYear('2025'); // Navigates the calendar to 2025.
     */
    private async navigateToCalenderYear(expectedYear: string, allowFutureDate: boolean = false): Promise<void> {
        // Check if the future date is allowed and validate
        if (!allowFutureDate) {
            const currentYear = moment().year(); // Get the current year using moment.js
            if (Number(currentYear) < Number(expectedYear)) {
                throw new Error("You are trying to select a future date");
            }
        }

        // Get the actual year displayed in the calendar
        let actualCalenderYear: string = await playwrightActions.waitAndGetInnerText(this.getActualCalenderDateYearXPath);

        // Calculate the difference between the expected year and the actual displayed year
        const diff: number = Number(expectedYear) - Number(actualCalenderYear);

        // Navigate to the correct year if the difference is not zero
        if (diff !== 0) {
            // Assuming there's a way to click next/prev to navigate through years
            const nextButtonXPath = `//a[@title="Next"]`; // Example XPath for next year
            const prevButtonXPath = `//a[@title="Prev"]`; // Example XPath for previous year

            // Navigate the calendar to the expected year
            if (diff > 0) {
                // Move forward to the expected year
                for (let i = 0; i < diff; i++) {
                    await playwrightActions.waitAndSelectOption(this.getDatePickerMonthXPath, "Dec");
                    await playwrightActions.waitAndClick(nextButtonXPath);
                }
            } else if (diff < 0) {
                // Move backward to the expected year
                for (let i = 0; i < Math.abs(diff); i++) {
                    await playwrightActions.waitAndSelectOption(this.getDatePickerMonthXPath, "Jan");
                    await playwrightActions.waitAndClick(prevButtonXPath);
                }
            }
        }
    }

    /**
     * Selects a date from a date picker input on the UI by interacting with the calendar widget.
     * The method clicks the calendar input field, waits for the calendar to appear, and selects the appropriate day.
     *
     * @param date - The date to select. The date should be in a string format supported by the getDateParts method.
     *              For example, '2025-03-29' or '29 Mar 2025'.
     * @param labelText - The label of the date picker input field that needs to be clicked to open the calendar.
     * @returns {Promise<void>} Resolves once the date has been successfully selected in the calendar widget.
     *
     * @example
     * await selectDate('2025-03-29', 'Start Date'); // Selects March 29, 2025 in the 'Start Date' calendar input.
     */
    async selectDate(date: string, labelText: string): Promise<void> {
        // Parse the input date into day, month, and year
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
     *
     * @example
     * await switchFrame("frame123"); // Switches to the iframe with ID 'frame123'.
     */
    async switchFrame(frameId: string): Promise<void> {
        await playwrightActions.setFrameLocator(this.getIFrameXPath(frameId));
    }

    /**
     * Enters text into the text area inside an iframe.
     *
     * @param text - The text to be entered into the iframe's text area.
     * @returns {Promise<void>} Resolves once the text has been filled in the iframe's text area.
     *
     * @example
     * await enterTextInIFrameTextArea("Sample Text"); // Fills the iframe's text area with "Sample Text".
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
     *
     * @example
     * await verifyTextInIFrameTextArea(); // Verifies the text in the iframe's text area.
     */
    async verifyTextInIFrameTextArea(): Promise<void> {
        const actualText = await playwrightActions.waitAndGetInnerText(this.getInputTextBoxXPath);
        await expect(actualText).toBe(this.filledInputText);
    }

    /**
     * Clicks on the Playwright Testing link or button in the iframe.
     *
     * @returns {Promise<void>} Resolves once the Playwright Testing link has been clicked.
     *
     * @example
     * await navigateToPlaywrightTesting(); // Clicks the Playwright Testing link.
     */
    async navigateToPlaywrightTesting(): Promise<void> {
        await playwrightActions.waitAndClick(this.getPlaywrightTestingXPath);
    }

    /**
     * Validates that the user has successfully navigated to the Playwright Testing page.
     *
     * @returns {Promise<void>} Resolves once the page heading is validated.
     *
     * @example
     * await validateUserNavigatedToPlaywrightTesting(); // Verifies that the page heading matches.
     */
    async validateUserNavigatedToPlaywrightTesting(): Promise<void> {
        const actual = await playwrightActions.waitAndGetInnerText(this.getPageHeadingXPath);
        await expect(actual).toBe("Getting Started With Playwright Testing");
    }
}

export default new PocUiPage();
