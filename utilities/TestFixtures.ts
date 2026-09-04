import {test as base} from "playwright-bdd";
import type {TestInfo} from "@playwright/test";
import {PlaywrightActions} from "@PlaywrightActions";
import {MockSecurityPage} from "../src/frontend/pages/mock_security_page";
import {installConsoleRedaction, redactValue} from "@SecureDiagnostics";

installConsoleRedaction();

type SecureAttachOptions = {
    body?: string | Buffer | object;
    contentType?: string;
    path?: string;
};

type EnterpriseFixtures = {
    actions: PlaywrightActions;
    mockSecurityPage: MockSecurityPage;
    secureAttach: (name: string, options: SecureAttachOptions) => Promise<void>;
};

async function secureAttach(testInfo: TestInfo, name: string, options: SecureAttachOptions): Promise<void> {
    const safeName = String(redactValue(name));

    if (options.path) {
        throw new Error(`Refusing to attach file "${safeName}" directly. Use sanitized body content instead.`);
    }

    const body = typeof options.body === "string" || Buffer.isBuffer(options.body)
        ? options.body
        : JSON.stringify(redactValue(options.body ?? {}), null, 2);

    await testInfo.attach(safeName, {
        body: typeof body === "string" ? String(redactValue(body)) : body,
        contentType: options.contentType ?? "text/plain"
    });
}

export const test = base.extend<EnterpriseFixtures>({
    actions: async ({}, use) => {
        await use(new PlaywrightActions());
    },
    mockSecurityPage: async ({actions}, use) => {
        await use(new MockSecurityPage(actions));
    },
    secureAttach: async ({}, use, testInfo) => {
        await use((name, options) => secureAttach(testInfo, name, options));
    }
});

export {expect} from "@playwright/test";
