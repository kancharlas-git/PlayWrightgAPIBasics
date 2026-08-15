import { test, expect } from "@playwright/test";
let webContext;
test("Blocking JPG,JPEG Calls", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  page.route("**/*.{jpg,jpeg,png}", (route) => route.abort());
  page.on("request", (request) => {
    console.log(request.url());
  });
  page.on("response", (response) => {
    console.log(response.status(), response.url());
  });

  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("rk.sheela@gmail.com");
  await page.locator("#userPassword").fill("Vanaja@1");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});
