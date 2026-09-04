/*
  ================================================================
  Browser Storage Manager - Playwright Utility for Cookies, LocalStorage, and SessionStorage
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-16
  Description: This class provides utility methods to manage browser
               storage (localStorage, sessionStorage, and cookies) in
               Playwright. It includes functions for retrieving, setting,
               removing, and clearing data across the page and its iframes.

               The class supports multiple storage types and dynamically
               handles storage interactions, ensuring compatibility with
               different environments (e.g., in-page or iframe contexts).

  ================================================================
*/
import {Page, Frame, BrowserContext} from '@playwright/test';
import {installConsoleRedaction, redactSensitiveText, secureError} from "@SecureDiagnostics";

installConsoleRedaction();

// Define a Cookie interface to match the expected structure of cookies
interface Cookie {
    name: string;
    value: string;
    url?: string;
    domain?: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
}

class BrowserStorageManager {
    /**
     * Retrieves all keys and their values from localStorage, including within iframes, and returns them as a JSON object.
     * @param {Page} page - The Playwright page object.
     * @param {string} [partialUrl=""] - A partial URL to identify the iframe.
     * @returns {Promise<Record<string, any>>} A promise that resolves to an object containing localStorage keys and values.
     */
    async getLocalStorage(page: Page, partialUrl: string = ""): Promise<Record<string, any>> {
        const frame = await this._getFrame(page, partialUrl);
        return await this._getStorage(frame, 'localStorage');
    }

    /**
     * Retrieves all keys and their values from sessionStorage, including within iframes, and returns them as a JSON object.
     * @param {Page} page - The Playwright page object.
     * @param {string} [partialUrl=""] - A partial URL to identify the iframe.
     * @returns {Promise<Record<string, any>>} A promise that resolves to an object containing sessionStorage keys and values.
     */
    async getSessionStorage(page: Page, partialUrl: string = ""): Promise<Record<string, any>> {
        const frame = await this._getFrame(page, partialUrl);
        return await this._getStorage(frame, 'sessionStorage');
    }

    /**
     * Retrieves all cookies from the browser context.
     * @param {BrowserContext} context - The Playwright browser context.
     * @returns {Promise<Cookie[]>} A promise that resolves to an array of cookies.
     */
    async getCookies(context: BrowserContext): Promise<Cookie[]> {
        try {
            const cookies = await context.cookies();
            return cookies as Cookie[];  // Ensure we return cookies in the correct type
        } catch (error) {
            throw secureError("Failed to retrieve cookies", error);
        }
    }

    /**
     * Sets a cookie in the browser context.
     * @param {BrowserContext} context - The Playwright browser context.
     * @param {Cookie} cookie - The cookie object to set.
     * @returns {Promise<void>} A promise that resolves once the cookie is set.
     */
    async setCookies(context: BrowserContext, cookie: Cookie): Promise<void> {
        try {
            await context.addCookies([cookie]);
        } catch (error) {
            throw secureError("Failed to set cookie", error);
        }
    }

