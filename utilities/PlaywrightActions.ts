/*
  ================================================================
  PlaywrightActions Class - TypeScript Utility for Web Automation
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-16
  Description: This class provides a set of utility functions for interacting
               with web elements in a Playwright testing or automation environment.
               It includes methods for checking the visibility, state, and interaction
               readiness of elements, as well as performing actions like clicking,
               selecting options, and uploading/downloading files.

               Features:
                 - Check if an element is enabled, hidden, or visible.
                 - Perform keyboard shortcuts and key presses on elements.
                 - Interact with dropdown elements and select options.
                 - Download files triggered by clicking on elements.
                 - Upload files to a page using file input elements.
                 - Built-in error handling to ensure robustness in case of failures.
                 - Strict TypeScript support for better type safety.

  Notes:
    - Methods ensure proper element visibility before interacting.
    - Includes actions like clicks, keyboard input, and file handling.
    - Error handling provides context on failures, aiding in debugging.
    - This class requires Playwright's API for browser interaction and automation.

  ================================================================
*/

import {
    ElementHandle,
    expect,
    Frame,
    FrameLocator,
    Locator,
    Page,
} from "@playwright/test";
import {
    installConsoleRedaction,
    redactSensitiveText,
    redactValue,
    registerSensitiveValue,
    secureError,
} from "@SecureDiagnostics";

installConsoleRedaction();

export enum keyboardShortcuts {
    selectAll = "Control+A",
    copy = "Control+C",
    paste = "Control+V",
    cut = "Control+X",
    undo = "Control+Z",
    redo = "Control+Y",
    openDevTools = "Control+Shift+I",
    refresh = "Control+R",
    reload = "Control+Shift+R",
    openNewTab = "Control+T",
    closeTab = "Control+W",
    switchTabNext = "Control+Tab",
    switchTabPrevious = "Control+Shift+Tab",
    focusAddressBar = "Control+L",
    takeScreenshot = "Control+Shift+S",
}

export class PlaywrightActions {
    protected page: Page | null;
    protected frameLocator: Frame | FrameLocator | null | undefined;

    constructor() {
        this.page = null;
        this.frameLocator = null;
    }

    private safeSelector(selector: string): string {
        return redactSensitiveText(selector);
    }

    private safeValue(value: unknown): string {
        return JSON.stringify(redactValue(value));
    }

    private async setInputValueWithoutPlaywrightValueLogging(
        element: Locator,
        value: string,
    ): Promise<void> {
        registerSensitiveValue(value);
        await element.evaluate((node, secretValue) => {
            const input = node as HTMLInputElement | HTMLTextAreaElement;
            input.focus();
            input.value = secretValue;
            input.dispatchEvent(
                new InputEvent("input", {
                    bubbles: true,
                    data: null,
                    inputType: "insertText",
                }),
            );
            input.dispatchEvent(new Event("change", { bubbles: true }));
        }, value);
    }

    /**
     * Sets the page object for the handler.
     * @param page - The Page object to set.
     * @throws Will throw an error if the page cannot be set.
     */
    async setPage(page: Page): Promise<void> {
        try {
            this.page = page;
            this.frameLocator = null;
        } catch (error) {
            console.error("Error setting page:", error);
            throw new Error("Failed to set the page.", { cause: error }); // Providing more context on failure
        }
    }

    /**
     * Sets the frame locator using a CSS selector for the frame.
     * @param frameSelector - The CSS selector of the frame.
     * @throws Will throw an error if frameLocator cannot be set.
     */
    async setFrameLocator(frameSelector: string): Promise<void> {
        try {
            // Try using frameLocator directly
            this.frameLocator = this.page?.frameLocator(frameSelector);

            // If frameLocator is not available, fall back to locator().contentFrame()
            if (!this.frameLocator) {
                const locator = this.page?.locator(frameSelector);
                if (locator) {
                    this.frameLocator = await locator.contentFrame();
                }
            }

            if (!this.frameLocator) {
                throw new Error(
                    "Unable to find the frame using the given selector.",
                );
            }
        } catch (error) {
            console.error("Error setting frame:", error);
            throw new Error("Failed to set frame locator.", { cause: error }); // Provide clearer error message
        }
    }

