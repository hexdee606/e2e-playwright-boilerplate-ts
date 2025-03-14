import {createBdd} from "playwright-bdd"

const {Given, When, Then} = createBdd();

Given(/^test step$/, async function ({page}) {
    await page.goto("https://www.google.com/");
});