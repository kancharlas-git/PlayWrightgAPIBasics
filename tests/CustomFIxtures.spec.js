import { test, expect } from "@playwright/test";
import { customTest } from "./Utils/Fixtures.js";

customTest(
  "Fixtures Demo",
  async ({ authenticatedPage, createOrder, testDataForOrder }) => {
    await authenticatedPage.goto("https://rahulshettyacademy.com/client");
    await authenticatedPage
      .locator("[routerlink='/dashboard/myorders']")
      .nth(0)
      .click();
    await authenticatedPage.locator(".table-bordered").waitFor();
    await expect(
      authenticatedPage.getByText(createOrder.orderId)
    ).toBeVisible();
    console.log(testDataForOrder.productName);
  }
);