    /**
     * Returns shared actions to the main page context after iframe work.
     */
    async resetFrameLocator(): Promise<void> {
        this.frameLocator = null;
    }

    /**
     * Retrieves the frame or page, depending on the current setup.
     * @returns The current frame or the main page.
     * @throws Will throw an error if page is not set.
     */
    async getFrame(): Promise<Page | Frame | FrameLocator> {
        if (!this.page) {
            throw new Error("Please set the page first");
        }
        if (!this.frameLocator) {
            return this.page;
        } else {
            return this.frameLocator;
        }
    }

    /**
     * Navigates to a specified URL.
     * @param url - The URL to navigate to.
     * @throws Will throw an error if the navigation fails.
     */
    async goto(url: string): Promise<void> {
        try {
            await this.page?.goto(url, {
                waitUntil: "load",
                timeout: 1000,
            });
        } catch (error) {
            console.error("Error navigating to URL:", error);
            throw new Error(
                "Navigation failed to URL: " + redactSensitiveText(url),
                { cause: error },
            );
        }
    }

    /**
     * Retrieves the count of elements matching the provided selector.
     * @param selector - The CSS selector to match elements.
     * @returns The count of matching elements.
     * @throws Will throw an error if element count retrieval fails.
     */
    async getElementCount(selector: string): Promise<number> {
        try {
            const frame = await this.getFrame();
            return await frame.locator(selector).count();
        } catch (error) {
            console.error(
                `Error getting element count for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve element count for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            );
        }
    }

    /**
     * Waits for a checkbox to be visible, checks it if not already checked.
     * @param selector - The CSS selector of the checkbox.
     * @throws Will throw an error if interacting with the checkbox fails.
     */
    async waitAndCheck(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();

            // Check if it's not already checked, then check it
            if (!(await element.isChecked())) {
                await element.check();
            }
            await expect(element).toBeChecked();
        } catch (error) {
            console.error(
                `Error interacting with checkbox for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check the checkbox for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            );
        }
    }

