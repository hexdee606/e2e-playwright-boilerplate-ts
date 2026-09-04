/**
 * Deterministic mocked authentication page for security and resilience scenarios.
 * Credentials are generated at runtime and are never logged or asserted by value.
 */
import { Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { PlaywrightActions } from "@PlaywrightActions";

export type MockLoginBehavior = "success" | "server-error" | "transient-error";

class MockSecurityPage {
    private readonly usernameSelector = "#mock-username";
    private readonly passwordSelector = "#mock-password";
    private readonly submitSelector = "#mock-login-submit";
    private readonly statusSelector = "[data-testid='mock-login-status']";

    constructor(
        private readonly actions: PlaywrightActions = new PlaywrightActions(),
    ) {}

    async open(page: Page, behavior: MockLoginBehavior): Promise<void> {
        let attempts = 0;
        await page.route("**/mock.local/mock-api/login", async (route) => {
            attempts += 1;
            const requestBody = route.request().postDataJSON() as Record<
                string,
                unknown
            > | null;
            const hasCredentials =
                typeof requestBody?.username === "string" &&
                requestBody.username.length > 0 &&
                typeof requestBody.password === "string" &&
                requestBody.password.length > 0;

            if (
                !hasCredentials ||
                behavior === "server-error" ||
                (behavior === "transient-error" && attempts === 1)
            ) {
                await route.fulfill({
                    status: 500,
                    contentType: "application/json",
                    body: JSON.stringify({
                        message: "Authentication service unavailable",
                    }),
                });
                return;
            }

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ authenticated: true }),
            });
        });

        await page.setContent(`
            <main>
                <h1>Mock Secure Login</h1>
                <form id="mock-login-form">
                    <label for="mock-username">Username</label>
                    <input id="mock-username" autocomplete="username" />
                    <label for="mock-password">Password</label>
                    <input id="mock-password" type="password" autocomplete="current-password" />
                    <button id="mock-login-submit" type="submit">Sign in</button>
                </form>
                <p data-testid="mock-login-status" role="status"></p>
            </main>
            <script>
                const form = document.querySelector('#mock-login-form');
                const status = document.querySelector('[data-testid="mock-login-status"]');
                form.addEventListener('submit', async event => {
                    event.preventDefault();
                    let attempt = 0;
                    async function submit() {
                        attempt += 1;
                        const response = await fetch('https://mock.local/mock-api/login', {
                            method: 'POST',
                            headers: {'content-type': 'application/json'},
                            body: JSON.stringify({
                                username: document.querySelector('#mock-username').value,
                                password: document.querySelector('#mock-password').value
                            })
                        });
                        if (response.ok) {
                            status.textContent = 'Signed in securely';
                        } else if (attempt < 2) {
                            await submit();
                        } else {
                            status.textContent = 'Unable to sign in. Please try again later.';
                        }
                    }
                    await submit();
                });
            </script>
        `);
        await this.actions.setPage(page);
    }

    async enterCredentials(): Promise<void> {
        await this.actions.waitAndFillSensitiveInput(
            this.usernameSelector,
            `mock-user-${Date.now()}`,
        );
        await this.actions.waitAndFillSensitiveInput(
            this.passwordSelector,
            randomUUID(),
        );
    }

    async submit(): Promise<void> {
        await this.actions.waitAndClick(this.submitSelector);
    }

    async status(page: Page): Promise<string> {
        return (
            (await page.locator(this.statusSelector).textContent())?.trim() ??
            ""
        );
    }
}

export { MockSecurityPage };
export default new MockSecurityPage();
