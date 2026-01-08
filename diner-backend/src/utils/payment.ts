import Stripe from "stripe";

// Use the Stripe API version compatible with installed types
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export interface PaymentIntentData {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (
  data: PaymentIntentData
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency || "usd",
      metadata: data.metadata || {},
      payment_method_types: ["card"],
    });

    return paymentIntent;
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Payment processing failed");
  }
};

export const confirmPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Failed to confirm payment");
  }
};

export const refundPayment = async (
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> => {
  try {
    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Refund failed");
  }
};