    /**
     * Waits for a checkbox to be visible, unchecks it if currently checked.
     * @param selector - The CSS selector of the checkbox.
     * @throws Will throw an error if interacting with the checkbox fails.
     */
    async waitAndUncheck(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();

            // Uncheck if it's currently checked
            if (await element.isChecked()) {
                await element.uncheck();
            }

            await expect(element).not.toBeChecked();
        } catch (error) {
            console.error(
                `Error interacting with checkbox for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to uncheck the checkbox for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            );
        }
    }

    /**
     * Waits for an element to be visible and clicks on it.
     * @param selector - The CSS selector of the element to click.
     * @throws Will throw an error if the element cannot be clicked.
     */
    async waitAndClick(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.click();
        } catch (error) {
            console.error(
                `Error interacting with button for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to click the element for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            );
        }
    }

    /**
     * Waits for an element to be visible and double clicks on it.
     * @param selector - The CSS selector of the element to double-click.
     * @throws Will throw an error if the element cannot be double-clicked.
     */
    async waitAndDoubleClick(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.dblclick();
        } catch (error) {
            console.error(
                `Error interacting with element for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to double-click the element for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            );
        }
    }

    /**
     * Clears the content of an input box after waiting for it to be visible and editable.
     * @param selector - The CSS selector of the input element.
     * @throws Will throw an error if clearing the input box fails.
     */
    async waitAndClearInputBox(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.isEditable(); // Optional depending on the element type
            await element.clear(); // Clear the input box
        } catch (error) {
            console.error(
                `Error clearing input box for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to clear input box for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Fills an input box with a specified value after clearing its content.
     * @param selector - The CSS selector of the input element.
     * @param value - The value to fill in the input box.
     * @throws Will throw an error if filling the input box fails.
     */
    async waitAndFillInputBox(selector: string, value: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();

            // Ensure the element is enabled and editable before clearing and filling
            await element.isEnabled();
            await element.isEditable(); // Optional depending on the element type
            await element.clear(); // Clear the input box
            await element.fill(value); // Fill the input box with the value
        } catch (error) {
            console.error(
                `Error filling input box for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to fill input box for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Fills a sensitive field without exposing its value in diagnostics.
     * Use this for passwords, tokens, OTPs, recovery codes, and personal data.
     */
    async waitAndFillSensitiveInput(
        selector: string,
        value: string,
    ): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.isEditable();
            await this.setInputValueWithoutPlaywrightValueLogging(
                element,
                value,
            );
        } catch {
            throw new Error(
                `Failed to fill sensitive input for selector: ${this.safeSelector(selector)}`,
            );
        }
    }

    /**
     * Fills a sensitive field from a process environment variable.
     * Secret values must be supplied by a local secret store or CI secret.
     */
    async waitAndFillSensitiveInputFromEnv(
        selector: string,
        environmentVariable: string,
    ): Promise<void> {
        const value = process.env[environmentVariable];
        if (!value) {
            throw new Error(
                `Required secret environment variable is missing: ${this.safeSelector(environmentVariable)}`,
            );
        }
        await this.waitAndFillSensitiveInput(selector, value);
    }

    /**
     * Types sensitive input sequentially without including the value in errors.
     * Prefer waitAndFillSensitiveInput unless key-by-key events are required.
     */
    async waitAndTypeSensitiveInput(
        selector: string,
        value: string,
    ): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.isEditable();
            await this.setInputValueWithoutPlaywrightValueLogging(
                element,
                value,
            );
        } catch {
            throw new Error(
                `Failed to type sensitive input for selector: ${this.safeSelector(selector)}`,
            );
        }
    }

    /**
     * Clears a sensitive field without reading or reporting its current value.
     */
    async waitAndClearSensitiveInput(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.isEditable();
            await element.clear();
        } catch {
            throw new Error(
                `Failed to clear sensitive input for selector: ${this.safeSelector(selector)}`,
            );
        }
    }

    /**
     * Types a value into an input box sequentially with an optional delay between key presses.
     * @param selector - The CSS selector of the input element.
     * @param value - The value to type into the input box.
     * @param delay - The optional delay (in ms) between key presses (default is 100ms).
     * @throws Will throw an error if typing sequentially in the input box fails.
     */
    async waitAndFillInputBoxSequentially(
        selector: string,
        value: string,
        delay: number = 100,
    ): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEditable();

            // Type the value sequentially with a delay
            await element.pressSequentially(value, { delay: delay });
        } catch (error) {
            console.error(
                `Error typing in input box sequentially for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to type in input box sequentially for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Retrieves the value of an attribute for an element.
     * @param selector - The CSS selector of the element.
     * @param attribute - The name of the attribute to retrieve.
     * @returns The value of the attribute, or null if not found.
     * @throws Will throw an error if the attribute cannot be retrieved.
     */
    async waitAndGetAttributeValue(
        selector: string,
        attribute: string,
    ): Promise<string | null> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.getAttribute(attribute);
        } catch (error) {
            console.error(
                `Error getting attribute "${this.safeSelector(attribute)}" for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve attribute "${this.safeSelector(attribute)}" for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Hovers over an element after waiting for it to be visible and enabled.
     * @param selector - The CSS selector of the element to hover over.
     * @throws Will throw an error if hovering fails.
     */
    async waitAndHover(selector: string): Promise<void> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.isEnabled();
            await element.hover();
        } catch (error) {
            console.error(
                `Error hovering over element for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to hover over element for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Gets the inner HTML of an element after ensuring it is visible.
     * @param selector - The CSS selector of the element.
     * @returns The inner HTML of the element.
     * @throws Will throw an error if retrieving the inner HTML fails.
     */
    async waitAndGetInnerHtmlText(selector: string): Promise<string> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.innerHTML();
        } catch (error) {
            console.error(
                `Error getting inner HTML for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve inner HTML for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Gets the inner text of an element after ensuring it is visible.
     * @param selector - The CSS selector of the element.
     * @returns The inner text of the element.
     * @throws Will throw an error if retrieving the inner text fails.
     */
    async waitAndGetInnerText(selector: string): Promise<string> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.innerText();
        } catch (error) {
            console.error(
                `Error getting inner text for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve inner text for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Gets the input value of an element after ensuring it is visible.
     * @param selector - The CSS selector of the input element.
     * @returns The input value of the element.
     * @throws Will throw an error if retrieving the input value fails.
     */
    async waitAndGetInputValue(selector: string): Promise<string> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.inputValue();
        } catch (error) {
            console.error(
                `Error getting input value for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve input value for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Gets all inner text values from multiple elements matching the selector.
     * @param selector - The CSS selector of the elements.
     * @returns An array of inner text values for all matching elements.
     * @throws Will throw an error if retrieving the inner texts fails.
     */
    async waitAndGetAllInnerText(selector: string): Promise<string[]> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.allInnerTexts();
        } catch (error) {
            console.error(
                `Error getting all inner texts for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to retrieve inner texts for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if a checkbox or radio button is checked.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is checked.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isChecked(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.isChecked();
        } catch (error) {
            console.error(
                `Error checking the state of checkbox for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check the state of checkbox for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if an element is disabled.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is disabled.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isDisabled(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.isDisabled();
        } catch (error) {
            console.error(
                `Error checking if element is disabled for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check if element is disabled for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if an element is editable.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is editable.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isEditable(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.isEditable();
        } catch (error) {
            console.error(
                `Error checking if element is editable for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check if element is editable for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if an element is enabled.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is enabled.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isEnabled(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            return await element.isEnabled();
        } catch (error) {
            console.error(
                `Error checking if element is enabled for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check if element is enabled for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if an element is hidden.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is hidden.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isHidden(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            return await element.isHidden();
        } catch (error) {
            console.error(
                `Error checking if element is hidden for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check if element is hidden for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Checks if an element is visible.
     * @param selector - The CSS selector of the element.
     * @returns A boolean indicating if the element is visible.
     * @throws Will throw an error if checking the element's state fails.
     */
    async isVisible(selector: string): Promise<boolean> {
        try {
            const frame = await this.getFrame();
            const element = frame.locator(selector);
            return await element.isVisible();
        } catch (error) {
            console.error(
                `Error checking if element is visible for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to check if element is visible for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Performs a keyboard shortcut action on the given element after ensuring it is visible.
     * @param selector - The CSS selector of the element.
     * @param shortcut - The keyboard shortcut to be pressed.
     * @throws Will throw an error if the keyboard shortcut action fails.
     */
    async waitAndKeyboardShortcuts(
        selector: string,
        shortcut: keyboardShortcuts,
    ): Promise<void> {
        try {
            // Get the frame context where the element is located
            const frame = await this.getFrame();
            const element = frame.locator(selector);

            // Wait for the element to be visible and interactable
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.click(); // Click to focus the element before pressing the shortcut

            // Perform the keyboard shortcut
            await this.page?.keyboard.press(shortcut);
        } catch (error) {
            console.error(
                `Error performing keyboard shortcut for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to perform keyboard shortcut for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Presses one or more keys sequentially on the given element after ensuring it is visible.
     * @param selector - The CSS selector of the element.
     * @param keys - The key(s) to be pressed. It can be a string (for a single key) or an array (for multiple keys).
     * @throws Will throw an error if the key press action fails.
     */
    async waitAndPressKey(
        selector: string,
        keys: string | string[],
    ): Promise<void> {
        try {
            // Get the frame context where the element is located
            const frame = await this.getFrame();
            const element = frame.locator(selector);

            // Wait for the element to be visible and interactable
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();
            await element.click(); // Click to focus the element before pressing the keys

            // Ensure keys is an array to handle both single and multiple key presses
            const keyArray = Array.isArray(keys) ? keys : [keys];

            // Press each key in the array sequentially
            for (const key of keyArray) {
                await this.page?.keyboard.press(key);
            }
        } catch (error) {
            console.error(
                `Error pressing keys for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to press keys for selector: ${this.safeSelector(selector)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Waits for the element to be visible, interacts with it, and selects an option from a dropdown.
     * @param selector - The CSS selector of the select element.
     * @param option - The option(s) to be selected. This can be a string, an array of strings, an ElementHandle, or an array of ElementHandles.
     * @throws Will throw an error if the element cannot be selected or the option is invalid.
     */
    async waitAndSelectOption(
        selector: string,
        option:
            | null
            | string
            | ElementHandle
            | Array<string>
            | object
            | Array<ElementHandle>
            | Array<object>,
    ): Promise<void> {
        try {
            // Get the frame context where the element is located
            const frame = await this.getFrame();
            const element = frame.locator(selector);

            // Wait for the element to be visible and interactable
            await element.waitFor({ state: "visible" });
            await element.scrollIntoViewIfNeeded();

            // Select the option(s)
            await element.selectOption(option);
        } catch (error) {
            console.error(
                `Error selecting option for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw new Error(
                `Failed to select option for selector: ${this.safeSelector(selector)} with option: ${this.safeValue(option)}`,
                { cause: error },
            ); // Provide more context
        }
    }

    /**
     * Downloads a file by clicking the specified element and waiting for the download event.
     *
     * @param {string} selector - The selector for the element that initiates the download.
     * @param {string} [downloadPath='../downloads'] - The path where the downloaded file will be saved.
     * @returns {Promise<string>} - The path to the downloaded file.
     * @throws Will throw an error if the download fails.
     */
    async waitAndDownloadFile(
        selector: string,
        downloadPath: string = "../downloads",
    ): Promise<string> {
        try {
            // Wait for the download event
            const downloadPromise = this.page?.waitForEvent("download");

            // Click the element that triggers the download
            await this.waitAndClick(selector);

            // Wait for the download to complete
            const download = await downloadPromise;

            // Get the suggested filename and set the full download path
            const suggestedFilePath = `${downloadPath}/${download?.suggestedFilename()}`;

            // Save the downloaded file to the specified path
            await download?.saveAs(suggestedFilePath);

            return suggestedFilePath; // Return the path to the downloaded file
        } catch (error) {
            console.error(
                `Error downloading file for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw secureError(
                `Failed to download file for selector: ${this.safeSelector(selector)}`,
                error,
            );
        }
    }

    /**
     * Uploads a file or multiple files using a specified input element.
     *
     * @param {string} selector - The selector for the file input element.
     * @param {(string|string[])} filePath - The path(s) of the file(s) to upload. Can be a single file path or an array of paths.
     * @throws Will throw an error if the upload fails.
     */
    async waitAndUploadFile(
        selector: string,
        filePath: string | string[],
    ): Promise<void> {
        try {
            const frame = await this.getFrame();
            const input = frame.locator(selector);

            // Check if the filePath is an array or a single file path
            if (Array.isArray(filePath)) {
                await input.setInputFiles(filePath); // Upload multiple files
            } else {
                await input.setInputFiles(filePath); // Upload a single file
            }
        } catch (error) {
            console.error(
                `Error uploading file(s) for selector "${this.safeSelector(selector)}":`,
                error,
            );
            throw secureError(
                `Failed to upload file(s) for selector: ${this.safeSelector(selector)}`,
                error,
            );
        }
    }
}

export default new PlaywrightActions();
