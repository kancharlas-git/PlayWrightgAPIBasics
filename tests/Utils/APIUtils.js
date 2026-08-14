import { expect } from "@playwright/test";

export class APIUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
    this.token = "";
  }

  async getToken() {
    const apiResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload }
    );

    expect(apiResponse.ok()).toBeTruthy();

    const responseJson = await apiResponse.json();
    this.token = responseJson.token;
    console.log(`Token for login is: ${this.token}`);

    return this.token;
  }

  async createOrder(orderPayLoad) {
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayLoad,
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
        },
      }
    );

    expect(orderResponse.ok()).toBeTruthy();

    const orderResponseJson = await orderResponse.json();
    console.log("Order response JSON:", orderResponseJson);

    const orderId = orderResponseJson.orders[0];
    console.log(`Created Order ID: ${orderId}`);

    return orderId;
  }
}
