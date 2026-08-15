import { test, page, request, expect, browser } from "@playwright/test";

const loginPayload = {
  userEmail: "rk.sheela@gmail.com",
  userPassword: "Vanaja@1",
};

const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }],
};
let token;
let orderId;

const fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll("Fetch Login Token", async ({}) => {
  const apiContext = await request.newContext();
  const apiResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    { data: loginPayload }
  );

  console.log(`api response is ${apiResponse.json()}`);
  expect(apiResponse.ok()).toBeTruthy();
  const responseJson = await apiResponse.json();
  token = await responseJson.token;
  console.log(`Token for login is ${token}`);
});

test("Validate No Orders with network interception", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      const response = page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({ response, body });
    }
  );
  await page.locator("button[routerlink*='myorders']").click();
  console.log(await page.locator(".mt-4").textContent());
});
