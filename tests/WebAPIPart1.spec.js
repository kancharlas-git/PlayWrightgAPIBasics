import { test, expect, request } from "@playwright/test";
import { APIUtils } from "./Utils/APIUtils.js";

const loginPayload = {
  userEmail: "rk.sheela@gmail.com",
  userPassword: "Vanaja@1",
};

const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }],
};

let token;
let orderId;
let apiUtils;

test.beforeAll("Fetch Login Token and Create Order", async () => {
  // Move context creation inside beforeAll to avoid top-level await syntax errors
  const apiContext = await request.newContext();
  apiUtils = new APIUtils(apiContext, loginPayload);

  // Added missing await keywords
  token = await apiUtils.getToken();
  orderId = await apiUtils.createOrder(orderPayLoad);

  console.log(`Token is: ${token}`);
  console.log(`Order ID is: ${orderId}`);
});

test("Place Order", async ({ page }) => {
  // Inject token into local storage before page load
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.locator("[routerlink='/dashboard/myorders']").first().click();
  await page.locator(".table-bordered").waitFor();

  const orderList = page.locator(".table-bordered tbody tr th");
  const count = await orderList.count();
  console.log(`Total orders found: ${count}`);

  for (let i = 0; i < count; i++) {
    const rowOrderId = await orderList.nth(i).textContent();

    if (orderId.includes(rowOrderId.trim())) {
      console.log("Going to click view...");
      await orderList
        .nth(i)
        .locator("xpath=ancestor::tr")
        .locator("button:has-text('View')")
        .click();
      break;
    }
  }
});
