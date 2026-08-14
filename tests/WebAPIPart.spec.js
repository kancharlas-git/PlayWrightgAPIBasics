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

test("Place Order", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);
  const apiContext = await request.newContext();
  const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data: orderPayLoad,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );
  expect(orderResponse.ok()).toBeTruthy();
  const orderResponseJson = await orderResponse.json();
  console.log("Order response is " + orderResponseJson);
  orderId = orderResponseJson.orders[0];
  console.log(`order if is ${orderId}`);

  await page.goto("https://rahulshettyacademy.com/client");

  await page.locator("[routerlink='/dashboard/myorders']").nth(0).click();
  await page.locator(".table-bordered").waitFor();

  const orderList = await page.locator(".table-bordered tbody tr th");
  console.log(await orderList.count());

  for (let i1 = 0; i1 < (await orderList.count()); i1++) {
    console.log(await orderList.nth(i1).textContent());
    if (await orderId.includes(await orderList.nth(i1).textContent())) {
      console.log("GOing to click view....");
      await orderList
        .nth(i1)
        .locator("..")
        .locator("button:has-text('View')")
        .click();
      break;
    }
  }
});
