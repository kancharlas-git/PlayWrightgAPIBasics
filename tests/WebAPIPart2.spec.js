import { test, expect } from "@playwright/test";
let webContext;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("rk.sheela@gmail.com");
  await page.locator("#userPassword").fill("Vanaja@1");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("Login", async ({ page }) => {
  const newPage = await webContext.newPage();
  await newPage.goto("https://rahulshettyacademy.com/client");
});
