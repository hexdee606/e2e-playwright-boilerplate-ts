import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
    // ─────────────────────────────────────────────
    // Global ignores
    // ─────────────────────────────────────────────
    {
        ignores: [
            "node_modules/**",
            "out/**",
            "playwright-report/**",
            "test-results/**",
            "allure-results/**",
            "allure-report/**",
        ],
    },

    // ─────────────────────────────────────────────
    // JavaScript recommended rules
    // ─────────────────────────────────────────────
    js.configs.recommended,

    // ─────────────────────────────────────────────
    // TypeScript recommended rules
    // ─────────────────────────────────────────────
    ...tseslint.configs.recommended,

    // ─────────────────────────────────────────────
    // Node.js scripts (.mjs)
    // ─────────────────────────────────────────────
    {
        files: ["**/*.mjs"],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // ─────────────────────────────────────────────
    // TypeScript
    // ─────────────────────────────────────────────
    {
        files: ["**/*.ts", "**/*.tsx"],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },

    // ─────────────────────────────────────────────
    // Playwright
    // ─────────────────────────────────────────────
    {
        files: ["**/*.ts", "**/*.tsx"],

        plugins: {
            playwright,
        },

        rules: {
            ...playwright.configs["flat/recommended"].rules,
        },
    },

    // ─────────────────────────────────────────────
    // Playwright-BDD step definitions
    //
    // Assertions are intentionally outside the
    // generated Playwright test block.
    // ─────────────────────────────────────────────
    {
        files: ["src/**/step_definitions/**/*.ts"],

        rules: {
            "playwright/no-standalone-expect": "off",
        },
    },

    // ─────────────────────────────────────────────
    // Framework helper layer
    //
    // These utilities intentionally wrap Playwright
    // APIs and are not themselves test specifications.
    // ─────────────────────────────────────────────
    {
        files: [
            "utilities/**/*.ts",
            "src/**/pages/**/*.ts",
            "src/**/services/**/*.ts",
        ],

        rules: {
            "playwright/no-unused-locators": "off",
            "playwright/no-useless-await": "off",
            "playwright/prefer-web-first-assertions": "off",
        },
    },
);