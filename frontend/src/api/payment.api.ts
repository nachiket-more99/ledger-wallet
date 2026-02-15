import { http } from "./http";

export const createPayment = (amount: string) => {
  return http.post("/payment/create", { amount, provider: "MOCK_RAZORPAY" }).then(res => res.data);
};

export const webhook = (providerOrderId: string) => {
  return http.post("/payment/webhook", {providerOrderId}).then(res => res.data);
};
