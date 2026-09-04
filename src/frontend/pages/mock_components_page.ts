/**
 * Deterministic UI component fixture for select, checkbox, and dialog flows.
 * It uses page-local markup so component scenarios do not depend on a public site.
 */
import { expect, Page } from "@playwright/test";
import playwrightActions from "@PlaywrightActions";

class MockComponentsPage {
    async open(page: Page): Promise<void> {
        await page.setContent(`
            <main>
                <h1>Mock Component Gallery</h1>
                <label for="country">Country</label>
                <select id="country">
                    <option value="">Choose a country</option>
                    <option value="us">United States</option>
                    <option value="in">India</option>
                </select>
                <label><input id="terms" type="checkbox" /> Accept terms</label>
                <button id="open-dialog" type="button">Open dialog</button>
                <dialog id="component-dialog"><p>Component dialog opened</p></dialog>
            </main>
            <script>
                document.querySelector('#open-dialog').addEventListener('click', () => {
                    document.querySelector('#component-dialog').showModal();
                });
            </script>
        `);
        await playwrightActions.setPage(page);
    }

    async selectCountry(country: string): Promise<void> {
        await playwrightActions.waitAndSelectOption("#country", country);
    }

    async acceptTerms(): Promise<void> {
        await playwrightActions.waitAndCheck("#terms");
    }

    async openDialog(): Promise<void> {
        await playwrightActions.waitAndClick("#open-dialog");
    }

    async verifyComponents(page: Page, country: string): Promise<void> {
        await expect(page.locator("#country")).toHaveValue(country);
        await expect(page.locator("#terms")).toBeChecked();
        await expect(page.locator("#component-dialog")).toBeVisible();
        await expect(page.locator("#component-dialog")).toContainText(
            "Component dialog opened",
        );
    }
}

export default new MockComponentsPage();
