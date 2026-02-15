import { http } from "./http";

export const sendMoney = (recipientEmail: string, amount: string) => {
  return http.post("/transfer", { recipientEmail, amount }).then(res => res.data);
};
