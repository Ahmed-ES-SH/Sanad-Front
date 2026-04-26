import axios from "axios";
import { instance } from "../axios";
import { PAYMENTS_ENDPOINTS } from "@/app/constants/endpoints";
import { CartItemType } from "@/app/types/cart";

/**
 * Response from creating a payment intent.
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

/**
 * Creates a payment intent for checkout.
 */
export const createPaymentIntent = async (
  total: number,
  items: CartItemType[],
): Promise<PaymentIntentResponse> => {
  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("Cart total must be greater than 0 before payment.");
  }

  const itemLabels = items
    .map((item) => item.serviceTitle ?? item.title ?? item.serviceId)
    .filter((label) => label.trim().length > 0);

  const description = `Sanad Services: ${itemLabels.join(", ")}`;

  let response;
  try {
    response = await instance.post(PAYMENTS_ENDPOINTS.CREATE_INTENT, {
      amount: total,
      currency: "usd",
      description: description.substring(0, 255),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error(
          "Invalid payment data. Please review your cart and try again.",
        );
      }
      if (status === 401) {
        throw new Error(
          "Your session has expired. Please sign in and try again.",
        );
      }
      if (status === 502) {
        throw new Error(
          "Payment gateway is temporarily unavailable. Please retry.",
        );
      }
    }
    throw new Error("Unable to start payment. Please try again.");
  }

  return {
    clientSecret: response.data.clientSecret,
    paymentId: response.data.paymentId,
  };
};