    /**
     * Removes a cookie by name from the browser context.
     * @param {BrowserContext} context - The Playwright browser context.
     * @param {string} name - The name of the cookie to remove.
     * @returns {Promise<void>} A promise that resolves once the cookie is removed.
     */
    async removeCookie(context: BrowserContext, name: string): Promise<void> {
        try {
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === name);
            if (cookie) {
                await context.clearCookies();
            }
        } catch (error) {
            throw secureError(`Failed to remove cookie named ${redactSensitiveText(name)}`, error);
        }
    }

    /**
     * Clears all cookies in the browser context.
     * @param {BrowserContext} context - The Playwright browser context.
     * @returns {Promise<void>} A promise that resolves once all cookies are cleared.
     */
    async clearCookies(context: BrowserContext): Promise<void> {
        try {
            await context.clearCookies();
        } catch (error) {
            throw secureError("Failed to clear cookies", error);
        }
    }

    /**
     * Sets a key-value pair in either localStorage or sessionStorage, within a specified iframe or page.
     * @param {Frame | Page} frame - The Playwright frame or page object to interact with.
     * @param {'localStorage' | 'sessionStorage'} storageType - The type of storage to set ('localStorage' or 'sessionStorage').
     * @param {string} key - The key to set.
     * @param {any} value - The value to set.
     * @returns {Promise<void>} A promise that resolves once the value has been set.
     */
    async setStorage(frame: Frame | Page, storageType: 'localStorage' | 'sessionStorage', key: string, value: any): Promise<void> {
        try {
            await frame.evaluate(({storageType, key, value}) => {
                const storage = window[storageType];
                storage.setItem(key, JSON.stringify(value));
            }, {storageType, key, value});
        } catch (error) {
            throw secureError(`Failed to set ${storageType} item for key ${redactSensitiveText(key)}`, error);
        }
    }

    /**
     * Removes a key from either localStorage or sessionStorage, within a specified iframe or page.
     * @param {Frame | Page} frame - The Playwright frame or page object to interact with.
     * @param {'localStorage' | 'sessionStorage'} storageType - The type of storage to remove from ('localStorage' or 'sessionStorage').
     * @param {string} key - The key to remove.
     * @returns {Promise<void>} A promise that resolves once the value has been removed.
     */
    async removeStorage(frame: Frame | Page, storageType: 'localStorage' | 'sessionStorage', key: string): Promise<void> {
        try {
            await frame.evaluate(({storageType, key}) => {
                const storage = window[storageType];
                storage.removeItem(key);
            }, {storageType, key});
        } catch (error) {
            throw secureError(`Failed to remove ${storageType} item for key ${redactSensitiveText(key)}`, error);
        }
    }

    /**
     * Clears all items from either localStorage or sessionStorage, within a specified iframe or page.
     * @param {Frame | Page} frame - The Playwright frame or page object to interact with.
     * @param {'localStorage' | 'sessionStorage'} storageType - The type of storage to clear ('localStorage' or 'sessionStorage').
     * @returns {Promise<void>} A promise that resolves once all items have been cleared.
     */
    async clearStorage(frame: Frame | Page, storageType: 'localStorage' | 'sessionStorage'): Promise<void> {
        try {
            await frame.evaluate((storageType) => {
                const storage = window[storageType];
                storage.clear();
            }, storageType);
        } catch (error) {
            throw secureError(`Failed to clear ${storageType}`, error);
        }
    }

    /**
     * Retrieves all keys and their values from either localStorage or sessionStorage.
     * @param {Frame | Page} frame - The Playwright frame or page object to interact with.
     * @param {'localStorage' | 'sessionStorage'} storageType - The type of storage to retrieve ('localStorage' or 'sessionStorage').
     * @returns {Promise<Record<string, any>>} A promise that resolves to an object containing the storage keys and values.
     * @private
     */
    private async _getStorage(frame: Frame | Page, storageType: 'localStorage' | 'sessionStorage'): Promise<Record<string, any>> {
        try {
            return await frame.evaluate((storageType) => {
                const storage = window[storageType];
                return Array.from({length: storage.length}, (_, i) => {
                    const key = storage.key(i);
                    if (key !== null) { // Ensure key is not null
                        const value = storage.getItem(key);
                        return {[key]: value !== null ? JSON.parse(value) : null}; // Handle null values
                    }
                    return {}; // Skip if key is null
                }).reduce((acc, curr) => Object.assign(acc, curr), {});
            }, storageType);
        } catch (error) {
            throw secureError(`Failed to retrieve ${storageType} data`, error);
        }
    }

    /**
     * Switches to the iframe that contains the given partial URL, or returns the main page if no matching iframe is found.
     * @param {Page} page - The Playwright page object.
     * @param {string} partialUrl - A partial URL to identify the iframe.
     * @returns {Promise<Frame | Page>} A promise that resolves to the Playwright frame object or the main page.
     * @private
     */
    private async _getFrame(page: Page, partialUrl: string): Promise<Frame | Page> {
        try {
            if (partialUrl) {
                return await this._switchFrameByPartialUrl(page, partialUrl);
            }
            return page;
        } catch (error) {
            throw secureError(`Failed to switch to frame using URL fragment ${redactSensitiveText(partialUrl)}`, error);
        }
    }

    /**
     * Switches to the iframe that contains the given partial URL. If not found, returns the main page.
     * @param {Page} page - The Playwright page object.
     * @param {string} partialUrl - A unique part of the URL of the iframe to switch to.
     * @returns {Promise<Frame | Page>} A promise that resolves to the Playwright frame object if found, otherwise the main page.
     * @private
     */
    private async _switchFrameByPartialUrl(page: Page, partialUrl: string): Promise<Frame | Page> {
        const iframes = page.frames();
        const matchingFrame = iframes.find(frame => frame.url().includes(partialUrl));

        if (matchingFrame) {
            return matchingFrame;
        } else {
            console.warn(`Iframe containing URL part "${redactSensitiveText(partialUrl)}" not found. Returning the main page.`);
            return page;
        }
    }
}

// Export the instance of BrowserStorageManager to be used elsewhere
export default new BrowserStorageManager();
