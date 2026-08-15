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

test.only("UnAuthorized message for invalid order", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) => {
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6",
      });
    }
  );

  await page.locator("[routerlink='/dashboard/myorders']").nth(0).click();
  await page.locator(".table-bordered").waitFor();
  await page.getByRole("button", { name: "View" }).first().click();

  await expect(page.locator(".blink_me")).toHaveText(
    "You are not authorize to view this order"
  );
});

test("Order details for authorized access", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    async (route) => {
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a7f338721054ba465d324a6",
      });
    }
  );

  await page.locator("[routerlink='/dashboard/myorders']").nth(0).click();
  await page.locator(".table-bordered").waitFor();
  await page.getByRole("button", { name: "View" }).first().click();

  await expect(page.locator(".col-text")).toHaveText(
    "6a7f338721054ba465d324a6"
  );
});
