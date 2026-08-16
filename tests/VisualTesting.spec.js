import { page, test, expect } from "@playwright/test";
import path from "path";

test("Screeenshot", async ({ page }) => {
  await page.goto("https:rahulshettyacademy.com/automationpractice");
  await page.screenshot({ path: "screenshot.jpg" });
  await page
    .locator("#displayed-text")
    .screenshot({ path: "partialscreenshot.jpg" });
});

test.only("Visibility Test", async ({ page }) => {
  await page.goto("https://google.com");
  expect(await page.screenshot()).toMatchSnapshot("landing.png");
});
